angular.module('hs.supplier.adviser')
  .constant('OccupationRatio', [
    {id: 1, name: '10%', value: 0.1},
    {id: 2, name: '30%', value: 0.3},
    {id: 3, name: '50%', value: 0.5}
  ])
  .constant('SupplyRate', {
    logisticsMode: {name: '物流模式'},
    receiveQtyRate: {name: '到货率'},
    returnAmountRate: {name: '退货率'}
  })
  .constant('commonRateField', {
    rateField: [
      "receiveQtyRate",
      "receiveQtyRateYoYValue",
      "receiveQtyRateYoYInc",
      "returnAmountRate",
      "returnAmountRateYoYValue",
      "returnAmountRateYoYInc",
      "nonAmount",
      "nonAmountYoYValue",
      "nonAmountYoY",
      "retNet",
      "retNetYoYValue",
      "retNetYoY",
    ]
  })
  .constant('CommSearchSort', {
    date: 1,
    classes: 2,
    category: 3,
    operation: 4,
    store: 5,
    comparableStores: 6,
    district: 7,
    storeGroup: 8,
    brand: 9,
    product: 10,
    supplier: 11
  })
  .constant('QuaConst',{
    init_Marks:[
      {id: 1, name: '按品类组-象限', active: true},
      {id: 2, name: '按象限-品类组', active: false},
    ],
    fTable:[
      'count',
      'allAmount',
      'allAmountYoYInc', // 销售额(万元)-同期增额
      'buyerBizCompIncomeAmount', // 综合收益额(采购)
      'buyerBizCompIncomeAmountYoYInc', // 综合收益额-同期增额
      'allProfit',
      'allProfitYoYInc', // 毛利额(万元)-同期增额
      'buyerChannelSettleAmount', // 通道收益额(采购)
      'buyerChannelSettleAmountYoYInc' // 通道收益额(采购)-同期增额
    ],
    quaName:[
      {name: '第一象限', icon: 'oneQuadrantIcon'},
      {name: '第二象限', icon: 'twoQuadrantIcon'},
      {name: '第三象限', icon: 'threeQuadrantIcon'},
      {name: '第四象限', icon: 'fourQuadrantIcon'},
    ],
    CheckList:[
      'allProfit', 'allAmount', 'YoYValue',
      'buyerBizCompIncomeAmount', 'buyerChannelSettleAmount'
    ],
    commonFix: {
      count:{name: "供应商数"},
    }


  });
