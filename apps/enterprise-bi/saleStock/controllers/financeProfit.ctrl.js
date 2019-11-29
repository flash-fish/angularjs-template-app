class FinanceProfitController {
  constructor(CommonCon, toolService, popups, popupDataService, Pop, Common,
              Table, Chart, basicService, $scope, $stateParams, $rootScope,
              dataService, SaleStockSubMenu, popupToolService) {
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
    this.popupToolService = popupToolService;

    this.menu = angular.copy(SaleStockSubMenu);
    this.tabs = angular.copy(CommonCon.saleStockTabs);

    this.key = {
      active: 1,
      finish: false,
      noLink: true,
      page: CommonCon.pageType.financeProfit,
      dateType: 'month',
      router: "app.supAnalyse.subProfit",
      treeGridMinWidth: 182,
      rememberCom: true,
      removeField: ["date"],
      showFutureToggle: true,
      barring_FutureDate: true,//框选能否包含未来日
      financeTrend: true
    };

    // 日期控件配置
    this.dateOption = {onlyShowCustom: "month"};

    // 保存共通指标的地方
    this.field = {};

    // 保存共通条件的地方
    this.com = Object.assign({date: ""}, CommonCon.commonPro);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_SALE_FINANCE_PROFIT;
    this.localChart = CommonCon.local.CHART_DATA_SALE_FINANCE_PROFIT;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};


    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      operation: 4,
      store: 5,
      comparableStores: 6,
      district: 7,
      storeGroup: 8,
      brand: 9,
      product: 10,
      supplier: 11
    };

    this.conditionTipsMessage = '';
  }

  init() {

    // 品类组和门店相关条件的相互影响
    this.tool.effectCondition(this);

    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 监听订阅的事件
    this.tool.onEvent(this, this.key);

    // 品类组和门店相关条件的相互影响
    this.tool.effectCondition(this);

    this.tabFinish = true;
  }

  select(event) {

    if(this.com.supplier.val.length > 0) this.show = true;

    if (!this.isBoss) return;

    this.tabFinish = false;

    setTimeout(() => {
      // 获取收益页面的当前tab
      this.currentTab = this.tool.getCurrentTab(this.key.active);

      this.field.chart = angular.copy(this.chartData[this.currentTab]);
      this.field.table = angular.copy(this.tableData[this.currentTab]);

      if (event) this.commonParam = angular.copy(this.com);

      this.tabFinish = true;
    }, 100);

  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);
    this.isBoss = this.tool.isBoss(this.job);


    // 根据角色动态过滤页面的条件
    this.condition = this.tool.getConditionByJob(this.job, this.com);

    // 获取二级菜单共享的条件session
    this.topCondition = this.tool.initProfitCondition(this.com, null, {
      job: this.job,
      reset: ['classes']
    });

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['supplier']);

    this.key.pageId = `${this.commonCon.page.page_sale_financeIncome}_${this.job}`;
    this.key.tabs = this.commonCon['financeProfitTabs_' + this.job];

    this.local = {
      origin: `${this.commonCon.local.CHART_ORIGIN_SALE_FINANCE_PROFIT}_${this.job}`,
      data: `${this.commonCon.local.CHART_DATA_SALE_FINANCE_PROFIT}_${this.job}`
    };

    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    // 初始化日期范围
    this.tool.pageInit(this, () => {
      const date = angular.copy(this.com.date);
      this.basic.packager(this.dataService.getFinCompIncomeFinallyMonth(), res => {
        this.com.date = `${moment(String(res.data), 'YYYYMM').format('YYYY')}/01-${moment(String(res.data), 'YYYYMM').format('YYYY/MM')}`;
        this.tool.dateConditionSave(this, date, res.data);
        this.dateOption.maxDate = res.data;
        this.key.finallMonth = res.data;
        this.commonParam = angular.copy(this.com);
        this.showCondition();
      });
    }, true);
  }

  /**
   * 初始化指标
   */
  initField() {
    // 保存指标的local
    this.localTable = `${this.commonCon.local.TABLE_ORIGIN_SALE_FINANCE_PROFIT}_${this.job}`;
    this.localChart = `${this.commonCon.local.CHART_DATA_SALE_FINANCE_PROFIT}_${this.job}`;

    // 获取当前页面的可选指标
    this.currFileds = angular.copy(this.Table.financeAnalyze_profitTable);

    // 初始化表格指标
    this.tool.initTableProfitField(this);

    // 初始化图表指标
    const chart = this.basic.getLocal(this.localChart);
    const newChart = chart ? chart : this.tool.getProfitChart(this.job, this.Chart.financeAnalyze_profit).field;

    this.chartData = angular.copy(newChart);
    if (!this.isBoss) this.field.chart = newChart;
  }

  /**
   * 点击查询
   */
  search() {
    delete this.conditionTipsMessage;

    this.key.finish = false;

    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.tool.profitSearch(this.topCondition, this.com, null);

    this.commonParam = this.tool.commonSearch(this);

    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.commonParam);
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }


  /**
   * 获取chart popup
   */
  getChartOption() {
    const promise = this.popups.popupFinanceProfitChart({
      local: this.local,
      job: this.job,
      tab: this.key.active
    });

    this.tool.dealModal(promise, res => {
      this.chartData = res;

      this.field.chart = this.isBoss ? res[this.currentTab] : res;
      this.field = Object.assign({}, this.field);
    });
  }

  /**
   * 获取table popup
   */
  getTableOption() {
    const promise = this.popups.popupFinanceProfitTable({
      local: this.localTable,
      field: this.currFileds,
      tab: this.key.active,
      job: this.job
    });

    this.tool.dealModal(promise, res => {
      this.tableData = res;

      this.field.table = this.isBoss ? res[this.currentTab] : res;
      this.field = Object.assign({}, this.field);
    });
  }

  openStoreList() {
    const promise = this.popupData.openStore({selected: this.com.store.val});

    this.tool.dealModal(promise, res => {
      this.com.store.val = res ? res : [];
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

  openDistrict() {
    const promise = this.popupData.openDistrict({selected: this.com.district.val});

    this.tool.dealModal(promise, res => {
      this.com.district.val = res ? res : [];
    });
  }

  openOperation() {
    const promise = this.popupData.openOperation({selected: this.com.operation.val});

    this.tool.dealModal(promise, res => {
      this.com.operation.val = res ? res : [];
    });
  }

  openItem() {
    const promise = this.popupData.openItem({selected: this.com.product.val});

    this.tool.dealModal(promise, res => {
      this.com.product.val = res ? res : [];
    });
  }

  openBrand() {
    const promise = this.popupData.openBrand({selected: this.com.brand.val});

    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  openStoreGroup() {
    const promise = this.popupData.openStoreGroup({selected: this.com.storeGroup.val});

    this.tool.dealModal(promise, res => {
      this.com.storeGroup.val = res ? res : [];
    });
  }

  openSupplier() {
    const promise = this.popupData.openSupplier({selected: this.com.supplier.val});

    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
    });

  }
}

angular.module("hs.saleStock").controller("financeProfitCtrl", FinanceProfitController);
