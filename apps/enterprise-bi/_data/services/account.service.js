const _SESSION_UID = 'account.authenticated';
const _SESSION_AUTH_RU = 'auth.return-url';

angular.module('app').service('account', class AccountService {

  constructor(action, ajaxService) {
    this.action = action;
    this.ajaxService = ajaxService;
    this.storage = sessionStorage;
  }

  getUser() {
    return this.ajaxService.post(this.action.auth.user, null, {isAuthc: true, intercept: false});
  }

  get returnUrl() {
    return this.storage.getItem(_SESSION_AUTH_RU);
  }

  set returnUrl(value) {
    this.storage.setItem(_SESSION_AUTH_RU, value);
  }

  get uid() {
    return angular.fromJson(this.storage.getItem(_SESSION_UID));
  }

  set uid(value) {
    this.storage.setItem(_SESSION_UID, angular.toJson(value));
  }
}).run(function (account, $location, $rootScope, alert, ajaxService, basicService, Common) {

  // 对指定页面跳过检查
  const path = $location.path();
  const skipPaths = ['/platform'];

  if (_.some(skipPaths, i => i === path)) {
    console.log('跳过认证检查，当前 path:', path, '当前配置:', skipPaths);
    ajaxService.offHolding();
    return;
  }

  basicService.packager(account.getUser(), function (data) {

    if (data.isUnauthorized()) {
      $rootScope.$broadcast("unauthenticated");
      return;
    }

    if (!data.isSuccess()) {
      if (data.message) {
        return alert(data.message);
      }
      return;
    }

    const goHome = basicService.isGoHome();
    if (goHome) {
      sessionStorage.clear();
    }

    account.uid = data.data;

    $rootScope.initUserFinish = true;
    basicService.initRootUser(data.data, Common.module);

    if (goHome) $rootScope.getAuthUser({reloadOnce: false, notReGetUser: true});

    // 检查本地有跳转地址，如果有进行跳转
    const url = account.returnUrl;
    if (url) {
      $location.url(url);
    }
  });

});
