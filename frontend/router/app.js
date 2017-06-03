

    var routerApp = angular.module('routerApp', ['ct.ui.router.extras.sticky', 'MainModule', 'HomeModule', 'ShareModule','ExpModule']);
    // , 'ct.ui.router.extras.statevis''ct.ui.router.extras.dsr',
    routerApp.run(function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    });
    
    routerApp.directive("stickyState", function($state, uirextras_core) {
        var objectKeys = uirextras_core.objectKeys;
        return {
          restrict: 'EA',
          compile: function(tElem, tAttrs) {
            var stateName = tAttrs.stickyState || tAttrs.state;
            if (!stateName) {
              throw new Error("Sticky state name must be supplied to stickyState directive.  " +
                "Either <sticky-state state='my.sticky.state' /> or <div sticky-state='my.sticky.state'></div>");
            }

            var state = $state.get(stateName);
            if (!state) {
              throw new Error("Could not find the supplied state: '" + stateName + "'");
            }

            if (!angular.isObject(state.views)) {
              throw new Error("The supplied state: '" + stateName + "' must have a named view declared, i.e., " +
                ".state('" + state.name + "', { views: { stickyView: { controller: myCtrl, templateUrl: 'myTemplate.html' } } });");
            }
            var keys = objectKeys(state.views);
            if (keys.length != 1) {
              throw new Error("The supplied state: '" + stateName + "' must have exactly one named view declared.");
            }

            tElem.append('<div ui-view="' + keys[0] + '"></div>');

            return function(scope, elem, attrs) {
              var autohideDiv = scope.$eval(attrs.autohide);
              autohideDiv = angular.isDefined(autohideDiv) ? autohideDiv : true;

              if (autohideDiv) {
                scope.$on("$stateChangeSuccess", function stateChanged() {
                  var addOrRemoveFnName = $state.includes(state) ? "removeClass" : "addClass";
                  elem[addOrRemoveFnName]("ng-hide");
                });
              }
            }
          }
        }
    });

    routerApp.config(function($stateProvider, $stickyStateProvider,$urlRouterProvider) {

            $urlRouterProvider.otherwise('/index/home');
            $stateProvider
                .state('index', {
                    url: '/index',
                    templateUrl: 'template/index.html'
                })
                .state('index.home', {
                    url: '/home',
                    sticky: true,
                    views: { 
                        'hometab': { 
                            templateUrl: 'template/home.html'
                        } 
                    }

                })
                .state('index.share', {
                    url: '/share',
                    // sticky: true,
                    views: { 
                        'sharetab': { 
                            controller: 'shareController', 
                            templateUrl: 'template/share.html'
                        } 
                    }
                })
                .state('index.experience', {
                    url: '/experience',
                    sticky: true,
                    views: { 
                        'experiencetab': { 
                            templateUrl: 'template/experience.html'
                        } 
                    }
                })
        });
    
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['routerApp']);
    });
   

