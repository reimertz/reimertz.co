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
var ll = new _LazyLoader2.default({ selector: '[data-lazy-src]',
  offset: document.body.getBoundingClientRect().height / 2,
  lines: 5,
  throttle: 300,
  checkOnLoad: false,
  fakeSlowness: {
    delayBeforeFetch: function delayBeforeFetch() {
      return Math.random() * 5500 + 2000;
    },
    percentageOfImages: 0.66

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
  function LazyLoader() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, LazyLoader);

    this.elements = [].slice.call(document.querySelectorAll(options.selector || '[data-lazy-src]'));
    this.offset = options.offset || document.body.getBoundingClientRect().height / 2;
    this.lines = options.lines || 3;
    this.throttle = options.throttle || 350;
    this.checkOnLoad = options.checkOnLoad || true;
    this.fakeSlowness = options.fakeSlowness || false;

    this._queue = [];
    this._listener = false;
    this._throttler = false;
    this._placeholderImages = ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWAQMAAAAGz+OhAAAAA1BMVEUb/5DUIh99AAAAGklEQVR4Ae3BAQEAAAQDMP1TiwHfVgAAwHoNC7gAASist30AAAAASUVORK5CYII=', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWAQMAAABelSeRAAAAA1BMVEUb/5DUIh99AAAAHElEQVR4Xu3AAQkAAADCMPunNsdhWwoAAAAAABwW2gABlO2L2AAAAABJRU5ErkJggg=='];
  }

  _createClass(LazyLoader, [{
    key: 'fetchImage',
    value: function fetchImage(image) {
      var _this = this;

      image.src = image.getAttribute('data-lazy-src');
      image.setAttribute('lazy-status', 'fetching');
      image.addEventListener('load', function (event) {
        _this.imageLoaded(image);
      }, false);
    }
  }, {
    key: 'imageLoaded',
    value: function imageLoaded(loadedImage) {
      var nextImageToFetch = undefined;

      loadedImage.setAttribute('lazy-status', 'loaded');

      this._queue = this._queue.filter(function (queuedImage) {
        if (queuedImage !== loadedImage) return queuedImage;
      });

      nextImageToFetch = this._queue.shift();

      if (!!nextImageToFetch) {
        this.fetchImage(nextImageToFetch);
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

      if (!!this.fakeSlowness && Math.random() > this.fakeSlowness.percentageOfImages) {
        element.setAttribute('lazy-status', 'fetching');
        setTimeout(function () {
          _this2.checkIfshouldFetchNow(element);
        }, this.fakeSlowness.delayBeforeFetch());
      } else {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWNoby1qcy9zcmMvZWNoby5qcyIsInNyYy9zY3JpcHRzL21haW4taG9tZS5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvTGF6eUxvYWRlci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvUmlja1JvbGxlZC5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvVHJhbnNsYXRlci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvV3JpdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZhY3Rvcnkocm9vdCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuICB9IGVsc2Uge1xuICAgIHJvb3QuZWNobyA9IGZhY3Rvcnkocm9vdCk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChyb290KSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBlY2hvID0ge307XG5cbiAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG5cbiAgdmFyIG9mZnNldCwgcG9sbCwgZGVsYXksIHVzZURlYm91bmNlLCB1bmxvYWQ7XG5cbiAgdmFyIGlzSGlkZGVuID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gKGVsZW1lbnQub2Zmc2V0UGFyZW50ID09PSBudWxsKTtcbiAgfTtcbiAgXG4gIHZhciBpblZpZXcgPSBmdW5jdGlvbiAoZWxlbWVudCwgdmlldykge1xuICAgIGlmIChpc0hpZGRlbihlbGVtZW50KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBib3ggPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiAoYm94LnJpZ2h0ID49IHZpZXcubCAmJiBib3guYm90dG9tID49IHZpZXcudCAmJiBib3gubGVmdCA8PSB2aWV3LnIgJiYgYm94LnRvcCA8PSB2aWV3LmIpO1xuICB9O1xuXG4gIHZhciBkZWJvdW5jZU9yVGhyb3R0bGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIXVzZURlYm91bmNlICYmICEhcG9sbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjbGVhclRpbWVvdXQocG9sbCk7XG4gICAgcG9sbCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIGVjaG8ucmVuZGVyKCk7XG4gICAgICBwb2xsID0gbnVsbDtcbiAgICB9LCBkZWxheSk7XG4gIH07XG5cbiAgZWNoby5pbml0ID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB2YXIgb2Zmc2V0QWxsID0gb3B0cy5vZmZzZXQgfHwgMDtcbiAgICB2YXIgb2Zmc2V0VmVydGljYWwgPSBvcHRzLm9mZnNldFZlcnRpY2FsIHx8IG9mZnNldEFsbDtcbiAgICB2YXIgb2Zmc2V0SG9yaXpvbnRhbCA9IG9wdHMub2Zmc2V0SG9yaXpvbnRhbCB8fCBvZmZzZXRBbGw7XG4gICAgdmFyIG9wdGlvblRvSW50ID0gZnVuY3Rpb24gKG9wdCwgZmFsbGJhY2spIHtcbiAgICAgIHJldHVybiBwYXJzZUludChvcHQgfHwgZmFsbGJhY2ssIDEwKTtcbiAgICB9O1xuICAgIG9mZnNldCA9IHtcbiAgICAgIHQ6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0VG9wLCBvZmZzZXRWZXJ0aWNhbCksXG4gICAgICBiOiBvcHRpb25Ub0ludChvcHRzLm9mZnNldEJvdHRvbSwgb2Zmc2V0VmVydGljYWwpLFxuICAgICAgbDogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRMZWZ0LCBvZmZzZXRIb3Jpem9udGFsKSxcbiAgICAgIHI6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0UmlnaHQsIG9mZnNldEhvcml6b250YWwpXG4gICAgfTtcbiAgICBkZWxheSA9IG9wdGlvblRvSW50KG9wdHMudGhyb3R0bGUsIDI1MCk7XG4gICAgdXNlRGVib3VuY2UgPSBvcHRzLmRlYm91bmNlICE9PSBmYWxzZTtcbiAgICB1bmxvYWQgPSAhIW9wdHMudW5sb2FkO1xuICAgIGNhbGxiYWNrID0gb3B0cy5jYWxsYmFjayB8fCBjYWxsYmFjaztcbiAgICBlY2hvLnJlbmRlcigpO1xuICAgIGlmIChkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICByb290LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSwgZmFsc2UpO1xuICAgICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZGVib3VuY2VPclRocm90dGxlLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3QuYXR0YWNoRXZlbnQoJ29uc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICAgIHJvb3QuYXR0YWNoRXZlbnQoJ29ubG9hZCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgfVxuICB9O1xuXG4gIGVjaG8ucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBub2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZ1tkYXRhLWVjaG9dLCBbZGF0YS1lY2hvLWJhY2tncm91bmRdJyk7XG4gICAgdmFyIGxlbmd0aCA9IG5vZGVzLmxlbmd0aDtcbiAgICB2YXIgc3JjLCBlbGVtO1xuICAgIHZhciB2aWV3ID0ge1xuICAgICAgbDogMCAtIG9mZnNldC5sLFxuICAgICAgdDogMCAtIG9mZnNldC50LFxuICAgICAgYjogKHJvb3QuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkgKyBvZmZzZXQuYixcbiAgICAgIHI6IChyb290LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSArIG9mZnNldC5yXG4gICAgfTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBlbGVtID0gbm9kZXNbaV07XG4gICAgICBpZiAoaW5WaWV3KGVsZW0sIHZpZXcpKSB7XG5cbiAgICAgICAgaWYgKHVubG9hZCkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tcGxhY2Vob2xkZXInLCBlbGVtLnNyYyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJykgIT09IG51bGwpIHtcbiAgICAgICAgICBlbGVtLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1iYWNrZ3JvdW5kJykgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlbGVtLnNyYyA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdW5sb2FkKSB7XG4gICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZWNobycpO1xuICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWVjaG8tYmFja2dyb3VuZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2soZWxlbSwgJ2xvYWQnKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHVubG9hZCAmJiAhIShzcmMgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLXBsYWNlaG9sZGVyJykpKSB7XG5cbiAgICAgICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tYmFja2dyb3VuZCcpICE9PSBudWxsKSB7XG4gICAgICAgICAgZWxlbS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybChcIiArIHNyYyArIFwiKVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGVsZW0uc3JjID0gc3JjO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtZWNoby1wbGFjZWhvbGRlcicpO1xuICAgICAgICBjYWxsYmFjayhlbGVtLCAndW5sb2FkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghbGVuZ3RoKSB7XG4gICAgICBlY2hvLmRldGFjaCgpO1xuICAgIH1cbiAgfTtcblxuICBlY2hvLmRldGFjaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgcm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBkZWJvdW5jZU9yVGhyb3R0bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290LmRldGFjaEV2ZW50KCdvbnNjcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgfVxuICAgIGNsZWFyVGltZW91dChwb2xsKTtcbiAgfTtcblxuICByZXR1cm4gZWNobztcblxufSk7XG4iLCJpbXBvcnQgV3JpdGVyIGZyb20gJy4vbW9kdWxlcy9Xcml0ZXInO1xuaW1wb3J0IFRyYW5zbGF0ZXIgZnJvbSAnLi9tb2R1bGVzL1RyYW5zbGF0ZXInO1xuaW1wb3J0IFJpY2tSb2xsZWQgZnJvbSAnLi9tb2R1bGVzL1JpY2tSb2xsZWQnO1xuaW1wb3J0IExhenlMb2FkZXIgZnJvbSAnLi9tb2R1bGVzL0xhenlMb2FkZXInO1xuXG5jb25zdCBlY2hvID0gcmVxdWlyZSgnZWNoby1qcycpKGRvY3VtZW50LmJvZHkpO1xuY29uc3QgaW50cm9UZXh0ID0gYGhpLCBteSBuYW1lIGlzIHBpw6lycmUgcmVpbWVydHouXG5cbmkgYW0gYSBodW1ibGUgZGV2ZWxvcGVyQEBAIyMjIyMjIyMjbWFnaWNpYW5AQEAjIyMjIyMjI2NvZGVyLCBkZXNpZ25lciwgZmFrZS1pdC10aWwteW91LW1ha2UtaXQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI2VudHJlcHJlbmV1ciBhbmQgZXZlcnlkYXkgaHVzdGxlci5cbmV4dHJlbWVseSBhZGRpY3RlZCBvZiBidWlsZGluZyB0aGluZ3MuXG5cbiRodHRwOi8vZ2l0aHViLmNvbS9yZWltZXJ0eiRnaXRodWIkIHwgJGh0dHA6Ly90d2l0dGVyLmNvbS9yZWltZXJ0eiR0d2l0dGVyJCB8ICRtYWlsdG86cGllcnJlLnJlaW1lcnR6QGdtYWlsLmNvbSRoaXJlIG1lJCBgO1xuXG5cbmNvbnN0IHdyaXRlciA9IG5ldyBXcml0ZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndyaXRlcicpLCBpbnRyb1RleHQpO1xuY29uc3QgdHJhbnNsYXRlciA9IG5ldyBUcmFuc2xhdGVyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSwgMTAsIDE1KTtcbmNvbnN0IHJyID0gbmV3IFJpY2tSb2xsZWQoNTAwMCwgdHJ1ZSwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYWxsLW15LXNlY3JldC1hcGkta2V5cycpKTtcbmNvbnN0IGxsID0gbmV3IExhenlMb2FkZXIoeyBzZWxlY3RvcjogJ1tkYXRhLWxhenktc3JjXScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiAoZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQvMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXM6IDUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3R0bGU6IDMwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja09uTG9hZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFrZVNsb3duZXNzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxheUJlZm9yZUZldGNoOiBmdW5jdGlvbigpIHsgcmV0dXJuIChNYXRoLnJhbmRvbSgpICogNTUwMCkgKyAyMDAwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJjZW50YWdlT2ZJbWFnZXM6IDAuNjZcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpe1xuICB3cml0ZXIuc3RhcnQoKTtcbiAgdHJhbnNsYXRlci5zdGFydCgpO1xuICByci5zdGFydCgpO1xuICBsbC5zdGFydCgpO1xufSk7XG5cblxuIiwiLy9DcmVhdG9yIFBpZXJyZSBSZWltZXJ0eiBNSVQgRVRDIEVUQ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXp5TG9hZGVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cbiAgICB0aGlzLmVsZW1lbnRzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbnMuc2VsZWN0b3IgfHwgJ1tkYXRhLWxhenktc3JjXScpKTtcbiAgICB0aGlzLm9mZnNldCA9IG9wdGlvbnMub2Zmc2V0IHx8IChkb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodC8yKTtcbiAgICB0aGlzLmxpbmVzID0gb3B0aW9ucy5saW5lcyB8fCAzO1xuICAgIHRoaXMudGhyb3R0bGUgPSBvcHRpb25zLnRocm90dGxlIHx8IDM1MDtcbiAgICB0aGlzLmNoZWNrT25Mb2FkID0gb3B0aW9ucy5jaGVja09uTG9hZCB8fCB0cnVlO1xuICAgIHRoaXMuZmFrZVNsb3duZXNzID0gb3B0aW9ucy5mYWtlU2xvd25lc3MgfHwgZmFsc2U7XG5cbiAgICB0aGlzLl9xdWV1ZSA9IFtdO1xuICAgIHRoaXMuX2xpc3RlbmVyID0gZmFsc2U7XG4gICAgdGhpcy5fdGhyb3R0bGVyID0gZmFsc2U7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXJJbWFnZXMgPSBbXG4gICAgICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFKWUFBQUNXQVFNQUFBQUd6K09oQUFBQUExQk1WRVViLzVEVUloOTlBQUFBR2tsRVFWUjRBZTNCQVFFQUFBUURNUDFUaXdIZlZnQUF3SG9OQzdnQUFTaXN0MzBBQUFBQVNVVk9SSzVDWUlJPScsXG4gICAgICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFTd0FBQUNXQVFNQUFBQmVsU2VSQUFBQUExQk1WRVViLzVEVUloOTlBQUFBSEVsRVFWUjRYdTNBQVFrQUFBRENNUHVuTnNkaFd3b0FBQUFBQUJ3VzJnQUJsTzJMMkFBQUFBQkpSVTVFcmtKZ2dnPT0nXG4gICAgXTtcbiAgfVxuXG4gIGZldGNoSW1hZ2UoaW1hZ2UpIHtcbiAgICBpbWFnZS5zcmMgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGF6eS1zcmMnKTtcbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2xhenktc3RhdHVzJywgJ2ZldGNoaW5nJyk7XG4gICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge3RoaXMuaW1hZ2VMb2FkZWQoaW1hZ2UpfSwgZmFsc2UpO1xuICB9XG5cbiAgaW1hZ2VMb2FkZWQobG9hZGVkSW1hZ2UpIHtcbiAgICBsZXQgbmV4dEltYWdlVG9GZXRjaDtcblxuICAgIGxvYWRlZEltYWdlLnNldEF0dHJpYnV0ZSgnbGF6eS1zdGF0dXMnLCAnbG9hZGVkJyk7XG5cbiAgICB0aGlzLl9xdWV1ZSA9IHRoaXMuX3F1ZXVlLmZpbHRlcigocXVldWVkSW1hZ2UpPT4ge2lmKHF1ZXVlZEltYWdlICE9PSBsb2FkZWRJbWFnZSkgcmV0dXJuIHF1ZXVlZEltYWdlfSk7XG5cbiAgICBuZXh0SW1hZ2VUb0ZldGNoID0gdGhpcy5fcXVldWUuc2hpZnQoKTtcblxuICAgIGlmKCEhbmV4dEltYWdlVG9GZXRjaCkge1xuICAgICAgdGhpcy5mZXRjaEltYWdlKG5leHRJbWFnZVRvRmV0Y2gpO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrSWZzaG91bGRGZXRjaE5vdyhlbGVtZW50KSB7XG4gICAgdGhpcy5fcXVldWUucHVzaChlbGVtZW50KTtcblxuICAgIGlmKHRoaXMuX3F1ZXVlLmxlbmd0aCA8PSB0aGlzLmxpbmVzKSB7XG4gICAgICB0aGlzLmZldGNoSW1hZ2UoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgYWRkSW1hZ2VUb1F1ZXVlKGVsZW1lbnQpIHtcbiAgICBpZighIXRoaXMuZmFrZVNsb3duZXNzICYmIChNYXRoLnJhbmRvbSgpID4gdGhpcy5mYWtlU2xvd25lc3MucGVyY2VudGFnZU9mSW1hZ2VzKSkge1xuICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2xhenktc3RhdHVzJywgJ2ZldGNoaW5nJyk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5jaGVja0lmc2hvdWxkRmV0Y2hOb3coZWxlbWVudCk7XG4gICAgICB9LCB0aGlzLmZha2VTbG93bmVzcy5kZWxheUJlZm9yZUZldGNoKCkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuY2hlY2tJZnNob3VsZEZldGNoTm93KGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrU2Nyb2xsKCkge1xuICAgIGlmKHRoaXMuX3Rocm90dGxlcikgcmV0dXJuO1xuXG4gICAgdGhpcy5fdGhyb3R0bGVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3Rocm90dGxlciA9IGZhbHNlO1xuXG4gICAgICBpZih0aGlzLmVsZW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgdGhpcy5lbGVtZW50cyA9IHRoaXMuZWxlbWVudHMubWFwKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmKGVsZW1lbnQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYoKGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gdGhpcy5vZmZzZXQpICA8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSB7XG4gICAgICAgICAgdGhpcy5hZGRJbWFnZVRvUXVldWUoZWxlbWVudCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzLmZpbHRlcigoZWxlbWVudCkgPT4geyBpZihlbGVtZW50KSByZXR1cm4gZWxlbWVudCB9KTtcbiAgICB9LCB0aGlzLnRocm90dGxlKTtcblxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYoISF0aGlzLl9saXN0ZW5lcikgcmV0dXJuO1xuICAgIGlmKHRoaXMuY2hlY2tPbkxvYWQpIHRoaXMuY2hlY2tTY3JvbGwoKTtcblxuICAgIHRoaXMuZWxlbWVudHMubWFwKChlbGVtZW50KSA9PiB7XG4gICAgICBpZiAoIWVsZW1lbnQuc3JjIHx8IGVsZW1lbnQuc3JjID09PSAnJykgZWxlbWVudC5zcmMgPSB0aGlzLl9wbGFjZWhvbGRlckltYWdlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKyAwLjUpXVxuICAgIH0pO1xuXG4gICAgdGhpcy5fbGlzdGVuZXIgPSBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoZXZlbnQpID0+IHt0aGlzLmNoZWNrU2Nyb2xsKCl9LCBmYWxzZSk7XG4gIH1cbn0iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cbmNvbnN0IG1kUm9sbGVkID0gW1xuICBbXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLX4nJy0sOjo6Ojo6Ojo6Ojo6Ojo6Ojo6OicnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sficnOjo6Ojo6OjonLDo6Ojo6OjogOjo6Ojo6Ojo6Ojo6OnwnLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLid8Ojo6Ojp8OiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6fDogOiA6LX5+LS0tOiA6IDogLS0tLS06IHxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLicnJ34tLHw6IDogOiA6IDogOiB+LS0tJzogOiA6IDosJy0tTkVWQSBHQUhOXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gR0lWRSBZT1UgVUhQXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4sLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7Ozs7OycsOiA6IDp8X198LiAuIC58Ozs7Ozs7Ozs7LCc7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLiwtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7Ozs7OzsgXFwuIC4gfDo6OnwuIC4gLicnLDs7Ozs7Ozs7fDs7L1xcblwiLFxuICBcIi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7IDs7O1xcLiAufDo6OnwuIC4gLiB8Ozs7Ozs7Ozt8L1xcblwiLFxuICBcIi4uLi4uLi4uLzs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OywnOzs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7OyA7Ozt8LiAuXFw6Ly4gLiAuIC58Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7JycsOiB8O3wuIC4gLiAuIFxcOzs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLH4nJzs7Ozs7Ozs7OzsgOzs7Ozs7Ozs7OzssLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7fC58O3wuIC4gLiAuIC58Ozs7Ozs7O3xcXG5cIixcbiAgXCIsficnOzs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7fCB8OnwuIC4gLiAuIHxcXDs7Ozs7Ozt8XCJdLFxuXG4gIFtcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC1+JyctLDo6Ojo6Ojo6Ojo6Ojo6Ojo6OjonJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nfDo6Ojo6fDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nJyd+LSx8OiA6IDogOiA6IDogfi0tLSc6IDogOiA6LCctLU5FVkEgR0FITlxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufCw6IDogOiA6IDogOi1+fi0tOiA6IDo6LyAtLS0tLSBMRVQgVSBEV05cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLl9fLC0nOzs7OztcXDonJy0sOiA6IDogOid+LS0tficnL3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi5fXywtficnOzs7Ozs7Lzs7Ozs7OztcXDogOlxcOiA6IDpfX19fLzogOicsX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7XFwuIC4gLicnfDo6Ojo6Ojo6fC4gLiwnOzs7Ozs7Ozs7OycnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLiwnIDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7O1xcLiAuIC5cXDo6Ojo6LCcuIC4vfDs7Ozs7Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4sLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7Ozs7OycsOiA6IDp8X198LiAuIC58Ozs7Ozs7Ozs7LCc7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4sLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLDs7Ozs7Ozs7Ozs7IFxcLiAuIHw6Ojp8LiAuIC4nJyw7Ozs7Ozs7O3w7Oy9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7OzsgOzs7XFwuIC58Ojo6fC4gLiAuIHw7Ozs7Ozs7O3wvXFxuXCIsXG4gIFwiLi4uLi4uLi4uLzs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OywnOzs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7OyA7Ozt8LiAuXFw6Ly4gLiAuIC58Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OycnLDogfDt8LiAuIC4gLiBcXDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4sficnOzs7Ozs7Ozs7OyA7Ozs7Ozs7Ozs7OywtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozt8Lnw7fC4gLiAuIC4gLnw7Ozs7Ozs7fFxcblwiLFxuICBcIi4sficnOzs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7fCB8OnwuIC4gLiAuIHxcXDs7Ozs7Ozt8XCJdLFxuXG4gIFtcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4sLX5+JycnJycnJ35+LS0sLF9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtficnLSw6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6OiwtficnJ19fXycnJyd+fi0tficnJzp9XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJ3w6Ojo6Onw6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKF8nJ34tJzogOiA6IDpvOiA6IDp8OiA6bzogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJycnfi0sfDogOiA6IDogOiA6IH4tLS0nOiA6IDogOiwnLS1ORVZBIEdBSE4gVFVSTiBBSFJPVU5EXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gQU5EIERFU0VSVCBVXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiXVxuXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmlja1JvbGxlZCB7XG5cbiAgY29uc3RydWN0b3IoZGVsYXksIHNob3VsZEhpZGUsIGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudCkgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIHRoaXMuaW5kZXggPSAwO1xuICAgIHRoaXMuZGVsYXkgPSBkZWxheSB8fCAzMDAwO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBmYWxzZTtcbiAgICB0aGlzLnNob3VsZEhpZGUgPSBzaG91bGRIaWRlIHx8IGZhbHNlO1xuICB9XG5cbiAgc3dhcCgpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyAxKSAlIG1kUm9sbGVkLmxlbmd0aDtcblxuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSBtZFJvbGxlZFt0aGlzLmluZGV4XTtcblxuICAgIGlmKHRoaXMucHJpbnRUb0NvbnNvbGUpIGNvbnNvbGUubG9nKG1kUm9sbGVkW3RoaXMuaW5kZXhdKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmKHRoaXMuaW50ZXJ2YWwpIHJldHVybjtcblxuICAgIGlmKHRoaXMuc2hvdWxkSGlkZSkgdGhpcy5lbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHt0aGlzLnN3YXAoKX0sIHRoaXMuZGVsYXkpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZighdGhpcy5pbnRlcnZhbCkgcmV0dXJuO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgdGhpcy5pbnRlcnZhbCA9IGZhbHNlO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cbn1cbiIsIi8vQ3JlYXRvciBQaWVycmUgUmVpbWVydHogTUlUIEVUQyBFVENcblxuY29uc3QgaXNNb2JpbGUgPSAvaVBob25lfGlQYWR8aVBvZHxBbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgIG1vdmVFdmVudCA9IGlzTW9iaWxlID8gJ3RvdWNobW92ZScgOiAnbW91c2Vtb3ZlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhbnNsYXRlciB7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgeFJvdGF0aW9uLCB5Um90YXRpb24pIHtcbiAgICB0aGlzLnhSb3RhdGlvbiA9IHhSb3RhdGlvbjtcbiAgICB0aGlzLnlSb3RhdGlvbiA9IHlSb3RhdGlvbjtcbiAgICB0aGlzLmVsID0gZWxlbWVudDtcbiAgICB0aGlzLmZyYW1lID0gZmFsc2U7XG4gICAgdGhpcy50aHJvdHRsZXIgPSBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZU1vdmUoY2xpZW50WCwgY2xpZW50WSl7XG4gICAgbGV0IHggPSAoKDEgLSAoY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkpICogLTEpICogdGhpcy54Um90YXRpb24sXG4gICAgICAgIHkgPSAoY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIHRoaXMueVJvdGF0aW9uO1xuXG4gICAgdGhpcy5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlWCgke3h9ZGVnKSByb3RhdGVZKCR7eX1kZWcpYDtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMubGlzdGVuZXIgPSBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIobW92ZUV2ZW50LCAoZXZlbnQpID0+IHtcbiAgICAgIGlmKHRoaXMudGhyb3R0bGVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMudGhyb3R0bGVyID0gc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICAgICAgdGhpcy50aHJvdHRsZXIgPSBmYWxzZTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBpZihldmVudC50YXJnZXRUb3VjaGVzKSB0aGlzLmhhbmRsZU1vdmUoZXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYLCBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlTW92ZShldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCA1MCk7XG5cbiAgICB9KTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKG1vdmVFdmVudCwgdGhpcy5saXN0ZW5lcik7XG4gIH07XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH07XG59IiwiLy9DcmVhdG9yIFBpZXJyZSBSZWltZXJ0eiBNSVQgRVRDIEVUQ1xuXG5jb25zdCB0aW1lb3V0TWFwID0gbmV3IE1hcCgpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJyMnLCA1MC8yKTsgLy9kZWxldGVcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCdAJywgMjUwLzIpOyAvL3BhdXNlXG4gICAgICB0aW1lb3V0TWFwLnNldCgnLCcsIDM1MC8yKTtcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCctJywgMzUwLzIpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJy4nLCA1MDAvMik7XG4gICAgICB0aW1lb3V0TWFwLnNldCgnPycsIDc1MC8yKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JpdGVyIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudHMsIHN0cmluZykge1xuICAgIHRoaXMuZWwgPSBlbGVtZW50cztcbiAgICB0aGlzLnMgPSBzdHJpbmc7XG4gICAgdGhpcy5pc1dyaXRpbmdMaW5rID0gZmFsc2U7XG4gIH1cblxuICB1cGRhdGVXcml0ZXJzKGNoYXJhY3Rlcikge1xuXG4gICBbXS5mb3JFYWNoLmNhbGwodGhpcy5lbCwgKGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCBvbGRFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIGVsZW1lbnQgPSAodGhpcy5pc1dyaXRpbmdMaW5rKSA/IGVsZW1lbnQucXVlcnlTZWxlY3RvcignYTpsYXN0LWNoaWxkJykgOiBlbGVtZW50O1xuXG4gICAgICBpZiAoY2hhcmFjdGVyID09PSAnQCcpIHJldHVybjtcblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnIycpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTC5zbGljZSgwLCAtMSk7XG4gICAgICAgIGlmKG9sZEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpLnNsaWNlKDAsLTEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICcqJykge1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTCArPSAnPGJyPic7XG4gICAgICAgIG9sZEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnLCBvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0JykgKyAnXFxhJyk7XG4gICAgICB9XG5cbiAgICAgIGVsc2UgaWYgKGNoYXJhY3RlciA9PT0gJyQnKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1dyaXRpbmdMaW5rKSB7XG4gICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuICAgICAgICAgIGxpbmsuaHJlZiA9IHRoaXMucy5zcGxpdCgnJCcpWzBdO1xuICAgICAgICAgIGxpbmsudGFyZ2V0ID0gJ19ibGFuayc7XG5cblxuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQobGluayk7XG5cbiAgICAgICAgICB0aGlzLmlzV3JpdGluZ0xpbmsgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucyA9IHRoaXMucy5zdWJzdHJpbmcodGhpcy5zLnNwbGl0KCckJylbMF0ubGVuZ3RoKzEsIHRoaXMucy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuaXNXcml0aW5nTGluayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgKz0gY2hhcmFjdGVyO1xuICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpICsgY2hhcmFjdGVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHdyaXRlcihiZVF1aWNrKSB7XG4gICAgbGV0IHRleHQsIG1zRGVsYXk7XG5cbiAgICBpZiAodGhpcy5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXMuaXNEb25lKCk7XG5cbiAgICB0ZXh0ID0gdGhpcy5zLnN1YnN0cmluZygwLDEpO1xuICAgIHRoaXMucyA9ICB0aGlzLnMuc3Vic3RyaW5nKDEsdGhpcy5zLmxlbmd0aCk7XG4gICAgdGhpcy51cGRhdGVXcml0ZXJzKHRleHQpO1xuXG4gICAgaWYgKGJlUXVpY2spICAgICAgICAgIHJldHVybiB0aGlzLndyaXRlcih0cnVlKTtcblxuICAgIG1zRGVsYXkgPSB0aW1lb3V0TWFwLmdldCh0ZXh0KSB8fCBNYXRoLnJhbmRvbSgpICogMTUwO1xuXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge3RoaXMud3JpdGVyKCl9LCBtc0RlbGF5KTtcblxuICB9O1xuXG4gIHVwZGF0ZUxhc3RSZWFkKCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWFkLWV2ZXJ5dGhpbmctYXQnLCBEYXRlLm5vdygpKTtcbiAgfVxuXG4gIGdldCBnZXRMYXN0UmVhZCgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlYWQtZXZlcnl0aGluZy1hdCcpKTtcbiAgfVxuXG4gIGlzRG9uZSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ludHJvLWlzLWRvbmUnKTtcbiAgICB0aGlzLnVwZGF0ZUxhc3RSZWFkKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoKHRoaXMuZ2V0TGFzdFJlYWQgKyA1MDAwKSA8IERhdGUubm93KCkpIHtcbiAgICAgIHRoaXMudXBkYXRlTGFzdFJlYWQoKTtcbiAgICAgIHRoaXMud3JpdGVyKHRydWUpO1xuICAgICAgdGhpcy5pc0RvbmUoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLndyaXRlcigpO1xuICAgIH1cbiAgfVxufSJdfQ==
