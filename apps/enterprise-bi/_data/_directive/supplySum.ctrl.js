class SupplySumController {
  constructor ($sce, $scope, $templateCache, CommonCon, FigureService) {
    this.scope = $scope;
    this.figure = FigureService;


    this.initTemp = [
      {
        name: '到货率',
        option: 'receiveQtyRate',
        icon: $sce.trustAsHtml($templateCache.get(CommonCon.templateCache.receiveQtyRate))
      },
      {name: '未到商品金额(万元)', option: 'nonAmount', isSale: true},
      {
        name: '退货率',
        option: 'returnAmountRate',
        icon: $sce.trustAsHtml($templateCache.get(CommonCon.templateCache.returnAmountRate))
      },
      {name: '退货成本(除税)(万元)', option: 'returnAmount', isSale: true},
    ];
  }

  init () {
    this.scope.$watch("ctrl.sum", newVal => {

      this.buildSum(newVal);
    })
  }


  /**
   * 处理合计部分数据
   * @param sum
   */
  buildSum(sum) {
    if (!sum) sum = {};

    this.initTemp.forEach(s => {
      if (s.isSale)
        s.title = `${this.figure.number(sum[s.option], false, true)}元`;

      s.value = s.isSale
        ? this.figure.number(sum[s.option], true, true)
        : this.figure.scale(sum[s.option], true, true);
    })
  }
}

angular.module('app.datas').component('supplySum', {
  templateUrl: "app/_data/_directive/supplySum.tpl.html",
  controller: SupplySumController,
  controllerAs: 'ctrl',
  bindings: {
    sum: '<'
  }
});
