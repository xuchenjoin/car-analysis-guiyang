
define(["language/dataAccess"], function (keyID) {
    "use strict";
    var createOrderService = function ( camel) {

    };

    var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyService('createOrderService',createOrderService);
});