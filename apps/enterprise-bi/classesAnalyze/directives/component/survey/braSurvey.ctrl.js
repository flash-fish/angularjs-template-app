class braSurveyController {
  constructor($scope, FigureService, CommonCon, tableService, toolService, dataService,
              basicService, popupDataService, Symbols, Common, brandCommon,$rootScope, Field, brandService) {
    this.Field = Field;
    this.scope = $scope;
    this.Common = Common;
    this.root = $rootScope;
    this.symbols = Symbols;
    this.tool = toolService;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.brandCommon = brandCommon;
    this.braService = brandService;
    this.tableService = tableService;
    this.popupData = popupDataService;
    this.FigureService = FigureService;

    // 保存共通条件的地方
    this.com = Object.assign(
      {date: "", comparableStores: false},
      angular.copy(this.CommonCon.commonPro)
    );

    // 经销-全体 | 经销-零售 | 经销-批发
    this.wholeData = brandCommon.wholeData;
    this.com.distributionSelect = this.wholeData[0].id;

    // 日期控件基础配置
    this.dateOption = {
      onlyShowCustom: "month",
      defineID: 'braSurvey'
    };

    // 树形接口
    this.interfaceName = brandCommon.surTreeInterface;

    // 合计接口
    this.surTotalInterface = brandCommon.surTotalInterface;

    // 初始化field
    this.initField = brandCommon.surveyField;

    // 所有指标的对照关系
    this.fieldInfo = Object.assign(
      {},
      this.basic.buildField(Field.sale),
      Field.brandStructure
    );

    this.priceSession = brandCommon.session.priceSession;

    // 价格带概况页面不共享条件| （定义session）
    this.surveyCondition = brandCommon.session.surveyCondition;

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
  }


  init(){
    this.root.fullLoadingShow = true;

    // 树形配置
    this.config = {
      fix: [
        {code: "categoryName", width: 190},
        {code: "categoryCode", width: 100}
      ],
      root: "nodes",
      headerWrap: true,
      other: { icon: true },
      pageId: this.keys.pageId,
      minWidth: this.keys.treeGridMinWidth
        ? this.keys.treeGridMinWidth
        : 135,
      brandSurvey:{
        isBrand:true,
      }
    };

    // 清除按价格带 session
    this.basic.getSession(this.priceSession,true);

    // 监听路由变化
    this.root.$on('$stateChangeSuccess', () => {
      this.clearSession(true);
    });

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 概况页面存储 树形结构信息
    this.scope.$on(this.CommonCon.brandTreeGridrowExpand, (e,d) => {
      // 把条件存储为session
      this.basic.setSession(this.brandCommon.session.emitTreeSession, d)
    });

    this.otherMethod();
  }

  initialize(data){
    // 初始化 业态 | 地区是否可选
    this.haveStore = false;
    this.inited = true;

    function acConf(ele, self) {
      let count = 0;
      _.forIn( ele, (v,k) => {
        // 门店|业态|地区
        if(k === 'store' || k === 'operation' || k === 'district'){
          if(v.val.length) {
            count ++ ; v.val = [].concat(v.val[0]);
          }
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

    // 获取当前页面session
    const setSession = this.basic.getSession(this.surveyCondition);
    if(setSession) this.com = setSession;

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 判断隐藏条件等有没有值
    // this.show = this.tool.contrastCom(this.com, ['storeGroup', 'brand', 'product']);

    // 页面初始化的基础逻辑
    this.braService.pageInit(this, () => {
      this.commonParam = angular.copy(this.com);

      // 初始化存session
      if(!setSession) this.basic.setSession(this.surveyCondition,this.com);

      this.getData();

      this.showCondition();

    }, setSession);

  }

  clearSession(remove){
    this.basic.getSession(this.brandCommon.session.emitTreeSession, true);
    if(remove) this.basic.getSession(this.surveyCondition, true);
  }

  // 搜索按钮
  search(){
    this.root.fullLoadingShow = true;

    // 合并当前选中的值和权限中的值（包含特殊条件权限的处理）
    this.braService.unionAccess(this.com, this.accessCom, this.job);
    this.basic.setSession(this.surveyCondition, this.com);

    this.commonParam = this.tool.commonQuery(this.com, () => {}, {noSetParam: true});

    this.getData();
    this.clearSession();

    this.showCondition();
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
      this.com.store.val = [];
    });
  }

  // 品牌
  openBrand() {
    const promise = this.popupData.openBrand({selected: this.com.brand.val});
    this.tool.dealModal(promise, res => {
      this.com.brand.val = res ? res : [];
    });
  }

  // 树形图数据请求
  getData(){
    const key = { pageId: this.keys.pageId };
    // 构建请求参数
    let param = this.tool.buildParam(
      this.tool.getParam(this.commonParam, []),
      key
    );

    let _Field = _.clone(this.brandCommon.totalField);

    _Field.forEach( (s,i,ar) => {
      ar[i] = this.com.distributionSelect + s;
    });

    // 合计数据获取
    param.fields = _Field;

    this.basic.packager(this.dataService[this.surTotalInterface](param), res => {
      let sumData = res.data;

      let sumList = angular.copy(this.brandCommon.InitSet);

      sumList.forEach( (s,i,ar) => {
        if(s.id.includes('REPLACE')){
          ar[i].id = _.replace( s.id, 'REPLACE', this.upOne(this.com.distributionSelect))
        }else  ar[i].id = this.com.distributionSelect + s.id;
      });

      // 重构合计结构
      this.sum = _.clone(sumList);

      let splicingSum = angular.copy(this.com.distributionSelect);

      // 重构合计结构
      const newData = this.braService.brandBuildSumData(sumData, splicingSum);

      // 合计数据显示
      this.braService.braGetSum(newData, this.sum, this.fieldInfo);
      this.getTreeData(this.interfaceName,param);
    });
  }

  // getTreeData 树形结构数据、结构构建
  getTreeData(ele,param){
    this.basic.packager(this.dataService[ele](param), res => {
      let data = res.data;
      const tree = {
        select: this.commonParam.category.val,
        code: 'categoryCode'
      };

      let _treeField = _.clone(this.initField);

      _treeField.forEach( (s,i,ar) => {
        if(s.includes('REPLACE')) {
          ar[i] = _.replace( s, 'REPLACE', this.upOne(this.com.distributionSelect))
        }else ar[i] = this.com.distributionSelect + s;
      });

      data.forEach( s => this.tool.loopTree(...[tree, [s], []]));
      // 传入tree-grid组件的对象
      this.table = {data, field: _treeField};
      this.noInit = true;
      this.root.fullLoadingShow = false;
    });
  }

  upOne(ele) {
    let str;
    str = ele.charAt(0).toUpperCase() + ele.slice(1);
    return str;
  }

  // 额外方法
  otherMethod(){
    // 可比门店 disabled
    this.scope.$watch('ctrl.com.store.val', v => {
      if(!v) return;
      this.disabledId = v.length > 0 ? 1 : 2;
    });

  }


}

angular.module('hs.classesAnalyze').component('braSurvey', {
  templateUrl: 'app/classesAnalyze/directives/component/survey/braSurvey.tpl.html',
  controller: braSurveyController,
  controllerAs: 'ctrl',
  bindings: {
    param: '<',
    field: '<',
    keys: '=',
    change: '<'
  }
});
