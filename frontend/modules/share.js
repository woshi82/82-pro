

var shareModule = angular.module("ShareModule", []);
shareModule.controller('shareController',['$scope',function($scope){
    // console.log('shareController')
    $scope.shareDetails = {};
    $scope.sharePraise = 'active';
}])

shareModule.directive('waterfall', function($timeout, $window, WaterfallList) {
    return {
        restrict:"AE",
        replace: true,
        transclude: true,
        scope:{
            sharedetails: '=',
            sharepraise: '='
        },
        template: '<ul class="share_list" ng-transclude></ul>',
        link: function(scope,element,attrs){
            var $waterfall = element,
                $li,
                window = angular.element($window),
                line = 4,      //固定列数
                aLinew = [],  //固定left数组
                canGet = true,
                n_p = 0,//当前页数
                n = 15,  //一次请求数量
                i_now = 0;
            reqData();
            $('.share').scroll(function(){
                // console.log(window.scrollTop()+window.height() >= $waterfall.height() + $waterfall.offset().top)
                if(canGet && window.scrollTop()+window.height() >= $waterfall.height() + $waterfall.offset().top){
                    reqData();
                }
            })
            $waterfall.on('click', 'li>a',function(){
                
                var id = $(this).attr('data-target');
                scope.sharepraise = 'active';
                WaterfallList.getWaterfallDetData(id)
                    .success(function(data, status){
                        if(data.detail){
                            scope.sharedetails = data.detail;
                            console.log(data.hasPraise)
                            if(data.hasPraise) scope.sharepraise = '';
                            $('#modal-overlay').addClass('open');
                        }
                    })

            });
            $('.sharePraise').on('click',function(){
                if(!scope.sharepraise) return;
                var id = $(this).parents('#modal-overlay').attr('dataID');
                WaterfallList.getSharePraise(id)
                    .success(function(data){
                        scope.sharedetails.praiseNum = data.praiseNum;
                        scope.sharepraise = '';
                    })
            })
            $('#modal-overlay').on('click','.close-modal', function(){
                $(this).parents('#modal-overlay').removeClass('open');
            });
            function reqData(){
                $timeout(function(){
                            console.log('before请求数据')

                    WaterfallList.getWaterfallData(n_p, n)
                        .success(function(data, status){
                            console.log('请求数据成功')
                            var lists = data.lists;
                            var len = lists.length;
                                // console.log(lists)
                            // if(!len)return;
                            if(lists.length > 0){
                                n_p++;
                                create_c(lists);
                            };
                        })
                },200);
            }
            function create_c(data){
                var str = '';
                $li = $waterfall.children('li');
                ($li.length>0)?i_now = $li.length:i_now =0;

                for (var i = 0; i < data.length; i++) {
                    if(data[i].image){
                        str += '<li><a href="javascript:;" data-target="'+data[i]._id+'"><img src="'+ data[i].image +'" /> <div class="info"> <div class="title">'+ data[i].title +'</div> <div class="time"></div> </div> </a></li>';
                    }else{
                        str += '<a class="waterfall_wrap"> <div class="waterfall_wrap_b"><h3 class="title">'+ data[i].title +'</h3> <p class="detail"></p> </div> </a>' ; 
                    }
                };
                $waterfall.append(str);
                $timeout(function(){
                    reset_c();
                },150)
                
            }
            
            function reset_c(){
                canGet = false;
                $li = $waterfall.children('li');
                
                var $li_first = $li.eq(0),
                    $li_first_w = $li_first.width();
                    // waterfall_w = waterfall.offsetWidth;
                    // waterfall_w = $waterfall.width();
                // line = Math.round(waterfall_w/waterfall_fc_w);
                // console.log('ww::' + waterfall_w + 'sw::' + waterfall_fc_w)
                if(!i_now){
                    for (var i = 0; i < line; i++) {
                        aLinew.push(($li_first_w+ 16)*i );
                    };
                };
                for (var i = i_now; i < $li.length; i++) {
                    if(i < line){
                        $li.eq(i).css({'left': aLinew[i]+'px', 'top': 0});
                    }
                    else{
                        var minTop = getTop(i);
                        $li.eq(i).css({'left': minTop.left+'px', 'top':( minTop.top+16)+'px'});
                    }
                };
                var MaxTop = getTop($li.length, true);
                // console.log(MaxTop);
                $waterfall.css({'height': MaxTop.top});
                // $('#work').css({'width': window.width()});
                canGet = true;

            }

            function getTop(now, bMax){
                var aLineB = [],
                    aMin = [],
                    iReturn = 0;
                for (var j = 0; j < line; j++) {
                    aLineB.push(true)
                }
                for (var i = now-1; i >= 0; i--) {
                    // console.log(iReturn)
                    for (var j = 0; j < line; j++) {
                        if(iReturn >= line){
                            // return;
                        }
                        if(aLineB[j] && parseInt($li.eq(i)[0].style.left) == aLinew[j]){

                            aMin.push( { 'left': aLinew[j], 'top':  parseInt($li.eq(i)[0].style.top)  + $li.eq(i)[0].offsetHeight, 'i': i } );
                            iReturn++;
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

shareModule.factory('WaterfallList', ['$http', function($http){
    var reqWaterfallData = function(n_p, n){
            return $http({
                method: 'POST',
                url: 'getShareList',
                data:{
                    page : n_p,
                    n: n
                }
            }).error(function(status){
                console.log('请求数据失败了 ' + status);
            })
        },
        reqWaterfallDetData = function(id){
            return $http({
                method: 'POST',
                url: 'getShareListDet',
                data:{
                    id : id
                }
            }).error(function(status){
                console.log('请求数据失败了 ' + status);
            })
        },
        reqSharePraise = function(id){
            return $http({
                method: 'POST',
                url: 'getSharePraise',
                data:{
                    id : id
                }
            }).error(function(status){
                console.log('请求数据失败了 ' + status);
            })
        };
    return{
        'getWaterfallData':function(n_p, n){         
            return reqWaterfallData(n_p, n)
        },
        'getWaterfallDetData':function(id){         
            return reqWaterfallDetData(id)
        },
        'getSharePraise':function(id){         
            return reqSharePraise(id)
        }
    }
}]);