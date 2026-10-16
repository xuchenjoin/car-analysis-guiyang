define(["language/dataAccess"], function (keyID) {
    "use strict";

    var certificateService = function (camel) {
        var keyIDI18n = keyID;

        this.generateCertificate = function (params) {
            var url="rest/api/v1/datacraft/createCAforAgent";
            var promise = camel.get({
                url: url,
                params :params,
                timeout: 12000
            });
            return promise;
        };
    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('certificateService', certificateService);
});