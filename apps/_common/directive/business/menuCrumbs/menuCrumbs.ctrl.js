class MenuCrumbsController {
  constructor ($scope, basicService, Common, $state) {
    this.scope = $scope;
    this.$state = $state;
    this.common = Common;
    this.basic = basicService;
  }

  init() {
    this.scope.$watch("ctrl.routes", newVal => {
      if(!newVal) return;

      this.list = angular.copy(newVal);

      this.list[this.list.length - 1].active = true;
    })
  }

  click(curr) {
    this.basic.setLocal(this.common.local.menuCondition, this.data);

    const data = [curr.code];
    if (curr.param) data.push(curr.param);

    this.$state.go(...data);
  }
}


angular.module('SmartAdmin.Directives').component('menuCrumbs', {
  templateUrl: 'app/directive/business/menuCrumbs/menuCrumbs.tpl.html',
  controller: MenuCrumbsController,
  controllerAs: 'ctrl',
  bindings: {
    data: '<',
    routes: '<'
  }
});
