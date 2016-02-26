

var mainModule = angular.module("MainModule", []);
mainModule.directive('navbar',['$timeout', '$rootScope','$location',function($timeout,$rootScope,$location) {
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
                obj.attr('class','active '+color).siblings().attr('class',color);
            }

        }


    }

}]);



var shareModule = angular.module("ShareModule", []);
shareModule.controller('shareController',['$scope',function($scope){
    console.log('shareController')
    $scope.shareDetails = {};
    $scope.sharePraise = 'active';
}])





