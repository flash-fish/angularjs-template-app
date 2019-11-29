class ChannelProfitController {
  constructor(CommonCon, toolService, popups, popupDataService, Pop, Common,
              Table, Chart, basicService, $scope, $stateParams, $rootScope,
              dataService, SaleStockSubMenu, FigureService) {
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
    this.figure = FigureService;
    this.dataService = dataService;
    this.popupData = popupDataService;

    this.menu = angular.copy(SaleStockSubMenu);
    this.tabs = angular.copy(CommonCon.channelProfitTabs);

    this.key = {
      active: 1,
      finish: false,
      link: [2, 5],
      noLink: [7],
      goTab: {store: 9, cat: 8},
      tabs: this.tabs,
      page: CommonCon.pageType.channelProfit,
      treeGridMinWidth: 180,
      rememberCom: true,
      showFutureToggle: true,//显示隐藏未来日模式
      barring_FutureDate: true//框选能否包含未来日
    };

    // 日期控件配置
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};

    // 保存共通条件的地方
    this.com = Object.assign({date: ""}, CommonCon.commonPro);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_CHANNEL_PROFIT;
    this.localChart = CommonCon.local.CHART_DATA_CHANNEL_PROFIT;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    //eChart 上各种点击事件要记住检索条件
    this.rememberCom = true;

    // tab信息
    this.tabTypes = angular.copy(this.tool.getTabTypes());

    this.needBossAuth = true;

    this.storeOtherTab = {id: "20", name: "按趋势/供应商", href: 'storeOther', active: false};

    // 展示条件展示顺序和条件
    this.sort = {
      date: 1,
      classes: 2,
      operation: 5,
      store: 4,
      district: 7,
      storeGroup: 8,
      supplier: 11
    };
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

    this.scope.$on('CAL_FIELD', e => {
      if (!this.isBoss) {
        const currentTab = this.tabTypes.find(t => t.id.includes(this.key.active));
        if (currentTab && '89'.includes(this.key.active))
          this.jobTab = angular.copy(currentTab.href);
        this.tool.initTableProfitField(this);
      }
    });
  }

  select(event) {
    if (this.key.fuzzyFilter) delete this.key.fuzzyFilter;
    if (!this.isBoss) {
      if (this.isStore) {
        if (event && event.target.text === '按门店') {
          delete this.jobTab;
          this.currentTab = angular.copy(this.job);
        } else this.jobTab = angular.copy(this.storeOtherTab.href);
        this.field.chart = angular.copy(this.chartData[this.jobTab ? this.jobTab : this.currentTab]);
      } else delete this.jobTab;
      this.tool.initTableProfitField(this);
    } else {
      this.tabFinish = false;

      setTimeout(() => {
        // 获取收益页面的当前tab
        this.currentTab = this.tabTypes.find(t => t.id.includes(this.key.active)).href;

        this.field.chart = angular.copy(this.chartData[this.currentTab]);
        this.field.table = angular.copy(this.tableData[this.currentTab]);

        if (event) this.field = angular.copy(this.field);

        this.tabFinish = true;
      }, 100);
    }
  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);
    this.isBoss = this.tool.isBoss(this.job);
    this.key.isBoss = this.isBoss;
    this.key.job = this.job;

    this.isStore = this.job === this.commonCon.jobTypes.store;

    const tabTypes = [
      {id: "8", name: "按采购费用代码", href: 'costCodeForBuyer', active: false},
      {id: "9", name: "按营运费用代码", href: 'costCodeForStore', active: false}
    ];
    if (this.isStore)
      this.tabTypes.unshift(this.storeOtherTab);
    this.tabTypes = _.concat(this.tabTypes, tabTypes);


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

    this.key.pageId = `${this.commonCon.page.page_channel_profit}_${this.job}`;

    this.local = {
      origin: `${this.commonCon.local.CHART_ORIGIN_CHANNEL_PROFIT}_${this.job}`,
      data: `${this.commonCon.local.CHART_DATA_CHANNEL_PROFIT}_${this.job}`
    };

    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    // 初始化日期范围
    this.tool.pageInit(this, () => {
      this.commonParam = angular.copy(this.com);
      this.showCondition();
    });
  }

  /**
   * 初始化指标
   */
  initField() {
    // 保存指标的local
    this.localTable = `${this.commonCon.local.TABLE_ORIGIN_CHANNEL_PROFIT}_${this.job}`;
    this.localChart = `${this.commonCon.local.CHART_DATA_CHANNEL_PROFIT}_${this.job}`;

    // 获取当前页面的可选指标
    this.currFileds = angular.copy(this.Table.channelProfit);
    if (!this.isBoss) {
      const jobs = _.keys(this.commonCon.jobTypes).filter(j => this.isBoss || j !== this.job);
      jobs.forEach(job => delete this.currFileds['costCodeFor' + _.capitalize(job)]);
    }

    this.tool.initTableProfitField(this);

    // 初始化图表指标
    const chart = this.basic.getLocal(this.localChart);

    const getChart = () => {
      if (this.isStore) {
        let profit = this.tool.getProfitChart(this.job, this.Chart.channelProfit);
        const storeOtherProfit = this.tool.getProfitChart(this.storeOtherTab.href, this.Chart.channelProfit);
        let newProfit = {chart: {}, field: {}};
        newProfit.chart[this.job] = angular.copy(profit.chart);
        newProfit.chart[this.storeOtherTab.href] = angular.copy(storeOtherProfit.chart);
        newProfit.field[this.job] = angular.copy(profit.field);
        newProfit.field[this.storeOtherTab.href] = angular.copy(storeOtherProfit.field);
        profit = angular.copy(newProfit);
        return profit.field;
      } else return this.tool.getProfitChart(this.job, this.Chart.channelProfit).field;
    };

    const newChart = chart ? chart : getChart();

    this.chartData = angular.copy(newChart);

    if (!this.isBoss && !this.isStore) this.field.chart = newChart;
  }

  /**
   * 点击查询
   */
  search() {
    this.key.finish = false;

    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.tool.profitSearch(this.topCondition, this.com);

    this.commonParam = this.tool.commonSearch(this);

    this.showCondition();
  }

  /**
   * 展示条件
   */
  showCondition(){
    let com = angular.copy(this.commonParam);
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

  /**
   * 获取chart popup
   */
  getChartOption() {
    const promise = this.popups.popupChannelProfitChart({
      local: this.local,
      job: this.job,
      tab: this.key.active,
      key: {
        changeTab: {isUnshift: true, content: angular.copy(this.storeOtherTab)}
      }
    });

    this.tool.dealModal(promise, res => {
      this.chartData = res;

      const notBossGetRes = res => {
        if (this.isStore) {
          const filter = this.tabTypes.filter(t => '5'.includes(t.id) || t.id === '20');
          let currentTab = filter.find(t => t.id.includes(this.key.active));
          // 补丁，当为门店时有特殊处理
          let storeOtherTab = filter.find(t => '17'.includes(this.key.active) && t.id === '20');
          const job = currentTab ? currentTab.href : storeOtherTab ? storeOtherTab.href : this.job;
          return res[job];
        } else return res;
      };

      this.field.chart = this.isBoss ? res[this.currentTab] : notBossGetRes(res);
      this.field = Object.assign({}, this.field);
    });
  }

  /**
   * 获取table popup
   */
  getTableOption() {
    const promise = this.popups.popupChannelProfitTable({
      local: this.localTable,
      field: this.currFileds,
      tab: this.key.active,
      job: this.job,
      costCodeTab: true,
      tabTypes: this.tabTypes.filter(t => '89'.includes(t.id)),
      storeOtherTab:  angular.copy(this.storeOtherTab)
    });

    const notBossGetRes = res => {
      const filter = this.tabTypes.filter(t => '89'.includes(t.id) || t.id === '20');
      let currentTab = filter.find(t => t.id.includes(this.key.active));
      // 补丁，当为门店时有特殊处理
      let storeOtherTab = filter.find(t => '17'.includes(this.key.active) && t.id === '20');
      const job = currentTab ? currentTab.href : storeOtherTab ? storeOtherTab.href : this.job;
      return res[job];
    };

    this.tool.dealModal(promise, res => {
      this.tableData = res;

      this.field.table = this.isBoss ? res[this.currentTab] : notBossGetRes(res);
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

angular.module("hs.saleStock").controller("channelProfitCtrl", ChannelProfitController);
