define(
    ['language/dataAccess', "app-remote/services/tipMsgService", 'src/app/common/commonInfo', 'echarts','baidu'],
    function (i18n, tipMsgService, commonInfo,echarts,baidu) {
        "use strict";
        var uQueryMapCtrl = function ($rootScope, $scope, $state, $stateParams, $compile, mask) {
        	addMap("uQueryMapContainer");
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('uQueryMap.ctrl', uQueryMapCtrl);
        return dataAccessModule;
    });
