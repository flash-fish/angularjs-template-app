class SubSaleStockController {
  constructor(CommonCon, toolService, SaleStockSubMenu, popups, popupDataService, Pop, Common,
              Table, Chart, basicService, $scope, $stateParams, $rootScope, CommSearchSort,
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

    this.menu = angular.copy(SaleStockSubMenu);
    this.tabs = angular.copy(CommonCon.saleStockTabs);
    _.remove(this.tabs, n => n.id === 7);

    this.types = angular.copy(CommonCon.types);

    this.key = {
      active: 1,
      finish: false,
      tabs: this.tabs,
      haveStock: true,
      haveSaleWayPct: true,
      page: CommonCon.pageType.sale,
      pageId: CommonCon.page.page_subSupplier_saleStock,
      categoryUrl: ["getSupplierCategoryRankingForSale", "getSupplierCategoryTreeForSale"],
      paramShow: ["district"],
      treeGridMinWidth: 145,
      rememberCom: true,
      isSubMenu: true,
      showFutureToggle: true,
      barring_FutureDate: true//框选能否包含未来日
    };

    // 日期控件配置
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};

    // 保存共通条件的地方
    this.com = Object.assign({date: "", comparableStores: false}, CommonCon.commonPro);

    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.saleStock);
    delete this.currFileds.other;
    this.originChart = angular.copy(this.Chart.saleStock);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_SUP_SALE_STOCK;
    this.localChart = CommonCon.local.CHART_DATA_SUP_SALE_STOCK;

    this.sort = angular.copy(CommSearchSort);
  }

  init() {
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));
  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 初始化com 和 subSession的值 返回fromSession
    const subPage = this.tool.subPageCondition(this.com);
    this.fromSession = subPage.fromSession;
    if (subPage.com) {
      this.subSession = subPage.com;
      this.com = subPage.com;
    }

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['district', 'storeGroup', 'brand', 'product']);

    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      this.commonParam = angular.copy(this.com);
      this.showCondition();
    });

    // 监听订阅的事件
    this.tool.onEvent(this, this.key);
  }

  showCondition(){
    let com = angular.copy(this.commonParam);
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

  /**
   * tab切换时候的逻辑
   */
  select(event) {
    this.tool.tabChanged(this, event, ["supplier"]);
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
      const fieldSale = this.tool.calculateChartField(this.originChart.sale, 'all');
      const fieldStock = this.tool.calculateChartField(this.originChart.stock);
      this.field.chart = {first: fieldSale, second: fieldStock};
    }
  }

  /**
   * 点击查询
   */
  search() {
    this.key.finish = false;

    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    // 将当前条件设置到subCondition中
    this.tool.commonSetSub(this.com, this.subSession);

    this.commonParam = this.tool.commonSearch(this);

    this.showCondition();
  }


  /**
   * 获取chart popup
   */
  getChartOption() {
    const promise = this.popups.popupSaleStockChart({
      change: [
        {name: "sale", type: "line", list: [8, 9]}
      ],
      removeField: [
        {key:'sale', field: 'flowCntProportion', replace:'ProfitRate'},
        {key:'sale', field: 'flowCntProportionYoYValue', replace:'ProfitRateYoYValue'}
      ]
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
    const promise = this.popups.popupSaleStockTable({
      field: this.currFileds,
      change: [{name: "order", list: [3], remove: true}, {name:'order', key: {col: 4}}]
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
}

angular.module("hs.supplier.saleStock").controller("subSaleStockCtrl", SubSaleStockController);
