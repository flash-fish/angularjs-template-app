class StructureABCController {
  constructor(CommonCon, toolService, popups, popupDataService, Pop, Common,
              Table, Chart, basicService, $scope, $stateParams, $rootScope,
              dataService, $location, ABCAnalyzeSub, abcService, $sce, Symbols) {
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
    this.abcService = abcService;
    this.dataService = dataService;
    this.popupData = popupDataService;
    this.sce = $sce;
    this.Symbols = Symbols;

    this.abcCrossXY = angular.copy(CommonCon.abcCrossXY);
    //监听路由变化，路由变化时清空跳转所带条件；
    $rootScope.$on('$stateChangeStart', event => {
      this.basic.removeLocal('toStructure')
    });
    // this.scope.$on('changeTages',(d,data)=>{
    //   this.com.tags=data;
    // });
    this.htmlTooltip = this.sce.trustAsHtml('代码示例 <code>id:5</code>');
    //菜单
    this.menu = angular.copy(ABCAnalyzeSub);
    //tab
    this.tabs = angular.copy(CommonCon.abcStructureTabs);
    // this.root.showLine = 1
    this.scope.$on('changeTab', (d, data) => {
      if (data.active == 8) {
        this.newProductListActive = Number(data.selfData.currPopover.code);
      } else if (data.active == 7) {
        this.activeOperationGroup = Number(data.selfData.currPopover.code);
      }
    });
    this.scope.$on('serch', (d, data) => {
      // 柱状图拽入部分 监听事件添加条件到搜索框；
      if (data.show) {
        this.show = data.show;
      }
      switch (this.key.active) {
        case 1:
          this.com.tags = data.tags;
          break;
        case 7:
          this.com.businessOperationGroup = data.businessOperationGroup;
          break;
        case 5:
          this.com.store = data.store;
          break;
        case 4:
          this.com.brand = data.brand;
          break;
        case 8:
          this.com.newProductYear = data.newProductYear;
          break;
      }
      this.search()
    });

    //业态群 select
    this.operationGroup = angular.copy(CommonCon.abcOperationGroupSelect);

    //tip显示组件名称
    this.tip = {
      tplName: 'abcType.html'
    };


    this.haveCondition = false;

    // 日期控件配置
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};


    // 保存共通条件的地方
    this.com = this.basic.initCondition({
      date: "",
      isInit_delete: true
    }, ["store", "classes", "category", "brand", "product"]);

    //状态默认选中
    // this.com.activeStatus = '';

    this.activeOperationGroup = '';

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
        this.months = this.abcService.buildMonthSelect(newVal);
        let newMonth = [];
        newMonth = this.months.filter(i => {
          return i.id == this.activeMonth;
        });
        this.activeMonth = newMonth.length > 0 ? _.last(newMonth).id : _.last(this.months).id
      }


    });
    this.scope.$watch('ctrl.activeOperationGroup', newVal => {
      // 初始化时候的处理
      if (newVal) {
        this.activeOperationGroup = newVal
      } else {
        this.activeOperationGroup = '';
        delete this.com.businessOperationGroup;
      }
    });
    this.scope.$watch('ctrl.com.businessOperationGroup', newVal => {
      // 初始化时候的处理
      if (newVal) {
        this.activeOperationGroup = newVal[0]
      }
    });


    // 保存指标的local
    this.localTable = CommonCon.local.TABLE_ORIGIN_ABC_STRUCTURE;
    this.localChart = CommonCon.local.CHART_DATA_ABC_STRUCTURE;

    // 初始化类型
    this.abcType = angular.copy(CommonCon.abcStructureTypes);
    this.activeAbcType = this.abcType[0].id;
    this.abcType[0].active = true;
    //ABC选择框内的值；
    this.activeAll = [];

    const getAllABC = () => {
      // 整体ABC切换
      this.abcText = '整体ABC';
      this.abcAllSelect = angular.copy(ABCAnalyzeSub.abcAllSelect);
    };

    const getAvgABC = () => {
      // 平均ABC切换
      this.abcText = '平均ABC';
      this.abcAllSelect = angular.copy(ABCAnalyzeSub.abcAvgSelect);
    };

    //默认选择整体ABC
    this.com.total = 'true';
    this.scope.$watch('ctrl.com.total', (newVal) => {

      if (newVal != 'false') {
        // 整体ABC切换
        getAllABC();
        CommonCon.abcStructureTypes[0].active = true;
        CommonCon.abcStructureTypes[1].active = false;
      } else if (newVal == 'false') {
        // 整体ABC切换
        getAvgABC();
        CommonCon.abcStructureTypes[0].active = false;
        CommonCon.abcStructureTypes[1].active = true;
      }
    });

    this.newProductList = [];
    this.newProductListActive = "";


    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    //动态获取当前时间
    this.endTime = null;

    this.key = {
      active: 1,
      finish: false,
      page: CommonCon.pageType.abc,//图表标题
      abc: true, //叠堆柱状图和饼图的标志位
      title: this.abcType[0].name,
      special: {
        pageId: 'page_category_structure'
      }
    };

    this.scope.$watch('ctrl.key.active', (val, old) => {
      // 滚动到最上方
      $(window).scrollTop(0);
      //合并表格指标
      this.currFileds = angular.copy(this.Table.abc_structure);
      // 当tab 为门店的时候
      if ( val == 5 || this.com.total === 'true') {
        // 整体ABC切换
        getAllABC();
      } else {
        // 平均ABC切换
        getAvgABC();
      }

      // 切换tab时有可能条件变了，所以要重新组装下展示的条件
      if (val !== old) this.showCondition();
    });
    // 当前页面需要的指标结构
    this.currFileds = angular.copy(this.Table.abc_structure);

    this.originChart = angular.copy(this.Chart.abc_structure);
    //监听新品选择器变化
    this.scope.$watch('ctrl.newProductListActive', val => {
      this.com.newProductYear = val;
    });

    this.scope.$watch('ctrl.com.newProductYear', val => {
      this.newProductListActive = val;
    });

    this.sort = {
      date: 1,
      total: 2,
      classed: 3,
      category: 4,
      tags: 5,
      brand: 6,
      businessOperationGroup: 8,
      newProductYear: 7,
      store: 9,
      product: 10
    };
  }

  init() {
    //获取时间
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
    this.root.fullLoadingShow = false;

    //监听门店变化
    this.abcService.watchABCStore(this);

    //监听业态变化
    this.abcService.watchABCOperationGroup(this);

    // 获取路由参数的值用于子菜单渲染
    this.info = Object.assign({noReturn: true}, this.tool.subMenuInfo(this.state));
    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 监听订阅的事件
    this.tool.onEvent(this);

    this.scope.$on('showLine', (d, data) => {
      this.show = data;
    });

  };

  clearCondition() {
    this.basic.removeLocal('toStructure');
    this.targetABC = null;
    this.haveCondition = false;
    delete this.com.precondition;
    this.search();
  }

  /*
  * 获取跳转设定的数据*/
  getPreConditionAbc() {
    let conditionAbc = this.targetABC ? angular.copy(this.targetABC) : this.abcService.getLocalGoStructure();
    if(conditionAbc && !_.isUndefined(conditionAbc.show))
      this.show = conditionAbc.show;
    if (!conditionAbc || !conditionAbc.kpiCondition) {
      this.haveCondition = false;
    }
    if (conditionAbc && conditionAbc != null) {
      //页面跳转带来的参数不同，分情况处理
      //对比分析部分
      if (conditionAbc.com) {
        //门店不当参数带进来
        _.forIn(conditionAbc.com, (value, key) => {
          if (key != 'store' && key != 'store2') {
            this.com[key] = value;
            this.accessCom[key] = this.com[key];
          }
        });

        // const startM = conditionAbc.condition.date.from.toString().substring(4, 7);
        // const endM = conditionAbc.condition.date.to.toString().substring(4, 7);
        const year = conditionAbc.condition.date.to.toString().substring(0, 4);
        // this.activeMonth = this.months.filter(m => {
        //   return m.name == `${startM}-${endM}`
        // })[0].id;
        if (year !== String(this.activeYear))  this.months = this.abcService.buildMonthSelect(year);
        let start = moment(String(conditionAbc.condition.date.from), "YYYYMM").format("YYYY/MM");
        let end = moment(String(conditionAbc.condition.date.to),  "YYYYMM").format("YYYY/MM");
        this.activeMonth = this.months.find(m => m.id === `${start}-${end}`).id;


        this.activeYear = this.years.filter(m => {
          return m.name == year
        })[0].id;
      }
      //交叉分析部分
      if (conditionAbc.condition.precondition) this.com.precondition = conditionAbc.condition.precondition;
      this.effect = conditionAbc.com;
      this.preCondition = '';
      //数据条件
      _.forIn(conditionAbc.condition.precondition, (val, key) => {
        if (key === 'abc') {
          val.forEach((p, index) => {
            if (typeof p.field === 'number') {
              this.preCondition = `${conditionAbc.condition.store.val[0].name}[${val[0].tags}]，${conditionAbc.condition.store.val[1].name}[${val[1].tags}]`
            } else {
              if (p.field === 'total' && conditionAbc.kpiCondition) {
                conditionAbc.kpiCondition += '，整体评分[' + p.tags + ']';
              } else if (p.field === 'total' && !conditionAbc.kpiCondition) {
                conditionAbc.kpiCondition = '整体评分[' + p.tags + ']';
              }

              if (p.field === 'avg' && conditionAbc.kpiCondition) {
                conditionAbc.kpiCondition += '，平均评分[' + p.tags + ']';
              } else if (p.field === 'avg' && !conditionAbc.kpiCondition) {
                conditionAbc.kpiCondition = '平均评分[' + p.tags + ']';
              }

              if (p.field.includes('operation_type')) {
                //type 1、2、3、4、99
                // const len = 'operation_type'.length;
                const type = parseInt(p.field.replace(/[^0-9]/ig, ""));
                //name 业态类型
                const name = this.operationGroup.filter(s => {
                  return s.id == type;
                })[0].name;
                const avg = p.field.includes('avg') ? '平均' : '';
                const comma = this.preCondition.length ? '，' : '';
                this.preCondition += comma + name + avg + '评分[' + p.tags + ']';
              }
            }

          });
          if (conditionAbc.kpiCondition) {
            if (this.preCondition) {
              this.preCondition += '，' + conditionAbc.kpiCondition
            } else {
              this.preCondition = conditionAbc.kpiCondition
            }

          }
        }
        if (this.abcCrossXY.find(a => a.title === key)) {
          if(val && String(val.upper) && String(val.lower) && val.upper === val.lower)
            val.upper = Number(val.upper) + 1;
        }
      });
      if (this.preCondition) {
        this.haveCondition = true;
      }
    } else {
      this.haveCondition = false;
      this.preCondition = '暂无设定';
    }
  }

  initialize(data) {
    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);

    this.com = angular.copy(this.accessCom);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    if (this.tableInfo.page) {
      this.key.active = 7;
    }

    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    // 初始化日期范围
    this.tool.pageInit(this, () => {
      this.formatDate();

      this.getPreConditionAbc();

      let conditionAbc = this.basic.getSession('conditionAbc');

      if (this.effect && conditionAbc) {
        _.forIn(this.effect, (value, key) => {
          if (this.effect[key].val) this.com[key] = value;
          if (key == 'date') this.com[key] = value;
        });

        this.formatDate();

        // const startM = conditionAbc.condition.date.from.toString().substring(4, 7);
        // const endM = conditionAbc.condition.date.to.toString().substring(4, 7);
        const year = conditionAbc.condition.date.to.toString().substring(0, 4);
        //
        // this.activeMonth = this.months.filter(m => {
        //   return m.name == `${startM}-${endM}`
        // })[0].id;

        if (year !== String(this.activeYear))  this.months = this.abcService.buildMonthSelect(year);
        let start = moment(String(conditionAbc.condition.date.from), "YYYYMM").format("YYYY/MM");
        let end = moment(String(conditionAbc.condition.date.to), "YYYYMM").format("YYYY/MM");
        this.activeMonth = this.months.find(m => m.id === `${start}-${end}`).id;
        this.activeYear = this.years.filter(m => {
          return m.name == year
        })[0].id;
      }
      this.commonParam = angular.copy(this.com);
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

    // 初始化图表指标
    const chart = this.basic.getLocal(this.localChart);
    if (chart) {
      this.field.chart = chart;
    } else {
      const newChart = angular.copy(this.originChart);
      const fieldSale = this.tool.calculateChartField(newChart.sale);
      const fieldStock = this.tool.calculateChartField(newChart.stock);
      this.field.chart = {first: fieldSale, second: fieldStock};
    }
    this.basic.setLocal("abc_field_chart", this.field.chart);
  }

  /**
   * 点击查询
   */
  search(type) {
    this.key.finish = false;
    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);
    this.formatDate();
    this.key.title = this.com.total == 'true' ? '整体ABC' : '平均ABC';
    if (type == 1) {
      this.getPreConditionAbc();
    }
    this.commonParam = this.tool.commonSearch(this);
    this.showCondition();
  }

  showCondition(){
    let com = angular.copy(this.commonParam);
    const other = {
      tags: {name: '商品ABC', map: "abcAllSelect"},
      businessOperationGroup: {name: '业态群', map: "operationGroup"},
      newProductYear: {name: '新品', map: "newProductList"},
      total: {name: "ABC维度"}
    };
    // (补丁) 当切到按门店或者门店框有选择时，com 的 total 要设成 true
    if (this.key.active === 5 || com.store.val.length) com.total = 'true';
    _.keys(other).forEach(k => {
      // ABC维度
      if (k === "total") {
        com[k] = this.abcType.find(a => a.id === com[k]).name;
      } else if(!_.eq(k, 'tags') && com[k]) {
        // 业态群 && 新品
        const val = angular.isArray(com[k]) ? com[k][0] : com[k];
        val ? com[k] = this[other[k].map].find(m => m.id === val).name : delete com[k];
      } else if(_.eq(k, 'tags') && com[k]) {
        // 商品ABC
        const val = _.values(_.pick(this.abcAllSelect, com[k])).join(this.Symbols.comma);
        val ? com[k] = val :delete com[k];
      } else
        delete com[k];
    });
    this.sortCom = this.tool.dealSortData(com, this.sort, other);
  }

  /**
   * 格式化日期为统一格式：YYYY/MM-YYYY/MM
   */
  formatDate() {

    // const m = this.months[parseInt(this.activeMonth)].name.split('-');
    // const y = this.activeYear
    let conditionAbc = this.basic.getSession('conditionAbc');
    if (!conditionAbc) this.com.date =angular.copy(this.activeMonth);

    if (this.activeOperationGroup && this.activeOperationGroup !== '') {

      this.com.businessOperationGroup = [this.activeOperationGroup];
    }

    // this.com.total = this.typeActive == 'true' ? true : false
  }

  /**
   * 根据年份设置月份下拉内容
   */
  setMonth(data) {
    //新品下拉框
    this.newProductList = [
      {name: `${this.endTime.year}新品`, id: this.endTime.year},
      {name: `${this.endTime.year - 1}新品`, id: this.endTime.year - 1},
      {name: '旧品', id: 1},
    ];
    // this.newProductListActive=this.endTime.year;
    this.years = this.tool.buildYearSelect(data.year - 1, data.year);
    this.activeYear = data.year;
    const nowMonth = data.monthValue; //month
    if (this.activeYear === this.years[0].id) {
      this.months = this.abcService.buildMonthSelect(this.endTime.year, nowMonth);
    } else {
      this.months = this.abcService.buildMonthSelect(this.activeYear);
    }
    this.activeMonth = _.last(this.months).id;
  }

  /**
   * 图表设定 获取chart popup
   */
  getChartOption() {
    const promise = this.popups.popupAbcStructureChart({
      field: this.originChart
    });
    this.tool.dealModal(promise, res => {
      this.field.chart = res;

      this.basic.setLocal("abc_field_chart", res);
      this.field = Object.assign({}, this.field);

    });
  }

  /**
   * 数据设定
   */
  getTableOption() {
    const promise = this.popups.popupAbcStructureTable({
      local: this.localTable,
      field: this.currFileds
    });
    this.field.newTable.forEach(i => {
      if (i.includes('arrivalRate') && i.includes('YoY') && !i.includes('Value')) {
        this.field.newTable.push(`${i}Inc`);
      }
    });
    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.field = Object.assign({}, this.field);
    });
  }


  /**
   * 获取 popup
   */
  openNewProduct() {
    const promise = this.popupData.openNewProduct({selected: this.com.product.val, years: this.model_date});
    this.tool.dealModal(promise, res => {
      this.com.product.val = res ? res : [];
    });
  }

  //门店 单选
  openStoreList() {
    const promise = this.popupData.openStore({selected: this.com.store.val, multi: true});

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

  openTargetABC() {
    const params = this.abcService.getLocalGoStructure();
    let conditionAbc = this.targetABC ? this.targetABC : this.abcService.getLocalGoStructure();
    this.basic.setLocal('newConditionAbc', conditionAbc);
    const promise = this.popupData.openTargetABC(this.targetABC ? this.targetABC : params);
    this.tool.dealModal(promise, res => {
      let newConditionAbc = this.basic.getLocal('newConditionAbc');
      this.targetABC = angular.copy(res);
      //当条件不为空 并且 本地存储条件也不为空时，发送请求
      if (this.targetABC.kpiCondition || (newConditionAbc && newConditionAbc.kpiCondition) || this.targetABC.condition.precondition.abc.length != 0) {
        this.search(1);
      }
    });
  }
}

angular.module("hs.classesAnalyze.sub").controller("structureABCCtrl", StructureABCController);
