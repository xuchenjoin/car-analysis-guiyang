/**
 * Created by c00379243 on 2016/9/18.
 */

/* global define */
/* global $ */
/* global angular */
define([], function () {
    "use strict";
    var beingMaintainedCtrl = ["$scope", "$sce", function ($scope, $sce) {

        $scope.$watch("displayRegionName", initBeingMaintainedTips);

        function initBeingMaintainedTips() {
            if ($scope.displayRegionName) {
                $scope.console_term_beingMaintained_label = $sce.trustAsHtml(
                    $scope.i18nReplace($scope.i18n.console_term_beingMaintained_label,
                        {
                            "regionName": '<span class="common-color-title">' + $scope.displayRegionName + '</span>'
                        }));
            }
        }
    }];

    var frameModule = angular.module('frm');
    frameModule.tinyController('beingMaintained.ctrl', beingMaintainedCtrl);
    return frameModule;
});