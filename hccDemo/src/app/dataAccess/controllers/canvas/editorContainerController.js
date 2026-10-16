define([], function(){
    "use strict";
    var editorContainerController = function($scope, pipelineEditorService){
        $scope.layout = pipelineEditorService.layout;
    };

    var app = angular.module('dataAccess.config');
    app.tinyController('editorContainer.ctrl', editorContainerController);
});
