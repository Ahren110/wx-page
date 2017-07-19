let gulp = require('gulp'); //引入gulp模块
let $ = require('gulp-load-plugins')(); //引入gulp加载的所有插件（需要本地安装依赖所用到的插件）

var delFile = require('del');

var cache = require('gulp-cache');

//开启一个任务，用于对图片文件的处理
gulp.task('images', function () {
	return gulp.src('src/**/**/**/**/**/*.{bmp,jpg,jpeg,png,tiff,gif,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,WMF,svg,ico}')
		// 2. 压缩文件
		.pipe($.imagemin({
	        progressive: true,
	        svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
	    }))
	    
		// 3. 另存为压缩文件
		.pipe(gulp.dest('dist'));
});
//开启一个任务，用于对javascript文件的处理
gulp.task('scripts',['clean'], function () {
	return gulp.src('src/**/**/**/**/**/*.js')
		 //将es6代码编译成es2015
		.pipe($.babel())
		// 2. 压缩文件
		.pipe($.uglify({
		    compress: true,
		    mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
		}))
		// 3. 另存为压缩文件
		.pipe(gulp.dest('dist'));
});
//开启一个任务，用于对样式文件的处理
gulp.task('styles', function () {
	return gulp.src('src/**/**/**/**/**/*.{css,wxss}')
		 //压缩样式文件
		.pipe($.minifyCss({
			processImport: true
		}))
		.pipe($.csso())
		// 3. 另存为压缩文件
		.pipe(gulp.dest('dist'));
});

//开启一个任务，用于对样式文件的处理
gulp.task('uhtml',['clean'], function () {
	return gulp.src('src/**/**/**/**/**/*.{html,wxml}')
        .pipe($.htmlmin({
	        removeComments: true,//清除HTML注释
	        collapseWhitespace: true,//压缩HTML
	        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
	        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
	        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
	        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
	        minifyJS: true,//压缩页面JS
	        minifyCSS: true//压缩页面CSS
    	}))
        .pipe(gulp.dest('dist'));
});


gulp.task('uother', function () {
	return gulp.src('src/**/**/**/**/**/*.{eot,woff,woff2,ttf}')
	    .pipe(gulp.dest('dist'));
});
gulp.task('ujson', function () {
	return gulp.src('src/**/**/**/**/**/*.json')
		.pipe(plugins.jsonminify())
	    .pipe(gulp.dest('dist'));
});
gulp.task('uxml', () => {
  return gulp.src(['src/**/*.xml'])
    .pipe($.htmlmin({
      collapseWhitespace: true,
      keepClosingSlash: true, // xml
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }))
    .pipe(plugins.rename({ extname: '.wxml' }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
})

gulp.task('del',function () {
    delFile('dist');                               // 构建前先删除dist文件里的旧版本
})


gulp.task('clean', function (done) {
  return cache.clearAll(done);
});

/*

      .pipe($.concat('all.js')) //合并js代码
        .pipe(gulp.dest('./build/js')) //将合并后的js代码输出到build/js目录下
        .pipe($.uglify()) //进行压缩JS文件

        .pipe($.rename(function (path) { //修改压缩后的文件名称，防止覆盖上边的输出
            // {filename:'all.js',basename:'base',extname:'js'}
            path.basename += '.min'; // 在basename的基础上加上min，表示此文件为同名称文件的压缩版文件
        }))

        .pipe($.cleanCss()) //压缩合并后的css文件

*/

//default为gulp自动执行的任务，数组里注册的是，每个任务的执行（也叫default任务所依赖的任务），其中任务之间是有相互依赖关系的，所以在执行每个任务的时候用到了return，防止任务在执行的时候乱了乱了顺序（一个任务才执行一点就开始下一个任务，这样插入到最终的html文件中，得不到我们想要的结果）
gulp.task('default',['scripts','styles','images','uhtml','uother']); //将任务组合起来执行