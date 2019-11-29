angular.module('SmartAdmin.Directives').directive('multiBtn', function () {

  return {
    restrict: 'E',
    replace: true,
    template: '<label><input type="checkbox" ng-model="state" class="checkbox"><span>多选</span></label>',
    scope: {
      state: '=',
    }
  }
});
