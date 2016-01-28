

var homeModule = angular.module("HomeModule", []);
homeModule.directive('canvaswave',['$timeout', '$rootScope',function($timeout,$rootScope) {
    return {
        restrict: 'AE',
        replace: true,
        
        link: function(scope, element, attrs) {

            var parent = element.parents('.page0');
           
            // console.log(element.parent('.page0').width())

            function lines(){
                this.canvas = element[0];
                this.ctx = this.canvas.getContext('2d');
                this.W = parent.width();
                this.H = window.innerHeight;
                this.aLine = [{'posX': 150},{'posX': 250}];
                this.gener();
                this.resize();
                window.onresize = function(){
                    this.W = parent.width(),
                    this.H =window.innerHeight;
                    this.resize();
                };

            }
            lines.prototype.resize = function(){
                this.canvas.width = this.W;
                this.canvas.height = this.H;
                this.canvas.style.width = this.W;
                this.canvas.style.height = this.H;
            };
            lines.prototype.line = line;
            lines.prototype.gener = function(){
                for (var i = 0; i < this.aLine.length; i++) {
                    var tt = new this.line(this);
                    this.oLines.push(tt);
                    this.oLines[i].reset(this.aLine[i]);
                    
                };
                
                this.frame(line2);
            }

            lines.prototype.frame = function(line){
                var _this = this;
                this.ctx.clearRect(0,0,this.W,this.H);

                line.draw();
                window.requestAnimationFrame(function(){
                    _this.frame(line);
                });
            };

            function line(p){
                this.p = p;
                this.ss = 40;
                this.T = 200;
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
                this.len = (this.len> this.length )? this.length :(this.len += this.s_v);
                
                
                this.p.ctx.beginPath();
                // this.p.ctx.moveTo(0, H/2+0.5);
                this.p.ctx.strokeStyle = '#bdd4cc';
                for (var i = 0; i <= this.len ; i++) {

                    
                    var A = 30*((H/2 - Math.abs(i - H/2)) /H/2);
                    // console.log( (H/2 - Math.abs(i - H/2))/(H/2) )
                    // var A = (H/2 - Math.abs(i - H/2)/H/2)/(5+ss/10);
                    var y = ~~A*Math.sin((i- H/2-this.T/4 - this.ss*5)*this.ww );
                    this.p.ctx.lineTo( this.posX+0.5+y,i);
                };
                this.p.ctx.stroke();
                this.p.ctx.closePath();
            };

            new lines();
            
                
            
        },
        template: '<canvas id="canvas"></canvas>'
   }
}]);

var waterfallModule = angular.module('WaterfallModule', []);
waterfallModule.directive('waterfall', function($timeout, $window, WaterfallList) {
    return {
        restrict:"AE",
        replace: true,
        transclude: true,
        template: '<div class="waterfall" ng-transclude></div>',
        link: function(scope,element,attrs){
            var $waterfall = element,
                waterfall = element[0],
                window = angular.element($window),
                line,
                aLinew = [],
                $waterfall_c,
                canGet = true,
                n_p = 0,
                n = 6;
            
            element.bind('mouseenter', function(event) {
                //scope.loadData();
                // scope.$apply("loadData()");
                // 注意这里的坑，howToLoad会被转换成小写的howtoload
                // scope.$apply(attrs.howtoload);
            });
            

            window.bind('resize',function(){
                reset_c();
            })
            reqData();
            $('#work').scroll(function(){
                reqData();
            })
            $waterfall.on('click', '.waterfall_wrap',function(){
                $('#modal-overlay').addClass('open');
            })
            $('#modal-overlay').on('click','.close-modal', function(){
                $(this).parents('#modal-overlay').removeClass('open');
            })
            function reqData(){
                // console.log(window.scrollTop()+window.height() >= $waterfall.height() + $waterfall.offset().top)
                if(canGet && window.scrollTop()+window.height() >= $waterfall.height() + $waterfall.offset().top){
                    $timeout(function(){
                        WaterfallList.getList(n_p, n)
                            .success(function(data, status){
                                create_c(data);
                            })
                    },200);
                }
            }
            function create_c(data){
                var str = '';
                for (var i = 0; i < data.length; i++) {
                    if(data[i].image){
                        str += '<a class="waterfall_wrap  hasImg"> <div class="waterfall_wrap_b"> <img src="'+ data[i].image +'"/> <h3 class="title">'+ data[i].title +'</h3> <p class="detail">'+ data[i].detail +'</p> </div> </a>' ;    
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
                $waterfall_c = $waterfall.children('.waterfall_wrap');
                aLinew = [];
                var waterfall_fc = $waterfall_c.eq(0)[0],
                    waterfall_fc_w = waterfall_fc.offsetWidth,
                    waterfall_w = waterfall.offsetWidth;
                    // waterfall_w = $waterfall.width();
                line = Math.round(waterfall_w/waterfall_fc_w);
                console.log('ww::' + waterfall_w + 'sw::' + waterfall_fc_w)
                for (var i = 0; i < line; i++) {
                    aLinew.push(waterfall_fc_w*i-i);
                };
                // console.log(aLinew);
                for (var i = 0; i < $waterfall_c.length; i++) {
                    if(i < line){
                        $waterfall_c.eq(i).css({'left': aLinew[i]+'px', 'top': 0});
                        // console.log(i + ':::' + $waterfall_c.eq(i)[0].style.left);
                    }
                    else{
                        var minTop = getTop(i);
                        $waterfall_c.eq(i).css({'left': minTop.left+'px', 'top': minTop.top+'px'});
                    }
                };
                var MaxTop = getTop($waterfall_c.length, true);
                $waterfall.css({'height': MaxTop.top+$waterfall_c.eq(MaxTop.i)[0].offsetHeight, 'width': window.width()});
                $('#work').css({'width': window.width()});

                canGet = true;

            }

            function getTop(now, bMax){

                var aLineB = [],
                    aMin = [];
                for (var j = 0; j < line; j++) {
                    aLineB.push(true)
                }
                for (var i = now-1; i >= 0; i--) {
                    for (var j = 0; j < line; j++) {
                        // console.log(i + ':::'+parseInt($waterfall_c.eq(i).css('left')));
                        if(aLineB[j] && parseInt($waterfall_c.eq(i)[0].style.left) == aLinew[j]){

                            aMin.push( { 'left': aLinew[j], 'top':  parseInt($waterfall_c.eq(i)[0].style.top)  + $waterfall_c.eq(i)[0].offsetHeight, 'i': i } );

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
    var reqList = function(n_p, n){
        return $http({
            method: 'GET',
            url: 'data/data.json'
        })
    }
    return{
        'getList':function(n_p, n){

            // console.log(223334)          
            return reqList(n_p, n)
        }
    }
}])

