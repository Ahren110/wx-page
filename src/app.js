require("public/js/comm/minquery");
wx.MinQuery.debug(false);
let $ = wx.MinQuery("app");

$.$servers({
    'ajaxServer': 'https://www.api.com/ajax',//设置公共的ajax请求服务器地址
    'socketServer': 'https://www.api.com/socket', //设置Socket服务器地址
    'uploadServer': 'https://www.api.com/upload', //设置upLoadFile服务器地址
    'downloadServer': 'https://www.api.com/download', //设置downloadFile服务器地址
    'imageServer': 'https://www.api.com/image', //设置图片服务器地址
    'audioServer': 'https://www.api.com/audio', //设置音频服务器地址
    'videoServer': 'https://www.api.com/video', //设置视频服务器地址
})

$(() => {
    var app = $("app");
    app.on('launch', function (e) {});

});
