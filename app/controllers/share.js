var ShareData = require('../models/shareData'),
	fs = require("fs"),
    path = require('path'),
    multer = require('multer'),
    os = require('os');

var app = global.app;

exports.getList = function (req,res){ 
    var params = req.body;
    // console.log(params)
    var test = {
            image: 'images/content/1.png',
            title: '其他的其他',
            href: 'www.baidu.com',
            qrCode: 'images/content/code1.png',
            describe: '随便说点什么了什么了什么了',
            from: '个人',
            praiseNum: 20
        };
    _shareData = new ShareData(test);
    // _shareData.save(function(err, list){
    //     console.log('chenggong')
        
        ShareData.paging(params.page,params.n, function(err, lists){
            if (err) {
                console.log(err)
            }
            // console.log(lists);
            res.send({
                lists: lists
            })
        });
    // });   
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

