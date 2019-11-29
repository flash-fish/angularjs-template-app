class actGroupTreeController {
  constructor(dataService, $scope, $sce, Field, basicService, $rootScope,
              tableService, CommonCon, FigureService, toolService, pageService, indexCompleteService) {
    this.$sce = $sce;
    this.Field = Field;
    this.scope = $scope;
    this.root = $rootScope;
    this.tool = toolService;
    this.page = pageService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.tableService = tableService;
    this.indexService = indexCompleteService;

    // 调用接口的方法名字
    // this.interfaceName = "getClassTreeForSale";

    // 所有指标的对照关系 -- 自定义指标合并公共指标
    let mid_info = this.indexService.MergeField(this.Field.sale, this.Field.actAnalyze);
    this.fieldInfo = this.basic.buildField(mid_info);

    this.config = {
      fix: [
        {code: "className", width: 190},
        {code: "classCode", width: 100}
      ],
      root: "nodes",
      other: {icon: true}
    };
  }

  init() {

    // 初始化接口
    this.interfaceName = this.keys.catGroupUrl
      ? this.keys.catGroupUrl[1]
      : "getClassTreeForSale";

    // 监听共通条件的变动
    this.scope.$watch('ctrl.param', newVal => {

      if (!newVal) return;
      this.indexService.watchField(this,this.field.table,newVal);

      this.indexService.structureChart(this.field);

      this.getData();

    });

    // 监听table指标变动
    this.scope.$watch('ctrl.field.table', newVal => {
      // 初始化时候的处理
      if (!newVal || !this.noInit) return;

      this.scope.$watch('ctrl.param', s => {
        this.indexService.watchField(this,newVal,s);

      });


      this.getData();
    });

  }


  getData() {
    this.config.finish = false;
    this.config.actCompare = true;
    this.root.fullLoadingShow = true;

    const key = {
      special: {
        noChart: true,
        pageId: this.keys.pageId
      }
    };

    // 将param里面的数据映射到页面条件上
    this.root.$broadcast(this.CommonCon.session_key.sessionParam, this.param);


    const param = this.tool.buildParam(this.tool.getParam(this.param, this.field), key);
    this.basic.packager(this.dataService[this.interfaceName](param), res => {
      let data = res.data;

      // 遍历树 添加展开收起的属性
      const tree = {
        select: this.param.classes.val,
        code: 'classCode'
      };

      data.forEach(s => this.tool.loopTree(...[tree, [s], []]));


      // 活动分析页面ToT重构
      this.indexService.ToTTrans(this);

      this.table = {
        data: data,
        field: this.field.newTable
      };

      this.keys.finish = true;
      this.noInit = true;
      this.root.fullLoadingShow = false;
    })
  }

}

angular.module('hs.synthesizeAnalyze').component('actGroupTree', {
  templateUrl: 'app/synthesizeAnalyze/directives/component/activity/actGroup/actGroupTree.tpl.html',
  controller: actGroupTreeController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
