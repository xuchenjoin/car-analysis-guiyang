/**
 * 
 */
define([], function() {
    var hintDirective = function(hintService){
        return {
        	restrict: 'E',
        	templateUrl: 'src/app/directives/views/hintDirective.html',
            //右侧的值貌似必须是全小写
        	scope : {
                'closeclass' : '=closeclass',
        		'icon' : '=icons',
        		'descriptionInScope' : '=desc',
        		'status' : '=status'
        	},
        	link:function(scope,element,attrs){
        	},
        	replace: true
        };
    };

    return hintDirective;
});