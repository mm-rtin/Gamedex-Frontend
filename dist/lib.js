//  Underscore.string
//  (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
//  Underscore.string is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from MooTools and Alexandru Marasteanu.
//  Version '2.3.0'

!function(root, String){
  'use strict';

  // Defining helper functions.

  var nativeTrim = String.prototype.trim;
  var nativeTrimRight = String.prototype.trimRight;
  var nativeTrimLeft = String.prototype.trimLeft;

  var parseNumber = function(source) { return source * 1 || 0; };

  var strRepeat = function(str, qty){
    if (qty < 1) return '';
    var result = '';
    while (qty > 0) {
      if (qty & 1) result += str;
      qty >>= 1, str += str;
    }
    return result;
  };

  var slice = [].slice;

  var defaultToWhiteSpace = function(characters) {
    if (characters == null)
      return '\\s';
    else if (characters.source)
      return characters.source;
    else
      return '[' + _s.escapeRegExp(characters) + ']';
  };

  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: "'"
  };

  var reversedEscapeChars = {};
  for(var key in escapeChars) reversedEscapeChars[escapeChars[key]] = key;
  reversedEscapeChars["'"] = '#39';

  // sprintf() for JavaScript 0.7-beta1
  // http://www.diveintojavascript.com/projects/javascript-sprintf
  //
  // Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
  // All rights reserved.

  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    var str_repeat = strRepeat;

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          } else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
          }
          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw new Error('[_.sprintf] huh?');
                }
              }
            }
            else {
              throw new Error('[_.sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw new Error('[_.sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();



  // Defining underscore.string

  var _s = {

    VERSION: '2.3.0',

    isBlank: function(str){
      if (str == null) str = '';
      return (/^\s*$/).test(str);
    },

    stripTags: function(str){
      if (str == null) return '';
      return String(str).replace(/<\/?[^>]+>/g, '');
    },

    capitalize : function(str){
      str = str == null ? '' : String(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    chop: function(str, step){
      if (str == null) return [];
      str = String(str);
      step = ~~step;
      return step > 0 ? str.match(new RegExp('.{1,' + step + '}', 'g')) : [str];
    },

    clean: function(str){
      return _s.strip(str).replace(/\s+/g, ' ');
    },

    count: function(str, substr){
      if (str == null || substr == null) return 0;

      str = String(str);
      substr = String(substr);

      var count = 0,
        pos = 0,
        length = substr.length;

      while (true) {
        pos = str.indexOf(substr, pos);
        if (pos === -1) break;
        count++;
        pos += length;
      }

      return count;
    },

    chars: function(str) {
      if (str == null) return [];
      return String(str).split('');
    },

    swapCase: function(str) {
      if (str == null) return '';
      return String(str).replace(/\S/g, function(c){
        return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
      });
    },

    escapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
    },

    unescapeHTML: function(str) {
      if (str == null) return '';
      return String(str).replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      });
    },

    escapeRegExp: function(str){
      if (str == null) return '';
      return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    },

    splice: function(str, i, howmany, substr){
      var arr = _s.chars(str);
      arr.splice(~~i, ~~howmany, substr);
      return arr.join('');
    },

    insert: function(str, i, substr){
      return _s.splice(str, i, 0, substr);
    },

    include: function(str, needle){
      if (needle === '') return true;
      if (str == null) return false;
      return String(str).indexOf(needle) !== -1;
    },

    join: function() {
      var args = slice.call(arguments),
        separator = args.shift();

      if (separator == null) separator = '';

      return args.join(separator);
    },

    lines: function(str) {
      if (str == null) return [];
      return String(str).split("\n");
    },

    reverse: function(str){
      return _s.chars(str).reverse().join('');
    },

    startsWith: function(str, starts){
      if (starts === '') return true;
      if (str == null || starts == null) return false;
      str = String(str); starts = String(starts);
      return str.length >= starts.length && str.slice(0, starts.length) === starts;
    },

    endsWith: function(str, ends){
      if (ends === '') return true;
      if (str == null || ends == null) return false;
      str = String(str); ends = String(ends);
      return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
    },

    succ: function(str){
      if (str == null) return '';
      str = String(str);
      return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length-1) + 1);
    },

    titleize: function(str){
      if (str == null) return '';
      return String(str).replace(/(?:^|\s)\S/g, function(c){ return c.toUpperCase(); });
    },

    camelize: function(str){
      return _s.trim(str).replace(/[-_\s]+(.)?/g, function(match, c){ return c.toUpperCase(); });
    },

    underscored: function(str){
      return _s.trim(str).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
    },

    dasherize: function(str){
      return _s.trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
    },

    classify: function(str){
      return _s.titleize(String(str).replace(/[\W_]/g, ' ')).replace(/\s/g, '');
    },

    humanize: function(str){
      return _s.capitalize(_s.underscored(str).replace(/_id$/,'').replace(/_/g, ' '));
    },

    trim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrim) return nativeTrim.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('\^' + characters + '+|' + characters + '+$', 'g'), '');
    },

    ltrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp('^' + characters + '+'), '');
    },

    rtrim: function(str, characters){
      if (str == null) return '';
      if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
      characters = defaultToWhiteSpace(characters);
      return String(str).replace(new RegExp(characters + '+$'), '');
    },

    truncate: function(str, length, truncateStr){
      if (str == null) return '';
      str = String(str); truncateStr = truncateStr || '...';
      length = ~~length;
      return str.length > length ? str.slice(0, length) + truncateStr : str;
    },

    /**
     * _s.prune: a more elegant version of truncate
     * prune extra chars, never leaving a half-chopped word.
     * @author github.com/rwz
     */
    prune: function(str, length, pruneStr){
      if (str == null) return '';

      str = String(str); length = ~~length;
      pruneStr = pruneStr != null ? String(pruneStr) : '...';

      if (str.length <= length) return str;

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = _s.rtrim(template.slice(0, template.length-1));

      return (template+pruneStr).length > str.length ? str : str.slice(0, template.length)+pruneStr;
    },

    words: function(str, delimiter) {
      if (_s.isBlank(str)) return [];
      return _s.trim(str, delimiter).split(delimiter || /\s+/);
    },

    pad: function(str, length, padStr, type) {
      str = str == null ? '' : String(str);
      length = ~~length;

      var padlen  = 0;

      if (!padStr)
        padStr = ' ';
      else if (padStr.length > 1)
        padStr = padStr.charAt(0);

      switch(type) {
        case 'right':
          padlen = length - str.length;
          return str + strRepeat(padStr, padlen);
        case 'both':
          padlen = length - str.length;
          return strRepeat(padStr, Math.ceil(padlen/2)) + str
                  + strRepeat(padStr, Math.floor(padlen/2));
        default: // 'left'
          padlen = length - str.length;
          return strRepeat(padStr, padlen) + str;
        }
    },

    lpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr);
    },

    rpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'right');
    },

    lrpad: function(str, length, padStr) {
      return _s.pad(str, length, padStr, 'both');
    },

    sprintf: sprintf,

    vsprintf: function(fmt, argv){
      argv.unshift(fmt);
      return sprintf.apply(null, argv);
    },

    toNumber: function(str, decimals) {
      if (!str) return 0;
      str = _s.trim(str);
      if (!str.match(/^-?\d+(?:\.\d+)?$/)) return NaN;
      return parseNumber(parseNumber(str).toFixed(~~decimals));
    },

    numberFormat : function(number, dec, dsep, tsep) {
      if (isNaN(number) || number == null) return '';

      number = number.toFixed(~~dec);
      tsep = typeof tsep == 'string' ? tsep : ',';

      var parts = number.split('.'), fnums = parts[0],
        decimals = parts[1] ? (dsep || '.') + parts[1] : '';

      return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    },

    strRight: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strRightBack: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.lastIndexOf(sep);
      return ~pos ? str.slice(pos+sep.length, str.length) : str;
    },

    strLeft: function(str, sep){
      if (str == null) return '';
      str = String(str); sep = sep != null ? String(sep) : sep;
      var pos = !sep ? -1 : str.indexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    strLeftBack: function(str, sep){
      if (str == null) return '';
      str += ''; sep = sep != null ? ''+sep : sep;
      var pos = str.lastIndexOf(sep);
      return ~pos ? str.slice(0, pos) : str;
    },

    toSentence: function(array, separator, lastSeparator, serial) {
      separator = separator || ', '
      lastSeparator = lastSeparator || ' and '
      var a = array.slice(), lastMember = a.pop();

      if (array.length > 2 && serial) lastSeparator = _s.rtrim(separator) + lastSeparator;

      return a.length ? a.join(separator) + lastSeparator + lastMember : lastMember;
    },

    toSentenceSerial: function() {
      var args = slice.call(arguments);
      args[3] = true;
      return _s.toSentence.apply(_s, args);
    },

    slugify: function(str) {
      if (str == null) return '';

      var from  = "ąàáäâãåæćęèéëêìíïîłńòóöôõøùúüûñçżź",
          to    = "aaaaaaaaceeeeeiiiilnoooooouuuunczz",
          regex = new RegExp(defaultToWhiteSpace(from), 'g');

      str = String(str).toLowerCase().replace(regex, function(c){
        var index = from.indexOf(c);
        return to.charAt(index) || '-';
      });

      return _s.dasherize(str.replace(/[^\w\s-]/g, ''));
    },

    surround: function(str, wrapper) {
      return [wrapper, str, wrapper].join('');
    },

    quote: function(str) {
      return _s.surround(str, '"');
    },

    exports: function() {
      var result = {};

      for (var prop in this) {
        if (!this.hasOwnProperty(prop) || prop.match(/^(?:include|contains|reverse)$/)) continue;
        result[prop] = this[prop];
      }

      return result;
    },

    repeat: function(str, qty, separator){
      if (str == null) return '';

      qty = ~~qty;

      // using faster implementation if separator is not needed;
      if (separator == null) return strRepeat(String(str), qty);

      // this one is about 300x slower in Google Chrome
      for (var repeat = []; qty > 0; repeat[--qty] = str) {}
      return repeat.join(separator);
    },

    levenshtein: function(str1, str2) {
      if (str1 == null && str2 == null) return 0;
      if (str1 == null) return String(str2).length;
      if (str2 == null) return String(str1).length;

      str1 = String(str1); str2 = String(str2);

      var current = [], prev, value;

      for (var i = 0; i <= str2.length; i++)
        for (var j = 0; j <= str1.length; j++) {
          if (i && j)
            if (str1.charAt(j - 1) === str2.charAt(i - 1))
              value = prev;
            else
              value = Math.min(current[j], current[j - 1], prev) + 1;
          else
            value = i + j;

          prev = current[j];
          current[j] = value;
        }

      return current.pop();
    }
  };

  // Aliases

  _s.strip    = _s.trim;
  _s.lstrip   = _s.ltrim;
  _s.rstrip   = _s.rtrim;
  _s.center   = _s.lrpad;
  _s.rjust    = _s.lpad;
  _s.ljust    = _s.rpad;
  _s.contains = _s.include;
  _s.q        = _s.quote;

  // Exporting

  // CommonJS module is defined
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports)
      module.exports = _s;

    exports._s = _s;
  }

  // Register as a named module with AMD.
  if (typeof define === 'function' && define.amd)
    define('underscore.string', [], function(){ return _s; });


  // Integrate with Underscore.js if defined
  // or create our own underscore object.
  root._ = root._ || {};
  root._.string = root._.str = _s;
}(this, String);



  /***
   * @package Core
   * @description Internal utility and common methods.
   ***/


  // A few optimizations for Google Closure Compiler will save us a couple kb in the release script.
  var object = Object, array = Array, regexp = RegExp, date = Date, string = String, number = Number, math = Math, Undefined;

  // The global context
  var globalContext = typeof global !== 'undefined' ? global : this;

  // defineProperty exists in IE8 but will error when trying to define a property on
  // native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
  var definePropertySupport = object.defineProperty && object.defineProperties;

  // Class initializers and class helpers

  var ClassNames = 'Array,Boolean,Date,Function,Number,String,RegExp'.split(',');

  var isArray    = buildClassCheck(ClassNames[0]);
  var isBoolean  = buildClassCheck(ClassNames[1]);
  var isDate     = buildClassCheck(ClassNames[2]);
  var isFunction = buildClassCheck(ClassNames[3]);
  var isNumber   = buildClassCheck(ClassNames[4]);
  var isString   = buildClassCheck(ClassNames[5]);
  var isRegExp   = buildClassCheck(ClassNames[6]);

  function buildClassCheck(name) {
    var type;
    if(name === 'String' || name === 'Number' || name === 'Boolean') {
      type = name.toLowerCase();
    }
    return (name === 'Array' && array.isArray) || function(obj) {
      if(type && typeof obj === type) {
        return true;
      }
      return className(obj) === '[object '+name+']';
    }
  }

  function className(obj) {
    return object.prototype.toString.call(obj);
  }

  function initializeClasses() {
    initializeClass(object);
    iterateOverObject(ClassNames, function(i,name) {
      initializeClass(globalContext[name]);
    });
  }

  function initializeClass(klass) {
    if(klass['SugarMethods']) return;
    defineProperty(klass, 'SugarMethods', {});
    extend(klass, false, false, {
      'restore': function() {
        var all = arguments.length === 0, methods = multiArgs(arguments);
        iterateOverObject(klass['SugarMethods'], function(name, m) {
          if(all || methods.indexOf(name) > -1) {
            defineProperty(m.instance ? klass.prototype : klass, name, m.method);
          }
        });
      },
      'extend': function(methods, override, instance) {
        extend(klass, instance !== false, override, methods);
      }
    });
  }

  // Class extending methods

  function extend(klass, instance, override, methods) {
    var extendee = instance ? klass.prototype : klass, original;
    initializeClass(klass);
    iterateOverObject(methods, function(name, method) {
      original = extendee[name];
      if(typeof override === 'function') {
        method = wrapNative(extendee[name], method, override);
      }
      if(override !== false || !extendee[name]) {
        defineProperty(extendee, name, method);
      }
      // If the method is internal to Sugar, then store a reference so it can be restored later.
      klass['SugarMethods'][name] = { instance: instance, method: method, original: original };
    });
  }

  function extendSimilar(klass, instance, override, set, fn) {
    var methods = {};
    set = isString(set) ? set.split(',') : set;
    set.forEach(function(name, i) {
      fn(methods, name, i);
    });
    extend(klass, instance, override, methods);
  }

  function wrapNative(nativeFn, extendedFn, condition) {
    return function() {
      if(nativeFn && (condition === true || !condition.apply(this, arguments))) {
        return nativeFn.apply(this, arguments);
      } else {
        return extendedFn.apply(this, arguments);
      }
    }
  }

  function defineProperty(target, name, method) {
    if(definePropertySupport) {
      object.defineProperty(target, name, { 'value': method, 'configurable': true, 'enumerable': false, 'writable': true });
    } else {
      target[name] = method;
    }
  }


  // Argument helpers

  function multiArgs(args, fn) {
    var result = [], i, len;
    for(i = 0, len = args.length; i < len; i++) {
      result.push(args[i]);
      if(fn) fn.call(args, args[i], i);
    }
    return result;
  }

  function flattenedArgs(obj, fn, from) {
    multiArgs(array.prototype.concat.apply([], array.prototype.slice.call(obj, from || 0)), fn);
  }

  function checkCallback(fn) {
    if(!fn || !fn.call) {
      throw new TypeError('Callback is not callable');
    }
  }


  // General helpers

  function isDefined(o) {
    return o !== Undefined;
  }

  function isUndefined(o) {
    return o === Undefined;
  }


  // Object helpers

  function isObjectPrimitive(obj) {
    // Check for null
    return obj && typeof obj === 'object';
  }

  function isObject(obj) {
    // === on the constructor is not safe across iframes
    // 'hasOwnProperty' ensures that the object also inherits
    // from Object, which is false for DOMElements in IE.
    return !!obj && className(obj) === '[object Object]' && 'hasOwnProperty' in obj;
  }

  function hasOwnProperty(obj, key) {
    return object['hasOwnProperty'].call(obj, key);
  }

  function iterateOverObject(obj, fn) {
    var key;
    for(key in obj) {
      if(!hasOwnProperty(obj, key)) continue;
      if(fn.call(obj, key, obj[key], obj) === false) break;
    }
  }

  function simpleMerge(target, source) {
    iterateOverObject(source, function(key) {
      target[key] = source[key];
    });
    return target;
  }

  // Hash definition

  function Hash(obj) {
    simpleMerge(this, obj);
  };

  Hash.prototype.constructor = object;

  // Number helpers

  function getRange(start, stop, fn, step) {
    var arr = [], i = parseInt(start), down = step < 0;
    while((!down && i <= stop) || (down && i >= stop)) {
      arr.push(i);
      if(fn) fn.call(this, i);
      i += step || 1;
    }
    return arr;
  }

  function round(val, precision, method) {
    var fn = math[method || 'round'];
    var multiplier = math.pow(10, math.abs(precision || 0));
    if(precision < 0) multiplier = 1 / multiplier;
    return fn(val * multiplier) / multiplier;
  }

  function ceil(val, precision) {
    return round(val, precision, 'ceil');
  }

  function floor(val, precision) {
    return round(val, precision, 'floor');
  }

  function padNumber(num, place, sign, base) {
    var str = math.abs(num).toString(base || 10);
    str = repeatString(place - str.replace(/\.\d+/, '').length, '0') + str;
    if(sign || num < 0) {
      str = (num < 0 ? '-' : '+') + str;
    }
    return str;
  }

  function getOrdinalizedSuffix(num) {
    if(num >= 11 && num <= 13) {
      return 'th';
    } else {
      switch(num % 10) {
        case 1:  return 'st';
        case 2:  return 'nd';
        case 3:  return 'rd';
        default: return 'th';
      }
    }
  }


  // String helpers

  // WhiteSpace/LineTerminator as defined in ES5.1 plus Unicode characters in the Space, Separator category.
  function getTrimmableCharacters() {
    return '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';
  }

  function repeatString(times, str) {
    return array(math.max(0, isDefined(times) ? times : 1) + 1).join(str || '');
  }


  // RegExp helpers

  function getRegExpFlags(reg, add) {
    var flags = reg.toString().match(/[^/]*$/)[0];
    if(add) {
      flags = (flags + add).split('').sort().join('').replace(/([gimy])\1+/g, '$1');
    }
    return flags;
  }

  function escapeRegExp(str) {
    if(!isString(str)) str = string(str);
    return str.replace(/([\\/'*+?|()\[\]{}.^$])/g,'\\$1');
  }


  // Specialized helpers


  // Used by Array#unique and Object.equal

  function stringify(thing, stack) {
    var type = typeof thing,
        thingIsObject,
        thingIsArray,
        klass, value,
        arr, key, i, len;

    // Return quickly if string to save cycles
    if(type === 'string') return thing;

    klass         = object.prototype.toString.call(thing)
    thingIsObject = isObject(thing);
    thingIsArray  = klass === '[object Array]';

    if(thing != null && thingIsObject || thingIsArray) {
      // This method for checking for cyclic structures was egregiously stolen from
      // the ingenious method by @kitcambridge from the Underscore script:
      // https://github.com/documentcloud/underscore/issues/240
      if(!stack) stack = [];
      // Allowing a step into the structure before triggering this
      // script to save cycles on standard JSON structures and also to
      // try as hard as possible to catch basic properties that may have
      // been modified.
      if(stack.length > 1) {
        i = stack.length;
        while (i--) {
          if (stack[i] === thing) {
            return 'CYC';
          }
        }
      }
      stack.push(thing);
      value = string(thing.constructor);
      arr = thingIsArray ? thing : object.keys(thing).sort();
      for(i = 0, len = arr.length; i < len; i++) {
        key = thingIsArray ? i : arr[i];
        value += key + stringify(thing[key], stack);
      }
      stack.pop();
    } else if(1 / thing === -Infinity) {
      value = '-0';
    } else {
      value = string(thing && thing.valueOf ? thing.valueOf() : thing);
    }
    return type + klass + value;
  }

  function isEqual(a, b) {
    if(objectIsMatchedByValue(a) && objectIsMatchedByValue(b)) {
      return stringify(a) === stringify(b);
    } else {
      return a === b;
    }
  }

  function objectIsMatchedByValue(obj) {
    var klass = className(obj);
    return klass === '[object Date]'      ||
           klass === '[object Array]'     ||
           klass === '[object String]'    ||
           klass === '[object Number]'    ||
           klass === '[object RegExp]'    ||
           klass === '[object Boolean]'   ||
           klass === '[object Arguments]' ||
           isObject(obj);
  }


  // Used by Array#at and String#at

  function entryAtIndex(arr, args, str) {
    var result = [], length = arr.length, loop = args[args.length - 1] !== false, r;
    multiArgs(args, function(index) {
      if(isBoolean(index)) return false;
      if(loop) {
        index = index % length;
        if(index < 0) index = length + index;
      }
      r = str ? arr.charAt(index) || '' : arr[index];
      result.push(r);
    });
    return result.length < 2 ? result[0] : result;
  }


  // Object class methods implemented as instance methods

  function buildObjectInstanceMethods(set, target) {
    extendSimilar(target, true, false, set, function(methods, name) {
      methods[name + (name === 'equal' ? 's' : '')] = function() {
        return object[name].apply(null, [this].concat(multiArgs(arguments)));
      }
    });
  }

  initializeClasses();



  /***
   * @package Function
   * @dependency core
   * @description Lazy, throttled, and memoized functions, delayed functions and handling of timers, argument currying.
   *
   ***/

  function setDelay(fn, ms, after, scope, args) {
    var index;
    if(!fn.timers) fn.timers = [];
    if(!isNumber(ms)) ms = 0;
    fn.timers.push(setTimeout(function(){
      fn.timers.splice(index, 1);
      after.apply(scope, args || []);
    }, ms));
    index = fn.timers.length;
  }

  extend(Function, true, false, {

     /***
     * @method lazy([ms] = 1, [limit] = Infinity)
     * @returns Function
     * @short Creates a lazy function that, when called repeatedly, will queue execution and wait [ms] milliseconds to execute again.
     * @extra Lazy functions will always execute as many times as they are called up to [limit], after which point subsequent calls will be ignored (if it is set to a finite number). Compare this to %throttle%, which will execute only once per [ms] milliseconds. %lazy% is useful when you need to be sure that every call to a function is executed, but in a non-blocking manner. Calling %cancel% on a lazy function will clear the entire queue. Note that [ms] can also be a fraction.
     * @example
     *
     *   (function() {
     *     // Executes immediately.
     *   }).lazy()();
     *   (3).times(function() {
     *     // Executes 3 times, with each execution 20ms later than the last.
     *   }.lazy(20));
     *   (100).times(function() {
     *     // Executes 50 times, with each execution 20ms later than the last.
     *   }.lazy(20, 50));
     *
     ***/
    'lazy': function(ms, limit) {
      var fn = this, queue = [], lock = false, execute, rounded, perExecution;
      ms = ms || 1;
      limit = limit || Infinity;
      rounded = ceil(ms);
      perExecution = round(rounded / ms);
      execute = function() {
        if(lock || queue.length == 0) return;
        var max = math.max(queue.length - perExecution, 0);
        while(queue.length > max) {
          // Getting uber-meta here...
          Function.prototype.apply.apply(fn, queue.shift());
        }
        setDelay(lazy, rounded, function() {
          lock = false;
          execute();
        });
        lock = true;
      }
      function lazy() {
        // The first call is immediate, so having 1 in the queue
        // implies two calls have already taken place.
        if(lock && queue.length > limit - 2) return;
        queue.push([this, arguments]);
        execute();
      }
      return lazy;
    },

     /***
     * @method delay([ms] = 0, [arg1], ...)
     * @returns Function
     * @short Executes the function after <ms> milliseconds.
     * @extra Returns a reference to itself. %delay% is also a way to execute non-blocking operations that will wait until the CPU is free. Delayed functions can be canceled using the %cancel% method. Can also curry arguments passed in after <ms>.
     * @example
     *
     *   (function(arg1) {
     *     // called 1s later
     *   }).delay(1000, 'arg1');
     *
     ***/
    'delay': function(ms) {
      var fn = this;
      var args = multiArgs(arguments).slice(1);
      setDelay(fn, ms, fn, fn, args);
      return fn;
    },

     /***
     * @method throttle(<ms>)
     * @returns Function
     * @short Creates a "throttled" version of the function that will only be executed once per <ms> milliseconds.
     * @extra This is functionally equivalent to calling %lazy% with a [limit] of %1%. %throttle% is appropriate when you want to make sure a function is only executed at most once for a given duration. Compare this to %lazy%, which will queue rapid calls and execute them later.
     * @example
     *
     *   (3).times(function() {
     *     // called only once. will wait 50ms until it responds again
     *   }.throttle(50));
     *
     ***/
    'throttle': function(ms) {
      return this.lazy(ms, 1);
    },

     /***
     * @method debounce(<ms>)
     * @returns Function
     * @short Creates a "debounced" function that postpones its execution until after <ms> milliseconds have passed.
     * @extra This method is useful to execute a function after things have "settled down". A good example of this is when a user tabs quickly through form fields, execution of a heavy operation should happen after a few milliseconds when they have "settled" on a field.
     * @example
     *
     *   var fn = (function(arg1) {
     *     // called once 50ms later
     *   }).debounce(50); fn() fn() fn();
     *
     ***/
    'debounce': function(ms) {
      var fn = this;
      function debounced() {
        debounced.cancel();
        setDelay(debounced, ms, fn, this, arguments);
      };
      return debounced;
    },

     /***
     * @method cancel()
     * @returns Function
     * @short Cancels a delayed function scheduled to be run.
     * @extra %delay%, %lazy%, %throttle%, and %debounce% can all set delays.
     * @example
     *
     *   (function() {
     *     alert('hay'); // Never called
     *   }).delay(500).cancel();
     *
     ***/
    'cancel': function() {
      if(isArray(this.timers)) {
        while(this.timers.length > 0) {
          clearTimeout(this.timers.shift());
        }
      }
      return this;
    },

     /***
     * @method after([num] = 1)
     * @returns Function
     * @short Creates a function that will execute after [num] calls.
     * @extra %after% is useful for running a final callback after a series of asynchronous operations, when the order in which the operations will complete is unknown.
     * @example
     *
     *   var fn = (function() {
     *     // Will be executed once only
     *   }).after(3); fn(); fn(); fn();
     *
     ***/
    'after': function(num) {
      var fn = this, counter = 0, storedArguments = [];
      if(!isNumber(num)) {
        num = 1;
      } else if(num === 0) {
        fn.call();
        return fn;
      }
      return function() {
        var ret;
        storedArguments.push(multiArgs(arguments));
        counter++;
        if(counter == num) {
          ret = fn.call(this, storedArguments);
          counter = 0;
          storedArguments = [];
          return ret;
        }
      }
    },

     /***
     * @method once()
     * @returns Function
     * @short Creates a function that will execute only once and store the result.
     * @extra %once% is useful for creating functions that will cache the result of an expensive operation and use it on subsequent calls. Also it can be useful for creating initialization functions that only need to be run once.
     * @example
     *
     *   var fn = (function() {
     *     // Will be executed once only
     *   }).once(); fn(); fn(); fn();
     *
     ***/
    'once': function() {
      var fn = this;
      return function() {
        return hasOwnProperty(fn, 'memo') ? fn['memo'] : fn['memo'] = fn.apply(this, arguments);
      }
    },

     /***
     * @method fill(<arg1>, <arg2>, ...)
     * @returns Function
     * @short Returns a new version of the function which when called will have some of its arguments pre-emptively filled in, also known as "currying".
     * @extra Arguments passed to a "filled" function are generally appended to the curried arguments. However, if %undefined% is passed as any of the arguments to %fill%, it will be replaced, when the "filled" function is executed. This allows currying of arguments even when they occur toward the end of an argument list (the example demonstrates this much more clearly).
     * @example
     *
     *   var delayOneSecond = setTimeout.fill(undefined, 1000);
     *   delayOneSecond(function() {
     *     // Will be executed 1s later
     *   });
     *
     ***/
    'fill': function() {
      var fn = this, curried = multiArgs(arguments);
      return function() {
        var args = multiArgs(arguments);
        curried.forEach(function(arg, index) {
          if(arg != null || index >= args.length) args.splice(index, 0, arg);
        });
        return fn.apply(this, args);
      }
    }


  });


/*!
 * jQuery UI 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */(function(a,b){function d(b){return!a(b).parents().andSelf().filter(function(){return a.curCSS(this,"visibility")==="hidden"||a.expr.filters.hidden(this)}).length}function c(b,c){var e=b.nodeName.toLowerCase();if("area"===e){var f=b.parentNode,g=f.name,h;if(!b.href||!g||f.nodeName.toLowerCase()!=="map")return!1;h=a("img[usemap=#"+g+"]")[0];return!!h&&d(h)}return(/input|select|textarea|button|object/.test(e)?!b.disabled:"a"==e?b.href||c:c)&&d(b)}a.ui=a.ui||{};a.ui.version||(a.extend(a.ui,{version:"1.8.18",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}}),a.fn.extend({propAttr:a.fn.prop||a.fn.attr,_focus:a.fn.focus,focus:function(b,c){return typeof b=="number"?this.each(function(){var d=this;setTimeout(function(){a(d).focus(),c&&c.call(d)},b)}):this._focus.apply(this,arguments)},scrollParent:function(){var b;a.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?b=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(a.curCSS(this,"position",1))&&/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0):b=this.parents().filter(function(){return/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!b.length?a(document):b},zIndex:function(c){if(c!==b)return this.css("zIndex",c);if(this.length){var d=a(this[0]),e,f;while(d.length&&d[0]!==document){e=d.css("position");if(e==="absolute"||e==="relative"||e==="fixed"){f=parseInt(d.css("zIndex"),10);if(!isNaN(f)&&f!==0)return f}d=d.parent()}}return 0},disableSelection:function(){return this.bind((a.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),a.each(["Width","Height"],function(c,d){function h(b,c,d,f){a.each(e,function(){c-=parseFloat(a.curCSS(b,"padding"+this,!0))||0,d&&(c-=parseFloat(a.curCSS(b,"border"+this+"Width",!0))||0),f&&(c-=parseFloat(a.curCSS(b,"margin"+this,!0))||0)});return c}var e=d==="Width"?["Left","Right"]:["Top","Bottom"],f=d.toLowerCase(),g={innerWidth:a.fn.innerWidth,innerHeight:a.fn.innerHeight,outerWidth:a.fn.outerWidth,outerHeight:a.fn.outerHeight};a.fn["inner"+d]=function(c){if(c===b)return g["inner"+d].call(this);return this.each(function(){a(this).css(f,h(this,c)+"px")})},a.fn["outer"+d]=function(b,c){if(typeof b!="number")return g["outer"+d].call(this,b);return this.each(function(){a(this).css(f,h(this,b,!0,c)+"px")})}}),a.extend(a.expr[":"],{data:function(b,c,d){return!!a.data(b,d[3])},focusable:function(b){return c(b,!isNaN(a.attr(b,"tabindex")))},tabbable:function(b){var d=a.attr(b,"tabindex"),e=isNaN(d);return(e||d>=0)&&c(b,!e)}}),a(function(){var b=document.body,c=b.appendChild(c=document.createElement("div"));c.offsetHeight,a.extend(c.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),a.support.minHeight=c.offsetHeight===100,a.support.selectstart="onselectstart"in c,b.removeChild(c).style.display="none"}),a.extend(a.ui,{plugin:{add:function(b,c,d){var e=a.ui[b].prototype;for(var f in d)e.plugins[f]=e.plugins[f]||[],e.plugins[f].push([c,d[f]])},call:function(a,b,c){var d=a.plugins[b];if(!!d&&!!a.element[0].parentNode)for(var e=0;e<d.length;e++)a.options[d[e][0]]&&d[e][1].apply(a.element,c)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(b,c){if(a(b).css("overflow")==="hidden")return!1;var d=c&&c==="left"?"scrollLeft":"scrollTop",e=!1;if(b[d]>0)return!0;b[d]=1,e=b[d]>0,b[d]=0;return e},isOverAxis:function(a,b,c){return a>b&&a<b+c},isOver:function(b,c,d,e,f,g){return a.ui.isOverAxis(b,d,f)&&a.ui.isOverAxis(c,e,g)}}))})(jQuery);/*!
 * jQuery UI Widget 1.8.18
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */(function(a,b){if(a.cleanData){var c=a.cleanData;a.cleanData=function(b){for(var d=0,e;(e=b[d])!=null;d++)try{a(e).triggerHandler("remove")}catch(f){}c(b)}}else{var d=a.fn.remove;a.fn.remove=function(b,c){return this.each(function(){c||(!b||a.filter(b,[this]).length)&&a("*",this).add([this]).each(function(){try{a(this).triggerHandler("remove")}catch(b){}});return d.call(a(this),b,c)})}}a.widget=function(b,c,d){var e=b.split(".")[0],f;b=b.split(".")[1],f=e+"-"+b,d||(d=c,c=a.Widget),a.expr[":"][f]=function(c){return!!a.data(c,b)},a[e]=a[e]||{},a[e][b]=function(a,b){arguments.length&&this._createWidget(a,b)};var g=new c;g.options=a.extend(!0,{},g.options),a[e][b].prototype=a.extend(!0,g,{namespace:e,widgetName:b,widgetEventPrefix:a[e][b].prototype.widgetEventPrefix||b,widgetBaseClass:f},d),a.widget.bridge(b,a[e][b])},a.widget.bridge=function(c,d){a.fn[c]=function(e){var f=typeof e=="string",g=Array.prototype.slice.call(arguments,1),h=this;e=!f&&g.length?a.extend.apply(null,[!0,e].concat(g)):e;if(f&&e.charAt(0)==="_")return h;f?this.each(function(){var d=a.data(this,c),f=d&&a.isFunction(d[e])?d[e].apply(d,g):d;if(f!==d&&f!==b){h=f;return!1}}):this.each(function(){var b=a.data(this,c);b?b.option(e||{})._init():a.data(this,c,new d(e,this))});return h}},a.Widget=function(a,b){arguments.length&&this._createWidget(a,b)},a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:!1},_createWidget:function(b,c){a.data(c,this.widgetName,this),this.element=a(c),this.options=a.extend(!0,{},this.options,this._getCreateOptions(),b);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()}),this._create(),this._trigger("create"),this._init()},_getCreateOptions:function(){return a.metadata&&a.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName),this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled "+"ui-state-disabled")},widget:function(){return this.element},option:function(c,d){var e=c;if(arguments.length===0)return a.extend({},this.options);if(typeof c=="string"){if(d===b)return this.options[c];e={},e[c]=d}this._setOptions(e);return this},_setOptions:function(b){var c=this;a.each(b,function(a,b){c._setOption(a,b)});return this},_setOption:function(a,b){this.options[a]=b,a==="disabled"&&this.widget()[b?"addClass":"removeClass"](this.widgetBaseClass+"-disabled"+" "+"ui-state-disabled").attr("aria-disabled",b);return this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_trigger:function(b,c,d){var e,f,g=this.options[b];d=d||{},c=a.Event(c),c.type=(b===this.widgetEventPrefix?b:this.widgetEventPrefix+b).toLowerCase(),c.target=this.element[0],f=c.originalEvent;if(f)for(e in f)e in c||(c[e]=f[e]);this.element.trigger(c,d);return!(a.isFunction(g)&&g.call(this.element[0],c,d)===!1||c.isDefaultPrevented())}}})(jQuery);
/*
 * jQuery UI Stars v3.0.1
 * http://plugins.jquery.com/project/Star_Rating_widget
 *
 * Copyright (c) 2010 Marek "Orkan" Zajac (orkans@gmail.com)
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * $Rev: 164 $
 * $Date:: 2010-05-01 #$
 * $Build: 35 (2010-05-01)
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *
 */
(function(A){A.widget("ui.stars",{options:{inputType:"radio",split:0,disabled:false,cancelTitle:"Cancel Rating",cancelValue:0,cancelShow:true,disableValue:true,oneVoteOnly:false,showTitles:false,captionEl:null,callback:null,starWidth:16,cancelClass:"ui-stars-cancel",starClass:"ui-stars-star",starOnClass:"ui-stars-star-on",starHoverClass:"ui-stars-star-hover",starDisabledClass:"ui-stars-star-disabled",cancelHoverClass:"ui-stars-cancel-hover",cancelDisabledClass:"ui-stars-cancel-disabled"},_create:function(){var C=this,F=this.options,B=0;this.element.data("former.stars",this.element.html());F.isSelect=F.inputType=="select";this.$form=A(this.element).closest("form");this.$selec=F.isSelect?A("select",this.element):null;this.$rboxs=F.isSelect?A("option",this.$selec):A(":radio",this.element);this.$stars=this.$rboxs.map(function(I){var J={value:this.value,title:(F.isSelect?this.text:this.title)||this.value,isDefault:(F.isSelect&&this.defaultSelected)||this.defaultChecked};if(I==0){F.split=typeof F.split!="number"?0:F.split;F.val2id=[];F.id2val=[];F.id2title=[];F.name=F.isSelect?C.$selec.get(0).name:this.name;F.disabled=F.disabled||(F.isSelect?A(C.$selec).attr("disabled"):A(this).attr("disabled"))}if(J.value==F.cancelValue){F.cancelTitle=J.title;return null}F.val2id[J.value]=B;F.id2val[B]=J.value;F.id2title[B]=J.title;if(J.isDefault){F.checked=B;F.value=F.defaultValue=J.value;F.title=J.title}var H=A("<div/>").addClass(F.starClass);var K=A("<a/>").attr("title",F.showTitles?J.title:"").text(J.value);if(F.split){var G=(B%F.split);var L=Math.floor(F.starWidth/F.split);H.width(L);K.css("margin-left","-"+(G*L)+"px")}B++;return H.append(K).get(0)});F.items=B;F.isSelect?this.$selec.remove():this.$rboxs.remove();this.$cancel=A("<div/>").addClass(F.cancelClass).append(A("<a/>").attr("title",F.showTitles?F.cancelTitle:"").text(F.cancelValue));F.cancelShow&=!F.disabled&&!F.oneVoteOnly;F.cancelShow&&this.element.append(this.$cancel);this.element.append(this.$stars);if(F.checked===undefined){F.checked=-1;F.value=F.defaultValue=F.cancelValue;F.title=""}this.$value=A("<input type='hidden' name='"+F.name+"' value='"+F.value+"' />");this.element.append(this.$value);this.$stars.bind("click.stars",function(H){if(!F.forceSelect&&F.disabled){return false}var G=C.$stars.index(this);F.checked=G;F.value=F.id2val[G];F.title=F.id2title[G];C.$value.attr({disabled:F.disabled?"disabled":"",value:F.value});D(G,false);C._disableCancel();!F.forceSelect&&C.callback(H,"star")}).bind("mouseover.stars",function(){if(F.disabled){return false}var G=C.$stars.index(this);D(G,true)}).bind("mouseout.stars",function(){if(F.disabled){return false}D(C.options.checked,false)});this.$cancel.bind("click.stars",function(G){if(!F.forceSelect&&(F.disabled||F.value==F.cancelValue)){return false}F.checked=-1;F.value=F.cancelValue;F.title="";C.$value.val(F.value);F.disableValue&&C.$value.attr({disabled:"disabled"});E();C._disableCancel();!F.forceSelect&&C.callback(G,"cancel")}).bind("mouseover.stars",function(){if(C._disableCancel()){return false}C.$cancel.addClass(F.cancelHoverClass);E();C._showCap(F.cancelTitle)}).bind("mouseout.stars",function(){if(C._disableCancel()){return false}C.$cancel.removeClass(F.cancelHoverClass);C.$stars.triggerHandler("mouseout.stars")});this.$form.bind("reset.stars",function(){!F.disabled&&C.select(F.defaultValue)});A(window).unload(function(){C.$cancel.unbind(".stars");C.$stars.unbind(".stars");C.$form.unbind(".stars");C.$selec=C.$rboxs=C.$stars=C.$value=C.$cancel=C.$form=null});function D(G,I){if(G!=-1){var J=I?F.starHoverClass:F.starOnClass;var H=I?F.starOnClass:F.starHoverClass;C.$stars.eq(G).prevAll("."+F.starClass).andSelf().removeClass(H).addClass(J);C.$stars.eq(G).nextAll("."+F.starClass).removeClass(F.starHoverClass+" "+F.starOnClass);C._showCap(F.id2title[G])}else{E()}}function E(){C.$stars.removeClass(F.starOnClass+" "+F.starHoverClass);C._showCap("")}this.select(F.value);F.disabled&&this.disable()},_disableCancel:function(){var C=this.options,B=C.disabled||C.oneVoteOnly||(C.value==C.cancelValue);if(B){this.$cancel.removeClass(C.cancelHoverClass).addClass(C.cancelDisabledClass)}else{this.$cancel.removeClass(C.cancelDisabledClass)}this.$cancel.css("opacity",B?0.5:1);return B},_disableAll:function(){var B=this.options;this._disableCancel();if(B.disabled){this.$stars.filter("div").addClass(B.starDisabledClass)}else{this.$stars.filter("div").removeClass(B.starDisabledClass)}},_showCap:function(B){var C=this.options;if(C.captionEl){C.captionEl.text(B)}},value:function(){return this.options.value},select:function(D){var C=this.options,B=(D==C.cancelValue)?this.$cancel:this.$stars.eq(C.val2id[D]);C.forceSelect=true;B.triggerHandler("click.stars");C.forceSelect=false},selectID:function(D){var C=this.options,B=(D==-1)?this.$cancel:this.$stars.eq(D);C.forceSelect=true;B.triggerHandler("click.stars");C.forceSelect=false},enable:function(){this.options.disabled=false;this._disableAll()},disable:function(){this.options.disabled=true;this._disableAll()},destroy:function(){this.$form.unbind(".stars");this.$cancel.unbind(".stars").remove();this.$stars.unbind(".stars").remove();this.$value.remove();this.element.unbind(".stars").html(this.element.data("former.stars")).removeData("stars");return this},callback:function(C,B){var D=this.options;D.callback&&D.callback(this,B,D.value,C);D.oneVoteOnly&&!D.disabled&&this.disable()}});A.extend(A.ui.stars,{version:"3.0.1"})})(jQuery);
/*!
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery resize event
//
// *Version: 1.1, Last updated: 3/14/2010*
// 
// Project Home - http://benalman.com/projects/jquery-resize-plugin/
// GitHub       - http://github.com/cowboy/jquery-resize/
// Source       - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.js
// (Minified)   - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.min.js (1.0kb)
// 
// About: License
// 
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// This working example, complete with fully commented code, illustrates a few
// ways in which this plugin can be used.
// 
// resize event - http://benalman.com/code/projects/jquery-resize/examples/resize/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
// 
// jQuery Versions - 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-resize/unit/
// 
// About: Release History
// 
// 1.1 - (3/14/2010) Fixed a minor bug that was causing the event to trigger
//       immediately after bind in some circumstances. Also changed $.fn.data
//       to $.data to improve performance.
// 1.0 - (2/10/2010) Initial release

(function($,window,undefined){
  '$:nomunge'; // Used by YUI compressor.
  
  // A jQuery object containing all non-window elements to which the resize
  // event is bound.
  var elems = $([]),
    
    // Extend $.resize if it already exists, otherwise create it.
    jq_resize = $.resize = $.extend( $.resize, {} ),
    
    timeout_id,
    
    // Reused strings.
    str_setTimeout = 'setTimeout',
    str_resize = 'resize',
    str_data = str_resize + '-special-event',
    str_delay = 'delay',
    str_throttle = 'throttleWindow';
  
  // Property: jQuery.resize.delay
  // 
  // The numeric interval (in milliseconds) at which the resize event polling
  // loop executes. Defaults to 250.
  
  jq_resize[ str_delay ] = 250;
  
  // Property: jQuery.resize.throttleWindow
  // 
  // Throttle the native window object resize event to fire no more than once
  // every <jQuery.resize.delay> milliseconds. Defaults to true.
  // 
  // Because the window object has its own resize event, it doesn't need to be
  // provided by this plugin, and its execution can be left entirely up to the
  // browser. However, since certain browsers fire the resize event continuously
  // while others do not, enabling this will throttle the window resize event,
  // making event behavior consistent across all elements in all browsers.
  // 
  // While setting this property to false will disable window object resize
  // event throttling, please note that this property must be changed before any
  // window object resize event callbacks are bound.
  
  jq_resize[ str_throttle ] = true;
  
  // Event: resize event
  // 
  // Fired when an element's width or height changes. Because browsers only
  // provide this event for the window element, for other elements a polling
  // loop is initialized, running every <jQuery.resize.delay> milliseconds
  // to see if elements' dimensions have changed. You may bind with either
  // .resize( fn ) or .bind( "resize", fn ), and unbind with .unbind( "resize" ).
  // 
  // Usage:
  // 
  // > jQuery('selector').bind( 'resize', function(e) {
  // >   // element's width or height has changed!
  // >   ...
  // > });
  // 
  // Additional Notes:
  // 
  // * The polling loop is not created until at least one callback is actually
  //   bound to the 'resize' event, and this single polling loop is shared
  //   across all elements.
  // 
  // Double firing issue in jQuery 1.3.2:
  // 
  // While this plugin works in jQuery 1.3.2, if an element's event callbacks
  // are manually triggered via .trigger( 'resize' ) or .resize() those
  // callbacks may double-fire, due to limitations in the jQuery 1.3.2 special
  // events system. This is not an issue when using jQuery 1.4+.
  // 
  // > // While this works in jQuery 1.4+
  // > $(elem).css({ width: new_w, height: new_h }).resize();
  // > 
  // > // In jQuery 1.3.2, you need to do this:
  // > var elem = $(elem);
  // > elem.css({ width: new_w, height: new_h });
  // > elem.data( 'resize-special-event', { width: elem.width(), height: elem.height() } );
  // > elem.resize();
      
  $.event.special[ str_resize ] = {
    
    // Called only when the first 'resize' event callback is bound per element.
    setup: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will bind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var elem = $(this);
      
      // Add this element to the list of internal elements to monitor.
      elems = elems.add( elem );
      
      // Initialize data store on the element.
      $.data( this, str_data, { w: elem.width(), h: elem.height() } );
      
      // If this is the first element added, start the polling loop.
      if ( elems.length === 1 ) {
        loopy();
      }
    },
    
    // Called only when the last 'resize' event callback is unbound per element.
    teardown: function() {
      // Since window has its own native 'resize' event, return false so that
      // jQuery will unbind the event using DOM methods. Since only 'window'
      // objects have a .setTimeout method, this should be a sufficient test.
      // Unless, of course, we're throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var elem = $(this);
      
      // Remove this element from the list of internal elements to monitor.
      elems = elems.not( elem );
      
      // Remove any data stored on the element.
      elem.removeData( str_data );
      
      // If this is the last element removed, stop the polling loop.
      if ( !elems.length ) {
        clearTimeout( timeout_id );
      }
    },
    
    // Called every time a 'resize' event callback is bound per element (new in
    // jQuery 1.4).
    add: function( handleObj ) {
      // Since window has its own native 'resize' event, return false so that
      // jQuery doesn't modify the event object. Unless, of course, we're
      // throttling the 'resize' event for window.
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
      
      var old_handler;
      
      // The new_handler function is executed every time the event is triggered.
      // This is used to update the internal element data store with the width
      // and height when the event is triggered manually, to avoid double-firing
      // of the event callback. See the "Double firing issue in jQuery 1.3.2"
      // comments above for more information.
      
      function new_handler( e, w, h ) {
        var elem = $(this),
          data = $.data( this, str_data );
        
        // If called from the polling loop, w and h will be passed in as
        // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
        // those values will need to be computed.
        data.w = w !== undefined ? w : elem.width();
        data.h = h !== undefined ? h : elem.height();
        
        old_handler.apply( this, arguments );
      };
      
      // This may seem a little complicated, but it normalizes the special event
      // .add method between jQuery 1.4/1.4.1 and 1.4.2+
      if ( $.isFunction( handleObj ) ) {
        // 1.4, 1.4.1
        old_handler = handleObj;
        return new_handler;
      } else {
        // 1.4.2+
        old_handler = handleObj.handler;
        handleObj.handler = new_handler;
      }
    }
    
  };
  
  function loopy() {
    
    // Start the polling loop, asynchronously.
    timeout_id = window[ str_setTimeout ](function(){
      
      // Iterate over all elements to which the 'resize' event is bound.
      elems.each(function(){
        var elem = $(this),
          width = elem.width(),
          height = elem.height(),
          data = $.data( this, str_data );
        
        // If element size has changed since the last time, update the element
        // data store and trigger the 'resize' event.
        if ( width !== data.w || height !== data.h ) {
          elem.trigger( str_resize, [ data.w = width, data.h = height ] );
        }
        
      });
      
      // Loop.
      loopy();
      
    }, jq_resize[ str_delay ] );
    
  };
  
})(jQuery,this);

/*! nanoScrollerJS - v0.7
* http://jamesflorentino.github.com/nanoScrollerJS/
* Copyright (c) 2012 James Florentino; Licensed MIT */


(function($, window, document) {
  "use strict";

  var BROWSER_IS_IE7, BROWSER_SCROLLBAR_WIDTH, DOMSCROLL, DOWN, DRAG, KEYDOWN, KEYUP, MOUSEDOWN, MOUSEMOVE, MOUSEUP, MOUSEWHEEL, NanoScroll, PANEDOWN, RESIZE, SCROLL, SCROLLBAR, TOUCHMOVE, UP, WHEEL, defaults, getBrowserScrollbarWidth;
  defaults = {
    /**
      a classname for the pane element.
      @property paneClass
      @type String
      @default 'pane'
    */

    paneClass: 'pane',
    /**
      a classname for the slider element.
      @property sliderClass
      @type String
      @default 'slider'
    */

    sliderClass: 'slider',
    /**
      a classname for the content element.
      @property contentClass
      @type String
      @default 'content'
    */

    contentClass: 'content',
    /**
      a setting to enable native scrolling in iOS devices.
      @property iOSNativeScrolling
      @type Boolean
      @default false
    */

    iOSNativeScrolling: false,
    /**
      a setting to prevent the rest of the page being
      scrolled when user scrolls the `.content` element.
      @property preventPageScrolling
      @type Boolean
      @default false
    */

    preventPageScrolling: false,
    /**
      a setting to disable binding to the resize event.
      @property disableResize
      @type Boolean
      @default false
    */

    disableResize: false,
    /**
      a setting to make the scrollbar always visible.
      @property alwaysVisible
      @type Boolean
      @default false
    */

    alwaysVisible: false,
    /**
      a default timeout for the `flash()` method.
      @property flashDelay
      @type Number
      @default 1500
    */

    flashDelay: 1500,
    /**
      a minimum height for the `.slider` element.
      @property sliderMinHeight
      @type Number
      @default 20
    */

    sliderMinHeight: 20,
    /**
      a maximum height for the `.slider` element.
      @property sliderMaxHeight
      @type Number
      @default null
    */

    sliderMaxHeight: null
  };
  /**
    @property SCROLLBAR
    @type String
    @static
    @final
    @private
  */

  SCROLLBAR = 'scrollbar';
  /**
    @property SCROLL
    @type String
    @static
    @final
    @private
  */

  SCROLL = 'scroll';
  /**
    @property MOUSEDOWN
    @type String
    @final
    @private
  */

  MOUSEDOWN = 'mousedown';
  /**
    @property MOUSEMOVE
    @type String
    @static
    @final
    @private
  */

  MOUSEMOVE = 'mousemove';
  /**
    @property MOUSEWHEEL
    @type String
    @final
    @private
  */

  MOUSEWHEEL = 'mousewheel';
  /**
    @property MOUSEUP
    @type String
    @static
    @final
    @private
  */

  MOUSEUP = 'mouseup';
  /**
    @property RESIZE
    @type String
    @final
    @private
  */

  RESIZE = 'resize';
  /**
    @property DRAG
    @type String
    @static
    @final
    @private
  */

  DRAG = 'drag';
  /**
    @property UP
    @type String
    @static
    @final
    @private
  */

  UP = 'up';
  /**
    @property PANEDOWN
    @type String
    @static
    @final
    @private
  */

  PANEDOWN = 'panedown';
  /**
    @property DOMSCROLL
    @type String
    @static
    @final
    @private
  */

  DOMSCROLL = 'DOMMouseScroll';
  /**
    @property DOWN
    @type String
    @static
    @final
    @private
  */

  DOWN = 'down';
  /**
    @property WHEEL
    @type String
    @static
    @final
    @private
  */

  WHEEL = 'wheel';
  /**
    @property KEYDOWN
    @type String
    @static
    @final
    @private
  */

  KEYDOWN = 'keydown';
  /**
    @property KEYUP
    @type String
    @static
    @final
    @private
  */

  KEYUP = 'keyup';
  /**
    @property TOUCHMOVE
    @type String
    @static
    @final
    @private
  */

  TOUCHMOVE = 'touchmove';
  /**
    @property BROWSER_IS_IE7
    @type Boolean
    @static
    @final
    @private
  */

  BROWSER_IS_IE7 = window.navigator.appName === 'Microsoft Internet Explorer' && /msie 7./i.test(window.navigator.appVersion) && window.ActiveXObject;
  /**
    @property BROWSER_SCROLLBAR_WIDTH
    @type Number
    @static
    @default null
    @private
  */

  BROWSER_SCROLLBAR_WIDTH = null;
  /**
    Returns browser's native scrollbar width
    @method getBrowserScrollbarWidth
    @return {Number} the scrollbar width in pixels
    @static
    @private
  */

  getBrowserScrollbarWidth = function() {
    var outer, outerStyle, scrollbarWidth;
    outer = document.createElement('div');
    outerStyle = outer.style;
    outerStyle.position = 'absolute';
    outerStyle.width = '100px';
    outerStyle.height = '100px';
    outerStyle.overflow = SCROLL;
    outerStyle.top = '-9999px';
    document.body.appendChild(outer);
    scrollbarWidth = outer.offsetWidth - outer.clientWidth;
    document.body.removeChild(outer);
    return scrollbarWidth;
  };
  /**
    @class NanoScroll
    @param element {HTMLElement|Node} the main element
    @param options {Object} nanoScroller's options
    @constructor
  */

  NanoScroll = (function() {

    function NanoScroll(el, options) {
      this.el = el;
      this.options = options;
      BROWSER_SCROLLBAR_WIDTH || (BROWSER_SCROLLBAR_WIDTH = getBrowserScrollbarWidth());
      this.$el = $(this.el);
      this.doc = $(document);
      this.win = $(window);
      this.generate();
      this.createEvents();
      this.addEvents();
      this.reset();
    }

    /**
      Prevents the rest of the page being scrolled
      when user scrolls the `.content` element.
      @method preventScrolling
      @param event {Event}
      @param direction {String} Scroll direction (up or down)
      @private
    */


    NanoScroll.prototype.preventScrolling = function(e, direction) {
      if (!this.isActive) {
        return;
      }
      if (e.type === DOMSCROLL) {
        if (direction === DOWN && e.originalEvent.detail > 0 || direction === UP && e.originalEvent.detail < 0) {
          e.preventDefault();
        }
      } else if (e.type === MOUSEWHEEL) {
        if (!e.originalEvent || !e.originalEvent.wheelDelta) {
          return;
        }
        if (direction === DOWN && e.originalEvent.wheelDelta < 0 || direction === UP && e.originalEvent.wheelDelta > 0) {
          e.preventDefault();
        }
      }
    };

    /**
      Updates those nanoScroller properties that
      are related to current scrollbar position.
      @method updateScrollValues
      @private
    */


    NanoScroll.prototype.updateScrollValues = function() {
      var content;
      content = this.content;
      this.maxScrollTop = content.scrollHeight - content.clientHeight;
      this.contentScrollTop = content.scrollTop;
      this.maxSliderTop = this.paneHeight - this.sliderHeight;
      this.sliderTop = this.contentScrollTop * this.maxSliderTop / this.maxScrollTop;
    };

    /**
      Creates event related methods
      @method createEvents
      @private
    */


    NanoScroll.prototype.createEvents = function() {
      var _this = this;
      this.events = {
        down: function(e) {
          _this.isBeingDragged = true;
          _this.offsetY = e.pageY - _this.slider.offset().top;
          _this.pane.addClass('active');
          _this.doc.bind(MOUSEMOVE, _this.events[DRAG]).bind(MOUSEUP, _this.events[UP]);
          return false;
        },
        drag: function(e) {
          _this.sliderY = e.pageY - _this.$el.offset().top - _this.offsetY;
          _this.scroll();
          _this.updateScrollValues();
          if (_this.contentScrollTop >= _this.maxScrollTop) {
            _this.$el.trigger('scrollend');
          } else if (_this.contentScrollTop === 0) {
            _this.$el.trigger('scrolltop');
          }
          return false;
        },
        up: function(e) {
          _this.isBeingDragged = false;
          _this.pane.removeClass('active');
          _this.doc.unbind(MOUSEMOVE, _this.events[DRAG]).unbind(MOUSEUP, _this.events[UP]);
          return false;
        },
        resize: function(e) {
          _this.reset();
        },
        panedown: function(e) {
          _this.sliderY = (e.offsetY || e.originalEvent.layerY) - (_this.sliderHeight * 0.5);
          _this.scroll();
          _this.events.down(e);
          return false;
        },
        scroll: function(e) {
          if (_this.isBeingDragged) {
            return;
          }
          _this.updateScrollValues();
          _this.sliderY = _this.sliderTop;
          _this.slider.css({
            top: _this.sliderTop
          });
          if (e == null) {
            return;
          }
          if (_this.contentScrollTop >= _this.maxScrollTop) {
            if (_this.options.preventPageScrolling) {
              _this.preventScrolling(e, DOWN);
            }
            _this.$el.trigger('scrollend');
          } else if (_this.contentScrollTop === 0) {
            if (_this.options.preventPageScrolling) {
              _this.preventScrolling(e, UP);
            }
            _this.$el.trigger('scrolltop');
          }
        },
        wheel: function(e) {
          if (e == null) {
            return;
          }
          _this.sliderY += -e.wheelDeltaY || -e.delta;
          _this.scroll();
          return false;
        }
      };
    };

    /**
      Adds event listeners with jQuery.
      @method addEvents
      @private
    */


    NanoScroll.prototype.addEvents = function() {
      var events;
      this.removeEvents();
      events = this.events;
      if (!this.options.disableResize) {
        this.win.bind(RESIZE, events[RESIZE]);
      }
      this.slider.bind(MOUSEDOWN, events[DOWN]);
      this.pane.bind(MOUSEDOWN, events[PANEDOWN]).bind("" + MOUSEWHEEL + " " + DOMSCROLL, events[WHEEL]);
      this.$content.bind("" + SCROLL + " " + MOUSEWHEEL + " " + DOMSCROLL + " " + TOUCHMOVE, events[SCROLL]);
    };

    /**
      Removes event listeners with jQuery.
      @method removeEvents
      @private
    */


    NanoScroll.prototype.removeEvents = function() {
      var events;
      events = this.events;
      this.win.unbind(RESIZE, events[RESIZE]);
      this.slider.unbind();
      this.pane.unbind();
      this.$content.unbind("" + SCROLL + " " + MOUSEWHEEL + " " + DOMSCROLL + " " + TOUCHMOVE, events[SCROLL]);
    };

    /**
      Generates nanoScroller's scrollbar and elements for it.
      @method generate
      @chainable
      @private
    */


    NanoScroll.prototype.generate = function() {
      var contentClass, cssRule, options, paneClass, sliderClass;
      options = this.options;
      paneClass = options.paneClass, sliderClass = options.sliderClass, contentClass = options.contentClass;
      if (!this.$el.find("" + paneClass).length && !this.$el.find("" + sliderClass).length) {
        this.$el.append("<div class=\"" + paneClass + "\"><div class=\"" + sliderClass + "\" /></div>");
      }
      this.$content = this.$el.children("." + contentClass);
      this.$content.attr('tabindex', 0);
      this.content = this.$content[0];
      this.slider = this.$el.find("." + sliderClass);
      this.pane = this.$el.find("." + paneClass);
      if (BROWSER_SCROLLBAR_WIDTH) {
        cssRule = this.$el.css('direction') === 'rtl' ? {
          left: -BROWSER_SCROLLBAR_WIDTH
        } : {
          right: -BROWSER_SCROLLBAR_WIDTH
        };
        this.$el.addClass('has-scrollbar');
      }
      if (options.iOSNativeScrolling) {
        cssRule || (cssRule = {});
        cssRule.WebkitOverflowScrolling = 'touch';
      }
      if (cssRule != null) {
        this.$content.css(cssRule);
      }
      return this;
    };

    /**
      @method restore
      @private
    */


    NanoScroll.prototype.restore = function() {
      this.stopped = false;
      this.pane.show();
      this.addEvents();
    };

    /**
      Resets nanoScroller's scrollbar.
      @method reset
      @chainable
      @example
          $(".nano").nanoScroller();
    */


    NanoScroll.prototype.reset = function() {
      var content, contentHeight, contentStyle, contentStyleOverflowY, paneBottom, paneHeight, paneOuterHeight, paneTop, sliderHeight;
      if (!this.$el.find("." + this.options.paneClass).length) {
        this.generate().stop();
      }
      if (this.stopped) {
        this.restore();
      }
      content = this.content;
      contentStyle = content.style;
      contentStyleOverflowY = contentStyle.overflowY;
      if (BROWSER_IS_IE7) {
        this.$content.css({
          height: this.$content.height()
        });
      }
      contentHeight = content.scrollHeight + BROWSER_SCROLLBAR_WIDTH;
      paneHeight = this.pane.outerHeight();
      paneTop = parseInt(this.pane.css('top'), 10);
      paneBottom = parseInt(this.pane.css('bottom'), 10);
      paneOuterHeight = paneHeight + paneTop + paneBottom;
      sliderHeight = Math.round(paneOuterHeight / contentHeight * paneOuterHeight);
      if (sliderHeight < this.options.sliderMinHeight) {
        sliderHeight = this.options.sliderMinHeight;
      } else if ((this.options.sliderMaxHeight != null) && sliderHeight > this.options.sliderMaxHeight) {
        sliderHeight = this.options.sliderMaxHeight;
      }
      if (contentStyleOverflowY === SCROLL && contentStyle.overflowX !== SCROLL) {
        sliderHeight += BROWSER_SCROLLBAR_WIDTH;
      }
      this.maxSliderTop = paneOuterHeight - sliderHeight;
      this.contentHeight = contentHeight;
      this.paneHeight = paneHeight;
      this.paneOuterHeight = paneOuterHeight;
      this.sliderHeight = sliderHeight;
      this.slider.height(sliderHeight);
      this.events.scroll();
      this.pane.show();
      this.isActive = true;
      if ((content.scrollHeight === content.clientHeight) || (this.pane.outerHeight(true) >= content.scrollHeight && contentStyleOverflowY !== SCROLL)) {
        this.pane.hide();
        this.isActive = false;
      } else if (this.el.clientHeight === content.scrollHeight && contentStyleOverflowY === SCROLL) {
        this.slider.hide();
      } else {
        this.slider.show();
      }
      this.pane.css({
        opacity: (this.options.alwaysVisible ? 1 : ''),
        visibility: (this.options.alwaysVisible ? 'visible' : '')
      });
      return this;
    };

    /**
      @method scroll
      @private
      @example
          $(".nano").nanoScroller({ scroll: 'top' });
    */


    NanoScroll.prototype.scroll = function() {
      if (!this.isActive) {
        return;
      }
      this.sliderY = Math.max(0, this.sliderY);
      this.sliderY = Math.min(this.maxSliderTop, this.sliderY);
      this.$content.scrollTop((this.paneHeight - this.contentHeight + BROWSER_SCROLLBAR_WIDTH) * this.sliderY / this.maxSliderTop * -1);
      this.slider.css({
        top: this.sliderY
      });
      return this;
    };

    /**
      Scroll at the bottom with an offset value
      @method scrollBottom
      @param offsetY {Number}
      @chainable
      @example
          $(".nano").nanoScroller({ scrollBottom: value });
    */


    NanoScroll.prototype.scrollBottom = function(offsetY) {
      if (!this.isActive) {
        return;
      }
      this.reset();
      this.$content.scrollTop(this.contentHeight - this.$content.height() - offsetY).trigger(MOUSEWHEEL);
      return this;
    };

    /**
      Scroll at the top with an offset value
      @method scrollTop
      @param offsetY {Number}
      @chainable
      @example
          $(".nano").nanoScroller({ scrollTop: value });
    */


    NanoScroll.prototype.scrollTop = function(offsetY) {
      if (!this.isActive) {
        return;
      }
      this.reset();
      this.$content.scrollTop(+offsetY).trigger(MOUSEWHEEL);
      return this;
    };

    /**
      Scroll to an element
      @method scrollTo
      @param node {Node} A node to scroll to.
      @chainable
      @example
          $(".nano").nanoScroller({ scrollTo: $('#a_node') });
    */


    NanoScroll.prototype.scrollTo = function(node) {
      if (!this.isActive) {
        return;
      }
      this.reset();
      this.scrollTop($(node).get(0).offsetTop);
      return this;
    };

    /**
      To stop the operation.
      This option will tell the plugin to disable all event bindings and hide the gadget scrollbar from the UI.
      @method stop
      @chainable
      @example
          $(".nano").nanoScroller({ stop: true });
    */


    NanoScroll.prototype.stop = function() {
      this.stopped = true;
      this.removeEvents();
      this.pane.hide();
      return this;
    };

    /**
      To flash the scrollbar gadget for an amount of time defined in plugin settings (defaults to 1,5s).
      Useful if you want to show the user (e.g. on pageload) that there is more content waiting for him.
      @method flash
      @chainable
      @example
          $(".nano").nanoScroller({ flash: true });
    */


    NanoScroll.prototype.flash = function() {
      var _this = this;
      if (!this.isActive) {
        return;
      }
      this.reset();
      this.pane.addClass('flashed');
      setTimeout(function() {
        _this.pane.removeClass('flashed');
      }, this.options.flashDelay);
      return this;
    };

    return NanoScroll;

  })();
  $.fn.nanoScroller = function(settings) {
    return this.each(function() {
      var options, scrollbar;
      if (!(scrollbar = this.nanoscroller)) {
        options = $.extend({}, defaults, settings);
        this.nanoscroller = scrollbar = new NanoScroll(this, options);
      }
      if (settings && typeof settings === "object") {
        $.extend(scrollbar.options, settings);
        if (settings.scrollBottom) {
          return scrollbar.scrollBottom(settings.scrollBottom);
        }
        if (settings.scrollTop) {
          return scrollbar.scrollTop(settings.scrollTop);
        }
        if (settings.scrollTo) {
          return scrollbar.scrollTo(settings.scrollTo);
        }
        if (settings.scroll === 'bottom') {
          return scrollbar.scrollBottom(0);
        }
        if (settings.scroll === 'top') {
          return scrollbar.scrollTop(0);
        }
        if (settings.scroll && settings.scroll instanceof $) {
          return scrollbar.scrollTo(settings.scroll);
        }
        if (settings.stop) {
          return scrollbar.stop();
        }
        if (settings.flash) {
          return scrollbar.flash();
        }
      }
      return scrollbar.reset();
    });
  };
})(jQuery, window, document);

/**
 * Isotope v1.5.23
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2012 David DeSandro / Metafizzy
 */

/*jshint asi: true, browser: true, curly: true, eqeqeq: true, forin: false, immed: false, newcap: true, noempty: true, strict: true, undef: true */
/*global jQuery: false */

(function( window, $, undefined ){

  'use strict';

  // get global vars
  var document = window.document;
  var Modernizr = window.Modernizr;

  // helper function
  var capitalize = function( str ) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // ========================= getStyleProperty by kangax ===============================
  // http://perfectionkills.com/feature-testing-css-properties/

  var prefixes = 'Moz Webkit O Ms'.split(' ');

  var getStyleProperty = function( propName ) {
    var style = document.documentElement.style,
        prefixed;

    // test standard property first
    if ( typeof style[propName] === 'string' ) {
      return propName;
    }

    // capitalize
    propName = capitalize( propName );

    // test vendor specific properties
    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      prefixed = prefixes[i] + propName;
      if ( typeof style[ prefixed ] === 'string' ) {
        return prefixed;
      }
    }
  };

  var transformProp = getStyleProperty('transform'),
      transitionProp = getStyleProperty('transitionProperty');


  // ========================= miniModernizr ===============================
  // <3<3<3 and thanks to Faruk and Paul for doing the heavy lifting

  /*!
   * Modernizr v1.6ish: miniModernizr for Isotope
   * http://www.modernizr.com
   *
   * Developed by:
   * - Faruk Ates  http://farukat.es/
   * - Paul Irish  http://paulirish.com/
   *
   * Copyright (c) 2009-2010
   * Dual-licensed under the BSD or MIT licenses.
   * http://www.modernizr.com/license/
   */

  /*
   * This version whittles down the script just to check support for
   * CSS transitions, transforms, and 3D transforms.
  */

  var tests = {
    csstransforms: function() {
      return !!transformProp;
    },

    csstransforms3d: function() {
      var test = !!getStyleProperty('perspective');
      // double check for Chrome's false positive
      if ( test ) {
        var vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
            mediaQuery = '@media (' + vendorCSSPrefixes.join('transform-3d),(') + 'modernizr)',
            $style = $('<style>' + mediaQuery + '{#modernizr{height:3px}}' + '</style>')
                        .appendTo('head'),
            $div = $('<div id="modernizr" />').appendTo('html');

        test = $div.height() === 3;

        $div.remove();
        $style.remove();
      }
      return test;
    },

    csstransitions: function() {
      return !!transitionProp;
    }
  };

  var testName;

  if ( Modernizr ) {
    // if there's a previous Modernzir, check if there are necessary tests
    for ( testName in tests) {
      if ( !Modernizr.hasOwnProperty( testName ) ) {
        // if test hasn't been run, use addTest to run it
        Modernizr.addTest( testName, tests[ testName ] );
      }
    }
  } else {
    // or create new mini Modernizr that just has the 3 tests
    Modernizr = window.Modernizr = {
      _version : '1.6ish: miniModernizr for Isotope'
    };

    var classes = ' ';
    var result;

    // Run through tests
    for ( testName in tests) {
      result = tests[ testName ]();
      Modernizr[ testName ] = result;
      classes += ' ' + ( result ?  '' : 'no-' ) + testName;
    }

    // Add the new classes to the <html> element.
    $('html').addClass( classes );
  }


  // ========================= isoTransform ===============================

  /**
   *  provides hooks for .css({ scale: value, translate: [x, y] })
   *  Progressively enhanced CSS transforms
   *  Uses hardware accelerated 3D transforms for Safari
   *  or falls back to 2D transforms.
   */

  if ( Modernizr.csstransforms ) {

        // i.e. transformFnNotations.scale(0.5) >> 'scale3d( 0.5, 0.5, 1)'
    var transformFnNotations = Modernizr.csstransforms3d ?
      { // 3D transform functions
        translate : function ( position ) {
          return 'translate3d(' + position[0] + 'px, ' + position[1] + 'px, 0) ';
        },
        scale : function ( scale ) {
          return 'scale3d(' + scale + ', ' + scale + ', 1) ';
        }
      } :
      { // 2D transform functions
        translate : function ( position ) {
          return 'translate(' + position[0] + 'px, ' + position[1] + 'px) ';
        },
        scale : function ( scale ) {
          return 'scale(' + scale + ') ';
        }
      }
    ;

    var setIsoTransform = function ( elem, name, value ) {
          // unpack current transform data
      var data =  $.data( elem, 'isoTransform' ) || {},
          newData = {},
          fnName,
          transformObj = {},
          transformValue;

      // i.e. newData.scale = 0.5
      newData[ name ] = value;
      // extend new value over current data
      $.extend( data, newData );

      for ( fnName in data ) {
        transformValue = data[ fnName ];
        transformObj[ fnName ] = transformFnNotations[ fnName ]( transformValue );
      }

      // get proper order
      // ideally, we could loop through this give an array, but since we only have
      // a couple transforms we're keeping track of, we'll do it like so
      var translateFn = transformObj.translate || '',
          scaleFn = transformObj.scale || '',
          // sorting so translate always comes first
          valueFns = translateFn + scaleFn;

      // set data back in elem
      $.data( elem, 'isoTransform', data );

      // set name to vendor specific property
      elem.style[ transformProp ] = valueFns;
    };

    // ==================== scale ===================

    $.cssNumber.scale = true;

    $.cssHooks.scale = {
      set: function( elem, value ) {
        // uncomment this bit if you want to properly parse strings
        // if ( typeof value === 'string' ) {
        //   value = parseFloat( value );
        // }
        setIsoTransform( elem, 'scale', value );
      },
      get: function( elem, computed ) {
        var transform = $.data( elem, 'isoTransform' );
        return transform && transform.scale ? transform.scale : 1;
      }
    };

    $.fx.step.scale = function( fx ) {
      $.cssHooks.scale.set( fx.elem, fx.now+fx.unit );
    };


    // ==================== translate ===================

    $.cssNumber.translate = true;

    $.cssHooks.translate = {
      set: function( elem, value ) {

        // uncomment this bit if you want to properly parse strings
        // if ( typeof value === 'string' ) {
        //   value = value.split(' ');
        // }
        //
        // var i, val;
        // for ( i = 0; i < 2; i++ ) {
        //   val = value[i];
        //   if ( typeof val === 'string' ) {
        //     val = parseInt( val );
        //   }
        // }

        setIsoTransform( elem, 'translate', value );
      },

      get: function( elem, computed ) {
        var transform = $.data( elem, 'isoTransform' );
        return transform && transform.translate ? transform.translate : [ 0, 0 ];
      }
    };

  }

  // ========================= get transition-end event ===============================
  var transitionEndEvent, transitionDurProp;

  if ( Modernizr.csstransitions ) {
    transitionEndEvent = {
      WebkitTransitionProperty: 'webkitTransitionEnd',  // webkit
      MozTransitionProperty: 'transitionend',
      OTransitionProperty: 'oTransitionEnd otransitionend',
      transitionProperty: 'transitionend'
    }[ transitionProp ];

    transitionDurProp = getStyleProperty('transitionDuration');
  }

  // ========================= smartresize ===============================

  /*
   * smartresize: debounced resize event for jQuery
   *
   * latest version and complete README available on Github:
   * https://github.com/louisremi/jquery.smartresize.js
   *
   * Copyright 2011 @louis_remi
   * Licensed under the MIT license.
   */

  var $event = $.event,
      resizeTimeout;

  $event.special.smartresize = {
    setup: function() {
      $(this).bind( "resize", $event.special.smartresize.handler );
    },
    teardown: function() {
      $(this).unbind( "resize", $event.special.smartresize.handler );
    },
    handler: function( event, execAsap ) {
      // Save the context
      var context = this,
          args = arguments;

      // set correct event type
      event.type = "smartresize";

      if ( resizeTimeout ) { clearTimeout( resizeTimeout ); }
      resizeTimeout = setTimeout(function() {
        jQuery.event.handle.apply( context, args );
      }, execAsap === "execAsap"? 0 : 100 );
    }
  };

  $.fn.smartresize = function( fn ) {
    return fn ? this.bind( "smartresize", fn ) : this.trigger( "smartresize", ["execAsap"] );
  };



// ========================= Isotope ===============================


  // our "Widget" object constructor
  $.Isotope = function( options, element, callback ){
    this.element = $( element );

    this._create( options );
    this._init( callback );
  };

  // styles of container element we want to keep track of
  var isoContainerStyles = [ 'width', 'height' ];

  var $window = $(window);

  $.Isotope.settings = {
    resizable: true,
    layoutMode : 'masonry',
    containerClass : 'isotope',
    itemClass : 'isotope-item',
    hiddenClass : 'isotope-hidden',
    hiddenStyle: { opacity: 0, scale: 0.001 },
    visibleStyle: { opacity: 1, scale: 1 },
    containerStyle: {
      position: 'relative',
      overflow: 'hidden'
    },
    animationEngine: 'best-available',
    animationOptions: {
      queue: false,
      duration: 800
    },
    sortBy : 'original-order',
    sortAscending : true,
    resizesContainer : true,
    transformsEnabled: true,
    itemPositionDataEnabled: false
  };

  $.Isotope.prototype = {

    // sets up widget
    _create : function( options ) {

      this.options = $.extend( {}, $.Isotope.settings, options );

      this.styleQueue = [];
      this.elemCount = 0;

      // get original styles in case we re-apply them in .destroy()
      var elemStyle = this.element[0].style;
      this.originalStyle = {};
      // keep track of container styles
      var containerStyles = isoContainerStyles.slice(0);
      for ( var prop in this.options.containerStyle ) {
        containerStyles.push( prop );
      }
      for ( var i=0, len = containerStyles.length; i < len; i++ ) {
        prop = containerStyles[i];
        this.originalStyle[ prop ] = elemStyle[ prop ] || '';
      }
      // apply container style from options
      this.element.css( this.options.containerStyle );

      this._updateAnimationEngine();
      this._updateUsingTransforms();

      // sorting
      var originalOrderSorter = {
        'original-order' : function( $elem, instance ) {
          instance.elemCount ++;
          return instance.elemCount;
        },
        random : function() {
          return Math.random();
        }
      };

      this.options.getSortData = $.extend( this.options.getSortData, originalOrderSorter );

      // need to get atoms
      this.reloadItems();

      // get top left position of where the bricks should be
      this.offset = {
        left: parseInt( ( this.element.css('padding-left') || 0 ), 10 ),
        top: parseInt( ( this.element.css('padding-top') || 0 ), 10 )
      };

      // add isotope class first time around
      var instance = this;
      setTimeout( function() {
        instance.element.addClass( instance.options.containerClass );
      }, 0 );

      // bind resize method
      if ( this.options.resizable ) {
        $window.bind( 'smartresize.isotope', function() {
          instance.resize();
        });
      }

      // dismiss all click events from hidden events
      this.element.delegate( '.' + this.options.hiddenClass, 'click', function(){
        return false;
      });

    },

    _getAtoms : function( $elems ) {
      var selector = this.options.itemSelector,
          // filter & find
          $atoms = selector ? $elems.filter( selector ).add( $elems.find( selector ) ) : $elems,
          // base style for atoms
          atomStyle = { position: 'absolute' };

      // filter out text nodes
      $atoms = $atoms.filter( function( i, atom ) {
        return atom.nodeType === 1;
      });

      if ( this.usingTransforms ) {
        atomStyle.left = 0;
        atomStyle.top = 0;
      }

      $atoms.css( atomStyle ).addClass( this.options.itemClass );

      this.updateSortData( $atoms, true );

      return $atoms;
    },

    // _init fires when your instance is first created
    // (from the constructor above), and when you
    // attempt to initialize the widget again (by the bridge)
    // after it has already been initialized.
    _init : function( callback ) {

      this.$filteredAtoms = this._filter( this.$allAtoms );
      this._sort();
      this.reLayout( callback );

    },

    option : function( opts ){
      // change options AFTER initialization:
      // signature: $('#foo').bar({ cool:false });
      if ( $.isPlainObject( opts ) ){
        this.options = $.extend( true, this.options, opts );

        // trigger _updateOptionName if it exists
        var updateOptionFn;
        for ( var optionName in opts ) {
          updateOptionFn = '_update' + capitalize( optionName );
          if ( this[ updateOptionFn ] ) {
            this[ updateOptionFn ]();
          }
        }
      }
    },

    // ====================== updaters ====================== //
    // kind of like setters

    _updateAnimationEngine : function() {
      var animationEngine = this.options.animationEngine.toLowerCase().replace( /[ _\-]/g, '');
      var isUsingJQueryAnimation;
      // set applyStyleFnName
      switch ( animationEngine ) {
        case 'css' :
        case 'none' :
          isUsingJQueryAnimation = false;
          break;
        case 'jquery' :
          isUsingJQueryAnimation = true;
          break;
        default : // best available
          isUsingJQueryAnimation = !Modernizr.csstransitions;
      }
      this.isUsingJQueryAnimation = isUsingJQueryAnimation;
      this._updateUsingTransforms();
    },

    _updateTransformsEnabled : function() {
      this._updateUsingTransforms();
    },

    _updateUsingTransforms : function() {
      var usingTransforms = this.usingTransforms = this.options.transformsEnabled &&
        Modernizr.csstransforms && Modernizr.csstransitions && !this.isUsingJQueryAnimation;

      // prevent scales when transforms are disabled
      if ( !usingTransforms ) {
        delete this.options.hiddenStyle.scale;
        delete this.options.visibleStyle.scale;
      }

      this.getPositionStyles = usingTransforms ? this._translate : this._positionAbs;
    },


    // ====================== Filtering ======================

    _filter : function( $atoms ) {
      var filter = this.options.filter === '' ? '*' : this.options.filter;

      if ( !filter ) {
        return $atoms;
      }

      var hiddenClass    = this.options.hiddenClass,
          hiddenSelector = '.' + hiddenClass,
          $hiddenAtoms   = $atoms.filter( hiddenSelector ),
          $atomsToShow   = $hiddenAtoms;

      if ( filter !== '*' ) {
        $atomsToShow = $hiddenAtoms.filter( filter );
        var $atomsToHide = $atoms.not( hiddenSelector ).not( filter ).addClass( hiddenClass );
        this.styleQueue.push({ $el: $atomsToHide, style: this.options.hiddenStyle });
      }

      this.styleQueue.push({ $el: $atomsToShow, style: this.options.visibleStyle });
      $atomsToShow.removeClass( hiddenClass );

      return $atoms.filter( filter );
    },

    // ====================== Sorting ======================

    updateSortData : function( $atoms, isIncrementingElemCount ) {
      var instance = this,
          getSortData = this.options.getSortData,
          $this, sortData;
      $atoms.each(function(){
        $this = $(this);
        sortData = {};
        // get value for sort data based on fn( $elem ) passed in
        for ( var key in getSortData ) {
          if ( !isIncrementingElemCount && key === 'original-order' ) {
            // keep original order original
            sortData[ key ] = $.data( this, 'isotope-sort-data' )[ key ];
          } else {
            sortData[ key ] = getSortData[ key ]( $this, instance );
          }
        }
        // apply sort data to element
        $.data( this, 'isotope-sort-data', sortData );
      });
    },

    // used on all the filtered atoms
    _sort : function() {

      var sortBy = this.options.sortBy,
          getSorter = this._getSorter,
          sortDir = this.options.sortAscending ? 1 : -1,
          sortFn = function( alpha, beta ) {
            var a = getSorter( alpha, sortBy ),
                b = getSorter( beta, sortBy );
            // fall back to original order if data matches
            if ( a === b && sortBy !== 'original-order') {
              a = getSorter( alpha, 'original-order' );
              b = getSorter( beta, 'original-order' );
            }
            return ( ( a > b ) ? 1 : ( a < b ) ? -1 : 0 ) * sortDir;
          };

      this.$filteredAtoms.sort( sortFn );
    },

    _getSorter : function( elem, sortBy ) {
      return $.data( elem, 'isotope-sort-data' )[ sortBy ];
    },

    // ====================== Layout Helpers ======================

    _translate : function( x, y ) {
      return { translate : [ x, y ] };
    },

    _positionAbs : function( x, y ) {
      return { left: x, top: y };
    },

    _pushPosition : function( $elem, x, y ) {
      x = Math.round( x + this.offset.left );
      y = Math.round( y + this.offset.top );
      var position = this.getPositionStyles( x, y );
      this.styleQueue.push({ $el: $elem, style: position });
      if ( this.options.itemPositionDataEnabled ) {
        $elem.data('isotope-item-position', {x: x, y: y} );
      }
    },


    // ====================== General Layout ======================

    // used on collection of atoms (should be filtered, and sorted before )
    // accepts atoms-to-be-laid-out to start with
    layout : function( $elems, callback ) {

      var layoutMode = this.options.layoutMode;

      // layout logic
      this[ '_' +  layoutMode + 'Layout' ]( $elems );

      // set the size of the container
      if ( this.options.resizesContainer ) {
        var containerStyle = this[ '_' +  layoutMode + 'GetContainerSize' ]();
        this.styleQueue.push({ $el: this.element, style: containerStyle });
      }

      this._processStyleQueue( $elems, callback );

      this.isLaidOut = true;
    },

    _processStyleQueue : function( $elems, callback ) {
      // are we animating the layout arrangement?
      // use plugin-ish syntax for css or animate
      var styleFn = !this.isLaidOut ? 'css' : (
            this.isUsingJQueryAnimation ? 'animate' : 'css'
          ),
          animOpts = this.options.animationOptions,
          onLayout = this.options.onLayout,
          objStyleFn, processor,
          triggerCallbackNow, callbackFn;

      // default styleQueue processor, may be overwritten down below
      processor = function( i, obj ) {
        obj.$el[ styleFn ]( obj.style, animOpts );
      };

      if ( this._isInserting && this.isUsingJQueryAnimation ) {
        // if using styleQueue to insert items
        processor = function( i, obj ) {
          // only animate if it not being inserted
          objStyleFn = obj.$el.hasClass('no-transition') ? 'css' : styleFn;
          obj.$el[ objStyleFn ]( obj.style, animOpts );
        };

      } else if ( callback || onLayout || animOpts.complete ) {
        // has callback
        var isCallbackTriggered = false,
            // array of possible callbacks to trigger
            callbacks = [ callback, onLayout, animOpts.complete ],
            instance = this;
        triggerCallbackNow = true;
        // trigger callback only once
        callbackFn = function() {
          if ( isCallbackTriggered ) {
            return;
          }
          var hollaback;
          for (var i=0, len = callbacks.length; i < len; i++) {
            hollaback = callbacks[i];
            if ( typeof hollaback === 'function' ) {
              hollaback.call( instance.element, $elems, instance );
            }
          }
          isCallbackTriggered = true;
        };

        if ( this.isUsingJQueryAnimation && styleFn === 'animate' ) {
          // add callback to animation options
          animOpts.complete = callbackFn;
          triggerCallbackNow = false;

        } else if ( Modernizr.csstransitions ) {
          // detect if first item has transition
          var i = 0,
              firstItem = this.styleQueue[0],
              testElem = firstItem && firstItem.$el,
              styleObj;
          // get first non-empty jQ object
          while ( !testElem || !testElem.length ) {
            styleObj = this.styleQueue[ i++ ];
            // HACK: sometimes styleQueue[i] is undefined
            if ( !styleObj ) {
              return;
            }
            testElem = styleObj.$el;
          }
          // get transition duration of the first element in that object
          // yeah, this is inexact
          var duration = parseFloat( getComputedStyle( testElem[0] )[ transitionDurProp ] );
          if ( duration > 0 ) {
            processor = function( i, obj ) {
              obj.$el[ styleFn ]( obj.style, animOpts )
                // trigger callback at transition end
                .one( transitionEndEvent, callbackFn );
            };
            triggerCallbackNow = false;
          }
        }
      }

      // process styleQueue
      $.each( this.styleQueue, processor );

      if ( triggerCallbackNow ) {
        callbackFn();
      }

      // clear out queue for next time
      this.styleQueue = [];
    },


    resize : function() {
      if ( this[ '_' + this.options.layoutMode + 'ResizeChanged' ]() ) {
        this.reLayout();
      }
    },


    reLayout : function( callback ) {

      this[ '_' +  this.options.layoutMode + 'Reset' ]();
      this.layout( this.$filteredAtoms, callback );

    },

    // ====================== Convenience methods ======================

    // ====================== Adding items ======================

    // adds a jQuery object of items to a isotope container
    addItems : function( $content, callback ) {
      var $newAtoms = this._getAtoms( $content );
      // add new atoms to atoms pools
      this.$allAtoms = this.$allAtoms.add( $newAtoms );

      if ( callback ) {
        callback( $newAtoms );
      }
    },

    // convienence method for adding elements properly to any layout
    // positions items, hides them, then animates them back in <--- very sezzy
    insert : function( $content, callback ) {
      // position items
      this.element.append( $content );

      var instance = this;
      this.addItems( $content, function( $newAtoms ) {
        var $newFilteredAtoms = instance._filter( $newAtoms );
        instance._addHideAppended( $newFilteredAtoms );
        instance._sort();
        instance.reLayout();
        instance._revealAppended( $newFilteredAtoms, callback );
      });

    },

    // convienence method for working with Infinite Scroll
    appended : function( $content, callback ) {
      var instance = this;
      this.addItems( $content, function( $newAtoms ) {
        instance._addHideAppended( $newAtoms );
        instance.layout( $newAtoms );
        instance._revealAppended( $newAtoms, callback );
      });
    },

    // adds new atoms, then hides them before positioning
    _addHideAppended : function( $newAtoms ) {
      this.$filteredAtoms = this.$filteredAtoms.add( $newAtoms );
      $newAtoms.addClass('no-transition');

      this._isInserting = true;

      // apply hidden styles
      this.styleQueue.push({ $el: $newAtoms, style: this.options.hiddenStyle });
    },

    // sets visible style on new atoms
    _revealAppended : function( $newAtoms, callback ) {
      var instance = this;
      // apply visible style after a sec
      setTimeout( function() {
        // enable animation
        $newAtoms.removeClass('no-transition');
        // reveal newly inserted filtered elements
        instance.styleQueue.push({ $el: $newAtoms, style: instance.options.visibleStyle });
        instance._isInserting = false;
        instance._processStyleQueue( $newAtoms, callback );
      }, 10 );
    },

    // gathers all atoms
    reloadItems : function() {
      this.$allAtoms = this._getAtoms( this.element.children() );
    },

    // removes elements from Isotope widget
    remove: function( $content, callback ) {
      // remove elements immediately from Isotope instance
      this.$allAtoms = this.$allAtoms.not( $content );
      this.$filteredAtoms = this.$filteredAtoms.not( $content );
      // remove() as a callback, for after transition / animation
      var instance = this;
      var removeContent = function() {
        $content.remove();
        if ( callback ) {
          callback.call( instance.element );
        }
      };

      if ( $content.filter( ':not(.' + this.options.hiddenClass + ')' ).length ) {
        // if any non-hidden content needs to be removed
        this.styleQueue.push({ $el: $content, style: this.options.hiddenStyle });
        this._sort();
        this.reLayout( removeContent );
      } else {
        // remove it now
        removeContent();
      }

    },

    shuffle : function( callback ) {
      this.updateSortData( this.$allAtoms );
      this.options.sortBy = 'random';
      this._sort();
      this.reLayout( callback );
    },

    // destroys widget, returns elements and container back (close) to original style
    destroy : function() {

      var usingTransforms = this.usingTransforms;
      var options = this.options;

      this.$allAtoms
        .removeClass( options.hiddenClass + ' ' + options.itemClass )
        .each(function(){
          var style = this.style;
          style.position = '';
          style.top = '';
          style.left = '';
          style.opacity = '';
          if ( usingTransforms ) {
            style[ transformProp ] = '';
          }
        });

      // re-apply saved container styles
      var elemStyle = this.element[0].style;
      for ( var prop in this.originalStyle ) {
        elemStyle[ prop ] = this.originalStyle[ prop ];
      }

      this.element
        .unbind('.isotope')
        .undelegate( '.' + options.hiddenClass, 'click' )
        .removeClass( options.containerClass )
        .removeData('isotope');

      $window.unbind('.isotope');

    },


    // ====================== LAYOUTS ======================

    // calculates number of rows or columns
    // requires columnWidth or rowHeight to be set on namespaced object
    // i.e. this.masonry.columnWidth = 200
    _getSegments : function( isRows ) {
      var namespace = this.options.layoutMode,
          measure  = isRows ? 'rowHeight' : 'columnWidth',
          size     = isRows ? 'height' : 'width',
          segmentsName = isRows ? 'rows' : 'cols',
          containerSize = this.element[ size ](),
          segments,
                    // i.e. options.masonry && options.masonry.columnWidth
          segmentSize = this.options[ namespace ] && this.options[ namespace ][ measure ] ||
                    // or use the size of the first item, i.e. outerWidth
                    this.$filteredAtoms[ 'outer' + capitalize(size) ](true) ||
                    // if there's no items, use size of container
                    containerSize;

      segments = Math.floor( containerSize / segmentSize );
      segments = Math.max( segments, 1 );

      // i.e. this.masonry.cols = ....
      this[ namespace ][ segmentsName ] = segments;
      // i.e. this.masonry.columnWidth = ...
      this[ namespace ][ measure ] = segmentSize;

    },

    _checkIfSegmentsChanged : function( isRows ) {
      var namespace = this.options.layoutMode,
          segmentsName = isRows ? 'rows' : 'cols',
          prevSegments = this[ namespace ][ segmentsName ];
      // update cols/rows
      this._getSegments( isRows );
      // return if updated cols/rows is not equal to previous
      return ( this[ namespace ][ segmentsName ] !== prevSegments );
    },

    // ====================== Masonry ======================

    _masonryReset : function() {
      // layout-specific props
      this.masonry = {};
      // FIXME shouldn't have to call this again
      this._getSegments();
      var i = this.masonry.cols;
      this.masonry.colYs = [];
      while (i--) {
        this.masonry.colYs.push( 0 );
      }
    },

    _masonryLayout : function( $elems ) {
      var instance = this,
          props = instance.masonry;
      $elems.each(function(){
        var $this  = $(this),
            //how many columns does this brick span
            colSpan = Math.ceil( $this.outerWidth(true) / props.columnWidth );
        colSpan = Math.min( colSpan, props.cols );

        if ( colSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryPlaceBrick( $this, props.colYs );
        } else {
          // brick spans more than one column
          // how many different places could this brick fit horizontally
          var groupCount = props.cols + 1 - colSpan,
              groupY = [],
              groupColY,
              i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupColY = props.colYs.slice( i, i+colSpan );
            // and get the max value of the array
            groupY[i] = Math.max.apply( Math, groupColY );
          }

          instance._masonryPlaceBrick( $this, groupY );
        }
      });
    },

    // worker method that places brick in the columnSet
    //   with the the minY
    _masonryPlaceBrick : function( $brick, setY ) {
      // get the minimum Y value from the columns
      var minimumY = Math.min.apply( Math, setY ),
          shortCol = 0;

      // Find index of short column, the first from the left
      for (var i=0, len = setY.length; i < len; i++) {
        if ( setY[i] === minimumY ) {
          shortCol = i;
          break;
        }
      }

      // position the brick
      var x = this.masonry.columnWidth * shortCol,
          y = minimumY;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      var setHeight = minimumY + $brick.outerHeight(true),
          setSpan = this.masonry.cols + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.masonry.colYs[ shortCol + i ] = setHeight;
      }

    },

    _masonryGetContainerSize : function() {
      var containerHeight = Math.max.apply( Math, this.masonry.colYs );
      return { height: containerHeight };
    },

    _masonryResizeChanged : function() {
      return this._checkIfSegmentsChanged();
    },

    // ====================== fitRows ======================

    _fitRowsReset : function() {
      this.fitRows = {
        x : 0,
        y : 0,
        height : 0
      };
    },

    _fitRowsLayout : function( $elems ) {
      var instance = this,
          containerWidth = this.element.width(),
          props = this.fitRows;

      $elems.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true);

        if ( props.x !== 0 && atomW + props.x > containerWidth ) {
          // if this element cannot fit in the current row
          props.x = 0;
          props.y = props.height;
        }

        // position the atom
        instance._pushPosition( $this, props.x, props.y );

        props.height = Math.max( props.y + atomH, props.height );
        props.x += atomW;

      });
    },

    _fitRowsGetContainerSize : function () {
      return { height : this.fitRows.height };
    },

    _fitRowsResizeChanged : function() {
      return true;
    },


    // ====================== cellsByRow ======================

    _cellsByRowReset : function() {
      this.cellsByRow = {
        index : 0
      };
      // get this.cellsByRow.columnWidth
      this._getSegments();
      // get this.cellsByRow.rowHeight
      this._getSegments(true);
    },

    _cellsByRowLayout : function( $elems ) {
      var instance = this,
          props = this.cellsByRow;
      $elems.each( function(){
        var $this = $(this),
            col = props.index % props.cols,
            row = Math.floor( props.index / props.cols ),
            x = ( col + 0.5 ) * props.columnWidth - $this.outerWidth(true) / 2,
            y = ( row + 0.5 ) * props.rowHeight - $this.outerHeight(true) / 2;
        instance._pushPosition( $this, x, y );
        props.index ++;
      });
    },

    _cellsByRowGetContainerSize : function() {
      return { height : Math.ceil( this.$filteredAtoms.length / this.cellsByRow.cols ) * this.cellsByRow.rowHeight + this.offset.top };
    },

    _cellsByRowResizeChanged : function() {
      return this._checkIfSegmentsChanged();
    },


    // ====================== straightDown ======================

    _straightDownReset : function() {
      this.straightDown = {
        y : 0
      };
    },

    _straightDownLayout : function( $elems ) {
      var instance = this;
      $elems.each( function( i ){
        var $this = $(this);
        instance._pushPosition( $this, 0, instance.straightDown.y );
        instance.straightDown.y += $this.outerHeight(true);
      });
    },

    _straightDownGetContainerSize : function() {
      return { height : this.straightDown.y };
    },

    _straightDownResizeChanged : function() {
      return true;
    },


    // ====================== masonryHorizontal ======================

    _masonryHorizontalReset : function() {
      // layout-specific props
      this.masonryHorizontal = {};
      // FIXME shouldn't have to call this again
      this._getSegments( true );
      var i = this.masonryHorizontal.rows;
      this.masonryHorizontal.rowXs = [];
      while (i--) {
        this.masonryHorizontal.rowXs.push( 0 );
      }
    },

    _masonryHorizontalLayout : function( $elems ) {
      var instance = this,
          props = instance.masonryHorizontal;
      $elems.each(function(){
        var $this  = $(this),
            //how many rows does this brick span
            rowSpan = Math.ceil( $this.outerHeight(true) / props.rowHeight );
        rowSpan = Math.min( rowSpan, props.rows );

        if ( rowSpan === 1 ) {
          // if brick spans only one column, just like singleMode
          instance._masonryHorizontalPlaceBrick( $this, props.rowXs );
        } else {
          // brick spans more than one row
          // how many different places could this brick fit horizontally
          var groupCount = props.rows + 1 - rowSpan,
              groupX = [],
              groupRowX, i;

          // for each group potential horizontal position
          for ( i=0; i < groupCount; i++ ) {
            // make an array of colY values for that one group
            groupRowX = props.rowXs.slice( i, i+rowSpan );
            // and get the max value of the array
            groupX[i] = Math.max.apply( Math, groupRowX );
          }

          instance._masonryHorizontalPlaceBrick( $this, groupX );
        }
      });
    },

    _masonryHorizontalPlaceBrick : function( $brick, setX ) {
      // get the minimum Y value from the columns
      var minimumX  = Math.min.apply( Math, setX ),
          smallRow  = 0;
      // Find index of smallest row, the first from the top
      for (var i=0, len = setX.length; i < len; i++) {
        if ( setX[i] === minimumX ) {
          smallRow = i;
          break;
        }
      }

      // position the brick
      var x = minimumX,
          y = this.masonryHorizontal.rowHeight * smallRow;
      this._pushPosition( $brick, x, y );

      // apply setHeight to necessary columns
      var setWidth = minimumX + $brick.outerWidth(true),
          setSpan = this.masonryHorizontal.rows + 1 - len;
      for ( i=0; i < setSpan; i++ ) {
        this.masonryHorizontal.rowXs[ smallRow + i ] = setWidth;
      }
    },

    _masonryHorizontalGetContainerSize : function() {
      var containerWidth = Math.max.apply( Math, this.masonryHorizontal.rowXs );
      return { width: containerWidth };
    },

    _masonryHorizontalResizeChanged : function() {
      return this._checkIfSegmentsChanged(true);
    },


    // ====================== fitColumns ======================

    _fitColumnsReset : function() {
      this.fitColumns = {
        x : 0,
        y : 0,
        width : 0
      };
    },

    _fitColumnsLayout : function( $elems ) {
      var instance = this,
          containerHeight = this.element.height(),
          props = this.fitColumns;
      $elems.each( function() {
        var $this = $(this),
            atomW = $this.outerWidth(true),
            atomH = $this.outerHeight(true);

        if ( props.y !== 0 && atomH + props.y > containerHeight ) {
          // if this element cannot fit in the current column
          props.x = props.width;
          props.y = 0;
        }

        // position the atom
        instance._pushPosition( $this, props.x, props.y );

        props.width = Math.max( props.x + atomW, props.width );
        props.y += atomH;

      });
    },

    _fitColumnsGetContainerSize : function () {
      return { width : this.fitColumns.width };
    },

    _fitColumnsResizeChanged : function() {
      return true;
    },



    // ====================== cellsByColumn ======================

    _cellsByColumnReset : function() {
      this.cellsByColumn = {
        index : 0
      };
      // get this.cellsByColumn.columnWidth
      this._getSegments();
      // get this.cellsByColumn.rowHeight
      this._getSegments(true);
    },

    _cellsByColumnLayout : function( $elems ) {
      var instance = this,
          props = this.cellsByColumn;
      $elems.each( function(){
        var $this = $(this),
            col = Math.floor( props.index / props.rows ),
            row = props.index % props.rows,
            x = ( col + 0.5 ) * props.columnWidth - $this.outerWidth(true) / 2,
            y = ( row + 0.5 ) * props.rowHeight - $this.outerHeight(true) / 2;
        instance._pushPosition( $this, x, y );
        props.index ++;
      });
    },

    _cellsByColumnGetContainerSize : function() {
      return { width : Math.ceil( this.$filteredAtoms.length / this.cellsByColumn.rows ) * this.cellsByColumn.columnWidth };
    },

    _cellsByColumnResizeChanged : function() {
      return this._checkIfSegmentsChanged(true);
    },

    // ====================== straightAcross ======================

    _straightAcrossReset : function() {
      this.straightAcross = {
        x : 0
      };
    },

    _straightAcrossLayout : function( $elems ) {
      var instance = this;
      $elems.each( function( i ){
        var $this = $(this);
        instance._pushPosition( $this, instance.straightAcross.x, 0 );
        instance.straightAcross.x += $this.outerWidth(true);
      });
    },

    _straightAcrossGetContainerSize : function() {
      return { width : this.straightAcross.x };
    },

    _straightAcrossResizeChanged : function() {
      return true;
    }

  };


  // ======================= imagesLoaded Plugin ===============================
  /*!
   * jQuery imagesLoaded plugin v1.1.0
   * http://github.com/desandro/imagesloaded
   *
   * MIT License. by Paul Irish et al.
   */


  // $('#my-container').imagesLoaded(myFunction)
  // or
  // $('img').imagesLoaded(myFunction)

  // execute a callback when all images have loaded.
  // needed because .load() doesn't work on cached images

  // callback function gets image collection as argument
  //  `this` is the container

  $.fn.imagesLoaded = function( callback ) {
    var $this = this,
        $images = $this.find('img').add( $this.filter('img') ),
        len = $images.length,
        blank = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        loaded = [];

    function triggerCallback() {
      callback.call( $this, $images );
    }

    function imgLoaded( event ) {
      var img = event.target;
      if ( img.src !== blank && $.inArray( img, loaded ) === -1 ){
        loaded.push( img );
        if ( --len <= 0 ){
          setTimeout( triggerCallback );
          $images.unbind( '.imagesLoaded', imgLoaded );
        }
      }
    }

    // if no images, trigger immediately
    if ( !len ) {
      triggerCallback();
    }

    $images.bind( 'load.imagesLoaded error.imagesLoaded',  imgLoaded ).each( function() {
      // cached images don't fire load sometimes, so we reset src.
      var src = this.src;
      // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
      // data uri bypasses webkit log warning (thx doug jones)
      this.src = blank;
      this.src = src;
    });

    return $this;
  };


  // helper function for logging errors
  // $.error breaks jQuery chaining
  var logError = function( message ) {
    if ( window.console ) {
      window.console.error( message );
    }
  };

  // =======================  Plugin bridge  ===============================
  // leverages data method to either create or return $.Isotope constructor
  // A bit from jQuery UI
  //   https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.widget.js
  // A bit from jcarousel
  //   https://github.com/jsor/jcarousel/blob/master/lib/jquery.jcarousel.js

  $.fn.isotope = function( options, callback ) {
    if ( typeof options === 'string' ) {
      // call method
      var args = Array.prototype.slice.call( arguments, 1 );

      this.each(function(){
        var instance = $.data( this, 'isotope' );
        if ( !instance ) {
          logError( "cannot call methods on isotope prior to initialization; " +
              "attempted to call method '" + options + "'" );
          return;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
          logError( "no such method '" + options + "' for isotope instance" );
          return;
        }
        // apply method
        instance[ options ].apply( instance, args );
      });
    } else {
      this.each(function() {
        var instance = $.data( this, 'isotope' );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init( callback );
        } else {
          // initialize new instance
          $.data( this, 'isotope', new $.Isotope( options, this, callback ) );
        }
      });
    }
    // return jQuery object
    // so plugin methods do not have to
    return this;
  };

})( window, jQuery );

/*!
* Bootstrap.js by @fat & @mdo
* Copyright 2012 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/
!function(e){e(function(){"use strict";e.support.transition=function(){var e=function(){var e=document.createElement("bootstrap"),t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},n;for(n in t)if(e.style[n]!==undefined)return t[n]}();return e&&{end:e}}()})}(window.jQuery),!function(e){"use strict";var t='[data-dismiss="alert"]',n=function(n){e(n).on("click",t,this.close)};n.prototype.close=function(t){function s(){i.trigger("closed").remove()}var n=e(this),r=n.attr("data-target"),i;r||(r=n.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,"")),i=e(r),t&&t.preventDefault(),i.length||(i=n.hasClass("alert")?n:n.parent()),i.trigger(t=e.Event("close"));if(t.isDefaultPrevented())return;i.removeClass("in"),e.support.transition&&i.hasClass("fade")?i.on(e.support.transition.end,s):s()},e.fn.alert=function(t){return this.each(function(){var r=e(this),i=r.data("alert");i||r.data("alert",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.alert.Constructor=n,e(function(){e("body").on("click.alert.data-api",t,n.prototype.close)})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.button.defaults,n)};t.prototype.setState=function(e){var t="disabled",n=this.$element,r=n.data(),i=n.is("input")?"val":"html";e+="Text",r.resetText||n.data("resetText",n[i]()),n[i](r[e]||this.options[e]),setTimeout(function(){e=="loadingText"?n.addClass(t).attr(t,t):n.removeClass(t).removeAttr(t)},0)},t.prototype.toggle=function(){var e=this.$element.closest('[data-toggle="buttons-radio"]');e&&e.find(".active").removeClass("active"),this.$element.toggleClass("active")},e.fn.button=function(n){return this.each(function(){var r=e(this),i=r.data("button"),s=typeof n=="object"&&n;i||r.data("button",i=new t(this,s)),n=="toggle"?i.toggle():n&&i.setState(n)})},e.fn.button.defaults={loadingText:"loading..."},e.fn.button.Constructor=t,e(function(){e("body").on("click.button.data-api","[data-toggle^=button]",function(t){var n=e(t.target);n.hasClass("btn")||(n=n.closest(".btn")),n.button("toggle")})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=n,this.options.slide&&this.slide(this.options.slide),this.options.pause=="hover"&&this.$element.on("mouseenter",e.proxy(this.pause,this)).on("mouseleave",e.proxy(this.cycle,this))};t.prototype={cycle:function(t){return t||(this.paused=!1),this.options.interval&&!this.paused&&(this.interval=setInterval(e.proxy(this.next,this),this.options.interval)),this},to:function(t){var n=this.$element.find(".item.active"),r=n.parent().children(),i=r.index(n),s=this;if(t>r.length-1||t<0)return;return this.sliding?this.$element.one("slid",function(){s.to(t)}):i==t?this.pause().cycle():this.slide(t>i?"next":"prev",e(r[t]))},pause:function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&e.support.transition.end&&(this.$element.trigger(e.support.transition.end),this.cycle()),clearInterval(this.interval),this.interval=null,this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(t,n){var r=this.$element.find(".item.active"),i=n||r[t](),s=this.interval,o=t=="next"?"left":"right",u=t=="next"?"first":"last",a=this,f=e.Event("slide",{relatedTarget:i[0]});this.sliding=!0,s&&this.pause(),i=i.length?i:this.$element.find(".item")[u]();if(i.hasClass("active"))return;if(e.support.transition&&this.$element.hasClass("slide")){this.$element.trigger(f);if(f.isDefaultPrevented())return;i.addClass(t),i[0].offsetWidth,r.addClass(o),i.addClass(o),this.$element.one(e.support.transition.end,function(){i.removeClass([t,o].join(" ")).addClass("active"),r.removeClass(["active",o].join(" ")),a.sliding=!1,setTimeout(function(){a.$element.trigger("slid")},0)})}else{this.$element.trigger(f);if(f.isDefaultPrevented())return;r.removeClass("active"),i.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return s&&this.cycle(),this}},e.fn.carousel=function(n){return this.each(function(){var r=e(this),i=r.data("carousel"),s=e.extend({},e.fn.carousel.defaults,typeof n=="object"&&n),o=typeof n=="string"?n:s.slide;i||r.data("carousel",i=new t(this,s)),typeof n=="number"?i.to(n):o?i[o]():s.interval&&i.cycle()})},e.fn.carousel.defaults={interval:5e3,pause:"hover"},e.fn.carousel.Constructor=t,e(function(){e("body").on("click.carousel.data-api","[data-slide]",function(t){var n=e(this),r,i=e(n.attr("data-target")||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,"")),s=!i.data("modal")&&e.extend({},i.data(),n.data());i.carousel(s),t.preventDefault()})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.collapse.defaults,n),this.options.parent&&(this.$parent=e(this.options.parent)),this.options.toggle&&this.toggle()};t.prototype={constructor:t,dimension:function(){var e=this.$element.hasClass("width");return e?"width":"height"},show:function(){var t,n,r,i;if(this.transitioning)return;t=this.dimension(),n=e.camelCase(["scroll",t].join("-")),r=this.$parent&&this.$parent.find("> .accordion-group > .in");if(r&&r.length){i=r.data("collapse");if(i&&i.transitioning)return;r.collapse("hide"),i||r.data("collapse",null)}this.$element[t](0),this.transition("addClass",e.Event("show"),"shown"),e.support.transition&&this.$element[t](this.$element[0][n])},hide:function(){var t;if(this.transitioning)return;t=this.dimension(),this.reset(this.$element[t]()),this.transition("removeClass",e.Event("hide"),"hidden"),this.$element[t](0)},reset:function(e){var t=this.dimension();return this.$element.removeClass("collapse")[t](e||"auto")[0].offsetWidth,this.$element[e!==null?"addClass":"removeClass"]("collapse"),this},transition:function(t,n,r){var i=this,s=function(){n.type=="show"&&i.reset(),i.transitioning=0,i.$element.trigger(r)};this.$element.trigger(n);if(n.isDefaultPrevented())return;this.transitioning=1,this.$element[t]("in"),e.support.transition&&this.$element.hasClass("collapse")?this.$element.one(e.support.transition.end,s):s()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}},e.fn.collapse=function(n){return this.each(function(){var r=e(this),i=r.data("collapse"),s=typeof n=="object"&&n;i||r.data("collapse",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.collapse.defaults={toggle:!0},e.fn.collapse.Constructor=t,e(function(){e("body").on("click.collapse.data-api","[data-toggle=collapse]",function(t){var n=e(this),r,i=n.attr("data-target")||t.preventDefault()||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,""),s=e(i).data("collapse")?"toggle":n.data();n[e(i).hasClass("in")?"addClass":"removeClass"]("collapsed"),e(i).collapse(s)})})}(window.jQuery),!function(e){"use strict";function r(){i(e(t)).removeClass("open")}function i(t){var n=t.attr("data-target"),r;return n||(n=t.attr("href"),n=n&&/#/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,"")),r=e(n),r.length||(r=t.parent()),r}var t="[data-toggle=dropdown]",n=function(t){var n=e(t).on("click.dropdown.data-api",this.toggle);e("html").on("click.dropdown.data-api",function(){n.parent().removeClass("open")})};n.prototype={constructor:n,toggle:function(t){var n=e(this),s,o;if(n.is(".disabled, :disabled"))return;return s=i(n),o=s.hasClass("open"),r(),o||(s.toggleClass("open"),n.focus()),!1},keydown:function(t){var n,r,s,o,u,a;if(!/(38|40|27)/.test(t.keyCode))return;n=e(this),t.preventDefault(),t.stopPropagation();if(n.is(".disabled, :disabled"))return;o=i(n),u=o.hasClass("open");if(!u||u&&t.keyCode==27)return n.click();r=e("[role=menu] li:not(.divider) a",o);if(!r.length)return;a=r.index(r.filter(":focus")),t.keyCode==38&&a>0&&a--,t.keyCode==40&&a<r.length-1&&a++,~a||(a=0),r.eq(a).focus()}},e.fn.dropdown=function(t){return this.each(function(){var r=e(this),i=r.data("dropdown");i||r.data("dropdown",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.dropdown.Constructor=n,e(function(){e("html").on("click.dropdown.data-api touchstart.dropdown.data-api",r),e("body").on("click.dropdown touchstart.dropdown.data-api",".dropdown form",function(e){e.stopPropagation()}).on("click.dropdown.data-api touchstart.dropdown.data-api",t,n.prototype.toggle).on("keydown.dropdown.data-api touchstart.dropdown.data-api",t+", [role=menu]",n.prototype.keydown)})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=n,this.$element=e(t).delegate('[data-dismiss="modal"]',"click.dismiss.modal",e.proxy(this.hide,this)),this.options.remote&&this.$element.find(".modal-body").load(this.options.remote)};t.prototype={constructor:t,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var t=this,n=e.Event("show");this.$element.trigger(n);if(this.isShown||n.isDefaultPrevented())return;e("body").addClass("modal-open"),this.isShown=!0,this.escape(),this.backdrop(function(){var n=e.support.transition&&t.$element.hasClass("fade");t.$element.parent().length||t.$element.appendTo(document.body),t.$element.show(),n&&t.$element[0].offsetWidth,t.$element.addClass("in").attr("aria-hidden",!1).focus(),t.enforceFocus(),n?t.$element.one(e.support.transition.end,function(){t.$element.trigger("shown")}):t.$element.trigger("shown")})},hide:function(t){t&&t.preventDefault();var n=this;t=e.Event("hide"),this.$element.trigger(t);if(!this.isShown||t.isDefaultPrevented())return;this.isShown=!1,e("body").removeClass("modal-open"),this.escape(),e(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),e.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},enforceFocus:function(){var t=this;e(document).on("focusin.modal",function(e){t.$element[0]!==e.target&&!t.$element.has(e.target).length&&t.$element.focus()})},escape:function(){var e=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(t){t.which==27&&e.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var t=this,n=setTimeout(function(){t.$element.off(e.support.transition.end),t.hideModal()},500);this.$element.one(e.support.transition.end,function(){clearTimeout(n),t.hideModal()})},hideModal:function(e){this.$element.hide().trigger("hidden"),this.backdrop()},removeBackdrop:function(){this.$backdrop.remove(),this.$backdrop=null},backdrop:function(t){var n=this,r=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=e.support.transition&&r;this.$backdrop=e('<div class="modal-backdrop '+r+'" />').appendTo(document.body),this.options.backdrop!="static"&&this.$backdrop.click(e.proxy(this.hide,this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),i?this.$backdrop.one(e.support.transition.end,t):t()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),e.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(e.support.transition.end,e.proxy(this.removeBackdrop,this)):this.removeBackdrop()):t&&t()}},e.fn.modal=function(n){return this.each(function(){var r=e(this),i=r.data("modal"),s=e.extend({},e.fn.modal.defaults,r.data(),typeof n=="object"&&n);i||r.data("modal",i=new t(this,s)),typeof n=="string"?i[n]():s.show&&i.show()})},e.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},e.fn.modal.Constructor=t,e(function(){e("body").on("click.modal.data-api",'[data-toggle="modal"]',function(t){var n=e(this),r=n.attr("href"),i=e(n.attr("data-target")||r&&r.replace(/.*(?=#[^\s]+$)/,"")),s=i.data("modal")?"toggle":e.extend({remote:!/#/.test(r)&&r},i.data(),n.data());t.preventDefault(),i.modal(s).one("hide",function(){n.focus()})})})}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s;this.type=t,this.$element=e(n),this.options=this.getOptions(r),this.enabled=!0,this.options.trigger=="click"?this.$element.on("click."+this.type,this.options.selector,e.proxy(this.toggle,this)):this.options.trigger!="manual"&&(i=this.options.trigger=="hover"?"mouseenter":"focus",s=this.options.trigger=="hover"?"mouseleave":"blur",this.$element.on(i+"."+this.type,this.options.selector,e.proxy(this.enter,this)),this.$element.on(s+"."+this.type,this.options.selector,e.proxy(this.leave,this))),this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){return t=e.extend({},e.fn[this.type].defaults,t,this.$element.data()),t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay}),t},enter:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(!n.options.delay||!n.options.delay.show)return n.show();clearTimeout(this.timeout),n.hoverState="in",this.timeout=setTimeout(function(){n.hoverState=="in"&&n.show()},n.options.delay.show)},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);this.timeout&&clearTimeout(this.timeout);if(!n.options.delay||!n.options.delay.hide)return n.hide();n.hoverState="out",this.timeout=setTimeout(function(){n.hoverState=="out"&&n.hide()},n.options.delay.hide)},show:function(){var e,t,n,r,i,s,o;if(this.hasContent()&&this.enabled){e=this.tip(),this.setContent(),this.options.animation&&e.addClass("fade"),s=typeof this.options.placement=="function"?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement,t=/in/.test(s),e.remove().css({top:0,left:0,display:"block"}).appendTo(t?this.$element:document.body),n=this.getPosition(t),r=e[0].offsetWidth,i=e[0].offsetHeight;switch(t?s.split(" ")[1]:s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width}}e.css(o).addClass(s).addClass("in")}},setContent:function(){var e=this.tip(),t=this.getTitle();e.find(".tooltip-inner")[this.options.html?"html":"text"](t),e.removeClass("fade in top bottom left right")},hide:function(){function r(){var t=setTimeout(function(){n.off(e.support.transition.end).remove()},500);n.one(e.support.transition.end,function(){clearTimeout(t),n.remove()})}var t=this,n=this.tip();return n.removeClass("in"),e.support.transition&&this.$tip.hasClass("fade")?r():n.remove(),this},fixTitle:function(){var e=this.$element;(e.attr("title")||typeof e.attr("data-original-title")!="string")&&e.attr("data-original-title",e.attr("title")||"").removeAttr("title")},hasContent:function(){return this.getTitle()},getPosition:function(t){return e.extend({},t?{top:0,left:0}:this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title),e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}},e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;i||r.data("tooltip",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.tooltip.Constructor=t,e.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover",title:"",delay:0,html:!0}}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("popover",e,t)};t.prototype=e.extend({},e.fn.tooltip.Constructor.prototype,{constructor:t,setContent:function(){var e=this.tip(),t=this.getTitle(),n=this.getContent();e.find(".popover-title")[this.options.html?"html":"text"](t),e.find(".popover-content > *")[this.options.html?"html":"text"](n),e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-content")||(typeof n.content=="function"?n.content.call(t[0]):n.content),e},tip:function(){return this.$tip||(this.$tip=e(this.options.template)),this.$tip},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}}),e.fn.popover=function(n){return this.each(function(){var r=e(this),i=r.data("popover"),s=typeof n=="object"&&n;i||r.data("popover",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.popover.Constructor=t,e.fn.popover.defaults=e.extend({},e.fn.tooltip.defaults,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})}(window.jQuery),!function(e){"use strict";function t(t,n){var r=e.proxy(this.process,this),i=e(t).is("body")?e(window):e(t),s;this.options=e.extend({},e.fn.scrollspy.defaults,n),this.$scrollElement=i.on("scroll.scroll-spy.data-api",r),this.selector=(this.options.target||(s=e(t).attr("href"))&&s.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=e("body"),this.refresh(),this.process()}t.prototype={constructor:t,refresh:function(){var t=this,n;this.offsets=e([]),this.targets=e([]),n=this.$body.find(this.selector).map(function(){var t=e(this),n=t.data("target")||t.attr("href"),r=/^#\w/.test(n)&&e(n);return r&&r.length&&[[r.position().top,n]]||null}).sort(function(e,t){return e[0]-t[0]}).each(function(){t.offsets.push(this[0]),t.targets.push(this[1])})},process:function(){var e=this.$scrollElement.scrollTop()+this.options.offset,t=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,n=t-this.$scrollElement.height(),r=this.offsets,i=this.targets,s=this.activeTarget,o;if(e>=n)return s!=(o=i.last()[0])&&this.activate(o);for(o=r.length;o--;)s!=i[o]&&e>=r[o]&&(!r[o+1]||e<=r[o+1])&&this.activate(i[o])},activate:function(t){var n,r;this.activeTarget=t,e(this.selector).parent(".active").removeClass("active"),r=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',n=e(r).parent("li").addClass("active"),n.parent(".dropdown-menu").length&&(n=n.closest("li.dropdown").addClass("active")),n.trigger("activate")}},e.fn.scrollspy=function(n){return this.each(function(){var r=e(this),i=r.data("scrollspy"),s=typeof n=="object"&&n;i||r.data("scrollspy",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.scrollspy.Constructor=t,e.fn.scrollspy.defaults={offset:10},e(window).on("load",function(){e('[data-spy="scroll"]').each(function(){var t=e(this);t.scrollspy(t.data())})})}(window.jQuery),!function(e){"use strict";var t=function(t){this.element=e(t)};t.prototype={constructor:t,show:function(){var t=this.element,n=t.closest("ul:not(.dropdown-menu)"),r=t.attr("data-target"),i,s,o;r||(r=t.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,""));if(t.parent("li").hasClass("active"))return;i=n.find(".active a").last()[0],o=e.Event("show",{relatedTarget:i}),t.trigger(o);if(o.isDefaultPrevented())return;s=e(r),this.activate(t.parent("li"),n),this.activate(s,s.parent(),function(){t.trigger({type:"shown",relatedTarget:i})})},activate:function(t,n,r){function o(){i.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),t.addClass("active"),s?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu")&&t.closest("li.dropdown").addClass("active"),r&&r()}var i=n.find("> .active"),s=r&&e.support.transition&&i.hasClass("fade");s?i.one(e.support.transition.end,o):o(),i.removeClass("in")}},e.fn.tab=function(n){return this.each(function(){var r=e(this),i=r.data("tab");i||r.data("tab",i=new t(this)),typeof n=="string"&&i[n]()})},e.fn.tab.Constructor=t,e(function(){e("body").on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(t){t.preventDefault(),e(this).tab("show")})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.typeahead.defaults,n),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.$menu=e(this.options.menu).appendTo("body"),this.source=this.options.source,this.shown=!1,this.listen()};t.prototype={constructor:t,select:function(){var e=this.$menu.find(".active").attr("data-value");return this.$element.val(this.updater(e)).change(),this.hide()},updater:function(e){return e},show:function(){var t=e.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});return this.$menu.css({top:t.top+t.height,left:t.left}),this.$menu.show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(t){var n;return this.query=this.$element.val(),!this.query||this.query.length<this.options.minLength?this.shown?this.hide():this:(n=e.isFunction(this.source)?this.source(this.query,e.proxy(this.process,this)):this.source,n?this.process(n):this)},process:function(t){var n=this;return t=e.grep(t,function(e){return n.matcher(e)}),t=this.sorter(t),t.length?this.render(t.slice(0,this.options.items)).show():this.shown?this.hide():this},matcher:function(e){return~e.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(e){var t=[],n=[],r=[],i;while(i=e.shift())i.toLowerCase().indexOf(this.query.toLowerCase())?~i.indexOf(this.query)?n.push(i):r.push(i):t.push(i);return t.concat(n,r)},highlighter:function(e){var t=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return e.replace(new RegExp("("+t+")","ig"),function(e,t){return"<strong>"+t+"</strong>"})},render:function(t){var n=this;return t=e(t).map(function(t,r){return t=e(n.options.item).attr("data-value",r),t.find("a").html(n.highlighter(r)),t[0]}),t.first().addClass("active"),this.$menu.html(t),this},next:function(t){var n=this.$menu.find(".active").removeClass("active"),r=n.next();r.length||(r=e(this.$menu.find("li")[0])),r.addClass("active")},prev:function(e){var t=this.$menu.find(".active").removeClass("active"),n=t.prev();n.length||(n=this.$menu.find("li").last()),n.addClass("active")},listen:function(){this.$element.on("blur",e.proxy(this.blur,this)).on("keypress",e.proxy(this.keypress,this)).on("keyup",e.proxy(this.keyup,this)),(e.browser.chrome||e.browser.webkit||e.browser.msie)&&this.$element.on("keydown",e.proxy(this.keydown,this)),this.$menu.on("click",e.proxy(this.click,this)).on("mouseenter","li",e.proxy(this.mouseenter,this))},move:function(e){if(!this.shown)return;switch(e.keyCode){case 9:case 13:case 27:e.preventDefault();break;case 38:e.preventDefault(),this.prev();break;case 40:e.preventDefault(),this.next()}e.stopPropagation()},keydown:function(t){this.suppressKeyPressRepeat=!~e.inArray(t.keyCode,[40,38,9,13,27]),this.move(t)},keypress:function(e){if(this.suppressKeyPressRepeat)return;this.move(e)},keyup:function(e){switch(e.keyCode){case 40:case 38:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}e.stopPropagation(),e.preventDefault()},blur:function(e){var t=this;setTimeout(function(){t.hide()},150)},click:function(e){e.stopPropagation(),e.preventDefault(),this.select()},mouseenter:function(t){this.$menu.find(".active").removeClass("active"),e(t.currentTarget).addClass("active")}},e.fn.typeahead=function(n){return this.each(function(){var r=e(this),i=r.data("typeahead"),s=typeof n=="object"&&n;i||r.data("typeahead",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1},e.fn.typeahead.Constructor=t,e(function(){e("body").on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(t){var n=e(this);if(n.data("typeahead"))return;t.preventDefault(),n.typeahead(n.data())})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=e.extend({},e.fn.affix.defaults,n),this.$window=e(window).on("scroll.affix.data-api",e.proxy(this.checkPosition,this)),this.$element=e(t),this.checkPosition()};t.prototype.checkPosition=function(){if(!this.$element.is(":visible"))return;var t=e(document).height(),n=this.$window.scrollTop(),r=this.$element.offset(),i=this.options.offset,s=i.bottom,o=i.top,u="affix affix-top affix-bottom",a;typeof i!="object"&&(s=o=i),typeof o=="function"&&(o=i.top()),typeof s=="function"&&(s=i.bottom()),a=this.unpin!=null&&n+this.unpin<=r.top?!1:s!=null&&r.top+this.$element.height()>=t-s?"bottom":o!=null&&n<=o?"top":!1;if(this.affixed===a)return;this.affixed=a,this.unpin=a=="bottom"?r.top-n:null,this.$element.removeClass(u).addClass("affix"+(a?"-"+a:""))},e.fn.affix=function(n){return this.each(function(){var r=e(this),i=r.data("affix"),s=typeof n=="object"&&n;i||r.data("affix",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.affix.Constructor=t,e.fn.affix.defaults={offset:0},e(window).on("load",function(){e('[data-spy="affix"]').each(function(){var t=e(this),n=t.data();n.offset=n.offset||{},n.offsetBottom&&(n.offset.bottom=n.offsetBottom),n.offsetTop&&(n.offset.top=n.offsetTop),t.affix(n)})})}(window.jQuery);

/*!
Video.js - HTML5 Video Player
Version 3.2.0

LGPL v3 LICENSE INFO
This file is part of Video.js. Copyright 2011 Zencoder, Inc.

Video.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Video.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with Video.js.  If not, see <http://www.gnu.org/licenses/>.
*/

// Self-executing function to prevent global vars and help with minification
;(function(window, undefined){
  var document = window.document;// HTML5 Shiv. Must be in <head> to support older browsers.
document.createElement("video");document.createElement("audio");

var VideoJS = function(id, addOptions, ready){
  var tag; // Element of ID

  // Allow for element or ID to be passed in
  // String ID
  if (typeof id == "string") {

    // Adjust for jQuery ID syntax
    if (id.indexOf("#") === 0) {
      id = id.slice(1);
    }

    // If a player instance has already been created for this ID return it.
    if (_V_.players[id]) {
      return _V_.players[id];

    // Otherwise get element for ID
    } else {
      tag = _V_.el(id)
    }

  // ID is a media element
  } else {
    tag = id;
  }

  // Check for a useable element
  if (!tag || !tag.nodeName) { // re: nodeName, could be a box div also
    throw new TypeError("The element or ID supplied is not valid. (VideoJS)"); // Returns
  }

  // Element may have a player attr referring to an already created player instance.
  // If not, set up a new player and return the instance.
  return tag.player || new _V_.Player(tag, addOptions, ready);
},

// Shortcut
_V_ = VideoJS,

// CDN Version. Used to target right flash swf.
CDN_VERSION = "3.2";

VideoJS.players = {};

VideoJS.options = {

  // Default order of fallback technology
  techOrder: ["html5","flash"],
  // techOrder: ["flash","html5"],

  html5: {},
  flash: { swf: "http://vjs.zencdn.net/c/video-js.swf" },

  // Default of web browser is 300x150. Should rely on source width/height.
  width: "auto",
  height: "auto",

  // defaultVolume: 0.85,
  defaultVolume: 0.00, // The freakin seaguls are driving me crazy!

  // Included control sets
  components: {
    "posterImage": {},
    "textTrackDisplay": {},
    "loadingSpinner": {},
    "bigPlayButton": {},
    "controlBar": {}
  }

  // components: [
  //   "poster",
  //   "loadingSpinner",
  //   "bigPlayButton",
  //   { name: "controlBar", options: {
  //     components: [
  //       "playToggle",
  //       "fullscreenToggle",
  //       "currentTimeDisplay",
  //       "timeDivider",
  //       "durationDisplay",
  //       "remainingTimeDisplay",
  //       { name: "progressControl", options: {
  //         components: [
  //           { name: "seekBar", options: {
  //             components: [
  //               "loadProgressBar",
  //               "playProgressBar",
  //               "seekHandle"
  //             ]}
  //           }
  //         ]}
  //       },
  //       { name: "volumeControl", options: {
  //         components: [
  //           { name: "volumeBar", options: {
  //             components: [
  //               "volumeLevel",
  //               "volumeHandle"
  //             ]}
  //           }
  //         ]}
  //       },
  //       "muteToggle"
  //     ]
  //   }},
  //   "subtitlesDisplay"/*, "replay"*/
  // ]
};

// Set CDN Version of swf
if (CDN_VERSION != "GENERATED_CDN_VSN") {
  _V_.options.flash.swf = "http://vjs.zencdn.net/"+CDN_VERSION+"/video-js.swf"
}_V_.merge = function(obj1, obj2, safe){
  // Make sure second object exists
  if (!obj2) { obj2 = {}; };

  for (var attrname in obj2){
    if (obj2.hasOwnProperty(attrname) && (!safe || !obj1.hasOwnProperty(attrname))) { obj1[attrname]=obj2[attrname]; }
  }
  return obj1;
};
_V_.extend = function(obj){ this.merge(this, obj, true); };

_V_.extend({
  tech: {}, // Holder for playback technology settings
  controlSets: {}, // Holder for control set definitions

  // Device Checks
  isIE: function(){ return !+"\v1"; },
  isFF: function(){ return !!_V_.ua.match("Firefox") },
  isIPad: function(){ return navigator.userAgent.match(/iPad/i) !== null; },
  isIPhone: function(){ return navigator.userAgent.match(/iPhone/i) !== null; },
  isIOS: function(){ return VideoJS.isIPhone() || VideoJS.isIPad(); },
  iOSVersion: function() {
    var match = navigator.userAgent.match(/OS (\d+)_/i);
    if (match && match[1]) { return match[1]; }
  },
  isAndroid: function(){ return navigator.userAgent.match(/Android.*AppleWebKit/i) !== null; },
  androidVersion: function() {
    var match = navigator.userAgent.match(/Android (\d+)\./i);
    if (match && match[1]) { return match[1]; }
  },

  testVid: document.createElement("video"),
  ua: navigator.userAgent,
  support: {},

  each: function(arr, fn){
    if (!arr || arr.length === 0) { return; }
    for (var i=0,j=arr.length; i<j; i++) {
      fn.call(this, arr[i], i);
    }
  },

  eachProp: function(obj, fn){
    if (!obj) { return; }
    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        fn.call(this, name, obj[name]);
      }
    }
  },

  el: function(id){ return document.getElementById(id); },
  createElement: function(tagName, attributes){
    var el = document.createElement(tagName),
        attrname;
    for (attrname in attributes){
      if (attributes.hasOwnProperty(attrname)) {
        if (attrname.indexOf("-") !== -1) {
          el.setAttribute(attrname, attributes[attrname]);
        } else {
          el[attrname] = attributes[attrname];
        }
      }
    }
    return el;
  },

  insertFirst: function(node, parent){
    if (parent.firstChild) {
      parent.insertBefore(node, parent.firstChild);
    } else {
      parent.appendChild(node);
    }
  },

  addClass: function(element, classToAdd){
    if ((" "+element.className+" ").indexOf(" "+classToAdd+" ") == -1) {
      element.className = element.className === "" ? classToAdd : element.className + " " + classToAdd;
    }
  },

  removeClass: function(element, classToRemove){
    if (element.className.indexOf(classToRemove) == -1) { return; }
    var classNames = element.className.split(" ");
    classNames.splice(classNames.indexOf(classToRemove),1);
    element.className = classNames.join(" ");
  },

  remove: function(item, array){
    if (!array) return;
    var i = array.indexOf(item);
    if (i != -1) {
      return array.splice(i, 1)
    };
  },

  // Attempt to block the ability to select text while dragging controls
  blockTextSelection: function(){
    document.body.focus();
    document.onselectstart = function () { return false; };
  },
  // Turn off text selection blocking
  unblockTextSelection: function(){ document.onselectstart = function () { return true; }; },

  // Return seconds as H:MM:SS or M:SS
  // Supplying a guide (in seconds) will include enough leading zeros to cover the length of the guide
  formatTime: function(seconds, guide) {
    guide = guide || seconds; // Default to using seconds as guide
    var s = Math.floor(seconds % 60),
        m = Math.floor(seconds / 60 % 60),
        h = Math.floor(seconds / 3600),
        gm = Math.floor(guide / 60 % 60),
        gh = Math.floor(guide / 3600);

    // Check if we need to show hours
    h = (h > 0 || gh > 0) ? h + ":" : "";

    // If hours are showing, we may need to add a leading zero.
    // Always show at least one digit of minutes.
    m = (((h || gm >= 10) && m < 10) ? "0" + m : m) + ":";

    // Check if leading zero is need for seconds
    s = (s < 10) ? "0" + s : s;

    return h + m + s;
  },

  uc: function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  // Return the relative horizonal position of an event as a value from 0-1
  getRelativePosition: function(x, relativeElement){
    return Math.max(0, Math.min(1, (x - _V_.findPosX(relativeElement)) / relativeElement.offsetWidth));
  },

  getComputedStyleValue: function(element, style){
    return window.getComputedStyle(element, null).getPropertyValue(style);
  },

  trim: function(string){ return string.toString().replace(/^\s+/, "").replace(/\s+$/, ""); },
  round: function(num, dec) {
    if (!dec) { dec = 0; }
    return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
  },

  isEmpty: function(object) {
    for (var prop in object) {
      return false;
    }
    return true;
  },

  // Mimic HTML5 TimeRange Spec.
  createTimeRange: function(start, end){
    return {
      length: 1,
      start: function() { return start; },
      end: function() { return end; }
    };
  },

  /* Element Data Store. Allows for binding data to an element without putting it directly on the element.
     Ex. Event listneres are stored here.
     (also from jsninja.com)
  ================================================================================ */
  cache: {}, // Where the data is stored
  guid: 1, // Unique ID for the element
  expando: "vdata" + (new Date).getTime(), // Unique attribute to store element's guid in

  // Returns the cache object where data for the element is stored
  getData: function(elem){
    var id = elem[_V_.expando];
    if (!id) {
      id = elem[_V_.expando] = _V_.guid++;
      _V_.cache[id] = {};
    }
    return _V_.cache[id];
  },
  // Delete data for the element from the cache and the guid attr from element
  removeData: function(elem){
    var id = elem[_V_.expando];
    if (!id) { return; }
    // Remove all stored data
    delete _V_.cache[id];
    // Remove the expando property from the DOM node
    try {
      delete elem[_V_.expando];
    } catch(e) {
      if (elem.removeAttribute) {
        elem.removeAttribute(_V_.expando);
      } else {
        // IE doesn't appear to support removeAttribute on the document element
        elem[_V_.expando] = null;
      }
    }
  },

  /* Proxy (a.k.a Bind or Context). A simple method for changing the context of a function
     It also stores a unique id on the function so it can be easily removed from events
  ================================================================================ */
  proxy: function(context, fn, uid) {
    // Make sure the function has a unique ID
    if (!fn.guid) { fn.guid = _V_.guid++; }

    // Create the new function that changes the context
    var ret = function() {
      return fn.apply(context, arguments);
    }

    // Allow for the ability to individualize this function
    // Needed in the case where multiple objects might share the same prototype
    // IF both items add an event listener with the same function, then you try to remove just one
    // it will remove both because they both have the same guid.
    // when using this, you need to use the proxy method when you remove the listener as well.
    ret.guid = (uid) ? uid + "_" + fn.guid : fn.guid;

    return ret;
  },

  get: function(url, onSuccess, onError){
    // if (netscape.security.PrivilegeManager.enablePrivilege) {
    //   netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
    // }

    var local = (url.indexOf("file:") == 0 || (window.location.href.indexOf("file:") == 0 && url.indexOf("http:") == -1));

    if (typeof XMLHttpRequest == "undefined") {
      XMLHttpRequest = function () {
        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (f) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (g) {}
        throw new Error("This browser does not support XMLHttpRequest.");
      };
    }

    var request = new XMLHttpRequest();

    try {
      request.open("GET", url);
    } catch(e) {
      _V_.log("VideoJS XMLHttpRequest (open)", e);
      // onError(e);
      return false;
    }

    request.onreadystatechange = _V_.proxy(this, function() {
      if (request.readyState == 4) {
        if (request.status == 200 || local && request.status == 0) {
          onSuccess(request.responseText);
        } else {
          if (onError) {
            onError();
          }
        }
      }
    });

    try {
      request.send();
    } catch(e) {
      _V_.log("VideoJS XMLHttpRequest (send)", e);
      if (onError) {
        onError(e);
      }
    }
  },

  /* Local Storage
  ================================================================================ */
  setLocalStorage: function(key, value){
    // IE was throwing errors referencing the var anywhere without this
    var localStorage = window.localStorage || false;
    if (!localStorage) { return; }
    try {
      localStorage[key] = value;
    } catch(e) {
      if (e.code == 22 || e.code == 1014) { // Webkit == 22 / Firefox == 1014
        _V_.log("LocalStorage Full (VideoJS)", e);
      } else {
        _V_.log("LocalStorage Error (VideoJS)", e);
      }
    }
  },

  // Get abosolute version of relative URL. Used to tell flash correct URL.
  // http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
  getAbsoluteURL: function(url){

    // Check if absolute URL
    if (!url.match(/^https?:\/\//)) {
      // Convert to absolute URL. Flash hosted off-site needs an absolute URL.
      url = _V_.createElement('div', {
        innerHTML: '<a href="'+url+'">x</a>'
      }).firstChild.href;
    }

    return url;
  }

});

// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
_V_.log = function(){
  _V_.log.history = _V_.log.history || [];// store logs to an array for reference
  _V_.log.history.push(arguments);
  if(window.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? _V_.log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());

// Offset Left
// getBoundingClientRect technique from John Resig http://ejohn.org/blog/getboundingclientrect-is-awesome/
if ("getBoundingClientRect" in document.documentElement) {
  _V_.findPosX = function(el) {
    var box;

    try {
      box = el.getBoundingClientRect();
    } catch(e) {}

    if (!box) { return 0; }

    var docEl = document.documentElement,
        body = document.body,
        clientLeft = docEl.clientLeft || body.clientLeft || 0,
        scrollLeft = window.pageXOffset || body.scrollLeft,
        left = box.left + scrollLeft - clientLeft;

    return left;
  };
} else {
  _V_.findPosX = function(el) {
    var curleft = el.offsetLeft;
    // _V_.log(obj.className, obj.offsetLeft)
    while(el = obj.offsetParent) {
      if (el.className.indexOf("video-js") == -1) {
        // _V_.log(el.offsetParent, "OFFSETLEFT", el.offsetLeft)
        // _V_.log("-webkit-full-screen", el.webkitMatchesSelector("-webkit-full-screen"));
        // _V_.log("-webkit-full-screen", el.querySelectorAll(".video-js:-webkit-full-screen"));
      } else {
      }
      curleft += el.offsetLeft;
    }
    return curleft;
  };
}// Using John Resig's Class implementation http://ejohn.org/blog/simple-javascript-inheritance/
// (function(){var initializing=false, fnTest=/xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/; _V_.Class = function(){}; _V_.Class.extend = function(prop) { var _super = this.prototype; initializing = true; var prototype = new this(); initializing = false; for (var name in prop) { prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn){ return function() { var tmp = this._super; this._super = _super[name]; var ret = fn.apply(this, arguments); this._super = tmp; return ret; }; })(name, prop[name]) : prop[name]; } function Class() { if ( !initializing && this.init ) this.init.apply(this, arguments); } Class.prototype = prototype; Class.constructor = Class; Class.extend = arguments.callee; return Class;};})();
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  _V_.Class = function(){};
  _V_.Class.extend = function(prop) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this();
    initializing = false;
    for (var name in prop) {
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            this._super = _super[name];
            var ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    function Class() {
      if ( !initializing && this.init ) {
        return this.init.apply(this, arguments);

      // Attempting to recreate accessing function form of class.
      } else if (!initializing) {
        return arguments.callee.prototype.init()
      }
    }
    Class.prototype = prototype;
    Class.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
  };
})();

/* Player Component- Base class for all UI objects
================================================================================ */
_V_.Component = _V_.Class.extend({

  init: function(player, options){
    this.player = player;

    // Allow for overridding default component options
    options = this.options = _V_.merge(this.options || {}, options);

    // Create element if one wasn't provided in options
    if (options.el) {
      this.el = options.el;
    } else {
      this.el = this.createElement();
    }

    // Add any components in options
    this.initComponents();
  },

  destroy: function(){},

  createElement: function(type, attrs){
    return _V_.createElement(type || "div", attrs);
  },

  buildCSSClass: function(){
    // Child classes can include a function that does:
    // return "CLASS NAME" + this._super();
    return "";
  },

  initComponents: function(){
    var options = this.options;
    if (options && options.components) {
      // Loop through components and add them to the player
      this.eachProp(options.components, function(name, opts){

        // Allow waiting to add components until a specific event is called
        var tempAdd = this.proxy(function(){
          // Set property name on player. Could cause conflicts with other prop names, but it's worth making refs easy.
          this[name] = this.addComponent(name, opts);
        });

        if (opts.loadEvent) {
          this.one(opts.loadEvent, tempAdd)
        } else {
          tempAdd();
        }
      });
    }
  },

  // Add child components to this component.
  // Will generate a new child component and then append child component's element to this component's element.
  // Takes either the name of the UI component class, or an object that contains a name, UI Class, and options.
  addComponent: function(name, options){
    var component, componentClass;

    // If string, create new component with options
    if (typeof name == "string") {

      // Make sure options is at least an empty object to protect against errors
      options = options || {};

      // Assume name of set is a lowercased name of the UI Class (PlayButton, etc.)
      componentClass = options.componentClass || _V_.uc(name);

      // Create a new object & element for this controls set
      // If there's no .player, this is a player
      component = new _V_[componentClass](this.player || this, options);

    } else {
      component = name;
    }

    // Add the UI object's element to the container div (box)
    this.el.appendChild(component.el);

    // Return so it can stored on parent object if desired.
    return component;
  },

  removeComponent: function(component){
    this.el.removeChild(component.el);
  },

  /* Display
  ================================================================================ */
  show: function(){
    this.el.style.display = "block";
  },

  hide: function(){
    this.el.style.display = "none";
  },

  fadeIn: function(){
    this.removeClass("vjs-fade-out");
    this.addClass("vjs-fade-in");
  },

  fadeOut: function(){
    this.removeClass("vjs-fade-in");
    this.addClass("vjs-fade-out");
  },

  lockShowing: function(){
    var style = this.el.style;
    style.display = "block";
    style.opacity = 1;
    style.visiblity = "visible";
  },

  unlockShowing: function(){
    var style = this.el.style;
    style.display = "";
    style.opacity = "";
    style.visiblity = "";
  },

  addClass: function(classToAdd){
    _V_.addClass(this.el, classToAdd);
  },

  removeClass: function(classToRemove){
    _V_.removeClass(this.el, classToRemove);
  },

  /* Events
  ================================================================================ */
  addEvent: function(type, fn, uid){
    return _V_.addEvent(this.el, type, _V_.proxy(this, fn));
  },
  removeEvent: function(type, fn){
    return _V_.removeEvent(this.el, type, fn);
  },
  triggerEvent: function(type, e){
    return _V_.triggerEvent(this.el, type, e);
  },
  one: function(type, fn) {
    _V_.one(this.el, type, _V_.proxy(this, fn));
  },

  /* Ready - Trigger functions when component is ready
  ================================================================================ */
  ready: function(fn){
    if (!fn) return this;

    if (this.isReady) {
      fn.call(this);
    } else {
      if (this.readyQueue === undefined) {
        this.readyQueue = [];
      }
      this.readyQueue.push(fn);
    }

    return this;
  },

  triggerReady: function(){
    this.isReady = true;
    if (this.readyQueue && this.readyQueue.length > 0) {
      // Call all functions in ready queue
      this.each(this.readyQueue, function(fn){
        fn.call(this);
      });

      // Reset Ready Queue
      this.readyQueue = [];

      // Allow for using event listeners also, in case you want to do something everytime a source is ready.
      this.triggerEvent("ready");
    }
  },

  /* Utility
  ================================================================================ */
  each: function(arr, fn){ _V_.each.call(this, arr, fn); },

  eachProp: function(obj, fn){ _V_.eachProp.call(this, obj, fn); },

  extend: function(obj){ _V_.merge(this, obj) },

  // More easily attach 'this' to functions
  proxy: function(fn, uid){  return _V_.proxy(this, fn, uid); }

});/* Control - Base class for all control elements
================================================================================ */
_V_.Control = _V_.Component.extend({

  buildCSSClass: function(){
    return "vjs-control " + this._super();
  }

});

/* Control Bar
================================================================================ */
_V_.ControlBar = _V_.Component.extend({

  options: {
    loadEvent: "play",
    components: {
      "playToggle": {},
      "fullscreenToggle": {},
      "currentTimeDisplay": {},
      "timeDivider": {},
      "durationDisplay": {},
      "remainingTimeDisplay": {},
      "progressControl": {},
      "volumeControl": {},
      "muteToggle": {}
    }
  },

  init: function(player, options){
    this._super(player, options);

    player.addEvent("play", this.proxy(function(){
      this.fadeIn();
      this.player.addEvent("mouseover", this.proxy(this.fadeIn));
      this.player.addEvent("mouseout", this.proxy(this.fadeOut));
    }));

  },

  createElement: function(){
    return _V_.createElement("div", {
      className: "vjs-controls"
    });
  },

  fadeIn: function(){
    this._super();
    this.player.triggerEvent("controlsvisible");
  },

  fadeOut: function(){
    this._super();
    this.player.triggerEvent("controlshidden");
  },

  lockShowing: function(){
    this.el.style.opacity = "1";
  }

});

/* Button - Base class for all buttons
================================================================================ */
_V_.Button = _V_.Control.extend({

  init: function(player, options){
    this._super(player, options);

    this.addEvent("click", this.onClick);
    this.addEvent("focus", this.onFocus);
    this.addEvent("blur", this.onBlur);
  },

  createElement: function(type, attrs){
    // Add standard Aria and Tabindex info
    attrs = _V_.merge({
      className: this.buildCSSClass(),
      innerHTML: '<div><span class="vjs-control-text">' + (this.buttonText || "Need Text") + '</span></div>',
      role: "button",
      tabIndex: 0
    }, attrs);

    return this._super(type, attrs);
  },

  // Click - Override with specific functionality for button
  onClick: function(){},

  // Focus - Add keyboard functionality to element
  onFocus: function(){
    _V_.addEvent(document, "keyup", _V_.proxy(this, this.onKeyPress));
  },

  // KeyPress (document level) - Trigger click when keys are pressed
  onKeyPress: function(event){
    // Check for space bar (32) or enter (13) keys
    if (event.which == 32 || event.which == 13) {
      event.preventDefault();
      this.onClick();
    }
  },

  // Blur - Remove keyboard triggers
  onBlur: function(){
    _V_.removeEvent(document, "keyup", _V_.proxy(this, this.onKeyPress));
  }

});

/* Play Button
================================================================================ */
_V_.PlayButton = _V_.Button.extend({

  buttonText: "Play",

  buildCSSClass: function(){
    return "vjs-play-button " + this._super();
  },

  onClick: function(){
    this.player.play();
  }

});

/* Pause Button
================================================================================ */
_V_.PauseButton = _V_.Button.extend({

  buttonText: "Pause",

  buildCSSClass: function(){
    return "vjs-pause-button " + this._super();
  },

  onClick: function(){
    this.player.pause();
  }

});

/* Play Toggle - Play or Pause Media
================================================================================ */
_V_.PlayToggle = _V_.Button.extend({

  buttonText: "Play",

  init: function(player, options){
    this._super(player, options);

    player.addEvent("play", _V_.proxy(this, this.onPlay));
    player.addEvent("pause", _V_.proxy(this, this.onPause));
  },

  buildCSSClass: function(){
    return "vjs-play-control " + this._super();
  },

  // OnClick - Toggle between play and pause
  onClick: function(){
    if (this.player.paused()) {
      this.player.play();
    } else {
      this.player.pause();
    }
  },

  // OnPlay - Add the vjs-playing class to the element so it can change appearance
  onPlay: function(){
    _V_.removeClass(this.el, "vjs-paused");
    _V_.addClass(this.el, "vjs-playing");
  },

  // OnPause - Add the vjs-paused class to the element so it can change appearance
  onPause: function(){
    _V_.removeClass(this.el, "vjs-playing");
    _V_.addClass(this.el, "vjs-paused");
  }

});


/* Fullscreen Toggle Behaviors
================================================================================ */
_V_.FullscreenToggle = _V_.Button.extend({

  buttonText: "Fullscreen",

  buildCSSClass: function(){
    return "vjs-fullscreen-control " + this._super();
  },

  onClick: function(){
    if (!this.player.isFullScreen) {
      this.player.requestFullScreen();
    } else {
      this.player.cancelFullScreen();
    }
  }

});

/* Big Play Button
================================================================================ */
_V_.BigPlayButton = _V_.Button.extend({
  init: function(player, options){
    this._super(player, options);

    player.addEvent("play", _V_.proxy(this, this.hide));
    player.addEvent("ended", _V_.proxy(this, this.show));
  },

  createElement: function(){
    return this._super("div", {
      className: "vjs-big-play-button",
      innerHTML: "<span></span>"
    });
  },

  onClick: function(){
    // Go back to the beginning if big play button is showing at the end.
    // Have to check for current time otherwise it might throw a 'not ready' error.
    if(this.player.currentTime()) {
      this.player.currentTime(0);
    }
    this.player.play();
  }
});

/* Loading Spinner
================================================================================ */
_V_.LoadingSpinner = _V_.Component.extend({
  init: function(player, options){
    this._super(player, options);

    player.addEvent("canplay", _V_.proxy(this, this.hide));
    player.addEvent("canplaythrough", _V_.proxy(this, this.hide));
    player.addEvent("playing", _V_.proxy(this, this.hide));

    player.addEvent("seeking", _V_.proxy(this, this.show));
    player.addEvent("error", _V_.proxy(this, this.show));

    // Not showing spinner on stalled any more. Browsers may stall and then not trigger any events that would remove the spinner.
    // Checked in Chrome 16 and Safari 5.1.2. http://help.videojs.com/discussions/problems/883-why-is-the-download-progress-showing
    // player.addEvent("stalled", _V_.proxy(this, this.show));

    player.addEvent("waiting", _V_.proxy(this, this.show));
  },

  createElement: function(){

    var classNameSpinner, innerHtmlSpinner;

    if ( typeof this.player.el.style.WebkitBorderRadius == "string"
         || typeof this.player.el.style.MozBorderRadius == "string"
         || typeof this.player.el.style.KhtmlBorderRadius == "string"
         || typeof this.player.el.style.borderRadius == "string")
      {
        classNameSpinner = "vjs-loading-spinner";
        innerHtmlSpinner = "<div class='ball1'></div><div class='ball2'></div><div class='ball3'></div><div class='ball4'></div><div class='ball5'></div><div class='ball6'></div><div class='ball7'></div><div class='ball8'></div>";
      } else {
        classNameSpinner = "vjs-loading-spinner-fallback";
        innerHtmlSpinner = "";
      }

    return this._super("div", {
      className: classNameSpinner,
      innerHTML: innerHtmlSpinner
    });
  }
});

/* Time
================================================================================ */
_V_.CurrentTimeDisplay = _V_.Component.extend({

  init: function(player, options){
    this._super(player, options);

    player.addEvent("timeupdate", _V_.proxy(this, this.updateContent));
  },

  createElement: function(){
    var el = this._super("div", {
      className: "vjs-current-time vjs-time-controls vjs-control"
    });

    this.content = _V_.createElement("div", {
      className: "vjs-current-time-display",
      innerHTML: '0:00'
    });

    el.appendChild(_V_.createElement("div").appendChild(this.content));
    return el;
  },

  updateContent: function(){
    // Allows for smooth scrubbing, when player can't keep up.
    var time = (this.player.scrubbing) ? this.player.values.currentTime : this.player.currentTime();
    this.content.innerHTML = _V_.formatTime(time, this.player.duration());
  }

});

_V_.DurationDisplay = _V_.Component.extend({

  init: function(player, options){
    this._super(player, options);

    player.addEvent("timeupdate", _V_.proxy(this, this.updateContent));
  },

  createElement: function(){
    var el = this._super("div", {
      className: "vjs-duration vjs-time-controls vjs-control"
    });

    this.content = _V_.createElement("div", {
      className: "vjs-duration-display",
      innerHTML: '0:00'
    });

    el.appendChild(_V_.createElement("div").appendChild(this.content));
    return el;
  },

  updateContent: function(){
    if (this.player.duration()) { this.content.innerHTML = _V_.formatTime(this.player.duration()); }
  }

});

// Time Separator (Not used in main skin, but still available, and could be used as a 'spare element')
_V_.TimeDivider = _V_.Component.extend({

  createElement: function(){
    return this._super("div", {
      className: "vjs-time-divider",
      innerHTML: '<div><span>/</span></div>'
    });
  }

});

_V_.RemainingTimeDisplay = _V_.Component.extend({

  init: function(player, options){
    this._super(player, options);

    player.addEvent("timeupdate", _V_.proxy(this, this.updateContent));
  },

  createElement: function(){
    var el = this._super("div", {
      className: "vjs-remaining-time vjs-time-controls vjs-control"
    });

    this.content = _V_.createElement("div", {
      className: "vjs-remaining-time-display",
      innerHTML: '-0:00'
    });

    el.appendChild(_V_.createElement("div").appendChild(this.content));
    return el;
  },

  updateContent: function(){
    if (this.player.duration()) { this.content.innerHTML = "-"+_V_.formatTime(this.player.remainingTime()); }

    // Allows for smooth scrubbing, when player can't keep up.
    // var time = (this.player.scrubbing) ? this.player.values.currentTime : this.player.currentTime();
    // this.content.innerHTML = _V_.formatTime(time, this.player.duration());
  }

});

/* Slider - Parent for seek bar and volume slider
================================================================================ */
_V_.Slider = _V_.Component.extend({

  init: function(player, options){
    this._super(player, options);

    player.addEvent(this.playerEvent, _V_.proxy(this, this.update));

    this.addEvent("mousedown", this.onMouseDown);
    this.addEvent("focus", this.onFocus);
    this.addEvent("blur", this.onBlur);

    this.player.addEvent("controlsvisible", this.proxy(this.update));

    // This is actually to fix the volume handle position. http://twitter.com/#!/gerritvanaaken/status/159046254519787520
    // this.player.one("timeupdate", this.proxy(this.update));

    this.update();
  },

  createElement: function(type, attrs) {
    attrs = _V_.merge({
      role: "slider",
      "aria-valuenow": 0,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      tabIndex: 0
    }, attrs);

    return this._super(type, attrs);
  },

  onMouseDown: function(event){
    event.preventDefault();
    _V_.blockTextSelection();

    _V_.addEvent(document, "mousemove", _V_.proxy(this, this.onMouseMove));
    _V_.addEvent(document, "mouseup", _V_.proxy(this, this.onMouseUp));

    this.onMouseMove(event);
  },

  onMouseUp: function(event) {
    _V_.unblockTextSelection();
    _V_.removeEvent(document, "mousemove", this.onMouseMove, false);
    _V_.removeEvent(document, "mouseup", this.onMouseUp, false);

    this.update();
  },

  update: function(){
    // If scrubbing, we could use a cached value to make the handle keep up with the user's mouse.
    // On HTML5 browsers scrubbing is really smooth, but some flash players are slow, so we might want to utilize this later.
    // var progress =  (this.player.scrubbing) ? this.player.values.currentTime / this.player.duration() : this.player.currentTime() / this.player.duration();

    var barProgress,
        progress = this.getPercent();
        handle = this.handle,
        bar = this.bar;

    // Protect against no duration and other division issues
    if (isNaN(progress)) { progress = 0; }

    barProgress = progress;

    // If there is a handle, we need to account for the handle in our calculation for progress bar
    // so that it doesn't fall short of or extend past the handle.
    if (handle) {

      var box = this.el,
          boxWidth = box.offsetWidth,

          handleWidth = handle.el.offsetWidth,

          // The width of the handle in percent of the containing box
          // In IE, widths may not be ready yet causing NaN
          handlePercent = (handleWidth) ? handleWidth / boxWidth : 0,

          // Get the adjusted size of the box, considering that the handle's center never touches the left or right side.
          // There is a margin of half the handle's width on both sides.
          boxAdjustedPercent = 1 - handlePercent;

          // Adjust the progress that we'll use to set widths to the new adjusted box width
          adjustedProgress = progress * boxAdjustedPercent,

          // The bar does reach the left side, so we need to account for this in the bar's width
          barProgress = adjustedProgress + (handlePercent / 2);

      // Move the handle from the left based on the adjected progress
      handle.el.style.left = _V_.round(adjustedProgress * 100, 2) + "%";
    }

    // Set the new bar width
    bar.el.style.width = _V_.round(barProgress * 100, 2) + "%";
  },

  calculateDistance: function(event){
    var box = this.el,
        boxX = _V_.findPosX(box),
        boxW = box.offsetWidth,
        handle = this.handle;

    if (handle) {
      var handleW = handle.el.offsetWidth;

      // Adjusted X and Width, so handle doesn't go outside the bar
      boxX = boxX + (handleW / 2);
      boxW = boxW - handleW;
    }

    // Percent that the click is through the adjusted area
    return Math.max(0, Math.min(1, (event.pageX - boxX) / boxW));
  },

  onFocus: function(event){
    _V_.addEvent(document, "keyup", _V_.proxy(this, this.onKeyPress));
  },

  onKeyPress: function(event){
    if (event.which == 37) { // Left Arrow
      event.preventDefault();
      this.stepBack();
    } else if (event.which == 39) { // Right Arrow
      event.preventDefault();
      this.stepForward();
    }
  },

  onBlur: function(event){
    _V_.removeEvent(document, "keyup", _V_.proxy(this, this.onKeyPress));
  }
});


/* Progress
================================================================================ */

// Progress Control: Seek, Load Progress, and Play Progress
_V_.ProgressControl = _V_.Component.extend({

  options: {
    components: {
      "seekBar": {}
    }
  },

  createElement: function(){
    return this._super("div", {
      className: "vjs-progress-control vjs-control"
    });
  }

});

// Seek Bar and holder for the progress bars
_V_.SeekBar = _V_.Slider.extend({

  options: {
    components: {
      "loadProgressBar": {},

      // Set property names to bar and handle to match with the parent Slider class is looking for
      "bar": { componentClass: "PlayProgressBar" },
      "handle": { componentClass: "SeekHandle" }
    }
  },

  playerEvent: "timeupdate",

  init: function(player, options){
    this._super(player, options);
  },

  createElement: function(){
    return this._super("div", {
      className: "vjs-progress-holder"
    });
  },

  getPercent: function(){
    return this.player.currentTime() / this.player.duration();
  },

  onMouseDown: function(event){
    this._super(event);

    this.player.scrubbing = true;

    this.videoWasPlaying = !this.player.paused();
    this.player.pause();
  },

  onMouseMove: function(event){
    var newTime = this.calculateDistance(event) * this.player.duration();

    // Don't let video end while scrubbing.
    if (newTime == this.player.duration()) { newTime = newTime - 0.1; }

    // Set new time (tell player to seek to new time)
    this.player.currentTime(newTime);
  },

  onMouseUp: function(event){
    this._super(event);

    this.player.scrubbing = false;
    if (this.videoWasPlaying) {
      this.player.play();
    }
  },

  stepForward: function(){
    this.player.currentTime(this.player.currentTime() + 1);
  },

  stepBack: function(){
    this.player.currentTime(this.player.currentTime() - 1);
  }

});

// Load Progress Bar
_V_.LoadProgressBar = _V_.Component.extend({

  init: function(player, options){
    this._super(player, options);
    player.addEvent("progress", _V_.proxy(this, this.update));
  },

  createElement: function(){
    return this._super("div", {
      className: "vjs-load-progress",
      innerHTML: '<span class="vjs-control-text">Loaded: 0%</span>'
    });
  },

  update: function(){
    if (this.el.style) { this.el.style.width = _V_.round(this.player.bufferedPercent() * 100, 2) + "%"; }
  }

});

// Play Progress Bar
_V_.PlayProgressBar = _V_.Component.extend({

  createElement: function(){
    return this._super("div", {
      className: "vjs-play-progress",
      innerHTML: '<span class="vjs-control-text">Progress: 0%</span>'
    });
  }

});

// Seek Handle
// SeekBar Behavior includes play progress bar, and seek handle
// Needed so it can determine seek position based on handle position/size
_V_.SeekHandle = _V_.Component.extend({

  createElement: function(){
    return this._super("div", {
      className: "vjs-seek-handle",
      innerHTML: '<span class="vjs-control-text">00:00</span>'
    });
  }

});

/* Volume Scrubber
================================================================================ */
// Progress Control: Seek, Load Progress, and Play Progress
_V_.VolumeControl = _V_.Component.extend({

  options: {
    components: {
      "volumeBar": {}
    }
  },

  createElement: function(){
    return this._super("div", {
      className: "vjs-volume-control vjs-control"
    });
  }

});

_V_.VolumeBar = _V_.Slider.extend({

  options: {
    components: {
      "bar": { componentClass: "VolumeLevel" },
      "handle": { componentClass: "VolumeHandle" }
    }
  },

  playerEvent: "volumechange",

  createElement: function(){
    return this._super("div", {
      className: "vjs-volume-bar"
    });
  },

  onMouseMove: function(event) {
    this.player.volume(this.calculateDistance(event));
  },

  getPercent: function(){
   return this.player.volume();
  },

  stepForward: function(){
    this.player.volume(this.player.volume() + 0.1);
  },

  stepBack: function(){
    this.player.volume(this.player.volume() - 0.1);
  }
});

_V_.VolumeLevel = _V_.Component.extend({

  createElement: function(){
    return this._super("div", {
      className: "vjs-volume-level",
      innerHTML: '<span class="vjs-control-text"></span>'
    });
  }

});

_V_.VolumeHandle = _V_.Component.extend({

  createElement: function(){
    return this._super("div", {
      className: "vjs-volume-handle",
      innerHTML: '<span class="vjs-control-text"></span>'
      // tabindex: 0,
      // role: "slider", "aria-valuenow": 0, "aria-valuemin": 0, "aria-valuemax": 100
    });
  }

});

_V_.MuteToggle = _V_.Button.extend({

  init: function(player, options){
    this._super(player, options);

    player.addEvent("volumechange", _V_.proxy(this, this.update));
  },

  createElement: function(){
    return this._super("div", {
      className: "vjs-mute-control vjs-control",
      innerHTML: '<div><span class="vjs-control-text">Mute</span></div>'
    });
  },

  onClick: function(event){
    this.player.muted( this.player.muted() ? false : true );
  },

  update: function(event){
    var vol = this.player.volume(),
        level = 3;

    if (vol == 0 || this.player.muted()) {
      level = 0;
    } else if (vol < 0.33) {
      level = 1;
    } else if (vol < 0.67) {
      level = 2;
    }

    /* TODO improve muted icon classes */
    _V_.each.call(this, [0,1,2,3], function(i){
      _V_.removeClass(this.el, "vjs-vol-"+i);
    });
    _V_.addClass(this.el, "vjs-vol-"+level);
  }

});


/* Poster Image
================================================================================ */
_V_.PosterImage = _V_.Button.extend({
  init: function(player, options){
    this._super(player, options);

    if (!this.player.options.poster) {
      this.hide();
    }

    player.addEvent("play", _V_.proxy(this, this.hide));
  },

  createElement: function(){
    return _V_.createElement("img", {
      className: "vjs-poster",
      src: this.player.options.poster,

      // Don't want poster to be tabbable.
      tabIndex: -1
    });
  },

  onClick: function(){
    this.player.play();
  }
});

/* Menu
================================================================================ */
// The base for text track and settings menu buttons.
_V_.Menu = _V_.Component.extend({

  init: function(player, options){
    this._super(player, options);
  },

  addItem: function(component){
    this.addComponent(component);
    component.addEvent("click", this.proxy(function(){
      this.unlockShowing();
    }));
  },

  createElement: function(){
    return this._super("ul", {
      className: "vjs-menu"
    });
  }

});

_V_.MenuItem = _V_.Button.extend({

  init: function(player, options){
    this._super(player, options);

    if (options.selected) {
      this.addClass("vjs-selected");
    }
  },

  createElement: function(type, attrs){
    return this._super("li", _V_.merge({
      className: "vjs-menu-item",
      innerHTML: this.options.label
    }, attrs));
  },

  onClick: function(){
    this.selected(true);
  },

  selected: function(selected){
    if (selected) {
      this.addClass("vjs-selected");
    } else {
      this.removeClass("vjs-selected")
    }
  }

});// ECMA-262 is the standard for javascript.
// The following methods are impelemented EXACTLY as described in the standard (according to Mozilla Docs), and do not override the default method if one exists.
// This may conflict with other libraries that modify the array prototype, but those libs should update to use the standard.

// [].indexOf
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this === void 0 || this === null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}

// NOT NEEDED YET
// [].lastIndexOf
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
// if (!Array.prototype.lastIndexOf)
// {
//   Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/)
//   {
//     "use strict";
//
//     if (this === void 0 || this === null)
//       throw new TypeError();
//
//     var t = Object(this);
//     var len = t.length >>> 0;
//     if (len === 0)
//       return -1;
//
//     var n = len;
//     if (arguments.length > 1)
//     {
//       n = Number(arguments[1]);
//       if (n !== n)
//         n = 0;
//       else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
//         n = (n > 0 || -1) * Math.floor(Math.abs(n));
//     }
//
//     var k = n >= 0
//           ? Math.min(n, len - 1)
//           : len - Math.abs(n);
//
//     for (; k >= 0; k--)
//     {
//       if (k in t && t[k] === searchElement)
//         return k;
//     }
//     return -1;
//   };
// }


// NOT NEEDED YET
// Array forEach per ECMA standard https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/foreach
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
// if ( !Array.prototype.forEach ) {
//
//   Array.prototype.forEach = function( callback, thisArg ) {
//
//     var T, k;
//
//     if ( this == null ) {
//       throw new TypeError( " this is null or not defined" );
//     }
//
//     // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
//     var O = Object(this);
//
//     // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
//     // 3. Let len be ToUint32(lenValue).
//     var len = O.length >>> 0;
//
//     // 4. If IsCallable(callback) is false, throw a TypeError exception.
//     // See: http://es5.github.com/#x9.11
//     if ( {}.toString.call(callback) != "[object Function]" ) {
//       throw new TypeError( callback + " is not a function" );
//     }
//
//     // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
//     if ( thisArg ) {
//       T = thisArg;
//     }
//
//     // 6. Let k be 0
//     k = 0;
//
//     // 7. Repeat, while k < len
//     while( k < len ) {
//
//       var kValue;
//
//       // a. Let Pk be ToString(k).
//       //   This is implicit for LHS operands of the in operator
//       // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
//       //   This step can be combined with c
//       // c. If kPresent is true, then
//       if ( k in O ) {
//
//         // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
//         kValue = O[ Pk ];
//
//         // ii. Call the Call internal method of callback with T as the this value and
//         // argument list containing kValue, k, and O.
//         callback.call( T, kValue, k, O );
//       }
//       // d. Increase k by 1.
//       k++;
//     }
//     // 8. return undefined
//   };
// }


// NOT NEEDED YET
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
// if (!Array.prototype.map) {
//   Array.prototype.map = function(callback, thisArg) {
//
//     var T, A, k;
//
//     if (this == null) {
//       throw new TypeError(" this is null or not defined");
//     }
//
//     // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
//     var O = Object(this);
//
//     // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
//     // 3. Let len be ToUint32(lenValue).
//     var len = O.length >>> 0;
//
//     // 4. If IsCallable(callback) is false, throw a TypeError exception.
//     // See: http://es5.github.com/#x9.11
//     if ({}.toString.call(callback) != "[object Function]") {
//       throw new TypeError(callback + " is not a function");
//     }
//
//     // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
//     if (thisArg) {
//       T = thisArg;
//     }
//
//     // 6. Let A be a new array created as if by the expression new Array(len) where Array is
//     // the standard built-in constructor with that name and len is the value of len.
//     A = new Array(len);
//
//     // 7. Let k be 0
//     k = 0;
//
//     // 8. Repeat, while k < len
//     while(k < len) {
//
//       var kValue, mappedValue;
//
//       // a. Let Pk be ToString(k).
//       //   This is implicit for LHS operands of the in operator
//       // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
//       //   This step can be combined with c
//       // c. If kPresent is true, then
//       if (k in O) {
//
//         // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
//         kValue = O[ k ];
//
//         // ii. Let mappedValue be the result of calling the Call internal method of callback
//         // with T as the this value and argument list containing kValue, k, and O.
//         mappedValue = callback.call(T, kValue, k, O);
//
//         // iii. Call the DefineOwnProperty internal method of A with arguments
//         // Pk, Property Descriptor {Value: mappedValue, Writable: true, Enumerable: true, Configurable: true},
//         // and false.
//
//         // In browsers that support Object.defineProperty, use the following:
//         // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });
//
//         // For best browser support, use the following:
//         A[ k ] = mappedValue;
//       }
//       // d. Increase k by 1.
//       k++;
//     }
//
//     // 9. return A
//     return A;
//   };
// }
// Event System (J.Resig - Secrets of a JS Ninja http://jsninja.com/ [Go read it, really])
// (Book version isn't completely usable, so fixed some things and borrowed from jQuery where it's working)
//
// This should work very similarly to jQuery's events, however it's based off the book version which isn't as
// robust as jquery's, so there's probably some differences.
//
// When you add an event listener using _V_.addEvent,
//   it stores the handler function in seperate cache object,
//   and adds a generic handler to the element's event,
//   along with a unique id (guid) to the element.

_V_.extend({

  // Add an event listener to element
  // It stores the handler function in a separate cache object
  // and adds a generic handler to the element's event,
  // along with a unique id (guid) to the element.
  addEvent: function(elem, type, fn){
    var data = _V_.getData(elem), handlers;

    // We only need to generate one handler per element
    if (data && !data.handler) {
      // Our new meta-handler that fixes the event object and the context
      data.handler = function(event){
        event = _V_.fixEvent(event);
        var handlers = _V_.getData(elem).events[event.type];
        // Go through and call all the real bound handlers
        if (handlers) {

          // Copy handlers so if handlers are added/removed during the process it doesn't throw everything off.
          var handlersCopy = [];
          _V_.each(handlers, function(handler, i){
            handlersCopy[i] = handler;
          })

          for (var i = 0, l = handlersCopy.length; i < l; i++) {
            handlersCopy[i].call(elem, event);
          }
        }
      };
    }

    // We need a place to store all our event data
    if (!data.events) { data.events = {}; }

    // And a place to store the handlers for this event type
    handlers = data.events[type];

    if (!handlers) {
      handlers = data.events[ type ] = [];

      // Attach our meta-handler to the element, since one doesn't exist
      if (document.addEventListener) {
        elem.addEventListener(type, data.handler, false);
      } else if (document.attachEvent) {
        elem.attachEvent("on" + type, data.handler);
      }
    }

    if (!fn.guid) { fn.guid = _V_.guid++; }

    handlers.push(fn);
  },

  removeEvent: function(elem, type, fn) {
    var data = _V_.getData(elem), handlers;
    // If no events exist, nothing to unbind
    if (!data.events) { return; }

    // Are we removing all bound events?
    if (!type) {
      for (type in data.events) {
        _V_.cleanUpEvents(elem, type);
      }
      return;
    }

    // And a place to store the handlers for this event type
    handlers = data.events[type];

    // If no handlers exist, nothing to unbind
    if (!handlers) { return; }

    // See if we're only removing a single handler
    if (fn && fn.guid) {
      for (var i = 0; i < handlers.length; i++) {
        // We found a match (don't stop here, there could be a couple bound)
        if (handlers[i].guid === fn.guid) {
          // Remove the handler from the array of handlers
          handlers.splice(i--, 1);
        }
      }
    }

    _V_.cleanUpEvents(elem, type);
  },

  cleanUpEvents: function(elem, type) {
    var data = _V_.getData(elem);
    // Remove the events of a particular type if there are none left

    if (data.events[type].length === 0) {
      delete data.events[type];

      // Remove the meta-handler from the element
      if (document.removeEventListener) {
        elem.removeEventListener(type, data.handler, false);
      } else if (document.detachEvent) {
        elem.detachEvent("on" + type, data.handler);
      }
    }

    // Remove the events object if there are no types left
    if (_V_.isEmpty(data.events)) {
      delete data.events;
      delete data.handler;
    }

    // Finally remove the expando if there is no data left
    if (_V_.isEmpty(data)) {
      _V_.removeData(elem);
    }
  },

  fixEvent: function(event) {
    if (event[_V_.expando]) { return event; }
    // store a copy of the original event object
    // and "clone" to set read-only properties
    var originalEvent = event;
    event = new _V_.Event(originalEvent);

    for ( var i = _V_.Event.props.length, prop; i; ) {
      prop = _V_.Event.props[ --i ];
      event[prop] = originalEvent[prop];
    }

    // Fix target property, if necessary
    if (!event.target) { event.target = event.srcElement || document; }

    // check if target is a textnode (safari)
    if (event.target.nodeType === 3) { event.target = event.target.parentNode; }

    // Add relatedTarget, if necessary
    if (!event.relatedTarget && event.fromElement) {
      event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
    }

    // Calculate pageX/Y if missing and clientX/Y available
    if ( event.pageX == null && event.clientX != null ) {
      var eventDocument = event.target.ownerDocument || document,
        doc = eventDocument.documentElement,
        body = eventDocument.body;

      event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
    }

    // Add which for key events
    if (event.which == null && (event.charCode != null || event.keyCode != null)) {
      event.which = event.charCode != null ? event.charCode : event.keyCode;
    }

    // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
    if ( !event.metaKey && event.ctrlKey ) {
      event.metaKey = event.ctrlKey;
    }

    // Add which for click: 1 === left; 2 === middle; 3 === right
    // Note: button is not normalized, so don't use it
    if ( !event.which && event.button !== undefined ) {
      event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
    }

    return event;
  },

  triggerEvent: function(elem, event) {
    var data = _V_.getData(elem),
        parent = elem.parentNode || elem.ownerDocument,
        type = event.type || event,
        handler;

    if (data) { handler = data.handler }

    // Added in attion to book. Book code was broke.
    event = typeof event === "object" ?
      event[_V_.expando] ?
        event :
        new _V_.Event(type, event) :
      new _V_.Event(type);

    event.type = type;
    if (handler) {
      handler.call(elem, event);
    }

    // Clean up the event in case it is being reused
    event.result = undefined;
    event.target = elem;

    // Bubble the event up the tree to the document,
    // Unless it's been explicitly stopped
    // if (parent && !event.isPropagationStopped()) {
    //   _V_.triggerEvent(parent, event);
    //
    // // We're at the top document so trigger the default action
    // } else if (!parent && !event.isDefaultPrevented()) {
    //   // log(type);
    //   var targetData = _V_.getData(event.target);
    //   // log(targetData);
    //   var targetHandler = targetData.handler;
    //   // log("2");
    //   if (event.target[event.type]) {
    //     // Temporarily disable the bound handler,
    //     // don't want to execute it twice
    //     if (targetHandler) {
    //       targetData.handler = function(){};
    //     }
    //
    //     // Trigger the native event (click, focus, blur)
    //     event.target[event.type]();
    //
    //     // Restore the handler
    //     if (targetHandler) {
    //       targetData.handler = targetHandler;
    //     }
    //   }
    // }
  },

  one: function(elem, type, fn) {
    _V_.addEvent(elem, type, function(){
      _V_.removeEvent(elem, type, arguments.callee)
      fn.apply(this, arguments);
    });
  }
});

// Custom Event object for standardizing event objects between browsers.
_V_.Event = function(src, props){
  // Event object
  if (src && src.type) {
    this.originalEvent = src;
    this.type = src.type;

    // Events bubbling up the document may have been marked as prevented
    // by a handler lower down the tree; reflect the correct value.
    this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
      src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

  // Event type
  } else {
    this.type = src;
  }

  // Put explicitly provided properties onto the event object
  if (props) { _V_.merge(this, props); }

  this.timeStamp = (new Date).getTime();

  // Mark it as fixed
  this[_V_.expando] = true;
};

_V_.Event.prototype = {
  preventDefault: function() {
    this.isDefaultPrevented = returnTrue;

    var e = this.originalEvent;
    if (!e) { return; }

    // if preventDefault exists run it on the original event
    if (e.preventDefault) {
      e.preventDefault();
    // otherwise set the returnValue property of the original event to false (IE)
    } else {
      e.returnValue = false;
    }
  },
  stopPropagation: function() {
    this.isPropagationStopped = returnTrue;

    var e = this.originalEvent;
    if (!e) { return; }
    // if stopPropagation exists run it on the original event
    if (e.stopPropagation) { e.stopPropagation(); }
    // otherwise set the cancelBubble property of the original event to true (IE)
    e.cancelBubble = true;
  },
  stopImmediatePropagation: function() {
    this.isImmediatePropagationStopped = returnTrue;
    this.stopPropagation();
  },
  isDefaultPrevented: returnFalse,
  isPropagationStopped: returnFalse,
  isImmediatePropagationStopped: returnFalse
};
_V_.Event.props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" ");

function returnTrue(){ return true; }
function returnFalse(){ return false; }

// Javascript JSON implementation
// (Parse Method Only)
// https://github.com/douglascrockford/JSON-js/blob/master/json2.js

var JSON;
if (!JSON) { JSON = {}; }

(function(){
  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

  if (typeof JSON.parse !== 'function') {
      JSON.parse = function (text, reviver) {
          var j;

          function walk(holder, key) {
              var k, v, value = holder[key];
              if (value && typeof value === 'object') {
                  for (k in value) {
                      if (Object.prototype.hasOwnProperty.call(value, k)) {
                          v = walk(value, k);
                          if (v !== undefined) {
                              value[k] = v;
                          } else {
                              delete value[k];
                          }
                      }
                  }
              }
              return reviver.call(holder, key, value);
          }
          text = String(text);
          cx.lastIndex = 0;
          if (cx.test(text)) {
              text = text.replace(cx, function (a) {
                  return '\\u' +
                      ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
              });
          }

          if (/^[\],:{}\s]*$/
                  .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                      .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

              j = eval('(' + text + ')');

              return typeof reviver === 'function' ?
                  walk({'': j}, '') : j;
          }

          throw new SyntaxError('JSON.parse');
      };
  }
}());
/* UI Component- Base class for all UI objects
================================================================================ */
_V_.Player = _V_.Component.extend({

  init: function(tag, addOptions, ready){

    this.tag = tag; // Store the original tag used to set options

    var el = this.el = _V_.createElement("div"), // Div to contain video and controls
        options = this.options = {},
        width = options.width = tag.getAttribute('width'),
        height = options.height = tag.getAttribute('height'),

        // Browsers default to 300x150 if there's no width/height or video size data.
        initWidth = width || 300,
        initHeight = height || 150;

    // Make player findable on elements
    tag.player = el.player = this;

    // Add callback to ready queue
    this.ready(ready);

    // Wrap video tag in div (el/box) container
    tag.parentNode.insertBefore(el, tag);
    el.appendChild(tag); // Breaks iPhone, fixed in HTML5 setup.

    // Give video tag properties to box
    el.id = this.id = tag.id; // ID will now reference box, not the video tag
    el.className = tag.className;
    // Update tag id/class for use as HTML5 playback tech
    tag.id += "_html5_api";
    tag.className = "vjs-tech";

    // Make player easily findable by ID
    _V_.players[el.id] = this;

    // Make box use width/height of tag, or default 300x150
    el.setAttribute("width", initWidth);
    el.setAttribute("height", initHeight);
    // Enforce with CSS since width/height attrs don't work on divs
    el.style.width = initWidth+"px";
    el.style.height = initHeight+"px";
    // Remove width/height attrs from tag so CSS can make it 100% width/height
    tag.removeAttribute("width");
    tag.removeAttribute("height");

    // Set Options
    _V_.merge(options, _V_.options); // Copy Global Defaults
    _V_.merge(options, this.getVideoTagSettings()); // Override with Video Tag Options
    _V_.merge(options, addOptions); // Override/extend with options from setup call

    // Store controls setting, and then remove immediately so native controls don't flash.
    tag.removeAttribute("controls");

    // Poster will be handled by a manual <img>
    tag.removeAttribute("poster");

    // Empty video tag sources and tracks so the built in player doesn't use them also.
    if (tag.hasChildNodes()) {
      for (var i=0,j=tag.childNodes;i<j.length;i++) {
        if (j[i].nodeName == "SOURCE" || j[i].nodeName == "TRACK") {
          tag.removeChild(j[i]);
        }
      }
    }

    // Cache for video property values.
    this.values = {};

    this.addClass("vjs-paused");

    this.addEvent("ended", this.onEnded);
    this.addEvent("play", this.onPlay);
    this.addEvent("pause", this.onPause);
    this.addEvent("progress", this.onProgress);
    this.addEvent("error", this.onError);

    // When the API is ready, loop through the components and add to the player.
    if (options.controls) {
      this.ready(function(){
        this.initComponents();
      });
    }

    // Tracks defined in tracks.js
    this.textTracks = [];
    if (options.tracks && options.tracks.length > 0) {
      this.addTextTracks(options.tracks);
    }

    // If there are no sources when the player is initialized,
    // load the first supported playback technology.
    if (!options.sources || options.sources.length == 0) {
      for (var i=0,j=options.techOrder; i<j.length; i++) {
        var techName = j[i],
            tech = _V_[techName];

        // Check if the browser supports this technology
        if (tech.isSupported()) {
          this.loadTech(techName);
          break;
        }
      }
    } else {
      // Loop through playback technologies (HTML5, Flash) and check for support. Then load the best source.
      // A few assumptions here:
      //   All playback technologies respect preload false.
      this.src(options.sources);
    }
  },

  // Cache for video property values.
  values: {},

  destroy: function(){
    // Ensure that tracking progress and time progress will stop and plater deleted
    this.stopTrackingProgress();
    this.stopTrackingCurrentTime();
    _V_.players[this.id] = null;
    delete _V_.players[this.id];
    this.tech.destroy();
    this.el.parentNode.removeChild(this.el);
  },

  createElement: function(type, options){},

  getVideoTagSettings: function(){
    var options = {
      sources: [],
      tracks: []
    };

    options.src = this.tag.getAttribute("src");
    options.controls = this.tag.getAttribute("controls") !== null;
    options.poster = this.tag.getAttribute("poster");
    options.preload = this.tag.getAttribute("preload");
    options.autoplay = this.tag.getAttribute("autoplay") !== null; // hasAttribute not IE <8 compatible
    options.loop = this.tag.getAttribute("loop") !== null;
    options.muted = this.tag.getAttribute("muted") !== null;

    if (this.tag.hasChildNodes()) {
      for (var c,i=0,j=this.tag.childNodes;i<j.length;i++) {
        c = j[i];
        if (c.nodeName == "SOURCE") {
          options.sources.push({
            src: c.getAttribute('src'),
            type: c.getAttribute('type'),
            media: c.getAttribute('media'),
            title: c.getAttribute('title')
          });
        }
        if (c.nodeName == "TRACK") {
          options.tracks.push({
            src: c.getAttribute("src"),
            kind: c.getAttribute("kind"),
            srclang: c.getAttribute("srclang"),
            label: c.getAttribute("label"),
            'default': c.getAttribute("default") !== null,
            title: c.getAttribute("title")
          });
        }
      }
    }
    return options;
  },

  /* PLayback Technology (tech)
  ================================================================================ */
  // Load/Create an instance of playback technlogy including element and API methods
  // And append playback element in player div.
  loadTech: function(techName, source){

    // Pause and remove current playback technology
    if (this.tech) {
      this.unloadTech();

    // If the first time loading, HTML5 tag will exist but won't be initialized
    // So we need to remove it if we're not loading HTML5
    } else if (techName != "html5" && this.tag) {
      this.el.removeChild(this.tag);
      this.tag = false;
    }

    this.techName = techName;

    // Turn off API access because we're loading a new tech that might load asynchronously
    this.isReady = false;

    var techReady = function(){
      this.player.triggerReady();

      // Manually track progress in cases where the browser/flash player doesn't report it.
      if (!this.support.progressEvent) {
        this.player.manualProgressOn();
      }

      // Manually track timeudpates in cases where the browser/flash player doesn't report it.
      if (!this.support.timeupdateEvent) {
        this.player.manualTimeUpdatesOn();
      }
    }

    // Grab tech-specific options from player options and add source and parent element to use.
    var techOptions = _V_.merge({ source: source, parentEl: this.el }, this.options[techName])

    if (source) {
      if (source.src == this.values.src && this.values.currentTime > 0) {
        techOptions.startTime = this.values.currentTime;
      }

      this.values.src = source.src;
    }

    // Initialize tech instance
    this.tech = new _V_[techName](this, techOptions);
    this.tech.ready(techReady);
  },

  unloadTech: function(){
    this.tech.destroy();

    // Turn off any manual progress or timeupdate tracking
    if (this.manualProgress) { this.manualProgressOff(); }

    if (this.manualTimeUpdates) { this.manualTimeUpdatesOff(); }

    this.tech = false;
  },

  // There's many issues around changing the size of a Flash (or other plugin) object.
  // First is a plugin reload issue in Firefox that has been around for 11 years: https://bugzilla.mozilla.org/show_bug.cgi?id=90268
  // Then with the new fullscreen API, Mozilla and webkit browsers will reload the flash object after going to fullscreen.
  // To get around this, we're unloading the tech, caching source and currentTime values, and reloading the tech once the plugin is resized.
  // reloadTech: function(betweenFn){
  //   _V_.log("unloadingTech")
  //   this.unloadTech();
  //   _V_.log("unloadedTech")
  //   if (betweenFn) { betweenFn.call(); }
  //   _V_.log("LoadingTech")
  //   this.loadTech(this.techName, { src: this.values.src })
  //   _V_.log("loadedTech")
  // },

  /* Fallbacks for unsupported event types
  ================================================================================ */
  // Manually trigger progress events based on changes to the buffered amount
  // Many flash players and older HTML5 browsers don't send progress or progress-like events
  manualProgressOn: function(){
    this.manualProgress = true;

    // Trigger progress watching when a source begins loading
    this.trackProgress();

    // Watch for a native progress event call on the tech element
    // In HTML5, some older versions don't support the progress event
    // So we're assuming they don't, and turning off manual progress if they do.
    this.tech.addEvent("progress", function(){

      // Remove this listener from the element
      this.removeEvent("progress", arguments.callee);

      // Update known progress support for this playback technology
      this.support.progressEvent = true;

      // Turn off manual progress tracking
      this.player.manualProgressOff();
    });
  },

  manualProgressOff: function(){
    this.manualProgress = false;
    this.stopTrackingProgress();
  },

  trackProgress: function(){
    this.progressInterval = setInterval(_V_.proxy(this, function(){
      // Don't trigger unless buffered amount is greater than last time
      // log(this.values.bufferEnd, this.buffered().end(0), this.duration())
      /* TODO: update for multiple buffered regions */
      if (this.values.bufferEnd < this.buffered().end(0)) {
        this.triggerEvent("progress");
      } else if (this.bufferedPercent() == 1) {
        this.stopTrackingProgress();
        this.triggerEvent("progress"); // Last update
      }
    }), 500);
  },
  stopTrackingProgress: function(){ clearInterval(this.progressInterval); },

  /* Time Tracking -------------------------------------------------------------- */
  manualTimeUpdatesOn: function(){
    this.manualTimeUpdates = true;

    this.addEvent("play", this.trackCurrentTime);
    this.addEvent("pause", this.stopTrackingCurrentTime);
    // timeupdate is also called by .currentTime whenever current time is set

    // Watch for native timeupdate event
    this.tech.addEvent("timeupdate", function(){

      // Remove this listener from the element
      this.removeEvent("timeupdate", arguments.callee);

      // Update known progress support for this playback technology
      this.support.timeupdateEvent = true;

      // Turn off manual progress tracking
      this.player.manualTimeUpdatesOff();
    });
  },

  manualTimeUpdatesOff: function(){
    this.manualTimeUpdates = false;
    this.stopTrackingCurrentTime();
    this.removeEvent("play", this.trackCurrentTime);
    this.removeEvent("pause", this.stopTrackingCurrentTime);
  },

  trackCurrentTime: function(){
    if (this.currentTimeInterval) { this.stopTrackingCurrentTime(); }
    this.currentTimeInterval = setInterval(_V_.proxy(this, function(){
      this.triggerEvent("timeupdate");
    }), 250); // 42 = 24 fps // 250 is what Webkit uses // FF uses 15
  },

  // Turn off play progress tracking (when paused or dragging)
  stopTrackingCurrentTime: function(){ clearInterval(this.currentTimeInterval); },

  /* Player event handlers (how the player reacts to certain events)
  ================================================================================ */
  onEnded: function(){
    if (this.options.loop) {
      this.currentTime(0);
      this.play();
    } else {
      this.pause();
      this.currentTime(0);
      this.pause();
    }
  },

  onPlay: function(){
    _V_.removeClass(this.el, "vjs-paused");
    _V_.addClass(this.el, "vjs-playing");
  },

  onPause: function(){
    _V_.removeClass(this.el, "vjs-playing");
    _V_.addClass(this.el, "vjs-paused");
  },

  onProgress: function(){
    // Add custom event for when source is finished downloading.
    if (this.bufferedPercent() == 1) {
      this.triggerEvent("loadedalldata");
    }
  },

  onError: function(e) {
    _V_.log("Video Error", e);
  },

/* Player API
================================================================================ */

  // Pass values to the playback tech
  techCall: function(method, arg){

    // If it's not ready yet, call method when it is
    if (!this.tech.isReady) {
      this.tech.ready(function(){
        this[method](arg);
      });

    // Otherwise call method now
    } else {
      try {
        this.tech[method](arg);
      } catch(e) {
        _V_.log(e);
      }
    }
  },

  // Get calls can't wait for the tech, and sometimes don't need to.
  techGet: function(method){

    // Make sure tech is ready
    if (this.tech.isReady) {

      // Flash likes to die and reload when you hide or reposition it.
      // In these cases the object methods go away and we get errors.
      // When that happens we'll catch the errors and inform tech that it's not ready any more.
      try {
        return this.tech[method]();
      } catch(e) {

        // When building additional tech libs, an expected method may not be defined yet
        if (this.tech[method] === undefined) {
          _V_.log("Video.js: " + method + " method not defined for "+this.techName+" playback technology.", e);

        } else {

          // When a method isn't available on the object it throws a TypeError
          if (e.name == "TypeError") {
            _V_.log("Video.js: " + method + " unavailable on "+this.techName+" playback technology element.", e);
            this.tech.isReady = false;

          } else {
            _V_.log(e);
          }
        }
      }
    }

    return;
  },

  // Method for calling methods on the current playback technology
  // techCall: function(method, arg){
  //
  //   // if (this.isReady) {
  //   //
  //   // } else {
  //   //   _V_.log("The playback technology API is not ready yet. Use player.ready(myFunction)."+" ["+method+"]", arguments.callee.caller.arguments.callee.caller.arguments.callee.caller)
  //   //   return false;
  //   //   // throw new Error("The playback technology API is not ready yet. Use player.ready(myFunction)."+" ["+method+"]");
  //   // }
  // },

  // http://dev.w3.org/html5/spec/video.html#dom-media-play
  play: function(){
    this.techCall("play");
    return this;
  },

  // http://dev.w3.org/html5/spec/video.html#dom-media-pause
  pause: function(){
    this.techCall("pause");
    return this;
  },

  // http://dev.w3.org/html5/spec/video.html#dom-media-paused
  // The initial state of paused should be true (in Safari it's actually false)
  paused: function(){
    return (this.techGet("paused") === false) ? false : true;
  },

  // http://dev.w3.org/html5/spec/video.html#dom-media-currenttime
  currentTime: function(seconds){
    if (seconds !== undefined) {

      // Cache the last set value for smoother scrubbing.
      this.values.lastSetCurrentTime = seconds;

      this.techCall("setCurrentTime", seconds);

      // Improve the accuracy of manual timeupdates
      if (this.manualTimeUpdates) { this.triggerEvent("timeupdate"); }

      return this;
    }

    // Cache last currentTime and return
    // Default to 0 seconds
    return this.values.currentTime = (this.techGet("currentTime") || 0);
  },

  // http://dev.w3.org/html5/spec/video.html#dom-media-duration
  // Duration should return NaN if not available. ParseFloat will turn false-ish values to NaN.
  duration: function(){
    return parseFloat(this.techGet("duration"));
  },

  // Calculates how much time is left. Not in spec, but useful.
  remainingTime: function(){
    return this.duration() - this.currentTime();
  },

  // http://dev.w3.org/html5/spec/video.html#dom-media-buffered
  // Buffered returns a timerange object. Kind of like an array of portions of the video that have been downloaded.
  // So far no browsers return more than one range (portion)
  buffered: function(){
    var buffered = this.techGet("buffered"),
        start = 0,
        end = this.values.bufferEnd = this.values.bufferEnd || 0, // Default end to 0 and store in values
        timeRange;

    if (buffered && buffered.length > 0 && buffered.end(0) !== end) {
      end = buffered.end(0);
      // Storing values allows them be overridden by setBufferedFromProgress
      this.values.bufferEnd = end;
    }

    return _V_.createTimeRange(start, end);
  },

  // Calculates amount of buffer is full. Not in spec but useful.
  bufferedPercent: function(){
    return (this.duration()) ? this.buffered().end(0) / this.duration() : 0;
  },

  // http://dev.w3.org/html5/spec/video.html#dom-media-volume
  volume: function(percentAsDecimal){
    var vol;

    if (percentAsDecimal !== undefined) {
      vol = Math.max(0, Math.min(1, parseFloat(percentAsDecimal))); // Force value to between 0 and 1
      this.values.volume = vol;
      this.techCall("setVolume", vol);
      _V_.setLocalStorage("volume", vol);
      return this;
    }

    // Default to 1 when returning current volume.
    vol = parseFloat(this.techGet("volume"));
    return (isNaN(vol)) ? 1 : vol;
  },

  // http://dev.w3.org/html5/spec/video.html#attr-media-muted
  muted: function(muted){
    if (muted !== undefined) {
      this.techCall("setMuted", muted);
      return this;
    }
    return this.techGet("muted") || false; // Default to false
  },

  // http://dev.w3.org/html5/spec/dimension-attributes.html#attr-dim-height
  // Video tag width/height only work in pixels. No percents.
  // We could potentially allow percents but won't for now until we can do testing around it.
  width: function(width, skipListeners){
    if (width !== undefined) {
      this.el.width = width;
      this.el.style.width = width+"px";

      // skipListeners allows us to avoid triggering the resize event when setting both width and height
      if (!skipListeners) { this.triggerEvent("resize"); }
      return this;
    }
    return parseInt(this.el.getAttribute("width"));
  },
  height: function(height){
    if (height !== undefined) {
      this.el.height = height;
      this.el.style.height = height+"px";
      this.triggerEvent("resize");
      return this;
    }
    return parseInt(this.el.getAttribute("height"));
  },
  // Set both width and height at the same time.
  size: function(width, height){
    // Skip resize listeners on width for optimization
    return this.width(width, true).height(height);
  },

  // Check if current tech can support native fullscreen (e.g. with built in controls lik iOS, so not our flash swf)
  supportsFullScreen: function(){ return this.techGet("supportsFullScreen") || false; },

  // Turn on fullscreen (or window) mode
  requestFullScreen: function(){
    var requestFullScreen = _V_.support.requestFullScreen;

    this.isFullScreen = true;

    // Check for browser element fullscreen support
    if (requestFullScreen) {

      // Trigger fullscreenchange event after change
      _V_.addEvent(document, requestFullScreen.eventName, this.proxy(function(){
        this.isFullScreen = document[requestFullScreen.isFullScreen];

        // If cancelling fullscreen, remove event listener.
        if (this.isFullScreen == false) {
          _V_.removeEvent(document, requestFullScreen.eventName, arguments.callee);
        }

        this.triggerEvent("fullscreenchange");
      }));

      // Flash and other plugins get reloaded when you take their parent to fullscreen.
      // To fix that we'll remove the tech, and reload it after the resize has finished.
      if (this.tech.support.fullscreenResize === false && this.options.flash.iFrameMode != true) {

        this.pause();
        this.unloadTech();

        _V_.addEvent(document, requestFullScreen.eventName, this.proxy(function(){
          _V_.removeEvent(document, requestFullScreen.eventName, arguments.callee);
          this.loadTech(this.techName, { src: this.values.src });
        }));

        this.el[requestFullScreen.requestFn]();

      } else {
        this.el[requestFullScreen.requestFn]();
      }

    } else if (this.tech.supportsFullScreen()) {
      this.triggerEvent("fullscreenchange");
      this.techCall("enterFullScreen");

    } else {
      this.triggerEvent("fullscreenchange");
      this.enterFullWindow();
    }

     return this;
   },

   cancelFullScreen: function(){
    var requestFullScreen = _V_.support.requestFullScreen;

    this.isFullScreen = false;

    // Check for browser element fullscreen support
    if (requestFullScreen) {

     // Flash and other plugins get reloaded when you take their parent to fullscreen.
     // To fix that we'll remove the tech, and reload it after the resize has finished.
     if (this.tech.support.fullscreenResize === false && this.options.flash.iFrameMode != true) {

       this.pause();
       this.unloadTech();

       _V_.addEvent(document, requestFullScreen.eventName, this.proxy(function(){
         _V_.removeEvent(document, requestFullScreen.eventName, arguments.callee);
         this.loadTech(this.techName, { src: this.values.src })
       }));

       document[requestFullScreen.cancelFn]();

     } else {
       document[requestFullScreen.cancelFn]();
     }

    } else if (this.tech.supportsFullScreen()) {
     this.techCall("exitFullScreen");
     this.triggerEvent("fullscreenchange");

    } else {
     this.exitFullWindow();
     this.triggerEvent("fullscreenchange");
    }

    return this;
  },

  // When fullscreen isn't supported we can stretch the video container to as wide as the browser will let us.
  enterFullWindow: function(){
    this.isFullWindow = true;

    // Storing original doc overflow value to return to when fullscreen is off
    this.docOrigOverflow = document.documentElement.style.overflow;

    // Add listener for esc key to exit fullscreen
    _V_.addEvent(document, "keydown", _V_.proxy(this, this.fullWindowOnEscKey));

    // Hide any scroll bars
    document.documentElement.style.overflow = 'hidden';

    // Apply fullscreen styles
    _V_.addClass(document.body, "vjs-full-window");
    _V_.addClass(this.el, "vjs-fullscreen");

    this.triggerEvent("enterFullWindow");
  },
  fullWindowOnEscKey: function(event){
    if (event.keyCode == 27) {
      if (this.isFullScreen == true) {
        this.cancelFullScreen();
      } else {
        this.exitFullWindow();
      }
    }
  },

  exitFullWindow: function(){
    this.isFullWindow = false;
    _V_.removeEvent(document, "keydown", this.fullWindowOnEscKey);

    // Unhide scroll bars.
    document.documentElement.style.overflow = this.docOrigOverflow;

    // Remove fullscreen styles
    _V_.removeClass(document.body, "vjs-full-window");
    _V_.removeClass(this.el, "vjs-fullscreen");

    // Resize the box, controller, and poster to original sizes
    // this.positionAll();
    this.triggerEvent("exitFullWindow");
  },

  selectSource: function(sources){

    // Loop through each playback technology in the options order
    for (var i=0,j=this.options.techOrder;i<j.length;i++) {
      var techName = j[i],
          tech = _V_[techName];
          // tech = _V_.tech[techName];

      // Check if the browser supports this technology
      if (tech.isSupported()) {

        // Loop through each source object
        for (var a=0,b=sources;a<b.length;a++) {
          var source = b[a];

          // Check if source can be played with this technology
          if (tech.canPlaySource.call(this, source)) {

            return { source: source, tech: techName };

          }
        }
      }
    }

    return false;
  },

  // src is a pretty powerful function
  // If you pass it an array of source objects, it will find the best source to play and use that object.src
  //   If the new source requires a new playback technology, it will switch to that.
  // If you pass it an object, it will set the source to object.src
  // If you pass it anything else (url string) it will set the video source to that
  src: function(source){
    // Case: Array of source objects to choose from and pick the best to play
    if (source instanceof Array) {

      var sourceTech = this.selectSource(source),
          source,
          techName;

      if (sourceTech) {
          source = sourceTech.source;
          techName = sourceTech.tech;

        // If this technology is already loaded, set source
        if (techName == this.techName) {
          this.src(source); // Passing the source object

        // Otherwise load this technology with chosen source
        } else {
          this.loadTech(techName, source);
        }
      } else {
        _V_.log("No compatible source and playback technology were found.")
      }

    // Case: Source object { src: "", type: "" ... }
    } else if (source instanceof Object) {

      if (_V_[this.techName].canPlaySource(source)) {
        this.src(source.src);
      } else {
        // Send through tech loop to check for a compatible technology.
        this.src([source]);
      }

    // Case: URL String (http://myvideo...)
    } else {
      // Cache for getting last set source
      this.values.src = source;

      if (!this.isReady) {
        this.ready(function(){
          this.src(source);
        });
      } else {
        this.techCall("src", source);
        if (this.options.preload == "auto") {
          this.load();
        }
        if (this.options.autoplay) {
          this.play();
        }
      }
    }
    return this;
  },

  // Begin loading the src data
  // http://dev.w3.org/html5/spec/video.html#dom-media-load
  load: function(){
    this.techCall("load");
    return this;
  },

  // http://dev.w3.org/html5/spec/video.html#dom-media-currentsrc
  currentSrc: function(){
    return this.techGet("currentSrc") || this.values.src || "";
  },

  // Attributes/Options
  preload: function(value){
    if (value !== undefined) {
      this.techCall("setPreload", value);
      this.options.preload = value;
      return this;
    }
    return this.techGet("preload");
  },
  autoplay: function(value){
    if (value !== undefined) {
      this.techCall("setAutoplay", value);
      this.options.autoplay = value;
      return this;
    }
    return this.techGet("autoplay", value);
  },
  loop: function(value){
    if (value !== undefined) {
      this.techCall("setLoop", value);
      this.options.loop = value;
      return this;
    }
    return this.techGet("loop");
  },

  controls: function(){ return this.options.controls; },
  poster: function(){ return this.techGet("poster"); },
  error: function(){ return this.techGet("error"); },
  ended: function(){ return this.techGet("ended"); }

  // Methods to add support for
  // networkState: function(){ return this.techCall("networkState"); },
  // readyState: function(){ return this.techCall("readyState"); },
  // seeking: function(){ return this.techCall("seeking"); },
  // initialTime: function(){ return this.techCall("initialTime"); },
  // startOffsetTime: function(){ return this.techCall("startOffsetTime"); },
  // played: function(){ return this.techCall("played"); },
  // seekable: function(){ return this.techCall("seekable"); },
  // videoTracks: function(){ return this.techCall("videoTracks"); },
  // audioTracks: function(){ return this.techCall("audioTracks"); },
  // videoWidth: function(){ return this.techCall("videoWidth"); },
  // videoHeight: function(){ return this.techCall("videoHeight"); },
  // defaultPlaybackRate: function(){ return this.techCall("defaultPlaybackRate"); },
  // playbackRate: function(){ return this.techCall("playbackRate"); },
  // mediaGroup: function(){ return this.techCall("mediaGroup"); },
  // controller: function(){ return this.techCall("controller"); },
  // defaultMuted: function(){ return this.techCall("defaultMuted"); }
});

// RequestFullscreen API
(function(){
  var requestFn,
      cancelFn,
      eventName,
      isFullScreen,
      playerProto = _V_.Player.prototype;

  // Current W3C Spec
  // http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html#api
  // Mozilla Draft: https://wiki.mozilla.org/Gecko:FullScreenAPI#fullscreenchange_event
  if (document.cancelFullscreen !== undefined) {
    requestFn = "requestFullscreen";
    cancelFn = "exitFullscreen";
    eventName = "fullscreenchange";
    isFullScreen = "fullScreen";

  // Webkit (Chrome/Safari) and Mozilla (Firefox) have working implementaitons
  // that use prefixes and vary slightly from the new W3C spec. Specifically, using 'exit' instead of 'cancel',
  // and lowercasing the 'S' in Fullscreen.
  // Other browsers don't have any hints of which version they might follow yet, so not going to try to predict by loopeing through all prefixes.
  } else {

    _V_.each(["moz", "webkit"], function(prefix){

      // https://github.com/zencoder/video-js/pull/128
      if ((prefix != "moz" || document.mozFullScreenEnabled) && document[prefix + "CancelFullScreen"] !== undefined) {
        requestFn = prefix + "RequestFullScreen";
        cancelFn = prefix + "CancelFullScreen";
        eventName = prefix + "fullscreenchange";

        if (prefix == "webkit") {
          isFullScreen = prefix + "IsFullScreen";
        } else {
          isFullScreen = prefix + "FullScreen";
        }
      }

    });

  }

  if (requestFn) {
    _V_.support.requestFullScreen = {
      requestFn: requestFn,
      cancelFn: cancelFn,
      eventName: eventName,
      isFullScreen: isFullScreen
    };
  }

})();/* Playback Technology - Base class for playback technologies
================================================================================ */
_V_.PlaybackTech = _V_.Component.extend({
  init: function(player, options){
    // this._super(player, options);

    // Make playback element clickable
    // _V_.addEvent(this.el, "click", _V_.proxy(this, _V_.PlayToggle.prototype.onClick));

    // this.addEvent("click", this.proxy(this.onClick));

    // player.triggerEvent("techready");
  },
  // destroy: function(){},
  // createElement: function(){},
  onClick: function(){
    if (this.player.options.controls) {
      _V_.PlayToggle.prototype.onClick.call(this);
    }
  }
});

// Create placeholder methods for each that warn when a method isn't supported by the current playback technology
_V_.apiMethods = "play,pause,paused,currentTime,setCurrentTime,duration,buffered,volume,setVolume,muted,setMuted,width,height,supportsFullScreen,enterFullScreen,src,load,currentSrc,preload,setPreload,autoplay,setAutoplay,loop,setLoop,error,networkState,readyState,seeking,initialTime,startOffsetTime,played,seekable,ended,videoTracks,audioTracks,videoWidth,videoHeight,textTracks,defaultPlaybackRate,playbackRate,mediaGroup,controller,controls,defaultMuted".split(",");
_V_.each(_V_.apiMethods, function(methodName){
  _V_.PlaybackTech.prototype[methodName] = function(){
    throw new Error("The '"+methodName+"' method is not available on the playback technology's API");
  }
});

/* HTML5 Playback Technology - Wrapper for HTML5 Media API
================================================================================ */
_V_.html5 = _V_.PlaybackTech.extend({

  init: function(player, options, ready){
    this.player = player;
    this.el = this.createElement();
    this.ready(ready);

    this.addEvent("click", this.proxy(this.onClick));

    var source = options.source;

    // If the element source is already set, we may have missed the loadstart event, and want to trigger it.
    // We don't want to set the source again and interrupt playback.
    if (source && this.el.currentSrc == source.src) {
      player.triggerEvent("loadstart");

    // Otherwise set the source if one was provided.
    } else if (source) {
      this.el.src = source.src;
    }

    // Chrome and Safari both have issues with autoplay.
    // In Safari (5.1.1), when we move the video element into the container div, autoplay doesn't work.
    // In Chrome (15), if you have autoplay + a poster + no controls, the video gets hidden (but audio plays)
    // This fixes both issues. Need to wait for API, so it updates displays correctly
    player.ready(function(){
      if (this.options.autoplay && this.paused()) {
        this.tag.poster = null; // Chrome Fix. Fixed in Chrome v16.
        this.play();
      }
    });

    this.setupTriggers();

    this.triggerReady();
  },

  destroy: function(){
    this.player.tag = false;
    this.removeTriggers();
    this.el.parentNode.removeChild(this.el);
  },

  createElement: function(){
    var html5 = _V_.html5,
        player = this.player,

        // If possible, reuse original tag for HTML5 playback technology element
        el = player.tag,
        newEl;

    // Check if this browser supports moving the element into the box.
    // On the iPhone video will break if you move the element,
    // So we have to create a brand new element.
    if (!el || this.support.movingElementInDOM === false) {

      // If the original tag is still there, remove it.
      if (el) {
        player.el.removeChild(el);
      }

      newEl = _V_.createElement("video", {
        id: el.id || player.el.id + "_html5_api",
        className: el.className || "vjs-tech"
      });

      el = newEl;
      _V_.insertFirst(el, player.el);
    }

    // Update tag settings, in case they were overridden
    _V_.each(["autoplay","preload","loop","muted"], function(attr){ // ,"poster"
      if (player.options[attr] !== null) {
        el[attr] = player.options[attr];
      }
    }, this);

    return el;
  },

  // Make video events trigger player events
  // May seem verbose here, but makes other APIs possible.
  setupTriggers: function(){
    _V_.each.call(this, _V_.html5.events, function(type){
      _V_.addEvent(this.el, type, _V_.proxy(this.player, this.eventHandler));
    });
  },
  removeTriggers: function(){
    _V_.each.call(this, _V_.html5.events, function(type){
      _V_.removeEvent(this.el, type, _V_.proxy(this.player, this.eventHandler));
    });
  },
  eventHandler: function(e){
    e.stopPropagation();
    this.triggerEvent(e);
  },

  play: function(){ this.el.play(); },
  pause: function(){ this.el.pause(); },
  paused: function(){ return this.el.paused; },

  currentTime: function(){ return this.el.currentTime; },
  setCurrentTime: function(seconds){
    try {
      this.el.currentTime = seconds;
      } catch(e) {
        _V_.log(e, "Video isn't ready. (VideoJS)");
      // this.warning(VideoJS.warnings.videoNotReady);
    }
  },

  duration: function(){ return this.el.duration || 0; },
  buffered: function(){ return this.el.buffered; },

  volume: function(){ return this.el.volume; },
  setVolume: function(percentAsDecimal){ this.el.volume = percentAsDecimal; },
  muted: function(){ return this.el.muted; },
  setMuted: function(muted){ this.el.muted = muted },

  width: function(){ return this.el.offsetWidth; },
  height: function(){ return this.el.offsetHeight; },

  supportsFullScreen: function(){
    if (typeof this.el.webkitEnterFullScreen == 'function') {

      // Seems to be broken in Chromium/Chrome && Safari in Leopard
      if (!navigator.userAgent.match("Chrome") && !navigator.userAgent.match("Mac OS X 10.5")) {
        return true;
      }
    }
    return false;
  },

  enterFullScreen: function(){
      try {
        this.el.webkitEnterFullScreen();
      } catch (e) {
        if (e.code == 11) {
          // this.warning(VideoJS.warnings.videoNotReady);
          _V_.log("VideoJS: Video not ready.")
        }
      }
  },
  src: function(src){ this.el.src = src; },
  load: function(){ this.el.load(); },
  currentSrc: function(){ return this.el.currentSrc; },

  preload: function(){ return this.el.preload; },
  setPreload: function(val){ this.el.preload = val; },
  autoplay: function(){ return this.el.autoplay; },
  setAutoplay: function(val){ this.el.autoplay = val; },
  loop: function(){ return this.el.loop; },
  setLoop: function(val){ this.el.loop = val; },

  error: function(){ return this.el.error; },
  // networkState: function(){ return this.el.networkState; },
  // readyState: function(){ return this.el.readyState; },
  seeking: function(){ return this.el.seeking; },
  // initialTime: function(){ return this.el.initialTime; },
  // startOffsetTime: function(){ return this.el.startOffsetTime; },
  // played: function(){ return this.el.played; },
  // seekable: function(){ return this.el.seekable; },
  ended: function(){ return this.el.ended; },
  // videoTracks: function(){ return this.el.videoTracks; },
  // audioTracks: function(){ return this.el.audioTracks; },
  // videoWidth: function(){ return this.el.videoWidth; },
  // videoHeight: function(){ return this.el.videoHeight; },
  // textTracks: function(){ return this.el.textTracks; },
  // defaultPlaybackRate: function(){ return this.el.defaultPlaybackRate; },
  // playbackRate: function(){ return this.el.playbackRate; },
  // mediaGroup: function(){ return this.el.mediaGroup; },
  // controller: function(){ return this.el.controller; },
  controls: function(){ return this.player.options.controls; },
  defaultMuted: function(){ return this.el.defaultMuted; }
});

/* HTML5 Support Testing -------------------------------------------------------- */

_V_.html5.isSupported = function(){
  return !!document.createElement("video").canPlayType;
};

_V_.html5.canPlaySource = function(srcObj){
  return !!document.createElement("video").canPlayType(srcObj.type);
  // TODO: Check Type
  // If no Type, check ext
  // Check Media Type
};

// List of all HTML5 events (various uses).
_V_.html5.events = "loadstart,suspend,abort,error,emptied,stalled,loadedmetadata,loadeddata,canplay,canplaythrough,playing,waiting,seeking,seeked,ended,durationchange,timeupdate,progress,play,pause,ratechange,volumechange".split(",");

/* HTML5 Device Fixes ---------------------------------------------------------- */

_V_.html5.prototype.support = {

  // Support for tech specific full screen. (webkitEnterFullScreen, not requestFullscreen)
  // http://developer.apple.com/library/safari/#documentation/AudioVideo/Reference/HTMLVideoElementClassReference/HTMLVideoElement/HTMLVideoElement.html
  // Seems to be broken in Chromium/Chrome && Safari in Leopard
  fullscreen: (typeof _V_.testVid.webkitEnterFullScreen !== undefined) ? (!_V_.ua.match("Chrome") && !_V_.ua.match("Mac OS X 10.5") ? true : false) : false,

  // In iOS, if you move a video element in the DOM, it breaks video playback.
  movingElementInDOM: !_V_.isIOS()

};

// Android
if (_V_.isAndroid()) {

  // Override Android 2.2 and less canPlayType method which is broken
  if (_V_.androidVersion() < 3) {
    document.createElement("video").constructor.prototype.canPlayType = function(type){
      return (type && type.toLowerCase().indexOf("video/mp4") != -1) ? "maybe" : "";
    };
  }
}


/* VideoJS-SWF - Custom Flash Player with HTML5-ish API - https://github.com/zencoder/video-js-swf
================================================================================ */
_V_.flash = _V_.PlaybackTech.extend({

  init: function(player, options){
    this.player = player;

    var source = options.source,

        // Which element to embed in
        parentEl = options.parentEl,

        // Create a temporary element to be replaced by swf object
        placeHolder = this.el = _V_.createElement("div", { id: parentEl.id + "_temp_flash" }),

        // Generate ID for swf object
        objId = player.el.id+"_flash_api",

        // Store player options in local var for optimization
        playerOptions = player.options,

        // Merge default flashvars with ones passed in to init
        flashVars = _V_.merge({

          // SWF Callback Functions
          readyFunction: "_V_.flash.onReady",
          eventProxyFunction: "_V_.flash.onEvent",
          errorEventProxyFunction: "_V_.flash.onError",

          // Player Settings
          autoplay: playerOptions.autoplay,
          preload: playerOptions.preload,
          loop: playerOptions.loop,
          muted: playerOptions.muted

        }, options.flashVars),

        // Merge default parames with ones passed in
        params = _V_.merge({
          wmode: "opaque", // Opaque is needed to overlay controls, but can affect playback performance
          bgcolor: "#000000" // Using bgcolor prevents a white flash when the object is loading
        }, options.params),

        // Merge default attributes with ones passed in
        attributes = _V_.merge({
          id: objId,
          name: objId, // Both ID and Name needed or swf to identifty itself
          'class': 'vjs-tech'
        }, options.attributes)
    ;

    // If source was supplied pass as a flash var.
    if (source) {
      flashVars.src = encodeURIComponent(_V_.getAbsoluteURL(source.src));
    }

    // Add placeholder to player div
    _V_.insertFirst(placeHolder, parentEl);

    // Having issues with Flash reloading on certain page actions (hide/resize/fullscreen) in certain browsers
    // This allows resetting the playhead when we catch the reload
    if (options.startTime) {
      this.ready(function(){
        this.load();
        this.play();
        this.currentTime(options.startTime);
      });
    }

    // Flash iFrame Mode
    // In web browsers there are multiple instances where changing the parent element or visibility of a plugin causes the plugin to reload.
    // - Firefox just about always. https://bugzilla.mozilla.org/show_bug.cgi?id=90268 (might be fixed by version 13)
    // - Webkit when hiding the plugin
    // - Webkit and Firefox when using requestFullScreen on a parent element
    // Loading the flash plugin into a dynamically generated iFrame gets around most of these issues.
    // Issues that remain include hiding the element and requestFullScreen in Firefox specifically

    // There's on particularly annoying issue with this method which is that Firefox throws a security error on an offsite Flash object loaded into a dynamically created iFrame.
    // Even though the iframe was inserted into a page on the web, Firefox + Flash considers it a local app trying to access an internet file.
    // I tried mulitple ways of setting the iframe src attribute but couldn't find a src that worked well. Tried a real/fake source, in/out of domain.
    // Also tried a method from stackoverflow that caused a security error in all browsers. http://stackoverflow.com/questions/2486901/how-to-set-document-domain-for-a-dynamically-generated-iframe
    // In the end the solution I found to work was setting the iframe window.location.href right before doing a document.write of the Flash object.
    // The only downside of this it seems to trigger another http request to the original page (no matter what's put in the href). Not sure why that is.

    // NOTE (2012-01-29): Cannot get Firefox to load the remote hosted SWF into a dynamically created iFrame
    // Firefox 9 throws a security error, unleess you call location.href right before doc.write.
    //    Not sure why that even works, but it causes the browser to look like it's continuously trying to load the page.
    // Firefox 3.6 keeps calling the iframe onload function anytime I write to it, causing an endless loop.

    if (options.iFrameMode == true && !_V_.isFF) {

      // Create iFrame with vjs-tech class so it's 100% width/height
      var iFrm = _V_.createElement("iframe", {
        id: objId + "_iframe",
        name: objId + "_iframe",
        className: "vjs-tech",
        scrolling: "no",
        marginWidth: 0,
        marginHeight: 0,
        frameBorder: 0
      });

      // Update ready function names in flash vars for iframe window
      flashVars.readyFunction = "ready";
      flashVars.eventProxyFunction = "events";
      flashVars.errorEventProxyFunction = "errors";

      // Tried multiple methods to get this to work in all browsers

      // Tried embedding the flash object in the page first, and then adding a place holder to the iframe, then replacing the placeholder with the page object.
      // The goal here was to try to load the swf URL in the parent page first and hope that got around the firefox security error
      // var newObj = _V_.flash.embed(options.swf, placeHolder, flashVars, params, attributes);
      // (in onload)
      //  var temp = _V_.createElement("a", { id:"asdf", innerHTML: "asdf" } );
      //  iDoc.body.appendChild(temp);

      // Tried embedding the flash object through javascript in the iframe source.
      // This works in webkit but still triggers the firefox security error
      // iFrm.src = "javascript: document.write('"+_V_.flash.getEmbedCode(options.swf, flashVars, params, attributes)+"');";

      // Tried an actual local iframe just to make sure that works, but it kills the easiness of the CDN version if you require the user to host an iframe
      // We should add an option to host the iframe locally though, because it could help a lot of issues.
      // iFrm.src = "iframe.html";

      // Wait until iFrame has loaded to write into it.
      _V_.addEvent(iFrm, "load", _V_.proxy(this, function(){

        var iDoc, objTag, swfLoc,
            iWin = iFrm.contentWindow,
            varString = "";


        // The one working method I found was to use the iframe's document.write() to create the swf object
        // This got around the security issue in all browsers except firefox.
        // I did find a hack where if I call the iframe's window.location.href="", it would get around the security error
        // However, the main page would look like it was loading indefinitely (URL bar loading spinner would never stop)
        // Plus Firefox 3.6 didn't work no matter what I tried.
        // if (_V_.ua.match("Firefox")) {
        //   iWin.location.href = "";
        // }

        // Get the iFrame's document depending on what the browser supports
        iDoc = iFrm.contentDocument ? iFrm.contentDocument : iFrm.contentWindow.document;

        // Tried ensuring both document domains were the same, but they already were, so that wasn't the issue.
        // Even tried adding /. that was mentioned in a browser security writeup
        // document.domain = document.domain+"/.";
        // iDoc.domain = document.domain+"/.";

        // Tried adding the object to the iframe doc's innerHTML. Security error in all browsers.
        // iDoc.body.innerHTML = swfObjectHTML;

        // Tried appending the object to the iframe doc's body. Security error in all browsers.
        // iDoc.body.appendChild(swfObject);

        // Using document.write actually got around the security error that browsers were throwing.
        // Again, it's a dynamically generated (same domain) iframe, loading an external Flash swf.
        // Not sure why that's a security issue, but apparently it is.
        iDoc.write(_V_.flash.getEmbedCode(options.swf, flashVars, params, attributes));

        // Setting variables on the window needs to come after the doc write because otherwise they can get reset in some browsers
        // So far no issues with swf ready event being called before it's set on the window.
        iWin.player = this.player;

        // Create swf ready function for iFrame window
        iWin.ready = _V_.proxy(this.player, function(currSwf){
          var el = iDoc.getElementById(currSwf),
              player = this,
              tech = player.tech;

          // Update reference to playback technology element
          tech.el = el;

          // Now that the element is ready, make a click on the swf play the video
          _V_.addEvent(el, "click", tech.proxy(tech.onClick));

          // Make sure swf is actually ready. Sometimes the API isn't actually yet.
          _V_.flash.checkReady(tech);
        });

        // Create event listener for all swf events
        iWin.events = _V_.proxy(this.player, function(swfID, eventName, other){
          var player = this;
          if (player && player.techName == "flash") {
            player.triggerEvent(eventName);
          }
        });

        // Create error listener for all swf errors
        iWin.errors = _V_.proxy(this.player, function(swfID, eventName){
          _V_.log("Flash Error", eventName);
        });

      }));

      // Replace placeholder with iFrame (it will load now)
      placeHolder.parentNode.replaceChild(iFrm, placeHolder);

    // If not using iFrame mode, embed as normal object
    } else {
      _V_.flash.embed(options.swf, placeHolder, flashVars, params, attributes);
    }
  },

  destroy: function(){
    this.el.parentNode.removeChild(this.el);
  },

  // setupTriggers: function(){}, // Using global onEvent func to distribute events

  play: function(){ this.el.vjs_play(); },
  pause: function(){ this.el.vjs_pause(); },
  src: function(src){
    // Make sure source URL is abosolute.
    src = _V_.getAbsoluteURL(src);

    this.el.vjs_src(src);

    // Currently the SWF doesn't autoplay if you load a source later.
    // e.g. Load player w/ no source, wait 2s, set src.
    if (this.player.autoplay()) {
      var tech = this;
      setTimeout(function(){ tech.play(); }, 0);
    }
  },
  load: function(){ this.el.vjs_load(); },
  poster: function(){ this.el.vjs_getProperty("poster"); },

  buffered: function(){
    return _V_.createTimeRange(0, this.el.vjs_getProperty("buffered"));
  },

  supportsFullScreen: function(){
    return false; // Flash does not allow fullscreen through javascript
  },
  enterFullScreen: function(){
    return false;
  }
});

// Create setters and getters for attributes
(function(){

  var api = _V_.flash.prototype,
      readWrite = "preload,currentTime,defaultPlaybackRate,playbackRate,autoplay,loop,mediaGroup,controller,controls,volume,muted,defaultMuted".split(","),
      readOnly = "error,currentSrc,networkState,readyState,seeking,initialTime,duration,startOffsetTime,paused,played,seekable,ended,videoTracks,audioTracks,videoWidth,videoHeight,textTracks".split(","),
      callOnly = "load,play,pause".split(",");
      // Overridden: buffered

      createSetter = function(attr){
        var attrUpper = attr.charAt(0).toUpperCase() + attr.slice(1);
        api["set"+attrUpper] = function(val){ return this.el.vjs_setProperty(attr, val); };
      },

      createGetter = function(attr){
        api[attr] = function(){ return this.el.vjs_getProperty(attr); };
      }
  ;

  // Create getter and setters for all read/write attributes
  _V_.each(readWrite, function(attr){
    createGetter(attr);
    createSetter(attr);
  });

  // Create getters for read-only attributes
  _V_.each(readOnly, function(attr){
    createGetter(attr);
  });

})();

/* Flash Support Testing -------------------------------------------------------- */

_V_.flash.isSupported = function(){
  return _V_.flash.version()[0] >= 10;
  // return swfobject.hasFlashPlayerVersion("10");
};

_V_.flash.canPlaySource = function(srcObj){
  if (srcObj.type in _V_.flash.prototype.support.formats) { return "maybe"; }
};

_V_.flash.prototype.support = {
  formats: {
    "video/flv": "FLV",
    "video/x-flv": "FLV",
    "video/mp4": "MP4",
    "video/m4v": "MP4"
  },

  // Optional events that we can manually mimic with timers
  progressEvent: false,
  timeupdateEvent: false,

  // Resizing plugins using request fullscreen reloads the plugin
  fullscreenResize: false,

  // Resizing plugins in Firefox always reloads the plugin (e.g. full window mode)
  parentResize: !(_V_.ua.match("Firefox"))
};

_V_.flash.onReady = function(currSwf){

  var el = _V_.el(currSwf);

  // Get player from box
  // On firefox reloads, el might already have a player
  var player = el.player || el.parentNode.player,
      tech = player.tech;

  // Reference player on tech element
  el.player = player;

  // Update reference to playback technology element
  tech.el = el;

  // Now that the element is ready, make a click on the swf play the video
  tech.addEvent("click", tech.onClick);

  _V_.flash.checkReady(tech);
};

// The SWF isn't alwasy ready when it says it is. Sometimes the API functions still need to be added to the object.
// If it's not ready, we set a timeout to check again shortly.
_V_.flash.checkReady = function(tech){

  // Check if API property exists
  if (tech.el.vjs_getProperty) {

    // If so, tell tech it's ready
    tech.triggerReady();

  // Otherwise wait longer.
  } else {

    setTimeout(function(){
      _V_.flash.checkReady(tech);
    }, 50);

  }
};

// Trigger events from the swf on the player
_V_.flash.onEvent = function(swfID, eventName){
  var player = _V_.el(swfID).player;
  player.triggerEvent(eventName);
};

// Log errors from the swf
_V_.flash.onError = function(swfID, err){
  var player = _V_.el(swfID).player;
  player.triggerEvent("error");
  _V_.log("Flash Error", err, swfID);
};

// Flash Version Check
_V_.flash.version = function(){
  var version = '0,0,0'

  // IE
  try {
    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];

  // other browsers
  } catch(e) {
    try {
      if (navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
        version = (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
      }
    } catch(e) {}
  }
  return version.split(",");
}

// Flash embedding method. Only used in non-iframe mode
_V_.flash.embed = function(swf, placeHolder, flashVars, params, attributes){
  var code = _V_.flash.getEmbedCode(swf, flashVars, params, attributes),

      // Get element by embedding code and retrieving created element
      obj = _V_.createElement("div", { innerHTML: code }).childNodes[0],

      par = placeHolder.parentNode
  ;

  placeHolder.parentNode.replaceChild(obj, placeHolder);

  // IE6 seems to have an issue where it won't initialize the swf object after injecting it.
  // This is a dumb temporary fix
  if (_V_.isIE()) {
    var newObj = par.childNodes[0];
    setTimeout(function(){
      newObj.style.display = "block";
    }, 1000);
  }

  return obj;

};

_V_.flash.getEmbedCode = function(swf, flashVars, params, attributes){

  var objTag = '<object type="application/x-shockwave-flash"',
      flashVarsString = '',
      paramsString = ''
      attrsString = '';

  // Convert flash vars to string
  if (flashVars) {
    _V_.eachProp(flashVars, function(key, val){
      flashVarsString += (key + "=" + val + "&amp;");
    });
  }

  // Add swf, flashVars, and other default params
  params = _V_.merge({
    movie: swf,
    flashvars: flashVarsString,
    allowScriptAccess: "always", // Required to talk to swf
    allowNetworking: "all" // All should be default, but having security issues.
  }, params);

  // Create param tags string
  _V_.eachProp(params, function(key, val){
    paramsString += '<param name="'+key+'" value="'+val+'" />';
  });

  attributes = _V_.merge({
    // Add swf to attributes (need both for IE and Others to work)
    data: swf,

    // Default to 100% width/height
    width: "100%",
    height: "100%"

  }, attributes);

  // Create Attributes string
  _V_.eachProp(attributes, function(key, val){
    attrsString += (key + '="' + val + '" ');
  });

  return objTag + attrsString + '>' + paramsString + '</object>';
}
// TEXT TRACKS
// Text tracks are tracks of timed text events.
//    Captions - text displayed over the video for the hearing impared
//    Subtitles - text displayed over the video for those who don't understand langauge in the video
//    Chapters - text displayed in a menu allowing the user to jump to particular points (chapters) in the video
//    Descriptions (not supported yet) - audio descriptions that are read back to the user by a screen reading device

// Player Track Functions - Functions add to the player object for easier access to tracks
_V_.merge(_V_.Player.prototype, {

  // Add an array of text tracks. captions, subtitles, chapters, descriptions
  // Track objects will be stored in the player.textTracks array
  addTextTracks: function(trackObjects){
    var tracks = this.textTracks = (this.textTracks) ? this.textTracks : [],
        i = 0, j = trackObjects.length, track, Kind;

    for (;i<j;i++) {
      // HTML5 Spec says default to subtitles.
      // Uppercase (uc) first letter to match class names
      Kind = _V_.uc(trackObjects[i].kind || "subtitles");

      // Create correct texttrack class. CaptionsTrack, etc.
      track = new _V_[Kind + "Track"](this, trackObjects[i]);

      tracks.push(track);

      // If track.default is set, start showing immediately
      // TODO: Add a process to deterime the best track to show for the specific kind
      // Incase there are mulitple defaulted tracks of the same kind
      // Or the user has a set preference of a specific language that should override the default
      if (track['default']) {
        this.ready(_V_.proxy(track, track.show));
      }
    }

    // Return the track so it can be appended to the display component
    return this;
  },

  // Show a text track
  // disableSameKind: disable all other tracks of the same kind. Value should be a track kind (captions, etc.)
  showTextTrack: function(id, disableSameKind){
    var tracks = this.textTracks,
        i = 0,
        j = tracks.length,
        track, showTrack, kind;

    // Find Track with same ID
    for (;i<j;i++) {
      track = tracks[i];
      if (track.id === id) {
        track.show();
        showTrack = track;

      // Disable tracks of the same kind
      } else if (disableSameKind && track.kind == disableSameKind && track.mode > 0) {
        track.disable();
      }
    }

    // Get track kind from shown track or disableSameKind
    kind = (showTrack) ? showTrack.kind : ((disableSameKind) ? disableSameKind : false);

    // Trigger trackchange event, captionstrackchange, subtitlestrackchange, etc.
    if (kind) {
      this.triggerEvent(kind+"trackchange");
    }

    return this;
  }

});

// Track Class
// Contains track methods for loading, showing, parsing cues of tracks
_V_.Track = _V_.Component.extend({

  init: function(player, options){
    this._super(player, options);

    // Apply track info to track object
    // Options will often be a track element
    _V_.merge(this, {
      // Build ID if one doesn't exist
      id: options.id || ("vjs_" + options.kind + "_" + options.language + "_" + _V_.guid++),

      src: options.src,

      // If default is used, subtitles/captions to start showing
      "default": options["default"], // 'default' is reserved-ish
      title: options.title,

      // Language - two letter string to represent track language, e.g. "en" for English
      // readonly attribute DOMString language;
      language: options.srclang,

      // Track label e.g. "English"
      // readonly attribute DOMString label;
      label: options.label,

      // All cues of the track. Cues have a startTime, endTime, text, and other properties.
      // readonly attribute TextTrackCueList cues;
      cues: [],

      // ActiveCues is all cues that are currently showing
      // readonly attribute TextTrackCueList activeCues;
      activeCues: [],

      // ReadyState describes if the text file has been loaded
      // const unsigned short NONE = 0;
      // const unsigned short LOADING = 1;
      // const unsigned short LOADED = 2;
      // const unsigned short ERROR = 3;
      // readonly attribute unsigned short readyState;
      readyState: 0,

      // Mode describes if the track is showing, hidden, or disabled
      // const unsigned short OFF = 0;
      // const unsigned short HIDDEN = 1; (still triggering cuechange events, but not visible)
      // const unsigned short SHOWING = 2;
      // attribute unsigned short mode;
      mode: 0
    });
  },

  // Create basic div to hold cue text
  createElement: function(){
    return this._super("div", {
      className: "vjs-" + this.kind + " vjs-text-track"
    });
  },

  // Show: Mode Showing (2)
  // Indicates that the text track is active. If no attempt has yet been made to obtain the track's cues, the user agent will perform such an attempt momentarily.
  // The user agent is maintaining a list of which cues are active, and events are being fired accordingly.
  // In addition, for text tracks whose kind is subtitles or captions, the cues are being displayed over the video as appropriate;
  // for text tracks whose kind is descriptions, the user agent is making the cues available to the user in a non-visual fashion;
  // and for text tracks whose kind is chapters, the user agent is making available to the user a mechanism by which the user can navigate to any point in the media resource by selecting a cue.
  // The showing by default state is used in conjunction with the default attribute on track elements to indicate that the text track was enabled due to that attribute.
  // This allows the user agent to override the state if a later track is discovered that is more appropriate per the user's preferences.
  show: function(){
    this.activate();

    this.mode = 2;

    // Show element.
    this._super();
  },

  // Hide: Mode Hidden (1)
  // Indicates that the text track is active, but that the user agent is not actively displaying the cues.
  // If no attempt has yet been made to obtain the track's cues, the user agent will perform such an attempt momentarily.
  // The user agent is maintaining a list of which cues are active, and events are being fired accordingly.
  hide: function(){
    // When hidden, cues are still triggered. Disable to stop triggering.
    this.activate();

    this.mode = 1;

    // Hide element.
    this._super();
  },

  // Disable: Mode Off/Disable (0)
  // Indicates that the text track is not active. Other than for the purposes of exposing the track in the DOM, the user agent is ignoring the text track.
  // No cues are active, no events are fired, and the user agent will not attempt to obtain the track's cues.
  disable: function(){
    // If showing, hide.
    if (this.mode == 2) { this.hide(); }

    // Stop triggering cues
    this.deactivate();

    // Switch Mode to Off
    this.mode = 0;
  },

  // Turn on cue tracking. Tracks that are showing OR hidden are active.
  activate: function(){
    // Load text file if it hasn't been yet.
    if (this.readyState == 0) { this.load(); }

    // Only activate if not already active.
    if (this.mode == 0) {
      // Update current cue on timeupdate
      // Using unique ID for proxy function so other tracks don't remove listener
      this.player.addEvent("timeupdate", this.proxy(this.update, this.id));

      // Reset cue time on media end
      this.player.addEvent("ended", this.proxy(this.reset, this.id));

      // Add to display
      if (this.kind == "captions" || this.kind == "subtitles") {
        this.player.textTrackDisplay.addComponent(this);
      }
    }
  },

  // Turn off cue tracking.
  deactivate: function(){
    // Using unique ID for proxy function so other tracks don't remove listener
    this.player.removeEvent("timeupdate", this.proxy(this.update, this.id));
    this.player.removeEvent("ended", this.proxy(this.reset, this.id));
    this.reset(); // Reset

    // Remove from display
    this.player.textTrackDisplay.removeComponent(this);
  },

  // A readiness state
  // One of the following:
  //
  // Not loaded
  // Indicates that the text track is known to exist (e.g. it has been declared with a track element), but its cues have not been obtained.
  //
  // Loading
  // Indicates that the text track is loading and there have been no fatal errors encountered so far. Further cues might still be added to the track.
  //
  // Loaded
  // Indicates that the text track has been loaded with no fatal errors. No new cues will be added to the track except if the text track corresponds to a MutableTextTrack object.
  //
  // Failed to load
  // Indicates that the text track was enabled, but when the user agent attempted to obtain it, this failed in some way (e.g. URL could not be resolved, network error, unknown text track format). Some or all of the cues are likely missing and will not be obtained.
  load: function(){

    // Only load if not loaded yet.
    if (this.readyState == 0) {
      this.readyState = 1;
      _V_.get(this.src, this.proxy(this.parseCues), this.proxy(this.onError));
    }

  },

  onError: function(err){
    this.error = err;
    this.readyState = 3;
    this.triggerEvent("error");
  },

  // Parse the WebVTT text format for cue times.
  // TODO: Separate parser into own class so alternative timed text formats can be used. (TTML, DFXP)
  parseCues: function(srcContent) {
    var cue, time, text,
        lines = srcContent.split("\n"),
        line = "", id;

    for (var i=1, j=lines.length; i<j; i++) {
      // Line 0 should be 'WEBVTT', so skipping i=0

      line = _V_.trim(lines[i]); // Trim whitespace and linebreaks

      if (line) { // Loop until a line with content

        // First line could be an optional cue ID
        // Check if line has the time separator
        if (line.indexOf("-->") == -1) {
          id = line;
          // Advance to next line for timing.
          line = _V_.trim(lines[++i]);
        } else {
          id = this.cues.length;
        }

        // First line - Number
        cue = {
          id: id, // Cue Number
          index: this.cues.length // Position in Array
        };

        // Timing line
        time = line.split(" --> ");
        cue.startTime = this.parseCueTime(time[0]);
        cue.endTime = this.parseCueTime(time[1]);

        // Additional lines - Cue Text
        text = [];

        // Loop until a blank line or end of lines
        // Assumeing trim("") returns false for blank lines
        while (lines[++i] && (line = _V_.trim(lines[i]))) {
          text.push(line);
        }

        cue.text = text.join('<br/>');

        // Add this cue
        this.cues.push(cue);
      }
    }

    this.readyState = 2;
    this.triggerEvent("loaded");
  },

  parseCueTime: function(timeText) {
    var parts = timeText.split(':'),
        time = 0,
        hours, minutes, other, seconds, ms, flags;

    // Check if optional hours place is included
    // 00:00:00.000 vs. 00:00.000
    if (parts.length == 3) {
      hours = parts[0];
      minutes = parts[1];
      other = parts[2];
    } else {
      hours = 0;
      minutes = parts[0];
      other = parts[1];
    }

    // Break other (seconds, milliseconds, and flags) by spaces
    // TODO: Make additional cue layout settings work with flags
    other = other.split(/\s+/)
    // Remove seconds. Seconds is the first part before any spaces.
    seconds = other.splice(0,1)[0];
    // Could use either . or , for decimal
    seconds = seconds.split(/\.|,/);
    // Get milliseconds
    ms = parseFloat(seconds[1]);
    seconds = seconds[0];

    // hours => seconds
    time += parseFloat(hours) * 3600;
    // minutes => seconds
    time += parseFloat(minutes) * 60;
    // Add seconds
    time += parseFloat(seconds);
    // Add milliseconds
    if (ms) { time += ms/1000; }

    return time;
  },

  // Update active cues whenever timeupdate events are triggered on the player.
  update: function(){
    if (this.cues.length > 0) {

      // Get curent player time
      var time = this.player.currentTime();

      // Check if the new time is outside the time box created by the the last update.
      if (this.prevChange === undefined || time < this.prevChange || this.nextChange <= time) {
        var cues = this.cues,

            // Create a new time box for this state.
            newNextChange = this.player.duration(), // Start at beginning of the timeline
            newPrevChange = 0, // Start at end

            reverse = false, // Set the direction of the loop through the cues. Optimized the cue check.
            newCues = [], // Store new active cues.

            // Store where in the loop the current active cues are, to provide a smart starting point for the next loop.
            firstActiveIndex, lastActiveIndex,

            html = "", // Create cue text HTML to add to the display
            cue, i, j; // Loop vars

        // Check if time is going forwards or backwards (scrubbing/rewinding)
        // If we know the direction we can optimize the starting position and direction of the loop through the cues array.
        if (time >= this.nextChange || this.nextChange === undefined) { // NextChange should happen
          // Forwards, so start at the index of the first active cue and loop forward
          i = (this.firstActiveIndex !== undefined) ? this.firstActiveIndex : 0;
        } else {
          // Backwards, so start at the index of the last active cue and loop backward
          reverse = true;
          i = (this.lastActiveIndex !== undefined) ? this.lastActiveIndex : cues.length - 1;
        }

        while (true) { // Loop until broken
          cue = cues[i];

          // Cue ended at this point
          if (cue.endTime <= time) {
            newPrevChange = Math.max(newPrevChange, cue.endTime);

            if (cue.active) {
              cue.active = false;
            }

            // No earlier cues should have an active start time.
            // Nevermind. Assume first cue could have a duration the same as the video.
            // In that case we need to loop all the way back to the beginning.
            // if (reverse && cue.startTime) { break; }

          // Cue hasn't started
          } else if (time < cue.startTime) {
            newNextChange = Math.min(newNextChange, cue.startTime);

            if (cue.active) {
              cue.active = false;
            }

            // No later cues should have an active start time.
            if (!reverse) { break; }

          // Cue is current
          } else {

            if (reverse) {
              // Add cue to front of array to keep in time order
              newCues.splice(0,0,cue);

              // If in reverse, the first current cue is our lastActiveCue
              if (lastActiveIndex === undefined) { lastActiveIndex = i; }
              firstActiveIndex = i;
            } else {
              // Add cue to end of array
              newCues.push(cue);

              // If forward, the first current cue is our firstActiveIndex
              if (firstActiveIndex === undefined) { firstActiveIndex = i; }
              lastActiveIndex = i;
            }

            newNextChange = Math.min(newNextChange, cue.endTime);
            newPrevChange = Math.max(newPrevChange, cue.startTime);

            cue.active = true;
          }

          if (reverse) {
            // Reverse down the array of cues, break if at first
            if (i === 0) { break; } else { i--; }
          } else {
            // Walk up the array fo cues, break if at last
            if (i === cues.length - 1) { break; } else { i++; }
          }

        }

        this.activeCues = newCues;
        this.nextChange = newNextChange;
        this.prevChange = newPrevChange;
        this.firstActiveIndex = firstActiveIndex;
        this.lastActiveIndex = lastActiveIndex;

        this.updateDisplay();

        this.triggerEvent("cuechange");
      }
    }
  },

  // Add cue HTML to display
  updateDisplay: function(){
    var cues = this.activeCues,
        html = "",
        i=0,j=cues.length;

    for (;i<j;i++) {
      html += "<span class='vjs-tt-cue'>"+cues[i].text+"</span>";
    }

    this.el.innerHTML = html;
  },

  // Set all loop helper values back
  reset: function(){
    this.nextChange = 0;
    this.prevChange = this.player.duration();
    this.firstActiveIndex = 0;
    this.lastActiveIndex = 0;
  }

});

// Create specific track types
_V_.CaptionsTrack = _V_.Track.extend({
  kind: "captions"
});

_V_.SubtitlesTrack = _V_.Track.extend({
  kind: "subtitles"
});

_V_.ChaptersTrack = _V_.Track.extend({
  kind: "chapters"
});


/* Text Track Display
================================================================================ */
// Global container for both subtitle and captions text. Simple div container.
_V_.TextTrackDisplay = _V_.Component.extend({

  createElement: function(){
    return this._super("div", {
      className: "vjs-text-track-display"
    });
  }

});

/* Text Track Menu Items
================================================================================ */
_V_.TextTrackMenuItem = _V_.MenuItem.extend({

  init: function(player, options){
    var track = this.track = options.track;

    // Modify options for parent MenuItem class's init.
    options.label = track.label;
    options.selected = track["default"];
    this._super(player, options);

    this.player.addEvent(track.kind + "trackchange", _V_.proxy(this, this.update));
  },

  onClick: function(){
    this._super();
    this.player.showTextTrack(this.track.id, this.track.kind);
  },

  update: function(){
    if (this.track.mode == 2) {
      this.selected(true);
    } else {
      this.selected(false);
    }
  }

});

_V_.OffTextTrackMenuItem = _V_.TextTrackMenuItem.extend({

  init: function(player, options){
    // Create pseudo track info
    // Requires options.kind
    options.track = { kind: options.kind, player: player, label: "Off" }
    this._super(player, options);
  },

  onClick: function(){
    this._super();
    this.player.showTextTrack(this.track.id, this.track.kind);
  },

  update: function(){
    var tracks = this.player.textTracks,
        i=0, j=tracks.length, track,
        off = true;

    for (;i<j;i++) {
      track = tracks[i];
      if (track.kind == this.track.kind && track.mode == 2) {
        off = false;
      }
    }

    if (off) {
      this.selected(true);
    } else {
      this.selected(false);
    }
  }

});

/* Captions Button
================================================================================ */
_V_.TextTrackButton = _V_.Button.extend({

  init: function(player, options){
    this._super(player, options);

    this.menu = this.createMenu();

    if (this.items.length === 0) {
      this.hide();
    }
  },

  createMenu: function(){
    var menu = new _V_.Menu(this.player);

    // Add a title list item to the top
    menu.el.appendChild(_V_.createElement("li", {
      className: "vjs-menu-title",
      innerHTML: _V_.uc(this.kind)
    }));

    // Add an OFF menu item to turn all tracks off
    menu.addItem(new _V_.OffTextTrackMenuItem(this.player, { kind: this.kind }))

    this.items = this.createItems();

    // Add menu items to the menu
    this.each(this.items, function(item){
      menu.addItem(item);
    });

    // Add list to element
    this.addComponent(menu);

    return menu;
  },

  // Create a menu item for each text track
  createItems: function(){
    var items = [];
    this.each(this.player.textTracks, function(track){
      if (track.kind === this.kind) {
        items.push(new _V_.TextTrackMenuItem(this.player, {
          track: track
        }));
      }
    });
    return items;
  },

  buildCSSClass: function(){
    return this.className + " vjs-menu-button " + this._super();
  },

  // Focus - Add keyboard functionality to element
  onFocus: function(){
    // Show the menu, and keep showing when the menu items are in focus
    this.menu.lockShowing();
    // this.menu.el.style.display = "block";

    // When tabbing through, the menu should hide when focus goes from the last menu item to the next tabbed element.
    _V_.one(this.menu.el.childNodes[this.menu.el.childNodes.length - 1], "blur", this.proxy(function(){
      this.menu.unlockShowing();
    }));
  },
  // Can't turn off list display that we turned on with focus, because list would go away.
  onBlur: function(){},

  onClick: function(){
    // When you click the button it adds focus, which will show the menu indefinitely.
    // So we'll remove focus when the mouse leaves the button.
    // Focus is needed for tab navigation.
    this.one("mouseout", this.proxy(function(){
      this.menu.unlockShowing();
      this.el.blur();
    }));
  }

});

_V_.CaptionsButton = _V_.TextTrackButton.extend({
  kind: "captions",
  buttonText: "Captions",
  className: "vjs-captions-button"
});

_V_.SubtitlesButton = _V_.TextTrackButton.extend({
  kind: "subtitles",
  buttonText: "Subtitles",
  className: "vjs-subtitles-button"
});

// Chapters act much differently than other text tracks
// Cues are navigation vs. other tracks of alternative languages
_V_.ChaptersButton = _V_.TextTrackButton.extend({
  kind: "chapters",
  buttonText: "Chapters",
  className: "vjs-chapters-button",

  // Create a menu item for each text track
  createItems: function(chaptersTrack){
    var items = [];

    this.each(this.player.textTracks, function(track){
      if (track.kind === this.kind) {
        items.push(new _V_.TextTrackMenuItem(this.player, {
          track: track
        }));
      }
    });

    return items;
  },

  createMenu: function(){
    var tracks = this.player.textTracks,
        i = 0,
        j = tracks.length,
        track, chaptersTrack,
        items = this.items = [];

    for (;i<j;i++) {
      track = tracks[i];
      if (track.kind == this.kind && track["default"]) {
        if (track.readyState < 2) {
          this.chaptersTrack = track;
          track.addEvent("loaded", this.proxy(this.createMenu));
          return;
        } else {
          chaptersTrack = track;
          break;
        }
      }
    }

    var menu = this.menu = new _V_.Menu(this.player);

    menu.el.appendChild(_V_.createElement("li", {
      className: "vjs-menu-title",
      innerHTML: _V_.uc(this.kind)
    }));

    if (chaptersTrack) {
      var cues = chaptersTrack.cues,
          i = 0, j = cues.length, cue, mi;

      for (;i<j;i++) {
        cue = cues[i];

        mi = new _V_.ChaptersTrackMenuItem(this.player, {
          track: chaptersTrack,
          cue: cue
        });

        items.push(mi);

        menu.addComponent(mi);
      }
    }

    // Add list to element
    this.addComponent(menu);

    if (this.items.length > 0) {
      this.show();
    }

    return menu;
  }

});

_V_.ChaptersTrackMenuItem = _V_.MenuItem.extend({

  init: function(player, options){
    var track = this.track = options.track,
        cue = this.cue = options.cue,
        currentTime = player.currentTime();

    // Modify options for parent MenuItem class's init.
    options.label = cue.text;
    options.selected = (cue.startTime <= currentTime && currentTime < cue.endTime);
    this._super(player, options);

    track.addEvent("cuechange", _V_.proxy(this, this.update));
  },

  onClick: function(){
    this._super();
    this.player.currentTime(this.cue.startTime);
    this.update(this.cue.startTime);
  },

  update: function(time){
    var cue = this.cue,
        currentTime = this.player.currentTime();

    // _V_.log(currentTime, cue.startTime);
    if (cue.startTime <= currentTime && currentTime < cue.endTime) {
      this.selected(true);
    } else {
      this.selected(false);
    }
  }

});

// Add Buttons to controlBar
_V_.merge(_V_.ControlBar.prototype.options.components, {
  "subtitlesButton": {},
  "captionsButton": {},
  "chaptersButton": {}
});

// _V_.Cue = _V_.Component.extend({
//   init: function(player, options){
//     this._super(player, options);
//   }
// });// Automatically set up any tags that have a data-setup attribute
_V_.autoSetup = function(){
  var options, vid, player,
      vids = document.getElementsByTagName("video");

  // Check if any media elements exist
  if (vids && vids.length > 0) {

    for (var i=0,j=vids.length; i<j; i++) {
      vid = vids[i];

      // Check if element exists, has getAttribute func.
      // IE seems to consider typeof el.getAttribute == "object" instead of "function" like expected, at least when loading the player immediately.
      if (vid && vid.getAttribute) {

        // Make sure this player hasn't already been set up.
        if (vid.player === undefined) {
          options = vid.getAttribute("data-setup");

          // Check if data-setup attr exists.
          // We only auto-setup if they've added the data-setup attr.
          if (options !== null) {

            // Parse options JSON
            // If empty string, make it a parsable json object.
            options = JSON.parse(options || "{}");

            // Create new video.js instance.
            player = _V_(vid, options);
          }
        }

      // If getAttribute isn't defined, we need to wait for the DOM.
      } else {
        _V_.autoSetupTimeout(1);
        break;
      }
    }

  // No videos were found, so keep looping unless page is finisehd loading.
  } else if (!_V_.windowLoaded) {
    _V_.autoSetupTimeout(1);
  }
};

// Pause to let the DOM keep processing
_V_.autoSetupTimeout = function(wait){
  setTimeout(_V_.autoSetup, wait);
};

_V_.addEvent(window, "load", function(){
  _V_.windowLoaded = true;
});

// Run Auto-load players
_V_.autoSetup();
// Expose to global
window.VideoJS = window._V_ = VideoJS;

// End self-executing function
})(window);

// moment.js
// version : 1.7.2
// author : Tim Wood
// license : MIT
// momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "1.7.2",
        round = Math.round, i,
        // internal storage for language config files
        languages = {},
        currentLanguage = 'en',

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),

        // Parameters to check for on the lang config.  This list of properties
        // will be inherited from English if not provided in a language
        // definition.  monthsParse is also a lang config property, but it
        // cannot be inherited and as such cannot be enumerated here.
        langConfigProperties = 'months|monthsShort|weekdays|weekdaysShort|weekdaysMin|longDateFormat|calendar|relativeTime|ordinal|meridiem'.split('|'),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?)/g,

        // parsing tokens
        parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenWord = /[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i, // any word characters or numbers
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO seperator)

        // preliminary iso regex
        // 0000-00-00 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000
        isoRegex = /^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,
        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.S', /T\d\d:\d\d:\d\d\.\d{1,3}/],
            ['HH:mm:ss', /T\d\d:\d\d:\d\d/],
            ['HH:mm', /T\d\d:\d\d/],
            ['HH', /T\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Month|Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        // format function strings
        formatFunctions = {},

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w M D d'.split(' '),
        paddedTokens = 'M D H h m s w'.split(' '),

        /*
         * moment.fn.format uses new Function() to create an inlined formatting function.
         * Results are a 3x speed boost
         * http://jsperf.com/momentjs-cached-format-functions
         *
         * These strings are appended into a function using replaceFormatTokens and makeFormatFunction
         */
        formatTokenFunctions = {
            // a = placeholder
            // b = placeholder
            // t = the current moment being formatted
            // v = getValueAtKey function
            // o = language.ordinal function
            // p = leftZeroFill function
            // m = language.meridiem value or function
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return getValueFromArray("monthsShort", this.month(), this, format);
            },
            MMMM : function (format) {
                return getValueFromArray("months", this.month(), this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                var a = new Date(this.year(), this.month(), this.date()),
                    b = new Date(this.year(), 0, 1);
                return ~~(((a - b) / 864e5) + 1.5);
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return getValueFromArray("weekdaysMin", this.day(), this, format);
            },
            ddd  : function (format) {
                return getValueFromArray("weekdaysShort", this.day(), this, format);
            },
            dddd : function (format) {
                return getValueFromArray("weekdays", this.day(), this, format);
            },
            w    : function () {
                var a = new Date(this.year(), this.month(), this.date() - this.day() + 5),
                    b = new Date(a.getFullYear(), 0, 4);
                return ~~((a - b) / 864e5 / 7 + 1.5);
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return ~~(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(~~(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(~~(a / 60), 2) + ":" + leftZeroFill(~~a % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(~~(10 * a / 6), 4);
            }
        };

    function getValueFromArray(key, index, m, format) {
        var lang = m.lang();
        return lang[key].call ? lang[key](m, format) : lang[key][index];
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func) {
        return function (a) {
            var b = func.call(this, a);
            return b + this.lang().ordinal(b);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i]);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/


    // Moment prototype object
    function Moment(date, isUTC, lang) {
        this._d = date;
        this._isUTC = !!isUTC;
        this._a = date._a || null;
        this._lang = lang || false;
    }

    // Duration Constructor
    function Duration(duration) {
        var data = this._data = {},
            years = duration.years || duration.y || 0,
            months = duration.months || duration.M || 0,
            weeks = duration.weeks || duration.w || 0,
            days = duration.days || duration.d || 0,
            hours = duration.hours || duration.h || 0,
            minutes = duration.minutes || duration.m || 0,
            seconds = duration.seconds || duration.s || 0,
            milliseconds = duration.milliseconds || duration.ms || 0;

        // representation for dateAddRemove
        this._milliseconds = milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = months +
            years * 12;

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;
        seconds += absRound(milliseconds / 1000);

        data.seconds = seconds % 60;
        minutes += absRound(seconds / 60);

        data.minutes = minutes % 60;
        hours += absRound(minutes / 60);

        data.hours = hours % 24;
        days += absRound(hours / 24);

        days += weeks * 7;
        data.days = days % 30;

        months += absRound(days / 30);

        data.months = months % 12;
        years += absRound(months / 12);

        data.years = years;

        this._lang = false;
    }


    /************************************
        Helpers
    ************************************/


    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding) {
        var ms = duration._milliseconds,
            d = duration._days,
            M = duration._months,
            currentDate;

        if (ms) {
            mom._d.setTime(+mom + ms * isAdding);
        }
        if (d) {
            mom.date(mom.date() + d * isAdding);
        }
        if (M) {
            currentDate = mom.date();
            mom.date(1)
                .month(mom.month() + M * isAdding)
                .date(Math.min(currentDate, mom.daysInMonth()));
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if (~~array1[i] !== ~~array2[i]) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromArray(input, asUTC, hoursOffset, minutesOffset) {
        var i, date, forValid = [];
        for (i = 0; i < 7; i++) {
            forValid[i] = input[i] = (input[i] == null) ? (i === 2 ? 1 : 0) : input[i];
        }
        // we store whether we used utc or not in the input array
        input[7] = forValid[7] = asUTC;
        // if the parser flagged the input as invalid, we pass the value along
        if (input[8] != null) {
            forValid[8] = input[8];
        }
        // add the offsets to the time to be parsed so that we can have a clean array
        // for checking isValid
        input[3] += hoursOffset || 0;
        input[4] += minutesOffset || 0;
        date = new Date(0);
        if (asUTC) {
            date.setUTCFullYear(input[0], input[1], input[2]);
            date.setUTCHours(input[3], input[4], input[5], input[6]);
        } else {
            date.setFullYear(input[0], input[1], input[2]);
            date.setHours(input[3], input[4], input[5], input[6]);
        }
        date._a = forValid;
        return date;
    }

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        var i, m,
            parse = [];

        if (!values && hasModule) {
            values = require('./lang/' + key);
        }

        for (i = 0; i < langConfigProperties.length; i++) {
            // If a language definition does not provide a value, inherit
            // from English
            values[langConfigProperties[i]] = values[langConfigProperties[i]] ||
              languages.en[langConfigProperties[i]];
        }

        for (i = 0; i < 12; i++) {
            m = moment([2000, i]);
            parse[i] = new RegExp('^' + (values.months[i] || values.months(m, '')) +
                '|^' + (values.monthsShort[i] || values.monthsShort(m, '')).replace('.', ''), 'i');
        }
        values.monthsParse = values.monthsParse || parse;

        languages[key] = values;

        return values;
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.  If you pass in a moment or duration instance, it
    // will decide the language based on that, or default to the global
    // language.
    function getLangDefinition(m) {
        var langKey = (typeof m === 'string') && m ||
                      m && m._lang ||
                      null;

        return langKey ? (languages[langKey] || loadLang(langKey)) : moment;
    }


    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[.*\]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += typeof array[i].call === 'function' ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return m.lang().longDateFormat[input] || input;
        }

        while (i-- && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        }

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token) {
        switch (token) {
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
            return parseTokenFourDigits;
        case 'S':
        case 'SS':
        case 'SSS':
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
        case 'a':
        case 'A':
            return parseTokenWord;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
            return parseTokenOneOrTwoDigits;
        default :
            return new RegExp(token.replace('\\', ''));
        }
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, datePartArray, config) {
        var a, b;

        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            datePartArray[1] = (input == null) ? 0 : ~~input - 1;
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            for (a = 0; a < 12; a++) {
                if (getLangDefinition().monthsParse[a].test(input)) {
                    datePartArray[1] = a;
                    b = true;
                    break;
                }
            }
            // if we didn't find a month name, mark the date as invalid.
            if (!b) {
                datePartArray[8] = false;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DDDD
        case 'DD' : // fall through to DDDD
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                datePartArray[2] = ~~input;
            }
            break;
        // YEAR
        case 'YY' :
            datePartArray[0] = ~~input + (~~input > 70 ? 1900 : 2000);
            break;
        case 'YYYY' :
            datePartArray[0] = ~~Math.abs(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config.isPm = ((input + '').toLowerCase() === 'pm');
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[3] = ~~input;
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[4] = ~~input;
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[5] = ~~input;
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
            datePartArray[6] = ~~ (('0.' + input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config.isUTC = true;
            a = (input + '').match(parseTimezoneChunker);
            if (a && a[1]) {
                config.tzh = ~~a[1];
            }
            if (a && a[2]) {
                config.tzm = ~~a[2];
            }
            // reverse offsets
            if (a && a[0] === '+') {
                config.tzh = -config.tzh;
                config.tzm = -config.tzm;
            }
            break;
        }

        // if the input is null, the date is not valid
        if (input == null) {
            datePartArray[8] = false;
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(string, format) {
        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        // We store some additional data on the array for validation
        // datePartArray[7] is true if the Date was created with `Date.UTC` and false if created with `new Date`
        // datePartArray[8] is false if the Date is invalid, and undefined if the validity is unknown.
        var datePartArray = [0, 0, 1, 0, 0, 0, 0],
            config = {
                tzh : 0, // timezone hour offset
                tzm : 0  // timezone minute offset
            },
            tokens = format.match(formattingTokens),
            i, parsedInput;

        for (i = 0; i < tokens.length; i++) {
            parsedInput = (getParseRegexForToken(tokens[i]).exec(string) || [])[0];
            if (parsedInput) {
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            }
            // don't parse if its not a known token
            if (formatTokenFunctions[tokens[i]]) {
                addTimeToArrayFromToken(tokens[i], parsedInput, datePartArray, config);
            }
        }
        // handle am pm
        if (config.isPm && datePartArray[3] < 12) {
            datePartArray[3] += 12;
        }
        // if is 12 am, change hours to 0
        if (config.isPm === false && datePartArray[3] === 12) {
            datePartArray[3] = 0;
        }
        // return
        return dateFromArray(datePartArray, config.isUTC, config.tzh, config.tzm);
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(string, formats) {
        var output,
            inputParts = string.match(parseMultipleFormatChunker) || [],
            formattedInputParts,
            scoreToBeat = 99,
            i,
            currentDate,
            currentScore;
        for (i = 0; i < formats.length; i++) {
            currentDate = makeDateFromStringAndFormat(string, formats[i]);
            formattedInputParts = formatMoment(new Moment(currentDate), formats[i]).match(parseMultipleFormatChunker) || [];
            currentScore = compareArrays(inputParts, formattedInputParts);
            if (currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                output = currentDate;
            }
        }
        return output;
    }

    // date from iso format
    function makeDateFromString(string) {
        var format = 'YYYY-MM-DDT',
            i;
        if (isoRegex.exec(string)) {
            for (i = 0; i < 4; i++) {
                if (isoTimes[i][1].exec(string)) {
                    format += isoTimes[i][0];
                    break;
                }
            }
            return parseTokenTimezone.exec(string) ?
                makeDateFromStringAndFormat(string, format + ' Z') :
                makeDateFromStringAndFormat(string, format);
        }
        return new Date(string);
    }


    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        var rt = lang.relativeTime[string];
        return (typeof rt === 'function') ?
            rt(number || 1, !!withoutSuffix, string, isFuture) :
            rt.replace(/%d/i, number || 1);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < 45 && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < 45 && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < 22 && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= 25 && ['dd', days] ||
                days <= 45 && ['M'] ||
                days < 345 && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Top Level Functions
    ************************************/


    moment = function (input, format) {
        if (input === null || input === '') {
            return null;
        }
        var date,
            matched;
        // parse Moment object
        if (moment.isMoment(input)) {
            return new Moment(new Date(+input._d), input._isUTC, input._lang);
        // parse string and format
        } else if (format) {
            if (isArray(format)) {
                date = makeDateFromStringAndArray(input, format);
            } else {
                date = makeDateFromStringAndFormat(input, format);
            }
        // evaluate it as a JSON-encoded date
        } else {
            matched = aspNetJsonRegex.exec(input);
            date = input === undefined ? new Date() :
                matched ? new Date(+matched[1]) :
                input instanceof Date ? input :
                isArray(input) ? dateFromArray(input) :
                typeof input === 'string' ? makeDateFromString(input) :
                new Date(input);
        }

        return new Moment(date);
    };

    // creating with utc
    moment.utc = function (input, format) {
        if (isArray(input)) {
            return new Moment(dateFromArray(input, true), true);
        }
        // if we don't have a timezone, we need to add one to trigger parsing into utc
        if (typeof input === 'string' && !parseTokenTimezone.exec(input)) {
            input += ' +0000';
            if (format) {
                format += ' Z';
            }
        }
        return moment(input, format).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var isDuration = moment.isDuration(input),
            isNumber = (typeof input === 'number'),
            duration = (isDuration ? input._data : (isNumber ? {} : input)),
            ret;

        if (isNumber) {
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        }

        ret = new Duration(duration);

        if (isDuration) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // humanizeDuration
    // This method is deprecated in favor of the new Duration object.  Please
    // see the moment.duration method.
    moment.humanizeDuration = function (num, type, withSuffix) {
        return moment.duration(num, type === true ? null : type).humanize(type === true ? true : withSuffix);
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var i;

        if (!key) {
            return currentLanguage;
        }
        if (values || !languages[key]) {
            loadLang(key, values);
        }
        if (languages[key]) {
            // deprecated, to get the language definition variables, use the
            // moment.fn.lang method or the getLangDefinition function.
            for (i = 0; i < langConfigProperties.length; i++) {
                moment[langConfigProperties[i]] = languages[key][langConfigProperties[i]];
            }
            moment.monthsParse = languages[key].monthsParse;
            currentLanguage = key;
        }
    };

    // returns language data
    moment.langData = getLangDefinition;

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment;
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },
        calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[last] dddd [at] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        ordinal : function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        }
    });


    /************************************
        Moment Prototype
    ************************************/


    moment.fn = Moment.prototype = {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d;
        },

        unix : function () {
            return Math.floor(+this._d / 1000);
        },

        toString : function () {
            return this._d.toString();
        },

        toDate : function () {
            return this._d;
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds(),
                !!this._isUTC
            ];
        },

        isValid : function () {
            if (this._a) {
                // if the parser finds that the input is invalid, it sets
                // the eighth item in the input array to false.
                if (this._a[8] != null) {
                    return !!this._a[8];
                }
                return !compareArrays(this._a, (this._a[7] ? moment.utc(this._a) : moment(this._a)).toArray());
            }
            return !isNaN(this._d.getTime());
        },

        utc : function () {
            this._isUTC = true;
            return this;
        },

        local : function () {
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            return formatMoment(this, inputString ? inputString : moment.defaultFormat);
        },

        add : function (input, val) {
            var dur = val ? moment.duration(+val, input) : moment.duration(input);
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur = val ? moment.duration(+val, input) : moment.duration(input);
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, val, asFloat) {
            var inputMoment = this._isUTC ? moment(input).utc() : moment(input).local(),
                zoneDiff = (this.zone() - inputMoment.zone()) * 6e4,
                diff = this._d - inputMoment._d - zoneDiff,
                year = this.year() - inputMoment.year(),
                month = this.month() - inputMoment.month(),
                date = this.date() - inputMoment.date(),
                output;
            if (val === 'months') {
                output = year * 12 + month + date / 30;
            } else if (val === 'years') {
                output = year + (month + date / 30) / 12;
            } else {
                output = val === 'seconds' ? diff / 1e3 : // 1000
                    val === 'minutes' ? diff / 6e4 : // 1000 * 60
                    val === 'hours' ? diff / 36e5 : // 1000 * 60 * 60
                    val === 'days' ? diff / 864e5 : // 1000 * 60 * 60 * 24
                    val === 'weeks' ? diff / 6048e5 : // 1000 * 60 * 60 * 24 * 7
                    diff;
            }
            return asFloat ? output : round(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this._lang).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            var diff = this.diff(moment().sod(), 'days', true),
                calendar = this.lang().calendar,
                allElse = calendar.sameElse,
                format = diff < -6 ? allElse :
                diff < -1 ? calendar.lastWeek :
                diff < 0 ? calendar.lastDay :
                diff < 1 ? calendar.sameDay :
                diff < 2 ? calendar.nextDay :
                diff < 7 ? calendar.nextWeek : allElse;
            return this.format(typeof format === 'function' ? format.apply(this) : format);
        },

        isLeapYear : function () {
            var year = this.year();
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        },

        isDST : function () {
            return (this.zone() < moment([this.year()]).zone() ||
                this.zone() < moment([this.year(), 5]).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return input == null ? day :
                this.add({ d : input - day });
        },

        startOf: function (val) {
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (val.replace(/s$/, '')) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'month':
                this.date(1);
                /* falls through */
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }
            return this;
        },

        endOf: function (val) {
            return this.startOf(val).add(val.replace(/s?$/, 's'), 1).subtract('ms', 1);
        },

        sod: function () {
            return this.clone().startOf('day');
        },

        eod: function () {
            // end of day = start of day plus 1 day, minus 1 millisecond
            return this.clone().endOf('day');
        },

        zone : function () {
            return this._isUTC ? 0 : this._d.getTimezoneOffset();
        },

        daysInMonth : function () {
            return moment.utc([this.year(), this.month() + 1, 0]).date();
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (lang) {
            if (lang === undefined) {
                return getLangDefinition(this);
            } else {
                this._lang = lang;
                return this;
            }
        }
    };

    // helper for adding shortcuts
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = function (input) {
            var utc = this._isUTC ? 'UTC' : '';
            if (input != null) {
                this._d['set' + utc + key](input);
                return this;
            } else {
                return this._d['get' + utc + key]();
            }
        };
    }

    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < proxyGettersAndSetters.length; i ++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase(), proxyGettersAndSetters[i]);
    }

    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeGetterAndSetter('year', 'FullYear');


    /************************************
        Duration Prototype
    ************************************/


    moment.duration.fn = Duration.prototype = {
        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              this._months * 2592e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                rel = this.lang().relativeTime,
                output = relativeTime(difference, !withSuffix, this.lang()),
                fromNow = difference <= 0 ? rel.past : rel.future;

            if (withSuffix) {
                if (typeof fromNow === 'function') {
                    output = fromNow(output);
                } else {
                    output = fromNow.replace(/%s/i, output);
                }
            }

            return output;
        },

        lang : moment.fn.lang
    };

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);


    /************************************
        Exposing Moment
    ************************************/


    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    }
    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `moment` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode
        this['moment'] = moment;
    }
    /*global define:false */
    if (typeof define === "function" && define.amd) {
        define("moment", [], function () {
            return moment;
        });
    }
}).call(this);

/*
 Copyright 2012 Igor Vaynberg

 Version: 3.2 Timestamp: Mon Sep 10 10:38:04 PDT 2012

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in
 compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is
 distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and limitations under the License.
 */
 (function ($) {
    if(typeof $.fn.each2 == "undefined"){
        $.fn.extend({
            /*
            * 4-10 times faster .each replacement
            * use it carefully, as it overrides jQuery context of element on each iteration
            */
            each2 : function (c) {
                var j = $([0]), i = -1, l = this.length;
                while (
                    ++i < l
                    && (j.context = j[0] = this[i])
                    && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
                );
                return this;
            }
        });
    }
})(jQuery);

(function ($, undefined) {
    "use strict";
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer;

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    };

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());

    function indexOf(value, array) {
        var i = 0, l = array.length, v;

        if (typeof value === "undefined") {
          return -1;
        }

        if (value.constructor === String) {
            for (; i < l; i = i + 1) if (value.localeCompare(array[i]) === 0) return i;
        } else {
            for (; i < l; i = i + 1) {
                v = array[i];
                if (v.constructor === String) {
                    if (v.localeCompare(value) === 0) return i;
                } else {
                    if (v === value) return i;
                }
            }
        }
        return -1;
    }

    /**
     * Compares equality of a and b taking into account that a and b may be strings, in which case localeCompare is used
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        if (a.constructor === String) return a.localeCompare(b) === 0;
        if (b.constructor === String) return b.localeCompare(a) === 0;
        return false;
    }

    /**
     * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth() - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.bind("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.bind("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }

    $(document).delegate("body", "mousemove", function (e) {
        $.data(document, "select2-lastpos", {x: e.pageX, y: e.pageY});
    });

    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
        element.bind("mousemove", function (e) {
            var lastpos = $.data(document, "select2-lastpos");
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    /**
     * A simple implementation of a thunk
     * @param formula function used to lazily initialize the thunk
     * @return {Function}
     */
    function thunk(formula) {
        var evaluated = false,
            value;
        return function() {
            if (evaluated === false) { value = formula(); evaluated = true; }
            return value;
        };
    };

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.bind("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
            var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
            sizer = $("<div></div>").css({
                position: "absolute",
                left: "-10000px",
                top: "-10000px",
                display: "none",
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                fontStyle: style.fontStyle,
                fontWeight: style.fontWeight,
                letterSpacing: style.letterSpacing,
                textTransform: style.textTransform,
                whiteSpace: "nowrap"
            });
            $("body").append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function markMatch(text, term, markup) {
        var match=text.toUpperCase().indexOf(term.toUpperCase()),
            tl=term.length;

        if (match<0) {
            markup.push(text);
            return;
        }

        markup.push(text.substring(0, match));
        markup.push("<span class='select2-match'>");
        markup.push(text.substring(match, match + tl));
        markup.push("</span>");
        markup.push(text.substring(match + tl, text.length));
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration paramters
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.traditional a boolean flag that should be true if you wish to use the traditional style of param serialization for the ajax request
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            requestSequence = 0, // sequence used to drop out-of-order responses
            handler = null,
            quietMillis = options.quietMillis || 100;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                requestSequence += 1; // increment the sequence
                var requestNumber = requestSequence, // this request's sequence number
                    data = options.data, // ajax data function
                    transport = options.transport || $.ajax,
                    traditional = options.traditional || false,
                    type = options.type || 'GET'; // set type of request (GET or POST)

                data = data.call(this, query.term, query.page, query.context);

                if( null !== handler) { handler.abort(); }

                handler = transport.call(null, {
                    url: options.url,
                    dataType: options.dataType,
                    data: data,
                    type: type,
                    traditional: traditional,
                    success: function (data) {
                        if (requestNumber < requestSequence) {
                            return;
                        }
                        // TODO 3.0 - replace query.page with query so users have access to term, page, etc.
                        var results = options.results(data, query.page);
                        query.callback(results);
                    }
                });
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used ti is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

        if (!$.isArray(data)) {
            text = data.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
              dataText = data.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
              text = function (item) { return item[dataText]; };
            }
            data = data.results;
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback({results: data});
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum))) {
                        collection.push(datum);
                    }
                }
            };

            $(data).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        // TODO even for a function we should probably return a wrapper that does the same object/string check as
        // the function for arrays. otherwise only functions that return objects are supported.
        if ($.isFunction(data)) {
            return data;
        }

        // if not a function we assume it to be an array

        return function (query) {
            var t = query.term, filtered = {results: []};
            $(data).each(function () {
                var isObject = this.text !== undefined,
                    text = isObject ? this.text : this;
                if (t === "" || query.matcher(t, text)) {
                    filtered.results.push(isObject ? this : {id: this, text: this});
                }
            });
            query.callback(filtered);
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        throw new Error("formatterName must be a function or a falsy value");
    }

    function evaluate(val) {
        return $.isFunction(val) ? val() : val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice(token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original.localeCompare(input) != 0) return input;
    }

    /**
     * blurs any Select2 container that has focus when an element outside them was clicked or received focus
     *
     * also takes care of clicks on label tags that point to the source element
     */
    $(document).ready(function () {
        $(document).delegate("body", "mousedown touchend", function (e) {
            var target = $(e.target).closest("div.select2-container").get(0), attr;
            if (target) {
                $(document).find("div.select2-container-active").each(function () {
                    if (this !== target) $(this).data("select2").blur();
                });
            } else {
                target = $(e.target).closest("div.select2-drop").get(0);
                $(document).find("div.select2-drop-active").each(function () {
                    if (this !== target) $(this).data("select2").blur();
                });
            }

            target=$(e.target);
            attr = target.attr("for");
            if ("LABEL" === e.target.tagName && attr && attr.length > 0) {
                target = $("#"+attr);
                target = target.data("select2");
                if (target !== undefined) { target.focus(); e.preventDefault();}
            }
        });
    });

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, resultsSelector = ".select2-results";

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                this.destroy();
            }

            this.enabled=true;
            this.container = this.createContainer();

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerSelector="#"+this.containerId.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            // cache the body so future lookups are cheap
            this.body = thunk(function() { return opts.element.closest("body"); });

            if (opts.element.attr("class") !== undefined) {
                this.container.addClass(opts.element.attr("class").replace(/validate\[[\S ]+] ?/, ''));
            }

            this.container.css(evaluate(opts.containerCss));
            this.container.addClass(evaluate(opts.containerCssClass));

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .hide()
                .before(this.container);
            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");
            this.dropdown.addClass(evaluate(opts.dropdownCssClass));
            this.dropdown.data("select2", this);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");

            search.attr("tabIndex", this.opts.element.attr("tabIndex"));

            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();
            this.initContainerWidth();

            installFilteredMouseMove(this.results);
            this.dropdown.delegate(resultsSelector, "mousemove-filtered", this.bind(this.highlightUnderEvent));

            installDebouncedScroll(80, this.results);
            this.dropdown.delegate(resultsSelector, "scroll-debounced", this.bind(this.loadMoreIfNeeded));

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop(), height;
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.bind("keyup-change", this.bind(this.updateResults));
            search.bind("focus", function () { search.addClass("select2-focused"); if (search.val() === " ") search.val(""); });
            search.bind("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.delegate(resultsSelector, "mouseup", this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable:not(.select2-disabled)").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                } else {
                    this.focusSearch();
                }
                killEvent(e);
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            this.dropdown.bind("click mouseup mousedown", function (e) { e.stopPropagation(); });

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.element.is(":disabled") || opts.element.is("[readonly='readonly']")) this.disable();
        },

        // abstract
        destroy: function () {
            var select2 = this.opts.element.data("select2");
            if (select2 !== undefined) {
                select2.container.remove();
                select2.dropdown.remove();
                select2.opts.element
                    .removeData("select2")
                    .unbind(".select2")
                    .show();
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate,  data, result, children, id=this.opts.id, self=this;

                    populate=function(results, container, depth) {

                        var i, l, result, selectable, compound, node, label, innerContainer, formatted;
                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];
                            selectable=id(result) !== undefined;
                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));

                            label=$("<div></div>");
                            label.addClass("select2-result-label");

                            formatted=opts.formatResult(result, label, query);
                            if (formatted!==undefined) {
                                label.html(self.opts.escapeMarkup(formatted));
                            }

                            node.append(label);

                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            node.data("select2-data", result);
                            container.append(node);
                        }
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, firstChild, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push({id:element.attr("value"), text:element.text(), element: element.get(), css: element.attr("class")});
                            }
                        } else if (element.is("optgroup")) {
                            group={text:element.attr("label"), children:[], element: element.get(), css: element.attr("class")};
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        firstChild = children[0];
                        if ($(firstChild).text() === "") {
                            children=children.not(firstChild);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and there id is hardcoded
                opts.id=function(e) { return e.id; };
                opts.formatResultCssClass = function(data) { return data.css; }
            } else {
                if (!("query" in opts)) {
                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax(opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        opts.createSearchChoice = function (term) { return {id: term, text: term}; };
                        opts.initSelection = function (element, callback) {
                            var data = [];
                            $(splitVal(element.val(), opts.separator)).each(function () {
                                var id = this, text = this, tags=opts.tags;
                                if ($.isFunction(tags)) tags=tags();
                                $(tags).each(function() { if (equal(this.id, id)) { text = this.text; return false; } });
                                data.push({id: id, text: text});
                            });

                            callback(data);
                        };
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            this.opts.element.bind("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignorea the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },


        // abstract
        enable: function() {
            if (this.enabled) return;

            this.enabled=true;
            this.container.removeClass("select2-container-disabled");
        },

        // abstract
        disable: function() {
            if (!this.enabled) return;

            this.close();

            this.enabled=false;
            this.container.addClass("select2-container-disabled");
        },

        // abstract
        opened: function () {
            return this.container.hasClass("select2-dropdown-open");
        },

        // abstract
        positionDropdown: function() {
            var offset = this.container.offset(),
                height = this.container.outerHeight(),
                width = this.container.outerWidth(),
                dropHeight = this.dropdown.outerHeight(),
                viewportBottom = $(window).scrollTop() + document.documentElement.clientHeight,
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= this.body().scrollTop(),
                aboveNow = this.dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                css;

            // console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            // console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body().scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static

            if (this.body().css('position') !== 'static') {
                bodyOffset = this.body().offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            // always prefer the current above/below alignment, unless there is not enough room

            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) above = false;
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) above = true;
            }

            if (above) {
                dropTop = offset.top - dropHeight;
                this.container.addClass("select2-drop-above");
                this.dropdown.addClass("select2-drop-above");
            }
            else {
                this.container.removeClass("select2-drop-above");
                this.dropdown.removeClass("select2-drop-above");
            }

            css = $.extend({
                top: dropTop,
                left: dropLeft,
                width: width
            }, evaluate(this.opts.dropdownCss));

            this.dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            event = $.Event("open");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            window.setTimeout(this.bind(this.opening), 1);

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerId, selector = this.containerSelector,
                scroll = "scroll." + cid, resize = "resize." + cid;

            this.container.parents().each(function() {
                $(this).bind(scroll, function() {
                    var s2 = $(selector);
                    if (s2.length == 0) {
                        $(this).unbind(scroll);
                    }
                    s2.select2("close");
                });
            });

            $(window).bind(resize, function() {
                var s2 = $(selector);
                if (s2.length == 0) {
                    $(window).unbind(resize);
                }
                s2.select2("close");
            });

            this.clearDropdownAlignmentPreference();

            if (this.search.val() === " ") { this.search.val(""); }

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

            this.updateResults(true);

            if(this.dropdown[0] !== this.body().children().last()[0]) {
                this.dropdown.detach().appendTo(this.body());
            }

            this.dropdown.show();

            this.positionDropdown();
            this.dropdown.addClass("select2-drop-active");

            this.ensureHighlightVisible();

            this.focusSearch();
        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var self = this;

            this.container.parents().each(function() {
                $(this).unbind("scroll." + self.containerId);
            });
            $(window).unbind("resize." + this.containerId);

            this.clearDropdownAlignmentPreference();

            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
            this.results.empty();
            this.clearSearch();

            this.opts.element.trigger($.Event("close"));
        },

        // abstract
        clearSearch: function () {

        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = results.find(".select2-result-selectable");

            child = $(children[index]);

            hb = child.offset().top + child.outerHeight();

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight();
                }
            }

            rb = results.offset().top + results.outerHeight();
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = child.offset().top - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.results.find(".select2-result-selectable"),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.results.find(".select2-result-selectable").not(".select2-disabled");

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            choices.removeClass("select2-highlighted");

            $(choices[index]).addClass("select2-highlighted");
            this.ensureHighlightVisible();

        },

        // abstract
        countSelectableResults: function() {
            return this.results.find(".select2-result-selectable").not(".select2-disabled").length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
                var choices = this.results.find('.select2-result-selectable');
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove al highlights
                this.results.find(".select2-highlighted").removeClass("select2-highlighted");
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                offset = -1, // index of first element without data
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= 0) {
                more.addClass("select2-active");
                this.opts.query({
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});

                    if (data.more===true) {
                        more.detach().appendTo(results).text(self.opts.formatLoadMore(page+1));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search, results = this.results, opts = this.opts, data, self=this, input;

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            search.addClass("select2-active");

            function postRender() {
                results.scrollTop(0);
                search.removeClass("select2-active");
                self.positionDropdown();
            }

            function render(html) {
                results.html(self.opts.escapeMarkup(html));
                postRender();
            }

            if (opts.maximumSelectionSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= opts.maximumSelectionSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                    render("<li class='select2-selection-limit'>" + opts.formatSelectionTooBig(opts.maximumSelectionSize) + "</li>");
                    return;
                }
            }

            if (search.val().length < opts.minimumInputLength && checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                render("<li class='select2-no-results'>" + opts.formatInputTooShort(search.val(), opts.minimumInputLength) + "</li>");
                return;
            }
            else {
                render("<li class='select2-searching'>" + opts.formatSearching() + "</li>");
            }

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;
            opts.query({
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) return;

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;

                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(null, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            data.results.unshift(def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + opts.formatNoMatches(search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + self.opts.escapeMarkup(opts.formatLoadMore(this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            this.close();
            this.container.removeClass("select2-container-active");
            this.dropdown.removeClass("select2-drop-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        },

        // abstract
        focusSearch: function () {
            // need to do it here as well as in timeout so it works in IE
            this.search.show();
            this.search.focus();

            /* we do this in a timeout so that current event processing can complete before this code is executed.
             this makes sure the search field is focussed even if the current event would blur it */
            window.setTimeout(this.bind(function () {
                // reset the value so IE places the cursor at the end of the input box
                this.search.show();
                this.search.focus();
                this.search.val(this.search.val());
            }), 10);
        },

        // abstract
        selectHighlighted: function () {
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted").not(".select2-disabled"),
                data = highlighted.closest('.select2-result-selectable').data("select2-data");
            if (data) {
                highlighted.addClass("select2-disabled");
                this.highlight(index);
                this.onSelect(data);
            }
        },

        // abstract
        getPlaceholder: function () {
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder;
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth() === 0 ? 'auto' : this.opts.element.outerWidth() + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            matches = attrs[i].replace(/\s/g, '')
                                .match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    if (this.opts.width === "resolve") {
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0) return style;

                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth() === 0 ? 'auto' : this.opts.element.outerWidth() + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.attr("style", "width: "+width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

        createContainer: function () {
            var container = $("<div></div>", {
                "class": "select2-container"
            }).html([
                "    <a href='#' onclick='return false;' class='select2-choice'>",
                "   <span></span><abbr class='select2-search-choice-close' style='display:none;'></abbr>",
                "   <div><b></b></div>" ,
                "</a>",
                "    <div class='select2-drop select2-offscreen'>" ,
                "   <div class='select2-search'>" ,
                "       <input type='text' autocomplete='off' class='select2-input'/>" ,
                "   </div>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "</div>"].join(""));
            return container;
        },

        // single
        opening: function () {
            this.search.show();
            this.parent.opening.apply(this, arguments);
            this.dropdown.removeClass("select2-offscreen");
        },

        // single
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
            this.dropdown.removeAttr("style").addClass("select2-offscreen").insertAfter(this.selection).show();
        },

        // single
        focus: function () {
            this.close();
            this.selection.focus();
        },

        // single
        isFocused: function () {
            return this.selection[0] === document.activeElement;
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.selection.focus();
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown,
                clickingInside = false;

            this.selection = selection = container.find(".select2-choice");

            this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                if (this.opened()) {
                    switch (e.which) {
                        case KEY.UP:
                        case KEY.DOWN:
                            this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                            killEvent(e);
                            return;
                        case KEY.TAB:
                        case KEY.ENTER:
                            this.selectHighlighted();
                            killEvent(e);
                            return;
                        case KEY.ESC:
                            this.cancel(e);
                            killEvent(e);
                            return;
                    }
                } else {

                    if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                        return;
                    }

                    if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                        return;
                    }

                    this.open();

                    if (e.which === KEY.ENTER) {
                        // do not propagate the event otherwise we open, and propagate enter which closes
                        return;
                    }
                }
            }));

            this.search.bind("focus", this.bind(function() {
                this.selection.attr("tabIndex", "-1");
            }));
            this.search.bind("blur", this.bind(function() {
                if (!this.opened()) this.container.removeClass("select2-container-active");
                window.setTimeout(this.bind(function() { this.selection.attr("tabIndex", this.opts.element.attr("tabIndex")); }), 10);
            }));

            selection.bind("mousedown", this.bind(function (e) {
                clickingInside = true;

                if (this.opened()) {
                    this.close();
                    this.selection.focus();
                } else if (this.enabled) {
                    this.open();
                }

                clickingInside = false;
            }));

            dropdown.bind("mousedown", this.bind(function() { this.search.focus(); }));

            selection.bind("focus", this.bind(function() {
                this.container.addClass("select2-container-active");
                // hide the search so the tab key does not focus on it
                this.search.attr("tabIndex", "-1");
            }));

            selection.bind("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                }
                window.setTimeout(this.bind(function() { this.search.attr("tabIndex", this.opts.element.attr("tabIndex")); }), 10);
            }));

            selection.bind("keydown", this.bind(function(e) {
                if (!this.enabled) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    return;
                }

                if (e.which == KEY.DELETE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    return;
                }

                this.open();

                if (e.which === KEY.ENTER) {
                    // do not propagate the event otherwise we open, and propagate enter which closes
                    killEvent(e);
                    return;
                }

                // do not set the search input value for non-alpha-numeric keys
                // otherwise pressing down results in a '(' being set in the search field
                if (e.which < 48 ) { // '0' == 48
                    killEvent(e);
                    return;
                }

                var keyWritten = String.fromCharCode(e.which).toLowerCase();

                if (e.shiftKey) {
                    keyWritten = keyWritten.toUpperCase();
                }

                // focus the field before calling val so the cursor ends up after the value instead of before
                this.search.focus();
                this.search.val(keyWritten);

                // prevent event propagation so it doesnt replay on the now focussed search field and result in double key entry
                killEvent(e);
            }));

            selection.delegate("abbr", "mousedown", this.bind(function (e) {
                if (!this.enabled) return;
                this.clear();
                killEvent(e);
                this.close();
                this.triggerChange();
                this.selection.focus();
            }));

            this.setPlaceholder();

            this.search.bind("focus", this.bind(function() {
                this.container.addClass("select2-container-active");
            }));
        },

        // single
        clear: function() {
            this.opts.element.val("");
            this.selection.find("span").empty();
            this.selection.removeData("select2-data");
            this.setPlaceholder();
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.opts.element.val() === "") {
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                    }
                });
            }
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments);

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find(":selected");
                    // a single select box always has a value, no need to null check 'selected'
                    if ($.isFunction(callback))
                        callback({id: selected.attr("value"), text: selected.text()});
                };
            }

            return opts;
        },

        // single
        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();

            if (this.opts.element.val() === "" && placeholder !== undefined) {

                // check for a first blank option if attached to a select
                if (this.select && this.select.find("option:first").text() !== "") return;

                this.selection.find("span").html(this.opts.escapeMarkup(placeholder));

                this.selection.addClass("select2-default");

                this.selection.find("abbr").hide();
            }
        },

        // single
        postprocessResults: function (data, initial) {
            var selected = 0, self = this, showSearchInput = true;

            // find the selected element in the result list

            this.results.find(".select2-result-selectable").each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it

            this.highlight(selected);

            // hide the search box if this is the first we got the results and there are a few of them

            if (initial === true) {
                showSearchInput = this.showSearchInput = countResults(data.results) >= this.opts.minimumResultsForSearch;
                this.dropdown.find(".select2-search")[showSearchInput ? "removeClass" : "addClass"]("select2-search-hidden");

                //add "select2-with-searchbox" to the container if search box is shown
                $(this.dropdown, this.container)[showSearchInput ? "addClass" : "removeClass"]("select2-with-searchbox");
            }

        },

        // single
        onSelect: function (data) {
            var old = this.opts.element.val();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);
            this.close();
            this.selection.focus();

            if (!equal(old, this.id(data))) { this.triggerChange(); }
        },

        // single
        updateSelection: function (data) {

            var container=this.selection.find("span"), formatted;

            this.selection.data("select2-data", data);

            container.empty();
            formatted=this.opts.formatSelection(data, container);
            if (formatted !== undefined) {
                container.append(this.opts.escapeMarkup(formatted));
            }

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.selection.find("abbr").show();
            }
        },

        // single
        val: function () {
            var val, data = null, self = this;

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (this.select) {
                this.select
                    .val(val)
                    .find(":selected").each2(function (i, elm) {
                        data = {id: elm.attr("value"), text: elm.text()};
                        return false;
                    });
                this.updateSelection(data);
                this.setPlaceholder();
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                // val is an id. !val is true for [undefined,null,'']
                if (!val) {
                    this.clear();
                    return;
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function(data){
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                });
            }
        },

        // single
        clearSearch: function () {
            this.search.val("");
        },

        // single
        data: function(value) {
            var data;

            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined) data = null;
                return data;
            } else {
                if (!value || value === "") {
                    this.clear();
                } else {
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                }
            }
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        // multi
        createContainer: function () {
            var container = $("<div></div>", {
                "class": "select2-container select2-container-multi"
            }).html([
                "    <ul class='select2-choices'>",
                //"<li class='select2-search-choice'><span>California</span><a href="javascript:void(0)" class="select2-search-choice-close"></a></li>" ,
                "  <li class='select2-search-field'>" ,
                "    <input type='text' autocomplete='off' class='select2-input'>" ,
                "  </li>" ,
                "</ul>" ,
                "<div class='select2-drop select2-drop-multi' style='display:none;'>" ,
                "   <ul class='select2-results'>" ,
                "   </ul>" ,
                "</div>"].join(""));
            return container;
        },

        // multi
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments);

            // TODO validate placeholder is a string if specified

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install sthe selection initializer
                opts.initSelection = function (element,callback) {

                    var data = [];
                    element.find(":selected").each2(function (i, elm) {
                        data.push({id: elm.attr("value"), text: elm.text()});
                    });

                    if ($.isFunction(callback))
                        callback(data);
                };
            }

            return opts;
        },

        // multi
        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            this.search.bind("keydown", this.bind(function (e) {
                if (!this.enabled) return;

                if (e.which === KEY.BACKSPACE && this.search.val() === "") {
                    this.close();

                    var choices,
                        selected = selection.find(".select2-search-choice-focus");
                    if (selected.length > 0) {
                        this.unselect(selected.first());
                        this.search.width(10);
                        killEvent(e);
                        return;
                    }

                    choices = selection.find(".select2-search-choice");
                    if (choices.length > 0) {
                        choices.last().addClass("select2-search-choice-focus");
                    }
                } else {
                    selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                    case KEY.TAB:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    return;
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }
            }));

            this.search.bind("keyup", this.bind(this.resizeSearch));

            this.search.bind("blur", this.bind(function(e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                this.clearSearch();
                e.stopImmediatePropagation();
            }));

            this.container.delegate(selector, "mousedown", this.bind(function (e) {
                if (!this.enabled) return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    // clicked inside a select2 search choice, do not open
                    return;
                }
                this.clearPlaceholder();
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.delegate(selector, "focus", this.bind(function () {
                if (!this.enabled) return;
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));

            // set the placeholder if necessary
            this.clearSearch();
        },

        // multi
        enable: function() {
            if (this.enabled) return;

            this.parent.enable.apply(this, arguments);

            this.search.removeAttr("disabled");
        },

        // multi
        disable: function() {
            if (!this.enabled) return;

            this.parent.disable.apply(this, arguments);

            this.search.attr("disabled", true);
        },

        // multi
        initSelection: function () {
            var data;
            if (this.opts.element.val() === "") {
                this.updateSelection([]);
                this.close();
                // set the placeholder if necessary
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(data){
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        // set the placeholder if necessary
                        self.clearSearch();
                    }
                });
            }
        },

        // multi
        clearSearch: function () {
            var placeholder = this.getPlaceholder();

            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                this.resizeSearch();
            } else {
                // we set this to " " instead of "" and later clear it on focus() because there is a firefox bug
                // that does not properly render the caret when the field starts out blank
                this.search.val(" ").width(10);
            }
        },

        // multi
        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            } else {
                // work around for the space character we set to avoid firefox caret bug
                if (this.search.val() === " ") this.search.val("");
            }
        },

        // multi
        opening: function () {
            this.parent.opening.apply(this, arguments);

            this.clearPlaceholder();
            this.resizeSearch();
            this.focusSearch();
        },

        // multi
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        // multi
        focus: function () {
            this.close();
            this.search.focus();
        },

        // multi
        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        // multi
        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer(input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }

        },

        // multi
        onSelect: function (data) {
            this.addSelectedChoice(data);
            if (this.select) { this.postprocessResults(); }

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults()>0) {
                    this.search.width(10);
                    this.resizeSearch();
                    this.positionDropdown();
                } else {
                    // if nothing left to select close
                    this.close();
                }
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange({ added: data });

            this.focusSearch();
        },

        // multi
        cancel: function () {
            this.close();
            this.focusSearch();
        },

        // multi
        addSelectedChoice: function (data) {
            var choice=$(
                    "<li class='select2-search-choice'>" +
                    "    <div></div>" +
                    "    <a href='#' onclick='return false;' class='select2-search-choice-close' tabindex='-1'></a>" +
                    "</li>"),
                id = this.id(data),
                val = this.getVal(),
                formatted;

            formatted=this.opts.formatSelection(data, choice);
            choice.find("div").replaceWith("<div>"+this.opts.escapeMarkup(formatted)+"</div>");
            choice.find(".select2-search-choice-close")
                .bind("mousedown", killEvent)
                .bind("click dblclick", this.bind(function (e) {
                if (!this.enabled) return;

                $(e.target).closest(".select2-search-choice").fadeOut('fast', this.bind(function(){
                    this.unselect($(e.target));
                    this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                    this.close();
                    this.focusSearch();
                })).dequeue();
                killEvent(e);
            })).bind("focus", this.bind(function () {
                if (!this.enabled) return;
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
            }));

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        // multi
        unselect: function (selected) {
            var val = this.getVal(),
                data,
                index;

            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            data = selected.data("select2-data");

            index = indexOf(this.id(data), val);

            if (index >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }
            selected.remove();
            this.triggerChange({ removed: data });
        },

        // multi
        postprocessResults: function () {
            var val = this.getVal(),
                choices = this.results.find(".select2-result-selectable"),
                compound = this.results.find(".select2-result-with-children"),
                self = this;

            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-disabled").removeClass("select2-result-selectable");
                } else {
                    choice.removeClass("select2-disabled").addClass("select2-result-selectable");
                }
            });

            compound.each2(function(i, e) {
                if (e.find(".select2-result-selectable").length==0) {
                    e.addClass("select2-disabled");
                } else {
                    e.removeClass("select2-disabled");
                }
            });

            choices.each2(function (i, choice) {
                if (!choice.hasClass("select2-disabled") && choice.hasClass("select2-result-selectable")) {
                    self.highlight(0);
                    return false;
                }
            });

        },

        // multi
        resizeSearch: function () {

            var minimumWidth, left, maxWidth, containerLeft, searchWidth,
                sideBorderPadding = getSideBorderPadding(this.search);

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;
            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }
            this.search.width(searchWidth);
        },

        // multi
        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator);
            }
        },

        // multi
        setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        },

        // multi
        val: function () {
            var val, data = [], self=this;

            if (arguments.length === 0) {
                return this.getVal();
            }

            val = arguments[0];

            if (!val) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                return;
            }

            // val is a list of ids
            this.setVal(val);

            if (this.select) {
                this.select.find(":selected").each(function () {
                    data.push({id: $(this).attr("value"), text: $(this).text()});
                });
                this.updateSelection(data);
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined")
                }

                this.opts.initSelection(this.opts.element, function(data){
                    var ids=$(data).map(self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                });
            }
            this.clearSearch();
        },

        // multi
        onSortStart: function() {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }

            // collapse search field into 0 width so its container can be collapsed as well
            this.search.width(0);
            // hide the container
            this.searchContainer.hide();
        },

        // multi
        onSortEnd:function() {

            var val=[], self=this;

            // show search and move it to the end of the list
            this.searchContainer.show();
            // make sure the search container is the last item in the list
            this.searchContainer.appendTo(this.searchContainer.parent());
            // since we collapsed the width in dragStarted, we resize it here
            this.resizeSearch();

            // update selection

            this.selection.find(".select2-search-choice").each(function() {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        },

        // multi
        data: function(values) {
            var self=this, ids;
            if (arguments.length === 0) {
                 return this.selection
                     .find(".select2-search-choice")
                     .map(function() { return $(this).data("select2-data"); })
                     .get();
            } else {
                if (!values) { values = []; }
                ids = $.map(values, function(e) { return self.opts.id(e)});
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
            }
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            value, multiple, allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "onSortStart", "onSortEnd", "enable", "disable", "positionDropdown", "data"];

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.attr("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new MultiSelect2() : new SingleSelect2();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;
                if (args[0] === "container") {
                    value=select2.container;
                } else {
                    value = select2[args[0]].apply(select2, args.slice(1));
                }
                if (value !== undefined) {return false;}
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // plugin defaults, accessible to users
    $.fn.select2.defaults = {
        width: "copy",
        closeOnSelect: true,
        openOnEnter: true,
        containerCss: {},
        dropdownCss: {},
        containerCssClass: "",
        dropdownCssClass: "",
        formatResult: function(result, container, query) {
            var markup=[];
            markMatch(result.text, query.term, markup);
            return markup.join("");
        },
        formatSelection: function (data, container) {
            return data ? data.text : undefined;
        },
        formatResultCssClass: function(data) {return undefined;},
        formatNoMatches: function () { return "No matches found"; },
        formatInputTooShort: function (input, min) { return "Please enter " + (min - input.length) + " more characters"; },
        formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
        formatLoadMore: function (pageNumber) { return "Loading more results..."; },
        formatSearching: function () { return "Searching..."; },
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        maximumSelectionSize: 0,
        id: function (e) { return e.id; },
        matcher: function(term, text) {
            return text.toUpperCase().indexOf(term.toUpperCase()) >= 0;
        },
        separator: ",",
        tokenSeparators: [],
        tokenizer: defaultTokenizer,
        escapeMarkup: function (markup) {
            if (markup && typeof(markup) === "string") {
                return markup.replace(/&/g, "&amp;");
            }
            return markup;
        },
        blurOnChange: false
    };

    // exports
    window.Select2 = {
        query: {
            ajax: ajax,
            local: local,
            tags: tags
        }, util: {
            debounce: debounce,
            markMatch: markMatch
        }, "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
        }
    };

}(jQuery));

/*
ListJS Beta 0.2.0
By Jonny Strömberg (www.jonnystromberg.com, www.listjs.com)

OBS. The API is not frozen. It MAY change!

License (MIT)

Copyright (c) 2011 Jonny Strömberg http://jonnystromberg.com

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
(function( window, undefined ) {
"use strict";
var document = window.document,
    h;

var List = function(id, options, values) {
    var self = this,
        templater,
        init,
        initialItems,
        Item,
        Templater,
        sortButtons,
        events = {
            'updated': []
        };
    this.listContainer = (typeof(id) == 'string') ? document.getElementById(id) : id;
    // Check if the container exists. If not return instead of breaking the javascript
    if (!this.listContainer)
        return;

    this.items = [];
    this.visibleItems = []; // These are the items currently visible
    this.matchingItems = []; // These are the items currently matching filters and search, regadlessof visible count
    this.searched = false;
    this.filtered = false;

    this.list = null;
    this.templateEngines = {};

    this.page = options.page || 200;
    this.i = options.i || 1;

    init = {
        start: function(values, options) {
            options.plugins = options.plugins || {};
            this.classes(options);
            templater = new Templater(self, options);
            this.callbacks(options);
            this.items.start(values, options);
            self.update();
            this.plugins(options.plugins);
        },
        classes: function(options) {
            options.listClass = options.listClass || 'list';
            options.searchClass = options.searchClass || 'search';
            options.sortClass = options.sortClass || 'sort';
        },
        callbacks: function(options) {
            self.list = h.getByClass(options.listClass, self.listContainer, true);
            h.addEvent(h.getByClass(options.searchClass, self.listContainer), 'keyup', self.search);
            sortButtons = h.getByClass(options.sortClass, self.listContainer);
            h.addEvent(sortButtons, 'click', self.sort);
        },
        items: {
            start: function(values, options) {
                if (options.valueNames) {
                    var itemsToIndex = this.get(),
                    valueNames = options.valueNames;
                    if (options.indexAsync) {
                        this.indexAsync(itemsToIndex, valueNames);
                    } else {
                        this.index(itemsToIndex, valueNames);
                    }
                }
                if (values !== undefined) {
                    self.add(values);
                }
            },
            get: function() {
                // return h.getByClass('item', self.list);
                var nodes = self.list.childNodes,
                items = [];
                for (var i = 0, il = nodes.length; i < il; i++) {
                    // Only textnodes have a data attribute
                    if (nodes[i].data === undefined) {
                        items.push(nodes[i]);
                    }
                }
                return items;
            },
            index: function(itemElements, valueNames) {
                for (var i = 0, il = itemElements.length; i < il; i++) {
                    self.items.push(new Item(valueNames, itemElements[i]));
                }
            },
            indexAsync: function(itemElements, valueNames) {
                var itemsToIndex = itemElements.splice(0, 100); // TODO: If < 100 items, what happens in IE etc?
                this.index(itemsToIndex, valueNames);
                if (itemElements.length > 0) {
                    setTimeout(function() {
                        init.items.indexAsync(itemElements, valueNames);
                        },
                    10);
                } else {
                    self.update();
                    // TODO: Add indexed callback
                }
            }
        },
        plugins: function(plugins) {
            var locals = {
                templater: templater,
                init: init,
                initialItems: initialItems,
                Item: Item,
                Templater: Templater,
                sortButtons: sortButtons,
                events: events,
                reset: reset
            };
            for (var i = 0; i < plugins.length; i++) {
                plugins[i][1] = plugins[i][1] || {};
                var pluginName = plugins[i][1].name || plugins[i][0];
                self[pluginName] = self.plugins[plugins[i][0]].call(self, locals, plugins[i][1]);
            }
        }
    };


    /*
    * Add object to list
    */
    this.add = function(values, callback) {
        if (callback) {
            addAsync(values, callback);
        }
        var added = [],
            notCreate = false;
        if (values[0] === undefined){
            values = [values];
        }
        for (var i = 0, il = values.length; i < il; i++) {
            var item = null;
            if (values[i] instanceof Item) {
                item = values[i];
                item.reload();
            } else {
                notCreate = (self.items.length > self.page) ? true : false;
                item = new Item(values[i], undefined, notCreate);
            }
            self.items.push(item);
            added.push(item);
        }
        self.update();
        return added;
    };

    /*
    * Adds items asynchronous to the list, good for adding huge amount of
    * data. Defaults to add 100 items a time
    */
    var addAsync = function(values, callback, items) {
        var valuesToAdd = values.splice(0, 100);
        items = items || [];
        items = items.concat(self.add(valuesToAdd));
        if (values.length > 0) {
            setTimeout(function() {
                addAsync(values, callback, items);
            }, 10);
        } else {
            self.update();
            callback(items);
        }
    };

    this.show = function(i, page) {
        this.i = i;
        this.page = page;
        self.update();
    };

    /* Removes object from list.
    * Loops through the list and removes objects where
    * property "valuename" === value
    */
    this.remove = function(valueName, value, options) {
        var found = 0;
        for (var i = 0, il = self.items.length; i < il; i++) {
            if (self.items[i].values()[valueName] == value) {
                templater.remove(self.items[i], options);
                self.items.splice(i,1);
                il--;
                found++;
            }
        }
        self.update();
        return found;
    };

    /* Gets the objects in the list which
    * property "valueName" === value
    */
    this.get = function(valueName, value) {
        var matchedItems = [];
        for (var i = 0, il = self.items.length; i < il; i++) {
            var item = self.items[i];
            if (item.values()[valueName] == value) {
                matchedItems.push(item);
            }
        }
        if (matchedItems.length == 0) {
            return null;
        } else if (matchedItems.length == 1) {
            return matchedItems[0];
        } else {
            return matchedItems;
        }
    };

    /* Sorts the list.
    * @valueOrEvent Either a JavaScript event object or a valueName
    * @sortFunction (optional) Define if natural sorting does not fullfill your needs
    */
    this.sort = function(valueName, options) {
        var length = self.items.length,
            value = null,
            target = valueName.target || valueName.srcElement, /* IE have srcElement */
            sorting = '',
            isAsc = false,
            asc = 'asc',
            desc = 'desc',
            options = options || {};

        if (target === undefined) {
            value = valueName;
            isAsc = options.asc || false;
        } else {
            value = h.getAttribute(target, 'data-sort');
            isAsc = h.hasClass(target, asc) ? false : true;
        }
        for (var i = 0, il = sortButtons.length; i < il; i++) {
            h.removeClass(sortButtons[i], asc);
            h.removeClass(sortButtons[i], desc);
        }
        if (isAsc) {
            if (target !== undefined) {
                h.addClass(target, asc);
            }
            isAsc = true;
        } else {
            if (target !== undefined) {
                h.addClass(target, desc);
            }
            isAsc = false;
        }

        if (options.sortFunction) {
            options.sortFunction = options.sortFunction;
        } else {
            options.sortFunction = function(a, b) {
                return h.sorter.alphanum(a.values()[value].toLowerCase(), b.values()[value].toLowerCase(), isAsc);
            };
        }
        self.items.sort(options.sortFunction);
        self.update();
    };

    /*
    * Searches the list after values with content "searchStringOrEvent".
    * The columns parameter defines if all values should be included in the search,
    * defaults to undefined which means "all".
    */
    this.search = function(searchString, columns) {
        self.i = 1; // Reset paging
        var matching = [],
            found,
            item,
            text,
            values,
            is,
            columns = (columns === undefined) ? self.items[0].values() : columns,
            searchString = (searchString === undefined) ? "" : searchString,
            target = searchString.target || searchString.srcElement; /* IE have srcElement */

        searchString = (target === undefined) ? (""+searchString).toLowerCase() : ""+target.value.toLowerCase();
        is = self.items;
        // Escape regular expression characters
        searchString = searchString.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

        templater.clear();
        if (searchString === "" ) {
            reset.search();
            self.searched = false;
            self.update();
        } else {
            self.searched = true;

            for (var k = 0, kl = is.length; k < kl; k++) {
                found = false;
                item = is[k];
                values = item.values();

                for(var j in columns) {
                    if(values.hasOwnProperty(j) && columns[j] !== null) {
                        text = (values[j] != null) ? values[j].toString().toLowerCase() : "";
                        if ((searchString !== "") && (text.search(searchString) > -1)) {
                            found = true;
                        }
                    }
                }
                if (found) {
                    item.found = true;
                    matching.push(item);
                } else {
                    item.found = false;
                }
            }
            self.update();
        }
        return self.visibleItems;
    };

    /*
    * Filters the list. If filterFunction() returns False hides the Item.
    * if filterFunction == false are the filter removed
    */
    this.filter = function(filterFunction) {
        self.i = 1; // Reset paging
        reset.filter();
        if (filterFunction === undefined) {
            self.filtered = false;
        } else {
            self.filtered = true;
            var is = self.items;
            for (var i = 0, il = is.length; i < il; i++) {
                var item = is[i];
                if (filterFunction(item)) {
                    item.filtered = true;
                } else {
                    item.filtered = false;
                }
            }
        }
        self.update();
        return self.visibleItems;
    };

    /*
    * Get size of the list
    */
    this.size = function() {
        return self.items.length;
    };

    /*
    * Removes all items from the list
    */
    this.clear = function() {
        templater.clear();
        self.items = [];
    };

    this.on = function(event, callback) {
        events[event].push(callback);
    };

    var trigger = function(event) {
        var i = events[event].length;
        while(i--) {
            events[event][i]();
        }
    };

    var reset = {
        filter: function() {
            var is = self.items,
                il = is.length;
            while (il--) {
                is[il].filtered = false;
            }
        },
        search: function() {
            var is = self.items,
                il = is.length;
            while (il--) {
                is[il].found = false;
            }
        }
    };


    this.update = function() {
        var is = self.items,
            il = is.length;

        self.visibleItems = [];
        self.matchingItems = [];
        templater.clear();
        for (var i = 0; i < il; i++) {
            if (is[i].matching() && ((self.matchingItems.length+1) >= self.i && self.visibleItems.length < self.page)) {
                is[i].show();
                self.visibleItems.push(is[i]);
                self.matchingItems.push(is[i]);
            } else if (is[i].matching()) {
                self.matchingItems.push(is[i]);
                is[i].hide();
            } else {
                is[i].hide();
            }
        }
        trigger('updated');
    };

    Item = function(initValues, element, notCreate) {
        var item = this,
            values = {};

        this.found = false; // Show if list.searched == true and this.found == true
        this.filtered = false;// Show if list.filtered == true and this.filtered == true

        var init = function(initValues, element, notCreate) {
            if (element === undefined) {
                if (notCreate) {
                    item.values(initValues, notCreate);
                } else {
                    item.values(initValues);
                }
            } else {
                item.elm = element;
                var values = templater.get(item, initValues);
                item.values(values);
            }
        };
        this.values = function(newValues, notCreate) {
            if (newValues !== undefined) {
                for(var name in newValues) {
                    values[name] = newValues[name];
                }
                if (notCreate !== true) {
                    templater.set(item, item.values());
                }
            } else {
                return values;
            }
        };
        this.show = function() {
            templater.show(item);
        };
        this.hide = function() {
            templater.hide(item);
        };
        this.matching = function() {
            return (
                (self.filtered && self.searched && item.found && item.filtered) ||
                (self.filtered && !self.searched && item.filtered) ||
                (!self.filtered && self.searched && item.found) ||
                (!self.filtered && !self.searched)
            );
        };
        this.visible = function() {
            return (item.elm.parentNode) ? true : false;
        };
        init(initValues, element, notCreate);
    };

    /* Templater with different kinds of template engines.
    * All engines have these methods
    * - reload(item)
    * - remove(item)
    */
    Templater = function(list, settings) {
        if (settings.engine === undefined) {
            settings.engine = "standard";
        } else {
            settings.engine = settings.engine.toLowerCase();
        }
        return new self.constructor.prototype.templateEngines[settings.engine](list, settings);
    };

    init.start(values, options);
};

List.prototype.templateEngines = {};
List.prototype.plugins = {};

List.prototype.templateEngines.standard = function(list, settings) {
    var listSource = h.getByClass(settings.listClass, list.listContainer, true),
        itemSource = getItemSource(settings.item),
        templater = this;

    function getItemSource(item) {
        if (item === undefined) {
            var nodes = listSource.childNodes,
                items = [];

            for (var i = 0, il = nodes.length; i < il; i++) {
                // Only textnodes have a data attribute
                if (nodes[i].data === undefined) {
                    return nodes[i];
                }
            }
            return null;
        } else if (item.indexOf("<") !== -1) { // Try create html element of list, do not work for tables!!
            var div = document.createElement('div');
            div.innerHTML = item;
            return div.firstChild;
        } else {
            return document.getElementById(settings.item);
        }
    }

    var ensure = {
        created: function(item) {
            if (item.elm === undefined) {
                templater.create(item);
            }
        }
    };

    /* Get values from element */
    this.get = function(item, valueNames) {
        ensure.created(item);
        var values = {};
        for(var i = 0, il = valueNames.length; i < il; i++) {
            var elm = h.getByClass(valueNames[i], item.elm, true);
            values[valueNames[i]] = elm ? elm.innerHTML : "";
        }
        return values;
    };

    /* Sets values at element */
    this.set = function(item, values) {
        ensure.created(item);
        for(var v in values) {
            if (values.hasOwnProperty(v)) {
                // TODO speed up if possible
                var elm = h.getByClass(v, item.elm, true);
                if (elm) {
                    elm.innerHTML = values[v];
                }
            }
        }
    };

    this.create = function(item) {
        if (item.elm !== undefined) {
            return;
        }
        /* If item source does not exists, use the first item in list as
        source for new items */
        var newItem = itemSource.cloneNode(true);
        newItem.id = "";
        item.elm = newItem;
        templater.set(item, item.values());
    };
    this.remove = function(item) {
        listSource.removeChild(item.elm);
    };
    this.show = function(item) {
        ensure.created(item);
        listSource.appendChild(item.elm);
    };
    this.hide = function(item) {
        if (item.elm !== undefined && item.elm.parentNode === listSource) {
            listSource.removeChild(item.elm);
        }
    };
    this.clear = function() {
        /* .innerHTML = ''; fucks up IE */
        if (listSource.hasChildNodes()) {
            while (listSource.childNodes.length >= 1)
            {
                listSource.removeChild(listSource.firstChild);
            }
        }
    };
};


/*
* These helper functions are not written by List.js author Jonny (they may have been
* adjusted, thought).
*/
h = {
    /*
    * Cross browser getElementsByClassName, which uses native
    * if it exists. Modified version of Dustin Diaz function:
    * http://www.dustindiaz.com/getelementsbyclass
    */
    getByClass: (function() {
        if (document.getElementsByClassName) {
            return function(searchClass,node,single) {
                if (single) {
                    return node.getElementsByClassName(searchClass)[0];
                } else {
                    return node.getElementsByClassName(searchClass);
                }
            };
        } else {
            return function(searchClass,node,single) {
                var classElements = [],
                    tag = '*';
                if (node == null) {
                    node = document;
                }
                var els = node.getElementsByTagName(tag);
                var elsLen = els.length;
                var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
                for (var i = 0, j = 0; i < elsLen; i++) {
                    if ( pattern.test(els[i].className) ) {
                        if (single) {
                            return els[i];
                        } else {
                            classElements[j] = els[i];
                            j++;
                        }
                    }
                }
                return classElements;
            };
        }
    })(),
    /* (elm, 'event' callback) Source: http://net.tutsplus.com/tutorials/javascript-ajax/javascript-from-null-cross-browser-event-binding/ */
    addEvent: (function( window, document ) {
        if ( document.addEventListener ) {
            return function( elem, type, cb ) {
                if ((elem && !(elem instanceof Array) && !elem.length && !h.isNodeList(elem) && (elem.length !== 0)) || elem === window ) {
                    elem.addEventListener(type, cb, false );
                } else if ( elem && elem[0] !== undefined ) {
                    var len = elem.length;
                    for ( var i = 0; i < len; i++ ) {
                        h.addEvent(elem[i], type, cb);
                    }
                }
            };
        }
        else if ( document.attachEvent ) {
            return function ( elem, type, cb ) {
                if ((elem && !(elem instanceof Array) && !elem.length && !h.isNodeList(elem) && (elem.length !== 0)) || elem === window ) {
                    elem.attachEvent( 'on' + type, function() { return cb.call(elem, window.event); } );
                } else if ( elem && elem[0] !== undefined ) {
                    var len = elem.length;
                    for ( var i = 0; i < len; i++ ) {
                        h.addEvent( elem[i], type, cb );
                    }
                }
            };
        }
    })(this, document),
    /* (elm, attribute) Source: http://stackoverflow.com/questions/3755227/cross-browser-javascript-getattribute-method */
    getAttribute: function(ele, attr) {
        var result = (ele.getAttribute && ele.getAttribute(attr)) || null;
        if( !result ) {
            var attrs = ele.attributes;
            var length = attrs.length;
            for(var i = 0; i < length; i++) {
                if (attr[i] !== undefined) {
                    if(attr[i].nodeName === attr) {
                        result = attr[i].nodeValue;
                    }
                }
            }
        }
        return result;
    },
    /* http://stackoverflow.com/questions/7238177/detect-htmlcollection-nodelist-in-javascript */
    isNodeList: function(nodes) {
        var result = Object.prototype.toString.call(nodes);
        if (typeof nodes === 'object' && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(result) && (nodes.length == 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0))) {
            return true;
        }
        return false;
    },
    hasClass: function(ele, classN) {
        var classes = this.getAttribute(ele, 'class') || this.getAttribute(ele, 'className') || "";
        return (classes.search(classN) > -1);
    },
    addClass: function(ele, classN) {
        if (!this.hasClass(ele, classN)) {
            var classes = this.getAttribute(ele, 'class') || this.getAttribute(ele, 'className') || "";
            classes = classes + ' ' + classN + ' ';
            classes = classes.replace(/\s{2,}/g, ' ');
            ele.setAttribute('class', classes);
        }
    },
    removeClass: function(ele, classN) {
        if (this.hasClass(ele, classN)) {
            var classes = this.getAttribute(ele, 'class') || this.getAttribute(ele, 'className') || "";
            classes = classes.replace(classN, '');
            ele.setAttribute('class', classes);
        }
    },
    /*
    * The sort function. From http://my.opera.com/GreyWyvern/blog/show.dml/1671288
    */
    sorter: {
        alphanum: function(a,b,asc) {
            if (a === undefined || a === null) {
                a = "";
            }
            if (b === undefined || b === null) {
                b = "";
            }
            a = a.toString().replace(/&(lt|gt);/g, function (strMatch, p1){
                return (p1 == "lt")? "<" : ">";
            });
            a = a.replace(/<\/?[^>]+(>|$)/g, "");

            b = b.toString().replace(/&(lt|gt);/g, function (strMatch, p1){
                return (p1 == "lt")? "<" : ">";
            });
            b = b.replace(/<\/?[^>]+(>|$)/g, "");
            var aa = this.chunkify(a);
            var bb = this.chunkify(b);

            for (var x = 0; aa[x] && bb[x]; x++) {
                if (aa[x] !== bb[x]) {
                    var c = Number(aa[x]), d = Number(bb[x]);
                    if (asc) {
                        if (c == aa[x] && d == bb[x]) {
                            return c - d;
                        } else {
                            return (aa[x] > bb[x]) ? 1 : -1;
                        }
                    } else {
                        if (c == aa[x] && d == bb[x]) {
                            return d-c;//c - d;
                        } else {
                            return (aa[x] > bb[x]) ? -1 : 1; //(aa[x] > bb[x]) ? 1 : -1;
                        }
                    }
                }
            }
            return aa.length - bb.length;
        },
        chunkify: function(t) {
            var tz = [], x = 0, y = -1, n = 0, i, j;

            while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                var m = (i == 45 || i == 46 || (i >=48 && i <= 57));
                if (m !== n) {
                    tz[++y] = "";
                    n = m;
                }
                tz[y] += j;
            }
            return tz;
        }
    }
};

window.List = List;
window.ListJsHelpers = h;
})(window);

/*global define*/
(function (global, undefined) {
    "use strict";

    var document = global.document,
        Alertify;

    Alertify = function () {

        var _alertify = {},
            dialogs   = {},
            isopen    = false,
            keys      = { ENTER: 13, ESC: 27, SPACE: 32 },
            queue     = [],
            $, elCallee, elCover, elDialog, elLog, getTransitionEvent;

        /**
         * Markup pieces
         * @type {Object}
         */
        dialogs = {
            buttons : {
                holder : "<nav class=\"alertify-buttons\">{{buttons}}</nav>",
                submit : "<button type=\"submit\" class=\"alertify-button alertify-button-ok\" id=\"alertify-ok\" />{{ok}}</button>",
                ok     : "<a href=\"#\" class=\"alertify-button alertify-button-ok\" id=\"alertify-ok\">{{ok}}</a>",
                cancel : "<a href=\"#\" class=\"alertify-button alertify-button-cancel\" id=\"alertify-cancel\">{{cancel}}</a>"
            },
            input   : "<div class=\"alertify-text-wrapper\"><input type=\"text\" class=\"alertify-text\" id=\"alertify-text\"></div>",
            message : "<p class=\"alertify-message\">{{message}}</p>",
            log     : "<article class=\"alertify-log{{class}}\">{{message}}</article>"
        };

        /**
         * Return the proper transitionend event
         * @return {String}    Transition type string
         */
        getTransitionEvent = function () {
            var t,
                el = document.createElement("fakeelement"),
                transitions = {
                    "transition"       : "transitionend",
                    "OTransition"      : "otransitionend",
                    "MSTransition"     : "msTransitionEnd",
                    "MozTransition"    : "transitionend",
                    "WebkitTransition" : "webkitTransitionEnd"
                };

            for (t in transitions) {
                if (el.style[t] !== undefined) return transitions[t];
            }
        };

        /**
         * Shorthand for document.getElementById()
         *
         * @param  {String} id    A specific element ID
         * @return {Object}       HTML element
         */
        $ = function (id) {
            return document.getElementById(id);
        };

        /**
         * Alertify private object
         * @type {Object}
         */
        _alertify = {

            /**
             * Labels object
             * @type {Object}
             */
            labels : {
                ok     : "OK",
                cancel : "Cancel"
            },

            /**
             * Delay number
             * @type {Number}
             */
            delay : 5000,

            /**
             * Whether buttons are reversed (default is secondary/primary)
             * @type {Boolean}
             */
            buttonReverse : false,

            /**
             * Set the transition event on load
             * @type {[type]}
             */
            transition : undefined,

            /**
             * Set the proper button click events
             *
             * @param {Function} fn    [Optional] Callback function
             *
             * @return {undefined}
             */
            addListeners : function (fn) {
                var btnReset  = $("alertify-resetFocus"),
                    btnOK     = $("alertify-ok")     || undefined,
                    btnCancel = $("alertify-cancel") || undefined,
                    input     = $("alertify-text")   || undefined,
                    form      = $("alertify-form")   || undefined,
                    hasOK     = (typeof btnOK !== "undefined"),
                    hasCancel = (typeof btnCancel !== "undefined"),
                    hasInput  = (typeof input !== "undefined"),
                    val       = "",
                    self      = this,
                    ok, cancel, common, key, reset;

                // ok event handler
                ok = function (event) {
                    if (typeof event.preventDefault !== "undefined") event.preventDefault();
                    common(event);
                    if (typeof input !== "undefined") val = input.value;
                    if (typeof fn === "function") fn(true, val);
                };

                // cancel event handler
                cancel = function (event) {
                    if (typeof event.preventDefault !== "undefined") event.preventDefault();
                    common(event);
                    if (typeof fn === "function") fn(false);
                };

                // common event handler (keyup, ok and cancel)
                common = function (event) {
                    self.hide();
                    self.unbind(document.body, "keyup", key);
                    self.unbind(btnReset, "focus", reset);
                    if (hasInput) self.unbind(form, "submit", ok);
                    if (hasOK) self.unbind(btnOK, "click", ok);
                    if (hasCancel) self.unbind(btnCancel, "click", cancel);
                };

                // keyup handler
                key = function (event) {
                    var keyCode = event.keyCode;
                    if (keyCode === keys.SPACE && !hasInput) ok(event);
                    if (keyCode === keys.ESC && hasCancel) cancel(event);
                };

                // reset focus to first item in the dialog
                reset = function (event) {
                    if (hasInput) input.focus();
                    else if (hasCancel) btnCancel.focus();
                    else btnOK.focus();
                };

                // handle reset focus link
                // this ensures that the keyboard focus does not
                // ever leave the dialog box until an action has
                // been taken
                this.bind(btnReset, "focus", reset);
                // handle OK click
                if (hasOK) this.bind(btnOK, "click", ok);
                // handle Cancel click
                if (hasCancel) this.bind(btnCancel, "click", cancel);
                // listen for keys, Cancel => ESC
                this.bind(document.body, "keyup", key);
                // bind form submit
                if (hasInput) this.bind(form, "submit", ok);
                // set focus on OK button or the input text
                global.setTimeout(function () {
                    if (input) {
                        input.focus();
                        input.select();
                    }
                    else btnOK.focus();
                }, 50);
            },

            /**
             * Bind events to elements
             *
             * @param  {Object}   el       HTML Object
             * @param  {Event}    event    Event to attach to element
             * @param  {Function} fn       Callback function
             *
             * @return {undefined}
             */
            bind : function (el, event, fn) {
                if (typeof el.addEventListener === "function") {
                    el.addEventListener(event, fn, false);
                } else if (el.attachEvent) {
                    el.attachEvent("on" + event, fn);
                }
            },

            /**
             * Append button HTML strings
             *
             * @param {String} secondary    The secondary button HTML string
             * @param {String} primary      The primary button HTML string
             *
             * @return {String}             The appended button HTML strings
             */
            appendButtons : function (secondary, primary) {
                return this.buttonReverse ? primary + secondary : secondary + primary;
            },

            /**
             * Build the proper message box
             *
             * @param  {Object} item    Current object in the queue
             *
             * @return {String}         An HTML string of the message box
             */
            build : function (item) {
                var html    = "",
                    type    = item.type,
                    message = item.message,
                    css     = item.cssClass || "";

                html += "<div class=\"alertify-dialog\">";

                if (type === "prompt") html += "<form id=\"alertify-form\">";

                html += "<article class=\"alertify-inner\">";
                html += dialogs.message.replace("{{message}}", message);

                if (type === "prompt") html += dialogs.input;

                html += dialogs.buttons.holder;
                html += "</article>";

                if (type === "prompt") html += "</form>";

                html += "<a id=\"alertify-resetFocus\" class=\"alertify-resetFocus\" href=\"#\">Reset Focus</a>";
                html += "</div>";

                switch (type) {
                case "confirm":
                    html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.ok));
                    html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
                    break;
                case "prompt":
                    html = html.replace("{{buttons}}", this.appendButtons(dialogs.buttons.cancel, dialogs.buttons.submit));
                    html = html.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
                    break;
                case "alert":
                    html = html.replace("{{buttons}}", dialogs.buttons.ok);
                    html = html.replace("{{ok}}", this.labels.ok);
                    break;
                default:
                    break;
                }

                elDialog.className = "alertify alertify-show alertify-" + type + " " + css;
                elCover.className  = "alertify-cover";
                return html;
            },

            /**
             * Close the log messages
             *
             * @param  {Object} elem    HTML Element of log message to close
             * @param  {Number} wait    [optional] Time (in ms) to wait before automatically hiding the message, if 0 never hide
             *
             * @return {undefined}
             */
            close : function (elem, wait) {
                // Unary Plus: +"2" === 2
                var timer = (wait && !isNaN(wait)) ? +wait : this.delay,
                    self  = this,
                    removeElement;

                this.bind(elem, "click", function () {
                    elLog.removeChild(elem);
                });

                // Remove element after transition is done
                removeElement = function (event) {
                    event.stopPropagation();
                    // transitionend event gets fired for every property
                    // this ensures it only tries to remove the element once
                    if (event.propertyName === "opacity") elLog.removeChild(this);
                };

                // never close (until click) if wait is set to 0
                if (wait === 0) return;

                setTimeout(function () {
                    // ensure element exists
                    if (typeof elem !== "undefined" && elem.parentNode === elLog) {
                        // whether CSS transition exists
                        if (typeof self.transition !== "undefined") {
                            self.bind(elem, self.transition, removeElement);
                            elem.className += " alertify-log-hide";
                        } else {
                            elLog.removeChild(elem);
                        }
                    }
                }, timer);
            },

            /**
             * Create a dialog box
             *
             * @param  {String}   message        The message passed from the callee
             * @param  {String}   type           Type of dialog to create
             * @param  {Function} fn             [Optional] Callback function
             * @param  {String}   placeholder    [Optional] Default value for prompt input field
             * @param  {String}   cssClass       [Optional] Class(es) to append to dialog box
             *
             * @return {Object}
             */
            dialog : function (message, type, fn, placeholder, cssClass) {
                // set the current active element
                // this allows the keyboard focus to be resetted
                // after the dialog box is closed
                elCallee = document.activeElement;
                // check to ensure the alertify dialog element
                // has been successfully created
                var check = function () {
                    if (elDialog && elDialog.scrollTop !== null) return;
                    else check();
                };
                // error catching
                if (typeof message !== "string") throw new Error("message must be a string");
                if (typeof type !== "string") throw new Error("type must be a string");
                if (typeof fn !== "undefined" && typeof fn !== "function") throw new Error("fn must be a function");
                // initialize alertify if it hasn't already been done
                if (typeof this.init === "function") {
                    this.init();
                    check();
                }

                queue.push({ type: type, message: message, callback: fn, placeholder: placeholder, cssClass: cssClass });
                if (!isopen) this.setup();

                return this;
            },

            /**
             * Extend the log method to create custom methods
             *
             * @param  {String} type    Custom method name
             *
             * @return {Function}
             */
            extend : function (type) {
                if (typeof type !== "string") throw new Error("extend method must have exactly one paramter");
                return function (message, wait) {
                    this.log(message, type, wait);
                    return this;
                };
            },

            /**
             * Hide the dialog and rest to defaults
             *
             * @return {undefined}
             */
            hide : function () {
                // remove reference from queue
                queue.splice(0,1);
                // if items remaining in the queue
                if (queue.length > 0) this.setup();
                else {
                    isopen = false;
                    elDialog.className = "alertify alertify-hide alertify-hidden";
                    elCover.className  = "alertify-cover alertify-hidden";
                    // set focus to the last element or body
                    // after the dialog is closed
                    elCallee.focus();
                }
            },

            /**
             * Initialize Alertify
             * Create the 2 main elements
             *
             * @return {undefined}
             */
            init : function () {
                // ensure legacy browsers support html5 tags
                document.createElement("nav");
                document.createElement("article");
                document.createElement("section");
                // cover
                elCover = document.createElement("div");
                elCover.setAttribute("id", "alertify-cover");
                elCover.className = "alertify-cover alertify-hidden";
                document.body.appendChild(elCover);
                // main element
                elDialog = document.createElement("section");
                elDialog.setAttribute("id", "alertify");
                elDialog.className = "alertify alertify-hidden";
                document.body.appendChild(elDialog);
                // log element
                elLog = document.createElement("section");
                elLog.setAttribute("id", "alertify-logs");
                elLog.className = "alertify-logs";
                document.body.appendChild(elLog);
                // set tabindex attribute on body element
                // this allows script to give it focus
                // after the dialog is closed
                document.body.setAttribute("tabindex", "0");
                // set transition type
                this.transition = getTransitionEvent();
                // clean up init method
                delete this.init;
            },

            /**
             * Show a new log message box
             *
             * @param  {String} message    The message passed from the callee
             * @param  {String} type       [Optional] Optional type of log message
             * @param  {Number} wait       [Optional] Time (in ms) to wait before auto-hiding the log
             *
             * @return {Object}
             */
            log : function (message, type, wait) {
                // check to ensure the alertify dialog element
                // has been successfully created
                var check = function () {
                    if (elLog && elLog.scrollTop !== null) return;
                    else check();
                };
                // initialize alertify if it hasn't already been done
                if (typeof this.init === "function") {
                    this.init();
                    check();
                }
                this.notify(message, type, wait);
                return this;
            },

            /**
             * Add new log message
             * If a type is passed, a class name "alertify-log-{type}" will get added.
             * This allows for custom look and feel for various types of notifications.
             *
             * @param  {String} message    The message passed from the callee
             * @param  {String} type       [Optional] Type of log message
             * @param  {Number} wait       [Optional] Time (in ms) to wait before auto-hiding
             *
             * @return {undefined}
             */
            notify : function (message, type, wait) {
                var log = document.createElement("article");
                log.className = "alertify-log" + ((typeof type === "string" && type !== "") ? " alertify-log-" + type : "");
                log.innerHTML = message;
                // prepend child

                elLog.insertBefore(log);
                // triggers the CSS animation
                setTimeout(function() { log.className = log.className + " alertify-log-show"; }, 50);
                this.close(log, wait);
            },

            /**
             * Set properties
             *
             * @param {Object} args     Passing parameters
             *
             * @return {undefined}
             */
            set : function (args) {
                var k;
                // error catching
                if (typeof args !== "object" && args instanceof Array) throw new Error("args must be an object");
                // set parameters
                for (k in args) {
                    if (args.hasOwnProperty(k)) {
                        this[k] = args[k];
                    }
                }
            },

            /**
             * Initiate all the required pieces for the dialog box
             *
             * @return {undefined}
             */
            setup : function () {
                var item = queue[0];

                isopen = true;
                elDialog.innerHTML = this.build(item);
                if (typeof item.placeholder === "string" && item.placeholder !== "") $("alertify-text").value = item.placeholder;
                this.addListeners(item.callback);
            },

            /**
             * Unbind events to elements
             *
             * @param  {Object}   el       HTML Object
             * @param  {Event}    event    Event to detach to element
             * @param  {Function} fn       Callback function
             *
             * @return {undefined}
             */
            unbind : function (el, event, fn) {
                if (typeof el.removeEventListener === "function") {
                    el.removeEventListener(event, fn, false);
                } else if (el.detachEvent) {
                    el.detachEvent("on" + event, fn);
                }
            }
        };

        return {
            alert   : function (message, fn, cssClass) { _alertify.dialog(message, "alert", fn, "", cssClass); return this; },
            confirm : function (message, fn, cssClass) { _alertify.dialog(message, "confirm", fn, "", cssClass); return this; },
            extend  : _alertify.extend,
            init    : _alertify.init,
            log     : function (message, type, wait) { _alertify.log(message, type, wait); return this; },
            prompt  : function (message, fn, placeholder, cssClass) { _alertify.dialog(message, "prompt", fn, placeholder, cssClass); return this; },
            success : function (message, wait) { _alertify.log(message, "success", wait); return this; },
            error   : function (message, wait) { _alertify.log(message, "error", wait); return this; },
            set     : function (args) { _alertify.set(args); },
            labels  : _alertify.labels
        };
    };

    // AMD and window support
    if (typeof define === "function") {
        define([], function () { return new Alertify(); });
    } else {
        if (typeof global.alertify === "undefined") {
            global.alertify = new Alertify();
        }
    }

}(this));
