class supplierOverlapCtrl {
  constructor($sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder, $compile, FigureService, basicService, Field, toolService, popups) {
    this.$sce = $sce;
    this.scope = $scope;
    this.popups = popups;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;

    this.tabs = [
      {id: 1, name: '按销售库存', active: true},
      {id: 2, name: '按结构占比', active: false},
    ];

    // this.notstartingSku = this.$sce.trustAsHtml(`<span><span  style="font:bold 16px arial; line-height: 180%; color: #007ADB;">到货率：</span><br>
    //             <span><b>实到商品数/应到商品数</b></span></span>`);
    // this.eliminationRate = this.$sce.trustAsHtml(`<span><span  style="font:bold 16px arial; line-height: 180%; color: #007ADB;">退货率：</span><br>
    //             <span><b>退货商品金额/实到商品金额</b></span></span>`);

  }

  init() {}

}


angular.module("hs.supplier.adviser").controller("supplierOverlapCtrl", supplierOverlapCtrl);
