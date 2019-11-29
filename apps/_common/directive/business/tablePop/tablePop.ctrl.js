class TablePopController {

  constructor ($scope) {
  }
}



angular.module('SmartAdmin.Directives').component('tablePop', {

  templateUrl: 'app/directive/business/tablePop/tablePop.tpl.html',
  controller: TablePopController,
  bindings: {
    click: '&',
    data: '<',
  }
});
