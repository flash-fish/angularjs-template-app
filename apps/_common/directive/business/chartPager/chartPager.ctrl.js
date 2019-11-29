class ChartPagerController {

  constructor($scope) {
    this.scope = $scope;

    this.pageCount = 15;

    this.buttons = [
      {i: "fa fa-caret-left"},
      {i: "fa fa-caret-right"}
    ];

    $scope.$watch("ctrl.initPage", newVal => {
      if (!newVal) return;

      this.inner = this.initPage;

      this.buttons.forEach((s, i) => s.disable = this.inner === 1 && !i);

      if (Math.ceil(this.total / this.pageCount) === this.inner) {
        this.buttons[1].disable = true;
      }

    });

    $scope.$watch("ctrl.total", newVal => {
      if (_.isUndefined(newVal)) return;

      this.buttons.forEach((s, i) => {
        s.disable = !i || (i && newVal <= this.pageCount);
      });

    })
  }

  click(index) {

    if (index && Math.ceil(this.total / this.pageCount) === this.inner) {
      this.buttons[index].disable = true;
      return;
    }

    this.buttons.forEach(s => s.disable = !index && this.inner === 1);

    this.page = !index
      ? this.inner === 1 ? 1 : this.inner - 1
      : this.inner + 1;

    this.inner = this.page;

    this.isPager = true;
  }

  down(index) {
    this.buttons[index].active = true;
  }

  up(index) {
    this.buttons[index].active = false;
  }

}

angular.module('SmartAdmin.Directives').component('chartPager', {
  templateUrl: "app/directive/business/chartPager/chartPager.tpl.html",
  controller: ChartPagerController,
  controllerAs: "ctrl",
  bindings: {
    page: "=",
    initPage: "<",
    total: "<",
    isPager: "="
  }
});
