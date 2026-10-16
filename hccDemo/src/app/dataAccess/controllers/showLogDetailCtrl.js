define(['language/dataAccess','src/app/common/commonInfo'],
    function(i18n, commonInfo) {
        "use strict";
        var showLogDetailCtrl = function($rootScope, $scope, $state, $stateParams, $compile, mask, showLogDetailService, commonService, timeService,storage) {
            $scope.commonInfo = commonInfo;
            $scope.i18n = i18n;
            $scope.backLinkMonit = window.location.search + '#/manage/pipelineMonitor';
            var logPath=showLogDetailService.getLogPath();
            $scope.currentLogPath = logPath?logPath:storage.get("logPath");
            showLogDetailService.getOpetationLogDeatils($scope.currentLogPath).then(function (response) {
                $("#logsContent").html(response);
            },function(response){
                if(response.status == 200){
                    $("#logsContent").html(response);
                }else{
                    commonService.netErrorTip(i18n,response);
                }
            })
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('showLogDetail.ctrl', showLogDetailCtrl);
        return dataAccessModule;
    });