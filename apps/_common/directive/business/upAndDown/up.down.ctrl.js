angular.module('SmartAdmin.Directives').directive('upDown', function () {

  return {
    restrict: 'A',
    replace: true,
    template: '<span class="scale-icon"><i class="fa fa-arrow-up red-icon" ng-if="change >= 0"></i>' +
    '<i class="fa fa-arrow-down green-icon" ng-if="change < 0"></i></span>',
    scope: {
      change: '<',
    },
    link: function ($scope) {
      $scope.$watch('change', newVal => {
        if (!newVal) return;
        $scope.change = newVal;
      })
    }
  }
});
