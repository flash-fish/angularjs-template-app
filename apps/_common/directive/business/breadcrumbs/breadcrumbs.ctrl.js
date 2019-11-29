class BreadcrumbsController {
  constructor ($scope) {
    this.scope = $scope;
  }

  init() {
    this.scope.$watch("ctrl.data", newVal => {
      if(!newVal) return;

      this.list = angular.copy(newVal);

      if(this.list.length)
        this.list[this.list.length - 1].active = true;

      this.list.splice(0, 0, {name: "全部", code: "all"});
    })


  }
}


angular.module('SmartAdmin.Directives').component('breadcrumbs', {
  templateUrl: 'app/directive/business/breadcrumbs/breadcrumbs.tpl.html',
  controller: BreadcrumbsController,
  controllerAs: 'ctrl',
  bindings: {
    data: '<',
    click: '&'
  }
});
