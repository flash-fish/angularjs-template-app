"use strict";

angular.module('SmartAdmin.Layout').directive('widgetGrid', function ($rootScope, $transitions, $compile, $q, $state, $timeout) {

    let jarvisWidgetsDefaults = {
        grid: 'article',
        widgets: '.jarviswidget',
        localStorage: true,
        deleteSettingsKey: '#deletesettingskey-options',
        settingsKeyLabel: 'Reset settings?',
        deletePositionKey: '#deletepositionkey-options',
        positionKeyLabel: 'Reset position?',
        sortable: true,
        buttonsHidden: false,
        // toggle button
        toggleButton: true,
        toggleClass: 'fa fa-minus | fa fa-plus',
        toggleSpeed: 200,
        onToggle: function () {
        },
        // delete btn
        deleteButton: true,
        deleteMsg: 'Warning: This action cannot be undone!',
        deleteClass: 'fa fa-times',
        deleteSpeed: 200,
        onDelete: function () {
        },
        // edit btn
        editButton: true,
        editPlaceholder: '.jarviswidget-editbox',
        editClass: 'fa fa-cog | fa fa-save',
        editSpeed: 200,
        onEdit: function () {
        },
        // color button
        colorButton: true,
        // full screen
        fullscreenButton: true,
        fullscreenClass: 'fa fa-expand | fa fa-compress',
        fullscreenDiff: 3,
        onFullscreen: function () {
        },
        // custom btn
        customButton: false,
        customClass: 'folder-10 | next-10',
        customStart: function () {
            alert('Hello you, this is a custom button...');
        },
        customEnd: function () {
            alert('bye, till next time...');
        },
        // order
        buttonOrder: '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
        opacity: 1.0,
        dragHandle: '> header',
        placeholderClass: 'jarviswidget-placeholder',
        indicator: true,
        indicatorTime: 600,
        ajax: true,
        timestampPlaceholder: '.jarviswidget-timestamp',
        timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
        refreshButton: true,
        refreshButtonClass: 'fa fa-refresh',
        labelError: 'Sorry but there was a error:',
        labelUpdated: 'Last Update:',
        labelRefresh: 'Refresh',
        labelDelete: 'Delete widget:',
        afterLoad: function () {
        },
        rtl: false, // best not to toggle this!
        onChange: function () {

        },
        onSave: function () {

        },
        ajaxnav: true

    }

    let dispatchedWidgetIds = [];
    let setupWaiting = false;

    let debug = 1;

    let setupWidgets = function (element, widgetIds) {

        if (!setupWaiting) {

            if (_.intersection(widgetIds, dispatchedWidgetIds).length !== widgetIds.length) {

                dispatchedWidgetIds = _.union(widgetIds, dispatchedWidgetIds);

                console.debug('setupWidgets', debug++);

                element.data('jarvisWidgets') && element.data('jarvisWidgets').destroy();
                element.jarvisWidgets(jarvisWidgetsDefaults);
                initDropdowns(widgetIds);
            }

        } else {
            if (!setupWaiting) {
                setupWaiting = true;
                $timeout(function () {
                    setupWaiting = false;
                    setupWidgets(element, widgetIds)
                }, 200);
            }
        }

    };

    let destroyWidgets = function (element, widgetIds) {
        element.data('jarvisWidgets') && element.data('jarvisWidgets').destroy();
        dispatchedWidgetIds = _.xor(dispatchedWidgetIds, widgetIds);
    };

    let initDropdowns = function (widgetIds) {
        angular.forEach(widgetIds, function (wid) {
            $('#' + wid + ' [data-toggle="dropdown"]').each(function () {
                let $parent = $(this).parent();
                // $(this).removeAttr('data-toggle');
                if (!$parent.attr('dropdown')) {
                    $(this).removeAttr('href');
                    $parent.attr('dropdown', '');
                    let compiled = $compile($parent)($parent.scope());
                    $parent.replaceWith(compiled);
                }
            })
        });
    };

    let jarvisWidgetAddedOff,
        $viewContentLoadedOff,
        $stateChangeStartOff;

    return {
        restrict: 'A',
        compile: function (element) {

            element.removeAttr('widget-grid data-widget-grid');

            let widgetIds = [];

            $viewContentLoadedOff = $rootScope.$on('$viewContentLoaded', function (event, data) {
                $timeout(function () {
                    setupWidgets(element, widgetIds)
                }, 100);
            });

            $stateChangeStartOff = $transitions.onStart({ }, function() {
                jarvisWidgetAddedOff();
                $viewContentLoadedOff();
                $stateChangeStartOff();
                destroyWidgets(element, widgetIds)
            });

            jarvisWidgetAddedOff = $rootScope.$on('jarvisWidgetAdded', function (event, widget) {

                if (widgetIds.indexOf(widget.attr('id')) === -1) {
                    widgetIds.push(widget.attr('id'));
                    $timeout(function () {
                        setupWidgets(element, widgetIds)
                    }, 100);
                }

            });

        }
    }
});