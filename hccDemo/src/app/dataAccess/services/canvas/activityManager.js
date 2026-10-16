/**
 *
 */

define(["language/dataAccess"], function (keyID) {
    "use strict";
    var activityManager = function (camel, commonService, $rootScope) {
        var processors = [];
        var connections = [];
        var activityArray = [];
        var processorsDegree = [];//构造节点数组用来判断pipeline中是否存在闭环
        var connectionsSimplification = [];//构造连线数组用来判断pipeline中是否存在闭环
        var legalFlags = {};
        var newPipelineObj = {};
        var activityName = [];
        var canvasMsgs = [];

        this.getCanvasMsgs = function() {
            return canvasMsgs;
        }

        this.pushCanvasMsg = function(msg) {
            canvasMsgs.push(msg);
        }

        this.emptyCanvasMsgs = function() {
            canvasMsgs.splice(0, canvasMsgs.length);
        }

        this.getLegalFlags = function () {
            return legalFlags;
        };

        this.setLegalFlags = function (newSetLegalFlags) {
            legalFlags = newSetLegalFlags;
        };

        this.processors = function () {
            return processors;
        };

        this.setProcessors = function (newProcessors) {
            processors = [];
            for (var i = 0; i < newProcessors.length; i++) {
                processors[i] = $.extend(true, {}, newProcessors[i]);
            }
        };

        this.getConnections = function () {
            return connections;
        };

        this.setConnections = function (newConnections) {
            connections = [];
            for (var i = 0; i < newConnections.length; i++) {
                connections[i] = $.extend(true, {}, newConnections[i]);
            }
        };

        this.getActivityArrayLength = function () {
            return activityArray;
        };

        this.setActivityArray = function (newActivityArray) {
            activityArray = newActivityArray || [];
        };

        //将processAraay和connections转换成activity
        this.getActivityArray = function () {
            activityArray = [];
            var isTrue = true;
            if (processors.length == 1) {
                if (processors[0].processorType == "DATANODE") {
                    isTrue = false;
                    return {
                        "status": 1,
                        "content": {}
                    };//一个数据源不能提交
                } else {
                    if (processors[0].inputRequirement != "INPUT_FORBIDDEN" || processors[0].outputRequirement != "OUTPUT_FORBIDDEN") {
                        isTrue = false;//该activity不是输入禁止且输出禁止，不能提交
                        return {
                            "status": 2,
                            "content": {id:processors[0].id,name: processors[0].name}
                        };
                    }
                }
            } else {
                //检查有没有孤立的点
                for (var i = 0; i < processors.length; i++) {
                    var isIsolated = true;
                    for (var j = 0; j < connections.length; j++) {
                        if (processors[i].id === connections[j].source.id || processors[i].id === connections[j].destination.id) {
                            isIsolated = false;
                            break;
                        }
                    }

                    var checkedArray = [];
                    var uncheckedArray = [];
                    if (connections.length > 0) {
                        uncheckedArray.push(connections[0].destination.id);
                        uncheckedArray.push(connections[0].source.id);
                    }

                    while (uncheckedArray.length > 0) {
                        for (var h = 0; h < connections.length; h++) {
                            if (uncheckedArray[0] == connections[h].source.id && notInclude(checkedArray, connections[h].destination.id)
                                && notInclude(uncheckedArray, connections[h].destination.id)) {
                                uncheckedArray.push(connections[h].destination.id);
                            }

                            if (uncheckedArray[0] == connections[h].destination.id && notInclude(checkedArray, connections[h].source.id)
                                && notInclude(uncheckedArray, connections[h].source.id)) {
                                uncheckedArray.push(connections[h].source.id);
                            }
                        }
                        checkedArray.push(uncheckedArray[0]);
                        uncheckedArray.shift();
                    }

                    if (checkedArray.length < processors.length) {
                        isIsolated = true;
                    }

                    if (isIsolated) {
                        isTrue = false;
                        return {
                            "status": 3,
                            "content": {}
                        };//存在孤立的点
                    }
                }

                //在有向图中检查是否存在环
                /*
                 * 在项目中判断有向图中是否存在闭环，代码执行到此处已经排除了pipeline为空或者为一个节点的情况，
                 * 所以在此判断有向图就是判断连同有向图中是否存在闭环。
                 *实现实录具体是根据负责页面渲染的processors数组，构造用来简单processor节点数组processorsDegree，该数组中包含的对象有id，inDegree(入度)，
                 * outDegree(出度)三个属性，根据connections数组构造连线数组connectionsSimplification，该数组中包含的对象有id,sourceId,targetId三个属性。
                 * 算法思路主要如下：
                 * 拓扑排序算法主要是循环执行以下两步，直到不存在入度为0的顶点为止。
                 (1) 选择一个入度为0的顶点并输出之；
                 (2) 从网中删除此顶点及所有出边。
                 循环结束后，若输出的顶点数小于网中的顶点数，则输出“有回路”信息，否则输出的顶点序列就是一种拓扑序列。
                 具体请看“拓扑排序”的百度百科。
                 程序中，最后是根据processorsDegree的长度来判断有没有环，如果长度不为零，在pipeline中则存在闭环。
                 * */
                processorsDegree = [];//构造节点数组用来判断pipeline中是否存在闭环
                connectionsSimplification = [];//构造连线数组用来判断pipeline中是否存在闭环
                for (var i = 0; i < processors.length; i++) {
                    var pro = {};
                    pro["id"] = processors[i].id;
                    pro["inDegree"] = 0;
                    pro["outDegree"] = 0;
                    processorsDegree.push($.extend(true, {}, pro));
                }
                for (var i = 0; i < connections.length; i++) {
                    var connectionSimplification = {};
                    connectionSimplification.id = connections[i].id;
                    connectionSimplification.sourceId = connections[i].source.id;
                    connectionSimplification.targetId = connections[i].destination.id;
                    connectionsSimplification.push($.extend(true, {}, connectionSimplification));

                    for (var j = 0; j < processorsDegree.length; j++) {
                        if (processorsDegree[j].id == connections[i].source.id) {
                            processorsDegree[j].outDegree = processorsDegree[j].outDegree + 1;
                        } else if (processorsDegree[j].id == connections[i].destination.id) {
                            processorsDegree[j].inDegree = processorsDegree[j].inDegree + 1;
                        }
                    }
                }
                var isErgodic = true;
                while (processorsDegree.length > 0 && isErgodic) {
                    isErgodic = false;
                    var indexArr = [];
                    var indexArrConnections = [];
                    for (var i = 0; i < processorsDegree.length; i++) {
                        if (processorsDegree[i].inDegree == 0) {
                            isErgodic = true;
                            for (var j = 0; j < connectionsSimplification.length; j++) {
                                if (connectionsSimplification[j].sourceId == processorsDegree[i].id) {
                                    indexArrConnections.push($.extend(true, {}, connectionsSimplification[j]));
                                }

                                if (connectionsSimplification[j].targetId == processorsDegree[i].id) {
                                    indexArrConnections.push($.extend(true, {}, connectionsSimplification[j]));
                                }
                            }
                            for (var k = 0; k < indexArrConnections.length; k++) {
                                for (var p = 0; p < connectionsSimplification.length; p++) {
                                    if (connectionsSimplification[p].id == indexArrConnections[k].id) {
                                        connectionsSimplification.splice(p, 1);
                                    }
                                }
                            }
                            indexArr.push($.extend(true, {}, processorsDegree[i]));
                        }
                        if (processorsDegree.length > 0) {
                            processorsDegree[i].outDegree = 0;
                            processorsDegree[i].inDegree = 0;
                        }
                    }
                    for (var i = 0; i < indexArr.length; i++) {
                        for (var k = 0; k < processorsDegree.length; k++) {
                            if (indexArr[i].id == processorsDegree[k].id) {
                                processorsDegree.splice(k, 1);
                            }
                        }
                    }

                    for (var i = 0; i < connectionsSimplification.length; i++) {
                        for (var j = 0; j < processorsDegree.length; j++) {
                            if (processorsDegree[j].id == connectionsSimplification[i].sourceId) {
                                processorsDegree[j].outDegree = processorsDegree[j].outDegree + 1;
                            } else if (processorsDegree[j].id == connectionsSimplification[i].targetId) {
                                processorsDegree[j].inDegree = processorsDegree[j].inDegree + 1;
                            }
                        }
                    }
                }
            }

            if (processorsDegree.length > 0) {
                return {
                    "status": 9,
                    "content": {}
                };//判断连线中是否存在闭环
            }

            var j = 0;
            for (var i = 0; i < processors.length; i++) {
                for (var key in legalFlags) {
                    if (key == processors[i].id && legalFlags[key] == false) {
                        return {
                            "status": 10,
                            "content": {name: processors[i].name, id:processors[i].id}
                        };//submit前验证
                    }
                }
                //保留后台需要的字段
                var processor = {};
                var keys = ['id', 'uri', 'parentGroupId', 'name', 'type', 'processorType', 'state', 'supportsParallelProcessing',
                    'supportsEventDriven', 'supportsBatching', 'persistsState', 'inputRequirement', 'outputRequirement',
                    'inPutType', 'outPutType', 'computeResource'];


                for (var n = 0; n < keys.length; n++) {
                    if (processors[i].hasOwnProperty(keys[n])) {
                        processor[keys[n]] = processors[i][keys[n]];
                    }
                }
                /*if(processors[i].hasOwnProperty('dependencies')){
                    processor.dependencies = processors[i].dependencies;
                }*/

                if (processors[i].hasOwnProperty('position')) {
                    processor.position = {};
                    processor.position.x = processors[i].position.x;
                    processor.position.y = processors[i].position.y;
                }

                if (processors[i].hasOwnProperty('style')) {
                    processor.style = $.extend(true, {}, processors[i].style);
                }

                if (processors[i].hasOwnProperty('relationships')) {
                    processor.relationships = [];
                    for (var n = 0; n < processors[i].relationships.length; n++) {
                        processor.relationships[n] = {};
                        for (var key in processors[i].relationships[n]) {
                            processor.relationships[n][key] = processors[i].relationships[n][key];
                        }
                    }
                }

                if (processors[i].hasOwnProperty('config')) {
                    processor.config = {};
                    //config属性中后台需要的字段。
                    var keyConfig = ['schedulingPeriod', 'schedulingStrategy', 'penaltyDuration', 'yieldDuration',
                        'bulletinLevel', 'runDurationMillis', 'concurrentlySchedulableTaskCount',
                        'comments', 'lossTolerant'];
                    for (var n = 0; n <= keyConfig.length; n++) {
                        if (processors[i].config.hasOwnProperty(keyConfig[n])) {
                            processor.config[keyConfig[n]] = processors[i].config[keyConfig[n]];
                        }
                    }

                    if (processors[i].config.hasOwnProperty('properties')) {
                        processor.config.properties = $.extend(true, {}, processors[i].config.properties);
                    }

                    if (processors[i].config.hasOwnProperty('descriptors')) {
                        processor.config.descriptors = $.extend(true, {}, processors[i].config.descriptors);
                    }

                    if (processors[i].config.hasOwnProperty('defaultConcurrentTasks')) {
                        processor.config.defaultConcurrentTasks = $.extend(true, {}, processors[i].config.defaultConcurrentTasks);
                    }

                    if (processors[i].config.hasOwnProperty('defaultSchedulingPeriod')) {
                        processor.config.defaultSchedulingPeriod = $.extend(true, {}, processors[i].config.defaultSchedulingPeriod);
                    }

                    if (processors[i].config.hasOwnProperty('RUN_ONCE_SCHEDULE')) {
                        processor.config.defaultSchedulingPeriod = processors[i].config.RUN_ONCE_SCHEDULE;
                    }
                }

                if (processors[i].hasOwnProperty('validationErrors')) {
                    processor.validationErrors = [];
                    for (var n = 0; n < processors[i].validationErrors.length; n++) {
                        processor.validationErrors[n] = processors[i].validationErrors[n];
                    }
                }

                processors[i] = $.extend(true, {}, processor);
                //生成activity的数组
                if (processors[i].processorType != 'DATANODE') {
                    activityArray[j] = processors[i];
                    activityArray[j].inputDataNode = [];
                    activityArray[j].outputDataNode = [];
                    activityArray[j].uiDependencies = [];
                    activityArray[j].dependencies = [];
                    j++;
                }
            }
            for (var i = 0; i < connections.length; i++) {
                if (getProcessByID(connections[i].source.id).processorType != 'DATANODE' && getProcessByID(connections[i].destination.id).processorType == 'DATANODE') {
                    for (var m = 0; m < activityArray.length; m++) {
                        if (activityArray[m].id == connections[i].source.id) {
                            activityArray[m].outputDataNode.push(getProcessByID(connections[i].destination.id));
                        }
                    }
                }

                if (getProcessByID(connections[i].destination.id).processorType != 'DATANODE' && getProcessByID(connections[i].source.id).processorType == 'DATANODE') {
                    for (var m = 0; m < activityArray.length; m++) {
                        if (activityArray[m].id == connections[i].destination.id) {
                            activityArray[m].inputDataNode.push(getProcessByID(connections[i].source.id));
                        }
                    }
                }

                if (getProcessByID(connections[i].destination.id).processorType != 'DATANODE' && getProcessByID(connections[i].source.id).processorType != 'DATANODE') {
                    for (var m = 0; m < activityArray.length; m++) {
                        if (activityArray[m].id == connections[i].destination.id) {
                            activityArray[m].uiDependencies.push(connections[i].source.id);
                        }
                    }
                }
            }

            var statusObj = {};

            activityArray.map(function (key) {

                if (!key.computeResource[0]) {
                    statusObj = {
                        "status": 8,
                        "content": {
                            "id": key.id,
                            "name": key.name
                        }
                    };
                    return false;//没有配置计算资源
                }

                if (key.inputRequirement === "INPUT_FORBIDDEN" && key.inputDataNode.length > 0) {
                    statusObj = {
                        "status": 4,
                        "content": {
                            "id": key.id,
                            "name": key.name
                        }
                    };
                    return false;
                }
                if ((key.inputRequirement === "INPUT_REQUIRED" || key.inputRequirement === "INPUT_ALLOWED") && key.inputDataNode.length === 0) {

                    statusObj = {
                        "status": 5,
                        "content": {
                            "id": key.id,
                            "name": key.name
                        }
                    };
                    return false;
                }

                if (key.outputRequirement === "OUTPUT_FORBIDDEN" && key.outputDataNode.length > 0) {
                    statusObj = {
                        "status": 6,
                        "content": {
                            "id": key.id,
                            "name": key.name
                        }
                    };
                    return false;
                }

                if ((key.outputRequirement === "OUTPUT_REQUIRED" || key.outputRequirement === "OUTPUT_ALLOWED") && key.outputDataNode.length === 0) {
                    statusObj = {
                        "status": 7,
                        "content": {
                            "id": key.id,
                            "name": key.name
                        }
                    };
                    return false;
                }
            });
            if (!$.isEmptyObject(statusObj)) {
                return statusObj;
            }

            return {
                "status": 200,
                "content": {}
            }

        };

        //提交activity
        this.submitPromise = function (pipelineId) {
            for (var i = 0; i < activityArray.length; i++) {
                activityArray[i].config.properties["Pipeline Name"] = $rootScope.editorPipelineName;
                for (var item in activityArray[i].config.properties) {
                    //防止重复编码
                   /* activityArray[i].config.isNeedEncode = activityArray[i].config.isNeedEncode?activityArray[i].config.isNeedEncode:false;*/
                    if (item.toLowerCase() === "query" || item.toLowerCase() === "query statement") {
                        if (activityArray[i].config.properties[item]) {
                            activityArray[i].config.properties[item] = $.base64.encode(activityArray[i].config.properties[item]);
                           /* activityArray[i].config.isNeedEncode = true;
                            $rootScope.isNeedEncode=true;*/
                        }
                    }
                }
                for(var j = 0; j < connections.length; j++){
                    if(activityArray[i].id == connections[j].destination.id){
                        if(connections[j].source.type === "LINK_ACTIVITY" || connections[j].source.type === "INVOKE_ACTIVITY" || connections[j].source.type === "PROCESS_ACTIVITY"){
                            activityArray[i].dependencies.push(connections[j].source.id);
                        }

                        if(connections[j].source.type === "DATANODE"){
                            for(var m = 0; m < connections.length; m++){
                                if(connections[m].destination.id === connections[j].source.id){
                                    activityArray[i].dependencies.push(connections[m].source.id);
                                }
                            }
                        }
                    }
                }
            }

            var groupID = commonService.getGroupID();
            var url = "rest/api/v1/datacraft/controller/pipeline/root/editPipeline";
			var oldparam = {"activities": activityArray};
            activityName = [];
            var param = this.parseJson(oldparam,pipelineId);
            param.schedule=$rootScope.schedule;

            var promise = camel.post({
                url: url,
                params: param,
                timeout: 12000
            });
            return promise;
        };
        this.parseJson = function(jsonData,pipelineId){
            newPipelineObj.pipelineId = pipelineId;
            newPipelineObj.pipelineObjects = [];
            for (var i = 0; i < jsonData.activities.length; i++) {
                this.formJsonObject(jsonData.activities[i]);
                var inputnodeLength = jsonData.activities[i].inputDataNode.length;
                var outputnodeLength = jsonData.activities[i].outputDataNode.length
                if(inputnodeLength > 0){
                    for(var input=0; input<inputnodeLength; input++){               
                        this.formJsonObject(jsonData.activities[i].inputDataNode[input]);
                    }
                }
                if(outputnodeLength > 0){   
                    for(var output=0; output<outputnodeLength; output++){                
                        this.formJsonObject(jsonData.activities[i].outputDataNode[output]);
                    }
                }
            }


            return newPipelineObj;
        }

        this.formJsonObject = function(data){
            var newPipelineFieldObj = [];
            if(activityName.indexOf(data.name)==-1){
                activityName.push(data.name);
                newPipelineFieldObj.push({'key':'type','stringValue':data.type},
                                       {'key':'processorType','stringValue':data.processorType},
                                       {'key':'x','stringValue':data.position.x},
                                       {'key':'y','stringValue':data.position.y}
                                       );
                var configParams = this.dynamicLoop(data.config.properties);
              
                newPipelineFieldObj = newPipelineFieldObj.concat(configParams);
				var inputDataNode = this.nodeData(data,'inputDataNode');
                if(inputDataNode)
			 	newPipelineFieldObj = newPipelineFieldObj.concat(inputDataNode);
                
				
				var outputDataNode = this.nodeData(data,'outputDataNode');
                if(outputDataNode)
				newPipelineFieldObj = newPipelineFieldObj.concat(outputDataNode);

                if(data.processorType.toUpperCase() == 'INVOKE_ACTIVITY'){
                    for(var uidepend = 0;(uidepend<data.dependencies.length) && (data.dependencies.length>0) ;uidepend++){
                        newPipelineFieldObj.push({'key':'dependsOn','refValue':data.dependencies[uidepend]});
                    }
                }
				if(data.hasOwnProperty('computeResource')){
					for(var compRes=0;compRes<data.computeResource;compRes++){
						newPipelineFieldObj.push({'key':'computeResource','stringValue':data.computeResource[compRes]});
					}
				}
                newPipelineObj.pipelineObjects.push({'name': data.name,
                                                   'id' : data.id,
                                                   'fields': newPipelineFieldObj
                                                   });
            }                                      
            return newPipelineObj;
        }

        this.dynamicLoop = function(config){
            var dynamicJson = [];
            angular.forEach(config,function(value,key){
                dynamicJson.push({'key':key,'stringValue':value});
            });
            return dynamicJson;
        }
		
		this.nodeData = function(data,param){
			var nodeDataObj = [];
            var key;
			if(data.hasOwnProperty(param) && data[param].length>0){
				for(var dataNode=0;dataNode<data[param].length;dataNode++){
					key = param.substr(0, param.length - 8);
                    nodeDataObj.push({'key': key,'refValue':data[param][dataNode].id});
				}
				return nodeDataObj;
            }else{
                return false;
            }			
		}
        //根据activity构造可用来渲染的connection结构
        this.createConnection = function (activityArray) {
            var connectionI = [];
            var groupId = commonService.getGroupID();
            for (var i = 0; i < activityArray.length; i++) {
                if (activityArray[i].hasOwnProperty('inputDataNode')) {
                    var target = {};
                    packPressorToConnection(target, activityArray[i]);

                    for (var j = 0; j < activityArray[i].inputDataNode.length; j++) {
                        var source = {};
                        packPressorToConnection(source, activityArray[i].inputDataNode[j]);

                        var connection = {};
                        var connectionID = commonService.getUUID();
                        var uniqueFlag = false;
                        var keyV = 'id';
                        uniqueFlag = idIsunique(connections, connectionID, keyV);
                        while (!uniqueFlag) {
                            connectionID = commonService.getUUID();
                            uniqueFlag = idIsunique(connections, connectionID, keyV);
                        }

                        connection.id = connectionID;
                        var uri = '/nifi-api/controller/process-groups/' + groupId + '/connections/' + connectionID;
                        connection.uri = uri;
                        packConnection(connection);
                        connection.source = source;
                        connection.destination = target;
                        var conn = $.extend(true, {}, connection);
                        connectionI.push(conn);
                    }
                }

                if (activityArray[i].hasOwnProperty('outputDataNode')) {
                    var source = {};
                    packPressorToConnection(source, activityArray[i]);

                    for (var j = 0; j < activityArray[i].outputDataNode.length; j++) {
                        var target = {};
                        packPressorToConnection(target, activityArray[i].outputDataNode[j]);

                        var connection = {};
                        var connectionID = commonService.getUUID();
                        var uniqueFlag = false;
                        var keyV = 'id';
                        uniqueFlag = idIsunique(connections, connectionID, keyV);
                        while (!uniqueFlag) {
                            connectionID = commonService.getUUID();
                            uniqueFlag = idIsunique(connections, connectionID, keyV);
                        }

                        connection.id = connectionID;
                        var uri = '/nifi-api/controller/process-groups/' + groupId + '/connections/' + connectionID;
                        connection.uri = uri;
                        packConnection(connection);
                        connection.source = source;
                        connection.destination = target;

                        var conn = $.extend(true, {}, connection);
                        connectionI.push(conn);
                    }
                }

                if (activityArray[i].hasOwnProperty('uiDependencies')) {

                    var target = {};
                    packPressorToConnection(target, activityArray[i]);

                    for (var j = 0; j < activityArray[i].uiDependencies.length; j++) {
                        var activityID = activityArray[i].uiDependencies[j];
                        var activityTemp = {};
                        for (var m = 0; m < activityArray.length; m++) {
                            if (activityID == activityArray[m].id) {
                                activityTemp = activityArray[m];
                                break;
                            }
                        }
                        var source = {};
                        packPressorToConnection(source, activityTemp);

                        var connection = {};
                        var connectionID = commonService.getUUID();
                        var uniqueFlag = false;
                        var keyV = 'id';
                        uniqueFlag = idIsunique(connections, connectionID, keyV);
                        while (!uniqueFlag) {
                            connectionID = commonService.getUUID();
                            uniqueFlag = idIsunique(connections, connectionID, keyV);
                        }

                        connection.id = connectionID;
                        var uri = '/nifi-api/controller/process-groups/' + groupId + '/connections/' + connectionID;
                        connection.uri = uri;
                        packConnection(connection);
                        connection.source = source;
                        connection.destination = target;

                        var conn = $.extend(true, {}, connection);
                        connectionI.push(conn);
                    }
                }
            }
            return connectionI;
        };


        //根据activity构造可用来渲染的processArray结构
        this.createProcessArray = function (activityArray) {
            var processArrayI = [];
            var status = {
                "runStatus": "Invalid",
                "read": "0 bytes",
                "written": "0 bytes",
                "input": "0/0 bytes",
                "output": "0/0 bytes",
                "tasks": "0",
                "tasksDuration": "00:00:00.000"
            };

            for (var i = 0; i < activityArray.length; i++) {
                if (!idIsExist(processArrayI, activityArray[i].id)) {
                    var newProcess = $.extend(false, activityArray[i], status);
                    processArrayI.push($.extend(false, {}, newProcess));

                    //从输入源中得到process
                    if (activityArray[i].hasOwnProperty('inputDataNode')) {
                        for (var j = 0; j < activityArray[i].inputDataNode.length; j++) {
                            if (!idIsExist(processArrayI, activityArray[i].inputDataNode[j].id)) {
                                var newProcess = $.extend(false, activityArray[i].inputDataNode[j], status);
                                processArrayI.push($.extend(true, {}, newProcess));
                            }
                        }
                    }

                    //从输出源中得到process
                    if (activityArray[i].hasOwnProperty('outputDataNode')) {
                        for (var j = 0; j < activityArray[i].outputDataNode.length; j++) {
                            if (!idIsExist(processArrayI, activityArray[i].outputDataNode[j].id)) {
                                var newProcess = $.extend(false, activityArray[i].outputDataNode[j], status);
                                processArrayI.push($.extend(true, {}, newProcess));
                            }
                        }
                    }
                }
            }
            for(var i = 0; i < processArrayI.length; i++){
                if(processArrayI[i].hasOwnProperty('config') && processArrayI[i].config.properties.hasOwnProperty("Query")){
                    processArrayI[i].config.properties["Query"] = $.base64.decode(processArrayI[i].config.properties["Query"]);
                }else if(processArrayI[i].hasOwnProperty('config') && processArrayI[i].config.properties.hasOwnProperty("Query Statement")){
                    processArrayI[i].config.properties["Query Statement"] = $.base64.decode(processArrayI[i].config.properties["Query Statement"]);
                }
            }

            /*if (processArrayI.config.properties !== undefined) {
                for (var item in processArrayI.config.properties) {
                    if (item.toLowerCase() === "query" || item.toLowerCase() === "query statement") {
                        if (processArrayI.config.properties[item]) {
                            processArrayI.config.properties[item] = $.base64.decode(processArrayI.config.properties[item]);
                        }
                    }
                }
            }*/

            return processArrayI;
        }

        //给connection打包
        function packConnection(connection) {
            connection.parentGroupId = commonService.getGroupID();
            connection.name = "new Name";
            connection.labelIndex = 1;
            connection.zIndex = 0;
            connection.backPressureObjectThreshold = 0;
            connection.backPressureDataSizeThreshold = "0MB";
            connection.prioritizers = [];
            connection.bends = [];
            connection.selectedRelationships = ["Success"];
            connection.availableRelationships = ["success", "Failure"];
        }

        function packPressorToConnection(obj, prossesor) {
            obj.id = prossesor.id;
            obj.type = prossesor.processorType;
            obj.groupId = prossesor.groupId;
            obj.name = prossesor.name;
            obj.running = false;
        }

        //判断processor是否已经被保存
        function idIsExist(array, id) {
            var isExist = false;
            for (var i = 0; i < array.length; i++) {
                if (id == array[i].id) {
                    isExist = true;
                    break;
                }
            }
            return isExist;
        }

        //判断id是否唯一，如果唯一返回true，否则返回false
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

        //判断数组中是否存在某值
        function notInclude(checkedArray, id) {
            var notInclude = true;
            for (var i = 0; i < checkedArray.length; i++) {
                if (checkedArray[i] == id) {
                    notInclude = false;
                    break;
                }
            }
            return notInclude;
        }

        //根据id取得processor
        function getProcessByID(id) {
            for (var i = 0; i < processors.length; i++) {
                if (processors[i].id == id) {
                    return $.extend(true, {}, processors[i]);
                }
            }
            return;
        }
    };

    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyService('activityManager', activityManager);
});