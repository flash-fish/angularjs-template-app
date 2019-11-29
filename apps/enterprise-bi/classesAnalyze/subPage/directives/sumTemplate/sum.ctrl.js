class SumController {
  constructor(dataService, DTColumnBuilder, $scope) {
    this.scope = $scope;
    this.isShowAll = false;
    this.scope.$watch('ctrl.sum', value => {
      this.isShowAll = false;
      if(value){
        if (value.length > 0) {
          value.forEach((i, index) => {
            if(i.data==='-%'){
              i.data = '-';
            };
            if (i.pctData) {
              if (Number(_.split(i.pctData, '%', 2)[0]) >= 0) {
                i.pctUp = 1;
              } else if(i.pctData==='-'){
                i.pctUp=false;
              }else{
                i.pctUp = 2;
              }
            };
            if (index <= 2) {
              i.isShow = true;
            } else {
              i.isShow = false;
            };
          })
        }
      }

      this.sum = value;
    })

  };

  init() {
    // this.isShowAll = false;
    // this.showAll();
  }

  showAll() {
    if (this.isShowAll == false) {
      this.isShowAll = true;
      this.sum.forEach(i => {
        i.isShow = true;
      })
    } else {
      this.isShowAll = false;
      this.sum.forEach((i, index) => {
        if (index <= 2) {
          i.isShow = true;
        } else {
          i.isShow = false;
        }
      })
    }

  }

}

angular.module('hs.classesAnalyze.sub').component('abcSum', {
  templateUrl: 'app/classesAnalyze/subPage/directives/sumTemplate/sum.tpl.html',
  controller: SumController,
  controllerAs: 'ctrl',
  bindings: {
    sum: '=',
  }
});
