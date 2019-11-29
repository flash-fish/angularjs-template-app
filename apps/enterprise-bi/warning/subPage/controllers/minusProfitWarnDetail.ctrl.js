class MinusProfitWarnDetailController {
  constructor($scope, FigureService, CommonCon, tableService, toolService, dataService,
              basicService, popupDataService, Common, Field, WarningSubMenu, Symbols,
              Table, Warning, $stateParams, popups, $state, WarningService) {
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
    this.Table = Table;
    this.popups = popups;
    this.Warning = Warning;
    this.stateParams = $stateParams;
    this.$state = $state;
    this.WarningService = WarningService;

    this.instance = {};

    const menu = angular.copy(WarningSubMenu);
    menu.list = [menu.list[2]];
    this.menu = menu;

    // 保存共通指标的地方
    this.field = {};

    // 日期控件配置
    this.dateOption = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({
      date: "",
      filterCondition: {
        minusReason: ""
      }
    }, ["classes", "category", "brand", "store"]);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);

    this.back = {};

    // 调用接口的方法名字
    this.interfaceName = "getMinusProfitAbnormalProductInStore";

    this.allminusReason = angular.copy(Warning.reason);

    this.com.checkbox = angular.copy(Warning.checkbox);

    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.minusProfitWarn);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_WARN_MINUS_PROFIT;

    this.sort = {
      date: 1,
      minusReason: 4,
      classes: 2,
      category: 3,
      brand: 5
    };
    this.otherCommon = angular.copy(Warning.otherCommon);
  }

  init() {
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.stateParams);

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

  buildPageCondition() {
    this.com.checkbox.forEach(s => {
      this.com.filterCondition[s.code] = s.check ? -1 : null;
    });
  }

  initialize(data) {
    this.inited = true;
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    const subPage = this.tool.subPageCondition(this.com, this.Warning.module);
    this.fromSession = subPage.fromSession;

    if (subPage.com) {
      _.forIn(subPage.com, (val, key) => {
        if (_.isUndefined(this.com[key])) return;

        this.com[key] = val;
      });
    }

    // 从目标页面点击返回时触发的逻辑
    this.tool.fromTargetToBackPage(this.com, this.tableInfo);

    const store = this.com.store.val[0];
    if (store) this.storeName = `[${store.code}]${store.name}`;

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 初始化数据设定内容
    this.initField();

    this.buildPageCondition();

    // 页面初始化的基础逻辑
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);
      this.buildOption();
      this.showCondition();
    }, true);
  }

  initField() {
    this.field = {};

    // 初始化表格指标
    const table = this.basic.getLocal(this.localTable);

    const fields = table
      ? this.tool.getFieldFromLocal(table, this.currFileds)
      : this.currFileds;

    this.field.table = angular.copy(fields);

    this.initColumn2();
  }

  buildOption() {
    this.key = {
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copyCom, ''),
      special: {
        pageId: this.CommonCon.page.page_abnormal_minus_profit_by_store_product
      }
    };

    this.basic.getSession(this.CommonCon.session_key.hsParam, false);

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      fixed: 4,
      sort: [4, 'asc'],
      row: this.rowCallback(),
    });
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
            name: rowData.productName
          }]
        };

        condition.click = {
          name: "product",
          value: rowClick,
          special: {
            date,
            store: this.copyCom.store,
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
          store: condition.store,
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
      this.initColumn2(true);
    });
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
    const fix = [
      '_id',
      `productCode`,
      {
        title: '商品',
        code: 'productName',
        render: data => this.tool.buildLink(data)
      },

      `spec`
    ];
    this.config = {
      pageId: this.CommonCon.page.page_abnormal_minus_profit_by_store_product,
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

    this.column = this.tableService.anyColumn(this.tableService.fixedColumn(fix), field, this.Warning.warningField, this.config);
  }


  initColumn() {

    const fix = [
      '_id',
      'productName',
      {
        code: 'level',
        title: `最新商品等级`,
        class: 'text-right'
      },
      'productCode',
      'spec',
      {
        code: 'latestStockCost',
        title: `日均库存金额`,
        render: (data, index, result) => {
          return this.FigureService.number(data, false, true, true);
        },
        class: 'text-right',
        sort: true
      },
      {
        code: 'stockStoreCnt',
        title: `门店数`,
        class: 'text-right',
        render: (data, index, result) => {
          return this.FigureService.number(data, false, true, true);
        },
        sort: true
      }
    ];
    this.column = this.tableService.fixedColumn(fix);
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


angular.module("hs.warning.sub").controller("minusProfitWarnDetailCtrl", MinusProfitWarnDetailController);
