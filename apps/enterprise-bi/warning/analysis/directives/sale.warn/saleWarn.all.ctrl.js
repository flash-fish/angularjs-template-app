class saleWarnAllController {
  constructor($scope, FigureService, CommonCon, tableService, toolService, dataService,
              basicService, popupDataService, Symbols, Common, $state, WarningService, Warning) {
    this.Common = Common;
    this.scope = $scope;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.popupData = popupDataService;
    this.symbols = Symbols;
    this.$state = $state;
    this.warnServ = WarningService;

    // 异步中需要处理的数据
    this.back = {};

    this.instance = {};
    this.finish = true;

    // 保存共通条件的地方
    this.com = this.basic.initCondition({}, ["classes", "category", "brand"]);

    this.sort = {
      classes: 1,
      category: 2,
      brand: 3
    };

    this.otherCommon = angular.copy(Warning.otherCommon);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 调用接口的方法名字
    this.interfaceName = "getSaleAbnormalProduct";

    this.com.filter = {check: false, number: 1};
  }

  init() {
    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => {
      this.getDate(d);
    });

    this.watchFilter();
  }

  watchFilter() {
    this.scope.$watch('$ctrl.com.filter', newVal => {
      // this.finish = !newVal.check ? true : !_.isNull(newVal.number);
      this.finish_data = !newVal.check ? true : !_.isNull(newVal.number) && newVal.number !== '';
      this.dataStyle = newVal.check && (_.isNull(newVal.number) || newVal.number === '') ? 'label_true' : 'label_false';
    }, true);
  }

  initialize(data) {

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 从目标页面点击返回时触发的逻辑
    this.tool.fromTargetToBackPage(this.com, this.tableInfo);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 页面初始化的基础逻辑(copy条件变量)
    this.tool.pageInit(this, () => {
      this.buildCondition();

      this.copyCom = angular.copy(this.com);

      this.showCondition();

      this.buildOption();
      this.initColumn();
    }, true);

  }


  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, ''),
      special: {
        pageId: this.CommonCon.page.page_abnormal_sale
      }
    };
    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      fixed: 4,
      row: this.rowCallback(),
      compileBody: this.scope,
      start: this.tableInfo.page ? this.tableInfo.page.start : 0,
      sort: this.tableInfo.sort ? this.tableInfo.sort : 5,
    });
  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        let condition = angular.copy(this.copyCom);
        const rowClick = {
          id: "7",
          val: [{
            code: rowData.productId,
            name: rowData.productName,
            showCode: rowData.productCode
          }]
        };

        condition.click = {
          name: "product",
          value: rowClick,
          special: {
            date: this.dateRange,
            comparableStores: false
          }
        };

        let common = this.basic.initCondition({});
        let topCondition = Object.assign(common, condition);

        // 点击跳转到目标页面触发的逻辑
        this.tool.fromMenuClickToTarget(this.$state, this.back, topCondition);

        const copyCond = {
          product: rowClick,
          category: condition.category,
          classes: condition.classes,
          brand: condition.brand,
          date: this.dateRange
        };

        this.basic.setLocal(this.Common.local.topCondition, copyCond);
        this.basic.setSession(this.Common.option.resetField, true);

        this.$state.go("app.saleStockTop.saleStock");
      })
    };
  }

  buildCondition() {
    if (this.com.filter.check) {
      this.com.filterCondition = this.com.filter.number * 10000;
    } else {
      delete this.com.filterCondition;
    }
  }

  /**
   * 查询按钮
   */
  search() {
    this.buildCondition();

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });

    this.showCondition();
  }

  getDate(d) {
    this.basic.packager(this.dataService.getBaseDate(), res => {
      const date = moment(res.data.baseDate, this.symbols.normalDate);
      const seven = angular.copy(date).subtract(29, 'day');
      const lastDate = angular.copy(seven).subtract(1, 'day');
      const lastSeven = angular.copy(lastDate).subtract(29, 'day');
      this.dateRange = seven.format(this.symbols.slashDate) + this.symbols.bar + date.format(this.symbols.slashDate);
      this.lastDateRange = lastSeven.format(this.symbols.slashDate) + this.symbols.bar + lastDate.format(this.symbols.slashDate);

      this.initialize(d);
    });
  }

  initColumn() {

    const fix = [
      '_id',
      'productCode',
      {
        code: "productName",
        render: (data) => {
          return this.tool.buildLink(data);
        }
      },

      'spec',
      {
        code: 'retailAmountToT',
        title: "最近30天零售额跌幅",
        render: data => {
          let retailAmountToT = this.FigureService.scale(data, true, true);
          return `<span up-down change="${data}"></span>${retailAmountToT}`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: 'retailAmount',
        title: `最近30天零售额(万元)`,
        render: data => {

          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "retailAmountToTValue",
        title: `上个周期零售额(万元)`,
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

  showCondition(){
    let com = angular.copy(this.copyCom);
    this.sortCom = this.tool.dealSortData(com, this.sort, false, (list, pushFunc) => {
      this.warnServ.dealOtherCommon(list, pushFunc, this.sort, com, {name: '上个周期零售额', content: '大于'})
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

  openBrand() {
    const promise = this.popupData.openBrand({selected: this.com.brand.val});

    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }
}


angular.module('hs.warning.menu').component('saleWarnAll', {
  templateUrl: 'app/warning/analysis/directives/sale.warn/saleWarn.all.tpl.html',
  controller: saleWarnAllController,
  bindings: {
    keys: '=',
    tableInfo: '='
  }
});
