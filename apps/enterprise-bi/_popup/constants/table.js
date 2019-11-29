angular.module("hs.popups")
  .constant("Table", {
    /**
     * model: 表示指标初始化选中
     * col: 表示获取当前指标列数的除数 exp：12 / col
     * join: 大于0时 表示当前指标需要拼接其他指标 权重越小表示越靠前 最小值为1；
     *       等于0时 表示当前指标不需要拼接其他指标 但是需要拼接业务类型（经销 or 联营 。。。）
     *       等于-1时 表示当前指标独立 不需要拼接
     * disKey: 是否disable的决定指标
     * keepActive: 可选时，指标是否保持着有值
     * inc: 当同比增长率的字段名称包含Inc时
     * two: 代表当前选项会输出两个指标,
     * abc: 代表需拼接ABC
     * noNeedAll:true 代表不需要全选功能；
     * disValue：[Array],
     * noType: true表示不拼接任何范围里的指标，数组表示会拼接某些指标
     * readOnly: 只读不受全选控制
     */

    // 收益页面的 table 指标(采购)
    profit: {
      buyer: { // 采购
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "buyerBizCompIncomeAmount", name: "综合收益额(采购)", join: 1, model: true, icon: 'allBizCompIncomeAmount'},
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)", join: 1, model: true},
            {id: "allProfit", name: "毛利额", join: 1, model: true},
            {
              id: "buyerBizCompIncomeAmountRate",
              name: "综合收益率(采购)",
              join: 1,
              inc: true,
              icon: 'allBizCompIncomeAmountRate'
            },
            {
              id: "buyerChannelSettleAmountRate",
              name: "通道收益率(采购)",
              join: 1,
              inc: true,
              icon: 'channelSettleAmountTotalRate'
            },
            {id: "", name: ""},
            {id: "allProfitOfBuyerBizCompIncomeAmount", name: "毛利额占比综合收益额(采购)", join: -1},
            {id: "buyerChannelSettleAmountOfBuyerBizCompIncomeAmount", name: "通道收益额(采购)占比综合收益额(采购)", join: -1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]}
          ]
        },
        get: {
          all: false,
          key: {name: '收益(实收)', col: 4, join: 1},
          list: [
            {id: "buyerFixSettleAmount", name: "通道收益额(采购固定费用)", join: 1},
            {id: "buyerChangeSettleAmount", name: "通道收益额(采购变动费用)", join: 1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true, disable: true},
            {id: "ToTValue", name: "环比", join: 2, two: true, disable: true},
            {id: "Pct", name: "占比", join: 2, disable: true}
          ]
        },
        // lose: {
        //   all: false,
        //   key: {name: '收益(已到期未收)', col: 4},
        //   list: [
        //     {id: "buyerChannelPendingAmount", name: "通道收益额(采购已到期未收)", join: -1},
        //     {id: "buyerChangePendingAmount", name: "通道收益额(采购变动费用-已到期未收)", join: -1},
        //     {id: "buyerFixPendingAmount", name: "通道收益额(采购固定费用-已到期未收)", join: -1}
        //   ]
        // }
      },
      all: { // 关键用户
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "allBizCompIncomeAmount", name: "综合收益额", join: 1, model: true, icon: 'allBizCompIncomeAmount'},
            {id: "channelSettleAmountTotal", name: "通道收益额", join: 1, model: true},
            {id: "allProfit", name: "毛利额", join: 1, model: true},
            {id: "allBizCompIncomeAmountRate", name: "综合收益率", join: 1, inc: true, icon: 'allBizCompIncomeAmountRate'},
            {
              id: "channelSettleAmountTotalRate",
              name: "通道收益率",
              join: 1,
              inc: true,
              icon: 'channelSettleAmountTotalRate'
            },
            {id: "", name: ""},
            {id: "allProfitOfAllBizCompIncomeAmount", name: "毛利额占比综合收益额", join: -1},
            {id: "channelSettleAmountTotalOfAllBizCompIncomeAmount", name: "通道收益额占比综合收益额", join: -1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]}
          ]
        },
        getBuyer: {
          all: false,
          key: {name: '收益(采购)', col: 4, join: 1},
          list: [
            {id: "buyerBizCompIncomeAmount", name: "综合收益额(采购)", join: 1, model: true},
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)", join: 1, model: true},
            {id: "buyerFixSettleAmount", name: "通道收益额(采购固定费用)", join: 1, model: false},

            {id: "buyerBizCompIncomeAmountRate", name: "综合收益率(采购)", join: 1, inc: true},
            {id: "buyerChannelSettleAmountRate", name: "通道收益率(采购)", join: 1, inc: true},
            {id: "buyerChangeSettleAmount", name: "通道收益额(采购变动费用)", join: 1},

            {id: "allProfitOfBuyerBizCompIncomeAmount", name: "毛利额占比综合收益额(采购)", join: -1},
            {id: "buyerChannelSettleAmountOfBuyerBizCompIncomeAmount", name: "通道收益额(采购)占比综合收益额(采购)", join: -1},
            {id: "", name: ""},

            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2, 5]}
          ]
        },
        getStore: {
          all: false,
          key: {name: '收益(营运)', col: 4, join: 1},
          list: [
            {id: "storeBizCompIncomeAmount", name: "综合收益额(营运)", join: 1, model: true},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", join: 1, model: true},
            {id: "", name: ""},

            {id: "storeBizCompIncomeAmountRate", name: "综合收益率(营运)", join: 1, inc: true},
            {id: "storeChannelSettleAmountRate", name: "通道收益率(营运)", join: 1, inc: true},
            {id: "", name: ""},

            {id: "allProfitOfStoreBizCompIncomeAmount", name: "毛利额占比综合收益额(营运)", join: -1},
            {id: "storeChannelSettleAmountOfStoreBizCompIncomeAmount", name: "通道收益额(营运)占比综合收益额(营运)", join: -1},
            {id: "", name: ""},

            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1]}
          ]
        },
        // lose: {
        //   all: false,
        //   key: {name: '收益(已到期未收)', col: 4},
        //   list: [
        //     {id: "channelPendingAmountTotal", name: "通道收益额(已到期未收)", join: -1},
        //     {id: "storeChannelPendingAmount", name: "通道收益额(营运已到期未收)", join: -1},
        //     {id: "", name: ""},
        //     {id: "buyerChannelPendingAmount", name: "通道收益额(采购已到期未收)", join: -1},
        //     {id: "buyerChangePendingAmount", name: "通道收益额(采购变动费用-已到期未收)", join: -1},
        //     {id: "buyerFixPendingAmount", name: "通道收益额(采购固定费用-已到期未收)", join: -1}
        //   ]
        // }
      },
      store: {
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "storeBizCompIncomeAmount", name: "综合收益额(营运)", join: 1, model: true, icon: 'allBizCompIncomeAmount'},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", join: 1, model: true},
            {id: "allProfit", name: "毛利额", join: 1, model: true},
            {
              id: "storeBizCompIncomeAmountRate",
              name: "综合收益率(营运)",
              join: 1,
              inc: true,
              icon: 'allBizCompIncomeAmountRate'
            },
            {
              id: "storeChannelSettleAmountRate",
              name: "通道收益率(营运)",
              join: 1,
              inc: true,
              icon: 'channelSettleAmountTotalRate'
            },
            {id: "", name: ""},
            {id: "allProfitOfStoreBizCompIncomeAmount", name: "毛利额占比综合收益额(营运)", join: -1},
            {id: "storeChannelSettleAmountOfStoreBizCompIncomeAmount", name: "通道收益额(营运)占比综合收益额(营运)", join: -1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]}
          ]
        },
        // lose: {
        //   all: false,
        //   key: {name: '收益(已到期未收)', col: 4},
        //   list: [
        //     {id: "storeChannelPendingAmount", name: "通道收益额(营运已到期未收)", join: -1}
        //   ]
        // }
      }
    },

    // 财务收益页面的 table 指标(采购)
    financeAnalyze_profitTable: {
      buyer: {
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "buyerFinCompIncomeAmount", name: "财务综合收益额(采购)", join: 1, model: true, icon: "finCompIncomeAmount"},
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)", join: 1, model: true},
            {id: "allFinProfit", name: "财务毛利额", join: 1, model: true},
            {
              id: "buyerFinCompIncomeAmountRate",
              name: "财务综合收益率(采购)",
              join: 1,
              inc: true,
              icon: "finCompIncomeAmountRate"
            },
            {
              id: "buyerChannelSettleAmountRate",
              name: "通道收益率(采购)",
              join: 1,
              inc: true,
              icon: "finChannelSettleAmountTotalRate"
            },
            {id: "", name: ""},
            {id: "allFinProfitOfBuyerFinCompIncomeAmount", name: "财务毛利额占比财务综合收益额(采购)", join: -1},
            {id: "buyerChannelSettleAmountOfBuyerFinCompIncomeAmount", name: "通道收益额(采购)占比财务综合收益额(采购)", join: -1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]}
          ]
        },
        get: {
          all: false,
          key: {name: '通道收益', col: 4, join: 1},
          list: [
            {id: "buyerFixSettleAmount", name: "通道收益额(采购固定费用)", join: 1},
            {id: "buyerChangeSettleAmount", name: "通道收益额(采购变动费用)", join: 1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true, disable: true},
            {id: "ToTValue", name: "环比", join: 2, two: true, disable: true},
            {id: "Pct", name: "占比", join: 2, disable: true}
          ]
        },

      },
      all: {
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "allFinCompIncomeAmount", name: "财务综合收益额", join: 1, model: true, icon: "finCompIncomeAmount"},
            {id: "channelSettleAmountTotal", name: "通道收益额", join: 1, model: true},
            {id: "allFinProfit", name: "财务毛利额", join: 1, model: true},

            {id: "allFinCompIncomeAmountRate", name: "财务综合收益率", join: 1, inc: true, icon: "finCompIncomeAmountRate"},
            {
              id: "channelSettleAmountTotalRate",
              name: "通道收益率",
              join: 1,
              inc: true,
              icon: "finChannelSettleAmountTotalRate"
            },
            {id: "", name: ""},

            {id: "allFinProfitOfAllFinCompIncomeAmount", name: "财务毛利额占比财务综合收益额", join: -1},
            {id: "channelSettleAmountTotalOfAllFinCompIncomeAmount", name: "通道收益额占比财务综合收益额", join: -1},
            {id: "", name: ""},

            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]}
          ]
        },
        getBuyer: {
          all: false,
          key: {name: '收益(采购)', col: 4, join: 1},
          list: [
            {id: "buyerFinCompIncomeAmount", name: "财务综合收益额(采购)", join: 1, model: true},
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)", join: 1, model: true},
            {id: "buyerFixSettleAmount", name: "通道收益额(采购固定费用)", join: 1},

            {id: "buyerFinCompIncomeAmountRate", name: "财务综合收益率(采购)", join: 1, inc: true},
            {id: "buyerChannelSettleAmountRate", name: "通道收益率(采购)", join: 1, inc: true},
            {id: "buyerChangeSettleAmount", name: "通道收益额(采购变动费用)", join: 1},

            {id: "allFinProfitOfBuyerFinCompIncomeAmount", name: "财务毛利额占比财务综合收益额(采购)", join: -1},
            {id: "buyerChannelSettleAmountOfBuyerFinCompIncomeAmount", name: "通道收益额(采购)占比财务综合收益额(采购)", join: -1},
            {id: "", name: ""},

            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2, 5]}
          ]
        },

        getStore: {
          all: false,
          key: {name: '收益(营运)', col: 4, join: 1},
          list: [
            {id: "storeFinCompIncomeAmount", name: "财务综合收益额(营运)", join: 1, model: true},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", join: 1, model: true},
            {id: "", name: ""},

            {id: "storeFinCompIncomeAmountRate", name: "财务综合收益率(营运)", join: 1, inc: true},
            {id: "storeChannelSettleAmountRate", name: "通道收益率(营运)", join: 1, inc: true},
            {id: "", name: ""},

            {id: "allFinProfitOfStoreFinCompIncomeAmount", name: "财务毛利额占比财务综合收益额(营运)", join: -1},
            {id: "storeChannelSettleAmountOfStoreFinCompIncomeAmount", name: "通道收益额(营运)占比财务综合收益额(营运)", join: -1},
            {id: "", name: ""},

            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1]}
          ]
        },

      },
      store: {
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "storeFinCompIncomeAmount", name: "财务综合收益额(营运)", join: 1, model: true, icon: "finCompIncomeAmount"},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", join: 1, model: true},
            {id: "allFinProfit", name: "财务毛利额", join: 1, model: true},
            {
              id: "storeFinCompIncomeAmountRate",
              name: "财务综合收益率(营运)",
              join: 1,
              inc: true,
              icon: "finCompIncomeAmountRate"
            },
            {
              id: "storeChannelSettleAmountRate",
              name: "通道收益率(营运)",
              join: 1,
              inc: true,
              icon: "finChannelSettleAmountTotalRate"
            },
            {id: "", name: ""},
            {id: "allFinProfitOfStoreFinCompIncomeAmount", name: "财务毛利额占比财务综合收益额(营运)", join: -1},
            {id: "storeChannelSettleAmountOfStoreFinCompIncomeAmount", name: "通道收益额(营运)占比财务综合收益额(营运)", join: -1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]}
          ]
        },
      }
    },

    // 毛利结构页面的 table 指标
    grossProfit: {
      whole: {
        all: false,
        key: {
          name: '范围', col: 2, join: 1,
          disValue: [
            {cause: [0, 1], effect: {details: [3], adjust: [0, 1, 2, 3]}},
            {cause: [0, 1, 2, 3], effect: {stock: [1]}},
            {cause: [0, 1, 2, 4], effect: {stock: [2]}},
            {
              cause: [0, 1, 2, 3, 4], effect: {
                profit: [0, 1],
                details: [0, 1, 2],
                other: [0, 1, 2],
                stock: [0],
                businessProfit: [0, 1, 2, 3, 4, 5]
              }
            }
          ]
        },
        list: [
          {id: "all", name: "全部", model: true},
          {id: "distribution", name: "经销"},
          {id: "joint", name: "联营"},
          {id: "retail", name: "零售"},
          {id: "whole", name: "批发"}
        ]
      },
      profit: {
        all: false,
        key: {name: '毛利', col: 3, join: 2},
        list: [
          {id: "Profit", name: "毛利额", join: 1, model: true, icon: "allProfit"},
          {id: "ProfitRate", name: "毛利率", join: 1, model: true, inc: true, icon: 'allProfitRate'},
          {id: "", name: ""},
          {id: "", name: ""},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0]}
        ]
      },
      details: {
        all: false,
        key: {name: '分项毛利', col: 3, join: 2},
        list: [
          {id: "SaleProfit", name: "销售毛利", join: 1, model: true, icon: "allSaleProfit"},
          {id: "RealFreshProfit", name: "生鲜加价(收货)", join: 1, model: true},
          {id: "RealDiffProfitTotal", name: "销售补差", join: 1, model: true, icon: "allRealDiffProfit"},
          {id: "adjustCostTotal", name: "成本调整", join: 1, model: true, noType: true, icon: "adjustCost"},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2}
        ]
      },
      adjust: {
        all: false,
        key: {name: '成本调整', col: 3, join: 2},
        list: [
          {id: "declareProfitLossAdjustCost", name: "报损报溢", join: 1, noType: true},
          {id: "checkProfitLossAdjustCost", name: "盘点损溢", join: 1, noType: true},
          {id: "stockAdjustCost", name: "库存调整", join: 1, noType: true},
          {id: "buyAdjustCost", name: "采购成本调整", join: 1, noType: true},
          {id: "YoYValue", name: "同比", join: 2, two: true, disable: true},
          {id: "ToTValue", name: "环比", join: 2, two: true, disable: true},
          {id: "Pct", name: "占比", join: 2, disable: true}
        ]
      },
      stock: {
        all: false,
        key: {name: '销售补差', col: 3, join: 2},
        list: [
          {id: "RealDiffProfit", name: "促销补差", join: 1},
          {id: "manualDiffProfit", name: "手工补差", join: 1, noType: ["distribution", "joint"], icon: "manualDiff"},
          {id: "wholesaleDiffProfit", name: "批发补差", join: 1, noType: ["distribution", "joint"]},
          {id: "", name: ""},
          {id: "YoYValue", name: "同比", join: 2, two: true, disable: true},
          {id: "ToTValue", name: "环比", join: 2, two: true, disable: true},
          {id: "Pct", name: "占比", join: 2, disable: true}
        ]
      },
      businessProfit: {
        all: false,
        key: {name: '预估毛利', col: 4, join: 2},
        list: [
          {id: "BusinessProfit", name: "预估毛利额", join: 1, icon: "BusinessProfit"},
          {id: "BusinessProfitRate", name: "预估毛利率", join: 1, inc: true, icon: "allBusinessProfitRate"},
          {id: "", name: ""},
          {id: "RealFreshBizProfit", name: "生鲜加价(售出)", join: 1},
          {id: "EstDiffProfitTotal", name: "预估销售补差", join: 1, icon: "allEstDiffProfit"},
          {id: "EstDiffProfit", name: "预估促销补差", join: 1, icon: 'estDiffProfit'},
          {id: "YoYValue", name: "同比", join: 2, two: true, disable: true},
          {id: "ToTValue", name: "环比", join: 2, two: true, disable: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0, 2, 4, 5], disable: true}
        ]
      }
    },


    // 销售库存页面的 table 指标
    saleStock: {
      whole: {
        all: false,
        key: {
          name: '范围', col: 2, join: 1,
          disValue: [
            {cause: [0, 1, 2, 3, 4], effect: {sale: [0, 1, 2, 3]}},
            {cause: [0, 1, 2, 3, 4], effect: {profit: [0, 1]}},
            {cause: [0, 3], effect: {order: [0, 1, 2, 3]}}
          ]
        },
        list: [
          {id: "all", name: "全部", model: true},
          {id: "distribution", name: "经销"},
          {id: "joint", name: "联营"},
          {id: "retail", name: "零售"},
          {id: "whole", name: "批发"}
        ]
      },
      sale: {
        all: false,
        key: {name: '销售', col: 3, join: 2},
        list: [
          {id: "Amount", name: "销售额", join: 1, model: true},
          {id: "Unit", name: "销售数", join: 1, model: true},
          {id: "Cost", name: "销售成本", join: 1},
          {id: "UnitPrice", name: "平均销售单价", join: 1},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]},
          {id: "OfLH", name: "占比联华类别", join: 2, disKey: [0], icon: "PctHsCat"}
        ]
      },
      profit: {
        all: false,
        key: {name: '毛利', col: 4, join: 2},
        list: [
          {id: "Profit", name: "毛利额", join: 1, model: true},
          {id: "ProfitRate", name: "毛利率", join: 1, model: true, inc: true, icon: 'allProfitRate'},
          {id: "", name: ""},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0]}
        ]
      },
      stock: {
        all: false,
        key: {name: '库存', col: 4},
        list: [
          {id: "stockCost", name: "日均库存金额", join: 1, model: true},
          {id: "stockQty", name: "日均库存数", join: 1, model: true},
          {id: "saleDays", name: "经销周转天数", join: 1, model: true, inc: true, icon: 'saleDays'},

          {id: "buyoutStockCost", name: "日均库存金额(买断)", join: 1},
          {id: "buyoutStockQty", name: "日均库存数(买断)", join: 1},
          {id: "buyoutSaleDays", name: "经销周转天数(买断)", join: 1, inc: true},

          {id: "stockCostLatest", name: "最新库存金额", join: -1, noType: true},
          {id: "stockQtyLatest", name: "最新库存数", join: -1, noType: true},
          {id: "", name: ""},

          {id: "buyoutStockCostLatest", name: "最新库存金额(买断)", join: -1, noType: true},
          {id: "buyoutStockQtyLatest", name: "最新库存数(买断)", join: -1, noType: true},
          {id: "", name: ""},

          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 3, 4]}
        ]
      },
      order: {
        all: false,
        key: {name: '客单', col: 3, join: 2},
        list: [
          {id: "flowCnt", name: "客单数", join: 1, noType: true},
          {id: "flowCntDay", name: "日均客单数", join: 1, noType: true},
          {id: "retailFlowAmount", name: "零售客单价", join: 1, noType: true},
          {id: "flowCntProportion", name: "客流渗透率", join: 1, noType: true, icon: "FlowCntCat"},
          {id: "YoYValue", name: "同比", join: 2, two: true, disable: true},
          {id: "ToTValue", name: "环比", join: 2, two: true, disable: true},
        ]
      },
      other: {
        all: false,
        key: {name: '其他', col: 4},
        list: [
          {id: "saleSkuCount", name: "有售SKU数", join: 1},
          {id: "supplierShelveRateLatest", name: "最新铺货率", icon: "shopRate", join: 1}
        ]
      }
    },

    //财务分析-财务毛利分析 table 指标
    financeAnalyze_grossProfitTable: {
      whole: {
        all: false,
        key: {
          name: '范围', col: 2, join: 1,
          disValue: [
            {cause: [0, 1, 2], effect: {details: [0, 1, 2, 3]}},
            {cause: [0, 1, 2], effect: {other: [0, 1]}},
            {cause: [0, 1, 2], effect: {adjust: [0, 1, 2, 3]}}
          ]
        },
        list: [
          {id: "all", name: "全部", model: true},
          {id: "distribution", name: "经销"},
          {id: "joint", name: "联营"},
        ]
      },
      other: {
        all: false,
        key: {name: '毛利', col: 3, join: 2},
        list: [
          {id: "FinProfit", name: "财务毛利额", model: true, join: 1, icon: "finProfit"},
          {id: "FinProfitRate", name: "财务毛利率", model: true, join: 1, scale: true, inc: true, icon: "finProfitRate"},
          {id: "", name: ""},
          {id: "", name: ""},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0, 2]}
        ]
      },
      details: {
        all: false,
        key: {name: '毛利详细', col: 3, join: 2},
        list: [
          {id: "SaleFinProfit", name: "销售毛利", join: 1, icon: "allSaleProfit"},
          {id: "RealFreshFinProfit", name: "生鲜加价", join: 1},
          {id: "EstDiffFinProfitTotal", name: "销售补差", join: 1, icon: "allRealDiffProfit"},
          {id: "adjustCostFinTotal", name: "成本调整", join: 1, noType: true, icon: "adjustCost"},
          {id: "YoYValue", name: "同比", join: 2, two: true, disable: true},
          {id: "ToTValue", name: "环比", join: 2, two: true, disable: true},
          {id: "Pct", name: "占比", join: 2, disable: true}
        ]
      },
      adjust: {
        all: false,
        key: {name: '成本调整', col: 3, join: 2},
        list: [
          {id: "declareFinProfitLossAdjustCost", name: "报损报溢", join: 1, noType: true},
          {id: "checkFinProfitLossAdjustCost", name: "盘点损溢", join: 1, noType: true},
          {id: "stockFinAdjustCost", name: "库存调整", join: 1, noType: true},
          {id: "buyFinAdjustCost", name: "采购成本调整", join: 1, noType: true},
          {id: "YoYValue", name: "同比", join: 2, two: true, disable: true},
          {id: "ToTValue", name: "环比", join: 2, two: true, disable: true},
          {id: "Pct", name: "占比", join: 2, disable: true}
        ]
      }
    },

    /*
     * 供应商引入的 table 指标
     * */
    supplierInOut: {
      sku: {
        all: false,
        key: {name: 'SKU数', col: 6},
        list: [
          {id: "allSku", name: "有售SKU数", join: 1, model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true}
        ]
      },
      sale: {
        all: false,
        key: {name: '销售', col: 6},
        list: [
          {id: "allAmount", name: "销售额", join: 1, model: true},
          {id: "singleProductAmount", name: "单品销售额", join: 1, model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0]}
        ]
      },
      profit: {
        all: false,
        key: {name: '毛利', col: 6},
        list: [
          {id: "allProfit", name: "毛利额", join: 1, model: true},
          {id: "singleProductProfit", name: "单品毛利额", join: 1, model: true,},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0]},
        ]
      },
      income: {
        all: false,
        key: {name: '综合收益', col: 6},
        list: [
          {id: "compIncomeAmount", name: "综合收益", join: 1, model: true},
          {id: "singleProductCompIncomeAmount", name: "单品综合收益", join: 1, model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0]},
        ]
      }
    },
    /**
     * 负毛利异常
     */
    minusProfitWarn: {
      profit: {
        all: true,
        key: {name: '毛利', col: 3},
        list: [
          {id: "allBusinessProfit", name: "经销-预估毛利额", join: 1, model: true}
        ]
      },
      profitDetail: {
        all: true,
        key: {name: '毛利详细', col: 3},
        list: [
          {id: "saleProfitTotal", name: "经销-销售毛利", join: 1, model: true},
          {id: "allRealFreshProfit", name: "经销-生鲜加价(售出)", join: 1, model: true},
          {id: "allEstDiffProfitTotal", name: "经销-预估销售补差", join: 1, model: true},
          {id: "adjustCostTotal", name: "成本调整", join: 1, model: true}
        ]
      },
      cost: {
        all: false,
        key: {name: '成本调整', col: 3},
        list: [
          {id: "declareProfitLossAdjustCost", name: "报损报溢", join: 1},
          {id: "checkProfitLossAdjustCost", name: "盘点损益", join: 1},
          {id: "stockAdjustCost", name: "库存调整", join: 1},
          {id: "buyAdjustCost", name: "采购成本调整", join: 1}
        ]
      }
    },

    // 加注缺品页面的 table 指标
    supLack: {
      lack: {
        all: false,
        key: {name: '销售', col: 3, join: 1},
        list: [
          {id: "skuLack", name: "加注缺品SKU数", join: 1, model: true},
          {id: "avgDay", name: "平均加注缺品天数", join: 1, model: true},
          {id: "APercent", name: "A类品加注缺品占比", join: 1, model: true},

        ]
      }
    },

    // 供应商 加注缺品页面的 table 指标
    supSubLack: {
      lack: {
        all: false,
        key: {name: '销售', col: 3, join: 1},
        list: [
          {id: "spec", name: "规格", join: 1, model: true},
          {id: "statusName", name: "商品状态", join: 1, model: true},
          {id: "productLevel", name: "最新商品等级", join: 1, model: true},
          {id: "stockOutDays", name: "加注缺品天数", join: 1, model: true},
        ]
      }
    },

    // 指标达成 采购页面的 table 指标
    purchase: {
      sale: {
        all: false,
        key: {name: '销售', col: 4, join: 1},
        list: [
          {id: "allAmount", name: "含税销售额-实绩", join: 1},
          {id: "allAmountKpi", name: "含税销售额-指标", join: 1},
          {id: "allAmountCR", name: "含税销售额-指标达成率", inc: true, join: 1, model: true},

          {id: "allAmountAftTax", name: "不含税销售额-实绩", join: 1},
          {id: "allAmountAftTaxKpi", name: "不含税销售额-指标", join: 1},
          {id: "allAmountAftTaxCR", name: "不含税销售额-指标达成率", inc: true, join: 1, model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true},
        ]
      },
      profit: {
        all: false,
        key: {name: '毛利', col: 4},
        list: [
          {id: "allProfit", name: "毛利额-实绩", join: 1, icon: 'allProfitReal'},
          {id: "allProfitKpi", name: "毛利额-指标", join: 1},
          {id: "allProfitCR", name: "毛利额-指标达成率", inc: true, join: 1, model: true},
          {id: "allProfitRate", name: "毛利率-实绩", inc: true, join: 1, icon: 'allProfitRate'},
          {id: "allProfitRateKpi", name: "毛利率-指标", inc: true, join: 1},
          {id: "allProfitRateCR", name: "毛利率-指标达成", inc: true, join: 1, model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true},
        ]
      },
      channel: {
        all: false,
        key: {name: '通道收益', col: 4},
        list: [
          {id: "buyerChannelSettleAmount", name: "通道收益额-实绩", join: 1},
          {id: "buyerChannelSettleAmountKpi", name: "通道收益额-指标", join: 1},
          {id: "buyerChannelSettleAmountCR", name: "通道收益额-指标达成率", inc: true, join: 1, model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true},
        ]
      },
      income: {
        all: false,
        key: {name: '综合收益', col: 4},
        list: [
          {id: "compIncomeAmount", name: "综合收益额-实绩", join: 1},
          {id: "compIncomeAmountKpi", name: "综合收益额-指标", join: 1},
          {id: "compIncomeAmountCR", name: "综合收益额-指标达成率", inc: true, join: 1, model: true},
          {id: "compIncomeRate", name: "综合收益率-实绩", inc: true, join: 1, icon: 'allBizCompIncomeAmountRate'},
          {id: "compIncomeRateKpi", name: "综合收益率-指标", inc: true, join: 1},
          {id: "compIncomeRateCR", name: "综合收益率-指标达成", inc: true, join: 1, model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true},
        ]
      },
      day: {
        all: false,
        key: {name: '经销周转天数', col: 4},
        list: [
          {id: "saleDays", name: "经销周转天数-实绩", join: 1, icon: 'saleDays'},
          {id: "saleDaysKpi", name: "经销周转天数-指标", join: 1},
          {id: "saleDaysCR", name: "经销周转天数-指标达成", inc: true, join: 1, model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true},
        ]
      }
    },

    /*新品销售table指标*/
    newProductAnalyze_TABLE: {
      whole: {
        all: false,
        key: {
          name: '整体', col: 2, join: 1,
          disValue: [
            {cause: [0, 1, 2, 3, 4], effect: {sale: [0, 1, 2, 3]}},
            {cause: [0, 1, 2, 3, 4], effect: {profit: [0, 1]}},
            {cause: [0, 3], effect: {order: [0, 1, 2]}}
          ]
        },
        list: [
          {id: "all", name: "全部", model: true},
          {id: "distribution", name: "经销"},
          {id: "joint", name: "联营"},
          {id: "retail", name: "零售"},
          {id: "whole", name: "批发"}
        ]
      },
      sale: {
        all: false,
        key: {name: '销售', col: 3, join: 2},
        list: [
          {id: "Amount", name: "销售额", join: 1, model: true},
          {id: "Unit", name: "销售数", join: 1, model: true},
          {id: "Cost", name: "销售成本", join: 1},
          {id: "UnitPrice", name: "平均销售单价", join: 1},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]},
        ]
      },
      profit: {
        all: false,
        key: {name: '毛利', col: 4, join: 2},
        list: [
          {id: "Profit", name: "毛利额", join: 1, model: true},
          {id: "ProfitRate", name: "毛利率", join: 1, model: true, inc: true, icon: 'allProfitRate'},
          {id: "", name: ""},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0]}
        ]
      },
      stock: {
        all: false,
        key: {name: '库存', col: 4},
        list: [
          {id: "stockCost", name: "日均库存金额", join: 1, model: true},
          {id: "stockQty", name: "日均库存数", join: 1, model: true},
          {id: "saleDays", name: "经销周转天数", join: 1, model: true, inc: true, icon: 'saleDays'},

          {id: "buyoutStockCost", name: "日均库存金额(买断)", join: 1},
          {id: "buyoutStockQty", name: "日均库存数(买断)", join: 1},
          {id: "buyoutSaleDays", name: "经销周转天数(买断)", join: 1, inc: true},

          {id: "stockCostLatest", name: "最新库存金额", join: -1, noType: true},
          {id: "stockQtyLatest", name: "最新库存数", join: -1, noType: true},
          {id: "", name: ""},

          {id: "buyoutStockCostLatest", name: "最新库存金额(买断)", join: -1, noType: true},
          {id: "buyoutStockQtyLatest", name: "最新库存数(买断)", join: -1, noType: true},
          {id: "", name: ""},

          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 3, 4]}
        ]
      }
    },

    /*新品SKU对比分析数据设定弹窗数据*/
    newSkuContrastAnalyze: {
      skuNum: {
        all: false,
        key: {name: 'SKU数', col: 4},
        list: [
          {id: 'newImportSkuCnt', name: '引入SKU数', join: 1, model: true},
          {id: 'newSaleSkuCnt', name: '有售SKU数', join: 1, model: true, compareId: "saleSkuCnt"},
          {id: 'newCanSaleSkuCnt', name: '可售SKU数', join: 1, compareId: "canSaleSkuCnt"},
          {id: "YoYValue", name: "同比", join: 2, two: true, model: true, keepActive: [0, 1, 2], isHidden: true}
        ]
      },
      sale: {
        all: false,
        key: {
          name: '销售', col: 4
        },
        list: [
          {id: 'newAllAmount', name: '销售额', join: 1, model: true, compareId: "allAmount"},
          {id: 'newAllProfit', name: '毛利额', join: 1, model: true, compareId: "allProfit"},
          {id: 'newSingleProductAllAmount', name: '单品销售额', model: true, join: 1, icon: "newSingleProductAllAmount", compareId: "singleProductAllAmount"},
          {id: 'newSingleProductAllProfit', name: '单品毛利额', model: true, join: 1, icon: "newSingleProductAllProfit", compareId: "singleProductAllProfit"},
          {id: 'newSingleStoreProductAllAmount', name: '单店单品销售额', join: 1, icon: "newSingleStoreProductAllAmountTips", compareId: "singleStoreProductAllAmount"},
          {id: 'newSingleStoreProductAllProfit', name: '单店单品毛利额', join: 1, icon: "newSingleStoreProductAllProfitTips", compareId: "singleStoreProductAllProfit"},
          {id: "YoYValue", name: "同比", join: 2, two: true, model: true, isHidden: true, keepActive: [0, 1, 2, 3, 4, 5]},
          {id: "Pct", name: "占比", join: 2, two: true, model: true, isHidden: true, keepActive: [0, 1], disKey: [0, 1]},
        ]
      },
      otherSku: {
        all: false,
        key: {name: '其他', col: 4},
        list: [
          {id: 'newSingleProductStoreCnt', join: 1, name: '平均单品铺货门店数', icon: "newSingleProductStoreCnt", compareId: "singleProductStoreCnt"},
          {id: 'newSaleDays', join: 1, name: '经销周转天数', compareId: "saleDays"},
          {id: "YoYValue", name: "同比", join: 2, isHidden: true, two: true, keepActive: [0, 1]},
        ]
      }
    },

    // 门店对标-按类别-数据设定
    StoreType: {
      whole: {
        all: false,
        key: {
          name: '范围', col: 2, join: 1,
          disValue: [
            {cause: [0], effect: {sale: [1, 2, 3, 4]}},
            {cause: [0, 1, 2, 3, 4], effect: {sale: [0], adjust: [1, 2, 3, 4]}},
            {cause: [0], effect: {profit: [0, 1]}},
            {cause: [0, 1, 2, 3, 4], effect: {profit: [0, 1], adjust: []}},
            {cause: [0], effect: {saleProfit: [0, 1, 2]}},
          ]
        },
        list: [
          {id: "all", name: "全部", model: true},
          {id: "distribution", name: "经销"},
          {id: "joint", name: "联营"},
          {id: "retail", name: "零售"},
          {id: "whole", name: "批发"}
        ]
      },
      sale: {
        all: false,
        key: {name: '销售', col: 4, join: 2},
        list: [
          {id: "Amount", name: "销售额", model: true, join: 1,},
          {id: "Unit", name: "销售数", model: true, join: 1,},
          {id: "operateSizeAllAmount", name: "单位经营面积销售额", join: -1, model: true},
          /* {id: "useSizeAllAmount", name: "单位使用面积销售额", join: -1, model: true},*/

        ]
      },
      profit: {
        all: false,
        key: {name: '毛利', col: 4, join: 2},
        list: [
          {id: "Profit", name: "毛利额", two: true, join: 1, model: true},
          {id: "ProfitRate", name: "毛利率", two: true, join: 1, model: true, icon: 'allProfitRate'},
        ]
      },
      saleProfit: {
        all: false,
        key: {name: '销售毛利', col: 4},
        list: [
          {id: "allRealDiffProfitTotal", name: "销售补差", join: 1},
          {id: "adjustCostTotal", name: "成本调整", join: 1},
          {id: "allRealFreshProfit", name: "生鲜加价(收货)", join: 1},
        ]
      },
      stock: {
        all: false,
        key: {name: '库存', col: 4},
        list: [
          {id: "stockCost", name: "日均库存金额", join: 1, model: true},
          {id: "saleDays", name: "经销周转天数", join: 1, model: true, icon: 'saleDays'},
        ]
      },
      other: {
        all: false,
        key: {name: '其他', col: 4},
        list: [
          {id: "saleSkuCount", name: "有售SKU数", join: 1},
        ]
      }
    },

    // 综合分析-活动分析
    ActivityOptions: {
      whole: {
        all: false,
        key: {
          name: '范围', col: 2, join: 1,
          disValue: [
            {cause: [0, 1, 2, 3, 4], effect: {sale: [0, 1, 2, 3]}},
            {cause: [0, 1, 2, 3, 4], effect: {profit: [0, 1]}},
            {cause: [0, 3], effect: {order: [0, 1, 2, 3]}},
          ]
        },
        list: [
          {id: "all", name: "全部", model: true},
          {id: "distribution", name: "经销"},
          {id: "joint", name: "联营"},
          {id: "retail", name: "零售"},
          {id: "whole", name: "批发"}
        ]
      },
      sale: {
        all: false,
        key: {name: '销售', col: 3, join: 2},
        list: [
          {id: "Amount", name: "销售额", join: 1, model: true},
          {id: "Unit", name: "销售数", join: 1, model: true},
          {id: "Cost", name: "销售成本", join: 1,},
          {id: "UnitPrice", name: "平均销售单价", join: 1,},
        ]
      },
      profit: {
        all: true,
        key: {name: '毛利', col: 4, join: 2},
        list: [
          {id: "Profit", name: "毛利额", two: true, join: 1, model: true},
          {id: "ProfitRate", name: "毛利率", two: true, join: 1, model: true, icon: 'allProfitRate'},
        ]
      },
      stock: {
        all: true,
        key: {name: '库存', col: 4,},
        list: [
          {id: "stockCost", name: "日均库存金额", join: 1, model: true},
          {id: "stockQty", name: "日均库存数", join: 1, model: true},
          {id: "saleDays", name: "经销周转天数", join: 1, model: true, icon: 'saleDays'},
          {id: "buyoutStockCost", name: "日均库存金额(买断)", join: 1},
          {id: "buyoutStockQty", name: "日均库存数(买断)", join: 1},
          {id: "buyoutSaleDays", name: "经销周转天数(买断)", join: 1},
          /*{id: "stockCostLatest", name: "最新库存金额", join: 1, model: true},
          {id: "stockQtyLatest", name: "最新库存数", join: 1, model: true},*/
        ]
      },
      order: {
        all: false,
        key: {name: '客单', col: 3},
        list: [
          {id: "flowCnt", name: "客单数", join: 1, noType: true},
          {id: "flowCntDay", name: "日均客单数", join: 1, noType: true},
          {id: "retailFlowAmount", name: "零售客单价", join: 1, noType: true},
          {id: "flowCntProportion", name: "客流渗透率", join: 1, noType: true, icon: "FlowCntCat"},
        ]
      },

    },

    // 综合分析 - 供货分析
    materialOptions: {
      arrival:{
        all: false,
        key: {name: '到货', col: 4},
        list: [
          {id: "receiveQtyRate", name: "到货率", disable: true, inc:true,
            readOnly: true, model: true, join: 1, icon: "receiveQtyRate"},
          {id: "nonAmount", name: "未到商品金额", join: 1, model: true},
          {id: "avgDays", name: "平均早到天数", join: 1},
          {id: "YoYValue", name: "同比", join: 2, two: true},
        ]
      },
      back:{
        all: false,
        key: {name: '退货', col: 4},
        list: [
          {id: "returnAmountRate", readOnly: true, name: "退货率", join: 1,
            inc:true, model: true, disable: true, icon: "returnAmountRate" },
          {id: "retNet", name: "退货成本(去税)", join: 1, model: true},
          {id: "", name: ""},
          {id: "YoYValue", name: "同比", join: 2, two: true},
        ]
      },
      sale: {
        all: false,
        key: {name: '销售', col: 4},
        list: [
          {id: "allAmount", name: "销售额", join: 1,  model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true},
        ]
      },
    },


    // 价格带 - 数据设定
    classPrice: {
      sale: {
        all: false,
        key: {name: '销售', col: 4, join: 1},
        list: [
          {id: "Amount", name: "销售额", model: true, join: 1,},
          {id: "Unit", name: "销售数", model: true, join: 1,},
          {id: "", name: ""},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]},
        ]
      },
      profit: {
        all: false,
        key: {name: '毛利', col: 4, join: 1},
        list: [
          {id: "BusinessProfit", name: "毛利额", join: 1, model: true},
          {id: "", name: ""},
          {id: "", name: ""},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0]}
        ]
      },
      stock: {
        all: false,
        key: {name: '库存', col: 4, join: 1},
        list: [
          {id: "stockCost", name: "日均库存成本", join: 1, model: true},
          {id: "stockQty", name: "日均库存数", join: 1, model: true},
          {id: "", name: ""},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0, 1]}
        ]
      },
      sku: {
        all: false,
        key: {name: 'SKU数', col: 4, join: 1},
        list: [
          {id: "Sku", name: "有售SKU数", join: 1, model: true},
          {id: "CanSaleSku", name: "可售SKU数", join: 1, model: true},
          {id: "", name: ""},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "ToTValue", name: "环比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2, disKey: [0, 1]}
        ]
      },
      con:{
        all: false,
        key: {name: '贡献', col: 3, join: 1},
        list: [
          {id: "AmountAvg", name: "单品销售额", join: 1, icon: 'brandOneSalesPop'},
          {id: "BusinessProfitAvg", name: "单品毛利额", join: 1, icon: 'brandOneProfitPop'},
          {id: "SingleMixContribution", name: "单品综合贡献", join: 1, icon: 'brandOneContributePop'},
          {id: "MoveOffRate", name: "动销率", join: 1, icon: 'brandRateOfPinPop'},
        ]
      }
    },

    // 指标达成 运营页面的 table 指标
    operations: {
      sale: {
        all: false,
        key: {name: '销售', col: 4, join: 1},
        list: [
          {id: "allAmount", name: "含税销售额-实绩", join: 1},
          {id: "allAmountKpi", name: "含税销售额-指标", join: 1},
          {id: "allAmountCR", name: "含税销售额-指标达成率", inc: true, join: 1, model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true},
        ]
      },
      income: {
        all: false,
        key: {name: '综合收益', col: 4},
        list: [
          {id: "compIncomeAmount", name: "综合收益额-实绩", join: 1},
          {id: "compIncomeAmountKpi", name: "综合收益额-指标", join: 1},
          {id: "compIncomeAmountCR", name: "综合收益额-指标达成率", inc: true, join: 1, model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true},
        ]
      },
      day: {
        all: false,
        key: {name: '经销周转天数', col: 4},
        list: [
          {id: "saleDays", name: "经销周转天数-实绩", join: 1, icon: 'saleDays'},
          {id: "saleDaysKpi", name: "经销周转天数-指标", join: 1},
          {id: "saleDaysCR", name: "经销周转天数-指标达成", inc: true, join: 1, model: true},
          {id: "YoYValue", name: "同比", join: 2, two: true},
        ]
      }
    },

    //ABC分析 - 结构分析
    abc_structure: {
      sale: {
        all: false,
        key: {name: '销售', col: 3, join: 1},
        list: [
          {
            id: "skuUnit_A&skuUnit_B&skuUnit_C&skuUnitTotal",
            name: "有售sku数",
            disable: true,
            readOnly: true,
            model: true,
            join: 1
          },
          {id: "saleAmount_A&saleAmount_B&saleAmount_C&saleAmountTotal", name: "销售额", model: true, join: 1},
          {id: "saleUnit_A&saleUnit_B&saleUnit_C&saleUnitTotal", name: "销售数", model: true, join: 1},
          {id: "profit_A&profit_B&profit_C&profitTotal", name: "财务毛利", model: true, join: 1},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2}
        ]
      },
      stock: {
        all: false,
        key: {name: '库存', col: 4, join: 2},
        list: [
          {id: "stockCostAvg_A&stockCostAvg_B&stockCostAvg_C&stockCostAvgTotal", name: "日均库存成本", join: 1},
          {id: "stockTurnover_A&stockTurnover_B&stockTurnover_C&stockTurnoverTotal", name: "周转天数", join: 1},
          {id: "layStoreCnt_A&layStoreCnt_B&layStoreCnt_C&layStoreCntTotal", name: "单品单店铺市数", join: 1},
          {id: "YoYValue", name: "同比", disable: true, join: 2, two: true},
          {id: "Pct", name: "占比", disable: true, join: 2}
        ]
      },
      order: {
        all: false,
        key: {name: '订货', noNeedAll: true, col: 3, join: 2},
        list: [
          // 1:统配,2:直送,3:直通,4:中转
          {id: "orderQty_A&orderQty_B&orderQty_C&orderQtyTotal", name: "整体-订货数量", join: 1},
          {id: "arrivalRate_A&arrivalRate_B&arrivalRate_C&arrivalRateTotal", name: "整体-到货率", join: 1},
          {id: "retQty_A&retQty_B&retQty_C&retQtyTotal", name: "退货数量", join: 1},
          {},
          {id: "orderQty1_A&orderQty1_B&orderQty1_C&orderQty1Total", name: "统配-订货数量", join: 1},
          {id: "orderQty2_A&orderQty2_B&orderQty2_C&orderQty2Total", name: "直配-订货数量", join: 1},
          {id: "orderQty3_A&orderQty3_B&orderQty3_C&orderQty3Total", name: "直通-订货数量", join: 1},
          {id: "orderQty4_A&orderQty4_B&orderQty4_C&orderQty4Total", name: "中转-订货数量", join: 1},
          {id: "arrivalRate1_A&arrivalRate1_B&arrivalRate1_C&arrivalRate1Total", name: "统配-到货率", join: 1},
          {id: "arrivalRate2_A&arrivalRate2_B&arrivalRate2_C&arrivalRate2Total", name: "直配-到货率", join: 1},
          {id: "arrivalRate3_A&arrivalRate3_B&arrivalRate3_C&arrivalRate3Total", name: "直通-到货率", join: 1},
          {id: "arrivalRate4_A&arrivalRate4_B&arrivalRate4_C&arrivalRate4Total", name: "中转-到货率", join: 1},
          {id: "YoYValue", name: "同比", disable: true, join: 2, two: true},
        ]
      }
    },

    //ABC分析 - 结构分析=>按商品
    abc_structureAsProduct: {
      sale: {
        all: false,
        key: {name: '销售', col: 4, join: 1},
        list: [
          {id: "saleAmount_A&saleAmount_B&saleAmount_C&saleAmountTotal", name: "销售额", model: true, join: 1},
          {id: "saleUnit_A&saleUnit_B&saleUnit_C&saleUnitTotal", name: "销售数", model: true, join: 1},
          {id: "profit_A&profit_B&profit_C&profitTotal", name: "财务毛利", model: true, join: 1},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2}
        ]
      },
      stock: {
        all: false,
        key: {name: '库存', col: 4, join: 2},
        list: [
          {id: "stockCostAvg_A&stockCostAvg_B&stockCostAvg_C", name: "日均库存成本", join: 1},
          {id: "stockTurnover_A&stockTurnover_B&stockTurnover_C", name: "周转天数", join: 1},
          {id: "layStoreCnt_A&layStoreCnt_B&layStoreCnt_C&layStoreCntTotal", name: "单品单店铺市数", join: 1},
          {id: "YoYValue", name: "同比", disable: true, join: 2, two: true},
          {id: "Pct", name: "占比", disable: true, join: 2}
        ]
      },
      order: {
        all: false,
        key: {name: '订货', col: 6, join: 2},
        list: [
          {id: "arrivalRate_A&arrivalRate_B&arrivalRate_C&arrivalRateTotal", name: "到货率", join: 1},
          {id: "orderQty_A&orderQty_B&orderQty_C&orderQtyTotal", name: "订货数量", join: 1},
          {id: "YoYValue", name: "同比", disable: true, join: 2, two: true},
          // {id: "Pct", name: "占比", join: 2}
        ]
      }
    },

    efficiencyProduct: {
      sale: {
        all: false,
        key: {name: '销售', col: 4},
        list: [
          {id: "saleAmountTotal", name: "销售额", model: true, join: 1},
          {id: "saleUnitTotal", name: "销售数", model: true, join: 1},
          {id: "profitTotal", name: "财务毛利", model: true, join: 1},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2}
        ]
      },
      stock: {
        all: false,
        key: {name: '库存', col: 4},
        list: [
          {id: "stockCostAvgTotal", name: "日均库存成本", join: 1},
          {id: "stockTurnoverTotal", name: "周转天数", join: 1},
          {id: "layStoreCntTotal", name: "单品单店铺市数", join: 1},
          {id: "YoYValue", name: "同比", disable: true, join: 2, two: true},
          {id: "Pct", name: "占比", disable: true, join: 2}
        ]
      },
      order: {
        all: false,
        key: {name: '订货', noNeedAll: true, col: 3},
        list: [
          {id: "orderQtyTotal", name: "整体-订货数量", join: 1},
          {id: "arrivalRateTotal", name: "整体-到货率", join: 1},
          {id: "retQtyTotal", name: "退货数量", join: 1},
          {},
          {id: "orderQty1Total", name: "统配-订货数量", join: 1},
          {id: "orderQty2Total", name: "直配-订货数量", join: 1},
          {id: "orderQty3Total", name: "直通-订货数量", join: 1},
          {id: "orderQty4Total", name: "中转-订货数量", join: 1},
          {id: "arrivalRate1Total", name: "统配-到货率", join: 1},
          {id: "arrivalRate2Total", name: "直配-到货率", join: 1},
          {id: "arrivalRate3Total", name: "直通-到货率", join: 1},
          {id: "arrivalRate4Total", name: "中转-到货率", join: 1},
          {id: "YoYValue", name: "同比", disable: true, join: 2, two: true},
          // {id: "Pct", name: "占比", join: 2}
        ]
      }
    },

    productListABC: {
      whole: {
        all: false,
        key: {name: 'ABC', col: 2},
        list: [
          {id: "abcTag", name: "整体ABC", model: true, join: 1},
          {id: "abcTagAvg", name: "平均ABC", model: false, join: 1},
        ]
      },
      sale: {
        all: false,
        key: {name: '销售', col: 4},
        list: [
          {id: "saleAmountTotal", name: "销售额", model: true, join: 1},
          {id: "saleUnitTotal", name: "销售数", model: true, join: 1},
          {id: "profitTotal", name: "财务毛利", model: true, join: 1},
          {id: "YoYValue", name: "同比", join: 2, two: true},
          {id: "Pct", name: "占比", join: 2}
        ]
      },
      stock: {
        all: false,
        key: {name: '库存', col: 4},
        list: [
          {id: "stockCostAvgTotal", name: "日均库存成本", join: 1},
          {id: "stockTurnoverTotal", name: "周转天数", join: 1},
          {id: "layStoreCntTotal", name: "单品单店铺市数", join: 1},
          {id: "YoYValue", name: "同比", disable: true, join: 2, two: true},
          {id: "Pct", name: "占比", disable: true, join: 2}
        ]
      },
      order: {
        all: false,
        key: {name: '订货', noNeedAll: true, col: 3},
        list: [
          {id: "orderQtyTotal", name: "整体-订货数量", join: 1},
          {id: "arrivalRateTotal", name: "整体-到货率", join: 1},
          {id: "retQtyTotal", name: "退货数量", join: 1},
          {},
          {id: "orderQty1Total", name: "统配-订货数量", join: 1},
          {id: "orderQty2Total", name: "直配-订货数量", join: 1},
          {id: "orderQty3Total", name: "直通-订货数量", join: 1},
          {id: "orderQty4Total", name: "中转-订货数量", join: 1},
          {id: "arrivalRate1Total", name: "统配-到货率", join: 1},
          {id: "arrivalRate2Total", name: "直配-到货率", join: 1},
          {id: "arrivalRate3Total", name: "直通-到货率", join: 1},
          {id: "arrivalRate4Total", name: "中转-到货率", join: 1},
          {id: "YoYValue", name: "同比", disable: true, join: 2, two: true},
          // {id: "Pct", name: "占比", join: 2}
        ]
      }
    },

    //预警商品指标
    warningProduct: {
      sale: {
        all: false,
        key: {name: '销售', col: 4},
        list: [
          {id: "saleAmountTotal", name: "销售额", model: true, join: 1},
          {id: "saleUnitTotal", name: "销售数", model: true, join: 1},
          {id: "profitTotal", name: "财务毛利", model: true, join: 1},
          {id: "Diff", name: "子类平均比", join: 2}
        ]
      },
      stock: {
        all: false,
        key: {name: '库存', col: 4},
        list: [
          {id: "stockCostAvgTotal", name: "日均库存成本", join: 1},
          {id: "stockTurnoverTotal", name: "周转天数", join: 1},
          {id: "layStoreCntTotal", name: "单品单店铺市数", join: 1},
          {id: "Diff", name: "子类平均比", disable: true, join: 2}
        ]
      },
      order: {
        all: false,
        key: {name: '订货', noNeedAll: true, col: 3},
        list: [
          {id: "orderQtyTotal", name: "整体-订货数量", join: 1},
          {id: "arrivalRateTotal", name: "整体-到货率", join: 1},
          {id: "retQtyTotal", name: "退货数量", join: 1},
          {},
          {id: "orderQty1Total", name: "统配-订货数量", join: 1},
          {id: "orderQty2Total", name: "直配-订货数量", join: 1},
          {id: "orderQty3Total", name: "直通-订货数量", join: 1},
          {id: "orderQty4Total", name: "中转-订货数量", join: 1},
          {id: "arrivalRate1Total", name: "统配-到货率", join: 1},
          {id: "arrivalRate2Total", name: "直配-到货率", join: 1},
          {id: "arrivalRate3Total", name: "直通-到货率", join: 1},
          {id: "arrivalRate4Total", name: "中转-到货率", join: 1},
          {id: "Diff", disable: true, name: "子类平均比", join: 2}
        ]
      }
    },
    //ABC分析 -差异分析
    abc_diff: {
      sale: {
        all: false,
        key: {name: '销售', col: 3, join: 1},
        list: [
          {id: "skuUnit", name: "有售sku数", model: true, join: 1},
          {id: "saleAmount", name: "销售额", model: true, join: 1, operation: true},
          {id: "saleUnit", name: "销售数", model: true, join: 1, operation: true},
          {id: "profit", name: "毛利额", model: true, join: 1, operation: true},
          {id: "Pct", name: "占比", model: true, join: 2}
        ]
      },
      stock: {
        all: false,
        key: {name: '库存', col: 6, join: 1},
        list: [
          {id: "stockCostAvg", name: "日均库存成本", model: true, join: 1, operation: true},
          {id: "stockTurnover", name: "周转天数", join: 1, operation: true},
          {id: "Pct", name: "占比", model: true, join: 2}
        ]
      },
      order: {
        all: false,
        key: {name: '订货', col: 6, join: 1},
        list: [
          {id: "arrivalRate", name: "到货率", model: true, join: 1, operation: true},
          {id: "orderQty", name: "订货数量", model: true, join: 1, operation: true},
          // {id: "Pct", name: "占比", model: true, join: 2}
        ]
      }
    },

    //同比环比设定
    YoYToTSetting: {
      line: {show: false, name: '同比环比设定', class: 'ringLine'},
      all: {name: '同比/环比设定', value: true, disable: false, icon: 'YoYToTSetting'},
      group: [
        {
          id: 'YoY',
          list: [
            {key: 'YoYValue', defaultValue: true, name: '同期值', value: true, disable: false, col: 2, enabled: true},
            {key: 'YoY', defaultValue: false, name: '同比增幅', value: true, disable: false, col: 3, enabled: true}
          ],
          title: {value: '同比', col: 1}
        },
        {
          id: 'ToT',
          list: [
            {key: 'ToTValue', defaultValue: true, name: '环期值', value: true, disable: false, col: 2, enabled: true},
            {key: 'ToT', defaultValue: false, name: '环比增幅', value: true, disable: false, col: 3, enabled: true}
          ],
          title: {value: '环比', col: 1}
        }
      ]
    },

    excessYoYToTSetting:{
      line: {show: false, name: '同比设定', class: 'ringLine'},
      all: {name: '同比设定', value: true, disable: false, icon: 'YoYToTSetting'},
      group: [
        {
          id: 'YoY',
          list: [
            {key: 'YoYValue', defaultValue: true, name: '同期值',  value: true, disable: false, col: 2, enabled: true},
            {key: 'YoY', defaultValue: false, name: '同比增幅', value: true, disable: false, col: 3, enabled: true}
          ],
          title: {value: '同比', col:1}
        },
      ]
    },

    // 供应商收益
    supplierProfit: {
      buyer: { // 采购
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "buyerBizCompIncomeAmount", name: "综合收益额(采购)", join: 1, model: true, icon: 'allBizCompIncomeAmount'},
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)", join: 1, model: true},
            {id: "allProfit", name: "毛利额", join: 1, model: true},
            {id: "buyerBizCompIncomeAmountRate", name: "综合收益率(采购)", join: 1, inc: true, icon: 'allBizCompIncomeAmountRate'},
            {id: "buyerChannelSettleAmountRate", name: "通道收益率(采购)", join: 1, inc: true, icon: 'channelSettleAmountTotalRate'},
            {id: "allAmount", name: "销售额", join: 1,},
            {id: "allProfitOfBuyerBizCompIncomeAmount", name: "毛利额占比综合收益额(采购)", join: -1},
            {id: "buyerChannelSettleAmountOfBuyerBizCompIncomeAmount", name: "通道收益额(采购)占比综合收益额(采购)", join: -1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]}
          ]
        },
        get: {
          all: false,
          key: {name: '收益(实收)', col: 4, join: 1},
          list: [
            {id: "buyerFixSettleAmount", name: "通道收益额(采购固定费用)", join: 1},
            {id: "buyerChangeSettleAmount", name: "通道收益额(采购变动费用)", join: 1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true, disable: true},
            {id: "ToTValue", name: "环比", join: 2, two: true, disable: true},
            {id: "Pct", name: "占比", join: 2, disable: true}
          ]
        },
        lose: {
          all: false,
          key: {name: '收益(已到期未收)', col: 4},
          list: [
            {id: "buyerChannelPendingAmount", name: "通道收益额(采购已到期未收)", join: -1},
            {id: "buyerChangePendingAmount", name: "通道收益额(采购变动费用-已到期未收)", join: -1},
            {id: "buyerFixPendingAmount", name: "通道收益额(采购固定费用-已到期未收)", join: -1}
          ]
        }
      },
      all: { // 关键用户
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "allBizCompIncomeAmount", name: "综合收益额", join: 1, model: true, icon: 'allBizCompIncomeAmount'},
            {id: "channelSettleAmountTotal", name: "通道收益额", join: 1, model: true},
            {id: "allProfit", name: "毛利额", join: 1, model: true},
            {id: "allBizCompIncomeAmountRate", name: "综合收益率", join: 1, inc: true, icon: 'allBizCompIncomeAmountRate'},
            {id: "channelSettleAmountTotalRate", name: "通道收益率", join: 1, inc: true, icon: 'channelSettleAmountTotalRate'},
            {id: "allAmount", name: "销售额", join: 1},
            {id: "allProfitOfAllBizCompIncomeAmount", name: "毛利额占比综合收益额", join: -1},
            {id: "channelSettleAmountTotalOfAllBizCompIncomeAmount", name: "通道收益额占比综合收益额", join: -1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true },
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]}
          ]
        },
        getBuyer: {
          all: false,
          key: {name: '收益(采购)', col: 4, join: 1},
          list: [
            {id: "buyerBizCompIncomeAmount", name: "综合收益额(采购)", join: 1, model: true},
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)", join: 1, model: true},
            {id: "buyerFixSettleAmount", name: "通道收益额(采购固定费用)", join: 1, model: false},

            {id: "buyerBizCompIncomeAmountRate", name: "综合收益率(采购)", join: 1, inc: true},
            {id: "buyerChannelSettleAmountRate", name: "通道收益率(采购)", join: 1, inc: true},
            {id: "buyerChangeSettleAmount", name: "通道收益额(采购变动费用)", join: 1},

            {id: "allProfitOfBuyerBizCompIncomeAmount", name: "毛利额占比综合收益额(采购)", join: -1},
            {id: "buyerChannelSettleAmountOfBuyerBizCompIncomeAmount", name: "通道收益额(采购)占比综合收益额(采购)", join: -1},
            {id: "", name: ""},

            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2, 5]}
          ]
        },
        getStore: {
          all: false,
          key: {name: '收益(营运)', col: 4, join: 1},
          list: [
            {id: "storeBizCompIncomeAmount", name: "综合收益额(营运)", join: 1, model: true},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", join: 1, model: true},
            {id: "", name: ""},

            {id: "storeBizCompIncomeAmountRate", name: "综合收益率(营运)", join: 1, inc: true},
            {id: "storeChannelSettleAmountRate", name: "通道收益率(营运)", join: 1, inc: true},
            {id: "", name: ""},

            {id: "allProfitOfStoreBizCompIncomeAmount", name: "毛利额占比综合收益额(营运)", join: -1},
            {id: "storeChannelSettleAmountOfStoreBizCompIncomeAmount", name: "通道收益额(营运)占比综合收益额(营运)", join: -1},
            {id: "", name: ""},

            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1]}
          ]
        },
        lose: {
          all: false,
          key: {name: '收益(已到期未收)', col: 4},
          list: [
            {id: "channelPendingAmountTotal", name: "通道收益额(已到期未收)", join: -1},
            {id: "storeChannelPendingAmount", name: "通道收益额(营运已到期未收)", join: -1},
            {id: "", name: ""},
            {id: "buyerChannelPendingAmount", name: "通道收益额(采购已到期未收)", join: -1},
            {id: "buyerChangePendingAmount", name: "通道收益额(采购变动费用-已到期未收)", join: -1},
            {id: "buyerFixPendingAmount", name: "通道收益额(采购固定费用-已到期未收)", join: -1}
          ]
        }
      },
      store: {
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "storeBizCompIncomeAmount", name: "综合收益额(营运)", join: 1, model: true, icon: 'allBizCompIncomeAmount'},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", join: 1, model: true},
            {id: "allProfit", name: "毛利额", join: 1, model: true},
            {id: "storeBizCompIncomeAmountRate", name: "综合收益率(营运)", join: 1, inc: true, icon: 'allBizCompIncomeAmountRate'},
            {id: "storeChannelSettleAmountRate", name: "通道收益率(营运)", join: 1, inc: true, icon: 'channelSettleAmountTotalRate'},
            {id: "", name: ""},
            {id: "allProfitOfStoreBizCompIncomeAmount", name: "毛利额占比综合收益额(营运)", join: -1},
            {id: "storeChannelSettleAmountOfStoreBizCompIncomeAmount", name: "通道收益额(营运)占比综合收益额(营运)", join: -1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2]}
          ]
        },
        lose: {
          all: false,
          key: {name: '收益(已到期未收)', col: 4},
          list: [
            {id: "storeChannelPendingAmount", name: "通道收益额(营运已到期未收)", join: -1}
          ]
        }
      }
    },

    // SKU对比分析
    skuContrastAnalyze: {
      skuNum: {
        all: false,
        key: {name: 'SKU数', col: 4},
        list: [
          {id: 'saleSkuCnt', name: '有售SKU数', join: 1, model: true},
          {id: 'canSaleSkuCnt', name: '可售SKU数', join: 1, model: true},
          {id: '', name: ''},
          {id: "YoYValue", name: "同比", join: 2, two: true}
        ]
      },
      sale: {
        all: false,
        key: {
          name: '销售', col: 4
        },
        list: [
          {id: 'allAmount', name: '销售额', join: 1, model: true},
          {id: 'allProfit', name: '毛利额', join: 1, model: true},
          {id: 'singleProductAllAmount', name: '单品销售额', join: 1, icon: "newSingleProductAllAmount", model: true},
          {id: 'singleProductAllProfit', name: '单品毛利额', join: 1, icon: "newSingleProductAllProfit", model: true},
          {id: 'singleStoreProductAllAmount', name: '单店单品销售额', join: 1, icon: "newSingleStoreProductAllAmountTips"},
          {id: 'singleStoreProductAllProfit', name: '单店单品毛利额', join: 1, icon: "newSingleStoreProductAllProfitTips"},
          {
            id: "YoYValue",
            name: "同比",
            join: 2,
            two: true
          },
        ]
      }
    },

    //通道收益table指标
    channelProfit: {
      buyer: {
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)", join: 1, model: true},
            {id: "buyerChannelSettleAmountRate", name: "通道收益率(采购)", model: true, join: 1, inc: true, icon: 'channelSettleAmountTotalRate'},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0]}
          ]
        },
        get: {
          all: false,
          key: {name: '收益(实收)', col: 4, join: 1},
          list: [
            {id: "buyerFixSettleAmount", name: "通道收益额(采购固定费用)", join: 1, model: true},
            {id: "buyerChangeSettleAmount", name: "通道收益额(采购变动费用)", join: 1, model: true},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2}
          ]
        },
        lose: {
          all: false,
          key: {name: '收益(应收/应收中已收)', col: 4},
          list: [
            {id: "buyerChannelEstAmount", name: "通道收益额(采购应收)", join: -1},
            {id: "buyerChannelRealAmount", name: "通道收益额(采购已收)", join: -1},
            {id: "buyerChannelPendingAmount", name: "通道收益额(采购已到期未收)", join: -1, icon: 'channelPendingAmountTotal'},

            {id: "buyerFixEstAmount", name: "通道收益额(采购固定费用_应收)", join: -1},
            {id: "buyerFixRealAmount", name: "通道收益额(采购固定费用_已收)", join: -1},
            {id: "buyerFixPendingAmount", name: "通道收益额(采购固定费用_已到期未收)", join: -1},

            {id: "buyerChangeEstAmount", name: "通道收益额(采购变动费用_应收)", join: -1},
            {id: "buyerChangeRealAmount", name: "通道收益额(采购变动费用_已收)", join: -1},
            {id: "buyerChangePendingAmount", name: "通道收益额(采购变动费用_已到期未收)", join: -1}
          ]
        },
        future:{
          all: false,
          key: {name: '收益(未来未收)', col: 4, join: 1},
          list: [
            {id: "buyerChannelPendingAmountCurrentMonth", name: "通道收益额(采购_至月底未到期未收)", join: -1},
            {id: "buyerChannelPendingAmountCurrentYear", name: "通道收益额(采购_至年底未到期未收)", join: -1},
          ]
        }
      },
      all: {
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "channelSettleAmountTotal", name: "通道收益额", join: 1, model: true},
            {id: "channelSettleAmountTotalRate", name: "通道收益率", join: 1, model: true, inc: true, icon: 'channelSettleAmountTotalRate'},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0]}
          ]
        },
        getBuyerOrStore: {
          all: false,
          key: {name: '收益(采购/营运)', col: 4, join: 1},
          list: [
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)", join: 1, model: true},
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", join: 1, model: true},
            {id: "buyerFixSettleAmount", name: "通道收益额(采购固定费用)", join: 1},

            {id: "buyerChannelSettleAmountRate", name: "通道收益率(采购)", join: 1, inc: true},
            {id: "storeChannelSettleAmountRate", name: "通道收益率(营运)", join: 1, inc: true},
            {id: "buyerChangeSettleAmount", name: "通道收益额(采购变动费用)", join: 1},

            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 1, 2, 5]}
          ]
        },
        lose: {
          all: false,
          key: {name: '收益(应收/应收中已收)', col: 4},
          list: [
            {id: "channelEstAmountTotal", name: "通道收益额(应收)", join: -1},
            {id: "channelRealAmountTotal", name: "通道收益额(已收)", join: -1},
            {id: "channelPendingAmountTotal", name: "通道收益额(已到期未收)", join: -1, model: true, icon: 'channelPendingAmountTotal'},

            {id: "storeChannelEstAmount", name: "通道收益额(营运应收)", join: -1},
            {id: "storeChannelRealAmount", name: "通道收益额(营运已收)", join: -1},
            {id: "storeChannelPendingAmount", name: "通道收益额(营运已到期未收)", join: -1},

            {id: "buyerChannelEstAmount", name: "通道收益额(采购应收)", join: -1},
            {id: "buyerChannelRealAmount", name: "通道收益额(采购已收)", join: -1},
            {id: "buyerChannelPendingAmount", name: "通道收益额(采购已到期未收)", join: -1},

            {id: "buyerFixEstAmount", name: "通道收益额(采购固定费用_应收)", join: -1},
            {id: "buyerFixRealAmount", name: "通道收益额(采购固定费用_已收)", join: -1},
            {id: "buyerFixPendingAmount", name: "通道收益额(采购固定费用_已到期未收)", join: -1},

            {id: "buyerChangeEstAmount", name: "通道收益额(采购变动费用_应收)", join: -1},
            {id: "buyerChangeRealAmount", name: "通道收益额(采购变动费用_已收)", join: -1},
            {id: "buyerChangePendingAmount", name: "通道收益额(采购变动费用_已到期未收)", join: -1}
          ]
        },
        future:{
          all: false,
          key: {name: '收益(未来未收)', col: 4, join: 1},
          list: [
            {id: "channelPendingAmountTotalCurrentMonth", name: "通道收益额(至月底未到期未收)", join: -1},
            {id: "storeChannelPendingAmountCurrentMonth", name: "通道收益额(营运_至月底未到期未收)", join: -1},
            {id: "buyerChannelPendingAmountCurrentMonth", name: "通道收益额(采购_至月底未到期未收)", join: -1},

            {id: "channelPendingAmountTotalCurrentYear", name: "通道收益额(至年底未到期未收)", join: -1},
            {id: "storeChannelPendingAmountCurrentYear", name: "通道收益额(营运_至年底未到期未收)", join: -1},
            {id: "buyerChannelPendingAmountCurrentYear", name: "通道收益额(采购_至年底未到期未收)", join: -1},
          ]
        }
      },
      store: {
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", join: 1, model: true},
            {id: "storeChannelSettleAmountRate", name: "通道收益率(营运)", join: 1, model: true, inc: true, icon: 'channelSettleAmountTotalRate'},
            {id: "", name: ""},
            {id: "storeRentChannelSettleAmount", name: "通道收益额(租金收入)", join: 1},
            {id: "storeWithRentChannelSettleAmount", name: "通道收益额(营运_含租金收入)", join: 1},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0, 2, 3]}
          ]
        },
        lose: {
          all: false,
          key: {name: '收益(应收/应收中已收)', col: 4},
          list: [
            {id: "storeChannelEstAmount", name: "通道收益额(营运应收)", join: -1},
            {id: "storeChannelRealAmount", name: "通道收益额(营运已收)", join: -1},
            {id: "storeChannelPendingAmount", name: "通道收益额(营运已到期未收)", join: -1, model: true, icon: 'channelPendingAmountTotal'},
          ]
        },
        future:{
          all: false,
          key: {name: '收益(未来未收)', col: 4, join: 1},
          list: [
            {id: "storeChannelPendingAmountCurrentMonth", name: "通道收益额(营运_至月底未到期未收)", join: -1},
            {id: "storeChannelPendingAmountCurrentYear", name: "通道收益额(营运_至年底未到期未收)", join: -1}
          ]
        }
      },
      storeOther: {
        sale: {
          all: false,
          key: {name: '收益', col: 4, join: 1},
          list: [
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", join: 1, model: true},
            {id: "storeChannelSettleAmountRate", name: "通道收益率(营运)", join: 1, model: true, inc: true, icon: 'channelSettleAmountTotalRate'},
            {id: "", name: ""},
            {id: "YoYValue", name: "同比", join: 2, two: true},
            {id: "ToTValue", name: "环比", join: 2, two: true},
            {id: "Pct", name: "占比", join: 2, disKey: [0]}
          ]
        },
        lose: {
          all: false,
          key: {name: '收益(应收/应收中已收)', col: 4},
          list: [
            {id: "storeChannelEstAmount", name: "通道收益额(营运应收)", join: -1},
            {id: "storeChannelRealAmount", name: "通道收益额(营运已收)", join: -1},
            {id: "storeChannelPendingAmount", name: "通道收益额(营运已到期未收)", join: -1, model: true, icon: 'channelPendingAmountTotal'},
          ]
        },
        future:{
          all: false,
          key: {name: '收益(未来未收)', col: 4, join: 1},
          list: [
            {id: "storeChannelPendingAmountCurrentMonth", name: "通道收益额(营运_至月底未到期未收)", join: -1},
            {id: "storeChannelPendingAmountCurrentYear", name: "通道收益额(营运_至年底未到期未收)", join: -1}
          ]
        }
      },
      costCodeForBuyer: {
        sale: {
          all: false,
          key: {name: '通道收益(实收)', col: 3, join: 1},
          list: [
            {id: "buyerChannelSettleAmount", name: "通道收益额(采购)", join: 1, model: true},
            {id: "YoYValue", name: "通道收益额(采购)-同比", join: 2, two: true},
            {id: "ToTValue", name: "通道收益额(采购)-环比", join: 2, two: true},
            {id: "Pct", name: "通道收益额(采购)-占比", join: 2}
          ]
        },
        lose: {
          all: false,
          key: {name: '通道收益(应收/应收中已收)', col: 4},
          list: [
            {id: "buyerChannelEstAmount", name: "通道收益额(采购应收)", join: -1},
            {id: "buyerChannelRealAmount", name: "通道收益额(采购已收)", join: -1},
            {id: "buyerChannelPendingAmount", name: "通道收益额(采购已到期未收)", join: -1, icon: 'channelPendingAmountTotal', model: true},
          ]
        },
        future:{
          all: false,
          key: {name: '收益(未来未收)', col: 4, join: 1},
          list: [
            {id: "buyerChannelPendingAmountCurrentMonth", name: "通道收益额(采购_至月底未到期未收)", join: -1},
            {id: "buyerChannelPendingAmountCurrentYear", name: "通道收益额(采购_至年底未到期未收)", join: -1}
          ]
        }
      },
      costCodeForStore: {
        sale: {
          all: false,
          key: {name: '通道收益(实收)', col: 3, join: 1},
          list: [
            {id: "storeChannelSettleAmount", name: "通道收益额(营运)", join: 1, model: true},
            {id: "YoYValue", name: "通道收益额(营运)-同比", join: 2, two: true},
            {id: "ToTValue", name: "通道收益额(营运)-环比", join: 2, two: true},
            {id: "Pct", name: "通道收益额(营运)-占比", join: 2}
          ]
        },
        lose: {
          all: false,
          key: {name: '通道收益(应收/应收中已收)', col: 4},
          list: [
            {id: "storeChannelEstAmount", name: "通道收益额(营运应收)", join: -1},
            {id: "storeChannelRealAmount", name: "通道收益额(营运已收)", join: -1},
            {id: "storeChannelPendingAmount", name: "通道收益额(营运已到期未收)", join: -1, icon: 'channelPendingAmountTotal', model: true},
          ]
        },
        future:{
          all: false,
          key: {name: '收益(未来未收)', col: 4, join: 1},
          list: [
            {id: "storeChannelPendingAmountCurrentMonth", name: "通道收益额(营运_至月底未到期未收)", join: -1},
            {id: "storeChannelPendingAmountCurrentYear", name: "通道收益额(营运_至年底未到期未收)", join: -1}
          ]
        }
      }
    }
  });
