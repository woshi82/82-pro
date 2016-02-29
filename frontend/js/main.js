

require.config({
    baseUrl : "./",
    waitSeconds: 100,
    paths: {
        "app": "router/app",
        "jquery": "component/jquery/jquery",
        "angular": "component/angular/angular.min",
        "angular-ui-router": "component/angular/angular-ui-router",
        "martix": "component/minMartix",
        "tweenMax": "component/TweenMax.min",
        
        "mainModule": "modules/mainModule",
        "exp": "modules/exp",
        "share": "modules/share",
        "home": "modules/home",
        
        "canvasPublic": "js/canvasPublic",
        "plane": "js/plane",
        "cloud": "js/cloud",
        "wave": "js/wave",
        "star": "js/star"
    },
    shim: {
        "angular": { exports: "angular" },
        "angular-ui-router": ["angular"],
        "app": ["jquery"],
        
        "plane": ["jquery","martix","tweenMax"],
        "exp": ["jquery","plane","cloud","canvasPublic"],
        "home": ["jquery","wave","star","canvasPublic"]
    },
    deps: ["app"]
});

require(['angular','jquery', 'app'], function(angular){
    angular.bootstrap(document, ['routerApp']);
});
