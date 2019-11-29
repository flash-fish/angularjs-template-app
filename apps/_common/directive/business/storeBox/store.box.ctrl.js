class StoreBoxController {

  constructor (Symbols, $scope, CommonCon) {
    this.Symbols = Symbols;
    this.$scope = $scope;
    this.CommonCon = CommonCon;

    this.max = 30;
  }

  init() {

    this.$scope.$watch('$ctrl.data', newVal => {
      if (!newVal) return;

      this.stores = newVal.map(b => b.storeName).join(this.Symbols.comma);
      this.count = newVal.length;
    });
  }
}


angular.module('SmartAdmin.Directives').component('storeBox', {

  templateUrl: 'app/directive/business/storeBox/store.box.tpl.html',
  controller: StoreBoxController,
  bindings: {
    click: '&',
    data: '=',
  }
});
