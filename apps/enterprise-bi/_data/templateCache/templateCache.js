angular.module('app.datas').factory('templateCache', ($templateCache) => {
  return {
    initTemplate: () => {
      $templateCache.put("newItemObserveTime.html", "<div>引入后30天内的商品</div>");
      $templateCache.put("allSaleProfit.html", "<div>销售毛利 = 不含税销售额 - 成本（税率区分价内和价外）</div>");

      $templateCache.put("allProfitRate.html", "<div>毛利率 = 毛利额/不含税销售额 * 100%</div>");
      $templateCache.put("retailProfitRate.html", "<div>零售-毛利率 = 零售-毛利额/不含税销售额 * 100%</div>");
      $templateCache.put("wholeProfitRate.html", "<div>批发-毛利率 = 批发-毛利额/不含税销售额 * 100%</div>");
      $templateCache.put("distributionProfitRate.html", "<div>经销-毛利率 = 经销-毛利额/不含税销售额 * 100%</div>");
      $templateCache.put("jointProfitRate.html", "<div>联营-毛利率 = 联营-毛利额/不含税销售额 * 100%</div>");

      $templateCache.put("allBusinessProfitRate.html", "<div>预估毛利率 = 预估毛利额/不含税销售额 * 100%</div>");
      $templateCache.put("retailBusinessProfitRate.html", "<div>零售-预估毛利率 = 零售-预估毛利额/不含税销售额 * 100%</div>");
      $templateCache.put("wholeBusinessProfitRate.html", "<div>批发-预估毛利率 = 批发-预估毛利额/不含税销售额 * 100%</div>");
      $templateCache.put("distributionBusinessProfitRate.html", "<div>经销-预估毛利率 = 经销-预估毛利额/不含税销售额 * 100%</div>");
      $templateCache.put("jointBusinessProfitRate.html", "<div>联营-预估毛利率 = 联营-预估毛利额/不含税销售额 * 100%</div>");

      $templateCache.put("estDiffProfit.html", "<div>预估促销补差 = 销售协议的单价*实绩销售数量</div>");
      $templateCache.put("saleDays.html", "<div>经销周转天数 = 日均库存金额/日均经销销售成本</div>");

      $templateCache.put("allProfit.html", "<div>毛利额 = 销售毛利 + 生鲜加价(收货) + 销售补差 - 成本调整</div>");
      $templateCache.put("retailProfit.html", "<div>零售-毛利额 = 零售-销售毛利 + 零售-生鲜加价(收货)  + 零售-销售补差  - 成本调整</div>");
      $templateCache.put("wholeProfit.html", "<div>批发-毛利额 = 批发-销售毛利 + 批发-生鲜加价(收货)  + 批发-销售补差</div>");
      $templateCache.put("distributionProfit.html", "<div>经销-毛利额 = 经销-销售毛利 + 经销-生鲜加价(收货)  + 经销-销售补差  - 成本调整</div>");
      $templateCache.put("jointProfit.html", "<div>联营-毛利额 = 联营-销售毛利 + 联营-生鲜加价(收货)  + 联营-销售补差</div>");

      $templateCache.put("allEstDiffProfit.html", "<div>预估销售补差 = 预估促销补差  + 手工补差 + 批发补差</div>");
      $templateCache.put("retailEstDiffProfit.html", "<div>零售-预估销售补差 = 零售-预估促销补差 + 手工补差</div>");
      $templateCache.put("wholeEstDiffProfit.html", "<div>批发-预估销售补差 = 批发-预估促销补差 + 批发补差</div>");
      $templateCache.put("distributionEstDiffProfit.html", "<div>经销-预估销售补差 = 经销-预估促销补差 + 经销-手工补差 + 经销-批发补差</div>");
      $templateCache.put("jointEstDiffProfit.html", "<div>联营-预估销售补差 = 联营-预估促销补差 + 联营-手工补差 + 联营-批发补差</div>");

      $templateCache.put("allRealDiffProfit.html", "<div>销售补差 = 促销补差 + 手工补差 + 批发补差</div>");
      $templateCache.put("retailRealDiffProfit.html", "<div>零售-销售补差 = 零售-促销补差 + 手工补差</div>");
      $templateCache.put("wholeRealDiffProfit.html", "<div>批发-销售补差 = 批发-促销补差 + 批发补差</div>");
      $templateCache.put("distributionRealDiffProfit.html", "<div>经销-销售补差 = 经销-促销补差 + 经销-手工补差 + 经销-批发补差</div>");
      $templateCache.put("jointRealDiffProfit.html", "<div>联营-销售补差 = 联营-促销补差 + 联营-手工补差 + 联营-批发补差</div>");

      $templateCache.put("PctHsCat.html", "<div>按类别展示时, 占比联华类别指标有效</div>");
      $templateCache.put("FlowCntCat.html", "<div>客流渗透率：某类别或某品类在门店的客单占门店总体客单的比率</div>");
      $templateCache.put("AllBusinessProfit.html", "<div>经销-预估毛利额</div>");
      $templateCache.put("SKUIcon.html", "<div>有售SKU数: 有销售的商品数</div>");
      $templateCache.put("shopRate.html", "<div>最新铺货率:铺货率 = 实际（商品*门店）/最大（商品*门店）。 例如：供应商总共有100个商品，这100个商品涉及200家门店。实际上，60个商品铺货在150家门店，40个商品铺货在100家门店，那么,铺货率= (60*150 + 40 * 100)/100*200 * 100% = 65%</div>");
      $templateCache.put("adjustCost.html", "<div>成本调整 = 报损报溢金额 + 盘点损溢金额 + 库存调整金额 + 采购成本调整金额</div>");
      $templateCache.put("notStartingSku.html", "<div>没有产生过销售，<br />也没有过库存的商品数量</div>");
      $templateCache.put("importSku.html", "<div>新品状态SKU数 + 转为正常品SKU数 + 已淘汰SKU数</div>");
      $templateCache.put("eliminationRate.html", "<div>已淘汰SKU数/(转为正常品SKU数 + 已淘汰SKU数)*100%</div>");
      $templateCache.put("receiveQtyRate.html", "<div>到货率: 实到商品数/应到商品数</div>");
      $templateCache.put("returnAmountRate.html", "<div>退货率: 退货成本(除税)/实到商品金额(除税)</div>");
      $templateCache.put("lackDay.html", "<div>各缺货商品的缺货天数累加值:<br>例：商品A累计缺货10天，商品B累计缺货50天，那么合计缺货天数 = 10天 + 50天 = 60天</div>");
      $templateCache.put("productStructure.html", "<div>统计对象：最近12个月有销售或者有库存的商品</div>");
      $templateCache.put("new_product_sale.html", "<div>新品平均销售额: 新品销售额/新品有售SKU数</div>");
      $templateCache.put("new_goods_sale.html", "<div>商品平均销售额: 商品销售额/商品有售SKU数</div>");
      $templateCache.put("new_profit_new.html", "<div>新品平均毛利额：新品毛利额/新品有售SKU数</div>");
      $templateCache.put("new_profit_goods.html", "<div>商品平均毛利额：商品毛利额/新品有售SKU数</div>");
      $templateCache.put("new_store_new.html", "<div>新品平均铺货门店数：各新品铺货门店数的合计/新品个数</div>");
      $templateCache.put("new_store_goods.html", "<div>商品平均铺货门店数：各商品铺货门店数的合计/商品个数</div>");
      $templateCache.put("selfBrand.html", "<div>自有品牌：自有品牌事业部、自有品牌食品组、自有品牌洗化组、自有品牌工业品组</div>");
      $templateCache.put("fresh.html", "<div>纯生鲜：熟食组、烘焙组、面点组、鲜活水产品组、猪肉组、水产冷冻冰鲜组、水产干货加工组、家禽类组、牛羊肉组、叶菜茄果组、热带水果组、根块养生组、蔬菜加工半成品组、苹果组、柑橘类组、瓜梨组、桃李杂果葡萄组</div>");
      $templateCache.put("inOut.html", "<div>按供应商建档日期来算哪一年引入的供应商</div>");
      $templateCache.put("abnormalAmount.html", "<div>最近30天销售额较上一个周期下跌30.0%以上的重要供应商数(在销售额前80%的供应商)</div>");
      $templateCache.put("abnormalProfit.html", "<div>最近30天毛利额较上一个周期下跌30.0%以上的重要供应商数(在毛利额前80%的供应商)</div>");
      $templateCache.put("manualDiff.html", "<div>手工补差归属于零售</div>");
      $templateCache.put("sonAvg.html", "<div>供应商经营子类下，各指标单品的平均值</div>");

      $templateCache.put("finProfitRate.html", "<div>财务毛利率 = 财务毛利额/不含税销售额 * 100%</div>");
      $templateCache.put("distributionFinProfitRate.html", "<div>经销-财务毛利率 = 经销-财务毛利额/不含税销售额 * 100%</div>");
      $templateCache.put("jointFinProfitRate.html", "<div>联营-财务毛利率 = 联营-财务毛利额/不含税销售额 * 100%</div>");

      $templateCache.put("finProfit.html", "<div>财务毛利额 =  销售毛利 + 生鲜加价 + 销售补差 - 成本调整</div>");

      $templateCache.put("finCompIncomeAmount.html", "<div>财务综合收益额 = 通道销售额 + 财务毛利额</div>");
      $templateCache.put("finCompIncomeAmountRate.html", "<div>财务综合收益率 = 财务综合收益额/不含税销售额 * 100%</div>");
      $templateCache.put("finChannelSettleAmountTotalRate.html", "<div>通道收益率 = 通道收益额/不含税销售额 * 100%</div>");

      $templateCache.put("distributionFinProfit.html", "<div>经销-财务毛利额 = 经销-销售毛利 + 经销-生鲜加价  + 经销-销售补差  - 成本调整</div>");
      $templateCache.put("jointFinProfit.html", "<div>联营-财务毛利额 = 联营-销售毛利 + 联营-生鲜加价  + 联营-销售补差</div>");
      $templateCache.put("retailFinProfit.html", "<div>零售-财务毛利额 = 零售-销售毛利 + 零售-生鲜加价  + 零售-销售补差  - 成本调整</div>");
      $templateCache.put("wholeFinProfit.html", "<div>批发-财务毛利额 = 批发-销售毛利 + 批发-生鲜加价  + 批发-销售补差</div>");

      $templateCache.put("importProducts.html", "<div>新品SKU数：年度引入的新品个数<br>非新品SKU数：有销售或库存的非新品数</div>");
      $templateCache.put("importYears.html", "<div>新供应商数：年度引入的供应商数<br>非新供应商数：有销售或库存的非新供应商数</div>");

      $templateCache.put("hsAmountPct.html", "<div>占比华商小类 = 供应商小类销售额 / 华商相同小类整体销售额 * 100%</div>");
      $templateCache.put("pctDiff.html", "<div>占比差：占比华商小类 - 占比供应商自己\n" +
        "占比华商小类：供应商小类销售额 / 华商相同小类整体销售额 * 100%\n" +
        "占比供应商自己：供应商小类销售额 / 供应商整体销售额 * 100%\n\n" +
        "例如：\n" +
        "小分类[乳饮料]下，供应商A销售额->80万，华商销售额->100万，\n" +
        "供应商A在华商的全部销售额->1000万\n\n" +
        "那么\n" +
        "占比差 = (80/100 - 80/1000) *100% = 72%</div>");
      $templateCache.put("selfAmountPct.html", "<div>占比供应商自己 = 供应商小类销售额 / 供应商整体销售额 * 100%</div>");

      $templateCache.put("allBizCompIncomeAmount.html", "<div>综合收益额 = 通道销售额 + 毛利额</div>");
      $templateCache.put("quaBizCompIncomeAmount.html", "<div>综合收益额(采购) = 通道销售额(采购) + 毛利额</div>");
      $templateCache.put("allBizCompIncomeAmountRate.html", "<div>综合收益率 = 综合收益额/不含税销售额 * 100%</div>");
      $templateCache.put("channelSettleAmountTotalRate.html", "<div>通道收益率 = 通道收益额/不含税销售额 * 100%</div>");
      $templateCache.put("channelPendingAmountTotal.html", "<div>通道收益额(已到期未收) = 通道收益额(应收) - 通道收益额(已收)</div>");

      // 指标达成
      $templateCache.put("allProfitReal.html", "<div>所有品类组的毛利额合计</div>");

      $templateCache.put("YoYToTSetting.html", "<div>例如：选择了 指标A和同比 两项<br>同比设定成 同期值 + 同比增幅时，表格会出 " +
        "指标A-同期值/指标A-同比增幅 两项；<br>同比只设定 同期值时，表格只会出 指标A-同期值 一项；<br>同比只设定 同比增幅时，表格只会出 指标A-同比增幅 一项；</div>");

      $templateCache.put("BusinessProfit.html", "<div>预估毛利额 = 销售毛利 + 生鲜加价(售出) + 预估销售补差 - 成本调整</div>");
      $templateCache.put("distributionBusinessProfit.html", "<div>经销-预估毛利额 = 经销-销售毛利 + 经销-生鲜加价(售出) + 经销-预估销售补差 - 成本调整</div>");
      $templateCache.put("jointBusinessProfit.html", "<div>联营-预估毛利额 = 联营-销售毛利 + 联营-生鲜加价(售出) + 联营-预估销售补差</div>");
      $templateCache.put("retailBusinessProfit.html", "<div>零售-预估毛利额 = 零售-销售毛利 + 零售-生鲜加价(售出) + 零售-预估销售补差 - 成本调整</div>");
      $templateCache.put("wholeBusinessProfit.html", "<div>批发-预估毛利额 = 批发-销售毛利 + 批发-生鲜加价(售出) + 批发-预估销售补差</div>");

      // 供应商四象限
      $templateCache.put("oneQuadrantIcon.html", "<div>较同期 销售额/综合收益额(采购) 双增</div>");
      $templateCache.put("twoQuadrantIcon.html", "<div>较同期 销售额减少，综合收益额(采购) 增加</div>");
      $templateCache.put("threeQuadrantIcon.html", "<div>较同期 销售额/综合收益额(采购) 双降</div>");
      $templateCache.put("fourQuadrantIcon.html", "<div>较同期 销售额增加，综合收益额(采购) 减少</div>");

      // 价格带
      $templateCache.put("brandOneSales.html", "<div>销售额/有售SKU数</div>");
      $templateCache.put("brandOneProfit.html", "<div>毛利额/有售SKU数</div>");
      $templateCache.put("brandOneContribute.html", "<div>(销售额*40%+毛利额*30%+销售数*30%)/有售SKU数</div>");
      $templateCache.put("brandRateOfPin.html", "<div>有售SKU数/可售SKU数</div>");

      // 新品SKU
      $templateCache.put("newSingleProductStoreCnt.html", "<div>平均单品铺货门店数 = 各商品铺货门店数的合计 / 商品数</div>");
      $templateCache.put("newSingleProductAllAmount.html", "<div>单品销售额 = 销售额 / 有售SKU数</div>");
      $templateCache.put("newSingleProductAllProfit.html", "<div>单品毛利额 = 毛利额 / 有售SKU数</div>");
      $templateCache.put("newSingleStoreProductAllAmount.html", "<div>单店单品销售额 = 销售额 / 各商品的累计有售门店数\n" +
        "例：有A,B,C三个商品\n" +
        "A商品->店1-100万， 店2-110万，店3-120万\n" +
        "B商品->店1-105万， 店3-115万\n" +
        "C商品->店3-130万\n" +
        "那么，单店单品销售额 =\n" +
        "(100 + 110 + 120 + 105 + 115 + 130）/ (3 + 2 + 1) = 113万" +
        "</div>");
      $templateCache.put("newSingleStoreProductAllProfit.html", "<div>单店单品毛利额 = 毛利额 / 各商品的累计有售门店数\n" +
        "例：有A,B,C三个商品\n" +
        "A商品->店1-100万， 店2-110万，店3-120万\n" +
        "B商品->店1-105万， 店3-115万\n" +
        "C商品->店3-130万\n" +
        "那么，单店单品毛利额 =\n" +
        "(100 + 110 + 120 + 105 + 115 + 130）/ (3 + 2 + 1) = 113万" +
        "</div>");
    }
  }
});
