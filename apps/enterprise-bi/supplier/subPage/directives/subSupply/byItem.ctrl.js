class supplyByItemCtrl {
  constructor($sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder, Common, $templateCache,
              FigureService, basicService, Field, toolService, $state, $stateParams, SaleStockSubMenu) {
    this.$sce = $sce;
    this.scope = $scope;
    this.common = Common;
    this.$state = $state;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.stateParams = $stateParams;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;

    // 接口信息
    this.interfaceName = 'getSupplyDataByProduct';

    this.instance = {};

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.common);

    // 异步中需要处理的数据
    this.back = {};
    this.tool.watchBack(this);

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
    this.scope.$watch('ctrl.param', newVal => {
      if (!newVal) return;

      if (newVal.special && newVal.special.noClickSearch) {
        newVal.special.noClickSearch = false;
        return;
      }

      if (this.noInit) {
        this.loadChart = !this.loadChart;

        // 点击查询时将条件保存到session
        this.basic.setSession(this.CommonCon.session_key.hsParam, newVal);

        this.instance.reloadData();
      } else
        this.buildOption();
    });
  }

  initColumn() {
    this.buildColumn();
  }

  buildColumn() {
    const fix = [
      "_id",
      "productCode",
      "productName",
      "spec",
      "statusName",
      {
        code: "receiveQtyRate",
        title: `<span title="实到商品数/应到商品数"><i class="glyphicon glyphicon-info-sign"></i>到货率</span>`,
        render: (data, type, row) => {
          let formatData = this.FigureService.scale(data, true, true);
          return row._id === '整体合计' || (!data && data !== 0)
            ? `<span>${formatData}</span>`
            : `<a href='javascript: void(0);' class="arrivalRate">${formatData}</a>`;
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
          return `<span title="${title}">${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "avgDays",
        title: "平均早到天数",
        render: (data) => {
          let formatData = data ? Number(data).toFixed(2) : '-';
          return `<span>${this.basic.addColumnColor(data, formatData)}</span>`
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "returnAmountRate",
        title: `<span title="退货成本(除税)/实到商品金额(除税)"><i class="glyphicon glyphicon-info-sign"></i>退货率</span>`,
        render: (data, type, row) => {
          let formatData = this.FigureService.scale(data, true, true);
          return row._id === '整体合计' || data === 0
            ? `<span>${formatData}</span>`
            : `<a href='javascript: void(0);' class="returnRate">${formatData}</a>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "returnAmount",
        title: "退货成本(除税)(万元)",
        render: (data) => {
          let detail = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${detail}">${this.basic.addColumnColor(data, formatData)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
    ];
    this.column = this.tableService.fixedColumn(fix);
  }

  buildOption() {
    let f = ["returnAmountRate", "receiveQtyRate", "nonAmount", "avgDays"];
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.param, f),
      addSum: "_id",
      setSum: s => this.sum = s,
    };

    this.option = this.tableService
      .fromSource(this.tool.getData(this.key, this.back, this), {
        pageLength: 100,
        start: this.tableInfo.page ? this.tableInfo.page.start : 0,
        sort: this.tableInfo.sort ? this.tableInfo.sort : 6,
        fixed: 4,
        row: this.rowCallback()
      });
  }

  /**
   * 点击跳转到 到货率/退回率  详情页面
   * @returns {function(*=, *)}
   */
  rowCallback() {
    return (row, rowData) => {

      let jump = (state) => {
        const subCondition = this.basic.getLocal(this.common.local.subCondition);
        let condition = subCondition ? subCondition : angular.copy(this.param);

        const order = this.back.param.order[0];
        condition.sortInfo = [order.column, order.dir];
        condition.pageInfo = {start: this.back.param.start};

        // 设置当前点击的字段
        condition.click = {
          name: 'product',
          value: {
            val: [{
              code: rowData.productId,
              name: rowData.productName,
              productCode: rowData.productCode
            }], id: 7
          }
        };

        // 设置父页面的条件
        condition.fromTopParent = this.fromOne;

        this.basic.setSession(this.common.subDetailCondition, condition);

        const info = angular.copy(this.info);

        info.subMenuActive = this.menu;

        this.$state.go(state, {info: JSON.stringify(info)});
      };

      $(".arrivalRate", row).unbind('click').click(() => {
        jump("app.supAnalyse.arrivalDetail");
      });

      $(".returnRate", row).unbind('click').click(() => {
        jump("app.supAnalyse.returnDetail");
      })

    }

  }


}

angular.module('hs.supplier.saleStock').component('supplyByItem', {
  templateUrl: 'app/supplier/subPage/directives/subSupply/byItem.tpl.html',
  controller: supplyByItemCtrl,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    keys: '=',
    fromOne: '<',
    tableInfo: '<',
    menu: '<'
  }
});
