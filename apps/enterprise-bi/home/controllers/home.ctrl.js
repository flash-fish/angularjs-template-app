class HomeController {
  constructor($scope, $compile, FigureService, CommonCon, tableService, toolService,
              popups, dataService, $rootScope, $sce, basicService, $state, popupDataService,
              $stateParams, Common, Field, $templateCache, account, Version) {
    this.$sce = $sce;
    this.scope = $scope;
    this.popups = popups;
    this.$state = $state;
    this.common = Common;
    this.root = $rootScope;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.stateParams = $stateParams;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.popupData = popupDataService;
    this.account = account;
    this.Version = Version;

    // 所有指标的对照关系
    this.fieldInfo = this.basic.buildField(Field.sale);

    // 搜索
    this.keys = {
      finish: true,
    };

    // 饼图事件
    this.chartEvent = {name: 'legendselectchanged', func: (param) => this.addEvent(param, 'saleCharts')};
    this.typeChartEvent = {name: 'legendselectchanged', func: (param) => this.addEvent(param, 'typeCharts')};
    this.areaChartEvent = {name: 'legendselectchanged', func: (param) => this.addEvent(param, 'areaCharts')};

    this.chartLoadOne = 1;
    this.chartLoadTwo = 1;
    this.chartLoadThree = 1;
    this.chartLoadFour = 1;
    this.chartLoadFive = 1;
    this.chartLoadSix = 1;

    // 保存共通条件的地方
    this.com = Object.assign({date: ""}, CommonCon.commonPro);

    // 权限和信息选择
    this.showInfor = false;
    this.showPower = false;
    this.clickArea = true;
    this.inforArray = [];

    // 头部天气
    this.dateArray = [
      {title: '基准日:', date: '-', weatherTitle: '杭州天气:', weather: '-'},
      {title: '公历同比日:', date: '-', weatherTitle: '杭州天气:', weather: '-'},
      {title: '农历同比日:', date: '-', weatherTitle: '杭州天气:', weather: '-'}
    ];

    // 权限
    this.power = [
      {name: '门店', data: []},
      {name: '品类组', data: [], primary:true},
      {name: '类别', data: []},
      {name: '业态', data: []},
      {name: '地区', data: []},
      {name: '品牌', data: []},
      {name: '商品', data: []},
      {name: '供应商', data: []},
      {name: '店群', data: []},
    ];

    // 各个选择框
    this.dateType = [
      {id: 'day', name: '1天', active: true},
      {id: 'month', name: '月至今', active: false},
      {id: 'year', name: '年至今', active: false}
    ];

    this.jobType = [
      {id: 'buyer', name: '采购', active: true},
      {id: 'store', name: '营运', active: false},
    ];

    this.lastYearMarketing = [
      {id: "lastT", name: '去年同期', active: true},
      {id: "lastAll", name: '去年全年', active: false}
    ];

    this.saleTypeMarketing = [
      {id: "first", name: '经销/联营', active: true},
      {id: "second", name: '零售/批发', active: false},
      {id: "third", name: '全部', active: false},
    ];

  }

  start() {

    // 选择大框
    this.selectUp = true;
    this.selectNum = 0;

    // 各个选择框还原
    this.last_name = this.lastYearMarketing[0].id;
    this.dateMode = this.dateType[0].id;
    this.jobMode = this.jobType[0].id;
    this.saleTypeMode = this.saleTypeMarketing[0].id;

    // 柱状图默认
    this.chartField = ['retailAmount'];
    this.loadChart = [];

    // 默认不展示下面视图
    // this.show = false;

    // 核心指标下面
    this.coreDownArray = [
      {
        title: "毛利额",
        bigNumber: '-',
        bigNumberR: '-',
        lastDay: '-',
        yoy: '-',
        oldYoY: '-',
        underTitle: "毛利率",
        data: '-',
        select: false,
        num: 1,
        lastDayR: '',
        yoyR: '',
        oldYoYR: '',
        name: 'allProfit',
        subName: 'allProfitRate',
      },
      {
        title: "综合收益额",
        bigNumber: '-',
        bigNumberR: '-',
        lastDay: '-',
        yoy: '-',
        oldYoY: '-',
        underTitle: "综合收益率",
        data: '-',
        select: false,
        num: 2,
        lastDayR: '',
        yoyR: '',
        oldYoYR: '',
        name: 'allBizCompIncomeAmount',
        subName: 'allBizCompIncomeAmountRate'


      },
      {
        title: "日均库存金额",
        bigNumber: '-',
        bigNumberR: '-',
        lastDay: '-',
        yoy: '-',
        oldYoY: '-',
        underTitle: "经销周转天数",
        data: '-',
        select: false,
        num: 3,
        lastDayR: '',
        yoyR: '',
        oldYoYR: '',
        name: 'stockCost',
        subName: 'saleDays'
      }
    ];

    // 核心指标上面
    this.coreUpArray = [
      {
        title: "零售额",
        bigNumber: '-',
        bigNumberR: '-',
        lastDay: '-',
        yoy: '-',
        oldYoY: '-',
        disable: true,
        select: true,
        num: 0,
        lastDayR: '',
        yoyR: '',
        oldYoYR: '',
        name: 'retailAmount'
      },
      {
        title: "客单数",
        bigNumber: '-',
        lastDay: '-',
        yoy: '-',
        oldYoY: '-',
        disable: false,
        select: false,
        num: 1,
        lastDayR: '',
        yoyR: '',
        oldYoYR: '',
        name: 'flowCnt'
      },
      {
        title: "零售客单价",
        bigNumber: '-',
        lastDay: '-',
        yoy: '-',
        oldYoY: '-',
        disable: false,
        select: false,
        num: 2,
        lastDayR: '',
        yoyR: '',
        oldYoYR: '',
        name: 'retailFlowAmount'
      }
    ];

    // 判断核心指标传参数
    if (this.job === 'store') {
      this.indexCompleteMenu = 'app.synthesizeAnalyze.operations';
      this.coreDownArray[1].title = '综合收益额(营运)';
      this.coreDownArray[1].underTitle = "综合收益率(营运)";
      this.powerFieldDay = ["storeBizCompIncomeAmount", "storeBizCompIncomeAmountToT", "storeBizCompIncomeAmountYoY", "storeBizCompIncomeAmountRate"];
      this.powerFieldLau = ["storeBizCompIncomeAmountYoY"];
      this.powerFieldYear = ["storeBizCompIncomeAmount", "storeBizCompIncomeAmountYoY", "storeBizCompIncomeAmountRate"];
      this.coreDownArray[1].name = "storeBizCompIncomeAmount";
      this.coreDownArray[1].subName = "storeBizCompIncomeAmountRate";


    } else if (this.job === 'buyer') {
      this.indexCompleteMenu = 'app.synthesizeAnalyze.purchase';
      this.coreDownArray[1].title = '综合收益额(采购)';
      this.coreDownArray[1].underTitle = "综合收益率(采购)";
      this.powerFieldDay = ["buyerBizCompIncomeAmount", "buyerBizCompIncomeAmountToT", "buyerBizCompIncomeAmountYoY", "buyerBizCompIncomeAmountRate"];
      this.powerFieldLau = ["buyerBizCompIncomeAmountYoY"];
      this.powerFieldYear = ["buyerBizCompIncomeAmount", "buyerBizCompIncomeAmountYoY", "buyerBizCompIncomeAmountRate"];
      this.coreDownArray[1].name = "buyerBizCompIncomeAmount";
      this.coreDownArray[1].subName = "buyerBizCompIncomeAmountRate";
    } else {
      this.indexCompleteMenu = 'app.synthesizeAnalyze.purchase';
      this.powerFieldDay = ['allBizCompIncomeAmount', 'allBizCompIncomeAmountToT', 'allBizCompIncomeAmountYoY', 'allBizCompIncomeAmountRate'];
      this.powerFieldLau = ['allBizCompIncomeAmountYoY'];
      this.powerFieldYear = ['allBizCompIncomeAmount', 'allBizCompIncomeAmountYoY', 'allBizCompIncomeAmountRate'];

    }

    // 指标达成数组初始化
    this.compareArray = [];
    this.compareArrayLastYear = [];
    this.compareArrayAll = [];

    this.indexArray = [];

    if (this.storeSearch) {
      this.indexCompleteMenu = 'app.synthesizeAnalyze.operations';
    }
  }


  init() {
    if (this.basic.getSession('changeRole', true))
      this.tool.getMenu(this, (d) => this.initialize(d));
    else
    // 获取用户权限后初始化页面
      this.tool.getAccess((d) => this.initialize(d));

    //原先这几个label用一个来控制eChart的显示(unitLabel profitLabel amountLabel) => label
    this.label = false;

    this.basic.packager(this.dataService.getPopupInfo(), res => {
      if (!res.data) return;
      this.popupInfo = res.data;
      const openMessage = () =>{
        this.popupData.popupNewMessageNotice({versionInfo: this.popupInfo});
        const cookieValue = JSON.stringify({version: this.popupInfo.popupVersion});
        const nowDate = moment().format();
        document.cookie = `${this.common.popupInfoVersion}=${cookieValue};expires=${nowDate}`;
      };
      const cookies =  document.cookie;
      if (!cookies.length) {
        openMessage();
        return;
      }
      const cookieArr = cookies.split(";");
      const versionStr = cookieArr.find(c => c.includes(`${this.common.popupInfoVersion}`));
      if (!versionStr) {
        openMessage();
        return;
      }
      const version = JSON.parse(_.trim(versionStr.substring(versionStr.indexOf('=') + 1))).version;
      if (version < this.popupInfo.popupVersion) openMessage();
    });
  }


  initialize(data) {
    this.inited = true;
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);

    this.com = angular.copy(this.accessCom);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    const underline = '_';
    const localVersion = underline + this.job + underline +
      this.root.currentJob.id;
    if (!this.basic.getSession("firstLoginFinish", true)) {
      _.forIn(this.CommonCon.local, (value, key) => {
        this.Version.last.forEach(l => {
          localStorage.removeItem(value + l);
          localStorage.removeItem(value + underline + this.root.currentJob.id + l);
          localStorage.removeItem(value + localVersion + l);
        });
        // localStorage.removeItem(value + this.Version.last);
        // localStorage.removeItem(value + localVersion)
      });

      _.forIn(this.common.local, (val, key) => {
        // localStorage.removeItem(val + this.Version.last);
        this.Version.last.forEach(l => {
          localStorage.removeItem(val + l);
          localStorage.removeItem(val + underline + this.root.currentJob.id + l);
        });
        this.basic.removeLocal(val, false)
      });

      this.basic.setSession("firstLoginFinish", true);
    }

    this.user = this.account.uid;
    this.userJob = this.user.moduleJobs[5].currentJob.name;

    //初始化数据
    this.start();

    // 权限
    this.dataPower(data);
    this.getLatestSystemInfo();
    this.getDate();

    this.scope.$watch('ctrl.dateMode', (newVal, oldVal) => {
      if (!oldVal) return;
      if (newVal === oldVal) return;
      this.getCoreInfor(newVal);

      if (newVal === 'day' || newVal === 'month') {
        this.flowCntDate = this.startDate + '-' + this.baseDate;
        this.chartDate = this.chartMonth;
        this.loadChart = [this.chartField, this.chartDate];
        this.chartInfor(this.chartField, this.chartDate);
      } else {
        this.flowCntDate = "" + this.year + '01/01' + '-' + "" + this.baseDate;
        this.chartDate = this.chartYear;
        this.chartInfor(this.chartField, this.chartDate);
        this.loadChart = [this.chartField, this.chartDate];
      }
    });

    this.menu = this.basic.getSession(this.common.leftMenu);

    if (this.menu) {
      for (let i = 0; i < this.menu.length; i++) {
        let dic = this.menu[i];
        let array = dic.children;
        for (let j = 0; j < array.length; j++) {
          let child = array[j];
          if (child.resUrl === 'app.saleStockTop.saleStock') {
            this.saleStock = true;
          } else if (child.resUrl === 'app.newItemAnalyze.newItemInfo') {
            this.newItemInfo = true;
          } else if (child.resUrl === 'app.supAnalyse.supplierInfo') {
            this.supplierInfo = true;
          } else if (child.resUrl === this.indexCompleteMenu) {
            this.indexComplete = true;
          }
        }
      }
    } else {
      this.scope.$watch('ctrl.root.leftMenu', (newVal) => {

        if (!newVal) return;
        this.menu = newVal;
        for (let i = 0; i < this.menu.length; i++) {
          let dic = this.menu[i];
          let array = dic.children;
          for (let j = 0; j < array.length; j++) {
            let child = array[j];
            if (child.resUrl === 'app.saleStockTop.saleStock') {
              this.saleStock = true;
            } else if (child.resUrl === 'app.newItemAnalyze.newItemInfo') {
              this.newItemInfo = true;
            } else if (child.resUrl === 'app.supAnalyse.supplierInfo') {
              this.supplierInfo = true;
            } else if (child.resUrl === this.indexCompleteMenu) {
              this.indexComplete = true;
            }
          }
        }
      });
    }

    this.scope.$watch('ctrl.jobMode', (newVal, oldVal) => {
      if (!oldVal) return;
      if (newVal === oldVal) return;
      if (newVal === 'buyer') {
        this.indexCompleteMenu = 'app.synthesizeAnalyze.purchase';
      } else {
        this.indexCompleteMenu = 'app.synthesizeAnalyze.operations';
      }
      this.getIndexInfor(newVal);
    });

    this.basic.packager(this.dataService.getSeriousAbnormal(), res => {
      this.warningNotice = !res.data ? []
        : res.data.map(s => {
        return `${moment(s.dateCode, "YYYYMMDD").format("YYYY/MM/DD")} ${s.title}`;
      })
    });

    this.scope.$watch('ctrl.last_name', (newVal, oldVal) => {
      if (!oldVal) return;
      if (newVal === oldVal) return;
      this.chartLoadOne += 1;
      this.getPeriodNewProductCount(newVal);
    });

    // 销售方式
    this.scope.$watch('ctrl.saleTypeMode', (newVal, oldVal) => {
      if (!oldVal) return;
      if (newVal === oldVal) return;
      this.chartLoadTwo += 1;
      this.saleInfor(newVal);
    });

  }

  getDate() {
    this.basic.packager(this.dataService.getBaseDate(), res => {
      this.baseDate = res.data.baseDate;
      let mBaseDate = moment(this.baseDate + '', 'YYYYMMDD');
      this.day = String(mBaseDate.format('MM/DD'));
      this.year = String(mBaseDate.format('YYYY'));
      this.lastYear = parseInt(this.year) - 1;

      // 头部日期
      this.basic.packager(this.dataService.getDateInfoWithDate(this.baseDate), res => {
        let data = res.data;
        if (!data) return;
        this.dateArray[0].date = this.FigureService.isDefine(data.baseDate.date) + "   (" + this.FigureService.isDefine(data.baseDate.week) + ' ' + this.FigureService.isDefine(data.baseDate.lunar) + ")";
        this.dateArray[0].weather = this.FigureService.isDefine(data.baseDate.weatherInfo);

        this.dateArray[1].date = this.FigureService.isDefine(data.dateYoY.date) + "   (" + this.FigureService.isDefine(data.dateYoY.week) + ' ' + this.FigureService.isDefine(data.dateYoY.lunar) + ")";
        this.dateArray[1].weather = this.FigureService.isDefine(data.dateYoY.weatherInfo);

        this.dateArray[2].date = this.FigureService.isDefine(data.lunarYoY.date) + "   (" + this.FigureService.isDefine(data.lunarYoY.week) + ' ' + this.FigureService.isDefine(data.lunarYoY.lunar) + ")";
        this.dateArray[2].weather = this.FigureService.isDefine(data.lunarYoY.weatherInfo);
      });
      this.underRequest();
    });
  }

  underRequest() {
    this.basic.packager(this.dataService.getBaseMonth(), res => {
      this.monthStart = String(moment(res.data.startDate + '', 'YYYYMMDD').format('MM/DD'));
      this.monthEnd = String(moment(res.data.endDate + '', 'YYYYMMDD').format('MM/DD'));
      this.monthDate = res.data.startDate + '-' + res.data.endDate;
      // 接口需要的年至今日期格式
      this.startYear = moment(this.baseDate, 'YYYYMMDD').format('YYYY') + '/01' + '-' + moment(res.data.endDate, 'YYYYMMDD').format('YYYY/MM');
      this.saleArray = [
        {
          title: this.day + " 全天销售额",
          bigNumber: '-',
          yoy: '-',
          compareYoY: '-',
          yoyR: '',
          num: 0,
          compareYoYR: '',
          weeklyToT: '-',
          weeklyToTR: '',
          allAmountYoYValue: '-',
          allAmountYoYValueInc: '',
          allAmountYoYValueY: '-',
          allAmountYoYValueIncY: '',

        },
        {
          title: "月至今销售额 (" + this.monthStart + '-' + this.monthEnd + ')',
          bigNumber: '-',
          yoy: '-',
          compareYoY: '-',
          bigNumberR: '-',
          yoyR: '',
          num: 1,
          compareYoYR: '',
          allAmountYoYValue: '-',
          allAmountYoYValueInc: '',
          allAmountYoYValueY: '-',
          allAmountYoYValueIncY: '',
        },
        {
          title: "年至今销售额 (" + '01/01-' + this.day + ')',
          bigNumber: '-',
          yoy: '-',
          compareYoY: '-',
          bigNumberR: '-',
          yoyR: '',
          num: 2,
          compareYoYR: '',
          allAmountYoYValue: '-',
          allAmountYoYValueInc: '',
          allAmountYoYValueY: '-',
          allAmountYoYValueIncY: '',
        },
      ];
      this.yearToNow = ' (年至今01/01-' + this.day + ')';
      this.yearNow = '年至今(01/01-' + this.day + ')';

      this.basic.packager(this.dataService.getMonthByDate(this.baseDate), resp => {

        //接口所需要的按月查询的月份01-09
        this.com.date = this.year + '/01-' + moment(resp.data.businessMonth, 'YYYYMM').format('YYYY/MM');
        this.copyCom = angular.copy(this.com);
        this.month = moment(resp.data.businessMonth, 'YYYYMM').format('MM');
        this.getPeriodNewProductCountNow();

        // 获取销售概况
        this.getSaleInfor();

        // 核心指标
        this.getCoreInfor(this.dateMode);

        if (this.job === 'all') {
          // 在老板的权限下选择门店
          if (this.storeSearch) {
            this.getIndexInfor(this.jobType[1].id);
          }else {
            // 指标达成
            this.getIndexInfor(this.jobMode);
          }

        } else {
          this.getIndexInfor(this.job);
        }
        if (this.show) {
          this.getDownData();
        }
      });
      this.basic.packager(this.dataService.getFutureBusinessMonthDateRangeWithDate(this.baseDate), res => {
        // 图表
        this.startDate = res.data.startDate;
        this.chartMonth = res.data.startDate + '-' + res.data.endDate;
        this.chartYear = this.year + '01-' + this.year + '12';
        this.chartDate = this.chartMonth;
        this.flowCntDate = res.data.startDate + '-' + this.baseDate;
        this.chartInfor(this.chartField, this.chartDate);
        this.loadChart = [this.chartField, this.chartDate];
      });
    });
  }

  getDownData() {
    // 经销联营批发
    this.saleInfor('first');
    // 业态信息
    this.areaInfor();
    // 地区信息
    this.areaInforNew();
    // 新品概况
    this.newItemInfor();
    // 供应商概况
    this.supplierInfor();
    setTimeout(this.showUnder(), 500);
  }

  showUnder() {
    this.show = true;
  }

  // 获取销售概况
  getSaleInfor() {
    // 日
    let field = ['allAmount', 'allAmountYoY', 'allAmountYoYValue'];
    let com = angular.copy(this.com);
    com.date = this.baseDate + '-' + this.baseDate;
    com.comparableStores = false;
    let p = this.tool.buildParam(this.tool.getParam(com, field));
    p.pageId = this.CommonCon.page.page_home;
    this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {
      if (!res.data) return;
      this.saleArray[0].bigNumber = this.FigureService.number(res.data.allAmount, false, true);
      this.saleArray[0].bigNumberR = this.FigureService.number(res.data.allAmount, true, true);
      this.saleArray[0].yoy = this.FigureService.scale(res.data.allAmountYoY, true, true);
      this.saleArray[0].yoyR = res.data.allAmountYoY;
      this.saleArray[0].allAmountYoYValue = this.FigureService.number(res.data.allAmountYoYValue, true, true);
      this.saleArray[0].allAmountYoYValueY = this.FigureService.number(res.data.allAmountYoYValue, false, true);
      this.saleArray[0].allAmountYoYValueInc = (this.FigureService.isDefine(res.data.allAmount) !== '-' && this.FigureService.isDefine(res.data.allAmountYoYValue) !== '-') ? this.FigureService.number(res.data.allAmount - res.data.allAmountYoYValue, true, true) : '-';
      this.saleArray[0].allAmountYoYValueIncY = (this.FigureService.isDefine(res.data.allAmount) !== '-' && this.FigureService.isDefine(res.data.allAmountYoYValue) !== '-') ? this.FigureService.number(res.data.allAmount - res.data.allAmountYoYValue, false, true) : '-';

    });

    let weekField = ['allAmount', 'allAmountToT'];
    let weekCom = angular.copy(this.com);
    weekCom.date = this.baseDate + '-' + this.baseDate;
    weekCom.comparableStores = false;
    let weekP = this.tool.buildParam(this.tool.getParam(weekCom, weekField));
    weekP.condition.date.weeklyToT = true;
    weekP.pageId = this.CommonCon.page.page_home;

    this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(weekP), res => {
      if (!res.data) return;
      this.saleArray[0].weeklyToT = this.FigureService.scale(res.data.allAmountToT, true, true);
      this.saleArray[0].weeklyToTR = res.data.allAmountToT;

    });

    com.comparableStores = true;
    p = this.tool.buildParam(this.tool.getParam(com, field));
    p.pageId = this.CommonCon.page.page_home;
    this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {
      if (!res.data) return;
      this.saleArray[0].compareYoY = this.FigureService.scale(res.data.allAmountYoY, true, true);
      this.saleArray[0].compareYoYR = res.data.allAmountYoY;
    });

    // 月
    com.date = this.monthDate;
    com.comparableStores = false;
    p = this.tool.buildParam(this.tool.getParam(com, field));
    p.pageId = this.CommonCon.page.page_home;
    this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {
      if (!res.data) return;
      this.saleArray[1].bigNumber = this.FigureService.number(res.data.allAmount, false, true);
      this.saleArray[1].bigNumberR = this.FigureService.number(res.data.allAmount, true, true);
      this.saleArray[1].yoy = this.FigureService.scale(res.data.allAmountYoY, true, true);
      this.saleArray[1].yoyR = res.data.allAmountYoY;
      this.saleArray[1].allAmountYoYValue = this.FigureService.number(res.data.allAmountYoYValue, true, true);
      this.saleArray[1].allAmountYoYValueY = this.FigureService.number(res.data.allAmountYoYValue, false, true);
      this.saleArray[1].allAmountYoYValueInc = (this.FigureService.isDefine(res.data.allAmount) !== '-' && this.FigureService.isDefine(res.data.allAmountYoYValue) !== '-') ? this.FigureService.number(res.data.allAmount - res.data.allAmountYoYValue, true, true) : '-';
      this.saleArray[1].allAmountYoYValueIncY = (this.FigureService.isDefine(res.data.allAmount) !== '-' && this.FigureService.isDefine(res.data.allAmountYoYValue) !== '-') ? this.FigureService.number(res.data.allAmount - res.data.allAmountYoYValue, false, true) : '-';
    });

    com.comparableStores = true;
    p = this.tool.buildParam(this.tool.getParam(com, field));
    p.pageId = this.CommonCon.page.page_home;
    this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {
      if (!res.data) return;
      this.saleArray[1].compareYoY = this.FigureService.scale(res.data.allAmountYoY, true, true);
      this.saleArray[1].compareYoYR = res.data.allAmountYoY;
    });

    // 年
    let comYear = angular.copy(this.com);
    p = this.tool.buildParam(this.tool.getParam(comYear, field));
    p.pageId = this.CommonCon.page.page_home;
    this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {
      if (!res.data) return;
      this.saleArray[2].bigNumber = this.FigureService.number(res.data.allAmount, false, true);
      this.saleArray[2].bigNumberR = this.FigureService.number(res.data.allAmount, true, true);
      this.saleArray[2].yoy = this.FigureService.scale(res.data.allAmountYoY, true, true);
      this.saleArray[2].yoyR = res.data.allAmountYoY;
      this.saleArray[2].allAmountYoYValue = this.FigureService.number(res.data.allAmountYoYValue, true, true);
      this.saleArray[2].allAmountYoYValueY = this.FigureService.number(res.data.allAmountYoYValue, false, true);
      this.saleArray[2].allAmountYoYValueInc = (this.FigureService.isDefine(res.data.allAmount) !== '-' && this.FigureService.isDefine(res.data.allAmountYoYValue) !== '-') ? this.FigureService.number(res.data.allAmount - res.data.allAmountYoYValue, true, true) : '-';
      this.saleArray[2].allAmountYoYValueIncY = (this.FigureService.isDefine(res.data.allAmount) !== '-' && this.FigureService.isDefine(res.data.allAmountYoYValue) !== '-') ? this.FigureService.number(res.data.allAmount - res.data.allAmountYoYValue, false, true) : '-';
    });

    comYear.comparableStores = true;
    p = this.tool.buildParam(this.tool.getParam(comYear, field));
    p.pageId = this.CommonCon.page.page_home;
    this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {
      if (!res.data) return;
      this.saleArray[2].compareYoY = this.FigureService.scale(res.data.allAmountYoY, true, true);
      this.saleArray[2].compareYoYR = res.data.allAmountYoY;

    });
  }

  // 柱状图今年数据
  getPeriodNewProductCountNow() {
    let com = angular.copy(this.com);
    com.date = "" + this.year + '01' + '-' + this.year + this.month;
    let field = ['allAmount', 'allProfit', 'flowCnt', 'allAmountYoYValue', 'allProfitYoYValue', 'flowCntYoYValue'];
    let p = this.tool.buildParam(this.tool.getParam(com, field));
    p.pageId = this.CommonCon.page.page_home;
    this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {
      let data = res.data;
      if (data) {
        this.compareArray = [this.FigureService.isDefine(data.allAmount), this.FigureService.isDefine(data.allProfit), this.FigureService.isDefine(data.flowCnt)];
        this.compareArrayYoY = [this.FigureService.isDefine(data.allAmountYoYValue), this.FigureService.isDefine(data.allProfitYoYValue), this.FigureService.isDefine(data.flowCntYoYValue)];
        this.chart_bar_Unit = this.buildChartData([this.compareArray[0], this.compareArrayYoY[0]], "销售额", '单位:万元', this.label);
        this.chart_bar_Amount = this.buildChartData([this.compareArray[1], this.compareArrayYoY[1]], "毛利额", '单位:万元', this.label);
        this.chart_bar_GPM = this.buildChartData([this.compareArray[2], this.compareArrayYoY[2]], "客单数", '单位:万', this.label);
      }else {
        this.compareArray = ['-', '-', '-'];
        this.compareArrayYoY = ['-', '-', '-'];
        this.chart_bar_Unit = this.buildChartData([this.compareArray[0], this.compareArrayYoY[0]], "销售额", '单位:万元', this.label);
        this.chart_bar_Amount = this.buildChartData([this.compareArray[1], this.compareArrayYoY[1]], "毛利额", '单位:万元', this.label);
        this.chart_bar_GPM = this.buildChartData([this.compareArray[2], this.compareArrayYoY[2]], "客单数", '单位:万', this.label);
      }
    });
  }


  // 柱状图切换marketing数据
  getPeriodNewProductCount(newVal) {

    if(newVal === 'lastT') {
      this.chart_bar_Unit = this.buildChartData([this.compareArray[0], this.compareArrayYoY[0]], "销售额", '单位:万元', this.label);
      this.chart_bar_Amount = this.buildChartData([this.compareArray[1], this.compareArrayYoY[1]], "毛利额", '单位:万元', this.label);
      this.chart_bar_GPM = this.buildChartData([this.compareArray[2], this.compareArrayYoY[2]], "客单数", '单位:万', this.label);

    }else {

      if (this.compareArrayAll.length === 0) {
        let com = angular.copy(this.com);
        com.date = "" + this.lastYear + '01' + '-' + "" + this.lastYear + '12';
        let field = ['allAmount', 'allProfit', 'flowCnt'];
        let p = this.tool.buildParam(this.tool.getParam(com, field));
        p.pageId = this.CommonCon.page.page_home;
        this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {
          let data = res.data;
          if (data) {
            this.compareArrayAll = [this.FigureService.isDefine(data.allAmount), this.FigureService.isDefine(data.allProfit), this.FigureService.isDefine(data.flowCnt)];
            this.chart_bar_Unit = this.buildChartData([this.compareArray[0], this.compareArrayAll[0]], "销售额", '单位:万元', this.label);
            this.chart_bar_Amount = this.buildChartData([this.compareArray[1], this.compareArrayAll[1]], "毛利额", '单位:万元', this.label);
            this.chart_bar_GPM = this.buildChartData([this.compareArray[2], this.compareArrayAll[2]], "客单数", '单位:万', this.label);
          } else {
            this.compareArrayAll = ['-', '-', '-'];
            this.chart_bar_Unit = this.buildChartData([this.compareArray[0], '-'], "销售额", '单位:万元', this.label);
            this.chart_bar_Amount = this.buildChartData([this.compareArray[1], '-'], "毛利额", '单位:万元', this.label);
            this.chart_bar_GPM = this.buildChartData([this.compareArray[2], '-'], "客单数", '单位:万', this.label);
          }
        });
      }else {
        this.chart_bar_Unit = this.buildChartData([this.compareArray[0], this.compareArrayAll[0]], "销售额", '单位:万元', this.label);
        this.chart_bar_Amount = this.buildChartData([this.compareArray[1], this.compareArrayAll[1]], "毛利额", '单位:万元', this.label);
        this.chart_bar_GPM = this.buildChartData([this.compareArray[2], this.compareArrayAll[2]], "客单数", '单位:万', this.label);
      }
    }
  }

  // 创建柱状图参数
  buildChartData(data, key, name, label) {

    // 当前指标的数据集合
    const lastYear = [data[0]];
    const thisYear = [data[1]];

    // 传给chart的系列数据
    const values = [lastYear, thisYear];


    // 传给chart的图例数据

    const legends = this.last_name === 'lastAll' ? ["" + this.year + '年', "" + this.lastYear + '全年'] : ["" + this.year + '年', "" + this.lastYear + '年'];
    const xData = [''];

    return this.setChart(values, legends, name, xData, key, label);
  }

  // 核心指标
  getCoreInfor(type) {

    this.coreUpArray[0].bigNumber = this.coreUpArray[0].bigNumberR = this.coreUpArray[0].lastDay = this.coreUpArray[0].yoy = this.coreUpArray[0].oldYoY = '-';
    this.coreUpArray[1].bigNumber = this.coreUpArray[1].bigNumberR = this.coreUpArray[1].lastDay = this.coreUpArray[1].yoy = this.coreUpArray[1].oldYoY = '-';
    this.coreUpArray[2].bigNumber = this.coreUpArray[2].bigNumberR = this.coreUpArray[2].lastDay = this.coreUpArray[2].yoy = this.coreUpArray[2].oldYoY = '-';

    this.coreUpArray[0].lastDayR = this.coreUpArray[0].yoyR = this.coreUpArray[0].oldYoYR = '';
    this.coreUpArray[1].lastDayR = this.coreUpArray[1].yoyR = this.coreUpArray[1].oldYoYR = '';
    this.coreUpArray[2].lastDayR = this.coreUpArray[2].yoyR = this.coreUpArray[2].oldYoYR = '';

    this.coreDownArray[0].bigNumber = this.coreDownArray[0].bigNumberR = this.coreDownArray[0].lastDay = this.coreDownArray[0].yoy = this.coreDownArray[0].oldYoY = this.coreDownArray[0].data = '-';
    this.coreDownArray[1].bigNumber = this.coreDownArray[1].bigNumberR = this.coreDownArray[1].lastDay = this.coreDownArray[1].yoy = this.coreDownArray[1].oldYoY = this.coreDownArray[1].data = '-';
    this.coreDownArray[2].bigNumber = this.coreDownArray[2].bigNumberR = this.coreDownArray[2].lastDay = this.coreDownArray[2].yoy = this.coreDownArray[2].oldYoY = this.coreDownArray[2].data = '-';

    this.coreDownArray[0].lastDayR = this.coreDownArray[0].yoyR = this.coreDownArray[0].oldYoYR = '';
    this.coreDownArray[1].lastDayR = this.coreDownArray[1].yoyR = this.coreDownArray[1].oldYoYR = '';
    this.coreDownArray[2].lastDayR = this.coreDownArray[2].yoyR = this.coreDownArray[2].oldYoYR = '';


    if (type === 'day') {

      let field = ['retailAmount', 'retailAmountYoY', 'retailAmountToT', 'flowCnt', 'flowCntYoY', 'flowCntToT', 'retailFlowAmount', 'retailFlowAmountYoY', 'retailFlowAmountToT', 'allProfit', 'allProfitYoY', 'allProfitToT', 'stockCost', 'stockCostYoY', 'stockCostToT', 'allProfitRate', 'saleDays'];
      field = field.concat(this.powerFieldDay);
      let com = angular.copy(this.com);
      com.date = this.baseDate + '-' + this.baseDate;
      let p = this.tool.buildParam(this.tool.getParam(com, field));
      p.pageId = this.CommonCon.page.page_home;
      this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {

        if (!res.data) return;
        // 核心指标上半部分数据
        this.coreUpArray[0].bigNumber = this.FigureService.number(res.data.retailAmount, true, true);
        this.coreUpArray[0].bigNumberR = this.FigureService.number(res.data.retailAmount, false, true);
        this.coreUpArray[0].lastDay = this.FigureService.scale(res.data.retailAmountToT, true, true);
        this.coreUpArray[0].lastDayR = res.data.retailAmountToT;
        this.coreUpArray[0].yoy = this.FigureService.scale(res.data.retailAmountYoY, true, true);
        this.coreUpArray[0].yoyR = res.data.retailAmountYoY;

        this.coreUpArray[1].bigNumber = this.FigureService.number(res.data.flowCnt, true, true);
        this.coreUpArray[1].bigNumberR = this.FigureService.number(res.data.flowCnt, false, true, 0);
        this.coreUpArray[1].lastDay = this.FigureService.scale(res.data.flowCntToT, true, true);
        this.coreUpArray[1].lastDayR = res.data.flowCntToT;
        this.coreUpArray[1].yoy = this.FigureService.scale(res.data.flowCntYoY, true, true);
        this.coreUpArray[1].yoyR = res.data.flowCntYoY;

        this.coreUpArray[2].bigNumber = this.FigureService.scaleOther(res.data.retailFlowAmount, false, false);
        this.coreUpArray[2].bigNumberR = this.FigureService.scaleOther(res.data.retailFlowAmount, false, false);
        this.coreUpArray[2].lastDay = this.FigureService.scale(res.data.retailFlowAmountToT, true, true);
        this.coreUpArray[2].lastDayR = res.data.retailFlowAmountToT;
        this.coreUpArray[2].yoy = this.FigureService.scale(res.data.retailFlowAmountYoY, true, true);
        this.coreUpArray[2].yoyR = res.data.retailFlowAmountYoY;

        // 核心指标下半部分数据
        this.coreDownArray[0].bigNumber = this.FigureService.number(res.data.allProfit, true, true);
        this.coreDownArray[0].bigNumberR = this.FigureService.number(res.data.allProfit, false, true);
        this.coreDownArray[0].lastDay = this.FigureService.scale(res.data.allProfitToT, true, true);
        this.coreDownArray[0].lastDayR = res.data.allProfitToT;
        this.coreDownArray[0].yoy = this.FigureService.scale(res.data.allProfitYoY, true, true);
        this.coreDownArray[0].yoyR = res.data.allProfitYoY;
        this.coreDownArray[0].data = this.FigureService.scale(res.data.allProfitRate, true, true);

        this.coreDownArray[1].bigNumber = this.FigureService.number(res.data[this.powerFieldDay[0]], true, true);
        this.coreDownArray[1].bigNumberR = this.FigureService.number(res.data[this.powerFieldDay[0]], false, true);
        this.coreDownArray[1].lastDay = this.FigureService.scale(res.data[this.powerFieldDay[1]], true, true);
        this.coreDownArray[1].lastDayR = res.data[this.powerFieldDay[1]];
        this.coreDownArray[1].yoy = this.FigureService.scale(res.data[this.powerFieldDay[2]], true, true);
        this.coreDownArray[1].yoyR = res.data[this.powerFieldDay[2]];
        this.coreDownArray[1].data = this.FigureService.scale(res.data[this.powerFieldDay[3]], true, true);

        this.coreDownArray[2].bigNumber = this.FigureService.number(res.data.stockCost, true, true);
        this.coreDownArray[2].bigNumberR = this.FigureService.number(res.data.stockCost, false, true);
        this.coreDownArray[2].lastDay = this.FigureService.scale(res.data.stockCostToT, true, true);
        this.coreDownArray[2].lastDayR = res.data.stockCostToT;
        this.coreDownArray[2].yoy = this.FigureService.scale(res.data.stockCostYoY, true, true);
        this.coreDownArray[2].yoyR = res.data.stockCostYoY;
        this.coreDownArray[2].data = this.FigureService.scaleOther(res.data.saleDays, false, false);
      });

      // 农历
      field = ['retailAmountYoY', 'flowCntYoY', 'retailFlowAmountYoY', 'allProfitYoY', 'stockCostYoY'];
      field = field.concat(this.powerFieldLau);
      p = this.tool.buildParam(this.tool.getParam(com, field));
      p.condition.date.lunar = true;
      p.pageId = this.CommonCon.page.page_home;
      this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {

        if (!res.data) return;
        this.coreUpArray[0].oldYoY = this.FigureService.scale(res.data.retailAmountYoY, true, true);
        this.coreUpArray[0].oldYoYR = res.data.retailAmountYoY;

        this.coreUpArray[1].oldYoY = this.FigureService.scale(res.data.flowCntYoY, true, true);
        this.coreUpArray[1].oldYoYR = res.data.flowCntYoY;

        this.coreUpArray[2].oldYoY = this.FigureService.scale(res.data.retailFlowAmountYoY, true, true);
        this.coreUpArray[2].oldYoYR = res.data.retailFlowAmountYoY;


        this.coreDownArray[0].oldYoY = this.FigureService.scale(res.data.allProfitYoY, true, true);
        this.coreDownArray[0].oldYoYR = res.data.allProfitYoY;

        this.coreDownArray[1].oldYoY = this.FigureService.scale(res.data[this.powerFieldLau[0]], true, true);
        this.coreDownArray[1].oldYoYR = res.data[this.powerFieldLau[0]];

        this.coreDownArray[2].oldYoY = this.FigureService.scale(res.data.stockCostYoY, true, true);
        this.coreDownArray[2].oldYoYR = res.data.stockCostYoY;
      });


    } else {

      let field = ['retailAmount', 'retailAmountYoY', 'flowCnt', 'flowCntYoY', 'retailFlowAmount', 'retailFlowAmountYoY', 'allProfit', 'allProfitYoY', 'stockCost', 'stockCostYoY', 'allProfitRate', 'saleDays'];
      field = field.concat(this.powerFieldYear);
      let p;
      if (type === 'month') {
        let com = angular.copy(this.com);
        com.date = this.monthDate;
        p = this.tool.buildParam(this.tool.getParam(com, field));
      } else {
        p = this.tool.buildParam(this.tool.getParam(this.com, field));
      }
      p.pageId = this.CommonCon.page.page_home;
      this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {

        if (!res.data) return;

        // 核心指标上半部分数据
        this.coreUpArray[0].bigNumber = this.FigureService.number(res.data.retailAmount, true, true);
        this.coreUpArray[0].bigNumberR = this.FigureService.number(res.data.retailAmount, false, true);
        this.coreUpArray[0].yoy = this.FigureService.scale(res.data.retailAmountYoY, true, true);
        this.coreUpArray[0].yoyR = res.data.retailAmountYoY;

        this.coreUpArray[1].bigNumber = this.FigureService.number(res.data.flowCnt, true, true);
        this.coreUpArray[1].bigNumberR = this.FigureService.number(res.data.flowCnt, false, true, 0);
        this.coreUpArray[1].yoy = this.FigureService.scale(res.data.flowCntYoY, true, true);
        this.coreUpArray[1].yoyR = res.data.flowCntYoY;

        this.coreUpArray[2].bigNumber = this.FigureService.number(res.data.retailFlowAmount, true, true);
        this.coreUpArray[2].bigNumberR = this.FigureService.number(res.data.retailFlowAmount, false, true);
        this.coreUpArray[2].yoy = this.FigureService.scale(res.data.retailFlowAmountYoY, true, true);
        this.coreUpArray[2].yoyR = res.data.retailFlowAmountYoY;

        // 核心指标下半部分数据
        this.coreDownArray[0].bigNumber = this.FigureService.number(res.data.allProfit, true, true);
        this.coreDownArray[0].bigNumberR = this.FigureService.number(res.data.allProfit, false, true);
        this.coreDownArray[0].yoy = this.FigureService.scale(res.data.allProfitYoY, true, true);
        this.coreDownArray[0].yoyR = res.data.allProfitYoY;
        this.coreDownArray[0].data = this.FigureService.scale(res.data.allProfitRate, true, true);

        this.coreDownArray[1].bigNumber = this.FigureService.number(res.data[this.powerFieldYear[0]], true, true);
        this.coreDownArray[1].bigNumberR = this.FigureService.number(res.data[this.powerFieldYear[0]], false, true);
        this.coreDownArray[1].yoy = this.FigureService.scale(res.data[this.powerFieldYear[1]], true, true);
        this.coreDownArray[1].yoyR = res.data[this.powerFieldYear[1]];
        this.coreDownArray[1].data = this.FigureService.scale(res.data[this.powerFieldYear[2]], true, true);

        this.coreDownArray[2].bigNumber = this.FigureService.number(res.data.stockCost, true, true);
        this.coreDownArray[2].bigNumberR = this.FigureService.number(res.data.stockCost, false, true);
        this.coreDownArray[2].yoy = this.FigureService.scale(res.data.stockCostYoY, true, true);
        this.coreDownArray[2].yoyR = res.data.stockCostYoY;
        this.coreDownArray[2].data = this.FigureService.scaleOther(res.data.saleDays, false, false);


      });
    }
  }

  //图表指标选择
  changeSelect(num) {
    if (this.selectNum === num) return;
    this.selectNum = num;
    if (num === 0) {
      this.selectUp = true;
      this.coreDownArray[0].select = false;
      this.coreDownArray[1].select = false;
      this.coreDownArray[2].select = false;

      let data = this.coreUpArray.filter(item => item.select);
      let field = [];
      for (let i = 0; i < data.length; i++) {
        field.push(data[i].name);
      }
      this.chartField = field;
      this.chartInfor(this.chartField, this.chartDate);
      this.loadChart = [this.chartField, this.chartDate];
    } else {
      this.selectUp = false;
      for (let i = 0; i < this.coreDownArray.length; i++) {
        let dic = this.coreDownArray[i];
        if (num === dic.num) {
          dic.select = true;
          this.chartField = [this.coreDownArray[i].name, this.coreDownArray[i].subName];
          this.chartInfor(this.chartField, this.chartDate);
          this.loadChart = [this.chartField, this.chartDate];
        } else {
          dic.select = false;
        }
      }
    }
  }

  checkSelect(num) {
    let data = this.coreUpArray.filter(item => item.select);
    if (data.length >= 2) {
      for (let i = 0; i < this.coreUpArray.length; i++) {
        let data = this.coreUpArray[i];
        if (data.select === false) data.disable = true;
        if (data.select === true) data.disable = false;
      }
    } else {
      for (let i = 0; i < this.coreUpArray.length; i++) {
        let data = this.coreUpArray[i];
        if (data.select === false) data.disable = false;
        if (data.select === true) data.disable = true;
      }
    }

    let field = [];
    for (let i = 0; i < data.length; i++) {
      field.push(data[i].name);
    }
    this.chartField = field;
    this.chartInfor(this.chartField, this.chartDate);
    this.loadChart = [this.chartField, this.chartDate];

  }

  // 图表 type接口参数 date切换的日期
  chartInfor(type, date) {
    let field = [];
    for (let i = 0; i < type.length; i++) {
      let str = type[i];
      field.push(str);
      field.push(str + 'YoYValue');
    }
    let com = angular.copy(this.com);
    com.date = date;
    let p = this.tool.buildParam(this.tool.getParam(com, field));
    p.pageId = this.CommonCon.page.page_home;
    p.condition.date.allDate = true;
    p.sortBy = {
      field: "dateCode",
      direction: 1
    };
    this.basic.packager(this.dataService.getTrendForSale(p), res => {

      let data = res.data.details;
      if (data) {

        const key = {
          xAxisNoWrap: true,
          xData: {
            code: "dateCode",
            format: com.date.length > 16 ? "MM/DD" : "YYYY/MM"
          },
          data,
          info: this.fieldInfo
        };
        let bar = [];
        let line = [];
        for (let i = 0; i < type.length; i++) {
          let str = type[i];
          if (str === 'retailAmount') {
            bar.push({id: 'retailAmount', name: '零售额'});
            bar.push({id: 'retailAmountYoYValue', name: '零售额-同期值'});
          } else if (str === 'flowCnt') {
            line.push({id: 'flowCnt', name: '客单数'});
            line.push({id: 'flowCntYoYValue', name: '客单数-同期值'});
          } else if (str === 'retailFlowAmount') {
            line.push({id: 'retailFlowAmount', name: '零售客单价'});
            line.push({id: 'retailFlowAmountYoYValue', name: '零售客单价-同期值'});
          } else if (str === 'allProfit') {
            bar.push({id: 'allProfit', name: '毛利额'});
            bar.push({id: 'allProfitYoYValue', name: '毛利额-同期值'});
          } else if (str === this.coreDownArray[1].name) {
            bar.push({id: this.coreDownArray[1].name, name: this.coreDownArray[1].title});
            bar.push({id: this.coreDownArray[1].name + 'YoYValue', name: this.coreDownArray[1].title + '-同期值'});
          } else if (str === 'stockCost') {
            bar.push({id: 'stockCost', name: '日均库存金额'});
            bar.push({id: 'stockCostYoYValue', name: '日均库存金额-同期值'});
          } else if (str === 'allProfitRate') {
            line.push({id: 'allProfitRate', name: '毛利率'});
            line.push({id: 'allProfitRateYoYValue', name: '毛利率-同期值'});
          } else if (str === this.coreDownArray[1].subName) {
            line.push({id: this.coreDownArray[1].subName, name: this.coreDownArray[1].underTitle});
            line.push({
              id: this.coreDownArray[1].subName + 'YoYValue',
              name: this.coreDownArray[1].underTitle + '-同期值'
            });
          } else if (str === 'saleDays') {
            line.push({id: 'saleDays', name: '经销周转天数'});
            line.push({id: 'saleDaysYoYValue', name: '经销周转天数-同期值'});
          }
        }
        let curr = {bar, line};

        key.barLabel = this.showBarLabel;
        key.lineLabel = this.showLineLabel;
        this.chart_line = this.tool.buildChart(curr, key);
      }
    });

    this.getFlowCnt();

  }

  // 选择客单和零售客单价显示
  getFlowCnt() {
    if (this.selectUp && (this.coreUpArray[1].select || this.coreUpArray[2].select)) {
      let field = [this.coreUpArray[1].select ? 'flowYoyIncDays' : null, this.coreUpArray[2].select ? 'flowRetailYoyIncDays' : null];
      let com = angular.copy(this.com);
      com.date = this.flowCntDate;
      let p = this.tool.buildParam(this.tool.getParam(com, field));
      p.pageId = this.CommonCon.page.page_home;
      this.basic.packager(this.dataService.getFlowOrFlowRetailYoYIncCnt(p), res => {
        let data = res.data;
        if (data) {
          this.flowCntInforArray = [
            this.coreUpArray[2].select ? {title: '零售客单价大于上年同期天数', num: data.retailFlowIncDays} : null,
            this.coreUpArray[1].select ? {title: '客单数大于上年同期天数', num: data.flowIncDays} : null,
          ];
        }
      });
    } else {
      this.flowCntInforArray = [];
    }
  }

  // 指标达成
  getIndexInfor(type) {

    this.basic.packager(this.dataService.getCurrentMonth(), res => {

      if (type === 'buyer') {
        this.indexArray = [
          {title: '不含税销售额', mine: '-', mineY: '-', all: '-', allY: '-', percent: ''},
          {title: '毛利额', mine: '-', mineY: '-', all: '-', allY: '-', percent: ''},
          {title: '综合收益', mine: '-', mineY: '-', all: '-', allY: '-', percent: ''},
        ];
        // this.indexMonth = ' (' + this.year + '年' + String(moment(res.data.classDateCode + '', 'YYYYMM').format('MM')) + '月)';
        this.indexYear = String(moment(res.data.classDateCode + '', 'YYYYMM').format('YYYY'));
        this.indexM = String(moment(res.data.classDateCode + '', 'YYYYMM').format('MM'));
        this.indexMonth = `(${this.indexYear}年${this.indexM}月)`;
        this.indexTitle = this.job === 'all' ? "" : '采购';
        let field = ['allAmountAftTax', 'allAmountAftTaxKpi', 'allAmountAftTaxCR', 'allProfit', 'allProfitKpi', 'allProfitCR', 'compIncomeAmount', 'compIncomeAmountKpi', 'compIncomeAmountCR'];
        let com = angular.copy(this.com);
        com.date = res.data.classDateCode + '-' + res.data.classDateCode;
        let p = this.tool.buildParam(this.tool.getParam(com, field));
        p.pageId = this.CommonCon.page.page_home;
        this.basic.packager(this.dataService.getTrendChartForPurchase(p), res => {
          let data = res.data[0];
          if (!data) return;
          this.indexArray[0].mineY = this.FigureService.number(data.allAmountAftTax, false, true);
          this.indexArray[0].mine = this.FigureService.number(data.allAmountAftTax, true, true);
          this.indexArray[0].allY = this.FigureService.number(data.allAmountAftTaxKpi, false, true);
          this.indexArray[0].all = this.FigureService.number(data.allAmountAftTaxKpi, true, true);
          this.indexArray[0].percent = this.FigureService.scale(data.allAmountAftTaxCR, true, true);

          this.indexArray[1].mineY = this.FigureService.number(data.allProfit, false, true);
          this.indexArray[1].mine = this.FigureService.number(data.allProfit, true, true);
          this.indexArray[1].allY = this.FigureService.number(data.allProfitKpi, false, true);
          this.indexArray[1].all = this.FigureService.number(data.allProfitKpi, true, true);
          this.indexArray[1].percent = this.FigureService.scale(data.allProfitCR, true, true);

          this.indexArray[2].mineY = this.FigureService.number(data.compIncomeAmount, false, true);
          this.indexArray[2].mine = this.FigureService.number(data.compIncomeAmount, true, true);
          this.indexArray[2].allY = this.FigureService.number(data.compIncomeAmountKpi, false, true);
          this.indexArray[2].all = this.FigureService.number(data.compIncomeAmountKpi, true, true);
          this.indexArray[2].percent = this.FigureService.scale(data.compIncomeAmountCR, true, true);
        });

      } else if (type === 'store') {

        this.indexArray = [
          {title: '含税销售额', mine: '-', mineY: '-', all: '-', allY: '-', percent: ''}
        ];
        // this.indexMonth = ' (' + this.year + '年' + String(moment(res.data.storeDateCode + '', 'YYYYMM').format('MM')) + '月)';
        this.indexYear = String(moment(res.data.storeDateCode + '', 'YYYYMM').format('YYYY'));
        this.indexM = String(moment(res.data.storeDateCode + '', 'YYYYMM').format('MM'));
        this.indexMonth = `(${this.indexYear}年${this.indexM}月)`;
        this.indexTitle = "营运";
        let field = ['allAmount', 'allAmountKpi', 'allAmountCR'];
        let com = angular.copy(this.com);
        com.date = res.data.storeDateCode + '-' + res.data.storeDateCode;
        let p = this.tool.buildParam(this.tool.getParam(com, field));
        p.pageId = this.CommonCon.page.page_home;
        this.basic.packager(this.dataService.getTrendChartForOperations(p), res => {
          let data = res.data[0];
          if (!data) return;
          this.indexArray[0].mineY = this.FigureService.number(data.allAmount, false, true);
          this.indexArray[0].mine = this.FigureService.number(data.allAmount, true, true);
          this.indexArray[0].allY = this.FigureService.number(data.allAmountKpi, false, true);
          this.indexArray[0].all = this.FigureService.number(data.allAmountKpi, true, true);
          this.indexArray[0].percent = this.FigureService.scale(data.allAmountCR, true, true);
        });
      }
    });
  }

  // 经销联营批发
  saleInfor(type) {

    if (type === 'first') {
      let field = ['distributionAmount', 'jointAmount', 'distributionAmountYoYValue', 'jointAmountYoYValue'];
      let p = this.tool.buildParam(this.tool.getParam(this.com, field));
      p.pageId = this.CommonCon.page.page_home;
      this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {
        if (res.data) {
          let color = ['#007ADB', '#05BC90'];
          let data = [
            {value: res.data.distributionAmount, name: '经销'},
            {value: res.data.jointAmount, name: '联营'},
          ];
          let dataYoY = [
            {value: res.data.distributionAmountYoYValue, name: '经销'},
            {value: res.data.jointAmountYoYValue, name: '联营'},
          ];

          let legend = ['经销', '联营'];
          this.chart_Pie_Sale_Left = this.salePie(data, dataYoY, legend, '销售方式');

        } else {

          let color = ['#007ADB', '#05BC90'];
          let data = [];
          let dataYoY = [];
          let legend = ['经销', '联营'];
          this.chart_Pie_Sale_Left = this.salePie(data, dataYoY, legend, '销售方式');
        }
      });
    } else if (type === 'second') {
      let field = ['retailAmount', 'wholeAmount', 'retailAmountYoYValue', 'wholeAmountYoYValue'];
      let p = this.tool.buildParam(this.tool.getParam(this.com, field));
      p.pageId = this.CommonCon.page.page_home;
      this.basic.packager(this.dataService.getSalesAndInventoryDataSummary(p), res => {
        if (res.data) {
          let color = ['#007ADB', '#05BC90'];
          let data = [
            {value: res.data.retailAmount, name: '零售'},
            {value: res.data.wholeAmount, name: '批发'},
          ];
          let dataYoY = [
            {value: res.data.retailAmountYoYValue, name: '零售'},
            {value: res.data.wholeAmountYoYValue, name: '批发'},
          ];
          let legend = ['零售', '批发'];
          this.chart_Pie_Sale_Left = this.salePie(data, dataYoY, legend, '销售方式');
        } else {

          let color = ['#007ADB', '#05BC90'];
          let data = [];
          let dataYoY = [];
          let legend = ['零售', '批发'];
          this.chart_Pie_Sale_Left = this.salePie(data, dataYoY, legend, '销售方式');
        }
      });
    } else {
      let field = ['retailDistributionAmount', 'wholeDistributionAmount', 'retailJointAmount', 'wholeJointAmount'];
      let p = this.tool.buildParam(this.tool.getParam(this.com, field));
      p.pageId = this.CommonCon.page.page_home;
      this.basic.packager(this.dataService.getSalesAndInventoryDataPercentage(p), res => {
        let color = ['#007ADB', '#26C08C', '#FB6C93', '#FF905C'];
        if (res.data) {
          let data = [
            {value: res.data.retailDistributionAmount, name: '经销-零售'},
            {value: res.data.wholeDistributionAmount, name: '经销-批发'},
            {value: res.data.retailJointAmount, name: '联营-零售'},
            {value: res.data.wholeJointAmount, name: '联营-批发'},
          ];
          let legend = ['经销-零售', '经销-批发', '联营-零售', '联营-批发'];
          let com = angular.copy(this.com);
          com.date = this.lastYear + '0101-' + this.lastYear + this.day;
          let f = this.tool.buildParam(this.tool.getParam(com, field));
          f.pageId = this.CommonCon.page.page_home;
          this.basic.packager(this.dataService.getSalesAndInventoryDataPercentage(f), res => {
            let dataYoY = [];
            if (res.data) {
              dataYoY = [
                {value: res.data.retailDistributionAmount, name: '经销-零售'},
                {value: res.data.wholeDistributionAmount, name: '经销-批发'},
                {value: res.data.retailJointAmount, name: '联营-零售'},
                {value: res.data.wholeJointAmount, name: '联营-批发'},
              ];
            }
            this.chart_Pie_Sale_Left = this.salePie(data, dataYoY, legend, '销售方式');
          });
        } else {
          let data = [];
          let dataYoY = [];
          let legend = ['经销-零售', '经销-批发', '联营-零售', '联营-批发'];
          let field = ['retailDistributionAmount', 'wholeDistributionAmount', 'retailJointAmount', 'wholeJointAmount'];
          let com = angular.copy(this.com);
          com.date = this.lastYear + '01-' + this.lastYear + this.day;
          let f = this.tool.buildParam(this.tool.getParam(com, field));
          f.pageId = this.CommonCon.page.page_home;
          this.basic.packager(this.dataService.getSalesAndInventoryDataPercentage(f), res => {
            let dataYoY = [];
            if (res.data) {
              dataYoY = [
                {value: res.data.retailDistributionAmount, name: '经销-零售'},
                {value: res.data.wholeDistributionAmount, name: '经销-批发'},
                {value: res.data.retailJointAmount, name: '联营-零售'},
                {value: res.data.wholeJointAmount, name: '联营-批发'},
              ];
            }
            this.chart_Pie_Sale_Left = this.salePie(data, dataYoY, legend, '销售方式');
          });

        }
      });
    }
  }

  // 业态信息
  areaInfor() {

    let field = ['allAmount', 'allAmountYoYValue'];
    let p = this.tool.buildParam(this.tool.getParam(this.com, field));
    p.pageId = this.CommonCon.page.page_home;
    p.sortBy = {field: "operationCode", direction: 1};
    this.basic.packager(this.dataService.getOperationRankingForSale(p), res => {

      let data = [];
      let legend = [];
      let dataYoY = [];
      if (res.data.details) {
        let array = res.data.details;
        for (let i = 0; i < array.length; i++) {
          let name = array[i].businessOperationName ? array[i].businessOperationName : '未知' + i;
          legend.push(name);
          data.push({value: array[i].allAmount, name: name});
          dataYoY.push({value: array[i].allAmountYoYValue, name: name})
        }
      }
      this.chart_Pie_Area = this.salePie(data, dataYoY, legend, '业态结构');
    });
  }

  // 地区信息
  areaInforNew() {

    let field = ['allAmount', 'allAmountYoYValue'];
    let p = this.tool.buildParam(this.tool.getParam(this.com, field));
    p.pageId = this.CommonCon.page.page_home;
    p.sortBy = {field: "districtCode", direction: 1};
    this.basic.packager(this.dataService.getAreaRankingForSale(p), res => {
      let data = [];
      let legend = [];
      let dataYoY = [];
      if (res.data.details) {
        let array = res.data.details;
        for (let i = 0; i < array.length; i++) {
          let name = array[i].districtName ? array[i].districtName : '未知' + i;
          legend.push(name);
          data.push({value: array[i].allAmount, name: name});
          dataYoY.push({value: array[i].allAmountYoYValue, name: name})
        }
      }
      this.chart_Pie_Area_Now = this.salePie(data, dataYoY, legend, '地区结构');

    });
  }

  // 新品概况
  newItemInfor() {

    let com = angular.copy(this.com);
    com.date = "" + this.year + '01' + '-' + "" + moment(this.baseDate + '', 'YYYYMMDD').format('YYYYMM');
    com.year = this.year;
    com.saleType = 0;
    com.status = 0;
    let f = this.tool.buildParam(this.tool.getParam(com, ''));
    f.pageId = this.CommonCon.page.page_home;
    this.basic.packager(this.dataService.getNewProductStructure(f), res => {
      const data = res.data.summary;
      if (data) {
        let lastYear = parseInt(this.year) - 1;
        let legend = [this.year + '年新品', lastYear + '年新品', '非新品'];
        let unitData = [
          {value: data.newProductSku[this.year], name: legend[0]},
          {value: data.newProductSku['' + lastYear], name: legend[1]},
          {value: data.newProductSku.other, name: legend[2]}
        ];
        let amountData = [
          {value: data.sale[this.year], name: legend[0]},
          {value: data.sale['' + lastYear], name: legend[1]},
          {value: data.sale.other, name: legend[2]}
        ];

        let gmpData = [
          {value: data.profit[this.year], name: legend[0]},
          {value: data.profit['' + lastYear], name: legend[1]},
          {value: data.profit.other, name: legend[2]}
        ];


        this.chart_Pie_Unit = this.morePie(unitData, legend, '引入新品SKU结构');
        this.chart_Pie_Amount = this.morePie(amountData, legend, "销售额结构");
        this.chart_Pie_GPM = this.morePie(gmpData, legend, "毛利额结构");
      } else {

        this.chart_Pie_Unit = this.morePie([], [], '引入新品SKU结构');
        this.chart_Pie_Amount = this.morePie([], [], "销售额结构");
        this.chart_Pie_GPM = this.morePie([], [], "毛利额结构");
      }


    });
  }

  // 供应商概况
  supplierInfor() {

    let year = Number(moment(this.baseDate, 'YYYYMMDD').format('YYYY'));
    const param = this.tool.buildParam(this.tool.getParam(
      Object.assign({date: this.startYear, year: year}, this.com), ''));
    param.pageId = this.CommonCon.page.page_home;
    this.basic.packager(this.dataService.getNewSupplierStructure(param), res => {

      let data = res.data.summary;
      if (data) {
        let lastYear = parseInt(this.year) - 1;
        let legend = [this.year + '年新供应商', lastYear + '年新供应商', '非新供应商'];
        let supplier = [
          {value: data.supplier[this.year], name: legend[0]},
          {value: data.supplier['' + lastYear], name: legend[1]},
          {value: data.supplier.other, name: legend[2]}
        ];
        let amountData = [
          {value: data.sale[this.year], name: legend[0]},
          {value: data.sale['' + lastYear], name: legend[1]},
          {value: data.sale.other, name: legend[2]}
        ];

        let gmpData = [
          {value: data.profit[this.year], name: legend[0]},
          {value: data.profit['' + lastYear], name: legend[1]},
          {value: data.profit.other, name: legend[2]}
        ];


        this.chart_supplier = this.morePie(supplier, legend, '引入年份结构');
        this.chart_sale = this.morePie(amountData, legend, "销售额结构");
        this.chart_profit = this.morePie(gmpData, legend, "毛利额结构");
      } else {

        this.chart_supplier = this.morePie([], [], '引入年份结构');
        this.chart_sale = this.morePie([], [], "销售额结构");
        this.chart_profit = this.morePie([], [], "毛利额结构");
      }
    })
  }

  // 经销联营
  salePie(data, dataYoY, legend, series) {

    return {
      color: ['#007ADB', '#26C08C', '#FB6C93', '#FF905C', '#EA5B66', '#A948CC', '#129FCC', '#6CD169', '#FFB358', '#FF9F75', '#FFC467', '#E66BCF', '#FA7C70', '#6C58D8 ', '#C8D45D', '#FF8D50'],
      legend: {
        orient: 'horizontal',
        x: 'center',
        data: legend,
        y: '85%',
      },
      series: [
        {
          name: series,
          type: 'pie',
          radius: '55%',
          center: ['23%', '50%'],
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          clockwise: false,
          label: {
            normal: {
              formatter: function (p) {
                if (p.percent < 6) return "";
                return p.percent + '%';
              },
              textStyle: {
                fontWeight: 'normal',
                fontSize: 12,
              },
              show: true,
              position: 'inside',
            },

            emphasis: {
              show: true,
              align: 'left',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 10,
              padding: 7,
              formatter: (p) => {
                if (p.name === ' ') return "未知";
                let b = this.FigureService.number(p.value, false, true);
                return p.name + '\n' + b + '元' + '(' + p.percent + '%)';
              }

            }
          },
          animation: false,

        },
        {
          name: series,
          type: 'pie',
          radius: '55%',
          center: ['70%', '50%'],
          data: dataYoY,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          clockwise: false,
          label: {
            normal: {
              formatter: function (p) {
                if (p.percent < 6) return "";
                return p.percent + '%';
              },
              textStyle: {
                fontWeight: 'normal',
                fontSize: 12,
              },
              show: true,
              position: 'inside',
            },

            emphasis: {
              show: true,
              align: 'left',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 10,
              padding: 7,
              formatter: (p) => {
                if (p.name === ' ') return "未知";
                let b = this.FigureService.number(p.value, false, true);
                return p.name + '\n' + b + '元' + '(' + p.percent + '%)';
              },
            }
          },
          animation: false,
        }
      ]
    };
  }

  // 其他众多饼图
  morePie(data, legend, series) {
    return {
      color: ['#007ADB', '#26C08C', '#FB6C93'],
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: (a) => {
          let title = series + "<br/>";
          let value = a.seriesName.includes('额') ? this.FigureService.number(a.value, false, true) + '元' : this.FigureService.thousand(a.value, 0);
          return title + a.marker + a.name + '：' + value + '(' + a.percent + '%' + ')'
        },
        textStyle: {

          fontSize: 10
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: legend,
        y: '3%'
      },
      series: [
        {
          name: series,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            normal: {
              formatter: '{d}%',
              textStyle: {
                fontWeight: 'normal',
                fontSize: 12,
              }
            }
          },
          animation: false
        }
      ]
    };
  }

  // 绘制柱状图
  setChart(values, legends, name, xData, key, label) {
    return {
      color: ['#007ADB', '#26C08C'],
      tooltip: {
        trigger: 'axis',
        confine: true,
        axisPointer: {
          type: 'shadow'
        },
        formatter: (a) => {
          let index = a[0].dataIndex;
          let title = key + '&nbsp;' + '</br>';
          // let yoyTitle = yoy ? '同比增幅：' + yoy : '';

          // let yoyArrTitle = yoyArr ? '同比增幅：' + (yoyArr[index] ? yoyArr[index] : '-') : '';

          return title + a.map(s => {
              let sum = name.includes('万元') > 0 ? this.FigureService.number(s['value'], false, true) + '元' : this.FigureService.thousand(s['value'], 0);
              return s['marker'] + s['seriesName'] + '&nbsp;' + ':' + '&nbsp;' + sum + '<br/>';
            }).join('');
        }
      },
      legend: {
        left: 'right',
        textStyle: {fontSize: 12, fontFamily: 'SimSun'},
        padding: [0, 30, 0, 0],
        data: legends
      },
      grid: {
        left: '60px', top: '50px', right: '50px', bottom: '30px'
      },
      xAxis: {
        type: 'category',
        axisTick: {lineStyle: {type: 'solid', color: '#ccc', width: 1}},
        axisLine: {lineStyle: {type: 'solid', color: '#ccc', width: 1}},
        axisPointer: {type: 'shadow'},
        axisLabel: {color: '#071220'},
        data: xData
      },
      yAxis: {
        type: 'value',
        name: name,
        nameTextStyle: {fontSize: 12, fontFamily: 'SimSun', color: '#071220'},
        axisTick: {lineStyle: {type: 'solid', color: '#ccc', width: 1}},
        axisLine: {lineStyle: {color: '#ccc', width: 1}},
        axisLabel: {
          color: '#071220', interval: 1, fontSize: 12, fontFamily: 'Arial',
          formatter: (a) => {
            return name.includes('万') ? this.FigureService.number(a, true, true, 0) : a;
          }
        },
        splitLine: {show: false},
        splitArea: {show: true, interval: 1, areaStyle: {color: ['#f9f9f9', '#fff']}}
      },
      // 数据内容数组
      series:  (() => {
        const barScale = values.length > 1 ? '33%' : '50%';
        return values.map((s, i) => {
          return {
            type: 'bar',
            data: s,
            name: legends[i],
            barGap: '0%',
            barCategoryGap: barScale,
            label: {
              normal: {
                show: label,
                position: [0, -14],
                fontSize: 11,
                formatter: (p) => {
                  return name.includes('万') ? this.FigureService.number(p.value, true, true, 0) : this.FigureService.thousand(p.value, 0);
                }
              }
            }
          };
        });
      })()
    };

  }


  // 处理数据权限
  dataPower(data) {
    let store, category, operation, classes, district, brand, product, supplier, storeGroup;
    data.dataAccess.map(v => {
      if (v.dataAccessCode === '1') {
        store = [];
        v.accesses.map(val => {
          store.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '2') {
        category = [];
        v.accesses.map(val => {
          category.push('[' + val.code + ']' + val.name)
        });
      }
      if (v.dataAccessCode === '3') {
        operation = [];
        v.accesses.map(val => {
          operation.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '4') {
        classes = [];
        v.accesses.map(val => {
          classes.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '5') {
        district = [];
        v.accesses.map(val => {
          district.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '6') {
        brand = [];
        v.accesses.map(val => {
          brand.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '7') {
        product = [];
        v.accesses.map(val => {
          product.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '8') {
        supplier = [];
        v.accesses.map(val => {
          supplier.push('[' + val.code + ']' + val.name)
        })
      }
      if (v.dataAccessCode === '9') {
        storeGroup = [];
        v.accesses.map(val => {
          storeGroup.push('[' + val.code + ']' + val.name)
        })
      }
    });
    // if (category.length > 0 && classes.length > 0) {
    //   category = [];
    // }
    this.power[0].data = store !== undefined ? store.join(',') : [];
    this.power[1].data = classes !== undefined ? classes.join(',') : [];
    this.power[2].data = category !== undefined ? category.join(',') : [];
    this.power[3].data = operation !== undefined ? operation.join(',') : [];
    this.power[4].data = district !== undefined ? district.join(',') : [];
    this.power[5].data = brand !== undefined ? brand.join(',') : [];
    this.power[6].data = product !== undefined ? product.join(',') : [];
    this.power[7].data = supplier !== undefined ? supplier.join(',') : [];
    this.power[8].data = storeGroup !== undefined ? storeGroup.join(',') : [];

    this.anyPower = true;

    this.defPowerCondition = this.power[1].data.length && this.power[2].data.length;

    this.power.forEach(v => {
      if (v.data.length > 0) {
        this.anyPower = false;
      }
    });
  }

  // 更多
  jump(type) {

    if (type === 'sale') {
      let condition = angular.copy(this.copyCom);
      condition.comparableStores = false;
      // this.basic.setSession('fromInforToSaleState', true);
      this.basic.setLocal(this.common.local.topCondition, condition);
      // this.basic.setSession(this.common.condition, condition);
      this.$state.go("app.saleStockTop.saleStock");
    } else if (type === 'index') {
      this.copyCondition = angular.copy(this.copyCom);
      const date = moment((this.indexYear + this.indexM), 'YYYYMM').format('YYYY/MM');
      this.copyCondition.date = `${date}-${date}`;
      this.basic.setSession(this.common.condition, this.copyCondition);
      this.basic.setSession("fromHomeToIndex", true);
      this.$state.go(this.indexCompleteMenu);
    } else if (type === 'new') {
      let condition = angular.copy(this.copyCom);
      this.basic.setSession(this.common.condition, condition);
      this.$state.go("app.newItemAnalyze.newItemInfo");
    } else if (type === 'supply') {
      let condition = angular.copy(this.copyCom);
      this.basic.setSession(this.common.condition, condition);
      this.$state.go("app.supAnalyse.supplierInfo");
    }

  }

  // 上边两个弹出框
  showInforClick() {
    this.showInfor = !this.showInfor;
    this.showPower = false;
    this.clickArea = true;
  }

  showPowerClick() {
    this.showPower = !this.showPower;
    this.showInfor = false;
    this.clickArea = true;
  }

  showClick() {
    if (this.clickArea) {
      this.clickArea = false;
    } else {
      this.showPower = false;
      this.showInfor = false;
    }
  }

  // 消息头部
  getLatestSystemInfo() {
    this.basic.packager(this.dataService.getLatestSystemInfo(), res => {

      this.inforArray = res.data && res.data.length ?
        res.data.map(d => {
          d.dateCode = moment(d.dateCode, 'YYYYMMDD').format('YYYY/MM/DD');
          if (d.title.includes('\\r\\n'))
            d.title = d.title.split('\\r\\n').join('\n');
          if (d.content.includes('\\r\\n'))
            d.content = d.content.split('\\r\\n').join('\n');
          return d;
        }) : [];

    });
  }

  addEvent(param, chartID) {
    let myCharts = echarts.getInstanceByDom(document.getElementById(chartID));
    myCharts.dispatchAction({
      type: 'legendSelect',
      name: param.name
    });

    myCharts.getOption().series.forEach((s, i) => {
      myCharts.dispatchAction({
        type: 'highlight',
        seriesIndex: i,
        name: param.name
      });
    })
  }

  /*@ param search*/
  search() {

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);
    if (this.com.operation.val.length > 0 || this.com.district.val.length > 0 || this.com.store.val.length > 0) {
      this.storeSearch = true;
    }else {
      this.storeSearch = false;
    }
    // 柱状图loading
    this.chartLoadOne += 1;
    this.chartLoadTwo += 1;
    this.chartLoadThree += 1;
    this.chartLoadFour += 1;
    this.chartLoadFive += 1;
    this.chartLoadSix += 1;

    this.copyCom = angular.copy(this.com);

    this.start();
    this.underRequest();

  }

  openStoreList() {
    const promise = this.popupData.openStore({selected: this.com.store.val});
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
}


angular.module('app.home').controller('HomeController', HomeController);
