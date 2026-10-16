define(["language/dataAccess", "app-remote/services/tinyWindowTipMsgService", "app-remote/services/tipMsgService"], function (i18n, tinyWindowTipMsgService, tipMsgService) {
    "use strict";
    var commonService = function (camel) {

        var version=0;
        var clientID="";
        var groupID=getQueryParam("groupId");
        var pipelineName=getQueryParam("pipelineName");
        var tipMessage = new tipMsgService();
        this.tipMessageService = tipMessage;
        var _this = this; // for tipsMsg use
        var pathName = window.location.pathname;
        var webRoot=pathName.substring(0, pathName.indexOf('/',1));
        this.webRoot = webRoot;
        //this.processGroupUrl=webRoot+"/rest/api/v1/datacraft/nifi-api/controller/process-groups/";
        //this.processorTypesUrl = webRoot+"/rest/api/v1/datacraft/nifi-api/controller/processor-types";
        this.processGroupUrl=webRoot+"/rest/api/v1/datacraft/controller/process-groups/";
        this.processorTypesUrl=webRoot+"/rest/api/v1/datacraft/controller/processor-types";
        this.templateTypeUrl = webRoot+"/rest/api/v1/datacraft/templatelists";
        this.WAIT_TIME=30000;
        this.errorCode = [
            1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1015, 1016, 1017, 1018, 1019, 1020, 1036,
            2000, 2001, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
            3000, 3001, 3002, 3003, 3004, 3005, 7006, 3007, 3008, 3009, 3010, 3014, 3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3032, 3037, 3038, 3039, 3040, 3041, 3042, 3043, 3044, 3045, 3046, 3050, 3051,
            4000, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009,
            5000, 5001, 5002, 5003, 5004, 5005, 5006, 5008, 5011,
            6001, 6002, 6003];//服务器返回的错误码编号
        this.getErrorCode = function(){
        	return this.errorCode;
        }
        this.setErrorCode = function(responseText){
        	var errorObj;
        	var errorCode;
        	if(responseText){
        		try{
            		 errorObj = JSON.parse(responseText);
            	}catch(e){
            	}
        	}
        	if(errorObj && errorObj.error && errorObj.error.error_code){
        		errorCode = errorObj.error.error_code.substring(4);
        		return errorCode;
        	}
        	return '';
        }
        /**
         * 操作成功提示信息
         * @param msg, marLeft
         */
        this.successTip = function(msg, marLeft) {
            _this.tipMessageService.clearSuccessMessages();
            _this.tipMessageService.alert("success", msg, marLeft ? marLeft : '0px');
        }
        /**
         * 验证失败提醒信息
         * @param msg, marLeft
         */
        this.failTip = function(msg, marLeft) {
            _this.tipMessageService.clearErrorMessages();
            _this.tipMessageService.alert("error", msg, marLeft ? marLeft : '0px');
        }
        this.netErrorTip = function(i18n, data, message, placeInCurentWindow) {
            /*var tipContent =  i18n.serviceSideErrordesc;*/ // initialize a default error tip
            var tipContent =  i18n.dps_general_term_checkvalueisok;
            if(data.status == 404){
                tipContent = i18n.dps_canvas_hint_error404;
            }else if(data.status == 403){
                tipContent = i18n.dps_canvas_hint_error403;
            }else if(data.status == 400 || data.status == 500 ){
                var errorCode = this.setErrorCode(data.responseText);
                if(errorCode){
                    if($.inArray(parseInt(errorCode), this.getErrorCode()) >= 0 ){
                        var type = "errorCode_" + errorCode;
                        if(message){
                            tipContent = message + i18n[type];
                        }else{
                            tipContent = i18n[type];
                        }
                    }
                }
            }
            placeInCurentWindow ? this.currentWindowFailTip(tipContent) : this.failTip(tipContent);
        };
        this.displayName = [
            {
                "nameZh": i18n.dps_canvas_configuration_hbase_name,
                "nameEn": "HBASE Table Name"
            },
            {
                "nameZh": i18n.dps_canvas_configuration_hbase_columns,
                "nameEn": "HBASE Columns"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_hdfs_path,
                "nameEn":"MR ClusterName"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_cluster_name,
                "nameEn":"HDFS Path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_obs_path,
                "nameEn":"OBS Path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_rds_driver_name,
                "nameEn":"DB Driver Name"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_rds_connection_url,
                "nameEn":"DB Connection URL"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_rds_user_name,
                "nameEn":"DB User Name"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_rds_name,
                "nameEn":"DB Name"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_distcp_jobname,
                "nameEn":"Job Name"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_hive_script_name,
                "nameEn":"Hive Script Path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_hive_argument_bake,
                "nameEn":"Arguments"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_hive_logpath,
                "nameEn":"Log Path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_hive_input_data_path,
                "nameEn":"Input Data Path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_hive_ouput_data_path,
                "nameEn":"Output Data Path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_mr_pathofjarfile,
                "nameEn":"Path of Jar File"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_mr_parametertojar,
                "nameEn":"Parameter to Jar"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_mr_pathofjarfile,
                "nameEn":"Jar Path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_rdsquery_querystatement,
                "nameEn":"Query Statement"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_rdsquery_querystatement,
                "nameEn":"Query"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_hive_logpath,
                "nameEn":"LOG path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_invokesqoop_tablename,
                "nameEn":"Table Name"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_invokesqoop_sqoopjobparameters,
                "nameEn":"Parameters"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_mr_pathofjarfile,
                "nameEn":"Jar Path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_loadhbase_loadtype,
                "nameEn":"Load Type"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_loadhbase_hfilepath,
                "nameEn":"HFILE Path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_loadhbase_csvarchiverequired,
                "nameEn":"CSV Archive Required"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_loadhbase_csvarchivepath,
                "nameEn":"CSV Archive Path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_loadhbase_customjarpath,
                "nameEn":"Custom Jar Path"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_loadhbase_executionclassname,
                "nameEn":"Execution Class Name"
            },
            {
                "nameZh":i18n.dps_canvas_configuration_loadhbase_extendedargumentsfilepath,
                "nameEn":"Extended Arguments File Path"
            },
            {
                "nameZh": i18n.dps_canvas_configuration_executescript_scriptpath,
                "nameEn": "Script Path"
            },
            {
                "nameZh": i18n.dps_canvas_configuration_executescript_logbackup,
                "nameEn": "Log Backup"
            },
            {
                "nameZh": i18n.dps_canvas_configuration_hive_logpath,
                "nameEn": "Destination Log Path"
            },
            {
                "nameZh": i18n.dps_canvas_configuration_executescript_computeresource,
                "nameEn": "ComputeResource"
            }
        ];
        this.pulicDescription=[{
                "descriptionZh": i18n.dps_canvas_configuration_hbase_name_title,
                "descriptionEn": "Hbase Table Name"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_hbase_columns_title,
                "descriptionEn": "The column family details of the columns. Along with the column name in csv file which will be taken as row key"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_cluster_title,
                "descriptionEn": "MR ClusterName"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_hdfs_path_title,
                "descriptionEn": "HDFS Path to store or retrive the information"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_obs_path_title,
                "descriptionEn": "OBS Path to store or retrive information"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_rds_driver_name_title,
                "descriptionEn": "DB Driver Name"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_rds_connection_url_title,
                "descriptionEn": "DB Connection URL"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_rds_user_name_title,
                "descriptionEn": "DB User Name"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_rds_name_title,
                "descriptionEn": "DB Name"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_distcp_jobname_title,
                "descriptionEn": "Hadoop Application Name To Be Specified"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_hive_jobname_title,
                "descriptionEn": "Job Name"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_hive_script_name_title,
                "descriptionEn": "Path of the Hive query script "
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_hive_argument_title,
                "descriptionEn": "Parameters for the script"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_hive_input_data_path_title,
                "descriptionEn": "Source path from where the data should be copied"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_hive_ouput_data_path_title,
                "descriptionEn": "Destination path where the data should be placed"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_hive_logpath_title,
                "descriptionEn": "Address for storing job logs that record job running status."
            }
        ];
        this.ExecuteMRDescription=[
            {
                "descriptionZh": i18n.dps_canvas_configuration_cluster_title,
                "descriptionEn": "MR ClusterName"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_mr_jobname_title,
                "descriptionEn": "Hadoop Application Name To Be Specified"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_mr_pathofjarfile_title,
                "descriptionEn": "Jar Path"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_mr_parametertojar_title,
                "descriptionEn": "Arguments"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_mr_input_data_path_title,
                "descriptionEn": "Source path from where the data should be copied"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_mr_ouput_data_path_title,
                "descriptionEn": "Destination path where the data should be placed"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_mr_logpath_title,
                "descriptionEn": "Address for storing job logs that record job running status."
            }
        ];
        this.ExecuteQueryDescription=[
            {
                "descriptionZh": i18n.dps_canvas_configuration_cluster_title,
                "descriptionEn": "MR ClusterName"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_spark_logpath_title,
                "descriptionEn": "Address for storing job logs that record job running status."
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_rdsquery_querystatement_title,
                "descriptionEn": "Queries separated by semicolon"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_rdsquery_pathofjarfile_title,
                "descriptionEn": "Jar Path"
            }
        ];
        this.ExecuteSparkDescription=[
            {
                "descriptionZh": i18n.dps_canvas_configuration_cluster_title,
                "descriptionEn": "MR ClusterName"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_spark_jobname_title,
                "descriptionEn": "Spark Application Name To Be Specified"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_spark_pathofjarfile_title,
                "descriptionEn": "Jar Path"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_spark_parametertojar_title,
                "descriptionEn": "Arguments"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_spark_input_data_path_title,
                "descriptionEn": "Source path from where the data should be copied"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_spark_ouput_data_path_title,
                "descriptionEn": "Destination path where the data should be placed"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_spark_logpath_title,
                "descriptionEn": "Address for storing job logs that record job running status."
            }
        ];
        this.ExecuteSparkSqlDescription=[
            {
                "descriptionZh": i18n.dps_canvas_configuration_cluster_title,
                "descriptionEn": "MR ClusterName"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_sparksql_jobname_title,
                "descriptionEn": "Job Name"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_sparksql_querystatement_title,
                "descriptionEn": "Query"
            }
        ];
        this.InvokeSqoopDescription=[
            {
                "descriptionZh": i18n.dps_canvas_configuration_cluster_title,
                "descriptionEn": "MR ClusterName"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_invokesqoop_job_title,
                "descriptionEn": "Hadoop Application Name To Be Specified"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_invokesqoop_querystatement_title,
                "descriptionEn": "Parameters"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_invokesqoop_logpath_title,
                "descriptionEn": "Address for storing job logs that record job running status."
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_invokesqoop_tablename_title,
                "descriptionEn": "Table Name"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_invokesqoop_pathofjarfile_title,
                "descriptionEn": "Jar Path"
            }
        ];
        this.LoadHbaseDescription=[
            {
                "descriptionZh": i18n.dps_canvas_configuration_cluster_title,
                "descriptionEn": "MR ClusterName"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_loadhbase_loadtype_title,
                "descriptionEn": "Load type. Insert for small data. Bulkload for large data"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_loadhbase_hfilepath_title,
                "descriptionEn": "The path for storing intermediate HFiles"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_loadhbase_csvarchiverequired_title,
                "descriptionEn": "Whether to archive CSV files or nor."
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_loadhbase_csvarchivepath_title,
                "descriptionEn": "Path where CSV file from source will be archived"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_loadhbase_customjarpath_title,
                "descriptionEn": "HDFS Path from where user cutom JAR will be taken."
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_loadhbase_executionclassname_title,
                "descriptionEn": "User defined tool class which will be used for loading CSV data."
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_loadhbase_extendedargumentsfilepath_title,
                "descriptionEn": "HDFS File path specifying the extended arguments."
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_loadhbase_logpath_title,
                "descriptionEn": "Address for storing job logs that record job running status."
            }
        ];
        this.ExecuteScriptDescription=[
            {
                "descriptionZh": i18n.dps_canvas_configuration_executeScript_scriptpath_title,
                "descriptionEn": "Path of the script file to be executed"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_executeScript_logbackup_title,
                "descriptionEn": "Backup Logs in OBS"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_executeScript_destinationlogpath,
                "descriptionEn": "Destination path where the log file has be backed up"
            },
            {
                "descriptionZh": i18n.dps_canvas_configuration_executeScript_computerresource,
                "descriptionEn": "computeResource"
            }
        ];
        this.DistcpDescription=[
            {
                "descriptionZh": i18n.dps_canvas_configuration_distcp_jobname_title,
                "descriptionEn": "Hadoop Application Name To Be Specified"
            }
        ];
        //此处扩展调用算子告警提示信息，请勿删除
        /*this.validation=[
            {
                "type":"InvokeSqoop",
                "validationErrors":["请测试InvokeSqoop","请测试InvokeSqoop"]
            },
            {
                "type":"LoadHbase",
                "validationErrors":["请测试LoadHbase","请测试LoadHbase"]
            },
        ];*/
        /**
         * use this function to get param from url
         * @param name
         * @returns {*}
         */
        this.getQueryParam=function (name) {
            return getQueryParam(name);
        };
        
        function getQueryParam(name){
            var reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.href.match(reg);
            if (r != null){
            	var ret = decodeURIComponent(r[2]);
            	if(detectXSS(ret)){
            		ret = encodeURIComponent(ret);
            	}
            	return ret;
            }
            
            return null;
        }
        
        function detectXSS(str){
        	var flag = false;
        	['script','style','img','svg','video','iframe'].map(function(s){
        		if(str.indexOf("<"+s)<0 && str.indexOf("</"+s)<0){
        			return false;
        		}else{
        			flag = true;
        		}
        	});
        	
        	return flag;
        }

        /**
         * get groupID
         * @returns {*}
         */
        this.getGroupID=function(){
            return groupID;
        };
        this.getPipelineName=function(){
            return pipelineName;
        };

        /**
         * get schedule info
         */
        this.getProcessGroupPromise = function (groupId) {
            var url = "./rest/api/v1/datacraft/controller/pipeline/root/getPipeline"
            var promise = camel.post({
                url: url,
                params: {pipelineId:groupId,version: this.getVersion()},
                timeout: commonService.WAIT_TIME
            });
            return promise;
        };

        /**
         * get version
         * @returns {number}
         */
        this.getVersion=function(){
            return version;
        };
        /**
         * 获取页面使用资源文件，国际化
         *
         * @returns {*}
         */
        this.getKeyID = function() {
            return getKeyID();
        };
        function getKeyID() {
            return i18n;
        }
        /**
         *
         * @param newVersion
         */
        this.setVersion=function(newVersion){
          version=newVersion;
        };
        /**
         *
         * @returns {string}
         */
        this.getClientID=function(){
            return clientID;
        };

        /**
         *
         * @param newClientID
         */
        this.setClientID=function(newClientID){
            clientID=newClientID;
        };
        
     // use this function to show message
        this.message = function (alertMsg, config) {
            var msg={};
            if (config && config.buttons) {
                for (var i = 0; i < config.buttons.length; i++) {
                    var oriHandler = config.buttons[i].handler;
                    config.buttons[i].handler = (function (oriHandler) {
                        return function (event) {
                            oriHandler();
                            msg.destroy();
                        };
                    })(oriHandler);
                }
            }
            var options = {
                type: (config && config.type)||"prompt",
                content: alertMsg,
                "detail-msg": "",
                width: (config && config.width) || "400px",
                buttons: (config && config.buttons) || [{
                    key: "btnOK",
                    label: i18n.dps_canvas_hint_confirm,// 按钮上显示的文字
                    accessKey: '3',
                    focused: true,// 默认焦点
                    handler: function (event) {// 点击回调函数
                        msg.destroy();
                    }
                }]
            };
            msg = new tinyWidget.Message(options);
            msg.show();
        };
        
        /**
		 * 时间格式转换  转成2016-08-21 15:17:06格式
		 */
		this.FormatDate = function (strTime) {
		    var date = new Date(strTime);
		    var Y = twoDigitFormat(date.getFullYear());
            var M = twoDigitFormat(date.getMonth() + 1);
            var D = twoDigitFormat(date.getDate());
		    var h = twoDigitFormat(date.getHours());
            var m = twoDigitFormat(date.getMinutes());
            var s = twoDigitFormat(date.getSeconds());
            return [[Y,M,D].join("-"),[h,m,s].join(":")].join(" ");
		};
		
		/**
		 * 时间格式转换  转成08/21/2016 15:17:06格式
		 */
		this.FormatDate2 = function (strTime) {
		    var date = new Date(strTime);
		    var Y = twoDigitFormat(date.getFullYear());
            var M = twoDigitFormat(date.getMonth() + 1);
            var D = twoDigitFormat(date.getDate());
		    var h = twoDigitFormat(date.getHours());
            var m = twoDigitFormat(date.getMinutes());
            var s = twoDigitFormat(date.getSeconds());
            return [[M,D,Y].join("/"),[h,m,s].join(":")].join(" ");
		};

        /*
         * 时间格式转换，源时间格式  2016-08-21 15:17:06 目标时间格式12/09/2016 16:58:54。
         * */
        this.FormatDate4 = function(strTime){
            var Y = strTime.substring(8, 10);
            var M = strTime.substring(0, 4);
            var D = strTime.substring(5, 7);
            var T = strTime.substring(11, 19);
            return D + '/' + Y + '/' + M + ' ' + T;
        };





        /**
         * 时间格式转换  转成2016-08-21 15:17:06格式
         * isTenIntegerTimestamp为true时，接收10位数整数的时间截，否则接受13位的毫秒级整数
         */
        this.FormatDate5=function (strTime, isTenIntegerTimestamp, isTrim) {
            if(isTrim===true && (strTime=='' || strTime=='0')){
                return '';
            }
            var date = new Date(strTime*(isTenIntegerTimestamp===true?1000:1));
            var Y = twoDigitFormat(date.getFullYear());
            var M = twoDigitFormat(date.getMonth() + 1);
            var D = twoDigitFormat(date.getDate());
            var h = twoDigitFormat(date.getHours());
            var m = twoDigitFormat(date.getMinutes());
            var s = twoDigitFormat(date.getSeconds());
            return [[Y,M,D].join("-"),[h,m,s].join(":")].join(" ");
        };

        function twoDigitFormat(oriNum){
	        if(oriNum>=10){
	            return oriNum;
	        }else{
	            return "0"+oriNum;
	        }
	    }

        //judge the if the object is Integer
        this.isInt = function(obj){
            return typeof obj === 'number' && obj % 1 === 0;
        }


        /**
		 *  10位时间戳转换成日期对象
		 */
		this.timeTrans = function (timeStamp) {
            timeStamp = parseInt(timeStamp);
            if (timeStamp >= 1000000000) {
                if (timeStamp <= 1000000000000) {
                    timeStamp = timeStamp * 1000;
                }
                var date = new Date(timeStamp);
                var Y = twoDigitFormat(date.getFullYear());
                var M = twoDigitFormat(date.getMonth() + 1);
                var D = twoDigitFormat(date.getDate());
                var h = twoDigitFormat(date.getHours());
                var m = twoDigitFormat(date.getMinutes());
                var s = twoDigitFormat(date.getSeconds());
                return [[Y,M,D].join("-"),[h,m,s].join(":")].join(" ");
            } else {
                return timeStamp;
            }
        };
        
        /*
         * 生成UUID
         * */
       this.getUUID= function(){
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            var uuid = s.join("");
            uuid = uuid;
            return uuid;
        };


        this.ellipsisByLength = function(str, length){
            return String(str).length > length ? str.substring(0,length) + '...' : str;
        };

        this.safeOpenURL = function(url){
            if(url){
                var w = window.open(url);
                w.opener = null;
            }
        };

		this.getFocusValidate=function(scope,obj){
			obj.focused = false;
			setTimeout(function(){
			obj.focused = true;
			scope.$evalAsync();
			},0);
		};

        this.changeStatuToFalse = function(scope, obj, key){
            setTimeout(function(){
                obj[key] = false;
                scope.$evalAsync();
            }, 0);
        };

        // for table loading gif
        this.loading = $('<div>').css({
                "z-index": 10000000000,
                "margin-top":"10px",
                "text-align": "center",
                "position": "absolute",
                "width": "100%",
                "height": "calc(100% - 40px)",
                "top": 0,
                "background-image": "url('../static/framework/theme/default/images/mask-loading.gif')",
                "background-repeat": "no-repeat",
                "background-position": "50%"
            });

        this.bigLoading = $('<div>').css({
                "z-index": 10000000000,
                "text-align": "center",
                "position": "absolute",
                "width": "100%",
                "height": "100%",
                "top": 0,
                "background-color" : "rgba(0, 0, 0, .1)",
                "background-image": "url('../static/framework/theme/default/images/loading_big.gif')",
                "background-repeat": "no-repeat",
                "background-position": "50%"
            });
        /**
         * current window(generally a dialog) message tip function
         * @param type
         * @param msg
         * @param marLeft
         */
        function currentWinTip(type, msg, marLeft) {
            var currentWinTipMsgService = new tinyWindowTipMsgService($("[id^=tinywindow_14]").attr("id"));
            currentWinTipMsgService.clearAllMessages();
            currentWinTipMsgService.alert(type, msg, marLeft ? marLeft : '0px');
        }
        /**
         * current widow error tip message
         */
        this.currentWindowErrorTip = function(msg, marLeft) {
			currentWinTip("error", msg, marLeft ? marLeft : '0px');
		}
		
        /**
         * current widow sucess tip message
         */
        this.currentWindowSuccesslTip = function(msg, marLeft) {
            currentWinTip("success", msg, marLeft ? marLeft : '0px')
        }
    };

    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyService('commonService', commonService);
});