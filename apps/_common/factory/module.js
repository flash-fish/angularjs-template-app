(function () {
  "use strict";
  angular.module("SmartAdmin.Factories", [])
    .provider("hsRoute", function () {

      /**
       * list 当中各变量的含义
       *
       * t: route title
       * u: route url
       * c: controller name & templateUrl file name & join router name
       * i: icon
       * nl: 表示当前页面初始化时不需要全局loading （no loading）
       */
      this.buildState = (stateProvider, menu, root) => {

        menu.list.forEach(s => {

          const route = menu.parent + s.c;
          const path = s.d ? `${root}${s.d}/` : root;

          const state = {
            url: `${s.u}`,
            data: {
              title: s.t,
              noLoading: s.nl
            },
            views: {
              "content@app": {
                controller: `${s.c}Ctrl`,
                controllerAs: "ctrl",
                templateUrl: `${path}${s.c}.tpl.html`
              }
            }
          };

          stateProvider.state(route, state);
        })
      };

      this.$get = function () {

      }
    });
})();
