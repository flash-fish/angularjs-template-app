angular.module('app.home').directive('homeNotice', function () {

  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'app/home/directives/notice/notice.tpl.html',
    scope: {
      data: '<'
    },
    link: function ($scope) {
      $scope.isShow = () => {
        $scope.data = [];
      };
    }
  }
});

