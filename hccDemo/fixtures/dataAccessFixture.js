/**
 * Created by z00306395 on 2016/3/11.
 */
define(["can/util/fixture/fixture", "tiny-lib/underscore"], function (fixture, _) {
    var instanceList = [{
        "streamId": "01",
        streamName: "instance01",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "运行中"
    }, {
        "streamId": "02",
        streamName: "instance02",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "创建中"
    }, {
        "streamId": "03",
        streamName: "instance03",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "删除中"
    }, {
        "streamId": "04",
        streamName: "instance04",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "运行中"
    }, {
        "streamId": "05",
        streamName: "instance05",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "已删除"
    },  {
        "streamId": "06",
        streamName: "instance06",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "运行中"
    }, {
        "streamId": "07",
        streamName: "instance07",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "运行中"
    }, {
        "streamId": "08",
        streamName: "instance08",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "运行中"
    }, {
        "streamId": "09",
        name: "instance09",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "运行中"
    }, {
        "streamId": "10",
        streamName: "instance10",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "运行中"
    }, {
        "streamId": "11",
        name: "instance11",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "运行中"
    }, {
        "streamId": "12",
        streamName: "instance12",
        createAt: "2016/03/02",
        throughput: "10M",
        state: "运行中"
    }];
    var alarmList = [{
        "status": "Critical",
        "serviceName": "Service_001",
        "output": "后台服务中断",
        "lastStatusTime": "2013-12-04 22:49:40 UTC+06:00"
    }, {
        "status": "Critical",
        "serviceName": "Service_001",
        "output": "正在转接中",
        "lastStatusTime": "2016-05-04 20:49:40 UTC+07:00"
    }, {
        "status": "Warning",
        "serviceName": "Service_001",
        "output": "正在转接中",
        "lastStatusTime": "2016-06-04 18:49:40 UTC+08:00"
    }, {
        "status": "Warning",
        "serviceName": "Service_001",
        "output": "后台服务中断",
        "lastStatusTime": "2016-05-04 19:49:40 UTC+05:00"
    }, {
        "status": "Critical",
        "serviceName": "Service_001",
        "output": "网络不可用",
        "lastStatusTime": "2016-05-04 12:49:40 UTC+02:00"
    }];
    
    var monitorList=[{
    	"ID":"01",
    	"Name":"monitor one",
    	"Status":"running",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    },{
    	"ID":"02",
    	"Name":"monitor two",
    	"Status":"running",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    },{
    	"ID":"03",
    	"Name":"monitor three",
    	"Status":"stoped",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    },{
    	"ID":"04",
    	"Name":"monitor xxx",
    	"Status":"stoped",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    },{
    	"ID":"05",
    	"Name":"monitor xyz",
    	"Status":"stoped",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    },{
    	"ID":"06",
    	"Name":"monitor ggg",
    	"Status":"stoped",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    },{
    	"ID":"07",
    	"Name":"monitor three",
    	"Status":"stoped",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    },{
    	"ID":"08",
    	"Name":"monitor three",
    	"Status":"stoped",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    },{
    	"ID":"09",
    	"Name":"monitor three",
    	"Status":"stoped",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    },{
    	"ID":"10",
    	"Name":"monitor three",
    	"Status":"stoped",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    },{
    	"ID":"11",
    	"Name":"monitor three",
    	"Status":"stoped",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    },{
    	"ID":"12",
    	"Name":"monitor three",
    	"Status":"stoped",
    	"Creation Time":"2016/06/13",
    	"Last Run Duration":"10 min",
    	"Last Success":"2016/06/13",
    	"Last Error":"2016/06/13"
    }];

    var operationLogs = [{
    	"operationType" : "Cluster",
    	"user" : "admin",
    	"operationDescription" : "operationDescription",
    	"time" : "2016/6/13 12:15:01"
    },{
    	"operationType" : "Cluster",
    	"user" : "admin",
    	"operationDescription" : "operationDescription",
    	"time" : "2016/6/13 14:15:01"
	},{
		"operationType" : "Cluster",
		"user" : "admin",
		"operationDescription" : "operationDescription",
		"time" : "2016/6/13 16:15:01"
	},{
		"operationType" : "Config",
		"user" : "admin",
		"operationDescription" : "operationDescription",
		"time" : "2016/6/14 12:15:01"
	},{
		"operationType" : "Config",
		"user" : "admin",
		"operationDescription" : "operationDescription",
		"time" : "2016/6/14 13:15:01"
	},{
		"operationType" : "Config",
		"user" : "admin",
		"operationDescription" : "operationDescription",
		"time" : "2016/6/14 15:15:01"
	},{
		"operationType" : "Log",
		"user" : "admin",
		"operationDescription" : "operationDescription",
		"time" : "2016/6/14 16:15:01"
	},{
		"operationType" : "Log",
		"user" : "admin",
		"operationDescription" : "operationDescription",
		"time" : "2016/6/15 10:15:01"
	},{
		"operationType" : "Log",
		"user" : "admin",
		"operationDescription" : "operationDescription",
		"time" : "2016/6/15 11:15:01"
	},{
		"operationType" : "Log",
		"user" : "admin",
		"operationDescription" : "operationDescription",
		"time" : "2016/6/15 12:15:01"
	}];
    
    var overViewData={
    		"total":100,
    		"running":25,
    		"stop":75
    };
    
    /*fixture({
        //查询资源池列表
        "GET /rest/api/v1/stream/streams": function (original, response) {
            var requestParams = original.data;
            var requestNum=requestParams.requestNum;
            var startIndex=(requestParams.pageIndex-1)*requestNum;
            var endIndex=startIndex+requestNum;
            var resultArray=instanceList.slice(startIndex, endIndex);
            var result = {
                "totalNum": instanceList.length,
                "data": resultArray
            };
            if (window.urlParams['lang'] === 'en-us') {
                response(200, "success", result, {});
            } else {
                response(200, "success", result, {});
            }
        },
        "GET rest/api/v1/datacraft/pipelines/alarm": function (original, response){
            var result = {
                    "data": alarmList
                };
            if (window.urlParams['lang'] === 'en-us') {
                response(200, "success", result , {});
            } else {
                response(200, "success", result, {});
            }


        },
        "POST /rest/api/v1/stream/deleteStream": function (original, response) {
            var requestParams = JSON.parse(original.data);
            for(var i=0; i< instanceList.length; i++){
                if(requestParams.streamId==instanceList[i].streamId){
                    instanceList[i].state="删除中";
                    setTimeout((function(index){return function(){ instanceList[index].state="已删除";}})(i),10000);
                    break;
                }
            }
            if (window.urlParams['lang'] === 'en-us') {
                response(200, "success", instanceList, {});
            } else {
                response(200, "success", instanceList, {});
            }
        },
    "POST /rest/api/v1/stream/insertStream": function (original, response) {
        var requestParams = JSON.parse(original.data);
        requestParams.streamId=instanceList.length;
        requestParams.createAt=new Date();
        requestParams.state="创建中";
        instanceList.splice(0,0,requestParams);
        setTimeout(function(){ instanceList[0].state="运行中";},10000);
        if (window.urlParams['lang'] === 'en-us') {
            response(200, "success", instanceList, {});
        } else {
            response(200, "success", instanceList, {});
        }
    },
    //获取monitor列表
    "GET rest/api/v1/datacraft/pipelines/monitor": function (original, response) {
        var requestParams = original.data;
        var requestNum=requestParams.pageTotal;
        var startIndex=(requestParams.pageIndex-1)*requestNum;
        var endIndex=startIndex+requestNum;
        var searchString = requestParams.pipelineName;
        var newArray=[];
        
        if(searchString){
        	for(var i=0;i<monitorList.length;i++){
        		var name=monitorList[i].Name;
        		if(name&&name.indexOf(searchString)!=-1){
        			newArray.push(monitorList[i]);
        		}
        	}
        }
        
        var monitorListLength=monitorList.length;
        
        if(newArray.length>0){
        	monitorListLength=newArray.length;
        	var resultArray=newArray.slice(startIndex, endIndex);
        }else{
        	var resultArray=monitorList.slice(startIndex, endIndex);
        }
        
        var result = {
            "totalNum": monitorListLength,
            "data": resultArray
        };
        if (window.urlParams['lang'] === 'en-us') {
            response(200, "success", result, {});
        } else {
            response(200, "success", result, {});
        }
    },
    
    //get operation logs list
    "GET rest/api/v1/datacraft/pipelines/operationLogs": function (original, response) {
    	var result = {
                "data": operationLogs
            };
            if (window.urlParams['lang'] === 'en-us') {
                response(200, "success", result, {});
            } else {
                response(200, "success", result, {});
            }
    	response(200, "success", result, {});
    },
    //获取overView数据
    "GET rest/api/v1/datacraft/pipelines/status": function (original, response) {
    	
        var result = overViewData;
        
        if (window.urlParams['lang'] === 'en-us') {
            response(200, "success", result, {});
        } else {
            response(200, "success", result, {});
        }
    }
    
    });*/

    return fixture;
});