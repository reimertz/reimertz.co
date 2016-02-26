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
var ll = new _LazyLoader2.default({ selector: '[lazy-src]',
                            offset: document.body.getBoundingClientRect().height / 2,
                            lines: 5,
                            throttle: 300,
                            beStupidAndFakeSlowness: true,
                            checkOnLoad: false });

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
  function LazyLoader() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, LazyLoader);

    this.elements = [].slice.call(document.querySelectorAll(options.selector || '[lazy-src]'));
    this.offset = !!options.offset || document.body.getBoundingClientRect().height / 2;
    this.lines = !!options.lines || 3;
    this.throttle = !!options.throttle || 350;
    this.checkOnLoad = !!options.checkOnLoad || true;
    this.beStupidAndFakeSlowness = !!options.beStupidAndFakeSlowness || false;

    this._queue = [];
    this._listener = false;
    this._throttler = false;
    this._placeholderImages = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWAQMAAAAGz+OhAAAAA1BMVEUb/5DUIh99AAAAGklEQVR4Ae3BAQEAAAQDMP1TiwHfVgAAwHoNC7gAASist30AAAAASUVORK5CYII=', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWAQMAAABelSeRAAAAA1BMVEUb/5DUIh99AAAAHElEQVR4Xu3AAQkAAADCMPunNsdhWwoAAAAAABwW2gABlO2L2AAAAABJRU5ErkJggg=='];
  }

  _createClass(LazyLoader, [{
    key: 'fetchImage',
    value: function fetchImage(image) {
      var _this = this;

      image.src = image.getAttribute('lazy-src');
      image.setAttribute('lazy-status', 'fetching');
      image.addEventListener('load', function (event) {
        _this.imageLoaded(image);
      }, false);
    }
  }, {
    key: 'imageLoaded',
    value: function imageLoaded(loadedImage) {
      var imageToFetch = undefined;

      loadedImage.setAttribute('lazy-status', 'loaded');

      this._queue = this._queue.filter(function (element) {
        if (loadedImage !== element) return element;
      });

      imageToFetch = this._queue.shift();
      if (!!imageToFetch) {
        this.fetchImage(imageToFetch);
      }
    }
  }, {
    key: 'checkIfshouldFetchNow',
    value: function checkIfshouldFetchNow(element) {
      this._queue.push(element);

      if (this._queue.length <= this.lines) {
        this.fetchImage(element);
      }
    }
  }, {
    key: 'addImageToQueue',
    value: function addImageToQueue(element) {
      var _this2 = this;

      if (this.beStupidAndFakeSlowness && Math.random() > 0.66) {
        element.setAttribute('lazy-status', 'fetching');
        setTimeout(function () {
          _this2.checkIfshouldFetchNow(element);
        }, 5500 * Math.random() + 2000);
      } else {
        console.log('asdasdads');
        this.checkIfshouldFetchNow(element);
      }
    }
  }, {
    key: 'checkScroll',
    value: function checkScroll() {
      var _this3 = this;

      if (this._throttler) return;

      this._throttler = setTimeout(function () {
        _this3._throttler = false;

        if (_this3.elements.length === 0) return;
        _this3.elements = _this3.elements.map(function (element) {
          if (element === false) return false;

          if (element.getBoundingClientRect().top - _this3.offset < document.body.scrollTop) {
            _this3.addImageToQueue(element);
            return false;
          } else {
            return element;
          }
        });

        _this3.elements = _this3.elements.filter(function (element) {
          if (element) return element;
        });
      }, this.throttle);
    }
  }, {
    key: 'start',
    value: function start() {
      var _this4 = this;

      if (!!this._listener) return;
      if (this.checkOnLoad) this.checkScroll();

      this.elements.map(function (element) {
        if (!element.src || element.src === '') element.src = _this4._placeholderImages[Math.floor(Math.random() + 0.5)];
      });

      this._listener = document.addEventListener('scroll', function (event) {
        _this4.checkScroll();
      }, false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWNoby1qcy9zcmMvZWNoby5qcyIsInNyYy9zY3JpcHRzL21haW4taG9tZS5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvTGF6eUxvYWRlci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvUmlja1JvbGxlZC5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvVHJhbnNsYXRlci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvV3JpdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaklBLElBQU0sT0FBTyxRQUFRLFNBQVIsRUFBbUIsU0FBUyxJQUFULENBQTFCO0FBQ04sSUFBTSw2V0FBTjs7QUFRQSxJQUFNLFNBQVMscUJBQVcsU0FBUyxnQkFBVCxDQUEwQixTQUExQixDQUFYLEVBQWlELFNBQWpELENBQVQ7QUFDTixJQUFNLGFBQWEseUJBQWUsU0FBUyxhQUFULENBQXVCLE1BQXZCLENBQWYsRUFBK0MsRUFBL0MsRUFBbUQsRUFBbkQsQ0FBYjtBQUNOLElBQU0sS0FBSyx5QkFBZSxJQUFmLEVBQXFCLElBQXJCLEVBQTJCLFNBQVMsYUFBVCxDQUF1Qix3QkFBdkIsQ0FBM0IsQ0FBTDtBQUNOLElBQU0sS0FBSyx5QkFBZSxFQUFFLFVBQVUsWUFBVjtBQUNBLG9DQUFTLFNBQVMsSUFBVCxDQUFjLHFCQUFkLEdBQXNDLE1BQXRDLEdBQTZDLENBQTdDO0FBQ1QsbUNBQU8sQ0FBUDtBQUNBLHNDQUFVLEdBQVY7QUFDQSxxREFBeUIsSUFBekI7QUFDQSx5Q0FBYSxLQUFiLEVBTGpCLENBQUw7O0FBT04sc0JBQXNCLFlBQVU7QUFDOUIsbUNBQU8sS0FBUCxHQUQ4QjtBQUU5Qix1Q0FBVyxLQUFYLEdBRjhCO0FBRzlCLCtCQUFHLEtBQUgsR0FIOEI7QUFJOUIsK0JBQUcsS0FBSCxHQUo4QjtDQUFWLENBQXRCOzs7Ozs7Ozs7Ozs7Ozs7SUNwQnFCO0FBQ25CLFdBRG1CLFVBQ25CLEdBQTBCO1FBQWQsZ0VBQVUsa0JBQUk7OzBCQURQLFlBQ087O0FBRXhCLFNBQUssUUFBTCxHQUFnQixHQUFHLEtBQUgsQ0FBUyxJQUFULENBQWMsU0FBUyxnQkFBVCxDQUEwQixRQUFRLFFBQVIsSUFBb0IsWUFBcEIsQ0FBeEMsQ0FBaEIsQ0FGd0I7QUFHeEIsU0FBSyxNQUFMLEdBQWMsQ0FBQyxDQUFDLFFBQVEsTUFBUixJQUFtQixTQUFTLElBQVQsQ0FBYyxxQkFBZCxHQUFzQyxNQUF0QyxHQUE2QyxDQUE3QyxDQUhYO0FBSXhCLFNBQUssS0FBTCxHQUFhLENBQUMsQ0FBQyxRQUFRLEtBQVIsSUFBaUIsQ0FBbkIsQ0FKVztBQUt4QixTQUFLLFFBQUwsR0FBZ0IsQ0FBQyxDQUFDLFFBQVEsUUFBUixJQUFvQixHQUF0QixDQUxRO0FBTXhCLFNBQUssV0FBTCxHQUFtQixDQUFDLENBQUMsUUFBUSxXQUFSLElBQXVCLElBQXpCLENBTks7QUFPeEIsU0FBSyx1QkFBTCxHQUErQixDQUFDLENBQUMsUUFBUSx1QkFBUixJQUFtQyxLQUFyQyxDQVBQOztBQVN4QixTQUFLLE1BQUwsR0FBYyxFQUFkLENBVHdCO0FBVXhCLFNBQUssU0FBTCxHQUFpQixLQUFqQixDQVZ3QjtBQVd4QixTQUFLLFVBQUwsR0FBa0IsS0FBbEIsQ0FYd0I7QUFZeEIsU0FBSyxrQkFBTCxHQUEwQixDQUN4Qiw0SkFEd0IsRUFFeEIsZ0tBRndCLENBQTFCLENBWndCO0dBQTFCOztlQURtQjs7K0JBbUJSLE9BQU87OztBQUNoQixZQUFNLEdBQU4sR0FBWSxNQUFNLFlBQU4sQ0FBbUIsVUFBbkIsQ0FBWixDQURnQjtBQUVoQixZQUFNLFlBQU4sQ0FBbUIsYUFBbkIsRUFBa0MsVUFBbEMsRUFGZ0I7QUFHaEIsWUFBTSxnQkFBTixDQUF1QixNQUF2QixFQUErQixVQUFDLEtBQUQsRUFBVztBQUFDLGNBQUssV0FBTCxDQUFpQixLQUFqQixFQUFEO09BQVgsRUFBc0MsS0FBckUsRUFIZ0I7Ozs7Z0NBTU4sYUFBYTtBQUN2QixVQUFJLHdCQUFKLENBRHVCOztBQUd2QixrQkFBWSxZQUFaLENBQXlCLGFBQXpCLEVBQXdDLFFBQXhDLEVBSHVCOztBQUt2QixXQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLFVBQUMsT0FBRCxFQUFZO0FBQUMsWUFBRyxnQkFBZ0IsT0FBaEIsRUFBeUIsT0FBTyxPQUFQLENBQTVCO09BQWIsQ0FBakMsQ0FMdUI7O0FBT3ZCLHFCQUFlLEtBQUssTUFBTCxDQUFZLEtBQVosRUFBZixDQVB1QjtBQVF2QixVQUFHLENBQUMsQ0FBQyxZQUFELEVBQWU7QUFDakIsYUFBSyxVQUFMLENBQWdCLFlBQWhCLEVBRGlCO09BQW5COzs7OzBDQUtvQixTQUFTO0FBQzdCLFdBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsT0FBakIsRUFENkI7O0FBRzdCLFVBQUcsS0FBSyxNQUFMLENBQVksTUFBWixJQUFzQixLQUFLLEtBQUwsRUFBWTtBQUNuQyxhQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsRUFEbUM7T0FBckM7Ozs7b0NBS2MsU0FBUzs7O0FBQ3ZCLFVBQUcsS0FBSyx1QkFBTCxJQUFpQyxLQUFLLE1BQUwsS0FBZ0IsSUFBaEIsRUFBdUI7QUFDekQsZ0JBQVEsWUFBUixDQUFxQixhQUFyQixFQUFvQyxVQUFwQyxFQUR5RDtBQUV6RCxtQkFBVyxZQUFNO0FBQ2YsaUJBQUsscUJBQUwsQ0FBMkIsT0FBM0IsRUFEZTtTQUFOLEVBRVIsT0FBTyxLQUFLLE1BQUwsRUFBUCxHQUF1QixJQUF2QixDQUZILENBRnlEO09BQTNELE1BTUs7QUFDSCxnQkFBUSxHQUFSLENBQVksV0FBWixFQURHO0FBRUgsYUFBSyxxQkFBTCxDQUEyQixPQUEzQixFQUZHO09BTkw7Ozs7a0NBWVk7OztBQUNaLFVBQUcsS0FBSyxVQUFMLEVBQWlCLE9BQXBCOztBQUVBLFdBQUssVUFBTCxHQUFrQixXQUFXLFlBQU07QUFDL0IsZUFBSyxVQUFMLEdBQWtCLEtBQWxCLENBRCtCOztBQUlqQyxZQUFHLE9BQUssUUFBTCxDQUFjLE1BQWQsS0FBeUIsQ0FBekIsRUFBNEIsT0FBL0I7QUFDQSxlQUFLLFFBQUwsR0FBZ0IsT0FBSyxRQUFMLENBQWMsR0FBZCxDQUFrQixVQUFDLE9BQUQsRUFBYTtBQUM3QyxjQUFHLFlBQVksS0FBWixFQUFtQixPQUFPLEtBQVAsQ0FBdEI7O0FBRUEsY0FBRyxPQUFDLENBQVEscUJBQVIsR0FBZ0MsR0FBaEMsR0FBc0MsT0FBSyxNQUFMLEdBQWdCLFNBQVMsSUFBVCxDQUFjLFNBQWQsRUFBeUI7QUFDakYsbUJBQUssZUFBTCxDQUFxQixPQUFyQixFQURpRjtBQUVqRixtQkFBTyxLQUFQLENBRmlGO1dBQW5GLE1BS0s7QUFDSCxtQkFBTyxPQUFQLENBREc7V0FMTDtTQUhnQyxDQUFsQyxDQUxpQzs7QUFrQmpDLGVBQUssUUFBTCxHQUFnQixPQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLFVBQUMsT0FBRCxFQUFhO0FBQUUsY0FBRyxPQUFILEVBQVksT0FBTyxPQUFQLENBQVo7U0FBZixDQUFyQyxDQWxCaUM7T0FBTixFQW1CMUIsS0FBSyxRQUFMLENBbkJILENBSFk7Ozs7NEJBMEJOOzs7QUFDTixVQUFHLENBQUMsQ0FBQyxLQUFLLFNBQUwsRUFBZ0IsT0FBckI7QUFDQSxVQUFHLEtBQUssV0FBTCxFQUFrQixLQUFLLFdBQUwsR0FBckI7O0FBRUEsV0FBSyxRQUFMLENBQWMsR0FBZCxDQUFrQixVQUFDLE9BQUQsRUFBYTtBQUM3QixZQUFJLENBQUMsUUFBUSxHQUFSLElBQWUsUUFBUSxHQUFSLEtBQWdCLEVBQWhCLEVBQW9CLFFBQVEsR0FBUixHQUFjLE9BQUssa0JBQUwsQ0FBd0IsS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLEtBQWdCLEdBQWhCLENBQW5DLENBQWQsQ0FBeEM7T0FEZ0IsQ0FBbEIsQ0FKTTs7QUFRTixXQUFLLFNBQUwsR0FBaUIsU0FBUyxnQkFBVCxDQUEwQixRQUExQixFQUFvQyxVQUFDLEtBQUQsRUFBVztBQUFDLGVBQUssV0FBTCxHQUFEO09BQVgsRUFBaUMsS0FBckUsQ0FBakIsQ0FSTTs7OztTQXJGVzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRnJCLElBQU0sV0FBVyxDQUNmLENBQUMsZ0ZBQUQsRUFDQSx1RkFEQSxFQUVBLDBGQUZBLEVBR0Esa0ZBSEEsRUFJQSwwRkFKQSxFQUtBLG9GQUxBLEVBTUEsb0ZBTkEsRUFPQSxnR0FQQSxFQVFBLG9HQVJBLEVBU0EsaUZBVEEsRUFVQSw4RUFWQSxFQVdBLCtFQVhBLEVBWUEsNkZBWkEsRUFhQSxrR0FiQSxFQWNBLGtHQWRBLEVBZUEsaUdBZkEsRUFnQkEsa0dBaEJBLEVBaUJBLCtGQWpCQSxFQWtCQSwrRkFsQkEsRUFtQkEsK0ZBbkJBLEVBb0JBLGdHQXBCQSxFQXFCQSwrRkFyQkEsQ0FEZSxFQXdCZixDQUFDLGlGQUFELEVBQ0Esd0ZBREEsRUFFQSwyRkFGQSxFQUdBLG1GQUhBLEVBSUEsMkZBSkEsRUFLQSxxRkFMQSxFQU1BLHFGQU5BLEVBT0EsaUdBUEEsRUFRQSxrR0FSQSxFQVNBLGtGQVRBLEVBVUEsK0VBVkEsRUFXQSxnRkFYQSxFQVlBLDhGQVpBLEVBYUEsbUdBYkEsRUFjQSxtR0FkQSxFQWVBLGtHQWZBLEVBZ0JBLG1HQWhCQSxFQWlCQSxnR0FqQkEsRUFrQkEsZ0dBbEJBLEVBbUJBLGdHQW5CQSxFQW9CQSxpR0FwQkEsRUFxQkEsZ0dBckJBLENBeEJlLEVBK0NmLENBQUMsNkVBQUQsRUFDQSxvRkFEQSxFQUVBLHVGQUZBLEVBR0EsK0VBSEEsRUFJQSx1RkFKQSxFQUtBLGlGQUxBLEVBTUEsaUZBTkEsRUFPQSwwR0FQQSxFQVFBLGlHQVJBLEVBU0EsOEVBVEEsRUFVQSwyRUFWQSxFQVdBLDRFQVhBLEVBWUEsMEZBWkEsRUFhQSwrRkFiQSxFQWNBLCtGQWRBLENBL0NlLENBQVg7O0lBZ0VlO0FBRW5CLFdBRm1CLFVBRW5CLENBQVksS0FBWixFQUFtQixVQUFuQixFQUErQixPQUEvQixFQUF3QzswQkFGckIsWUFFcUI7O0FBQ3RDLFFBQUksT0FBSixFQUFhLEtBQUssRUFBTCxHQUFVLE9BQVYsQ0FBYixLQUNLO0FBQ0gsV0FBSyxFQUFMLEdBQVUsU0FBUyxhQUFULENBQXVCLFVBQXZCLENBRFA7S0FETDs7QUFLQSxTQUFLLEtBQUwsR0FBYSxDQUFiLENBTnNDO0FBT3RDLFNBQUssS0FBTCxHQUFhLFNBQVMsSUFBVCxDQVB5QjtBQVF0QyxTQUFLLFFBQUwsR0FBZ0IsS0FBaEIsQ0FSc0M7QUFTdEMsU0FBSyxVQUFMLEdBQWtCLGNBQWMsS0FBZCxDQVRvQjtHQUF4Qzs7ZUFGbUI7OzJCQWNaO0FBQ0wsV0FBSyxLQUFMLEdBQWEsQ0FBQyxLQUFLLEtBQUwsR0FBYSxDQUFiLENBQUQsR0FBbUIsU0FBUyxNQUFULENBRDNCOztBQUdMLFdBQUssRUFBTCxDQUFRLFNBQVIsR0FBb0IsRUFBcEIsQ0FISztBQUlMLFdBQUssRUFBTCxDQUFRLFNBQVIsR0FBb0IsU0FBUyxLQUFLLEtBQUwsQ0FBN0IsQ0FKSzs7QUFNTCxVQUFHLEtBQUssY0FBTCxFQUFxQixRQUFRLEdBQVIsQ0FBWSxTQUFTLEtBQUssS0FBTCxDQUFyQixFQUF4Qjs7Ozs0QkFHTTs7O0FBQ04sVUFBRyxLQUFLLFFBQUwsRUFBZSxPQUFsQjs7QUFFQSxVQUFHLEtBQUssVUFBTCxFQUFpQixLQUFLLEVBQUwsQ0FBUSxLQUFSLENBQWMsT0FBZCxHQUF3QixNQUF4QixDQUFwQjs7QUFFQSxXQUFLLFFBQUwsR0FBZ0IsWUFBWSxZQUFNO0FBQUMsY0FBSyxJQUFMLEdBQUQ7T0FBTixFQUFxQixLQUFLLEtBQUwsQ0FBakQsQ0FMTTs7OzsyQkFRRDtBQUNMLFVBQUcsQ0FBQyxLQUFLLFFBQUwsRUFBZSxPQUFuQjtBQUNBLG9CQUFjLEtBQUssUUFBTCxDQUFkLENBRks7QUFHTCxXQUFLLFFBQUwsR0FBZ0IsS0FBaEIsQ0FISzs7Ozs0QkFNQztBQUNOLFdBQUssSUFBTCxHQURNOzs7O1NBckNXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRXJCLElBQU0sV0FBVyw0QkFBNEIsSUFBNUIsQ0FBaUMsVUFBVSxTQUFWLENBQTVDO0lBQ0EsWUFBWSxXQUFXLFdBQVgsR0FBeUIsV0FBekI7O0lBRUc7QUFFbkIsV0FGbUIsVUFFbkIsQ0FBWSxPQUFaLEVBQXFCLFNBQXJCLEVBQWdDLFNBQWhDLEVBQTJDOzBCQUZ4QixZQUV3Qjs7QUFDekMsU0FBSyxTQUFMLEdBQWlCLFNBQWpCLENBRHlDO0FBRXpDLFNBQUssU0FBTCxHQUFpQixTQUFqQixDQUZ5QztBQUd6QyxTQUFLLEVBQUwsR0FBVSxPQUFWLENBSHlDO0FBSXpDLFNBQUssS0FBTCxHQUFhLEtBQWIsQ0FKeUM7QUFLekMsU0FBSyxTQUFMLEdBQWlCLEtBQWpCLENBTHlDO0dBQTNDOztlQUZtQjs7K0JBVVIsU0FBUyxTQUFRO0FBQzFCLFVBQUksSUFBSSxDQUFFLElBQUssVUFBVSxPQUFPLFdBQVAsQ0FBaEIsR0FBdUMsQ0FBQyxDQUFELEdBQU0sS0FBSyxTQUFMO1VBQ2xELElBQUksT0FBQyxHQUFVLE9BQU8sVUFBUCxHQUFxQixLQUFLLFNBQUwsQ0FGZDs7QUFJMUIsV0FBSyxFQUFMLENBQVEsS0FBUixDQUFjLFNBQWQsZ0JBQXFDLHNCQUFpQixVQUF0RCxDQUowQjs7Ozs0QkFPcEI7OztBQUNOLFdBQUssUUFBTCxHQUFnQixTQUFTLElBQVQsQ0FBYyxnQkFBZCxDQUErQixTQUEvQixFQUEwQyxVQUFDLEtBQUQsRUFBVztBQUNuRSxZQUFHLE1BQUssU0FBTCxFQUFnQixPQUFuQjs7QUFFQSxjQUFLLFNBQUwsR0FBaUIsV0FBVyxZQUFNOztBQUVoQyxnQkFBSyxTQUFMLEdBQWlCLEtBQWpCLENBRmdDO0FBR2hDLGdDQUFzQixZQUFNO0FBQzFCLGdCQUFHLE1BQU0sYUFBTixFQUFxQixNQUFLLFVBQUwsQ0FBZ0IsTUFBTSxhQUFOLENBQW9CLENBQXBCLEVBQXVCLE9BQXZCLEVBQWdDLE1BQU0sYUFBTixDQUFvQixDQUFwQixFQUF1QixPQUF2QixDQUFoRCxDQUF4QixLQUN3QixNQUFLLFVBQUwsQ0FBZ0IsTUFBTSxPQUFOLEVBQWUsTUFBTSxPQUFOLENBQS9CLENBRHhCO1dBRG9CLENBQXRCLENBSGdDO1NBQU4sRUFPekIsRUFQYyxDQUFqQixDQUhtRTtPQUFYLENBQTFELENBRE07Ozs7MkJBZ0JEO0FBQ0wsZUFBUyxJQUFULENBQWMsbUJBQWQsQ0FBa0MsU0FBbEMsRUFBNkMsS0FBSyxRQUFMLENBQTdDLENBREs7Ozs7NEJBSUM7QUFDTixXQUFLLElBQUwsR0FETTs7OztTQXJDVzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSHJCLElBQU0sYUFBYSxJQUFJLEdBQUosRUFBYjtBQUNBLFdBQVcsR0FBWCxDQUFlLEdBQWYsRUFBb0IsS0FBRyxDQUFILENBQXBCO0FBQ0EsV0FBVyxHQUFYLENBQWUsR0FBZixFQUFvQixNQUFJLENBQUosQ0FBcEI7QUFDQSxXQUFXLEdBQVgsQ0FBZSxHQUFmLEVBQW9CLE1BQUksQ0FBSixDQUFwQjtBQUNBLFdBQVcsR0FBWCxDQUFlLEdBQWYsRUFBb0IsTUFBSSxDQUFKLENBQXBCO0FBQ0EsV0FBVyxHQUFYLENBQWUsR0FBZixFQUFvQixNQUFJLENBQUosQ0FBcEI7QUFDQSxXQUFXLEdBQVgsQ0FBZSxHQUFmLEVBQW9CLE1BQUksQ0FBSixDQUFwQjs7SUFFZTtBQUNuQixXQURtQixNQUNuQixDQUFZLFFBQVosRUFBc0IsTUFBdEIsRUFBOEI7MEJBRFgsUUFDVzs7QUFDNUIsU0FBSyxFQUFMLEdBQVUsUUFBVixDQUQ0QjtBQUU1QixTQUFLLENBQUwsR0FBUyxNQUFULENBRjRCO0FBRzVCLFNBQUssYUFBTCxHQUFxQixLQUFyQixDQUg0QjtHQUE5Qjs7ZUFEbUI7O2tDQU9MLFdBQVc7OztBQUV4QixTQUFHLE9BQUgsQ0FBVyxJQUFYLENBQWdCLEtBQUssRUFBTCxFQUFTLFVBQUMsT0FBRCxFQUFhO0FBQ25DLFlBQUksYUFBYSxPQUFiLENBRCtCO0FBRW5DLGtCQUFVLEtBQUMsQ0FBSyxhQUFMLEdBQXNCLFFBQVEsYUFBUixDQUFzQixjQUF0QixDQUF2QixHQUErRCxPQUEvRCxDQUZ5Qjs7QUFJbkMsWUFBSSxjQUFjLEdBQWQsRUFBbUIsT0FBdkIsS0FFSyxJQUFJLGNBQWMsR0FBZCxFQUFtQjtBQUMxQixrQkFBUSxTQUFSLEdBQW9CLFFBQVEsU0FBUixDQUFrQixLQUFsQixDQUF3QixDQUF4QixFQUEyQixDQUFDLENBQUQsQ0FBL0MsQ0FEMEI7QUFFMUIsY0FBRyxXQUFXLFlBQVgsQ0FBd0IsY0FBeEIsRUFBd0MsTUFBeEMsR0FBaUQsQ0FBakQsRUFBbUQ7QUFDcEQsdUJBQVcsWUFBWCxDQUF3QixjQUF4QixFQUF3QyxXQUFXLFlBQVgsQ0FBd0IsY0FBeEIsRUFBd0MsS0FBeEMsQ0FBOEMsQ0FBOUMsRUFBZ0QsQ0FBQyxDQUFELENBQXhGLEVBRG9EO1dBQXREO1NBRkcsTUFPQSxJQUFJLGNBQWMsR0FBZCxFQUFtQjtBQUMxQixrQkFBUSxTQUFSLElBQXFCLE1BQXJCLENBRDBCO0FBRTFCLHFCQUFXLFlBQVgsQ0FBd0IsY0FBeEIsRUFBd0MsV0FBVyxZQUFYLENBQXdCLGNBQXhCLElBQTBDLElBQTFDLENBQXhDLENBRjBCO1NBQXZCLE1BS0EsSUFBSSxjQUFjLEdBQWQsRUFBbUI7QUFDMUIsY0FBSSxDQUFDLE1BQUssYUFBTCxFQUFvQjtBQUN2QixnQkFBSSxPQUFPLFNBQVMsYUFBVCxDQUF1QixHQUF2QixDQUFQLENBRG1COztBQUd2QixpQkFBSyxJQUFMLEdBQVksTUFBSyxDQUFMLENBQU8sS0FBUCxDQUFhLEdBQWIsRUFBa0IsQ0FBbEIsQ0FBWixDQUh1QjtBQUl2QixpQkFBSyxNQUFMLEdBQWMsUUFBZCxDQUp1Qjs7QUFPdkIsb0JBQVEsV0FBUixDQUFvQixJQUFwQixFQVB1Qjs7QUFTdkIsa0JBQUssYUFBTCxHQUFxQixJQUFyQixDQVR1QjtBQVV2QixrQkFBSyxDQUFMLEdBQVMsTUFBSyxDQUFMLENBQU8sU0FBUCxDQUFpQixNQUFLLENBQUwsQ0FBTyxLQUFQLENBQWEsR0FBYixFQUFrQixDQUFsQixFQUFxQixNQUFyQixHQUE0QixDQUE1QixFQUErQixNQUFLLENBQUwsQ0FBTyxNQUFQLENBQXpELENBVnVCO1dBQXpCLE1BWUs7QUFDSCxrQkFBSyxhQUFMLEdBQXFCLEtBQXJCLENBREc7V0FaTDtTQURHLE1BaUJBO0FBQ0gsa0JBQVEsU0FBUixJQUFxQixTQUFyQixDQURHO0FBRUgscUJBQVcsWUFBWCxDQUF3QixjQUF4QixFQUF3QyxXQUFXLFlBQVgsQ0FBd0IsY0FBeEIsSUFBMEMsU0FBMUMsQ0FBeEMsQ0FGRztTQWpCQTtPQWxCaUIsQ0FBekIsQ0FGd0I7Ozs7MkJBNENsQixTQUFTOzs7QUFDZCxVQUFJLGdCQUFKO1VBQVUsbUJBQVYsQ0FEYzs7QUFHZCxVQUFJLEtBQUssQ0FBTCxDQUFPLE1BQVAsS0FBa0IsQ0FBbEIsRUFBcUIsT0FBTyxLQUFLLE1BQUwsRUFBUCxDQUF6Qjs7QUFFQSxhQUFPLEtBQUssQ0FBTCxDQUFPLFNBQVAsQ0FBaUIsQ0FBakIsRUFBbUIsQ0FBbkIsQ0FBUCxDQUxjO0FBTWQsV0FBSyxDQUFMLEdBQVUsS0FBSyxDQUFMLENBQU8sU0FBUCxDQUFpQixDQUFqQixFQUFtQixLQUFLLENBQUwsQ0FBTyxNQUFQLENBQTdCLENBTmM7QUFPZCxXQUFLLGFBQUwsQ0FBbUIsSUFBbkIsRUFQYzs7QUFTZCxVQUFJLE9BQUosRUFBc0IsT0FBTyxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQVAsQ0FBdEI7O0FBRUEsZ0JBQVUsV0FBVyxHQUFYLENBQWUsSUFBZixLQUF3QixLQUFLLE1BQUwsS0FBZ0IsR0FBaEIsQ0FYcEI7O0FBYWQsYUFBTyxXQUFXLFlBQU07QUFBQyxlQUFLLE1BQUwsR0FBRDtPQUFOLEVBQXVCLE9BQWxDLENBQVAsQ0FiYzs7OztxQ0FpQkM7QUFDZixtQkFBYSxPQUFiLENBQXFCLG9CQUFyQixFQUEyQyxLQUFLLEdBQUwsRUFBM0MsRUFEZTs7Ozs2QkFRUjtBQUNQLGVBQVMsSUFBVCxDQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsZUFBNUIsRUFETztBQUVQLFdBQUssY0FBTCxHQUZPOzs7OzRCQUtEO0FBQ04sVUFBSSxJQUFDLENBQUssV0FBTCxHQUFtQixJQUFuQixHQUEyQixLQUFLLEdBQUwsRUFBNUIsRUFBd0M7QUFDMUMsYUFBSyxjQUFMLEdBRDBDO0FBRTFDLGFBQUssTUFBTCxDQUFZLElBQVosRUFGMEM7QUFHMUMsYUFBSyxNQUFMLEdBSDBDO09BQTVDLE1BS0s7QUFDSCxhQUFLLE1BQUwsR0FERztPQUxMOzs7O3dCQVZnQjtBQUNoQixhQUFPLFNBQVMsYUFBYSxPQUFiLENBQXFCLG9CQUFyQixDQUFULENBQVAsQ0FEZ0I7Ozs7U0F4RUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZmFjdG9yeShyb290KTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5lY2hvID0gZmFjdG9yeShyb290KTtcbiAgfVxufSkodGhpcywgZnVuY3Rpb24gKHJvb3QpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGVjaG8gPSB7fTtcblxuICB2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcblxuICB2YXIgb2Zmc2V0LCBwb2xsLCBkZWxheSwgdXNlRGVib3VuY2UsIHVubG9hZDtcblxuICB2YXIgaXNIaWRkZW4gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHJldHVybiAoZWxlbWVudC5vZmZzZXRQYXJlbnQgPT09IG51bGwpO1xuICB9O1xuICBcbiAgdmFyIGluVmlldyA9IGZ1bmN0aW9uIChlbGVtZW50LCB2aWV3KSB7XG4gICAgaWYgKGlzSGlkZGVuKGVsZW1lbnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGJveCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIChib3gucmlnaHQgPj0gdmlldy5sICYmIGJveC5ib3R0b20gPj0gdmlldy50ICYmIGJveC5sZWZ0IDw9IHZpZXcuciAmJiBib3gudG9wIDw9IHZpZXcuYik7XG4gIH07XG5cbiAgdmFyIGRlYm91bmNlT3JUaHJvdHRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZighdXNlRGVib3VuY2UgJiYgISFwb2xsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNsZWFyVGltZW91dChwb2xsKTtcbiAgICBwb2xsID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgZWNoby5yZW5kZXIoKTtcbiAgICAgIHBvbGwgPSBudWxsO1xuICAgIH0sIGRlbGF5KTtcbiAgfTtcblxuICBlY2hvLmluaXQgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgIHZhciBvZmZzZXRBbGwgPSBvcHRzLm9mZnNldCB8fCAwO1xuICAgIHZhciBvZmZzZXRWZXJ0aWNhbCA9IG9wdHMub2Zmc2V0VmVydGljYWwgfHwgb2Zmc2V0QWxsO1xuICAgIHZhciBvZmZzZXRIb3Jpem9udGFsID0gb3B0cy5vZmZzZXRIb3Jpem9udGFsIHx8IG9mZnNldEFsbDtcbiAgICB2YXIgb3B0aW9uVG9JbnQgPSBmdW5jdGlvbiAob3B0LCBmYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KG9wdCB8fCBmYWxsYmFjaywgMTApO1xuICAgIH07XG4gICAgb2Zmc2V0ID0ge1xuICAgICAgdDogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRUb3AsIG9mZnNldFZlcnRpY2FsKSxcbiAgICAgIGI6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0Qm90dG9tLCBvZmZzZXRWZXJ0aWNhbCksXG4gICAgICBsOiBvcHRpb25Ub0ludChvcHRzLm9mZnNldExlZnQsIG9mZnNldEhvcml6b250YWwpLFxuICAgICAgcjogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRSaWdodCwgb2Zmc2V0SG9yaXpvbnRhbClcbiAgICB9O1xuICAgIGRlbGF5ID0gb3B0aW9uVG9JbnQob3B0cy50aHJvdHRsZSwgMjUwKTtcbiAgICB1c2VEZWJvdW5jZSA9IG9wdHMuZGVib3VuY2UgIT09IGZhbHNlO1xuICAgIHVubG9hZCA9ICEhb3B0cy51bmxvYWQ7XG4gICAgY2FsbGJhY2sgPSBvcHRzLmNhbGxiYWNrIHx8IGNhbGxiYWNrO1xuICAgIGVjaG8ucmVuZGVyKCk7XG4gICAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlLCBmYWxzZSk7XG4gICAgICByb290LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBkZWJvdW5jZU9yVGhyb3R0bGUsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdC5hdHRhY2hFdmVudCgnb25zY3JvbGwnLCBkZWJvdW5jZU9yVGhyb3R0bGUpO1xuICAgICAgcm9vdC5hdHRhY2hFdmVudCgnb25sb2FkJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICB9XG4gIH07XG5cbiAgZWNoby5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nW2RhdGEtZWNob10sIFtkYXRhLWVjaG8tYmFja2dyb3VuZF0nKTtcbiAgICB2YXIgbGVuZ3RoID0gbm9kZXMubGVuZ3RoO1xuICAgIHZhciBzcmMsIGVsZW07XG4gICAgdmFyIHZpZXcgPSB7XG4gICAgICBsOiAwIC0gb2Zmc2V0LmwsXG4gICAgICB0OiAwIC0gb2Zmc2V0LnQsXG4gICAgICBiOiAocm9vdC5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSArIG9mZnNldC5iLFxuICAgICAgcjogKHJvb3QuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpICsgb2Zmc2V0LnJcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGVsZW0gPSBub2Rlc1tpXTtcbiAgICAgIGlmIChpblZpZXcoZWxlbSwgdmlldykpIHtcblxuICAgICAgICBpZiAodW5sb2FkKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1wbGFjZWhvbGRlcicsIGVsZW0uc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKSAhPT0gbnVsbCkge1xuICAgICAgICAgIGVsZW0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKSArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVsZW0uc3JjID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNobycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1bmxvYWQpIHtcbiAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1lY2hvJyk7XG4gICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayhlbGVtLCAnbG9hZCcpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodW5sb2FkICYmICEhKHNyYyA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tcGxhY2Vob2xkZXInKSkpIHtcblxuICAgICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJykgIT09IG51bGwpIHtcbiAgICAgICAgICBlbGVtLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgc3JjICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbS5zcmMgPSBzcmM7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1lY2hvLXBsYWNlaG9sZGVyJyk7XG4gICAgICAgIGNhbGxiYWNrKGVsZW0sICd1bmxvYWQnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgIGVjaG8uZGV0YWNoKCk7XG4gICAgfVxuICB9O1xuXG4gIGVjaG8uZGV0YWNoID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gICAgICByb290LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QuZGV0YWNoRXZlbnQoJ29uc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0KHBvbGwpO1xuICB9O1xuXG4gIHJldHVybiBlY2hvO1xuXG59KTtcbiIsImltcG9ydCBXcml0ZXIgZnJvbSAnLi9tb2R1bGVzL1dyaXRlcic7XG5pbXBvcnQgVHJhbnNsYXRlciBmcm9tICcuL21vZHVsZXMvVHJhbnNsYXRlcic7XG5pbXBvcnQgUmlja1JvbGxlZCBmcm9tICcuL21vZHVsZXMvUmlja1JvbGxlZCc7XG5pbXBvcnQgTGF6eUxvYWRlciBmcm9tICcuL21vZHVsZXMvTGF6eUxvYWRlcic7XG5cbmNvbnN0IGVjaG8gPSByZXF1aXJlKCdlY2hvLWpzJykoZG9jdW1lbnQuYm9keSk7XG5jb25zdCBpbnRyb1RleHQgPSBgaGksIG15IG5hbWUgaXMgcGnDqXJyZSByZWltZXJ0ei5cblxuaSBhbSBhIGh1bWJsZSBkZXZlbG9wZXJAQEAjIyMjIyMjIyNtYWdpY2lhbkBAQCMjIyMjIyMjY29kZXIsIGRlc2lnbmVyLCBmYWtlLWl0LXRpbC15b3UtbWFrZS1pdCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjZW50cmVwcmVuZXVyIGFuZCBldmVyeWRheSBodXN0bGVyLlxuZXh0cmVtZWx5IGFkZGljdGVkIG9mIGJ1aWxkaW5nIHRoaW5ncy5cblxuJGh0dHA6Ly9naXRodWIuY29tL3JlaW1lcnR6JGdpdGh1YiQgfCAkaHR0cDovL3R3aXR0ZXIuY29tL3JlaW1lcnR6JHR3aXR0ZXIkIHwgJG1haWx0bzpwaWVycmUucmVpbWVydHpAZ21haWwuY29tJGhpcmUgbWUkIGA7XG5cblxuY29uc3Qgd3JpdGVyID0gbmV3IFdyaXRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud3JpdGVyJyksIGludHJvVGV4dCk7XG5jb25zdCB0cmFuc2xhdGVyID0gbmV3IFRyYW5zbGF0ZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpLCAxMCwgMTUpO1xuY29uc3QgcnIgPSBuZXcgUmlja1JvbGxlZCg1MDAwLCB0cnVlLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhbGwtbXktc2VjcmV0LWFwaS1rZXlzJykpO1xuY29uc3QgbGwgPSBuZXcgTGF6eUxvYWRlcih7IHNlbGVjdG9yOiAnW2xhenktc3JjXScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiAoZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQvMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXM6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGU6IDMwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZVN0dXBpZEFuZEZha2VTbG93bmVzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja09uTG9hZDogZmFsc2V9KTtcblxucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7XG4gIHdyaXRlci5zdGFydCgpO1xuICB0cmFuc2xhdGVyLnN0YXJ0KCk7XG4gIHJyLnN0YXJ0KCk7XG4gIGxsLnN0YXJ0KCk7XG59KTtcblxuXG4iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXp5TG9hZGVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cbiAgICB0aGlzLmVsZW1lbnRzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IgfHwgJ1tsYXp5LXNyY10nKSk7XG4gICAgdGhpcy5vZmZzZXQgPSAhIW9wdGlvbnMub2Zmc2V0IHx8IChkb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodC8yKTtcbiAgICB0aGlzLmxpbmVzID0gISFvcHRpb25zLmxpbmVzIHx8IDM7XG4gICAgdGhpcy50aHJvdHRsZSA9ICEhb3B0aW9ucy50aHJvdHRsZSB8fCAzNTA7XG4gICAgdGhpcy5jaGVja09uTG9hZCA9ICEhb3B0aW9ucy5jaGVja09uTG9hZCB8fCB0cnVlO1xuICAgIHRoaXMuYmVTdHVwaWRBbmRGYWtlU2xvd25lc3MgPSAhIW9wdGlvbnMuYmVTdHVwaWRBbmRGYWtlU2xvd25lc3MgfHwgZmFsc2U7XG5cbiAgICB0aGlzLl9xdWV1ZSA9IFtdO1xuICAgIHRoaXMuX2xpc3RlbmVyID0gZmFsc2U7XG4gICAgdGhpcy5fdGhyb3R0bGVyID0gZmFsc2U7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXJJbWFnZXMgPSBbXG4gICAgICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFKWUFBQUNXQVFNQUFBQUd6K09oQUFBQUExQk1WRVViLzVEVUloOTlBQUFBR2tsRVFWUjRBZTNCQVFFQUFBUURNUDFUaXdIZlZnQUF3SG9OQzdnQUFTaXN0MzBBQUFBQVNVVk9SSzVDWUlJPScsXG4gICAgICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFTd0FBQUNXQVFNQUFBQmVsU2VSQUFBQUExQk1WRVViLzVEVUloOTlBQUFBSEVsRVFWUjRYdTNBQVFrQUFBRENNUHVuTnNkaFd3b0FBQUFBQUJ3VzJnQUJsTzJMMkFBQUFBQkpSVTVFcmtKZ2dnPT0nXG4gICAgXTtcbiAgfVxuXG4gIGZldGNoSW1hZ2UoaW1hZ2UpIHtcbiAgICBpbWFnZS5zcmMgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ2xhenktc3JjJyk7XG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdsYXp5LXN0YXR1cycsICdmZXRjaGluZycpO1xuICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHt0aGlzLmltYWdlTG9hZGVkKGltYWdlKX0sIGZhbHNlKTtcbiAgfVxuXG4gIGltYWdlTG9hZGVkKGxvYWRlZEltYWdlKSB7XG4gICAgbGV0IGltYWdlVG9GZXRjaDtcblxuICAgIGxvYWRlZEltYWdlLnNldEF0dHJpYnV0ZSgnbGF6eS1zdGF0dXMnLCAnbG9hZGVkJyk7XG5cbiAgICB0aGlzLl9xdWV1ZSA9IHRoaXMuX3F1ZXVlLmZpbHRlcigoZWxlbWVudCk9PiB7aWYobG9hZGVkSW1hZ2UgIT09IGVsZW1lbnQpIHJldHVybiBlbGVtZW50fSk7XG5cbiAgICBpbWFnZVRvRmV0Y2ggPSB0aGlzLl9xdWV1ZS5zaGlmdCgpO1xuICAgIGlmKCEhaW1hZ2VUb0ZldGNoKSB7XG4gICAgICB0aGlzLmZldGNoSW1hZ2UoaW1hZ2VUb0ZldGNoKTtcbiAgICB9XG4gIH1cblxuICBjaGVja0lmc2hvdWxkRmV0Y2hOb3coZWxlbWVudCkge1xuICAgIHRoaXMuX3F1ZXVlLnB1c2goZWxlbWVudCk7XG5cbiAgICBpZih0aGlzLl9xdWV1ZS5sZW5ndGggPD0gdGhpcy5saW5lcykge1xuICAgICAgdGhpcy5mZXRjaEltYWdlKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIGFkZEltYWdlVG9RdWV1ZShlbGVtZW50KSB7XG4gICAgaWYodGhpcy5iZVN0dXBpZEFuZEZha2VTbG93bmVzcyAmJiAoTWF0aC5yYW5kb20oKSA+IDAuNjYpKSB7XG4gICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnbGF6eS1zdGF0dXMnLCAnZmV0Y2hpbmcnKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmNoZWNrSWZzaG91bGRGZXRjaE5vdyhlbGVtZW50KTtcbiAgICAgIH0sIDU1MDAgKiBNYXRoLnJhbmRvbSgpICsgMjAwMCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2FzZGFzZGFkcycpO1xuICAgICAgdGhpcy5jaGVja0lmc2hvdWxkRmV0Y2hOb3coZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tTY3JvbGwoKSB7XG4gICAgaWYodGhpcy5fdGhyb3R0bGVyKSByZXR1cm47XG5cbiAgICB0aGlzLl90aHJvdHRsZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5fdGhyb3R0bGVyID0gZmFsc2U7XG5cblxuICAgICAgaWYodGhpcy5lbGVtZW50cy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAgIHRoaXMuZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzLm1hcCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBpZihlbGVtZW50ID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGlmKChlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIHRoaXMub2Zmc2V0KSAgPCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkge1xuICAgICAgICAgIHRoaXMuYWRkSW1hZ2VUb1F1ZXVlKGVsZW1lbnQpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlbGVtZW50XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmVsZW1lbnRzID0gdGhpcy5lbGVtZW50cy5maWx0ZXIoKGVsZW1lbnQpID0+IHsgaWYoZWxlbWVudCkgcmV0dXJuIGVsZW1lbnQgfSk7XG4gICAgfSwgdGhpcy50aHJvdHRsZSk7XG5cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmKCEhdGhpcy5fbGlzdGVuZXIpIHJldHVybjtcbiAgICBpZih0aGlzLmNoZWNrT25Mb2FkKSB0aGlzLmNoZWNrU2Nyb2xsKCk7XG5cbiAgICB0aGlzLmVsZW1lbnRzLm1hcCgoZWxlbWVudCkgPT4ge1xuICAgICAgaWYgKCFlbGVtZW50LnNyYyB8fCBlbGVtZW50LnNyYyA9PT0gJycpIGVsZW1lbnQuc3JjID0gdGhpcy5fcGxhY2Vob2xkZXJJbWFnZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICsgMC41KV1cbiAgICB9KTtcblxuICAgIHRoaXMuX2xpc3RlbmVyID0gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKGV2ZW50KSA9PiB7dGhpcy5jaGVja1Njcm9sbCgpfSwgZmFsc2UpO1xuICB9XG59IiwiLy9DcmVhdG9yIFBpZXJyZSBSZWltZXJ0eiBNSVQgRVRDIEVUQ1xuXG5jb25zdCBtZFJvbGxlZCA9IFtcbiAgW1wiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLiwtfn4nJycnJycnfn4tLSwsX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC1+JyctLDo6Ojo6Ojo6Ojo6Ojo6Ojo6OjonJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLH4nJzo6Ojo6Ojo6Jyw6Ojo6Ojo6IDo6Ojo6Ojo6Ojo6Ojp8JyxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojo6LC1+JycnX19fJycnJ35+LS1+JycnOn1cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nfDo6Ojo6fDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6Onw6IDogOi1+fi0tLTogOiA6IC0tLS0tOiB8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4oXycnfi0nOiA6IDogOm86IDogOnw6IDpvOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nJyd+LSx8OiA6IDogOiA6IDogfi0tLSc6IDogOiA6LCctLU5FVkEgR0FITlxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58LDogOiA6IDogOiA6LX5+LS06IDogOjovIC0tLS0tIEdJVkUgWU9VIFVIUFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC0nJ1xcJzpcXDogOid+LCxfOiA6IDogOiA6IF8sLSdcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLl9fLC0nOzs7OztcXDonJy0sOiA6IDogOid+LS0tficnL3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLl9fLC1+Jyc7Ozs7OzsvOzs7Ozs7O1xcOiA6XFw6IDogOl9fX18vOiA6JyxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLC1+fn4nJycnXzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLC4gLicnLSw6fDo6Ojo6Ojp8LiAuIHw7Ozs7JyctLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7XFwuIC4gLicnfDo6Ojo6Ojo6fC4gLiwnOzs7Ozs7Ozs7OycnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLCcgOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7XFwuIC4gLlxcOjo6OjosJy4gLi98Ozs7Ozs7Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLC0nJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozs7OzsnLDogOiA6fF9ffC4gLiAufDs7Ozs7Ozs7OywnOzt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4sLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLDs7Ozs7Ozs7Ozs7IFxcLiAuIHw6Ojp8LiAuIC4nJyw7Ozs7Ozs7O3w7Oy9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7OyA7OztcXC4gLnw6Ojp8LiAuIC4gfDs7Ozs7Ozs7fC9cXG5cIixcbiAgXCIuLi4uLi4uLi87OywtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssJzs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7OzsgOzs7fC4gLlxcOi8uIC4gLiAufDs7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OycnLDogfDt8LiAuIC4gLiBcXDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLix+Jyc7Ozs7Ozs7Ozs7IDs7Ozs7Ozs7Ozs7LC0nJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7O3wufDt8LiAuIC4gLiAufDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLH4nJzs7Ozs7Ozs7Ozs7Ozs7IDs7Ozs7Ozs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLDs7Ozs7O3wgfDp8LiAuIC4gLiB8XFw7Ozs7Ozs7fFwiXSxcblxuICBbXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLiwtfn4nJycnJycnfn4tLSwsX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtficnLSw6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sficnOjo6Ojo6OjonLDo6Ojo6OjogOjo6Ojo6Ojo6Ojo6OnwnLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojo6LC1+JycnX19fJycnJ35+LS1+JycnOn1cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJ3w6Ojo6Onw6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6fDogOiA6LX5+LS0tOiA6IDogLS0tLS06IHxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4oXycnfi0nOiA6IDogOm86IDogOnw6IDpvOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJycnfi0sfDogOiA6IDogOiA6IH4tLS0nOiA6IDogOiwnLS1ORVZBIEdBSE5cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gTEVUIFUgRFdOXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC0nJ1xcJzpcXDogOid+LCxfOiA6IDogOiA6IF8sLSdcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi5fXywtJzs7Ozs7XFw6JyctLDogOiA6IDonfi0tLX4nJy98XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLC1+fn4nJycnXzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLC4gLicnLSw6fDo6Ojo6Ojp8LiAuIHw7Ozs7JyctLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7O1xcLiAuIC4nJ3w6Ojo6Ojo6OnwuIC4sJzs7Ozs7Ozs7OzsnJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLC0nJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozs7OzsnLDogOiA6fF9ffC4gLiAufDs7Ozs7Ozs7OywnOzt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Jyw7Ozs7Ozs7Ozs7OyBcXC4gLiB8Ojo6fC4gLiAuJycsOzs7Ozs7Ozt8OzsvXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7IDs7O1xcLiAufDo6OnwuIC4gLiB8Ozs7Ozs7Ozt8L1xcblwiLFxuICBcIi4uLi4uLi4uLi87OywtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssJzs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7OzsgOzs7fC4gLlxcOi8uIC4gLiAufDs7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IDs7Ozs7OzsnJyw6IHw7fC4gLiAuIC4gXFw7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLH4nJzs7Ozs7Ozs7OzsgOzs7Ozs7Ozs7OzssLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7fC58O3wuIC4gLiAuIC58Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLH4nJzs7Ozs7Ozs7Ozs7Ozs7IDs7Ozs7Ozs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLDs7Ozs7O3wgfDp8LiAuIC4gLiB8XFw7Ozs7Ozs7fFwiXSxcblxuICBbXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLX4nJy0sOjo6Ojo6Ojo6Ojo6Ojo6Ojo6OicnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sficnOjo6Ojo6OjonLDo6Ojo6OjogOjo6Ojo6Ojo6Ojo6OnwnLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLid8Ojo6Ojp8OiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6fDogOiA6LX5+LS0tOiA6IDogLS0tLS06IHxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLicnJ34tLHw6IDogOiA6IDogOiB+LS0tJzogOiA6IDosJy0tTkVWQSBHQUhOIFRVUk4gQUhST1VORFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58LDogOiA6IDogOiA6LX5+LS06IDogOjovIC0tLS0tIEFORCBERVNFUlQgVVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC0nJ1xcJzpcXDogOid+LCxfOiA6IDogOiA6IF8sLSdcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLl9fLC0nOzs7OztcXDonJy0sOiA6IDogOid+LS0tficnL3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLl9fLC1+Jyc7Ozs7OzsvOzs7Ozs7O1xcOiA6XFw6IDogOl9fX18vOiA6JyxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLC1+fn4nJycnXzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLC4gLicnLSw6fDo6Ojo6Ojp8LiAuIHw7Ozs7JyctLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7XFwuIC4gLicnfDo6Ojo6Ojo6fC4gLiwnOzs7Ozs7Ozs7OycnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLCcgOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7XFwuIC4gLlxcOjo6OjosJy4gLi98Ozs7Ozs7Ozs7Ozs7O3xcXG5cIl1cbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJpY2tSb2xsZWQge1xuXG4gIGNvbnN0cnVjdG9yKGRlbGF5LCBzaG91bGRIaWRlLCBlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQpIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgIGVsc2Uge1xuICAgICAgdGhpcy5lbCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQucGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICB0aGlzLmluZGV4ID0gMDtcbiAgICB0aGlzLmRlbGF5ID0gZGVsYXkgfHwgMzAwMDtcbiAgICB0aGlzLmludGVydmFsID0gZmFsc2U7XG4gICAgdGhpcy5zaG91bGRIaWRlID0gc2hvdWxkSGlkZSB8fCBmYWxzZTtcbiAgfVxuXG4gIHN3YXAoKSB7XG4gICAgdGhpcy5pbmRleCA9ICh0aGlzLmluZGV4ICsgMSkgJSBtZFJvbGxlZC5sZW5ndGg7XG5cbiAgICB0aGlzLmVsLmlubmVySFRNTCA9ICcnO1xuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gbWRSb2xsZWRbdGhpcy5pbmRleF07XG5cbiAgICBpZih0aGlzLnByaW50VG9Db25zb2xlKSBjb25zb2xlLmxvZyhtZFJvbGxlZFt0aGlzLmluZGV4XSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZih0aGlzLmludGVydmFsKSByZXR1cm47XG5cbiAgICBpZih0aGlzLnNob3VsZEhpZGUpIHRoaXMuZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7dGhpcy5zd2FwKCl9LCB0aGlzLmRlbGF5KTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYoIXRoaXMuaW50ZXJ2YWwpIHJldHVybjtcbiAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBmYWxzZTtcbiAgfVxuXG4gIHBhdXNlKCkge1xuICAgIHRoaXMuc3RvcCgpO1xuICB9XG59XG4iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cbmNvbnN0IGlzTW9iaWxlID0gL2lQaG9uZXxpUGFkfGlQb2R8QW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXG4gICAgICBtb3ZlRXZlbnQgPSBpc01vYmlsZSA/ICd0b3VjaG1vdmUnIDogJ21vdXNlbW92ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYW5zbGF0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnQsIHhSb3RhdGlvbiwgeVJvdGF0aW9uKSB7XG4gICAgdGhpcy54Um90YXRpb24gPSB4Um90YXRpb247XG4gICAgdGhpcy55Um90YXRpb24gPSB5Um90YXRpb247XG4gICAgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5mcmFtZSA9IGZhbHNlO1xuICAgIHRoaXMudGhyb3R0bGVyID0gZmFsc2U7XG4gIH1cblxuICBoYW5kbGVNb3ZlKGNsaWVudFgsIGNsaWVudFkpe1xuICAgIGxldCB4ID0gKCgxIC0gKGNsaWVudFkgLyB3aW5kb3cuaW5uZXJIZWlnaHQpKSAqIC0xKSAqIHRoaXMueFJvdGF0aW9uLFxuICAgICAgICB5ID0gKGNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiB0aGlzLnlSb3RhdGlvbjtcblxuICAgIHRoaXMuZWwuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZVgoJHt4fWRlZykgcm90YXRlWSgke3l9ZGVnKWA7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICB0aGlzLmxpc3RlbmVyID0gZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKG1vdmVFdmVudCwgKGV2ZW50KSA9PiB7XG4gICAgICBpZih0aGlzLnRocm90dGxlcikgcmV0dXJuO1xuXG4gICAgICB0aGlzLnRocm90dGxlciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXG4gICAgICAgIHRoaXMudGhyb3R0bGVyID0gZmFsc2U7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgaWYoZXZlbnQudGFyZ2V0VG91Y2hlcykgdGhpcy5oYW5kbGVNb3ZlKGV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCwgZXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRZKTtcbiAgICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZU1vdmUoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gICAgICAgIH0pO1xuICAgICAgfSwgNTApO1xuXG4gICAgfSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihtb3ZlRXZlbnQsIHRoaXMubGlzdGVuZXIpO1xuICB9O1xuXG4gIHBhdXNlKCkge1xuICAgIHRoaXMuc3RvcCgpO1xuICB9O1xufSIsIi8vQ3JlYXRvciBQaWVycmUgUmVpbWVydHogTUlUIEVUQyBFVENcblxuY29uc3QgdGltZW91dE1hcCA9IG5ldyBNYXAoKTtcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCcjJywgNTAvMik7IC8vZGVsZXRlXG4gICAgICB0aW1lb3V0TWFwLnNldCgnQCcsIDI1MC8yKTsgLy9wYXVzZVxuICAgICAgdGltZW91dE1hcC5zZXQoJywnLCAzNTAvMik7XG4gICAgICB0aW1lb3V0TWFwLnNldCgnLScsIDM1MC8yKTtcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCcuJywgNTAwLzIpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJz8nLCA3NTAvMik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdyaXRlciB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRzLCBzdHJpbmcpIHtcbiAgICB0aGlzLmVsID0gZWxlbWVudHM7XG4gICAgdGhpcy5zID0gc3RyaW5nO1xuICAgIHRoaXMuaXNXcml0aW5nTGluayA9IGZhbHNlO1xuICB9XG5cbiAgdXBkYXRlV3JpdGVycyhjaGFyYWN0ZXIpIHtcblxuICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuZWwsIChlbGVtZW50KSA9PiB7XG4gICAgICBsZXQgb2xkRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICBlbGVtZW50ID0gKHRoaXMuaXNXcml0aW5nTGluaykgPyBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2E6bGFzdC1jaGlsZCcpIDogZWxlbWVudDtcblxuICAgICAgaWYgKGNoYXJhY3RlciA9PT0gJ0AnKSByZXR1cm47XG5cbiAgICAgIGVsc2UgaWYgKGNoYXJhY3RlciA9PT0gJyMnKSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gZWxlbWVudC5pbm5lckhUTUwuc2xpY2UoMCwgLTEpO1xuICAgICAgICBpZihvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0JykubGVuZ3RoID4gMCl7XG4gICAgICAgICAgb2xkRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcsIG9sZEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnKS5zbGljZSgwLC0xKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnKicpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgKz0gJzxicj4nO1xuICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpICsgJ1xcYScpO1xuICAgICAgfVxuXG4gICAgICBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICckJykge1xuICAgICAgICBpZiAoIXRoaXMuaXNXcml0aW5nTGluaykge1xuICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cbiAgICAgICAgICBsaW5rLmhyZWYgPSB0aGlzLnMuc3BsaXQoJyQnKVswXTtcbiAgICAgICAgICBsaW5rLnRhcmdldCA9ICdfYmxhbmsnO1xuXG5cbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGxpbmspO1xuXG4gICAgICAgICAgdGhpcy5pc1dyaXRpbmdMaW5rID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnMgPSB0aGlzLnMuc3Vic3RyaW5nKHRoaXMucy5zcGxpdCgnJCcpWzBdLmxlbmd0aCsxLCB0aGlzLnMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLmlzV3JpdGluZ0xpbmsgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MICs9IGNoYXJhY3RlcjtcbiAgICAgICAgb2xkRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcsIG9sZEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnKSArIGNoYXJhY3Rlcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB3cml0ZXIoYmVRdWljaykge1xuICAgIGxldCB0ZXh0LCBtc0RlbGF5O1xuXG4gICAgaWYgKHRoaXMucy5sZW5ndGggPT09IDApIHJldHVybiB0aGlzLmlzRG9uZSgpO1xuXG4gICAgdGV4dCA9IHRoaXMucy5zdWJzdHJpbmcoMCwxKTtcbiAgICB0aGlzLnMgPSAgdGhpcy5zLnN1YnN0cmluZygxLHRoaXMucy5sZW5ndGgpO1xuICAgIHRoaXMudXBkYXRlV3JpdGVycyh0ZXh0KTtcblxuICAgIGlmIChiZVF1aWNrKSAgICAgICAgICByZXR1cm4gdGhpcy53cml0ZXIodHJ1ZSk7XG5cbiAgICBtc0RlbGF5ID0gdGltZW91dE1hcC5nZXQodGV4dCkgfHwgTWF0aC5yYW5kb20oKSAqIDE1MDtcblxuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHt0aGlzLndyaXRlcigpfSwgbXNEZWxheSk7XG5cbiAgfTtcblxuICB1cGRhdGVMYXN0UmVhZCgpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVhZC1ldmVyeXRoaW5nLWF0JywgRGF0ZS5ub3coKSk7XG4gIH1cblxuICBnZXQgZ2V0TGFzdFJlYWQoKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWFkLWV2ZXJ5dGhpbmctYXQnKSk7XG4gIH1cblxuICBpc0RvbmUoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdpbnRyby1pcy1kb25lJyk7XG4gICAgdGhpcy51cGRhdGVMYXN0UmVhZCgpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCh0aGlzLmdldExhc3RSZWFkICsgNTAwMCkgPCBEYXRlLm5vdygpKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxhc3RSZWFkKCk7XG4gICAgICB0aGlzLndyaXRlcih0cnVlKTtcbiAgICAgIHRoaXMuaXNEb25lKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy53cml0ZXIoKTtcbiAgICB9XG4gIH1cbn0iXX0=
