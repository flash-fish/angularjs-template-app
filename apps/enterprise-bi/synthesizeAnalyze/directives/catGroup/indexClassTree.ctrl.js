class IndexClassTreeCtrl {
  constructor(dataService, $scope, $sce, Field, basicService,
              tableService, FigureService, toolService, CommonCon, indexCompleteService, $rootScope) {
    this.$sce = $sce;
    this.scope = $scope;
    this.tool = toolService;
    this.basic = basicService;
    this.figure = FigureService;
    this.dataService = dataService;
    this.tableService = tableService;
    this.Field = Field;
    this.CommonCon = CommonCon;
    this.indexComplete = indexCompleteService;
    this.$rootScope = $rootScope;

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.purchase);

    this.indexPurchaseRadar = angular.copy(this.CommonCon.indexPurchaseRadar);
    this.indexOperationsRadar = angular.copy(this.CommonCon.indexOperationsRadar);
  }

  init() {
    this.config = {
      fix: [
        {code: "nodeName", width: 190},
      ],
      root: "nodes",
      index: {
        treeInterfaceName: this.name.tree,
        chartInterfaceName: this.name.chart,
        curName: this.name.curName,
        flag: this.name.tree == this.CommonCon.indexComplete.purchaseTree ? true : false,
        icon: true,
        invalidFieldColor: true
      }
    };

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

    // 树形表示的分类是没有图表设定的
    this.scope.$emit("tree-hide", true);
  }

  getData() {
    this.config.finish = false;

    // 将param里面的数据映射到页面条件上
    this.$rootScope.$broadcast(this.CommonCon.session_key.sessionParam, this.param);

    let param = this.tool.buildParam(this.tool.getParam(this.param, this.field), {noChart: true});

    //获取门店树时，移除参数里的classes
    if (this.name.tree == 'getStoreTreeForOperations' && param.condition.classes) {
      delete param.condition.classes
    }

    this.config.index.fields = param.fields;

    let purchaseRadarFields = this.indexPurchaseRadar.ra.value.concat(this.indexPurchaseRadar.kpi.value);
    let operationsRadarFields = this.indexOperationsRadar.ra.value.concat(this.indexOperationsRadar.kpi.value);

    let radarFields = this.name.tree == 'getStoreTreeForOperations' ? operationsRadarFields : purchaseRadarFields;

    // fields加上雷达图里包含的kpi
    radarFields.forEach(s => {
      const fields = angular.copy(this.config.index.fields);
      const len = fields.filter(d => {
        return d == s
      });
      if (!len.length) {
        this.config.index.fields.push(s)
      }
    });

    this.config.index.date = param.condition.date;
    this.config.index.condition = param.condition;
    param.pageId = this.name.tree == 'getStoreTreeForOperations'
      ? 'page_indexComplete_store'
      : 'page_indexComplete_buyer';

    delete param.condition.supplier;

    this.$rootScope.fullLoadingShow = true;

    this.basic.packager(this.dataService[this.name.tree](param), res => {

      //移除radar的session
      this.basic.getSession('radarIndex', true);

      let data = res.data ? [res.data] : [];

      this.selected = [];
      if (this.config.index.flag) {
        this.selected = this.param.classes.val;
      } else {
        const vals = this.param.store.val.length > 0
          ? 'store' : (this.param.district.val.length > 0 ? 'district'
            : (this.param.operation.val.length > 0
              ? 'operation'
              : (this.param.storeGroup.val.length > 0 ? 'storeGroup' : '')));
        if (vals) {
          this.selected = this.param[vals].val;
        }

      }

      if (data.length > 0) {
        // 遍历树 添加展开收起的属性
        const tree = {
          select: this.selected,
          code: 'nodeCode'
        };

        if (this.selected.length) {
          data.forEach(s => this.tool.loopTree(...[tree, [s], []]));
        } else {
          //默认都没选的时候 只展开一级
          this.indexComplete.expand(data, true);
        }
      }

      this.table = {
        data: data,
        field: this.field.newTable
      };

      this.keys.finish = true;
      this.show = false;
      this.noInit = true;
      this.$rootScope.fullLoadingShow = false;
    })
  }

}

angular.module('hs.synthesizeAnalyze').component('indexClassTree', {
  templateUrl: 'app/synthesizeAnalyze/directives/catGroup/indexClassTree.tpl.html',
  controller: IndexClassTreeCtrl,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    name: '<',//接口名字
    keys: '='
  }
});
