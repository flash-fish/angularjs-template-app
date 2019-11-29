class newComClassController {
  constructor($scope, FigureService, CommonCon, tableService, $rootScope,
              toolService, popups, dataService, newItemService,
              basicService, $state, popupDataService, Common, Field, newState) {
    this.scope = $scope;
    this.popups = popups;
    this.$state = $state;
    this.common = Common;
    this.root = $rootScope;
    this.tool = toolService;
    this.newState = newState;
    this.basic = basicService;
    this.CommonCon = CommonCon;
    this.dataService = dataService;
    this.toolService = toolService;
    this.newItem = newItemService;
    this.tableService = tableService;
    this.popupData = popupDataService;
    this.FigureService = FigureService;

    this.instance = {};

    // 日期控件配置
    this.dateOption = {};

    // 保存共通条件的地方
    this.com = this.basic.initCondition({ date: "" });

    // 新品年份
    this.newSeYear = newItemService.StrNewYear();
    this.com.date = this.newSeYear[0].id;

    this.topCondition = this.basic.getLocal(Common.local.topCondition);
    if (this.topCondition && this.topCondition.newProductYear)
      this.com.date = String(this.topCondition.newProductYear);

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    // 所有指标的对照关系
    this.fieldInfo = Object.assign(this.basic.buildField(Field.sale), Field.newSate);

    // 树请求接口
    this.interfaceName = 'getAbnormalNewProductByClass';

    this.TreeField = _.clone(newState.structureTree);
  }

  init() {
    this.root.fullLoadingShow = true;
    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    this.scope.$watch('ctrl.com.date', (n,o) => {
      if(!n || n === o) return;
      this.root.fullLoadingShow = true;
      this.getTreeData();
      this.scope.$broadcast(this.CommonCon.changeNewYear, n);
      this.basic.getSession(this.newState.session.classSession, true);
      // nav year session save
      // this.basic.setSession(this.newState.session.navCla, n)
      this.basic.setLocal(this.common.local.topCondition, Object.assign(this.topCondition, { newProductYear: Number(this.com.date) }))
    });

    // 概况页面存储 树形结构信息
    this.scope.$on(this.CommonCon.newEmitState, (e,d) => {
      // 把条件存储为session
      this.basic.setSession(this.newState.session.classSession, d)
    })
  }

  initialize(data){
    this.inited = true;
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data);

    _.forIn(this.accessCom, v => {
      if(v.val && v.val.length) v.val = []
    });

    this.com = angular.copy(this.accessCom);

    // 根据当前用户的权限判断其所在的岗位
    this.job = this.tool.getJobByAccess(this.accessCom);

    // 检测session里是否含有年份的session
    // const SessionDate = this.basic.getSession(this.newState.session.navCla);
    // if(SessionDate) this.com.date = SessionDate;

    this.getTreeData();
  }

  getTreeData(){
    // 树状图配置
    this.config = {
      fix: [ {code: "className", width: 210} ],
      sort: false,
      root: "nodes",
      headerWrap: true,
      pageId: this.keys.pageId_one,
      newSateAnalyze: true,
      isNewClass: true,
      isString: this.newState.isString,
      minWidth:220,
      width:140,
      type: 1,
      confSort: this.newState.confSort,
      isNewAna:true,
      newYear: this.com.date
    };

    const param = this.tool.buildParam(this.tool.getParam(this.com,[]),[]);
    param.pageId = this.keys.pageId_one;
    this.basic.packager(this.dataService[this.interfaceName](param), res => {
      let data = res.data.details;
      // 遍历树 添加展开收起的属性
      const tree = {
        select: this.com.category.val,
        code: 'categoryCode'
      };
      data.forEach(s => this.tool.loopTree(...[tree, [s], []]));
      // 传入tree-grid组件的对象
      this.table = {data, field: this.TreeField};
      this.noInit = true;
      this.root.fullLoadingShow = false;
    });

  }


}

angular.module('hs.productAnalyze.news').component('newComClass',  {
  templateUrl: 'app/newproanalyze/analyze/component/newClass/newComClass.tpl.html',
  controller: newComClassController,
  controllerAs: 'ctrl',
  bindings: {
    keys: '<',
  }
});

