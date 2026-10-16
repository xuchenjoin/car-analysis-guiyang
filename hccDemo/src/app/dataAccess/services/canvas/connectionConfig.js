

define(["language/dataAccess"], function (keyID) {
    "use strict";
    var connectionConfig = function (camel, commonService) {
        var formData={
            name:"new Name",
            relationships: [],
            flowFileExpiration:"0",
            flowFileExpirationUnit:'sec',
            backPressureObjectThreshold:0,
            backPressureObjectThresholdUnit:'',
            backPressureDataSizeThreshold:0,
            backPressureDataSizeThresholdUnit:'MB'
        };
        this.setFormData=function(nFormData) {
            formData.name=nFormData.name||formData.name;
            formData.relationships = nFormData.relationships||formData.relationships;
            formData.flowFileExpiration = nFormData.flowFileExpiration||formData.flowFileExpiration;
            formData.backPressureObjectThreshold=nFormData.backPressureObjectThreshold||formData.backPressureObjectThreshold;
            formData.backPressureDataSizeThreshold=nFormData.backPressureDataSizeThreshold||formData.backPressureDataSizeThreshold;
        };
        this.getFormData=function(){
            return formData;
        };
        this.getFormDataStr=function(){
            var formDataStr="";
            for(var i=0;i<formData.relationships.length;i++){
                if(formData.relationships[i].checked){
                    formDataStr+="&relationships[]="+formData.relationships[i].name;
                }
            }
            formDataStr+="&name="+formData.name
                +"&flowFileExpiration="+formData.flowFileExpiration+formData.flowFileExpirationUnit
                +"&backPressureObjectThreshold="+formData.backPressureObjectThreshold+formData.backPressureObjectThresholdUnit
                +"&backPressureDataSizeThreshold="+formData.backPressureDataSizeThreshold+formData.backPressureDataSizeThresholdUnit;
            return formDataStr;
        }
    };
    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyService('connectionConfig', connectionConfig);
});

