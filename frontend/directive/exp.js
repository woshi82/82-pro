var expModule = angular.module("ExpModule", []);
// <div class="cloud move1"><div class="cloudCon">waha哇哈哈哈哈</div></div>
expModule.directive('clouds',['$timeout', '$rootScope',function($timeout,$rootScope) {
    return {
        restrict: 'AE',
        replace: true,   
        template: '<canvas id="clouds" width="900px"></canvas>',
        // template: '<div class="clouds"></div>',
        link: function(scope, element, attrs) {
            
            function cloud(){
                this.canvas = document.getElementById('clouds');
                this.ctx = this.canvas.getContext('2d');
                this.H = window.innerHeight;
                this.canvas.height = this.H;

                this.W = 900;
                this.N = 20;
                this.aClouds = [];
                this.lt = Date.now();
                this.s_I = 200;
                this.can_r = false;
                this.start();
                this.render();
            };
            cloud.prototype.stop = function(){
                // 后期需要停止时保持
                this.can_g = false;
                this.can_r = false;
                this.aClouds.length = 0;
            };
            cloud.prototype.start = function(){
                var _this = this;
                this.can_g = true;
                if(!this.pic){
                    this.pic = new Image();
                    this.pic.src = 'images/cloud1.png';
                    this.pic.onload = function(){
                        _this.can_g && (_this.can_r = true);

                        // _this.render();
                    };                    
                }else{
                    _this.can_r = true;
                }
            };
            cloud.prototype.render = function(){
                var _this = this;
                if(_this.can_r) _this.draw();
                requestAnimationFrame(function(){
                    _this.render();
                });

            }
            cloud.prototype.selfRenewal = function(){
                var nt = Date.now();
                if(nt - this.lt >= this.s_I && this.aClouds.length < this.N){
                    this.lt = nt;
                    this.aClouds.push(new cloudC(this.pic,this.ctx,this.H));                       
                }
            };
            cloud.prototype.draw = function(){
                this.selfRenewal();
                // this.aClouds.push(new cloudC(this.pic,this.ctx,this.H));                       

                this.ctx.clearRect(0,0,this.W,this.H);
                var t = Date.now();
                for (var i = 0; i < this.aClouds.length; i++) {
                    // var i = 0;
                    this.aClouds[i].draw(t);
                };

            }
            function cloudC(pic,ctx,H){
                this.ctx = ctx;
                this.W = 900;
                this.H = H;
                this.pic = pic;
                this.width = this.pic.width;
                this.height = this.pic.height;
                this.life = this.randomRange(4e3,8.2e3);
                this.ox = this.W/2;
                this.oy = this.H/2;
                this.showt = 0;
                this.R = this.W*1.2;
                this.reset();

            };
            cloudC.prototype.draw = function(nt){
                this.ctx.save();
                this.update(nt);
                this.ctx.globalAlpha = this.alpha;                
                this.ctx.drawImage(this.pic,0,0,this.width,this.height);
                this.ctx.restore();
            };
            cloudC.prototype.upTransform = function() {
                this.ctx.transform(this.scale,0,0,this.scale,this.ox+this.tx,this.oy+this.ty);
            };
            cloudC.prototype.update = function(nt){
                var p = nt - this.st,
                    r = 1,
                    rg = p/this.life;

                if(this.life - p <= 0){
                    this.reset();
                }else{
                    // if(p<this.showt){
                    //     r = p/this.showt;
                    // }
                    // else if (p > this.life-this.hidet) {
                    //     r = 1-p/this.life;
                    // };
                    this.alpha = r*this.alpha;
                    
                    this.tx = rg*(this.tex-this.tbx)+this.tbx;
                    this.ty = rg*(this.tey-this.tby)+this.tby; 
                    this.scale = rg*(this.escale-this.bscale)+this.bscale;
                };
                this.upTransform();                  
            };
            cloudC.prototype.reset = function(){
                this.st = Date.now();
                this.bscale = this.randomRange(5,10)/100;
                this.tbx = this.randomRange(-60,60);
                this.tby = this.randomRange(-60,60);
                this.tx = this.tbx;
                this.ty = this.tby;
                this.scale = this.bscale;

                var oConSin = this.getConSin({x:this.tbx,y:this.tby});
                this.tex = (this.R*oConSin.cos) >> 0;
                this.tey = (this.R*oConSin.sin) >> 0;

                this.escale = this.randomRange(60,80)/100;
                this.balpha = this.randomRange(50,100);
                this.alpha = this.balpha;
            };
            cloudC.prototype.getConSin = function(p1){
                var p2 = {x:1,y:0},
                    innerMulter = p1.x*p2.x + p1.y*p2.y,
                    diffMulter = p1.x*p2.y - p1.y*p2.x,
                    distance = Math.sqrt(Math.pow(p1.x,2)+Math.pow(p1.y,2)) + Math.sqrt(Math.pow(p1.x,2)+Math.pow(p1.y,2)),
                    iCos = innerMulter/distance,
                    iSin = Math.sqrt(1-Math.pow(iCos,2));
                iSin =  (p1.y > 0)?iSin:-iSin;
                iCos =  (diffMulter > 0)?iCos:-iCos;
                return {cos: iCos,sin: iSin};
            };
            cloudC.prototype.randomRange = function (LLimit,TLimit){
                return Math.floor(Math.random()*(TLimit-LLimit) + LLimit);
            };

            var Cloud = new cloud();
        }
    }
}]);

expModule.directive('canvasPlane',['$timeout', '$rootScope',function($timeout,$rootScope) {
    return {
        restrict: 'AE',
        replace: true,   
        template: '<canvas width="900"></canvas>',
        link: function(scope, element, attrs) {
            // 初始化矩阵
            var JCM = new matIV();
            
            // 3d模型
            function Vertex3(x,y,z){
                this.x = x||0;
                this.y = y||0;
                this.z = z||0;
            }
            function Object3D(){
                this.vertex3 = [];
                this.toRAD = Math.PI/180.0;
                this.rotate = new Vertex3();
                this.scale = new Vertex3(1,1,1);
                this.translate = new Vertex3();
                this.matrix = JCM.identity(JCM.create());
            }
            Object3D.prototype.rotateXYZ = function(){
                JCM.rotate(this.matrix, (this.rotate.x % 360) * this.toRAD, [1,0,0], this.matrix);
                JCM.rotate(this.matrix, (this.rotate.y % 360) * this.toRAD, [0,1,0], this.matrix);
                JCM.rotate(this.matrix, (this.rotate.z % 360) * this.toRAD, [0,0,1], this.matrix);
            }
            Object3D.prototype.translateXYZ = function(){
                JCM.translate(this.matrix, [this.translate.x,this.translate.y,this.translate.z], this.matrix);
            }
            Object3D.prototype.scaleXYZ = function(){
                JCM.scale(this.matrix, [this.scale.x,this.scale.y,this.scale.z], this.matrix);
            }
            Object3D.prototype.upMatrix = function(Wmatrix){
                this.matrix = JCM.identity(JCM.create());
                this.translateXYZ();
                this.rotateXYZ();
                this.scaleXYZ();
                JCM.multiply(Wmatrix, this.matrix, this.matrix);
                var mat = this.matrix;
                for(var i=0,l=this.vertex.length;i<l;i++){
                    var x = this.vertex[i].x,
                        y = this.vertex[i].y,
                        z = this.vertex[i].z,
                        x1 = mat[0]*x+mat[4]*y+mat[8]*z+mat[12],
                        y1 = mat[1]*x+mat[5]*y+mat[9]*z+mat[13],
                        z1 = mat[2]*x+mat[6]*y+mat[10]*z+mat[14];
                    (!this.vertex3[i]) && (this.vertex3[i] = {});
                    // this.vertex3[i] = {};
                    this.vertex3[i].x = x1;
                    this.vertex3[i].y = y1; 
                    this.vertex3[i].z = z1;
                }
            };

            // 翅膀
            function Wings () {
                this.vertex = [{x:0,y:-48,z:0},{x:-42,y:30,z:0},{x:-8,y:30,z:0}];
                this.vertexR = [];
                this.vertexR3 = [];
                this.index = [[0,1,2]];
                this.color = ['#fff'];
                for (var i = 0; i < this.vertex.length; i++) {
                    (!this.vertexR[i]) && (this.vertexR[i] = {});
                    this.vertexR[i].x = -this.vertex[i].x;
                    this.vertexR[i].y = this.vertex[i].y;
                    this.vertexR[i].z = this.vertex[i].z;
                };
            };
            Wings.prototype = new Object3D();
            Wings.prototype.constructor = Wings;
            Wings.prototype.upMatrixR = function(Wmatrix){
                this.matrixR = JCM.identity(JCM.create());
                JCM.translate(this.matrixR, [-this.translate.x,this.translate.y,this.translate.z], this.matrixR);
                
                JCM.rotate(this.matrixR, (this.rotate.x % 360) * this.toRAD, [1,0,0], this.matrixR);
                JCM.rotate(this.matrixR, -(this.rotate.y % 360) * this.toRAD, [0,1,0], this.matrixR);
                JCM.rotate(this.matrixR, (this.rotate.z % 360) * this.toRAD, [0,0,1], this.matrixR);

                JCM.scale(this.matrixR, [this.scale.x,this.scale.y,this.scale.z], this.matrixR);

                JCM.multiply(Wmatrix, this.matrixR, this.matrixR);
                var mat = this.matrixR;

                for(var i=0,l=this.vertexR.length;i<l;i++){
                    var x = this.vertexR[i].x,
                        y = this.vertexR[i].y,
                        z = this.vertexR[i].z,
                        x1 = mat[0]*x+mat[4]*y+mat[8]*z+mat[12],
                        y1 = mat[1]*x+mat[5]*y+mat[9]*z+mat[13],
                        z1 = mat[2]*x+mat[6]*y+mat[10]*z+mat[14];

                    (!this.vertexR3[i]) && (this.vertexR3[i] = {});
                    // console.log(this.vertexR[i])
                    this.vertexR3[i].x = x1; // 
                    this.vertexR3[i].y = y1; // 
                    this.vertexR3[i].z = z1;
                }
            };
            Wings.prototype.render = function(ctx,Wmatrix){
                this.upMatrix(Wmatrix);
                this.upMatrixR(Wmatrix);
                var index = this.index,
                    color = this.color,
                    vertex = this.vertex3,
                    vertexR = this.vertexR3;
                for(var i=0;i<index.length;i++){
                    var pp = index[i];
                    ctx.fillStyle = color[i];
                    ctx.beginPath();
                    for(var L=0;L<pp.length;L++){
                        if(L==0){
                            ctx.moveTo(vertex[pp[L]].x,vertex[pp[L]].y);
                        }else{
                            ctx.lineTo(vertex[pp[L]].x,vertex[pp[L]].y);
                        }
                    }
                    ctx.fill();
                    ctx.beginPath();
                    for(var R=0;R<pp.length;R++){
                        if(R==0){
                            ctx.moveTo(vertexR[pp[R]].x,vertexR[pp[R]].y);
                        }else{
                            ctx.lineTo(vertexR[pp[R]].x,vertexR[pp[R]].y);
                        }
                    }
                    ctx.fill();
                }
            };

            // 身体
            function Bodys () {
                this.vertex = [{x:0,y:-48,z:0},{x:-8,y:30,z:0},{x:0,y:30,z:-20}];
                this.vertexR = [];
                this.vertexR3 = [];
                this.index = [[0,1,2]];
                this.color = ['#fce2bd','#fccf90'];
                for (var i = 0; i < this.vertex.length; i++) {
                    (!this.vertexR[i]) && (this.vertexR[i] = {});
                    this.vertexR[i].x = -this.vertex[i].x;
                    this.vertexR[i].y = this.vertex[i].y;
                    this.vertexR[i].z = this.vertex[i].z;
                };
            };
            Bodys.prototype = new Object3D();
            Bodys.prototype.constructor = Bodys;
            Bodys.prototype.upMatrixR = function(Wmatrix){
                this.matrixR = JCM.identity(JCM.create());
                JCM.translate(this.matrixR, [-this.translate.x,this.translate.y,this.translate.z], this.matrixR);
                
                JCM.rotate(this.matrixR, (this.rotate.x % 360) * this.toRAD, [1,0,0], this.matrixR);
                JCM.rotate(this.matrixR, -(this.rotate.y % 360) * this.toRAD, [0,1,0], this.matrixR);
                JCM.rotate(this.matrixR, (this.rotate.z % 360) * this.toRAD, [0,0,1], this.matrixR);

                JCM.scale(this.matrixR, [this.scale.x,this.scale.y,this.scale.z], this.matrixR);

                JCM.multiply(Wmatrix, this.matrixR, this.matrixR);
                var mat = this.matrixR;

                for(var i=0,l=this.vertexR.length;i<l;i++){
                    var x = this.vertexR[i].x,
                        y = this.vertexR[i].y,
                        z = this.vertexR[i].z,
                        x1 = mat[0]*x+mat[4]*y+mat[8]*z+mat[12],
                        y1 = mat[1]*x+mat[5]*y+mat[9]*z+mat[13],
                        z1 = mat[2]*x+mat[6]*y+mat[10]*z+mat[14];

                    (!this.vertexR3[i]) && (this.vertexR3[i] = {});
                    // console.log(this.vertexR[i])
                    // this.vertexR3[i].x = x1*(800/(z1+800)); // 
                    // this.vertexR3[i].y = y1*(800/(z1+800)); //
                    this.vertexR3[i].x = x1; // 
                    this.vertexR3[i].y = y1; // 
                    this.vertexR3[i].z = z1;
                }
            };
            Bodys.prototype.multDif = function(p1,p2){
                return p1.x*p2.y - p1.y*p2.x;
            };
            Bodys.prototype.render = function(ctx,Wmatrix){
                this.upMatrix(Wmatrix);
                this.upMatrixR(Wmatrix);
                var index = this.index,
                    color = this.color,
                    vertex = this.vertex3,
                    vertexR = this.vertexR3;
                for(var i=0;i<index.length;i++){
                    var pp = index[i];
                    var p1 = {x: vertex[pp[1]].x-vertex[pp[0]].x,y: vertex[pp[1]].y-vertex[pp[0]].y};
                    var p2 = {x: vertex[pp[2]].x-vertex[pp[1]].x,y: vertex[pp[2]].y-vertex[pp[1]].y};
                    if(this.multDif(p1,p2)>=0){
                        ctx.fillStyle = color[0];                        
                    }else{
                        ctx.fillStyle = color[1];                        
                    }
                    ctx.beginPath();
                    for(var L=0;L<pp.length;L++){
                        if(L==0){
                            ctx.moveTo(vertex[pp[L]].x,vertex[pp[L]].y);
                        }else{
                            ctx.lineTo(vertex[pp[L]].x,vertex[pp[L]].y);
                        }
                    }
                    ctx.fill();
                    var p3 = {x: vertexR[pp[1]].x-vertexR[pp[0]].x,y: vertexR[pp[1]].y-vertexR[pp[0]].y};
                    var p4 = {x: vertexR[pp[2]].x-vertexR[pp[1]].x,y: vertexR[pp[2]].y-vertexR[pp[1]].y};
                    if(this.multDif(p3,p4)>=0){
                        ctx.fillStyle = color[1];                        
                    }else{
                        ctx.fillStyle = color[0];                        
                    }
                    ctx.beginPath();
                    for(var R=0;R<pp.length;R++){
                        if(R==0){
                            ctx.moveTo(vertexR[pp[R]].x,vertexR[pp[R]].y);
                        }else{
                            ctx.lineTo(vertexR[pp[R]].x,vertexR[pp[R]].y);
                        }
                    }
                    ctx.fill();
                }
            };

            // 纸飞机
            function CanvasPlane (argument) {                
                this.bodys = new Bodys();
                this.wings = new Wings();
            };
            CanvasPlane.prototype = new Object3D();
            CanvasPlane.prototype.constructor = CanvasPlane;
            CanvasPlane.prototype.render = function(ctx){
                this.upMatrix();
                this.bodys.render(ctx,this.matrix);
                this.wings.render(ctx,this.matrix);
            }
            CanvasPlane.prototype.upMatrix = function(){
                this.matrix = JCM.identity(JCM.create());
                this.translateXYZ();
                this.rotateXYZ();
                this.scaleXYZ();
            };

            // 初始化
            var H = window.innerHeight - 78;
            var canvas = element[0];
                ctx = canvas.getContext('2d');
            canvas.style.height = H*3 + 'px';
            canvas.height = H*3;
            var canvasPlane = new CanvasPlane();
            
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

            // 获取切线角度
            function getDeg(p1,p2){
                var dis = Math.sqrt(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2)),
                    innePro = p1.x-p2.x,
                    multDif = p2.y-p1.y,
                    deg = Math.acos(innePro/dis);
                deg = (multDif > 0)?-deg*180/Math.PI:deg*180/Math.PI;
                return deg;
            }
            // 高阶贝塞尔曲线
            function higherBezierCurve(aPoints,rate){
                var a = aPoints,
                    len = a.length,
                    t = rate,
                    rT = 1-t,
                    l = a.slice(0,len-1),
                    r = a.slice(1),
                    oP = {};
                if(len>3){
                    var oL = higherBezierCurve(l,t),
                        oR = higherBezierCurve(r,t);
                        oP.x = rT*oL.x + t*oR.x;
                        oP.y = rT*oL.y + t*oR.y;
                    return oP;
                }else{
                    oP.x = rT*rT*aPoints[0].x+2*t*rT*aPoints[1].x+t*t*aPoints[2].x;
                    oP.y = rT*rT*aPoints[0].y+2*t*rT*aPoints[1].y+t*t*aPoints[2].y;
                    return oP;
                };
            };
            var Tween = {
                linear: function (t, b, c, d){  //匀速
                    return c*t/d + b;
                },
                easeIn: function(t, b, c, d){  //加速曲线
                    return c*(t/=d)*t + b;
                },
                easeOut: function(t, b, c, d){  //减速曲线
                    return -c *(t/=d)*(t-2) + b;
                },
                easeBoth: function(t, b, c, d){  //加速减速曲线
                    if ((t/=d/2) < 1) {
                        return c/2*t*t + b;
                    }
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                } 
            };
            // 飞机贝塞尔曲线变换
            function canvasPlaneBezier(aPoints,time,fx,cb){
                var startTime = new Date().getTime();
                function letGo(){
                    var nowTime = new Date().getTime(),
                        progress = nowTime-startTime,
                        stop = progress>time;

                    var ptn = Tween[fx]( progress, 0, 1, time);
                    // var ptnR = Tween[fx]( progress, -100, -50, time);

                    var point = higherBezierCurve(aPoints,ptn);
                    var p1 = higherBezierCurve(aPoints,ptn-0.005);
                    var p2 = higherBezierCurve(aPoints,ptn+0.005);
                    var deg = getDeg(p1,p2);

                    if(stop){
                        point =aPoints[aPoints.length-1];
                        cb&&cb();
                    }else{
                        requestAnimationFrame(letGo)
                    };
                    canvasPlane.translate.x = point.x;
                    canvasPlane.translate.y = point.y;
                    if(deg){
                        canvasPlane.rotate.z = deg-90;
                        
                    }
                    //ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
                    // ctx.fillStyle='#FFFF00';
                    // ctx.fillRect(90,0,120,50);
                    // ctx.fillStyle='#FF0000';
                    // ctx.beginPath();
                    // ctx.arc(point.x,point.y,8,0,2*Math.PI);
                    // ctx.fill();
                }
                requestAnimationFrame(letGo)
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
            


            // wingFly();
            // bodyFly();
            // canvasPlane.rotate.z = 100;
            // canvasPlane.rotate.y = -10;
            // canvasPlane.rotate.x = 68;
            canvasPlane.rotate.z = -30;
            canvasPlane.rotate.y = -30;
            canvasPlane.rotate.x = 30;

            canvasPlane.translate.x = 550;
            canvasPlane.translate.y = 150;
            // canvasPlane.translate.x = 220;
            // canvasPlane.translate.y = H - 50;
            go()
            function go(){
                ctx.clearRect(0,0,900,H*3);
                canvasPlane.render(ctx);
                requestAnimationFrame(go);
            };

            // 飞机出场动画
            canvasPlaneBezier([{x: 220,y:H - 50},{x: -600,y:-200},{x: 1800,y:0},{x: -100,y:H - 300},{x: 500,y: H - 100}],5200,'linear',function(){});
            TweenMax.to(canvasPlane.rotate, 2, {x:80,y:-10,'onComplete':function(){
                TweenMax.to(canvasPlane.rotate, 1.8, {x:20,'onComplete':function(){
                    TweenMax.to(canvasPlane.rotate, 1.4, {x:68,y:5, ease: Power1.easeInOut});

                }});

            }});

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

            function fly_pro0(){
                canvasPlaneBezier([{x: 100,y:50},{x: 1400,y:H/3},{x: -700,y:H*2/3},{x: 800,y:H-60}],5000,'linear');
            };
            function fly_pro1(){
                canvasPlaneBezier([{x: 800,y:H-60},{x: 1000,y:H+H/3},{x: -700,y:H+H*2/3},{x: 750,y:2*H-60}],2000,'linear');
            };
            function fly_back_pro1(){
                canvasPlaneBezier([{x: 750,y:2*H-60},{x: -700,y:H+H*2/3},{x: 1000,y:H+H/3},{x: 800,y:H-60}],1500,'linear');
            };
            function fly_pro2(){
                canvasPlaneBezier([{x: 750,y:2*H-60},{x: 1000,y:2*H+H/3},{x: -700,y:2*H+H*2/3},{x: 450,y:3*H-60}],2000,'linear');
            };
            function fly_back_pro2(){
                canvasPlaneBezier([{x: 450,y:3*H-60},{x: -700,y:2*H+H*2/3},{x: 1000,y:2*H+H/3},{x: 750,y:2*H-60}],1500,'linear');
            };

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
                        // $block.eq(iNow).css({'-webkit-transform': 'translateY(-100%)','transform': 'translateY(-100%)'});
                        iNow++;
                        // $block.eq(iNow).css({'-webkit-transform': 'translateY(0)','transform': 'translateY(0)'});
                        // if(iNow==1){
                        //     fly_pro1();
                        // }else if(iNow==2){
                        //     fly_pro2();
                        // };
                        // element.css({'-webkit-transform': 'translate(0,'+-H+'px)','transform': 'translate(0,'+-iNow*H+'px)','transition': '1.5s'})
                        $blockDotA.eq(iNow).addClass('active').siblings().removeClass('active');
                        setTimeout(function(){
                            canScroll = true;
                        },1500)
                    };
                }else if(ev.delta > 0){
                   if( iNow > 0) {
                        canScroll = false;
                        // $block.eq(iNow).css({'-webkit-transform': 'translateY(100%)','transform': 'translateY(100%)'});
                        iNow--;
                        // $block.eq(iNow).css({'-webkit-transform': 'translateY(0)','transform': 'translateY(0)'});
                        $blockDotA.eq(iNow).addClass('active').siblings().removeClass('active');
                        // if(iNow==0){
                        //     fly_back_pro1();
                        // }else if(iNow==1){
                        //     fly_back_pro2();
                        // };
                        // element.css({'-webkit-transform': 'translate(0,'+-H+'px)','transform': 'translate(0,'+-iNow*H+'px)','transition': '1.5s'});
                        setTimeout(function(){
                            canScroll = true;
                        },1500)
                    }; 
                }
            });
        }
    }
}]);