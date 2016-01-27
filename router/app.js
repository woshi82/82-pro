var routerApp = angular.module('routerApp', ['ui.router', 'HomeModule', 'WaterfallModule']);

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
        .state('index.page1', {
            url: '/page1',
            views: { 
                'main@index': {
                    templateUrl: 'template/page1.html'
                }
            }
        })
        .state('index.page2', {
            url: '/page2',
            views: { 
                'main@index': {
                    templateUrl: 'template/page2.html'
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
