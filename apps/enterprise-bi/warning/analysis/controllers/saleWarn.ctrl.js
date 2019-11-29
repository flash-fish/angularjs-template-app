class WarnSaleController {
  constructor(CommonCon, toolService, Common, basicService, $scope, $stateParams,
              dataService, FigureService, WarningService) {
    this.scope = $scope;
    this.common = Common;
    this.tool = toolService;
    this.state = $stateParams;
    this.basic = basicService;
    this.commonCon = CommonCon;
    this.dataService = dataService;
    this.figureService = FigureService;
    this.warnServ = WarningService;

    // 存放table 排序 分页信息的对象
    this.tableInfo = {};

    this.key = {
      active: 0,
      onlyShowStore: false,
      finish: true
    };
  }

  init() {
    // 获取用户权限后初始化页面
    this.tool.getAccess((d) => {

      this.warnServ.initTabByAccess(d, this.key);

      this.initialize();
    });
  }


  initialize() {
    // 如果session里面有值的话 优先读取session
    const session = this.basic.getSession(this.common.condition);

    if (session && session.pageInfo) this.key.active = 2;

    this.getWarnTitle();
  }

  getWarnTitle() {
    this.basic.packager(this.dataService.getWarnSaleTitle(), res => {
      this.title_period = 30;
      this.title_threshold = this.figureService.scale(res.data, true, true);
    });
  }
}

angular.module('hs.warning.menu').controller('saleWarnCtrl', WarnSaleController);
