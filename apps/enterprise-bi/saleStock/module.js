angular.module("hs.saleStock", ["ui.router"])

  .config(($stateProvider, SaleStockMenu, hsRouteProvider) => {
    const root = "app/saleStock/views/";

    hsRouteProvider.buildState(
      $stateProvider
        .state('app.saleStockTop', {
          url: "/saleStockTop",
          data: {
            title: '销售库存分析'
          },
          abstract: true
        }),
      SaleStockMenu,
      root
    );
  })

  /**
   * 供应商分析 子菜单配置
   * t: route title
   * u: route url
   * c: controller name & templateUrl file name
   * i: icon
   */
  .constant('SaleStockMenu', {
    parent: 'app.saleStockTop.',
    list: [
      {t: '销售库存', u: '/saleStock', c: 'saleStock', i: "fa-cog"},
      {t: '毛利结构', u: '/saleGrossProfit', c: 'saleGrossProfit', i: "fa-cog"},
      {t: '综合收益', u: '/saleProfit', c: 'saleProfit', i: "fa-cog"},
      {t: '通道收益', u: '/channelProfit', c: 'channelProfit', i: "fa-cog"},
      {t: '财务毛利', u: '/financeGrossProfit', c: 'financeGrossProfit', i: "fa-cog"},
      {t: '财务收益', u: '/financeProfit', c: 'financeProfit', i: "fa-cog"},
    ]
  });
