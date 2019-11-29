angular.module("SmartAdmin.Directives").directive("limitLength", function() {
  return {
    require: "ngModel",
    restrict: "EA",
    scope: {
      maxLength: "@"
    },
    link: function(scope, ele, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function(inputValue) {
        if (inputValue == undefined) return "";

        let maxLength = +scope.maxLength;

        let transformedInput = inputValue;
        if (inputValue.length > maxLength) transformedInput = inputValue.slice(0, maxLength);


        if (transformedInput != inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }
        return transformedInput;
      });
    }
  };
});
