define(['language/dataAccess', 'src/app/common/commonInfo'], function (i18n, commonInfo) {
    "use strict";

    var createOrderCtrl = function ($rootScope, $scope, $state, commonService) {
        $scope.commonInfo = commonInfo;
        $scope.i18n = i18n;
        var ENVIRONMENT_FLag = commonService.getEnvironmentFlag();
        /*西电和HEC版本了解更多链接拼接方式不同*/
        if(ENVIRONMENT_FLag){
            $scope.LearnMoreLink=commonInfo.dpsPipelineListPageUrl.hws.helpPagePath;
        }else{
            $scope.LearnMoreLink=commonInfo.dpsPipelineListPageUrl.tef.helpPagePath;
        }

        if ($state.includes("manage.createOrder.createOrderConfig")) {
            $rootScope.step = {curStep: 1};//标示当前创建订购服务执行到的步骤
        } else if ($state.includes("manage.createOrder.examineConfigure")) {
            $rootScope.step = {curStep: 2};
        }
    };
    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyController('createOrder.ctrl', createOrderCtrl);
    return dataAccessModule;
});