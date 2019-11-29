class HsTabController {
  constructor (dataService) {
    this.dataService = dataService;
  }

  init () {}

  isDisable(tab) {
    const d = this.disable;

    const currIndex = d.index.indexOf(tab.id) >= 0;

    return currIndex && d.on;
  }


}

angular.module('SmartAdmin.Directives').component('hsTab', {
  templateUrl: "app/directive/business/hsTabs/hs.tabs.tpl.html",
  controller: HsTabController,
  controllerAs: 'ctrl',
  bindings: {
    tabs: '=',
    click: '&',
    disable: '<'
  }
});
