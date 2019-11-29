class CatTreeController {
  constructor(dataService, $scope, $sce, Field, basicService, $rootScope,
              tableService, CommonCon, FigureService, toolService, pageService) {
    this.$sce = $sce;
    this.scope = $scope;
    this.root = $rootScope;
    this.tool = toolService;
    this.page = pageService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.figure = FigureService;
    this.dataService = dataService;
    this.tableService = tableService;

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);
  }

  init() {
    this.config = {
      fix: [
        {code: "categoryName", width: 190},
        {code: "categoryCode", width: 100}
      ],
      root: "nodes",
      headerWrap: true,
      other: {
        icon: true
      },
      pageId: this.keys.pageId,
      minWidth: this.keys.treeGridMinWidth ? this.keys.treeGridMinWidth : 135
    };

    // 调用接口的方法名字
    this.interfaceName = this.keys.categoryUrl
      ? this.keys.categoryUrl[1]
      : "getCategoryTreeForSale";

    // 监听共通条件的变动
    this.scope.$watch('ctrl.param', newVal => {
      if (!newVal) return;

      this.field.newTable = this.tool.SameRingSettingField(this.tool.calculateTableField(this.field.table),
        angular.copy(this.field.table.option));

      this.getData();

    });

    // 监听table指标变动
    this.scope.$watch('ctrl.field.table', newVal => {
      // 初始化时候的处理
      if (!newVal || !this.noInit) return;

      this.field.newTable = this.tool.SameRingSettingField(this.tool.calculateTableField(newVal), newVal.option);

      this.getData();
    });

    this.scope.$watch('ctrl.field.chart', newVal => {
      // 初始化时候的处理
      if (!newVal || !this.noInit) return;

      this.getData();
    });

  }

  getData() {
    this.config.finish = false;
    this.root.fullLoadingShow = true;

    const key = {
      pageId: this.keys.pageId
    };

    // 将param里面的数据映射到页面条件上
    this.root.$broadcast(this.CommonCon.session_key.sessionParam, this.param);

    const param = this.tool.buildParam(this.tool.getParam(this.param, this.field), key);
    this.basic.packager(this.dataService[this.interfaceName](param), res => {
      let data = res.data;

      // 遍历树 添加展开收起的属性
      const tree = {
        select: this.param.category.val,
        code: 'categoryCode'
      };

      data.forEach(s => this.tool.loopTree(...[tree, [s], []]));

      // 传入tree-grid组件的对象
      this.table = {data, field: this.field.newTable};

      this.noInit = true;
      this.keys.finish = true;
      this.root.fullLoadingShow = false;
    })
  }

}

angular.module('hs.supplier.saleStock').component('catTree', {
  templateUrl: 'app/supplier/subPage/directives/saleStock/cat/catTree.tpl.html',
  controller: CatTreeController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
