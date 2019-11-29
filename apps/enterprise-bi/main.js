'use strict';

$.sound_path = appConfig.sound_path;
$.sound_on = appConfig.sound_on;

$(function () {
  
  // moment.js default language
  moment.locale('cn');
  
  (function ($) {
    if (!$) {
      console.warn('jQuery is not defined');
      return;
    }
    
    function newId() {
      return 'DOWN' + Math.random().toString().substr(2, 5);
    }
    
    function createIframe(newId) {
      return $('<iframe>').attr({
        id: newId,
        name: newId,
        style: 'display:none'
      });
    }
    
    $.download = {
      post: function post(url, param, callback, context) {
        let id = newId();
        let $form = $('<form>').attr({
          action: url,
          method: 'POST',
          style: 'display:none',
          target: id
        });
        let $hiddens = $.map(param, function (val, name) {
          return $('<input type="hidden">').attr({
            id: name,
            name: name,
            value: val
          });
        });
        let $frame = createIframe(id);
        $('body').append($form.append($hiddens), $frame);
        $frame.on('load', function () {
          let responseContent = $frame.contents().find('body').text();
          if (callback) callback(responseContent, param, context);
          $form.remove();
          $frame.remove();
        });
        $form.submit();
      },
      get: function get(url, param, callback, context) {
        let id = newId();
        let $frame = createIframe(id);
        $('body').append($frame);
        $frame.on('load', function () {
          let responseContent = $frame.contents().find('body').text();
          if (callback) callback(responseContent, param, context);
          $frame.remove();
        });
        $frame[0].contentWindow.href = url + '?' + $.param(param);
      }
    };
  })(window['jQuery']);
  
  angular.bootstrap(document, ['app']);
  
});
