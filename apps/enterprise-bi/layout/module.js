"use strict";


angular.module('app.layout', ['ui.router'])

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('app', {
        abstract: true,
        views: {
          root: {
            templateUrl: 'app/layout/layout.tpl.html'
          }
        }
      })
      .state('app.sub', {
        abstract: true,
        views: {
          "content@app": {
            templateUrl: 'app/layout/sub-layout.tpl.html'
          }
        }
      })
      .state('error', {
        url: '/error',
        data: {
          noLoading: true
        },
        views: {
          root: {
            templateUrl: 'app/layout/error.tpl.html'
          }
        }
      });
    $urlRouterProvider.otherwise('/home');

  });

