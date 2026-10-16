define(['language/dataAccess'], function (i18n) {
    "use strict";

    var canvasMsgPanelCtrl = function ($rootScope, $scope, mask, commonService, clusterManager, $timeout, timeService, activityManager,processManager, editorLayout) {
        $scope.i18n = i18n;
        $scope.isCollapse = false;
        $scope.toggleShow = function () {
            if ($scope.isCollapse) {
                $(".msg-collapse-bar").eq(0).css({ transform: 'rotate(0)' });
                $("#msg-panel").eq(0).css({ transform: '' });
            } else {
                $(".msg-collapse-bar").eq(0).css({ transform: 'rotate(180deg)' });
                $("#msg-panel").eq(0).css({ transform: 'translate(0,108px)' });
            }
            $scope.isCollapse = !$scope.isCollapse;
        };
        $scope.processorClick = function (processor) {
            $timeout(function () {
                // $("#" + processor.id).eq(0).mousedown();
            	
            	processManager.setSelectedProcess(processor);
                editorLayout.getConfigurationPanelLayout().ifShow = true;
            }, 0);
        }
        
        $scope.levelClass = { // UCD 3.0 need to change to cmn-color-*
            INFO: 'common-color-info',
            WARN: 'common-color-important', // common-color-warn color is too light
            ERROR: 'common-color-error',
            SUCCESS: 'common-color-success'
        };
        $scope.messages = activityManager.getCanvasMsgs();
        
        $scope.$watch(function () {
            return editorLayout.getConfigurationPanelLayout().ifShow;
        }, function () {
            if (editorLayout.getConfigurationPanelLayout().ifShow) {
                // 257px + 520px
            	$("#msg-panel").eq(0).css({ width: 'calc(100% - 777px)' });
            } else {
            	$("#msg-panel").eq(0).css({ width: 'calc(100% - 257px)' });
            }
        });
    }
    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyController('canvasMsgPanel.ctrl', canvasMsgPanelCtrl);
    return dataCraftModule;
});