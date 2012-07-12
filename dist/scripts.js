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

/* ===================================================
 * bootstrap-transition.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd'
            ,  'msTransition'     : 'MSTransitionEnd'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger != 'manual') {
        eventIn  = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      clearTimeout(this.timeout)
      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , isHTML: function(text) {
      // html string detection logic adapted from jQuery
      return typeof text != 'string'
        || ( text.charAt(0) === "<"
          && text.charAt( text.length - 1 ) === ">"
          && text.length >= 3
        ) || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text)
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  }

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function ( element ) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function ( element, options ) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.isHTML(content) ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (content, options) {
    this.options = options
    this.$element = $(content)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        escape.call(this)
        backdrop.call(this, function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element.addClass('in')

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        escape.call(this)

        this.$element.removeClass('in')

        $.support.transition && this.$element.hasClass('fade') ?
          hideWithTransition.call(this) :
          hideModal.call(this)
      }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  function hideWithTransition() {
    var that = this
      , timeout = setTimeout(function () {
          that.$element.off($.support.transition.end)
          hideModal.call(that)
        }, 500)

    this.$element.one($.support.transition.end, function () {
      clearTimeout(timeout)
      hideModal.call(that)
    })
  }

  function hideModal(that) {
    this.$element
      .hide()
      .trigger('hidden')

    backdrop.call(this)
  }

  function backdrop(callback) {
    var that = this
      , animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      if (this.options.backdrop != 'static') {
        this.$backdrop.click($.proxy(this.hide, this))
      }

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      doAnimate ?
        this.$backdrop.one($.support.transition.end, callback) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop.one($.support.transition.end, $.proxy(removeBackdrop, this)) :
        removeBackdrop.call(this)

    } else if (callback) {
      callback()
    }
  }

  function removeBackdrop() {
    this.$backdrop.remove()
    this.$backdrop = null
  }

  function escape() {
    var that = this
    if (this.isShown && this.options.keyboard) {
      $(document).on('keyup.dismiss.modal', function ( e ) {
        e.which == 27 && that.hide()
      })
    } else if (!this.isShown) {
      $(document).off('keyup.dismiss.modal')
    }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({}, $target.data(), $this.data())

      e.preventDefault()
      $target.modal(option)
    })
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-dropdown.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle="dropdown"]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , selector
        , isActive

      if ($this.is('.disabled, :disabled')) return

      selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      $parent = $(selector)
      $parent.length || ($parent = $this.parent())

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) $parent.toggleClass('open')

      return false
    }

  }

  function clearMenus() {
    $(toggle).parent().removeClass('open')
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html').on('click.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.parent('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn') && !$btn.hasClass('button')) $btn = $btn.closest('.btn')
      $btn.button('toggle')
    })
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);
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

Version: 2.1 Timestamp: Tue Jun 12 19:50:25 PDT 2012

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in
compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.*/
(function(e,h){function i(a,b){var c=0,f=b.length,j;if("undefined"===typeof a)return-1;if(a.constructor===String)for(;c<f;c+=1){if(0===a.localeCompare(b[c]))return c}else for(;c<f;c+=1)if(j=b[c],j.constructor===String){if(0===j.localeCompare(a))return c}else if(j===a)return c;return-1}function n(a,b){return a===b?!0:a===h||b===h||null===a||null===b?!1:a.constructor===String?0===a.localeCompare(b):b.constructor===String?0===b.localeCompare(a):!1}function r(a,b){var c,f,j;if(null===a||1>a.length)return[];
c=a.split(b);f=0;for(j=c.length;f<j;f+=1)c[f]=e.trim(c[f]);return c}function w(a){a.bind("keydown",function(){a.data("keyup-change-value",a.val())});a.bind("keyup",function(){a.val()!==a.data("keyup-change-value")&&a.trigger("keyup-change")})}function x(a){a.bind("mousemove",function(a){var c=e(document).data("select2-lastpos");(c===h||c.x!==a.pageX||c.y!==a.pageY)&&e(a.target).trigger("mousemove-filtered",a)})}function s(a,b){var c;return function(){window.clearTimeout(c);c=window.setTimeout(b,a)}}
function y(a,b){var c=s(a,function(a){b.trigger("scroll-debounced",a)});b.bind("scroll",function(a){0<=i(a.target,b.get())&&c(a)})}function g(a){a.preventDefault();a.stopPropagation()}function t(a){var b,c=0,f=null,j=a.quietMillis||100;return function(d){window.clearTimeout(b);b=window.setTimeout(function(){var b=c+=1,j=a.data,h=a.transport||e.ajax,j=j.call(this,d.term,d.page,d.context);null!==f&&f.abort();f=h.call(null,{url:a.url,dataType:a.dataType,data:j,success:function(f){b<c||(f=a.results(f,
d.page),d.callback(f))}})},j)}}function u(a){var b=a,c=function(a){return""+a.text};e.isArray(b)||(c=b.text,e.isFunction(c)||(c=function(a){return a[b.text]}),b=b.results);return function(a){var j=a.term,d={};if(j==="")a.callback({results:b});else{d.results=e(b).filter(function(){return a.matcher(j,c(this))}).get();a.callback(d)}}}function v(a){return e.isFunction(a)?a:function(b){var c=b.term,f={results:[]};e(a).each(function(){var a=this.text!==h,e=a?this.text:this;if(""===c||b.matcher(c,e))f.results.push(a?
this:{id:this,text:this})});b.callback(f)}}function o(a,b){var c=function(){};c.prototype=new a;c.prototype.constructor=c;c.prototype.parent=a.prototype;c.prototype=e.extend(c.prototype,b);return c}if(window.Select2===h){var d,m,p,q;d={TAB:9,ENTER:13,ESC:27,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,SHIFT:16,CTRL:17,ALT:18,PAGE_UP:33,PAGE_DOWN:34,HOME:36,END:35,BACKSPACE:8,DELETE:46,isArrow:function(a){a=a.which?a.which:a;switch(a){case d.LEFT:case d.RIGHT:case d.UP:case d.DOWN:return!0}return!1},isControl:function(a){a=
a.which?a.which:a;switch(a){case d.SHIFT:case d.CTRL:case d.ALT:return!0}return!1},isFunctionKey:function(a){a=a.which?a.which:a;return 112<=a&&123>=a}};e(document).delegate("*","mousemove",function(a){e(document).data("select2-lastpos",{x:a.pageX,y:a.pageY})});e(document).ready(function(){e(document).delegate("*","mousedown focusin touchend",function(a){var b=e(a.target).closest("div.select2-container").get(0);e(document).find("div.select2-container-active").each(function(){this!==b&&e(this).data("select2").blur()})})});
m=o(Object,{bind:function(a){var b=this;return function(){a.apply(b,arguments)}},init:function(a){var b,c;this.opts=a=this.prepareOpts(a);this.id=a.id;a.element.data("select2")!==h&&null!==a.element.data("select2")&&this.destroy();this.enabled=!0;this.container=this.createContainer();a.element.attr("class")!==h&&this.container.addClass(a.element.attr("class"));this.opts.element.data("select2",this).hide().after(this.container);this.container.data("select2",this);this.dropdown=this.container.find(".select2-drop");
this.results=b=this.container.find(".select2-results");this.search=c=this.container.find("input[type=text]");this.resultsPage=0;this.context=null;this.initContainer();x(this.results);this.container.delegate(".select2-results","mousemove-filtered",this.bind(this.highlightUnderEvent));y(80,this.results);this.container.delegate(".select2-results","scroll-debounced",this.bind(this.loadMoreIfNeeded));e.fn.mousewheel&&b.mousewheel(function(a,c,e,d){c=b.scrollTop();0<d&&0>=c-d?(b.scrollTop(0),g(a)):0>d&&
b.get(0).scrollHeight-b.scrollTop()+d<=b.height()&&(b.scrollTop(b.get(0).scrollHeight-b.height()),g(a))});w(c);c.bind("keyup-change",this.bind(this.updateResults));c.bind("focus",function(){c.addClass("select2-focused")});c.bind("blur",function(){c.removeClass("select2-focused")});this.container.delegate(".select2-results","click",this.bind(function(a){0<e(a.target).closest(".select2-result:not(.select2-disabled)").length?(this.highlightUnderEvent(a),this.selectHighlighted(a)):(g(a),this.focusSearch())}));
e.isFunction(this.opts.initSelection)&&(this.initSelection(),this.monitorSource());a.element.is(":disabled")&&this.disable()},destroy:function(){var a=this.opts.element.data("select2");a!==h&&(a.container.remove(),a.opts.element.removeData("select2").unbind(".select2").show())},prepareOpts:function(a){var b,c,f;b=a.element;"select"===b.get(0).tagName.toLowerCase()&&(this.select=c=a.element);c&&e.each("id multiple ajax query createSearchChoice initSelection data tags".split(" "),function(){if(this in
a)throw Error("Option '"+this+"' is not allowed for Select2 when attached to a <select> element.");});a=e.extend({},{formatResult:function(a){return a.text},formatSelection:function(a){return a.text},formatNoMatches:function(){return"No matches found"},formatInputTooShort:function(a,b){return"Please enter "+(b-a.length)+" more characters"},minimumResultsForSearch:0,minimumInputLength:0,id:function(a){return a.id},matcher:function(a,b){return b.toUpperCase().indexOf(a.toUpperCase())>=0}},a);"function"!==
typeof a.id&&(f=a.id,a.id=function(a){return a[f]});c?(a.query=this.bind(function(a){var c={results:[],more:false},f=a.term,d=this.getPlaceholder();b.find("option").each(function(b){var g=e(this),i=g.text();if(b===0&&d!==h&&i==="")return true;a.matcher(f,i)&&c.results.push({id:g.attr("value"),text:i})});a.callback(c)}),a.id=function(a){return a.id}):"query"in a||("ajax"in a?a.query=t(a.ajax):"data"in a?a.query=u(a.data):"tags"in a&&(a.query=v(a.tags),a.createSearchChoice=function(a){return{id:a,text:a}},
a.initSelection=function(a){var b=[];e(r(a.val(),",")).each(function(){b.push({id:this,text:this})});return b}));if("function"!==typeof a.query)throw"query function not defined for Select2 "+a.element.attr("id");return a},monitorSource:function(){this.opts.element.bind("change.select2",this.bind(function(){!0!==this.opts.element.data("select2-change-triggered")&&this.initSelection()}))},triggerChange:function(){this.opts.element.data("select2-change-triggered",!0);this.opts.element.trigger("change");
this.opts.element.data("select2-change-triggered",!1)},enable:function(){this.enabled||(this.enabled=!0,this.container.removeClass("select2-container-disabled"))},disable:function(){this.enabled&&(this.close(),this.enabled=!1,this.container.addClass("select2-container-disabled"))},opened:function(){return this.container.hasClass("select2-dropdown-open")},open:function(){this.opened()||(this.container.addClass("select2-dropdown-open").addClass("select2-container-active"),this.updateResults(!0),this.dropdown.show(),
this.ensureHighlightVisible(),this.focusSearch())},close:function(){this.opened()&&(this.dropdown.hide(),this.container.removeClass("select2-dropdown-open"),this.results.empty(),this.clearSearch())},clearSearch:function(){},ensureHighlightVisible:function(){var a=this.results,b,c,f,d;b=a.children(".select2-result");c=this.highlight();0>c||(f=e(b[c]),d=f.offset().top+f.outerHeight(),c===b.length-1&&(b=a.find("li.select2-more-results"),0<b.length&&(d=b.offset().top+b.outerHeight())),b=a.offset().top+
a.outerHeight(),d>b&&a.scrollTop(a.scrollTop()+(d-b)),f=f.offset().top-a.offset().top,0>f&&a.scrollTop(a.scrollTop()+f))},moveHighlight:function(a){for(var b=this.results.children(".select2-result"),c=this.highlight();-1<c&&c<b.length;)if(c+=a,!e(b[c]).hasClass("select2-disabled")){this.highlight(c);break}},highlight:function(a){var b=this.results.children(".select2-result");if(0===arguments.length)return i(b.filter(".select2-highlighted")[0],b.get());b.removeClass("select2-highlighted");a>=b.length&&
(a=b.length-1);0>a&&(a=0);e(b[a]).addClass("select2-highlighted");this.ensureHighlightVisible();this.opened()&&this.focusSearch()},highlightUnderEvent:function(a){a=e(a.target).closest(".select2-result");0<a.length&&this.highlight(a.index())},loadMoreIfNeeded:function(){var a=this.results,b=a.find("li.select2-more-results"),c,f=-1,d=this.resultsPage+1;0!==b.length&&(c=b.offset().top-a.offset().top-a.height(),0>=c&&(b.addClass("select2-active"),this.opts.query({term:this.search.val(),page:d,context:this.context,
matcher:this.opts.matcher,callback:this.bind(function(c){var k=[],g=this;e(c.results).each(function(){k.push("<li class='select2-result'>");k.push(g.opts.formatResult(this));k.push("</li>")});b.before(k.join(""));a.find(".select2-result").each(function(a){var b=e(this);b.data("select2-data")!==h?f=a:b.data("select2-data",c.results[a-f-1])});c.more?b.removeClass("select2-active"):b.remove();this.resultsPage=d})})))},updateResults:function(a){function b(a){f.html(a);f.scrollTop(0);c.removeClass("select2-active")}
var c=this.search,f=this.results,d=this.opts,g=this;!0!==a&&!1===this.showSearchInput||(c.addClass("select2-active"),c.val().length<d.minimumInputLength?b("<li class='select2-no-results'>"+d.formatInputTooShort(c.val(),d.minimumInputLength)+"</li>"):(this.resultsPage=1,d.query({term:c.val(),page:this.resultsPage,context:null,matcher:d.matcher,callback:this.bind(function(k){var i=[],l;this.context=k.context===h?null:k.context;this.opts.createSearchChoice&&""!==c.val()&&(l=this.opts.createSearchChoice.call(null,
c.val(),k.results),l!==h&&null!==l&&g.id(l)!==h&&null!==g.id(l)&&0===e(k.results).filter(function(){return n(g.id(this),g.id(l))}).length&&k.results.unshift(l));0===k.results.length?b("<li class='select2-no-results'>"+d.formatNoMatches(c.val())+"</li>"):(e(k.results).each(function(){i.push("<li class='select2-result'>");i.push(d.formatResult(this));i.push("</li>")}),!0===k.more&&i.push("<li class='select2-more-results'>Loading more results...</li>"),b(i.join("")),f.children(".select2-result").each(function(a){a=
k.results[a];e(this).data("select2-data",a)}),this.postprocessResults(k,a))})})))},cancel:function(){this.close()},blur:function(){window.setTimeout(this.bind(function(){this.close();this.container.removeClass("select2-container-active");this.clearSearch();this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");this.search.blur()}),10)},focusSearch:function(){window.setTimeout(this.bind(function(){this.search.focus()}),10)},selectHighlighted:function(){var a=
this.results.find(".select2-highlighted:not(.select2-disabled)").data("select2-data");if(a)this.onSelect(a)},getPlaceholder:function(){return this.opts.element.attr("placeholder")||this.opts.element.data("placeholder")||this.opts.placeholder},getContainerWidth:function(){var a,b,c,f;if(this.opts.width!==h)return this.opts.width;a=this.opts.element.attr("style");if(a!==h){a=a.split(";");c=0;for(f=a.length;c<f;c+=1)if(b=a[c].replace(/\s/g,"").match(/width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/),
null!==b&&1<=b.length)return b[1]}return this.opts.element.width()+"px"}});p=o(m,{createContainer:function(){return e("<div></div>",{"class":"select2-container",style:"width: "+this.getContainerWidth()}).html("    <a href='javascript:void(0)' class='select2-choice'>   <span></span><abbr class='select2-search-choice-close' style='display:none;'></abbr>   <div><b></b></div></a>    <div class='select2-drop' style='display:none;'>   <div class='select2-search'>       <input type='text' autocomplete='off'/>   </div>   <ul class='select2-results'>   </ul></div>")},
open:function(){this.opened()||this.parent.open.apply(this,arguments)},close:function(){this.opened()&&this.parent.close.apply(this,arguments)},focus:function(){this.close();this.selection.focus()},isFocused:function(){return this.selection.is(":focus")},cancel:function(){this.parent.cancel.apply(this,arguments);this.selection.focus()},initContainer:function(){var a,b=this.container,c=!1;this.selection=a=b.find(".select2-choice");this.search.bind("keydown",this.bind(function(a){switch(a.which){case d.UP:case d.DOWN:this.moveHighlight(a.which===
d.UP?-1:1);g(a);break;case d.TAB:case d.ENTER:this.selectHighlighted();g(a);break;case d.ESC:this.cancel(a),a.preventDefault()}}));b.delegate(".select2-choice","click",this.bind(function(b){c=!0;this.opened()?(this.close(),a.focus()):this.enabled&&this.open();b.preventDefault();c=!1}));b.delegate(".select2-choice","keydown",this.bind(function(a){if(this.enabled&&!(a.which===d.TAB||d.isControl(a)||d.isFunctionKey(a)||a.which===d.ESC))this.open(),(a.which===d.PAGE_UP||a.which===d.PAGE_DOWN||a.which===
d.SPACE)&&g(a),a.which===d.ENTER&&g(a)}));b.delegate(".select2-choice","focus",function(){this.enabled&&b.addClass("select2-container-active")});b.delegate(".select2-choice","blur",this.bind(function(){c||this.opened()||this.blur()}));a.delegate("abbr","click",this.bind(function(a){this.enabled&&(this.val(""),g(a),this.close(),this.triggerChange())}));this.setPlaceholder()},initSelection:function(){var a;""===this.opts.element.val()?this.updateSelection({id:"",text:""}):(a=this.opts.initSelection.call(null,
this.opts.element),a!==h&&null!==a&&this.updateSelection(a));this.close();this.setPlaceholder()},prepareOpts:function(){var a=this.parent.prepareOpts.apply(this,arguments);"select"===a.element.get(0).tagName.toLowerCase()&&(a.initSelection=function(a){a=a.find(":selected");return{id:a.attr("value"),text:a.text()}});return a},setPlaceholder:function(){var a=this.getPlaceholder();""===this.opts.element.val()&&a!==h&&!(this.select&&""!==this.select.find("option:first").text())&&("object"===typeof a?
this.updateSelection(a):this.selection.find("span").html(a),this.selection.addClass("select2-default"),this.selection.find("abbr").hide())},postprocessResults:function(a,b){var c=0,f=this,d=!0;this.results.find(".select2-result").each(function(a){if(n(f.id(e(this).data("select2-data")),f.opts.element.val()))return c=a,!1});this.highlight(c);!0===b&&(d=this.showSearchInput=a.results.length>=this.opts.minimumResultsForSearch,this.container.find(".select2-search")[d?"removeClass":"addClass"]("select2-search-hidden"),
this.container[d?"addClass":"removeClass"]("select2-with-searchbox"))},onSelect:function(a){var b=this.opts.element.val();this.opts.element.val(this.id(a));this.updateSelection(a);this.close();this.selection.focus();n(b,this.id(a))||this.triggerChange()},updateSelection:function(a){this.selection.find("span").html(this.opts.formatSelection(a));this.selection.removeClass("select2-default");this.opts.allowClear&&this.getPlaceholder()!==h&&this.selection.find("abbr").show()},val:function(){var a,b=null;
if(0===arguments.length)return this.opts.element.val();a=arguments[0];this.select?(this.select.val(a).find(":selected").each(function(){b={id:e(this).attr("value"),text:e(this).text()};return!1}),this.updateSelection(b)):(this.opts.element.val(!a?"":this.id(a)),this.updateSelection(a));this.setPlaceholder()},clearSearch:function(){this.search.val("")}});q=o(m,{createContainer:function(){return e("<div></div>",{"class":"select2-container select2-container-multi",style:"width: "+this.getContainerWidth()}).html("    <ul class='select2-choices'>  <li class='select2-search-field'>    <input type='text' autocomplete='off' style='width: 25px;'>  </li></ul><div class='select2-drop' style='display:none;'>   <ul class='select2-results'>   </ul></div>")},
prepareOpts:function(){var a=this.parent.prepareOpts.apply(this,arguments),a=e.extend({},{closeOnSelect:!0},a);"select"===a.element.get(0).tagName.toLowerCase()&&(a.initSelection=function(a){var c=[];a.find(":selected").each(function(){c.push({id:e(this).attr("value"),text:e(this).text()})});return c});return a},initContainer:function(){var a;this.searchContainer=this.container.find(".select2-search-field");this.selection=a=this.container.find(".select2-choices");this.search.bind("keydown",this.bind(function(b){if(this.enabled){if(b.which===
d.BACKSPACE&&""===this.search.val()){this.close();var c;c=a.find(".select2-search-choice-focus");if(0<c.length){this.unselect(c.first());this.search.width(10);g(b);return}c=a.find(".select2-search-choice");0<c.length&&c.last().addClass("select2-search-choice-focus")}else a.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");if(this.opened())switch(b.which){case d.UP:case d.DOWN:this.moveHighlight(b.which===d.UP?-1:1);g(b);return;case d.ENTER:case d.TAB:this.selectHighlighted();
g(b);return;case d.ESC:this.cancel(b);b.preventDefault();return}b.which===d.TAB||(d.isControl(b)||d.isFunctionKey(b)||b.which===d.BACKSPACE||b.which===d.ESC)||(this.open(),(b.which===d.PAGE_UP||b.which===d.PAGE_DOWN)&&g(b))}}));this.search.bind("keyup",this.bind(this.resizeSearch));this.container.delegate(".select2-choices","click",this.bind(function(a){this.enabled&&(this.open(),this.focusSearch(),a.preventDefault())}));this.container.delegate(".select2-choices","focus",this.bind(function(){this.enabled&&
(this.container.addClass("select2-container-active"),this.clearPlaceholder())}));this.clearSearch()},enable:function(){this.enabled||(this.parent.enable.apply(this,arguments),this.search.show())},disable:function(){this.enabled&&(this.parent.disable.apply(this,arguments),this.search.hide())},initSelection:function(){var a;""===this.opts.element.val()&&this.updateSelection([]);if(this.select||""!==this.opts.element.val())a=this.opts.initSelection.call(null,this.opts.element),a!==h&&null!==a&&this.updateSelection(a);
this.close();this.clearSearch()},clearSearch:function(){var a=this.getPlaceholder();a!==h&&0===this.getVal().length&&!1===this.search.hasClass("select2-focused")?(this.search.val(a).addClass("select2-default"),this.search.width(this.getContainerWidth())):this.search.val("").width(10)},clearPlaceholder:function(){this.search.hasClass("select2-default")&&this.search.val("").removeClass("select2-default")},open:function(){this.opened()||(this.parent.open.apply(this,arguments),this.resizeSearch(),this.focusSearch())},
close:function(){this.opened()&&this.parent.close.apply(this,arguments)},focus:function(){this.close();this.search.focus()},isFocused:function(){return this.search.hasClass("select2-focused")},updateSelection:function(a){var b=[],c=[],d=this;e(a).each(function(){0>i(d.id(this),b)&&(b.push(d.id(this)),c.push(this))});a=c;this.selection.find(".select2-search-choice").remove();e(a).each(function(){d.addSelectedChoice(this)});d.postprocessResults()},onSelect:function(a){this.addSelectedChoice(a);this.select&&
this.postprocessResults();this.opts.closeOnSelect?(this.close(),this.search.width(10)):(this.search.width(10),this.resizeSearch());this.triggerChange();this.focusSearch()},cancel:function(){this.close();this.focusSearch()},addSelectedChoice:function(a){var b,c=this.id(a),d=this.getVal();b=["<li class='select2-search-choice'>",this.opts.formatSelection(a),"<a href='javascript:void(0)' class='select2-search-choice-close' tabindex='-1'></a>","</li>"];b=e(b.join(""));b.find("a").bind("click dblclick",
this.bind(function(a){this.enabled&&(this.unselect(e(a.target)),this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus"),g(a),this.close(),this.focusSearch())})).bind("focus",this.bind(function(){this.enabled&&this.container.addClass("select2-container-active")}));b.data("select2-data",a);b.insertBefore(this.searchContainer);d.push(c);this.setVal(d)},unselect:function(a){var b=this.getVal(),c,a=a.closest(".select2-search-choice");if(0===a.length)throw"Invalid argument: "+
a+". Must be .select2-search-choice";c=i(this.id(a.data("select2-data")),b);0<=c&&(b.splice(c,1),this.setVal(b),this.select&&this.postprocessResults());a.remove();this.triggerChange()},postprocessResults:function(){var a=this.getVal(),b=this.results.find(".select2-result"),c=this;b.each(function(){var b=e(this),d=c.id(b.data("select2-data"));0<=i(d,a)?b.addClass("select2-disabled"):b.removeClass("select2-disabled")});b.each(function(a){if(!e(this).hasClass("select2-disabled"))return c.highlight(a),
!1})},resizeSearch:function(){var a,b,c,d;c=this.search;a=e("<div></div>").css({position:"absolute",left:"-1000px",top:"-1000px",display:"none",fontSize:c.css("fontSize"),fontFamily:c.css("fontFamily"),fontStyle:c.css("fontStyle"),fontWeight:c.css("fontWeight"),letterSpacing:c.css("letterSpacing"),textTransform:c.css("textTransform"),whiteSpace:"nowrap"});a.text(c.val());e("body").append(a);c=a.width();a.remove();a=c+10;b=this.search.offset().left;c=this.selection.width();d=this.selection.offset().left;
b=c-(b-d)-(this.search.outerWidth()-this.search.width());b<a&&(b=c-(this.search.outerWidth()-this.search.width()));40>b&&(b=c-(this.search.outerWidth()-this.search.width()));this.search.width(b)},getVal:function(){var a;if(this.select)return a=this.select.val(),null===a?[]:a;a=this.opts.element.val();return r(a,",")},setVal:function(a){var b;this.select?this.select.val(a):(b=[],e(a).each(function(){0>i(this,b)&&b.push(this)}),this.opts.element.val(0===b.length?"":b.join(",")))},val:function(){var a,
b=[],c=this;if(0===arguments.length)return this.getVal();a=arguments[0];this.select?(this.setVal(a),this.select.find(":selected").each(function(){b.push({id:e(this).attr("value"),text:e(this).text()})}),this.updateSelection(b)):(a=null===a?[]:a,this.setVal(a),e(a).each(function(){b.push(c.id(this))}),this.setVal(b),this.updateSelection(a));this.clearSearch()},onSortStart:function(){if(this.select)throw Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
this.search.width(0);this.searchContainer.hide()},onSortEnd:function(){var a=[],b=this;this.searchContainer.show();this.searchContainer.appendTo(this.searchContainer.parent());this.resizeSearch();this.selection.find(".select2-search-choice").each(function(){a.push(b.opts.id(e(this).data("select2-data")))});this.setVal(a);this.triggerChange()}});e.fn.select2=function(){var a=Array.prototype.slice.call(arguments,0),b,c,d,g,m="val destroy open close focus isFocused container onSortStart onSortEnd enable disable".split(" ");
this.each(function(){if(0===a.length||"object"===typeof a[0])b=0===a.length?{}:e.extend({},a[0]),b.element=e(this),"select"===b.element.get(0).tagName.toLowerCase()?g=b.element.attr("multiple"):(g=b.multiple||!1,"tags"in b&&(b.multiple=g=!0)),c=g?new q:new p,c.init(b);else if("string"===typeof a[0]){if(0>i(a[0],m))throw"Unknown method: "+a[0];d=h;c=e(this).data("select2");if(c!==h&&(d="container"===a[0]?c.container:c[a[0]].apply(c,a.slice(1)),d!==h))return!1}else throw"Invalid arguments to select2 plugin: "+
a;});return d===h?this:d};window.Select2={query:{ajax:t,local:u,tags:v},util:{debounce:s},"class":{"abstract":m,single:p,multi:q}}}})(jQuery);

(function ($) {

    // properties
    var pluginName = 'BootstrapDropdownSubMenu',
        defaults = {
            propertyName: "value"
        };

    var $subNav = null,
        $mainNav = null,
        showTimeout = null,
        hideTimeout = null;

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * BDSM - Bootstrap Dropdown Sub Menu
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    function BDSM(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * intialize
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    BDSM.prototype.init = function () {

        // create events
        this.createEventHandlers($(this.element), this.options.$mainNav);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * createEventHandlers
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    BDSM.prototype.createEventHandlers = function ($subNav, $mainNav) {

        // mainNav root items: hover
        $mainNav.find('li:not(.dropdown-sub li) a').hover(function(e) {

            // cancel show
            clearTimeout(showTimeout);
            showTimeout = null;

            // create timeout if not already defined
            if (!hideTimeout) {

                // delay before hiding subnav
                hideTimeout = setTimeout(function() {
                    $subNav.removeClass('active');
                }, 500);
            }
        });

        // subNav: hover
        $subNav.hover(function(e) {
            // cancel hide
            clearTimeout(hideTimeout);
            hideTimeout = null;

            // create timeout if not already defined
            if (!showTimeout) {
                // delay before showing subnav
                showTimeout = setTimeout(function() {
                    $subNav.addClass('active');
                }, 500);
            }
        });

        // subNav: click
        $subNav.click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            $subNav.addClass('active');
        });

        // subNav items: hover
        $subNav.find('li a').hover(function(e) {

            // cancel hide
            clearTimeout(hideTimeout);
            hideTimeout = null;
        });

        // subNav items: click
        $subNav.find('li a').click(function(e) {
            $mainNav.removeClass('open');
        });

        // dropdown-toggle: click
        $mainNav.find('.dropdown-toggle').click(function(e) {
            $subNav.removeClass('active');
        });

    };

    // create jQuery plugin - prevent multiple instantiation
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new BDSM(this, options));
            }
        });
    };

})( jQuery);

console.info('TMZ VAGINA2');

// TMZ namespace
var tmz = {
 // Create this closure to contain the cached modules
 module: function() {
    // Internal module cache.
    var modules = {};

    // Create a new module reference scaffold or load an existing module.
    return function(name) {

      // return previously created module
      if (modules[name]) {
        return modules[name];
      }

      // create module - return module template to be extended by module
      return modules[name] = {};
    };
  }()
};

// set application properties
tmz.api = '/';


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * DOCUMENT READY
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
$(document).ready(function() {

	console.info('document ready');

});

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * initialize
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
tmz.initialize = function() {

	console.info('initialize');

	// 3rd party libaries
	tmz.initializeLibraries();

	// event handling
	tmz.initializeModules();
};

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * initializeLibraries
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
tmz.initializeLibraries = function() {

	// moment.js calendar config
	moment.calendar = {
		lastDay : 'LL', //'[Yesterday]',
		sameDay : 'LL', //'[Today]',
		nextDay : 'LL', //'[Tomorrow]',
		lastWeek : 'LL', //'[last] dddd',
		nextWeek : 'LL', //'dddd',
		sameElse : 'LL'
	};

	// moment.js long date format
    moment.longDateFormat = {
		L: 'MM/DD/YYYY',
		LL: 'MMMM D, YYYY',
		LLL: 'MMMM D YYYY h:mm A',
		LLLL: 'dddd, MMMM D YYYY h:mm A'
    };
};

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * initializeModules
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
tmz.initializeModules = function() {

	// module references
	var searchView = tmz.module('searchView'),
		detailView = tmz.module('detailView'),
		itemView = tmz.module('itemView'),
		tagView = tmz.module('tagView'),
		gridView = tmz.module('gridView'),
		filterPanel = tmz.module('filterPanel'),
		videoPanel = tmz.module('videoPanel'),
		siteView = tmz.module('siteView');

	// initialize modules
	searchView.init();
	detailView.init();
	itemView.init();
	tagView.init();
	gridView.init();
	filterPanel.init();
	videoPanel.init();
	siteView.init();
};


// UTILITIES
(function(Utilities, tmz, $, _) {
	"use strict";
	console.info('Utilities');

	// Dependencies
	var User = tmz.module('user'),

		// amazon nodes, possible platform names and standard name link table
		PLATFORM_INDEX = [
			{'id': 'all', 'ign': '', 'gamestats': '', 'amazon': 0, alias: 'all'},
			{'id': 'pc', 'ign': 'pc', 'gamestats': 'pc', 'amazon': 229575, alias: 'pc,windows', name: 'PC'},
			{'id': 'mac', 'ign': '', 'gamestats': 'pc', 'amazon': 229647, alias: 'mac,macwindows,osx,os x,apple,macintosh', name: 'Mac'},
			{'id': 'xbox', 'ign': '', 'gamestats': 'xbox', 'amazon': 537504, alias: 'xbox,microsoft xbox', name: 'Xbox'},
			{'id': 'x360', 'ign': 'x360', 'gamestats': 'xbox-360', 'amazon': 14220161, alias: 'x360,xbox 360,microsoft xbox360,360', name: 'X360'},
			{'id': 'xbl', 'ign': 'x360&downloadType=1', 'gamestats': 'xbox-360', 'amazon': 14220161, alias: 'xbl,xbox live', name: 'XBL'},
			{'id': 'ds', 'ign': 'ds', 'gamestats': 'nintendo-ds', 'amazon': 11075831, alias: 'ds,nintendo ds', name: 'DS'},
			{'id': '3ds', 'ign': 'ds', 'gamestats': 'nintendo-ds', 'amazon': 2622269011,alias: '3ds,nintendo 3ds', name: '3DS'},
			{'id': 'wii', 'ign': 'wii', 'gamestats': 'wii', 'amazon': 14218901, alias: 'wii,nintendo wii', name: 'Wii'},
			{'id': 'ps', 'ign': '', 'gamestats': 'playstation', 'amazon': 229773, alias: 'ps,ps1,playstation,playstation1,playstation 1,sony playstation 1,sony playstation', name: 'PS1'},
			{'id': 'ps2', 'ign': '', 'gamestats': 'playstation-2', 'amazon': 301712, alias: 'ps2,playstation 2,playstation2,sony playstation 2', name: 'PS2'},
			{'id': 'ps3', 'ign': 'ps3', 'gamestats': 'playstation-3', 'amazon': 14210751, alias: 'ps3,playstation 3,playstation3,sony playstation 3', name: 'PS3'},
			{'id': 'psn', 'ign': 'ps3&downloadType=201', 'gamestats': 'playstation-3', 'amazon': 14210751, alias: 'psn,playstation network', name: 'PSN'},
			{'id': 'vita', 'ign': 'ps-vita', 'gamestats': 'playstation-3', 'amazon': 3010556011, alias: 'vita,psvita,ps vita,playstation vita,sony vita,sony playstation vita', name: 'Vita'},
			{'id': 'psp', 'ign': '', 'gamestats': 'playstation-portable', 'amazon': 11075221, alias: 'psp,sony psp', name: 'PSP'},
			{'id': 'gc', 'ign': '', 'gamestats': 'gamecube', 'amazon': 541022, alias: 'gamecube,gc,nintendo gamecube', name: 'Gamecube'},
			{'id': 'n64', 'ign': '', 'gamestats': 'nintendo-64', 'amazon': 229763, alias: 'n64,nintendo 64,nintendo64', name: 'N64'},
			{'id': 'nes', 'ign': '', 'gamestats': 'nes', 'amazon': 566458, alias: 'nes,nintendo nes', name: 'NES'},
			{'id': 'snes', 'ign': '', 'gamestats': 'super-nes', 'amazon': 294945, alias: 'snes,super nintendo,nintendo snes', name: 'SNES'},
			{'id': 'gba', 'ign': '', 'gamestats': 'gameboy-advance', 'amazon': 1272528011, alias: 'gb,gameboy', name: 'Game Boy'},
			{'id': 'gb', 'ign': '', 'gamestats': 'game-boy', 'amazon': 541020, alias: 'gba,gameboy advance,game boy,advance,gbadvance', name: 'GBA'},
			{'id': 'gbc', 'ign': '', 'gamestats': 'game-boy-color', 'amazon': 229783, alias: 'gbc,gbcolor,gameboy color', name: 'GBC'},
			{'id': 'dc', 'ign': '', 'gamestats': 'dreamcast', 'amazon': 229793, alias: 'dc,dreamcast,sega dreamcast,sega dream cast,dream cast', name: 'Dreamcast'},
			{'id': 'saturn', 'ign': '', 'gamestats': 'saturn', 'amazon': 294944, alias: 'saturn,sega saturn', name: 'Saturn'},
			{'id': 'genesis', 'ign': '', 'gamestats': 'genesis', 'amazon': 294943, alias: 'genesis,sega genesis', name: 'Genesis'},
			{'id': 'gamegear', 'ign': '', 'gamestats': 'game-gear', 'amazon': 294942, alias: 'gamegear,game gear,sega gamegear', name: 'Gamegear'},
			{'id': 'segacd', 'ign': '', 'gamestats': 'sega-cd', 'amazon': 11000181, alias: 'cd,sega cd', name: 'Sega CD'}
		],

		// constants
		SEARCH_PROVIDERS = {'Amazon': 0, 'GiantBomb': 1},
		VIEW_ALL_TAG_ID = '0',

		// 3RD PARTY IMAGE PREFIX
		AMAZON_IMAGE = {'URL': 'http://ecx.images-amazon.com/images', 'RE': /http:\/\/ecx\.images-amazon\.com\/images/gi, 'TOKEN': '~1~'},
		GIANTBOMB_IMAGE = {'URL': 'http://media.giantbomb.com/uploads', 'RE': /http:\/\/media\.giantbomb\.com\/uploads/gi, 'TOKEN': '~1~'};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getStandardPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getStandardPlatform = function(platformName) {

		var re = new RegExp(platformName, 'gi');

		for (var i = 0, len = PLATFORM_INDEX.length; i < len; i++) {
			if (re.test(PLATFORM_INDEX[i].alias)) {
				return PLATFORM_INDEX[i];
			}
		}
		return PLATFORM_INDEX[0];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* matchPlatformToIndex -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var matchPlatformToIndex = function(platformName) {

		var re = null;
		var aliasArray = [];
		var bestMatch = null;
		var originalTextLength = platformName.length;
		var bestMatchLength = 0;
		var currentMatch = null;

		// reverse lookup - make regex of each platform index alias and match with platformName
		for (var i = 0, len = PLATFORM_INDEX.length; i < len; i++) {

			aliasArray = PLATFORM_INDEX[i].alias.split(',');

			for (var j = 0, aliasLen = aliasArray.length; j < aliasLen; j++) {

				re = new RegExp(aliasArray[j], 'gi');
				currentMatch = re.exec(platformName);

				if (currentMatch && currentMatch[0].length === originalTextLength) {

					return PLATFORM_INDEX[i];

				} else if (currentMatch && currentMatch[0].length > bestMatchLength) {

					bestMatchLength = currentMatch[0].length;
					bestMatch = PLATFORM_INDEX[i];
				}
			}
		}

		if (bestMatch) {
			return bestMatch;
		}

		return PLATFORM_INDEX[0];
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * PUBLIC -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var publicMethods = {
        'PLATFORM_INDEX': PLATFORM_INDEX,
        'SEARCH_PROVIDERS': SEARCH_PROVIDERS,
        'VIEW_ALL_TAG_ID': VIEW_ALL_TAG_ID,
        'AMAZON_IMAGE': AMAZON_IMAGE,
        'GIANTBOMB_IMAGE': GIANTBOMB_IMAGE,
        'getStandardPlatform': getStandardPlatform,
        'matchPlatformToIndex': matchPlatformToIndex
    };

    $.extend(Utilities, publicMethods);

})(tmz.module('utilities'), tmz, jQuery, _);


// USER
(function(User, tmz, $, _) {
	"use strict";
	console.info('User');

	// Dependencies
	var Utilities = tmz.module('utilities'),
		Storage = tmz.module('storage'),
		ItemView = tmz.module('itemView'),
		ItemCache = tmz.module('itemCache'),

		// constants
		USER_LOGIN_URL = tmz.api + 'user/login/',
		USER_LOGOUT_URL = tmz.api + 'user/logout/',
		USER_VIEW_URL = tmz.api + 'user/',
		USER_CREATE_URL = tmz.api + 'user/create/',
		USER_UPDATE_URL = tmz.api + 'user/update/',
		USER_SEND_RESET_CODE_URL = tmz.api + 'user/resetcode/send/',
		USER_SUBMIT_RESET_CODE_URL = tmz.api + 'user/resetcode/submit/',
		USER_UPDATE_PASSWORD_URL = tmz.api + 'user/password/update/',

		// data
		userData = {'user_id': '', 'secret_key': '', 'viewUser': null},

		// demo account
		demoUser = {'user_id': '1', 'secret_key': '1'};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUserData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.getUserData = function(item) {
		return userData;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUserCredentials
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.getUserCredentials = function(setTimestamp) {

		// default argument
		setTimestamp = typeof setTimestamp !== 'undefined' ? setTimestamp : false;

		// set new timestamp - milliseconds since 1 Jan 1970
		userData.timestamp = new Date().getTime();

		// if setTimestamp: save local storage timestamp
		if (setTimestamp) {
			Storage.set('timestamp', userData.timestamp);
		}

		// viewing user credentials
		if (userData.viewUser) {
			return {'user_name': userData.viewUser};

		// logged in user credentials
		} else {

			if (setTimestamp) {
				return {'uid': userData.user_id, 'uk': userData.secret_key, 'ts': userData.timestamp};
			} else {
				return {'uid': userData.user_id, 'uk': userData.secret_key};
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUserID -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.getUserID = function() {

		return userData.user_id;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.login = function(email, password, onSuccess, onError) {

		var requestData = {
			user_email: email,
			user_password: password
		};

		// login request
		$.ajax({
			url: USER_LOGIN_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				login_success(data, email);
				onSuccess(data, email);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* demoLogin
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.demoLogin = function() {

		// assign demo credentials to user
		userData.user_id = demoUser.user_id;
		userData.secret_key = demoUser.secret_key;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* validateUser
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.validateUser = function(userName, onSuccess) {

		var requestData = {
			user_name: userName
		};

		// login request
		$.ajax({
			url: USER_VIEW_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				validateUser_result(data);
				onSuccess(data);
			},
			error: function(data) {

			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* logout
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.logout = function(email, password, onSuccess) {

		var requestData = {
			uid: userData.user_id,
			uk: userData.secret_key
		};

		// login request
		$.ajax({
			url: USER_LOGOUT_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

			},
			error: function(data) {

			}
		});

		// clear user data (session)
		userData.user_id = null;
		userData.secret_key = null;
		userData.userName = null;
		userData.email = null;
		userData.viewUser = null;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.createUser = function(email, password, onSuccess, onError) {

		// get parameters
		var requestData = {
			user_email: email,
			user_password: password
		};

		$.ajax({
			url: USER_CREATE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				login_success(data, email);
				onSuccess(data, email);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.updateUser = function(password, email, userName, newPassword, onSuccess) {

		// only update if existing password provided
		if (password !== '') {

			var requestData = {
				'uid': userData.user_id,
				'user_password': password
			};

			if (userName !== userData.userName) {
				requestData.user_name = userName;
			}
			if (email !== userData.email) {
				requestData.user_email = email;
			}
			if (newPassword !== '') {
				requestData.user_new_password = newPassword;
			}

			requestData.user_password = password;

			// login request
			$.ajax({
				url: USER_UPDATE_URL,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					if (data.status === 'success') {
						updateUser_result(requestData);
					}
					onSuccess(data);
				},
				error: function(data) {

				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sendResetPasswordCode -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.sendResetPasswordCode = function(email, onSuccess) {

		var requestData = {'user_email': email};

		// login request
		$.ajax({
			url: USER_SEND_RESET_CODE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				onSuccess(data);
			},
			error: function(data) {

			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* submitResetPasswordCode -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.submitResetPasswordCode = function(email, resetCode, onSuccess) {

		var requestData = {'user_email': email, 'user_reset_code': resetCode};

		// login request
		$.ajax({
			url: USER_SUBMIT_RESET_CODE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				onSuccess(data);
			},
			error: function(data) {

			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updatePassword -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.updatePassword = function(email, resetCode, newPassword, onSuccess) {

		var requestData = {'user_email': email, 'user_reset_code': resetCode, 'user_new_password': newPassword};

		// login request
		$.ajax({
			url: USER_UPDATE_PASSWORD_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
				onSuccess(data);
			},
			error: function(data) {

			}
		});

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* isViewUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	User.isViewUser = function() {

		if (userData.viewUser) {
			return true;
		}
		return false;
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUser_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateUser_result = function(requestData) {

		// update userData
		if (typeof requestData.user_name !== 'undefined') {
			userData.userName = requestData.user_name;
		}
		if (typeof requestData.user_email !== 'undefined') {
			userData.email = requestData.user_email;
		}

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login_success
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var login_success = function(data, email) {

		if (data.userID) {

			// save user data (session)
			userData.user_id = data.userID;
			userData.secret_key = data.secretKey;
			userData.userName = data.userName;
			userData.email = email;
			userData.viewUser = null;

			// compare timestamps - if different form localstorage value: clear item local storage data
			var localTimestamp = Storage.get('timestamp');

			// if no localtimestamp in storage set new timestamp from data
			if (!localTimestamp) {
				Storage.set('timestamp', data.timestamp);

			// compare timestamps
			} else if (data.timestamp != localTimestamp) {
				ItemCache.clearStoredData();
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* validateUser_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var validateUser_result = function(data) {

		if (data.status === 'success') {
			// save user data (session)
			userData.viewUser = data.userName;
			userData.user_id = data.userName;
			userData.secret_key = 0;
		}
	};

})(tmz.module('user'), tmz, jQuery, _);

// Storage
(function(Storage, tmz, $, _) {
	"use strict";
	console.info('Storage');

	// Dependencies
	var User = tmz.module('user');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* get
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.get = function(key) {

		var userID = User.getUserID();

		// get local storage object for userID_key - returns string 'undefined' if not found
		var serializedObject = localStorage.getItem(userID + '_' + key);
		var object = null;

		// check local object found
		if (serializedObject !== 'undefined') {
			// retrieve and parse object
			if (serializedObject) {
				object = JSON.parse(serializedObject);
			}
		}

		return object;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* set
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.set = function(key, object) {

		// do not store view user data
		if (!User.isViewUser()) {

			var userID = User.getUserID();

			// store object as string back into userID_key
			localStorage.setItem(userID + '_' + key, JSON.stringify(object));

			if (!object) {
				object = {};
			}
		}

		return object;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* remove -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.remove = function(key) {

		var userID = User.getUserID();

		// remove item from localstorage
		localStorage.removeItem(userID + '_' + key);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setGlobal
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.setGlobal = function(key, object) {

		// store object as string back into userID_key
		localStorage.setItem(key, JSON.stringify(object));

		if (!object) {
			object = {};
		}

		return object;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGlobal
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.getGlobal = function(key) {

		// get local storage object for userID_key
		var serializedObject = localStorage.getItem(key);
		var object = null;

		// retrieve and parse object
		if (serializedObject) {
			object = JSON.parse(serializedObject);
		}

		return object;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* removeGlobal -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.removeGlobal = function(key) {

		// remove item from localstorage
		localStorage.removeItem(key);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearStorage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Storage.clearStorage = function() {

		localStorage.clear();
	};

})(tmz.module('storage'), tmz, jQuery, _);


// ItemData
(function(ItemData, tmz, $, _, moment) {
	"use strict";

	console.info('itemData');

	// Dependencies
	var User = tmz.module('user'),
		ItemLinker = tmz.module('itemLinker'),
		ItemCache = tmz.module('itemCache'),
		Utilities = tmz.module('utilities'),

		// REST URLS
		ITEM_DIRECTORY_URL = tmz.api + 'item/directory/',
		ITEM_URL = tmz.api + 'item/',
		ITEM_ADD_URL = tmz.api + 'item/add/',
		ITEM_BATCH_DELETE_URL = tmz.api + 'item/delete/batch/',
		ITEM_SINGLE_DELETE_URL = tmz.api + 'item/delete/',
		ITEM_USER_UPDATE = tmz.api + 'item/user/update/',
		ITEM_SHARED_UPDATE = tmz.api + 'item/shared/update/',
		UPDATE_METACRITIC_URL = tmz.api + 'item/metacritic/update/',

		// constants
		VIEW_ALL_TAG_ID = Utilities.VIEW_ALL_TAG_ID,

		// full item detail results for last viewed tag:
		// alias of itemsCacheByTag[tagID]
		// key by ID
		items = {},

		// basic item framework - loaded before item details
		// all directories share item data
		// key by itemID = contains tags for each itemID
		itemDataDirectory = {},

		// key 3RD party ID
		amazonDirectory = {},
		giantBombDirectory = {};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* itemsAndDirectoryLoaded -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var itemsAndDirectoryLoaded = function(items) {

		ItemCache.cacheItemsByTag(items, itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* downloadItemDirectory
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var downloadItemDirectory = function(onSuccess, onError) {

		var ajax = null;
		var userData = User.getUserCredentials();

		// check local storage
		var itemDirectory = ItemCache.getStoredItemDirectory();

		if (itemDirectory) {

			storedItemDirectory_result(itemDirectory);
			if (onSuccess) {
				onSuccess(itemDirectory);
			}

		// download directory data
		} else {

			var requestData = {};
			$.extend(true, requestData, userData);

			ajax = $.ajax({
				url: ITEM_DIRECTORY_URL,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					downloadedItemDirectory_result(data);

					// store finished directory
					ItemCache.storeItemDirectory(itemDataDirectory);

					if (onSuccess) {
						onSuccess(data);
					}
				},
				error: function(data) {
				}
			});
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* downloadedItemDirectory_result - run after a itemDirectory downloaded through AJAX
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var downloadedItemDirectory_result = function(data) {

		var directoryItem = {};

		// create new directory, set 3rd party IDs as keys
		_.each(data.directory, function(item, itemID) {

			directoryItem = {
				// add itemID to directoryItem
				itemID: itemID,
				asin: item.aid,
				gbombID: item.gid,
				gameStatus: item.gs,
				playStatus: item.ps,
				tags: item.t,
				tagCount: item.tc,
				userRating: item.ur
			};

			// for each 3RD party directory sets their ID as keys
			addItemToDirectories(directoryItem);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* storedItemDirectory_result - run after itemDirectory loaded through localStorage
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var storedItemDirectory_result = function(itemDirectory) {

		var directoryItem = {};

		// create new directory, set 3rd party IDs as keys
		_.each(itemDirectory, function(item) {

			// for each 3RD party directory sets their ID as keys
			addItemToDirectories(item);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItems = function(tagID, onSuccess, onError) {

		// DEBUG
		if (typeof $(document).data('events').keypress === 'undefined') {

			$(document).keypress(function(e) {
				if (e.which == 96) {
					console.warn('------------ itemDataDirectory: -------', itemDataDirectory);
					console.warn('------------ amazonDirectory: -------', amazonDirectory);
					console.warn('------------ giantBombDirectory: -------', giantBombDirectory);
					console.warn('------------ items: -------------------', items);
				}
			});
		}

		var ajax = null;

		// find in itemsCacheByTag first
		var cachedItems = ItemCache.getCachedItemsByTag(tagID);

		// load cached items offer
		if (cachedItems) {

			// assign as new current items data
			items = cachedItems;

			// return updated source item
			onSuccess(cachedItems);

		// get new items data
		} else {

			var requestData = {
				list_id: tagID
			};

			var userData = User.getUserCredentials();
			$.extend(true, requestData, userData);

			ajax = $.ajax({
				url: ITEM_URL,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					// parse results and assign as new items data
					items = parseItemResults(data);

					// return data to callee
					onSuccess(items);
				},
				error: onError
			});
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseItemResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseItemResults = function(itemResults) {

		// temp item data
		var tempItems = {};
		var item = {};

		var itemLength = 0;
		var calendarDate = null;

		// iterate itemResults
		for (var i = 0, len = itemResults.items.length; i < len; i++) {

			item = {};

			var initialProvider = itemResults.items[i].ip;
			var imageBaseURL = itemResults.items[i].ib || '';

			// add image base url and add media provider url prefix
			var smallImage = addImageURLPrefix(itemResults.items[i].si, imageBaseURL, initialProvider);
			var thumbnailImage = addImageURLPrefix(itemResults.items[i].ti, imageBaseURL, initialProvider);
			var largeImage = addImageURLPrefix(itemResults.items[i].li, imageBaseURL, initialProvider);

			// get attributes
			item.id = itemResults.items[i].iid;
			item.initialProvider = itemResults.items[i].ip;
			item.itemID = itemResults.items[i].iid;
			item.asin = itemResults.items[i].aid;
			item.gbombID = itemResults.items[i].gid;

			item.name = itemResults.items[i].n;
			item.releaseDate = itemResults.items[i].rd;
			item.platform = itemResults.items[i].p;
			item.smallImage = smallImage;
			item.thumbnailImage = thumbnailImage;
			item.largeImage = largeImage;
			item.metascore = itemResults.items[i].ms;
			item.metascorePage = itemResults.items[i].mp;
			item.offers = {};

			item.description = '';

			// add custom formated properties
			addCustomProperties(item);

			// add to lists objects
			tempItems[item.itemID] = item;
		}

		return tempItems;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItem = function(id) {
		return items[id];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToTags
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToTags = function(tagIDs, currentItem, onSuccess, onError) {

		var ajax = null;

		var userData = User.getUserCredentials(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		// shorten image url
		var smallImage = getShortImageURL(item.smallImage, item.initialProvider);
		var thumbnailImage = getShortImageURL(item.thumbnailImage, item.initialProvider);
		var largeImage = getShortImageURL(item.largeImage, item.initialProvider);

		var s1 = smallImage.split('');
		var s2 = thumbnailImage.split('');
		var s3 = largeImage.split('');

		// get base url for all 3 images (common starting substring)
		var lastCommonIndex = findCommonSubstringIndex(s1, s2, s3);

		// remove common substring from images
		var imageBaseURL = s1.slice(0, lastCommonIndex).join('');
		smallImage = s1.slice(lastCommonIndex).join('');
		thumbnailImage = s2.slice(lastCommonIndex).join('');
		largeImage = s3.slice(lastCommonIndex).join('');

		// request data
		var requestData = {
			'lids': tagIDs,

			'n': item.name,
			'rd': item.releaseDate,
			'aid': item.asin,
			'gid': item.gbombID,
			'ip': item.initialProvider,
			'p': item.platform,

			'ib': imageBaseURL,
			'si': smallImage,
			'ti': thumbnailImage,
			'li': largeImage,

			'mp': item.metascorePage,
			'ms': item.metascore,

			'gs': item.gameStatus,
			'ps': item.playStatus,
			'ur': item.userRating
		};
		$.extend(true, requestData, userData);

		ajax = $.ajax({
					url: ITEM_ADD_URL,
					type: 'POST',
					data: requestData,
					dataType: 'json',
					cache: true,
					success: function(data) {

						var addedItems = addClientItem(item, data);
						onSuccess(data, addedItems);
					},
					error: onError
				});

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findCommonSubstringIndex -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findCommonSubstringIndex = function(s1, s2, s3) {

		var lastCommonIndex = 0;
		var commonString = '';

		// step through each index of 3 string arrays
		for (var i = 0, len = s1.length; i < len; i++) {

			if (s1[i] === s2[i] && s1[i] === s3[i]) {
				lastCommonIndex = i;
			} else {
				break;
			}
		}

		return lastCommonIndex + 1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getShortImageURL - shortens media url for common amazon or giantbomb image urls
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getShortImageURL = function(url, initialProvider) {

		var outURL = url;

		// find common prefix and return shortened version
		// amazon media url
		if (initialProvider === Utilities.SEARCH_PROVIDERS.Amazon) {
			outURL = url.replace(Utilities.AMAZON_IMAGE.RE, Utilities.AMAZON_IMAGE.TOKEN);

		// giantbomb media url
		} else if (initialProvider === Utilities.SEARCH_PROVIDERS.GiantBomb) {
			outURL = url.replace(Utilities.GIANTBOMB_IMAGE.RE, Utilities.GIANTBOMB_IMAGE.TOKEN);
		}

		return outURL;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addImageURLPrefix - add provider specific prefix to image url
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addImageURLPrefix = function(url, imageBaseURL, initialProvider) {

		var outURL = url;
		var re = null;

		// prepend image base url
		url = imageBaseURL + url;

		// find common prefix and return shortened version
		// amazon media url
		if (initialProvider == Utilities.SEARCH_PROVIDERS.Amazon) {
			re = new RegExp(Utilities.AMAZON_IMAGE.TOKEN, 'g');
			outURL = url.replace(re, Utilities.AMAZON_IMAGE.URL);

		// giantbomb media url
		} else if (initialProvider == Utilities.SEARCH_PROVIDERS.GiantBomb) {
			re = new RegExp(Utilities.GIANTBOMB_IMAGE.TOKEN, 'g');
			outURL = url.replace(re, Utilities.GIANTBOMB_IMAGE.URL);
		}

		return outURL;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagsForItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagsForItem = function(deletedIDs, deletedTagIDs, currentItem, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		var requestData = {
			'ids': deletedIDs
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: ITEM_BATCH_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

			},
			error: onError
		});

		// delete 1 or more tags from item
		batchTagDelete(currentItem.itemID, deletedIDs, deletedTagIDs);

		onSuccess(currentItem.itemID, deletedTagIDs);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* batchTagDelete -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var batchTagDelete = function(itemID, deletedIDs, deletedTagIDs) {

		// iterate delete tagIDs
		for (var i = 0, len = deletedIDs.length; i < len; i++) {

			// delete item for tag
			deleteClientItem(deletedTagIDs[i], itemID);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteSingleTagForItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteSingleTagForItem = function(itemID, tagID, onSuccess, onError) {

		// get itemTagID
		var id = getDirectoryItemByItemID(itemID).tags[tagID];

		var userData = User.getUserCredentials(true);

		var requestData = {
			'id': id
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: ITEM_SINGLE_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {
			},
			error: onError
		});

		// delete client item
		deleteClientItem(tagID, itemID);

		onSuccess(id, tagID);

		return itemID;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateItem = function(currentItem, onSuccess, onError) {

		// get tags for itemID
		var itemTags = getDirectoryItemByItemID(currentItem.itemID)['tags'];

		var userData = User.getUserCredentials(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'id': item.itemID,
			'aid': item.asin,
			'gid': item.gbombID,

			'rd': item.releaseDate,
			'si': item.smallImage,
			'ti': item.thumbnailImage,
			'li': item.largeImage
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: ITEM_SHARED_UPDATE,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				updateItemData(item, itemTags);
				onSuccess(item, data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUserItem
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateUserItem = function(currentItem, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'id': item.itemID,
			'gs': item.gameStatus,
			'ps': item.playStatus,
			'ur': item.userRating
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: ITEM_USER_UPDATE,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				updateUserItemData(item);
				onSuccess(item, data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateMetacritic
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateMetacritic = function(currentItem, onSuccess, onError) {

		// get tags for itemID
		var itemTags = getDirectoryItemByItemID(currentItem.itemID)['tags'];

		var userData = User.getUserCredentials(true);

		// clone currentItem as new object
		var item = $.extend(true, {}, currentItem);

		var requestData = {
			'id': item.itemID,
			'mp': item.metascorePage,
			'ms': item.metascore
		};
		$.extend(true, requestData, userData);

		// push update to item cache
		updateItemData(item, itemTags);

		$.ajax({
			url: UPDATE_METACRITIC_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				if(onSuccess) {
					onSuccess(item, data);
				}
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addClientItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addClientItem = function(item, data) {

		// cached items
		var viewAllCachedItems = null;
		var newItem = null;
		var addedItems = [];

		// update item with itemID
		item.itemID = data.itemID;

		// update ids -  idsAdded[], tagIDsAdded[]
		// each idsAdded index matches with its tagIDAddeds index
		for (var i = 0, len = data.tagIDsAdded.length; i < len; i++) {

			// clone item
			newItem = $.extend(true, {}, item);

			// update item with new id
			newItem.id = data.itemID;

			// add custom formated properties
			addCustomProperties(newItem);

			// cache new item by tag
			ItemCache.cacheItemByTag(data.tagIDsAdded[i], newItem);

			// item added
			addedItems.push(newItem);
		}

		// add to directory
		addItemDataToDirectory(newItem, data);

		// add last item to 'view all' list (id: 0) cache if exists and itemID does not exist in all items cache
		viewAllCachedItems = ItemCache.getCachedItemsByTag(VIEW_ALL_TAG_ID);

		var itemIDExists = false;
		_.each(viewAllCachedItems, function(item, key) {
			if (item.itemID === newItem.itemID) {
				itemIDExists = true;
			}
		});
		// is unique: add item to 'view all' list
		if (!itemIDExists) {

			// add item to view all cache
			ItemCache.cacheItemByTag(VIEW_ALL_TAG_ID, newItem);
		}

		return addedItems;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteClientItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteClientItem = function(tagID, itemID) {

		// delete item by id from cache by tagID
		ItemCache.deleteCachedItem(itemID, tagID);

		// delete tag from directory
		deleteTagFromDirectory(itemID, tagID);

		// last tag for item, remove from 'view all' list
		if (itemDataDirectory[itemID].tagCount === 0) {

			// update cached items
			ItemCache.deleteCachedItem(itemID, VIEW_ALL_TAG_ID);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addCustomProperties -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addCustomProperties = function(item) {

		// add formatted calendarDate
		if (item.releaseDate !== '1900-01-01') {
			item.calendarDate = moment(item.releaseDate, "YYYY-MM-DD").calendar();
		} else {
			item.calendarDate = 'Unknown';
		}
		// add standard name propery
		item.standardName = ItemLinker.standardizeTitle(item.name);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateUserItemData - also updates 3rd party directories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateUserItemData = function(item) {

		var directoryItem = itemDataDirectory[item.itemID];

		// update directoryItem properties
		directoryItem.gameStatus = item.gameStatus;
		directoryItem.playStatus = item.playStatus;
		directoryItem.userRating = item.userRating;

		// update itemDirectory local storage
		ItemCache.storeItemDirectory(itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateItemData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateItemData = function(item, itemTags) {

		// update itemCache and item local storage for each tag
		_.each(itemTags, function(id, tagID) {

			ItemCache.updateCacheItemByTag(tagID, item);
		});

		// update 'view all' tag cache
		ItemCache.updateCacheItemByTag(0, item);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemDataToDirectory - also updates 3rd party directories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemDataToDirectory = function(item, data) {

		// if itemID doesn't exist in directory
		if (!itemDataDirectory[data.itemID]) {

			// add to tag directory
			var directoryItem = {
				itemID: item.itemID,
				asin: item.asin,
				gbombID: item.gbombID,
				gameStatus: item.gameStatus,
				playStatus: item.playStatus,
				tags: {},
				tagCount: 0,
				userRating: item.userRating
			};

			// add to 3rd party directory
			addItemToDirectories(directoryItem);
		}

		// update tag information in directories
		for (var i = 0, len = data.tagIDsAdded.length; i < len; i++) {

			// add tag
			itemDataDirectory[data.itemID].tags[data.tagIDsAdded[i]] = data.idsAdded[i];
			// increment tagCount
			itemDataDirectory[data.itemID].tagCount += 1;
		}

		// update itemDirectory local storage
		ItemCache.storeItemDirectory(itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagFromDirectory - also updates 3rd party directories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagFromDirectory = function(itemID, tagID) {

		var item = itemDataDirectory[itemID];

		// remove tag from item - will also remove from 3rd party directories
		delete item.tags[tagID];

		// decrement tagCount
		item.tagCount += -1;

		// update itemDirectory local storage
		ItemCache.storeItemDirectory(itemDataDirectory);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToDirectories
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToDirectories = function(item) {

		// itemID directory
		itemDataDirectory[item.itemID] = item;

		// amazon
		if (parseInt(item.asin, 10) !== 0) {
			amazonDirectory[item.asin] = item;
		}
		// giant bomb
		if (parseInt(item.gbombID, 10) !== 0) {
			giantBombDirectory[item.gbombID] = item;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemDirectory -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemDirectory = function() {
		return itemDataDirectory;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getDirectoryItemByItemID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getDirectoryItemByItemID = function(itemID) {

		// return item or empty object
		return itemDataDirectory[itemID] || null;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemByThirdPartyID
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemByThirdPartyID = function(gbombID, asin) {

		// itemID from directory
		var item = null;

		// select appropriate 3rd party item directory
		if (gbombID !== 0) {
			item = giantBombDirectory[gbombID];

		} else if (asin !== 0) {
			item = amazonDirectory[asin];
		}

		return item;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetItemData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetItemData = function() {

		items = {};
		itemDataDirectory = {};
		amazonDirectory = {};
		giantBombDirectory = {};

		// clear cache
		ItemCache.clearItemCache();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getRandomItemID -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getRandomItemID = function() {

		var idList = [];

		// add ids to idList
		_.each(items, function(item, key) {
			idList.push(key);
		});

		// get random number between 0 and idList.length
		var randomIndex = Math.floor(Math.random() * idList.length);

		return idList[randomIndex];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* PUBLIC METHODS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var publicMethods = {
		'itemsAndDirectoryLoaded': itemsAndDirectoryLoaded,
		'getItemDirectory': getItemDirectory,
		'getDirectoryItemByItemID': getDirectoryItemByItemID,
		'getItemByThirdPartyID': getItemByThirdPartyID,
		'resetItemData': resetItemData,
		'getRandomItemID': getRandomItemID,
		'getItems': getItems,
		'getItem': getItem,
		'downloadItemDirectory': downloadItemDirectory,
		'addItemToTags': addItemToTags,
		'updateUserItem': updateUserItem,
		'updateMetacritic': updateMetacritic,
		'deleteTagsForItem': deleteTagsForItem,
		'deleteSingleTagForItem': deleteSingleTagForItem,
		'deleteTagFromDirectory': deleteTagFromDirectory,
		'deleteClientItem': deleteClientItem
	};

	$.extend(ItemData, publicMethods);

})(tmz.module('itemData'), tmz, $, _, moment);


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* TAG DATA - methods for interacting with server side tag data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function(TagData, tmz, $, _) {
	"use strict";
	console.info('TagData');

	// constants
	var TAG_GET_URL = tmz.api + 'tag/',
		TAG_ADD_URL = tmz.api + 'tag/add/',
		TAG_UPDATE_URL = tmz.api + 'tag/update/',
		TAG_DELETE_URL = tmz.api + 'tag/delete/',

		// Dependencies
		User = tmz.module('user'),
		Storage = tmz.module('storage'),
		ItemData = tmz.module('itemData'),

		// local represenation of localStorage data model
		storedTags = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getTags - return tags for user
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.getTags = function(onSuccess, onError) {

		var ajax = null;
		var userData = User.getUserCredentials();

		var requestData = {};
		$.extend(true, requestData, userData);

		// check local storage
		storedTags = Storage.get('tag');

		if (storedTags) {

			if (onSuccess) {
				onSuccess(storedTags);
			}

		// download directory data
		} else {

			ajax = $.ajax({
				url: TAG_GET_URL,
				type: 'POST',
				data: requestData,
				dataType: 'json',
				cache: true,
				success: function(data) {

					// store tag data
					storedTags = Storage.set('tag', data.list);
					onSuccess(data.list);
				},
				error: onError
			});
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addTag - create new tag for user
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.addTag = function(tagName, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		var requestData = {
			'tag_name': tagName
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: TAG_ADD_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				// add response to stored tag internal model
				storedTags.push({'tagName': data.tagName.toLowerCase(), 'tagID': data.tagID});

				// update local storage with store tag model
				Storage.set('tag', storedTags);
				onSuccess(data);
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateTag - update tag name for user
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.updateTag = function(tagName, tagID, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		var requestData = {
			'tag_name': tagName,
			'tag_id': tagID
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: TAG_UPDATE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: function(data) {

				onSuccess(data);
			},
			error: onError
		});

		// update tag in storedTags model
		for (var i = 0, len = storedTags.length; i < len; i++) {
			if (storedTags[i].tagID === tagID) {

				// update name
				storedTags[i].tagName = tagName;

				// update local storage with stored tag model
				Storage.set('tag', storedTags);
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTag - delete users tag
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	TagData.deleteTag = function(tagID, onSuccess, onError) {

		var userData = User.getUserCredentials(true);

		// delete tag
		var requestData = {
			'id': tagID
		};
		$.extend(true, requestData, userData);

		$.ajax({
			url: TAG_DELETE_URL,
			type: 'POST',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: onError
		});

		// delete tag item from storedTags model
		for (var i = 0, len = storedTags.length; i < len; i++) {
			if (storedTags[i].tagID === tagID) {

				storedTags.splice(i, 1);

				// update local storage with stored tag model
				Storage.set('tag', storedTags);

				break;
			}
		}
	};


})(tmz.module('tagData'), tmz, jQuery, _);


// ItemCache
(function(ItemCache, tmz, $, _) {
	"use strict";

	console.info('itemCache');

	// Dependencies
	var User = tmz.module('user'),
		Storage = tmz.module('storage'),
		Utilities = tmz.module('utilities'),

		// constants
		VIEW_ALL_TAG_ID = Utilities.VIEW_ALL_TAG_ID,

		// data

		// items cached by tagID
		itemsCacheByTag = {},

		// tagIDs which have been retrieved from local storage
		storedItems = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedItemsByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedItemsByTag = function(tagID) {

		var cachedItems = null;

		// check memory (session)
		if (typeof itemsCacheByTag[tagID] !== 'undefined') {
			cachedItems = itemsCacheByTag[tagID];

		// check local storage (long term)
		} else {
			cachedItems = getStoredItemsByTag(tagID);
		}

		return cachedItems;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cacheItemsByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cacheItemsByTag = function(items, itemDataDirectory) {

		// iterate items
		_.each(items, function(item, id) {

			// check if itemID is in data directory
			if (typeof itemDataDirectory[item.itemID] !== 'undefined') {

				// get item in itemDataDirectory and iterate tags
				_.each(itemDataDirectory[item.itemID].tags, function(id, tagID) {

					// cache item by tag
					cacheItemByTag(tagID, item);

					// add item to view all cache
					cacheItemByTag(VIEW_ALL_TAG_ID, item);
				});
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cacheItemByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cacheItemByTag = function(tagID, item) {

		// cache item by tag
		if (typeof itemsCacheByTag[tagID] !== 'undefined') {
			itemsCacheByTag[tagID][item.itemID] = item;

		} else {
			itemsCacheByTag[tagID] = {};
			itemsCacheByTag[tagID][item.itemID] = item;
		}

		// add to local storage
		storeItemByTag(tagID, item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateCacheItemByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateCacheItemByTag = function(tagID, item) {

		// update cache
		itemsCacheByTag[tagID][item.itemID] = item;

		// update local storage
		storeItemByTag(tagID, item, true);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getStoredItemDirectory -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getStoredItemDirectory = function() {

		return Storage.get('itemDataDirectory');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* storeItemDirectory -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var storeItemDirectory = function(data) {

		Storage.set('itemDataDirectory', data);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* storeItemByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var storeItemByTag = function(tagID, item, updateStorage) {

		// skip storage if itemID was retrieved from local storage
		if (typeof storedItems[tagID + '_' + item.itemID] === 'undefined' || updateStorage) {

			// get stored items by tag
			var storedItemsCacheByTag = Storage.get('itemsCacheByTag');

			// key exists
			if (storedItemsCacheByTag) {

				// tag exists
				if (typeof storedItemsCacheByTag[tagID] !== 'undefined') {

					// add item to retrieved storage object
					storedItemsCacheByTag[tagID][item.itemID] = item;

				// create tag object
				} else {

					storedItemsCacheByTag[tagID] = {};
					storedItemsCacheByTag[tagID][item.itemID] = item;
				}

			// new storage key: storedItemsCacheByTag
			} else {

				// create fresh object
				storedItemsCacheByTag = {};
				storedItemsCacheByTag[tagID] = {};
				storedItemsCacheByTag[tagID][item.itemID] = item;
			}

			// store user object as string back into userID key
			Storage.set('itemsCacheByTag', storedItemsCacheByTag);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteCachedItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteCachedItem = function(itemID, tagID) {

		if (itemsCacheByTag[tagID]) {
			delete itemsCacheByTag[tagID][itemID];
		}

		deleteStoredItem(itemID, tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteCachedTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteCachedTag = function(tagID) {

		if (itemsCacheByTag[tagID]) {
			delete itemsCacheByTag[tagID];
		}

		deleteStoredTag(tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteStoredTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteStoredTag = function(tagID) {

		var storedItemsCacheByTag = Storage.get('itemsCacheByTag');

		// found stored item: delete tagID in item cache
		if (storedItemsCacheByTag) {
			delete storedItemsCacheByTag[tagID];
			Storage.set('itemsCacheByTag', storedItemsCacheByTag);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteStoredItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteStoredItem = function(itemID, tagID) {

		var storedItemsCacheByTag = Storage.get('itemsCacheByTag');

		// found stored item: delete tagID, itemID in item cache
		if (storedItemsCacheByTag) {
			delete storedItemsCacheByTag[tagID][itemID];
			Storage.set('itemsCacheByTag', storedItemsCacheByTag);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getStoredItemsByTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getStoredItemsByTag = function(tagID) {

		// get local storage object
		var storedItemsCacheByTag = Storage.get('itemsCacheByTag');
		var storedTag = null;

		if (storedItemsCacheByTag) {

			// if tag found in user object
			if (typeof storedItemsCacheByTag[tagID] !== 'undefined') {

				storedTag = storedItemsCacheByTag[tagID];

				// save item id as being retrieved from local storage
				_.each(storedTag, function(item, key) {
					storedItems[tagID + '_' + key] = true;
				});
			}
		}

		return storedTag;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearItemCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearItemCache = function(item) {

		itemsCacheByTag = {};
		storedItems = {};
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearStoredData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearStoredData = function(item) {

		Storage.remove('itemsCacheByTag');
		Storage.remove('itemDataDirectory');
		Storage.remove('tag');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* PUBLIC METHODS -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var publicMethods = {
		'getCachedItemsByTag': getCachedItemsByTag,
		'cacheItemsByTag': cacheItemsByTag,
		'cacheItemByTag': cacheItemByTag,
		'updateCacheItemByTag': updateCacheItemByTag,
		'getStoredItemDirectory': getStoredItemDirectory,
		'storeItemDirectory': storeItemDirectory,
		'deleteCachedItem': deleteCachedItem,
		'deleteCachedTag': deleteCachedTag,
		'clearItemCache': clearItemCache,
		'clearStoredData': clearStoredData
	};

	$.extend(ItemCache, publicMethods);

})(tmz.module('itemCache'), tmz, $, _);


// SITEVIEW
(function(SiteView, tmz, $, _) {
	"use strict";

    // module references
    var User = tmz.module('user'),
		ItemData = tmz.module('itemData'),
		TagView = tmz.module('tagView'),
		ItemView = tmz.module('itemView'),
		SearchView = tmz.module('searchView'),
		Storage = tmz.module('storage'),

		// constants
		FORM_TYPES = {'login': 0, 'signup': 1},

		// properties
		formType = FORM_TYPES.login,
		rememberMe = false,

		// data

		// jquery cache
		// header
		$infoHeader = $('#infoHeader'),
		$header = $('#header'),
		$userMenu = $('#userMenu'),
		$logoutButton = $('#logoutButton'),
		$loggedInButton = $('#loggedInButton'),

		// login/signup
		$loginForm = $('#loginForm'),
		$buttonContainer = $('#buttonContainer'),
		$loginButton = $('#loginButton'),
		$loginHitArea = $('#loginHitArea'),
		$signupButton = $('#signupButton'),
		$signupHitArea = $('#signupHitArea'),
		$loginSubmitButton = $('#loginSubmitButton'),
		$signupSubmitButton = $('#signupSubmitButton'),
		$backButton = $('#backButton'),
		$email = $('#email').find('input'),
		$password = $('#password').find('input'),
		$rememberCheckboxToggle = $('#rememberCheckboxToggle'),
		$resetPasswordButton = $('#resetPasswordButton'),
		$invalidLoginTag = $('#invalidLoginTag'),
		$accountExistsTag = $('#accountExistsTag'),

		// account management
		$accountManagementModal = $('#accountManagement-modal'),
		$clearLocalStorageButton = $('#clearLocalStorage_btn'),
		$deleteAccountButton = $('#deleteAccount_btn'),
		$managementButton = $('#managementButton'),
		$updateAccountButton = $('#updateAccount_btn'),
		$userNameUpdateField = $('#userNameUpdateField'),
		$passwordField = $('#passwordField'),
		$passwordUpdateField = $('#passwordUpdateField'),
		$emailUpdateField = $('#emailUpdateField'),
		$existingPasswordGroup = $accountManagementModal.find('.existingPasswordGroup'),
		$emailGroup = $accountManagementModal.find('.emailGroup'),
		$successAlert = $accountManagementModal.find('.alert-success'),
		$errorAlert = $accountManagementModal.find('.alert-error'),

		// reset password
		$resetpasswordModal = $('#resetpassword-modal'),
		$resetCodeForm = $resetpasswordModal.find('.resetCodeForm'),
		$updatePasswordForm = $resetpasswordModal.find('.updatePasswordForm'),
		$passwordResetCodeContainer = $resetpasswordModal.find('.passwordResetCodeContainer'),
		$passwordResetEmailContainer = $resetpasswordModal.find('.passwordResetEmailContainer'),
		$passwordResetAlertSuccess = $resetpasswordModal.find('.alert-success'),
		$passwordResetAlertError = $resetpasswordModal.find('.alert-error'),

		$resetPasswordEmailField = $('#resetPasswordEmailField'),
		$resetPasswordCodeField = $('#resetPasswordCodeField'),
		$resetPasswordPasswordField = $('#resetPasswordPasswordField'),

		$sendResetCodeButton = $('#sendResetCode_btn'),
		$submitResetCodeButton = $('#submitResetCode_btn'),
		$updatePasswordButton = $('#updatePassword_btn'),

		// site guide
		$guideHitArea = $('#guideHitArea'),
		$guideButton = $('#guideButton'),
		$siteGuide = $('#siteGuide'),
		$siteGuideBackdrop = $('#siteGuideBackdrop'),

		$searchInput = $('#searchField input'),

		// loading status
		$loadingStatus = $('#itemResultsContainer').find('.loadingStatus');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SiteView.init = function() {

		SiteView.createEventHandlers();

		// init login form
		initLoginForm();

		showSiteGuide();

		// setup password reset modal
		$resetpasswordModal.modal({backdrop: true, keyboard: true, show: false});

		// get url path parts
		var urlPathParts = window.location.pathname.split( '/' );
		var action = urlPathParts[1];
		var userName = urlPathParts[2];

		// view public user
		if (action == 'user' && userName !== '') {

			// validate user
			User.validateUser(userName, function(data) {

				// start app with user info
				if (data.status === 'success') {
					viewUser();
				}
			});

		// demo app
		} else {
			startDemo();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SiteView.createEventHandlers = function() {

		// managementButton: click
		$managementButton.click(function(e) {
			e.preventDefault();
			showAccountManagement();
		});

		// updateAccountButton: click
		$updateAccountButton.click(function(e) {
			e.preventDefault();
			updateAccount();
		});

		// email field: keydown
		$email.on('keydown', function(e) {
			submitForm(e.which);
		});

		// password field: keydown
		$password.on('keydown', function(e) {
			submitForm(e.which);
		});

		// logout button: click
		$logoutButton.click(function(e) {
			e.preventDefault();
			// logout
			logout();
		});

		// clearLocalStorageButton: click
		$clearLocalStorageButton.click(function(e) {
			e.preventDefault();
			Storage.clearStorage();
		});

		// deleteAccountButton: click
		$deleteAccountButton.click(function(e) {
			e.preventDefault();
			deleteAccount();
		});

		// signupHitArea
		$signupHitArea.click(function(e) {
			e.preventDefault();
			showSignupForm();
		});
		$signupHitArea.mouseover(function(e) {
			$signupButton.addClass('hover');
		});
		$signupHitArea.mouseout(function(e) {
			$signupButton.removeClass();
		});
		$signupHitArea.mousedown(function(e) {
			$signupButton.addClass('active');
		});
		$signupHitArea.mouseup(function(e) {
			$signupButton.removeClass('active');
		});

		// loginHitArea
		$loginHitArea.click(function(e) {
			e.preventDefault();
			showLoginForm();
		});
		$loginHitArea.mouseover(function(e) {
			$loginButton.addClass('hover');
		});
		$loginHitArea.mouseout(function(e) {
			$loginButton.removeClass();
		});
		$loginHitArea.mousedown(function(e) {
			$loginButton.addClass('active');
		});
		$loginHitArea.mouseup(function(e) {
			$loginButton.removeClass('active');
		});

		// guideHitArea
		$guideHitArea.click(function(e) {
			showSiteGuide();
		});
		$guideHitArea.mouseover(function(e) {
			$guideButton.addClass('hover');
		});
		$guideHitArea.mouseout(function(e) {
			$guideButton.removeClass();
		});
		$guideHitArea.mousedown(function(e) {
			$guideButton.addClass('active');
		});
		$guideHitArea.mouseup(function(e) {
			$guideButton.removeClass('active');
		});

		// login submit button: click
		$loginSubmitButton.click(function(e) {
			e.preventDefault();
			// login
			login($email.val(), $password.val());
		});

		// signup submit button: click
		$signupSubmitButton.click(function(e) {
			e.preventDefault();
			// signup
			signup($email.val(), $password.val());
		});

		// back button: click
		$backButton.click(function(e) {
			e.preventDefault();

			showFormNavigation();
		});

		// rememberCheckboxToggle: click
		$rememberCheckboxToggle.click(function(e) {
			if (rememberMe) {
				rememberMe = false;
				$(this).removeClass('on');
				setupRememberMe();
			} else {
				rememberMe = true;
				$(this).addClass('on');
			}
		});

		/* RESET PASSWORD
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		// resetPasswordButton: click
		$resetPasswordButton.click(function(e) {
			e.preventDefault();

			// get e-mail storage key
			var email = $email.val() || Storage.getGlobal('email');

			// populate field
			if (email) {
				$resetPasswordEmailField.val(email);
			}

			$resetpasswordModal.modal('show');
		});
		// sendResetCodeButton: click
		$sendResetCodeButton.click(function(e) {
			e.preventDefault();

			// send reset password code
			sendResetPasswordCode($resetPasswordEmailField.val());
		});

		// submitResetCodeButton: click
		$submitResetCodeButton.click(function(e) {
			e.preventDefault();
			// submit reset password code
			submitResetPasswordCode($resetPasswordEmailField.val(), $resetPasswordCodeField.val());
		});

		// updatePasswordButton: click
		$updatePasswordButton.click(function(e) {
			e.preventDefault();
			// update password
			updatePassword($resetPasswordEmailField.val(), $resetPasswordCodeField.val(), $resetPasswordPasswordField.val());
		});

		// resetPasswordEmailField: keydown
		$resetPasswordEmailField.keydown(function(e) {

			if (e.which === 13) {
				e.preventDefault();
				// send reset password code
				sendResetPasswordCode($resetPasswordEmailField.val());
			}
		});

		// resetPasswordCodeField: keydown
		$resetPasswordCodeField.keydown(function(e) {

			if (e.which === 13) {
				e.preventDefault();
				// submit reset password code
				submitResetPasswordCode($resetPasswordEmailField.val(), $resetPasswordCodeField.val());
			}
		});

		// resetPasswordPasswordField: keydown
		$resetPasswordPasswordField.keydown(function(e) {

			if (e.which === 13) {
				e.preventDefault();
				// update password
				updatePassword($resetPasswordEmailField.val(), $resetPasswordCodeField.val(), $resetPasswordPasswordField.val());
			}
		});

		// siteGuideBackdrop: click
		$siteGuide.click(function(e) {
			hideSiteGuide();
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initLoginForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var initLoginForm = function() {

		// get e-mail storage key
		var email = Storage.getGlobal('email');

		// populate field
		if (email) {
			rememberMe = true;
			$email.val(email);
			$rememberCheckboxToggle.addClass('on');
			$password.focus();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setupRememberMe -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setupRememberMe = function() {

		if (rememberMe) {
			Storage.setGlobal('email', $email.val());
		} else {
			Storage.removeGlobal('email');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var login = function(email, password) {

		resetLoginForm();

		// send login request
		User.login(email, password, login_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetLoginForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetLoginForm = function() {

		$password.val('');

		$invalidLoginTag.hide();
		$accountExistsTag.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* startDemo -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var startDemo = function() {

		// demo login
		User.demoLogin();

		// start user app
		startApp();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewUser = function() {

		// start app with viewing user data
		startApp();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* startApp - user credentials must be available before calling
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var startApp = function() {

		// show loading status
		$loadingStatus.fadeIn();

		// hide site guide
		hideSiteGuide();

		// focus search input field
		$searchInput.focus();

		// clear view and item data
		ItemView.clearItemView();
		ItemData.resetItemData();

		// returned data
		var itemsReturnedData = null;
		var listReturnedData = null;

		// directory request promise
		var directoryRequest = ItemData.downloadItemDirectory();

		// items request promise
		var itemsRequest = ItemView.initializeUserItems(function(items) {
			itemsReturnedData = items;

		}, function() {
			itemsReturnedData = {};
		});

		// get user tags
		var tagRequest = TagView.getTags(function(data) {
			listReturnedData = data;

		}, function() {

		});

		// deferreds: wait for itemsRequest and directoryRequest
		$.when(itemsRequest, directoryRequest, tagRequest).then(

			// all ajax requests returned
			function() {

				// list result
				TagView.getTags_result(listReturnedData);

				// itemView result
				ItemView.initializeUserItems_result(itemsReturnedData);

				// hide loading status
				$loadingStatus.hide();
			},
			function() {

			}
		);
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* logout -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var logout = function(email, password) {

		// return to info view
		showInfoView();

		// clear view
		ItemView.clearItemView();

		// logout user
		User.logout();

		// start demo app
		startDemo();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* signup -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var signup = function(email, password) {

		resetLoginForm();

		// validate
		if (email !== '' && password !== '') {
			// create user
			User.createUser(email, password, signup_result);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* login_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var login_result = function(data, email) {

		// success
		if (data.status === 'success') {

			setupRememberMe();

			// show logged in view
			showUseView(email);

			// start user app
			startApp();

		// invalid login
		} else if (typeof data.status !== 'undefined' && data.status === 'invalid_login') {

			// show invalid login tag
			$invalidLoginTag.fadeIn();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* signup_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var signup_result = function(data, email) {

		// returned error status
		if (typeof data.status !== 'undefined' && data.status === 'user_exists') {

			$accountExistsTag.fadeIn();

		// success
		} else {

			setupRememberMe();

			// login new user
			login_result(data, email);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showSiteGuide -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showSiteGuide = function() {

		$siteGuide.show();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* hideSiteGuide -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var hideSiteGuide = function(item) {

		if ($siteGuide.is(':visible')) {
			$siteGuide.hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sendResetPasswordCode -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sendResetPasswordCode = function(email) {

		User.sendResetPasswordCode(email, sendResetPasswordCode_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sendResetPasswordCode_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sendResetPasswordCode_result = function(data) {

		// e-mail sent: success
		if (typeof data.status !== 'undefined' && data.status === 'success') {

			// hide previous buttons
			$sendResetCodeButton.hide();
			$submitResetCodeButton.show();

			// hide email field
			$passwordResetEmailContainer.hide();
			// show code field
			$passwordResetCodeContainer.show();

			// show success alert
			$passwordResetAlertSuccess.find('.alertTitle').text('E-mail sent:');
			$passwordResetAlertSuccess.show().find('.alertText').html('Check your e-mail and enter the <strong>3-digit code</strong> into the field above');

			$passwordResetAlertError.hide();

		// invalid e-mail address
		} else if (typeof data.status !== 'undefined' && data.status === 'invalid_email') {

			// show error alert
			$passwordResetAlertError.find('.alertTitle').text('Invalid E-mail address:');
			$passwordResetAlertError.show().find('.alertText').html('Cannot send password reset code');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* submitResetPasswordCode -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var submitResetPasswordCode = function(email, resetCode) {

		User.submitResetPasswordCode(email, resetCode, submitResetPasswordCode_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* submitResetPasswordCode_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var submitResetPasswordCode_result = function(data) {

		// show update password form
		if (typeof data.status !== 'undefined' && data.status === 'success') {

			// hide previous form and buttons
			$resetCodeForm.hide();
			$submitResetCodeButton.hide();

			// show password form and button
			$updatePasswordForm.show();
			$updatePasswordButton.show();

			// hide success alert
			$passwordResetAlertSuccess.hide();
			$passwordResetAlertError.hide();

		// incorrect code
		} else {

			$passwordResetAlertSuccess.hide();

			// show error alert
			$passwordResetAlertError.find('.alertTitle').text('Invalid code:');
			$passwordResetAlertError.show().find('.alertText').html('Reset code is incorrect, please try again');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updatePassword -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updatePassword = function(email, resetCode, newPassword) {

		User.updatePassword(email, resetCode, newPassword, function(data) {
			updatePassword_result(data, email, newPassword);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updatePassword_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updatePassword_result = function(data, email, newPassword) {

		// show update password form
		if (typeof data.status !== 'undefined' && data.status === 'success') {

			// reset modal
			resetResetPasswordModal();

			// auto populate login info
			$email.val(email);
			$password.val(newPassword);

			// auto login
			login($email.val(), $password.val());
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetResetPasswordModal -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetResetPasswordModal = function() {

		$resetpasswordModal.modal('hide');

		$sendResetCodeButton.show();
		$submitResetCodeButton.hide();
		$updatePasswordButton.hide();

		$resetCodeForm.show();
		$updatePasswordForm.hide();

		$passwordResetEmailContainer.show();
		$passwordResetCodeContainer.hide();
		$passwordResetAlertSuccess.hide();
		$passwordResetAlertError.hide();

		// clear form fields
		$resetPasswordEmailField.val('');
		$resetPasswordCodeField.val('');
		$resetPasswordPasswordField.val('');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showUseView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showUseView = function(email) {

		// set new body class
		$('body').removeClass('infoHeader');
		$('body').addClass('useHeader');

		// set user button
		$loggedInButton.find('.userEmail').text(email);

		// notify views
		ItemView.loggedInView(true);
		SearchView.loggedInView(true);

		// show user menu
		$userMenu.show();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showInfoView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showInfoView = function() {

		// set new body class
		$('body').removeClass('useHeader');
		$('body').addClass('infoHeader');

		// notify views
		ItemView.loggedInView(false);
		SearchView.loggedInView(false);

		// hide user menu
		$userMenu.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showLoginForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showLoginForm = function() {

		formType = FORM_TYPES.login;

		showForms();

		// show login submit button
		$loginSubmitButton.show();

		// hide signup submit button
		$signupSubmitButton.hide();

		// reposition back button
		$backButton.removeClass('signup');
		$backButton.addClass('login');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showSignupForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showSignupForm = function() {

		formType = FORM_TYPES.signup;

		showForms();

		// show signup submit button
		$signupSubmitButton.show();

		// hide login submit button
		$loginSubmitButton.hide();

		// reposition back button
		$backButton.removeClass('login');
		$backButton.addClass('signup');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* authenticateUser -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var authenticateUser = function() {


	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showForms -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showForms = function() {

		resetLoginForm();

		// show input form
		$loginForm.show();

		// show back button
		$backButton.show();

		if (rememberMe && $email.val() !== '') {
			$password.focus();
		} else {
			$email.focus();
		}

		// hide main form navigation
		$buttonContainer.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showFormNavigation -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showFormNavigation = function() {

		// hide input form
		$loginForm.hide();

		// hide submit buttons, back button
		$loginSubmitButton.hide();
		$signupSubmitButton.hide();
		$backButton.hide();

		// show main form navigation
		$buttonContainer.show();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* submitForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var submitForm = function(key) {

		if (key === 13 && formType === FORM_TYPES.login) {
			login($email.val(), $password.val());

		} else if (key === 13 && formType === FORM_TYPES.signup) {
			signup($email.val(), $password.val());
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showAccountManagement -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showAccountManagement = function(item) {

		resetAccountManagementForm();

		// populate fields
		var userData = User.getUserData();

		$userNameUpdateField.val(userData.userName);
		$emailUpdateField.val(userData.email);

		// show modal
		$accountManagementModal.modal('show');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateAccount -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateAccount = function() {

		resetAccountManagementForm();

		// get field values
		var password = $passwordField.val();
		var email = $emailUpdateField.val();

		// existing password provided
		if (password !== '' && email !== '') {

			var userName = $userNameUpdateField.val();
			var newPassword = $passwordUpdateField.val();

			// send update request
			User.updateUser(password, email, userName, newPassword, function(data) {



				// update success
				if (data.status === 'success') {

					// update user email
					$loggedInButton.find('.userEmail').text(email);
					$passwordField.val('');
					$passwordUpdateField.val('');

					// show alert
					$successAlert.fadeIn().find('.alertText').text('Account updated');

				// password incorrect error
				} else if (data.status === 'incorrect_password') {

					$existingPasswordGroup.addClass('error');
					$errorAlert.fadeIn().find('.alertText').text('Incorrect password');
				}

			});
		}

		// no existing password
		if (password === '') {
			// password empty error
			$existingPasswordGroup.addClass('error');
			$errorAlert.fadeIn().find('.alertText').text('Please enter existing password');
		}

		if (email === '') {
			// email empty error
			$emailGroup.addClass('error');
			$errorAlert.fadeIn().find('.alertText').text('E-mail cannot be blank');
		}

		// clear password field
		$passwordUpdateField.val('');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteAccount -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteAccount = function() {


	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetAccountManagementForm -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetAccountManagementForm = function() {

		// reset form
		$successAlert.hide();
		$errorAlert.hide();
		$existingPasswordGroup.removeClass('error');
		$emailGroup.removeClass('error');
	};


})(tmz.module('siteView'), tmz, jQuery, _);


// SEARCH VIEW
(function(SearchView, tmz, $, _, moment, ListJS) {
	"use strict";
	console.info('SearchView');

	// module references
	var DetailView = tmz.module('detailView'),
		Amazon = tmz.module('amazon'),
		GiantBomb = tmz.module('giantbomb'),
		Utilities = tmz.module('utilities'),
		GameStats = tmz.module('gameStats'),
		IGN = tmz.module('ign'),
		ReleasedList = tmz.module('releasedList'),
		ItemLinker = tmz.module('itemLinker'),

		// constants
		LIST_PROVIDERS = {'Gamestats': 0, 'IGN': 1, 'GT': 2},
		TAB_IDS = {'#searchTab': 0, '#listTab': 1},
		TIME_TO_SUBMIT_QUERY = 250,								// the number of miliseconds to wait before submiting search query
		DISPLAY_TYPE = {'List': 0, 'Icons': 1, 'Cover': 2},
		PANEL_HEIGHT_OFFSET_USE = 258,
		PANEL_HEIGHT_OFFSET_INFO = 493,
		PANEL_HEIGHT_PADDING_MAX = 5,
		PANEL_HEIGHT_PADDING_SCROLL = 13,

		// timeout
		searchFieldTimeout = null,

		// data
		searchTerms = 'skyrim',
		previousSearchTerms = '',
		searchResults = {},

		// properties
		searchProvider = Utilities.SEARCH_PROVIDERS.Amazon,
		listProvider = null,
		currentTab = TAB_IDS['#searchTab'],
		searchTabScrollPosition = 0,
		listTabScrollPosition = 0,
		searchPlatform = null,
		listPlatform = null,
		searchDisplayType = DISPLAY_TYPE.Icons,
		listDisplayType = DISPLAY_TYPE.Icons,
		panelHeightOffset = PANEL_HEIGHT_OFFSET_INFO,
		scrollSaved = false,

		// list
		itemList = null,
		listOptions = {
			valueNames: ['itemName', 'releaseDate'],
			item: 'list-item'
		},

		// node cache
		$searchContainer = $('#searchContainer'),

		$searchViewMenu = $('#searchViewMenu'),
		$searchProvider = $('#searchProvider'),
		$listProvider = $('#listProvider'),
		$searchProviderName = $searchProvider.find('.providerName'),
		$listProviderName = $listProvider.find('.providerName'),

		$searchPlatforms = $('#searchPlatforms'),
		$legacySubNav = $('#legacySubNav'),
		$platformSelectButton = $('#platformSelect_btn'),
		$listPlatforms = $('#listPlatforms'),
		$searchPlatformsName = $searchPlatforms.find('.platformName'),
		$listPlatformsName = $listPlatforms.find('.platformName'),

		$finderTabLinks = $('#finderTabLinks'),
		$finderTabContent = $('#finderTabContent'),
		$searchTab = $('#searchTab'),
		$listTab = $('#listTab'),
		$searchTabLink = $('#searchTabLink'),
		$listTabLink = $('#listTabLink'),

		$search = $('#searchField'),
		$searchButton = $('#search_btn'),
		$clearSearchButton = $('#clearSearch_btn'),
		$clearSearchIcon = $clearSearchButton.find('i'),
		$searchResultsContainer = $('#searchResultsContainer'),
		$searchResultsContent = $searchResultsContainer.find('.content'),

		$searchResults = $('#searchResults'),
		$inputField = $search.find('input'),

		$listResultsContainer = $('#listResultsContainer'),
		$listResultsContent = $listResultsContainer.find('.content'),
		$listResults = $('#listResults'),
		$listTable = $listResults.find('.list'),

		$searchDisplayOptions = $searchContainer.find('.searchDisplayOptions'),
		$listDisplayOptions = $searchContainer.find('.listDisplayOptions'),

		$searchLoadingStatus = $searchResultsContainer.find('.loadingStatus'),
		$listLoadingStatus = $listResultsContainer.find('.loadingStatus'),

		// templates
		searchResultsTemplate = _.template($('#search-results-template').html()),
		listResultsTemplate = _.template($('#list-results-template').html()),
		platformDropdownTemplate = _.template($('#search-results-platform-dropdown-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.init = function(keywords) {

		SearchView.createEventHandlers();

		// set default platform
		searchPlatform = Utilities.PLATFORM_INDEX[0];
		listPlatform = Utilities.getStandardPlatform('');

		// set default search provider
		searchProvider = Utilities.SEARCH_PROVIDERS.Amazon;

		toggleClearSearchButton(false);

		// init tooltips
		$listDisplayOptions.find('a').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		});
		$searchDisplayOptions.find('a').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		});

		// initialize nanoscroll
		var nanoScrollOptions = {
			sliderMinHeight: 20,
			iOSNativeScrolling: true,
			preventPageScrolling: true
		};
		$searchResultsContainer.nanoScroller(nanoScrollOptions);
		$listResultsContainer.nanoScroller(nanoScrollOptions);

		// update nanoscroll periodically
		setInterval(function() {

			saveNanoscrollPositions();

			$searchResultsContainer.nanoScroller();
			$listResultsContainer.nanoScroller();
		}, 1500);

		// init BDSM (bootstrap dropdown sub menu)
		$legacySubNav.BootstrapDropdownSubMenu({'$mainNav': $searchPlatforms});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.createEventHandlers = function() {

		// finder tabs: shown
		$finderTabLinks.find('a[data-toggle="tab"]').on('shown', function(e) {

			// get current tab and switch options content
			currentTab = TAB_IDS[$(e.target).attr('href')];
			finderTabChanged(currentTab);
		});

		// search field: keypress
		$inputField.keyup(inputFieldKeyUp);

		// searchProvider: change
		$searchProvider.find('li a').click(function(e) {
			e.preventDefault();
			// set attribute
			$searchProvider.attr('data-content', $(this).attr('data-content'));
			previousSearchTerms = '';

			searchProviderChanged();
		});

		// searchViewMenu .dropdown: hover
		$searchViewMenu.on('mouseenter', '.dropdown-toggle', function(e) {

			var that = this;

			// if dropdown open trigger click on .dropdown
			$searchViewMenu.find('.dropdown').each(function() {

				if ($(this).hasClass('open') && $(this).find('.dropdown-toggle').get(0) !== $(that).get(0)) {
					$(that).trigger('click');
				}
			});
		});

		// listProvider: change
		$listProvider.find('li a').click(function(e) {
			e.preventDefault();
			// set attribute
			$listProvider.attr('data-content', $(this).attr('data-content'));
			listProviderChanged();
		});

		// listPlatforms: change
		$listPlatforms.find('li a').click(function(e) {
			e.preventDefault();
			changeListPlatform($(this).attr('data-content'), $(this).text());
		});

		// searchPlatforms: change
		$searchPlatforms.find('li:not(.dropdown-sub) a').click(function(e) {
			e.preventDefault();
			changeSearchPlatform($(this).attr('data-content'), $(this).text());
		});

		// search results: click
		$searchResults.on('click', 'tr', searchResultItem_onClick);

		// list results: click
		$listResults.on('click', 'tr', listResultItem_onClick);

		// dropdown menu > li: click
		$searchResults.on('click', '.dropdown-menu li', function(e) {
			e.preventDefault();
			selectPlatform(this);
		});

		// searchDisplayType toggle
		$searchDisplayOptions.on('click', 'a', function(e) {
			e.preventDefault();
			changeDisplayType($(this).attr('data-content'));
		});
		// listDisplayType toggle
		$listDisplayOptions.on('click', 'a', function(e) {
			e.preventDefault();

			// only allow changes for provider which has multiple views (upcoming/released games)
			if (listProvider == LIST_PROVIDERS.IGN || listProvider == LIST_PROVIDERS.GT) {
				changeDisplayType($(this).attr('data-content'));
			}
		});

		// search button: click
		$searchButton.click(function(e) {
			e.preventDefault();

			SearchView.search(searchTerms);
		});

		// clear search button: click
		$clearSearchButton.click(function(e) {
			$inputField.val('');
			$inputField.focus();
			toggleClearSearchButton(false);
		});

		// window, searchResults: resized
		$searchResults.resize(SearchView.resizePanel);
		$listResults.resize(SearchView.resizePanel);
		$(window).resize(SearchView.resizePanel);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderSearchResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.renderSearchResults = function(items) {

		// hide loading status
		$searchLoadingStatus.stop().hide();

		var sortedSearchResults = [];

		// generate sorted items array
		_.each(items, function(item, key) {
			sortedSearchResults.push(item);
		});

		// sort results
		sortedSearchResults.sort(sortItemsByDate);

		// get model data
		var templateData = {'sortedSearchResults': sortedSearchResults};

		// add searchDisplayType to templateData
		templateData.displayType = searchDisplayType;

		// output data to template
		$searchResults.html(searchResultsTemplate(templateData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderListResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.renderListResults = function(items, order) {

		// hide loading status
		$listLoadingStatus.stop().hide();

		// get model data
		var templateData = {'listResults': items};

		// output data to template
		$listTable.append(listResultsTemplate(templateData));

		// update list.js for item list
		itemList = new ListJS('listResultsContainer', listOptions);

		// sort using current sort method
		if (order === 'asc') {
			itemList.sort('releaseDate', {sortFunction: releaseDateSortAsc});
		} else {
			itemList.sort('releaseDate', {sortFunction: releaseDateSortDesc});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* search
	* @param {string} keywords
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.search = function(keywords) {

		if (keywords === '') {
			toggleClearSearchButton(false);
		} else {
			toggleClearSearchButton(true);
		}

		// change finder tab to search if not on search tab
		if (currentTab !== TAB_IDS['#searchTab']) {

			// manually toggle search tab
			$searchTabLink.trigger('click');
			finderTabChanged(TAB_IDS['#searchTab']);
		}

		// don't search previous search terms
		if (keywords !== previousSearchTerms) {

			// show loading status
			$searchResultsContainer.find('.noResults').hide();
			$searchLoadingStatus.fadeIn();

			previousSearchTerms = keywords;

			// search based on search provider
			switch (searchProvider) {

				// amazon
				case Utilities.SEARCH_PROVIDERS.Amazon:
					Amazon.searchAmazon(keywords, searchPlatform.amazon, searchAmazon_result);
					break;

				// giantbomb
				case Utilities.SEARCH_PROVIDERS.GiantBomb:
					GiantBomb.searchGiantBomb(keywords, searchGiantBomb_result);
					break;
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGamestatsPopularityListByPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getGamestatsPopularityListByPlatform = function(platform) {

		$listLoadingStatus.fadeIn();

		// clear listTable
		$listTable.empty();

		// get popular games
		GameStats.getPopularGamesListByPlatform(platform.gamestats, getList_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getIGNUpcomingListByPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getIGNUpcomingListByPlatform = function(platform) {

		$listLoadingStatus.fadeIn();

		// clear listTable
		$listTable.empty();

		// get upcoming games (page 1)
		IGN.getUpcomingGames(platform.ign, 0, function(data) {

			// parse page 0 result
			listResult(data);

			// get upcoming games (page 2)
			IGN.getUpcomingGames(platform.ign, 1, listResult);
		});

		function listResult(data) {
			getList_result(data, 'asc');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getReleasedList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getReleasedList = function(platform) {

		var numberOfWeeks = 24;

		$listLoadingStatus.fadeIn();

		// clear listTable
		$listTable.empty();

		// get current date (start of week)
		var startWeek = moment().day(0);

		// get released games
		ReleasedList.getReleasedGames(startWeek.year(), startWeek.month() + 1, startWeek.date(), function(data) {

			// parse latest week result
			listResult(data);

			// get up to numberOfWeeks previous releases
			var previousWeek = startWeek;
			for (var i = 0, len = numberOfWeeks; i < len; i++) {

				previousWeek = previousWeek.subtract('weeks', 1);
				ReleasedList.getReleasedGames(previousWeek.year(), previousWeek.month() + 1, previousWeek.date(), listResult);
			}
		});

		function listResult(data) {
			getList_result(data, 'desc');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resizePanel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.resizePanel = function() {

		var resultsHeight = null;
		var $container = null;


		switch(currentTab) {
			case TAB_IDS['#searchTab']:

				resultsHeight = $searchResults.height();
				$container = $searchResultsContainer;

				// add loading status height if visible
				if ($searchLoadingStatus.is(':visible')) {
					resultsHeight += $searchLoadingStatus.height();
				}
				break;

			case TAB_IDS['#listTab']:

				resultsHeight = $listResults.height();

				// add loading status height if visible
				if ($listLoadingStatus.is(':visible')) {
					resultsHeight += $listLoadingStatus.height();
				}
				$container = $listResultsContainer;
				break;
		}

		var windowHeight = $(window).height();

		// panel does not require shrinking
		if (resultsHeight < windowHeight - panelHeightOffset) {
			$container.css({'height': resultsHeight + PANEL_HEIGHT_PADDING_MAX});

		// shrink panel to match window height
		} else {
			var constrainedHeight = windowHeight - panelHeightOffset;
			$container.css({'height': constrainedHeight + PANEL_HEIGHT_PADDING_SCROLL});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loggedInView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.loggedInView = function(isLoggedIn) {

		if (isLoggedIn) {
			panelHeightOffset = PANEL_HEIGHT_OFFSET_USE;
		} else {
			panelHeightOffset = PANEL_HEIGHT_OFFSET_INFO;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getList_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getList_result = function(data, order) {

		// render list
		SearchView.renderListResults(data, order);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazon_result - results callback from search()
	* @param {object} data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchAmazon_result = function(data) {
		// local properties
		var	filtered = false;
		var tempSearchResults = {};
		var searchItem = {};

		/* sortedArray and searchResults cache construction
		~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
		// iterate xml results, filter results and construct search results array
		$('Item', data).each(function() {

			// parse amazon result item and get back filtered status, add data to searchItem
			searchItem = Amazon.parseAmazonResultItem($(this));

			// add temp results object
			if (typeof searchItem.isFiltered === 'undefined') {

				// save item in search results cache under ASIN key
				tempSearchResults[searchItem.id] = searchItem;
			}
		});

		// set tempSearchResults to searchResults data
		searchResults = tempSearchResults;

		// renderSearchResults results
		SearchView.renderSearchResults(searchResults);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchGiantBomb_result - results callback from search()
	* @param {object} data
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchGiantBomb_result = function(data) {

		var results = data.results;
		var tempSearchResults = {};
		var searchItem = {};

		// iterate results array
		for (var i = 0, len = results.length; i < len; i++) {

			// parse result item and set searchItem
			searchItem = GiantBomb.parseGiantBombResultItem(results[i]);

			// get platform information for each item by gbombID
			GiantBomb.getGiantBombItemPlatform(searchItem.gbombID, getGiantBombItemPlatform_result);

			// save item in search results cache under ASIN key
			tempSearchResults[searchItem.id] = searchItem;
		}

		// set tempSearchResults to searchResults data
		searchResults = tempSearchResults;

		// renderSearchResults results
		SearchView.renderSearchResults(searchResults);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemPlatform_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItemPlatform_result = function(data, gbombID) {

		var platforms = data.results.platforms;
		var platformList = [];
		var standardPlatform = '';

		for (var i = 0, len = platforms.length; i < len; i++) {

			// standardize platform names
			standardPlatform = Utilities.matchPlatformToIndex(platforms[i].name).name || platforms[i].name;

			platformList.push(standardPlatform);
		}

		// add platform drop down to item results
		addPlatformDropDown(gbombID, platformList);

		// get searchItem from model and save platform list to searchItem
		var searchItem = SearchView.getSearchResult(gbombID);
		searchItem['platformList'] = platformList;

		// set default platform
		searchItem.platform = platformList[0];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addPlatformDropDown -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addPlatformDropDown = function(gbombID, platformList) {

		var templateData = {'platformList': platformList, 'gbombID': gbombID};

		// attach to existing result row
		$('#' + gbombID).find('.platformDropdown').html(platformDropdownTemplate(templateData));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortItemsByDate -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortItemsByDate = function(a, b) {

		var date1 = Date.parse(a.releaseDate);
		var date2 = Date.parse(b.releaseDate);

		return date2 - date1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getSearchResult
	* @param {string} asin
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	SearchView.getSearchResult = function(id) {

		return searchResults[id];
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* finderTabChanged -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var finderTabChanged = function(tab) {

		switch(tab) {

			// search tab
			case 0:

				// scroll to previous location - if location is same where it left off chrome won't scrollTo (buggy) so we -1
				$searchResultsContainer.nanoScroller({scrollTop:searchTabScrollPosition - 1});

				showSearchOptions(true);
				showListOptions(false);
				searchProviderChanged();
				break;

			// list tab
			case 1:

				// scroll to previous location - if location is same where it left off chrome won't scrollTo (buggy) so we -1
				$listResultsContainer.nanoScroller({scrollTop:parseInt(listTabScrollPosition - 1, 10)});

				showListOptions(true);
				showSearchOptions(false);
				listProviderChanged();
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchProviderChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchProviderChanged = function() {

		var providerID = $searchProvider.attr('data-content');

		switch(providerID) {
			case '0':
				searchProvider = Utilities.SEARCH_PROVIDERS.Amazon;
				// set title
				$searchProviderName.text('Amazon');
				// show platform list
				$searchPlatforms.show();
				break;
			case '1':
				searchProvider = Utilities.SEARCH_PROVIDERS.GiantBomb;
				// set title
				$searchProviderName.text('GiantBomb');
				// show platform list
				$searchPlatforms.hide();
				break;
		}

		// run search with new search provider
		SearchView.search(searchTerms);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* listProviderChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var listProviderChanged = function() {

		var providerID = parseInt($listProvider.attr('data-content'), 10);

		// update list if provider changed
		if (providerID !== listProvider) {

			switch(providerID) {

				// popular games
				case 0:
					// disable display options and set to list

					// EXCEPTION:
					// do not update listDisplayType as popular list cannot have any other view
					changeDisplayType(0, true);
					$listDisplayOptions.fadeTo(100, 0.35);

					// set title
					$listProviderName.text('Popular');

					listProvider = LIST_PROVIDERS.Gamestats;
					break;

				// upcoming games
				case 1:

					// set toggle button and enable display options
					changeDisplayType(listDisplayType);
					$listDisplayOptions.find('button:eq(' + listDisplayType + ')').button('toggle');
					$listDisplayOptions.fadeTo(100, 1);

					// set title
					$listProviderName.text('Upcoming');

					listProvider = LIST_PROVIDERS.IGN;
					break;

				// released games
				case 2:

					// set toggle button and enable display options
					changeDisplayType(listDisplayType);
					$listDisplayOptions.find('button:eq(' + listDisplayType + ')').button('toggle');
					$listDisplayOptions.fadeTo(100, 1);

					// set title
					$listProviderName.text('Released');

					listProvider = LIST_PROVIDERS.GT;
					break;
			}

			// update list for new
			getList(listProvider);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeListPlatform
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeListPlatform = function(platform, name) {

		// set platform name
		$listPlatformsName.text(name);

		// set platform object
		listPlatform = Utilities.getStandardPlatform(platform);

		// get game lists
		getList(listProvider);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeSearchPlatform
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeSearchPlatform = function(platform, name) {

		previousSearchTerms = '';

		// set platform name
		$searchPlatformsName.text(name);

		// set platform object
		searchPlatform = Utilities.getStandardPlatform(platform);

		// do search with new platform
		SearchView.search(searchTerms);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showTab -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showTab = function(tab) {

		switch (tab) {
			case 0:
				$searchTabLink.tab('show');
				break;

			case 1:
				$listTabLink.tab('show');
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getList = function(listProvider) {

		switch (listProvider) {
			case LIST_PROVIDERS.Gamestats:
				SearchView.getGamestatsPopularityListByPlatform(listPlatform);
				break;

			case LIST_PROVIDERS.IGN:
				SearchView.getIGNUpcomingListByPlatform(listPlatform);
				break;

			case LIST_PROVIDERS.GT:
				SearchView.getReleasedList(listPlatform);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showSearchOptions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showSearchOptions = function(show) {

		if (show) {
			$searchDisplayOptions.show();
			$searchPlatforms.show();
			$searchProvider.show();

		} else {
			$searchDisplayOptions.hide();
			$searchPlatforms.hide();
			$searchProvider.hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showListOptions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showListOptions = function(show) {

		if (show) {
			$listDisplayOptions.show();
			$listPlatforms.show();
			$listProvider.show();

		} else {
			$listDisplayOptions.hide();
			$listPlatforms.hide();
			$listProvider.hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeDisplayType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeDisplayType = function(displayType, doNotUpdateCurrentDisplayType) {

		// change #searchResults or #listResults tbody class based on current tab
		if (currentTab === TAB_IDS['#searchTab']) {
			searchDisplayType = displayType;
			$searchResults.find('tbody').removeClass().addClass('display-' + displayType);

		// check if the actual element has the displayType class
		} else if ($listResults.find('tbody').hasClass('display-' + displayType) === false) {

			// this is so popular list does not define the view for upcoming list
			if (typeof doNotUpdateCurrentDisplayType === 'undefined') {
				listDisplayType = displayType;
			}
			$listResults.find('tbody').removeClass().addClass('display-' + displayType);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchFieldTrigger
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchFieldTrigger = function() {

		clearTimeout(searchFieldTimeout);
		SearchView.search(searchTerms);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* inputFieldKeyUp
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var inputFieldKeyUp = function(event) {

		// get search value
		searchTerms = $inputField.val();

		if (searchFieldTimeout) {
			clearTimeout(searchFieldTimeout);
		}

		// enter key, run query immediately
		if (event.which == 13) {
			SearchView.search(searchTerms);

		// start search timer - only if key not delete or backspace
		} else {
			searchFieldTimeout = setTimeout(searchFieldTrigger, TIME_TO_SUBMIT_QUERY);
		}
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchResultItem_onClick
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var searchResultItem_onClick = function() {

		var searchResult = SearchView.getSearchResult($(this).attr('id'));

		// show item detail
		DetailView.viewFirstSearchItemDetail(searchResult);
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* listResultItem_onClick
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var listResultItem_onClick = function() {

		// save scroll position for active tab
		saveNanoscrollPositions();

		// get search text and standardize
		searchTerms = ItemLinker.standardizeTitle($(this).find('.itemName').text());

		// show search tab
		showTab(TAB_IDS['#searchTab']);

		// set search input field
		$inputField.val(searchTerms);

		// change searchPlatform to listPlatform
		changeSearchPlatform(listPlatform.id);

		// start search for clicked item text
		SearchView.search(searchTerms);
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* selectPlatform
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectPlatform = function(element) {

		// assign platform to searchItem and relaunch detail view
		var searchResult = SearchView.getSearchResult($(element).attr('data-content'));
		searchResult.platform = $(element).find('a').text();

		// get title element
		$(element).parent().siblings('.dropdown-toggle').html(searchResult.platform).append('<b class="caret"></b>');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * toggleClearSearchButton -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var toggleClearSearchButton = function(toggle) {

		if (toggle) {
			$clearSearchIcon.show();
			$clearSearchButton.addClass('hover');
		} else {
			$clearSearchIcon.hide();
			$clearSearchButton.removeClass('hover');
		}
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * saveNanoscrollPositions -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var saveNanoscrollPositions = function() {

		// save scroll position for active tab
		if (currentTab === TAB_IDS['#searchTab']) {
			// never save 0 as location - since we are always -1 from final scrollTo value
			searchTabScrollPosition = $searchResultsContent.scrollTop() || 1;
		} else if (currentTab === TAB_IDS['#listTab']) {
			listTabScrollPosition = $listResultsContent.scrollTop() || 1;
		}
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateSortAsc -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateSortAsc = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.releaseDate');
		var $element2 = $(secondItem.elm).find('.releaseDate');

		var date1 = Date.parse($element1.text());
		var date2 = Date.parse($element2.text());

		return date1 - date2;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateSortDesc -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateSortDesc = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.releaseDate');
		var $element2 = $(secondItem.elm).find('.releaseDate');

		var date1 = Date.parse($element1.text());
		var date2 = Date.parse($element2.text());

		return date2 - date1;
	};

})(tmz.module('searchView'), tmz, jQuery, _, moment, List);

// DETAIL VIEW
(function(DetailView, tmz, $, _, moment) {

	console.info('detailView');

    // module references
    var User = tmz.module('user'),
		TagView = tmz.module('tagView'),
		Utilities = tmz.module('utilities'),
		SearchView = tmz.module('searchView'),
		ItemView = tmz.module('itemView'),
		ItemData = tmz.module('itemData'),
		Amazon = tmz.module('amazon'),
		ItemLinker = tmz.module('itemLinker'),
		Metacritic = tmz.module('metacritic'),
		GiantBomb = tmz.module('giantbomb'),
		Wikipedia = tmz.module('wikipedia'),
		GameTrailers = tmz.module('gameTrailers'),
		VideoPanel = tmz.module('videoPanel'),

		// constants
		TAB_IDS = ['#amazonTab', '#giantBombTab'],
		GAME_STATUS = {0: 'None', 1: 'Own', 2: 'Sold', 3: 'Wanted'},
		PLAY_STATUS = {0: 'Not Started', 1: 'Playing', 2: 'Played', 3: 'Finished'},
		ITEM_TYPES = {'NEW': 0, 'EXISTING': 1},

		// properties
		hasRendered = false,
		currentProvider = null,
		saveInProgress = false,
		currentTab = TAB_IDS[0],
		currentID = null,
		currentItemHasVideo = false,
		itemType = ITEM_TYPES.NEW,

		// timeout
		itemDetailInfoTimeOut = null,

		// data
		firstItem = {},			// current item data (first)
		secondItem = {},		// current item data (second)
		itemAttributes = {},	// current item attributes

		// ajax requests
		metascoreRequest = null,
		addItemToTagRequest = null,

		// node cache
		$detailTabContent = $('#detailTabContent'),
		$amazonTab = $('#amazonTab'),
		$giantBombTab = $('#giantBombTab'),
		$amazonTabLink = $('#amazonTabLink'),
		$giantBombTabLink = $('#giantBombTabLink'),
		$amazonItemDetailThumbnail = $amazonTab.find('.itemDetailThumbnail'),
		$giantbombItemDetailThumbnail = $giantBombTab.find('.itemDetailThumbnail'),
		$amazonItemDetailInfo = $amazonItemDetailThumbnail.find('.itemDetailInfo'),
		$giantbombItemDetailInfo = $giantbombItemDetailThumbnail.find('.itemDetailInfo'),
		$showVideoButton = $detailTabContent.find('.showVideo_btn'),
		$showDiscussionButton = $detailTabContent.find('.showDiscussion_btn'),

		$detailContainer = $('#detailContainer'),

		$addListContainer = $('#addListContainer'),
		$addList = $('#addList'),
		$saveItemButton = $('#saveItem_btn'),
		$addItemButton = $('#addItem_btn'),

		// node cache: data fields
		$itemAttributes = $('#itemAttributes'),
		$platform = $('#platform'),
		$releaseDate = $('#releaseDate'),
		$wikipediaPage = $('#wikipediaPage'),
		$giantBombPage = $('#giantBombPage'),
		$metacriticPage = $('#metacriticPage'),

		$amazonPriceHeader = $itemAttributes.find('#amazonPriceHeader'),
		$amazonPriceNew = $itemAttributes.find('#amazonPriceNew'),
		$amazonPriceUsed = $itemAttributes.find('#amazonPriceUsed'),

		// node cache: custom attributes
		$gameStatus = $('#gameStatus'),
		$playStatus = $('#playStatus'),
		$userRating = $('#userRating'),
		$ratingCaption = $('#ratingCaption'),

		// templates
		modalTemplate = _.template($('#description-modal-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.init = function() {

		// create event handlers
		DetailView.createEventHandlers();

		// hide save button
		$saveItemButton.hide();

		// hide detail panel attributes
		$itemAttributes.hide();
		hideAsynchronousDetailAttributes();

		// intialize star rating plugin
		$userRating.stars({
			split: 2,
			captionEl: $ratingCaption,
			callback: function(ui, type, value) {

				// set userRating attribute
				firstItem.userRating = value;

				// save changes
				saveAttributes(firstItem);
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.createEventHandlers = function() {

		// amazonTabLink: click
		$amazonTabLink.click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			showTab(Utilities.SEARCH_PROVIDERS.Amazon);
		});

		// giantBombTabLink: click
		$giantBombTabLink.click(function(e) {
			e.preventDefault();
			e.stopPropagation();

			showTab(Utilities.SEARCH_PROVIDERS.GiantBomb);
		});

		// showVideoButton: click
		$showVideoButton.click(function(e) {
			e.preventDefault();

			if (currentItemHasVideo) {
				VideoPanel.showVideoPanel();

			// show no video message
			} else {

			}
		});

		// showDiscussionButton: click
		$showDiscussionButton.click(function(e) {
			e.preventDefault();

			// load disqus for item
			showDiscussion();
		});

		// amazonItemDetailThumbnail: click
		$amazonItemDetailThumbnail.click(function(e) {

		});

		// giantbombItemDetailThumbnail: click
		$giantbombItemDetailThumbnail.click(function(e) {

		});

		// amazonItemDetailThumbnail: mouseover
		$amazonItemDetailThumbnail.mouseenter(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			itemDetailInfoTimeOut = setTimeout(function() {
				$amazonItemDetailInfo.stop().fadeIn();
			}, 250);
		});

		// amazonItemDetailThumbnail: mouseout
		$amazonItemDetailThumbnail.mouseleave(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			$amazonItemDetailInfo.stop().fadeOut();
		});

		// giantbombItemDetailThumbnail: mouseover
		$giantbombItemDetailThumbnail.mouseenter(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			itemDetailInfoTimeOut = setTimeout(function() {
				$giantbombItemDetailInfo.stop().fadeIn();
			}, 250);
		});

		// giantbombItemDetailThumbnail: mouseout
		$giantbombItemDetailThumbnail.mouseleave(function(e) {

			if (itemDetailInfoTimeOut) {
				clearTimeout(itemDetailInfoTimeOut);
			}

			$giantbombItemDetailInfo.stop().fadeOut();
		});

		// saveItem_btn: click
		$saveItemButton.click(function(e) {
			e.preventDefault();
			saveItemChanges(firstItem);
		});

		// addItem_btn: click
		$addItemButton.click(function(e) {
			e.preventDefault();
			saveItemChanges(firstItem);
		});

		// gameStatus: select
		$gameStatus.find('li a').click(function(e) {
			e.preventDefault();

			// set gameStatus attribute
			firstItem.gameStatus = $(this).attr('data-content');
			$gameStatus.find('.currentSelection').text(GAME_STATUS[firstItem.gameStatus]);

			// save changes
			saveAttributes(firstItem);
		});

		// playStatus: select
		$playStatus.find('li a').click(function(e) {
			e.preventDefault();

			// set playStatus attribute
			firstItem.playStatus = $(this).attr('data-content');
			$playStatus.find('.currentSelection').text(PLAY_STATUS[firstItem.playStatus]);

			// save changes
			saveAttributes(firstItem);
		});

		// tabs: shown
		$('#detailTab a[data-toggle="tab"]').on('shown', function (e) {
			currentTab = $(e.target).attr('href');
		});

		// addList: change
		$addList.change(addListChanged);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * viewFirstSearchItemDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    DetailView.viewFirstSearchItemDetail = function(searchItem) {

		// only view item detail if new item or platform for item has changed
		if (searchItem.id !== firstItem.id || searchItem.platform !== firstItem.platform) {

			// hide information until update query returns
			hideAsynchronousDetailAttributes();

			// clone object as firstItem
			firstItem = $.extend(true, {}, searchItem);

			// figure out search provider for current item
			currentProvider = getItemProvider(firstItem.asin, firstItem.gbombID);

			// add first provider to item data
			firstItem.initialProvider = currentProvider;

			// add standard name propery
			firstItem.standardName = ItemLinker.standardizeTitle(firstItem.name);

			// get item attributes data
			itemAttributes = ItemData.getItemByThirdPartyID(firstItem.gbombID, firstItem.asin);

			// set current viewing id
			currentID = firstItem.id;

			// clear secondItem model
			clearSecondItemModel(currentProvider);

			// show detail tab for initial provider
			showTab(currentProvider);

			// find item on alernate provider and view item as second search item
			ItemLinker.findItemOnAlternateProvider(firstItem, currentProvider, function(id) {
				return function(item) {
					viewSecondSearchItemDetail(item, id);
				};
			}(currentID));

			// display tags
			loadAndDisplayTags(firstItem, itemAttributes);

			// load user attributes
			loadAndDisplayUserAttributes(firstItem, itemAttributes);

			// load third party data
			loadThirdPartyData(firstItem);

			// call main view detail method
			viewSearchDetail(firstItem, currentProvider, 0);
		}
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewItemDetail = function(item) {

		// hide information until update query returns
		hideAsynchronousDetailAttributes();

		// existing item - list add button renamed to ITEM_TYPES.EXISTING
		setItemType(ITEM_TYPES.EXISTING);

		// clone object as firstItem
		firstItem = $.extend(true, {}, item);

		// add standard name propery
		firstItem.standardName = ItemLinker.standardizeTitle(firstItem.name);

		// get first provider for item
		// convert to  integer for comparison to provider constants
		currentProvider = parseInt(firstItem.initialProvider, 10);

		// get item attributes data
		itemAttributes = ItemData.getDirectoryItemByItemID(firstItem.itemID);

		// set current viewing id
		currentID = firstItem.id;

		// clear secondItem model
		clearSecondItemModel(currentProvider);

		// show detail tab for initial provider
		showTab(currentProvider);

		// start download of linked item data
		ItemLinker.getLinkedItemData(firstItem, currentProvider, DetailView.viewSecondItemDetail);

		// load tags
		TagView.selectTagsFromDirectory(itemAttributes.tags);

		// display attributes
		loadAndDisplayUserAttributes(firstItem, itemAttributes);

		// load third party data
		loadThirdPartyData(firstItem);

		// finish tasks for viewing items
		completeViewItemDetail(firstItem, currentProvider, 0, item);
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSecondItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.viewSecondItemDetail = function(item) {

		// clone object as secondItem
		secondItem = $.extend(true, {}, item);
		var provider = null;

		// make sure that the second item matches the first
		// fast clicking of view items can cause a desync of item rendering
		if (firstItem.asin == secondItem.asin || firstItem.gbombID == secondItem.gbombID) {
			// figure out provider for current item
			provider = getItemProvider(secondItem.asin, secondItem.gbombID);

			// finish tasks for viewing items
			completeViewItemDetail(secondItem, provider, 1);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.resetDetail = function(item) {

		// reset add list
		TagView.resetAddList();

		setItemType(ITEM_TYPES.NEW);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getViewingItemID -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	DetailView.getViewingItemID = function() {

		return firstItem.id;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadThirdPartyData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadThirdPartyData = function(item) {
	
		// get wikipedia page
		Wikipedia.getWikipediaPage(item.standardName, item, displayWikipediaAttribute);

		// get metascore
		getMetascore(item.standardName, item, false);

		// get gametrailers page
		GameTrailers.getGametrailersPage(item.standardName);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSecondSearchItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewSecondSearchItemDetail = function(searchItem, linkedID) {

		// clone object as secondItem
		var secondItem = $.extend(true, {}, searchItem);


		if (currentID === linkedID) {

			// figure out search provider for current item
			var provider = getItemProvider(secondItem.asin, secondItem.gbombID);

			// extend firstItem with second provider 3rd party id
			switch (provider) {
				case Utilities.SEARCH_PROVIDERS.Amazon:
					firstItem.asin = secondItem.asin;
					break;

				case Utilities.SEARCH_PROVIDERS.GiantBomb:
					firstItem.gbombID = secondItem.gbombID;
					break;
			}

			// call main view detail method
			viewSearchDetail(secondItem, provider, 1);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewSearchDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewSearchDetail = function(item, provider, detailPhase) {

		// update model item for provider
		renderDetail(provider, item);

		// update data panel
		updateDataPanel(item, detailPhase);

		// get item details
		getProviderSpecificItemDetails(provider, firstItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* completeViewItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var completeViewItemDetail = function(item, provider, detailPhase, sourceItem) {

		// update model item for provider
		renderDetail(provider, item);

		// update data panel
		updateDataPanel(firstItem, detailPhase);

		// get item details
		getProviderSpecificItemDetails(provider, firstItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * renderTabDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var renderTabDetail = function(itemData, $tab) {

		// render detail
		$tab.find('.itemDetailTitle h3').text(itemData.name);
		$tab.find('img').attr('src', itemData.largeImage);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showDiscussion -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var showDiscussion = function() {

		// change item panel view mode to discussion
		ItemView.viewDiscussion();

		var identifier = firstItem.standardName;

		DISQUS.reset({
			reload: true,
			config: function () {
			this.page.identifier = identifier;
			this.page.url = 'http://www.gamedex.net/#!' + identifier;
			}
		});
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateDataPanel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateDataPanel = function(item, detailPhase) {

		if (!$itemAttributes.is(':visible')) {
			$itemAttributes.fadeIn();
		}

		// update platform for first phase only
		if (item.platform !== 'n/a' || detailPhase === 0) {
			$platform.find('.data').text(item.platform);
		}

		// use best releaseDate
		if (item.releaseDate !== '1900-01-01') {

			// always render first phase, after that, only update if first release date is not available
			if (detailPhase === 0 || firstItem.releaseDate === '1900-01-01') {

				// update release dates for primary item
				firstItem.releaseDate = item.releaseDate;
				firstItem.calendarDate = moment(item.releaseDate, "YYYY-MM-DD").calendar();
				$releaseDate.find('.data').text(firstItem.calendarDate);
			}

		// set date display as unknown
		} else if (firstItem.releaseDate === '1900-01-01') {
			$releaseDate.find('.data').text('unknown');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderDetail - render to corresponding tab based on provider
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var renderDetail = function(provider, item) {

		// show hidden elements for first rendering
		if (!hasRendered) {
			$('#dataTab').show();
			$('.detailTitleBar').show();
			hasRendered = true;
		}

		switch (provider) {
			case Utilities.SEARCH_PROVIDERS.Amazon:

				renderTabDetail(item, $amazonTab);
				break;

			case Utilities.SEARCH_PROVIDERS.GiantBomb:

				renderTabDetail(item, $giantBombTab);
				break;
		}
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * clearDetail -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var clearDetail = function($tab) {

		// clear detail
		$tab.find('.itemDetailTitle h3').text('No Match found');
		$tab.find('img').attr('src', 'http://d2sifwlm28j6up.cloudfront.net/no_selection_placeholder.png');
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMetascore = function(title, item, fromSearch) {

		var metascoreSelector = '';

		// hide old metascore on each tab
		for (var i = 0, len = TAB_IDS.length; i < len; i++) {

			metascoreSelector = TAB_IDS[i] + ' .metascore';
			$(metascoreSelector).hide();
		}

		// fetch metascore
		metascoreRequest = Metacritic.getMetascore(title, item, fromSearch, getMetascore_result);

		// get metascore result
		function getMetascore_result(item) {

			// ignore results which do not match currently viewing item
			if (currentID === item.id || currentID === item.asin || currentID === item.gbombID) {

				// show metascore on each tab
				for (var i = 0, len = TAB_IDS.length; i < len; i++) {

					metascoreSelector = TAB_IDS[i] + ' .metascore';

					// add metascore info to item detail
					Metacritic.displayMetascoreData(item.metascorePage, item.metascore, metascoreSelector);

					// show page in detail attributes
					$metacriticPage.show();
					$metacriticPage.find('a').attr('href', 'http://www.metacritic.com' + item.metascorePage);
				}
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayWikipediaAttribute -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayWikipediaAttribute = function(wikipediaURL) {

		$wikipediaPage.show();
		$wikipediaPage.find('a').attr('href', wikipediaURL);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getProviderSpecificItemDetails -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getProviderSpecificItemDetails = function(provider, item) {

		switch (provider) {
			// amazon price details
			case Utilities.SEARCH_PROVIDERS.Amazon:
				Amazon.getAmazonItemOffers(item.asin, item, amazonItemOffers_result);
				break;

			// giantbomb detail
			case Utilities.SEARCH_PROVIDERS.GiantBomb:
				GiantBomb.getGiantBombItemData(item.gbombID, giantBombItemData_result);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* amazonItemOffers_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var amazonItemOffers_result = function(offers) {

		// update data panel information
		if (offers.buyNowPrice !== '' || offers.lowestUsedPrice !== '') {
			$amazonPriceHeader.show();
		}

		// new price
		if (offers.buyNowPrice !== '') {
			$amazonPriceNew.find('a').attr('href', offers.productURL);
			$amazonPriceNew.find('.data').text(offers.buyNowPrice);
			$amazonPriceNew.show();
		} else {
			$amazonPriceNew.hide();
		}

		// used price
		if (offers.lowestUsedPrice !== '') {
			$amazonPriceUsed.find('.data').text(offers.lowestUsedPrice);
			$amazonPriceUsed.find('a').attr('href', offers.offersURLUsed);
			$amazonPriceUsed.show();
		} else {
			$amazonPriceUsed.hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* giantBombItemData_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var giantBombItemData_result = function(itemDetail) {

		// update giantbomb page url
		$giantBombPage.show();
		$giantBombPage.find('a').attr('href', itemDetail.site_detail_url);

		// video config
		configureVideos(itemDetail.videos);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* configureVideos -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var configureVideos = function(giantbombVideos) {

		// has giantbombVideos
		if (giantbombVideos.length !== 0) {
			// render video results
			VideoPanel.renderVideoModal(giantbombVideos);

			currentItemHasVideo = true;
			$showVideoButton.removeClass('noVideos');
			$showVideoButton.find('span').text('Show Videos');

		// no giantbombVideos
		} else {
			currentItemHasVideo = false;
			$showVideoButton.addClass('noVideos');
			$showVideoButton.find('span').text('No Videos');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showTab -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showTab = function(provider) {

		switch (provider) {
			case Utilities.SEARCH_PROVIDERS.Amazon:
				// attach detailContainer to item detail info
				$amazonItemDetailInfo.append($detailContainer);
				$amazonTabLink.tab('show');
				break;

			case Utilities.SEARCH_PROVIDERS.GiantBomb:
				// attach detailContainer to item detail info
				$giantbombItemDetailInfo.append($detailContainer);
				$giantBombTabLink.tab('show');
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* hideAsynchronousDetailAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var hideAsynchronousDetailAttributes = function() {

		$wikipediaPage.hide();
		$giantBombPage.hide();
		$metacriticPage.hide();

		$amazonPriceHeader.hide();
		$amazonPriceNew.hide();
		$amazonPriceUsed.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearSecondItemModel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearSecondItemModel = function(provider) {

		switch (provider) {
			case Utilities.SEARCH_PROVIDERS.Amazon:
				clearDetail($giantBombTab);
				break;

			case Utilities.SEARCH_PROVIDERS.GiantBomb:
				clearDetail($amazonTab);
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItemProvider -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItemProvider = function(asin, gbombID) {

		var provider = null;

		// amazon data found
		if (asin !== 0) {
			provider = Utilities.SEARCH_PROVIDERS.Amazon;

		// giantbomb data found
		} else if (gbombID !== 0) {
			provider = Utilities.SEARCH_PROVIDERS.GiantBomb;
		}

		return provider;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setItemType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setItemType = function(type) {

		// item exists with tags
		if (type === ITEM_TYPES.EXISTING) {

			itemType = ITEM_TYPES.EXISTING;
			$addItemButton.hide();
			$saveItemButton.hide();

		// new item with no current tags
		} else if (type === ITEM_TYPES.NEW) {

			itemType = ITEM_TYPES.NEW;
			$saveItemButton.hide();
			$addItemButton.show();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadAndDisplayTags - find and display tags in select list for search items
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadAndDisplayTags = function(sourceItem, itemData) {

		// exisiting item with tags
		if (itemData && itemData.tagCount > 0) {

			setItemType(ITEM_TYPES.EXISTING);

			// update itemID
			sourceItem.itemID = itemData.itemID;

			// load tags
			TagView.selectTagsFromDirectory(itemData.tags);

		// new item - set user tags
		} else {
			setItemType(ITEM_TYPES.NEW);

			// set user saved tags for new items
			TagView.selectUserTags();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadAndDisplayUserAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadAndDisplayUserAttributes = function(sourceItem, itemData) {

		// set item attributes into firstItem
		if (itemData) {
			sourceItem.gameStatus = itemData.gameStatus;
			sourceItem.playStatus = itemData.playStatus;
			sourceItem.userRating = itemData.userRating;

		// set default attributes
		} else {
			sourceItem.gameStatus = '0';
			sourceItem.playStatus = '0';
			sourceItem.userRating = '0';
		}

		// display attributes
		displayAttributes(sourceItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayAttributes = function(item) {

		// set attribute fields
		$gameStatus.find('.currentSelection').text(GAME_STATUS[item.gameStatus]);
		$playStatus.find('.currentSelection').text(PLAY_STATUS[item.playStatus]);

		// select star rating
		$userRating.stars("select", item.userRating);
		$ratingCaption.text(item.userRating / 2);

		// set initial data setting for dirty check
		$gameStatus.find('.currentSelection').attr('data-initial', item.gameStatus);
		$playStatus.find('.currentSelection').attr('data-initial', item.playStatus);
		$userRating.attr('data-initial', item.userRating);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* saveItemChanges - change tags for item: delete or add
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var saveItemChanges = function(item) {

		// find tags to add
		var tagsToAdd = TagView.getTagsToAdd();

		// find tags to delete
		var idsTagsToDelete = TagView.getTagsToDelete();
		var idsToDelete = idsTagsToDelete.idsToDelete;
		var tagsToDelete = idsTagsToDelete.tagsToDelete;

		// add tags
		if (tagsToAdd.length > 0) {
			addItemToTagRequest = ItemData.addItemToTags(tagsToAdd, item, addItemToTags_result);
		}

		// delete tags
		if (idsToDelete.length > 0) {
			ItemData.deleteTagsForItem(idsToDelete, tagsToDelete, item, deleteTagsForItem_result);
		}

		// check if saving without async data (metacritic, linked item) - if so, update
		updateAsyncData(item);

		// update save item button
		updateSaveItemButton();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateAsyncData - update item with data loaded asynchronously if not available at time of item save
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateAsyncData = function(item) {

		// check for metascore data
		if (_.isUndefined(item.metascore) || item.metascore === null) {

			// deferreds: wait for metascore and add item to tag requests
			$.when(metascoreRequest, addItemToTagRequest).then(

				// all ajax requests returned
				function() {

					// update metacritic data for item
					ItemData.updateMetacritic(firstItem);

					// refresh itemView
					ItemView.refreshView();
				},
				function() {

				}
			);
		}

		// amazon provider - giantbomb not linked
		if (currentProvider === Utilities.SEARCH_PROVIDERS.Amazon && item.gbombID === 0) {
			console.info('giantbomb not linked');

		// giantbomb provider - amazon not linked
		} else if (currentProvider === Utilities.SEARCH_PROVIDERS.Amazon && item.asin === 0) {
			console.info('amazon not linked');
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* saveAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var saveAttributes = function(item) {

		// if attributes changed: update user item
		if (isAttributesDirty() && itemType === ITEM_TYPES.EXISTING) {
			ItemData.updateUserItem(item, updateItem_result);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateItem_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateItem_result = function(item, data) {

		// check if success
		if (data.status === 'success') {

			// reset initial attribute status
			displayAttributes(item);

			// update list view
			ItemView.updateListAttributesChanged(item);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addItemToTags_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addItemToTags_result = function(data, addedItems) {

		// update tagView initialItemTags
		var initialItemTags = TagView.updateInitialItemTags(data.tagIDsAdded, data.idsAdded);

		// if new item - set to existing item
		if (itemType !== ITEM_TYPES.EXISTING) {
			setItemType(ITEM_TYPES.EXISTING);
		}

		// update firstItem with returned data
		firstItem.id = data.itemID;
		firstItem.itemID = data.itemID;

		// update list view model with new item
		ItemView.updateListAdditions(data, addedItems);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTagsForItem_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTagsForItem_result = function(itemID, deletedTagIDs) {

		// update list view model
		ItemView.updateListDeletions(itemID, deletedTagIDs);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* isAttributesDirty -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var isAttributesDirty = function() {

		var initialGameStatus = $gameStatus.find('.currentSelection').attr('data-initial');
		var initialPlayStatus = $playStatus.find('.currentSelection').attr('data-initial');
		var initialRating = $userRating.attr('data-initial');

		// 1 or more attributes changed
		if (initialGameStatus !== firstItem.gameStatus ||
			initialPlayStatus !== firstItem.playStatus ||
			initialRating !== firstItem.userRating) {

			return true;
		}

		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addListChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addListChanged = function(e) {

		// do not check for changes if event triggered from "reset" list
		if (hasRendered && !e.reset) {

			// save userSetTags
			if (itemType === ITEM_TYPES.NEW) {

				// populate user set tags from current tag selection
				TagView.updateUserTags();
			}

			// update button
			updateSaveItemButton();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateSaveItemButton -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateSaveItemButton = function() {

		// if addList changed and existing item
		if (itemType === ITEM_TYPES.EXISTING && TagView.isAddListChanged()) {
			$saveItemButton.fadeIn();
		} else {
			$saveItemButton.fadeOut();
		}
	};

})(tmz.module('detailView'), tmz, jQuery, _, moment);

// ITEM VIEW
(function(ItemView, tmz, $, _, ListJS) {
	"use strict";

	console.info('ItemView');

    // modules references
    var User = tmz.module('user'),
		TagView = tmz.module('tagView'),
		Utilities = tmz.module('utilities'),
		DetailView = tmz.module('detailView'),
		GridView = tmz.module('gridView'),
		ItemData = tmz.module('itemData'),
		ItemCache = tmz.module('itemCache'),
		TagData = tmz.module('tagData'),
		Amazon = tmz.module('amazon'),
		Metacritic = tmz.module('metacritic'),
		ItemLinker = tmz.module('itemLinker'),
		FilterPanel = tmz.module('filterPanel'),

		// constants
		DISPLAY_TYPE = {'List': 0, 'Icons': 1},
		VIEW_MODES = {'collection': 'collection', 'discussion': 'discussion'},
		SORT_TYPES = {'alphabetical': 0, 'metascore': 1, 'releaseDate': 2, 'platform': 3, 'price': 4},
		PANEL_HEIGHT_OFFSET_USE = 230,					// height offset when logged in
		PANEL_HEIGHT_OFFSET_INFO = 450,					// height offset when logged out
		PANEL_HEIGHT_PADDING_DISCUSSION_MAX = 10,		// padding for discussion content (panel no scrolling)
		PANEL_HEIGHT_PADDING_DISCUSSION_SCROLL = 50,	// padding for discussion content (panel requires scrolling)
		PANEL_HEIGHT_PADDING_COLLECTION_MAX = 5,		// padding for collection content (panel no scrolling)
		PANEL_HEIGHT_PADDING_COLLECTION_SCROLL = 10,	// padding for collection content (panel requires scrolling)
		VIEW_ALL_TAG_ID = '0',
		VIEW_ALL_TAG_NAME = 'View All',

		// list
		itemList = null,
		listOptions = {
			valueNames: ['itemName', 'metascore', 'releaseDate', 'platform', 'gameStatus', 'playStatus', 'userRating'],
			item: 'list-item'
		},

		// properties
		currentViewTagID = VIEW_ALL_TAG_ID,
		displayType = DISPLAY_TYPE.Icons,
		currentSortIndex = 0,
		filterHasBeenApplied = false,
		queueDisplayRefresh = false,
		filterType = null,
		itemMenuOpen = false,
		panelHeightOffset = PANEL_HEIGHT_OFFSET_INFO,
		isFiltered = false,
		itemViewMode = VIEW_MODES.collection,

		// element cache
		$wrapper = $('#wrapper'),
		$itemResults = $('#itemResults'),
		$resizeContainer = $('#resizeContainer'),
		$viewItemsContainer = $('#viewItemsContainer'),
		$itemResultsContainer = $('#itemResultsContainer'),
		$displayOptions = $viewItemsContainer.find('.displayOptions'),
		$gridViewButton = $('#gridView_btn'),
		$showCollectionButton = $('#showCollection_btn'),

		$viewList = $('#viewList'),
		$viewName = $viewList.find('.viewName'),

		$itemViewMenu = $('#itemViewMenu'),
		$editMenu = $('#editMenu'),

		// sort elements
		$sortOptions = $viewItemsContainer.find('.sortOptions'),
		$sortTypeField = $sortOptions.find('.sortType'),

		// filter elements
		$filterOptions = $viewItemsContainer.find('.filterOptions'),
		$platformFilterSubNav = $('#platformFilterSubNav'),
		$clearFiltersBtn = $filterOptions.find('.clearFilters_btn'),
		$filterDropDownBtn = $filterOptions.find('.filterDropDown_btn'),
		$filterTypeField = $filterOptions.find('.filterType'),
		$applyFiltersButton = $('#applyFilters_btn'),

		// delete list modal
		$deleteListConfirmModal = $('#deleteListConfirm-modal'),
		$deleteListConfirmBtn = $('#deleteListConfirm_btn'),
		$deleteListBtn = $('#deleteList_btn'),
		$deleteListName = $deleteListBtn.find('.listName'),

		// error modal
		$errorModal = $('#error-modal'),

		// update list modal
		$updateListModal = $('#updateList-modal'),
		$tagNameField = $('#tagNameField'),
		$updateListBtn = $('#updateListConfirm_btn'),
		$editListBtn = $('#editList_btn'),

		$loadingStatus = $itemResultsContainer.find('.loadingStatus'),

		// jquery objects
		currentHoverItem = null,

		// templates
		priceMenuTemplate = _.template($('#price-menu-template').html()),
		itemResultsTemplate = _.template($('#item-results-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.init = function() {

		ItemView.createEventHandlers();

		// init tooltips
		$filterDropDownBtn.tooltip({delay: {show: 500, hide: 50}});
		$displayOptions.find('a').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		});

		// initialize nanoscroll
		var nanoScrollOptions = {
			sliderMinHeight: 20,
			iOSNativeScrolling: true,
			preventPageScrolling: true,
			flash: true,
			flashDelay: 1500
		};
		$itemResultsContainer.nanoScroller(nanoScrollOptions);

		// update nano scroller sizes periodically
		setInterval(function() {
			$itemResultsContainer.nanoScroller();
		}, 1500);

		// set initial filtered status
		setClearFiltersButton(false);

		// init BDSM (bootstrap dropdown sub menu)
		$platformFilterSubNav.BootstrapDropdownSubMenu({'$mainNav': $filterOptions});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    ItemView.createEventHandlers = function() {

		// itemViewMenu .dropdown: hover
		$itemViewMenu.on('mouseenter', '.dropdown-toggle', function(e) {

			var that = this;

			// if dropdown open trigger click on .dropdown
			$itemViewMenu.find('.dropdown').each(function() {

				if ($(this).hasClass('open') && $(this).find('.dropdown-toggle').get(0) !== $(that).get(0)) {
					$(that).trigger('click');
				}
			});
		});

		// viewList: click
		$viewList.find('ul').on('click', 'a', function(e) {
			e.preventDefault();
			changeViewList($(this).attr('data-content'));
		});

		// applyFilters_btn: click
		$applyFiltersButton.click(function(e) {
			e.preventDefault();

			if (!$wrapper.hasClass('gridView')) {
				// show clear filters button
				setClearFiltersButton(true);
				applyFilters(0);
			}
		});

		// clearFiltersBtn: click
		$clearFiltersBtn.click(function(e) {
			e.preventDefault();

			// hide clear filters button
			setClearFiltersButton(false);
			$filterTypeField.text('None');
			// clear filters
			FilterPanel.resetFilters();
			applyFilters();
		});

		// item record: click
		$viewItemsContainer.on('click', '#itemResults tr', function(e) {

			// view item
			viewItem($(this).attr('id'));
		});

		// deleteItem_btn: click
		$itemResults.on('click', '.deleteItem_btn', function(e) {
			e.preventDefault();

			// get id from delete button attribute
			var id = $(this).attr('data-content');
			deleteItem(id);
		});

		// quickAttributes: click
		$itemResults.on('click', '.quickAttributes a', function(e) {
			e.preventDefault();
			e.stopPropagation();

			// get attribute id
			var attributeID = parseInt($(this).attr('data-content'), 10);
			var id = $(this).parent().parent().attr('data-content');

			// set quick attribute
			setQuickAttribute($(this), id, attributeID);
		});

		// deleteList_btn: click
		$deleteListBtn.click(function(e) {
			e.preventDefault();

			// check how many tags left
			if (TagView.getTagCount() > 1) {
				$deleteListConfirmModal.modal('show');
			} else {
				$errorModal.find('.alertTitle').text('Tag Delete Error');
				$errorModal.find('.alertText').text('Cannot delete last tag');
				$errorModal.modal('show');
			}
		});

		// deleteListConfirm_btn: click
		$deleteListConfirmBtn.click(function(e) {
			e.preventDefault();

			$deleteListConfirmModal.modal('hide');
			// delete currently viewing list
			deleteTag(currentViewTagID);
		});

		// updateListModal: form submit
		$updateListModal.find('form').submit(function(e) {
			e.preventDefault();
			// update tag name
			updateTag(currentViewTagID, $tagNameField.val());
			$updateListModal.modal('hide');
		});

		// updateListBtn: click
		$updateListBtn.click(function(e) {
			// update tag name
			updateTag(currentViewTagID, $tagNameField.val());
			$updateListModal.modal('hide');
		});

		// editListBtn: click
		$editListBtn.click(function(e) {
			e.preventDefault();

			var currentTagName = TagView.getTagName(currentViewTagID);

			// set field name
			$tagNameField.val(currentTagName);

			$updateListModal.modal('show');

			// select field text
			$tagNameField.focus().select();
		});

		// displayType: toggle
		$displayOptions.find('a').click(function(e) {
			e.preventDefault();
			changeDisplayType(this);
		});

		// sortOptions: select
		$sortOptions.find('li a').click(function(e) {
			e.preventDefault();
			sortList(parseInt($(this).attr('data-content'), 10));
		});

		// filterOptions: select
		$filterOptions.find('li:not(.dropdown-sub) a').click(function(e) {
			e.preventDefault();

			// custom filter
			filterType = $(this).attr('data-content');
			if (filterType == '0') {
				FilterPanel.showFilterPanel();

			// quick filter
			} else {

				// show clear filters button
				setClearFiltersButton(true);

				// set filterType field
				$filterTypeField.text($(this).text());

				quickFilter(filterType);
			}

		});

		// show grid view button: click
		$gridViewButton.click(function(e) {
			e.preventDefault();
			showGridView();
		});

		// show collection button: click
		$showCollectionButton.click(function(e) {
			e.preventDefault();
			ItemView.viewCollection();
		});

		// window, itemResults: resized
		$resizeContainer.resize(ItemView.resizePanel);
		$(window).resize(ItemView.resizePanel);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* render -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var render = function(items) {

		// item length
		var length = 0;

		// add user attributes to model
		_.each(items, function(item, key) {
			addUserAttributes(item);
			length++;
		});

		// get model data
		var templateData = {'items': items, 'length': length};

		// add displayType/currentViewTagID to templateData
		templateData.displayType = displayType;
		templateData.currentViewTagID = currentViewTagID;

		// render model data to template
		$itemResults.html(itemResultsTemplate(templateData));

		if (length > 0) {
			// activate tooltips for quickAttributes bar
			$itemResults.find('.quickAttributes a').each(function(key, button) {
				$(button).tooltip({delay: {show: 750, hide: 1}, placement: 'bottom'});
			});

			// load preliminary data (for filtering, sorting)
			_.each(items, function(item, key) {
				loadPreliminaryMetascore(item);
			});

			// load latest/extra information for each item
			_.each(items, function(item, key) {
				loadThirdPartyData(item);
			});

			// update list.js for item list
			itemList = new ListJS('itemResultsContainer', listOptions);

			// sort using current sort method
			sortList(currentSortIndex);

			// apply filters
			applyFilters();

			// reset filters - allow filter index to be recreated after dynamic data loaded
			filterHasBeenApplied = false;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.getItem = function(id) {

		return ItemData.getItem(id);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearItemView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.clearItemView = function() {

		$itemResults.html('');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resizePanel -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.resizePanel = function() {

		var windowHeight = $(window).height();
		var resultsHeight = $resizeContainer.height();
		var discussionPaddingScroll = 0;
		var discussionPaddingMax = 0;

		// add loading status height if visible
		if ($loadingStatus.is(':visible')) {
			resultsHeight += $loadingStatus.height();
		}

		// if viewing collection: add additional height padding
		if (itemViewMode === VIEW_MODES.discussion) {
			discussionPaddingScroll = PANEL_HEIGHT_PADDING_DISCUSSION_SCROLL;
			discussionPaddingMax = PANEL_HEIGHT_PADDING_DISCUSSION_MAX;
		}

		// panel does not require shrinking
		if (resultsHeight - discussionPaddingScroll < windowHeight - panelHeightOffset) {
			$itemResultsContainer.css({'height': resultsHeight + PANEL_HEIGHT_PADDING_COLLECTION_MAX + discussionPaddingMax});

		// shrink panel to match window height
		} else {
			var constrainedHeight = windowHeight - panelHeightOffset;
			$itemResultsContainer.css({'height': constrainedHeight + PANEL_HEIGHT_PADDING_COLLECTION_SCROLL + discussionPaddingScroll});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loggedInView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.loggedInView = function(isLoggedIn) {

		if (isLoggedIn) {
			panelHeightOffset = PANEL_HEIGHT_OFFSET_USE;
		} else {
			panelHeightOffset = PANEL_HEIGHT_OFFSET_INFO;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initializeUserItems -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.initializeUserItems = function(onSuccess, onFail) {

		// save tagID
		currentViewTagID = VIEW_ALL_TAG_ID;

		// load item data for tagID
		return ItemData.getItems(VIEW_ALL_TAG_ID, onSuccess, onFail);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initializeUserItems_result - called upon result of initializeUserItems and other dependencies
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.initializeUserItems_result = function(items) {

		// ItemData items result
		ItemData.itemsAndDirectoryLoaded(items);

		// select 'view all' tag
		changeViewList(VIEW_ALL_TAG_ID);

		if (!$.isEmptyObject(items)) {
			// view random item
			viewRandomItem();

		} else {
			DetailView.resetDetail();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListDeletions -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListDeletions = function(itemID, deletedTagIDs) {

		var tagCount = null;

		// remove items deleted from view
		for (var i = 0, len = deletedTagIDs.length; i < len; i++) {

			// remove element from html
			// except when in 'view all' list (id: 0) and itemDeleted is the last tag for itemID
			if (currentViewTagID === VIEW_ALL_TAG_ID) {

				// get item by id
				tagCount = ItemData.getDirectoryItemByItemID(itemID).tagCount;

				if (tagCount === 0) {

					// remove item by itemID
					$('#' + itemID).remove();
				}

			// not viewing 'all items' remove item
			} else if (currentViewTagID === deletedTagIDs[i]) {
				$('#' + itemID).remove();
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListAdditions
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListAdditions = function(data, addedItems) {

		var renderCurrentList = false;

		// update view list
		TagView.updateViewList(data.tagIDsAdded, currentViewTagID);

		// viewing user list
		if (currentViewTagID !== VIEW_ALL_TAG_ID) {

			// iterate added tagIDs - render if viewing list where item was added
			for (var i = 0, len = data.tagIDsAdded.length; i < len; i++) {

				if (data.tagIDsAdded[i] == currentViewTagID) {
					renderCurrentList = true;
				}
			}

		// viewing 'all list' view
		// don't re-render item already displayed in 'view all' list
		} else if (ItemData.getDirectoryItemByItemID(data.itemID).tagCount >= 1) {
			renderCurrentList = true;
		}

		if (renderCurrentList) {

			// get and render items
			changeViewList(currentViewTagID);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateListAttributesChanged
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.updateListAttributesChanged = function(item) {

		queueDisplayRefresh = true;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showListView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.showListView = function(tagID, newFilterType, filterTypeFieldText, isFiltered) {

		filterType = newFilterType;

		changeViewList(tagID);

		$filterTypeField.text(filterTypeFieldText);
		setClearFiltersButton(isFiltered);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewDiscussion -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.viewDiscussion = function() {
		itemViewMode = VIEW_MODES.discussion;
		$viewItemsContainer.removeClass().addClass(itemViewMode);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewCollection -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.viewCollection = function() {
		itemViewMode = VIEW_MODES.collection;
		$viewItemsContainer.removeClass().addClass(itemViewMode);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* refreshView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemView.refreshView = function() {

		viewItems(currentViewTagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showGridView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showGridView = function() {

		// show grid for current tag
		GridView.showGridView(currentViewTagID, filterType, $filterTypeField.text(), isFiltered);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeViewList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeViewList = function(tagID) {

		var tagName = '';

		// show edit menu
		if (tagID !== VIEW_ALL_TAG_ID) {

			tagName = TagView.getTagName(tagID);

			// change edit menu delete list name
			$deleteListName.text(tagName);

			// show edit menu
			$editMenu.show();

		// hide edit menu
		} else {
			tagName = VIEW_ALL_TAG_NAME;
			$editMenu.hide();
		}

		// set view name
		$viewName.text(tagName);

		// view items
		viewItems(tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItems -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewItems = function(tagID, onSuccess) {

		// save tagID
		currentViewTagID = tagID;

		// load item data for tagID
		ItemData.getItems(tagID,

			// success - render items
			function(items) {

				render(items);

				if (onSuccess) {
					onSuccess();
				}
			},

			// error - empty view
			function() {
				render({});
			}
		);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadThirdPartyData - loads and displays specialized item detail and populates new data into item model
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadThirdPartyData = function(item) {

		// get amazon price data
		Amazon.getAmazonItemOffers(item.asin, item, function(offers) {
			amazonPrice_result(item.id, offers);
		});

		// get updated metascore - if metascore or metascore page not in item data
		if (item.metascore === null || item.metascorePage === null) {
			// get updated score
			Metacritic.getMetascore(item.standardName, item, false, displayMetascore);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addUserAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addUserAttributes = function(item) {

		// find directory item by itemID
		var itemData = ItemData.getDirectoryItemByItemID(item.itemID);

		if (itemData) {
			// add attributes to model item
			item.gameStatus = itemData.gameStatus;
			item.playStatus = itemData.playStatus;
			item.userRating = itemData.userRating;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* amazonPrice_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var amazonPrice_result = function(id, offers) {

		// render if offers available
		if (typeof offers.productURL !== 'undefined') {
			// display price
			var priceSelector = '#' + id + ' .priceDetails';

			// attach to existing item result
			$(priceSelector).html(priceMenuTemplate(offers));
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* load -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadPreliminaryMetascore = function(item) {

		// set displayMetascore and metascorePage preliminary data attributes
		if (item.metascore === -1) {
			item.displayMetascore = 'n/a';
		} else {
			item.displayMetascore = item.metascore;
		}

		displayMetascore(item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var displayMetascore = function(item) {

		// display score
		var metascoreSelector = '#' + item.id + ' .metascore';
		Metacritic.displayMetascoreData(item.metascorePage, item.metascore, metascoreSelector);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewRandomItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewRandomItem = function() {

		// get random id and view item for id
		var id = ItemData.getRandomItemID();
		viewItem(id);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* viewItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var viewItem = function(id) {

		// get item
		var item = ItemView.getItem(id);

		// show item detail page
		DetailView.viewItemDetail(item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItem = function(id) {

		// delete item from server
		var itemID = ItemData.deleteSingleTagForItem(id, currentViewTagID, deleteItem_result);

		// remove tag from add list (Detail View) - only if currently viewing item matches deleted item
		if (DetailView.getViewingItemID() === id) {
			TagView.removeTagFromAddList(currentViewTagID);
		}

		// remove element from html
		$('#' + id).remove();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteItem_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteItem_result = function(data) {

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTag = function(tagID) {

		// delete tag
		TagView.deleteTag(tagID, function() {
			deleteTag_result();
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* deleteTag_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var deleteTag_result = function() {

		// default back to 'view all' list
		changeViewList(VIEW_ALL_TAG_ID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateTag -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateTag = function(tagID, tagName) {

		// delete database data
		TagData.updateTag(tagName, tagID, function(data) {
		});

		// update List
		TagView.getTags(function(data) {
			TagView.getTags_result(data);
		});

		// update tag name
		updateTagName(tagName, tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* updateTagName -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var updateTagName = function(tagName, tagID) {

		// update update tag input field and current viewing tag name
		$viewName.text(tagName);
		$tagNameField.val(tagName);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setQuickAttribute -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setQuickAttribute = function($button, id, attributeID) {

		// get item by id
		var item = ItemView.getItem(id);

		// flag for item refresh
		queueDisplayRefresh = true;

		switch (attributeID) {

			// playing
			case 0:
				if (item.playStatus === '1') {
					resetPlayStatusQuickAttributes($button, '0');
					$button.parent().removeClass().addClass('playStatus-0');
					item.playStatus = '0';
				} else {
					resetPlayStatusQuickAttributes($button, '1');
					$button.parent().removeClass().addClass('playStatus-1');
					item.playStatus = '1';
				}
				break;
			// played
			case 1:
				if (item.playStatus === '2') {
					resetPlayStatusQuickAttributes($button, '0');
					$button.parent().removeClass().addClass('playStatus-0');
					item.playStatus = '0';
				} else {
					resetPlayStatusQuickAttributes($button, '2');
					$button.parent().removeClass().addClass('playStatus-2');
					item.playStatus = '2';
				}
				break;
			// finished
			case 2:
				if (item.playStatus === '3') {
					resetPlayStatusQuickAttributes($button, '0');
					$button.parent().removeClass().addClass('playStatus-0');
					item.playStatus = '0';
				} else {
					resetPlayStatusQuickAttributes($button, '3');
					$button.parent().removeClass().addClass('playStatus-3');
					item.playStatus = '3';
				}
				break;
			// favorite
			case 3:
				if (item.userRating === '10') {
					$button.parent().removeClass('rating-10');
					item.userRating = '0';
				} else {
					$button.parent().removeClass().addClass('rating-10');
					item.userRating = '10';
				}
				break;
			// owned
			case 4:
				if (item.gameStatus === '1') {
					$button.parent().removeClass().addClass('gameStatus-0');
					item.gameStatus = '0';
				} else {
					$button.parent().removeClass().addClass('gameStatus-1');
					item.gameStatus = '1';
				}
				break;
		}

		// update remote data
		ItemData.updateUserItem(item, function(item, data) {
			// update item detail view
			DetailView.viewItemDetail(item);
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetPlayStatusQuickAttributes -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var resetPlayStatusQuickAttributes = function($button, status) {

		// find all quick attribute buttons with class playStatus-x
		$button.parent().parent().find('span[class*="playStatus"]').each(function() {
			$(this).removeClass().addClass('playStatus-' + status);
		});

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var quickFilter = function(filterType) {

		var quickFilter = parseInt(filterType, 10);

		// reset filters
		FilterPanel.resetFilters();

		// filter is not a number - run platform quick filter
		if (isNaN(filterType)) {
			FilterPanel.platformQuickFilter(filterType);

		// standard quick filters
		} else {

			switch (quickFilter) {

				// upcoming
				case 1:
					// sort and apply filter
					sortList(SORT_TYPES.releaseDate);
					// set current filter text on filters button
					// set filter panel option
					FilterPanel.upcomingQuickFilter(itemList);
					break;

				// new releases
				case 2:
					sortList(SORT_TYPES.releaseDate);
					FilterPanel.newReleasesQuickFilter(itemList);
					break;

				// never played
				case 3:
					sortList(SORT_TYPES.metascore);
					FilterPanel.neverPlayedQuickFilter(itemList);
					break;

				// games playing
				case 4:
					sortList(SORT_TYPES.metascore);
					FilterPanel.gamesPlayingQuickFilter(itemList);
					break;

				// games played
				case 5:
					sortList(SORT_TYPES.metascore);
					FilterPanel.gamesPlayedQuickFilter(itemList);
					break;

				// finished games
				case 6:
					sortList(SORT_TYPES.metascore);
					FilterPanel.finishedGamesQuickFilter(itemList);
					break;

				// owned games
				case 7:
					sortList(SORT_TYPES.metascore);
					FilterPanel.ownedGamesQuickFilter(itemList);
					break;

				// wanted games
				case 8:
					sortList(SORT_TYPES.metascore);
					FilterPanel.wantedGamesQuickFilter(itemList);
					break;
			}
		}

		// apply filters and toggle filter status
		applyFilters(quickFilter);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var applyFilters = function(filterType) {

		// check if custom filter type
		if (filterType === 0) {
			// set filterType field
			$filterTypeField.text('Custom');
		}

		// refresh item display first - then filter
		if (queueDisplayRefresh) {

			queueDisplayRefresh = false;

			// refresh item html for updated filtering
			changeViewList(currentViewTagID, function() {

				// apply filters to itemList
				var filtered = FilterPanel.applyListJSFiltering(itemList);
			});

		// filter immediately
		} else {
			// apply filters to itemList
			var filtered = FilterPanel.applyListJSFiltering(itemList);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setClearFiltersButton -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setClearFiltersButton = function(filtered) {

		isFiltered = filtered;

		// check if filtered - show clearFiltersBtn button
		if (filtered) {
			$clearFiltersBtn.show();
			$clearFiltersBtn.next().show();
		} else {
			$clearFiltersBtn.hide();
			$clearFiltersBtn.next().hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortList = function(sortType) {

		currentSortIndex = sortType;

		switch (currentSortIndex) {

			// alphabetical
			case SORT_TYPES.alphabetical:
				// set sort status
				$sortTypeField.text('Alphabetical');
				// sort new list
				itemList.sort('itemName', { asc: true });

				break;

			// metascores
			case SORT_TYPES.metascore:
				$sortTypeField.text('Review Score');
				itemList.sort('scoreDetails', {sortFunction: metascoreSort});

				break;

			// release date
			case SORT_TYPES.releaseDate:
				$sortTypeField.text('Release Date');
				itemList.sort('releaseDate', {sortFunction: releaseDateSort});

				break;

			// platform
			case SORT_TYPES.platform:
				$sortTypeField.text('Platform');
				itemList.sort('platform', { asc: true });

				break;

			// price
			case SORT_TYPES.price:
				$sortTypeField.text('Price');
				itemList.sort('priceDetails', {sortFunction: priceSort});

				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascoreSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metascoreSort = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.metascore');
		var $element2 = $(secondItem.elm).find('.metascore');

		var score1 = parseInt($element1.attr('data-score'), 10);
		var score2 = parseInt($element2.attr('data-score'), 10);

		if (score1 < score2) {
			return 1;
		}
		return -1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* priceSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var priceSort = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.priceDetails .lowestNew');
		var $element2 = $(secondItem.elm).find('.priceDetails .lowestNew');

		var price1 = 0;
		var price2 = 0;

		if ($element1.length > 0 ) {
			price1 = parseFloat($element1.attr('data-price'));
		}

		if ($element2.length > 0) {
			price2 = parseFloat($element2.attr('data-price'));
		}

		if (price1 < price2) {
			return -1;
		}
		return 1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateSort = function(firstItem, secondItem) {

		var $element1 = $(firstItem.elm).find('.releaseDate');
		var $element2 = $(secondItem.elm).find('.releaseDate');

		var date1 = Date.parse($element1.text());
		var date2 = Date.parse($element2.text());

		return date2 - date1;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeDisplayType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeDisplayType = function(toggleButton) {

		var currentDisplayType = $(toggleButton).attr('data-content');

		// set new display type if changed
		if (displayType !== currentDisplayType) {
			displayType = currentDisplayType;

			// change #itemResults tbody class
			$itemResults.find('tbody').removeClass().addClass('display-' + displayType);

			// set nanoscroll
			$itemResultsContainer.nanoScroller();
		}
	};

})(tmz.module('itemView'), tmz, jQuery, _, List);

// GiantBomb
(function(GridView, tmz, $, _) {
	"use strict";

	console.info('GridView');

    // module references
    var DetailView = tmz.module('detailView'),
		ItemData = tmz.module('itemData'),
		ItemView = tmz.module('itemView'),
		TagView = tmz.module('tagView'),
		Amazon = tmz.module('amazon'),
		Utilities = tmz.module('utilities'),
		FilterPanel = tmz.module('filterPanel'),

		// constants
		DEFAULT_DISPLAY_TYPE = 1,
		SORT_TYPES = {'itemName': 0, 'metacriticScore': 1, 'releaseDate': 2, 'platform': 3, 'rawPrice': 4},

		// properties
		currentTagID = null,
		currentSortIndex = 0,
		currentSortType = null,
		currentSortAsc = true,
		filterType = null,
		isFiltered = false,

		// node cache
		$wrapper = $('#wrapper'),
		$gridViewContainer = $('#gridViewContainer'),
		$gridList = $('#gridList'),
		$viewName = $gridList.find('.viewName'),
		$gridViewMenu = $('#gridViewMenu'),

		// display options
		$displayOptions = $gridViewMenu.find('.grid_displayOptions'),
		$displayTypeField = $displayOptions.find('.displayType'),

		// sort options
		$sortOptions = $gridViewMenu.find('.sortOptions'),
		$sortTypeField = $sortOptions.find('.sortType'),

		// filter options
		$filterOptions = $gridViewMenu.find('.filterOptions'),
		$clearFiltersBtn = $filterOptions.find('.clearFilters_btn'),
		$filterTypeField = $filterOptions.find('.filterType'),
		$filterDropDownBtn = $filterOptions.find('.filterDropDown_btn'),
		$listFiltersButton = $filterOptions.find('.listFilters_btn'),
		$applyFiltersButton = $('#applyFilters_btn'),
		$filtersModal = $('#filters-modal'),

		// templates
		gridResultsTemplate = _.template($('#grid-results-template').html()),

		// data
		widthCache = {},

		// properties
		isotopeInitialized = false,
		displayType = null;

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GridView.init = function() {

		// create event handlers
		createEventHandlers();

		// init tooltips
		$filterDropDownBtn.tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		$displayOptions.find('div').each(function(key, button) {
			$(button).tooltip({delay: {show: 500, hide: 50}, placement: 'bottom'});
		});

		// set initial filtered status
		setClearFiltersButton(false);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var createEventHandlers = function(item) {

		// gridViewMenu .dropdown: hover
		$gridViewMenu.on('mouseenter', '.dropdown-toggle', function(e) {

			var that = this;

			// if dropdown open trigger click on .dropdown
			$gridViewMenu.find('.dropdown').each(function() {

				if ($(this).hasClass('open') && $(this).find('.dropdown-toggle').get(0) !== $(that).get(0)) {
					$(that).trigger('click');
				}
			});
		});

		// exit grid view button: click
		$('#exitGridView_btn').click(function(e) {
			e.preventDefault();
			showListView();
		});

		// listFilters_btn: click
		$listFiltersButton.click(function(e) {
			e.preventDefault();
			$filtersModal.modal('show');
		});

		// clearFiltersBtn: click
		$clearFiltersBtn.click(function(e) {
			e.preventDefault();

			// hide clear filters button
			setClearFiltersButton(false);
			$filterTypeField.text('None');
			// clear filters
			FilterPanel.resetFilters();
			applyFilters();
		});

		// applyFilters_btn: click
		$applyFiltersButton.click(function(e) {
			e.preventDefault();
			// apply filters
			applyFilters();

			// show clear filters button
			setClearFiltersButton(true);
		});

		// gridList: click
		$gridList.find('ul').on('click', 'a', function(e) {
			e.preventDefault();
			changeGridList($(this).attr('data-content'));
		});

		// gridItem: click
		$gridViewContainer.on('click', '.gridItem img', function(e) {
			e.preventDefault();
			gridItemSelected($(this).parent().parent().attr('data-content'));
		});

		// gridItem: mouseover
		$gridViewContainer.on('mouseover', '.gridItem', function(e) {
			e.preventDefault();

			var $gridItem = $(this);
			var id = $gridItem.attr('data-content');
			var width = widthCache[id];
			if (!width) {
				width = $gridItem.width();
				widthCache[id] = width;
			}

			var offset = Math.round((width * 1.2 - width) / 2);

			$gridItem.css({'z-index': '999',
						//'top': -offset + 'px',
						//'left': -offset + 'px',
						'width': width * 1.2 + 'px',
						'-webkit-transition-timing-function': 'cubic-bezier(0.01,0.53,0.00,1.00)',
						'-webkit-transition-property': 'top,left,width',
						'-webkit-transition-duration': '1s'
						}
			);
		});

		// gridItem: mouseout
		$gridViewContainer.on('mouseout', '.gridItem', function(e) {
			e.preventDefault();

			var $gridItem = $(this);

			$gridItem.css({'z-index': '',
						//'top': '',
						//'left': '',
						'width': '',
						'-webkit-transition-timing-function': 'cubic-bezier(0.01,0.53,0.00,1.00)',
						'-webkit-transition-property': 'top,left,width',
						'-webkit-transition-duration': '1s'
						}
			);
		});

		// displayOptions: click
		$displayOptions.find('li a').click(function(e) {
			e.preventDefault();

			// set type field
			$displayTypeField.text($(this).text());

			// change display type
			changeDisplayType($(this).attr('data-content'));
		});

		// sortOptions: click
		$sortOptions.find('li a').click(function(e) {
			e.preventDefault();
			sortList($(this).attr('data-content'));
		});

		// filterOptions: click
		$filterOptions.find('li a').click(function(e) {
			e.preventDefault();

			// custom filter
			filterType = parseInt($(this).attr('data-content'), 10);
			if (filterType === 0) {
				FilterPanel.showFilterPanel();

			// quick filter
			} else {

				// show clear filters button
				setClearFiltersButton(true);

				// set filterType field
				$filterTypeField.text($(this).text());

				quickFilter(parseInt($(this).attr('data-content'), 10));
			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showGridView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GridView.showGridView = function(tagID, newFilterType, filterTypeFieldText, isFiltered) {

		// switch content display to gridView

		// modify styles
		$wrapper.removeClass('standardView');
		$wrapper.addClass('gridView');

		// reset filter/sort text
		filterType = newFilterType;

		// select gridList tagID
		selectGridTag(tagID);

		// load grid
		loadGridData(tagID);

		$filterTypeField.text(filterTypeFieldText);
		setClearFiltersButton(isFiltered);
	};

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectGridTag -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectGridTag = function(tagID) {

        // get option node
        var $listItem = $gridList.find('a[data-content="' + tagID + '"]');

        // set gridList name as listItem name
        $gridList.find('.viewName').text($listItem.text());
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showListView -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showListView = function() {

		// switch content display to standardView
		// modify styles
		$wrapper.removeClass('gridView');
		$wrapper.addClass('standardView');

		// sync ItemView with gridView tagID list
		ItemView.showListView(currentTagID, filterType, $filterTypeField.text(), isFiltered);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeGridList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeGridList = function(tagID) {

		currentTagID = tagID;

		// select grid tag
		selectGridTag(tagID);

		// load items
		loadGridData(tagID);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* loadGridData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var loadGridData = function(tagID) {

		currentTagID = tagID;

		$gridViewContainer.hide();
		// reset isotop
		if (isotopeInitialized) {
			$gridViewContainer.isotope('destroy');
		}

		ItemData.getItems(tagID, getItems_result);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getItems_result -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getItems_result = function(items) {

		// setup isotope gride
		render(items);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* render -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var render = function(items) {

		var templateData = {'items': items};

		// set html from items data
		$gridViewContainer.html(gridResultsTemplate(templateData));

		initializeIsotope();

		// initialize isotope after images have loaded
		$gridViewContainer.imagesLoaded( function(){

			// show gridViewContainer
			$gridViewContainer.show();
			initializeIsotope();

			applyFilters();
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* initializeIsotope -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var initializeIsotope = function() {

		isotopeInitialized = true;

		$gridViewContainer.isotope({
			itemSelector : '.gridItem',

			// sort
			getSortData : {
				itemName: itemNameSort,
				releaseDate: releaseDateSort,
				platform: platformSort,
				userRating: userRatingSort,
				metacriticScore: metacriticScoreSort,
				rawPrice: priceSort
			},

			// starting sort
			sortBy : 'itemName',
			sortAscending : true,

			transformsEnabled: false
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* gridItemSelected -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var gridItemSelected = function(id) {

		// show item detail page
		var item = ItemData.getItem(id);

		// view in detail panel
		DetailView.viewItemDetail(item);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quickFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var quickFilter = function(filterType) {

		// clear transition so isotope can animate
		clearTransitionProperties();

		var quickFilter = parseInt(filterType, 10);
		FilterPanel.resetFilters();

		switch (quickFilter) {

			// upcoming
			case 1:
				FilterPanel.upcomingQuickFilter();
				$sortTypeField.text('Release Date');
				currentSortType = 'releaseDate';
				currentSortAsc = true;
				break;

			// new releases
			case 2:
				FilterPanel.newReleasesQuickFilter();
				$sortTypeField.text('Release Date');
				currentSortType = 'releaseDate';
				currentSortAsc = false;
				break;

			// never played
			case 3:
				FilterPanel.neverPlayedQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// games playing
			case 4:
				FilterPanel.gamesPlayingQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// games played
			case 5:
				FilterPanel.gamesPlayedQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// finished games
			case 6:
				FilterPanel.finishedGamesQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// owned games
			case 7:
				FilterPanel.ownedGamesQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;

			// wanted games
			case 8:
				FilterPanel.wantedGamesQuickFilter();
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				currentSortAsc = false;
				break;
		}

		// apply filters to itemList and set filtered Status icon
		applyFilters();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var applyFilters = function() {

		// check if custom filter type
		if (filterType === 0) {
			// set filterType field
			$filterTypeField.text('Custom');
		}

		// apply filters to itemList and set filtered Status icon
		setClearFiltersButton(FilterPanel.applyIsotopeFiltering($gridViewContainer, currentSortType, currentSortAsc));
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* sortList -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var sortList = function(sortType) {

		// clear transition so isotope can animate
		clearTransitionProperties();

		currentSortIndex = parseInt(sortType, 10);

		switch (currentSortIndex) {

			// alphabetical
			case SORT_TYPES.itemName:
				// set sort status
				$sortTypeField.text('Alphabetical');
				currentSortType = 'itemName';
				// sort new list
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : true
				});

				break;

			// review scores
			case SORT_TYPES.metacriticScore:
				$sortTypeField.text('Review Score');
				currentSortType = 'metacriticScore';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : false
				});

				break;

			// release date
			case SORT_TYPES.releaseDate:
				$sortTypeField.text('Release Date');
				currentSortType = 'releaseDate';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : false
				});

				break;

			// platform
			case SORT_TYPES.platform:
				$sortTypeField.text('Platform');
				currentSortType = 'platform';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : true
				});

				break;

			// price
			case SORT_TYPES.rawPrice:
				$sortTypeField.text('Price');
				currentSortType = 'rawPrice';
				$gridViewContainer.isotope({
					sortBy : currentSortType,
					sortAscending : true
				});

				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* itemNameSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var itemNameSort = function($elem) {
		return $elem.find('.itemName').text();
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var releaseDateSort = function($elem) {
		return $elem.find('.releaseDate').text();
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* platformSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var platformSort = function($elem) {
		return $elem.find('.platform').text();
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* userRatingSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var userRatingSort = function($elem) {
		return parseInt($elem.find('.userRating').text(), 10);
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metacriticScoreSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var metacriticScoreSort = function($elem) {
		return parseInt($elem.find('.metacriticScore').text(), 10);
	};
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* priceSort -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var priceSort = function($elem) {
		return parseInt($elem.find('.rawPrice').text(), 10);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* setClearFiltersButton -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var setClearFiltersButton = function(filtered) {

		isFiltered = filtered;

		// check if filtered - show clearFiltersBtn button
		if (filtered) {
			$clearFiltersBtn.show();
			$clearFiltersBtn.next().show();
		} else {
			$clearFiltersBtn.hide();
			$clearFiltersBtn.next().hide();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeDisplayType
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeDisplayType = function(currentDisplayType) {

		// clear transition so isotope can animate
		clearTransitionProperties();

		// reset cache
		widthCache = {};

		// set new display type if changed
		if (displayType !== currentDisplayType) {

			// change #itemResults tbody class
			$gridViewContainer.removeClass('display-' + displayType).addClass('display-' + currentDisplayType);

			displayType = currentDisplayType;

			// re-layout isotope
			$gridViewContainer.isotope('reLayout', function() {

			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* clearTransitionProperties -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var clearTransitionProperties = function(item) {

		$('.gridItem').each(function(key, item) {
			$(item).css({'z-index': '',
				'-webkit-transition-property': ''
			});
		});
	};


})(tmz.module('gridView'), tmz, jQuery, _);

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* TAG VIEW - controls tag presentation (View and Add tag lists) and manages tag data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function(TagView, tmz, $, _) {
    "use strict";
    console.info('TagView');

    // dependecies
    var User = tmz.module('user'),
        TagData = tmz.module('tagData'),
        ItemData = tmz.module('itemData'),
        ItemCache = tmz.module('itemCache'),

        // node cache
        $addListContainer = $('#addListContainer'),
        $addList = $('#addList'),
        $viewList = $('#viewList'),
        $gridList = $('#gridList'),

        // all tags
        activeAddTags = {},

        // view tags - split into two categories: active and empty
        activeViewTags = {},
        emptyViewTags = {},

        // reference data: tag name by tagID
        tagIndex = {},

        // reference data: holds tags with assigned items
        activeTags = {},

        // state of tag IDs at item detail load, key = tagID, value = item key id for item/tag entry
        initialItemTags = {},

        // tags set by user for adding new items to list
        userSetTags = [],

        // templates
        viewListTemplate = _.template($('#view-list-template').html());

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * init
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var init = function() {

        createEventHandlers();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * createEventHandlers
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var createEventHandlers = function() {

        // addList: change
        $addList.change(function(e) {

            // get last tag
            var tags = $addList.val().split(',');
            var lastTag = tags[tags.length - 1];

            // create new tag if not empty string
            if (lastTag !== '') {
                addTag(lastTag);
            }
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTags - download new tag data over network or from cache
    * @return json
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTags = function(onSuccess, onFail) {

        // reset tag data
        _resetTagData();

        return TagData.getTags(onSuccess, onFail);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTags_result - parse tag data response - used in defered so is made public
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTags_result = function(data) {

        // find active tags
        _populateActiveTags();

        // parse response and create local data
        _parseGetTagsResponse(data);

        // render lists
        renderViewLists();
        _renderAddLists();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * renderViewLists - render tag view in Item View panel
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var renderViewLists = function() {

        // reset sorted lists
        var sortedViewTags = [];
        var sortedEmptyTags = [];

        // generate sorted view tag
        _.each(activeViewTags, function(item, key) {
            sortedViewTags.push(item);
        });
        // generate sorted empty tag
        _.each(emptyViewTags, function(item, key) {
            sortedEmptyTags.push(item);
        });

        // sort lists
        sortedViewTags.sort(_sortListItemByName);

        // create template data structure
        var viewListTemplateData = {'orderedList': sortedViewTags, 'emptyList': sortedEmptyTags};

        // output template to tag containers
        $viewList.find('ul').html(viewListTemplate(viewListTemplateData));
        $gridList.find('ul').html(viewListTemplate(viewListTemplateData));
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagName - get tag name by tagID
    * @return string
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagName = function(tagID) {

        return tagIndex[tagID];
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagCount - return number of tags
    * @return number
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagCount = function() {

        var tagCount = 0;
        _.each(activeAddTags, function(tag) {
            tagCount++;
        });

        return tagCount;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagsToAdd - added tags to addList
    * @return array
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagsToAdd = function() {

        var tagsToAdd = [];
        var currentTags = _getSelectedTagIDs();

        // iterate current tags - find tags to add
        _.each(currentTags, function(tagID) {

            // current tags NOT in initial
            if (!_.has(initialItemTags, tagID)) {

                // add placeholder for initialItemTags - allows for instant save button update
                initialItemTags[tagID] = 'placeholder';

                // add to list for batch insert
                tagsToAdd.push(tagID);
            }
        });

        return tagsToAdd;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * getTagsToDelete - deleted tags from addList
    * @return object - contains tagID and link IDs as arrays
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var getTagsToDelete = function() {

        var idsToDelete = [];
        var tagsToDelete = [];
        var currentTags = _getSelectedTagIDs();

        // iterate initialItemTags
        _.each(initialItemTags, function(id, tagID) {

            // if initial tagID not found in currentTags array, it has been deleted
            if (_.indexOf(currentTags, tagID) === -1) {

                // remove tag from initial state
                delete initialItemTags[tagID];

                // add item/tag tagIDs to lists for batch delete
                tagsToDelete.push(tagID);
                idsToDelete.push(id);
            }
        });

        // return object of tagIDs and ids
        return {'idsToDelete': idsToDelete, 'tagsToDelete': tagsToDelete};
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updateInitialItemTags - update initialItemTags with added tag data
    * @param tagIDsAdded - array
    * @param idsAdded - array
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updateInitialItemTags = function(tagIDsAdded, idsAdded) {

        // update initial tags with ids
        for (var i = 0, len = idsAdded.length; i < len; i++) {

            // add tag to initialItemTags
            initialItemTags[tagIDsAdded[i]] = idsAdded[i];
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * addTag - create new tag
    * @param tagName - string
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var addTag = function(tagName) {

        // check if tag name exists
        if (!_.has(activeAddTags, tagName)) {

            // create new tag
            TagData.addTag(tagName, _addTag_result);
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * deleteTag - delete tag by tagID
    * @param tagID - string - tag to delete
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var deleteTag = function(tagID, onSuccess) {

        // get all items by tagID
        var tagItems = ItemCache.getCachedItemsByTag(tagID);

        // each item in tag: delete client item and tag from directory
        _.each(tagItems, function(item, key) {
            ItemData.deleteClientItem(tagID, item.itemID);
            ItemData.deleteTagFromDirectory(item.itemID, tagID);
        });

        // remove tag from addList tags
        removeTagFromAddList(tagID);

        // delete cached tag
        ItemCache.deleteCachedTag(tagID);

        // delete tag data
        TagData.deleteTag(tagID);

        // get new tag data
        getTags(function(data) {
            getTags_result(data);
        });

        onSuccess();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * removeTagFromAddList - remove tagID from select2 list
    * @param tagID - string - tag to remove
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var removeTagFromAddList = function(tagID) {

        // remove tag from initialItemTags
        delete initialItemTags[tagID];

        // reselect form new initialItemTags
        _selectAddListTags(initialItemTags);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectTagsFromDirectory - set tags in tagList as selected in addList
    * @param tagList - object of tagID/id
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectTagsFromDirectory = function(tagList) {

        // reset initial tags, set initial provider
        initialItemTags = {};

        var option = null;

        // populate intialItemTags
        _.each(tagList, function(id, tagID) {

            // create associate of tags with item ids
            initialItemTags[tagID] = id;
        });

        // select initial tags
        _selectAddListTags(tagList);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updateUserTags - set new user tags - tags set by user for adding NEW items
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updateUserTags = function() {
        userSetTags = $addList.val().split(',');
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * selectUserTags - set tags in userSetTags as selected in addList
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var selectUserTags = function() {

        initialItemTags = {};

        $addList.val(userSetTags).trigger({
            type: 'change',
            reset: false
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * updateViewList -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var updateViewList = function(tagIDsAdded, currentViewTagID) {

        var updated = false;

        // iterated added tag IDS
        for (var i = 0, len = tagIDsAdded.length; i < len; i++) {

            // check if added tagID is in activeTags
            if (typeof activeTags[tagIDsAdded[i]] === 'undefined') {

                // add tagID to activeTags
                activeTags[tagIDsAdded[i]] = true;

                // remove tag from empty tag
                delete emptyViewTags[tagIndex[tagIDsAdded[i]]];

                // add to view lists object
                activeViewTags[tagIndex[tagIDsAdded[i]]] = {'id': tagIDsAdded[i], 'name': tagIndex[tagIDsAdded[i]]};

                updated = true;
            }
        }

        // update view tag
        if (updated) {
            renderViewLists();
        }

        return updated;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * resetAddList - clear addList select2 tags
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var resetAddList = function() {

        // reset initial/current item tags
        initialItemTags = {};
        userSetTags = [];

        $addList.val(['']).trigger({
            type:'change',
            reset:true
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * isAddListChanged -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var isAddListChanged = function() {

        var addListChanged = false;
        var currentTags = _getSelectedTagIDs();

        // tags added
        _.each(currentTags, function(tagID) {

            // match with initial tags
            if (!_.has(initialItemTags, tagID)) {
                addListChanged = true;
            }
        });

        // tags deleted
        _.each(initialItemTags, function(id, tagID) {

            // match with user currentTags
            if (_.indexOf(currentTags, tagID) === -1) {
                addListChanged = true;
            }
        });

        return addListChanged;
    };



    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * PRIVATE METHODS -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _renderAddLists - render select2 dropdown tag select for adding and saving items to tags
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _renderAddLists = function() {

        // reset sorted lists
        var sortedAddTag = [];
        var addListTags = [];

        // generate sorted add tag
        _.each(activeAddTags, function(tag, key) {
            sortedAddTag.push(tag);
            addListTags.push(tag.name);
        });

        // sort lists
        sortedAddTag.sort(_sortListItemByName);

        // render addList
        $addList.select2({
            tags:addListTags,
            placeholder: "Type a tag name",
            allowClear: true
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _resetTagData - reset all tag data
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _resetTagData = function() {

        activeAddTags = {};
        activeViewTags = {};
        emptyViewTags = {};
        tagIndex = {};
        activeTags = {};
        initialItemTags = {};
        userSetTags = [];
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _addTag_result - process addTag response
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _addTag_result = function(newTag) {

        var tagItem = {name: newTag.tagName.toLowerCase(), id: newTag.tagID};

        // add tag to all tags data
        activeAddTags[tagItem.name] = tagItem;
        // tag is empty by default
        emptyViewTags[tagItem.name] = tagItem;
        // set tagID/name reference
        tagIndex[tagItem.id] = tagItem.name;

        // update view tag list
        renderViewLists();
        _renderAddLists();

        // reselect input field since after init .select2 field focus is lost
        $addListContainer.find('.select2-search-field input').focus();
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _getSelectedTagIDs - get tagIDs as array for each selected tag in addList
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _getSelectedTagIDs = function() {

        // get tag name array
        var currentTagString = $addList.val();
        var tagIDs = [];

        if (currentTagString !== '') {

            // get id for each tag name
            _.each(currentTagString.split(','), function(tag) {

                if (_.has(activeAddTags, tag)) {
                    tagIDs.push(activeAddTags[tag].id);
                } else {
                    tagIDs.push(tag);
                }
            });
        }
        return tagIDs;
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _selectAddListTags - select tags specified in select2 list
    * @param tagList - array - ids of tags to select
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _selectAddListTags = function(tagList) {

        var newTags = [];

        // iterate tagList
        _.each(tagList, function(id, tagID) {
            // get tagName
            var tagName = getTagName(tagID);
            newTags.push(tagName);
        });

        $addList.val(newTags).trigger({
            type: 'change',
            reset: false
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _populateActiveTags - populate activeTags with tags which have items assigned
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _populateActiveTags = function() {

        var itemDataDirectory = ItemData.getItemDirectory();

        // reset activeTags
        activeTags = {};

        // iterate items in itemDirectory
        _.each(itemDataDirectory, function(item, key) {

            // iterate tags
            _.each(item.tags, function(id, tag) {

                // if tag not in activeTags: add it
                if (typeof activeTags[tag] === 'undefined') {
                    activeTags[tag] = true;
                }
            });
        });
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _parseGetTagsResponse - populate local tag data from getTags response
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _parseGetTagsResponse = function(tagData) {

        // temp tag tagData
        var tagItem = {};

        // iterate tagData
        for (var i = 0, len = tagData.length; i < len; i++) {

            tagItem = {};

            // get attributes
            tagItem.name = tagData[i].tagName.toLowerCase();
            tagItem.id = tagData[i].tagID;

            // check if tagID is in activeTags before adding to view tag
            if (typeof activeTags[tagItem.id] !== 'undefined') {

                // add to view lists object
                activeViewTags[tagItem.name] = tagItem;

            } else {
                emptyViewTags[tagItem.name] = tagItem;
            }

            // add all to add tag objects
            activeAddTags[tagItem.name] = tagItem;
            tagIndex[tagItem.id] = tagItem.name;
        }
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * _sortListItemByName
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var _sortListItemByName = function(a, b) {

        var name_a = a.name;
        var name_b = b.name;

        return name_a.toLowerCase().localeCompare(name_b.toLowerCase());
    };


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * PUBLIC METHODS -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var publicMethods = {
        'init': init,
        'getTags': getTags,
        'getTags_result': getTags_result,
        'renderViewLists': renderViewLists,
        'getTagName': getTagName,
        'getTagCount': getTagCount,
        'getTagsToAdd': getTagsToAdd,
        'getTagsToDelete': getTagsToDelete,
        'updateInitialItemTags': updateInitialItemTags,
        'addTag': addTag,
        'deleteTag': deleteTag,
        'removeTagFromAddList': removeTagFromAddList,
        'selectTagsFromDirectory': selectTagsFromDirectory,
        'updateUserTags': updateUserTags,
        'selectUserTags': selectUserTags,
        'updateViewList': updateViewList,
        'resetAddList': resetAddList,
        'isAddListChanged': isAddListChanged
    };

    $.extend(TagView, publicMethods);


})(tmz.module('tagView'), tmz, jQuery, _);

// FILTER PANEL
(function(FilterPanel, tmz, $, _, moment) {
	"use strict";

	console.info('filterPanel');

	// dependecies
	var Utilities = tmz.module('utilities'),

		// node cache
		$filtersModal = $('#filters-modal'),

		// filters
		$releaseDateFilter = $('#releaseDate_filter'),
		$gameStatusFilter = $('#gameStatus_filter'),
		$playStatusFilter = $('#playStatus_filter'),
		$metascoreFilter = $('#metascore_filter'),
		$platformFilter = $('#platformFilterList');

		// data

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.init = function() {

		FilterPanel.createEventHandlers();

		// init select2
		$platformFilter.select2({
			placeholder: "Select platform",
			allowClear: true
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.createEventHandlers = function() {

		// filter buttons
        $filtersModal.on('click', '.btn-group button', function(e) {
            e.preventDefault();
        });
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showFilterPanel
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.showFilterPanel = function() {

		$filtersModal.modal('show');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.getFilters = function() {

		var filters = {};
		filters.releaseDateFilters = [];
		filters.metascoreFilters = [];
		filters.platformFilters = [];
		filters.gameStatusFilters = [];
		filters.playStatusFilters = [];

		// iterate all release date filter options
		$releaseDateFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.releaseDateFilters.push(true);
			} else {
				filters.releaseDateFilters.push(false);
			}
		});

		// iterate all metascore filter options
		$metascoreFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.metascoreFilters.push(true);
			} else {
				filters.metascoreFilters.push(false);
			}
		});

		// iterate all gamestauts filter options
		$gameStatusFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.gameStatusFilters.push(true);
			} else {
				filters.gameStatusFilters.push(false);
			}
		});

		// iterate all playstatus filter options
		$playStatusFilter.find('button').each(function() {

			if ($(this).hasClass('active')) {
				filters.playStatusFilters.push(true);
			} else {
				filters.playStatusFilters.push(false);
			}
		});

		// iterate platform filter options
		var filtersString = $platformFilter.val();
		var platformFilters = [];

		if (filtersString && filtersString !== '') {
			platformFilters = filtersString.split(',');
		}

		_.each(platformFilters, function(filter, index) {
			filters.platformFilters[index] = Utilities.getStandardPlatform(filter);
		});

		return filters;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyListJSFiltering -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.applyListJSFiltering = function(list) {

		// get filters
		var filters = FilterPanel.getFilters();
		var filtered = false;

		// apply filters
		list.filter(function(itemValues) {

			var releaseDateStatus = FilterPanel.releaseDateFilter(itemValues.releaseDate, filters.releaseDateFilters);
			var metascoreStatus = FilterPanel.metascoreFilter(itemValues.metascore, filters.metascoreFilters);
			var platformStatus = FilterPanel.platformFilter(itemValues.platform, filters.platformFilters);
			var gameStatus = FilterPanel.gameStatusFilter(itemValues.gameStatus, filters.gameStatusFilters);
			var playStatus = FilterPanel.playStatusFilter(itemValues.playStatus, filters.playStatusFilters);

			// not filtered
			if (releaseDateStatus && metascoreStatus && platformStatus && playStatus && gameStatus) {
				return true;
			}

			// filtered out
			filtered = true;
			return false;
		});

		return filtered;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* applyIsotopeFiltering -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.applyIsotopeFiltering = function($gridViewContainer, sortType, sortAsc) {

		var filters = FilterPanel.getFilters();
		var filtered = false;

		// get selected items
		var selectedItems = $('.gridItem').filter(function(index){

			var $this = $(this);

			// releaseDate
			var releaseDate = $this.find('.releaseDate').text();
			var releaseDateFiltered = FilterPanel.releaseDateFilter(releaseDate, filters.releaseDateFilters);

			// metacriticScore
			var metacriticScore = $this.find('.metacriticScore').text();
			var metacriticScoreFiltered =  FilterPanel.metascoreFilter(metacriticScore, filters.metascoreFilters);

			// platform
			var platform = $this.find('.platform .data').text();
			var platformFiltered =  FilterPanel.platformFilter(platform, filters.platformFilters);

			// gameStatus
			var gameStatus = $this.find('.gameStatus').text();
			var gameStatusFiltered =  FilterPanel.gameStatusFilter(gameStatus, filters.gameStatusFilters);

			// playStatus
			var playStatus = $this.find('.playStatus').text();
			var playStatusFiltered =  FilterPanel.playStatusFilter(playStatus, filters.playStatusFilters);

			if (releaseDateFiltered && gameStatusFiltered && playStatusFiltered && metacriticScoreFiltered && platformFiltered) {
				return true;
			}

			filtered = true;
			return false;
		});

		// apply isotope filter and keep current sort
		$gridViewContainer.isotope({
			filter: selectedItems,
			sortBy : sortType,
			sortAscending : sortAsc
		});

		return filtered;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* resetFilters -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.resetFilters = function() {

		// iterate all release date filter options
		$releaseDateFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all metascore filter options
		$metascoreFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all gamestauts filter options
		$gameStatusFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all playstatus filter options
		$playStatusFilter.find('button').each(function() {
			$(this).removeClass('active');
		});

		// iterate all platform options, deselect
		$platformFilter.val(['']).trigger('change');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* quick filters
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.upcomingQuickFilter = function(list) {
		// activate filter panel option
		$releaseDateFilter.find('button[data-content="0"]').addClass('active');
	};
	FilterPanel.newReleasesQuickFilter = function(list) {
		$releaseDateFilter.find('button[data-content="1"]').addClass('active');
	};
	FilterPanel.neverPlayedQuickFilter = function(list) {
		$playStatusFilter.find('button[data-content="0"]').addClass('active');
	};
	FilterPanel.gamesPlayingQuickFilter = function(list) {
		$playStatusFilter.find('button[data-content="1"]').addClass('active');
	};
	FilterPanel.gamesPlayedQuickFilter = function(list) {
		$playStatusFilter.find('button[data-content="2"]').addClass('active');
	};
	FilterPanel.finishedGamesQuickFilter = function(list) {
		$playStatusFilter.find('button[data-content="3"]').addClass('active');
	};
	FilterPanel.ownedGamesQuickFilter = function(list) {
		$gameStatusFilter.find('button[data-content="1"]').addClass('active');
	};
	FilterPanel.wantedGamesQuickFilter = function(list) {
		$gameStatusFilter.find('button[data-content="3"]').addClass('active');
	};
	FilterPanel.platformQuickFilter = function(platform) {
		$platformFilter.val(platform).trigger('change');
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* releaseDateFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.releaseDateFilter = function(rawReleaseDate, filterList) {

		// filter config (1: unreleased, 2: released)
		var unreleasedFilter = filterList[0];
		var releasedFilter = filterList[1];

		var releaseDate = null;
		if (rawReleaseDate === '1900-01-01') {
			releaseDate = moment().add('days', 1);
		} else {
			releaseDate = moment(rawReleaseDate, 'YYYY-MM-DD');
		}
		var currentDate = moment();

		var diff = releaseDate.diff(currentDate, 'seconds');

		// all filters active - ignore filter
		if (unreleasedFilter && releasedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!unreleasedFilter && !releasedFilter) {
			return true;

		// specific filter
		} else if (unreleasedFilter && diff > 0) {
			return true;
		} else if (releasedFilter && diff < 0) {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* gameStatusFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.gameStatusFilter = function(gameStatus, filterList) {

		var noneFilter = filterList[0];
		var ownFilter = filterList[1];
		var soldFilter = filterList[2];
		var wantedFilter = filterList[3];

		// all filters active - ignore filter
		if (noneFilter && ownFilter && soldFilter && wantedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!noneFilter && !ownFilter && !soldFilter && !wantedFilter) {
			return true;

		// specific filters
		} else if (noneFilter && gameStatus === '0') {
			return true;
		} else if (ownFilter && gameStatus === '1') {
			return true;
		} else if (soldFilter && gameStatus === '2') {
			return true;
		} else if (wantedFilter && gameStatus === '3') {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* playStatusFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.playStatusFilter = function(playStatus, filterList) {

		var notPlayingFilter = filterList[0];
		var playingFilter = filterList[1];
		var playedFilter = filterList[2];
		var finishedFilter = filterList[3];

		// all filters active - ignore filter
		if (notPlayingFilter && playingFilter && playedFilter && finishedFilter) {
			return true;

		// no filters selected - ignore filter
		} else if (!notPlayingFilter && !playingFilter && !playedFilter && !finishedFilter) {
			return true;

		// specific filters
		} else if (notPlayingFilter && playStatus === '0') {
			return true;
		} else if (playingFilter && playStatus === '1') {
			return true;
		} else if (playedFilter && playStatus === '2') {
			return true;
		} else if (finishedFilter && playStatus === '3') {
			return true;
		}

		// filtered
		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* metascoreFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.metascoreFilter = function(metascore, filterList) {

		var _90sFilter = filterList[0];
		var _80sFilter = filterList[1];
		var _70sFilter = filterList[2];
		var _60sFilter = filterList[3];
		var _50sFilter = filterList[4];
		var _25to49Filter = filterList[5];
		var _0to24Filter = filterList[6];

		var score = parseInt(metascore, 10);

		// all filters selected - ignore filter
		if (_90sFilter && _80sFilter && _70sFilter && _60sFilter && _50sFilter && _25to49Filter && _0to24Filter) {
			return true;

		// no filters selected - ignore filter
		} else if (!_90sFilter && !_80sFilter && !_70sFilter && !_60sFilter && !_50sFilter && !_25to49Filter && !_0to24Filter) {
			return true;

		// specifc filter
		} else if (_90sFilter && score >= 90) {
			return true;
		} else if (_80sFilter && score >= 80 && score < 90) {
			return true;
		} else if (_70sFilter && score >= 70 && score < 80) {
			return true;
		} else if (_60sFilter && score >= 60 && score < 70) {
			return true;
		} else if (_50sFilter && score >= 50 && score < 60) {
			return true;
		} else if (_25to49Filter && score >= 25 && score < 50) {
			return true;
		} else if (_0to24Filter && score >= 0 && score < 25) {
			return true;
		}

		return false;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* platformFilter -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	FilterPanel.platformFilter = function(platform, filterList) {

		// platform filter list empty - no filter
		if (filterList.length === 0) {
			return true;
		}

		// iterate platform list
		for (var i = 0, len = filterList.length; i < len; i++) {

			if (filterList[i].name === platform) {
				return true;
			}
		}

		return false;
	};

})(tmz.module('filterPanel'), tmz, $, _, moment);

// VideoPanel
(function(VideoPanel, _V_, tmz, $, _, moment) {
	"use strict";
	console.info('VideoPanel');

	// constants
	var GIANT_BOMB_VIDEO_PATH = 'http://media.giantbomb.com/video/',
		VIDEO_PLAYER_ID = 'videoPlayer',
		VIDEO_SET_HEIGHT = 91,
		VIDEOS_PER_SET = 5,

		// properties
		currentVideoSet = 0,
		currentMaxVideoSet = null,
		currentVideoCount = 0,
		currentVideoIndex = 0,
		previousVideoIndex = 0,

		// data
		currentVideos = [],		// current item videos

		// objects
		videoJSPLayer = null,

		// jquery cache
		$videoModal = $('#video-modal'),
		$videoListContainer = $('#videoListContainer'),
		$videoList = $('#videoList'),
		$videoPlayer = $('#videoPlayer'),
		$videoListNavigation = $('#videoListNavigation'),
		$navigateLeft = $videoListNavigation.find('.navigateLeft'),
		$navigateRight = $videoListNavigation.find('.navigateRight'),
		$pageNumberText = $videoListNavigation.find('.pageNumber'),

		// templates
		videoResultsTemplate = _.template($('#video-results-template').html());

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* init
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	VideoPanel.init = function() {

		// init video js
		videoJSPLayer = _V_(VIDEO_PLAYER_ID);

		// create event handlers
		VideoPanel.createEventHandlers();

		// show video modal
		$videoModal.modal({backdrop: true, show: false});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* createEventHandlers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    VideoPanel.createEventHandlers = function() {

		// videoList li: click
		$videoList.on('click', 'li', function(e) {
			e.preventDefault();

			var id = $(this).attr('data-id');
			changeVideoSource(Number(id));

			playCurrentVideo();
		});

		// navigateLeft: click
		$navigateLeft.click(function(e) {
			previousVideoSet();
		});
		// navigateRight: click
		$navigateRight.click(function(e) {
			nextVideoSet();
		});

		// videoModal: hidden
		$videoModal.on('hidden', function () {
			pauseCurrentVideo();
		});

		// video js: video ended
		videoJSPLayer.addEvent("ended", playNextVideo);
    };

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    * showVideoPanel -
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    VideoPanel.showVideoPanel = function() {

		$('html, body').scrollTop(0);

		// show video modal
		$videoModal.modal('show');

		playCurrentVideo();
    };

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* renderVideoModal -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	VideoPanel.renderVideoModal = function(videoResults) {

		currentVideos = $.extend(true, [], videoResults);

		if (currentVideos.length !== 0) {

			// get video count
			currentVideoCount = currentVideos.length;

			// reset max, videoIndex
			currentMaxVideoSet = null;
			currentVideoIndex = 0;

			// format data
			formatVideoData(currentVideos);

			// get model data
			var templateData = {'videoResults': currentVideos};

			// render video list
			$videoList.html(videoResultsTemplate(templateData));

			// update video source
			changeVideoSource(0);

			// change videoSet to default
			currentVideoSet = 0;
			changeVideoSet(0);

			// init popover
			$videoList.find('a').popover({'placement': 'top', 'animation': true});

			showVideoListNavigation();
		}

		if (currentVideos.length <= VIDEOS_PER_SET) {
			hideVideoListNavigation();
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* formatVideoData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var formatVideoData = function(videoArray) {

		// iterate videoArray and add new attributes
		for (var i = 0, len = videoArray.length; i < len; i++) {

			// format publish date
			videoArray[i].publishDate = moment(videoArray[i].publish_date, "YYYY-MM-DD").calendar();
			delete videoArray[i].publish_date;

			// format video length
			var minutes = Math.floor(videoArray[i].length_seconds / 60);
			var seconds = (videoArray[i].length_seconds % 60).toString();
			if (seconds.length === 1) {
				seconds = '0' + seconds;
			}
			delete videoArray[i].length_seconds;


			videoArray[i].runningTime = minutes + ':' + seconds;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* playNextVideo -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var playNextVideo = function() {

		if (currentVideoIndex === currentVideoCount - 1) {
			currentVideoIndex = 0;
		} else {
			currentVideoIndex++;
		}

		// play next
		changeVideoSource(currentVideoIndex);

		// change video set
		if (currentVideoIndex % VIDEOS_PER_SET === 0) {

			var set = Math.floor(currentVideoIndex / VIDEOS_PER_SET);
			changeVideoSet(set);
		}

		playCurrentVideo();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeVideoSource -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeVideoSource = function(index) {

		currentVideoIndex = index;

		// get video url
		var url = currentVideos[index].url;

		// add 'playing' class to videoList item
		var $currentVideoItem = $videoList.find('li[data-id="' + index + '"]');
		var $previousVideoItem = $videoList.find('li[data-id="' + previousVideoIndex + '"]');
		$previousVideoItem.removeClass('playing');
		$currentVideoItem.addClass('playing');

		// update videoPlayer source
		var videoURLParts = url.split('.');
		var videoURL = GIANT_BOMB_VIDEO_PATH + videoURLParts[0] + '_3500.' + videoURLParts[1];
		videoJSPLayer.src(videoURL);

		previousVideoIndex = index;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* playCurrentVideo -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var playCurrentVideo = function() {

		videoJSPLayer.play();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* pauseCurrentVideo -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var pauseCurrentVideo = function() {

		videoJSPLayer.pause();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* hideVideoListNavigation -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var hideVideoListNavigation = function() {
		$videoListNavigation.hide();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* showVideoListNavigation -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var showVideoListNavigation = function() {
		$videoListNavigation.show();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* previousVideoSet -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var previousVideoSet = function() {

		// get set height
		var maxVideoSet = getMaxVideoSet();

		if (currentVideoSet > 0) {
			changeVideoSet(--currentVideoSet);
		// reached min > loop to max
		} else {
			changeVideoSet(maxVideoSet);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* nextVideoSet -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var nextVideoSet = function() {

		// get set height
		var maxVideoSet = getMaxVideoSet();

		if (currentVideoSet < maxVideoSet) {
			changeVideoSet(++currentVideoSet);

		// reached max > loop to 0
		} else {
			changeVideoSet(0);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMaxVideoSet -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMaxVideoSet = function() {

		if (!currentMaxVideoSet) {
			currentMaxVideoSet = Math.ceil(currentVideoCount / VIDEOS_PER_SET) - 1;
		}

		return currentMaxVideoSet;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* changeVideoSet -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var changeVideoSet = function(set) {

		var position = -(set * VIDEO_SET_HEIGHT);
		currentVideoSet = set;

		// animate position
		$videoList.stop().animate({top: position}, 250, function() {

		});

		// set page number
		$pageNumberText.text(Number(set + 1) + ' / ' + Number(getMaxVideoSet() + 1));
	};


})(tmz.module('videoPanel'), _V_, tmz, jQuery, _, moment);


// Amazon
(function(Amazon, tmz, $, _, moment) {
	"use strict";

	console.info('amazon');

    // module references
    var Utilities = tmz.module('utilities'),

		// constants
		FILTERED_NAMES = [
			'accessory',
			'case',
			'codes',
			'combo',
			'console',
			'controller',
			'covers',
			'face plate',
			'faceplate',
			'head set',
			'headset',
			'import',
			'japan',
			'kit',
			'map',
			'membership',
			'new',
			'pack',
			'poster',
			'pre-paid',
			'set',
			'shell',
			'skin',
			'software',
			'stylus',
			'wireless'
		],

		// REST URLS
		AMAZON_SEARCH_URL = tmz.api + 'amazon/search/',
		AMAZON_DETAIL_URL = tmz.api + 'amazon/detail/',

		// data
		amazonOffersCache = {},
		amazonItemCache = {},

		// request queues
		getAmazonItemOffersQueue = {},
		getAmazonItemDetailQueue = {},

		// ajax requests
		searchAmazonRequest = null,
		searchAmazonID = 0;

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchAmazon - search amazon, prevent all but latest from completing and returning onSuccess method
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.searchAmazon = function(keywords, browseNode, onSuccess, onError) {

		var searchTerms = encodeURIComponent(keywords);

		// browse node, search terms and response group in url
		var requestData = {
			'keywords': keywords,
			'browse_node': browseNode,
			'search_index': 'VideoGames',
			'response_group': 'ItemAttributes,Images',
			'page': 1
		};

		// abort previous request
		if (searchAmazonRequest) {
			searchAmazonRequest.abort();
		}

		// increment searchAmazonID and assign to local id
		var id = ++searchAmazonID;

		searchAmazonRequest = $.ajax({
			url: AMAZON_SEARCH_URL,
			type: 'GET',
			data: requestData,
			dataType: 'xml',
			cache: true,
			success: function(data) {


				// only allow latest request from returning onSuccess
				if (id === searchAmazonID) {
					searchAmazonRequest = null;
					onSuccess(data);
				}
			},
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.parseAmazonResultItem = function($resultItem) {

		var isFiltered = false;
		var	filter = '(' + FILTERED_NAMES.join('|') + ')';
		var	re = new RegExp(filter, 'i');

		// get attributes from xml for filter check
		var itemData = {
			name: $resultItem.find('Title').text(),
			platform: $resultItem.find('Platform').text()
		};

		// result has been filtered
		if (re.test(itemData.name) || itemData.platform === '') {

			itemData.isFiltered = true;

		// not filtered > add more properties to itemData
		} else {

			itemData.id = $resultItem.find('ASIN').text();
			itemData.asin = $resultItem.find('ASIN').text();
			itemData.gbombID = 0;
			itemData.smallImage = $resultItem.find('ThumbnailImage > URL:first').text() || '';
			itemData.thumbnailImage = $resultItem.find('MediumImage > URL:first').text() || '';
			itemData.largeImage = $resultItem.find('LargeImage > URL:first').text() || '';
			itemData.description = $resultItem.find('EditorialReview > Content:first').text() || '';
			itemData.releaseDate = $resultItem.find('ReleaseDate').text() || '1900-01-01';

			// add custom formatted properties
			// standard platform name
			itemData.platform = Utilities.matchPlatformToIndex(itemData.platform).name;
			// relative/calendar date
			if (itemData.releaseDate !== '1900-01-01') {
				itemData.calendarDate = moment(itemData.releaseDate, "YYYY-MM-DD").calendar();
			} else {
				itemData.calendarDate = 'Unknown';
			}
		}

		return itemData;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemDetail
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.getAmazonItemDetail = function(asin, onSuccess, onError) {

		// find in giant bomb data cache first
		var cachedItem = getCachedItem(asin);

		// load cached gb data
		if (cachedItem) {

			// return updated source item
			onSuccess(cachedItem);

		// download amazon item
		} else {

			// add to queue
			if (!_.has(getAmazonItemDetailQueue, asin)) {
				getAmazonItemDetailQueue[asin] = [];
			}
			getAmazonItemDetailQueue[asin].push(onSuccess);

			// run for first call only
			if (getAmazonItemDetailQueue[asin].length === 1) {

				// browse node, search terms and response group in url
				var requestData = {
					'asin': asin,
					'response_group': 'Medium'
				};

				$.ajax({
					url: AMAZON_DETAIL_URL,
					type: 'GET',
					data: requestData,
					dataType: 'xml',
					cache: true,
					success: function(data) {

						// iterate queued return methods
						_.each(getAmazonItemDetailQueue[asin], function(successMethod) {

							// cache result
							amazonItemCache[asin] = data;

							// return data
							successMethod(data);
						});

						// empty queue
						getAmazonItemDetailQueue[asin] = [];
					},
					error: onError
				});
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemOffers
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Amazon.getAmazonItemOffers = function(asin, sourceItem, onSuccess, onError) {

		// find in amazon offer cache first
		var cachedOffer = getCachedOffer(asin);
		// load cached amazon offer
		if (cachedOffer) {
			// add score data to source item
			sourceItem.offers = cachedOffer;

			// return updated source item
			onSuccess(cachedOffer);

		// get new offer data
		} else {

			// add to queue
			if (!_.has(getAmazonItemOffersQueue, asin)) {
				getAmazonItemOffersQueue[asin] = [];
			}
			getAmazonItemOffersQueue[asin].push(onSuccess);

			// run for first call only
			if (getAmazonItemOffersQueue[asin].length === 1) {

				// OfferSummary, OfferListings, Offers, OfferFull
				var requestData = {
					'asin': asin,
					'response_group': 'OfferFull'
				};

				$.ajax({
					url: AMAZON_DETAIL_URL,
					type: 'GET',
					data: requestData,
					dataType: 'xml',
					cache: true,
					success: function(data) {

						// iterate queued return methods
						_.each(getAmazonItemOffersQueue[asin], function(successMethod) {

							// parse
							var offerItem = parseAmazonOffers(data, sourceItem);

							// cache result
							amazonOffersCache[asin] = offerItem;

							// return data
							successMethod(offerItem);
						});

						// empty queue
						getAmazonItemOffersQueue[asin] = [];
					},
					error: onError
				});
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* formatOfferData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var formatOfferData = function(offerItem) {

		var buyNowPrice = null;
		var buyNowRawPrice = null;


		// iterate offers
		for (var i = 0, len = offerItem.offers.length; i < len; i++) {
			if (offerItem.offers[i].availability === 'now') {
				buyNowPrice = offerItem.offers[i].price;
				buyNowRawPrice = offerItem.offers[i].rawPrice;
			}
		}

		buyNowPrice = buyNowPrice || offerItem.lowestNewPrice;

		// check for 'too low to display'
		if (buyNowPrice === 'Too low to display') {
			buyNowPrice = 'n/a';
			buyNowRawPrice = 0;
		}
		if (offerItem.lowestNewPrice === 'Too low to display') {
			offerItem.lowestNewPrice = 'n/a';
		}

		offerItem.buyNowPrice = buyNowPrice;
		offerItem.buyNowRawPrice = buyNowRawPrice;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedOffer -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedOffer = function(asin) {

		var amazonOfferItem = null;

		if (typeof amazonOffersCache[asin] !== 'undefined') {
			amazonOfferItem = amazonOffersCache[asin];
		}

		return amazonOfferItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedItem = function(id) {

		var amazonItem = null;

		if (typeof amazonItemCache[id] !== 'undefined') {
			amazonItem = amazonItemCache[id];
		}

		return amazonItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOffers -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonOffers = function(data, sourceItem) {

		var offerItem = {};

		// iterate xml results, construct offers
		$('Item', data).each(function() {

			// parse amazon result item, add data to offerItem
			offerItem = parseAmazonOfferItem($(this));
		});

		// add offerItem to item model
		sourceItem.offers = offerItem;

		return offerItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseAmazonOfferItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseAmazonOfferItem = function($resultItem) {

		var offerItem = {};
		var offer = {};

		// remove $ sign
		var re = /\$/;

		// get attributes from xml
		offerItem.lowestNewPrice = $resultItem.find('LowestNewPrice FormattedPrice').text().replace(re, '');
		offerItem.lowestUsedPrice = $resultItem.find('LowestUsedPrice FormattedPrice').text().replace(re, '');
		offerItem.totalNew = $resultItem.find('TotalNew').text();
		offerItem.totalUsed = $resultItem.find('TotalUsed').text();
		offerItem.totalOffers = $resultItem.find('TotalOffers').text();
		offerItem.offersURL = $resultItem.find('MoreOffersUrl').text();
		offerItem.offersURLNew = $resultItem.find('MoreOffersUrl').text() + '&condition=new';
		offerItem.offersURLUsed = $resultItem.find('MoreOffersUrl').text() + '&condition=used';

		// convert offer url to a product url
		var offerRE = /offer-listing/gi;
		offerItem.productURL = offerItem.offersURL.replace(offerRE, 'product');
		offerItem.offers = [];

		// iterate offers
		$('Offer', $resultItem).each(function() {

			offer = {};

			offer.price = $(this).find('Price FormattedPrice').text().replace(re, '');
			offer.rawPrice = $(this).find('Price Amount').text();
			offer.availability = $(this).find('AvailabilityType').text();
			offer.freeShipping = $(this).find('IsEligibleForSuperSaverShipping').text();

			offerItem.offers.push(offer);
		});

		// format offer data
		formatOfferData(offerItem);

		return offerItem;
	};

})(tmz.module('amazon'), tmz, jQuery, _, moment);


// GiantBomb
(function(GiantBomb, tmz, $, _, moment) {
	"use strict";

	console.info('giantBomb');

    // module references
	var Amazon = tmz.module('amazon'),

		// REST URLS
		GIANTBOMB_SEARCH_URL = tmz.api + 'giantbomb/search/',
		GIANTBOMB_DETAIL_URL = tmz.api + 'giantbomb/detail/',

		// data
		giantBombDataCache = {},
		giantBombItemCache = {},

		// request queue
		getGiantBombItemDataQueue = {},
		getGiantBombItemDetailQueue = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchGiantBomb -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.searchGiantBomb = function(keywords, onSuccess, onError) {

		var searchTerms = encodeURIComponent(keywords);

		// list of fields to get as query parameter
		var fieldList = ['id', 'name', 'original_release_date', 'image'];

		var requestData = {
			'field_list': fieldList.join(','),
			'keywords': keywords,
			'page': 0
		};

		$.ajax({
			url: GIANTBOMB_SEARCH_URL,
			type: 'GET',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseGiantBombResultItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.parseGiantBombResultItem = function(resultItem) {
		var itemData = {
			id: resultItem.id,
			asin: 0,
			gbombID: resultItem.id,
			name: resultItem.name,
			platform: 'n/a'
		};

		// format date
		if (resultItem.original_release_date && resultItem.original_release_date !== '') {
			itemData.releaseDate = resultItem.original_release_date.split(' ')[0];
		} else {
			itemData.releaseDate = '1900-01-01';
		}

		// calendar date
		if (itemData.releaseDate !== '1900-01-01') {
			itemData.calendarDate = moment(itemData.releaseDate, "YYYY-MM-DD").calendar();
		} else {
			itemData.calendarDate = 'Unknown';
		}

		// set small url
		if (resultItem.image && resultItem.image.small_url && resultItem.image.small_url !== '') {
			itemData.smallImage = resultItem.image.small_url;
		} else {
			itemData.smallImage = 'no image.png';
		}

		// set thumb url
		if (resultItem.image && resultItem.image.thumb_url && resultItem.image.thumb_url !== '') {
			itemData.thumbnailImage = resultItem.image.thumb_url;
		} else {
			itemData.thumbnailImage = 'no image.png';
		}

		// set large url
		if (resultItem.image && resultItem.image.super_url && resultItem.image.super_url !== '') {
			itemData.largeImage = resultItem.image.super_url;
		} else {
			itemData.largeImage = 'no image.png';
		}

		// set description
		if (resultItem.description && resultItem.description  !== '') {
			itemData.description = resultItem.description;
		} else {
			itemData.description = 'No Description';
		}

		return itemData;
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.getGiantBombItemPlatform = function(gbombID, onSuccess, onError) {

		// list of fields to get as query parameter
		var fieldList = ['platforms'];

		getGiantBombItem(gbombID, fieldList, function(data) {
			onSuccess(data, gbombID);
		}, onError);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.getGiantBombItemData = function(gbombID, onSuccess, onError) {

		// find in giant bomb data cache first
		var cachedData = getCachedData(gbombID);

		// load cached gb data
		if (cachedData) {

			// return updated source item
			onSuccess(cachedData);

		// download gb data
		} else {

			// add to queue
			if (!_.has(getGiantBombItemDataQueue, gbombID)) {
				getGiantBombItemDataQueue[gbombID] = [];
			}
			getGiantBombItemDataQueue[gbombID].push(onSuccess);

			// run for first call only
			if (getGiantBombItemDataQueue[gbombID].length === 1) {

				// download data
				var fieldList = ['description', 'site_detail_url', 'videos'];

				// giantbomb item request
				getGiantBombItem(gbombID, fieldList, function(data) {

					// iterate queued return methods
					_.each(getGiantBombItemDataQueue[gbombID], function(successMethod) {

						// cache result
						giantBombDataCache[gbombID] = data.results;

						// return data
						successMethod(data.results);
					});

					// empty queue
					getGiantBombItemDataQueue[gbombID] = [];

				}, onError);
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemDetail -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GiantBomb.getGiantBombItemDetail = function(gbombID, onSuccess, onError) {

		// find in giant bomb data cache first
		var cachedItem = getCachedItem(gbombID);

		// load cached gb data1
		if (cachedItem) {

			// return updated source item
			onSuccess(cachedItem);

		// download gb item
		} else {

			// add to queue
			if (!_.has(getGiantBombItemDetailQueue, gbombID)) {
				getGiantBombItemDetailQueue[gbombID] = [];
			}
			getGiantBombItemDetailQueue[gbombID].push(onSuccess);

			// run for first call only
			if (getGiantBombItemDetailQueue[gbombID].length === 1) {

				// download data
				var fieldList = ['id', 'name', 'original_release_date', 'image'];

				// giantbomb item request
				getGiantBombItem(gbombID, fieldList, function(data) {

					// iterate queued return methods
					_.each(getGiantBombItemDetailQueue[gbombID], function(successMethod) {

						// cache result
						giantBombItemCache[gbombID] = data.results;

						// return data
						successMethod(data.results);
					});

					// empty queue
					getGiantBombItemDetailQueue[gbombID] = [];

				}, onError);
			}
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItem = function(gbombID, fieldList, onSuccess, onError) {

		var requestData = {
			'field_list': fieldList.join(','),
			'id': gbombID
		};

		$.ajax({
			url: GIANTBOMB_DETAIL_URL,
			type: 'GET',
			data: requestData,
			dataType: 'json',
			cache: true,
			success: onSuccess,
			error: onError
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(id) {

		var giantBombData = null;

		if (typeof giantBombDataCache[id] !== 'undefined') {
			giantBombData = giantBombDataCache[id];
		}

		return giantBombData;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedItem = function(id) {

		var giantBombItem = null;

		if (typeof giantBombItemCache[id] !== 'undefined') {
			giantBombItem = giantBombItemCache[id];
		}

		return giantBombItem;
	};


})(tmz.module('giantbomb'), tmz, jQuery, _, moment);


// Metacritic
(function(Metacritic, tmz, $, _) {
	"use strict";

	console.info('Metacritic');

    // module references
	var Amazon = tmz.module('amazon'),
		ItemLinker = tmz.module('itemLinker'),
		ItemData = tmz.module('itemData'),

		// REST URL
		METACRITIC_SEARCH_URL = tmz.api + 'metacritic/search/',
		METACRITIC_CACHE_URL = tmz.api + 'metacritic/cache/',

		// properties
		metacriticDomain = 'metacritic.com',

		// data
		metascoreCache = {},

		// request queues
		getMetascoreQueue = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Metacritic.getMetascore = function(searchTerms, sourceItem, fromSearch, onSuccess) {

		var ajax = null;

		// find in cache first
		var cachedScore = getCachedMetascore(sourceItem.asin, sourceItem.gbombID, sourceItem.platform);

		if (cachedScore) {

			// add score data to source item
			sourceItem.metascore = cachedScore.metascore;
			sourceItem.metascorePage = cachedScore.metascorePage;

			// return updated source item
			onSuccess(sourceItem);

		// fetch score data
		} else {

			// add to queue
			var queueKey = searchTerms + '_' + sourceItem.platform;

			if (!_.has(getMetascoreQueue, queueKey)) {
				getMetascoreQueue[queueKey] = [];
			}
			getMetascoreQueue[queueKey].push(onSuccess);

			// run for first call only
			if (getMetascoreQueue[queueKey].length === 1) {

				var cleanedSearchTerms = cleanupMetacriticSearchTerms(searchTerms);

				var requestData = {
					'keywords': encodeURI(cleanedSearchTerms),
					'platform': encodeURI(sourceItem.platform)
				};

				ajax = $.ajax({
						url: METACRITIC_SEARCH_URL,
						type: 'GET',
						data: requestData,
						cache: true,
						success: function(data) {

							// save values before updated with current info
							var previousMetascore = sourceItem.metascore;

							// parse result > modify sourceItem
							var result = parseMetascoreResults(cleanedSearchTerms, data, sourceItem);

							// add results to sourceItem
							addMetascoreDatatoItem(result, sourceItem);

							// check if source item score or page differs from return score/page
							if (!fromSearch && sourceItem.metascore != previousMetascore) {
								// update metacritic data for source item record
								ItemData.updateMetacritic(sourceItem);
							}

							// iterate queued return methods
							_.each(getMetascoreQueue[queueKey], function(successMethod) {
								// add to local cache
								addToMetascoreCache(sourceItem.asin, sourceItem.gbombID, sourceItem.platform, sourceItem);
								// return data
								successMethod(sourceItem);
							});

							// empty queue
							getMetascoreQueue[queueKey] = [];
						}
					});
			}
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayMetascoreData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Metacritic.displayMetascoreData = function(page, score, metascoreSelector) {

		var $metascoreContainer = $(metascoreSelector);
		var textScore = score;

		// determine score color
		var colorClass = 'favorable';
		if (score < 0) {
			textScore = 'n/a';
			colorClass = 'unavailable';
		} else if (score < 50) {
			colorClass = 'unfavorable';
		} else if (score < 75) {
			colorClass = 'neutral';
		}

		$metascoreContainer
			.html(textScore)
			.removeClass('unavailable')
			.removeClass('unfavorable')
			.removeClass('neutral')
			.removeClass('favorable')
			.addClass(colorClass)
			.attr('href', 'http://www.' + metacriticDomain + page)
			.attr('data-score', score)
			.attr('data-original-title', metacriticDomain + ' ' + page)
			.show();

		// activate tooltip
		$metascoreContainer.tooltip({placement: 'left'});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cleanupMetacriticSearchTerms -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cleanupMetacriticSearchTerms = function(searchTerms) {

		// remove ':', '&'
		re = /\s*[:&]\s*/g;
		var cleanedSearchTerms = searchTerms.replace(re, ' ');

		// convert spaces to '+'
		var re = /\s/g;
		cleanedSearchTerms = cleanedSearchTerms.replace(re, '+');

		return cleanedSearchTerms;
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedMetascore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedMetascore = function(asin, gbombID, platform) {

		var metascoreItem = null;

		// amazon id
		if (typeof metascoreCache[asin + '_' + platform] !== 'undefined') {
			metascoreItem = metascoreCache[asin + '_' + platform];

		// giant bomb id
		} else if (typeof metascoreCache[gbombID + '_' + platform] !== 'undefined') {
			metascoreItem = metascoreCache[gbombID + '_' + platform];
		}

		return metascoreItem;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToMetascoreCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToMetascoreCache = function(asin, gbombID, platform, sourceItem) {

		// add to metascoreCache linked by asin
		if (asin != '0') {
			metascoreCache[asin + '_' + platform] = {metascorePage: sourceItem.metascorePage, metascore: sourceItem.metascore};
		}
		// add to metascoreCache linked by gbombID
		if (gbombID != '0') {
			metascoreCache[gbombID + '_' + platform] = {metascorePage: sourceItem.metascorePage, metascore: sourceItem.metascore};
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseMetascoreResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseMetascoreResults = function(keywords, data, sourceItem) {

		var result = null;

		// parse raw result
		if (typeof data.metascore === 'undefined') {

			// get result that matches sourceItem
			result = getMatchedSearchResult(data, sourceItem);

			// send matched result to be cached on server
			if (result) {
				addToServerCache(keywords, sourceItem.platform, result.metascore, result.metascorePage);
			}

		// parse cached result
		} else {

			result = data;
		}

		return result;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addMetascoreDatatoItem -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addMetascoreDatatoItem = function(result, sourceItem) {

		// add/update metascore data to sourceItem
		if (result && result.metascore !== '') {
			sourceItem.metascore = result.metascore;
			sourceItem.displayMetascore = result.metascore;
			sourceItem.metascorePage = result.metascorePage;
		} else if (result) {
			sourceItem.metascore = -1;
			sourceItem.displayMetascore = 'n/a';
			sourceItem.metascorePage = result.metascorePage;
		} else {
			sourceItem.metascore = -1;
			sourceItem.displayMetascore = 'n/a';
			sourceItem.metascorePage = '';
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToServerCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToServerCache = function(keywords, platform, metascore, metascorePage) {

		var requestData = {
			'keywords': encodeURI(keywords),
			'platform': encodeURI(platform),
			'metascore': encodeURI(metascore),
			'metascorePage': encodeURI(metascorePage)
		};

		$.ajax({
			url: METACRITIC_CACHE_URL,
			type: 'GET',
			data: requestData,
			cache: true,
			success: function(data) {


			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMatchedSearchResult -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMatchedSearchResult = function(data, sourceItem) {

		var results = $('#main', data).find('.result');
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate results
		$(results).each(function() {

			// convert to date object
			var releaseDateObject = new Date($(this).find('.release_date .data').text());
			// format month
			var month = releaseDateObject.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			// format date
			var date = releaseDateObject.getDate();
			date = date < 10 ? '0' + date : date;

			// create standard item
			searchItem = {
				name: $(this).find('.product_title a').text(),
				releaseDate: releaseDateObject.getFullYear() + '-' + month + '-' + date,
				platform: $(this).find('.platform').text(),
				metascore: $(this).find('.metascore').text(),
				metascorePage: $(this).find('.product_title a').attr('href')
			};

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

			// check if score is new best
			if (score > bestScore) {
				bestMatch = searchItem;
				bestScore = score;
			}
		});

		return bestMatch;
	};

})(tmz.module('metacritic'), tmz, jQuery, _);


// Wikipedia
(function(Wikipedia) {

	console.info('Wikipedia');

	// Dependencies
	var User = tmz.module('user'),
		Utilities = tmz.module('utilities'),
		ItemLinker = tmz.module('itemLinker'),

		// wikipedia cache
		wikipediaPageCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getWikipediaPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	Wikipedia.getWikipediaPage = function(title, sourceItem, onSuccess) {

		// find in attributes cache first
		var itemAttributes = wikipediaPageCache[sourceItem.id];

		if (itemAttributes && typeof itemAttributes.wikipediaPage !== 'undefined') {

			// display attribute
			onSuccess(itemAttributes.wikipediaPage);

		// search wikipedia
		} else {


			searchWikipedia(title, function(data) {

				// get page array
				var pageArray = null;
				_.each(data, function(item, key) {
					pageArray = item;
				});

				// match page to sourceItem
				ItemLinker.findWikipediaMatch(pageArray, sourceItem, function(item) {

					// get wikipedia page details
					getWikipediaPageDetails(item.name, function(data) {

						// get wikipedia page url
						_.each(data.query.pages, function(pageItem, key){

							// add to cache
							if (itemAttributes) {
								itemAttributes.wikipediaPage = pageItem.fullurl;
							} else {
								wikipediaPageCache[sourceItem.id] = {wikipediaPage: pageItem.fullurl};
							}

							// display attribute
							onSuccess(pageItem.fullurl);
						});
					});
				});
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* searchWikipedia
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var searchWikipedia = function(keywords, onSuccess, onError) {

		var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=?';

		var requestData = {
			'search': keywords,
			'prop': 'revisions',
			'rvprop': 'content'
		};

        $.ajax({
            url: url,
            type: 'GET',
            data: requestData,
            dataType: 'jsonp',
            cache: false,
            crossDomain: true,
            success: onSuccess,
            error: onError
        });

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getWikipediaPageDetails
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getWikipediaPageDetails = function(pageTitle, onSuccess, onError) {

		var url = 'http://en.wikipedia.org/w/api.php?action=query&format=json&callback=?';

		var requestData = {
			'titles': pageTitle,
			'prop': 'info',
			'inprop': 'url'
		};

        $.ajax({
            url: url,
            type: 'GET',
            data: requestData,
            dataType: 'jsonp',
            cache: false,
            crossDomain: true,
            success: onSuccess,
            error: onError
        });

	};


})(tmz.module('wikipedia'));


// GameTrailers
(function(GameTrailers, tmz, $, _) {
	"use strict";

	console.info('GameTrailers');

    // module references
	var Amazon = tmz.module('amazon'),
		ItemLinker = tmz.module('itemLinker'),
		ItemData = tmz.module('itemData'),

		// REST URL
		GAMETRAILERS_SEARCH_URL = tmz.api + 'gametrailers/search/',
		GAMETRAILERS_CACHE_URL = tmz.api + 'gameTrailers/cache/',

		// properties
		GAMETRAILERS_BASE_URL = 'gametrailers.com',

		// data
		gametrailersPageCache = {},

		// request queues
		getGametrailersQueue = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGametrailersPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GameTrailers.getGametrailersPage = function(searchTerms, sourceItem, onSuccess) {

		console.info(searchTerms);

		var ajax = null;

		// find in cache first
		var gameTrailersItem = getCachedGametrailersPage(searchTerms);

		if (gameTrailersItem) {

			// add score data to source item
			sourceItem.gametrailersPage = gameTrailersItem.gametrailersPage;

			// return updated source item
			onSuccess(sourceItem);

		// fetch score data
		} else {

			// add to queue
			var queueKey = searchTerms + '_';

			if (!_.has(getGametrailersQueue, queueKey)) {
				getGametrailersQueue[queueKey] = [];
			}
			getGametrailersQueue[queueKey].push(onSuccess);

			// run for first call only
			if (getGametrailersQueue[queueKey].length === 1) {

				var cleanedSearchTerms = cleanupSearchTerms(searchTerms);

				var requestData = {
					'keywords': encodeURI(cleanedSearchTerms)
				};

				ajax = $.ajax({
						url: GAMETRAILERS_SEARCH_URL,
						type: 'GET',
						data: requestData,
						cache: true,
						success: function(data) {

							// parse result > modify sourceItem
							var gametrailersPage = parseGametrailersResults(cleanedSearchTerms, data, sourceItem);

							console.info(gametrailersPage);

							// iterate queued return methods
							_.each(getGametrailersQueue[queueKey], function(successMethod) {
								// add to local cache
								addToGametrailersCache(searchTerms, gametrailersPage);
								// return data
								successMethod(sourceItem);
							});

							// empty queue
							getGametrailersQueue[queueKey] = [];
						}
					});
			}
		}

		return ajax;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* displayGametrailersPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GameTrailers.displayGametrailersPage = function(page) {

	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* cleanupSearchTerms -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var cleanupSearchTerms = function(searchTerms) {

		// remove ':', '&'
		re = /\s*[:&]\s*/g;
		var cleanedSearchTerms = searchTerms.replace(re, ' ');

		// convert spaces to '+'
		var re = /\s/g;
		cleanedSearchTerms = cleanedSearchTerms.replace(re, '+');

		return cleanedSearchTerms;
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedGametrailersPage -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedGametrailersPage = function(searchTerms) {

		var gametrailersPage = null;

		if (typeof gametrailersPageCache[searchTerms] !== 'undefined') {
			gametrailersPage = gametrailersPageCache[searchTerms];
		}

		return gametrailersPage;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToGametrailersCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToGametrailersCache = function(searchTerms, gametrailersPage) {

		gametrailersPageCache[searchTerms] = {gametrailersPage: gametrailersPage};
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* parseGametrailersResults -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var parseGametrailersResults = function(keywords, data, sourceItem) {

		var gametrailersPage = null;

		// parse raw result
		if (typeof data.gametrailersPage === 'undefined') {

			// get result that matches sourceItem
			gametrailersPage = getMatchedSearchResult(data, sourceItem);

			// send matched result to be cached on server
			if (gametrailersPage) {
				addToServerCache(keywords, gametrailersPage);
			}

		// parse cached result
		} else {

			gametrailersPage = data.gametrailersPage;
		}

		return gametrailersPage;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToServerCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToServerCache = function(searchTerms, gametrailersPage) {

		var requestData = {
			'searchTerms': encodeURI(searchTerms),
			'gametrailersPage': encodeURI(gametrailersPage)
		};

		$.ajax({
			url: GAMETRAILERS_CACHE_URL,
			type: 'GET',
			data: requestData,
			cache: true,
			success: function(data) {

			}
		});
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getMatchedSearchResult -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getMatchedSearchResult = function(data, sourceItem) {

		var results = $('#games', data).find('.video_game_information_child');
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate results
		$(results).each(function() {

			// convert to date object
			var releaseDateObject = new Date($(this).find('.content dl dd:eq(2) a').text());
			// format month
			var month = releaseDateObject.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			// format date
			var date = releaseDateObject.getDate();
			date = date < 10 ? '0' + date : date;

			// create standard item
			searchItem = {
				name: $(this).find('.content h3 a').text(),
				releaseDate: releaseDateObject.getFullYear() + '-' + month + '-' + date,
				gametrailersPage: $(this).find('.content h3 a').attr('href')
			};

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

			// check if score is new best
			if (score > bestScore) {
				bestMatch = searchItem;
				bestScore = score;
			}
		});

		return bestMatch.gametrailersPage;
	};

})(tmz.module('gameTrailers'), tmz, jQuery, _);


// GameStats
(function(GameStats, tmz, $, _) {
	"use strict";

	console.info('gameStats');

    // module references

	// properties

	// REST URL
	var POPULAR_LIST_URL = tmz.api + 'list/popular/',

		// data
		gameStatsListCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getPopularGamesListByPlatform -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	GameStats.getPopularGamesListByPlatform = function(platform, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(platform);

		if (cachedList) {


			// return list
			onSuccess(cachedList);

		// fetch list data
		} else {
			var requestData = {
				'platform': platform
			};

			$.ajax({
				url: POPULAR_LIST_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {


					// cache result
					gameStatsListCache[platform] = data;

					// return items to onSuccess function
					onSuccess(data);
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(platform) {

		var gameStatsList = null;

		if (typeof gameStatsListCache[platform] !== 'undefined') {
			gameStatsList = gameStatsListCache[platform];
		}

		return gameStatsList;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToGamestatsCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToGamestatsCache = function() {


	};




})(tmz.module('gameStats'), tmz, jQuery, _);


// IGN
(function(IGN, tmz, $, _) {


	console.info('ign');

    // module references

	// properties

	// REST URL
	var UPCOMING_LIST_URL = tmz.api + 'list/upcoming/',

		// data
		IGNUpcomingListCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getUpcomingGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	IGN.getUpcomingGames = function(platform, page, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(platform, page);

		if (cachedList) {

			// return list
			onSuccess(cachedList);

		// fetch list data
		} else {
			var requestData = {
				'platform': platform,
				'page': page
			};

			$.ajax({
				url: UPCOMING_LIST_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {

					// cache result
					IGNUpcomingListCache[platform + '_' + page] = data;

					// return items to onSuccess function
					onSuccess(data);
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(platform, page) {

		var IGNUpcomingList = null;

		if (typeof IGNUpcomingListCache[platform + '_' + page] !== 'undefined') {
			IGNUpcomingList = IGNUpcomingListCache[platform + '_' + page];
		}

		return IGNUpcomingList;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* addToIGNCache -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var addToIGNCache = function() {


	};




})(tmz.module('ign'), tmz, jQuery, _);


// ReleasedList
(function(ReleasedList, tmz, $, _) {
	"use strict";

	console.info('releasedList');

    // module references

	// properties

	// REST URL
	var RELEASED_LIST_URL = tmz.api + 'list/released/',

		// data
		releasedListCache = {};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getReleasedGames -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ReleasedList.getReleasedGames = function(year, month, day, onSuccess) {

		// find in cache first
		var cachedList = getCachedData(year, month, day);

		if (cachedList) {

			// return list
			onSuccess(cachedList);

		// fetch list data
		} else {
			var requestData = {
				'year': year,
				'month': month,
				'day': day
			};

			$.ajax({
				url: RELEASED_LIST_URL,
				type: 'GET',
				data: requestData,
				cache: true,
				success: function(data) {

					// cache result
					releasedListCache[year + '_' + month + '_' + day] = data;

					// return items to onSuccess function
					onSuccess(data);
				}
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getCachedData -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getCachedData = function(year, month, day) {

		var releasedList = null;

		if (typeof releasedListCache[year + '_' + month + '_' + day] !== 'undefined') {
			releasedList = releasedListCache[year + '_' + month + '_' + day];
		}

		return releasedList;
	};


})(tmz.module('releasedList'), tmz, jQuery, _);


// ItemLinker
(function(ItemLinker, tmz, $, _) {
	"use strict";

	console.info('itemLinker');

	// Dependencies
	var Amazon = tmz.module('amazon'),
		GiantBomb = tmz.module('giantbomb'),
		Utilities = tmz.module('utilities');

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* standardizeTitle -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.standardizeTitle = function(title) {

		var sanitizedName = '';
		var re = null;
		var reRoman = null;

		var match = null;
		var match2 = null;
		var roman = '';
		var dec = 0;
		var num = 0;
		var arr = null;

		// remove word that appears before 'edition'
		sanitizedName = title.replace(/\S+ edition$/gi, '');
		// remove brackets and parenthesis
		sanitizedName = sanitizedName.replace(/\s*[\[\(].*[\)\]]/gi, '');

		// remove words appearing after '-' unless it is less than 4 chars
		re = new RegExp('\\s*-.*', 'gi');
		match = re.exec(sanitizedName);
		if (match && match[0].length > 3) {
			sanitizedName = sanitizedName.replace(re, '');
		}

		// remove words appearing after 'with'
		sanitizedName = sanitizedName.replace(/\swith\s.*/gi, '');

		// remove 'the ' if at the start of title
		sanitizedName = sanitizedName.replace(/^\s*the\s/gi, '');

		return sanitizedName.toLowerCase();
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getSimilarityScore -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.getSimilarityScore = function(sourceItem, searchItem) {

		// matching properties
		var score = 0;

		// use standard name for search result
		var standardResultName = ItemLinker.standardizeTitle(searchItem.name);

		// exact name check
		if (sourceItem.standardName === searchItem.name.toLowerCase()) {

			score += 50;

		// fuzzy name check
		} else {
			// check if searchItem title exists within original title and vice versa
			var reSource = new RegExp(sourceItem.standardName, 'gi');
			var reSearch = new RegExp(standardResultName, 'gi');
			var sourceInTarget = reSource.exec(standardResultName);
			var targetInSource = reSearch.exec(sourceItem.standardName);

			if ((sourceInTarget && sourceInTarget[0].length > 0) || (targetInSource && targetInSource[0].length > 0)) {

				score += 5;
			}
		}

		// exact release date check
		if (typeof searchItem.releaseDate !== 'undefined') {
			if (sourceItem.releaseDate === searchItem.releaseDate) {
				score += 10;

			// fuzzy release date check
			} else {
				var diff = Math.floor((Date.parse(sourceItem.releaseDate) - Date.parse(searchItem.releaseDate) ) / 86400000);

				// don't subtract score if search result date is unknown/unreleased
				if (!isNaN(diff) && searchItem.releaseDate !== '1900-01-01')  {
					score -= Math.abs(diff / 365);
				}
			}
		}

		// platform match
		if (typeof searchItem.platform !== 'undefined') {
			// get standard platform name from platform
			var standardPlatform = Utilities.matchPlatformToIndex(searchItem.platform).name;

			if (sourceItem.platform === standardPlatform) {
				score += 20;
			}
		}

		return score;
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* convertRomanNumerals -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.convertRomanNumerals = function(name) {

		var reRoman = new RegExp('\\s[XVI]+', 'gi');
		var match = reRoman.exec(name);

		// roman numeral found
		if (match && match[0].length > 0) {

			var roman = match[0];
			// remove III first and set dec to start at 3
			// the simplified converter below does add 'III' of anything correctly
			var re = new RegExp('III', 'gi');
			var match2 = re.exec(roman);
			var dec = '';

			if (match2 && match2[0].length > 0) {
				dec = 3;
				roman = roman.replace(re, '');
			}

			var arr = roman.split('');
			var num = null;

			// iterate each roman character except last blank character
			for (var i = arr.length - 1; i >= 1; i--) {
				switch(arr[i]) {
					case 'I':
					num = 1;
				break;
					case 'V':
					num = 5;
				break;
					case 'X':
					num = 10;
				break;
			}

			if (num < dec) {
				dec = dec - num;
			} else {
				dec = dec + num;
			}

			}

			// replace roman with decimal
			name = name.replace(reRoman, ' ' + dec);
		}

		return name;
	};


	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findItemOnAlternateProvider
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.findItemOnAlternateProvider = function(item, provider, onSuccess) {

		switch (provider) {
			case Utilities.SEARCH_PROVIDERS.Amazon:

				var searchName = item.standardName;

				// run search for giantbomb
				GiantBomb.searchGiantBomb(searchName, function(data) {
					findGiantbombMatch(data, item, onSuccess);
				});
				break;

			case Utilities.SEARCH_PROVIDERS.GiantBomb:


				var browseNode = 0;

				// run same platform search
				if (item.platform !== 'n/a') {



					browseNode = Utilities.getStandardPlatform(item.platform).amazon;
				}

				// run search for amazon
				Amazon.searchAmazon(item.name, browseNode, function(data) {
					findAmazonMatch(data, item, onSuccess, false);
				});
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getLinkedItemData
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.getLinkedItemData = function(item, provider, onSuccess) {

		switch (provider) {

			// amazon is provider > fetch from giantbomb
			case Utilities.SEARCH_PROVIDERS.Amazon:

				// get item from giantbomb
				GiantBomb.getGiantBombItemDetail(item.gbombID, function(data) {
					getGiantBombItemDetail_result(data, onSuccess);
				});
				break;

			// giantbomb is provider > fetch from amazon
			case Utilities.SEARCH_PROVIDERS.GiantBomb:

				// get item from amazon
				Amazon.getAmazonItemDetail(item.asin, function(data) {
					getAmazonItemDetail_result(data, onSuccess);
				});
				break;
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findWikipediaMatch -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	ItemLinker.findWikipediaMatch = function(data, sourceItem, onSuccess) {

		var results = data;
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate search results
		for (var i = 0, len = results.length; i < len; i++) {

			// create searchItem object
			searchItem = {
				'name': results[i]
			};

			// init best match with first item
			if (i === 0) {
				bestMatch = searchItem;
			}

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

			// check if score is new best
			if (score > bestScore) {
				bestMatch = searchItem;
				bestScore = score;
			}
		}

		// return best match to onSuccess method
		if (results.length !== 0) {
			// return best match
			onSuccess(bestMatch);
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getAmazonItemDetail_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getAmazonItemDetail_result = function(data, onSuccess) {

		var detailItem = {};
		// iterate results
		$('Item', data).each(function() {

			// parse item and set detailItem
			detailItem = Amazon.parseAmazonResultItem($(this));
		});

		// display second item
		onSuccess(detailItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* getGiantBombItemDetail_result
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var getGiantBombItemDetail_result = function(data, onSuccess) {

		// parse result item and set detailItem
		var detailItem = GiantBomb.parseGiantBombResultItem(data);

		// display second item
		onSuccess(detailItem);
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findAmazonMatch
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findAmazonMatch = function(data, sourceItem, onSuccess, lastSearch) {

		var resultLength = ($('Item', data).length);
		var searchItem = {};
		var count = 0;

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate results
		$('Item', data).each(function() {

			// parse item and return searchItem
			searchItem = Amazon.parseAmazonResultItem($(this));

			// searchItem not filtered
			if (typeof searchItem.isFiltered === 'undefined') {


				// save first non-filtered result
				if (count === 0) {
					bestMatch = searchItem;
				}

				count++;
				// get similarity score
				score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

				// check if score is new best
				if (score > bestScore) {
					bestMatch = searchItem;
					bestScore = score;

				}
			}
		});

		// return best match to onSuccess method
		if (bestMatch) {
			// return best match
			onSuccess(bestMatch);

		// re-run search without platform filter - only if this hasn't been run before
		} else if (!lastSearch) {
			Amazon.searchAmazon(sourceItem.name, 0, function(data) {
				findAmazonMatch(data, sourceItem, onSuccess, true);
			});
		}
	};

	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* findGiantbombMatch -
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	var findGiantbombMatch = function(data, sourceItem, onSuccess) {

		var results = data.results;
		var searchItem = {};

		// matching properties
		var bestMatch = null;
		var bestScore = -99999;
		var score = 0;

		// iterate search results
		for (var i = 0, len = results.length; i < len; i++) {

			// parse result into searchItem object
			searchItem = GiantBomb.parseGiantBombResultItem(results[i]);

			// init best match with first item
			if (i === 0) {
				bestMatch = searchItem;
			}

			// get similarity score
			score = ItemLinker.getSimilarityScore(sourceItem, searchItem);

			// check if score is new best
			if (score > bestScore) {
				bestMatch = searchItem;
				bestScore = score;
			}
		}

		// return best match to onSuccess method
		if (results.length !== 0) {
			// return best match
			onSuccess(bestMatch);
		}
	};

})(tmz.module('itemLinker'), tmz, jQuery, _);

	console.info('init.js');

	// intialize app
	tmz.initialize();
