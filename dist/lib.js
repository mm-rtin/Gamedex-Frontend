// Underscore.js 1.3.1
// (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){function q(a,c,d){if(a===c)return a!==0||1/a==1/c;if(a==null||c==null)return a===c;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual&&b.isFunction(a.isEqual))return a.isEqual(c);if(c.isEqual&&b.isFunction(c.isEqual))return c.isEqual(a);var e=l.call(a);if(e!=l.call(c))return false;switch(e){case "[object String]":return a==String(c);case "[object Number]":return a!=+a?c!=+c:a==0?1/a==1/c:a==+c;case "[object Date]":case "[object Boolean]":return+a==+c;case "[object RegExp]":return a.source==
c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase}if(typeof a!="object"||typeof c!="object")return false;for(var f=d.length;f--;)if(d[f]==a)return true;d.push(a);var f=0,g=true;if(e=="[object Array]"){if(f=a.length,g=f==c.length)for(;f--;)if(!(g=f in a==f in c&&q(a[f],c[f],d)))break}else{if("constructor"in a!="constructor"in c||a.constructor!=c.constructor)return false;for(var h in a)if(b.has(a,h)&&(f++,!(g=b.has(c,h)&&q(a[h],c[h],d))))break;if(g){for(h in c)if(b.has(c,
h)&&!f--)break;g=!f}}d.pop();return g}var r=this,G=r._,n={},k=Array.prototype,o=Object.prototype,i=k.slice,H=k.unshift,l=o.toString,I=o.hasOwnProperty,w=k.forEach,x=k.map,y=k.reduce,z=k.reduceRight,A=k.filter,B=k.every,C=k.some,p=k.indexOf,D=k.lastIndexOf,o=Array.isArray,J=Object.keys,s=Function.prototype.bind,b=function(a){return new m(a)};if(typeof exports!=="undefined"){if(typeof module!=="undefined"&&module.exports)exports=module.exports=b;exports._=b}else r._=b;b.VERSION="1.3.1";var j=b.each=
b.forEach=function(a,c,d){if(a!=null)if(w&&a.forEach===w)a.forEach(c,d);else if(a.length===+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(d,a[e],e,a)===n)break}else for(e in a)if(b.has(a,e)&&c.call(d,a[e],e,a)===n)break};b.map=b.collect=function(a,c,b){var e=[];if(a==null)return e;if(x&&a.map===x)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});if(a.length===+a.length)e.length=a.length;return e};b.reduce=b.foldl=b.inject=function(a,c,d,e){var f=arguments.length>2;a==
null&&(a=[]);if(y&&a.reduce===y)return e&&(c=b.bind(c,e)),f?a.reduce(c,d):a.reduce(c);j(a,function(a,b,i){f?d=c.call(e,d,a,b,i):(d=a,f=true)});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(z&&a.reduceRight===z)return e&&(c=b.bind(c,e)),f?a.reduceRight(c,d):a.reduceRight(c);var g=b.toArray(a).reverse();e&&!f&&(c=b.bind(c,e));return f?b.reduce(g,c,d,e):b.reduce(g,c)};b.find=b.detect=
function(a,c,b){var e;E(a,function(a,g,h){if(c.call(b,a,g,h))return e=a,true});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(A&&a.filter===A)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=true;if(a==null)return e;if(B&&a.every===B)return a.every(c,b);j(a,function(a,g,h){if(!(e=
e&&c.call(b,a,g,h)))return n});return e};var E=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=false;if(a==null)return e;if(C&&a.some===C)return a.some(c,d);j(a,function(a,b,h){if(e||(e=c.call(d,a,b,h)))return n});return!!e};b.include=b.contains=function(a,c){var b=false;if(a==null)return b;return p&&a.indexOf===p?a.indexOf(c)!=-1:b=E(a,function(a){return a===c})};b.invoke=function(a,c){var d=i.call(arguments,2);return b.map(a,function(a){return(b.isFunction(c)?c||a:a[c]).apply(a,d)})};b.pluck=
function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&(e={value:a,computed:b})});
return e.value};b.shuffle=function(a){var b=[],d;j(a,function(a,f){f==0?b[0]=a:(d=Math.floor(Math.random()*(f+1)),b[f]=b[d],b[d]=a)});return b};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,g){return{value:a,criteria:c.call(d,a,b,g)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")};b.groupBy=function(a,c){var d={},e=b.isFunction(c)?c:function(a){return a[c]};j(a,function(a,b){var c=e(a,b);(d[c]||(d[c]=[])).push(a)});return d};b.sortedIndex=function(a,
c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:a.toArray?a.toArray():b.isArray(a)?i.call(a):b.isArguments(a)?i.call(a):b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};b.initial=function(a,b,d){return i.call(a,0,a.length-(b==null||d?1:b))};b.last=function(a,b,d){return b!=null&&!d?i.call(a,Math.max(a.length-b,0)):a[a.length-1]};b.rest=
b.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a,c){return b.reduce(a,function(a,e){if(b.isArray(e))return a.concat(c?e:b.flatten(e));a[a.length]=e;return a},[])};b.without=function(a){return b.difference(a,i.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,e=[];b.reduce(d,function(d,g,h){if(0==h||(c===true?b.last(d)!=g:!b.include(d,g)))d[d.length]=g,e[e.length]=a[h];return d},[]);
return e};b.union=function(){return b.uniq(b.flatten(arguments,true))};b.intersection=b.intersect=function(a){var c=i.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a){var c=b.flatten(i.call(arguments,1));return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,c,
d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(p&&a.indexOf===p)return a.indexOf(c);for(d=0,e=a.length;d<e;d++)if(d in a&&a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(D&&a.lastIndexOf===D)return a.lastIndexOf(b);for(var d=a.length;d--;)if(d in a&&a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};
var F=function(){};b.bind=function(a,c){var d,e;if(a.bind===s&&s)return s.apply(a,i.call(arguments,1));if(!b.isFunction(a))throw new TypeError;e=i.call(arguments,2);return d=function(){if(!(this instanceof d))return a.apply(c,e.concat(i.call(arguments)));F.prototype=a.prototype;var b=new F,g=a.apply(b,e.concat(i.call(arguments)));return Object(g)===g?g:b}};b.bindAll=function(a){var c=i.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,
c){var d={};c||(c=b.identity);return function(){var e=c.apply(this,arguments);return b.has(d,e)?d[e]:d[e]=a.apply(this,arguments)}};b.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)))};b.throttle=function(a,c){var d,e,f,g,h,i=b.debounce(function(){h=g=false},c);return function(){d=this;e=arguments;var b;f||(f=setTimeout(function(){f=null;h&&a.apply(d,e);i()},c));g?h=true:
a.apply(d,e);i();g=true}};b.debounce=function(a,b){var d;return function(){var e=this,f=arguments;clearTimeout(d);d=setTimeout(function(){d=null;a.apply(e,f)},b)}};b.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments,0));return b.apply(this,d)}};b.compose=function(){var a=arguments;return function(){for(var b=arguments,d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};
b.after=function(a,b){return a<=0?b():function(){if(--a<1)return b.apply(this,arguments)}};b.keys=J||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var c=[],d;for(d in a)b.has(a,d)&&(c[c.length]=d);return c};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]=b[d]});return a};b.defaults=function(a){j(i.call(arguments,
1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return!b.isObject(a)?a:b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,b){return q(a,b,[])};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(b.has(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=o||function(a){return l.call(a)=="[object Array]"};b.isObject=function(a){return a===Object(a)};
b.isArguments=function(a){return l.call(a)=="[object Arguments]"};if(!b.isArguments(arguments))b.isArguments=function(a){return!(!a||!b.has(a,"callee"))};b.isFunction=function(a){return l.call(a)=="[object Function]"};b.isString=function(a){return l.call(a)=="[object String]"};b.isNumber=function(a){return l.call(a)=="[object Number]"};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===true||a===false||l.call(a)=="[object Boolean]"};b.isDate=function(a){return l.call(a)=="[object Date]"};
b.isRegExp=function(a){return l.call(a)=="[object RegExp]"};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.has=function(a,b){return I.call(a,b)};b.noConflict=function(){r._=G;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};b.mixin=function(a){j(b.functions(a),
function(c){K(c,b[c]=a[c])})};var L=0;b.uniqueId=function(a){var b=L++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var t=/.^/,u=function(a){return a.replace(/\\\\/g,"\\").replace(/\\'/g,"'")};b.template=function(a,c){var d=b.templateSettings,d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.escape||t,function(a,b){return"',_.escape("+
u(b)+"),'"}).replace(d.interpolate||t,function(a,b){return"',"+u(b)+",'"}).replace(d.evaluate||t,function(a,b){return"');"+u(b).replace(/[\r\n\t]/g," ")+";__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');",e=new Function("obj","_",d);return c?e(c,b):function(a){return e.call(this,a,b)}};b.chain=function(a){return b(a).chain()};var m=function(a){this._wrapped=a};b.prototype=m.prototype;var v=function(a,c){return c?b(a).chain():a},K=function(a,c){m.prototype[a]=
function(){var a=i.call(arguments);H.call(a,this._wrapped);return v(c.apply(b,a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=k[a];m.prototype[a]=function(){var d=this._wrapped;b.apply(d,arguments);var e=d.length;(a=="shift"||a=="splice")&&e===0&&delete d[0];return v(d,this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];m.prototype[a]=function(){return v(b.apply(this._wrapped,arguments),this._chain)}});m.prototype.chain=function(){this._chain=
true;return this};m.prototype.value=function(){return this._wrapped}}).call(this);



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

  // Class initializers and isClass type helpers

  var ClassNames = 'Array,Boolean,Date,Function,Number,String,RegExp'.split(',');

  var isArray    = buildClassCheck(ClassNames[0]);
  var isBoolean  = buildClassCheck(ClassNames[1]);
  var isDate     = buildClassCheck(ClassNames[2]);
  var isFunction = buildClassCheck(ClassNames[3]);
  var isNumber   = buildClassCheck(ClassNames[4]);
  var isString   = buildClassCheck(ClassNames[5]);
  var isRegExp   = buildClassCheck(ClassNames[6]);

  function buildClassCheck(type) {
    return function(obj) {
      return isClass(obj, type);
    }
  }

  function isClass(obj, str) {
    return object.prototype.toString.call(obj) === '[object '+str+']';
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
    var result = [], i = 0;
    for(i = 0; i < args.length; i++) {
      result.push(args[i]);
      if(fn) fn.call(args, args[i], i);
    }
    return result;
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
    return !!obj && isClass(obj, 'Object') && string(obj.constructor) === string(object);
  }

  function hasOwnProperty(obj, key) {
    return object['hasOwnProperty'].call(obj, key);
  }

  function iterateOverObject(obj, fn) {
    var key;
    for(key in obj) {
      if(!hasOwnProperty(obj, key)) continue;
      if(fn.call(obj, key, obj[key]) === false) break;
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
    var value, klass, isObject, isArray, arr, i, key, type = typeof thing;

    // Return quickly if string to save cycles
    if(type === 'string') return thing;

    klass    = object.prototype.toString.call(thing)
    isObject = klass === '[object Object]';
    isArray  = klass === '[object Array]';

    if(thing != null && isObject || isArray) {
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
      arr = isArray ? thing : object.keys(thing).sort();
      for(i = 0; i < arr.length; i++) {
        key = isArray ? i : arr[i];
        value += key + stringify(thing[key], stack);
      }
      stack.pop();
    } else if(1 / thing === -Infinity) {
      value = '-0';
    } else {
      value = string(thing && thing.valueOf());
    }
    return type + klass + value;
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
      return function() {
        fn.cancel();
        setDelay(fn, ms, fn, this, arguments);
      }
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

// Generated by CoffeeScript 1.3.3

(function($, window, document) {
  "use strict";

  var BROWSER_IS_IE7, BROWSER_SCROLLBAR_WIDTH, DOMSCROLL, DOWN, DRAG, KEYDOWN, KEYS, KEYSTATES, KEYUP, MOUSEDOWN, MOUSEMOVE, MOUSEUP, MOUSEWHEEL, NanoScroll, PANEDOWN, RESIZE, SCROLL, SCROLLBAR, TOUCHMOVE, UP, WHEEL, defaults, getBrowserScrollbarWidth;
  defaults = {
    paneClass: 'pane',
    sliderClass: 'slider',
    sliderMinHeight: 20,
    contentClass: 'content',
    iOSNativeScrolling: false,
    preventPageScrolling: false,
    disableResize: false,
    alwaysVisible: false,
    flashDelay: 1500
  };
  SCROLLBAR = 'scrollbar';
  SCROLL = 'scroll';
  MOUSEDOWN = 'mousedown';
  MOUSEMOVE = 'mousemove';
  MOUSEWHEEL = 'mousewheel';
  MOUSEUP = 'mouseup';
  RESIZE = 'resize';
  DRAG = 'drag';
  UP = 'up';
  PANEDOWN = 'panedown';
  DOMSCROLL = 'DOMMouseScroll';
  DOWN = 'down';
  WHEEL = 'wheel';
  KEYDOWN = 'keydown';
  KEYUP = 'keyup';
  TOUCHMOVE = 'touchmove';
  BROWSER_IS_IE7 = window.navigator.appName === 'Microsoft Internet Explorer' && /msie 7./i.test(window.navigator.appVersion) && window.ActiveXObject;
  BROWSER_SCROLLBAR_WIDTH = null;
  KEYSTATES = {};
  KEYS = {
    up: 38,
    down: 40,
    pgup: 33,
    pgdown: 34,
    home: 36,
    end: 35
  };
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
  NanoScroll = (function() {

    function NanoScroll(el, options) {
      this.options = options;
      BROWSER_SCROLLBAR_WIDTH || (BROWSER_SCROLLBAR_WIDTH = getBrowserScrollbarWidth());
      this.el = $(el);
      this.doc = $(document);
      this.win = $(window);
      this.generate();
      this.createEvents();
      this.addEvents();
      this.reset();
    }

    NanoScroll.prototype.preventScrolling = function(e, direction) {
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

    NanoScroll.prototype.updateScrollValues = function() {
      var content;
      content = this.content[0];
      this.maxScrollTop = content.scrollHeight - content.clientHeight;
      this.contentScrollTop = content.scrollTop;
      this.maxSliderTop = this.paneOuterHeight - this.sliderHeight;
      this.sliderTop = this.contentScrollTop * this.maxSliderTop / this.maxScrollTop;
    };

    NanoScroll.prototype.handleKeyPress = function(key) {
      var percentage, scrollLength, sliderY;
      if (key === KEYS.up || key === KEYS.pgup || key === KEYS.down || key === KEYS.pgdown) {
        scrollLength = key === KEYS.up || key === KEYS.down ? 40 : this.paneHeight * 0.9;
        percentage = scrollLength / (this.contentHeight - this.paneHeight) * 100;
        sliderY = (percentage * this.maxSliderTop) / 100;
        this.sliderY = key === KEYS.up || key === KEYS.pgup ? this.sliderY - sliderY : this.sliderY + sliderY;
        this.scroll();
      } else if (key === KEYS.home || key === KEYS.end) {
        this.sliderY = key === KEYS.home ? 0 : this.maxSliderTop;
        this.scroll();
      }
    };

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
          _this.sliderY = e.pageY - _this.el.offset().top - _this.offsetY;
          _this.scroll();
          _this.updateScrollValues();
          if (_this.contentScrollTop >= _this.maxScrollTop) {
            _this.el.trigger('scrollend');
          } else if (_this.contentScrollTop === 0) {
            _this.el.trigger('scrolltop');
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
            _this.el.trigger('scrollend');
          } else if (_this.contentScrollTop === 0) {
            if (_this.options.preventPageScrolling) {
              _this.preventScrolling(e, UP);
            }
            _this.el.trigger('scrolltop');
          }
        },
        wheel: function(e) {
          if (e == null) {
            return;
          }
          _this.sliderY += -e.wheelDeltaY || -e.delta;
          _this.scroll();
          return false;
        },
        keydown: function(e) {
          var key;
          if (e == null) {
            return;
          }
          key = e.which;
          if (key === KEYS.up || key === KEYS.pgup || key === KEYS.down || key === KEYS.pgdown || key === KEYS.home || key === KEYS.end) {
            _this.sliderY = isNaN(_this.sliderY) ? 0 : _this.sliderY;
            KEYSTATES[key] = setTimeout(function() {
              _this.handleKeyPress(key);
            }, 100);
            e.preventDefault();
          }
        },
        keyup: function(e) {
          var key;
          if (e == null) {
            return;
          }
          key = e.which;
          _this.handleKeyPress(key);
          if (KEYSTATES[key] != null) {
            clearTimeout(KEYSTATES[key]);
          }
        }
      };
    };

    NanoScroll.prototype.addEvents = function() {
      var events;
      events = this.events;
      if (!this.options.disableResize) {
        this.win.bind(RESIZE, events[RESIZE]);
      }
      this.slider.bind(MOUSEDOWN, events[DOWN]);
      this.pane.bind(MOUSEDOWN, events[PANEDOWN]).bind(MOUSEWHEEL, events[WHEEL]).bind(DOMSCROLL, events[WHEEL]);
      this.content.bind(MOUSEWHEEL, events[SCROLL]).bind(DOMSCROLL, events[SCROLL]).bind(TOUCHMOVE, events[SCROLL]).bind(KEYDOWN, events[KEYDOWN]).bind(KEYUP, events[KEYUP]);
    };

    NanoScroll.prototype.removeEvents = function() {
      var events;
      events = this.events;
      if (!this.options.disableResize) {
        this.win.unbind(RESIZE, events[RESIZE]);
      }
      this.slider.unbind(MOUSEDOWN, events[DOWN]);
      this.pane.unbind(MOUSEDOWN, events[PANEDOWN]).unbind(MOUSEWHEEL, events[WHEEL]).unbind(DOMSCROLL, events[WHEEL]);
      this.content.unbind(MOUSEWHEEL, events[SCROLL]).unbind(DOMSCROLL, events[SCROLL]).unbind(TOUCHMOVE, events[SCROLL]).unbind(KEYDOWN, events[KEYDOWN]).unbind(KEYUP, events[KEYUP]);
    };

    NanoScroll.prototype.generate = function() {
      var contentClass, cssRule, options, paneClass, sliderClass;
      options = this.options;
      paneClass = options.paneClass, sliderClass = options.sliderClass, contentClass = options.contentClass;
      this.el.append("<div class=\"" + paneClass + "\"><div class=\"" + sliderClass + "\" /></div>");
      this.content = this.el.children("." + contentClass);
      this.content.attr('tabindex', 0);
      this.slider = this.el.find("." + sliderClass);
      this.pane = this.el.find("." + paneClass);
      if (BROWSER_SCROLLBAR_WIDTH) {
        cssRule = {
          right: -BROWSER_SCROLLBAR_WIDTH
        };
        this.el.addClass('has-scrollbar');
      }
      if (options.iOSNativeScrolling) {
        if (cssRule == null) {
          cssRule = {};
        }
        cssRule.WebkitOverflowScrolling = 'touch';
      }
      if (cssRule != null) {
        this.content.css(cssRule);
      }
      if (options.alwaysVisible) {
        this.pane.css({
          opacity: 1,
          visibility: 'visible'
        });
      }
      return this;
    };

    NanoScroll.prototype.restore = function() {
      this.stopped = false;
      this.pane.show();
      return this.addEvents();
    };

    NanoScroll.prototype.reset = function() {
      var content, contentHeight, contentStyle, contentStyleOverflowY, paneBottom, paneHeight, paneOuterHeight, paneTop, sliderHeight;
      if (!this.el.find("." + this.options.paneClass).length) {
        this.generate().stop();
      }
      if (this.stopped) {
        this.restore();
      }
      content = this.content[0];
      contentStyle = content.style;
      contentStyleOverflowY = contentStyle.overflowY;
      if (BROWSER_IS_IE7) {
        this.content.css({
          height: this.content.height()
        });
      }
      contentHeight = content.scrollHeight + BROWSER_SCROLLBAR_WIDTH;
      paneHeight = this.pane.outerHeight();
      paneTop = parseInt(this.pane.css('top'), 10);
      paneBottom = parseInt(this.pane.css('bottom'), 10);
      paneOuterHeight = paneHeight + paneTop + paneBottom;
      sliderHeight = Math.round(paneOuterHeight / contentHeight * paneOuterHeight);
      sliderHeight = sliderHeight > this.options.sliderMinHeight ? sliderHeight : this.options.sliderMinHeight;
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
      if (this.paneOuterHeight >= content.scrollHeight && contentStyleOverflowY !== SCROLL) {
        this.pane.hide();
      } else if (this.el.height() === content.scrollHeight && contentStyleOverflowY === SCROLL) {
        this.slider.hide();
      } else {
        this.slider.show();
      }
      return this;
    };

    NanoScroll.prototype.scroll = function() {
      this.sliderY = Math.max(0, this.sliderY);
      this.sliderY = Math.min(this.maxSliderTop, this.sliderY);
      this.content.scrollTop((this.paneHeight - this.contentHeight + BROWSER_SCROLLBAR_WIDTH) * this.sliderY / this.maxSliderTop * -1);
      this.slider.css({
        top: this.sliderY
      });
      return this;
    };

    NanoScroll.prototype.scrollBottom = function(offsetY) {
      this.reset();
      this.content.scrollTop(this.contentHeight - this.content.height() - offsetY).trigger(MOUSEWHEEL);
      return this;
    };

    NanoScroll.prototype.scrollTop = function(offsetY) {
      this.reset();
      this.content.scrollTop(+offsetY).trigger(MOUSEWHEEL);
      return this;
    };

    NanoScroll.prototype.scrollTo = function(node) {
      var fraction, new_slider, offset;
      this.reset();
      offset = $(node).offset().top;
      if (offset > this.maxSliderTop) {
        fraction = offset / this.contentHeight;
        new_slider = this.maxSliderTop * fraction;
        this.sliderY = new_slider;
        this.scroll();
      }
      return this;
    };

    NanoScroll.prototype.stop = function() {
      this.stopped = true;
      this.removeEvents();
      this.pane.hide();
      return this;
    };

    NanoScroll.prototype.flash = function() {
      var _this = this;
      this.pane.addClass('flashed');
      setTimeout(function() {
        _this.pane.removeClass('flashed');
      }, this.options.flashDelay);
      return this;
    };

    return NanoScroll;

  })();
  $.fn.nanoScroller = function(settings) {
    var flash, options, scroll, scrollBottom, scrollTo, scrollTop, stop;
    if (settings != null) {
      scrollBottom = settings.scrollBottom, scrollTop = settings.scrollTop, scrollTo = settings.scrollTo, scroll = settings.scroll, stop = settings.stop, flash = settings.flash;
    }
    options = $.extend({}, defaults, settings);
    this.each(function() {
      var me, scrollbar;
      me = this;
      scrollbar = $.data(me, SCROLLBAR);
      if (!scrollbar) {
        scrollbar = new NanoScroll(me, options);
        $.data(me, SCROLLBAR, scrollbar);
      } else {
        $.extend(scrollbar.options, settings);
      }
      if (scrollBottom) {
        return scrollbar.scrollBottom(scrollBottom);
      }
      if (scrollTop) {
        return scrollbar.scrollTop(scrollTop);
      }
      if (scrollTo) {
        return scrollbar.scrollTo(scrollTo);
      }
      if (scroll === 'bottom') {
        return scrollbar.scrollBottom(0);
      }
      if (scroll === 'top') {
        return scrollbar.scrollTop(0);
      }
      if (scroll instanceof $) {
        return scrollbar.scrollTo(scroll);
      }
      if (stop) {
        return scrollbar.stop();
      }
      if (flash) {
        return scrollbar.flash();
      }
      return scrollbar.reset();
    });
  };
})(jQuery, window, document);
/**
 * Isotope v1.5.12
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2012 David DeSandro / Metafizzy
 */
(function(a,b,c){"use strict";var d=a.document,e=a.Modernizr,f=function(a){return a.charAt(0).toUpperCase()+a.slice(1)},g="Moz Webkit O Ms".split(" "),h=function(a){var b=d.documentElement.style,c;if(typeof b[a]=="string")return a;a=f(a);for(var e=0,h=g.length;e<h;e++){c=g[e]+a;if(typeof b[c]=="string")return c}},i=h("transform"),j=h("transitionProperty"),k={csstransforms:function(){return!!i},csstransforms3d:function(){var a=!!h("perspective");if(a){var c=" -o- -moz- -ms- -webkit- -khtml- ".split(" "),d="@media ("+c.join("transform-3d),(")+"modernizr)",e=b("<style>"+d+"{#modernizr{height:3px}}"+"</style>").appendTo("head"),f=b('<div id="modernizr" />').appendTo("html");a=f.height()===3,f.remove(),e.remove()}return a},csstransitions:function(){return!!j}},l;if(e)for(l in k)e.hasOwnProperty(l)||e.addTest(l,k[l]);else{e=a.Modernizr={_version:"1.6ish: miniModernizr for Isotope"};var m=" ",n;for(l in k)n=k[l](),e[l]=n,m+=" "+(n?"":"no-")+l;b("html").addClass(m)}if(e.csstransforms){var o=e.csstransforms3d?{translate:function(a){return"translate3d("+a[0]+"px, "+a[1]+"px, 0) "},scale:function(a){return"scale3d("+a+", "+a+", 1) "}}:{translate:function(a){return"translate("+a[0]+"px, "+a[1]+"px) "},scale:function(a){return"scale("+a+") "}},p=function(a,c,d){var e=b.data(a,"isoTransform")||{},f={},g,h={},j;f[c]=d,b.extend(e,f);for(g in e)j=e[g],h[g]=o[g](j);var k=h.translate||"",l=h.scale||"",m=k+l;b.data(a,"isoTransform",e),a.style[i]=m};b.cssNumber.scale=!0,b.cssHooks.scale={set:function(a,b){p(a,"scale",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.scale?d.scale:1}},b.fx.step.scale=function(a){b.cssHooks.scale.set(a.elem,a.now+a.unit)},b.cssNumber.translate=!0,b.cssHooks.translate={set:function(a,b){p(a,"translate",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.translate?d.translate:[0,0]}}}var q,r;e.csstransitions&&(q={WebkitTransitionProperty:"webkitTransitionEnd",MozTransitionProperty:"transitionend",OTransitionProperty:"oTransitionEnd",transitionProperty:"transitionEnd"}[j],r=h("transitionDuration"));var s=b.event,t;s.special.smartresize={setup:function(){b(this).bind("resize",s.special.smartresize.handler)},teardown:function(){b(this).unbind("resize",s.special.smartresize.handler)},handler:function(a,b){var c=this,d=arguments;a.type="smartresize",t&&clearTimeout(t),t=setTimeout(function(){jQuery.event.handle.apply(c,d)},b==="execAsap"?0:100)}},b.fn.smartresize=function(a){return a?this.bind("smartresize",a):this.trigger("smartresize",["execAsap"])},b.Isotope=function(a,c,d){this.element=b(c),this._create(a),this._init(d)};var u=["overflow","position","width","height"],v=b(a);b.Isotope.settings={resizable:!0,layoutMode:"masonry",containerClass:"isotope",itemClass:"isotope-item",hiddenClass:"isotope-hidden",hiddenStyle:{opacity:0,scale:.001},visibleStyle:{opacity:1,scale:1},animationEngine:"best-available",animationOptions:{queue:!1,duration:800},sortBy:"original-order",sortAscending:!0,resizesContainer:!0,transformsEnabled:!b.browser.opera,itemPositionDataEnabled:!1},b.Isotope.prototype={_create:function(a){this.options=b.extend({},b.Isotope.settings,a),this.styleQueue=[],this.elemCount=0;var c=this.element[0].style;this.originalStyle={};for(var d=0,e=u.length;d<e;d++){var f=u[d];this.originalStyle[f]=c[f]||""}this.element.css({overflow:"hidden",position:"relative"}),this._updateAnimationEngine(),this._updateUsingTransforms();var g={"original-order":function(a,b){b.elemCount++;return b.elemCount},random:function(){return Math.random()}};this.options.getSortData=b.extend(this.options.getSortData,g),this.reloadItems(),this.offset={left:parseInt(this.element.css("padding-left"),10),top:parseInt(this.element.css("padding-top"),10)};var h=this;setTimeout(function(){h.element.addClass(h.options.containerClass)},0),this.options.resizable&&v.bind("smartresize.isotope",function(){h.resize()}),this.element.delegate("."+this.options.hiddenClass,"click",function(){return!1})},_getAtoms:function(a){var b=this.options.itemSelector,c=b?a.filter(b).add(a.find(b)):a,d={position:"absolute"};this.usingTransforms&&(d.left=0,d.top=0),c.css(d).addClass(this.options.itemClass),this.updateSortData(c,!0);return c},_init:function(a){this.$filteredAtoms=this._filter(this.$allAtoms),this._sort(),this.reLayout(a)},option:function(a){if(b.isPlainObject(a)){this.options=b.extend(!0,this.options,a);var c;for(var d in a)c="_update"+f(d),this[c]&&this[c]()}},_updateAnimationEngine:function(){var a=this.options.animationEngine.toLowerCase().replace(/[ _\-]/g,""),b;switch(a){case"css":case"none":b=!1;break;case"jquery":b=!0;break;default:b=!e.csstransitions}this.isUsingJQueryAnimation=b,this._updateUsingTransforms()},_updateTransformsEnabled:function(){this._updateUsingTransforms()},_updateUsingTransforms:function(){var a=this.usingTransforms=this.options.transformsEnabled&&e.csstransforms&&e.csstransitions&&!this.isUsingJQueryAnimation;a||(delete this.options.hiddenStyle.scale,delete this.options.visibleStyle.scale),this.getPositionStyles=a?this._translate:this._positionAbs},_filter:function(a){var b=this.options.filter===""?"*":this.options.filter;if(!b)return a;var c=this.options.hiddenClass,d="."+c,e=a.filter(d),f=e;if(b!=="*"){f=e.filter(b);var g=a.not(d).not(b).addClass(c);this.styleQueue.push({$el:g,style:this.options.hiddenStyle})}this.styleQueue.push({$el:f,style:this.options.visibleStyle}),f.removeClass(c);return a.filter(b)},updateSortData:function(a,c){var d=this,e=this.options.getSortData,f,g;a.each(function(){f=b(this),g={};for(var a in e)!c&&a==="original-order"?g[a]=b.data(this,"isotope-sort-data")[a]:g[a]=e[a](f,d);b.data(this,"isotope-sort-data",g)})},_sort:function(){var a=this.options.sortBy,b=this._getSorter,c=this.options.sortAscending?1:-1,d=function(d,e){var f=b(d,a),g=b(e,a);f===g&&a!=="original-order"&&(f=b(d,"original-order"),g=b(e,"original-order"));return(f>g?1:f<g?-1:0)*c};this.$filteredAtoms.sort(d)},_getSorter:function(a,c){return b.data(a,"isotope-sort-data")[c]},_translate:function(a,b){return{translate:[a,b]}},_positionAbs:function(a,b){return{left:a,top:b}},_pushPosition:function(a,b,c){b+=this.offset.left,c+=this.offset.top;var d=this.getPositionStyles(b,c);this.styleQueue.push({$el:a,style:d}),this.options.itemPositionDataEnabled&&a.data("isotope-item-position",{x:b,y:c})},layout:function(a,b){var c=this.options.layoutMode;this["_"+c+"Layout"](a);if(this.options.resizesContainer){var d=this["_"+c+"GetContainerSize"]();this.styleQueue.push({$el:this.element,style:d})}this._processStyleQueue(a,b),this.isLaidOut=!0},_processStyleQueue:function(a,c){var d=this.isLaidOut?this.isUsingJQueryAnimation?"animate":"css":"css",f=this.options.animationOptions,g=this.options.onLayout,h,i,j,k;i=function(a,b){b.$el[d](b.style,f)};if(this._isInserting&&this.isUsingJQueryAnimation)i=function(a,b){h=b.$el.hasClass("no-transition")?"css":d,b.$el[h](b.style,f)};else if(c||g||f.complete){var l=!1,m=[c,g,f.complete],n=this;j=!0,k=function(){if(!l){var b;for(var c=0,d=m.length;c<d;c++)b=m[c],typeof b=="function"&&b.call(n.element,a);l=!0}};if(this.isUsingJQueryAnimation&&d==="animate")f.complete=k,j=!1;else if(e.csstransitions){var o=0,p=this.styleQueue[0].$el,s;while(!p.length){s=this.styleQueue[o++];if(!s)return;p=s.$el}var t=parseFloat(getComputedStyle(p[0])[r]);t>0&&(i=function(a,b){b.$el[d](b.style,f).one(q,k)},j=!1)}}b.each(this.styleQueue,i),j&&k(),this.styleQueue=[]},resize:function(){this["_"+this.options.layoutMode+"ResizeChanged"]()&&this.reLayout()},reLayout:function(a){this["_"+this.options.layoutMode+"Reset"](),this.layout(this.$filteredAtoms,a)},addItems:function(a,b){var c=this._getAtoms(a);this.$allAtoms=this.$allAtoms.add(c),b&&b(c)},insert:function(a,b){this.element.append(a);var c=this;this.addItems(a,function(a){var d=c._filter(a);c._addHideAppended(d),c._sort(),c.reLayout(),c._revealAppended(d,b)})},appended:function(a,b){var c=this;this.addItems(a,function(a){c._addHideAppended(a),c.layout(a),c._revealAppended(a,b)})},_addHideAppended:function(a){this.$filteredAtoms=this.$filteredAtoms.add(a),a.addClass("no-transition"),this._isInserting=!0,this.styleQueue.push({$el:a,style:this.options.hiddenStyle})},_revealAppended:function(a,b){var c=this;setTimeout(function(){a.removeClass("no-transition"),c.styleQueue.push({$el:a,style:c.options.visibleStyle}),c._isInserting=!1,c._processStyleQueue(a,b)},10)},reloadItems:function(){this.$allAtoms=this._getAtoms(this.element.children())},remove:function(a,b){var c=this,d=function(){c.$allAtoms=c.$allAtoms.not(a),a.remove()};a.filter(":not(."+this.options.hiddenClass+")").length?(this.styleQueue.push({$el:a,style:this.options.hiddenStyle}),this.$filteredAtoms=this.$filteredAtoms.not(a),this._sort(),this.reLayout(d,b)):(d(),b&&b.call(this.element))},shuffle:function(a){this.updateSortData(this.$allAtoms),this.options.sortBy="random",this._sort(),this.reLayout(a)},destroy:function(){var a=this.usingTransforms,b=this.options;this.$allAtoms.removeClass(b.hiddenClass+" "+b.itemClass).each(function(){var b=this.style;b.position="",b.top="",b.left="",b.opacity="",a&&(b[i]="")});var c=this.element[0].style;for(var d=0,e=u.length;d<e;d++){var f=u[d];c[f]=this.originalStyle[f]}this.element.unbind(".isotope").undelegate("."+b.hiddenClass,"click").removeClass(b.containerClass).removeData("isotope"),v.unbind(".isotope")},_getSegments:function(a){var b=this.options.layoutMode,c=a?"rowHeight":"columnWidth",d=a?"height":"width",e=a?"rows":"cols",g=this.element[d](),h,i=this.options[b]&&this.options[b][c]||this.$filteredAtoms["outer"+f(d)](!0)||g;h=Math.floor(g/i),h=Math.max(h,1),this[b][e]=h,this[b][c]=i},_checkIfSegmentsChanged:function(a){var b=this.options.layoutMode,c=a?"rows":"cols",d=this[b][c];this._getSegments(a);return this[b][c]!==d},_masonryReset:function(){this.masonry={},this._getSegments();var a=this.masonry.cols;this.masonry.colYs=[];while(a--)this.masonry.colYs.push(0)},_masonryLayout:function(a){var c=this,d=c.masonry;a.each(function(){var a=b(this),e=Math.ceil(a.outerWidth(!0)/d.columnWidth);e=Math.min(e,d.cols);if(e===1)c._masonryPlaceBrick(a,d.colYs);else{var f=d.cols+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.colYs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryPlaceBrick(a,g)}})},_masonryPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=this.masonry.columnWidth*d,h=c;this._pushPosition(a,g,h);var i=c+a.outerHeight(!0),j=this.masonry.cols+1-f;for(e=0;e<j;e++)this.masonry.colYs[d+e]=i},_masonryGetContainerSize:function(){var a=Math.max.apply(Math,this.masonry.colYs);return{height:a}},_masonryResizeChanged:function(){return this._checkIfSegmentsChanged()},_fitRowsReset:function(){this.fitRows={x:0,y:0,height:0}},_fitRowsLayout:function(a){var c=this,d=this.element.width(),e=this.fitRows;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.x!==0&&f+e.x>d&&(e.x=0,e.y=e.height),c._pushPosition(a,e.x,e.y),e.height=Math.max(e.y+g,e.height),e.x+=f})},_fitRowsGetContainerSize:function(){return{height:this.fitRows.height}},_fitRowsResizeChanged:function(){return!0},_cellsByRowReset:function(){this.cellsByRow={index:0},this._getSegments(),this._getSegments(!0)},_cellsByRowLayout:function(a){var c=this,d=this.cellsByRow;a.each(function(){var a=b(this),e=d.index%d.cols,f=Math.floor(d.index/d.cols),g=Math.round((e+.5)*d.columnWidth-a.outerWidth(!0)/2),h=Math.round((f+.5)*d.rowHeight-a.outerHeight(!0)/2);c._pushPosition(a,g,h),d.index++})},_cellsByRowGetContainerSize:function(){return{height:Math.ceil(this.$filteredAtoms.length/this.cellsByRow.cols)*this.cellsByRow.rowHeight+this.offset.top}},_cellsByRowResizeChanged:function(){return this._checkIfSegmentsChanged()},_straightDownReset:function(){this.straightDown={y:0}},_straightDownLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,0,c.straightDown.y),c.straightDown.y+=d.outerHeight(!0)})},_straightDownGetContainerSize:function(){return{height:this.straightDown.y}},_straightDownResizeChanged:function(){return!0},_masonryHorizontalReset:function(){this.masonryHorizontal={},this._getSegments(!0);var a=this.masonryHorizontal.rows;this.masonryHorizontal.rowXs=[];while(a--)this.masonryHorizontal.rowXs.push(0)},_masonryHorizontalLayout:function(a){var c=this,d=c.masonryHorizontal;a.each(function(){var a=b(this),e=Math.ceil(a.outerHeight(!0)/d.rowHeight);e=Math.min(e,d.rows);if(e===1)c._masonryHorizontalPlaceBrick(a,d.rowXs);else{var f=d.rows+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.rowXs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryHorizontalPlaceBrick(a,g)}})},_masonryHorizontalPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=c,h=this.masonryHorizontal.rowHeight*d;this._pushPosition(a,g,h);var i=c+a.outerWidth(!0),j=this.masonryHorizontal.rows+1-f;for(e=0;e<j;e++)this.masonryHorizontal.rowXs[d+e]=i},_masonryHorizontalGetContainerSize:function(){var a=Math.max.apply(Math,this.masonryHorizontal.rowXs);return{width:a}},_masonryHorizontalResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_fitColumnsReset:function(){this.fitColumns={x:0,y:0,width:0}},_fitColumnsLayout:function(a){var c=this,d=this.element.height(),e=this.fitColumns;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.y!==0&&g+e.y>d&&(e.x=e.width,e.y=0),c._pushPosition(a,e.x,e.y),e.width=Math.max(e.x+f,e.width),e.y+=g})},_fitColumnsGetContainerSize:function(){return{width:this.fitColumns.width}},_fitColumnsResizeChanged:function(){return!0},_cellsByColumnReset:function(){this.cellsByColumn={index:0},this._getSegments(),this._getSegments(!0)},_cellsByColumnLayout:function(a){var c=this,d=this.cellsByColumn;a.each(function(){var a=b(this),e=Math.floor(d.index/d.rows),f=d.index%d.rows,g=Math.round((e+.5)*d.columnWidth-a.outerWidth(!0)/2),h=Math.round((f+.5)*d.rowHeight-a.outerHeight(!0)/2);c._pushPosition(a,g,h),d.index++})},_cellsByColumnGetContainerSize:function(){return{width:Math.ceil(this.$filteredAtoms.length/this.cellsByColumn.rows)*this.cellsByColumn.columnWidth}},_cellsByColumnResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_straightAcrossReset:function(){this.straightAcross={x:0}},_straightAcrossLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,c.straightAcross.x,0),c.straightAcross.x+=d.outerWidth(!0)})},_straightAcrossGetContainerSize:function(){return{width:this.straightAcross.x}},_straightAcrossResizeChanged:function(){return!0}},b.fn.imagesLoaded=function(a){function i(a){var c=a.target;c.src!==f&&b.inArray(c,g)===-1&&(g.push(c),--e<=0&&(setTimeout(h),d.unbind(".imagesLoaded",i)))}function h(){a.call(c,d)}var c=this,d=c.find("img").add(c.filter("img")),e=d.length,f="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",g=[];e||h(),d.bind("load.imagesLoaded error.imagesLoaded",i).each(function(){var a=this.src;this.src=f,this.src=a});return c};var w=function(b){a.console&&a.console.error(b)};b.fn.isotope=function(a,c){if(typeof a=="string"){var d=Array.prototype.slice.call(arguments,1);this.each(function(){var c=b.data(this,"isotope");if(!c)w("cannot call methods on isotope prior to initialization; attempted to call method '"+a+"'");else{if(!b.isFunction(c[a])||a.charAt(0)==="_"){w("no such method '"+a+"' for isotope instance");return}c[a].apply(c,d)}})}else this.each(function(){var d=b.data(this,"isotope");d?(d.option(a),d._init(c)):b.data(this,"isotope",new b.Isotope(a,this,c))});return this}})(window,jQuery);

/*!
* Bootstrap.js by @fat & @mdo
* Copyright 2012 Twitter, Inc.
* http://www.apache.org/licenses/LICENSE-2.0.txt
*/
!function(e){e(function(){"use strict";e.support.transition=function(){var e=function(){var e=document.createElement("bootstrap"),t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},n;for(n in t)if(e.style[n]!==undefined)return t[n]}();return e&&{end:e}}()})}(window.jQuery),!function(e){"use strict";var t='[data-dismiss="alert"]',n=function(n){e(n).on("click",t,this.close)};n.prototype.close=function(t){function s(){i.trigger("closed").remove()}var n=e(this),r=n.attr("data-target"),i;r||(r=n.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,"")),i=e(r),t&&t.preventDefault(),i.length||(i=n.hasClass("alert")?n:n.parent()),i.trigger(t=e.Event("close"));if(t.isDefaultPrevented())return;i.removeClass("in"),e.support.transition&&i.hasClass("fade")?i.on(e.support.transition.end,s):s()},e.fn.alert=function(t){return this.each(function(){var r=e(this),i=r.data("alert");i||r.data("alert",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.alert.Constructor=n,e(function(){e("body").on("click.alert.data-api",t,n.prototype.close)})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.button.defaults,n)};t.prototype.setState=function(e){var t="disabled",n=this.$element,r=n.data(),i=n.is("input")?"val":"html";e+="Text",r.resetText||n.data("resetText",n[i]()),n[i](r[e]||this.options[e]),setTimeout(function(){e=="loadingText"?n.addClass(t).attr(t,t):n.removeClass(t).removeAttr(t)},0)},t.prototype.toggle=function(){var e=this.$element.closest('[data-toggle="buttons-radio"]');e&&e.find(".active").removeClass("active"),this.$element.toggleClass("active")},e.fn.button=function(n){return this.each(function(){var r=e(this),i=r.data("button"),s=typeof n=="object"&&n;i||r.data("button",i=new t(this,s)),n=="toggle"?i.toggle():n&&i.setState(n)})},e.fn.button.defaults={loadingText:"loading..."},e.fn.button.Constructor=t,e(function(){e("body").on("click.button.data-api","[data-toggle^=button]",function(t){var n=e(t.target);n.hasClass("btn")||(n=n.closest(".btn")),n.button("toggle")})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=n,this.options.slide&&this.slide(this.options.slide),this.options.pause=="hover"&&this.$element.on("mouseenter",e.proxy(this.pause,this)).on("mouseleave",e.proxy(this.cycle,this))};t.prototype={cycle:function(t){return t||(this.paused=!1),this.options.interval&&!this.paused&&(this.interval=setInterval(e.proxy(this.next,this),this.options.interval)),this},to:function(t){var n=this.$element.find(".item.active"),r=n.parent().children(),i=r.index(n),s=this;if(t>r.length-1||t<0)return;return this.sliding?this.$element.one("slid",function(){s.to(t)}):i==t?this.pause().cycle():this.slide(t>i?"next":"prev",e(r[t]))},pause:function(t){return t||(this.paused=!0),this.$element.find(".next, .prev").length&&e.support.transition.end&&(this.$element.trigger(e.support.transition.end),this.cycle()),clearInterval(this.interval),this.interval=null,this},next:function(){if(this.sliding)return;return this.slide("next")},prev:function(){if(this.sliding)return;return this.slide("prev")},slide:function(t,n){var r=this.$element.find(".item.active"),i=n||r[t](),s=this.interval,o=t=="next"?"left":"right",u=t=="next"?"first":"last",a=this,f=e.Event("slide",{relatedTarget:i[0]});this.sliding=!0,s&&this.pause(),i=i.length?i:this.$element.find(".item")[u]();if(i.hasClass("active"))return;if(e.support.transition&&this.$element.hasClass("slide")){this.$element.trigger(f);if(f.isDefaultPrevented())return;i.addClass(t),i[0].offsetWidth,r.addClass(o),i.addClass(o),this.$element.one(e.support.transition.end,function(){i.removeClass([t,o].join(" ")).addClass("active"),r.removeClass(["active",o].join(" ")),a.sliding=!1,setTimeout(function(){a.$element.trigger("slid")},0)})}else{this.$element.trigger(f);if(f.isDefaultPrevented())return;r.removeClass("active"),i.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return s&&this.cycle(),this}},e.fn.carousel=function(n){return this.each(function(){var r=e(this),i=r.data("carousel"),s=e.extend({},e.fn.carousel.defaults,typeof n=="object"&&n),o=typeof n=="string"?n:s.slide;i||r.data("carousel",i=new t(this,s)),typeof n=="number"?i.to(n):o?i[o]():s.interval&&i.cycle()})},e.fn.carousel.defaults={interval:5e3,pause:"hover"},e.fn.carousel.Constructor=t,e(function(){e("body").on("click.carousel.data-api","[data-slide]",function(t){var n=e(this),r,i=e(n.attr("data-target")||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,"")),s=!i.data("modal")&&e.extend({},i.data(),n.data());i.carousel(s),t.preventDefault()})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.collapse.defaults,n),this.options.parent&&(this.$parent=e(this.options.parent)),this.options.toggle&&this.toggle()};t.prototype={constructor:t,dimension:function(){var e=this.$element.hasClass("width");return e?"width":"height"},show:function(){var t,n,r,i;if(this.transitioning)return;t=this.dimension(),n=e.camelCase(["scroll",t].join("-")),r=this.$parent&&this.$parent.find("> .accordion-group > .in");if(r&&r.length){i=r.data("collapse");if(i&&i.transitioning)return;r.collapse("hide"),i||r.data("collapse",null)}this.$element[t](0),this.transition("addClass",e.Event("show"),"shown"),e.support.transition&&this.$element[t](this.$element[0][n])},hide:function(){var t;if(this.transitioning)return;t=this.dimension(),this.reset(this.$element[t]()),this.transition("removeClass",e.Event("hide"),"hidden"),this.$element[t](0)},reset:function(e){var t=this.dimension();return this.$element.removeClass("collapse")[t](e||"auto")[0].offsetWidth,this.$element[e!==null?"addClass":"removeClass"]("collapse"),this},transition:function(t,n,r){var i=this,s=function(){n.type=="show"&&i.reset(),i.transitioning=0,i.$element.trigger(r)};this.$element.trigger(n);if(n.isDefaultPrevented())return;this.transitioning=1,this.$element[t]("in"),e.support.transition&&this.$element.hasClass("collapse")?this.$element.one(e.support.transition.end,s):s()},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}},e.fn.collapse=function(n){return this.each(function(){var r=e(this),i=r.data("collapse"),s=typeof n=="object"&&n;i||r.data("collapse",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.collapse.defaults={toggle:!0},e.fn.collapse.Constructor=t,e(function(){e("body").on("click.collapse.data-api","[data-toggle=collapse]",function(t){var n=e(this),r,i=n.attr("data-target")||t.preventDefault()||(r=n.attr("href"))&&r.replace(/.*(?=#[^\s]+$)/,""),s=e(i).data("collapse")?"toggle":n.data();n[e(i).hasClass("in")?"addClass":"removeClass"]("collapsed"),e(i).collapse(s)})})}(window.jQuery),!function(e){"use strict";function r(){i(e(t)).removeClass("open")}function i(t){var n=t.attr("data-target"),r;return n||(n=t.attr("href"),n=n&&/#/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,"")),r=e(n),r.length||(r=t.parent()),r}var t="[data-toggle=dropdown]",n=function(t){var n=e(t).on("click.dropdown.data-api",this.toggle);e("html").on("click.dropdown.data-api",function(){n.parent().removeClass("open")})};n.prototype={constructor:n,toggle:function(t){var n=e(this),s,o;if(n.is(".disabled, :disabled"))return;return s=i(n),o=s.hasClass("open"),r(),o||(s.toggleClass("open"),n.focus()),!1},keydown:function(t){var n,r,s,o,u,a;if(!/(38|40|27)/.test(t.keyCode))return;n=e(this),t.preventDefault(),t.stopPropagation();if(n.is(".disabled, :disabled"))return;o=i(n),u=o.hasClass("open");if(!u||u&&t.keyCode==27)return n.click();r=e("[role=menu] li:not(.divider) a",o);if(!r.length)return;a=r.index(r.filter(":focus")),t.keyCode==38&&a>0&&a--,t.keyCode==40&&a<r.length-1&&a++,~a||(a=0),r.eq(a).focus()}},e.fn.dropdown=function(t){return this.each(function(){var r=e(this),i=r.data("dropdown");i||r.data("dropdown",i=new n(this)),typeof t=="string"&&i[t].call(r)})},e.fn.dropdown.Constructor=n,e(function(){e("html").on("click.dropdown.data-api touchstart.dropdown.data-api",r),e("body").on("click.dropdown touchstart.dropdown.data-api",".dropdown form",function(e){e.stopPropagation()}).on("click.dropdown.data-api touchstart.dropdown.data-api",t,n.prototype.toggle).on("keydown.dropdown.data-api touchstart.dropdown.data-api",t+", [role=menu]",n.prototype.keydown)})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=n,this.$element=e(t).delegate('[data-dismiss="modal"]',"click.dismiss.modal",e.proxy(this.hide,this)),this.options.remote&&this.$element.find(".modal-body").load(this.options.remote)};t.prototype={constructor:t,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var t=this,n=e.Event("show");this.$element.trigger(n);if(this.isShown||n.isDefaultPrevented())return;e("body").addClass("modal-open"),this.isShown=!0,this.escape(),this.backdrop(function(){var n=e.support.transition&&t.$element.hasClass("fade");t.$element.parent().length||t.$element.appendTo(document.body),t.$element.show(),n&&t.$element[0].offsetWidth,t.$element.addClass("in").attr("aria-hidden",!1).focus(),t.enforceFocus(),n?t.$element.one(e.support.transition.end,function(){t.$element.trigger("shown")}):t.$element.trigger("shown")})},hide:function(t){t&&t.preventDefault();var n=this;t=e.Event("hide"),this.$element.trigger(t);if(!this.isShown||t.isDefaultPrevented())return;this.isShown=!1,e("body").removeClass("modal-open"),this.escape(),e(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),e.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},enforceFocus:function(){var t=this;e(document).on("focusin.modal",function(e){t.$element[0]!==e.target&&!t.$element.has(e.target).length&&t.$element.focus()})},escape:function(){var e=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(t){t.which==27&&e.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var t=this,n=setTimeout(function(){t.$element.off(e.support.transition.end),t.hideModal()},500);this.$element.one(e.support.transition.end,function(){clearTimeout(n),t.hideModal()})},hideModal:function(e){this.$element.hide().trigger("hidden"),this.backdrop()},removeBackdrop:function(){this.$backdrop.remove(),this.$backdrop=null},backdrop:function(t){var n=this,r=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=e.support.transition&&r;this.$backdrop=e('<div class="modal-backdrop '+r+'" />').appendTo(document.body),this.options.backdrop!="static"&&this.$backdrop.click(e.proxy(this.hide,this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),i?this.$backdrop.one(e.support.transition.end,t):t()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),e.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(e.support.transition.end,e.proxy(this.removeBackdrop,this)):this.removeBackdrop()):t&&t()}},e.fn.modal=function(n){return this.each(function(){var r=e(this),i=r.data("modal"),s=e.extend({},e.fn.modal.defaults,r.data(),typeof n=="object"&&n);i||r.data("modal",i=new t(this,s)),typeof n=="string"?i[n]():s.show&&i.show()})},e.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},e.fn.modal.Constructor=t,e(function(){e("body").on("click.modal.data-api",'[data-toggle="modal"]',function(t){var n=e(this),r=n.attr("href"),i=e(n.attr("data-target")||r&&r.replace(/.*(?=#[^\s]+$)/,"")),s=i.data("modal")?"toggle":e.extend({remote:!/#/.test(r)&&r},i.data(),n.data());t.preventDefault(),i.modal(s).one("hide",function(){n.focus()})})})}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s;this.type=t,this.$element=e(n),this.options=this.getOptions(r),this.enabled=!0,this.options.trigger=="click"?this.$element.on("click."+this.type,this.options.selector,e.proxy(this.toggle,this)):this.options.trigger!="manual"&&(i=this.options.trigger=="hover"?"mouseenter":"focus",s=this.options.trigger=="hover"?"mouseleave":"blur",this.$element.on(i+"."+this.type,this.options.selector,e.proxy(this.enter,this)),this.$element.on(s+"."+this.type,this.options.selector,e.proxy(this.leave,this))),this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){return t=e.extend({},e.fn[this.type].defaults,t,this.$element.data()),t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay}),t},enter:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(!n.options.delay||!n.options.delay.show)return n.show();clearTimeout(this.timeout),n.hoverState="in",this.timeout=setTimeout(function(){n.hoverState=="in"&&n.show()},n.options.delay.show)},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);this.timeout&&clearTimeout(this.timeout);if(!n.options.delay||!n.options.delay.hide)return n.hide();n.hoverState="out",this.timeout=setTimeout(function(){n.hoverState=="out"&&n.hide()},n.options.delay.hide)},show:function(){var e,t,n,r,i,s,o;if(this.hasContent()&&this.enabled){e=this.tip(),this.setContent(),this.options.animation&&e.addClass("fade"),s=typeof this.options.placement=="function"?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement,t=/in/.test(s),e.remove().css({top:0,left:0,display:"block"}).appendTo(t?this.$element:document.body),n=this.getPosition(t),r=e[0].offsetWidth,i=e[0].offsetHeight;switch(t?s.split(" ")[1]:s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width}}e.css(o).addClass(s).addClass("in")}},setContent:function(){var e=this.tip(),t=this.getTitle();e.find(".tooltip-inner")[this.options.html?"html":"text"](t),e.removeClass("fade in top bottom left right")},hide:function(){function r(){var t=setTimeout(function(){n.off(e.support.transition.end).remove()},500);n.one(e.support.transition.end,function(){clearTimeout(t),n.remove()})}var t=this,n=this.tip();return n.removeClass("in"),e.support.transition&&this.$tip.hasClass("fade")?r():n.remove(),this},fixTitle:function(){var e=this.$element;(e.attr("title")||typeof e.attr("data-original-title")!="string")&&e.attr("data-original-title",e.attr("title")||"").removeAttr("title")},hasContent:function(){return this.getTitle()},getPosition:function(t){return e.extend({},t?{top:0,left:0}:this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title),e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}},e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;i||r.data("tooltip",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.tooltip.Constructor=t,e.fn.tooltip.defaults={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover",title:"",delay:0,html:!0}}(window.jQuery),!function(e){"use strict";var t=function(e,t){this.init("popover",e,t)};t.prototype=e.extend({},e.fn.tooltip.Constructor.prototype,{constructor:t,setContent:function(){var e=this.tip(),t=this.getTitle(),n=this.getContent();e.find(".popover-title")[this.options.html?"html":"text"](t),e.find(".popover-content > *")[this.options.html?"html":"text"](n),e.removeClass("fade top bottom left right in")},hasContent:function(){return this.getTitle()||this.getContent()},getContent:function(){var e,t=this.$element,n=this.options;return e=t.attr("data-content")||(typeof n.content=="function"?n.content.call(t[0]):n.content),e},tip:function(){return this.$tip||(this.$tip=e(this.options.template)),this.$tip},destroy:function(){this.hide().$element.off("."+this.type).removeData(this.type)}}),e.fn.popover=function(n){return this.each(function(){var r=e(this),i=r.data("popover"),s=typeof n=="object"&&n;i||r.data("popover",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.popover.Constructor=t,e.fn.popover.defaults=e.extend({},e.fn.tooltip.defaults,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})}(window.jQuery),!function(e){"use strict";function t(t,n){var r=e.proxy(this.process,this),i=e(t).is("body")?e(window):e(t),s;this.options=e.extend({},e.fn.scrollspy.defaults,n),this.$scrollElement=i.on("scroll.scroll-spy.data-api",r),this.selector=(this.options.target||(s=e(t).attr("href"))&&s.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=e("body"),this.refresh(),this.process()}t.prototype={constructor:t,refresh:function(){var t=this,n;this.offsets=e([]),this.targets=e([]),n=this.$body.find(this.selector).map(function(){var t=e(this),n=t.data("target")||t.attr("href"),r=/^#\w/.test(n)&&e(n);return r&&r.length&&[[r.position().top,n]]||null}).sort(function(e,t){return e[0]-t[0]}).each(function(){t.offsets.push(this[0]),t.targets.push(this[1])})},process:function(){var e=this.$scrollElement.scrollTop()+this.options.offset,t=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,n=t-this.$scrollElement.height(),r=this.offsets,i=this.targets,s=this.activeTarget,o;if(e>=n)return s!=(o=i.last()[0])&&this.activate(o);for(o=r.length;o--;)s!=i[o]&&e>=r[o]&&(!r[o+1]||e<=r[o+1])&&this.activate(i[o])},activate:function(t){var n,r;this.activeTarget=t,e(this.selector).parent(".active").removeClass("active"),r=this.selector+'[data-target="'+t+'"],'+this.selector+'[href="'+t+'"]',n=e(r).parent("li").addClass("active"),n.parent(".dropdown-menu").length&&(n=n.closest("li.dropdown").addClass("active")),n.trigger("activate")}},e.fn.scrollspy=function(n){return this.each(function(){var r=e(this),i=r.data("scrollspy"),s=typeof n=="object"&&n;i||r.data("scrollspy",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.scrollspy.Constructor=t,e.fn.scrollspy.defaults={offset:10},e(window).on("load",function(){e('[data-spy="scroll"]').each(function(){var t=e(this);t.scrollspy(t.data())})})}(window.jQuery),!function(e){"use strict";var t=function(t){this.element=e(t)};t.prototype={constructor:t,show:function(){var t=this.element,n=t.closest("ul:not(.dropdown-menu)"),r=t.attr("data-target"),i,s,o;r||(r=t.attr("href"),r=r&&r.replace(/.*(?=#[^\s]*$)/,""));if(t.parent("li").hasClass("active"))return;i=n.find(".active a").last()[0],o=e.Event("show",{relatedTarget:i}),t.trigger(o);if(o.isDefaultPrevented())return;s=e(r),this.activate(t.parent("li"),n),this.activate(s,s.parent(),function(){t.trigger({type:"shown",relatedTarget:i})})},activate:function(t,n,r){function o(){i.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),t.addClass("active"),s?(t[0].offsetWidth,t.addClass("in")):t.removeClass("fade"),t.parent(".dropdown-menu")&&t.closest("li.dropdown").addClass("active"),r&&r()}var i=n.find("> .active"),s=r&&e.support.transition&&i.hasClass("fade");s?i.one(e.support.transition.end,o):o(),i.removeClass("in")}},e.fn.tab=function(n){return this.each(function(){var r=e(this),i=r.data("tab");i||r.data("tab",i=new t(this)),typeof n=="string"&&i[n]()})},e.fn.tab.Constructor=t,e(function(){e("body").on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(t){t.preventDefault(),e(this).tab("show")})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.$element=e(t),this.options=e.extend({},e.fn.typeahead.defaults,n),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.$menu=e(this.options.menu).appendTo("body"),this.source=this.options.source,this.shown=!1,this.listen()};t.prototype={constructor:t,select:function(){var e=this.$menu.find(".active").attr("data-value");return this.$element.val(this.updater(e)).change(),this.hide()},updater:function(e){return e},show:function(){var t=e.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});return this.$menu.css({top:t.top+t.height,left:t.left}),this.$menu.show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(t){var n;return this.query=this.$element.val(),!this.query||this.query.length<this.options.minLength?this.shown?this.hide():this:(n=e.isFunction(this.source)?this.source(this.query,e.proxy(this.process,this)):this.source,n?this.process(n):this)},process:function(t){var n=this;return t=e.grep(t,function(e){return n.matcher(e)}),t=this.sorter(t),t.length?this.render(t.slice(0,this.options.items)).show():this.shown?this.hide():this},matcher:function(e){return~e.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(e){var t=[],n=[],r=[],i;while(i=e.shift())i.toLowerCase().indexOf(this.query.toLowerCase())?~i.indexOf(this.query)?n.push(i):r.push(i):t.push(i);return t.concat(n,r)},highlighter:function(e){var t=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return e.replace(new RegExp("("+t+")","ig"),function(e,t){return"<strong>"+t+"</strong>"})},render:function(t){var n=this;return t=e(t).map(function(t,r){return t=e(n.options.item).attr("data-value",r),t.find("a").html(n.highlighter(r)),t[0]}),t.first().addClass("active"),this.$menu.html(t),this},next:function(t){var n=this.$menu.find(".active").removeClass("active"),r=n.next();r.length||(r=e(this.$menu.find("li")[0])),r.addClass("active")},prev:function(e){var t=this.$menu.find(".active").removeClass("active"),n=t.prev();n.length||(n=this.$menu.find("li").last()),n.addClass("active")},listen:function(){this.$element.on("blur",e.proxy(this.blur,this)).on("keypress",e.proxy(this.keypress,this)).on("keyup",e.proxy(this.keyup,this)),(e.browser.chrome||e.browser.webkit||e.browser.msie)&&this.$element.on("keydown",e.proxy(this.keydown,this)),this.$menu.on("click",e.proxy(this.click,this)).on("mouseenter","li",e.proxy(this.mouseenter,this))},move:function(e){if(!this.shown)return;switch(e.keyCode){case 9:case 13:case 27:e.preventDefault();break;case 38:e.preventDefault(),this.prev();break;case 40:e.preventDefault(),this.next()}e.stopPropagation()},keydown:function(t){this.suppressKeyPressRepeat=!~e.inArray(t.keyCode,[40,38,9,13,27]),this.move(t)},keypress:function(e){if(this.suppressKeyPressRepeat)return;this.move(e)},keyup:function(e){switch(e.keyCode){case 40:case 38:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}e.stopPropagation(),e.preventDefault()},blur:function(e){var t=this;setTimeout(function(){t.hide()},150)},click:function(e){e.stopPropagation(),e.preventDefault(),this.select()},mouseenter:function(t){this.$menu.find(".active").removeClass("active"),e(t.currentTarget).addClass("active")}},e.fn.typeahead=function(n){return this.each(function(){var r=e(this),i=r.data("typeahead"),s=typeof n=="object"&&n;i||r.data("typeahead",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1},e.fn.typeahead.Constructor=t,e(function(){e("body").on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(t){var n=e(this);if(n.data("typeahead"))return;t.preventDefault(),n.typeahead(n.data())})})}(window.jQuery),!function(e){"use strict";var t=function(t,n){this.options=e.extend({},e.fn.affix.defaults,n),this.$window=e(window).on("scroll.affix.data-api",e.proxy(this.checkPosition,this)),this.$element=e(t),this.checkPosition()};t.prototype.checkPosition=function(){if(!this.$element.is(":visible"))return;var t=e(document).height(),n=this.$window.scrollTop(),r=this.$element.offset(),i=this.options.offset,s=i.bottom,o=i.top,u="affix affix-top affix-bottom",a;typeof i!="object"&&(s=o=i),typeof o=="function"&&(o=i.top()),typeof s=="function"&&(s=i.bottom()),a=this.unpin!=null&&n+this.unpin<=r.top?!1:s!=null&&r.top+this.$element.height()>=t-s?"bottom":o!=null&&n<=o?"top":!1;if(this.affixed===a)return;this.affixed=a,this.unpin=a=="bottom"?r.top-n:null,this.$element.removeClass(u).addClass("affix"+(a?"-"+a:""))},e.fn.affix=function(n){return this.each(function(){var r=e(this),i=r.data("affix"),s=typeof n=="object"&&n;i||r.data("affix",i=new t(this,s)),typeof n=="string"&&i[n]()})},e.fn.affix.Constructor=t,e.fn.affix.defaults={offset:0},e(window).on("load",function(){e('[data-spy="affix"]').each(function(){var t=e(this),n=t.data();n.offset=n.offset||{},n.offsetBottom&&(n.offset.bottom=n.offsetBottom),n.offsetTop&&(n.offset.top=n.offsetTop),t.affix(n)})})}(window.jQuery);
(function(d,e){var a=d.document,c;var b=function(g,s,o){var r=this,n,q,m,j,f,h,p={updated:[]};this.listContainer=(typeof(g)=="string")?a.getElementById(g):g;this.items=[];this.visibleItems=[];this.matchingItems=[];this.searched=false;this.filtered=false;this.list=null;this.templateEngines={};this.page=s.page||200;this.i=s.i||1;q={start:function(t,u){u.plugins=u.plugins||{};this.classes(u);n=new f(r,u);this.callbacks(u);this.items.start(t,u);r.update();this.plugins(u.plugins)},classes:function(t){t.listClass=t.listClass||"list";t.searchClass=t.searchClass||"search";t.sortClass=t.sortClass||"sort"},callbacks:function(t){r.list=c.getByClass(t.listClass,r.listContainer,true);c.addEvent(c.getByClass(t.searchClass,r.listContainer),"keyup",r.search);h=c.getByClass(t.sortClass,r.listContainer);c.addEvent(h,"click",r.sort)},items:{start:function(t,v){if(v.valueNames){var w=this.get(),u=v.valueNames;if(v.indexAsync){this.indexAsync(w,u)}else{this.index(w,u)}}if(t!==e){r.add(t)}},get:function(){var v=r.list.childNodes,u=[];for(var w=0,t=v.length;w<t;w++){if(v[w].data===e){u.push(v[w])}}return u},index:function(t,v){for(var w=0,u=t.length;w<u;w++){r.items.push(new j(v,t[w]))}},indexAsync:function(t,u){var v=t.splice(0,100);this.index(v,u);if(t.length>0){setTimeout(function(){q.items.indexAsync(t,u)},10)}else{r.update()}}},plugins:function(t){for(var u=0;u<t.length;u++){var v=t[u][1].name||t[u][0];r[v]=new r.plugins[t[u][0]](r,t[u][1])}}};this.add=function(u,z){if(z){l(u,z)}var x=[],w=false;if(u[0]===e){u=[u]}for(var v=0,t=u.length;v<t;v++){var y=null;if(u[v] instanceof j){y=u[v];y.reload()}else{w=(r.items.length>r.page)?true:false;y=new j(u[v],e,w)}r.items.push(y);x.push(y)}r.update();return x};var l=function(u,w,t){var v=u.splice(0,100);t=t||[];t=t.concat(r.add(v));if(u.length>0){setTimeout(function(){l(u,w,t)},10)}else{r.update();w(t)}};this.show=function(t,u){this.i=t;this.page=u;r.update()};this.remove=function(y,x,u){var w=0;for(var v=0,t=r.items.length;v<t;v++){if(r.items[v].values()[y]==x){n.remove(r.items[v],u);r.items.splice(v,1);t--;w++}}r.update();return w};this.get=function(y,w){var x=[];for(var u=0,t=r.items.length;u<t;u++){var v=r.items[u];if(v.values()[y]==w){x.push(v)}}if(x.length==0){return null}else{if(x.length==1){return x[0]}else{return x}}};this.sort=function(z,D){var t=r.items.length,C=null,x=z.target||z.srcElement,v="",y=false,B="asc",w="desc",D=D||{};if(x===e){C=z;y=D.asc||false}else{C=c.getAttribute(x,"data-sort");y=c.hasClass(x,B)?false:true}for(var u=0,A=h.length;u<A;u++){c.removeClass(h[u],B);c.removeClass(h[u],w)}if(y){if(x!==e){c.addClass(x,B)}y=true}else{if(x!==e){c.addClass(x,w)}y=false}if(D.sortFunction){D.sortFunction=D.sortFunction}else{D.sortFunction=function(F,E){return c.sorter.alphanum(F.values()[C],E.values()[C],y)}}r.items.sort(D.sortFunction);r.update()};this.search=function(E,v){r.i=1;var u=[],D,C,B,A,y,v=(v===e)?r.items[0].values():v,E=(E===e)?"":E,z=E.target||E.srcElement;E=(z===e)?(""+E).toLowerCase():""+z.value.toLowerCase();y=r.items;E=E.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");n.clear();if(E===""){k.search();r.searched=false;r.update()}else{r.searched=true;for(var w=0,t=y.length;w<t;w++){D=false;C=y[w];A=C.values();for(var x in v){if(A.hasOwnProperty(x)&&v[x]!==null){B=(A[x]!=null)?A[x].toString().toLowerCase():"";if((E!=="")&&(B.search(E)>-1)){D=true}}}if(D){C.found=true;u.push(C)}else{C.found=false}}r.update()}return r.visibleItems};this.filter=function(y){r.i=1;var x=e;k.filter();if(y===e){r.filtered=false}else{x=[];r.filtered=true;var w=r.items;for(var u=0,t=w.length;u<t;u++){var v=w[u];if(y(v.values())){v.filtered=true;x.push(v)}else{v.filtered=false}}}r.update();return r.visibleItems};this.size=function(){return r.items.length};this.clear=function(){n.clear();r.items=[]};this.on=function(t,u){p[t].push(u)};var i=function(u){var t=p[u].length;while(t--){p[u][t]()}};var k={filter:function(){var u=r.items,t=u.length;while(t--){u[t].filtered=false}},search:function(){var u=r.items,t=u.length;while(t--){u[t].found=false}}};this.update=function(){var v=r.items,t=v.length;r.visibleItems=[];r.matchingItems=[];n.clear();for(var u=0;u<t;u++){if(v[u].matching()&&((u+1)>=r.i&&r.visibleItems.length<r.page)){v[u].show();r.visibleItems.push(v[u]);r.matchingItems.push(v[u])}else{if(v[u].matching()){r.matchingItems.push(v[u]);v[u].hide()}else{v[u].hide()}}}i("updated")};j=function(u,w,v){var x=this,t={};this.found=false;this.filtered=false;var y=function(A,C,B){if(C===e){if(B){x.values(A,B)}else{x.values(A)}}else{x.elm=C;var z=n.get(x,A);x.values(z)}};this.values=function(A,B){if(A!==e){for(var z in A){t[z]=A[z]}if(B!==true){n.set(x,x.values())}}else{return t}};this.show=function(){n.show(x)};this.hide=function(){n.hide(x)};this.matching=function(){return((r.filtered&&r.searched&&x.found&&x.filtered)||(r.filtered&&!r.searched&&x.filtered)||(!r.filtered&&r.searched&&x.found)||(!r.filtered&&!r.searched))};this.visible=function(){return(x.elm.parentNode)?true:false};y(u,w,v)};f=function(u,t){if(t.engine===e){t.engine="standard"}else{t.engine=t.engine.toLowerCase()}return new r.constructor.prototype.templateEngines[t.engine](u,t)};q.start(o,s)};b.prototype.templateEngines={};b.prototype.plugins={};b.prototype.templateEngines.standard=function(k,h){var l=c.getByClass(h.listClass,k.listContainer)[0],j=f(h.item),g=this;function f(q){if(q===e){var o=l.childNodes,n=[];for(var p=0,m=o.length;p<m;p++){if(o[p].data===e){return o[p]}}return null}else{if(q.indexOf("<")!==-1){var r=a.createElement("div");r.innerHTML=q;return r.firstChild}else{return a.getElementById(h.item)}}}var i={created:function(m){if(m.elm===e){g.create(m)}}};this.get=function(q,o){i.created(q);var n={};for(var p=0,m=o.length;p<m;p++){n[o[p]]=c.getByClass(o[p],q.elm)[0].innerHTML}return n};this.set=function(o,n){i.created(o);for(var m in n){if(n.hasOwnProperty(m)){var p=c.getByClass(m,o.elm,true);if(p){p.innerHTML=n[m]}}}};this.create=function(n){if(n.elm!==e){return}var m=j.cloneNode(true);m.id="";n.elm=m;g.set(n,n.values())};this.remove=function(m){l.removeChild(m.elm)};this.show=function(m){i.created(m);l.appendChild(m.elm)};this.hide=function(m){if(m.elm!==e&&m.elm.parentNode===l){l.removeChild(m.elm)}};this.clear=function(){if(l.hasChildNodes()){while(l.childNodes.length>=1){l.removeChild(l.firstChild)}}}};c={getByClass:(function(){if(a.getElementsByClassName){return function(g,f,h){if(h){return f.getElementsByClassName(g)[0]}else{return f.getElementsByClassName(g)}}}else{return function(m,g,o){var p=[],q="*";if(g==null){g=a}var k=g.getElementsByTagName(q);var f=k.length;var n=new RegExp("(^|\\s)"+m+"(\\s|$)");for(var l=0,h=0;l<f;l++){if(n.test(k[l].className)){if(o){return k[l]}else{p[h]=k[l];h++}}}return p}}})(),addEvent:(function(g,f){if(f.addEventListener){return function(m,l,j){if((m&&!(m instanceof Array)&&!m.length&&!c.isNodeList(m)&&(m.length!==0))||m===g){m.addEventListener(l,j,false)}else{if(m&&m[0]!==e){var h=m.length;for(var k=0;k<h;k++){c.addEvent(m[k],l,j)}}}}}else{if(f.attachEvent){return function(m,l,j){if((m&&!(m instanceof Array)&&!m.length&&!c.isNodeList(m)&&(m.length!==0))||m===g){m.attachEvent("on"+l,function(){return j.call(m,g.event)})}else{if(m&&m[0]!==e){var h=m.length;for(var k=0;k<h;k++){c.addEvent(m[k],l,j)}}}}}}})(this,a),getAttribute:function(l,g){var f=(l.getAttribute&&l.getAttribute(g))||null;if(!f){var h=l.attributes;var k=h.length;for(var j=0;j<k;j++){if(g[j]!==e){if(g[j].nodeName===g){f=g[j].nodeValue}}}}return f},isNodeList:function(g){var f=Object.prototype.toString.call(g);if(typeof g==="object"&&/^\[object (HTMLCollection|NodeList|Object)\]$/.test(f)&&(g.length==0||(typeof node==="object"&&g[0].nodeType>0))){return true}return false},hasClass:function(h,g){var f=this.getAttribute(h,"class")||this.getAttribute(h,"className");return(f.search(g)>-1)},addClass:function(h,g){if(!this.hasClass(h,g)){var f=this.getAttribute(h,"class")||this.getAttribute(h,"className");f=f+" "+g+" ";f=f.replace(/\s{2,}/g," ");h.setAttribute("class",f)}},removeClass:function(h,g){if(this.hasClass(h,g)){var f=this.getAttribute(h,"class")||this.getAttribute(h,"className");f=f.replace(g,"");h.setAttribute("class",f)}},sorter:{alphanum:function(h,g,i){if(h===e||h===null){h=""}if(g===e||g===null){g=""}h=h.toString().replace(/&(lt|gt);/g,function(n,o){return(o=="lt")?"<":">"});h=h.replace(/<\/?[^>]+(>|$)/g,"");g=g.toString().replace(/&(lt|gt);/g,function(n,o){return(o=="lt")?"<":">"});g=g.replace(/<\/?[^>]+(>|$)/g,"");var j=this.chunkify(h);var l=this.chunkify(g);for(var f=0;j[f]&&l[f];f++){if(j[f]!==l[f]){var m=Number(j[f]),k=Number(l[f]);if(i){if(m==j[f]&&k==l[f]){return m-k}else{return(j[f]>l[f])?1:-1}}else{if(m==j[f]&&k==l[f]){return k-m}else{return(j[f]>l[f])?-1:1}}}}return j.length-l.length},chunkify:function(l){var q=[],g=0,p=-1,o=0,k,h;while(k=(h=l.charAt(g++)).charCodeAt(0)){var f=(k==45||k==46||(k>=48&&k<=57));if(f!==o){q[++p]="";o=f}q[p]+=h}return q}}};d.List=b;d.ListJsHelpers=c})(window);
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
(function(window,undefined){var document=window.document;document.createElement("video");document.createElement("audio");var VideoJS=function(id,addOptions,ready){var tag;if(typeof id=="string"){if(id.indexOf("#")===0){id=id.slice(1)}if(_V_.players[id]){return _V_.players[id]}else{tag=_V_.el(id)}}else{tag=id}if(!tag||!tag.nodeName){throw new TypeError("The element or ID supplied is not valid. (VideoJS)")}return tag.player||new _V_.Player(tag,addOptions,ready)},_V_=VideoJS,CDN_VERSION="c";VideoJS.players={};VideoJS.options={techOrder:["html5","flash"],html5:{},flash:{swf:"http://vjs.zencdn.net/c/video-js.swf"},width:"auto",height:"auto",defaultVolume:0,components:{posterImage:{},textTrackDisplay:{},loadingSpinner:{},bigPlayButton:{},controlBar:{}}};if(CDN_VERSION!="GENERATED_CDN_VSN"){_V_.options.flash.swf="http://vjs.zencdn.net/"+CDN_VERSION+"/video-js.swf"}_V_.merge=function(obj1,obj2,safe){if(!obj2){obj2={}}for(var attrname in obj2){if(obj2.hasOwnProperty(attrname)&&(!safe||!obj1.hasOwnProperty(attrname))){obj1[attrname]=obj2[attrname]}}return obj1};_V_.extend=function(obj){this.merge(this,obj,true)};_V_.extend({tech:{},controlSets:{},isIE:function(){return !+"\v1"},isFF:function(){return !!_V_.ua.match("Firefox")},isIPad:function(){return navigator.userAgent.match(/iPad/i)!==null},isIPhone:function(){return navigator.userAgent.match(/iPhone/i)!==null},isIOS:function(){return VideoJS.isIPhone()||VideoJS.isIPad()},iOSVersion:function(){var match=navigator.userAgent.match(/OS (\d+)_/i);if(match&&match[1]){return match[1]}},isAndroid:function(){return navigator.userAgent.match(/Android.*AppleWebKit/i)!==null},androidVersion:function(){var match=navigator.userAgent.match(/Android (\d+)\./i);if(match&&match[1]){return match[1]}},testVid:document.createElement("video"),ua:navigator.userAgent,support:{},each:function(arr,fn){if(!arr||arr.length===0){return}for(var i=0,j=arr.length;i<j;i++){fn.call(this,arr[i],i)}},eachProp:function(obj,fn){if(!obj){return}for(var name in obj){if(obj.hasOwnProperty(name)){fn.call(this,name,obj[name])}}},el:function(id){return document.getElementById(id)},createElement:function(tagName,attributes){var el=document.createElement(tagName),attrname;for(attrname in attributes){if(attributes.hasOwnProperty(attrname)){if(attrname.indexOf("-")!==-1){el.setAttribute(attrname,attributes[attrname])}else{el[attrname]=attributes[attrname]}}}return el},insertFirst:function(node,parent){if(parent.firstChild){parent.insertBefore(node,parent.firstChild)}else{parent.appendChild(node)}},addClass:function(element,classToAdd){if((" "+element.className+" ").indexOf(" "+classToAdd+" ")==-1){element.className=element.className===""?classToAdd:element.className+" "+classToAdd}},removeClass:function(element,classToRemove){if(element.className.indexOf(classToRemove)==-1){return}var classNames=element.className.split(" ");classNames.splice(classNames.indexOf(classToRemove),1);element.className=classNames.join(" ")},remove:function(item,array){if(!array){return}var i=array.indexOf(item);if(i!=-1){return array.splice(i,1)}},blockTextSelection:function(){document.body.focus();document.onselectstart=function(){return false}},unblockTextSelection:function(){document.onselectstart=function(){return true}},formatTime:function(seconds,guide){guide=guide||seconds;var s=Math.floor(seconds%60),m=Math.floor(seconds/60%60),h=Math.floor(seconds/3600),gm=Math.floor(guide/60%60),gh=Math.floor(guide/3600);h=(h>0||gh>0)?h+":":"";m=(((h||gm>=10)&&m<10)?"0"+m:m)+":";s=(s<10)?"0"+s:s;return h+m+s},uc:function(string){return string.charAt(0).toUpperCase()+string.slice(1)},getRelativePosition:function(x,relativeElement){return Math.max(0,Math.min(1,(x-_V_.findPosX(relativeElement))/relativeElement.offsetWidth))},getComputedStyleValue:function(element,style){return window.getComputedStyle(element,null).getPropertyValue(style)},trim:function(string){return string.toString().replace(/^\s+/,"").replace(/\s+$/,"")},round:function(num,dec){if(!dec){dec=0}return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec)},isEmpty:function(object){for(var prop in object){return false}return true},createTimeRange:function(start,end){return{length:1,start:function(){return start},end:function(){return end}}},cache:{},guid:1,expando:"vdata"+(new Date).getTime(),getData:function(elem){var id=elem[_V_.expando];if(!id){id=elem[_V_.expando]=_V_.guid++;_V_.cache[id]={}}return _V_.cache[id]},removeData:function(elem){var id=elem[_V_.expando];if(!id){return}delete _V_.cache[id];try{delete elem[_V_.expando]}catch(e){if(elem.removeAttribute){elem.removeAttribute(_V_.expando)}else{elem[_V_.expando]=null}}},proxy:function(context,fn,uid){if(!fn.guid){fn.guid=_V_.guid++}var ret=function(){return fn.apply(context,arguments)};ret.guid=(uid)?uid+"_"+fn.guid:fn.guid;return ret},get:function(url,onSuccess,onError){var local=(url.indexOf("file:")==0||(window.location.href.indexOf("file:")==0&&url.indexOf("http:")==-1));if(typeof XMLHttpRequest=="undefined"){XMLHttpRequest=function(){try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(f){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(g){}throw new Error("This browser does not support XMLHttpRequest.")}}var request=new XMLHttpRequest();try{request.open("GET",url)}catch(e){_V_.log("VideoJS XMLHttpRequest (open)",e);return false}request.onreadystatechange=_V_.proxy(this,function(){if(request.readyState==4){if(request.status==200||local&&request.status==0){onSuccess(request.responseText)}else{if(onError){onError()}}}});try{request.send()}catch(e){_V_.log("VideoJS XMLHttpRequest (send)",e);if(onError){onError(e)}}},setLocalStorage:function(key,value){var localStorage=window.localStorage||false;if(!localStorage){return}try{localStorage[key]=value}catch(e){if(e.code==22||e.code==1014){_V_.log("LocalStorage Full (VideoJS)",e)}else{_V_.log("LocalStorage Error (VideoJS)",e)}}},getAbsoluteURL:function(url){if(!url.match(/^https?:\/\//)){url=_V_.createElement("div",{innerHTML:'<a href="'+url+'">x</a>'}).firstChild.href}return url}});_V_.log=function(){_V_.log.history=_V_.log.history||[];_V_.log.history.push(arguments);if(window.console){arguments.callee=arguments.callee.caller;var newarr=[].slice.call(arguments);(typeof console.log==="object"?_V_.log.apply.call(console.log,console,newarr):console.log.apply(console,newarr))}};(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try{console.log();return window.console}catch(err){return window.console={}}})());if("getBoundingClientRect" in document.documentElement){_V_.findPosX=function(el){var box;try{box=el.getBoundingClientRect()}catch(e){}if(!box){return 0}var docEl=document.documentElement,body=document.body,clientLeft=docEl.clientLeft||body.clientLeft||0,scrollLeft=window.pageXOffset||body.scrollLeft,left=box.left+scrollLeft-clientLeft;return left}}else{_V_.findPosX=function(el){var curleft=el.offsetLeft;while(el=obj.offsetParent){if(el.className.indexOf("video-js")==-1){}else{}curleft+=el.offsetLeft}return curleft}}(function(){var initializing=false,fnTest=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;_V_.Class=function(){};_V_.Class.extend=function(prop){var _super=this.prototype;initializing=true;var prototype=new this();initializing=false;for(var name in prop){prototype[name]=typeof prop[name]=="function"&&typeof _super[name]=="function"&&fnTest.test(prop[name])?(function(name,fn){return function(){var tmp=this._super;this._super=_super[name];var ret=fn.apply(this,arguments);this._super=tmp;return ret}})(name,prop[name]):prop[name]}function Class(){if(!initializing&&this.init){return this.init.apply(this,arguments)}else{if(!initializing){return arguments.callee.prototype.init()}}}Class.prototype=prototype;Class.constructor=Class;Class.extend=arguments.callee;return Class}})();_V_.Component=_V_.Class.extend({init:function(player,options){this.player=player;options=this.options=_V_.merge(this.options||{},options);if(options.el){this.el=options.el}else{this.el=this.createElement()}this.initComponents()},destroy:function(){},createElement:function(type,attrs){return _V_.createElement(type||"div",attrs)},buildCSSClass:function(){return""},initComponents:function(){var options=this.options;if(options&&options.components){this.eachProp(options.components,function(name,opts){var tempAdd=this.proxy(function(){this[name]=this.addComponent(name,opts)});if(opts.loadEvent){this.one(opts.loadEvent,tempAdd)}else{tempAdd()}})}},addComponent:function(name,options){var component,componentClass;if(typeof name=="string"){options=options||{};componentClass=options.componentClass||_V_.uc(name);component=new _V_[componentClass](this.player||this,options)}else{component=name}this.el.appendChild(component.el);return component},removeComponent:function(component){this.el.removeChild(component.el)},show:function(){this.el.style.display="block"},hide:function(){this.el.style.display="none"},fadeIn:function(){this.removeClass("vjs-fade-out");this.addClass("vjs-fade-in")},fadeOut:function(){this.removeClass("vjs-fade-in");this.addClass("vjs-fade-out")},lockShowing:function(){var style=this.el.style;style.display="block";style.opacity=1;style.visiblity="visible"},unlockShowing:function(){var style=this.el.style;style.display="";style.opacity="";style.visiblity=""},addClass:function(classToAdd){_V_.addClass(this.el,classToAdd)},removeClass:function(classToRemove){_V_.removeClass(this.el,classToRemove)},addEvent:function(type,fn,uid){return _V_.addEvent(this.el,type,_V_.proxy(this,fn))},removeEvent:function(type,fn){return _V_.removeEvent(this.el,type,fn)},triggerEvent:function(type,e){return _V_.triggerEvent(this.el,type,e)},one:function(type,fn){_V_.one(this.el,type,_V_.proxy(this,fn))},ready:function(fn){if(!fn){return this}if(this.isReady){fn.call(this)}else{if(this.readyQueue===undefined){this.readyQueue=[]}this.readyQueue.push(fn)}return this},triggerReady:function(){this.isReady=true;if(this.readyQueue&&this.readyQueue.length>0){this.each(this.readyQueue,function(fn){fn.call(this)});this.readyQueue=[];this.triggerEvent("ready")}},each:function(arr,fn){_V_.each.call(this,arr,fn)},eachProp:function(obj,fn){_V_.eachProp.call(this,obj,fn)},extend:function(obj){_V_.merge(this,obj)},proxy:function(fn,uid){return _V_.proxy(this,fn,uid)}});_V_.Control=_V_.Component.extend({buildCSSClass:function(){return"vjs-control "+this._super()}});_V_.ControlBar=_V_.Component.extend({options:{loadEvent:"play",components:{playToggle:{},fullscreenToggle:{},currentTimeDisplay:{},timeDivider:{},durationDisplay:{},remainingTimeDisplay:{},progressControl:{},volumeControl:{},muteToggle:{}}},init:function(player,options){this._super(player,options);player.addEvent("play",this.proxy(function(){this.fadeIn();this.player.addEvent("mouseover",this.proxy(this.fadeIn));this.player.addEvent("mouseout",this.proxy(this.fadeOut))}))},createElement:function(){return _V_.createElement("div",{className:"vjs-controls"})},fadeIn:function(){this._super();this.player.triggerEvent("controlsvisible")},fadeOut:function(){this._super();this.player.triggerEvent("controlshidden")},lockShowing:function(){this.el.style.opacity="1"}});_V_.Button=_V_.Control.extend({init:function(player,options){this._super(player,options);this.addEvent("click",this.onClick);this.addEvent("focus",this.onFocus);this.addEvent("blur",this.onBlur)},createElement:function(type,attrs){attrs=_V_.merge({className:this.buildCSSClass(),innerHTML:'<div><span class="vjs-control-text">'+(this.buttonText||"Need Text")+"</span></div>",role:"button",tabIndex:0},attrs);return this._super(type,attrs)},onClick:function(){},onFocus:function(){_V_.addEvent(document,"keyup",_V_.proxy(this,this.onKeyPress))},onKeyPress:function(event){if(event.which==32||event.which==13){event.preventDefault();this.onClick()}},onBlur:function(){_V_.removeEvent(document,"keyup",_V_.proxy(this,this.onKeyPress))}});_V_.PlayButton=_V_.Button.extend({buttonText:"Play",buildCSSClass:function(){return"vjs-play-button "+this._super()},onClick:function(){this.player.play()}});_V_.PauseButton=_V_.Button.extend({buttonText:"Pause",buildCSSClass:function(){return"vjs-pause-button "+this._super()},onClick:function(){this.player.pause()}});_V_.PlayToggle=_V_.Button.extend({buttonText:"Play",init:function(player,options){this._super(player,options);player.addEvent("play",_V_.proxy(this,this.onPlay));player.addEvent("pause",_V_.proxy(this,this.onPause))},buildCSSClass:function(){return"vjs-play-control "+this._super()},onClick:function(){if(this.player.paused()){this.player.play()}else{this.player.pause()}},onPlay:function(){_V_.removeClass(this.el,"vjs-paused");_V_.addClass(this.el,"vjs-playing")},onPause:function(){_V_.removeClass(this.el,"vjs-playing");_V_.addClass(this.el,"vjs-paused")}});_V_.FullscreenToggle=_V_.Button.extend({buttonText:"Fullscreen",buildCSSClass:function(){return"vjs-fullscreen-control "+this._super()},onClick:function(){if(!this.player.isFullScreen){this.player.requestFullScreen()}else{this.player.cancelFullScreen()}}});_V_.BigPlayButton=_V_.Button.extend({init:function(player,options){this._super(player,options);player.addEvent("play",_V_.proxy(this,this.hide));player.addEvent("ended",_V_.proxy(this,this.show))},createElement:function(){return this._super("div",{className:"vjs-big-play-button",innerHTML:"<span></span>"})},onClick:function(){if(this.player.currentTime()){this.player.currentTime(0)}this.player.play()}});_V_.LoadingSpinner=_V_.Component.extend({init:function(player,options){this._super(player,options);player.addEvent("canplay",_V_.proxy(this,this.hide));player.addEvent("canplaythrough",_V_.proxy(this,this.hide));player.addEvent("playing",_V_.proxy(this,this.hide));player.addEvent("seeking",_V_.proxy(this,this.show));player.addEvent("error",_V_.proxy(this,this.show));player.addEvent("waiting",_V_.proxy(this,this.show))},createElement:function(){var classNameSpinner,innerHtmlSpinner;if(typeof this.player.el.style.WebkitBorderRadius=="string"||typeof this.player.el.style.MozBorderRadius=="string"||typeof this.player.el.style.KhtmlBorderRadius=="string"||typeof this.player.el.style.borderRadius=="string"){classNameSpinner="vjs-loading-spinner";innerHtmlSpinner="<div class='ball1'></div><div class='ball2'></div><div class='ball3'></div><div class='ball4'></div><div class='ball5'></div><div class='ball6'></div><div class='ball7'></div><div class='ball8'></div>"}else{classNameSpinner="vjs-loading-spinner-fallback";innerHtmlSpinner=""}return this._super("div",{className:classNameSpinner,innerHTML:innerHtmlSpinner})}});_V_.CurrentTimeDisplay=_V_.Component.extend({init:function(player,options){this._super(player,options);player.addEvent("timeupdate",_V_.proxy(this,this.updateContent))},createElement:function(){var el=this._super("div",{className:"vjs-current-time vjs-time-controls vjs-control"});this.content=_V_.createElement("div",{className:"vjs-current-time-display",innerHTML:"0:00"});el.appendChild(_V_.createElement("div").appendChild(this.content));return el},updateContent:function(){var time=(this.player.scrubbing)?this.player.values.currentTime:this.player.currentTime();this.content.innerHTML=_V_.formatTime(time,this.player.duration())}});_V_.DurationDisplay=_V_.Component.extend({init:function(player,options){this._super(player,options);player.addEvent("timeupdate",_V_.proxy(this,this.updateContent))},createElement:function(){var el=this._super("div",{className:"vjs-duration vjs-time-controls vjs-control"});this.content=_V_.createElement("div",{className:"vjs-duration-display",innerHTML:"0:00"});el.appendChild(_V_.createElement("div").appendChild(this.content));return el},updateContent:function(){if(this.player.duration()){this.content.innerHTML=_V_.formatTime(this.player.duration())}}});_V_.TimeDivider=_V_.Component.extend({createElement:function(){return this._super("div",{className:"vjs-time-divider",innerHTML:"<div><span>/</span></div>"})}});_V_.RemainingTimeDisplay=_V_.Component.extend({init:function(player,options){this._super(player,options);player.addEvent("timeupdate",_V_.proxy(this,this.updateContent))},createElement:function(){var el=this._super("div",{className:"vjs-remaining-time vjs-time-controls vjs-control"});this.content=_V_.createElement("div",{className:"vjs-remaining-time-display",innerHTML:"-0:00"});el.appendChild(_V_.createElement("div").appendChild(this.content));return el},updateContent:function(){if(this.player.duration()){this.content.innerHTML="-"+_V_.formatTime(this.player.remainingTime())}}});_V_.Slider=_V_.Component.extend({init:function(player,options){this._super(player,options);player.addEvent(this.playerEvent,_V_.proxy(this,this.update));this.addEvent("mousedown",this.onMouseDown);this.addEvent("focus",this.onFocus);this.addEvent("blur",this.onBlur);this.player.addEvent("controlsvisible",this.proxy(this.update));this.update()},createElement:function(type,attrs){attrs=_V_.merge({role:"slider","aria-valuenow":0,"aria-valuemin":0,"aria-valuemax":100,tabIndex:0},attrs);return this._super(type,attrs)},onMouseDown:function(event){event.preventDefault();_V_.blockTextSelection();_V_.addEvent(document,"mousemove",_V_.proxy(this,this.onMouseMove));_V_.addEvent(document,"mouseup",_V_.proxy(this,this.onMouseUp));this.onMouseMove(event)},onMouseUp:function(event){_V_.unblockTextSelection();_V_.removeEvent(document,"mousemove",this.onMouseMove,false);_V_.removeEvent(document,"mouseup",this.onMouseUp,false);this.update()},update:function(){var barProgress,progress=this.getPercent();handle=this.handle,bar=this.bar;if(isNaN(progress)){progress=0}barProgress=progress;if(handle){var box=this.el,boxWidth=box.offsetWidth,handleWidth=handle.el.offsetWidth,handlePercent=(handleWidth)?handleWidth/boxWidth:0,boxAdjustedPercent=1-handlePercent;adjustedProgress=progress*boxAdjustedPercent,barProgress=adjustedProgress+(handlePercent/2);handle.el.style.left=_V_.round(adjustedProgress*100,2)+"%"}bar.el.style.width=_V_.round(barProgress*100,2)+"%"},calculateDistance:function(event){var box=this.el,boxX=_V_.findPosX(box),boxW=box.offsetWidth,handle=this.handle;if(handle){var handleW=handle.el.offsetWidth;boxX=boxX+(handleW/2);boxW=boxW-handleW}return Math.max(0,Math.min(1,(event.pageX-boxX)/boxW))},onFocus:function(event){_V_.addEvent(document,"keyup",_V_.proxy(this,this.onKeyPress))},onKeyPress:function(event){if(event.which==37){event.preventDefault();this.stepBack()}else{if(event.which==39){event.preventDefault();this.stepForward()}}},onBlur:function(event){_V_.removeEvent(document,"keyup",_V_.proxy(this,this.onKeyPress))}});_V_.ProgressControl=_V_.Component.extend({options:{components:{seekBar:{}}},createElement:function(){return this._super("div",{className:"vjs-progress-control vjs-control"})}});_V_.SeekBar=_V_.Slider.extend({options:{components:{loadProgressBar:{},bar:{componentClass:"PlayProgressBar"},handle:{componentClass:"SeekHandle"}}},playerEvent:"timeupdate",init:function(player,options){this._super(player,options)},createElement:function(){return this._super("div",{className:"vjs-progress-holder"})},getPercent:function(){return this.player.currentTime()/this.player.duration()},onMouseDown:function(event){this._super(event);this.player.scrubbing=true;this.videoWasPlaying=!this.player.paused();this.player.pause()},onMouseMove:function(event){var newTime=this.calculateDistance(event)*this.player.duration();if(newTime==this.player.duration()){newTime=newTime-0.1}this.player.currentTime(newTime)},onMouseUp:function(event){this._super(event);this.player.scrubbing=false;if(this.videoWasPlaying){this.player.play()}},stepForward:function(){this.player.currentTime(this.player.currentTime()+1)},stepBack:function(){this.player.currentTime(this.player.currentTime()-1)}});_V_.LoadProgressBar=_V_.Component.extend({init:function(player,options){this._super(player,options);player.addEvent("progress",_V_.proxy(this,this.update))},createElement:function(){return this._super("div",{className:"vjs-load-progress",innerHTML:'<span class="vjs-control-text">Loaded: 0%</span>'})},update:function(){if(this.el.style){this.el.style.width=_V_.round(this.player.bufferedPercent()*100,2)+"%"}}});_V_.PlayProgressBar=_V_.Component.extend({createElement:function(){return this._super("div",{className:"vjs-play-progress",innerHTML:'<span class="vjs-control-text">Progress: 0%</span>'})}});_V_.SeekHandle=_V_.Component.extend({createElement:function(){return this._super("div",{className:"vjs-seek-handle",innerHTML:'<span class="vjs-control-text">00:00</span>'})}});_V_.VolumeControl=_V_.Component.extend({options:{components:{volumeBar:{}}},createElement:function(){return this._super("div",{className:"vjs-volume-control vjs-control"})}});_V_.VolumeBar=_V_.Slider.extend({options:{components:{bar:{componentClass:"VolumeLevel"},handle:{componentClass:"VolumeHandle"}}},playerEvent:"volumechange",createElement:function(){return this._super("div",{className:"vjs-volume-bar"})},onMouseMove:function(event){this.player.volume(this.calculateDistance(event))},getPercent:function(){return this.player.volume()},stepForward:function(){this.player.volume(this.player.volume()+0.1)},stepBack:function(){this.player.volume(this.player.volume()-0.1)}});_V_.VolumeLevel=_V_.Component.extend({createElement:function(){return this._super("div",{className:"vjs-volume-level",innerHTML:'<span class="vjs-control-text"></span>'})}});_V_.VolumeHandle=_V_.Component.extend({createElement:function(){return this._super("div",{className:"vjs-volume-handle",innerHTML:'<span class="vjs-control-text"></span>'})}});_V_.MuteToggle=_V_.Button.extend({init:function(player,options){this._super(player,options);player.addEvent("volumechange",_V_.proxy(this,this.update))},createElement:function(){return this._super("div",{className:"vjs-mute-control vjs-control",innerHTML:'<div><span class="vjs-control-text">Mute</span></div>'})},onClick:function(event){this.player.muted(this.player.muted()?false:true)},update:function(event){var vol=this.player.volume(),level=3;if(vol==0||this.player.muted()){level=0}else{if(vol<0.33){level=1}else{if(vol<0.67){level=2}}}_V_.each.call(this,[0,1,2,3],function(i){_V_.removeClass(this.el,"vjs-vol-"+i)});_V_.addClass(this.el,"vjs-vol-"+level)}});_V_.PosterImage=_V_.Button.extend({init:function(player,options){this._super(player,options);if(!this.player.options.poster){this.hide()}player.addEvent("play",_V_.proxy(this,this.hide))},createElement:function(){return _V_.createElement("img",{className:"vjs-poster",src:this.player.options.poster,tabIndex:-1})},onClick:function(){this.player.play()}});_V_.Menu=_V_.Component.extend({init:function(player,options){this._super(player,options)},addItem:function(component){this.addComponent(component);component.addEvent("click",this.proxy(function(){this.unlockShowing()}))},createElement:function(){return this._super("ul",{className:"vjs-menu"})}});_V_.MenuItem=_V_.Button.extend({init:function(player,options){this._super(player,options);if(options.selected){this.addClass("vjs-selected")}},createElement:function(type,attrs){return this._super("li",_V_.merge({className:"vjs-menu-item",innerHTML:this.options.label},attrs))},onClick:function(){this.selected(true)},selected:function(selected){if(selected){this.addClass("vjs-selected")}else{this.removeClass("vjs-selected")}}});if(!Array.prototype.indexOf){Array.prototype.indexOf=function(searchElement){if(this===void 0||this===null){throw new TypeError()}var t=Object(this);var len=t.length>>>0;if(len===0){return -1}var n=0;if(arguments.length>0){n=Number(arguments[1]);if(n!==n){n=0}else{if(n!==0&&n!==(1/0)&&n!==-(1/0)){n=(n>0||-1)*Math.floor(Math.abs(n))}}}if(n>=len){return -1}var k=n>=0?n:Math.max(len-Math.abs(n),0);for(;k<len;k++){if(k in t&&t[k]===searchElement){return k}}return -1}}_V_.extend({addEvent:function(elem,type,fn){var data=_V_.getData(elem),handlers;if(data&&!data.handler){data.handler=function(event){event=_V_.fixEvent(event);var handlers=_V_.getData(elem).events[event.type];if(handlers){var handlersCopy=[];_V_.each(handlers,function(handler,i){handlersCopy[i]=handler});for(var i=0,l=handlersCopy.length;i<l;i++){handlersCopy[i].call(elem,event)}}}}if(!data.events){data.events={}}handlers=data.events[type];if(!handlers){handlers=data.events[type]=[];if(document.addEventListener){elem.addEventListener(type,data.handler,false)}else{if(document.attachEvent){elem.attachEvent("on"+type,data.handler)}}}if(!fn.guid){fn.guid=_V_.guid++}handlers.push(fn)},removeEvent:function(elem,type,fn){var data=_V_.getData(elem),handlers;if(!data.events){return}if(!type){for(type in data.events){_V_.cleanUpEvents(elem,type)}return}handlers=data.events[type];if(!handlers){return}if(fn&&fn.guid){for(var i=0;i<handlers.length;i++){if(handlers[i].guid===fn.guid){handlers.splice(i--,1)}}}_V_.cleanUpEvents(elem,type)},cleanUpEvents:function(elem,type){var data=_V_.getData(elem);if(data.events[type].length===0){delete data.events[type];if(document.removeEventListener){elem.removeEventListener(type,data.handler,false)}else{if(document.detachEvent){elem.detachEvent("on"+type,data.handler)}}}if(_V_.isEmpty(data.events)){delete data.events;delete data.handler}if(_V_.isEmpty(data)){_V_.removeData(elem)}},fixEvent:function(event){if(event[_V_.expando]){return event}var originalEvent=event;event=new _V_.Event(originalEvent);for(var i=_V_.Event.props.length,prop;i;){prop=_V_.Event.props[--i];event[prop]=originalEvent[prop]}if(!event.target){event.target=event.srcElement||document}if(event.target.nodeType===3){event.target=event.target.parentNode}if(!event.relatedTarget&&event.fromElement){event.relatedTarget=event.fromElement===event.target?event.toElement:event.fromElement}if(event.pageX==null&&event.clientX!=null){var eventDocument=event.target.ownerDocument||document,doc=eventDocument.documentElement,body=eventDocument.body;event.pageX=event.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc&&doc.clientLeft||body&&body.clientLeft||0);event.pageY=event.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc&&doc.clientTop||body&&body.clientTop||0)}if(event.which==null&&(event.charCode!=null||event.keyCode!=null)){event.which=event.charCode!=null?event.charCode:event.keyCode}if(!event.metaKey&&event.ctrlKey){event.metaKey=event.ctrlKey}if(!event.which&&event.button!==undefined){event.which=(event.button&1?1:(event.button&2?3:(event.button&4?2:0)))}return event},triggerEvent:function(elem,event){var data=_V_.getData(elem),parent=elem.parentNode||elem.ownerDocument,type=event.type||event,handler;if(data){handler=data.handler}event=typeof event==="object"?event[_V_.expando]?event:new _V_.Event(type,event):new _V_.Event(type);event.type=type;if(handler){handler.call(elem,event)}event.result=undefined;event.target=elem},one:function(elem,type,fn){_V_.addEvent(elem,type,function(){_V_.removeEvent(elem,type,arguments.callee);fn.apply(this,arguments)})}});_V_.Event=function(src,props){if(src&&src.type){this.originalEvent=src;this.type=src.type;this.isDefaultPrevented=(src.defaultPrevented||src.returnValue===false||src.getPreventDefault&&src.getPreventDefault())?returnTrue:returnFalse}else{this.type=src}if(props){_V_.merge(this,props)}this.timeStamp=(new Date).getTime();this[_V_.expando]=true};_V_.Event.prototype={preventDefault:function(){this.isDefaultPrevented=returnTrue;var e=this.originalEvent;if(!e){return}if(e.preventDefault){e.preventDefault()}else{e.returnValue=false}},stopPropagation:function(){this.isPropagationStopped=returnTrue;var e=this.originalEvent;if(!e){return}if(e.stopPropagation){e.stopPropagation()}e.cancelBubble=true},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=returnTrue;this.stopPropagation()},isDefaultPrevented:returnFalse,isPropagationStopped:returnFalse,isImmediatePropagationStopped:returnFalse};_V_.Event.props="altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" ");function returnTrue(){return true}function returnFalse(){return false}var JSON;if(!JSON){JSON={}}(function(){var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());_V_.Player=_V_.Component.extend({init:function(tag,addOptions,ready){this.tag=tag;var el=this.el=_V_.createElement("div"),options=this.options={},width=options.width=tag.getAttribute("width"),height=options.height=tag.getAttribute("height"),initWidth=width||300,initHeight=height||150;tag.player=el.player=this;this.ready(ready);tag.parentNode.insertBefore(el,tag);el.appendChild(tag);el.id=this.id=tag.id;el.className=tag.className;tag.id+="_html5_api";tag.className="vjs-tech";_V_.players[el.id]=this;el.setAttribute("width",initWidth);el.setAttribute("height",initHeight);el.style.width=initWidth+"px";el.style.height=initHeight+"px";tag.removeAttribute("width");tag.removeAttribute("height");_V_.merge(options,_V_.options);_V_.merge(options,this.getVideoTagSettings());_V_.merge(options,addOptions);tag.removeAttribute("controls");tag.removeAttribute("poster");if(tag.hasChildNodes()){for(var i=0,j=tag.childNodes;i<j.length;i++){if(j[i].nodeName=="SOURCE"||j[i].nodeName=="TRACK"){tag.removeChild(j[i])}}}this.values={};this.addClass("vjs-paused");this.addEvent("ended",this.onEnded);this.addEvent("play",this.onPlay);this.addEvent("pause",this.onPause);this.addEvent("progress",this.onProgress);this.addEvent("error",this.onError);if(options.controls){this.ready(function(){this.initComponents()})}this.textTracks=[];if(options.tracks&&options.tracks.length>0){this.addTextTracks(options.tracks)}if(!options.sources||options.sources.length==0){for(var i=0,j=options.techOrder;i<j.length;i++){var techName=j[i],tech=_V_[techName];if(tech.isSupported()){this.loadTech(techName);break}}}else{this.src(options.sources)}},values:{},destroy:function(){this.stopTrackingProgress();this.stopTrackingCurrentTime();_V_.players[this.id]=null;delete _V_.players[this.id];this.tech.destroy();this.el.parentNode.removeChild(this.el)},createElement:function(type,options){},getVideoTagSettings:function(){var options={sources:[],tracks:[]};options.src=this.tag.getAttribute("src");options.controls=this.tag.getAttribute("controls")!==null;options.poster=this.tag.getAttribute("poster");options.preload=this.tag.getAttribute("preload");options.autoplay=this.tag.getAttribute("autoplay")!==null;options.loop=this.tag.getAttribute("loop")!==null;options.muted=this.tag.getAttribute("muted")!==null;if(this.tag.hasChildNodes()){for(var c,i=0,j=this.tag.childNodes;i<j.length;i++){c=j[i];if(c.nodeName=="SOURCE"){options.sources.push({src:c.getAttribute("src"),type:c.getAttribute("type"),media:c.getAttribute("media"),title:c.getAttribute("title")})}if(c.nodeName=="TRACK"){options.tracks.push({src:c.getAttribute("src"),kind:c.getAttribute("kind"),srclang:c.getAttribute("srclang"),label:c.getAttribute("label"),"default":c.getAttribute("default")!==null,title:c.getAttribute("title")})}}}return options},loadTech:function(techName,source){if(this.tech){this.unloadTech()}else{if(techName!="html5"&&this.tag){this.el.removeChild(this.tag);this.tag=false}}this.techName=techName;this.isReady=false;var techReady=function(){this.player.triggerReady();if(!this.support.progressEvent){this.player.manualProgressOn()}if(!this.support.timeupdateEvent){this.player.manualTimeUpdatesOn()}};var techOptions=_V_.merge({source:source,parentEl:this.el},this.options[techName]);if(source){if(source.src==this.values.src&&this.values.currentTime>0){techOptions.startTime=this.values.currentTime}this.values.src=source.src}this.tech=new _V_[techName](this,techOptions);this.tech.ready(techReady)},unloadTech:function(){this.tech.destroy();if(this.manualProgress){this.manualProgressOff()}if(this.manualTimeUpdates){this.manualTimeUpdatesOff()}this.tech=false},manualProgressOn:function(){this.manualProgress=true;this.trackProgress();this.tech.addEvent("progress",function(){this.removeEvent("progress",arguments.callee);this.support.progressEvent=true;this.player.manualProgressOff()})},manualProgressOff:function(){this.manualProgress=false;this.stopTrackingProgress()},trackProgress:function(){this.progressInterval=setInterval(_V_.proxy(this,function(){if(this.values.bufferEnd<this.buffered().end(0)){this.triggerEvent("progress")}else{if(this.bufferedPercent()==1){this.stopTrackingProgress();this.triggerEvent("progress")}}}),500)},stopTrackingProgress:function(){clearInterval(this.progressInterval)},manualTimeUpdatesOn:function(){this.manualTimeUpdates=true;this.addEvent("play",this.trackCurrentTime);this.addEvent("pause",this.stopTrackingCurrentTime);this.tech.addEvent("timeupdate",function(){this.removeEvent("timeupdate",arguments.callee);this.support.timeupdateEvent=true;this.player.manualTimeUpdatesOff()})},manualTimeUpdatesOff:function(){this.manualTimeUpdates=false;this.stopTrackingCurrentTime();this.removeEvent("play",this.trackCurrentTime);this.removeEvent("pause",this.stopTrackingCurrentTime)},trackCurrentTime:function(){if(this.currentTimeInterval){this.stopTrackingCurrentTime()}this.currentTimeInterval=setInterval(_V_.proxy(this,function(){this.triggerEvent("timeupdate")}),250)},stopTrackingCurrentTime:function(){clearInterval(this.currentTimeInterval)},onEnded:function(){if(this.options.loop){this.currentTime(0);this.play()}else{this.pause();this.currentTime(0);this.pause()}},onPlay:function(){_V_.removeClass(this.el,"vjs-paused");_V_.addClass(this.el,"vjs-playing")},onPause:function(){_V_.removeClass(this.el,"vjs-playing");_V_.addClass(this.el,"vjs-paused")},onProgress:function(){if(this.bufferedPercent()==1){this.triggerEvent("loadedalldata")}},onError:function(e){_V_.log("Video Error",e)},techCall:function(method,arg){if(!this.tech.isReady){this.tech.ready(function(){this[method](arg)})}else{try{this.tech[method](arg)}catch(e){_V_.log(e)}}},techGet:function(method){if(this.tech.isReady){try{return this.tech[method]()}catch(e){if(this.tech[method]===undefined){_V_.log("Video.js: "+method+" method not defined for "+this.techName+" playback technology.",e)}else{if(e.name=="TypeError"){_V_.log("Video.js: "+method+" unavailable on "+this.techName+" playback technology element.",e);this.tech.isReady=false}else{_V_.log(e)}}}}return},play:function(){this.techCall("play");return this},pause:function(){this.techCall("pause");return this},paused:function(){return(this.techGet("paused")===false)?false:true},currentTime:function(seconds){if(seconds!==undefined){this.values.lastSetCurrentTime=seconds;this.techCall("setCurrentTime",seconds);if(this.manualTimeUpdates){this.triggerEvent("timeupdate")}return this}return this.values.currentTime=(this.techGet("currentTime")||0)},duration:function(){return parseFloat(this.techGet("duration"))},remainingTime:function(){return this.duration()-this.currentTime()},buffered:function(){var buffered=this.techGet("buffered"),start=0,end=this.values.bufferEnd=this.values.bufferEnd||0,timeRange;if(buffered&&buffered.length>0&&buffered.end(0)!==end){end=buffered.end(0);this.values.bufferEnd=end}return _V_.createTimeRange(start,end)},bufferedPercent:function(){return(this.duration())?this.buffered().end(0)/this.duration():0},volume:function(percentAsDecimal){var vol;if(percentAsDecimal!==undefined){vol=Math.max(0,Math.min(1,parseFloat(percentAsDecimal)));this.values.volume=vol;this.techCall("setVolume",vol);_V_.setLocalStorage("volume",vol);return this}vol=parseFloat(this.techGet("volume"));return(isNaN(vol))?1:vol},muted:function(muted){if(muted!==undefined){this.techCall("setMuted",muted);return this}return this.techGet("muted")||false},width:function(width,skipListeners){if(width!==undefined){this.el.width=width;this.el.style.width=width+"px";if(!skipListeners){this.triggerEvent("resize")}return this}return parseInt(this.el.getAttribute("width"))},height:function(height){if(height!==undefined){this.el.height=height;this.el.style.height=height+"px";this.triggerEvent("resize");return this}return parseInt(this.el.getAttribute("height"))},size:function(width,height){return this.width(width,true).height(height)},supportsFullScreen:function(){return this.techGet("supportsFullScreen")||false},requestFullScreen:function(){var requestFullScreen=_V_.support.requestFullScreen;this.isFullScreen=true;if(requestFullScreen){_V_.addEvent(document,requestFullScreen.eventName,this.proxy(function(){this.isFullScreen=document[requestFullScreen.isFullScreen];if(this.isFullScreen==false){_V_.removeEvent(document,requestFullScreen.eventName,arguments.callee)}this.triggerEvent("fullscreenchange")}));if(this.tech.support.fullscreenResize===false&&this.options.flash.iFrameMode!=true){this.pause();this.unloadTech();_V_.addEvent(document,requestFullScreen.eventName,this.proxy(function(){_V_.removeEvent(document,requestFullScreen.eventName,arguments.callee);this.loadTech(this.techName,{src:this.values.src})}));this.el[requestFullScreen.requestFn]()}else{this.el[requestFullScreen.requestFn]()}}else{if(this.tech.supportsFullScreen()){this.triggerEvent("fullscreenchange");this.techCall("enterFullScreen")}else{this.triggerEvent("fullscreenchange");this.enterFullWindow()}}return this},cancelFullScreen:function(){var requestFullScreen=_V_.support.requestFullScreen;this.isFullScreen=false;if(requestFullScreen){if(this.tech.support.fullscreenResize===false&&this.options.flash.iFrameMode!=true){this.pause();this.unloadTech();_V_.addEvent(document,requestFullScreen.eventName,this.proxy(function(){_V_.removeEvent(document,requestFullScreen.eventName,arguments.callee);this.loadTech(this.techName,{src:this.values.src})}));document[requestFullScreen.cancelFn]()}else{document[requestFullScreen.cancelFn]()}}else{if(this.tech.supportsFullScreen()){this.techCall("exitFullScreen");this.triggerEvent("fullscreenchange")}else{this.exitFullWindow();this.triggerEvent("fullscreenchange")}}return this},enterFullWindow:function(){this.isFullWindow=true;this.docOrigOverflow=document.documentElement.style.overflow;_V_.addEvent(document,"keydown",_V_.proxy(this,this.fullWindowOnEscKey));document.documentElement.style.overflow="hidden";_V_.addClass(document.body,"vjs-full-window");_V_.addClass(this.el,"vjs-fullscreen");this.triggerEvent("enterFullWindow")},fullWindowOnEscKey:function(event){if(event.keyCode==27){if(this.isFullScreen==true){this.cancelFullScreen()}else{this.exitFullWindow()}}},exitFullWindow:function(){this.isFullWindow=false;_V_.removeEvent(document,"keydown",this.fullWindowOnEscKey);document.documentElement.style.overflow=this.docOrigOverflow;_V_.removeClass(document.body,"vjs-full-window");_V_.removeClass(this.el,"vjs-fullscreen");this.triggerEvent("exitFullWindow")},selectSource:function(sources){for(var i=0,j=this.options.techOrder;i<j.length;i++){var techName=j[i],tech=_V_[techName];if(tech.isSupported()){for(var a=0,b=sources;a<b.length;a++){var source=b[a];if(tech.canPlaySource.call(this,source)){return{source:source,tech:techName}}}}}return false},src:function(source){if(source instanceof Array){var sourceTech=this.selectSource(source),source,techName;if(sourceTech){source=sourceTech.source;techName=sourceTech.tech;if(techName==this.techName){this.src(source)}else{this.loadTech(techName,source)}}else{_V_.log("No compatible source and playback technology were found.")}}else{if(source instanceof Object){if(_V_[this.techName].canPlaySource(source)){this.src(source.src)}else{this.src([source])}}else{this.values.src=source;if(!this.isReady){this.ready(function(){this.src(source)})}else{this.techCall("src",source);if(this.options.preload=="auto"){this.load()}if(this.options.autoplay){this.play()}}}}return this},load:function(){this.techCall("load");return this},currentSrc:function(){return this.techGet("currentSrc")||this.values.src||""},preload:function(value){if(value!==undefined){this.techCall("setPreload",value);this.options.preload=value;return this}return this.techGet("preload")},autoplay:function(value){if(value!==undefined){this.techCall("setAutoplay",value);this.options.autoplay=value;return this}return this.techGet("autoplay",value)},loop:function(value){if(value!==undefined){this.techCall("setLoop",value);this.options.loop=value;return this}return this.techGet("loop")},controls:function(){return this.options.controls},poster:function(){return this.techGet("poster")},error:function(){return this.techGet("error")},ended:function(){return this.techGet("ended")}});(function(){var requestFn,cancelFn,eventName,isFullScreen,playerProto=_V_.Player.prototype;if(document.cancelFullscreen!==undefined){requestFn="requestFullscreen";cancelFn="exitFullscreen";eventName="fullscreenchange";isFullScreen="fullScreen"}else{_V_.each(["moz","webkit"],function(prefix){if((prefix!="moz"||document.mozFullScreenEnabled)&&document[prefix+"CancelFullScreen"]!==undefined){requestFn=prefix+"RequestFullScreen";cancelFn=prefix+"CancelFullScreen";eventName=prefix+"fullscreenchange";if(prefix=="webkit"){isFullScreen=prefix+"IsFullScreen"}else{isFullScreen=prefix+"FullScreen"}}})}if(requestFn){_V_.support.requestFullScreen={requestFn:requestFn,cancelFn:cancelFn,eventName:eventName,isFullScreen:isFullScreen}}})();_V_.PlaybackTech=_V_.Component.extend({init:function(player,options){},onClick:function(){if(this.player.options.controls){_V_.PlayToggle.prototype.onClick.call(this)}}});_V_.apiMethods="play,pause,paused,currentTime,setCurrentTime,duration,buffered,volume,setVolume,muted,setMuted,width,height,supportsFullScreen,enterFullScreen,src,load,currentSrc,preload,setPreload,autoplay,setAutoplay,loop,setLoop,error,networkState,readyState,seeking,initialTime,startOffsetTime,played,seekable,ended,videoTracks,audioTracks,videoWidth,videoHeight,textTracks,defaultPlaybackRate,playbackRate,mediaGroup,controller,controls,defaultMuted".split(",");_V_.each(_V_.apiMethods,function(methodName){_V_.PlaybackTech.prototype[methodName]=function(){throw new Error("The '"+methodName+"' method is not available on the playback technology's API")}});_V_.html5=_V_.PlaybackTech.extend({init:function(player,options,ready){this.player=player;this.el=this.createElement();this.ready(ready);this.addEvent("click",this.proxy(this.onClick));var source=options.source;if(source&&this.el.currentSrc==source.src){player.triggerEvent("loadstart")}else{if(source){this.el.src=source.src}}player.ready(function(){if(this.options.autoplay&&this.paused()){this.tag.poster=null;this.play()}});this.setupTriggers();this.triggerReady()},destroy:function(){this.player.tag=false;this.removeTriggers();this.el.parentNode.removeChild(this.el)},createElement:function(){var html5=_V_.html5,player=this.player,el=player.tag,newEl;if(!el||this.support.movingElementInDOM===false){if(el){player.el.removeChild(el)}newEl=_V_.createElement("video",{id:el.id||player.el.id+"_html5_api",className:el.className||"vjs-tech"});el=newEl;_V_.insertFirst(el,player.el)}_V_.each(["autoplay","preload","loop","muted"],function(attr){if(player.options[attr]!==null){el[attr]=player.options[attr]}},this);return el},setupTriggers:function(){_V_.each.call(this,_V_.html5.events,function(type){_V_.addEvent(this.el,type,_V_.proxy(this.player,this.eventHandler))})},removeTriggers:function(){_V_.each.call(this,_V_.html5.events,function(type){_V_.removeEvent(this.el,type,_V_.proxy(this.player,this.eventHandler))})},eventHandler:function(e){e.stopPropagation();this.triggerEvent(e)},play:function(){this.el.play()},pause:function(){this.el.pause()},paused:function(){return this.el.paused},currentTime:function(){return this.el.currentTime},setCurrentTime:function(seconds){try{this.el.currentTime=seconds}catch(e){_V_.log(e,"Video isn't ready. (VideoJS)")}},duration:function(){return this.el.duration||0},buffered:function(){return this.el.buffered},volume:function(){return this.el.volume},setVolume:function(percentAsDecimal){this.el.volume=percentAsDecimal},muted:function(){return this.el.muted},setMuted:function(muted){this.el.muted=muted},width:function(){return this.el.offsetWidth},height:function(){return this.el.offsetHeight},supportsFullScreen:function(){if(typeof this.el.webkitEnterFullScreen=="function"){if(!navigator.userAgent.match("Chrome")&&!navigator.userAgent.match("Mac OS X 10.5")){return true}}return false},enterFullScreen:function(){try{this.el.webkitEnterFullScreen()}catch(e){if(e.code==11){_V_.log("VideoJS: Video not ready.")}}},src:function(src){this.el.src=src},load:function(){this.el.load()},currentSrc:function(){return this.el.currentSrc},preload:function(){return this.el.preload},setPreload:function(val){this.el.preload=val},autoplay:function(){return this.el.autoplay},setAutoplay:function(val){this.el.autoplay=val},loop:function(){return this.el.loop},setLoop:function(val){this.el.loop=val},error:function(){return this.el.error},seeking:function(){return this.el.seeking},ended:function(){return this.el.ended},controls:function(){return this.player.options.controls},defaultMuted:function(){return this.el.defaultMuted}});_V_.html5.isSupported=function(){return !!document.createElement("video").canPlayType};_V_.html5.canPlaySource=function(srcObj){return !!document.createElement("video").canPlayType(srcObj.type)};_V_.html5.events="loadstart,suspend,abort,error,emptied,stalled,loadedmetadata,loadeddata,canplay,canplaythrough,playing,waiting,seeking,seeked,ended,durationchange,timeupdate,progress,play,pause,ratechange,volumechange".split(",");_V_.html5.prototype.support={fullscreen:(typeof _V_.testVid.webkitEnterFullScreen!==undefined)?(!_V_.ua.match("Chrome")&&!_V_.ua.match("Mac OS X 10.5")?true:false):false,movingElementInDOM:!_V_.isIOS()};if(_V_.isAndroid()){if(_V_.androidVersion()<3){document.createElement("video").constructor.prototype.canPlayType=function(type){return(type&&type.toLowerCase().indexOf("video/mp4")!=-1)?"maybe":""}}}_V_.flash=_V_.PlaybackTech.extend({init:function(player,options){this.player=player;var source=options.source,parentEl=options.parentEl,placeHolder=this.el=_V_.createElement("div",{id:parentEl.id+"_temp_flash"}),objId=player.el.id+"_flash_api",playerOptions=player.options,flashVars=_V_.merge({readyFunction:"_V_.flash.onReady",eventProxyFunction:"_V_.flash.onEvent",errorEventProxyFunction:"_V_.flash.onError",autoplay:playerOptions.autoplay,preload:playerOptions.preload,loop:playerOptions.loop,muted:playerOptions.muted},options.flashVars),params=_V_.merge({wmode:"opaque",bgcolor:"#000000"},options.params),attributes=_V_.merge({id:objId,name:objId,"class":"vjs-tech"},options.attributes);if(source){flashVars.src=encodeURIComponent(_V_.getAbsoluteURL(source.src))}_V_.insertFirst(placeHolder,parentEl);if(options.startTime){this.ready(function(){this.load();this.play();this.currentTime(options.startTime)})}if(options.iFrameMode==true&&!_V_.isFF){var iFrm=_V_.createElement("iframe",{id:objId+"_iframe",name:objId+"_iframe",className:"vjs-tech",scrolling:"no",marginWidth:0,marginHeight:0,frameBorder:0});flashVars.readyFunction="ready";flashVars.eventProxyFunction="events";flashVars.errorEventProxyFunction="errors";_V_.addEvent(iFrm,"load",_V_.proxy(this,function(){var iDoc,objTag,swfLoc,iWin=iFrm.contentWindow,varString="";iDoc=iFrm.contentDocument?iFrm.contentDocument:iFrm.contentWindow.document;iDoc.write(_V_.flash.getEmbedCode(options.swf,flashVars,params,attributes));iWin.player=this.player;iWin.ready=_V_.proxy(this.player,function(currSwf){var el=iDoc.getElementById(currSwf),player=this,tech=player.tech;tech.el=el;_V_.addEvent(el,"click",tech.proxy(tech.onClick));_V_.flash.checkReady(tech)});iWin.events=_V_.proxy(this.player,function(swfID,eventName,other){var player=this;if(player&&player.techName=="flash"){player.triggerEvent(eventName)}});iWin.errors=_V_.proxy(this.player,function(swfID,eventName){_V_.log("Flash Error",eventName)})}));placeHolder.parentNode.replaceChild(iFrm,placeHolder)}else{_V_.flash.embed(options.swf,placeHolder,flashVars,params,attributes)}},destroy:function(){this.el.parentNode.removeChild(this.el)},play:function(){this.el.vjs_play()},pause:function(){this.el.vjs_pause()},src:function(src){src=_V_.getAbsoluteURL(src);this.el.vjs_src(src);if(this.player.autoplay()){var tech=this;setTimeout(function(){tech.play()},0)}},load:function(){this.el.vjs_load()},poster:function(){this.el.vjs_getProperty("poster")},buffered:function(){return _V_.createTimeRange(0,this.el.vjs_getProperty("buffered"))},supportsFullScreen:function(){return false},enterFullScreen:function(){return false}});(function(){var api=_V_.flash.prototype,readWrite="preload,currentTime,defaultPlaybackRate,playbackRate,autoplay,loop,mediaGroup,controller,controls,volume,muted,defaultMuted".split(","),readOnly="error,currentSrc,networkState,readyState,seeking,initialTime,duration,startOffsetTime,paused,played,seekable,ended,videoTracks,audioTracks,videoWidth,videoHeight,textTracks".split(","),callOnly="load,play,pause".split(",");createSetter=function(attr){var attrUpper=attr.charAt(0).toUpperCase()+attr.slice(1);api["set"+attrUpper]=function(val){return this.el.vjs_setProperty(attr,val)}},createGetter=function(attr){api[attr]=function(){return this.el.vjs_getProperty(attr)}};_V_.each(readWrite,function(attr){createGetter(attr);createSetter(attr)});_V_.each(readOnly,function(attr){createGetter(attr)})})();_V_.flash.isSupported=function(){return _V_.flash.version()[0]>=10};_V_.flash.canPlaySource=function(srcObj){if(srcObj.type in _V_.flash.prototype.support.formats){return"maybe"}};_V_.flash.prototype.support={formats:{"video/flv":"FLV","video/x-flv":"FLV","video/mp4":"MP4","video/m4v":"MP4"},progressEvent:false,timeupdateEvent:false,fullscreenResize:false,parentResize:!(_V_.ua.match("Firefox"))};_V_.flash.onReady=function(currSwf){var el=_V_.el(currSwf);var player=el.player||el.parentNode.player,tech=player.tech;el.player=player;tech.el=el;tech.addEvent("click",tech.onClick);_V_.flash.checkReady(tech)};_V_.flash.checkReady=function(tech){if(tech.el.vjs_getProperty){tech.triggerReady()}else{setTimeout(function(){_V_.flash.checkReady(tech)},50)}};_V_.flash.onEvent=function(swfID,eventName){var player=_V_.el(swfID).player;player.triggerEvent(eventName)};_V_.flash.onError=function(swfID,err){var player=_V_.el(swfID).player;player.triggerEvent("error");_V_.log("Flash Error",err,swfID)};_V_.flash.version=function(){var version="0,0,0";try{version=new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version").replace(/\D+/g,",").match(/^,?(.+),?$/)[1]}catch(e){try{if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){version=(navigator.plugins["Shockwave Flash 2.0"]||navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g,",").match(/^,?(.+),?$/)[1]}}catch(e){}}return version.split(",")};_V_.flash.embed=function(swf,placeHolder,flashVars,params,attributes){var code=_V_.flash.getEmbedCode(swf,flashVars,params,attributes),obj=_V_.createElement("div",{innerHTML:code}).childNodes[0],par=placeHolder.parentNode;placeHolder.parentNode.replaceChild(obj,placeHolder);if(_V_.isIE()){var newObj=par.childNodes[0];setTimeout(function(){newObj.style.display="block"},1000)}return obj};_V_.flash.getEmbedCode=function(swf,flashVars,params,attributes){var objTag='<object type="application/x-shockwave-flash"',flashVarsString="",paramsString="";attrsString="";if(flashVars){_V_.eachProp(flashVars,function(key,val){flashVarsString+=(key+"="+val+"&amp;")})}params=_V_.merge({movie:swf,flashvars:flashVarsString,allowScriptAccess:"always",allowNetworking:"all"},params);_V_.eachProp(params,function(key,val){paramsString+='<param name="'+key+'" value="'+val+'" />'});attributes=_V_.merge({data:swf,width:"100%",height:"100%"},attributes);_V_.eachProp(attributes,function(key,val){attrsString+=(key+'="'+val+'" ')});return objTag+attrsString+">"+paramsString+"</object>"};_V_.merge(_V_.Player.prototype,{addTextTracks:function(trackObjects){var tracks=this.textTracks=(this.textTracks)?this.textTracks:[],i=0,j=trackObjects.length,track,Kind;for(;i<j;i++){Kind=_V_.uc(trackObjects[i].kind||"subtitles");track=new _V_[Kind+"Track"](this,trackObjects[i]);tracks.push(track);if(track["default"]){this.ready(_V_.proxy(track,track.show))}}return this},showTextTrack:function(id,disableSameKind){var tracks=this.textTracks,i=0,j=tracks.length,track,showTrack,kind;for(;i<j;i++){track=tracks[i];if(track.id===id){track.show();showTrack=track}else{if(disableSameKind&&track.kind==disableSameKind&&track.mode>0){track.disable()}}}kind=(showTrack)?showTrack.kind:((disableSameKind)?disableSameKind:false);if(kind){this.triggerEvent(kind+"trackchange")}return this}});_V_.Track=_V_.Component.extend({init:function(player,options){this._super(player,options);_V_.merge(this,{id:options.id||("vjs_"+options.kind+"_"+options.language+"_"+_V_.guid++),src:options.src,"default":options["default"],title:options.title,language:options.srclang,label:options.label,cues:[],activeCues:[],readyState:0,mode:0})},createElement:function(){return this._super("div",{className:"vjs-"+this.kind+" vjs-text-track"})},show:function(){this.activate();this.mode=2;this._super()},hide:function(){this.activate();this.mode=1;this._super()},disable:function(){if(this.mode==2){this.hide()}this.deactivate();this.mode=0},activate:function(){if(this.readyState==0){this.load()}if(this.mode==0){this.player.addEvent("timeupdate",this.proxy(this.update,this.id));this.player.addEvent("ended",this.proxy(this.reset,this.id));if(this.kind=="captions"||this.kind=="subtitles"){this.player.textTrackDisplay.addComponent(this)}}},deactivate:function(){this.player.removeEvent("timeupdate",this.proxy(this.update,this.id));this.player.removeEvent("ended",this.proxy(this.reset,this.id));this.reset();this.player.textTrackDisplay.removeComponent(this)},load:function(){if(this.readyState==0){this.readyState=1;_V_.get(this.src,this.proxy(this.parseCues),this.proxy(this.onError))}},onError:function(err){this.error=err;this.readyState=3;this.triggerEvent("error")},parseCues:function(srcContent){var cue,time,text,lines=srcContent.split("\n"),line="",id;for(var i=1,j=lines.length;i<j;i++){line=_V_.trim(lines[i]);if(line){if(line.indexOf("-->")==-1){id=line;line=_V_.trim(lines[++i])}else{id=this.cues.length}cue={id:id,index:this.cues.length};time=line.split(" --> ");cue.startTime=this.parseCueTime(time[0]);cue.endTime=this.parseCueTime(time[1]);text=[];while(lines[++i]&&(line=_V_.trim(lines[i]))){text.push(line)}cue.text=text.join("<br/>");this.cues.push(cue)}}this.readyState=2;this.triggerEvent("loaded")},parseCueTime:function(timeText){var parts=timeText.split(":"),time=0,hours,minutes,other,seconds,ms,flags;if(parts.length==3){hours=parts[0];minutes=parts[1];other=parts[2]}else{hours=0;minutes=parts[0];other=parts[1]}other=other.split(/\s+/);seconds=other.splice(0,1)[0];seconds=seconds.split(/\.|,/);ms=parseFloat(seconds[1]);seconds=seconds[0];time+=parseFloat(hours)*3600;time+=parseFloat(minutes)*60;time+=parseFloat(seconds);if(ms){time+=ms/1000}return time},update:function(){if(this.cues.length>0){var time=this.player.currentTime();if(this.prevChange===undefined||time<this.prevChange||this.nextChange<=time){var cues=this.cues,newNextChange=this.player.duration(),newPrevChange=0,reverse=false,newCues=[],firstActiveIndex,lastActiveIndex,html="",cue,i,j;if(time>=this.nextChange||this.nextChange===undefined){i=(this.firstActiveIndex!==undefined)?this.firstActiveIndex:0}else{reverse=true;i=(this.lastActiveIndex!==undefined)?this.lastActiveIndex:cues.length-1}while(true){cue=cues[i];if(cue.endTime<=time){newPrevChange=Math.max(newPrevChange,cue.endTime);if(cue.active){cue.active=false}}else{if(time<cue.startTime){newNextChange=Math.min(newNextChange,cue.startTime);if(cue.active){cue.active=false}if(!reverse){break}}else{if(reverse){newCues.splice(0,0,cue);if(lastActiveIndex===undefined){lastActiveIndex=i}firstActiveIndex=i}else{newCues.push(cue);if(firstActiveIndex===undefined){firstActiveIndex=i}lastActiveIndex=i}newNextChange=Math.min(newNextChange,cue.endTime);newPrevChange=Math.max(newPrevChange,cue.startTime);cue.active=true}}if(reverse){if(i===0){break}else{i--}}else{if(i===cues.length-1){break}else{i++}}}this.activeCues=newCues;this.nextChange=newNextChange;this.prevChange=newPrevChange;this.firstActiveIndex=firstActiveIndex;this.lastActiveIndex=lastActiveIndex;this.updateDisplay();this.triggerEvent("cuechange")}}},updateDisplay:function(){var cues=this.activeCues,html="",i=0,j=cues.length;for(;i<j;i++){html+="<span class='vjs-tt-cue'>"+cues[i].text+"</span>"}this.el.innerHTML=html},reset:function(){this.nextChange=0;this.prevChange=this.player.duration();this.firstActiveIndex=0;this.lastActiveIndex=0}});_V_.CaptionsTrack=_V_.Track.extend({kind:"captions"});_V_.SubtitlesTrack=_V_.Track.extend({kind:"subtitles"});_V_.ChaptersTrack=_V_.Track.extend({kind:"chapters"});_V_.TextTrackDisplay=_V_.Component.extend({createElement:function(){return this._super("div",{className:"vjs-text-track-display"})}});_V_.TextTrackMenuItem=_V_.MenuItem.extend({init:function(player,options){var track=this.track=options.track;options.label=track.label;options.selected=track["default"];this._super(player,options);this.player.addEvent(track.kind+"trackchange",_V_.proxy(this,this.update))},onClick:function(){this._super();this.player.showTextTrack(this.track.id,this.track.kind)},update:function(){if(this.track.mode==2){this.selected(true)}else{this.selected(false)}}});_V_.OffTextTrackMenuItem=_V_.TextTrackMenuItem.extend({init:function(player,options){options.track={kind:options.kind,player:player,label:"Off"};this._super(player,options)},onClick:function(){this._super();this.player.showTextTrack(this.track.id,this.track.kind)},update:function(){var tracks=this.player.textTracks,i=0,j=tracks.length,track,off=true;for(;i<j;i++){track=tracks[i];if(track.kind==this.track.kind&&track.mode==2){off=false}}if(off){this.selected(true)}else{this.selected(false)}}});_V_.TextTrackButton=_V_.Button.extend({init:function(player,options){this._super(player,options);this.menu=this.createMenu();if(this.items.length===0){this.hide()}},createMenu:function(){var menu=new _V_.Menu(this.player);menu.el.appendChild(_V_.createElement("li",{className:"vjs-menu-title",innerHTML:_V_.uc(this.kind)}));menu.addItem(new _V_.OffTextTrackMenuItem(this.player,{kind:this.kind}));this.items=this.createItems();this.each(this.items,function(item){menu.addItem(item)});this.addComponent(menu);return menu},createItems:function(){var items=[];this.each(this.player.textTracks,function(track){if(track.kind===this.kind){items.push(new _V_.TextTrackMenuItem(this.player,{track:track}))}});return items},buildCSSClass:function(){return this.className+" vjs-menu-button "+this._super()},onFocus:function(){this.menu.lockShowing();_V_.one(this.menu.el.childNodes[this.menu.el.childNodes.length-1],"blur",this.proxy(function(){this.menu.unlockShowing()}))},onBlur:function(){},onClick:function(){this.one("mouseout",this.proxy(function(){this.menu.unlockShowing();this.el.blur()}))}});_V_.CaptionsButton=_V_.TextTrackButton.extend({kind:"captions",buttonText:"Captions",className:"vjs-captions-button"});_V_.SubtitlesButton=_V_.TextTrackButton.extend({kind:"subtitles",buttonText:"Subtitles",className:"vjs-subtitles-button"});_V_.ChaptersButton=_V_.TextTrackButton.extend({kind:"chapters",buttonText:"Chapters",className:"vjs-chapters-button",createItems:function(chaptersTrack){var items=[];this.each(this.player.textTracks,function(track){if(track.kind===this.kind){items.push(new _V_.TextTrackMenuItem(this.player,{track:track}))}});return items},createMenu:function(){var tracks=this.player.textTracks,i=0,j=tracks.length,track,chaptersTrack,items=this.items=[];for(;i<j;i++){track=tracks[i];if(track.kind==this.kind&&track["default"]){if(track.readyState<2){this.chaptersTrack=track;track.addEvent("loaded",this.proxy(this.createMenu));return}else{chaptersTrack=track;break}}}var menu=this.menu=new _V_.Menu(this.player);menu.el.appendChild(_V_.createElement("li",{className:"vjs-menu-title",innerHTML:_V_.uc(this.kind)}));if(chaptersTrack){var cues=chaptersTrack.cues,i=0,j=cues.length,cue,mi;for(;i<j;i++){cue=cues[i];mi=new _V_.ChaptersTrackMenuItem(this.player,{track:chaptersTrack,cue:cue});items.push(mi);menu.addComponent(mi)}}this.addComponent(menu);if(this.items.length>0){this.show()}return menu}});_V_.ChaptersTrackMenuItem=_V_.MenuItem.extend({init:function(player,options){var track=this.track=options.track,cue=this.cue=options.cue,currentTime=player.currentTime();options.label=cue.text;options.selected=(cue.startTime<=currentTime&&currentTime<cue.endTime);this._super(player,options);track.addEvent("cuechange",_V_.proxy(this,this.update))},onClick:function(){this._super();this.player.currentTime(this.cue.startTime);this.update(this.cue.startTime)},update:function(time){var cue=this.cue,currentTime=this.player.currentTime();if(cue.startTime<=currentTime&&currentTime<cue.endTime){this.selected(true)}else{this.selected(false)}}});_V_.merge(_V_.ControlBar.prototype.options.components,{subtitlesButton:{},captionsButton:{},chaptersButton:{}});_V_.autoSetup=function(){var options,vid,player,vids=document.getElementsByTagName("video");if(vids&&vids.length>0){for(var i=0,j=vids.length;i<j;i++){vid=vids[i];if(vid&&vid.getAttribute){if(vid.player===undefined){options=vid.getAttribute("data-setup");if(options!==null){options=JSON.parse(options||"{}");player=_V_(vid,options)}}}else{_V_.autoSetupTimeout(1);break}}}else{if(!_V_.windowLoaded){_V_.autoSetupTimeout(1)}}};_V_.autoSetupTimeout=function(wait){setTimeout(_V_.autoSetup,wait)};_V_.addEvent(window,"load",function(){_V_.windowLoaded=true});_V_.autoSetup();window.VideoJS=window._V_=VideoJS})(window);
// moment.js
// version : 1.6.2
// author : Tim Wood
// license : MIT
// momentjs.com

(function (Date, undefined) {

    var moment,
        VERSION = "1.6.2",
        round = Math.round, i,
        // internal storage for language config files
        languages = {},
        currentLanguage = 'en',

        // check for nodeJS
        hasModule = (typeof module !== 'undefined'),

        // parameters to check for on the lang config
        langConfigProperties = 'months|monthsShort|monthsParse|weekdays|weekdaysShort|longDateFormat|calendar|relativeTime|ordinal|meridiem'.split('|'),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|dddd?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|LT|LL?L?L?)/g,

        // parsing tokens
        parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
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
        };

    // Moment prototype object
    function Moment(date, isUTC) {
        this._d = date;
        this._isUTC = !!isUTC;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
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

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromArray(input) {
        return new Date(input[0], input[1] || 0, input[2] || 1, input[3] || 0, input[4] || 0, input[5] || 0, input[6] || 0);
    }

    // format date using native date object
    function formatMoment(m, inputString) {
        var currentMonth = m.month(),
            currentDate = m.date(),
            currentYear = m.year(),
            currentDay = m.day(),
            currentHours = m.hours(),
            currentMinutes = m.minutes(),
            currentSeconds = m.seconds(),
            currentMilliseconds = m.milliseconds(),
            currentZone = -m.zone(),
            ordinal = moment.ordinal,
            meridiem = moment.meridiem;
        // check if the character is a format
        // return formatted string or non string.
        //
        // uses switch/case instead of an object of named functions (like http://phpjs.org/functions/date:380)
        // for minification and performance
        // see http://jsperf.com/object-of-functions-vs-switch for performance comparison
        function replaceFunction(input) {
            // create a couple variables to be used later inside one of the cases.
            var a, b;
            switch (input) {
                // MONTH
            case 'M' :
                return currentMonth + 1;
            case 'Mo' :
                return (currentMonth + 1) + ordinal(currentMonth + 1);
            case 'MM' :
                return leftZeroFill(currentMonth + 1, 2);
            case 'MMM' :
                return moment.monthsShort[currentMonth];
            case 'MMMM' :
                return moment.months[currentMonth];
            // DAY OF MONTH
            case 'D' :
                return currentDate;
            case 'Do' :
                return currentDate + ordinal(currentDate);
            case 'DD' :
                return leftZeroFill(currentDate, 2);
            // DAY OF YEAR
            case 'DDD' :
                a = new Date(currentYear, currentMonth, currentDate);
                b = new Date(currentYear, 0, 1);
                return ~~ (((a - b) / 864e5) + 1.5);
            case 'DDDo' :
                a = replaceFunction('DDD');
                return a + ordinal(a);
            case 'DDDD' :
                return leftZeroFill(replaceFunction('DDD'), 3);
            // WEEKDAY
            case 'd' :
                return currentDay;
            case 'do' :
                return currentDay + ordinal(currentDay);
            case 'ddd' :
                return moment.weekdaysShort[currentDay];
            case 'dddd' :
                return moment.weekdays[currentDay];
            // WEEK OF YEAR
            case 'w' :
                a = new Date(currentYear, currentMonth, currentDate - currentDay + 5);
                b = new Date(a.getFullYear(), 0, 4);
                return ~~ ((a - b) / 864e5 / 7 + 1.5);
            case 'wo' :
                a = replaceFunction('w');
                return a + ordinal(a);
            case 'ww' :
                return leftZeroFill(replaceFunction('w'), 2);
            // YEAR
            case 'YY' :
                return leftZeroFill(currentYear % 100, 2);
            case 'YYYY' :
                return currentYear;
            // AM / PM
            case 'a' :
                return meridiem ? meridiem(currentHours, currentMinutes, false) : (currentHours > 11 ? 'pm' : 'am');
            case 'A' :
                return meridiem ? meridiem(currentHours, currentMinutes, true) : (currentHours > 11 ? 'PM' : 'AM');
            // 24 HOUR
            case 'H' :
                return currentHours;
            case 'HH' :
                return leftZeroFill(currentHours, 2);
            // 12 HOUR
            case 'h' :
                return currentHours % 12 || 12;
            case 'hh' :
                return leftZeroFill(currentHours % 12 || 12, 2);
            // MINUTE
            case 'm' :
                return currentMinutes;
            case 'mm' :
                return leftZeroFill(currentMinutes, 2);
            // SECOND
            case 's' :
                return currentSeconds;
            case 'ss' :
                return leftZeroFill(currentSeconds, 2);
            // MILLISECONDS
            case 'S' :
                return ~~ (currentMilliseconds / 100);
            case 'SS' :
                return leftZeroFill(~~(currentMilliseconds / 10), 2);
            case 'SSS' :
                return leftZeroFill(currentMilliseconds, 3);
            // TIMEZONE
            case 'Z' :
                return (currentZone < 0 ? '-' : '+') + leftZeroFill(~~(Math.abs(currentZone) / 60), 2) + ':' + leftZeroFill(~~(Math.abs(currentZone) % 60), 2);
            case 'ZZ' :
                return (currentZone < 0 ? '-' : '+') + leftZeroFill(~~(10 * Math.abs(currentZone) / 6), 4);
            // LONG DATES
            case 'L' :
            case 'LL' :
            case 'LLL' :
            case 'LLLL' :
            case 'LT' :
                return formatMoment(m, moment.longDateFormat[input]);
            // DEFAULT
            default :
                return input.replace(/(^\[)|(\\)|\]$/g, "");
            }
        }
        return inputString.replace(formattingTokens, replaceFunction);
    }

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
        case 'dd':
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
        var a;
        //console.log('addTime', format, input);
        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            datePartArray[1] = (input == null) ? 0 : ~~input - 1;
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            for (a = 0; a < 12; a++) {
                if (moment.monthsParse[a].test(input)) {
                    datePartArray[1] = a;
                    break;
                }
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DDDD
        case 'DD' : // fall through to DDDD
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            datePartArray[2] = ~~input;
            break;
        // YEAR
        case 'YY' :
            input = ~~input;
            datePartArray[0] = input + (input > 70 ? 1900 : 2000);
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
    }

    // date from string and format string
    function makeDateFromStringAndFormat(string, format) {
        var datePartArray = [0, 0, 1, 0, 0, 0, 0],
            config = {
                tzh : 0, // timezone hour offset
                tzm : 0  // timezone minute offset
            },
            tokens = format.match(formattingTokens),
            i, parsedInput;

        for (i = 0; i < tokens.length; i++) {
            parsedInput = (getParseRegexForToken(tokens[i]).exec(string) || [])[0];
            string = string.replace(getParseRegexForToken(tokens[i]), '');
            addTimeToArrayFromToken(tokens[i], parsedInput, datePartArray, config);
        }
        // handle am pm
        if (config.isPm && datePartArray[3] < 12) {
            datePartArray[3] += 12;
        }
        // if is 12 am, change hours to 0
        if (config.isPm === false && datePartArray[3] === 12) {
            datePartArray[3] = 0;
        }
        // handle timezone
        datePartArray[3] += config.tzh;
        datePartArray[4] += config.tzm;
        // return
        return config.isUTC ? new Date(Date.UTC.apply({}, datePartArray)) : dateFromArray(datePartArray);
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

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture) {
        var rt = moment.relativeTime[string];
        return (typeof rt === 'function') ?
            rt(number || 1, !!withoutSuffix, string, isFuture) :
            rt.replace(/%d/i, number || 1);
    }

    function relativeTime(milliseconds, withoutSuffix) {
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
        return substituteTimeAgo.apply({}, args);
    }

    moment = function (input, format) {
        if (input === null || input === '') {
            return null;
        }
        var date,
            matched,
            isUTC;
        // parse Moment object
        if (moment.isMoment(input)) {
            date = new Date(+input._d);
            isUTC = input._isUTC;
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
        return new Moment(date, isUTC);
    };

    // creating with utc
    moment.utc = function (input, format) {
        if (isArray(input)) {
            return new Moment(new Date(Date.UTC.apply({}, input)), true);
        }
        return (format && input) ?
            moment(input + ' +0000', format + ' Z').utc() :
            moment(input && !parseTokenTimezone.exec(input) ? input + '+0000' : input).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var isDuration = moment.isDuration(input),
            isNumber = (typeof input === 'number'),
            duration = (isDuration ? input._data : (isNumber ? {} : input));

        if (isNumber) {
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        }

        return new Duration(duration);
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

    // language switching and caching
    moment.lang = function (key, values) {
        var i, req,
            parse = [];
        if (!key) {
            return currentLanguage;
        }
        if (values) {
            for (i = 0; i < 12; i++) {
                parse[i] = new RegExp('^' + values.months[i] + '|^' + values.monthsShort[i].replace('.', ''), 'i');
            }
            values.monthsParse = values.monthsParse || parse;
            languages[key] = values;
        }
        if (languages[key]) {
            for (i = 0; i < langConfigProperties.length; i++) {
                moment[langConfigProperties[i]] = languages[key][langConfigProperties[i]] ||
                    languages.en[langConfigProperties[i]];
            }
            currentLanguage = key;
        } else {
            if (hasModule) {
                req = require('./lang/' + key);
                moment.lang(key, req);
            }
        }
    };

    // set default language
    moment.lang('en', {
        months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        meridiem : false,
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

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment;
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    // shortcut for prototype
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
            return moment.duration(this.diff(time)).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function () {
            var diff = this.diff(moment().sod(), 'days', true),
                calendar = moment.calendar,
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

        sod: function () {
            return moment(this)
                .hours(0)
                .minutes(0)
                .seconds(0)
                .milliseconds(0);
        },

        eod: function () {
            // end of day = start of day plus 1 day, minus 1 millisecond
            return this.sod().add({
                d : 1,
                ms : -1
            });
        },

        zone : function () {
            return this._isUTC ? 0 : this._d.getTimezoneOffset();
        },

        daysInMonth : function () {
            return moment(this).month(this.month() + 1).date(0).date();
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
                rel = moment.relativeTime,
                output = relativeTime(difference, !withSuffix);

            if (withSuffix) {
                output = (difference <= 0 ? rel.past : rel.future).replace(/%s/i, output);
            }

            return output;
        }
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

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    }
    /*global ender:false */
    if (typeof window !== 'undefined' && typeof ender === 'undefined') {
        window.moment = moment;
    }
    /*global define:false */
    if (typeof define === "function" && define.amd) {
        define("moment", [], function () {
            return moment;
        });
    }
})(Date);

/*
Copyright 2012 Igor Vaynberg
 
Version: 3.0 Timestamp: Tue Jul 31 21:09:16 PDT 2012

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in
compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
(function(f){"undefined"==typeof f.fn.each2&&f.fn.extend({each2:function(h){for(var l=f([0]),j=-1,m=this.length;++j<m&&(l.context=l[0]=this[j])&&!1!==h.call(l[0],j,l););return this}})})(jQuery);
(function(f,h){function l(a){return a&&"string"===typeof a?a.replace("&","&amp;"):a}function j(a,b){var c=0,d=b.length,g;if("undefined"===typeof a)return-1;if(a.constructor===String)for(;c<d;c+=1){if(0===a.localeCompare(b[c]))return c}else for(;c<d;c+=1)if(g=b[c],g.constructor===String){if(0===g.localeCompare(a))return c}else if(g===a)return c;return-1}function m(a,b){return a===b?!0:a===h||b===h||null===a||null===b?!1:a.constructor===String?0===a.localeCompare(b):b.constructor===String?0===b.localeCompare(a):
!1}function y(a,b){var c,d,g;if(null===a||1>a.length)return[];c=a.split(b);d=0;for(g=c.length;d<g;d+=1)c[d]=f.trim(c[d]);return c}function z(a,b){var c;return function(){window.clearTimeout(c);c=window.setTimeout(b,a)}}function i(a){a.preventDefault();a.stopPropagation()}function A(a,b,c){var d=a.toUpperCase().indexOf(b.toUpperCase()),b=b.length;0>d?c.push(a):(c.push(a.substring(0,d)),c.push("<span class='select2-match'>"),c.push(a.substring(d,d+b)),c.push("</span>"),c.push(a.substring(d+b,a.length)))}
function B(a){var b,c=0,d=null,g=a.quietMillis||100;return function(k){window.clearTimeout(b);b=window.setTimeout(function(){var b=c+=1,g=a.data,e=a.transport||f.ajax,h=a.type||"GET",g=g.call(this,k.term,k.page,k.context);null!==d&&d.abort();d=e.call(null,{url:a.url,dataType:a.dataType,data:g,type:h,success:function(d){b<c||(d=a.results(d,k.page),k.callback(d))}})},g)}}function C(a){var b=a,c,d=function(a){return""+a.text};f.isArray(b)||(d=b.text,f.isFunction(d)||(c=b.text,d=function(a){return a[c]}),
b=b.results);return function(a){var c=a.term,e={};if(c==="")a.callback({results:b});else{e.results=f(b).filter(function(){return a.matcher(c,d(this))}).get();a.callback(e)}}}function D(a){return f.isFunction(a)?a:function(b){var c=b.term,d={results:[]};f(a).each(function(){var a=this.text!==h,f=a?this.text:this;if(""===c||b.matcher(c,f))d.results.push(a?this:{id:this,text:this})});b.callback(d)}}function s(a){if(f.isFunction(a))return!0;if(!a)return fasle;throw Error("formatterName must be a function or a falsy value");
}function t(a){return f.isFunction(a)?a():a}function v(a,b){var c=function(){};c.prototype=new a;c.prototype.constructor=c;c.prototype.parent=a.prototype;c.prototype=f.extend(c.prototype,b);return c}if(window.Select2===h){var e,u,w,x,r;e={TAB:9,ENTER:13,ESC:27,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,SHIFT:16,CTRL:17,ALT:18,PAGE_UP:33,PAGE_DOWN:34,HOME:36,END:35,BACKSPACE:8,DELETE:46,isArrow:function(a){a=a.which?a.which:a;switch(a){case e.LEFT:case e.RIGHT:case e.UP:case e.DOWN:return!0}return!1},
isControl:function(a){a=a.which?a.which:a;switch(a){case e.SHIFT:case e.CTRL:case e.ALT:return!0}return a.metaKey?!0:!1},isFunctionKey:function(a){a=a.which?a.which:a;return 112<=a&&123>=a}};f(document).delegate("*","mousemove",function(a){f.data(document,"select2-lastpos",{x:a.pageX,y:a.pageY})});f(document).ready(function(){f(document).delegate("*","mousedown touchend",function(a){var b=f(a.target).closest("div.select2-container").get(0),c;b?f(document).find("div.select2-container-active").each(function(){this!==
b&&f(this).data("select2").blur()}):(b=f(a.target).closest("div.select2-drop").get(0),f(document).find("div.select2-drop-active").each(function(){this!==b&&f(this).data("select2").blur()}));b=f(a.target);c=b.attr("for");"LABEL"===a.target.tagName&&(c&&0<c.length)&&(b=f("#"+c),b=b.data("select2"),b!==h&&(b.focus(),a.preventDefault()))})});u=v(Object,{bind:function(a){var b=this;return function(){a.apply(b,arguments)}},init:function(a){var b,c;this.opts=a=this.prepareOpts(a);this.id=a.id;a.element.data("select2")!==
h&&null!==a.element.data("select2")&&this.destroy();this.enabled=!0;this.container=this.createContainer();var d=!1,g;this.body=function(){!1===d&&(g=a.element.closest("body"),d=!0);return g};a.element.attr("class")!==h&&this.container.addClass(a.element.attr("class"));this.container.css(t(a.containerCss));this.container.addClass(t(a.containerCssClass));this.opts.element.data("select2",this).hide().after(this.container);this.container.data("select2",this);this.dropdown=this.container.find(".select2-drop");
this.dropdown.css(t(a.dropdownCss));this.dropdown.addClass(t(a.dropdownCssClass));this.dropdown.data("select2",this);this.results=b=this.container.find(".select2-results");this.search=c=this.container.find("input.select2-input");c.attr("tabIndex",this.opts.element.attr("tabIndex"));this.resultsPage=0;this.context=null;this.initContainer();this.initContainerWidth();this.results.bind("mousemove",function(a){var b=f.data(document,"select2-lastpos");(b===h||b.x!==a.pageX||b.y!==a.pageY)&&f(a.target).trigger("mousemove-filtered",
a)});this.dropdown.delegate(".select2-results","mousemove-filtered",this.bind(this.highlightUnderEvent));var k=this.results,e=z(80,function(a){k.trigger("scroll-debounced",a)});k.bind("scroll",function(a){0<=j(a.target,k.get())&&e(a)});this.dropdown.delegate(".select2-results","scroll-debounced",this.bind(this.loadMoreIfNeeded));f.fn.mousewheel&&b.mousewheel(function(a,c,d,g){c=b.scrollTop();0<g&&0>=c-g?(b.scrollTop(0),i(a)):0>g&&b.get(0).scrollHeight-b.scrollTop()+g<=b.height()&&(b.scrollTop(b.get(0).scrollHeight-
b.height()),i(a))});c.bind("keydown",function(){f.data(c,"keyup-change-value")===h&&f.data(c,"keyup-change-value",c.val())});c.bind("keyup",function(){var a=f.data(c,"keyup-change-value");a!==h&&c.val()!==a&&(f.removeData(c,"keyup-change-value"),c.trigger("keyup-change"))});c.bind("keyup-change",this.bind(this.updateResults));c.bind("focus",function(){c.addClass("select2-focused");" "===c.val()&&c.val("")});c.bind("blur",function(){c.removeClass("select2-focused")});this.dropdown.delegate(".select2-results",
"mouseup",this.bind(function(a){0<f(a.target).closest(".select2-result-selectable:not(.select2-disabled)").length?(this.highlightUnderEvent(a),this.selectHighlighted(a)):this.focusSearch();i(a)}));this.dropdown.bind("click mouseup mousedown",function(a){a.stopPropagation()});f.isFunction(this.opts.initSelection)&&(this.initSelection(),this.monitorSource());a.element.is(":disabled")&&this.disable()},destroy:function(){var a=this.opts.element.data("select2");a!==h&&(a.container.remove(),a.dropdown.remove(),
a.opts.element.removeData("select2").unbind(".select2").show())},prepareOpts:function(a){var b,c,d;b=a.element;"select"===b.get(0).tagName.toLowerCase()&&(this.select=c=a.element);a.separator=a.separator||",";c&&f.each("id multiple ajax query createSearchChoice initSelection data tags".split(" "),function(){if(this in a)throw Error("Option '"+this+"' is not allowed for Select2 when attached to a <select> element.");});a=f.extend({},{populateResults:function(b,c,d){var e,E=this.opts.id;e=function(b,
c,g){var k,i,j,p,q,n,m;k=0;for(i=b.length;k<i;k=k+1){j=b[k];p=E(j)!==h;q="children"in j&&j.children.length>0;n=f("<li></li>");n.addClass("select2-results-dept-"+g);n.addClass("select2-result");n.addClass(p?"select2-result-selectable":"select2-result-unselectable");q&&n.addClass("select2-result-with-children");p=f("<div></div>");p.addClass("select2-result-label");m=a.formatResult(j,p,d);m!==h&&p.html(l(m));n.append(p);if(q){q=f("<ul></ul>");q.addClass("select2-result-sub");e(j.children,q,g+1);n.append(q)}n.data("select2-data",
j);c.append(n)}};e(c,b,0)}},f.fn.select2.defaults,a);"function"!==typeof a.id&&(d=a.id,a.id=function(a){return a[d]});if(c)a.query=this.bind(function(a){var c={results:[],more:false},d=a.term,e,i,j;j=function(b,c){var f;if(b.is("option"))a.matcher(d,b.text(),b)&&c.push({id:b.attr("value"),text:b.text(),element:b.get()});else if(b.is("optgroup")){f={text:b.attr("label"),children:[],element:b.get()};b.children().each2(function(a,b){j(b,f.children)});f.children.length>0&&c.push(f)}};e=b.children();if(this.getPlaceholder()!==
h&&e.length>0){i=e[0];f(i).text()===""&&(e=e.not(i))}e.each2(function(a,b){j(b,c.results)});a.callback(c)}),a.id=function(a){return a.id};else if(!("query"in a))if("ajax"in a){if((c=a.element.data("ajax-url"))&&0<c.length)a.ajax.url=c;a.query=B(a.ajax)}else"data"in a?a.query=C(a.data):"tags"in a&&(a.query=D(a.tags),a.createSearchChoice=function(a){return{id:a,text:a}},a.initSelection=function(b,c){var d=[];f(y(b.val(),a.separator)).each(function(){var b=this,c=this,g=a.tags;f.isFunction(g)&&(g=g());
f(g).each(function(){if(m(this.id,b)){c=this.text;return false}});d.push({id:b,text:c})});c(d)});if("function"!==typeof a.query)throw"query function not defined for Select2 "+a.element.attr("id");return a},monitorSource:function(){this.opts.element.bind("change.select2",this.bind(function(){!0!==this.opts.element.data("select2-change-triggered")&&this.initSelection()}))},triggerChange:function(a){a=a||{};a=f.extend({},a,{type:"change",val:this.val()});this.opts.element.data("select2-change-triggered",
!0);this.opts.element.trigger(a);this.opts.element.data("select2-change-triggered",!1);this.opts.element.click()},enable:function(){this.enabled||(this.enabled=!0,this.container.removeClass("select2-container-disabled"))},disable:function(){this.enabled&&(this.close(),this.enabled=!1,this.container.addClass("select2-container-disabled"))},opened:function(){return this.container.hasClass("select2-dropdown-open")},positionDropdown:function(){var a=this.container.offset(),b=this.container.outerHeight(),
c=this.container.outerWidth(),d=this.dropdown.outerHeight(),g=f(window).scrollTop()+document.documentElement.clientHeight,b=a.top+b,g=b+d<=g,e=a.top-d>=this.body().scrollTop(),h;this.dropdown.hasClass("select2-drop-above")?(h=!0,!e&&g&&(h=!1)):(h=!1,!g&&e&&(h=!0));h?(b=a.top-d,this.container.addClass("select2-drop-above"),this.dropdown.addClass("select2-drop-above")):(this.container.removeClass("select2-drop-above"),this.dropdown.removeClass("select2-drop-above"));this.dropdown.css({top:b,left:a.left,
width:c})},shouldOpen:function(){var a;if(this.opened())return!1;a=jQuery.Event("open");this.opts.element.trigger(a);return!a.isDefaultPrevented()},clearDropdownAlignmentPreference:function(){this.container.removeClass("select2-drop-above");this.dropdown.removeClass("select2-drop-above")},open:function(){if(!this.shouldOpen())return!1;window.setTimeout(this.bind(this.opening),1);return!0},opening:function(){this.clearDropdownAlignmentPreference();" "===this.search.val()&&this.search.val("");this.dropdown.addClass("select2-drop-active");
this.container.addClass("select2-dropdown-open").addClass("select2-container-active");this.updateResults(!0);this.dropdown[0]!==this.body().children().last()[0]&&this.dropdown.detach().appendTo(this.body());this.dropdown.show();this.ensureHighlightVisible();this.positionDropdown();this.focusSearch()},close:function(){this.opened()&&(this.clearDropdownAlignmentPreference(),this.dropdown.hide(),this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active"),this.results.empty(),
this.clearSearch(),this.opts.element.trigger(jQuery.Event("close")))},clearSearch:function(){},ensureHighlightVisible:function(){var a=this.results,b,c,d,g;c=this.highlight();0>c||(0==c?a.scrollTop(0):(b=a.find(".select2-result-selectable"),d=f(b[c]),g=d.offset().top+d.outerHeight(),c===b.length-1&&(b=a.find("li.select2-more-results"),0<b.length&&(g=b.offset().top+b.outerHeight())),b=a.offset().top+a.outerHeight(),g>b&&a.scrollTop(a.scrollTop()+(g-b)),d=d.offset().top-a.offset().top,0>d&&a.scrollTop(a.scrollTop()+
d)))},moveHighlight:function(a){for(var b=this.results.find(".select2-result-selectable"),c=this.highlight();-1<c&&c<b.length;){var c=c+a,d=f(b[c]);if(d.hasClass("select2-result-selectable")&&!d.hasClass("select2-disabled")){this.highlight(c);break}}},highlight:function(a){var b=this.results.find(".select2-result-selectable").not(".select2-disabled");if(0===arguments.length)return j(b.filter(".select2-highlighted")[0],b.get());a>=b.length&&(a=b.length-1);0>a&&(a=0);b.removeClass("select2-highlighted");
f(b[a]).addClass("select2-highlighted");this.ensureHighlightVisible()},countSelectableResults:function(){return this.results.find(".select2-result-selectable").not(".select2-disabled").length},highlightUnderEvent:function(a){a=f(a.target).closest(".select2-result-selectable");if(0<a.length&&!a.is(".select2-highlighted")){var b=this.results.find(".select2-result-selectable");this.highlight(b.index(a))}else 0==a.length&&this.results.find(".select2-highlighted").removeClass("select2-highlighted")},loadMoreIfNeeded:function(){var a=
this.results,b=a.find("li.select2-more-results"),c,d=this.resultsPage+1,f=this,e=this.search.val(),h=this.context;0!==b.length&&(c=b.offset().top-a.offset().top-a.height(),0>=c&&(b.addClass("select2-active"),this.opts.query({term:e,page:d,context:h,matcher:this.opts.matcher,callback:this.bind(function(c){f.opts.populateResults.call(this,a,c.results,{term:e,page:d,context:h});!0===c.more?(b.detach().appendTo(a.children(":last")).text(f.opts.formatLoadMore(d+1)),window.setTimeout(function(){f.loadMoreIfNeeded()},
10)):b.remove();f.positionDropdown();f.resultsPage=d})})))},updateResults:function(a){function b(){g.scrollTop(0);d.removeClass("select2-active");j.positionDropdown()}function c(a){g.html(l(a));b()}var d=this.search,g=this.results,e=this.opts,i,j=this;if(!(!0!==a&&(!1===this.showSearchInput||!this.opened()))){d.addClass("select2-active");if(1<=e.maximumSelectionSize&&(i=this.data(),f.isArray(i)&&i.length>=e.maximumSelectionSize&&s(e.formatSelectionTooBig,"formatSelectionTooBig"))){c("<li class='select2-selection-limit'>"+
e.formatSelectionTooBig(e.maximumSelectionSize)+"</li>");return}d.val().length<e.minimumInputLength&&s(e.formatInputTooShort,"formatInputTooShort")?c("<li class='select2-no-results'>"+e.formatInputTooShort(d.val(),e.minimumInputLength)+"</li>"):(this.resultsPage=1,e.query({term:d.val(),page:this.resultsPage,context:null,matcher:e.matcher,callback:this.bind(function(i){var o;this.context=i.context===h?null:i.context;this.opts.createSearchChoice&&""!==d.val()&&(o=this.opts.createSearchChoice.call(null,
d.val(),i.results),o!==h&&null!==o&&j.id(o)!==h&&null!==j.id(o)&&0===f(i.results).filter(function(){return m(j.id(this),j.id(o))}).length&&i.results.unshift(o));0===i.results.length&&s(e.formatNoMatches,"formatNoMatches")?c("<li class='select2-no-results'>"+e.formatNoMatches(d.val())+"</li>"):(g.empty(),j.opts.populateResults.call(this,g,i.results,{term:d.val(),page:this.resultsPage,context:null}),!0===i.more&&s(e.formatLoadMore,"formatLoadMore")&&(g.children().filter(":last").append("<li class='select2-more-results'>"+
l(e.formatLoadMore(this.resultsPage))+"</li>"),window.setTimeout(function(){j.loadMoreIfNeeded()},10)),this.postprocessResults(i,a),b())})}))}},cancel:function(){this.close()},blur:function(){this.close();this.container.removeClass("select2-container-active");this.dropdown.removeClass("select2-drop-active");this.search[0]===document.activeElement&&this.search.blur();this.clearSearch();this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus")},focusSearch:function(){window.setTimeout(this.bind(function(){this.search.focus();
this.search.val(this.search.val())}),10)},selectHighlighted:function(){var a=this.highlight(),b=this.results.find(".select2-highlighted").not(".select2-disabled"),c=b.closest(".select2-result-selectable").data("select2-data");c&&(b.addClass("select2-disabled"),this.highlight(a),this.onSelect(c))},getPlaceholder:function(){return this.opts.element.attr("placeholder")||this.opts.element.attr("data-placeholder")||this.opts.element.data("placeholder")||this.opts.placeholder},initContainerWidth:function(){var a=
function(){var a,c,d,e;if("off"===this.opts.width)return null;if("element"===this.opts.width)return 0===this.opts.element.outerWidth()?"auto":this.opts.element.outerWidth()+"px";if("copy"===this.opts.width||"resolve"===this.opts.width){a=this.opts.element.attr("style");if(a!==h){a=a.split(";");d=0;for(e=a.length;d<e;d+=1)if(c=a[d].replace(/\s/g,"").match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/),null!==c&&1<=c.length)return c[1]}return"resolve"===this.opts.width?(a=this.opts.element.css("width"),
0<a.indexOf("%")?a:0===this.opts.element.outerWidth()?"auto":this.opts.element.outerWidth()+"px"):null}return f.isFunction(this.opts.width)?this.opts.width():this.opts.width}.call(this);null!==a&&this.container.attr("style","width: "+a)}});w=v(u,{createContainer:function(){return f("<div></div>",{"class":"select2-container"}).html("    <a href='javascript:void(0)' class='select2-choice'>   <span></span><abbr class='select2-search-choice-close' style='display:none;'></abbr>   <div><b></b></div></a>    <div class='select2-drop select2-offscreen'>   <div class='select2-search'>       <input type='text' autocomplete='off' class='select2-input'/>   </div>   <ul class='select2-results'>   </ul></div>")},
opening:function(){this.search.show();this.parent.opening.apply(this,arguments);this.dropdown.removeClass("select2-offscreen")},close:function(){this.opened()&&(this.parent.close.apply(this,arguments),this.dropdown.removeAttr("style").addClass("select2-offscreen").insertAfter(this.selection).show())},focus:function(){this.close();this.selection.focus()},isFocused:function(){return this.selection[0]===document.activeElement},cancel:function(){this.parent.cancel.apply(this,arguments);this.selection.focus()},
initContainer:function(){var a,b=this.dropdown;this.selection=a=this.container.find(".select2-choice");this.search.bind("keydown",this.bind(function(a){if(this.enabled)if(a.which===e.PAGE_UP||a.which===e.PAGE_DOWN)i(a);else if(this.opened())switch(a.which){case e.UP:case e.DOWN:this.moveHighlight(a.which===e.UP?-1:1);i(a);break;case e.TAB:case e.ENTER:this.selectHighlighted();i(a);break;case e.ESC:this.cancel(a),i(a)}else a.which===e.TAB||(e.isControl(a)||e.isFunctionKey(a)||a.which===e.ESC)||this.open()}));
this.search.bind("focus",this.bind(function(){this.selection.attr("tabIndex","-1")}));this.search.bind("blur",this.bind(function(){this.opened()||this.container.removeClass("select2-container-active");window.setTimeout(this.bind(function(){this.selection.attr("tabIndex",this.opts.element.attr("tabIndex"))}),10)}));a.bind("mousedown",this.bind(function(a){this.opened()?(this.close(),this.selection.focus()):this.enabled&&this.open();i(a)}));b.bind("mousedown",this.bind(function(){this.search.focus()}));
a.bind("focus",this.bind(function(){this.container.addClass("select2-container-active");this.search.attr("tabIndex","-1")}));a.bind("blur",this.bind(function(){this.container.removeClass("select2-container-active");window.setTimeout(this.bind(function(){this.search.attr("tabIndex",this.opts.element.attr("tabIndex"))}),10)}));a.bind("keydown",this.bind(function(a){if(this.enabled)if(a.which===e.PAGE_UP||a.which===e.PAGE_DOWN)i(a);else if(!(a.which===e.TAB||e.isControl(a)||e.isFunctionKey(a)||a.which===
e.ESC)){this.open();if(a.which!==e.ENTER&&!(48>a.which)){var b=String.fromCharCode(a.which).toLowerCase();a.shiftKey&&(b=b.toUpperCase());this.search.val(b)}i(a)}}));a.delegate("abbr","mousedown",this.bind(function(a){this.enabled&&(this.clear(),i(a),this.close(),this.triggerChange(),this.selection.focus())}));this.setPlaceholder();this.search.bind("focus",this.bind(function(){this.container.addClass("select2-container-active")}))},clear:function(){this.opts.element.val("");this.selection.find("span").empty();
this.selection.removeData("select2-data");this.setPlaceholder()},initSelection:function(){if(""===this.opts.element.val())this.close(),this.setPlaceholder();else{var a=this;this.opts.initSelection.call(null,this.opts.element,function(b){b!==h&&null!==b&&(a.updateSelection(b),a.close(),a.setPlaceholder())})}},prepareOpts:function(){var a=this.parent.prepareOpts.apply(this,arguments);"select"===a.element.get(0).tagName.toLowerCase()&&(a.initSelection=function(a,c){var d=a.find(":selected");f.isFunction(c)&&
c({id:d.attr("value"),text:d.text()})});return a},setPlaceholder:function(){var a=this.getPlaceholder();""===this.opts.element.val()&&a!==h&&!(this.select&&""!==this.select.find("option:first").text())&&(this.selection.find("span").html(l(a)),this.selection.addClass("select2-default"),this.selection.find("abbr").hide())},postprocessResults:function(a,b){var c=0,d=this,e=!0;this.results.find(".select2-result-selectable").each2(function(a,b){if(m(d.id(b.data("select2-data")),d.opts.element.val()))return c=
a,!1});this.highlight(c);!0===b&&(e=this.showSearchInput=a.results.length>=this.opts.minimumResultsForSearch,this.dropdown.find(".select2-search")[e?"removeClass":"addClass"]("select2-search-hidden"),f(this.dropdown,this.container)[e?"addClass":"removeClass"]("select2-with-searchbox"))},onSelect:function(a){var b=this.opts.element.val();this.opts.element.val(this.id(a));this.updateSelection(a);this.close();this.selection.focus();m(b,this.id(a))||this.triggerChange()},updateSelection:function(a){var b=
this.selection.find("span");this.selection.data("select2-data",a);b.empty();a=this.opts.formatSelection(a,b);a!==h&&b.append(l(a));this.selection.removeClass("select2-default");this.opts.allowClear&&this.getPlaceholder()!==h&&this.selection.find("abbr").show()},val:function(){var a,b=null,c=this;if(0===arguments.length)return this.opts.element.val();a=arguments[0];if(this.select)this.select.val(a).find(":selected").each2(function(a,c){b={id:c.attr("value"),text:c.text()};return!1}),this.updateSelection(b),
this.setPlaceholder();else{if(this.opts.initSelection===h)throw Error("cannot call val() if initSelection() is not defined");a?this.opts.initSelection(this.opts.element,function(a){c.opts.element.val(!a?"":c.id(a));c.updateSelection(a);c.setPlaceholder()}):this.clear()}},clearSearch:function(){this.search.val("")},data:function(a){var b;if(0===arguments.length)return b=this.selection.data("select2-data"),b==h&&(b=null),b;!a||""===a?this.clear():(this.opts.element.val(!a?"":this.id(a)),this.updateSelection(a))}});
x=v(u,{createContainer:function(){return f("<div></div>",{"class":"select2-container select2-container-multi"}).html("    <ul class='select2-choices'>  <li class='select2-search-field'>    <input type='text' autocomplete='off' style='width: 25px;' class='select2-input'>  </li></ul><div class='select2-drop select2-drop-multi' style='display:none;'>   <ul class='select2-results'>   </ul></div>")},prepareOpts:function(){var a=this.parent.prepareOpts.apply(this,arguments);"select"===a.element.get(0).tagName.toLowerCase()&&
(a.initSelection=function(a,c){var d=[];a.find(":selected").each2(function(a,b){d.push({id:b.attr("value"),text:b.text()})});f.isFunction(c)&&c(d)});return a},initContainer:function(){var a;this.searchContainer=this.container.find(".select2-search-field");this.selection=a=this.container.find(".select2-choices");this.search.bind("keydown",this.bind(function(b){if(this.enabled){if(b.which===e.BACKSPACE&&""===this.search.val()){this.close();var c;c=a.find(".select2-search-choice-focus");if(0<c.length){this.unselect(c.first());
this.search.width(10);i(b);return}c=a.find(".select2-search-choice");0<c.length&&c.last().addClass("select2-search-choice-focus")}else a.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");if(this.opened())switch(b.which){case e.UP:case e.DOWN:this.moveHighlight(b.which===e.UP?-1:1);i(b);return;case e.ENTER:case e.TAB:this.selectHighlighted();i(b);return;case e.ESC:this.cancel(b);i(b);return}b.which===e.TAB||(e.isControl(b)||e.isFunctionKey(b)||b.which===e.BACKSPACE||b.which===
e.ESC)||(this.open(),(b.which===e.PAGE_UP||b.which===e.PAGE_DOWN)&&i(b))}}));this.search.bind("keyup",this.bind(this.resizeSearch));this.search.bind("blur",this.bind(function(){this.container.removeClass("select2-container-active")}));this.container.delegate(".select2-choices","mousedown",this.bind(function(a){this.enabled&&(this.clearPlaceholder(),this.open(),this.focusSearch(),a.preventDefault())}));this.container.delegate(".select2-choices","focus",this.bind(function(){this.enabled&&(this.container.addClass("select2-container-active"),
this.dropdown.addClass("select2-drop-active"),this.clearPlaceholder())}));this.clearSearch()},enable:function(){this.enabled||(this.parent.enable.apply(this,arguments),this.search.removeAttr("disabled"))},disable:function(){this.enabled&&(this.parent.disable.apply(this,arguments),this.search.attr("disabled",!0))},initSelection:function(){""===this.opts.element.val()&&(this.updateSelection([]),this.close(),this.clearSearch());if(this.select||""!==this.opts.element.val()){var a=this;this.opts.initSelection.call(null,
this.opts.element,function(b){if(b!==h&&b!==null){a.updateSelection(b);a.close();a.clearSearch()}})}},clearSearch:function(){var a=this.getPlaceholder();a!==h&&0===this.getVal().length&&!1===this.search.hasClass("select2-focused")?(this.search.val(a).addClass("select2-default"),this.resizeSearch()):this.search.val(" ").width(10)},clearPlaceholder:function(){this.search.hasClass("select2-default")?this.search.val("").removeClass("select2-default"):" "===this.search.val()&&this.search.val("")},opening:function(){this.parent.opening.apply(this,
arguments);this.clearPlaceholder();this.resizeSearch();this.focusSearch()},close:function(){this.opened()&&this.parent.close.apply(this,arguments)},focus:function(){this.close();this.search.focus()},isFocused:function(){return this.search.hasClass("select2-focused")},updateSelection:function(a){var b=[],c=[],d=this;f(a).each(function(){0>j(d.id(this),b)&&(b.push(d.id(this)),c.push(this))});a=c;this.selection.find(".select2-search-choice").remove();f(a).each(function(){d.addSelectedChoice(this)});
d.postprocessResults()},onSelect:function(a){this.addSelectedChoice(a);this.select&&this.postprocessResults();this.opts.closeOnSelect?(this.close(),this.search.width(10)):(this.search.width(10),this.resizeSearch(),0<this.countSelectableResults()?this.positionDropdown():this.close());this.triggerChange({added:a});this.focusSearch()},cancel:function(){this.close();this.focusSearch()},addSelectedChoice:function(a){var b=f("<li class='select2-search-choice'>    <div></div>    <a href='javascript:void(0)' class='select2-search-choice-close' tabindex='-1'></a></li>"),
c=this.id(a),d=this.getVal(),e;e=this.opts.formatSelection(a,b);b.find("div").replaceWith("<div>"+l(e)+"</div>");b.find(".select2-search-choice-close").bind("click dblclick",this.bind(function(a){this.enabled&&(f(a.target).closest(".select2-search-choice").fadeOut("fast").animate({width:"hide"},50,this.bind(function(){this.unselect(f(a.target));this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");this.close();this.focusSearch()})).dequeue(),i(a))})).bind("focus",
this.bind(function(){this.enabled&&(this.container.addClass("select2-container-active"),this.dropdown.addClass("select2-drop-active"))}));b.data("select2-data",a);b.insertBefore(this.searchContainer);d.push(c);this.setVal(d)},unselect:function(a){var b=this.getVal(),c,d,a=a.closest(".select2-search-choice");if(0===a.length)throw"Invalid argument: "+a+". Must be .select2-search-choice";c=a.data("select2-data");d=j(this.id(c),b);0<=d&&(b.splice(d,1),this.setVal(b),this.select&&this.postprocessResults());
a.remove();this.triggerChange({removed:c})},postprocessResults:function(){var a=this.getVal(),b=this.results.find(".select2-result-selectable"),c=this.results.find(".select2-result-with-children"),d=this;b.each2(function(b,c){var f=d.id(c.data("select2-data"));0<=j(f,a)?c.addClass("select2-disabled").removeClass("select2-result-selectable"):c.removeClass("select2-disabled").addClass("select2-result-selectable")});c.each2(function(a,b){0==b.find(".select2-result-selectable").length?b.addClass("select2-disabled"):
b.removeClass("select2-disabled")});b.each2(function(a,b){if(!b.hasClass("select2-disabled")&&b.hasClass("select2-result-selectable"))return d.highlight(0),!1})},resizeSearch:function(){var a,b,c,d,e=this.search.outerWidth()-this.search.width();a=this.search;r||(c=a[0].currentStyle||window.getComputedStyle(a[0],null),r=f("<div></div>").css({position:"absolute",left:"-10000px",top:"-10000px",display:"none",fontSize:c.fontSize,fontFamily:c.fontFamily,fontStyle:c.fontStyle,fontWeight:c.fontWeight,letterSpacing:c.letterSpacing,
textTransform:c.textTransform,whiteSpace:"nowrap"}),f("body").append(r));r.text(a.val());a=r.width()+10;b=this.search.offset().left;c=this.selection.width();d=this.selection.offset().left;b=c-(b-d)-e;b<a&&(b=c-e);40>b&&(b=c-e);this.search.width(b)},getVal:function(){var a;if(this.select)return a=this.select.val(),null===a?[]:a;a=this.opts.element.val();return y(a,this.opts.separator)},setVal:function(a){var b;this.select?this.select.val(a):(b=[],f(a).each(function(){0>j(this,b)&&b.push(this)}),this.opts.element.val(0===
b.length?"":b.join(this.opts.separator)))},val:function(){var a,b=[],c=this;if(0===arguments.length)return this.getVal();if(a=arguments[0])if(this.setVal(a),this.select)this.select.find(":selected").each(function(){b.push({id:f(this).attr("value"),text:f(this).text()})}),this.updateSelection(b);else{if(this.opts.initSelection===h)throw Error("val() cannot be called if initSelection() is not defined");this.opts.initSelection(this.opts.element,function(a){var b=f(a).map(c.id);c.setVal(b);c.updateSelection(a);
c.clearSearch()})}else this.opts.element.val(""),this.updateSelection([]);this.clearSearch()},onSortStart:function(){if(this.select)throw Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");this.search.width(0);this.searchContainer.hide()},onSortEnd:function(){var a=[],b=this;this.searchContainer.show();this.searchContainer.appendTo(this.searchContainer.parent());this.resizeSearch();this.selection.find(".select2-search-choice").each(function(){a.push(b.opts.id(f(this).data("select2-data")))});
this.setVal(a);this.triggerChange()},data:function(a){var b=this,c;if(0===arguments.length)return this.selection.find(".select2-search-choice").map(function(){return f(this).data("select2-data")}).get();a||(a=[]);c=f.map(a,function(a){return b.opts.id(a)});this.setVal(c);this.updateSelection(a);this.clearSearch()}});f.fn.select2=function(){var a=Array.prototype.slice.call(arguments,0),b,c,d,e,i="val destroy open close focus isFocused container onSortStart onSortEnd enable disable positionDropdown data".split(" ");
this.each(function(){if(0===a.length||"object"===typeof a[0])b=0===a.length?{}:f.extend({},a[0]),b.element=f(this),"select"===b.element.get(0).tagName.toLowerCase()?e=b.element.attr("multiple"):(e=b.multiple||!1,"tags"in b&&(b.multiple=e=!0)),c=e?new x:new w,c.init(b);else if("string"===typeof a[0]){if(0>j(a[0],i))throw"Unknown method: "+a[0];d=h;c=f(this).data("select2");if(c!==h&&(d="container"===a[0]?c.container:c[a[0]].apply(c,a.slice(1)),d!==h))return!1}else throw"Invalid arguments to select2 plugin: "+
a;});return d===h?this:d};f.fn.select2.defaults={width:"copy",closeOnSelect:!0,containerCss:{},dropdownCss:{},containerCssClass:"",dropdownCssClass:"",formatResult:function(a,b,c){b=[];A(a.text,c.term,b);return b.join("")},formatSelection:function(a){return a.text},formatNoMatches:function(){return"No matches found"},formatInputTooShort:function(a,b){return"Please enter "+(b-a.length)+" more characters"},formatSelectionTooBig:function(a){return"You can only select "+a+" items"},formatLoadMore:function(){return"Loading more results..."},
minimumResultsForSearch:0,minimumInputLength:0,maximumSelectionSize:0,id:function(a){return a.id},matcher:function(a,b){return 0<=b.toUpperCase().indexOf(a.toUpperCase())}};window.Select2={query:{ajax:B,local:C,tags:D},util:{debounce:z,markMatch:A},"class":{"abstract":u,single:w,multi:x}}}})(jQuery);
