/**
 * Created by lamb on 3/13/15.
 */
/* global define */
/* global $ */
/* global angular */
define([], function () {
    "use strict";
    var accessDeclinedCtrl = [function () {
    }];

    var frameModule = angular.module('frm');
    frameModule.tinyController('accessDeclined.ctrl', accessDeclinedCtrl);
    return frameModule;
});