
define(["language/dataAccess"], function (keyID) {
    "use strict";
    var operationLogsService = function ( camel) {
    	this.getOperationLogs = function (params) {
            var url="rest/api/v1/datacraft/pipelines/operationLogs";
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 12000
            });
            return promise;
        };
    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('operationLogsService', operationLogsService);
});