function spCloud(oJson){
    this.lt = Date.now();
    this.s_I = 600;
    this.aClouds = [];
    this.aPic = oJson.aPic;
    this.N = this.aPic.length;
    this.H = oJson.H || window.innerHeight;
    this.W = oJson.W || window.innerWidth;
    this.apos = [{
        scale: .65,
        x: this.W/4,
        y: this.H/3,
        z: this.W*4,
        ez: 0
        // ez: -this.W*7/8
    },{
        scale: .65,
        x: -this.W/4,
        y: -this.H/3,
        z: this.W*2,
        ez: 0
        // ez: -this.W*7/8
    },{
        scale: .65,
        x: -this.W/2,
        y: this.H/5,
        z: this.W*2,
        ez: this.W/8
        // ez: -this.W*7/8
    }
    ];
};
// spCloud.prototype.stop = function(){ 
//     for (var i = 0; i < this.aClouds.length; i++) {
//         this.aClouds[i].stop();
//     };
// };
spCloud.prototype.start = function(){
    for (var i = 0; i < this.aClouds.length; i++) {
        this.aClouds[i].start();
    };
};
spCloud.prototype.selfRenewal = function(ctx){
    var nt = Date.now();
    var len = this.aClouds.length;
    if(nt - this.lt >= this.s_I && len < this.N){
        this.lt = nt;
    // console.log(this.aPic)

        this.aClouds.push(new spCloudC({
            pic: this.aPic[len],
            ctx: ctx,
            W: this.W,
            H: this.H,
            pos: this.apos[len]
        }));                       
    };
};
spCloud.prototype.draw = function(ctx){
    this.selfRenewal(ctx);
    var t = Date.now();
    // console.log(this.aClouds.length)
    for (var i = 0; i < this.aClouds.length; i++) {
        // var i = 0;
        this.aClouds[i].draw(t);
    };
};
function spCloudC(oJson){
    this.ctx = oJson.ctx;
    this.W = oJson.W;
    this.H = oJson.H;
    this.pic = oJson.pic;
    this.width = this.pic.width;
    this.height = this.pic.height;
    this.life = this.randomRange(3e3,4.2e3);
    this.ox = this.W/2;
    this.oy = this.H*.4;
    this.showt = 800;
    this.hidet = 300;
    
    this.bfirst = true;
    this.remove = false;
    this.bstop = false;
    this.bfstop = true;

    this.focalLength = this.W/2;
    this.flife = 2000;
    this.fx = 0;
    this.fy = 0;

    this.pos = oJson.pos
    this.reset();

};
spCloudC.prototype.reset = function(){
    this.st = Date.now();
    this.lr = .2;
    this.bscale = this.scale = this.pos.scale;
    this.tbx = this.tx = this.pos.x;
    this.tby = this.ty = this.pos.y;
    this.tbz = this.tz = this.pos.z;

    this.tez = this.pos.ez;
    this.balpha = this.randomRange(80,100)/100;
    this.alpha = 0;
    
};
spCloudC.prototype.stop = function(){
    this.bstop = true;
    this.bfstop = false;
    this.floatInit();
    this.savep = this.p;
}
spCloudC.prototype.start = function(){
    this.bstop = false;
    this.bfstop = true;
    this.st = Date.now() - this.savep;
    
}
spCloudC.prototype.draw = function(nt){
    if(this.remove) return;
    this.ctx.save();
    !this.bstop && this.update(nt);
    !this.bfstop && this.float(nt);
    this.upTransform(); 

    // this.ctx.globalAlpha = this.alpha;                
    this.ctx.drawImage(this.pic,0,0,this.width,this.height);
    this.ctx.restore();
};

spCloudC.prototype.float = function(nt){
	var fp = nt - this.sft;
	var r = fp/(this.flife/2);
	if(fp-this.flife > 0){
		this.floatInit();
		return;
	};
	if(r <=1){
		this.fx = r*(this.fex - this.fbx)+this.fbx;
		this.fy = r*(this.fey - this.fby)+this.fby;
	}else{
		this.fx = (r-1)*(this.fbx - this.fex)+this.fex;
		this.fy = (r-1)*(this.fby - this.fey)+this.fey;
	};
}
spCloudC.prototype.floatInit = function(nt){
	this.sft = Date.now();
	this.fbx = this.fx = 0;
	this.fby = this.fy = 0;
	this.fex = this.randomRange(-25,25);
	this.fey = this.randomRange(-25,25);
}
spCloudC.prototype.update = function(nt){
    this.p = nt - this.st;
    var r = 1,
        rg = this.p/this.life;

        if(this.p<this.showt){
            r = this.p/this.showt;
        }else if (this.p > this.life-this.hidet) {
            r = 1-this.p/this.life;
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
        if(this.tz < this.focalLength && this.bfirst){
            this.bfirst = false;
            this.stop();
        }else if(this.tz < -this.lr*this.focalLength){
            this.remove = true;
        };    
};

spCloudC.prototype.getScale = function (){
    return (this.focalLength / (this.focalLength + this.tz));
};
spCloudC.prototype.getScreenXY = function (){
    var scale = this.getScale();
    return {
        x: this.tbx * scale,
        y: this.tby * scale,
        w: scale*this.bscale*2.2
    };
};
spCloudC.prototype.upTransform = function() {
    this.ctx.transform(this.scale,0,0,this.scale,this.ox+this.tx+this.fx,this.oy+this.ty+this.fy);
};

spCloudC.prototype.randomRange = function (LLimit,TLimit){
    return Math.floor(Math.random()*(TLimit-LLimit) + LLimit);
};




// 云朵
function cloud(oJson){
    this.H = oJson.H || window.innerHeight;
    this.W = oJson.W || window.innerWidth;
    this.N = 20;
    this.aClouds = [];
    this.lt = Date.now();
    this.s_I = 600;
    this.can_r = false;
    this.pic = oJson.pic;
    this.bstop = false;
};
cloud.prototype.stop = function(){ 
    for (var i = 0; i < this.aClouds.length; i++) {
        this.aClouds[i].stop();
    };
    this.bstop = true;

};
cloud.prototype.start = function(){
    for (var i = 0; i < this.aClouds.length; i++) {
        this.aClouds[i].start();
    };
    this.bstop = false;

};
cloud.prototype.selfRenewal = function(ctx){
    var nt = Date.now();
    if(nt - this.lt >= this.s_I && this.aClouds.length < this.N && !this.bstop){
        this.lt = nt;
        this.aClouds.push(new cloudC({
            pic: this.pic,
            ctx: ctx,
            W: this.W,
            H: this.H
        }));                       
    }
};
cloud.prototype.draw = function(ctx){
    this.selfRenewal(ctx);
    var t = Date.now();
    for (var i = 0; i < this.aClouds.length; i++) {
        // var i = 0;
        this.aClouds[i].draw(t);
    };
};
function cloudC(oJson){
    this.ctx = oJson.ctx;
    this.W = oJson.W;
    this.H = oJson.H;
    this.pic = oJson.pic;
    this.width = this.pic.width;
    this.height = this.pic.height; 
    this.life = this.randomRange(3e3,4.2e3);
    this.ox = this.W/2;
    this.oy = this.H*.4;
    this.showt = 800;
    this.hidet = 300;
    this.focalLength = this.W/2;
    // this.R = this.W;
    // this.oR = 20;
    this.reset();

};
cloudC.prototype.stop = function(nt){
    this.bstop = true;
    this.savep = this.p;
}
cloudC.prototype.start = function(nt){
    this.bstop = false;
    this.st = Date.now() - this.savep;
}
cloudC.prototype.draw = function(nt){
    this.ctx.save();
    !this.bstop && this.update(nt);
    this.upTransform();                  
    this.ctx.globalAlpha = this.alpha;                
    this.ctx.drawImage(this.pic,0,0,this.width,this.height);
    this.ctx.restore();
};
cloudC.prototype.upTransform = function() {
    this.ctx.transform(this.scale,0,0,this.scale,this.ox+this.tx,this.oy+this.ty);
};
cloudC.prototype.update = function(nt){
    this.p = nt - this.st;
    var r = 1,
        rg = this.p/this.life;
        if(this.p<this.showt){
            r = this.p/this.showt;
        }else if (this.p > this.life-this.hidet) {
            r = 1-this.p/this.life;
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
    
};
cloudC.prototype.getScale = function (){
    return (this.focalLength / (this.focalLength + this.tz));
};
cloudC.prototype.getScreenXY = function (){
    var scale = this.getScale();
    return {
        x: this.tbx * scale,
        y: this.tby * scale,
        w: scale*this.bscale*2.2
    };
};
cloudC.prototype.reset = function(){
    this.st = Date.now();
    this.lr = .2;

    this.bscale = this.bscale = this.randomRange(40,80)/100;
    this.tbx = this.tbx = this.randomRange(-this.W,this.W);
    this.tby = this.tby = this.randomRange(-this.H,this.H);
    this.tbz = this.tbz = this.randomRange(this.W*3,this.W*5);

    this.tez = this.randomRange(-this.W*3/4,-this.W);

    this.escale = this.randomRange(70,90)/100;
    this.balpha = this.randomRange(80,100)/100;
    this.alpha = 0;
};
cloudC.prototype.randomRange = function (LLimit,TLimit){
    return Math.floor(Math.random()*(TLimit-LLimit) + LLimit);
};