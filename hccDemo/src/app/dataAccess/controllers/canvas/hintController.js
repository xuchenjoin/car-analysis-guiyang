/**
 * Created  on 2017/2/8.
 */

define(['language/dataAccess', "app-remote/services/tipMsgService"], function (i18n, tipMsgService, instanceListService) {
    "use strict";
    var tipMessageService = new tipMsgService();
    var hintCtrl = function ($rootScope, $scope, $compile, camel, mask,commonService) {
        //获取pipeline接口异常提示
        $rootScope.$on('getPipelineExecption', function(event, data){
            if(data){
                var errorCode = commonService.setErrorCode(data.responseText);
                var msg = i18n.dps_canvas_hint_serviceErrror;
                if(data.status == 404){
                    msg = i18n.dps_canvas_hint_error404;
                }else if(data.status == 403){
                    msg = i18n.dps_canvas_hint_error403;
                }else if(data.status == 400 || data.status == 500){
                    if(errorCode){
                        if($.inArray(parseInt(errorCode), commonService.getErrorCode()) >= 0 ){
                            var type = "errorCode_" + errorCode;
                            msg =  i18n[type];
                        }else{
                            msg = i18n.dps_canvas_hint_otherError;
                        }
                    }else{
                        if(data.responseText){
                            msg = data.responseText;
                        }else{
                            msg = i18n.dps_canvas_hint_serviceErrror;
                        }
                    }
                }
                showWarning(msg);
            }
        });


    //提交成功
        $rootScope.$on('submitSucessed', function(event, data){
            if(data){
            	showSuccess(i18n.dps_canvas_hint_dps_pipeline_submit_success.replace("{0}",data));
            }
        });
    //提交失败
        $rootScope.$on('submitFailed', function(event, datas){
            if(datas) {
                var str, strErr, msg = i18n.dps_canvas_hint_serviceErrror;
                var data = datas.data;
                var errorCode = commonService.setErrorCode(data.responseText);
                if(data.status == 404){
                    msg = i18n.dps_canvas_hint_error404;
                }else if(data.status == 403){
                    msg = i18n.dps_canvas_hint_error403;
                }else if(data.status == 400 || data.status == 500){
                    if(errorCode){
                        if($.inArray(parseInt(errorCode), commonService.getErrorCode()) >= 0 ){
                            var type = "errorCode_" + errorCode;
                            str = i18n.dps_canvas_hint_dps_pipeline_submit_failed;
                            strErr = str.replace("{0}",datas.pipelineName||"");
                            msg = strErr.replace("{1}",i18n[type]);
                        }else{
                            str = i18n.dps_canvas_hint_dps_pipeline_submit_failed;
                            strErr = str.replace("{0}",datas.pipelineName);
                            msg = strErr.replace("{1}",i18n.dps_canvas_hint_otherError);
                        }
                    }else{
                        if(data.responseText){
                            str = i18n.dps_canvas_hint_dps_pipeline_submit_failed;
                            strErr = str.replace("{0}",datas.pipelineName);
                            var responseText=JSON.parse(data.responseText);
                            msg = strErr.replace("{1}",responseText.errorList[0].error.error_msg);
                        }else {
                            str = i18n.dps_canvas_hint_dps_pipeline_submit_failed;
                            strErr = str.replace("{0}",datas.pipelineName);
                            msg = strErr.replace("{1}",i18n.dps_canvas_hint_serviceErrror);
                        }
                    }
                }
                showWarning(msg);
            }
        });
        //template success to save
        $rootScope.$on("submitTemplateSuccess", function(event, data) {
            var msg = i18n.template_ + data.templateDTO.name +" "+ i18n.submitPipeline_success + i18n.dps_canvas_hint_sucessCode;
            showSuccess(msg);
        });
        //template failed to save
            $rootScope.$on("submitTemplateFailed", function(event, data) {
                var type, errorCode = commonService.setErrorCode(data.responseText);
                var msg = i18n.dps_canvas_hint_serviceErrror;
                if (404 == data.status) {
                    msg = i18n.dps_canvas_hint_error404;
                }else if (403 == data.status) {
                    msg = i18n.dps_canvas_hint_error403;
                }else if (400 == data.status || 500 == data.status) {
                    if (errorCode) {
                        if ($.inArray(parseInt(errorCode), commonService.getErrorCode()) >= 0) {
                            type = "errorCode_" + errorCode;
                            msg = i18n.template_ + i18n.submitPipeline_failed + i18n[type];
                        } else {
                            msg = i18n.template_ + i18n.submitPipeline_failed + i18n.dps_canvas_hint_otherError;
                        }
                    } else {
                        msg = i18n.template_ + i18n.submitPipeline_failed + (data.responseText ? data.responseText : i18n.dps_canvas_hint_serviceErrror);
                    }
                }
                showWarning(msg);
            });

        /*
        * canvas页面调度保存按钮信息提示
        * */
        $rootScope.$on('savescheduler', function(event, data){
            if(data){
                showHint(data);
            }
        });

        $rootScope.$on('schedulePipelineJob', function(event, data){
            if(data){
                showHint(data);
            }
        });

        /*
         * canvas页面暂停调度按钮信息提示
         * */
        $rootScope.$on('unschedulePipelineJob', function(event, data){
            if(data){
                showHint(data);
            }
        });

        /*
         * canvas页面删除调度按钮信息提示
         * */
        $rootScope.$on('deletescheduleTest', function(event, data){
            if(data){
                showHint(data);
            }
        });

        /*
         * viewcanvas页面开始按钮信息提示
         * */
        $rootScope.$on('startpipelineonce', function(event, data){
            if(data){
                showHint(data);
            }
        });

        //cann't connect each other
        $scope.$on('warningConnectEachOher', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        //input data source must be RDS
        $scope.$on('warningConnectInputRequiredRDS', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        //input data source must be OBS or HDFS
        $scope.$on('warningConnectInputRequiredOBSorHDFS', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        //output data source must be RDS
        $scope.$on('warningConnectOutputRequiredRDS', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        //output data source must be OBS or HDFS
        $scope.$on('warningConnectOutputRequiredOBSorHDFS', function(event ,data){
            if(data){
                showWarning(data);
            }
        });


        $scope.$on('warningConnectInputRequiredHDFSS', function(event ,data){
            if(data){
                showWarning(data);
            }
        });
        //input data source must bu OBS
        $scope.$on('warningConnectInputRequiredOBSss', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        //output data source must bu HDFS
        $scope.$on('warningConnectOutputRequiredHDFSss', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        //out put data source must be OBS
        $scope.$on('warningConnectOutputRequiredOBSss', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        $scope.$on('warningConnectActivityToActivity', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        $scope.$on('warningConnectActivityToActivityElse', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        $scope.$on('warningConnectOutForbidden', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        $scope.$on('warningConnectOnly', function(event ,data){
            showWarning(data);
        });

        $scope.$on('warningConnectInForbidden', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        $scope.$on('warningConnectConnectDataSource', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        $scope.$on('warningConnectDataSourceToDataSource', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        $scope.$on('warningConnectConnectOnlysss', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        //before submit checkout pipeline
        $scope.$on('beforeSubmitCheckout', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        //selectSourceFirst
        $scope.$on('selectSourceFirst', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        //deal configurationContrller's warning
        $scope.$on('configurationPanelControllerHint', function(event ,data){
            if(data){
                showWarning(data);
            }
        });

        //show configurationcontroller's success
        $scope.$on('configurationPanelControllerSuccess', function(event ,data){
            if(data){
                showSuccess(data);
            }
        });

        //error hint in configurationcontroller
        $scope.$on('errorInconfigrationPannelCtr', function(event,datas){
           if(data){
               showErrorWithAction(datas.data, datas.action);
           }
        });

        //获取计算资源接口异常提示
        $rootScope.$on('getComputeFromRemote',function(event, data){
            if(data){
                var str;
                var errorCode = commonService.setErrorCode(data.responseText);
                var msg = i18n.dps_canvas_hint_serviceErrror;
                if(data.status == 404){
                    msg = i18n.dps_canvas_hint_error404;
                }else if(data.status == 403){
                    msg = i18n.dps_canvas_hint_error403;
                }else if(data.status == 400 || data.status == 500){
                    if(errorCode){
                        if($.inArray(parseInt(errorCode), commonService.getErrorCode()) >= 0 ){
                            var type = "errorCode_" + errorCode;
                            str = i18n.dps_canvas_hint_dps_get_compute_source_list;
                            msg = str.replace("{0}",i18n[type]);
                        }else{
                            str = i18n.dps_canvas_hint_dps_get_compute_source_list;
                            msg = str.replace("{0}",i18n.dps_canvas_hint_otherError);
                        }
                    }else{
                        if(data.responseText){
                            str = i18n.dps_canvas_hint_dps_get_compute_source_list;
                            msg = str.replace("{0}",data.responseText);
                        }else{
                            str = i18n.dps_canvas_hint_dps_get_compute_source_list;
                            msg = str.replace("{0}",i18n.dps_canvas_hint_serviceErrror);
                        }
                    }
                }
                showWarning(msg);
            }
        });


        /*
        * show warning
        * */
        function showWarning(data){
            tipMessageService.clearAllMessages();
        	tipMessageService.alert("error", data, '0px');
        }

        /*
        * show success
        * */
        function showSuccess(msg){
            tipMessageService.clearAllMessages();
        	tipMessageService.alert("success", msg, '0px');
        }

        /*
        * 公共的提示设置
        */
        function showHint(datas){
            if(datas){
                var promise = datas;
                promise.then(function(){
                	showSuccess(i18n.dps_canvas_hint_sucessCode);
                },function(data) {
                    if (data.status == 200) {
                    	showSuccess(i18n.dps_canvas_hint_sucessCode);
                    }else{
                    	var msg = i18n.dps_canvas_hint_otherError;
                    	if(data.status == 404) {
                    		msg = i18n.dps_canvas_hint_error404;
                    	} else if(data.status == 403) {
                    		msg = i18n.dps_canvas_hint_error403;
                    	} else if(data.status == 400 || data.status == 500) {
	                        var errorCode = commonService.setErrorCode(data.responseText);
	                        if(errorCode){
	                            if($.inArray(parseInt(errorCode), commonService.getErrorCode()) >= 0 ) {
	                                var type = "errorCode_" + errorCode;
	                                msg = i18n[type];
	                            }
	                        } else if(data.responseText){
                                msg = data.responseText;
                            }
                        }
                    	showWarning(msg);
                    }
                });
            }
        }

        /*
         *公共的提示设置
         * */
        function showHintWithAction(data, action){
            if(data&&action){
                var str;
                var promise = data;
                promise.then(function(){
                    showSuccess(i18n.dps_canvas_hint_dps_action_success.replace("{0}",action));
                },function(data){
                    var msg = i18n.dps_canvas_hint_serviceErrror;
                    if(data.status == 404){
                        msg = i18n.dps_canvas_hint_error404;
                    } else if(data.status == 403){
                        msg = i18n.dps_canvas_hint_error403;
                    }else if(data.status == 400 || data.status == 500){
                        var errorCode = commonService.setErrorCode(data.responseText);
                        if(errorCode){
                            if($.inArray(parseInt(errorCode), commonService.getErrorCode()) >= 0 ){
                                var type = "errorCode_" + errorCode;
                                msg = action + i18n[type];
                            }else{
                                str=i18n.dps_canvas_hint_dps_other_error;
                                msg =str.replace("{0}",action);
                            }
                        }else{
                            if(data.responseText){
                                msg = action + data.responseText;
                            }else{
                                str=i18n.dps_canvas_hint_dps_other_error;
                                msg =str.replace("{0}",action);
                            }
                        }
                    }
                    showWarning(msg);
                });
            }
        }

        /*
         *show error information
         * */
        function showErrorWithAction(data, action){
            if(data&&action){
                var str, msg;
                var errorCode = commonService.setErrorCode(data.responseText);
                if(errorCode){
                    if($.inArray(parseInt(errorCode), commonService.getErrorCode()) >= 0 ){
                        var type = "errorCode_" + errorCode;
                        msg = action + i18n[type];
                    }else{
                        str=i18n.dps_canvas_hint_dps_other_error;
                        msg = str.replace("{0}",action);
                    }
                }else{
                    if(data.responseText){
                        msg = action + data.responseText;
                    }else{
                        str = i18n.dps_canvas_hint_dps_other_error;
                        msg = str.replace("{0}",action);
                    }
                }
                showWarning(msg);
            }
        }
    };
    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyController('hint.ctrl', hintCtrl);
    return dataCraftModule;
});