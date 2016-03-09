(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('i18nextIntervalPluralPostProcessor', factory) :
  (global.i18nextIntervalPluralPostProcessor = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};

  babelHelpers.extends = Object.assign || function (target) {
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

  babelHelpers;

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
      intervalRegex: /^\((\S*)\){(.*)}$/,
      intervalSuffix: '_interval'
    },

    setOptions: function setOptions(options) {
      this.options = babelHelpers.extends({}, options, this.options);
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
        var newOptions = babelHelpers.extends({}, options);
        if (typeof newOptions.postProcess === 'string') {
          delete newOptions.postProcess;
        } else {
          var index = newOptions.postProcess.indexOf('interval'); // <-- Not supported in <IE9
          if (index !== -1) newOptions.postProcess.splice(index, 1);
        }
        found = translator.translate(key.replace(this.options.intervalSuffix, ''), newOptions);
      }

      return found || value;
    }
  };

  return index;

}));