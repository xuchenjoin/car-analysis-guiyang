
define(["language/dataAccess"], function (keyID) {
    "use strict";
    var createInstanceService = function ( camel) {

        //to get promise which is used to stop instance
    	  this.createPipeline = function (params) {
    		  var url="rest/api/v1/datacraft/insertPipeline";
              var promise = camel.post({
                  url: url,
                  params: params,
                  timeout: 12000
              });
              return promise;
          };
        /**
         * 验证标准
         */
        this.checkRules={
            //集群名验证
            "pipelineNameCheck":[
                {//校验规则1
                    validFn : "maxSize",
                    params : 62,
                    errorDetail : keyID.dps_validate_pipeline_name_num//"输入不能多于62字符"
                },{
                    validFn:"required",
                    errorDetail : keyID.dps_validate_pipeline_name_required//"输入不能为空"
                },{
                    validFn:"regularCheck",
				    params:"/\\S+/", 
                    errorDetail:keyID.dps_validate_pipeline_name_no_space//"工作流名不能为空格"
                },{
                    validFn:"regularCheck",
				    params:"/^([A-Za-z0-9_]+)?$/",
                    errorDetail:keyID.dps_validate_pipeline_name_special_char_warning
                }
            ]
        };

        this.checkDescriptionRules={
            //集群名验证
            "pipelineDescriptionCheck":[
                {//校验规则1
                    validFn : "maxSize",
                    params : 1023,
                    errorDetail : keyID.dps_validate_pipeline_description_num//"输入不能多于64字符"
                },{
                    validFn:"required",
                    errorDetail : keyID.dps_validate_pipeline_description_required//"输入不能为空"
                },{
                    validFn:"regularCheck",
                    params:"/^[\u0000-\u00FF]+$/",
                    errorDetail:keyID.dpsValidationErrorAnyCharacter
                }
            ]
        };
        
    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('createInstanceService',createInstanceService);
});