class ShowSearchController {
  constructor() {
    this.label = '显示搜索条件';
  }

}


angular.module('SmartAdmin.Directives').component('searchShow', {
  template: '<label style="margin-right: 15px"><input type="checkbox" class="checkbox" ng-model="ctrl.show">' +
    '<span>{{ctrl.label}}</span></label>',
  controller: ShowSearchController,
  controllerAs: 'ctrl',
  bindings: {
    show: '='
  }
});
