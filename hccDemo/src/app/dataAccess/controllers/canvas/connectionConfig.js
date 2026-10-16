
define(['language/dataAccess'], function (i18n) {
    "use strict";

    var connectionConfigCtrl = function ($rootScope, $scope, $compile,camel, mask,commonService,connectionConfig, processManager) {
        $scope.formData=connectionConfig.getFormData();
        $scope.formData.relationships=processManager.getSelectedProcess().relationships;
    };
    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyController('connectionConfig.ctrl', connectionConfigCtrl);
    return dataCraftModule;
});