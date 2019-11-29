angular.module("hs.synthesizeAnalyze", ["ui.router"])

  .config(($stateProvider, synthesizeAnalyze, hsRouteProvider) => {
    const root = "app/synthesizeAnalyze/views/";
    hsRouteProvider.buildState(
      $stateProvider
        .state('app.synthesizeAnalyze', {
          url: "/synthesizeAnalyze",
          data: {
            title: '综合分析'
          },
          abstract: true
        }),
      synthesizeAnalyze,
      root
    );
  })

  /**
   * 门店分析 子菜单配置
   * t: route title
   * u: route url
   * c: controller name & templateUrl file name
   * i: icon
   */
  .constant('synthesizeAnalyze', {
      parent: 'app.synthesizeAnalyze.',
      list: [
        {t: '指标达成(采购)', u: '/purchase', c: 'purchase'},
        {t: '指标达成(运营)', u: '/operations', c: 'operations'},
        {t: '门店对比', u: '/storeContrast', c: 'storeContrast'},
        {t: '门店对标', u: '/storeBenchmarking', c: 'storeBenchmarking'},
        {t: '活动分析', u: '/activityAnalyze', c: 'activityAnalyze'},
        {t: '供货分析', u: '/supplyMaterial', c: 'supplyMaterial'},
        {t: 'SKU对比分析', u: '/skuContrastAnalyze', c: 'skuContrastAnalyze'},
      ]
    },
  );
