angular.module("hs.productAnalyze.news", ["ui.router"])

  .config(($stateProvider, productAnalyze, hsRouteProvider) => {
    const root = "app/newproanalyze/analyze/views/";

    hsRouteProvider.buildState(
      $stateProvider
        .state('app.newItemAnalyze', {
          url: "/newItemAnalyze",
          data: {
            title: '新品分析'
          },
          abstract: true
        }),
        productAnalyze,
        root
    );
  })

  /**
   * 新品 子菜单配置
   * t: route title
   * u: route url
   * c: controller name & templateUrl file name
   * i: icon
   */
  .constant('productAnalyze',
    {
      parent: 'app.newItemAnalyze.',
      list: [
        {t: '新品引入', u: '/newItemImport', c: 'newItemImport', i: "fa-cog"},
        // 原是新品类别对比分析， 后升级直接更改内容不换路由
        {t: '新品对比分析', u: '/newItem_cateGory', c: 'newItemCateGory', i: "fa-cog"},
        {t: '新品销售库存', u: '/newItem_saleStock', c: 'newItemSaleStock', i: "fa-cog"},
        {t: '新品门店动销异常', u: '/newItemDoorAbnormal', c: 'newItemDoorAbnormal', i: "fa-cog"},
        {t: '新品状态', u: '/newItemState', c: 'newItemState', i: "fa-cog"},
        {t: '新品概况', u: '/newItemInfo', c: 'newItemInfo', i: "fa-cog", nl: true}
      ]
    },
  );
