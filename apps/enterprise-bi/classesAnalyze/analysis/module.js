angular.module("hs.classesAnalyze.menu", ["ui.router"])

  .config(($stateProvider, ClassesAnalyzeMenu, hsRouteProvider) => {
    const root = "app/classesAnalyze/analysis/views/";

    hsRouteProvider.buildState(
      $stateProvider
        .state('app.classesAnalyze', {
          url: "/classesAnalyze",
          data: {
            title: '品类分析'
          },
          abstract: true
        }),
      ClassesAnalyzeMenu,
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
  .constant('ClassesAnalyzeMenu', {
    parent: 'app.classesAnalyze.',
    list: [
      {t: '商品效能分析', u: '/abc', c: 'abc', i: "fa-cog", nl: true},
      {t: '价格带分析', u: '/priceBrand', c: 'priceBrand'},
    ]

  });
