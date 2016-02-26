var expModule = angular.module("ExpModule", []);
// <div class="cloud move1"><div class="cloudCon">waha哇哈哈哈哈</div></div>
expModule.directive('clouds',['$timeout', '$rootScope',function($timeout,$rootScope) {
    return {
        restrict: 'AE',
        replace: true,   
        template: '<canvas id="clouds"></canvas>',
        // template: '<div class="clouds"></div>',
        link: function(scope, element, attrs) {

            // 图片预加载

            function ImagesLoad(json){
                this.sprite = {};  //雪碧图
                this.imagesLoad(json);
            }
            ImagesLoad.prototype.imagesLoad = function (json){
                var This = this,
                    OK = 0,
                    Total = 0;

                for(var img in json){
                    this.sprite[img] = new Image();
                    Total++;
                    this.sprite[img].onload = function (){
                        OK++;
                        //alert(This.sprite.img.width)
                        if(OK>=Total){
                            This.imagesLoaded();
                        }
                    };
                    this.sprite[img].src = json[img];
                }
            };
            ImagesLoad.prototype.imagesLoaded = function (){};

            
            // canvas容器

            function Container(id){
                this.canvas = document.getElementById(id);
                this.ctx = this.canvas.getContext('2d');
                this.cds = [];
                this.can_r = true;
                this.resize();

            };
            Container.prototype.resize = function (){
                this.H = window.innerHeight-78;
                this.W = (window.innerWidth<1200)?1200:window.innerWidth;
                this.canvas.height = this.H;
                this.canvas.width = this.W;
                this.canvas.style.height = this.H + 'px';
                this.canvas.style.width = this.W + 'px';
            };
            Container.prototype.addChild = function (c){
                if (c == null) { return c; }
                var l = arguments.length;
                if (l > 1) {
                    for (var i=0; i<l; i++) { 
                        this.addChild(arguments[i]); 
                    }
                    return arguments[l-1];
                }
                this.cds.push(c);
                return c;
            };
            Container.prototype.render = function (obj){
                var _this = this;
                // if(_this.can_r) 
                    _this.draw();
                requestAnimationFrame(function(){
                    _this.render();
                });
            };
            Container.prototype.start = function (obj){
                this.can_r = true;
                var totle = this.cds.length,
                    i = 0;
                while(i<totle){
                    var cd = this.cds[i];
                        cd.start&&cd.start();
                    i++;
                }
            };
            Container.prototype.stop = function (obj){
                this.can_r = false;
                var totle = this.cds.length,
                    i = 0;
                while(i<totle){
                    var cd = this.cds[i];
                        cd.stop&&cd.stop();
                    i++;
                }

            };
            Container.prototype.draw = function (){
                this.ctx.clearRect(0,0,this.W,this.H);

                // this.ctx.save();
                // this.updateTransform(this.ctx);
                var totle = this.cds.length,
                    i = 0;
                while(i<totle){
                    var cd = this.cds[i];
                        cd.draw(this.ctx);
                    i++;
                }
                // this.ctx.restore();
            };

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


            oSprite = new ImagesLoad({cloud: 'images/cloud.png',cloud2: 'images/cloud2.png'});
            oSprite.imagesLoaded = function(){
                var stage = new Container('clouds');
                var W = stage.W,
                    H = stage.H;
                var Cloud = new cloud({
                    pic:oSprite.sprite.cloud,
                    W: stage.W,
                    H: stage.H
                });
                
                var canvasPlane = new CanvasPlane();
                var planeMove = new PlaneMove(canvasPlane);
                stage.addChild(Cloud);
                stage.addChild(canvasPlane);
                stage.render();
                
                function dospCloud(arr){
                    var spC = new spCloud({
                        // aPic:[oSprite.sprite.cloud2],
                        aPic:arr,
                        W: stage.W,
                        H: stage.H
                    });
                    stage.addChild(spC);
                }


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
                    
                    {x: 200,y: H*1.5},
                    // {x: W/5*3,y: H - 100},
                    {x: W*1.5,y: -200},
                    {x: -800,y: 0},
                    {x: 0,y: H+200},
                    {x: W/5*4,y: H-150}
                ],8200,'linear',function(){
                    // planeMove.canvasPlaneBezier([
                    //     {x: W/5*3,y: H - 100},
                    //     {x: W*1.5,y: -200},
                    //     {x: -800,y: 0},
                    //     {x: 0,y: H+200},
                    //     {x: W/5*4,y: H-150},
                    // ],4200,'linear',function(){

                    // });
                    

                    dospCloud([oSprite.sprite.cloud2,oSprite.sprite.cloud2,oSprite.sprite.cloud2]);
                    stageStop();
                });

                TweenMax.to(canvasPlane.rotate, 2, {x:80,y:-10,'onComplete':function(){
                    TweenMax.to(canvasPlane.rotate, 1.8, {x:20,'onComplete':function(){
                        TweenMax.to(canvasPlane.rotate, 1.4, {x:68,y:5, ease: Power1.easeInOut});

                    }});
                }});

                // 第二
                function planeR2(){
                    planeMove.canvasPlaneBezier([
                        {x: W/5*4,y: H-150},
                        {x: W/3*2,y: -150},
                        {x: 100,y: 100},
                        {x: 50,y: H+200},
                        {x: W/2,y: H-200},
                    ],4200,'linear');
                };

                // 第三
                function planeR3(){
                    planeMove.canvasPlaneBezier([
                        {x: W/2,y: H-200},
                        {x: W,y: -100},
                        {x: -200,y: 150},
                        {x: 150,y: H+100},
                        {x: W/2,y: H-200},
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
                    },1e3);
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
                                dospCloud([oSprite.sprite.cloud2,oSprite.sprite.cloud2,oSprite.sprite.cloud2]);
                            }else if(iNow == 2){
                                planeR3();
                                dospCloud([oSprite.sprite.cloud2,oSprite.sprite.cloud2,oSprite.sprite.cloud2]);
                            };
                            stage.start()
                            stageStop();   
                        };
                    }else if(ev.delta > 0){
                       if( iNow > 0) {
                            bScroll = false;
                            iNow--;
                            $blockDotA.eq(iNow).addClass('active').siblings().removeClass('active');
                            if(iNow == 1){
                                dospCloud([oSprite.sprite.cloud2,oSprite.sprite.cloud2,oSprite.sprite.cloud2]);
                            }else if(iNow == 0){
                                dospCloud([oSprite.sprite.cloud2,oSprite.sprite.cloud2,oSprite.sprite.cloud2]);
                            };
                            stage.start()
                            stageStop();
                        }; 
                    }
                });


            };
        }
    }
}]);

expModule.directive('canvasPlane',['$timeout', '$rootScope',function($timeout,$rootScope) {
    return {
        restrict: 'AE',
        replace: true,   
        template: '<canvas id="canvasPlane"></canvas>',
        link: function(scope, element, attrs) {
            

            // 初始化
            var H = window.innerHeight - 78;
            var W = (window.innerWidth<1200)?1200:window.innerWidth;

            var canvas = element[0];
                ctx = canvas.getContext('2d');
            canvas.style.height = H + 'px';
            canvas.height = H;
            canvas.width = W;
            
            
            // 摆动
            var bb = true,
                wingStop = false;
            var dd = true,
                bodyStop = false;
            function wingFly(){
                var to = bb?60:-60,
                    time = bb?0.8:0.9;
                    bb=!bb;
                TweenMax.to(canvasPlane.wings.rotate, time, {y:to, onComplete:function(){
                    if(!wingStop){
                        wingFly()
                    }else{
                        TweenMax.to(canvasPlane.wings.rotate, time, {y:0});

                    };
                }, ease: Power1.linear});
            }                        
            function bodyFly(){
                var to = dd?40:-40,
                    time = dd?0.5:0.6;
                    dd=!dd;
                TweenMax.to(canvasPlane.bodys.rotate, time, {y:to, onComplete:function(){
                    if(!bodyStop){
                        bodyFly()
                    }else{
                        TweenMax.to(canvasPlane.bodys.rotate, time, {y:0});
                    };
                }, ease: Power1.linear});
            };
            

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
            
            

            go()
            function go(){
                ctx.clearRect(0,0,W,H);
                canvasPlane.render(ctx);
                requestAnimationFrame(go);
            };

            

            // setTimeout(function(){
            //     wingStop = true;
            //     bodyStop = true;
            //     $('.block1').removeClass('blur')
            //     TweenMax.to(canvasPlane.scale, 1.2, {x:.5,y:.5,z:.5});

            //     canvasPlaneBezier([{x: 410,y:H/2 - 30},{x: 1000,y:H/4 - 15},{x: 100,y:50}],5200,'linear',function(){

            //         setTimeout(function(){
            //             fly_pro0();
            //         },1000);
            //     });
                   
            // },2000);


            
        }
    }
}]);