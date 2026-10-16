
define(['language/dataAccess'], function (i18n) {
    "use strict";
    var canvasCtrl = function ($rootScope, $scope, $compile, camel, storage, mask, commonService, canvasService, processManager, parserManager, activityManager, connectionConfig, editorLayout, processStatus, $interval, pipelineEditorService, processTypeManager, $window, timeService) {
        $scope.errorDescriptionShow = false;
        $scope.processArray = [];
        $scope.lines = [];
        var computeResourceArrayPromise = [];
        $scope.lineCreator = processManager.getLineCreator();
        $scope.compsLayout = editorLayout.getCompsPanelLayout();
        $scope.configureLayout = editorLayout.getConfigurationPanelLayout();
        var canShowConfig = false; //Indicates whether configureTable can be use
        var holdTargetProcess = false;
        var connectionWindow;
        var setIPHostWindow;

        // zoom-drag
        var canvas, canvasContainer;
        var scaleFactor = 1;
        var scaleInterval = 0.25;
        var minScaleFactor = 0.4;
        var maxScaleFactor = 1.5;
        var openConfigurationPanelNeedScrollCanvas = false;
        var CANVAS_WIDHT = 8000;
        var CANVAS_HEIGHT = 8000;
        var CONFIGURATION_WIDTH = 540;

        //[BEGIN ADD  FOR 获取computeResource列表， 2016-12-20]
        canvasService.getComputeResoucesPromise().then(function (response) {
            computeResourceArrayPromise = response.resouces;
        }, function (data) {
            if (data.status == 200) {
                computeResourceArrayPromise = data.resouces;
            } else {
                $rootScope.$broadcast('getComputeFromRemote', data);
            }
        });

        /**
         * restrict canvas's boundary
         */
        function restrictCanvasBoundary() {
            canvasContainer.scrollLeft = Math.min(scaleFactor * CANVAS_WIDHT - canvasContainer.offsetWidth, canvasContainer.scrollLeft);
            canvasContainer.scrollTop = Math.min(scaleFactor * CANVAS_HEIGHT - canvasContainer.offsetHeight, canvasContainer.scrollTop);
        }

        function doZoom(tempSF) {
            if (tempSF < minScaleFactor || tempSF > maxScaleFactor) {
                //TODO @jonge, how to inform users?
                return;
            }
            scaleFactor = tempSF;
            canvas.style.transform = "scale(" + scaleFactor + ")";
            processManager.setScaleFactor(scaleFactor);
            restrictCanvasBoundary();
        }

        $scope.zoomIn = function () {
            doZoom(scaleFactor + scaleInterval);
        };

        $scope.zoomOut = function () {
            doZoom(scaleFactor - scaleInterval);
        };

        $scope.noZoom = function () {
            scaleFactor = 1;
            doZoom(scaleFactor);
        };
        var dragOffset = {};
        var isMouseDown = false;
        var isProcesssMouseDown = false;
        var processDragPre = {};
        var currentEvent;
        var isJustNowDragged = false;

        $scope.canvasInit = function () {
            canvas = document.querySelector(".canvas");
            canvasContainer = document.querySelector(".canvas-container");
            //            canvas.style.transformOrigin = canvasContainer.offsetWidth/2 +"px " + canvasContainer.offsetHeight/2 +"px";

            // forbidden scroll on canvas
            canvasContainer.onmousewheel = function (event) {
                event.preventDefault();
                return false;
            };
            // for FF browser
            canvasContainer.addEventListener("DOMMouseScroll", canvasContainer.onmousewheel, false);

            canvasContainer.onmousemove = function (e) {
                if ((e.target.parentNode.id === "canvas" || e.target.id === "canvas") && isMouseDown) {
                    var oX = e.offsetX - dragOffset.start.x;
                    var oY = e.offsetY - dragOffset.start.y;
                    dragOffset.stop = {};
                    dragOffset.stop.x = e.offsetX;
                    dragOffset.stop.y = e.offsetY;
                    canvasContainer.scrollLeft -= oX;
                    canvasContainer.scrollTop -= oY;
                    restrictCanvasBoundary();
                    processManager.setCanvasScrollOffset({ left: canvasContainer.scrollLeft, top: canvasContainer.scrollTop });
                } else if (isProcesssMouseDown && currentEvent === "processDrag") {
                    // click can also active mousemove event
                    if (Math.abs(e.screenX - processDragPre.left) > 1 || Math.abs(e.screenY - processDragPre.top) > 1) {
                        isJustNowDragged = true;
                    }
                    var currentPos = $.extend({}, processManager.getSelectedProcess().position);
                    var position = {
                        x: currentPos.x + (e.screenX - processDragPre.left) / scaleFactor,
                        y: currentPos.y + (e.screenY - processDragPre.top) / scaleFactor
                    };
                    processDragPre.left = e.screenX;
                    processDragPre.top = e.screenY;
                    processManager.refreshProcessPosition(processManager.getSelectedProcess(), position);
                    $scope.$evalAsync();
                }
            };
        };

        $scope.mouseDown = function (e) {
            if (e.target.parentNode.id === "canvas" || e.target.id === "canvas") {
                isMouseDown = true;
                currentEvent = "canvasDrag";
                dragOffset.start = {};
                dragOffset.start.x = e.offsetX;
                dragOffset.start.y = e.offsetY;
            }
        };

        document.onmouseup = function (e) {
            isMouseDown = false;
            isProcesssMouseDown = false;
        };

        $(".right-container").append(commonService.bigLoading);
        //get process and lines info from server side
        processTypeManager.getProcessTypePromise().then(function (response) {
            $scope.processTypes = response;
            canvasService.getProcessGroupPromise(commonService.getGroupID()).then(
                function (response) {
                    commonService.bigLoading.remove();
                    parserManager.setParser(response);
                    var response = parserManager.getParser();
                    processManager.setProcessArray(activityManager.createProcessArray(response.activities));
                    processManager.setConnections(activityManager.createConnection(response.activities));
                    processManager.setProcessTypeArray(storage.get("processType"));

                    $scope.processArray = processManager.getProcessArray();
                    if ($scope.processArray && $scope.processArray.length > 0) {
                        $scope.processArray.forEach(function (process) {
                            processManager.backupValidationErrors(process);
                        });
                    }
                    processManager.refreshProcessListValidationErrors($scope.processArray);
                    $scope.lines = processManager.getConnections();
                    $rootScope.$broadcast('processArray', $scope.processArray);
                },
                function (data) {
                    commonService.bigLoading.remove();
                    if (data.status == 200) {
                        parserManager.setParser(response);
                        var response = parserManager.getParser();
                        processManager.setProcessArray(activityManager.createProcessArray(response.activities));
                        processManager.setConnections(activityManager.createConnection(response.activities));
                        processManager.setProcessTypeArray(storage.get("processType"));

                        $scope.processArray = processManager.getProcessArray();
                        $scope.lines = processManager.getConnections();
                    }
                    else {
                        $rootScope.$broadcast('getPipelineExecption', data);//获取pipeline接口异常提示
                    }
                }
            );
        }, function (response) {
            commonService.bigLoading.remove();
        }
        );

        //get the template data from compsPanelController
        $rootScope.$on('templateConfig', function (event, data) {
            $scope.saveTemplate = false;
            var groupId = commonService.getGroupID();
            $rootScope.$broadcast('templateDragDrop', $scope.saveTemplate);
            var uniqueIDgeneration = data.activities;
            for (var i = 0; i < uniqueIDgeneration.length; i++) {
                uniqueIDgeneration[i].id = "";
                var UprocessorID = commonService.getUUID();
                uniqueIDgeneration[i].id = UprocessorID;
                uniqueIDgeneration[i].uri = "/nifi-api/controller/process-groups/" + groupId + "/processors/" + uniqueIDgeneration[i].id
                //uniquename generation
                var timestamp = new Date().getTime();
                var mainNodeType = uniqueIDgeneration[i].type;
                var mainNodeName = mainNodeType.substr(mainNodeType.lastIndexOf('.') + 1);
                uniqueIDgeneration[i].name = mainNodeName + '_' + String(timestamp).slice(9);


                if (uniqueIDgeneration[i].hasOwnProperty('inputDataNode')) {
                    for (var j = 0; j < uniqueIDgeneration[i].inputDataNode.length; j++) {
                        uniqueIDgeneration[i].inputDataNode[j].id = "";
                        var IUprocessorID = commonService.getUUID();
                        uniqueIDgeneration[i].inputDataNode[j].id = IUprocessorID;
                        uniqueIDgeneration[i].inputDataNode[j].uri = "/nifi-api/controller/process-groups/" + groupId + "/processors/" + uniqueIDgeneration[i].inputDataNode[j].id;
                        var inputNodeType = uniqueIDgeneration[i].inputDataNode[j].type;
                        var inputNodeName = inputNodeType.substr(inputNodeType.lastIndexOf('.') + 1);
                        //uniquename generation
                        var timestamp = new Date().getTime();
                        uniqueIDgeneration[i].inputDataNode[j].name = inputNodeName + '_' + String(timestamp).slice(9);
                    }
                }

                if (uniqueIDgeneration[i].hasOwnProperty('outputDataNode')) {
                    for (var k = 0; k < uniqueIDgeneration[i].outputDataNode.length; k++) {
                        uniqueIDgeneration[i].outputDataNode[k].id = "";
                        var oUprocessorID = commonService.getUUID();
                        uniqueIDgeneration[i].outputDataNode[k].id = oUprocessorID;
                        uniqueIDgeneration[i].outputDataNode[k].uri = "/nifi-api/controller/process-groups/" + groupId + "/processors/" + uniqueIDgeneration[i].outputDataNode[k].id;
                        var outputNodeType = uniqueIDgeneration[i].outputDataNode[k].type;
                        var outputNodeName = outputNodeType.substr(outputNodeType.lastIndexOf('.') + 1);
                        //uniquename generation
                        var timestamp = new Date().getTime();
                        uniqueIDgeneration[i].outputDataNode[k].name = outputNodeName + '_' + String(timestamp).slice(9);
                    }
                }
            }
            processManager.setProcessArrayT(activityManager.createProcessArray(uniqueIDgeneration));
            processManager.setConnectionsT(activityManager.createConnection(uniqueIDgeneration));
            processManager.setProcessTypeArray(storage.get("processType"));
            $scope.processArray = processManager.getProcessArray();
            $scope.lines = processManager.getConnections();
        });

        //submit成功之后初始化页面
        $rootScope.$on('activitiesChanged', function (event, data) {
            var Promise = data.Promise;
            var pipelineName = data.pipelineName;
            Promise.then(function (response) {
                /* parserManager.setParser(response);
                 var response = parserManager.getParser();
                 processManager.setProcessArray(activityManager.createProcessArray(response.activities));
                 processManager.setConnections(activityManager.createConnection(response.activities));
                 $scope.processArray = processManager.getProcessArray();
                 $scope.lines = processManager.getConnections();
                 angular.forEach($scope.lines,function(val,index){
                     if(val == undefined ){
                         $scope.lines.splice(index,1)
                         val = null;
                     }
                 })
                 editorLayout.getConfigurationPanelLayout().ifShow = false;
                 configurationPanelNotCoverProcess();
                 activityManager.setLegalFlags({});*/
                $rootScope.$broadcast('submitSucessed', pipelineName);//提交成功，错误提示
            }, function (data) {
                if (data.status == 200) {
                    /*var Promise = data.Promise;
                    processManager.setProcessArray(activityManager.createProcessArray(response.activities));
                    processManager.setConnections(activityManager.createConnection(response.activities));
                    $scope.processArray = processManager.getProcessArray();
                    $scope.lines = processManager.getConnections();
                    angular.forEach($scope.lines,function(val,index){
                        if(val == undefined ){
                            val = null;
                        }
                    })
                    editorLayout.getConfigurationPanelLayout().ifShow = false;
                    configurationPanelNotCoverProcess();
                    activityManager.setLegalFlags({});*/
                    $rootScope.$broadcast('submitSucessed', pipelineName);//提交成功，错误提示
                } else {
                    var datas = {};
                    datas.data = data;
                    datas.pipelineName = pipelineName;
                    $rootScope.$broadcast('submitFailed', datas);//提交失败，错误提示
                    var processorArray = processManager.getProcessArray();
                    var jsonData = JSON.parse(data.responseText);
                    if (jsonData.errored) {
                        activityManager.emptyCanvasMsgs();

                        _.forEach(jsonData.errorList, function (element) {
                            var processor = { id: element.id };
                            for (var i = 0; i < processorArray.length; i++) {
                                if (element.id === processorArray[i].id) {
                                    processor.name = processorArray[i].name;
                                    activityManager.pushCanvasMsg({
                                        level: "ERROR",
                                        time: timeService.fn.milliseconds2LocalTime(+new Date),
                                        processors: [processor],
                                        text: element.error.error_msg
                                    });
                                    break;
                                }
                            }
                        });

                    }

                }
            });
        });

        $scope.checkData = processManager;

        $scope.$watch('checkData.getSaveFlag()', function (newVal) {
            $scope.Data = newVal;
            if ($scope.Data) {
                window.addEventListener("beforeunload", function (e) {
                    if ($scope.Data) {
                        (e || window.event).returnValue = i18n.dps_closeWindow_message;
                        return i18n.dps_closeWindow_message;
                    }
                });
            }
        });

        $scope.deleteProcess = function (process) {

            if (process) {
                processManager.deleteProcess(process);
                var legalFlags = activityManager.getLegalFlags();
                for (var key in legalFlags) {
                    if (key == process.id) {
                        delete legalFlags[key];
                        break;
                    }
                }
            }

            if ($scope.getSelectedProcess != undefined && $scope.getSelectedProcess.dependencies != undefined) {
                for (var i = 0; i < $scope.getSelectedProcess.dependencies.length; i++) {
                    if ($scope.getSelectedProcess.dependencies[i] === process.id) {
                        delete $scope.getSelectedProcess.dependencies[i];
                        /*processManager.getTargetProcess().dependencies=' ';*/
                        //console.log(processManager.getTargetProcess())
                    }
                }

            }
        };

        $scope.deleteConnection = function (connection) {
            var sourceId = connection.source.id;
            if ($scope.idAndType != undefined) {
                for (var i = 0; i < $scope.idAndType.length; i++) {
                    if ($scope.idAndType[i].sourceDependenciesId == sourceId) {
                        var sourceType = $scope.idAndType[i].sourceDependenciesType;
                    }
                }
            }

            if ($scope.getSelectedProcess != undefined && $scope.getSelectedProcess.dependencies != undefined) {
                for (var i = 0; i < $scope.getSelectedProcess.dependencies.length; i++) {
                    if ($scope.getSelectedProcess.dependencies[i] === sourceId) {
                        delete $scope.getSelectedProcess.dependencies[i];
                    }
                }

            }
            if ($scope.getSelectedProcess != undefined && $scope.getSelectedProcess.dependencies != undefined) {
                for (var i = 0; i < $scope.getSelectedProcess.dependenciesActivityType.length; i++) {
                    if ($scope.getSelectedProcess.dependenciesActivityType[i] === sourceType) {
                        $scope.getSelectedProcess.dependenciesActivityType.splice(i, 1);
                    }
                }
            }
            processManager.deleteConnection(connection);

        };

        $scope.abs = function (a) {
            return Math.abs(a)
        };
        $scope.sqrt = function (a) {
            return Math.sqrt(a);
        };
        $scope.pow = function (a, b) {
            return Math.pow(a, b);
        };

        $scope.lineCreatorDragStart = function (event, ui) {
            $scope.lineCreator.ifShow = true;
            $scope.$evalAsync();
        };
        $scope.lineCreatorOnDrag = function (event, ui) {
            if (ui) {
                canShowConfig = false;//if mouse up after drag,do not show configureTab
                var position = {
                    x: processManager.getSelectedProcess().position.x + ui.position.left / scaleFactor - $scope.lineCreator.width * scaleFactor / 2,
                    y: processManager.getSelectedProcess().position.y + ui.position.top / scaleFactor - $scope.lineCreator.height * scaleFactor / 2
                };
                processManager.refreshLineCreatorPosition(position);
                $scope.$evalAsync();
            }
        };
        $scope.lineCreatorDragStop = function (event, ui) {
            $scope.lineCreator.ifShow = false;
            if (processManager.getSelectedProcess() && processManager.getTargetProcess()) {
                //限定不能互相连线
                for (var i = 0; i < $scope.lines.length; i++) {
                    if ($scope.lines[i].destination != undefined) {
                        if (processManager.getSelectedProcess().id === $scope.lines[i].destination.id && processManager.getTargetProcess().id === $scope.lines[i].source.id) {
                            var info = i18n.dps_canvas_hint_warningConnect_eachOther;
                            $rootScope.$broadcast('warningConnectEachOher', info);
                            return;
                        }
                    }
                }

                //只能连接一次
                for (var i = 0; i < $scope.lines.length; i++) {
                    if (processManager.getSelectedProcess().id === $scope.lines[i].source.id && processManager.getTargetProcess().id === $scope.lines[i].destination.id) {
                        return;
                    }
                }

                //hdfs不能同时有输入输出
                if ((processManager.getSelectedProcess().type === "com.huawei.datacraft.HDFS" || processManager.getSelectedProcess().type === "HDFS") && (processManager.getTargetProcess().type === "com.huawei.datacraft.activity.InvokeSqoop" || processManager.getTargetProcess().type === "InvokeSqoop")) {
                    for (var i = 0; i < $scope.lines.length; i++) {
                        if ($scope.lines[i].destination != undefined && $scope.lines[i].source != undefined) {
                            if (processManager.getSelectedProcess().id === $scope.lines[i].destination.id) {
                                commonService.failTip(i18n.dps_canvas_hint_warningConnect_bothHDFS);
                                return;
                            }
                        }
                    }
                }

                if (processManager.getTargetProcess().type === "com.huawei.datacraft.activity.InvokeSqoop" || processManager.getTargetProcess().type === "InvokeSqoop") {
                    for (var i = 0; i < $scope.lines.length; i++) {
                        if ($scope.lines[i].source.id === processManager.getTargetProcess().id && processManager.getTargetProcess().processorType != 'DATANODE' && processManager.getSelectedProcess().processorType == 'DATANODE') {
                            //输入数据源只能是RDS（输出不是OBS或HDFS）
                            if ((processManager.getProcessByID($scope.lines[i].destination.id).type === "com.huawei.datacraft.OBS" || processManager.getProcessByID($scope.lines[i].destination.id).type === "OBS"
                                || processManager.getProcessByID($scope.lines[i].destination.id).type === "com.huawei.datacraft.HDFS" || processManager.getProcessByID($scope.lines[i].destination.id).type === "HDFS")
                                && (processManager.getSelectedProcess().type != "com.huawei.datacraft.RDS" && processManager.getSelectedProcess().type != "RDS")) {
                                var info = i18n.dps_canvas_hint_warningConnect_inputRequiredRDS;
                                $rootScope.$broadcast('warningConnectInputRequiredRDS', info);
                                return;
                            }
                            //输出是RDS则输入必须是OBS或者 HDFS
                            if ((processManager.getSelectedProcess().type != "com.huawei.datacraft.OBS" && processManager.getSelectedProcess().type != "OBS"
                                && processManager.getSelectedProcess().type != "com.huawei.datacraft.HDFS" && processManager.getSelectedProcess().type != "HDFS")
                                && (processManager.getProcessByID($scope.lines[i].destination.id).type == "com.huawei.datacraft.RDS" || processManager.getProcessByID($scope.lines[i].destination.id).type == "RDS") && processManager.getSelectedProcess().processorType == 'DATANODE') {
                                var info = i18n.warningConnect_inputRequiredHDFS;
                                $rootScope.$broadcast('warningConnectInputRequiredOBSorHDFS', info);
                                return;
                            }
                        }
                    }
                }

                if (processManager.getSelectedProcess().type === "com.huawei.datacraft.activity.InvokeSqoop" || processManager.getSelectedProcess().type === "InvokeSqoop") {
                    for (var i = 0; i < $scope.lines.length; i++) {
                        if ($scope.lines[i].destination.id === processManager.getSelectedProcess().id && processManager.getTargetProcess().processorType == 'DATANODE') {
                            if ((processManager.getProcessByID($scope.lines[i].source.id).type === "com.huawei.datacraft.OBS" || processManager.getProcessByID($scope.lines[i].source.id).type === "OBS"
                                || processManager.getProcessByID($scope.lines[i].source.id).type === "com.huawei.datacraft.HDFS" || processManager.getProcessByID($scope.lines[i].source.id).type === "HDFS")
                                && (processManager.getTargetProcess().type != "com.huawei.datacraft.RDS" && processManager.getTargetProcess().type != "RDS")) {
                                var info = i18n.dps_canvas_hint_warningConnect_outputRequiredRDS;
                                $rootScope.$broadcast('warningConnectOutputRequiredRDS', info);
                                return;
                            }

                            if ((processManager.getTargetProcess().type != "com.huawei.datacraft.OBS" && processManager.getTargetProcess().type != "OBS"
                                && processManager.getTargetProcess().type != "com.huawei.datacraft.HDFS" && processManager.getTargetProcess().type != "HDFS")
                                && (processManager.getProcessByID($scope.lines[i].source.id).type == "com.huawei.datacraft.RDS" || processManager.getProcessByID($scope.lines[i].source.id).type == "RDS")) {
                                var info = i18n.dps_canvas_hint_warningConnect_outputRequiredOBSorHDFS;
                                $rootScope.$broadcast('warningConnectOutputRequiredOBSorHDFS', info);
                                return;
                            }

                        }
                    }
                }


                if (processManager.getTargetProcess().type === "com.huawei.datacraft.activity.Distcp" || processManager.getTargetProcess().type === "Distcp") {
                    for (var i = 0; i < $scope.lines.length; i++) {
                        //算子是Distcp的話，输入输出只能是OBS或HDFS
                        if ($scope.lines[i].source.id === processManager.getTargetProcess().id && processManager.getTargetProcess().processorType != 'DATANODE' && processManager.getSelectedProcess().processorType == 'DATANODE') {
                            if ((processManager.getProcessByID($scope.lines[i].destination.id).type === "com.huawei.datacraft.OBS" || processManager.getProcessByID($scope.lines[i].destination.id).type === "OBS")
                                && (processManager.getSelectedProcess().type != "com.huawei.datacraft.HDFS" && processManager.getSelectedProcess().type != "HDFS")) {
                                var info = i18n.warningConnect_inputRequiredHDFS;
                                $rootScope.$broadcast('warningConnectInputRequiredHDFSS', info);
                                return;
                            }

                            if ((processManager.getSelectedProcess().type != "com.huawei.datacraft.OBS" && processManager.getSelectedProcess().type != "OBS")
                                && (processManager.getProcessByID($scope.lines[i].destination.id).type == "com.huawei.datacraft.HDFS" || processManager.getProcessByID($scope.lines[i].destination.id).type == "HDFS")) {
                                var info = i18n.warningConnect_inputRequiredOBS;
                                $rootScope.$broadcast('warningConnectInputRequiredOBSss', info);
                                return;
                            }
                        }
                    }
                }

                if (processManager.getSelectedProcess().type === "com.huawei.datacraft.activity.Distcp" || processManager.getSelectedProcess().type === "Distcp") {
                    for (var i = 0; i < $scope.lines.length; i++) {
                        if ($scope.lines[i].destination.id === processManager.getSelectedProcess().id && processManager.getTargetProcess().processorType == 'DATANODE') {
                            //算子是Distcp的話，输入输出只能是OBS或HDFS
                            if ((processManager.getProcessByID($scope.lines[i].source.id).type === "com.huawei.datacraft.OBS" || processManager.getProcessByID($scope.lines[i].source.id).type === "OBS")
                                && (processManager.getTargetProcess().type != "com.huawei.datacraft.HDFS" && processManager.getTargetProcess().type != "HDFS")) {
                                var info = i18n.warningConnect_outputRequiredHDFS;
                                $rootScope.$broadcast('warningConnectOutputRequiredHDFSss', info);
                                return;
                            }

                            if ((processManager.getTargetProcess().type != "com.huawei.datacraft.OBS" && processManager.getTargetProcess().type != "OBS")
                                && (processManager.getProcessByID($scope.lines[i].source.id).type == "com.huawei.datacraft.HDFS" || processManager.getProcessByID($scope.lines[i].source.id).type == "HDFS")) {
                                var info = i18n.warningConnect_outputRequiredOBS;
                                $rootScope.$broadcast('warningConnectOutputRequiredOBSss', info);
                                return;
                            }

                        }
                    }
                    var processTmp = processManager.getTargetProcess();
                    if (processTmp.type === "com.huawei.datacraft.OBS" || processTmp.type === "OBS") {
                        var obsPath = processTmp.config.properties['OBS Path'];
                        if (obsPath && obsPath.indexOf(".") > -1) {
                            commonService.failTip("OBS" + i18n.dps_canvas_configuration_dpsValidationErrorPathMustBeDirectory)
                            return;
                        }
                    }
                    if (processTmp.type === "com.huawei.datacraft.HDFS" || processTmp.type === "HDFS") {
                        var hdfsPath = processTmp.config.properties['HDFS Path'];
                        if (hdfsPath && hdfsPath.indexOf(".") > -1) {
                            commonService.failTip("HDFS" + i18n.dps_canvas_configuration_dpsValidationErrorPathMustBeDirectory)
                            return;
                        }
                    }
                }

                if ((processManager.getSelectedProcess().processorType == 'DATANODE' && processManager.getTargetProcess().processorType == 'DATANODE')) {
                    var info = i18n.dps_canvas_hint_warningConnect_DataSourceToDataSource;
                    $rootScope.$broadcast('warningConnectDataSourceToDataSource', info);
                    return;
                } else if (processManager.getSelectedProcess().processorType != 'DATANODE' && processManager.getTargetProcess().processorType == 'DATANODE') {
                    if (processManager.getSelectedProcess().outputRequirement == "OUTPUT_FORBIDDEN") {
                        var info = i18n.dps_canvas_hint_warningConnectOutForbidden;
                        $rootScope.$broadcast('warningConnectOutForbidden', info);
                        return;
                    }

                    if (!isAllowConnection((processManager.getSelectedProcess().outPutType), (processManager.getTargetProcess().type))) {//第三点
                        var info = i18n.dps_canvas_hint_warningConnectDataSource;
                        $rootScope.$broadcast('warningConnectDataSourceToDataSource', info);
                        return;
                    }
                    //判断该activity是不是已经被连接
                    if (isExistInConnections("source", processManager.getSelectedProcess().id)) {
                        var info = i18n.dps_canvas_hint_warningConnectOnly;
                        $rootScope.$broadcast('warningConnectOnly', info);
                        return;
                    }
                } else if (processManager.getSelectedProcess().processorType == 'DATANODE' && processManager.getTargetProcess().processorType != 'DATANODE') {
                    if (processManager.getTargetProcess().inputRequirement == "INPUT_FORBIDDEN") {
                        var info = i18n.dps_canvas_hint_warningConnectInForbidden;
                        $rootScope.$broadcast('warningConnectInForbidden', info);
                        return;
                    }

                    if (!isAllowConnection((processManager.getTargetProcess().inPutType), (processManager.getSelectedProcess().type))) {
                        var info = i18n.dps_canvas_hint_warningConnectDataSource;
                        $rootScope.$broadcast('warningConnectConnectDataSource', info);
                        return;
                    }

                    //判断该activity是不是已经被连接
                    if (isExistInConnections("destination", processManager.getTargetProcess().id)) {
                        var info = i18n.dps_canvas_hint_warningConnectOnly;
                        $rootScope.$broadcast('warningConnectConnectOnlysss', info);
                        return;
                    }
                }
            }


            $scope.lineCreator.line = { start: { side: 'top', x: 0, y: 0 }, end: { side: 'top', x: 0, y: 0 } };
            if (processManager.getTargetProcess()) {
                holdTargetProcess = true;
                processManager.createNewConnection(processManager.getSelectedProcess(), processManager.getTargetProcess(), connectionConfig.getFormDataStr(), connectionConfig.getFormData());
                processManager.clearTargetProcess();
                holdTargetProcess = false;
            }
            $scope.$evalAsync();
        };

        function checkRepeat(current, unCheckedArray) {
            var repeatedArray = [];
            _.forEach(unCheckedArray, function (value) {
                if (current.id !== value.id && current.toCheck === value.toCheck) {
                    repeatedArray.push({ id: value.id, name: value.name });
                }
            });
            return repeatedArray;
        }

        function isRepeat(arr) {
            var hash = {};
            for (var i in arr) {
                if (hash[arr[i]])
                    return true;//true is repeat
                hash[arr[i]] = true;
            }
            return false;
        }

        $scope.processMousedown = function (process, $event) {
            /*var configurationPanelScope = $("#processConfigurationForm").scope();*/
            $scope.process = processManager.getSelectedProcess();
            if ($scope.process.config) {
                processManager.setSaveFlag(true);
                var processor = processManager.getProcessArray();

                // refresh validators
                processManager.refreshProcessListValidationErrorsFromCurrent(processor, $scope.process);
                // activityManager.emptyCanvasMsgs(); // 切换算子用起来不趁手，先关闭
                //added  fo check the dupicate in the processorname
                var jobNameArr = [], processNameArr = [];
                if (processor.length > 1) {
                    for (var i = 0; i < processor.length; i++) {
                        if (processor[i].name != undefined && processor[i].name != null) {
                            processNameArr.push({ name: processor[i].name, id: processor[i].id, toCheck: processor[i].name });
                        }
                        if (processor[i].config.properties['Job Name'] != undefined && processor[i].config.properties['Job Name'] != null) {
                            jobNameArr.push({ name: processor[i].name, toCheck: processor[i].config.properties['Job Name'], id: processor[i].id });
                        }
                    }
                }

                //check process name is exist
                var repeatedNameArray = checkRepeat({ id: $scope.process.id, name: $scope.process.name, toCheck: $scope.process.name }, processNameArr);
                if (repeatedNameArray.length > 0) {
                    activityManager.pushCanvasMsg({
                        level: "ERROR",
                        time: timeService.fn.milliseconds2LocalTime(+new Date),
                        processors: repeatedNameArray,
                        text: i18n.dps_canvas_configuration_dpsValidationforSameProcessName
                    });
                    $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsValidationforSameProcessName);
                }
                //check job name is exist
                var repeatedJobNameArray = checkRepeat({ id: $scope.process.id, name: $scope.process.name, toCheck: $scope.process.config.properties['Job Name'] }, jobNameArr);
                if (repeatedJobNameArray.length > 0) {
                    activityManager.pushCanvasMsg({
                        level: "ERROR",
                        time: timeService.fn.milliseconds2LocalTime(+new Date),
                        processors: repeatedJobNameArray,
                        text: i18n.dps_canvas_configuration_dpsValidationforSameProcessJobName
                    });
                    $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_dpsValidationforSameProcessJobName);
                }

                if ($scope.process.type == "com.huawei.datacraft.processactivity.ExecuteScript" || $scope.process.type == "ExecuteScript") {
                    if ($scope.process.config.properties['Log Backup'] == 'True' && !$scope.process.config.properties['Destination Log Path']) {
                        $rootScope.$broadcast('configurationPanelControllerHint', i18n.dps_canvas_configuration_destinationRequired);
                        return;
                    }
                }

                $scope.process.config.autoTerminatedRelationships = [];
                var currentProcessor = processManager.getProcessByID($scope.process.id);
                if (currentProcessor) {

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

                    delete configTemp.properties.computeResource;
                    currentProcessor.config = $.extend(true, {}, configTemp);

                    //[END ADD  FOR 保存processor属性修改 ， 2016-12-17]
                    var legalFlags = activityManager.getLegalFlags();
                    for (var key in legalFlags) {
                        if (key == $scope.process.id) {
                            legalFlags[key] = true;
                            break;
                        }
                    }
                    processManager.refreshLocalProcess(currentProcessor);
                }
            }

            if (process) {
                //列名中英文切换
                for (var key in process.config.descriptors) {
                    if (process.config.descriptors[key].show == true) {
                        if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                            for (var i = 0; i < commonService.displayName.length; i++) {
                                if (process.config.descriptors[key].name == commonService.displayName[i].nameEn) {
                                    process.config.descriptors[key].displayName = commonService.displayName[i].nameZh;
                                }
                            }
                        }
                    }
                }
                //列名title显示中英文切换,由于title属性在许多地方公用，但是具体的意思要根据当前算子决定，比如job name可能既表示Hive作业的作业名称也表示Distcp作业的作业名称，所以需要根据算子类型进行区分
                for (var key in process.config.descriptors) {
                    if (process.type == 'ExecuteMR' || process.type == 'com.huawei.datacraft.activity.ExecuteMR') {
                        if (process.config.descriptors[key].show == true) {
                            if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                                for (var i = 0; i < commonService.ExecuteMRDescription.length; i++) {
                                    if (process.config.descriptors[key].description == commonService.ExecuteMRDescription[i].descriptionEn) {
                                        process.config.descriptors[key].description = commonService.ExecuteMRDescription[i].descriptionZh;
                                    }
                                }
                            }
                        }
                    } else if (process.type == 'ExecuteQuery' || process.type == 'com.huawei.datacraft.activity.ExecuteQuery') {
                        if (process.config.descriptors[key].show == true) {
                            if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                                for (var i = 0; i < commonService.ExecuteQueryDescription.length; i++) {
                                    if (process.config.descriptors[key].description == commonService.ExecuteQueryDescription[i].descriptionEn) {
                                        process.config.descriptors[key].description = commonService.ExecuteQueryDescription[i].descriptionZh;
                                    }
                                }
                            }
                        }
                    } else if (process.type == 'ExecuteSpark' || process.type == 'com.huawei.datacraft.activity.ExecuteSpark') {
                        if (process.config.descriptors[key].show == true) {
                            if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                                for (var i = 0; i < commonService.ExecuteSparkDescription.length; i++) {
                                    if (process.config.descriptors[key].description == commonService.ExecuteSparkDescription[i].descriptionEn) {
                                        process.config.descriptors[key].description = commonService.ExecuteSparkDescription[i].descriptionZh;
                                    }
                                }
                            }
                        }
                    } else if (process.type == 'ExecuteSparkSQL' || process.type == 'com.huawei.datacraft.activity.ExecuteSparkSQL') {
                        if (process.config.descriptors[key].show == true) {
                            if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                                for (var i = 0; i < commonService.ExecuteSparkSqlDescription.length; i++) {
                                    if (process.config.descriptors[key].description == commonService.ExecuteSparkSqlDescription[i].descriptionEn) {
                                        process.config.descriptors[key].description = commonService.ExecuteSparkSqlDescription[i].descriptionZh;
                                    }
                                }
                            }
                        }
                    } else if (process.type == 'InvokeSqoop' || process.type == 'com.huawei.datacraft.activity.InvokeSqoop') {
                        if (process.config.descriptors[key].show == true) {
                            if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                                for (var i = 0; i < commonService.InvokeSqoopDescription.length; i++) {
                                    if (process.config.descriptors[key].description == commonService.InvokeSqoopDescription[i].descriptionEn) {
                                        process.config.descriptors[key].description = commonService.InvokeSqoopDescription[i].descriptionZh;
                                    }
                                }
                            }
                        }
                    } else if (process.type == 'LoadHbase' || process.type == 'com.huawei.datacraft.activity.LoadHbase') {
                        if (process.config.descriptors[key].show == true) {
                            if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                                for (var i = 0; i < commonService.LoadHbaseDescription.length; i++) {
                                    if (process.config.descriptors[key].description == commonService.LoadHbaseDescription[i].descriptionEn) {
                                        process.config.descriptors[key].description = commonService.LoadHbaseDescription[i].descriptionZh;
                                    }
                                }
                            }
                        }
                    } else if (process.type == 'ExecuteScript' || process.type == 'com.huawei.datacraft.processactivity.ExecuteScript') {
                        if (process.config.descriptors[key].show == true) {
                            if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                                for (var i = 0; i < commonService.ExecuteScriptDescription.length; i++) {
                                    if (process.config.descriptors[key].description == commonService.ExecuteScriptDescription[i].descriptionEn) {
                                        process.config.descriptors[key].description = commonService.ExecuteScriptDescription[i].descriptionZh;
                                    }
                                }
                            }
                        }
                    } else if (process.type == 'Distcp' || process.type == 'com.huawei.datacraft.activity.Distcp') {
                        if (process.config.descriptors[key].show == true) {
                            if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                                for (var i = 0; i < commonService.DistcpDescription.length; i++) {
                                    if (process.config.descriptors[key].description == commonService.DistcpDescription[i].descriptionEn) {
                                        process.config.descriptors[key].description = commonService.DistcpDescription[i].descriptionZh;
                                    }
                                }
                            }
                        }
                    } else {
                        if (process.config.descriptors[key].show == true) {
                            if (window.urlParams.lang.toLowerCase() == 'zh-cn') {
                                for (var i = 0; i < commonService.pulicDescription.length; i++) {
                                    if (process.config.descriptors[key].description == commonService.pulicDescription[i].descriptionEn) {
                                        process.config.descriptors[key].description = commonService.pulicDescription[i].descriptionZh;
                                    }
                                }
                            }
                        }
                    }
                }
                canShowConfig = false;//if mouse up after drag,can show configureTab
                //去除名字中的空格
                var re = /\s+/g;
                if (re.test(process.name)) {
                    process.name = process.name.replace(/\s+/g, '');
                }
                var currentProcess = processManager.getSelectedProcess();
                if (!currentProcess || currentProcess.id !== process.id) {
                    processManager.setSelectedProcess(process);
                }
                if ($event.target.id !== "createLineIcon") {
                    isProcesssMouseDown = true;
                    currentEvent = "processDrag";
                    processDragPre.left = $event.screenX;
                    processDragPre.top = $event.screenY;
                }
            }
        };

        $scope.processClick = function (process, $event) {
            if ($($event.target).attr("class") == "background") {
                return;
            }
            if (process && (process.processorType == 'INVOKE_ACTIVITY' || process.processorType == 'PROCESS_ACTIVITY')) {
                processManager.setProcessName(process.name);
            }
            if (!isJustNowDragged && !editorLayout.getConfigurationPanelLayout().ifShow) {
                configurationPanelNotCoverProcess(true);
                editorLayout.getConfigurationPanelLayout().ifShow = true;
            }
            isJustNowDragged = false;
        };

        /**
         * check if configurationPanel will overlay process, YES do scroll | NO do nothing
         * @param isOpened
         * @hint configurationPanel width=540px
         *       process            width=201px
         */
        function configurationPanelNotCoverProcess(isOpened) {
            if (isOpened) {
                var selectedProcess = processManager.getSelectedProcess();
                
                if (selectedProcess.position && selectedProcess.position.x - canvasContainer.scrollLeft / scaleFactor > canvasContainer.offsetWidth - CONFIGURATION_WIDTH - selectedProcess.width) {
                    if (canvasContainer.scrollLeft / scaleFactor + canvasContainer.offsetWidth > 1 + CANVAS_WIDHT - CONFIGURATION_WIDTH) {
                        canvasContainer.style.transform = "translate(-520px, 0)";
                    } else {
                        canvasContainer.scrollLeft += CONFIGURATION_WIDTH;
                        processManager.setCanvasScrollOffset({ left: canvasContainer.scrollLeft, top: canvasContainer.scrollTop });
                    }
                }
            } else {
                canvasContainer.style.transform = "";
            }
        }
        
        // for process click focus style
        $scope.$watch(function () {
            return editorLayout.getConfigurationPanelLayout().ifShow;
        }, function () {
            if (!$scope.process) {
                return;
            }
            var className = { DATANODE: 'process-selected-data', INVOKE_ACTIVITY: 'process-selected-activity' }[$scope.process.processorType];
            if (editorLayout.getConfigurationPanelLayout().ifShow) {
                $("#" + $scope.process.id).eq(0).addClass(className);
            } else {
                $("#" + $scope.process.id).eq(0).removeClass(className);
            }
        });

        // for process click focus style
        $scope.$watch('process.id', function () {
            if (!editorLayout.getConfigurationPanelLayout().ifShow || !$scope.process) {
                return;
            }
            var processors = processManager.getProcessArray();
            _.forEach(processors, function (p) {
                var className = { DATANODE: 'process-selected-data', INVOKE_ACTIVITY: 'process-selected-activity' }[p.processorType];
                $("#" + p.id).eq(0).removeClass(className);
                if ($scope.process.id === p.id) {
                    $("#" + $scope.process.id).eq(0).addClass(className);
                }
            });
        });


        $scope.processMouseup = function ($event) {
            if ($($event.target).attr("class") == "background") {
                configurationPanelNotCoverProcess();
                editorLayout.getConfigurationPanelLayout().ifShow = false;
                canShowConfig = false;
            }
            /*
            if (canShowConfig && isJustNowDragged) {
                configurationPanelNotCoverProcess(true);
                editorLayout.getConfigurationPanelLayout().ifShow = true;
                pipelineEditorService.layout.fn.showConfigurationContainer();
            }
            */
        };

        $scope.processMouseenter = function (process) {
            if (process) {
                processManager.setTargetProcess(process);
                //此处扩展调用算子告警提示信息，请勿删除
                /*if (process.processorType.toUpperCase() == "INVOKE_ACTIVITY" || process.processorType.toUpperCase() == "DATANODE") {
                 if(window.urlParams.lang.toLowerCase() == 'zh-cn'){
                 var types = process.type.split(".");
                 var ProcessorType = types[types.length - 1];
                 for (var i = 0; i < commonService.validation.length; i++){
                 if (ProcessorType == commonService.validation[i].type) {
                 process.validationErrors = commonService.validation[i].validationErrors;
                 }
                 }
                 }
                 }*/
            }
        };
        $scope.processMouseleave = function () {
            if (!holdTargetProcess) {
                processManager.clearTargetProcess();
            }
        };

        function scaledXY(pos) {
            pos.x /= scaleFactor;
            pos.y /= scaleFactor;
        }

        $scope.dragStart = function (event, ui) {
            if (ui) {
                var position = { x: ui.position.left, y: ui.position.top };
                scaledXY(position);
                processManager.refreshProcessPosition(processManager.getSelectedProcess(), position);
                processManager.setSaveFlag(true);
                $scope.$evalAsync();
            }
        };
        function fixPosition(ui) {
            var position = { x: ui.position.left, y: ui.position.top };
            var processPositionInterval = 16; ///scaleFactor
            var selectedProcess = processManager.getSelectedProcess();
            var pA = processManager.getProcessArray();
            for (var i = 0; i < pA.length; i++) {
                if (selectedProcess.id === pA[i].id) {
                    continue;
                }
                // if target position is in one proces, rePosition it to around
                var scaledPA = $.extend({}, pA[i]);
                //scaledPA.position.x /= scaleFactor;
                //scaledPA.position.y /= scaleFactor;
                scaledPA.width *= scaleFactor;
                scaledPA.height *= scaleFactor;
                var leftDistance = Math.abs(position.x - scaledPA.position.x);
                var topDistance = Math.abs(position.y - scaledPA.position.y);

                // left-top
                if (position.x >= scaledPA.position.x - scaledPA.width - processPositionInterval && position.x <= scaledPA.position.x
                    && position.y >= scaledPA.position.y - scaledPA.height && position.y <= scaledPA.position.y) {
                    position.x -= scaledPA.width - leftDistance + processPositionInterval;
                    position.y -= scaledPA.height - topDistance;
                }
                // left-bottom
                if (position.x >= scaledPA.position.x - scaledPA.width - processPositionInterval && position.x <= scaledPA.position.x
                    && position.y <= scaledPA.position.y + scaledPA.height && position.y >= scaledPA.position.y) {
                    position.x -= scaledPA.width - leftDistance + processPositionInterval;
                    position.y += scaledPA.height - topDistance;
                }
                // right-bottom
                if (position.x <= scaledPA.position.x + scaledPA.width + processPositionInterval && position.x >= scaledPA.position.x
                    && position.y <= scaledPA.position.y + scaledPA.height && position.y >= scaledPA.position.y) {
                    position.x += scaledPA.width - leftDistance + processPositionInterval;
                    position.y += scaledPA.height - topDistance;
                }
                // right-top
                if (position.x <= scaledPA.position.x + scaledPA.width + processPositionInterval && position.x >= scaledPA.position.x
                    && position.y >= scaledPA.position.y - scaledPA.height && position.y <= scaledPA.position.y) {
                    position.x += scaledPA.width - leftDistance + processPositionInterval;
                    position.y -= scaledPA.height - topDistance;
                }
            }
            scaledXY(position);
            processManager.refreshProcessPosition(processManager.getSelectedProcess(), position, true);
        }

        $scope.processOnDrag = function (event, ui) {
            if (ui) {
                canShowConfig = false;//if mouse up after drag,do not show configureTab
                var position = { x: ui.position.left, y: ui.position.top };
                scaledXY(position);
                processManager.refreshProcessPosition(processManager.getSelectedProcess(), position);
                $scope.$evalAsync();
            }
        };
        $scope.dragStop = function (event, ui) {
            if (ui) {
                fixPosition(ui);
            }
        };

        $scope.processDbclick = function (process) {
            if (process.processorType.toUpperCase() == 'LINK_ACTIVITY' && process) {
                var url = process.config.properties["URL"];
                url && commonService.safeOpenURL(url);
            }
        };
        var options = {
            title: "Create Connection",
            height: "500px",
            width: "350px",
            "content-type": 'url',
            content: "src/app/business/dataCraft/views/windows/connectionConfig.html",
            resizable: true,
            maximizable: true,
            minimizable: true,
            beforeClose: function () {
                console.log("close");
            },
            buttons: [{
                key: "btnOK",
                label: 'OK',
                focused: true,
                handler: function (event) {
                    /**TODO: Call  create new connection then close window**/
                    var m = 0;
                    /**TODO: Call  create new connection then close window**/
                    $scope.formData = connectionConfig.getFormData();
                    $scope.formData.relationships = processManager.getSelectedProcess().relationships;
                    for (var i = 0; i < $scope.formData.relationships.length; i++) {
                        if ($scope.formData.relationships[i].checked == true) {
                            m++;
                        }
                    }
                    if (m >= 1) {
                        processManager.createNewConnection(processManager.getSelectedProcess(), processManager.getTargetProcess(), connectionConfig.getFormDataStr(), connectionConfig.getFormData());
                        processManager.clearTargetProcess();
                        holdTargetProcess = false;
                        connectionWindow.destroy();
                    } else {
                        commonService.message("For realationships should be check");
                    }
                }
            }
                , {
                key: "btnCancel",
                label: 'Cancel',
                focused: false,
                handler: function (event) {
                    /**TODO: close window**/
                    connectionWindow.destroy();
                }
            }]
        };

        var optionsSetIPHost = {
            title: "Define Compute Resource",
            height: "400px",
            width: "605px",
            "content-type": 'url',
            content: "src/app/business/dataCraft/views/windows/setHostIP.html",
            resizable: true,
            maximizable: true,
            minimizable: true,
            beforeClose: function () {
            },
            buttons: [{
                key: "btnOK",
                label: 'OK',//按钮上显示的文字
                focused: true,//默认焦点
                handler: function (event) {//点击回调函数
                    console.log("Event Triggered for the ok button");
                }
            }, {
                key: "btnCancel",
                label: 'Cancel',
                focused: false,
                handler: function (event) {
                    setIPHostWindow.destroy();
                }
            }]
        };

        $scope.setIPHostWindows = function (process) {
            setIPHostWindow = new tinyWidget.Window(optionsSetIPHost);
            setIPHostWindow.show();
        };

        $scope.ellipsisByLength = commonService.ellipsisByLength;

        //判断activity是否允许连接该类型数据源
        function isAllowConnection(allowArray, type) {
            if (allowArray && type) {
                var isAllow = false;
                for (var i = 0; i < allowArray.length; i++) {
                    if (type == allowArray[i]) {
                        isAllow = true;
                    }
                }
                return isAllow;
            }
        }

        //判断该activity是不是已经被连接
        function isExistInConnections(direction, id) {
            var isExist = false;
            var connections = processManager.getConnections();
            /*"PROCESS_ACTIVITY"*/
            for (var i = 0; i < connections.length; i++) {
                if (connections[i][direction].id == id && connections[i].source.type != connections[i].destination.type) {
                    if (connections[i].source.type == "PROCESS_ACTIVITY" || connections[i].destination.type == "PROCESS_ACTIVITY") {
                        isExist = false;
                    } else {
                        isExist = true;
                    }
                }
            }
            return isExist;
        }

        // setting for page title, let it to be DPS text
    };
    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyController('canvas.ctrl', canvasCtrl);
    return dataCraftModule;
});