class goodsRateCtrl {
  constructor($scope, CommonCon, commonP) {
    this.scope = $scope;
    this.CommonCon = CommonCon;
  }

  init(){
    // 默认值
    this.scope.$watch('ctrl.change', nval => {
      if(!nval) return;
      this.other = nval;
    })

  }

  watchStateOne (){
    this.scope.$emit(this.CommonCon.rateChange, this.other);
    this.data = this.other;
  }



}


angular.module('hs.synthesizeAnalyze').component('goodsRate', {
  templateUrl: 'app/synthesizeAnalyze/directives/goodsRate/goodsRate.tpl.html',
  controller: goodsRateCtrl,
  controllerAs: 'ctrl',
  bindings: {
    data: '=',
    change: '<'
  }
});
