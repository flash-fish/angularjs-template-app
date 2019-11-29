class newItemStateController {
  constructor($rootScope, $scope, FigureService, CommonCon, tableService,
              toolService, popups, dataService, $sce, alert, basicService,
              $state, popupDataService, Common, newState) {
    this.$sce = $sce;
    this.alert = alert;
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
    this.tableService = tableService;
    this.FigureService = FigureService;
    this.popupData = popupDataService;

    // 也买你初始化配置
    this.key = {
      active: 1,
      pageId: CommonCon.page.page_new_state,
      pageId_one: CommonCon.page.page_new_state_class,
      pageId_two: CommonCon.page.page_new_state_category,
      categoryShow: true,
    };

    // 保存共通条件的地方
    this.com = this.basic.initCondition({ date: "" });

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};
  }

  init() {
    this.inited = true;
    this.root.fullLoadingShow = false;

    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => this.initialize(d));

    // 监听路由变化
    this.root.$on('$stateChangeSuccess', (event, toState, toParams, fromState) => {
      let stateOne = toState.name.includes('newInfo') && fromState.name.includes('newItemState');
      let stateTwo = toState.name.includes('newItemState') && fromState.name.includes('newInfo');

      // 新品单品信息不清除session
      if(!stateOne && !stateTwo){
        // 新品状态 | （品类组）
        this.basic.getSession(this.newState.session.categorySession, true);
        this.basic.getSession(this.newState.session.navCat, true);

        // 新品状态 | （类别）
        this.basic.getSession(this.newState.session.classSession, true);
        this.basic.getSession(this.newState.session.navCla, true);
      }
    });

    // 节点树点击事件
    this.scope.$on(this.CommonCon.newMetClick, (e,d) => {
      this.key.active = 3;

      // 把条件存储为session
      this.basic.setSession(this.newState.session.newMetSession, d);
    });

    // 如果session里面有值的话 优先读取session
    this.sessionState(this.tableInfo);

    if (this.tableInfo.page) this.key.active = 3;


    // 获取新品概况跳转session
    let InfoJump = this.basic.getSession('fromInforToSaleState');
    if(InfoJump) this.key.active = 3;
  }

  // 初始 session 状态
  sessionState(tableInfo){
    const session = this.basic.getSession(this.common.condition);
    if(session){
      if (tableInfo) {
        tableInfo.sort = session.sortInfo;
        tableInfo.page = session.pageInfo;
      }
    }
  }

  // 根据权限判断类别 tab 的显示
  initialize(data){
    this.inited = true;
    // 获取用户权限信息 设置有权限kpi的初始值
    this.accessCom = this.tool.initByAccess(this.com, data, { needCategory: true });
    _.forIn( this.accessCom, (v,k) => {
      if(k === 'category'){
        if(v.val.length && v.val[0].level > 3) this.key.categoryShow = false
      }
    })
  }



}

angular.module("hs.productAnalyze.news").controller("newItemStateCtrl", newItemStateController);
