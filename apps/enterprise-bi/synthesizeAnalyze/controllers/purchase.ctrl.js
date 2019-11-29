class PurchaseController {
  constructor(CommonCon, toolService, SaleStockSubMenu, popups, popupDataService, Pop, Common,
              Table, Chart, basicService, $scope, $stateParams, $rootScope, dataService, indexCompleteService, Symbols) {
    this.Pop = Pop;
    this.Table = Table;
    this.Chart = Chart;
    this.scope = $scope;
    this.popups = popups;
    this.common = Common;
    this.root = $rootScope;
    this.tool = toolService;
    this.state = $stateParams;
    this.basic = basicService;
    this.commonCon = CommonCon;
    this.dataService = popupDataService;
    this.service = dataService;
    this.indexCompleteService = indexCompleteService;
    this.Symbols = Symbols;

    this.interfaceName = {
      tree: 'getClassTreeForPurchase',
      chart: 'getTrendChartForPurchase',
      curName: 'purchase'
    };

    // 日期控件配置
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({date: ""}, ["classes"]);

    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.purchase);//purchase
    delete this.currFileds.other;
    this.originChart = angular.copy(this.Chart.saleStock);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_PURCHASE;

    this.key = {
      finish: false
    };

    this.sort = {
      date: 1,
      classes: 2
    }
  }

  init() {
    this.getMonth();
  }

  /**
   * 获取财务月
   */
  getMonth() {
    this.basic.packager(this.service.getIndexMonth(), res => {
      const cur = res.data.classDateCode;

      this.currentYear = cur.toString().substr(0, 4);
      this.month = cur.toString().substr(4, 2);

      this.getSelect();

      if (this.basic.getSession("fromHomeToIndex", true)) {
        this.monthStartSelect = this.monthEndSelect;
        let condition = this.basic.getSession(this.common.condition);
        this.com.date = condition.date;
      }

      if(!this.com.date)
        this.com.date = this.indexCompleteService.buildComDate(this.years, this.yearSelect, this.monthStart, this.monthEnd, this.monthStartSelect, this.monthEndSelect);

      // 获取用户权限后初始化页面
      this.tool.getAccess((d) => this.initialize(d));

    })
  }

  /**
   * 获取select的内容
   * endY:结束年
   */
  getSelect() {
    //年select
    this.years = this.tool.buildYearSelect(2018, this.currentYear);

    //默认选中的select
    this.yearSelect = String(this.years[0].id);

    //设置月
    this.setMonth();

    this.monthStartSelect = (this.monthStart[0]).id.toString();

    //默认选中当前月
    this.monthEndSelect = (this.monthEnd[this.monthEnd.length - 1]).id.toString();
  }

  /**
   * 月 select
   */
  setMonth() {
    const nowMonth = parseInt(this.month); //当月
    if (this.yearSelect == this.years[0].id) {
      //月select
      this.monthStart = this.tool.buildMonthSelect(nowMonth);
      this.monthEnd = this.tool.buildMonthSelect(nowMonth);

      const startM = this.monthStart[parseInt(this.monthStartSelect)];
      const endM = this.monthEnd[parseInt(this.monthEndSelect)];
      if (!startM) this.monthStartSelect = this.monthStart[0].id.toString();
      if (!endM) this.monthEndSelect = (this.monthEnd[this.monthEnd.length - 1]).id.toString();
    } else {
      //月select
      this.monthStart = this.tool.buildMonthSelect();
      this.monthEnd = this.tool.buildMonthSelect();
    }

    this.com.date = this.indexCompleteService.buildComDate(this.years, this.yearSelect, this.monthStart, this.monthEnd, this.monthStartSelect, this.monthEndSelect);
  }

  /**
   * 月select变化时check
   * value: 当前选中的月份
   * flag : 0 star , 1 end
   */
  selectChange(cur, flag) {
    if (flag) {
      if (parseInt(cur) < parseInt(this.monthStartSelect)) {
        this.monthStartSelect = cur
      }
    } else {
      if (parseInt(cur) > parseInt(this.monthEndSelect)) {
        this.monthEndSelect = cur
      }
    }

    this.com.date = this.indexCompleteService.buildComDate(this.years, this.yearSelect, this.monthStart, this.monthEnd, this.monthStartSelect, this.monthEndSelect);
  }

  /**
   * 获取table popup
   */
  getTableOption() {
    const promise = this.popups.popupPurchaseTable({
      field: this.currFileds,
      cur: this.localTable
    });

    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.field = Object.assign({}, this.field);
    });
  }

  /**
   * 初始化指标
   */
  initField() {
    this.copyCom = angular.copy(this.com);
    // 初始化表格指标
    const table = this.basic.getLocal(this.localTable);
    const fields = table ? this.tool.getFieldFromLocal(table, this.currFileds) : this.currFileds;

    this.field.table = angular.copy(fields);
  }

  initialize(data) {
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    this.watchDate();

    // 页面初始化的基础逻辑(copy条件变量)
    this.tool.pageInit(this, () => {
      this.copyCom = angular.copy(this.com);

      // 初始化指标 如果session里有值 优先取session的
      this.initField();
      this.showCondition();
    });
  }

  watchDate() {
    this.scope.$watch("ctrl.com.date", newVal => {
      if (_.isUndefined(newVal)) return;
      if (newVal.indexOf(this.Symbols.bar) > 0) {
        let sta = newVal.split(this.Symbols.bar)[0].replace(/\//g, '');
        let end = newVal.split(this.Symbols.bar)[1].replace(/\//g, '');
        let curYear = sta.substr(0, 4);
        let years = angular.copy(this.years);
        let monthS = angular.copy(this.monthStart);
        let monthE = angular.copy(this.monthStart);

        this.yearSelect = String(years.filter(d => {
          return d.id == curYear
        })[0].id);
        let s = sta.substr(4, 2);
        let e = end.substr(4, 2);
        this.monthStartSelect = String(monthS.filter(d => {
          return d.name == s
        })[0].id);

        this.monthEndSelect = String(monthE.filter(d => {
          return d.name == e
        })[0].id);
      }
    });
  }

  /**
   * 点击查询
   */
  search() {
    this.key.finish = false;
    this.com.date = this.indexCompleteService.buildComDate(this.years, this.yearSelect, this.monthStart, this.monthEnd, this.monthStartSelect, this.monthEndSelect);
    // 获取用户权限后初始化页面

    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.copyCom = this.tool.commonQuery(this.com, null, {
      noSetParam: true
    });
    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.copyCom);
    this.sortCom = this.tool.dealSortData(com, this.sort);
  }

  openClasses() {
    const promise = this.dataService.openClass({selected: this.com.classes.val});

    this.tool.dealModal(promise, res => {
      this.com.classes.val = res ? res : [];
    });
  }
}

angular.module("hs.synthesizeAnalyze").controller("purchaseCtrl", PurchaseController);
