(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.MoodleContextLevel = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var is = createCommonjsModule(function (module, exports) {
	(function(root, factory) {    // eslint-disable-line no-extra-semi
	    {
	        // Node. Does not work with strict CommonJS, but
	        // only CommonJS-like enviroments that support module.exports,
	        // like Node.
	        module.exports = factory();
	    }
	}(commonjsGlobal, function() {

	    // Baseline
	    /* -------------------------------------------------------------------------- */

	    // define 'is' object and current version
	    var is = {};
	    is.VERSION = '0.8.0';

	    // define interfaces
	    is.not = {};
	    is.all = {};
	    is.any = {};

	    // cache some methods to call later on
	    var toString = Object.prototype.toString;
	    var slice = Array.prototype.slice;
	    var hasOwnProperty = Object.prototype.hasOwnProperty;

	    // helper function which reverses the sense of predicate result
	    function not(func) {
	        return function() {
	            return !func.apply(null, slice.call(arguments));
	        };
	    }

	    // helper function which call predicate function per parameter and return true if all pass
	    function all(func) {
	        return function() {
	            var params = getParams(arguments);
	            var length = params.length;
	            for (var i = 0; i < length; i++) {
	                if (!func.call(null, params[i])) {
	                    return false;
	                }
	            }
	            return true;
	        };
	    }

	    // helper function which call predicate function per parameter and return true if any pass
	    function any(func) {
	        return function() {
	            var params = getParams(arguments);
	            var length = params.length;
	            for (var i = 0; i < length; i++) {
	                if (func.call(null, params[i])) {
	                    return true;
	                }
	            }
	            return false;
	        };
	    }

	    // build a 'comparator' object for various comparison checks
	    var comparator = {
	        '<': function(a, b) { return a < b; },
	        '<=': function(a, b) { return a <= b; },
	        '>': function(a, b) { return a > b; },
	        '>=': function(a, b) { return a >= b; }
	    };

	    // helper function which compares a version to a range
	    function compareVersion(version, range) {
	        var string = (range + '');
	        var n = +(string.match(/\d+/) || NaN);
	        var op = string.match(/^[<>]=?|/)[0];
	        return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
	    }

	    // helper function which extracts params from arguments
	    function getParams(args) {
	        var params = slice.call(args);
	        var length = params.length;
	        if (length === 1 && is.array(params[0])) {    // support array
	            params = params[0];
	        }
	        return params;
	    }

	    // Type checks
	    /* -------------------------------------------------------------------------- */

	    // is a given value Arguments?
	    is.arguments = function(value) {    // fallback check is for IE
	        return toString.call(value) === '[object Arguments]' ||
	            (value != null && typeof value === 'object' && 'callee' in value);
	    };

	    // is a given value Array?
	    is.array = Array.isArray || function(value) {    // check native isArray first
	        return toString.call(value) === '[object Array]';
	    };

	    // is a given value Boolean?
	    is.boolean = function(value) {
	        return value === true || value === false || toString.call(value) === '[object Boolean]';
	    };

	    // is a given value Char?
	    is.char = function(value) {
	        return is.string(value) && value.length === 1;
	    };

	    // is a given value Date Object?
	    is.date = function(value) {
	        return toString.call(value) === '[object Date]';
	    };

	    // is a given object a DOM node?
	    is.domNode = function(object) {
	        return is.object(object) && object.nodeType > 0;
	    };

	    // is a given value Error object?
	    is.error = function(value) {
	        return toString.call(value) === '[object Error]';
	    };

	    // is a given value function?
	    is['function'] = function(value) {    // fallback check is for IE
	        return toString.call(value) === '[object Function]' || typeof value === 'function';
	    };

	    // is given value a pure JSON object?
	    is.json = function(value) {
	        return toString.call(value) === '[object Object]';
	    };

	    // is a given value NaN?
	    is.nan = function(value) {    // NaN is number :) Also it is the only value which does not equal itself
	        return value !== value;
	    };

	    // is a given value null?
	    is['null'] = function(value) {
	        return value === null;
	    };

	    // is a given value number?
	    is.number = function(value) {
	        return is.not.nan(value) && toString.call(value) === '[object Number]';
	    };

	    // is a given value object?
	    is.object = function(value) {
	        return Object(value) === value;
	    };

	    // is a given value RegExp?
	    is.regexp = function(value) {
	        return toString.call(value) === '[object RegExp]';
	    };

	    // are given values same type?
	    // prevent NaN, Number same type check
	    is.sameType = function(value, other) {
	        var tag = toString.call(value);
	        if (tag !== toString.call(other)) {
	            return false;
	        }
	        if (tag === '[object Number]') {
	            return !is.any.nan(value, other) || is.all.nan(value, other);
	        }
	        return true;
	    };
	    // sameType method does not support 'all' and 'any' interfaces
	    is.sameType.api = ['not'];

	    // is a given value String?
	    is.string = function(value) {
	        return toString.call(value) === '[object String]';
	    };

	    // is a given value undefined?
	    is.undefined = function(value) {
	        return value === void 0;
	    };

	    // is a given value window?
	    // setInterval method is only available for window object
	    is.windowObject = function(value) {
	        return value != null && typeof value === 'object' && 'setInterval' in value;
	    };

	    // Presence checks
	    /* -------------------------------------------------------------------------- */

	    //is a given value empty? Objects, arrays, strings
	    is.empty = function(value) {
	        if (is.object(value)) {
	            var length = Object.getOwnPropertyNames(value).length;
	            if (length === 0 || (length === 1 && is.array(value)) ||
	                    (length === 2 && is.arguments(value))) {
	                return true;
	            }
	            return false;
	        }
	        return value === '';
	    };

	    // is a given value existy?
	    is.existy = function(value) {
	        return value != null;
	    };

	    // is a given value falsy?
	    is.falsy = function(value) {
	        return !value;
	    };

	    // is a given value truthy?
	    is.truthy = not(is.falsy);

	    // Arithmetic checks
	    /* -------------------------------------------------------------------------- */

	    // is a given number above minimum parameter?
	    is.above = function(n, min) {
	        return is.all.number(n, min) && n > min;
	    };
	    // above method does not support 'all' and 'any' interfaces
	    is.above.api = ['not'];

	    // is a given number decimal?
	    is.decimal = function(n) {
	        return is.number(n) && n % 1 !== 0;
	    };

	    // are given values equal? supports numbers, strings, regexes, booleans
	    // TODO: Add object and array support
	    is.equal = function(value, other) {
	        // check 0 and -0 equity with Infinity and -Infinity
	        if (is.all.number(value, other)) {
	            return value === other && 1 / value === 1 / other;
	        }
	        // check regexes as strings too
	        if (is.all.string(value, other) || is.all.regexp(value, other)) {
	            return '' + value === '' + other;
	        }
	        if (is.all.boolean(value, other)) {
	            return value === other;
	        }
	        return false;
	    };
	    // equal method does not support 'all' and 'any' interfaces
	    is.equal.api = ['not'];

	    // is a given number even?
	    is.even = function(n) {
	        return is.number(n) && n % 2 === 0;
	    };

	    // is a given number finite?
	    is.finite = isFinite || function(n) {
	        return is.not.infinite(n) && is.not.nan(n);
	    };

	    // is a given number infinite?
	    is.infinite = function(n) {
	        return n === Infinity || n === -Infinity;
	    };

	    // is a given number integer?
	    is.integer = function(n) {
	        return is.number(n) && n % 1 === 0;
	    };

	    // is a given number negative?
	    is.negative = function(n) {
	        return is.number(n) && n < 0;
	    };

	    // is a given number odd?
	    is.odd = function(n) {
	        return is.number(n) && n % 2 === 1;
	    };

	    // is a given number positive?
	    is.positive = function(n) {
	        return is.number(n) && n > 0;
	    };

	    // is a given number above maximum parameter?
	    is.under = function(n, max) {
	        return is.all.number(n, max) && n < max;
	    };
	    // least method does not support 'all' and 'any' interfaces
	    is.under.api = ['not'];

	    // is a given number within minimum and maximum parameters?
	    is.within = function(n, min, max) {
	        return is.all.number(n, min, max) && n > min && n < max;
	    };
	    // within method does not support 'all' and 'any' interfaces
	    is.within.api = ['not'];

	    // Regexp checks
	    /* -------------------------------------------------------------------------- */
	    // Steven Levithan, Jan Goyvaerts: Regular Expressions Cookbook
	    // Scott Gonzalez: Email address validation

	    // dateString match m/d/yy and mm/dd/yyyy, allowing any combination of one or two digits for the day and month, and two or four digits for the year
	    // eppPhone match extensible provisioning protocol format
	    // nanpPhone match north american number plan format
	    // time match hours, minutes, and seconds, 24-hour clock
	    var regexes = {
	        affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
	        alphaNumeric: /^[A-Za-z0-9]+$/,
	        caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
	        creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
	        dateString: /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
	        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
	        eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
	        hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
	        hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
	        ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
	        ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
	        nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
	        socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
	        timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
	        ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
	        url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
	        usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/
	    };

	    function regexpCheck(regexp, regexes) {
	        is[regexp] = function(value) {
	            return regexes[regexp].test(value);
	        };
	    }

	    // create regexp checks methods from 'regexes' object
	    for (var regexp in regexes) {
	        if (regexes.hasOwnProperty(regexp)) {
	            regexpCheck(regexp, regexes);
	        }
	    }

	    // simplify IP checks by calling the regex helpers for IPv4 and IPv6
	    is.ip = function(value) {
	        return is.ipv4(value) || is.ipv6(value);
	    };

	    // String checks
	    /* -------------------------------------------------------------------------- */

	    // is a given string or sentence capitalized?
	    is.capitalized = function(string) {
	        if (is.not.string(string)) {
	            return false;
	        }
	        var words = string.split(' ');
	        for (var i = 0; i < words.length; i++) {
	            var word = words[i];
	            if (word.length) {
	                var chr = word.charAt(0);
	                if (chr !== chr.toUpperCase()) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    };

	    // is string end with a given target parameter?
	    is.endWith = function(string, target) {
	        if (is.not.string(string)) {
	            return false;
	        }
	        target += '';
	        var position = string.length - target.length;
	        return position >= 0 && string.indexOf(target, position) === position;
	    };
	    // endWith method does not support 'all' and 'any' interfaces
	    is.endWith.api = ['not'];

	    // is a given string include parameter target?
	    is.include = function(string, target) {
	        return string.indexOf(target) > -1;
	    };
	    // include method does not support 'all' and 'any' interfaces
	    is.include.api = ['not'];

	    // is a given string all lowercase?
	    is.lowerCase = function(string) {
	        return is.string(string) && string === string.toLowerCase();
	    };

	    // is a given string palindrome?
	    is.palindrome = function(string) {
	        if (is.not.string(string)) {
	            return false;
	        }
	        string = string.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
	        var length = string.length - 1;
	        for (var i = 0, half = Math.floor(length / 2); i <= half; i++) {
	            if (string.charAt(i) !== string.charAt(length - i)) {
	                return false;
	            }
	        }
	        return true;
	    };

	    // is a given value space?
	    // horizantal tab: 9, line feed: 10, vertical tab: 11, form feed: 12, carriage return: 13, space: 32
	    is.space = function(value) {
	        if (is.not.char(value)) {
	            return false;
	        }
	        var charCode = value.charCodeAt(0);
	        return (charCode > 8 && charCode < 14) || charCode === 32;
	    };

	    // is string start with a given target parameter?
	    is.startWith = function(string, target) {
	        return is.string(string) && string.indexOf(target) === 0;
	    };
	    // startWith method does not support 'all' and 'any' interfaces
	    is.startWith.api = ['not'];

	    // is a given string all uppercase?
	    is.upperCase = function(string) {
	        return is.string(string) && string === string.toUpperCase();
	    };

	    // Time checks
	    /* -------------------------------------------------------------------------- */

	    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	    var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

	    // is a given dates day equal given day parameter?
	    is.day = function(date, day) {
	        return is.date(date) && day.toLowerCase() === days[date.getDay()];
	    };
	    // day method does not support 'all' and 'any' interfaces
	    is.day.api = ['not'];

	    // is a given date in daylight saving time?
	    is.dayLightSavingTime = function(date) {
	        var january = new Date(date.getFullYear(), 0, 1);
	        var july = new Date(date.getFullYear(), 6, 1);
	        var stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
	        return date.getTimezoneOffset() < stdTimezoneOffset;
	    };

	    // is a given date future?
	    is.future = function(date) {
	        var now = new Date();
	        return is.date(date) && date.getTime() > now.getTime();
	    };

	    // is date within given range?
	    is.inDateRange = function(date, start, end) {
	        if (is.not.date(date) || is.not.date(start) || is.not.date(end)) {
	            return false;
	        }
	        var stamp = date.getTime();
	        return stamp > start.getTime() && stamp < end.getTime();
	    };
	    // inDateRange method does not support 'all' and 'any' interfaces
	    is.inDateRange.api = ['not'];

	    // is a given date in last month range?
	    is.inLastMonth = function(date) {
	        return is.inDateRange(date, new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date());
	    };

	    // is a given date in last week range?
	    is.inLastWeek = function(date) {
	        return is.inDateRange(date, new Date(new Date().setDate(new Date().getDate() - 7)), new Date());
	    };

	    // is a given date in last year range?
	    is.inLastYear = function(date) {
	        return is.inDateRange(date, new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
	    };

	    // is a given date in next month range?
	    is.inNextMonth = function(date) {
	        return is.inDateRange(date, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
	    };

	    // is a given date in next week range?
	    is.inNextWeek = function(date) {
	        return is.inDateRange(date, new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
	    };

	    // is a given date in next year range?
	    is.inNextYear = function(date) {
	        return is.inDateRange(date, new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
	    };

	    // is the given year a leap year?
	    is.leapYear = function(year) {
	        return is.number(year) && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
	    };

	    // is a given dates month equal given month parameter?
	    is.month = function(date, month) {
	        return is.date(date) && month.toLowerCase() === months[date.getMonth()];
	    };
	    // month method does not support 'all' and 'any' interfaces
	    is.month.api = ['not'];

	    // is a given date past?
	    is.past = function(date) {
	        var now = new Date();
	        return is.date(date) && date.getTime() < now.getTime();
	    };

	    // is a given date in the parameter quarter?
	    is.quarterOfYear = function(date, quarter) {
	        return is.date(date) && is.number(quarter) && quarter === Math.floor((date.getMonth() + 3) / 3);
	    };
	    // quarterOfYear method does not support 'all' and 'any' interfaces
	    is.quarterOfYear.api = ['not'];

	    // is a given date indicate today?
	    is.today = function(date) {
	        var now = new Date();
	        var todayString = now.toDateString();
	        return is.date(date) && date.toDateString() === todayString;
	    };

	    // is a given date indicate tomorrow?
	    is.tomorrow = function(date) {
	        var now = new Date();
	        var tomorrowString = new Date(now.setDate(now.getDate() + 1)).toDateString();
	        return is.date(date) && date.toDateString() === tomorrowString;
	    };

	    // is a given date weekend?
	    // 6: Saturday, 0: Sunday
	    is.weekend = function(date) {
	        return is.date(date) && (date.getDay() === 6 || date.getDay() === 0);
	    };

	    // is a given date weekday?
	    is.weekday = not(is.weekend);

	    // is a given dates year equal given year parameter?
	    is.year = function(date, year) {
	        return is.date(date) && is.number(year) && year === date.getFullYear();
	    };
	    // year method does not support 'all' and 'any' interfaces
	    is.year.api = ['not'];

	    // is a given date indicate yesterday?
	    is.yesterday = function(date) {
	        var now = new Date();
	        var yesterdayString = new Date(now.setDate(now.getDate() - 1)).toDateString();
	        return is.date(date) && date.toDateString() === yesterdayString;
	    };

	    // Environment checks
	    /* -------------------------------------------------------------------------- */

	    var freeGlobal = is.windowObject(typeof commonjsGlobal == 'object' && commonjsGlobal) && commonjsGlobal;
	    var freeSelf = is.windowObject(typeof self == 'object' && self) && self;
	    var thisGlobal = is.windowObject(typeof this == 'object' && this) && this;
	    var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

	    var document = freeSelf && freeSelf.document;
	    var previousIs = root.is;

	    // store navigator properties to use later
	    var navigator = freeSelf && freeSelf.navigator;
	    var appVersion = (navigator && navigator.appVersion || '').toLowerCase();
	    var userAgent = (navigator && navigator.userAgent || '').toLowerCase();
	    var vendor = (navigator && navigator.vendor || '').toLowerCase();

	    // is current device android?
	    is.android = function() {
	        return /android/.test(userAgent);
	    };
	    // android method does not support 'all' and 'any' interfaces
	    is.android.api = ['not'];

	    // is current device android phone?
	    is.androidPhone = function() {
	        return /android/.test(userAgent) && /mobile/.test(userAgent);
	    };
	    // androidPhone method does not support 'all' and 'any' interfaces
	    is.androidPhone.api = ['not'];

	    // is current device android tablet?
	    is.androidTablet = function() {
	        return /android/.test(userAgent) && !/mobile/.test(userAgent);
	    };
	    // androidTablet method does not support 'all' and 'any' interfaces
	    is.androidTablet.api = ['not'];

	    // is current device blackberry?
	    is.blackberry = function() {
	        return /blackberry/.test(userAgent) || /bb10/.test(userAgent);
	    };
	    // blackberry method does not support 'all' and 'any' interfaces
	    is.blackberry.api = ['not'];

	    // is current browser chrome?
	    // parameter is optional
	    is.chrome = function(range) {
	        var match = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
	        return match !== null && compareVersion(match[1], range);
	    };
	    // chrome method does not support 'all' and 'any' interfaces
	    is.chrome.api = ['not'];

	    // is current device desktop?
	    is.desktop = function() {
	        return is.not.mobile() && is.not.tablet();
	    };
	    // desktop method does not support 'all' and 'any' interfaces
	    is.desktop.api = ['not'];

	    // is current browser edge?
	    // parameter is optional
	    is.edge = function(range) {
	        var match = userAgent.match(/edge\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // edge method does not support 'all' and 'any' interfaces
	    is.edge.api = ['not'];

	    // is current browser firefox?
	    // parameter is optional
	    is.firefox = function(range) {
	        var match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // firefox method does not support 'all' and 'any' interfaces
	    is.firefox.api = ['not'];

	    // is current browser internet explorer?
	    // parameter is optional
	    is.ie = function(range) {
	        var match = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // ie method does not support 'all' and 'any' interfaces
	    is.ie.api = ['not'];

	    // is current device ios?
	    is.ios = function() {
	        return is.iphone() || is.ipad() || is.ipod();
	    };
	    // ios method does not support 'all' and 'any' interfaces
	    is.ios.api = ['not'];

	    // is current device ipad?
	    // parameter is optional
	    is.ipad = function(range) {
	        var match = userAgent.match(/ipad.+?os (\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // ipad method does not support 'all' and 'any' interfaces
	    is.ipad.api = ['not'];

	    // is current device iphone?
	    // parameter is optional
	    is.iphone = function(range) {
	        // original iPhone doesn't have the os portion of the UA
	        var match = userAgent.match(/iphone(?:.+?os (\d+))?/);
	        return match !== null && compareVersion(match[1] || 1, range);
	    };
	    // iphone method does not support 'all' and 'any' interfaces
	    is.iphone.api = ['not'];

	    // is current device ipod?
	    // parameter is optional
	    is.ipod = function(range) {
	        var match = userAgent.match(/ipod.+?os (\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // ipod method does not support 'all' and 'any' interfaces
	    is.ipod.api = ['not'];

	    // is current operating system linux?
	    is.linux = function() {
	        return /linux/.test(appVersion);
	    };
	    // linux method does not support 'all' and 'any' interfaces
	    is.linux.api = ['not'];

	    // is current operating system mac?
	    is.mac = function() {
	        return /mac/.test(appVersion);
	    };
	    // mac method does not support 'all' and 'any' interfaces
	    is.mac.api = ['not'];

	    // is current device mobile?
	    is.mobile = function() {
	        return is.iphone() || is.ipod() || is.androidPhone() || is.blackberry() || is.windowsPhone();
	    };
	    // mobile method does not support 'all' and 'any' interfaces
	    is.mobile.api = ['not'];

	    // is current state offline?
	    is.offline = not(is.online);
	    // offline method does not support 'all' and 'any' interfaces
	    is.offline.api = ['not'];

	    // is current state online?
	    is.online = function() {
	        return !navigator || navigator.onLine === true;
	    };
	    // online method does not support 'all' and 'any' interfaces
	    is.online.api = ['not'];

	    // is current browser opera?
	    // parameter is optional
	    is.opera = function(range) {
	        var match = userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // opera method does not support 'all' and 'any' interfaces
	    is.opera.api = ['not'];

	    // is current browser phantomjs?
	    // parameter is optional
	    is.phantom = function(range) {
	        var match = userAgent.match(/phantomjs\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // phantom method does not support 'all' and 'any' interfaces
	    is.phantom.api = ['not'];

	    // is current browser safari?
	    // parameter is optional
	    is.safari = function(range) {
	        var match = userAgent.match(/version\/(\d+).+?safari/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // safari method does not support 'all' and 'any' interfaces
	    is.safari.api = ['not'];

	    // is current device tablet?
	    is.tablet = function() {
	        return is.ipad() || is.androidTablet() || is.windowsTablet();
	    };
	    // tablet method does not support 'all' and 'any' interfaces
	    is.tablet.api = ['not'];

	    // is current device supports touch?
	    is.touchDevice = function() {
	        return !!document && ('ontouchstart' in freeSelf ||
	            ('DocumentTouch' in freeSelf && document instanceof DocumentTouch));
	    };
	    // touchDevice method does not support 'all' and 'any' interfaces
	    is.touchDevice.api = ['not'];

	    // is current operating system windows?
	    is.windows = function() {
	        return /win/.test(appVersion);
	    };
	    // windows method does not support 'all' and 'any' interfaces
	    is.windows.api = ['not'];

	    // is current device windows phone?
	    is.windowsPhone = function() {
	        return is.windows() && /phone/.test(userAgent);
	    };
	    // windowsPhone method does not support 'all' and 'any' interfaces
	    is.windowsPhone.api = ['not'];

	    // is current device windows tablet?
	    is.windowsTablet = function() {
	        return is.windows() && is.not.windowsPhone() && /touch/.test(userAgent);
	    };
	    // windowsTablet method does not support 'all' and 'any' interfaces
	    is.windowsTablet.api = ['not'];

	    // Object checks
	    /* -------------------------------------------------------------------------- */

	    // has a given object got parameterized count property?
	    is.propertyCount = function(object, count) {
	        if (is.not.object(object) || is.not.number(count)) {
	            return false;
	        }
	        var n = 0;
	        for (var property in object) {
	            if (hasOwnProperty.call(object, property) && ++n > count) {
	                return false;
	            }
	        }
	        return n === count;
	    };
	    // propertyCount method does not support 'all' and 'any' interfaces
	    is.propertyCount.api = ['not'];

	    // is given object has parameterized property?
	    is.propertyDefined = function(object, property) {
	        return is.object(object) && is.string(property) && property in object;
	    };
	    // propertyDefined method does not support 'all' and 'any' interfaces
	    is.propertyDefined.api = ['not'];

	    // Array checks
	    /* -------------------------------------------------------------------------- */

	    // is a given item in an array?
	    is.inArray = function(value, array) {
	        if (is.not.array(array)) {
	            return false;
	        }
	        for (var i = 0; i < array.length; i++) {
	            if (array[i] === value) {
	                return true;
	            }
	        }
	        return false;
	    };
	    // inArray method does not support 'all' and 'any' interfaces
	    is.inArray.api = ['not'];

	    // is a given array sorted?
	    is.sorted = function(array, sign) {
	        if (is.not.array(array)) {
	            return false;
	        }
	        var predicate = comparator[sign] || comparator['>='];
	        for (var i = 1; i < array.length; i++) {
	            if (!predicate(array[i], array[i - 1])) {
	                return false;
	            }
	        }
	        return true;
	    };

	    // API
	    // Set 'not', 'all' and 'any' interfaces to methods based on their api property
	    /* -------------------------------------------------------------------------- */

	    function setInterfaces() {
	        var options = is;
	        for (var option in options) {
	            if (hasOwnProperty.call(options, option) && is['function'](options[option])) {
	                var interfaces = options[option].api || ['not', 'all', 'any'];
	                for (var i = 0; i < interfaces.length; i++) {
	                    if (interfaces[i] === 'not') {
	                        is.not[option] = not(is[option]);
	                    }
	                    if (interfaces[i] === 'all') {
	                        is.all[option] = all(is[option]);
	                    }
	                    if (interfaces[i] === 'any') {
	                        is.any[option] = any(is[option]);
	                    }
	                }
	            }
	        }
	    }
	    setInterfaces();

	    // Configuration methods
	    // Intentionally added after setInterfaces function
	    /* -------------------------------------------------------------------------- */

	    // change namespace of library to prevent name collisions
	    // var preferredName = is.setNamespace();
	    // preferredName.odd(3);
	    // => true
	    is.setNamespace = function() {
	        root.is = previousIs;
	        return this;
	    };

	    // set optional regexes to methods
	    is.setRegexp = function(regexp, name) {
	        for (var r in regexes) {
	            if (hasOwnProperty.call(regexes, r) && (name === r)) {
	                regexes[r] = regexp;
	            }
	        }
	    };

	    return is;
	}));
	});

	/**
	 * A Moodle Context Level number. These are the actual numbers used in the
	 * Moodle database tables to represent the different context levels.
	 *
	 * @typedef {string|number} ContextLevelNumber
	 * @example '10'
	 */

	/**
	 * A Moodle Context Level name. These are the names of the PHP constants defined
	 * in the Moodle code
	 * (`[lib/accesslib.php](https://github.com/moodle/moodle/blob/master/lib/accesslib.php)`).
	 *
	 * @typedef {string} ContextLevelName
	 * @example 'CONTEXT_SYSTEM'
	 */

	/**
	 * The base names for a Moodle Context Level. These are the names of the PHP
	 * constants with the `CONTEXT_` prefix removed and converted to lower case.
	 *
	 * @typedef {string} ContextLevelBaseName
	 * @example 'system'
	 * @see {@link ContextLevelName}
	 */

	/**
	 * An alias for the base name for the Moodle Context Level. These names consist
	 * of only camel-cased letters.
	 *
	 * @typedef {string} ContextLevelAlias
	 * @example 'courseCategory'
	 */

	/**
	 * A mapping from context level numbers to context level base names.
	 * 
	 * @type {Map<ContextLevelNumber, ContextLevelBaseName>}
	 * @protected
	 */
	const NUM_BASENAME_MAP = {
	    '10': 'system',
	    '30': 'user',
	    '40': 'coursecat',
	    '50': 'course',
	    '70': 'module',
	    '80': 'block'
	};

	/**
	 * A mapping from context level numbers to context level names.
	 * 
	 * @type {Map<ContextLevelNumber, ContextLevelName>}
	 * @protected
	 */
	const NUM_NAME_MAP = {};
	for(const num of Object.keys(NUM_BASENAME_MAP)){
		NUM_NAME_MAP[num] = `CONTEXT_${NUM_BASENAME_MAP[num].toUpperCase()}`;
	}

	/**
	 * A mapping of base names to an array of aliases.
	 *
	 * @type {Map<ContextLevelBaseName, ContextLevelAlias[]>}
	 * @protected
	 */
	const BASENAME_ALIASES_MAP = {
		system: [],
		user: [],
		coursecat: ['courseCategory', 'category'],
		course: [],
		module: [],
		block: []
	};

	/**
	 * A mapping form context level names to context level numbers.
	 * 
	 * @type {Map<ContextLevelName, ContextLevelNumber>}
	 * @protected
	 */
	const NAME_NUM_MAP = {};
	for(const num of Object.keys(NUM_NAME_MAP)){
	    NAME_NUM_MAP[NUM_NAME_MAP[num]] = parseInt(num);
	}

	/**
	 * A mapping from context level base names and aliases to context level numbers.
	 * 
	 * @type {Map<ContextLevelBaseName|ContextLevelAlias, ContextLevelNumber>}
	 * @protected
	 */
	const BASENAME_NUM_MAP = {};
	for(const num of Object.keys(NUM_BASENAME_MAP)){
	    BASENAME_NUM_MAP[NUM_BASENAME_MAP[num]] = parseInt(num);
	}
	for(const bn of Object.keys(BASENAME_ALIASES_MAP)){
		const aliases = BASENAME_ALIASES_MAP[bn];
		for(const bna of aliases){
			BASENAME_NUM_MAP[bna] = BASENAME_NUM_MAP[bn];
		}
	}

	/**
	 * A mapping from lowser-cased context level base names and aliases to context
	 * level numbers.
	 * 
	 * @type @type {Map<string, ContextLevelNumber>}
	 * @protected
	 */
	const LC_BASENAME_NUM_MAP = {};
	for(const bn of Object.keys(BASENAME_NUM_MAP)){
		LC_BASENAME_NUM_MAP[bn.toLowerCase()] = BASENAME_NUM_MAP[bn];
	}

	/**
	 * A class for representing
	 * [Context Levels](https://docs.moodle.org/38/en/Assign_roles#Context_and_roles)
	 * within the [Moodle VLE](http://moodle.org/)'s permissions system.
	 *
	 * As well as the various functions and properties described in the documetation
	 * below there are also dynamically created properties with each valid context
	 * level name which get MoodleContextLevel instances for the matching level.
	 * In many instances these accessors will obviate the need to use a contructor.
	 *
	 * ```
	 * const sysCtx = MoodleContextLevel.system;
	 * const courseCtx = MoodleContextLevel.CONTEXT_COURSE;
	 * ```
	 * 
	 * @see https://docs.moodle.org/38/en/Assign_roles#Context_and_roles
	 */
	class MoodleContextLevel {
	    /**
	     * The default context is `CONTEXT_SYSTEM`.
	     *
	     * @param {ContextLevelNumber|ContextLevelName|ContextLevelBaseName|ContextLevelAlias} context
	     * @throws TypeError
	     * @throws RangeError
	     */
	    constructor(context){
			// default to system context
			let num = BASENAME_NUM_MAP.system;
			
			// process args (if any)
			if(is.not.undefined(context)){
				num = MoodleContextLevel.parseToNumber(context); // could throw error
			}
			
	        /**
	         * @type {ContextLevelNumber}
	         */
	        this._number = num;
	    }
		
		/**
		 * A list of all existing context level names as they appear in the
		 * Moodle source code sorted from lowest context level number to highest.
		 *
		 * @type {string[]}
		 */
		static get names(){
			const ans = [];
			for(const n of Object.keys(NUM_NAME_MAP).sort()){
				ans.push(NUM_NAME_MAP[n]);
			}
			return ans;
		}
		
		/**
		 * An alphabetic list of all defined base names, including aliases.
		 *
		 * @type {string[]}
		 */
		static get baseNames(){
			return Object.keys(BASENAME_NUM_MAP).sort();
		}
		
		/**
		 * An alphabetic list of all defined level names, be they full names as they
		 * appear in the Moodle  source code, base names, or aliases.
		 *
		 * @type {string[]}
		 */
		static get allNames(){
			return [
				...MoodleContextLevel.names,
				...MoodleContextLevel.baseNames
			].sort();
		}
		
		/**
		 * A sorted list of all defined context level numbers.
		 *
		 * @type {number[]}
		 */
		static get levelNumbers(){
			return Object.keys(NUM_BASENAME_MAP).map(n => parseInt(n)).sort();
		}
		
		/**
		 * A list of all context levels sorted by context level number.
		 *
		 * @type {MoodleContextLevel[]}
		 */
		static get levels(){
			return MoodleContextLevel.names.map(n=>new MoodleContextLevel(n));
		}
	    
	    /**
	     * Test if a given value is a valid Moodle Context Level Number.
	     *
	     * @param {*} val - the value to test.
	     * @param {boolean} [strictTypeCheck=false] - whether or not to enable
	     * strict type checking. With strict type cheking enabled, string
	     * representation of otherwise valid values will return `false`.
	     * @return {boolean}
		 * @see {@link ContextLevelNumber}
	     */
	    static isContextLevelNumber(val, strictTypeCheck){
	        if(is.not.number(val)){
	            if(strictTypeCheck) return false;
	            if(is.not.string(val)) return false;
	        }
	        return String(val).match(/^[134578]0$/) ? true : false;
	    }
	    
	    /**
	     * Test if a given value is a valid Moodle Context Level Name.
		 *
		 * By default names, base names, and aliases are considered valid, but with
		 * strict checking only the full context level names as used in the Moodle
		 * source code will be accepted.
	     *
	     * @param {*} val - the value to test.
	     * @param {boolean} [strictCheck=false] - By default any name that can be
		 * resolved to a context level number, ignoring case,  will be considered
		 * valid, but if a truthy value is passed only full context level names in
		 * the correct case exactly as used in the Moodle source code will be
		 * accepted. 
	     * @return {boolean}
		 * @see {@link ContextLevelName}
		 * @see {@link ContextLevelBaseName}
		 * @see {@link ContextLevelAlias}
	     */
	    static isContextLevelName(val, strictCheck){
			// short-circuit non-strings
	        if(is.not.string(val)) return false;
			
			// sort-circuit the passing strict check
			if(NAME_NUM_MAP[val]) return true;
			
			// we only strict is acceptable, return false
			if(strictCheck) return false;
			
			// a case-insensitive check of names
			if(NAME_NUM_MAP[val.toUpperCase()]) return true;
			
			// a case-insensitive check of base names and aliases
			if(LC_BASENAME_NUM_MAP[val.toLowerCase()]) return true;
			
			// if we got here the name is not valid
	        return false;
	    }
	    
	    /**
	     * Convert any valid name to a context level number. Valid names are
		 * context level names as they appear in the Moodle code, context level
		 * base names, and context level aliases.
	     *
	     * @param {ContextLevelName, ContextLevelBaseName, ContextLevelAlias} name
	     * @return {ContextLevelNumber|NaN} If the passed value can't be converted
	     * to a context level number `NaN` is returned.
	     */
	    static numberFromName(name){
	        if(is.not.string(name)) return NaN;
			const ucName = name.toUpperCase();
	        if(NAME_NUM_MAP[ucName]) return NAME_NUM_MAP[ucName];
			const lcName = name.toLowerCase();
			if(LC_BASENAME_NUM_MAP[lcName]) return LC_BASENAME_NUM_MAP[lcName];
	        return NaN;
	    }
	    
	    /**
	     * Compare two values to see if they represent the same context level, a
	     * greater context level, or a lesser context level.
	     *
	     * Context levels are compared based on their context level number.
	     *
	     * @param {*} val1
	     * @param {*} val2
	     * @return {number} Unless both values are context level objects, `NaN` is
	     * returned. If `val1` represents lower context level number than `val2`
		 * `-1` is returned, if `val1` and `val2` represent the same context level
		 * `0` is returned, and if `val1` represents a greater context level number
		 * version than `val2` `1` is returned.
	     */
	    static compare(val1, val2){
	        // unless we get two Moodle context levels, return NaN
	        if(!((val1 instanceof MoodleContextLevel) && (val2 instanceof MoodleContextLevel))) return NaN;
	        
	        // compare numeric representations
	        const l1 = val1.number;
			const l2 = val2.number;
	        if(l1 < l2) return -1;
	        if(l1 > l2) return 1;
			return 0;
	    }
	    
	    /**
	     * A factory method to build a {@link MoodleContextLevel} object from any
	     * parsable value. The following are supported:
	     *
	     * * A valid context level number (as a number or string)
		 * * A valid context level name as used in the Moodle code base (in any case).
		 * * A valid context level base name (in any case).
		 * * A valid context level alias (in any case).
		 * * A context level object.
	     *
	     * @param {number|string|MoodleContextLevel} level - the context level value to parse.
	     * @return {MoodleContextLevel}
	     * @throws {TypeError}
	     * @throws {RangeError}
	     * @see {@link ContextLevelNumber}
	     * @see {@link ContextLevelName}
	     * @see {@link ContextLevelBaseName}
	     * @see {@link ContextLevelAlias}
	     */
	    static parse(level){
			return new MoodleContextLevel(MoodleContextLevel.parseToNumber(level));
	    }
	    
	    /**
	     * Try to convert a value to a context level number. The following values
	     * are supported:
	     *
	     * * A valid context level number (as a number or string)
		 * * A valid context level name as used in the Moodle code base (in any case).
		 * * A valid context level base name (in any case).
		 * * A valid context level alias (in any case).
		 * * A context level object.
	     *
	     * @param {number|string|MoodleContextLevel} level - the context level value to parse.
	     * @return {MoodleContextLevelNumber}
	     * @throws {TypeError}
	     * @throws {RangeError}
	     * @see {@link ContextLevelNumber}
	     * @see {@link ContextLevelName}
	     * @see {@link ContextLevelBaseName}
	     * @see {@link ContextLevelAlias}
	     */
	    static parseToNumber(level){
			if(level instanceof MoodleContextLevel){
				return level.number;
			}
			if(is.number(level) || is.string(level)){
				const strLevel = String(level);
				if(strLevel.match(/^\d{2}$/)){
					// is integer, check if it's a valid key
					if(NUM_BASENAME_MAP[level]){
						return parseInt(level);
					}else {
						throw new RangeError(`unknown level '${level}'`);
					}
				}else {
					// is not an integer, so check if it's a known name
					const num = MoodleContextLevel.numberFromName(level);
					if(num){
						return num;
					}else {
						throw new RangeError(`unknown level '${level}'`);
					}
				}
			}
	        throw new TypeError('invalid value - level must be a number, string, or MoodleContextLevel object');
	    }
		
		/**
	     * Try to convert a value to a context level name as used in the Moodle
	     * source code. The following values are supported:
	     *
	     * * A valid context level number (as a number or string)
		 * * A valid context level name as used in the Moodle code base (in any case).
		 * * A valid context level base name (in any case).
		 * * A valid context level alias (in any case).
		 * * A context level object.
	     *
	     * @param {number|string|MoodleContextLevel} level - the context level value to parse.
	     * @return {MoodleContextLevelName}
	     * @throws {TypeError}
	     * @throws {RangeError}
	     * @see {@link ContextLevelNumber}
	     * @see {@link ContextLevelName}
	     * @see {@link ContextLevelBaseName}
	     * @see {@link ContextLevelAlias}
	     */
	    static parseToName(level){
			if(level instanceof MoodleContextLevel){
				return level.name;
			}
			if(is.number(level) || is.string(level)){
				const strLevel = String(level);
				if(strLevel.match(/^\d{2}$/)){
					// is integer, check if it's a valid key
					if(NUM_BASENAME_MAP[level]){
						return NUM_NAME_MAP[level];
					}else {
						throw new RangeError(`unknown level '${level}'`);
					}
				}else {
					// is not an integer, so check if it's a known name
					const num = MoodleContextLevel.parseToNumber(level);
					if(num){
						return NUM_NAME_MAP[num];
					}else {
						throw new RangeError(`unknown level '${level}'`);
					}
				}
			}
	        throw new TypeError('invalid value - level must be a number, string, or MoodleContextLevel object');
	    }
	    
	    /**
	     * The level's numeric value.
	     *
	     * @type {number}
	     */
	    get number(){
	        return this._number;
	    }
	    
	    /**
	     * The level's numeric value, must be one of the levels defined in
	     * `lib/accesslib.php` in the Moodle source code.
	     *
	     * @type {ContextLevelNumber}
	     * @throws {TypeError}
	     * @throws {RangeError}
	     */
	    set number(n){
	        if(!String(n).match(/^-?\d+$/)){
				throw new TypeError('must be a number');
			}
			if(!MoodleContextLevel.isContextLevelNumber(n)){
				throw new RangeError(`unknown level '${n}'`);
			}
			this._number = parseInt(n); // force to a number
	    }
	    
	    /**
	     * The level's name as it appears in the Moodle sourse code.
	     *
	     * @type {ContextLevelName}
	     */
	    get name(){
	        return NUM_NAME_MAP[this._number];
	    }
	    
	    /**
	     * The level's name in any valid form.
	     *
	     * Any name that can be parsed by the `nameFromNumber()` static function
	     * is acceptable.
	     *
	     * @type {(ContextLevelName|ContextLevelBaseName|ContextLevelAlias)}
	     * @throws {TypeError}
	     * @throws {RangeError}
	     * @see MoodleContextLevel.nameFromNumber
	     */
	    set name(n){
	        if(is.not.string(n)) throw new TypeError('must be a string');
			const num = MoodleContextLevel.numberFromName(n);
			if(num){
				this._number = num;
			}else {
				throw new RangeError(`unknown level '${n}'`);
			}
	    }
	    
	    /**
	     * The level's base name.
	     *
	     * @type {ContextLevelBaseName}
	     */
	    get baseName(){
	        return NUM_BASENAME_MAP[this._number];
	    }
		
		/**
		 * All the level's aliases.
		 *
		 * @type {ContextLevelAlias[]}
		 */
		get aliases(){
			return [...BASENAME_ALIASES_MAP[NUM_BASENAME_MAP[this._number]]];
		}
	    
	    /**
	     * All the level's valid names in alphabetical order. This includes the
	     * level's name as used in the Moodle source code, the level's base name,
	     * and all the level's aliases.
	     *
	     * @type {string[]}
	     */
	    get names(){
	        return [
				this.name,
				this.baseName,
				...this.aliases
			].sort();
	    }
	    
	    /**
	     * Create a new Moodle context level object representing the same context
	     * level.
	     *
	     * @return {MoodleContextLevel}
	     */
	    clone(){
	        return new MoodleContextLevel(this._number);
	    }
	    
	    /**
	     * The context level as a string consisting of the name followed by a space
	     * then the level number in parentheses, e.g. `SYSTEM (10)`.
	     *
	     * @return {string}
	     */
	    toString(){
	        return `${this.name} (${this.number})`;
	    }
	    
	    /**
	     * The version as a plain object indexed by:
	     *
	     * * `name`
	     * * `number`
	     * * `baseName`
	     * * `aliases`
	     *
	     * @return {Object}
	     */
	    toObject(){
	        return {
	            name: this.name,
	            number: this.number,
	            baseName: this.baseName,
	            aliases: this.aliases
	        };
	    }
	    
	    /**
	     * Test if a given value is a Moodle context level object representing the
	     * same context level.
	     *
	     * @param {*} val
	     * @return {boolean}
	     */
	    equals(val){
	        return MoodleContextLevel.compare(this, val) === 0 ? true : false;
	    }
	    
	    /**
	     * Compare this context level to another.
	     *
	     * @param {MoodleContextLevel} mv
	     * @return {number} `-1` returned if passed context level is lesser, `0` if
	     * the passed context level is the same, and `1` if the passed context level
	     * is greater. If the passed value is not a Moodle context level object,
	     * `NaN` will be returned.
	     */
	    compareTo(mv){
	        return MoodleContextLevel.compare(mv, this);
	    }
	}

	// add dynamically created properties for each context to class
	for(const n of MoodleContextLevel.allNames){
		Object.defineProperty(MoodleContextLevel, n, {
			get: function(){
				return new MoodleContextLevel(n);
			}
		});
	}

	return MoodleContextLevel;

})));
