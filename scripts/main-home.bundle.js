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
      event.currentTarget.addEventListener('mousemove', this.onMove);
    }
  }, {
    key: 'onMove',
    value: function onMove(event) {
      var span = event.currentTarget.querySelector(this.spanSelector);

      var x = event.screenX;
      var y = event.screenY;

      span.style.top = y / 10 + 50 + 'px';
      span.style.left = x / 10 - 50 + 'px';
    }
  }, {
    key: 'onLeave',
    value: function onLeave(event) {
      event.currentTarget.removeEventListener('mousemove', this.onMove);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWNoby1qcy9zcmMvZWNoby5qcyIsInNyYy9zY3JpcHRzL21haW4taG9tZS5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvQ3Vyc29yRnJpZW5kLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9MYXp5TG9hZGVyLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9SaWNrUm9sbGVkLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9UcmFuc2xhdGVyLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9Xcml0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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SyxHQUFMLEVBQTVCLEVBQXdDO0FBQzFDLGFBQUssY0FBTCxHQUQwQztBQUUxQyxhQUFLLE1BQUwsQ0FBWSxJQUFaLEVBRjBDO0FBRzFDLGFBQUssTUFBTCxHQUgwQztPQUE1QyxNQUtLO0FBQ0gsYUFBSyxNQUFMLEdBREc7T0FMTDs7Ozt3QkFWZ0I7QUFDaEIsYUFBTyxTQUFTLGFBQWEsT0FBYixDQUFxQixvQkFBckIsQ0FBVCxDQUFQLENBRGdCOzs7O1NBeEVDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZhY3Rvcnkocm9vdCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuICB9IGVsc2Uge1xuICAgIHJvb3QuZWNobyA9IGZhY3Rvcnkocm9vdCk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChyb290KSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBlY2hvID0ge307XG5cbiAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG5cbiAgdmFyIG9mZnNldCwgcG9sbCwgZGVsYXksIHVzZURlYm91bmNlLCB1bmxvYWQ7XG5cbiAgdmFyIGlzSGlkZGVuID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gKGVsZW1lbnQub2Zmc2V0UGFyZW50ID09PSBudWxsKTtcbiAgfTtcbiAgXG4gIHZhciBpblZpZXcgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmlldykge1xuICAgIGlmIChpc0hpZGRlbihlbGVtZW50KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBib3ggPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiAoYm94LnJpZ2h0ID49IHZpZXcubCAmJiBib3guYm90dG9tID49IHZpZXcudCAmJiBib3gubGVmdCA8PSB2aWV3LnIgJiYgYm94LnRvcCA8PSB2aWV3LmIpO1xuICB9O1xuXG4gIHZhciBkZWJvdW5jZU9yVGhyb3R0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIXVzZURlYm91bmNlICYmICEhcG9sbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjbGVhclRpbWVvdXQocG9sbCk7XG4gICAgcG9sbCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIGVjaG8ucmVuZGVyKCk7XG4gICAgICBwb2xsID0gbnVsbDtcbiAgICB9LCBkZWxheSk7XG4gIH07XG5cbiAgZWNoby5pbml0ID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB2YXIgb2Zmc2V0QWxsID0gb3B0cy5vZmZzZXQgfHwgMDtcbiAgICB2YXIgb2Zmc2V0VmVydGljYWwgPSBvcHRzLm9mZnNldFZlcnRpY2FsIHx8IG9mZnNldEFsbDtcbiAgICB2YXIgb2Zmc2V0SG9yaXpvbnRhbCA9IG9wdHMub2Zmc2V0SG9yaXpvbnRhbCB8fCBvZmZzZXRBbGw7XG4gICAgdmFyIG9wdGlvblRvSW50ID0gZnVuY3Rpb24gKG9wdCwgZmFsbGJhY2spIHtcbiAgICAgIHJldHVybiBwYXJzZUludChvcHQgfHwgZmFsbGJhY2ssIDEwKTtcbiAgICB9O1xuICAgIG9mZnNldCA9IHtcbiAgICAgIHQ6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0VG9wLCBvZmZzZXRWZXJ0aWNhbCksXG4gICAgICBiOiBvcHRpb25Ub0ludChvcHRzLm9mZnNldEJvdHRvbSwgb2Zmc2V0VmVydGljYWwpLFxuICAgICAgbDogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRMZWZ0LCBvZmZzZXRIb3Jpem9udGFsKSxcbiAgICAgIHI6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0UmlnaHQsIG9mZnNldEhvcml6b250YWwpXG4gICAgfTtcbiAgICBkZWxheSA9IG9wdGlvblRvSW50KG9wdHMudGhyb3R0bGUsIDI1MCk7XG4gICAgdXNlRGVib3VuY2UgPSBvcHRzLmRlYm91bmNlICE9PSBmYWxzZTtcbiAgICB1bmxvYWQgPSAhIW9wdHMudW5sb2FkO1xuICAgIGNhbGxiYWNrID0gb3B0cy5jYWxsYmFjayB8fCBjYWxsYmFjaztcbiAgICBlY2hvLnJlbmRlcigpO1xuICAgIGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICByb290LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSwgZmFsc2UpO1xuICAgICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZGVib3VuY2VPclRocm90dGxlLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QuYXR0YWNoRXZlbnQoJ29uc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICAgIHJvb3QuYXR0YWNoRXZlbnQoJ29ubG9hZCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgfVxuICB9O1xuXG4gIGVjaG8ucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBub2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZ1tkYXRhLWVjaG9dLCBbZGF0YS1lY2hvLWJhY2tncm91bmRdJyk7XG4gICAgdmFyIGxlbmd0aCA9IG5vZGVzLmxlbmd0aDtcbiAgICB2YXIgc3JjLCBlbGVtO1xuICAgIHZhciB2aWV3ID0ge1xuICAgICAgbDogMCAtIG9mZnNldC5sLFxuICAgICAgdDogMCAtIG9mZnNldC50LFxuICAgICAgYjogKHJvb3QuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkgKyBvZmZzZXQuYixcbiAgICAgIHI6IChyb290LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSArIG9mZnNldC5yXG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBlbGVtID0gbm9kZXNbaV07XG4gICAgICBpZiAoaW5WaWV3KGVsZW0sIHZpZXcpKSB7XG5cbiAgICAgICAgaWYgKHVubG9hZCkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tcGxhY2Vob2xkZXInLCBlbGVtLnNyYyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJykgIT09IG51bGwpIHtcbiAgICAgICAgICBlbGVtLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJykgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlbGVtLnNyYyA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdW5sb2FkKSB7XG4gICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZWNobycpO1xuICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWVjaG8tYmFja2dyb3VuZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2soZWxlbSwgJ2xvYWQnKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHVubG9hZCAmJiAhIShzcmMgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLXBsYWNlaG9sZGVyJykpKSB7XG5cbiAgICAgICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tYmFja2dyb3VuZCcpICE9PSBudWxsKSB7XG4gICAgICAgICAgZWxlbS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybChcIiArIHNyYyArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVsZW0uc3JjID0gc3JjO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZWNoby1wbGFjZWhvbGRlcicpO1xuICAgICAgICBjYWxsYmFjayhlbGVtLCAndW5sb2FkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICBlY2hvLmRldGFjaCgpO1xuICAgIH1cbiAgfTtcblxuICBlY2hvLmRldGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgcm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBkZWJvdW5jZU9yVGhyb3R0bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290LmRldGFjaEV2ZW50KCdvbnNjcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgfVxuICAgIGNsZWFyVGltZW91dChwb2xsKTtcbiAgfTtcblxuICByZXR1cm4gZWNobztcblxufSk7XG4iLCJpbXBvcnQgV3JpdGVyIGZyb20gJy4vbW9kdWxlcy9Xcml0ZXInO1xuaW1wb3J0IFRyYW5zbGF0ZXIgZnJvbSAnLi9tb2R1bGVzL1RyYW5zbGF0ZXInO1xuaW1wb3J0IFJpY2tSb2xsZWQgZnJvbSAnLi9tb2R1bGVzL1JpY2tSb2xsZWQnO1xuaW1wb3J0IExhenlMb2FkZXIgZnJvbSAnLi9tb2R1bGVzL0xhenlMb2FkZXInO1xuaW1wb3J0IEN1cnNvckZyaWVuZCBmcm9tICcuL21vZHVsZXMvQ3Vyc29yRnJpZW5kJztcblxuY29uc3QgZWNobyA9IHJlcXVpcmUoJ2VjaG8tanMnKShkb2N1bWVudC5ib2R5KTtcbmNvbnN0IGludHJvVGV4dCA9IGBoaSwgbXkgbmFtZSBpcyBwacOpcnJlIHJlaW1lcnR6LlxuXG5pIGFtIGEgaHVtYmxlIGRldmVsb3BlckBAQCMjIyMjIyMjI21hZ2ljaWFuQEBAIyMjIyMjIyNjb2RlciwgZGVzaWduZXIsIGZha2UtaXQtdGlsLXlvdS1tYWtlLWl0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNlbnRyZXByZW5ldXIgYW5kIGV2ZXJ5ZGF5IGh1c3RsZXIuXG5leHRyZW1lbHkgYWRkaWN0ZWQgb2YgYnVpbGRpbmcgdGhpbmdzLlxuXG4kaHR0cDovL2dpdGh1Yi5jb20vcmVpbWVydHokZ2l0aHViJCB8ICRodHRwOi8vdHdpdHRlci5jb20vcmVpbWVydHokdHdpdHRlciQgfCAkbWFpbHRvOnBpZXJyZS5yZWltZXJ0ekBnbWFpbC5jb20kaGlyZSBtZSQgYDtcblxuXG5jb25zdCB3cml0ZXIgPSBuZXcgV3JpdGVyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53cml0ZXInKSwgaW50cm9UZXh0KTtcbmNvbnN0IHRyYW5zbGF0ZXIgPSBuZXcgVHJhbnNsYXRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHJlLWQnKSwgMTAsIDE1KTtcbmNvbnN0IHJyID0gbmV3IFJpY2tSb2xsZWQoNTAwMCwgdHJ1ZSwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYWxsLW15LXNlY3JldC1hcGkta2V5cycpKTtcbmNvbnN0IGxsID0gbmV3IExhenlMb2FkZXIoeyBsaW5lczogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZTogNTAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrT25TdGFydDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFrZVNsb3duZXNzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheUJlZm9yZUZldGNoOiAoKSA9PiB7IHJldHVybiBNYXRoLnJhbmRvbSgpICogMzUwMCArIDEwMDB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudGFnZU9mSW1hZ2VzOiAwLjNcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5jb25zdCBjRiA9IG5ldyBDdXJzb3JGcmllbmQoe3NlbGVjdG9yOiAnLnByb2plY3QnLCBzcGFuU2VsZWN0b3I6ICdzcGFuJ30pO1xuXG5jb25zb2xlLmxvZyhjRik7XG5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtcbiAgd3JpdGVyLnN0YXJ0KCk7XG4gIHRyYW5zbGF0ZXIuc3RhcnQoKTtcbiAgcnIuc3RhcnQoKTtcbiAgbGwuc3RhcnQoKTtcbiAgY0Yuc3RhcnQoKTtcbn0pO1xuXG4iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5jb25zdCBpc01vYmlsZSA9IC9pUGhvbmV8aVBhZHxpUG9kfEFuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXJzb3JGcmllbmQge1xuXG4gIGNvbnN0cnVjdG9yKHtzZWxlY3RvciA9ICdkYXRhLWN1cnNvci1mcmllbmQnLCBzcGFuU2VsZWN0b3IgPSAnc3Bhbid9KSB7XG4gICAgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yXG4gICAgdGhpcy5zcGFuU2VsZWN0b3IgPSBzcGFuU2VsZWN0b3JcblxuICAgIHRoaXMuX2VsZW1lbnRzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAkeyB0aGlzLnNlbGVjdG9yIH1gKSlcblxuICAgIHRoaXMub25FbnRlciA9IHRoaXMub25FbnRlci5iaW5kKHRoaXMpXG4gICAgdGhpcy5vbk1vdmUgPSB0aGlzLm9uTW92ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5vbkxlYXZlID0gdGhpcy5vbkxlYXZlLmJpbmQodGhpcylcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmKGlzTW9iaWxlKSByZXR1cm5cbiAgICB0aGlzLl9lbGVtZW50cy5tYXAoZWxlbWVudCA9PiB7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLm9uRW50ZXIpXG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLm9uTGVhdmUpXG4gICAgfSlcbiAgfVxuXG4gIG9uRW50ZXIoZXZlbnQpIHtcbiAgICBldmVudC5jdXJyZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3ZlKVxuICB9XG5cbiAgb25Nb3ZlKGV2ZW50KSB7XG4gICAgbGV0IHNwYW4gPSBldmVudC5jdXJyZW50VGFyZ2V0LnF1ZXJ5U2VsZWN0b3IodGhpcy5zcGFuU2VsZWN0b3IpXG5cbiAgICBsZXQgeCA9IGV2ZW50LnNjcmVlblhcbiAgICBsZXQgeSA9IGV2ZW50LnNjcmVlbllcblxuICAgIHNwYW4uc3R5bGUudG9wICA9ICh5LzEwICsgNTApICsgJ3B4J1xuICAgIHNwYW4uc3R5bGUubGVmdCA9ICh4LzEwIC0gNTApICsgJ3B4J1xuICB9XG5cbiAgb25MZWF2ZShldmVudCkge1xuICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdmUpXG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuX2VsZW1lbnRzLm1hcChlbGVtZW50ID0+IHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMub25FbnRlcilcbiAgICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHRoaXMub25MZWF2ZSlcbiAgICB9KVxuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKClcbiAgfVxufSIsIi8vQ3JlYXRvciBQaWVycmUgUmVpbWVydHogTUlUIEVUQyBFVENcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF6eUxvYWRlciB7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIGF0dHJpYnV0ZSA9ICdkYXRhLWxhenknLFxuICAgIG9mZnNldCA9IChkb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodC8yKSxcbiAgICBsaW5lcyA9IDMsXG4gICAgdGhyb3R0bGUgPSAzNTAsXG4gICAgYXV0b1N0YXJ0ID0gdHJ1ZSxcbiAgICBjaGVja09uU3RhcnQgPSB0cnVlLFxuICAgIGZha2VTbG93bmVzcyA9IGZhbHNlLFxuICAgIHBsYWNlaG9sZGVySW1hZ2VzID0gW1xuICAgIC8qIHdpZGUgICAqLyAgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBdllBQUFRQUFRTUFBQUN3Tkk5ZEFBQUFBMUJNVkVVYi81RFVJaDk5QUFBQWRVbEVRVlI0MnUzQkFRMEFBQURDb1BkUDdld0JGQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU40QVBBQUdONkRwd0FBQUFBRWxGVGtTdVFtQ0MnLFxuICAgIC8qIHRhbGwgICAqLyAgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSllBQUFDV0FRTUFBQUFHeitPaEFBQUFBMUJNVkVVYi81RFVJaDk5QUFBQUdrbEVRVlI0QWUzQkFRRUFBQVFETVAxVGl3SGZWZ0FBd0hvTkM3Z0FBU2lzdDMwQUFBQUFTVVZPUks1Q1lJST0nLFxuICAgIC8qIHNxdWFyZSAqLyAgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBU3dBQUFDV0FRTUFBQUJlbFNlUkFBQUFBMUJNVkVVYi81RFVJaDk5QUFBQUhFbEVRVlI0WHUzQUFRa0FBQURDTVB1bk5zZGhXd29BQUFBQUFCd1cyZ0FCbE8yTDJBQUFBQUJKUlU1RXJrSmdnZz09J1xuICBdfSlcbiAge1xuICAgIHRoaXMuYXR0cmlidXRlID0gYXR0cmlidXRlXG4gICAgdGhpcy5hdXRvU3RhcnQgPSBhdXRvU3RhcnRcbiAgICB0aGlzLmNoZWNrT25TdGFydCA9IGNoZWNrT25TdGFydFxuICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0XG4gICAgdGhpcy5saW5lcyA9IGxpbmVzXG4gICAgdGhpcy50aHJvdHRsZSA9IHRocm90dGxlXG4gICAgdGhpcy5mYWtlU2xvd25lc3MgPSBmYWtlU2xvd25lc3NcbiAgICB0aGlzLnBsYWNlaG9sZGVySW1hZ2VzID0gcGxhY2Vob2xkZXJJbWFnZXNcblxuICAgIHRoaXMuX2VsZW1lbnRzICAgICAgICAgID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbJHsgdGhpcy5hdHRyaWJ1dGUgfV1gKSlcbiAgICB0aGlzLl9xdWV1ZSAgICAgICAgICAgICA9IFtdXG4gICAgdGhpcy5fbGlzdGVuZXIgICAgICAgICAgPSBmYWxzZVxuICAgIHRoaXMuX3Rocm90dGxlciAgICAgICAgID0gZmFsc2VcblxuICAgIHRoaXMub25Mb2FkID0gdGhpcy5vbkxvYWQuYmluZCh0aGlzKVxuXG4gICAgaWYgKHRoaXMuYXV0b1N0YXJ0KSB7XG4gICAgICB0aGlzLnN0YXJ0KClcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoISF0aGlzLl9saXN0ZW5lcikgcmV0dXJuXG4gICAgaWYgKHRoaXMuY2hlY2tPblN0YXJ0KSB0aGlzLmNoZWNrKClcblxuICAgIHRoaXMuX2VsZW1lbnRzLm1hcChlbGVtZW50ID0+IHtcbiAgICAgIGlmICghZWxlbWVudC5zcmMgfHwgZWxlbWVudC5zcmMgPT09ICcnKSB7XG4gICAgICAgIGVsZW1lbnQuc3JjID0gdGhpcy5wbGFjZWhvbGRlckltYWdlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKHRoaXMucGxhY2Vob2xkZXJJbWFnZXMubGVuZ3RoLTEpICsgMC41KV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5fbGlzdGVuZXIgPSBldmVudCA9PiB7dGhpcy5jaGVjaygpfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5fbGlzdGVuZXIsIGZhbHNlKVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLl9saXN0ZW5lcilcbiAgICB0aGlzLl9saXN0ZW5lciA9IGZhbHNlXG4gICAgdGhpcy5fdGhyb3R0bGVyID0gZmFsc2VcbiAgfVxuXG4gIGNoZWNrKCkge1xuICAgIGlmICh0aGlzLl90aHJvdHRsZXIpIHJldHVyblxuICAgIGlmICh0aGlzLl9lbGVtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB0aGlzLnN0b3AoKVxuXG4gICAgdGhpcy5fdGhyb3R0bGVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3Rocm90dGxlciA9IGZhbHNlXG5cbiAgICAgIHRoaXMuX2VsZW1lbnRzID0gdGhpcy5fZWxlbWVudHMubWFwKGVsZW1lbnQgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudCA9PT0gZmFsc2UpIHJldHVybiBmYWxzZVxuICAgICAgICBpZiAoZWxlbWVudC5ub2RlTmFtZSAhPT0gXCJJTUdcIikgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgaWYgKChlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIHRoaXMub2Zmc2V0KSAgPCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkge1xuICAgICAgICAgIHRoaXMucXVldWUoZWxlbWVudClcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuX2VsZW1lbnRzID0gdGhpcy5fZWxlbWVudHMuZmlsdGVyKGVsZW1lbnQgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudCkgcmV0dXJuIGVsZW1lbnRcbiAgICAgIH0pXG5cbiAgICB9LCB0aGlzLnRocm90dGxlKVxuICB9XG5cbiAgcXVldWUoZWxlbWVudCkge1xuICAgIHRoaXMuX3F1ZXVlLnB1c2goZWxlbWVudClcblxuICAgIGlmICh0aGlzLl9xdWV1ZS5sZW5ndGggPD0gdGhpcy5saW5lcykge1xuICAgICAgdGhpcy5sb2FkKGVsZW1lbnQpXG4gICAgfVxuICB9XG5cbiAgbG9hZChlbGVtZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0dXMoZWxlbWVudCwgJ2xvYWRpbmcnKVxuXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgdGhpcy5vbkxvYWQsIGZhbHNlKVxuXG4gICAgaWYgKCEhdGhpcy5mYWtlU2xvd25lc3MgJiYgKE1hdGgucmFuZG9tKCkgPD0gKHRoaXMuZmFrZVNsb3duZXNzLnBlcmNlbnRhZ2VPZkltYWdlcykpKSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZWxlbWVudC5zcmMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZSlcbiAgICAgIH0sIHRoaXMuZmFrZVNsb3duZXNzLmRlbGF5QmVmb3JlRmV0Y2goKSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50LnNyYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlKVxuICAgIH1cbiAgfVxuXG4gIG9uTG9hZChldmVudCkge1xuICAgIGxldCBuZXh0RWxlbWVudFxuICAgIGxldCBsb2FkZWRFbGVtZW50ID0gZXZlbnQudGFyZ2V0XG5cbiAgICBsb2FkZWRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLm9uTG9hZCwgZmFsc2UpXG4gICAgdGhpcy5zZXRTdGF0dXMobG9hZGVkRWxlbWVudCwgJ2xvYWRlZCcpXG5cbiAgICB0aGlzLl9xdWV1ZSA9IHRoaXMuX3F1ZXVlLmZpbHRlcihxdWV1ZWRFbGVtZW50ID0+IHtcbiAgICAgIGlmIChxdWV1ZWRFbGVtZW50ICE9PSBsb2FkZWRFbGVtZW50KSByZXR1cm4gcXVldWVkRWxlbWVudFxuICAgIH0pXG5cbiAgICBuZXh0RWxlbWVudCA9IHRoaXMuX3F1ZXVlLnNoaWZ0KClcblxuICAgIGlmICghIW5leHRFbGVtZW50KSB0aGlzLmxvYWQobmV4dEVsZW1lbnQpXG4gIH1cblxuICBzZXRTdGF0dXMoZWxlbWVudCwgc3RhdHVzKSB7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGUgKyAnLXN0YXR1cycsIHN0YXR1cylcbiAgfVxufSIsIi8vQ3JlYXRvciBQaWVycmUgUmVpbWVydHogTUlUIEVUQyBFVENcblxuY29uc3QgbWRSb2xsZWQgPSBbXG4gIFtcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4sLX5+JycnJycnJ35+LS0sLF9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtficnLSw6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6OiwtficnJ19fXycnJyd+fi0tficnJzp9XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJ3w6Ojo6Onw6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKF8nJ34tJzogOiA6IDpvOiA6IDp8OiA6bzogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJycnfi0sfDogOiA6IDogOiA6IH4tLS0nOiA6IDogOiwnLS1ORVZBIEdBSE5cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufCw6IDogOiA6IDogOi1+fi0tOiA6IDo6LyAtLS0tLSBHSVZFIFlPVSBVSFBcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtJydcXCc6XFw6IDonfiwsXzogOiA6IDogOiBfLC0nXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi5fXywtJzs7Ozs7XFw6JyctLDogOiA6IDonfi0tLX4nJy98XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi5fXywtficnOzs7Ozs7Lzs7Ozs7OztcXDogOlxcOiA6IDpfX19fLzogOicsX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLiwtfn5+JycnJ187Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7JywuIC4nJy0sOnw6Ojo6Ojo6fC4gLiB8Ozs7OycnLSxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7O1xcLiAuIC4nJ3w6Ojo6Ojo6OnwuIC4sJzs7Ozs7Ozs7OzsnJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLiwnIDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7O1xcLiAuIC5cXDo6Ojo6LCcuIC4vfDs7Ozs7Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLiwtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7Ozs7Jyw6IDogOnxfX3wuIC4gLnw7Ozs7Ozs7OzssJzs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Jyw7Ozs7Ozs7Ozs7OyBcXC4gLiB8Ojo6fC4gLiAuJycsOzs7Ozs7Ozt8OzsvXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7OzsgOzs7XFwuIC58Ojo6fC4gLiAuIHw7Ozs7Ozs7O3wvXFxuXCIsXG4gIFwiLi4uLi4uLi4vOzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LCc7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7IDs7O3wuIC5cXDovLiAuIC4gLnw7Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IDs7Ozs7OzsnJyw6IHw7fC4gLiAuIC4gXFw7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4sficnOzs7Ozs7Ozs7OyA7Ozs7Ozs7Ozs7OywtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozt8Lnw7fC4gLiAuIC4gLnw7Ozs7Ozs7fFxcblwiLFxuICBcIix+Jyc7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7OywtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Jyw7Ozs7Ozt8IHw6fC4gLiAuIC4gfFxcOzs7Ozs7O3xcIl0sXG5cbiAgW1wiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4sLX5+JycnJycnJ35+LS0sLF9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLX4nJy0sOjo6Ojo6Ojo6Ojo6Ojo6Ojo6OicnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLH4nJzo6Ojo6Ojo6Jyw6Ojo6Ojo6IDo6Ojo6Ojo6Ojo6Ojp8JyxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6OiwtficnJ19fXycnJyd+fi0tficnJzp9XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLid8Ojo6Ojp8OiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6Onw6IDogOi1+fi0tLTogOiA6IC0tLS0tOiB8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKF8nJ34tJzogOiA6IDpvOiA6IDp8OiA6bzogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLicnJ34tLHw6IDogOiA6IDogOiB+LS0tJzogOiA6IDosJy0tTkVWQSBHQUhOXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58LDogOiA6IDogOiA6LX5+LS06IDogOjovIC0tLS0tIExFVCBVIERXTlxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtJydcXCc6XFw6IDonfiwsXzogOiA6IDogOiBfLC0nXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLl9fLC1+Jyc7Ozs7OzsvOzs7Ozs7O1xcOiA6XFw6IDogOl9fX18vOiA6JyxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLiwtfn5+JycnJ187Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7JywuIC4nJy0sOnw6Ojo6Ojo6fC4gLiB8Ozs7OycnLSxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLCcgOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7XFwuIC4gLlxcOjo6OjosJy4gLi98Ozs7Ozs7Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLiwtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7Ozs7Jyw6IDogOnxfX3wuIC4gLnw7Ozs7Ozs7OzssJzs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLiwtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7Ozs7OzsgXFwuIC4gfDo6OnwuIC4gLicnLDs7Ozs7Ozs7fDs7L1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7OyA7OztcXC4gLnw6Ojp8LiAuIC4gfDs7Ozs7Ozs7fC9cXG5cIixcbiAgXCIuLi4uLi4uLi4vOzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LCc7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7IDs7O3wuIC5cXDovLiAuIC4gLnw7Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7JycsOiB8O3wuIC4gLiAuIFxcOzs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLix+Jyc7Ozs7Ozs7Ozs7IDs7Ozs7Ozs7Ozs7LC0nJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7O3wufDt8LiAuIC4gLiAufDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLix+Jyc7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7OywtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Jyw7Ozs7Ozt8IHw6fC4gLiAuIC4gfFxcOzs7Ozs7O3xcIl0sXG5cbiAgW1wiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLiwtfn4nJycnJycnfn4tLSwsX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC1+JyctLDo6Ojo6Ojo6Ojo6Ojo6Ojo6OjonJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLH4nJzo6Ojo6Ojo6Jyw6Ojo6Ojo6IDo6Ojo6Ojo6Ojo6Ojp8JyxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojo6LC1+JycnX19fJycnJ35+LS1+JycnOn1cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nfDo6Ojo6fDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6Onw6IDogOi1+fi0tLTogOiA6IC0tLS0tOiB8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4oXycnfi0nOiA6IDogOm86IDogOnw6IDpvOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nJyd+LSx8OiA6IDogOiA6IDogfi0tLSc6IDogOiA6LCctLU5FVkEgR0FITiBUVVJOIEFIUk9VTkRcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufCw6IDogOiA6IDogOi1+fi0tOiA6IDo6LyAtLS0tLSBBTkQgREVTRVJUIFVcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtJydcXCc6XFw6IDonfiwsXzogOiA6IDogOiBfLC0nXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi5fXywtJzs7Ozs7XFw6JyctLDogOiA6IDonfi0tLX4nJy98XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi5fXywtficnOzs7Ozs7Lzs7Ozs7OztcXDogOlxcOiA6IDpfX19fLzogOicsX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLiwtfn5+JycnJ187Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7JywuIC4nJy0sOnw6Ojo6Ojo6fC4gLiB8Ozs7OycnLSxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7O1xcLiAuIC4nJ3w6Ojo6Ojo6OnwuIC4sJzs7Ozs7Ozs7OzsnJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLiwnIDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7O1xcLiAuIC5cXDo6Ojo6LCcuIC4vfDs7Ozs7Ozs7Ozs7Ozt8XFxuXCJdXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSaWNrUm9sbGVkIHtcblxuICBjb25zdHJ1Y3RvciAoZGVsYXksIHNob3VsZEhpZGUsIGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudCkgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIHRoaXMuaW5kZXggPSAwO1xuICAgIHRoaXMuZGVsYXkgPSBkZWxheSB8fCAzMDAwO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBmYWxzZTtcbiAgICB0aGlzLnNob3VsZEhpZGUgPSBzaG91bGRIaWRlIHx8IGZhbHNlO1xuICB9XG5cbiAgc3dhcCgpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyAxKSAlIG1kUm9sbGVkLmxlbmd0aDtcblxuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSBtZFJvbGxlZFt0aGlzLmluZGV4XTtcblxuICAgIGlmKHRoaXMucHJpbnRUb0NvbnNvbGUpIGNvbnNvbGUubG9nKG1kUm9sbGVkW3RoaXMuaW5kZXhdKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmKHRoaXMuaW50ZXJ2YWwpIHJldHVybjtcblxuICAgIGlmKHRoaXMuc2hvdWxkSGlkZSkgdGhpcy5lbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHt0aGlzLnN3YXAoKX0sIHRoaXMuZGVsYXkpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZighdGhpcy5pbnRlcnZhbCkgcmV0dXJuO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgdGhpcy5pbnRlcnZhbCA9IGZhbHNlO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cbn1cbiIsIi8vQ3JlYXRvciBQaWVycmUgUmVpbWVydHogTUlUIEVUQyBFVENcblxuY29uc3QgaXNNb2JpbGUgPSAvaVBob25lfGlQYWR8aVBvZHxBbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgIG1vdmVFdmVudCA9IGlzTW9iaWxlID8gJ3RvdWNobW92ZScgOiAnbW91c2Vtb3ZlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhbnNsYXRlciB7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgeFJvdGF0aW9uLCB5Um90YXRpb24pIHtcbiAgICB0aGlzLnhSb3RhdGlvbiA9IHhSb3RhdGlvbjtcbiAgICB0aGlzLnlSb3RhdGlvbiA9IHlSb3RhdGlvbjtcbiAgICB0aGlzLmVsID0gZWxlbWVudDtcbiAgICB0aGlzLmZyYW1lID0gZmFsc2U7XG4gICAgdGhpcy50aHJvdHRsZXIgPSBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZU1vdmUoY2xpZW50WCwgY2xpZW50WSl7XG4gICAgbGV0IHggPSAoKDEgLSAoY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkpICogLTEpICogdGhpcy54Um90YXRpb24sXG4gICAgICAgIHkgPSAoY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIHRoaXMueVJvdGF0aW9uO1xuXG4gICAgdGhpcy5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlWCgke3h9ZGVnKSByb3RhdGVZKCR7eX1kZWcpYDtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMubGlzdGVuZXIgPSBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIobW92ZUV2ZW50LCAoZXZlbnQpID0+IHtcbiAgICAgIGlmKHRoaXMudGhyb3R0bGVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMudGhyb3R0bGVyID0gc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICAgICAgdGhpcy50aHJvdHRsZXIgPSBmYWxzZTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBpZihldmVudC50YXJnZXRUb3VjaGVzKSB0aGlzLmhhbmRsZU1vdmUoZXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYLCBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlTW92ZShldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCA1MCk7XG5cbiAgICB9KTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKG1vdmVFdmVudCwgdGhpcy5saXN0ZW5lcik7XG4gIH07XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH07XG59IiwiLy9DcmVhdG9yIFBpZXJyZSBSZWltZXJ0eiBNSVQgRVRDIEVUQ1xuXG5jb25zdCB0aW1lb3V0TWFwID0gbmV3IE1hcCgpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJyMnLCA1MC8yKTsgLy9kZWxldGVcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCdAJywgMjUwLzIpOyAvL3BhdXNlXG4gICAgICB0aW1lb3V0TWFwLnNldCgnLCcsIDM1MC8yKTtcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCctJywgMzUwLzIpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJy4nLCA1MDAvMik7XG4gICAgICB0aW1lb3V0TWFwLnNldCgnPycsIDc1MC8yKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JpdGVyIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudHMsIHN0cmluZykge1xuICAgIHRoaXMuZWwgPSBlbGVtZW50cztcbiAgICB0aGlzLnMgPSBzdHJpbmc7XG4gICAgdGhpcy5pc1dyaXRpbmdMaW5rID0gZmFsc2U7XG4gIH1cblxuICB1cGRhdGVXcml0ZXJzKGNoYXJhY3Rlcikge1xuXG4gICBbXS5mb3JFYWNoLmNhbGwodGhpcy5lbCwgKGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCBvbGRFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIGVsZW1lbnQgPSAodGhpcy5pc1dyaXRpbmdMaW5rKSA/IGVsZW1lbnQucXVlcnlTZWxlY3RvcignYTpsYXN0LWNoaWxkJykgOiBlbGVtZW50O1xuXG4gICAgICBpZiAoY2hhcmFjdGVyID09PSAnQCcpIHJldHVybjtcblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnIycpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTC5zbGljZSgwLCAtMSk7XG4gICAgICAgIGlmKG9sZEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpLnNsaWNlKDAsLTEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICcqJykge1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTCArPSAnPGJyPic7XG4gICAgICAgIG9sZEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnLCBvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0JykgKyAnXFxhJyk7XG4gICAgICB9XG5cbiAgICAgIGVsc2UgaWYgKGNoYXJhY3RlciA9PT0gJyQnKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1dyaXRpbmdMaW5rKSB7XG4gICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuICAgICAgICAgIGxpbmsuaHJlZiA9IHRoaXMucy5zcGxpdCgnJCcpWzBdO1xuICAgICAgICAgIGxpbmsudGFyZ2V0ID0gJ19ibGFuayc7XG5cblxuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQobGluayk7XG5cbiAgICAgICAgICB0aGlzLmlzV3JpdGluZ0xpbmsgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucyA9IHRoaXMucy5zdWJzdHJpbmcodGhpcy5zLnNwbGl0KCckJylbMF0ubGVuZ3RoKzEsIHRoaXMucy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuaXNXcml0aW5nTGluayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgKz0gY2hhcmFjdGVyO1xuICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpICsgY2hhcmFjdGVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHdyaXRlcihiZVF1aWNrKSB7XG4gICAgbGV0IHRleHQsIG1zRGVsYXk7XG5cbiAgICBpZiAodGhpcy5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXMuaXNEb25lKCk7XG5cbiAgICB0ZXh0ID0gdGhpcy5zLnN1YnN0cmluZygwLDEpO1xuICAgIHRoaXMucyA9ICB0aGlzLnMuc3Vic3RyaW5nKDEsdGhpcy5zLmxlbmd0aCk7XG4gICAgdGhpcy51cGRhdGVXcml0ZXJzKHRleHQpO1xuXG4gICAgaWYgKGJlUXVpY2spICAgICAgICAgIHJldHVybiB0aGlzLndyaXRlcih0cnVlKTtcblxuICAgIG1zRGVsYXkgPSB0aW1lb3V0TWFwLmdldCh0ZXh0KSB8fCBNYXRoLnJhbmRvbSgpICogMTUwO1xuXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge3RoaXMud3JpdGVyKCl9LCBtc0RlbGF5KTtcblxuICB9O1xuXG4gIHVwZGF0ZUxhc3RSZWFkKCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWFkLWV2ZXJ5dGhpbmctYXQnLCBEYXRlLm5vdygpKTtcbiAgfVxuXG4gIGdldCBnZXRMYXN0UmVhZCgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlYWQtZXZlcnl0aGluZy1hdCcpKTtcbiAgfVxuXG4gIGlzRG9uZSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ludHJvLWlzLWRvbmUnKTtcbiAgICB0aGlzLnVwZGF0ZUxhc3RSZWFkKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoKHRoaXMuZ2V0TGFzdFJlYWQgKyA1MDAwKSA8IERhdGUubm93KCkpIHtcbiAgICAgIHRoaXMudXBkYXRlTGFzdFJlYWQoKTtcbiAgICAgIHRoaXMud3JpdGVyKHRydWUpO1xuICAgICAgdGhpcy5pc0RvbmUoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLndyaXRlcigpO1xuICAgIH1cbiAgfVxufSJdfQ==
