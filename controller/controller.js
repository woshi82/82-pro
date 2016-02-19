

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

homeModule.directive('hometop',['$rootScope',function($rootScope) {
    return {
        restrict: 'AE',
        replace: true,  
        transclude: true,
        template:'<div class="home_top" ng-transclude></div>' ,
        link: function(scope, element, attrs) {
            var $arrowLeft = element.find('.arrow_left'),
                $arrowRight = element.find('.arrow_right'),
                $tConList = element.find('.t_con_list'),
                $lis = $tConList.children('li'),
                iLen = $lis.length;
                iNow = 0;
            $arrowRight.click(function(){
                if(iNow <= 0) return;
                iNow--;
                $tConList.css({'transform': 'translateX('+-iNow*900+'px)'})
            })
            $arrowLeft.click(function(){
                if(iNow >= iLen-1) return;
                iNow++;
                $tConList.css({'transform': 'translateX('+-iNow*900+'px)'})
            })
        }

    }

}]);
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

homeModule.directive('canvasparticle',['$rootScope',function($rootScope) {
    return {
        restrict: 'AE',
        replace: true,   
        link: function(scope, element, attrs) {
            function sliderPartical(){
                this.canvas = element[0];
                this.srcCanv = document.createElement('canvas');
                this.body = document.getElementsByTagName('body')[0];
                this.body.appendChild(this.srcCanv);
                this.srcCanv.style.display = 'none';
                this.srcCtx = this.srcCanv.getContext('2d');
                this.ctx = this.canvas.getContext('2d');

                this.pxlBuffer = [];
                this.pixelGap = 1;
                this.swipeOffset = 0;
                
                this.resizeCanvas();
                this.loadImage();

                this.mouseforce = 5e3;
                this.restless = !0;

                var This = this;
                this.canvas.onmousemove = function(e){
                    This.mx = e.pageX;
                    This.my = e.pageY;
                }
                This.canvas.onmouseout = function(e){
                    This.mx = -1;
                    This.my = -1;
                }

            }
            sliderPartical.prototype.requestAnimationFrame = function(fn){
                var rAF=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(fn){window.setTimeout(fn,1e3/60)};
                rAF(fn);

            }
            sliderPartical.prototype.resizeCanvas = function(){
                this.cw = 900;
                this.ch = 420;
                this.canvas.width = this.cw;
                this.canvas.height = this.ch;
            }
            sliderPartical.prototype.loadImage = function(){
                var _this = this;
                _this.img = new Image();
                _this.img.src = '../images/logo_effect.png';
                
                _this.img.onload = function(){
                    $('.homeTop_but1').click(function(){
                        $(this).hide();
                        _this.init();                        
                    });

                    // window.addEventListener('mousemove', function(e){
                    //  _this.mousemove(e);
                    // }, false);
                }
            }
            sliderPartical.prototype.init = function(){
                var This = this;
                this.srcCanv.width = this.img.width;
                this.srcCanv.height = this.img.height;
                this.srcCtx.clearRect(0,0,this.srcCanv.width, this.srcCanv.height)
                this.srcCtx.drawImage(this.img, 0, 0 );
                var result_data = this.getPixelFromImageData(this.srcCtx.getImageData(0,0,this.srcCanv.width, this.srcCanv.height), ~~((this.cw-this.srcCanv.width)/2), ~~((this.ch-this.srcCanv.height)/2))
                this.shuffle(result_data);
                // console.log(result_data);
                // this.drawPartical(result_data);
                for (var i = 0; i < result_data.length; i++) {
                    var psPartical = new this.partical(this);
                    psPartical.gravityX = result_data[i].x;
                    psPartical.gravityY = result_data[i].y;
                    psPartical.color = result_data[i].color;
                    this.pxlBuffer.push(psPartical);
                };

                This.requestAnimationFrame(function(){
                    This.nextFrame();
                })

            }
            sliderPartical.prototype.nextFrame = function(){
                var This = this;
                // this.swipeOffset = this.mx<this.cw/2||this.mx>this.cw/2?this.mx-this.cw/2:0;
                for (var i = 0; i < this.pxlBuffer.length; i++) {
                    this.pxlBuffer[i].move();
                };
                // console.log(~~this.pxlBuffer[2001].x);
                this.drawPartical(this.pxlBuffer);
                setTimeout(function(){
                    This.requestAnimationFrame(function(){
                        This.nextFrame();
                    })
                }, 15);
                
            }
            sliderPartical.prototype.shuffle = function(data){
                for (var a,b,c = 0,d=data.length; d < c; c++) 
                    b = Math.floor(Math.random()*d),
                    a = data[c],
                    data[c] = data[b],
                    data[b] = a
            }
            sliderPartical.prototype.getPixelFromImageData = function(data, deltW, deltH){
                for (var i = 0, newData = []; i < data.width; i += this.pixelGap+1)
                    for (var j = 0; j < data.height; j += this.pixelGap+1)
                        n = 4*(j*data.width + i),
                        data.data[n+3] > 0 && newData.push({
                            x: i + deltW,
                            y: j + deltH,
                            color: [data.data[n+0], data.data[n+1], data.data[n+2], data.data[n+3]]
                        });
                return newData;
            }
            sliderPartical.prototype.drawPartical = function(result_data){
                var newImg = this.ctx.createImageData(this.cw, this.ch),
                    newImgData = newImg.data;
                    // console.log(newImgData.width);
                for (var i = 0; i < result_data.length; i ++){
                    n = 4*(~~result_data[i].y*this.cw + ~~result_data[i].x);
                    newImgData[n] = result_data[i].color[0];
                    newImgData[n+1] = result_data[i].color[1];
                    newImgData[n+2] = result_data[i].color[2];
                    newImgData[n+3] = result_data[i].color[3];
                    // console.log(result_data[i].color);

                }
                this.ctx.putImageData(newImg, 0, 0 );
            }
            sliderPartical.prototype.partical = psPartical;


            function psPartical(pointer){
                this.p = pointer;
                this.ttl=null;
                this.color= null;
                this.next=null;
                this.prev=null;
                this.gravityX=0;
                this.gravityY=0;
                // this.movex = 0;
                // this.movey = 0
                this.x=Math.random()*pointer.cw;
                this.y=Math.random()*pointer.ch;
                this.velocityX=10*Math.random()-5;
                this.velocityY=10*Math.random()-5 ;
            }
            psPartical.prototype.move = function(){
                var pointer = this.p,
                    deltx = this.gravityX - this.x,
                    delty = this.gravityY - this.y,
                    dis = Math.sqrt(Math.pow(deltx,2)+Math.pow(delty,2)),
                    ang = Math.atan2(delty,deltx),
                    accel = dis*0.01,
                    maccel = 0,
                    mang = 0;

                    // 1==pointer.restless
                    //  ?accel+=.1*Math.random()-.05
                    //  :.01>accel
                    //      &&(this.x=this.gravityX+.25,
                    //      this.y=this.gravityY+.25);

                if(pointer.mx >= 0 && pointer.mouseforce) {
                    var mdeltx = pointer.mx - this.x,
                        mdelty = pointer.my - this.y;
                    // if(mdis < 50) {
                        // this.movex = mdeltx*pointer.mx/mdis + pointer.mx,
                        // this.movey = mdelty*pointer.my/mdis + pointer.my,

                        mang = Math.atan2(mdelty,mdeltx),
                        maccel = Math.min(pointer.mouseforce/(Math.pow(mdeltx,2)+Math.pow(mdelty,2)), pointer.mouseforce),
                        mang+=Math.PI,
                        maccel*=.01+.1*Math.random()-.05;
                    // }
                        
                    // else {
                    //  this.movex = 0,
                    //  this.movey = 0;
                    // }
                        
                }
                accel+= Math.random()*.1 - .05;
                this.velocityX += accel*Math.cos(ang) + maccel*Math.cos(mang);
                this.velocityY += accel*Math.sin(ang) + maccel*Math.sin(mang);
                this.velocityX *= .92;
                this.velocityY *= .92;
                this.x += this.velocityX;
                this.y += this.velocityY;

            }




            var sliderPartical = new sliderPartical();

        }

    }

}]);
homeModule.directive('canvaslines',['$rootScope',function($rootScope) {
    return {
        restrict: 'AE',
        replace: true,   
        link: function(scope, element, attrs) {
            function irregular(){
                this.points = [];
                this.cSize = {
                    'width': window.innerWidth+200,
                    'height': 800
                };
                this.aSelP = [];
                
                // ['#2D2C2C', '#343232', '#373737', '#3D3C3C']
                this.init();
                // console.log(( Math.asin(-0.5) + 2*Math.PI)/Math.PI *180);
            }
            irregular.prototype.init = function(){ 
                this.getC();
                this.getPos();
                // this.drawPoint();
                this.getClosest();
                this.animate();
                // var arr = [55, 2.1, 10, 6, 390, 9];
                // arr.sort(this.sortNumber);

            }
            irregular.prototype.getC = function(){ 
                this.c = document.getElementById('canvas');
                this.ctx = this.c.getContext('2d');
                this.c.width = this.cSize.width;
                this.c.height = this.cSize.height;
            }

            irregular.prototype.getPos = function(){
                this.nowCSize = {
                    'width': 0,
                    'height': 0
                };
                this.row = 0;
                this.sideL = 150;
                while(this.nowCSize.height < this.cSize.height){
                    // console.log(222);
                    this.nowCSize.width = (this.row%2 == 0) ? 0 : this.sideL/2;
                    this.row++;
                    while(this.nowCSize.width < this.cSize.width){
                        var pTmp = new point();
                        pTmp.init({
                            'x': this.nowCSize.width,
                            'y': this.nowCSize.height
                        })
                        // console.log(this.nowCSize.width);
                        this.points.push( pTmp );
                        this.nowCSize.width += this.sideL;
                    }
                    this.nowCSize.height += Math.sin(Math.PI/3) * this.sideL;
                }
                // console.log(this.points);
            }
            irregular.prototype.animate = function(){
                var This = this;
                requestAnimationFrame(run);

                function run(){
                    This.updateLine();
                    requestAnimationFrame(run);
                }
            }
            irregular.prototype.updateLine = function(){ 
                this.ctx.clearRect(0,0,this.c.width, this.c.height);
                for (var i = 0; i < this.points.length; i++) {
                    // var i =30;
                    this.points[i].transform();
                    var aClosest = this.points[i].closest;
                    for (var j = 0; j < aClosest.length; j++) {
                        if(j >= aClosest.length-1){
                            // console.log(j);
                            this.drawLine(this.points[i], this.points[aClosest[j].index], this.points[aClosest[0].index]);
                        }               
                        else{
                            this.drawLine(this.points[i], this.points[aClosest[j].index], this.points[aClosest[j+1].index]);
                        }   
                    };
                }

            }
            
            irregular.prototype.drawLine = function(){ 
                var arg0_x = arguments[0].x + arguments[0].ta_x,
                    arg0_y = arguments[0].y + arguments[0].ta_y,
                    arg1_x = arguments[1].x + arguments[1].ta_x,
                    arg1_y = arguments[1].y + arguments[1].ta_y,
                    arg2_x = arguments[2].x + arguments[2].ta_x,
                    arg2_y = arguments[2].y + arguments[2].ta_y;

                this.ctx.strokeStyle = 'rgb(241, 245, 245)';
                var grd = this.ctx.createLinearGradient(arg0_x, arg0_y, (arg1_x+arg2_x)/2, (arg1_y+arg2_y)/2);
                grd.addColorStop(0, arguments[0].color[arguments[0].cIndex].c1);
                grd.addColorStop(1, arguments[0].color[arguments[0].cIndex].c2);
                this.ctx.fillStyle = grd;
                this.ctx.beginPath();
                this.ctx.moveTo(arg0_x, arg0_y);
                this.ctx.lineTo(arg1_x, arg1_y);
                this.ctx.lineTo(arg2_x, arg2_y);
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fill();    
            }
            irregular.prototype.Intersect = function(pA, pB, pC, pD){
                var a1 = (pA.y - pB.y)/(pA.x - pB.x);
                var a2 = (pC.y - pD.y)/(pC.x - pD.x);
                var b1 = (pA.x*pB.y - pB.x*pA.y)/(pA.x - pB.x);
                var b2 = (pC.x*pD.y - pD.x*pC.y)/(pC.x - pD.x);

                var Apro = a2*pA.x + b2 - pA.y;
                var Bpro = a2*pB.x + b2 - pB.y;
                var Cpro = a1*pC.x + b1 - pC.y;
                var Dpro = a1*pD.x + b1 - pD.y;
                return (Apro*Bpro < 0 && Cpro*Dpro < 0) ? true : false;

            }
            irregular.prototype.getClosest = function(){ 
                var This = this;
                // console.log(this.points.length);
                this.allLine = [];
                for (var i = 0; i < this.points.length; i++) {
                    // var i = 30;
                    this.aSelP = [];
                    for (var j = 0 ; j < this.points.length ; j++) {
                        if(i !== j) {
                            var dis = this.getDis(this.points[i], this.points[j]);
                            if(dis <= 150){
                                this.aSelP.push({
                                    'index': j,
                                    'dis': dis
                                });
                                this.allLine.push([i,j])
                            }
                        }
                    };

                    this.aSelP.sort(function(a, b){ 
                        return a.dis - b.dis;
                    });
                    this.aSelP = this.aSelP.slice(0, 5);
                    this.points[i].closest = this.aSelP;
                    for (var j = 0; j < this.aSelP.length; j++) {
                        this.aSelP[j].ang = this.getAngle(this.points[i], this.points[ this.aSelP[j].index ]);

                    };

                    this.points[i].closest.sort(function(a, b){ 
                        return a.ang - b.ang;
                    });
                };
            }
            irregular.prototype.getDis = function(p1, p2){ 
                return  Math.sqrt( Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) ) ;
            }
            irregular.prototype.getAngle = function(p1, p2){ 
                var dx = p1.x - p2.x,
                    dy = p1.y - p2.y,
                    r = this.getDis(p1, p2),
                    round = (dy < 0) ? Math.PI : 0,
                    symbolY = (dy >= 0) ? 0 : 1;
                    symbolX = (dx >= 0) ? 0 : 1;
                    symbol = (dx*dy >= 0) ? 0: 1;

                if(symbol){
                    if(symbolY){
                        return ( Math.asin(dy/r) + Math.PI*2 )/Math.PI *180;
                    }
                    else{
                        return ( Math.asin(-dy/r) + Math.PI )/Math.PI *180;
                    }
                }
                else{
                    if(dy <= 0 && dx < 0){
                        return ( Math.asin(-dy/r) + Math.PI)/Math.PI *180;
                    }
                    else if(dy >= 0 && dx > 0) {
                        return ( Math.asin(dy/r))/Math.PI *180;
                    }
                }
            }
            irregular.prototype.random = function(min, max){
                return min + Math.random()*(max - min);
            }

            function point(){
                this.x = 0;
                this.y = 0;
                this.closest = [];
                this.color = [
                    { 
                        'c1': '#33b1cc', 
                        'c2': '#26d7ff'
                    },
                    { 
                        'c1': '#56c4dd', 
                        'c2': '#48d6f6'
                    },
                    { 
                        'c1': '#14a0c0', 
                        'c2': '#16b5d9'
                    }
                ]
                this.cIndex = Math.floor( Math.random()*this.color.length );
                this.ta_x = Math.random()*100 - 50;
                this.ta_y = Math.random()*100 - 50;
                // this.ta_x = 0;
                // this.ta_y = 0;
                this.moveTo();
            }
            point.prototype.init = function(json){
                for(var attr in json){
                    this[attr] = json[attr];
                }
            }
            point.prototype.moveTo = function(json){
                this.life = 4000 + Math.random()*2000;
                this.to_x = Math.random()*100 - 50;
                this.to_y = Math.random()*100 - 50;
                this.s_T = new Date().getTime();

                this.f_x = this.ta_x;
                this.f_y = this.ta_y;

            }
            point.prototype.transform = function(){
                var now = new Date().getTime();
                var progress = now - this.s_T;
                if(progress < this.life){
                    this.ta_x = this.Tween['linear'](progress, this.f_x, this.to_x - this.f_x, this.life);
                    this.ta_y = this.Tween['linear'](progress, this.f_y, this.to_y - this.f_y, this.life);
                }
                else {
                    this.moveTo();
                }
                // console.log(this.ta_x);

            }
            point.prototype.Tween = {
                linear: function (t, b, c, d){  //匀速
                    return c*t/d + b;
                }
            }

            var irregular = new irregular();
        }
    }
}]);

var expModule = angular.module("ExpModule", []);
expModule.directive('canvasPlane',['$timeout', '$rootScope',function($timeout,$rootScope) {
    return {
        restrict: 'AE',
        replace: true,   
        template: '<canvas width="900"></canvas>',
        link: function(scope, element, attrs) {
            var JCM = new matIV();
            var H = (window.innerHeight - 78);
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
            canvas.style.height = H*3 + 'px';
            canvas.height = H*3;
            var canvasPlane = new CanvasPlane();
            canvasPlane.scale.x = canvasPlane.scale.y = canvasPlane.scale.z = 1;
            // canvasPlane.wings.rotate.y = -70;
            // canvasPlane.bodys.rotate.y = -70;
            
            // TweenMax.to(canvasPlane.wings.rotate, time, {y:to, onComplete:function(){wingFly()}, ease: Power1.easeInOut});
            var bb = true,
                wingStop = false;
            function wingFly(){
                var to = bb?40:-40,
                    time = bb?0.5:0.6;
                    bb=!bb;
                TweenMax.to(canvasPlane.wings.rotate, time, {y:to, onComplete:function(){
                    if(!wingStop){
                        wingFly()
                    }else{
                        TweenMax.to(canvasPlane.wings.rotate, time, {y:0});

                    };
                }, ease: Power1.linear});
            }
            
            var dd = true,
                bodyStop = false;
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

            function getDeg(p1,p2){
                var dP1 = Math.sqrt(Math.pow(p1.x,2) + Math.pow(p1.y,2)),
                    dP2 = Math.sqrt(Math.pow(p2.x,2) + Math.pow(p2.y,2)),
                    innePro = -p1.x*p2.x-p1.y*p2.y,
                    deg = Math.acos(innePro/(dP1*dP2));
                    // console.log(deg)
                deg = (innePro > 0)?deg*180/Math.PI:(deg+Math.PI)*180/Math.PI;
                return deg;
            }
            function higherBezierCurve(aPoints,rate){
                var a = aPoints,
                    len = a.length,
                    t = rate,
                    rT = 1-t,
                    l = a.slice(0,len-1),
                    r = a.slice(1),
                    oP = {},
                    p1 = {},
                    p2 = {};

                if(len>3){
                    var oL = higherBezierCurve(l,t),
                        oR = higherBezierCurve(r,t);

                        oP.x = rT*oL.x + t*oR.x;
                        oP.y = rT*oL.y + t*oR.y;
                        // oP.z = rT*oL.z + t*oR.z;
                        p1.x = rT*oL.x + (t-.05)*oR.x;
                        p1.y = rT*oL.y + (t-.05)*oR.y;
                        p2.x = rT*oL.x + (t+.05)*oR.x;
                        p2.y = rT*oL.y + (t+.05)*oR.y;

                        oP.deg = getDeg(p1,p2);
                    return oP;
                }else{
                    oP.x = rT*rT*aPoints[0].x+2*t*rT*aPoints[1].x+t*t*aPoints[2].x;
                    oP.y = rT*rT*aPoints[0].y+2*t*rT*aPoints[1].y+t*t*aPoints[2].y;
                    // oP.z = rT*rT*aPoints[0].z+2*t*rT*aPoints[1].z+t*t*aPoints[2].z;
                    p1.x = rT*rT*aPoints[0].x+2*(t-.05)*rT*aPoints[1].x+(t-.05)*(t-.05)*aPoints[2].x;
                    p1.y = rT*rT*aPoints[0].y+2*(t-.05)*rT*aPoints[1].y+(t-.05)*(t-.05)*aPoints[2].y;
                    p2.x = rT*rT*aPoints[0].x+2*(t+.05)*rT*aPoints[1].x+(t+.05)*(t+.05)*aPoints[2].x;
                    p2.y = rT*rT*aPoints[0].y+2*(t+.05)*rT*aPoints[1].y+(t+.05)*(t+.5)*aPoints[2].y;

                    oP.deg = getDeg(p1,p2);
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
            function canvasPlaneBezier(aPoints,time,fx,cb){
                var startTime = new Date().getTime();
                function letGo(){
                    var nowTime = new Date().getTime(),
                        progress = nowTime-startTime,
                        stop = progress>time;

                    var ptn = Tween[fx]( progress, 0, 1, time);
                    // var ptnR = Tween[fx]( progress, -100, -50, time);

                    var point = higherBezierCurve(aPoints,ptn);

                    if(stop){
                        point =aPoints[aPoints.length-1];
                        cb&&cb();
                    }else{
                        requestAnimationFrame(letGo)
                    };
                    canvasPlane.translate.x = point.x;
                    canvasPlane.translate.y = point.y;
                    if(point.deg){
                        // console.log(nowDeg)
                        // if(point.deg < 0){
                        //     point.deg = -1*point.deg + 40;
                        // }
                        var nowDeg = point.deg+100
                        canvasPlane.rotate.z = nowDeg;
                        
                    }

                    //ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
                    ctx.fillStyle='#FFFF00';
                    ctx.fillRect(90,0,120,50);
                    ctx.fillStyle='#FF0000';
                    ctx.beginPath();
                    ctx.arc(point.x,point.y,8,0,2*Math.PI);
                    ctx.fill();
                }
                requestAnimationFrame(letGo)
            };

            // 事件绑定兼容
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
            
            wingFly();
            bodyFly();
            // canvasPlane.rotate.z = 0;
            canvasPlane.rotate.z = 90;
            // canvasPlane.rotate.y = 30;
            // canvasPlane.rotate.x = 20;

            // canvasPlane.translate.z = 120;
            canvasPlane.translate.x = 410;
            canvasPlane.translate.y = H/2 - 30;
            // canvasPlane.translate.x = 100;
            // canvasPlane.translate.y = 0;
            // canvasPlane.translate.x = 200;
            // canvasPlane.translate.y = H*2/3;
            // canvasPlane.rotate.x = -40;
            go()
            function go(){
                ctx.clearRect(0,0,900,H*3);
                ctx.save();
                canvasPlane.render(ctx);
                ctx.restore();
                requestAnimationFrame(go);
            }
            setTimeout(function(){
                wingStop = true;
                bodyStop = true;
                $('.block1').removeClass('blur')
                TweenMax.to(canvasPlane.scale, 1.2, {x:.5,y:.5,z:.5});

                canvasPlaneBezier([{x: 410,y:H/2 - 30},{x: 1000,y:H/4 - 15},{x: 100,y:50}],1200,'linear',function(){

                    setTimeout(function(){
                        fly_pro0();
                    },1000);
                });
                   
            },2000);

            function fly_pro0(){
                canvasPlaneBezier([{x: 100,y:50},{x: 1400,y:H/3},{x: -700,y:H*2/3},{x: 800,y:H-60}],2000,'linear');
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
                        $block.eq(iNow).css({'-webkit-transform': 'translateY(-100%)','transform': 'translateY(-100%)'});
                        iNow++;
                        $block.eq(iNow).css({'-webkit-transform': 'translateY(0)','transform': 'translateY(0)'});
                        if(iNow==1){
                            fly_pro1();
                        }else if(iNow==2){
                            fly_pro2();
                        };
                        element.css({'-webkit-transform': 'translate(0,'+-H+'px)','transform': 'translate(0,'+-iNow*H+'px)','transition': '1.5s'})
                        $blockDotA.eq(iNow).addClass('active').siblings().removeClass('active');
                        setTimeout(function(){
                            canScroll = true;
                        },1500)
                    };
                }else if(ev.delta > 0){
                   if( iNow > 0) {
                        canScroll = false;
                        $block.eq(iNow).css({'-webkit-transform': 'translateY(100%)','transform': 'translateY(100%)'});
                        iNow--;
                        $block.eq(iNow).css({'-webkit-transform': 'translateY(0)','transform': 'translateY(0)'});
                        $blockDotA.eq(iNow).addClass('active').siblings().removeClass('active');
                        if(iNow==0){
                            fly_back_pro1();
                        }else if(iNow==1){
                            fly_back_pro2();
                        };
                        element.css({'-webkit-transform': 'translate(0,'+-H+'px)','transform': 'translate(0,'+-iNow*H+'px)','transition': '1.5s'});
                        setTimeout(function(){
                            canScroll = true;
                        },1500)
                    }; 
                }
            });
        }
    }
}]);


