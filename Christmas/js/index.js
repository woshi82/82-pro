
	var login = document.getElementById('login_button'),
		param = {},
		indexToPlay = 0,
		storage = window.localStorage,
		storageSession = window.sessionStorage,
		BEATSUSLIKS1;
	

	param.username = storage.getItem('username');
	param.location = storage.getItem('location');
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
	                case(500):  
	                    alert("服务器系统内部错误");  
	                    break;  
	                case(401):  
	                    alert("没有这个用户名");  
	                    break; 
	                case(0):  
	                case(403):  
	                    console.log("没有登陆");  
	                	indexShow();
					    param.username = storage.removeItem('username');
						param.location = storage.removeItem('location');
						param.username = null;
						param.location = null;
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
	                case(500):  
	                    alert("服务器系统内部错误");  
	                    break;  
	                case(401):  
	                    alert("没有这个用户名");  
	                    break;
	                case(0):  
	                case(403):  
	                    console.log("没有登陆");	
	                    indexShow();
					    param.username = storage.removeItem('username');
						param.location = storage.removeItem('location');
						param.username = null;
						param.location = null;
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
		
		this.fixed_DATA = {};
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
		// $('.rule_top_no').hide();
		// $('.rule_top_yes').show();
		// that.canPlay = true;
    	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		$('#beginGame').click(function(){
			// if(storage.getItem('bhasPlay') == "true"){
			// 	alert("你已经在其他页面开始了游戏")
			// }
			// else{
				if(bBegin&&that.canPlay){
					// storage.setItem('bhasPlay',true);
					bBegin = false;
					$('#rule').hide();
					
					$.ajax({       
			            type:"GET", 
			            url:globalURL+'/start', 
			            success: function(data){
				            clearInterval(that.getListDataTimer);
				            that.getListData();
				            $('#game_list').show();
		        			$('.rule_gift_list').hide();
			            	if(data.isExpired || data.isRandom){
			            		// alert('已经领了或者随机派送');
			            		that.params.isRandom = true;
			            		that.game_time.innerHTML = '00:00';
			            		if(data.giftId){
			            			var imgID = data.price + data.giftId;
				        			that.rewardShow({
				        				'hasRandom': true,
					            		'img': that.loader.getResult(imgID).src,
					            		'text': that.fixed_DATA[imgID][1]
					            	});
			        			}
			        			else{
					            	that.rewardShow({
				        				'hasRandom': true
					            	});
			        			}
				            	// clearInterval(that.getListDataTimer)
			            	}
			            	else if(data.giftId){
			            	//获得礼物
			            		var imgID = data.price + data.giftId;
			            		
				            	that.rewardShow({
				            		'img': that.loader.getResult(imgID).src,
				            		'text': that.fixed_DATA[imgID][1]
				            	});

				            	that.game_time.innerHTML = '00:00';	
			            	}
			            	else{
			            		if(storage.getItem('fixed_DATA')){
						        	that.fixed_DATA = JSON.parse(storage.getItem('fixed_DATA'));

			            		}
			            		$('.canvasCon').show();
				            	that.countTime(data.leftTime);
								that.getListDataTimer = setInterval(function(){
									that.getListData();
								},that.listDataTime);
								createjs.Ticker.addEventListener("tick", function(event){
									that.tick(event);
								});

			            	}
			            }
		            });
				}
			
			// }
			
		});
		$('.logout').click(function(){
			$.ajax({       
	            type:"GET", 
	            url:globalURL+'/logout', 
	            success: function(data){
	            	BEATSUSLIKS1 = null;
	            	delete BEATSUSLIKS;
	            	
					storage.removeItem('username');
					storage.removeItem('location');
					storage.removeItem('fixed_DATA')
					// storage.removeItem('bhasPlay');
					// storage.setItem('bhasPlay',true);
					param.username = null;
					param.location = null;
					
					clearInterval(that.getListDataTimer);
					clearInterval(that.timer2);
					clearInterval(that.timer);
					that.clearCountTime();
					$('#reward').hide();
					$('#rule').hide();
					$('#canvasCon').hide();
					window.location.reload();
					// indexShow();
	            }
	        })

		});

	};
	BEATSUSLIKS.prototype.initFixed_DATA = function(){
		var game_list = $('#game_list'),
			that = this;
		$.ajax({       
	        type:"GET",
	        url:globalURL+'/giftList', 
	        success: function(data){
	        	// that.fixed_DATA = data.gifts;
	        	if(!storage.getItem('fixed_DATA')){
	        		for(var attr in data.gifts){
						data.gifts[attr][4] = attr;
						data.gifts[attr][5] = data.gifts[attr][0];
					}
					var giftsStr = JSON.stringify(data.gifts);
	        		storage.setItem('fixed_DATA',giftsStr)
	        	}
	        	that.fixed_DATA = JSON.parse(storage.getItem('fixed_DATA'));
				    //{A1:[0: 1,
					// 1: "甘栗",
					// 2: 2500,
					// 3: "零食",
					// 4: "A1"]}
				// console.log(that.fixed_DATA);
        		if( that.params.isRandom == true){
        			// $('#reward').show().addClass('hasRandom');
        			$('#game_list').show();
        			$('.rule_gift_list').hide();
					getListData();
	            	clearInterval(that.getListDataTimer);
        			if(that.params.ID){
	        			that.rewardShow({
	        				'hasRandom': true,
		            		'img': that.loader.getResult(that.params.ID).src,
		            		'text': that.fixed_DATA[that.params.ID][1]
		            	});
        			}
        			else{
		            	that.rewardShow({
	        				'hasRandom': true
		            	});
        			}

        		}
        		else if(that.params.ID){
	        		$('#game_list').show();
        			$('.rule_gift_list').hide();
					getListData();
	            	clearInterval(that.getListDataTimer);
	            	that.rewardShow({
	            		'img': that.loader.getResult(that.params.ID).src,
	            		'text': that.fixed_DATA[that.params.ID][1]
	            	});
	            	that.game_time.innerHTML = '00:00';	
        		}
        		else if(that.indexToPlay > 0){
        			$('.canvasCon').show();
	            	that.countTime(that.indexToPlay);
					createjs.Ticker.addEventListener("tick", function(event){
						that.tick(event);
					});

					$('#game_list').show();
        			$('.rule_gift_list').hide();
					getListData();
					that.getListDataTimer = setInterval(function(){
						that.getListData();
					},that.listDataTime);
        		}
	        	else{
	        		$('#rule').show();
	        		initRuleList();
	        		initRuleTime()
			    	
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
		        	if(startLeftTime <= 0){
			        	that.canPlay = true;
			        	$('.rule_top_no').hide();
			        	$('.rule_top_yes').show();
		        	}
		        	else{
			        	renderTime(startLeftTime);	
		        	}

	        		that.timer2 = setInterval(function(){
			        	renderTime(startLeftTime--);
			        	if(startLeftTime <= 0){
				        	that.canPlay = true;
				        	// $('#beginGame').addClass('active');
				        	// $('#leftTime').html('活动进行中');
				        	$('.rule_top_no').hide();
				        	$('.rule_top_yes').show();
				        	clearInterval(that.timer2);
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
				// that.fixed_DATA[attr][4] = attr; 
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
				sortJSON(typeDATA[attr],5);
				var $li = $('<li class="clear"><p class="gift_title">'+attr+'</p></li>');

				for (var i = 0,len = typeDATA[attr].length; i < len; i++) {
					var name='';
					switch(typeDATA[attr][i][4]){
						case 'B10':
							name = typeDATA[attr][i][1]+'(6包)';
							break;
						case 'B11':
							name = typeDATA[attr][i][1]+'(3包)';
							break;
						case 'B16':
							name = typeDATA[attr][i][1]+'(5个)';
							break;
						default:
							name=typeDATA[attr][i][1];
					}

					$li.append('<div> <img class="gift_img" src="'+that.loader.getResult(typeDATA[attr][i][4]).src+'"/> <p class="gift_name">'+name+'</p> <p class="gift_beat">点击数：'+typeDATA[attr][i][5]+'</p> </div>') ;
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
    			str = '<span>'+toTwo(day)+'</span>天<span>'+toTwo(hour)+'</span>小时<span>'+toTwo(minu)+'</span>分<span>'+toTwo(sec)+'</span>秒';
    		}
    		else {
    			str = '<span>'+toTwo(hour)+'</span>小时<span>'+toTwo(minu)+'</span>分<span>'+toTwo(sec)+'</span>秒';

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
		that.getListData = getListData;
		function getListData(){
			$.ajax({       
		            type:"GET",
		            url:globalURL+'/giftStatus', 
		            success: function(data){
		            	var giftStatus = data.giftStatus;
		            	game_list.html('<li class="game_list_t"> <span>名称</span> <span>剩余数量</span> <span>剩余次數</span> </li> <li class="game_list_t"> <span>名称</span> <span>剩余数量</span> <span>剩余次數</span> </li>') ;

		            	for (var i = 0,len=giftStatus.length; i < len; i++) {
			            	var dataID = giftStatus[i].price + giftStatus[i].id;
		            		var $li = $('<li> <span></span> <span></span><span></span> </li>');
			            	$li.find('span').eq(0).html(giftStatus[i].name);
			            	$li.find('span').eq(1).html(giftStatus[i].remain);
			            	$li.find('span').eq(2).html(that.fixed_DATA[dataID][0]);
			            	$li.find('span').eq(1).removeClass('active');
			            	$li.find('span').eq(2).removeClass('active');
			            	if(giftStatus[i].remain <= 0){
			            		$li.find('span').eq(1).addClass('active');
			            	};
			            	if(that.fixed_DATA[dataID][0] < that.fixed_DATA[dataID][5]){
				            	if(that.fixed_DATA[dataID][0] == 0){
				            		$li.find('span').eq(2).addClass('zero');
				            	}
				            	else{
				            		$li.find('span').eq(2).addClass('beat');
				            		
				            	}
			            	};

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
				that.rewardShow({
    				'hasRandom': true
            	});

			}
		},1000);
	};
	BEATSUSLIKS.prototype.clearCountTime = function(){
		var that = this;
		
		clearInterval(that.timer);
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
								// that.bAJAX = false;
								target =that.RANDOM.pop();
								that.Game.container[i].giftMove(target);
							});
						}
						else{
							target =that.RANDOM.pop();
							var id= target.price + target.id;

							if(that.fixed_DATA[id][0] > 0){
								that.Game.container[i].giftMove(target);
							}else{
								i--;
							}
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
	            },
	            complete: function(){
					that.bAJAX = false;
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

    	if(json.hasRandom){
    		$('.rewardImg').show();

    		$('#reward').show().addClass('hasRandom');
    		if(json.text){
    			var location = !(this.params.location) || this.params.location == 'null' ?'您的常驻工作地':this.params.location;
		    	$('#rewardImg').attr({'src': json.img}).show();
		    	$('.reward_random').html('<div class="randomDetail"><p>恭喜<span class="rewardName">'+this.params.username+'</span></p> <p>随机获得<span class="rewardResult">'+json.text+'</span>一份</p> <p>您的圣诞礼物将会搭乘小火箭送到<span class="rewardLoca">'+location+'</span></p></div>');	
    		}else{
    			$('.rewardImg').hide();
		    	$('.reward_random').html('<span class="randomGo">2015年12月21日下午3:30后，系统随机分配礼物，届时刷新页面或重新登陆该网站可见。<span>');	

    		}
    	}
    	else{
    		$('.rewardImg').show();
	    	$('#rewardImg').attr({'src': json.img}).show();

			$('#reward').show().removeClass('hasRandom');
	    	$('.rewardText').html('<p>恭喜<span class="rewardName">'+this.params.username+'</span></p> <p>砸中<span class="rewardResult">'+json.text+'</span>一份</p> <p>您的圣诞礼物将会搭乘小火箭送到<span class="rewardLoca">'+this.params.location+'</span></p>');
    	}

    	
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
	            	setTimeout(function(){
			            clearInterval(that.getListDataTimer);
					},5000);
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
		this.target = {};
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
			if(that.bitmap.y<120&&!that.haveTouched){
				id= that.target.price + that.target.id;	
				that.haveTouched = true;
				that.bitmap2.image = that.point.loader.getResult('box2');
				that.text.color = '#e71405';
					that.text.text -= 1;
					// console.log(that.text.text);
				that.point.fixed_DATA[id][0] = that.text.text;
				var giftsStr = JSON.stringify(that.point.fixed_DATA);
	        		storage.setItem('fixed_DATA',giftsStr)
				if(that.text.text <=0){
					that.point.getGift(that.target);
				}
			};
		});
	};
	CreateBox.prototype.forceHide = function() {
		var that = this;

		this.Tween.setPaused(true);
	};

	function gameShow(){
		window.location.hash = '#game';
		$('#index').hide();	
		$('#game').show();
		BEATSUSLIKS1 = new BEATSUSLIKS();

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

		//游戏说明
		$('.slide_but').on('click','a',function(){
			$(this).addClass('active').siblings().removeClass('active').parents('.rule_intro').find('.slide_con a').removeClass('active').eq($(this).index()).addClass('active');
		});
		// var iNow = 0,
		// 	len = $('.slide_but a').length;
		// setInterval(function(){
		// 	iNow++;
		// 	if(iNow>=len){
		// 		iNow=0;
		// 	}
		// 	$('.slide_but a').removeClass('active').eq(iNow).addClass('active');
		// 	$('.slide_con a').removeClass('active').eq(iNow).addClass('active');
		// },3000);

		$('#beginGame').on({
			'mousedown':function(){
				$(this).addClass('press');
			},
			'mouseup':function(){
				$(this).removeClass('press');
			}
		})
	};

	function indexShow(){
		window.location.hash = '';
		$('#index').show();	
		$('#game').hide();
		$.ajax({       
	        type:"GET",
	        url:globalURL+'/location',
	        dataType:'json', 
	        success: function(data){
	        	// console.log(data)
	        	var location = data.locationList;
	        	if(!location){
	        		$('.location_wrap').hide();
	        		$('.name_wrap').addClass('active');
	        	}
	        	else{
	        		$('.location_wrap').show();
		        	for (var i = 0,len = location.length; i < len; i++) {
		        		$('.location').append('<option>'+location[i]+'</option>')
		        	};
	        	}
	        	begin();
	        }

	    });
	};
	// window.location.hash == '#game' ||
	
	if(( param.username&&param.location)){
		gameShow();
	}else{
		indexShow();
	}
	function begin(){
		login.addEventListener('click',function(){
			var name = $('.login_form input').val(),
				location = $('.login_form select').val();
			if(name){
				$.ajax({       
			            type:"POST",
			            url:globalURL+'/login',
			            data: {
			            	'username':name,
			            	'location':location
			            },
			            dataType:'json', 
			            success: function(data){
			            	param.isRandom = null;
			            	param.ID = null;
							// param.username = name;
							// param.location = location;
							storage.removeItem('fixed_DATA')
							storage.setItem('username',name);
							storage.setItem('location',data.location);
							param.username = storage.getItem('username');
							param.location = storage.getItem('location');
							if(data.isRandom || data.isExpired ){
								param.isRandom = true;
								if(data.giftId != 0){
									param.ID = (data.price + data.giftId);
								}
							}
							else if(data.giftId == 0){
								if(data.leftTime > 0 && data.leftTime < 60){
			            			indexToPlay = data.leftTime;
			            		}
							}
			            	else {
		            			param.ID = (data.price + data.giftId);
			            	}
			            	// console.log(param)
							gameShow();		            	
			            }

		        });
			}
			else{
				alert("请输入用户名")
			}
		})
	}
	