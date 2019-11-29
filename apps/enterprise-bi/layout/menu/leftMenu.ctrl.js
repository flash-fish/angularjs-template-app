class LeftMenuController {
  constructor($rootScope, ajaxService, action, Common, FigureService, basicService,toolService) {
    this.action = action;
    this.Common = Common;
    this.root = $rootScope;
    this.ajax = ajaxService;
    this.basic = basicService;
    this.figure = FigureService;
    this.tool = toolService;

    // 获取当前的路由
    this.from = $rootScope.from_route;

    this.routes = [];


  }

  init() {
    // no init 取 left Session
    const leftMenu = this.basic.getSession(this.Common.leftMenu);
    const session = this.basic.getSession(this.Common.accountAccess, false);
    let midMenu = angular.copy(leftMenu);
    if (session && leftMenu) {
      // 子菜单特殊情况处理  -> (新品类别分析) 品类组数据权限低于中分类 子菜单不显示
      this.tool.initMenu(session,midMenu);
      if (midMenu && this.root.user && _.isEqual(this.root.user.userCode, session.userCode)) {
        this.menu = midMenu;
        this.root.leftMenu = this.menu;
        this.tool.loopMenu({children: this.menu}, this.routes);
        return;
      }
    }

    this.tool.getMenu(this);

    // init 请求菜单接口
    // this.basic.packager(this.ajax.post(this.action.auth.userMenu, {
    //   moduleId: this.Common.module
    // }), res => {
    //   let initMenu = angular.copy(res.data);
    //
    //   this.tool.getAccess((d) => this.initMenu(d,initMenu));
    //   this.menu = initMenu;
    //
    //   this.basic.setSession(this.Common.leftMenu, this.menu);
    //
    //   this.root.leftMenu = this.menu;
    //   this.loopMenu({children: this.menu});
    //   this.basic.setSession(this.Common.visiblePage, this.routes);
    // });
  }


  // // 根据数据权限初始化菜单列表
  // initMenu(initAccess,menuParam){
  //   const data_access = initAccess.dataAccess.find( s => s.dataAccessCode === '2');
  //   let compareName = ['新品分析'];
  //   data_access.accesses.forEach(s => {
  //     if(s.level > 3) {
  //       let aL_menu =  menuParam.filter( a => a.resName === compareName[0])[0].children;
  //       aL_menu.forEach(( ele, index) => {
  //         if(ele.resUrl === 'app.newItemAnalyze.newItemCateGory')  aL_menu.splice(index,1) ;
  //       });
  //       menuParam.forEach( s => {
  //         if( s.resName === compareName[0] )  s.children = aL_menu ;
  //       });
  //     }
  //   });
  // }
  //
  // loopMenu(menu) {
  //   // 根据当前的路由判断要不要展开或是初始化选中
  //   menu.children.forEach(s => {
  //     // 供应商收益菜单特殊处理
  //     if (_.isEqual(s.resUrl, "app.supAnalyse.supplierProfit")) {
  //       const profitJob = s.resName.match(/\((.+?)\)/g);
  //       if (profitJob) sessionStorage.setItem(this.Common.profitJob, profitJob[0]);
  //     }
  //
  //     // 将当前的resUrl保存到集合中 存入session
  //     if (!_.isEqual(s.resUrl, "#"))
  //       this.routes.push({curr: s.resUrl, parent: menu.id});
  //
  //     if (this.from === s.resUrl) {
  //       this.root.from_route_p = menu.id;
  //       return;
  //     }
  //
  //     if (!this.figure.haveValue(s.children))
  //       return;
  //
  //     this.loopMenu(s);
  //   })
  //
  // }

  setCurSelected(sub) {
    this.leftMenuCur = sub.id;
  }

  click() {
    this.basic.removeLocal(this.Common.local.returnMenuCondition);
  }
}

angular.module('app.layout').directive('leftMenu', function (basicService, CommonCon) {
  return {
    restrict: "E",
    replace: true,
    templateUrl: "app/layout/menu/leftMenu.tpl.html",
    controller: LeftMenuController,
    controllerAs: "ctrl",
    link: function (scope, element) {
      // click on route link
      element.on("click", "li[flag='data-menu-collapse']>a", function () {
        // collapse all siblings to element parents and remove active markers
        const $body = $("body");
        if ($body.hasClass("minified")) {
          $body.removeClass("minified");


          setTimeout(function () {
            // 重新计算列宽的场合 屏蔽掉dataTable自动发起的ajax请求
            basicService.setSession(CommonCon.session_key.columnResizing, true);

            $('.dataTable').DataTable().columns.adjust().draw();
          }, 300);

        } else {
          $(this)
            .parents("li")
            .removeClass("active")
            .toggleClass("open")
            .siblings("li")
            .removeClass("open");
          $(this)
            .find(".collapse-sign .fa")
            .toggleClass("fa-angle-down")
            .parents("li")
            .siblings()
            .find(".collapse-sign .fa")
            .removeClass("fa-angle-down");
          let $li = $(this).parents("li");
          if (!$li.hasClass("open") && $li.find("li.active").length > 0) {
            $li.addClass("active");
          }
        }

      });
      element.on("click", "a[data-ui-sref]", function () {
        $(this)
          .parent("li")
          .addClass("active")
          .siblings("li")
          .removeClass("open active");
      });
    }
  }
});
