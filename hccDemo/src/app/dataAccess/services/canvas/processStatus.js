
 
define(["language/dataAccess"], function (keyID) {
    "use strict";
    var processStatus = function (camel,commonService,processManager) {
        function updateStatus(){
            var url=commonService.processGroupUrl+commonService.getGroupID()+"/status";
            var params= {};
            var promise=camel.get({
                url: url,
                params: params,
                beforeSend:function(request,setting) {},
                timeout: commonService.WAIT_TIME
            });
            return promise.then(function(response){
                response.revision&&response.revision.clientId&&commonService.setClientID(response.revision.clientId);
                var statusArray=response.processGroupStatus.processorStatus;
                var processStatistics={
                    running:0,
                    stopped:0,
                    warning:0,
                    error:0
                };
                for(var i=0;i<statusArray.length;i++){
                    processManager.refreshLocalProcess(statusArray[i]);
                    switch(statusArray[i].runStatus){
                        case "Invalid":processStatistics.warning++;
                            break;
                        case "Running":processStatistics.running++;
                            break;
                        case "Stopped":processStatistics.stopped++;
                            break;
                        default :
                            processStatistics.error++;
                    }
                }
                processManager.setProcessStatistics(processStatistics);
                return promise;
            },function(response){
                console.log("fail to add new processor node");
                return promise;
            })
        }

        /**
         * call this to start status refresh
         */
        this.refreshStatus=function() {
            return updateStatus();
        }

    };

    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyService('processStatus', processStatus);
});