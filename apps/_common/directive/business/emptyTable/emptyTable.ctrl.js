class EmptyTableController {

  constructor() {

  }

  init() {

  }
}

angular.module('SmartAdmin.Directives').component('emptyTable', {
  templateUrl: "app/directive/business/emptyTable/emptyTable.tpl.html",
  controller: EmptyTableController,
  bindings: {
    show: "<"
  }
});
