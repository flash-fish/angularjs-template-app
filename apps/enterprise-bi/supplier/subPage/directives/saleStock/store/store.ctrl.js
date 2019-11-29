class SaleStoreController {
  constructor($scope) {
    this.scope = $scope;
    
    this.types = [
      { id: 1, name: '按门店' },
      { id: 2, name: '按业态' },
      { id: 3, name: '按地区' }
    ];

    this.active = 1;

  }

  init() {
    this.scope.$watch('ctrl.param', newVal => {
      if (!newVal) return;
    
    });
  
    this.scope.$watch('ctrl.field', newVal => {
      if (!newVal) return;
    
    });
  }
}

angular.module('hs.supplier.saleStock').component('saleStore', {
  templateUrl: 'app/supplier/subPage/directives/saleStock/store/store.tpl.html',
  controller: SaleStoreController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
