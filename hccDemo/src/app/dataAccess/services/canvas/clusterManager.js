
define(["language/dataAccess"], function (keyID) {
    "use strict";
    var clusterManager = function (camel,commonService,processManager,storage) {
        var EBDWebRoot="./";
        var CLUSTER_TYPE=1;
        var clusterListUrl=EBDWebRoot+"rest/api/v1/datacraft/getPipelineClusters";
        var hdfsListUrl=EBDWebRoot+"rest/api/v1/clusters";
        var clusterArray=[];
        var currentFolderUrl="";
        /*var HDFSRoot="/user/";
         var user="omm";
         var currentPath=HDFSRoot+user+"/";*/
        var currentPath = "/";
        var HDFSClusterID = "";
        var pathType;
        /**
         * call this function to get clusters list
         * @returns {Array.<T>}
         */
        this.getClusterArray = function () {
            return [].concat(clusterArray);
        };
        /**
         * call to get clusters
         * @returns {*}
         */
        this.getClusterArrayPromise = function () {
            var url = clusterListUrl;
            var promise = camel.get({
                url: url,
                timeout: commonService.WAIT_TIME
            });
            return promise.then(function (response) {
                response.clusters = typeof response.clusters === 'undefined' ? [] : response.clusters;
                if(response && response.clusters){
                    for(var i=0;i<response.clusters.length;i++){
                        if(response.clusters[i].clusterState=="running"||response.clusters[i].clusterState=="scaling-out"||response.clusters[i].clusterState=="scaling-in") {
                            clusterArray.push(response.clusters[i]);
                        }
                    }
                    return promise;
                }
            }, function (response) {
                console.log("fail to get clusters from EBD service");
                return promise;
            });
        };

        /**
         * call this function to get HDFS Info
         * @param clusterID
         * @param parentPath
         * @param folderName
         * @returns {*}
         */
        this.getHDFSPromise = function (parentPath, folderName, currentPage, pageSize, isTablePaging) {
            /*currentPath=HDFSRoot+user+"/";*/
            currentFolderUrl = "";
            var HDFSUrl = hdfsListUrl + "/" + HDFSClusterID + "/files";
            if(!isTablePaging) {
                if (parentPath) {
                    //HDFSUrl += parentPath;  //annotatioin by sunny
                    currentFolderUrl = parentPath;
                }
                if (folderName) {
                    //HDFSUrl += folderName;   //annotatioin by sunny
                    currentFolderUrl += folderName + "/";
                }
                if ((!parentPath) && (!folderName)) {
                    currentFolderUrl = "";
                }
            } else {
                //HDFSUrl += currentFolderUrl;   //annotatioin by sunny
            }
            /*if(!parentPath){
             currentPath = "/user/omm/"
             }
             if((currentFolderUrl.indexOf(HDFSRoot.substr(1))==-1) && (currentFolderUrl.indexOf(HDFSRoot.substr(1)+user+'/')==-1)){
             currentPath = "/user/omm/"+currentFolderUrl;
             }else if(currentFolderUrl.indexOf(HDFSRoot.substr(1))!=-1 || currentFolderUrl.indexOf(HDFSRoot.substr(1)+user+'/')!=-1){
             currentPath = '/'+currentFolderUrl;
             }*/

            //add by sunny
            var index,dirs = [],encodeDirectoryPath = "";
            dirs = currentFolderUrl.split("/");
            for(index in dirs){
                if ("" != dirs[index]) {
                    dirs[index] = encodeURIComponent(dirs[index]);
                    encodeDirectoryPath += "/" + dirs[index]
                }
            }
            HDFSUrl += encodeDirectoryPath;

            currentPath = '/' + currentFolderUrl;
            HDFSUrl += "?pageSize=" + pageSize + "&currentPage=" + currentPage + "&op=LIST";
            var promise = camel.get({
                url: HDFSUrl,
                params: {},
                timeout: commonService.WAIT_TIME
            });
            return promise.then(function (response) {
                return promise;
            }, function (response) {
                console.log("fail to get HDFSInfo");
                return promise;
            });
        };

        /**
         *
         * @returns {string}
         */
        this.getCurrentFolderUrl = function () {
            return currentFolderUrl;
        };
        this.getPathType = function () {
            return storage.get("pathType") ? storage.get("pathType") : pathType;
        };

        this.setPathType = function (pathTypeNew) {
            pathType = pathTypeNew;
            storage.add("pathType", pathTypeNew);
        }

        this.getUser = function () {
            return user;
        };

        this.getHDFSRoot = function () {
            return HDFSRoot;
        };
        this.setCurrentPath = function (newPath) {
            currentPath = newPath;
        };
        this.getCurrentPath = function () {
            return currentPath;
        };
        /**
         *
         * @param ID
         */
        this.setHDFSClusterID = function (ID) {
            HDFSClusterID = ID;
        };
    };

    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyService('clusterManager', clusterManager);
});