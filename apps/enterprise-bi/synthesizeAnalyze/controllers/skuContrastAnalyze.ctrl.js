class skuContrastAnalyzeController {
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
    this.dateOption = {onlyShowCustom: "month"};

    // 保存共通指标的地方
    this.field = {};

    this.comParamField = ['classes', 'category', 'operation', 'store'];
    // 保存共通条件的地方
    this.com = Object.assign({date: ""},  _.pick(this.commonCon.commonPro, this.comParamField));

    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.skuContrastAnalyze);
    this.originChart = angular.copy(this.Chart.skuContrastAnalyze);

    // 保存指标的local
    this.localTable = this.commonCon.local.TABLE_ORIGIN_SKU_CONTRAST_ANALYZE;
    this.localChart = this.commonCon.local.CHART_DATA_SKU_CONTRAST_ANALYZE;
    this.localOriginChart = this.commonCon.local.CHART_ORIGIN_SKU_CONTRAST_ANALYZE;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    this.key = {
      active: 2,
      finish: false,
      dateType: 'month',
      page: CommonCon.pageType.sales,
      pageId: CommonCon.page.page_sku_contrast_analyze,
      paramShow: ["district"],
      rememberCom: true,
      showNormal: true,
      // 按门店tab跳转，是否需要清空业态
      clearOperation: true,
      // noSaveParam: true,
      storeOmit: [3],
      //品类接口
      catGroupUrl: ["getSkuDataByClass"],
      //类别接口
      categoryUrl: ["getSkuDataByCategory"],
      // 按门店tab接口
      saleStore: ["getSkuDataByStore", "getSkuDataByOperation"],
      // 接口独立但需要同时调
      independentInterFace: ["getDataSummary"],
      tabs: this.commonCon.saleStockTabs.filter(s => [2, 3, 5].includes(s.id)),
      storeFixCol: [{id: 'storeCount', newId: ''}]
    };

    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      operation: 4,
      store: 5
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
        if (localCom.store.val.length === 1 && localCom.operation && localCom.operation.val &&  localCom.operation.val.length === 1) {
          this.com.store.val = localCom.store.val;
          this.com.operation.val =  localCom.operation.val;
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

    // 如果session里面有值的话 优先读取session
    // this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    const date = angular.copy(this.com.date);
    this.com.date = '';
    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      this.basic.packager(this.dataService.getDateOnSkuContrast(), res => {
        const maxDateRes = res.data;
        this.baseYear = Number(moment(String(maxDateRes), 'YYYYMM').format('YYYY'));
        this.dateOption.maxDate = maxDateRes;
        this._maxDate = moment(String(maxDateRes), 'YYYYMM').format('YYYY/MM');
        this.com.date = this.baseYear + '/01-' + this._maxDate;
        this.tool.dateConditionSave(this, date, maxDateRes);
        this.commonParam = angular.copy(this.com);
        this.showCondition();
      });
    }, true);

  }

  /**
   * 展示条件
   */
  showCondition() {
    let com = angular.copy(this.commonParam);
    this.sortCom = this.tool.dealSortData(com, this.sort);
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

    // 初始化图表指标
    const chart = this.basic.getLocal(this.localChart).all;
    if (chart) {
      this.field.chart = chart;
    } else {
      const origin = angular.copy(this.originChart);
      const fieldSale = this.tool.calculateChartField(origin['all']);
      this.field.chart = {first: fieldSale};
    }
  }

  /**
   * 点击查询
   */
  search() {
    delete this.conditionTipsMessage;
    this.key.finish = false;

    const copyCom = angular.copy(this.com);
    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job, () => this.customizeUnionAccess(copyCom));

    this.tool.commonSetTop(this.com);

    this.commonParam = this.tool.commonSearch(this);

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
    // 业态有数据权限时，门店/业态都为空，回复成业态数据权限上的第一项, 如果业态有条件的则保留
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
        data: this.localChart,
      },
      chart: 'skuContrastAnalyze',
      job: 'all'
    });

    this.tool.dealModal(promise, res => {
      this.field.chart = res.all;
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

angular.module('hs.synthesizeAnalyze').controller('skuContrastAnalyzeCtrl', skuContrastAnalyzeController);
