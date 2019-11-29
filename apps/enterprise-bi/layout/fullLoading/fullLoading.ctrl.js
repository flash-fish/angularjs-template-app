angular.module('app.layout').directive('fullLoading', function () {
  return {
    restrict: "A",
    replace: true,
    templateUrl: "app/layout/fullLoading/fullLoading.tpl.html",
  }
});
