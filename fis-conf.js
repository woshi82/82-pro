
var pkg = require('./package.json');
var fs = require('fs');

fis.config.set('static.path', 'frontend');
fis.config.set('static.serverp', pkg.name);
// fis.config.set('static.path', 'frontend');

// 默认及过滤需要产出的文件
fis.match('**', {
	  release: false
});
fis.match('${static.path}/font/(**)', {
	  release: '${static.serverp}/font/$1'
});

fis.match('${static.path}/images/(**)', {
  	// useHash: true,  	
  	release: '${static.serverp}/images/$1',
  	optimizer: fis.plugin('png-compressor')
});


// 产出压缩CSS
// fis.match('::package', {
//   	postpackager: fis.plugin('loader')
// });

fis.match('${static.path}/css/(**.css)', {
  	release: '${static.path}/css/$1',
  	optimizer: fis.plugin('clean-css'),
  	useHash: true 	

});
fis.match('${static.path}/css/**.css', {
  	packTo: '${static.path}/css/css.css'

});

// 产出 模块化js

// fis.match('::package', {
//   	postpackager: fis.plugin('loader')
// });

fis.match('${static.path}/(**.js)', {
    release: '${static.path}/$1',
    // optimizer: fis.plugin('uglify-js')
    // isMod: true
});
fis.match('${static.path}/{component/**.js,js/**.js}', {
    optimizer: fis.plugin('uglify-js')
    // isMod: true
});

fis.match('${static.path}/{component/**.js,js/**.js,modules/**.js,router/app.js}', {
  	useHash: true,  	
  	packTo: '${static.path}/js/script.js'
});

// fis.match('${static.path}/component/**.js', {
//   	useHash: true,  	
//   	packTo: '${static.path}/js/component.js'
// });
