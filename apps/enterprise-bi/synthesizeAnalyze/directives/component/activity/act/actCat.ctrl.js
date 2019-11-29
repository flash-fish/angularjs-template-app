class actCatController {
  constructor($scope) {
    this.scope = $scope;

    this.types = [
      { id: 1, name: '常规表示' },
      { id: 2, name: '树形表示' }
    ];
  }

  init() {
    this.keys.subActive = 1;

    this.scope.$watch('ctrl.param', newVal => {
      if (!newVal) return;

    });

    this.scope.$watch('ctrl.field', newVal => {
      if (!newVal) return;

    });
  }
}

angular.module('hs.synthesizeAnalyze').component('actCat', {
  templateUrl: 'app/synthesizeAnalyze/directives/component/activity/act/actCat.tpl.html',
  controller: actCatController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
