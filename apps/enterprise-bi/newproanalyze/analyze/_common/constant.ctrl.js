angular.module('hs.productAnalyze.news')
  .constant("newState", {
    moreProData: [
      {id: "haveImportNoOrder", name: '建档后至今未产生首订'},
      {id: "haveOrderNoDistribution", name: '首订后至今未产生首到'},
      {id: "haveDistributionNoSale", name: '首到后至今未产生首销'},
      {id: "haveSaleNoSupplement", name: '首销后至今未产生首补'},
    ],
    statusList: [
      {id: "", name: ' 全部'},
      {id: "3", name: ' 新品运营中'},
      {id: "1", name: ' 转为正常品'},
      {id: "2", name: ' 已淘汰'}
    ],
    /*temp: [
      {name: '引入新品SKU数', option: 'newSku'},
      {name: '新品运营中SKU数', option: 'operationSku'},
      {name: '转为正常品SKU数', option: 'normalSku'},
      {name: '已淘汰SKU数', option: 'eliminateSku'},
      {name: '淘汰率', option: 'eliminateRate'},
    ],*/
    structureTree:[
      'haveImportNoOrderInfo', // 建档后指定天数未产生首订
      'haveImportNoOrderValue', // 建档后未产生首订新品数
      'haveOrderNoDistributionInfo', // 首订后指定天数未产生首到
      'haveOrderNoDistributionValue', // 首订后未产生首到新品数
      'haveDistributionNoSaleInfo', // 首到后指定天数未产生首销
      'haveDistributionNoSaleValue', // 首到后未产生首销新品数(涉及门店数)
      'haveSaleNoSupplementInfo', // 首销后指定天数未产生首补
      'haveSaleNoSupplementValue', // 首销后未产生首补新品数(涉及门店数)
      'normalSku', // 转为正常品SKU数
      'eliminateSku', // 已淘汰SKU数
      'eliminateRate' // 淘汰率
    ],
    confSort: [
      'haveImportNoOrderInfo',
      'haveOrderNoDistributionInfo',
      'haveDistributionNoSaleInfo',
      'haveSaleNoSupplementInfo',
    ],
    isString: [
      'haveImportNoOrderInfo',
      'haveOrderNoDistributionInfo',
      'haveDistributionNoSaleInfo',
      'haveSaleNoSupplementInfo'
    ],
    CliIndex: [
      'haveImportNoOrderInfo',
      'haveOrderNoDistributionInfo',
      'haveDistributionNoSaleInfo',
      'haveSaleNoSupplementInfo'
    ],
    session:{
      categorySession: 'EMIT_NEW_CATEGORY_SESSION',
      classSession: 'EMIT_NEW_CLASS_SESSION',
      navCat: 'navCategoryYear',
      navCla: 'navClassYear',
      newMetSession: 'new_met_session',
    },


  });
