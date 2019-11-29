angular.module('app.datas').factory('dataService', function (ajaxService, popups, action, $rootScope) {

  const reject = () => $rootScope.reject();
  const rejectRequest = () => $rootScope.rejectRequest();

  return {

    // 获取 uuid
    getUuid() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getUuid);
    },

    /**
     * 校验权限
     */
    checkAccess(param) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.checkAccess, param);
    },

    /**
     * 获取日期 相关接口
     */

    // 基准日
    getBaseDate() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getBaseDate);
    },

    // 财务月区间
    getBaseMonth() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getBaseBusinessMonth);
    },

    // 基准日对应的财务月
    getMonthByDate(baseDate) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getBusinessMonthByDate, baseDate);
    },

    // 基准日对应的财务月区间
    getBusinessMonthDateRangeWithDate(date) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getBusinessMonthDateRangeWithDate, date);
    },

    // 获取财务毛利月份
    getFinProfitFinallyMonth() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getFinProfitFinallyMonth);
    },

    // 获取财务收益月份
    getFinCompIncomeFinallyMonth() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getFinCompIncomeFinallyMonth);
    },


    /**
     * 获取类别父级
     */

    // 分类父级
    getCategoryParents(code) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getCategoryParents, code);
    },

    // 品类组父级
    getClassParents(code) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getClassParents, code);
    },

    /**
     * 可比门店 下载
     */
    downloadContrastStore(param) {
      if (reject()) return rejectRequest();
      return $.download.post(action.common.downloadContrastStore, param);
    },

    getOperations() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getOperationList);
    },

    getDistricts() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getDistrictList);
    },

    getItems() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getProductList);
    },

    /**
     * 企业参谋 供应商加注缺品
     */
    getStockOutDataBySupplier(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getStockOutDataBySupplier, params);
    },

    /**
     * 企业参谋 供应商交叉分析 -> 供货结构
     */
    getSupplyByItem() {
      if (reject()) return rejectRequest();
      return ajaxService.get(action.enterprise.getSupplyByItem);
    },

    /**
     *  企业参谋  供应商引入
     */
    getNewSupplierSalesData(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getNewSupplierSalesData, params);
    },

    /**
     * 企业参谋 供应商8020结构
     */
    getSupplier8020(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplier8020, params);
    },

    /**
     * 企业参谋 供应商供货
     */
    getSupplyDataBySupplier(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplyDataBySupplier, params)
    },
    //企业参谋 供应商供货 -> select内容数据
    getCountRange(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getCountRange, params)
    },

    /**
     * 企业参谋 供应商异常
     */
    getAbnormalSupplierBySales(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getAbnormalSupplierBySales, params)
    },

    /**
     * 企业参谋 销售库存页面 内部页面 所有接口
     */

    /**
     * 企业参谋 取得销售库存 ->加注缺品
     */
    getSubLack(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSubLack, params);
    },
    // 企业参谋 取得销售库存 ->加注缺品 ->加注缺品详情
    getStockOutDataByDatePeriod(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getStockOutDataByDatePeriod, params);
    },


    /**
     * 企业参谋 取得销售库存->新品 所有接口
     */

    // 企业参谋 取得销售库存->新品->新品状态 ||datatable数据
    getNewProductSurvivalList(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getNewProductSurvivalList, params);
    },

    // 企业参谋 取得销售库存->新品->新品状态 ||合计数据
    getNewProductSurvivalSummary(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getNewProductSurvivalSummary, params);
    },

    // 企业参谋 取得销售库存->新品->新品概况
    getPeriodNewProductCount(param) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getPeriodNewProductCount, param);
    },

    // 新品状态 | （按类别）
    getAbnormalNewProductByCategory(param) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getAbnormalNewProductByCategory, param);
    },

    // 新品状态 | （按品类组）
    getAbnormalNewProductByClass(param) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getAbnormalNewProductByClass, param);
    },

    /**
     *  企业参谋 取得销售库存->供货  所有接口
     */

    // 企业参谋 取得销售库存->供应商供货->按趋势
    getSupplyDataByDate(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplyDataByDate, params);
    },

    // 企业参谋 取得销售库存->供应商供货->按商品
    getSupplyDataByProduct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplyDataByProduct, params);
    },

    // 企业参谋 取得销售库存->供应商供货->按商品 ->到货详情页面
    getSupplyArrivalDataByDate(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplyArrivalDataByDate, params);
    },

    // 企业参谋 取得销售库存->供应商供货->按商品 ->退货详情页面
    getSupplyReturnDataByDate(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplyReturnDataByDate, params);
    },


    /**
     * 企业参谋 取得销售库存下各个tab的数据
     */
    // 销售库存 和 新品下的 分类排名
    getCategoryRankingForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getCategoryRankingForSale, params);
    },

    // 销售库存 和 新品下的 分类树
    getCategoryTreeForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getCategoryTreeForSale, params);
    },

    // 分类排名
    getSupplierCategoryRankingForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplierCategoryRankingForSale, params);
    },

    // 分类树
    getSupplierCategoryTreeForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplierCategoryTreeForSale, params);
    },

    // 品类组排名
    getClassRankingForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getClassRankingForSale, params);
    },

    // 品类组树
    getClassTreeForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getClassTreeForSale, params);
    },

    // 趋势数据
    getTrendForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getTrendForSale, params);
    },

    // 门店排名
    getStoreRankingForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getStoreRankingForSale, params);
    },

    // 业态排名
    getOperationRankingForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getOperationRankingForSale, params);
    },

    // 地区排名
    getAreaRankingForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getAreaRankingForSale, params);
    },

    // 品牌排名
    getBrandRankingForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getBrandRankingForSale, params);
    },

    // 商品排名
    getItemRankingForSale(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getItemRankingForSale, params);
    },


    /**
     * 供应商交叉分析
     */
    getSalesAndInventoryDataBySupplier(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSalesAndInventoryDataBySupplier, params);
    },

    /**
     * 通道收益 ---门店费用代码
     * @param params
     * @returns {*}
     */
    getStoreChannelAmountDataByChannelCode(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getStoreChannelAmountDataByChannelCode, params);
    },
    getChannelAmountDataByStoreWithChannel(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getChannelAmountDataByStoreWithChannel, params);
    },
    getChannelAmountDataByChannelWithStore(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getChannelAmountDataByChannelWithStore, params);
    },


    /**
     * 通道收益 ----品类组费用代码
     * @param params
     * @returns {*}
     */
    getBuyerChannelAmountDataByChannelCode(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getBuyerChannelAmountDataByChannelCode, params);
    },
    getChannelAmountDataByClassWithChannel(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getChannelAmountDataByClassWithChannel, params);
    },
    getChannelAmountDataByChannelWithClass(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getChannelAmountDataByChannelWithClass, params);
    },

    /**
     * 供应商信息汇总
     */

    //供应商基础信息

    getSupplierInfo(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getSupplierInfo, params);
    },


    //（供应商引入）->供应商数信息
    getPeriodNewSupplierCount(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getPeriodNewSupplierCount, params);
    },

    //（供应商引入）->供应商结构信息
    getNewSupplierStructure(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getNewSupplierStructure, params);
    },


    //11.销售库存合计
    getSalesAndInventoryDataSummary(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSalesAndInventoryDataSummary, params);
    },


    //（供应商供货）->供应商供货数据
    getSupplyDataSummary(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplyDataSummary, params);
    },

    // (供应商供货) -> 供应商概况占比
    getSupplyDataByLogisticsMode(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplyDataByLogisticsMode, params);
    },

    //（供应商供货）->供应商 饼状图数据
    getSupplyDataBySupplierCountProportion(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplyDataBySupplierCountProportion, params);
    },

    //（供应商加注缺品）->供应商 饼状图数据
    getStockOutDataBySupplierCountProportion(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getStockOutDataBySupplierCountProportion, params);
    },


    // 供应商概况 销售、收益、库存
    getSupplierRankInfo(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplierRankInfo, params);
    },

    // 供应商概况 总体表现 子类平均
    getCompareCategoryData(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getCompareCategoryData, params);
    },

    // 供应商概况 总体表现 供应商自身
    getSupplierSummaryData(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplierSummaryData, params);
    },
    /*
    * 概况API（XC）
    * */

    //商品结构ABC
    getProductABCStructure(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getProductABCStructure, params);
    },


    /*
    * @新品API
    * */
    getNewProductInfo(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getNewProductInfo, params);
    },

    getNewProductStatusLine(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getNewProductStatusLine, params);
    },
    getNewProductStoreFirstDate(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getNewProductStoreFirstDate, params);
    },
    getNewProductDateShelveStores(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getNewProductDateShelveStores, params);
    },

    // 新品分析-新品引入
    getNewProductImportByTime(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getNewProductImportByTime, params);
    },

    getStoreAbnormalSalesByProduct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getStoreAbnormalSalesByProduct, params);
    },

    getDateListFromStoreAbnormalSales(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getDateListFromStoreAbnormalSales, params);
    },

    /*新品类别对比分析*/
    getEstimationByCategory(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getEstimationByCategory, params);
    },

    getTargetLevelCategoryCodes(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getTargetLevelCategoryCodes, params);
    },

    // 新品分析-门店对标-按整体
    getSalesAndInventoryDataSummaryStorecompare(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSalesAndInventoryDataSummaryStorecompare, params);
    },

    // 新品分析-门店对标-按趋势
    getSalesAndInventoryDataByDateStorecompare(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSalesAndInventoryDataByDateStorecompare, params);
    },

    // 新品分析-门店对标-类别饼图
    getSalesAndInventoryDataByCategoryProportion(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSalesAndInventoryDataByCategoryProportion, params);
    },

    // 综合分析-门店对标-按类别
    getSalesAndInventoryDataByCategory(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSalesAndInventoryDataByCategory, params);
    },

    // 综合分析-门店对标-品类部门占比
    getSalesAndInventoryDataByClassProportion(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSalesAndInventoryDataByClassProportion, params);
    },

    // 综合分析-节假日分析-时间接口
    getHolidayMaintainByYear(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getHolidayMaintainByYear, params);
    },
    // 综合分析-节假日分析-按趋势
    getSalesAndInventoryDataByDateHoliday(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByDateHoliday, params);
    },

    // 综合分析-节假日分析-按品类组（常规表示）
    getSalesAndInventoryDataByClassHoliday(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByClassHoliday, params);
    },

    // 综合分析-节假日分析-按品类组（树形表示）
    getSalesAndInventoryDataByClassTreeHoliday(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByClassTreeHoliday, params);
    },

    // 综合分析-节假日分析-按类别（常规表示）
    getSalesAndInventoryDataByCategoryHoliday(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByCategoryHoliday, params);
    },

    // 综合分析-节假日分析-按类别（树形表示）
    getSalesAndInventoryDataByCategoryTreeHoliday(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByCategoryTreeHoliday, params);
    },

    // 综合分析-节假日分析-按门店-按品牌
    getSalesAndInventoryDataByBrandHoliday(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByBrandHoliday, params);
    },

    // 综合分析-节假日分析-按门店-按门店
    getSalesAndInventoryDataByStoreHoliday(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByStoreHoliday, params);
    },

    // 综合分析-节假日分析-按门店-按业态
    getSalesAndInventoryDataByOperationHoliday(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByOperationHoliday, params);
    },

    // 综合分析-节假日分析-按门店-按地区
    getSalesAndInventoryDataByDistrictHoliday(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByDistrictHoliday, params);
    },

    // 综合分析-节假日分析-按商品
    getSalesAndInventoryDataByProductHoliday(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByProductHoliday, params);
    },

    // 综合分析-节假日分析-按供应商
    getSalesAndInventoryDataBySupplierHoliday(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataBySupplierHoliday, params);
    },

    // 综合分析-供货-(按趋势)
    getSupplyDataByDateSupply(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSupplyDataByDateSupply, params);
    },

    // 综合分析-供货-(按品类组)
    getSupplyDataByClass(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSupplyDataByClass, params);
    },

  // 综合分析-供货-(按类别)
    getSupplyDataByCategory(params){
      if (reject()) return rejectRequest();
    return ajaxService.post(action.newProduct.getSupplyDataByCategory, params);
  },

    // 综合分析-供货-(按品牌)
    getSupplyDataByBrand(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSupplyDataByBrand, params);
    },

    // 综合分析-供货-(按门店)
    getSupplyDataByStore(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSupplyDataByStore, params);
    },

    // 综合分析-供货-(按业态)
    getSupplyDataByOperation(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSupplyDataByOperation, params);
    },

    // 综合分析-供货-(按地区)
    getSupplyDataByDistrict(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSupplyDataByDistrict, params);
    },


    // 综合分析-供货-(按商品)
    getSupplyDataByProductSupply(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSupplyDataByProductSupply, params);
    },

    // 综合分析-供货-(按商品-合计)
    getSupplyDataSummarySupply(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSupplyDataSummarySupply, params);
    },

  // 综合分析-供货-(按供应商)
    getSupplyDataBySupplierSupply(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getSupplyDataBySupplierSupply, params);
    },

    // 新品概况-2018年新品概况（上半部分）
    getNewProductDataSummary(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getNewProductDataSummary, params);
    },

    // 年月下拉列表获取
    getEstimationDateByCategory(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getEstimationDateByCategory, params);
    },

    // 新品概况-新品-新品结构分析(饼图)
    getNewProductStructure(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getNewProductStructure, params);
    },


    // 指标达成 采购 品类组树
    getClassTreeForPurchase(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getClassTreeForPurchase, params);
      // return ajaxService.get('apps/enterprise-bi/api/indexComplete/purchase.json');
    },

    // 指标达成 运营 门店树
    getStoreTreeForOperations(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getStoreTreeForPurchase, params);
      // return ajaxService.get('apps/enterprise-bi/api/indexComplete/store.json');
    },

    //获取指标达成页面的当前月份
    getIndexMonth(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getIndexMonth, params);
    },

    // 采购 趋势图
    getTrendChartForPurchase(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getTrendChartForPurchase, params);
      // return ajaxService.get('apps/enterprise-bi/api/indexComplete/trend.json');
    },

    // 运营 趋势图
    getTrendChartForOperations(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getTrendChartForOperations, params);
      // return ajaxService.get('apps/enterprise-bi/api/indexComplete/trend2.json');
    },

    // 门店 ->门店对比
    getSalesAndInventoryDataByStore(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByStore, params);
    },

    // 门店 ->门店对比图
    getSalesAndInventoryDataByDate(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataByDate, params);
    },

    /**
     * ABC分析 取得结构分析下各个tab的数据
     */

    // 分类
    getCategoryForABc(params) {

      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getCategoryRankingForSale, params);
    },

    // 品类组
    getClassForABC(params) {
      //调用接口方法
      // return ajaxService.get('apps/enterprise-bi/api/abc/abc1_2.json');
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getABCClassesForStructure, params);
    },
    //品牌
    getABCBrandChartTable(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getABCBrandChartTable, params);
    },
    //类别
    getDataByCategory(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getDataByCategory, params);
    },

    //门店
    getDataByStore(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getDataByStore, params);
    },
    //商品
    getDataByProduct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getDataByProduct, params);
    },
    //整体
    getDataByDate(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getDataByDate, params);
    },
    //业态
    getDataByOperation(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getDataByOperation, params);
    },

    //新品
    getDataByNewProduct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getDataByNewProduct, params);
    },
    /**
     * ABC分析 差异分析
     */
    getAbcTreeForDiff(params) {
      //return ajaxService.get('apps/enterprise-bi/api/abc/abc2.json');
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getAbcTreeForDiff, params);
    },
    /**
     * ABC分析 预警商品
     */
    getDataByAbcAlert(params) {
      //return ajaxService.get('apps/enterprise-bi/api/abc/abc2.json');
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getDataByAbcAlert, params);
    },

    //获取年月信息
    getDateCode(params) {
      //return ajaxService.get('apps/enterprise-bi/api/abc/abc2.json');
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getDateCode, params);
    },

    /**
     * ABC分析 效能交叉分析
     */
    getAbcChartTableForEfficiencyCross(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getAbcChartTableForEfficiencyCross, params);
    },

    /**
     * ABC分析 效能商品一览
     */
    getDataByDistributor(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getDataByDistributor, params);
    },

    /**
     * ABC分析 商品一览
     */
    getDataByAllProduct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.abc.getDataByAllProduct, params);
    },

    // home
    // 头部三个日期
    getDateInfoWithDate(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.home.getDateInfoWithDate, params);
    },

    // 总体排名/业态排名
    getStoreAllAmountYoYRank(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.home.getStoreAllAmountYoYRank, params);
    },

    // 获取商店信息
    getStoreInfo(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.info_basic, params);
    },

    // 获取指标的月份
    getCurrentMonth() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.home.getCurrentMonth);
    },

    // 获取未来日
    getFutureBusinessMonthDateRangeWithDate(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.home.getFutureBusinessMonthDateRangeWithDate, params);
    },

    /**
     * 严重异常
     */
    getSeriousAbnormal() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.home.getSeriousAbnormal);
    },

    /**
     *获取异常分析title
     */
    getWarnSaleTitle(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getWarnSaleTitle, params);
    },

    /**
     *获取异常分析title
     */
    getSaleAbnormalProduct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getSaleAbnormalProduct, params);
    },

    /**
     * 销售异常（按门店）
     */
    getSaleAbnormalStoreList(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getSaleAbnormalStoreList, params);
    },

    /**
     * 销售异常（按门店商品）
     */
    getSaleAbnormalProductInStore(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getSaleAbnormalProductInStore, params);
    },

    /**
     *高周转异常（按整体商品）
     */
    getTurnoverAbnormalProduct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getSaleAbnormalProductInStore, params);
    },

    /**
     *高周转异常（按门店）
     */
    getTurnoverAbnormalStoreList(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getTurnoverAbnormalStoreList, params);
    },

    /**
     *高周转异常（按门店商品）
     */
    getTurnoverAbnormalProductInStore(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getTurnoverAbnormalProductInStore, params);
    },

    /**
     *高周转异常的配置信息
     */
    getTurnoverAbnormalTitleInfo(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getTurnoverAbnormalTitleInfo, params);
    },

    /**
     *负毛利异常（按整体商品）
     */
    getMinusProfitAbnormalProduct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getMinusProfitAbnormalProduct, params);
    },

    /**
     *负毛利异常（按门店）
     */
    getMinusProfitAbnormalStoreList(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getMinusProfitAbnormalStoreList, params);
    },

    /**
     *负毛利异常（按门店商品）
     */
    getMinusProfitAbnormalProductInStore(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getMinusProfitAbnormalProductInStore, params);
    },
    /**
     *不动销异常（按整体商品）
     */
    getNoSaleAbnormalProduct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getNoSaleAbnormalProduct, params);
    },
    /**
     *不动销异常（按门店）
     */
    getNoSaleAbnormalStoreList(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getNoSaleAbnormalStoreList, params);
    },
    /**
     *不动销异常(按门店商品）
     */
    getNoSaleAbnormalProductInStore(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getNoSaleAbnormalProductInStore, params);
    },
    /**
     *不动销异常的配置信息
     */
    getNoSalesAbnormalTitleInfo(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getNoSalesAbnormalTitleInfo, params);
    },
    /**
     *不动销异常的配置信息
     */
    getMinusProfitDateProduct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getMinusProfitDateProduct, params);
    },
    /**
     *不动销异常的配置信息
     */
    getMinusProfitDateStore(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.warning.getMinusProfitDateStore, params);
    },

    /**
     * 销售方式占比
     */
    getSaleWayPct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSaleWayPct, params);
    },

    // 首页消息
    getLatestSystemInfo() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.common.getLatestSystemInfo);
    },

    // 首页客单新加
    getFlowOrFlowRetailYoYIncCnt(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.home.getFlowOrFlowRetailYoYIncCnt, params);
    },

    // 经销零售
    getSalesAndInventoryDataPercentage(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.home.getSalesAndInventoryDataPercentage, params);
    },

    // 门店对标-经销、联营、零售、批发
    getSalesAndInventoryDataPercentageStore(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getSalesAndInventoryDataPercentageStore, params);
    },

    //供应商占比分析
    getSupplierStructurePct(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplierStructurePct, params);
    },

    // 供应商结构占比
    getSupplierStructurePctTree(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplierStructurePctTree, params);
    },

    // 供应商四象限分析 | 合计
    getQuadrantSummaryWithDetails(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getQuadrantSummaryWithDetails, params);
    },

    // 供应商四象限分析 | (按品类组-象限)
    getFourQuadrantDataByClass(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getFourQuadrantDataByClass, params);
    },

    // 供应商四象限分析 | (按象限-品类组)
    getFourQuadrantDataByQuadrant(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getFourQuadrantDataByQuadrant, params);
    },

    // 供应商四象限分析 | 求供应商数
    getSupplierInfoByIds(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.enterprise.getSupplierInfoByIds, params);
    },

    // 价格带-概况-树状图
    getPriceZoneDataByCategoryTree(params){
      return ajaxService.post(action.priceBrand.getPriceZoneDataByCategoryTree, params);
    },

    // 价格带-概况-合计|按价格带-数据
    getPriceZoneDataByZoneType(params){
      return ajaxService.post(action.priceBrand.getPriceZoneDataByZoneType, params);
    },

    getPriceZoneDataByZoneTypeRange(params){
      return ajaxService.post(action.priceBrand.getPriceZoneDataByZoneTypeRange, params);
    },

    // 价格带-有售、可售sku的价格分布
    getHaveAndCanSaleSpecPrice(params){
      return ajaxService.post(action.priceBrand.getHaveAndCanSaleSpecPrice, params);
    },

    // 销售额规格化价格（折线图）
    getDistributionAmountBySpecPrice(params){
      return ajaxService.post(action.priceBrand.getDistributionAmountBySpecPrice, params);
    },

    // 品牌价格带
    getPriceZoneDataByBrandZoneType(params){
      return ajaxService.post(action.priceBrand.getPriceZoneDataByBrandZoneType, params);
    },

    // 价格带规格
    getPriceZoneByZoneTypeSpec(params){
      return ajaxService.post(action.priceBrand.getPriceZoneByZoneTypeSpec, params);
    },

    // 价格带品牌
    getPriceZoneDataByZoneTypeBrand(params){
      return ajaxService.post(action.priceBrand.getPriceZoneDataByZoneTypeBrand, params);
    },

    // 价格带商品
    getPriceZoneDataByZoneTypeProduct(params){
      return ajaxService.post(action.priceBrand.getPriceZoneDataByZoneTypeProduct, params);
    },

    // 首页获取版本号pop
    getPopupInfo() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.home.getPopupInfo);
    },

    // 新品SKU对比分析以下四个接口分别对应（按品类，类别，门店， 业态）
    getNewProductDataByClass(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getNewProductDataByClass, params);
    },

    getNewProductDataByCategory(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getNewProductDataByCategory, params);
    },

    getNewProductDataByStore(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getNewProductDataByStore, params);
    },

    getNewProductDataByOperation(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getNewProductDataByOperation, params);
    },

    // sku对比分析的summary 接口
    getDataSummary(params) {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getDataSummary, params);
    },

    // sku对比分析的最大月
    getDateOnSkuContrast() {
      if (reject()) return rejectRequest();
      return ajaxService.post(action.newProduct.getDateOnSkuContrast);
    },

    // 综合分析-sku对比分析以下四个接口分别对应（按品类，类别，门店， 业态）
    getSkuDataByClass(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getDataByClass, params);
    },

    getSkuDataByCategory(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getDataByCategory, params);
    },

    getSkuDataByStore(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getDataByStore, params);
    },

    getSkuDataByOperation(params){
      if (reject()) return rejectRequest();
      return ajaxService.post(action.storeAnalysis.getDataByOperation, params);
    },

    // 价格带最大月
    getMaxDate(params){
      return ajaxService.post(action.priceBrand.getMaxDate, params);
    },
  }
});
