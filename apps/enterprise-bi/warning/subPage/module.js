angular.module("hs.warning.sub", ["ui.router"])

  .config(($stateProvider, hsRouteProvider, WarningSubMenu) => {

    const root = "app/warning/subPage/views/";
    hsRouteProvider.buildState($stateProvider, WarningSubMenu, root);
  })

  .constant('WarningSubMenu', {
    parent: 'app.warn.',
    list: [
      {t: '销售异常详情', u: '/hs_subWarnSale/:info', c: 'saleWarnDetail'},
      {t: '不动销异常详情', u: '/hs_subNoSale/:info', c: 'noSaleWarnDetail'},
      {t: '经销负毛利异常详情', u: '/hs_subMinusProfit/:info', c: 'minusProfitWarnDetail'}
    ]
  })
;




