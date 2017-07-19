var _extend, _mi_extend, _isObject;
_isObject = function (o) {
	return Object.prototype.toString.call(o) === '[object Object]';
};
_mi_extend = function self(destination, source) {
	try {
		var property;
		for (property in destination) {
			if (destination.hasOwnProperty(property)) {
				// 若destination[property]和sourc[property]都是对象，则递归
				if (_isObject(destination[property]) && _isObject(source[property])) {
					self(destination[property], source[property]);
				};
				// 若sourc[property]已存在，则跳过
				if (source.hasOwnProperty(property)) {
					continue;
				} else {
					source[property] = destination[property];
				}
			}
		}
	} catch (e) {
		// TODO: handle exception
	}
};
_extend = function () {
	var arr = arguments,
		result = {},
		i;
	if (!arr.length) return {};
	for (i = arr.length - 1; i >= 0; i--) {
		if (_isObject(arr[i])) {
			_mi_extend(arr[i], result);
		};
	}
	arr[0] = result;
	return result;
};


function _EACHFN(obj, callback) {
	var length = obj.length;
	if (length === undefined) {
		for (var name in obj) {
			if (obj.hasOwnProperty(name)) {
				if (callback.call(obj[name], obj[name], name) === false) {
					break;
				}
			}
		}
	} else {
		for (var i = 0; i < length; i++) {
			if (callback.call(obj[i], obj[i], i) === false) {
				break;
			}
		}
	}
}
function isString(t) {
	return "string" == typeof t && t.constructor == String
}

/**
 * [_trimFn 去除字符串空格]
 * @param  param [description]
 *
 * @param  type  [l,left,1]
 * @return       [left 前空格]
 *
 * @param  type  [r,right,2]
 * @return       [left 后空格]
 *
 * @param  type  [a,all,3]
 * @return       [left 所有空格]
 *
 * @Default
 * @return [l and r 前后空格]
 */
function _trimFn(param, type) {
	switch (type) {
		case ("l"||"left"||1) :
			return param.replace(/(^\s*)/gm, "");
		case ("r"||"right"||2) :
			return param.replace(/(\s*$)/gm, "");
		case ("a"||"all"||3) :
			return param.replace(/\s+/gm, "");
		default:
			return param.replace(/(^\s*)|(\s*$)/gm, "");
	}
}

 /**
  * [changeCase 字母大小写切换]
  * @param  param [description]
  *
  * @param  type  [1]
  * @return       [toLowerCase 首字母大写]
  *
  * @param  type  [2]
  * @return       [toUpperCase 首页母小写]
  *
  * @param  type  [3]
  * @return       [toLowerCase<=>toUpperCase 大小写转换]
  *
  * @param  type  [4]
  * @return       [all toLowerCase 全部大写]
  *
  * @param  type  [5]
  * @return       [all toUpperCase 全部小写]
  *
  * @Default
  * @return [原来的值]
  */
function _changeCaseFn(param,type)
{
	switch(type){
		case 1:return str.replace(/^(\w)(\w+)/,function (v,v1,v2){return v1.toUpperCase()+v2.toLowerCase();});
		case 2:return str.replace(/^(\w)(\w+)/,function (v,v1,v2){return v1.toLowerCase()+v2.toUpperCase();});
		case 3:return str.replace(/^([a-z]+)([A-Z]+)/,function (v,v1,v2){return v1.toUpperCase()+v2.toLowerCase();});
		case 4:return str.toUpperCase();
		case 5:return str.toLowerCase();
		default:return str;
	}
}

/**
 * [_isEmpty description]
 * @param  {[type]}  param [description]
 * @return {Boolean}       [description]
 */
function _isEmpty(param) {
    param = _trimFn(param);
    if (param == null || param == "null")
		return true;
    if (param == undefined || param == 'undefined')
		return true;
    if (param == "")
		return true;
    if (param.length == 0)
		return true;
    if (!/[^(^\s*)|(\s*$)]/.test(param))
		return true;
    if (param == "not find")
        return true;
	return false;
}
/**
 * [isExits description]
 * @param  {[type]}  param [description]
 * @return {Boolean}       [description]
 */
function isExits(param) {
	return "function" == typeof param
}
/**
 * [_replaceAll 字符串替换]
 * @param  {[type]} param     [字符串]
 * @param  {[type]} AFindText [字符格式]
 * @param  {[type]} ARepText  [替换成什么]
 * @return {[type]}           [替换后的字符串]
 */
function _replaceAll(param, AFindText, ARepText) {
	let raRegExp = new RegExp(AFindText, "gm");
	return param.replace(raRegExp, ARepText);
}
/**
 * [checkType 检测字符串]
 * @param  {[type]} param [description]
 * @param  {[type]} type  [description]
 * @return {[type]}       [description]
 */
function _checkTypeFn (param, type) {
	switch (type) {
		case 'email':
			return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(param);
		case 'phone':
			return /^1[3|4|5|7|8][0-9]{9}$/.test(param);
		case 'tel':
			return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(param);
		case 'number':
			return /^[0-9]$/.test(param);
		case 'english':
			return /^[a-zA-Z]+$/.test(param);
		case 'chinese':
			return /^[\u4E00-\u9FA5]+$/.test(param);
		case 'lower':
			return /^[a-z]+$/.test(param);
		case 'upper':
			return /^[A-Z]+$/.test(param);
		default :
			return true;
	}
}

/**
 * [randomNumber 随机字符串 uuid]
 * @param  {[type]} count [description]
 * @return {[type]}       [description]
 */
function _randomNumFn(count){
   return Math.random().toString(count).substring(2);
}

/**
 * [upDigit 现金额大写]
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
function _upDigitFn(param)
{
	var fraction = ['角', '分','厘'];
	var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
	var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];
	var head = param < 0? '欠人民币': '人民币';
	param = Math.abs(param);
	var s = '';
	for (var i = 0; i < fraction.length; i++)
	{
		s += (digit[Math.floor(param * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
	}
	s = s || '整';
	param = Math.floor(param);
	for (var i = 0; i < unit[0].length && param > 0; i++)
	{
		var p = '';
		for (var j = 0; j < unit[1].length && param > 0; j++)
		{
			p = digit[param % 10] + unit[1][j] + p;
			param = Math.floor(param / 10);
		}
		//s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')+ unit[0][i] + s;
		s = p+ unit[0][i] + s;
	}
	return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

/**时间戳****/
function _toPegStrFn(_date){
	/**默认返回时间戳，否则返回当前时间戳**/
	var _pag;
	try {
		_pag = _toDateFn(_date).getTime();
	} catch (e) {
		// TODO: handle exception
	}
	return _pag;
};
function _timeToFn(_date){
	_date = ( parseInt(_date) * 1000 )+"" ;
	_date = _date.substr(0,13);
	_date = parseInt(_date,10);
	return new Date(_date);
};
/**时间格式兼容****/
function _toDateFn(_date){
	var _ltime = null,_llltime = null;
	if(typeof _date == "object" ){
		_ltime = _date;
	}else if( _IS.string(_date) ){
		if( _date.indexOf("-")>-1 || _date.indexOf("/")>-1 ){
			if(_date.indexOf("-")>-1){
				_llltime = (_date.replace(/-/g,"/"));
			}
			_ltime=new Date(_llltime);
		}else{
			_ltime=_timeToFn(_date);
		}
	}else if( _IS.num(_date) ){
		_ltime=_timeToFn(_date);
	}else{
		_ltime=new Date();
	}
	return _ltime;
};
function _FormatFn(_date,_fmt) { //author: meizz
	var _dateObj = _toDateFn(_date);
	var o = {
		"M+": _dateObj.getMonth() + 1, //月份
		"d+": _dateObj.getDate(), //日
		"h+": _dateObj.getHours(), //小时
		"m+": _dateObj.getMinutes(), //分
		"s+": _dateObj.getSeconds(), //秒
		"q+": Math.floor((_dateObj.getMonth() + 3) / 3), //季度
		"S": _dateObj.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(_fmt)){
		_fmt = _fmt.replace(RegExp.$1, (_dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o)
	if (new RegExp("(" + k + ")").test(_fmt)){
		_fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	}
	return _fmt;
}
function _dateDiffFn(hisTime,nowTime){
	if(!arguments.length) return '';
	var arg = arguments,
	now =arg[1]?arg[1]:new Date().getTime(),
	diffValue = now - _toPegStrFn(arg[0]),
	_data = _FormatFn(arg[0],"yyyy-MM-dd hh:mm:ss"),
	result='',
	second=1000,minute = second * 60,hour = minute * 60,day = hour * 24,halfamonth = day * 15,month = day * 30,year = month * 12,
	_year = diffValue/year,_month =diffValue/month,_week =diffValue/(7*day),
	_day =diffValue/day,_hour =diffValue/hour,_min =diffValue/minute,_sec =diffValue/second;
	if(_year>=1){
		result={"_":_year,msg:_data,s:_data};
	}else if(_month>=1){
		result={"_":_month,msg:parseInt(_month) +_long("个月前"),s:parseInt(_week) +_long("周")};
	}else if(_week>=1){
		result={"_":_week,msg:parseInt(_week) +_long("周前"),s:parseInt(_week) +_long("周")};
	}else if(_day>=1){
		result={"_":_day,msg:parseInt(_day) +_long("天前"),s:parseInt(_day) +_long("天")};
	}else if(_hour>=1){
		result=parseInt(_hour) +_long("小时前");
		result={"_":_hour,msg:parseInt(_hour) +_long("小时前"),s:parseInt(_hour) +_long("小时")};
	}else if(_min>=1){
		result=parseInt(_min) +_long("分钟前");
		result={"_":_min,msg:parseInt(_min) +_long("分钟前"),s:parseInt(_min) +_long("分钟")};
	}else if(_sec>=1){
		result={"_":_sec,msg:parseInt(_sec) +_long("秒前"),s:parseInt(_sec)+_long("秒")};
	}else{
		result={"_":diffValue,msg:_long("刚刚"),s:_long("2个月")};
	}
	return result;
}
/**
 * [_getlenFn description]
 * @param  {[type]} jsonData [description]
 * @return {[type]}          [description]
 */
function _getlenFn(jsonData){
	var jsonLength = 0;
	for(var item in jsonData){
		jsonLength++;
	}
	return jsonLength;
}
/**
 * [_formatKilobitFn description]
 * @param  {[type]} num     [description]
 * @param  {[type]} decimal [description]
 * @return {[type]}         [description]
 */
function  _formatKilobitFn(num, decimal){
	if(num&&num!=""){
		if(_IS.string(num)) num = parseFloat(num);
	    if(null == decimal || decimal == undefined) decimal = 2;
	    return (num.toFixed(decimal) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
	}else{
		return 0;
	}
	return 0;
}


/**
 * [TIMERFN 时间戳]
 * @param {[type]} _STRCODE [description]
 */
function TIMERFN(_STRCODE) {
    var wxTimer = $.getData("wxTimer") || {};
    var coed = "获取验证码";
    wxTimer["stop"] = 0;
    wxTimer["name"] = "time stop";
    var intDiff = parseInt(_STRCODE["code"]);//倒计时总秒数量
    var TIMEOUTFN = setInterval(function () {
        if (intDiff <= 0 || (wxTimer["stop"] && wxTimer["stop"] > 0)) {
            clearInterval(TIMEOUTFN);
            wxTimer["name"] = "time stop";
            wxTimer["stop"] = 1;
            _STRCODE["then"](wxTimer);
            return;
        }
        var outMsg = _STRCODE["msg"](intDiff);
        wxTimer["t"] = outMsg; wxTimer["id"] = TIMEOUTFN; wxTimer["name"] = "time start";
        _STRCODE["then"](wxTimer);
        intDiff--;
    }, 1000);
}

/**
 * [DEFINEFN 获取私有属性]
 * @param {[type]} Element [description]
 * @param {[type]} method  [description]
 * @param {[type]} value   [description]
 */
function DEFINEFN(Element, method, value) {
    if ("val" == method) {
        return Element.detail.value
    } else if ("name" == method) {
        return Element.target.dataset.name
    }
}


let Utilities ={};

Utilities.extend = _extend;
Utilities.isEmpty = _isEmpty;
Utilities.replace = _replaceAll;
Utilities.trim = _trimFn;
Utilities.each = _EACHFN;
Utilities.fn = isExits;

Utilities.isString = isString;


Utilities.len = _getlenFn;

Utilities.upDigit = _upDigitFn;
Utilities.random = _randomNumFn;
Utilities.checkType = _checkTypeFn
Utilities.case = _changeCaseFn;
Utilities.upDigit = _upDigitFn;
Utilities.random = _randomNumFn;
Utilities.checkType = _checkTypeFn;

Utilities.dateDiff = _dateDiffFn;
Utilities.format = _FormatFn;

Utilities.timetamp = _toPegStrFn;
Utilities.timeTo = _timeToFn;
Utilities.toDate = _toDateFn;

Utilities.formatKilobit = _formatKilobitFn;
Utilities.timer = TIMERFN;
Utilities.u = DEFINEFN;

module.exports = Utilities;
