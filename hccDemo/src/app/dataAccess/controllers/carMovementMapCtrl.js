define(
    ['language/dataAccess', "app-remote/services/tipMsgService", 'src/app/common/commonInfo', 'echarts', 'shanghai', 'baidu'],
    function(i18n, tipMsgService, commonInfo, echarts, shanghai, baidu) {
        "use strict";
        var carMovementMapCtrl = function($rootScope, $scope, $state, $stateParams, $compile, mask, instanceListService, commonService, timeService, storage, camel) {
            $scope.i18n = i18n;
            addMap("carMovemntMapContainer");
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('carMovementMap.ctrl', carMovementMapCtrl);
        return dataAccessModule;
    });
