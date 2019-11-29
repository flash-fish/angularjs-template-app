class arrivalDetailController {
  constructor(CommonCon, tableService, dataService, $scope, DTColumnBuilder, $compile, Table,
              toolService, basicService, $state, SaleStockSubMenu, FigureService, $stateParams,
              Common) {
    this.Table = Table;
    this.scope = $scope;
    this.common = Common;
    this.$state = $state;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.stateParams = $stateParams;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;

    this.menu = angular.copy(SaleStockSubMenu);

    // 该页面接口
    this.interfaceName = "getSupplyArrivalDataByDate";

    this.instance = {};

    this.initShow = true;

    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', newVal => {
      this.noInit = newVal.noInit;
    }, true);

    this.storeRelate = [["store", "门店"], ["district", "地区"], ["operation", "业态"], ["storeGroup", "店群"]];
  }

  init() {

    // 获取路由参数的值用于子菜单渲染
    const info = this.stateParams.info;
    if (info) this.info = JSON.parse(info);

    // 初始化Column
    this.initColumn();

    // 监听共通条件的变动
    this.watchParam();

  }

  watchParam() {
    // 一级菜单跳转
    this.fromSubSession = this.basic.getSession(this.common.subDetailCondition, true);

    if (!this.fromSubSession){
      this.fromSubSession = this.basic.getLocal(this.common.local.returnSubCondition);
    }

    if (this.fromSubSession) {
      const from = angular.copy(this.fromSubSession);

      if(from.material){
        this.initShow = false;
        angular.element('.subLack').css('margin-left',0);
      }else {
         delete from.pageInfo;
         delete from.sortInfo;
         angular.element('.subLack').css('margin-left','165px');
      }

      const click = from.click;
      if (click) from[click.name] = click.value;

      this.com = angular.copy(from);

      this.product = this.com.product.val[0];

      // 到货率-同期值跳转日期设定
      if(this.fromSubSession.lastYoYValue){
        this.fromSubSession.date = this.fromSubSession.lastYoYValue.date;
        delete this.fromSubSession.lastYoYValue;
      }

      // 当前页面刷新后再点击返回 也要记住
      this.basic.setLocal(this.common.local.returnSubCondition, this.fromSubSession);
    }

    this.stores = this.storeRelate.map(s => {
      if (this.com[s[0]]) {
        const curr = this.com[s[0]].val;
        const hasVal = this.FigureService.haveValue(curr);
        return {
          name: s[1],
          value: hasVal ? curr.map(c => `[${c.code}]${c.name}`).join(" , ") : ""
        }
      }

    });

    if(this.com.logisticsMode){
      this.style = this.CommonCon.logisticsPattern[Number(this.com.logisticsMode)].name;
    }


    this.scope.$watch('ctrl.com', newVal => {

      if (!newVal) return;

      if (this.noInit) {
        this.loadChart = !this.loadChart;

        // 点击查询时将条件保存到session
        this.basic.setSession(this.CommonCon.session_key.hsParam, newVal);

        this.instance.rerender();
      } else
        this.buildOption();
    });
  }


  initColumn() {
    this.buildColumn();
  }

  buildColumn() {
    const fix = [
      {
        code: 'dateCode',
        title: "日期",
        render: (data) => {
          let formatData = data !== '整体合计' ? moment(data, 'YYYYMMDD').format('YYYY/MM/DD') : data;
          return `<span class="weather">${formatData}</span><span class="weatherBox">aaaa</span>`;
        },
        class: 'text-left',
        sort: true,
      },
      {
        code: "orderQty",
        title: "应到商品数量",
        render: (data) => {
          let formatData = this.FigureService.number(data, false, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "receiveChkQty",
        title: "实到商品数量",
        render: (data) => {
          let formatData = this.FigureService.number(data, false, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "nonQty",
        title: "未到商品数量",
        render: (data) => {
          let formatData = this.FigureService.number(data, false, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "nonAmount",
        title: "未到商品金额(万元)",
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "receiveQtyRate",
        title: `<span title="实到商品数/应到商品数"><i class="glyphicon glyphicon-info-sign"></i>到货率</span>`,
        render: (data) => {
          let formatData = this.FigureService.scale(data, true, true);
          return `<span>${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
    ];

    this.column = this.tableService.fixedColumn(fix);
  }

  buildOption() {
    let f = ["nonQty","receiveChkQty", "orderQty", "nonAmount", "receiveQtyRate"];

    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.com, f),
      addSum: "dateCode",
      special: {
        pageId: this.CommonCon.page.page_subSupplier_supplyArrivalDetail
      }
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back), {pageLength: 100,sort: 0})
      .withOption("rowCallback", (row, aData) => this.rowCallback(row, aData));
  }

  rowCallback(row, aData) {
    $(".detail", row).unbind('click');
    $(".detail", row).click(() => {
      this.$state.go();
    })
  }

  backTo() {
    let data = {
      active: 7,
      session: this.fromSubSession,
      rInfo: this.fromSubSession.routerInfo
        ? this.fromSubSession.routerInfo : '',
    };

    // 当前页面刷新后再点击返回 也要记住
    this.basic.setSession(this.common.subDetailCondition, data);

    const _router = [
      "app.supAnalyse.subSupply",
      "app.supAnalyse.supplierSupply"
    ];

    let _Info = _.eq(this.info.from,_router[1]) ? _router[0] : this.info.from;

    this.$state.go(_Info, {info: JSON.stringify(this.info)});
  }
}

angular.module("hs.supplier.saleStock").controller("arrivalDetailCtrl", arrivalDetailController);
