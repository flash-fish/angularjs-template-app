angular.module('app.datas').constant('action', {

  "auth": {

    /**
     * 获取用户信息
     */
    "user": "/account/info",

    /**
     * 获取用户权限
     */
    "access": "/huashang/bi/info-access",

    /**
     * 获取用户所拥有的菜单
     */
    "userMenu": "/account/menu",

    /**
     * 用户登出
     */
    "logout": "/account/logout",

    /**
     * 获取登录跳转的url
     */
    "login": "/huashang/bi/common/login",

    /**
     * 切换工作岗位
     */
    "changeRole": "/huashang/bi/user/jobChange"
  },

  "common": {

    /**
     * 校验权限
     */
    "checkAccess": "/huashang/bi/common/checkDataAccess",

    // 首页消息
    "getLatestSystemInfo": "/huashang/bi/systemprocess/getLatestSystemInfo",
    /**
     * 可比门店
     */
    "getContrastStore": "/api/background/store/comparable/nopage",

    /**
     * 可比门店 下载
     */
    "downloadContrastStore": "/api/background/store/comparable/download",

    /**
     * 根据给定的categoryCode获取父级
     */
    "getClassParents": "/api/master-data/get-class-parents",

    /**
     * 根据给定的categoryCode获取父级
     */
    "getCategoryParents": "/api/master-data/get-category-parents",

    /**
     * 取得当前供应商等级
     */
    "getCurrentSupplierLevel": "/supplier/bi/getCurrentSupplierLevel",

    /**
     * 供应商所有地区列表
     */
    "getDistrictList": "/huashang/bi/district/list",

    /**
     * 供应商所有业态列表
     */
    "getOperationList": "/huashang/bi/operation/list",

    /**
     * 供应商所有店群列表
     */
    "getStoreGroup": "/api/master-data/get-storegroup",

    /**
     * 供应商所有新品列表
     */
    "getNewProduct": "/huashang/bi/productnew/list",

    /**
     * 供应商所有门店列表
     */
    "getStoreList": "/api/master-data/get-mt-store-by-condition",

    /**
     * 供应商所有品牌列表
     */
    "getBrandList": "/api/master-data/get-brand-list-with-page",

    /**
     * 供应商所有供应商列表
     */
    "getSupplierList": "/api/master-data/get-supplier",

    /**
     * 供应商所有商品列表
     */
    "getProductList": "/huashang/bi/product/list",

    /**
     * 供应商品类组列表
     */
    "getClassList": "/api/master-data/get-class-list",

    /**
     * 取得供应商某个品类下的类目列表
     */
    "getClassLeveList": "/api/master-data/get-sub-class-level-list",

    /**
     * 取得供应商某个类别下的类目列表
     */
    "getCategoryList": "/huashang/bi/category/list",

    /**
     * 获取指定类别下指定层级的所有类别
     */
    "getSubCategoryLevelList": "/huashang/bi/sub/category/list",

    /**
     * 获取全部类别下的所有类别
     */
    "getAllSubCategoryLevelList": "/huashang/bi/category/search",

    /**
     * 获取指定类别下指定层级的所有类别
     */
    "getSubClassLevelList": "/api/master-data/get-sub-class-level-list",

    /**
     * 获取全部类别下的所有类别
     */
    "getAllSubClassLevelList": "/huashang/bi/class/search",

    /**
     * 根据类别名称 获取供应商的类别列表
     */
    "categoryListByName": "/supplier/bi/getCategoryListByName",

    /**
     * 取得数据分析系统的基准日期
     */
    "getBaseDate": "/huashang/bi/common/getBaseDate",

    /**
     * 取得数据分析系统的基准日期对应的财务月
     */
    "getBaseBusinessMonth": "/huashang/bi/common/getDateRangeInCurrentBusinessMonth",

    // 获取财务毛利月份
    "getFinProfitFinallyMonth": "/huashang/bi/common/getFinProfitFinallyMonth",

    // 获取财务收益月份
    "getFinCompIncomeFinallyMonth": "/huashang/bi/common/getFinCompIncomeFinallyMonth",


    /**
     * 根据日期取得财务月
     */
    "getBusinessMonthByDate": "/huashang/bi/common/getBusinessMonthByDate",

    /**
     * 根据日期取得财务月起止日期
     */
    "getBusinessMonthDateRangeWithDate": "/huashang/bi/common/getBusinessMonthDateRangeWithDate",

    /**
     * 取得供应商某一层下的类目列表
     */
    "getCatsByLevel": "/supplier/bi/getCategoryListByLevel",

    /**
     * 取得当前供应商基本信息
     */
    "getSupplierInfo": "/huashang/bi/getSupplierInfo",


    /**
     * 取得当前供应商默认子类
     */
    "getCurrentSupplierMainLevel4Category": "/supplier/bi/getCurrentSupplierMainLevel4Category",

    /**
     * 取得平台跳转bi的地址
     */
    "getComCodeValue1ByCode": '/supplier/bi/getComCodeValue1ByCode',

    /**
     * 取得提示信息
     */
    "getNoticeList": "/supplier/bi/getNoticeList",

    /**
     * 取得业态对应的门店列表
     */
    "getStoresByOperation": "/supplier/bi/getStoreListByOperationDistrict",

    /**
     * 取得uuid
     */
    "getUuid": "/supplier/bi/getCurrentSupplierUuid",

    /**
     * 取得门店信息
     */
    "info_basic": "/huashang/bi/common/getStoreInfo",

    /**
     * 取得商品信息
     */
    "getProductInfo": "/supplier/bi/getProductInfo",

    /*
    * 根据年份获取新品商品列表
    * */
    "newProductItem": "/huashang/bi/productnew/list"

  },

  /**
   * 异常分析
   */
  'warning': {
    /**
     * 销售异常的配置信息
     */
    'getWarnSaleTitle': '/huashang/bi/abnormal/getSalesAbnormalTitleInfo',
    /**
     *销售异常（按整体商品）
     */
    'getSaleAbnormalProduct': '/huashang/bi/abnormal/getSaleAbnormalProduct',
    /**
     * 销售异常（按门店）
     */
    'getSaleAbnormalStoreList': '/huashang/bi/abnormal/getSaleAbnormalStoreList',
    /**
     * 销售异常（按门店商品）
     */
    'getSaleAbnormalProductInStore': '/huashang/bi/abnormal/getSaleAbnormalProductInStore',
    /**
     *高周转异常（按整体商品）
     */
    'getTurnoverAbnormalProduct': '/huashang/bi/abnormal/getTurnoverAbnormalProduct',
    /**
     *高周转异常（按门店）
     */
    'getTurnoverAbnormalStoreList': '/huashang/bi/abnormal/getTurnoverAbnormalStoreList',
    /**
     *高周转异常（按门店商品）
     */
    'getTurnoverAbnormalProductInStore': '/huashang/bi/abnormal/getTurnoverAbnormalProductInStore',
    /**
     *高周转异常的配置信息
     */
    'getTurnoverAbnormalTitleInfo': '/huashang/bi/abnormal/getTurnoverAbnormalTitleInfo',
    /**
     *负毛利异常（按整体商品）
     */
    'getMinusProfitAbnormalProduct': '/huashang/bi/abnormal/getMinusProfitAbnormalProduct',
    /**
     *负毛利异常（按门店）
     */
    'getMinusProfitAbnormalStoreList': '/huashang/bi/abnormal/getMinusProfitAbnormalStoreList',
    /**
     *负毛利异常（按门店商品）
     */
    'getMinusProfitAbnormalProductInStore': '/huashang/bi/abnormal/getMinusProfitAbnormalProductInStore',
    /**
     *不动销异常（按整体商品）
     */
    'getNoSaleAbnormalProduct': '/huashang/bi/abnormal/getNoSaleAbnormalProduct',
    /**
     *不动销异常（按门店）
     */
    'getNoSaleAbnormalStoreList': '/huashang/bi/abnormal/getNoSaleAbnormalStoreList',
    /**
     *不动销异常(按门店商品）
     */
    'getNoSaleAbnormalProductInStore': '/huashang/bi/abnormal/getNoSaleAbnormalProductInStore',
    /**
     *不动销异常的配置信息
     */
    'getNoSalesAbnormalTitleInfo': '/huashang/bi/abnormal/getNoSalesAbnormalTitleInfo',
    /**
     *不动销异常的配置信息
     */
    'getMinusProfitDateProduct': '/huashang/bi/abnormal/getMinusProfitDateProduct',
    /**
     *不动销异常的配置信息
     */
    'getMinusProfitDateStore': '/huashang/bi/abnormal/getMinusProfitDateStore',
  },

  "enterprise": {
    /**
     * 销售方式占比
     */
    "getSaleWayPct": "/huashang/bi/sales/getSalesAndInventoryDataPercentage",

    /**
     * 企业参谋 供应商加注缺品
     */
    "getStockOutDataBySupplier": "/huashang/bi/supply/getStockOutDataBySupplier",

    /**
     * 企业参谋 供应商交叉分析 -> 供货结构
     */
    "getSupplyByItem": "apps/enterprise-bi/api/getSupplyByItem.json",

    /**
     * 企业参谋  供应商引入
     */
    "getNewSupplierSalesData": "/huashang/bi/newsupplier/getNewSupplierSalesData",

    /**
     * 企业参谋 供应商8020结构
     */
    "getSupplier8020": "/huashang/bi/structure/getSupplier8020",

    /**
     * 企业参谋 供应商供货
     */
    "getSupplyDataBySupplier": "/huashang/bi/supply/getSupplyDataBySupplier",
    // 企业参谋 供应商供货 -> select内容
    "getCountRange": "/huashang/bi/supply/getCountRange",


    /**
     * 企业参谋 供应商异常
     */
    "getAbnormalSupplierBySales": "/huashang/bi/abnormal/getAbnormalSupplierBySales",


    /**
     * 企业参谋 销售库存页面 内部页面 所有接口
     */

    /**
     * 企业参谋 取得销售库存 ->加注缺品
     */
    "getSubLack": "/huashang/bi/supply/getStockOutDataByProduct",
    // 企业参谋 取得销售库存 ->加注缺品 ->加注缺品详情
    "getStockOutDataByDatePeriod": "/huashang/bi/supply/getStockOutDataByDatePeriod",


    /**
     * 企业参谋 取得销售库存->新品 所有接口
     */
    // 新品状态 | （按类别）
    "getAbnormalNewProductByCategory":"/huashang/bi/newproduct/getAbnormalNewProductByCategory",

    // 新品状态 | （按品类组）
    "getAbnormalNewProductByClass":"/huashang/bi/newproduct/getAbnormalNewProductByClass",

    // 企业参谋 取得销售库存->新品->新品状态 ||datatable数据
    "getNewProductSurvivalList": "/huashang/bi/newproduct/getNewProductSurvivalList",

    // 企业参谋 取得销售库存->新品->新品状态 ||合计数据
    "getNewProductSurvivalSummary": "/huashang/bi/newproduct/getNewProductSurvivalSummary",

    //  企业参谋 取得销售库存->新品->新品概况
    'getPeriodNewProductCount': '/huashang/bi/newproduct/getPeriodNewProductCount',

    //

    /**
     *  企业参谋 取得销售库存->供货  所有接口
     */

    // 企业参谋 取得销售库存->供应商供货->按趋势
    "getSupplyDataByDate": "/huashang/bi/supply/getSupplyDataByDate",

    // 企业参谋 取得销售库存->供应商供货->按商品
    "getSupplyDataByProduct": "/huashang/bi/supply/getSupplyDataByProduct",

    //  企业参谋 取得销售库存->供应商供货->按商品  -> 到货详情
    "getSupplyArrivalDataByDate": "/huashang/bi/supply/getSupplyReceiveDataByDate",

    //  企业参谋 取得销售库存->供应商供货->按商品  -> 退货详情
    "getSupplyReturnDataByDate": "/huashang/bi/supply/getSupplyReturnDataByDate",


    /**
     * 企业参谋 取得(销售库存, 毛利结构，收益)下各个tab的数据
     */
    // 分类排名(非供应商)
    "getCategoryRankingForSale": "/huashang/bi/sales/getSalesAndInventoryDataByCategory",

    // 分类树(非供应商)
    "getCategoryTreeForSale": "/huashang/bi/sales/getSalesAndInventoryDataByCategoryTree",

    // 分类排名(供应商)
    "getSupplierCategoryRankingForSale": "/huashang/bi/sales/getSalesAndInventoryDataBySupplierCategory",

    // 分类树(供应商)
    "getSupplierCategoryTreeForSale": "/huashang/bi/sales/getSalesAndInventoryDataBySupplierCategoryTree",

    // 品类组排名
    "getClassRankingForSale": "/huashang/bi/sales/getSalesAndInventoryDataByClass",

    // 品类组树
    "getClassTreeForSale": "/huashang/bi/sales/getSalesAndInventoryDataByClassTree",

    // 趋势数据
    "getTrendForSale": "/huashang/bi/sales/getSalesAndInventoryDataByDate",

    // 门店排名
    "getStoreRankingForSale": "/huashang/bi/sales/getSalesAndInventoryDataByStore",

    // 业态排名
    "getOperationRankingForSale": "/huashang/bi/sales/getSalesAndInventoryDataByOperation",

    // 地区排名
    "getAreaRankingForSale": "/huashang/bi/sales/getSalesAndInventoryDataByDistrict",

    // 品牌排名
    "getBrandRankingForSale": "/huashang/bi/sales/getSalesAndInventoryDataByBrand",

    // 商品排名
    "getItemRankingForSale": "/huashang/bi/sales/getSalesAndInventoryDataByProduct",

    //通道收益---门店费用代码
    "getStoreChannelAmountDataByChannelCode": "/huashang/bi/sales/getStoreChannelAmountDataByChannelCode",

    "getChannelAmountDataByStoreWithChannel": "/huashang/bi/sales/getChannelAmountDataByStoreWithChannel",

    "getChannelAmountDataByChannelWithStore": "/huashang/bi/sales/getChannelAmountDataByChannelWithStore",

    //通道收益---品类组费用代码
    "getBuyerChannelAmountDataByChannelCode": "/huashang/bi/sales/getBuyerChannelAmountDataByChannelCode",

    "getChannelAmountDataByClassWithChannel": "/huashang/bi/sales/getChannelAmountDataByClassWithChannel",

    "getChannelAmountDataByChannelWithClass": "/huashang/bi/sales/getChannelAmountDataByChannelWithClass",
    /**
     * api: 销售库存排名（按供应商）
     *
     * page: 供应商销售库存, 供应商交叉分析
     */
    "getSalesAndInventoryDataBySupplier": "/huashang/bi/sales/getSalesAndInventoryDataBySupplier",

    /**
     * 供应商信息汇总
     */

    //（供应商引入）->供应商数信息
    'getPeriodNewSupplierCount': '/huashang/bi/newsupplier/getPeriodNewSupplierCount',

    //（供应商引入）->供应商结构信息
    'getNewSupplierStructure': '/huashang/bi/newsupplier/getNewSupplierStructure',

    //（供应商供货）->供应商供货数据
    'getSupplyDataSummary': '/huashang/bi/supply/getSupplyDataSummary',

    // (供应商供货) -> 供应商概况占比
    'getSupplyDataByLogisticsMode':'/huashang/bi/supply/getSupplyDataByLogisticsMode',

    //（供应商供货）->供应商 饼状图数据
    'getSupplyDataBySupplierCountProportion': '/huashang/bi/supply/getSupplyDataBySupplierCountProportion',

    //（供应商加注缺品）->供应商 饼状图数据
    'getStockOutDataBySupplierCountProportion': '/huashang/bi/supply/getStockOutDataBySupplierCountProportion',

    // 供应商概况 销售、收益、库存
    'getSupplierRankInfo': '/huashang/bi/sales/getSupplierRankInfo',

    /*
    * 供应商概况页面（xc）
    * */
    // 供应商概况 总体表现 子类平均
    'getCompareCategoryData': 'huashang/bi/sales/getCompareCategoryData',

    // 供应商概况 总体表现 供应商自身
    'getSupplierSummaryData': 'huashang/bi/sales/getSupplierSummaryData',

    // 供应商四象限分析 | （合计数据）
    'getQuadrantSummaryWithDetails':'/huashang/bi/sales/getQuadrantSummaryWithDetails',

    // 供应商四象限分析 | （按品类组-象限）
    'getFourQuadrantDataByClass':'/huashang/bi/sales/getFourQuadrantDataByClass',

    // 供应商四象限分析 | （按象限-品类组）
    'getFourQuadrantDataByQuadrant':'/huashang/bi/sales/getFourQuadrantDataByQuadrant',

    // 供应商四象限分析 | （求供应商数）
    'getSupplierInfoByIds': '/huashang/bi/common/getSupplierInfoByIds',

    // 商品结构（ABC）
    "getProductABCStructure": "/huashang/bi/sales/getProductABCStructure",

    //11. 销售库存合计
    "getSalesAndInventoryDataSummary": "/huashang/bi/sales/getSalesAndInventoryDataSummary",

    /**
     * 指标达成
     */

    //class 树
    "getClassTreeForPurchase": "/huashang/bi/performance/getClassPerfSummaryTree",
    //store 树
    "getStoreTreeForPurchase": "/huashang/bi/performance/getStorePerfSummaryTree",

    //echart 按趋势
    "getTrendChartForPurchase": "/huashang/bi/performance/getClassPerfByMonth",

    //echart store 按趋势
    "getTrendChartForOperations": "/huashang/bi/performance/getStorePerfByMonth",

    //获取指标达成页面的当前月份
    "getIndexMonth": "/huashang/bi/performance/getCurrentMonth",

    //华商结构占比分析
    "getSupplierStructurePct": "/huashang/bi/structure/getSupplierStructurePct",

    //华商结构占比分析树形结构
    getSupplierStructurePctTree: "/huashang/bi/structure/getSupplierStructurePctTree",

    getChannelCodeList: "/huashang/bi/channelcode/list"

  },
  /*新品接口路径*/
  "newProduct": {
    /*新品分析-单品概况（新品基本信息）*/
    "getNewProductInfo": "/huashang/bi/newproduct/getNewProductInfo",

    /*新品分析-单品概况（新品轨迹）*/
    "getNewProductStatusLine": "/huashang/bi/newproduct/getNewProductStatusLine",

    /*新品分析-单品概况（新品门店节点信息）*/
    "getNewProductStoreFirstDate": "/huashang/bi/newproduct/getNewProductStoreFirstDate",

    /*新品分析-单品概况（新品铺货门店数）*/
    "getNewProductDateShelveStores": "/huashang/bi/newproduct/getNewProductDateShelveStores",

    /*新品类别对比分析*/
    "getEstimationByCategory": "/huashang/bi/newproduct/getEstimationByCategory",

    // 品类组转换接口
    "getTargetLevelCategoryCodes":"/huashang/bi/common/getTargetLevelCategoryCodes",

    // 新品分析-新品引入
    "getNewProductImportByTime": "/huashang/bi/newproduct/getNewProductImportByTime",

    // 综合分析-门店对标-按整体
    "getSalesAndInventoryDataSummaryStorecompare": "/huashang/bi/storecompare/getSalesAndInventoryDataSummary",

    // 综合分析-门店对标-按趋势
    "getSalesAndInventoryDataByDateStorecompare": "/huashang/bi/storecompare/getSalesAndInventoryDataByDate",

    // 综合分析-门店对标-按类别
    "getSalesAndInventoryDataByCategory": "/huashang/bi/storecompare/getSalesAndInventoryDataByCategory",

    // 综合分析-门店对标-类别饼图
    "getSalesAndInventoryDataByCategoryProportion": "/huashang/bi/storecompare/getSalesAndInventoryDataByCategoryProportion",

    // 综合分析-活动分析-时间接口
    "getHolidayMaintainByYear": "/huashang/bi/holiday/getHolidayMaintainByYear",

    // 新品分析-门店对标-经销/零售/联营/批发
    "getSalesAndInventoryDataByClassProportion": "/huashang/bi/storecompare/getSalesAndInventoryDataByClassProportion",

    // 新品分析-新品门店动销异常 获取列表数据
    "getStoreAbnormalSalesByProduct": "/huashang/bi/newproduct/getStoreAbnormalSalesByProduct",

    // 新品分析-新品门店动销异常 获取日期列表
    "getDateListFromStoreAbnormalSales": "/huashang/bi/newproduct/getDateListFromStoreAbnormalSales",

    // 新品概况-2018年新品概况（上半部分）
    "getNewProductDataSummary": "/huashang/bi/newproduct/getNewProductDataSummary",

    // 新品类别分析年月下拉列表接口
    "getEstimationDateByCategory": "/huashang/bi/newproduct/getEstimationDateByCategory",

    // 新品概况-新品-新品结构分析(饼图)
    "getNewProductStructure": "/huashang/bi/newproduct/getNewProductStructure",

    // 供货分析 - 供货(按趋势)
    "getSupplyDataByDateSupply":"/huashang/bi/supply/getSupplyDataByDate",

    // 供货分析 - 供货(按品类组)
    "getSupplyDataByClass":"/huashang/bi/supply/getSupplyDataByClass",

    // 供货分析 - 供货(按类别)
    "getSupplyDataByCategory":"/huashang/bi/supply/getSupplyDataByCategory",

    // 供货分析 - 供货(按品牌接口)
    "getSupplyDataByBrand": "/huashang/bi/supply/getSupplyDataByBrand",

    // 供货分析 - 供货(按门店)
    "getSupplyDataByStore": "/huashang/bi/supply/getSupplyDataByStore",

    // 供货分析 - 供货(按业态)
    "getSupplyDataByOperation": "/huashang/bi/supply/getSupplyDataByOperation",

    // 供货分析 - 供货(按地区)
    "getSupplyDataByDistrict": "/huashang/bi/supply/getSupplyDataByDistrict",

    // 供货分析 - 供货(按商品)
    "getSupplyDataByProductSupply":"/huashang/bi/supply/getSupplyDataByProduct",

    // 供货分析 - 供货(按供应商)
    "getSupplyDataBySupplierSupply":"/huashang/bi/supply/getSupplyDataBySupplier",

    // 供货分析 - 供货(按商品-合计)
    "getSupplyDataSummarySupply":"/huashang/bi/supply/getSupplyDataSummary",

    // 新品sku对比分析 按品类组
    getNewProductDataByClass: "/huashang/bi/skucompare/getDataByClass",

    // 新品sku对比分析 按类别
    getNewProductDataByCategory: "/huashang/bi/skucompare/getDataByCategory",

    // 新品sku对比分析 按门店
    getNewProductDataByStore: "/huashang/bi/skucompare/getDataByStore",

    // 新品sku对比分析 按业态
    getNewProductDataByOperation: "/huashang/bi/skucompare/getDataByOperation",

    // 新品SKU对比 的summary接口
    getDataSummary: "/huashang/bi/skucompare/getDataSummary",

    // 新品sku对比 日期月的最大值
    getDateOnSkuContrast: "/huashang/bi/skucompare/getDate"
  },

  /*
  *门店分析接口路径
  */
  'storeAnalysis': {
    /*门店对比 */
    'getSalesAndInventoryDataByStore': '/huashang/bi/storeselect/getSalesAndInventoryDataByStore',
    /*门店对比图 */
    'getSalesAndInventoryDataByDate': '/huashang/bi/storeselect/getSalesAndInventoryDataByDate',
    // 节假日分析-按趋势
    'getSalesAndInventoryDataByDateHoliday':'/huashang/bi/holiday/getSalesAndInventoryDataByDate',
    // 节假日分析-按品类组（常规表示）
    'getSalesAndInventoryDataByClassHoliday':'/huashang/bi/holiday/getSalesAndInventoryDataByClass',
    // 节假日分析-按品类组（树形表示）
    'getSalesAndInventoryDataByClassTreeHoliday':'/huashang/bi/holiday/getSalesAndInventoryDataByClassTree',
    // 节假日分析-按类别（常规表示）
    'getSalesAndInventoryDataByCategoryHoliday':'/huashang/bi/holiday/getSalesAndInventoryDataByCategory',
    // 节假日分析-按类别（树形表示）
    'getSalesAndInventoryDataByCategoryTreeHoliday':'/huashang/bi/holiday/getSalesAndInventoryDataByCategoryTree',
    // 节假日分析-按门店-按品牌
    'getSalesAndInventoryDataByBrandHoliday':'/huashang/bi/holiday/getSalesAndInventoryDataByBrand',
    // 节假日分析-按门店-按门店
    'getSalesAndInventoryDataByStoreHoliday':'/huashang/bi/holiday/getSalesAndInventoryDataByStore',
    // 节假日分析-按门店-按业态
    'getSalesAndInventoryDataByOperationHoliday':'/huashang/bi/holiday/getSalesAndInventoryDataByOperation',
    // 节假日分析-按门店-按地区
    'getSalesAndInventoryDataByDistrictHoliday':'/huashang/bi/holiday/getSalesAndInventoryDataByDistrict',
    // 节假日分析-按商品
    'getSalesAndInventoryDataByProductHoliday':'/huashang/bi/holiday/getSalesAndInventoryDataByProduct',
    // 节假日分析-按供应商
    'getSalesAndInventoryDataBySupplierHoliday':'/huashang/bi/holiday/getSalesAndInventoryDataBySupplier',
    // 综合分析-门店对标-经销联营零售批发
    'getSalesAndInventoryDataPercentageStore':'/huashang/bi/storecompare/getSalesAndInventoryDataPercentage',

    //综合分析 - sku 对比分析->按品类组
    getDataByClass: "/huashang/bi/skucompare/getDataByClass",

    //综合分析 - sku 对比分析->按类别
    getDataByCategory: "/huashang/bi/skucompare/getDataByCategory",

    //综合分析 - sku 对比分析->按门店
    getDataByStore: "/huashang/bi/skucompare/getDataByStore",

    //综合分析 - sku 对比分析->按业态
    getDataByOperation: "/huashang/bi/skucompare/getDataByOperation"

  },

  /**
   * 价格带
   */
  'priceBrand': {
    // 价格带-概况-树状图
    'getPriceZoneDataByCategoryTree':'/huashang/bi/priceZone/getPriceZoneDataByCategoryTree',

    // 价格带-概况-合计|按价格带-数据
    'getPriceZoneDataByZoneType':'huashang/bi/priceZone/getPriceZoneDataByZoneType',

    // 有售、可售sku的价格分布
    'getHaveAndCanSaleSpecPrice':'huashang/bi/priceZone/getHaveAndCanSaleSpecPrice',

    // 销售额规格化价格（折线图）
    'getDistributionAmountBySpecPrice':'huashang/bi/priceZone/getDistributionAmountBySpecPrice',

    // 价格带区间（前端绘制价格带背景图）
    'getPriceZoneDataByZoneTypeRange':'huashang/bi/priceZone/getPriceZoneDataByZoneTypeRange',

    // 品牌价格带
    'getPriceZoneDataByBrandZoneType':'huashang/bi/priceZone/getPriceZoneDataByBrandZoneType',

    // 价格带规格
    'getPriceZoneByZoneTypeSpec': 'huashang/bi/priceZone/getPriceZoneByZoneTypeSpec',

    // 价格带品牌
    'getPriceZoneDataByZoneTypeBrand': 'huashang/bi/priceZone/getPriceZoneDataByZoneTypeBrand',

    // 价格带商品
    'getPriceZoneDataByZoneTypeProduct': 'huashang/bi/priceZone/getPriceZoneDataByZoneTypeProduct',

    // 价格带最大月
    'getMaxDate': 'huashang/bi/priceZone/getMaxDate'

  },

  /**
   * ABC
   */
  'abc': {
    //获取年月
    "getDateCode": "/huashang/bi/abc/getDateCode",

    //品类组
    'getABCClassesForStructure': '/huashang/bi/abc/getDataByClass',

    //品牌
    'getABCBrandChartTable': '/huashang/bi/abc/getDataByBrand',

    //类别
    'getDataByCategory': "/huashang/bi/abc/getDataByCategory",

    //门店
    'getDataByStore': "/huashang/bi/abc/getDataByStore",

    //商品
    'getDataByProduct': "/huashang/bi/abc/getDataByProduct",

    //整体
    'getDataByDate': "/huashang/bi/abc/getDataByDate",

    //效能商品一览
    "getDataByDistributor": "/huashang/bi/abc/getDataByDistributor",

    //商品一览
    "getDataByAllProduct": "/huashang/bi/abc/getDataByAllProduct",

    //业态
    'getDataByOperation': "/huashang/bi/abc/getDataByOperation",

    //新品
    'getDataByNewProduct': "/huashang/bi/abc/getDataByNewProduct",

    //效能分析
    'getAbcChartTableForEfficiencyCross': '/huashang/bi/abc/getDataByEffAnalysis',

    //差异分析
    'getAbcTreeForDiff': '/huashang/bi/abc/getDataByDiffAnalysis',

    //预警商品
    "getDataByAbcAlert": '/huashang/bi/abc/getDataByAbcAlert'
  },

  /*首页*/
  'home': {

    // 头部三个日期
    'getDateInfoWithDate': '/huashang/bi/common/getDateInfoWithDate',

    // 总体排名/业态排名
    'getStoreAllAmountYoYRank': '/huashang/bi/sales/getStoreAllAmountYoYRank',

    // 获取指标的月份
    'getCurrentMonth': '/huashang/bi/performance/getCurrentMonth',

    // 获取未来日
    'getFutureBusinessMonthDateRangeWithDate': '/huashang/bi/common/getFutureBusinessMonthDateRangeWithDate',

    // 严重异常
    "getSeriousAbnormal": "/huashang/bi/systemprocess/getSeriousAbnormal",

    // 首页客单新加
    'getFlowOrFlowRetailYoYIncCnt': '/huashang/bi/homePage/getFlowOrFlowRetailYoYIncDays',

    'getSalesAndInventoryDataPercentage': '/huashang/bi/sales/getSalesAndInventoryDataPercentage',

    getPopupInfo: "/huashang/bi/systemprocess/getPopupInfo"
  },

});
