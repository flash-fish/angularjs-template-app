angular.module('hs.warning')
.constant("Warning", {
  module: 'warn',

  compare: [
    {name: "高于", id: "1"},
    {name: "低于", id: "0"}
  ],

    checkbox: [
      {code: "saleProfit", name: "负经销-销售毛利"},
      {code: "realFreshProfit", name: "负经销-生鲜加价(售出)"},
      {code: "estDiffProfit", name: "负经销-销售补差"},
      {code: "adjustCost", name: "负成本调整"},
      {code: "declareProfitLossAdjustCost", name: "负报损报溢"},
      {code: "checkProfitLossAdjustCost", name: "负盘点损溢"},
      {code: "stockAdjustCost", name: "负库存调整"},
      {code: "buyAdjustCost", name: "负采购成本调整"}
    ],

    warningField: {
      allBusinessProfit: {name: '经销-预估毛利额', sale: true},
      saleProfitTotal: {name: '经销-销售毛利', sale: true},
      allRealFreshProfit: {name: '经销-生鲜加价(售出)', sale: true},
      allEstDiffProfitTotal: {name: '经销-预估销售补差', sale: true},
      adjustCostTotal: {name: '成本调整', sale: true},
      declareProfitLossAdjustCost: {name: '报损报溢', sale: true},
      checkProfitLossAdjustCost: {name: '盘点损益', sale: true},
      stockAdjustCost: {name: '库存调整', sale: true},
      buyAdjustCost: {name: '采购成本调整', sale: true},
      reason: {name: '原因分析'}
    },

    reason: [
      {label: "全部", value: ""},
      {label: "退货", value: "1"},
      {label: "批发", value: "2"},
      {label: "高进低销", value: "3"},
      {label: "未知", value: "4"}
    ],

    timeCycle: [
      {name: "最近15天", id: "15"},
      {name: "最近30天", id: "30"},
      {name: "最近45天", id: "45"},
      {name: "最近60天", id: "60"},
      {name: "最近90天", id: "90"},
      {name: "最近180天", id: "180"},
    ],

    otherCommon: {
      dataLevel: {name: "时间周期"},
      importDate: {name: "商品引入日期"},
      stockCost: {name: "最新库存金额", sale: true},
      storeCount: {name: "门店数"},
      minusReason: {name: "原因"},
      negativeGrossMargin: {name: "负毛利"}
    }
  });
