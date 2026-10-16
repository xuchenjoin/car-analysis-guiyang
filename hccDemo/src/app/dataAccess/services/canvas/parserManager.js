define(["language/dataAccess"], function (keyID) {
    "use strict";
    var parserManager = function (camel, commonService,processManager) {
        var nifiResponse ;
        var activityDTO = {};
        var config;
        var invokeType = "INVOKE_ACTIVITY";
        var processType = "PROCESS_ACTIVITY";
        var dependsOn = "dependsOn";
        var computeRes = "computeResource";
        var refValue = "refValue";
        var stringValue = "stringValue";
        var propertyArray = ["type","x","state","y","processorType","dependsOn","output","input"];
        this.setParser = function(awsObj){
            nifiResponse = awsObj;
            parserProcessor(nifiResponse.pipelineObjects);
        };
        this.getParser = function(){
            return activityDTO;
        };
        this.setConfig = function(response){
            config = response;

        };
        this.getConfig = function(response){
            return config;
        };

        function parserProcessor(pipelineObjects){
            var activityDTO = [];
            for(var objs in pipelineObjects){
                for(var fields in pipelineObjects[objs]){
                    if(fields === "fields"){
                        for(var obj in pipelineObjects[objs][fields]){
                            for(var key in pipelineObjects[objs][fields][obj]){
                                var type = pipelineObjects[objs][fields][obj][key];
                                var counter = activityDTO.length;
                                if(type === invokeType || type === processType){
                                    var mainActivity = dpsObjectManupilation(pipelineObjects[objs]);
                                    activityDTO[counter] = mainActivity;
                                    var obj1 = pipelineObjects[objs][fields];
                                    for (var inputNodeObj in obj1){
                                        if(obj1[inputNodeObj]["key"] === "input"){
                                            var inputUID = obj1[inputNodeObj][refValue];
                                            for(var datanode in pipelineObjects){
                                                var id = pipelineObjects[datanode]["id"];
                                                if(id === inputUID){
                                                    var inputDatanode = dpsObjectManupilation(pipelineObjects[datanode]);
                                                    activityDTO[counter].inputDataNode = [inputDatanode];
                                                }
                                            }
                                        }else if(obj1[inputNodeObj]["key"] === "output"){
                                            var outputUID = obj1[inputNodeObj][refValue];
                                            for(var datanode1 in pipelineObjects){
                                                var id1 = pipelineObjects[datanode1]["id"];
                                                if(id1 === outputUID){
                                                    var outputDatanode = dpsObjectManupilation(pipelineObjects[datanode1]);
                                                    activityDTO[counter].outputDataNode = [outputDatanode];
                                                }
                                            }
                                        }else if(obj1[inputNodeObj]["key"] === "resource"){
                                            var resourceID = obj1[inputNodeObj][refValue];
                                            angular.forEach(pipelineObjects,function(key,value){
                                                var clusterID = pipelineObjects[value]["id"];
                                                if(resourceID === clusterID){
                                                    angular.forEach(pipelineObjects[value]["fields"],function(key,value1){
                                                        angular.forEach(pipelineObjects[value]["fields"][value1],function(key,value2){
                                                            if(key === "cluster_id"){
                                                                activityDTO[counter]["config"]["properties"]["MR ClusterName"] = pipelineObjects[value]["fields"][value1]["stringValue"];
                                                            }
                                                        })
                                                    });
                                                }
                                            })

                                            console.log(activityDTO[counter]);
                                        }
                                    }

                                }else if(type === dependsOn){
                                    var refID = pipelineObjects[objs][fields][obj][refValue];
                                    if(!activityDTO[counter-1].hasOwnProperty('dependencies')){
                                        activityDTO[counter-1].dependencies = [refID];
                                        activityDTO[counter-1].uiDependencies = [refID];
                                    }else{
                                        activityDTO[counter-1].dependencies.push(refID);
                                        activityDTO[counter-1].uiDependencies.push(refID);
                                    }


                                }else if(type === computeRes){
                                    var computeValue = pipelineObjects[objs][fields][obj][stringValue];
                                    if(activityDTO[counter-1].hasOwnProperty(computeRes)){
                                        activityDTO[counter-1].computeResource.push(computeValue);

                                    }else
                                    {
                                        activityDTO[counter-1].computeResource = [];
                                        activityDTO[counter-1].computeResource.push(computeValue);
                                    }
                                }else{
                                    if(activityDTO.length > 0){
                                        if(activityDTO[counter-1].hasOwnProperty(computeRes)){

                                        }else
                                        {
                                            activityDTO[counter-1].computeResource = ["EBD"];
                                        }
                                    }

                                }

                            }
                        }
                    }
                }
            }
            var finalDTO = descriptionMapping(activityDTO);
            _.forEach(finalDTO, function (element) {
                _.forEach(Object.keys(element.config.properties), function (val) {
                    if(element.config.properties[val] === undefined) {
                    	element.config.properties[val] = null;
                    }
                });
            });
            activityObj(finalDTO);
        }

        function activityObj(invokeActivity,type,obj){
            var activities = invokeActivity;
            activityDTO.activities = activities;
            return activityDTO;
        }

        function dpsObjectManupilation(obj){
            var dpsInputNode = obj;
            var indataNode = {};
            for(var obj1 in dpsInputNode){
                if(obj1 === "id"){
                    indataNode.id = dpsInputNode[obj1];
                }else if(obj1 === "name"){
                    indataNode.name = dpsInputNode[obj1];
                }else if(obj1 === "fields"){
                    for(var fieldsObj in dpsInputNode[obj1]){
                        for(var keyString in dpsInputNode[obj1][fieldsObj]){
                            var name = dpsInputNode[obj1][fieldsObj][keyString];
                            if(name === "type"){
                                indataNode.type = dpsInputNode[obj1][fieldsObj][stringValue];
                            }
                            else if(name === "processorType"){
                                indataNode.processorType = dpsInputNode[obj1][fieldsObj][stringValue];
                            }else if(name === "x"){
                                indataNode.position = {};
                                indataNode.position.x = parseInt(dpsInputNode[obj1][fieldsObj][stringValue],10);
                            }else if(name === "y"){
                                indataNode.position.y = parseInt(dpsInputNode[obj1][fieldsObj][stringValue],10);
                            }else{
                                if(!indataNode.hasOwnProperty('config')){
                                    indataNode.config = {};
                                    indataNode.config.properties = {};
                                    var nameVal = dpsInputNode[obj1][fieldsObj]["key"];
                                    indataNode.config.properties[nameVal] = dpsInputNode[obj1][fieldsObj][stringValue];
                                }else{
                                    var nameVal1 = dpsInputNode[obj1][fieldsObj]["key"];
                                    indataNode.config.properties[nameVal1] = dpsInputNode[obj1][fieldsObj][stringValue];
                                }


                            }
                        }
                    }
                }

            }
            for(var delKey in indataNode.config.properties){
                if(propertyArray.indexOf(delKey) > -1 ){
                    delete indataNode.config.properties[delKey];
                }
            }
            return indataNode;
        }

        function descriptionMapping(activityDTO){
            var intype,indescriptionObj,outtype,outdescriptionObj;
            for(var objs in activityDTO){
                var type = activityDTO[objs]["type"];
                var descriptionObj = typepickup(type);
                activityDTO[objs]["config"].descriptors = descriptionObj.descriptionObj;
                activityDTO[objs].inPutType = descriptionObj["configDetails"]["inPutType"];
                activityDTO[objs].outPutType = descriptionObj["configDetails"]["outPutType"];
                activityDTO[objs].inputRequirement = descriptionObj["configDetails"]["inputRequirement"];
                activityDTO[objs].outputRequirement = descriptionObj["configDetails"]["outputRequirement"];

                for(var inkeys in activityDTO[objs]["inputDataNode"]){
                    intype = activityDTO[objs]["inputDataNode"][inkeys]["type"];
                    indescriptionObj = typepickup(intype);
                    activityDTO[objs]["inputDataNode"][inkeys]["config"].descriptors = indescriptionObj.descriptionObj;
                    activityDTO[objs]["inputDataNode"][inkeys].inPutType = indescriptionObj["configDetails"]["inPutType"];
                    activityDTO[objs]["inputDataNode"][inkeys].outPutType = indescriptionObj["configDetails"]["outPutType"];
                    activityDTO[objs]["inputDataNode"][inkeys].inputRequirement = indescriptionObj["configDetails"]["inputRequirement"];
                    activityDTO[objs]["inputDataNode"][inkeys].outputRequirement = indescriptionObj["configDetails"]["outputRequirement"];

                }
                for(var outkeys in activityDTO[objs]["outputDataNode"]){
                    outtype = activityDTO[objs]["outputDataNode"][outkeys]["type"];
                    outdescriptionObj = typepickup(outtype);
                    activityDTO[objs]["outputDataNode"][outkeys]["config"].descriptors = outdescriptionObj.descriptionObj;
                    activityDTO[objs]["outputDataNode"][outkeys].inPutType = outdescriptionObj["configDetails"]["inPutType"];
                    activityDTO[objs]["outputDataNode"][outkeys].outPutType = outdescriptionObj["configDetails"]["outPutType"];
                    activityDTO[objs]["outputDataNode"][outkeys].inputRequirement = outdescriptionObj["configDetails"]["inputRequirement"];
                    activityDTO[objs]["outputDataNode"][outkeys].outputRequirement = outdescriptionObj["configDetails"]["outputRequirement"];

                }
            }
            activityDTO = propertyLoop(activityDTO);
            return activityDTO;
        }

        function typepickup(type){
            for (var objs in config){
                if(type === config[objs]["type"]){
                    var descriptionObj = config[objs]["config"]["descriptors"];
                    return {"descriptionObj":descriptionObj,"configDetails":config[objs]};
                }
            }
        }

        function propertyLoop(activityDTO){
            angular.forEach(activityDTO, function(obj){
                var plen = Object.keys(obj.config.properties).length;
                var dlen = Object.keys(obj.config.descriptors).length;
                if(plen !== dlen){
                    angular.forEach(obj.config.descriptors, function(name,value){
                        var propertyName = value;
                        var entryFlag = true;
                        angular.forEach(obj.config.properties, function(name,value){
                            if(propertyName === value){
                                entryFlag = false;

                            }
                        });
                        if(entryFlag){
                            obj.config.properties[propertyName] = null;
                        }
                    });
                    if(obj.hasOwnProperty("inputDataNode")){
                        angular.forEach(obj.inputDataNode, function(objs){
                            angular.forEach(objs.config.descriptors, function(name,value){
                                var propertyName = value;
                                var entryFlag = true;
                                angular.forEach(objs.config.properties, function(name,value){
                                    if(propertyName === value){
                                        entryFlag = false;

                                    }
                                });
                                if(entryFlag){
                                    objs.config.properties[propertyName] = null;
                                }
                            });
                        });
                    }
                    if(obj.hasOwnProperty("outputDataNode")){
                        angular.forEach(obj.outputDataNode, function(objs){
                            angular.forEach(objs.config.descriptors, function(name,value){
                                var propertyName = value;
                                var entryFlag = true;
                                angular.forEach(objs.config.properties, function(name,value){
                                    if(propertyName === value){
                                        entryFlag = false;

                                    }
                                });
                                if(entryFlag){
                                    objs.config.properties[propertyName] = null;
                                }
                            });
                        });
                    }
                }
            });
            return activityDTO;
        }

    };
    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyService('parserManager', parserManager);
});
