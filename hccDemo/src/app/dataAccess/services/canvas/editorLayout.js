
define(["language/dataAccess"], function (keyID) {
    "use strict";
    var editorLayout = function (camel) {
        var compsPanelLayout={
            ifShow:true
        };
        var canvasLayout={
            ifShow:true
        };
        var configurationPanelLayout={
            ifShow:false
        };
        this.getCompsPanelLayout=function(){
            return compsPanelLayout;
        };
        this.getConfigurationPanelLayout=function(){
            return configurationPanelLayout;
        };
        this.getCanvasLayout=function(){
            return canvasLayout;
        }
    };

    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyService('editorLayout', editorLayout);
});