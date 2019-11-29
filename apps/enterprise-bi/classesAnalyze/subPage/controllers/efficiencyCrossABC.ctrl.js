/**
 * Created by ios on 2018/8/13.
 */
class EfficiencyCrossABCController {
  constructor(CommonCon, toolService, popups, popupDataService, Pop, Common,
              Table, Chart, basicService, $scope, $stateParams, $rootScope,
              dataService, abcService, ABCAnalyzeSub, FigureService, $state, Field, Symbols) {
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
    this.$state = $state;
    this.Field = Field;
    this.abcService = abcService;
    this.Symbols = Symbols;

    this.isOk = false;
    this.showTable = false;

    // 接口参数
    this.interfaceName = 'getAbcChartTableForEfficiencyCross';

    //菜单
    this.menu = angular.copy(ABCAnalyzeSub);

    //ABC tab
    this.tabs = angular.copy(CommonCon.abcStructureTabs);

    //整体
    this.allSelect = angular.copy(CommonCon.abcAllSelect);
    this.activeAll = ['A'];

    //平均
    this.avgSelect = angular.copy(CommonCon.abcAvgSelect);
    this.activeAvg = ['A'];

    this.operation = angular.copy(CommonCon.abcOperationGroupSelect).filter(s => s.id !== 99);

    // this.allOperations = {
    //   A: '各业态整体 A',
    //   B: '各业态整体 B',
    //   C: '各业态整体 C'
    // };
    // this.activeAllOperations = ['A'];
    //
    // //平均各业态
    // this.avgOperations = {
    //   A: '各业态平均 A',
    //   B: '各业态平均 B',
    //   C: '各业态平均 C'
    // };
    //整体各业态
    this.allOperations = angular.copy(CommonCon.abcSelect);
    this.activeAllOperations = ['A'];

    //平均各业态
    this.avgOperations = angular.copy(CommonCon.abcSelect);
    this.activeAvgOperations = ['A'];

    //效能分析 select
    this.selectX = angular.copy(CommonCon.abcCrossXY);
    this.selectY = angular.copy(CommonCon.abcCrossXY);
    this.activeX = this.selectX[0].id;
    this.activeY = this.selectX[2].id;

    this.shotcut = {
      yes: {name: '高效能商品', id: '1'},
      no: {name: '低效能商品', id: '2'},
    };
    this.activeShotcut = '1';

    //缩放时 用于存储当前选中区域的最大最小值
    this.postMinAndMaxData = {};
    // //年 select
    // const nowYear = Number(moment().format('YYYY')); //今年
    // this.years = this.tool.buildYearSelect(nowYear - 1);
    // this.activeYear = 0;

    this.watch();

    // 日期控件配置
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({date: ""}, ["classes", "category"]);

    // 初始化类型
    this.abcType = angular.copy(CommonCon.abcStructureTypes);

    this.typeActive = this.abcType[0].id;
    this.allText = '整体';
    this.scope.$watch('ctrl.typeActive', newVal => {
      if (newVal == this.abcType[0].id) {
        // 整体ABC
        this.allText = '整体';
        this.activeAll = this.activeAvg;
        this.com.total = newVal == 'true' ? true : false;
        this.activeAllOperations = this.activeAvgOperations
      } else {
        //  平均ABC
        this.allText = '平均';
        this.activeAvg = this.activeAll;
        this.com.total = newVal == 'true' ? true : false;
        this.activeAvgOperations = this.activeAllOperations;
      }
    });
    this.x = this.selectX[parseInt(this.activeX)];
    this.y = this.selectY[parseInt(this.activeY)];
    this.changeKpi = false;
    this.watch();
    //监听业态变化
    this.abcService.watchABCOperationGroup(this);

    //业态群 select
    this.operationGroup = angular.copy(CommonCon.abcOperationGroupSelect);

    this.activeOperationGroup = '';

    this.scope.$watch('ctrl.activeOperationGroup', newVal => {
      let newArr = [];
      this.activeOperationGroup = newVal;
      if (newVal != '') {
        newArr.push(newVal);
        if (newArr != []) {
          this.com.businessOperationGroup = newArr
        }
      } else {
        delete this.com.businessOperationGroup
      }
    })

    //动态获取日期数据
    this.endTime = null;
    this.key = {
      finish: false
    };

    //  定义一些变量，用来存储查询候的数据
    this.copyactiveYear = '';
    this.copyactiveMonth = '';
    this.copycom = '';
    this.copyactiveShotcut = '';
    this.copyabcType = '';
    this.copyactiveAvg = '';
    this.copyactiveAll = '';
    this.copyactiveAllOperations = '';
    this.copyactiveAvgOperations = '';
    this.copyactiveOperationGroup = '';

    // 页面ID
    this.pageId = 'page_category_across';

    this.sort = {
      date: 1,
      // activeAll: 2,
      // activeAvg: 2,
      // activeAllOperations: 3,
      // activeAvgOperations: 3,
      total: 2,
      _productABC: 3,
      classes: 4,
      category: 5,
      activeOperationGroup: 6,
    };
  }

  init() {
    this.activeAllOperationsFlag = true;
    this.activeAvgOperationsFlag = true;
    this.activeAvgFlag = true;
    this.activeAllFlag = true;
    //获取时间
    let time = this.basic.getSession('ABCTime');
    if (time) {
      this.endTime = time.data;
      this.setMonth(time.data)
    } else {
      this.dataService.getDateCode().then(res => {
        this.basic.setSession('ABCTime', res);
        this.endTime = res.data;
        this.setMonth(res.data)
        //年变化时 设置月
      });
    }
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));
  }

  mouseMoveEvent(type) {

    this[type] = !this[type];
  }

  initialize(data) {
    sessionStorage.removeItem("effectCrossABC");

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 初始化日期范围
    this.tool.initDate(this, () => {
      this.formatDate();
      this.com.total = this.typeActive == 'true' ? true : false;
      this.commonParam = angular.copy(this.com);
      this.com.businessOperationGroup = [];

      this.copyactiveYear = angular.copy(this.activeYear);
      this.copyactiveMonth = angular.copy(this.activeMonth);
      this.copycom = angular.copy(this.com);
      this.copyactiveShotcut = angular.copy(this.activeShotcut);
      this.copyabcType = angular.copy(this.abcType);
      this.copyactiveAvg = angular.copy(this.activeAvg);
      this.copyactiveAll = angular.copy(this.activeAll);
      this.copyactiveAllOperations = angular.copy(this.activeAllOperations);
      this.copyactiveAvgOperations = angular.copy(this.activeAvgOperations);
      this.copyactiveOperationGroup = angular.copy(this.activeOperationGroup);
      // if(this.activeOperationGroup!='')this.com.businessOperationGroup.push(this.activeOperationGroup);
      this.getData(this.buildParam());
      this.showCondition();
    });
  }

  /*
  * type 1.高效能 2.低效能
  * */
  changeEfficacy(type) {
    if (type == 1) {
      // 高效能
      if (this.typeActive == 'true') {
        // 整体
        this.activeAll = ['A'];
        this.activeAllOperations = ['A']
      } else {
        // 平均
        this.activeAvg = ['A'];
        this.activeAvgOperations = ['A']
      }
    } else {
      // 低效能
      if (this.typeActive == 'true') {
        this.activeAll = ['C'];
        this.activeAllOperations = ['B', 'C']
      } else {
        this.activeAvg = ['C'];
        this.activeAvgOperations = ['B', 'C'];
      }
    }
  }

  /**
   * 点击查询
   */
  search() {
    this.key.finish = false;
    this.isOk = false;
    this.showTable = false;

    // 合并当前选中的值和权限中的值
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.formatDate();

    this.commonParam = this.tool.commonSearch(this);

    //如果查询参数改变，跳转参数以查询过的参数为准；
    //保存查询的参数
    this.copyactiveYear = angular.copy(this.activeYear);
    this.copyactiveMonth = angular.copy(this.activeMonth);
    this.copycom = angular.copy(this.com);
    this.copyactiveShotcut = angular.copy(this.activeShotcut);
    this.copyabcType = angular.copy(this.abcType);
    this.copyactiveAvg = angular.copy(this.activeAvg);
    this.copyactiveAll = angular.copy(this.activeAll);
    this.copyactiveAllOperations = angular.copy(this.activeAllOperations);
    this.copyactiveAvgOperations = angular.copy(this.activeAvgOperations);
    this.copyactiveOperationGroup = angular.copy(this.activeOperationGroup);

    sessionStorage.removeItem("effectCrossABC");
    this.getData(this.buildParam());
    this.showCondition();
  }

  showCondition() {
    let com = angular.copy(this.copycom);
    const needCopy = ['activeAll', 'activeAllOperations', 'activeAvg', 'activeAvgOperations', 'activeOperationGroup'];
    let comOther = {};
    needCopy.forEach(n => comOther[n] = angular.copy(this[n]));
    const other = {
      activeOperationGroup: {name: '业态群'},
      _productABC: {name: '商品ABC'},
      total: {name: "ABC维度"}
    };
    let calFiled = (obj, findObj) => {
      let name = [];
      obj.forEach(a => {
        name.push(findObj[a]);
      });
      return name;
    };
    if (com.total) {
      const allName = calFiled(comOther.activeAll,  this.allSelect).concat(calFiled(comOther.activeAllOperations, this.allOperations));
      com._productABC = allName.length ? allName.join(this.Symbols.comma) : '';
    } else {
      const avgName = calFiled(comOther.activeAvg,  this.avgSelect).concat(calFiled(comOther.activeAvgOperations, this.avgOperations));
      com._productABC = avgName.length ? avgName.join(this.Symbols.comma) : '';
    }

    com.total = com.total ? "整体ABC" : "平均ABC";

    if(!com._productABC)
      delete com._productABC;
    if(comOther.activeOperationGroup)
      com.activeOperationGroup = this.operationGroup.find(o => o.id === comOther.activeOperationGroup).name;
    else
      delete com.activeOperationGroup;
    this.sortCom = this.tool.dealSortData(com, this.sort, other);
  }

  /**
   * watch
   */
  watch() {
    //KPI select变化时
    this.scope.$watch('ctrl.activeX', (newValue, oldValue) => {
      this.basic.setSession('effectCrossABC', []);
      this.changeKpi = true;
      if (newValue == oldValue) return;
      this.x = this.selectX[newValue];
      this.selectChange('Y');
      this.showTable = false;
      //如果查询参数改变，跳转参数以查询过的参数为准；
      //保存查询的参数
      this.copyactiveYear = angular.copy(this.activeYear);
      this.copyactiveMonth = angular.copy(this.activeMonth);
      this.copycom = angular.copy(this.com);
      this.copyactiveShotcut = angular.copy(this.activeShotcut);
      this.copyabcType = angular.copy(this.abcType);
      this.copyactiveAvg = angular.copy(this.activeAvg);
      this.copyactiveAll = angular.copy(this.activeAll);
      this.copyactiveAllOperations = angular.copy(this.activeAllOperations);
      this.copyactiveAvgOperations = angular.copy(this.activeAvgOperations);
      this.copyactiveOperationGroup = angular.copy(this.activeOperationGroup);
      this.getData(this.buildParam());
    });

    this.scope.$watch('ctrl.activeY', (newValue, oldValue) => {
      this.basic.setSession('effectCrossABC', []);
      this.changeKpi = true;
      if (newValue == oldValue) return;
      this.y = this.selectY[newValue];
      this.selectChange('X');
      this.showTable = false;
      //如果查询参数改变，跳转参数以查询过的参数为准；
      //保存查询的参数
      this.copyactiveYear = angular.copy(this.activeYear);
      this.copyactiveMonth = angular.copy(this.activeMonth);
      this.copycom = angular.copy(this.com);
      this.copyactiveShotcut = angular.copy(this.activeShotcut);
      this.copyabcType = angular.copy(this.abcType);
      this.copyactiveAvg = angular.copy(this.activeAvg);
      this.copyactiveAll = angular.copy(this.activeAll);
      this.copyactiveAllOperations = angular.copy(this.activeAllOperations);
      this.copyactiveAvgOperations = angular.copy(this.activeAvgOperations);
      this.copyactiveOperationGroup = angular.copy(this.activeOperationGroup);
      this.getData(this.buildParam());
    });

    //高低效能变化时
    this.scope.$watch('ctrl.activeShotcut', newVal => {
      if (_.isUndefined(newVal) || _.isNull(newVal)) return;
      if (newVal == 1) {//高效能
        this.activeAll = ['A'];
        this.activeAvg = ['A'];
        this.activeAllOperations = ['A'];
        this.activeAvgOperations = ['A'];
      } else if (newVal == 2) {//低效能
        this.activeAll = ['C'];
        this.activeAvg = ['C'];
        this.activeAllOperations = ['B', 'C'];
        this.activeAvgOperations = ['B', 'C'];
      }
    });

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
        this.months = this.abcService.buildMonthSelect(time.data.year);
        let newMonth = [];
        newMonth = this.months.filter(i => {
          return i.id == this.activeMonth;
        });
        this.activeMonth = newMonth.length > 0 ? _.last(newMonth).id : _.last(this.months).id
      }
    });

    this.scope.$watch('ctrl.com.store.val', (newVal, oldVal) => {
      if (newVal == oldVal) return;
      this.disableOper = newVal && newVal.length > 0;
      if (this.disableOper) this.com.operation.val = [];
      this.setShotCut();
    });

    this.scope.$watch('ctrl.com.operation.val', (newVal, oldVal) => {
      if (newVal == oldVal) return;
      this.disableStore = newVal && newVal.length > 0;
      if (this.disableStore) this.com.store.val = [];
      this.setShotCut();
    });
  }

  setShotCut() {
    if (this.com.store.val.length || this.com.operation.val.length) {
      this.shotcut.yes.disabled = true;
      this.shotcut.no.disabled = true;
    } else {
      delete this.shotcut.yes.disabled;
      delete this.shotcut.no.disabled;
    }
  }

  /**
   *
   * @param param 请求参数
   * @param flag true：矩形选择
   * @param back true:撤回
   */
  getData(param, flag, back) {
    param.pageId = this.pageId;
    this.root.fullLoadingShow = true;
    this.basic.packager(this.dataService[this.interfaceName](param), res => {
      this.root.fullLoadingShow = false;
      const r = res.data;
      this.detail = r.details;
      const summary = r.summary;

      this.offset = r.offset;

      //矩形选择时不重新绘制chart
      if (!flag && !back) {
        this.chartOption = this.buildChart();
        let effectCrossABC = this.basic.getSession('effectCrossABC');
        if (effectCrossABC) {
          effectCrossABC.push(param);
          this.basic.setSession('effectCrossABC', effectCrossABC);
        } else {
          this.basic.setSession('effectCrossABC', [param]);
        }
      }

      if (back) this.chartOption = this.buildChart();

      this.event = [
        {name: "brushselected", func: this.bruchSelectedFun()},
        {name: "datazoom", func: this.dataZoomFun()},
      ];

      //矩形
      if (flag) {
        this.buildTable();
        this.setSum(summary);
      }
      this.root.fullLoadingShow = false;
      this.key.finish = true;
    }, () => {
      //缺少参数请求失败的回调
      let res = {
        data: {
          details: [],
          offset: {layStoreCnt: 0, stockCostAvg: 0},
          summary: {},
          total: 0,
        },
      };
      this.root.fullLoadingShow = false;
      const r = res.data;
      this.detail = r.details;
      const summary = r.summary;
      this.offset = r.offset;
      //矩形选择时不重新绘制chart
      if (!flag && !back) {
        this.chartOption = this.buildChart();
        let effectCrossABC = this.basic.getSession('effectCrossABC');
        if (effectCrossABC) {
          effectCrossABC.push(param);
          this.basic.setSession('effectCrossABC', effectCrossABC);
        } else {
          this.basic.setSession('effectCrossABC', [param]);
        }
      }

      if (back) this.chartOption = this.buildChart();

      this.event = [
        {name: "brushselected", func: this.bruchSelectedFun()},
        {name: "datazoom", func: this.dataZoomFun()},
      ];

      //矩形
      if (flag) {
        this.buildTable();
        this.setSum(summary);
      }
      this.root.fullLoadingShow = false;
      this.key.finish = true;
    })
  };

  /**
   *
   * @param type 1 缩放 2矩形选择
   * @param pos 四个点
   * @returns {*}
   */
  buildParam(type, pos) {
    let precondition = {
      abc: []
    };
    if (this.typeActive == 'true') {
      if (this.activeAll.length > 0) {
        precondition.abc.push({field: 'total', tags: this.activeAll})
      }

    } else {
      if (this.activeAll.length > 0) {
        precondition.abc.push({field: 'avg', tags: this.activeAvg})
      }
    }

    this.operation.forEach(d => {
      if (this.activeAllOperations.length > 0 || this.activeAvgOperations > 0) {
        let field = 'operation_type' + d.id;
        let tags = this.activeAllOperations;
        if (this.typeActive !== 'true') {
          field = field + '_avg';
          tags = this.activeAvgOperations;
        }
        precondition.abc.push({field: field, tags: tags});
      }
    });

    const x = this.selectX[parseInt(this.activeX)];
    const y = this.selectY[parseInt(this.activeY)];

    precondition[x.title] = {'ndiv': 20};
    precondition[y.title] = {'ndiv': 5};
    if (type) {
      const offsetX = this.offset[x.title];
      const offsetY = this.offset[y.title];
      if (pos && type == 1) {
        precondition[x.title].lower = pos.xStart;
        precondition[x.title].upper = pos.xEnd;

        precondition[y.title].lower = pos.yStart;
        precondition[y.title].upper = pos.yEnd;
      }
      if (pos && type == 2) {
        precondition[x.title].lower = pos.xStart;
        precondition[x.title].upper = pos.xEnd;
        precondition[y.title].lower = pos.yStart;
        precondition[y.title].upper = pos.yEnd;
      }
      precondition[x.title].offset = offsetX;
      precondition[y.title].offset = offsetY;
    }

    let f = [x.title, y.title];
    let param = this.tool.buildParam(this.tool.getParam(this.commonParam, f), {noChart: true});
    param.condition.precondition = precondition;
    delete param.fields;

    this.basic.setSession('efficiencyCrossParam', param);
    param.condition.scale = type == 1;
    return param;
  }

  /**
   * 矩形选择事件
   * @returns {Function}
   */
  bruchSelectedFun() {
    return (param) => {
      if (!param.batch[0].areas.length) {
        this.isOk = false;
        return;
      }
      this.changeKpi = false;
      const range = param.batch[0].areas[0].coordRange;
      this.bruchPos = {
        xStart: range[0][0],
        xEnd: range[0][1],
        yStart: range[1][0],
        yEnd: range[1][1],
      };

      this.isOk = true;
    }
  }

  /**
   * 缩放事件
   * @returns {Function}
   */
  dataZoomFun() {


    return (param) => {
      this.changeKpi = false;
      let pos = {
        xStart: param.batch[0].startValue,
        xEnd: param.batch[0].endValue,
        yStart: param.batch[1].startValue,
        yEnd: param.batch[1].endValue,
      };
      // _.keys(pos).forEach(p => pos[p] = parseFloat(this.figure.scaleOther(pos[p], 0, 0)));
      // this.postMinAndMaxData = pos;
      // //获取选中区域最小点和最大点；
      // let layStoreCntArr = [];
      // let stockCostAvgArr = [];
      //
      // const x = this.selectX[parseInt(this.activeX)];
      // const y = this.selectY[parseInt(this.activeY)];
      // console.log(x, y);
      // this.detail.forEach(i => {
      //   layStoreCntArr.push(i[x.title]);
      //   stockCostAvgArr.push(i[y.title]);
      // });
      // //当前选中的最大最小值
      // let newlayStoreCntArr = [];
      // layStoreCntArr.forEach(i => {
      //   if (i <= this.postMinAndMaxData.xEnd && this.postMinAndMaxData.xStart <= i) {
      //     newlayStoreCntArr.push(i)
      //   }
      // });
      // let newStockCostAvgArr = [];
      // stockCostAvgArr.forEach(i => {
      //   if (i <= this.postMinAndMaxData.yEnd && this.postMinAndMaxData.yStart <= i) {
      //     newStockCostAvgArr.push(i);
      //   }
      // });
      //
      // let minX = '';
      // let maxX = '';
      // maxX = _.max(newlayStoreCntArr);
      // minX = _.min(newlayStoreCntArr);
      //
      // let minY = '';
      // let maxY = '';
      // maxY = _.max(newStockCostAvgArr);
      // minY = _.min(newStockCostAvgArr);
      //
      // const offsetX = this.offset[x.title];
      // const offsetY = this.offset[y.title];
      // pos = {
      //   xStart: minX,
      //   xEnd: maxX + offsetX - 1,
      //   yStart: minY,
      //   yEnd: maxY + offsetY - 1,
      // };
      // console.log(newlayStoreCntArr, newStockCostAvgArr);

      this.getData(this.buildParam(1, pos));
    }
  }

  /**
   * 矩形选择-确定
   */
  ok() {
    this.isOk = false;
    this.root.fullLoadingShow = true;
    this.getData(this.buildParam(2, this.bruchPos), true);
    this.showTable = true;
  }

  /**
   *
   * @param max 最大值
   * @param min 最小值
   * @param type x轴title、y轴title
   * @returns {Array}
   */
  buildHead(max, min, type) {
    let head = [], title = this[type].title;
    this.detail.forEach((l, i) => {
      const start = min + i * this.offset[title];
      const end = min + this.offset[title] + i * this.offset[title];

      if (start >= max) return;

      head.push({name: start + '~' + end});
    });


    return head;
  }

  /**
   * 格式化日期为统一格式：YYYY/MM-YYYY/MM
   */
  formatDate() {
    // const m = this.months[parseInt(this.activeMonth)].name.split('-');
    // const y = this.activeYear;
    // this.com.date = y + "/" + m[0] + '-' + y + '/' + m[1];

    this.com.date =angular.copy(this.activeMonth);

  }

  /**
   * 构建echart
   * @param detail
   */
  buildChart() {
    const x = this.x;
    const y = this.y;
    const offsetX = this.offset[x.title];
    const offsetY = this.offset[y.title];
    let totalSku = 0;
    let dotNum = this.detail.length;

    let greenData = [];
    let blueData = [];
    let redData = [];
    this.detail.forEach(d => {
      totalSku += d.skuUnit;
    });
    // 标准值是总计有售sku数/(点数-2） 2为边界值的两个点    R20
    let avgSku = Math.ceil(totalSku / (dotNum > 2 ? dotNum - 2 : 1));
    let Green = avgSku * 2;
    let R20 = avgSku * 1;
    let R15 = avgSku * 0.75;
    let R10 = avgSku * 0.5;
    let R05 = avgSku * 0.25;
    this.detail.forEach(d => {
      const arr = [d[x.title], d[y.title], d.skuUnit, avgSku];
      if (d.skuUnit > Green) {
        //大于均值2倍以上
        greenData.push(arr);
      } else if (d.skuUnit <= Green && d.skuUnit > R20) {
        //大于均值2倍以内
        blueData.push(arr);
      } else if (d.skuUnit <= R20) {
        //小于等于均值且大于3/4均值
        redData.push(arr);
      } else {
        redData.push(arr);
      }
    });


    let option = {
      title: {},
      legend: {
        selectedMode: false,
        data: [`sku数<=${avgSku}`, `sku数：${avgSku + 1} ~ ${avgSku * 2}`, `sku数>${avgSku * 2}`],
        left: 'center',
        textStyle: {
          fontSize: 15,
          fontWeight: 900,
          // color: '#F1F1F3'
        }
      },
      tooltip: {
        axisPointer: {
          show: true,
          type: 'cross',
          lineStyle: {
            type: 'dashed',
            width: 1
          }
        },
        formatter: function (params) {
          let kcStr = '';
          let zzStr = '';
          if (params.value[0] - offsetX / 2 > 1000) {
            kcStr = `${x.name}>${params.value[0] - offsetX / 2}`;

          } else if (params.value[0] - offsetX / 2 <= -1100) {
            kcStr = `${x.name}<${params.value[0] - offsetX / 2}`;

          } else {
            kcStr = `${x.name}：${params.value[0] - offsetX / 2}—${params.value[0] + offsetX / 2}`
          }

          if (params.value[1] - offsetX / 2 > 1000) {
            zzStr = `${y.name}>${params.value[1] - offsetY / 2}`;

          } else if (params.value[1] - offsetY / 2 <= -1100) {
            zzStr = `${y.name}<${params.value[1] - offsetY / 2}`;

          } else {
            zzStr = `${y.name}：${params.value[1] - offsetY / 2}—${params.value[1] + offsetY / 2}`
          }

          return kcStr
            + '</br>' + zzStr
            + '</br>' + '有售SKU数：' + params.value[2];
        }
      },
      toolbox: {
        itemSize: 14,
        feature: {
          dataZoom: {
            title: {back: ''}// 区域缩放还原要被返回给遮罩，因此hover时title不应出现
          },
          brush: {
            type: ['rect', 'clear']
          }
        },
        right: '25'
      },
      brush: {
        xAxisIndex: 0
      },
      grid: {
        left: 50,
        bottom: 25,
        right: 25,
        containLabel: true
      },
      xAxis: {
        name: x.name,
        nameLocation: 'middle',
        nameGap: 33,

        maxInterval: offsetX,
        minInterval: offsetX,
        type: 'value',
        min: 'dataMin',
        max: "dataMax",
        axisLabel: {
          show: true,
          formatter: '{value}',
        },
        //scale:true,
        boundaryGap: false,
        inverse: false,
        axisLine: {
          show: true
        }
      },
      yAxis: {
        min: 'dataMin',
        max: 'dataMax',
        maxInterval: offsetY,
        minInterval: offsetY,
        name: y.name,
        nameLocation: 'middle',
        nameGap: 40,
        type: 'value',
        inverse: false,
        axisLine: {
          show: true,
        }
      },
      series: [
        {
          name: `sku数>${avgSku * 2}`,
          type: 'scatter',
          symbolSize: 20,
          itemStyle: {
            normal: {
              color: '#3CB371',
            }
          },
          data: greenData,
          animationDelay: function (idx) {
            return idx * 5;
          }
        },
        {
          name: `sku数：${avgSku + 1} ~ ${avgSku * 2}`,
          type: 'scatter',
          symbolSize: 20,
          itemStyle: {
            normal: {
              color: '#4682B4',
            }
          },
          data: blueData,
          animationDelay: function (idx) {
            return idx * 5;
          }
        },
        {
          name: `sku数<=${avgSku}`,
          type: 'scatter',
          symbolSize: function (val, params) {
            let size = 0;
            if (val[2] > R15 && val[2] <= R20) {
              //小于等于均值且大于3/4均值
              size = 20;
              return size;
            } else if (val[2] > R10 && val[2] <= R15) {
              //小于等于均值3/4且大于2/4均值
              size = 15;
              return size;
            } else if (val[2] > R05 && val[2] <= R10) {
              //小于等于均值2/4且大于1/4均值
              size = 10;
              return size;
            } else if (val[2] > 0 && val[2] <= R05) {
              //小于1/4均值
              size = 5;
              return size;
            } else if (val[2] == 0) {
              //小于1/4均值
              // delete val[]
              size = 0;
              return size;
            }

          },
          itemStyle: {
            normal: {
              color: '#e88f70',
            }
          },
          data: redData,
          animationDelay: function (idx) {
            return idx * 5;
          }
        },

      ]
    };

    this.noData = false;
    if(!greenData.length && !blueData.length && !redData.length) {
      delete option.toolbox.feature.dataZoom;
      delete option.toolbox.feature.brush;
      delete option.brush;
      this.noData = true;
    }

    return option;
  }

  /**
   * 构建table
   */
  buildTable() {
    const xValue = this.detail.map(d => {
      return d[this.x.title]
    });

    const yValue = this.detail.map(d => {
      return d[this.y.title]
    });

    const x = this.selectX[parseInt(this.activeX)];
    const y = this.selectY[parseInt(this.activeY)];
    const offsetX = this.offset[x.title];
    const offsetY = this.offset[y.title];
    const xValueMax = Math.max.apply(null, xValue) + offsetX / 2;//x最大值
    const xValueMin = Math.min.apply(null, xValue) - offsetX / 2;//x最小值

    const yValueMax = Math.max.apply(null, yValue) + offsetY / 2;//y最大值
    const yValueMin = Math.min.apply(null, yValue) - offsetY / 2;//y最小值


    this.kpiCondition = x.name + '[' + xValueMin + '-' + xValueMax + ']，'
      + y.name + '[' + yValueMin + '-' + yValueMax + ']';
    this.xHead = this.buildHead(xValueMax, xValueMin, 'x');
    this.yHead = this.buildHead(yValueMax, yValueMin, 'y');
    let data = {};
    this.detail.forEach(s => {
      const xValue = (s[this.x.title] - this.offset[this.x.title] / 2) + '~' + (s[this.x.title] + this.offset[this.x.title] / 2);
      const yValue = (s[this.y.title] - this.offset[this.y.title] / 2) + '~' + (s[this.y.title] + this.offset[this.y.title] / 2);

      if (!data[yValue]) data[yValue] = [];
      const obj = {skuUnit: s.skuUnit};
      obj[this.x.title] = xValue;
      data[yValue].push(obj)
    });

    this.list = this.yHead.map(s => {
      let t = {name: s.name};
      this.xHead.forEach(a => {
        if (data[s.name]) {
          data[s.name].forEach(d => {
            if (d[this.x.title] == a.name) t[a.name] = d.skuUnit;

            return;
          });
        }

      });
      return t;
    });

    //列总计
    let total = 0;
    this.list.forEach((l, i) => {
      this.list[i].total = 0;
      this.xHead.forEach(h => {
        this.list[i].total += l[h.name] ? l[h.name] : 0;
      })
    });

    //行总计
    let rowTotal = {name: '总计', total: 0};
    this.xHead.forEach((x, i) => {
      let total = 0;

      this.list.forEach(l => {
        total += l[x.name] ? l[x.name] : 0;
        if (i == 0) rowTotal.total += l.total;
      });
      rowTotal[x.name] = this.figure.thousand(total, 0);
    });
    rowTotal.total = this.figure.thousand(rowTotal.total, 0);
    this.list.push(rowTotal)
    //表格中sku加上千分符
    this.list.forEach((i, index) => {
      _.forIn(i, (value, key) => {
        if (_.isNumber(value)) {
          this.list[index][key] = this.figure.thousand(value, 0)
        }
      })
    });
  }

  /**
   * echart 右上角返回
   */
  back() {
    //kpi选择时不对矩形、缩放  历史选择进行存储
    if (this.changeKpi == true) {
      return
    }
    this.showTable = false;
    let effectCrossABC = this.basic.getSession('effectCrossABC');
    if (effectCrossABC.length > 1) {
      //返回时不保存session
      this.getData(effectCrossABC[effectCrossABC.length - 2], false, true);

      //移除最后一项
      effectCrossABC.pop();
      this.basic.setSession('effectCrossABC', effectCrossABC);

    }
  }

  /**
   * 合计
   */
  setSum(summary) {
    if (this.detail.length == 0) return;
    this.sum = [
      {name: '有售sku数', total: summary.skuUnit, hoverData: '', count: true},
      {name: '销售额', total: summary.saleAmount, sale: true, hoverData: ''},
      {name: '销售数', total: summary.saleUnit, hoverData: ''},
      {name: '财务毛利额', total: summary.profit, sale: true, hoverData: ''},
      {name: '日均库存成本', total: summary.stockCostAvg, sale: true, hoverData: ''},
      {name: '经销周转天数', total: summary.stockTurnover, hoverData: ''}
    ];

    this.sum = this.sum.map(s => {
      let d, h;
      let total = s.total;
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
          h = d = this.figure.thousand(total, 2);
        }
      }

      return {
        name: s.name,
        total: d.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,'),
        hoverData: h
      }
    })
  }

  /**
   * 携带条件跳转至结构分析
   */
  goUrl(abcType) {

    if (this.detail.length == 0) return;
    //如果查询参数改变，跳转参数以查询过的参数为准；
    if (this.copycom) {
      this.activeYear = angular.copy(this.copyactiveYear);
      this.activeMonth = angular.copy(this.copyactiveMonth);
      this.com = angular.copy(this.copycom);
      this.activeShotcut = angular.copy(this.copyactiveShotcut);
      this.abcType = angular.copy(this.copyabcType);
      this.activeAvg = angular.copy(this.copyactiveAvg);
      this.activeAll = angular.copy(this.copyactiveAll);
      this.activeAllOperations = angular.copy(this.copyactiveAllOperations);
      this.activeAvgOperations = angular.copy(this.copyactiveAvgOperations);
      this.activeOperationGroup = angular.copy(this.copyactiveOperationGroup);
    } else {
      this.copycom = angular.copy(this.com)
    }

    // activeYear
    // activeMonth
    //com
    // activeShotcut
    // abcType
    //activeAvg
    //activeAll
    //activeAllOperations
    //activeAvgOperations
    // activeOperationGroup

    let minX = Number(_.split(this.list[0].name, '~', 2)[0])
    let maxX = Number(_.split(this.list[this.list.length - 2].name, '~', 2)[1]);
    let maxY = Number(_.split(this.xHead[this.xHead.length - 1].name, '~', 2)[1]);
    let minY = Number(_.split(this.xHead[0].name, '~', 2)[0]);

    let starX = 0;
    let endX = 0;
    let starY = 0;
    let endY = 0;
    const y = this.selectX[parseInt(this.activeX)];
    const x = this.selectY[parseInt(this.activeY)];
    const params = this.basic.getSession('efficiencyCrossParam');
    params.com = this.copycom;
    if (params) {
      if (abcType == 2 || abcType == 0) {
        //点击结构分析带的条件
        params.kpiCondition = this.kpiCondition;
        params.condition.precondition[x.title].lower = minX;
        params.condition.precondition[x.title].upper = maxX;
        params.condition.precondition[y.title].lower = minY;
        params.condition.precondition[y.title].upper = maxY;
      } else if (abcType.M != '总计' && abcType.P != '总计' && abcType != 0 && abcType.P != 1) {
        //点击不是总计的表格 带的条件
        starX = _.split(abcType.M, '~', 2)[0];
        endX = _.split(abcType.M, '~', 2)[1];
        starY = _.split(abcType.P, '~', 2)[0];
        endY = _.split(abcType.P, '~', 2)[1];
        //kpi部分
        params.kpiCondition = `${x.name}[${starX}~${endX}]，${y.name}[${starY}~${endY}]`;
        params.condition.precondition[x.title].lower = starX;
        params.condition.precondition[x.title].upper = endX;
        params.condition.precondition[y.title].lower = starY;
        params.condition.precondition[y.title].upper = endY;
      } else if (abcType.M == '总计' && abcType.P != '总计') {
        //点击门店数是总计，平均单品库存不是总计的表格 带的条件
        starY = _.split(abcType.P, '~', 2)[0];
        endY = _.split(abcType.P, '~', 2)[1];
        starX = parseInt(minX);
        endX = parseInt(maxX);
        params.kpiCondition = `${x.name}[${starX}~${endX}]，${y.name}[${starY}~${endY}]`;

        params.condition.precondition[x.title].lower = starX;
        params.condition.precondition[x.title].upper = endX;
        params.condition.precondition[y.title].lower = starY;
        params.condition.precondition[y.title].upper = endY;
      } else if (abcType.P == 1) {
        //点击门店数不是总计，平均单品库存是总计的表格 带的条件
        starX = _.split(abcType.M, '~', 2)[0];
        endX = _.split(abcType.M, '~', 2)[1];

        starY = minY;
        endY = maxY;
        params.kpiCondition = `${x.name}[${starX}~${endX}]，${y.name}[${starY}~${endY}]`;
        params.condition.precondition[x.title].lower = starX;
        params.condition.precondition[x.title].upper = endX;
        params.condition.precondition[y.title].lower = starY;
        params.condition.precondition[y.title].upper = endY;
      }
      params.condition.precondition.abc = params.condition.precondition.abc.filter(i => i.tags.length > 0);
      params.com.total = this.typeActive;
      this.abcService.setLocalGoStructure(params);
    }
    let url = window.document.location.href;
    url = url.replace("efficiencyCross", "structure");
    window.open(url);
  }

  /**
   * 根据年份设置月份下拉内容
   */
  setMonth(data) {
    this.years = this.tool.buildYearSelect(data.year - 1, data.year);
    this.activeYear = data.year;
    const nowMonth = data.monthValue; //month
    // const nowMonth = Number(moment().format('MM')); //month
    if (this.activeYear === data.year) {
      this.months = this.abcService.buildMonthSelect(data.year, nowMonth);
    } else {
      this.months = this.abcService.buildMonthSelect(data.year);
    }
    this.activeMonth = _.last(this.months).id;
  }

  /**
   * KPI select变化时
   * @param type： X、Y
   */
  selectChange(type) {
    if (this.activeX == this.activeY) {
      this['active' + type] = this['active' + type] > 1
        ? this['active' + type] - 1
        : this['active' + type] + 1
    }
  }

  /**
   * 获取 popup
   */
  openOperation() {
    const promise = this.popupData.openOperation({selected: this.com.operation.val});

    this.tool.dealModal(promise, res => {
      this.com.operation.val = res ? res : [];
    });
  }

  openNewProduct() {
    const promise = this.popupData.openNewProduct({selected: this.com.product.val, years: this.model_date});
    this.tool.dealModal(promise, res => {
      this.com.product.val = res ? res : [];
    });
  }

  //门店 单选
  openStoreList() {
    const promise = this.popupData.openStore({selected: this.com.store.val, multi: false});

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
}

angular.module("hs.classesAnalyze.sub").controller("efficiencyCrossABCCtrl", EfficiencyCrossABCController);
