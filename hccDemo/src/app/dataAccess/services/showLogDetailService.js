define(["language/dataAccess"], function (i18n) {
    "use strict";

    var showLogDetailService = function (camel) {
        var logPath;
        this.setLogPath=function(path){
            logPath=path;
        };
        this.getLogPath=function(){
            return logPath;
        }
        this.getOpetationLogDeatils = function (params) {
            var url="rest/api/v1/datacraft/logview?userObsPath="+params;
            var promise = camel.get({
                url: url,
                timeout: 12000
            });
            return promise;
        };
    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('showLogDetailService', showLogDetailService);
});