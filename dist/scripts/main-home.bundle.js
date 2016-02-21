(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Writer = require('./modules/Writer');

var _Writer2 = _interopRequireDefault(_Writer);

var _Translater = require('./modules/Translater');

var _Translater2 = _interopRequireDefault(_Translater);

var _RickRolled = require('./modules/RickRolled');

var _RickRolled2 = _interopRequireDefault(_RickRolled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var introText = 'hi, my name is piérre reimertz.\n\ni am a humble developer@@@#########magician@@@########coder, designer, fake-it-til-you-make-it#######################entreprenaur and everyday hustler.\nextremely addicted of building things.\n\n$http://github.com/reimertz$github$ | $http://twitter.com/reimertz$twitter$ | $mailto:pierre.reimertz@gmail.com$hire me$ ';

var writer = new _Writer2.default(document.querySelectorAll('.writer'), introText);
var translater = new _Translater2.default(document.querySelector('main'), 10, 15);
var rr = new _RickRolled2.default(3000, true, document.querySelector('all-my-secret-api-keys'));

requestAnimationFrame(function () {
  writer.start();
  translater.start();
  rr.start();
});

},{"./modules/RickRolled":2,"./modules/Translater":3,"./modules/Writer":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
      if (this.getLastRead + 5000 > Date.now()) {
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvc2NyaXB0cy9tYWluLWhvbWUuanMiLCJzcmMvc2NyaXB0cy9tb2R1bGVzL1JpY2tSb2xsZWQuanMiLCJzcmMvc2NyaXB0cy9tb2R1bGVzL1RyYW5zbGF0ZXIuanMiLCJzcmMvc2NyaXB0cy9tb2R1bGVzL1dyaXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNJQSxJQUFNLDZXQUFOOztBQU9BLElBQU0sU0FBUyxxQkFBVyxTQUFTLGdCQUFULENBQTBCLFNBQTFCLENBQVgsRUFBaUQsU0FBakQsQ0FBVDtBQUNOLElBQU0sYUFBYSx5QkFBZSxTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBZixFQUErQyxFQUEvQyxFQUFtRCxFQUFuRCxDQUFiO0FBQ04sSUFBTSxLQUFLLHlCQUFlLElBQWYsRUFBcUIsSUFBckIsRUFBMkIsU0FBUyxhQUFULENBQXVCLHdCQUF2QixDQUEzQixDQUFMOztBQUVOLHNCQUFzQixZQUFVO0FBQzlCLFNBQU8sS0FBUCxHQUQ4QjtBQUU5QixhQUFXLEtBQVgsR0FGOEI7QUFHOUIsS0FBRyxLQUFILEdBSDhCO0NBQVYsQ0FBdEI7Ozs7Ozs7Ozs7Ozs7QUNmQSxJQUFNLFdBQVcsQ0FDZixDQUFDLGdGQUFELEVBQ0EsdUZBREEsRUFFQSwwRkFGQSxFQUdBLGtGQUhBLEVBSUEsMEZBSkEsRUFLQSxvRkFMQSxFQU1BLG9GQU5BLEVBT0EsZ0dBUEEsRUFRQSxvR0FSQSxFQVNBLGlGQVRBLEVBVUEsOEVBVkEsRUFXQSwrRUFYQSxFQVlBLDZGQVpBLEVBYUEsa0dBYkEsRUFjQSxrR0FkQSxFQWVBLGlHQWZBLEVBZ0JBLGtHQWhCQSxFQWlCQSwrRkFqQkEsRUFrQkEsK0ZBbEJBLEVBbUJBLCtGQW5CQSxFQW9CQSxnR0FwQkEsRUFxQkEsK0ZBckJBLENBRGUsRUF3QmYsQ0FBQyxpRkFBRCxFQUNBLHdGQURBLEVBRUEsMkZB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QU8sU0FBUCxDQUFpQixDQUFqQixFQUFtQixLQUFLLENBQUwsQ0FBTyxNQUFQLENBQTdCLENBTmM7QUFPZCxXQUFLLGFBQUwsQ0FBbUIsSUFBbkIsRUFQYzs7QUFTZCxVQUFJLE9BQUosRUFBc0IsT0FBTyxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQVAsQ0FBdEI7O0FBRUEsZ0JBQVUsV0FBVyxHQUFYLENBQWUsSUFBZixLQUF3QixLQUFLLE1BQUwsS0FBZ0IsR0FBaEIsQ0FYcEI7O0FBYWQsYUFBTyxXQUFXLFlBQU07QUFBQyxlQUFLLE1BQUwsR0FBRDtPQUFOLEVBQXVCLE9BQWxDLENBQVAsQ0FiYzs7OztxQ0FpQkM7QUFDZixtQkFBYSxPQUFiLENBQXFCLG9CQUFyQixFQUEyQyxLQUFLLEdBQUwsRUFBM0MsRUFEZTs7Ozs2QkFRUjtBQUNQLGVBQVMsSUFBVCxDQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBNEIsZUFBNUIsRUFETztBQUVQLFdBQUssY0FBTCxHQUZPOzs7OzRCQUtEO0FBQ04sVUFBSSxJQUFDLENBQUssV0FBTCxHQUFtQixJQUFuQixHQUE0QixLQUFLLEdBQUwsRUFBN0IsRUFBeUM7QUFDM0MsYUFBSyxjQUFMLEdBRDJDO0FBRTNDLGFBQUssTUFBTCxDQUFZLElBQVosRUFGMkM7QUFHM0MsYUFBSyxNQUFMLEdBSDJDO09BQTdDLE1BS0s7QUFDSCxhQUFLLE1BQUwsR0FERztPQUxMOzs7O3dCQVZnQjtBQUNoQixhQUFPLFNBQVMsYUFBYSxPQUFiLENBQXFCLG9CQUFyQixDQUFULENBQVAsQ0FEZ0I7Ozs7U0F4RUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFdyaXRlciBmcm9tICcuL21vZHVsZXMvV3JpdGVyJztcbmltcG9ydCBUcmFuc2xhdGVyIGZyb20gJy4vbW9kdWxlcy9UcmFuc2xhdGVyJztcbmltcG9ydCBSaWNrUm9sbGVkIGZyb20gJy4vbW9kdWxlcy9SaWNrUm9sbGVkJztcblxuY29uc3QgaW50cm9UZXh0ID0gYGhpLCBteSBuYW1lIGlzIHBpw6lycmUgcmVpbWVydHouXG5cbmkgYW0gYSBodW1ibGUgZGV2ZWxvcGVyQEBAIyMjIyMjIyMjbWFnaWNpYW5AQEAjIyMjIyMjI2NvZGVyLCBkZXNpZ25lciwgZmFrZS1pdC10aWwteW91LW1ha2UtaXQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI2VudHJlcHJlbmF1ciBhbmQgZXZlcnlkYXkgaHVzdGxlci5cbmV4dHJlbWVseSBhZGRpY3RlZCBvZiBidWlsZGluZyB0aGluZ3MuXG5cbiRodHRwOi8vZ2l0aHViLmNvbS9yZWltZXJ0eiRnaXRodWIkIHwgJGh0dHA6Ly90d2l0dGVyLmNvbS9yZWltZXJ0eiR0d2l0dGVyJCB8ICRtYWlsdG86cGllcnJlLnJlaW1lcnR6QGdtYWlsLmNvbSRoaXJlIG1lJCBgO1xuXG5jb25zdCB3cml0ZXIgPSBuZXcgV3JpdGVyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53cml0ZXInKSwgaW50cm9UZXh0KTtcbmNvbnN0IHRyYW5zbGF0ZXIgPSBuZXcgVHJhbnNsYXRlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJyksIDEwLCAxNSk7XG5jb25zdCByciA9IG5ldyBSaWNrUm9sbGVkKDMwMDAsIHRydWUsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2FsbC1teS1zZWNyZXQtYXBpLWtleXMnKSk7XG5cbnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpe1xuICB3cml0ZXIuc3RhcnQoKTtcbiAgdHJhbnNsYXRlci5zdGFydCgpO1xuICByci5zdGFydCgpO1xufSk7XG5cblxuIiwiY29uc3QgbWRSb2xsZWQgPSBbXG4gIFtcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4sLX5+JycnJycnJ35+LS0sLF9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtficnLSw6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLix+Jyc6Ojo6Ojo6OicsOjo6Ojo6OiA6Ojo6Ojo6Ojo6Ojo6fCcsXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6OiwtficnJ19fXycnJyd+fi0tficnJzp9XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJ3w6Ojo6Onw6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojp8OiA6IDotfn4tLS06IDogOiAtLS0tLTogfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKF8nJ34tJzogOiA6IDpvOiA6IDp8OiA6bzogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJycnfi0sfDogOiA6IDogOiA6IH4tLS0nOiA6IDogOiwnLS1ORVZBIEdBSE5cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufCw6IDogOiA6IDogOi1+fi0tOiA6IDo6LyAtLS0tLSBHSVZFIFlPVSBVSFBcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtJydcXCc6XFw6IDonfiwsXzogOiA6IDogOiBfLC0nXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi5fXywtJzs7Ozs7XFw6JyctLDogOiA6IDonfi0tLX4nJy98XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi5fXywtficnOzs7Ozs7Lzs7Ozs7OztcXDogOlxcOiA6IDpfX19fLzogOicsX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4gLiwtfn5+JycnJ187Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7JywuIC4nJy0sOnw6Ojo6Ojo6fC4gLiB8Ozs7OycnLSxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7O1xcLiAuIC4nJ3w6Ojo6Ojo6OnwuIC4sJzs7Ozs7Ozs7OzsnJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLiwnIDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7O1xcLiAuIC5cXDo6Ojo6LCcuIC4vfDs7Ozs7Ozs7Ozs7Ozt8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLiwtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7Ozs7Jyw6IDogOnxfX3wuIC4gLnw7Ozs7Ozs7OzssJzs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLC0nOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Jyw7Ozs7Ozs7Ozs7OyBcXC4gLiB8Ojo6fC4gLiAuJycsOzs7Ozs7Ozt8OzsvXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7OzsgOzs7XFwuIC58Ojo6fC4gLiAuIHw7Ozs7Ozs7O3wvXFxuXCIsXG4gIFwiLi4uLi4uLi4vOzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LCc7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7IDs7O3wuIC5cXDovLiAuIC4gLnw7Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7IDs7Ozs7OzsnJyw6IHw7fC4gLiAuIC4gXFw7Ozs7Ozs7fFxcblwiLFxuICBcIi4uLi4sficnOzs7Ozs7Ozs7OyA7Ozs7Ozs7Ozs7OywtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1xcOzs7Ozs7Ozt8Lnw7fC4gLiAuIC4gLnw7Ozs7Ozs7fFxcblwiLFxuICBcIix+Jyc7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7OywtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Jyw7Ozs7Ozt8IHw6fC4gLiAuIC4gfFxcOzs7Ozs7O3xcIl0sXG5cbiAgW1wiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4sLX5+JycnJycnJ35+LS0sLF9cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4sLX4nJy0sOjo6Ojo6Ojo6Ojo6Ojo6Ojo6OicnLSxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLH4nJzo6Ojo6Ojo6Jyw6Ojo6Ojo6IDo6Ojo6Ojo6Ojo6Ojp8JyxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufDo6Ojo6OiwtficnJ19fXycnJyd+fi0tficnJzp9XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLid8Ojo6Ojp8OiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6Onw6IDogOi1+fi0tLTogOiA6IC0tLS0tOiB8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uKF8nJ34tJzogOiA6IDpvOiA6IDp8OiA6bzogOiA6IDp8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLicnJ34tLHw6IDogOiA6IDogOiB+LS0tJzogOiA6IDosJy0tTkVWQSBHQUhOXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58LDogOiA6IDogOiA6LX5+LS06IDogOjovIC0tLS0tIExFVCBVIERXTlxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtJydcXCc6XFw6IDonfiwsXzogOiA6IDogOiBfLC0nXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uX18sLSc7Ozs7O1xcOicnLSw6IDogOiA6J34tLS1+JycvfFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLl9fLC1+Jyc7Ozs7OzsvOzs7Ozs7O1xcOiA6XFw6IDogOl9fX18vOiA6JyxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4gLiwtfn5+JycnJ187Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7JywuIC4nJy0sOnw6Ojo6Ojo6fC4gLiB8Ozs7OycnLSxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLi4vOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7OztcXC4gLiAuJyd8Ojo6Ojo6Ojp8LiAuLCc7Ozs7Ozs7Ozs7JyctLFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi4uLCcgOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7XFwuIC4gLlxcOjo6OjosJy4gLi98Ozs7Ozs7Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLiwtJyc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztcXDs7Ozs7Ozs7Ozs7Jyw6IDogOnxfX3wuIC4gLnw7Ozs7Ozs7OzssJzs7fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLiwtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OycsOzs7Ozs7Ozs7OzsgXFwuIC4gfDo6OnwuIC4gLicnLDs7Ozs7Ozs7fDs7L1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7fDs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7OyA7OztcXC4gLnw6Ojp8LiAuIC4gfDs7Ozs7Ozs7fC9cXG5cIixcbiAgXCIuLi4uLi4uLi4vOzssLSc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LCc7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7IDs7O3wuIC5cXDovLiAuIC4gLnw7Ozs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Oyw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7JycsOiB8O3wuIC4gLiAuIFxcOzs7Ozs7O3xcXG5cIixcbiAgXCIuLi4uLix+Jyc7Ozs7Ozs7Ozs7IDs7Ozs7Ozs7Ozs7LC0nJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7XFw7Ozs7Ozs7O3wufDt8LiAuIC4gLiAufDs7Ozs7Ozt8XFxuXCIsXG4gIFwiLix+Jyc7Ozs7Ozs7Ozs7Ozs7OyA7Ozs7Ozs7OywtJzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Jyw7Ozs7Ozt8IHw6fC4gLiAuIC4gfFxcOzs7Ozs7O3xcIl0sXG5cbiAgW1wiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4gLi4uLi4uLiwtfn4nJycnJycnfn4tLSwsX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLC1+JyctLDo6Ojo6Ojo6Ojo6Ojo6Ojo6OjonJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLH4nJzo6Ojo6Ojo6Jyw6Ojo6Ojo6IDo6Ojo6Ojo6Ojo6Ojp8JyxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi58Ojo6Ojo6LC1+JycnX19fJycnJ35+LS1+JycnOn1cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nfDo6Ojo6fDogOiA6IDogOiA6IDogOiA6IDogOiA6IDogOiA6fFxcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLiAuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLnw6Ojo6Onw6IDogOi1+fi0tLTogOiA6IC0tLS0tOiB8XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4oXycnfi0nOiA6IDogOm86IDogOnw6IDpvOiA6IDogOnxcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nJyd+LSx8OiA6IDogOiA6IDogfi0tLSc6IDogOiA6LCctLU5FVkEgR0FITiBUVVJOIEFIUk9VTkRcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4ufCw6IDogOiA6IDogOi1+fi0tOiA6IDo6LyAtLS0tLSBBTkQgREVTRVJUIFVcXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLiwtJydcXCc6XFw6IDonfiwsXzogOiA6IDogOiBfLC0nXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi4uLi4uLi4uLi5fXywtJzs7Ozs7XFw6JyctLDogOiA6IDonfi0tLX4nJy98XFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLi4uIC4uLi4uLi4uLi4uLi5fXywtficnOzs7Ozs7Lzs7Ozs7OztcXDogOlxcOiA6IDpfX19fLzogOicsX19cXG5cIixcbiAgXCIuLi4uLi4uLi4uLi4uLi4gLiwtfn5+JycnJ187Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7JywuIC4nJy0sOnw6Ojo6Ojo6fC4gLiB8Ozs7OycnLSxfX1xcblwiLFxuICBcIi4uLi4uLi4uLi4uLi4uLi87Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7LDs7Ozs7Ozs7O1xcLiAuIC4nJ3w6Ojo6Ojo6OnwuIC4sJzs7Ozs7Ozs7OzsnJy0sXFxuXCIsXG4gIFwiLi4uLi4uLi4uLi4uLiwnIDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3w7Ozs7Ozs7Ozs7O1xcLiAuIC5cXDo6Ojo6LCcuIC4vfDs7Ozs7Ozs7Ozs7Ozt8XFxuXCJdXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSaWNrUm9sbGVkIHtcblxuICBjb25zdHJ1Y3RvcihkZWxheSwgc2hvdWxkSGlkZSwgZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50KSB0aGlzLmVsID0gZWxlbWVudDtcbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnBhcmVudE5vZGU7XG4gICAgfVxuXG4gICAgdGhpcy5pbmRleCA9IDA7XG4gICAgdGhpcy5kZWxheSA9IGRlbGF5IHx8IDMwMDA7XG4gICAgdGhpcy5pbnRlcnZhbCA9IGZhbHNlO1xuICAgIHRoaXMuc2hvdWxkSGlkZSA9IHNob3VsZEhpZGUgfHwgZmFsc2U7XG4gIH1cblxuICBzd2FwKCkge1xuICAgIHRoaXMuaW5kZXggPSAodGhpcy5pbmRleCArIDEpICUgbWRSb2xsZWQubGVuZ3RoO1xuXG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSAnJztcbiAgICB0aGlzLmVsLmlubmVySFRNTCA9IG1kUm9sbGVkW3RoaXMuaW5kZXhdO1xuXG4gICAgaWYodGhpcy5wcmludFRvQ29uc29sZSkgY29uc29sZS5sb2cobWRSb2xsZWRbdGhpcy5pbmRleF0pO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYodGhpcy5pbnRlcnZhbCkgcmV0dXJuO1xuXG4gICAgaWYodGhpcy5zaG91bGRIaWRlKSB0aGlzLmVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge3RoaXMuc3dhcCgpfSwgdGhpcy5kZWxheSk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGlmKCF0aGlzLmludGVydmFsKSByZXR1cm47XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB0aGlzLmludGVydmFsID0gZmFsc2U7XG4gIH1cblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfVxufVxuIiwiY29uc3QgaXNNb2JpbGUgPSAvaVBob25lfGlQYWR8aVBvZHxBbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgIG1vdmVFdmVudCA9IGlzTW9iaWxlID8gJ3RvdWNobW92ZScgOiAnbW91c2Vtb3ZlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JpdGVyIHtcblxuICBjb25zdHJ1Y3RvcihlbGVtZW50LCB4Um90YXRpb24sIHlSb3RhdGlvbikge1xuICAgIHRoaXMueFJvdGF0aW9uID0geFJvdGF0aW9uO1xuICAgIHRoaXMueVJvdGF0aW9uID0geVJvdGF0aW9uO1xuICAgIHRoaXMuZWwgPSBlbGVtZW50O1xuICAgIHRoaXMuZnJhbWUgPSBmYWxzZTtcbiAgICB0aGlzLnRocm90dGxlciA9IGZhbHNlO1xuICB9XG5cbiAgaGFuZGxlTW92ZShjbGllbnRYLCBjbGllbnRZKXtcbiAgICBsZXQgeCA9ICgoMSAtIChjbGllbnRZIC8gd2luZG93LmlubmVySGVpZ2h0KSkgKiAtMSkgKiB0aGlzLnhSb3RhdGlvbixcbiAgICAgICAgeSA9IChjbGllbnRYIC8gd2luZG93LmlubmVyV2lkdGgpICogdGhpcy55Um90YXRpb247XG5cbiAgICB0aGlzLmVsLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGVYKCR7eH1kZWcpIHJvdGF0ZVkoJHt5fWRlZylgO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5saXN0ZW5lciA9IGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihtb3ZlRXZlbnQsIChldmVudCkgPT4ge1xuICAgICAgaWYodGhpcy50aHJvdHRsZXIpIHJldHVybjtcblxuICAgICAgdGhpcy50aHJvdHRsZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcblxuICAgICAgICB0aGlzLnRocm90dGxlciA9IGZhbHNlO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGlmKGV2ZW50LnRhcmdldFRvdWNoZXMpIHRoaXMuaGFuZGxlTW92ZShldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFgsIGV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WSk7XG4gICAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVNb3ZlKGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICAgICAgICB9KTtcbiAgICAgIH0sIDUwKTtcblxuICAgIH0pO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIobW92ZUV2ZW50LCB0aGlzLmxpc3RlbmVyKTtcbiAgfTtcblxuICBwYXVzZSgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgfTtcbn0iLCJjb25zdCB0aW1lb3V0TWFwID0gbmV3IE1hcCgpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJyMnLCA1MC8yKTsgLy9kZWxldGVcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCdAJywgMjUwLzIpOyAvL3BhdXNlXG4gICAgICB0aW1lb3V0TWFwLnNldCgnLCcsIDM1MC8yKTtcbiAgICAgIHRpbWVvdXRNYXAuc2V0KCctJywgMzUwLzIpO1xuICAgICAgdGltZW91dE1hcC5zZXQoJy4nLCA1MDAvMik7XG4gICAgICB0aW1lb3V0TWFwLnNldCgnPycsIDc1MC8yKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV3JpdGVyIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudHMsIHN0cmluZykge1xuICAgIHRoaXMuZWwgPSBlbGVtZW50cztcbiAgICB0aGlzLnMgPSBzdHJpbmc7XG4gICAgdGhpcy5pc1dyaXRpbmdMaW5rID0gZmFsc2U7XG4gIH1cblxuICB1cGRhdGVXcml0ZXJzKGNoYXJhY3Rlcikge1xuXG4gICBbXS5mb3JFYWNoLmNhbGwodGhpcy5lbCwgKGVsZW1lbnQpID0+IHtcbiAgICAgIGxldCBvbGRFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIGVsZW1lbnQgPSAodGhpcy5pc1dyaXRpbmdMaW5rKSA/IGVsZW1lbnQucXVlcnlTZWxlY3RvcignYTpsYXN0LWNoaWxkJykgOiBlbGVtZW50O1xuXG4gICAgICBpZiAoY2hhcmFjdGVyID09PSAnQCcpIHJldHVybjtcblxuICAgICAgZWxzZSBpZiAoY2hhcmFjdGVyID09PSAnIycpIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTC5zbGljZSgwLCAtMSk7XG4gICAgICAgIGlmKG9sZEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpLnNsaWNlKDAsLTEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbHNlIGlmIChjaGFyYWN0ZXIgPT09ICcqJykge1xuICAgICAgICBlbGVtZW50LmlubmVySFRNTCArPSAnPGJyPic7XG4gICAgICAgIG9sZEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0aHJlZS1kLXRleHQnLCBvbGRFbGVtZW50LmdldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0JykgKyAnXFxhJyk7XG4gICAgICB9XG5cbiAgICAgIGVsc2UgaWYgKGNoYXJhY3RlciA9PT0gJyQnKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1dyaXRpbmdMaW5rKSB7XG4gICAgICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuICAgICAgICAgIGxpbmsuaHJlZiA9IHRoaXMucy5zcGxpdCgnJCcpWzBdO1xuICAgICAgICAgIGxpbmsudGFyZ2V0ID0gJ19ibGFuayc7XG5cblxuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQobGluayk7XG5cbiAgICAgICAgICB0aGlzLmlzV3JpdGluZ0xpbmsgPSB0cnVlO1xuICAgICAgICAgIHRoaXMucyA9IHRoaXMucy5zdWJzdHJpbmcodGhpcy5zLnNwbGl0KCckJylbMF0ubGVuZ3RoKzEsIHRoaXMucy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuaXNXcml0aW5nTGluayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgKz0gY2hhcmFjdGVyO1xuICAgICAgICBvbGRFbGVtZW50LnNldEF0dHJpYnV0ZSgndGhyZWUtZC10ZXh0Jywgb2xkRWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RocmVlLWQtdGV4dCcpICsgY2hhcmFjdGVyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHdyaXRlcihiZVF1aWNrKSB7XG4gICAgbGV0IHRleHQsIG1zRGVsYXk7XG5cbiAgICBpZiAodGhpcy5zLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRoaXMuaXNEb25lKCk7XG5cbiAgICB0ZXh0ID0gdGhpcy5zLnN1YnN0cmluZygwLDEpO1xuICAgIHRoaXMucyA9ICB0aGlzLnMuc3Vic3RyaW5nKDEsdGhpcy5zLmxlbmd0aCk7XG4gICAgdGhpcy51cGRhdGVXcml0ZXJzKHRleHQpO1xuXG4gICAgaWYgKGJlUXVpY2spICAgICAgICAgIHJldHVybiB0aGlzLndyaXRlcih0cnVlKTtcblxuICAgIG1zRGVsYXkgPSB0aW1lb3V0TWFwLmdldCh0ZXh0KSB8fCBNYXRoLnJhbmRvbSgpICogMTUwO1xuXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKCkgPT4ge3RoaXMud3JpdGVyKCl9LCBtc0RlbGF5KTtcblxuICB9O1xuXG4gIHVwZGF0ZUxhc3RSZWFkKCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyZWFkLWV2ZXJ5dGhpbmctYXQnLCBEYXRlLm5vdygpKTtcbiAgfVxuXG4gIGdldCBnZXRMYXN0UmVhZCgpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JlYWQtZXZlcnl0aGluZy1hdCcpKTtcbiAgfVxuXG4gIGlzRG9uZSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2ludHJvLWlzLWRvbmUnKTtcbiAgICB0aGlzLnVwZGF0ZUxhc3RSZWFkKCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoKHRoaXMuZ2V0TGFzdFJlYWQgKyA1MDAwKSA+ICBEYXRlLm5vdygpKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxhc3RSZWFkKCk7XG4gICAgICB0aGlzLndyaXRlcih0cnVlKTtcbiAgICAgIHRoaXMuaXNEb25lKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy53cml0ZXIoKTtcbiAgICB9XG4gIH1cbn0iXX0=
