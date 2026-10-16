/**
 * 告警列表相关服务
 */
define(["language/dataAccess"], function (keyID) {
    "use strict";

    //Register a service constructor, which will be invoked with new to create the service instance
    var service = function (camel) {
        var keyIDI18n = keyID;

        // 获取作业列表
        this.getWarningList = function (params) {
        	var url="rest/api/v1/datacraft/pipelines/alarms";
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 12000
            });
            return promise;
        };
        //动态修改下拉搜索框数据
        this.getLevelSelectValue=function(params){
            var url="rest/api/v1/datacraft/pipelines/alarmsCount";
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 12000
            });
            return promise;
        }
    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('warningService', service);
});
