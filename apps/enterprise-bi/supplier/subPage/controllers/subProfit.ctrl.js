class SubProfitController {
  constructor(CommonCon, toolService, SaleStockSubMenu, popups, dataService,
              Table, Chart, basicService, $stateParams, $scope, $rootScope, CommSearchSort,
              popupDataService, Common) {
    this.Table = Table;
    this.Chart = Chart;
    this.scope = $scope;
    this.common = Common;
    this.popups = popups;
    this.root = $rootScope;
    this.tool = toolService;
    this.basic = basicService;
    this.state = $stateParams;
    this.commonCon = CommonCon;
    this.dataService = dataService;
    this.popupData = popupDataService;

    this.menu = angular.copy(SaleStockSubMenu);
    this.tabs = angular.copy(CommonCon.saleStockTabs);

    this.key = {
      active: 1,
      finish: false,
      noLink: true,
      page: CommonCon.pageType.profit,
      tabs: CommonCon.saleStockTabs.filter(s => [1, 2, 5].includes(s.id)),
      treeGridMinWidth: 175,
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
    this.com = Object.assign({date: ""}, CommonCon.commonPro);
    delete this.com.category;

    // 获取收益页面的当前tab
    this.currentTab = this.tool.getCurrentTab(this.key.active);

    this.sort = angular.copy(CommSearchSort);

    this.sort.operation = 5;
    this.sort.store = 4;
  }

  init() {
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 品类组和门店相关条件的相互影响
    this.tool.effectCondition(this);
  }

  select(event) {
    // 切换tab 清除tableParam 的 sessionStorage
    sessionStorage.removeItem(this.commonCon.session_key.tableParam);

    if (!this.isBoss || !this.chartData) return;

    this.tabFinish = false;

    setTimeout(() => {
      // 获取收益页面的当前tab
      this.currentTab = this.tool.getCurrentTab(this.key.active);

      this.field.chart = angular.copy(this.chartData[this.currentTab]);
      this.field.table = angular.copy(this.tableData[this.currentTab]);

      if (event) this.field = angular.copy(this.field);

      this.tabFinish = true;
    }, 200);
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

    // 初始化fromSession
    const subPage = this.tool.subPageCondition(this.com, null, {
      job: this.job,
      reset: ['classes']
    });

    this.fromSession = subPage.fromSession;
    if (subPage.com) {
      this.subSession = subPage.com;

      this.tool.dealTheStore(subPage.com);
      this.com = subPage.com;
    }

    this.key.pageId = `${this.commonCon.page.page_subSupplier_income}_${this.job}`;

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

  initField() {
    // 保存指标的local
    this.localTable = `${this.commonCon.local.TABLE_ORIGIN_SUP_PROFIT}_${this.job}`;
    this.localChart = `${this.commonCon.local.CHART_DATA_SUP_PROFIT}_${this.job}`;

    // 获取当前页面的可选指标
    this.currFileds = angular.copy(this.Table.profit);

    // 初始化表格指标
    this.tool.initTableProfitField(this);

    // 初始化图表指标
    const chart = this.basic.getLocal(this.localChart);
    const newChart = chart ? chart : this.tool.getProfitChart(this.job, this.Chart.profit).field;

    this.chartData = angular.copy(newChart);
    if (!this.isBoss) {
      this.field.chart = newChart;
      this.tabFinish = true;
    }
  }

  showCondition(){
    let com = angular.copy(this.com);
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

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
    const promise = this.popups.popupProfitChart({
      job: this.job,
      tab: this.key.active,
      key: {
        changeTab: {
          index: 0,
          content: {id: "1", name: "按趋势", href: this.commonCon.jobTypes.all, active: true}
        }
      }
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
    const promise = this.popups.popupProfitTable({
      field: this.currFileds,
      tab: this.key.active,
      job: this.job,
      key: {
        changeTab: {
          index: 0,
          content: {id: "1", name: "按趋势", href: this.commonCon.jobTypes.all, active: true}
        }
      }
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
}

angular.module("hs.supplier.saleStock").controller("subProfitCtrl", SubProfitController);
