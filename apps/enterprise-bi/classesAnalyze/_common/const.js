angular.module('hs.classesAnalyze')
  .constant('brandCommon', {
    surTreeInterface: 'getPriceZoneDataByCategoryTree',
    surTotalInterface: 'getPriceZoneDataByZoneType',
    ZoneTypeRangFace: 'getPriceZoneDataByZoneTypeRange', // 价格带区间 chart 背景图
    AmountPriceFace: 'getDistributionAmountBySpecPrice', // 销售额规格化价格（折线图）
    CanSaleSkuFace: 'getHaveAndCanSaleSpecPrice', // 有售、可售sku的价格分布
    BrandZoneType:'getPriceZoneDataByBrandZoneType', // 品牌价格带
    TypeSpec:'getPriceZoneByZoneTypeSpec', // 价格带规格
    ZoneTypeBrand:'getPriceZoneDataByZoneTypeBrand', // 价格带品牌
    ZoneTypeProduct:'getPriceZoneDataByZoneTypeProduct', // 价格带商品
    surveyField:[
      'Sku',
      'Amount',
      'oneREPLACESkuPct',
      'oneREPLACEAmountPct',
      'twoREPLACESkuPct',
      'twoREPLACEAmountPct',
      'threeREPLACESkuPct',
      'threeREPLACEAmountPct',
      'fourREPLACESkuPct',
      'fourREPLACEAmountPct',
      'fiveREPLACESkuPct',
      'fiveREPLACEAmountPct'
    ],
    sendSurField:[

    ],
    session:{
      priceSession:'PRICE_SESSION',
      emitTreeSession: 'EMIT_TREE_SESSION',
      surveyCondition: 'surveyCondition'
    },
    totalField:[
      "Sku",
      "Amount",
      "SkuPct",
      "AmountPct"
    ],
    wholeData:[
      {id: 'distribution', name: '经销-全体', active: true},
      {id: 'distributionRetail', name: '经销-零售', active: false},
      {id: 'distributionWhole', name: '经销-批发', active: false}
    ],
    noType: [
      'stockCost', 'stockCostYoYValue', 'stockCostYoY',
      'stockCostToT', 'stockCostToTValue', 'stockCostPct',
      'stockQty', 'stockQtyYoYValue', 'stockQtyYoY',
      'stockQtyToTValue', 'stockQtyToT', 'stockQtyPct',
    ],
    LenName: ['高端', '中高端', '中端', '中低端', '低端'],
    barName: ['barOne', 'barTwo', 'line'],
    sale: {
      distributionAmount: {name: '销售额', sale: true},
      distributionSku: { name: '有售SKU数', point: 0 },
    },
    HaveCanSale: [
      "CanSaleSku", "CanSaleSkuYoYValue", "CanSaleSkuYoY",
      "CanSaleSkuToTValue", "CanSaleSkuToT", 'CanSaleSkuPct'
    ],
    Verification:{

    },
    prefixArr:[ 'one','two','three','four','five' ],
    AreaLevel:['oneLevel', 'twoLevel', 'threeLevel', 'fourLevel', 'fiveLevel'],
    InitSet:[
      {id: "Amount", name: "销售额", data: "-", hoverData: "-", addSum: false, conf: true},
      {id: "Sku", name: "有售SKU数", data: "-", hoverData: "-", addSum: false, conf: true},
      {id: "oneREPLACESkuPct", name: "低端SKU占比", data: "-", hoverData: "-", addSum: false, conf: true},
      {id: "oneREPLACEAmountPct", name: "低端销售额占比", data: "-", hoverData: "-", addSum: false, conf: true},
      {id: "twoREPLACESkuPct", name: "中低端SKU占比", data: "-", hoverData: "-", addSum: false, conf: true},
      {id: "twoREPLACEAmountPct", name: "中低端销售额占比", data: "-", hoverData: "-", addSum: false, conf: true},
      {id: "threeREPLACESkuPct", name: "中端SKU占比", data: "-", hoverData: "-", addSum: false, conf: true},
      {id: "threeREPLACEAmountPct", name: "中端销售额占比", data: "-", hoverData: "-", addSum: false, conf: true},
      {id: "fourREPLACESkuPct", name: "中高端SKU占比", data: "-", hoverData: "-", addSum: false, conf: true},
      {id: "fourREPLACEAmountPct", name: "中高端销售额占比", data: "-", hoverData: "-", addSum: false, conf: true},
      {id: "fiveREPLACESkuPct", name: "高端SKU占比", data: "-", hoverData: "-", addSum: false, conf: true},
      {id: "fiveREPLACEAmountPct", name: "高端销售额占比", data: "-", hoverData: "-", addSum: false, conf: true}
    ],
    // 价格带商品
    priceFieldOne:[
      'spec', 'brandName', 'normalPrice', 'specPrice', 'importDate', 'firstStockDate', 'firstSale', 'season',
      'Amount', 'AmountPct', 'Unit', 'UnitPct', 'BusinessProfit', 'BusinessProfitPct', 'stockQty',
      'stockQtyPct', 'stockCost', 'stockCostPct'
    ],
    // 价格带规格
    priceFieldTwo:[
      'brandName', 'normalPrice', 'specPrice', 'importDate', 'firstStockDate', 'firstSale', 'season',
      'Amount', 'AmountPct', 'Unit', 'UnitPct', 'BusinessProfit', 'BusinessProfitPct', 'stockQty',
      'stockQtyPct', 'stockCost', 'stockCostPct'
    ],
    // 品牌价格带
    priceFieldThree:[
      'spec', 'normalPrice', 'specPrice', 'importDate', 'firstStockDate', 'firstSale', 'season',
      'Amount', 'AmountPct', 'Unit', 'UnitPct', 'BusinessProfit', 'BusinessProfitPct', 'stockQty',
      'stockQtyPct', 'stockCost', 'stockCostPct'
    ],
    // 价格带品牌
    priceFieldFour:[
      'spec', 'normalPrice', 'specPrice', 'importDate', 'firstStockDate', 'firstSale', 'season',
      'Amount', 'AmountPct', 'Unit', 'UnitPct', 'BusinessProfit', 'BusinessProfitPct', 'stockQty',
      'stockQtyPct', 'stockCost', 'stockCostPct'
    ],
    // 是否拼接指标
    haveField: [
      'Amount', 'AmountPct', 'Unit', 'UnitPct', 'BusinessProfit', 'BusinessProfitPct',
    ],
    // 基础指标
    basicField:[
      'Amount', 'AmountPct', 'Unit', 'UnitPct', 'BusinessProfit', 'BusinessProfitPct', 'stockQty',
      'stockQtyPct', 'stockCost', 'stockCostPct'
    ],





  });
