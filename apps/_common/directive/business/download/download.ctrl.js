angular.module('SmartAdmin.Directives')
  .directive('download', function () {
    return {
      restrict: 'E',
      replace: true,
      template: '<a href="" class="download" ng-click="download()">下载<i class="fa fa-download"></i></a>',
      scope: {
        param: '<',
        keys: '<'
      },
      controller: function ($scope) {
        $scope.download = () => {
          const name = $scope.keys.download.name;
          $.download.post(name, $scope.param);
        }
      }
    };
  });
