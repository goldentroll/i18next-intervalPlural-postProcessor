(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.i18nextIntervalPluralPostProcessor = factory());
}(this, (function () { 'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function intervalMatches(interval, count) {
  if (interval.indexOf('-') > -1) {
    var p = interval.split('-');
    if (p[1] === 'inf') {
      var from = parseInt(p[0], 10);
      return count >= from;
    } else {
      var _from = parseInt(p[0], 10);
      var to = parseInt(p[1], 10);
      return count >= _from && count <= to;
    }
  } else {
    var match = parseInt(interval, 10);
    return match === count;
  }
}

var index = {
  name: 'interval',
  type: 'postProcessor',

  options: {
    intervalSeparator: ';',
    intervalRegex: /\((\S*)\).*{(.*)}/,
    intervalSuffix: '_interval'
  },

  setOptions: function setOptions(options) {
    this.options = _extends({}, this.options, options);
  },
  process: function process(value, key, options, translator) {
    var _this = this;

    var p = value.split(this.options.intervalSeparator);

    var found = void 0;
    p.forEach(function (iv) {
      if (found) return;
      var match = _this.options.intervalRegex.exec(iv);

      if (match && intervalMatches(match[1], options.count || 0)) {
        found = match[2];
      }
    });

    // not found fallback to classical plural
    if (!found) {
      var newOptions = _extends({}, options);
      if (typeof newOptions.postProcess === 'string') {
        delete newOptions.postProcess;
      } else {
        var index = newOptions.postProcess.indexOf('interval'); // <-- Not supported in <IE9
        if (index !== -1) newOptions.postProcess.splice(index, 1);
      }

      var newKeys = void 0;
      if (typeof key === 'string') {
        newKeys = key.replace(this.options.intervalSuffix, '');
      } else if (key.length > -1) {
        newKeys = key.map(function (k) {
          return k.replace(_this.options.intervalSuffix, '');
        });
      }
      if (newKeys) found = translator.translate(newKeys, newOptions);
    }

    return found || value;
  }
};

return index;

})));
