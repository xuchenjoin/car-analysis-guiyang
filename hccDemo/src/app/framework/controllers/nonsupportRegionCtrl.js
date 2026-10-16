/**
 * Created by lamb on 3/13/15.
 */
/* global define */
/* global $ */
/* global angular */
define([], function () {
    "use strict";
    var nonsupportCtrl = ["$scope", "$sce", function ($scope, $sce) {

        $scope.$watch("endpointName", initNonsupportTips);
        $scope.$watch("displayRegionName", initNonsupportTips);

        function initNonsupportTips() {
            if ($scope.displayRegionName && $scope.endpointName) {
                $scope.console_term_nonsupportRegion_tips = $sce.trustAsHtml(
                    $scope.i18nReplace($scope.i18n.console_term_nonsupportRegion_tips,
                        {
                            "serviceName": '<spn class="common-color-title">' + $scope.endpointName + '</spn>',
                            "regionName": '<span class="common-color-title">' + $scope.displayRegionName + '</span>'
                        }));

            }
        }
    }];

    var frameModule = angular.module('frm');
    frameModule.tinyController('nonsupportRegion.ctrl', nonsupportCtrl);
    return frameModule;
});