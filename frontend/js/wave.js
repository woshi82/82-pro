function lines(oJson){
                this.W = oJson.W;
                this.H = oJson.H;
                this.aLine = [{'posX': 20},{'posX': 220},{'posX': 450},{'posX': 680},{'posX': 880}];
                this.oLines= [];
                this.gener();
                // this.resize();

            };
            lines.prototype.line = line;
            lines.prototype.gener = function(){
                for (var i = 0; i < this.aLine.length; i++) {
                    var tt = new this.line({W: this.W,H: this.H});
                    this.oLines.push(tt);
                    this.oLines[i].reset(this.aLine[i]);                    
                };
            }

            lines.prototype.draw = function(ctx){
                var _this = this;
                ctx.clearRect(0,0,this.W,this.H);
                for (var i = 0; i < _this.oLines.length; i++) {
                    _this.oLines[i].draw(ctx);
                };
                // window.requestAnimationFrame(function(){
                //     _this.draw();
                // });
            };

            function line(oJson){
                this.ss = 40;
                this.T = 300;
                this.ww = Math.PI*2/this.T;
                this.Ao;
                this.posX = 0;
                this.len = 0;
                this.H = oJson.H;
                this.W = oJson.W;
                this.s_v = Math.random()+2;
            };
            line.prototype.reset = function(json){
                for(var attr in json){
                    this[attr] = json[attr];
                }
            };
            line.prototype.draw = function(ctx){
                this.ss += 1;
                this.len = this.H;
                ctx.beginPath();
                ctx.strokeStyle = '#40bda8';
                this.staticA = 20;
                this.deltT = 0;
                this.tdeltX = this.W/2 - this.posX;
                for (var i = 0; i <= this.len ; i++) {

                    var A = this.staticA;
                    this.deltT = this.tdeltX-this.tdeltX*Math.sqrt( Math.sqrt((this.H-i)/this.H) );  
                    // 头尾振幅变小
                    if(i < 150){
                    	A = i/150*this.staticA;
                    };
                    if(this.len - i < 100){
                    	A = (this.len - i+20)/120*this.staticA;

                    };

                    if(this.tdeltX >= 0){
                        var y = ~~A*Math.sin((i)*this.ww-this.ss/15 ) + this.deltT;
                    }
                    else {
                        var y = ~~ -A*Math.sin((i)*this.ww-this.ss/15 ) + this.deltT;
                    }
                    ctx.lineTo( this.posX+0.5+y,i);
                };
                ctx.stroke();
                ctx.closePath();
            };