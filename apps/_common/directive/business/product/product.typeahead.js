class ProductAheadController {

  constructor(dataService, $scope) {
    this.scope = $scope;
    this.dataService = dataService;
  }

  init() {
    this.getProductList();

    if (!this.name) this.name = '商品';


  }

  clearError() {
    this.noResults = false;
  }

  showDrop() {
    $('product-ahead .dropdown-menu').css('display', 'block');
  }

  clearText(event) {
    if (event.keyCode !== 8) return;
    this.selected = '';
    this.noResults = false;
    $('product-ahead .dropdown-menu').css('display', 'none');
  }

  getProductList() {
    this.dataService.getItems().then(res => {
      const productList = res.data;
      productList.forEach(p => {
        !p.spec || p.spec.length === 0 || p.sepc === '-'
          ? p.newProduct = '[' + p.productCode + ']' + p.productName
          : p.newProduct = '[' + p.productCode + ']' + p.productName + '_' + p.spec;
      });
      this.productList = productList;

      this.scope.$watch('$ctrl.selected', newVal => {
        if (!newVal) return;

        if (newVal instanceof Array && !newVal[0]) return;

        if (newVal instanceof Object && Object.keys(newVal).length === 0) return;

        this.selected = this.productList.filter(s => s.productId === this.selected.productId)[0];
      })
    });
  }

}

angular.module('SmartAdmin.Directives').component('productAhead', {
  templateUrl: 'app/directive/business/product/product.typeahead.tpl.html',
  controller: ProductAheadController,
  bindings: {
    selected: '=',
    name: '<'
  }
});
