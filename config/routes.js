var Share = require('../app/controllers/share');

module.exports = function(app){

	//app.use(Users.hasLogin);
	// Share.getList();
	//分享页
	app.post('/getShareList', Share.getList);
	app.post('/getShareListDet', Share.getListDet);
	app.post('/getSharePraise', Share.getPraise);

	/**
	 * 生成 404 页面 HTML
	 * @param  {string} pageName 页面
	 * @param  {string} la       语言
	 * @return {string}          404 页面 HTML
	 */
	function generate404HTML(pageName, la) {
	    return [
	        '<html><body>',
	            '<h1>404</h1>',
	            '<p>',
	                'page `<span style="color:red">',
	                pageName,
	                '</span>` with i18n `<span style="color:red">',
	                la,
	                '</span>` NOT found!',
	            '</p>',
	        '</body></html>'
	    ].join('');
	}

	/**
	 * @Important!!
	 * 请保持这段代码在最后的位置，保证页面路由(/:pageName)的优先级不会高过于其它
	 */

	app.get('/:pageName', function (req, res) {
	    var pageName = req.params.pageName;
	    var la = req.query.la;
	    var filePath = path.resolve(BASE_DIR, (pageName||'index')+ '.' + EXT_HTML);
	    try {
	        var stats = fs.lstatSync(filePath);
	        if (stats.isFile()) {
	            res.sendFile(filePath);
	        } else {
	            res.status(400).send(generate404HTML(pageName, la));
	        }
	    } catch(e) {
	        res.status(400).send(generate404HTML(pageName, la));
	    }
	});



}