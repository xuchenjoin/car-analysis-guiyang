
define(["language/dataAccess", "app-remote/services/tipMsgService", "src/app/common/commonInfo", "app-remote/services/tinyWindowTipMsgService"], function (i18n, tipMsgService, commonInfo, tinyWindowTipMsgService) {
    "use strict";
    var tipMessage = new tipMsgService();
    var commonService = function ($rootScope,camel,$filter) {
        var groupID=getQueryParam("groupId");
        var pipelineName=getQueryParam("pipelineName");
        var _this = this; // for tipsMsg use
        var _hostname = window.location.hostname;
        var ENVIRONMENT_FLag = true;  //true for hws environment and false for tlf environment
		this.tipMessageService = tipMessage;
        this.WAIT_TIME=30000; //auto refresh table list wait time length
        this.AUTO_REFRESH_INTERVAL=1000; //1 second
        this.instanceListPage="#/manage/pipelineList";     //url of page instanceList
        this.createInstancePage="#/manage/createInstance";//url of page createInstance
        this.createInstanceByTemplatePage="#/manage/createByTemplate";
        this.editPipelinePage="#/manage/editPipeline";    //url of page editPipeline
        this.getEnvironmentFlag = function (){
            return ENVIRONMENT_FLag;
        };
        
        //获取第一层目录
        this.pathName = window.location.pathname;
        this.webRoot = this.pathName.substring(0, this.pathName.indexOf('/',1));
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
		 * 验证失败提醒信息
		 * @param msg, marLeft
		 */
		this.failTip = function(msg, marLeft) {
			_this.tipMessageService.clearErrorMessages();
			_this.tipMessageService.alert("error", msg, marLeft ? marLeft : '0px');
		}

        /**
         * current widow error tip message
         */
        this.currentWindowErrorTip = function(msg, marLeft) {
			currentWinTip("error", msg, marLeft ? marLeft : '0px');
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
         * current widow sucess tip message
         */
        this.currentWindowSuccesslTip = function(msg, marLeft) {
            currentWinTip("success", msg, marLeft ? marLeft : '0px')
        }

		/**
		 * for network error/failing tips
		 * @param i18n, data, message
		 */
		this.netErrorTip = function(i18n, data, message, placeInCurentWindow) {
            var tipContent =  i18n.serviceSideErrordesc; // initialize a default error tip
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
            console.log(tipContent)
            placeInCurentWindow ? this.currentWindowFailTip(tipContent) : this.failTip(tipContent);
        };

        this.netErrorCurrentWinTip = function(i18n, data, message) {
            this.netErrorTip(i18n, data, message, true)
        }
        
        this.netWarningTip = function(message, placeInCurentWindow) {
            placeInCurentWindow = this.failTip(message);
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

        this.getGroupID=function(){
            return groupID;
        };
        this.getPipelineName=function(){
            return pipelineName;
        };
        this.getProcessGroupPromise = function (groupId) {
            var url = "./rest/api/v1/datacraft/controller/pipeline/root/getPipeline"
            var promise = camel.post({
                url: url,
                params: {pipelineId:groupId,version: 0},
                timeout: commonService.WAIT_TIME
            });
            return promise;
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
		 * 统一使用tiny-Window 提示警告信息
		 * 
		 * @param innerHtmlStr
		 */
		this.alert = function(alertMsg, config) {
			if (config && config.buttons) {
				for (var i = 0; i < config.buttons.length; i++) {
					var oriHandler = config.buttons[i].handler;
					config.buttons[i].handler = (function(oriHandler) {
						return function(event) {
							oriHandler();
							msg.destroy();
						};
					})(oriHandler);
				}
			}
			var options = {
				type : "warn",
				content : alertMsg,
				"detail-msg" : "",
				width : (config && config.width) || "400px",
				buttons : (config && config.buttons) || [ {
					key : "btnOK",
					label : i18n.datacraft_general_confirm_label,// 按钮上显示的文字
					accessKey : '3',
					focused : true,// 默认焦点
					handler : function(event) {// 点击回调函数
						msg.destroy();
					}
				} ]
			};
			var msg = new tinyWidget.Message(options);
			msg.show();
		};
		
		/**
		 * 将数组内数据转换为html编码格式
		 * 
		 * @param array
		 */
		this.htmlEncode = function(array) {
			if(isArray(array)){
				for (var i = 0; i < array.length; i++) {
					array[i] = htmlEncode(array[i]);
				}
			}
			return array;
		};

		function htmlEncode(originData) {
			if (isArray(originData) || isJson(originData)) {
				for ( var x in originData) {
					originData[x] = htmlEncode(originData[x]);
				}
			} else if (originData) {
				originData = htmlBasicEncode(originData);
			}
			return originData;
		}
		
		/**
		 * 判断是否为Array
		 * 
		 * @param source
		 * @returns {boolean}
		 */
		function isArray(source) {
			return '[object Array]' == Object.prototype.toString
					.call(source);
		}

		function isJson(obj) {
			return typeof (obj) == "object"
					&& Object.prototype.toString.call(obj)
							.toLowerCase() == "[object object]"
					&& !obj.length;
		}

		/**
		 * 基本数据转html编码格式
		 * 
		 * @param orginStr
		 * @returns {string}
		 */
		function htmlBasicEncode(originData) {
			var strNode = document.createTextNode(originData);
			var container = document.createElement("div");
			container.appendChild(strNode);
			return container.innerHTML;
		}

        this.stringEncode=function stringEncode(str){
            var div=document.createElement('div');
            if(div.innerText){
                div.innerText=str;
            }else{
                div.textContent=str;//Support firefox
            }
            return div.innerHTML;
        };
        
        /**
		 * 判断用户是否有指定的角色权利
		 * 
		 * @param roleName
		 * @returns {boolean}
		 */
		this.hasRole = function(roleName) {
			var roles = $rootScope.userRoles || [];
			for (var i = 0; i < roles.length; i++) {
				if (roles[i] === roleName) {
					return true;
				}
			}
			return false;
		};

		/**
		 * 根据角色类型判断是否需要申请公测资格
		 */
		this.publicQualificationTest = function() {
			if (this.hasRole("op_gated_dps")) {
				window.location.href = commonInfo.publicEventPageUrl;
				return true;
			}
			return false;
		};
		/**
		 * 时间格式转换  转成2016-08-21 15:17:06格式
         * isTenIntegerTimestamp为true时，接收10位数整数的时间截，否则接受13位的毫秒级整数
		 */
		this.FormatDate = function (strTime, isTenIntegerTimestamp, isTrim) {
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
		
		/**
		 * 时间格式转换  转成08/21/2016 15:17:06格式
		 */
		this.FormatDate2 = function (strTime, isTenIntegerTimestamp, isTrim) {
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
            return [[M,D,Y].join("/"),[h,m,s].join(":")].join(" ");
		};

        /*
         * 时间格式转换，源时间格式  2016-08-21 15:17:06 目标时间格式12/09/2016 16:58:54。
         * */

        this.FormatDate4 = function(strTime){
        	return $filter('date')(new Date(strTime),'MM/dd/yyyy HH:mm:ss');
        };
		
		/*
		 * 时间格式转换，源时间格式12/09/2016 16:58:54 CST 目标时间格式2016-08-21 15:17:06。
		 * */
		this.formatDate3 = function(strTime){
			var Y = strTime.substring(6, 10);
			var M = strTime.substring(0, 2);
			var D = strTime.substring(3, 5);
			var T = strTime.substring(11, 19);
			return Y + '-' + M + '-' + D + ' ' + T;
		};

        /*
         * 时间格式转换，源时间格式12/09/2016 16:58:54 CST 目标时间格式2016-08-21 15:17:06 CST。
         * */
        this.formatDate5 = function(strTime){
            var Y = strTime.substring(6, 10);
            var M = strTime.substring(0, 2);
            var D = strTime.substring(3, 5);
            var T = strTime.substring(11, 19);
            return Y + '-' + M + '-' + D + ' ' + T + ' ' + strTime.substring(20, strTime.length);
        };

		function twoDigitFormat(oriNum){
	        if(oriNum>=10){
	            return oriNum;
	        }else{
	            return "0"+oriNum;
	        }
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

        /**
         * 获取URL上指定名称参数的值
         * @param name
         * @returns {string}
         */
        this.getQueryParam = function(name){
            var matches = window.location.search.match((new RegExp(name+'=([^\&\/]+)')));
            return (matches===null || typeof matches[1] === 'undefined') ? '' : matches[1];
        };

        /**
         * 计算两个时间点的差值
         * @param startTime 起始时间(10位整数的时间戳)
         * @param endTime 结束时间(10位整数的时间戳)
         * @param unit    返回的单位(可选值为hr, min, sec, 分别代表时、分、秒)
         * @param fixedNum    小数点后保留的位数
         * @returns {int}
         */
        this.durationTime = function(startTime, endTime, unit, fixedNum){
            if(parseInt(startTime)===0 || parseInt(endTime)===0){
                return '';
            }

            var unitSize = 1;
            if(unit==='hr'){
                unitSize = 3600;
            }else if(unit==='min'){
                unitSize = 60;
            }

            var offset = Math.abs((parseInt(endTime) - parseInt(startTime))/unitSize);

            if(typeof fixedNum === 'undefined'){
                fixedNum = 0;
            }else{
                fixedNum = parseInt(fixedNum);
            }

            return fixedNum > 0 ? offset.toFixed(fixedNum) : offset;
        };

        this.safeOpenURL = function(url){
            if(url){
                var w = window.open(url);
                w.opener = null;
            }
        };

        //judge the if the object is Integer
        this.isInt = function(obj){
            return typeof obj === 'number' && obj % 1 === 0;
        }

        this.genHWSHref = function(href, flag){
            if(!href || href === '' || href === '#') {
                return href;
            }

            if(!flag) {
                href = $rootScope.addOrReplaceUrlParameter(href, 'agencyId', $rootScope.getUrlParameter('agencyId', true));

                var region = $rootScope.getUrlParameter('region', true);
                if(region && region !== '' && region !== 'null') {
                    href = $rootScope.addOrReplaceUrlParameter(href, 'region', region);
                }
                //处理国际化
                href = $rootScope.addOrReplaceUrlParameter(href, 'locale', window.urlParams.lang);
            } else if(flag === 'locale') {
                //处理国际化
                href = $rootScope.addOrReplaceUrlParameter(href, 'locale', window.urlParams.lang);
            }

            var indexHash = href.indexOf('#/');
            //没有#号
            if(indexHash === -1) {
                return href;
            }
            var indexQuery = href.indexOf('?');

            var severalIndexQuery = href.indexOf('?',indexQuery+1);

            if(severalIndexQuery !== -1){//有多个查询参数
                return href;
            }else if(indexQuery === -1) { //没有查询参数
                return href.replace('#/', '?hws_route_url=');
            } else if(indexHash < indexQuery) { //#号在?前面
                href = href.replace('?', '&');
                return href.replace('#/', '?hws_route_url=');
            } else { //#号在?后面
                var tmpHrefs = href.split('#/');
                tmpHrefs[1] = tmpHrefs[1].replace('?', '&');
                return tmpHrefs[0] + '&hws_route_url=' + tmpHrefs[1];
            }
        };

        //show warn information
        this.showWarn = function(scope, message){
            scope.errorDescriptionShow = false;
            scope.serviceSideStatus = 'hint_div_error';
            scope.errorIcon = "icon-dps-status-problem icon-status-span-error";
            scope.description = message;
            scope.errorDescriptionShow = true;
        };

        //show success information
        this.showSuccess = function(scope, message){
            scope.errorDescriptionShow = false;
            scope.serviceSideStatus = 'hint_div_normal';
            scope.errorIcon = "icon-dps-status-normal icon-status-span-normal";
            scope.description = message;
            scope.errorDescriptionShow = true;
        };

        this.showNetError = function(scope, i18n, data, message){
            scope.errorDescriptionShow = false;
            if(data.status == 404){
                this.showWarn(scope,i18n.dps_canvas_hint_error404);
            }else if(data.status == 403){
                this.showWarn(scope,i18n.dps_canvas_hint_error403);
            }else if(data.status == 400 || data.status == 500 ){
                    scope.errorDescriptionShow = false;
                    var errorCode = this.setErrorCode(data.responseText);
                    if(errorCode){
                        if($.inArray(parseInt(errorCode), this.getErrorCode()) >= 0 ){
                            scope.serviceSideStatus = 'hint_div_error';
                            scope.errorIcon = "icon-dps-status-problem icon-status-span-error";
                            var type = "errorCode_" + errorCode;
                            if(message){
                                scope.description = message + i18n[type];
                                this.failTip(scope.description)
                            }else{
                                scope.description = i18n[type];
                                this.failTip(scope.description)
                            }

                            scope.errorDescriptionShow = true;
                        }else{
                            scope.serviceSideStatus = 'hint_div_error';
                            scope.errorIcon = "icon-dps-status-problem icon-status-span-error";
                            scope.description =  i18n.serviceSideErrordesc;
                            scope.errorDescriptionShow = true;
                        }
                    }else{
                        scope.serviceSideStatus = 'hint_div_error';
                        scope.errorIcon = "icon-dps-status-problem icon-status-span-error";
                        scope.description =  i18n.serviceSideErrordesc;
                        scope.errorDescriptionShow = true;
                    }

            }else{
                scope.serviceSideStatus = 'hint_div_error';
                scope.errorIcon = "icon-dps-status-problem icon-status-span-error";
                scope.description =  i18n.serviceSideErrordesc;
                scope.errorDescriptionShow = true;
            }
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

    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('commonService', commonService);
});