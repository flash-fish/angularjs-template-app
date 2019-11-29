class priceBrandController {
  constructor(CommonCon, toolService, popups, popupDataService, Pop,
              Common, Table, Chart, basicService, $scope, $stateParams,
              $rootScope, dataService, Symbols, brandCommon, brandService) {
    this.Pop = Pop;
    this.Table = Table;
    this.Chart = Chart;
    this.scope = $scope;
    this.popups = popups;
    this.common = Common;
    this.symbols = Symbols;
    this.root = $rootScope;
    this.tool = toolService;
    this.state = $stateParams;
    this.basic = basicService;
    this.commonCon = CommonCon;
    this.brandCommon = brandCommon;
    this.dataService = dataService;
    this.brandService = brandService;
    this.popupData = popupDataService;

    // 页面配置项
    this.key = {
      active: 1,
      pageId: CommonCon.page.page_priceBrand,
      treeChange: false,
    };


  }

  init() {
    this.root.fullLoadingShow = false;

    const special = { pageId: this.commonCon.page.page_priceBrand,};
    // 时间监听树点击事件
    this.brandService.ClickEventSave(this, special);
  }

  /**
   * tab切换时候的逻辑
   */
  select(event) {
    if(!event) return;
    this.key.treeChange = true;
  }



}


angular.module("hs.classesAnalyze").controller("priceBrandCtrl", priceBrandController);

