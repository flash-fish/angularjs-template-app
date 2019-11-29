class newItemCateGoryController {
  constructor(CommonCon, toolService, popups, popupDataService, Pop, Common,
              Table, Chart, basicService, $scope, $stateParams, $rootScope,
              dataService, $state) {

    this.Pop = Pop;
    this.Table = Table;
    this.Chart = Chart;
    this.scope = $scope;
    this.popups = popups;
    this.common = Common;
    this.root = $rootScope;
    this.tool = toolService;
    this.state = $stateParams;
    this.basic = basicService;
    this.commonCon = CommonCon;
    this.dataService = dataService;
    this.popupData = popupDataService;
    this.$state = $state;

    // 日期控件配置
    this.dateOption = {onlyShowCustom: "month", noCrossYear: true};

    // 保存共通指标的地方
    this.field = {};

    // 对比所有商品/对比新品同期
    this.contrastProducts = [
      {id: 1, name: '对比所有商品', active: true},
      {id: 0, name: '对比新品同期', active: false},
    ];

    this.comParamField = ['classes', 'category', 'operation', 'store'];
    // 保存共通条件的地方
    this.com = Object.assign({date: "", newProductYear: ""}, _.pick(this.commonCon.commonPro, this.comParamField));

    this.com.compareField = angular.copy(this.contrastProducts.find(v => v.active).id);

    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.newSkuContrastAnalyze);
    this.originChart = angular.copy(this.Chart.newSkuContrastAnalyze);

    // 保存指标的local
    this.localTable = this.commonCon.local.TABLE_ORIGIN_NEW_SKU_CONTRAST_ANALYZE;
    this.localChart = this.commonCon.local.CHART_DATA_NEW_SKU_CONTRAST_ANALYZE;
    this.localOriginChart = this.commonCon.local.CHART_ORIGIN_NEW_SKU_CONTRAST_ANALYZE;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    this.key = {
      active: 2,
      finish: false,
      dateType: 'month',
      page: CommonCon.pageType.sales,
      pageId: CommonCon.page.page_new_skuContrast,
      paramShow: ["district"],
      rememberCom: true,
      showNormal: true,
      // 按门店tab跳转，是否需要清空业态
      clearOperation: true,
      // noSaveParam: true,
      pageTypeTitle: "新品",
      storeOmit: [3],
      //品类接口
      catGroupUrl: ["getNewProductDataByClass"],
      //类别接口
      categoryUrl: ["getNewProductDataByCategory"],
      // 按门店tab接口
      saleStore: ["getNewProductDataByStore", "getNewProductDataByOperation"],
      // 接口独立但需要同时调
      independentInterFace: ["getDataSummary"],
      tabs: this.commonCon.saleStockTabs.filter(s => [2, 3, 5].includes(s.id)),
      storeFixCol: [{id: 'storeCount', newId: ''}]
    };

    this.sort = {
      date: 1,
      newProductYear: 2,
      compareField: 3,
      classes: 4,
      category: 5,
      operation: 6,
      store: 7
    };

    this.fieldInfo = {
      newSaleSkuCnt: {id: "saleSkuCnt", name: "商品有售SKU数"},
      newCanSaleSkuCnt: {id: "canSaleSkuCnt", name: "商品可售SKU数"},
      newAllAmount: {id: "allAmount", name: "商品销售额"},
      newAllProfit: {id: "allProfit", name: "商品毛利额"},
      newSingleProductAllAmount: {id: "singleProductAllAmount", name: "商品单品销售额"},
      newSingleProductAllProfit: {id: "singleProductAllProfit", name: "商品单品毛利额"},
      newSingleStoreProductAllAmount: {id: "singleStoreProductAllAmount", name: "商品单店单品销售额"},
      newSingleStoreProductAllProfit: {id: "singleStoreProductAllProfit", name: "商品单店单品毛利额"},
      newSingleProductStoreCnt: {id: "singleProductStoreCnt", name: "商品平均铺货门店数"},
      newSaleDays: {id: "saleDays", name: "商品经销周转天数"},
    };

    this.conditionTipsMessage = '';
  }

  init() {

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 监听订阅的事件
    this.tool.onEvent(this, this.key, {
      setTopCondition: () => {
        this.basic.setLocal(this.common.local.topCondition,
          Object.assign({}, this.localCom ? this.localCom : {}, _.pick(this.commonParam, this.comParamField)));
      }
    });

    this.scope.$watch('ctrl.com.compareField', (newVal, oldVal) => {
      if (newVal === oldVal) return;
      this.initKeys(newVal);
      this.key.initColumn = true;
      // 修改对比情况
      this.compareFieldFlag = true;
    });

    this.scope.$watch('ctrl.com.newProductYear', (newVal, oldVal) => {
      if (newVal === oldVal) return;
      if (Number(newVal) === this.baseYear) this.com.date = `${this.baseYear}/01-${this._maxDate}`;
      if (Number(newVal) === (this.baseYear - 1)) this.com.date = `${this.baseYear - 1}/01-${this.baseYear - 1}/12`;
    })
  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data, {setMulti:{first: ['1', '3']}});
    this.com = angular.copy(this.accessCom);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com);

    let localCom = angular.copy(this.com);

    this.localCom = angular.copy(localCom);
    if (localCom) {
      // 1.保持数据里 门店有 /业态没有，那么取门店中的第一项
      // 2.保持数据里 门店没有/业态有，那么取业态中的第一项
      // 3.保持数据里 门店有/业态有，那么业态设置为空白，取门店中的第一项

      if (localCom.store && localCom.store.val && localCom.store.val.length) {
        if (localCom.store.val.length === 1 && localCom.operation && localCom.operation.val && localCom.operation.val.length === 1) {
          this.com.store.val = localCom.store.val;
          this.com.operation.val = localCom.operation.val;
        } else {
          this.com.store.val = _.slice(localCom.store.val, 0 ,1);
          this.com.operation.val =  [];
        }
      }

      if (localCom.operation && localCom.operation.val && localCom.operation.val.length && !this.com.store.val.length)
        this.com.operation.val = _.slice(localCom.operation.val, 0 ,1);
    }

    // 获取MenuCondition的值用于判断当前页面的来源
    this.crumbInfo = this.tool.getMenuCondition(this.$state, this.com);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    this.key.table_Info = this.tableInfo;

    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    const date = angular.copy(this.com.date);
    this.com.date = '';

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      const initOther = () => {
        this.new_product_Year = [
          {id: String(this.baseYear), name: this.baseYear + '年新品', active: true},
          {id: String(this.baseYear - 1), name: this.baseYear - 1 + '年新品', active: false}
        ];
        if (this.com.newProductYear) {
          this.new_product_Year.forEach(p => p.active = String(this.com.newProductYear) === p.id);
          if (!this.new_product_Year.find(y => y.active)) {
            this.com.newProductYear = angular.copy(this.new_product_Year[0].id);
            this.new_product_Year[0].active = true;
          }
        } else
          this.com.newProductYear = angular.copy(this.new_product_Year.find(v => v.active).id);
        this.commonParam = angular.copy(this.com);
        this.showCondition();
      };
      this.basic.packager(this.dataService.getDateOnSkuContrast(), res =>{
        const maxDateRes = res.data;
        this.baseYear = Number(moment(String(maxDateRes), 'YYYYMM').format('YYYY'));
        this.dateOption.maxDate = maxDateRes;
        this._maxDate = moment(String(maxDateRes), 'YYYYMM').format('YYYY/MM');
        this.com.date = this.baseYear + '/01-' + this._maxDate;
        this.tool.dateConditionSave(this, date, maxDateRes,
          Object.assign({}, {noSupportDay: true, noSupportCurrentMonth: true}, this.dateOption));
        initOther();
      })
    }, true);

  }

  /**
   * 展示条件
   */
  showCondition() {
    let com = angular.copy(this.commonParam);
    com.newProductYear = `${com.newProductYear}年新品`;
    com.compareField = this.contrastProducts.find(c => c.id === com.compareField).name;
    this.sortCom = this.tool.dealSortData(com, this.sort, {
      newProductYear: {name: '新品年份'},
      compareField: {name: '对比情况'}
    });
  }


  initKeys(newVal) {
    if (Number(newVal)) {
      delete this.key.removePct;
      this.key.compareField = {removeInclude: ['YoY']};
      //对比商品用的表头
      this.key.compareTableTitle = {page: 'skuContrast'};
      this.key.fieldInfo = angular.copy(this.fieldInfo);
    } else {
      this.key.removePct = ['Pct'];
      delete this.key.compareField;
      delete this.key.compareTableTitle;
      delete this.key.fieldInfo;
    }
  }

  scrollMenu() {
    const tab = $(".hs-tab-scroll");

    window.onscroll = function () {
      const tabHeader = $(".hs-tab-scroll > article > div > .nav-tabs");

      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let top = tab[0].offsetTop;

      if (scrollTop + 50 > top) {
        tabHeader.addClass("hs-scroll-fix");
      } else {
        tabHeader.removeClass("hs-scroll-fix");
      }
    }
  }

  /**
   * tab切换时候的逻辑
   */
  select(event) {
    this.tool.tabChanged(this, event);
  }

  /**
   * 初始化指标
   */
  initField() {
    // 初始化表格指标
    const table = this.basic.getLocal(this.localTable);
    const fields = table ? this.tool.getFieldFromLocal(table, this.currFileds) : this.currFileds;
    this.field.table = angular.copy(fields);
    this.initKeys(this.com.compareField);

    // 初始化图
    this.initChart(this.com.compareField);

  }

  initChart(isCompareDate) {
    // 初始化图表指标
    const localChart = this.basic.getLocal(this.localChart);
    if (localChart) {
      const chart = this.changeChart(localChart, isCompareDate);
      if (isCompareDate) chart.all.first.bar = this.doChartBarYoyValue(chart.all.first.bar);
      this.field.chart = chart.all;
    } else {
      let originChart = angular.copy(this.originChart);
      originChart = this.changeChart(originChart, isCompareDate);
      const fieldSale = this.tool.calculateChartField(originChart['all']);
      if (isCompareDate) fieldSale.bar = this.doChartBarYoyValue(fieldSale.bar);
      this.field.chart = {first: fieldSale};
    }

  }

  /**
   * 对比选择的时候要修正一下柱图和线图（选中对比所有商品时无折线图，只有柱图（引入sku只有单柱）
   * @param chart
   * @param isMerge
   * @returns {*}
   */
  changeChart(chart, isMerge) {
    // 选中对比所有商品时无折线图，只有柱图（引入sku只有单柱）
    if (!isMerge) return chart;
    if (chart.all.first) {
      chart.all.first.bar = chart.all.first.bar.filter(l => l.id !== 'newImportSkuCntYoYValue');
      delete chart.all.first.line;
    } else {
      chart.all.bar.list = chart.all.bar.list.filter(l => l.id !== 'newImportSkuCntYoYValue');
      delete chart.all.line;
    }
    return chart;
  }

  /**
   * 对比商品时，同期值的柱图要换成商品柱图
   * @param bars
   * @returns {*}
   */
  doChartBarYoyValue(bars) {
    const compareFieldBar = this.fieldInfo;
    let checkBar = bars.find(b => b.check);
    let yoyValueBar = bars.find(b => !b.check);
    if (checkBar && yoyValueBar) {
      yoyValueBar.id = angular.copy(compareFieldBar[checkBar.id].id);
      yoyValueBar.name = angular.copy(compareFieldBar[checkBar.id].name);
    }
    return bars;
  };

  /**
   * 点击查询
   */
  search() {
    delete this.conditionTipsMessage;
    this.key.finish = false;

    const copyCom = angular.copy(this.com);
    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job, () => this.customizeUnionAccess(copyCom));

    this.tool.commonSetTop(this.com, null , null, ['newProductYear']);

    this.commonParam = this.tool.commonSearch(this);

    if (this.key.initColumn) {
      this.initChart(this.commonParam.compareField);
    }

    this.showCondition();
  }

  /**
   * 自定制权限合并逻辑
   * @param copyCom
   */
  customizeUnionAccess(copyCom) {
    // 门店有数据权限时，门店为空，回复成门店数据权限上的第一项
    if (this.accessCom.store.val.length && !copyCom.store.val.length)
      this.com.store.val = this.accessCom.store.val.filter((v, k) => k === 0);
    // 业态有数据权限时，门店/业态条件都为空，回复成业态数据权限上的第一项, 如果业态有条件的则保留
    const initOperation = this.accessCom.operation.val.length && !copyCom.store.val.length && !copyCom.operation.val.length;
    this.com.operation.val = initOperation ? this.accessCom.operation.val.filter((v, k) => k === 0) : copyCom.operation.val;
  }


  /**
   * 获取chart popup
   */
  getChartOption() {
    const promise = this.popups.popNewSkuContrastAnalyzeChart({
      local: {
        origin: this.localOriginChart,
        data: this.localChart
      },
      // change: [
      //   {
      //     bar: {
      //       isMerge: this.commonParam.compareField,
      //       list: [{id: "newImportSkuCnt", last: true, disLast: true, unBindLine: ["YoY"]}]
      //     },
      //   }
      // ],
      chart: 'newSkuContrastAnalyze',
      job: 'all'
    });

    this.tool.dealModal(promise, res => {
      this.field.chart = this.changeChart(res, this.commonParam.compareField).all;
      if (this.commonParam.compareField) this.field.chart.first.bar = this.doChartBarYoyValue(this.field.chart.first.bar);
      this.field = Object.assign({}, this.field);
    });

  }

  /**
   * 获取table popup
   */
  getTableOption() {
    const promise = this.popups.popNewSkuContrastAnalyze({
      local: this.localTable,
      field: this.currFileds,
      noShowSetting: true
    });

    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.field = Object.assign({}, this.field);
    });

  }

  openCat() {
    const promise = this.popupData.openCategory({selected: this.com.category.val});

    this.tool.dealModal(promise, res => {
      this.com.category.val = res ? res : [];
    });
  }

  openClasses() {
    const promise = this.popupData.openClass({selected: this.com.classes.val});

    this.tool.dealModal(promise, res => {
      this.com.classes.val = res ? res : [];
    });
  }

  openOperation() {
    const promise = this.popupData.openOperation({selected: this.com.operation.val, multi: false});

    this.tool.dealModal(promise, res => {
      this.com.operation.val = res ? res : [];
      // if (this.com.operation.val.length) this.com.store.val = [];
    });
  }

  openStoreList() {
    const promise = this.popupData.openStore({selected: this.com.store.val, multi: false});

    this.tool.dealModal(promise, res => {
      this.com.store.val = res ? res : [];
      if (this.com.store.val.length) this.com.operation.val = [];
    });
  }
}

angular.module('hs.productAnalyze.news').controller('newItemCateGoryCtrl', newItemCateGoryController);
