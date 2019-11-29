class ReturnDetailController {
  constructor(CommonCon, tableService, dataService, $scope, DTColumnBuilder, $compile, Table,
              toolService, basicService, $state, SaleStockSubMenu, FigureService, $stateParams,
              Common) {
    this.Table = Table;
    this.scope = $scope;
    this.$state = $state;
    this.common = Common;
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
    this.interfaceName = "getSupplyReturnDataByDate";

    this.instance = {};

    this.initShow = true;

    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', newVal => {
      this.noInit = newVal.noInit;
    }, true);

    this.storeRelate = [["store", "门店"], ["district", "地区"], ["operation", "业态"], ["storeGroup", "店群"]];

    this.sum = [
      {name: '实到商品金额(万元)', data: '-', isSale: true, code: "receiveRealNet2"},
      {name: '退货成本(去税)', data: '-', isSale: true, code: "retNet"},
      {name: '退货率', data: '-', isSale: false, code: "returnAmountRate"}
    ];
  }

  init() {
    // 获取路由参数的值用于子菜单渲染
    const info = this.stateParams.info;
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
          value: hasVal ? curr.map(c => `[${c.code}]${c.name}`).join(",") : ""
        }
      }

    });

    this.buildOption();
  }

  /**
   * 处理合计部分数据
   * @param sum
   */
  buildSum(sum) {
    if (!sum) return;

    this.sum.forEach(s => {
      const data = sum[s.code];

      s.option = s.isSale
        ? this.FigureService.number(data, true, true)
        : this.FigureService.scale(data, true, true);

      const origin = this.FigureService.changeNull(data);

      s.origin = s.isSale ? `${origin}元` : origin;
    })
  }

  buildOption() {
    const reField = [
      "returnAmountRate","retNet","receiveRealNet2"
    ];
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.com, reField),
      addSum: false,
      setSum: (s) => this.buildSum(s),
      special: {
        pageId: this.CommonCon.page.page_subSupplier_supplyReturnDetail
      }
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back), {pageLength: 100,sort: 0});
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
        sort: true
      },
      {
        code: "retNet",
        title: "退货商品金额(万元)",
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      }
    ];
    this.column = this.tableService.fixedColumn(fix);
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

angular.module("hs.supplier.saleStock").controller("returnDetailCtrl", ReturnDetailController);
