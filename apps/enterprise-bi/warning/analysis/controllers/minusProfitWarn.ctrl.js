class MinusProfitWarnController {
  constructor(toolService, basicService, WarningService, Common) {
    this.tool = toolService;
    this.basic = basicService;
    this.warnServ = WarningService;
    this.Common = Common;


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
    const session = this.basic.getSession(this.Common.condition);

    if (session && session.pageInfo) this.key.active = 2;
  }

}

angular.module('hs.warning.menu').controller('minusProfitWarnCtrl', MinusProfitWarnController);
