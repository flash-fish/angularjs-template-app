'use strict';

angular.module('app', [
  'ngSanitize',
  'ngAnimate',
  'ui.router',
  'ui.router.state.events',
  'ui.bootstrap',
  'ngCookies',
  'datatables',
  'datatables.bootstrap',
  'datatables.fixedcolumns',

  // Smartadmin Angular Common Module
  'SmartAdmin',
  'localytics.directives',

  // App
  'hs.popups',
  'app.layout',
  'app.datas',
  'app.home',
  'hs.warning',
  'hs.supplier.adviser',
  'hs.supplier.saleStock',
  'hs.saleStock',
  'hs.productAnalyze.news',
  'hs.productAnalyze.view',
  'hs.synthesizeAnalyze',
  'hs.classesAnalyze',
  'vo.ui-bootstrap-dialogs',
  'vo.resources',
])
  .constant('APP_CONFIG', window.appConfig)
  .constant('API_URL', window.API_URL)

  .config(function ($provide, $httpProvider) {
    // Intercept http calls.
    $provide.factory('ErrorHttpInterceptor', function ($q, $state) {
      // let errorCounter = 0;
      function notifyError(rejection) {
        if (rejection && rejection.config.url === '/statistics-url/append') return;
        // $state.go('error');
      }

      return {
        // On response failure
        responseError: function (rejection) {
          // show notification
          notifyError(rejection);
          // Return the promise rejection.
          return $q.reject(rejection);
        }
      };
    });

    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('ErrorHttpInterceptor');

  })

  .run(function ($rootScope, Common, $transitions, basicService, CommonCon) {
    $rootScope.$on('$locationChangeStart', function (event, next, curr) {
      $(window).scrollTop(0);
    });

    /**
     * 监听路由变化
     * 如果不是包含子菜单的页面 直接将当前路由作为父路由
     */
    $transitions.onStart({}, (transition) => {
      const toRoute = transition.to();
      const isSub = toRoute.url.includes('hs_sub');
      const noLimit = ["app.home", "error"];

      // 判断当前路由对应的页面是否需要初始化全屏loading
      if (toRoute.data) {
        $rootScope.fullLoadingShow = !toRoute.data.noLoading;
      }

      // 子菜单的页面init 收起主菜单
      const $body = $('body'), $menu = $(".sub-menu");
      if (!isSub) $menu.css('display', 'none');
      isSub ? $body.addClass('minified') : $body.removeClass('minified');

      $rootScope.from_route = isSub ? angular.fromJson(transition.params().info).from : toRoute.name;

      // 判断当前所要访问的页面是不是在用户菜单权限范围之内
      const visible = basicService.getSession(Common.visiblePage);

      if (visible) {
        // 获取当前路由菜单对应的父级菜单
        const filter = visible.filter(s => s.curr === $rootScope.from_route)[0];
        if (filter) $rootScope.from_route_p = filter.parent;
      }

      if (!noLimit.includes(toRoute.name) && visible && !visible.map(s => s.curr).includes($rootScope.from_route)) {
        $rootScope.fullLoadingShow = false;
        return transition.router.stateService.target("app.home");
      }
    });

  })

  .run(function ($rootScope, ajaxService, $q, $state, action, $location, basicService, Common, Version, toolService, CommonCon) {
    $rootScope.$state = $state;
    $rootScope.initUserFinish = true;

    const data = {
      local: Common.local,
      version: Version,
      url: action.auth.login,
      module: Common.module,
      fieldLocal: CommonCon.local
    };

    $rootScope.logout = () => {
      basicService.packager(ajaxService.post(action.auth.logout), () => {
        ajaxService.holdingUnAuthRequest();

        getLoginUrl(ajaxService, basicService, data);
      });
    };

    $rootScope.$on("unauthenticated", function () {
      sessionStorage.clear();
      getLoginUrl(ajaxService, basicService, data);
    });

    $rootScope.showRoles = () => $rootScope.showJob = !$rootScope.showJob;

    $rootScope.getAuthUser = (option) => {
      const _service = Object.assign({}, {ajaxService}, {basicService}, {toolService});
      getAuthUser($rootScope, Object.assign({}, data, {module: Common.module}), action, $state, _service, option);
    };

    //切换岗位
    $rootScope.changeRole = param => {
      basicService.packager(ajaxService.post(action.auth.changeRole, param), () => {
        $rootScope.getAuthUser({noRemoveLocal: true, changeRole: true, reloadOnce: true});
      });
    };

    $rootScope.reject = () => {
      if (basicService.isGoHome()) {
        $rootScope.getAuthUser({noRemoveLocal: true, reloadOnce: true});
        return true;
      }
      return false;
    };

    $rootScope.rejectRequest = () => {
      return $q.reject('not match role');
    }
  })

  .run(function (alert) {
    if (navigator.appName === "Microsoft Internet Explorer" &&
      parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) < 9) {
      alert("您的浏览器版本过低，请升级到最新版本");
    }
  })

  .run(function ($transitions, ajaxService, $location, $rootScope) {
    // // 新增页面统计
    $transitions.onSuccess({}, (transition) => {
      if (!$rootScope.currentJob || !$rootScope.user) {
        return;
      }
      ajaxService.post('/statistics-url/append', {
        dateCode: moment().format('YYYYMM'),
        subSystem: 22,
        clientType: 0,
        protocol: $location.protocol(),
        host: $location.host(),
        path: window.location.pathname,
        stateName: transition.to().name,
        statePath: transition.to().url,
        userType: 5,
        userId: $rootScope.user.userCode,
        supplierId: $rootScope.currentJob.id,
      });
    });
  })

  .run(function (templateCache) {
    // 初始化一些templateCache
    templateCache.initTemplate();
  });


function getLoginUrl(ajax, basic, data) {

  // 退出时要按照jobId 将condition给清掉
  const {moduleJobs} = basic.getSession('account.authenticated');
  let currentModuleJobs;
  if (moduleJobs) {
    currentModuleJobs = moduleJobs[data.module];
  }
  const splitStr = '_';

  sessionStorage.clear();

  // 清空local里condition
  _.forIn(data.local, (val, key) => {
    data.version.last.forEach(l => {
      localStorage.removeItem(val + l);
      if (currentModuleJobs) {
        currentModuleJobs.jobs.forEach(job => {
          const localKey = val + splitStr + job.id + l;
          localStorage.removeItem(localKey);
        })
      }
    });
    localStorage.removeItem(val + data.version.current);
    if (currentModuleJobs) {
      currentModuleJobs.jobs.forEach(job => {
        const localKey = val + splitStr + job.id + data.version.current;
        localStorage.removeItem(localKey);
      })
    }
  });

  // 登出时，将过期版本的指标清掉
  _.forIn(data.fieldLocal, (val, key) => {
    data.version.last.forEach(l => {
      localStorage.removeItem(val + l);
      if (currentModuleJobs) {
        currentModuleJobs.jobs.forEach(job => {
          const localKey = val + splitStr + job.id + l;
          localStorage.removeItem(localKey);
        })
      }
    });
  });

  function interceptUrl(url) {
    let str = url.split("/#!/");
    return str.length > 1 ? str[0] : url;
  }

  basic.packager(ajax.post(data.url, null, {needAuthc: false}), res => {
    location.href = `${res.data.loginUrl}/#!/login?url=${encodeURIComponent(interceptUrl(location.href))}`;
  });
}

function getAuthUser(rootScope, data, action, state, service, option) {

  //初始化用户信息是否结束
  if (!rootScope.initUserFinish) return;
  rootScope.initUserFinish = false;

  //刷新时在account 已经重新调了user接口
  if (option.notReGetUser)
    doGetAuthUser(rootScope, data, action, state, service, option);
  else
    service.ajaxService.post(action.auth.user, null).then(res => {
      //清空session
      sessionStorage.clear();
      doGetAuthUser(rootScope, data, action, state, service, option, res.data)
    });
}

function doGetAuthUser(rootScope, data, action, state, service, option, userData) {
  const home = 'app.home';
  //清空权限\条件
  if (!option || (option && !option.noRemoveLocal)) {
    _.forIn(data.local, (val, key) => {
      data.version.last.forEach(l => service.basicService.removeLocal(val + l, true));
      service.basicService.removeLocal(val);
    });
  }
  //重设用户信息
  if (userData) {
    service.basicService.initRootUser(userData, data.module);
    service.basicService.setSession('account.authenticated', userData);
  }
  //当前页在home情况
  if (rootScope.from_route === home) {
    service.toolService.getAccess(() => service.toolService.getMenu(), () => {
      if (option.reloadOnce) window.location.reload();
    });
  } else {
    service.basicService.setSession('changeRole', true);
    state.go(home);
  }
  rootScope.showJob = false;
  rootScope.initUserFinish = true;
}
