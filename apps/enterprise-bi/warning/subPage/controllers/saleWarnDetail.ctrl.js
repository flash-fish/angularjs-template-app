class SaleWarnDetailController {
  constructor($scope, FigureService, CommonCon, tableService, toolService, popups, dataService, WarningService,
              basicService, $state, popupDataService, $stateParams, Common, Field, WarningSubMenu, Symbols,
              Warning) {
    this.Warning = Warning;
    this.scope = $scope;
    this.popups = popups;
    this.$state = $state;
    this.common = Common;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.stateParams = $stateParams;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.popupData = popupDataService;
    this.symbols = Symbols;
    this.warnServ = WarningService;


    this.instance = {};

    const menu = angular.copy(WarningSubMenu);
    menu.list = [menu.list[0]];
    this.menu = menu;

    // 保存共通条件的地方
    this.com = this.basic.initCondition({}, ["classes", "category", "brand", "store"]);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    this.back = {};

    // 调用接口的方法名字
    this.interfaceName = "getSaleAbnormalProductInStore";

    this.com.filter = {check: false, number: 1};

    this.sort = {
      classes: 1,
      category: 2,
      brand: 3
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

    this.getDate();
  }

  watchFilter() {
    this.scope.$watch('ctrl.com.filter', newVal => {
      if(_.isUndefined(newVal)) return;
      this.finish = !newVal.check ? true : !_.isNull(newVal.number) && newVal.number !== '';
      this.dataStyle = newVal.check && (_.isNull(newVal.number) || newVal.number === '') ? 'label_true' : 'label_false';
    }, true);
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

    this.watchFilter();

    // 页面初始化的基础逻辑(copy条件变量)
    this.tool.pageInit(this, () => {
      this.buildCondition();

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
        pageId: this.CommonCon.page.page_abnormal_sale_by_store_product
      },
      filterParam: this.copyFilter
    };
    this.basic.getSession(this.CommonCon.session_key.hsParam, false);

    this.option = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      fixed: 4,
      pageLength: 100,
      sort: 5,
      compileBody: this.scope,
      row: this.rowCallback(),
    });
  }

  buildCondition() {
    if (this.com.filter.check) {
      this.com.filterCondition = this.com.filter.number * 10000;
    }else{
      delete this.com.filterCondition;
    }
  }

  rowCallback() {
    return (row, rowData) => {
      angular.element('.a-link', row).unbind('click').click(() => {
        let condition = angular.copy(this.copyCom);

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
            store: this.copyCom.store,
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
          store: condition.store,
          date: this.dateRange
        };

        this.basic.setLocal(this.common.local.topCondition, copyCond);
        this.basic.setSession(this.common.option.resetField, true);

        this.$state.go("app.saleStockTop.saleStock");
      })
    };
  }

  /**
   * 查询按钮
   */
  search() {
    this.buildCondition();

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);
    this.initColumn();

    this.copyCom = this.tool.commonQuery(this.com, ()=>{
      this.instance.reloadData();
    });

    this.showCondition();
  }

  getDate() {
    this.basic.packager(this.dataService.getBaseDate(), res => {
      const date = moment(res.data.baseDate,this.symbols.normalDate);
      const seven = angular.copy(date).subtract(29, 'day');
      const lastDate = angular.copy(seven).subtract(1, 'day');
      const lastSeven = angular.copy(lastDate).subtract(29, 'day');

      this.dateRangTitle = seven.format(this.symbols.slashMonth) + this.symbols.bar + date.format(this.symbols.slashMonth) + "&nbsp;销售额";
      this.dateRange = seven.format(this.symbols.slashDate) + this.symbols.bar + date.format(this.symbols.slashDate);
      this.lastDateRange = lastSeven.format(this.symbols.slashMonth) + this.symbols.bar + lastDate.format(this.symbols.slashMonth) +"&nbsp;销售额";
      this.initColumn();
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
        title: `<span title="${this.lastDateRange}"><i class="glyphicon glyphicon-info-sign"></i>上个周期零售额(万元)</span>`,
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
    this.sortCom = this.tool.dealSortData(this.copyCom, this.sort, false, (list, pushFunc) => {
      this.warnServ.dealOtherCommon(list, pushFunc, this.sort, this.copyCom, this.otherCommon)
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


angular.module("hs.warning.sub").controller("saleWarnDetailCtrl", SaleWarnDetailController);
