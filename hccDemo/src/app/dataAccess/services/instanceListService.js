
define(["language/dataAccess"], function (keyID) {
    "use strict";
    var instanceListService = function ( camel) {
        //get user quotas
        this.getQuotas = function(projectId){
            var url="rest/api/v1/datacraft/quotas/"+projectId+"/get-quotas";
            var promise = camel.get({
                url: url,
                params: {},
                timeout: 50000
            });
            return promise;
        };
        //get pipeline list
        this.getInstanceList = function (params) {
        	//"I am init."
            var url="rest/api/v1/datacraft/pipelines";
            var promise = camel.post({
                url: url,
                params: params,
                timeout: 50000
            });
            return promise;
        };

        //get pipeline schedule information
        this.getScheduleInfo = function(pipelineid){
          var url = "rest/api/v1/datacraft/getschedule/"+pipelineid;
            var promise = camel.get({
                url :url,
                params:{},
                timeout:12000
            });
            return promise;
        };

        //to get promise which is used to stop instancehttp://10.93.156.181:1888/nifi-api/controller/process-groups/root/process-group-references/"+ $('#id').val() + "?version=" + version
        this.deletePipelineTest = function (params) {
            var url="rest/api/v1/datacraft/deletePipeline";
            var promise = camel.post({
                url: url,
                params: params,
                timeout: 12000
            });
            return promise;
        };
        

        this.unschedulePipelineJob= function (id){
        	var url="rest/api/v1/datacraft/unschedulePipelineJob/"+id;
        	//"i am schedule stop button."
            var promise = camel.put({
                url: url,
               timeout: 12000
            });
            return promise;
        };
        this.editchedulePipelineTest = function (id){
        	var url="rest/api/v1/datacraft/editschedulePipeline/"+id;
            var promise = camel.put({
                url: url,
               timeout: 12000
            });
            return promise;
        };
        //get order information
        this.getPipelineOrderInfo = function (id){
            //"I am order information button"
            var url="rest/api/v1/datacraft/getPipelineOrderInfo/"+id;
            var promise = camel.get({
                url: url,
                timeout: 12000
            });
            return promise;
        };
        //get pipeline information
        this.getPipelineInfo = function(pipelineId){
            var url="rest/api/v1/datacraft/pipeline-detail?pipelineID="+pipelineId;
           /* var url="rest/api/v1/pipeline/root/pipeline-detail"*/
            var promise = camel.get({
                url: url,
                timeout: 12000
            });
            return promise;
        };

        //stop schedule task
        this.deletescheduleTest = function (id){
        	//"I am schedule delete button"
        	var url="rest/api/v1/datacraft/deleteschedule/"+id;
            var promise = camel.deleter({
                url: url,
               timeout: 12000
            });
            return promise;
        };

        //restore pipeline
        this.restorePipeline = function (id){
            //"I am schedule delete button"
            var url="rest/api/v1/datacraft/restorePipeline/"+id;
            var promise = camel.put({
                url: url,
                timeout: 12000
            });
            return promise;
        };

        //save schedule period
        this.savescheduler= function (params){
        	var url="rest/api/v1/datacraft/saveschedule";
            var promise = camel.put({
                url: url,
                params: params,
                timeout: 12000
            });
            return promise;
        };

        //stop pipeline schedule
        this.stoppipelineonce= function (params){
        	var url="rest/api/v1/datacraft/stoppipelineonce/"+params.processGroup.id;
            var promise = camel.put({
                url: url,
                params: params,
                timeout: 12000
            });
            return promise;
        };

        //start pipeline schedule
        this.startpipelineonce= function (params){
        	var url="rest/api/v1/datacraft/startpipelineonce/"+params;
            var promise = camel.put({
                url: url,
                params: '',
                timeout: 12000
            });
            return promise;
        };

    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('instanceListService', instanceListService);
});