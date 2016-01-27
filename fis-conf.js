'use strict';


var pkg = require('./package.json');
var fs = require('fs');
// uae 配置的 path
fis.config.set('base.path', pkg.name);
// 后端 japid 目录
fis.config.set('backend.japid', 'app/japidsource/japidviews/FrontendController');
// 后端静态资源目录
fis.config.set('backend.static', 'public');


/**
 * fis3 roadmap
 */
fis.match('*', {
    release: false
});
fis.media('prod').match('*', {
    useHash: true
});

function makeDevProdConf(selector, realRelease, devOptions, prodOptions) {
    var releaseWithBasePath = '/${base.path}' + realRelease;
    var dev = fis.util.extend({
        release: releaseWithBasePath
    }, devOptions);
    fis.match(selector, dev);

    var prod = fis.util.extend({
        url: releaseWithBasePath,
        release: realRelease
    }, prodOptions);
    fis.media('prod').match(selector, prod);
}

// 入口页面 其他静态文件
// makeDevProdConf(/^\/views\/([^\/]+)\/(.*)$/, '/${backend.static}/$2', {
//     preprocessor: fis.plugin('browserify')
// });

fis.match('**.less', {
	parser: fis.plugin('less'),
	rExt: '.css'
});
fis.match(/^\/views\/([^\/]+)\/(.*)$/, fis.util.extend({
        release: '/${base.path}'+'/${backend.static}/$2'
    }, {
        preprocessor: fis.plugin('browserify')
    })
);
fis.media('prod').match(/^\/views\/([^\/]+)\/(.*)$/, fis.util.extend({
        url: '/${base.path}'+'/${backend.static}/$2',
        release: '/${backend.static}/$2'
    }, {
        preprocessor: fis.plugin('browserify')
    })
);



//页面 模拟数据
fis.match(/^\/views\/([^\/]+)\/backend-data.js$/, {
    release: false
});
// 入口页面 html 文件
makeDevProdConf(/^\/views\/(u2[^\/]+)\/\1\.html$/, '/$1.html', {
    isLayout: true,
    ignoreBackendData:true
}, {
    release: '/${backend.japid}/$1.html',
    useHash: false
});
// 入口页面 html 文件
makeDevProdConf(/^\/views\/([^\/]+)\/\1.html$/, '/$1.html', {
    isLayout: true
}, {
    release: '/${backend.japid}/$1.html',
    useHash: false
});



// 组件 其他静态资源
makeDevProdConf(/^\/(bower_)?components\/(.*)$/, '/${backend.static}/$1c/$2');
// 组件 example
fis.match(/^\/bower_components\/([^\/]+)\/example\//, {
    release: false
});
// 组件 package.json
fis.match(/^\/(bower_)?components\/([^\/]+)\/package.json$/, {
    release: false
});
// 组件模板
makeDevProdConf(/^\/(bower_)?components\/([^\/]+)\/\2\.html$/, '/${backend.static}/$1c/$2/$2.html');
// // 组件 js css
// fis.match(/^\/(bower_)?components\/([^\/]+)\/\2\.(js|css|scss|less)$/, {
//     release: false
// });


fis.match('::package', {
    prepackager: fis.plugin('i18n')
});

fis.media('dev').match('/server/**', {
    release: '$0',
    useHash: false
});
fis.media('dev').match('/package.json', {
    release: '$0',
    useHash: false
});
