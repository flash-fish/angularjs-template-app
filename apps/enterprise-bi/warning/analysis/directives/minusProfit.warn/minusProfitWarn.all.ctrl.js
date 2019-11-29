class MinusProfitWarnAllController {
  constructor($scope, $state, FigureService, CommonCon, tableService, toolService, popups, dataService,
              basicService, popupDataService, Common, Field, Symbols, Table, Chart, Warning, WarningService) {
    this.scope = $scope;
    this.$state = $state;
    this.popups = popups;
    this.common = Common;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.popupData = popupDataService;
    this.Warning = Warning;
    this.symbols = Symbols;
    this.Table = Table;
    this.Chart = Chart;
    this.WarningService = WarningService;

    // 异步中需要处理的数据
    this.back = {};

    this.instance = {};

    // 保存共通指标的地方
    this.field = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({
      date: '',
      filterCondition: {
        minusReason: ""
      }
    }, ["classes", "category", "brand"]);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 调用接口的方法名字
    this.interfaceName = "getMinusProfitAbnormalProduct";

    this.allminusReason = angular.copy(Warning.reason);

    this.com.checkbox = angular.copy(Warning.checkbox);

    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.minusProfitWarn);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_WARN_MINUS_PROFIT;

    this.sort = {
      date: 1,
      minusReason: 2,
      classes: 3,
      category: 4,
      brand: 5
    };

    this.otherCommon = angular.copy(Warning.otherCommon);
  }

  init() {
    // 获取用户权限后初始化页面field
    this.tool.getAccess((d) => {
      this.getMinusProfitDateProduct(d);
    });

    // 监听table指标变动
    this.tool.watchTable(this);
  }

  getMinusProfitDateProduct(d) {
    this.basic.packager(this.dataService.getMinusProfitDateProduct(), res => {
      if (res.data) {
        this.dateRange = res.data.map(i => {
          return moment(i, 'YYYYMMDD').format(String(i).length === 6 ? "YYYY/MM" : "YYYY/MM/DD");
        });

        this.com.date = this.dateRange[0];
      }

      this.initialize(d);
    });

  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 从目标页面点击返回时触发的逻辑
    this.tool.fromTargetToBackPage(this.com, this.tableInfo);

    // 初始化数据设定内容
    this.initField();

    this.initColumn2();

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      this.buildPageCondition();

      this.copyCom = angular.copy(this.com);
      this.buildOption();
      this.showCondition();
    }, true);
  }


  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, this.field.newTable),
      special: {
        pageId: this.CommonCon.page.page_abnormal_minus_profit
      }
    };

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      fixed: 4,
      row: this.rowCallback(),
      start: this.tableInfo.page ? this.tableInfo.page.start : 0,
      sort: this.tableInfo.sort ? this.tableInfo.sort : [4, 'asc'],
    });
    this.tableInfo = {};
  }

  initField() {
    this.field = {};

    // 初始化表格指标
    const table = this.basic.getLocal(this.localTable);

    const fields = table
      ? this.tool.getFieldFromLocal(table, this.currFileds)
      : this.currFileds;

    this.field.table = angular.copy(fields);
  }

  /**
   * 初始化构建Column
   * @param isChange
   */
  initColumn2(isChange) {
    this.tool.changeCol(this.field, isChange);
    this.buildColumn();
  }

  buildColumn() {
    const fix = this.tableService.fixedColumn([
      '_id',
      'productCode',
      {
        code: "productName",
        render: (data) => {
          return this.tool.buildLink(data);
        }
      },
      'spec'
    ]);

    const config = {
      pageId: this.CommonCon.page.page_abnormal_minus_profit,
      invalidFieldColor: true
    };

    const reason = [
      {
        code: "reason",
        name: "原因分析",
        notSort: true
      }
    ];

    const field = this.field.newTable.concat(reason);

    this.column = this.tableService.anyColumn(fix, field, this.Warning.warningField, config);
  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        let condition = angular.copy(this.copyCom);
        const date = this.copyCom.date + this.symbols.bar + this.copyCom.date;
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
            date,
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
          date
        };

        this.basic.setLocal(this.common.local.topCondition, copyCond);
        this.basic.setSession(this.common.option.resetField, true);

        this.$state.go("app.saleStockTop.saleGrossProfit");
      })
    };
  }

  /**
   * 查询按钮
   */
  search() {
    this.buildPageCondition();

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });

    this.showCondition();
  }


  buildPageCondition() {
    this.com.checkbox.forEach(s => {
      this.com.filterCondition[s.code] = s.check ? -1 : null;
    });
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    com.filterCondition.minusReason ?
      com.filterCondition.minusReason = this.allminusReason.find(r => _.eq(r.value, com.filterCondition.minusReason)).label
    : delete com.filterCondition.minusReason;
    const filterCondition = _.pick(com.filterCondition, this.com.checkbox.filter(f => f.check).map(c => c.code));
    const negativeGrossMargin = this.com.checkbox.filter(f =>
      _.keys(filterCondition).includes(f.code)).map(c => c.name).join(this.symbols.comma);
    com.filterCondition = _.omit(com.filterCondition, this.com.checkbox.map(c => c.code));
    if(negativeGrossMargin)
      com.filterCondition.negativeGrossMargin = negativeGrossMargin;
    this.sortCom = this.tool.dealSortData(com, this.sort, false, (list, pushFunc) => {
      this.WarningService.dealOtherCommon(list, pushFunc, this.sort, com, this.otherCommon)
    });
  }

  /**
   * 获取table popup
   */
  getTableOption() {
    const promise = this.popups.minusProfitWarnTable({field: this.currFileds});

    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.option.displayStart = 0;

      this.buildOption();

      this.initColumn2(true);
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


angular.module('hs.warning.menu').component('minusProfitWarn', {
  templateUrl: 'app/warning/analysis/directives/minusProfit.warn/minusProfitWarn.all.tpl.html',
  controller: MinusProfitWarnAllController,
  bindings: {
    keys: '=',
    tableInfo: '='
  }
});
