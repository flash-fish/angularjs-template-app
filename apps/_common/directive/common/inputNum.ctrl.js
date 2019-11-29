'use strict';
angular.module('SmartAdmin.Directives')
  .factory('StringUtil', function () {
    return {
      isValid: (value, reg) =>  _.isUndefined(value) || _.isNull(value) || _.isEmpty(value.toString()) || !value.toString().replace(reg, '').substr(0, 10).length
    }
  })
  //整数
  .directive('inputNum', function (StringUtil) {
    return {
      require: '^ngModel',
      scope: true,
      link: function (scope, el, attrs, ngModelCtrl) {

        function formatter(value) {
          const reg = /[^0-9_-]/g;
          let valueValid = StringUtil.isValid(value, reg);
          value = valueValid ? '' : _.eq(value.toString().replace(reg, ''), '-') ? '-' : parseInt(value.toString().replace(reg, '').substr(0, 10));
          let formattedValue = value;
          el.val(formattedValue);
          ngModelCtrl.$setViewValue(value);
          return formattedValue;
        }

        ngModelCtrl.$formatters.push(formatter);

        el.bind('keyup', function () {
          formatter(el.val());
        });
      }
    };
  })
  //正整数
  .directive('inputPositiveInt', function (StringUtil) {
    return {
      require: '^ngModel',
      scope: true,
      link: function (scope, el, attrs, ngModelCtrl) {

        function formatter(value) {
          const reg = /[^0-9]/g;
          let valueValid = StringUtil.isValid(value, reg);
          value = valueValid || _.eq(value.toString().replace(reg, ''), '0') ? '' : parseInt(value.toString().replace(reg, '').substr(0, 10));
          let formattedValue = value;
          el.val(formattedValue);
          ngModelCtrl.$setViewValue(value);
          return formattedValue;
        }

        ngModelCtrl.$formatters.push(formatter);

        el.bind('keyup', function () {
          formatter(el.val());
        });
      }
    };
  });
