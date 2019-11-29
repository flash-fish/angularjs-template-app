class braPriceController {
  constructor($scope, FigureService, CommonCon, tableService, toolService, dataService,
              basicService, popupDataService, Symbols, Common, popups, Chart, Table,
              brandCommon, Field, brandService, $rootScope) {
    this.Table = Table;
    this.Chart = Chart;
    this.Field = Field;
    this.scope = $scope;
    this.popups = popups;
    this.Common = Common;
    this.symbols = Symbols;
    this.root = $rootScope;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.brandCommon = brandCommon;
    this.brandService = brandService;
    this.tableService = tableService;
    this.popupData = popupDataService;
    this.FigureService = FigureService;

    // 保存共通条件的地方
    this.com = Object.assign(
      {date: "", comparableStores: false},
      angular.copy(CommonCon.commonPro)
    );
    // 日期控件基础配置
    this.dateOption = {
      defineID: 'braPrice',
      onlyShowCustom: "month",
    };

    // 表格 CHART localStorage 存储字段名
    this.localTabel = CommonCon.local.TABLE_ORIGIN_CLASS_BRAND_PRICE;
    this.localChart = CommonCon.local.CHART_ORIGIN_CLASS_BRAND_PRICE;

    this.localOriginChart = CommonCon.local.CHART_SELECT_CLASS_BRAND_PRICE;
    // 当前页面需要的指标结构
    this.currFileds = angular.copy(Table.classPrice);
    this.currCharts = angular.copy(Chart.ActivitySetting);

    // 经销-全体 | 经销-零售 | 经销-批发
    this.wholeData = brandCommon.wholeData;
    this.com.distributionSelect = this.wholeData[0].id;

    this.priceSession = brandCommon.session.priceSession;

    // 所有指标的对照关系
    this.fieldInfo = Object.assign(
      this.basic.buildField(Field.sale),
      Field.brandStructure
    );

    // 回调
    this.back = {};

    this.ChartStatus = false;

    // chart 初始指标
    this.originChart = angular.copy(this.Chart.classBrandChart);

    // Chart barName
    this.barName = brandCommon.barName;

    this.conf = {
      analyzeShow: false,
      finishRequire: false,
      active: 1,
      LenName: brandCommon.LenName,
      ZoneTypeProduct: brandCommon.ZoneTypeProduct, // 价格带商品
      TypeSpec: brandCommon.TypeSpec, // 价格带规格
      brandZone: brandCommon.BrandZoneType, // 品牌价格带
      ZoneTypeBrand: brandCommon.ZoneTypeBrand, // 价格带品牌
      surTotalInterface: brandCommon.surTotalInterface, // 表格 | 饼图API
      Z_T_F: brandCommon.ZoneTypeRangFace, // 价格带区间 chart 背景图
      A_P_F: brandCommon.AmountPriceFace, // 销售额规格化价格（折线图）
      C_S_F: brandCommon.CanSaleSkuFace, // 有售、可售sku的价格分布
      treeInitOne: false
    };

    // 表格实例
    this.instance = {};

    // 价格带区域值
    this.areaPrice = {};

    this.sort = {
      date: 1,
      classes: 2,
      category: 3,
      operation: 4,
      store: 5,
      district: 6,
      distributionSelect: 7,
      comparableStores: 8,
      storeGroup: 9,
      brand: 10,
      product: 11,
    };

    this.tableShow = false;

  }


  init(){
    this.root.fullLoadingShow = true;
    // 树形结构基础配置
    this.basicObj = {
      root: "nodes",
      headerWrap: true,
      sort: false,
      other: { icon: true },
      pageId: this.keys.pageId,
      minWidth: 135,
      brandPrice: true,
    };

    this.addName = {
      one:'BraTable',
      two:'BraConfig'
    };

    // 指标对象初始化
    this.field = {};

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 获取概况页面跳转session
    this.fromSurvey = this.basic.getSession(this.priceSession);

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 树形配置
    this.confTree();

    // 额外方法
    this.otherMethod();
  }


  confTree(){
    const _Fix = {
      fix: [{code: "name", width: 190}],
      isString: ['spec', 'season', 'brandName']
    };
    // 价格带商品
    this.oneBraConfig = Object.assign({},this.basicObj, {
      fieldsSet: {
        name:{name: "价格带/商品"},
      },
    },_Fix);
    // 价格带规格
    this.twoBraConfig = Object.assign({},this.basicObj, {
      fieldsSet: {
        name:{name: "价格带/规格"},
      },
    }, _Fix);
    // 品牌价格带
    this.threeBraConfig = Object.assign({},this.basicObj, {
      fieldsSet: {
        name:{name: "品牌/价格带"},
      },
    },_Fix);
    // 价格带品牌
    this.fourBraConfig = Object.assign({},this.basicObj, {
      fieldsSet: {
        name:{name: "价格带/品牌"},
      },
    },_Fix);
  }

  initialize(data){
    this.haveStore = false;
    function acConf(ele, self) {
      let count = 0;
      _.forIn( ele, (v,k) => {
        // 门店|业态|地区
        if(k === 'store' || k === 'operation' || k === 'district'){
          if(v.val.length) { count ++ ; v.val = [].concat(v.val[0]) }
        }
      });
      if(count === 3){
        _.forIn( ele, (v,k) => {
          // 门店|业态|地区
          if(k === 'operation' || k === 'district'){
            if(v.val.length) v.val = [];
          }
        });
      }

      // 数据权限在门店上 | 业态/地区不可选择
      if(count === 1){
        _.forIn( ele, (v,k) => {
          if(k === 'store') {
            if(v.val.length) self.haveStore = true;
          }
        });
      }

      // 采购权限下去除品类组的条件
      if(ele.classes && ele.classes.val) ele.classes.val = [];
    }

    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data, {
      setTopCache: true,
      needCategory: true
    });
    // 页面门店多个取一个
    acConf(this.accessCom, this);

    this.com = angular.copy(this.accessCom);

    // 判断该页面是否含有跳转 session
    if(this.fromSurvey && this.fromSurvey.jumpFromSurvey) {
      this.com = angular.copy(this.fromSurvey);
    }

    // 初始化指标
    this.getField();

    // 页面初始化的基础逻辑
    this.brandService.pageInit(this, () => {
      this.commonParam = angular.copy(this.com);

      this.buildOption();
      // 判断是否是子类-> 价格线分析Chart显示
      this.AllGet();
      this.analyzeChartGet();

      this.showCondition();

      // ng-if table
      this.tableShow = true;

      this.ChartStatus = true;
    });
  }


  showCondition(){
    let com = angular.copy(this.commonParam);

    const other = {
      distributionSelect: { name: '销售方式' }
    };

    const brandSur = this.wholeData;

    brandSur.forEach( s => {
      if(s.id === this.commonParam.distributionSelect) com.distributionSelect = s.name;
    });

    this.sortCom = this.tool.dealSortData(com, this.sort, other);
  }


  // 请求fieldSession
  getField(){
    const table = this.basic.getLocal(this.localTabel);
    const fields = table ? this.tool.getFieldFromLocal(table, this.currFileds) : this.currFileds;
    this.field.table = angular.copy(fields);
    // 初始化图表指标
    const chart = this.basic.getLocal(this.localChart);
    if (chart) {
      this.setField(chart.first);
      this.field.chart = {first: chart.first };
    } else {
      const orChart = angular.copy(this.originChart);
      let fieldSale = this.tool.calculateChartField(orChart.sale);
      // 拼接 Chart 指标
      if(fieldSale) this.setField(fieldSale);
      this.field.chart = {first: fieldSale };
    }
    // 构建合计的结构
    this.sum = this.tool.buildSum(this.field.chart, this.fieldInfo);
    this.initColumn();
  }

  // chart 指标重构
  setField(ele){
    let _midFields = _.clone(ele);
    let [brNoType, distributionSelect] = [
      this.brandCommon.noType, this.com.distributionSelect
    ];

    _.forIn(_midFields, (v,k) => {
      v.forEach( (s,i,ar) => {
        if(this.brandCommon.HaveCanSale.includes(s.id)) {
          ar[i].id = this.wholeData[0].id + s.id;
        }else if(!brNoType.includes(s.id)){
          ar[i].id = distributionSelect + s.id;
        }
      });
    });
    return _midFields;
  }

  // 构建dataTable的数据以及初始化chart表格数据
  buildOption() {
    this.key = {
      interfaceName: this.conf.surTotalInterface,
      param: this.tool.getParam(this.commonParam , this.field),
      setChart: (d) => this.setChartData(d),
      setSum: (s) => this.tool.getSum(s, this.sum, this.fieldInfo),
      special: { pageId: this.keys.pageId },
      addSum: 'zoneTypeName'
    };

    this.TableOption = this.tableService.fromSource(this.tool.getData(this.key, this.back), {
      fixed: 1,
      noPage: true,
      compileBody: this.scope
    });
  };

  // 构建页面表格数据
  initColumn(){
    this.tool.changeCol(this.field, true, null, (s) => {
      if(s.newTable){
        s.newTable.forEach((s,i,ar) => {
          if(this.brandCommon.HaveCanSale.includes(s))  {
            ar[i] = this.wholeData[0].id + s;
          } else if(!this.brandCommon.noType.includes(s)){
            ar[i] = this.com.distributionSelect + s;
          }
        });
      }
    });

    this.buildColumn();
  }

  // 构建表格列
  buildColumn() {
    this.fix = [{
      code: 'zoneTypeName',
      sort: true
    }];
    this.TableColumn = this.tableService.anyColumn(
      this.tableService.fixedColumn(this.fix),
      this.field.newTable,
      this.fieldInfo
    )
  }

  // 价格带分析图 | 价格带构成图 (chart)
  setChartData(data){
    // 1> 价格带分析图
    const key = {
      data,
      info: Object.assign({},this.fieldInfo, {stockQtyPct: {name: '日均库存数-占比', scale: true}}),
      silent: true,
      xData: {
        name: '类别',
        title: "zoneTypeName"
      },
    };
    this.tool.getChartOption(key, this);

    // 2> 价格带构成图
    if(this.ChartStatus){
      let conf = {
        field: this.field.chart,
        Info: this.fieldInfo,
      };
      this.structureChart = this.brandService.PieRender(this, data, conf);
      this.ChartStatus = false;
    }

  }

  // 价格线分析
  PriceLineAnalyzeChart(){
    let copyCommonParam = angular.copy(this.commonParam);
    delete copyCommonParam.distributionSelect;
    this.root.fullLoadingShow = true;

    const key = {
      pageId: this.keys.pageId
    };

    // 请求参数构建
    let param = this.tool.buildParam(
      this.tool.getParam(copyCommonParam, [this.com.distributionSelect + this.brandCommon.basicField[0]]),
      key
    );

    function add(ele) {
      return parseFloat(ele).toFixed(2)
    }

    // 1> 接口请求 | 背景图
    // 2> 接口请求 | 销售额规格化价格（折线图）
    // 3> 接口请求 | sku分布

    // 渲染Chart图标 配置
    let Data = { };

    this.basic.packager(this.dataService[this.conf.Z_T_F](param), res => {
      Data.areaData = res.data;
      const resData = res.data;
      let excessData = {
        two: add(resData.oneLevel + 0.01),
        three: add(resData.twoLevel + 0.01),
        four: add(resData.threeLevel + 0.01),
        five: add(resData.fourLevel + 0.01)
      };
      this.areaPrice = Object.assign({}, resData, excessData);

      param.fields = [this.com.distributionSelect + 'Amount'];
      this.basic.packager(this.dataService[this.conf.A_P_F](param), mountRes => {
        Data.AmountData = mountRes.data;

        this.basic.packager(this.dataService[this.conf.C_S_F](param), skuRes => {
          Data.skuData = skuRes.data;

          this.root.fullLoadingShow = false;
          this.conf.finishRequire = true;
          // 价格线分析
          this.AreaChart = this.brandService.AnalyzeBrandChart(this, Data)
        })
      })
    });
  }


  // 单品结构分析
  InitTreeData(ele, treeName){
    let _Field = _.clone(this.brandCommon.basicField);
    _Field.forEach((s,i,ar) => {
      if(this.brandCommon.haveField.includes(s)){
        ar[i] = this.com.distributionSelect + s
      }
    });
    const _Type = this.com.distributionSelect;
    let endField;
    if(_Type === 'distribution'){
      endField =  _.concat(_Field, ['normalPrice', 'specPrice'])
    }
    if(_Type === 'distributionRetail'){
      endField = _.concat(_Field, ['retailNormalPrice', 'retailSpecPrice'])
    }
    if(_Type === 'distributionWhole'){
      endField = _.concat(_Field, ['wholeNormalPrice', 'wholeSpecPrice'])
    }

    const key = {
      pageId: this.keys.pageId
    };

    // 请求参数构建
    const treeParam = this.tool.buildParam(this.tool.getParam(this.commonParam, endField),key);
    this.basic.packager(this.dataService[ele](treeParam), res => {
      let data = res.data.details || [];
      const tree = {
        select: this.commonParam.category.val,
        code: 'categoryCode'
      };
      data.forEach( s => this.tool.loopTree(...[tree, [s], []]));

      let confField = _.clone(treeName.field);
      confField.forEach( (a, i, ar) => {
        if(this.brandCommon.haveField.includes(a)){
          ar[i] = this.com.distributionSelect + a
        }
        // 价格
        if(a === 'normalPrice'){
          if(_Type === 'distribution') ar[i] = 'normalPrice';
          if(_Type === 'distributionRetail') ar[i] = 'retailNormalPrice';
          if(_Type === 'distributionWhole') ar[i] = 'wholeNormalPrice';
        }
        // 规格化价格
        if(a === 'specPrice'){
          if(_Type === 'distribution') ar[i] = 'specPrice';
          if(_Type === 'distributionRetail') ar[i] = 'retailSpecPrice';
          if(_Type === 'distributionWhole') ar[i] = 'wholeSpecPrice';
        }

      });

      // 传入tree-grid组件的对象
      this[treeName.one] = {data, field: confField};
      this.noInit = true;
      this.conf.treeInitOne = true;
      this.root.fullLoadingShow = false;
    });
  }


  // 1> 价格带商品
  brandOneSelect(){
    this.treeFinish = true;
    this.root.fullLoadingShow = true;
    const treeName = {
      one: 'one' + this.addName.one ,
      two: 'two' + this.addName.two,
      field: this.brandCommon.priceFieldOne
    };
    // 树形结构构建
    this.InitTreeData(this.conf.ZoneTypeProduct, treeName);
  }

  // 2> 价格带规格
  brandTwoSelect(){
    this.treeFinish = true;
    this.root.fullLoadingShow = true;
    let Name = {
      one: 'two' + this.addName.one ,
      two: 'two' + this.addName.two,
      field: this.brandCommon.priceFieldTwo
    };
    this.InitTreeData(this.conf.TypeSpec, Name);
  }

  // 3> 品牌价格带
  brandThreeSelect(){
    this.treeFinish = true;
    this.root.fullLoadingShow = true;
    let threeName = {
      one: 'three' + this.addName.one ,
      two: 'three' + this.addName.two,
      field: this.brandCommon.priceFieldThree
    };
    this.InitTreeData(this.conf.brandZone, threeName);
  }


  // 4> 价格带品牌
  brandFourSelect(){
    this.treeFinish = true;
    this.root.fullLoadingShow = true;
    let fourName = {
      one: 'four' + this.addName.one ,
      two: 'four' + this.addName.two,
      field: this.brandCommon.priceFieldFour
    };
    this.InitTreeData(this.conf.ZoneTypeBrand, fourName);
  }


  // 品类组
  openClasses() {
    const promise = this.popupData.openClass({selected: this.com.classes.val});
    this.tool.dealModal(promise, res => {
      this.com.classes.val = res ? res : [];
    });
  }

  // 类别
  openCat() {
    const promise = this.popupData.openCategory({selected: this.com.category.val});
    this.tool.dealModal(promise, res => {
      this.com.category.val = res ? res : [];
    });
  }

  // 业态
  openOperation() {
    const promise = this.popupData.openOperation({selected: this.com.operation.val, multi: false});
    this.tool.dealModal(promise, res => {
      this.com.operation.val = res ? res : [];
      // 门店值初始化
      this.com.store.val = [];
    });
  }

  // 门店
  openStoreList() {
    const promise = this.popupData.openStore({selected: this.com.store.val, multi: false});
    this.tool.dealModal(promise, res => {
      this.com.store.val = res ? res : [];
      // 解除门店与业态和地区的交叉关系
      this.com.operation.val = [];
      this.com.district.val = [];

    });
  }

  // 地区
  openDistrict() {
    const promise = this.popupData.openDistrict({selected: this.com.district.val, multi: false});
    this.tool.dealModal(promise, res => {
      this.com.district.val = res ? res : [];
      // 门店值初始化
      this.com.store.val = [];
    });
  }

  // 店群
  openStoreGroup() {
    const promise = this.popupData.openStoreGroup({selected: this.com.storeGroup.val});
    this.tool.dealModal(promise, res => {
      this.com.storeGroup.val = res ? res : [];
    });
  }

  // 品牌
  openBrand() {
    const promise = this.popupData.openBrand({selected: this.com.brand.val});
    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  // 数据设定
  getTableOption() {
    const promise = this.popups.popupClassBrandPrice({
      field: this.currFileds,
      local: this.localTabel,
    });
    this.tool.dealModal(promise, res => {
      this.field.table = res;
      this.field = Object.assign({}, this.field);

      // 判断数据设定的值有否改变
      this.scope.$watch('ctrl.field.table', (newVal, oldVal) => {
        if (!newVal) return;
        let newTable = this.tool.calculateTableField(newVal);
        let oldTable = this.tool.calculateTableField(oldVal);
        newTable = this.tool.SameRingSettingField(newTable, newVal.option);
        oldTable = this.tool.SameRingSettingField(oldTable, oldVal.option);
        if (_.isEqual(_.sortedUniq(newTable), _.sortedUniq(oldTable))) return;
        this.getField();
      })
    });

  };

  // 图表设定
  ChartOption() {
    const promise = this.popups.popupClassPriceChart({
      local: {
        origin: this.localOriginChart,
        data: this.localChart
      }
    });
    this.tool.dealModal(promise, res => {
      this.ChartStatus = true;
      this.field.chart = res;
      // 参数有否对比参数处理
      this.field = Object.assign({}, this.field);
      this.setField(this.field.chart.first);
      // 构建合计的结构
      this.sum = this.tool.buildSum(this.field.chart, this.fieldInfo);
      this.getField();
      // chart 图例重绘
      this.instance.reloadData();
    });
  }

  // 条件检索 查询
  search(){
    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.brandService.unionAccess(this.com, this.accessCom, this.job);

    this.ChartStatus = true;

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.commonParam = this.tool.commonQuery(this.com, () => {
      this.getField();
      this.instance.reloadData();
    });
    this.AllGet();
    this.analyzeChartGet();

    this.showCondition();
  }

 // 基本参数所有请求
  AllGet(){
    this.brandService.PriceLine(this, this.commonParam, s => {
      if(!s) return;
      // 树形结构构建初始
      const treeName = {
        one: 'one' + this.addName.one ,
        two: 'one' + this.addName.two,
        field: this.brandCommon.priceFieldOne
      };
      this.conf.active = 1;
      this.treeFinish = true;
      this.InitTreeData(this.conf.ZoneTypeProduct, treeName);
    });
  }

  // 价格线分析
  analyzeChartGet(){
    this.brandService.PriceLine(this, this.commonParam, s => {
      if (!s) return;
      this.PriceLineAnalyzeChart();
    })
  }

  otherMethod(){
    // 可比门店 disabled
    this.scope.$watch('ctrl.com.store.val', v => {
      if(!v) return;
      this.disabledId = v.length > 0 ? 1 : 2;
    });


  }


}

angular.module('hs.classesAnalyze').component('braPrice', {
  templateUrl: 'app/classesAnalyze/directives/component/price/braPrice.tpl.html',
  controller: braPriceController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '='
  }
});
