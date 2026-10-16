define(['language/dataAccess',
    'lib/codeMirror/codemirror',
    'lib/codeMirror/sql',
    'lib/codeMirror/sql-hint',
    'lib/codeMirror/show-hint',
    'app/dataAccess/controllers/canvas/bigQueryInputDialog',
    'app/dataAccess/controllers/canvas/OBSFileListToSelectCtrl',
    'app/dataAccess/controllers/canvas/HDFSFileListToSelectCtrl'], function (i18n) {
    "use strict";

    var configurationPanelCtrl = function ($rootScope, $scope, $compile, camel, mask, commonService, pipelineEditorService, canvasService, processManager, editorLayout, clusterManager, OBSManager, $timeout, activityManager, processStatus) {
        $scope.i18n = i18n;
        $scope.layout = editorLayout.getConfigurationPanelLayout();
        $scope.process = processManager.getSelectedProcess();
        $scope.processors = processManager.getProcessArray();
        $scope.lineChangeFlag = processManager.getLineChangeFlag();
        $scope.lines = processManager.getConnections();
        $scope.currentProperty = {key: "", value: "", ifShow: false};
        var computeResourceArrayPromise = [];
        var computeResourceArray = [];
        $scope.editController = {};
        var selectHDFSPathWindow = {};
        var selectOBSPathWindow = {};
        var pathType;

        //[BEGIN ADD  FOR 获取computeResource列表， 2016-12-20]
        canvasService.getComputeResoucesPromise().then(function(response){
            computeResourceArrayPromise = response.resouces;
        }, function (data) {
            if (data.status == 200) {
                computeResourceArrayPromise = data.resouces;
            } else {
                $rootScope.$broadcast('getComputeFromRemote', data);
            }
        });

        for (var i = 0; i < computeResourceArrayPromise.length; i++) {
            var optionArray = {};
            optionArray.selectId = computeResourceArrayPromise[i].nodeId;
            optionArray.label = computeResourceArrayPromise[i].ecsName;
            computeResourceArray.push($.extend(true, {}, optionArray));
        }

        //[BEGIN ADD FOR 获取computeResource列表， 2016-12-20]
        $scope.selectPlaceholder = i18n.dps_canvas_configuration_selectPlaceholder;
        $scope.notInputSensitiveInfo = i18n.dps_canvas_configuration_notInputSensitiveInfo;
        $scope.nameInput = {
            checked: false,
            placeholder: i18n.dps_canvas_configuration_inputname
        };
        $scope.commentsInput = {
            type: "multi",
            width: 240,
            height: 100,
            placeholder: i18n.dps_canvas_configuration_inputcomments,
            resize: "none"
        };
        $scope.clusterSelector = {
            "id": "clusterSelector",
            "width": "240",
            "options": [],
            "select": function (selectId, label) {
                /*var selectedID = $("#" + $scope.clusterSelector.id).widget().getSelectedId();*/
                $scope.process.config.properties["MR ClusterName"] = selectId;
            }
        };
        $scope.window = {
            "HDFS Path": {
                "focused": false
            },
            "OBS Path": {
                "focused": false
            },
            "Hive Script Path": {
                "focused": false
            },
            "Input Data Path": {
                "focused": false
            },
            "Output Data Path": {
                "focused": false
            },
            "Log Path": {
                "focused": false
            },
            "Jar Path": {
                "focused": false
            },
            "Path of Jar File": {
                "focused": false
            },
            "LOG path": {
                "focused": false
            },
            "HFILE Path": {
                "focused": false
            },
            "CSV Archive Path": {
                "focused": false
            },
            "Custom Jar Path": {
                "focused": false
            },
            "Extended Arguments File Path": {
                "focused": false
            },
            "Destination Log Path": {
                "focused": false
            }
        };

        $scope.ifReadOnly = {
            "HDFS": {
                "ifReadOnly": true
            },
            "OBS": {
                "ifReadOnly": true
            }
        };

        $scope.logBackup = {
            "id": "logBackup",
            "width": "240",
            "options": [{
                selectId: "True",
                label: "True"
            }, {
                selectId: "False",
                label: "False"
            }],
            "change": function () {
                var selectedID = $("#" + $scope.logBackup.id).widget().getSelectedId();
                $scope.process.config.properties["Log Backup"] = selectedID;
            }
        };

        //[BEGIN ADD FOR 计算资源配置单选框 ， 2016-12-17]
        $scope.computeResource = {
            "id": "computeResource",
            "width": "240",
            "options": [],
            "select": function (selectId, label) {
                var selectedID = $("#" + $scope.computeResource.id).widget().getSelectedId();
                $scope.process.config.properties["computeResource"][0] = selectedID;
            }
        };
        //[END ADD  FOR 计算资源配置单选框， 2016-12-17]
        $scope.$watch('process.config.properties["CSV Archive Required"]', function () {
            if ($scope.process.type === 'com.huawei.datacraft.activity.LoadHbase' || $scope.process.type === 'LoadHbase') {
                if ($scope.process.config.properties.hasOwnProperty("CSV Archive Required") && $scope.process.config.properties['CSV Archive Required'] == 'No') {
                    $scope.validationMapping.LoadHbase['CSV Archive Path'] = [VR.maxNameLen128, VR.pathNotAllow];
                    $scope.process.config.descriptors['CSV Archive Path'].required = false;
                    $scope.process.config.descriptors['CSV Archive Path'].show = false;
                }

                if ($scope.process.config.properties.hasOwnProperty("CSV Archive Required") && $scope.process.config.properties['CSV Archive Required'] == 'Yes') {
                    $scope.validationMapping.LoadHbase['CSV Archive Path'] = [VR.maxNameLen128, VR.pathNotAllow, VR.required];
                    $scope.process.config.descriptors['CSV Archive Path'].required = true;
                    $scope.process.config.descriptors['CSV Archive Path'].show = true;
                }
            }

        });

        /**
         * auto save process name
         */
        $scope.$watch('process.name', function() {
            _.forEach($scope.processors, function(element){
                if(element.id === $scope.process.id) {
                    element.name = $scope.process.name;
                }
            })
        });

        $scope.$watch('process.config.properties["Log Backup"]', function () {
            if ($scope.process.type === 'com.huawei.datacraft.processactivity.ExecuteScript' || $scope.process.type === 'ExecuteScript') {
                if (!$scope.process.config.properties.hasOwnProperty("Log Backup") || $scope.process.config.properties['Log Backup'] == 'False') {
                    $scope.process.config.descriptors['Destination Log Path'].required = false;
                    $scope.process.config.descriptors['Destination Log Path'].show = false;
                }

                if ($scope.process.config.properties.hasOwnProperty("Log Backup") && $scope.process.config.properties['Log Backup'] == 'True') {
                    $scope.process.config.descriptors['Destination Log Path'].required = true;
                    $scope.process.config.descriptors['Destination Log Path'].show = true;
                }
            }
        });

        $scope.$watch("process.isFile", function () {
            //判断OBS是输入还是输出添加不同验证规则，作为输出或者既有输入又有输出OBS Path只能是目录，否则既可以是文件也可以是目录
            for (var i = 0; i < $scope.lines.length; i++) {
                if ($scope.lines[i].source.id === $scope.process.id) {
                    //说明只有输入
                    $scope.validationMapping.OBS["OBS Path"] = [VR.required, VR.pathOfOBS, VR.max255Len];
                } else if ($scope.lines[i].destination.id === $scope.process.id) {
                    //只有输出或者是既有输入又有输出
                    if ($scope.process.isFile === true) {
                        $scope.validationMapping.OBS["OBS Path"] = [VR.required, VR.pathOfOBS, VR.pathOfObsFile, VR.max255Len];
                        return;
                    } else {
                        $scope.validationMapping.OBS["OBS Path"] = [VR.required, VR.pathOfOBS, VR.max255Len];
                    }

                }
            }
        });
        $scope.$watch('process.id', function () {
            if ($scope.process.type === "RDS" || $scope.process.type === "com.huawei.datacraft.RDS") {
                var dbDriverNameArray = [];
                var driverObj = {};
                driverObj.selectId = $scope.process.config.properties['DB Driver Name'];
                driverObj.label = $scope.process.config.properties['DB Driver Name'];
                driverObj.checked = true;
                dbDriverNameArray.push(driverObj);

                $scope.dbDriverName = {
                    "id": "dbDriverName",
                    "options": dbDriverNameArray,
                    "change": function () {
                        var selectedID = $("#" + $scope.dbDriverName.id).widget().getSelectedId();
                        $scope.process.config.properties["DB Driver Name"] = selectedID;
                    }
                }
            }

            if ($scope.process.hasOwnProperty('config') && $scope.process.config.hasOwnProperty('properties') && $scope.process.config.properties.hasOwnProperty('Log Backup')) {
                if ($scope.logBackup) {
                    if ($("#" + $scope.logBackup.id).widget()) {
                        $timeout(function () {
                            $("#" + $scope.logBackup.id).widget().opChecked("")
                        }, 0);
                    }
                }
                if ($scope.logBackup.options.length) {
                    for (var i = 0; i < $scope.logBackup.options.length; i++) {
                        if ($scope.logBackup.options[i].selectId == $scope.process.config.properties['Log Backup']) {
                            $timeout(function () {
                                $("#" + $scope.logBackup.id).widget().opChecked($scope.process.config.properties['Log Backup'])
                            }, 0);
                        }
                    }
                }
            }


            //[BEGIN ADD FOR 计算资源配置 ， 2016-12-17]
            if ($scope.process.hasOwnProperty("processorType") && $scope.process.processorType === "PROCESS_ACTIVITY") {
                computeResourceArray = [];
                for (var i = 0; i < computeResourceArrayPromise.length; i++) {
                    var optionArray = {};
                    optionArray.selectId = computeResourceArrayPromise[i].nodeId;
                    optionArray.label = computeResourceArrayPromise[i].ecsName;
                    if (computeResourceArrayPromise[i].nodeId ===  $scope.process.config.properties["computeResource"]) {
                        optionArray.checked = true;
                    }
                    computeResourceArray.push($.extend(true, {}, optionArray));
                }
                $scope.computeResource.options = computeResourceArray;
                $scope.process.config.properties.computeResource = $scope.process.computeResource;
                $scope.process.config.descriptors.computeResource = {
                    "name": "computeResource",
                    "displayName": i18n.dps_canvas_configuration_computeResource,
                    "description": i18n.dps_canvas_configuration_title_computeResource,
                    "required": true,
                    "sensitive": true,
                    "dynamic": false,
                    "supportsEl": false,
                    "show": true
                };
                if ($scope.computeResource) {
                    if ($("#" + $scope.computeResource.id).widget()) {
                        $timeout(function () {
                            $("#" + $scope.computeResource.id).widget().opChecked("")
                        }, 0);
                    }
                }
                if ($scope.computeResource.options.length) {
                    for (var i = 0; i < $scope.computeResource.options.length; i++) {
                        if ($scope.computeResource.options[i].selectId == $scope.process.config.properties['computeResource'][0]) {
                            $timeout(function () {
                                $("#" + $scope.computeResource.id).widget().opChecked($scope.process.config.properties['computeResource'][0])
                            }, 0);
                        }
                    }
                }

            }

            //[END ADD FOR 计算资源配置 ， 2016-12-17]
            if ($scope.clusterSelector.options.length) {
                for (var i = 0; i < $scope.clusterSelector.options.length; i++) {
                    if ($scope.process.config.descriptors["MR ClusterName"] && $scope.process.config.descriptors["MR ClusterName"].required == true && $scope.process.hasOwnProperty("config") && $scope.process.config.hasOwnProperty("properties") && $scope.process.config.properties.hasOwnProperty('MR ClusterName')) {
                        if ($scope.clusterSelector.options[i].selectId == $scope.process.config.properties['MR ClusterName']) {
                            $timeout(function () {
                                /*$("#" + $scope.clusterSelector.id).widget().opChecked($scope.clusterSelector.options[i].selectId)*/
                                $("[id^=clusterSelector]>div").widget().opChecked($scope.clusterSelector.options[i].selectId)
                            }, 0);
                            break;
                        }
                        if ($scope.process.config.properties.hasOwnProperty('MR ClusterName')) {
                            if ($("#" + $scope.clusterSelector.id).widget() && $("#" + $scope.clusterSelector.id).widget().opChecked() != undefined) {
                                $timeout(function () {
                                    $("#" + $scope.clusterSelector.id).widget().opChecked("");
                                }, 0);
                            }
                        }
                    }
                }
            }
        });

        $scope.sourceSelector = {
            "id": "sourceSelector",
            "options": [{
                selectId: "HDFS/OBS",
                label: "HDFS/OBS"
            },
                {
                    selectId: "RDS",
                    label: "RDS"
                }],
            "change": function () {

                var selectedID = $("#" + $scope.sourceSelector.id).widget().getSelectedId();

                if (selectedID === "HDFS/OBS") {
                    //前端效果
                    $scope.process.sortArray = processManager.sortArrayForSqoop1;
                    $scope.targetSelector.options = [{selectId: "RDS", label: "RDS"}];

                } else {
                    //前端效果
                    $scope.process.sortArray = processManager.sortArrayForSqoop2;
                    $scope.targetSelector.options = [{selectId: "HDFS/OBS", label: "HDFS/OBS"}];
                }
                $scope.process.config.properties["Source"] = selectedID;
            }
        };
        /**
         * sqoop
         */
        $scope.$watch('process.sortArray', function () {
            if ($scope.clusterSelector.options.length) {
                for (var i = 0; i < $scope.clusterSelector.options.length; i++) {
                    if ($scope.process.config.descriptors["MR ClusterName"] && $scope.process.config.descriptors["MR ClusterName"].required == false && $scope.process.hasOwnProperty("config") && $scope.process.config.hasOwnProperty("properties") && $scope.process.config.properties.hasOwnProperty('MR ClusterName')) {
                        if ($scope.clusterSelector.options[i].selectId == $scope.process.config.properties['MR ClusterName']) {
                            $timeout(function () {
                                $("#" + $scope.clusterSelector.id).widget().opChecked($scope.process.config.properties['MR ClusterName'])
                            }, 0);
                            break;
                        }
                        if ($scope.process.config.properties.hasOwnProperty('MR ClusterName')) {
                            if ($("#" + $scope.clusterSelector.id).widget() && $("#" + $scope.clusterSelector.id).widget().opChecked() != undefined) {
                                $timeout(function () {
                                    $("#" + $scope.clusterSelector.id).widget().opChecked("");
                                }, 0);
                            }
                        }
                    }
                }
            }

            if ($scope.process.config) {
                if ($scope.actionSelector.options.length) {
                    for (var i = 0; i < $scope.actionSelector.options.length; i++) {
                        if ($scope.process.config.descriptors["MR ClusterName"] && $scope.process.config.descriptors["MR ClusterName"].required == false && $scope.actionSelector.options[i].selectId == $scope.process.config.properties['Action']) {
                            $timeout(function () {
                                $("#" + $scope.actionSelector.id).widget().opChecked($scope.process.config.properties['Action'])
                            }, 0);
                            break;
                        }
                        if ($scope.process.config.descriptors["MR ClusterName"] && $scope.process.config.descriptors["MR ClusterName"].required == false && $scope.process.config.properties.hasOwnProperty('Action') && $scope.process.config.properties.Action) {
                            $timeout(function () {
                                $("#" + $scope.actionSelector.id).widget().opChecked("")
                            }, 0);
                        }
                    }
                }
            }
        });

        $scope.targetSelector = {
            "id": "targetSelector",
            "options": [{
                selectId: "HDFS/OBS",
                label: "HDFS/OBS"
            },
                {
                    selectId: "RDS",
                    label: "RDS"
                }],
            "change": function () {
                var sourceSelectedID = $("#" + $scope.sourceSelector.id).widget().getSelectedId();
                if (!sourceSelectedID) {
                    $timeout(function () {
                        $("#" + $scope.targetSelector.id).widget().opChecked("")
                    }, 0);
                    $rootScope.$broadcast('selectSourceFirst', i18n.dps_canvas_configuration_selectSourceFirst);
                    return;
                } else {
                    var selectedID = $("#" + $scope.targetSelector.id).widget().getSelectedId();
                    $scope.process.config.properties["Target"] = selectedID;
                }
            }
        };


        $scope.getFixedDescription = function (displayName, description) {
            if (displayName && description) {
                return displayName === description ? displayName : (displayName + ': ' + description);
            }
        };
        $scope.loadTypeSelector = {
            "id": "loadTypeSelector",
            "options": [{
                selectId: "BULKLOAD",
                label: "BULKLOAD"
            },
                {
                    selectId: "INSERT",
                    label: "INSERT"
                }],
            "change": function () {
                var selectedID = $("#" + $scope.loadTypeSelector.id).widget().getSelectedId();
                $scope.process.config.properties["Load Type"] = selectedID;
            }
        };

        $scope.csvArchiveNeededSelector = {
            "id": "csvArchiveNeededSelector",
            "options": [{
                selectId: "Yes",
                label: "Yes"
            },
                {
                    selectId: "No",
                    label: "No"
                }],
            "change": function () {
                var selectedID = $("#" + $scope.csvArchiveNeededSelector.id).widget().getSelectedId();
                $scope.process.config.properties["CSV Archive Required"] = selectedID;
            }
        };

        $scope.$watch('process.id', function () {
            if ($scope.process.config) {
                if ($scope.loadTypeSelector.options.length) {
                    for (var i = 0; i < $scope.loadTypeSelector.options.length; i++) {
                        if ($scope.loadTypeSelector.options[i].selectId == $scope.process.config.properties['Load Type']) {
                            $timeout(function () {
                                /*$("#" + $scope.loadTypeSelector.id).widget().opChecked($scope.loadTypeSelector.options[i].selectId)
                                 }, 0);*/
                                $("#" + $scope.loadTypeSelector.id).widget().opChecked($scope.process.config.properties['Load Type'])
                            }, 0);
                            break;
                        }
                        if ($scope.process.config.properties.hasOwnProperty('Load Type')) {
                            $timeout(function () {
                                $("#" + $scope.loadTypeSelector.id).widget().opChecked("")
                            }, 0);
                        }
                    }
                }
                if ($scope.csvArchiveNeededSelector.options.length) {
                    for (var i = 0; i < $scope.csvArchiveNeededSelector.options.length; i++) {
                        if ($scope.csvArchiveNeededSelector.options[i].selectId == $scope.process.config.properties['CSV Archive Required']) {
                            $timeout(function () {
                                $("#" + $scope.csvArchiveNeededSelector.id).widget().opChecked($scope.csvArchiveNeededSelector.options[i].selectId)
                            }, 0);
                            break;
                        }
                        if ($scope.process.config.properties.hasOwnProperty('CSV Archive Required')) {
                            $timeout(function () {
                                $("#" + $scope.csvArchiveNeededSelector.id).widget().opChecked("")
                            }, 0);
                        }
                    }
                }
                $scope.ifReadOnly.HDFS.ifReadOnly = true;
                $scope.ifReadOnly.OBS.ifReadOnly = true;

                if ($scope.process.type == 'HDFS' || $scope.process.type == 'com.huawei.datacraft.HDFS') {
                    for (var i = 0; i < $scope.lines.length; i++) {
                        if ($scope.process.id == $scope.lines[i].destination.id) {
                            var sourceID = $scope.lines[i].source.id;
                            for (var j = 0; j < $scope.processors.length; j++) {
                                if (sourceID == $scope.processors[j].id && ($scope.processors[j].type == 'InvokeSqoop' || $scope.processors[j].type == 'com.huawei.datacraft.activity.InvokeSqoop')) {
                                    var obj = $scope.ifReadOnly['HDFS'];
                                    commonService.changeStatuToFalse($scope, obj, 'ifReadOnly');
                                }
                            }
                        }
                    }
                }

                if ($scope.process.type == "com.huawei.datacraft.OBS" || $scope.process.type == "OBS") {
                    for (var i = 0; i < $scope.lines.length; i++) {
                        if ($scope.process.id == $scope.lines[i].destination.id) {
                            var sourceID = $scope.lines[i].source.id;
                            for (var j = 0; j < $scope.processors.length; j++) {
                                if (sourceID == $scope.processors[j].id && ($scope.processors[j].type == 'InvokeSqoop' || $scope.processors[j].type == 'com.huawei.datacraft.activity.InvokeSqoop')) {
                                    var obj = $scope.ifReadOnly['OBS'];
                                    commonService.changeStatuToFalse($scope, obj, 'ifReadOnly');
                                }
                            }
                        }
                    }
                }
                $scope.$evalAsync();
            }
        });

        $scope.$watch('lineChangeFlag.flag', function () {
            $scope.ifReadOnly.HDFS.ifReadOnly = true;
            $scope.ifReadOnly.OBS.ifReadOnly = true;
            if ($scope.process.type == 'HDFS' || $scope.process.type == 'com.huawei.datacraft.HDFS') {
                for (var i = 0; i < $scope.lines.length; i++) {
                    if ($scope.process.id == $scope.lines[i].destination.id) {
                        var sourceID = $scope.lines[i].source.id;
                        for (var j = 0; j < $scope.processors.length; j++) {
                            if (sourceID == $scope.processors[j].id && ($scope.processors[j].type == 'InvokeSqoop' || $scope.processors[j].type == 'com.huawei.datacraft.activity.InvokeSqoop')) {
                                var obj = $scope.ifReadOnly['HDFS'];
                                commonService.changeStatuToFalse($scope, obj, 'ifReadOnly');
                            }
                        }
                    }
                }
            }

            if ($scope.process.type == "com.huawei.datacraft.OBS" || $scope.process.type == "OBS") {
                for (var i = 0; i < $scope.lines.length; i++) {
                    if ($scope.process.id == $scope.lines[i].destination.id) {
                        var sourceID = $scope.lines[i].source.id;
                        for (var j = 0; j < $scope.processors.length; j++) {
                            if (sourceID == $scope.processors[j].id && ($scope.processors[j].type == 'InvokeSqoop' || $scope.processors[j].type == 'com.huawei.datacraft.activity.InvokeSqoop')) {
                                var obj = $scope.ifReadOnly['OBS'];
                                commonService.changeStatuToFalse($scope, obj, 'ifReadOnly');
                            }
                        }
                    }
                }
            }

            $scope.$evalAsync();
        });

        $scope.dbPasswordInput = {
            checked: false,
            type: "password",
            placeholder: "input password here"
        };

        //Distcp--Action
        $scope.actionSelector = {
            "id": "actionSelector",
            "options": [{
                selectId: "import",
                label: "import"
            },
                {
                    selectId: "export",
                    label: "export"
                }],
            "change": function () {
                var selectedID = $("#" + $scope.actionSelector.id).widget().getSelectedId();
                $scope.process.sortArray = processManager.sortArrayForDistcpAction1;
                $scope.actionSelectorVal = selectedID;
                $scope.process.config.properties["Action"] = selectedID;

            }
        };
        $scope.actionSelectorVal = null;
        $scope.$watch('process.id', function () {
            if ($scope.process.config) {
                if ($scope.actionSelector.options.length) {
                    for (var i = 0; i < $scope.actionSelector.options.length; i++) {
                        if ($scope.process.config.descriptors["MR ClusterName"] && $scope.process.config.descriptors["MR ClusterName"].required == false && $scope.actionSelector.options[i].selectId == $scope.process.config.properties['Action']) {
                            $timeout(function () {
                                $("#" + $scope.actionSelector.id).widget().opChecked($scope.actionSelector.options[i].selectId)
                            }, 0);
                            $scope.actionSelectorVal = $scope.actionSelector.options[i].selectId;
                            break;
                        }
                    }
                }
            }
        });

        /**
         * check if use cluster selector to input param
         * @param key
         * @returns {boolean}
         */
        $scope.useClusterSelector = function (key) {
            if (key.toUpperCase() == "MR CLUSTERNAME" && key) {
                return true;
            }
            return false;
        };

        $scope.useHDFSWindow = function (key) {
            if (key && (key.toLowerCase() == "hdfs path" || key.toLowerCase() == "jar path" || key.toLowerCase() == "log path" || key.toLowerCase() == "input data path" || key.toLowerCase() == "output data path" || key.toLowerCase() == "input directory" || key.toLowerCase() == "driver class" || key.toLowerCase() == "path of jar file" || key.toLowerCase() == "output directory" || key.toLowerCase() == "hdfs/obs path" || key.toLowerCase() == "csv archive path" || key.toLowerCase() == "hfile path" || key.toLowerCase() == "custom jar path" || key.toLowerCase() == "extended arguments file path" || key.toLowerCase() == "hive script path")) {
                return true;
            }
            return false;
        };
        $scope.useOBSWindow = function (key) {
            if (key && (key.toLowerCase() == "obs path" || key.toLowerCase() == "obs url" || key.toLowerCase() == "jar path" || key.toLowerCase() == "log path" || key.toLowerCase() == "input data path" || key.toLowerCase() == "output data path" || key.toLowerCase() == "input directory" || key.toLowerCase() == "driver class" || key.toLowerCase() == "path of jar file" || key.toLowerCase() == "output directory" || key.toLowerCase() == "hdfs/obs path" || key.toLowerCase() == "destination log path" || key.toLowerCase() == "hive script path")) {
                return true;
            }
            return false;
        };
        /**
         * init cluster array
         */
        clusterManager.getClusterArrayPromise().then(
            function (response) {
                var clusterArray = clusterManager.getClusterArray();
                for (var i = 0; i < clusterArray.length; i++) {
                    $scope.clusterSelector.options.push({
                        selectId: clusterArray[i].clusterId,
                        label: clusterArray[i].clusterName
                    });
                }
            }, function (data) {
                if (data.status == "200") {
                    var clusterArray = clusterManager.getClusterArray();
                    for (var i = 0; i < clusterArray.length; i++) {
                        $scope.clusterSelector.options.push({
                            selectId: clusterArray[i].clusterId,
                            label: clusterArray[i].clusterName
                        });
                    }
                } else {
                    var datas = {};
                    datas.data = data;
                    datas.action = i18n.dps_canvas_configuration_getClusterIDS;
                }
            }
        );

        $scope.close = function () {
            $scope.layout.ifShow = false;
            pipelineEditorService.layout.fn.hideConfigurationContainer();
            document.querySelector(".canvas-container").style.transform = "";
        };
        $scope.editProperty = function (key, value) {
            if (key && value) {
                $scope.currentProperty.ifShow = false;
                $scope.editController[$scope.process.id + key] = true;
                $scope.currentProperty.key = key;
                $scope.currentProperty.value = value;
            }
        };
        $scope.cancelEditProperty = function (key) {
            if (key) {
                $scope.editController[$scope.process.id + key] = false;
                $scope.currentProperty.ifShow = false;
            }
        };
        $scope.saveEditProperty = function (key) {
            if (key) {
                $scope.editController[$scope.process.id + key] = false;
                $scope.currentProperty.ifShow = false;
                $scope.process.config.properties[$scope.currentProperty.key] = $scope.currentProperty.value;
            }

        };
        $scope.addcurrentProperty = function () {
            $scope.currentProperty.key = "";
            $scope.currentProperty.value = "";
            $scope.currentProperty.ifShow = true;
        };

        $scope.deleteProperty = function (key) {
            if (key) {
                if ($scope.process.type == "InvokeSqoop" || $scope.process.type == "com.huawei.datacraft.activity.InvokeSqoop") {
                    var sortArray = $scope.process.sortArray;
                    for (var i = sortArray.length - 1; i >= 0; i--) {
                        for (var item in sortArray[i]) {
                            if (item === key) {
                                sortArray.splice(i, 1);
                            }
                        }
                    }
                }
                delete $scope.process.config.properties[key];
            }
        };

        $scope.applyButton = {
            text: i18n.dps_canvas_configuration_applyButton,
            click: function () {
                $rootScope.isNeedEncode = false;
                processManager.setSaveFlag(true);
                var processor = processManager.getProcessArray();

                // refresh validators
                processManager.refreshProcessListValidationErrorsFromCurrent(processor, $scope.process);

                if (tinyWidget.UnifyValid.FormValid($("#processConfigurationForm"))) {
                    //added  fo check the dupicate in the processorname
                    if (processor.length > 1) {
                        for (var i = 0; i < processor.length; i++) {
                            var processorName = processor[i].name;
                            var jobName = processor[i].config.properties['Job Name']
                            var processorID = processor[i].id;
                            if (processorName === $scope.process.name) {
                                if (processorID != $scope.process.id) {
                                    $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsValidationforSameProcessName);
                                    return true;
                                }
                            }
                            if (jobName === $scope.process.config.properties['Job Name'] && jobName && jobName != undefined) {
                                if (processorID != $scope.process.id) {
                                    $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsValidationforSameProcessJobName);
                                    return true;
                                }
                            }
                        }
                        ;
                    }

                    if ($scope.process.type == "com.huawei.datacraft.processactivity.ExecuteScript" || $scope.process.type == "ExecuteScript") {
                        if ($scope.process.config.properties['Log Backup'] == 'True' && !$scope.process.config.properties['Destination Log Path']) {
                            $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_destinationRequired);
                            return;
                        }
                    }


                    $scope.process.config.autoTerminatedRelationships = [];
                    /*for (var i = 0; i < $scope.process.relationships.length; i++) {
                     if ($scope.process.relationships[i].autoTerminate) {
                     $scope.process.config.autoTerminatedRelationships.push($scope.process.relationships[i].name);
                     }
                     }*/
                    var currentProcessor = processManager.getProcessByID($scope.process.id);
                    currentProcessor.name = $scope.process.name;

                    //[BEGIN ADD FOR 保存processor属性修改， 2016-12-17]
                    if ($scope.process.processorType === "PROCESS_ACTIVITY") {
                        var id = $scope.process.config.properties.computeResource[0];
                        for (var i = 0; i < computeResourceArrayPromise.length; i++) {
                            if (id === computeResourceArrayPromise[i].nodeId) {
                                currentProcessor.computeResource[0] = computeResourceArrayPromise[i].nodeId;
                            }
                        }
                    }
                    var configTemp = $.extend(true, {}, $scope.process.config);
                    delete  configTemp.properties.computeResource;
                    currentProcessor.config = $.extend(true, {}, configTemp);

                    //[END ADD  FOR 保存processor属性修改 ， 2016-12-17]
                    var legalFlags = activityManager.getLegalFlags();
                    for (var key in legalFlags) {
                        if (key == $scope.process.id) {
                            legalFlags[key] = true;
                            break;
                        }
                    }
                    $rootScope.$broadcast('configurationPanelControllerSuccess', i18n.dps_canvas_configuration_applySucess);
                    processManager.refreshLocalProcess(currentProcessor);
                }
                // to show the error msg when congif properties are leave empty
                else {
                    $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsconfigvalidationMessage);
                }
            }
        };
        $scope.cancelButton = {
            text: i18n.dps_canvas_configuration_cancelButton,
            click: function () {
                var originProcess = processManager.getProcessByID($scope.process.id);
                for (var key in $scope.process) {
                    if (key == "config") {
                        for (var key1 in $scope.process[key].properties) {
                            $scope.process[key].properties[key1] = null;
                        }

                    }
                    if (key == "name") {
                        $scope.process[key] = null;
                    }
                }

                if ($scope.clusterSelector) {
                    if ($("#" + $scope.clusterSelector.id).widget() && $("#" + $scope.clusterSelector.id).widget().opChecked() != undefined) {
                        $timeout(function () {
                            $("#" + $scope.clusterSelector.id).widget().opChecked("");
                        }, 0);
                    }
                }
                if ($scope.logBackup) {
                    if ($("#" + $scope.logBackup.id).widget()) {
                        $timeout(function () {
                            $("#" + $scope.logBackup.id).widget().opChecked("")
                        }, 0);
                    }
                }
                if ($scope.computeResource) {
                    if ($("#" + $scope.computeResource.id).widget()) {
                        $timeout(function () {
                            $("#" + $scope.computeResource.id).widget().opChecked("")
                        }, 0);
                    }
                }
                if ($scope.dbDriverName) {
                    if ($("#" + $scope.dbDriverName.id).widget()) {
                        $timeout(function () {
                            $("#" + $scope.dbDriverName.id).widget().opChecked("")
                        }, 0);
                    }
                }

                if ($scope.dbDriverName) {
                    if ($("#" + $scope.loadTypeSelector.id).widget()) {
                        $timeout(function () {
                            $("#" + $scope.loadTypeSelector.id).widget().opChecked("")
                        }, 0);
                    }
                }
                /*$scope.$apply();*/
                $.extend(true, $scope.process, originProcess);

                // decode properties
                for (var item in $scope.process.config.properties) {
                    if (item.toLowerCase() === "query" || item.toLowerCase() === "query statement") {
                        if ($scope.process.config.properties[item]) {
                            $scope.process.config.properties[item] = $.base64.decode($scope.process.config.properties[item]);
                        }
                    }
                }
            }
        };
        $scope.selectHDFSPath = function (key, selectOption) {
            if ($scope.process.config.properties["MR ClusterName"] && key) {
                var obj = $scope.window[key];
                if (!obj.focused)
                    commonService.getFocusValidate($scope, obj);
                clusterManager.setHDFSClusterID($scope.process.config.properties["MR ClusterName"]);
                clusterManager.setCurrentPath($scope.process.config.properties[key] || "/");
                options.content = "src/app/dataAccess/views/canvas/HDFSFileListToSelect.html";
                options.width = "600px";
                options.buttons = [{
                    key: "btnOK",
                    label: 'OK',
                    focused: true,
                    handler: function (event) {
                        var type = $('#HDFSFileListToSelectWindow').scope().fileType;
                        pathType = clusterManager.getPathType();
                        if (($scope.process.type == 'ExecuteHive' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteHive'
                            || $scope.process.type == 'ExecuteMR' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteMR'
                            || $scope.process.type == 'ExecuteSpark' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteSpark'
                            || $scope.process.type == 'ExecuteSpark' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteSpark') && (key == 'Input Data Path' || key == 'Output Data Path') || key.toUpperCase() == 'LOG PATH' || key.toUpperCase() == 'CSV ARCHIVE PATH') {
                            if (pathType != 'DIRECTORY') {
                                $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsValidationErrorPathMustBeDirectory);
                                return false;
                            }
                        }

                        var hdfsNewPath = clusterManager.getCurrentPath();
                        var len = hdfsNewPath.length;
                        /*if(hdfsNewPath.charAt(len-1) == "/" ){
                         $scope.process.config.properties[key] = hdfsNewPath.substring(0,len-1);
                         }else{
                         $scope.process.config.properties[key] = hdfsNewPath;
                         }*/
                        $scope.process.config.properties[key] = clusterManager.getCurrentPath();
                        var obj = $scope.window[key];
                        selectHDFSPathWindow.destroy();
                        commonService.getFocusValidate($scope, obj);
                        for (var i = 0; i < $scope.lines.length; i++) {
                            if ($scope.lines[i].source.id === $scope.process.id) {
                                //说明只有输入
                                $scope.validationMapping.HDFS["HDFS Path"] = [VR.required, VR.pathOfHDFS, VR.pathOfHDFSFileTest, VR.max255Len];
                                return;
                            } else if ($scope.lines[i].destination.id === $scope.process.id) {
                                //只有输出或者是既有输入又有输出
                                if (pathType === "FILE") {
                                    $scope.validationMapping.HDFS["HDFS Path"] = [VR.required, VR.pathOfHDFS, VR.pathOfHDFSFileTest, VR.max255Len, VR.pathOfHDFSFile];
                                    return;
                                } else {
                                    $scope.validationMapping.HDFS["HDFS Path"] = [VR.required, VR.pathOfHDFS, VR.pathOfHDFSFileTest, VR.max255Len];
                                }

                            }
                        }
                    }
                }, {
                    key: "btnCancel",
                    label: 'Cancel',
                    focused: false,
                    handler: function (event) {
                        selectHDFSPathWindow.destroy();
                    }
                }];
                options.title = i18n.dps_HDFSSfile_browse;
                selectHDFSPathWindow = new tinyWidget.Window(options);
                selectHDFSPathWindow.show();
            } else {
                $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_needClusterIDFirst);
            }
        };
        $scope.selectOBSPath = function (key, selectOption) {
            if (key) {
                var obj = $scope.window[key];
                if (!obj.focused)
                    commonService.getFocusValidate($scope, obj);
                OBSManager.setCurrentPath($scope.process.config.properties[key] || "s3a://");
                options.content = "src/app/dataAccess/views/canvas/OBSFileListToSelect.html";
                options.width = "620px",
                    options.buttons = [{
                        key: "btnOK",
                        label: 'OK',
                        focused: true,
                        handler: function (event) {
                            var type = $('#OBSFileListToSelectWindow').scope().fileType;
                            var obsNewPath = OBSManager.getCurrentPath();
                            var len = obsNewPath.length;
                            /*if(obsNewPath.charAt(len-1) == "/" ){
                             $scope.obsCurrenPath = obsNewPath.substring(0,len-1);
                             }else{
                             $scope.obsCurrenPath = obsNewPath;
                             }*/
                            $scope.obsCurrenPath = obsNewPath;
                            /*$scope.obsCurrenPath = OBSManager.getCurrentPath();*/
                            $scope.obsFileList = OBSManager.getFileList();
                            $scope.isObsFile = false;
                            pathType = OBSManager.getPathType();
                            if (($scope.process.type == 'ExecuteHive' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteHive'
                                || $scope.process.type == 'ExecuteMR' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteMR'
                                || $scope.process.type == 'ExecuteSpark' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteSpark'
                                || $scope.process.type == 'ExecuteSpark' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteSpark'
                                ) && (key == 'Input Data Path'
                                || key == 'Output Data Path') || key.toUpperCase() == 'LOG PATH' || key.toUpperCase() == 'CSV ARCHIVE PATH') {
                                if (pathType != 'DIRECTORY') {
                                    $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsValidationErrorPathMustBeDirectory);
                                    return false;
                                }
                            }
                            $scope.process.config.properties[key] = $scope.obsCurrenPath;
                            for (var i = 0; i < $scope.obsFileList.length; i++) {
                                $scope.obsCurrentFilePathS3n = "s3n://" + $scope.obsFileList[i].bucketName + "/" + $scope.obsFileList[i].objectKey;
                                $scope.obsCurrentFilePathS3a = "s3a://" + $scope.obsFileList[i].bucketName + "/" + $scope.obsFileList[i].objectKey;
                                if ($scope.obsCurrentFilePathS3n === $scope.obsCurrenPath || $scope.obsCurrentFilePathS3a === $scope.obsCurrenPath) {
                                    $scope.isObsFile = true;
                                    break;
                                }
                            }
                            if ($scope.isObsFile === true) {
                                $scope.process.isFile = true;
                                $scope.$apply();
                            } else {
                                $scope.process.isFile = false;
                                $scope.$apply();
                            }
                            var obj = $scope.window[key];
                            selectOBSPathWindow.destroy();
                            commonService.getFocusValidate($scope, obj);
                        }
                    }, {
                        key: "btnCancel",
                        label: 'Cancel',
                        focused: false,
                        handler: function (event) {
                            selectOBSPathWindow.destroy();
                        }
                    }];
                options.title = i18n.dps_OBSfile_browse;
                selectOBSPathWindow = new tinyWidget.Window(options);
                selectOBSPathWindow.show();
            }
        };


        $scope.$watch('process.id', function () {
            if ($scope.process.config) {
                if ($scope.process.type == 'HDFS' || $scope.process.type == 'com.huawei.datacraft.HDFS') {
                    for (var i = 0; i < $scope.lines.length; i++) {
                        if ($scope.process.id == $scope.lines[i].destination.id) {

                            var type = $('#HDFSFileListToSelectWindow').scope();
                            var pathType = clusterManager.getPathType();
                            if (pathType == "FILE") {
                                $scope.validationMapping.HDFS["HDFS Path"] = [VR.required, VR.pathOfHDFS, VR.pathOfHDFSFileTest, VR.max255Len, VR.pathOfHDFSFile];
                                return;
                            } else {
                                $scope.validationMapping.HDFS["HDFS Path"] = [VR.required, VR.pathOfHDFS, VR.pathOfHDFSFileTest, VR.max255Len];
                            }
                        }
                    }
                }

                if ($scope.process.type == "com.huawei.datacraft.OBS" || $scope.process.type == "OBS") {
                    for (var i = 0; i < $scope.lines.length; i++) {
                        if ($scope.process.id == $scope.lines[i].destination.id) {
                            var pathType = OBSManager.getPathType();
                            if (pathType == "FILE") {
                                $scope.validationMapping.OBS["OBS Path"] = [VR.required, VR.pathOfOBS, VR.pathOfObsFile, VR.max255Len];
                                return;
                            } else {
                                $scope.validationMapping.OBS["OBS Path"] = [VR.required, VR.pathOfOBS, VR.max255Len];
                            }
                        }
                    }
                }
            }
        });
        /**
         * call to update property of selected processor
         * @returns {*}
         */
        function updatePropertyPromise() {
            var url = commonService.processGroupUrl + commonService.getGroupID() + "/processors/" + $scope.process.id;
            var version = commonService.getVersion();
            var clientID = commonService.getClientID();
            $scope.process.config.autoTerminatedRelationships = [];
            for (var i = 0; i < $scope.process.relationships.length; i++) {
                if ($scope.process.relationships[i].autoTerminate) {
                    $scope.process.config.autoTerminatedRelationships.push($scope.process.relationships[i].name);
                }
            }

            //处理sql语句
            var base64Properties = {};
            for (var item in $scope.process.config.properties) {
                if (item.toLowerCase() === "query" || item.toLowerCase() === "query statement") {
                    base64Properties[item] = $.base64.encode($scope.process.config.properties[item]);
                }
            }

            var params = {
                processor: {
                    id: $scope.process.id,
                    name: $scope.process.name,
                    config: angular.copy($scope.process.config)
                }, revision: {
                    clientId: clientID,
                    version: version,
                    processGroupId: commonService.getGroupID()
                }
            };

            // set base64 value to params
            for (var name in base64Properties) {
                if (base64Properties.hasOwnProperty(name)) {
                    params.processor.config.properties[name] = base64Properties[name];
                }
            }

            var promise = camel.put({
                url: url,
                params: params,
                beforeSend: function (request, setting) {
                },
                timeout: commonService.WAIT_TIME
            });
            return promise.then(function (response) {
                //加密后的重新赋值
                for (var item in $scope.process.config.properties) {
                    if (item.toLowerCase() === "query" || item.toLowerCase() === "query statement") {
                        $scope.process.config.properties[item] = $.base64.decode(response.processor.config.properties[item]);
                    }
                }
                commonService.setClientID(response.revision.clientId);
                commonService.setVersion(response.revision.version);
                return promise;
            }, function (response) {
                console.log("fail to add new processor node");
                return promise;
            })
        }

        /**
         * default config for HDFS window
         * @type {{title: string, height: string, width: string, content-type: string, content: string, resizable: boolean, maximizable: boolean, minimizable: boolean, beforeClose: Function, buttons: *[]}}
         */
        var options = {
            title: "HDFS",
            height: "500px",
            width: "350px",
            "content-type": 'url',
            content: "src/app/dataAccess/views/canvas/HDFSFileListToSelect.html",
            resizable: true,
            maximizable: false,
            minimizable: false,
            beforeClose: function () {
                console.log("close");
            }
        };

        var VR, validationRules;
        VR = validationRules = {
            required: {
                validFn: 'required'
            },
            nameString: {
                validFn: 'regularCheck',
                params: new RegExp('^[A-Za-z0-9_]+$'),
                errorDetail: i18n.dps_canvas_configuration_process_name_validate_special_char_warning
            },
            mustBePath: {
                validFn: 'regularCheck',
                params: new RegExp("^((?![.]).)*$"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorPathMustBeDirectory
            },
            SecretKeyLimit: {
                validFn: 'regularCheck',
                params: new RegExp('(^\\*{8}$)|(^[A-Za-z0-9/+=]{44}$)'),
                errorDetail: i18n.dps_canvas_configuration_rds_secret_key_validate_limit
            },
            maxHBASEColumns: {
                validFn: 'maxSize',
                params: 1024,
                errorDetail: i18n.dps_canvas_configuration_process_name_validate_Columns
            },
            fileFathByJar: {
                validFn: 'regularCheck',
                params: new RegExp("[^\\s]+\\.jar$", "i"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorFilePathByJar
            },
            maxNameLen: {
                validFn: 'maxSize',
                params: 64,
                errorDetail: i18n.dps_canvas_configuration_process_name_validate_num
            },
            maxJobNameLen: {
                validFn: 'maxSize',
                params: 64,
                errorDetail: i18n.dps_canvas_configuration_process_name_validate_num
            },
            maxRDSPasswordLen: {
                validFn: 'maxSize',
                params: 18,
                errorDetail: i18n.dps_canvas_configuration_rds_password_validate_maxnum
            },
            minRDSPasswordLen: {
                validFn: 'minSize',
                params: 8,
                errorDetail: i18n.dps_canvas_configuration_rds_password_validate_minnum
            },
            anyCharacter: {
                validFn: 'regularCheck',
                params: new RegExp('^[\u0000-\u00FF]+$'), // 只允许单字节字符
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorAnyCharacter
            },
            parametersContent: {
                validFn: 'regularCheck',
                params: new RegExp('^[A-Za-z0-9-\\s]+$'),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorParametersContent
            },
            pathOfHDFS: {
                validFn: 'regularCheck',
                params: new RegExp('^(\/)'),
                errorDetail: i18n.dps_canvas_configuration_process_hdfs_path_error_msg
            },
            pathOfHDFSBody: {
                validFn: 'regularCheck',
                params: new RegExp("^((?![\\\\|*:\?\"><]).)*$"),
                errorDetail: i18n.dps_canvas_configuration_process_hdfs_path_error_msg_body
            },
            pathOfHDFSFile: {
                validFn: 'regularCheck',
                params: new RegExp(' '),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorPathMustBeDirectory
            },
            pathOfHDFSFileTest: {
                validFn: 'regularCheck',
                params: new RegExp("^((?![\\\\|*:\?\"><]).)*$"),
                errorDetail: i18n.dps_process_hdfs_file_check
            },
            justForHdfsPath: {
                validFn: 'regularCheck',
                params: new RegExp(" "),
                errorDetail: i18n.dps_process_hdfs_file_check_just
            },
            scriptPath: {
                validFn: "regularCheck",
                params: new RegExp('^(\/)'),
                errorDetail: i18n.dps_canvas_configuration_requriedFilePath //"Script Path路径必须以/开头"
            },
            maxNameLen1024: {
                validFn: 'maxSize',
                params: 1023,
                errorDetail: i18n.dps_canvas_configuration_process_name_validate_Columns1023
            },
            maxNameLenforParameter: {
                validFn: 'maxSize',
                params: 1024,
                errorDetail: i18n.dps_canvas_configuration_process_name_validate_Columns1024
            },
            maxNameLen128: {
                validFn: 'maxSize',
                params: 128,
                errorDetail: i18n.dps_canvas_configuration_process_name_validate_Columns128
            },
            maxNameLen512: {
                validFn: 'maxSize',
                params: 512,
                errorDetail: i18n.dps_canvas_configuration_process_name_validate_Columns512
            },
            pathOfOBS: {
                validFn: 'regularCheck',
                params: new RegExp('^(s3a:\/\/|s3n:\/\/)'),
                errorDetail: i18n.dps_canvas_configuration_process_obs_path_error_msg
            },
            pathOnlyForOBS: {
                validFn: 'regularCheck',
                //"params": new RegExp("^((?![\\\\;|&*?\"><'$]).)*$"),
                "params": new RegExp("^((?![\\\"<>|\?\*]).)*$"),
                errorDetail: i18n.dpsValidationErrorPathOnlyForOBS
            },
            pathOfObsOrHdfs: {
                validFn: 'regularCheck',
                params: new RegExp('^(\/|s3a:\/\/|s3n:\/\/)'),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorPathOfObsOrHdfs
            },
            pathOfObsFile: {
                validFn: 'regularCheck',
                params: new RegExp(' '), /* params: new RegExp("^((?![.]).)*$"),*/
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorPathMustBeDirectory
            },
            max255Len: {
                validFn: 'maxSize',
                params: 255,
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorMax255Len
            },
            max2048Len: {
                validFn: 'maxSize',
                params: 2048,
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorMax2048Len
            },
            maxPathLen: {
                validFn: 'maxSize',
                params: 1023,
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorMaxPathLen
            },
            maxPathLenObs: {
                validFn: 'maxSize',
                params: 800,
                errorDetail: i18n.dps_validation_error_max_path_len_obs
            },
            maxQueryLen: {
                validFn: 'maxSize',
                params: 10000,
                errorDetail: i18n.dps_canvas_configuration_process_other_field_validate_must_less_than_10000_character
            },
            argumentsNotAllow: {
                validFn: 'regularCheck',
                params: new RegExp("^((?![<>\\;\\\'&$\\|$]).)*$"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorArgumentsNotAllow
            },
            hbaseTableName: {
                validFn: 'regularCheck',
                params: new RegExp('^[a-zA-Z_0-9-.]+$'),
                errorDetail: i18n.dps_canvas_configuration_process_name_validate_Hbase_Table_Name
            },
            pathNotAllow: {
                validFn: 'regularCheck',
                params: new RegExp("^((?![\"<>|\?\*\\\\]).)*$"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorPathNotAllow
            },
            pathNotAllowScriptPath: {
                validFn: 'regularCheck',
                params: new RegExp("^((?![\"<>|&;\?\*\\\\]).)*$"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorPathNotAllowScriptPath
            },
            filePathByJarOrSQL: {
                validFn: 'regularCheck',
                params: new RegExp("[^\\s]+\\.(jar|sql)$", "i"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorFilePathByJarOrSQL
            },
            filePathByPYOrSQL: {
                validFn: 'regularCheck',
                params: new RegExp("[^\\s]+\\.(py|sql)$", "i"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorFilePathByPyOrSQL
            },
            filePathByJar: {
                validFn: 'regularCheck',
                params: new RegExp("[^\\s]+\\.(jar)$", "i"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorFilePathByJar
            },
            filePathByJarOrSQLOrPy: {
                validFn: 'regularCheck',
                params: new RegExp("[^\\s]+\\.(jar|sql|py)$", "i"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorFilePathByJarOrSQLOrPy
            },
            filePathBySQL: {
                validFn: 'regularCheck',
                params: new RegExp("[^\\s]+\\.(sql)$", "i"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorFilePathBySQL
            },
            filePathBySh: {
                validFn: 'regularCheck',
                params: new RegExp("[^\\s]+\\.sh$"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorFilePathBySh
            },
            JDBC: {
                validFn: 'regularCheck',
                params: new RegExp("^jdbc:mysql:\/\/(((?:(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d))))|[A-Za-z0-9-_]+):[0-9]\\d{0,3}$|^jdbc:mysql:\/\/(((?:(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d))))|[A-Za-z0-9-_]+):[1-5]\\d{4}$|^jdbc:mysql:\/\/(((?:(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d))))|[A-Za-z0-9-_]+):6[0-4]\\d{3}$|^jdbc:mysql:\/\/(((?:(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d))))|[A-Za-z0-9-_]+):65[0-4]\\d{2}$|^jdbc:mysql:\/\/(((?:(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(?:25[0-5]|2[0-4]\\d|((1\\d{2})|[A-Za-z0-9-_]+)|([1-9]?\\d)))):655[0-2]\\d$|^jdbc:mysql:\/\/(((?:(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(?:25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d))))|[A-Za-z0-9-_]+):6553[0-5]$"),
                errorDetail: i18n.dps_canvas_configuration_dpsValidationErrorJDBC
            },
            checkCJP: {
                validFn: customValidation
            },
            driverName: {
                validFn: 'regularCheck',
                params: new RegExp("^([a-zA-Z_$][a-zA-Z\\d_$]*\\.)*[a-zA-Z\_\$][a-zA-Z\\d\_\$]*$"),
                errorDetail: i18n.dps_canvas_configuration_driverNameValidation
            },
            executionNameNotAllow: {
                validFn: 'regularCheck',
                params: new RegExp("^([a-zA-Z_][a-zA-Z\\d_]*\\.)*[a-zA-Z_][a-zA-Z\\d_]*$"),
                errorDetail: i18n.executionNameNotAllow
            }
        };

        //custom validation for the LHBase
        function customValidation() {
            var value = $("#myTxtId").widget().getValue();
            var scopeValue = $("#myTxtId1").widget().getValue();
            if (value == "") {
                return true;
            }
            else if (value != "" && scopeValue != "") {
                return true;
            }
            else {
                return false;
            }
        }


        $scope.validationMapping = {
            'name': [VR.required, VR.anyCharacter, VR.nameString, VR.maxNameLen],
            'comments': [VR.anyCharacter, VR.max255Len],

            'Hbase': {
                'HBASE Table Name': [VR.required, VR.anyCharacter, VR.maxNameLen, VR.argumentsNotAllow, VR.hbaseTableName],
                'HBASE Columns': [VR.anyCharacter, VR.maxHBASEColumns, VR.argumentsNotAllow]
            },

            'HDFS': {
                'MR ClusterName': [VR.required, VR.anyCharacter],
                'HDFS Path': [VR.required, VR.pathOfHDFS, VR.pathOfHDFSFileTest, VR.max255Len]
            },

            'OBS': {
                'OBS Path': [VR.required, VR.pathOfOBS, VR.max255Len, VR.pathOnlyForOBS]
            },

            'RDS': {
                'DB Driver Name': [VR.required],
                'DB Connection URL': [VR.required, VR.anyCharacter, VR.maxNameLen128, VR.JDBC, VR.pathNotAllow],
                'DB User Name': [VR.required, VR.anyCharacter, VR.maxNameLen, VR.nameString],
                'DB Password': [VR.required, VR.anyCharacter, VR.maxRDSPasswordLen, VR.minRDSPasswordLen],
                'DB Name': [VR.required, VR.anyCharacter, VR.maxNameLen, VR.nameString],
                'Secret Key': [VR.required, VR.SecretKeyLimit]
            },

            'Distcp': {
                'Job Name': [VR.required, VR.nameString, VR.maxNameLen]
            },

            'ExecuteHive': {
                'MR ClusterName': [VR.required],
                'Job Name': [VR.required, VR.nameString, VR.maxNameLen],
                'Arguments': [VR.anyCharacter, VR.maxNameLenforParameter, VR.argumentsNotAllow],
                'Hive Script Path': [VR.required, VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS, VR.filePathBySQL],
                'Input Data Path': [VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS],
                'Output Data Path': [VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS],
                'Log Path': [VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS]
            },

            'ExecuteMR': {
                'MR ClusterName': [VR.required],
                'Application Name': [VR.required, VR.anyCharacter, VR.nameString, VR.maxNameLen],
                'Job Name': [VR.required, VR.nameString, VR.maxNameLen],
                'Path of Jar File': [VR.required, VR.maxPathLen, VR.pathOfObsOrHdfs, VR.filePathByJar, VR.pathNotAllow],
                'Parameter to Jar': [VR.anyCharacter, VR.maxNameLenforParameter, VR.pathOnlyForOBS],
                'Input Data Path': [VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS],
                'Output Data Path': [VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS],
                'Log Path': [VR.required, VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS]
            },

            'ExecuteQuery': {
                'MR ClusterName': [VR.required],
                'Log Path': [VR.required, VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathNotAllow],
                'Query Statement': [VR.required, VR.anyCharacter, VR.maxQueryLen],
                'Jar Path': [VR.required, VR.maxPathLen, VR.pathOfObsOrHdfs, VR.pathOnlyForOBS, VR.fileFathByJar]
            },
            'ExecuteSpark': {
                'MR ClusterName': [VR.required],
                'Job Name': [VR.required, VR.nameString, VR.maxNameLen],
                'Path of Jar File': [VR.required, VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS, VR.filePathByJar],
                'Parameter to Jar': [VR.anyCharacter, VR.maxNameLenforParameter, VR.argumentsNotAllow],
                'Input Data Path': [VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS],
                'Output Data Path': [VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS],
                'Log Path': [VR.required, VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS]
            },
            'ExecuteSparkSQL': {
                'MR ClusterName': [VR.required],
                'Job Name': [VR.required, VR.nameString, VR.maxNameLen],
                'Query': [VR.required, VR.anyCharacter, VR.maxQueryLen]
            },
            'InvokeSqoop': {
                'MR ClusterName': [VR.required],
                'Job Name': [VR.required, VR.nameString, VR.maxNameLen],
                'Application Name': [VR.required, VR.anyCharacter, VR.maxNameLen, VR.nameString],
                'Parameters': [VR.required, VR.maxNameLen512, VR.parametersContent],
                'LOG path': [VR.required, VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathOnlyForOBS],
                'Table Name': [VR.required, VR.nameString, VR.maxNameLen],
                'Jar Path': [VR.required, VR.maxPathLen, VR.pathOnlyForOBS, VR.fileFathByJar]
            },
            'LoadHbase': {
                "id": "myTxtId",
                "exid": "myTxtId1",
                'MR ClusterName': [VR.required],
                'Load Type': [VR.required],
                'HFILE Path': [VR.required, VR.maxNameLen128, VR.pathOfHDFS, VR.pathNotAllow,VR.mustBePath],
                'CSV Archive Required': [VR.required],
                'CSV Archive Path': [VR.maxNameLen128, VR.pathOfHDFS, VR.pathNotAllow],
                'Custom Jar Path': [VR.maxNameLen128, VR.pathOfHDFS, VR.pathNotAllow, VR.fileFathByJar],
                'Execution Class Name': [VR.anyCharacter, VR.maxNameLen128, VR.checkCJP, VR.executionNameNotAllow],
                'Extended Arguments File Path': [VR.maxNameLen128, VR.pathOfHDFS, VR.pathNotAllow],
                'LOG path': [VR.required, VR.maxPathLen, VR.pathOfObsOrHdfs, VR.pathOnlyForOBS]
            },
            'PutRDS': {
                'MR ClusterName': [VR.required],
                'Log Path': [VR.required, VR.anyCharacter, VR.pathOfObsOrHdfs, VR.maxPathLen, VR.pathNotAllow],
                'Table Name': [VR.required, VR.anyCharacter, VR.maxNameLen]

            },
            'ExecuteScript': {
                'Script Path': [VR.required, VR.anyCharacter, VR.maxPathLen, VR.scriptPath, VR.pathNotAllowScriptPath, VR.filePathBySh],
                'Destination Log Path': [VR.pathOfOBS, VR.maxPathLen, VR.pathOnlyForOBS],
                'Log Backup': [VR.required],
                'computeResource': [VR.required]
            },
            'Link': {
                'Name': [VR.required, VR.anyCharacter, VR.nameString, VR.maxNameLen],
                'URL': [VR.anyCharacter, VR.pathOfHDFS, VR.maxPathLen, VR.pathNotAllow]
            }

        };

        $scope.testSpecialKeyCode = function (event) {
            var value = event.keyCode;
            if (value == 191) {
                $scope.validationMapping.HDFS["HDFS Path"] = [VR.required, VR.pathOfHDFS, VR.pathOfHDFSFileTest, VR.max255Len, VR.justForHdfsPath];
            } else {
                $scope.validationMapping.HDFS["HDFS Path"] = [VR.required, VR.pathOfHDFS, VR.pathOfHDFSFileTest, VR.max255Len];
            }
        };

        //校验标准
        $scope.checkValue = {
            "processNameCheck": [{ //校验规则1
                validFn: "maxSize",
                params: 64,
                errorDetail: i18n.dps_canvas_configuration_process_name_validate_num //"输入不能多于64字符"
            },
                {
                    validFn: "required",
                    errorDetail: i18n.dps_canvas_configuration_process_name_validate_required //"输入不能为空"
                },
                {
                    validFn: "regularCheck",
                    params: new RegExp("\\S+"),
                    errorDetail: i18n.dps_canvas_configuration_process_name_validate_no_space //"process名不能为空格"
                },
                {
                    validFn: "regularCheck",
                    params: new RegExp("^([A-Za-z0-9_\u2E80-\u9FFF]+|)?$"),
                    errorDetail: i18n.dps_canvas_configuration_process_name_validate_special_char_warning
                }],
            "processCommentCheck": [{ //校验规则1
                validFn: "maxSize",
                params: 2000,
                errorDetail: i18n.dps_canvas_configuration_process_comment_validate_num //"输入不能多于2000字符"
            }],
            "obsPathCheck": [{
                validFn: "maxSize",
                params: 255,
                errorDetail: i18n.dps_canvas_configuration_process_obs_path_error_must_less_than_255_character //"OBS路径长度不能多于255个字符"
            },
                {
                    validFn: "regularCheck",
                    params: new RegExp("^(s3a:\/\/|s3n:\/\/)"),
                    errorDetail: i18n.dps_canvas_configuration_process_obs_path_error_msg //"OBS路径必须以's3n://'开头"
                },
                {
                    validFn: "regularCheck",
                    params: new RegExp("^[^ ]+$"),
                    errorDetail: i18n.dps_canvas_configuration_process_obs_path_cant_contain_space //OBS路径不能包含空格
                }],
            "hdfsPathCheck": [{
                validFn: "maxSize",
                params: 255,
                errorDetail: i18n.dps_canvas_configuration_process_hdfs_path_error_must_less_than_255_character //"HDFS路径长度不能多于255个字符"
            },
                {
                    validFn: "regularCheck",
                    params: new RegExp("^(\/)"),
                    errorDetail: i18n.dps_canvas_configuration_process_hdfs_path_error_msg //"HDSF路径必须以/开头"
                },
                {
                    validFn: "regularCheck",
                    params: new RegExp("^[^ ]+$"),
                    errorDetail: i18n.dps_canvas_configuration_process_hdfs_path_cant_contain_space //HDFS路径不能包含空格
                }],
            "hdfsOrObsPathCheck": [{
                validFn: "maxSize",
                params: 255,
                errorDetail: i18n.dps_canvas_configuration_process_hdfs_or_obs_path_error_must_less_than_255_character //"HDFS路径长度不能多于255个字符"
            },
                {
                    validFn: "regularCheck",
                    params: new RegExp("^(\/|s3a:\/\/|s3n:\/\/)"),
                    errorDetail: i18n.dps_canvas_configuration_process_hdfs_or_obs_path_error_msg //"HDSF路径必须以/开头"
                },
                {
                    validFn: "regularCheck",
                    params: new RegExp("^[^ ]+$"),
                    errorDetail: i18n.dps_canvas_configuration_process_hdfs_or_obs_path_cant_contain_space //HDFS路径不能包含空格
                }],
            "parameterToJarCheck": [{
                validFn: "maxSize",
                params: 128,
                errorDetail: i18n.dps_canvas_configuration_process_parameter_to_jar_error_must_less_than_128_character  //"长度不能多于128个字符"
            }],
            "queryCheck": [{
                validFn: "maxSize",
                params: 10000,
                errorDetail: i18n.dps_canvas_configuration_process_query_error_must_less_than_10000_character //"长度不能多于10000个字符"
            }],
            "scriptPathCheck": [{
                validFn: "regularCheck",
                params: new RegExp("\/"),
                errorDetail: i18n.dps_canvas_configuration_requriedFilePath //"Script Path路径必须以/开头"
            }],
            "otherFieldCheck": [{
                //校验规则1
                validFn: "maxSize",
                params: 10000,
                errorDetail: i18n.dps_canvas_configuration_process_other_field_validate_must_less_than_10000_character //"输入不能多于10000字符"
            },
                {
                    validFn: "regularCheck",
                    params: new RegExp("\\S+"),
                    errorDetail: i18n.dps_canvas_configuration_process_other_field_validate_no_space //"不能为空格"
                }]
        };

        $scope.valueDeCode = function (propertyName) {
            $scope.process.config.properties["Query"] = $.base64.decode(propertyName);
        };
        function getBt(str) {
            var char = str.match(/[^\x00-\xff]/ig);
            return str.length + (char == null ? 0 : char.length);
        }

        $scope.showBigQueryInputDialog = function (process, propertyName) {
            if (process && propertyName) {
                $scope.currentEditingPropertyName = propertyName;

                var content = process.config.properties[propertyName];
                var options = {
                    title: process.name + " property Edit",
                    height: "400px",
                    width: "640px",
                    'content-type': 'url',
                    content: 'src/app/dataAccess/views/canvas/bigQueryInputDialog.html',
                    resizable: true,
                    beforeClose: function () {
                        /*var bigQueryPanelscope = angular.element(".bigQueryPanel").scope();
                        if ($scope.process.type == 'ExecuteSparkSQL' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteSparkSQL') {
                            $scope.process.config.properties.Query = bigQueryPanelscope.editor.getValue();
                            $scope.validationMapping.ExecuteSparkSQL["Query"] = [VR.required, VR.anyCharacter, VR.maxQueryLen];
                        }
                        else if ($scope.process.type == 'ExecuteHive' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteHive') {
                            $scope.process.config.properties.Query = bigQueryPanelscope.editor.getValue();
                        }
                        else if ($scope.process.type == 'ExecuteQuery' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteQuery') {
                            $scope.process.config.properties["Query Statement"] = bigQueryPanelscope.editor.getValue();
                            $scope.validationMapping.ExecuteQuery["Query Statement"] = [VR.required, VR.anyCharacter, VR.maxQueryLen];
                        }*/

                    },
                    buttons: [{
                        key: "btnOK",
                        label: 'OK',
                        focused: false,
                        handler: function (event) {
                            /*win.destroy();*/
                        }
                    }, {
                        key: "btnCancel",
                        label: 'Cancel',
                        focused: false,
                        handler: function (event) {
                            /*process.config.properties[propertyName] = content;*/
                            win.destroy();
                        }
                    }]
                };

                var win = new tinyWidget.Window(options);
                win.setButton("btnOK", function () {
                    var bigQueryPanelscope = angular.element(".bigQueryPanel").scope();
                    var fileValue = bigQueryPanelscope.editor.getValue();
                    if (getBt(fileValue) > 10 * 1024) {
                        commonService.failTip(i18n.dps_canvas_configuration_filesizes)
                        return ;
                    }
                    if ($scope.process.type == 'ExecuteSparkSQL' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteSparkSQL') {
                        $scope.process.config.properties.Query = bigQueryPanelscope.editor.getValue();
                        $scope.validationMapping.ExecuteSparkSQL["Query"] = [VR.required, VR.anyCharacter, VR.maxQueryLen];
                    }
                    else if ($scope.process.type == 'ExecuteHive' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteHive') {
                        $scope.process.config.properties.Query = bigQueryPanelscope.editor.getValue();
                    }
                    else if ($scope.process.type == 'ExecuteQuery' || $scope.process.type == 'com.huawei.datacraft.activity.ExecuteQuery') {
                        $scope.process.config.properties["Query Statement"] = bigQueryPanelscope.editor.getValue();
                        $scope.validationMapping.ExecuteQuery["Query Statement"] = [VR.required, VR.anyCharacter, VR.maxQueryLen];
                    }
                     win.destroy();
            },"OK");
            win.show();

            $scope.$evalAsync();
        }
    };

    $scope.getProcessTypeShortName = function (type) {
     if(type){
     return String(type).replace(/.*\.([^\.]+)/, '$1');
     }
     };
    $scope.ellipsisByLength = commonService.ellipsisByLength;
};
var dataCraftModule = angular.module('dataAccess.config');
dataCraftModule.tinyController('configurationPanel.ctrl', configurationPanelCtrl);
return dataCraftModule;
})
;
