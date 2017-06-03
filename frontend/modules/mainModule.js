var mainModule = angular.module("MainModule", []);
mainModule.directive('navbar',['$timeout', '$rootScope','$location','$state',function($timeout,$rootScope,$location,$state) {
    return {
        restrict: 'AE',
        // replace: true,
        transclude: true,
        link: function(scope, element, attrs) {
            var path = $location.$$path;
            console.log(path)
            switch(path){
                case '/index':
                case '/index/home':
                    break;
                case '/index/share':
                    changeColor(element.find('a').eq(1));
                    break;
                case '/index/experience':
                    changeColor(element.find('a').eq(2));
                    break;
            }
            element.on('click','a',function(){
                changeColor($(this));
            });
            function changeColor(obj){
                
                var color = obj.attr('color');
                // console.log(color)
                obj.attr('class','active '+color).siblings().attr('class',color);
            };
            

        }


    }

}]);