class NoSaleWarnStoreController {
  constructor($scope, FigureService, CommonCon, tableService, toolService, dataService,
              basicService, popupDataService, Warning, Common, WarningService) {
    this.scope = $scope;
    this.Common = Common;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.popupData = popupDataService;
    this.warnServ = WarningService;

    // 异步中需要处理的数据
    this.back = {};
    this.instance = {};
    this.finish = true;

    // 保存共通条件的地方
    this.com = this.basic.initCondition({filterCondition: {}}, ["supplier"], true);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 调用接口的方法名字
    this.interfaceName = "getNoSaleAbnormalStoreList";

    this.allTimeCycle = angular.copy(Warning.timeCycle);

    this.filter = {
      dataLevel: {data: this.allTimeCycle[0].id},
      importDate: {check: true, data: 15}
    };

    this.sort = {
      classes: 1,
      category: 2,
      product: 3,
      businessOperation: 4,
      store: 5,
      dataLevel: 6,
      importDate: 7,
      brand: 8,
      district: 9,
      storeGroup: 10,
    };

    this.otherCommon = angular.copy(Warning.otherCommon);
  }

  init() {

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    this.watchFilter();

    // 初始化column
    this.initColumn();
  }


  initialize(data) {
    this.inited = true;

    //表示当前页面是门店的标志位
    this.keys.isFromStore = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    this.com = this.tool.getComFromSession(this.com, this.tableInfo, null, (session) => {
      this.filter = session.filter;
    });

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    this.warnServ.buildPageCondition(this.filter, this.com);

    // 判断隐藏条件等有没有值
    this.show = this.tool.contrastCom(this.com, ['district', 'storeGroup', 'brand']);

    // 页面初始化的基础逻辑(copy条件变量)
    this.tool.pageInit(this, () => {
      this.copyFilter = angular.copy(this.filter);

      delete this.com.date;
      this.copyCom = angular.copy(this.com);

      this.buildOption();

      this.showCondition();
    });
  }

  changeDate() {
    if (!this.filter.dataLevel.data) return;
    this.filter.importDate.data = parseInt(this.filter.dataLevel.data);
  }


  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, ''),
      special: {
        pageId: this.CommonCon.page.page_abnormal_no_sale_by_store
      },
      filterParam: this.copyFilter
    };

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      start: this.tableInfo.page ? this.tableInfo.page.start : 0,
      sort: this.tableInfo.sort ? this.tableInfo.sort : 5,
      fixed: 3,
      row: this.rowCallback()
    });
  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        this.copyCom.filter = angular.copy(this.copyFilter);
        this.tool.goSubPageDetail(this.copyCom, this.back, rowData, "app.warn.noSaleWarnDetail", "store");
      })
    };
  }

  watchFilter() {
    this.scope.$watch('$ctrl.filter.importDate', newVal => {
      if (_.isUndefined(newVal)) return;
      this.finish_import = !newVal.check ? true : !_.isNull(newVal.data) && newVal.data !== '';
      this.importDateStyle = newVal.check && (_.isNull(newVal.data) || newVal.data === '') ? 'label_true' : 'label_false';
    }, true);
  }

  /**
   * 查询按钮
   */
  search() {
    this.copyFilter = angular.copy(this.filter);
    this.warnServ.buildPageCondition(this.copyFilter, this.com);

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.copyCom = this.tool.commonQuery(this.com, () => {
      this.instance.reloadData();
    });

    this.showCondition();
  }

  buildPageCondition() {
    _.forIn(this.filter, (val, key) => {
      if (val.check === false) return;

      this.com.filterCondition[key] = val.data;
    });
  }

  initColumn() {
    const fix = [
      '_id',
      "storeCode",
      {
        code: "storeName",
        title: `门店`,
        render: (data) => {
          return this.tool.buildLink(data);
        }
      },

      "businessOperationName",
      "districtName",
      {
        code: "latestStockCost",
        title: "异常商品最新库存金额(万元)",
        render: (data) => {
          let title = this.FigureService.number(data, false, true) + '元';
          let formatData = this.FigureService.thousandOfSmall(data);
          return `<span title="${title}">${formatData}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "latestStockCostPct",
        title: "占比门店最新库存金额",
        render: (data) => {
          return `<span>${this.FigureService.scale(data, true, true)}</span>`;
        },
        sort: true,
        class: 'text-right'
      },
      {
        code: "productCnt",
        title: `不动销异常商品数`,
        sort: true,
        class: 'text-right',
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


}

angular.module('hs.warning.menu').component('noSaleWarnStore', {
  templateUrl: 'app/warning/analysis/directives/noSale.warn/noSaleWarn.store.tpl.html',
  controller: NoSaleWarnStoreController,
  bindings: {
    keys: '='
  }
});
