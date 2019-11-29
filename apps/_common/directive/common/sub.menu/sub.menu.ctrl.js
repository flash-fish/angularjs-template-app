class SubMenuController {

  constructor($scope, $state, basicService, Common, CommonCon, $timeout,
              toolService, $rootScope) {
    this.scope = $scope;
    this.$state = $state;
    this.common = Common;
    this.root = $rootScope;
    this.$timeout = $timeout;
    this.CommonCon = CommonCon;
    this.basic = basicService;
    this.tool = toolService;

  }

  init() {
    this.hide = false;
    this.close = false;

    this.scope.$watch("sub.info", newVal => {

      // 获取用户当前的菜单权限
      let accessMenu = this.basic.getSession(this.common.visiblePage);
      accessMenu = accessMenu ? accessMenu.map(s => s.curr) : [];

      this.menus.list.forEach(s => {
        s.r = this.menus.parent + s.c;

        // 收益特殊处理
        if (_.isEqual(s.c, "subProfit")) {
          const profitJob = sessionStorage.getItem(this.common.profitJob);
          if (profitJob) s.t += profitJob;
        }
      });

      // 根据用户当前的菜单权限过滤子菜单
      this.menus.list = this.menus.list.filter(s => !s.access || (s.access && accessMenu.includes(s.access)));

      const currMenu = newVal.subMenuActive
        ? newVal.subMenuActive
        : this.$state.$current.name;

      this.menus.list.forEach(s => s.active = currMenu === s.r);

      this.menu = angular.copy(this.menus);
      this.menu.list = this.menu.list.filter(l => !l.d);

      this.singleMenu = this.menu.list.length < 2;
    });
  }

  toggle() {
    this.close = !this.close;

    // sub-main样式修改
    angular.element(".sub-main").css("margin-left", this.close ? 0 : "165px");

    // 菜单栏toggle时 触发chart resize事件
    // 添加了首页饼图 不过 chart 应该统一一个标签
    let trend = $('.chart-div');
    let sideWidth = $(".minifyMenu").width();

    for (let i = 0; i < trend.length; i++) {
      let current = trend[i];
      let myChart = echarts.getInstanceByDom(current);

      $(current).width($(current).parent().width());
      if (myChart) myChart.resize();
    }

    // 切换菜单栏的时候 将状态存入session (1: 收缩， 2: 展开)
    let state = '';
    sideWidth > 100 ? state = 1 : state = 2;
    sessionStorage.setItem(this.CommonCon.session_key.left_menu_toggle, state);

    // 菜单栏toggle时 触发table column resize事件
    if ($('.dataTable tbody tr')[0] && $('.dataTable tbody tr')[0].innerText.indexOf('没有数据') < 0) {
      this.$timeout(() => {
        // 重新计算列宽的场合 屏蔽掉dataTable自动发起的ajax请求
        this.basic.setSession(this.CommonCon.session_key.columnResizing, true);

        $('.dataTable').DataTable().columns.adjust().draw();
      }, 300);
    }

    //重置treeGrid的宽度
    this.$timeout(() => {
      this.tool.resizeTree();
    }, 300)

  }

  goToUrl() {
    this.hide = true;

    if (this.info.noReturn) return;

    // 将父页面的条件设置回session中
    this.basic.setSession(this.common.condition, this.session);

    setTimeout(() => {
      this.$state.go(this.info.from);
    });
  };

  click(curr) {
    this.menus.list.forEach(s => s.active = curr.r === s.r);

    delete this.info.subMenuActive;
    this.$state.go(curr.r, {info: JSON.stringify(this.info)});
  }
}

angular.module('SmartAdmin.Directives').component("subMenu", {
  templateUrl: "app/directive/common/sub.menu/sub.menu.tpl.html",
  controller: SubMenuController,
  controllerAs: "sub",
  bindings: {
    menus: "=",
    info: "<",
    session: "<"
  }
});
