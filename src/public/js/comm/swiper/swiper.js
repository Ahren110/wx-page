(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.swiper = factory());
}(this, (function() {
  'use strict';

  var device = wx.getSystemInfoSync(); //  获取设备信息

  var DEFAULT = {
    /**
     * 必填项
     */
    slideLength: 0, //  由于目前无法直接获取slide页数，目前只能通过参数写入
    /**
     * 可选参数
     */
    width: device.windowWidth,
    height: device.windowHeight,
    direction: 'horizontal',
    initialSlide: 0,
    speed: 300,
    timingFunction: 'ease', //  过渡动画速度曲线
    autoplay: 0, //  自动播放间隔，设置为0时不自动播放
    directionViewName: 'directionClass', //  对应视图中direction类名
    animationViewName: 'animationData', //  对应视图中animation属性名
    /**
     * 事件回调
     * @type {[type]}
     */
    onInit: null, //  swiper初始化时执行
    onTouchStart: null, //  手指碰触slide时执行
    onTouchMove: null, //  手指碰触slide并且滑动时执行
    onTouchEnd: null, //  手指离开slide时执行
    onSlideChangeStart: null, //  slide达到过渡条件时执行
    onSlideChangeEnd: null, //  swiper从一个slide过渡到另一个slide结束时执行
    onTransitionStart: null, //  过渡时触发
    onTransitionEnd: null, //  过渡结束时执行
    onSlideMove: null, //  手指触碰swiper并且拖动slide时执行
    onSlideNextStart: null, //  slide达到过渡条件 且规定了方向 向前（右、下）切换时执行
    onSlideNextEnd: null, //  slide达到过渡条件 且规定了方向 向前（右、下）切换结束时执行
    onSlidePrevStart: null, //  slide达到过渡条件 且规定了方向 向前（左、上）切换时执行
    onSlidePrevEnd: null //  slide达到过渡条件 且规定了方向 向前（左、上）切换结束时执行
  };

  var handle = {
    touchstart: function touchstart(e) {
      var onTouchStart = this.onTouchStart,
        XORY = this.XORY,
        activeIndex = this.activeIndex,
        rectDistance = this.rectDistance;

      var touch = e.changedTouches[0];
      var distance = touch['client' + XORY];
      var translate = -activeIndex * rectDistance;

      this['touchStart' + XORY] = distance;
      this['translate' + XORY] = translate;
      this.touchStartTime = new Date().getTime();

      typeof onTouchStart === 'function' && onTouchStart(this, e); //  当手指碰触到slide时执行

      this.slideAnimation(translate, 0);
    },
    touchmove: function touchmove(e) {
      var onTouchMove = this.onTouchMove,
        XORY = this.XORY,
        onSlideMove = this.onSlideMove;

      var touch = e.changedTouches[0];
      var distance = touch['client' + XORY];
      var tmpMove = this['translate' + XORY] + distance - this['touchStart' + XORY];

      typeof onTouchMove === 'function' && onTouchMove(this, e); //  手指碰触slide并且滑动时执行

      this.slideAnimation(tmpMove, 0);

      typeof onSlideMove === 'function' && onSlideMove(this);
    },
    touchend: function touchend(e) {
      var onTouchEnd = this.onTouchEnd,
        XORY = this.XORY,
        speed = this.speed,
        touchStartTime = this.touchStartTime,
        rectDistance = this.rectDistance;

      var touch = e.changedTouches[0];
      var distance = touch['client' + XORY];
      var touchEndTime = new Date().getTime();

      var action = this.action(touchStartTime, touchEndTime, this['touchStart' + XORY], distance, rectDistance);

      typeof onTouchEnd === 'function' && onTouchEnd(this, e); //  手指离开slide时执行

      this[action](true, speed);
    }
  };

  /**
   * Created by sail on 2017/4/1.
   */

  var controller = {
    /**
     * 切换控制器
     * @param touchStartTime： 手指触碰slide时的时间戳
     * @param et： 手指离开slide时的时间戳
     * @param from： 手指触碰slide时的屏幕位置
     * @param to： 手指离开slide时的屏幕位置
     * @param wrapperDistance： slide滑动方向上的容器长度
     * @returns {*}
     */
    action: function action(touchStartTime, touchEndTime, from, to, wrapperDistance) {
      var activeIndex = this.activeIndex,
        slideLength = this.slideLength,
        onTransitionStart = this.onTransitionStart;

      var deltaTime = touchEndTime - touchStartTime; //  手指触摸时长
      var distance = Math.abs(to - from); //  滑动距离

      var k = distance / deltaTime;

      if (to > from) {
        typeof onTransitionStart === 'function' && onTransitionStart(self); // slide达到过渡条件时执行
        return k > 0.3 || distance > wrapperDistance / 2 ? activeIndex === 0 ? 'slideBack' : 'slidePrev' : 'slideBack';
      }

      if (to < from) {
        typeof onTransitionStart === 'function' && onTransitionStart(self); // slide达到过渡条件时执行
        return k > 0.3 || distance > wrapperDistance / 2 ? activeIndex === slideLength - 1 ? 'slideBack' : 'slideNext' : 'slideBack';
      }

      if (to = from) {
        return 'slideBack';
      }
    }
  };

  var methods = {
    /**
     * 切换至下一个slide
     * @param runCallbacks： 可选，boolean，设置为false时不会触发onSlideChange回调函数
     * @param speed: 可选，num(单位ms)，切换速度
     */
    slideNext: function slideNext() {
      var runCallbacks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;

      var self = this;
      var onSlideNextStart = self.onSlideNextStart,
        onSlideNextEnd = self.onSlideNextEnd;


      typeof onSlideNextStart === 'function' && onSlideNextStart(self); // slide达到过渡条件时执行

      self.slideTo(self.activeIndex + 1, speed, runCallbacks);

      typeof onSlideNextEnd === 'function' && setTimeout(function() {
        onSlideNextEnd(self);
      }, speed); //  slide过渡结束后执行
    },

    /**
     * 切换至上一个slide
     * @param runCallbacks： 可选，boolean，设置为false时不会触发onSlideChange回调函数
     * @param speed: 可选，num(单位ms)，切换速度
     */
    slidePrev: function slidePrev() {
      var runCallbacks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;

      var self = this;
      var onSlidePrevStart = self.onSlidePrevStart,
        onSlidePrevEnd = self.onSlidePrevEnd;


      typeof onSlidePrevStart === 'function' && onSlidePrevStart(self); // slide达到过渡条件时执行

      self.slideTo(self.activeIndex - 1, speed, runCallbacks);

      typeof onSlidePrevEnd === 'function' && setTimeout(function() {
        onSlidePrevEnd(self);
      }, speed); //  slide过渡结束后执行
    },

    /**
     * 回弹
     * @param runCallbacks: 可选，boolean，设置为false时不会触发onSlideChange回调函数
     * @param speed: 可选，num(单位ms)，切换速度
     */
    slideBack: function slideBack() {
      var runCallbacks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;

      var self = this;
      var XORY = self.XORY,
        activeIndex = self.activeIndex,
        rectDistance = self.rectDistance,
        onTransitionEnd = self.onTransitionEnd;


      var translate = -activeIndex * rectDistance;

      self.slideAnimation(translate, speed);

      typeof onTransitionEnd === 'function' && setTimeout(function() {
        onTransitionEnd(self);
      }, speed); //  slide过渡结束后执行
    },

    /**
     * 切换到指定slide
     * @param index：必选，num，指定将要切换到的slide的索引
     * @param speed：可选，num(单位ms)，切换速度
     * @param runCallbacks：可选，boolean，设置为false时不会触发onSlideChange回调函数
     */
    slideTo: function slideTo(index) {
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
      var runCallbacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var self = this;
      var slideLength = self.slideLength,
        activeIndex = self.activeIndex,
        rectDistance = self.rectDistance,
        onSlideChangeStart = self.onSlideChangeStart,
        onSlideChangeEnd = self.onSlideChangeEnd,
        onTransitionEnd = self.onTransitionEnd,
        consoleException = self.consoleException;


      try {
        if (typeof index !== 'number') throw 'paramType'; //  参数类型错误
        if (index < 0 || index > slideLength - 1) throw 'bound'; //  越界

        var translate = -index * rectDistance;
        self.previousIndex = activeIndex;
        self.activeIndex = index;
        self.isBeginning = self.activeIndex === self.initialSlide;
        self.isEnd = self.activeIndex === self.slideLength - 1;

        runCallbacks && typeof onSlideChangeStart === 'function' && onSlideChangeStart(self); // slide达到过渡条件时执行

        self.slideAnimation(translate, speed);

        runCallbacks && typeof onSlideChangeEnd === 'function' && setTimeout(function() {
          onSlideChangeEnd(self);
        }, speed); //  swiper从一个slide过渡到另一个slide结束后执行
        typeof onTransitionEnd === 'function' && setTimeout(function() {
          onTransitionEnd(self);
        }, speed); //  slide过渡结束后执行
      } catch (err) {
        consoleException(err, 'slideTo[Function]');
      }
    }
  };

  /**
   * Created by sail on 2017/4/1.
   */
  var REG = {
    TRANSLATE: /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/,
    SPEED: /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/,
    TIMINGFUNCTION: /linear|ease|ease-in|ease-in-out|ease-out|step-start|step-end/
  };

  var animate = {
    /**
     * 平移动画
     * @param translate：平移位置
     * @param speed：过渡时长
     * @param timingFunction：过渡类型
     */
    slideAnimation: function slideAnimation() {
      var translate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
      var timingFunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'ease';
      var XORY = this.XORY,
        animationViewName = this.animationViewName,
        consoleException = this.consoleException;

      try {
        /**
         * 异常处理
         */
        if (!REG.TRANSLATE.test(translate)) throw 'paramType';
        if (!REG.SPEED.test(speed)) throw 'paramType';
        if (!REG.TIMINGFUNCTION.test(timingFunction)) throw 'paramType';
        /**
         * 创建一个动画实例
         */
        var animation = wx.createAnimation({
          transformOrigin: '50% 50%',
          duration: speed,
          timingFunction: timingFunction,
          delay: 0
        });

        animation['translate' + XORY](translate).step(); //  动画描述

        this.syncView(animationViewName, animation); //  同步动画到视图
      } catch (err) {
        consoleException(err, 'slideAnimation[Function]');
      }
    }
  };

  var classCallCheck = function(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();



  var defineProperty = function(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  /**
   * Created by sail on 2017/4/1.
   */
  var sync = {
    /**
     * 同步设置到视图
     * @param DEFAULT：默认参数
     * @param param：构造参数
     */
    syncView: function syncView(viewName, prop) {
      this.pageContext.setData(defineProperty({}, "" + viewName, prop));
    }
  };

  /**
   * Created by sail on 2017/4/1.
   */
  var ERROR = {
    'paramType': '参数类型错误',
    'bound': '参数越界'
  };

  var exception = {
    /**
     * 错误对照
     */
    consoleException: function consoleException(type, place) {
      console.log(type);
      console.log('%c' + place + ':' + ERROR[type], 'color: red');
    }
  };

  var swiper = function() {
    function swiper(param) {
      classCallCheck(this, swiper);


      var pages = getCurrentPages();

      //  获取到当前page上下文
      this.pageContext = pages[pages.length - 1];
      //  把this依附在Page上下文的wecropper属性上，便于在page钩子函数中访问
      this.pageContext.swiper = this;

      var all = Object.assign(this, DEFAULT, param || {});

      this.init(all);

      // this.syncInit(all)
    }

    /**
     * 初始化配置
     */


    createClass(swiper, [{
      key: 'init',
      value: function init(param) {
        var _this = this;

        var speed = param.speed,
          initialSlide = param.initialSlide,
          direction = param.direction,
          autoplay = param.autoplay,
          directionViewName = param.directionViewName;


        var directionClass = direction === 'horizontal' ? 'we-container-horizontal' : 'we-container-vertical';
        this.syncView(directionViewName, directionClass);
        this.rectDistance = direction === 'horizontal' ? this.width : this.height;
        this.XORY = direction === 'horizontal' ? 'X' : 'Y';
        this.activeIndex = initialSlide; //  将初始页码赋给activeIndex
        this.noSwiper = false; //  阻止手势滑动
        this.previousIndex = initialSlide; //  返回上一个活动块的索引，切换前的索引
        this.slideTo(initialSlide, 0);
        typeof autoplay === 'number' && autoplay > 0 && setInterval(function() {
          if (_this.isEnd) {
            _this.slideTo(0, speed);
          } else {
            _this.slideTo(_this.activeIndex + 1, speed);
          }
        }, autoplay);
        /**
         * 处理callback
         */
        var onInit = this.onInit;

        typeof onInit === 'function' && onInit(this);
      }
    }]);
    return swiper;
  }();

  Object.assign(swiper.prototype, controller);
  Object.assign(swiper.prototype, handle);
  Object.assign(swiper.prototype, methods);
  Object.assign(swiper.prototype, animate);
  Object.assign(swiper.prototype, sync);
  Object.assign(swiper.prototype, exception);

  return swiper;

})));