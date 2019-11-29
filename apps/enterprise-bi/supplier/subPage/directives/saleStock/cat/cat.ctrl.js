class SaleCatController {
  constructor($scope) {
    this.scope = $scope;

    this.types = [
      { id: 1, name: '常规表示' },
      { id: 2, name: '树形表示' }
    ];
  }

  init() {
    this.keys.subActive = 1;

    this.scope.$watch('ctrl.param', newVal => {
      if (!newVal) return;

    });

    this.scope.$watch('ctrl.field', newVal => {
      if (!newVal) return;

    });
  }
}

angular.module('hs.supplier.saleStock').component('saleCat', {
  templateUrl: 'app/supplier/subPage/directives/saleStock/cat/cat.tpl.html',
  controller: SaleCatController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
