angular.module('SmartAdmin.Directives').directive('loading', function () {
  
  return {
    restrict: 'A',
    replace: true,
    template: '<span ng-class="{common_show: show, common_hide: !show}"' +
    'class="loading-info">正在加载中.....</span>',
    scope: {
      show: '<',
    },
    link: function ($scope) {
      $scope.$watch('show', newVal => {
        $scope.show = newVal;
      })
    }
  }
});
