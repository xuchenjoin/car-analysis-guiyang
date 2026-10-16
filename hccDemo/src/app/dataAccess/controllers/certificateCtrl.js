define(['language/dataAccess', 'src/app/common/commonInfo', 'app/dataAccess/controllers/canvas/OBSFileListToSelectCtrl'],
    function (i18n, commonInfo) {

        "use strict";

        var certificateCtrl = function ($rootScope, $scope, $state, $stateParams, $compile, mask, commonService, certificateService, OBSManager) {
            $scope.commonInfo = commonInfo;
            $scope.i18n = i18n;
            $scope.errorDescriptionShow = false;//提示DIV是否显示
            $scope.closeClass = "close close_hint close_list";
            var options = {};
            var pathType;
            var obsPathValidate = [{
                validFn: 'required',
                errorDetail: i18n.dps_canvas_configuration_process_name_validate_required
            },
            {
                validFn: 'regularCheck',
                params: new RegExp('^(s3a:\/\/|s3n:\/\/)'),
                errorDetail: i18n.dps_canvas_configuration_process_obs_path_error_msg
            },
            {
                validFn: 'regularCheck',
                params: new RegExp("^((?![\"<>|\?\*\\\\]).)*$"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorPathNotAllow
            },
            {
                validFn: 'regularCheck',
                "params": new RegExp("^((?![;|&*?\"><'$]).)*$"),
                errorDetail: i18n.dpsValidationErrorPathOnlyForOBS
            },
            {
                validFn: 'maxSize',
                params: 255,
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorMax255Len
            }];
            $scope.OBSPath = {
                id: 'OBSPath',
                value: "",
                placeholder: i18n.dps_certificate_select_path,
                validate: obsPathValidate
            };
            $scope.OBSButton = {
                "id": "OBSButton",
                "text": "OBS",
                "disable": false,
                "click": function () {
                    return $scope.certifica;
                }
            };
            if ($.inArray("te_admin", $rootScope.userRoles) != -1) {
                $scope.OBSButton.disable = false;
            } else {
                $scope.OBSButton.disable = true;
            }
            var tip = new tinyWidget.Tip({
                content: i18n.CertificateTipMessage,
                element: $("#OBSDescription"),
                position: "bottom-right",
                width: 300,
                id: "OBSTip"
            });

            $scope.submitOBSPath = function () {
                if ($scope.OBSButton.disable == false) {
                    if (tinyWidget.UnifyValid.FormValid($("#OBSPath"))) {
                        commonService.successTip(i18n.certificate_generated_running);
                        $scope.OBSButton.disable = true;
                        var params = { 'userObsPath': $scope.OBSPath.value };
                        var promise = certificateService.generateCertificate(params);
                        promise.then(function (data) {
                            $scope.OBSButton.disable = false;
                            commonService.successTip(i18n.certificate_generated_successfully);
                        }, function (data) {
                            if (data.status == 200) {
                                $scope.OBSButton.disable = false;
                                commonService.successTip(i18n.certificate_generated_successfully);
                            } else {
                                $scope.OBSButton.disable = false;
                                commonService.netErrorTip(i18n, data);
                            }
                        });
                    } else if (!$scope.OBSPath.value) {
                        commonService.failTip(i18n.dps_canvas_configuration_process_name_validate_required);
                    } else {
                        commonService.failTip(i18n.checkOBSPath);
                    }
                }
            };
            $scope.certifica = function (event) {
                options = {
                    content: "src/app/dataAccess/views/canvas/OBSFileListToSelect.html",
                    width: "620px",
                    height: "480px",
                    "content-type": "url",
                    title: i18n.dps_OBSfile_browse,
                    buttons: [{
                        key: "btnOK",
                        label: 'OK',
                        focused: true,
                        handler: function (event) {
                            $scope.obsCurrenPath = OBSManager.getCurrentPath();
                            $scope.obsFileList = OBSManager.getFileList();
                            $scope.isObsFile = false;
                            if (OBSManager.getPathType() == "DIRECTORY") {
                                $scope.OBSPath.value = $scope.obsCurrenPath;
                                $("#OBSPath>input").removeClass("valid_error_input");
                                win.destroy();
                            } else {
                                commonService.currentWindowErrorTip(i18n.dps_canvas_configuration_dpsValidationErrorPathMustBeDirectory);
                            }
                        }
                    }, {
                        key: "btnCancel",
                        label: 'Cancel',
                        focused: false,
                        handler: function (event) {
                            win.destroy();
                        }
                    }]
                };
                var win = new tinyWidget.Window(options);
                win.show();
            }
        };
        var dataAccessModule = angular.module('dataAccess.config');
        dataAccessModule.tinyController('certificate.ctrl', certificateCtrl);
        return dataAccessModule;
    });