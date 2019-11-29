class SearchController {
  constructor ($scope) {
    this.scope = $scope;
    this.scope.$watch("ctrl.finish", newVal => {
      this.finish = newVal;
    });
  }
}

angular.module('SmartAdmin.Directives').component('hsSearch', {
  template: '<button class="btn btn-primary hs-search" ng-click="ctrl.search()" ng-disabled="!ctrl.finish">查询</button>',
  controller: SearchController,
  controllerAs: 'ctrl',
  bindings: {
    search: '&',
    finish: '<'
  }
});
