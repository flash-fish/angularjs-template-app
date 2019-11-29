angular.module("hs.productAnalyze.view", ["ui.router"])

  .config(($stateProvider, hsRouteProvider, newProductMenu) => {


    const root = "app/newproanalyze/subPage/views/";
    hsRouteProvider.buildState($stateProvider, newProductMenu, root);

  })

  .constant('newProductMenu', {
    parent: 'app.newItemAnalyze.',
    list: [
      {t: '单品概况', u: '/hs_subInfo/:info', c: 'newInfo', nl: true},
    ]
  })
;
