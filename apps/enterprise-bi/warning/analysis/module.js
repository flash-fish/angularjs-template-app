angular.module("hs.warning.menu", ["ui.router"])

  .config(($stateProvider, WarnMenu, hsRouteProvider) => {
    const root = "app/warning/analysis/views/";
    hsRouteProvider.buildState(
      $stateProvider
        .state('app.warn', {
          url: "/warning",
          data: {
            title: '异常分析'
          },
          abstract: true
        }),
      WarnMenu,
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
  .constant('WarnMenu', {
      parent: 'app.warn.',
      list: [
        {t: '销售异常', u: '/saleWarn', c: 'saleWarn'},
        {t: '不动销异常', u: '/noSaleWarn', c: 'noSaleWarn'},
        {t: '经销负毛利异常', u: '/minusProfitWarn', c: 'minusProfitWarn'}
      ]
    }
  );
