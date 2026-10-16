define(['language/dataAccess'], function(i18n){

    var monitorService = function(camel, commonService){

        // Get data async for history list
        this.getHistoryListPromise = function(params){

        	var url = 'rest/api/v1/datacraft/monitor/getHistorylist/' + commonService.getQueryParam("groupId");
            var promise = camel.get({
                url: url,
                params: params,
                timeout:12000
            });
            promise.then(function(response){

            });
            return promise;
        };

        this.getActivitiesListPromise = function (params) {

            var url = 'rest/api/v1/datacraft/monitor/getActivitieslist/' + params.pipelineInstanceId;
            delete params.pipelineInstanceId;

            var promise = camel.get({
                url: url,
                params:params,
                timeout: commonService.WAIT_TIME
            });
            promise.then(function(response){

            });
            return promise;
        };

        this.getDataProvenanceListPromise = function (params) {

            // url with './rest/demo' prefix is a test url
            var url = './rest/demo/getdataprovenancelist/' + commonService.getQueryParam("groupId");

            var promise = camel.get({
                url: url,
                params: params,
                timeout: commonService.WAIT_TIME
            });
            promise.then(function(response){

            });
            return promise;
        };
    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('monitorService',monitorService);
});