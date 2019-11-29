angular.module('SmartAdmin.Directives').directive('autoFocus', function ($timeout) {

  return {
    restrict: 'A',
    link: function ($scope, element) {
      $timeout(() => {
        $(element[0]).focus();
      }, 1000);
    }
  }
});
