var ShareData = require('../models/shareData'),
	fs = require("fs"),
    path = require('path'),
    multer = require('multer'),
    os = require('os');

var app = global.app;

exports.getList = function (req,res){ 
    var params = req.body;
    // console.log(params)
    var aTest = [{
            image: 'images/content/hgsoft.png',
            title: '华软产品展示APP',
            href: 'www.baidu.com',
            qrCode: 'images/content/code1.png',
            describe: '采用css3进行首页的产品展示及页面切换，用grunt进行优化产出。',
            from: '个人',
            praiseNum: 0
        },{
            image: 'images/content/xnhk.png',
            title: '新年贺卡微信页面',
            href: 'www.baidu.com',
            qrCode: 'images/content/code1.png',
            describe: '采用css3进行每张贺卡的动画展示，及贺卡的切换功能，用grunt进行优化产出。',
            from: '个人',
            praiseNum: 0
        },{
            image: 'images/content/hgsource.png',
            title: '前端资源分享系统',
            href: 'www.baidu.com',
            qrCode: 'images/content/code1.png',
            describe: '用Node进行项目后端框架的搭建，开发了展示页面、详细页面、新建文件、上传下载等数据交互功能。',
            from: '个人',
            praiseNum: 0
        },{
            image: 'images/content/chri.png',
            title: '圣诞节打地鼠抢礼物',
            href: 'www.baidu.com',
            qrCode: 'images/content/code1.png',
            describe: '独立完成项目的前端部分，难点在于整个游戏流程的逻辑处理，采用原型模式编写游戏逻辑。采用createJS绘制游戏场景。后期用grunt进行优化产出。',
            from: '个人',
            praiseNum: 0
        },{
            image: 'images/content/hgnews.png',
            title: '华软内刊APP',
            href: 'www.baidu.com',
            qrCode: 'images/content/code1.png',
            describe:'用ionic框架进行应用编写，主要负责这个项目的框架搭建，页面逻辑功能，项目基于ionic编码的规范化，页面逻辑、性能优化。了解一些cordova的开发库，用adb进行手机端调试，android-SDK进行最后打包上线',
            from: '个人',
            praiseNum: 0
        },{
            image: 'images/content/xtkj.png',
            title: 'PC端系统框架',
            href: 'www.baidu.com',
            qrCode: 'images/content/code1.png',
            describe: '需求开发一套统一的系统形框架，公司的大部分系统都要基于这个系统框架进行后期开发。前端部分采用angular为底层框架，用requireJS进行模块化开发。我主要负责了整个前端框架的搭建，页面切换功能等。主要遇到的难点是动态注入并加载模块，指令加载前请求数据等等',
            from: '个人',
            praiseNum: 0
        },{
            image: 'images/content/uiapp.png',
            title: 'UI前端组宣传APP',
            href: 'http://120.24.244.31:3000/',
            qrCode: 'images/content/uiappcode.png',
            describe: '独立完成项目的前端部分，根据设计图进行动画设想，采用svg制作动画,用AI工具处理图片及获取数据。根据浏览器渲染原理对动画逻辑进行优化，用grunt进行前端构建并优化产出产出。',
            from: '个人',
            praiseNum: 0
        }];
    // for (var i = 0; i < aTest.length; i++) {
    //     _shareData = new ShareData(aTest[i]);
    //     _shareData.save(function(err, list){
    //         console.log('chenggong')
    //         res.send({
    //                 tips: "chenggong"
    //             })
            ShareData.paging(params.page,params.n, function(err, lists){
                if (err) {
                    console.log(err)
                }
                // console.log(lists);
                res.send({
                    lists: lists
                })
            });
    //     });   
    // }
}

exports.getListDet = function (req,res){ 
    var id = req.body.id;
    var hasPraise = false;
    ShareData.findById(id, function(err, detail){
        if (err) {
            console.log(err);
        };
        if(req.session[id]){
            hasPraise = true;
        };
        // console.log(detail);
        res.send({
            detail: detail,
            hasPraise: hasPraise
        });
    });

}

exports.getPraise = function (req,res){   
    var id = req.body.id;
    
    ShareData.findById(id,function(err,detail){
        if (err) {
            console.log(err);
        };
        req.session[id] = id;
        console.log(req.session[id]);
        detail.praiseNum++;
        detail.save();
        res.send({
            praiseNum: detail.praiseNum
        });
    })

}
// getIp();
function getIp(){
    var ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0;

      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }
        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          console.log(ifname + '11:' + alias, iface.address);
        } else {
          // this interface has only one ipv4 adress
          console.log(234)
          console.log(ifname, iface.address);
        }
        ++alias;
      });
    });
};

