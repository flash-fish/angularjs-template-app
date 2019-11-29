"use strict";

angular.module('app.home', ['ui.router'])
  .config(function ($stateProvider) {

    $stateProvider
      .state('app.home', {
        url: '/home',
        data: {
          title: '首页',
          noLoading: true
        },
        views: {
          "content": {
            templateUrl: 'app/home/views/home.tpl.html',
            controller: 'HomeController',
            controllerAs: 'ctrl'
          }
        },
        resolve: {
          srcipts: function (lazyScript) {
            return lazyScript.register([
              "build/vendor.ui.js"
            ])
          }
        }
      })
      .state('app.test', {
        url: '/test',
        data: {
          title: 'Test'
        },
        views: {
          "content": {
            templateUrl: 'app/home/views/test.tpl.html',
            controller: 'TestController',
            controllerAs: 'test'
          }
        },
        resolve: {
          srcipts: function (lazyScript) {
            return lazyScript.register([
              "build/vendor.ui.js"
            ])
          }
        }
      })
  });
