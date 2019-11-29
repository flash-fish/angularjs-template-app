/**
 * Created by ios on 2018/8/24.
 */
class CompanyInforController {
  constructor(dataService, $scope, FigureService) {

    this.scope = $scope;
    this.figure = FigureService;
    this.dataService = dataService;

    this.companyInfor = {
      corpper: "-",
      registerAddress: "-",
      supplierClassName: "-",
      supplierCode: "-",
      supplierName: "-",
      supplierRankName: "-",
      supplierTypeName: "-",
      tel: "-",
    };

  }

  init() {
    this.scope.$watch("ctrl.supplier", newVal => {
      if (!newVal || !this.figure.haveValue(newVal.val)) return;
      this.current = newVal.val[0];

      this.dataService.getSupplierInfo(this.current.code).then(res => {
        this.companyInfor = res.data;
      });
    }, true)
  }
}

angular.module('SmartAdmin.Directives').component('companyInfor', {
  templateUrl: "app/directive/business/companyInfor/companyInfor.tpl.html",
  controller: CompanyInforController,
  controllerAs: "ctrl",
  bindings: {
    supplier: "="
  }
});
