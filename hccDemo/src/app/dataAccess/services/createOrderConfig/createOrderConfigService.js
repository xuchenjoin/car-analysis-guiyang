
define(["language/dataAccess"], function (keyID) {
    "use strict";
    var createOrderConfigService = function ( camel) {
        var buyServiceInfo = {};//the infomation of service is buyed

        this.getBuyServiceInfo = function(){
            return buyServiceInfo
        };

        this.setBuyServiceInfo = function(infoObj){
            buyServiceInfo = infoObj;
        }

        this.getRegions = function(){;
            var url = 'rest/api/v1/datacraft/bss-orders/subscribe-service/regions';
            var promise = camel.get({
                url: url,
                params: '',
                timeout: 50000
            });
            return promise;
        };

        this.getServices = function(params){
           var url = 'rest/api/v1/datacraft/bss-orders/subscribe-service/products?chargingMode=1';
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 50000
            });
            return promise;
        };

        this.postOrder = function(params){
            var url = 'rest/api/v1/datacraft/bss-orders/subscribe-service/orderPeriodicPipeline';
            var promise = camel.post({
                url : url,
                params : params,
                timeout : 50000
            });
            return promise;
        };
        this.statusCertification = function(){
            var url = 'rest/api/v1/datacraft/bss-orders/subscribe-service/customerverified/status';
            var promise = camel.get({
                url: url,
                params: '',
                timeout: 50000
            });
            return promise;
        };
    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('createOrderConfigService',createOrderConfigService);
});