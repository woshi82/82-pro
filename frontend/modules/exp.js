var expModule = angular.module("ExpModule", []);
expModule.directive('clouds',['$timeout', '$rootScope',function($timeout,$rootScope) {
    return {
        restrict: 'AE',
        replace: true,   
        template: '<canvas id="clouds"></canvas>',
        // template: '<div class="clouds"></div>',
        link: function(scope, element, attrs) {

            

            // 事件绑定兼容鼠标滚轮
            var addEvent = (function(window, undefined) {        
                var _eventCompat = function(event) {
                    var type = event.type;
                    if (type == 'DOMMouseScroll' || type == 'mousewheel') {
                        event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
                    }
                    //alert(event.delta);
                    if (event.srcElement && !event.target) {
                        event.target = event.srcElement;    
                    }
                    if (!event.preventDefault && event.returnValue !== undefined) {
                        event.preventDefault = function() {
                            event.returnValue = false;
                        };
                    }
                    return event;
                };
                if (window.addEventListener) {
                    return function(el, type, fn, capture) {
                        if (type === "mousewheel" && document.mozHidden !== undefined) {
                            type = "DOMMouseScroll";
                        }
                        el.addEventListener(type, function(event) {
                            fn.call(this, _eventCompat(event));
                        }, capture || false);
                    }
                } else if (window.attachEvent) {
                    return function(el, type, fn, capture) {
                        el.attachEvent("on" + type, function(event) {
                            event = event || window.event;
                            fn.call(el, _eventCompat(event));    
                        });
                    }
                }
                return function() {};    
            })(window);


            oSprite = new ImagesLoad({
                cloud: 'images/cloud.png',
                cloud1: 'images/cloud1.png',
                cloud2: 'images/cloud2.png',
                cloud3: 'images/cloud3.png',
                cloud4: 'images/cloud4.png',
                cloud5: 'images/cloud5.png',
                cloud6: 'images/cloud6.png',
                cloud7: 'images/cloud7.png',
                cloud8: 'images/cloud8.png',
                cloud9: 'images/cloud9.png',
            });
            oSprite.imagesLoaded = function(){
                var H = window.innerHeight-78;
                var W = (window.innerWidth<1200)?1200:window.innerWidth;
                var stage = new Container({W: W,H:H,id: 'clouds'});
                var Cloud = new cloud({
                    pic:oSprite.sprite.cloud,
                    W: stage.W,
                    H: stage.H
                });
                
                var canvasPlane = new CanvasPlane();
                var planeMove = new PlaneMove(canvasPlane);
                stage.addChild(Cloud);
                stage.addChild(canvasPlane);
                var aPic = [
                    [oSprite.sprite.cloud1,oSprite.sprite.cloud2,oSprite.sprite.cloud3],
                    [oSprite.sprite.cloud4,oSprite.sprite.cloud5,oSprite.sprite.cloud6],
                    [oSprite.sprite.cloud7,oSprite.sprite.cloud8,oSprite.sprite.cloud9]
                ];

                stage.render();
                

                $( window ).on('resize',function (){
                    H = window.innerHeight-78;
                    W = (window.innerWidth<1200)?1200:window.innerWidth;
                    stage.resize({
                        H: H,
                        W: W
                    });
                });
                var spC;


                // canvasPlane.rotate.z = 100;
                // canvasPlane.rotate.y = -10;
                // canvasPlane.rotate.x = 68;
                canvasPlane.rotate.z = -30;
                canvasPlane.rotate.y = -30;
                canvasPlane.rotate.x = 30;

                canvasPlane.translate.x = 550;
                canvasPlane.translate.y = 150;
                // canvasPlane.translate.x = 220;
                // canvasPlane.translate.y = _this.H - 50;

                // 飞机出场动画
                // planeMove.canvasPlaneBezier([{x: 220,y:_this.H - 50},{x: -600,y:-200},{x: 1800,y:0},{x: -100,y:_this.H - 300},{x: 500,y: _this.H - 100}],5200,'linear',function(){});
                planeMove.canvasPlaneBezier([
                    {x: W/2,y:H - 50},
                    {x: -1000,y:-200},
                    {x: W*2.2,y:0},
                    {x: -100,y:H - 300},
                    
                    {x: W/5*3,y: H - 100},
                ],4200,'linear',function(){
                    
                   planeR1();

                    spC = new spCloud({
                        aPic: aPic[0],
                        W: stage.W,
                        H: stage.H
                    });
                    stage.addChild(spC);
                    stageStop();
                });

                TweenMax.to(canvasPlane.rotate, 2, {x:80,y:-10,'onComplete':function(){
                    TweenMax.to(canvasPlane.rotate, 1.8, {x:20,'onComplete':function(){
                        TweenMax.to(canvasPlane.rotate, 1.4, {x:68,y:5, ease: Power1.easeInOut});

                    }});
                }});

                // 第一
                function planeR1(){
                    planeMove.canvasPlaneBezier([
                        {x: W/5*3,y: H - 100},
                        {x: W*1.5,y: -200},
                        {x: -800,y: 0},
                        {x: 0,y: H+200},
                        {x: W/5*4,y: H-150},
                    ],5200,'linear');
                };
                // 第二
                function planeR2(){
                    planeMove.canvasPlaneBezier([
                        {x: W/5*4,y: H-150},
                        {x: W/3*2,y: -150},
                        {x: 100,y: 100},
                        {x: 50,y: H+100},
                        {x: W/2,y: H-50},
                    ],4200,'linear');
                };

                // 第三
                function planeR3(){
                    planeMove.canvasPlaneBezier([
                        {x: W/2,y: H-50},
                        {x: W,y: -100},
                        {x: -200,y: 150},
                        {x: 150,y: H+100},
                        {x: W/5*3,y: H - 100},
                    ],4200,'linear');
                };
                
                

                // 监听滚轮滚动事件 
                var iNow = 0,
                    $blockDotA = $('.experience').find('.blockDot a'),
                    blockLen = $blockDotA.length,
                    bScroll = false;

                
                function stageStop(){
                    setTimeout(function(){
                        stage.stop();
                        bScroll = true;
                        // 6e3
                    },4.2e3);
                }

                addEvent($('.experience')[0],'mousewheel',function(ev){
                    if(!bScroll)return;
                    if(ev.delta < 0){
                        if( iNow < blockLen-1) {
                            bScroll = false;
                            iNow++;
                            $blockDotA.eq(iNow).addClass('active').siblings().removeClass('active');
                            if(iNow == 1){
                                planeR2();
                            }else if(iNow == 2){
                                planeR3();
                                
                            };
                            spC.setPic(aPic[iNow]);

                            stage.start()
                            stageStop();   
                        };
                    }else if(ev.delta > 0){
                       if( iNow > 0) {
                            bScroll = false;
                            iNow--;
                            $blockDotA.eq(iNow).addClass('active').siblings().removeClass('active');
                            if(iNow == 1){
                                planeR1();
                            }else if(iNow == 0){
                                planeR2();
                            };
                            spC.setPic(aPic[iNow]);
                            
                            stage.start()
                            stageStop();
                        }; 
                    }
                });


            };
        }
    }
}]);