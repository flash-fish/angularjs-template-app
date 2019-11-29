class EfficiencyProductABCCtrl {
  constructor(CommonCon, toolService, popups, popupDataService, Pop, Common,
              Table, basicService, $scope, $stateParams, $rootScope,
              dataService, Field, FigureService, $state, tableService, ABCAnalyzeSub, abcService) {
    this.Pop = Pop;
    this.Table = Table;
    this.scope = $scope;
    this.popups = popups;
    this.common = Common;
    this.Field = Field;
    this.root = $rootScope;
    this.tool = toolService;
    this.figure = FigureService;
    this.tableService = tableService;
    this.state = $stateParams;
    this.basic = basicService;
    this.commonCon = CommonCon;
    this.abcService = abcService;
    this.dataService = dataService;
    this.popupData = popupDataService;
    this.$state = $state;

    //单选按钮值保存
    this.precondition = [];

    //接口名称
    this.interfaceName = 'getDataByDistributor';
    //菜单
    this.menu = angular.copy(ABCAnalyzeSub);

    // //年 select
    // const nowYear = Number(moment().format('YYYY')); //今年
    // this.years = this.tool.buildYearSelect(nowYear - 1);
    // this.activeYear = this.years[0].id;

    this.fieldInfo = this.Field.abc;

    this.tip = {
      storeType1: {tplName: 'storeType1.html'},
      storeType2: {tplName: 'storeType2.html'},
      storeType3: {tplName: 'storeType3.html'},
      storeType4: {tplName: 'storeType4.html'},
    }

    // 保存共通指标的地方
    this.field = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({date: ""}, ["classes", "category"]);

    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.efficiencyProduct);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_ABC_EFFICIENCYPRODUCT;
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

    this.key = {
      active: 1,
      finish: false
    };

    // 异步中需要处理的数据
    this.back = {};
    this.scope.$watch('ctrl.back', newVal => {
      this.noInit = newVal.noInit;
    }, true);

    this.radioValue = "2";
    this.endTime = null;

    //回退时需要的参数；
    this.copyactiveYear = '';
    this.copyactiveMonth = '';
    this.copyradioValue = '';
    this.copycom = '';
    this.copyprecondition = '';

    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      _productType: 4,
    };

    this.radioList = [
      {value: "2", name: '金牛商品'},
      {value: "3", name: '明星商品'},
      {value: "5", name: '问题商品'},
      {value: "6", name: '瘦狗商品'},
      {value: "4", name: '低效能商品'},
      {value: "1", name: '高效能商品'},
    ];
  }

  init() {
    this.precondition = this.getPrecondition(this.radioValue);
    /*
    *从session里拿日期
    * */
    let time = this.basic.getSession('ABCTime');
    if (time) {
      this.endTime = time.data;
      this.setMonth(time.data)
      this.tool.getAccess((d) => this.initialize(d));
    } else {
      this.dataService.getDateCode().then(res => {
        this.basic.setSession('ABCTime', res);
        this.endTime = res.data;
        this.setMonth(res.data);
        // 获取用户权限后初始化页面
        this.tool.getAccess((d) => this.initialize(d));
      });
    }
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);

    //单选按钮监听
    this.watchRadio();


    //月 select
    // this.setMonth();
  }

  watchRadio() {
    this.scope.$watch('ctrl.radioValue', (newVal, oldVal) => this.precondition = this.getPrecondition(newVal));
  }

  getPrecondition (type) {
    let precondition = {
      abc: [],
    };
    let typeList = [
      {field: 'operation_type1_avg', tags: ["A"]},
      {field: 'operation_type2_avg', tags: ["A"]},
      {field: 'operation_type3_avg', tags: ["A"]},
      {field: 'operation_type4_avg', tags: ["A"]},
      {field: 'operation_type5_avg', tags: ["A"]},
      // {field: 'operation_type99_avg', tags: ["A"]},
      {field: 'avg', tags: ["C"]}
    ];
    if(Number(type) <= 3) {
      typeList.find(t => t.field === 'avg').tags = ['A'];
      precondition.abc = typeList;
      if(Number(type) > 1) {
        precondition.layStoreCnt = Number(type) === 2 ? {
          lower: 70
        } : {
          lower: 0,
          upper: 70
        };
      }
    } else {
      typeList.forEach(t => {
        if(t.field !== 'avg')
          t.tags = ['B', 'C'];
      });
      precondition.abc = typeList;
      if(Number(type) > 4) {
        precondition.layStoreCnt = Number(type) === 5 ? {
          lower: 0,
          upper: 70,
        } : {
          lower: 70
        };
      }
    }
    return precondition;
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
    this.copyactiveYear = angular.copy(this.activeYear);
    this.copyactiveMonth = angular.copy(this.activeMonth);
    this.copyradioValue = angular.copy(this.radioValue);
    this.copycom = angular.copy(this.com);
    this.copyprecondition = angular.copy(this.precondition)

  }

  initColumn(isChange) {
    this.tool.changeCol(this.field, isChange);
    this.field.newTable.forEach((i, index) => {
      if (i.includes('arrivalRate')&& i.includes('YoY')&& !i.includes('Value')) {
        let newItem=i;
        this.field.newTable[index] = newItem+'Inc';
      }
    });
    this.buildColumn();
  }

  /**
   * 点击查询
   */
  search() {
    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);
    this.com.date = angular.copy(this.activeMonth);

    // 存储当前请求的参数，方便回退
    this.copyactiveYear = angular.copy(this.activeYear);
    this.copyactiveMonth = angular.copy(this.activeMonth);
    this.copyradioValue = angular.copy(this.radioValue);
    this.copycom = angular.copy(this.com);
    this.copyprecondition = angular.copy(this.precondition);
    this.key.param = this.tool.getParam(this.copycom, this.field);
    this.instance.reloadData();
    this.showCondition();
  }

  showCondition() {
    let com = angular.copy(this.copycom);
    const other = {
      _productType: {name: '商品类型'}
    };
    com._productType = this.radioList.find(r => this.radioValue === r.value).name;
    this.sortCom = this.tool.dealSortData(com, this.sort, other);
  }

  buildOption() {
    this.key = {
      isAbc: true,
      interfaceName: this.interfaceName,
      param: this.tool.getParam(this.copycom, this.field),
      setSum: (s) => this.getSum(s),
      appendParam: (p) => this.appendParam(p),
      special: {
        pageId: 'page_category_product_efficacy'
      }
    };
    this.options = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      pageLength: 100,
      sort: 5,
      fixed: 2,
      compileBody: this.scope
    });
  }

  //请求参数添加
  appendParam(param) {
    this.key.finish = true;
    this.activeYear = angular.copy(this.copyactiveYear);
    this.activeMonth = angular.copy(this.copyactiveMonth);
    this.com = angular.copy(this.copycom);
    this.radioValue = angular.copy(this.copyradioValue);
    param.condition.precondition = this.copyprecondition;
    this.basic.setSession('efficiencyProductParam', param);
  }

  getSum(summary) {
    this.sum = [];
    this.field.newTable.map(s => {
      let i = {};
      let data = '';
      let yoyData = '';
      let pctData = '';
      let dataSpan = '';
      let yoyDataSpan = '';
      if (!s.includes('YoY') && !s.includes('Pct')) {

        let info = this.fieldInfo[s];
        if (info.sale) {
          dataSpan = angular.copy(this.figure.thousand(summary[s], 2));
          yoyDataSpan = angular.copy(summary[`${s}YoYValue`] ? this.figure.thousand(summary[`${s}YoYValue`], 2) : '');
          data = this.figure.thousand((summary[s] / 10000), 2) + `万元`;
          yoyData = summary[`${s}YoYValue`] ? this.figure.thousand((summary[`${s}YoYValue`] / 10000), 2) + `万元` : '';
        } else {
          if (s.includes('layStoreCnt')) {
            //店市门店数不要小数点
            data = this.figure.thousand(summary[s], 0);
            yoyData = summary[`${s}YoYValue`] ? this.figure.thousand(summary[`${s}YoYValue`], 0) : '';
          } else if (s == 'arrivalRateTotal') {
            data = this.figure.thousand(summary[s], 2) + '%';
            yoyData = summary[`${s}YoYValue`] ? this.figure.thousand(summary[`${s}YoYValue`], 2) + '%' : '';
          } else {
            data = this.figure.thousand(summary[s], 2);
            yoyData = summary[`${s}YoYValue`] ? this.figure.thousand(summary[`${s}YoYValue`], 2) : '';
          }
        }
        if (s.includes('arrivalRate')){
          pctData = summary[`${s}YoYInc`] ? this.figure.thousand(summary[`${s}YoYInc`], 2) : '';
        } else {
          pctData = summary[`${s}YoY`] ? this.figure.scale(summary[`${s}YoY`], true) + '%' : '';
        }
        i = {
          dataSpan: dataSpan,
          yoyDataSpan: yoyDataSpan,
          name: info.name,
          data: data,
          yoyData: yoyData,
          pctData: pctData,
        };
        this.sum.push(i);
      }
    })
    // this.sum = this.field.newTable.map(s => {
    //   const info = this.fieldInfo[s];
    //   return {
    //     name: info.name,
    //     data: summary[s],
    //     hoverData: summary[s]
    //   }
    // })
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
   * 携带条件跳转至结构分析
   */
  goUrl() {
    // 判断值是否保存，用保存过的值进行跳转
    //activeYear
    //activeMonth
    // radioValue
    if (this.copycom) {
      this.activeYear = angular.copy(this.copyactiveYear);
      this.activeMonth = angular.copy(this.copyactiveMonth);
      this.radioValue = angular.copy(this.copyradioValue);
      this.com = angular.copy(this.copycom);
      this.copyprecondition = angular.copy(this.precondition);
    } else {
      this.copycom = angular.copy(this.com);
      this.copyprecondition = angular.copy(this.precondition);
    }

    const params = this.basic.getSession('efficiencyProductParam', true);
    if (params) {
      params.kpiCondition = this.kpiCondition;
      params.com = this.copycom;
      params.condition.precondition = this.copyprecondition;

      // _.forIn(params.condition.precondition, function (val, key) {
      //   if (key == 'abc') {
      //     val.forEach(p => {
      //       p.field = p.field;
      //       delete p.field
      //     })
      //   }
      // });
      if (params.condition.precondition.layStoreCnt) {
        if (params.condition.precondition.layStoreCnt.lower != undefined && params.condition.precondition.layStoreCnt.upper != undefined) {
          params.kpiCondition = `单品单店铺设数[${params.condition.precondition.layStoreCnt.lower}-${params.condition.precondition.layStoreCnt.upper}]`
        }
        if (params.condition.precondition.layStoreCnt.lower != undefined && params.condition.precondition.layStoreCnt.upper == undefined) {
          params.kpiCondition = `单品单店铺设数[大于${params.condition.precondition.layStoreCnt.lower}]`
        }
      }
      this.abcService.setLocalGoStructure(params);
    }

    let url = window.document.location.href;
    url = url.replace("efficiencyProduct", "structure");
    window.open(url);
  }

  /**
   * 数据设定
   */
  getTableOption() {
    const promise = this.popups.popupAbcStructureTable({
      local: this.localTable,
      field: this.currFileds
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

angular.module("hs.classesAnalyze.sub").controller("efficiencyProductABCCtrl", EfficiencyProductABCCtrl);
