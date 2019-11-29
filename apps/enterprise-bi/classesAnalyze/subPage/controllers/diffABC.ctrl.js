class DiffABCController {
  constructor(CommonCon, toolService, popups, popupDataService, Pop, Common,
              Table, Chart, basicService, $scope, $stateParams, $rootScope, abcService,
              dataService, ABCAnalyzeSub, FigureService, Field, $state, Symbols) {
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
    this.dataService = dataService;
    this.popupData = popupDataService;
    this.figure = FigureService;
    this.Field = Field;
    this.$state = $state;
    this.Symbols = Symbols;
    this.abcService = abcService;
    this.data = [];
    this.root.fullLoadingShow = true;
    this.interfaceName = {
      tree: 'getAbcTreeForDiff'
    };

    //菜单
    this.menu = angular.copy(ABCAnalyzeSub);
    //tab
    this.tabs = angular.copy(CommonCon.abcStructureTabs);
    this.copyOption = '';
    // //年 select
    // const nowYear = Number(moment().format('YYYY')); //今年
    // this.years = this.tool.buildYearSelect(nowYear - 1);
    // this.activeYear = 0;
    //
    // //月 select
    // this.setMonth();

    //年变化时 设置月
    this.scope.$watch('ctrl.activeYear', newVal => {
      if (_.isUndefined(newVal)) return;
      // 初始化时候的处理
      let time = this.basic.getSession('ABCTime');
      if (newVal == this.years[0].id) {
        this.months = this.abcService.buildMonthSelect(time.data.year, time.data.monthValue);
        let newMonth = [];
        newMonth = this.months.filter(i => {
          return i.id == this.activeMonth;
        });
        this.activeMonth = newMonth.length > 0 ? _.last(newMonth).id : _.last(this.months).id;
      } else {
        this.months = this.abcService.buildMonthSelect(newVal);
        let newMonth = [];
        newMonth = this.months.filter(i => {
          return i.id == this.activeMonth;
        });
        this.activeMonth = newMonth.length > 0 ? _.last(newMonth).id : _.last(this.months).id
      }
    });

    //业态变化时
    this.scope.$watch('ctrl.com.activeOperation2', () => {
      this.selectChange(1);
    });

    this.scope.$watch('ctrl.com.activeOperation1', () => {
      this.selectChange(2);
    });

    // 日期控件配置
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};

    //查询时用来保存当前查询条件
    this.copyCommonParam = '';

    // 保存共通条件的地方
    this.com = this.basic.initCondition({date: ""}, ["classes", "category", "brand"]);

    //新品
    this.newProductSelect = this.abcService.buildNewProductSelect();
    this.com.activeOperationGroup = '';

    //业态 select
    this.operation1 = angular.copy(CommonCon.abcOperationSelect);
    this.operation2 = angular.copy(CommonCon.abcOperationSelect);
    this.com.activeOperation1 = this.operation1[1].id;
    this.com.activeOperation2 = this.operation1[2].id;

    //平均整体业态、门店 select
    this.abcOperationStore = angular.copy(CommonCon.abcOperationStore);
    this.com.activeOperationStore = this.abcOperationStore[0].id;

    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.abc_diff);
    this.originChart = angular.copy(this.Chart.abc_structure);

    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_ABC_DIFF;
    this.localChart = CommonCon.local.CHART_DATA_ABC_STRUCTURE;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};
    this.key = {
      active: 1,
      finish: false,
      diffType: this.com.activeOperationStore,
      page: CommonCon.pageType.abc,//图表标题
      operations: [this.com.activeOperation1, this.com.activeOperation2],
      special: {
        pageId: 'page_category_operation_contrast'
      }
    };
    // this.newProductListActive = "";
    // //监听新品选择器变化  如果是门店分析，门店不能为空
    this.scope.$watch('ctrl.com.newProductYear', val => {
      this.com.newProductYear = val;
    });
    //监听新品选择器变化  如果是门店分析，门店不能为空
    this.scope.$watch('ctrl.com.activeOperationStore', val => {
      this.key.diffType = val;
      if (val === 'storeContrast') {

        if (!this.com.store || !this.com.store.val || !this.com.store.val.length) {
          this.com.store = {val: [], id: 1};
          this.key.finish = false;
        }

        if (!this.com.store2 || !this.com.store2.val) {
          this.com.store2 = {val: [], id: 1};
          this.key.finish = false;
        }
      } else {
        this.key.finish = true;
      }
    });
    //监听新品选择器变化  如果是门店分析，门店不能为空
    this.scope.$watch('ctrl.com.store.val', (val, oldval) => {
      if (val && val.length) {
        //动态添加门店指标
        _.forIn(this.Field.abc, (value, key) => {
          if (key.includes(`1`)) {
            let keys = "";
            keys = key.replace(`1`, val[0].code);

            value.name = val[0].name;
            this.Field.abc[keys] = value;
            if (key.includes(`Pct`)) {
              value.name = val[0].name + '占比';
              this.Field.abc[keys] = value;
            }
          }
        });
        console.log(this.Field.abc);
        // this.toFields.= {name: val.name, rowSpan: true, operation: true, two: 'Pct', sale: true},
        if (val.length == 0 || this.com.store2.val == 0) {
          this.key.finish = false;
        } else {
          this.key.finish = true;
        }
        if (this.com.store2.val.length > 0 && val.length > 0 && this.com.store2.val[0].code == val[0].code) {
          this.com.store.val = [];
        }
      }
    });
    this.scope.$watch('ctrl.com.store2.val', (val, oldval) => {
      if (val && val.length) {
        //动态添加门店指标
        _.forIn(this.Field.abc, (value, key) => {
          if (key.includes(`2`)) {
            let keys = "";
            keys = key.replace(`2`, val[0].code);
            value.name = val[0].name;
            this.Field.abc[keys] = value;
            if (key.includes(`Pct`)) {
              value.name = val[0].name + '占比';
              this.Field.abc[keys] = value;
            }
          }
        });
        if (val.length == 0 || this.com.store.val == 0) {
          this.key.finish = false;
        } else {
          this.key.finish = true;
        }
        if (this.com.store.val.length > 0 && val.length > 0 && this.com.store.val[0].code == val[0].code) {
          this.com.store2.val = [];
        }

      }

    });

    this.endTime = null;
    //环形图
    this.scope.$watch('ctrl.data', newVal => {
      if (newVal.length == 0) return;
      this.buildTableSituation(newVal);
      //初始化的视乎
      this.initChartTable(newVal);
    });

    //保存当前未点击查询的年月状态
    this.copyActiveYear = '';
    this.copyActiveMonth = '';

    this.sort = {
      date: 1,
      activeOperationStore: 2,
      activeOperation1: 3,
      activeOperation2: 4,
      store: 3,
      store2: 4,
      classes: 5,
      category: 6,
      brand: 7,
      newProductYear: 8
    };

  }

  init() {
    let time = this.basic.getSession('ABCTime');
    if (time) {
      this.endTime = time.data;
      //新品下拉列表
      this.setMonth(time.data)
    } else {
      this.dataService.getDateCode().then(res => {
        this.basic.setSession('ABCTime', res);
        this.endTime = res.data;
        //新品下拉列表
        this.setMonth(res.data)
        //年变化时 设置月
      });
    }
    this.addEvent = {name: "click", event: (p) => this.addEventFunc(p), func: null};

    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 监听订阅的事件
    this.tool.onEvent(this);
    this.com.newProductYear = '';
  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);
    this.com.store2 = angular.copy(this.com.store);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);


    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    // 初始化日期范围
    this.tool.initDate(this, () => {
      this.formatDate();
      this.commonParam = angular.copy(this.com);
      this.copyCommonParam = angular.copy(this.commonParam);
      this.copyActiveYear = angular.copy(this.activeYear);
      this.copyActiveMonth = angular.copy(this.activeMonth);
      this.copyCom = angular.copy(this.com);
      this.showCondition();
    });
  }

  /**
   * 初始化指标
   */
  initField() {
    // 初始化表格指标
    const table = this.basic.getLocal(this.localTable);
    const fields = table ? this.tool.getFieldFromLocal(table, this.currFileds) : this.currFileds;
    this.field.table = angular.copy(fields);

    //删除到货率、订单数两个指标
    delete this.field.table.order;
  }

  /**
   * 点击查询
   */
  search() {
    this.key.finish = false;

    this.formatDate();

    // 合并当前选中的值和权限中的值
    this.accessCom.store2 = angular.copy(this.accessCom.store);
    this.tool.unionAccess(this.com, this.accessCom, this.job);
    this.root.fullLoadingShow = true;

    this.typeActive = this.typeActive == 'true' ? true : false;

    this.commonParam = this.tool.commonSearch(this);
    if (this.commonParam.activeOperationStore == "storeContrast") {
      this.key.operations = [this.com.store.val[0].code, this.com.store2.val[0].code];
    } else {
      this.key.operations = [this.com.activeOperation1, this.com.activeOperation2];
    }


    this.copyCommonParam = angular.copy(this.commonParam);
    this.copyActiveYear = angular.copy(this.activeYear);
    this.copyActiveMonth = angular.copy(this.activeMonth);
    this.copyCom = angular.copy(this.com);
    // // 合并当前选中的值和权限中的值
    // this.tool.unionAccess(this.com, this.accessCom, this.job);
    this.showCondition();
  }

  showCondition() {
    let com = angular.copy(this.copyCom);
    const other = {
      activeOperationStore: {
        name: "对比类",
        del: {storeContrast: ['activeOperation1', 'activeOperation2'], other: ['store', 'store2']},
      },
      activeOperation1: {name: "业态1"},
      activeOperation2: {name: "业态2"},
      store: {name: "门店1", type: 0},
      store2: {name: "门店2", type: 0},
      newProductYear: {name: "新品"}
    };
    com.activeOperationStore = this.abcOperationStore.find(s => s.id === com.activeOperationStore).name;
    com.newProductYear ?
      com.newProductYear = this.newProductList.find(l => l.id === com.newProductYear).name
      : delete com.newProductYear;
    if (!_.eq(com.activeOperationStore, '门店')) {
      com = _.omit(com, other.activeOperationStore.del.other);
      other.activeOperationStore.del.storeContrast.forEach(s => {
        com[s] = this.operation1.find(o => com[s] === o.id).name;
      });
    } else
      com = _.omit(com, other.activeOperationStore.del.storeContrast);
    this.sortCom = this.tool.dealSortData(com, this.sort, other);
  }

  initChartTable(data) {
    let param = {};
    if (this.commonParam.activeOperationStore == "storeContrast") {
      param = {
        data: {
          name: this.commonParam.store.val[0].name + 'A类商品',
          parent: this.commonParam.store2.val[0].name + 'A类商品',
          x: 0,
          y: 0
        }
      };
    } else {
      param = {
        data: {
          name: this.operation2.filter(i => {
            return i.id == this.com.activeOperation2
          })[0].name + 'A类商品',
          // this.operation2[this.commonParam.activeOperation2].name + 'A类商品',
          parent: this.operation1.filter(i => {
            return i.id == this.com.activeOperation1
          })[0].name + 'A类商品',
          x: 0,
          y: 0
        }
      };
    }
    this.charTableTitle1 = param.data.parent;//业态1
    if (!this.charTableTitle1) return;
    this.charTableTitle2 = param.data.name;//业态2
    this.chartTableData = [];
    this.buildChartTable(param, data);
  }

  goUrl(abcType, i) {
    const params = this.basic.getSession('diffAbcParam');
    // if (!params) {
    //   params.com = angular.copy(this.com);
    //   //经销结构分析页面不需要‘store2’这个字段，需要合并到store；
    //
    // }
    if (i == '-') return;
    if (this.copyCommonParam) {
      this.commonParam = this.copyCommonParam;
      this.com = angular.copy(this.copyCom);
      this.activeYear = angular.copy(this.copyActiveYear);
      this.activeMonth = angular.copy(this.copyActiveMonth);
    } else {
      this.copyCom = angular.copy(this.com);
      this.copyCommonParam = angular.copy(this.commonParam);
    }

    params.com = this.copyCommonParam;
    if (params.com.store2 && params.com.store2.val[0]) {
      params.com.store.val.push(params.com.store2.val[0]);
    }
    if (params.com.store) {
      params.condition.store = angular.copy(params.com.store);
    }
    delete params.com.total;
    params.condition.precondition = this.changeType(abcType, this.commonParam.activeOperationStore == "storeContrast" ? true : false);
    if (this.show)
      params.show = this.show;
    this.abcService.setLocalGoStructure(params);
    let url = window.document.location.href;
    url = url.replace("diff", "structure");
    window.open(url);
  }

  //当前跳转储存参数视情况处理
  changeType(abcType, isStore) {
    let c1 = '';
    let c2 = '';
    c1 = this.charTableTitle1.substr(-4, 1);
    c2 = this.charTableTitle2.substr(-4, 1);
    let precondition = {};
    switch (abcType) {
      case 0:  //    从中间图表点击，带参数大卖场A 综超A
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: [c1]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: [c2]
            },
          ]
        };
        break;
      case 10:  //    从中间图表点击，带参数大卖场A 综超A
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A"]
            },
            {
              field: isStore ? this.commonParam.store2.val[0].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A"]
            },
          ]
        };
        break;
      case 20:
        //从下方图表点击，带参数综超b 大卖场A
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["B"]
            },
          ]
        };
        break;
      case 30:
        //从下方图表点击，带参数综超c 大卖场A
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["C"]
            },
          ]
        }
        break;
      case 40:
        //从下方图表点击，带参数综超A B C 大卖场A
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A", "B", "C"]
            },
          ]
        }
        break;
      case 11:
        //从下方图表点击，带参数综超A 大卖场B
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["B"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A"]
            },
          ]
        }
        break;
      case 21:
        //从下方图表点击，带参数综超B 大卖场B
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["B"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["B"]
            },
          ]
        }
        break;
      case 31:
        //从下方图表点击，带参数综超C 大卖场B
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["C"]
            },
          ]
        }
        break;
      case 41:
        //从下方图表点击，带参数综超A  B  C 大卖场B
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["B"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A", "B", "C"]
            },
          ]
        }
        break;
      case 12:
        //从下方图表点击，带参数综超A 大卖场C
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["C"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A"]
            },
          ]
        }
        break;
      case 22:
        //从下方图表点击，带参数综超B 大卖场C
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["C"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["B"]
            },
          ]
        }
        break;
      case 32:
        //从下方图表点击，带参数综超C 大卖场C
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["C"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["C"]
            },
          ]
        }
        break;
      case 42:
        //从下方图表点击，带参数综超A B C  大卖场C
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["C"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A", "B", "C"]
            },
          ]
        }
        break;
      case 13:
        //从下方图表点击，带参数综超A  大卖场A B C
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A", "B", "C"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A"]
            },
          ]
        }
        break;
      case 23:
        //从下方图表点击，带参数综超B  大卖场A B C
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A", "B", "C"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["B"]
            },
          ]
        }
        break;
      case 33:
        //从下方图表点击，带参数综超C  大卖场ABC
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A", "B", "C"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["C"]
            },
          ]
        }
        break;
      case 43:
        //从下方图表点击，带参数综超A B C  大卖场ABC
        precondition = {
          abc: [
            {
              field: isStore ? this.commonParam.store.val[0].code : `operation_type${this.commonParam.activeOperation1}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A", "B", "C"]
            },
            {
              field: isStore ? this.commonParam.store.val[1].code : `operation_type${this.commonParam.activeOperation2}${this.com.activeOperationStore == 'operationsAvgContrast' ? '_avg' : ''}`,
              tags: ["A", "B", "C"]
            },
          ]
        };
        break;
    }

    return precondition;
  }

  //格式化万元
  formatData(value) {
    const formatData = Math.abs(value) < 50 && Math.abs(value) > 0
      ? this.figure.amount(value, 4)
      : this.figure.amount(value);
    return formatData;
  }

  /**
   * 业态差异状况数据
   */
  buildTableSituation(data) {
    if (this.commonParam.activeOperationStore == "storeContrast") {
      this.colTitle = this.commonParam.store.val[0].name;
      this.rowTitle = this.commonParam.store2.val[0].name;
    } else {
      this.colTitle = this.operation1.filter(i => {
        return i.id == this.com.activeOperation2
      })[0].name;
      this.rowTitle = this.operation1.filter(i => {
        return i.id == this.com.activeOperation1
      })[0].name;
    }
    const summary = this.summary;
    this.tableData = summary.map(p => {
      return {name: p.name}
    });
    summary.forEach((d, i) => {
      this.tableData[i]['saleSum'] = this.figure.thousand(d.skuUnitTotal, 0);
      this.tableData[i]['pctSum'] = this.figure.scale(d.skuUnitTotalPct, true, true);
      this.tableData[i].name = d.name;
      this.tableData[i]['sale0'] = this.figure.thousand(d.skuUnitA, 0);
      this.tableData[i]['pct0'] = this.figure.scale(d.skuUnitAPct, true, true);
      this.tableData[i]['sale1'] = this.figure.thousand(d.skuUnitB, 0);
      this.tableData[i]['pct1'] = this.figure.scale(d.skuUnitBPct, true, true);
      this.tableData[i]['sale2'] = this.figure.thousand(d.skuUnitC, 0);
      this.tableData[i]['pct2'] = this.figure.scale(d.skuUnitCPct, true, true);
    });


    this.diff = this.buildChart(data);
    const sum = {
      s1: summary[3].skuUnitTotal,
      s2: summary[0].skuUnitA,
      s3: summary[0].skuUnitC,
      s4: summary[2].skuUnitC,
      s5: summary[2].skuUnitA,
    };
    this.setSum(sum);

  }

  /**
   * 合计
   */
  setSum(summary) {
    this.sum = [
      {name: 'ABC交集SKU数', total: summary.s1, hoverData: '', count: true},
      {name: '双A类商品SKU数', total: summary.s2, hoverData: '', count: true},
      {name: '双C类商品SKU数', total: summary.s4, count: true, hoverData: ''},
      {name: `${this.rowTitle}A类-${this.colTitle}C类 商品SKU数`, count: true, total: summary.s3, hoverData: ''},
      {name: `${this.rowTitle}C类-${this.colTitle}A类 商品SKU数`, count: true, total: summary.s5, hoverData: ''},
      {name: '', total: '', hoverData: '', hide: true}
    ];

    this.sum = this.sum.map(s => {
      let d, h;
      let total = s.total;
      // if (!total) {
      //   this.sum = [];
      //   return;
      // }
      if (s.scale) {
        const data = this.figure.scale(total, false);
        h = d = data === this.Symbols.bar ? data : `${data}%`;
      } else {
        if (s.sale) {
          d = `${this.figure.amount(total)}万元`;
          h = `${this.figure.thousand(total)}元`;
        } else if (s.count) {
          h = d = total;
        } else {
          h = d = this.figure.thousand(total, 0);
        }
      }
      return {
        name: s.name,
        total: d ? d.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,') : '-',
        hoverData: h,
        hide: s.hide
      }
    });
  }

  /**
   * 环形图
   */
  buildChart(data) {
    this.addEvent.func = this.addEvent.event(data);
    let seriesData1 = [];
    let seriesData2 = [];
    let legendData = [];
    data.forEach((d, i) => {
      legendData.push(d.operationsName);
      seriesData1.push({value: d.skuUnit, name: d.operationsName, pct: d.skuUnitPct});
      let dName = '';
      if (this.commonParam.activeOperationStore == "storeContrast") {
        //  对比类为门店时候的处理
        dName = d.operationsName
      } else
        //  对比类为业态时候的处理 (把尾巴上的“类商品”去掉)
        dName = d.operationsName.substring(0,  d.operationsName.length - 3);

      if (d.nodes) {
        d.nodes.forEach((s, si) => {

          legendData.push(`${dName}、${s.operationsName}`);
          const obj = {
            value: parseInt(s.skuUnit),
            name: `${dName}、${s.operationsName}`,
            pct: s.skuUnitPct,
            parent: d.operationsName,
            x: i,
            y: si,
            selected: s.uid === "0_0" ? true : false,
          };
          seriesData2.push(obj);
        })
      }
    });
    // legendData = _.sortBy(legendData, function(item){
    //   return item;
    // });
    let newlegend = [];
    let newlegend2 = [];
    legendData.forEach(i => {
      if (!i.includes('、')) {
        newlegend.push(i)
      } else {
        newlegend2.push(i)
      }
    });
    legendData = [...newlegend, ...newlegend2];
    let option = {
      color: ['#2A80D8', '#78BF57', '#eb7841', '#EA5B66', '#0425FF', '#5543DD', '#551A8B', '#104E8B', '#8B1C62', '#8B8878', '#8B3626', '#FFA500'],
      tooltip: {
        trigger: 'item',
        formatter: (param) => {
          const p = this.figure.scale(param.data.pct, true, true);
          const pct = p == '-' ? '' : '（' + p + '）';
          if (param.data.name.length > 20) {
            let first = _.split(param.data.name, '、', 2)[0]
            let last = _.split(param.data.name, '、', 2)[1]
            return `<div><p>${first}</p><p>${last}:</p><p>${this.figure.thousand(param.data.value, 0)}${pct}</p></div>`
          } else {
            return `<div><p>${param.data.name}:</p><p>${this.figure.thousand(param.data.value, 0)}${pct}</p></div>`
          }

        }
      },
      title: {
        text: this.rowTitle + ' VS ' + this.colTitle,
        left: 'center'
      },
      legend: {
        formatter: function (name) {
          return echarts.format.truncateText(name, 85, '12px Microsoft Yahei', '…');
        },
        tooltip: {
          show: true,
          formatter: (param) => {
            let firstName = '';
            let lastName = '';
            if (param.name.includes('、')) {
              firstName = _.split(param.name, '、', 2)[0];
              lastName = _.split(param.name, '、', 2)[1];
              return `<div style="text-align: left"><p>${firstName}</p><p>${lastName}</p> </div>`;
            } else {
              return `<div style="text-align: left"><p>${param.name}</p></div>`
            }

            // const p = this.figure.scale(param.data.pct, true, true);
            // const pct = p == '-' ? '' : '（' + p + '）';
            // if (param.data.name.length > 20) {
            //   let first = _.split(param.data.name, '、', 2)[0]
            //   let last = _.split(param.data.name, '、', 2)[1]
            //   return `<div style="width: 200px"><p>${first}</p><p>${last}:</p><p>${this.figure.thousand(param.data.value, 0)}${pct}</p></div>`
            // } else {
            //   return `<div style="width: 200px"><p>${param.data.name}:</p><p>${this.figure.thousand(param.data.value, 0)}${pct}</p></div>`
            // }

          }
        },
        orient: 'vertical',
        width: 100,
        height: 70,
        bottom: 10,
        align: 'right',
        data: legendData
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: [0, '30%'],
          label: {
            normal: {
              position: 'inner'
            }
          },
          labelLine: {
            length: 1,
            length2: 1,
            normal: {
              show: false
            }
          },
          data: seriesData1
        },
        {
          name: '',
          type: 'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: (param) => {
                const p = this.figure.scale(param.data.pct, true, true);
                const pct = p == '-' ? '' : '（' + p + '）';
                let name1 = _.split(param.data.name, '、', 2)[0];
                let name2 = _.split(param.data.name, '、', 2)[1];
                return name1 + '\n' + name2 + '：\n' + this.figure.thousand(param.data.value, 0) + pct;
              },

              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              padding: 5,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 12,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#999',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          data: seriesData2
        }
      ]
    };
    this.copyOption = option;
    return option;
  }

  /**
   * 环形图点击事件
   */
  addEventFunc(dataDetail) {
    this.dataDetail = dataDetail;
    return (param) => {
      if (!param.data.parent) return;
      param.data.selected = true;
      this.charTableTitle1 = param.data.parent;//业态1
      this.charTableTitle2 = _.split(param.name, '、', 2)[1];//业态2
      this.chartTableData = [];
      let series = this.copyOption.series[1].data;
      series.forEach(i => {
        if (i.name == param.data.name) {
          i.selected = true;
        } else {
          i.selected = false;
        }
      });
      this.copyOption.series[1].data = series;
      this.diff = angular.copy(this.copyOption);

      this.buildChartTable(param, this.dataDetail)
    }
  }

  buildChartTable(param, dataDetail) {
    let data = angular.copy(dataDetail);
    const x = param.data.x;
    const y = param.data.y;
    let fields = angular.copy(this.field.newTable);
    let isStore = this.commonParam.activeOperationStore == "storeContrast" ? true : false;
    let store1 = {};
    let store2 = {};
    if (isStore) {
      store1 = this.commonParam.store.val[0].code;
      store2 = this.commonParam.store2.val[0].code;
    }
    //对比类是门店的处理逻辑
    if (isStore) {
      fields.forEach((s, i) => {
        if (s.includes(store1)) fields[i] = s.substring(0, s.indexOf(store1));
        if (s.includes(store2)) fields[i] = s.substring(0, s.indexOf(store2));
      });
    } else {
      fields.forEach((s, i) => {
        if (s.includes(this.commonParam.activeOperation1)) fields[i] = s.substring(0, s.indexOf(this.commonParam.activeOperation1));
        if (s.includes(this.commonParam.activeOperation2)) fields[i] = s.substring(0, s.indexOf(this.commonParam.activeOperation2));

      });
    }

    fields = $.unique(fields).filter(d => d !== 'skuUnitPct');
    fields.forEach(d => {

      let fName1 = "";
      let fName2 = "";
      let obj = {};
      let f1Value = "";
      let f2Value = "";

      //对比类是门店的处理逻辑
      if (isStore) {
        fName1 = d == 'skuUnit' ? d : d + this.commonParam.activeOperation1;
        fName2 = d == 'skuUnit' ? d : d + this.commonParam.activeOperation2;
        let storeFName1 = d == 'skuUnit' ? d : d + store1;
        let storeFName2 = d == 'skuUnit' ? d : d + store2;
        f1Value = this.figure.thousand(data[x].nodes[y][storeFName1], 0);
        f2Value = this.figure.thousand(data[x].nodes[y][storeFName2], 0);
      } else {
        //对比类是业态的处理逻辑
        fName1 = d == 'skuUnit' ? d : d + this.commonParam.activeOperation1;
        fName2 = d == 'skuUnit' ? d : d + this.commonParam.activeOperation2;
        f1Value = this.figure.thousand(data[x].nodes[y][fName1], 0);
        f2Value = this.figure.thousand(data[x].nodes[y][fName2], 0);
      }

      const unnit = this.Field.abc[fName1].sale ? '(万元)' : '';

      if (isStore) {
        let storeFName1 = d == 'skuUnit' ? d : d + store1;
        let storeFName2 = d == 'skuUnit' ? d : d + store2;
        obj = {
          name: this.Field.abc[d].name + unnit,
          f1: this.Field.abc[fName1].sale ? this.formatData(data[x].nodes[y][storeFName1]) : f1Value,
          f2: this.Field.abc[fName2].sale ? this.formatData(data[x].nodes[y][storeFName2]) : f2Value,
          f1Pct: this.figure.scale(data[x].nodes[y][storeFName1 + 'Pct'], true, true),
          f2Pct: this.figure.scale(data[x].nodes[y][storeFName2 + 'Pct'], true, true),
        };
      } else {
        obj = {
          name: this.Field.abc[d].name + unnit,
          f1: this.Field.abc[fName1].sale ? this.formatData(data[x].nodes[y][fName1]) : f1Value,
          f2: this.Field.abc[fName2].sale ? this.formatData(data[x].nodes[y][fName2]) : f2Value,
          f1Pct: this.figure.scale(data[x].nodes[y][fName1 + 'Pct'], true, true),
          f2Pct: this.figure.scale(data[x].nodes[y][fName2 + 'Pct'], true, true),
        };
      }

      if (this.Field.abc[fName1].sale) obj.f1Title = f1Value + '元';
      if (this.Field.abc[fName2].sale) obj.f2Title = f1Value + '元';
      if (this.Field.abc[fName1].point === 0) {
        obj.f1 = _.split(f1Value, '.', 2)[0]
      }
      ;
      if (this.Field.abc[fName2].point === 0) {
        obj.f2 = _.split(f2Value, '.', 2)[0]
      }
      ;
      if (obj.name != '到货率' && obj.name != '订货数量') this.chartTableData.push(obj)

    });
    this.root.fullLoadingShow = false;
  }

  selectChange(type) {

    if (this.com.activeOperation1 == this.com.activeOperation2) {
      const active = parseInt(this.com['activeOperation' + type]);
      this.com['activeOperation' + type] = active == 99 ? 4 : (active > 1 ? active - 1 : active + 1)
    }
  }

  /**
   * 格式化日期为统一格式：YYYY/MM-YYYY/MM
   */
  formatDate() {
    // const m = this.months[parseInt(this.activeMonth)].name.split('-');
    // const y = this.activeYear;
    // this.com.date = y + "/" + m[0] + '-' + y + '/' + m[1];
    this.com.date =angular.copy(this.activeMonth);

    if (this.com.activeOperationGroup !== '') {
      this.com.businessOperationGroup = [this.com.activeOperationGroup];
    }

    this.com.total = this.typeActive == 'true' ? true : false
  }

  /**
   * 根据年份设置月份下拉内容
   */
  setMonth(data) {
    this.newProductList = [
      {name: `${this.endTime.year}新品`, id: this.endTime.year},
      {name: `${this.endTime.year - 1}新品`, id: this.endTime.year - 1},
      {name: '旧品', id: 1},
    ];
    this.years = this.tool.buildYearSelect(data.year - 1, data.year);
    this.activeYear = data.year;
    const nowMonth = data.monthValue; //month
    if (this.activeYear === data.year) {
      this.months = this.abcService.buildMonthSelect(this.activeYear, nowMonth);
    } else {
      this.months = this.abcService.buildMonthSelect(this.activeYear);
    }
    this.activeMonth = _.last(this.months).id;
  }

  //门店 单选
  openStoreList() {
    const promise = this.popupData.openStore({selected: this.com.store.val, multi: false});

    this.tool.dealModal(promise, res => {
      this.com.store.val = res ? res : [];
    });
  }

  //门店 单选
  openStoreList2() {
    const promise = this.popupData.openStore({selected: this.com.store2.val, multi: false});
    this.tool.dealModal(promise, res => {
      this.com.store2.val = res ? res : [];
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

  openSupplier() {
    const promise = this.popupData.openSupplier({selected: this.com.supplier.val});

    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
    });
  }
}

angular.module("hs.classesAnalyze.sub").controller("diffABCCtrl", DiffABCController);
