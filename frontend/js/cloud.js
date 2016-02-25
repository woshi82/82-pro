// 云朵
            function cloud(pic){
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

                this.pic = pic;
                // this.start();
                // this.render();
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
            cloud.prototype.selfRenewal = function(ctx){
                var nt = Date.now();
                if(nt - this.lt >= this.s_I && this.aClouds.length < this.N){
                    this.lt = nt;
                    this.aClouds.push(new cloudC(this.pic,ctx,this.H,this.W));                       
                }
            };
            cloud.prototype.draw = function(ctx){
                this.selfRenewal(ctx);
                // this.aClouds.push(new cloudC(this.pic,this.ctx,this.H));                       

                // ctx.clearRect(0,0,this.W,this.H);
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