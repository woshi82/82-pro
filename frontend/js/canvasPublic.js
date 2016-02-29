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
            function Container(oJSon){
                this.canvas = document.getElementById(oJSon.id);
                this.ctx = this.canvas.getContext('2d');
                this.cds = [];
                this.can_r = true;
                this.W = oJSon.W;
                this.H = oJSon.H;
                
                this.resize({
                    W:this.W,
                    H:this.H
                });
            };
            Container.prototype.resize = function (oJSon){
                this.W = oJSon.W;
                this.H = oJSon.H;
                this.canvas.height = oJSon.H;
                this.canvas.width = oJSon.W;
                this.canvas.style.height = oJSon.H + 'px';
                this.canvas.style.width = oJSon.W + 'px';
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
                // if(_this.can_r) 
                    _this.draw();
                requestAnimationFrame(function(){
                    _this.render();
                });
            };
            Container.prototype.start = function (obj){
                this.can_r = true;
                var totle = this.cds.length,
                    i = 0;
                while(i<totle){
                    var cd = this.cds[i];
                        cd.start&&cd.start();
                    i++;
                }
            };
            Container.prototype.stop = function (obj){
                this.can_r = false;
                var totle = this.cds.length,
                    i = 0;
                while(i<totle){
                    var cd = this.cds[i];
                        cd.stop&&cd.stop();
                    i++;
                }

            };
            Container.prototype.draw = function (){
                this.ctx.clearRect(0,0,this.W,this.H);

                var totle = this.cds.length,
                    i = 0;
                while(i<totle){
                    var cd = this.cds[i];
                        cd.draw(this.ctx);
                    i++;
                };
            };