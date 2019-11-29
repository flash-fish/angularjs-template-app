class FilterChartController {
  constructor($scope) {
    this.scope = $scope;


  }

  init() {

  }


}


angular.module('SmartAdmin.Directives').directive('filterChart', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'app/directive/business/filterChart/filter.chart.tpl.html',
    controller: FilterChartController,
    controllerAs: 'ctrl',
    scope: {
      field: '<',
      key: '<'
    }
  }
});
