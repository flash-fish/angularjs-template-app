class activityAnalyzeController {
  constructor(CommonCon, toolService, popups, popupDataService, Pop,
              Common, Table, Chart, basicService, $scope, $stateParams,
              $rootScope, dataService, indexCompleteService, Symbols) {
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
    this.symbols = Symbols;
    this.dataService = dataService;
    this.popupData = popupDataService;
    this.indexCompleteService = indexCompleteService;

    // popup 弹窗显示
    this.tabs = angular.copy(this.commonCon.saleStockTabs);
    this.types = angular.copy(this.commonCon.types);

    // 日期控件配置 时间 1
    this.dateOptionOne = {
      onlyShowCustom: "day",
      defineID: "actDate",
      defineWarnInfo: 'WarnOne',
      actWarn: true,
      ranges: [90, 12],
      warnDefine: '，请您重新选择日期。',
    };
    // 时间2
    this.dateOptionTwo = {
      onlyShowCustom: "day",
      defineID: "compareDate",
      defineWarnInfo: 'WarnTwo',
      actWarn: true,
      ranges: [90, 12],
      warnDefine: '，请您重新选择日期。',
    };

    // 保存共通条件的地方
    this.com = Object.assign(
      {date: "", comparableStores: false}, angular.copy(this.commonCon.commonPro)
    );

    // 额外条件存储
    this.com.other = {};

    // 表格 CHART localStorage 存储字段名
    this.localTabel = this.commonCon.local.TABLE_ORIGIN_ACTIVITY_ANALYZE;
    this.localChart = this.commonCon.local.CHART_ORIGIN_ACTIVITY_ANALYZE;

    /*
     * 当前页面需要的指标结构
     *@from Table->newProductAnalyze_TABLE
     * */
    this.currFileds = angular.copy(this.Table.ActivityOptions);
    this.currCharts = angular.copy(this.Chart.ActivitySetting);

    /*公共指标 @param this.field*/
    this.field = {};

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};


    // 定义参数 this.key 初始化
    // catGroupUrl 品类组 | categoryUrl类别 | saleBrand品牌
    // | saleStore门店 | itemProduct商品 | Supplier供应商
    // allBusinessProfitRate 毛利率 | flowCntProportion 客流渗透率
    this.key = {
      active: 1,
      haveStock: true, // 图表第二个是否显示
      pageId: CommonCon.page.page_activity,
      noEvent: true,
      haveSaleWayPct: true,
      actCompare: true, // 是否是活动分析
      paramShow: true,
      fetchChart: this.localChart,
      catGroupUrl: [
        'getSalesAndInventoryDataByClassHoliday',
        'getSalesAndInventoryDataByClassTreeHoliday'
      ],
      categoryUrl: [
        'getSalesAndInventoryDataByCategoryHoliday',
        'getSalesAndInventoryDataByCategoryTreeHoliday'
      ],
      saleBrand: [
        'getSalesAndInventoryDataByBrandHoliday'
      ],
      saleStore: [
        'getSalesAndInventoryDataByStoreHoliday',
        'getSalesAndInventoryDataByOperationHoliday',
        'getSalesAndInventoryDataByDistrictHoliday'
      ],
      itemProduct: [
        'getSalesAndInventoryDataByProductHoliday'
      ],
      Supplier: [
        'getSalesAndInventoryDataBySupplierHoliday'
      ],
      tableIndex: [
        'allProfitRate',
        'distributionProfitRate',
        'jointProfitRate',
        'retailProfitRate',
        'wholeProfitRate',
        'saleDays',
        'buyoutSaleDays'
        // 'flowCntProportion',
      ],
      chartInfo: [
        '毛利率', '客单数',
        '零售客单价', '客流渗透率',
        '经销-毛利率', '联营-毛利率',
        '零售-毛利率', '零售-客单数',
        '批发-毛利率', '经销周转天数'
      ],
      show:true
    };

    // 默认选择常用节假日
    this.com.other.endDaY = 'usualDay';

    this.sort = {
      date: 1,
      dateY: 2,
      comparableStores: 3,
      classes: 4,
      category: 5,
      operation: 6,
      brand: 10,
      product: 11,
      supplier: 12,
      district: 7,
      storeGroup: 8,
      store: 9,
    }
  }

  init() {
    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 监听订阅的事件
    this.tool.onEvent(this, this.key);

    // 点击chart 中 date的面包屑触发
    this.scope.$on(this.commonCon.dateChange, (e, d, y) => {
      this.com.date = d;
      this.commonParam.date = d;
      this.commonParam.other.endDaY = 'defineDay';
      this.com.other.endDaY = 'defineDay';
      if (this.commonParam.dateY) {
        this.com.dateY = y;
        this.commonParam.dateY = y;
        this.dateM = moment(y.from, this.symbols.normalDate).format(this.symbols.slashDate)
          + this.symbols.bar
          + moment(y.to, this.symbols.normalDate).format(this.symbols.slashDate);
      }

      this.showCondition();
      this.commonParam = Object.assign({}, this.commonParam);
    });

    // 时间监听
    this.watchDate();

    // 假日切换监听
    this.changeMode();

  }


  initialize(data) {
    this.root.fullLoadingShow = true;

    this.inited = true;
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 获取二级菜单共享的条件session
    this.tool.getTopCondition(this.com);

    this.com.date = "";

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 初始化指标 如果session里有值 优先取session的
    this.initField();

    // 初始化日期范围  -- 对比日期 dateY
    this.indexCompleteService.anaInit(this, () => {
      // 常用节假日 - 对比节假日 默认勾选
      this.usual_Box = true; this.com.other.com_check = true;
      this.com.dateY = this.indexCompleteService.transDateY(this.dateM);
      this.commonParam = angular.copy(this.com);

      this.showCondition();
    });

    this.basic.packager(this.dataService.getBaseDate(), res => {
      this.key.baseDate = res.data.baseDate;
      this.baseDate = res.data.baseDate;
      this.baseDateArray = this.getEveryWeek(this.baseDate + '');
      this.baseDateArray.reverse();
      this.year = String(moment(this.baseDate, 'YYYYMMDD').format('YYYY'));
      let lastYear = parseInt(this.year) - 1;
      this.lastDateArray = this.getEveryWeek(lastYear + '1231');
      this.com.other.weekDay = `${this.baseDateArray[0].date}`;
    });

  }

  showCondition(){
    let com = angular.copy(this.commonParam);
    if (this.com.other.com_check) com.dateY = angular.copy(this.dateM);
    const other = {dateY: {name: '对比日期', type: 1}, date: {name: '活动日期', type: 1}};
    this.sortCom = this.tool.dealSortData(com, this.sort, other);
  }

  // 周环比
  // 获取当前选中周去年的日期
  getYearWeek(dateString) {
    let da = dateString;
    let date1 = new Date(parseInt(da.substring(0, 4)) - 1, parseInt(da.substring(4, 6)) - 1, da.substring(6, 8));
    let date2 = new Date(parseInt(da.substring(0, 4)) - 1, 0, 1);
    let dateWeekNum = date2.getDay() - 1;
    if (dateWeekNum < 0) {
      dateWeekNum = 6;
    }
    if (dateWeekNum < 4) {
      date2.setDate(date2.getDate() - dateWeekNum);
    } else {
      date2.setDate(date2.getDate() + 7 - dateWeekNum);
    }
    let d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);

    // 计算周开始和结束日期
    let monday = angular.copy(date1);
    let mondayNum = monday.getDay() - 1;
    if (mondayNum < 0) {
      mondayNum = 6;
    }
    monday.setDate(monday.getDate() - mondayNum);
    let mon = this.formatterDate(monday);
    monday.setDate(monday.getDate() + 6);
    let sun = this.formatterDate(monday);

    let year = date1.getFullYear();
    if (date2.getDate() === 1) {
      //得到年数周数
      let week = Math.ceil((d + 1) / 7);
      // return year+"年第"+week+"周" + ' ' + mon + '-' + sun;
      return mon + '-' + sun;
    } else {
      if (d < 0) {
        //得到年数周数
        // return year+"年第"+'1'+"周" + ' ' + mon + '-' + sun;
        return mon + '-' + sun;
      } else {
        //得到年数周数
        let week = Math.ceil((d + 1) / 7) + 1;
        // return year+"年第"+week+"周" + ' ' + mon + '-' + sun;
        return mon + '-' + sun;
      }
    }
  }

  // 对比周
  getCompareWeek(dateStart, dateEnd) {

    // 取今年1月1号和12月31号和参数日期对比，如果dateStart比1月1号早那就取去年数组的第一个，如果dateEnd比12月31号还要晚就取去年数组的最后一个
    let start = new Date(dateStart.substring(0, 4), parseInt(dateStart.substring(4, 6)) - 1, dateStart.substring(6, 8));
    let end = new Date(dateEnd.substring(0, 4), parseInt(dateEnd.substring(4, 6)) - 1, dateEnd.substring(6, 8));
    let yearStart = new Date(this.year, 0, 1);
    let yearEnd = new Date(this.year, 11, 31);

    if (start.valueOf() <= yearStart.valueOf()) {
      this.dateM = this.lastDateArray[0].date;
      return;
    }

    if (end.valueOf() >= yearEnd.valueOf()) {
      this.dateM = this.lastDateArray[this.lastDateArray.length - 1].date;
      return;
    }

    // 不满足上边的直接去计算
    let da = dateStart;
    let date1 = new Date(da.substring(0, 4) - 1, parseInt(da.substring(4, 6)) - 1, da.substring(6, 8));
    let dateWeekNum = date1.getDay() - 1;
    if (dateWeekNum < 0) {
      dateWeekNum = 6;
    }
    if (dateWeekNum < 4) {
      this.dateM = this.getYearWeek(dateStart);
    } else {
      this.dateM = this.getYearWeek(dateEnd);
    }
    this.com.dateY = this.indexCompleteService.transDateY(this.dateM);
  }

  // 日期转化
  dateChange(dateString) {
    // let array = dateString.split(' ');
    let array1 = dateString.split('-');
    this.getCompareWeek(moment(array1[0], 'YYYY/MM/DD').format('YYYYMMDD'), moment(array1[1], 'YYYY/MM/DD').format('YYYYMMDD'));
    this.weekTime();
  }


  // 获取周列表
  getEveryWeek(dateString) {
    let da = dateString;
    let date1 = new Date(da.substring(0, 4), parseInt(da.substring(4, 6)) - 1, da.substring(6, 8));
    let date2 = new Date(da.substring(0, 4), 0, 1);
    let dateWeekNum = date2.getDay() - 1;
    if (dateWeekNum < 0) {
      dateWeekNum = 6;
    }

    // 去年的最后一个周日
    date2.setDate(date2.getDate() - dateWeekNum - 1);
    let weekArray = [];

    let year = date1.getFullYear();
    let i = 1;
    while (date1.valueOf() > date2.valueOf()) {
      date2.setDate(date2.getDate() + 1);
      let monday = this.formatterDate(date2);

      date2.setDate(date2.getDate() + 6);

      let sunday = this.formatterDate(date2);
      weekArray.push({id: "第" + i + '周 ', date: monday + '-' + sunday});
      i++;
    }
    return weekArray;
  }

  // 日期转化
  formatterDate(date) {
    return date.getFullYear() + '/' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0'
        + (date.getMonth() + 1)) + '/' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
  }


  /**
   * 节假日选择监听
   * @constructor
   */
  WatchHoliday() {
    this.defineTime();
  }

  // 切换常用节假日与自定义日期 假日日期初始化
  changeMode() {
    this.scope.$watch('ctrl.com.other.endDaY', (nval, oval) => {
      if (!nval
        || _.isEqual(nval, oval)) return;
      if (nval === 'weekDay') {
        this.dateChange(this.com.other.weekDay);
        this.weekTime();
      } else if (nval === 'usualDay') {
        this.defineTime();
      }
    })
  }

  /**
   * tab切换时候的逻辑
   */
  select(event) {
    this.indexCompleteService.tabsWatch(this, event);
  }

  // 日期监听
  watchDate() {
    // 日期范围判断
    this.scope.$watch('ctrl.com.date', v => {
      if(!v) return;
      let [_one,_two] = [
        this.indexCompleteService.calDays(v), this.indexCompleteService.calDays(this.dateM)
      ];
      this.showWarn = !_.isEqual(_one,_two);
    });
    // 监听日期 2
    this.scope.$watch('ctrl.dateM', b => {
      if(!b) return;
      let [_mid_one,_mid_two] = [
        this.indexCompleteService.calDays(b), this.indexCompleteService.calDays(this.com.date)
      ];
      this.showWarn = !_.isEqual(_mid_one,_mid_two);
    });
  }




  /**
   *  年份改变请求接口
   */
  ChangeYear() {
    let mow_year = this.allVintage.filter(s => s.id === parseInt(this.com.other.vintage))[0].year;
    let now_Pram = {condition: {"year": mow_year}};

    // 当前年份
    this.basic.packager(this.dataService.getHolidayMaintainByYear(now_Pram), res => {
      this.allHoliday = angular.copy(res.data);
      if (this.allHoliday.length === 0) return;
      this.com.other.holiday = `${this.allHoliday[0].holidayId}`;


      this.defineTime();

    });

  }


  defineTime() {
    // 勾选日期下拉监听 把当前下拉的日期赋值给 input 框
    let ResDue = this.allHoliday.filter(s => s.holidayId === parseInt(this.com.other.holiday))[0];
    // 日期 1 与对比日期初始化赋值
    this.com.date = this.indexCompleteService.form_Time(ResDue, 'one');
    this.dateM = this.indexCompleteService.form_Time(ResDue, 'two');
    this.com.dateY = this.indexCompleteService.transDateY(this.dateM);

    this.dateOptionOne.date = this.com.date;
    this.dateOptionTwo.date = this.dateM;
  }

  weekTime() {
    this.com.date = this.com.other.weekDay;
    this.dateOptionOne.date = this.com.date;
    this.dateOptionTwo.date = this.dateM;
  }

  /**
   * 初始化指标
   */
  initField() {
    /*初始化表格指标*/
    const table = this.basic.getLocal(this.localTabel);
    const fields = table ? this.tool.getFieldFromLocal(table, this.currFileds) : this.currFileds;
    this.field.table = angular.copy(fields);

    /*初始化图表指标*/
    const chart = this.basic.getLocal(this.localChart);
    if (chart) {
      this.field.chart = chart;
    } else {
      const newChart = angular.copy(this.currCharts);
      const fieldSale = this.tool.calculateChartField(newChart.sale, 'all');
      const fieldStock = this.tool.calculateChartField(newChart.stock);
      this.field.chart = {first: fieldSale, second: fieldStock};
    }
  }

  // 数据设定
  getTableOption() {
    const promise = this.popups.popupSaleStockTable({
      field: this.currFileds,
      local: this.localTabel,
      noShowSetting: true,
    });

    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.field = Object.assign({}, this.field);
    });

  };

  // 图表设定
  getChartOption() {
    const promise = this.popups.popupActivityAnalyzeChart({
      local: {
        origin: this.commonCon.local.CHART_SELECT_ACTIVITY_ANALYZE,
        data: this.localChart
      }
    });

    this.tool.dealModal(promise, res => {
      // 参数有否对比参数处理
      this.field.chart = this.indexCompleteService.DateCheck(this.commonParam, res);
      this.field = Object.assign({}, this.field);
    });
  }

  // checkBox 自定义日期点击
  UsualClick() {
    // 对比日期是否勾选判断
    if(!this.com.other.com_check && this.usual_Box) this.com.other.com_check = true;
  }

  /*@ param search*/
  search() {
    // 搜索重构日期
    const nowHoliday = this.allHoliday.filter(
      s => s.holidayId === parseInt(this.com.other.holiday))[0];
    this.com.other.MarkDay = this.indexCompleteService.time_link(nowHoliday.holidayDate);
    // 搜索时重计算对比日期 2
    this.com.dateY = this.indexCompleteService.transDateY(this.dateM);

    let mid_com = angular.copy(this.com);

    // 判断对比日期是否生效
    if(!this.com.other.com_check) delete mid_com.dateY;

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(mid_com, this.accessCom, this.job);

    this.tool.commonSetTop(this.com, ["date", "dateY"]);

    this.commonParam = this.indexCompleteService.commonSearch(this, mid_com);
    this.key.show = !(this.showWarn && this.com.other.com_check);

    this.showCondition();
  }


  // 门店
  openStoreList() {
    const promise = this.popupData.openStore({selected: this.com.store.val});

    this.tool.dealModal(promise, res => {
      this.com.store.val = res ? res : [];
    });
  }

  // 类别
  openCat() {
    const promise = this.popupData.openCategory({selected: this.com.category.val});

    this.tool.dealModal(promise, res => {
      this.com.category.val = res ? res : [];
    });
  }

  // 品类组
  openClasses() {
    const promise = this.popupData.openClass({selected: this.com.classes.val});

    this.tool.dealModal(promise, res => {
      this.com.classes.val = res ? res : [];
    });
  }

  // 地区
  openDistrict() {
    const promise = this.popupData.openDistrict({selected: this.com.district.val});

    this.tool.dealModal(promise, res => {
      this.com.district.val = res ? res : [];
    });
  }

  // 业态
  openOperation() {
    const promise = this.popupData.openOperation({selected: this.com.operation.val});

    this.tool.dealModal(promise, res => {
      this.com.operation.val = res ? res : [];
    });
  }

  // 商品
  openItem() {
    const promise = this.popupData.openItem({selected: this.com.product.val});

    this.tool.dealModal(promise, res => {
      this.com.product.val = res ? res : [];

      // 监听商品条件选择
      this.tool.watchProduct(this);

    });
  }

  // 品牌
  openBrand() {
    const promise = this.popupData.openBrand({selected: this.com.brand.val});

    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  // 店群
  openStoreGroup() {
    const promise = this.popupData.openStoreGroup({selected: this.com.storeGroup.val});

    this.tool.dealModal(promise, res => {
      this.com.storeGroup.val = res ? res : [];
    });
  }

  // 供应商
  openSupplier() {
    const promise = this.popupData.openSupplier({selected: this.com.supplier.val});

    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
    });
  }


}


angular.module("hs.synthesizeAnalyze").controller("activityAnalyzeCtrl", activityAnalyzeController);

