angular.module("hs.popups", ["ui.bootstrap", "vo.ui-bootstrap-dialogs"])
  .constant("popActions", {
    contrastStore: {
      templateUrl: "app/_popup/views/common/contrastStore.tpl.html",
      controller: "contrastStoreCtrl"
    },

    chooseSupplier: {
      templateUrl: "app/_popup/views/common/supplier.tpl.html",
      controller: "supplierCtrl"
    },

    chooseStore: {
      templateUrl: "app/_popup/views/common/store.tpl.html",
      controller: "storeCtrl"
    },

    chooseOperation: {
      templateUrl: "app/_popup/views/common/operation.tpl.html",
      controller: "operationCtrl"
    },

    chooseCategory: {
      templateUrl: "app/_popup/views/common/category.tpl.html",
      controller: "categoryCtrl"
    },

    chooseItem: {
      templateUrl: "app/_popup/views/common/item.tpl.html",
      controller: "itemCtrl"
    },

    chooseBrand: {
      templateUrl: "app/_popup/views/common/brand.tpl.html",
      controller: "brandCtrl"
    },

    chooseDistrict: {
      templateUrl: "app/_popup/views/common/district.tpl.html",
      controller: "districtCtrl"
    },

    chooseClass: {
      templateUrl: "app/_popup/views/common/class.tpl.html",
      controller: "classCtrl"
    },

    chooseStoreGroup: {
      templateUrl: "app/_popup/views/common/storeGroup.tpl.html",
      controller: "StoreGroupCtrl"
    },

    chooseNewProduct: {
      templateUrl: "app/_popup/views/common/newProduct.tpl.html",
      controller: "NewProductCtrl"
    },

    saleStockChart: {
      templateUrl: "app/_popup/views/option/chart/saleStock.tpl.html",
      controller: "saleStockChartCtrl",
      size: "md-m"
    },

    chooseMaterialAnalyze: {
      templateUrl: "app/_popup/views/option/chart/materialAnalyze.tpl.html",
      size: "s",
      controller: "MaterialAnalyzeCtrl"
    },

    menuSupplierChart: {
      templateUrl: "app/_popup/views/option/chart/menuSupplier.tpl.html",
      controller: "MenuSupplierCtrl"
    },

    newSaleStockChart: {
      templateUrl: "app/_popup/views/option/chart/newSaleStock.tpl.html",
      controller: "newSaleStockChartCtrl",
      size: "md-m"
    },

    saleStockTable: {
      templateUrl: "app/_popup/views/option/table/saleStock.tpl.html",
      controller: "saleStockTableCtrl",
      size: "md"
    },

    // 综合分析-活动分析 chart 弹窗
    sysAnalyze: {
      templateUrl: "app/_popup/views/option/chart/sysAnalyze.tpl.html",
      controller: "sysAnalyzeCtrl",
      size: "md-m"
    },

    saleSaleStock: {
      templateUrl: "app/_popup/views/option/table/saleSaleStock.tpl.html",
      controller: "saleSaleStockTableCtrl",
      size: "md"
    },

    grossProfitChart: {
      templateUrl: "app/_popup/views/option/chart/grossProfit.tpl.html",
      controller: "grossProfitChartCtrl",
      size: "md-m"
    },

    grossProfitTable: {
      templateUrl: "app/_popup/views/option/table/grossProfit.tpl.html",
      controller: "grossProfitTableCtrl",
      size: "md-m"
    },

    profitTable: {
      templateUrl: "app/_popup/views/option/table/profit.tpl.html",
      controller: "profitTableCtrl",
      size: "md-xxl"
    },

    profitChart: {
      templateUrl: "app/_popup/views/option/chart/profit.tpl.html",
      controller: "profitChartCtrl",
      size: "md-xl"
    },

    supplierInOutTable: {
      templateUrl: "app/_popup/views/option/table/supplierInOutTable.tpl.html",
      controller: "supplierInOutTableCtrl",
      size: "md"
    },

    minusProfitWarnTable: {
      templateUrl: "app/_popup/views/option/table/minusProfitWarn.tpl.html",
      controller: "minusProfitWarnTableCtrl",
      size: "md-s"
    },

    purchaseTable: {
      templateUrl: "app/_popup/views/option/table/purchase.tpl.html",
      controller: "purchaseTableCtrl",
      size: "md"
    },

    //财务分析 -- 财务毛利分析
    financeGrossProfitChart: {
      templateUrl: "app/_popup/views/option/chart/financeGrossProfit.tpl.html",
      controller: "financeGrossProfitChartCtrl",
      size: "md-m"
    },

    financeGrossProfitTable: {
      templateUrl: "app/_popup/views/option/table/financeGrossProfit.tpl.html",
      controller: "financeGrossProfitTableCtrl",
      size: "md-m"
    },

    //财务分析 -- 财务收益分析
    financeProfitChart: {
      templateUrl: "app/_popup/views/option/chart/financeProfit.tpl.html",
      controller: "financeProfitChartCtrl",
      size: "md-m"
    },

    financeProfitTable: {
      templateUrl: "app/_popup/views/option/table/financeProfit.tpl.html",
      controller: "financeProfitTableCtrl",
      size: "md-m"
    },

    //ABC分析 -- 结构分析
    abcStructureChart: {
      templateUrl: "app/_popup/views/option/chart/abcStructure.tpl.html",
      controller: "abcStructureChartCtrl",
      size: "md-m"
    },

    abcStructureTable: {
      templateUrl: "app/_popup/views/option/table/abcStructure.tpl.html",
      controller: "abcStructureTableCtrl",
      size: "md-m"
    },

    targetABC: {
      templateUrl: "app/_popup/views/classesAnalyze/targetABC.tpl.html",
      controller: "targetABCCtrl",
      controllerAs: "ctrl",
      size: "md-l"
    },

    // 价格带 table
    classBrandPrice: {
      templateUrl: "app/_popup/views/option/table/classBrandPrice.tpl.html",
      controller: "classBrandPriceCtrl",
      size: "md-m"
    },

    // 价格带 chart
    classPrice: {
      templateUrl: "app/_popup/views/option/chart/classPrice.tpl.html",
      controller: "classPriceCtrl",
      size: "md-m"
    },

    // home 最新消息提醒
    newMessageNotice: {
      templateUrl: "app/_popup/views/home/popupVersion.tpl.html",
      controller: "popupVersionCtrl",
      backdrop: 'static',
      size: "md"
    },

    // sku对比分析指标
    newSkuContrastAnalyze: {
      templateUrl: "app/_popup/views/option/table/newSkuContrastAnalyze.tpl.html",
      controller: "newSkuContrastAnalyzeTableCtrl",
      controllerAs: "ctrl",
      size: "md"
    },

    // sku对比分析指标图
    newSkuContrastAnalyzeChart: {
      templateUrl: "app/_popup/views/option/chart/newSkuContrastAnalyze.tpl.html",
      controller: "newSkuContrastAnalyzeChartCtrl",
      controllerAs: "ctrl",
      size: "md"
    },

    //通道收益popup(chart, table的设定)
    channelProfitChart: {
      templateUrl: "app/_popup/views/option/chart/channelProfit.tpl.html",
      controller: "channelProfitChartCtrl",
      controllerAs: "ctrl",
      size: "md-m"
    },

    channelProfitTable: {
      templateUrl: "app/_popup/views/option/table/channelProfit.tpl.html",
      controller: "channelProfitTableCtrl",
      controllerAs: "ctrl",
      size: "md-xl"
    },

    channelCode: {
      templateUrl: "app/_popup/views/saleStock/channel/channelCode.tpl.html",
      controller: "channelCodeListCtrl",
      controllerAs: "ctrl"
    }

  })
  .factory("popups", ($uibModal, popActions) => {
    let open = (config, context) => {
      config.resolve = {
        context: function () {
          return context;
        }
      };

      config.backdrop = config.backdrop ? config.backdrop : true;
      config.controllerAs = "ctrl";
      config.size = config.size ? config.size : "lg";

      return $uibModal.open(config).result;
    };
    return {
      popupContrastStore: context => {
        return open(popActions.contrastStore, context);
      },

      popupStore: context => {
        return open(popActions.chooseStore, context);
      },

      popupOperation: context => {
        return open(popActions.chooseOperation, context);
      },

      popupDistrict: context => {
        return open(popActions.chooseDistrict, context);
      },

      popupItem: context => {
        return open(popActions.chooseItem, context);
      },

      popupSupplier: context => {
        return open(popActions.chooseSupplier, context);
      },

      popupBrand: context => {
        return open(popActions.chooseBrand, context);
      },

      popupCategory: context => {
        return open(popActions.chooseCategory, context);
      },

      popupClass: context => {
        return open(popActions.chooseClass, context);
      },

      popupStoreGroup: context => {
        return open(popActions.chooseStoreGroup, context);
      },

      popupNewProduct: context => {
        return open(popActions.chooseNewProduct, context);
      },

      // 综合分析 - 供货分析
      popupMaterialAnalyze: context => {
        return open(popActions.chooseMaterialAnalyze, context);
      },

      // 子菜单 销售库存页面的chart 指标
      popupSaleStockChart: context => {
        return open(popActions.saleStockChart, context);
      },

      // 子菜单 销售库存页面的table 指标
      popupSaleStockTable: context => {
        return open(popActions.saleStockTable, context);
      },

      // 子菜单 新品分析(按趋势)table 指标
      popNewProTable: context => {
        return open(popActions.newProTable, context);
      },

      // 子菜单 毛利结构页面的chart 指标
      popupGrossProfitChart: context => {
        return open(popActions.grossProfitChart, context ? context : {});
      },

      // 子菜单 毛利结构页面的table 指标
      popupGrossProfitTable: context => {
        return open(popActions.grossProfitTable, context);
      },

      // 子菜单 收益页面的table 指标
      popupProfitTable: context => {
        return open(popActions.profitTable, context);
      },

      // 子菜单 收益页面的chart 指标
      popupProfitChart: context => {
        return open(popActions.profitChart, context);
      },

      // 供应商引入页面的table 指标
      popupSupplierInOutTable: context => {
        return open(popActions.supplierInOutTable, context);
      },


      // 供应商供货
      popupMenuSupplierChart: context => {
        return open(popActions.menuSupplierChart, context);
      },

      // 负毛利异常
      minusProfitWarnTable: context => {
        return open(popActions.minusProfitWarnTable, context);
      },

      // 指标达成 采购页面的table 指标
      popupPurchaseTable: context => {
        return open(popActions.purchaseTable, context);
      },

      //财务分析 -- 财务毛利分析页面的table 指标
      popupFinanceGrossProfitTable: context => {
        return open(popActions.financeGrossProfitTable, context);
      },

      //财务分析 -- 财务毛利分析面的chart 指标
      popupFinanceGrossProfitChart: context => {
        return open(popActions.financeGrossProfitChart, context);
      },

      //财务分析 -- 财务收益分析页面的table 指标
      popupFinanceProfitTable: context => {
        return open(popActions.financeProfitTable, context);
      },

      //财务分析 -- 财务收益分析面的chart 指标
      popupFinanceProfitChart: context => {
        return open(popActions.financeProfitChart, context);
      },

      //ABC分析 -- 结构分析的table 指标
      popupAbcStructureTable: context => {
        return open(popActions.abcStructureTable, context);
      },

      //ABC分析 -- 结构分析的chart 指标
      popupAbcStructureChart: context => {
        return open(popActions.abcStructureChart, context);
      },


      // 子菜单 销售库存页面的table 指标
      popupSaleStockSaleStockTable: context => {
        return open(popActions.saleSaleStock, context);
      },

      // 子菜单 综合分析-活动分析chart指标
      popupActivityAnalyzeChart: context => {
        return open(popActions.sysAnalyze, context);
      },

      // 新品销售库存chart指标
      popupNewSaleStock: context => {
        return open(popActions.newSaleStockChart, context);
      },

      // ABC指标用于数据条件 --- 经销结构分析的条件
      popupTargetABC: context => {
        return open(popActions.targetABC, context);
      },

      // 价格带table指标
      popupClassBrandPrice: context => {
        return open(popActions.classBrandPrice, context);
      },

      // 价格带chart指标
      popupClassPriceChart: context => {
        return open(popActions.classPrice, context);
      },

      //  home 最新消息提醒
      popupNewMessageNotice: context => {
        return open(popActions.newMessageNotice, context);
      },

      // 新品SKU对比分析table指标
      popNewSkuContrastAnalyze: context =>{
        return open(popActions.newSkuContrastAnalyze, context);
      },

      // 新品SKU对比分析chart指标
      popNewSkuContrastAnalyzeChart: context =>{
        return open(popActions.newSkuContrastAnalyzeChart, context);
      },

      // 通道收益 chart指标
      popupChannelProfitChart: context => open(popActions.channelProfitChart, context),

      // 通道收益 table指标
      popupChannelProfitTable: context => open(popActions.channelProfitTable, context),

      //通道收益，费用代码
      popupChannelCode: context => open(popActions.channelCode, context),
    };
  });
