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

    this.elements = [].slice.call(document.querySelectorAll(options.selector || '[lazy-src]'));
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

      image.src = image.getAttribute('lazy-src');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZWNoby1qcy9zcmMvZWNoby5qcyIsInNyYy9zY3JpcHRzL21haW4taG9tZS5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvTGF6eUxvYWRlci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvUmlja1JvbGxlZC5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvVHJhbnNsYXRlci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvV3JpdGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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c291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmYWN0b3J5KHJvb3QpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiAgfSBlbHNlIHtcbiAgICByb290LmVjaG8gPSBmYWN0b3J5KHJvb3QpO1xuICB9XG59KSh0aGlzLCBmdW5jdGlvbiAocm9vdCkge1xuXG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgZWNobyA9IHt9O1xuXG4gIHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHZhciBvZmZzZXQsIHBvbGwsIGRlbGF5LCB1c2VEZWJvdW5jZSwgdW5sb2FkO1xuXG4gIHZhciBpc0hpZGRlbiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgcmV0dXJuIChlbGVtZW50Lm9mZnNldFBhcmVudCA9PT0gbnVsbCk7XG4gIH07XG4gIFxuICB2YXIgaW5WaWV3ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZpZXcpIHtcbiAgICBpZiAoaXNIaWRkZW4oZWxlbWVudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgYm94ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gKGJveC5yaWdodCA+PSB2aWV3LmwgJiYgYm94LmJvdHRvbSA+PSB2aWV3LnQgJiYgYm94LmxlZnQgPD0gdmlldy5yICYmIGJveC50b3AgPD0gdmlldy5iKTtcbiAgfTtcblxuICB2YXIgZGVib3VuY2VPclRocm90dGxlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmKCF1c2VEZWJvdW5jZSAmJiAhIXBvbGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0KHBvbGwpO1xuICAgIHBvbGwgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBlY2hvLnJlbmRlcigpO1xuICAgICAgcG9sbCA9IG51bGw7XG4gICAgfSwgZGVsYXkpO1xuICB9O1xuXG4gIGVjaG8uaW5pdCA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge307XG4gICAgdmFyIG9mZnNldEFsbCA9IG9wdHMub2Zmc2V0IHx8IDA7XG4gICAgdmFyIG9mZnNldFZlcnRpY2FsID0gb3B0cy5vZmZzZXRWZXJ0aWNhbCB8fCBvZmZzZXRBbGw7XG4gICAgdmFyIG9mZnNldEhvcml6b250YWwgPSBvcHRzLm9mZnNldEhvcml6b250YWwgfHwgb2Zmc2V0QWxsO1xuICAgIHZhciBvcHRpb25Ub0ludCA9IGZ1bmN0aW9uIChvcHQsIGZhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQob3B0IHx8IGZhbGxiYWNrLCAxMCk7XG4gICAgfTtcbiAgICBvZmZzZXQgPSB7XG4gICAgICB0OiBvcHRpb25Ub0ludChvcHRzLm9mZnNldFRvcCwgb2Zmc2V0VmVydGljYWwpLFxuICAgICAgYjogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRCb3R0b20sIG9mZnNldFZlcnRpY2FsKSxcbiAgICAgIGw6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0TGVmdCwgb2Zmc2V0SG9yaXpvbnRhbCksXG4gICAgICByOiBvcHRpb25Ub0ludChvcHRzLm9mZnNldFJpZ2h0LCBvZmZzZXRIb3Jpem9udGFsKVxuICAgIH07XG4gICAgZGVsYXkgPSBvcHRpb25Ub0ludChvcHRzLnRocm90dGxlLCAyNTApO1xuICAgIHVzZURlYm91bmNlID0gb3B0cy5kZWJvdW5jZSAhPT0gZmFsc2U7XG4gICAgdW5sb2FkID0gISFvcHRzLnVubG9hZDtcbiAgICBjYWxsYmFjayA9IG9wdHMuY2FsbGJhY2sgfHwgY2FsbGJhY2s7XG4gICAgZWNoby5yZW5kZXIoKTtcbiAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBkZWJvdW5jZU9yVGhyb3R0bGUsIGZhbHNlKTtcbiAgICAgIHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGRlYm91bmNlT3JUaHJvdHRsZSwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290LmF0dGFjaEV2ZW50KCdvbnNjcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgICByb290LmF0dGFjaEV2ZW50KCdvbmxvYWQnLCBkZWJvdW5jZU9yVGhyb3R0bGUpO1xuICAgIH1cbiAgfTtcblxuICBlY2hvLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS1lY2hvXSwgW2RhdGEtZWNoby1iYWNrZ3JvdW5kXScpO1xuICAgIHZhciBsZW5ndGggPSBub2Rlcy5sZW5ndGg7XG4gICAgdmFyIHNyYywgZWxlbTtcbiAgICB2YXIgdmlldyA9IHtcbiAgICAgIGw6IDAgLSBvZmZzZXQubCxcbiAgICAgIHQ6IDAgLSBvZmZzZXQudCxcbiAgICAgIGI6IChyb290LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpICsgb2Zmc2V0LmIsXG4gICAgICByOiAocm9vdC5pbm5lcldpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCkgKyBvZmZzZXQuclxuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgZWxlbSA9IG5vZGVzW2ldO1xuICAgICAgaWYgKGluVmlldyhlbGVtLCB2aWV3KSkge1xuXG4gICAgICAgIGlmICh1bmxvYWQpIHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLXBsYWNlaG9sZGVyJywgZWxlbS5zcmMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tYmFja2dyb3VuZCcpICE9PSBudWxsKSB7XG4gICAgICAgICAgZWxlbS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybChcIiArIGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tYmFja2dyb3VuZCcpICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbS5zcmMgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXVubG9hZCkge1xuICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWVjaG8nKTtcbiAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKGVsZW0sICdsb2FkJyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh1bmxvYWQgJiYgISEoc3JjID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1wbGFjZWhvbGRlcicpKSkge1xuXG4gICAgICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKSAhPT0gbnVsbCkge1xuICAgICAgICAgIGVsZW0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBzcmMgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlbGVtLnNyYyA9IHNyYztcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWVjaG8tcGxhY2Vob2xkZXInKTtcbiAgICAgICAgY2FsbGJhY2soZWxlbSwgJ3VubG9hZCcpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgZWNoby5kZXRhY2goKTtcbiAgICB9XG4gIH07XG5cbiAgZWNoby5kZXRhY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHJvb3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdC5kZXRhY2hFdmVudCgnb25zY3JvbGwnLCBkZWJvdW5jZU9yVGhyb3R0bGUpO1xuICAgIH1cbiAgICBjbGVhclRpbWVvdXQocG9sbCk7XG4gIH07XG5cbiAgcmV0dXJuIGVjaG87XG5cbn0pO1xuIiwiaW1wb3J0IFdyaXRlciBmcm9tICcuL21vZHVsZXMvV3JpdGVyJztcbmltcG9ydCBUcmFuc2xhdGVyIGZyb20gJy4vbW9kdWxlcy9UcmFuc2xhdGVyJztcbmltcG9ydCBSaWNrUm9sbGVkIGZyb20gJy4vbW9kdWxlcy9SaWNrUm9sbGVkJztcbmltcG9ydCBMYXp5TG9hZGVyIGZyb20gJy4vbW9kdWxlcy9MYXp5TG9hZGVyJztcblxuY29uc3QgZWNobyA9IHJlcXVpcmUoJ2VjaG8tanMnKShkb2N1bWVudC5ib2R5KTtcbmNvbnN0IGludHJvVGV4dCA9IGBoaSwgbXkgbmFtZSBpcyBwacOpcnJlIHJlaW1lcnR6LlxuXG5pIGFtIGEgaHVtYmxlIGRldmVsb3BlckBAQCMjIyMjIyMjI21hZ2ljaWFuQEBAIyMjIyMjIyNjb2RlciwgZGVzaWduZXIsIGZha2UtaXQtdGlsLXlvdS1tYWtlLWl0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNlbnRyZXByZW5ldXIgYW5kIGV2ZXJ5ZGF5IGh1c3RsZXIuXG5leHRyZW1lbHkgYWRkaWN0ZWQgb2YgYnVpbGRpbmcgdGhpbmdzLlxuXG4kaHR0cDovL2dpdGh1Yi5jb20vcmVpbWVydHokZ2l0aHViJCB8ICRodHRwOi8vdHdpdHRlci5jb20vcmVpbWVydHokdHdpdHRlciQgfCAkbWFpbHRvOnBpZXJyZS5yZWltZXJ0ekBnbWFpbC5jb20kaGlyZSBtZSQgYDtcblxuXG5jb25zdCB3cml0ZXIgPSBuZXcgV3JpdGVyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53cml0ZXInKSwgaW50cm9UZXh0KTtcbmNvbnN0IHRyYW5zbGF0ZXIgPSBuZXcgVHJhbnNsYXRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJyksIDEwLCAxNSk7XG5jb25zdCByciA9IG5ldyBSaWNrUm9sbGVkKDUwMDAsIHRydWUsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2FsbC1teS1zZWNyZXQtYXBpLWtleXMnKSk7XG5jb25zdCBsbCA9IG5ldyBMYXp5TG9hZGVyKHsgc2VsZWN0b3I6ICdbbGF6eS1zcmNdJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IChkb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodC8yKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lczogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdHRsZTogMzAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrT25Mb2FkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWtlU2xvd25lc3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGF5QmVmb3JlRmV0Y2g6IGZ1bmN0aW9uKCkgeyByZXR1cm4gKE1hdGgucmFuZG9tKCkgKiA1NTAwKSArIDIwMDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmNlbnRhZ2VPZkltYWdlczogMC42NlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7XG4gIHdyaXRlci5zdGFydCgpO1xuICB0cmFuc2xhdGVyLnN0YXJ0KCk7XG4gIHJyLnN0YXJ0KCk7XG4gIGxsLnN0YXJ0KCk7XG59KTtcblxuXG4iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExhenlMb2FkZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblxuICAgIHRoaXMuZWxlbWVudHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9ucy5zZWxlY3RvciB8fCAnW2xhenktc3JjXScpKTtcbiAgICB0aGlzLm9mZnNldCA9IG9wdGlvbnMub2Zmc2V0IHx8IChkb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodC8yKTtcbiAgICB0aGlzLmxpbmVzID0gb3B0aW9ucy5saW5lcyB8fCAzO1xuICAgIHRoaXMudGhyb3R0bGUgPSBvcHRpb25zLnRocm90dGxlIHx8IDM1MDtcbiAgICB0aGlzLmNoZWNrT25Mb2FkID0gb3B0aW9ucy5jaGVja09uTG9hZCB8fCB0cnVlO1xuICAgIHRoaXMuZmFrZVNsb3duZXNzID0gb3B0aW9ucy5mYWtlU2xvd25lc3MgfHwgZmFsc2U7XG5cbiAgICB0aGlzLl9xdWV1ZSA9IFtdO1xuICAgIHRoaXMuX2xpc3RlbmVyID0gZmFsc2U7XG4gICAgdGhpcy5fdGhyb3R0bGVyID0gZmFsc2U7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXJJbWFnZXMgPSBbXG4gICAgICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFKWUFBQUNXQVFNQUFBQUd6K09oQUFBQUExQk1WRVViLzVEVUloOTlBQUFBR2tsRVFWUjRBZTNCQVFFQUFBUURNUDFUaXdIZlZnQUF3SG9OQzdnQUFTaXN0MzBBQUFBQVNVVk9SSzVDWUlJPScsXG4gICAgICAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFTd0FBQUNXQVFNQUFBQmVsU2VSQUFBQUExQk1WRVViLzVEVUloOTlBQUFBSEVsRVFWUjRYdTNBQVFrQUFBRENNUHVuTnNkaFd3b0FBQUFBQUJ3VzJnQUJsTzJMMkFBQUFBQkpSVTVFcmtKZ2dnPT0nXG4gICAgXTtcbiAgfVxuXG4gIGZldGNoSW1hZ2UoaW1hZ2UpIHtcbiAgICBpbWFnZS5zcmMgPSBpbWFnZS5nZXRBdHRyaWJ1dGUoJ2xhenktc3JjJyk7XG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdsYXp5LXN0YXR1cycsICdmZXRjaGluZycpO1xuICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHt0aGlzLmltYWdlTG9hZGVkKGltYWdlKX0sIGZhbHNlKTtcbiAgfVxuXG4gIGltYWdlTG9hZGVkKGxvYWRlZEltYWdlKSB7XG4gICAgbGV0IG5leHRJbWFnZVRvRmV0Y2g7XG5cbiAgICBsb2FkZWRJbWFnZS5zZXRBdHRyaWJ1dGUoJ2xhenktc3RhdHVzJywgJ2xvYWRlZCcpO1xuXG4gICAgdGhpcy5fcXVldWUgPSB0aGlzLl9xdWV1ZS5maWx0ZXIoKHF1ZXVlZEltYWdlKT0+IHtpZihxdWV1ZWRJbWFnZSAhPT0gbG9hZGVkSW1hZ2UpIHJldHVybiBxdWV1ZWRJbWFnZX0pO1xuXG4gICAgbmV4dEltYWdlVG9GZXRjaCA9IHRoaXMuX3F1ZXVlLnNoaWZ0KCk7XG5cbiAgICBpZighIW5leHRJbWFnZVRvRmV0Y2gpIHtcbiAgICAgIHRoaXMuZmV0Y2hJbWFnZShuZXh0SW1hZ2VUb0ZldGNoKTtcbiAgICB9XG4gIH1cblxuICBjaGVja0lmc2hvdWxkRmV0Y2hOb3coZWxlbWVudCkge1xuICAgIHRoaXMuX3F1ZXVlLnB1c2goZWxlbWVudCk7XG5cbiAgICBpZih0aGlzLl9xdWV1ZS5sZW5ndGggPD0gdGhpcy5saW5lcykge1xuICAgICAgdGhpcy5mZXRjaEltYWdlKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIGFkZEltYWdlVG9RdWV1ZShlbGVtZW50KSB7XG4gICAgaWYoISF0aGlzLmZha2VTbG93bmVzcyAmJiAoTWF0aC5yYW5kb20oKSA+IHRoaXMuZmFrZVNsb3duZXNzLnBlcmNlbnRhZ2VPZkltYWdlcykpIHtcbiAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdsYXp5LXN0YXR1cycsICdmZXRjaGluZycpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY2hlY2tJZnNob3VsZEZldGNoTm93KGVsZW1lbnQpO1xuICAgICAgfSwgdGhpcy5mYWtlU2xvd25lc3MuZGVsYXlCZWZvcmVGZXRjaCgpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmNoZWNrSWZzaG91bGRGZXRjaE5vdyhlbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBjaGVja1Njcm9sbCgpIHtcbiAgICBpZih0aGlzLl90aHJvdHRsZXIpIHJldHVybjtcblxuICAgIHRoaXMuX3Rocm90dGxlciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLl90aHJvdHRsZXIgPSBmYWxzZTtcblxuXG4gICAgICBpZih0aGlzLmVsZW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgdGhpcy5lbGVtZW50cyA9IHRoaXMuZWxlbWVudHMubWFwKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmKGVsZW1lbnQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgaWYoKGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gdGhpcy5vZmZzZXQpICA8IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSB7XG4gICAgICAgICAgdGhpcy5hZGRJbWFnZVRvUXVldWUoZWxlbWVudCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZWxlbWVudHMgPSB0aGlzLmVsZW1lbnRzLmZpbHRlcigoZWxlbWVudCkgPT4geyBpZihlbGVtZW50KSByZXR1cm4gZWxlbWVudCB9KTtcbiAgICB9LCB0aGlzLnRocm90dGxlKTtcblxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYoISF0aGlzLl9saXN0ZW5lcikgcmV0dXJuO1xuICAgIGlmKHRoaXMuY2hlY2tPbkxvYWQpIHRoaXMuY2hlY2tTY3JvbGwoKTtcblxuICAgIHRoaXMuZWxlbWVudHMubWFwKChlbGVtZW50KSA9PiB7XG4gICAgICBpZiAoIWVsZW1lbnQuc3JjIHx8IGVsZW1lbnQuc3JjID09PSAnJykgZWxlbWVudC5zcmMgPSB0aGlzLl9wbGFjZWhvbGRlckltYWdlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKyAwLjUpXVxuICAgIH0pO1xuXG4gICAgdGhpcy5fbGlzdGVuZXIgPSBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoZXZlbnQpID0+IHt0aGlzLmNoZWNrU2Nyb2xsKCl9LCBmYWxzZSk7XG4gIH1cbn0iLCIvL0NyZWF0b3IgUGllcnJlIFJlaW1lcnR6IE1JVCBFVEMgRVRDXG5cbmNvbnN0IG1kUm9sbGVkID0gW1xuICBbXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLX4nJy0sOjo6Ojo6Ojo6Ojo6Ojo6Ojo6OicnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sficnOjo6Ojo6OjonLDo6Ojo6OjogOjo6Ojo6Ojo6Ojo6OnwnLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLid8Ojo6Ojp8OiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6fDogOiA6LX5+LS0tOiA6IDogLS0tLS06IHxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLicnJ34tLHw6IDogOiA6IDogOiB+LS0tJzogOiA6IDosJy0tTkVWQSBHQUhOXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gR0lWRSBZT1UgVUhQXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4sLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7Ozs7OycsOiA6IDp8X198LiAuIC58Ozs7Ozs7Ozs7LCc7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLiwtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7Ozs7OzsgXFwuIC4gfDo6OnwuIC4gLicnLDs7Ozs7Ozs7fDs7L1xcblwiLFxuICBcIi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7IDs7O1xcLiAufDo6OnwuIC4gLiB8Ozs7Ozs7Ozt8L1xcblwiLFxuICBcIi4uLi4uLi4uLzs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OywnOzs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7OyA7Ozt8LiAuXFw6Ly4gLiAuIC58Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7JycsOiB8O3wuIC4gLiAuIFxcOzs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLH4nJzs7Ozs7Ozs7OzsgOzs7Ozs7Ozs7OzssLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7fC58O3wuIC4gLiAuIC58Ozs7Ozs7O3xcXG5cIixcbiAgXCIsficnOzs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7fCB8OnwuIC4gLiAuIHxcXDs7Ozs7Ozt8XCJdLFxuXG4gIFtcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC1+JyctLDo6Ojo6Ojo6Ojo6Ojo6Ojo6OjonJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nfDo6Ojo6fDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nJyd+LSx8OiA6IDogOiA6IDogfi0tLSc6IDogOiA6LCctLU5FVkEgR0FITlxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufCw6IDogOiA6IDogOi1+fi0tOiA6IDo6LyAtLS0tLSBMRVQgVSBEV05cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLl9fLC0nOzs7OztcXDonJy0sOiA6IDogOid+LS0tficnL3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi5fXywtficnOzs7Ozs7Lzs7Ozs7OztcXDogOlxcOiA6IDpfX19fLzogOicsX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7XFwuIC4gLicnfDo6Ojo6Ojo6fC4gLiwnOzs7Ozs7Ozs7OycnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLiwnIDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7O1xcLiAuIC5cXDo6Ojo6LCcuIC4vfDs7Ozs7Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4sLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7Ozs7OycsOiA6IDp8X198LiAuIC58Ozs7Ozs7Ozs7LCc7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4sLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLDs7Ozs7Ozs7Ozs7IFxcLiAuIHw6Ojp8LiAuIC4nJyw7Ozs7Ozs7O3w7Oy9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7OzsgOzs7XFwuIC58Ojo6fC4gLiAuIHw7Ozs7Ozs7O3wvXFxuXCIsXG4gIFwiLi4uLi4uLi4uLzs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OywnOzs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7OyA7Ozt8LiAuXFw6Ly4gLiAuIC58Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OycnLDogfDt8LiAuIC4gLiBcXDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4sficnOzs7Ozs7Ozs7OyA7Ozs7Ozs7Ozs7OywtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozt8Lnw7fC4gLiAuIC4gLnw7Ozs7Ozs7fFxcblwiLFxuICBcIi4sficnOzs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7fCB8OnwuIC4gLiAuIHxcXDs7Ozs7Ozt8XCJdLFxuXG4gIFtcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4sLX5+JycnJycnJ35+LS0sLF9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtficnLSw6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6OiwtficnJ19fXycnJyd+fi0tficnJzp9XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJ3w6Ojo6Onw6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKF8nJ34tJzogOiA6IDpvOiA6IDp8OiA6bzogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJycnfi0sfDogOiA6IDogOiA6IH4tLS0nOiA6IDogOiwnLS1ORVZBIEdBSE4gVFVSTiBBSFJPVU5EXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gQU5EIERFU0VSVCBVXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiXVxuXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmlja1JvbGxlZCB7XG5cbiAgY29uc3RydWN0b3IoZGVsYXksIHNob3VsZEhpZGUsIGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudCkgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIHRoaXMuaW5kZXggPSAwO1xuICAgIHRoaXMuZGVsYXkgPSBkZWxheSB8fCAzMDAwO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBmYWxzZTtcbiAgICB0aGlzLnNob3VsZEhpZGUgPSBzaG91bGRIaWRlIHx8IGZhbHNlO1xuICB9XG5cbiAgc3dhcCgpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyAxKSAlIG1kUm9sbGVkLmxlbmd0aDtcblxuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSBtZFJvbGxlZFt0aGlzLmluZGV4XTtcblxuICAgIGlmKHRoaXMucHJpbnRUb0NvbnNvbGUpIGNvbnNvbGUubG9nKG1kUm9sbGVkW3RoaXMuaW5kZXhdKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmKHRoaXMuaW50ZXJ2YWwpIHJldHVybjtcblxuICAgIGlmKHRoaXMuc2hvdWxkSGlkZSkgdGhpcy5lbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHt0aGlzLnN3YXAoKX0sIHRoaXMuZGVsYXkpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZighdGhpcy5pbnRlcnZhbCkgcmV0dXJuO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgdGhpcy5pbnRlcnZhbCA9IGZhbHNlO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cbn1cbiIsIi8vQ3JlYXRvciBQaWVycmUgUmVpbWVydHogTUlUIEVUQyBFVENcblxuY29uc3QgaXNNb2JpbGUgPSAvaVBob25lfGlQYWR8aVBvZHxBbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgIG1vdmVFdmVudCA9IGlzTW9iaWxlID8gJ3RvdWNobW92ZScgOiAnbW91c2Vtb3ZlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhbnNsYXRlciB7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgeFJvdGF0aW9uLCB5Um90YXRpb24pIHtcbiAgICB0aGlzLnhSb3RhdGlvbiA9IHhSb3RhdGlvbjtcbiAgICB0aGlzLnlSb3RhdGlvbiA9IHlSb3RhdGlvbjtcbiAgICB0aGlzLmVsID0gZWxlbWVudDtcbiAgICB0aGlzLmZyYW1lID0gZmFsc2U7XG4gICAgdGhpcy50aHJvdHRsZXIgPSBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZU1vdmUoY2xpZW50WCwgY2xpZW50WSl7XG4gICAgbGV0IHggPSAoKDEgLSAoY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkpICogLTEpICogdGhpcy54Um90YXRpb24sXG4gICAgICAgIHkgPSAoY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIHRoaXMueVJvdGF0aW9uO1xuXG4gICAgdGhpcy5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlWCgke3h9ZGVnKSByb3RhdGVZKCR7eX1kZWcpYDtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMubGlzdGVuZXIgPSBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIobW92ZUV2ZW50LCAoZXZlbnQpID0+IHtcbiAgICAgIGlmKHRoaXMudGhyb3R0bGVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMudGhyb3R0bGVyID0gc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICAgICAgdGhpcy50aHJvdHRsZXIgPSBmYWxzZTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBpZihldmVudC50YXJnZXRUb3VjaGVzKSB0aGlzLmhhbmRsZU1vdmUoZXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYLCBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlTW92ZShldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCA1MCk7XG5cbiAgICB9KTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKG1vdmVFdmVudCwgdGhpcy5saXN0ZW5lcik7XG4gIH07XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH07XG59IiwiLy9DcmVhdG9yIFBpZXJyZSBSZWltZXJ0eiBNSVQgRVRDIEVUQ1xuXG5jb25zdCB0aW1lb3V0TWFwID0gbmV3IE1hcCgpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJyMnLCA1MC8yKTsgLy9kZWxldGVcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCdAJywgMjUwLzIpOyAvL3BhdXNlXG4gICAgICB0aW1lb3V0TWFwLnNldCgnLCcsIDM1MC8yKTtcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCctJywgMzUwLzIpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJy4nLCA1MDAvMik7XG4gICAgICB0aW1lb3V0TWFwLnNldCgnPycsIDc1MC8yKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JpdGVyIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudHMsIHN0cmluZykge1xuICAgIHRoaXMuZWwgPSBlbGVtZW50cztcbiAgICB0aGlzLnMgPSBzdHJpbmc7XG4gICAgdGhpcy5pc1dyaXRpbmdMaW5rID0gZmFsc2U7XG4gIH1cblxuICB1cGRhdGVXcml0ZXJzKGNoYXJhY3Rlcikge1xuXG4gICBbXS5mb3JFYWNoLmNhbGwodGhpcy5lbCwgKGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCBvbGRFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIGVsZW1lbnQgPSAodGhpcy5pc1dyaXRpbmdMaW5rKSA/IGVsZW1lbnQucXVlcnlTZWxlY3RvcignYTpsYXN0LWNoaWxkJykgOiBlbGVtZW50O1xuXG4gICAgICBpZiAoY2hhcmFjdGVyID09PSAnQCcpIHJldHVybjtcblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnIycpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTC5zbGljZSgwLCAtMSk7XG4gICAgICAgIGlmKG9sZEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpLnNsaWNlKDAsLTEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICcqJykge1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTCArPSAnPGJyPic7XG4gICAgICAgIG9sZEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnLCBvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0JykgKyAnXFxhJyk7XG4gICAgICB9XG5cbiAgICAgIGVsc2UgaWYgKGNoYXJhY3RlciA9PT0gJyQnKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1dyaXRpbmdMaW5rKSB7XG4gICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuICAgICAgICAgIGxpbmsuaHJlZiA9IHRoaXMucy5zcGxpdCgnJCcpWzBdO1xuICAgICAgICAgIGxpbmsudGFyZ2V0ID0gJ19ibGFuayc7XG5cblxuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQobGluayk7XG5cbiAgICAgICAgICB0aGlzLmlzV3JpdGluZ0xpbmsgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucyA9IHRoaXMucy5zdWJzdHJpbmcodGhpcy5zLnNwbGl0KCckJylbMF0ubGVuZ3RoKzEsIHRoaXMucy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuaXNXcml0aW5nTGluayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgKz0gY2hhcmFjdGVyO1xuICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpICsgY2hhcmFjdGVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHdyaXRlcihiZVF1aWNrKSB7XG4gICAgbGV0IHRleHQsIG1zRGVsYXk7XG5cbiAgICBpZiAodGhpcy5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXMuaXNEb25lKCk7XG5cbiAgICB0ZXh0ID0gdGhpcy5zLnN1YnN0cmluZygwLDEpO1xuICAgIHRoaXMucyA9ICB0aGlzLnMuc3Vic3RyaW5nKDEsdGhpcy5zLmxlbmd0aCk7XG4gICAgdGhpcy51cGRhdGVXcml0ZXJzKHRleHQpO1xuXG4gICAgaWYgKGJlUXVpY2spICAgICAgICAgIHJldHVybiB0aGlzLndyaXRlcih0cnVlKTtcblxuICAgIG1zRGVsYXkgPSB0aW1lb3V0TWFwLmdldCh0ZXh0KSB8fCBNYXRoLnJhbmRvbSgpICogMTUwO1xuXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge3RoaXMud3JpdGVyKCl9LCBtc0RlbGF5KTtcblxuICB9O1xuXG4gIHVwZGF0ZUxhc3RSZWFkKCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWFkLWV2ZXJ5dGhpbmctYXQnLCBEYXRlLm5vdygpKTtcbiAgfVxuXG4gIGdldCBnZXRMYXN0UmVhZCgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlYWQtZXZlcnl0aGluZy1hdCcpKTtcbiAgfVxuXG4gIGlzRG9uZSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ludHJvLWlzLWRvbmUnKTtcbiAgICB0aGlzLnVwZGF0ZUxhc3RSZWFkKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoKHRoaXMuZ2V0TGFzdFJlYWQgKyA1MDAwKSA8IERhdGUubm93KCkpIHtcbiAgICAgIHRoaXMudXBkYXRlTGFzdFJlYWQoKTtcbiAgICAgIHRoaXMud3JpdGVyKHRydWUpO1xuICAgICAgdGhpcy5pc0RvbmUoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLndyaXRlcigpO1xuICAgIH1cbiAgfVxufSJdfQ==
