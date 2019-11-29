angular.module('SmartAdmin.Directives')
  .directive('disableBox', function () {
    return {
      restrict: 'E',
      replace: true,
      template: '<div class="hide-condition" ng-show="show"><input type="text" disabled><span>{{name}}</span></div>',
      scope: {
        name: '<',
        show: '<'
      },
      controller: function ($scope) {
        console.log($scope)
      }
    };
  });
