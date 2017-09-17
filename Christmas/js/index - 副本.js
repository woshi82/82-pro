
	var login = document.getElementById('login_button'),
		param = {},
		indexToPlay = 0,
		storage = window.sessionStorage;
	

	// param.username = storage.getItem('username');
	// param.location = storage.getItem('location');
	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// param.username = null;
	// param.location = null;
	// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	// console.log(storage.getItem('username'))
	$.ajaxSetup({
            type: "GET",
            data: {},
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            error: function(jqXHR, textStatus, errorThrown){  
            	console.log(jqXHR.status)
	            switch (jqXHR.status){  
	                // case(500):  
	                //     alert("服务器系统内部错误");  
	                //     break;  
	                case(401):  
	                    alert("没有这个用户名");  
	                    break;  
	                case(403):  
	                    alert("没有登陆");  
	                	// indexShow();
	                    break;  
	                default:  
	                    alert("网络不给力,可以尝试刷新");  
	            }  
	        }   
        });
	 $.ajaxSetup({
            type: "POST",
            data: {},
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            error: function(jqXHR, textStatus, errorThrown){  
            	console.log(jqXHR.status)
	            switch (jqXHR.status){  
	                // case(500):  
	                //     alert("服务器系统内部错误");  
	                //     break;  
	                case(401):  
	                    alert("没有这个用户名");  
	                    break;  
	                case(403):  
	                    alert("没有登陆"); 
	     //                storage.setItem('username', '');
		    //         	storage.setItem('location', ''); 
		    //         	param.username = storage.getItem('username');
						// param.location = storage.getItem('location'); 
	     //            	indexShow();	
	                    break;  
	                default:  
	                    alert("网络不给力,可以尝试刷新");  
	            }  
	        }   
        });

	

	function BEATSUSLIKS(){
		this.stage;
		this.loader;
		this.game_time = document.getElementById("game_time");
		
		this.fixed_DATA = null;
		this.Game={
			gameOver: false,
			container: [],
			init: function(){
				this.gameOver = false;
			}
		};
		this.RANDOM = [];
		this.cancleEndTime = null;
		this.bAJAX = false;
		this.canPlay = false;
		this.params = param;
		this.getListDataTimer = null;
		this.listDataTime = listDataTime;
		this.indexToPlay = indexToPlay;
		this.init();

	};
	BEATSUSLIKS.prototype.init = function(){
		var that = this;
		this.stage = new createjs.Stage("susliks");
		createjs.Touch.enable(this.stage);
		manifest = [
			{src: "box.png", id: "box"},
			{src: "box2.png", id: "box2"},
			{src: "agl.png", id: "A1"},
			{src: "azsbg.png", id: "A2"},
			{src: "ahryg.png", id: "A3"},
			{src: "arbb.png", id: "A4"},
			{src: "aym.png", id: "A5"},
			{src: "aqq.png", id: "A6"},
			{src: "ahz.png", id: "A7"},
			{src: "bywrsj.png", id: "B8"},
			{src: "busbxfs.png", id: "B9"},
			{src: "bwdcz.png", id: "B10"},
			{src: "bxyy.png", id: "B11"},
			{src: "bdfmyl.png", id: "B12"},
			{src: "bqkl.png", id: "B13"},
			{src: "bscfh.png", id: "B14"},
			{src: "bsnh.png", id: "B15"},
			{src: "bzksnd.png", id: "B16"},
			{src: "cwxsb.png", id: "C17"},
			{src: "cdytgq.png", id: "C18"},
			{src: "cdnsrb.png", id: "C19"},
			{src: "cnssbd.png", id: "C20"},
			{src: "ddgq.png", id: "D21"},
			{src: "djkc.png", id: "D22"},
			{src: "ezndfg.png", id: "E23"},
			{src: "esrnrhgq.png", id: "E24"}
		];

		this.loader = new createjs.LoadQueue(false);
		this.loader.addEventListener("complete", function(){
			that.handleComplete();
		});
		this.loader.loadManifest(manifest, true, "./images/gifts/");
	};
	BEATSUSLIKS.prototype.handleComplete = function(){
		var that = this;
		for(var i=0;i<9;i++){
			var row = i%3,
				col = Math.floor(i/3);
			this.Game.container[i] = new CreateBox(this,6+row*215,95+col*190);
			this.stage.addChild(this.Game.container[i].container);
		};
		that.initFixed_DATA();
		var bBegin = true;
		// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		that.canPlay = true;
    	$('#beginGame').addClass('active');
    	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		$('#beginGame').click(function(){
			if(bBegin&&that.canPlay){
				bBegin = false;
				$('#rule').hide();
				
				$.ajax({       
		            type:"GET", 
		            url:globalURL+'/start', 
		            success: function(data){
		            	if(data.isExpired){
		            		// alert('已经领了或者随机派送');
		            		that.game_time.innerHTML = '00:00';
		            		$('#reward').show().addClass('hasRandom');
		            	}
		            	else if(data.giftId){
		            		
		            	console.log(data);
		            		var imgID = data.price + data.giftId;
		            		
			            	that.rewardShow({
			            		'img': that.loader.getResult(imgID).src,
			            		'text': that.fixed_DATA[imgID][1]
			            	});
			            	clearInterval(that.getListDataTimer)

			            	that.game_time.innerHTML = '00:00';	
		            	}
		            	else{
		            		$('.canvasCon').show();
			            	that.countTime(data.leftTime);
							createjs.Ticker.addEventListener("tick", function(event){
								that.tick(event);
							});
		            	}
		            }
	            });
			}
		});

	};
	BEATSUSLIKS.prototype.initFixed_DATA = function(){
		var game_list = $('#game_list'),
			that = this;
		$.ajax({       
	        type:"GET",
	        url:globalURL+'/giftList', 
	        success: function(data){
	        	console.log(data);
	        	that.fixed_DATA = data.gifts;
	        	// console.log(data.gifts)
				    //{A1:[0: 1,
					// 1: "甘栗",
					// 2: 2500,
					// 3: "零食",
					// 4: "A1"]}
					getListData();
        		if( that.params.isRandom == true){
        			$('#reward').show().addClass('hasRandom');
        			
	            	clearInterval(that.getListDataTimer)

        		}
        		else if(that.params.ID){
	        		
	            	that.rewardShow({
	            		'img': that.loader.getResult(that.params.ID).src,
	            		'text': that.fixed_DATA[that.params.ID][1]
	            	});
	            	clearInterval(that.getListDataTimer)
	            	that.game_time.innerHTML = '00:00';	
        		}
        		else if(that.indexToPlay > 0){
        			$('.canvasCon').show();
	            	that.countTime(that.indexToPlay);
					createjs.Ticker.addEventListener("tick", function(event){
						that.tick(event);
					});
        		}
	        	else{
	        		$('#rule').show();
	        		initRuleList();
	        		initRuleTime()
			    	
					that.getListDataTimer = setInterval(getListData,that.listDataTime);
	        	}
	        }   
	        	
	    });
	    var day,hour,minu,sec;
		//初始化游戏时间
		function initRuleTime(){
			$.ajax({       
		        type:"GET",
		        url:globalURL+'/startLeftTime', 
		        success: function(data){
		        	// console.log(data.startLeftTime)
		        	var startLeftTime = data.startLeftTime;
		        	renderTime(startLeftTime);

	        		var timer = setInterval(function(){
			        	renderTime(startLeftTime--);
			        	if(startLeftTime <= 0){
				        	that.canPlay = true;
				        	$('#beginGame').addClass('active');
				        	$('#leftTime').html('活动进行中');
				        	clearInterval(timer);
			        	}
	        		},1000);
		        }
	        });
		}
		function initRuleList(){

			var typeDATA = {
				"团购券":[],
				"电子产品":[],
				"生活用品":[],
				"零食":[]
			};

			for(var attr in that.fixed_DATA){
				that.fixed_DATA[attr][4] = attr; 
				// console.log(that.fixed_DATA[attr][2])
				switch(that.fixed_DATA[attr][3]){
					case '零食': 
						typeDATA.零食.push(that.fixed_DATA[attr]);
						break;
					case '生活用品': 
						typeDATA.生活用品.push(that.fixed_DATA[attr]);
						break;
					case '电子产品': 
						typeDATA.电子产品.push(that.fixed_DATA[attr]);
						break;
					case '团购券': 
						typeDATA.团购券.push(that.fixed_DATA[attr]);
						break;
				}
			};
			var str = '';
			$('.rule_gift_list').html('');
			for(var attr in typeDATA){
				sortJSON(typeDATA[attr],0);
				var $li = $('<li class="clear"><p class="gift_title">'+attr+'</p></li>')
				for (var i = 0,len = typeDATA[attr].length; i < len; i++) {
					$li.append('<div> <img class="gift_img" src="'+that.loader.getResult(typeDATA[attr][i][4]).src+'"/> <p class="gift_name">'+typeDATA[attr][i][1]+'</p> <p class="gift_beat">'+typeDATA[attr][i][0]+'次</p> </div>') ;
					$('.rule_gift_list').append($li);
				};
			}
		};

		function renderTime(startLeftTime){
			day = parseInt(startLeftTime/(3600*24));
    		hour = parseInt(startLeftTime%(3600*24)/3600);
    		minu = parseInt(startLeftTime%(3600*24)%3600/60);
    		sec = parseInt(startLeftTime%(3600*24)%3600%60);
    		var str = '';
    		if(day){
    			str = toTwo(day)+'天 '+toTwo(hour)+':'+toTwo(minu)+':'+toTwo(sec);
    		}
    		else {
    			str = toTwo(hour)+':'+toTwo(minu)+':'+toTwo(sec);

    		}
    		$('#leftTime').html(str);

		}
		function toTwo(n){
			return n<10?'0'+n:n;
		}
		function sortJSON(arr,key){
			return arr.sort(function(a,b){
				var x = a[key],y = b[key];
				return x>y ? -1:((x<y)?1:0);
			})
		}
		function getListData(){
			$.ajax({       
		            type:"GET",
		            url:globalURL+'/giftStatus', 
		            success: function(data){
		            	var giftStatus = data.giftStatus;
		            	game_list.html('<li class="game_list_t"> <span>名称</span> <span>剩余数量</span> <span>剩余次數</span> </li> <li class="game_list_t"> <span>名称</span> <span>剩余数量</span> <span>剩余次數</span> </li>') ;

		            	// console.log(that.fixed_DATA)
		            	for (var i = 0,len=giftStatus.length; i < len; i++) {
			            	var dataID = giftStatus[i].price + giftStatus[i].id;
		            		var $li = $('<li> <span></span> <span></span><span></span> </li>');
			            	$li.find('span').eq(0).html(giftStatus[i].name);
			            	$li.find('span').eq(1).html(giftStatus[i].remain);
			            	$li.find('span').eq(2).html(that.fixed_DATA[dataID][0]);
			            	$li.find('span').eq(1).removeClass('active');
			            	if(giftStatus[i].remain <= 0){
			            		$li.find('span').eq(1).addClass('active');
			            	}
			            	game_list.append($li);
		            		
		            	};
		            }
	            });
		};
	}
	BEATSUSLIKS.prototype.countTime = function(allTime){
		var that = this;
		that.timer = setInterval(function(){
			allTime--;
			allTime= (allTime<10) ?'0'+allTime:allTime;
			that.game_time.innerHTML = '00:'+allTime;
			if(allTime<=0){
				that.clearCountTime();
        		$('.canvasCon').hide();
		        clearInterval(that.getListDataTimer);
				$('#reward').show().addClass('hasRandom');
			}
		},1000);
	};
	BEATSUSLIKS.prototype.clearCountTime = function(){
		clearInterval(this.timer);
		this.Game.gameOver = true;
		this.game_time.innerHTML = '00:00';
	};
	BEATSUSLIKS.prototype.tick = function(event){
		var that = this;
		if(!that.Game.gameOver){
			that.nextframe();
		};
		this.stage.update(event);
	}
	BEATSUSLIKS.prototype.nextframe = function(){
		var that = this,
			target;
			for (var i = 0; i < 9; i++) {
				(function(i){
					if(!that.Game.container[i].isMoving&&!that.bAJAX){
						if(!that.RANDOM.length){
							that.bAJAX = true;
							that.getDATA(function(){
								that.bAJAX = false;
								target =that.RANDOM.pop();
								that.Game.container[i].giftMove(target);
							});
						}
						else{
							target =that.RANDOM.pop();
							that.Game.container[i].giftMove(target);
						};
					}
				})(i);
			};
	};
	BEATSUSLIKS.prototype.getDATA = function(cb){
		var that = this;
		$.ajax({       
	            type:"GET",
	            url:globalURL+'/gifts', 
	            success: function(data){
	            	that.RANDOM = data.gifts;
	            	cb();
	            }
            });
	};
	
	BEATSUSLIKS.prototype.showMask = function(json,cb){
		
		$('.canvasWrap').prepend('<div class="game_mask"> <div class="game_mask_con clear"> <p>'+json.title+'</p> <a>'+json.button+'</a> </div></div>');
		$('.game_mask').on('click','a',function(){
			cb&& cb();
			$('.game_mask').remove();
		});
	};
	BEATSUSLIKS.prototype.rewardShow = function(json){
		$('#reward').show().removeClass('hasRandom');
    	$('#rewardImg').attr({'src': json.img});
    	$('.rewardText').html('<div class="rewardText fr"> <p>恭喜<span class="rewardName">'+that.params.username+'</span></p> <p>砸中<span class="rewardResult">'+json.text+'</span>一份</p> <p>您的圣诞礼物将会搭乘小火箭送到<span class="rewardLoca">'+that.params.location+'</span></p> </div>');

    	
    }
	BEATSUSLIKS.prototype.getGift = function(target){
		var that = this,
			imgID = target.price + target.id;
		// $('.tips').hide();
		$.ajax({       
            type:"POST",
            // url:'./js/test.json', 
            url:globalURL+'/save/'+target.id, 
            success: function(data){
            	var code = data.code;

            	if(code == 'success'){
            		// 恭喜 抢到礼物了
					that.clearCountTime();
            		$('.canvasCon').hide();
	            	that.rewardShow({
	            		'img': that.loader.getResult(imgID).src,
	            		'text': that.fixed_DATA[imgID][1]
	            	});
		            clearInterval(that.getListDataTimer);
            	}
            	else{
            		
	            	if(data.giftEmpty){
	            		// 抱歉这个礼物已经被人抢走了
	            		that.showMask({
	            			'title':'抱歉这个礼物已经被人抢光了',
	            			'button':'继续游戏'
	            		})
	            		// $('.tips').show();
	            	}
            	}
            }
        });
	}
	

	function CreateBox(point,posX,posY){
		this.isMoving = false;
		this.haveTouched = false;
		this.point = point;
		this.target;
		this.container = new createjs.Container();
		this.gift = new createjs.Container();
		this.shape = new createjs.Shape();
		this.shape.graphics.beginFill("#5d302d").drawEllipse(0, 0, 146, 90);
		this.shape2 = new createjs.Shape();

		this.shape2.graphics.beginFill("#522623").drawEllipse(14, 20, 120, 70);

		this.bitmap2 = new createjs.Bitmap(point.loader.getResult("box"));
		this.bitmap2.regY = 90;
		this.bitmap2.x = 12;

		// this.bitmap3 = new createjs.Bitmap(point.loader.getResult("box2"));
		// this.bitmap3.regY = 90;
		// this.bitmap3.x = 12;

		this.bitmap = new createjs.Bitmap(point.loader.getResult("A1"));
		this.bitmap.regY = 25;
		this.bitmap.x = 24;

		this.text = new createjs.Text("3", "40px hkhb-webfont", "#ffffff");
		this.text.textAlign = "center";
		this.text.x = 76;
		this.text.y = -70;
		this.text2 = new createjs.Text("丹麦蓝罐曲奇", "12px arial", "#5d302d");
		this.text2.textAlign = "center";
		this.text2.x = 75;
		this.text2.y = 55;
		this.mask = new createjs.Shape();
		this.mask.x = 0;
		this.mask.y = 0;
		this.mask.graphics.beginFill("#000").moveTo(5, 10).lineTo(5, 50).quadraticCurveTo(10,92,89,90).quadraticCurveTo(146,78,142,40).lineTo(142, -166).lineTo(5, -166).closePath();
		// this.mask.graphics.beginFill("#000").moveTo(5, 10).lineTo(5, 10).quadraticCurveTo(10,92,89,95).quadraticCurveTo(146,88,152,50).lineTo(152, -166).lineTo(5, -166).closePath();
		this.gift.mask = this.mask;
		this.gift.addChild(this.bitmap,this.bitmap2,this.text,this.text2);
		this.gift.y = 0;
		this.container.addChild(this.shape,this.shape2,this.gift);
		this.container.x = posX;
		this.container.y = posY;
		this.addTouch();
	};
	CreateBox.prototype.giftMove = function(target){
		if(!this.isMoving){
			var Tween = createjs.Tween,
				Ease = createjs.Ease,
				id= target.price + target.id,
				that = this;
			this.target = target;
			this.isMoving = true;
			this.bitmap2.image = this.point.loader.getResult('box');
			this.text.color = '#ffffff';
			this.text.text = this.point.fixed_DATA[id][0];
			this.text2.text = target.name;
			this.bitmap.image = this.point.loader.getResult(id);
			this.Tween = Tween.get(this.gift).to({y:0}, 100, Ease.sineInOut).wait(this.point.fixed_DATA[id][2]).to({y:180}, 100, Ease.sineInOut).wait(200).call(function(){
					that.isMoving = false;
					that.haveTouched = false;
			})
		};
	};
	CreateBox.prototype.addTouch = function() {
		var that = this,
			id;
		this.container.addEventListener("mousedown", function(){
			id= that.target.price + that.target.id;	
			if(that.bitmap.y<120&&!that.haveTouched){
				that.haveTouched = true;
				that.bitmap2.image = that.point.loader.getResult('box2');
				that.text.color = '#e71405';
					that.text.text -= 1;
					console.log(that.text.text);
				if(that.text.text <=1){
					that.point.getGift(that.target);
				}
				else{
					// that.text.text -= 1;
					that.point.fixed_DATA[id][0] = that.text.text;
				}
			};
		});
	};
	CreateBox.prototype.forceHide = function() {
		var that = this;

		this.Tween.setPaused(true);
	}
	function gameShow(){
		// window.location.hash = '#game';
		
		BEATSUSLIKS = new BEATSUSLIKS();

		var susliks = $('#susliks');
		susliks.on('mousemove',function(ev){
			$(this).css({'cursor': ' url("sb.ico"), default'})
		})
		susliks.on('mousedown',function(ev){
			$(this).css({'cursor': ' url("sb2.ico"), default'})
			
		})
		susliks.on('mouseup',function(ev){
			$(this).css({'cursor': ' url("sb.ico"), default'})
			
		})
	};

	function indexShow(){
		$.ajax({       
	        type:"GET",
	        url:globalURL+'/location',
	        dataType:'json', 
	        success: function(data){
	        	var location = data.locationList;
	        	for (var i = 0,len = location.length; i < len; i++) {
	        		$('.location').append('<option>'+location[i]+'</option>')
	        	};
	        	begin();
	        }

	    });
	};
	
	if(window.location.hash == '#game'){
	
		gameShow();
	}else{
		indexShow();
	}
	function begin(){
		login.addEventListener('click',function(){
			var name = $('.login_form input').val(),
				location = $('.login_form select').val();
			if(name&&location){
				$.ajax({       
			            type:"POST",
			            url:globalURL+'/login',
			            data: {
			            	'username':name,
			            	'location':location
			            },
			            dataType:'json', 
			            success: function(data){

			            	console.log(data)
			            	// var param = '?username='+name+'&location='+location;
			    //         	storage.setItem('username', name);
			    //         	storage.setItem('location', location);
			    //         	param.username = storage.getItem('username');
							// param.location = storage.getItem('location');
							param.username = name;
							param.location = location;
			            	if(data.giftId == 0){
			            		if(data.isExpired){
			            			param.isRandom = true;
			            		}
			            		if(data.leftTime > 0 && data.leftTime < 60){
			            			indexToPlay = data.leftTime;
			            		}
			            	}
			            	else {
		            			param.ID = (data.price + data.giftId);
			            	}
			            	$('#index').hide();	
						$('#game').show();
							gameShow();		            	
			            }

		        });
			}
			else{
				alert("请输入用户名和收货地点")
			}
		})
	}
	