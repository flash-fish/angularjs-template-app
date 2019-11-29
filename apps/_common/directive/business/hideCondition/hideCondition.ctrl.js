class HideConditionController {
  constructor() {

  }
}

angular.module('SmartAdmin.Directives').component('hideCondition', {
    templateUrl: 'app/directive/business/hideCondition/hideCondition.tpl.html',
    controller: HideConditionController,
    controllerAs: 'ctrl',
    bindings: {
      show: '<',
      name: '<'
    }
});
