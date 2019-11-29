angular.module("hs.supplier.saleStock", ["ui.router"])

  .config(($stateProvider, hsRouteProvider, SaleStockSubMenu) => {

    const root = "app/supplier/subPage/views/";
    hsRouteProvider.buildState($stateProvider, SaleStockSubMenu, root);
  })

  .constant('SaleStockSubMenu', {
    parent: 'app.supAnalyse.',
    list: [
      {t: '概况', u: '/hs_subSupplierInfo/:info', c: 'subInfo', nl: true},
      {t: '销售库存', u: '/hs_subSupplierSaleStock/:info', c: 'subSaleStock'},
      {t: '毛利结构', u: '/hs_subSupplierGrossProfit/:info', c: 'subGrossProfit'},
      {t: '收益分析', u: '/hs_subSupplierProfit/:info', c: 'subProfit', access: "app.supAnalyse.supplierProfit"},
      {t: '供货', u: '/hs_subSupplierSupply/:info', c: 'subSupply', access: "app.supAnalyse.supplierSupply"},
      {t: '加注缺品', u: '/hs_subSupplierLack/:info', c: 'subLack', access: "app.supAnalyse.supplierLack"},
      {t: '加注缺品详情', u: '/hs_subSupplierLack/detail/:info', c: 'subLackDetail', d: 'details'},
      {t: '供货 退货详情', u: '/hs_subSupplierSupply/returnDetail/:info', c:'returnDetail', d: 'details'},
      {t: '供货 到货详情', u: '/hs_subSupplierSupply/arrivalDetail/:info', c:'arrivalDetail', d: 'details'}
    ]
  })
;




