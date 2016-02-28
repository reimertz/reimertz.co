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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var echo = require('echo-js')(document.body);
var introText = 'hi, my name is piérre reimertz.\n\ni am a humble developer@@@#########magician@@@########coder, designer, fake-it-til-you-make-it#######################entrepreneur and everyday hustler.\nextremely addicted of building things.\n\n$http://github.com/reimertz$github$ | $http://twitter.com/reimertz$twitter$ | $mailto:pierre.reimertz@gmail.com$hire me$ ';

var writer = new _Writer2.default(document.querySelectorAll('.writer'), introText);
var translater = new _Translater2.default(document.querySelector('main'), 10, 15);
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

requestAnimationFrame(function () {
  writer.start();
  translater.start();
  rr.start();
  ll.start();
});

},{"./modules/LazyLoader":3,"./modules/RickRolled":4,"./modules/Translater":5,"./modules/Writer":6,"echo-js":1}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWNoby1qcy9zcmMvZWNoby5qcyIsInNyYy9zY3JpcHRzL21haW4taG9tZS5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvTGF6eUxvYWRlci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvUmlja1JvbGxlZC5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvVHJhbnNsYXRlci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvV3JpdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LE1BQUwsR0FBRDtPQUFOLEVBQXVCLE9BQWxDLENBQVAsQ0FiYzs7OztxQ0FpQkM7QUFDZixtQkFBYSxPQUFiLENBQXFCLG9CQUFyQixFQUEyQyxLQUFLLEdBQUwsRUFBM0MsRUFEZTs7Ozs2QkFRUjtBQUNQLGVBQVMsSUFBVCxDQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsZUFBNUIsRUFETztBQUVQLFdBQUssY0FBTCxHQUZPOzs7OzRCQUtEO0FBQ04sVUFBSSxJQUFDLENBQUssV0FBTCxHQUFtQixJQUFuQixHQUEyQixLQUFLLEdBQUwsRUFBNUIsRUFBd0M7QUFDMUMsYUFBSyxjQUFMLEdBRDBDO0FBRTFDLGFBQUssTUFBTCxDQUFZLElBQVosRUFGMEM7QUFHMUMsYUFBSyxNQUFMLEdBSDBDO09BQTVDLE1BS0s7QUFDSCxhQUFLLE1BQUwsR0FERztPQUxMOzs7O3dCQVZnQjtBQUNoQixhQUFPLFNBQVMsYUFBYSxPQUFiLENBQXFCLG9CQUFyQixDQUFULENBQVAsQ0FEZ0I7Ozs7U0F4RUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeShyb290KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5lY2hvID0gZmFjdG9yeShyb290KTtcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKHJvb3QpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGVjaG8gPSB7fTtcblxuICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcblxuICB2YXIgb2Zmc2V0LCBwb2xsLCBkZWxheSwgdXNlRGVib3VuY2UsIHVubG9hZDtcblxuICB2YXIgaXNIaWRkZW4gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHJldHVybiAoZWxlbWVudC5vZmZzZXRQYXJlbnQgPT09IG51bGwpO1xuICB9O1xuICBcbiAgdmFyIGluVmlldyA9IGZ1bmN0aW9uIChlbGVtZW50LCB2aWV3KSB7XG4gICAgaWYgKGlzSGlkZGVuKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGJveCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIChib3gucmlnaHQgPj0gdmlldy5sICYmIGJveC5ib3R0b20gPj0gdmlldy50ICYmIGJveC5sZWZ0IDw9IHZpZXcuciAmJiBib3gudG9wIDw9IHZpZXcuYik7XG4gIH07XG5cbiAgdmFyIGRlYm91bmNlT3JUaHJvdHRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZighdXNlRGVib3VuY2UgJiYgISFwb2xsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsZWFyVGltZW91dChwb2xsKTtcbiAgICBwb2xsID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgZWNoby5yZW5kZXIoKTtcbiAgICAgIHBvbGwgPSBudWxsO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcblxuICBlY2hvLmluaXQgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgIHZhciBvZmZzZXRBbGwgPSBvcHRzLm9mZnNldCB8fCAwO1xuICAgIHZhciBvZmZzZXRWZXJ0aWNhbCA9IG9wdHMub2Zmc2V0VmVydGljYWwgfHwgb2Zmc2V0QWxsO1xuICAgIHZhciBvZmZzZXRIb3Jpem9udGFsID0gb3B0cy5vZmZzZXRIb3Jpem9udGFsIHx8IG9mZnNldEFsbDtcbiAgICB2YXIgb3B0aW9uVG9JbnQgPSBmdW5jdGlvbiAob3B0LCBmYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KG9wdCB8fCBmYWxsYmFjaywgMTApO1xuICAgIH07XG4gICAgb2Zmc2V0ID0ge1xuICAgICAgdDogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRUb3AsIG9mZnNldFZlcnRpY2FsKSxcbiAgICAgIGI6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0Qm90dG9tLCBvZmZzZXRWZXJ0aWNhbCksXG4gICAgICBsOiBvcHRpb25Ub0ludChvcHRzLm9mZnNldExlZnQsIG9mZnNldEhvcml6b250YWwpLFxuICAgICAgcjogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRSaWdodCwgb2Zmc2V0SG9yaXpvbnRhbClcbiAgICB9O1xuICAgIGRlbGF5ID0gb3B0aW9uVG9JbnQob3B0cy50aHJvdHRsZSwgMjUwKTtcbiAgICB1c2VEZWJvdW5jZSA9IG9wdHMuZGVib3VuY2UgIT09IGZhbHNlO1xuICAgIHVubG9hZCA9ICEhb3B0cy51bmxvYWQ7XG4gICAgY2FsbGJhY2sgPSBvcHRzLmNhbGxiYWNrIHx8IGNhbGxiYWNrO1xuICAgIGVjaG8ucmVuZGVyKCk7XG4gICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlLCBmYWxzZSk7XG4gICAgICByb290LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBkZWJvdW5jZU9yVGhyb3R0bGUsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdC5hdHRhY2hFdmVudCgnb25zY3JvbGwnLCBkZWJvdW5jZU9yVGhyb3R0bGUpO1xuICAgICAgcm9vdC5hdHRhY2hFdmVudCgnb25sb2FkJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICB9XG4gIH07XG5cbiAgZWNoby5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nW2RhdGEtZWNob10sIFtkYXRhLWVjaG8tYmFja2dyb3VuZF0nKTtcbiAgICB2YXIgbGVuZ3RoID0gbm9kZXMubGVuZ3RoO1xuICAgIHZhciBzcmMsIGVsZW07XG4gICAgdmFyIHZpZXcgPSB7XG4gICAgICBsOiAwIC0gb2Zmc2V0LmwsXG4gICAgICB0OiAwIC0gb2Zmc2V0LnQsXG4gICAgICBiOiAocm9vdC5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSArIG9mZnNldC5iLFxuICAgICAgcjogKHJvb3QuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpICsgb2Zmc2V0LnJcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGVsZW0gPSBub2Rlc1tpXTtcbiAgICAgIGlmIChpblZpZXcoZWxlbSwgdmlldykpIHtcblxuICAgICAgICBpZiAodW5sb2FkKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1wbGFjZWhvbGRlcicsIGVsZW0uc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKSAhPT0gbnVsbCkge1xuICAgICAgICAgIGVsZW0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVsZW0uc3JjID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNobycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1bmxvYWQpIHtcbiAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1lY2hvJyk7XG4gICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhlbGVtLCAnbG9hZCcpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodW5sb2FkICYmICEhKHNyYyA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tcGxhY2Vob2xkZXInKSkpIHtcblxuICAgICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJykgIT09IG51bGwpIHtcbiAgICAgICAgICBlbGVtLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgc3JjICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbS5zcmMgPSBzcmM7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1lY2hvLXBsYWNlaG9sZGVyJyk7XG4gICAgICAgIGNhbGxiYWNrKGVsZW0sICd1bmxvYWQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIGVjaG8uZGV0YWNoKCk7XG4gICAgfVxuICB9O1xuXG4gIGVjaG8uZGV0YWNoID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICByb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QuZGV0YWNoRXZlbnQoJ29uc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0KHBvbGwpO1xuICB9O1xuXG4gIHJldHVybiBlY2hvO1xuXG59KTtcbiIsImltcG9ydCBXcml0ZXIgZnJvbSAnLi9tb2R1bGVzL1dyaXRlcic7XG5pbXBvcnQgVHJhbnNsYXRlciBmcm9tICcuL21vZHVsZXMvVHJhbnNsYXRlcic7XG5pbXBvcnQgUmlja1JvbGxlZCBmcm9tICcuL21vZHVsZXMvUmlja1JvbGxlZCc7XG5pbXBvcnQgTGF6eUxvYWRlciBmcm9tICcuL21vZHVsZXMvTGF6eUxvYWRlcic7XG5cbmNvbnN0IGVjaG8gPSByZXF1aXJlKCdlY2hvLWpzJykoZG9jdW1lbnQuYm9keSk7XG5jb25zdCBpbnRyb1RleHQgPSBgaGksIG15IG5hbWUgaXMgcGnDqXJyZSByZWltZXJ0ei5cblxuaSBhbSBhIGh1bWJsZSBkZXZlbG9wZXJAQEAjIyMjIyMjIyNtYWdpY2lhbkBAQCMjIyMjIyMjY29kZXIsIGRlc2lnbmVyLCBmYWtlLWl0LXRpbC15b3UtbWFrZS1pdCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjZW50cmVwcmVuZXVyIGFuZCBldmVyeWRheSBodXN0bGVyLlxuZXh0cmVtZWx5IGFkZGljdGVkIG9mIGJ1aWxkaW5nIHRoaW5ncy5cblxuJGh0dHA6Ly9naXRodWIuY29tL3JlaW1lcnR6JGdpdGh1YiQgfCAkaHR0cDovL3R3aXR0ZXIuY29tL3JlaW1lcnR6JHR3aXR0ZXIkIHwgJG1haWx0bzpwaWVycmUucmVpbWVydHpAZ21haWwuY29tJGhpcmUgbWUkIGA7XG5cblxuY29uc3Qgd3JpdGVyID0gbmV3IFdyaXRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud3JpdGVyJyksIGludHJvVGV4dCk7XG5jb25zdCB0cmFuc2xhdGVyID0gbmV3IFRyYW5zbGF0ZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpLCAxMCwgMTUpO1xuY29uc3QgcnIgPSBuZXcgUmlja1JvbGxlZCg1MDAwLCB0cnVlLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhbGwtbXktc2VjcmV0LWFwaS1rZXlzJykpO1xuY29uc3QgbGwgPSBuZXcgTGF6eUxvYWRlcih7IGxpbmVzOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tPblN0YXJ0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWtlU2xvd25lc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5QmVmb3JlRmV0Y2g6ICgpID0+IHsgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAzNTAwICsgMTAwMH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50YWdlT2ZJbWFnZXM6IDAuM1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7XG4gIHdyaXRlci5zdGFydCgpO1xuICB0cmFuc2xhdGVyLnN0YXJ0KCk7XG4gIHJyLnN0YXJ0KCk7XG4gIGxsLnN0YXJ0KCk7XG59KTtcblxuXG4iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhenlMb2FkZXIge1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBhdHRyaWJ1dGUgPSAnZGF0YS1sYXp5JyxcbiAgICBvZmZzZXQgPSAoZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQvMiksXG4gICAgbGluZXMgPSAzLFxuICAgIHRocm90dGxlID0gMzUwLFxuICAgIGF1dG9TdGFydCA9IHRydWUsXG4gICAgY2hlY2tPblN0YXJ0ID0gdHJ1ZSxcbiAgICBmYWtlU2xvd25lc3MgPSBmYWxzZSxcbiAgICBwbGFjZWhvbGRlckltYWdlcyA9IFtcbiAgICAvKiB3aWRlICAgKi8gICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQXZZQUFBUUFBUU1BQUFDd05JOWRBQUFBQTFCTVZFVWIvNURVSWg5OUFBQUFkVWxFUVZSNDJ1M0JBUTBBQUFEQ29QZFA3ZXdCRkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFONEFQQUFHTjZEcHdBQUFBQUVsRlRrU3VRbUNDJyxcbiAgICAvKiB0YWxsICAgKi8gICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUpZQUFBQ1dBUU1BQUFBR3orT2hBQUFBQTFCTVZFVWIvNURVSWg5OUFBQUFHa2xFUVZSNEFlM0JBUUVBQUFRRE1QMVRpd0hmVmdBQXdIb05DN2dBQVNpc3QzMEFBQUFBU1VWT1JLNUNZSUk9JyxcbiAgICAvKiBzcXVhcmUgKi8gICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQVN3QUFBQ1dBUU1BQUFCZWxTZVJBQUFBQTFCTVZFVWIvNURVSWg5OUFBQUFIRWxFUVZSNFh1M0FBUWtBQUFEQ01QdW5Oc2RoV3dvQUFBQUFBQndXMmdBQmxPMkwyQUFBQUFCSlJVNUVya0pnZ2c9PSdcbiAgXX0pXG4gIHtcbiAgICB0aGlzLmF0dHJpYnV0ZSA9IGF0dHJpYnV0ZVxuICAgIHRoaXMuYXV0b1N0YXJ0ID0gYXV0b1N0YXJ0XG4gICAgdGhpcy5jaGVja09uU3RhcnQgPSBjaGVja09uU3RhcnRcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldFxuICAgIHRoaXMubGluZXMgPSBsaW5lc1xuICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZVxuICAgIHRoaXMuZmFrZVNsb3duZXNzID0gZmFrZVNsb3duZXNzXG4gICAgdGhpcy5wbGFjZWhvbGRlckltYWdlcyA9IHBsYWNlaG9sZGVySW1hZ2VzXG5cbiAgICB0aGlzLl9lbGVtZW50cyAgICAgICAgICA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgWyR7IHRoaXMuYXR0cmlidXRlIH1dYCkpXG4gICAgdGhpcy5fcXVldWUgICAgICAgICAgICAgPSBbXVxuICAgIHRoaXMuX2xpc3RlbmVyICAgICAgICAgID0gZmFsc2VcbiAgICB0aGlzLl90aHJvdHRsZXIgICAgICAgICA9IGZhbHNlXG5cbiAgICB0aGlzLm9uTG9hZCA9IHRoaXMub25Mb2FkLmJpbmQodGhpcylcblxuICAgIGlmICh0aGlzLmF1dG9TdGFydCkge1xuICAgICAgdGhpcy5zdGFydCgpXG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCEhdGhpcy5fbGlzdGVuZXIpIHJldHVyblxuICAgIGlmICh0aGlzLmNoZWNrT25TdGFydCkgdGhpcy5jaGVjaygpXG5cbiAgICB0aGlzLl9lbGVtZW50cy5tYXAoZWxlbWVudCA9PiB7XG4gICAgICBpZiAoIWVsZW1lbnQuc3JjIHx8IGVsZW1lbnQuc3JjID09PSAnJykge1xuICAgICAgICBlbGVtZW50LnNyYyA9IHRoaXMucGxhY2Vob2xkZXJJbWFnZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKih0aGlzLnBsYWNlaG9sZGVySW1hZ2VzLmxlbmd0aC0xKSArIDAuNSldXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuX2xpc3RlbmVyID0gZXZlbnQgPT4ge3RoaXMuY2hlY2soKX1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuX2xpc3RlbmVyLCBmYWxzZSlcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5fbGlzdGVuZXIpXG4gICAgdGhpcy5fbGlzdGVuZXIgPSBmYWxzZVxuICAgIHRoaXMuX3Rocm90dGxlciA9IGZhbHNlXG4gIH1cblxuICBjaGVjaygpIHtcbiAgICBpZiAodGhpcy5fdGhyb3R0bGVyKSByZXR1cm5cbiAgICBpZiAodGhpcy5fZWxlbWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5zdG9wKClcblxuICAgIHRoaXMuX3Rocm90dGxlciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLl90aHJvdHRsZXIgPSBmYWxzZVxuXG4gICAgICB0aGlzLl9lbGVtZW50cyA9IHRoaXMuX2VsZW1lbnRzLm1hcChlbGVtZW50ID0+IHtcbiAgICAgICAgaWYgKGVsZW1lbnQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2VcbiAgICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgIT09IFwiSU1HXCIpIHJldHVybiBmYWxzZVxuXG4gICAgICAgIGlmICgoZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSB0aGlzLm9mZnNldCkgIDwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIHtcbiAgICAgICAgICB0aGlzLnF1ZXVlKGVsZW1lbnQpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICB0aGlzLl9lbGVtZW50cyA9IHRoaXMuX2VsZW1lbnRzLmZpbHRlcihlbGVtZW50ID0+IHtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHJldHVybiBlbGVtZW50XG4gICAgICB9KVxuXG4gICAgfSwgdGhpcy50aHJvdHRsZSlcbiAgfVxuXG4gIHF1ZXVlKGVsZW1lbnQpIHtcbiAgICB0aGlzLl9xdWV1ZS5wdXNoKGVsZW1lbnQpXG5cbiAgICBpZiAodGhpcy5fcXVldWUubGVuZ3RoIDw9IHRoaXMubGluZXMpIHtcbiAgICAgIHRoaXMubG9hZChlbGVtZW50KVxuICAgIH1cbiAgfVxuXG4gIGxvYWQoZWxlbWVudCkge1xuICAgIHRoaXMuc2V0U3RhdHVzKGVsZW1lbnQsICdsb2FkaW5nJylcblxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHRoaXMub25Mb2FkLCBmYWxzZSlcblxuICAgIGlmICghIXRoaXMuZmFrZVNsb3duZXNzICYmIChNYXRoLnJhbmRvbSgpIDw9ICh0aGlzLmZha2VTbG93bmVzcy5wZXJjZW50YWdlT2ZJbWFnZXMpKSkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGVsZW1lbnQuc3JjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGUpXG4gICAgICB9LCB0aGlzLmZha2VTbG93bmVzcy5kZWxheUJlZm9yZUZldGNoKCkpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZWxlbWVudC5zcmMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZSlcbiAgICB9XG4gIH1cblxuICBvbkxvYWQoZXZlbnQpIHtcbiAgICBsZXQgbmV4dEVsZW1lbnRcbiAgICBsZXQgbG9hZGVkRWxlbWVudCA9IGV2ZW50LnRhcmdldFxuXG4gICAgbG9hZGVkRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgdGhpcy5vbkxvYWQsIGZhbHNlKVxuICAgIHRoaXMuc2V0U3RhdHVzKGxvYWRlZEVsZW1lbnQsICdsb2FkZWQnKVxuXG4gICAgdGhpcy5fcXVldWUgPSB0aGlzLl9xdWV1ZS5maWx0ZXIocXVldWVkRWxlbWVudCA9PiB7XG4gICAgICBpZiAocXVldWVkRWxlbWVudCAhPT0gbG9hZGVkRWxlbWVudCkgcmV0dXJuIHF1ZXVlZEVsZW1lbnRcbiAgICB9KVxuXG4gICAgbmV4dEVsZW1lbnQgPSB0aGlzLl9xdWV1ZS5zaGlmdCgpXG5cbiAgICBpZiAoISFuZXh0RWxlbWVudCkgdGhpcy5sb2FkKG5leHRFbGVtZW50KVxuICB9XG5cbiAgc2V0U3RhdHVzKGVsZW1lbnQsIHN0YXR1cykge1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlICsgJy1zdGF0dXMnLCBzdGF0dXMpXG4gIH1cbn0iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cbmNvbnN0IG1kUm9sbGVkID0gW1xuICBbXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLX4nJy0sOjo6Ojo6Ojo6Ojo6Ojo6Ojo6OicnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sficnOjo6Ojo6OjonLDo6Ojo6OjogOjo6Ojo6Ojo6Ojo6OnwnLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLid8Ojo6Ojp8OiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6fDogOiA6LX5+LS0tOiA6IDogLS0tLS06IHxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLicnJ34tLHw6IDogOiA6IDogOiB+LS0tJzogOiA6IDosJy0tTkVWQSBHQUhOXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gR0lWRSBZT1UgVUhQXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4sLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7Ozs7OycsOiA6IDp8X198LiAuIC58Ozs7Ozs7Ozs7LCc7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLiwtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7Ozs7OzsgXFwuIC4gfDo6OnwuIC4gLicnLDs7Ozs7Ozs7fDs7L1xcblwiLFxuICBcIi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7IDs7O1xcLiAufDo6OnwuIC4gLiB8Ozs7Ozs7Ozt8L1xcblwiLFxuICBcIi4uLi4uLi4uLzs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OywnOzs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7OyA7Ozt8LiAuXFw6Ly4gLiAuIC58Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7JycsOiB8O3wuIC4gLiAuIFxcOzs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLH4nJzs7Ozs7Ozs7OzsgOzs7Ozs7Ozs7OzssLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7fC58O3wuIC4gLiAuIC58Ozs7Ozs7O3xcXG5cIixcbiAgXCIsficnOzs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7fCB8OnwuIC4gLiAuIHxcXDs7Ozs7Ozt8XCJdLFxuXG4gIFtcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC1+JyctLDo6Ojo6Ojo6Ojo6Ojo6Ojo6OjonJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nfDo6Ojo6fDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nJyd+LSx8OiA6IDogOiA6IDogfi0tLSc6IDogOiA6LCctLU5FVkEgR0FITlxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufCw6IDogOiA6IDogOi1+fi0tOiA6IDo6LyAtLS0tLSBMRVQgVSBEV05cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLl9fLC0nOzs7OztcXDonJy0sOiA6IDogOid+LS0tficnL3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi5fXywtficnOzs7Ozs7Lzs7Ozs7OztcXDogOlxcOiA6IDpfX19fLzogOicsX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7XFwuIC4gLicnfDo6Ojo6Ojo6fC4gLiwnOzs7Ozs7Ozs7OycnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLiwnIDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7O1xcLiAuIC5cXDo6Ojo6LCcuIC4vfDs7Ozs7Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4sLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7Ozs7OycsOiA6IDp8X198LiAuIC58Ozs7Ozs7Ozs7LCc7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4sLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLDs7Ozs7Ozs7Ozs7IFxcLiAuIHw6Ojp8LiAuIC4nJyw7Ozs7Ozs7O3w7Oy9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7OzsgOzs7XFwuIC58Ojo6fC4gLiAuIHw7Ozs7Ozs7O3wvXFxuXCIsXG4gIFwiLi4uLi4uLi4uLzs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OywnOzs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7OyA7Ozt8LiAuXFw6Ly4gLiAuIC58Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OycnLDogfDt8LiAuIC4gLiBcXDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4sficnOzs7Ozs7Ozs7OyA7Ozs7Ozs7Ozs7OywtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozt8Lnw7fC4gLiAuIC4gLnw7Ozs7Ozs7fFxcblwiLFxuICBcIi4sficnOzs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7fCB8OnwuIC4gLiAuIHxcXDs7Ozs7Ozt8XCJdLFxuXG4gIFtcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4sLX5+JycnJycnJ35+LS0sLF9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtficnLSw6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6OiwtficnJ19fXycnJyd+fi0tficnJzp9XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJ3w6Ojo6Onw6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKF8nJ34tJzogOiA6IDpvOiA6IDp8OiA6bzogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJycnfi0sfDogOiA6IDogOiA6IH4tLS0nOiA6IDogOiwnLS1ORVZBIEdBSE4gVFVSTiBBSFJPVU5EXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gQU5EIERFU0VSVCBVXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiXVxuXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmlja1JvbGxlZCB7XG5cbiAgY29uc3RydWN0b3IoZGVsYXksIHNob3VsZEhpZGUsIGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudCkgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIHRoaXMuaW5kZXggPSAwO1xuICAgIHRoaXMuZGVsYXkgPSBkZWxheSB8fCAzMDAwO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBmYWxzZTtcbiAgICB0aGlzLnNob3VsZEhpZGUgPSBzaG91bGRIaWRlIHx8IGZhbHNlO1xuICB9XG5cbiAgc3dhcCgpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyAxKSAlIG1kUm9sbGVkLmxlbmd0aDtcblxuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSBtZFJvbGxlZFt0aGlzLmluZGV4XTtcblxuICAgIGlmKHRoaXMucHJpbnRUb0NvbnNvbGUpIGNvbnNvbGUubG9nKG1kUm9sbGVkW3RoaXMuaW5kZXhdKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmKHRoaXMuaW50ZXJ2YWwpIHJldHVybjtcblxuICAgIGlmKHRoaXMuc2hvdWxkSGlkZSkgdGhpcy5lbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHt0aGlzLnN3YXAoKX0sIHRoaXMuZGVsYXkpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZighdGhpcy5pbnRlcnZhbCkgcmV0dXJuO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgdGhpcy5pbnRlcnZhbCA9IGZhbHNlO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cbn1cbiIsIi8vQ3JlYXRvciBQaWVycmUgUmVpbWVydHogTUlUIEVUQyBFVENcblxuY29uc3QgaXNNb2JpbGUgPSAvaVBob25lfGlQYWR8aVBvZHxBbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgIG1vdmVFdmVudCA9IGlzTW9iaWxlID8gJ3RvdWNobW92ZScgOiAnbW91c2Vtb3ZlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhbnNsYXRlciB7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgeFJvdGF0aW9uLCB5Um90YXRpb24pIHtcbiAgICB0aGlzLnhSb3RhdGlvbiA9IHhSb3RhdGlvbjtcbiAgICB0aGlzLnlSb3RhdGlvbiA9IHlSb3RhdGlvbjtcbiAgICB0aGlzLmVsID0gZWxlbWVudDtcbiAgICB0aGlzLmZyYW1lID0gZmFsc2U7XG4gICAgdGhpcy50aHJvdHRsZXIgPSBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZU1vdmUoY2xpZW50WCwgY2xpZW50WSl7XG4gICAgbGV0IHggPSAoKDEgLSAoY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkpICogLTEpICogdGhpcy54Um90YXRpb24sXG4gICAgICAgIHkgPSAoY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIHRoaXMueVJvdGF0aW9uO1xuXG4gICAgdGhpcy5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlWCgke3h9ZGVnKSByb3RhdGVZKCR7eX1kZWcpYDtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMubGlzdGVuZXIgPSBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIobW92ZUV2ZW50LCAoZXZlbnQpID0+IHtcbiAgICAgIGlmKHRoaXMudGhyb3R0bGVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMudGhyb3R0bGVyID0gc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICAgICAgdGhpcy50aHJvdHRsZXIgPSBmYWxzZTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBpZihldmVudC50YXJnZXRUb3VjaGVzKSB0aGlzLmhhbmRsZU1vdmUoZXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYLCBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlTW92ZShldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCA1MCk7XG5cbiAgICB9KTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKG1vdmVFdmVudCwgdGhpcy5saXN0ZW5lcik7XG4gIH07XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH07XG59IiwiLy9DcmVhdG9yIFBpZXJyZSBSZWltZXJ0eiBNSVQgRVRDIEVUQ1xuXG5jb25zdCB0aW1lb3V0TWFwID0gbmV3IE1hcCgpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJyMnLCA1MC8yKTsgLy9kZWxldGVcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCdAJywgMjUwLzIpOyAvL3BhdXNlXG4gICAgICB0aW1lb3V0TWFwLnNldCgnLCcsIDM1MC8yKTtcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCctJywgMzUwLzIpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJy4nLCA1MDAvMik7XG4gICAgICB0aW1lb3V0TWFwLnNldCgnPycsIDc1MC8yKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JpdGVyIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudHMsIHN0cmluZykge1xuICAgIHRoaXMuZWwgPSBlbGVtZW50cztcbiAgICB0aGlzLnMgPSBzdHJpbmc7XG4gICAgdGhpcy5pc1dyaXRpbmdMaW5rID0gZmFsc2U7XG4gIH1cblxuICB1cGRhdGVXcml0ZXJzKGNoYXJhY3Rlcikge1xuXG4gICBbXS5mb3JFYWNoLmNhbGwodGhpcy5lbCwgKGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCBvbGRFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIGVsZW1lbnQgPSAodGhpcy5pc1dyaXRpbmdMaW5rKSA/IGVsZW1lbnQucXVlcnlTZWxlY3RvcignYTpsYXN0LWNoaWxkJykgOiBlbGVtZW50O1xuXG4gICAgICBpZiAoY2hhcmFjdGVyID09PSAnQCcpIHJldHVybjtcblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnIycpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTC5zbGljZSgwLCAtMSk7XG4gICAgICAgIGlmKG9sZEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpLnNsaWNlKDAsLTEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICcqJykge1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTCArPSAnPGJyPic7XG4gICAgICAgIG9sZEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnLCBvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0JykgKyAnXFxhJyk7XG4gICAgICB9XG5cbiAgICAgIGVsc2UgaWYgKGNoYXJhY3RlciA9PT0gJyQnKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1dyaXRpbmdMaW5rKSB7XG4gICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuICAgICAgICAgIGxpbmsuaHJlZiA9IHRoaXMucy5zcGxpdCgnJCcpWzBdO1xuICAgICAgICAgIGxpbmsudGFyZ2V0ID0gJ19ibGFuayc7XG5cblxuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQobGluayk7XG5cbiAgICAgICAgICB0aGlzLmlzV3JpdGluZ0xpbmsgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucyA9IHRoaXMucy5zdWJzdHJpbmcodGhpcy5zLnNwbGl0KCckJylbMF0ubGVuZ3RoKzEsIHRoaXMucy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuaXNXcml0aW5nTGluayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgKz0gY2hhcmFjdGVyO1xuICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpICsgY2hhcmFjdGVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHdyaXRlcihiZVF1aWNrKSB7XG4gICAgbGV0IHRleHQsIG1zRGVsYXk7XG5cbiAgICBpZiAodGhpcy5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXMuaXNEb25lKCk7XG5cbiAgICB0ZXh0ID0gdGhpcy5zLnN1YnN0cmluZygwLDEpO1xuICAgIHRoaXMucyA9ICB0aGlzLnMuc3Vic3RyaW5nKDEsdGhpcy5zLmxlbmd0aCk7XG4gICAgdGhpcy51cGRhdGVXcml0ZXJzKHRleHQpO1xuXG4gICAgaWYgKGJlUXVpY2spICAgICAgICAgIHJldHVybiB0aGlzLndyaXRlcih0cnVlKTtcblxuICAgIG1zRGVsYXkgPSB0aW1lb3V0TWFwLmdldCh0ZXh0KSB8fCBNYXRoLnJhbmRvbSgpICogMTUwO1xuXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge3RoaXMud3JpdGVyKCl9LCBtc0RlbGF5KTtcblxuICB9O1xuXG4gIHVwZGF0ZUxhc3RSZWFkKCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWFkLWV2ZXJ5dGhpbmctYXQnLCBEYXRlLm5vdygpKTtcbiAgfVxuXG4gIGdldCBnZXRMYXN0UmVhZCgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlYWQtZXZlcnl0aGluZy1hdCcpKTtcbiAgfVxuXG4gIGlzRG9uZSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ludHJvLWlzLWRvbmUnKTtcbiAgICB0aGlzLnVwZGF0ZUxhc3RSZWFkKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoKHRoaXMuZ2V0TGFzdFJlYWQgKyA1MDAwKSA8IERhdGUubm93KCkpIHtcbiAgICAgIHRoaXMudXBkYXRlTGFzdFJlYWQoKTtcbiAgICAgIHRoaXMud3JpdGVyKHRydWUpO1xuICAgICAgdGhpcy5pc0RvbmUoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLndyaXRlcigpO1xuICAgIH1cbiAgfVxufSJdfQ==
