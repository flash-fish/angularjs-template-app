class SubSupplyController {
  constructor(CommonCon, toolService, SaleStockSubMenu, popups, dataService, popupDataService,
              Table, Pop, Chart, basicService, $scope, $state, $stateParams, $rootScope, Common, indexCompleteService, commonP, FigureService, SupplyRate) {
    this.Pop = Pop;
    this.Table = Table;
    this.Chart = Chart;
    this.scope = $scope;
    this.$state = $state;
    this.common = Common;
    this.popups = popups;
    this.root = $rootScope;
    this.tool = toolService;
    this.commonP = commonP;
    this.basic = basicService;
    this.state = $stateParams;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.indexService = indexCompleteService;
    this.popupDataService = popupDataService;
    this.FigureService = FigureService;
    this.SupplyRate = SupplyRate;

    this.menu = angular.copy(SaleStockSubMenu);

    // 保存共通条件的地方
    this.com = Object.assign({date: ""}, angular.copy(CommonCon.commonPro));
    this.com.logisticsMode = this.CommonCon.logisticsPattern[0].id;

    //日期控件
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};

    // 组件init数据
    this.material = angular.copy(this.commonP.GoodsRt);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};
    this.arriveInfo = {};

    // 当前页面需要的指标结构
    this.currFileds = ["returnAmountRate", "receiveQtyRate", "nonAmount", "avgDays"];

    // local fields
    this.localTableFields = this.CommonCon.local.TABLE_GOODS_TABLE_LOCAL;

    // local chart
    this.localOrignChart = this.CommonCon.local.TABLE_GOODS_ORIGIN_CHART_LOCAL;
    this.locaDataChart = this.CommonCon.local.TABLE_GOODS_DATA_CHART_LOCAL;

    // 当前页面需要的指标结构
    this.currlTableFields = angular.copy(this.Table.materialOptions);
    this.currNeedCharts = angular.copy(this.Chart.goodsAnalyze);

    // 同比指标
    this.ToTOptions = angular.copy(this.Table.excessYoYToTSetting);

    // 条件回复项配置
    this.PoPFilter = angular.copy(this.Pop.supplierTypes);


    this.key = {
      active: 1,
      finish: false,
      pageId: CommonCon.page.page_subSupplier_supply,
      TrendInterFace: ['getSupplyDataByDateSupply'],
      catGroupUrl:['getSupplyDataByClass'],
      categoryUrl:['getSupplyDataByCategory'],
      saleBrand:['getSupplyDataByBrand'],
      saleStore:[
        'getSupplyDataByStore', 'getSupplyDataByOperation', 'getSupplyDataByDistrict'
      ],
      itemProduct:[
        'getSupplyDataByProductSupply','getSupplyDataSummarySupply'
      ],
      Supplier:['getSupplyDataBySupplierSupply'],
      clickName: [
        this.commonP.QRate,
        this.commonP.ARate,
        this.commonP.reRate,
        this.commonP.tuRate
      ],
      routerRate:["app.supAnalyse.arrivalDetail","app.supAnalyse.returnDetail"],
      router:'app.supAnalyse.subSupply',
      returnLocal: this.commonP.local.supplierSupplyCondition
    };

    // 展示条件顺序和字段
    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      operation: 4,
      store: 5,
      logisticsMode: 6,
      receiveQtyRate: 7,
      returnAmountRate: 8,
      district: 9,
      storeGroup: 10,
      brand: 11,
      product: 12,
      supplier: 13
    }
  }

  init() {
    // 初始化搜索按钮状态
    this.condition_state = true;

    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);

    // 监听订阅的事件
    this.tool.onEvent(this);

    // 退货率 到货率参数构建
    this.indexService.watchGoodsRate(this);

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 组件状态函数调用
    this.indexService.watchFilter(this);
  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com);

    // 初始化com 和 subSession的值 返回fromSession
    const subPage = this.tool.subPageCondition(this.com);

    this.fromSession = subPage.fromSession;
    if (subPage.com) {
      this.subSession = subPage.com;
      this.com = subPage.com;
    }

    // 当前页面刷新后再点击返回 也要记住
    this.basic.setLocal(this.common.local.returnSubCondition, this.fromSession);

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['district', 'storeGroup', 'brand', 'product']);

    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    // 初始化com 和 subSession的值 返回fromSession(商品到货率，退货率session获取) 从详情页面跳转做
    this.indexService.getSession(this);

    // 页面初始化的基础逻辑
    this.indexService.pageInit(this, () => {
      this.commonParam = angular.copy(this.com);
      this.showCondition();
    });
  }

  /**
   * 初始化指标
   */
  initField() {
    // 初始化表格指标
    const table = this.basic.getLocal(this.localTableFields);
    const fields = table
      ? this.tool.getFieldFromLocal(table, this.currlTableFields)
      : this.currlTableFields;
    this.field.table = angular.copy(fields);

    // 初始化图表指标
    const chart = this.basic.getLocal(this.locaDataChart);
    if (chart) {
      this.field.chart = chart;
    } else {
      const orgin = angular.copy(this.currNeedCharts);
      const fieldSale = this.tool.calculateChartField(orgin.sale);
      this.field.chart = {first: fieldSale};
    }
  }

  /**
   * tab切换时候的逻辑
   */
  select(event) {
    this.indexService.tabsWatch(this, event, null, this.PoPFilter);
  }

  showCondition(){
    let com = angular.copy(this.commonParam);
    const getRateName  = rateType =>
      `${this.FigureService.scale(rateType.gtEqualNumber, 1, 1, 0)} ~ ${this.FigureService.scale(rateType.ltEqualNumber, 1, 1, 0)}`;
    if (com.receiveQtyRate) com.receiveQtyRate = getRateName(com.receiveQtyRate);
    if (com.returnAmountRate) com.returnAmountRate = getRateName(com.returnAmountRate);
    com.logisticsMode ?
      com.logisticsMode = this.CommonCon.logisticsPattern.find(l => l.id === com.logisticsMode).name
      : delete com.logisticsMode;
    this.sortCom = this.tool.dealSortData(com, this.sort, this.SupplyRate);
  }

  search() {
    this.key.finish = false;

    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    // 将当前条件设置到supplierCondition中
    this.indexService.commonSetTop(this.com, ['supplier']);

    this.commonParam = this.tool.commonSearch(this);

    this.showCondition();
  }

  /**
   * popup 接口
   */

  // 门店
  openStoreList() {
    const promise = this.popupDataService.openStore({selected: this.com.store.val});
    this.tool.dealModal(promise, res => {
      this.com.store.val = res ? res : [];
    });
  }

  // 类别
  openCat() {
    const promise = this.popupDataService.openCategory({selected: this.com.category.val});
    this.tool.dealModal(promise, res => {
      this.com.category.val = res ? res : [];
    });
  }

  // 品类组
  openClasses() {
    const promise = this.popupDataService.openClass({selected: this.com.classes.val});
    this.tool.dealModal(promise, res => {
      this.com.classes.val = res ? res : [];
    });
  }

  // 地区
  openDistrict() {
    const promise = this.popupDataService.openDistrict({selected: this.com.district.val});

    this.tool.dealModal(promise, res => {
      this.com.district.val = res ? res : [];
    });
  }

  // 业态
  openOperation() {
    const promise = this.popupDataService.openOperation({selected: this.com.operation.val});
    this.tool.dealModal(promise, res => {
      this.com.operation.val = res ? res : [];
    });
  }

  // 商店
  openItem() {
    const promise = this.popupDataService.openItem({selected: this.com.product.val});
    this.tool.dealModal(promise, res => {
      this.com.product.val = res ? res : [];
      // 监听商品条件选择
      this.tool.watchProduct(this);
    });
  }

  // 品牌
  openBrand() {
    const promise = this.popupDataService.openBrand({selected: this.com.brand.val});
    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  // 店群
  openStoreGroup() {
    const promise = this.popupDataService.openStoreGroup({selected: this.com.storeGroup.val});
    this.tool.dealModal(promise, res => {
      this.com.storeGroup.val = res ? res : [];
    });
  }

  // 数据设定
  getTableOption() {
    const promise = this.popups.popupSaleStockTable({
      field: this.currlTableFields,
      local: this.localTableFields,
      haveOptions: this.ToTOptions
    });

    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.field = Object.assign({}, this.field);
    });

  };

  // 图表设定
  openChartOption() {
    const promise = this.popups.popupMaterialAnalyze({
      local: {
        origin: this.localOrignChart,
        data: this.locaDataChart,
        viewFields: this.Chart.goodsAnalyze
      }
    });
    this.tool.dealModal(promise, res => {
      // 参数有否对比参数处理
      this.field.chart = res;
      this.field = Object.assign({}, this.field);
    });
  }


}

angular.module("hs.supplier.saleStock").controller("subSupplyCtrl", SubSupplyController);
