class SubLackDetailController {
  constructor(CommonCon, toolService, dataService, SaleStockSubMenu, tableService, FigureService,
              DTColumnBuilder, $state, basicService, $stateParams, $scope, $compile, Common) {
    this.scope = $scope;
    this.common = Common;
    this.$state = $state;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.$stateParams = $stateParams;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;

    this.menu = angular.copy(SaleStockSubMenu);

    this.instance = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({date: ""}, ["classes", "brand", "category", "product"]);

    // 接口信息
    this.interfaceName = 'getStockOutDataByDatePeriod';

    //保存的跳转信息
    this.productName = '';

    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', newVal => {
      this.noInit = newVal.noInit;
    }, true);
  }

  init() {
    // 获取路由参数的值用于子菜单渲染
    const info = this.$stateParams.info;
    if (info) this.info = JSON.parse(info);

    // 初始化Column
    this.initColumn();

    // 初始化数据
    this.initData();
  }

  initData() {
    this.fromSubSession = this.basic.getSession(this.common.subDetailCondition, true);

    if (!this.fromSubSession) this.fromSubSession = this.basic.getLocal(this.common.local.returnSubCondition);

    if (this.fromSubSession) {
      const from = angular.copy(this.fromSubSession);
      const click = from.click;
      if (click) from[click.name] = click.value;

      delete from.pageInfo;
      delete from.sortInfo;

      this.com = angular.copy(from);

      this.product = this.com.product.val[0];


      // 当前页面刷新后再点击返回 也要记住
      this.basic.setLocal(this.common.local.returnSubCondition, this.fromSubSession);
    }

    this.buildOption();

  }

  initColumn() {
    this.buildColumn();
  }

  buildColumn() {
    const fix = [
      {
        code: "stockOutStartDate",
        title: "开始日期",
        render: (data) => {
          let formatData = data !== '整体合计' ? moment(data, 'YYYYMMDD').format('YYYY/MM/DD') : data;
          return `<span>${formatData}</span>`;
        },
        sort: true,
      },
      {
        code: "stockOutEndDate",
        title: "结束日期",
        render: (data) => {
          let formatData = data ? moment(data, 'YYYYMMDD').format('YYYY/MM/DD') : '';
          return `<span>${formatData}</span>`;
        },
        class: 'text-right',
      },
      {
        code: "stockOutDays",
        title: "加注缺品天数",
        render: (data) => {
          return this.FigureService.number(data, false, true);
        },
        class: 'text-right',
      },
    ];

    this.column = this.tableService.fixedColumn(fix);

  }

  buildOption() {
    let f = ["stockOutDays"];
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.com, f),
      addSum: 'stockOutStartDate',
      special: {
        pageId: this.CommonCon.page.page_subSupplier_lackDetail
      }
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back), {pageLength: 100,sort: 0});
  }

  backTo() {
    let data = {
      session: this.fromSubSession
    };

    // 当前页面刷新后再点击返回 也要记住
    this.basic.setSession(this.common.subDetailCondition, data);

    this.$state.go("app.supAnalyse.subLack", {info: JSON.stringify(this.info)});
  }
}

angular.module("hs.supplier.saleStock").controller("subLackDetailCtrl", SubLackDetailController);
