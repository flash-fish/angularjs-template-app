class SaleGrossProfitController {
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

    this.tabs = angular.copy(CommonCon.saleStockTabs);
    this.types = angular.copy(CommonCon.types);

    this.key = {
      active: 1,
      finish: false,
      page: CommonCon.pageType.grossProfit,
      pageId: CommonCon.page.page_sale_profit,
      router: "app.supAnalyse.subGrossProfit",
      paramShow: ["district"],
      rememberCom: true,
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
    this.currFileds = angular.copy(this.Table.grossProfit);
    this.originChart = angular.copy(this.Chart.grossProfit);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_SALE_GROSS_PROFIT;
    this.localChart = CommonCon.local.CHART_DATA_SALE_GROSS_PROFIT;

    // 初始化销售类型
    this.saleTypes = angular.copy(CommonCon.saleTypes);
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

    //eChart 上各种点击事件要记住检索条件
    this.rememberCom = true;
  }

  clearTable() {
    this.tableInfo = {};
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
    this.accessCom = this.tool.initByAccess(this.com, data, {
      setTopCache: true
    });
    this.com = angular.copy(this.accessCom);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com);

    // 获取MenuCondition的值用于判断当前页面的来源
    this.crumbInfo = this.tool.getMenuCondition(this.$state, this.com);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['district', 'storeGroup', 'brand', 'product', 'supplier']);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    if (this.tableInfo.page) {
      this.key.active = 7;
    }

    if (this.basic.getSession(this.common.option.resetField, true)) {
      this.setGrossProfitTableFields();
      this.setGrossProfitChartFields();
    }

    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    // 初始化日期范围
    this.tool.pageInit(this, () => {
      this.commonParam = angular.copy(this.com);
      this.showCondition();
    });
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
   * 设置毛利结构页面数据设定的默认值
   */
  setGrossProfitTableFields() {
    // 当前页面需要的指标结构
    let currFields = angular.copy(this.currFileds);
    const field = ['YoYValue', 'ToTValue', 'Pct'];

    _.forIn(currFields, (v, k) => {
      if (k === 'whole') {
        currFields[k].list.forEach(d => {
          //范围->经销
          d.model = d.id === 'distribution';
        })
      } else if (k === 'businessProfit') {
        //预估毛利栏的第一行四个指标选中
        currFields[k].list.forEach((d, i) => {
          d.model = i < 4;
          d.disable = i < 4 && field.some(f => f === d.id);
        })
      } else {
        currFields[k].list.forEach(d => {
          d.model = false;
          d.disable = field.some(f => f === d.id);
        })
      }
    });

    // 保存指标的local 毛利结构
    this.basic.setLocal(this.localTable, currFields);
  }

  setGrossProfitChartFields(){
    // 当前页面需要的指标结构
    let newChart = angular.copy(this.originChart);
    _.forIn(newChart.sale, (v, k) => {
      v.list.forEach(d=>{
        if(k === 'bar' && d.id === 'BusinessProfit'){
         d.check = true;
        }else {
          d.check = false;
        }

        if(k !== 'bar' && d.name === '无') d.check = true;

      })
    });

    let fieldSale = this.tool.calculateChartField(newChart.sale, 'distribution');

    this.field.chart = {first: fieldSale};
    // 将当前已选中的指标按照一定的结构保存到local中
    const type = this.saleTypes[1].id;

    // 将当前已选中的指标按照一定的结构保存到local中
    this.basic.setLocal(this.commonCon.local.CHART_ORIGIN_SALE_GROSS_PROFIT, {type: type, chart: newChart});

    const field = {first: this.tool.calculateChartField(newChart.sale)};

    // 将计算好的指标保存到local中
    this.basic.setLocal(this.localChart, field);

  }

  /**
   * 点击查询
   */
  search() {
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
    const promise = this.popups.popupGrossProfitChart({
      local: {
        origin: this.commonCon.local.CHART_ORIGIN_SALE_GROSS_PROFIT,
        data: this.commonCon.local.CHART_DATA_SALE_GROSS_PROFIT
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
    const promise = this.popups.popupGrossProfitTable({
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

angular.module("hs.saleStock").controller("saleGrossProfitCtrl", SaleGrossProfitController);
