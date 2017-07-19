var postfix = '_deadtime';
var $;
function CACHE($$) {
    $ = ($$);
    return "缓存方法（有时间限制 默认1秒)";
};
CACHE.prototype.put = function (k, v, t) {
    wx.setStorageSync(k, v)
    var seconds = parseInt(t);
    if (seconds > 0) {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000 + seconds;
        wx.setStorageSync(k + postfix, timestamp + "")
    } else {
        wx.removeStorageSync(k + postfix)
    }
};
CACHE.prototype.get = function(k, def) {
    var deadtime = parseInt(wx.getStorageSync(k + postfix))
    if (deadtime) {
        if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
            return def ?def:'';
        }
    }
    var res = wx.getStorageSync(k);
    return  res ? res : res;
};
CACHE.prototype.remove = function(k) {
    wx.removeStorageSync(k);
    wx.removeStorageSync(k + postfix);
};
CACHE.prototype.clear = function clear() {
    wx.clearStorageSync();
};
module.exports = CACHE;
