define(['language/dataAccess','src/app/common/commonInfo'],
    function(i18n, commonInfo  ) {
	
	var homePageCtrl = function ($scope,$rootScope){
		$scope.i18n = i18n;
		if($rootScope.languageName == "English" ) {
			$scope.language = "en-us";
		} else {
			$scope.language = "zh-cn";
		}
		
		
	    $scope.openApp=function() 
	    {
	    		window.location="index.html?locale="+$scope.language+"#/fakeCar/map"
	    }
		
	}
	var dataAccessModule = angular.module('dataAccess.config');
    dataAccessModule.tinyController('homePageCtrl.ctrl', homePageCtrl);
    return dataAccessModule;
});