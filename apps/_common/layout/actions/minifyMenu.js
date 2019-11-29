"use strict";

angular.module('SmartAdmin.Layout').directive('minifyMenu',
  function ($rootScope, CommonCon, $timeout, basicService, toolService) {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var $body = $('body');
        var minifyMenu = function () {
          if (!$body.hasClass("menu-on-top")) {
            $body.toggleClass("minified");
            $body.removeClass("hidden-menu");
            $('html').removeClass("hidden-menu-mobile-lock");
          }

          $rootScope.menuHidden = !$rootScope.menuHidden;

          // 菜单栏toggle时 触发chart resize事件
          // 添加了首页饼图 不过 chart 应该统一一个标签
          let trend = $('.chart-div');
          let sideWidth = $(element).width();

          for (let i = 0; i < trend.length; i++) {
            let current = trend[i];
            $('aside').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', () => {
              $(current).width($(current).parent().width());
              let myChart = echarts.getInstanceByDom(current);
              if (myChart) myChart.resize();
            });
          }

          // 切换菜单栏的时候 将状态存入session (1: 收缩， 2: 展开)
          let state = '';
          sideWidth > 100 ? state = 1 : state = 2;
          sessionStorage.setItem(CommonCon.session_key.left_menu_toggle, state);

          // 菜单栏toggle时 触发table column resize事件
          if ($('.dataTable tbody tr')[0] && !$('.dataTable tbody tr')[0].innerText.includes('没有数据')) {
            $timeout(function () {
              // 重新计算列宽的场合 屏蔽掉dataTable自动发起的ajax请求
              basicService.setSession(CommonCon.session_key.columnResizing, true);

              $('.dataTable').DataTable().columns.adjust().draw();
            }, 300);
          }

          //重置treeGrid的宽度
          $timeout(() => {
            toolService.resizeTree();
          }, 300)

        };
        element.on('click', minifyMenu);
      }
    }
  });
