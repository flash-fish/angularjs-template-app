class districtController {

  constructor(dataService, $scope) {
    this.dataService = dataService;
    this.$scope = $scope;
  }

  init() {
    /*this.district = null;*/
    this.getDistrictList();

  }

  getDistrictList() {
    this.dataService.getDistricts().then(res => {
      this.districtList = [];
      if (res.data) this.districtList = res.data;
      this.districtList.splice(0, 0, {districtCode: "", districtName: "全部地区"});
      this.districts = angular.copy(this.districtList);

      if(!this.district || !this.district.districtCode)
      this.district = this.districtList[0];
      else{
        const dtc = this.districtList.filter((o) => o.districtCode == this.district.districtCode);
        this.district = dtc[0];
      }

      this.$scope.$watch('$ctrl.isInit', (val) => {
        if (!val) return;
        this.district = this.districtList[0];
      });

      this.$scope.$watch('$ctrl.district', val => {
        if (val.districtCode) return;

        this.district = this.districtList[0];
      })

    });
  }
}

angular.module('SmartAdmin.Directives').component('district', {
  templateUrl: "app/directive/business/district/district.tpl.html",
  controller: districtController,
  bindings: {
    district: '=',
    isInit: '<',
    districts: '='
  }
});
