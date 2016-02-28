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
      return Math.random() * 3500 + 3000;
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

var placeholderImages = [
/* wide   */'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvYAAAQAAQMAAACwNI9dAAAAA1BMVEUb/5DUIh99AAAAdUlEQVR42u3BAQ0AAADCoPdP7ewBFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN4APAAGN6DpwAAAAAElFTkSuQmCC',
/* tall   */'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWAQMAAAAGz+OhAAAAA1BMVEUb/5DUIh99AAAAGklEQVR4Ae3BAQEAAAQDMP1TiwHfVgAAwHoNC7gAASist30AAAAASUVORK5CYII=',
/* square */'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWAQMAAABelSeRAAAAA1BMVEUb/5DUIh99AAAAHElEQVR4Xu3AAQkAAADCMPunNsdhWwoAAAAAABwW2gABlO2L2AAAAABJRU5ErkJggg=='];

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

    _classCallCheck(this, LazyLoader);

    this.attribute = attribute;
    this.offset = offset;
    this.lines = lines;
    this.throttle = throttle;
    this.checkOnStart = checkOnStart;
    this.autoStart = autoStart;
    this.fakeSlowness = fakeSlowness;

    this._elements = [].slice.call(document.querySelectorAll('[' + this.attribute + ']'));
    this._queue = [];
    this._listener = false;
    this._throttler = false;
    this._placeholderImages = placeholderImages;

    if (this.autoStart) {
      this.start();
    }
  }

  _createClass(LazyLoader, [{
    key: 'start',
    value: function start() {
      var _this = this;

      if (!!this._listener) return;
      if (this.checkOnStart) this.checkScroll();

      this._elements.map(function (element) {
        if (!element.src || element.src === '') {
          element.src = _this._placeholderImages[Math.floor(Math.random() * 2 + 0.5)];
        }
      });

      this._listener = function (event) {
        _this.checkScroll();
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
    key: 'setStatus',
    value: function setStatus(image, status) {
      image.setAttribute(this.attribute + '-status', status);
    }
  }, {
    key: 'fetchImage',
    value: function fetchImage(image) {
      var _this2 = this;

      this.setStatus(image, 'loading');
      image.addEventListener('load', function (event) {
        _this2.imageLoaded(image);
      }, false);

      if (!!this.fakeSlowness && Math.random() <= this.fakeSlowness.percentageOfImages) {
        setTimeout(function () {
          image.src = image.getAttribute(_this2.attribute);
        }, this.fakeSlowness.delayBeforeFetch());
      } else {
        image.src = image.getAttribute(this.attribute);
      }
    }
  }, {
    key: 'imageLoaded',
    value: function imageLoaded(loadedImage) {
      var nextImageToFetch = undefined;

      this.setStatus(loadedImage, 'loaded');

      this._queue = this._queue.filter(function (queuedImage) {
        if (queuedImage !== loadedImage) return queuedImage;
      });

      nextImageToFetch = this._queue.shift();

      if (!!nextImageToFetch) this.fetchImage(nextImageToFetch);
    }
  }, {
    key: 'addImageToQueue',
    value: function addImageToQueue(element) {
      this._queue.push(element);

      if (this._queue.length <= this.lines) {
        this.fetchImage(element);
      }
    }
  }, {
    key: 'checkScroll',
    value: function checkScroll() {
      var _this3 = this;

      if (this._throttler) return;
      if (this._elements.length === 0) return this.stop();

      this._throttler = setTimeout(function () {
        _this3._throttler = false;

        _this3._elements = _this3._elements.map(function (element) {
          if (element === false) return false;
          if (element.nodeName !== "IMG") return false;

          if (element.getBoundingClientRect().top - _this3.offset < document.body.scrollTop) {
            _this3.addImageToQueue(element);
            return false;
          } else {
            return element;
          }
        });

        _this3._elements = _this3._elements.filter(function (element) {
          if (element) return element;
        });
      }, this.throttle);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWNoby1qcy9zcmMvZWNoby5qcyIsInNyYy9zY3JpcHRzL21haW4taG9tZS5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvTGF6eUxvYWRlci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvUmlja1JvbGxlZC5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvVHJhbnNsYXRlci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvV3JpdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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R0FBeEIsQ0FBNEIsZUFBNUIsRUFETztBQUVQLFdBQUssY0FBTCxHQUZPOzs7OzRCQUtEO0FBQ04sVUFBSSxJQUFDLENBQUssV0FBTCxHQUFtQixJQUFuQixHQUEyQixLQUFLLEdBQUwsRUFBNUIsRUFBd0M7QUFDMUMsYUFBSyxjQUFMLEdBRDBDO0FBRTFDLGFBQUssTUFBTCxDQUFZLElBQVosRUFGMEM7QUFHMUMsYUFBSyxNQUFMLEdBSDBDO09BQTVDLE1BS0s7QUFDSCxhQUFLLE1BQUwsR0FERztPQUxMOzs7O3dCQVZnQjtBQUNoQixhQUFPLFNBQVMsYUFBYSxPQUFiLENBQXFCLG9CQUFyQixDQUFULENBQVAsQ0FEZ0I7Ozs7U0F4RUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeShyb290KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5lY2hvID0gZmFjdG9yeShyb290KTtcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKHJvb3QpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGVjaG8gPSB7fTtcblxuICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcblxuICB2YXIgb2Zmc2V0LCBwb2xsLCBkZWxheSwgdXNlRGVib3VuY2UsIHVubG9hZDtcblxuICB2YXIgaXNIaWRkZW4gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHJldHVybiAoZWxlbWVudC5vZmZzZXRQYXJlbnQgPT09IG51bGwpO1xuICB9O1xuICBcbiAgdmFyIGluVmlldyA9IGZ1bmN0aW9uIChlbGVtZW50LCB2aWV3KSB7XG4gICAgaWYgKGlzSGlkZGVuKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGJveCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIChib3gucmlnaHQgPj0gdmlldy5sICYmIGJveC5ib3R0b20gPj0gdmlldy50ICYmIGJveC5sZWZ0IDw9IHZpZXcuciAmJiBib3gudG9wIDw9IHZpZXcuYik7XG4gIH07XG5cbiAgdmFyIGRlYm91bmNlT3JUaHJvdHRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZighdXNlRGVib3VuY2UgJiYgISFwb2xsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsZWFyVGltZW91dChwb2xsKTtcbiAgICBwb2xsID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgZWNoby5yZW5kZXIoKTtcbiAgICAgIHBvbGwgPSBudWxsO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcblxuICBlY2hvLmluaXQgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgIHZhciBvZmZzZXRBbGwgPSBvcHRzLm9mZnNldCB8fCAwO1xuICAgIHZhciBvZmZzZXRWZXJ0aWNhbCA9IG9wdHMub2Zmc2V0VmVydGljYWwgfHwgb2Zmc2V0QWxsO1xuICAgIHZhciBvZmZzZXRIb3Jpem9udGFsID0gb3B0cy5vZmZzZXRIb3Jpem9udGFsIHx8IG9mZnNldEFsbDtcbiAgICB2YXIgb3B0aW9uVG9JbnQgPSBmdW5jdGlvbiAob3B0LCBmYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KG9wdCB8fCBmYWxsYmFjaywgMTApO1xuICAgIH07XG4gICAgb2Zmc2V0ID0ge1xuICAgICAgdDogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRUb3AsIG9mZnNldFZlcnRpY2FsKSxcbiAgICAgIGI6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0Qm90dG9tLCBvZmZzZXRWZXJ0aWNhbCksXG4gICAgICBsOiBvcHRpb25Ub0ludChvcHRzLm9mZnNldExlZnQsIG9mZnNldEhvcml6b250YWwpLFxuICAgICAgcjogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRSaWdodCwgb2Zmc2V0SG9yaXpvbnRhbClcbiAgICB9O1xuICAgIGRlbGF5ID0gb3B0aW9uVG9JbnQob3B0cy50aHJvdHRsZSwgMjUwKTtcbiAgICB1c2VEZWJvdW5jZSA9IG9wdHMuZGVib3VuY2UgIT09IGZhbHNlO1xuICAgIHVubG9hZCA9ICEhb3B0cy51bmxvYWQ7XG4gICAgY2FsbGJhY2sgPSBvcHRzLmNhbGxiYWNrIHx8IGNhbGxiYWNrO1xuICAgIGVjaG8ucmVuZGVyKCk7XG4gICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlLCBmYWxzZSk7XG4gICAgICByb290LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBkZWJvdW5jZU9yVGhyb3R0bGUsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdC5hdHRhY2hFdmVudCgnb25zY3JvbGwnLCBkZWJvdW5jZU9yVGhyb3R0bGUpO1xuICAgICAgcm9vdC5hdHRhY2hFdmVudCgnb25sb2FkJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICB9XG4gIH07XG5cbiAgZWNoby5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nW2RhdGEtZWNob10sIFtkYXRhLWVjaG8tYmFja2dyb3VuZF0nKTtcbiAgICB2YXIgbGVuZ3RoID0gbm9kZXMubGVuZ3RoO1xuICAgIHZhciBzcmMsIGVsZW07XG4gICAgdmFyIHZpZXcgPSB7XG4gICAgICBsOiAwIC0gb2Zmc2V0LmwsXG4gICAgICB0OiAwIC0gb2Zmc2V0LnQsXG4gICAgICBiOiAocm9vdC5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSArIG9mZnNldC5iLFxuICAgICAgcjogKHJvb3QuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpICsgb2Zmc2V0LnJcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGVsZW0gPSBub2Rlc1tpXTtcbiAgICAgIGlmIChpblZpZXcoZWxlbSwgdmlldykpIHtcblxuICAgICAgICBpZiAodW5sb2FkKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1wbGFjZWhvbGRlcicsIGVsZW0uc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKSAhPT0gbnVsbCkge1xuICAgICAgICAgIGVsZW0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVsZW0uc3JjID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNobycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1bmxvYWQpIHtcbiAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1lY2hvJyk7XG4gICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhlbGVtLCAnbG9hZCcpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodW5sb2FkICYmICEhKHNyYyA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tcGxhY2Vob2xkZXInKSkpIHtcblxuICAgICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJykgIT09IG51bGwpIHtcbiAgICAgICAgICBlbGVtLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgc3JjICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbS5zcmMgPSBzcmM7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1lY2hvLXBsYWNlaG9sZGVyJyk7XG4gICAgICAgIGNhbGxiYWNrKGVsZW0sICd1bmxvYWQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIGVjaG8uZGV0YWNoKCk7XG4gICAgfVxuICB9O1xuXG4gIGVjaG8uZGV0YWNoID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICByb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QuZGV0YWNoRXZlbnQoJ29uc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0KHBvbGwpO1xuICB9O1xuXG4gIHJldHVybiBlY2hvO1xuXG59KTtcbiIsImltcG9ydCBXcml0ZXIgZnJvbSAnLi9tb2R1bGVzL1dyaXRlcic7XG5pbXBvcnQgVHJhbnNsYXRlciBmcm9tICcuL21vZHVsZXMvVHJhbnNsYXRlcic7XG5pbXBvcnQgUmlja1JvbGxlZCBmcm9tICcuL21vZHVsZXMvUmlja1JvbGxlZCc7XG5pbXBvcnQgTGF6eUxvYWRlciBmcm9tICcuL21vZHVsZXMvTGF6eUxvYWRlcic7XG5cbmNvbnN0IGVjaG8gPSByZXF1aXJlKCdlY2hvLWpzJykoZG9jdW1lbnQuYm9keSk7XG5jb25zdCBpbnRyb1RleHQgPSBgaGksIG15IG5hbWUgaXMgcGnDqXJyZSByZWltZXJ0ei5cblxuaSBhbSBhIGh1bWJsZSBkZXZlbG9wZXJAQEAjIyMjIyMjIyNtYWdpY2lhbkBAQCMjIyMjIyMjY29kZXIsIGRlc2lnbmVyLCBmYWtlLWl0LXRpbC15b3UtbWFrZS1pdCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjZW50cmVwcmVuZXVyIGFuZCBldmVyeWRheSBodXN0bGVyLlxuZXh0cmVtZWx5IGFkZGljdGVkIG9mIGJ1aWxkaW5nIHRoaW5ncy5cblxuJGh0dHA6Ly9naXRodWIuY29tL3JlaW1lcnR6JGdpdGh1YiQgfCAkaHR0cDovL3R3aXR0ZXIuY29tL3JlaW1lcnR6JHR3aXR0ZXIkIHwgJG1haWx0bzpwaWVycmUucmVpbWVydHpAZ21haWwuY29tJGhpcmUgbWUkIGA7XG5cblxuY29uc3Qgd3JpdGVyID0gbmV3IFdyaXRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud3JpdGVyJyksIGludHJvVGV4dCk7XG5jb25zdCB0cmFuc2xhdGVyID0gbmV3IFRyYW5zbGF0ZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpLCAxMCwgMTUpO1xuY29uc3QgcnIgPSBuZXcgUmlja1JvbGxlZCg1MDAwLCB0cnVlLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhbGwtbXktc2VjcmV0LWFwaS1rZXlzJykpO1xuY29uc3QgbGwgPSBuZXcgTGF6eUxvYWRlcih7IGxpbmVzOiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm90dGxlOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tPblN0YXJ0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWtlU2xvd25lc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5QmVmb3JlRmV0Y2g6ICgpID0+IHsgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAzNTAwICsgMzAwMH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50YWdlT2ZJbWFnZXM6IDAuM1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7XG4gIHdyaXRlci5zdGFydCgpO1xuICB0cmFuc2xhdGVyLnN0YXJ0KCk7XG4gIHJyLnN0YXJ0KCk7XG4gIGxsLnN0YXJ0KCk7XG59KTtcblxuXG4iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cbmNvbnN0IHBsYWNlaG9sZGVySW1hZ2VzID0gW1xuICAvKiB3aWRlICAgKi8gICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQXZZQUFBUUFBUU1BQUFDd05JOWRBQUFBQTFCTVZFVWIvNURVSWg5OUFBQUFkVWxFUVZSNDJ1M0JBUTBBQUFEQ29QZFA3ZXdCRkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFONEFQQUFHTjZEcHdBQUFBQUVsRlRrU3VRbUNDJyxcbiAgLyogdGFsbCAgICovICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFKWUFBQUNXQVFNQUFBQUd6K09oQUFBQUExQk1WRVViLzVEVUloOTlBQUFBR2tsRVFWUjRBZTNCQVFFQUFBUURNUDFUaXdIZlZnQUF3SG9OQzdnQUFTaXN0MzBBQUFBQVNVVk9SSzVDWUlJPScsXG4gIC8qIHNxdWFyZSAqLyAgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBU3dBQUFDV0FRTUFBQUJlbFNlUkFBQUFBMUJNVkVVYi81RFVJaDk5QUFBQUhFbEVRVlI0WHUzQUFRa0FBQURDTVB1bk5zZGhXd29BQUFBQUFCd1cyZ0FCbE8yTDJBQUFBQUJKUlU1RXJrSmdnZz09J1xuXVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXp5TG9hZGVyIHtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgYXR0cmlidXRlID0gJ2RhdGEtbGF6eScsXG4gICAgb2Zmc2V0ID0gKGRvY3VtZW50LmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LzIpLFxuICAgIGxpbmVzID0gMyxcbiAgICB0aHJvdHRsZSA9IDM1MCxcbiAgICBhdXRvU3RhcnQgPSB0cnVlLFxuICAgIGNoZWNrT25TdGFydCA9IHRydWUsXG4gICAgZmFrZVNsb3duZXNzID0gZmFsc2V9KVxuICB7XG4gICAgdGhpcy5hdHRyaWJ1dGUgPSBhdHRyaWJ1dGVcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldFxuICAgIHRoaXMubGluZXMgPSBsaW5lc1xuICAgIHRoaXMudGhyb3R0bGUgPSB0aHJvdHRsZVxuICAgIHRoaXMuY2hlY2tPblN0YXJ0ID0gY2hlY2tPblN0YXJ0XG4gICAgdGhpcy5hdXRvU3RhcnQgPSBhdXRvU3RhcnRcbiAgICB0aGlzLmZha2VTbG93bmVzcyA9IGZha2VTbG93bmVzc1xuXG4gICAgdGhpcy5fZWxlbWVudHMgICAgICAgICAgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFskeyB0aGlzLmF0dHJpYnV0ZSB9XWApKVxuICAgIHRoaXMuX3F1ZXVlICAgICAgICAgICAgID0gW11cbiAgICB0aGlzLl9saXN0ZW5lciAgICAgICAgICA9IGZhbHNlXG4gICAgdGhpcy5fdGhyb3R0bGVyICAgICAgICAgPSBmYWxzZVxuICAgIHRoaXMuX3BsYWNlaG9sZGVySW1hZ2VzID0gcGxhY2Vob2xkZXJJbWFnZXNcblxuICAgIGlmICh0aGlzLmF1dG9TdGFydCkge1xuICAgICAgdGhpcy5zdGFydCgpXG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCEhdGhpcy5fbGlzdGVuZXIpIHJldHVyblxuICAgIGlmICh0aGlzLmNoZWNrT25TdGFydCkgdGhpcy5jaGVja1Njcm9sbCgpXG5cbiAgICB0aGlzLl9lbGVtZW50cy5tYXAoZWxlbWVudCA9PiB7XG4gICAgICBpZiAoIWVsZW1lbnQuc3JjIHx8IGVsZW1lbnQuc3JjID09PSAnJykge1xuICAgICAgICBlbGVtZW50LnNyYyA9IHRoaXMuX3BsYWNlaG9sZGVySW1hZ2VzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoyICsgMC41KV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5fbGlzdGVuZXIgPSBldmVudCA9PiB7dGhpcy5jaGVja1Njcm9sbCgpfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5fbGlzdGVuZXIsIGZhbHNlKVxuICB9XG5cblxuICBzdG9wKCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuX2xpc3RlbmVyKVxuICAgIHRoaXMuX2xpc3RlbmVyID0gZmFsc2VcbiAgICB0aGlzLl90aHJvdHRsZXIgPSBmYWxzZVxuICB9XG5cbiAgc2V0U3RhdHVzKGltYWdlLCBzdGF0dXMpIHtcbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGUgKyAnLXN0YXR1cycsIHN0YXR1cylcbiAgfVxuXG4gIGZldGNoSW1hZ2UoaW1hZ2UpIHtcbiAgICB0aGlzLnNldFN0YXR1cyhpbWFnZSwgJ2xvYWRpbmcnKVxuICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBldmVudCA9PiB7dGhpcy5pbWFnZUxvYWRlZChpbWFnZSl9LCBmYWxzZSlcblxuICAgIGlmICghIXRoaXMuZmFrZVNsb3duZXNzICYmIChNYXRoLnJhbmRvbSgpIDw9ICh0aGlzLmZha2VTbG93bmVzcy5wZXJjZW50YWdlT2ZJbWFnZXMpKSkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGltYWdlLnNyYyA9IGltYWdlLmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZSlcbiAgICAgIH0sIHRoaXMuZmFrZVNsb3duZXNzLmRlbGF5QmVmb3JlRmV0Y2goKSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpbWFnZS5zcmMgPSBpbWFnZS5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGUpXG4gICAgfVxuICB9XG5cbiAgaW1hZ2VMb2FkZWQobG9hZGVkSW1hZ2UpIHtcbiAgICBsZXQgbmV4dEltYWdlVG9GZXRjaFxuXG4gICAgdGhpcy5zZXRTdGF0dXMobG9hZGVkSW1hZ2UsICdsb2FkZWQnKVxuXG4gICAgdGhpcy5fcXVldWUgPSB0aGlzLl9xdWV1ZS5maWx0ZXIocXVldWVkSW1hZ2UgPT4ge1xuICAgICAgaWYgKHF1ZXVlZEltYWdlICE9PSBsb2FkZWRJbWFnZSkgcmV0dXJuIHF1ZXVlZEltYWdlXG4gICAgfSlcblxuICAgIG5leHRJbWFnZVRvRmV0Y2ggPSB0aGlzLl9xdWV1ZS5zaGlmdCgpXG5cbiAgICBpZiAoISFuZXh0SW1hZ2VUb0ZldGNoKSB0aGlzLmZldGNoSW1hZ2UobmV4dEltYWdlVG9GZXRjaClcbiAgfVxuXG4gIGFkZEltYWdlVG9RdWV1ZShlbGVtZW50KSB7XG4gICAgdGhpcy5fcXVldWUucHVzaChlbGVtZW50KVxuXG4gICAgaWYgKHRoaXMuX3F1ZXVlLmxlbmd0aCA8PSB0aGlzLmxpbmVzKSB7XG4gICAgICB0aGlzLmZldGNoSW1hZ2UoZWxlbWVudClcbiAgICB9XG4gIH1cblxuICBjaGVja1Njcm9sbCgpIHtcbiAgICBpZiAodGhpcy5fdGhyb3R0bGVyKSByZXR1cm5cbiAgICBpZiAodGhpcy5fZWxlbWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5zdG9wKClcblxuICAgIHRoaXMuX3Rocm90dGxlciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLl90aHJvdHRsZXIgPSBmYWxzZVxuXG4gICAgICB0aGlzLl9lbGVtZW50cyA9IHRoaXMuX2VsZW1lbnRzLm1hcChlbGVtZW50ID0+IHtcbiAgICAgICAgaWYgKGVsZW1lbnQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2VcbiAgICAgICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgIT09IFwiSU1HXCIpIHJldHVybiBmYWxzZVxuXG4gICAgICAgIGlmICgoZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSB0aGlzLm9mZnNldCkgIDwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3ApIHtcbiAgICAgICAgICB0aGlzLmFkZEltYWdlVG9RdWV1ZShlbGVtZW50KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgdGhpcy5fZWxlbWVudHMgPSB0aGlzLl9lbGVtZW50cy5maWx0ZXIoZWxlbWVudCA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50KSByZXR1cm4gZWxlbWVudFxuICAgICAgfSlcblxuICAgIH0sIHRoaXMudGhyb3R0bGUpXG4gIH1cblxufSIsIi8vQ3JlYXRvciBQaWVycmUgUmVpbWVydHogTUlUIEVUQyBFVENcblxuY29uc3QgbWRSb2xsZWQgPSBbXG4gIFtcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4sLX5+JycnJycnJ35+LS0sLF9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtficnLSw6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6OiwtficnJ19fXycnJyd+fi0tficnJzp9XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJ3w6Ojo6Onw6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKF8nJ34tJzogOiA6IDpvOiA6IDp8OiA6bzogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJycnfi0sfDogOiA6IDogOiA6IH4tLS0nOiA6IDogOiwnLS1ORVZBIEdBSE5cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufCw6IDogOiA6IDogOi1+fi0tOiA6IDo6LyAtLS0tLSBHSVZFIFlPVSBVSFBcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtJydcXCc6XFw6IDonfiwsXzogOiA6IDogOiBfLC0nXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi5fXywtJzs7Ozs7XFw6JyctLDogOiA6IDonfi0tLX4nJy98XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi5fXywtficnOzs7Ozs7Lzs7Ozs7OztcXDogOlxcOiA6IDpfX19fLzogOicsX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLiwtfn5+JycnJ187Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7JywuIC4nJy0sOnw6Ojo6Ojo6fC4gLiB8Ozs7OycnLSxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7O1xcLiAuIC4nJ3w6Ojo6Ojo6OnwuIC4sJzs7Ozs7Ozs7OzsnJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLiwnIDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7O1xcLiAuIC5cXDo6Ojo6LCcuIC4vfDs7Ozs7Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLiwtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7Ozs7Jyw6IDogOnxfX3wuIC4gLnw7Ozs7Ozs7OzssJzs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Jyw7Ozs7Ozs7Ozs7OyBcXC4gLiB8Ojo6fC4gLiAuJycsOzs7Ozs7Ozt8OzsvXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7OzsgOzs7XFwuIC58Ojo6fC4gLiAuIHw7Ozs7Ozs7O3wvXFxuXCIsXG4gIFwiLi4uLi4uLi4vOzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LCc7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7IDs7O3wuIC5cXDovLiAuIC4gLnw7Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IDs7Ozs7OzsnJyw6IHw7fC4gLiAuIC4gXFw7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4sficnOzs7Ozs7Ozs7OyA7Ozs7Ozs7Ozs7OywtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozt8Lnw7fC4gLiAuIC4gLnw7Ozs7Ozs7fFxcblwiLFxuICBcIix+Jyc7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7OywtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Jyw7Ozs7Ozt8IHw6fC4gLiAuIC4gfFxcOzs7Ozs7O3xcIl0sXG5cbiAgW1wiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4sLX5+JycnJycnJ35+LS0sLF9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLX4nJy0sOjo6Ojo6Ojo6Ojo6Ojo6Ojo6OicnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLH4nJzo6Ojo6Ojo6Jyw6Ojo6Ojo6IDo6Ojo6Ojo6Ojo6Ojp8JyxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6OiwtficnJ19fXycnJyd+fi0tficnJzp9XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLid8Ojo6Ojp8OiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6Onw6IDogOi1+fi0tLTogOiA6IC0tLS0tOiB8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKF8nJ34tJzogOiA6IDpvOiA6IDp8OiA6bzogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLicnJ34tLHw6IDogOiA6IDogOiB+LS0tJzogOiA6IDosJy0tTkVWQSBHQUhOXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58LDogOiA6IDogOiA6LX5+LS06IDogOjovIC0tLS0tIExFVCBVIERXTlxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtJydcXCc6XFw6IDonfiwsXzogOiA6IDogOiBfLC0nXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLl9fLC1+Jyc7Ozs7OzsvOzs7Ozs7O1xcOiA6XFw6IDogOl9fX18vOiA6JyxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLiwtfn5+JycnJ187Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7JywuIC4nJy0sOnw6Ojo6Ojo6fC4gLiB8Ozs7OycnLSxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLCcgOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7XFwuIC4gLlxcOjo6OjosJy4gLi98Ozs7Ozs7Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLiwtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7Ozs7Jyw6IDogOnxfX3wuIC4gLnw7Ozs7Ozs7OzssJzs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLiwtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7Ozs7OzsgXFwuIC4gfDo6OnwuIC4gLicnLDs7Ozs7Ozs7fDs7L1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7OyA7OztcXC4gLnw6Ojp8LiAuIC4gfDs7Ozs7Ozs7fC9cXG5cIixcbiAgXCIuLi4uLi4uLi4vOzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LCc7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7IDs7O3wuIC5cXDovLiAuIC4gLnw7Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7JycsOiB8O3wuIC4gLiAuIFxcOzs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLix+Jyc7Ozs7Ozs7Ozs7IDs7Ozs7Ozs7Ozs7LC0nJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7O3wufDt8LiAuIC4gLiAufDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLix+Jyc7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7OywtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Jyw7Ozs7Ozt8IHw6fC4gLiAuIC4gfFxcOzs7Ozs7O3xcIl0sXG5cbiAgW1wiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLiwtfn4nJycnJycnfn4tLSwsX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC1+JyctLDo6Ojo6Ojo6Ojo6Ojo6Ojo6OjonJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLH4nJzo6Ojo6Ojo6Jyw6Ojo6Ojo6IDo6Ojo6Ojo6Ojo6Ojp8JyxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojo6LC1+JycnX19fJycnJ35+LS1+JycnOn1cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nfDo6Ojo6fDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6Onw6IDogOi1+fi0tLTogOiA6IC0tLS0tOiB8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4oXycnfi0nOiA6IDogOm86IDogOnw6IDpvOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nJyd+LSx8OiA6IDogOiA6IDogfi0tLSc6IDogOiA6LCctLU5FVkEgR0FITiBUVVJOIEFIUk9VTkRcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufCw6IDogOiA6IDogOi1+fi0tOiA6IDo6LyAtLS0tLSBBTkQgREVTRVJUIFVcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtJydcXCc6XFw6IDonfiwsXzogOiA6IDogOiBfLC0nXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi5fXywtJzs7Ozs7XFw6JyctLDogOiA6IDonfi0tLX4nJy98XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi5fXywtficnOzs7Ozs7Lzs7Ozs7OztcXDogOlxcOiA6IDpfX19fLzogOicsX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLiwtfn5+JycnJ187Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7JywuIC4nJy0sOnw6Ojo6Ojo6fC4gLiB8Ozs7OycnLSxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7O1xcLiAuIC4nJ3w6Ojo6Ojo6OnwuIC4sJzs7Ozs7Ozs7OzsnJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLiwnIDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7O1xcLiAuIC5cXDo6Ojo6LCcuIC4vfDs7Ozs7Ozs7Ozs7Ozt8XFxuXCJdXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSaWNrUm9sbGVkIHtcblxuICBjb25zdHJ1Y3RvcihkZWxheSwgc2hvdWxkSGlkZSwgZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50KSB0aGlzLmVsID0gZWxlbWVudDtcbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnBhcmVudE5vZGU7XG4gICAgfVxuXG4gICAgdGhpcy5pbmRleCA9IDA7XG4gICAgdGhpcy5kZWxheSA9IGRlbGF5IHx8IDMwMDA7XG4gICAgdGhpcy5pbnRlcnZhbCA9IGZhbHNlO1xuICAgIHRoaXMuc2hvdWxkSGlkZSA9IHNob3VsZEhpZGUgfHwgZmFsc2U7XG4gIH1cblxuICBzd2FwKCkge1xuICAgIHRoaXMuaW5kZXggPSAodGhpcy5pbmRleCArIDEpICUgbWRSb2xsZWQubGVuZ3RoO1xuXG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnJztcbiAgICB0aGlzLmVsLmlubmVySFRNTCA9IG1kUm9sbGVkW3RoaXMuaW5kZXhdO1xuXG4gICAgaWYodGhpcy5wcmludFRvQ29uc29sZSkgY29uc29sZS5sb2cobWRSb2xsZWRbdGhpcy5pbmRleF0pO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYodGhpcy5pbnRlcnZhbCkgcmV0dXJuO1xuXG4gICAgaWYodGhpcy5zaG91bGRIaWRlKSB0aGlzLmVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge3RoaXMuc3dhcCgpfSwgdGhpcy5kZWxheSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGlmKCF0aGlzLmludGVydmFsKSByZXR1cm47XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB0aGlzLmludGVydmFsID0gZmFsc2U7XG4gIH1cblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfVxufVxuIiwiLy9DcmVhdG9yIFBpZXJyZSBSZWltZXJ0eiBNSVQgRVRDIEVUQ1xuXG5jb25zdCBpc01vYmlsZSA9IC9pUGhvbmV8aVBhZHxpUG9kfEFuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLFxuICAgICAgbW92ZUV2ZW50ID0gaXNNb2JpbGUgPyAndG91Y2htb3ZlJyA6ICdtb3VzZW1vdmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmFuc2xhdGVyIHtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50LCB4Um90YXRpb24sIHlSb3RhdGlvbikge1xuICAgIHRoaXMueFJvdGF0aW9uID0geFJvdGF0aW9uO1xuICAgIHRoaXMueVJvdGF0aW9uID0geVJvdGF0aW9uO1xuICAgIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgIHRoaXMuZnJhbWUgPSBmYWxzZTtcbiAgICB0aGlzLnRocm90dGxlciA9IGZhbHNlO1xuICB9XG5cbiAgaGFuZGxlTW92ZShjbGllbnRYLCBjbGllbnRZKXtcbiAgICBsZXQgeCA9ICgoMSAtIChjbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0KSkgKiAtMSkgKiB0aGlzLnhSb3RhdGlvbixcbiAgICAgICAgeSA9IChjbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGgpICogdGhpcy55Um90YXRpb247XG5cbiAgICB0aGlzLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGVYKCR7eH1kZWcpIHJvdGF0ZVkoJHt5fWRlZylgO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5saXN0ZW5lciA9IGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihtb3ZlRXZlbnQsIChldmVudCkgPT4ge1xuICAgICAgaWYodGhpcy50aHJvdHRsZXIpIHJldHVybjtcblxuICAgICAgdGhpcy50aHJvdHRsZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcblxuICAgICAgICB0aGlzLnRocm90dGxlciA9IGZhbHNlO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGlmKGV2ZW50LnRhcmdldFRvdWNoZXMpIHRoaXMuaGFuZGxlTW92ZShldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFgsIGV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WSk7XG4gICAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVNb3ZlKGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIDUwKTtcblxuICAgIH0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIobW92ZUV2ZW50LCB0aGlzLmxpc3RlbmVyKTtcbiAgfTtcblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfTtcbn0iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cbmNvbnN0IHRpbWVvdXRNYXAgPSBuZXcgTWFwKCk7XG4gICAgICB0aW1lb3V0TWFwLnNldCgnIycsIDUwLzIpOyAvL2RlbGV0ZVxuICAgICAgdGltZW91dE1hcC5zZXQoJ0AnLCAyNTAvMik7IC8vcGF1c2VcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCcsJywgMzUwLzIpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJy0nLCAzNTAvMik7XG4gICAgICB0aW1lb3V0TWFwLnNldCgnLicsIDUwMC8yKTtcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCc/JywgNzUwLzIpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXcml0ZXIge1xuICBjb25zdHJ1Y3RvcihlbGVtZW50cywgc3RyaW5nKSB7XG4gICAgdGhpcy5lbCA9IGVsZW1lbnRzO1xuICAgIHRoaXMucyA9IHN0cmluZztcbiAgICB0aGlzLmlzV3JpdGluZ0xpbmsgPSBmYWxzZTtcbiAgfVxuXG4gIHVwZGF0ZVdyaXRlcnMoY2hhcmFjdGVyKSB7XG5cbiAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmVsLCAoZWxlbWVudCkgPT4ge1xuICAgICAgbGV0IG9sZEVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgZWxlbWVudCA9ICh0aGlzLmlzV3JpdGluZ0xpbmspID8gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhOmxhc3QtY2hpbGQnKSA6IGVsZW1lbnQ7XG5cbiAgICAgIGlmIChjaGFyYWN0ZXIgPT09ICdAJykgcmV0dXJuO1xuXG4gICAgICBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICcjJykge1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGVsZW1lbnQuaW5uZXJIVE1MLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgaWYob2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpLmxlbmd0aCA+IDApe1xuICAgICAgICAgIG9sZEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnLCBvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jykuc2xpY2UoMCwtMSkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVsc2UgaWYgKGNoYXJhY3RlciA9PT0gJyonKSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MICs9ICc8YnI+JztcbiAgICAgICAgb2xkRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcsIG9sZEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnKSArICdcXGEnKTtcbiAgICAgIH1cblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnJCcpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzV3JpdGluZ0xpbmspIHtcbiAgICAgICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXG4gICAgICAgICAgbGluay5ocmVmID0gdGhpcy5zLnNwbGl0KCckJylbMF07XG4gICAgICAgICAgbGluay50YXJnZXQgPSAnX2JsYW5rJztcblxuXG4gICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChsaW5rKTtcblxuICAgICAgICAgIHRoaXMuaXNXcml0aW5nTGluayA9IHRydWU7XG4gICAgICAgICAgdGhpcy5zID0gdGhpcy5zLnN1YnN0cmluZyh0aGlzLnMuc3BsaXQoJyQnKVswXS5sZW5ndGgrMSwgdGhpcy5zLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5pc1dyaXRpbmdMaW5rID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTCArPSBjaGFyYWN0ZXI7XG4gICAgICAgIG9sZEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnLCBvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0JykgKyBjaGFyYWN0ZXIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgd3JpdGVyKGJlUXVpY2spIHtcbiAgICBsZXQgdGV4dCwgbXNEZWxheTtcblxuICAgIGlmICh0aGlzLnMubGVuZ3RoID09PSAwKSByZXR1cm4gdGhpcy5pc0RvbmUoKTtcblxuICAgIHRleHQgPSB0aGlzLnMuc3Vic3RyaW5nKDAsMSk7XG4gICAgdGhpcy5zID0gIHRoaXMucy5zdWJzdHJpbmcoMSx0aGlzLnMubGVuZ3RoKTtcbiAgICB0aGlzLnVwZGF0ZVdyaXRlcnModGV4dCk7XG5cbiAgICBpZiAoYmVRdWljaykgICAgICAgICAgcmV0dXJuIHRoaXMud3JpdGVyKHRydWUpO1xuXG4gICAgbXNEZWxheSA9IHRpbWVvdXRNYXAuZ2V0KHRleHQpIHx8IE1hdGgucmFuZG9tKCkgKiAxNTA7XG5cbiAgICByZXR1cm4gc2V0VGltZW91dCgoKSA9PiB7dGhpcy53cml0ZXIoKX0sIG1zRGVsYXkpO1xuXG4gIH07XG5cbiAgdXBkYXRlTGFzdFJlYWQoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlYWQtZXZlcnl0aGluZy1hdCcsIERhdGUubm93KCkpO1xuICB9XG5cbiAgZ2V0IGdldExhc3RSZWFkKCkge1xuICAgIHJldHVybiBwYXJzZUludChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncmVhZC1ldmVyeXRoaW5nLWF0JykpO1xuICB9XG5cbiAgaXNEb25lKCkge1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgnaW50cm8taXMtZG9uZScpO1xuICAgIHRoaXMudXBkYXRlTGFzdFJlYWQoKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICgodGhpcy5nZXRMYXN0UmVhZCArIDUwMDApIDwgRGF0ZS5ub3coKSkge1xuICAgICAgdGhpcy51cGRhdGVMYXN0UmVhZCgpO1xuICAgICAgdGhpcy53cml0ZXIodHJ1ZSk7XG4gICAgICB0aGlzLmlzRG9uZSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMud3JpdGVyKCk7XG4gICAgfVxuICB9XG59Il19
