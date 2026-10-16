
define(["language/dataAccess"], function (keyID) {
    "use strict";
    var canvasService = function (camel, commonService,processManager) {

        /**
         * get processGroupInfo
         * @returns {*}
         */
    	 this.getProcessGroupPromise = function (groupId) {
    		var url = "./rest/api/v1/datacraft/controller/pipeline/root/getPipeline"
             var promise = camel.post({
                 url: url,
                 params: {pipelineId:groupId,version: commonService.getVersion()},
                 timeout: commonService.WAIT_TIME
             });
             return promise;
         };
         
         this.getComputeResoucesPromise = function(){
        	 var url = "./rest/api/v1/datacraft/controller/pipeline/root/getComputeResource";
        	 var promise = camel.get({
                 url: url,
                 params: {verbose: true},
                 timeout: commonService.WAIT_TIME
             });
             return promise;
        	 
         };

        /**
         * update processPosition
         * @param process
         * @returns {*|HttpPromise}
         */
        this.getUpdateProcessPromise = function (process) {
            var url = commonService.processGroupUrl + commonService.getGroupID() + "/processors/" + process.id;
            var params = {
                version: commonService.getVersion(),
                clientId: commonService.getClientID(),
                name:process.name,
                type:process.type,
                processType:process.processType,
                x: process.position.x,
                y: process.position.y
            };
            var promise = camel.post({
                url: url,
                params: params,
                timeout: commonService.WAIT_TIME
            });
            promise.then(function(response){
                commonService.setVersion(response.revision.version);
                commonService.setClientID(response.revision.clientId);
                /**TODO:update local process**/
            });
            return promise;
        };
    };
    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyService('canvasService', canvasService);
});
