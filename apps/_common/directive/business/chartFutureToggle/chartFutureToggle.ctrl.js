class ChartFutureToggleController {

  constructor($scope) {
    this.scope = $scope;
  }

  init() {
    this.key = this.key || {};
    this.label = this.key.label ? this.key.label : '未来日模式'
  }

}

/**
 *
 * extra: type -> Array
 */
angular.module('SmartAdmin.Directives').component('chartFutureToggle', {
  templateUrl: "app/directive/business/chartFutureToggle/chartFutureToggle.tpl.html",
  controller: ChartFutureToggleController,
  controllerAs: "ctrl",
  bindings: {
    isOpen: "=",
    key: "<"
  }
});
