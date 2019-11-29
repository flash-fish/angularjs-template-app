angular.module("SmartAdmin.Directives").directive("numberic", function() {
  return {
    require: "ngModel",
    restrict: "EA",
    scope: {
      max: "@",
      maxLength: "@",
      min: "@"
    },
    link: function(scope, ele, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function(inputValue) {
        if (inputValue == undefined) {
          return "";
        }
        let max = +scope.max;
        let maxLength = +scope.maxLength;
        let min = +scope.min;
        let transformedInput = inputValue.replace(/[^\d]/g, "");
        if (maxLength && inputValue.length > maxLength) {
          transformedInput = inputValue.slice(0, maxLength);
        }
        if (max && +transformedInput > max) {
          transformedInput = max + "";
        }
        if (min && +transformedInput < min) {
          transformedInput = "";
        }
        if (transformedInput != inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }
        return transformedInput;
      });
    }
  };
});
