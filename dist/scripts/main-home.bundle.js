(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*! echo-js v1.7.3 | (c) 2016 @toddmotto | https://github.com/toddmotto/echo */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return factory(root);
    });
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = factory;
  } else {
    root.echo = factory(root);
  }
})(undefined, function (root) {

  'use strict';

  var echo = {};

  var callback = function callback() {};

  var offset, poll, delay, useDebounce, unload;

  var isHidden = function isHidden(element) {
    return element.offsetParent === null;
  };

  var inView = function inView(element, view) {
    if (isHidden(element)) {
      return false;
    }

    var box = element.getBoundingClientRect();
    return box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b;
  };

  var debounceOrThrottle = function debounceOrThrottle() {
    if (!useDebounce && !!poll) {
      return;
    }
    clearTimeout(poll);
    poll = setTimeout(function () {
      echo.render();
      poll = null;
    }, delay);
  };

  echo.init = function (opts) {
    opts = opts || {};
    var offsetAll = opts.offset || 0;
    var offsetVertical = opts.offsetVertical || offsetAll;
    var offsetHorizontal = opts.offsetHorizontal || offsetAll;
    var optionToInt = function optionToInt(opt, fallback) {
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
        } else {
          elem.src = elem.getAttribute('data-echo');
        }

        if (!unload) {
          elem.removeAttribute('data-echo');
          elem.removeAttribute('data-echo-background');
        }

        callback(elem, 'load');
      } else if (unload && !!(src = elem.getAttribute('data-echo-placeholder'))) {

        if (elem.getAttribute('data-echo-background') !== null) {
          elem.style.backgroundImage = "url(" + src + ")";
        } else {
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

var _echoMin = require('./libs/echo.min.js');

var _echoMin2 = _interopRequireDefault(_echoMin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var introText = 'hi, my name is piérre reimertz.\n\ni am a humble developer@@@#########magician@@@########coder, designer, fake-it-til-you-make-it#######################entrepreneur and everyday hustler.\nextremely addicted of building things.\n\n$http://github.com/reimertz$github$ | $http://twitter.com/reimertz$twitter$ | $mailto:pierre.reimertz@gmail.com$hire me$ ';

var writer = new _Writer2.default(document.querySelectorAll('.writer'), introText);
var translater = new _Translater2.default(document.querySelector('main'), 10, 15);
var rr = new _RickRolled2.default(5000, true, document.querySelector('all-my-secret-api-keys'));

requestAnimationFrame(function () {
  writer.start();
  translater.start();
  rr.start();

  _echoMin2.default.init({
    offset: 100,
    throttle: 250,
    unload: false,
    callback: function callback(element, op) {
      console.log(element, 'has been', op + 'ed');
    }
  });
});

},{"./libs/echo.min.js":1,"./modules/RickRolled":3,"./modules/Translater":4,"./modules/Writer":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    moveEvent = isMobile ? 'touchmove' : 'mousemove';

var Writer = function () {
  function Writer(element, xRotation, yRotation) {
    _classCallCheck(this, Writer);

    this.xRotation = xRotation;
    this.yRotation = yRotation;
    this.el = element;
    this.frame = false;
    this.throttler = false;
  }

  _createClass(Writer, [{
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

  return Writer;
}();

exports.default = Writer;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9saWJzL2VjaG8ubWluLmpzIiwic3JjL3NjcmlwdHMvbWFpbi1ob21lLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9SaWNrUm9sbGVkLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9UcmFuc2xhdGVyLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9Xcml0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0NBLENBQUMsVUFBVSxJQUFWLEVBQWdCLE9BQWhCLEVBQXlCO0FBQ3hCLE1BQUksT0FBTyxNQUFQLEtBQWtCLFVBQWxCLElBQWdDLE9BQU8sR0FBUCxFQUFZO0FBQzlDLFdBQU8sWUFBVztBQUNoQixhQUFPLFFBQVEsSUFBUixDQUFQLENBRGdCO0tBQVgsQ0FBUCxDQUQ4QztHQUFoRCxNQUlPLElBQUksUUFBTyx5REFBUCxLQUFtQixRQUFuQixFQUE2QjtBQUN0QyxXQUFPLE9BQVAsR0FBaUIsT0FBakIsQ0FEc0M7R0FBakMsTUFFQTtBQUNMLFNBQUssSUFBTCxHQUFZLFFBQVEsSUFBUixDQUFaLENBREs7R0FGQTtDQUxSLENBQUQsWUFVUyxVQUFVLElBQVYsRUFBZ0I7O0FBRXZCLGVBRnVCOztBQUl2QixNQUFJLE9BQU8sRUFBUCxDQUptQjs7QUFNdkIsTUFBSSxXQUFXLG9CQUFZLEVBQVosQ0FOUTs7QUFRdkIsTUFBSSxNQUFKLEVBQVksSUFBWixFQUFrQixLQUFsQixFQUF5QixXQUF6QixFQUFzQyxNQUF0QyxDQVJ1Qjs7QUFVdkIsTUFBSSxXQUFXLFNBQVgsUUFBVyxDQUFVLE9BQVYsRUFBbUI7QUFDaEMsV0FBUSxRQUFRLFlBQVIsS0FBeUIsSUFBekIsQ0FEd0I7R0FBbkIsQ0FWUTs7QUFjdkIsTUFBSSxTQUFTLFNBQVQsTUFBUyxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsRUFBeUI7QUFDcEMsUUFBSSxTQUFTLE9BQVQsQ0FBSixF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bmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qISBlY2hvLWpzIHYxLjcuMyB8IChjKSAyMDE2IEB0b2RkbW90dG8gfCBodHRwczovL2dpdGh1Yi5jb20vdG9kZG1vdHRvL2VjaG8gKi9cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZhY3Rvcnkocm9vdCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuICB9IGVsc2Uge1xuICAgIHJvb3QuZWNobyA9IGZhY3Rvcnkocm9vdCk7XG4gIH1cbn0pKHRoaXMsIGZ1bmN0aW9uIChyb290KSB7XG5cbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBlY2hvID0ge307XG5cbiAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24gKCkge307XG5cbiAgdmFyIG9mZnNldCwgcG9sbCwgZGVsYXksIHVzZURlYm91bmNlLCB1bmxvYWQ7XG5cbiAgdmFyIGlzSGlkZGVuID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gKGVsZW1lbnQub2Zmc2V0UGFyZW50ID09PSBudWxsKTtcbiAgfTtcblxuICB2YXIgaW5WaWV3ID0gZnVuY3Rpb24gKGVsZW1lbnQsIHZpZXcpIHtcbiAgICBpZiAoaXNIaWRkZW4oZWxlbWVudCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgYm94ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4gKGJveC5yaWdodCA+PSB2aWV3LmwgJiYgYm94LmJvdHRvbSA+PSB2aWV3LnQgJiYgYm94LmxlZnQgPD0gdmlldy5yICYmIGJveC50b3AgPD0gdmlldy5iKTtcbiAgfTtcblxuICB2YXIgZGVib3VuY2VPclRocm90dGxlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmKCF1c2VEZWJvdW5jZSAmJiAhIXBvbGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2xlYXJUaW1lb3V0KHBvbGwpO1xuICAgIHBvbGwgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICBlY2hvLnJlbmRlcigpO1xuICAgICAgcG9sbCA9IG51bGw7XG4gICAgfSwgZGVsYXkpO1xuICB9O1xuXG4gIGVjaG8uaW5pdCA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgb3B0cyA9IG9wdHMgfHwge307XG4gICAgdmFyIG9mZnNldEFsbCA9IG9wdHMub2Zmc2V0IHx8IDA7XG4gICAgdmFyIG9mZnNldFZlcnRpY2FsID0gb3B0cy5vZmZzZXRWZXJ0aWNhbCB8fCBvZmZzZXRBbGw7XG4gICAgdmFyIG9mZnNldEhvcml6b250YWwgPSBvcHRzLm9mZnNldEhvcml6b250YWwgfHwgb2Zmc2V0QWxsO1xuICAgIHZhciBvcHRpb25Ub0ludCA9IGZ1bmN0aW9uIChvcHQsIGZhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQob3B0IHx8IGZhbGxiYWNrLCAxMCk7XG4gICAgfTtcbiAgICBvZmZzZXQgPSB7XG4gICAgICB0OiBvcHRpb25Ub0ludChvcHRzLm9mZnNldFRvcCwgb2Zmc2V0VmVydGljYWwpLFxuICAgICAgYjogb3B0aW9uVG9JbnQob3B0cy5vZmZzZXRCb3R0b20sIG9mZnNldFZlcnRpY2FsKSxcbiAgICAgIGw6IG9wdGlvblRvSW50KG9wdHMub2Zmc2V0TGVmdCwgb2Zmc2V0SG9yaXpvbnRhbCksXG4gICAgICByOiBvcHRpb25Ub0ludChvcHRzLm9mZnNldFJpZ2h0LCBvZmZzZXRIb3Jpem9udGFsKVxuICAgIH07XG4gICAgZGVsYXkgPSBvcHRpb25Ub0ludChvcHRzLnRocm90dGxlLCAyNTApO1xuICAgIHVzZURlYm91bmNlID0gb3B0cy5kZWJvdW5jZSAhPT0gZmFsc2U7XG4gICAgdW5sb2FkID0gISFvcHRzLnVubG9hZDtcbiAgICBjYWxsYmFjayA9IG9wdHMuY2FsbGJhY2sgfHwgY2FsbGJhY2s7XG4gICAgZWNoby5yZW5kZXIoKTtcbiAgICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgcm9vdC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBkZWJvdW5jZU9yVGhyb3R0bGUsIGZhbHNlKTtcbiAgICAgIHJvb3QuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGRlYm91bmNlT3JUaHJvdHRsZSwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290LmF0dGFjaEV2ZW50KCdvbnNjcm9sbCcsIGRlYm91bmNlT3JUaHJvdHRsZSk7XG4gICAgICByb290LmF0dGFjaEV2ZW50KCdvbmxvYWQnLCBkZWJvdW5jZU9yVGhyb3R0bGUpO1xuICAgIH1cbiAgfTtcblxuICBlY2hvLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbWdbZGF0YS1lY2hvXSwgW2RhdGEtZWNoby1iYWNrZ3JvdW5kXScpO1xuICAgIHZhciBsZW5ndGggPSBub2Rlcy5sZW5ndGg7XG4gICAgdmFyIHNyYywgZWxlbTtcbiAgICB2YXIgdmlldyA9IHtcbiAgICAgIGw6IDAgLSBvZmZzZXQubCxcbiAgICAgIHQ6IDAgLSBvZmZzZXQudCxcbiAgICAgIGI6IChyb290LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpICsgb2Zmc2V0LmIsXG4gICAgICByOiAocm9vdC5pbm5lcldpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCkgKyBvZmZzZXQuclxuICAgIH07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgZWxlbSA9IG5vZGVzW2ldO1xuICAgICAgaWYgKGluVmlldyhlbGVtLCB2aWV3KSkge1xuXG4gICAgICAgIGlmICh1bmxvYWQpIHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLXBsYWNlaG9sZGVyJywgZWxlbS5zcmMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tYmFja2dyb3VuZCcpICE9PSBudWxsKSB7XG4gICAgICAgICAgZWxlbS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybChcIiArIGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWVjaG8tYmFja2dyb3VuZCcpICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZWxlbS5zcmMgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXVubG9hZCkge1xuICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWVjaG8nKTtcbiAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrKGVsZW0sICdsb2FkJyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh1bmxvYWQgJiYgISEoc3JjID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZWNoby1wbGFjZWhvbGRlcicpKSkge1xuXG4gICAgICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1lY2hvLWJhY2tncm91bmQnKSAhPT0gbnVsbCkge1xuICAgICAgICAgIGVsZW0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBzcmMgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBlbGVtLnNyYyA9IHNyYztcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWVjaG8tcGxhY2Vob2xkZXInKTtcbiAgICAgICAgY2FsbGJhY2soZWxlbSwgJ3VubG9hZCcpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgZWNoby5kZXRhY2goKTtcbiAgICB9XG4gIH07XG5cbiAgZWNoby5kZXRhY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHJvb3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZGVib3VuY2VPclRocm90dGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdC5kZXRhY2hFdmVudCgnb25zY3JvbGwnLCBkZWJvdW5jZU9yVGhyb3R0bGUpO1xuICAgIH1cbiAgICBjbGVhclRpbWVvdXQocG9sbCk7XG4gIH07XG5cbiAgcmV0dXJuIGVjaG87XG5cbn0pOyIsImltcG9ydCBXcml0ZXIgZnJvbSAnLi9tb2R1bGVzL1dyaXRlcic7XG5pbXBvcnQgVHJhbnNsYXRlciBmcm9tICcuL21vZHVsZXMvVHJhbnNsYXRlcic7XG5pbXBvcnQgUmlja1JvbGxlZCBmcm9tICcuL21vZHVsZXMvUmlja1JvbGxlZCc7XG5pbXBvcnQgZWNobyBmcm9tICAnLi9saWJzL2VjaG8ubWluLmpzJztcbmNvbnN0IGludHJvVGV4dCA9IGBoaSwgbXkgbmFtZSBpcyBwacOpcnJlIHJlaW1lcnR6LlxuXG5pIGFtIGEgaHVtYmxlIGRldmVsb3BlckBAQCMjIyMjIyMjI21hZ2ljaWFuQEBAIyMjIyMjIyNjb2RlciwgZGVzaWduZXIsIGZha2UtaXQtdGlsLXlvdS1tYWtlLWl0IyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNlbnRyZXByZW5ldXIgYW5kIGV2ZXJ5ZGF5IGh1c3RsZXIuXG5leHRyZW1lbHkgYWRkaWN0ZWQgb2YgYnVpbGRpbmcgdGhpbmdzLlxuXG4kaHR0cDovL2dpdGh1Yi5jb20vcmVpbWVydHokZ2l0aHViJCB8ICRodHRwOi8vdHdpdHRlci5jb20vcmVpbWVydHokdHdpdHRlciQgfCAkbWFpbHRvOnBpZXJyZS5yZWltZXJ0ekBnbWFpbC5jb20kaGlyZSBtZSQgYDtcblxuY29uc3Qgd3JpdGVyID0gbmV3IFdyaXRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud3JpdGVyJyksIGludHJvVGV4dCk7XG5jb25zdCB0cmFuc2xhdGVyID0gbmV3IFRyYW5zbGF0ZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpLCAxMCwgMTUpO1xuY29uc3QgcnIgPSBuZXcgUmlja1JvbGxlZCg1MDAwLCB0cnVlLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdhbGwtbXktc2VjcmV0LWFwaS1rZXlzJykpO1xuXG5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtcbiAgd3JpdGVyLnN0YXJ0KCk7XG4gIHRyYW5zbGF0ZXIuc3RhcnQoKTtcbiAgcnIuc3RhcnQoKTtcblxuICBlY2hvLmluaXQoe1xuICAgIG9mZnNldDogMTAwLFxuICAgIHRocm90dGxlOiAyNTAsXG4gICAgdW5sb2FkOiBmYWxzZSxcbiAgICBjYWxsYmFjazogZnVuY3Rpb24gKGVsZW1lbnQsIG9wKSB7XG4gICAgICBjb25zb2xlLmxvZyhlbGVtZW50LCAnaGFzIGJlZW4nLCBvcCArICdlZCcpXG4gICAgfVxuICB9KTtcbn0pO1xuXG5cbiIsImNvbnN0IG1kUm9sbGVkID0gW1xuICBbXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLX4nJy0sOjo6Ojo6Ojo6Ojo6Ojo6Ojo6OicnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sficnOjo6Ojo6OjonLDo6Ojo6OjogOjo6Ojo6Ojo6Ojo6OnwnLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLid8Ojo6Ojp8OiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6fDogOiA6LX5+LS0tOiA6IDogLS0tLS06IHxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLicnJ34tLHw6IDogOiA6IDogOiB+LS0tJzogOiA6IDosJy0tTkVWQSBHQUhOXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gR0lWRSBZT1UgVUhQXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4sLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7Ozs7OycsOiA6IDp8X198LiAuIC58Ozs7Ozs7Ozs7LCc7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLiwtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7Ozs7OzsgXFwuIC4gfDo6OnwuIC4gLicnLDs7Ozs7Ozs7fDs7L1xcblwiLFxuICBcIi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7IDs7O1xcLiAufDo6OnwuIC4gLiB8Ozs7Ozs7Ozt8L1xcblwiLFxuICBcIi4uLi4uLi4uLzs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OywnOzs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7OyA7Ozt8LiAuXFw6Ly4gLiAuIC58Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7JycsOiB8O3wuIC4gLiAuIFxcOzs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLH4nJzs7Ozs7Ozs7OzsgOzs7Ozs7Ozs7OzssLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7fC58O3wuIC4gLiAuIC58Ozs7Ozs7O3xcXG5cIixcbiAgXCIsficnOzs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7fCB8OnwuIC4gLiAuIHxcXDs7Ozs7Ozt8XCJdLFxuXG4gIFtcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLC1+ficnJycnJyd+fi0tLCxfXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC1+JyctLDo6Ojo6Ojo6Ojo6Ojo6Ojo6OjonJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6OjosLX4nJydfX18nJycnfn4tLX4nJyc6fVxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nfDo6Ojo6fDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLihfJyd+LSc6IDogOiA6bzogOiA6fDogOm86IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nJyd+LSx8OiA6IDogOiA6IDogfi0tLSc6IDogOiA6LCctLU5FVkEgR0FITlxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufCw6IDogOiA6IDogOi1+fi0tOiA6IDo6LyAtLS0tLSBMRVQgVSBEV05cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLl9fLC0nOzs7OztcXDonJy0sOiA6IDogOid+LS0tficnL3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi5fXywtficnOzs7Ozs7Lzs7Ozs7OztcXDogOlxcOiA6IDpfX19fLzogOicsX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7XFwuIC4gLicnfDo6Ojo6Ojo6fC4gLiwnOzs7Ozs7Ozs7OycnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLiwnIDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7O1xcLiAuIC5cXDo6Ojo6LCcuIC4vfDs7Ozs7Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4sLScnOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7Ozs7OycsOiA6IDp8X198LiAuIC58Ozs7Ozs7Ozs7LCc7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4sLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsnLDs7Ozs7Ozs7Ozs7IFxcLiAuIHw6Ojp8LiAuIC4nJyw7Ozs7Ozs7O3w7Oy9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7OzsgOzs7XFwuIC58Ojo6fC4gLiAuIHw7Ozs7Ozs7O3wvXFxuXCIsXG4gIFwiLi4uLi4uLi4uLzs7LC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OywnOzs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7OyA7Ozt8LiAuXFw6Ly4gLiAuIC58Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzssOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OycnLDogfDt8LiAuIC4gLiBcXDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4sficnOzs7Ozs7Ozs7OyA7Ozs7Ozs7Ozs7OywtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozt8Lnw7fC4gLiAuIC4gLnw7Ozs7Ozs7fFxcblwiLFxuICBcIi4sficnOzs7Ozs7Ozs7Ozs7OzsgOzs7Ozs7OzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7fCB8OnwuIC4gLiAuIHxcXDs7Ozs7Ozt8XCJdLFxuXG4gIFtcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4sLX5+JycnJycnJ35+LS0sLF9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtficnLSw6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6OiwtficnJ19fXycnJyd+fi0tficnJzp9XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJ3w6Ojo6Onw6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKF8nJ34tJzogOiA6IDpvOiA6IDp8OiA6bzogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJycnfi0sfDogOiA6IDogOiA6IH4tLS0nOiA6IDogOiwnLS1ORVZBIEdBSE4gVFVSTiBBSFJPVU5EXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnwsOiA6IDogOiA6IDotfn4tLTogOiA6Oi8gLS0tLS0gQU5EIERFU0VSVCBVXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLScnXFwnOlxcOiA6J34sLF86IDogOiA6IDogXywtJ1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uX18sLX4nJzs7Ozs7Oy87Ozs7Ozs7XFw6IDpcXDogOiA6X19fXy86IDonLF9fXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4sLX5+ficnJydfOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsLiAuJyctLDp8Ojo6Ojo6OnwuIC4gfDs7OzsnJy0sX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4sJyA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt8Ozs7Ozs7Ozs7OztcXC4gLiAuXFw6Ojo6OiwnLiAuL3w7Ozs7Ozs7Ozs7Ozs7fFxcblwiXVxuXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmlja1JvbGxlZCB7XG5cbiAgY29uc3RydWN0b3IoZGVsYXksIHNob3VsZEhpZGUsIGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudCkgdGhpcy5lbCA9IGVsZW1lbnQ7XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIHRoaXMuaW5kZXggPSAwO1xuICAgIHRoaXMuZGVsYXkgPSBkZWxheSB8fCAzMDAwO1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBmYWxzZTtcbiAgICB0aGlzLnNob3VsZEhpZGUgPSBzaG91bGRIaWRlIHx8IGZhbHNlO1xuICB9XG5cbiAgc3dhcCgpIHtcbiAgICB0aGlzLmluZGV4ID0gKHRoaXMuaW5kZXggKyAxKSAlIG1kUm9sbGVkLmxlbmd0aDtcblxuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gJyc7XG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSBtZFJvbGxlZFt0aGlzLmluZGV4XTtcblxuICAgIGlmKHRoaXMucHJpbnRUb0NvbnNvbGUpIGNvbnNvbGUubG9nKG1kUm9sbGVkW3RoaXMuaW5kZXhdKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmKHRoaXMuaW50ZXJ2YWwpIHJldHVybjtcblxuICAgIGlmKHRoaXMuc2hvdWxkSGlkZSkgdGhpcy5lbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHt0aGlzLnN3YXAoKX0sIHRoaXMuZGVsYXkpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZighdGhpcy5pbnRlcnZhbCkgcmV0dXJuO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgdGhpcy5pbnRlcnZhbCA9IGZhbHNlO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH1cbn1cbiIsImNvbnN0IGlzTW9iaWxlID0gL2lQaG9uZXxpUGFkfGlQb2R8QW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXG4gICAgICBtb3ZlRXZlbnQgPSBpc01vYmlsZSA/ICd0b3VjaG1vdmUnIDogJ21vdXNlbW92ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdyaXRlciB7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudCwgeFJvdGF0aW9uLCB5Um90YXRpb24pIHtcbiAgICB0aGlzLnhSb3RhdGlvbiA9IHhSb3RhdGlvbjtcbiAgICB0aGlzLnlSb3RhdGlvbiA9IHlSb3RhdGlvbjtcbiAgICB0aGlzLmVsID0gZWxlbWVudDtcbiAgICB0aGlzLmZyYW1lID0gZmFsc2U7XG4gICAgdGhpcy50aHJvdHRsZXIgPSBmYWxzZTtcbiAgfVxuXG4gIGhhbmRsZU1vdmUoY2xpZW50WCwgY2xpZW50WSl7XG4gICAgbGV0IHggPSAoKDEgLSAoY2xpZW50WSAvIHdpbmRvdy5pbm5lckhlaWdodCkpICogLTEpICogdGhpcy54Um90YXRpb24sXG4gICAgICAgIHkgPSAoY2xpZW50WCAvIHdpbmRvdy5pbm5lcldpZHRoKSAqIHRoaXMueVJvdGF0aW9uO1xuXG4gICAgdGhpcy5lbC5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlWCgke3h9ZGVnKSByb3RhdGVZKCR7eX1kZWcpYDtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMubGlzdGVuZXIgPSBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIobW92ZUV2ZW50LCAoZXZlbnQpID0+IHtcbiAgICAgIGlmKHRoaXMudGhyb3R0bGVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMudGhyb3R0bGVyID0gc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICAgICAgdGhpcy50aHJvdHRsZXIgPSBmYWxzZTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBpZihldmVudC50YXJnZXRUb3VjaGVzKSB0aGlzLmhhbmRsZU1vdmUoZXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYLCBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlTW92ZShldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCA1MCk7XG5cbiAgICB9KTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVFdmVudExpc3RlbmVyKG1vdmVFdmVudCwgdGhpcy5saXN0ZW5lcik7XG4gIH07XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gIH07XG59IiwiY29uc3QgdGltZW91dE1hcCA9IG5ldyBNYXAoKTtcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCcjJywgNTAvMik7IC8vZGVsZXRlXG4gICAgICB0aW1lb3V0TWFwLnNldCgnQCcsIDI1MC8yKTsgLy9wYXVzZVxuICAgICAgdGltZW91dE1hcC5zZXQoJywnLCAzNTAvMik7XG4gICAgICB0aW1lb3V0TWFwLnNldCgnLScsIDM1MC8yKTtcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCcuJywgNTAwLzIpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJz8nLCA3NTAvMik7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdyaXRlciB7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRzLCBzdHJpbmcpIHtcbiAgICB0aGlzLmVsID0gZWxlbWVudHM7XG4gICAgdGhpcy5zID0gc3RyaW5nO1xuICAgIHRoaXMuaXNXcml0aW5nTGluayA9IGZhbHNlO1xuICB9XG5cbiAgdXBkYXRlV3JpdGVycyhjaGFyYWN0ZXIpIHtcblxuICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuZWwsIChlbGVtZW50KSA9PiB7XG4gICAgICBsZXQgb2xkRWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICBlbGVtZW50ID0gKHRoaXMuaXNXcml0aW5nTGluaykgPyBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2E6bGFzdC1jaGlsZCcpIDogZWxlbWVudDtcblxuICAgICAgaWYgKGNoYXJhY3RlciA9PT0gJ0AnKSByZXR1cm47XG5cbiAgICAgIGVsc2UgaWYgKGNoYXJhY3RlciA9PT0gJyMnKSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gZWxlbWVudC5pbm5lckhUTUwuc2xpY2UoMCwgLTEpO1xuICAgICAgICBpZihvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0JykubGVuZ3RoID4gMCl7XG4gICAgICAgICAgb2xkRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcsIG9sZEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnKS5zbGljZSgwLC0xKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnKicpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgKz0gJzxicj4nO1xuICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpICsgJ1xcYScpO1xuICAgICAgfVxuXG4gICAgICBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICckJykge1xuICAgICAgICBpZiAoIXRoaXMuaXNXcml0aW5nTGluaykge1xuICAgICAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG5cbiAgICAgICAgICBsaW5rLmhyZWYgPSB0aGlzLnMuc3BsaXQoJyQnKVswXTtcbiAgICAgICAgICBsaW5rLnRhcmdldCA9ICdfYmxhbmsnO1xuXG5cbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGxpbmspO1xuXG4gICAgICAgICAgdGhpcy5pc1dyaXRpbmdMaW5rID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnMgPSB0aGlzLnMuc3Vic3RyaW5nKHRoaXMucy5zcGxpdCgnJCcpWzBdLmxlbmd0aCsxLCB0aGlzLnMubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLmlzV3JpdGluZ0xpbmsgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MICs9IGNoYXJhY3RlcjtcbiAgICAgICAgb2xkRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcsIG9sZEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnKSArIGNoYXJhY3Rlcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB3cml0ZXIoYmVRdWljaykge1xuICAgIGxldCB0ZXh0LCBtc0RlbGF5O1xuXG4gICAgaWYgKHRoaXMucy5sZW5ndGggPT09IDApIHJldHVybiB0aGlzLmlzRG9uZSgpO1xuXG4gICAgdGV4dCA9IHRoaXMucy5zdWJzdHJpbmcoMCwxKTtcbiAgICB0aGlzLnMgPSAgdGhpcy5zLnN1YnN0cmluZygxLHRoaXMucy5sZW5ndGgpO1xuICAgIHRoaXMudXBkYXRlV3JpdGVycyh0ZXh0KTtcblxuICAgIGlmIChiZVF1aWNrKSAgICAgICAgICByZXR1cm4gdGhpcy53cml0ZXIodHJ1ZSk7XG5cbiAgICBtc0RlbGF5ID0gdGltZW91dE1hcC5nZXQodGV4dCkgfHwgTWF0aC5yYW5kb20oKSAqIDE1MDtcblxuICAgIHJldHVybiBzZXRUaW1lb3V0KCgpID0+IHt0aGlzLndyaXRlcigpfSwgbXNEZWxheSk7XG5cbiAgfTtcblxuICB1cGRhdGVMYXN0UmVhZCgpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVhZC1ldmVyeXRoaW5nLWF0JywgRGF0ZS5ub3coKSk7XG4gIH1cblxuICBnZXQgZ2V0TGFzdFJlYWQoKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdyZWFkLWV2ZXJ5dGhpbmctYXQnKSk7XG4gIH1cblxuICBpc0RvbmUoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdpbnRyby1pcy1kb25lJyk7XG4gICAgdGhpcy51cGRhdGVMYXN0UmVhZCgpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCh0aGlzLmdldExhc3RSZWFkICsgNTAwMCkgPCBEYXRlLm5vdygpKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxhc3RSZWFkKCk7XG4gICAgICB0aGlzLndyaXRlcih0cnVlKTtcbiAgICAgIHRoaXMuaXNEb25lKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy53cml0ZXIoKTtcbiAgICB9XG4gIH1cbn0iXX0=
