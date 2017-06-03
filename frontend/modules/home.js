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
homeModule.directive('home',['$timeout', '$rootScope',function($timeout,$rootScope) {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true, 
        template: '<div class="home" ng-transclude></div>',
        link: function(scope, element, attrs) {
            var homeMidT = $('.home_mid').offset().top,
                $tech = $('.tech'),
                techL = $tech.length;
            var oldY = element.scrollTop(),
                bScroll = true;
            element.on('scroll', function(ev){
                if(!bScroll) return;
                var nowY = $(this).scrollTop();
                if(nowY - oldY > 0){

                    for (var i = 0; i < techL; i++) {
                        var thisTech = $tech.eq(i);
                        if(nowY >= thisTech.offset().top-180){
                            // console.log(thisTech.offset().top + '::'+nowY)
                            if(!thisTech.hasClass('techMove')){
                                thisTech.addClass('techMove');
                            };
                            if(i >= techL-1){
                                bScroll = false;
                            }
                        }  
                    }

                };
            });
    	}

	}
}]);
homeModule.directive('canvaswave',['$timeout', '$rootScope',function($timeout,$rootScope) {
    return {
        restrict: 'AE',
        replace: true,   
        link: function(scope, element, attrs) {
            var W = 900;
            var H = 1500;
            console.log(3333)
            var stage = new Container({W: W,H:H,id: 'canvasHome'});

            var Lines = new lines({W: W,H:H});
            var Star = new star({W: W,H:H});

            stage.addChild(Lines);
            stage.addChild(Star);
            stage.render();
        },
        template: '<canvas id="canvasHome" width="900"></canvas>'
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
                    This.mx = e.pageX - element.offset().left;
                    This.my = e.pageY - element.offset().top;
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
                _this.img.src = 'images/logo_effect.png';
                
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