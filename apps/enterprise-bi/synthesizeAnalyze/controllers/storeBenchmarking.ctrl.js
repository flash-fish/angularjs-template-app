class storeBenchmarkingController {
  constructor($sce, CommonCon, tableService, dataService, $scope, DTColumnBuilder, $compile, FigureService, basicService, Field,
              toolService, popups, popupDataService, $rootScope, Table, Symbols)
  {
    this.$sce = $sce;
    this.scope = $scope;
    this.popups = popups;
    this.Table = Table;
    this.tool = toolService;
    this.$compile = $compile;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.root = $rootScope;
    this.dataService = dataService;
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.DTColumnBuilder = DTColumnBuilder;
    this.popupDataService = popupDataService;
    this.Symbols = Symbols;

    this.inited = true;
    // 保存共通条件的地方
    this.com = this.basic.initCondition({date: ""}, ["operation", "district"], true);

    // data-setting
    this.dateOption = {};

    // 对比门店
    this.com.compareStoreCode_mid = {val:[],id:'20'};

    // 店群
    this.com.compareStoreGroup_mid = {val:[],id:'21'};

    this.back ={
      finish: true,
    };

    // this.key.finsh = true;

    // 初始化 radio 选择
    this.endStore = 'compareStoreCode';

    // 初始化 field 零售额 retailAmount 销售额allAmount  单位使用面积销售额 useSizeAllAmount 单位经营面积销售额 operateSizeAllAmount 毛利额 allProfit
    // 单位经营面积毛利额 operateSizeAllProfit 毛利率 allProfitRate 客单数 flowCnt 零售客单价 retailFlowAmount 经销周转天数 saleDays
    // 通道收益额 channelRealAmount 有售SKU数 skuUnit
    /******************************************************************************/
    // 经销额distributionAmount   联营额 jointAmount  零售额retailAmount  批发额wholeAmount

    this.initField = {
      radar: [
        'retailAmount',
        'retailAmountYoY',
        'allAmount',
        'allAmountYoY',
        'useSizeAllAmount',
        'useSizeAllAmountYoY',
        'operateSizeAllAmount',
        'operateSizeAllAmountYoY',
        'allProfit',
        'allProfitYoY',
        'operateSizeAllProfit',
        'operateSizeAllProfitYoY',
        'allProfitRate',
        'allProfitRateYoYInc',
        'flowCnt',
        'flowCntYoY',
        'retailFlowAmount',
        'retailFlowAmountYoY',
        'saleDays','saleDaysYoYInc',
        'storeChannelSettleAmount',
        'storeChannelSettleAmountYoY',
      ],
      skuParam:[
        'saleSkuCount',
        'saleSkuCountYoY'
      ],
      pieOne: [
        'distributionAmount',
        'jointAmount',
        'retailAmount',
        'wholeAmount'
      ],
      pieAll:  [
        "retailDistributionAmount",
        "retailJointAmount",
        "wholeDistributionAmount",
        "wholeJointAmount"
      ],
      pieAnother:[
        'allAmount'
      ]
    };

    // radio 监听
    this.RadioListen();

    this.type_field = {};

    this.type_field.table = [];

    // field localStorage
    this.localTabel =  this.CommonCon.local.TABLE_ORIGIN_STORE_ANAlYZE_TYPE;

    /*
     * 当前页面需要的指标结构
     *@from Table->newProductAnalyze_TABLE
     * */
    this.currFileds = angular.copy(this.Table.StoreType);

    this.sort = {
      store: 1,
      compare: 2,
      date: 3,
      classes: 4,
      category: 5,
      brand: 6,
      supplier: 7,
    }
  }

  init(){
    // 获取数据权限
    this.tool.getAccess((d) => this.initialize(d));

    // 按整体Field设置
    this.totalField = angular.copy(this.initField);
    // 搜索按钮状态init
    this.root.fullLoadingShow = false;

    // field 指标从 localStorage 中取出
    this.type_field_Setting();

    // Chart event事件监听
    this.tool.onEvent(this);

  }



  type_field_Setting()
  {
    /*初始化表格指标*/
    const table = this.basic.getLocal(this.localTabel);
    const fields = table ? this.tool.getFieldFromLocal(table, this.currFileds) : this.currFileds;
    this.type_field.table = angular.copy(fields);
  }


  initialize(data) {
    this.inited = true;
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);

    //对标1 | 对标2 默认不受权限控制,默认不选
    if(this.accessCom){
      if(this.accessCom.store) {
        this.accessCom.store.val = [];
      }
      if(this.accessCom.compareStoreCode_mid) {
        this.accessCom.compareStoreCode_mid.val = [];
      }
      if(this.accessCom.compareStoreGroup_mid){
        this.accessCom.compareStoreGroup_mid.val = [];
      }
    }

    this.com = angular.copy(this.accessCom);

    // 如果session里面有值的话 优先读取session
    this.com = this.tool.getComFromSession(this.com, this.tableInfo);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);


    // 初始化日期范围
    this.pageInit(this, (d) => {
      this.commonParam = angular.copy(this.com);
      this.showCondition();
    });


  }

  // 页面初始化
  pageInit(self, func, noDate) {
    // 监听 sessionParam
    self.scope.$on(this.CommonCon.session_key.sessionParam, (e, d) => {
      const data = angular.copy(d);
      _.forIn(data, (v, k) => {
        if(k === 'compareStoreCode_mid'){
          if(v.val.length) { self.endStore = 'compareStoreCode' }
        }
        if(k === 'compareStoreGroup_mid'){
          if(v.val.length) { self.endStore = 'compareStoreGroup' }
        }
        if(k === 'compareOperation'){ if(v) self.endStore = 'compareOperation'; }

        if (!_.isUndefined(self.com[k])) self.com[k] = v;

      });
    });

    if (noDate) { if (func) func();
      return;
    }

    if (!self.com.date) { this.tool.initDate(self, (d) => func(d)); }
    else {
      self.dateOption.date = self.com.date;
      func(self.com.date);
    }
  };

  // 查询按钮
  search(){
    // this.root.fullLoadingShow = true;
    let Trans_Com = angular.copy(this.com);
    let firstStore,secondStore;
    _.forIn(Trans_Com, (value,key)=>{
      if(key === 'store' && value.length !== 0) firstStore = value.val[0].name;

      if(value === false) delete Trans_Com[key];

      if(value === true) secondStore = '业态平均';

      if(key === 'compareStoreCode_mid' && value.val.length !== 0){
        secondStore = value.val[0].name;
      }

      if(key === 'compareStoreGroup_mid' && value.val.length !== 0){
        secondStore = value.val[0].name;
      }
    });

    if(!_.isUndefined(firstStore)) Trans_Com.firstStore = firstStore;

    if(!_.isUndefined(secondStore)) Trans_Com.secondStore = secondStore;

    this.com = angular.copy(Trans_Com);
    _.forIn(this.com,(value,key) => {
      if(key === 'compareStoreCode_mid' && value.val.length !== 0){
        this.com.compareStoreCode = value.val[0].code
      }
      if(key === 'compareStoreGroup_mid' && value.val.length !== 0){
        this.com.compareStoreGroup = value.val[0].code
      }
    });

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.tool.unionAccess(this.com, this.accessCom, this.job);

    this.commonParam = this.tool.commonSearch(this);

    this.showCondition();
  };

  showCondition(){
    let com = angular.copy(this.commonParam);
    const compareObj =_.pick(com, _.keys(com).filter(k => k.includes('compare'))) ;
    this.sortCom = this.tool.dealSortData(com, this.sort, {store: {name: '对标1-门店', type: 0}}, (list, func) =>{
      if(compareObj) {
        let getConFunc = (val) => val.map(v => v.name).join(this.Symbols.comma);
        if(compareObj.compareOperation){
          func('对标2', '业态平均', this.sort.compare);
        } else if(compareObj.compareStoreCode_mid.val.length){
          func('对标2-门店', getConFunc(compareObj.compareStoreCode_mid.val), this.sort.compare)
        } else if(compareObj.compareStoreGroup_mid.val.length){
          func('对标2-店群', getConFunc(compareObj.compareStoreGroup_mid.val), this.sort.compare)
        }
      }
    });
  }

  /*数据设定模态窗口*/
  getTableOption()
  {
    const promise = this.popups.popupSaleStockTable({
      field: this.currFileds,
      local: this.localTabel,
      noShowSetting: true
    });

    this.tool.dealModal(promise, res => {
      this.type_field.table = res;
      this.type_field = Object.assign({}, this.type_field);
    });

  };

  // 门店-(1)
  openStoreListOne() {
    const promise = this.popupDataService.openStore({selected: this.com.store.val, multi: false});
    this.tool.dealModal(promise, res => {
      this.com.store.val = res ? res : [];
    });
  }

  // 门店-(2)
  openStoreListTwo() {
    const promise = this.popupDataService.openStore({selected: this.com.compareStoreCode_mid.val, multi: false});
    this.tool.dealModal(promise, res => {
      this.com.compareStoreCode_mid.val = res ? res : [];
    });
  }

  // 店群
  openStoreGroup() {
    const promise = this.popupDataService.openStoreGroup({selected: this.com.compareStoreGroup_mid.val});
    this.tool.dealModal(promise, res => {
      this.com.compareStoreGroup_mid.val = res ? res : [];
    });
  }

  // 类别
  openCat() {
    const promise = this.popupDataService.openCategory({selected: this.com.category.val});
    this.tool.dealModal(promise, res => {
      this.com.category.val = res ? res : [];
    });
  }

  // 品类组
  openClasses() {
    const promise = this.popupDataService.openClass({selected: this.com.classes.val});
    this.tool.dealModal(promise, res => {
      this.com.classes.val = res ? res : [];
    });
  }

  // 品牌
  openBrand() {
    const promise = this.popupDataService.openBrand({selected: this.com.brand.val});
    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  // 供应商
  openSupplier() {
    const promise = this.popupDataService.openSupplier({selected: this.com.supplier.val});
    this.tool.dealModal(promise, res => {
      this.com.supplier.val = res ? res : [];
    });
  }


  // Radio 逻辑事件监听
  RadioListen(){
    this.scope.$watch('ctrl.endStore',value => {
      switch (value){
        case 'compareStoreCode' :
          this.com.compareStoreGroup_mid.val = [];
          delete this.com.compareStoreGroup;
          this.com.compareOperation = false;
          break;
        case 'compareStoreGroup' :
          this.com.compareStoreCode_mid.val = [];
          delete this.com.compareStoreCode;
          this.com.compareOperation = false;
          break;
        case 'compareOperation' :
          this.com.compareStoreCode_mid.val = [];
          this.com.compareStoreGroup_mid.val = [];
          delete this.com.compareStoreGroup;
          delete this.com.compareStoreCode;
          this.com.compareOperation = true ;
          break;
        default: break;
      }
    })
  }


}

angular.module("hs.synthesizeAnalyze").controller("storeBenchmarkingCtrl", storeBenchmarkingController);
