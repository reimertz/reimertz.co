(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.echo = factory(root);
  }
})(this, function (root) {

  'use strict';

  var echo = {};

  var callback = function () {};

  var offset, poll, delay, useDebounce, unload;

  var isHidden = function (element) {
    return (element.offsetParent === null);
  };
  
  var inView = function (element, view) {
    if (isHidden(element)) {
      return false;
    }

    var box = element.getBoundingClientRect();
    return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
  };

  var debounceOrThrottle = function () {
    if(!useDebounce && !!poll) {
      return;
    }
    clearTimeout(poll);
    poll = setTimeout(function(){
      echo.render();
      poll = null;
    }, delay);
  };

  echo.init = function (opts) {
    opts = opts || {};
    var offsetAll = opts.offset || 0;
    var offsetVertical = opts.offsetVertical || offsetAll;
    var offsetHorizontal = opts.offsetHorizontal || offsetAll;
    var optionToInt = function (opt, fallback) {
      return parseInt(opt || fallback, 10);
    };
    offset = {
      t: optionToInt(opts.offsetTop, offsetVertical),
      b: optionToInt(opts.offsetBottom, offsetVertical),
      l: optionToInt(opts.offsetLeft, offsetHorizontal),
      r: optionToInt(opts.offsetRight, offsetHorizontal)
    };
    delay = optionToInt(opts.throttle, 250);
    useDebounce = opts.debounce !== false;
    unload = !!opts.unload;
    callback = opts.callback || callback;
    echo.render();
    if (document.addEventListener) {
      root.addEventListener('scroll', debounceOrThrottle, false);
      root.addEventListener('load', debounceOrThrottle, false);
    } else {
      root.attachEvent('onscroll', debounceOrThrottle);
      root.attachEvent('onload', debounceOrThrottle);
    }
  };

  echo.render = function () {
    var nodes = document.querySelectorAll('img[data-echo], [data-echo-background]');
    var length = nodes.length;
    var src, elem;
    var view = {
      l: 0 - offset.l,
      t: 0 - offset.t,
      b: (root.innerHeight || document.documentElement.clientHeight) + offset.b,
      r: (root.innerWidth || document.documentElement.clientWidth) + offset.r
    };
    for (var i = 0; i < length; i++) {
      elem = nodes[i];
      if (inView(elem, view)) {

        if (unload) {
          elem.setAttribute('data-echo-placeholder', elem.src);
        }

        if (elem.getAttribute('data-echo-background') !== null) {
          elem.style.backgroundImage = "url(" + elem.getAttribute('data-echo-background') + ")";
        }
        else {
          elem.src = elem.getAttribute('data-echo');
        }

        if (!unload) {
          elem.removeAttribute('data-echo');
          elem.removeAttribute('data-echo-background');
        }

        callback(elem, 'load');
      }
      else if (unload && !!(src = elem.getAttribute('data-echo-placeholder'))) {

        if (elem.getAttribute('data-echo-background') !== null) {
          elem.style.backgroundImage = "url(" + src + ")";
        }
        else {
          elem.src = src;
        }

        elem.removeAttribute('data-echo-placeholder');
        callback(elem, 'unload');
      }
    }
    if (!length) {
      echo.detach();
    }
  };

  echo.detach = function () {
    if (document.removeEventListener) {
      root.removeEventListener('scroll', debounceOrThrottle);
    } else {
      root.detachEvent('onscroll', debounceOrThrottle);
    }
    clearTimeout(poll);
  };

  return echo;

});

},{}],2:[function(require,module,exports){
'use strict';

var _Writer = require('./modules/Writer');

var _Writer2 = _interopRequireDefault(_Writer);

var _Translater = require('./modules/Translater');

var _Translater2 = _interopRequireDefault(_Translater);

var _RickRolled = require('./modules/RickRolled');

var _RickRolled2 = _interopRequireDefault(_RickRolled);

var _LazyLoader = require('./modules/LazyLoader');

var _LazyLoader2 = _interopRequireDefault(_LazyLoader);

var _CursorFriend = require('./modules/CursorFriend');

var _CursorFriend2 = _interopRequireDefault(_CursorFriend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var echo = require('echo-js')(document.body);
var introText = 'hi, my name is piérre reimertz.\n\ni am a humble developer@@@#########magician@@@########coder, designer, fake-it-til-you-make-it#######################entrepreneur and everyday hustler.\nextremely addicted of building things.\n\n$http://github.com/reimertz$github$ | $http://twitter.com/reimertz$twitter$ | $mailto:pierre.reimertz@gmail.com$hire me$ ';

var writer = new _Writer2.default(document.querySelectorAll('.writer'), introText);
var translater = new _Translater2.default(document.querySelector('.tre-d'), 10, 15);
var rr = new _RickRolled2.default(5000, true, document.querySelector('all-my-secret-api-keys'));
var ll = new _LazyLoader2.default({ lines: 5,
  throttle: 500,
  checkOnStart: false,
  fakeSlowness: {
    delayBeforeFetch: function delayBeforeFetch() {
      return Math.random() * 3500 + 1000;
    },
    percentageOfImages: 0.3

  }
});
var cF = new _CursorFriend2.default({ selector: '.project', spanSelector: 'span' });

console.log(cF);
requestAnimationFrame(function () {
  writer.start();
  translater.start();
  rr.start();
  ll.start();
  cF.start();
});

},{"./modules/CursorFriend":3,"./modules/LazyLoader":4,"./modules/RickRolled":5,"./modules/Translater":6,"./modules/Writer":7,"echo-js":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Creator Pierre Reimertz MIT ETC ETC
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

var CursorFriend = function () {
  function CursorFriend(_ref) {
    var _ref$selector = _ref.selector;
    var selector = _ref$selector === undefined ? 'data-cursor-friend' : _ref$selector;
    var _ref$spanSelector = _ref.spanSelector;
    var spanSelector = _ref$spanSelector === undefined ? 'span' : _ref$spanSelector;

    _classCallCheck(this, CursorFriend);

    this.selector = selector;
    this.spanSelector = spanSelector;

    this._elements = [].slice.call(document.querySelectorAll('' + this.selector));

    this.onEnter = this.onEnter.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onLeave = this.onLeave.bind(this);
  }

  _createClass(CursorFriend, [{
    key: 'start',
    value: function start() {
      var _this = this;

      if (isMobile) return;
      this._elements.map(function (element) {
        element.addEventListener('mouseenter', _this.onEnter);
        element.addEventListener('mouseleave', _this.onLeave);
      });
    }
  }, {
    key: 'onEnter',
    value: function onEnter(event) {
      document.body.setAttribute('data-project-is-hovered', 'true');
      //event.currentTarget.addEventListener('mousemove', this.onMove)
    }
  }, {
    key: 'onMove',
    value: function onMove(event) {
      var span = event.currentTarget.querySelector(this.spanSelector);

      var x = event.screenX;
      var y = event.screenY;

      span.style.top = y / 10 - 50 + 'px';
      span.style.left = x / 10 - 50 + 'px';
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event) {
      document.body.setAttribute('data-project-is-hovered', 'false');
      //event.currentTarget.removeEventListener('mousemove', this.onMove)
    }
  }, {
    key: 'stop',
    value: function stop() {
      var _this2 = this;

      this._elements.map(function (element) {
        element.removeEventListener('mouseenter', _this2.onEnter);
        element.removeEventListener('mouseleave', _this2.onLeave);
      });
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.stop();
    }
  }]);

  return CursorFriend;
}();

exports.default = CursorFriend;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Creator Pierre Reimertz MIT ETC ETC

var LazyLoader = function () {
  function LazyLoader(_ref) {
    var _ref$attribute = _ref.attribute;
    var attribute = _ref$attribute === undefined ? 'data-lazy' : _ref$attribute;
    var _ref$offset = _ref.offset;
    var offset = _ref$offset === undefined ? document.body.getBoundingClientRect().height / 2 : _ref$offset;
    var _ref$lines = _ref.lines;
    var lines = _ref$lines === undefined ? 3 : _ref$lines;
    var _ref$throttle = _ref.throttle;
    var throttle = _ref$throttle === undefined ? 350 : _ref$throttle;
    var _ref$autoStart = _ref.autoStart;
    var autoStart = _ref$autoStart === undefined ? true : _ref$autoStart;
    var _ref$checkOnStart = _ref.checkOnStart;
    var checkOnStart = _ref$checkOnStart === undefined ? true : _ref$checkOnStart;
    var _ref$fakeSlowness = _ref.fakeSlowness;
    var fakeSlowness = _ref$fakeSlowness === undefined ? false : _ref$fakeSlowness;
    var _ref$placeholderImage = _ref.placeholderImages;
    var placeholderImages = _ref$placeholderImage === undefined ? [
    /* wide   */'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvYAAAQAAQMAAACwNI9dAAAAA1BMVEUb/5DUIh99AAAAdUlEQVR42u3BAQ0AAADCoPdP7ewBFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN4APAAGN6DpwAAAAAElFTkSuQmCC',
    /* tall   */'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWAQMAAAAGz+OhAAAAA1BMVEUb/5DUIh99AAAAGklEQVR4Ae3BAQEAAAQDMP1TiwHfVgAAwHoNC7gAASist30AAAAASUVORK5CYII=',
    /* square */'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWAQMAAABelSeRAAAAA1BMVEUb/5DUIh99AAAAHElEQVR4Xu3AAQkAAADCMPunNsdhWwoAAAAAABwW2gABlO2L2AAAAABJRU5ErkJggg=='] : _ref$placeholderImage;

    _classCallCheck(this, LazyLoader);

    this.attribute = attribute;
    this.autoStart = autoStart;
    this.checkOnStart = checkOnStart;
    this.offset = offset;
    this.lines = lines;
    this.throttle = throttle;
    this.fakeSlowness = fakeSlowness;
    this.placeholderImages = placeholderImages;

    this._elements = [].slice.call(document.querySelectorAll('[' + this.attribute + ']'));
    this._queue = [];
    this._listener = false;
    this._throttler = false;

    this.onLoad = this.onLoad.bind(this);

    if (this.autoStart) {
      this.start();
    }
  }

  _createClass(LazyLoader, [{
    key: 'start',
    value: function start() {
      var _this = this;

      if (!!this._listener) return;
      if (this.checkOnStart) this.check();

      this._elements.map(function (element) {
        if (!element.src || element.src === '') {
          element.src = _this.placeholderImages[Math.floor(Math.random() * (_this.placeholderImages.length - 1) + 0.5)];
        }
      });

      this._listener = function (event) {
        _this.check();
      };

      document.addEventListener('scroll', this._listener, false);
    }
  }, {
    key: 'stop',
    value: function stop() {
      document.removeEventListener('scroll', this._listener);
      this._listener = false;
      this._throttler = false;
    }
  }, {
    key: 'check',
    value: function check() {
      var _this2 = this;

      if (this._throttler) return;
      if (this._elements.length === 0) return this.stop();

      this._throttler = setTimeout(function () {
        _this2._throttler = false;

        _this2._elements = _this2._elements.map(function (element) {
          if (element === false) return false;
          if (element.nodeName !== "IMG") return false;

          if (element.getBoundingClientRect().top - _this2.offset < document.body.scrollTop) {
            _this2.queue(element);
            return false;
          } else {
            return element;
          }
        });

        _this2._elements = _this2._elements.filter(function (element) {
          if (element) return element;
        });
      }, this.throttle);
    }
  }, {
    key: 'queue',
    value: function queue(element) {
      this._queue.push(element);

      if (this._queue.length <= this.lines) {
        this.load(element);
      }
    }
  }, {
    key: 'load',
    value: function load(element) {
      var _this3 = this;

      this.setStatus(element, 'loading');

      element.addEventListener('load', this.onLoad, false);

      if (!!this.fakeSlowness && Math.random() <= this.fakeSlowness.percentageOfImages) {
        setTimeout(function () {
          element.src = element.getAttribute(_this3.attribute);
        }, this.fakeSlowness.delayBeforeFetch());
      } else {
        element.src = element.getAttribute(this.attribute);
      }
    }
  }, {
    key: 'onLoad',
    value: function onLoad(event) {
      var nextElement = undefined;
      var loadedElement = event.target;

      loadedElement.removeEventListener('load', this.onLoad, false);
      this.setStatus(loadedElement, 'loaded');

      this._queue = this._queue.filter(function (queuedElement) {
        if (queuedElement !== loadedElement) return queuedElement;
      });

      nextElement = this._queue.shift();

      if (!!nextElement) this.load(nextElement);
    }
  }, {
    key: 'setStatus',
    value: function setStatus(element, status) {
      element.setAttribute(this.attribute + '-status', status);
    }
  }]);

  return LazyLoader;
}();

exports.default = LazyLoader;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Creator Pierre Reimertz MIT ETC ETC

var mdRolled = [[".................. ............................... .......,-~~'''''''~~--,,_\n", ".................. ..................................,-~''-,:::::::::::::::::::''-,\n", ".................. .............................,~''::::::::',::::::: :::::::::::::|',\n", ".................. .............................|::::::,-~'''___''''~~--~''':}\n", ".................. .............................'|:::::|: : : : : : : : : : : : : : :|\n", ".................. .............................|:::::|: : :-~~---: : : -----: |\n", ".................. ............................(_''~-': : : :o: : :|: :o: : : :|\n", ".................. .............................'''~-,|: : : : : : ~---': : : :,'--NEVA GAHN\n", ".................. .................................|,: : : : : :-~~--: : ::/ ----- GIVE YOU UHP\n", ".................. ............................,-''\':\: :'~,,_: : : : : _,-'\n", ".................. ......................__,-';;;;;\:''-,: : : :'~---~''/|\n", ".................. .............__,-~'';;;;;;/;;;;;;;\: :\: : :____/: :',__\n", ".................. .,-~~~''''_;;;;;;;;;;;;;;;;;;;;;;;;;',. .''-,:|:::::::|. . |;;;;''-,__\n", "................../;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;\. . .''|::::::::|. .,';;;;;;;;;;''-,\n", "................,' ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;\. . .\:::::,'. ./|;;;;;;;;;;;;;|\n", ".............,-'';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;;;;',: : :|__|. . .|;;;;;;;;;,';;|\n", "...........,-';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',;;;;;;;;;;; \. . |:::|. . .'',;;;;;;;;|;;/\n", "........../;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;;;;\;;;;;;;; ;;;\. .|:::|. . . |;;;;;;;;|/\n", "......../;;,-';;;;;;;;;;;;;;;;;;;;;;,';;;;;;;;;;;;;;;;;,;;;;;;; ;;;|. .\:/. . . .|;;;;;;;;|\n", "......./;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;'',: |;|. . . . \;;;;;;;|\n", "....,~'';;;;;;;;;; ;;;;;;;;;;;,-'';;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;|.|;|. . . . .|;;;;;;;|\n", ",~'';;;;;;;;;;;;;; ;;;;;;;;,-';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',;;;;;;| |:|. . . . |\;;;;;;;|"], ["................... ............................... .......,-~~'''''''~~--,,_\n", "................... ..................................,-~''-,:::::::::::::::::::''-,\n", "................... .............................,~''::::::::',::::::: :::::::::::::|',\n", "................... .............................|::::::,-~'''___''''~~--~''':}\n", "................... .............................'|:::::|: : : : : : : : : : : : : : :|\n", "................... .............................|:::::|: : :-~~---: : : -----: |\n", "................... ............................(_''~-': : : :o: : :|: :o: : : :|\n", "................... .............................'''~-,|: : : : : : ~---': : : :,'--NEVA GAHN\n", "................... .................................|,: : : : : :-~~--: : ::/ ----- LET U DWN\n", "................... ............................,-''\':\: :'~,,_: : : : : _,-'\n", "................... ......................__,-';;;;;\:''-,: : : :'~---~''/|\n", "................... .............__,-~'';;;;;;/;;;;;;;\: :\: : :____/: :',__\n", "................... .,-~~~''''_;;;;;;;;;;;;;;;;;;;;;;;;;',. .''-,:|:::::::|. . |;;;;''-,__\n", ".................../;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;\. . .''|::::::::|. .,';;;;;;;;;;''-,\n", ".................,' ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;\. . .\:::::,'. ./|;;;;;;;;;;;;;|\n", "..............,-'';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;;;;',: : :|__|. . .|;;;;;;;;;,';;|\n", "............,-';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',;;;;;;;;;;; \. . |:::|. . .'',;;;;;;;;|;;/\n", ".........../;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;;;;\;;;;;;;; ;;;\. .|:::|. . . |;;;;;;;;|/\n", "........./;;,-';;;;;;;;;;;;;;;;;;;;;;,';;;;;;;;;;;;;;;;;,;;;;;;; ;;;|. .\:/. . . .|;;;;;;;;|\n", "......../;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;;;;;;;;;;;;;;; ;;;;;;;'',: |;|. . . . \;;;;;;;|\n", ".....,~'';;;;;;;;;; ;;;;;;;;;;;,-'';;;;;;;;;;;;;;;;;;;;;;;;;;\;;;;;;;;|.|;|. . . . .|;;;;;;;|\n", ".,~'';;;;;;;;;;;;;; ;;;;;;;;,-';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',;;;;;;| |:|. . . . |\;;;;;;;|"], ["............... ............................... .......,-~~'''''''~~--,,_\n", "............... ..................................,-~''-,:::::::::::::::::::''-,\n", "............... .............................,~''::::::::',::::::: :::::::::::::|',\n", "............... .............................|::::::,-~'''___''''~~--~''':}\n", "............... .............................'|:::::|: : : : : : : : : : : : : : :|\n", "............... .............................|:::::|: : :-~~---: : : -----: |\n", "............... ............................(_''~-': : : :o: : :|: :o: : : :|\n", "............... .............................'''~-,|: : : : : : ~---': : : :,'--NEVA GAHN TURN AHROUND\n", "............... .................................|,: : : : : :-~~--: : ::/ ----- AND DESERT U\n", "............... ............................,-''\':\: :'~,,_: : : : : _,-'\n", "............... ......................__,-';;;;;\:''-,: : : :'~---~''/|\n", "............... .............__,-~'';;;;;;/;;;;;;;\: :\: : :____/: :',__\n", "............... .,-~~~''''_;;;;;;;;;;;;;;;;;;;;;;;;;',. .''-,:|:::::::|. . |;;;;''-,__\n", ".............../;;;;;;;;;;;;;;;;;;;;;;;;;;;;,;;;;;;;;;\. . .''|::::::::|. .,';;;;;;;;;;''-,\n", ".............,' ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;|;;;;;;;;;;;\. . .\:::::,'. ./|;;;;;;;;;;;;;|\n"]];

var RickRolled = function () {
  function RickRolled(delay, shouldHide, element) {
    _classCallCheck(this, RickRolled);

    if (element) this.el = element;else {
      this.el = document.currentScript.parentNode;
    }

    this.index = 0;
    this.delay = delay || 3000;
    this.interval = false;
    this.shouldHide = shouldHide || false;
  }

  _createClass(RickRolled, [{
    key: "swap",
    value: function swap() {
      this.index = (this.index + 1) % mdRolled.length;

      this.el.innerHTML = '';
      this.el.innerHTML = mdRolled[this.index];

      if (this.printToConsole) console.log(mdRolled[this.index]);
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      if (this.interval) return;

      if (this.shouldHide) this.el.style.display = 'none';

      this.interval = setInterval(function () {
        _this.swap();
      }, this.delay);
    }
  }, {
    key: "stop",
    value: function stop() {
      if (!this.interval) return;
      clearInterval(this.interval);
      this.interval = false;
    }
  }, {
    key: "pause",
    value: function pause() {
      this.stop();
    }
  }]);

  return RickRolled;
}();

exports.default = RickRolled;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Creator Pierre Reimertz MIT ETC ETC

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    moveEvent = isMobile ? 'touchmove' : 'mousemove';

var Translater = function () {
  function Translater(element, xRotation, yRotation) {
    _classCallCheck(this, Translater);

    this.xRotation = xRotation;
    this.yRotation = yRotation;
    this.el = element;
    this.frame = false;
    this.throttler = false;
  }

  _createClass(Translater, [{
    key: 'handleMove',
    value: function handleMove(clientX, clientY) {
      var x = (1 - clientY / window.innerHeight) * -1 * this.xRotation,
          y = clientX / window.innerWidth * this.yRotation;

      this.el.style.transform = 'rotateX(' + x + 'deg) rotateY(' + y + 'deg)';
    }
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      this.listener = document.body.addEventListener(moveEvent, function (event) {
        if (_this.throttler) return;

        _this.throttler = setTimeout(function () {

          _this.throttler = false;
          requestAnimationFrame(function () {
            if (event.targetTouches) _this.handleMove(event.targetTouches[0].clientX, event.targetTouches[0].clientY);else _this.handleMove(event.clientX, event.clientY);
          });
        }, 50);
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      document.body.removeEventListener(moveEvent, this.listener);
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.stop();
    }
  }]);

  return Translater;
}();

exports.default = Translater;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Creator Pierre Reimertz MIT ETC ETC

var timeoutMap = new Map();
timeoutMap.set('#', 50 / 2); //delete
timeoutMap.set('@', 250 / 2); //pause
timeoutMap.set(',', 350 / 2);
timeoutMap.set('-', 350 / 2);
timeoutMap.set('.', 500 / 2);
timeoutMap.set('?', 750 / 2);

var Writer = function () {
  function Writer(elements, string) {
    _classCallCheck(this, Writer);

    this.el = elements;
    this.s = string;
    this.isWritingLink = false;
  }

  _createClass(Writer, [{
    key: 'updateWriters',
    value: function updateWriters(character) {
      var _this = this;

      [].forEach.call(this.el, function (element) {
        var oldElement = element;
        element = _this.isWritingLink ? element.querySelector('a:last-child') : element;

        if (character === '@') return;else if (character === '#') {
          element.innerHTML = element.innerHTML.slice(0, -1);
          if (oldElement.getAttribute('three-d-text').length > 0) {
            oldElement.setAttribute('three-d-text', oldElement.getAttribute('three-d-text').slice(0, -1));
          }
        } else if (character === '*') {
          element.innerHTML += '<br>';
          oldElement.setAttribute('three-d-text', oldElement.getAttribute('three-d-text') + '\a');
        } else if (character === '$') {
          if (!_this.isWritingLink) {
            var link = document.createElement("a");

            link.href = _this.s.split('$')[0];
            link.target = '_blank';

            element.appendChild(link);

            _this.isWritingLink = true;
            _this.s = _this.s.substring(_this.s.split('$')[0].length + 1, _this.s.length);
          } else {
            _this.isWritingLink = false;
          }
        } else {
          element.innerHTML += character;
          oldElement.setAttribute('three-d-text', oldElement.getAttribute('three-d-text') + character);
        }
      });
    }
  }, {
    key: 'writer',
    value: function writer(beQuick) {
      var _this2 = this;

      var text = undefined,
          msDelay = undefined;

      if (this.s.length === 0) return this.isDone();

      text = this.s.substring(0, 1);
      this.s = this.s.substring(1, this.s.length);
      this.updateWriters(text);

      if (beQuick) return this.writer(true);

      msDelay = timeoutMap.get(text) || Math.random() * 150;

      return setTimeout(function () {
        _this2.writer();
      }, msDelay);
    }
  }, {
    key: 'updateLastRead',
    value: function updateLastRead() {
      localStorage.setItem('read-everything-at', Date.now());
    }
  }, {
    key: 'isDone',
    value: function isDone() {
      document.body.classList.add('intro-is-done');
      this.updateLastRead();
    }
  }, {
    key: 'start',
    value: function start() {
      if (this.getLastRead + 5000 < Date.now()) {
        this.updateLastRead();
        this.writer(true);
        this.isDone();
      } else {
        this.writer();
      }
    }
  }, {
    key: 'getLastRead',
    get: function get() {
      return parseInt(localStorage.getItem('read-everything-at'));
    }
  }]);

  return Writer;
}();

exports.default = Writer;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWNoby1qcy9zcmMvZWNoby5qcyIsInNyYy9zY3JpcHRzL21haW4taG9tZS5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvQ3Vyc29yRnJpZW5kLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9MYXp5TG9hZGVyLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9SaWNrUm9sbGVkLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9UcmFuc2xhdGVyLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9Xcml0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LGFBQUssY0FBTCxHQUQwQztBQUUxQyxhQUFLLE1BQUwsQ0FBWSxJQUFaLEVBRjBDO0FBRzFDLGFBQUssTUFBTCxHQUgwQztPQUE1QyxNQUtLO0FBQ0gsYUFBSyxNQUFMLEdBREc7T0FMTDs7Ozt3QkFWZ0I7QUFDaEIsYUFBTyxTQUFTLGFBQWEsT0FBYixDQUFxQixvQkFBckIsQ0FBVCxDQUFQLENBRGdCOzs7O1NBeEVDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZhY3Rvcnkocm9vdCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuICB9IGVsc2Uge1xuICAgIHJvb3QuZWNobyA9IGZhY3Rvcnkocm9vdCk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChyb290KSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBlY2hvID0ge307XG5cbiAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG5cbiAgdmFyIG9mZnNldCwgcG9sbCwgZGVsYXksIHVzZURlYm91bmNlLCB1bmxvYWQ7XG5cbiAgdmFyIGlzSGlkZGVuID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gKGVsZW1lbnQub2Zmc2V0UGFyZW50ID09PSBudWxsKTtcbiAgfTtcbiAgXG4gIHZhciBpblZpZXcgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmlldykge1xuICAgIGlmIChpc0hpZGRlbihlbGVtZW50KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBib3ggPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiAoYm94LnJpZ2h0ID49IHZpZXcubCAmJiBib3guYm90dG9tID49IHZpZXcudCAmJiBib3gubGVmdCA8PSB2aWV3LnIgJiYgYm94LnRvcCA8PSB2aWV3LmIpO1xuICB9O1xuXG4gIHZhciBkZWJvdW5jZU9yVGhyb3R0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIXVzZURlYm91bmNlICYmICEhcG9sbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjbGVhclRpbWVvdXQocG9sbCk7XG4gICAgcG9sbCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIGVjaG8ucmVuZGVyKCk7XG4gICAgICBwb2xsID0gbnVsbDtcbiAgICB9LCBkZWxheSk7XG4gIH07XG5cbiAgZWNoby5pbml0ID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB2YXIgb2Zmc2V0QWxsID0gb3B0cy5vZmZzZXQgfHwgMDtcbiAgICB2YXIgb2Zmc2V0VmVydGljYWwgPSBvcHRzLm9mZnNldFZlcnRpY2FsIHx8IG9mZnNldEFsbDtcbiAgICB2YXIgb2Zmc2V0SG9yaXpvbnRhbCA9IG9wdHMub2Zmc2V0SG9yaXpvbnRhbCB8fCBvZmZzZXRBbGw7XG4gICAgdmFyIG9wdGlvblRvSW50ID0gZnVuY3Rpb24gKG9wdCwgZmFsbGJhY2spIHtcbiAgICAgIHJldHVybiBwYXJzZUludChvcHQgfHwgZmFsbGJhY2ssIDEwKTtcbiAgICB9O1xuICAgIG9mZnNldCA9IHtcbiAgICAgIHQ6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0VG9wLCBvZmZzZXRWZXJ0aWNhbCksXG4gICAgICBiOiBvcHRpb25Ub0ludChvcHRzLm9mZnNldEJvdHRvbSwgb2Zmc2V0VmVydGljYWwpLFxuICAgICAgbDogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRMZWZ0LCBvZmZzZXRIb3Jpem9udGFsKSxcbiAgICAgIHI6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0UmlnaHQsIG9mZnNldEhvcml6b250YWwpXG4gICAgfTtcbiAgICBkZWxheSA9IG9wdGlvblRvSW50KG9wdHMudGhyb3R0bGUsIDI1MCk7XG4gICAgdXNlRGVib3VuY2UgPSBvcHRzLmRlYm91bmNlICE9PSBmYWxzZTtcbiAgICB1bmxvYWQgPSAhIW9wdHMudW5sb2FkO1xuICAgIGNhbGxiYWNrID0gb3B0cy5jYWxsYmFjayB8fCBjYWxsYmFjaztcbiAgICBlY2hvLnJlbmRlcigpO1xuICAgIGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICByb290LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSwgZmFsc2UpO1xuICAgICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZGVib3VuY2VPclRocm90dGxlLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QuYXR0YWNoRXZlbnQoJ29uc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICAgIHJvb3QuYXR0YWNoRXZlbnQoJ29ubG9hZCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgfVxuICB9O1xuXG4gIGVjaG8ucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBub2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZ1tkYXRhLWVjaG9dLCBbZGF0YS1lY2hvLWJhY2tncm91bmRdJyk7XG4gICAgdmFyIGxlbmd0aCA9IG5vZGVzLmxlbmd0aDtcbiAgICB2YXIgc3JjLCBlbGVtO1xuICAgIHZhciB2aWV3ID0ge1xuICAgICAgbDogMCAtIG9mZnNldC5sLFxuICAgICAgdDogMCAtIG9mZnNldC50LFxuICAgICAgYjogKHJvb3QuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkgKyBvZmZzZXQuYixcbiAgICAgIHI6IChyb290LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSArIG9mZnNldC5yXG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBlbGVtID0gbm9kZXNbaV07XG4gICAgICBpZiAoaW5WaWV3KGVsZW0sIHZpZXcpKSB7XG5cbiAgICAgICAgaWYgKHVubG9hZCkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tcGxhY2Vob2xkZXInLCBlbGVtLnNyYyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJykgIT09IG51bGwpIHtcbiAgICAgICAgICBlbGVtLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJykgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlbGVtLnNyYyA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdW5sb2FkKSB7XG4gICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZWNobycpO1xuICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWVjaG8tYmFja2dyb3VuZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2soZWxlbSwgJ2xvYWQnKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHVubG9hZCAmJiAhIShzcmMgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLXBsYWNlaG9sZGVyJykpKSB7XG5cbiAgICAgICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tYmFja2dyb3VuZCcpICE9PSBudWxsKSB7XG4gICAgICAgICAgZWxlbS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybChcIiArIHNyYyArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVsZW0uc3JjID0gc3JjO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZWNoby1wbGFjZWhvbGRlcicpO1xuICAgICAgICBjYWxsYmFjayhlbGVtLCAndW5sb2FkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICBlY2hvLmRldGFjaCgpO1xuICAgIH1cbiAgfTtcblxuICBlY2hvLmRldGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgcm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBkZWJvdW5jZU9yVGhyb3R0bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290LmRldGFjaEV2ZW50KCdvbnNjcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgfVxuICAgIGNsZWFyVGltZW91dChwb2xsKTtcbiAgfTtcblxuICByZXR1cm4gZWNobztcblxufSk7XG4iLCJpbXBvcnQgV3JpdGVyIGZyb20gJy4vbW9kdWxlcy9Xcml0ZXInO1xuaW1wb3J0IFRyYW5zbGF0ZXIgZnJvbSAnLi9tb2R1bGVzL1RyYW5zbGF0ZXInO1xuaW1wb3J0IFJpY2tSb2xsZWQgZnJvbSAnLi9tb2R1bGVzL1JpY2tSb2xsZWQnO1xuaW1wb3J0IExhenlMb2FkZXIgZnJvbSAnLi9tb2R1bGVzL0xhenlMb2FkZXInO1xuaW1wb3J0IEN1cnNvckZyaWVuZCBmcm9tICcuL21vZHVsZXMvQ3Vyc29yRnJpZW5kJztcblxuY29uc3QgZWNobyA9IHJlcXVpcmUoJ2VjaG8tanMnKShkb2N1bWVudC5ib2R5KTtcbmNvbnN0IGludHJvVGV4dCA9IGBoaSwgbXkgbmFtZSBpcyBwacOpcnJlIHJlaW1lcnR6LlxuXG5pIGFtIGEgaHVtYmxlIGRldmVsb3BlckBAQCMjIyMjIyMjI21hZ2ljaWFuQEBAIyMjIyMjIyNjb2RlciwgZGVzaWduZXIsIGZha2UtaXQtdGlsLXlvdS1tYWtlLWl0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNlbnRyZXByZW5ldXIgYW5kIGV2ZXJ5ZGF5IGh1c3RsZXIuXG5leHRyZW1lbHkgYWRkaWN0ZWQgb2YgYnVpbGRpbmcgdGhpbmdzLlxuXG4kaHR0cDovL2dpdGh1Yi5jb20vcmVpbWVydHokZ2l0aHViJCB8ICRodHRwOi8vdHdpdHRlci5jb20vcmVpbWVydHokdHdpdHRlciQgfCAkbWFpbHRvOnBpZXJyZS5yZWltZXJ0ekBnbWFpbC5jb20kaGlyZSBtZSQgYDtcblxuXG5jb25zdCB3cml0ZXIgPSBuZXcgV3JpdGVyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53cml0ZXInKSwgaW50cm9UZXh0KTtcbmNvbnN0IHRyYW5zbGF0ZXIgPSBuZXcgVHJhbnNsYXRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHJlLWQnKSwgMTAsIDE1KTtcbmNvbnN0IHJyID0gbmV3IFJpY2tSb2xsZWQoNTAwMCwgdHJ1ZSwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYWxsLW15LXNlY3JldC1hcGkta2V5cycpKTtcbmNvbnN0IGxsID0gbmV3IExhenlMb2FkZXIoeyBsaW5lczogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZTogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrT25TdGFydDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFrZVNsb3duZXNzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheUJlZm9yZUZldGNoOiAoKSA9PiB7IHJldHVybiBNYXRoLnJhbmRvbSgpICogMzUwMCArIDEwMDB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudGFnZU9mSW1hZ2VzOiAwLjNcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5jb25zdCBjRiA9IG5ldyBDdXJzb3JGcmllbmQoe3NlbGVjdG9yOiAnLnByb2plY3QnLCBzcGFuU2VsZWN0b3I6ICdzcGFuJ30pO1xuXG5jb25zb2xlLmxvZyhjRik7XG5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtcbiAgd3JpdGVyLnN0YXJ0KCk7XG4gIHRyYW5zbGF0ZXIuc3RhcnQoKTtcbiAgcnIuc3RhcnQoKTtcbiAgbGwuc3RhcnQoKTtcbiAgY0Yuc3RhcnQoKTtcbn0pO1xuXG4iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5jb25zdCBpc01vYmlsZSA9IC9pUGhvbmV8aVBhZHxpUG9kfEFuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJzb3JGcmllbmQge1xuXG4gIGNvbnN0cnVjdG9yKHtzZWxlY3RvciA9ICdkYXRhLWN1cnNvci1mcmllbmQnLCBzcGFuU2VsZWN0b3IgPSAnc3Bhbid9KSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yXG4gICAgdGhpcy5zcGFuU2VsZWN0b3IgPSBzcGFuU2VsZWN0b3JcblxuICAgIHRoaXMuX2VsZW1lbnRzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAkeyB0aGlzLnNlbGVjdG9yIH1gKSlcblxuICAgIHRoaXMub25FbnRlciA9IHRoaXMub25FbnRlci5iaW5kKHRoaXMpXG4gICAgdGhpcy5vbk1vdmUgPSB0aGlzLm9uTW92ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5vbkxlYXZlID0gdGhpcy5vbkxlYXZlLmJpbmQodGhpcylcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmKGlzTW9iaWxlKSByZXR1cm5cbiAgICB0aGlzLl9lbGVtZW50cy5tYXAoZWxlbWVudCA9PiB7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLm9uRW50ZXIpXG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLm9uTGVhdmUpXG4gICAgfSlcbiAgfVxuXG4gIG9uRW50ZXIoZXZlbnQpIHtcbiAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9qZWN0LWlzLWhvdmVyZWQnLCAndHJ1ZScpO1xuICAgIC8vZXZlbnQuY3VycmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW92ZSlcbiAgfVxuXG4gIG9uTW92ZShldmVudCkge1xuICAgIGxldCBzcGFuID0gZXZlbnQuY3VycmVudFRhcmdldC5xdWVyeVNlbGVjdG9yKHRoaXMuc3BhblNlbGVjdG9yKVxuXG4gICAgbGV0IHggPSBldmVudC5zY3JlZW5YXG4gICAgbGV0IHkgPSBldmVudC5zY3JlZW5ZXG5cbiAgICBzcGFuLnN0eWxlLnRvcCA9ICh5LzEwIC0gNTApICsgJ3B4J1xuICAgIHNwYW4uc3R5bGUubGVmdCA9ICh4LzEwIC0gNTApICsgJ3B4J1xuICB9XG5cbiAgb25MZWF2ZShldmVudCkge1xuICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdkYXRhLXByb2plY3QtaXMtaG92ZXJlZCcsICdmYWxzZScpO1xuICAgIC8vZXZlbnQuY3VycmVudFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW92ZSlcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5fZWxlbWVudHMubWFwKGVsZW1lbnQgPT4ge1xuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5vbkVudGVyKVxuICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgdGhpcy5vbkxlYXZlKVxuICAgIH0pXG4gIH1cblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLnN0b3AoKVxuICB9XG59IiwiLy9DcmVhdG9yIFBpZXJyZSBSZWltZXJ0eiBNSVQgRVRDIEVUQ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXp5TG9hZGVyIHtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgYXR0cmlidXRlID0gJ2RhdGEtbGF6eScsXG4gICAgb2Zmc2V0ID0gKGRvY3VtZW50LmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LzIpLFxuICAgIGxpbmVzID0gMyxcbiAgICB0aHJvdHRsZSA9IDM1MCxcbiAgICBhdXRvU3RhcnQgPSB0cnVlLFxuICAgIGNoZWNrT25TdGFydCA9IHRydWUsXG4gICAgZmFrZVNsb3duZXNzID0gZmFsc2UsXG4gICAgcGxhY2Vob2xkZXJJbWFnZXMgPSBbXG4gICAgLyogd2lkZSAgICovICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUF2WUFBQVFBQVFNQUFBQ3dOSTlkQUFBQUExQk1WRVViLzVEVUloOTlBQUFBZFVsRVFWUjQydTNCQVEwQUFBRENvUGRQN2V3QkZBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBTjRBUEFBR042RHB3QUFBQUFFbEZUa1N1UW1DQycsXG4gICAgLyogdGFsbCAgICovICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFKWUFBQUNXQVFNQUFBQUd6K09oQUFBQUExQk1WRVViLzVEVUloOTlBQUFBR2tsRVFWUjRBZTNCQVFFQUFBUURNUDFUaXdIZlZnQUF3SG9OQzdnQUFTaXN0MzBBQUFBQVNVVk9SSzVDWUlJPScsXG4gICAgLyogc3F1YXJlICovICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFTd0FBQUNXQVFNQUFBQmVsU2VSQUFBQUExQk1WRVViLzVEVUloOTlBQUFBSEVsRVFWUjRYdTNBQVFrQUFBRENNUHVuTnNkaFd3b0FBQUFBQUJ3VzJnQUJsTzJMMkFBQUFBQkpSVTVFcmtKZ2dnPT0nXG4gIF19KVxuICB7XG4gICAgdGhpcy5hdHRyaWJ1dGUgPSBhdHRyaWJ1dGVcbiAgICB0aGlzLmF1dG9TdGFydCA9IGF1dG9TdGFydFxuICAgIHRoaXMuY2hlY2tPblN0YXJ0ID0gY2hlY2tPblN0YXJ0XG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXRcbiAgICB0aGlzLmxpbmVzID0gbGluZXNcbiAgICB0aGlzLnRocm90dGxlID0gdGhyb3R0bGVcbiAgICB0aGlzLmZha2VTbG93bmVzcyA9IGZha2VTbG93bmVzc1xuICAgIHRoaXMucGxhY2Vob2xkZXJJbWFnZXMgPSBwbGFjZWhvbGRlckltYWdlc1xuXG4gICAgdGhpcy5fZWxlbWVudHMgICAgICAgICAgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFskeyB0aGlzLmF0dHJpYnV0ZSB9XWApKVxuICAgIHRoaXMuX3F1ZXVlICAgICAgICAgICAgID0gW11cbiAgICB0aGlzLl9saXN0ZW5lciAgICAgICAgICA9IGZhbHNlXG4gICAgdGhpcy5fdGhyb3R0bGVyICAgICAgICAgPSBmYWxzZVxuXG4gICAgdGhpcy5vbkxvYWQgPSB0aGlzLm9uTG9hZC5iaW5kKHRoaXMpXG5cbiAgICBpZiAodGhpcy5hdXRvU3RhcnQpIHtcbiAgICAgIHRoaXMuc3RhcnQoKVxuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICghIXRoaXMuX2xpc3RlbmVyKSByZXR1cm5cbiAgICBpZiAodGhpcy5jaGVja09uU3RhcnQpIHRoaXMuY2hlY2soKVxuXG4gICAgdGhpcy5fZWxlbWVudHMubWFwKGVsZW1lbnQgPT4ge1xuICAgICAgaWYgKCFlbGVtZW50LnNyYyB8fCBlbGVtZW50LnNyYyA9PT0gJycpIHtcbiAgICAgICAgZWxlbWVudC5zcmMgPSB0aGlzLnBsYWNlaG9sZGVySW1hZ2VzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoodGhpcy5wbGFjZWhvbGRlckltYWdlcy5sZW5ndGgtMSkgKyAwLjUpXVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLl9saXN0ZW5lciA9IGV2ZW50ID0+IHt0aGlzLmNoZWNrKCl9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLl9saXN0ZW5lciwgZmFsc2UpXG4gIH1cblxuICBzdG9wKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuX2xpc3RlbmVyKVxuICAgIHRoaXMuX2xpc3RlbmVyID0gZmFsc2VcbiAgICB0aGlzLl90aHJvdHRsZXIgPSBmYWxzZVxuICB9XG5cbiAgY2hlY2soKSB7XG4gICAgaWYgKHRoaXMuX3Rocm90dGxlcikgcmV0dXJuXG4gICAgaWYgKHRoaXMuX2VsZW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXMuc3RvcCgpXG5cbiAgICB0aGlzLl90aHJvdHRsZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fdGhyb3R0bGVyID0gZmFsc2VcblxuICAgICAgdGhpcy5fZWxlbWVudHMgPSB0aGlzLl9lbGVtZW50cy5tYXAoZWxlbWVudCA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50ID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlXG4gICAgICAgIGlmIChlbGVtZW50Lm5vZGVOYW1lICE9PSBcIklNR1wiKSByZXR1cm4gZmFsc2VcblxuICAgICAgICBpZiAoKGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gdGhpcy5vZmZzZXQpICA8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSB7XG4gICAgICAgICAgdGhpcy5xdWV1ZShlbGVtZW50KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5fZWxlbWVudHMgPSB0aGlzLl9lbGVtZW50cy5maWx0ZXIoZWxlbWVudCA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50KSByZXR1cm4gZWxlbWVudFxuICAgICAgfSlcblxuICAgIH0sIHRoaXMudGhyb3R0bGUpXG4gIH1cblxuICBxdWV1ZShlbGVtZW50KSB7XG4gICAgdGhpcy5fcXVldWUucHVzaChlbGVtZW50KVxuXG4gICAgaWYgKHRoaXMuX3F1ZXVlLmxlbmd0aCA8PSB0aGlzLmxpbmVzKSB7XG4gICAgICB0aGlzLmxvYWQoZWxlbWVudClcbiAgICB9XG4gIH1cblxuICBsb2FkKGVsZW1lbnQpIHtcbiAgICB0aGlzLnNldFN0YXR1cyhlbGVtZW50LCAnbG9hZGluZycpXG5cbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLm9uTG9hZCwgZmFsc2UpXG5cbiAgICBpZiAoISF0aGlzLmZha2VTbG93bmVzcyAmJiAoTWF0aC5yYW5kb20oKSA8PSAodGhpcy5mYWtlU2xvd25lc3MucGVyY2VudGFnZU9mSW1hZ2VzKSkpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBlbGVtZW50LnNyYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlKVxuICAgICAgfSwgdGhpcy5mYWtlU2xvd25lc3MuZGVsYXlCZWZvcmVGZXRjaCgpKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnQuc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGUpXG4gICAgfVxuICB9XG5cbiAgb25Mb2FkKGV2ZW50KSB7XG4gICAgbGV0IG5leHRFbGVtZW50XG4gICAgbGV0IGxvYWRlZEVsZW1lbnQgPSBldmVudC50YXJnZXRcblxuICAgIGxvYWRlZEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcsIHRoaXMub25Mb2FkLCBmYWxzZSlcbiAgICB0aGlzLnNldFN0YXR1cyhsb2FkZWRFbGVtZW50LCAnbG9hZGVkJylcblxuICAgIHRoaXMuX3F1ZXVlID0gdGhpcy5fcXVldWUuZmlsdGVyKHF1ZXVlZEVsZW1lbnQgPT4ge1xuICAgICAgaWYgKHF1ZXVlZEVsZW1lbnQgIT09IGxvYWRlZEVsZW1lbnQpIHJldHVybiBxdWV1ZWRFbGVtZW50XG4gICAgfSlcblxuICAgIG5leHRFbGVtZW50ID0gdGhpcy5fcXVldWUuc2hpZnQoKVxuXG4gICAgaWYgKCEhbmV4dEVsZW1lbnQpIHRoaXMubG9hZChuZXh0RWxlbWVudClcbiAgfVxuXG4gIHNldFN0YXR1cyhlbGVtZW50LCBzdGF0dXMpIHtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZSArICctc3RhdHVzJywgc3RhdHVzKVxuICB9XG59IiwiLy9DcmVhdG9yIFBpZXJyZSBSZWltZXJ0eiBNSVQgRVRDIEVUQ1xuXG5jb25zdCBtZFJvbGxlZCA9IFtcbiAgW1wiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLiwtfn4nJycnJycnfn4tLSwsX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC1+JyctLDo6Ojo6Ojo6Ojo6Ojo6Ojo6OjonJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLH4nJzo6Ojo6Ojo6Jyw6Ojo6Ojo6IDo6Ojo6Ojo6Ojo6Ojp8JyxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojo6LC1+JycnX19fJycnJ35+LS1+JycnOn1cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nfDo6Ojo6fDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6Onw6IDogOi1+fi0tLTogOiA6IC0tLS0tOiB8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4oXycnfi0nOiA6IDogOm86IDogOnw6IDpvOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nJyd+LSx8OiA6IDogOiA6IDogfi0tLSc6IDogOiA6LCctLU5FVkEgR0FITlxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58LDogOiA6IDogOiA6LX5+LS06IDogOjovIC0tLS0tIEdJVkUgWU9VIFVIUFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC0nJ1xcJzpcXDogOid+LCxfOiA6IDogOiA6IF8sLSdcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLl9fLC0nOzs7OztcXDonJy0sOiA6IDogOid+LS0tficnL3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLl9fLC1+Jyc7Ozs7OzsvOzs7Ozs7O1xcOiA6XFw6IDogOl9fX18vOiA6JyxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLC1+fn4nJycnXzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLC4gLicnLSw6fDo6Ojo6Ojp8LiAuIHw7Ozs7JyctLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7XFwuIC4gLicnfDo6Ojo6Ojo6fC4gLiwnOzs7Ozs7Ozs7OycnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLCcgOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7XFwuIC4gLlxcOjo6OjosJy4gLi98Ozs7Ozs7Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLC0nJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozs7OzsnLDogOiA6fF9ffC4gLiAufDs7Ozs7Ozs7OywnOzt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4sLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLDs7Ozs7Ozs7Ozs7IFxcLiAuIHw6Ojp8LiAuIC4nJyw7Ozs7Ozs7O3w7Oy9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7OyA7OztcXC4gLnw6Ojp8LiAuIC4gfDs7Ozs7Ozs7fC9cXG5cIixcbiAgXCIuLi4uLi4uLi87OywtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssJzs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7OzsgOzs7fC4gLlxcOi8uIC4gLiAufDs7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OycnLDogfDt8LiAuIC4gLiBcXDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLix+Jyc7Ozs7Ozs7Ozs7IDs7Ozs7Ozs7Ozs7LC0nJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7O3wufDt8LiAuIC4gLiAufDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLH4nJzs7Ozs7Ozs7Ozs7Ozs7IDs7Ozs7Ozs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLDs7Ozs7O3wgfDp8LiAuIC4gLiB8XFw7Ozs7Ozs7fFwiXSxcblxuICBbXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLiwtfn4nJycnJycnfn4tLSwsX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtficnLSw6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sficnOjo6Ojo6OjonLDo6Ojo6OjogOjo6Ojo6Ojo6Ojo6OnwnLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojo6LC1+JycnX19fJycnJ35+LS1+JycnOn1cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJ3w6Ojo6Onw6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6fDogOiA6LX5+LS0tOiA6IDogLS0tLS06IHxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4oXycnfi0nOiA6IDogOm86IDogOnw6IDpvOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJycnfi0sfDogOiA6IDogOiA6IH4tLS0nOiA6IDogOiwnLS1ORVZBIEdBSE5cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gTEVUIFUgRFdOXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC0nJ1xcJzpcXDogOid+LCxfOiA6IDogOiA6IF8sLSdcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi5fXywtJzs7Ozs7XFw6JyctLDogOiA6IDonfi0tLX4nJy98XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLC1+fn4nJycnXzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLC4gLicnLSw6fDo6Ojo6Ojp8LiAuIHw7Ozs7JyctLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7O1xcLiAuIC4nJ3w6Ojo6Ojo6OnwuIC4sJzs7Ozs7Ozs7OzsnJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLC0nJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozs7OzsnLDogOiA6fF9ffC4gLiAufDs7Ozs7Ozs7OywnOzt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Jyw7Ozs7Ozs7Ozs7OyBcXC4gLiB8Ojo6fC4gLiAuJycsOzs7Ozs7Ozt8OzsvXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7IDs7O1xcLiAufDo6OnwuIC4gLiB8Ozs7Ozs7Ozt8L1xcblwiLFxuICBcIi4uLi4uLi4uLi87OywtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssJzs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7OzsgOzs7fC4gLlxcOi8uIC4gLiAufDs7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IDs7Ozs7OzsnJyw6IHw7fC4gLiAuIC4gXFw7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLH4nJzs7Ozs7Ozs7OzsgOzs7Ozs7Ozs7OzssLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7fC58O3wuIC4gLiAuIC58Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLH4nJzs7Ozs7Ozs7Ozs7Ozs7IDs7Ozs7Ozs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLDs7Ozs7O3wgfDp8LiAuIC4gLiB8XFw7Ozs7Ozs7fFwiXSxcblxuICBbXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLX4nJy0sOjo6Ojo6Ojo6Ojo6Ojo6Ojo6OicnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sficnOjo6Ojo6OjonLDo6Ojo6OjogOjo6Ojo6Ojo6Ojo6OnwnLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLid8Ojo6Ojp8OiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6fDogOiA6LX5+LS0tOiA6IDogLS0tLS06IHxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLicnJ34tLHw6IDogOiA6IDogOiB+LS0tJzogOiA6IDosJy0tTkVWQSBHQUhOIFRVUk4gQUhST1VORFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58LDogOiA6IDogOiA6LX5+LS06IDogOjovIC0tLS0tIEFORCBERVNFUlQgVVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC0nJ1xcJzpcXDogOid+LCxfOiA6IDogOiA6IF8sLSdcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLl9fLC0nOzs7OztcXDonJy0sOiA6IDogOid+LS0tficnL3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLl9fLC1+Jyc7Ozs7OzsvOzs7Ozs7O1xcOiA6XFw6IDogOl9fX18vOiA6JyxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLC1+fn4nJycnXzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLC4gLicnLSw6fDo6Ojo6Ojp8LiAuIHw7Ozs7JyctLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7XFwuIC4gLicnfDo6Ojo6Ojo6fC4gLiwnOzs7Ozs7Ozs7OycnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLCcgOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7XFwuIC4gLlxcOjo6OjosJy4gLi98Ozs7Ozs7Ozs7Ozs7O3xcXG5cIl1cbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJpY2tSb2xsZWQge1xuXG4gIGNvbnN0cnVjdG9yIChkZWxheSwgc2hvdWxkSGlkZSwgZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50KSB0aGlzLmVsID0gZWxlbWVudDtcbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnBhcmVudE5vZGU7XG4gICAgfVxuXG4gICAgdGhpcy5pbmRleCA9IDA7XG4gICAgdGhpcy5kZWxheSA9IGRlbGF5IHx8IDMwMDA7XG4gICAgdGhpcy5pbnRlcnZhbCA9IGZhbHNlO1xuICAgIHRoaXMuc2hvdWxkSGlkZSA9IHNob3VsZEhpZGUgfHwgZmFsc2U7XG4gIH1cblxuICBzd2FwKCkge1xuICAgIHRoaXMuaW5kZXggPSAodGhpcy5pbmRleCArIDEpICUgbWRSb2xsZWQubGVuZ3RoO1xuXG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnJztcbiAgICB0aGlzLmVsLmlubmVySFRNTCA9IG1kUm9sbGVkW3RoaXMuaW5kZXhdO1xuXG4gICAgaWYodGhpcy5wcmludFRvQ29uc29sZSkgY29uc29sZS5sb2cobWRSb2xsZWRbdGhpcy5pbmRleF0pO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYodGhpcy5pbnRlcnZhbCkgcmV0dXJuO1xuXG4gICAgaWYodGhpcy5zaG91bGRIaWRlKSB0aGlzLmVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge3RoaXMuc3dhcCgpfSwgdGhpcy5kZWxheSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGlmKCF0aGlzLmludGVydmFsKSByZXR1cm47XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB0aGlzLmludGVydmFsID0gZmFsc2U7XG4gIH1cblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfVxufVxuIiwiLy9DcmVhdG9yIFBpZXJyZSBSZWltZXJ0eiBNSVQgRVRDIEVUQ1xuXG5jb25zdCBpc01vYmlsZSA9IC9pUGhvbmV8aVBhZHxpUG9kfEFuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLFxuICAgICAgbW92ZUV2ZW50ID0gaXNNb2JpbGUgPyAndG91Y2htb3ZlJyA6ICdtb3VzZW1vdmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFuc2xhdGVyIHtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50LCB4Um90YXRpb24sIHlSb3RhdGlvbikge1xuICAgIHRoaXMueFJvdGF0aW9uID0geFJvdGF0aW9uO1xuICAgIHRoaXMueVJvdGF0aW9uID0geVJvdGF0aW9uO1xuICAgIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgIHRoaXMuZnJhbWUgPSBmYWxzZTtcbiAgICB0aGlzLnRocm90dGxlciA9IGZhbHNlO1xuICB9XG5cbiAgaGFuZGxlTW92ZShjbGllbnRYLCBjbGllbnRZKXtcbiAgICBsZXQgeCA9ICgoMSAtIChjbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0KSkgKiAtMSkgKiB0aGlzLnhSb3RhdGlvbixcbiAgICAgICAgeSA9IChjbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGgpICogdGhpcy55Um90YXRpb247XG5cbiAgICB0aGlzLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGVYKCR7eH1kZWcpIHJvdGF0ZVkoJHt5fWRlZylgO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5saXN0ZW5lciA9IGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihtb3ZlRXZlbnQsIChldmVudCkgPT4ge1xuICAgICAgaWYodGhpcy50aHJvdHRsZXIpIHJldHVybjtcblxuICAgICAgdGhpcy50aHJvdHRsZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcblxuICAgICAgICB0aGlzLnRocm90dGxlciA9IGZhbHNlO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGlmKGV2ZW50LnRhcmdldFRvdWNoZXMpIHRoaXMuaGFuZGxlTW92ZShldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFgsIGV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WSk7XG4gICAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVNb3ZlKGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIDUwKTtcblxuICAgIH0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIobW92ZUV2ZW50LCB0aGlzLmxpc3RlbmVyKTtcbiAgfTtcblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfTtcbn0iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cbmNvbnN0IHRpbWVvdXRNYXAgPSBuZXcgTWFwKCk7XG4gICAgICB0aW1lb3V0TWFwLnNldCgnIycsIDUwLzIpOyAvL2RlbGV0ZVxuICAgICAgdGltZW91dE1hcC5zZXQoJ0AnLCAyNTAvMik7IC8vcGF1c2VcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCcsJywgMzUwLzIpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJy0nLCAzNTAvMik7XG4gICAgICB0aW1lb3V0TWFwLnNldCgnLicsIDUwMC8yKTtcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCc/JywgNzUwLzIpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXcml0ZXIge1xuICBjb25zdHJ1Y3RvcihlbGVtZW50cywgc3RyaW5nKSB7XG4gICAgdGhpcy5lbCA9IGVsZW1lbnRzO1xuICAgIHRoaXMucyA9IHN0cmluZztcbiAgICB0aGlzLmlzV3JpdGluZ0xpbmsgPSBmYWxzZTtcbiAgfVxuXG4gIHVwZGF0ZVdyaXRlcnMoY2hhcmFjdGVyKSB7XG5cbiAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmVsLCAoZWxlbWVudCkgPT4ge1xuICAgICAgbGV0IG9sZEVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgZWxlbWVudCA9ICh0aGlzLmlzV3JpdGluZ0xpbmspID8gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhOmxhc3QtY2hpbGQnKSA6IGVsZW1lbnQ7XG5cbiAgICAgIGlmIChjaGFyYWN0ZXIgPT09ICdAJykgcmV0dXJuO1xuXG4gICAgICBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICcjJykge1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGVsZW1lbnQuaW5uZXJIVE1MLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgaWYob2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpLmxlbmd0aCA+IDApe1xuICAgICAgICAgIG9sZEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnLCBvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jykuc2xpY2UoMCwtMSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVsc2UgaWYgKGNoYXJhY3RlciA9PT0gJyonKSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MICs9ICc8YnI+JztcbiAgICAgICAgb2xkRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcsIG9sZEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnKSArICdcXGEnKTtcbiAgICAgIH1cblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnJCcpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzV3JpdGluZ0xpbmspIHtcbiAgICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXG4gICAgICAgICAgbGluay5ocmVmID0gdGhpcy5zLnNwbGl0KCckJylbMF07XG4gICAgICAgICAgbGluay50YXJnZXQgPSAnX2JsYW5rJztcblxuXG4gICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChsaW5rKTtcblxuICAgICAgICAgIHRoaXMuaXNXcml0aW5nTGluayA9IHRydWU7XG4gICAgICAgICAgdGhpcy5zID0gdGhpcy5zLnN1YnN0cmluZyh0aGlzLnMuc3BsaXQoJyQnKVswXS5sZW5ndGgrMSwgdGhpcy5zLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5pc1dyaXRpbmdMaW5rID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTCArPSBjaGFyYWN0ZXI7XG4gICAgICAgIG9sZEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnLCBvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0JykgKyBjaGFyYWN0ZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgd3JpdGVyKGJlUXVpY2spIHtcbiAgICBsZXQgdGV4dCwgbXNEZWxheTtcblxuICAgIGlmICh0aGlzLnMubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5pc0RvbmUoKTtcblxuICAgIHRleHQgPSB0aGlzLnMuc3Vic3RyaW5nKDAsMSk7XG4gICAgdGhpcy5zID0gIHRoaXMucy5zdWJzdHJpbmcoMSx0aGlzLnMubGVuZ3RoKTtcbiAgICB0aGlzLnVwZGF0ZVdyaXRlcnModGV4dCk7XG5cbiAgICBpZiAoYmVRdWljaykgICAgICAgICAgcmV0dXJuIHRoaXMud3JpdGVyKHRydWUpO1xuXG4gICAgbXNEZWxheSA9IHRpbWVvdXRNYXAuZ2V0KHRleHQpIHx8IE1hdGgucmFuZG9tKCkgKiAxNTA7XG5cbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7dGhpcy53cml0ZXIoKX0sIG1zRGVsYXkpO1xuXG4gIH07XG5cbiAgdXBkYXRlTGFzdFJlYWQoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlYWQtZXZlcnl0aGluZy1hdCcsIERhdGUubm93KCkpO1xuICB9XG5cbiAgZ2V0IGdldExhc3RSZWFkKCkge1xuICAgIHJldHVybiBwYXJzZUludChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVhZC1ldmVyeXRoaW5nLWF0JykpO1xuICB9XG5cbiAgaXNEb25lKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnaW50cm8taXMtZG9uZScpO1xuICAgIHRoaXMudXBkYXRlTGFzdFJlYWQoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICgodGhpcy5nZXRMYXN0UmVhZCArIDUwMDApIDwgRGF0ZS5ub3coKSkge1xuICAgICAgdGhpcy51cGRhdGVMYXN0UmVhZCgpO1xuICAgICAgdGhpcy53cml0ZXIodHJ1ZSk7XG4gICAgICB0aGlzLmlzRG9uZSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMud3JpdGVyKCk7XG4gICAgfVxuICB9XG59Il19
