
define([ 'angular-ui-router', 'mainModule','home','exp','share'],function () {
    var routerApp = angular.module('routerApp', ['ui.router','MainModule', 'HomeModule', 'ShareModule','ExpModule']);

    routerApp.run(function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    });

    routerApp.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/index');
        $stateProvider
            .state('index', {
                url: '/index',
                views: {
                    '': {
                        templateUrl: 'template/index.html'
                    },
                    'navbar@index': {
                        templateUrl: 'template/navbar.html'
                    },
                    'main@index': {
                        templateUrl: 'template/home.html'       
                    }
                }
            })
            .state('index.share', {
                url: '/share',
                views: { 
                    'main@index': {
                        templateUrl: 'template/share.html',
                        controller: 'shareController'
                    }
                }
            })
            .state('index.experience', {
                url: '/experience',
                views: { 
                    'main@index': {
                        templateUrl: 'template/experience.html'
                    }
                }
            })
            .state('index.page3', {
                url: '/page3',
                views: { 
                    'main@index': {
                        templateUrl: 'template/page3.html'
                    }
                }
            })
    });

    return routerApp;


});

