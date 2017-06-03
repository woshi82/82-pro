'use strict';
console.log(33333)

  // "private": true,
  // "scripts": {
  //   "watch": "fis3 server clean & fis3 release -cwL",
  //   "start": "fis3 server start",
  //   "release": "fis3 release -cpd ../",
  //   "ci": "npm i; npm i bower && node_modules/bower/bin/bower install && fis3 release -compd ../"
  // },
var path = require('path');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoStore = require('connect-mongo')(session);
var dataBaseUrl = 'mongodb://localhost/82Pro';

var PKG_FILE_PATH = '../package.json';
var PKG_NAME = require(PKG_FILE_PATH).name;

var BASE_DIR = path.join(__dirname, '..','frontend');
var DEFAULT_I18N = 'default';
var EXT_HTML = 'html';
var app = express();
global.app = app;
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(express.static(BASE_DIR, {}));
//配置session、cookie
app.use(cookieParser());

app.use(session({
    secret: '82Pro',
    store: new mongoStore({
        url: dataBaseUrl,
        collection: 'session',
        key:'express.sid'
    })
}));

//链接数据库
mongoose.connect(dataBaseUrl);

require('../config/routes')(app);




// 启动服务
var PORT = process.env.PORT || 9000;

express()
    .use('/' + PKG_NAME, app)
    .listen(PORT, function() {
        console.log('Server start! http://127.0.0.1:%d/%s/<view-name>', PORT, PKG_NAME);
    });
