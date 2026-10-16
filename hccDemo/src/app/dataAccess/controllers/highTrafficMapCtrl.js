define(
    ['language/dataAccess', "app-remote/services/tipMsgService", 'src/app/common/commonInfo', 'echarts','baidu'],
    function (i18n, tipMsgService, commonInfo,echarts,baidu) {
        "use strict";
        var highTrafficMapCtrl = function ($rootScope, $scope, $state, $stateParams, $compile, mask, instanceListService, commonService, timeService, storage, camel) {
        	addMap("highTrafficMapContainer");
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('highTrafficMap.ctrl', highTrafficMapCtrl);
        return dataAccessModule;
    });
