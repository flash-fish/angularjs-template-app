class storeRankingController {
  constructor(){

  }


}

angular.module('hs.supplier.saleStock').component('storeRanking', {
  templateUrl: 'app/supplier/subPage/directives/subNew/storeRanking.tpl.html',
  controller: storeRankingController,
  controllerAs: 'ctrl',
  bindings: {
    param: "<",
  }
});
