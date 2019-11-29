angular.module('app.datas')
  .constant("Field", {
    common: {
      _id: {name: '排名'},
      dateCode: {name: '日期'},
      vsDateCode: {name: '日期(对比)'},
      storeName: {name: '门店'},
      storeCode: {name: '门店代码'},
      operationName: {name: '业态'},
      operationCode: {name: '业态代码'},
      businessOperationName: {name: '业态'},
      businessOperationCode: {name: '业态代码'},
      newProductName: {name: "新品"},
      newProductYear: {name: "年份"},
      abcTagName: {name: "商品ABC类"},
      abcTagCode: {name: ''},
      districtName: {name: '地区'},
      districtCode: {name: '地区代码'},
      productCnt: {name: '商品数'},
      productName: {name: '商品'},
      productCode: {name: '联华码'},
      spec: {name: '规格'},
      statusName: {name: '商品状态'},
      statusStoreName: {name: '门店商品状态'},
      brandName: {name: '品牌'},
      brandId: {name: '品牌代码'},
      categoryName: {name: '类别'},
      categoryCode: {name: '类别代码'},
      className: {name: '品类组'},
      classCode: {name: '品类组代码'},
      supName: {name: '供应商'},
      supplierName: {name: '供应商'},
      supplierCode: {name: '供应商代码'},
      receiveQtyRate: {name: '到货率',},
      nonAmount: {name: '未到商品金额'},
      avgDays: {name: '平均早到天数'},
      returnAmountRate: {name: '退货率'},
      nodeName: {name: '品类组名称'},
      nodeCode: {name: '品类组代码'},
      operationsName: {name: ''},
      productStatus: {name: '新品状态'},
      storeCount: {name: '门店数'},
      storeCountLatest: {name: '最新铺货门店数'},
      goodsDate: {name: '引入年份'},
      categoryCode4Name: {name: '子类名称'},
      categoryCode4: {name: '子类编号'},
      lastMonthAbcTag: {name: "上月评级"},
      itemIncomeRate: {name: "综合贡献占比"},
      itemIncomeRateAcc: {name: "综合贡献累计占比"},
      zoneTypeName: {name: "价格带"},
      name:{name: "规格"},
      quadrantName: {name: '维度'},
      channelCode: {name: '费用代码'}
    },

    sale: {
      operateSizeRetailAmount: {name: '单位经营面积零售额', sale: true},
      distributionCostDay: {name: '日均经销成本'},
      distributionCostDayYoY: {name: '日均经销成本-同比增幅', scale: true},

      //新品-铺货门店
      newAvgSellStoreCnt: {name: '新品平均铺货门店数', icon: 'new_store_new'},
      allAvgSellStoreCnt: {name: '商品平均铺货门店数', icon: 'new_store_goods'},

      //新品首到效率（天） 首销效率（天）
      firstDistributionEff: {name: '首到效率(天)'},
      firstSaleEff: {name: '首销效率(天)'},

      // 新品-动销
      saleStoreCount: {name: '有销售门店铺货数', point: 0},
      storeCount: {name: '门店铺设数', point: 0},
      shelveRate: {name: '门店动销率', percent: true},


      // SKU
      saleSkuCount: {name: '有售SKU数', point: 0},
      skuNum: {name: '引入新品SKU数', point: 0},
      preSkuNum: {name: '引入新品SKU数-上年同期', point: 0},
      preSkuNumYoY: {name: '引入新品SKU数-同比增幅', scale: true, color: true},

      newSaleSkuCnt: {name: '新品有售SKU数', point: 0},
      allSaleSkuCnt: {name: '商品有售SKU数', point: 0},
      supplierShelveRateLatest: {name: '最新铺货率', scale: true, icon: "shopRate"},

      importDate: {name: '建档时间', date: true},
      firstOrderGoods: {name: '首次订货时间', date: true},
      firstDistribution: {name: '首次到货时间', date: true},
      firstSale: {name: '首次销售时间', date: true},
      firstSupplement: {name: '首次补货时间', date: true},


      // 新品销售额
      newSaleAmount: {name: '新品销售额', sale: true},
      newSaleAmountPct: {name: '新品销售额占比', scale: true},
      newAvgSaleAmount: {name: '新品平均销售额', sale: true, icon: 'new_product_sale'},
      allSaleAmount: {name: '商品销售额', sale: true},
      allAvgSaleAmount: {name: '商品平均销售额', sale: true, icon: 'new_goods_sale'},
      newAvgTurnoverDays: {name: '新品周转天数',},
      allAvgTurnoverDays: {name: '商品周转天数',},

      // 单品销售额
      singleProductAmount: {name: '单品销售额', sale: true},

      // 销售额
      allAmount: {name: '销售额', sale: true, page: {skuContrast: '商品销售额'}},
      allAmountYoYValue: {name: '销售额-同期值', sale: true},
      allAmountYoY: {name: '销售额-同比增幅', scale: true, color: true},
      allAmountToTValue: {name: '销售额-环期值', sale: true},
      allAmountToT: {name: '销售额-环比增幅', scale: true, color: true},
      allAmountPct: {name: '销售额-占比', scale: true, fixWidth: 120},
      allAmountOfLH: {name: '销售额-占比联华类别', scale: true, icon: "PctHsCat", fixWidth: 120},

      // 零售-销售额
      retailAmount: {name: '零售-销售额', sale: true},
      retailAmountYoYValue: {name: '零售-销售额-同期值', sale: true},
      retailAmountYoY: {name: '零售-销售额-同比增幅', scale: true, color: true},
      retailAmountToTValue: {name: '零售-销售额-环期值', sale: true},
      retailAmountToT: {name: '零售-销售额-环比增幅', scale: true, color: true},
      retailAmountPct: {name: '零售-销售额-占比', scale: true, fixWidth: 145},
      retailAmountOfLH: {name: '零售-销售额-占比联华类别', scale: true, icon: "PctHsCat", fixWidth: 145},

      // 批发-销售额
      wholeAmount: {name: '批发-销售额', sale: true},
      wholeAmountYoYValue: {name: '批发-销售额-同期值', sale: true},
      wholeAmountYoY: {name: '批发-销售额-同比增幅', scale: true, color: true},
      wholeAmountToTValue: {name: '批发-销售额-环期值', sale: true},
      wholeAmountToT: {name: '批发-销售额-环比增幅', scale: true, color: true},
      wholeAmountPct: {name: '批发-销售额-占比', scale: true, fixWidth: 145},
      wholeAmountOfLH: {name: '批发-销售额-占比联华类别', scale: true, icon: "PctHsCat", fixWidth: 145},

      // 经销-销售额
      distributionAmount: {name: '经销-销售额', sale: true},
      distributionAmountYoYValue: {name: '经销-销售额-同期值', sale: true},
      distributionAmountYoY: {name: '经销-销售额-同比增幅', scale: true, color: true},
      distributionAmountToTValue: {name: '经销-销售额-环期值', sale: true},
      distributionAmountToT: {name: '经销-销售额-环比增幅', scale: true, color: true},
      distributionAmountPct: {name: '经销-销售额-占比', scale: true, fixWidth: 145},
      distributionAmountOfLH: {name: '经销-销售额-占比联华类别', scale: true, icon: "PctHsCat", fixWidth: 145},

      // 联营-销售额
      jointAmount: {name: '联营-销售额', sale: true},
      jointAmountYoYValue: {name: '联营-销售额-同期值', sale: true},
      jointAmountYoY: {name: '联营-销售额-同比增幅', scale: true, color: true},
      jointAmountToTValue: {name: '联营-销售额-环期值', sale: true},
      jointAmountToT: {name: '联营-销售额-环比增幅', scale: true, color: true},
      jointAmountPct: {name: '联营-销售额-占比', scale: true, fixWidth: 145},
      jointAmountOfLH: {name: '联营-销售额-占比联华类别', scale: true, icon: "PctHsCat", fixWidth: 145},

      // 销售数
      allUnit: {name: '销售数'},
      allUnitYoYValue: {name: '销售数-同期值'},
      allUnitYoY: {name: '销售数-同比增幅', scale: true, color: true},
      allUnitToTValue: {name: '销售数-环期值'},
      allUnitToT: {name: '销售数-环比增幅', scale: true, color: true},
      allUnitPct: {name: '销售数-占比', scale: true, fixWidth: 145},

      // 零售-销售数
      retailUnit: {name: '零售-销售数'},
      retailUnitYoYValue: {name: '零售-销售数-同期值'},
      retailUnitYoY: {name: '零售-销售数-同比增幅', scale: true, color: true},
      retailUnitToTValue: {name: '零售-销售数-环期值'},
      retailUnitToT: {name: '零售-销售数-环比增幅', scale: true, color: true},
      retailUnitPct: {name: '零售-销售数-占比', scale: true, fixWidth: 145},

      // 批发-销售数
      wholeUnit: {name: '批发-销售数'},
      wholeUnitYoYValue: {name: '批发-销售数-同期值'},
      wholeUnitYoY: {name: '批发-销售数-同比增幅', scale: true, color: true},
      wholeUnitToTValue: {name: '批发-销售数-环期值'},
      wholeUnitToT: {name: '批发-销售数-环比增幅', scale: true, color: true},
      wholeUnitPct: {name: '批发-销售数-占比', scale: true, fixWidth: 145},

      // 经销-销售数
      distributionUnit: {name: '经销-销售数'},
      distributionUnitYoYValue: {name: '经销-销售数-同期值'},
      distributionUnitYoY: {name: '经销-销售数-同比增幅', scale: true, color: true},
      distributionUnitToTValue: {name: '经销-销售数-环期值'},
      distributionUnitToT: {name: '经销-销售数-环比增幅', scale: true, color: true},
      distributionUnitPct: {name: '经销-销售数-占比', scale: true, fixWidth: 145},

      // 联营-销售数
      jointUnit: {name: '联营-销售数'},
      jointUnitYoYValue: {name: '联营-销售数-同期值'},
      jointUnitYoY: {name: '联营-销售数-同比增幅', scale: true, color: true},
      jointUnitToTValue: {name: '联营-销售数-环期值'},
      jointUnitToT: {name: '联营-销售数-环比增幅', scale: true, color: true},
      jointUnitPct: {name: '联营-销售数-占比', scale: true, fixWidth: 145},

      // 销售成本
      allCost: {name: '销售成本', sale: true},
      allCostYoYValue: {name: '销售成本-同期值', sale: true},
      allCostYoY: {name: '销售成本-同比增幅', scale: true, color: true},
      allCostToTValue: {name: '销售成本-环期值', sale: true},
      allCostToT: {name: '销售成本-环比增幅', scale: true, color: true},
      allCostPct: {name: '销售成本-占比', scale: true},

      // 零售-销售成本
      retailCost: {name: '零售-销售成本', sale: true},
      retailCostYoYValue: {name: '零售-销售成本-同期值', sale: true},
      retailCostYoY: {name: '零售-销售成本-同比增幅', scale: true, color: true},
      retailCostToTValue: {name: '零售-销售成本-环期值', sale: true},
      retailCostToT: {name: '零售-销售成本-环比增幅', scale: true, color: true},
      retailCostPct: {name: '零售-销售成本-占比', scale: true},

      // 批发-销售成本
      wholeCost: {name: '批发-销售成本', sale: true},
      wholeCostYoYValue: {name: '批发-销售成本-同期值', sale: true},
      wholeCostYoY: {name: '批发-销售成本-同比增幅', scale: true, color: true},
      wholeCostToTValue: {name: '批发-销售成本-环期值', sale: true},
      wholeCostToT: {name: '批发-销售成本-环比增幅', scale: true, color: true},
      wholeCostPct: {name: '批发-销售成本-占比', scale: true},

      // 经销-销售成本
      distributionCost: {name: '经销-销售成本', sale: true},
      distributionCostYoYValue: {name: '经销-销售成本-同期值', sale: true},
      distributionCostYoY: {name: '经销-销售成本-同比增幅', scale: true, color: true},
      distributionCostToTValue: {name: '经销-销售成本-环期值', sale: true},
      distributionCostToT: {name: '经销-销售成本-环比增幅', scale: true, color: true},
      distributionCostPct: {name: '经销-销售成本-占比', scale: true},

      // 联营-销售成本
      jointCost: {name: '联营-销售成本', sale: true},
      jointCostYoYValue: {name: '联营-销售成本-同期值', sale: true},
      jointCostYoY: {name: '联营-销售成本-同比增幅', scale: true, color: true},
      jointCostToTValue: {name: '联营-销售成本-环期值', sale: true},
      jointCostToT: {name: '联营-销售成本-环比增幅', scale: true, color: true},
      jointCostPct: {name: '联营-销售成本-占比', scale: true},

      // 平均销售单价
      allUnitPrice: {name: '平均销售单价', unit: '元'},
      allUnitPriceYoYValue: {name: '平均销售单价-同期值', unit: '元'},
      allUnitPriceYoY: {name: '平均销售单价-同比增幅', scale: true, color: true},
      allUnitPriceToTValue: {name: '平均销售单价-环期值', unit: '元'},
      allUnitPriceToT: {name: '平均销售单价-环比增幅', scale: true, color: true},

      // 零售-平均销售单价
      retailUnitPrice: {name: '零售-平均销售单价', unit: '元'},
      retailUnitPriceYoYValue: {name: '零售-平均销售单价-同期值', unit: '元'},
      retailUnitPriceYoY: {name: '零售-平均销售单价-同比增幅', scale: true, color: true},
      retailUnitPriceToTValue: {name: '零售-平均销售单价-环期值', unit: '元'},
      retailUnitPriceToT: {name: '零售-平均销售单价-环比增幅', scale: true, color: true},

      // 批发-平均销售单价
      wholeUnitPrice: {name: '批发-平均销售单价', unit: '元'},
      wholeUnitPriceYoYValue: {name: '批发-平均销售单价-同期值', unit: '元'},
      wholeUnitPriceYoY: {name: '批发-平均销售单价-同比增幅', scale: true, color: true},
      wholeUnitPriceToTValue: {name: '批发-平均销售单价-环期值', unit: '元'},
      wholeUnitPriceToT: {name: '批发-平均销售单价-环比增幅', scale: true, color: true},

      // 经销-平均销售单价
      distributionUnitPrice: {name: '经销-平均销售单价', unit: '元'},
      distributionUnitPriceYoYValue: {name: '经销-平均销售单价-同期值', unit: '元'},
      distributionUnitPriceYoY: {name: '经销-平均销售单价-同比增幅', scale: true, color: true},
      distributionUnitPriceToTValue: {name: '经销-平均销售单价-环期值', unit: '元'},
      distributionUnitPriceToT: {name: '经销-平均销售单价-环比增幅', scale: true, color: true},

      // 联营-平均销售单价
      jointUnitPrice: {name: '联营-平均销售单价', unit: '元'},
      jointUnitPriceYoYValue: {name: '联营-平均销售单价-同期值', unit: '元'},
      jointUnitPriceYoY: {name: '联营-平均销售单价-同比增幅', scale: true, color: true},
      jointUnitPriceToTValue: {name: '联营-平均销售单价-环期值', unit: '元'},
      jointUnitPriceToT: {name: '联营-平均销售单价-环比增幅', scale: true, color: true},


      // 预估毛利额
      allBusinessProfit: {
        name: '预估毛利额',
        sale: true,
        icon: ["BusinessProfit", ["page_abnormal_minus_profit", "page_abnormal_minus_profit_by_store_product", "page_sale_profit"]]
      },
      allBusinessProfitYoYValue: {name: '预估毛利额-同期值', sale: true},
      allBusinessProfitYoY: {name: '预估毛利额-同比增幅', scale: true, color: true},
      allBusinessProfitToTValue: {name: '预估毛利额-环期值', sale: true},
      allBusinessProfitToT: {name: '预估毛利额-环比增幅', scale: true, color: true},
      allBusinessProfitPct: {name: '预估毛利额-占比', scale: true},

      // 零售-预估毛利额
      retailBusinessProfit: {name: '零售-预估毛利额', sale: true, icon: ["retailBusinessProfit", ["page_sale_profit"]]},
      retailBusinessProfitYoYValue: {name: '零售-预估毛利额-同期值', sale: true},
      retailBusinessProfitYoY: {name: '零售-预估毛利额-同比增幅', scale: true, color: true},
      retailBusinessProfitToTValue: {name: '零售-预估毛利额-环期值', sale: true},
      retailBusinessProfitToT: {name: '零售-预估毛利额-环比增幅', scale: true, color: true},
      retailBusinessProfitPct: {name: '零售-预估毛利额-占比', scale: true},

      // 批发-预估毛利额
      wholeBusinessProfit: {name: '批发-预估毛利额', sale: true, icon: ["wholeBusinessProfit", ["page_sale_profit"]]},
      wholeBusinessProfitYoYValue: {name: '批发-预估毛利额-同期值', sale: true},
      wholeBusinessProfitYoY: {name: '批发-预估毛利额-同比增幅', scale: true, color: true},
      wholeBusinessProfitToTValue: {name: '批发-预估毛利额-环期值', sale: true},
      wholeBusinessProfitToT: {name: '批发-预估毛利额-环比增幅', scale: true, color: true},
      wholeBusinessProfitPct: {name: '批发-预估毛利额-占比', scale: true},

      // 经销-预估毛利额
      distributionBusinessProfit: {name: '经销-预估毛利额', sale: true, icon: ["distributionBusinessProfit", ["page_sale_profit"]]},
      distributionBusinessProfitYoYValue: {name: '经销-预估毛利额-同期值', sale: true},
      distributionBusinessProfitYoY: {name: '经销-预估毛利额-同比增幅', scale: true, color: true},
      distributionBusinessProfitToTValue: {name: '经销-预估毛利额-环期值', sale: true},
      distributionBusinessProfitToT: {name: '经销-预估毛利额-环比增幅', scale: true, color: true},
      distributionBusinessProfitPct: {name: '经销-预估毛利额-占比', scale: true},

      // 联营-预估毛利额
      jointBusinessProfit: {name: '联营-预估毛利额', sale: true, icon: ["jointBusinessProfit", ["page_sale_profit"]]},
      jointBusinessProfitYoYValue: {name: '联营-预估毛利额-同期值', sale: true},
      jointBusinessProfitYoY: {name: '联营-预估毛利额-同比增幅', scale: true, color: true},
      jointBusinessProfitToTValue: {name: '联营-预估毛利额-环期值', sale: true},
      jointBusinessProfitToT: {name: '联营-预估毛利额-环比增幅', scale: true, color: true},
      jointBusinessProfitPct: {name: '联营-预估毛利额-占比', scale: true},

      // 毛利额
      allProfit: {name: '毛利额', sale: true, icon: ["allProfit", ["page_sale_profit"]], page: {skuContrast: '商品毛利额'}},
      allProfitYoYValue: {name: '毛利额-同期值', sale: true},
      allProfitYoY: {name: '毛利额-同比增幅', scale: true, color: true},
      allProfitToTValue: {name: '毛利额-环期值', sale: true},
      allProfitToT: {name: '毛利额-环比增幅', scale: true, color: true},
      allProfitPct: {name: '毛利额-占比', scale: true},

      // 零售-毛利额
      retailProfit: {name: '零售-毛利额', sale: true, icon: ["retailProfit", ["page_sale_profit"]]},
      retailProfitYoYValue: {name: '零售-毛利额-同期值', sale: true},
      retailProfitYoY: {name: '零售-毛利额-同比增幅', scale: true, color: true},
      retailProfitToTValue: {name: '零售-毛利额-环期值', sale: true},
      retailProfitToT: {name: '零售-毛利额-环比增幅', scale: true, color: true},
      retailProfitPct: {name: '零售-毛利额-占比', scale: true},

      // 批发-毛利额
      wholeProfit: {name: '批发-毛利额', sale: true, icon: ["wholeProfit", ["page_sale_profit"]]},
      wholeProfitYoYValue: {name: '批发-毛利额-同期值', sale: true},
      wholeProfitYoY: {name: '批发-毛利额-同比增幅', scale: true, color: true},
      wholeProfitToTValue: {name: '批发-毛利额-环期值', sale: true},
      wholeProfitToT: {name: '批发-毛利额-环比增幅', scale: true, color: true},
      wholeProfitPct: {name: '批发-毛利额-占比', scale: true},

      // 经销-毛利额
      distributionProfit: {name: '经销-毛利额', sale: true, icon: ["distributionProfit", ["page_sale_profit"]]},
      distributionProfitYoYValue: {name: '经销-毛利额-同期值', sale: true},
      distributionProfitYoY: {name: '经销-毛利额-同比增幅', scale: true, color: true},
      distributionProfitToTValue: {name: '经销-毛利额-环期值', sale: true},
      distributionProfitToT: {name: '经销-毛利额-环比增幅', scale: true, color: true},
      distributionProfitPct: {name: '经销-毛利额-占比', scale: true},

      // 联营-毛利额
      jointProfit: {name: '联营-毛利额', sale: true, icon: ["jointProfit", ["page_sale_profit"]]},
      jointProfitYoYValue: {name: '联营-毛利额-同期值', sale: true},
      jointProfitYoY: {name: '联营-毛利额-同比增幅', scale: true, color: true},
      jointProfitToTValue: {name: '联营-毛利额-环期值', sale: true},
      jointProfitToT: {name: '联营-毛利额-环比增幅', scale: true, color: true},
      jointProfitPct: {name: '联营-毛利额-占比', scale: true},

      // 预估毛利率
      allBusinessProfitRate: {name: '预估毛利率', scale: true, icon: "allBusinessProfitRate"},
      allBusinessProfitRateYoYValue: {name: '预估毛利率-同期值', scale: true},
      allBusinessProfitRateYoYInc: {name: '预估毛利率-同比增长', inc: 2, color: true},
      allBusinessProfitRateToTValue: {name: '预估毛利率-环期值', scale: true},
      allBusinessProfitRateToTInc: {name: '预估毛利率-环比增长', inc: 2, color: true},

      // 零售-预估毛利率
      retailBusinessProfitRate: {name: '零售-预估毛利率', scale: true, icon: "retailBusinessProfitRate"},
      retailBusinessProfitRateYoYValue: {name: '零售-预估毛利率-同期值', scale: true},
      retailBusinessProfitRateYoYInc: {name: '零售-预估毛利率-同比增长', inc: 2, color: true},
      retailBusinessProfitRateToTValue: {name: '零售-预估毛利率-环期值', scale: true},
      retailBusinessProfitRateToTInc: {name: '零售-预估毛利率-环比增长', inc: 2, color: true},

      // 批发-预估毛利率
      wholeBusinessProfitRate: {name: '批发-预估毛利率', scale: true, icon: "wholeBusinessProfitRate"},
      wholeBusinessProfitRateYoYValue: {name: '批发-预估毛利率-同期值', scale: true},
      wholeBusinessProfitRateYoYInc: {name: '批发-预估毛利率-同比增长', inc: 2, color: true},
      wholeBusinessProfitRateToTValue: {name: '批发-预估毛利率-环期值', scale: true},
      wholeBusinessProfitRateToTInc: {name: '批发-预估毛利率-环比增长', inc: 2, color: true},

      // 经销-预估毛利率
      distributionBusinessProfitRate: {name: '经销-预估毛利率', scale: true, icon: "distributionBusinessProfitRate"},
      distributionBusinessProfitRateYoYValue: {name: '经销-预估毛利率-同期值', scale: true},
      distributionBusinessProfitRateYoYInc: {name: '经销-预估毛利率-同比增长', inc: 2, color: true},
      distributionBusinessProfitRateToTValue: {name: '经销-预估毛利率-环期值', scale: true},
      distributionBusinessProfitRateToTInc: {name: '经销-预估毛利率-环比增长', inc: 2, color: true},

      // 联营-预估毛利率
      jointBusinessProfitRate: {name: '联营-预估毛利率', scale: true, icon: "jointBusinessProfitRate"},
      jointBusinessProfitRateYoYValue: {name: '联营-预估毛利率-同期值', scale: true},
      jointBusinessProfitRateYoYInc: {name: '联营-预估毛利率-同比增长', inc: 2, color: true},
      jointBusinessProfitRateToTValue: {name: '联营-预估毛利率-环期值', scale: true},
      jointBusinessProfitRateToTInc: {name: '联营-预估毛利率-环比增长', inc: 2, color: true},

      // 毛利率
      allProfitRate: {name: '毛利率', scale: true, icon: 'allProfitRate'},
      allProfitRateYoYValue: {name: '毛利率-同期值', scale: true},
      allProfitRateYoYInc: {name: '毛利率-同比增长', inc: 2, color: true},
      allProfitRateToTValue: {name: '毛利率-环期值', scale: true},
      allProfitRateToTInc: {name: '毛利率-环比增长', inc: 2, color: true},

      // 零售-毛利率
      retailProfitRate: {name: '零售-毛利率', scale: true, icon: 'retailProfitRate'},
      retailProfitRateYoYValue: {name: '零售-毛利率-同期值', scale: true},
      retailProfitRateYoYInc: {name: '零售-毛利率-同比增长', inc: 2, color: true},
      retailProfitRateToTValue: {name: '零售-毛利率-环期值', scale: true},
      retailProfitRateToTInc: {name: '零售-毛利率-环比增长', inc: 2, color: true},

      // 批发-毛利率
      wholeProfitRate: {name: '批发-毛利率', scale: true, icon: 'wholeProfitRate'},
      wholeProfitRateYoYValue: {name: '批发-毛利率-同期值', scale: true},
      wholeProfitRateYoYInc: {name: '批发-毛利率-同比增长', inc: 2, color: true},
      wholeProfitRateToTValue: {name: '批发-毛利率-环期值', scale: true},
      wholeProfitRateToTInc: {name: '批发-毛利率-环比增长', inc: 2, color: true},

      // 经销-毛利率
      distributionProfitRate: {name: '经销-毛利率', scale: true, icon: 'distributionProfitRate'},
      distributionProfitRateYoYValue: {name: '经销-毛利率-同期值', scale: true},
      distributionProfitRateYoYInc: {name: '经销-毛利率-同比增长', inc: 2, color: true},
      distributionProfitRateToTValue: {name: '经销-毛利率-环期值', scale: true},
      distributionProfitRateToTInc: {name: '经销-毛利率-环比增长', inc: 2, color: true},

      // 联营-毛利率
      jointProfitRate: {name: '联营-毛利率', scale: true, icon: 'jointProfitRate'},
      jointProfitRateYoYValue: {name: '联营-毛利率-同期值', scale: true},
      jointProfitRateYoYInc: {name: '联营-毛利率-同比增长', inc: 2, color: true},
      jointProfitRateToTValue: {name: '联营-毛利率-环期值', scale: true},
      jointProfitRateToTInc: {name: '联营-毛利率-环比增长', inc: 2, color: true},

      // 平均成本单价
      allCostPrice: {name: '平均成本单价'},
      allCostPriceYoYValue: {name: '平均成本单价-同期值'},
      allCostPriceYoY: {name: '平均成本单价-同比增幅', scale: true, color: true},
      allCostPriceToTValue: {name: '平均成本单价-环期值'},
      allCostPriceToT: {name: '平均成本单价-环比增幅', scale: true, color: true},

      // 日均库存金额
      stockCost: {name: '日均库存金额', sale: true},
      stockCostYoYValue: {name: '日均库存金额-同期值', sale: true},
      stockCostYoY: {name: '日均库存金额-同比增幅', scale: true, color: true},
      stockCostToTValue: {name: '日均库存金额-环期值', sale: true},
      stockCostToT: {name: '日均库存金额-环比增幅', scale: true, color: true},
      stockCostPct: {name: '日均库存额占比', scale: true},

      // 日均库存数
      stockQty: {name: '日均库存数'},
      stockQtyYoYValue: {name: '日均库存数-同期值'},
      stockQtyYoY: {name: '日均库存数-同比增幅', scale: true, color: true},
      stockQtyToTValue: {name: '日均库存数-环期值'},
      stockQtyToT: {name: '日均库存数-环比增幅', scale: true, color: true},
      stockQtyPct: {name: '日均库存数占比', scale: true},

      // 最新库存
      stockCostLatest: {name: '最新库存金额', sale: true},
      stockQtyLatest: {name: '最新库存数'},

      // 经销周转天数
      saleDays: {name: '经销周转天数', icon: "saleDays", page: {skuContrast: "商品经销周转天数"}},
      saleDaysYoYValue: {name: '经销周转天数-同期值'},
      saleDaysYoYInc: {name: '经销周转天数-同比增长', inc: 1, color: true},
      saleDaysToTValue: {name: '经销周转天数-环期值'},
      saleDaysToTInc: {name: '经销周转天数-环比增长', inc: 1, color: true},

      //（买断指标，日均库存金额，库存， 周转天数，最新库存）
      // 日均库存金额
      buyoutStockCost: {name: '日均库存金额(买断)', sale: true},
      buyoutStockCostYoYValue: {name: '日均库存金额(买断)-同期值', sale: true},
      buyoutStockCostYoY: {name: '日均库存金额(买断)-同比增幅', scale: true, color: true},
      buyoutStockCostToTValue: {name: '日均库存金额(买断)-环期值', sale: true},
      buyoutStockCostToT: {name: '日均库存金额(买断)-环比增幅', scale: true, color: true},
      buyoutStockCostPct: {name: '日均库存金额(买断)占比', scale: true},

      // 日均库存数
      buyoutStockQty: {name: '日均库存数(买断)'},
      buyoutStockQtyYoYValue: {name: '日均库存数(买断)-同期值'},
      buyoutStockQtyYoY: {name: '日均库存数(买断)-同比增幅', scale: true, color: true},
      buyoutStockQtyToTValue: {name: '日均库存数(买断)-环期值'},
      buyoutStockQtyToT: {name: '日均库存数(买断)-环比增幅', scale: true, color: true},
      buyoutStockQtyPct: {name: '日均库存数(买断)占比', scale: true},

      // 最新库存
      buyoutStockCostLatest: {name: '最新库存金额(买断)', sale: true},
      buyoutStockQtyLatest: {name: '最新库存数(买断)'},

      // 经销周转天数
      buyoutSaleDays: {name: '经销周转天数(买断)'},
      buyoutSaleDaysYoYValue: {name: '经销周转天数(买断)-同期值'},
      buyoutSaleDaysYoYInc: {name: '经销周转天数(买断)-同比增长', inc: 1, color: true},
      buyoutSaleDaysToTValue: {name: '经销周转天数(买断)-环期值'},
      buyoutSaleDaysToTInc: {name: '经销周转天数(买断)-环比增长', inc: 1, color: true},

      // 客单数 time:万次，首页专用
      flowCnt: {name: '客单数', point: 0, time: true},
      flowCntYoYValue: {name: '客单数-同期值', point: 0, time: true, fixWidth: 145},
      flowCntYoY: {name: '客单数-同比增幅', scale: true, color: true, fixWidth: 145},
      flowCntToTValue: {name: '客单数-环期值', point: 0, fixWidth: 145},
      flowCntToT: {name: '客单数-环比增幅', scale: true, color: true, fixWidth: 145},
      flowCntPct: {name: '客单数-占比', scale: true, color: true},


      // 日均客单数
      flowCntDay: {name: '日均客单数', point: 0, time: true},
      flowCntDayYoYValue: {name: '日均客单数-同期值', point: 0, time: true, fixWidth: 145},
      flowCntDayYoY: {name: '日均客单数-同比增幅', scale: true, color: true, fixWidth: 145},
      flowCntDayToTValue: {name: '日均客单数-环期值', point: 0, fixWidth: 145},
      flowCntDayToT: {name: '日均客单数-环比增幅', scale: true, color: true, fixWidth: 145},
      flowCntDayPct: {name: '日均客单数-占比', scale: true, color: true},

      // 客流渗透率
      flowCntProportion: {name: '客流渗透率', scale: true, icon: "FlowCntCat"},
      flowCntProportionYoY: {name: '客流渗透率-同比增长', inc: 2, color: true},
      flowCntProportionYoYValue: {name: '客流渗透率-同期值', scale: true},
      flowCntProportionToT: {name: '客流渗透率-环比增长', inc: 2, color: true},
      flowCntProportionToTValue: {name: '客流渗透率-环期值', scale: true},

      // 零售客单价
      retailFlowAmount: {name: '零售客单价', unit: '元'},
      retailFlowAmountYoYValue: {name: '零售客单价-同期值', unit: '元'},
      retailFlowAmountYoY: {name: '零售客单价-同比增幅', scale: true, color: true, fixWidth: 145},
      retailFlowAmountToTValue: {name: '零售客单价-环期值', unit: '元', fixWidth: 145},
      retailFlowAmountToT: {name: '零售客单价-环比增幅', scale: true, color: true, fixWidth: 145},
      retailFlowAmountPct: {name: '零售客单价-占比', scale: true, color: true},

      // 销售毛利
      allSaleProfit: {name: '销售毛利', sale: true, icon: "allSaleProfit"},
      allSaleProfitYoYValue: {name: '销售毛利-同期值', sale: true},
      allSaleProfitYoY: {name: '销售毛利-同比增幅', scale: true, color: true},
      allSaleProfitToTValue: {name: '销售毛利-环期值', sale: true},
      allSaleProfitToT: {name: '销售毛利-环比增幅', scale: true, color: true},
      allSaleProfitPct: {name: '销售毛利-占比', scale: true},

      // 零售-销售毛利
      retailSaleProfit: {name: '零售-销售毛利', sale: true},
      retailSaleProfitYoYValue: {name: '零售-销售毛利-同期值', sale: true},
      retailSaleProfitYoY: {name: '零售-销售毛利-同比增幅', scale: true, color: true},
      retailSaleProfitToTValue: {name: '零售-销售毛利-环期值', sale: true},
      retailSaleProfitToT: {name: '零售-销售毛利-环比增幅', scale: true, color: true},
      retailSaleProfitPct: {name: '零售-销售毛利-占比', scale: true},

      // 批发-销售毛利
      wholeSaleProfit: {name: '批发-销售毛利', sale: true},
      wholeSaleProfitYoYValue: {name: '批发-销售毛利-同期值', sale: true},
      wholeSaleProfitYoY: {name: '批发-销售毛利-同比增幅', scale: true, color: true},
      wholeSaleProfitToTValue: {name: '批发-销售毛利-环期值', sale: true},
      wholeSaleProfitToT: {name: '批发-销售毛利-环比增幅', scale: true, color: true},
      wholeSaleProfitPct: {name: '批发-销售毛利-占比', scale: true},

      // 经销-销售毛利
      distributionSaleProfit: {name: '经销-销售毛利', sale: true},
      distributionSaleProfitYoYValue: {name: '经销-销售毛利-同期值', sale: true},
      distributionSaleProfitYoY: {name: '经销-销售毛利-同比增幅', scale: true, color: true},
      distributionSaleProfitToTValue: {name: '经销-销售毛利-环期值', sale: true},
      distributionSaleProfitToT: {name: '经销-销售毛利-环比增幅', scale: true, color: true},
      distributionSaleProfitPct: {name: '经销-销售毛利-占比', scale: true},
      newAvgBizProfitAmount: {name: ' 新品平均毛利额', sale: true, icon: 'new_profit_new'},
      allAvgBizProfitAmount: {name: ' 商品平均毛利额', sale: true, icon: 'new_profit_goods'},

      // 联营-销售毛利
      jointSaleProfit: {name: '联营-销售毛利', sale: true},
      jointSaleProfitYoYValue: {name: '联营-销售毛利-同期值', sale: true},
      jointSaleProfitYoY: {name: '联营-销售毛利-同比增幅', scale: true, color: true},
      jointSaleProfitToTValue: {name: '联营-销售毛利-环期值', sale: true},
      jointSaleProfitToT: {name: '联营-销售毛利-环比增幅', scale: true, color: true},
      jointSaleProfitPct: {name: '联营-销售毛利-占比', scale: true},

      // 生鲜加价(收货)
      allRealFreshProfit: {name: '生鲜加价(收货)', sale: true},
      allRealFreshProfitYoYValue: {name: '生鲜加价(收货)-同期值', sale: true},
      allRealFreshProfitYoY: {name: '生鲜加价(收货)-同比增幅', scale: true, color: true},
      allRealFreshProfitToTValue: {name: '生鲜加价(收货)-环期值', sale: true},
      allRealFreshProfitToT: {name: '生鲜加价(收货)-环比增幅', scale: true, color: true},
      allRealFreshProfitPct: {name: '生鲜加价(收货)-占比', scale: true},

      // 零售-生鲜加价(收货)
      retailRealFreshProfit: {name: '零售-生鲜加价(收货)', sale: true},
      retailRealFreshProfitYoYValue: {name: '零售-生鲜加价(收货)-同期值', sale: true},
      retailRealFreshProfitYoY: {name: '零售-生鲜加价(收货)-同比增幅', scale: true, color: true},
      retailRealFreshProfitToTValue: {name: '零售-生鲜加价(收货)-环期值', sale: true},
      retailRealFreshProfitToT: {name: '零售-生鲜加价(收货)-环比增幅', scale: true, color: true},
      retailRealFreshProfitPct: {name: '零售-生鲜加价(收货)-占比', scale: true},

      // 批发-生鲜加价(收货)
      wholeRealFreshProfit: {name: '批发-生鲜加价(收货)', sale: true},
      wholeRealFreshProfitYoYValue: {name: '批发-生鲜加价(收货)-同期值', sale: true},
      wholeRealFreshProfitYoY: {name: '批发-生鲜加价(收货)-同比增幅', scale: true, color: true},
      wholeRealFreshProfitToTValue: {name: '批发-生鲜加价(收货)-环期值', sale: true},
      wholeRealFreshProfitToT: {name: '批发-生鲜加价(收货)-环比增幅', scale: true, color: true},
      wholeRealFreshProfitPct: {name: '批发-生鲜加价(收货)-占比', scale: true},

      // 经销-生鲜加价(收货)
      distributionRealFreshProfit: {name: '经销-生鲜加价(收货)', sale: true},
      distributionRealFreshProfitYoYValue: {name: '经销-生鲜加价(收货)-同期值', sale: true},
      distributionRealFreshProfitYoY: {name: '经销-生鲜加价(收货)-同比增幅', scale: true, color: true},
      distributionRealFreshProfitToTValue: {name: '经销-生鲜加价(收货)-环期值', sale: true},
      distributionRealFreshProfitToT: {name: '经销-生鲜加价(收货)-环比增幅', scale: true, color: true},
      distributionRealFreshProfitPct: {name: '经销-生鲜加价(收货)-占比', scale: true},

      // 联营-生鲜加价(收货)
      jointRealFreshProfit: {name: '联营-生鲜加价(收货)', sale: true},
      jointRealFreshProfitYoYValue: {name: '联营-生鲜加价(收货)-同期值', sale: true},
      jointRealFreshProfitYoY: {name: '联营-生鲜加价(收货)-同比增幅', scale: true, color: true},
      jointRealFreshProfitToTValue: {name: '联营-生鲜加价(收货)-环期值', sale: true},
      jointRealFreshProfitToT: {name: '联营-生鲜加价(收货)-环比增幅', scale: true, color: true},
      jointRealFreshProfitPct: {name: '联营-生鲜加价(收货)-占比', scale: true},

      // 生鲜加价(售出)
      allRealFreshBizProfit: {name: '生鲜加价(售出)', sale: true},
      allRealFreshBizProfitYoYValue: {name: '生鲜加价(售出)-同期值', sale: true},
      allRealFreshBizProfitYoY: {name: '生鲜加价(售出)-同比增幅', scale: true, color: true},
      allRealFreshBizProfitToTValue: {name: '生鲜加价(售出)-环期值', sale: true},
      allRealFreshBizProfitToT: {name: '生鲜加价(售出)-环比增幅', scale: true, color: true},
      allRealFreshBizProfitPct: {name: '生鲜加价(售出)-占比', scale: true},

      // 零售-生鲜加价(售出)
      retailRealFreshBizProfit: {name: '零售-生鲜加价(售出)', sale: true},
      retailRealFreshBizProfitYoYValue: {name: '零售-生鲜加价(售出)-同期值', sale: true},
      retailRealFreshBizProfitYoY: {name: '零售-生鲜加价(售出)-同比增幅', scale: true, color: true},
      retailRealFreshBizProfitToTValue: {name: '零售-生鲜加价(售出)-环期值', sale: true},
      retailRealFreshBizProfitToT: {name: '零售-生鲜加价(售出)-环比增幅', scale: true, color: true},
      retailRealFreshBizProfitPct: {name: '零售-生鲜加价(售出)-占比', scale: true},

      // 批发-生鲜加价(售出)
      wholeRealFreshBizProfit: {name: '批发-生鲜加价(售出)', sale: true},
      wholeRealFreshBizProfitYoYValue: {name: '批发-生鲜加价(售出)-同期值', sale: true},
      wholeRealFreshBizProfitYoY: {name: '批发-生鲜加价(售出)-同比增幅', scale: true, color: true},
      wholeRealFreshBizProfitToTValue: {name: '批发-生鲜加价(售出)-环期值', sale: true},
      wholeRealFreshBizProfitToT: {name: '批发-生鲜加价(售出)-环比增幅', scale: true, color: true},
      wholeRealFreshBizProfitPct: {name: '批发-生鲜加价(售出)-占比', scale: true},

      // 经销-生鲜加价(售出)
      distributionRealFreshBizProfit: {name: '经销-生鲜加价(售出)', sale: true},
      distributionRealFreshBizProfitYoYValue: {name: '经销-生鲜加价(售出)-同期值', sale: true},
      distributionRealFreshBizProfitYoY: {name: '经销-生鲜加价(售出)-同比增幅', scale: true, color: true},
      distributionRealFreshBizProfitToTValue: {name: '经销-生鲜加价(售出)-环期值', sale: true},
      distributionRealFreshBizProfitToT: {name: '经销-生鲜加价(售出)-环比增幅', scale: true, color: true},
      distributionRealFreshBizProfitPct: {name: '经销-生鲜加价(售出)-占比', scale: true},

      // 联营-生鲜加价(售出)
      jointRealFreshBizProfit: {name: '联营-生鲜加价(售出)', sale: true},
      jointRealFreshBizProfitYoYValue: {name: '联营-生鲜加价(售出)-同期值', sale: true},
      jointRealFreshBizProfitYoY: {name: '联营-生鲜加价(售出)-同比增幅', scale: true, color: true},
      jointRealFreshBizProfitToTValue: {name: '联营-生鲜加价(售出)-环期值', sale: true},
      jointRealFreshBizProfitToT: {name: '联营-生鲜加价(售出)-环比增幅', scale: true, color: true},
      jointRealFreshBizProfitPct: {name: '联营-生鲜加价(售出)-占比', scale: true},

      // 预估销售补差
      allEstDiffProfitTotal: {name: '预估销售补差', sale: true, icon: "allEstDiffProfit"},
      allEstDiffProfitTotalYoYValue: {name: '预估销售补差-同期值', sale: true},
      allEstDiffProfitTotalYoY: {name: '预估销售补差-同比增幅', scale: true, color: true},
      allEstDiffProfitTotalToTValue: {name: '预估销售补差-环期值', sale: true},
      allEstDiffProfitTotalToT: {name: '预估销售补差-环比增幅', scale: true, color: true},
      allEstDiffProfitTotalPct: {name: '预估销售补差-占比', scale: true},

      // 零售-预估销售补差
      retailEstDiffProfitTotal: {name: '零售-预估销售补差', sale: true, icon: "retailEstDiffProfit"},
      retailEstDiffProfitTotalYoYValue: {name: '零售-预估销售补差-同期值', sale: true},
      retailEstDiffProfitTotalYoY: {name: '零售-预估销售补差-同比增幅', scale: true, color: true},
      retailEstDiffProfitTotalToTValue: {name: '零售-预估销售补差-环期值', sale: true},
      retailEstDiffProfitTotalToT: {name: '零售-预估销售补差-环比增幅', scale: true, color: true},
      retailEstDiffProfitTotalPct: {name: '零售-预估销售补差-占比', scale: true},

      // 批发-预估销售补差
      wholeEstDiffProfitTotal: {name: '批发-预估销售补差', sale: true, icon: "wholeEstDiffProfit"},
      wholeEstDiffProfitTotalYoYValue: {name: '批发-预估销售补差-同期值', sale: true},
      wholeEstDiffProfitTotalYoY: {name: '批发-预估销售补差-同比增幅', scale: true, color: true},
      wholeEstDiffProfitTotalToTValue: {name: '批发-预估销售补差-环期值', sale: true},
      wholeEstDiffProfitTotalToT: {name: '批发-预估销售补差-环比增幅', scale: true, color: true},
      wholeEstDiffProfitTotalPct: {name: '批发-预估销售补差-占比', scale: true},

      // 经销-预估销售补差
      distributionEstDiffProfitTotal: {name: '经销-预估销售补差', sale: true, icon: "distributionEstDiffProfit"},
      distributionEstDiffProfitTotalYoYValue: {name: '经销-预估销售补差-同期值', sale: true},
      distributionEstDiffProfitTotalYoY: {name: '经销-预估销售补差-同比增幅', scale: true, color: true},
      distributionEstDiffProfitTotalToTValue: {name: '经销-预估销售补差-环期值', sale: true},
      distributionEstDiffProfitTotalToT: {name: '经销-预估销售补差-环比增幅', scale: true, color: true},
      distributionEstDiffProfitTotalPct: {name: '经销-预估销售补差-占比', scale: true},

      // 联营-预估销售补差
      jointEstDiffProfitTotal: {name: '联营-预估销售补差', sale: true, icon: "jointEstDiffProfit"},
      jointEstDiffProfitTotalYoYValue: {name: '联营-预估销售补差-同期值', sale: true},
      jointEstDiffProfitTotalYoY: {name: '联营-预估销售补差-同比增幅', scale: true, color: true},
      jointEstDiffProfitTotalToTValue: {name: '联营-预估销售补差-环期值', sale: true},
      jointEstDiffProfitTotalToT: {name: '联营-预估销售补差-环比增幅', scale: true, color: true},
      jointEstDiffProfitTotalPct: {name: '联营-预估销售补差-占比', scale: true},

      // 销售补差
      allRealDiffProfitTotal: {name: '销售补差', sale: true, icon: "allRealDiffProfit"},
      allRealDiffProfitTotalYoYValue: {name: '销售补差-同期值', sale: true},
      allRealDiffProfitTotalYoY: {name: '销售补差-同比增幅', scale: true, color: true},
      allRealDiffProfitTotalToTValue: {name: '销售补差-环期值', sale: true},
      allRealDiffProfitTotalToT: {name: '销售补差-环比增幅', scale: true, color: true},
      allRealDiffProfitTotalPct: {name: '销售补差-占比', scale: true},

      // 零售-销售补差
      retailRealDiffProfitTotal: {name: '零售-销售补差', sale: true, icon: "retailRealDiffProfit"},
      retailRealDiffProfitTotalYoYValue: {name: '零售-销售补差-同期值', sale: true},
      retailRealDiffProfitTotalYoY: {name: '零售-销售补差-同比增幅', scale: true, color: true},
      retailRealDiffProfitTotalToTValue: {name: '零售-销售补差-环期值', sale: true},
      retailRealDiffProfitTotalToT: {name: '零售-销售补差-环比增幅', scale: true, color: true},
      retailRealDiffProfitTotalPct: {name: '零售-销售补差-占比', scale: true},

      // 批发-销售补差
      wholeRealDiffProfitTotal: {name: '批发-销售补差', sale: true, icon: "wholeRealDiffProfit"},
      wholeRealDiffProfitTotalYoYValue: {name: '批发-销售补差-同期值', sale: true},
      wholeRealDiffProfitTotalYoY: {name: '批发-销售补差-同比增幅', scale: true, color: true},
      wholeRealDiffProfitTotalToTValue: {name: '批发-销售补差-环期值', sale: true},
      wholeRealDiffProfitTotalToT: {name: '批发-销售补差-环比增幅', scale: true, color: true},
      wholeRealDiffProfitTotalPct: {name: '批发-销售补差-占比', scale: true},

      // 经销-销售补差
      distributionRealDiffProfitTotal: {name: '经销-销售补差', sale: true, icon: "distributionRealDiffProfit"},
      distributionRealDiffProfitTotalYoYValue: {name: '经销-销售补差-同期值', sale: true},
      distributionRealDiffProfitTotalYoY: {name: '经销-销售补差-同比增幅', scale: true, color: true},
      distributionRealDiffProfitTotalToTValue: {name: '经销-销售补差-环期值', sale: true},
      distributionRealDiffProfitTotalToT: {name: '经销-销售补差-环比增幅', scale: true, color: true},
      distributionRealDiffProfitTotalPct: {name: '经销-销售补差-占比', scale: true},

      // 联营-销售补差
      jointRealDiffProfitTotal: {name: '联营-销售补差', sale: true, icon: "jointRealDiffProfit"},
      jointRealDiffProfitTotalYoYValue: {name: '联营-销售补差-同期值', sale: true},
      jointRealDiffProfitTotalYoY: {name: '联营-销售补差-同比增幅', scale: true, color: true},
      jointRealDiffProfitTotalToTValue: {name: '联营-销售补差-环期值', sale: true},
      jointRealDiffProfitTotalToT: {name: '联营-销售补差-环比增幅', scale: true, color: true},
      jointRealDiffProfitTotalPct: {name: '联营-销售补差-占比', scale: true},

      // 预估促销补差
      allEstDiffProfit: {name: '预估促销补差', sale: true, icon: 'estDiffProfit'},
      allEstDiffProfitYoYValue: {name: '预估促销补差-同期值', sale: true},
      allEstDiffProfitYoY: {name: '预估促销补差-同比增幅', scale: true, color: true},
      allEstDiffProfitToTValue: {name: '预估促销补差-环期值', sale: true},
      allEstDiffProfitToT: {name: '预估促销补差-环比增幅', scale: true, color: true},
      allEstDiffProfitPct: {name: '预估促销补差-占比', scale: true},

      // 零售-预估促销补差
      retailEstDiffProfit: {name: '零售-预估促销补差', sale: true},
      retailEstDiffProfitYoYValue: {name: '零售-预估促销补差-同期值', sale: true},
      retailEstDiffProfitYoY: {name: '零售-预估促销补差-同比增幅', scale: true, color: true},
      retailEstDiffProfitToTValue: {name: '零售-预估促销补差-环期值', sale: true},
      retailEstDiffProfitToT: {name: '零售-预估促销补差-环比增幅', scale: true, color: true},
      retailEstDiffProfitPct: {name: '零售-预估促销补差-占比', scale: true},

      // 批发-预估促销补差
      wholeEstDiffProfit: {name: '批发-预估促销补差', sale: true},
      wholeEstDiffProfitYoYValue: {name: '批发-预估促销补差-同期值', sale: true},
      wholeEstDiffProfitYoY: {name: '批发-预估促销补差-同比增幅', scale: true, color: true},
      wholeEstDiffProfitToTValue: {name: '批发-预估促销补差-环期值', sale: true},
      wholeEstDiffProfitToT: {name: '批发-预估促销补差-环比增幅', scale: true, color: true},
      wholeEstDiffProfitPct: {name: '批发-预估促销补差-占比', scale: true},

      // 经销-预估促销补差
      distributionEstDiffProfit: {name: '经销-预估促销补差', sale: true},
      distributionEstDiffProfitYoYValue: {name: '经销-预估促销补差-同期值', sale: true},
      distributionEstDiffProfitYoY: {name: '经销-预估促销补差-同比增幅', scale: true, color: true},
      distributionEstDiffProfitToTValue: {name: '经销-预估促销补差-环期值', sale: true},
      distributionEstDiffProfitToT: {name: '经销-预估促销补差-环比增幅', scale: true, color: true},
      distributionEstDiffProfitPct: {name: '经销-预估促销补差-占比', scale: true},

      // 联营-预估促销补差
      jointEstDiffProfit: {name: '联营-预估促销补差', sale: true},
      jointEstDiffProfitYoYValue: {name: '联营-预估促销补差-同期值', sale: true},
      jointEstDiffProfitYoY: {name: '联营-预估促销补差-同比增幅', scale: true, color: true},
      jointEstDiffProfitToTValue: {name: '联营-预估促销补差-环期值', sale: true},
      jointEstDiffProfitToT: {name: '联营-预估促销补差-环比增幅', scale: true, color: true},
      jointEstDiffProfitPct: {name: '联营-预估促销补差-占比', scale: true},

      // 促销补差
      allRealDiffProfit: {name: '促销补差', sale: true},
      allRealDiffProfitYoYValue: {name: '促销补差-同期值', sale: true},
      allRealDiffProfitYoY: {name: '促销补差-同比增幅', scale: true, color: true},
      allRealDiffProfitToTValue: {name: '促销补差-环期值', sale: true},
      allRealDiffProfitToT: {name: '促销补差-环比增幅', scale: true, color: true},
      allRealDiffProfitPct: {name: '促销补差-占比', scale: true},

      // 零售-促销补差
      retailRealDiffProfit: {name: '零售-促销补差', sale: true},
      retailRealDiffProfitYoYValue: {name: '零售-促销补差-同期值', sale: true},
      retailRealDiffProfitYoY: {name: '零售-促销补差-同比增幅', scale: true, color: true},
      retailRealDiffProfitToTValue: {name: '零售-促销补差-环期值', sale: true},
      retailRealDiffProfitToT: {name: '零售-促销补差-环比增幅', scale: true, color: true},
      retailRealDiffProfitPct: {name: '零售-促销补差-占比', scale: true},

      // 批发-促销补差
      wholeRealDiffProfit: {name: '批发-促销补差', sale: true},
      wholeRealDiffProfitYoYValue: {name: '批发-促销补差-同期值', sale: true},
      wholeRealDiffProfitYoY: {name: '批发-促销补差-同比增幅', scale: true, color: true},
      wholeRealDiffProfitToTValue: {name: '批发-促销补差-环期值', sale: true},
      wholeRealDiffProfitToT: {name: '批发-促销补差-环比增幅', scale: true, color: true},
      wholeRealDiffProfitPct: {name: '批发-促销补差-占比', scale: true},

      // 经销-促销补差
      distributionRealDiffProfit: {name: '经销-促销补差', sale: true},
      distributionRealDiffProfitYoYValue: {name: '经销-促销补差-同期值', sale: true},
      distributionRealDiffProfitYoY: {name: '经销-促销补差-同比增幅', scale: true, color: true},
      distributionRealDiffProfitToTValue: {name: '经销-促销补差-环期值', sale: true},
      distributionRealDiffProfitToT: {name: '经销-促销补差-环比增幅', scale: true, color: true},
      distributionRealDiffProfitPct: {name: '经销-促销补差-占比', scale: true},

      // 联营-促销补差
      jointRealDiffProfit: {name: '联营-促销补差', sale: true},
      jointRealDiffProfitYoYValue: {name: '联营-促销补差-同期值', sale: true},
      jointRealDiffProfitYoY: {name: '联营-促销补差-同比增幅', scale: true, color: true},
      jointRealDiffProfitToTValue: {name: '联营-促销补差-环期值', sale: true},
      jointRealDiffProfitToT: {name: '联营-促销补差-环比增幅', scale: true, color: true},
      jointRealDiffProfitPct: {name: '联营-促销补差-占比', scale: true},

      // 手工补差
      manualDiffProfit: {name: '手工补差', sale: true, icon: "manualDiff"},
      manualDiffProfitYoYValue: {name: '手工补差-同期值', sale: true},
      manualDiffProfitYoY: {name: '手工补差-同比增幅', scale: true, color: true},
      manualDiffProfitToTValue: {name: '手工补差-环期值', sale: true},
      manualDiffProfitToT: {name: '手工补差-环比增幅', scale: true, color: true},
      manualDiffProfitPct: {name: '手工补差-占比', scale: true},

      // 经销-手工补差
      distributionManualDiffProfit: {name: '经销-手工补差', sale: true},
      distributionManualDiffProfitYoYValue: {name: '经销-手工补差-同期值', sale: true},
      distributionManualDiffProfitYoY: {name: '经销-手工补差-同比增幅', scale: true, color: true},
      distributionManualDiffProfitToTValue: {name: '经销-手工补差-环期值', sale: true},
      distributionManualDiffProfitToT: {name: '经销-手工补差-环比增幅', scale: true, color: true},
      distributionManualDiffProfitPct: {name: '经销-手工补差-占比', scale: true},

      // 联营-手工补差
      jointManualDiffProfit: {name: '联营-手工补差', sale: true},
      jointManualDiffProfitYoYValue: {name: '联营-手工补差-同期值', sale: true},
      jointManualDiffProfitYoY: {name: '联营-手工补差-同比增幅', scale: true, color: true},
      jointManualDiffProfitToTValue: {name: '联营-手工补差-环期值', sale: true},
      jointManualDiffProfitToT: {name: '联营-手工补差-环比增幅', scale: true, color: true},
      jointManualDiffProfitPct: {name: '联营-手工补差-占比', scale: true},

      // 批发补差
      wholesaleDiffProfit: {name: '批发补差', sale: true},
      wholesaleDiffProfitYoYValue: {name: '批发补差-同期值', sale: true},
      wholesaleDiffProfitYoY: {name: '批发补差-同比增幅', scale: true, color: true},
      wholesaleDiffProfitToTValue: {name: '批发补差-环期值', sale: true},
      wholesaleDiffProfitToT: {name: '批发补差-环比增幅', scale: true, color: true},
      wholesaleDiffProfitPct: {name: '批发补差-占比', scale: true},

      // 经销-批发补差
      distributionWholesaleDiffProfit: {name: '经销-批发补差', sale: true},
      distributionWholesaleDiffProfitYoYValue: {name: '经销-批发补差-同期值', sale: true},
      distributionWholesaleDiffProfitYoY: {name: '经销-批发补差-同比增幅', scale: true, color: true},
      distributionWholesaleDiffProfitToTValue: {name: '经销-批发补差-环期值', sale: true},
      distributionWholesaleDiffProfitToT: {name: '经销-批发补差-环比增幅', scale: true, color: true},
      distributionWholesaleDiffProfitPct: {name: '经销-批发补差-占比', scale: true},

      // 联营-批发补差
      jointWholesaleDiffProfit: {name: '联营-批发补差', sale: true},
      jointWholesaleDiffProfitYoYValue: {name: '联营-批发补差-同期值', sale: true},
      jointWholesaleDiffProfitYoY: {name: '联营-批发补差-同比增幅', scale: true, color: true},
      jointWholesaleDiffProfitToTValue: {name: '联营-批发补差-环期值', sale: true},
      jointWholesaleDiffProfitToT: {name: '联营-批发补差-环比增幅', scale: true, color: true},
      jointWholesaleDiffProfitPct: {name: '联营-批发补差-占比', scale: true},

      // 成本调整
      adjustCostTotal: {name: '成本调整', sale: true, icon: "adjustCost"},
      adjustCostTotalYoYValue: {name: '成本调整-同期值', sale: true},
      adjustCostTotalYoY: {name: '成本调整-同比增幅', scale: true, color: true},
      adjustCostTotalToTValue: {name: '成本调整-环期值', sale: true},
      adjustCostTotalToT: {name: '成本调整-环比增幅', scale: true, color: true},
      adjustCostTotalPct: {name: '成本调整-占比', scale: true},

      // 报损报溢
      declareProfitLossAdjustCost: {name: '报损报溢', sale: true},
      declareProfitLossAdjustCostYoYValue: {name: '报损报溢-同期值', sale: true},
      declareProfitLossAdjustCostYoY: {name: '报损报溢-同比增幅', scale: true, color: true},
      declareProfitLossAdjustCostToTValue: {name: '报损报溢-环期值', sale: true},
      declareProfitLossAdjustCostToT: {name: '报损报溢-环比增幅', scale: true, color: true},
      declareProfitLossAdjustCostPct: {name: '报损报溢-占比', scale: true},

      // 盘点损溢
      checkProfitLossAdjustCost: {name: '盘点损溢', sale: true},
      checkProfitLossAdjustCostYoYValue: {name: '盘点损溢-同期值', sale: true},
      checkProfitLossAdjustCostYoY: {name: '盘点损溢-同比增幅', scale: true, color: true},
      checkProfitLossAdjustCostToTValue: {name: '盘点损溢-环期值', sale: true},
      checkProfitLossAdjustCostToT: {name: '盘点损溢-环比增幅', scale: true, color: true},
      checkProfitLossAdjustCostPct: {name: '盘点损溢-占比', scale: true},

      // 库存调整
      stockAdjustCost: {name: '库存调整', sale: true},
      stockAdjustCostYoYValue: {name: '库存调整-同期值', sale: true},
      stockAdjustCostYoY: {name: '库存调整-同比增幅', scale: true, color: true},
      stockAdjustCostToTValue: {name: '库存调整-环期值', sale: true},
      stockAdjustCostToT: {name: '库存调整-环比增幅', scale: true, color: true},
      stockAdjustCostPct: {name: '库存调整-占比', scale: true},

      // 采购成本调整
      buyAdjustCost: {name: '采购成本调整', sale: true},
      buyAdjustCostYoYValue: {name: '采购成本调整-同期值', sale: true},
      buyAdjustCostYoY: {name: '采购成本调整-同比增幅', scale: true, color: true},
      buyAdjustCostToTValue: {name: '采购成本调整-环期值', sale: true},
      buyAdjustCostToT: {name: '采购成本调整-环比增幅', scale: true, color: true},
      buyAdjustCostPct: {name: '采购成本调整-占比', scale: true},

      // 综合收益额
      allBizCompIncomeAmount: {name: '综合收益额', sale: true, icon: "allBizCompIncomeAmount"},
      allBizCompIncomeAmountYoYValue: {name: '综合收益额-同期值', sale: true},
      allBizCompIncomeAmountYoY: {name: '综合收益额-同比增幅', scale: true, color: true},
      allBizCompIncomeAmountToTValue: {name: '综合收益额-环期值', sale: true},
      allBizCompIncomeAmountToT: {name: '综合收益额-环比增幅', scale: true, color: true},
      allBizCompIncomeAmountPct: {name: '综合收益额-占比', scale: true},

      // 综合收益额(采购)
      buyerBizCompIncomeAmount: {name: '综合收益额(采购)', sale: true, icon: 'allBizCompIncomeAmount'},
      buyerBizCompIncomeAmountYoYValue: {name: '综合收益额(采购)-同期值', sale: true},
      buyerBizCompIncomeAmountYoY: {name: '综合收益额(采购)-同比增幅', scale: true, color: true},
      buyerBizCompIncomeAmountToTValue: {name: '综合收益额(采购)-环期值', sale: true},
      buyerBizCompIncomeAmountToT: {name: '综合收益额(采购)-环比增幅', scale: true, color: true},
      buyerBizCompIncomeAmountPct: {name: '综合收益额(采购)-占比', scale: true},

      // 综合收益额(营运)
      storeBizCompIncomeAmount: {name: '综合收益额(营运)', sale: true, icon: 'allBizCompIncomeAmount'},
      storeBizCompIncomeAmountYoYValue: {name: '综合收益额(营运)-同期值', sale: true},
      storeBizCompIncomeAmountYoY: {name: '综合收益额(营运)-同比增幅', scale: true, color: true},
      storeBizCompIncomeAmountToTValue: {name: '综合收益额(营运)-环期值', sale: true},
      storeBizCompIncomeAmountToT: {name: '综合收益额(营运)-环比增幅', scale: true, color: true},
      storeBizCompIncomeAmountPct: {name: '综合收益额(营运)-占比', scale: true},

      // 综合收益率
      allBizCompIncomeAmountRate: {name: '综合收益率', scale: true, icon: 'allBizCompIncomeAmountRate'},
      allBizCompIncomeAmountRateYoYValue: {name: '综合收益率-同期值', scale: true},
      allBizCompIncomeAmountRateYoYInc: {name: '综合收益率-同比增长', inc: 2, color: true},
      allBizCompIncomeAmountRateToTValue: {name: '综合收益率-环期值', scale: true},
      allBizCompIncomeAmountRateToTInc: {name: '综合收益率-环比增长', inc: 2, color: true},

      // 综合收益率(采购)
      buyerBizCompIncomeAmountRate: {name: '综合收益率(采购)', scale: true, icon: 'allBizCompIncomeAmountRate'},
      buyerBizCompIncomeAmountRateYoYValue: {name: '综合收益率(采购)-同期值', scale: true},
      buyerBizCompIncomeAmountRateYoYInc: {name: '综合收益率(采购)-同比增长', inc: 2, color: true},
      buyerBizCompIncomeAmountRateToTValue: {name: '综合收益率(采购)-环期值', scale: true},
      buyerBizCompIncomeAmountRateToTInc: {name: '综合收益率(采购)-环比增长', inc: 2, color: true},

      // 综合收益率(营运)
      storeBizCompIncomeAmountRate: {name: '综合收益率(营运)', scale: true, icon: 'allBizCompIncomeAmountRate'},
      storeBizCompIncomeAmountRateYoYValue: {name: '综合收益率(营运)-同期值', scale: true},
      storeBizCompIncomeAmountRateYoYInc: {name: '综合收益率(营运)-同比增长', inc: 2, color: true},
      storeBizCompIncomeAmountRateToTValue: {name: '综合收益率(营运)-环期值', scale: true},
      storeBizCompIncomeAmountRateToTInc: {name: '综合收益率(营运)-环比增长', inc: 2, color: true},

      // 通道收益额(整体实收)
      channelSettleAmountTotal: {name: '通道收益额', sale: true},
      channelSettleAmountTotalYoYValue: {name: '通道收益额-同期值', sale: true},
      channelSettleAmountTotalYoY: {name: '通道收益额-同比增幅', scale: true, color: true},
      channelSettleAmountTotalToTValue: {name: '通道收益额-环期值', sale: true},
      channelSettleAmountTotalToT: {name: '通道收益额-环比增幅', scale: true, color: true},
      channelSettleAmountTotalPct: {name: '通道收益额-占比', scale: true},

      // 通道收益率
      channelSettleAmountTotalRate: {name: '通道收益率', scale: true, icon: 'channelSettleAmountTotalRate'},
      channelSettleAmountTotalRateYoYValue: {name: '通道收益率-同期值', scale: true},
      channelSettleAmountTotalRateYoYInc: {name: '通道收益率-同比增长', inc: 2, color: true},
      channelSettleAmountTotalRateToTValue: {name: '通道收益率-环期值', scale: true},
      channelSettleAmountTotalRateToTInc: {name: '通道收益率-环比增长', inc: 2, color: true},

      // 通道收益额(已到期未收)
      channelPendingAmountTotal: {name: '通道收益额-(已到期未收)', sale: true, icon: 'channelPendingAmountTotal'},
      channelPendingAmountTotalYoYValue: {name: '通道收益额-(已到期未收)-同期值', sale: true},
      channelPendingAmountTotalYoY: {name: '通道收益额-(已到期未收)-同比增幅', scale: true, color: true},
      channelPendingAmountTotalToTValue: {name: '通道收益额-(已到期未收)-环期值', sale: true},
      channelPendingAmountTotalToT: {name: '通道收益额-(已到期未收)-环比增幅', scale: true, color: true},
      channelPendingAmountTotalPct: {name: '通道收益额-(已到期未收)-占比', scale: true},

      // 通道收益率(采购)
      buyerChannelSettleAmountRate: {name: '通道收益率(采购)', scale: true, icon: 'channelSettleAmountTotalRate'},
      buyerChannelSettleAmountRateYoYValue: {name: '通道收益率(采购)-同期值', scale: true},
      buyerChannelSettleAmountRateYoYInc: {name: '通道收益率(采购)-同比增长', inc: 2, color: true},
      buyerChannelSettleAmountRateToTValue: {name: '通道收益率(采购)-环期值', scale: true},
      buyerChannelSettleAmountRateToTInc: {name: '通道收益率(采购)-环比增长', inc: 2, color: true},

      // 通道收益额(采购)
      buyerChannelSettleAmount: {name: '通道收益额(采购)', sale: true},
      buyerChannelSettleAmountYoYValue: {name: '通道收益额(采购)-同期值', sale: true},
      buyerChannelSettleAmountYoY: {name: '通道收益额(采购)-同比增幅', scale: true, color: true},
      buyerChannelSettleAmountToTValue: {name: '通道收益额(采购)-环期值', sale: true},
      buyerChannelSettleAmountToT: {name: '通道收益额(采购)-环比增幅', scale: true, color: true},
      buyerChannelSettleAmountPct: {name: '通道收益额(采购)-占比', scale: true},

      // 通道收益额(采购已到期未收)
      buyerChannelPendingAmount: {name: '通道收益额-(采购已到期未收)', sale: true},
      buyerChannelPendingAmountYoYValue: {name: '通道收益额-(采购已到期未收)-同期值', sale: true},
      buyerChannelPendingAmountYoY: {name: '通道收益额-(采购已到期未收)-同比增幅', scale: true, color: true},
      buyerChannelPendingAmountToTValue: {name: '通道收益额-(采购已到期未收)-环期值', sale: true},
      buyerChannelPendingAmountToT: {name: '通道收益额-(采购已到期未收)-环比增幅', scale: true, color: true},
      buyerChannelPendingAmountPct: {name: '通道收益额-(采购已到期未收)-占比', scale: true},

      // 通道收益率(营运)
      storeChannelSettleAmountRate: {name: '通道收益率(营运)', scale: true, icon: 'channelSettleAmountTotalRate'},
      storeChannelSettleAmountRateYoYValue: {name: '通道收益率(营运)-同期值', scale: true},
      storeChannelSettleAmountRateYoYInc: {name: '通道收益率(营运)-同比增长', inc: 2, color: true},
      storeChannelSettleAmountRateToTValue: {name: '通道收益率(营运)-环期值', scale: true},
      storeChannelSettleAmountRateToTInc: {name: '通道收益率(营运)-环比增长', inc: 2, color: true},

      // 通道收益额(营运)
      storeChannelSettleAmount: {name: '通道收益额(营运)', sale: true},
      storeChannelSettleAmountYoYValue: {name: '通道收益额(营运)-同期值', sale: true},
      storeChannelSettleAmountYoY: {name: '通道收益额(营运)-同比增幅', scale: true, color: true},
      storeChannelSettleAmountToTValue: {name: '通道收益额(营运)-环期值', sale: true},
      storeChannelSettleAmountToT: {name: '通道收益额(营运)-环比增幅', scale: true, color: true},
      storeChannelSettleAmountPct: {name: '通道收益额(营运)-占比', scale: true},

      // 财务收益-通道收益率(营运)
      storeChannelSettleAmountTotalRate: { name: "通道收益率(营运)", scale: true, icon: "finChannelSettleAmountTotalRate"},
      storeChannelSettleAmountTotalRateYoYValue: {name: '通道收益率(营运)-同期值', scale: true},
      storeChannelSettleAmountTotalRateYoYInc: {name: '通道收益率(营运)-同比增长', inc: 2, color: true},
      storeChannelSettleAmountTotalRateToTValue: {name: '通道收益率(营运)-环期值', scale: true},
      storeChannelSettleAmountTotalRateToTInc: {name: '通道收益率(营运)-环比增长', inc: 2, color: true},

      // 通道收益额(营运已到期未收)
      storeChannelPendingAmount: {name: '通道收益额-(营运已到期未收)', sale: true},
      storeChannelPendingAmountYoYValue: {name: '通道收益额-(营运已到期未收)-同期值', sale: true},
      storeChannelPendingAmountYoY: {name: '通道收益额-(营运已到期未收)-同比增幅', scale: true, color: true},
      storeChannelPendingAmountToTValue: {name: '通道收益额-(营运已到期未收)-环期值', sale: true},
      storeChannelPendingAmountToT: {name: '通道收益额-(营运已到期未收)-环比增幅', scale: true, color: true},
      storeChannelPendingAmountPct: {name: '通道收益额-(营运已到期未收)-占比', scale: true},

      // 通道收益额(采购固定费用)
      buyerFixSettleAmount: {name: '通道收益额-(采购固定费用)', sale: true},
      buyerFixSettleAmountYoYValue: {name: '通道收益额-(采购固定费用)-同期值', sale: true},
      buyerFixSettleAmountYoY: {name: '通道收益额-(采购固定费用)-同比增幅', scale: true, color: true},
      buyerFixSettleAmountToTValue: {name: '通道收益额-(采购固定费用)-环期值', sale: true},
      buyerFixSettleAmountToT: {name: '通道收益额-(采购固定费用)-环比增幅', scale: true, color: true},
      buyerFixSettleAmountPct: {name: '通道收益额-(采购固定费用)-占比', scale: true},

      // 通道收益额(采购固定费用-已到期未收)
      buyerFixPendingAmount: {name: '通道收益额-(采购固定费用_已到期未收)', sale: true},
      buyerFixPendingAmountYoYValue: {name: '通道收益额-(采购固定费用_已到期未收)-同期值', sale: true},
      buyerFixPendingAmountYoY: {name: '通道收益额-(采购固定费用_已到期未收)-同比增幅', scale: true, color: true},
      buyerFixPendingAmountToTValue: {name: '通道收益额-(采购固定费用_已到期未收)-环期值', sale: true},
      buyerFixPendingAmountToT: {name: '通道收益额-(采购固定费用_已到期未收)-环比增幅', scale: true, color: true},
      buyerFixPendingAmountPct: {name: '通道收益额-(采购固定费用_已到期未收)-占比', scale: true},

      // 通道收益额(采购变动费用)
      buyerChangeSettleAmount: {name: '通道收益额-(采购变动费用)', sale: true},
      buyerChangeSettleAmountYoYValue: {name: '通道收益额-(采购变动费用)-同期值', sale: true},
      buyerChangeSettleAmountYoY: {name: '通道收益额-(采购变动费用)-同比增幅', scale: true, color: true},
      buyerChangeSettleAmountToTValue: {name: '通道收益额-(采购变动费用)-环期值', sale: true},
      buyerChangeSettleAmountToT: {name: '通道收益额-(采购变动费用)-环比增幅', scale: true, color: true},
      buyerChangeSettleAmountPct: {name: '通道收益额-(采购变动费用)-占比', scale: true},

      // 通道收益额(采购变动费用-已到期未收)
      buyerChangePendingAmount: {name: '通道收益额-(采购变动费用_已到期未收)', sale: true},
      buyerChangePendingAmountYoYValue: {name: '通道收益额-(采购变动费用_已到期未收)-同期值', sale: true},
      buyerChangePendingAmountYoY: {name: '通道收益额-(采购变动费用_已到期未收)-同比增幅', scale: true, color: true},
      buyerChangePendingAmountToTValue: {name: '通道收益额-(采购变动费用_已到期未收)-环期值', sale: true},
      buyerChangePendingAmountToT: {name: '通道收益额-(采购变动费用_已到期未收)-环比增幅', scale: true, color: true},
      buyerChangePendingAmountPct: {name: '通道收益额-(采购变动费用_已到期未收)-占比', scale: true},

      // 毛利额占比综合收益额
      allProfitOfAllBizCompIncomeAmount: {name: '毛利额占比综合收益额', scale: true, slice: 5},

      // 毛利额占比综合收益额(采购)
      allProfitOfBuyerBizCompIncomeAmount: {name: '毛利额占比综合收益额(采购)', scale: true, slice: 5},

      // 毛利额占比综合收益额(营运)
      allProfitOfStoreBizCompIncomeAmount: {name: '毛利额占比综合收益额(营运)', scale: true, slice: 5},

      // 通道收益额占比综合收益额
      channelSettleAmountTotalOfAllBizCompIncomeAmount: {name: '通道收益额占比综合收益额', scale: true, slice: 5},

      // 通道收益额(采购)占比综合收益额(采购)
      buyerChannelSettleAmountOfBuyerBizCompIncomeAmount: {name: '通道收益额(采购)占比综合收益额(采购)', scale: true, slice: 11},

      // 通道收益额(营运)占比综合收益额(营运)
      storeChannelSettleAmountOfStoreBizCompIncomeAmount: {name: '通道收益额(营运)占比综合收益额(营运)', scale: true, slice: 11},

      //财务毛利额
      allFinProfit: {name: '财务毛利额', sale: true, icon: ['finProfit', 'page_sale_financeProfit']},
      allFinProfitYoYValue: {name: '财务毛利额-同期值', sale: true},
      allFinProfitYoY: {name: '财务毛利额-同比增幅', scale: true, color: true},
      allFinProfitToTValue: {name: '财务毛利额-环期值', sale: true},
      allFinProfitToT: {name: '财务毛利额-环比增幅', scale: true, color: true},
      allFinProfitPct: {name: '财务毛利额-占比', scale: true},

      //经销-财务毛利额
      distributionFinProfit: {name: '经销-财务毛利额', sale: true, icon: ['distributionFinProfit', 'page_sale_financeProfit']},
      distributionFinProfitYoYValue: {name: '经销-财务毛利额-同期值', sale: true},
      distributionFinProfitYoY: {name: '经销-财务毛利额-同比增幅', scale: true, color: true},
      distributionFinProfitToTValue: {name: '经销-财务毛利额-环期值', sale: true},
      distributionFinProfitToT: {name: '经销-财务毛利额-环比增幅', scale: true, color: true},
      distributionFinProfitPct: {name: '经销-财务毛利额-占比', scale: true},

      //联营-财务毛利额
      jointFinProfit: {name: '联营-财务毛利额', sale: true, icon: ['jointFinProfit', 'page_sale_financeProfit']},
      jointFinProfitYoYValue: {name: '联营-财务毛利额-同期值', sale: true},
      jointFinProfitYoY: {name: '联营-财务毛利额-同比增幅', scale: true, color: true},
      jointFinProfitToTValue: {name: '联营-财务毛利额-环期值', sale: true},
      jointFinProfitToT: {name: '联营-财务毛利额-环比增幅', scale: true, color: true},
      jointFinProfitPct: {name: '联营-财务毛利额-占比', scale: true},

      //财务毛利率
      allFinProfitRate: {name: '财务毛利率', scale: true, icon: "finProfitRate"},
      allFinProfitRateYoYValue: {name: '财务毛利率-同期值', scale: true},
      allFinProfitRateYoYInc: {name: '财务毛利率-同比增长', inc: true, color: true},
      allFinProfitRateToTValue: {name: '财务毛利率-环期值', scale: true},
      allFinProfitRateToTInc: {name: '财务毛利率-环比增长', color: true, inc: true},
      allFinProfitRatePct: {name: '财务毛利率-占比', scale: true},

      //经销-财务毛利率
      distributionFinProfitRate: {name: '经销-财务毛利率', scale: true, icon: "distributionFinProfitRate"},
      distributionFinProfitRateYoYValue: {name: '经销-财务毛利率-同期值', scale: true},
      distributionFinProfitRateYoYInc: {name: '经销-财务毛利率-同比增长', inc: true, color: true},
      distributionFinProfitRateToTValue: {name: '经销-财务毛利率-环期值', scale: true},
      distributionFinProfitRateToTInc: {name: '经销-财务毛利率-环比增长', inc: true, color: true},
      distributionFinProfitRatePct: {name: '经销-财务毛利率-占比', scale: true},

      //联营-财务毛利率
      jointFinProfitRate: {name: '联营-财务毛利率', scale: true, icon: "jointFinProfitRate"},
      jointFinProfitRateYoYValue: {name: '联营-财务毛利率-同期值', scale: true},
      jointFinProfitRateYoYInc: {name: '联营-财务毛利率-同比增长', inc: true, color: true},
      jointFinProfitRateToTValue: {name: '联营-财务毛利率-环期值', scale: true},
      jointFinProfitRateToTInc: {name: '联营-财务毛利率-环比增长', inc: true, color: true},
      jointFinProfitRatePct: {name: '联营-财务毛利率-占比', scale: true},

      // 财务销售毛利
      allSaleFinProfit: {name: '销售毛利', sale: true, icon: "allSaleProfit"},
      allSaleFinProfitYoYValue: {name: '销售毛利-同期值', sale: true},
      allSaleFinProfitYoY: {name: '销售毛利-同比增幅', scale: true, color: true},
      allSaleFinProfitToTValue: {name: '销售毛利-环期值', sale: true},
      allSaleFinProfitToT: {name: '销售毛利-环比增幅', scale: true, color: true},
      allSaleFinProfitPct: {name: '销售毛利-占比', scale: true},

      // 财务经销-销售毛利
      distributionSaleFinProfit: {name: '经销-销售毛利', sale: true},
      distributionSaleFinProfitYoYValue: {name: '经销-销售毛利-同期值', sale: true},
      distributionSaleFinProfitYoY: {name: '经销-销售毛利-同比增幅', scale: true, color: true},
      distributionSaleFinProfitToTValue: {name: '经销-销售毛利-环期值', sale: true},
      distributionSaleFinProfitToT: {name: '经销-销售毛利-环比增幅', scale: true, color: true},
      distributionSaleFinProfitPct: {name: '经销-销售毛利-占比', scale: true},

      //财务 联营-销售毛利
      jointSaleFinProfit: {name: '联营-销售毛利', sale: true},
      jointSaleFinProfitYoYValue: {name: '联营-销售毛利-同期值', sale: true},
      jointSaleFinProfitYoY: {name: '联营-销售毛利-同比增幅', scale: true, color: true},
      jointSaleFinProfitToTValue: {name: '联营-销售毛利-环期值', sale: true},
      jointSaleFinProfitToT: {name: '联营-销售毛利-环比增幅', scale: true, color: true},
      jointSaleFinProfitPct: {name: '联营-销售毛利-占比', scale: true},

      //财务 生鲜加价
      allRealFreshFinProfit: {name: '生鲜加价', sale: true},
      allRealFreshFinProfitYoYValue: {name: '生鲜加价-同期值', sale: true},
      allRealFreshFinProfitYoY: {name: '生鲜加价-同比增幅', scale: true, color: true},
      allRealFreshFinProfitToTValue: {name: '生鲜加价-环期值', sale: true},
      allRealFreshFinProfitToT: {name: '生鲜加价-环比增幅', scale: true, color: true},
      allRealFreshFinProfitPct: {name: '生鲜加价-占比', scale: true},

      //财务 经销-生鲜加价
      distributionRealFreshFinProfit: {name: '经销-生鲜加价', sale: true},
      distributionRealFreshFinProfitYoYValue: {name: '经销-生鲜加价-同期值', sale: true},
      distributionRealFreshFinProfitYoY: {name: '经销-生鲜加价-同比增幅', scale: true, color: true},
      distributionRealFreshFinProfitToTValue: {name: '经销-生鲜加价-环期值', sale: true},
      distributionRealFreshFinProfitToT: {name: '经销-生鲜加价-环比增幅', scale: true, color: true},
      distributionRealFreshFinProfitPct: {name: '经销-生鲜加价-占比', scale: true},

      //财务 联营-生鲜加价
      jointRealFreshFinProfit: {name: '联营-生鲜加价', sale: true},
      jointRealFreshFinProfitYoYValue: {name: '联营-生鲜加价-同期值', sale: true},
      jointRealFreshFinProfitYoY: {name: '联营-生鲜加价-同比增幅', scale: true, color: true},
      jointRealFreshFinProfitToTValue: {name: '联营-生鲜加价-环期值', sale: true},
      jointRealFreshFinProfitToT: {name: '联营-生鲜加价-环比增幅', scale: true, color: true},
      jointRealFreshFinProfitPct: {name: '联营-生鲜加价-占比', scale: true},

      //财务 销售补差
      allEstDiffFinProfitTotal: {name: '销售补差', sale: true, icon: "allRealDiffProfit"},
      allEstDiffFinProfitTotalYoYValue: {name: '销售补差-同期值', sale: true},
      allEstDiffFinProfitTotalYoY: {name: '销售补差-同比增幅', scale: true, color: true},
      allEstDiffFinProfitTotalToTValue: {name: '销售补差-环期值', sale: true},
      allEstDiffFinProfitTotalToT: {name: '销售补差-环比增幅', scale: true, color: true},
      allEstDiffFinProfitTotalPct: {name: '销售补差-占比', scale: true},

      //财务 经销-销售补差
      distributionEstDiffFinProfitTotal: {name: '经销-销售补差', sale: true, icon: "distributionRealDiffProfit"},
      distributionEstDiffFinProfitTotalYoYValue: {name: '经销-销售补差-同期值', sale: true},
      distributionEstDiffFinProfitTotalYoY: {name: '经销-销售补差-同比增幅', scale: true, color: true},
      distributionEstDiffFinProfitTotalToTValue: {name: '经销-销售补差-环期值', sale: true},
      distributionEstDiffFinProfitTotalToT: {name: '经销-销售补差-环比增幅', scale: true, color: true},
      distributionEstDiffFinProfitTotalPct: {name: '经销-销售补差-占比', scale: true},

      //财务 联营-销售补差
      jointEstDiffFinProfitTotal: {name: '联营-销售补差', sale: true, icon: "jointRealDiffProfit"},
      jointEstDiffFinProfitTotalYoYValue: {name: '联营-销售补差-同期值', sale: true},
      jointEstDiffFinProfitTotalYoY: {name: '联营-销售补差-同比增幅', scale: true, color: true},
      jointEstDiffFinProfitTotalToTValue: {name: '联营-销售补差-环期值', sale: true},
      jointEstDiffFinProfitTotalToT: {name: '联营-销售补差-环比增幅', scale: true, color: true},
      jointEstDiffFinProfitTotalPct: {name: '联营-销售补差-占比', scale: true},

      //财务 成本调整
      adjustCostFinTotal: {name: '成本调整', sale: true, icon: "adjustCost"},
      adjustCostFinTotalYoYValue: {name: '成本调整-同期值', sale: true},
      adjustCostFinTotalYoY: {name: '成本调整-同比增幅', scale: true, color: true},
      adjustCostFinTotalToTValue: {name: '成本调整-环期值', sale: true},
      adjustCostFinTotalToT: {name: '成本调整-环比增幅', scale: true, color: true},
      adjustCostFinTotalPct: {name: '成本调整-占比', scale: true},

      //财务 报损报溢
      declareFinProfitLossAdjustCost: {name: '报损报溢', sale: true},
      declareFinProfitLossAdjustCostYoYValue: {name: '报损报溢-同期值', sale: true},
      declareFinProfitLossAdjustCostYoY: {name: '报损报溢-同比增幅', scale: true, color: true},
      declareFinProfitLossAdjustCostToTValue: {name: '报损报溢-环期值', sale: true},
      declareFinProfitLossAdjustCostToT: {name: '报损报溢-环比增幅', scale: true, color: true},
      declareFinProfitLossAdjustCostPct: {name: '报损报溢-占比', scale: true},

      //财务 盘点损溢
      checkFinProfitLossAdjustCost: {name: '盘点损溢', sale: true},
      checkFinProfitLossAdjustCostYoYValue: {name: '盘点损溢-同期值', sale: true},
      checkFinProfitLossAdjustCostYoY: {name: '盘点损溢-同比增幅', scale: true, color: true},
      checkFinProfitLossAdjustCostToTValue: {name: '盘点损溢-环期值', sale: true},
      checkFinProfitLossAdjustCostToT: {name: '盘点损溢-环比增幅', scale: true, color: true},
      checkFinProfitLossAdjustCostPct: {name: '盘点损溢-占比', scale: true},

      //财务 库存调整
      stockFinAdjustCost: {name: '库存调整', sale: true},
      stockFinAdjustCostYoYValue: {name: '库存调整-同期值', sale: true},
      stockFinAdjustCostYoY: {name: '库存调整-同比增幅', scale: true, color: true},
      stockFinAdjustCostToTValue: {name: '库存调整-环期值', sale: true},
      stockFinAdjustCostToT: {name: '库存调整-环比增幅', scale: true, color: true},
      stockFinAdjustCostPct: {name: '库存调整-占比', scale: true},

      //财务 采购成本调整
      buyFinAdjustCost: {name: '采购成本调整', sale: true},
      buyFinAdjustCostYoYValue: {name: '采购成本调整-同期值', sale: true},
      buyFinAdjustCostYoY: {name: '采购成本调整-同比增幅', scale: true, color: true},
      buyFinAdjustCostToTValue: {name: '采购成本调整-环期值', sale: true},
      buyFinAdjustCostToT: {name: '采购成本调整-环比增幅', scale: true, color: true},
      buyFinAdjustCostPct: {name: '采购成本调整-占比', scale: true},


      // 财务综合收益
      allFinCompIncomeAmount: {name: '财务综合收益额', sale: true, icon: "finCompIncomeAmount"},
      allFinCompIncomeAmountYoYValue: {name: '财务综合收益额-同期值', sale: true},
      allFinCompIncomeAmountYoY: {name: '财务综合收益额-同比增幅', scale: true, color: true},
      allFinCompIncomeAmountToTValue: {name: '财务综合收益额-环期值', sale: true},
      allFinCompIncomeAmountToT: {name: '财务综合收益额-环比增幅', scale: true, color: true},
      allFinCompIncomeAmountPct: {name: '财务综合收益额-占比', scale: true},

      allFinCompIncomeAmountRate: {name: '财务综合收益率', scale: true, icon: "finCompIncomeAmountRate"},
      allFinCompIncomeAmountRateYoYValue: {name: '财务综合收益率-同期值', scale: true},
      allFinCompIncomeAmountRateYoYInc: {name: '财务综合收益率-同比增长', inc: true, color: true},
      allFinCompIncomeAmountRateToTValue: {name: '财务综合收益率-环期值', scale: true},
      allFinCompIncomeAmountRateToTInc: {name: '财务综合收益率-环比增长', inc: true, color: true},
      allFinCompIncomeAmountRatePct: {name: '财务综合收益率-占比', scale: true},


      allFinProfitOfAllFinCompIncomeAmount: {name: '财务毛利额占比财务综合收益额', scale: true, slice: 7},
      channelSettleAmountTotalOfAllFinCompIncomeAmount: {name: '通道收益额占比财务综合收益额', scale: true, slice: 11},

      // 财务综合收益(采购)
      buyerFinCompIncomeAmount: {name: '财务综合收益额(采购)', sale: true, icon: "finCompIncomeAmount"},
      buyerFinCompIncomeAmountYoYValue: {name: '财务综合收益额(采购)-同期值', sale: true},
      buyerFinCompIncomeAmountYoY: {name: '财务综合收益额(采购)-同比增幅', scale: true, color: true},
      buyerFinCompIncomeAmountToTValue: {name: '财务综合收益额(采购)-环期值', sale: true},
      buyerFinCompIncomeAmountToT: {name: '财务综合收益额(采购)-环比增幅', scale: true, color: true},
      buyerFinCompIncomeAmountPct: {name: '财务综合收益额(采购)-占比', scale: true},

      buyerFinCompIncomeAmountRate: {name: '财务综合收益率(采购)', scale: true, icon: "finCompIncomeAmountRate"},
      buyerFinCompIncomeAmountRateYoYValue: {name: '财务综合收益率(采购)-同期值', scale: true},
      buyerFinCompIncomeAmountRateYoYInc: {name: '财务综合收益率(采购)-同比增长', inc: true, color: true},
      buyerFinCompIncomeAmountRateToTValue: {name: '财务综合收益率(采购)-环期值', scale: true},
      buyerFinCompIncomeAmountRateToTInc: {name: '财务综合收益率(采购)-环比增长', inc: true, color: true},
      buyerFinCompIncomeAmountRatePct: {name: '财务综合收益率(采购)-占比', scale: true},

      // 通道收益率(采购)
      buyerChannelSettleAmountTotalRate: {name: '通道收益率(采购)', scale: true},
      buyerChannelSettleAmountTotalRateYoYValue: {name: '通道收益率(采购)-同期值', scale: true},
      buyerChannelSettleAmountTotalRateYoYInc: {name: '通道收益率(采购)-同比增长', inc: 2, color: true},
      buyerChannelSettleAmountTotalRateToTValue: {name: '通道收益率(采购)-环期值', scale: true},
      buyerChannelSettleAmountTotalRateToTInc: {name: '通道收益率(采购)-环比增长', inc: 2, color: true},

      allFinProfitOfBuyerFinCompIncomeAmount: {name: '财务毛利额占比财务综合收益额(采购)', scale: true, slice: 7},
      buyerChannelSettleAmountOfBuyerFinCompIncomeAmount: {name: '通道收益额(采购)占比财务综合收益额(采购)', scale: true, slice: 11},

      // 财务综合收益(营运)
      storeFinCompIncomeAmount: {name: '财务综合收益额(营运)', sale: true, icon: "finCompIncomeAmount"},
      storeFinCompIncomeAmountYoYValue: {name: '财务综合收益额(营运)-同期值', sale: true},
      storeFinCompIncomeAmountYoY: {name: '财务综合收益额(营运)-同比增幅', scale: true, color: true},
      storeFinCompIncomeAmountToTValue: {name: '财务综合收益额(营运)-环期值', sale: true},
      storeFinCompIncomeAmountToT: {name: '财务综合收益额(营运)-环比增幅', scale: true, color: true},
      storeFinCompIncomeAmountPct: {name: '财务综合收益额(营运)-占比', scale: true},

      storeFinCompIncomeAmountRate: {name: '财务综合收益率(营运)', scale: true, icon: "finCompIncomeAmountRate"},
      storeFinCompIncomeAmountRateYoYValue: {name: '财务综合收益率(营运)-同期值', scale: true},
      storeFinCompIncomeAmountRateYoYInc: {name: '财务综合收益率(营运)-同比增长', inc: true, color: true},
      storeFinCompIncomeAmountRateToTValue: {name: '财务综合收益率(营运)-环期值', scale: true},
      storeFinCompIncomeAmountRateToTInc: {name: '财务综合收益率(营运)-环比增长', inc: true, color: true},
      storeFinCompIncomeAmountRatePct: {name: '财务综合收益率(营运)-占比', scale: true},

      allFinProfitOfStoreFinCompIncomeAmount: {name: '财务毛利额占比财务综合收益额(营运)', scale: true, slice: 7},
      storeChannelSettleAmountOfStoreFinCompIncomeAmount: {name: '通道收益额(营运)占比财务综合收益额(营运)', scale: true, slice: 11},

      //财务 通道收益额(实收)
      finChannelSettleAmountTotal: {name: '通道收益额', sale: true},
      finChannelSettleAmountTotalYoYValue: {name: '通道收益额-同期值', sale: true},
      finChannelSettleAmountTotalYoY: {name: '通道收益额-同比增幅', scale: true, color: true},
      finChannelSettleAmountTotalToTValue: {name: '通道收益额-环期值', sale: true},
      finChannelSettleAmountTotalToT: {name: '通道收益额-环比增幅', scale: true, color: true},
      finChannelSettleAmountTotalPct: {name: '通道收益额-占比', scale: true},

      // 通道收益率
      finChannelSettleAmountTotalRate: {name: '通道收益率', scale: true},
      finChannelSettleAmountTotalRateYoYValue: {name: '通道收益率-同期值', scale: true},
      finChannelSettleAmountTotalRateYoYInc: {name: '通道收益率-同比增长', inc: 2, color: true},
      finChannelSettleAmountTotalRateToTValue: {name: '通道收益率-环期值', scale: true},
      finChannelSettleAmountTotalRateToTInc: {name: '通道收益率-环比增长', inc: 2, color: true},

      // 通道收益率(采购)
      finBuyerChannelSettleAmountTotalRate: {name: '通道收益率(采购)', scale: true},
      finBuyerChannelSettleAmountTotalRateYoYValue: {name: '通道收益率(采购)-同期值', scale: true},
      finBuyerChannelSettleAmountTotalRateYoYInc: {name: '通道收益率(采购)-同比增长', inc: 2, color: true},
      finBuyerChannelSettleAmountTotalRateToTValue: {name: '通道收益率(采购)-环期值', scale: true},
      finBuyerChannelSettleAmountTotalRateToTInc: {name: '通道收益率(采购)-环比增长', inc: 2, color: true},

      // 通道收益额(采购)
      finBuyerChannelSettleAmount: {name: '通道收益额(采购)', sale: true},
      finBuyerChannelSettleAmountYoYValue: {name: '通道收益额(采购)-同期值', sale: true},
      finBuyerChannelSettleAmountYoY: {name: '通道收益额(采购)-同比增幅', scale: true, color: true},
      finBuyerChannelSettleAmountToTValue: {name: '通道收益额(采购)-环期值', sale: true},
      finBuyerChannelSettleAmountToT: {name: '通道收益额(采购)-环比增幅', scale: true, color: true},
      finBuyerChannelSettleAmountPct: {name: '通道收益额(采购)-占比', scale: true},

      // 通道收益率(营运)
      finStoreChannelSettleAmountTotalRate: {name: '通道收益率(营运)', scale: true},
      finStoreChannelSettleAmountTotalRateYoYValue: {name: '通道收益率(营运)-同期值', scale: true},
      finStoreChannelSettleAmountTotalRateYoYInc: {name: '通道收益率(营运)-同比增长', inc: 2, color: true},
      finStoreChannelSettleAmountTotalRateToTValue: {name: '通道收益率(营运)-环期值', scale: true},
      finStoreChannelSettleAmountTotalRateToTInc: {name: '通道收益率(营运)-环比增长', inc: 2, color: true},

      // 通道收益额(营运)
      finStoreChannelSettleAmount: {name: '通道收益额(营运)', sale: true},
      finStoreChannelSettleAmountYoYValue: {name: '通道收益额(营运)-同期值', sale: true},
      finStoreChannelSettleAmountYoY: {name: '通道收益额(营运)-同比增幅', scale: true, color: true},
      finStoreChannelSettleAmountToTValue: {name: '通道收益额(营运)-环期值', sale: true},
      finStoreChannelSettleAmountToT: {name: '通道收益额(营运)-环比增幅', scale: true, color: true},
      finStoreChannelSettleAmountPct: {name: '通道收益额(营运)-占比', scale: true},

      // 通道收益额(采购固定费用)
      finBuyerFixSettleAmount: {name: '通道收益额-(采购固定费用)', sale: true},
      finBuyerFixSettleAmountYoYValue: {name: '通道收益额-(采购固定费用)-同期值', sale: true},
      finBuyerFixSettleAmountYoY: {name: '通道收益额-(采购固定费用)-同比增幅', scale: true, color: true},
      finBuyerFixSettleAmountToTValue: {name: '通道收益额-(采购固定费用)-环期值', sale: true},
      finBuyerFixSettleAmountToT: {name: '通道收益额-(采购固定费用)-环比增幅', scale: true, color: true},
      finBuyerFixSettleAmountPct: {name: '通道收益额-(采购固定费用)-占比', scale: true},

      // 通道收益额(采购变动费用)
      finBuyerChangeSettleAmount: {name: '通道收益额-(采购变动费用)', sale: true},
      finBuyerChangeSettleAmountYoYValue: {name: '通道收益额-(采购变动费用)-同期值', sale: true},
      finBuyerChangeSettleAmountYoY: {name: '通道收益额-(采购变动费用)-同比增幅', scale: true, color: true},
      finBuyerChangeSettleAmountToTValue: {name: '通道收益额-(采购变动费用)-环期值', sale: true},
      finBuyerChangeSettleAmountToT: {name: '通道收益额-(采购变动费用)-环比增幅', scale: true, color: true},
      finBuyerChangeSettleAmountPct: {name: '通道收益额-(采购变动费用)-占比', scale: true},

      // 价格带 - SKU占比
      oneDistributionSkuPct: {name: '低端SKU占比', scale: true},
      twoDistributionSkuPct: {name: '中低端SKU占比', scale: true},
      threeDistributionSkuPct: {name: '中端SKU占比', scale: true},
      fourDistributionSkuPct: {name: '中高端SKU占比', scale: true},
      fiveDistributionSkuPct: {name: '高端SKU占比', scale: true},

      oneDistributionRetailSkuPct: {name: '低端SKU占比', scale: true},
      twoDistributionRetailSkuPct: {name: '中低端SKU占比', scale: true},
      threeDistributionRetailSkuPct: {name: '中端SKU占比', scale: true},
      fourDistributionRetailSkuPct: {name: '中高端SKU占比', scale: true},
      fiveDistributionRetailSkuPct: {name: '高端SKU占比', scale: true},

      oneDistributionWholeSkuPct: {name: '低端SKU占比', scale: true},
      twoDistributionWholeSkuPct: {name: '中低端SKU占比', scale: true},
      threeDistributionWholeSkuPct: {name: '中端SKU占比', scale: true},
      fourDistributionWholeSkuPct: {name: '中高端SKU占比', scale: true},
      fiveDistributionWholeSkuPct: {name: '高端SKU占比', scale: true},

      // 价格带 - 销售额占比
      oneDistributionAmountPct: {name: '低端销售额占比', scale: true},
      twoDistributionAmountPct: {name: '中低端销售额占比', scale: true},
      threeDistributionAmountPct: {name: '中端销售额占比', scale: true},
      fourDistributionAmountPct: {name: '中高端销售额占比', scale: true},
      fiveDistributionAmountPct:  {name: '高端销售额占比', scale: true},

      oneDistributionRetailAmountPct: {name: '低端销售额占比', scale: true},
      twoDistributionRetailAmountPct: {name: '中低端销售额占比', scale: true},
      threeDistributionRetailAmountPct: {name: '中端销售额占比', scale: true},
      fourDistributionRetailAmountPct: {name: '中高端销售额占比', scale: true},
      fiveDistributionRetailAmountPct:  {name: '高端销售额占比', scale: true},

      oneDistributionWholeAmountPct: {name: '低端销售额占比', scale: true},
      twoDistributionWholeAmountPct: {name: '中低端销售额占比', scale: true},
      threeDistributionWholeAmountPct: {name: '中端销售额占比', scale: true},
      fourDistributionWholeAmountPct: {name: '中高端销售额占比', scale: true},
      fiveDistributionWholeAmountPct:  {name: '高端销售额占比', scale: true},

      // 新品状态
      saleProductStoreCnt: {name: '销售涉及门店数', point: 0},
      supplementProductStoreCnt: {name: '补货涉及门店数', point: 0},
      distributionProductStoreCnt: {name: '到货涉及门店数', point: 0},

      //未到商品金额(供货分析)
      nonAmount: {name: '未到商品金额', sale: true},
      nonAmountYoYValue:{name: '未到商品金额-同期值', sale: true},
      nonAmountYoY:{name: '未到商品金额-同比增幅', scale: true, color: true},

      // 应到商品数量
      orderQty:{name: '应到商品数量'},
      receiveChkQty:{name: '实到商品数量'},
      receiveRealNet2:{name: '实到商品金额', sale: true},

      // 到货率-退货率zeroClick (到货率为 0 的时候可以点击)
      receiveQtyRateYoYInc:{name: '到货率-同比增长', inc:2, color: true},
      returnAmountRateYoYInc:{name: '退货率-同比增长', inc:2, color: true},
      receiveQtyRateYoYValue:{name: '到货率-同期值', scale: true, click:true, zeroClick: true, tagName: 'receiveQtyRateYoYValue', differ: true},
      returnAmountRateYoYValue:{name: '退货率-同期值', scale: true, click:true, tagName: 'returnAmountRateYoYValue', differ: true},
      receiveQtyRate:{name: '到货率', scale: true, icon: "receiveQtyRate", click:true, zeroClick: true, tagName:"receiveQtyRate"},
      returnAmountRate:{name: '退货率', scale: true, icon: "returnAmountRate", click:true, tagName: "returnAmountRate"},

      // 平均早到天数
      avgDaysYoY:{name: '平均早到天数-同比增幅', scale:true, color: true},
      avgDaysYoYValue:{name: '平均早到天数-同期值'},

      // 新品SKU对比分析： 新品引入sku
      newImportSkuCnt: {name: '新品引入SKU数', point: 0},
      newImportSkuCntYoYValue: {name: '新品引入SKU数-同期值', point: 0},
      newImportSkuCntYoY: {name: '新品引入SKU数-同比增幅', scale: true, color: true},

      // 新品SKU对比分析： 新品有售sku数
      newSaleSkuCntYoYValue: {name: '新品有售SKU数-同期值', point: 0},
      newSaleSkuCntYoY: {name: '新品有售SKU数-同比增幅', scale: true, color: true},

      // 新品SKU对比分析： 新品可售sku数
      newCanSaleSkuCnt: {name: '新品可售SKU数', point: 0},
      newCanSaleSkuCntYoYValue: {name: '新品可售SKU数-同期值', point: 0},
      newCanSaleSkuCntYoY: {name: '新品可售SKU数-同比增幅', scale: true, color: true},

      // 新品SKU对比分析： 新品销售额
      newAllAmount: {name: '新品销售额', sale: true},
      newAllAmountYoYValue: {name: '新品销售额-同期值', sale: true},
      newAllAmountYoY: {name: '新品销售额-同比增幅', scale: true, color: true},
      newAllAmountPct: {name: '新品销售额-占比', scale: true, page: {skuContrast: '新品销售额-占比商品'}},

      // 新品SKU对比分析： 新品单品销售额
      newSingleProductAllAmount: {name: '新品单品销售额', icon: "newSingleProductAllAmount", unit: '元', singleSale: true},
      newSingleProductAllAmountYoYValue: {name: '新品单品销售额-同期值', unit: '元', singleSale: true},
      newSingleProductAllAmountYoY: {name: '新品单品销售额-同比增幅', scale: true, color: true},
      newSingleProductAllAmountPct: {name: '新品单品销售额-占比', scale: true},

      // 新品SKU对比分析： 新品单店单品销售额
      newSingleStoreProductAllAmount: {name: '新品单店单品销售额', unit: '元', singleSale: true, icon: "newSingleStoreProductAllAmount"},
      newSingleStoreProductAllAmountYoYValue: {name: '新品单店单品销售额-同期值', unit: '元', singleSale: true},
      newSingleStoreProductAllAmountYoY: {name: '新品单店单品销售额-同比增幅', scale: true, color: true},
      newSingleStoreProductAllAmountPct: {name: '新品单店单品销售额-占比', scale: true},

      // 新品SKU对比分析： 新品毛利额
      newAllProfit: {name: '新品毛利额', sale: true},
      newAllProfitYoYValue: {name: '新品毛利额-同期值', sale: true},
      newAllProfitYoY: {name: '新品毛利额-同比增幅', scale: true, color: true},
      newAllProfitPct: {name: '新品毛利额-占比', scale: true, page: {skuContrast: '新品毛利额-占比商品'}},

      // 新品SKU对比分析： 新品单品毛利额
      newSingleProductAllProfit: {name: '新品单品毛利额', unit: '元', singleSale: true, icon: "newSingleProductAllProfit"},
      newSingleProductAllProfitYoYValue: {name: '新品单品毛利额-同期值', unit: '元', singleSale: true},
      newSingleProductAllProfitYoY: {name: '新品单品毛利额-同比增幅', scale: true, color: true},
      newSingleProductAllProfitPct: {name: '新品单品毛利额-占比', scale: true},

      // 新品SKU对比分析： 新品单店单品毛利额
      newSingleStoreProductAllProfit: {name: '新品单店单品毛利额', unit: '元', singleSale: true, icon: "newSingleStoreProductAllProfit"},
      newSingleStoreProductAllProfitYoYValue: {name: '新品单店单品毛利额-同期值', unit: '元', singleSale: true},
      newSingleStoreProductAllProfitYoY: {name: '新品单店单品毛利额-同比增幅', scale: true, color: true},
      newSingleStoreProductAllProfitPct: {name: '新品单店单品毛利额-占比', scale: true},

      // 新品SKU对比分析： 新品平均铺货门店数
      newSingleProductStoreCnt: {name: '新品平均铺货门店数', point: 0, icon: "newSingleProductStoreCnt"},
      newSingleProductStoreCntYoYValue: {name: '新品平均铺货门店数-同期值', point: 0},
      newSingleProductStoreCntYoY: {name: '新品平均铺货门店数-同比增幅', scale: true, color: true},
      newSingleProductStoreCntPct: {name: '新品平均铺货门店数-占比', scale: true},

      // 新品SKU对比分析： 新品周转天数
      newSaleDays: {name: '新品经销周转天数'},
      newSaleDaysYoYValue: {name: '新品经销周转天数-同期值'},
      newSaleDaysYoY: {name: '新品经销周转天数-同比增幅', scale: true, color: true},
      newSaleDaysPct: {name: '新品经销周转天数-占比', scale: true},

      //综合分析--sku对比分析
      // 有售sku数
      saleSkuCnt: {name: "有售SKU数", point: 0, page: {skuContrast: '商品有售SKU数'}},
      saleSkuCntYoYValue: {name: '有售SKU数-同期值', point: 0},
      saleSkuCntYoY: {name: '有售SKU数-同比增幅', scale: true, color: true},

      // SKU对比分析： 可售sku数
      canSaleSkuCnt: {name: '可售SKU数', point: 0, page: {skuContrast: '商品可售SKU数'}},
      canSaleSkuCntYoYValue: {name: '可售SKU数-同期值', point: 0},
      canSaleSkuCntYoY: {name: '可售SKU数-同比增幅', scale: true, color: true},

      // SKU对比分析： 单品销售额
      singleProductAllAmount: {name: '单品销售额', unit: '元', singleSale: true, icon: "newSingleProductAllAmount", page: {skuContrast: '商品单品销售额'}},
      singleProductAllAmountYoYValue: {name: '单品销售额-同期值', unit: '元', singleSale: true},
      singleProductAllAmountYoY: {name: '单品销售额-同比增幅', scale: true, color: true},
      singleProductAllAmountPct: {name: '单品销售额-占比', scale: true},

      // SKU对比分析： 单店单品销售额
      singleStoreProductAllAmount: {name: '单店单品销售额', unit: '元', singleSale: true, icon: "newSingleStoreProductAllAmount", page: {skuContrast: '商品单店单品销售额'}},
      singleStoreProductAllAmountYoYValue: {name: '单店单品销售额-同期值', unit: '元', singleSale: true},
      singleStoreProductAllAmountYoY: {name: '单店单品销售额-同比增幅', scale: true, color: true},
      singleStoreProductAllAmountPct: {name: '单店单品销售额-占比', scale: true},

      // SKU对比分析： 单品毛利额
      singleProductAllProfit: {name: '单品毛利额', unit: '元', singleSale: true, icon: "newSingleProductAllProfit", page: {skuContrast: '商品单品毛利额'}},
      singleProductAllProfitYoYValue: {name: '单品毛利额-同期值', unit: '元', singleSale: true},
      singleProductAllProfitYoY: {name: '单品毛利额-同比增幅', scale: true, color: true},
      singleProductAllProfitPct: {name: '单品毛利额-占比', scale: true},

      // SKU对比分析： 单店单品毛利额
      singleStoreProductAllProfit: {name: '单店单品毛利额', unit: '元', singleSale: true, icon: "newSingleStoreProductAllProfit", page: {skuContrast: '商品单店单品毛利额'}},
      singleStoreProductAllProfitYoYValue: {name: '单店单品毛利额-同期值', unit: '元', singleSale: true},
      singleStoreProductAllProfitYoY: {name: '单店单品毛利额-同比增幅', scale: true, color: true},
      singleStoreProductAllProfitPct: {name: '单店单品毛利额-占比', scale: true},

      // SKU对比分析： 平均铺货门店数
      singleProductStoreCnt: {name: '平均铺货门店数', point: 0, icon: "newSingleProductStoreCnt", page: {skuContrast: '商品平均铺货门店数'}},
      singleProductStoreCntYoYValue: {name: '平均铺货门店数-同期值', point: 0},
      singleProductStoreCntYoY: {name: '平均铺货门店数-同比增幅', scale: true, color: true},
      singleProductStoreCntPct: {name: '平均铺货门店数-占比', scale: true},

      //通道收益 all
      channelEstAmountTotal: {name: "通道收益额(应收)", sale: true},
      channelRealAmountTotal: {name: "通道收益额(已收)", sale: true},
      channelPendingAmountTotalCurrentMonth: {name: "通道收益额-(至月底未到期未收)", sale: true, minWidth: 240},
      channelPendingAmountTotalCurrentYear: {name: "通道收益额-(至年底未到期未收)", sale: true, minWidth: 240},

      //营运
      storeChannelEstAmount: {name: "通道收益额-(营运应收)", sale: true},
      storeChannelRealAmount: {name: "通道收益额-(营运已收)", sale: true},
      storeChannelPendingAmountCurrentMonth: {name: "通道收益额-(营运_至月底未到期未收)", sale: true, minWidth: 240},
      storeChannelPendingAmountCurrentYear: {name: "通道收益额-(营运_至年底未到期未收)", sale: true, minWidth: 240},

      storeRentChannelSettleAmount: {name: "通道收益额-(租金收入)", sale: true},
      storeRentChannelSettleAmountYoYValue: {name: "通道收益额-(租金收入)-同期值", sale: true},
      storeRentChannelSettleAmountYoY: {name: "通道收益额-(租金收入)-同比增幅", scale: true, color: true},
      storeRentChannelSettleAmountToTValue: {name: "通道收益额-(租金收入)-环期值", sale: true},
      storeRentChannelSettleAmountToT: {name: "通道收益额-(租金收入)-环比增幅", scale: true, color: true},
      storeRentChannelSettleAmountPct: {name: "通道收益额-(租金收入)-占比", scale: true},

      storeWithRentChannelSettleAmount: {name: "通道收益额-(营运_含租金收入)", sale: true},
      storeWithRentChannelSettleAmountYoYValue: {name: "通道收益额-(营运_含租金收入)-同期值", sale: true},
      storeWithRentChannelSettleAmountYoY: {name: "通道收益额-(营运_含租金收入)-同比增幅", scale: true, color: true},
      storeWithRentChannelSettleAmountToTValue: {name: "通道收益额-(营运_含租金收入)-环期值", sale: true},
      storeWithRentChannelSettleAmountToT: {name: "通道收益额-(营运_含租金收入)-环比增幅", scale: true, color: true},
      storeWithRentChannelSettleAmountPct: {name: "通道收益额-(营运_含租金收入)-占比", scale: true},

      //采购
      buyerChannelEstAmount: {name: "通道收益额-(采购应收)", sale: true},
      buyerChannelRealAmount: {name: "通道收益额-(采购已收)", sale: true},
      buyerFixEstAmount: {name: "通道收益额-(采购固定费用_应收)", sale: true},
      buyerFixRealAmount: {name: "通道收益额-(采购固定费用_已收)", sale: true},
      buyerChangeEstAmount: {name: "通道收益额-(采购变动费用_应收)", sale: true},
      buyerChangeRealAmount: {name: "通道收益额-(采购变动费用_已收)", sale: true},
      buyerChannelPendingAmountCurrentMonth: {name: "通道收益额-(采购_至月底未到期未收)", sale: true, minWidth: 240},
      buyerChannelPendingAmountCurrentYear: {name: "通道收益额-(采购_至年底未到期未收)", sale: true, minWidth: 240},

      // 退货成本(去税)
      retNet: {name: '退货成本(去税)', sale: true},
      retNetYoY: {name: '退货成本(去税)-同比增幅', scale: true, color: true},
      retNetYoYValue: {name: '退货成本(去税)-同期值', sale: true},
    },
    //加注缺品
    supLack: {
      skuLack: {name: '加注缺品SKU数', sale: true},
      avgDay: {name: '平均加注缺品天数', sale: true},
      APercent: {name: 'A类品加注缺品占比', scale: true},
    },
    //供应商加注缺品
    supSubLack: {
      spec: {name: '规格', sale: true},
      statusName: {name: '商品状态', scale: true},
      productLevel: {name: '最新商品等级', scale: true},
      stockOutDays: {name: '加注缺品天数'},
    },

    //指标达成-采购
    purchase: {
      //销售
      allAmount: {name: '含税销售额-实绩', sale: true},
      allAmountYoYValue: {name: '上年含税销售额-实绩', sale: true, width: 190},
      allAmountYoY: {name: '含税销售额-实绩同比增幅', graph: 1},

      allAmountAftTax: {name: '不含税销售额-实绩', sale: true, width: 180},
      allAmountAftTaxYoYValue: {name: '上年不含税销售额-实绩', sale: true, width: 205},
      allAmountAftTaxYoY: {name: '不含税销售额-实绩同比增幅', graph: 1},

      allAmountKpi: {name: '含税销售额-指标', sale: true},
      allAmountKpiYoYValue: {name: '上年含税销售额-指标', sale: true, width: 190},
      allAmountKpiYoY: {name: '含税销售额-指标同比增幅', graph: 1},

      allAmountAftTaxKpi: {name: '不含税销售额-指标', sale: true, width: 180},
      allAmountAftTaxKpiYoYValue: {name: '上年不含税销售额-指标', sale: true, width: 205},
      allAmountAftTaxKpiYoY: {name: '不含税销售额-指标同比增幅', graph: 1},

      allAmountCR: {name: '含税销售额-指标达成率', graph: 2},
      allAmountCRYoYValue: {name: '上年含税销售额-指标达成率', graph: 2},
      allAmountCRYoYInc: {name: '含税销售额-指标达成率同比增长', graph: 1, width: 210, inc: 2},

      allAmountAftTaxCR: {name: '不含税销售额-指标达成率', graph: 2},
      allAmountAftTaxCRYoYValue: {name: '上年不含税销售额-指标达成率', graph: 2},
      allAmountAftTaxCRYoYInc: {name: '不含税销售额-指标达成率同比增长', graph: 1, width: 230, inc: 2},

      //毛利额
      allProfit: {name: '毛利额-实绩', sale: true, icon: 'allProfitReal'},
      allProfitYoYValue: {name: '上年毛利额-实绩', sale: true},
      allProfitYoY: {name: '毛利额-实绩同比增幅', graph: 1},

      allProfitKpi: {name: '毛利额-指标', sale: true},
      allProfitKpiYoYValue: {name: '上年毛利额-指标', sale: true},
      allProfitKpiYoY: {name: '毛利额-指标同比增幅', graph: 1},

      allProfitCR: {name: '毛利额-指标达成率', graph: 2},
      allProfitCRYoYValue: {name: '上年毛利额-指标达成率', graph: 2},
      allProfitCRYoYInc: {name: '毛利额-指标达成率同比增长', graph: 1, inc: 2},

      newAvgBizProfitAmount: {name: ' 新品平均毛利额', graph: 1},
      allAvgBizProfitAmount: {name: ' 商品平均毛利额', graph: 1},

      //毛利率
      allProfitRate: {name: '毛利率-实绩', scale: true, icon: 'allProfitRate'},
      allProfitRateYoYValue: {name: '上年毛利率-实绩', scale: true},
      allProfitRateYoYInc: {name: '毛利率-实绩同比增长', graph: 1, inc: 2},

      allProfitRateKpi: {name: '毛利率-指标', scale: true},
      allProfitRateKpiYoYValue: {name: '上年毛利率-指标', scale: true},
      allProfitRateKpiYoYInc: {name: '毛利率-指标同比增长', graph: 1, inc: 2},

      allProfitRateCR: {name: '毛利率-指标达成率(高于/低于指标百分点)', graph: 1, inc: 2, width: 260},
      allProfitRateCRYoYValue: {name: '上年毛利率-指标达成率(高于/低于指标百分点)', graph: 1, inc: 2, width: 285},
      allProfitRateCRYoYInc: {name: '毛利率-指标达成率同比增长', graph: 1, inc: 2},

      //通道收益
      buyerChannelSettleAmount: {name: '通道收益额-实绩', sale: true},
      buyerChannelSettleAmountYoYValue: {name: '上年通道收益额-实绩', sale: true, width: 190},
      buyerChannelSettleAmountYoY: {name: '通道收益额-实绩同比增幅', graph: 1},

      buyerChannelSettleAmountKpi: {name: '通道收益额-指标', sale: true},
      buyerChannelSettleAmountKpiYoYValue: {name: '上年通道收益额-指标', sale: true, width: 190},
      buyerChannelSettleAmountKpiYoY: {name: '通道收益额-指标同比增幅', graph: 1},

      buyerChannelSettleAmountCR: {name: '通道收益额-指标达成率', graph: 2},
      buyerChannelSettleAmountCRYoYValue: {name: '上年通道收益额-指标达成率', graph: 2},
      buyerChannelSettleAmountCRYoYInc: {name: '通道收益额-指标达成率同比增长', graph: 1, width: 220, inc: 2},


      //综合收益额
      compIncomeAmount: {name: '综合收益额-实绩', sale: true},
      compIncomeAmountYoYValue: {name: '上年综合收益额-实绩', sale: true, width: 190},
      compIncomeAmountYoY: {name: '综合收益额-实绩同比增幅', graph: 1},

      compIncomeAmountKpi: {name: '综合收益额-指标', sale: true},
      compIncomeAmountKpiYoYValue: {name: '上年综合收益额-指标', sale: true, width: 190},
      compIncomeAmountKpiYoY: {name: '综合收益额-指标同比增幅', graph: 1},

      compIncomeAmountCR: {name: '综合收益额-指标达成率', graph: 2},
      compIncomeAmountCRYoYValue: {name: '上年综合收益额-指标达成率', graph: 2},
      compIncomeAmountCRYoYInc: {name: '综合收益额-指标达成率同比增长', graph: 1, width: 220, inc: 2},

      //综合收益率
      compIncomeRate: {name: '综合收益率-实绩', scale: true, width: 170, icon: 'allBizCompIncomeAmountRate'},
      compIncomeRateYoYValue: {name: '上年综合收益率-实绩', scale: true, width: 180},
      compIncomeRateYoYInc: {name: '综合收益率-实绩同比增长', graph: 1, inc: 2},

      compIncomeRateKpi: {name: '综合收益率-指标', scale: true},
      compIncomeRateKpiYoYValue: {name: '上年综合收益率-指标', scale: true},
      compIncomeRateKpiYoYInc: {name: '综合收益率-指标同比增长', graph: 1, inc: 2},

      compIncomeRateCR: {name: '综合收益率-指标达成率(高于/低于指标百分点)', inc: 2, graph: 1, width: 285},
      compIncomeRateCRYoYValue: {name: '上年综合收益率-指标达成率(高于/低于指标百分点)', inc: 2, graph: 1, width: 310},
      compIncomeRateCRYoYInc: {name: '综合收益率-指标达成率同比增长', graph: 1, inc: 2},

      //经销周转天数
      saleDays: {name: '经销周转天数-实绩', icon: "saleDays"},
      saleDaysYoYValue: {name: '上年经销周转天数-实绩'},
      saleDaysYoY: {name: '经销周转天数-实绩同比增长', graph: 1},

      saleDaysKpi: {name: '经销周转天数-指标'},
      saleDaysKpiYoYValue: {name: '上年经销周转天数-指标'},
      saleDaysKpiYoY: {name: '经销周转天数-指标同比增长', graph: 1},

      saleDaysCR: {name: '经销周转天数-指标达成率', graph: 1},
      saleDaysCRYoYValue: {name: '上年经销周转天数-指标达成率', graph: 1},
      saleDaysCRYoYInc: {name: '经销周转天数-指标达成率同比增长', graph: 1, inc: 2},
    },

    //指标达成-运营
    operations: {
      //销售
      allAmount: {name: '含税销售额-实绩', sale: true},
      allAmountYoYValue: {name: '上年含税销售额-实绩', sale: true},
      allAmountYoY: {name: '含税销售额-实绩同比增幅', graph: 1},

      allAmountKpi: {name: '含税销售额-指标', sale: true},
      allAmountKpiYoYValue: {name: '上年含税销售额-指标', sale: true},
      allAmountKpiYoY: {name: '含税销售额-指标同比增幅', graph: 1},

      allAmountCR: {name: '含税销售额-指标达成率', graph: 2},
      allAmountCRYoYValue: {name: '上年含税销售额-指标达成率', graph: 2},
      allAmountCRYoYInc: {name: '含税销售额-指标达成率同比增长', graph: 1, inc: 2},

      //综合收益
      compIncomeAmount: {name: '综合收益额-实绩', sale: true},
      compIncomeAmountYoYValue: {name: '上年综合收益额-实绩', sale: true},
      compIncomeAmountYoY: {name: '综合收益额-实绩同比增幅', graph: 1},

      compIncomeAmountKpi: {name: '综合收益额-指标', sale: true},
      compIncomeAmountKpiYoYValue: {name: '上年综合收益额-指标', sale: true},
      compIncomeAmountKpiYoY: {name: '综合收益额-指标同比增幅', graph: 1},

      compIncomeAmountCR: {name: '综合收益额-指标达成率', graph: 2},
      compIncomeAmountCRYoYValue: {name: '上年综合收益额-指标达成率', graph: 2},
      compIncomeAmountCRYoYInc: {name: '综合收益额-指标达成率同比增长', graph: 1, inc: 2},

      //经销周转天数
      saleDays: {name: '经销周转天数-实绩', icon: "saleDays"},
      saleDaysYoYValue: {name: '上年经销周转天数-实绩'},
      saleDaysYoY: {name: '经销周转天数-实绩同比增长', graph: 1},

      saleDaysKpi: {name: '经销周转天数-指标'},
      saleDaysKpiYoYValue: {name: '上年经销周转天数-指标'},
      saleDaysKpiYoY: {name: '经销周转天数-指标同比增幅', graph: 1},

      saleDaysCR: {name: '经销周转天数-指标达成率', graph: 2},
      saleDaysCRYoYValue: {name: '上年经销周转天数-指标达成率', graph: 2},
      saleDaysCRYoYInc: {name: '经销周转天数-指标达成率同比增长', graph: 1, inc: 2}
    },

    abc: {
      //销售额
      abcTag: {name: "整体ABC"},
      abcTagAvg: {name: "平均ABC"},
      saleAmount: {name: '销售额', two: 'Pct'},
      saleAmountYoYValue: {name: '销售额-同期值'},
      saleAmountYoY: {name: '销售额-同比增幅', scale: true, color: true},
      saleAmountPct: {name: '销售额占比', scale: true, ignore: true},
      saleAmountDiff: {name: '销售额-子类平均比', scale: true,},
      saleAmountCategoryAvg: {name: '子类平均销售额',},
      //销售数 -- 业态 1 大卖场 2综超 3 标超 4其他
      saleAmount0: {name: '整体', rowSpan: true, operation: true, two: 'Pct', sale: true},
      saleAmount1: {name: '一级大卖场', rowSpan: true, operation: true, two: 'Pct', sale: true},
      saleAmount5: {name: '二级大卖场', rowSpan: true, operation: true, two: 'Pct', sale: true},
      saleAmount2: {name: '综超', rowSpan: true, operation: true, two: 'Pct', sale: true},
      saleAmount3: {name: '精超', rowSpan: true, operation: true, two: 'Pct', sale: true},
      saleAmount4: {name: '标超', rowSpan: true, operation: true, two: 'Pct', sale: true},
      saleAmount99: {name: '其他', rowSpan: true, operation: true, two: 'Pct', sale: true},
      saleAmount0Pct: {name: '整体占比', ignore: true},
      saleAmount1Pct: {name: '大卖场占比', ignore: true},
      saleAmount2Pct: {name: '综超占比', ignore: true},
      saleAmount3Pct: {name: '精超占比', ignore: true},
      saleAmount4Pct: {name: '标超占比', ignore: true},
      saleAmount99Pct: {name: '其他占比', ignore: true},

      //销售额A类商品
      saleAmountA: {name: 'A类商品销售额', sale: true,},
      saleAmountAYoYValue: {name: 'A类商品销售额-同期值', sale: true,},
      saleAmountAYoY: {name: 'A类商品销售额-同比增幅', scale: true, color: true},
      saleAmountAPct: {name: 'A类商品销售额占比', scale: true},
      saleAmountADiff: {name: 'A类销售额-子类平均比', scale: true,},

      //销售额B类商品
      saleAmountB: {name: 'B类商品销售额', sale: true,},
      saleAmountBYoYValue: {name: 'B类商品销售额-同期值', sale: true,},
      saleAmountBYoY: {name: 'B类商品销售额-同比增幅', scale: true, color: true},
      saleAmountBPct: {name: 'B类商品销售额占比', scale: true},
      saleAmountBDiff: {name: 'B类销售额-子类平均比', scale: true,},
      //销售额C类商品
      saleAmountC: {name: 'C类商品销售额', sale: true,},
      saleAmountCYoYValue: {name: 'C类商品销售额-同期值', sale: true,},
      saleAmountCYoY: {name: 'C类商品销售额-同比增幅', scale: true, color: true},
      saleAmountCPct: {name: 'C类商品销售额占比', scale: true},
      saleAmountCDiff: {name: 'C类销售额-子类平均比', scale: true,},
      //销售额合计
      saleAmountTotal: {name: '销售额合计', sale: true,},
      saleAmountTotalYoYValue: {name: '销售额合计-同期值', sale: true,},
      saleAmountTotalYoY: {name: '销售额合计-同比增幅', scale: true, color: true},
      saleAmountTotalPct: {name: '销售额合计占比', scale: true},
      saleAmountTotalDiff: {name: '销售额合计-子类平均比', scale: true,},
      //销售数
      saleUnit: {name: '销售数'},
      saleUnitYoYValue: {name: '销售数-同期值'},
      saleUnitYoY: {name: '销售数-同比增幅', scale: true, color: true},
      saleUnitPct: {name: '销售数占比', scale: true},
      saleUnitDiff: {name: '销售数-子类平均比', scale: true,},
      saleUnitCategoryAvg: {name: '子类平均销售数',},
      //销售数 -- 业态
      saleUnit0: {name: '整体', operation: true, rowSpan: true, two: 'Pct', sale: true},
      saleUnit1: {name: '一级大卖场', operation: true, rowSpan: true, two: 'Pct', sale: true},
      saleUnit5: {name: '二级大卖场', operation: true, rowSpan: true, two: 'Pct', sale: true},
      saleUnit2: {name: '综超', operation: true, rowSpan: true, two: 'Pct', sale: true},
      saleUnit3: {name: '精超', operation: true, rowSpan: true, two: 'Pct', sale: true},
      saleUnit4: {name: '标超', operation: true, rowSpan: true, two: 'Pct', sale: true},
      saleUnit99: {name: '其他', operation: true, rowSpan: true, two: 'Pct', sale: true},
      saleUnit0Pct: {name: '整体占比', ignore: true},
      saleUnit1Pct: {name: '大卖场占比', ignore: true},
      saleUnit2Pct: {name: '综超占比', ignore: true},
      saleUnit3Pct: {name: '标超占比', ignore: true},
      saleUnit4Pct: {name: '标超占比', ignore: true},
      saleUnit99Pct: {name: '其他占比', ignore: true},

      //销售数A类商品
      saleUnitA: {name: 'A类商品销售数'},
      saleUnitAYoYValue: {name: 'A类商品销售数-同期值'},
      saleUnitAYoY: {name: 'A类商品销售数-同比增幅', scale: true, color: true},
      saleUnitAPct: {name: 'A类商品销售数占比', scale: true},
      saleUnitADiff: {name: 'A类销售数-子类平均比', scale: true,},
      //销售数B类商品
      saleUnitB: {name: 'B类商品销售数'},
      saleUnitBYoYValue: {name: 'B类商品销售数-同期值'},
      saleUnitBYoY: {name: 'B类商品销售数-同比增幅', scale: true, color: true},
      saleUnitBPct: {name: 'B类商品销售数占比', scale: true},
      saleUnitBDiff: {name: 'B类销售数-子类平均比', scale: true,},
      //销售数C类商品
      saleUnitC: {name: 'C类商品销售数'},
      saleUnitCYoYValue: {name: 'C类商品销售数-同期值'},
      saleUnitCYoY: {name: 'C类商品销售数-同比增幅', scale: true, color: true},
      saleUnitCPct: {name: 'C类商品销售数占比', scale: true},
      saleUnitCDiff: {name: 'C类销售数-子类平均比', scale: true,},
      //销售数合计
      saleUnitTotal: {name: '销售数合计'},
      saleUnitTotalYoYValue: {name: '销售数合计-同期值'},
      saleUnitTotalYoY: {name: '销售数合计-同比增幅', scale: true, color: true},
      saleUnitTotalPct: {name: '销售数合计占比', scale: true},
      saleUnitTotalDiff: {name: '销售数合计-子类平均比', scale: true,},
      //毛利额
      profit: {name: '财务毛利', sale: true},
      profitYoYValue: {name: '财务毛利-同期值', sale: true},
      // profitYoY: {name: '财务毛利-同比增幅', scale: true},
      profitYoYInc: {name: '财务毛利-同比增幅', scale: true, color: true},
      profitPct: {name: '财务毛利占比', scale: true},
      profitDiff: {name: '财务毛利-子类平均比', scale: true,},
      profitCategoryAvg: {name: '子类平均财务毛利',},
      //毛利额 -- 业态
      profit0: {name: '整体', rowSpan: true, operation: true, two: 'Pct', sale: true},
      profit1: {name: '一级大卖场', rowSpan: true, operation: true, two: 'Pct', sale: true},
      profit5: {name: '二级大卖场', rowSpan: true, operation: true, two: 'Pct', sale: true},
      profit2: {name: '综超', rowSpan: true, operation: true, two: 'Pct', sale: true},
      profit3: {name: '精超', rowSpan: true, operation: true, two: 'Pct', sale: true},
      profit4: {name: '标超', rowSpan: true, operation: true, two: 'Pct', sale: true},
      profit99: {name: '其他', rowSpan: true, operation: true, two: 'Pct', sale: true},
      profit0Pct: {name: '整体占比', ignore: true},
      profit1Pct: {name: '大卖场占比', ignore: true},
      profit2Pct: {name: '综超占比', ignore: true},
      profit3Pct: {name: '精超占比', ignore: true},
      profit4Pct: {name: '标超占比', ignore: true},
      profit99Pct: {name: '其他占比', ignore: true},

      //财务毛利A类商品
      profitA: {name: 'A类商品财务毛利', sale: true,},
      profitAYoYValue: {name: 'A类商品财务毛利-同期值', sale: true,},
      profitAYoY: {name: 'A类商品财务毛利-同比增幅', scale: true, color: true},
      profitAPct: {name: 'A类商品财务毛利占比', scale: true},
      profitADiff: {name: 'A类财务毛利-子类平均比', scale: true,},
      //财务毛利B类商品
      profitB: {name: 'B类商品财务毛利'},
      profitBYoYValue: {name: 'B类商品财务毛利-同期值'},
      profitBYoY: {name: 'B类商品财务毛利-同比增幅', scale: true, color: true},
      profitBPct: {name: 'B类商品财务毛利占比', scale: true},
      profitBDiff: {name: 'B类财务毛利-子类平均比', scale: true,},
      //财务毛利C类商品
      profitC: {name: 'C类商品财务毛利', sale: true,},
      profitCYoYValue: {name: 'C类商品财务毛利-同期值', sale: true,},
      profitCYoY: {name: 'C类商品财务毛利-同比增幅', scale: true, color: true},
      profitCPct: {name: 'C类商品财务毛利占比', scale: true},
      profitCDiff: {name: 'C类财务毛利-子类平均比', scale: true,},
      //毛利额合计
      profitTotal: {name: '财务毛利合计', sale: true,},
      profitTotalYoYValue: {name: '财务毛利合计-同期值', sale: true,},
      profitTotalYoY: {name: '财务毛利合计-同比增幅', scale: true, color: true},
      profitTotalPct: {name: '财务毛利合计占比', scale: true},
      profitTotalDiff: {name: '财务毛利合计-子类平均比', scale: true,},
      //有售sku数
      skuUnit: {name: '有售sku数', point: 0, two: 'Pct'},
      skuUnitYoYValue: {name: '有售sku数-同期值'},
      skuUnitYoY: {name: '有售sku数-同比增幅', scale: true, color: true},
      skuUnitPct: {name: '有售sku数占比', scale: true, ignore: true},


      //有售sku数A类商品
      skuUnitA: {name: 'A类商品有售sku数', point: 0,},
      skuUnitAYoYValue: {name: 'A类商品有售sku数-同期值', point: 0,},
      skuUnitAYoY: {name: 'A类商品有售sku数-同比增幅', scale: true, color: true},
      skuUnitAPct: {name: 'A类商品有售sku数占比', scale: true},

      //有售sku数B类商品
      skuUnitB: {name: 'B类商品有售sku数', point: 0,},
      skuUnitBYoYValue: {name: 'B类商品有售sku数-同期值', point: 0,},
      skuUnitBYoY: {name: 'B类商品有售sku数-同比增幅', scale: true, color: true},
      skuUnitBPct: {name: 'B类商品有售sku数占比', scale: true},

      //有售sku数C类商品
      skuUnitC: {name: 'C类商品有售sku数', point: 0,},
      skuUnitCYoYValue: {name: 'C类商品有售sku数-同期值', point: 0,},
      skuUnitCYoY: {name: 'C类商品有售sku数-同比增幅', scale: true, color: true},
      skuUnitCPct: {name: 'C类商品有售sku数占比', scale: true},

      //有售sku数合计
      skuUnitTotal: {name: '有售sku数合计', point: 0,},
      skuUnitTotalYoYValue: {name: '有售sku数合计-同期值', point: 0,},
      skuUnitTotalYoY: {name: '有售sku数合计-同比增幅', scale: true, color: true},
      skuUnitTotalPct: {name: '有售sku数合计占比', scale: true},

      //日均库存成本
      stockCostAvg: {name: '日均库存成本'},
      stockCostAvgYoYValue: {name: '日均库存成本-同期值'},
      stockCostAvgYoY: {name: '日均库存成本-同比增幅', scale: true, color: true},
      stockCostAvgPct: {name: '日均库存成本占比', scale: true},
      stockCostAvgDiff: {name: '日均库存成本-子类平均比', scale: true,},
      stockCostAvgCategoryAvg: {name: '子类平均日均库存成本',},
      //日均库存成本 -- 业态
      stockCostAvg0: {name: '整体', rowSpan: true, operation: true, two: 'Pct', sale: true},
      stockCostAvg1: {name: '一级大卖场', rowSpan: true, operation: true, two: 'Pct', sale: true},
      stockCostAvg5: {name: '二级大卖场', rowSpan: true, operation: true, two: 'Pct', sale: true},
      stockCostAvg2: {name: '综超', rowSpan: true, operation: true, two: 'Pct', sale: true},
      stockCostAvg3: {name: '精超', rowSpan: true, operation: true, two: 'Pct', sale: true},
      stockCostAvg4: {name: '标超', rowSpan: true, operation: true, two: 'Pct', sale: true},
      stockCostAvg99: {name: '其他', rowSpan: true, operation: true, two: 'Pct', sale: true},
      stockCostAvg0Pct: {name: '整体占比', ignore: true},
      stockCostAvg1Pct: {name: '大卖场占比', ignore: true},
      stockCostAvg2Pct: {name: '综超占比', ignore: true},
      stockCostAvg3Pct: {name: '精超占比', ignore: true},
      stockCostAvg4Pct: {name: '标超占比', ignore: true},
      stockCostAvg99Pct: {name: '其他占比', ignore: true},

      //日均库存成本A类商品
      stockCostAvgA: {name: 'A类商品日均库存成本', sale: true,},
      stockCostAvgAYoYValue: {name: 'A类商品日均库存成本-同期值', sale: true,},
      stockCostAvgAYoY: {name: 'A类商品日均库存成本-同比增幅', scale: true, color: true},
      stockCostAvgAPct: {name: 'A类商品日均库存成本占比', scale: true},
      stockCostAvgADiff: {name: 'A类日均库存成本-子类平均比', scale: true,},
      //日均库存成本B类商品
      stockCostAvgB: {name: 'B类商品日均库存成本', sale: true,},
      stockCostAvgBYoYValue: {name: 'B类商品日均库存成本-同期值', sale: true,},
      stockCostAvgBYoY: {name: 'B类商品日均库存成本-同比增幅', scale: true, color: true},
      stockCostAvgBPct: {name: 'B类商品日均库存成本占比', scale: true},
      stockCostAvgBDiff: {name: 'B类日均库存成本-子类平均比', scale: true,},
      //日均库存成本C类商品
      stockCostAvgC: {name: 'C类商品日均库存成本', sale: true,},
      stockCostAvgCYoYValue: {name: 'C类商品日均库存成本-同期值', sale: true,},
      stockCostAvgCYoY: {name: 'C类商品日均库存成本-同比增幅', scale: true, color: true},
      stockCostAvgCPct: {name: 'C类商品日均库存成本占比', scale: true},
      stockCostAvgCDiff: {name: 'C类日均库存成本-子类平均比', scale: true,},
      //日均库存成本合计
      stockCostAvgTotal: {name: '日均库存成本合计', sale: true,},
      stockCostAvgTotalYoYValue: {name: '日均库存成本合计-同期值', sale: true,},
      stockCostAvgTotalYoY: {name: '日均库存成本合计-同比增幅', scale: true, color: true},
      stockCostAvgTotalPct: {name: '日均库存成本合计占比', scale: true},
      stockCostAvgTotalDiff: {name: '日均库存成本合计-子类平均比', scale: true,},
      //周转天数
      stockTurnover: {name: '周转天数'},
      stockTurnoverYoYValue: {name: '周转天数-同期值'},
      stockTurnoverYoY: {name: '周转天数-同比增幅', scale: true, color: true},
      stockTurnoverPct: {name: '周转天数占比', scale: true},
      stockTurnoverDiff: {name: '周转天数-子类平均比', scale: true,},
      stockTurnoverCategoryAvg: {name: '子类平均周转天数',},
      //周转天数 -- 业态
      stockTurnover0: {name: '整体', rowSpan: true, operation: true, two: 'Pct'},
      stockTurnover1: {name: '一级大卖场', rowSpan: true, operation: true, two: 'Pct'},
      stockTurnover5: {name: '二级大卖场', rowSpan: true, operation: true, two: 'Pct'},
      stockTurnover2: {name: '综超', rowSpan: true, operation: true, two: 'Pct'},
      stockTurnover3: {name: '精超', rowSpan: true, operation: true, two: 'Pct'},
      stockTurnover4: {name: '标超', rowSpan: true, operation: true, two: 'Pct'},
      stockTurnover99: {name: '其他', rowSpan: true, operation: true, two: 'Pct'},
      stockTurnover0Pct: {name: '整体占比', ignore: true},
      stockTurnover1Pct: {name: '大卖场占比', ignore: true},
      stockTurnover2Pct: {name: '综超占比', ignore: true},
      stockTurnover3Pct: {name: '精超占比', ignore: true},
      stockTurnover4Pct: {name: '标超占比', ignore: true},
      stockTurnover99Pct: {name: '其他占比', ignore: true},

      //周转天数A类商品
      stockTurnoverA: {name: 'A类商品周转天数'},
      stockTurnoverAYoYValue: {name: 'A类商品周转天数-同期值'},
      stockTurnoverAYoY: {name: 'A类商品周转天数-同比增幅', scale: true, color: true},
      stockTurnoverAPct: {name: 'A类商品周转天数占比', scale: true},
      stockTurnoverADiff: {name: 'A类周转天数-子类平均比', scale: true,},
      //周转天数B类商品
      stockTurnoverB: {name: 'B类商品周转天数'},
      stockTurnoverBYoYValue: {name: 'B类商品周转天数-同期值'},
      stockTurnoverBYoY: {name: 'B类商品周转天数-同比增幅', scale: true, color: true},
      stockTurnoverBPct: {name: 'B类商品周转天数占比', scale: true},
      stockTurnoverBDiff: {name: 'B类周转天数-子类平均比', scale: true,},
      //周转天数C类商品
      stockTurnoverC: {name: 'C类商品周转天数'},
      stockTurnoverCYoYValue: {name: 'C类商品周转天数-同期值'},
      stockTurnoverCYoY: {name: 'C类商品周转天数-同比增幅', scale: true, color: true},
      stockTurnoverCPct: {name: 'C类商品周转天数占比', scale: true},
      stockTurnoverCDiff: {name: '周转天数C类-子类平均比', scale: true,},
      //周转天数合计
      stockTurnoverTotal: {name: '周转天数合计'},
      stockTurnoverTotalYoYValue: {name: '周转天数合计-同期值'},
      stockTurnoverTotalYoY: {name: '周转天数合计-同比增幅', scale: true, color: true},
      stockTurnoverTotalPct: {name: '周转天数合计占比', scale: true},
      stockTurnoverTotalDiff: {name: '周转天数合计-子类平均比', scale: true,},
      //铺市门店数
      layStoreCnt: {name: '单品单店铺市数', point: 0},
      layStoreCntYoYValue: {name: '单品单店铺市数-同期值', point: 0},
      layStoreCntYoY: {name: '单品单店铺市数-同比增幅', scale: true, color: true},
      layStoreCntPct: {name: '单品单店铺市数占比', scale: true},
      layStoreCntDiff: {name: '单品单店铺市数-子类平均比', scale: true,},
      layStoreCntCategoryAvg: {name: '子类平单品单店铺市数',},
      //铺市门店数A类商品
      layStoreCntA: {name: 'A类商品单品单店铺市数', point: 0},
      layStoreCntAYoYValue: {name: 'A类商品单品单店铺市数-同期值', point: 0},
      layStoreCntAYoY: {name: 'A类商品单品单店铺市数-同比增幅', scale: true, color: true},
      layStoreCntAPct: {name: 'A类商品单品单店铺市数占比', scale: true},
      layStoreCntADiff: {name: 'A类单品单店铺市数-子类平均比', scale: true,},
      //铺市门店数B类商品
      layStoreCntB: {name: 'B类商品单品单店铺市数', point: 0},
      layStoreCntBYoYValue: {name: 'B类商品单品单店铺市数-同期值', point: 0},
      layStoreCntBYoY: {name: 'B类商品单品单店铺市数-同比增幅', scale: true, color: true},
      layStoreCntBPct: {name: 'B类商品单品单店铺市数占比', scale: true},
      layStoreCntBDiff: {name: 'B类单品单店铺市数-子类平均比', scale: true,},
      //铺市门店数C类商品
      layStoreCntC: {name: 'C类商品单品单店铺市数', point: 0},
      layStoreCntCYoYValue: {name: 'C类商品单品单店铺市数-同期值', point: 0},
      layStoreCntCYoY: {name: 'C类商品单品单店铺市数-同比增幅', scale: true, color: true},
      layStoreCntCPct: {name: 'C类商品单品单店铺市数占比', scale: true},
      layStoreCntCDiff: {name: 'C类单品单店铺市数-子类平均比', scale: true,},
      //铺市门店数合计
      layStoreCntTotal: {name: '单品单店铺市数合计', point: 0},
      layStoreCntTotalYoYValue: {name: '单品单店铺市数合计-同期值', point: 0},
      layStoreCntTotalYoY: {name: '单品单店铺市数合计-同比增幅', scale: true, color: true},
      layStoreCntTotalPct: {name: '单品单店铺市数合计占比', scale: true},
      layStoreCntTotalDiff: {name: '单品单店铺市数合计-子类平均比', scale: true,},
      //到货率
      arrivalRate: {name: '到货率', percent: true},
      arrivalRateYoYValue: {name: '到货率-同期值', percent: true},
      arrivalRateYoYInc: {name: '到货率-同比增长'},
      arrivalRatePct: {name: '到货率占比', scale: true},
      arrivalRateDiff: {name: '到货率-子类平均比', scale: true,},

      //到货率 -- 业态
      arrivalRate0: {name: '整体', rowSpan: true, operation: true, two: 'Pct'},
      arrivalRate1: {name: '一级大卖场', rowSpan: true, operation: true, two: 'Pct'},
      arrivalRate5: {name: '二级大卖场', rowSpan: true, operation: true, two: 'Pct'},
      arrivalRate2: {name: '综超', rowSpan: true, operation: true, two: 'Pct'},
      arrivalRate3: {name: '精超', rowSpan: true, operation: true, two: 'Pct'},
      arrivalRate4: {name: '标超', rowSpan: true, operation: true, two: 'Pct'},
      arrivalRate99: {name: '其他', rowSpan: true, operation: true, two: 'Pct'},
      arrivalRate0Pct: {name: '整体占比', ignore: true},
      arrivalRate1Pct: {name: '大卖场占比', ignore: true},
      arrivalRate2Pct: {name: '综超占比', ignore: true},
      arrivalRate3Pct: {name: '精超占比', ignore: true},
      arrivalRate4Pct: {name: '标超占比', ignore: true},
      arrivalRate99Pct: {name: '其他占比', ignore: true},

      arrivalRateCategoryAvg: {name: '整体-子类平均到货率',},
      //到货率A类商品
      arrivalRateA: {name: '整体-A类商品到货率', percent: true},
      arrivalRateAYoYValue: {name: '整体-A类商品到货率-同期值', percent: true},
      // arrivalRateAYoY: {name: '到货率A类商品-同比增幅', scale: true},
      arrivalRateAYoYInc: {name: '整体-A类商品到货率-同比增长', color: true},
      arrivalRateAPct: {name: '整体-A类商品到货率占比', scale: true},
      arrivalRateADiff: {name: '整体-A类到货率-子类平均比', scale: true,},
      //到货率B类商品
      arrivalRateB: {name: '整体-B类商品到货率', percent: true},
      arrivalRateBYoYValue: {name: '整体-B类商品到货率-同期值', percent: true},
      // arrivalRateBYoY: {name: '到货率B类商品-同比增幅', scale: true},
      arrivalRateBYoYInc: {name: '整体-B类商品到货率-同比增长', color: true},
      arrivalRateBPct: {name: '整体-B类商品到货率占比', scale: true},
      arrivalRateBDiff: {name: '整体-B类到货率-子类平均比', scale: true,},
      //到货率C类商品
      arrivalRateC: {name: '整体-C类商品到货率', percent: true},
      arrivalRateCYoYValue: {name: '整体-C类商品到货率-同期值', percent: true},
      arrivalRateCYoYInc: {name: '整体-C类商品到货率-同比增长', color: true},
      // arrivalRateCYoY: {name: '到货率C类商品-同比增幅', scale: true},
      arrivalRateCPct: {name: '整体-C类商品到货率占比', scale: true},
      arrivalRateCDiff: {name: '整体-C类到货率-子类平均比', scale: true,},
      //到货率合计
      arrivalRateTotal: {name: '整体-到货率', percent: true},
      arrivalRateTotalYoYValue: {name: '整体-到货率-同期值', percent: true},
      // arrivalRateTotalYoY: {name: '到货率合计-同比增幅', scale: true},
      arrivalRateTotalYoYInc: {name: '整体-到货率-同比增长', color: true},
      arrivalRateTotalPct: {name: '整体-到货率占比', scale: true},
      arrivalRateTotalDiff: {name: '整体-到货率-子类平均比', scale: true,},


      //到货率A类商品
      arrivalRate1A: {name: '统配-A类商品到货率', percent: true},
      arrivalRate1AYoYValue: {name: '统配-A类商品到货率-同期值', percent: true},
      // arrivalRateAYoY: {name: '到货率A类商品-同比增幅', scale: true},
      arrivalRate1AYoYInc: {name: '统配-A类商品到货率-同比增长', color: true},
      arrivalRate1APct: {name: '统配-A类商品到货率占比', scale: true},
      arrivalRate1ADiff: {name: '统配-A类到货率-子类平均比', scale: true,},
      arrivalRate1CategoryAvg: {name: '统配-子类平均到货率',},
      //到货率B类商品
      arrivalRate1B: {name: '统配-B类商品到货率', percent: true},
      arrivalRate1BYoYValue: {name: '统配-B类商品到货率-同期值', percent: true},
      // arrivalRateBYoY: {name: '到货率B类商品-同比增幅', scale: true},
      arrivalRate1BYoYInc: {name: '统配-B类商品到货率-同比增长', color: true},
      arrivalRate1BPct: {name: '统配-B类商品到货率占比', scale: true},
      arrivalRate1BDiff: {name: '统配-B类到货率-子类平均比', scale: true,},
      //到货率C类商品
      arrivalRate1C: {name: '统配-C类商品到货率', percent: true},
      arrivalRate1CYoYValue: {name: '统配-C类商品到货率-同期值', percent: true},
      arrivalRate1CYoYInc: {name: '统配-C类商品到货率-同比增长'},
      // arrivalRateCYoY: {name: '到货率C类商品-同比增幅', scale: true},
      arrivalRate1CPct: {name: '统配-C类商品到货率占比', scale: true},
      arrivalRate1CDiff: {name: '统配-C类到货率-子类平均比', scale: true,},
      //到货率合计
      arrivalRate1Total: {name: '统配-到货率', percent: true},
      arrivalRate1TotalYoYValue: {name: '统配-到货率-同期值', percent: true},
      // arrivalRateTotalYoY: {name: '到货率合计-同比增幅', scale: true},
      arrivalRate1TotalYoYInc: {name: '统配-到货率-同比增长', color: true},
      arrivalRate1TotalPct: {name: '统配-到货率占比', scale: true},
      arrivalRate1TotalDiff: {name: '统配-到货率-子类平均比', scale: true,},

      arrivalRate2CategoryAvg: {name: '直配-子类平均到货率',},
      //到货率A类商品
      arrivalRate2A: {name: '直配-A类商品到货率', percent: true},
      arrivalRate2AYoYValue: {name: '直配-A类商品到货率-同期值', percent: true},
      // arrivalRateAYoY: {name: '到货率A类商品-同比增幅', scale: true},
      arrivalRate2AYoYInc: {name: '直配-A类商品到货率-同比增长', color: true},
      arrivalRate2APct: {name: '直配-A类商品到货率占比', scale: true},
      arrivalRate2ADiff: {name: '直配-A类到货率-子类平均比', scale: true,},
      //到货率B类商品
      arrivalRate2B: {name: '直配-B类商品到货率', percent: true},
      arrivalRate2BYoYValue: {name: '直配-B类商品到货率-同期值', percent: true},
      // arrivalRateBYoY: {name: '到货率B类商品-同比增幅', scale: true},
      arrivalRate2BYoYInc: {name: '直配-B类商品到货率-同比增长', color: true},
      arrivalRate2BPct: {name: '直配-B类商品到货率占比', scale: true},
      arrivalRate2BDiff: {name: '直配-B类到货率-子类平均比', scale: true,},
      //到货率C类商品
      arrivalRate2C: {name: '直配-C类商品到货率', percent: true},
      arrivalRate2CYoYValue: {name: '直配-C类商品到货率-同期值', percent: true},
      arrivalRate2CYoYInc: {name: '直配-C类商品到货率-同比增长', color: true},
      // arrivalRateCYoY: {name: '到货率C类商品-同比增幅', scale: true},
      arrivalRate2CPct: {name: '直配-C类商品到货率占比', scale: true},
      arrivalRate2CDiff: {name: '直配-C类到货率-子类平均比', scale: true,},
      //到货率合计
      arrivalRate2Total: {name: '直配-到货率', percent: true},
      arrivalRate2TotalYoYValue: {name: '直配-到货率-同期值', percent: true},
      // arrivalRateTotalYoY: {name: '到货率合计-同比增幅', scale: true},
      arrivalRate2TotalYoYInc: {name: '直配-到货率-同比增长', color: true},
      arrivalRate2TotalPct: {name: '直配-到货率占比', scale: true},
      arrivalRate2TotalDiff: {name: '直配-到货率-子类平均比', scale: true,},

      arrivalRate3CategoryAvg: {name: '直通-子类平均到货率',},
      //到货率A类商品
      arrivalRate3A: {name: '直通-A类商品到货率', percent: true},
      arrivalRate3AYoYValue: {name: '直通-A类商品到货率-同期值', percent: true},
      // arrivalRateAYoY: {name: '到货率A类商品-同比增幅', scale: true},
      arrivalRate3AYoYInc: {name: '直通-A类商品到货率-同比增长', color: true},
      arrivalRate3APct: {name: '直通-A类商品到货率占比', scale: true},
      arrivalRate3ADiff: {name: '直通-A类到货率-子类平均比', scale: true,},
      //到货率B类商品
      arrivalRate3B: {name: '直通-B类商品到货率', percent: true},
      arrivalRate3BYoYValue: {name: '直通-B类商品到货率-同期值', percent: true},
      // arrivalRateBYoY: {name: '到货率B类商品-同比增幅', scale: true},
      arrivalRate3BYoYInc: {name: '直通-B类商品到货率-同比增长', color: true},
      arrivalRate3BPct: {name: '直通-B类商品到货率占比', scale: true},
      arrivalRate3BDiff: {name: '直通-B类到货率-子类平均比', scale: true,},
      //到货率C类商品
      arrivalRate3C: {name: '直通-C类商品到货率', percent: true},
      arrivalRate3CYoYValue: {name: '直通-C类商品到货率-同期值', percent: true},
      arrivalRate3CYoYInc: {name: '直通-C类商品到货率-同比增长', color: true},
      // arrivalRateCYoY: {name: '到货率C类商品-同比增幅', scale: true},
      arrivalRate3CPct: {name: '直通-C类商品到货率占比', scale: true},
      arrivalRate3CDiff: {name: '直通-C类到货率-子类平均比', scale: true,},
      //到货率合计
      arrivalRate3Total: {name: '直通-到货率', percent: true},
      arrivalRate3TotalYoYValue: {name: '直通-到货率-同期值', percent: true},
      // arrivalRateTotalYoY: {name: '到货率合计-同比增幅', scale: true},
      arrivalRate3TotalYoYInc: {name: '直通-到货率-同比增长', color: true},
      arrivalRate3TotalPct: {name: '直通-到货率占比', scale: true},
      arrivalRate3TotalDiff: {name: '直通-到货率-子类平均比', scale: true,},

      arrivalRate4CategoryAvg: {name: '中转-子类平均到货率',},
      //到货率A类商品
      arrivalRate4A: {name: '中转-A类商品到货率', percent: true},
      arrivalRate4AYoYValue: {name: '中转-A类商品到货率-同期值', percent: true},
      // arrivalRateAYoY: {name: '到货率A类商品-同比增幅', scale: true},
      arrivalRate4AYoYInc: {name: '中转-A类商品到货率-同比增长', color: true},
      arrivalRate4APct: {name: '中转-A类商品到货率占比', scale: true},
      arrivalRate4ADiff: {name: '中转-A类到货率-子类平均比', scale: true,},
      //到货率B类商品
      arrivalRate4B: {name: '中转-B类商品到货率', percent: true},
      arrivalRate4BYoYValue: {name: '中转-B类商品到货率-同期值', percent: true},
      // arrivalRateBYoY: {name: '到货率B类商品-同比增幅', scale: true},
      arrivalRate4BYoYInc: {name: '中转-B类商品到货率-同比增长', color: true},
      arrivalRate4BPct: {name: '中转-B类商品到货率占比', scale: true},
      arrivalRate4BDiff: {name: '中转-B类到货率-子类平均比', scale: true,},
      //到货率C类商品
      arrivalRate4C: {name: '中转-C类商品到货率', percent: true},
      arrivalRate4CYoYValue: {name: '中转-C类商品到货率-同期值', percent: true},
      arrivalRate4CYoYInc: {name: '中转-C类商品到货率-同比增长', color: true},
      // arrivalRateCYoY: {name: '到货率C类商品-同比增幅', scale: true},
      arrivalRate4CPct: {name: '中转-C类商品到货率占比', scale: true},
      arrivalRate4CDiff: {name: '中转-C类到货率-子类平均比', scale: true,},
      //到货率合计
      arrivalRate4Total: {name: '中转-到货率', percent: true},
      arrivalRate4TotalYoYValue: {name: '中转-到货率-同期值', percent: true},
      // arrivalRateTotalYoY: {name: '到货率合计-同比增幅', scale: true},
      arrivalRate4TotalYoYInc: {name: '中转-到货率-同比增长', color: true},
      arrivalRate4TotalPct: {name: '中转-到货率占比', scale: true},
      arrivalRate4TotalDiff: {name: '中转-到货率-子类平均比', scale: true,},

      arrivalRate5CategoryAvg: {name: '中转-子类平均到货率',},
      //到货率A类商品
      arrivalRate5A: {name: '中转-A类商品到货率', percent: true},
      arrivalRate5AYoYValue: {name: '中转-A类商品到货率-同期值', percent: true},
      // arrivalRateAYoY: {name: '到货率A类商品-同比增幅', scale: true},
      arrivalRate5AYoYInc: {name: '中转-A类商品到货率-同比增长', color: true},
      arrivalRate5APct: {name: '中转-A类商品到货率占比', scale: true},
      arrivalRate5ADiff: {name: '中转-A类到货率-子类平均比', scale: true,},
      //到货率B类商品
      arrivalRate5B: {name: '中转-B类商品到货率', percent: true},
      arrivalRate5BYoYValue: {name: '中转-B类商品到货率-同期值', percent: true},
      // arrivalRateBYoY: {name: '到货率B类商品-同比增幅', scale: true},
      arrivalRate5BYoYInc: {name: '中转-B类商品到货率-同比增长', color: true},
      arrivalRate5BPct: {name: '中转-B类商品到货率占比', scale: true},
      arrivalRate5BDiff: {name: '中转-B类到货率-子类平均比', scale: true,},
      //到货率C类商品
      arrivalRate5C: {name: '中转-C类商品到货率', percent: true},
      arrivalRate5CYoYValue: {name: '中转-C类商品到货率-同期值', percent: true},
      arrivalRate5CYoYInc: {name: '中转-C类商品到货率-同比增长', color: true},
      // arrivalRateCYoY: {name: '到货率C类商品-同比增幅', scale: true},
      arrivalRate5CPct: {name: '中转-C类商品到货率占比', scale: true},
      arrivalRate5CDiff: {name: '中转-C类到货率-子类平均比', scale: true,},
      //到货率合计
      arrivalRate5Total: {name: '中转-到货率', percent: true},
      arrivalRate5TotalYoYValue: {name: '中转-到货率-同期值', percent: true},
      // arrivalRateTotalYoY: {name: '到货率合计-同比增幅', scale: true},
      arrivalRate5TotalYoYInc: {name: '中转-到货率-同比增长', color: true},
      arrivalRate5TotalPct: {name: '中转-到货率占比', scale: true},
      arrivalRate5TotalDiff: {name: '中转-到货率-子类平均比', scale: true,},

      //退货数量
      retQty: {name: '退货数量'},
      retQtyYoYValue: {name: '退货数量-同期值'},
      retQtyYoY: {name: '退货数量-同比增幅', scale: true, color: true},
      retQtyPct: {name: '退货数量占比', scale: true},
      retQtyDiff: {name: '退货数量-子类平均比', scale: true,},
      retQtyCategoryAvg: {name: '子类平均到货率',},
      //退货数量 -- 业态
      retQty0: {name: '整体', rowSpan: true, operation: true, two: 'Pct'},
      retQty1: {name: '一级大卖场', rowSpan: true, operation: true, two: 'Pct'},
      retQty5: {name: '二级大卖场', rowSpan: true, operation: true, two: 'Pct'},
      retQty2: {name: '综超', rowSpan: true, operation: true, two: 'Pct'},
      retQty3: {name: '精超', rowSpan: true, operation: true, two: 'Pct'},
      retQty4: {name: '标超', rowSpan: true, operation: true, two: 'Pct'},
      retQty99: {name: '其他', rowSpan: true, operation: true, two: 'Pct'},
      retQty0Pct: {name: '整体占比', ignore: true},
      retQty1Pct: {name: '大卖场占比', ignore: true},
      retQty2Pct: {name: '综超占比', ignore: true},
      retQty3Pct: {name: '精超占比', ignore: true},
      retQty4Pct: {name: '标超占比', ignore: true},
      retQty99Pct: {name: '其他占比', ignore: true},

      //退货数量A类商品
      retQtyA: {name: 'A类商品退货数量'},
      retQtyAYoYValue: {name: 'A类商品退货数量-同期值'},
      retQtyAYoY: {name: 'A类商品退货数量-同比增幅', scale: true, color: true},
      retQtyAPct: {name: 'A类商品退货数量占比', scale: true},
      retQtyADiff: {name: 'A类退货数量-子类平均比', scale: true,},
      //退货数量B类商品
      retQtyB: {name: 'B类商品退货数量'},
      retQtyBYoYValue: {name: 'B类商品退货数量-同期值'},
      retQtyBYoY: {name: 'B类商品退货数量-同比增幅', scale: true, color: true},
      retQtyBPct: {name: 'B类商品退货数量占比', scale: true},
      retQtyBDiff: {name: 'B类退货数量-子类平均比', scale: true,},
      //退货数量C类商品
      retQtyC: {name: 'C类商品退货数量'},
      retQtyCYoYValue: {name: '退货数量C类商品-同期值'},
      retQtyCYoY: {name: 'C类商品退货数量-同比增幅', scale: true, color: true},
      retQtyCPct: {name: 'C类商品退货数量占比', scale: true},
      retQtyCDiff: {name: 'C类退货数量-子类平均比', scale: true,},
      //退货数量合计
      retQtyTotal: {name: '退货数量合计'},
      retQtyTotalYoYValue: {name: '退货数量合计-同期值'},
      retQtyTotalYoY: {name: '退货数量合计-同比增幅', scale: true, color: true},
      retQtyTotalPct: {name: '退货数量合计占比', scale: true},
      retQtyTotalDiff: {name: '退货数量合计-子类平均比',},

      //订货数量
      orderQty: {name: '订货数量'},
      orderQtyYoYValue: {name: '订货数量-同期值'},
      orderQtyYoY: {name: '订货数量-同比增幅', scale: true, color: true},
      orderQtyPct: {name: '订货数量占比', scale: true},
      orderQtyDiff: {name: '订货数量-子类平均比', scale: true,},
      orderQtyCategoryAvg: {name: '子类平均到货率',},
      //订货数量 -- 业态
      orderQty0: {name: '整体', rowSpan: true, operation: true, two: 'Pct'},
      orderQty1: {name: '一级大卖场', rowSpan: true, operation: true, two: 'Pct'},
      orderQty5: {name: '二级大卖场', rowSpan: true, operation: true, two: 'Pct'},
      orderQty2: {name: '综超', rowSpan: true, operation: true, two: 'Pct'},
      orderQty3: {name: '精超', rowSpan: true, operation: true, two: 'Pct'},
      orderQty4: {name: '标超', rowSpan: true, operation: true, two: 'Pct'},
      orderQty99: {name: '其他', rowSpan: true, operation: true, two: 'Pct'},
      orderQty0Pct: {name: '整体占比', ignore: true},
      orderQty1Pct: {name: '大卖场占比', ignore: true},
      orderQty2Pct: {name: '综超占比', ignore: true},
      orderQty3Pct: {name: '精超占比', ignore: true},
      orderQty4Pct: {name: '标超占比', ignore: true},
      orderQty99Pct: {name: '其他占比', ignore: true},

      //订货数量A类商品
      orderQtyA: {name: '整体-A类商品订货数量'},
      orderQtyAYoYValue: {name: '整体-A类商品订货数量-同期值'},
      orderQtyAYoY: {name: '整体-A类商品订货数量-同比增幅', scale: true, color: true},
      orderQtyAPct: {name: '整体-A类商品订货数量占比', scale: true},
      orderQtyADiff: {name: '整体-A类订货数量-子类平均比', scale: true,},
      //订货数量B类商品
      orderQtyB: {name: '整体-B类商品订货数量'},
      orderQtyBYoYValue: {name: '整体-B类商品订货数量-同期值'},
      orderQtyBYoY: {name: '整体-B类商品订货数量-同比增幅', scale: true, color: true},
      orderQtyBPct: {name: '整体-B类商品订货数量占比', scale: true},
      orderQtyBDiff: {name: '整体-B类订货数量-子类平均比', scale: true,},
      //订货数量C类商品
      orderQtyC: {name: '整体-C类商品订货数量'},
      orderQtyCYoYValue: {name: '整体-订货数量C类商品-同期值'},
      orderQtyCYoY: {name: '整体-C类商品订货数量-同比增幅', scale: true, color: true},
      orderQtyCPct: {name: '整体-C类商品订货数量占比', scale: true},
      orderQtyCDiff: {name: '整体-C类订货数量-子类平均比', scale: true,},
      //订货数量合计
      orderQtyTotal: {name: '整体-订货数量合计'},
      orderQtyTotalYoYValue: {name: '统配-订货数量合计-同期值'},
      orderQtyTotalYoY: {name: '整体-订货数量合计-同比增幅', scale: true, color: true},
      orderQtyTotalPct: {name: '整体-订货数量合计占比', scale: true},
      orderQtyTotalDiff: {name: '整体-订货数量合计-子类平均比',},
      //订货数量A类商品
      orderQty1A: {name: '统配-A类商品订货数量'},
      orderQty1AYoYValue: {name: '统配-A类商品订货数量-同期值'},
      orderQty1AYoY: {name: '统配-A类商品订货数量-同比增幅', scale: true, color: true},
      orderQty1APct: {name: '统配-A类商品订货数量占比', scale: true},
      orderQty1ADiff: {name: '统配-A类订货数量-子类平均比', scale: true,},
      orderQty1CategoryAvg: {name: '统配-子类平均订货数量',},
      //订货数量B类商品
      orderQty1B: {name: '统配-B类商品订货数量'},
      orderQty1BYoYValue: {name: '统配-B类商品订货数量-同期值'},
      orderQty1BYoY: {name: '统配-B类商品订货数量-同比增幅', scale: true, color: true},
      orderQty1BPct: {name: '统配-B类商品订货数量占比', scale: true},
      orderQty1BDiff: {name: '统配-B类订货数量-子类平均比', scale: true,},
      //订货数量C类商品
      orderQty1C: {name: '统配-C类商品订货数量'},
      orderQty1CYoYValue: {name: '统配-订货数量C类商品-同期值'},
      orderQty1CYoY: {name: '统配-C类商品订货数量-同比增幅', scale: true, color: true},
      orderQty1CPct: {name: '统配-C类商品订货数量占比', scale: true},
      orderQty1CDiff: {name: '统配-C类订货数量-子类平均比', scale: true,},
      //订货数量合计
      orderQty1Total: {name: '统配-订货数量合计'},
      orderQty1TotalYoYValue: {name: '统配-订货数量合计-同期值'},
      orderQty1TotalYoY: {name: '统配-订货数量合计-同比增幅', scale: true, color: true},
      orderQty1TotalPct: {name: '统配-订货数量合计占比', scale: true},
      orderQty1TotalDiff: {name: '统配-订货数量合计-子类平均比',},

      //订货数量A类商品
      orderQty2A: {name: '直配-A类商品订货数量'},
      orderQty2AYoYValue: {name: '直配-A类商品订货数量-同期值'},
      orderQty2AYoY: {name: '直配-A类商品订货数量-同比增幅', scale: true, color: true},
      orderQty2APct: {name: '直配-A类商品订货数量占比', scale: true},
      orderQty2ADiff: {name: '直配-A类订货数量-子类平均比', scale: true,},
      orderQty2CategoryAvg: {name: '直配-子类平均订货数量',},
      //订货数量B类商品
      orderQty2B: {name: '直配-B类商品订货数量'},
      orderQty2BYoYValue: {name: '直配-B类商品订货数量-同期值'},
      orderQty2BYoY: {name: '直配-B类商品订货数量-同比增幅', scale: true, color: true},
      orderQty2BPct: {name: '直配-B类商品订货数量占比', scale: true},
      orderQty2BDiff: {name: '直配-B类订货数量-子类平均比', scale: true,},
      //订货数量C类商品
      orderQty2C: {name: '直配-C类商品订货数量'},
      orderQty2CYoYValue: {name: '直配-订货数量C类商品-同期值'},
      orderQty2CYoY: {name: '直配-C类商品订货数量-同比增幅', scale: true, color: true},
      orderQty2CPct: {name: '直配-C类商品订货数量占比', scale: true},
      orderQty2CDiff: {name: '直配-C类订货数量-子类平均比', scale: true,},
      //订货数量合计
      orderQty2Total: {name: '直配-订货数量合计'},
      orderQty2TotalYoYValue: {name: '直配-订货数量合计-同期值'},
      orderQty2TotalYoY: {name: '直配-订货数量合计-同比增幅', scale: true, color: true},
      orderQty2TotalPct: {name: '直配-订货数量合计占比', scale: true},
      orderQty2TotalDiff: {name: '直配-订货数量合计-子类平均比',},


      //订货数量A类商品
      orderQty3A: {name: '直通-A类商品订货数量'},
      orderQty3AYoYValue: {name: '直通-A类商品订货数量-同期值'},
      orderQty3AYoY: {name: '直通-A类商品订货数量-同比增幅', scale: true, color: true},
      orderQty3APct: {name: '直通-A类商品订货数量占比', scale: true},
      orderQty3ADiff: {name: '直通-A类订货数量-子类平均比', scale: true,},
      orderQty3CategoryAvg: {name: '直通-子类平均订货数量',},
      //订货数量B类商品
      orderQty3B: {name: '直通-B类商品订货数量'},
      orderQty3BYoYValue: {name: '直通-B类商品订货数量-同期值'},
      orderQty3BYoY: {name: '直通-B类商品订货数量-同比增幅', scale: true, color: true},
      orderQty3BPct: {name: '直通-B类商品订货数量占比', scale: true},
      orderQty3BDiff: {name: '直通-B类订货数量-子类平均比', scale: true,},
      //订货数量C类商品
      orderQty3C: {name: '直通-C类商品订货数量'},
      orderQty3CYoYValue: {name: '直通-订货数量C类商品-同期值'},
      orderQty3CYoY: {name: '直通-C类商品订货数量-同比增幅', scale: true, color: true},
      orderQty3CPct: {name: '直通-C类商品订货数量占比', scale: true},
      orderQty3CDiff: {name: '直通-C类订货数量-子类平均比', scale: true,},
      //订货数量合计
      orderQty3Total: {name: '直通-订货数量合计'},
      orderQty3TotalYoYValue: {name: '直通-订货数量合计-同期值'},
      orderQty3TotalYoY: {name: '直通-订货数量合计-同比增幅', scale: true, color: true},
      orderQty3TotalPct: {name: '直通-订货数量合计占比', scale: true},
      orderQty3TotalDiff: {name: '直通-订货数量合计-子类平均比',},


      orderQty4A: {name: '中转-A类商品订货数量'},
      orderQty4AYoYValue: {name: '中转-A类商品订货数量-同期值'},
      orderQty4AYoY: {name: '中转-A类商品订货数量-同比增幅', scale: true, color: true},
      orderQty4APct: {name: '中转-A类商品订货数量占比', scale: true},
      orderQty4ADiff: {name: '中转-A类订货数量-子类平均比', scale: true,},
      orderQty4CategoryAvg: {name: '中转-子类平均订货数量',},
      //订货数量B类商品
      orderQty4B: {name: '中转-B类商品订货数量'},
      orderQty4BYoYValue: {name: '中转-B类商品订货数量-同期值'},
      orderQty4BYoY: {name: '中转-B类商品订货数量-同比增幅', scale: true, color: true},
      orderQty4BPct: {name: '中转-B类商品订货数量占比', scale: true},
      orderQty4BDiff: {name: '中转-B类订货数量-子类平均比', scale: true,},
      //订货数量C类商品
      orderQty4C: {name: '中转-C类商品订货数量'},
      orderQty4CYoYValue: {name: '中转-订货数量C类商品-同期值'},
      orderQty4CYoY: {name: '中转-C类商品订货数量-同比增幅', scale: true, color: true},
      orderQty4CPct: {name: '中转-C类商品订货数量占比', scale: true},
      orderQty4CDiff: {name: '中转-C类订货数量-子类平均比', scale: true,},
      //订货数量合计
      orderQty4Total: {name: '中转-订货数量合计'},
      orderQty4TotalYoYValue: {name: '中转-订货数量合计-同期值'},
      orderQty4TotalYoY: {name: '中转-订货数量合计-同比增幅', scale: true, color: true},
      orderQty4TotalPct: {name: '中转-订货数量合计占比', scale: true},
      orderQty4TotalDiff: {name: '中转-订货数量合计-子类平均比',},

      orderQty5A: {name: '中转-A类商品订货数量'},
      orderQty5AYoYValue: {name: '中转-A类商品订货数量-同期值'},
      orderQty5AYoY: {name: '中转-A类商品订货数量-同比增幅', scale: true, color: true},
      orderQty5APct: {name: '中转-A类商品订货数量占比', scale: true},
      orderQty5ADiff: {name: '中转-A类订货数量-子类平均比', scale: true,},
      orderQty5CategoryAvg: {name: '中转-子类平均订货数量',},
      //订货数量B类商品
      orderQty5B: {name: '中转-B类商品订货数量'},
      orderQty5BYoYValue: {name: '中转-B类商品订货数量-同期值'},
      orderQty5BYoY: {name: '中转-B类商品订货数量-同比增幅', scale: true, color: true},
      orderQty5BPct: {name: '中转-B类商品订货数量占比', scale: true},
      orderQty5BDiff: {name: '中转-B类订货数量-子类平均比', scale: true,},
      //订货数量C类商品
      orderQty5C: {name: '中转-C类商品订货数量'},
      orderQty5CYoYValue: {name: '中转-订货数量C类商品-同期值'},
      orderQty5CYoY: {name: '中转-C类商品订货数量-同比增幅', scale: true, color: true},
      orderQty5CPct: {name: '中转-C类商品订货数量占比', scale: true},
      orderQty5CDiff: {name: '中转-C类订货数量-子类平均比', scale: true,},
      //订货数量合计
      orderQty5Total: {name: '中转-订货数量合计'},
      orderQty5TotalYoYValue: {name: '中转-订货数量合计-同期值'},
      orderQty5TotalYoY: {name: '中转-订货数量合计-同比增幅', scale: true, color: true},
      orderQty5TotalPct: {name: '中转-订货数量合计占比', scale: true},
      orderQty5TotalDiff: {name: '中转-订货数量合计-子类平均比',},
    },
    Store: {
      // 销售额
      allAmount: {name: '销售额', sale: true, message: true, text_one: true},
      compareAllAmount: {name: '销售额', sale: true, message: true, text_two: true},
      distributionAmount: {name: '经销-销售额', sale: true, message: true, text_one: true},
      compareDistributionAmount: {name: '经销-销售额', sale: true, message: true, text_two: true},
      jointAmount: {name: '联营-销售额', sale: true, message: true, text_one: true},
      compareJointAmount: {name: '联营-销售额', sale: true, message: true, text_two: true},
      retailAmount: {name: '零售-销售额', sale: true, message: true, text_one: true},
      compareRetailAmount: {name: '零售-销售额', sale: true, message: true, text_two: true},
      wholeAmount: {name: '批发-销售额', sale: true, message: true, text_one: true},
      compareWholeAmount: {name: '批发-销售额', sale: true, message: true, text_two: true},
      allAmountYoY: {name: '销售额-同比增幅', scale: true, color: true, message: true, text_one: true},
      compareAllAmountYoY: {name: '销售额-同比增幅', scale: true, color: true, message: true, text_two: true},

      //销售数
      allUnit: {name: '销售数', message: true, text_one: true},
      compareAllUnit: {name: '销售数', message: true, text_two: true},
      allUnitYoY: {name: '销售数-同比增幅', scale: true, color: true, message: true, text_one: true},
      compareAllUnitYoY: {name: '销售数-同比增幅', scale: true, color: true, message: true, text_two: true},
      retailFlowAmount: {name: '零售客单价', unit: '元', message: true, text_one: true},
      compareRetailFlowAmount: {name: '零售客单价', unit: '元', message: true, text_two: true},
      flowCnt: {name: '客单数', point: 0, message: true, text_one: true},
      compareFlowCnt: {name: '客单数', point: 0, message: true, text_two: true},
      /*useSizeAllAmount: {name: '单位使用面积销售额', sale: true, message:true, text_one: true},
      compareUseSizeAllAmount: {name: '单位使用面积销售额', sale: true, message:true, text_two: true},*/
      operateSizeAllAmount: {name: '单位经营面积销售额', message: true, text_one: true, cut: true},
      compareOperateSizeAllAmount: {name: '单位经营面积销售额', message: true, text_two: true, cut: true},
      // 毛利额
      allProfit: {name: '毛利额', sale: true, message: true, text_one: true},
      compareAllProfit: {name: '毛利额', sale: true, message: true, text_two: true},
      distributionProfit: {name: '经销-毛利额', sale: true, message: true, text_one: true},
      compareDistributionProfit: {name: '经销-毛利额', sale: true, message: true, text_two: true},
      jointProfit: {name: '联营-毛利额', sale: true, message: true, text_one: true},
      compareJointProfit: {name: '联营-毛利额', sale: true, message: true, text_two: true},
      retailProfit: {name: '零售-毛利额', sale: true, message: true, text_one: true},
      compareRetailProfit: {name: '零售-毛利额', sale: true, message: true, text_two: true},
      wholeProfit: {name: '批发-毛利额', sale: true, message: true, text_one: true},
      compareWholeProfit: {name: '批发-毛利额', sale: true, message: true, text_two: true},
      allProfitYoY: {name: '毛利额-同比增幅', scale: true, color: true, message: true, text_one: true},
      compareAllProfitYoY: {name: '毛利额-同比增幅', scale: true, color: true, message: true, text_two: true},
      allProfitRate: {name: '毛利率', scale: true, message: true, text_one: true, icon: 'allProfitRate'},
      compareAllProfitRate: {name: '毛利率', scale: true, message: true, text_two: true},
      distributionProfitRate: {name: '经销-毛利率', scale: true, message: true, text_one: true},
      compareDistributionProfitRate: {name: '经销-毛利率', scale: true, message: true, text_two: true},
      jointProfitRate: {name: '联营-毛利率', scale: true, message: true, text_one: true},
      compareJointProfitRate: {name: '联营-毛利率', scale: true, message: true, text_two: true},
      retailProfitRate: {name: '零售-毛利率', scale: true, message: true, text_one: true},
      compareRetailProfitRate: {name: '零售-毛利率', scale: true, message: true, text_two: true},
      wholeProfitRate: {name: '批发-毛利率', scale: true, message: true, text_one: true},
      compareWholeProfitRate: {name: '批发-毛利率', scale: true, message: true, text_two: true},
      allProfitRateYoYInc: {name: '毛利率-同比增长', inc: 2, color: true, message: true, text_one: true},
      compareAllProfitRateYoYInc: {name: '毛利率-同比增长', inc: 2, color: true, message: true, text_two: true},
      saleSkuCount: {name: '有售SKU数', message: true, text_one: true},
      compareSaleSkuCount: {name: '有售SKU数', message: true, text_two: true},
      stockCost: {name: '日均库存金额', sale: true, message: true, text_one: true},
      compareStockCost: {name: '日均库存金额', sale: true, message: true, text_two: true},

      saleDays: {name: '经销周转天数', message: true, text_one: true, icon: "saleDays"},
      compareSaleDays: {name: '经销周转天数', message: true, text_two: true},
      allRealDiffProfitTotal: {name: '销售补差', sale: true, message: true, text_one: true},
      compareAllRealDiffProfitTotal: {name: '销售补差', sale: true, message: true, text_two: true},
      adjustCostTotal: {name: '成本调整', sale: true, message: true, text_one: true},
      compareAdjustCostTotal: {name: '成本调整', sale: true, message: true, text_two: true},
      allRealFreshProfit: {name: '生鲜加价(收货)', sale: true, message: true, text_one: true},
      compareAllRealFreshProfit: {name: '生鲜加价(收货)', sale: true, message: true, text_two: true},
      // operateSizeAllAmount: {},
    },
    actParams: {
      sunnyDays: {name: '累计晴天天数',},
      sunnyDaysYoYValue: {name: '累计晴天天数（对比日期）'},
      rainDays: {name: '累计雨天天数'},
      rainDaysYoYValue: {name: '累计雨天天数（对比日期）'},
      weekendDays: {name: '累计周末天数'},
      weekendDaysYoYValue: {name: '累计周末天数（对比日期）'},
      firstDateStockCost: {name: '', sale: true},
      firstDateStockCostYoYValue: {name: '', sale: true},
      lastDateStockCost: {name: '', sale: true},
      lastDateStockCostYoYValue: {name: '', sale: true}
    },
    activityDate: {
      dateCode: {name: '活动日期'},
      dateCodeY: {name: '对比日期'},
      weatherInfo: {name: "杭州天气"}
    },
    actAnalyze: {
      // 销售额
      allAmountYoYValue: {name: '销售额(对比日期)', sale: true},
      distributionAmountYoYValue: {name: '经销-销售额(对比日期)', sale: true},
      jointAmountYoYValue: {name: '联营-销售额(对比日期)', sale: true},
      retailAmountYoYValue: {name: '零售-销售额(对比日期)', sale: true},
      wholeAmountYoYValue: {name: '批发-销售额(对比日期)', sale: true},

      allAmountYoY: {name: '销售额-对比增幅', scale: true, color: true},
      allAmountToT: {name: '销售额-对比增幅', scale: true, color: true},
      distributionAmountYoY: {name: '经销-销售额-对比增幅', scale: true, color: true},
      distributionAmountToT: {name: '经销-销售额-对比增幅', scale: true, color: true},
      jointAmountYoY: {name: '联营-销售额-对比增幅', scale: true, color: true},
      jointAmountToT: {name: '联营-销售额-对比增幅', scale: true, color: true},

      retailAmountYoY: {name: '零售-销售额-对比增幅', scale: true, color: true},
      retailAmountToT: {name: '零售-销售额-对比增幅', scale: true, color: true},

      wholeAmountYoY: {name: '批发-销售额-对比增幅', scale: true, color: true},
      wholeAmountToT: {name: '批发-销售额-对比增幅', scale: true, color: true},

      // 销售数-对比
      allUnitYoYValue: {name: '销售数(对比日期)'},
      distributionUnitYoYValue: {name: '经销-销售数(对比日期)'},
      jointUnitYoYValue: {name: '联营-销售数(对比日期)'},
      retailUnitYoYValue: {name: '零售-销售数(对比日期)'},
      wholeUnitYoYValue: {name: '批发-销售数(对比日期)'},

      allUnitYoY: {name: '销售数-对比增幅', scale: true, color: true},
      allUnitToT: {name: '销售数-对比增幅', scale: true, color: true},
      distributionUnitYoY: {name: '经销-销售数-对比增幅', scale: true, color: true},
      distributionUnitToT: {name: '经销-销售数-对比增幅', scale: true, color: true},
      jointUnitYoY: {name: '联营-销售数-对比增幅', scale: true, color: true},
      jointUnitToT: {name: '联营-销售数-对比增幅', scale: true, color: true},
      retailUnitYoY: {name: '零售-销售数-对比增幅', scale: true, color: true},
      retailUnitToT: {name: '零售-销售数-对比增幅', scale: true, color: true},
      wholeUnitYoY: {name: '批发-销售数-对比增幅', scale: true, color: true},
      wholeUnitToT: {name: '批发-销售数-对比增幅', scale: true, color: true},

      // 销售成本
      allCostYoYValue: {name: '销售成本(对比日期)', sale: true},
      distributionCostYoYValue: {name: '经销-销售成本(对比日期)', sale: true},
      jointCostYoYValue: {name: '联营-销售成本(对比日期)', sale: true},
      retailCostYoYValue: {name: '零售-销售成本(对比日期)', sale: true},
      wholeCostYoYValue: {name: '批发-销售成本(对比日期)', sale: true},

      allCostYoY: {name: '销售成本-对比增幅', scale: true, color: true},
      allCostToT: {name: '销售成本-对比增幅', scale: true, color: true},
      distributionCostYoY: {name: '经销-销售成本-对比增幅', scale: true, color: true},
      distributionCostToT: {name: '经销-销售成本-对比增幅', scale: true, color: true},
      jointCostYoY: {name: '联营-销售成本-对比增幅', scale: true, color: true},
      jointCostToT: {name: '联营-销售成本-对比增幅', scale: true, color: true},
      retailCostYoY: {name: '零售-销售成本-对比增幅', scale: true, color: true},
      retailCostToT: {name: '零售-销售成本-对比增幅', scale: true, color: true},
      wholeCostYoY: {name: '批发-销售成本-对比增幅', scale: true, color: true},
      wholeCostToT: {name: '批发-销售成本-对比增幅', scale: true, color: true},

      // 销售单价
      allUnitPriceYoYValue: {name: '平均销售单价(对比日期)(元)'},
      distributionUnitPriceYoYValue: {name: '经销-平均销售单价(对比日期)(元)'},
      jointUnitPriceYoYValue: {name: '联营-平均销售单价(对比日期)(元)'},
      retailUnitPriceYoYValue: {name: '零售-平均销售单价(对比日期)(元)'},
      wholeUnitPriceYoYValue: {name: '批发-平均销售单价(对比日期)(元)'},

      allUnitPriceYoY: {name: '平均销售单价-对比增幅', scale: true, color: true},
      allUnitPriceToT: {name: '平均销售单价-对比增幅', scale: true, color: true},
      distributionUnitPriceYoY: {name: '经销-平均销售单价-对比增幅', scale: true, color: true},
      distributionUnitPriceToT: {name: '经销-平均销售单价-对比增幅', scale: true, color: true},
      jointUnitPriceYoY: {name: '联营-平均销售单价-对比增幅', scale: true, color: true},
      jointUnitPriceToT: {name: '联营-平均销售单价-对比增幅', scale: true, color: true},
      retailUnitPriceYoY: {name: '零售-平均销售单价-对比增幅', scale: true, color: true},
      retailUnitPriceToT: {name: '零售-平均销售单价-对比增幅', scale: true, color: true},
      wholeUnitPriceYoY: {name: '批发-平均销售单价-对比增幅', scale: true, color: true},
      wholeUnitPriceToT: {name: '批发-平均销售单价-对比增幅', scale: true, color: true},

      // 毛利额
      allProfitYoYValue: {name: '毛利额(对比日期)', sale: true},
      distributionProfitYoYValue: {name: '经销-毛利额(对比日期)', sale: true},
      jointProfitYoYValue: {name: '联营-毛利额(对比日期)', sale: true},
      retailProfitYoYValue: {name: '零售-毛利额(对比日期)', sale: true},
      wholeProfitYoYValue: {name: '批发-毛利额(对比日期)', sale: true},


      allProfitYoY: {name: '毛利额-对比增幅', scale: true, color: true},
      allProfitToT: {name: '毛利额-对比增幅', scale: true, color: true},
      distributionProfitYoY: {name: '经销-毛利额-对比增幅', scale: true, color: true},
      distributionProfitToT: {name: '经销-毛利额-对比增幅', scale: true, color: true},
      jointProfitYoY: {name: '联营-毛利额-对比增幅', scale: true, color: true},
      jointProfitToT: {name: '联营-毛利额-对比增幅', scale: true, color: true},
      retailProfitYoY: {name: '零售-毛利额-对比增幅', scale: true, color: true},
      retailProfitToT: {name: '零售-毛利额-对比增幅', scale: true, color: true},
      wholeProfitYoY: {name: '批发-毛利额-对比增幅', scale: true, color: true},
      wholeProfitToT: {name: '批发-毛利额-对比增幅', scale: true, color: true},

      // 毛利率
      allProfitRateYoYValue: {name: '毛利率(对比日期)', scale: true},
      distributionProfitRateYoYValue: {name: '经销-毛利率(对比日期)', scale: true},
      jointProfitRateYoYValue: {name: '联营-毛利率(对比日期)', scale: true},
      retailProfitRateYoYValue: {name: '零售-毛利率(对比日期)', scale: true},
      wholeProfitRateYoYValue: {name: '批发-毛利率(对比日期)', scale: true},

      allProfitRateYoYInc: {name: '毛利率-对比增长', inc: 2, color: true},
      allProfitRateToTInc: {name: '毛利率-对比增长', inc: 2, color: true},
      distributionProfitRateYoYInc: {name: '经销-毛利率-对比增长', inc: 2, color: true},
      distributionProfitRateToTInc: {name: '经销-毛利率-对比增长', inc: 2, color: true},
      jointProfitRateYoYInc: {name: '联营-毛利率-对比增长', inc: 2, color: true},
      jointProfitRateToTInc: {name: '联营-毛利率-对比增长', inc: 2, color: true},
      retailProfitRateYoYInc: {name: '零售-毛利率-对比增长', inc: 2, color: true},
      retailProfitRateToTInc: {name: '零售-毛利率-对比增长', inc: 2, color: true},
      wholeProfitRateYoYInc: {name: '批发-毛利率-对比增长', inc: 2, color: true},
      wholeProfitRateToTInc: {name: '批发-毛利率-对比增长', inc: 2, color: true},

      // 日均库存金额
      stockCostYoYValue: {name: '日均库存金额(对比日期)', sale: true},
      stockCostYoY: {name: '日均库存金额-对比增幅', scale: true, color: true},
      stockCostToT: {name: '日均库存金额-对比增幅', scale: true, color: true},

      buyoutStockCostYoYValue: {name: '日均库存金额(买断)(对比日期)', sale: true},
      // buyoutStockCostYoY: {name: '日均库存金额(买断)-对比增幅', scale: true, color: true},
      buyoutStockCostToT: {name: '日均库存金额(买断)-对比增幅', scale: true, color: true},

      // 日均库存数
      stockQtyYoYValue: {name: '日均库存数(对比日期)'},
      stockQtyYoY: {name: '日均库存数-对比增幅', scale: true, color: true},
      stockQtyToT: {name: '日均库存数-对比增幅', scale: true, color: true},

      buyoutStockQtyYoYValue: {name: '日均库存数(买断)(对比日期)'},
      // buyoutStockQtyYoY: {name: '日均库存数(买断)-对比增幅', scale: true, color: true},
      buyoutStockQtyToT: {name: '日均库存数(买断)-对比增幅', scale: true, color: true},

      // 经销周转天数
      saleDaysYoYValue: {name: '经销周转天数(对比日期)'},
      saleDaysYoYInc: {name: '经销周转天数-对比增长', inc: 1, color: true},
      saleDaysToTInc: {name: '经销周转天数-对比增长', inc: 1, color: true},

      buyoutSaleDaysYoYValue: {name: '经销周转天数(买断)(对比日期)'},
      // buyoutSaleDaysYoYInc: {name: '经销周转天数(买断)-对比增幅', inc: 1, color: true},
      buyoutSaleDaysToTInc: {name: '经销周转天数(买断)-对比增幅', inc: 1, color: true},

      // 客单数
      flowCntYoYValue: {name: '客单数(对比日期)', point: 0, time: true},
      flowCntYoY: {name: '客单数-对比增幅', scale: true, color: true},
      flowCntToT: {name: '客单数-对比增幅', scale: true, color: true},

      // 零售客单价
      retailFlowAmountYoYValue: {name: '零售客单价(对比日期)', unit: '元'},
      retailFlowAmountYoY: {name: '零售客单价-对比增幅', scale: true, color: true},
      retailFlowAmountToT: {name: '零售客单价-对比增幅', scale: true, color: true},

      // 客流渗透率
      flowCntProportionYoYValue: {name: '客流渗透率(对比日期)', scale: true},
      flowCntProportionYoY: {name: '客流渗透率-对比增长', inc: 2, color: true},
      flowCntProportionToT: {name: '客流渗透率-对比增长', inc: 2, color: true},
    },

    structure: {
      supplierCnt: {name: '异常供应商数', point: 0, fixWidth: 140},
      hsAmountPct: {name: '占比华商小类', icon: 'hsAmountPct', scale: 1, sale: 0, fixWidth: 140},
      pctDiff: {name: '占比差', icon: 'pctDiff', scale: 1, sale: 0, fixWidth: 140},
      selfAmountPct: {name: '占比供应商自己', icon: 'selfAmountPct', scale: 1, sale: 0, fixWidth: 140},
      hsAmount: {name: '华商类别销售额', sale: true},
      supplierSubAmount: {name: '供应商小类销售额', sale: true},
      supplierAllAmount: {name: '供应商整体销售额', sale: true},
    },

    // 新品状态
    newSate: {
      haveImportNoOrderInfo: {
        name:'建档后至今未产生首订天数',
        nState: true,
        slice_one: 5,
        slice_two: 10,
        fixWidth: 133,
      },
      haveImportNoOrderValue: {
        name:'建档后至今未产生首订新品数',
        point: 0,
        usual:true,
        rowClick: true,
        linkClick: 0,
        addValue: true,
        slice_one: 5,
        slice_two: 10,
        fixWidth: 128,
      },
      haveOrderNoDistributionInfo: {
        name:'首订后至今未产生首到天数',
        nState: true,
        slice_one: 5,
        slice_two: 10,
        fixWidth: 133,
      },
      haveOrderNoDistributionValue: {
        name:'首订后至今未产生首到新品数',
        point: 0,
        usual:true,
        rowClick:true,
        linkClick: 1,
        fixWidth: 128,
        addValue: true,
        slice_one: 5,
        slice_two: 10,
      },
      haveDistributionNoSaleInfo: {
        name:'首到后至今未产生首销天数',
        nState: true,
        slice_one: 5,
        slice_two: 10,
        fixWidth: 133,
      },
      haveDistributionNoSaleValue:{
        name:'首到后至今未产生首销新品数(涉及门店数)',
        point: 0,
        rowClick:true,
        addValue: 'haveDistributionNoSaleStoreCnt',
        fixWidth: 155,
        linkClick: 2,
        slice_one: 5,
        slice_two: 10,
      },
      haveSaleNoSupplementInfo: {
        name:'首销后至今未产生首补天数',
        nState: true,
        fixWidth: 133,
        slice_one: 5,
        slice_two: 10,
      },
      haveSaleNoSupplementValue: {
        name:'首销后至今未产生首补新品数(涉及门店数)',
        point: 0,
        rowClick:true,
        addValue: 'haveSaleNoSupplementStoreCnt',
        fixWidth: 155,
        linkClick: 3,
        slice_one: 5,
        slice_two: 10,
      },
      normalSku: {name:'转为正常品SKU数',  point: 0, rowClick:true, ownState: {normalSku: 1}, fixWidth: 133},
      eliminateSku: {name:'已淘汰SKU数', point: 0, rowClick:true, ownState: {eliminateSku: 2}, fixWidth: 133},
      eliminateRate: {name:'淘汰率', scale: true, fixWidth: 133},
    },

    // 价格带指标
    brandStructure: {
      // 经销销售额
      distributionAmount: {name: '销售额', sale: true },
      distributionAmountYoY: {name: '销售额-同比增幅', scale: true, color: true},
      distributionAmountPct: {name: '销售额-占比', scale: true,},
      distributionAmountToT: {name: '销售额-环比增幅', scale: true, color: true},
      distributionAmountToTValue: {name: '销售额-环期值', sale: true },
      distributionAmountYoYValue: {name: '销售额-同期值', sale: true },

      // 经销-零售-销售额
      distributionRetailAmount: {name: '零售-销售额', sale: true},
      distributionRetailAmountYoY: {name: '零售-销售额-同比增幅', scale: true, color: true},
      distributionRetailAmountPct: {name: '零售-销售额-占比', scale: true},
      distributionRetailAmountYoYValue: {name: '零售-销售额-同期值', sale: true},
      distributionRetailAmountToTValue: {name: '零售-销售额-环期值', sale: true},

      // 经销-批发额
      distributionWholeAmount: {name: '批发-销售额', sale: true},
      distributionWholeAmountYoY: {name: '批发-销售额-同比增幅', scale: true, color: true},
      distributionWholeAmountPct: {name: '批发-销售额-占比', scale: true},
      distributionWholeAmountYoYValue: {name: '批发-销售额-同期值', sale: true },
      distributionWholeAmountToTValue: {name: '批发-销售额-环期值', sale: true },

      // 经销-销售数
      distributionUnit: {name: '销售数'},
      distributionUnitToTValue: {name: '销售数-环期值'},
      distributionUnitYoYValue: {name: '销售数-同期值'},
      distributionUnitYoY: {name: '销售数-同比增幅', scale: true, color: true},
      distributionUnitPct: {name: '销售数-占比', scale: true},
      distributionUnitToT: {name: '销售数-环比增幅', scale: true, color: true},

      // 经销-零售-销售数
      distributionRetailUnit: {name: '零售-销售数'},
      distributionRetailUnitYoYValue: {name: '零售-销售数-同期值'},
      distributionRetailUnitYoY: {name: '零售-销售数-同比增幅', scale: true, color: true},
      distributionRetailUnitToTValue: {name: '零售-销售数-环期值'},
      distributionRetailUnitPct: {name: '零售-销售数-占比', scale: true},

      // 经销-批发-销售数
      distributionWholeUnit: {name: '批发-销售数'},
      distributionWholeUnitYoYValue: {name: '批发-销售数-同期值'},
      distributionWholeUnitYoY: {name: '批发-销售数-同比增幅', scale: true, color: true},
      distributionWholeUnitToTValue: {name: '批发-销售数-环期值'},
      distributionWholeUnitPct: {name: '批发-销售数-占比', scale: true},

      // 可售-经销-SKU数
      distributionCanSaleSku: {name: '可售SKU数', point: 0},
      distributionCanSaleSkuYoYValue: {name: '可售SKU数-同期值', point: 0},
      distributionCanSaleSkuYoY: {name: '可售SKU数-同比增幅', scale: true, color: true},
      distributionCanSaleSkuToT: {name: '可售SKU数-环比增幅', scale: true, color: true},
      distributionCanSaleSkuToTValue: {name: '可售SKU数-环期值', point: 0},
      distributionCanSaleSkuPct: {name: '可售SKU数-占比', scale: true},

      // 可售-经销-零售SKU数
      distributionRetailCanSaleSku: {name: '零售-可售SKU数', point: 0},
      distributionRetailCanSaleSkuYoYValue: {name: '零售-可售SKU数-同期值' },
      distributionRetailCanSaleSkuYoY: {name: '零售-可售SKU数-同比增幅', scale: true, color: true},
      distributionRetailCanSaleSkuToTValue: {name: '零售-可售SKU数-环期值', point: 0},
      distributionRetailCanSaleSkuToT: {name: '零售-可售SKU数-环比增幅', scale: true, color: true},
      distributionRetailCanSaleSkuPct: {name: '零售-可售SKU数-占比', scale: true},

      // 可售-经销-批发SKU数
      distributionWholeCanSaleSku: {name: '批发-可售SKU数'},
      distributionWholeCanSaleSkuYoYValue: {name: '批发-可售SKU数-同期值' },
      distributionWholeCanSaleSkuYoY: {name: '批发-可售SKU数-同比增幅', scale: true, color: true},
      distributionWholeCanSaleSkuToT: {name: '批发-可售SKU数-环比增幅', scale: true, color: true},
      distributionWholeCanSaleSkuToTValue: {name: '批发-可售SKU数-环期值', point: 0},
      distributionWholeCanSaleSkuPct: {name: '批发-可售SKU数-占比', scale: true},

      // 有售-经销SKU数
      distributionSku: {name: '有售SKU数', point: 0 },
      distributionSkuYoYValue: {name: '有售SKU数-同期值', point: 0},
      distributionSkuYoY: {name: '有售SKU数-同比增幅', scale: true, color: true},
      distributionSkuToT: {name: '有售SKU数-环比增幅', scale: true, color: true},
      distributionSkuToTValue: {name: '有售SKU数-环期值', point: 0},
      distributionSkuPct: {name: '有售SKU数-占比', scale: true},

      // 有售-经销-零售SKU数
      distributionRetailSku: {name: '零售-有售SKU数', point: 0},
      distributionRetailSkuYoYValue: {name: '零售-有售SKU数-同期值', point: 0},
      distributionRetailSkuYoY: {name: '零售-有售SKU数-同比增幅', scale: true, color: true},
      distributionRetailSkuToT: {name: '零售-有售SKU数-环比增幅', scale: true, color: true},
      distributionRetailSkuToTValue: {name: '零售-有售SKU数-环期值', point: 0},
      distributionRetailSkuPct: {name: '零售-有售SKU数-占比', scale: true},

      // 有售-经销-批发SKU数
      distributionWholeSku: {name: '批发-有售SKU数', point: 0},
      distributionWholeSkuYoYValue: {name: '批发-有售SKU数-同期值', point: 0},
      distributionWholeSkuYoY: {name: '批发-有售SKU数-同比增幅', scale: true, color: true},
      distributionWholeSkuToT: {name: '批发-有售SKU数-环比增幅', scale: true, color: true},
      distributionWholeSkuToTValue: {name: '批发-有售SKU数-环期值', point: 0},
      distributionWholeSkuPct: {name: '批发-有售SKU数-占比', scale: true},

      // 总经销-毛利额
      distributionBusinessProfit: {name: '毛利额', sale: true},
      distributionBusinessProfitYoYValue: {name: '毛利额-同期值', sale: true},
      distributionBusinessProfitYoY: {name: '毛利额-同比增幅', scale: true, color: true},
      distributionBusinessProfitToT: {name: '毛利额-环比增幅', scale: true, color: true},
      distributionBusinessProfitToTValue: {name: '毛利额-环期值', sale: true},
      distributionBusinessProfitPct: {name: '毛利额-占比', scale: true},

      // 总经销-零售-毛利额
      distributionRetailBusinessProfit: {name: '零售-毛利额', sale: true},
      distributionRetailBusinessProfitYoYValue: {name: '零售-毛利额-同期值', sale: true},
      distributionRetailBusinessProfitYoY: {name: '零售-毛利额-同比增幅', scale: true, color: true},
      distributionRetailBusinessProfitToTValue: {name: '零售-毛利额-环期值', sale: true},
      distributionRetailBusinessProfitPct: {name: '零售-毛利额-占比', scale: true},

      // 总经销-批发-毛利额
      distributionWholeBusinessProfit: {name: '批发-毛利额', sale: true},
      distributionWholeBusinessProfitYoYValue: {name: '批发-毛利额-同期值', sale: true},
      distributionWholeBusinessProfitYoY: {name: '批发-毛利额-同比增幅', scale: true, color: true},
      distributionWholeBusinessProfitToTValue: {name: '批发-毛利额-环期值', sale: true},
      distributionWholeBusinessProfitPct: {name: '批发-毛利额-占比', scale: true},

      // 单品-经销-平均销售额
      distributionAmountAvg: {name: '单品-销售额', sale: true, icon: 'brandOneSales'},
      distributionRetailAmountAvg: {name: '单品-零售-销售额', sale: true, icon: 'brandOneSales'},
      distributionWholeAmountAvg: {name: '单品-批发-销售额', sale: true, icon: 'brandOneSales'},

      // 单品-平均-毛利额
      distributionBusinessProfitAvg: {name: '单品-毛利额', sale: true, icon: 'brandOneProfit'},
      distributionRetailBusinessProfitAvg: {name: '单品-零售-毛利额', sale: true, icon: 'brandOneProfit'},
      distributionWholeBusinessProfitAvg: {name: '单品-批发-毛利额', sale: true, icon: 'brandOneProfit'},

      // 单品经销综合贡献
      distributionSingleMixContribution: {name: '单品-综合贡献', icon: 'brandOneContribute'},
      distributionRetailSingleMixContribution: {name: '单品-零售-综合贡献', icon: 'brandOneContribute'},
      distributionWholeSingleMixContribution: {name: '单品-批发-综合贡献', icon: 'brandOneContribute'},

      // 动销率
      distributionMoveOffRate: {name: '动销率', scale: true, color: true, icon: 'brandRateOfPin'},
      distributionRetailMoveOffRate: {name: '零售-动销率', scale: true, color: true, icon: 'brandRateOfPin'},
      distributionWholeMoveOffRate: {name: '批发-动销率', scale: true, color: true, icon: 'brandRateOfPin'},

      // 日均库存成本
      stockCost: {name: '日均库存成本', sale: true},
      stockCostYoYValue: {name: '日均库存成本-同期值', sale: true },
      stockCostYoY: {name: '日均库存成本-同比增幅', scale: true, color: true},
      stockCostToT: {name: '日均库存成本-环比增幅', scale: true, color: true},
      stockCostToTValue: {name: '日均库存成本-环期值', sale: true },
      stockCostPct: {name: '日均库存成本-占比', scale: true},

      // 树形指标配置
      name: { name: '价格带' },
      season:{ name: '季节因子', spc: true},
      spec: {name: '规格', spc: true},
      brandName:{name: '品牌', brand:true},
      normalPrice: { name: '平均售价', chief:true, point: 2},
      specPrice: { name: '规格化平均售价', chief:true },

      retailNormalPrice: { name: '平均售价', chief:true, point: 2},
      retailSpecPrice: { name: '规格化平均售价', chief:true },

      wholeNormalPrice: { name: '平均售价', chief:true, point: 2},
      wholeSpecPrice: { name: '规格化平均售价', chief:true },

      importDate: { name: '引入时间', date:true },
      firstStockDate:{ name: '入库时间', date:true },
      firstSale:{ name: '首次销售时间', date:true }
    },

    // 供应商四象限分析
    quadrant: {
      count: {name: '供应商数', point: 0, quaClick: true, notSort: true, fixWidth: 130,},

      allAmount: {name: '销售额', sale: true, notSort: true},
      allAmountYoYInc: {name: '销售额-同期增额', sale: true, fixWidth: 160, notSort: true},

      allProfit: {name: '毛利额', sale: true, notSort: true},
      allProfitYoYInc: {name: '毛利额-同期增额', sale: true, fixWidth: 160, notSort: true},
      // 综合收益额(采购)
      buyerChannelSettleAmount: {name: '通道收益额(采购)', sale: true, notSort: true, fixWidth: 200,},
      buyerChannelSettleAmountYoYInc: {name: '通道收益额(采购)-同期增额', sale: true, fixWidth: 190, notSort: true},

      buyerBizCompIncomeAmount: {name: '综合收益额(采购)', sale: true, icon: 'quaBizCompIncomeAmount', notSort: true, fixWidth: 190,},
      buyerBizCompIncomeAmountYoYInc: {name: '综合收益额(采购)-同期增额', sale: true, fixWidth: 190, notSort: true},



    }

  });
