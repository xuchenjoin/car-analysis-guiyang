/**
 * 告警列表相关服务
 */
define(["language/dataAccess"], function (keyID) {
    "use strict";

    //Register a service constructor, which will be invoked with new to create the service instance
    var service = function (camel) {
        var keyIDI18n = keyID;

        // 获取作业列表
        this.getFakeCars = function (params) {
        	var url="fakeCars";
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 300000
            });
            return promise;
        }
        this.getHightTrafficData = function (params) {
        	var url="highTraffic";
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 300000
            });
            return promise;
        }
        
        this.getCarMovementData = function (params) {
        	var url="carMovement";
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 300000
            });
            return promise;
        }
        this.getCarStaticsData = function (params) {
        	var url="carStatistics";
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 300000
            });
            return promise;
        }
        this.getCarStaticsDailyData = function (params) {
        	var url="carStatistics";
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 300000
            });
            return promise;
        }
        this.getUQeueryData = function (params) {
        	var url="uquery";
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 300000
            });
            return promise;
        }      
        
        this.getJunctions = function () {
        	var params = {
                    api: "getJunctions"                    
                };
        	var url="commonService";
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 300000
            });
            return promise;
        }   
        
    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('fakeCarService', service);
});
