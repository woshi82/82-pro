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
                if(_this.can_r) _this.draw();
                requestAnimationFrame(function(){
                    _this.render();
                });
            };
            Container.prototype.start = function (obj){
                this.can_r = true;
            };
            Container.prototype.stop = function (obj){
                this.can_r = false;
            };
            Container.prototype.draw = function (){
                this.ctx.clearRect(0,0,this.W,this.H);

                // this.ctx.save();
                // this.updateTransform(this.ctx);
                var totle = this.cds.length,
                    i = 0;
                while(i<totle){
                    var cd = this.cds[i];
                    // if(cd.isVisible()){
                        // cd.globalAlpha = this.alpha*this.globalAlpha;
                        cd.draw(this.ctx);
                    // }
                    i++;
                }
                // this.ctx.restore();
            };

            oSprite = new ImagesLoad({cloud: 'images/cloud1.png'});
            oSprite.imagesLoaded = function(){
                var Cloud = new cloud(oSprite.sprite.cloud);
                var stage = new Container('clouds');
                var canvasPlane = new CanvasPlane();
                var planeMove1 = new planeMove(canvasPlane);
                stage.addChild(Cloud);
                stage.addChild(canvasPlane);
                stage.render();
                var i = 1;
                $('body').on('click',function(){
                    if(i==1){
                        stage.stop();
                        i++;
                    }else{
                        stage.start();

                    }
                })
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


            // 监听滚轮滚动事件 
            var canScroll = true,
                iNow = 0,
                $block = $('.experience').find('.block'),
                $blockDotA = $('.experience').find('.blockDot a'),
                blockLen = $block.length;
            addEvent($('.experience')[0],'mousewheel',function(ev){
                if(!canScroll)return;
                if(ev.delta < 0){
                    if( iNow < blockLen-1) {
                        canScroll = false;
                        iNow++;
                        $blockDotA.eq(iNow).addClass('active').siblings().removeClass('active');
                        setTimeout(function(){
                            canScroll = true;
                        },1500)
                    };
                }else if(ev.delta > 0){
                   if( iNow > 0) {
                        canScroll = false;
                        iNow--;
                        $blockDotA.eq(iNow).addClass('active').siblings().removeClass('active');
                        setTimeout(function(){
                            canScroll = true;
                        },1500)
                    }; 
                }
            });
        }
    }
}]);