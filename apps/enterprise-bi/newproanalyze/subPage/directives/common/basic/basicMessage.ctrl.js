class basicMessageController {
  constructor($scope, dataService, FigureService, CommonCon, basicService) {
    this.scope = $scope;
    this.dataService = dataService;
    this.CommonCon = CommonCon;
    this.figure = FigureService;
    this.basicService = basicService;

  }

  init() {
    this.scope.$watch('ctrl.param', newVal => {
      if (!newVal) return;

      const code = {
        condition: {
          product: [newVal]
        },
        pageId: this.CommonCon.page.page_new_productInfo
      };

      this.basicService.packager(this.dataService.getNewProductInfo(code), res => {
        this.basic = res.data[0] ? res.data[0] : {};
        this.new_type =
          !res.data[0]
            ? '-'
            : `${this.basic.sectionName}
            -${this.basic.categoryName1}
            -${this.basic.categoryName2}
            -${this.basic.categoryName3}
            -${this.basic.categoryName4}`;
      });

      this.basicService.packager(this.dataService.getNewProductDateShelveStores(code), response => {
        this.door_Numbers = this.figure.haveValue(response.data) ? response.data[0].storeCount : 0;
      })

    });
  }
}

angular.module('hs.productAnalyze.news').component('basicMessage', {
    templateUrl: 'app/newproanalyze/subPage/directives/common/basic/basicMessage.tpl.html',
    controller: basicMessageController,
    controllerAs: 'ctrl',
    bindings: {
      param: '<',
      field: '<'
    }
  }
);
