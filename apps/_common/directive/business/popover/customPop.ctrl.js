angular.module('SmartAdmin.Directives').directive('customPop', function () {
  return {
    restrict: 'A',
    templateUrl: "app/directive/business/popover/customPop.tpl.html",
    scope: {
      id: '<',
      list: '<',
      tab: '='
    },
    controller: function ($scope) {
      
      $scope.over = () => {
        $scope.show = true;
      };
  
      $scope.leave = () => {
        
        const ele = $(".popover");
        ele.hover(() => {
          $scope.hover = true;
        }, () => {
          $scope.hover = false;
          $scope.show = false;
        });
  
        if (!$scope.hover) {
          setTimeout(function () {
            $scope.show = false;
          }, 200);
        }
      };

      $scope.switch = (index) => {
        $scope.tab = index;
      }
    }
  }
});
