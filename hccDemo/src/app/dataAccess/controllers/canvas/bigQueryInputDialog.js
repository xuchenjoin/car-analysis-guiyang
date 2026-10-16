
define(['language/dataAccess',
        'lib/codeMirror/codemirror',
        'lib/codeMirror/sql',
        'lib/codeMirror/sql-hint',
        'lib/codeMirror/show-hint',
        ], function (i18n, codemirror) {
    "use strict";

    var bigQueryInputDialogCtrl = function ($scope,commonService) {
    	$scope.CodeMirror = codemirror;
        var scopeConfigurationPanel = angular.element(".configureContainer").scope();
        var $parent = scopeConfigurationPanel.$parent;
        
        $scope.processType = $parent.process.type;
        if($scope.processType == "ExecuteQuery" || $scope.processType == "com.huawei.datacraft.activity.ExecuteQuery"){
        	$scope.Query = $parent.process.config.properties['Query Statement'];
        }else{
        	$scope.Query = $parent.process.config.properties.Query;
        }
        $scope.process = $parent.process;
        $scope.validationRules = $parent.validationRules;
        $scope.commentsInput = $parent.commentsInput;
        $scope.currentEditingPropertyName = $parent.currentEditingPropertyName;
        $scope.textValue = "";
        $scope.editor;
        
        var createSQLEditor=function(){
            var mime = 'text/x-mariadb';
            // get mime type
            if (window.location.href.indexOf('mime=') > -1) {
                mime = window.location.href.substr(window.location.href.indexOf('mime=') + 5);
            }
        $scope.editor = $scope.CodeMirror.fromTextArea(document.getElementById('sparkSQLInputBox'),{
                mode: mime,
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: true,
                matchBrackets : true,
                autofocus: true,
                extraKeys: {"Ctrl-Space": "autocomplete"},
                hintOptions:{
                    tables:{
                        users: {name: null, score: null, birthDate: null},
                        countries: {name: null, population: null, size: null}
                    }
                }
            });
            function getBt(str){
                var char = str.match(/[^\x00-\xff]/ig);
                return str.length + (char == null ? 0 : char.length);
            }
            $scope.editor.on("change",function(){
                var fileValue = $scope.editor.getValue();
                if(getBt(fileValue) > 10*1024){
                    commonService.failTip(i18n.dps_canvas_configuration_filesizes)
                    return false;
                }
                });

            if($scope.Query != null){
        	$scope.editor.setValue($scope.Query);
        }
        };
        $scope.createSQLEditor = function(){
            if($('#sparkSQLInputBox').length && !$scope.createdFlag){
                createSQLEditor();
                $scope.createdFlag = true;
            }
        }
        $scope.createSQLEditor();
    };

    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyController('bigQueryInputDialog.ctrl', bigQueryInputDialogCtrl);
    return dataCraftModule;
});