define([], function(){

    var pipelineEditorService = function(){
        var _this = this;

        this.layout = {
            showMenuContainer: true,
            showConfigurationContainer: false,
            showSeparatorLineRight: false,
            fn: {
                switchMenuContainer: function(){
                    _this.layout.showMenuContainer = !_this.layout.showMenuContainer;
                },
                switchConfigurationContainer: function(){
                    _this.layout.showConfigurationContainer = !_this.layout.showConfigurationContainer;
                },
                showConfigurationContainer: function(){
                    _this.layout.showConfigurationContainer = true;
                    _this.layout.showSeparatorLineRight = true;
                },
                hideConfigurationContainer: function(){
                    _this.layout.showConfigurationContainer = false;
                },
                isShowMenuContainer: function(){
                    return _this.layout.showMenuContainer;
                },
                isShowConfigurationContainer: function(){
                    return _this.layout.showConfigurationContainer;
                }
            }
        };
    };

    var dataCraftModule = angular.module('dataAccess.config');
    dataCraftModule.tinyService('pipelineEditorService', pipelineEditorService);
});