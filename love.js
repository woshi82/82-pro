RAF = requestAnimationFrame||webkitRequestAnimationFrame||mozRequestAnimationFrame||function(callback) {
            return setTimeout(function() { callback&&callback(); },1000/20);
        };

function Love(img){
    this.img = img;
    this.w = this.img.width;
    this.h = this.img.height;
    this.life = this.roundR(2.2e3,3e3);
    this.reset();
}
Love.prototype.roundR = function(l,g) {
    return l+Math.random()*(g-l);
};
Love.prototype.update = function(ctx,nT) {
    var p = nT-this.sT,
        r = p*Math.PI/1080+this.tL;
    this.tx = this.swing*Math.sin(r);
    this.y = -this.tH*p/this.life;
    this.HE(p/this.life);
    if(Math.abs(this.y)>this.tH){
        this.reset();
    }
    this.upTransform(ctx);
};
Love.prototype.HE = function(p) {
    var a = 1;
    if(p>0.9){
        a = (1-p)*10;
    }
    this.alpha = a*a;
};
Love.prototype.draw = function(ctx,nT) {
    ctx.save();
    this.update(ctx,nT);
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(this.img,0,0,this.w,this.h,-this.w/2,-this.h/2,this.w,this.h);
    ctx.restore();
};
Love.prototype.upTransform = function(ctx) {
    ctx.transform(this.scale,0,0,this.scale,this.x+this.tx,this.y);
};
Love.prototype.reset = function() {
    this.sT = Date.now();
    this.x = this.roundR(-30,30) >> 0;
    this.y = 0;
    this.tx = 0;
    this.swing = this.roundR(5,30);
    this.scale = this.roundR(2,18)/this.w;
    this.tL = 2*Math.PI*Math.random();
    this.tH = this.roundR(180,250);
    this.alpha = 1;
};
{
    el: '#canvas_love',
    init: function(){
        this.cld = [];
        this.total = 10;
        this.interval = 300;
        this.dom.width = this.width = 180;
        this.dom.height = this.height = 300;
        this.dom.style.background = 'transparent';
        this.ctx = this.dom.getContext('2d');
        this.canRender = false;
        this.active = false;
        this.pT = Date.now();
        this.render();
    },
    start: function(){
        var This = this;
        this.active = true;
        if(!this.pic){
            this.pic = new Image();
            this.pic.src = __uri('../images.png');
            this.pic.onload = function(){
                if(This.active)This.canRender = true;
            };
        }else{
            this.canRender = true;
        }
    },
    stop: function(){
        this.active = false;
        this.canRender = false;
        this.cld.length = 0;
    },
    render: function(){
        var This = this;
        function go(){
            This.canRender&&This.draw();
            RAF(go);
        }
        go();
    },
    selfRenewal: function(){
        var nT = Date.now();
        if(nT-this.pT>this.interval&&this.cld.length<this.total){
            this.pT = nT;
            this.cld.push(new Love(this.pic));
        }
    },
    draw: function(){
        this.selfRenewal();
        this.ctx.clearRect(0,0,this.width,this.height);
        this.ctx.save();
        this.ctx.translate(this.width/2,this.height);
        var t = Date.now();
        for(var i=0,l=this.cld.length;i<l;i++){
            this.cld[i].draw(this.ctx,t);
        }
        this.ctx.restore();
    }




    function cloud(){
                this.N = 10;
                this.aClouds = [];
                this.W = 900;
                this.R = this.W;
                this.create();

            };
            cloud.prototype.resetCloud = function(){

                var oCloud = {};
                oCloud.x = this.randomRange(-50,50);
                oCloud.y = this.randomRange(-50,50);
                oCloud.scale = this.randomRange(5,10)/100;
                var oConSin = this.getConSin({x:oCloud.x,y:oCloud.y});
                oCloud.ex = this.R*oConSin.cos;
                oCloud.ey = this.R*oConSin.sin;
                oCloud.escale = this.randomRange(60,80)/100;
                oCloud.time = this.randomRange(4000,6000);
                oCloud.opacity = 0;
                return oCloud;
            };
            cloud.prototype.getConSin = function(p1){
                var p2 = {x:1,y:0},
                    innerMulter = p1.x*p2.x + p1.y*p2.y,
                    diffMulter = p1.x*p2.y - p1.y*p2.x,
                    distance = Math.sqrt(Math.pow(p1.x,2)+Math.pow(p1.y,2)) + Math.sqrt(Math.pow(p1.x,2)+Math.pow(p1.y,2)),
                    iCos = innerMulter/distance,
                    iSin = Math.sqrt(1-Math.pow(iCos,2));
                iSin =  (p1.y > 0)?iSin:-iSin;
                iCos =  (diffMulter > 0)?iCos:-iCos;
                return {cos: iCos,sin: iSin};

            }
            cloud.prototype.create = function(){                
                var sHtml = '';
                var _this = this;
                for (var i = 0; i < this.N; i++) {
                    // var i = 0;
                    this.aClouds.push(this.resetCloud());
                    sHtml += '<div class="cloud"></div>';

                };
                element.append($(sHtml));
                this.$clouds = element.find('.cloud');

                this.$clouds.each(function(i,elem){
                    $(elem).css({'transform':'translate('+_this.aClouds[i].x+'px,'+_this.aClouds[i].y+'px) scale('+_this.aClouds[i].scale+')','opacity': 0});

                })
                this.move();

            };
            cloud.prototype.move = function(){
                var _this = this;
                for (var i = 0; i < this.N; i++) {
                    (function(i){
                        setTimeout(function(){
                            // console.log(_this.$clouds)

                            _this.$clouds.eq(i).animate({'opacity': 1},_this.randomRange(200,600),'linear',function(){
                                // console.log(_this.aClouds[i].ex);
                                $(this).css({'transform':'translate('+_this.aClouds[i].ex+'px,'+_this.aClouds[i].ey+'px) scale('+_this.aClouds[i].escale+')','transition': 'transform '+_this.aClouds[i].time+'ms'});
                                // _this.$clouds.eq(i).animate({'transform':'translate('+_this.aClouds[i].ex+'px,'+_this.aClouds[i].ey+'px) scale('+_this.aClouds[i].escale+')'},_this.aClouds[i].time,'linear',function(){

                                // })
                            });
                        },Math.random()*1.2);
                        
                    })(i);
                };
            }
            cloud.prototype.randomRange = function (LLimit,TLimit){
                return Math.floor(Math.random()*(TLimit-LLimit) + LLimit);
            };
            var Cloud = new cloud();





            // 2016/2/25

            function cloud(){
                this.canvas = document.getElementById('clouds');
                this.ctx = this.canvas.getContext('2d');
                this.H = window.innerHeight-78;
                this.W = (window.innerWidth<1200)?1200:window.innerWidth;
                this.canvas.height = this.H;
                this.canvas.width = this.W;

                this.N = 20;
                this.aClouds = [];
                this.lt = Date.now();
                this.s_I = 600;
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
                    this.aClouds.push(new cloudC(this.pic,this.ctx,this.H,this.W));                       
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

            };
            function cloudC(pic,ctx,H,W){
                this.ctx = ctx;
                this.W = W;
                this.H = H;
                this.pic = pic;
                this.width = this.pic.width;
                this.height = this.pic.height;
                this.life = this.randomRange(3e3,4.2e3);
                this.ox = this.W/2;
                this.oy = this.H*.4;
                this.showt = 800;
                this.hidet = 300;
                this.R = this.W;
                this.oR = 20;
                this.focalLength = this.W/2;
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

                
                    if(p<this.showt){
                        r = p/this.showt;
                    }else if (p > this.life-this.hidet) {
                        r = 1-p/this.life;
                    };
                    this.alpha = r*this.balpha;
                    
                    this.tz = rg*(this.tez-this.tbz)+this.tbz;
                    this.tx = this.tbx;
                    this.ty = this.tby;
                    this.scale = this.bscale;
                    var scaleXY = this.getScreenXY();
                    if(this.tz!==0){
                        this.tx = scaleXY.x;
                        this.ty = scaleXY.y;
                        this.scale = scaleXY.w;
                    };
                    if(this.tz < -this.lr*this.focalLength){
                        // console.log(this.scale);
                        this.reset();
                    };
                
                this.upTransform();                  
            };
            cloudC.prototype.getScale = function (){
                return (this.focalLength / (this.focalLength + this.tz));
            };
            cloudC.prototype.getScreenXY = function (){
                var scale = this.getScale();
                return {
                    x: this.tbx * scale,
                    y: this.tby * scale,
                    w: scale*this.bscale
                };
            };
            cloudC.prototype.reset = function(){
                this.st = Date.now();
                this.bscale = this.randomRange(40,80)/100;
                this.lr = this.randomRange(20,20)/100;

                this.tbx = this.randomRange(-this.W,this.W);
                this.tby = this.randomRange(-this.H,this.H);
                this.tbz = this.randomRange(this.W*3,this.W*5);

                this.tx = this.tbx;
                this.ty = this.tby;
                this.tz = this.tbz;
                this.scale = this.bscale;

                this.tez = this.
                randomRange(-this.W*3/4,-this.W);

                this.escale = this.randomRange(70,90)/100;
                this.balpha = this.randomRange(80,100)/100;
                this.alpha = 0;
            };
            cloudC.prototype.randomRange = function (LLimit,TLimit){
                return Math.floor(Math.random()*(TLimit-LLimit) + LLimit);
            };

            var Cloud = new cloud();