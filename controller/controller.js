

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

var waterfallModule = angular.module('WaterfallModule', []);

waterfallModule.directive('waterfall', function($timeout, $window, WaterfallList) {
    return {
        restrict:"AE",
        replace: true,
        transclude: true,
        template: '<ul class="share_list" ng-transclude></ul>',
        link: function(scope,element,attrs){
            var $waterfall = element,
                $li,
                window = angular.element($window),
                line = 4,      //固定列数
                aLinew = [],  //固定left数组
                canGet = true,
                n_p = 0,//当前页数
                n = 6,  //一次请求数量
                i_now = 0;
            
            element.bind('mouseenter', function(event) {
                //scope.loadData();
                // scope.$apply("loadData()");
                // 注意这里的坑，howToLoad会被转换成小写的howtoload
                // scope.$apply(attrs.howtoload);
            });
            // window.bind('resize',function(){
            //     reset_c();
            // })
            reqData();
            $('.main').scroll(function(){
                console.log(window.scrollTop()+window.height() >= $waterfall.height() + $waterfall.offset().top)
                if(canGet && window.scrollTop()+window.height() >= $waterfall.height() + $waterfall.offset().top){
                    reqData();
                }
            })
            // $waterfall.on('click', '.waterfall_wrap',function(){
            //     $('#modal-overlay').addClass('open');
            // })
            // $('#modal-overlay').on('click','.close-modal', function(){
            //     $(this).parents('#modal-overlay').removeClass('open');
            // })
            function reqData(){
                $timeout(function(){
                    WaterfallList.getWaterfallData(n_p, n)
                        .success(function(data, status){
                            // console.log(data)
                            create_c(data);
                        })
                },200);
            }
            function create_c(data){
                var str = '';
                $li = $waterfall.children('li');
                ($li.length>0)?i_now = $li.length:i_now =0;

                for (var i = 0; i < data.length; i++) {
                    if(data[i].image){
                        str += '<li><a href="javascript:;"><img src="'+ data[i].image +'" /> <div class="info"> <div class="title">'+ data[i].title +'</div> <div class="time">'+ data[i].detail +'</div> </div> </a></li>';
                    }else{
                        str += '<a class="waterfall_wrap"> <div class="waterfall_wrap_b"><h3 class="title">'+ data[i].title +'</h3> <p class="detail">'+ data[i].detail +'</p> </div> </a>' ; 
                    }
                };
                $waterfall.append(str);
                $timeout(function(){
                    reset_c();
                },50)
                
            }
            
            function reset_c(){
                canGet = false;
                $li = $waterfall.children('li');
                
                var $li_first = $li.eq(0),
                    $li_first_w = $li_first.width();
                    // waterfall_w = waterfall.offsetWidth;
                    // waterfall_w = $waterfall.width();
                // line = Math.round(waterfall_w/waterfall_fc_w);
                // console.log('ww::' + waterfall_w + 'sw::' + waterfall_fc_w)
                if(!i_now){
                    for (var i = 0; i < line; i++) {
                        aLinew.push(($li_first_w+ 16)*i );
                    };
                };
                for (var i = i_now; i < $li.length; i++) {
                    if(i < line){
                        $li.eq(i).css({'left': aLinew[i]+'px', 'top': 0});
                    }
                    else{
                        var minTop = getTop(i);
                        $li.eq(i).css({'left': minTop.left+'px', 'top':( minTop.top+16)+'px'});
                    }
                };
                var MaxTop = getTop($li.length, true);
                // console.log(MaxTop);
                $waterfall.css({'height': MaxTop.top});
                // $('#work').css({'width': window.width()});
                canGet = true;

            }

            function getTop(now, bMax){
                var aLineB = [],
                    aMin = [],
                    iReturn = 0;
                for (var j = 0; j < line; j++) {
                    aLineB.push(true)
                }
                for (var i = now-1; i >= 0; i--) {
                    console.log(iReturn)
                    for (var j = 0; j < line; j++) {
                        if(iReturn >= line){
                            // return;
                        }
                        if(aLineB[j] && parseInt($li.eq(i)[0].style.left) == aLinew[j]){

                            aMin.push( { 'left': aLinew[j], 'top':  parseInt($li.eq(i)[0].style.top)  + $li.eq(i)[0].offsetHeight, 'i': i } );
                            iReturn++;
                            aLineB[j] = false;
                        }
                    };
                };
                aMin.sort(Sorts);

                // console.log(aMin);
                function Sorts(a,b){
                    return a.top - b.top;
                }
                return bMax ? aMin[aMin.length-1] : aMin[0];
            }
        }
    } 
});

waterfallModule.factory('WaterfallList', ['$http', function($http){
    var reqWaterfallData = function(n_p, n){
        return $http({
            method: 'GET',
            url: 'data/data.json'
        })
    }
    return{
        'getWaterfallData':function(n_p, n){

            // console.log(223334)          
            return reqWaterfallData(n_p, n)
        }
    }
}]);

var homeModule = angular.module("HomeModule", []);

homeModule.directive('canvaswave',['$timeout', '$rootScope',function($timeout,$rootScope) {
    return {
        restrict: 'AE',
        replace: true,   
        link: function(scope, element, attrs) {
            var parent = element.parents('.home_mid');          
            // console.log(element.parent('.page0').width())
            function lines(){
                this.canvas = element[0];
                this.ctx = this.canvas.getContext('2d');
                this.W = element.width();
                this.H = 1200;
                this.aLine = [{'posX': 20},{'posX': 220},{'posX': 450},{'posX': 680},{'posX': 880}];
                this.oLines= [];
                this.gener();
                this.resize();
                // window.onresize = function(){
                //     // this.W = parent.width(),
                //     // this.H =window.innerHeight*2;
                //     this.resize();
                // };

            }
            lines.prototype.resize = function(){
                // this.canvas.width = this.W;
                this.canvas.height = this.H;
                // this.canvas.style.width = this.W;
                this.canvas.style.height = this.H;
            };
            lines.prototype.line = line;
            lines.prototype.gener = function(){
                for (var i = 0; i < this.aLine.length; i++) {
                    var tt = new this.line(this);
                    this.oLines.push(tt);
                    this.oLines[i].reset(this.aLine[i]);
                    
                };
                this.frame();
            }

            lines.prototype.frame = function(){
                var _this = this;
                this.ctx.clearRect(0,0,this.W,this.H);
                for (var i = 0; i < _this.oLines.length; i++) {
                    _this.oLines[i].draw();
                };
                window.requestAnimationFrame(function(){
                    _this.frame();
                });
            };

            function line(p){
                this.p = p;
                this.ss = 40;
                this.T = 300;
                this.ww = Math.PI*2/this.T;
                this.Ao;
                this.posX = 0;
                this.len = 0;
                this.length = this.p.H;
                this.s_v = Math.random()+2;
            };
            line.prototype.reset = function(json){
                for(var attr in json){
                    this[attr] = json[attr];
                }
            };
            line.prototype.draw = function(){
                var H = this.p.H;
                this.ss += 1;
                this.len = this.length;
                // this.len = (this.len> this.length )? this.length :(this.len += this.s_v);
                
                
                this.p.ctx.beginPath();
                // this.p.ctx.moveTo(0, H+0.5);
                this.p.ctx.strokeStyle = '#40bda8';
                this.staticA = 20;
                this.deltT = 0;
                this.tdeltX = this.p.W/2 - this.posX;
                for (var i = 0; i <= this.len ; i++) {

                    
                    // var A = 30*((H/2 - Math.abs(i - H/2)) /H/2);
                    // console.log( (H/2 - Math.abs(i - H/2))/(H/2) )
                    // var A = (H/2 - Math.abs(i - H/2)/H/2)/(5+ss/10);
                    // var y = ~~A*Math.sin((i- H/2-this.T/4 - this.ss*5)*this.ww );
                    // this.p.ctx.lineTo( this.posX+0.5+y,i);
                    // if(this.p.H - i <= 350){
                    //     // this.deltT = this.tdeltX/350*(i-(this.p.H-350));
                    //     this.deltT =this.tdeltX -  this.tdeltX*Math.sqrt((350-(i-(this.p.H-350)))/350);
                    // }
                    this.deltT = this.tdeltX-this.tdeltX*Math.sqrt( Math.sqrt((this.p.H-i)/this.p.H) );                        
                    if(this.tdeltX >= 0){
                        var y = ~~this.staticA*Math.sin((i)*this.ww-this.ss/15 ) + this.deltT;
                    }
                    else {
                        var y = ~~ -this.staticA*Math.sin((i)*this.ww-this.ss/15 ) + this.deltT;

                    }

                    this.p.ctx.lineTo( this.posX+0.5+y,i);
                };
                    
                // y   var y = ~~this.staticA*Math.sin((this.len)*this.ww-this.ss/15 ) + this.len/8;
                // p0  this.posX+0.5+y  this.len
                // p1  this.p.W/2  this.p.H
                // pc  this.posX+0.5+y
                // var yMax = ~~this.staticA*Math.sin((this.len)*this.ww-this.ss/15 ) + this.len/8;
                // this.p.ctx.quadraticCurveTo(this.posX+0.5+yMax,this.p.H,this.p.W/2,this.p.H);
                this.p.ctx.stroke();
                this.p.ctx.closePath();
            };

            new lines();
            
                
            
        },
        template: '<canvas width="900"></canvas>'
   }
}]);

var expModule = angular.module("ExpModule", []);
expModule.directive('canvasPlane',['$timeout', '$rootScope',function($timeout,$rootScope) {
    return {
        restrict: 'AE',
        replace: true,   
        template: '<canvas width="900" height="630"></canvas>',
        link: function(scope, element, attrs) {
            var JCM = new matIV();
            // console.log(JCM.create())
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
                    this.vertex3[i].x = x1*(800/(z1+800)); // 
                    this.vertex3[i].y = y1*(800/(z1+800)); // 
                    this.vertex3[i].z = z1;
                }
            };

            function Wings () {
                this.vertex = [{x:0,y:-58,z:0},{x:-72,y:30,z:0},{x:-18,y:38,z:0}];
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
                    this.vertexR3[i].x = x1*(800/(z1+800)); // 
                    this.vertexR3[i].y = y1*(800/(z1+800)); // 
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
            function Bodys () {
                this.vertex = [{x:0,y:-58,z:0},{x:-18,y:38,z:0},{x:-1,y:60,z:0}];
                this.vertexR = [];
                this.vertexR3 = [];
                this.index = [[0,1,2]];
                this.color = ['#fce2bd'];
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
                    this.vertexR3[i].x = x1*(800/(z1+800)); // 
                    this.vertexR3[i].y = y1*(800/(z1+800)); // 
                    this.vertexR3[i].z = z1;
                }
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

            function CanvasPlane (argument) {
                
                this.wings = new Wings();
                this.bodys = new Bodys();
            };
            CanvasPlane.prototype = new Object3D();
            CanvasPlane.prototype.constructor = CanvasPlane;
            CanvasPlane.prototype.render = function(ctx){
                this.upMatrix();
                this.wings.render(ctx,this.matrix);
                this.bodys.render(ctx,this.matrix);
            }
            CanvasPlane.prototype.upMatrix = function(){
                this.matrix = JCM.identity(JCM.create());
                this.translateXYZ();
                this.rotateXYZ();
                this.scaleXYZ();
            };

            var canvas = element[0];
                ctx = canvas.getContext('2d');
            var canvasPlane = new CanvasPlane();
            canvasPlane.scale.x = canvasPlane.scale.y = canvasPlane.scale.z = .6;
            canvasPlane.rotate.z = -10;
            // canvasPlane.wings.rotate.y = -70;
            // canvasPlane.bodys.rotate.y = -70;
            
            // TweenMax.to(canvasPlane.wings.rotate, time, {y:to, onComplete:function(){wingFly()}, ease: Power1.easeInOut});
            
            
            // wingFly();
            var bb = true;
            function wingFly(){
                var to = bb?50:-30,
                    time = bb?0.5:0.6;
                    bb=!bb;
                TweenMax.to(canvasPlane.wings.rotate, time, {y:to, onComplete:function(){wingFly()}, ease: Power1.easeInOut});
            }
            // bodyFly();
            var dd = true;
            function bodyFly(){
                var to = dd?-60:30,
                    time = dd?0.5:0.6;
                    dd=!dd;
                TweenMax.to(canvasPlane.bodys.rotate, time, {y:to, onComplete:function(){bodyFly()}, ease: Power1.easeInOut});
            }
            function higherBezierCurve(aPoints,rate){
                var a = aPoints,
                    len = a.length,
                    t = rate,
                    rT = 1-t,
                    l = a.slice(0,len-1),
                    r = a.slice(1),
                    oP = {};

                if(len>3){
                    var oL = this.higherBezierCurve(l,t),
                        oR = this.higherBezierCurve(r,t);

                        oP.x = rT*oL.x + t*oR.x;
                        oP.y = rT*oL.y + t*oR.y;
                        // oP.z = rT*oL.z + t*oR.z;

                    return oP;
                }else{
                    oP.x = rT*rT*aPoints[0].x+2*t*rT*aPoints[1].x+t*t*aPoints[2].x;
                    oP.y = rT*rT*aPoints[0].y+2*t*rT*aPoints[1].y+t*t*aPoints[2].y;
                    // oP.z = rT*rT*aPoints[0].z+2*t*rT*aPoints[1].z+t*t*aPoints[2].z;

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
                },
                easeInStrong: function(t, b, c, d){  //加加速曲线
                    return c*(t/=d)*t*t*t + b;
                },
                easeOutStrong: function(t, b, c, d){  //减减速曲线
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
                    if ((t/=d/2) < 1) {
                        return c/2*t*t*t*t + b;
                    }
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                },
                elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
                    if (t === 0) { 
                        return b; 
                    }
                    if ( (t /= d) == 1 ) {
                        return b+c; 
                    }
                    if (!p) {
                        p=d*0.3; 
                    }
                    if (!a || a < Math.abs(c)) {
                        a = c; 
                        var s = p/4;
                    } else {
                        var s = p/(2*Math.PI) * Math.asin (c/a);
                    }
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
                    if (t === 0) {
                        return b;
                    }
                    if ( (t /= d) == 1 ) {
                        return b+c;
                    }
                    if (!p) {
                        p=d*0.3;
                    }
                    if (!a || a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    } else {
                        var s = p/(2*Math.PI) * Math.asin (c/a);
                    }
                    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                },    
                elasticBoth: function(t, b, c, d, a, p){
                    if (t === 0) {
                        return b;
                    }
                    if ( (t /= d/2) == 2 ) {
                        return b+c;
                    }
                    if (!p) {
                        p = d*(0.3*1.5);
                    }
                    if ( !a || a < Math.abs(c) ) {
                        a = c; 
                        var s = p/4;
                    }
                    else {
                        var s = p/(2*Math.PI) * Math.asin (c/a);
                    }
                    if (t < 1) {
                        return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
                                Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    }
                    return a*Math.pow(2,-10*(t-=1)) * 
                            Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
                },
                backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
                    if (typeof s == 'undefined') {
                       s = 3.70158;
                    }
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                backOut: function(t, b, c, d, s){
                    if (typeof s == 'undefined') {
                        s = 3.70158;  //回缩的距离
                    }
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                }, 
                backBoth: function(t, b, c, d, s){
                    if (typeof s == 'undefined') {
                        s = 1.70158; 
                    }
                    if ((t /= d/2 ) < 1) {
                        return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    }
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                },
                bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
                    return c - this['bounceOut'](d-t, 0, c, d) + b;
                },       
                bounceOut: function(t, b, c, d){
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
                    }
                    return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
                },      
                bounceBoth: function(t, b, c, d){
                    if (t < d/2) {
                        return this['bounceIn'](t*2, 0, c, d) * 0.5 + b;
                    }
                    return this['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
                }
            };
            function canvasPlaneBezier(aPoints,time,fx){
                var startTime = new Date().getTime();
                function letGo(){
                    var nowTime = new Date().getTime(),
                        progress = nowTime-startTime,
                        stop = progress>time;

                    var ptn = Tween[fx]( progress, 0, 1, time);
                    var ptnR = Tween[fx]( progress, -100, -50, time);

                    var point = higherBezierCurve(aPoints,ptn);

                    if(stop){
                        point =aPoints[aPoints.length-1];
                    }else{
                        requestAnimationFrame(letGo)
                    };
                    // console.log(ptn)
                    canvasPlane.translate.x = point.x;
                    canvasPlane.translate.y = point.y;
                    canvasPlane.rotate.z = ptnR;

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
            
            canvasPlane.translate.x = 800;
            canvasPlane.translate.y = 100;
            // canvasPlane.rotate.x = -40;
            go()
            function go(){
                ctx.clearRect(0,0,900,1200);
                ctx.save();
                canvasPlane.render(ctx);
                ctx.restore();
                requestAnimationFrame(go);
            }
            canvasPlaneBezier([{x: 800,y:100},{x: 400,y:150},{x: 300,y:300}],1200,'linear')
            // var initSTop = 0,
            //     bS = true;
            // $('.experience').on('scroll', function(ev){
            //     // console.log(ev)
            //     // console.log($(this).scrollTop());
            //     if(!bS) return;

            //     var nowSTop = $(this).scrollTop();
                
            //     if(nowSTop - initSTop >= 0){
            //         // console.log('xia')
            //         if(scrollTop > 0 && scrollTop <= 100){
            //             bS = false;
            //             $(this).animate({'scrollTop': 500},300,'linear',function(){
            //                 bS = true;
            //                 nowSTop = $(this).scrollTop();
            //                 initSTop = nowSTop;
            //             });
            //         }
            //         else if(scrollTop > 500 && scrollTop <= 600){
            //             // $(this).scrollTo(1000,500);
            //             $(this).animate({'scrollTop': 1000},300);

            //         }
            //     }else{
            //         // console.log('shang')
            //     };
            //     setTimeout(function(){
            //         initSTop = nowSTop;
            //     },0)
            // })





        }
    }
}]);


