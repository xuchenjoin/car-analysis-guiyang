
define(["language/dataAccess"], function (keyID) {
    "use strict";
    var processTypeManager = function (camel, commonService,processManager,parserManager) {
        var processTypePromise;
        var processorTypes=[];
        var processTemplatePromise;
        var templateTypes = [];
        var selectedProcessType;
        var toBeShownProcessActivities = ['RDS','HDFS','OBS','PutRDS','ExecuteSpark','Distcp','ExecuteSparkSQL','ExecuteMR','InvokeSqoop','Hbase','LoadHbase','ExecuteQuery','ExecuteHive','ExecuteScript'];
        var i18n = commonService.getKeyID();
        /**
         *
         * @param processType
         */
        this.setSelectedProcessType=function(processType){
           selectedProcessType = processType;
        };
        /**
         *
         * @returns {*}
         */
        this.getSelectedProcessType = function(){
          return selectedProcessType;
        };
        /**
         * use this to send request for getting process types
         * @returns {*}
         */
        this.getProcessTypePromise=function(){
            if(!processTypePromise) {
                var processorTypesUrl = commonService.processorTypesUrl;
                processTypePromise = camel.get({
                    url: processorTypesUrl,
                    params: {},
                    timeout: commonService.WAIT_TIME
                });
                return processTypePromise.then(function(response){
                    parserManager.setConfig(response);
                    processManager.processtypeConfig(response);
                    var response = {"processorTypes":response};
                    analysisTypeResp(response);
                    return processTypePromise;
                },function(){
                    return processTypePromise;
                });
            }else{
                return processTypePromise;
            }
        };
        /**
         * get processorTypes
         * @returns {Array}
         */
        this.getProcessTypes=function(){
          return processorTypes;
        };

        ///**
        // * set process types
        // * @param nProcessTypes
        /**
         * analysis type Response and push them into processTypes
         * @param response
         */
        function analysisTypeResp(response) {
            var componentList = {
                showName: i18n.dps_compsPanel_Activities,
                icon:"title-activity",
                isShow:true,
                groupArray: [{
                    groupName: i18n.dps_compsPanel_Invoke_Activity,
                    isShow:false,
                    processCss:"invoke-activity",
                    groupMembers: []
                }]
            };

            var dataSourceList = {
                showName: i18n.dps_compsPanel_dataResource,
                icon:"title-datasource",
                isShow:true,
                groupArray: [{
                    groupName: "Data Source",
                    isShow:false,
                    processCss:"data-source",
                    groupMembers: []
                }]
            };

            var urlList = {
                showName: "LINK",
                icon:"title-link",
                isShow:true,
                groupArray: [{
                    groupName: "Link Activity",
                    isShow:false,
                    processCss:"link-activity",
                    groupMembers: []
                }]
            };
            var dataSourceDisableList=[];
            var invokeDisableList=[];
            var processDisableList=[];
            var urlListDisableList=[];
            var executeScript;
            processorTypes.splice(0,processorTypes.length);
            processorTypes.push(dataSourceList);
            processorTypes.push(componentList);
            var proTypes = response.processorTypes;
            for (var i = 0; i < proTypes.length; i++) {
                var processor = proTypes[i];
                processor.status=false;
                if (processor.processorType.toUpperCase() == "INVOKE_ACTIVITY" || processor.processorType.toUpperCase() == "PROCESS_ACTIVITY") {
                    processor.id = i;
                    var types = processor.type.split(".");
                    processor.label = types[types.length - 1];
                    if(checkProcessTypeStatus(processor)) {
                        processor.status=true;
                        if(processor.processorType.toUpperCase() == "PROCESS_ACTIVITY"){
                            executeScript=processor;
                        }else{
                            componentList.groupArray[0].groupMembers.push(processor);
                        }

                        continue;
                    }
                        invokeDisableList.push(processor);


                }
                else if (processor.processorType.toUpperCase() == "DATANODE") {
                    processor.id = i;
                    var types = processor.type.split(".");
                    processor.label = types[types.length - 1];
                    if(checkProcessTypeStatus(processor)) {
                        processor.status=true;
                        dataSourceList.groupArray[0].groupMembers.push(processor);
                        continue;
                    }
                    dataSourceDisableList.push(processor);
                } else if (processor.processorType.toUpperCase() == "LINK_ACTIVITY") {
                    processor.id = i;
                    var types = processor.type.split(".");
                    processor.label = types[types.length - 1];
                    if(checkProcessTypeStatus(processor)) {
                        processor.status=true;
                        urlList.groupArray[0].groupMembers.push(processor);
                        continue;
                    }
                    urlListDisableList.push(processor);
                } else {
                    processor.id = i;
                    var types = processor.type.split(".");
                    processor.label = types[types.length - 1];
                    if (checkProcessTypeStatus(processor)) {
                        processor.status=true;
                        componentList.groupArray[1].groupMembers.push(processor);
                        continue;
                    }
                    processDisableList.push(processor);
                }
            }
            dataSourceList.groupArray[0].groupMembers=dataSourceList.groupArray[0].groupMembers.concat(dataSourceDisableList);
            componentList.groupArray[0].groupMembers=componentList.groupArray[0].groupMembers.concat(invokeDisableList);
            componentList.groupArray[0].groupMembers.push(executeScript)
            urlList.groupArray[0].groupMembers=urlList.groupArray[0].groupMembers.concat(urlListDisableList);
        }


        /**
         * check if processType available
         * @param processor
         * @returns {boolean}
         */
        function checkProcessTypeStatus(processor) {
            for (var i = 0; i < toBeShownProcessActivities.length; i++) {
                if (toBeShownProcessActivities[i] === processor.label) {
                    return true;
                }
            }
            return false;
        }
        
        /**
         * use this to send request for getting process template types
         * @returns {*}
         */
        /*this.getProcessTemplateTypePromise=function(){
                var processorTypesUrl = commonService.templateTypeUrl;
                processTemplatePromise = camel.get({
                    url: processorTypesUrl,
                    timeout: commonService.WAIT_TIME
                });
                return processTemplatePromise.then(function(response){
                    setTemplateTypes(response);
                    return processTemplatePromise;
                },function(response){
                    return processTemplatePromise;
                });
         };*/


         function setTemplateTypes(response){
             templateTypes[0]  = response;
             templateTypes[0].isShow = true;
        };
         
         this.getTemplateTypes=function(){
          return templateTypes;
        };

    };
    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyService('processTypeManager', processTypeManager);
});
