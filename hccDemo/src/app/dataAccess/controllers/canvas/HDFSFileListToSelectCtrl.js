define(['language/dataAccess'], function (i18n) {
    "use strict";
    var HDFSFileListToSelectCtrl = ["$rootScope", "$scope", "clusterManager", "$compile","commonService","$stateParams",
        function ($rootScope, $scope, clusterManager, $compile,commonService,$stateParams) {
            $scope.currentPath = clusterManager.getCurrentPath();
            $scope.currentFolderUrl = "";
            $scope.currentFolder = {};
            $scope.totalRecords = 0;
            $scope.currentPage = 1;
            $scope.pageSize = 9;
            $scope.defaultPath = "/"
            /*$scope.parentPath = "user";
            $scope.folderName = "/omm";*/
            $scope.fileType = 'DIRECTORY';
            var backToParent = {
                "pathSuffix": "..",
                "type": "DIRECTORY"
            };

            $scope.currentpathFlag = false;
            $scope.fetchingFolderData = false;

            //$("#HDFSFileListToSelectWindow").append(commonService.loading);
            var parentPath = "",folderName = "",tempHdfsPath = "";
            var currentHdfsPath = clusterManager.getCurrentPath();
            if(currentHdfsPath.length > 0){
                //currentHdfsPath is a path
                if(currentHdfsPath.substr(currentHdfsPath.length -1,1) == "/"){
                    tempHdfsPath = currentHdfsPath.substring(1,currentHdfsPath.length - 1);
                }else{
                    //currentHdfsPath is a file
                    tempHdfsPath = currentHdfsPath.substring(1,currentHdfsPath.lastIndexOf("/"));
                }
            }
            //var tempHdfsPath = currentHdfsPath.substring(1,currentHdfsPath.length - 1);
            if(tempHdfsPath.indexOf("/") == -1){
                folderName = tempHdfsPath;
            }else{
                var lastSplit = tempHdfsPath.lastIndexOf("/");
                parentPath = tempHdfsPath.substring(0,lastSplit);
                folderName = tempHdfsPath.substring(lastSplit + 1,tempHdfsPath.length);
            }
            if(parentPath == "" && folderName == ""){
                $("#HDFSFileListToSelectWindow").append(commonService.loading);
                clusterManager.getHDFSPromise(parentPath, folderName, $scope.currentPage, $scope.pageSize).then(function (response) {
                    //clusterManager.getHDFSPromise("", "", $scope.currentPage, $scope.pageSize).then(function (response) {
                    commonService.loading.remove();
                    $scope.currentFolder = response.FileStatuses.FileStatus;
                    $scope.currentFolderUrl = clusterManager.getCurrentFolderUrl();
                    $scope.HDFSFileList.data = response.FileStatuses.FileStatus;
                    $scope.HDFSFileList.data.unshift(backToParent);
                    $scope.HDFSFileList.totalRecords = response.total + Math.ceil(response.total / $scope.pageSize);
                }, function(data) {
                    commonService.loading.remove();
                });
            }else{
                reLoadFileList(parentPath, folderName, $scope.currentPage, $scope.pageSize);
            }
            /*clusterManager.getHDFSPromise(parentPath, folderName, $scope.currentPage, $scope.pageSize).then(function (response) {
                //clusterManager.getHDFSPromise("", "", $scope.currentPage, $scope.pageSize).then(function (response) {
                commonService.loading.remove();
                $scope.currentFolder = response.FileStatuses.FileStatus;
                $scope.currentFolderUrl = clusterManager.getCurrentFolderUrl();
                $scope.HDFSFileList.data = response.FileStatuses.FileStatus;
                $scope.HDFSFileList.data.unshift(backToParent);
                $scope.HDFSFileList.totalRecords = response.total + Math.ceil(response.total / $scope.pageSize);
            }, function(data) {
                commonService.loading.remove();
            });*/

            $scope.backToParentFolder = function () {
                var currentFolder = clusterManager.getCurrentFolderUrl();
                currentFolder = currentFolder.substr(0, currentFolder.length - 1);
                var parentPath = currentFolder.substr(0, currentFolder.lastIndexOf("/") + 1);
                var folderName = parentPath.substr(parentPath.lastIndexOf("/") + 1);
                $scope.parentPath = parentPath;
                $scope.folderName = folderName;
                //$scope.notChangeSelectFlag = true;
                clusterManager.setPathType('DIRECTORY');
                reLoadFileList($scope.parentPath, $scope.folderName, $scope.currentPage, $scope.pageSize);

            };
            $scope.folderClick = function (folderName) {
                if (!$scope.fetchingFolderData) {
                    $scope.fetchingFolderData = true;
                    /*$scope.currentPage = $scope.paginationModel.curPage["pageIndex"];
                    $scope.pageSize = $scope.paginationModel.displayLength;*/
                    $scope.parentPath = clusterManager.getCurrentFolderUrl();
                    $scope.folderName = folderName;
                    $scope.fileType = 'DIRECTORY';
                    clusterManager.setPathType('DIRECTORY');
                    $scope.currentPage=1;
                    reLoadFileList($scope.parentPath, folderName, $scope.currentPage, $scope.pageSize);
                }
            };
            $scope.fileClick = function (fileName) {
                $scope.currentpathFlag = true;
                if (!$scope.fetchingFolderData) {
                    /*if((clusterManager.getCurrentFolderUrl().indexOf('user/')==-1) && (clusterManager.getCurrentFolderUrl().indexOf('user/omm/')==-1)){
                        clusterManager.setCurrentPath(clusterManager.getHDFSRoot()+clusterManager.getUser()+"/"+clusterManager.getCurrentFolderUrl()+fileName);
                    }else{
                        clusterManager.setCurrentPath('/'+clusterManager.getCurrentFolderUrl()+fileName);
                    }*/
                    clusterManager.setCurrentPath('/' + clusterManager.getCurrentFolderUrl() + fileName);
                    $scope.currentPath = clusterManager.getCurrentPath();
                    $scope.currentFolderUrl = clusterManager.getCurrentFolderUrl();
                    $scope.fileType = 'FILE';
                    clusterManager.setPathType('FILE');
                }
            };

            function reLoadFileList(parentPath, folderName, currentPage, pageSize, isTablePaging) {
            	$("#HDFSFileListToSelectWindow").append(commonService.loading);
                clusterManager.getHDFSPromise(parentPath, folderName, currentPage, pageSize, isTablePaging).then(function (response) {
                	commonService.loading.remove();
                	$scope.fetchingFolderData = false;
                    $scope.currentFolder = response.FileStatuses.FileStatus;
                    $scope.currentPath = clusterManager.getCurrentPath();
                    $scope.currentFolderUrl = clusterManager.getCurrentFolderUrl();
                    $scope.currentpathFlag = true;
                    //总数
                    /* $scope.paginationModel.totalRecords = response.total;*/

                    $scope.HDFSFileList.data = response.FileStatuses.FileStatus;
                    $scope.HDFSFileList.data.unshift(backToParent);
                    $scope.HDFSFileList.totalRecords = response.total + Math.ceil(response.total / $scope.pageSize);
                }, function (data) {
                	commonService.loading.remove();
                    if (data.status == "200") {
                        $scope.currentFolder = data.FileStatuses.FileStatus;
                        $scope.currentPath = clusterManager.getCurrentPath();
                        $scope.currentFolderUrl = clusterManager.getCurrentFolderUrl();
                        //总数
                        /*$scope.paginationModel.totalRecords = response.total;*/

                        $scope.HDFSFileList.data = data.FileStatuses.FileStatus;
                        $scope.HDFSFileList.data.unshift(backToParent);
                        $scope.HDFSFileList.totalRecords = data.total + Math.ceil(data.total / $scope.pageSize);
                    } else {
                        /*var datas = {};
                        datas.data = data;
                        datas.action = i18n.dps_canvas_HDFS_getHDFSList;*/
                        commonService.failTip(i18n.dps_canvas_HDFS_getHDFSList);
                    }
                });
            }

            //HDFS tbale list
            $scope.HDFSFileList = {
                "id": "HDFSFileListTable",
                "enablePagination": "auto",
                "paginationStyle": "full-number",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": $stateParams['results-per-page'],
                "totalRecords": 0,
                "checkbox": false,
                "sScrollY": "400px",
                "data": [], //初始数据为空
                "columnsDraggable": true,
                "tableLanguage": {
                    "sEmptyTable": i18n.dps_table_no_data_show // 设置表格数据为空文本
                },
                "columns": [{
                    "sTitle": i18n.dps_OBSfile_filename,//名称
                    "mData": ""
                }],
                "callback": function (obj) {
                    $scope.currentPage = obj.currentPage;
                    reLoadFileList($scope.parentPath, $scope.folderName, $scope.currentPage, $scope.pageSize, true);
                },
                "changeSelect":function(obj){
                    $scope.HDFSFileList.displayLength = obj.displayLength;
                    $stateParams['results-per-page'] = obj.displayLength;
                    $scope.pageSize=obj.displayLength-1;
                    $scope.currentPage=1;
                    reLoadFileList($scope.parentPath, $scope.folderName, $scope.currentPage, $scope.pageSize, true);
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    var nameStr = "<span style='white-space:pre'>" + aData.pathSuffix + "</span>";
                    if (aData.type == "DIRECTORY") {
                        nameStr = "<div style='white-space:pre'>" + aData.pathSuffix + "</div>";
                        //添加文件名
                        var fileNameStr = "<div ng-click='openThisFolder()' style='cursor:pointer;padding:10px 0 10px 0'><div class='folder_icon pull-left' style='width:20px;height:20px'></div>" + nameStr + "</div>";
                    } else {
                        var fileNameStr = "<div ng-click='openThisFolder()' style='cursor:pointer;padding:10px 0 10px 0'><div class='file_icon pull-left' style='width:20px;height:20px'></div>" + nameStr + "</div>";
                    }
                    //添加文件名
                    var fileNameLink = $compile(fileNameStr);
                    var fileNameScope = $scope.$new();
                    $(nRow).css("cursor", "pointer");

                    fileNameScope.openThisFolder = function () {
                        if (aData.pathSuffix == "..") {
                            $scope.backToParentFolder();
                        } else if (aData.type == "DIRECTORY") {
                            $scope.folderClick(aData.pathSuffix);
                        } else {
                            $scope.fileClick(aData.pathSuffix);
                        }
                    };
                    var fileNameNode = fileNameLink(fileNameScope);
                    $("td:eq(0)", nRow).html(fileNameNode);
                }
            };
            $(".ui-dialog-content .viewport").css("height", "90%");
            $("#HDFSFileListToSelectWindow").parents("div").eq(3).css("height", "auto");
            $("#HDFSFileListToSelectWindow").parents("div").eq(4).css("top", "60px");
        }];

    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyController('HDFSFileListToSelect.ctrl', HDFSFileListToSelectCtrl);
    return dataCraftModule;
});
