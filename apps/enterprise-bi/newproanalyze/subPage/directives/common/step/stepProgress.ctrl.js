class stepProgressCtroller
 {
    constructor ($scope, dataService, FigureService, basicService)
    {
      this.scope = $scope;
      this.dataService = dataService;
      this.FigureService = FigureService;
      this.basic = basicService;
    }

    init ()
    {
      this.scope.$watch('ctrl.keys', newVal => {

        if (!newVal) return;

        this.basic.packager(this.dataService.getNewProductStatusLine(newVal), res => {
          if(_.isEmpty(res.data)) return;
          this.basic_Data = res.data[0];
          this.importDate = this.FigureService.dataTransform(this.basic_Data.importDate);
          this.firstOrderGoods = this.FigureService.dataTransform(this.basic_Data.firstOrderGoods);
          this.firstDistribution = this.FigureService.dataTransform(this.basic_Data.firstDistribution);
          this.firstSale = this.FigureService.dataTransform(this.basic_Data.firstSale);
          this.firstSupplement = this.FigureService.dataTransform(this.basic_Data.firstSupplement);

        })
      });

    }

 }

angular.module('hs.productAnalyze.news').component('stepProgress',
{
    templateUrl: 'app/newproanalyze/subPage/directives/common/step/stepProgress.tpl.html',
    controller: stepProgressCtroller,
    controllerAs: 'ctrl',
    bindings: {
      keys: '<',
    }
}
);
