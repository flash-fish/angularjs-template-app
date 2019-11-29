class newItemSaleStockController {
  constructor(CommonCon, toolService, popups, popupDataService, Pop,
              Common, Table, Chart, basicService, $scope, $stateParams,
              $rootScope, dataService, $state) {
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
    this.tabs = angular.copy(this.commonCon.saleStockTabs);
    this.types = angular.copy(this.commonCon.types);
    this.$state = $state;

    this.key = {
      active: 1,
      finish: false,
      haveStock: true,
      haveSaleWayPct: true,
      appendField: ["storeCountLatest"],
      page: this.commonCon.pageType.sale,
      pageId: CommonCon.page.page_new_saleStock,
      paramShow: ["district"],
      rememberCom: true,
      itemTabNew: "newProduct", // 新品销售库存的按商品tab  商品字段为newProduct
      showFutureToggle: true,
      barring_FutureDate: true//框选能否包含未来日
    };

    /*@ param data-setting */
    this.dateOption = {noCrossYear: true};

    /*公共指标 @param this.field*/
    this.field = {};

    /*公共参数 @param save this.com*/
    this.com = Object.assign({
      date: "",
      comparableStores: false,
      fromPage_delete: "",
      newProduct: {val: [], id: '10'},
      newProductYear: ''
    }, this.commonCon.commonPro);
    delete this.com.product;

    let nowYear = Number(moment().format('YYYY')); //今年
    this.new_product_Year = [
      {id: nowYear, name: nowYear + '年新品', active: true},
      {id: nowYear - 1, name: nowYear - 1 + '年新品', active: false}
    ];

    this.com.newProductYear = this.new_product_Year[0].id;

    /*当前页面需要的指标结构 @from Table->newProductAnalyze_TABLE*/
    this.currFileds = angular.copy(this.Table.newProductAnalyze_TABLE);
    this.originChart = angular.copy(this.Chart.newProductAnalyze_CHART);

    /*定义本地储存storage值*/
    this.localTabel = this.commonCon.local.TABLE_ORIGIN_NEW_SALE_STOCK;
    this.localChart = this.commonCon.local.CHART_DATA_NEW_SALE_STOCK;
    this.localOriginChart = this.commonCon.local.CHART_ORIGIN_NEW_SALE_STOCK;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      operation: 4,
      store: 5,
      newProductYear: 6,
      district: 7,
      storeGroup: 8,
      brand: 9,
      // product: 10,
      newProduct: 10,
      supplier: 12
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

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);
    this.isBoss = this.tool.isBoss(this.job);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com, () => {
      this.com.newProductYear = this.com.newProductYear ? Number(this.com.newProductYear) : this.new_product_Year[0].id;
    }, null, {
      job: this.job,
      reset: ['classes']
    });

    // 获取MenuCondition的值用于判断当前页面的来源
    this.crumbInfo = this.tool.getMenuCondition(this.$state, this.com);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['district', 'storeGroup', 'brand', 'newProduct', 'supplier']);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 分页信息存在的场合 认为是从子页面返回的 否则再去判断是否是其他菜单跳转过来的
    if (this.tableInfo.page) {
      this.key.active = 6;

    } else {
      if (this.com.fromPage_delete) {
        this.key.active = 5;
        this.com.newProductYear = Number(this.com.date.slice(0, 4));
        this.basic.removeLocal(this.localTabel);
        this.basic.removeLocal(this.localChart);
        this.basic.removeLocal(this.localOriginChart);
      }
    }

    this.key.table_Info = this.tableInfo;

    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    const date = angular.copy(this.com.date);
    this.com.date = '';
    // 初始化日期范围
    this.tool.pageInit(this, (d) => {
      this.tool.dateConditionSave(this, date, null, Object.assign({}, this.dateOption));
      this.commonParam = angular.copy(this.com);
      this.showCondition();
    });
  }

  clearTable() {
    this.tableInfo = {};
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
    /*初始化表格指标*/
    const table = this.basic.getLocal(this.localTabel);
    const fields = table ? this.tool.getFieldFromLocal(table, this.currFileds) : this.currFileds;
    this.field.table = angular.copy(fields);

    /*初始化图表指标*/
    const chart = this.basic.getLocal(this.localChart);
    if (chart) {
      this.field.chart = chart;
    } else {
      const orgin = angular.copy(this.originChart);
      const fieldSale = this.tool.calculateChartField(orgin.sale, 'all');
      const fieldStock = this.tool.calculateChartField(orgin.stock);
      this.field.chart = {first: fieldSale, second: fieldStock};
    }
  }

  /*chart-setting*/
  getChartOption() {
    const promise = this.popups.popupNewSaleStock({
      local: {
        origin: this.localOriginChart,
        data: this.localChart
      }
    });

    this.tool.dealModal(promise, res => {
      this.field.chart = res;
      this.field = Object.assign({}, this.field);
    });
  }

  /*table-setting*/
  getTableOption() {
    const promise = this.popups.popupSaleStockTable({
      field: this.currFileds,
      local: this.localTabel
    });
    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.field = Object.assign(this.field, this.supplierTabel);
    });
  }

  /*@ param search*/
  search() {
    this.key.finish = false;

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.tool.commonSetTop(this.com, null , null, ['newProductYear']);

    this.commonParam = this.tool.commonSearch(this);
    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.commonParam);
    com.newProductYear = `${com.newProductYear}年新品`;
    this.sortCom = this.tool.dealSortData(com, this.sort, {newProductYear: {name: '新品年份'}, newProduct: {name: '商品', type: 0}});
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

  /* @ param 新品popup */
  openItem() {
    const promise = this.popupData.openNewProduct({
      selected: this.com.newProduct.val,
      years: this.com.newProductYear,
      baseYear: this.baseYear
    });
    this.tool.dealModal(promise, res => {
      this.com.newProduct.val = res ? res : [];

      // 监听商品条件选择
      this.tool.watchProduct(this, "newProduct");
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


angular.module("hs.productAnalyze.news").controller("newItemSaleStockCtrl", newItemSaleStockController);

