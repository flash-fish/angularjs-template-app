class DateCrumbController {

  constructor($scope, CommonCon, chartService) {
    this.scope = $scope;
    this.CommonCon = CommonCon;
    this.chartService = chartService;
  }

  init() {

    this.scope.$watch('ctrl.crumb', newVal => {
    });

    this.scope.$watch('ctrl.param.date', newVal => {
    });
  }

  returnMonth(date) {
    _.remove(this.crumb, (n, i) => {
      return this.crumb.indexOf(date) < i;
    });

    this.chartService.dataZoomOffAll(true);

    this.scope.$emit(this.CommonCon.dateChange, date);

    this.param = Object.assign({}, this.param, {date});
  };


}

angular.module('SmartAdmin.Directives').component('dateCrumb', {
  templateUrl: "app/directive/business/dateCrumb/dateCrumb.tpl.html",
  controller: DateCrumbController,
  controllerAs: "ctrl",
  bindings: {
    crumb: '<',
    param: '='
  }
});
