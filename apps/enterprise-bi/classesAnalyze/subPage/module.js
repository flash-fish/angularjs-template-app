angular.module("hs.classesAnalyze.sub", ["ui.router"])

  .config(($stateProvider, ABCAnalyzeSub, hsRouteProvider) => {
    const root = "app/classesAnalyze/subPage/views/";

    hsRouteProvider.buildState(
      $stateProvider
        .state('app.abcAnalyze', {
          url: "/abcAnalyze",
          data: {
            title: '商品效能分析'
          },
          abstract: true
        }), ABCAnalyzeSub, root);
  })

  /**
   * 供应商分析 子菜单配置
   * t: route title
   * u: route url
   * c: controller name & templateUrl file name
   * i: icon
   */
  .constant('ABCAnalyzeSub', {
    parent: 'app.abcAnalyze.',
    list: [
      {t: '经销结构分析', u: '/hs_subABC/structure:info', c: 'structureABC', i: "fa-cog"},
      {t: '经销业态对比分析', u: '/hs_subABC/diff:info', c: 'diffABC', i: "fa-cog"},
      {t: '经销交叉分析', u: '/hs_subABC/efficiencyCross:info', c: 'efficiencyCrossABC', i: "fa-cog"},
      {t: '经销商品效能', u: '/hs_subABC/efficiencyProduct:info', c: 'efficiencyProductABC', i: "fa-cog"},
      {t: '整体商品ABC', u: '/hs_subABC/ProductList:info', c: 'ProductListABC', i: "fa-cog"},
      {t: '整体C类预警商品', u: '/hs_subABC/warningProduct:info', c: 'warningProduct', i: "fa-cog"},
    ],
    abcAllSelect: {
      A: '整体 A',
      B: '整体 B',
      C: '整体 C'
    },

    abcAvgSelect: {
      A: '平均 A',
      B: '平均 B',
      C: '平均 C'
    },
  })
.constant('warningProduct', {
  areaProductList:[
    {name:'全部',id:''},
    {name:'区域商品',id:true},
    {name:'非区域商品',id:false},
  ],
  lastMonth:[
    {name:'全部',id:'',value:[]},
    {name:'A',id:1,value:['A']},
    {name:'B',id:2,value:['B']},
    {name:'C',id:3,value:['C']},
  ],
  CityLife:[
    {name:'无',id:''},
    {name:'是',id:true},
    {name:'否',id:false},
  ],

});
