class WarningProductCtrl {
  constructor(CommonCon, toolService, popups, popupDataService, Pop, Common,
              Table, basicService, $scope, $stateParams, FigureService,
              dataService, Field, warningProduct, tableService, ABCAnalyzeSub, abcService) {
    this.Pop = Pop;
    this.Table = Table;
    this.scope = $scope;
    this.popups = popups;
    this.common = Common;
    this.Field = Field;
    this.tool = toolService;
    this.tableService = tableService;
    this.state = $stateParams;
    this.basic = basicService;
    this.commonCon = CommonCon;
    this.dataService = dataService;
    this.popupData = popupDataService;
    this.warningProduct = warningProduct;
    this.FigureService = FigureService;
    this.abcService = abcService;

    //接口名称
    this.interfaceName = 'getDataByAbcAlert';
    //菜单
    this.menu = angular.copy(ABCAnalyzeSub);

    //newSelectList
    this.newProductLists = [];

    this.newProductYear = null;

    // 保存共通条件的地方
    this.com = this.basic.initCondition({date: ""}, ["classes", "category"]);

    //新增搜索条件list
    /*
    * this.areaProductList 区域商品list
    * this.lastMonth  上月评级
    * CityLife  CityLife专营商品
    * */
    this.areaProductList = angular.copy(this.warningProduct.areaProductList);
    this.lastMonth = angular.copy(this.warningProduct.lastMonth);
    this.CityLife = angular.copy(this.warningProduct.CityLife);
    this.regional = '';
    this.cityLife = '';
    this.lastMonthTags = '';

    this.scope.$watch('ctrl.regional', newVal => {

      // if(!newVal)return;
      this.com.regional = newVal
    });
    this.scope.$watch('ctrl.cityLife', newVal => {
      // if(!newVal)return;
      this.com.cityLife = newVal
    });
    this.scope.$watch('ctrl.lastMonthTags', newVal => {
      let val = this.lastMonth.filter(i => {
        return i.id == newVal
      })[0].value;
      this.com.lastMonthTags = angular.copy(val);
    });

    this.fieldInfo = this.Field.abc;

    // 保存共通指标的地方
    this.field = {};


    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.warningProduct);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_ABC_WARNING;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    this.instance = {};

    //年变化时 设置月
    this.scope.$watch('ctrl.activeYear', newVal => {
      if (_.isUndefined(newVal)) return;
      // 初始化时候的处理
      let time = this.basic.getSession('ABCTime');
      //切换年份时判断是否有当前选中月，有的话月份不变，否则月份为列表中最后一个；
      if (newVal == this.years[0].id) {
        this.months = this.abcService.buildMonthSelect(time.data.year, time.data.monthValue);
        let newMonth = [];
        newMonth = this.months.filter(i => {
          return i.id == this.activeMonth;
        });
        this.activeMonth = newMonth.length > 0 ? _.last(newMonth).id : _.last(this.months).id;
      } else {
        this.months = this.abcService.buildMonthSelect(time.data.year);
        let newMonth = [];
        newMonth = this.months.filter(i => {
          return i.id == this.activeMonth;
        });
        this.activeMonth = newMonth.length > 0 ? _.last(newMonth).id : _.last(this.months).id
      }
    });

    this.endTime = null;

    this.key = {
      active: 1,
      finish: false
    };
    this.key.finish = false;
    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', newVal => {
      this.noInit = newVal.noInit;
    }, true);
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);

    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      regional: 4,
      cityLife: 5,
      lastMonthTags: 6,
    };
  }

  init() {

    //获取时间
    let time = this.basic.getSession('ABCTime');
    if (time) {
      this.endTime = time.data;
      this.setMonth(time.data);
      //年变化时 设置月
      // 获取用户权限后初始化页面
      this.tool.getAccess((d) => this.initialize(d));
      this.newProductLists = [
        {id: '', name: '全部'},
        {id: this.years[0].name, name: this.years[0].name},
        {id: this.years[0].name - 1, name: this.years[0].name - 1},
        {id: 1, name: '旧品'}
      ];
    } else {
      this.dataService.getDateCode().then(res => {
        this.basic.setSession('ABCTime', res);
        this.endTime = res.data;
        this.setMonth(res.data);
        //年变化时 设置月
        // 获取用户权限后初始化页面
        this.tool.getAccess((d) => this.initialize(d));
        this.newProductLists = [
          {id: null, name: '全部'},
          {id: this.years[0].name, name: this.years[0].name},
          {id: this.years[0].name - 1, name: this.years[0].name - 1},
          {id: 1, name: '旧品'}
        ];
      });
    }

  }

  initialize(data) {
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);
    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    this.initColumn();

    this.isFinish = true;
    this.buildOption();
    this.showCondition();
  }

  /**
   * 初始化指标
   */
  initField() {
    // 初始化表格指标
    const table = this.basic.getLocal(this.localTable);
    const fields = table ? this.tool.getFieldFromLocal(table, this.currFileds) : this.currFileds;
    this.field.table = angular.copy(fields);
  }

  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange);
    let copyNewTable = [...this.field.newTable];
    let newIndex = 0;
    this.field.newTable.forEach((i, index) => {
      if (i.includes('arrivalRate')&& i.includes('YoY')&& !i.includes('Value')) {
        let newItem=i;
        this.field.newTable[index] = newItem+'Inc';
      };

      if (i.includes('Diff')) {
        newIndex++;
        let newItem = angular.copy(i);
        newItem = _.replace(newItem, 'TotalDiff', 'CategoryAvg');
        copyNewTable.splice(index + newIndex, 0, newItem);
      }
    });
    this.field.newTable = [...copyNewTable];
    this.buildColumn();
  }

  /**
   * 点击查询
   */
  search() {
    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.com.date = angular.copy(this.activeMonth);
    this.instance.reloadData();

    this.showCondition();
  }

  showCondition() {
    let com = angular.copy(this.com);
    const other = {
      regional: {name: '区域商品', list: 'areaProductList'},
      cityLife: {name: '精超专卖', list: 'CityLife'},
      lastMonthTags: {name: '上月评级', list: 'lastMonth'},
    };
    _.keys(other).forEach(k => {
      const list =  this.warningProduct[other[k].list];
      let obj;
      if(angular.isArray(com[k])) {
        obj = list.find(w => this[k] === w.id && w.id);
      } else
        obj = list.find(w => this[k] === w.id && _.isBoolean(w.id));
      obj ? com[k] = obj.name : delete com[k];
    });
    this.sortCom = this.tool.dealSortData(com, this.sort, other);
  }

  //构建option
  buildOption() {
    this.key = {
      isAbc: true,
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.com, this.field),
      setSum: (s) => this.getSum(s),
      appendParam: (p) => this.appendParam(p),
      special: {
        pageId: 'page_category_warning_product'
      }
    };
    this.options = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      sort: 6,
      fixed: 2,
      compileBody: this.scope
    });
  }

//请求参数添加
  appendParam(param) {
    this.key.finish = true;
    if (this.com.regional) param.condition.regional = this.com.regional;
    if (this.com.cityLife) param.condition.cityLife = this.com.cityLife;
    if (this.com.lastMonthTags) param.condition.lastMonthTags = this.com.lastMonthTags;
  }

  getSum(summary) {
    this.sum = this.field.newTable.map(s => {
      const info = this.fieldInfo[s];
      return {
        name: info.name,
        data: summary[s],
        hoverData: summary[s]
      }
    })
  }

  buildColumn() {
    this.fix = [
      '_id',
      {
        code: 'productName',
        render: (data, type, f) => {
          if (data) {
            return `[${f.productCode}][${f.productName}]`;
          } else {
            return '-'
          }
        }
      },
      'spec',
      'goodsDate',
      {
        code: 'categoryCode4Name',
        render: (data, t, f) => {
          if (data) {
            return `[${f.categoryCode4}] [${f.categoryCode4Name}]`;
          } else {
            return '-'
          }
        }
      },
      'lastMonthAbcTag',

      {
        code: 'itemIncomeRate',
        render: (data) => this.FigureService.scale(data, true, true),
        sort: true
      },
      {
        code: 'itemIncomeRateAcc',
        render: (data) => this.FigureService.scale(data, true, true),
        sort: true
      }
    ];
    this.columns = this.tableService.anyColumn(this.tableService.fixedColumn(this.fix), this.field.newTable, this.fieldInfo,{headerSilent:true});
  }

  /**
   * 根据年份设置月份下拉内容
   */
  setMonth(data) {
    this.years = this.tool.buildYearSelect(data.year - 1, data.year);
    this.activeYear = data.year;
    const nowMonth = data.monthValue; //month
    if (this.activeYear === data.year) {
      this.months = this.abcService.buildMonthSelect(data.year, nowMonth);
    } else {
      this.months = this.abcService.buildMonthSelect(data.year);
    }
    this.activeMonth = _.last(this.months).id;
    this.com.date = angular.copy(this.activeMonth);
  }

  /**
   * 数据设定
   */
  getTableOption() {
    const promise = this.popups.popupAbcStructureTable({
      local: this.localTable,
      field: this.currFileds,
      noShowSetting: true
    });
    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.initColumn(true);
    });
  }

  /**
   * 获取 popup
   */
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
}

angular.module("hs.classesAnalyze.sub").controller("warningProductCtrl", WarningProductCtrl);
