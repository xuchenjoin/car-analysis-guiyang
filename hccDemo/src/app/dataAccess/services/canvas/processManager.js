define(["language/dataAccess"], function (keyID) {
    "use strict";
    var processManager = function (camel, commonService, storage, activityManager) {
        var processArray = [];
        var connections = [];
        var processTypeArray = [];
        var self = this;
        var processStatistics = {
            running: 1,
            stopped: 0,
            warning: 0,
            error: 0
        };
        var selectedProcess = {};
        var targetProcess;
        var selectedConnection;
        var creatingLine;//to show line in drawing
        var lineCreator = {
            width: 20,
            height: 20,
            position: { x: 0, y: 0 },
            line: { start: { side: 'top', x: 0, y: 0 }, end: { side: 'top', x: 0, y: 0 } }
        };
        var PROCESS_WIDTH = 201; // 165+36
        var PROCESS_HEIGHT = 66;
        var processName;
        var SaveAction = false;
        var lineChangeFlag = { 'flag': 1 };
        var scaleFactor = 1;
        this.setScaleFactor = function (factor) {
            scaleFactor = factor;
        };
        this.getScaleFactor = function () {
            return scaleFactor;
        };
        this.getLineChangeFlag = function () {
            return lineChangeFlag;
        };
        var configAry = [];
        var canvasScrollOffset = {left: 0 , top: 0}; // canvs scroll offset{left: Number,top: Number}

        this.processtypeConfig = function (response) {
            var propertyAdd = response;
            for (var keys in propertyAdd) {
                for (var key in propertyAdd[keys]["config"]["descriptors"]) {
                    var keyName = key;
                    if (propertyAdd[keys]["config"].hasOwnProperty('properties')) {
                        propertyAdd[keys]["config"]["properties"][keyName] = null;
                    } else {
                        propertyAdd[keys]["config"]["properties"] = {};
                        propertyAdd[keys]["config"]["properties"][keyName] = null;
                    }
                }
                configAry.push(propertyAdd[keys]);
            }
            //$.extend(true, configAry, propertyAdd);
        }
        this.setProcessTypeArray = function (processtypearray) {
            processTypeArray = processtypearray || [];
        };

        this.setProcessName = function (processname) {
            processName = processname;
        };

        this.getProcessName = function () {
            return processName;
        };

        this.setProcessStatistics = function (newStatistics) {
            for (var x in newStatistics) {
                processStatistics[x] = newStatistics[x];
            }
        };

        this.getProcessStatistics = function () {
            return processStatistics;
        };

        this.setProcessArray = function (newProcessArray) {
            processArray.splice(0, processArray.length);
            for (var i = 0; i < newProcessArray.length; i++) {
                processArray.push(packingProcess(newProcessArray[i]));
            }
        };

        this.setProcessArrayN = function (newProcessArray) {
            processArray = [];
            for (var i = 0; i < newProcessArray.length; i++) {
                processArray.push(packingProcess(newProcessArray[i]));
            }
        };

        this.setProcessArrayT = function (newProcessArray) {
            for (var i = 0; i < newProcessArray.length; i++) {
                processArray.push(packingProcess(newProcessArray[i]));
            }
        };

        function packingProcess(process) {
            process.width = PROCESS_WIDTH;
            process.height = PROCESS_HEIGHT;
            return process;
        }

        // store original validationErrors
        this.backupValidationErrors = function (process) {
            if (process.validationErrors && process.validationErrors.length > 0) {
                process.validationErrorsBackup = process.validationErrorsBackup || {};
                process.validationErrors.forEach(function (val) {
                    var result = val.match(/^'([\w\s\\/]*)'/);
                    if (result.length > 1) {
                        process.validationErrorsBackup[result[1]] = val;
                    }
                });
            }
        }

        /**
         * refresh the validationErrors of process (data-node / activity)
         * @param processor
         * @param curProcess
         */
        function refreshValidationErrors(processor, currentProcess) {
            if (processor) {
                processor.forEach(function (process) {
                    var curProcess = currentProcess || process;
                    if (process.id === curProcess.id && process.validationErrorsBackup) {
                        Object.keys(process.validationErrorsBackup).forEach(function (pk) {
                            var idx = -1;
                            if (process.validationErrors) {
                                idx = _.findIndex(process.validationErrors, function (element) {
                                    var tempStr = "'" + pk + "'";
                                    return element.substr(0, tempStr.length) === tempStr;
                                });
                            }
                            if (curProcess.config.properties[pk]) {
                                if (idx >= 0) {
                                    process.validationErrors.splice(idx, 1);
                                }
                            } else if (idx < 0) {
                                process.validationErrors.push(process.validationErrorsBackup[pk]);
                            }
                        });
                    }
                });
            }
        }

        this.refreshProcessListValidationErrorsFromCurrent = function (processor, curProcess) {
            refreshValidationErrors(processor, curProcess)
        };
        this.refreshProcessListValidationErrors = function (processor) {
            refreshValidationErrors(processor);
        };

        this.setConnections = function (newConnections) {
            connections.splice(0, newConnections.length);
            for (var i = 0; i < newConnections.length; i++) {
                connections.push(packingConnection(newConnections[i]));
            }
        };

        this.setConnectionsN = function (newConnections) {
            connections = [];
            for (var i = 0; i < newConnections.length; i++) {
                connections.push(packingConnection(newConnections[i]));
            }
        };

        this.setConnectionsT = function (newConnections) {
            for (var i = 0; i < newConnections.length; i++) {
                connections.push(packingConnection(newConnections[i]));
            }
        };
        this.getProcessArray = function () {
            return processArray;
        };
        this.getConnections = function () {
            return connections;
        };
        this.getLineCreator = function () {
            return lineCreator;
        };

        this.sortArrayForSqoop1 = [{
            "Application Name": null
        }, {
            "Cluster ID": null
        }, {
            "Source": null
        }, {
            "Target": null
        }, {
            "Parameters": null
        }, {
            "Source Parameters": null
        }, {
            "HDFS/OBS Path": null
        },
        {
            "LOG path": null
        }, {
            "Target Parameters": null
        }, {
            "DB Connection URL": null
        }, {
            "DB Driver Name": null
        }, {
            "DB User Name": null
        }, {
            "DB Password": null
        }, {
            "Table Name": null
        }];

        this.sortArrayForSqoop2 = [{
            "Application Name": null
        }, {
            "Cluster ID": null
        }, {
            "Source": null
        }, {
            "Target": null
        }, {
            "Parameters": null
        }, {
            "Source Parameters": null
        }, {
            "DB Connection URL": null
        }, {
            "DB Driver Name": null
        }, {
            "DB User Name": null
        }, {
            "DB Password": null
        }, {
            "Table Name": null
        }, {
            "Target Parameters": null
        }, {
            "HDFS/OBS Path": null
        }, {
            "LOG path": null
        }];

        this.sortArrayForDistcpAction1 = [{
            "Cluster ID": null
        }, {
            "Action": null
        }, {
            "Job Name": null
        }, {
            "Source": null
        }, {
            "Input Directory": null
        }, {
            "Target": null
        }, {
            "Output Directory": null
        }];

        /**
         * set the selected process
         * @param process
         */
        this.setSelectedProcess = function (process) {
            for (var i = 0; i < processArray.length; i++) {
                if (process.id == processArray[i].id) {
                    var cProcess = processArray[i];
                    for (var key in selectedProcess) {
                        delete selectedProcess[key];
                    }
                    $.extend(true, selectedProcess, cProcess);
                    targetProcess = undefined;
                    if (selectedProcess && (selectedProcess.type === 'InvokeSqoop' || selectedProcess.type === 'com.huawei.datacraft.activity.InvokeSqoop')) {
                        var sourceValue = selectedProcess.config.properties["Source"];
                        var targetValue = selectedProcess.config.properties["Target"];
                        if (sourceValue && targetValue) {
                            if (sourceValue === "HDFS/OBS") {
                                selectedProcess.sortArray = this.sortArrayForSqoop1;
                            } else {
                                selectedProcess.sortArray = this.sortArrayForSqoop2;
                            }
                        } else {
                            selectedProcess.sortArray = this.sortArrayForSqoop1;
                        }
                    }
                    if (selectedProcess && (selectedProcess.type === 'Distcp' || selectedProcess.type === 'com.huawei.datacraft.activity.Distcp')) {
                        selectedProcess.sortArray = this.sortArrayForDistcpAction1;
                    }
                    //设置默认值
                    for (var key in selectedProcess.config.properties) {
                        var obj = selectedProcess.config.descriptors[key];
                        if (obj.hasOwnProperty("defaultValue") && !selectedProcess.config.properties[key]) {
                            selectedProcess.config.properties[key] = obj["defaultValue"];
                        }
                        //处理sql语句
                    	/*if((key.toLowerCase()==="query" || key.toLowerCase()==="query statement") && selectedProcess.config.properties[key] && !obj.hasOwnProperty("defaultValue")){
                    		selectedProcess.config.properties[key] = $.base64.decode(selectedProcess.config.properties[key]);
                    	}*/
                    }
                    return selectedProcess;
                }
            }
            return;
        };

        /**
         *
         * @returns {*}
         */
        this.getSelectedProcess = function () {
            return selectedProcess;
        };

        this.setTargetProcess = function (process) {
            for (var i = 0; i < processArray.length; i++) {
                if (process.id == processArray[i].id && (!selectedProcess || process.id != selectedProcess.id)) {
                    targetProcess = processArray[i];
                    return targetProcess;
                }
            }
            return;
        };
        this.clearTargetProcess = function () {
            targetProcess = undefined;
        };
        this.getTargetProcess = function () {
            return targetProcess;
        };
        /**
         * use to create new processor
         * @param position
         * @param processType
         * @returns {*}
         */

        this.createNewProcessPromise = function (position, processType) {
            if (position.x >= 0 && position.y >= 0) {
                var groupId = commonService.getGroupID();
                var isExist = false;
                var desc;
                var newProcess = {};
                var status = {
                    "runStatus": "Invalid",
                    "read": "0 bytes",
                    "written": "0 bytes",
                    "input": "0/0 bytes",
                    "output": "0/0 bytes",
                    "tasks": "0",
                    "tasksDuration": "00:00:00.000"
                };
                for (var i = 0; i < configAry.length; i++) {
                    if (processType.type == configAry[i].type) {
                        isExist = true;
                        newProcess = $.extend(true, {}, configAry[i]);
                        break;
                    }
                }

                if (!isExist) {
                    getProcessStructure(processType).then(function (response) {
                        //var response = getProcessStructure(processType);
                        if (!response.processor) {
                            commonService.message("Failed", { type: "error" });
                            return;
                        }
                        processTypeArray.push(response.processor);
                        newProcess = $.extend(true, {}, response.processor);
                        storage.add("processType", processTypeArray);

                        var processorID = commonService.getUUID();
                        var uniqueFlag = false;
                        var keyV = 'id';
                        uniqueFlag = idIsunique(processArray, processorID, keyV);
                        while (!uniqueFlag) {
                            processorID = commonService.getUUID();
                            uniqueFlag = idIsunique(processArray, processorID, keyV);
                        }
                        newProcess.id = 'ui_' + processorID;
                        newProcess.position.x = position.x;
                        newProcess.position.y = position.y;
                        var uri = '/nifi-api/controller/process-groups/' + groupId + '/processors/' + processorID;
                        newProcess.uri = uri;
                        for (var key in newProcess.config.properties) {
                            var obj = newProcess.config.descriptors[key];
                            if (obj.hasOwnProperty("defaultValue")) {
                                newProcess.config.properties[key] = obj["defaultValue"];
                            }
                        }
                        newProcess = $.extend(true, newProcess, status);
                        if (newProcess.processorType === "PROCESS_ACTIVITY") {
                            newProcess.computeResource = [];
                        } else if (newProcess.processorType === "INVOKE_ACTIVITY" || newProcess.processorType === "LINK_ACTIVITY") {
                            newProcess.computeResource = ["EBD"];
                        }
                        var timestamp = new Date().getTime();
                        desc = newProcess.description;
                        newProcess.name = newProcess.description + '_' + String(timestamp).slice(9);
                        newProcess.displayType=newProcess.description;
                        newProcess.description = desc.replace(/ /g, "_") + '_' + String(timestamp).slice(9);

                        self.backupValidationErrors(newProcess);
                        processArray.push(packingProcess(newProcess));
                        self.setSaveFlag(true);
                        var legalFlags = activityManager.getLegalFlags();
                        legalFlags[newProcess.id] = false;
                    });
                } else {
                    var processorID = commonService.getUUID();
                    var uniqueFlag = false;
                    var keyV = 'id';
                    uniqueFlag = idIsunique(processArray, processorID, keyV);
                    while (!uniqueFlag) {
                        processorID = commonService.getUUID();
                        uniqueFlag = idIsunique(processArray, processorID, keyV);
                    }
                    newProcess.id = 'ui_' + processorID;
                    newProcess.position.x = position.x;
                    newProcess.position.y = position.y;
                    var uri = '/nifi-api/controller/process-groups/' + groupId + '/processors/' + processorID;
                    newProcess.uri = uri;

                    for (var key in newProcess.config.properties) {
                        var obj = newProcess.config.descriptors[key];
                        if (obj.hasOwnProperty("defaultValue")) {
                            newProcess.config.properties[key] = obj["defaultValue"];
                        }
                    }

                    newProcess = $.extend(true, newProcess, status);

                    if (newProcess.processorType === "PROCESS_ACTIVITY") {
                        newProcess.computeResource = [];
                    } else if (newProcess.processorType === "INVOKE_ACTIVITY" || newProcess.processorType === "LINK_ACTIVITY") {
                        newProcess.computeResource = ["EBD"];
                    }
                    var timestamp = new Date().getTime();
                    desc = newProcess.description;
                    newProcess.name = newProcess.description + '_' + String(timestamp).slice(9);
                    newProcess.displayType=newProcess.description;
                    newProcess.description = desc.replace(/ /g, "_") + '_' + String(timestamp).slice(9);

                    self.backupValidationErrors(newProcess);
                    processArray.push(packingProcess(newProcess));
                    this.setSaveFlag(true);
                    var legalFlags = activityManager.getLegalFlags();
                    legalFlags[newProcess.id] = false;
                }
            }
        };



        //[BEGIN ADD  FOR 从服务器获取processor结构， 2016-12-18]
        function getProcessStructure(processType) {
            var url = "rest/api/v1/datacraft/controller/process-groups/root/processors/config";
            var params = {
                "processor": {
                    "type": processType.type,
                    "processorType": processType.processorType
                }
            };
            var promise = camel.put({
                url: url,
                params: params,
                beforeSend: function (request, setting) {
                },
                timeout: 12000
            });
            return promise.then(function (response) {
                return promise;
            })
        }

        //[BEGIN TEMPLATE import]
        this.getTemplateStructure = function (position, processType) {
            var url = "rest/api/v1/datacraft/gettemplate/" + processType.id
            var params = {
                "posx": position.x,
                "posy": position.y
            };
            var promise = camel.get({
                url: url,
                params: params,
                timeout: 12000
            });
            return promise.then(function (response) {
                return promise;
            })
        }

        /* this.getTemplateconfig = function(){
             getTemplateStructure().then(function(response){
                return response;
             })
         }*/

        /*this.getTemplateStructure = function(processType){
            var url = "./src/app/business/dataCraft/templateconfigDTO.json"
            var params = {
                    "processor": {
                        "type": processType.type,
                        "processorType": processType.processorType
                    }
                };
            var promise = camel.get({
                 url:url,
                // params: params,
                 //beforeSend: function (request, setting) {
                 //},
                timeout: 12000
            });
            return promise.then(function(response){
                return promise;
            })
        }*/

        //[END ADD FOR 从服务器获取processor结构， 2016-12-18]

        /*
         * 删除processor
         * */
        this.deleteProcess = function (processor) {
            var localScope = this;
            deleteProcessFromArray(processor, localScope);
            deleteConnectionByProcessID(processor.id);
        };
        /**
         * delete process from processArray, if sucess return index else return -1
         * @param processor
         * @returns {number}
         */
        function deleteProcessFromArray(processor, localScope) {
            for (var i = 0; i < processArray.length; i++) {
                if (processor.id == processArray[i].id) {
                    localScope.setSaveFlag(true);
                    processArray.splice(i, 1);
                    return i;
                }
            }
            return -1;
        }

        /**
         * call this to delete connection by process id
         * @param processorID
         */
        function deleteConnectionByProcessID(processorID) {
            for (var i = 0; i < connections.length; i++) {
                if (connections[i].source.id == processorID || connections[i].destination.id == processorID) {
                    connections.splice(i, 1);
                    i--;
                }
            }
        }

        /**
         * update position of process
         * @param processor
         * @returns {*}
         */
        this.updateProcessPromise = function (processor, nPosition) {
            var url = commonService.processGroupUrl + commonService.getGroupID() + "/processors/" + processor.id;
            var version = commonService.getVersion();
            var clientID = commonService.getClientID();
            var params = {};
            var promise = camel.put({
                url: url,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                params: params,
                beforeSend: function (request, setting) {
                    setting.data = "version=" + version + "&clientId=" + clientID + "&x=" + nPosition.x + "&y=" + nPosition.y;
                },
                timeout: commonService.WAIT_TIME
            });
            return promise.then(function (response) {
                commonService.setClientID(response.revision.clientId);
                commonService.setVersion(response.revision.version);
                return promise;
            }, function (response) {
                console.log("fail to add new processor node");
                return promise;
            })
            this.setSaveFlag(true);
        };

        this.deleteConnection = function (connection) {
            var localScope = this;
            lineChangeFlag.flag++;
            deleteConnectionFromArray(connection, localScope);
        }

        function deleteConnectionPromise(connection) {
            var version = commonService.getVersion();
            var clientID = commonService.getClientID();
            var url = commonService.processGroupUrl + commonService.getGroupID() + "/connections/" + connection.id + "?version=" + version + "&clientId=" + clientID;
            var params = { version: version, clientId: clientID };
            var promise = camel.deleter({
                url: url,
                params: params,
                beforeSend: function (request, setting) {
                },
                timeout: commonService.WAIT_TIME
            });
            return promise.then(function (response) {
                commonService.setClientID(response.revision.clientId);
                commonService.setVersion(response.revision.version);
                /**delete connection from array**/
                deleteConnectionFromArray(connection);
                return promise;
            }, function (response) {
                commonService.message(response.responseText, { type: "error" });
                return promise;
            });
        }
        function dropRequestOnConnection(connection) {
            var url = commonService.processGroupUrl + commonService.getGroupID() + "/connections/" + connection.id + "/drop-requests";
            var promise = camel.post({
                url: url,
                params: {},
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                beforeSend: function (request, setting) {
                },
                timeout: commonService.WAIT_TIME
            });
            return promise.then(function (response) {
                commonService.setClientID(response.revision.clientId);
                var dropId = response.dropRequest.id || "";
                var dUrl = commonService.processGroupUrl + commonService.getGroupID() + "/connections/" + connection.id + "/" + dropId;
                var dPromise = camel.deleter({
                    url: dUrl,
                    params: {},
                    beforeSend: function (request, setting) {
                    },
                    timeout: commonService.WAIT_TIME
                });
                return dPromise.then(function (response) {
                    commonService.setClientID(response.revision.clientId);
                }, function () {
                    return promise;
                });
            });
        }



        function deleteConnectionFromArray(connection, localScope) {

            for (var i = 0; i < connections.length; i++) {
                if (connection.id == connections[i].id) {
                    connections.splice(i, 1);
                    localScope.setSaveFlag(true);
                    return i;
                }
            }
            return -1;
        }



        /**
         * call thi to create new connection
         * @param sourceProcessor
         * @param destinationProcessor
         * @param connectionConfigStr
         * @returns {*}
         */
        this.createNewConnection = function (sourceProcessor, destinationProcessor, connectionConfigStr, connectionConfig) {
            var groupID = commonService.getGroupID();
            var localConnection = {};
            var connectionID = commonService.getUUID();
            var uniqueFlag = false;
            var keyV = 'id';
            uniqueFlag = idIsunique(connections, connectionID, keyV);
            while (!uniqueFlag) {
                connectionID = commonService.getUUID();
                uniqueFlag = idIsunique(connections, connectionID, keyV);
            }
            localConnection.id = connectionID;
            var uri = '/controller/process-groups/' + groupID + '/connections/' + connectionID;
            localConnection.uri = uri;
            localConnection.parentGroupId = commonService.getGroupID();
            localConnection.name = "new Name";
            localConnection.labelIndex = 1;
            localConnection.zIndex = 0;
            localConnection.backPressureObjectThreshold = 0;
            localConnection.backPressureDataSizeThreshold = "0MB";
            localConnection.prioritizers = [];
            localConnection.bends = [];
            var source = {};
            var sProcessor = sourceProcessor;
            source.id = sProcessor.id;
            source.type = sProcessor.processorType;
            source.groupId = sProcessor.parentGroupId;
            source.name = sProcessor.name;
            source.running = false;
            localConnection.source = source;
            var target = {};
            var tProcessor = destinationProcessor;
            target.id = tProcessor.id;
            target.type = tProcessor.processorType;
            target.groupId = tProcessor.parentGroupId;
            target.name = tProcessor.name;
            target.running = false;
            target.comments = tProcessor.config.comments;
            localConnection.destination = target;
            localConnection.selectedRelationships = ["Success"];
            localConnection.availableRelationships = ["success", "Failure"];
            var connection = packingConnection(localConnection);
            connections.push(connection);
            this.setSaveFlag(true);
            lineChangeFlag.flag++;
            return connection;
        };


        /**
         *
         * @param connection
         */
        this.setSelectedConnection = function (connection) {
            selectedConnection = connection;
            /**TODO:find the one in array**/
        };

        this.refreshLineCreatorPosition = function (newPosition) {
            lineCreator.position = newPosition;
            var startShape = selectedProcess;
            var endShape = lineCreator;
            var linePoints = getMinDisPoints(getMiddlePointsOnFourEdges(startShape), getMiddlePointsOnFourEdges(endShape));
            lineCreator.line.start = linePoints.start;
            lineCreator.line.end = linePoints.end;
        };
        /**
         *
         * @param targetProcess
         * @param newPosition
         */
        this.refreshProcessPosition = function (targetProcess, newPosition, fixPosition) {
            targetProcess.position = newPosition;
            for (var i = 0; i < processArray.length; i++) {
                if (processArray[i].id == targetProcess.id) {
                    processArray[i].position = newPosition;
                }
            }
            for (var i = 0; i < connections.length; i++) {
                if (connections[i].source.id == targetProcess.id) {
                    packingConnection(connections[i], fixPosition);
                    continue;
                } else if (connections[i].destination.id == targetProcess.id) {
                    packingConnection(connections[i], fixPosition);
                    continue;
                }
            }
        };

        /**
         * try use new process to replace process in process array
         * @param process
         * @returns {*}
         */
        this.refreshLocalProcess = function (process) {
            for (var i = 0; i < processArray.length; i++) {
                if (processArray[i].id == process.id) {
                    var cProcess = processArray[i];
                    return $.extend(true, cProcess, process);
                }
            }
            return;
        };

        /**
         * check the saved data
         * @param id
         */
        this.getSaveFlag = function () {
            return SaveAction;
        }
        /**
         * Set the saved data
         * @param id
         */
        this.setSaveFlag = function (flag) {
            SaveAction = flag;
        }
        /**
         * search for process by id
         * @param id
         */
        this.getProcessByID = function (id) {
            for (var i = 0; i < processArray.length; i++) {
                if (processArray[i].id == id) {
                    return $.extend(true, {}, processArray[i]);
                }
            }
            return;
        };
        /**
         * add line info to connection
         * @param connection
         * @returns {*}
         */
        function packingConnection(connection, fixPosition) {
            var startProcess = getProcessByID(connection.source.id);
            var targetProcess = getProcessByID(connection.destination.id);
            if (startProcess && targetProcess) {
                var startPoints = getMiddlePointsOnFourEdges(startProcess);
                var endPoints = getMiddlePointsOnFourEdges(targetProcess);
                var linePoints;
                if (fixPosition) {
                    linePoints = getConnectionPoints(startPoints, endPoints);
                } else {
                    linePoints = getMinDisPoints(startPoints, endPoints);
                }
                connection.start = linePoints.start;
                connection.end = linePoints.end;
                return connection;
            }
        }


        /**
         * call this function to find middle points in all lines of parallelogram
         * @param parallelogram  <min like {position:{x:x,y:y},width:width,height:height}
         * @returns {{top: {type: number, x: *, y: *}, left: {type: number, x: *, y: *}, bottom: {type: number, x: *, y: *}, right: {type: number, x: *, y: *}}}
         */
        function getMiddlePointsOnFourEdges(parallelogram) {
            return {
                top: { type: 0, x: parallelogram.position.x + parallelogram.width / 2, y: parallelogram.position.y },
                left: { type: 1, x: parallelogram.position.x, y: parallelogram.position.y + parallelogram.height / 2 },
                bottom: {
                    type: 0,
                    x: parallelogram.position.x + parallelogram.width / 2,
                    y: parallelogram.position.y + parallelogram.height - 20
                },
                right: {
                    type: 1,
                    x: parallelogram.position.x + parallelogram.width,
                    y: parallelogram.position.y + parallelogram.height / 2
                }
            }
        };
        /**
         * find min distance in points
         * @param startPoints
         * @param endPoints
         * @returns {{start: {side: string, x: *, y: *}, end: {side: string, x: *, y: *}}}
         */
        function getMinDisPoints(startPoints, endPoints) {
            var minStartPoint = "top";
            var minEndPoint = "top";
            var minDistance = Math.pow((startPoints[minStartPoint].x - endPoints[minEndPoint].x), 2) + Math.pow((startPoints[minStartPoint].y - endPoints[minEndPoint].y), 2);
            for (var ps in startPoints) {
                for (var pe in endPoints) {
                    if (startPoints[ps].type != endPoints[pe].type) {
                        continue;
                    }
                    ;
                    var currentDistance = Math.pow((startPoints[ps].x - endPoints[pe].x), 2) + Math.pow((startPoints[ps].y - endPoints[pe].y), 2);
                    if (currentDistance < minDistance) {
                        minDistance = currentDistance;
                        minStartPoint = ps;
                        minEndPoint = pe;
                    }
                }
            }
            return {
                start: {
                    side: minStartPoint,
                    x: startPoints[minStartPoint].x,
                    y: startPoints[minStartPoint].y
                }, end: {
                    side: minEndPoint,
                    x: endPoints[minEndPoint].x,
                    y: endPoints[minEndPoint].y
                }
            }
        }


        /**
         * 
         */
        function getPickedPoint(startPoints, endPoints, direction) {
            var directionReverse;
            switch (direction) {
                case "left":
                    directionReverse = "right";
                    break;
                case "right":
                    directionReverse = "left";
                    break;
                case "top":
                    directionReverse = "bottom";
                    break;
                case "bottom":
                    directionReverse = "top";
                    break;
                default:
                    directionReverse = "left";
                    break;
            }
            return {
                start: {
                    side: direction,
                    x: startPoints[direction].x,
                    y: startPoints[direction].y
                },
                end: {
                    side: directionReverse,
                    x: endPoints[directionReverse].x,
                    y: endPoints[directionReverse].y
                }
            };
        }

        /**
         * get the line connection point in start/end Points
         * @param startPoints, 4 points (say left/right/top/bottom)
         * @param endPoints, same as startPoints
         */
        function getConnectionPoints(startPoints, endPoints) {
            var THRESHOLD = 16;
            // situation-1
            //      |-->[ ]
            // [ ]--|-->[ ]
            //      |-->[ ]
            if (endPoints.left.x - startPoints.right.x >= THRESHOLD) {
                return getPickedPoint(startPoints, endPoints, "right");
            }

            // situation-2, mirror of situation-1
            if (startPoints.left.x - endPoints.right.x > THRESHOLD) {
                return getPickedPoint(startPoints, endPoints, "left");
            }

            // situation-3
            //     [ ]
            //      |
            //  |---|---|
            // [ ] [ ] [ ]
            if (endPoints.top.y - startPoints.bottom.y >= THRESHOLD) {
                return getPickedPoint(startPoints, endPoints, "bottom");
            }

            // situation-4, mirror of situation-3
            if (startPoints.top.y - endPoints.bottom.y > THRESHOLD) {
                return getPickedPoint(startPoints, endPoints, "top");
            }

            return {
                start: {
                    side: "right",
                    x: startPoints.right.x,
                    y: startPoints.right.y
                },
                end: {
                    side: "left",
                    x: endPoints.left.x,
                    y: endPoints.left.y
                }
            };
        }

        /**
         * set the scroll offset of canvas
         * @for leftPanel drag into canvas use, the drag event cannot get the correct position
         * @param offset: {left: *, top: *}
         */
        this.setCanvasScrollOffset = function (offset) {
            canvasScrollOffset.left = offset.left;
            canvasScrollOffset.top = offset.top;
        };

        this.getCanvasScrollOffset = function () {
            return $.extend({}, canvasScrollOffset);
        };

        function getProcessByID(processID) {
            for (var i = 0; i < processArray.length; i++) {
                if (processID == processArray[i].id) {
                    return processArray[i];
                }
            }
            return;
        }

        function idIsunique(array, id, key) {
            var j = 0;
            for (var i = 0; i < array.length; i++) {
                if (array[i][key] != id) {
                    j++;
                }
            }
            if (j == array.length) {
                return true;
            }
            return false;
        }

        this.getSelectedConnection = function () {
            return selectedConnection;
        };
    };
    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyService('processManager', processManager);
});
