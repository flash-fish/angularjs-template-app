class NoSaleWarnDetailController {
  constructor($scope, FigureService, CommonCon, tableService, toolService, dataService, $stateParams,
              basicService, popupDataService, Common, Field, WarningSubMenu, Symbols, Warning,
              WarningService) {
    this.scope = $scope;
    this.common = Common;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.popupData = popupDataService;
    this.symbols = Symbols;
    this.stateParams = $stateParams;
    this.warnServ = WarningService;

    this.instance = {};

    const menu = angular.copy(WarningSubMenu);
    menu.list = [menu.list[1]];
    this.menu = menu;

    // 保存共通条件的地方
    this.com = this.basic.initCondition({filterCondition: {}}, ["classes", "category", "brand", "store", "product"]);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    this.back = {};

    // 调用接口的方法名字
    this.interfaceName = "getNoSaleAbnormalProductInStore";

    this.allTimeCycle = angular.copy(Warning.timeCycle);
    this.allCompareStoreCost = angular.copy(Warning.compare);
    this.allCompareStoreCount = angular.copy(Warning.compare);

    this.filter = {
      dataLevel: {data: this.allTimeCycle[0].id},
      importDate: {check: true, data: 15},
      stockCost: {check: false, data: {compare: this.allCompareStoreCost[0].id, number: 1}, sale: true}
    };

    this.sort = {
      classes: 1,
      category: 2,
      product: 3,
      brand: 4,
      dataLevel: 7,
      importDate: 6,
      stockCost: 5,
    };

    this.otherCommon = angular.copy(Warning.otherCommon);
  }

  init() {
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.stateParams);

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => {
      this.initialize(d);
    });

    this.initColumn();
  }

  changeDate() {
    if (!this.filter.dataLevel.data) return;
    this.filter.importDate.data = parseInt(this.filter.dataLevel.data);
  }

  watchFilter() {
    this.scope.$watch('ctrl.filter.importDate', newVal => {
      this.finish_import = !newVal.check ? true : !_.isNull(newVal.data) && newVal.data !== '';
      this.importDateStyle = newVal.check && (_.isNull(newVal.data) || newVal.data === '') ? 'label_true' : 'label_false';
    }, true);

    this.scope.$watch('ctrl.filter.stockCost', newVal => {
      this.finish_cost = !newVal.check ? true : !_.isNull(newVal.data.number) && newVal.data.number !== '';
      this.stockCostStyle = newVal.check && (_.isNull(newVal.data.number) || newVal.data.number === '') ? 'label_true' : 'label_false';
    }, true);
  }

  initialize(data) {

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    const subPage = this.tool.subPageCondition(this.com);
    this.fromSession = subPage.fromSession;

    if (subPage.com) {
      _.forIn(subPage.com, (val, key) => {
        if (_.isUndefined(this.com[key])) return;

        this.com[key] = val;
      });

      _.forIn(subPage.fromSession.filter, (val, key) => {
        if (_.isUndefined(this.filter[key])) return;

        this.filter[key] = val;
      });
    }

    const store = this.com.store.val[0];
    if (store) this.storeName = `[${store.code}]${store.name}`;


    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    this.watchFilter();

    // 页面初始化的基础逻辑(copy条件变量)
    this.tool.pageInit(this, () => {
      this.copyFilter = angular.copy(this.filter);
      this.warnServ.buildPageCondition(this.copyFilter, this.com);

      delete this.com.date;
      this.copyCom = angular.copy(this.com);

      this.buildOption();
      this.showCondition();
    });

  }


  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, ''),
      special: {
        pageId: this.CommonCon.page.page_abnormal_no_sale_by_store_product
      },
      filterParam: this.copyFilter
    };
    this.basic.getSession(this.CommonCon.session_key.hsParam, false);

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      fixed: 4,
      pageLength: 100,
      sort: 4
    });
  }

  /**
   * 查询按钮
   */
  search() {
    this.copyFilter = angular.copy(this.filter);
    this.warnServ.buildPageCondition(this.copyFilter, this.com);

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.basic.setSession(this.CommonCon.session_key.hsParam, this.com);

    this.copyCom = this.tool.commonQuery(this.com, ()=>{
      this.instance.reloadData();
    });

    this.showCondition();
  }

  initColumn() {

    const fix = [
      '_id',
      'productCode',
      'productName',
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

  openItem() {
    const promise = this.popupData.openItem({selected: this.com.product.val});

    this.tool.dealModal(promise, res => {
      this.com.product.val = res ? res : [];

      // 监听商品条件选择
      this.tool.watchProduct(this);
    });
  }
}


angular.module("hs.warning.sub").controller("noSaleWarnDetailCtrl", NoSaleWarnDetailController);
