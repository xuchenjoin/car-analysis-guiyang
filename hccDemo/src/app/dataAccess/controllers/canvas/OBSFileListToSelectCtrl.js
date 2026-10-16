define(["language/dataAccess"], function (i18n) {
    "use strict";
    var OBSFileListToSelectCtrl = ["$rootScope", "$scope", "$compile", "mask", "$state", "OBSManager", "commonService",
        function ($rootScope, $scope, $compile, mask, $state, OBSManager, commonService) {

            var bucketToRootDirectory = true;
            $scope.totalRecords = 0;
            $scope.currentPage = 1;
            $scope.pageSize = 9;
            $scope.folderAndFileList = [];//文件夹和文件列表
            $scope.folderList = [];
            $scope.fileList = [];
            $scope.currentMarker = [];//后台没有上一页信息，点击下一页时需要保留本页nextMarker以便返回上一页用
            var count = null;
            $scope.bucketName;
            $scope.currentPath = OBSManager.getCurrentPath();
            $scope.fileType = 'DIRECTORY';
            $scope.fetchingFolderData = false;

            //控制上一页，下一页是否显示
            $scope.showPageBtn = {
                "prePage":false,
                "nextPage":false
            };

            //previous page
            $scope.obsPrePage = {
                "id": "obsPrePage",
                "text": i18n.dps_canvas_configuration_obsPrePage,
                "disable": false,
                "focus":true,
                "click": function () {
                    var _folder={};
                    var folder = OBSManager.getFolderInfo();
                    _folder.bucketName = folder.bucketName;
                    _folder.directory = folder.prefix;
                    for(var i=0;i<$scope.currentMarker.length;i++){
                        if(folder.marker == $scope.currentMarker[i]){
                            _folder.marker = $scope.currentMarker[i-1];
                            continue;
                        }
                    }
                    reloadObsList(_folder,true);

                }
            };
            //next page
            $scope.obsNextPage = {
                "id": "obsNextPage",
                "text": i18n.dps_canvas_configuration_obsNextPage,
                "disable": false,
                "click": function () {
                    var _folder={};
                    var folder = OBSManager.getFolderInfo();
                    _folder.bucketName = folder.bucketName;
                    _folder.directory = folder.prefix;
                    _folder.marker = folder.nextMarker;
                    if($.inArray(folder.nextMarker,$scope.currentMarker) == -1){
                        $scope.currentMarker.push(folder.nextMarker) ;
                    }
                    reloadObsList(_folder,true);
                }
            };
            $scope.folderClick = function (folder) {
                /*if(!$scope.fetchingFolderData){*/
                $scope.fetchingFolderData = true;
                if (folder.isFolder) {//如果是文件夹
                    OBSManager.setPathType('DIRECTORY');
                    reloadObsList(folder);
                    $scope.fileType = 'DIRECTORY';
                } else {//如果是文件
                    $scope.fileType = 'FILE';
                    OBSManager.setCurrentPathBeFile(folder.name);
                    $scope.currentPath = OBSManager.getCurrentPath();
                    OBSManager.setPathType('FILE');
                }
                /*}*/
            };
            $scope.fileClick = function (file) {
                $scope.fileType = 'FILE';
                OBSManager.setCurrentPathBeFile(file.name);
                $scope.currentPath = OBSManager.getCurrentPath();
                OBSManager.setPathType('FILE');
            };
            $scope.backToParentFolder = function () {
                var directory = OBSManager.getCurrentDirectory();
                directory = directory.substr(0, directory.lastIndexOf("/"));
                if (directory == OBSManager.getCurrentDirectory()) {
                    bucketToRootDirectory = false;
                    OBSManager.setCurrentPathBeFile()
                    reloadObsList();
                } else {
                    reloadObsList({ name: "", bucketName: $scope.bucketName, directory: directory });
                }
                OBSManager.setPathType('DIRECTORY');
            };

            reloadObsList();
            function reloadObsList(folder,showPage) {
                var backToParent = {
                    "name": "..",
                    "isFolder": true
                };
                $("#OBSFileListToSelectWindow").append(commonService.loading);
                var currentPath = OBSManager.getCurrentPath();
                if ((folder || currentPath != "s3a://") && bucketToRootDirectory) {
                if (folder) {
                    OBSManager.getS3nFileListPromise(folder.bucketName, folder.directory, folder.marker,$scope.pageSize).then(
                        function (response) {
                            commonService.loading.remove();
                            var _data = response[0];
                            OBSManager.setFolderInfo(_data);
                            if((_data && _data.hasOwnProperty("nextMarker") && _data.truncated == true) || showPage == true){
                                $scope.showPageBtn.prePage = true;
                                $scope.showPageBtn.nextPage = true;
                                if(_data.truncated == false){
                                    $scope.showPageBtn.nextPage = false;
                                }
                                if($scope.currentMarker[0] == _data.nextMarker || $scope.currentMarker.length == 0){
                                    $scope.showPageBtn.prePage = false;
                                }
                            }else{
                                $scope.showPageBtn.prePage = false;
                                $scope.showPageBtn.nextPage = false;
                            }
                                $scope.fetchingFolderData = false;
                                $scope.folderList = OBSManager.getFolderList();
                                $scope.fileList = OBSManager.getFileList();
                                //合并数组
                                $.merge($scope.folderList, $scope.fileList);
                                // $scope.folderAndFileList = [];
                                $scope.folderAndFileList = $scope.folderList;
                                //$.merge($scope.folderAndFileList, $.grep($scope.folderList, function (n, i) {
                                //    return i < $scope.pageSize;
                                //}));
                                //总数
                                $scope.bucketName = OBSManager.getCurrentBucketName();
                                $scope.currentPath = OBSManager.getCurrentPath();
                                $scope.folderAndFileList.unshift(backToParent);
                                $scope.OBSFileList.data = $scope.folderAndFileList;
                                $scope.OBSFileList.totalRecords = $scope.folderAndFileList.length;
                            }, function(response) {
                                commonService.loading.remove();
                                commonService.currentWindowErrorTip(i18n.dps_canvas_hint_serviceErrror);
                            }
                        );
                    }else if(currentPath){
                        var bucketAndDirectory = currentPath.substring(6);
                        var bucketIndex = bucketAndDirectory.indexOf("/");
                        var bucket = bucketAndDirectory.substring(0,bucketIndex);
                        var directory2 = bucketAndDirectory.substring(bucketIndex + 1,bucketAndDirectory.length);
                        OBSManager.getS3nFileListPromise(bucket, directory2).then(
                            function (response) {
                                commonService.loading.remove();
				var _data = response[0];
                            OBSManager.setFolderInfo(_data);
                            if((_data && _data.hasOwnProperty("nextMarker") && _data.truncated == true) || showPage == true){
                                $scope.showPageBtn.prePage = true;
                                $scope.showPageBtn.nextPage = true;
                                if(_data.truncated == false){
                                    $scope.showPageBtn.nextPage = false;
                                }
                                if($scope.currentMarker[0] == _data.nextMarker || $scope.currentMarker.length == 0){
                                    $scope.showPageBtn.prePage = false;
                                }
                            }else{
                                $scope.showPageBtn.prePage = false;
                                $scope.showPageBtn.nextPage = false;
                            }
                                $scope.fetchingFolderData = false;
                                $scope.folderList = OBSManager.getFolderList();
                                $scope.fileList = OBSManager.getFileList();
                                //合并数组
                                $.merge($scope.folderList, $scope.fileList);
                                // $scope.folderAndFileList = [];
                                $scope.folderAndFileList = $scope.folderList;
                                //$.merge($scope.folderAndFileList, $.grep($scope.folderList, function (n, i) {
                                //    return i < $scope.pageSize;
                                //}));
                                //总数
                                $scope.bucketName = OBSManager.getCurrentBucketName();
                                $scope.currentPath = OBSManager.getCurrentPath();
                                $scope.folderAndFileList.unshift(backToParent);
                                $scope.OBSFileList.data = $scope.folderAndFileList;
                                $scope.OBSFileList.totalRecords = $scope.folderAndFileList.length;
                            }, function(response) {
                                commonService.loading.remove();
                                commonService.currentWindowErrorTip(i18n.dps_canvas_hint_serviceErrror);
                            }
                        );
                    }
                } else {
                    bucketToRootDirectory = true;
                    OBSManager.getBucketListPromise().then(
                        function (response) {
                            commonService.loading.remove();
			    
                            var _data = response[0];
                            OBSManager.setFolderInfo(_data);
                            if((_data && _data.hasOwnProperty("nextMarker") && _data.truncated == true) || showPage == true){
                                $scope.showPageBtn.prePage = true;
                                $scope.showPageBtn.nextPage = true;
                                if(_data.truncated == false){
                                    $scope.showPageBtn.nextPage = false;
                                }
                                if($scope.currentMarker[0] == _data.nextMarker || $scope.currentMarker.length == 0){
                                    $scope.showPageBtn.prePage = false;
                                }
                            }else{
                                $scope.showPageBtn.prePage = false;
                                $scope.showPageBtn.nextPage = false;
                            }
			    
                            $scope.folderList = OBSManager.getFolderList();
                            $scope.fileList = OBSManager.getFileList();
                            //合并数组
                            $.merge($scope.folderList, $scope.fileList);
                            // $scope.folderAndFileList = [];
                            $scope.folderAndFileList = $scope.folderList;
                            //$.merge($scope.folderAndFileList, $.grep($scope.folderList, function (n, i) {
                            //    return i < $scope.pageSize;
                            //}));
                            //总数
                            $scope.bucketName = OBSManager.getCurrentBucketName();
                            $scope.currentPath = "s3a://";
                            //$scope.currentPath = OBSManager.getCurrentPath();
                            //$scope.folderAndFileList.unshift(backToParent);
                            $scope.OBSFileList.data = $scope.folderAndFileList;
                            $scope.OBSFileList.totalRecords = $scope.folderAndFileList.length;
                        }, function(repsonse) {
                            commonService.loading.remove();
                            commonService.currentWindowErrorTip(i18n.dps_canvas_hint_serviceErrror);
                        }
                    );
                }
            }

            //OBS tbale list
            $scope.OBSFileList = {
                "id": "OBSFileListTable",
                "enablePagination": false,
                "paginationStyle": "full-number",
                "lengthChange": true,
                "lengthMenu": [10, 20, 50],
                "displayLength": 10,
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
                    "mData": "",
                    sWidth: "100%",
                    bodyTip: true,
                    bSortable: false
                }],
                "callback": function (obj) {
                    /*
                    for (var i = 0; i < $scope.folderAndFileList.length; i++) {
                        if ($scope.folderAndFileList[i].name == ".." && i == $scope.OBSFileList.displayLength * (obj.currentPage - 1)) {
                            $scope.folderAndFileList.splice(i, 1);
                        }
                    }

                    var backToParent = {
                        "name": "..",
                        "isFolder": true
                    };
                    $scope.folderAndFileList.splice($scope.OBSFileList.displayLength * (obj.currentPage - 1), 0, backToParent);
                    $scope.OBSFileList.data = $scope.folderAndFileList;
                    */
                },
                "renderRow": function (nRow, aData, iDataIndex) {
                    var nameStr = "<span style='white-space:pre'>" + aData.name + "</span>";
                    if (aData.isFolder == true) {
                        nameStr = "<div style='white-space:pre'>" + aData.name + "</div>";
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
                        if (aData.name == "..") {
                            $scope.backToParentFolder();
                        } else if (aData.isFolder == true) {
                            $scope.folderClick(aData);
                        } else {
                            $scope.fileClick(aData);
                        }
                    };
                    var fileNameNode = fileNameLink(fileNameScope);
                    $("td:eq(0)", nRow).html(fileNameNode);

                }
            };
            //自定义弹框
            $(".ui-dialog-content .viewport").css("height", "90%");
            $("#OBSFileListToSelectWindow").parents("div").eq(3).css("height", "auto");
            $("#OBSFileListToSelectWindow").parents("div").eq(4).css("top", "60px");
        }];

    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyController('OBSFileListToSelect.ctrl', OBSFileListToSelectCtrl);
    return dataCraftModule;
}
);
