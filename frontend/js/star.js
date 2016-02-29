
        	function star(oJson){
                this.H = oJson.H;
        		this.W = oJson.W;
        		this.N = 100;
        		this.stars = [];
                this.lt = Date.now();
                this.s_I = 50;

        		this.init();
        	};
            star.prototype.init = function(){
                var _this = this;
                this.draw();
            };
            star.prototype.selfRenewal = function(ctx){
                var nt = Date.now();
                if(nt - this.lt >= this.s_I && this.stars.length < this.N){
                    this.lt = nt;
                    this.stars.push(new starC({
                        ctx: ctx,
                        H: this.H,
                        W: this.W
                    }));                       
                }
            }
            star.prototype.draw = function(ctx){
                var _this = this;
                this.selfRenewal(ctx);
                var t = Date.now();
                // ctx.clearRect(0,0,_this.W,_this.H);
                for (var i = 0; i < this.stars.length; i++) {
                    _this.stars[i].draw(t);
                };
                // requestAnimationFrame(function(){ _this.draw();});
            };
            
            function starC(oJson){
                this.W = oJson.W;
                this.H = oJson.H;
                this.ctx = oJson.ctx;
                this.life = this.roundR(10e3,12.2e3);
                this.showt = this.hidet = 1000;
                this.reset();

            };
            starC.prototype.reset = function(){
                this.st = Date.now();
                this.bx = this.roundR(50,this.W);
                this.by = this.roundR(50,this.H);
                this.x = this.bx;
                this.y = this.by;
                this.br = this.roundR(2,3);
                this.ex = this.roundR(50,this.W);
                this.ey = this.roundR(50,this.H);
                this.bopacity = this.roundR(0.5,1);
                this.opacity = 0;
                this.r = 0;
            };
            starC.prototype.update = function(nt){
                var p = nt - this.st,
                    r = 1,
                    rg = p/this.life;

                if(this.life - p <= 0){
                    this.reset();
                }else{
                    if(p<this.showt){
                        r = p/this.showt;
                    }else if (p > this.life-this.hidet) {
                        r = 1-p/this.life;
                    };
                    this.opacity = r*this.bopacity;
                    this.r = r*this.br;
                    this.x = rg*(this.ex-this.bx)+this.bx;
                    this.y = rg*(this.ey-this.by)+this.by;                    
                };
            }
            starC.prototype.draw = function(nt){
                this.update(nt);
                this.ctx.fillStyle='rgba(255,255,255,'+this.opacity+')';
                this.ctx.beginPath();
                this.ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
                this.ctx.fill();
            }
            starC.prototype.roundR = function(b,e){
                return b + Math.random()*(e-b);
            };