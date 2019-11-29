'use strict'

angular.module('SmartAdmin.Forms').directive('smartSelect2', function (lazyScript) {
    return {
        restrict: 'A',
        compile: function (element, attributes) {
            element.hide().removeAttr('smart-select2 data-smart-select2');
            const promise = lazyScript.register('build/vendor.ui.js');
            return function (s, e) {
                promise.then(function(){
                    e.show().select2();
                });
            };
        }
    }
});