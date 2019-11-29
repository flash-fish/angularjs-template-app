angular.module("hs.popups")
  .constant("Chart", {
    /**
     * 销售库存页面的 chart 指标
     * own: 表示当前指标独立 不进行任何拼接
     * check: 表示指标选中
     * inc: 特殊的指标比较（增幅 or 增长）
     * changeField: 修改指标id
     */
    saleStock: {
      sale: {
        bar: {
          key: {
            col: 4, title: "柱状图", basic: true, watch: true,
            last: {id: "YoYValue", name: "上年同期"}, forceIndex: 0
          },
          list: [
            {id: "Amount", name: "销售额", check: true},
            {id: "Unit", name: "销售数"},
            {id: "Profit", name: "毛利额"},
            {id: "flowCnt", name: "客单数", disKey: {line: [[18, 19, 21, 22]]}, noType: "retail"},
            {id: "flowCntDay", name: "日均客单数", disKey: {line: [[18, 19,21, 22]]}, noType: "retail"},
            {id: "retailFlowAmount", name: "零售客单价", disKey: {line: [[24, 25]]}, noType: "retail"},
            {id: "Amount&Profit", name: "销售额+毛利额", last: true, lineTitle: "销售额", arrayIndex: 0},
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "AmountYoY", name: "销售额-同比增幅"},
            {id: "AmountToT", name: "销售额-环比增幅"},
            {id: "AmountPct", name: "销售额-占比"},

            {id: "UnitYoY", name: "销售数-同比增幅"},
            {id: "UnitToT", name: "销售数-环比增幅"},
            {id: "UnitPct", name: "销售数-占比"},

            {id: "ProfitYoY", name: "毛利额-同比增幅"},
            {id: "ProfitToT", name: "毛利额-环比增幅"},
            {id: "ProfitPct", name: "毛利额-占比"},

            {id: "flowCntYoY", name: "客单数-同比增幅", own: true, noType: "retail"},
            {id: "flowCntToT", name: "客单数-环比增幅", own: true, noType: "retail"},
            {id: "flowCntProportion", name: "客流渗透率", own: true, icon: "FlowCntCat", noType: "retail"},

            {id: "flowCntDayYoY", name: "日均客单数-同比增幅", own: true, noType: "retail"},
            {id: "flowCntDayToT", name: "日均客单数-环比增幅", own: true, noType: "retail"},
            {id: "flowCntProportionYoYValue", name: "上年同期-客流渗透率", own: true, noType: "retail"},

            {id: "retailFlowAmountYoY", name: "零售客单价-同比增幅", own: true, noType: "retail"},
            {id: "retailFlowAmountToT", name: "零售客单价-环比增幅", own: true, noType: "retail"},
            {id: "ProfitRate", name: "毛利率", own: true, icon: 'allProfitRate'},

            {id: "flowCntDay", name: "日均客单数", own: true, noType: "retail", group: 'flowCntDay'},
            {id: "flowCntDayYoYValue", name: "上年同期-日均客单数", own: true, noType: "retail", group: 'flowCntDay'},
            {id: "ProfitRateYoYValue", name: "上年同期-毛利率", own: true},

            {id: "flowCnt", name: "客单数", own: true, noType: "retail", group: 'flowCnt'},
            {id: "flowCntYoYValue", name: "上年同期-客单数", own: true, noType: "retail", group: 'flowCnt'},
            {id: "", name: ""},

            {id: "retailFlowAmount", name: "零售客单价", own: true, noType: "retail", group: 'retailFlowAmount'},
            {id: "retailFlowAmountYoYValue", name: "上年同期-零售客单价", own: true, noType: "retail", group: 'retailFlowAmount'},

          ]
        }
      },
      stock: {
        changeField: {
          key: {col: 4, checkbox: true, class:"buy-out"},
          list: [
            {id: 'buyout', name: "买断维度", startAdd: true}
          ]
        },
        bar: {
          key: {col: 4, title: "柱状图", basic: true, watch: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "stockCost", name: "日均库存金额", check: true},
            {id: "stockQty", name: "日均库存数"},
            {id: "saleDays", name: "经销周转天数", inc: true, disKey: {line: [[6, 7]]}, icon: "saleDays"},
            {id: "stockCostLatest", name: "最新库存金额", last: true},
            {id: "stockQtyLatest", name: "最新库存数", last: true}
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "stockCostYoY", name: "日均库存金额-同比增幅"},
            {id: "stockCostToT", name: "日均库存金额-环比增幅"},
            {id: "stockCostPct", name: "日均库存金额-占比"},

            {id: "stockQtyYoY", name: "日均库存数-同比增幅"},
            {id: "stockQtyToT", name: "日均库存数-环比增幅"},
            {id: "stockQtyPct", name: "日均库存数-占比"},

            {id: "saleDays", name: "经销周转天数", own: true, group: 'day'},
            {id: "saleDaysYoYValue", name: "上年同期-经销周转天数", own: true, group: 'day'},
          ]
        }
      }
    },

    /**
     * 新品分析->chart 设定参数设置
     * sale：销售
     * stock：库存
     * */
    newProductAnalyze_CHART: {
      sale: {
        bar: {
          key: {col: 4, title: "柱状图", basic: true, watch: true, last: {id: "YoYValue", name: "上年同期"}, forceIndex: 0},
          list: [
            {id: "Amount", name: "销售额", check: true},
            {id: "Unit", name: "销售数"},
            {id: "Profit", name: "毛利额"},
            {id: "Amount&Profit", name: "销售额+毛利额", last: true}
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "AmountYoY", name: "销售额-同比增幅"},
            {id: "AmountToT", name: "销售额-环比增幅"},
            {id: "AmountPct", name: "销售额-占比"},

            {id: "UnitYoY", name: "销售数-同比增幅"},
            {id: "UnitToT", name: "销售数-环比增幅"},
            {id: "UnitPct", name: "销售数-占比"},

            {id: "ProfitYoY", name: "毛利额-同比增幅"},
            {id: "ProfitToT", name: "毛利额-环比增幅"},
            {id: "ProfitPct", name: "毛利额-占比"},

            {id: "ProfitRate", name: "毛利率", own: true, icon: 'allProfitRate'},
            {id: "ProfitRateYoYValue", name: "上年同期-毛利率", own: true},
          ]
        }
      },
      stock: {
        changeField: {
          key: {col: 4, checkbox: true, class:"buy-out"},
          list: [
            {id: 'buyout', name: "买断维度", startAdd: true}
          ]
        },
        bar: {
          key: {col: 4, title: "柱状图", basic: true, watch: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "stockCost", name: "日均库存金额", check: true},
            {id: "stockQty", name: "日均库存数"},
            {id: "saleDays", name: "经销周转天数", inc: true, disKey: {line: [[6, 7]]}, icon: "saleDays"},
            {id: "stockCostLatest", name: "最新库存金额", last: true},
            {id: "stockQtyLatest", name: "最新库存数", last: true}
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "stockCostYoY", name: "日均库存金额-同比增幅"},
            {id: "stockCostToT", name: "日均库存金额-环比增幅"},
            {id: "stockCostPct", name: "日均库存金额-占比"},

            {id: "stockQtyYoY", name: "日均库存数-同比增幅"},
            {id: "stockQtyToT", name: "日均库存数-环比增幅"},
            {id: "stockQtyPct", name: "日均库存数-占比"},

            {id: "saleDays", name: "经销周转天数", own: true, group: 'day'},
            {id: "saleDaysYoYValue", name: "上年同期-经销周转天数", own: true, group: 'day'},
          ]
        }
      }
    },

    /**
     * 综合分析-活动分析 chart 页面设置
     */
    ActivitySetting: {
      sale: {
        bar: {
          key: {col: 4, title: "柱状图", basic: true, watch: true, forceIndex: 0},
          list: [
            {id: "Amount", name: "销售额", check: true},
            {id: "Unit", name: "销售数"},
            {id: "Profit", name: "毛利额"},
            {id: "flowCnt", name: "客单数",  disKey: {line: [[9, 10, 12, 13]]}, own: true, noType: "retail"},
            {id: "flowCntDay", name: "日均客单数",  disKey: {line: [[9, 10, 12, 13]]}, own: true, noType: "retail"},
            {id: "retailFlowAmount", name: "零售客单价", disKey: {line: [[15,16]]}, own: true, noType: "retail"},
          ]
        },
        line: {
          key: {col: 3, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "AmountYoY", name: "销售额-对比增幅"},
            {id: "UnitYoY", name: "销售数-对比增幅"},
            {id: "ProfitYoY", name: "毛利额-对比增幅"},
            {id: "flowCntYoY", name: "客单数-对比增幅", noType: "retail"},
            {id: "retailFlowAmountYoY", name: "零售客单价-对比增幅", noType: "retail"},
            {id: "", name: ""},
            {id: "ProfitRate", name: "毛利率", icon: 'allProfitRate'},
            {id: "ProfitRateYoYValue", name: "毛利率(对比日期)"},
            {id: "", name: ""},
            {id: "flowCnt", name: "客单数", noType: "retail", effect: 'other', keep: 'guestList' },
            {id: "flowCntYoYValue", name: "客单数(对比日期)", noType: "retail", effect: 'other', keep: 'guestList' },
            {id: "", name: ""},
            {id: "flowCntDay", name: "日均客单数", noType: "retail", effect: 'other', keep: 'guestFlow' },
            {id: "flowCntDayYoYValue", name: "日均客单数(对比日期)", noType: "retail", effect: 'other', keep: 'guestFlow' },
            {id: "", name: ""},
            {id: "retailFlowAmount", name: "零售客单价", noType: "retail", effect: 'other', keep: 'guestPrice' },
            {id: "retailFlowAmountYoYValue", name: "零售客单价(对比日期)", noType: "retail", effect: 'other', keep: 'guestPrice' },
            {id: "", name: ""},
            {id: "flowCntProportion", name: "客流渗透率", icon: "FlowCntCat", noType: "retail" },
            {id: "flowCntProportionYoYValue", name: "客流渗透率(对比日期)", noType: "retail" },
          ]
        }
      },
      stock: {
        changeField: {
          key: {col: 4, checkbox: true, class:"buy-out"},
          list: [
            {id: 'buyout', name: "买断维度", startAdd: true}
          ]
        },
        bar: {
          key: {col: 4, title: "柱状图", basic: true, watch: true, },
          list: [
            {id: "stockCost", name: "日均库存金额", check: true},
            {id: "stockQty", name: "日均库存数"},
            {id: "saleDays", name: "经销周转天数", inc: true, disKey: {line: [[2, 3, 4]]}, icon: "saleDays"},
          ]
        },
        line: {
          key: {col: 4, title: "折线图（最多选择2项）",  checkbox: true},
          list: [
            {id: "stockCostYoY", name: "日均库存金额-对比增幅", noType: "retail", },
            {id: "stockQtyYoY", name: "日均库存数-对比增幅", noType: "retail", },
            {id: "saleDaysYoYInc", name: "经销周转天数-对比增长",},
            {id: "saleDays", name: "经销周转天数", effect: 'other', keep: 'guestDay'},
            {id: "saleDaysYoYValue", name: "经销周转天数(对比日期)", effect: 'other', keep: 'guestDay'},
          ]
        }
      }
    },

    // 价格带 Chart
    classBrandChart: {
      sale: {
        bar: {
          key: {col: 3, title: "柱状图1", basic: true, watch: true, forceIndex: 0},
          list: [
            {id: "Amount", name: "销售额", disKey: { bar_add: [[2, 3, 6, 7, 8, 9, 10] ]}, check: true},
            {id: "Unit", name: "销售数", disKey: { bar_add: [[2, 3, 4, 5, 7, 8, 9, 10] ]} },
            {id: "BusinessProfit", name: "毛利额", disKey: { bar_add: [[3, 4, 6, 7, 8, 9, 10] ]} },
            {id: "stockCost", name: "日均库存成本", own: true, disKey: { bar_add: [[3, 5, 6, 7, 8, 9, 10] ]} },
            {id: "stockQty", name: "日均库存数", own: true, disKey: { bar_add: [[2, 4, 5, 6, 7, 8, 9, 10] ]} },
            {id: "CanSaleSku", name: "可售SKU数", disKey: { bar_add: [[2, 3, 4, 5, 6, 7, 8, 9, 10] ]}},
            {id: "Sku", name: "有售SKU数", disKey: { bar_add: [[2, 3, 4, 5, 6, 7, 8, 9, 10] ]} },
            {id: "AmountAvg", name: "单品销售额", disKey: { bar_add: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9,] ]}},
            {id: "BusinessProfitAvg", name: "单品毛利额", disKey: { bar_add: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 10] ]}},
            {id: "SingleMixContribution", name: "单品综合贡献", disKey: { bar_add: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] ]}, icon: 'brandOneContributePop'},
          ]
        },
        bar_add: {
          key: {col: 3, title: "柱状图2", and:true, forceIndex: 'end'},
          list: [
            {id: "YoYValue", name: "同期"},
            {id: "ToTValue", name: "环期"},
            {id: "Amount", name: "销售额", own: true, disable: true},
            {id: "Unit", name: "销售数", own: true, disable: true},
            {id: "BusinessProfit", name: "毛利额", own: true},
            {id: "stockCost", name: "日均库存成本", own: true},
            {id: "stockQty", name: "日均库存数", own: true, disable: true},
            {id: "CanSaleSku", name: "可售SKU数", own: true, disable: true},
            {id: "Sku", name: "有售SKU数", own: true, disable: true},
            {id: "AmountAvg", name: "单品销售额", own: true, disable: true, icon: 'brandOneSalesPop'},
            {id: "BusinessProfitAvg", name: "单品毛利额", own: true, disable: true, icon: 'brandOneProfitPop'},
            {id: "", name: "无", own: true, check: true,}
          ]
        },
        line: {
          key: {col: 3, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "AmountPct", name: "销售额占比", check: true},
            {id: "UnitPct", name: "销售数占比"},
            {id: "BusinessProfitPct", name: "毛利额占比"},
            {id: "stockCostPct", name: "日均库存成本占比", noType: "retail"},
            {id: "stockQtyPct", name: "日均库存数占比", noType: "retail"},
            {id: "CanSaleSkuPct", name: "可售SKU数占比", noType: "retail"},
            {id: "SkuPct", name: "有售SKU数占比", noType: "retail"},
            {id: "MoveOffRate", name: "动销率", noType: "retail",icon: 'brandRateOfPinPop'},
          ]
        }
      },
    },

    /**
     * 综合分析 - 供货分析
     * linkAge -> 联动指标
     * Link -> 需要勾选指标
     * age -> 取消指标
     * sorts -> 排序，柱状图指标在折线图指标后显示
     */
    goodsAnalyze: {
      sale:{
        bar: {
          key: {
            col: 4, title: "柱状图", basic: true, watch: true,
            last: {id: "YoYValue", name: "上年同期"}, forceIndex: 0
          },
          list: [
            {id: "nonAmount", name: "未到商品金额", linkAge: {link:[[0]], age:[[3,4]] }, check: true, own: true, noType: "retail"},
            {id: "retNet", name: "退货成本(去税)", linkAge: {link:[[3]], age:[[0,1]] }, own: true, noType: "retail"},
            {id: "Amount", name: "销售额"},
          ]
        },
        line: {
          key: {col: 3, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "receiveQtyRate", noType: "retail", name: "到货率",icon: 'receiveQtyRate', check: true},
            {id: "receiveQtyRateYoYValue",noType: "retail", name: "到货率-同期值"},
            {id: "", name: ""},
            {id: "returnAmountRate", name: "退货率",  noType: "retail", icon: 'returnAmountRate'},
            {id: "returnAmountRateYoYValue",  noType: "retail", name: "退货率-同期值"},
          ]
        }
      },
    },

    /**
     * 毛利结构页面的 chart 指标
     * own: 表示当前指标独立 不进行任何拼接
     * check: 表示指标选中
     * inc: 特殊的指标比较（增幅 or 增长）
     * watch: 监听基础指标 用于其他指标拼接
     * basic: 标识基础指标
     * disKey: disable其他指标
     * hideKey: hide其他指标
     * and: 表示是同类型并且附加指标
     * get: 表示不同类型的指标拼接
     * forceIndex: 和noType相关 强制指定选中
     */
    grossProfit: {
      sale: {
        bar: {
          key: {col: 3, title: "柱状图1", watch: true, basic: true, forceIndex: 0},
          list: [
            {id: "Profit", name: "毛利额", check: true, disKey: {bar_add: [[1], [7]]}, icon: "allProfit", place: "bottom-left"},
            {id: "BusinessProfit", name: "预估毛利额", disKey: {bar_add: [[5], [7]]}, icon: "BusinessProfit"},
            {id: '', name: ''},
            {id: '', name: ''},
            {id: "", name: "", onlyTitle: "分项毛利"},
            {id: '', name: ''},
            {id: '', name: ''},
            {id: '', name: ''},
            {id: "SaleProfit", name: "销售毛利", disKey: {bar_add: [[2], [7]]}, icon: "allSaleProfit", place: "bottom-left"},
            {id: "RealFreshProfit", name: "生鲜加价(收货)"},
            {id: "RealDiffProfitTotal", name: "销售补差", disKey: {bar_add: [[3], [7]]}, icon: "allRealDiffProfit"},
            {
              id: "adjustCostTotal",
              name: "成本调整",
              noType: "distribution",
              disKey: {bar_add: [[4], [7]]},
              icon: "adjustCost"
            },
            {id: "declareProfitLossAdjustCost", name: "报损报溢", noType: "distribution"},
            {id: "checkProfitLossAdjustCost", name: "盘点损溢", noType: "distribution"},
            {id: "stockAdjustCost", name: "库存调整", noType: "distribution"},
            {id: "buyAdjustCost", name: "采购成本调整", noType: "distribution"},
            {id: "RealDiffProfit", name: "促销补差"},
            {
              id: "manualDiffProfit",
              name: "手工补差",
              needType: ["distribution", "joint"],
              noType: ["distribution", "joint", "retail"],
              icon: "manualDiff"
            },
            {
              id: "wholesaleDiffProfit",
              name: "批发补差",
              needType: ["distribution", "joint"],
              noType: ["distribution", "joint", "whole"]
            },
            {id: '', name: ''},
            {id: "RealFreshBizProfit", name: "生鲜加价(售出)"},
            {id: "EstDiffProfitTotal", name: "预估销售补差", icon: "allEstDiffProfit", place: "bottom-left"},
            {id: "EstDiffProfit", name: "预估促销补差", icon: "estDiffProfit"}
          ]
        },
        bar_add: {
          key: {col: 3, title: "柱状图2", and: true, forceIndex: 'end'},
          list: [
            {id: "YoYValue", name: "上年同期"},
            {id: "Profit", name: "毛利额", own: true},
            {id: "SaleProfit", name: "销售毛利", own: true},
            {id: "RealDiffProfitTotal", name: "销售补差", own: true},
            {id: "adjustCostTotal", name: "成本调整", noType: "distribution", own: true},
            {id: "BusinessProfit", name: "预估毛利额", own: true, icon: "BusinessProfit"},
            {id: "Amount", name: "销售额", own: true},
            {id: "", name: "无", check: true, own: true}
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "ProfitYoY", name: "毛利额-同比增幅"},
            {id: "ProfitToT", name: "毛利额-环比增幅"},
            {id: "ProfitPct", name: "毛利额-占比"},

            {id: "BusinessProfitYoY", name: "预估毛利额-同比增幅"},
            {id: "BusinessProfitToT", name: "预估毛利额-环比增幅"},
            {id: "BusinessProfitPct", name: "预估毛利额-占比"},

            {id: "SaleProfitYoY", name: "销售毛利-同比增幅"},
            {id: "SaleProfitToT", name: "销售毛利-环比增幅"},
            {id: "SaleProfitPct", name: "销售毛利-占比"},

            {id: "RealFreshProfitYoY", name: "生鲜加价(收货)-同比增幅"},
            {id: "RealFreshProfitToT", name: "生鲜加价(收货)-环比增幅"},
            {id: "RealFreshProfitPct", name: "生鲜加价(收货)-占比"},

            {id: "RealDiffProfitTotalYoY", name: "销售补差-同比增幅"},
            {id: "RealDiffProfitTotalToT", name: "销售补差-环比增幅"},
            {id: "RealDiffProfitTotalPct", name: "销售补差-占比"},

            {id: "adjustCostTotalYoY", name: "成本调整-同比增幅", noType: "distribution"},
            {id: "adjustCostTotalToT", name: "成本调整-环比增幅", noType: "distribution"},
            {id: "adjustCostTotalPct", name: "成本调整-占比", noType: "distribution"},

            {id: "ProfitRate", name: "毛利率", own: true, icon: "allProfitRate"},
            {id: "ProfitRateYoYValue", name: "上年同期-毛利率", own: true},
            {id: '', name: ''},

            {id: "BusinessProfitRate", name: "预估毛利率", own: true, icon: "allBusinessProfitRate"},
            {id: "BusinessProfitRateYoYValue", name: "上年同期-预估毛利率", own: true},

          ]

        }
      }
    },


    profit: {
      all: {
        bar: {
          key: {col: 4, title: "柱状图", watch: true, basic: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "allBizCompIncomeAmount", name: "综合收益额", check: true, icon: 'allBizCompIncomeAmount'},
            {id: "buyerBizCompIncomeAmount", name: "综合收益额(采购)"},
            {id: "storeBizCompIncomeAmount", name: "综合收益额(营运)"},

            {id: "channelSettleAmountTotal", name: "通道收益额"},
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)"},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)"},

            {id: "allProfit&channelSettleAmountTotal", name: "毛利额+通道收益额", last: true, stack: 'allProfit'},
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "allBizCompIncomeAmountYoY", name: "综合收益额-同比增幅"},
            {id: "allBizCompIncomeAmountToT", name: "综合收益额-环比增幅"},
            {id: "allBizCompIncomeAmountPct", name: "综合收益额-占比"},

            {id: "channelSettleAmountTotalYoY", name: "通道收益额-同比增幅"},
            {id: "channelSettleAmountTotalToT", name: "通道收益额-环比增幅"},
            {id: "channelSettleAmountTotalPct", name: "通道收益额-占比"},

            {id: "allBizCompIncomeAmountRate", name: "综合收益率", own: true, icon: 'allBizCompIncomeAmountRate'},
            {id: "allBizCompIncomeAmountRateYoYValue", name: "上年同期-综合收益率", own: true},
            {id: "", name: ""},

            {id: "channelSettleAmountTotalRate", name: "通道收益率", own: true, icon: 'channelSettleAmountTotalRate'},
            {id: "channelSettleAmountTotalRateYoYValue", name: "上年同期-通道收益率", own: true},
            {id: "", name: ""},

            {id: "allProfitOfAllBizCompIncomeAmount", name: "毛利额占比综合收益额", own: true, addSum: true},
            {id: "channelSettleAmountTotalOfAllBizCompIncomeAmount", name: "通道收益额占比综合收益额", own: true, addSum: true},

          ]
        }
      },
      buyer: {
        bar: {
          key: {col: 4, title: "柱状图", watch: true, basic: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "buyerBizCompIncomeAmount", name: "综合收益额(采购)", check: true, icon: 'allBizCompIncomeAmount'},
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)"},
            {id: "", name: ""},

            {id: "allProfit&buyerChannelSettleAmount", name: "毛利额+通道收益额(采购)", last: true, stack: 'buyerProfit'},
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "buyerBizCompIncomeAmountYoY", name: "综合收益额(采购)-同比增幅"},
            {id: "buyerBizCompIncomeAmountToT", name: "综合收益额(采购)-环比增幅"},
            {id: "buyerBizCompIncomeAmountPct", name: "综合收益额(采购)-占比"},

            {id: "buyerChannelSettleAmountYoY", name: "通道收益额(采购)-同比增幅"},
            {id: "buyerChannelSettleAmountToT", name: "通道收益额(采购)-环比增幅"},
            {id: "buyerChannelSettleAmountPct", name: "通道收益额(采购)-占比"},

            {id: "buyerBizCompIncomeAmountRate", name: "综合收益率(采购)", own: true, icon: 'allBizCompIncomeAmountRate'},
            {id: "buyerBizCompIncomeAmountRateYoYValue", name: "上年同期-综合收益率(采购)", own: true},
            {id: "", name: ""},

            {id: "buyerChannelSettleAmountRate", name: "通道收益率(采购)", own: true, icon: 'channelSettleAmountTotalRate'},
            {id: "buyerChannelSettleAmountRateYoYValue", name: "上年同期-通道收益率(采购)", own: true},
            {id: "", name: ""},

            {id: "allProfitOfBuyerBizCompIncomeAmount", name: "毛利额占比综合收益额(采购)", own: true, addSum: true},
            {id: "buyerChannelSettleAmountOfBuyerBizCompIncomeAmount", name: "通道收益额(采购)占比综合收益额(采购)", own: true, addSum: true},
          ]
        }
      },
      store: {
        bar: {
          key: {col: 4, title: "柱状图", watch: true, basic: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "storeBizCompIncomeAmount", name: "综合收益额(营运)", check: true, icon: 'allBizCompIncomeAmount'},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)"},
            {id: "", name: ""},

            {id: "allProfit&storeChannelSettleAmount", name: "毛利额+通道收益额(营运)", last: true, stack: 'storeProfit'},
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "storeBizCompIncomeAmountYoY", name: "综合收益额(营运)-同比增幅"},
            {id: "storeBizCompIncomeAmountToT", name: "综合收益额(营运)-环比增幅"},
            {id: "storeBizCompIncomeAmountPct", name: "综合收益额(营运)-占比"},

            {id: "storeChannelSettleAmountYoY", name: "通道收益额(营运)-同比增幅"},
            {id: "storeChannelSettleAmountToT", name: "通道收益额(营运)-环比增幅"},
            {id: "storeChannelSettleAmountPct", name: "通道收益额(营运)-占比"},

            {id: "storeBizCompIncomeAmountRate", name: "综合收益率(营运)", own: true, icon: 'allBizCompIncomeAmountRate'},
            {id: "storeBizCompIncomeAmountRateYoYValue", name: "上年同期-综合收益率(营运)", own: true},
            {id: "", name: ""},

            {id: "storeChannelSettleAmountRate", name: "通道收益率(营运)", own: true, icon: 'channelSettleAmountTotalRate'},
            {id: "storeChannelSettleAmountRateYoYValue", name: "上年同期-通道收益率(营运)", own: true},
            {id: "", name: ""},

            {id: "allProfitOfStoreBizCompIncomeAmount", name: "毛利额占比综合收益额(营运)", own: true, addSum: true},
            {id: "storeChannelSettleAmountOfStoreBizCompIncomeAmount", name: "通道收益额(营运)占比综合收益额(营运)", own: true, addSum: true},
          ]
        }
      }
    },

    // 财务分析-毛利
    financeAnalyze_grossProfitChart: {
      sale: {
        bar: {
          key: {col: 3, title: "柱状图1", watch: true, basic: true},
          list: [
            {id: "FinProfit", name: "财务毛利额", check: true, disKey: {bar_add: [[1], 'end']}, icon: "finProfit"},
            {id: '', name: ''},
            {id: '', name: ''},
            {id: '', name: ''},
            {id: "", name: "", onlyTitle: "分项毛利"},
            {id: '', name: ''},
            {id: '', name: ''},
            {id: '', name: ''},
            {id: "SaleFinProfit", name: "销售毛利", disKey: {bar_add: [[2], [7]]}, icon: "allSaleProfit"},
            {id: "RealFreshFinProfit", name: "生鲜加价", disKey: {bar_add: [[3], [7]]}},
            {id: "EstDiffFinProfitTotal", name: "销售补差", disKey: {bar_add: [[5], [7]]}, icon: "allRealDiffProfit"},
            {
              id: "adjustCostFinTotal",
              name: "成本调整",
              noType: "distribution",
              disKey: {bar_add: [[4], [7]]},
              icon: "adjustCost"
            },
            {id: "declareFinProfitLossAdjustCost", name: "报损报溢", noType: "distribution"},
            {id: "checkFinProfitLossAdjustCost", name: "盘点损溢", noType: "distribution"},
            {id: "stockFinAdjustCost", name: "库存调整", noType: "distribution"},
            {id: "buyFinAdjustCost", name: "采购成本调整", noType: "distribution"},
          ]
        },
        bar_add: {
          key: {col: 3, title: "柱状图2", and: true, forceIndex: 'end'},
          list: [
            {id: "YoYValue", name: "上年同期"},
            {id: "FinProfit", name: "财务毛利额", own: true},
            {id: "SaleFinProfit", name: "销售毛利", own: true},
            {id: "RealFreshFinProfit", name: "生鲜加价", own: true},
            {id: "adjustCostFinTotal", name: "成本调整", noType: "distribution",  own: true},
            {id: "EstDiffFinProfitTotal", name: "销售补差", own: true},
            {id: "Amount", name: "销售额", own: true},
            {id: "", name: "无", check: true, own: true}
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "FinProfitYoY", name: "财务毛利额-同比增幅"},
            {id: "FinProfitToT", name: "财务毛利额-环比增幅"},
            {id: "FinProfitPct", name: "财务毛利额-占比"},

            {id: "SaleFinProfitYoY", name: "销售毛利-同比增幅"},
            {id: "SaleFinProfitToT", name: "销售毛利-环比增幅"},
            {id: "SaleFinProfitPct", name: "销售毛利-占比"},

            {id: "RealFreshFinProfitYoY", name: "生鲜加价-同比增幅"},
            {id: "RealFreshFinProfitToT", name: "生鲜加价-环比增幅"},
            {id: "RealFreshFinProfitPct", name: "生鲜加价-占比"},

            {id: "EstDiffFinProfitTotalYoY", name: "销售补差-同比增幅"},
            {id: "EstDiffFinProfitTotalToT", name: "销售补差-环比增幅"},
            {id: "EstDiffFinProfitTotalPct", name: "销售补差-占比"},

            {id: "adjustCostFinTotalYoY", name: "成本调整-同比增幅", noType: "distribution"},
            {id: "adjustCostFinTotalToT", name: "成本调整-环比增幅", noType: "distribution"},
            {id: "adjustCostFinTotalPct", name: "成本调整-占比", noType: "distribution"},


            {id: "FinProfitRate", name: "财务毛利率", own: true, icon: "finProfitRate"},
            {id: "FinProfitRateYoYValue", name: "上年同期-财务毛利率", own: true},


          ]
        }
      }
    },

    // 财务分析-收益
    financeAnalyze_profit: {
      all: {
        bar: {
          key: {col: 4, title: "柱状图", watch: true, basic: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "allFinCompIncomeAmount", name: "财务综合收益额", check: true, icon: "finCompIncomeAmount"},
            {id: "buyerFinCompIncomeAmount", name: "财务综合收益额(采购)"},
            {id: "storeFinCompIncomeAmount", name: "财务综合收益额(营运)"},

            {id: "channelSettleAmountTotal", name: "通道收益额"},
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)"},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)"},

            {id: "buyerChannelSettleAmount&storeChannelSettleAmount", name: "通道收益额(采购+营运)", last: true, stack: 'allFinProfit'},
          ]
        },
        line: {
          key: {col: 4, title: "折线图", checkbox: true},
          list: [
            {id: "allFinCompIncomeAmountYoY", name: "财务综合收益额-同比增幅"},
            {id: "allFinCompIncomeAmountToT", name: "财务综合收益额-环比增幅"},
            {id: "allFinCompIncomeAmountPct", name: "财务综合收益额-占比"},

            {id: "channelSettleAmountTotalYoY", name: "通道收益额-同比增幅"},
            {id: "channelSettleAmountTotalToT", name: "通道收益额-环比增幅"},
            {id: "channelSettleAmountTotalPct", name: "通道收益额-占比"},

            {id: "allFinCompIncomeAmountRate", name: "财务综合收益率", own: true, icon: "finCompIncomeAmountRate"},
            {id: "allFinCompIncomeAmountRateYoYValue", name: "上年同期-财务综合收益率", own: true, son: true},
            {id: "", name: ""},

            {id: "channelSettleAmountTotalRate", name: "通道收益率", own: true, icon: "finChannelSettleAmountTotalRate"},
            {id: "channelSettleAmountTotalRateYoYValue", name: "上年同期-通道收益率", own: true, son: true},
            {id: "", name: ""},

            {id: "allFinProfitOfAllFinCompIncomeAmount", name: "财务毛利额占比财务综合收益额", own: true, addSum: true},
            {id: "channelSettleAmountTotalOfAllFinCompIncomeAmount", name: "通道收益额占比财务综合收益额", own: true, addSum: true},
            {id: "", name: ""},
          ]
        }
      },
      buyer: {
        bar: {
          key: {col: 4, title: "柱状图", watch: true, basic: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "buyerFinCompIncomeAmount", name: "财务综合收益额(采购)", check: true, icon: "finCompIncomeAmount"},
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)"},
          ]
        },
        line: {
          key: {col: 4, title: "折线图", checkbox: true},
          list: [
            {id: "buyerFinCompIncomeAmountYoY", name: "财务综合收益额(采购)-同比增幅"},
            {id: "buyerFinCompIncomeAmountToT", name: "财务综合收益额(采购)-环比增幅"},
            {id: "buyerFinCompIncomeAmountPct", name: "财务综合收益额(采购)-占比"},

            {id: "buyerChannelSettleAmountYoY", name: "通道收益额(采购)-同比增幅"},
            {id: "buyerChannelSettleAmountToT", name: "通道收益额(采购)-环比增幅"},
            {id: "buyerChannelSettleAmountPct", name: "通道收益额(采购)-占比"},

            {id: "buyerFinCompIncomeAmountRate", name: "财务综合收益率(采购)", own: true, icon: "finCompIncomeAmountRate"},
            {id: "buyerFinCompIncomeAmountRateYoYValue", name: "上年同期-财务综合收益率(采购)", own: true, son: true},
            {id: "", name: ""},

            {id: "buyerChannelSettleAmountRate", name: "通道收益率(采购)", own: true, icon: "finChannelSettleAmountTotalRate"},
            {id: "buyerChannelSettleAmountRateYoYValue", name: "上年同期-通道收益率(采购)", own: true, son: true},
            {id: "", name: ""},

            {id: "allFinProfitOfBuyerFinCompIncomeAmount", name: "财务毛利额占比财务综合收益额(采购)", own: true, addSum: true},
            {id: "buyerChannelSettleAmountOfBuyerFinCompIncomeAmount", name: "通道收益额(采购)占比财务综合收益额(采购)", own: true, addSum: true},
            {id: "", name: ""},
          ]
        }
      },
      store: {
        bar: {
          key: {col: 4, title: "柱状图", watch: true, basic: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "storeFinCompIncomeAmount", name: "财务综合收益额(营运)", check: true, icon: "finCompIncomeAmount"},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)"},
          ]
        },
        line: {
          key: {col: 4, title: "折线图", checkbox: true},
          list: [
            {id: "storeFinCompIncomeAmountYoY", name: "财务综合收益额(营运)-同比增幅"},
            {id: "storeFinCompIncomeAmountToT", name: "财务综合收益额(营运)-环比增幅"},
            {id: "storeFinCompIncomeAmountPct", name: "财务综合收益额(营运)-占比"},

            {id: "storeChannelSettleAmountYoY", name: "通道收益额(营运)-同比增幅"},
            {id: "storeChannelSettleAmountToT", name: "通道收益额(营运)-环比增幅"},
            {id: "storeChannelSettleAmountPct", name: "通道收益额(营运)-占比"},

            {id: "storeFinCompIncomeAmountRate", name: "财务综合收益率(营运)", own: true, icon: "finCompIncomeAmountRate"},
            {id: "storeFinCompIncomeAmountRateYoYValue", name: "上年同期-综合收益率(营运)", own: true, son: true},
            {id: "", name: ""},

            {id: "storeChannelSettleAmountRate", name: "通道收益率(营运)", own: true, icon: "finChannelSettleAmountTotalRate"},
            {id: "storeChannelSettleAmountRateYoYValue", name: "上年同期-通道收益率(营运)", own: true, son: true},
            {id: "", name: ""},

            {id: "allFinProfitOfStoreFinCompIncomeAmount", name: "财务毛利额占比财务综合收益额(营运)", own: true, addSum: true},
            {id: "storeChannelSettleAmountOfStoreFinCompIncomeAmount", name: "通道收益额(营运)占比财务综合收益额(营运)", own: true, addSum: true},
            {id: "", name: ""},
          ]
        }
      }
    },

    //ABC分析 - 结构分析
    abc_structure: {
      sale: {
        bar: {
          key: {
            col: 4, title: "柱状图", basic: true, watch: true,
            last: {id: "YoYValue", name: "上年同期"}, forceIndex: 0
          },
          list: [
            {
              id: "skuUnit_A&skuUnit_B&skuUnit_C",
              name: "有售sku数A类商品+有售sku数B类商品+有售sku数C类商品",
              check: true,
              own: true,
              stack: 'sku',
              arrayIndex: 0
            },
            {
              id: "saleAmount_A&saleAmount_B&saleAmount_C",
              name: "销售额A类商品+销售额B类商品+销售额B类商品",
              own: true,
              arrayIndex: 0,
              stack: 'sale',
            },
            {
              id: "profitA&profitB&profitC",
              name: "财务毛利A类商品+财务毛利B类商品+财务毛利C类商品",
              own: true,
              ind: true,
              stack: 'profit'
            },
            {
              id: "stockCostAvg_A&stockCostAvg_B&stockCostAvg_C",
              name: "日均库存成本A类商品+日均库存成本B类商品+日均库存成本C类商品",
              own: true,
              stack: 'Cost',
              arrayIndex: 0
            },
            {
              id: "layStoreCnt_A&layStoreCnt_B&layStoreCnt_C",
              name: "单品单店铺市数A类商品+单品单店铺市数B类商品+单品单店铺市数C类商品",
              own: true,
              stack: 'lay',
              arrayIndex: 0
            },
            {
              id: "orderQty_A&orderQty_B&orderQty_C",
              name: "订货数数量A类商品+订货数数量B类商品+订货数数量C类商品",
              own: true,
              stack: 'order',
              arrayIndex: 0
            },
          ]
        },
        line: {
          key: {col: 6, title: "折线图", get: true},
          list: [
            {id: "stockTurnover_A&stockTurnover_B&stockTurnover_C", name: "周转天数A类商品+周转天数B类商品+周转天数C类商品", own: true},
            {id: "arrivalRate_A&arrivalRate_B&arrivalRate_C", name: "到货率A类商品+到货率B类商品+到货率C类商品", own: true},
            {id: "", name: "无", check: true, own: true}
          ]
        }
      }
    },

    // 新品SKU 对比分析
    newSkuContrastAnalyze: {
      all: {
        bar: {
          key: {col: 3, title: "图表指标选择", watch: true, basic: true, bindLine: ["YoY"], last: {id: "YoYValue", name: "上年同期", isHidden: true, active: true, keepActive: true}},
          list: [
            {id: "newImportSkuCnt", name: "引入SKU数"},
            {id: "newSaleSkuCnt", name: "有售SKU数"},
            {id: "newCanSaleSkuCnt", name: "可售SKU数"},
            {id: "", name: ""},

            {id: "newAllAmount", name: "销售额", check: true},
            {id: "newAllProfit", name: "毛利额"},
            {id: "newSingleProductAllAmount", name: "单品销售额"},
            {id: "newSingleProductAllProfit", name: "单品毛利额"},

            {id: "newSingleStoreProductAllAmount", name: "单店单品销售额"},
            {id: "newSingleStoreProductAllProfit", name: "单店单品毛利额"},
            {id: "newSingleProductStoreCnt", name: "平均铺货门店数"},
            {id: "newSaleDays", name: "经销周转天数"},

            {id: "newImportSkuCnt&newSaleSkuCnt", name: "新品引入SKU数 + 新品有售SKU数", col: 6, disLast: true},
            {id: "newImportSkuCnt&newCanSaleSkuCnt", name: "新品引入SKU数 + 新品可售SKU数", col: 6, disLast: true},
            {id: "newCanSaleSkuCnt&newSaleSkuCnt", name: "新品可售SKU数 + 新品有售SKU数", col: 6, disLast: true},
          ]
        },
        line: {
          key: {col: 4, title: "折线图", checkbox: true, isHidden: true},
          list: [
            {id: "newImportSkuCntYoY", name: "引入SKU数-同比增幅"},
            {id: "newSaleSkuCntYoY", name: "有售SKU数-同比增幅"},
            {id: "newCanSaleSkuCntYoY", name: "可售SKU数-同比增幅"},

            {id: "newAllAmountYoY", name: "销售额-同比增幅", check: true},
            {id: "newAllProfitYoY", name: "毛利额-同比增幅"},
            {id: "newSingleProductAllAmountYoY", name: "单品销售额-同比增幅"},
            {id: "newSingleProductAllProfitYoY", name: "单品毛利额-同比增幅"},

            {id: "newSingleStoreProductAllAmountYoY", name: "单店单品销售额-同比增幅"},
            {id: "newSingleStoreProductAllProfitYoY", name: "单店单品毛利额-同比增幅"},
            {id: "newSingleProductStoreCntYoY", name: "平均铺货门店数-同比增幅"},
            {id: "newSaleDaysYoY", name: "周转天数-同比增幅"},
          ]
        }
      },
    },

    //Sku对比分析
    skuContrastAnalyze: {
      all: {
        bar: {
          key: {col: 3, title: "图表指标选择", watch: true, basic: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "saleSkuCnt", name: "有售SKU数", check: true,},
            {id: "canSaleSkuCnt", name: "可售SKU数"},
            {id: "", name: ""},
            {id: "", name: ""},
            {id: "singleProductAllAmount", name: "单品销售额"},
            {id: "singleProductAllProfit", name: "单品毛利额"},

            {id: "singleStoreProductAllAmount", name: "单店单品销售额"},
            {id: "singleStoreProductAllProfit", name: "单店单品毛利额"},

            {id: "allAmount", name: "销售额"},
            {id: "allProfit", name: "毛利额"},
            {id: "canSaleSkuCnt&saleSkuCnt", name: "可售SKU数 + 有售SKU数", col: 6, last : true},
          ]
        },
        line: {
          key: {col: 4, title: "折线图", checkbox: true},
          list: [
            {id: "saleSkuCntYoY", name: "有售SKU数-同比增幅"},
            {id: "canSaleSkuCntYoY", name: "可售SKU数-同比增幅"},
            {id: "", name: ""},
            {id: "singleProductAllAmountYoY", name: "单品销售额-同比增幅"},
            {id: "singleProductAllProfitYoY", name: "单品毛利额-同比增幅"},
            {id: "singleStoreProductAllAmountYoY", name: "单店单品销售额-同比增幅"},
            {id: "allAmountYoY", name: "销售额-同比增幅"},
            {id: "allProfitYoY", name: "毛利额-同比增幅"},
            {id: "singleStoreProductAllProfitYoY", name: "单店单品毛利额-同比增幅"}
          ]
        }
      },
    },
    channelProfit: {
      all: {
        bar: {
          key: {col: 4, title: "柱状图", watch: true, basic: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "channelSettleAmountTotal", name: "通道收益额", check: true},
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)"},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)"},
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "channelSettleAmountTotalYoY", name: "通道收益额-同比增幅"},
            {id: "channelSettleAmountTotalToT", name: "通道收益额-环比增幅"},
            {id: "channelSettleAmountTotalPct", name: "通道收益额-占比"},

            {id: "channelSettleAmountTotalRate", name: "通道收益率", own: true, icon: 'channelSettleAmountTotalRate'},
            {id: "channelSettleAmountTotalRateYoYValue", name: "上年同期-通道收益率", own: true},
          ]
        }
      },
      buyer: {
        bar: {
          key: {col: 4, title: "柱状图", watch: true, basic: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)",  check: true}
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "buyerChannelSettleAmountYoY", name: "通道收益额(采购)-同比增幅"},
            {id: "buyerChannelSettleAmountToT", name: "通道收益额(采购)-环比增幅"},
            {id: "buyerChannelSettleAmountPct", name: "通道收益额(采购)-占比"},

            {id: "buyerChannelSettleAmountRate", name: "通道收益率(采购)", own: true, icon: 'channelSettleAmountTotalRate'},
            {id: "buyerChannelSettleAmountRateYoYValue", name: "上年同期-通道收益率(采购)", own: true},
          ]
        }
      },
      store: {
        bar: {
          key: {col: 4, title: "柱状图", watch: true, basic: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", check: true},
            {id: "storeRentChannelSettleAmount", name: "通道收益额(租金收入)", disKey:{line:[[3,4]]}},
            {id: "storeWithRentChannelSettleAmount", name: "通道收益额(营运_含租金收入)", disKey:{line:[[3,4]]}}
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "storeChannelSettleAmountYoY", name: "通道收益额(营运)-同比增幅"},
            {id: "storeChannelSettleAmountToT", name: "通道收益额(营运)-环比增幅"},
            {id: "storeChannelSettleAmountPct", name: "通道收益额(营运)-占比"},

            {id: "storeChannelSettleAmountRate", name: "通道收益率(营运)", own: true, icon: 'channelSettleAmountTotalRate'},
            {id: "storeChannelSettleAmountRateYoYValue", name: "上年同期-通道收益率(营运)", own: true}
          ]
        }
      },
      storeOther: {
        bar: {
          key: {col: 4, title: "柱状图", watch: true, basic: true, last: {id: "YoYValue", name: "上年同期"}},
          list: [
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", check: true},
          ]
        },
        line: {
          key: {col: 4, title: "折线图(最多选择2项)", checkbox: true},
          list: [
            {id: "storeChannelSettleAmountYoY", name: "通道收益额(营运)-同比增幅"},
            {id: "storeChannelSettleAmountToT", name: "通道收益额(营运)-环比增幅"},
            {id: "storeChannelSettleAmountPct", name: "通道收益额(营运)-占比"},

            {id: "storeChannelSettleAmountRate", name: "通道收益率(营运)", own: true, icon: 'channelSettleAmountTotalRate'},
            {id: "storeChannelSettleAmountRateYoYValue", name: "上年同期-通道收益率(营运)", own: true}
          ]
        }
      }
    }
  });
