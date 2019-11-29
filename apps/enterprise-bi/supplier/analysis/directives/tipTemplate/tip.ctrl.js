class SupTipController {
  constructor(dataService, DTColumnBuilder, $scope, $sce) {
    this.scope = $scope;
    this.sce = $sce;

  };

  init() {
  }

}

angular.module('hs.supplier.adviser').component('supTip', {
  templateUrl: 'app/supplier/analysis/directives/tipTemplate/tip.tpl.html',
  controller: SupTipController,
  controllerAs: 'ctrl',
  bindings: {
    data: '=',
  }
});
