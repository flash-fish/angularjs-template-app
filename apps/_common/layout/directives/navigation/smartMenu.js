"use strict";

(function ($) {

    $.fn.smartCollapseToggle = function () {

        return this.each(function () {

            const $body = $('body');
            const $this = $(this);

            // only if not  'menu-on-top'
            if ($body.hasClass('menu-on-top')) {


            } else {

                $body.hasClass('mobile-view-activated');

                // toggle open
                $this.toggleClass('open');

                // for minified menu collapse only second level
                if ($body.hasClass('minified')) {
                    if ($this.closest('nav ul ul').length) {
                        $this.find('>a .collapse-sign .fa').toggleClass('fa-angle-down');
                        $this.find('ul:first').slideToggle(appConfig.menu_speed || 200);
                    }
                } else {
                    // toggle expand item
                    $this.find('>a .collapse-sign .fa').toggleClass('fa-angle-down');
                    $this.find('ul:first').slideToggle(appConfig.menu_speed || 200);
                }
            }
        });
    };
})(jQuery);

angular.module('SmartAdmin.Layout').directive('smartMenu', function ($state, $rootScope, CommonCon) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            const $body = $('body');
            const $collapsible = element.find('li[data-menu-collapse]');

            const bindEvents = function () {
                $collapsible.each(function (idx, li) {
                    const $li = $(li);
                    $li.on('click', '>a', function (e) {
                            if ($body.hasClass("minified")) {
                                // $body.removeClass("minified");
                                // 模拟点击minifyMenu， 达到chart自动resize的效果
                                $('.minifyMenu').click();
                                sessionStorage.setItem(CommonCon.session_key.left_menu_toggle, '2');
                            } else {
                                // collapse all open siblings
                                $li.siblings('.open').smartCollapseToggle();

                                // toggle element
                                $li.smartCollapseToggle();
                            }
                            // add active marker to collapsed element if it has active childs
                            if (!$li.hasClass('open') && $li.find('li.active').length > 0) {
                                $li.addClass('active')
                            }
                            e.preventDefault();

                        })
                        .find('>a').append('<b class="collapse-sign"><em class="fa fa-angle-right"></em></b>');

                    setTimeout(function () {
                        // initialization toggle
                        if ($li.find('li.active').length) {
                            $li.smartCollapseToggle();
                            $li.find('li.active').parents('li').addClass('active');
                        }

                        if ($body.hasClass("minified")) {
                          $li.removeClass('open');
                        }
                    });
                });
            };

            bindEvents();
            // click on route link
            element.on('click', 'a[data-ui-sref]', function () {
                // collapse all siblings to element parents and remove active markers
                $(this)
                    .parents('li').addClass('active')
                    .each(function () {
                        $(this).siblings('li.open').smartCollapseToggle();
                        $(this).siblings('li').removeClass('active')
                    });

                if ($body.hasClass('mobile-view-activated')) {
                    $rootScope.$broadcast('requestToggleMenu');
                }
            });


            scope.$on('$smartLayoutMenuOnTop', function (event, menuOnTop) {
                if (menuOnTop) {
                    $collapsible.filter('.open').smartCollapseToggle();
                }
            });
        }
    }
});

