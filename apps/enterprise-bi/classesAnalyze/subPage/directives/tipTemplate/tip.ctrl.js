class TipController {
  constructor(dataService, DTColumnBuilder, $scope, $sce) {
    this.scope = $scope;
    this.sce = $sce;

  };

  init() {
  }

}

angular.module('hs.classesAnalyze.sub').component('tip', {
  templateUrl: 'app/classesAnalyze/subPage/directives/tipTemplate/tip.tpl.html',
  controller: TipController,
  controllerAs: 'ctrl',
  bindings: {
    data: '=',
  }
});
