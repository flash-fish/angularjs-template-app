angular.module('app.datas')
  .constant("Version", {
    current: "_20190514PROD",
    last: ["_20190429PROD", "_20190416PROD", "_20190325PROD", "_20190318PROD", "_20190307PROD", "_20190117PROD", ""]
  })
  .constant('Common', {
    popupInfoVersion: 'popupInfoVersion',
    allRole: {
      all: "_all",
      buyer: "_buyer",
      store: "_store"
    },
    module: 5,
    tableInfo: 'tableInfo',
    condition: 'condition',
    profitJob: 'profitJob',
    visiblePage: 'visible_page_5',
    leftMenu: 'left_menu_5',
    accountAccess: 'account_access_5',
    subDetailCondition: 'subDetailCondition',
    conditionAccess: 'condition.access',
    updatedCondition: 'update.condition',
    saleCondition: 'saleCondition',
    ProfitCondition: 'ProfitCondition',
    noSaveWarnAllTableInfo:'noSaveWarnAllTableInfo',
    commodityInfo:'commodityInfo',
    supplierIDCondition: 'supplierIDCondition',
    local: {
      topCondition: 'topCondition',
      subCondition: 'subCondition',
      returnCondition: 'returnCondition',
      returnSubCondition: 'returnSubCondition',

      menuCondition: 'menuCondition',
      menuConditionFromPage: 'menuConditionFromPage',
      returnMenuCondition: 'returnMenuCondition',

      // 下面这几个是为了清空给一些页面设定自定义的local的条件，
      hsToggleChartButton: "hs_toggle_chart_button", // 控制chart 的显示隐藏
      abcFieldChart: "abc_field_chart",
      toStructure: "toStructure",
      newConditionAbc: "newConditionAbc",
      returnConditionWarn: "returnConditionwarn",
      subConditionWarn: "subConditionwarn"
    },
    option: {
      resetField: 'resetField'
    },
    currentJob: 'currentJob',
    conditionTips: {
      dateNoSupportCurrentMonth: '日期条件未保持(不支持当前月)',
      dateNoSupportDay: '日期条件未保持(不支持按日)',
      dateNoSupportCrossYear: '日期条件未保持(不支持跨年)'
    }
  })
  .constant('loginUri', '/login')
  .constant('Symbols', {
    least: -99999999,
    rang: '～',
    line: '/',
    slash: '/',
    comma: '，',
    eComma: ',',
    bar: '-',
    error: "",
    infinite: "∞",
    asterisk: '*',
    percent: '%',
    extremely: '‱',
    slashDate: 'YYYY/MM/DD',
    normalDate: 'YYYYMMDD',
    normalMonth: 'YYYYMM',
    slashMonth: 'MM/DD',
    slashYear: 'YYYY/MM',
    allDate: 'YYYY-MM-DD HH',
    YoY: 'YoY',
    ToT: 'ToT',
    ToTValue: 'ToTValue',
    YoYValue: 'YoYValue',
    underLine: '_',
    reRate: '0.00%',
    defaultRate: '0.00',
    symTotal:"整体合计"
  })

  .constant('CommonCon', {
    lastingCondition: [
      'date', 'classes', 'category',
      'store', 'operation', 'district',
      'storeGroup', 'product', 'brand',
      'supplier', 'comparableStores',
    ],

    storeRelate: ["store", "operation", "district", "storeGroup"],

    // chart common style
    chart: {
      axis: {
        basic: {
          scale: true,
          boundaryGap: ['10%', '15%'],
          splitLine: {show: false},
          nameTextStyle: {fontSize: 11, fontFamily: 'Arial', color: '#071220'},
          axisLine: {lineStyle: {color: '#ECECEC', width: 1}, onZero: false},
        },
        other: {
          axisLabel: {color: '#404040', interval: 1, fontSize: 11, fontFamily: 'Arial'},
          axisPointer: {
            type: 'cross',
            label: {color: '#fff', backgroundColor: '#333'},
            lineStyle: {type: 'dashed', width: 1}
          }
        }
      }
    },

    // 缓存模板key
    templateCache: {
      receiveQtyRate: "receiveQtyRate.html",
      returnAmountRate: "returnAmountRate.html"
    },

    warning: [
      {id: 1, name: '按整体', active: true},
      {id: 2, name: '按门店', active: false},
    ],

    // 事件相关
    moreParamLine: 'MORE_PARAM_LINE',
    dateChange: 'DATE_CHANGE_EVENT',
    categoryClick: 'CATEGORY_CLICK_EVENT',
    classClick: 'CLASS_CLICK_EVENT',
    storeClick: 'STORE_CLICK_EVENT',
    operationClick: 'OPERATION_CLICK_EVENT',
    districtClick: 'DISTRICT_CLICK_EVENT',
    changeTab: 'CHANGE_TAB_EVENT',
    rateChange: 'CHANGE_RATE_EVENT',
    ListenRate: 'LISTEN_RATE_CHANGE',
    receiveRate: 'CHANGE_RECEIVE_RATE',
    changeNewYear: 'CHANGE_NEW_YEAR',
    changeNewType: 'CHANGE_NEW_TYPE',
    newEmitState: 'NEW_EMIT_STATE',
    newMetClick: 'NEW_METHOD_CLICK',
    newClassClick: 'NEW_CLASS_CLICK',
    brandTreeGridClick: 'BRAND_TREE_GRID_CLICK',
    brandTreeGridrowExpand: 'BRAND_TREE_GRID_EXPAND',
    brandTreeGridTabs: 'brandTreeGridTabs',

    lastWeekendAmount: "上个周期零售额大于",
    filterCondition: "filterCondition",
    millionUnit: "万元",

    indexComplete: {
      purchaseTree: 'getClassTreeForPurchase',
      storeTreeHeadName: '门店名称'
    },

    jobTypes: {
      all: "all",
      buyer: "buyer",
      store: "store"
    },

    levelMap: {
      1: 1,
      2: 2,
      4: 3,
      5: 4,
      6: 5
    },

    classLevelMap: {
      2: 2,
      3: 3,
      5: 4
    },

    classLevelCodeMap: {
      2: "classSectionCode",
      3: "classSubSectionCode",
      5: "classCode"
    },

    catLevelMap: {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5
    },

    pageType: {
      sale: {
        haveStockChart: true,
        title: "销售库存"
      },
      grossProfit: {
        title: "毛利"
      },
      financeGrossProfit: {
        title: "财务毛利"
      },
      financeProfit: {
        title: "财务收益"
      },
      profit: {
        title: "收益"
      },
      abc: {
        title: "ABC"
      },
      sales: {
        title: "销售"
      },
      channelProfit: {
        title: '通道收益'
      }
    },

    commonPro: {
      store: {val: [], id: '1'},
      category: {val: [], id: '2'},
      operation: {val: [], id: '3'},
      classes: {val: [], id: '4'},
      district: {val: [], id: '5'},
      brand: {val: [], id: '6'},
      product: {val: [], id: '7'},
      storeGroup: {val: [], id: '8'},
      supplier: {val: [], id: '9'}
    },

    subCatType: [
      {id: '3', name: '中分类'},
      {id: '4', name: '小分类'},
      {id: '5', name: '子类'}
    ],

    saleTypes: [
      {i: 1, id: 'all', name: '全部', active: true},
      {i: 2, id: 'distribution', name: '经销'},
      {i: 3, id: 'joint', name: '联营'},
      {i: 4, id: 'retail', name: '零售'},
      {i: 5, id: 'whole', name: '批发'}
    ],

    financeTypes: [
      {i: 1, id: 'all', name: '全部', active: true},
      {i: 2, id: 'distribution', name: '经销'},
      {i: 3, id: 'joint', name: '联营'},
    ],

    compare: {
      '1': "高于",
      '0': "低于",
    },

    commonSearch: {
      date: {name: "日期", type: 1},
      comparableStores: {name: "可比门店", type: 2, bool: {false: "整体门店", true: "可比门店"}},
      store: {name: "门店", type: 0},
      category: {name: "类别", type: 0},
      operation: {name: "业态", type: 0},
      classes: {name: "品类组", type: 0},
      district: {name: "地区", type: 0},
      brand: {name: "品牌", type: 0},
      product: {name: "商品", type: 0},
      storeGroup: {name: "店群", type: 0},
      supplier: {name: "供应商", type: 0}
    },

    abcStructureTypes: [
      {i: 1, id: 'true', name: '整体ABC', active: true},
      {i: 2, id: 'false', name: '平均ABC'}
    ],

    abcStructureDisabledTypes: [
      {i: 1, id: 'true', name: '整体ABC', active: true},
      {i: 2, id: 'false', name: '平均ABC', disabled: true}
    ],

    classLevels: [
      {id: '2', name: '部门', active: true, code: 'classSectionCode'},
      {id: '3', name: '部组', active: false, code: 'classSubSectionCode'},
      {id: '4', name: '品类组', active: false, code: 'classCode'},
    ],

    newProductLevels: [
      {id: '1', name: '有售SKU数', active: true, code: 'newSaleSkuCnt'},
      {id: '2', name: '销售额', active: false, code: 'newSaleAmount'},
      {id: '3', name: '单品平均销售额', active: false, code: 'newAvgSaleAmount'},
      {id: '4', name: '单品平均毛利额', active: false, code: 'newAvgBizProfitAmount'},
      {id: '5', name: '单品平均铺货门店数', active: false, code: 'newAvgSellStoreCnt'},
      {id: '6', name: '周转天数', active: false, code: 'newAvgTurnoverDays'},
    ],
    catLevels: [
      {id: "1", name: '部门', active: true},
      {id: "2", name: '大分类', active: false},
      {id: "3", name: '中分类', active: false},
      {id: "4", name: '小分类', active: false},
      {id: "5", name: '子类', active: false}
    ],

    saleStockTabs: [
      {id: 1, name: '按趋势', active: true},
      {id: 2, name: '按品类组', active: false},
      {id: 3, name: '按类别', active: false},
      {id: 4, name: '按品牌', active: false},
      {id: 5, name: '按门店', active: false},
      {id: 6, name: '按商品', active: false}
    ],

    channelProfitTabs: [
      {id: 1, name: '按趋势', active: true},
      {id: 2, name: '按品类组', active: false},
      {id: 5, name: '按门店', active: false},
      {id: 8, name: '按品类组费用代码', active: false},
      {id: 9, name: '按门店费用代码', active: false}
    ],

    financeProfitTabs_all: [
      {id: 1, name: '按趋势', active: true},
      {id: 2, name: '按品类组', active: false},
      {id: 5, name: '按门店', active: false},
    ],

    financeProfitTabs_store: [
      {id: 1, name: '按趋势', active: true},
      {id: 5, name: '按门店', active: false},
    ],

    financeProfitTabs_buyer: [
      {id: 1, name: '按趋势', active: true},
      {id: 2, name: '按品类组', active: false},
    ],


    abcStructureTabs: [
      {id: 1, name: '按趋势', active: true},
      {id: 2, name: '按品类组', active: false},
      {id: 3, name: '按类别', active: false},
      {id: 4, name: '按品牌', active: false},
      {id: 5, name: '按门店', active: false},
      {id: 6, name: '按商品', active: false},
      {id: 7, name: '按供应商', active: false},
      {id: 8, name: '按业态群', active: false},
      {id: 9, name: '按新品', active: false}
    ],

    session_key: {
      apiOrder: 'apiOrder',
      sessionParam: 'sessionParam',
      tableParam: 'tableParam',
      left_menu_toggle: 'left_menu_toggle',
      hsParam: "hsParam",
      hsField: "hsField",
      columnResizing: "columnResizing",
      warn_seven: 'warn_seven',
      changeColumn: 'changeColumn',
      filterParams: 'filterParams',
      noResetFilter: 'noResetFilter'
    },

    warningType: {
      sale: 'warnSale',
      day: 'warnDay',
      item: 'warnRetailItem',
      store: 'warn.retailStore',
      itemC: 'warn.itemC'
    },

    dateType: [
      {id: 'allAmount', name: '2018年供应商', active: true},
      {id: 'allUnit', name: '2017年供应商', active: false}
    ],

    //供应商销售库存—>新品——>新品状态
    sumState: [
      {name: '引入新品SKU数', pam: 'newSku', option: '-', isSale: true, prompt: "importSku"},
      {name: '申报中新品SKU数', pam: 'applySku',  option: '-', isSale: false, prompt: 0},
      {name: '新品运营中SKU数', pam: 'operationSku',  option: '-', isSale: false, prompt: 0},
      {name: '转为正常品SKU数', pam: 'normalSku', option: '-', isSale: false, prompt: 0},
      {name: '已淘汰SKU数', pam: 'eliminateSku', option: '-', isSale: false, prompt: 0},
      {name: '淘汰率', pam: 'eliminateRate', option: '-', scale: true, isSale: false, prompt: "eliminationRate"},
    ],

    //ABC分析 select
    abcStatusSelect: [
      {id: 3, name: '运营中新品'},
      {id: 0, name: '正常品'},
      {id: 1, name: '已淘汰'},
      {id: 2, name: '未启动'},
    ],

    abcOperationGroupSelect: [
      {id: 1, name: '一级大卖场'},
      {id: 5, name: '二级大卖场'},
      {id: 2, name: '综超'},
      {id: 3, name: '精超'},
      {id: 4, name: '标超'},
      {id: 99, name: '其它'},
    ],

    abcOperationSelect: [
      {id: 0, name: '整体'},
      // {id: 1, name: '大卖场'},
      {id: 1, name: '一级大卖场'},
      {id: 5, name: '二级大卖场'},
      {id: 2, name: '综超'},
      {id: 3, name: '精超'},
      {id: 4, name: '标超'},
      {id: 99, name: '其它'}
    ],

    abcOperationStore: [
      {id: 'operationsContrast', name: '整体业态'},
      {id: 'operationsAvgContrast', name: '平均业态'},
      {id: 'storeContrast', name: '门店'}
    ],

    abcCrossXY: [
      {id: 0, name: '平均单品库存', title: 'stockCostAvg'},
      {id: 1, name: '平均单品周转', title: 'stockTurnover'},
      {id: 2, name: '单品单店铺设数', title: 'layStoreCnt'}
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

    abcSelect: {
      A: '各业态 A',
      B: '各业态 B',
      C: '各业态 C'
    },

    selectXY: [
      {id: '1', name: '销售额', active: true, option: 'allAmount'},
      {id: '2', name: '毛利额', active: false, option: 'allProfit'},
      {id: '3', name: '毛利率', active: false, option: 'allProfitRate'},
      {id: '4', name: '经销周转天数', active: false, option: 'saleDays'},
      {id: '5', name: '销售额同比增幅', active: false, option: 'allAmountYoY'},
      {id: '6', name: '毛利额同比增幅', active: false, option: 'allProfitYoY'},
      {id: '7', name: '毛利率同比增长', active: false, option: 'allProfitRateYoYInc'},
      {id: '8', name: '经销周转天数同比增长', active: false, option: 'saleDaysYoY'}
    ],

    storeX: [
      {id: '1', name: '零售额 ', active: true, option: 'retailAmount', axisUnit: `万元`, unit: `元`, formatStyle: `sale`},//坐标轴：除以一万，显示成万元 数据：保存两位小数
      {
        id: '2',
        name: '单位经营面积零售额 ',
        active: false,
        option: 'operateSizeRetailAmount',
        axisUnit: `万元`,
        unit: `元`,
        formatStyle: `sale`
      },//坐标轴：除以一万，显示成万元 数据：保存两位小数
      {id: '3', name: '毛利额  ', active: false, option: 'allProfit', axisUnit: `万元`, unit: `元`, formatStyle: `sale`},
      {
        id: '4',
        name: '单位经营面积毛利额 ',
        active: false,
        option: 'operateSizeAllProfit',
        axisUnit: `万元`,
        unit: `元`,
        formatStyle: `sale`
      },
      {id: '5', name: '客单数 ', active: false, option: 'flowCnt', axisUnit: ``, unit: ``, formatStyle: `flowCnt`},
      {
        id: '6',
        name: '零售额-同比增幅 ',
        active: false,
        option: 'retailAmountYoY',
        axisUnit: `%`,
        unit: `%`,
        formatStyle: `percent`
      },
      {
        id: '7',
        name: '零售额占比 ',
        active: false,
        option: 'retailAmountPct',
        axisUnit: `%`,
        unit: `%`,
        formatStyle: `percent`
      },
      {
        id: '8',
        name: '日均经销成本-同比增幅 ',
        active: false,
        option: 'distributionCostDayYoY',
        axisUnit: `%`,
        unit: `%`,
        formatStyle: `percent`
      },
    ],

    storeY: [
      [
        {id: '1', name: '毛利额', active: true, option: 'allProfit', axisUnit: `万元`, unit: `元`, formatStyle: `sale`},
        {
          id: '2',
          name: '单位经营面积零售额',
          active: false,
          option: 'operateSizeRetailAmount',
          axisUnit: `万元`,
          unit: `元`,
          formatStyle: `sale`
        },
        {id: '3', name: '零售数', active: false, option: 'retailUnit', axisUnit: ``, unit: ``, formatStyle: `number`},
        {id: '4', name: '日均库存金额', active: false, option: 'stockCost', axisUnit: `万元`, unit: `元`, formatStyle: `sale`},
        {id: '5', name: '经营门店面积', active: false, option: 'operateSize', axisUnit: `㎡`, unit: `㎡`, formatStyle: `area`},
        {id: '6', name: '客单数', active: false, option: 'flowCnt', axisUnit: ``, unit: ``, formatStyle: `flowCnt`},
        {
          id: '7',
          name: '零售客单价',
          active: false,
          option: 'retailFlowAmount',
          axisUnit: `元`,
          unit: `元`,
          formatStyle: `flowAmount`
        },
        {
          id: '8',
          name: '毛利率',
          active: false,
          option: 'allProfitRate',
          axisUnit: `%`,
          unit: `%`,
          formatStyle: `percent`
        },
        {
          id: '9',
          name: '零售额-同比增幅',
          active: false,
          option: 'retailAmountYoY',
          axisUnit: `%`,
          unit: `%`,
          formatStyle: `percent`
        },
        {
          id: '10',
          name: '毛利额-同比增幅',
          active: false,
          option: 'allProfitYoY',
          axisUnit: `%`,
          unit: `%`,
          formatStyle: `percent`
        },
      ],
      [
        {id: '1', name: '经营门店面积', active: true, option: 'operateSize', axisUnit: `㎡`, unit: `㎡`, formatStyle: `area`},
      ],
      [
        {
          id: '1',
          name: '单位经营面积毛利额',
          active: true,
          option: 'operateSizeAllProfit',
          axisUnit: `万元`,
          unit: `元`,
          formatStyle: `sale`
        },
        {id: '2', name: '经营门店面积', active: false, option: 'operateSize', axisUnit: `㎡`, unit: `㎡`, formatStyle: `area`},
        {id: '3', name: '日均库存金额', active: false, option: 'stockCost', axisUnit: `万元`, unit: `元`, formatStyle: `sale`},
        {id: '4', name: '客单数', active: false, option: 'flowCnt', axisUnit: ``, unit: ``, formatStyle: `flowCnt`},
        {
          id: '5',
          name: '零售客单价',
          active: false,
          option: 'retailFlowAmount',
          axisUnit: `元`,
          unit: `元`,
          formatStyle: `flowAmount`
        },
        {
          id: '6',
          name: '毛利率',
          active: false,
          option: 'allProfitRate',
          axisUnit: `%`,
          unit: `%`,
          formatStyle: `percent`
        },
      ],
      [
        {id: '1', name: '经营门店面积', active: true, option: 'operateSize', axisUnit: `㎡`, unit: `㎡`, formatStyle: `area`},
      ],
      [
        {
          id: '1',
          name: '零售客单价 ',
          active: true,
          option: 'retailFlowAmount',
          axisUnit: `元`,
          unit: `元`,
          formatStyle: `flowAmount`
        },
        {id: '2', name: '经营门店面积 ', active: false, option: 'operateSize', axisUnit: `㎡`, unit: `㎡`, formatStyle: `area`},
      ],
      [
        {
          id: '1',
          name: '毛利额-同比增幅',
          active: true,
          option: 'allProfitYoY',
          axisUnit: `%`,
          unit: `%`,
          formatStyle: `percent`
        },
      ],
      [
        {
          id: '1',
          name: '毛利额占比',
          active: true,
          option: 'allProfitPct',
          axisUnit: `%`,
          unit: `%`,
          formatStyle: `percent`
        },
      ],
      [
        {
          id: '1',
          name: '日均库存金额-同比增幅',
          active: true,
          option: 'stockCostYoY',
          axisUnit: `%`,
          unit: `%`,
          formatStyle: `percent`
        },
      ],
    ],

    storeBubble: [
      {id: '1', name: '无', active: true, option: ''},
      {
        id: '2',
        name: '单位经营面积零售额',
        active: false,
        option: 'operateSizeRetailAmount',
        axisUnit: `万元`,
        unit: `元`,
        formatStyle: `sale`
      },
      {
        id: '3',
        name: '单位经营面积毛利额',
        active: false,
        option: 'operateSizeAllProfit',
        axisUnit: `万元`,
        unit: `元`,
        formatStyle: `sale`
      },
      {
        id: '4',
        name: '单位经营面积零售数',
        active: false,
        option: 'operateSizeRetailUnit',
        axisUnit: ``,
        unit: ``,
        formatStyle: `number`
      },
      {id: '5', name: '日均库存金额', active: false, option: 'stockCost', axisUnit: `万元`, unit: `元`, formatStyle: `sale`},
      {id: '6', name: '客单数', active: false, option: 'flowCnt', axisUnit: ``, unit: ``, formatStyle: `flowCnt`},
      {
        id: '7',
        name: '零售客单价',
        active: false,
        option: 'retailFlowAmount',
        axisUnit: `万元`,
        unit: `元`,
        formatStyle: `sale`
      },
    ],

    storeNorm: [
      {id: '1', name: '零售额', active: false, option: 'retailAmount', sale: true},
      {id: '2', name: '单位经营面积零售额', active: false, option: 'operateSizeRetailAmount', sale: true},
      {id: '3', name: '零售额-同比增幅', active: false, option: 'retailAmountYoY', scale: true},
      {id: '4', name: '零售数', active: false, option: 'retailUnit'},
      {id: '5', name: '零售数-同比增幅', active: false, option: 'retailUnitYoY', scale: true},
      {id: '6', name: '毛利额', active: true, option: 'allProfit', sale: true},
      {id: '7', name: '毛利额-同比增幅', active: true, option: 'allProfitYoY', scale: true},
      {id: '8', name: '毛利率', active: false, option: 'allProfitRate', scale: true},
      {id: '9', name: '客单数', active: false, option: 'flowCnt'},
      {id: '10', name: '客单数-同比增幅', active: false, option: 'flowCntYoY', scale: true},
      {id: '11', name: '零售客单价', active: false, option: 'retailFlowAmount'},
      {id: '12', name: '零售客单价-同比增幅', active: false, option: 'retailFlowAmountYoY', scale: true},
      {id: '13', name: '日均库存金额', active: false, option: 'stockCost', sale: true},
      {id: '14', name: '日均库存金额-同比增幅', active: false, option: 'stockCostYoY', scale: true},
      {id: '15', name: '日均经销成本', active: false, option: 'distributionCostDay', sale: true},
      {id: '16', name: '日均经销成本-同比增幅', active: false, option: 'distributionCostDayYoY', scale: true},
      {id: '17', name: '经销周转天数', active: false, option: 'saleDays'},
      {id: '18', name: '经销周转天数-同比增长', active: false, option: 'saleDaysYoYInc'},
    ],

    /*新品分析下拉选项数据
    *@param avgAllAmount 新品平均销售额
    *@param avgAllProfit 新品平均毛利额
    *@param avgSellStoreCnt 新品平均铺货门店数
    *@param avgTurnoverDays 新品周转天数
    * */
    new_Select_A: {
      saleroom: [{
        name: '新品平均销售额',
        icon: 'one',
        active: 'avgAllAmount',
        selects: [
          {id: 1, name: '高于商品平均销售额'},
          {id: 0, name: '低于商品平均销售额'}
        ]
      }],
      gross: [{
        name: '新品平均毛利额',
        icon: 'two',
        active: 'avgAllProfit',
        selects: [
          {id: 1, name: '高于商品平均毛利额'},
          {id: 0, name: '低于商品平均毛利额'}
        ]
      }],
      store: [{
        name: '新品平均铺货门店数',
        icon: 'thr',
        active: 'avgSellStoreCnt',
        selects: [
          {id: 1, name: '高于商品平均铺货门店数'},
          {id: 0, name: '低于商品平均铺货门店数'}
        ]
      }],
      day: [{
        name: '新品周转天数',
        active: 'avgTurnoverDays',
        selects: [
          {id: 1, name: '高于商品周转天数'},
          {id: 0, name: '低于商品周转天数'}
        ]
      }]
    },

    dateTypeToThis: [
      {id: 1, name: '年至今', active: true},
      {id: 2, name: '去年同期', active: false},
      {id: 3, name: '去年全年', active: false},
    ],

    dateTypeToT: [
      {id: 1, name: '去年同期', active: true},
      {id: 2, name: '去年全年', active: false},
    ],

    saleOrProfit: [
      {id: 'allAmount', name: '按销售额', active: true},
      {id: 'allProfit', name: '按毛利额', active: false},
    ],


    logisticsPattern: [
      {id: '', name: '全部', active: true},
      {id: '1', name: '直送', active: false},
      {id: '2', name: '中转', active: false},
      {id: '3', name: '统配', active: false},
      {id: '4', name: '区配', active: false},
      {id: '5', name: '直通', active: false},
    ],

    dateStyle: [
      {id: 'allAmount', name: '2018年新品', active: true},
      {id: 'allUnit', name: '2017年新品', active: false}
    ],

    saleStyle: [
      {id: 'allMoney', name: '按销售额', active: true},
      {id: 'allNum', name: '按销售数', active: false}
    ],

    grossStyle: [
      {id: 'grossMoney', name: '按毛利额', active: true},
      {id: 'grossRate', name: '按毛利率', active: false}
    ],

    supLackSelect: [
      {
        name: "加注缺品次数",
        active: 1,
        range: [
          {value: 1, name: "高于平均3%以上"},
          {value: 2, name: "高于平均1%~3%"},
          {value: 3, name: "高于平均1%以内"},
          {value: 4, name: "低于平均1%以内"},
          {value: 5, name: "低于平均1%~3%"},
          {value: 6, name: "低于平均3%以上"}
        ],
        isSelected: false
      },
      {
        name: "平均缺货天数",
        active: 1,
        range: [
          {value: 1, name: "高于平均3%以上"},
          {value: 2, name: "高于平均1%~3%"},
          {value: 3, name: "高于平均1%以内"},
          {value: 4, name: "低于平均1%以内"},
          {value: 5, name: "低于平均1%~3%"},
          {value: 6, name: "低于平均3%以上"}
        ],
        isSelected: false
      },
      {
        name: "A类品加注缺品次数占比",
        active: 1,
        range: [
          {value: 1, name: "高于平均3%以上"},
          {value: 2, name: "高于平均1%~3%"},
          {value: 3, name: "高于平均1%以内"},
          {value: 4, name: "低于平均1%以内"},
          {value: 5, name: "低于平均1%~3%"},
          {value: 6, name: "低于平均3%以上"}
        ],
        isSelected: false
      }
    ],

    indexClassLevel: [
      {id: '1', name: '部门', code: 'sectionCode', key: 'classSectionCode', type: 'classes'},
      {id: '2', name: '部组', code: 'subSectionCode', key: 'classSubSectionCode', type: 'classes'},
      {id: '3', name: '品类组', code: 'classCode', key: 'classCode', type: 'classes'},
    ],

    indexStoreLevel: [
      {id: '1', name: '业态', code: 'businessOperationCode', key: 'businessOperation'},
      {id: '2', name: '地区', code: 'storeCode', key: 'store'},
      {id: '3', name: '门店', code: 'districtCode', key: 'district'},
    ],

    indexRadarKeyValue: {
      allAmount: '含税销售额',
      allAmountAftTax: '不含税销售额',
      allProfit: '毛利额',
      allProfitRate: '毛利率',
      buyerChannelSettleAmount: '通道收益额',
      compIncomeAmount: '综合收益额',
      compIncomeRate: '综合收益率',
      saleDays: '周转天数',
      allAmountKpi: '含税销售额',
      allAmountAftTaxKpi: '不含税销售额',
      allProfitKpi: '毛利额',
      allProfitRateKpi: '毛利率',
      buyerChannelSettleAmountKpi: '通道收益额',
      compIncomeAmountKpi: '综合收益额',
      compIncomeRateKpi: '综合收益率',
      saleDaysKpi: '周转天数',
      allAmountCR: '含税销售额',
      allAmountAftTaxCR: '不含税销售额',
      allProfitCR: '毛利额',
      allProfitRateCR: '毛利率',
      buyerChannelSettleAmountCR: '通道收益额',
      compIncomeAmountCR: '综合收益额',
      compIncomeRateCR: '综合收益率',
      saleDaysCR: '周转天数'
    },

    indexPurchaseRadar: {
      indicator: [
        {name: '含税销售额', maxName: "allAmountKpi"},
        {name: '不含税销售额', maxName: "allAmountAftTaxKpi"},
        {name: '毛利额', maxName: "allProfitKpi"},
        {name: '毛利率', maxName: "allProfitRateKpi"},
        {name: '通道收益额', maxName: "buyerChannelSettleAmountKpi"},
        {name: '综合收益额', maxName: "compIncomeAmountKpi"},
        {name: '综合收益率', maxName: "compIncomeRateKpi"},
        {name: '经销周转率', maxName: "saleDaysKpi"},
      ],

      ra: {
        value: ['allAmount', 'allAmountAftTax', 'allProfit', 'allProfitRate', 'buyerChannelSettleAmount', 'compIncomeAmount', 'compIncomeRate', 'saleDays'],
        name: '实绩',
        areaStyle: {normal: {color: 'rgba(0, 122, 219, 0.15)'}}
      },

      kpi: {
        value: ['allAmountKpi', 'allAmountAftTaxKpi', 'allProfitKpi', 'allProfitRateKpi', 'buyerChannelSettleAmountKpi', 'compIncomeAmountKpi', 'compIncomeRateKpi', 'saleDaysKpi'],
        name: '指标'
      },

      rate: {
        value: ['allAmountCR', 'allAmountAftTaxCR', 'allProfitCR', 'allProfitRateCR', 'buyerChannelSettleAmountCR', 'compIncomeAmountCR', 'compIncomeRateCR', 'saleDaysCR'],
        name: '达成率'
      }
    },

    indexOperationsRadar: {
      indicator: [
        {name: '含税销售额', maxName: 'allAmountKpi'},
        {name: '综合收益额', maxName: 'compIncomeAmountKpi'},
        {name: '经销周转率', maxName: 'saleDaysKpi'}
      ],

      ra: {
        value: ['allAmount', 'compIncomeAmount', 'saleDays'],
        name: '实绩',
        areaStyle: {normal: {color: 'rgba(0, 122, 219, 0.15)'}}
      },

      kpi: {
        value: ['allAmountKpi', 'compIncomeAmountKpi', 'saleDaysKpi'],
        name: '指标',
      },

      rate: {
        value: ['allAmountCR', 'compIncomeAmountCR', 'saleDaysCR'],
        name: '达成率'
      }
    },

    indexLineSelect: {
      purchase: [
        {id: 1, name: '含税销售额-指标达成率', title: 'allAmountCR'},
        {id: 2, name: '不含税销售额-指标达成率', title: 'allAmountAftTaxCR'},
        {id: 3, name: '毛利额-指标达成率', title: 'allProfitCR'},
        {id: 4, name: '毛利率-指标达成率(高于/低于指标百分点)', title: 'allProfitRateCR'},
        {id: 5, name: '通道收益额-指标达成率', title: 'buyerChannelSettleAmountCR'},
        {id: 6, name: '综合收益额-指标达成率', title: 'compIncomeAmountCR'},
        {id: 7, name: '综合收益率-指标达成率(高于/低于指标百分点)', title: 'compIncomeRateCR'},
        {id: 8, name: '周转天数-指标达成率', title: 'saleDaysCR'}
      ],

      operations: [
        {id: 1, name: '含税销售额-指标达成率', title: 'allAmountCR'},
        {id: 2, name: '综合收益率-指标达成率', title: 'compIncomeRateCR'},
        {id: 3, name: '周转天数-指标达成率', title: 'saleDaysCR'}
      ]
    },

    //门店对标 chart 下拉框初始化
    storeAnalyzeChart: [
      {id: 1, name: '销售额', title: 'allAmount'},
      {id: 2, name: '销售数', title: 'allUnit'},
      {id: 3, name: '毛利额', title: 'allProfit'},
      {id: 4, name: '毛利率', title: 'allProfitRate'},
      // {id: 5, name: '单位使用面积销售额', title: 'useSizeAllAmount'},
      {id: 5, name: '有售SKU数', title: 'saleSkuCount'},
      {id: 6, name: '单位经营面积销售额', title: 'operateSizeAllAmount'},
    ],

    //门店对标下拉框初始化 levels
    storeAnalyzeSelect: [
      {id: "1", name: '部门', active: true},
      {id: "2", name: '大分类', active: false},
      {id: "3", name: '中分类', active: false},
      {id: "4", name: '小分类', active: false},
      {id: "5", name: '子类', active: false}
    ],

    storeTrend: [
      {id: 1, name: '销售额 + 毛利额', title: 'allAmount+allProfit'},
      {id: 2, name: '零售额 + 销售额', title: 'retailAmount+allAmount'},
      {id: 3, name: '销售额 + 销售额-同比增幅', title: 'allAmount+allAmountYoY'},
      {id: 4, name: '零售客单价 + 客单数', title: 'retailFlowAmount+flowCnt'},
      {id: 5, name: '毛利额 + 毛利率', title: 'allProfit+allProfitRate'},
      {id: 6, name: '毛利率 + 毛利率-同比增长', title: 'allProfitRate+allProfitRateYoYInc'},
      {id: 7, name: '销售数 + 销售数-同比增幅', title: 'allUnit+allUnitYoY'},
      {id: 8, name: '销售额 + 日均库存金额', title: 'allAmount+stockCost'},
    ],


    page: {
      page_home: 'page_home', //首页
      page_sale_saleStock: 'page_sale_saleStock', //销售库存
      page_sale_profit: 'page_sale_profit', //毛利结构
      page_sale_income: 'page_sale_income', //收益
      page_sale_financeProfit: 'page_sale_financeProfit', //财务毛利
      page_sale_financeIncome: 'page_sale_financeIncome', //财务收益
      page_new_info: 'page_new_info', //新品概况
      page_new_saleStock: 'page_new_saleStock', //新品销售库存
      page_new_in: 'page_new_in', //新品引入
      page_new_state: 'page_new_state', //新品状态
      page_new_state_class: 'page_new_state_class', //新品状态按品类组
      page_new_state_category: 'page_new_state_category', //新品状态按类别
      page_new_skuContrast: 'page_new_skuContrast', //新品sku对比分析
      page_new_warnStore: 'page_new_warnStore', //新品门店动销异常
      page_supplier_info: 'page_supplier_info', //供应商概况
      page_supplier_saleStock: 'page_supplier_saleStock', //供应商销售库存
      page_supplier_profit: 'page_supplier_profit', //供应商毛利结构
      page_supplier_income: 'page_supplier_income', //供应商收益
      page_supplier_supply: 'page_supplier_supply', //供应商供货
      page_supplier_lack: 'page_supplier_lack', //供应商加注缺品
      page_supplier_in: 'page_supplier_in', //供应商引入
      page_supplier_quadrant: 'page_supplier_quadrant', // 供应商四象限分析
      page_supplier_warning: 'page_supplier_warning', //供应商异常
      page_supplier_8020: 'page_supplier_8020', //供应商8020结构
      page_supplier_across_sale: 'page_supplier_across_sale', //供应商交叉分析（按销售库存）
      page_supplier_across_structure: 'page_supplier_across_structure', //供应商交叉分析（按结构占比）
      page_subSuppler_info: 'page_subSuppler_info', //概况
      page_subSupplier_saleStock: 'page_subSupplier_saleStock', //销售库存
      page_subSupplier_profit: 'page_subSupplier_profit', //毛利结构
      page_subSupplier_income: 'page_subSupplier_income', //收益
      page_subSupplier_supply: 'page_subSupplier_supply', //供货
      page_subSupplier_lack: 'page_subSupplier_lack', //加注缺品
      page_subSupplier_supplyArrivalDetail: 'page_subSupplier_supplyArrivalDetail', //供货
      page_subSupplier_supplyReturnDetail: 'page_subSupplier_supplyReturnDetail', //退货
      page_subSupplier_lackDetail: 'page_subSupplier_lackDetail', //加注缺品
      page_indexComplete_buyer: 'page_indexComplete_buyer', //指标达成(采购)
      page_indexComplete_store: 'page_indexComplete_store', //指标达成(营运)
      page_storeContrast: 'page_storeContrast', //门店对比
      page_storeBenchmarking: 'page_storeBenchmarking', //门店对标
      page_activity: 'page_activity', //活动分析
      page_supply: 'page_supply',
      page_new_productInfo: 'page_new_productInfo',// 单品概况
      page_abnormal_sale: 'page_abnormal_sale', //销售异常(整体)
      page_abnormal_sale_by_store: 'page_abnormal_sale_by_store', //销售异常(门店列表)
      page_abnormal_sale_by_store_product: 'page_abnormal_sale_by_store_product', //销售异常(门店商品)
      page_abnormal_no_sale: 'page_abnormal_no_sale', //不动销异常(整体)
      page_abnormal_no_sale_by_store: 'page_abnormal_no_sale_by_store', //不动销异常(门店列表)
      page_abnormal_no_sale_by_store_product: 'page_abnormal_no_sale_by_store_product', //不动销异常(门店商品)
      page_abnormal_minus_profit: 'page_abnormal_minus_profit', //经销负毛利异常(整体)
      page_abnormal_minus_profit_by_store: 'page_abnormal_minus_profit_by_store', //经销负毛利异常(门店列表)
      page_abnormal_minus_profit_by_store_product: 'page_abnormal_minus_profit_by_store_product', //经销负毛利异常(门店商品)
      page_structure: 'page_structure', //供应商结构
      page_priceBrand: 'page_priceBrand', // 价格带
      page_brand_Price: 'page_brand_Price', // 按价格带
      page_sku_contrast_analyze: 'page_sku_contrast_analyze', // sku对比分析
      page_channel_profit: 'page_channel_profit' //通道收益
    },

    local: {
      /**
       * TOGGLE 表格显示隐藏的标志位
       * ORIGIN 保存指标的结构
       * DATA 保存指标的值
       *
       * _P: 表示父页面
       * _SUP: 表示供应商分析一级菜单下的页面
       * _SALE: 表示销售库存分析一级菜单下的页面
       */

      // 供应商-收益
      TABLE_ORIGIN_SUP_PROFIT_P: "TABLE_ORIGIN_SUP_PROFIT_P",
      TABLE_ORIGIN_SUP_PROFIT: "TABLE_ORIGIN_SUP_PROFIT",
      CHART_ORIGIN_SUP_PROFIT: "CHART_ORIGIN_SUP_PROFIT",
      CHART_DATA_SUP_PROFIT: "CHART_DATA_SUP_PROFIT",

      // 供应商-毛利结构
      TABLE_ORIGIN_SUP_GROSS_PROFIT_P: "TABLE_ORIGIN_SUP_GROSS_PROFIT_P",
      TABLE_ORIGIN_SUP_GROSS_PROFIT: "TABLE_ORIGIN_SUP_GROSS_PROFIT",
      CHART_ORIGIN_SUP_GROSS_PROFIT: "CHART_ORIGIN_SUP_GROSS_PROFIT",
      CHART_DATA_SUP_GROSS_PROFIT: "CHART_DATA_SUP_GROSS_PROFIT",

      // 供应商-销售库存
      TABLE_ORIGIN_SUP_SALE_STOCK_P: "TABLE_ORIGIN_SUP_SALE_STOCK_P",
      TABLE_ORIGIN_SUP_SALE_STOCK: "TABLE_ORIGIN_SUP_SALE_STOCK",
      CHART_ORIGIN_SUP_SALE_STOCK: "CHART_ORIGIN_SUP_SALE_STOCK",
      CHART_DATA_SUP_SALE_STOCK: "CHART_DATA_SUP_SALE_STOCK",

      // 供应商供货（一级）
      TABLE_ORIGIN_SUPPLIER_TABLE_LOCAL: "TABLE_ORIGIN_SUPPLIER_TABLE_LOCAL",
      // TABLE_ORIGIN_SUPPLIER_TABLE_ORIGIN: "TABLE_ORIGIN_SUPPLIER_TABLE_ORIGIN",

      // 供应商供货（二级）
      TABLE_GOODS_TABLE_LOCAL: "TABLE_GOODS_TABLE_LOCAL",
      TABLE_GOODS_ORIGIN_CHART_LOCAL: "TABLE_GOODS_ORIGIN_CHART_LOCAL",
      TABLE_GOODS_DATA_CHART_LOCAL: "TABLE_GOODS_DATA_CHART_LOCAL",

      // 销售库存-毛利分析
      TABLE_ORIGIN_SALE_GROSS_PROFIT: "TABLE_ORIGIN_SALE_GROSS_PROFIT",
      CHART_ORIGIN_SALE_GROSS_PROFIT: "CHART_ORIGIN_SALE_GROSS_PROFIT",
      CHART_DATA_SALE_GROSS_PROFIT: "CHART_DATA_SALE_GROSS_PROFIT",

      // 销售库存-销售库存
      TABLE_ORIGIN_SALE_SALE_STOCK: "TABLE_ORIGIN_SALE_SALE_STOCK",
      CHART_DATA_SALE_SALE_STOCK: "CHART_DATA_SALE_SALE_STOCK",
      CHART_ORIGIN_SALE_SALE_STOCK: "CHART_ORIGIN_SALE_SALE_STOCK",

      // 销售库存-收益
      TABLE_ORIGIN_SALE_PROFIT: "TABLE_ORIGIN_SALE_PROFIT",
      CHART_ORIGIN_SALE_PROFIT: "CHART_ORIGIN_SALE_PROFIT",
      CHART_DATA_SALE_PROFIT: "CHART_DATA_SALE_PROFIT",

      // 销售库存-财务毛利
      TABLE_ORIGIN_SALE_FINANCE_GROSS_PROFIT: "TABLE_ORIGIN_SALE_FINANCE_GROSS_PROFIT",
      CHART_ORIGIN_SALE_FINANCE_GROSS_PROFIT: "CHART_ORIGIN_SALE_FINANCE_GROSS_PROFIT",
      CHART_DATA_SALE_FINANCE_GROSS_PROFIT: "CHART_DATA_SALE_FINANCE_GROSS_PROFIT",

      // 销售库存-财务收益
      TABLE_ORIGIN_SALE_FINANCE_PROFIT: "TABLE_ORIGIN_SALE_FINANCE_PROFIT",
      CHART_ORIGIN_SALE_FINANCE_PROFIT: "CHART_ORIGIN_SALE_FINANCE_PROFIT",
      CHART_DATA_SALE_FINANCE_PROFIT: "CHART_DATA_SALE_FINANCE_PROFIT",


      // 供应商引入
      TABLE_ORIGIN_SUPPLIER_INOUT: "TABLE_ORIGIN_SUPPLIER_INOUT",

      // 指标达成-采购
      TABLE_ORIGIN_PURCHASE: "TABLE_ORIGIN_PURCHASE",

      // 指标达成-运营
      TABLE_ORIGIN_OPERATIONS: "TABLE_ORIGIN_OPERATIONS",

      // 财务分析-财务毛利分析
      TABLE_ORIGIN_FINANCE_GROSS_PROFIT: "TABLE_ORIGIN_FINANCE_GROSS_PROFIT",
      CHART_DATA_FINANCE_GROSS_PROFIT: "CHART_DATA_FINANCE_GROSS_PROFIT",

      // 新品分析-销售库存
      TABLE_ORIGIN_NEW_SALE_STOCK: "TABLE_ORIGIN_NEW_SALE_STOCK",
      CHART_DATA_NEW_SALE_STOCK: "CHART_DATA_NEW_SALE_STOCK",
      CHART_ORIGIN_NEW_SALE_STOCK: "CHART_ORIGIN_NEW_SALE_STOCK",

      TABLE_ORIGIN_NEW_ITEM_STOCK: "TABLE_ORIGIN_NEW_ITEM_STOCK",
      CHART_ORIGIN_NEW_ITEM_STOCK: "CHART_ORIGIN_NEW_ITEM_STOCK",

      // 新品分析
      TABLE_ORIGIN_NEW_ANAlYZE_STOCK: "TABLE_ORIGIN_NEW_ANAlYZE_STOCK",

      //ABC分析 -- 结构分析
      TABLE_ORIGIN_ABC_STRUCTURE: "TABLE_ORIGIN_ABC_STRUCTURE",
      CHART_DATA_ABC_STRUCTURE: "CHART_DATA_ABC_STRUCTURE",
      CHART_ORIGIN_ABC_STRUCTURE: "CHART_ORIGIN_ABC_ABC_STRUCTURE",

      //ABC分析 -- 差异分析
      TABLE_ORIGIN_ABC_DIFF: "TABLE_ORIGIN_ABC_DIFF",

      //ABC分析 -- 商品效能
      TABLE_ORIGIN_ABC_EFFICIENCYPRODUCT: "TABLE_ORIGIN_ABC_EFFICIENCYPRODUCT",

      //ABC分析 -- 商品一览
      TABLE_ORIGIN_ABC_PROJECT: "TABLE_ORIGIN_ABC_PROJECT",

      //ABC分析 -- 预警商品
      TABLE_ORIGIN_ABC_WARNING: 'TABLE_ORIGIN_ABC_WARNING',
      // 门店对标 -- 门店对比 -- 按类别
      TABLE_ORIGIN_STORE_ANAlYZE_TYPE: "TABLE_ORIGIN_STORE_ANAlYZE_TYPE",
      // 综合分析-活动分析 TABLE -- CHART
      TABLE_ORIGIN_ACTIVITY_ANALYZE: "TABLE_ORIGIN_ACTIVITY_ANALYZE",
      CHART_ORIGIN_ACTIVITY_ANALYZE: "CHART_ORIGIN_ACTIVITY_ANALYZE",

      CHART_SELECT_ACTIVITY_ANALYZE: "CHART_SELECT_ACTIVITY_ANALYZE",
      //负毛利异常
      TABLE_ORIGIN_WARN_MINUS_PROFIT: "TABLE_ORIGIN_WARN_MINUS_PROFIT",

      // 供货分析
      TABLE_ORIGIN_MATERIAL_ANALYZE: "TABLE_ORIGIN_MATERIAL_ANALYZE",
      CHART_ORIGIN_MATERIAL_ANALYZE: "CHART_ORIGIN_MATERIAL_ANALYZE",
      CHART_DATA_MATERIAL_ANALYZE: "CHART_DATA_MATERIAL_ANALYZE",


      // 价格带 - TABLE -- CHART
      TABLE_ORIGIN_CLASS_BRAND_PRICE: "TABLE_ORIGIN_CLASS_BRAND_PRICE" ,
      CHART_ORIGIN_CLASS_BRAND_PRICE: "CHART_ORIGIN_CLASS_BRAND_PRICE" ,
      CHART_SELECT_CLASS_BRAND_PRICE: "CHART_SELECT_CLASS_BRAND_PRICE",

      //通道收益
      TABLE_ORIGIN_CHANNEL_PROFIT: "TABLE_ORIGIN_CHANNEL_PROFIT",
      CHART_ORIGIN_CHANNEL_PROFIT: "CHART_ORIGIN_CHANNEL_PROFIT",
      CHART_DATA_CHANNEL_PROFIT: "CHART_DATA_CHANNEL_PROFIT",

      // 新品SKU对比分析
      TABLE_ORIGIN_NEW_SKU_CONTRAST_ANALYZE: "TABLE_ORIGIN_NEW_SKU_CONTRAST_ANALYZE",
      CHART_ORIGIN_NEW_SKU_CONTRAST_ANALYZE: "CHART_ORIGIN_NEW_SKU_CONTRAST_ANALYZE",
      CHART_DATA_NEW_SKU_CONTRAST_ANALYZE: "CHART_DATA_NEW_SKU_CONTRAST_ANALYZE",

      // 综合分析-Sku对比分析
      TABLE_ORIGIN_SKU_CONTRAST_ANALYZE: "TABLE_ORIGIN_SKU_CONTRAST_ANALYZE",
      CHART_ORIGIN_SKU_CONTRAST_ANALYZE: "CHART_ORIGIN_SKU_CONTRAST_ANALYZE",
      CHART_DATA_SKU_CONTRAST_ANALYZE: "CHART_DATA_SKU_CONTRAST_ANALYZE",
    },

  });
