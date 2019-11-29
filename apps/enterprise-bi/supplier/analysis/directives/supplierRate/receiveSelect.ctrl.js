class receiveSelectController {
  constructor($scope, $sce, dataService, basicService, commonP, CommonCon) {
    this.sce = $sce;
    this.scope = $scope;
    this.commonP = commonP;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;

    // 定义到货率、退货率
    this.rates = angular.copy(this.commonP.InitRate);

    // 过滤字符串
    this.SFilter = angular.copy(this.commonP.StringsFilter);
  };

  init() {
    // 初始化数据显示
    this.getterData();

  }

  change(){
    this.scope.$emit(this.CommonCon.receiveRate, this.rates);
    this.data = this.rates;
  }


  getterData(){
    const Mains =  angular.copy(this.commonP.mains);
    this.basic.packager(this.dataService.getCountRange(Mains), res => {
      this.receiveData = res.data[Mains[0]];
      this.returnData = res.data[Mains[1]].filter(
        s => !this.SFilter.includes(s)
      );
      this.rates[Mains[0]] = this.receiveData[0];
      this.rates[Mains[1]] = this.returnData[0];

      // 默认值
      this.scope.$watch('ctrl.receives', nval => {
        if(!nval) return;
        this.rates = nval;
      });

    });
  }


}

angular.module('hs.supplier.adviser').component('receiveSelect', {
  templateUrl: 'app/supplier/analysis/directives/supplierRate/receiveSelect.tpl.html',
  controller: receiveSelectController,
  controllerAs: 'ctrl',
  bindings: {
    data: '=',
    receives: '<'
  }
});
