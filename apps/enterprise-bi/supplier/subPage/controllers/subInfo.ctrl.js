class SubInfoController {
  constructor(CommonCon, toolService, SaleStockSubMenu, popups, Common, dataService, popupDataService,
              Table, Chart, basicService, $scope, $state, $stateParams, $rootScope, $sce, FigureService, Pop, $templateCache, indexCompleteService) {
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
    this.indexService = indexCompleteService;
    this.$sce = $sce;
    this.figureService = FigureService;
    this.stateJump = $state;


    this.menu = angular.copy(SaleStockSubMenu);
    this.types = angular.copy(CommonCon.types);

    this.key = {
      active: 1,
      finish: false,
    };

    // 日期控件配置
    this.dateOption = {};

    // 保存共通指标的地方
    this.field = {};

    // 保存共通条件的地方
    this.com = Object.assign({date: "", comparableStores: false}, CommonCon.commonPro);

    this.saleType = [
      {id: 'allAmount', name: '按销售额', active: true},
      {id: 'allNum', name: '按销售数', active: false}
    ];

    this.saleMode = this.saleType[0].id;

    this.profitType = [
      {id: 'amount', name: '按毛利额', active: true},
      {id: 'rate', name: '按毛利率', active: false}
    ];

    this.allType = [
      {id: 'yoy', name: '对比同期', active: true},
      {id: 'son', name: '对比子类平均', active: false}
    ];

    this.allMode = this.allType[0].id;

    this.profitMode = this.profitType[0].id;


    this.lackDay = `${$templateCache.get(`lackDay.html`)}`;


    this.receiveQtyRate = `${$templateCache.get(`receiveQtyRate.html`)}`;

    this.returnAmountRate = `${$templateCache.get(`returnAmountRate.html`)}`;

    this.sonAvg = `${$templateCache.get(`sonAvg.html`)}`;

    this.fresh = `${$templateCache.get(`fresh.html`)}`;

    this.selfBrand = `${$templateCache.get(`selfBrand.html`)}`;

    // 上边的销售信息
    this.saleData = ['-', '-', '-', '-'];


    //供货信息
    this.supportProductInfor = {
      avgDays: "-",
      directPassPct: "-",
      areaAssignPct: "-",
      directSendPct: "-",
      middleTransferPct: "-",
      nonAmount: "-",
      nonAmountY: "-",
      offsetDays: "-",
      orderAmount: "-",
      orderQty: "-",
      receiveChkAmount: "-",
      receiveChkQty: "-",
      receiveQtyRate: "-",
      receiveRealAmount2: "-",
      returnAmount: "-",
      returnAmountRate: "-",
      uniteAssignPct: "-",
    };

    //加注缺品信息
    this.stockOutProductInfor = {
      avgStockOutDays: "-",
      stockOutDays: "-",
      stockOutSku: "-",
      stockOutSkuA: "-",
      stockOutSkuAPct: "-",
    };

    this.power = [
      {name: '门店', data: []},
      {name: '类别', data: []},
      {name: '业态', data: []},
      {name: '品类组', data: []},
      {name: '地区', data: []},
      {name: '品牌', data: []},
      {name: '商品', data: []},
      {name: '供应商', data: []},
      {name: '店群', data: []},
    ];

    // 库存信息
    this.supplierRankInfoStock = {
      saleDays: '-',
      saleDaysYoYValue: '-',
      saleDaysYoY: '',
      saleDaysYoYC: '',
      stockCost: '-',
      // stockCost: '-',
      stockCostYoYValue: '-',
      stockCostYoYValueY: '-',
      stockCostYoY: '',
      stockCostYoYC: '',
      stockQty: '-',
      stockQtyYoYValue: '-',
      stockQtyYoY: '',
      stockQtyYoYC: '',
      rank: '-',
      stockCostLatest: '-',
      stockCostLatestY: '-',
      stockQtyLatest: '-',
      saleDaysSupplierAdvantageInc: '-',
      saleDaysLatest: '-'
    };

    // 收益信息 左侧
    this.supplierRankInfoProfit = {
      allProfit: '-',
      allProfitY: '-',
      allProfitYoYValue: '-',
      allProfitYoYValueY: '-',
      allProfitYoY: '',
      allProfitYoYC: '',
      allProfitRate: '-',
      allProfitRateYoYValue: '-',
      allProfitRateYoYInc: '',
      allProfitRateYoYIncC: '',

    };

    //收益信息 右侧 job判断
    this.supplierRankInfoProfitRightJob = {
      jobChannelRealAmount: '-',
      jobChannelRealAmountY: '-',
      jobChannelRealAmountYoYValue: '-',
      jobChannelRealAmountYoYValueY: '-',
      jobChannelRealAmountYoY: '',
      jobChannelRealAmountYoYC: '',
      jobChannelPendingAmount: '-',
      jobChannelPendingAmountY: '-',
      jobBizCompIncomeAmount: '-',
      jobBizCompIncomeAmountY: '-',
      jobBizCompIncomeAmountYoYValue: '-',
      jobBizCompIncomeAmountYoYValueY: '-',
      jobBizCompIncomeAmountYoY: '',
      jobBizCompIncomeAmountYoYC: '',
    };

    this.radarData = {
      self: ['-', '-', '-','-', '-', '-'],
      yoy: ['-', '-', '-','-', '-', '-'],
      son: ['-', '-', '-','-', '-', '-'],
    };

    // 总体表现 右侧数据
    this.selfData = ['-', '-', '-','-', '-', '-','-'];
    this.yoyData = ['-', '-', '-','-', '-', '-','-'];
    this.sonData = ['-', '-', '-','-', '-', '-','-'];

    this.radarDataSelf = ['-', '-', '-'];

    this.radarName = [
      {name: '销售额'},
      {name: '毛利率'},
      {name: '经销周转天数'},
      {name: '平均加注缺品天数'},
      {name: '到货率'},
      {name: '退货率'},
    ];
    this.otherRadarName = '同期值';

    this.indexRadarYoY = [];
    this.indexRadarSon = [];
  }

  init() {
    // 获取路由参数的值用于子菜单渲染
    this.info = this.tool.subMenuInfo(this.state);

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 监听订阅的事件
    this.tool.onEvent(this);
  }


  initialize(data) {

    this.inited = true;

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);
    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 初始化com 和 subSession的值 返回fromSession
    const subPage = this.tool.subPageCondition(this.com);
    this.fromSession = subPage.fromSession;

    if (subPage.com) {
      this.com.supplier = subPage.com.supplier;
    }

    this.dataPower(data);
    this.tool.pageInit(this, () => {
      this.getDate();
    });


    this.leftMenu = this.basic.getSession(this.common.leftMenu);

    for (let i = 0; i < this.leftMenu.length; i++) {
      let dic = this.leftMenu[i];
      let array = dic.children;
      for (let j = 0; j < array.length; j++) {
        let child = array[j];
        if (child.resUrl === 'app.supAnalyse.supplierSupply') {
          this.subSupply = true;
        }else  if (child.resUrl === 'app.supAnalyse.supplierLack') {
          this.subLack = true;
        }
      }
    }

    this.scope.$watch('ctrl.root.leftMenu', (newVal) => {
      if (!newVal) return;
      this.leftMenu = newVal;
      for (let i = 0; i < this.leftMenu.length; i++) {
        let dic = this.leftMenu[i];
        let array = dic.children;
        for (let j = 0; j < array.length; j++) {
          let child = array[j];
          if (child.resUrl === 'app.supAnalyse.supplierSupply') {
            this.subSupply = true;
          }else  if (child.resUrl === 'app.supAnalyse.supplierLack') {
            this.subLack = true;
          }
        }
      }
    });

  }

  getDate() {
    // 获取初始化日期
    this.basic.packager(this.dataService.getBaseDate(), res => {

      this.baseDate = res.data.baseDate;
      this.year = parseInt(String(this.baseDate).slice(0, 4));
      this.day = String(this.baseDate).slice(4, 8);
      this.lastYear = this.year - 1;
      this.dayString = moment(res.data.baseDate, 'YYYYMMDD').format('MM/DD');
      this.now = '年至今' + '01/01' + '~' + this.dayString;

      this.basic.packager(this.dataService.getMonthByDate(this.baseDate), resp => {

        //接口所需要的按月查询的月份01-09
        this.com.date = this.year + '01-' + resp.data.businessMonth;
        this.scope.$watch('ctrl.saleMode', (newVal, oldVal) => {
          if (!oldVal) return;
          if (newVal === oldVal) return;
          this.getSupplierRankInfoSale(newVal);
        });

        this.loadOne = true;

        this.scope.$watch('ctrl.radarData', (n_val,o_val) => {
          // 判断返回值是否定义
          const [ _Title, _Name_son, _Name_yoy] = [
            {
              title: {
                text: '供应商总体表现',
                textStyle:{color:'black', fontStyle:'normal', fontWeight:'bold', fontFamily:'sans-serif', fontSize:14}
              }
            },
            ['单品销售额','毛利率','经销周转率','平均加注缺品天数','到货率','退货率'],
            ['销售额','毛利率','经销周转率','平均加注缺品天数','到货率','退货率'],
          ];

          let [ base_Arr, toolArr, basicKey] = [ [], [], {
              show_legend:false,
              storeName: [this.com.supplier.val[0].name,this.otherRadarName],
            }
          ];
          // 经销周转率特殊处理
          let _disRate_one,_disRate_two;

          if (this.allMode === 'son') {
            if(!(this.radarData.self.includes('-'))  && !(this.radarData.son.includes('-'))) {
              this.otherRadarName = '子类平均值';
              _disRate_two = !isFinite(1/this.indexService.Def(this.radarData.son[2]))
                ? 1
                : 1/this.radarData.son[2];
              _disRate_one = this.indexService.distributeDay(this.radarData.self[2],this.radarData.son[2]);

              _.forEach(_Name_son, (s,i) => {
                // 重构雷达图数据
                if(i === 2){
                  base_Arr.push([_disRate_one,_disRate_two]);
                }else{
                  base_Arr.push([
                    this.radarData.self[i] ?  this.radarData.self[i] : 0,
                    this.radarData.son[i] ? this.radarData.son[i] : 0
                  ]);
                }
                // 构造tooltip 数据
                toolArr.push({ name: s, value: [
                  this.indexService.Def(this.radarData.self[i],true),
                  this.indexService.Def(this.radarData.son[i],true)
                ]})
              });

              const _objTool = { one: this.selfData, two: this.sonData };
              let obj_Basic_SoN = Object.assign(
                { conf_name: _Name_son, base_Arr: base_Arr, tool_Date: toolArr, sup_tool_Date: this.indexService.toolArrArr(this,_Name_yoy,_objTool), },
                basicKey
              );
              this.radar = Object.assign(_Title,this.indexService.DefineRadar(obj_Basic_SoN));
            }
          }else {
            if(!(this.radarData.self.includes('-')) && !(this.radarData.yoy.includes('-'))) {
              this.otherRadarName = '同期值';

              _disRate_two = !isFinite(1/this.indexService.Def(this.radarData.yoy[2]))
                ? 1
                : 1/this.radarData.yoy[2];
              _disRate_one = this.indexService.distributeDay(this.radarData.yoy[2],this.radarData.self[2]);
              _.forEach(_Name_yoy, (s,i) => {
                // 重构雷达图数据
                if(i === 2){
                  base_Arr.push([_disRate_one,_disRate_two]);
                }else{
                  base_Arr.push([
                    this.radarData.self[i] ?  this.radarData.self[i] : 0,
                    this.radarData.yoy[i] ? this.radarData.yoy[i] : 0
                  ]);
                }
                // 构造tooltip 数据
                toolArr.push({ name: s, value: [
                  this.indexService.Def(this.radarData.self[i],true),
                  this.indexService.Def(this.radarData.yoy[i],true)
                ]})

              });
              const _objTool = { one: this.selfData, two: this.yoyData };
              let obj_Basic_YoY = Object.assign(
                {  conf_name: _Name_yoy, base_Arr: base_Arr, tool_Date: toolArr, sup_tool_Date: this.indexService.toolArrArr(this,_Name_yoy,_objTool)},
                basicKey
              );
              this.radar = Object.assign(_Title,this.indexService.DefineRadar(obj_Basic_YoY));
            }
          }
        }, true);

        this.scope.$watch('ctrl.allMode', (newVal, oldVal) => {
          if (newVal === oldVal) return;
          if(newVal === 'son') {
            this.radarName = [
              {name: '单品销售额'},
              {name: '毛利率'},
              {name: '经销周转天数'},
              {name: '平均加注缺品天数'},
              {name: '到货率'},
              {name: '退货率'},

            ];
            if (this.loadOne) {
              //总体表现 对比子类平均
              this.getCompareCategoryData();
              // 总体表现 供应商自身
              this.getSupplierSummaryData();
            }else {
              // 雷达图
              this.radarData.self[0] = this.radarDataSelf[2];
            }
          }else  {
            this.radarName = [
              {name: '销售额'},
              {name: '毛利率'},
              {name: '经销周转天数'},
              {name: '平均加注缺品天数'},
              {name: '到货率'},
              {name: '退货率'},

            ];
            // 雷达图
            this.radarData.self[0] = this.radarDataSelf[3];

          }
        }, true);


        // 请求销售信息
        this.getSupplierRankInfoSale(this.saleMode);

        // 请求收益信息
        this.getSupplierRankInfoProfitLeft();


        this.getSupplierRankInfoProfitRight();

        // 请求库存信息
        this.getSupplierRankInfoStock();

        // 请求供货信息
        this.getSupplyDataSummary();

        // 请求缺货信息
        this.getSubLack();

      });

    });
  }

  // 总体表现 供应商自身
  getSupplierSummaryData(){
    const com = angular.copy(this.com);
    let f = ["avgSkuAllAmount"];
    const param = this.tool.buildParam(this.tool.getParam(com, f));
    this.basic.packager(this.dataService.getSupplierSummaryData(param), res => {
      let data = res["data"];
      if (data){
        this.radarDataSelf[0] = this.figureService.number(data.avgSkuAllAmount, true, true);
        this.radarDataSelf[1] = this.figureService.number(data.avgSkuAllAmount, false, true);
        this.radarDataSelf[2] = data.avgSkuAllAmount;
        this.radarData.self[0] = data.avgSkuAllAmount < 0 ? null : data.avgSkuAllAmount;
      }
    });
  }

  //总体表现 对比子类平均
  getCompareCategoryData() {
    const com = angular.copy(this.com);
    let f = ["avgSkuAllAmount","allProfitRate","saleDays","receiveQtyRate","returnAmountRate","avgStockOutDays"];
    const param = this.tool.buildParam(this.tool.getParam(com, f));
    this.basic.packager(this.dataService.getCompareCategoryData(param), res => {
      let data = res["data"];
      if (data){
        this.radarData.son[0] = data.avgSkuAllAmount < 0 ? null : data.avgSkuAllAmount;
        this.radarData.son[1] = data.allProfitRate < 0 ? null : data.allProfitRate;
        this.radarData.son[2] = data.saleDays < 0 ? null : data.saleDays;
        this.radarData.son[3] = data.avgStockOutDays < 0 ? null : data.avgStockOutDays;
        this.radarData.son[4] = data.receiveQtyRate < 0 ? null : data.receiveQtyRate;
        this.radarData.son[5] = data.returnAmountRate < 0 ? null : data.returnAmountRate;


        this.sonData[0] = this.figureService.number(data.avgSkuAllAmount, true, true);
        this.sonData[1] = this.figureService.number(data.avgSkuAllAmount, false, true);
        this.sonData[2] = this.figureService.scale(data.allProfitRate, true, true);
        this.sonData[3] = this.figureService.number(data.saleDays, false, true);
        this.sonData[4] = this.figureService.scale(data.receiveQtyRate, true, true);
        this.sonData[5] = this.figureService.scale(data.returnAmountRate, true, true);
        this.sonData[6] = this.figureService.number(data.avgStockOutDays, false, true);

        this.loadOne = false;

      }
    });

  }


  // 收益信息 左侧上下
  getSupplierRankInfoProfitLeft() {

    const com = angular.copy(this.com);
    let f = [

      "allProfit",
      "allProfitYoYValue",
      "allProfitYoY",
      "allProfitRate",
      "allProfitRateYoYValue",
      "allProfitRateYoYInc",
      "distributionOfAllProfit",
      "jointOfAllProfit",
      "retailOfAllProfit",
      "wholeOfAllProfit",
      "selfBrandOfAllProfit",
      "freshOfAllProfit"
    ];

    const param = this.tool.buildParam(this.tool.getParam(com, f));
    this.basic.packager(this.dataService.getSupplierSummaryData(param), res => {
      let data = res["data"];
      if (data){
        this.supplierRankInfoProfit.allProfit = this.figureService.number(data.allProfit, true, true);
        this.supplierRankInfoProfit.allProfitY = this.figureService.number(data.allProfit, false, true);
        this.supplierRankInfoProfit.allProfitYoYValue = this.figureService.number(data.allProfitYoYValue, true, true);
        this.supplierRankInfoProfit.allProfitYoYValueY = this.figureService.number(data.allProfitYoYValue, false, true);
        this.supplierRankInfoProfit.allProfitYoYC = this.figureService.scale(data.allProfitYoY, true, true);
        this.supplierRankInfoProfit.allProfitYoY = data.allProfitYoY;

        this.supplierRankInfoProfit.allProfitRate = this.figureService.scale(data.allProfitRate, true, true);
        this.supplierRankInfoProfit.allProfitRateYoYValue = this.figureService.scale(data.allProfitRateYoYValue, true, true);
        this.supplierRankInfoProfit.allProfitRateYoYIncC = this.figureService.scale(data.allProfitRateYoYInc, true, false);
        this.supplierRankInfoProfit.allProfitRateYoYInc = data.allProfitRateYoYInc;

        this.supplierRankInfoProfit.distributionOfAllProfit = this.figureService.scale(data.distributionOfAllProfit, true, true);
        this.supplierRankInfoProfit.jointOfAllProfit = this.figureService.scale(data.jointOfAllProfit, true, true);
        this.supplierRankInfoProfit.retailOfAllProfit = this.figureService.scale(data.retailOfAllProfit, true, true);
        this.supplierRankInfoProfit.wholeOfAllProfit = this.figureService.scale(data.wholeOfAllProfit, true, true);
        this.supplierRankInfoProfit.selfBrandOfAllProfit = this.figureService.scale(data.selfBrandOfAllProfit, true, true);
        this.supplierRankInfoProfit.freshOfAllProfit = this.figureService.scale(data.freshOfAllProfit, true, true);

        this.radarData.self[1] =  data.allProfitRate < 0 ? null : data.allProfitRate;
        this.radarData.yoy[1] = data.allProfitRateYoYValue < 0 ? null : data.allProfitRateYoYValue;

        this.selfData[2] = this.supplierRankInfoProfit.allProfitRate;
        this.yoyData[2] = this.supplierRankInfoProfit.allProfitRateYoYValue;

      }else {

        this.radarData.self[1] =  null;
        this.radarData.yoy[1] = null;
      }

    });
  }


  // 收益信息 右侧
  getSupplierRankInfoProfitRight() {

    const com = angular.copy(this.com);

    let f;
    if (this.job === "buyer") {

      this.jobTitleOne = '(采购实收)';
      this.jobTitleTwo = '(采购)';

      f = [
        "buyerChannelSettleAmount",
        "buyerChannelSettleAmountYoYValue",
        "buyerChannelSettleAmountYoY",
        "buyerChannelPendingAmount",
        "buyerBizCompIncomeAmount",
        "buyerBizCompIncomeAmountYoYValue",
        "buyerBizCompIncomeAmountYoY",
      ];

    } else if (this.job === "store") {

      this.jobTitleOne = '(营运实收)';
      this.jobTitleTwo = '(营运)';
      f = [
        "storeChannelSettleAmount",
        "storeChannelSettleAmountYoYValue",
        "storeChannelSettleAmountYoY",
        "storeChannelPendingAmount",
        "storeBizCompIncomeAmount",
        "storeBizCompIncomeAmountYoYValue",
        "storeBizCompIncomeAmountYoY",
      ];

    } else {

      this.jobTitleOne = '(实收)';
      this.jobTitleTwo = '';
      f = [
        "channelSettleAmountTotal",
        "channelSettleAmountTotalYoYValue",
        "channelSettleAmountTotalYoY",
        "channelPendingAmountTotal",
        "allBizCompIncomeAmount",
        "allBizCompIncomeAmountYoYValue",
        "allBizCompIncomeAmountYoY",

      ];
    }

    const param = this.tool.buildParam(this.tool.getParam(com, f));
    this.basic.packager(this.dataService.getSupplierSummaryData(param), res => {
      let data = res["data"];
      if (!data) return;

      if (this.job === "buyer") {

        this.supplierRankInfoProfitRightJob.jobChannelRealAmount = this.figureService.number(data.buyerChannelSettleAmount, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountY = this.figureService.number(data.buyerChannelSettleAmount, false, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoYValue = this.figureService.number(data.buyerChannelSettleAmountYoYValue, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoYValueY = this.figureService.number(data.buyerChannelSettleAmountYoYValue, false, true);
        this.supplierRankInfoProfitRightJob.jobChannelPendingAmount = this.figureService.number(data.buyerChannelPendingAmount, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelPendingAmountY = this.figureService.number(data.buyerChannelPendingAmount, false, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmount = this.figureService.number(data.buyerBizCompIncomeAmount, true, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountY = this.figureService.number(data.buyerBizCompIncomeAmount, false, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoYValue = this.figureService.number(data.buyerBizCompIncomeAmountYoYValue, true, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoYValueY = this.figureService.number(data.buyerBizCompIncomeAmountYoYValue, false, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoYC = this.figureService.scale(data.buyerChannelSettleAmountYoY, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoY = data.buyerChannelSettleAmountYoY;
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoYC = this.figureService.scale(data.buyerBizCompIncomeAmountYoY, true, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoY = data.buyerBizCompIncomeAmountYoY;


      } else if (this.job === "store") {

        this.supplierRankInfoProfitRightJob.jobChannelRealAmount = this.figureService.number(data.storeChannelSettleAmount, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountY = this.figureService.number(data.storeChannelSettleAmount, false, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoYValue = this.figureService.number(data.storeChannelSettleAmountYoYValue, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoYValueY = this.figureService.number(data.storeChannelSettleAmountYoYValue, false, true);
        this.supplierRankInfoProfitRightJob.jobChannelPendingAmount = this.figureService.number(data.storeChannelPendingAmount, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelPendingAmountY = this.figureService.number(data.storeChannelPendingAmount, false, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmount = this.figureService.number(data.storeBizCompIncomeAmount, true, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountY = this.figureService.number(data.storeBizCompIncomeAmount, false, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoYValue = this.figureService.number(data.storeBizCompIncomeAmountYoYValue, true, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoYValueY = this.figureService.number(data.storeBizCompIncomeAmountYoYValue, false, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoYC = this.figureService.scale(data.storeChannelSettleAmountYoY, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoY = data.storeChannelSettleAmountYoY;
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoYC = this.figureService.scale(data.storeBizCompIncomeAmountYoY, true, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoY = data.storeBizCompIncomeAmountYoY;



      } else {


        this.supplierRankInfoProfitRightJob.jobChannelRealAmount = this.figureService.number(data.channelSettleAmountTotal, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountY = this.figureService.number(data.channelSettleAmountTotal, false, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoYValue = this.figureService.number(data.channelSettleAmountTotalYoYValue, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoYValueY = this.figureService.number(data.channelSettleAmountTotalYoYValue, false, true);
        this.supplierRankInfoProfitRightJob.jobChannelPendingAmount = this.figureService.number(data.channelPendingAmountTotal, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelPendingAmountY = this.figureService.number(data.channelPendingAmountTotal, false, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmount = this.figureService.number(data.allBizCompIncomeAmount, true, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountY = this.figureService.number(data.allBizCompIncomeAmount, false, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoYValue = this.figureService.number(data.allBizCompIncomeAmountYoYValue, true, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoYValueY = this.figureService.number(data.allBizCompIncomeAmountYoYValue, false, true);

        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoYC = this.figureService.scale(data.channelSettleAmountTotalYoY, true, true);
        this.supplierRankInfoProfitRightJob.jobChannelRealAmountYoY = data.channelSettleAmountTotalYoY;
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoYC = this.figureService.scale(data.allBizCompIncomeAmountYoY, true, true);
        this.supplierRankInfoProfitRightJob.jobBizCompIncomeAmountYoY = data.allBizCompIncomeAmountYoY;


      }
    });


  }

  // 销售信息 type: allMount allUnit
  getSupplierRankInfoSale(type) {

    const com = angular.copy(this.com);
    let f = type === 'allAmount' ? [
      "allAmount",
      "allAmountYoYValue",
      "allAmountYoY",
      "distributionOfAllAmount",
      "jointOfAllAmount",
      "retailOfAllAmount",
      "wholeOfAllAmount",
      "selfBrandOfAllAmount",
      "freshOfAllAmount",
    ] : [
      "allUnit",
      "allUnitYoYValue",
      "allUnitYoY",
      "distributionOfAllUnit",
      "jointOfAllUnit",
      "retailOfAllUnit",
      "wholeOfAllUnit",
      "selfBrandOfAllUnit",
      "freshOfAllUnit",
    ];

    this.supplierRankInfoSale = {
      allAmount: '-',
      allAmountY: '-',
      allAmountYoYValue: '-',
      allAmountYoYValueY: '-',
      allAmountYoY: '',
      allAmountYoYC: '',
      distributionAmountOfLH: '-',
      jointAmountOfLH: '-',
      retailAmountOfLH: '-',
      wholeAmountOfLH: '-',
      selfBrandOfAllAmount: '-',
      freshOfAllAmount: '-',
    };

    this.supplierRankInfoUnit = {
      allUnit: '-',
      allUnitYoYValue: '-',
      allUnitYoY: '',
      allUnitYoYC: '',
      distributionUnitOfLH: '-',
      jointUnitOfLH: '-',
      retailUnitOfLH: '-',
      wholeUnitOfLH: '-',
      selfBrandOfAllUnit: '-',
      freshOfAllUnit: '-',
    };


    const param = this.tool.buildParam(this.tool.getParam(com, f));
    this.basic.packager(this.dataService.getSupplierSummaryData(param), res => {

      if (type === 'allAmount') {
        let data = res["data"];
        if (data) {
          this.supplierRankInfoSale.allAmount = this.figureService.number(data.allAmount, true, true);
          this.supplierRankInfoSale.allAmountY = this.figureService.number(data.allAmount, false, true);
          this.supplierRankInfoSale.allAmountYoYValue = this.figureService.number(data.allAmountYoYValue, true, true);
          this.supplierRankInfoSale.allAmountYoYValueY = this.figureService.number(data.allAmountYoYValue, false, true);
          this.supplierRankInfoSale.allAmountYoYC = this.figureService.scale(data.allAmountYoY, true, true);
          this.supplierRankInfoSale.allAmountYoY = data.allAmountYoY;
          this.supplierRankInfoSale.distributionAmountOfLH = this.figureService.scale(data.distributionOfAllAmount, true, true);
          this.supplierRankInfoSale.jointAmountOfLH = this.figureService.scale(data.jointOfAllAmount, true, true);
          this.supplierRankInfoSale.retailAmountOfLH = this.figureService.scale(data.retailOfAllAmount, true, true);
          this.supplierRankInfoSale.wholeAmountOfLH = this.figureService.scale(data.wholeOfAllAmount, true, true);
          this.supplierRankInfoSale.selfBrandOfAllAmount = this.figureService.scale(data.selfBrandOfAllAmount, true, true);
          this.supplierRankInfoSale.freshOfAllAmount = this.figureService.scale(data.freshOfAllAmount, true, true);
          this.radarData.self[0] = data.allAmount < 0 ? null : data.allAmount;
          this.radarData.yoy[0] = data.allAmountYoYValue < 0 ? null : data.allAmountYoYValue;

          this.selfData[0] = this.supplierRankInfoSale.allAmount;
          this.selfData[1] = this.supplierRankInfoSale.allAmountY;
          this.yoyData[0] = this.supplierRankInfoSale.allAmountYoYValue;
          this.yoyData[1] = this.supplierRankInfoSale.allAmountYoYValueY;

          this.radarDataSelf[3] = data.allAmount;
        }else {

          this.radarData.self[0] = null;
          this.radarData.yoy[0] = null;
          this.radarDataSelf[3] = null;
        }

      } else {
        let data = res["data"];
        if (!data) return;
        this.supplierRankInfoUnit.allUnit = this.figureService.number(data.allUnit, false, true);
        this.supplierRankInfoUnit.allUnitYoYValue = this.figureService.number(data.allUnitYoYValue, false, true);
        this.supplierRankInfoUnit.allUnitYoYC = this.figureService.scale(data.allUnitYoY, true, true);
        this.supplierRankInfoUnit.allUnitYoY = data.allUnitYoY;
        this.supplierRankInfoUnit.distributionUnitOfLH = this.figureService.scale(data.distributionOfAllUnit, true, true);
        this.supplierRankInfoUnit.jointUnitOfLH = this.figureService.scale(data.jointOfAllUnit, true, true);
        this.supplierRankInfoUnit.retailUnitOfLH = this.figureService.scale(data.retailOfAllUnit, true, true);
        this.supplierRankInfoUnit.wholeUnitOfLH = this.figureService.scale(data.wholeOfAllUnit, true, true);
        this.supplierRankInfoUnit.selfBrandOfAllUnit = this.figureService.scale(data.selfBrandOfAllUnit, true, true);
        this.supplierRankInfoUnit.freshOfAllUnit = this.figureService.scale(data.freshOfAllUnit, true, true);

      }
    });

  }

  // 库存信息
  getSupplierRankInfoStock() {

    const com = angular.copy(this.com);
    let f = [
      "saleDays",
      "saleDaysLatest",
      "saleDaysYoYValue",
      "saleDaysYoYInc",
      "stockCost",
      "stockCostYoYValue",
      "stockCostYoY",
      "stockQty",
      "stockQtyYoYValue",
      "stockQtyYoY",
      "stockCostLatest",
      "stockQtyLatest",

    ];
    const param = this.tool.buildParam(this.tool.getParam(com, f));
    this.basic.packager(this.dataService.getSupplierSummaryData(param), res => {
      let data = res["data"];
      if (data){
        this.supplierRankInfoStock.saleDays = this.figureService.number(data.saleDays, false, true);
        this.supplierRankInfoStock.saleDaysLatest = this.figureService.number(data.saleDaysLatest, false, true);

        this.supplierRankInfoStock.saleDaysYoYValue = this.figureService.number(data.saleDaysYoYValue, false, true);
        this.supplierRankInfoStock.saleDaysYoYC = this.figureService.number(data.saleDaysYoYInc, false, true);
        this.supplierRankInfoStock.saleDaysYoY = data.saleDaysYoYInc;

        this.supplierRankInfoStock.stockCost = this.figureService.number(data.stockCost, true, true);
        this.supplierRankInfoStock.stockCostY = this.figureService.number(data.stockCost, false, true);
        this.supplierRankInfoStock.stockCostYoYValue = this.figureService.number(data.stockCostYoYValue, true, true);
        this.supplierRankInfoStock.stockCostYoYValueY = this.figureService.number(data.stockCostYoYValue, false, true);
        this.supplierRankInfoStock.stockCostYoYC = this.figureService.scale(data.stockCostYoY, true, true);
        this.supplierRankInfoStock.stockCostYoY = data.stockCostYoY;

        this.supplierRankInfoStock.stockQty = this.figureService.number(data.stockQty, false, true);
        this.supplierRankInfoStock.stockQtyYoYValue = this.figureService.number(data.stockQtyYoYValue, false, true);
        this.supplierRankInfoStock.stockQtyYoYC = this.figureService.scale(data.stockQtyYoY, true, true);
        this.supplierRankInfoStock.stockQtyYoY = data.stockQtyYoY;

        this.supplierRankInfoStock.stockCostLatest = this.figureService.number(data.stockCostYoYValue, true, true);
        this.supplierRankInfoStock.stockCostLatestY = this.figureService.number(data.stockCostYoYValue, false, true);
        this.supplierRankInfoStock.stockQtyLatest = this.figureService.number(data.stockQtyLatest, false, true);

        this.radarData.self[2] = data.saleDays < 0 ? null : data.saleDays;
        this.radarData.yoy[2] = data.saleDaysYoYValue < 0 ? null : data.saleDaysYoYValue;

        this.selfData[3] = this.supplierRankInfoStock.saleDays;
        this.yoyData[3] = this.supplierRankInfoStock.saleDaysYoYValue;
      }else {
        this.radarData.self[2] = null;
        this.radarData.yoy[2] = null;
      }
    });


  }


  // 供货信息 供应商自身
  getSupplyDataSummary() {

    const com = angular.copy(this.com);
    let f = [
      "receiveQtyRate", "nonAmount", "returnAmount", "returnAmountRate",
      "middleTransferPct", "uniteAssignPct", "directSendPct", "directPassPct", "areaAssignPct"
    ];
    const param = this.tool.buildParam(this.tool.getParam(com, f));
    this.basic.packager(this.dataService.getSupplyDataByLogisticsMode(param), res => {
      let data = res["data"]["summary"];
      if (data){
        this.supportProductInfor.returnAmountRate = this.figureService.scale(data.returnAmountRate, true, true);
        this.supportProductInfor.receiveQtyRate = this.figureService.scale(data.receiveQtyRate, true, true);
        this.supportProductInfor.nonAmount = this.figureService.number(data.nonAmount, true, true);
        this.supportProductInfor.nonAmountY = this.figureService.number(data.nonAmount, false, true);
        this.supportProductInfor.middleTransferPct = this.figureService.scale(data.middleTransferPct, true, true);
        this.supportProductInfor.uniteAssignPct = this.figureService.scale(data.uniteAssignPct, true, true);
        this.supportProductInfor.directSendPct = this.figureService.scale(data.directSendPct, true, true);
        this.supportProductInfor.directPassPct = this.figureService.scale(data.directPassPct, true, true);
        this.supportProductInfor.areaAssignPct = this.figureService.scale(data.areaAssignPct, true, true);
        this.supportProductInfor.returnAmount = this.figureService.number(data.retNet, true, true);
        this.supportProductInfor.returnAmountY = this.figureService.number(data.retNet, false, true);
        this.radarData.self[4] = data.receiveQtyRate < 0 ? null : data.receiveQtyRate;
        this.radarData.self[5] = data.returnAmountRate < 0 ? null : data.returnAmountRate;

        this.selfData[4] = this.supportProductInfor.receiveQtyRate;
        this.selfData[5] = this.supportProductInfor.returnAmountRate;
      }else {
        this.radarData.self[4] = null;
        this.radarData.self[5] = null;
      }
    });
    this.getSupplyDataSummaryLast();
  }

  // 供货信息 供应商同期值
  getSupplyDataSummaryLast() {

    const com = angular.copy(this.com);
    com.date = com.date.replace(this.year + null, this.lastYear + '');
    com.date = com.date.replace(this.year + '', this.lastYear + '');

    let f = ["receiveQtyRate", "returnAmountRate"];
    const param = this.tool.buildParam(this.tool.getParam(com, f));
    this.basic.packager(this.dataService.getSupplyDataSummary(param), res => {
      let data = res["data"]["summary"];
      if (data){
        this.radarData.yoy[4] = data.receiveQtyRate < 0 ? null : data.receiveQtyRate;
        this.radarData.yoy[5] = data.returnAmountRate < 0 ? null : data.returnAmountRate;

        this.yoyData[4] = this.figureService.scale(data.receiveQtyRate, true, true);
        this.yoyData[5] = this.figureService.scale(data.returnAmountRate, true, true);
      }else {
        this.radarData.yoy[4] = null;
        this.radarData.yoy[5] = null;
      }
    });
  }

  // 加注缺品信息 供应商自身
  getSubLack() {

    const com = angular.copy(this.com);
    com.date = "" + this.year + '0101' + '-' + "" + this.year + this.day;
    let fields = ["avgStockOutDays", "stockOutSkuAPct"];
    const params = this.tool.buildParam(this.tool.getParam(com, fields));
    this.basic.packager(this.dataService.getSubLack(params), res => {

      let data = res["data"]["summary"];
      if (data){
        this.stockOutProductInfor.stockOutSku = this.figureService.isDefine(data.stockOutSku);
        this.stockOutProductInfor.avgStockOutDays = this.figureService.number(data.avgStockOutDays, false, true);
        this.stockOutProductInfor.stockOutSkuAPct = this.figureService.scale(data.stockOutSkuAPct, true, true);
        this.stockOutProductInfor.stockOutDays = this.figureService.isDefine(data.stockOutDays);
        this.radarData.self[3] = data.avgStockOutDays < 0 ? null : data.avgStockOutDays;

        this.selfData[6] = this.stockOutProductInfor.avgStockOutDays;
      }else {
        this.radarData.self[3] = null;
      }

    });
    this.getSubLackLast();
  }

  // 加注缺品信息 供应商自身同期值
  getSubLackLast() {

    const com = angular.copy(this.com);
    com.date = "" + this.lastYear + '0101' + '-' + "" + this.lastYear + this.day;
    let fields = ["avgStockOutDays", "stockOutSkuAPct"];
    const params = this.tool.buildParam(this.tool.getParam(com, fields));
    this.basic.packager(this.dataService.getSubLack(params), res => {

      let data = res["data"]["summary"];
      if (data){
        // this.stockOutProductInfor.stockOutSku = this.figureService.isDefine(data.stockOutSku);
        // this.stockOutProductInfor.avgStockOutDays = this.figureService.number(data.avgStockOutDays, false, true);
        // this.stockOutProductInfor.stockOutSkuAPct = this.figureService.scale(data.stockOutSkuAPct, true, true);
        // this.stockOutProductInfor.stockOutDays = this.figureService.isDefine(data.stockOutDays);
        this.radarData.yoy[3] = data.avgStockOutDays < 0 ? null : data.avgStockOutDays;

        this.yoyData[6] = this.figureService.number(data.avgStockOutDays, false, true);
      }else {
        this.radarData.yoy[3] = null;
      }

    });
  }


  // 更多跳转 param 判断是哪一个跳转

  jump(type) {

    let data = JSON.stringify(this.info);
    if (type === 'sale' || type === 'stock') {
      this.stateJump.go("app.supAnalyse.subSaleStock", {info:data});
    }else if (type === 'grossProfit') {
      this.stateJump.go("app.supAnalyse.subGrossProfit", {info:data});
    }else if (type === 'supply') {
      this.stateJump.go("app.supAnalyse.subSupply", {info:data});
    }else if (type === 'lack') {
      this.stateJump.go("app.supAnalyse.subLack", {info:data});
    }else if (type === 'profit') {
      this.stateJump.go("app.supAnalyse.subProfit", {info:data});
    }

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
        })
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
    if (category.length > 0 && classes.length > 0) {
      category = [];
    }
    this.power[0].data = store !== undefined ? store.join(',') : [];
    this.power[1].data = category !== undefined ? category.join(',') : [];
    this.power[2].data = operation !== undefined ? operation.join(',') : [];
    this.power[3].data = classes !== undefined ? classes.join(',') : [];
    this.power[4].data = district !== undefined ? district.join(',') : [];
    this.power[5].data = brand !== undefined ? brand.join(',') : [];
    this.power[6].data = product !== undefined ? product.join(',') : [];
    this.power[7].data = supplier !== undefined ? supplier.join(',') : [];
    this.power[8].data = storeGroup !== undefined ? storeGroup.join(',') : [];

    this.anyPower = true;
    this.power.forEach(v => {
      if (v.data.length > 0) {
        this.anyPower = false;
      }
    });


  }
}

angular.module("hs.supplier.saleStock").controller("subInfoCtrl", SubInfoController);
