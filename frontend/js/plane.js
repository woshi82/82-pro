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
            CanvasPlane.prototype.draw = function(ctx){
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

            // 飞机动画
            function PlaneMove(canvasPlane){
                this.Tween = {
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
                this.canvasPlane = canvasPlane;
                // this.move();
            };
            PlaneMove.prototype.resize = function(oJson){
                this.H = oJson.H;
                this.W = oJson.W;
            };
            // 获取切线角度
            PlaneMove.prototype.getDeg = function(p1,p2){
                var dis = Math.sqrt(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2)),
                    innePro = p1.x-p2.x,
                    multDif = p2.y-p1.y,
                    deg = Math.acos(innePro/dis);
                deg = (multDif > 0)?-deg*180/Math.PI:deg*180/Math.PI;
                return deg;
            };
            PlaneMove.prototype.higherBezierCurve = function(aPoints,rate){
                var _this = this;
                var a = aPoints,
                    len = a.length,
                    t = rate,
                    rT = 1-t,
                    l = a.slice(0,len-1),
                    r = a.slice(1),
                    oP = {};
                if(len>3){
                    var oL = _this.higherBezierCurve(l,t),
                        oR = _this.higherBezierCurve(r,t);
                        oP.x = rT*oL.x + t*oR.x;
                        oP.y = rT*oL.y + t*oR.y;
                    return oP;
                }else{
                    oP.x = rT*rT*aPoints[0].x+2*t*rT*aPoints[1].x+t*t*aPoints[2].x;
                    oP.y = rT*rT*aPoints[0].y+2*t*rT*aPoints[1].y+t*t*aPoints[2].y;
                    return oP;
                };
            };
            // 飞机贝塞尔曲线变换
            PlaneMove.prototype.canvasPlaneBezier = function(aPoints,time,fx,cb){
                var _this = this;
                var startTime = new Date().getTime();
                function letGo(){
                    var nowTime = new Date().getTime(),
                        progress = nowTime-startTime,
                        stop = progress>time;

                    var ptn = _this.Tween[fx]( progress, 0, 1, time);
                    // var ptnR = Tween[fx]( progress, -100, -50, time);

                    var point = _this.higherBezierCurve(aPoints,ptn);
                    var p1 = _this.higherBezierCurve(aPoints,ptn-0.005);
                    var p2 = _this.higherBezierCurve(aPoints,ptn+0.005);
                    var deg = _this.getDeg(p1,p2);

                    if(stop){
                        point =aPoints[aPoints.length-1];
                        cb&&cb();
                    }else{
                        requestAnimationFrame(letGo)
                    };
                    _this.canvasPlane.translate.x = point.x;
                    _this.canvasPlane.translate.y = point.y;
                    if(deg){
                        _this.canvasPlane.rotate.z = deg-90;                        
                    };
                }
                requestAnimationFrame(letGo)
            };
            PlaneMove.prototype.move = function(){
                var _this = this;
                // wingFly();
                // bodyFly();
                

            };


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

