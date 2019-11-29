class actCatGroupController {
  constructor($scope) {
    this.scope = $scope;

    this.types = [
      { id: 1, name: '常规表示' },
      { id: 2, name: '树形表示' }
    ];

    this.active = 1;

  }

  init() {
    this.scope.$watch('ctrl.param', newVal => {
      if (!newVal) return;

    });

    this.scope.$watch('ctrl.field', newVal => {
      if (!newVal) return;

    });
  }
}

angular.module('hs.synthesizeAnalyze').component('actCatGroup', {
  templateUrl: 'app/synthesizeAnalyze/directives/component/activity/actGroup/actGroup.tpl.html',
  controller: actCatGroupController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
