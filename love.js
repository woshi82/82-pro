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