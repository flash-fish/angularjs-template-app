class FinanceGrossProfitController {
  constructor(CommonCon, toolService, popups, popupDataService, Pop, Common,
              Table, Chart, basicService, $scope, $stateParams, $rootScope,
              dataService) {
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

    this.tabs = angular.copy(CommonCon.saleStockTabs);
    this.types = angular.copy(CommonCon.types);

    this.key = {
      active: 1,
      finish: false,
      page: CommonCon.pageType.financeGrossProfit,
      pageId: CommonCon.page.page_sale_financeProfit,
      dateType: 'month',
      paramShow: ["district"],
      rememberCom: true, // eChart 上各种点击事件要记住检索条件,
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
    this.com = Object.assign({date: "", comparableStores: false}, CommonCon.commonPro);

    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.financeAnalyze_grossProfitTable);
    this.originChart = angular.copy(this.Chart.financeAnalyze_grossProfitChart);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_SALE_FINANCE_GROSS_PROFIT;
    this.localChart = CommonCon.local.CHART_DATA_SALE_FINANCE_GROSS_PROFIT;

    // 初始化销售类型
    this.saleTypes = angular.copy(CommonCon.financeTypes);
    this.saleType = this.saleTypes[0].id;

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
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 监听订阅的事件
    this.tool.onEvent(this, this.key);
  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['district', 'storeGroup', 'brand', 'product', 'supplier']);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    // 初始化日期范围
    this.tool.pageInit(this, () => {
      const date = angular.copy(this.com.date);
      this.basic.packager(this.dataService.getFinProfitFinallyMonth(), res => {
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


    const chart = this.basic.getLocal(this.localChart);
    if (chart) {
      this.field.chart = chart;
    } else {

      const newChart = angular.copy(this.originChart);
      const fieldSale = this.tool.calculateChartField(newChart.sale, 'all');
      const fieldStock = this.tool.calculateChartField(newChart.stock);
      this.field.chart = {first: fieldSale, second: fieldStock};

    }
  }

  /**
   * 点击查询
   */
  search() {

    delete this.conditionTipsMessage;

    this.key.finish = false;

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.tool.commonSetTop(this.com);

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
    const promise = this.popups.popupFinanceGrossProfitChart({
      local: {
        origin: this.commonCon.local.CHART_ORIGIN_SALE_FINANCE_GROSS_PROFIT,
        data: this.commonCon.local.CHART_DATA_SALE_FINANCE_GROSS_PROFIT
      }
    });

    this.tool.dealModal(promise, res => {
      this.field.chart = res;
      this.field = Object.assign({}, this.field);
    });
  }

  /**
   * 获取table popup
   */
  getTableOption() {
    const promise = this.popups.popupFinanceGrossProfitTable({
      local: this.localTable,
      field: this.currFileds
    });

    this.tool.dealModal(promise, res => {
      this.field.table = res;
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

      // 监听商品条件选择
      this.tool.watchProduct(this);
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

angular.module("hs.saleStock").controller("financeGrossProfitCtrl", FinanceGrossProfitController);
