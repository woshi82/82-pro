var express = require('express'),
	path = require('path'),
    app = express();

// 根目录
var basePath = process.cwd();
app.use(express.static(basePath));


// 首页为 index_dev.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});



var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(' tank listening on port ' + port);
});