class ChartSortController {

  constructor($scope) {
    this.scope = $scope;

    this.desc = true;
  }

  clickSort() {
    this.desc = !this.desc;

    this.sort = {code: this.desc ? "desc" : "asc", name: "first"};
  }

  down() {
    this.active = true;
  }

  up() {
    this.active = false;
  }
}

angular.module('SmartAdmin.Directives').component('chartSort', {
  templateUrl: "app/directive/business/chartSort/chartSort.tpl.html",
  controller: ChartSortController,
  controllerAs: "ctrl",
  bindings: {
    sort: '='
  }
});
