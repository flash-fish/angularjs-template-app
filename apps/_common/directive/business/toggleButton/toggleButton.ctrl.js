class ToggleButtonController {
  constructor (basicService, $scope) {
    this.basic = basicService;
    this.scope = $scope;
  }

  init() {
    /**
     * this.local === null          代表不会将toggle的状态存入localStorage
     * this.local === undefined     代表会存入localStorage 默认key为 "hs_toggle_chart_button"
     * typeof this.local === string 代表会存入localStorage key为 this.local
     */

    if (!_.isNull(this.local)) {
      this.showChart = eval(this.basic.getLocal("hs_toggle_chart_button"));
    }

    this.show = this.showChart;

    this.scope.$watch("ctrl.show", newVal => {
      this.showChart = newVal;
    });
  }

  toggle() {
    this.showChart = !this.showChart;

    if (!_.isNull(this.local))
      this.basic.setLocal("hs_toggle_chart_button", this.showChart);

    this.show = this.showChart;

    if (this.showChart) {
      setTimeout(() => {
        this.basic.connectChart();
      }, 100);
    }
  }
}



angular.module('SmartAdmin.Directives').component('toggleButton', {

  templateUrl: 'app/directive/business/toggleButton/toggleButton.tpl.html',
  controller: ToggleButtonController,
  controllerAs: "ctrl",
  bindings: {
    show: '=',
    name: '<',
    local: '<'
  }
});
