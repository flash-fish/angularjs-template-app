class NoSaleWarnAllController {
  constructor($scope, FigureService, CommonCon, tableService, toolService, dataService,
              basicService, popupDataService, Symbols, Warning, Common, WarningService) {
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
    this.Common = Common;
    this.warnServ = WarningService;

    // 异步中需要处理的数据
    this.back = {};

    this.instance = {};
    this.finish = true;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 调用接口的方法名字
    this.interfaceName = "getNoSaleAbnormalProduct";

    this.allTimeCycle = angular.copy(Warning.timeCycle);
    this.allCompareStoreCost = angular.copy(Warning.compare);
    this.allCompareStoreCount = angular.copy(Warning.compare);

    // 保存共通条件的地方
    this.com = this.basic.initCondition({
      filterCondition: {}
    }, ["classes", "category", "brand"]);

    this.sort = {
      classes: 1,
      category: 2,
      brand: 3,
      dataLevel: 4,
      importDate: 5,
      stockCost: 6,
      storeCount: 7
    };

    this.otherCommon = angular.copy(Warning.otherCommon);

    this.filter = {
      dataLevel: {data: this.allTimeCycle[0].id},
      importDate: {check: true, data: 15},
      stockCost: {check: false, data: {compare: this.allCompareStoreCost[0].id, number: 1}, sale: true},
      storeCount: {check: false, data: {compare: this.allCompareStoreCount[0].id, number: 30}}
    }
  }

  init() {
    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => {
      this.getDate(d);
    });

    this.watchFilter();
  }

  getDate(d) {
    this.basic.packager(this.dataService.getBaseDate(), res => {
      const date = moment(res.data.baseDate, this.symbols.normalDate);
      const seven = angular.copy(date).subtract(29, 'day');
      const lastDate = angular.copy(seven).subtract(1, 'day');
      const lastSeven = angular.copy(lastDate).subtract(29, 'day');
      this.dateRange = seven.format(this.symbols.slashMonth) + this.symbols.bar + date.format(this.symbols.slashMonth) + "&nbsp;销售额";
      this.lastDateRange = lastSeven.format(this.symbols.slashMonth) + this.symbols.bar + lastDate.format(this.symbols.slashMonth) + "&nbsp;销售额";

      this.initialize(d);
    });
  }

  changeDate() {
    if (!this.filter.dataLevel.data) return;
    this.filter.importDate.data = parseInt(this.filter.dataLevel.data);
  }

  watchFilter() {
    this.scope.$watch('$ctrl.filter.importDate', newVal => {
      this.finish_import = !newVal.check ? true : !_.isNull(newVal.data) && newVal.data !== '';
      this.importDateStyle = newVal.check && (_.isNull(newVal.data) || newVal.data === '') ? 'label_true' : 'label_false';
    }, true);

    this.scope.$watch('$ctrl.filter.stockCost', newVal => {
      this.finish_cost = !newVal.check ? true : !_.isNull(newVal.data.number) && newVal.data.number !== '';
      this.stockCostStyle = newVal.check && (_.isNull(newVal.data.number) || newVal.data.number === '') ? 'label_true' : 'label_false';
    }, true);

    this.scope.$watch('$ctrl.filter.storeCount', newVal => {
      this.finish_count = !newVal.check ? true : !_.isNull(newVal.data.number) && newVal.data.number !== '';
      this.storeCountStyle = newVal.check && (_.isNull(newVal.data.number) || newVal.data.number === '') ? 'label_true' : 'label_false';
    }, true);

  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    this.warnServ.buildPageCondition(this.filter, this.com);

    // 仅当从按门店切回按整体时，需要记住分页信息
    let pageInfo = this.basic.getSession(this.Common.noSaveWarnAllTableInfo);
    let isFromStore = this.keys.isFromStore;

    if (pageInfo && isFromStore) {
      this.filter = pageInfo.filter;

      this.basic.setSession(this.CommonCon.session_key.sessionParam, true);

      const noSaveWarnAllTableInfo = {
        session: this.Common.noSaveWarnAllTableInfo
      };
      this.com = this.tool.getComFromSession(this.com, this.tableInfo, noSaveWarnAllTableInfo);
    }

    // 页面初始化的基础逻辑(copy条件变量)
    this.tool.pageInit(this, () => {
      this.copyFilter = angular.copy(this.filter);

      delete this.com.date;
      this.copyCom = angular.copy(this.com);

      this.showCondition();

      this.buildOption();

      this.initColumn();

    });
  }


  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, ''),
      special: {
        pageId: this.CommonCon.page.page_abnormal_no_sale
      },
      filterParam: this.copyFilter
    };

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      start: this.tableInfo.page ? this.tableInfo.page.start : 0,
      sort: this.tableInfo.sort ? this.tableInfo.sort : 4,
      fixed: 4,
      row: this.rowCallback()
    });
  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        const condition = {
          product: {
            id: "7",
            val: [{
              code: rowData.productId,
              name: rowData.productName,
              showCode: rowData.productCode
            }]
          },
          classes: {
            id: "4",
            val: []
          },
          category: {
            id: "2",
            val: []
          },
          filter: {
            dataLevel: this.filter.dataLevel,
            importDate: this.filter.importDate
          }
        };

        this.basic.setSession(this.Common.condition, condition);

        const order = this.back.param.order[0];
        let pageCondition = angular.copy(this.copyCom);
        pageCondition.pageInfo = {start: this.back.param.start};
        pageCondition.sortInfo = [order.column, order.dir];
        pageCondition.filter = this.filter;
        this.basic.setSession(this.Common.noSaveWarnAllTableInfo, pageCondition);

        this.keys.active = 2;
      })
    };
  }

  /**
   * 查询按钮
   */
  search() {
    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.copyFilter = angular.copy(this.filter);
    this.warnServ.buildPageCondition(this.copyFilter, this.com);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });

    this.showCondition();
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
        code: 'latestStockCost',
        title: `最新库存金额(万元)`,
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        class: 'text-right',
        sort: true
      },
      {
        code: 'stockStoreCnt',
        title: `门店数`,
        class: 'text-right',
        render: (data) => {
          return this.tool.buildLink(this.FigureService.number(data, false, true, 0));
        },
        sort: true
      }
    ];
    this.column = this.tableService.fixedColumn(fix);
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    if(com.filterCondition) {
      com.filterCondition.dataLevel ?
        com.filterCondition.dataLevel = `最近${com.filterCondition.dataLevel}天` : delete com.filterCondition.dataLevel;
      com.filterCondition.importDate ?
        com.filterCondition.importDate = `最近${com.filterCondition.importDate}天前` : delete com.filterCondition.importDate;
    }

    this.sortCom = this.tool.dealSortData(com, this.sort, false, (list, pushFunc) => {
      this.warnServ.dealOtherCommon(list, pushFunc, this.sort, com, this.otherCommon)
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


angular.module('hs.warning.menu').component('noSaleWarnAll', {
  templateUrl: 'app/warning/analysis/directives/noSale.warn/noSaleWarn.all.tpl.html',
  controller: NoSaleWarnAllController,
  bindings: {
    keys: '=',
    tableInfo: '='
  }
});
