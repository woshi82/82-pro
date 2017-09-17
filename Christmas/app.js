var express = require('express'),
	path = require('path'),
    app = express();

// 根目录
var basePath = process.cwd();
app.use(express.static(basePath));


// 首页为 index_dev.html
app.get('/index1', function (req, res) {
    res.sendFile(path.join(__dirname, 'index1.html'));
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/index_dev', function (req, res) {
    res.sendFile(path.join(__dirname, 'index_dev.html'));
});
app.get('/game', function (req, res) {
    res.sendFile(path.join(__dirname, 'game.html'));
});
app.get('/game_dev', function (req, res) {
    res.sendFile(path.join(__dirname, 'game_dev.html'));
});



var port = process.env.PORT || 99;
app.listen(port, function () {
    console.log(' tank listening on port ' + port);
});