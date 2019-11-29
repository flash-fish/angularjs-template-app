angular.module("hs.supplier.adviser", ["ui.router"])

  .config(($stateProvider, SupplierMenu, hsRouteProvider) => {
    const root = "app/supplier/analysis/views/";
    hsRouteProvider.buildState(
      $stateProvider
        .state('app.supAnalyse', {
          url: "/supAnalyse",
          data: {
            title: '供应商分析'
          },
          abstract: true
        }),
        SupplierMenu,
        root
    );
  })

  /**
   * 供应商分析 子菜单配置
   * t: route title
   * u: route url
   * c: controller name & templateUrl file name & join router name
   * i: icon
   * nl: 表示当前页面初始化时不需要全局loading （no loading）
   */
  .constant('SupplierMenu', {
      parent: 'app.supAnalyse.',
      list: [
        {t: '供应商概况', u: '/sup_info', c: 'supplierInfo', nl: true},
        {t: '供应商销售库存', u: '/sup_sale', c: 'supplierSale'},
        {t: '供应商毛利结构', u: '/sup_grossProfit', c: 'supplierGrossProfit'},
        {t: '供应商收益分析', u: '/sup_profit', c: 'supplierProfit'},
        {t: '供应商供货', u: '/sup_supply', c: 'supplierSupply'},
        {t: '供应商加注缺品', u: '/sup_lack', c: 'supplierLack'},
        {t: '供应商引入', u: '/sup_inOut', c: 'supplierInOut'},
        {t: '供应商异常', u: '/sup_abnormal', c: 'supplierAbnormal'},
        {t: '供应商8020结构', u: '/sup_vitalFeRule', c: 'supplierVitalFeRule'},
        {t: '供应商交叉分析', u: '/sup_overlap', c: 'supplierOverlap'},
        {t: '供应商四象限分析', u: '/sup_quadrant', c: 'supplierQuadrant'},
        {t: '供应商结构占比分析', u: '/sup_structuralRatio', c: 'supplierStructuralRatio', nl: true}
      ]
    },
  );
