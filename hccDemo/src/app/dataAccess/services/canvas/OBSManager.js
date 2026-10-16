define(["language/dataAccess"],
function(keyID) {
	"use strict";
	var OBSManager = function(camel, commonService, storage) {
		var EBDWebRoot = "./";
		var OBSListUrl = EBDWebRoot + "rest/api/v1/datacraft/obs/buckets";
        var OBSDetailListUrl = EBDWebRoot + "rest/api/v1/datacraft/obs/listObjects";

		var obsPrefix = "s3a://";
		var currentPath = "";
		var currentBucketName = undefined;
		var currentDirectory = "";
		var folderList = [];
		var fileList = [];
        var pathType ;
        var folderInfo;


		/**
         * call this to get bucketList
         * @param bucketName
         * @param directory
         * @returns {*}
         */
		this.getBucketListPromise = function() {
			var url = OBSListUrl;
			var promise = camel.get({
				url: url,
				params: {},
				timeout: commonService.WAIT_TIME
			});
			return promise.then(function(response) {
				//currentPath = obsPrefix;
				currentBucketName = undefined;
				currentDirectory = "";
				fileList.splice(0, fileList.length);
				folderList.splice(0, folderList.length);
				for (var i = 0; i < response.length; i++) {
					var temp = response[i];
					var file = {
						name: temp.bucketName,
						directory: "",
						bucketName: temp.bucketName,
						isFolder:true//判断是否为文件夹
					};
					folderList.push(file);
				}
				return promise;
			},
			function(response) {
				console.log("fail to get OBSInfo");
				return promise;
			});
		};
		/**
         * use this to ask for file in s3n
         * @param bucketName
         * @param directory
         * @returns {*}
         */
		this.getS3nFileListPromise = function(bucketName, directory,marker, maxkeys) {
			var url = OBSDetailListUrl;
			if (bucketName) {
				url += "?bucketName="+encodeURIComponent(bucketName) ;
			}
			if (directory) {
				if (directory.indexOf("/") == 0) {
					directory = directory.substr(1);
				}
				url += "&prefix=" + encodeURIComponent(directory + "/");
			}/*else{
                url += "&prefix="+encodeURIComponent('');
            }*/
			var promise = camel.get({
				url: url,
				params: {
                    "maxkeys":maxkeys,
                    "marker":marker
                },
				timeout: commonService.WAIT_TIME
			});
			return promise.then(function(response) {
				currentBucketName = bucketName;
				currentPath = obsPrefix + currentBucketName + "/" + directory;
				currentDirectory = directory;
				folderList.splice(0, folderList.length);
				fileList.splice(0, fileList.length);
				var tempFolders = response[0].commonPrefixes;
				var tempFiles = response[0].objectSummaries;
                    if(tempFolders){
                        for (var i = 0; i < tempFolders.length; i++) {
                            var fDirectory = tempFolders[i].substr(0, tempFolders[i].length - 1);
                            var folderName = fDirectory;
                            if (fDirectory.lastIndexOf("/") >= 0) {
                                folderName = fDirectory.substr(fDirectory.lastIndexOf("/") + 1);
                            }
                            folderList.push({
                                name: folderName,
                                directory: fDirectory,
                                bucketName: bucketName,
                                isFolder:true//判断是否为文件夹
                            });
                        }
                    }

                    if(tempFiles){
                        for (var i = 0; i < tempFiles.length; i++) {
                            var tempFile = tempFiles[i];
                            tempFile.name = tempFile.objectKey.substr(tempFile.objectKey.lastIndexOf("/") + 1);
                            tempFile.isFolder = false;//判断是否为文件夹
                            if (tempFile && tempFile.name) {
                                fileList.push(tempFile);
                            }
                        }
                    }

				return promise;
			},
			function(response) {
				console.log("fail to get OBSInfo");
				return promise;
			});
		};

		this.getFolderList = function() {
			return [].concat(folderList);
		};
		this.getFileList = function() {
			return [].concat(fileList);
		};
		this.setCurrentBucketName = function(bucketName) {
			currentBucketName = bucketName;
		};
		this.getCurrentBucketName = function() {
			return currentBucketName;
		};
        this.setCurrentPath = function (newPath) {
            currentPath = newPath;
        };
		/*this.setCurrentPathBeFile = function(fileName) {
			if (currentDirectory) {
				currentPath = obsPrefix + currentBucketName + "/" + currentDirectory + "/" + fileName;
			} else {
				currentPath = obsPrefix + currentBucketName + "/" + fileName;
			}
		};*/
        this.setCurrentPathBeFile = function(fileName) {
            if(fileName){
                if (currentDirectory) {
                    currentPath = obsPrefix + currentBucketName + "/" + currentDirectory + "/" + fileName;
                } else {
                    currentPath = obsPrefix + currentBucketName + "/" + fileName;
                }
            }else{
                currentPath = obsPrefix;
            }

		};
		this.getCurrentPath = function() {
			return currentPath;
		};
		this.getCurrentDirectory = function() {
			return currentDirectory;
		};
        this.getPathType = function(){
            return storage.get("pathType")?storage.get("pathType"):pathType;
        }

        this.setPathType = function(type){
            pathType = type;
            storage.add("pathType",pathType)
        }

        this.setFolderInfo = function(_folderInfo){
            folderInfo =_folderInfo;
        };
        this.getFolderInfo = function(){
            return folderInfo;
        };
	};
	var dataCraftModule = angular.module('dataAccess.config');
	dataCraftModule.tinyService('OBSManager', OBSManager);
});