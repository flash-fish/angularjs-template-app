angular.module('SmartAdmin.Directives').directive('notice', function ($compile) {

  return {
    restrict: 'A',
    replace: true,
    template: '<div class="systemNotice"><a href=""  class="closeFlag"  ng-click="isShow()"></a></div>',
    scope: {
      data: '<',
      show: '='
    },
    link: function ($scope, element) {
      $scope.isShow = () => {
        $scope.show = false;
      };

      $scope.$watch('data', val => {
        if (!val) return;

        val.forEach(d => {
          let compileFn = $compile(`<p><i class="fa fa-exclamation-circle"></i>${d}</p>`);
          compileFn($scope, (c) => {
            element.append(c);
          });
        })
      })
    }
  }
});

