class StructuralTreeController {
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

    // 调用接口的方法名字
    this.interfaceName = "getSupplierStructurePctTree";

    // 所有指标的对照关系
    this.fieldInfo = angular.copy(Field.structure);

    this.config = {
      fix: [
        {code: "name", width: 380, title: "类别&供应商名称", sort: true}
      ],
      root: "nodes",
      other: {
        fieldName: 'structure',
        icon: true
      },
      sort: true,
      sortDir: 'desc'
    };

    this.field = [
      'supplierCnt', 'hsAmount', 'hsAmountPct', 'pctDiff', 'selfAmountPct', 'supplierSubAmount', 'supplierAllAmount'
    ];
  }

  init() {

    // 监听共通条件的变动
    this.scope.$watch('ctrl.param', newVal => {
      if (!newVal) return;

      this.getData();

    });
  }

  getData() {
    this.config.finish = false;
    this.root.fullLoadingShow = true;

    const key = {
      special: {
        noChart: true,
        pageId: this.keys.pageId
      }
    };

    // 将param里面的数据映射到页面条件上
    this.root.$broadcast(this.CommonCon.session_key.sessionParam, this.param);

    const param = this.tool.buildParam(this.tool.getParam(this.param, []), key);
    this.basic.packager(this.dataService[this.interfaceName](param), res => {
      let data = res.data;

      // 遍历树 添加展开收起的属性
      const tree = {
        select: [],
        code: 'name'
      };

      data.forEach(s => this.tool.loopTree(...[tree, [s], []]));


      this.table = {
        data: data,
        field: this.field
      };
      this.root.fullLoadingShow = false;
    })
  }
}

angular.module('hs.supplier.adviser').component('structuralTree', {
  templateUrl: 'app/supplier/analysis/directives/structuralRatio/structuralTree.tpl.html',
  controller: StructuralTreeController,
  controllerAs: 'ctrl',
  bindings: {
    param: "<",
    keys: "="
  }
});
