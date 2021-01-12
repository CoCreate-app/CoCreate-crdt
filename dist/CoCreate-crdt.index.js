/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/CoCreate-crdt.index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/isomorphic.js/iso-browser.js":
/*!***************************************************!*\
  !*** ./node_modules/isomorphic.js/iso-browser.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* eslint-env browser */
const perf = typeof performance === 'undefined' ? null : performance

const isoCrypto = typeof crypto === 'undefined' ? null : crypto

/**
 * @type {function(number):ArrayBuffer}
 */
const cryptoRandomBuffer = isoCrypto !== null
  ? len => {
    // browser
    const buf = new ArrayBuffer(len)
    const arr = new Uint8Array(buf)
    isoCrypto.getRandomValues(arr)
    return buf
  }
  : len => {
    // polyfill
    const buf = new ArrayBuffer(len)
    const arr = new Uint8Array(buf)
    for (let i = 0; i < len; i++) {
      arr[i] = Math.ceil((Math.random() * 0xFFFFFFFF) >>> 0)
    }
    return buf
  }

exports.performance = perf
exports.cryptoRandomBuffer = cryptoRandomBuffer


/***/ }),

/***/ "./node_modules/lib0/array.js":
/*!************************************!*\
  !*** ./node_modules/lib0/array.js ***!
  \************************************/
/*! exports provided: last, create, copy, appendTo, from, every, some, equalFlat, flatten */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "last", function() { return last; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "copy", function() { return copy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "appendTo", function() { return appendTo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "from", function() { return from; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "every", function() { return every; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "some", function() { return some; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "equalFlat", function() { return equalFlat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return flatten; });
/**
 * Utility module to work with Arrays.
 *
 * @module array
 */

/**
 * Return the last element of an array. The element must exist
 *
 * @template L
 * @param {Array<L>} arr
 * @return {L}
 */
const last = arr => arr[arr.length - 1]

/**
 * @template C
 * @return {Array<C>}
 */
const create = () => /** @type {Array<C>} */ ([])

/**
 * @template D
 * @param {Array<D>} a
 * @return {Array<D>}
 */
const copy = a => /** @type {Array<D>} */ (a.slice())

/**
 * Append elements from src to dest
 *
 * @template M
 * @param {Array<M>} dest
 * @param {Array<M>} src
 */
const appendTo = (dest, src) => {
  for (let i = 0; i < src.length; i++) {
    dest.push(src[i])
  }
}

/**
 * Transforms something array-like to an actual Array.
 *
 * @function
 * @template T
 * @param {ArrayLike<T>|Iterable<T>} arraylike
 * @return {T}
 */
const from = Array.from

/**
 * True iff condition holds on every element in the Array.
 *
 * @function
 * @template ITEM
 *
 * @param {Array<ITEM>} arr
 * @param {function(ITEM, number, Array<ITEM>):boolean} f
 * @return {boolean}
 */
const every = (arr, f) => arr.every(f)

/**
 * True iff condition holds on some element in the Array.
 *
 * @function
 * @template S
 * @param {Array<S>} arr
 * @param {function(S, number, Array<S>):boolean} f
 * @return {boolean}
 */
const some = (arr, f) => arr.some(f)

/**
 * @template ELEM
 *
 * @param {Array<ELEM>} a
 * @param {Array<ELEM>} b
 * @return {boolean}
 */
const equalFlat = (a, b) => a.length === b.length && every(a, (item, index) => item === b[index])

/**
 * @template ELEM
 * @param {Array<Array<ELEM>>} arr
 * @return {Array<ELEM>}
 */
const flatten = arr => arr.reduce((acc, val) => acc.concat(val), [])


/***/ }),

/***/ "./node_modules/lib0/binary.js":
/*!*************************************!*\
  !*** ./node_modules/lib0/binary.js ***!
  \*************************************/
/*! exports provided: BIT1, BIT2, BIT3, BIT4, BIT5, BIT6, BIT7, BIT8, BIT9, BIT10, BIT11, BIT12, BIT13, BIT14, BIT15, BIT16, BIT17, BIT18, BIT19, BIT20, BIT21, BIT22, BIT23, BIT24, BIT25, BIT26, BIT27, BIT28, BIT29, BIT30, BIT31, BIT32, BITS0, BITS1, BITS2, BITS3, BITS4, BITS5, BITS6, BITS7, BITS8, BITS9, BITS10, BITS11, BITS12, BITS13, BITS14, BITS15, BITS16, BITS17, BITS18, BITS19, BITS20, BITS21, BITS22, BITS23, BITS24, BITS25, BITS26, BITS27, BITS28, BITS29, BITS30, BITS31, BITS32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT1", function() { return BIT1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT2", function() { return BIT2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT3", function() { return BIT3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT4", function() { return BIT4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT5", function() { return BIT5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT6", function() { return BIT6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT7", function() { return BIT7; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT8", function() { return BIT8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT9", function() { return BIT9; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT10", function() { return BIT10; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT11", function() { return BIT11; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT12", function() { return BIT12; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT13", function() { return BIT13; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT14", function() { return BIT14; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT15", function() { return BIT15; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT16", function() { return BIT16; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT17", function() { return BIT17; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT18", function() { return BIT18; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT19", function() { return BIT19; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT20", function() { return BIT20; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT21", function() { return BIT21; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT22", function() { return BIT22; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT23", function() { return BIT23; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT24", function() { return BIT24; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT25", function() { return BIT25; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT26", function() { return BIT26; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT27", function() { return BIT27; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT28", function() { return BIT28; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT29", function() { return BIT29; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT30", function() { return BIT30; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT31", function() { return BIT31; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BIT32", function() { return BIT32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS0", function() { return BITS0; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS1", function() { return BITS1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS2", function() { return BITS2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS3", function() { return BITS3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS4", function() { return BITS4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS5", function() { return BITS5; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS6", function() { return BITS6; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS7", function() { return BITS7; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS8", function() { return BITS8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS9", function() { return BITS9; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS10", function() { return BITS10; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS11", function() { return BITS11; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS12", function() { return BITS12; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS13", function() { return BITS13; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS14", function() { return BITS14; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS15", function() { return BITS15; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS16", function() { return BITS16; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS17", function() { return BITS17; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS18", function() { return BITS18; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS19", function() { return BITS19; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS20", function() { return BITS20; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS21", function() { return BITS21; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS22", function() { return BITS22; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS23", function() { return BITS23; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS24", function() { return BITS24; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS25", function() { return BITS25; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS26", function() { return BITS26; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS27", function() { return BITS27; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS28", function() { return BITS28; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS29", function() { return BITS29; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS30", function() { return BITS30; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS31", function() { return BITS31; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BITS32", function() { return BITS32; });
/* eslint-env browser */

/**
 * Binary data constants.
 *
 * @module binary
 */

/**
 * n-th bit activated.
 *
 * @type {number}
 */
const BIT1 = 1
const BIT2 = 2
const BIT3 = 4
const BIT4 = 8
const BIT5 = 16
const BIT6 = 32
const BIT7 = 64
const BIT8 = 128
const BIT9 = 256
const BIT10 = 512
const BIT11 = 1024
const BIT12 = 2048
const BIT13 = 4096
const BIT14 = 8192
const BIT15 = 16384
const BIT16 = 32768
const BIT17 = 65536
const BIT18 = 1 << 17
const BIT19 = 1 << 18
const BIT20 = 1 << 19
const BIT21 = 1 << 20
const BIT22 = 1 << 21
const BIT23 = 1 << 22
const BIT24 = 1 << 23
const BIT25 = 1 << 24
const BIT26 = 1 << 25
const BIT27 = 1 << 26
const BIT28 = 1 << 27
const BIT29 = 1 << 28
const BIT30 = 1 << 29
const BIT31 = 1 << 30
const BIT32 = 1 << 31

/**
 * First n bits activated.
 *
 * @type {number}
 */
const BITS0 = 0
const BITS1 = 1
const BITS2 = 3
const BITS3 = 7
const BITS4 = 15
const BITS5 = 31
const BITS6 = 63
const BITS7 = 127
const BITS8 = 255
const BITS9 = 511
const BITS10 = 1023
const BITS11 = 2047
const BITS12 = 4095
const BITS13 = 8191
const BITS14 = 16383
const BITS15 = 32767
const BITS16 = 65535
const BITS17 = BIT18 - 1
const BITS18 = BIT19 - 1
const BITS19 = BIT20 - 1
const BITS20 = BIT21 - 1
const BITS21 = BIT22 - 1
const BITS22 = BIT23 - 1
const BITS23 = BIT24 - 1
const BITS24 = BIT25 - 1
const BITS25 = BIT26 - 1
const BITS26 = BIT27 - 1
const BITS27 = BIT28 - 1
const BITS28 = BIT29 - 1
const BITS29 = BIT30 - 1
const BITS30 = BIT31 - 1
/**
 * @type {number}
 */
const BITS31 = 0x7FFFFFFF
/**
 * @type {number}
 */
const BITS32 = 0xFFFFFFFF


/***/ }),

/***/ "./node_modules/lib0/broadcastchannel.js":
/*!***********************************************!*\
  !*** ./node_modules/lib0/broadcastchannel.js ***!
  \***********************************************/
/*! exports provided: subscribe, unsubscribe, publish */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribe", function() { return subscribe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unsubscribe", function() { return unsubscribe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "publish", function() { return publish; });
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map.js */ "./node_modules/lib0/map.js");
/* harmony import */ var _buffer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./buffer.js */ "./node_modules/lib0/buffer.js");
/* harmony import */ var _storage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./storage.js */ "./node_modules/lib0/storage.js");
/* eslint-env browser */

/**
 * Helpers for cross-tab communication using broadcastchannel with LocalStorage fallback.
 *
 * ```js
 * // In browser window A:
 * broadcastchannel.subscribe('my events', data => console.log(data))
 * broadcastchannel.publish('my events', 'Hello world!') // => A: 'Hello world!' fires synchronously in same tab
 *
 * // In browser window B:
 * broadcastchannel.publish('my events', 'hello from tab B') // => A: 'hello from tab B'
 * ```
 *
 * @module broadcastchannel
 */

// @todo before next major: use Uint8Array instead as buffer object





/**
 * @typedef {Object} Channel
 * @property {Set<Function>} Channel.subs
 * @property {any} Channel.bc
 */

/**
 * @type {Map<string, Channel>}
 */
const channels = new Map()

class LocalStoragePolyfill {
  /**
   * @param {string} room
   */
  constructor (room) {
    this.room = room
    /**
     * @type {null|function({data:ArrayBuffer}):void}
     */
    this.onmessage = null
    addEventListener('storage', e => e.key === room && this.onmessage !== null && this.onmessage({ data: _buffer_js__WEBPACK_IMPORTED_MODULE_1__["fromBase64"](e.newValue || '') }))
  }

  /**
   * @param {ArrayBuffer} buf
   */
  postMessage (buf) {
    _storage_js__WEBPACK_IMPORTED_MODULE_2__["varStorage"].setItem(this.room, _buffer_js__WEBPACK_IMPORTED_MODULE_1__["toBase64"](_buffer_js__WEBPACK_IMPORTED_MODULE_1__["createUint8ArrayFromArrayBuffer"](buf)))
  }
}

// Use BroadcastChannel or Polyfill
const BC = typeof BroadcastChannel === 'undefined' ? LocalStoragePolyfill : BroadcastChannel

/**
 * @param {string} room
 * @return {Channel}
 */
const getChannel = room =>
  _map_js__WEBPACK_IMPORTED_MODULE_0__["setIfUndefined"](channels, room, () => {
    const subs = new Set()
    const bc = new BC(room)
    /**
     * @param {{data:ArrayBuffer}} e
     */
    bc.onmessage = e => subs.forEach(sub => sub(e.data))
    return {
      bc, subs
    }
  })

/**
 * Subscribe to global `publish` events.
 *
 * @function
 * @param {string} room
 * @param {function(any):any} f
 */
const subscribe = (room, f) => getChannel(room).subs.add(f)

/**
 * Unsubscribe from `publish` global events.
 *
 * @function
 * @param {string} room
 * @param {function(any):any} f
 */
const unsubscribe = (room, f) => getChannel(room).subs.delete(f)

/**
 * Publish data to all subscribers (including subscribers on this tab)
 *
 * @function
 * @param {string} room
 * @param {any} data
 */
const publish = (room, data) => {
  const c = getChannel(room)
  c.bc.postMessage(data)
  c.subs.forEach(sub => sub(data))
}


/***/ }),

/***/ "./node_modules/lib0/buffer.js":
/*!*************************************!*\
  !*** ./node_modules/lib0/buffer.js ***!
  \*************************************/
/*! exports provided: createUint8ArrayFromLen, createUint8ArrayViewFromArrayBuffer, createUint8ArrayFromArrayBuffer, toBase64, fromBase64, copyUint8Array, encodeAny, decodeAny */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Buffer) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createUint8ArrayFromLen", function() { return createUint8ArrayFromLen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createUint8ArrayViewFromArrayBuffer", function() { return createUint8ArrayViewFromArrayBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createUint8ArrayFromArrayBuffer", function() { return createUint8ArrayFromArrayBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toBase64", function() { return toBase64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromBase64", function() { return fromBase64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "copyUint8Array", function() { return copyUint8Array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeAny", function() { return encodeAny; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeAny", function() { return decodeAny; });
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./string.js */ "./node_modules/lib0/string.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment.js */ "./node_modules/lib0/environment.js");
/* harmony import */ var _encoding_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./encoding.js */ "./node_modules/lib0/encoding.js");
/* harmony import */ var _decoding_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./decoding.js */ "./node_modules/lib0/decoding.js");
/**
 * Utility functions to work with buffers (Uint8Array).
 *
 * @module buffer
 */






/**
 * @param {number} len
 */
const createUint8ArrayFromLen = len => new Uint8Array(len)

/**
 * Create Uint8Array with initial content from buffer
 *
 * @param {ArrayBuffer} buffer
 * @param {number} byteOffset
 * @param {number} length
 */
const createUint8ArrayViewFromArrayBuffer = (buffer, byteOffset, length) => new Uint8Array(buffer, byteOffset, length)

/**
 * Create Uint8Array with initial content from buffer
 *
 * @param {ArrayBuffer} buffer
 */
const createUint8ArrayFromArrayBuffer = buffer => new Uint8Array(buffer)

/* istanbul ignore next */
/**
 * @param {Uint8Array} bytes
 * @return {string}
 */
const toBase64Browser = bytes => {
  let s = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    s += _string_js__WEBPACK_IMPORTED_MODULE_0__["fromCharCode"](bytes[i])
  }
  // eslint-disable-next-line no-undef
  return btoa(s)
}

/**
 * @param {Uint8Array} bytes
 * @return {string}
 */
const toBase64Node = bytes => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64')

/* istanbul ignore next */
/**
 * @param {string} s
 * @return {Uint8Array}
 */
const fromBase64Browser = s => {
  // eslint-disable-next-line no-undef
  const a = atob(s)
  const bytes = createUint8ArrayFromLen(a.length)
  for (let i = 0; i < a.length; i++) {
    bytes[i] = a.charCodeAt(i)
  }
  return bytes
}

/**
 * @param {string} s
 */
const fromBase64Node = s => {
  const buf = Buffer.from(s, 'base64')
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
}

/* istanbul ignore next */
const toBase64 = _environment_js__WEBPACK_IMPORTED_MODULE_1__["isBrowser"] ? toBase64Browser : toBase64Node

/* istanbul ignore next */
const fromBase64 = _environment_js__WEBPACK_IMPORTED_MODULE_1__["isBrowser"] ? fromBase64Browser : fromBase64Node

/**
 * Copy the content of an Uint8Array view to a new ArrayBuffer.
 *
 * @param {Uint8Array} uint8Array
 * @return {Uint8Array}
 */
const copyUint8Array = uint8Array => {
  const newBuf = createUint8ArrayFromLen(uint8Array.byteLength)
  newBuf.set(uint8Array)
  return newBuf
}

/**
 * Encode anything as a UInt8Array. It's a pun on typescripts's `any` type.
 * See encoding.writeAny for more information.
 *
 * @param {any} data
 * @return {Uint8Array}
 */
const encodeAny = data => {
  const encoder = _encoding_js__WEBPACK_IMPORTED_MODULE_2__["createEncoder"]()
  _encoding_js__WEBPACK_IMPORTED_MODULE_2__["writeAny"](encoder, data)
  return _encoding_js__WEBPACK_IMPORTED_MODULE_2__["toUint8Array"](encoder)
}

/**
 * Decode an any-encoded value.
 *
 * @param {Uint8Array} buf
 * @return {any}
 */
const decodeAny = buf => _decoding_js__WEBPACK_IMPORTED_MODULE_3__["readAny"](_decoding_js__WEBPACK_IMPORTED_MODULE_3__["createDecoder"](buf))

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/node_modules/buffer/index.js */ "./node_modules/node-libs-browser/node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/lib0/conditions.js":
/*!*****************************************!*\
  !*** ./node_modules/lib0/conditions.js ***!
  \*****************************************/
/*! exports provided: undefinedToNull */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "undefinedToNull", function() { return undefinedToNull; });
/**
 * Often used conditions.
 *
 * @module conditions
 */

/**
 * @template T
 * @param {T|null|undefined} v
 * @return {T|null}
 */
/* istanbul ignore next */
const undefinedToNull = v => v === undefined ? null : v


/***/ }),

/***/ "./node_modules/lib0/decoding.js":
/*!***************************************!*\
  !*** ./node_modules/lib0/decoding.js ***!
  \***************************************/
/*! exports provided: Decoder, createDecoder, hasContent, clone, readUint8Array, readVarUint8Array, readTailAsUint8Array, skip8, readUint8, readUint16, readUint32, readUint32BigEndian, peekUint8, peekUint16, peekUint32, readVarUint, readVarInt, peekVarUint, peekVarInt, readVarString, peekVarString, readFromDataView, readFloat32, readFloat64, readBigInt64, readBigUint64, readAny, RleDecoder, IntDiffDecoder, RleIntDiffDecoder, UintOptRleDecoder, IncUintOptRleDecoder, IntDiffOptRleDecoder, StringDecoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Decoder", function() { return Decoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDecoder", function() { return createDecoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasContent", function() { return hasContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clone", function() { return clone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readUint8Array", function() { return readUint8Array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readVarUint8Array", function() { return readVarUint8Array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readTailAsUint8Array", function() { return readTailAsUint8Array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "skip8", function() { return skip8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readUint8", function() { return readUint8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readUint16", function() { return readUint16; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readUint32", function() { return readUint32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readUint32BigEndian", function() { return readUint32BigEndian; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "peekUint8", function() { return peekUint8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "peekUint16", function() { return peekUint16; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "peekUint32", function() { return peekUint32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readVarUint", function() { return readVarUint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readVarInt", function() { return readVarInt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "peekVarUint", function() { return peekVarUint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "peekVarInt", function() { return peekVarInt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readVarString", function() { return readVarString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "peekVarString", function() { return peekVarString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readFromDataView", function() { return readFromDataView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readFloat32", function() { return readFloat32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readFloat64", function() { return readFloat64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readBigInt64", function() { return readBigInt64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readBigUint64", function() { return readBigUint64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readAny", function() { return readAny; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RleDecoder", function() { return RleDecoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntDiffDecoder", function() { return IntDiffDecoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RleIntDiffDecoder", function() { return RleIntDiffDecoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UintOptRleDecoder", function() { return UintOptRleDecoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IncUintOptRleDecoder", function() { return IncUintOptRleDecoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntDiffOptRleDecoder", function() { return IntDiffOptRleDecoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StringDecoder", function() { return StringDecoder; });
/* harmony import */ var _buffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buffer.js */ "./node_modules/lib0/buffer.js");
/* harmony import */ var _binary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./binary.js */ "./node_modules/lib0/binary.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./math.js */ "./node_modules/lib0/math.js");
/**
 * Efficient schema-less binary decoding with support for variable length encoding.
 *
 * Use [lib0/decoding] with [lib0/encoding]. Every encoding function has a corresponding decoding function.
 *
 * Encodes numbers in little-endian order (least to most significant byte order)
 * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
 * which is also used in Protocol Buffers.
 *
 * ```js
 * // encoding step
 * const encoder = new encoding.createEncoder()
 * encoding.writeVarUint(encoder, 256)
 * encoding.writeVarString(encoder, 'Hello world!')
 * const buf = encoding.toUint8Array(encoder)
 * ```
 *
 * ```js
 * // decoding step
 * const decoder = new decoding.createDecoder(buf)
 * decoding.readVarUint(decoder) // => 256
 * decoding.readVarString(decoder) // => 'Hello world!'
 * decoding.hasContent(decoder) // => false - all data is read
 * ```
 *
 * @module decoding
 */





/**
 * A Decoder handles the decoding of an Uint8Array.
 */
class Decoder {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor (uint8Array) {
    /**
     * Decoding target.
     *
     * @type {Uint8Array}
     */
    this.arr = uint8Array
    /**
     * Current decoding position.
     *
     * @type {number}
     */
    this.pos = 0
  }
}

/**
 * @function
 * @param {Uint8Array} uint8Array
 * @return {Decoder}
 */
const createDecoder = uint8Array => new Decoder(uint8Array)

/**
 * @function
 * @param {Decoder} decoder
 * @return {boolean}
 */
const hasContent = decoder => decoder.pos !== decoder.arr.length

/**
 * Clone a decoder instance.
 * Optionally set a new position parameter.
 *
 * @function
 * @param {Decoder} decoder The decoder instance
 * @param {number} [newPos] Defaults to current position
 * @return {Decoder} A clone of `decoder`
 */
const clone = (decoder, newPos = decoder.pos) => {
  const _decoder = createDecoder(decoder.arr)
  _decoder.pos = newPos
  return _decoder
}

/**
 * Create an Uint8Array view of the next `len` bytes and advance the position by `len`.
 *
 * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
 *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
 *
 * @function
 * @param {Decoder} decoder The decoder instance
 * @param {number} len The length of bytes to read
 * @return {Uint8Array}
 */
const readUint8Array = (decoder, len) => {
  const view = _buffer_js__WEBPACK_IMPORTED_MODULE_0__["createUint8ArrayViewFromArrayBuffer"](decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len)
  decoder.pos += len
  return view
}

/**
 * Read variable length Uint8Array.
 *
 * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
 *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
 *
 * @function
 * @param {Decoder} decoder
 * @return {Uint8Array}
 */
const readVarUint8Array = decoder => readUint8Array(decoder, readVarUint(decoder))

/**
 * Read the rest of the content as an ArrayBuffer
 * @function
 * @param {Decoder} decoder
 * @return {Uint8Array}
 */
const readTailAsUint8Array = decoder => readUint8Array(decoder, decoder.arr.length - decoder.pos)

/**
 * Skip one byte, jump to the next position.
 * @function
 * @param {Decoder} decoder The decoder instance
 * @return {number} The next position
 */
const skip8 = decoder => decoder.pos++

/**
 * Read one byte as unsigned integer.
 * @function
 * @param {Decoder} decoder The decoder instance
 * @return {number} Unsigned 8-bit integer
 */
const readUint8 = decoder => decoder.arr[decoder.pos++]

/**
 * Read 2 bytes as unsigned integer.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const readUint16 = decoder => {
  const uint =
    decoder.arr[decoder.pos] +
    (decoder.arr[decoder.pos + 1] << 8)
  decoder.pos += 2
  return uint
}

/**
 * Read 4 bytes as unsigned integer.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const readUint32 = decoder => {
  const uint =
    (decoder.arr[decoder.pos] +
    (decoder.arr[decoder.pos + 1] << 8) +
    (decoder.arr[decoder.pos + 2] << 16) +
    (decoder.arr[decoder.pos + 3] << 24)) >>> 0
  decoder.pos += 4
  return uint
}

/**
 * Read 4 bytes as unsigned integer in big endian order.
 * (most significant byte first)
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const readUint32BigEndian = decoder => {
  const uint =
    (decoder.arr[decoder.pos + 3] +
    (decoder.arr[decoder.pos + 2] << 8) +
    (decoder.arr[decoder.pos + 1] << 16) +
    (decoder.arr[decoder.pos] << 24)) >>> 0
  decoder.pos += 4
  return uint
}

/**
 * Look ahead without incrementing position.
 * to the next byte and read it as unsigned integer.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const peekUint8 = decoder => decoder.arr[decoder.pos]

/**
 * Look ahead without incrementing position.
 * to the next byte and read it as unsigned integer.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const peekUint16 = decoder =>
  decoder.arr[decoder.pos] +
  (decoder.arr[decoder.pos + 1] << 8)

/**
 * Look ahead without incrementing position.
 * to the next byte and read it as unsigned integer.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.
 */
const peekUint32 = decoder => (
  decoder.arr[decoder.pos] +
  (decoder.arr[decoder.pos + 1] << 8) +
  (decoder.arr[decoder.pos + 2] << 16) +
  (decoder.arr[decoder.pos + 3] << 24)
) >>> 0

/**
 * Read unsigned integer (32bit) with variable length.
 * 1/8th of the storage is used as encoding overhead.
 *  * numbers < 2^7 is stored in one bytlength
 *  * numbers < 2^14 is stored in two bylength
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.length
 */
const readVarUint = decoder => {
  let num = 0
  let len = 0
  while (true) {
    const r = decoder.arr[decoder.pos++]
    num = num | ((r & _binary_js__WEBPACK_IMPORTED_MODULE_1__["BITS7"]) << len)
    len += 7
    if (r < _binary_js__WEBPACK_IMPORTED_MODULE_1__["BIT8"]) {
      return num >>> 0 // return unsigned number!
    }
    /* istanbul ignore if */
    if (len > 35) {
      throw new Error('Integer out of range!')
    }
  }
}

/**
 * Read signed integer (32bit) with variable length.
 * 1/8th of the storage is used as encoding overhead.
 *  * numbers < 2^7 is stored in one bytlength
 *  * numbers < 2^14 is stored in two bylength
 * @todo This should probably create the inverse ~num if unmber is negative - but this would be a breaking change.
 *
 * @function
 * @param {Decoder} decoder
 * @return {number} An unsigned integer.length
 */
const readVarInt = decoder => {
  let r = decoder.arr[decoder.pos++]
  let num = r & _binary_js__WEBPACK_IMPORTED_MODULE_1__["BITS6"]
  let len = 6
  const sign = (r & _binary_js__WEBPACK_IMPORTED_MODULE_1__["BIT7"]) > 0 ? -1 : 1
  if ((r & _binary_js__WEBPACK_IMPORTED_MODULE_1__["BIT8"]) === 0) {
    // don't continue reading
    return sign * num
  }
  while (true) {
    r = decoder.arr[decoder.pos++]
    num = num | ((r & _binary_js__WEBPACK_IMPORTED_MODULE_1__["BITS7"]) << len)
    len += 7
    if (r < _binary_js__WEBPACK_IMPORTED_MODULE_1__["BIT8"]) {
      return sign * (num >>> 0)
    }
    /* istanbul ignore if */
    if (len > 41) {
      throw new Error('Integer out of range!')
    }
  }
}

/**
 * Look ahead and read varUint without incrementing position
 *
 * @function
 * @param {Decoder} decoder
 * @return {number}
 */
const peekVarUint = decoder => {
  const pos = decoder.pos
  const s = readVarUint(decoder)
  decoder.pos = pos
  return s
}

/**
 * Look ahead and read varUint without incrementing position
 *
 * @function
 * @param {Decoder} decoder
 * @return {number}
 */
const peekVarInt = decoder => {
  const pos = decoder.pos
  const s = readVarInt(decoder)
  decoder.pos = pos
  return s
}

/**
 * Read string of variable length
 * * varUint is used to store the length of the string
 *
 * Transforming utf8 to a string is pretty expensive. The code performs 10x better
 * when String.fromCodePoint is fed with all characters as arguments.
 * But most environments have a maximum number of arguments per functions.
 * For effiency reasons we apply a maximum of 10000 characters at once.
 *
 * @function
 * @param {Decoder} decoder
 * @return {String} The read String.
 */
const readVarString = decoder => {
  let remainingLen = readVarUint(decoder)
  if (remainingLen === 0) {
    return ''
  } else {
    let encodedString = String.fromCodePoint(readUint8(decoder)) // remember to decrease remainingLen
    if (--remainingLen < 100) { // do not create a Uint8Array for small strings
      while (remainingLen--) {
        encodedString += String.fromCodePoint(readUint8(decoder))
      }
    } else {
      while (remainingLen > 0) {
        const nextLen = remainingLen < 10000 ? remainingLen : 10000
        // this is dangerous, we create a fresh array view from the existing buffer
        const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen)
        decoder.pos += nextLen
        // Starting with ES5.1 we can supply a generic array-like object as arguments
        encodedString += String.fromCodePoint.apply(null, /** @type {any} */ (bytes))
        remainingLen -= nextLen
      }
    }
    return decodeURIComponent(escape(encodedString))
  }
}

/**
 * Look ahead and read varString without incrementing position
 *
 * @function
 * @param {Decoder} decoder
 * @return {string}
 */
const peekVarString = decoder => {
  const pos = decoder.pos
  const s = readVarString(decoder)
  decoder.pos = pos
  return s
}

/**
 * @param {Decoder} decoder
 * @param {number} len
 * @return {DataView}
 */
const readFromDataView = (decoder, len) => {
  const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len)
  decoder.pos += len
  return dv
}

/**
 * @param {Decoder} decoder
 */
const readFloat32 = decoder => readFromDataView(decoder, 4).getFloat32(0)

/**
 * @param {Decoder} decoder
 */
const readFloat64 = decoder => readFromDataView(decoder, 8).getFloat64(0)

/**
 * @param {Decoder} decoder
 */
const readBigInt64 = decoder => /** @type {any} */ (readFromDataView(decoder, 8)).getBigInt64(0)

/**
 * @param {Decoder} decoder
 */
const readBigUint64 = decoder => /** @type {any} */ (readFromDataView(decoder, 8)).getBigUint64(0)

/**
 * @type {Array<function(Decoder):any>}
 */
const readAnyLookupTable = [
  decoder => undefined, // CASE 127: undefined
  decoder => null, // CASE 126: null
  readVarInt, // CASE 125: integer
  readFloat32, // CASE 124: float32
  readFloat64, // CASE 123: float64
  readBigInt64, // CASE 122: bigint
  decoder => false, // CASE 121: boolean (false)
  decoder => true, // CASE 120: boolean (true)
  readVarString, // CASE 119: string
  decoder => { // CASE 118: object<string,any>
    const len = readVarUint(decoder)
    /**
     * @type {Object<string,any>}
     */
    const obj = {}
    for (let i = 0; i < len; i++) {
      const key = readVarString(decoder)
      obj[key] = readAny(decoder)
    }
    return obj
  },
  decoder => { // CASE 117: array<any>
    const len = readVarUint(decoder)
    const arr = []
    for (let i = 0; i < len; i++) {
      arr.push(readAny(decoder))
    }
    return arr
  },
  readVarUint8Array // CASE 116: Uint8Array
]

/**
 * @param {Decoder} decoder
 */
const readAny = decoder => readAnyLookupTable[127 - readUint8(decoder)](decoder)

/**
 * T must not be null.
 *
 * @template T
 */
class RleDecoder extends Decoder {
  /**
   * @param {Uint8Array} uint8Array
   * @param {function(Decoder):T} reader
   */
  constructor (uint8Array, reader) {
    super(uint8Array)
    /**
     * The reader
     */
    this.reader = reader
    /**
     * Current state
     * @type {T|null}
     */
    this.s = null
    this.count = 0
  }

  read () {
    if (this.count === 0) {
      this.s = this.reader(this)
      if (hasContent(this)) {
        this.count = readVarUint(this) + 1 // see encoder implementation for the reason why this is incremented
      } else {
        this.count = -1 // read the current value forever
      }
    }
    this.count--
    return /** @type {T} */ (this.s)
  }
}

class IntDiffDecoder extends Decoder {
  /**
   * @param {Uint8Array} uint8Array
   * @param {number} start
   */
  constructor (uint8Array, start) {
    super(uint8Array)
    /**
     * Current state
     * @type {number}
     */
    this.s = start
  }

  /**
   * @return {number}
   */
  read () {
    this.s += readVarInt(this)
    return this.s
  }
}

class RleIntDiffDecoder extends Decoder {
  /**
   * @param {Uint8Array} uint8Array
   * @param {number} start
   */
  constructor (uint8Array, start) {
    super(uint8Array)
    /**
     * Current state
     * @type {number}
     */
    this.s = start
    this.count = 0
  }

  /**
   * @return {number}
   */
  read () {
    if (this.count === 0) {
      this.s += readVarInt(this)
      if (hasContent(this)) {
        this.count = readVarUint(this) + 1 // see encoder implementation for the reason why this is incremented
      } else {
        this.count = -1 // read the current value forever
      }
    }
    this.count--
    return /** @type {number} */ (this.s)
  }
}

class UintOptRleDecoder extends Decoder {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor (uint8Array) {
    super(uint8Array)
    /**
     * @type {number}
     */
    this.s = 0
    this.count = 0
  }

  read () {
    if (this.count === 0) {
      this.s = readVarInt(this)
      // if the sign is negative, we read the count too, otherwise count is 1
      const isNegative = _math_js__WEBPACK_IMPORTED_MODULE_2__["isNegativeZero"](this.s)
      this.count = 1
      if (isNegative) {
        this.s = -this.s
        this.count = readVarUint(this) + 2
      }
    }
    this.count--
    return /** @type {number} */ (this.s)
  }
}

class IncUintOptRleDecoder extends Decoder {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor (uint8Array) {
    super(uint8Array)
    /**
     * @type {number}
     */
    this.s = 0
    this.count = 0
  }

  read () {
    if (this.count === 0) {
      this.s = readVarInt(this)
      // if the sign is negative, we read the count too, otherwise count is 1
      const isNegative = _math_js__WEBPACK_IMPORTED_MODULE_2__["isNegativeZero"](this.s)
      this.count = 1
      if (isNegative) {
        this.s = -this.s
        this.count = readVarUint(this) + 2
      }
    }
    this.count--
    return /** @type {number} */ (this.s++)
  }
}

class IntDiffOptRleDecoder extends Decoder {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor (uint8Array) {
    super(uint8Array)
    /**
     * @type {number}
     */
    this.s = 0
    this.count = 0
    this.diff = 0
  }

  /**
   * @return {number}
   */
  read () {
    if (this.count === 0) {
      const diff = readVarInt(this)
      // if the first bit is set, we read more data
      const hasCount = diff & 1
      this.diff = diff >> 1
      this.count = 1
      if (hasCount) {
        this.count = readVarUint(this) + 2
      }
    }
    this.s += this.diff
    this.count--
    return this.s
  }
}

class StringDecoder {
  /**
   * @param {Uint8Array} uint8Array
   */
  constructor (uint8Array) {
    this.decoder = new UintOptRleDecoder(uint8Array)
    this.str = readVarString(this.decoder)
    /**
     * @type {number}
     */
    this.spos = 0
  }

  /**
   * @return {string}
   */
  read () {
    const end = this.spos + this.decoder.read()
    const res = this.str.slice(this.spos, end)
    this.spos = end
    return res
  }
}


/***/ }),

/***/ "./node_modules/lib0/dom.js":
/*!**********************************!*\
  !*** ./node_modules/lib0/dom.js ***!
  \**********************************/
/*! exports provided: doc, createElement, createDocumentFragment, createTextNode, domParser, emitCustomEvent, setAttributes, setAttributesMap, fragment, append, remove, addEventListener, removeEventListener, addEventListeners, removeEventListeners, element, canvas, text, pairToStyleString, pairsToStyleString, mapToStyleString, querySelector, querySelectorAll, getElementById, parseFragment, parseElement, replaceWith, insertBefore, appendChild, ELEMENT_NODE, TEXT_NODE, CDATA_SECTION_NODE, COMMENT_NODE, DOCUMENT_NODE, DOCUMENT_TYPE_NODE, DOCUMENT_FRAGMENT_NODE, checkNodeType, isParentOf */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doc", function() { return doc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createElement", function() { return createElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDocumentFragment", function() { return createDocumentFragment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createTextNode", function() { return createTextNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "domParser", function() { return domParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "emitCustomEvent", function() { return emitCustomEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setAttributes", function() { return setAttributes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setAttributesMap", function() { return setAttributesMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fragment", function() { return fragment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "append", function() { return append; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addEventListener", function() { return addEventListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeEventListener", function() { return removeEventListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addEventListeners", function() { return addEventListeners; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeEventListeners", function() { return removeEventListeners; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "element", function() { return element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "canvas", function() { return canvas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "text", function() { return text; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pairToStyleString", function() { return pairToStyleString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pairsToStyleString", function() { return pairsToStyleString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapToStyleString", function() { return mapToStyleString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "querySelector", function() { return querySelector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "querySelectorAll", function() { return querySelectorAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getElementById", function() { return getElementById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseFragment", function() { return parseFragment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseElement", function() { return parseElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "replaceWith", function() { return replaceWith; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insertBefore", function() { return insertBefore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "appendChild", function() { return appendChild; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ELEMENT_NODE", function() { return ELEMENT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TEXT_NODE", function() { return TEXT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CDATA_SECTION_NODE", function() { return CDATA_SECTION_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMENT_NODE", function() { return COMMENT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOCUMENT_NODE", function() { return DOCUMENT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOCUMENT_TYPE_NODE", function() { return DOCUMENT_TYPE_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DOCUMENT_FRAGMENT_NODE", function() { return DOCUMENT_FRAGMENT_NODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkNodeType", function() { return checkNodeType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isParentOf", function() { return isParentOf; });
/* harmony import */ var _pair_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pair.js */ "./node_modules/lib0/pair.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map.js */ "./node_modules/lib0/map.js");
/* eslint-env browser */

/**
 * Utility module to work with the DOM.
 *
 * @module dom
 */




/* istanbul ignore next */
/**
 * @type {Document}
 */
const doc = /** @type {Document} */ (typeof document !== 'undefined' ? document : {})

/**
 * @param {string} name
 * @return {HTMLElement}
 */
/* istanbul ignore next */
const createElement = name => doc.createElement(name)

/**
 * @return {DocumentFragment}
 */
/* istanbul ignore next */
const createDocumentFragment = () => doc.createDocumentFragment()

/**
 * @param {string} text
 * @return {Text}
 */
/* istanbul ignore next */
const createTextNode = text => doc.createTextNode(text)

/* istanbul ignore next */
const domParser = /** @type {DOMParser} */ (typeof DOMParser !== 'undefined' ? new DOMParser() : null)

/**
 * @param {HTMLElement} el
 * @param {string} name
 * @param {Object} opts
 */
/* istanbul ignore next */
const emitCustomEvent = (el, name, opts) => el.dispatchEvent(new CustomEvent(name, opts))

/**
 * @param {Element} el
 * @param {Array<pair.Pair<string,string|boolean>>} attrs Array of key-value pairs
 * @return {Element}
 */
/* istanbul ignore next */
const setAttributes = (el, attrs) => {
  _pair_js__WEBPACK_IMPORTED_MODULE_0__["forEach"](attrs, (key, value) => {
    if (value === false) {
      el.removeAttribute(key)
    } else if (value === true) {
      el.setAttribute(key, '')
    } else {
      // @ts-ignore
      el.setAttribute(key, value)
    }
  })
  return el
}

/**
 * @param {Element} el
 * @param {Map<string, string>} attrs Array of key-value pairs
 * @return {Element}
 */
/* istanbul ignore next */
const setAttributesMap = (el, attrs) => {
  attrs.forEach((value, key) => { el.setAttribute(key, value) })
  return el
}

/**
 * @param {Array<Node>|HTMLCollection} children
 * @return {DocumentFragment}
 */
/* istanbul ignore next */
const fragment = children => {
  const fragment = createDocumentFragment()
  for (let i = 0; i < children.length; i++) {
    appendChild(fragment, children[i])
  }
  return fragment
}

/**
 * @param {Element} parent
 * @param {Array<Node>} nodes
 * @return {Element}
 */
/* istanbul ignore next */
const append = (parent, nodes) => {
  appendChild(parent, fragment(nodes))
  return parent
}

/**
 * @param {HTMLElement} el
 */
/* istanbul ignore next */
const remove = el => el.remove()

/**
 * @param {EventTarget} el
 * @param {string} name
 * @param {EventListener} f
 */
/* istanbul ignore next */
const addEventListener = (el, name, f) => el.addEventListener(name, f)

/**
 * @param {EventTarget} el
 * @param {string} name
 * @param {EventListener} f
 */
/* istanbul ignore next */
const removeEventListener = (el, name, f) => el.removeEventListener(name, f)

/**
 * @param {Node} node
 * @param {Array<pair.Pair<string,EventListener>>} listeners
 * @return {Node}
 */
/* istanbul ignore next */
const addEventListeners = (node, listeners) => {
  _pair_js__WEBPACK_IMPORTED_MODULE_0__["forEach"](listeners, (name, f) => addEventListener(node, name, f))
  return node
}

/**
 * @param {Node} node
 * @param {Array<pair.Pair<string,EventListener>>} listeners
 * @return {Node}
 */
/* istanbul ignore next */
const removeEventListeners = (node, listeners) => {
  _pair_js__WEBPACK_IMPORTED_MODULE_0__["forEach"](listeners, (name, f) => removeEventListener(node, name, f))
  return node
}

/**
 * @param {string} name
 * @param {Array<pair.Pair<string,string>|pair.Pair<string,boolean>>} attrs Array of key-value pairs
 * @param {Array<Node>} children
 * @return {Element}
 */
/* istanbul ignore next */
const element = (name, attrs = [], children = []) =>
  append(setAttributes(createElement(name), attrs), children)

/**
 * @param {number} width
 * @param {number} height
 */
/* istanbul ignore next */
const canvas = (width, height) => {
  const c = /** @type {HTMLCanvasElement} */ (createElement('canvas'))
  c.height = height
  c.width = width
  return c
}

/**
 * @param {string} t
 * @return {Text}
 */
/* istanbul ignore next */
const text = createTextNode

/**
 * @param {pair.Pair<string,string>} pair
 */
/* istanbul ignore next */
const pairToStyleString = pair => `${pair.left}:${pair.right};`

/**
 * @param {Array<pair.Pair<string,string>>} pairs
 * @return {string}
 */
/* istanbul ignore next */
const pairsToStyleString = pairs => pairs.map(pairToStyleString).join('')

/**
 * @param {Map<string,string>} m
 * @return {string}
 */
/* istanbul ignore next */
const mapToStyleString = m => _map_js__WEBPACK_IMPORTED_MODULE_1__["map"](m, (value, key) => `${key}:${value};`).join('')

/**
 * @todo should always query on a dom element
 *
 * @param {HTMLElement|ShadowRoot} el
 * @param {string} query
 * @return {HTMLElement | null}
 */
/* istanbul ignore next */
const querySelector = (el, query) => el.querySelector(query)

/**
 * @param {HTMLElement|ShadowRoot} el
 * @param {string} query
 * @return {NodeListOf<HTMLElement>}
 */
/* istanbul ignore next */
const querySelectorAll = (el, query) => el.querySelectorAll(query)

/**
 * @param {string} id
 * @return {HTMLElement}
 */
/* istanbul ignore next */
const getElementById = id => /** @type {HTMLElement} */ (doc.getElementById(id))

/**
 * @param {string} html
 * @return {HTMLElement}
 */
/* istanbul ignore next */
const _parse = html => domParser.parseFromString(`<html><body>${html}</body></html>`, 'text/html').body

/**
 * @param {string} html
 * @return {DocumentFragment}
 */
/* istanbul ignore next */
const parseFragment = html => fragment(/** @type {any} */ (_parse(html).childNodes))

/**
 * @param {string} html
 * @return {HTMLElement}
 */
/* istanbul ignore next */
const parseElement = html => /** @type HTMLElement */ (_parse(html).firstElementChild)

/**
 * @param {HTMLElement} oldEl
 * @param {HTMLElement|DocumentFragment} newEl
 */
/* istanbul ignore next */
const replaceWith = (oldEl, newEl) => oldEl.replaceWith(newEl)

/**
 * @param {HTMLElement} parent
 * @param {HTMLElement} el
 * @param {Node|null} ref
 * @return {HTMLElement}
 */
/* istanbul ignore next */
const insertBefore = (parent, el, ref) => parent.insertBefore(el, ref)

/**
 * @param {Node} parent
 * @param {Node} child
 * @return {Node}
 */
/* istanbul ignore next */
const appendChild = (parent, child) => parent.appendChild(child)

const ELEMENT_NODE = doc.ELEMENT_NODE
const TEXT_NODE = doc.TEXT_NODE
const CDATA_SECTION_NODE = doc.CDATA_SECTION_NODE
const COMMENT_NODE = doc.COMMENT_NODE
const DOCUMENT_NODE = doc.DOCUMENT_NODE
const DOCUMENT_TYPE_NODE = doc.DOCUMENT_TYPE_NODE
const DOCUMENT_FRAGMENT_NODE = doc.DOCUMENT_FRAGMENT_NODE

/**
 * @param {any} node
 * @param {number} type
 */
const checkNodeType = (node, type) => node.nodeType === type

/**
 * @param {Node} parent
 * @param {HTMLElement} child
 */
const isParentOf = (parent, child) => {
  let p = child.parentNode
  while (p && p !== parent) {
    p = p.parentNode
  }
  return p === parent
}


/***/ }),

/***/ "./node_modules/lib0/encoding.js":
/*!***************************************!*\
  !*** ./node_modules/lib0/encoding.js ***!
  \***************************************/
/*! exports provided: Encoder, createEncoder, length, toUint8Array, write, set, writeUint8, setUint8, writeUint16, setUint16, writeUint32, writeUint32BigEndian, setUint32, writeVarUint, writeVarInt, writeVarString, writeBinaryEncoder, writeUint8Array, writeVarUint8Array, writeOnDataView, writeFloat32, writeFloat64, writeBigInt64, writeBigUint64, writeAny, RleEncoder, IntDiffEncoder, RleIntDiffEncoder, UintOptRleEncoder, IncUintOptRleEncoder, IntDiffOptRleEncoder, StringEncoder */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Encoder", function() { return Encoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEncoder", function() { return createEncoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "length", function() { return length; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toUint8Array", function() { return toUint8Array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "write", function() { return write; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set", function() { return set; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeUint8", function() { return writeUint8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setUint8", function() { return setUint8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeUint16", function() { return writeUint16; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setUint16", function() { return setUint16; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeUint32", function() { return writeUint32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeUint32BigEndian", function() { return writeUint32BigEndian; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setUint32", function() { return setUint32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeVarUint", function() { return writeVarUint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeVarInt", function() { return writeVarInt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeVarString", function() { return writeVarString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeBinaryEncoder", function() { return writeBinaryEncoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeUint8Array", function() { return writeUint8Array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeVarUint8Array", function() { return writeVarUint8Array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeOnDataView", function() { return writeOnDataView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeFloat32", function() { return writeFloat32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeFloat64", function() { return writeFloat64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeBigInt64", function() { return writeBigInt64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeBigUint64", function() { return writeBigUint64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeAny", function() { return writeAny; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RleEncoder", function() { return RleEncoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntDiffEncoder", function() { return IntDiffEncoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RleIntDiffEncoder", function() { return RleIntDiffEncoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UintOptRleEncoder", function() { return UintOptRleEncoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IncUintOptRleEncoder", function() { return IncUintOptRleEncoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntDiffOptRleEncoder", function() { return IntDiffOptRleEncoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StringEncoder", function() { return StringEncoder; });
/* harmony import */ var _buffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./buffer.js */ "./node_modules/lib0/buffer.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./math.js */ "./node_modules/lib0/math.js");
/* harmony import */ var _number_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./number.js */ "./node_modules/lib0/number.js");
/* harmony import */ var _binary_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./binary.js */ "./node_modules/lib0/binary.js");
/**
 * Efficient schema-less binary encoding with support for variable length encoding.
 *
 * Use [lib0/encoding] with [lib0/decoding]. Every encoding function has a corresponding decoding function.
 *
 * Encodes numbers in little-endian order (least to most significant byte order)
 * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
 * which is also used in Protocol Buffers.
 *
 * ```js
 * // encoding step
 * const encoder = new encoding.createEncoder()
 * encoding.writeVarUint(encoder, 256)
 * encoding.writeVarString(encoder, 'Hello world!')
 * const buf = encoding.toUint8Array(encoder)
 * ```
 *
 * ```js
 * // decoding step
 * const decoder = new decoding.createDecoder(buf)
 * decoding.readVarUint(decoder) // => 256
 * decoding.readVarString(decoder) // => 'Hello world!'
 * decoding.hasContent(decoder) // => false - all data is read
 * ```
 *
 * @module encoding
 */






/**
 * A BinaryEncoder handles the encoding to an Uint8Array.
 */
class Encoder {
  constructor () {
    this.cpos = 0
    this.cbuf = new Uint8Array(100)
    /**
     * @type {Array<Uint8Array>}
     */
    this.bufs = []
  }
}

/**
 * @function
 * @return {Encoder}
 */
const createEncoder = () => new Encoder()

/**
 * The current length of the encoded data.
 *
 * @function
 * @param {Encoder} encoder
 * @return {number}
 */
const length = encoder => {
  let len = encoder.cpos
  for (let i = 0; i < encoder.bufs.length; i++) {
    len += encoder.bufs[i].length
  }
  return len
}

/**
 * Transform to Uint8Array.
 *
 * @function
 * @param {Encoder} encoder
 * @return {Uint8Array} The created ArrayBuffer.
 */
const toUint8Array = encoder => {
  const uint8arr = new Uint8Array(length(encoder))
  let curPos = 0
  for (let i = 0; i < encoder.bufs.length; i++) {
    const d = encoder.bufs[i]
    uint8arr.set(d, curPos)
    curPos += d.length
  }
  uint8arr.set(_buffer_js__WEBPACK_IMPORTED_MODULE_0__["createUint8ArrayViewFromArrayBuffer"](encoder.cbuf.buffer, 0, encoder.cpos), curPos)
  return uint8arr
}

/**
 * Verify that it is possible to write `len` bytes wtihout checking. If
 * necessary, a new Buffer with the required length is attached.
 *
 * @param {Encoder} encoder
 * @param {number} len
 */
const verifyLen = (encoder, len) => {
  const bufferLen = encoder.cbuf.length
  if (bufferLen - encoder.cpos < len) {
    encoder.bufs.push(_buffer_js__WEBPACK_IMPORTED_MODULE_0__["createUint8ArrayViewFromArrayBuffer"](encoder.cbuf.buffer, 0, encoder.cpos))
    encoder.cbuf = new Uint8Array(_math_js__WEBPACK_IMPORTED_MODULE_1__["max"](bufferLen, len) * 2)
    encoder.cpos = 0
  }
}

/**
 * Write one byte to the encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The byte that is to be encoded.
 */
const write = (encoder, num) => {
  const bufferLen = encoder.cbuf.length
  if (encoder.cpos === bufferLen) {
    encoder.bufs.push(encoder.cbuf)
    encoder.cbuf = new Uint8Array(bufferLen * 2)
    encoder.cpos = 0
  }
  encoder.cbuf[encoder.cpos++] = num
}

/**
 * Write one byte at a specific position.
 * Position must already be written (i.e. encoder.length > pos)
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} pos Position to which to write data
 * @param {number} num Unsigned 8-bit integer
 */
const set = (encoder, pos, num) => {
  let buffer = null
  // iterate all buffers and adjust position
  for (let i = 0; i < encoder.bufs.length && buffer === null; i++) {
    const b = encoder.bufs[i]
    if (pos < b.length) {
      buffer = b // found buffer
    } else {
      pos -= b.length
    }
  }
  if (buffer === null) {
    // use current buffer
    buffer = encoder.cbuf
  }
  buffer[pos] = num
}

/**
 * Write one byte as an unsigned integer.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint8 = write

/**
 * Write one byte as an unsigned Integer at a specific location.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} pos The location where the data will be written.
 * @param {number} num The number that is to be encoded.
 */
const setUint8 = set

/**
 * Write two bytes as an unsigned integer.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint16 = (encoder, num) => {
  write(encoder, num & _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS8"])
  write(encoder, (num >>> 8) & _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS8"])
}
/**
 * Write two bytes as an unsigned integer at a specific location.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} pos The location where the data will be written.
 * @param {number} num The number that is to be encoded.
 */
const setUint16 = (encoder, pos, num) => {
  set(encoder, pos, num & _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS8"])
  set(encoder, pos + 1, (num >>> 8) & _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS8"])
}

/**
 * Write two bytes as an unsigned integer
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint32 = (encoder, num) => {
  for (let i = 0; i < 4; i++) {
    write(encoder, num & _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS8"])
    num >>>= 8
  }
}

/**
 * Write two bytes as an unsigned integer in big endian order.
 * (most significant byte first)
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeUint32BigEndian = (encoder, num) => {
  for (let i = 3; i >= 0; i--) {
    write(encoder, (num >>> (8 * i)) & _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS8"])
  }
}

/**
 * Write two bytes as an unsigned integer at a specific location.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} pos The location where the data will be written.
 * @param {number} num The number that is to be encoded.
 */
const setUint32 = (encoder, pos, num) => {
  for (let i = 0; i < 4; i++) {
    set(encoder, pos + i, num & _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS8"])
    num >>>= 8
  }
}

/**
 * Write a variable length unsigned integer.
 *
 * Encodes integers in the range from [0, 4294967295] / [0, 0xffffffff]. (max 32 bit unsigned integer)
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeVarUint = (encoder, num) => {
  while (num > _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS7"]) {
    write(encoder, _binary_js__WEBPACK_IMPORTED_MODULE_3__["BIT8"] | (_binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS7"] & num))
    num >>>= 7
  }
  write(encoder, _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS7"] & num)
}

/**
 * Write a variable length integer.
 *
 * Encodes integers in the range from [-2147483648, -2147483647].
 *
 * We don't use zig-zag encoding because we want to keep the option open
 * to use the same function for BigInt and 53bit integers (doubles).
 *
 * We use the 7th bit instead for signaling that this is a negative number.
 *
 * @function
 * @param {Encoder} encoder
 * @param {number} num The number that is to be encoded.
 */
const writeVarInt = (encoder, num) => {
  const isNegative = _math_js__WEBPACK_IMPORTED_MODULE_1__["isNegativeZero"](num)
  if (isNegative) {
    num = -num
  }
  //             |- whether to continue reading         |- whether is negative     |- number
  write(encoder, (num > _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS6"] ? _binary_js__WEBPACK_IMPORTED_MODULE_3__["BIT8"] : 0) | (isNegative ? _binary_js__WEBPACK_IMPORTED_MODULE_3__["BIT7"] : 0) | (_binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS6"] & num))
  num >>>= 6
  // We don't need to consider the case of num === 0 so we can use a different
  // pattern here than above.
  while (num > 0) {
    write(encoder, (num > _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS7"] ? _binary_js__WEBPACK_IMPORTED_MODULE_3__["BIT8"] : 0) | (_binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS7"] & num))
    num >>>= 7
  }
}

/**
 * Write a variable length string.
 *
 * @function
 * @param {Encoder} encoder
 * @param {String} str The string that is to be encoded.
 */
const writeVarString = (encoder, str) => {
  const encodedString = unescape(encodeURIComponent(str))
  const len = encodedString.length
  writeVarUint(encoder, len)
  for (let i = 0; i < len; i++) {
    write(encoder, /** @type {number} */ (encodedString.codePointAt(i)))
  }
}

/**
 * Write the content of another Encoder.
 *
 * @TODO: can be improved!
 *        - Note: Should consider that when appending a lot of small Encoders, we should rather clone than referencing the old structure.
 *                Encoders start with a rather big initial buffer.
 *
 * @function
 * @param {Encoder} encoder The enUint8Arr
 * @param {Encoder} append The BinaryEncoder to be written.
 */
const writeBinaryEncoder = (encoder, append) => writeUint8Array(encoder, toUint8Array(append))

/**
 * Append fixed-length Uint8Array to the encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {Uint8Array} uint8Array
 */
const writeUint8Array = (encoder, uint8Array) => {
  const bufferLen = encoder.cbuf.length
  const cpos = encoder.cpos
  const leftCopyLen = _math_js__WEBPACK_IMPORTED_MODULE_1__["min"](bufferLen - cpos, uint8Array.length)
  const rightCopyLen = uint8Array.length - leftCopyLen
  encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos)
  encoder.cpos += leftCopyLen
  if (rightCopyLen > 0) {
    // Still something to write, write right half..
    // Append new buffer
    encoder.bufs.push(encoder.cbuf)
    // must have at least size of remaining buffer
    encoder.cbuf = new Uint8Array(_math_js__WEBPACK_IMPORTED_MODULE_1__["max"](bufferLen * 2, rightCopyLen))
    // copy array
    encoder.cbuf.set(uint8Array.subarray(leftCopyLen))
    encoder.cpos = rightCopyLen
  }
}

/**
 * Append an Uint8Array to Encoder.
 *
 * @function
 * @param {Encoder} encoder
 * @param {Uint8Array} uint8Array
 */
const writeVarUint8Array = (encoder, uint8Array) => {
  writeVarUint(encoder, uint8Array.byteLength)
  writeUint8Array(encoder, uint8Array)
}

/**
 * Create an DataView of the next `len` bytes. Use it to write data after
 * calling this function.
 *
 * ```js
 * // write float32 using DataView
 * const dv = writeOnDataView(encoder, 4)
 * dv.setFloat32(0, 1.1)
 * // read float32 using DataView
 * const dv = readFromDataView(encoder, 4)
 * dv.getFloat32(0) // => 1.100000023841858 (leaving it to the reader to find out why this is the correct result)
 * ```
 *
 * @param {Encoder} encoder
 * @param {number} len
 * @return {DataView}
 */
const writeOnDataView = (encoder, len) => {
  verifyLen(encoder, len)
  const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len)
  encoder.cpos += len
  return dview
}

/**
 * @param {Encoder} encoder
 * @param {number} num
 */
const writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num)

/**
 * @param {Encoder} encoder
 * @param {number} num
 */
const writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num)

/**
 * @param {Encoder} encoder
 * @param {bigint} num
 */
const writeBigInt64 = (encoder, num) => /** @type {any} */ (writeOnDataView(encoder, 8)).setBigInt64(0, num)

/**
 * @param {Encoder} encoder
 * @param {bigint} num
 */
const writeBigUint64 = (encoder, num) => /** @type {any} */ (writeOnDataView(encoder, 8)).setBigUint64(0, num)

const floatTestBed = new DataView(new ArrayBuffer(4))
/**
 * Check if a number can be encoded as a 32 bit float.
 *
 * @param {number} num
 * @return {boolean}
 */
const isFloat32 = num => {
  floatTestBed.setFloat32(0, num)
  return floatTestBed.getFloat32(0) === num
}

/**
 * Encode data with efficient binary format.
 *
 * Differences to JSON:
 * • Transforms data to a binary format (not to a string)
 * • Encodes undefined, NaN, and ArrayBuffer (these can't be represented in JSON)
 * • Numbers are efficiently encoded either as a variable length integer, as a
 *   32 bit float, as a 64 bit float, or as a 64 bit bigint.
 *
 * Encoding table:
 *
 * | Data Type           | Prefix   | Encoding Method    | Comment |
 * | ------------------- | -------- | ------------------ | ------- |
 * | undefined           | 127      |                    | Functions, symbol, and everything that cannot be identified is encoded as undefined |
 * | null                | 126      |                    | |
 * | integer             | 125      | writeVarInt        | Only encodes 32 bit signed integers |
 * | float32             | 124      | writeFloat32       | |
 * | float64             | 123      | writeFloat64       | |
 * | bigint              | 122      | writeBigInt64      | |
 * | boolean (false)     | 121      |                    | True and false are different data types so we save the following byte |
 * | boolean (true)      | 120      |                    | - 0b01111000 so the last bit determines whether true or false |
 * | string              | 119      | writeVarString     | |
 * | object<string,any>  | 118      | custom             | Writes {length} then {length} key-value pairs |
 * | array<any>          | 117      | custom             | Writes {length} then {length} json values |
 * | Uint8Array          | 116      | writeVarUint8Array | We use Uint8Array for any kind of binary data |
 *
 * Reasons for the decreasing prefix:
 * We need the first bit for extendability (later we may want to encode the
 * prefix with writeVarUint). The remaining 7 bits are divided as follows:
 * [0-30]   the beginning of the data range is used for custom purposes
 *          (defined by the function that uses this library)
 * [31-127] the end of the data range is used for data encoding by
 *          lib0/encoding.js
 *
 * @param {Encoder} encoder
 * @param {undefined|null|number|bigint|boolean|string|Object<string,any>|Array<any>|Uint8Array} data
 */
const writeAny = (encoder, data) => {
  switch (typeof data) {
    case 'string':
      // TYPE 119: STRING
      write(encoder, 119)
      writeVarString(encoder, data)
      break
    case 'number':
      if (_number_js__WEBPACK_IMPORTED_MODULE_2__["isInteger"](data) && data <= _binary_js__WEBPACK_IMPORTED_MODULE_3__["BITS31"]) {
        // TYPE 125: INTEGER
        write(encoder, 125)
        writeVarInt(encoder, data)
      } else if (isFloat32(data)) {
        // TYPE 124: FLOAT32
        write(encoder, 124)
        writeFloat32(encoder, data)
      } else {
        // TYPE 123: FLOAT64
        write(encoder, 123)
        writeFloat64(encoder, data)
      }
      break
    case 'bigint':
      // TYPE 122: BigInt
      write(encoder, 122)
      writeBigInt64(encoder, data)
      break
    case 'object':
      if (data === null) {
        // TYPE 126: null
        write(encoder, 126)
      } else if (data instanceof Array) {
        // TYPE 117: Array
        write(encoder, 117)
        writeVarUint(encoder, data.length)
        for (let i = 0; i < data.length; i++) {
          writeAny(encoder, data[i])
        }
      } else if (data instanceof Uint8Array) {
        // TYPE 116: ArrayBuffer
        write(encoder, 116)
        writeVarUint8Array(encoder, data)
      } else {
        // TYPE 118: Object
        write(encoder, 118)
        const keys = Object.keys(data)
        writeVarUint(encoder, keys.length)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          writeVarString(encoder, key)
          writeAny(encoder, data[key])
        }
      }
      break
    case 'boolean':
      // TYPE 120/121: boolean (true/false)
      write(encoder, data ? 120 : 121)
      break
    default:
      // TYPE 127: undefined
      write(encoder, 127)
  }
}

/**
 * Now come a few stateful encoder that have their own classes.
 */

/**
 * Basic Run Length Encoder - a basic compression implementation.
 *
 * Encodes [1,1,1,7] to [1,3,7,1] (3 times 1, 1 time 7). This encoder might do more harm than good if there are a lot of values that are not repeated.
 *
 * It was originally used for image compression. Cool .. article http://csbruce.com/cbm/transactor/pdfs/trans_v7_i06.pdf
 *
 * @note T must not be null!
 *
 * @template T
 */
class RleEncoder extends Encoder {
  /**
   * @param {function(Encoder, T):void} writer
   */
  constructor (writer) {
    super()
    /**
     * The writer
     */
    this.w = writer
    /**
     * Current state
     * @type {T|null}
     */
    this.s = null
    this.count = 0
  }

  /**
   * @param {T} v
   */
  write (v) {
    if (this.s === v) {
      this.count++
    } else {
      if (this.count > 0) {
        // flush counter, unless this is the first value (count = 0)
        writeVarUint(this, this.count - 1) // since count is always > 0, we can decrement by one. non-standard encoding ftw
      }
      this.count = 1
      // write first value
      this.w(this, v)
      this.s = v
    }
  }
}

/**
 * Basic diff decoder using variable length encoding.
 *
 * Encodes the values [3, 1100, 1101, 1050, 0] to [3, 1097, 1, -51, -1050] using writeVarInt.
 */
class IntDiffEncoder extends Encoder {
  /**
   * @param {number} start
   */
  constructor (start) {
    super()
    /**
     * Current state
     * @type {number}
     */
    this.s = start
  }

  /**
   * @param {number} v
   */
  write (v) {
    writeVarInt(this, v - this.s)
    this.s = v
  }
}

/**
 * A combination of IntDiffEncoder and RleEncoder.
 *
 * Basically first writes the IntDiffEncoder and then counts duplicate diffs using RleEncoding.
 *
 * Encodes the values [1,1,1,2,3,4,5,6] as [1,1,0,2,1,5] (RLE([1,0,0,1,1,1,1,1]) ⇒ RleIntDiff[1,1,0,2,1,5])
 */
class RleIntDiffEncoder extends Encoder {
  /**
   * @param {number} start
   */
  constructor (start) {
    super()
    /**
     * Current state
     * @type {number}
     */
    this.s = start
    this.count = 0
  }

  /**
   * @param {number} v
   */
  write (v) {
    if (this.s === v && this.count > 0) {
      this.count++
    } else {
      if (this.count > 0) {
        // flush counter, unless this is the first value (count = 0)
        writeVarUint(this, this.count - 1) // since count is always > 0, we can decrement by one. non-standard encoding ftw
      }
      this.count = 1
      // write first value
      writeVarInt(this, v - this.s)
      this.s = v
    }
  }
}

/**
 * @param {UintOptRleEncoder} encoder
 */
const flushUintOptRleEncoder = encoder => {
  if (encoder.count > 0) {
    // flush counter, unless this is the first value (count = 0)
    // case 1: just a single value. set sign to positive
    // case 2: write several values. set sign to negative to indicate that there is a length coming
    writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s)
    if (encoder.count > 1) {
      writeVarUint(encoder.encoder, encoder.count - 2) // since count is always > 1, we can decrement by one. non-standard encoding ftw
    }
  }
}

/**
 * Optimized Rle encoder that does not suffer from the mentioned problem of the basic Rle encoder.
 *
 * Internally uses VarInt encoder to write unsigned integers. If the input occurs multiple times, we write
 * write it as a negative number. The UintOptRleDecoder then understands that it needs to read a count.
 *
 * Encodes [1,2,3,3,3] as [1,2,-3,3] (once 1, once 2, three times 3)
 */
class UintOptRleEncoder {
  constructor () {
    this.encoder = new Encoder()
    /**
     * @type {number}
     */
    this.s = 0
    this.count = 0
  }

  /**
   * @param {number} v
   */
  write (v) {
    if (this.s === v) {
      this.count++
    } else {
      flushUintOptRleEncoder(this)
      this.count = 1
      this.s = v
    }
  }

  toUint8Array () {
    flushUintOptRleEncoder(this)
    return toUint8Array(this.encoder)
  }
}

/**
 * Increasing Uint Optimized RLE Encoder
 *
 * The RLE encoder counts the number of same occurences of the same value.
 * The IncUintOptRle encoder counts if the value increases.
 * I.e. 7, 8, 9, 10 will be encoded as [-7, 4]. 1, 3, 5 will be encoded
 * as [1, 3, 5].
 */
class IncUintOptRleEncoder {
  constructor () {
    this.encoder = new Encoder()
    /**
     * @type {number}
     */
    this.s = 0
    this.count = 0
  }

  /**
   * @param {number} v
   */
  write (v) {
    if (this.s + this.count === v) {
      this.count++
    } else {
      flushUintOptRleEncoder(this)
      this.count = 1
      this.s = v
    }
  }

  toUint8Array () {
    flushUintOptRleEncoder(this)
    return toUint8Array(this.encoder)
  }
}

/**
 * @param {IntDiffOptRleEncoder} encoder
 */
const flushIntDiffOptRleEncoder = encoder => {
  if (encoder.count > 0) {
    //          31 bit making up the diff | wether to write the counter
    const encodedDiff = encoder.diff << 1 | (encoder.count === 1 ? 0 : 1)
    // flush counter, unless this is the first value (count = 0)
    // case 1: just a single value. set first bit to positive
    // case 2: write several values. set first bit to negative to indicate that there is a length coming
    writeVarInt(encoder.encoder, encodedDiff)
    if (encoder.count > 1) {
      writeVarUint(encoder.encoder, encoder.count - 2) // since count is always > 1, we can decrement by one. non-standard encoding ftw
    }
  }
}

/**
 * A combination of the IntDiffEncoder and the UintOptRleEncoder.
 *
 * The count approach is similar to the UintDiffOptRleEncoder, but instead of using the negative bitflag, it encodes
 * in the LSB whether a count is to be read. Therefore this Encoder only supports 31 bit integers!
 *
 * Encodes [1, 2, 3, 2] as [3, 1, 6, -1] (more specifically [(1 << 1) | 1, (3 << 0) | 0, -1])
 *
 * Internally uses variable length encoding. Contrary to normal UintVar encoding, the first byte contains:
 * * 1 bit that denotes whether the next value is a count (LSB)
 * * 1 bit that denotes whether this value is negative (MSB - 1)
 * * 1 bit that denotes whether to continue reading the variable length integer (MSB)
 *
 * Therefore, only five bits remain to encode diff ranges.
 *
 * Use this Encoder only when appropriate. In most cases, this is probably a bad idea.
 */
class IntDiffOptRleEncoder {
  constructor () {
    this.encoder = new Encoder()
    /**
     * @type {number}
     */
    this.s = 0
    this.count = 0
    this.diff = 0
  }

  /**
   * @param {number} v
   */
  write (v) {
    if (this.diff === v - this.s) {
      this.s = v
      this.count++
    } else {
      flushIntDiffOptRleEncoder(this)
      this.count = 1
      this.diff = v - this.s
      this.s = v
    }
  }

  toUint8Array () {
    flushIntDiffOptRleEncoder(this)
    return toUint8Array(this.encoder)
  }
}

/**
 * Optimized String Encoder.
 *
 * Encoding many small strings in a simple Encoder is not very efficient. The function call to decode a string takes some time and creates references that must be eventually deleted.
 * In practice, when decoding several million small strings, the GC will kick in more and more often to collect orphaned string objects (or maybe there is another reason?).
 *
 * This string encoder solves the above problem. All strings are concatenated and written as a single string using a single encoding call.
 *
 * The lengths are encoded using a UintOptRleEncoder.
 */
class StringEncoder {
  constructor () {
    /**
     * @type {Array<string>}
     */
    this.sarr = []
    this.s = ''
    this.lensE = new UintOptRleEncoder()
  }

  /**
   * @param {string} string
   */
  write (string) {
    this.s += string
    if (this.s.length > 19) {
      this.sarr.push(this.s)
      this.s = ''
    }
    this.lensE.write(string.length)
  }

  toUint8Array () {
    const encoder = new Encoder()
    this.sarr.push(this.s)
    this.s = ''
    writeVarString(encoder, this.sarr.join(''))
    writeUint8Array(encoder, this.lensE.toUint8Array())
    return toUint8Array(encoder)
  }
}


/***/ }),

/***/ "./node_modules/lib0/environment.js":
/*!******************************************!*\
  !*** ./node_modules/lib0/environment.js ***!
  \******************************************/
/*! exports provided: isNode, isBrowser, isMac, hasParam, getParam, getVariable, getConf, hasConf, production */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNode", function() { return isNode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBrowser", function() { return isBrowser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMac", function() { return isMac; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasParam", function() { return hasParam; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getParam", function() { return getParam; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVariable", function() { return getVariable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getConf", function() { return getConf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasConf", function() { return hasConf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "production", function() { return production; });
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map.js */ "./node_modules/lib0/map.js");
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./string.js */ "./node_modules/lib0/string.js");
/* harmony import */ var _conditions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./conditions.js */ "./node_modules/lib0/conditions.js");
/* harmony import */ var _storage_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./storage.js */ "./node_modules/lib0/storage.js");
/**
 * Isomorphic module to work access the environment (query params, env variables).
 *
 * @module map
 */






/* istanbul ignore next */
// @ts-ignore
const isNode = typeof process !== 'undefined' && process.release && /node|io\.js/.test(process.release.name)
/* istanbul ignore next */
const isBrowser = typeof window !== 'undefined' && !isNode
/* istanbul ignore next */
const isMac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false

/**
 * @type {Map<string,string>}
 */
let params
const args = []

/* istanbul ignore next */
const computeParams = () => {
  if (params === undefined) {
    if (isNode) {
      params = _map_js__WEBPACK_IMPORTED_MODULE_0__["create"]()
      const pargs = process.argv
      let currParamName = null
      /* istanbul ignore next */
      for (let i = 0; i < pargs.length; i++) {
        const parg = pargs[i]
        if (parg[0] === '-') {
          if (currParamName !== null) {
            params.set(currParamName, '')
          }
          currParamName = parg
        } else {
          if (currParamName !== null) {
            params.set(currParamName, parg)
            currParamName = null
          } else {
            args.push(parg)
          }
        }
      }
      if (currParamName !== null) {
        params.set(currParamName, '')
      }
    // in ReactNative for example this would not be true (unless connected to the Remote Debugger)
    } else if (typeof location === 'object') {
      params = _map_js__WEBPACK_IMPORTED_MODULE_0__["create"]()
      // eslint-disable-next-line no-undef
      ;(location.search || '?').slice(1).split('&').forEach(kv => {
        if (kv.length !== 0) {
          const [key, value] = kv.split('=')
          params.set(`--${_string_js__WEBPACK_IMPORTED_MODULE_1__["fromCamelCase"](key, '-')}`, value)
          params.set(`-${_string_js__WEBPACK_IMPORTED_MODULE_1__["fromCamelCase"](key, '-')}`, value)
        }
      })
    } else {
      params = _map_js__WEBPACK_IMPORTED_MODULE_0__["create"]()
    }
  }
  return params
}

/**
 * @param {string} name
 * @return {boolean}
 */
/* istanbul ignore next */
const hasParam = name => computeParams().has(name)

/**
 * @param {string} name
 * @param {string} defaultVal
 * @return {string}
 */
/* istanbul ignore next */
const getParam = (name, defaultVal) => computeParams().get(name) || defaultVal
// export const getArgs = name => computeParams() && args

/**
 * @param {string} name
 * @return {string|null}
 */
/* istanbul ignore next */
const getVariable = name => isNode ? _conditions_js__WEBPACK_IMPORTED_MODULE_2__["undefinedToNull"](process.env[name.toUpperCase()]) : _conditions_js__WEBPACK_IMPORTED_MODULE_2__["undefinedToNull"](_storage_js__WEBPACK_IMPORTED_MODULE_3__["varStorage"].getItem(name))

/**
 * @param {string} name
 * @return {string|null}
 */
const getConf = name => computeParams().get('--' + name) || getVariable(name)

/**
 * @param {string} name
 * @return {boolean}
 */
/* istanbul ignore next */
const hasConf = name => hasParam('--' + name) || getVariable(name) !== null

/* istanbul ignore next */
const production = hasConf('production')

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/lib0/error.js":
/*!************************************!*\
  !*** ./node_modules/lib0/error.js ***!
  \************************************/
/*! exports provided: create, methodUnimplemented, unexpectedCase */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "methodUnimplemented", function() { return methodUnimplemented; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unexpectedCase", function() { return unexpectedCase; });
/**
 * Error helpers.
 *
 * @module error
 */

/**
 * @param {string} s
 * @return {Error}
 */
/* istanbul ignore next */
const create = s => new Error(s)

/**
 * @throws {Error}
 * @return {never}
 */
/* istanbul ignore next */
const methodUnimplemented = () => {
  throw create('Method unimplemented')
}

/**
 * @throws {Error}
 * @return {never}
 */
/* istanbul ignore next */
const unexpectedCase = () => {
  throw create('Unexpected case')
}


/***/ }),

/***/ "./node_modules/lib0/eventloop.js":
/*!****************************************!*\
  !*** ./node_modules/lib0/eventloop.js ***!
  \****************************************/
/*! exports provided: enqueue, timeout, interval, Animation, animationFrame, idleCallback, createDebouncer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enqueue", function() { return enqueue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "timeout", function() { return timeout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interval", function() { return interval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Animation", function() { return Animation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "animationFrame", function() { return animationFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "idleCallback", function() { return idleCallback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDebouncer", function() { return createDebouncer; });
/* global requestIdleCallback, requestAnimationFrame, cancelIdleCallback, cancelAnimationFrame */

/**
 * Utility module to work with EcmaScript's event loop.
 *
 * @module eventloop
 */

/**
 * @type {Array<function>}
 */
let queue = []

const _runQueue = () => {
  for (let i = 0; i < queue.length; i++) {
    queue[i]()
  }
  queue = []
}

/**
 * @param {function():void} f
 */
const enqueue = f => {
  queue.push(f)
  if (queue.length === 1) {
    setTimeout(_runQueue, 0)
  }
}

/**
 * @typedef {Object} TimeoutObject
 * @property {function} TimeoutObject.destroy
 */

/**
 * @param {function(number):void} clearFunction
 */
const createTimeoutClass = clearFunction => class TT {
  /**
   * @param {number} timeoutId
   */
  constructor (timeoutId) {
    this._ = timeoutId
  }

  destroy () {
    clearFunction(this._)
  }
}

const Timeout = createTimeoutClass(clearTimeout)

/**
 * @param {number} timeout
 * @param {function} callback
 * @return {TimeoutObject}
 */
const timeout = (timeout, callback) => new Timeout(setTimeout(callback, timeout))

const Interval = createTimeoutClass(clearInterval)

/**
 * @param {number} timeout
 * @param {function} callback
 * @return {TimeoutObject}
 */
const interval = (timeout, callback) => new Interval(setInterval(callback, timeout))

/* istanbul ignore next */
const Animation = createTimeoutClass(arg => typeof requestAnimationFrame !== 'undefined' && cancelAnimationFrame(arg))

/* istanbul ignore next */
/**
 * @param {function(number):void} cb
 * @return {TimeoutObject}
 */
const animationFrame = cb => typeof requestAnimationFrame === 'undefined' ? timeout(0, cb) : new Animation(requestAnimationFrame(cb))

/* istanbul ignore next */
// @ts-ignore
const Idle = createTimeoutClass(arg => typeof cancelIdleCallback !== 'undefined' && cancelIdleCallback(arg))

/* istanbul ignore next */
/**
 * Note: this is experimental and is probably only useful in browsers.
 *
 * @param {function} cb
 * @return {TimeoutObject}
 */
// @ts-ignore
const idleCallback = cb => typeof requestIdleCallback !== 'undefined' ? new Idle(requestIdleCallback(cb)) : timeout(1000, cb)

/**
 * @param {number} timeout Timeout of the debounce action
 * @return {function(function():void):void}
 */
const createDebouncer = timeout => {
  let timer = -1
  return f => {
    clearTimeout(timer)
    if (f) {
      timer = /** @type {any} */ (setTimeout(f, timeout))
    }
  }
}


/***/ }),

/***/ "./node_modules/lib0/function.js":
/*!***************************************!*\
  !*** ./node_modules/lib0/function.js ***!
  \***************************************/
/*! exports provided: callAll, nop, apply, id, equalityStrict, equalityFlat, equalityDeep */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "callAll", function() { return callAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nop", function() { return nop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "apply", function() { return apply; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "id", function() { return id; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "equalityStrict", function() { return equalityStrict; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "equalityFlat", function() { return equalityFlat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "equalityDeep", function() { return equalityDeep; });
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./array.js */ "./node_modules/lib0/array.js");
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./object.js */ "./node_modules/lib0/object.js");
/**
 * Common functions and function call helpers.
 *
 * @module function
 */




/**
 * Calls all functions in `fs` with args. Only throws after all functions were called.
 *
 * @param {Array<function>} fs
 * @param {Array<any>} args
 */
const callAll = (fs, args, i = 0) => {
  try {
    for (; i < fs.length; i++) {
      fs[i](...args)
    }
  } finally {
    if (i < fs.length) {
      callAll(fs, args, i + 1)
    }
  }
}

const nop = () => {}

/**
 * @template T
 * @param {function():T} f
 * @return {T}
 */
const apply = f => f()

/**
 * @template A
 *
 * @param {A} a
 * @return {A}
 */
const id = a => a

/**
 * @template T
 *
 * @param {T} a
 * @param {T} b
 * @return {boolean}
 */
const equalityStrict = (a, b) => a === b

/**
 * @template T
 *
 * @param {Array<T>|object} a
 * @param {Array<T>|object} b
 * @return {boolean}
 */
const equalityFlat = (a, b) => a === b || (a != null && b != null && a.constructor === b.constructor && ((a instanceof Array && _array_js__WEBPACK_IMPORTED_MODULE_0__["equalFlat"](a, /** @type {Array<T>} */ (b))) || (typeof a === 'object' && _object_js__WEBPACK_IMPORTED_MODULE_1__["equalFlat"](a, b))))

/**
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
const equalityDeep = (a, b) => {
  if (a == null || b == null) {
    return equalityStrict(a, b)
  }
  if (a.constructor !== b.constructor) {
    return false
  }
  if (a === b) {
    return true
  }
  switch (a.constructor) {
    case ArrayBuffer:
      a = new Uint8Array(a)
      b = new Uint8Array(b)
    // eslint-disable-next-line no-fallthrough
    case Uint8Array: {
      if (a.byteLength !== b.byteLength) {
        return false
      }
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false
        }
      }
      break
    }
    case Set: {
      if (a.size !== b.size) {
        return false
      }
      for (const value of a) {
        if (!b.has(value)) {
          return false
        }
      }
      break
    }
    case Map: {
      if (a.size !== b.size) {
        return false
      }
      for (const key of a.keys()) {
        if (!b.has(key) || !equalityDeep(a.get(key), b.get(key))) {
          return false
        }
      }
      break
    }
    case Object:
      if (_object_js__WEBPACK_IMPORTED_MODULE_1__["length"](a) !== _object_js__WEBPACK_IMPORTED_MODULE_1__["length"](b)) {
        return false
      }
      for (const key in a) {
        if (!_object_js__WEBPACK_IMPORTED_MODULE_1__["hasProperty"](a, key) || !equalityDeep(a[key], b[key])) {
          return false
        }
      }
      break
    case Array:
      if (a.length !== b.length) {
        return false
      }
      for (let i = 0; i < a.length; i++) {
        if (!equalityDeep(a[i], b[i])) {
          return false
        }
      }
      break
    default:
      return false
  }
  return true
}


/***/ }),

/***/ "./node_modules/lib0/indexeddb.js":
/*!****************************************!*\
  !*** ./node_modules/lib0/indexeddb.js ***!
  \****************************************/
/*! exports provided: rtop, openDB, deleteDB, createStores, transact, count, get, del, put, add, addAutoKey, getAll, getAllKeys, queryFirst, getLastKey, getFirstKey, getAllKeysValues, iterate, iterateKeys, getStore, createIDBKeyRangeBound, createIDBKeyRangeUpperBound, createIDBKeyRangeLowerBound */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rtop", function() { return rtop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openDB", function() { return openDB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteDB", function() { return deleteDB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createStores", function() { return createStores; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transact", function() { return transact; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "count", function() { return count; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return get; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "del", function() { return del; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "put", function() { return put; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addAutoKey", function() { return addAutoKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAll", function() { return getAll; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAllKeys", function() { return getAllKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "queryFirst", function() { return queryFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLastKey", function() { return getLastKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFirstKey", function() { return getFirstKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAllKeysValues", function() { return getAllKeysValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iterate", function() { return iterate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iterateKeys", function() { return iterateKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStore", function() { return getStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createIDBKeyRangeBound", function() { return createIDBKeyRangeBound; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createIDBKeyRangeUpperBound", function() { return createIDBKeyRangeUpperBound; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createIDBKeyRangeLowerBound", function() { return createIDBKeyRangeLowerBound; });
/* harmony import */ var _promise_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./promise.js */ "./node_modules/lib0/promise.js");
/* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error.js */ "./node_modules/lib0/error.js");
/* eslint-env browser */

/**
 * Helpers to work with IndexedDB.
 *
 * @module idb
 */




/**
 * IDB Request to Promise transformer
 *
 * @param {IDBRequest} request
 * @return {Promise<any>}
 */
/* istanbul ignore next */
const rtop = request => _promise_js__WEBPACK_IMPORTED_MODULE_0__["create"]((resolve, reject) => {
  /* istanbul ignore next */
  // @ts-ignore
  request.onerror = event => reject(new Error(event.target.error))
  /* istanbul ignore next */
  // @ts-ignore
  request.onblocked = () => location.reload()
  // @ts-ignore
  request.onsuccess = event => resolve(event.target.result)
})

/**
 * @param {string} name
 * @param {function(IDBDatabase):any} initDB Called when the database is first created
 * @return {Promise<IDBDatabase>}
 */
/* istanbul ignore next */
const openDB = (name, initDB) => _promise_js__WEBPACK_IMPORTED_MODULE_0__["create"]((resolve, reject) => {
  const request = indexedDB.open(name)
  /**
   * @param {any} event
   */
  request.onupgradeneeded = event => initDB(event.target.result)
  /* istanbul ignore next */
  /**
   * @param {any} event
   */
  request.onerror = event => reject(_error_js__WEBPACK_IMPORTED_MODULE_1__["create"](event.target.error))
  /* istanbul ignore next */
  request.onblocked = () => location.reload()
  /**
   * @param {any} event
   */
  request.onsuccess = event => {
    /**
     * @type {IDBDatabase}
     */
    const db = event.target.result
    /* istanbul ignore next */
    db.onversionchange = () => { db.close() }
    /* istanbul ignore if */
    if (typeof addEventListener !== 'undefined') {
      addEventListener('unload', () => db.close())
    }
    resolve(db)
  }
})

/**
 * @param {string} name
 */
/* istanbul ignore next */
const deleteDB = name => rtop(indexedDB.deleteDatabase(name))

/**
 * @param {IDBDatabase} db
 * @param {Array<Array<string>|Array<string|IDBObjectStoreParameters|undefined>>} definitions
 */
/* istanbul ignore next */
const createStores = (db, definitions) => definitions.forEach(d =>
  // @ts-ignore
  db.createObjectStore.apply(db, d)
)

/**
 * @param {IDBDatabase} db
 * @param {Array<string>} stores
 * @param {"readwrite"|"readonly"} [access]
 * @return {Array<IDBObjectStore>}
 */
const transact = (db, stores, access = 'readwrite') => {
  const transaction = db.transaction(stores, access)
  return stores.map(store => getStore(transaction, store))
}

/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange} [range]
 * @return {Promise<number>}
 */
/* istanbul ignore next */
const count = (store, range) =>
  rtop(store.count(range))

/**
 * @param {IDBObjectStore} store
 * @param {String | number | ArrayBuffer | Date | Array<any> } key
 * @return {Promise<String | number | ArrayBuffer | Date | Array<any>>}
 */
/* istanbul ignore next */
const get = (store, key) =>
  rtop(store.get(key))

/**
 * @param {IDBObjectStore} store
 * @param {String | number | ArrayBuffer | Date | IDBKeyRange | Array<any> } key
 */
/* istanbul ignore next */
const del = (store, key) =>
  rtop(store.delete(key))

/**
 * @param {IDBObjectStore} store
 * @param {String | number | ArrayBuffer | Date | boolean} item
 * @param {String | number | ArrayBuffer | Date | Array<any>} [key]
 */
/* istanbul ignore next */
const put = (store, item, key) =>
  rtop(store.put(item, key))

/**
 * @param {IDBObjectStore} store
 * @param {String | number | ArrayBuffer | Date | boolean}  item
 * @param {String | number | ArrayBuffer | Date | Array<any>}  key
 * @return {Promise<any>}
 */
/* istanbul ignore next */
const add = (store, item, key) =>
  rtop(store.add(item, key))

/**
 * @param {IDBObjectStore} store
 * @param {String | number | ArrayBuffer | Date}  item
 * @return {Promise<number>} Returns the generated key
 */
/* istanbul ignore next */
const addAutoKey = (store, item) =>
  rtop(store.add(item))

/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange} [range]
 * @return {Promise<Array<any>>}
 */
/* istanbul ignore next */
const getAll = (store, range) =>
  rtop(store.getAll(range))

/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange} [range]
 * @return {Promise<Array<any>>}
 */
/* istanbul ignore next */
const getAllKeys = (store, range) =>
  rtop(store.getAllKeys(range))

/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange|null} query
 * @param {'next'|'prev'|'nextunique'|'prevunique'} direction
 * @return {Promise<any>}
 */
const queryFirst = (store, query, direction) => {
  /**
   * @type {any}
   */
  let first = null
  return iterateKeys(store, query, key => {
    first = key
    return false
  }, direction).then(() => first)
}

/**
 * @param {IDBObjectStore} store
 * @return {Promise<any>}
 */
const getLastKey = store => queryFirst(store, null, 'prev')

/**
 * @param {IDBObjectStore} store
 * @return {Promise<any>}
 */
const getFirstKey = store => queryFirst(store, null, 'prev')

/**
 * @typedef KeyValuePair
 * @type {Object}
 * @property {any} k key
 * @property {any} v Value
 */

/**
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange} [range]
 * @return {Promise<Array<KeyValuePair>>}
 */
/* istanbul ignore next */
const getAllKeysValues = (store, range) =>
  // @ts-ignore
  _promise_js__WEBPACK_IMPORTED_MODULE_0__["all"]([getAllKeys(store, range), getAll(store, range)]).then(([ks, vs]) => ks.map((k, i) => ({ k, v: vs[i] })))

/**
 * @param {any} request
 * @param {function(IDBCursorWithValue):void|boolean} f
 * @return {Promise<void>}
 */
/* istanbul ignore next */
const iterateOnRequest = (request, f) => _promise_js__WEBPACK_IMPORTED_MODULE_0__["create"]((resolve, reject) => {
  /* istanbul ignore next */
  request.onerror = reject
  /**
   * @param {any} event
   */
  request.onsuccess = event => {
    const cursor = event.target.result
    if (cursor === null || f(cursor) === false) {
      return resolve()
    }
    cursor.continue()
  }
})

/**
 * Iterate on keys and values
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange|null} keyrange
 * @param {function(any,any):void|boolean} f Callback that receives (value, key)
 * @param {'next'|'prev'|'nextunique'|'prevunique'} direction
 */
/* istanbul ignore next */
const iterate = (store, keyrange, f, direction = 'next') =>
  iterateOnRequest(store.openCursor(keyrange, direction), cursor => f(cursor.value, cursor.key))

/**
 * Iterate on the keys (no values)
 *
 * @param {IDBObjectStore} store
 * @param {IDBKeyRange|null} keyrange
 * @param {function(any):void|boolean} f callback that receives the key
 * @param {'next'|'prev'|'nextunique'|'prevunique'} direction
 */
/* istanbul ignore next */
const iterateKeys = (store, keyrange, f, direction = 'next') =>
  iterateOnRequest(store.openKeyCursor(keyrange, direction), cursor => f(cursor.key))

/**
 * Open store from transaction
 * @param {IDBTransaction} t
 * @param {String} store
 * @returns {IDBObjectStore}
 */
/* istanbul ignore next */
const getStore = (t, store) => t.objectStore(store)

/**
 * @param {any} lower
 * @param {any} upper
 * @param {boolean} lowerOpen
 * @param {boolean} upperOpen
 */
/* istanbul ignore next */
const createIDBKeyRangeBound = (lower, upper, lowerOpen, upperOpen) => IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen)

/**
 * @param {any} upper
 * @param {boolean} upperOpen
 */
/* istanbul ignore next */
const createIDBKeyRangeUpperBound = (upper, upperOpen) => IDBKeyRange.upperBound(upper, upperOpen)

/**
 * @param {any} lower
 * @param {boolean} lowerOpen
 */
/* istanbul ignore next */
const createIDBKeyRangeLowerBound = (lower, lowerOpen) => IDBKeyRange.lowerBound(lower, lowerOpen)


/***/ }),

/***/ "./node_modules/lib0/isomorphic.js":
/*!*****************************************!*\
  !*** ./node_modules/lib0/isomorphic.js ***!
  \*****************************************/
/*! exports provided: performance, cryptoRandomBuffer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "performance", function() { return performance; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cryptoRandomBuffer", function() { return cryptoRandomBuffer; });
/* harmony import */ var isomorphic_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! isomorphic.js */ "./node_modules/isomorphic.js/iso-browser.js");
/* harmony import */ var isomorphic_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(isomorphic_js__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Isomorphic library exports from isomorphic.js.
 *
 * @module isomorphic
 */

// @ts-ignore


const performance = /** @type {any} */ (isomorphic_js__WEBPACK_IMPORTED_MODULE_0___default.a.performance)
const cryptoRandomBuffer = /** @type {any} */ (isomorphic_js__WEBPACK_IMPORTED_MODULE_0___default.a.cryptoRandomBuffer)


/***/ }),

/***/ "./node_modules/lib0/iterator.js":
/*!***************************************!*\
  !*** ./node_modules/lib0/iterator.js ***!
  \***************************************/
/*! exports provided: mapIterator, createIterator, iteratorFilter, iteratorMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapIterator", function() { return mapIterator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createIterator", function() { return createIterator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iteratorFilter", function() { return iteratorFilter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iteratorMap", function() { return iteratorMap; });
/**
 * Utility module to create and manipulate Iterators.
 *
 * @module iterator
 */

/**
 * @template T,R
 * @param {Iterator<T>} iterator
 * @param {function(T):R} f
 * @return {IterableIterator<R>}
 */
const mapIterator = (iterator, f) => ({
  /**
   * @param {function(T):R} f
   */
  [Symbol.iterator] () {
    return this
  },
  // @ts-ignore
  next () {
    const r = iterator.next()
    return { value: r.done ? undefined : f(r.value), done: r.done }
  }
})

/**
 * @template T
 * @param {function():IteratorResult<T>} next
 * @return {IterableIterator<T>}
 */
const createIterator = next => ({
  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator] () {
    return this
  },
  // @ts-ignore
  next
})

/**
 * @template T
 * @param {Iterator<T>} iterator
 * @param {function(T):boolean} filter
 */
const iteratorFilter = (iterator, filter) => createIterator(() => {
  let res
  do {
    res = iterator.next()
  } while (!res.done && !filter(res.value))
  return res
})

/**
 * @template T,M
 * @param {Iterator<T>} iterator
 * @param {function(T):M} fmap
 */
const iteratorMap = (iterator, fmap) => createIterator(() => {
  const { done, value } = iterator.next()
  return { done, value: done ? undefined : fmap(value) }
})


/***/ }),

/***/ "./node_modules/lib0/json.js":
/*!***********************************!*\
  !*** ./node_modules/lib0/json.js ***!
  \***********************************/
/*! exports provided: stringify, parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stringify", function() { return stringify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return parse; });
/**
 * JSON utility functions.
 *
 * @module json
 */

/**
 * Transform JavaScript object to JSON.
 *
 * @param {any} object
 * @return {string}
 */
const stringify = JSON.stringify

/**
 * Parse JSON object.
 *
 * @param {string} json
 * @return {any}
 */
const parse = JSON.parse


/***/ }),

/***/ "./node_modules/lib0/logging.js":
/*!**************************************!*\
  !*** ./node_modules/lib0/logging.js ***!
  \**************************************/
/*! exports provided: BOLD, UNBOLD, BLUE, GREY, GREEN, RED, PURPLE, ORANGE, UNCOLOR, print, warn, printError, printImg, printImgBase64, group, groupCollapsed, groupEnd, printDom, printCanvas, vconsoles, VConsole, createVConsole, createModuleLogger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BOLD", function() { return BOLD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UNBOLD", function() { return UNBOLD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLUE", function() { return BLUE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GREY", function() { return GREY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GREEN", function() { return GREEN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RED", function() { return RED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PURPLE", function() { return PURPLE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ORANGE", function() { return ORANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UNCOLOR", function() { return UNCOLOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "print", function() { return print; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "warn", function() { return warn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printError", function() { return printError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printImg", function() { return printImg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printImgBase64", function() { return printImgBase64; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "group", function() { return group; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "groupCollapsed", function() { return groupCollapsed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "groupEnd", function() { return groupEnd; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printDom", function() { return printDom; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printCanvas", function() { return printCanvas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vconsoles", function() { return vconsoles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VConsole", function() { return VConsole; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createVConsole", function() { return createVConsole; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createModuleLogger", function() { return createModuleLogger; });
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./environment.js */ "./node_modules/lib0/environment.js");
/* harmony import */ var _symbol_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./symbol.js */ "./node_modules/lib0/symbol.js");
/* harmony import */ var _pair_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pair.js */ "./node_modules/lib0/pair.js");
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom.js */ "./node_modules/lib0/dom.js");
/* harmony import */ var _json_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./json.js */ "./node_modules/lib0/json.js");
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./map.js */ "./node_modules/lib0/map.js");
/* harmony import */ var _eventloop_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./eventloop.js */ "./node_modules/lib0/eventloop.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./math.js */ "./node_modules/lib0/math.js");
/* harmony import */ var _time_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./time.js */ "./node_modules/lib0/time.js");
/* harmony import */ var _function_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./function.js */ "./node_modules/lib0/function.js");
/**
 * Isomorphic logging module with support for colors!
 *
 * @module logging
 */












const BOLD = _symbol_js__WEBPACK_IMPORTED_MODULE_1__["create"]()
const UNBOLD = _symbol_js__WEBPACK_IMPORTED_MODULE_1__["create"]()
const BLUE = _symbol_js__WEBPACK_IMPORTED_MODULE_1__["create"]()
const GREY = _symbol_js__WEBPACK_IMPORTED_MODULE_1__["create"]()
const GREEN = _symbol_js__WEBPACK_IMPORTED_MODULE_1__["create"]()
const RED = _symbol_js__WEBPACK_IMPORTED_MODULE_1__["create"]()
const PURPLE = _symbol_js__WEBPACK_IMPORTED_MODULE_1__["create"]()
const ORANGE = _symbol_js__WEBPACK_IMPORTED_MODULE_1__["create"]()
const UNCOLOR = _symbol_js__WEBPACK_IMPORTED_MODULE_1__["create"]()

/**
 * @type {Object<Symbol,pair.Pair<string,string>>}
 */
const _browserStyleMap = {
  [BOLD]: _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('font-weight', 'bold'),
  [UNBOLD]: _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('font-weight', 'normal'),
  [BLUE]: _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('color', 'blue'),
  [GREEN]: _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('color', 'green'),
  [GREY]: _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('color', 'grey'),
  [RED]: _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('color', 'red'),
  [PURPLE]: _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('color', 'purple'),
  [ORANGE]: _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('color', 'orange'), // not well supported in chrome when debugging node with inspector - TODO: deprecate
  [UNCOLOR]: _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('color', 'black')
}

const _nodeStyleMap = {
  [BOLD]: '\u001b[1m',
  [UNBOLD]: '\u001b[2m',
  [BLUE]: '\x1b[34m',
  [GREEN]: '\x1b[32m',
  [GREY]: '\u001b[37m',
  [RED]: '\x1b[31m',
  [PURPLE]: '\x1b[35m',
  [ORANGE]: '\x1b[38;5;208m',
  [UNCOLOR]: '\x1b[0m'
}

/* istanbul ignore next */
/**
 * @param {Array<string|Symbol|Object|number>} args
 * @return {Array<string|object|number>}
 */
const computeBrowserLoggingArgs = args => {
  const strBuilder = []
  const styles = []
  const currentStyle = _map_js__WEBPACK_IMPORTED_MODULE_5__["create"]()
  /**
   * @type {Array<string|Object|number>}
   */
  let logArgs = []
  // try with formatting until we find something unsupported
  let i = 0

  for (; i < args.length; i++) {
    const arg = args[i]
    // @ts-ignore
    const style = _browserStyleMap[arg]
    if (style !== undefined) {
      currentStyle.set(style.left, style.right)
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        const style = _dom_js__WEBPACK_IMPORTED_MODULE_3__["mapToStyleString"](currentStyle)
        if (i > 0 || style.length > 0) {
          strBuilder.push('%c' + arg)
          styles.push(style)
        } else {
          strBuilder.push(arg)
        }
      } else {
        break
      }
    }
  }

  if (i > 0) {
    // create logArgs with what we have so far
    logArgs = styles
    logArgs.unshift(strBuilder.join(''))
  }
  // append the rest
  for (; i < args.length; i++) {
    const arg = args[i]
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg)
    }
  }
  return logArgs
}

/**
 * @param {Array<string|Symbol|Object|number>} args
 * @return {Array<string|object|number>}
 */
const computeNodeLoggingArgs = args => {
  const strBuilder = []
  const logArgs = []

  // try with formatting until we find something unsupported
  let i = 0

  for (; i < args.length; i++) {
    const arg = args[i]
    // @ts-ignore
    const style = _nodeStyleMap[arg]
    if (style !== undefined) {
      strBuilder.push(style)
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        strBuilder.push(arg)
      } else {
        break
      }
    }
  }
  if (i > 0) {
    // create logArgs with what we have so far
    strBuilder.push('\x1b[0m')
    logArgs.push(strBuilder.join(''))
  }
  // append the rest
  for (; i < args.length; i++) {
    const arg = args[i]
    /* istanbul ignore else */
    if (!(arg instanceof Symbol)) {
      logArgs.push(arg)
    }
  }
  return logArgs
}

/* istanbul ignore next */
const computeLoggingArgs = _environment_js__WEBPACK_IMPORTED_MODULE_0__["isNode"] ? computeNodeLoggingArgs : computeBrowserLoggingArgs

/**
 * @param {Array<string|Symbol|Object|number>} args
 */
const print = (...args) => {
  console.log(...computeLoggingArgs(args))
  /* istanbul ignore next */
  vconsoles.forEach(vc => vc.print(args))
}

/* istanbul ignore next */
/**
 * @param {Array<string|Symbol|Object|number>} args
 */
const warn = (...args) => {
  console.warn(...computeLoggingArgs(args))
  args.unshift(ORANGE)
  vconsoles.forEach(vc => vc.print(args))
}

/* istanbul ignore next */
/**
 * @param {Error} err
 */
const printError = err => {
  console.error(err)
  vconsoles.forEach(vc => vc.printError(err))
}

/* istanbul ignore next */
/**
 * @param {string} url image location
 * @param {number} height height of the image in pixel
 */
const printImg = (url, height) => {
  if (_environment_js__WEBPACK_IMPORTED_MODULE_0__["isBrowser"]) {
    console.log('%c                      ', `font-size: ${height}px; background-size: contain; background-repeat: no-repeat; background-image: url(${url})`)
    // console.log('%c                ', `font-size: ${height}x; background: url(${url}) no-repeat;`)
  }
  vconsoles.forEach(vc => vc.printImg(url, height))
}

/* istanbul ignore next */
/**
 * @param {string} base64
 * @param {number} height
 */
const printImgBase64 = (base64, height) => printImg(`data:image/gif;base64,${base64}`, height)

/**
 * @param {Array<string|Symbol|Object|number>} args
 */
const group = (...args) => {
  console.group(...computeLoggingArgs(args))
  /* istanbul ignore next */
  vconsoles.forEach(vc => vc.group(args))
}

/**
 * @param {Array<string|Symbol|Object|number>} args
 */
const groupCollapsed = (...args) => {
  console.groupCollapsed(...computeLoggingArgs(args))
  /* istanbul ignore next */
  vconsoles.forEach(vc => vc.groupCollapsed(args))
}

const groupEnd = () => {
  console.groupEnd()
  /* istanbul ignore next */
  vconsoles.forEach(vc => vc.groupEnd())
}

/* istanbul ignore next */
/**
 * @param {function():Node} createNode
 */
const printDom = createNode =>
  vconsoles.forEach(vc => vc.printDom(createNode()))

/* istanbul ignore next */
/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} height
 */
const printCanvas = (canvas, height) => printImg(canvas.toDataURL(), height)

const vconsoles = new Set()

/* istanbul ignore next */
/**
 * @param {Array<string|Symbol|Object|number>} args
 * @return {Array<Element>}
 */
const _computeLineSpans = args => {
  const spans = []
  const currentStyle = new Map()
  // try with formatting until we find something unsupported
  let i = 0
  for (; i < args.length; i++) {
    const arg = args[i]
    // @ts-ignore
    const style = _browserStyleMap[arg]
    if (style !== undefined) {
      currentStyle.set(style.left, style.right)
    } else {
      if (arg.constructor === String || arg.constructor === Number) {
        // @ts-ignore
        const span = _dom_js__WEBPACK_IMPORTED_MODULE_3__["element"]('span', [_pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('style', _dom_js__WEBPACK_IMPORTED_MODULE_3__["mapToStyleString"](currentStyle))], [_dom_js__WEBPACK_IMPORTED_MODULE_3__["text"](arg)])
        if (span.innerHTML === '') {
          span.innerHTML = '&nbsp;'
        }
        spans.push(span)
      } else {
        break
      }
    }
  }
  // append the rest
  for (; i < args.length; i++) {
    let content = args[i]
    if (!(content instanceof Symbol)) {
      if (content.constructor !== String && content.constructor !== Number) {
        content = ' ' + _json_js__WEBPACK_IMPORTED_MODULE_4__["stringify"](content) + ' '
      }
      spans.push(_dom_js__WEBPACK_IMPORTED_MODULE_3__["element"]('span', [], [_dom_js__WEBPACK_IMPORTED_MODULE_3__["text"](/** @type {string} */ (content))]))
    }
  }
  return spans
}

const lineStyle = 'font-family:monospace;border-bottom:1px solid #e2e2e2;padding:2px;'

/* istanbul ignore next */
class VConsole {
  /**
   * @param {Element} dom
   */
  constructor (dom) {
    this.dom = dom
    /**
     * @type {Element}
     */
    this.ccontainer = this.dom
    this.depth = 0
    vconsoles.add(this)
  }

  /**
   * @param {Array<string|Symbol|Object|number>} args
   * @param {boolean} collapsed
   */
  group (args, collapsed = false) {
    _eventloop_js__WEBPACK_IMPORTED_MODULE_6__["enqueue"](() => {
      const triangleDown = _dom_js__WEBPACK_IMPORTED_MODULE_3__["element"]('span', [_pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('hidden', collapsed), _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('style', 'color:grey;font-size:120%;')], [_dom_js__WEBPACK_IMPORTED_MODULE_3__["text"]('▼')])
      const triangleRight = _dom_js__WEBPACK_IMPORTED_MODULE_3__["element"]('span', [_pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('hidden', !collapsed), _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('style', 'color:grey;font-size:125%;')], [_dom_js__WEBPACK_IMPORTED_MODULE_3__["text"]('▶')])
      const content = _dom_js__WEBPACK_IMPORTED_MODULE_3__["element"]('div', [_pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('style', `${lineStyle};padding-left:${this.depth * 10}px`)], [triangleDown, triangleRight, _dom_js__WEBPACK_IMPORTED_MODULE_3__["text"](' ')].concat(_computeLineSpans(args)))
      const nextContainer = _dom_js__WEBPACK_IMPORTED_MODULE_3__["element"]('div', [_pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('hidden', collapsed)])
      const nextLine = _dom_js__WEBPACK_IMPORTED_MODULE_3__["element"]('div', [], [content, nextContainer])
      _dom_js__WEBPACK_IMPORTED_MODULE_3__["append"](this.ccontainer, [nextLine])
      this.ccontainer = nextContainer
      this.depth++
      // when header is clicked, collapse/uncollapse container
      _dom_js__WEBPACK_IMPORTED_MODULE_3__["addEventListener"](content, 'click', event => {
        nextContainer.toggleAttribute('hidden')
        triangleDown.toggleAttribute('hidden')
        triangleRight.toggleAttribute('hidden')
      })
    })
  }

  /**
   * @param {Array<string|Symbol|Object|number>} args
   */
  groupCollapsed (args) {
    this.group(args, true)
  }

  groupEnd () {
    _eventloop_js__WEBPACK_IMPORTED_MODULE_6__["enqueue"](() => {
      if (this.depth > 0) {
        this.depth--
        // @ts-ignore
        this.ccontainer = this.ccontainer.parentElement.parentElement
      }
    })
  }

  /**
   * @param {Array<string|Symbol|Object|number>} args
   */
  print (args) {
    _eventloop_js__WEBPACK_IMPORTED_MODULE_6__["enqueue"](() => {
      _dom_js__WEBPACK_IMPORTED_MODULE_3__["append"](this.ccontainer, [_dom_js__WEBPACK_IMPORTED_MODULE_3__["element"]('div', [_pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('style', `${lineStyle};padding-left:${this.depth * 10}px`)], _computeLineSpans(args))])
    })
  }

  /**
   * @param {Error} err
   */
  printError (err) {
    this.print([RED, BOLD, err.toString()])
  }

  /**
   * @param {string} url
   * @param {number} height
   */
  printImg (url, height) {
    _eventloop_js__WEBPACK_IMPORTED_MODULE_6__["enqueue"](() => {
      _dom_js__WEBPACK_IMPORTED_MODULE_3__["append"](this.ccontainer, [_dom_js__WEBPACK_IMPORTED_MODULE_3__["element"]('img', [_pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('src', url), _pair_js__WEBPACK_IMPORTED_MODULE_2__["create"]('height', `${_math_js__WEBPACK_IMPORTED_MODULE_7__["round"](height * 1.5)}px`)])])
    })
  }

  /**
   * @param {Node} node
   */
  printDom (node) {
    _eventloop_js__WEBPACK_IMPORTED_MODULE_6__["enqueue"](() => {
      _dom_js__WEBPACK_IMPORTED_MODULE_3__["append"](this.ccontainer, [node])
    })
  }

  destroy () {
    _eventloop_js__WEBPACK_IMPORTED_MODULE_6__["enqueue"](() => {
      vconsoles.delete(this)
    })
  }
}

/* istanbul ignore next */
/**
 * @param {Element} dom
 */
const createVConsole = dom => new VConsole(dom)

const loggingColors = [GREEN, PURPLE, ORANGE, BLUE]
let nextColor = 0
let lastLoggingTime = _time_js__WEBPACK_IMPORTED_MODULE_8__["getUnixTime"]()

/**
 * @param {string} moduleName
 * @return {function(...any)}
 */
const createModuleLogger = moduleName => {
  const color = loggingColors[nextColor]
  const debugRegexVar = _environment_js__WEBPACK_IMPORTED_MODULE_0__["getVariable"]('log')
  const doLogging = debugRegexVar !== null && (debugRegexVar === '*' || debugRegexVar === 'true' || new RegExp(debugRegexVar, 'gi').test(moduleName))
  nextColor = (nextColor + 1) % loggingColors.length
  moduleName += ': '

  return !doLogging ? _function_js__WEBPACK_IMPORTED_MODULE_9__["nop"] : (...args) => {
    const timeNow = _time_js__WEBPACK_IMPORTED_MODULE_8__["getUnixTime"]()
    const timeDiff = timeNow - lastLoggingTime
    lastLoggingTime = timeNow
    print(color, moduleName, UNCOLOR, ...args.map(arg => (typeof arg === 'string' || typeof arg === 'symbol') ? arg : JSON.stringify(arg)), color, ' +' + timeDiff + 'ms')
  }
}


/***/ }),

/***/ "./node_modules/lib0/map.js":
/*!**********************************!*\
  !*** ./node_modules/lib0/map.js ***!
  \**********************************/
/*! exports provided: create, copy, setIfUndefined, map, any, all */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "copy", function() { return copy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setIfUndefined", function() { return setIfUndefined; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "any", function() { return any; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "all", function() { return all; });
/**
 * Utility module to work with key-value stores.
 *
 * @module map
 */

/**
 * Creates a new Map instance.
 *
 * @function
 * @return {Map<any, any>}
 *
 * @function
 */
const create = () => new Map()

/**
 * Copy a Map object into a fresh Map object.
 *
 * @function
 * @template X,Y
 * @param {Map<X,Y>} m
 * @return {Map<X,Y>}
 */
const copy = m => {
  const r = create()
  m.forEach((v, k) => { r.set(k, v) })
  return r
}

/**
 * Get map property. Create T if property is undefined and set T on map.
 *
 * ```js
 * const listeners = map.setIfUndefined(events, 'eventName', set.create)
 * listeners.add(listener)
 * ```
 *
 * @function
 * @template T,K
 * @param {Map<K, T>} map
 * @param {K} key
 * @param {function():T} createT
 * @return {T}
 */
const setIfUndefined = (map, key, createT) => {
  let set = map.get(key)
  if (set === undefined) {
    map.set(key, set = createT())
  }
  return set
}

/**
 * Creates an Array and populates it with the content of all key-value pairs using the `f(value, key)` function.
 *
 * @function
 * @template K
 * @template V
 * @template R
 * @param {Map<K,V>} m
 * @param {function(V,K):R} f
 * @return {Array<R>}
 */
const map = (m, f) => {
  const res = []
  for (const [key, value] of m) {
    res.push(f(value, key))
  }
  return res
}

/**
 * Tests whether any key-value pairs pass the test implemented by `f(value, key)`.
 *
 * @todo should rename to some - similarly to Array.some
 *
 * @function
 * @template K
 * @template V
 * @param {Map<K,V>} m
 * @param {function(V,K):boolean} f
 * @return {boolean}
 */
const any = (m, f) => {
  for (const [key, value] of m) {
    if (f(value, key)) {
      return true
    }
  }
  return false
}

/**
 * Tests whether all key-value pairs pass the test implemented by `f(value, key)`.
 *
 * @function
 * @template K
 * @template V
 * @param {Map<K,V>} m
 * @param {function(V,K):boolean} f
 * @return {boolean}
 */
const all = (m, f) => {
  for (const [key, value] of m) {
    if (!f(value, key)) {
      return false
    }
  }
  return true
}


/***/ }),

/***/ "./node_modules/lib0/math.js":
/*!***********************************!*\
  !*** ./node_modules/lib0/math.js ***!
  \***********************************/
/*! exports provided: floor, ceil, abs, imul, round, log10, log2, log, sqrt, add, min, max, isNaN, pow, exp10, sign, isNegativeZero */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "floor", function() { return floor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ceil", function() { return ceil; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "abs", function() { return abs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "imul", function() { return imul; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "round", function() { return round; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "log10", function() { return log10; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "log2", function() { return log2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "log", function() { return log; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sqrt", function() { return sqrt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "min", function() { return min; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "max", function() { return max; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNaN", function() { return isNaN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pow", function() { return pow; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exp10", function() { return exp10; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sign", function() { return sign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNegativeZero", function() { return isNegativeZero; });
/**
 * Common Math expressions.
 *
 * @module math
 */

const floor = Math.floor
const ceil = Math.ceil
const abs = Math.abs
const imul = Math.imul
const round = Math.round
const log10 = Math.log10
const log2 = Math.log2
const log = Math.log
const sqrt = Math.sqrt

/**
 * @function
 * @param {number} a
 * @param {number} b
 * @return {number} The sum of a and b
 */
const add = (a, b) => a + b

/**
 * @function
 * @param {number} a
 * @param {number} b
 * @return {number} The smaller element of a and b
 */
const min = (a, b) => a < b ? a : b

/**
 * @function
 * @param {number} a
 * @param {number} b
 * @return {number} The bigger element of a and b
 */
const max = (a, b) => a > b ? a : b

const isNaN = Number.isNaN

const pow = Math.pow
/**
 * Base 10 exponential function. Returns the value of 10 raised to the power of pow.
 *
 * @param {number} exp
 * @return {number}
 */
const exp10 = exp => Math.pow(10, exp)

const sign = Math.sign

/**
 * @param {number} n
 * @return {boolean} Wether n is negative. This function also differentiates between -0 and +0
 */
const isNegativeZero = n => n !== 0 ? n < 0 : 1 / n < 0


/***/ }),

/***/ "./node_modules/lib0/metric.js":
/*!*************************************!*\
  !*** ./node_modules/lib0/metric.js ***!
  \*************************************/
/*! exports provided: yotta, zetta, exa, peta, tera, giga, mega, kilo, hecto, deca, deci, centi, milli, micro, nano, pico, femto, atto, zepto, yocto, prefix */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "yotta", function() { return yotta; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zetta", function() { return zetta; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exa", function() { return exa; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "peta", function() { return peta; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tera", function() { return tera; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "giga", function() { return giga; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mega", function() { return mega; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kilo", function() { return kilo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hecto", function() { return hecto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deca", function() { return deca; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deci", function() { return deci; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "centi", function() { return centi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "milli", function() { return milli; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "micro", function() { return micro; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nano", function() { return nano; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pico", function() { return pico; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "femto", function() { return femto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "atto", function() { return atto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zepto", function() { return zepto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "yocto", function() { return yocto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prefix", function() { return prefix; });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/lib0/math.js");
/**
 * Utility module to convert metric values.
 *
 * @module metric
 */



const yotta = 1e24
const zetta = 1e21
const exa = 1e18
const peta = 1e15
const tera = 1e12
const giga = 1e9
const mega = 1e6
const kilo = 1e3
const hecto = 1e2
const deca = 10
const deci = 0.1
const centi = 0.01
const milli = 1e-3
const micro = 1e-6
const nano = 1e-9
const pico = 1e-12
const femto = 1e-15
const atto = 1e-18
const zepto = 1e-21
const yocto = 1e-24

const prefixUp = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
const prefixDown = ['', 'm', 'μ', 'n', 'p', 'f', 'a', 'z', 'y']

/**
 * Calculate the metric prefix for a number. Assumes E.g. `prefix(1000) = { n: 1, prefix: 'k' }`
 *
 * @param {number} n
 * @param {number} [baseMultiplier] Multiplier of the base (10^(3*baseMultiplier)). E.g. `convert(time, -3)` if time is already in milli seconds
 * @return {{n:number,prefix:string}}
 */
const prefix = (n, baseMultiplier = 0) => {
  const nPow = n === 0 ? 0 : _math_js__WEBPACK_IMPORTED_MODULE_0__["log10"](n)
  let mult = 0
  while (nPow < mult * 3 && baseMultiplier > -8) {
    baseMultiplier--
    mult--
  }
  while (nPow >= 3 + mult * 3 && baseMultiplier < 8) {
    baseMultiplier++
    mult++
  }
  const prefix = baseMultiplier < 0 ? prefixDown[-baseMultiplier] : prefixUp[baseMultiplier]
  return {
    n: _math_js__WEBPACK_IMPORTED_MODULE_0__["round"]((mult > 0 ? n / _math_js__WEBPACK_IMPORTED_MODULE_0__["exp10"](mult * 3) : n * _math_js__WEBPACK_IMPORTED_MODULE_0__["exp10"](mult * -3)) * 1e12) / 1e12,
    prefix
  }
}


/***/ }),

/***/ "./node_modules/lib0/mutex.js":
/*!************************************!*\
  !*** ./node_modules/lib0/mutex.js ***!
  \************************************/
/*! exports provided: createMutex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createMutex", function() { return createMutex; });
/**
 * Mutual exclude for JavaScript.
 *
 * @module mutex
 */

/**
 * @callback mutex
 * @param {function():void} cb Only executed when this mutex is not in the current stack
 * @param {function():void} [elseCb] Executed when this mutex is in the current stack
 */

/**
 * Creates a mutual exclude function with the following property:
 *
 * ```js
 * const mutex = createMutex()
 * mutex(() => {
 *   // This function is immediately executed
 *   mutex(() => {
 *     // This function is not executed, as the mutex is already active.
 *   })
 * })
 * ```
 *
 * @return {mutex} A mutual exclude function
 * @public
 */
const createMutex = () => {
  let token = true
  return (f, g) => {
    if (token) {
      token = false
      try {
        f()
      } finally {
        token = true
      }
    } else if (g !== undefined) {
      g()
    }
  }
}


/***/ }),

/***/ "./node_modules/lib0/number.js":
/*!*************************************!*\
  !*** ./node_modules/lib0/number.js ***!
  \*************************************/
/*! exports provided: MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, LOWEST_INT32, HIGHEST_INT32, isInteger, isNaN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MAX_SAFE_INTEGER", function() { return MAX_SAFE_INTEGER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MIN_SAFE_INTEGER", function() { return MIN_SAFE_INTEGER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOWEST_INT32", function() { return LOWEST_INT32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HIGHEST_INT32", function() { return HIGHEST_INT32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isInteger", function() { return isInteger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNaN", function() { return isNaN; });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/lib0/math.js");
/* harmony import */ var _binary_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./binary.js */ "./node_modules/lib0/binary.js");
/**
 * Utility helpers for working with numbers.
 *
 * @module number
 */




const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER
const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER

const LOWEST_INT32 = 1 << 31
/**
 * @type {number}
 */
const HIGHEST_INT32 = _binary_js__WEBPACK_IMPORTED_MODULE_1__["BITS31"]

/**
 * @module number
 */

/* istanbul ignore next */
const isInteger = Number.isInteger || (num => typeof num === 'number' && isFinite(num) && _math_js__WEBPACK_IMPORTED_MODULE_0__["floor"](num) === num)
const isNaN = Number.isNaN


/***/ }),

/***/ "./node_modules/lib0/object.js":
/*!*************************************!*\
  !*** ./node_modules/lib0/object.js ***!
  \*************************************/
/*! exports provided: create, assign, keys, forEach, map, length, some, every, hasProperty, equalFlat */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keys", function() { return keys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forEach", function() { return forEach; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "length", function() { return length; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "some", function() { return some; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "every", function() { return every; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hasProperty", function() { return hasProperty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "equalFlat", function() { return equalFlat; });
/**
 * Utility functions for working with EcmaScript objects.
 *
 * @module object
 */

/**
 * @return {Object<string,any>} obj
 */
const create = () => Object.create(null)

/**
 * Object.assign
 */
const assign = Object.assign

/**
 * @param {Object<string,any>} obj
 */
const keys = Object.keys

/**
 * @param {Object<string,any>} obj
 * @param {function(any,string):any} f
 */
const forEach = (obj, f) => {
  for (const key in obj) {
    f(obj[key], key)
  }
}

/**
 * @template R
 * @param {Object<string,any>} obj
 * @param {function(any,string):R} f
 * @return {Array<R>}
 */
const map = (obj, f) => {
  const results = []
  for (const key in obj) {
    results.push(f(obj[key], key))
  }
  return results
}

/**
 * @param {Object<string,any>} obj
 * @return {number}
 */
const length = obj => keys(obj).length

/**
 * @param {Object<string,any>} obj
 * @param {function(any,string):boolean} f
 * @return {boolean}
 */
const some = (obj, f) => {
  for (const key in obj) {
    if (f(obj[key], key)) {
      return true
    }
  }
  return false
}

/**
 * @param {Object<string,any>} obj
 * @param {function(any,string):boolean} f
 * @return {boolean}
 */
const every = (obj, f) => {
  for (const key in obj) {
    if (!f(obj[key], key)) {
      return false
    }
  }
  return true
}

/**
 * Calls `Object.prototype.hasOwnProperty`.
 *
 * @param {any} obj
 * @param {string|symbol} key
 * @return {boolean}
 */
const hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

/**
 * @param {Object<string,any>} a
 * @param {Object<string,any>} b
 * @return {boolean}
 */
const equalFlat = (a, b) => a === b || (length(a) === length(b) && every(a, (val, key) => (val !== undefined || hasProperty(b, key)) && b[key] === val))


/***/ }),

/***/ "./node_modules/lib0/observable.js":
/*!*****************************************!*\
  !*** ./node_modules/lib0/observable.js ***!
  \*****************************************/
/*! exports provided: Observable */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Observable", function() { return Observable; });
/* harmony import */ var _map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map.js */ "./node_modules/lib0/map.js");
/* harmony import */ var _set_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./set.js */ "./node_modules/lib0/set.js");
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./array.js */ "./node_modules/lib0/array.js");
/**
 * Observable class prototype.
 *
 * @module observable
 */





/**
 * Handles named events.
 *
 * @template N
 */
class Observable {
  constructor () {
    /**
     * Some desc.
     * @type {Map<N, any>}
     */
    this._observers = _map_js__WEBPACK_IMPORTED_MODULE_0__["create"]()
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  on (name, f) {
    _map_js__WEBPACK_IMPORTED_MODULE_0__["setIfUndefined"](this._observers, name, _set_js__WEBPACK_IMPORTED_MODULE_1__["create"]).add(f)
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  once (name, f) {
    /**
     * @param  {...any} args
     */
    const _f = (...args) => {
      this.off(name, _f)
      f(...args)
    }
    this.on(name, _f)
  }

  /**
   * @param {N} name
   * @param {function} f
   */
  off (name, f) {
    const observers = this._observers.get(name)
    if (observers !== undefined) {
      observers.delete(f)
      if (observers.size === 0) {
        this._observers.delete(name)
      }
    }
  }

  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit (name, args) {
    // copy all listeners to an array first to make sure that no event is emitted to listeners that are subscribed while the event handler is called.
    return _array_js__WEBPACK_IMPORTED_MODULE_2__["from"]((this._observers.get(name) || _map_js__WEBPACK_IMPORTED_MODULE_0__["create"]()).values()).forEach(f => f(...args))
  }

  destroy () {
    this._observers = _map_js__WEBPACK_IMPORTED_MODULE_0__["create"]()
  }
}


/***/ }),

/***/ "./node_modules/lib0/pair.js":
/*!***********************************!*\
  !*** ./node_modules/lib0/pair.js ***!
  \***********************************/
/*! exports provided: Pair, create, createReversed, forEach, map */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pair", function() { return Pair; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createReversed", function() { return createReversed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forEach", function() { return forEach; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return map; });
/**
 * Working with value pairs.
 *
 * @module pair
 */

/**
 * @template L,R
 */
class Pair {
  /**
   * @param {L} left
   * @param {R} right
   */
  constructor (left, right) {
    this.left = left
    this.right = right
  }
}

/**
 * @template L,R
 * @param {L} left
 * @param {R} right
 * @return {Pair<L,R>}
 */
const create = (left, right) => new Pair(left, right)

/**
 * @template L,R
 * @param {R} right
 * @param {L} left
 * @return {Pair<L,R>}
 */
const createReversed = (right, left) => new Pair(left, right)

/**
 * @template L,R
 * @param {Array<Pair<L,R>>} arr
 * @param {function(L, R):any} f
 */
const forEach = (arr, f) => arr.forEach(p => f(p.left, p.right))

/**
 * @template L,R,X
 * @param {Array<Pair<L,R>>} arr
 * @param {function(L, R):X} f
 * @return {Array<X>}
 */
const map = (arr, f) => arr.map(p => f(p.left, p.right))


/***/ }),

/***/ "./node_modules/lib0/promise.js":
/*!**************************************!*\
  !*** ./node_modules/lib0/promise.js ***!
  \**************************************/
/*! exports provided: create, createEmpty, all, reject, resolve, until, wait, isPromise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEmpty", function() { return createEmpty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "all", function() { return all; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reject", function() { return reject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolve", function() { return resolve; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "until", function() { return until; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wait", function() { return wait; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPromise", function() { return isPromise; });
/* harmony import */ var _time_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./time.js */ "./node_modules/lib0/time.js");
/**
 * Utility helpers to work with promises.
 *
 * @module promise
 */



/**
 * @template T
 * @callback PromiseResolve
 * @param {T|PromiseLike<T>} [result]
 */

/**
 * @template T
 * @param {function(PromiseResolve<T>,function(Error):void):any} f
 * @return {Promise<T>}
 */
const create = f => new Promise(f)

/**
 * @param {function(function():void,function(Error):void):void} f
 * @return {Promise<void>}
 */
const createEmpty = f => new Promise(f)

/**
 * `Promise.all` wait for all promises in the array to resolve and return the result
 * @template T
 * @param {Array<Promise<T>>} arrp
 * @return {Promise<Array<T>>}
 */
const all = arrp => Promise.all(arrp)

/**
 * @param {Error} [reason]
 * @return {Promise<never>}
 */
const reject = reason => Promise.reject(reason)

/**
 * @template T
 * @param {T|void} res
 * @return {Promise<T|void>}
 */
const resolve = res => Promise.resolve(res)

/**
 * @todo Next version, reorder parameters: check, [timeout, [intervalResolution]]
 *
 * @param {number} timeout
 * @param {function():boolean} check
 * @param {number} [intervalResolution]
 * @return {Promise<void>}
 */
const until = (timeout, check, intervalResolution = 10) => create((resolve, reject) => {
  const startTime = _time_js__WEBPACK_IMPORTED_MODULE_0__["getUnixTime"]()
  const hasTimeout = timeout > 0
  const untilInterval = () => {
    if (check()) {
      clearInterval(intervalHandle)
      resolve()
    } else if (hasTimeout) {
      /* istanbul ignore else */
      if (_time_js__WEBPACK_IMPORTED_MODULE_0__["getUnixTime"]() - startTime > timeout) {
        clearInterval(intervalHandle)
        reject(new Error('Timeout'))
      }
    }
  }
  const intervalHandle = setInterval(untilInterval, intervalResolution)
})

/**
 * @param {number} timeout
 * @return {Promise<undefined>}
 */
const wait = timeout => create((resolve, reject) => setTimeout(resolve, timeout))

/**
 * Checks if an object is a promise using ducktyping.
 *
 * Promises are often polyfilled, so it makes sense to add some additional guarantees if the user of this
 * library has some insane environment where global Promise objects are overwritten.
 *
 * @param {any} p
 * @return {boolean}
 */
const isPromise = p => p instanceof Promise || (p && p.then && p.catch && p.finally)


/***/ }),

/***/ "./node_modules/lib0/random.js":
/*!*************************************!*\
  !*** ./node_modules/lib0/random.js ***!
  \*************************************/
/*! exports provided: rand, uint32, oneOf, uuidv4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rand", function() { return rand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uint32", function() { return uint32; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "oneOf", function() { return oneOf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uuidv4", function() { return uuidv4; });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/lib0/math.js");
/* harmony import */ var _isomorphic_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isomorphic.js */ "./node_modules/lib0/isomorphic.js");

/**
 * Isomorphic module for true random numbers / buffers / uuids.
 *
 * Attention: falls back to Math.random if the browser does not support crypto.
 *
 * @module random
 */




const rand = Math.random

/* istanbul ignore next */
const uint32 = () => new Uint32Array(Object(_isomorphic_js__WEBPACK_IMPORTED_MODULE_1__["cryptoRandomBuffer"])(4))[0]

/**
 * @template T
 * @param {Array<T>} arr
 * @return {T}
 */
const oneOf = arr => arr[_math_js__WEBPACK_IMPORTED_MODULE_0__["floor"](rand() * arr.length)]

// @ts-ignore
const uuidv4Template = [1e7] + -1e3 + -4e3 + -8e3 + -1e11
const uuidv4 = () => uuidv4Template.replace(/[018]/g, /** @param {number} c */ c =>
  (c ^ uint32() & 15 >> c / 4).toString(16)
)


/***/ }),

/***/ "./node_modules/lib0/set.js":
/*!**********************************!*\
  !*** ./node_modules/lib0/set.js ***!
  \**********************************/
/*! exports provided: create, toArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toArray", function() { return toArray; });
/**
 * Utility module to work with sets.
 *
 * @module set
 */

const create = () => new Set()

/**
 * @template T
 * @param {Set<T>} set
 * @return {Array<T>}
 */
const toArray = set => Array.from(set)


/***/ }),

/***/ "./node_modules/lib0/storage.js":
/*!**************************************!*\
  !*** ./node_modules/lib0/storage.js ***!
  \**************************************/
/*! exports provided: varStorage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "varStorage", function() { return varStorage; });
/* global localStorage */

/**
 * Isomorphic variable storage.
 *
 * Uses LocalStorage in the browser and falls back to in-memory storage.
 *
 * @module storage
 */

/* istanbul ignore next */
class VarStoragePolyfill {
  constructor () {
    this.map = new Map()
  }

  /**
   * @param {string} key
   * @param {any} value
   */
  setItem (key, value) {
    this.map.set(key, value)
  }

  /**
   * @param {string} key
   */
  getItem (key) {
    return this.map.get(key)
  }
}

/* istanbul ignore next */
/**
 * @type {any}
 */
let _localStorage = new VarStoragePolyfill()

try {
  // if the same-origin rule is violated, accessing localStorage might thrown an error
  /* istanbul ignore next */
  if (typeof localStorage !== 'undefined') {
    _localStorage = localStorage
  }
} catch (e) { }

/* istanbul ignore next */
/**
 * This is basically localStorage in browser, or a polyfill in nodejs
 */
const varStorage = _localStorage


/***/ }),

/***/ "./node_modules/lib0/string.js":
/*!*************************************!*\
  !*** ./node_modules/lib0/string.js ***!
  \*************************************/
/*! exports provided: fromCharCode, fromCodePoint, trimLeft, fromCamelCase, utf8ByteLength, _encodeUtf8Polyfill, utf8TextEncoder, _encodeUtf8Native, encodeUtf8, _decodeUtf8Polyfill, utf8TextDecoder, _decodeUtf8Native, decodeUtf8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromCharCode", function() { return fromCharCode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromCodePoint", function() { return fromCodePoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trimLeft", function() { return trimLeft; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromCamelCase", function() { return fromCamelCase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "utf8ByteLength", function() { return utf8ByteLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_encodeUtf8Polyfill", function() { return _encodeUtf8Polyfill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "utf8TextEncoder", function() { return utf8TextEncoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_encodeUtf8Native", function() { return _encodeUtf8Native; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeUtf8", function() { return encodeUtf8; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_decodeUtf8Polyfill", function() { return _decodeUtf8Polyfill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "utf8TextDecoder", function() { return utf8TextDecoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_decodeUtf8Native", function() { return _decodeUtf8Native; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeUtf8", function() { return decodeUtf8; });
/**
 * Utility module to work with strings.
 *
 * @module string
 */

const fromCharCode = String.fromCharCode
const fromCodePoint = String.fromCodePoint

/**
 * @param {string} s
 * @return {string}
 */
const toLowerCase = s => s.toLowerCase()

const trimLeftRegex = /^\s*/g

/**
 * @param {string} s
 * @return {string}
 */
const trimLeft = s => s.replace(trimLeftRegex, '')

const fromCamelCaseRegex = /([A-Z])/g

/**
 * @param {string} s
 * @param {string} separator
 * @return {string}
 */
const fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, match => `${separator}${toLowerCase(match)}`))

/**
 * Compute the utf8ByteLength
 * @param {string} str
 * @return {number}
 */
const utf8ByteLength = str => unescape(encodeURIComponent(str)).length

/**
 * @param {string} str
 * @return {Uint8Array}
 */
const _encodeUtf8Polyfill = str => {
  const encodedString = unescape(encodeURIComponent(str))
  const len = encodedString.length
  const buf = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    buf[i] = /** @type {number} */ (encodedString.codePointAt(i))
  }
  return buf
}

/* istanbul ignore next */
const utf8TextEncoder = /** @type {TextEncoder} */ (typeof TextEncoder !== 'undefined' ? new TextEncoder() : null)

/**
 * @param {string} str
 * @return {Uint8Array}
 */
const _encodeUtf8Native = str => utf8TextEncoder.encode(str)

/**
 * @param {string} str
 * @return {Uint8Array}
 */
/* istanbul ignore next */
const encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill

/**
 * @param {Uint8Array} buf
 * @return {string}
 */
const _decodeUtf8Polyfill = buf => {
  let remainingLen = buf.length
  let encodedString = ''
  let bufPos = 0
  while (remainingLen > 0) {
    const nextLen = remainingLen < 10000 ? remainingLen : 10000
    const bytes = buf.subarray(bufPos, bufPos + nextLen)
    bufPos += nextLen
    // Starting with ES5.1 we can supply a generic array-like object as arguments
    encodedString += String.fromCodePoint.apply(null, /** @type {any} */ (bytes))
    remainingLen -= nextLen
  }
  return decodeURIComponent(escape(encodedString))
}

/* istanbul ignore next */
let utf8TextDecoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf-8', { fatal: true, ignoreBOM: true })

/* istanbul ignore next */
if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
  // Safari doesn't handle BOM correctly.
  // This fixes a bug in Safari 13.0.5 where it produces a BOM the first time it is called.
  // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the first call and
  // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the second call
  // Another issue is that from then on no BOM chars are recognized anymore
  /* istanbul ignore next */
  utf8TextDecoder = null
}

/**
 * @param {Uint8Array} buf
 * @return {string}
 */
const _decodeUtf8Native = buf => /** @type {TextDecoder} */ (utf8TextDecoder).decode(buf)

/**
 * @param {Uint8Array} buf
 * @return {string}
 */
/* istanbul ignore next */
const decodeUtf8 = utf8TextDecoder ? _decodeUtf8Native : _decodeUtf8Polyfill


/***/ }),

/***/ "./node_modules/lib0/symbol.js":
/*!*************************************!*\
  !*** ./node_modules/lib0/symbol.js ***!
  \*************************************/
/*! exports provided: create, isSymbol */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSymbol", function() { return isSymbol; });
/**
 * Utility module to work with EcmaScript Symbols.
 *
 * @module symbol
 */

/**
 * Return fresh symbol.
 *
 * @return {Symbol}
 */
const create = Symbol

/**
 * @param {any} s
 * @return {boolean}
 */
const isSymbol = s => typeof s === 'symbol'


/***/ }),

/***/ "./node_modules/lib0/time.js":
/*!***********************************!*\
  !*** ./node_modules/lib0/time.js ***!
  \***********************************/
/*! exports provided: getDate, getUnixTime, humanizeDuration */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDate", function() { return getDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUnixTime", function() { return getUnixTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "humanizeDuration", function() { return humanizeDuration; });
/* harmony import */ var _metric_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./metric.js */ "./node_modules/lib0/metric.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./math.js */ "./node_modules/lib0/math.js");
/**
 * Utility module to work with time.
 *
 * @module time
 */




/**
 * Return current time.
 *
 * @return {Date}
 */
const getDate = () => new Date()

/**
 * Return current unix time.
 *
 * @return {number}
 */
const getUnixTime = Date.now

/**
 * Transform time (in ms) to a human readable format. E.g. 1100 => 1.1s. 60s => 1min. .001 => 10μs.
 *
 * @param {number} d duration in milliseconds
 * @return {string} humanized approximation of time
 */
const humanizeDuration = d => {
  if (d < 60000) {
    const p = _metric_js__WEBPACK_IMPORTED_MODULE_0__["prefix"](d, -1)
    return _math_js__WEBPACK_IMPORTED_MODULE_1__["round"](p.n * 100) / 100 + p.prefix + 's'
  }
  d = _math_js__WEBPACK_IMPORTED_MODULE_1__["floor"](d / 1000)
  const seconds = d % 60
  const minutes = _math_js__WEBPACK_IMPORTED_MODULE_1__["floor"](d / 60) % 60
  const hours = _math_js__WEBPACK_IMPORTED_MODULE_1__["floor"](d / 3600) % 24
  const days = _math_js__WEBPACK_IMPORTED_MODULE_1__["floor"](d / 86400)
  if (days > 0) {
    return days + 'd' + ((hours > 0 || minutes > 30) ? ' ' + (minutes > 30 ? hours + 1 : hours) + 'h' : '')
  }
  if (hours > 0) {
    /* istanbul ignore next */
    return hours + 'h' + ((minutes > 0 || seconds > 30) ? ' ' + (seconds > 30 ? minutes + 1 : minutes) + 'min' : '')
  }
  return minutes + 'min' + (seconds > 0 ? ' ' + seconds + 's' : '')
}


/***/ }),

/***/ "./node_modules/lib0/url.js":
/*!**********************************!*\
  !*** ./node_modules/lib0/url.js ***!
  \**********************************/
/*! exports provided: decodeQueryParams, encodeQueryParams */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeQueryParams", function() { return decodeQueryParams; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeQueryParams", function() { return encodeQueryParams; });
/* harmony import */ var _object_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./object.js */ "./node_modules/lib0/object.js");
/**
 * Utility module to work with urls.
 *
 * @module url
 */



/**
 * Parse query parameters from an url.
 *
 * @param {string} url
 * @return {Object<string,string>}
 */
const decodeQueryParams = url => {
  /**
   * @type {Object<string,string>}
   */
  const query = {}
  const urlQuerySplit = url.split('?')
  const pairs = urlQuerySplit[urlQuerySplit.length - 1].split('&')
  for (var i = 0; i < pairs.length; i++) {
    const item = pairs[i]
    if (item.length > 0) {
      const pair = item.split('=')
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
    }
  }
  return query
}

/**
 * @param {Object<string,string>} params
 * @return {string}
 */
const encodeQueryParams = params =>
  _object_js__WEBPACK_IMPORTED_MODULE_0__["map"](params, (val, key) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&')


/***/ }),

/***/ "./node_modules/node-libs-browser/node_modules/buffer/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/node-libs-browser/node_modules/buffer/index.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/y-indexeddb/src/y-indexeddb.js":
/*!*****************************************************!*\
  !*** ./node_modules/y-indexeddb/src/y-indexeddb.js ***!
  \*****************************************************/
/*! exports provided: PREFERRED_TRIM_SIZE, fetchUpdates, storeState, clearDocument, IndexeddbPersistence */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PREFERRED_TRIM_SIZE", function() { return PREFERRED_TRIM_SIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchUpdates", function() { return fetchUpdates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "storeState", function() { return storeState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearDocument", function() { return clearDocument; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IndexeddbPersistence", function() { return IndexeddbPersistence; });
/* harmony import */ var yjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! yjs */ "./node_modules/yjs/dist/yjs.mjs");
/* harmony import */ var lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lib0/indexeddb.js */ "./node_modules/lib0/indexeddb.js");
/* harmony import */ var lib0_mutex_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lib0/mutex.js */ "./node_modules/lib0/mutex.js");
/* harmony import */ var lib0_observable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lib0/observable.js */ "./node_modules/lib0/observable.js");





const customStoreName = 'custom'
const updatesStoreName = 'updates'

const PREFERRED_TRIM_SIZE = 500

/**
 * @param {IndexeddbPersistence} idbPersistence
 */
const fetchUpdates = idbPersistence => {
  const [updatesStore] = lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["transact"](/** @type {IDBDatabase} */ (idbPersistence.db), [updatesStoreName]) // , 'readonly')
  return lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["getAll"](updatesStore, lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["createIDBKeyRangeLowerBound"](idbPersistence._dbref, false)).then(updates =>
    idbPersistence._mux(() =>
      idbPersistence.doc.transact(() =>
        updates.forEach(val => yjs__WEBPACK_IMPORTED_MODULE_0__["applyUpdate"](idbPersistence.doc, val))
      )
    )
  )
    .then(() => lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["getLastKey"](updatesStore).then(lastKey => { idbPersistence._dbref = lastKey + 1 }))
    .then(() => lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["count"](updatesStore).then(cnt => { idbPersistence._dbsize = cnt }))
    .then(() => updatesStore)
}

/**
 * @param {IndexeddbPersistence} idbPersistence
 * @param {boolean} forceStore
 */
const storeState = (idbPersistence, forceStore = true) =>
  fetchUpdates(idbPersistence)
    .then(updatesStore => {
      if (forceStore || idbPersistence._dbsize >= PREFERRED_TRIM_SIZE) {
        lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["addAutoKey"](updatesStore, yjs__WEBPACK_IMPORTED_MODULE_0__["encodeStateAsUpdate"](idbPersistence.doc))
          .then(() => lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["del"](updatesStore, lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["createIDBKeyRangeUpperBound"](idbPersistence._dbref, true)))
          .then(() => lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["count"](updatesStore).then(cnt => { idbPersistence._dbsize = cnt }))
      }
    })

/**
 * @param {string} name
 */
const clearDocument = name => lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["deleteDB"](name)

/**
 * @extends Observable<string>
 */
class IndexeddbPersistence extends lib0_observable_js__WEBPACK_IMPORTED_MODULE_3__["Observable"] {
  /**
   * @param {string} name
   * @param {Y.Doc} doc
   */
  constructor (name, doc) {
    super()
    this.doc = doc
    this.name = name
    this._mux = lib0_mutex_js__WEBPACK_IMPORTED_MODULE_2__["createMutex"]()
    this._dbref = 0
    this._dbsize = 0
    /**
     * @type {IDBDatabase|null}
     */
    this.db = null
    this.synced = false
    this._db = lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["openDB"](name, db =>
      lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["createStores"](db, [
        ['updates', { autoIncrement: true }],
        ['custom']
      ])
    )
    /**
     * @type {Promise<IndexeddbPersistence>}
     */
    this.whenSynced = this._db.then(db => {
      this.db = db
      const currState = yjs__WEBPACK_IMPORTED_MODULE_0__["encodeStateAsUpdate"](doc)
      return fetchUpdates(this).then(updatesStore => lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["addAutoKey"](updatesStore, currState)).then(() => {
        this.emit('synced', [this])
        this.synced = true
        return this
      })
    })
    /**
     * Timeout in ms untill data is merged and persisted in idb.
     */
    this._storeTimeout = 1000
    /**
     * @type {any}
     */
    this._storeTimeoutId = null
    /**
     * @param {Uint8Array} update
     */
    this._storeUpdate = update =>
      this._mux(() => {
        if (this.db) {
          const [updatesStore] = lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["transact"](/** @type {IDBDatabase} */ (this.db), [updatesStoreName])
          lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["addAutoKey"](updatesStore, update)
          if (++this._dbsize >= PREFERRED_TRIM_SIZE) {
            // debounce store call
            if (this._storeTimeoutId !== null) {
              clearTimeout(this._storeTimeoutId)
            }
            this._storeTimeoutId = setTimeout(() => {
              storeState(this, false)
              this._storeTimeoutId = null
            }, this._storeTimeout)
          }
        }
      })
    doc.on('update', this._storeUpdate)
  }

  destroy () {
    if (this._storeTimeoutId) {
      clearTimeout(this._storeTimeoutId)
    }
    this.doc.off('update', this._storeUpdate)
    return this._db.then(db => {
      db.close()
    })
  }

  /**
   * Destroys this instance and removes all data from indexeddb.
   */
  clearData () {
    this.destroy().then(() => {
      lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["deleteDB"](this.name)
    })
  }

  /**
   * @param {String | number | ArrayBuffer | Date} key
   * @return {Promise<String | number | ArrayBuffer | Date | any>}
   */
  get (key) {
    return this._db.then(db => {
      const [custom] = lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["transact"](db, [customStoreName], 'readonly')
      return lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["get"](custom, key)
    })
  }

  /**
   * @param {String | number | ArrayBuffer | Date} key
   * @param {String | number | ArrayBuffer | Date} value
   * @return {Promise<String | number | ArrayBuffer | Date>}
   */
  set (key, value) {
    return this._db.then(db => {
      const [custom] = lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["transact"](db, [customStoreName])
      return lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["put"](custom, value, key)
    })
  }

  /**
   * @param {String | number | ArrayBuffer | Date} key
   * @return {Promise<undefined>}
   */
  del (key) {
    return this._db.then(db => {
      const [custom] = lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["transact"](db, [customStoreName])
      return lib0_indexeddb_js__WEBPACK_IMPORTED_MODULE_1__["del"](custom, key)
    })
  }
}


/***/ }),

/***/ "./node_modules/y-protocols/auth.js":
/*!******************************************!*\
  !*** ./node_modules/y-protocols/auth.js ***!
  \******************************************/
/*! exports provided: messagePermissionDenied, writePermissionDenied, readAuthMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "messagePermissionDenied", function() { return messagePermissionDenied; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writePermissionDenied", function() { return writePermissionDenied; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readAuthMessage", function() { return readAuthMessage; });
/* harmony import */ var yjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! yjs */ "./node_modules/yjs/dist/yjs.mjs");
/* harmony import */ var lib0_encoding_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lib0/encoding.js */ "./node_modules/lib0/encoding.js");
/* harmony import */ var lib0_decoding_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lib0/decoding.js */ "./node_modules/lib0/decoding.js");

 // eslint-disable-line



const messagePermissionDenied = 0

/**
 * @param {encoding.Encoder} encoder
 * @param {string} reason
 */
const writePermissionDenied = (encoder, reason) => {
  lib0_encoding_js__WEBPACK_IMPORTED_MODULE_1__["writeVarUint"](encoder, messagePermissionDenied)
  lib0_encoding_js__WEBPACK_IMPORTED_MODULE_1__["writeVarString"](encoder, reason)
}

/**
 * @callback PermissionDeniedHandler
 * @param {any} y
 * @param {string} reason
 */

/**
 *
 * @param {decoding.Decoder} decoder
 * @param {Y.Doc} y
 * @param {PermissionDeniedHandler} permissionDeniedHandler
 */
const readAuthMessage = (decoder, y, permissionDeniedHandler) => {
  switch (lib0_decoding_js__WEBPACK_IMPORTED_MODULE_2__["readVarUint"](decoder)) {
    case messagePermissionDenied: permissionDeniedHandler(y, lib0_decoding_js__WEBPACK_IMPORTED_MODULE_2__["readVarString"](decoder))
  }
}


/***/ }),

/***/ "./node_modules/y-protocols/awareness.js":
/*!***********************************************!*\
  !*** ./node_modules/y-protocols/awareness.js ***!
  \***********************************************/
/*! exports provided: outdatedTimeout, Awareness, removeAwarenessStates, encodeAwarenessUpdate, modifyAwarenessUpdate, applyAwarenessUpdate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "outdatedTimeout", function() { return outdatedTimeout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Awareness", function() { return Awareness; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeAwarenessStates", function() { return removeAwarenessStates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeAwarenessUpdate", function() { return encodeAwarenessUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "modifyAwarenessUpdate", function() { return modifyAwarenessUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyAwarenessUpdate", function() { return applyAwarenessUpdate; });
/* harmony import */ var lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib0/encoding.js */ "./node_modules/lib0/encoding.js");
/* harmony import */ var lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lib0/decoding.js */ "./node_modules/lib0/decoding.js");
/* harmony import */ var lib0_time_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lib0/time.js */ "./node_modules/lib0/time.js");
/* harmony import */ var lib0_math_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lib0/math.js */ "./node_modules/lib0/math.js");
/* harmony import */ var lib0_observable_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lib0/observable.js */ "./node_modules/lib0/observable.js");
/* harmony import */ var lib0_function_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lib0/function.js */ "./node_modules/lib0/function.js");
/* harmony import */ var yjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! yjs */ "./node_modules/yjs/dist/yjs.mjs");
/**
 * @module awareness-protocol
 */







 // eslint-disable-line

const outdatedTimeout = 30000

/**
 * @typedef {Object} MetaClientState
 * @property {number} MetaClientState.clock
 * @property {number} MetaClientState.lastUpdated unix timestamp
 */

/**
 * The Awareness class implements a simple shared state protocol that can be used for non-persistent data like awareness information
 * (cursor, username, status, ..). Each client can update its own local state and listen to state changes of
 * remote clients. Every client may set a state of a remote peer to `null` to mark the client as offline.
 *
 * Each client is identified by a unique client id (something we borrow from `doc.clientID`). A client can override
 * its own state by propagating a message with an increasing timestamp (`clock`). If such a message is received, it is
 * applied if the known state of that client is older than the new state (`clock < newClock`). If a client thinks that
 * a remote client is offline, it may propagate a message with
 * `{ clock: currentClientClock, state: null, client: remoteClient }`. If such a
 * message is received, and the known clock of that client equals the received clock, it will override the state with `null`.
 *
 * Before a client disconnects, it should propagate a `null` state with an updated clock.
 *
 * Awareness states must be updated every 30 seconds. Otherwise the Awareness instance will delete the client state.
 *
 * @extends {Observable<string>}
 */
class Awareness extends lib0_observable_js__WEBPACK_IMPORTED_MODULE_4__["Observable"] {
  /**
   * @param {Y.Doc} doc
   */
  constructor (doc) {
    super()
    this.doc = doc
    /**
     * Maps from client id to client state
     * @type {Map<number, Object<string, any>>}
     */
    this.states = new Map()
    /**
     * @type {Map<number, MetaClientState>}
     */
    this.meta = new Map()
    this._checkInterval = setInterval(() => {
      const now = lib0_time_js__WEBPACK_IMPORTED_MODULE_2__["getUnixTime"]()
      if (this.getLocalState() !== null && (outdatedTimeout / 2 <= now - /** @type {{lastUpdated:number}} */ (this.meta.get(doc.clientID)).lastUpdated)) {
        // renew local clock
        this.setLocalState(this.getLocalState())
      }
      /**
       * @type {Array<number>}
       */
      const remove = []
      this.meta.forEach((meta, clientid) => {
        if (clientid !== doc.clientID && outdatedTimeout <= now - meta.lastUpdated && this.states.has(clientid)) {
          remove.push(clientid)
        }
      })
      if (remove.length > 0) {
        removeAwarenessStates(this, remove, 'timeout')
      }
    }, lib0_math_js__WEBPACK_IMPORTED_MODULE_3__["floor"](outdatedTimeout / 10))
    doc.on('destroy', () => {
      this.destroy()
    })
    this.setLocalState({})
  }
  destroy () {
    super.destroy()
    clearInterval(this._checkInterval)
  }
  /**
   * @return {Object<string,any>|null}
   */
  getLocalState () {
    return this.states.get(this.doc.clientID) || null
  }
  /**
   * @param {Object<string,any>|null} state
   */
  setLocalState (state) {
    const clientID = this.doc.clientID
    const currLocalMeta = this.meta.get(clientID)
    const clock = currLocalMeta === undefined ? 0 : currLocalMeta.clock + 1
    const prevState = this.states.get(clientID)
    if (state === null) {
      this.states.delete(clientID)
    } else {
      this.states.set(clientID, state)
    }
    this.meta.set(clientID, {
      clock,
      lastUpdated: lib0_time_js__WEBPACK_IMPORTED_MODULE_2__["getUnixTime"]()
    })
    const added = []
    const updated = []
    const filteredUpdated = []
    const removed = []
    if (state === null) {
      removed.push(clientID)
    } else if (prevState == null) {
      if (state != null) {
        added.push(clientID)
      }
    } else {
      updated.push(clientID)
      if (!lib0_function_js__WEBPACK_IMPORTED_MODULE_5__["equalityDeep"](prevState, state)) {
        filteredUpdated.push(clientID)
      }
    }
    if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
      this.emit('change', [{ added, updated: filteredUpdated, removed }, 'local'])
    }
    this.emit('update', [{ added, updated, removed }, 'local'])
  }
  /**
   * @param {string} field
   * @param {any} value
   */
  setLocalStateField (field, value) {
    const state = this.getLocalState()
    if (state !== null) {
      state[field] = value
      this.setLocalState(state)
    }
  }
  /**
   * @return {Map<number,Object<string,any>>}
   */
  getStates () {
    return this.states
  }
}

/**
 * Mark (remote) clients as inactive and remove them from the list of active peers.
 * This change will be propagated to remote clients.
 *
 * @param {Awareness} awareness
 * @param {Array<number>} clients
 * @param {any} origin
 */
const removeAwarenessStates = (awareness, clients, origin) => {
  const removed = []
  for (let i = 0; i < clients.length; i++) {
    const clientID = clients[i]
    if (awareness.states.has(clientID)) {
      awareness.states.delete(clientID)
      if (clientID === awareness.doc.clientID) {
        const curMeta = /** @type {MetaClientState} */ (awareness.meta.get(clientID))
        awareness.meta.set(clientID, {
          clock: curMeta.clock + 1,
          lastUpdated: lib0_time_js__WEBPACK_IMPORTED_MODULE_2__["getUnixTime"]()
        })
      }
      removed.push(clientID)
    }
  }
  if (removed.length > 0) {
    awareness.emit('change', [{ added: [], updated: [], removed }, origin])
    awareness.emit('update', [{ added: [], updated: [], removed }, origin])
  }
}

/**
 * @param {Awareness} awareness
 * @param {Array<number>} clients
 * @return {Uint8Array}
 */
const encodeAwarenessUpdate = (awareness, clients, states = awareness.states) => {
  const len = clients.length
  const encoder = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["createEncoder"]()
  lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint"](encoder, len)
  for (let i = 0; i < len; i++) {
    const clientID = clients[i]
    const state = states.get(clientID) || null
    const clock = /** @type {MetaClientState} */ (awareness.meta.get(clientID)).clock
    lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint"](encoder, clientID)
    lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint"](encoder, clock)
    lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarString"](encoder, JSON.stringify(state))
  }
  return lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["toUint8Array"](encoder)
}

/**
 * Modify the content of an awareness update before re-encoding it to an awareness update.
 *
 * This might be useful when you have a central server that wants to ensure that clients
 * cant hijack somebody elses identity.
 *
 * @param {Uint8Array} update
 * @param {function(any):any} modify
 * @return {Uint8Array}
 */
const modifyAwarenessUpdate = (update, modify) => {
  const decoder = lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["createDecoder"](update)
  const encoder = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["createEncoder"]()
  const len = lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["readVarUint"](decoder)
  lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint"](encoder, len)
  for (let i = 0; i < len; i++) {
    const clientID = lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["readVarUint"](decoder)
    const clock = lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["readVarUint"](decoder)
    const state = JSON.parse(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["readVarString"](decoder))
    const modifiedState = modify(state)
    lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint"](encoder, clientID)
    lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint"](encoder, clock)
    lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarString"](encoder, JSON.stringify(modifiedState))
  }
  return lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["toUint8Array"](encoder)
}

/**
 * @param {Awareness} awareness
 * @param {Uint8Array} update
 * @param {any} origin This will be added to the emitted change event
 */
const applyAwarenessUpdate = (awareness, update, origin) => {
  const decoder = lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["createDecoder"](update)
  const timestamp = lib0_time_js__WEBPACK_IMPORTED_MODULE_2__["getUnixTime"]()
  const added = []
  const updated = []
  const filteredUpdated = []
  const removed = []
  const len = lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["readVarUint"](decoder)
  for (let i = 0; i < len; i++) {
    const clientID = lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["readVarUint"](decoder)
    let clock = lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["readVarUint"](decoder)
    const state = JSON.parse(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["readVarString"](decoder))
    const clientMeta = awareness.meta.get(clientID)
    const prevState = awareness.states.get(clientID)
    const currClock = clientMeta === undefined ? 0 : clientMeta.clock
    if (currClock < clock || (currClock === clock && state === null && awareness.states.has(clientID))) {
      if (state === null) {
        // never let a remote client remove this local state
        if (clientID === awareness.doc.clientID && awareness.getLocalState() != null) {
          // remote client removed the local state. Do not remote state. Broadcast a message indicating
          // that this client still exists by increasing the clock
          clock++
        } else {
          awareness.states.delete(clientID)
        }
      } else {
        awareness.states.set(clientID, state)
      }
      awareness.meta.set(clientID, {
        clock,
        lastUpdated: timestamp
      })
      if (clientMeta === undefined && state !== null) {
        added.push(clientID)
      } else if (clientMeta !== undefined && state === null) {
        removed.push(clientID)
      } else if (state !== null) {
        if (!lib0_function_js__WEBPACK_IMPORTED_MODULE_5__["equalityDeep"](state, prevState)) {
          filteredUpdated.push(clientID)
        }
        updated.push(clientID)
      }
    }
  }
  if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) {
    awareness.emit('change', [{
      added, updated: filteredUpdated, removed
    }, origin])
  }
  if (added.length > 0 || updated.length > 0 || removed.length > 0) {
    awareness.emit('update', [{
      added, updated, removed
    }, origin])
  }
}


/***/ }),

/***/ "./node_modules/y-protocols/sync.js":
/*!******************************************!*\
  !*** ./node_modules/y-protocols/sync.js ***!
  \******************************************/
/*! exports provided: messageYjsSyncStep1, messageYjsSyncStep2, messageYjsUpdate, writeSyncStep1, writeSyncStep2, readSyncStep1, readSyncStep2, writeUpdate, readUpdate, readSyncMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "messageYjsSyncStep1", function() { return messageYjsSyncStep1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "messageYjsSyncStep2", function() { return messageYjsSyncStep2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "messageYjsUpdate", function() { return messageYjsUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeSyncStep1", function() { return writeSyncStep1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeSyncStep2", function() { return writeSyncStep2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readSyncStep1", function() { return readSyncStep1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readSyncStep2", function() { return readSyncStep2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeUpdate", function() { return writeUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readUpdate", function() { return readUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readSyncMessage", function() { return readSyncMessage; });
/* harmony import */ var lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib0/encoding.js */ "./node_modules/lib0/encoding.js");
/* harmony import */ var lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lib0/decoding.js */ "./node_modules/lib0/decoding.js");
/* harmony import */ var yjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! yjs */ "./node_modules/yjs/dist/yjs.mjs");
/**
 * @module sync-protocol
 */





/**
 * @typedef {Map<number, number>} StateMap
 */

/**
 * Core Yjs defines three message types:
 * • YjsSyncStep1: Includes the State Set of the sending client. When received, the client should reply with YjsSyncStep2.
 * • YjsSyncStep2: Includes all missing structs and the complete delete set. When received, the the client is assured that
 *   it received all information from the remote client.
 *
 * In a peer-to-peer network, you may want to introduce a SyncDone message type. Both parties should initiate the connection
 * with SyncStep1. When a client received SyncStep2, it should reply with SyncDone. When the local client received both
 * SyncStep2 and SyncDone, it is assured that it is synced to the remote client.
 *
 * In a client-server model, you want to handle this differently: The client should initiate the connection with SyncStep1.
 * When the server receives SyncStep1, it should reply with SyncStep2 immediately followed by SyncStep1. The client replies
 * with SyncStep2 when it receives SyncStep1. Optionally the server may send a SyncDone after it received SyncStep2, so the
 * client knows that the sync is finished.  There are two reasons for this more elaborated sync model: 1. This protocol can
 * easily be implemented on top of http and websockets. 2. The server shoul only reply to requests, and not initiate them.
 * Therefore it is necesarry that the client initiates the sync.
 *
 * Construction of a message:
 * [messageType : varUint, message definition..]
 *
 * Note: A message does not include information about the room name. This must to be handled by the upper layer protocol!
 *
 * stringify[messageType] stringifies a message definition (messageType is already read from the bufffer)
 */

const messageYjsSyncStep1 = 0
const messageYjsSyncStep2 = 1
const messageYjsUpdate = 2

/**
 * Create a sync step 1 message based on the state of the current shared document.
 *
 * @param {encoding.Encoder} encoder
 * @param {Y.Doc} doc
 */
const writeSyncStep1 = (encoder, doc) => {
  lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint"](encoder, messageYjsSyncStep1)
  const sv = yjs__WEBPACK_IMPORTED_MODULE_2__["encodeStateVector"](doc)
  lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint8Array"](encoder, sv)
}

/**
 * @param {encoding.Encoder} encoder
 * @param {Y.Doc} doc
 * @param {Uint8Array} [encodedStateVector]
 */
const writeSyncStep2 = (encoder, doc, encodedStateVector) => {
  lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint"](encoder, messageYjsSyncStep2)
  lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint8Array"](encoder, yjs__WEBPACK_IMPORTED_MODULE_2__["encodeStateAsUpdate"](doc, encodedStateVector))
}

/**
 * Read SyncStep1 message and reply with SyncStep2.
 *
 * @param {decoding.Decoder} decoder The reply to the received message
 * @param {encoding.Encoder} encoder The received message
 * @param {Y.Doc} doc
 */
const readSyncStep1 = (decoder, encoder, doc) =>
  writeSyncStep2(encoder, doc, lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["readVarUint8Array"](decoder))

/**
 * Read and apply Structs and then DeleteStore to a y instance.
 *
 * @param {decoding.Decoder} decoder
 * @param {Y.Doc} doc
 * @param {any} transactionOrigin
 */
const readSyncStep2 = (decoder, doc, transactionOrigin) => {
  yjs__WEBPACK_IMPORTED_MODULE_2__["applyUpdate"](doc, lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["readVarUint8Array"](decoder), transactionOrigin)
}

/**
 * @param {encoding.Encoder} encoder
 * @param {Uint8Array} update
 */
const writeUpdate = (encoder, update) => {
  lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint"](encoder, messageYjsUpdate)
  lib0_encoding_js__WEBPACK_IMPORTED_MODULE_0__["writeVarUint8Array"](encoder, update)
}

/**
 * Read and apply Structs and then DeleteStore to a y instance.
 *
 * @param {decoding.Decoder} decoder
 * @param {Y.Doc} doc
 * @param {any} transactionOrigin
 */
const readUpdate = readSyncStep2

/**
 * @param {decoding.Decoder} decoder A message received from another client
 * @param {encoding.Encoder} encoder The reply message. Will not be sent if empty.
 * @param {Y.Doc} doc
 * @param {any} transactionOrigin
 */
const readSyncMessage = (decoder, encoder, doc, transactionOrigin) => {
  const messageType = lib0_decoding_js__WEBPACK_IMPORTED_MODULE_1__["readVarUint"](decoder)
  switch (messageType) {
    case messageYjsSyncStep1:
      readSyncStep1(decoder, encoder, doc)
      break
    case messageYjsSyncStep2:
      readSyncStep2(decoder, doc, transactionOrigin)
      break
    case messageYjsUpdate:
      readUpdate(decoder, doc, transactionOrigin)
      break
    default:
      throw new Error('Unknown message type')
  }
  return messageType
}


/***/ }),

/***/ "./node_modules/yjs/dist/yjs.mjs":
/*!***************************************!*\
  !*** ./node_modules/yjs/dist/yjs.mjs ***!
  \***************************************/
/*! exports provided: AbstractConnector, AbstractStruct, AbstractType, Array, ContentAny, ContentBinary, ContentDeleted, ContentEmbed, ContentFormat, ContentJSON, ContentString, ContentType, Doc, GC, ID, Item, Map, PermanentUserData, RelativePosition, Snapshot, Text, Transaction, UndoManager, XmlElement, XmlFragment, XmlHook, XmlText, YArrayEvent, YEvent, YMapEvent, YTextEvent, YXmlEvent, applyUpdate, applyUpdateV2, compareIDs, compareRelativePositions, createAbsolutePositionFromRelativePosition, createDeleteSet, createDeleteSetFromStructStore, createDocFromSnapshot, createID, createRelativePositionFromJSON, createRelativePositionFromTypeIndex, createSnapshot, decodeSnapshot, decodeSnapshotV2, decodeStateVector, decodeStateVectorV2, emptySnapshot, encodeSnapshot, encodeSnapshotV2, encodeStateAsUpdate, encodeStateAsUpdateV2, encodeStateVector, encodeStateVectorV2, equalSnapshots, findRootTypeKey, getItem, getState, getTypeChildren, isDeleted, isParentOf, iterateDeletedStructs, logType, readRelativePosition, readUpdate, readUpdateV2, snapshot, transact, tryGc, typeListToArraySnapshot, typeMapGetSnapshot, writeRelativePosition */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractConnector", function() { return AbstractConnector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractStruct", function() { return AbstractStruct; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractType", function() { return AbstractType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Array", function() { return YArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentAny", function() { return ContentAny; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentBinary", function() { return ContentBinary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentDeleted", function() { return ContentDeleted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentEmbed", function() { return ContentEmbed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentFormat", function() { return ContentFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentJSON", function() { return ContentJSON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentString", function() { return ContentString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentType", function() { return ContentType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Doc", function() { return Doc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GC", function() { return GC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ID", function() { return ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Item", function() { return Item; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Map", function() { return YMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PermanentUserData", function() { return PermanentUserData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RelativePosition", function() { return RelativePosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Snapshot", function() { return Snapshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return YText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transaction", function() { return Transaction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UndoManager", function() { return UndoManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XmlElement", function() { return YXmlElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XmlFragment", function() { return YXmlFragment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XmlHook", function() { return YXmlHook; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XmlText", function() { return YXmlText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YArrayEvent", function() { return YArrayEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YEvent", function() { return YEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YMapEvent", function() { return YMapEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YTextEvent", function() { return YTextEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YXmlEvent", function() { return YXmlEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyUpdate", function() { return applyUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "applyUpdateV2", function() { return applyUpdateV2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compareIDs", function() { return compareIDs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compareRelativePositions", function() { return compareRelativePositions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createAbsolutePositionFromRelativePosition", function() { return createAbsolutePositionFromRelativePosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDeleteSet", function() { return createDeleteSet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDeleteSetFromStructStore", function() { return createDeleteSetFromStructStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createDocFromSnapshot", function() { return createDocFromSnapshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createID", function() { return createID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRelativePositionFromJSON", function() { return createRelativePositionFromJSON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createRelativePositionFromTypeIndex", function() { return createRelativePositionFromTypeIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSnapshot", function() { return createSnapshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeSnapshot", function() { return decodeSnapshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeSnapshotV2", function() { return decodeSnapshotV2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeStateVector", function() { return decodeStateVector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decodeStateVectorV2", function() { return decodeStateVectorV2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "emptySnapshot", function() { return emptySnapshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeSnapshot", function() { return encodeSnapshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeSnapshotV2", function() { return encodeSnapshotV2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeStateAsUpdate", function() { return encodeStateAsUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeStateAsUpdateV2", function() { return encodeStateAsUpdateV2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeStateVector", function() { return encodeStateVector; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "encodeStateVectorV2", function() { return encodeStateVectorV2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "equalSnapshots", function() { return equalSnapshots; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findRootTypeKey", function() { return findRootTypeKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getItem", function() { return getItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getState", function() { return getState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTypeChildren", function() { return getTypeChildren; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDeleted", function() { return isDeleted; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isParentOf", function() { return isParentOf; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "iterateDeletedStructs", function() { return iterateDeletedStructs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logType", function() { return logType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readRelativePosition", function() { return readRelativePosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readUpdate", function() { return readUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readUpdateV2", function() { return readUpdateV2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "snapshot", function() { return snapshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "transact", function() { return transact; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tryGc", function() { return tryGc; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeListToArraySnapshot", function() { return typeListToArraySnapshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeMapGetSnapshot", function() { return typeMapGetSnapshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "writeRelativePosition", function() { return writeRelativePosition; });
/* harmony import */ var lib0_observable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lib0/observable.js */ "./node_modules/lib0/observable.js");
/* harmony import */ var lib0_array_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lib0/array.js */ "./node_modules/lib0/array.js");
/* harmony import */ var lib0_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lib0/math.js */ "./node_modules/lib0/math.js");
/* harmony import */ var lib0_map_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lib0/map.js */ "./node_modules/lib0/map.js");
/* harmony import */ var lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lib0/encoding.js */ "./node_modules/lib0/encoding.js");
/* harmony import */ var lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lib0/decoding.js */ "./node_modules/lib0/decoding.js");
/* harmony import */ var lib0_random_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lib0/random.js */ "./node_modules/lib0/random.js");
/* harmony import */ var lib0_buffer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lib0/buffer.js */ "./node_modules/lib0/buffer.js");
/* harmony import */ var lib0_error_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lib0/error.js */ "./node_modules/lib0/error.js");
/* harmony import */ var lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lib0/binary.js */ "./node_modules/lib0/binary.js");
/* harmony import */ var lib0_function_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lib0/function.js */ "./node_modules/lib0/function.js");
/* harmony import */ var lib0_set_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lib0/set.js */ "./node_modules/lib0/set.js");
/* harmony import */ var lib0_logging_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! lib0/logging.js */ "./node_modules/lib0/logging.js");
/* harmony import */ var lib0_time_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! lib0/time.js */ "./node_modules/lib0/time.js");
/* harmony import */ var lib0_iterator_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! lib0/iterator.js */ "./node_modules/lib0/iterator.js");
/* harmony import */ var lib0_object_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! lib0/object.js */ "./node_modules/lib0/object.js");

















/**
 * This is an abstract interface that all Connectors should implement to keep them interchangeable.
 *
 * @note This interface is experimental and it is not advised to actually inherit this class.
 *       It just serves as typing information.
 *
 * @extends {Observable<any>}
 */
class AbstractConnector extends lib0_observable_js__WEBPACK_IMPORTED_MODULE_0__["Observable"] {
  /**
   * @param {Doc} ydoc
   * @param {any} awareness
   */
  constructor (ydoc, awareness) {
    super();
    this.doc = ydoc;
    this.awareness = awareness;
  }
}

class DeleteItem {
  /**
   * @param {number} clock
   * @param {number} len
   */
  constructor (clock, len) {
    /**
     * @type {number}
     */
    this.clock = clock;
    /**
     * @type {number}
     */
    this.len = len;
  }
}

/**
 * We no longer maintain a DeleteStore. DeleteSet is a temporary object that is created when needed.
 * - When created in a transaction, it must only be accessed after sorting, and merging
 *   - This DeleteSet is send to other clients
 * - We do not create a DeleteSet when we send a sync message. The DeleteSet message is created directly from StructStore
 * - We read a DeleteSet as part of a sync/update message. In this case the DeleteSet is already sorted and merged.
 */
class DeleteSet {
  constructor () {
    /**
     * @type {Map<number,Array<DeleteItem>>}
     */
    this.clients = new Map();
  }
}

/**
 * Iterate over all structs that the DeleteSet gc's.
 *
 * @param {Transaction} transaction
 * @param {DeleteSet} ds
 * @param {function(GC|Item):void} f
 *
 * @function
 */
const iterateDeletedStructs = (transaction, ds, f) =>
  ds.clients.forEach((deletes, clientid) => {
    const structs = /** @type {Array<GC|Item>} */ (transaction.doc.store.clients.get(clientid));
    for (let i = 0; i < deletes.length; i++) {
      const del = deletes[i];
      iterateStructs(transaction, structs, del.clock, del.len, f);
    }
  });

/**
 * @param {Array<DeleteItem>} dis
 * @param {number} clock
 * @return {number|null}
 *
 * @private
 * @function
 */
const findIndexDS = (dis, clock) => {
  let left = 0;
  let right = dis.length - 1;
  while (left <= right) {
    const midindex = Object(lib0_math_js__WEBPACK_IMPORTED_MODULE_2__["floor"])((left + right) / 2);
    const mid = dis[midindex];
    const midclock = mid.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.len) {
        return midindex
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
  }
  return null
};

/**
 * @param {DeleteSet} ds
 * @param {ID} id
 * @return {boolean}
 *
 * @private
 * @function
 */
const isDeleted = (ds, id) => {
  const dis = ds.clients.get(id.client);
  return dis !== undefined && findIndexDS(dis, id.clock) !== null
};

/**
 * @param {DeleteSet} ds
 *
 * @private
 * @function
 */
const sortAndMergeDeleteSet = ds => {
  ds.clients.forEach(dels => {
    dels.sort((a, b) => a.clock - b.clock);
    // merge items without filtering or splicing the array
    // i is the current pointer
    // j refers to the current insert position for the pointed item
    // try to merge dels[i] into dels[j-1] or set dels[j]=dels[i]
    let i, j;
    for (i = 1, j = 1; i < dels.length; i++) {
      const left = dels[j - 1];
      const right = dels[i];
      if (left.clock + left.len === right.clock) {
        left.len += right.len;
      } else {
        if (j < i) {
          dels[j] = right;
        }
        j++;
      }
    }
    dels.length = j;
  });
};

/**
 * @param {Array<DeleteSet>} dss
 * @return {DeleteSet} A fresh DeleteSet
 */
const mergeDeleteSets = dss => {
  const merged = new DeleteSet();
  for (let dssI = 0; dssI < dss.length; dssI++) {
    dss[dssI].clients.forEach((delsLeft, client) => {
      if (!merged.clients.has(client)) {
        // Write all missing keys from current ds and all following.
        // If merged already contains `client` current ds has already been added.
        /**
         * @type {Array<DeleteItem>}
         */
        const dels = delsLeft.slice();
        for (let i = dssI + 1; i < dss.length; i++) {
          Object(lib0_array_js__WEBPACK_IMPORTED_MODULE_1__["appendTo"])(dels, dss[i].clients.get(client) || []);
        }
        merged.clients.set(client, dels);
      }
    });
  }
  sortAndMergeDeleteSet(merged);
  return merged
};

/**
 * @param {DeleteSet} ds
 * @param {number} client
 * @param {number} clock
 * @param {number} length
 *
 * @private
 * @function
 */
const addToDeleteSet = (ds, client, clock, length) => {
  Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["setIfUndefined"])(ds.clients, client, () => []).push(new DeleteItem(clock, length));
};

const createDeleteSet = () => new DeleteSet();

/**
 * @param {StructStore} ss
 * @return {DeleteSet} Merged and sorted DeleteSet
 *
 * @private
 * @function
 */
const createDeleteSetFromStructStore = ss => {
  const ds = createDeleteSet();
  ss.clients.forEach((structs, client) => {
    /**
     * @type {Array<DeleteItem>}
     */
    const dsitems = [];
    for (let i = 0; i < structs.length; i++) {
      const struct = structs[i];
      if (struct.deleted) {
        const clock = struct.id.clock;
        let len = struct.length;
        if (i + 1 < structs.length) {
          for (let next = structs[i + 1]; i + 1 < structs.length && next.id.clock === clock + len && next.deleted; next = structs[++i + 1]) {
            len += next.length;
          }
        }
        dsitems.push(new DeleteItem(clock, len));
      }
    }
    if (dsitems.length > 0) {
      ds.clients.set(client, dsitems);
    }
  });
  return ds
};

/**
 * @param {AbstractDSEncoder} encoder
 * @param {DeleteSet} ds
 *
 * @private
 * @function
 */
const writeDeleteSet = (encoder, ds) => {
  Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, ds.clients.size);
  ds.clients.forEach((dsitems, client) => {
    encoder.resetDsCurVal();
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, client);
    const len = dsitems.length;
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, len);
    for (let i = 0; i < len; i++) {
      const item = dsitems[i];
      encoder.writeDsClock(item.clock);
      encoder.writeDsLen(item.len);
    }
  });
};

/**
 * @param {AbstractDSDecoder} decoder
 * @return {DeleteSet}
 *
 * @private
 * @function
 */
const readDeleteSet = decoder => {
  const ds = new DeleteSet();
  const numClients = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
    const numberOfDeletes = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
    if (numberOfDeletes > 0) {
      const dsField = Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["setIfUndefined"])(ds.clients, client, () => []);
      for (let i = 0; i < numberOfDeletes; i++) {
        dsField.push(new DeleteItem(decoder.readDsClock(), decoder.readDsLen()));
      }
    }
  }
  return ds
};

/**
 * @todo YDecoder also contains references to String and other Decoders. Would make sense to exchange YDecoder.toUint8Array for YDecoder.DsToUint8Array()..
 */

/**
 * @param {AbstractDSDecoder} decoder
 * @param {Transaction} transaction
 * @param {StructStore} store
 *
 * @private
 * @function
 */
const readAndApplyDeleteSet = (decoder, transaction, store) => {
  const unappliedDS = new DeleteSet();
  const numClients = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
  for (let i = 0; i < numClients; i++) {
    decoder.resetDsCurVal();
    const client = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
    const numberOfDeletes = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
    const structs = store.clients.get(client) || [];
    const state = getState(store, client);
    for (let i = 0; i < numberOfDeletes; i++) {
      const clock = decoder.readDsClock();
      const clockEnd = clock + decoder.readDsLen();
      if (clock < state) {
        if (state < clockEnd) {
          addToDeleteSet(unappliedDS, client, state, clockEnd - state);
        }
        let index = findIndexSS(structs, clock);
        /**
         * We can ignore the case of GC and Delete structs, because we are going to skip them
         * @type {Item}
         */
        // @ts-ignore
        let struct = structs[index];
        // split the first item if necessary
        if (!struct.deleted && struct.id.clock < clock) {
          structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
          index++; // increase we now want to use the next struct
        }
        while (index < structs.length) {
          // @ts-ignore
          struct = structs[index++];
          if (struct.id.clock < clockEnd) {
            if (!struct.deleted) {
              if (clockEnd < struct.id.clock + struct.length) {
                structs.splice(index, 0, splitItem(transaction, struct, clockEnd - struct.id.clock));
              }
              struct.delete(transaction);
            }
          } else {
            break
          }
        }
      } else {
        addToDeleteSet(unappliedDS, client, clock, clockEnd - clock);
      }
    }
  }
  if (unappliedDS.clients.size > 0) {
    // TODO: no need for encoding+decoding ds anymore
    const unappliedDSEncoder = new DSEncoderV2();
    writeDeleteSet(unappliedDSEncoder, unappliedDS);
    store.pendingDeleteReaders.push(new DSDecoderV2(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["createDecoder"])((unappliedDSEncoder.toUint8Array()))));
  }
};

/**
 * @module Y
 */

const generateNewClientId = lib0_random_js__WEBPACK_IMPORTED_MODULE_6__["uint32"];

/**
 * @typedef {Object} DocOpts
 * @property {boolean} [DocOpts.gc=true] Disable garbage collection (default: gc=true)
 * @property {function(Item):boolean} [DocOpts.gcFilter] Will be called before an Item is garbage collected. Return false to keep the Item.
 * @property {string} [DocOpts.guid] Define a globally unique identifier for this document
 * @property {any} [DocOpts.meta] Any kind of meta information you want to associate with this document. If this is a subdocument, remote peers will store the meta information as well.
 * @property {boolean} [DocOpts.autoLoad] If a subdocument, automatically load document. If this is a subdocument, remote peers will load the document as well automatically.
 */

/**
 * A Yjs instance handles the state of shared data.
 * @extends Observable<string>
 */
class Doc extends lib0_observable_js__WEBPACK_IMPORTED_MODULE_0__["Observable"] {
  /**
   * @param {DocOpts} [opts] configuration
   */
  constructor ({ guid = Object(lib0_random_js__WEBPACK_IMPORTED_MODULE_6__["uuidv4"])(), gc = true, gcFilter = () => true, meta = null, autoLoad = false } = {}) {
    super();
    this.gc = gc;
    this.gcFilter = gcFilter;
    this.clientID = generateNewClientId();
    this.guid = guid;
    /**
     * @type {Map<string, AbstractType<YEvent>>}
     */
    this.share = new Map();
    this.store = new StructStore();
    /**
     * @type {Transaction | null}
     */
    this._transaction = null;
    /**
     * @type {Array<Transaction>}
     */
    this._transactionCleanups = [];
    /**
     * @type {Set<Doc>}
     */
    this.subdocs = new Set();
    /**
     * If this document is a subdocument - a document integrated into another document - then _item is defined.
     * @type {Item?}
     */
    this._item = null;
    this.shouldLoad = autoLoad;
    this.autoLoad = autoLoad;
    this.meta = meta;
  }

  /**
   * Notify the parent document that you request to load data into this subdocument (if it is a subdocument).
   *
   * `load()` might be used in the future to request any provider to load the most current data.
   *
   * It is safe to call `load()` multiple times.
   */
  load () {
    const item = this._item;
    if (item !== null && !this.shouldLoad) {
      transact(/** @type {any} */ (item.parent).doc, transaction => {
        transaction.subdocsLoaded.add(this);
      }, null, true);
    }
    this.shouldLoad = true;
  }

  getSubdocs () {
    return this.subdocs
  }

  getSubdocGuids () {
    return new Set(Array.from(this.subdocs).map(doc => doc.guid))
  }

  /**
   * Changes that happen inside of a transaction are bundled. This means that
   * the observer fires _after_ the transaction is finished and that all changes
   * that happened inside of the transaction are sent as one message to the
   * other peers.
   *
   * @param {function(Transaction):void} f The function that should be executed as a transaction
   * @param {any} [origin] Origin of who started the transaction. Will be stored on transaction.origin
   *
   * @public
   */
  transact (f, origin = null) {
    transact(this, f, origin);
  }

  /**
   * Define a shared data type.
   *
   * Multiple calls of `y.get(name, TypeConstructor)` yield the same result
   * and do not overwrite each other. I.e.
   * `y.define(name, Y.Array) === y.define(name, Y.Array)`
   *
   * After this method is called, the type is also available on `y.share.get(name)`.
   *
   * *Best Practices:*
   * Define all types right after the Yjs instance is created and store them in a separate object.
   * Also use the typed methods `getText(name)`, `getArray(name)`, ..
   *
   * @example
   *   const y = new Y(..)
   *   const appState = {
   *     document: y.getText('document')
   *     comments: y.getArray('comments')
   *   }
   *
   * @param {string} name
   * @param {Function} TypeConstructor The constructor of the type definition. E.g. Y.Text, Y.Array, Y.Map, ...
   * @return {AbstractType<any>} The created type. Constructed with TypeConstructor
   *
   * @public
   */
  get (name, TypeConstructor = AbstractType) {
    const type = Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["setIfUndefined"])(this.share, name, () => {
      // @ts-ignore
      const t = new TypeConstructor();
      t._integrate(this, null);
      return t
    });
    const Constr = type.constructor;
    if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
      if (Constr === AbstractType) {
        // @ts-ignore
        const t = new TypeConstructor();
        t._map = type._map;
        type._map.forEach(/** @param {Item?} n */ n => {
          for (; n !== null; n = n.left) {
            // @ts-ignore
            n.parent = t;
          }
        });
        t._start = type._start;
        for (let n = t._start; n !== null; n = n.right) {
          n.parent = t;
        }
        t._length = type._length;
        this.share.set(name, t);
        t._integrate(this, null);
        return t
      } else {
        throw new Error(`Type with the name ${name} has already been defined with a different constructor`)
      }
    }
    return type
  }

  /**
   * @template T
   * @param {string} [name]
   * @return {YArray<T>}
   *
   * @public
   */
  getArray (name = '') {
    // @ts-ignore
    return this.get(name, YArray)
  }

  /**
   * @param {string} [name]
   * @return {YText}
   *
   * @public
   */
  getText (name = '') {
    // @ts-ignore
    return this.get(name, YText)
  }

  /**
   * @param {string} [name]
   * @return {YMap<any>}
   *
   * @public
   */
  getMap (name = '') {
    // @ts-ignore
    return this.get(name, YMap)
  }

  /**
   * @param {string} [name]
   * @return {YXmlFragment}
   *
   * @public
   */
  getXmlFragment (name = '') {
    // @ts-ignore
    return this.get(name, YXmlFragment)
  }

  /**
   * Converts the entire document into a js object, recursively traversing each yjs type
   * Doesn't log types that have not been defined (using ydoc.getType(..)).
   *
   * @deprecated Do not use this method and rather call toJSON directly on the shared types.
   *
   * @return {Object<string, any>}
   */
  toJSON () {
    /**
     * @type {Object<string, any>}
     */
    const doc = {};

    this.share.forEach((value, key) => {
      doc[key] = value.toJSON();
    });

    return doc
  }

  /**
   * Emit `destroy` event and unregister all event handlers.
   */
  destroy () {
    Object(lib0_array_js__WEBPACK_IMPORTED_MODULE_1__["from"])(this.subdocs).forEach(subdoc => subdoc.destroy());
    const item = this._item;
    if (item !== null) {
      this._item = null;
      const content = /** @type {ContentDoc} */ (item.content);
      if (item.deleted) {
        // @ts-ignore
        content.doc = null;
      } else {
        content.doc = new Doc({ guid: this.guid, ...content.opts });
        content.doc._item = item;
      }
      transact(/** @type {any} */ (item).parent.doc, transaction => {
        if (!item.deleted) {
          transaction.subdocsAdded.add(content.doc);
        }
        transaction.subdocsRemoved.add(this);
      }, null, true);
    }
    this.emit('destroyed', [true]);
    this.emit('destroy', [this]);
    super.destroy();
  }

  /**
   * @param {string} eventName
   * @param {function(...any):any} f
   */
  on (eventName, f) {
    super.on(eventName, f);
  }

  /**
   * @param {string} eventName
   * @param {function} f
   */
  off (eventName, f) {
    super.off(eventName, f);
  }
}

class DSDecoderV1 {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor (decoder) {
    this.restDecoder = decoder;
  }

  resetDsCurVal () {
    // nop
  }

  /**
   * @return {number}
   */
  readDsClock () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder)
  }

  /**
   * @return {number}
   */
  readDsLen () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder)
  }
}

class UpdateDecoderV1 extends DSDecoderV1 {
  /**
   * @return {ID}
   */
  readLeftID () {
    return createID(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder), Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder))
  }

  /**
   * @return {ID}
   */
  readRightID () {
    return createID(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder), Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder))
  }

  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder)
  }

  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readUint8"])(this.restDecoder)
  }

  /**
   * @return {string}
   */
  readString () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarString"])(this.restDecoder)
  }

  /**
   * @return {boolean} isKey
   */
  readParentInfo () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder) === 1
  }

  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readTypeRef () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder)
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number} len
   */
  readLen () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder)
  }

  /**
   * @return {any}
   */
  readAny () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readAny"])(this.restDecoder)
  }

  /**
   * @return {Uint8Array}
   */
  readBuf () {
    return Object(lib0_buffer_js__WEBPACK_IMPORTED_MODULE_7__["copyUint8Array"])(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint8Array"])(this.restDecoder))
  }

  /**
   * Legacy implementation uses JSON parse. We use any-decoding in v2.
   *
   * @return {any}
   */
  readJSON () {
    return JSON.parse(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarString"])(this.restDecoder))
  }

  /**
   * @return {string}
   */
  readKey () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarString"])(this.restDecoder)
  }
}

class DSDecoderV2 {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor (decoder) {
    this.dsCurrVal = 0;
    this.restDecoder = decoder;
  }

  resetDsCurVal () {
    this.dsCurrVal = 0;
  }

  readDsClock () {
    this.dsCurrVal += Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder);
    return this.dsCurrVal
  }

  readDsLen () {
    const diff = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(this.restDecoder) + 1;
    this.dsCurrVal += diff;
    return diff
  }
}

class UpdateDecoderV2 extends DSDecoderV2 {
  /**
   * @param {decoding.Decoder} decoder
   */
  constructor (decoder) {
    super(decoder);
    /**
     * List of cached keys. If the keys[id] does not exist, we read a new key
     * from stringEncoder and push it to keys.
     *
     * @type {Array<string>}
     */
    this.keys = [];
    Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readUint8"])(decoder); // read feature flag - currently unused
    this.keyClockDecoder = new lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["IntDiffOptRleDecoder"](Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint8Array"])(decoder));
    this.clientDecoder = new lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["UintOptRleDecoder"](Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint8Array"])(decoder));
    this.leftClockDecoder = new lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["IntDiffOptRleDecoder"](Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint8Array"])(decoder));
    this.rightClockDecoder = new lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["IntDiffOptRleDecoder"](Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint8Array"])(decoder));
    this.infoDecoder = new lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["RleDecoder"](Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint8Array"])(decoder), lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readUint8"]);
    this.stringDecoder = new lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["StringDecoder"](Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint8Array"])(decoder));
    this.parentInfoDecoder = new lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["RleDecoder"](Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint8Array"])(decoder), lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readUint8"]);
    this.typeRefDecoder = new lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["UintOptRleDecoder"](Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint8Array"])(decoder));
    this.lenDecoder = new lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["UintOptRleDecoder"](Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint8Array"])(decoder));
  }

  /**
   * @return {ID}
   */
  readLeftID () {
    return new ID(this.clientDecoder.read(), this.leftClockDecoder.read())
  }

  /**
   * @return {ID}
   */
  readRightID () {
    return new ID(this.clientDecoder.read(), this.rightClockDecoder.read())
  }

  /**
   * Read the next client id.
   * Use this in favor of readID whenever possible to reduce the number of objects created.
   */
  readClient () {
    return this.clientDecoder.read()
  }

  /**
   * @return {number} info An unsigned 8-bit integer
   */
  readInfo () {
    return /** @type {number} */ (this.infoDecoder.read())
  }

  /**
   * @return {string}
   */
  readString () {
    return this.stringDecoder.read()
  }

  /**
   * @return {boolean}
   */
  readParentInfo () {
    return this.parentInfoDecoder.read() === 1
  }

  /**
   * @return {number} An unsigned 8-bit integer
   */
  readTypeRef () {
    return this.typeRefDecoder.read()
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @return {number}
   */
  readLen () {
    return this.lenDecoder.read()
  }

  /**
   * @return {any}
   */
  readAny () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readAny"])(this.restDecoder)
  }

  /**
   * @return {Uint8Array}
   */
  readBuf () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint8Array"])(this.restDecoder)
  }

  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @return {any}
   */
  readJSON () {
    return Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readAny"])(this.restDecoder)
  }

  /**
   * @return {string}
   */
  readKey () {
    const keyClock = this.keyClockDecoder.read();
    if (keyClock < this.keys.length) {
      return this.keys[keyClock]
    } else {
      const key = this.stringDecoder.read();
      this.keys.push(key);
      return key
    }
  }
}

class DSEncoderV1 {
  constructor () {
    this.restEncoder = new lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["Encoder"]();
  }

  toUint8Array () {
    return Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["toUint8Array"])(this.restEncoder)
  }

  resetDsCurVal () {
    // nop
  }

  /**
   * @param {number} clock
   */
  writeDsClock (clock) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, clock);
  }

  /**
   * @param {number} len
   */
  writeDsLen (len) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, len);
  }
}

class UpdateEncoderV1 extends DSEncoderV1 {
  /**
   * @param {ID} id
   */
  writeLeftID (id) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, id.client);
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, id.clock);
  }

  /**
   * @param {ID} id
   */
  writeRightID (id) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, id.client);
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, id.clock);
  }

  /**
   * Use writeClient and writeClock instead of writeID if possible.
   * @param {number} client
   */
  writeClient (client) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, client);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo (info) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeUint8"])(this.restEncoder, info);
  }

  /**
   * @param {string} s
   */
  writeString (s) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarString"])(this.restEncoder, s);
  }

  /**
   * @param {boolean} isYKey
   */
  writeParentInfo (isYKey) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, isYKey ? 1 : 0);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef (info) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, info);
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen (len) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, len);
  }

  /**
   * @param {any} any
   */
  writeAny (any) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeAny"])(this.restEncoder, any);
  }

  /**
   * @param {Uint8Array} buf
   */
  writeBuf (buf) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint8Array"])(this.restEncoder, buf);
  }

  /**
   * @param {any} embed
   */
  writeJSON (embed) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarString"])(this.restEncoder, JSON.stringify(embed));
  }

  /**
   * @param {string} key
   */
  writeKey (key) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarString"])(this.restEncoder, key);
  }
}

class DSEncoderV2 {
  constructor () {
    this.restEncoder = new lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["Encoder"](); // encodes all the rest / non-optimized
    this.dsCurrVal = 0;
  }

  toUint8Array () {
    return Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["toUint8Array"])(this.restEncoder)
  }

  resetDsCurVal () {
    this.dsCurrVal = 0;
  }

  /**
   * @param {number} clock
   */
  writeDsClock (clock) {
    const diff = clock - this.dsCurrVal;
    this.dsCurrVal = clock;
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, diff);
  }

  /**
   * @param {number} len
   */
  writeDsLen (len) {
    if (len === 0) {
      Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["unexpectedCase"])();
    }
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(this.restEncoder, len - 1);
    this.dsCurrVal += len;
  }
}

class UpdateEncoderV2 extends DSEncoderV2 {
  constructor () {
    super();
    /**
     * @type {Map<string,number>}
     */
    this.keyMap = new Map();
    /**
     * Refers to the next uniqe key-identifier to me used.
     * See writeKey method for more information.
     *
     * @type {number}
     */
    this.keyClock = 0;
    this.keyClockEncoder = new lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["IntDiffOptRleEncoder"]();
    this.clientEncoder = new lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["UintOptRleEncoder"]();
    this.leftClockEncoder = new lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["IntDiffOptRleEncoder"]();
    this.rightClockEncoder = new lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["IntDiffOptRleEncoder"]();
    this.infoEncoder = new lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["RleEncoder"](lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeUint8"]);
    this.stringEncoder = new lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["StringEncoder"]();
    this.parentInfoEncoder = new lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["RleEncoder"](lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeUint8"]);
    this.typeRefEncoder = new lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["UintOptRleEncoder"]();
    this.lenEncoder = new lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["UintOptRleEncoder"]();
  }

  toUint8Array () {
    const encoder = Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["createEncoder"])();
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeUint8"])(encoder, 0); // this is a feature flag that we might use in the future
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint8Array"])(encoder, this.keyClockEncoder.toUint8Array());
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint8Array"])(encoder, this.clientEncoder.toUint8Array());
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint8Array"])(encoder, this.leftClockEncoder.toUint8Array());
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint8Array"])(encoder, this.rightClockEncoder.toUint8Array());
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint8Array"])(encoder, Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["toUint8Array"])(this.infoEncoder));
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint8Array"])(encoder, this.stringEncoder.toUint8Array());
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint8Array"])(encoder, Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["toUint8Array"])(this.parentInfoEncoder));
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint8Array"])(encoder, this.typeRefEncoder.toUint8Array());
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint8Array"])(encoder, this.lenEncoder.toUint8Array());
    // @note The rest encoder is appended! (note the missing var)
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeUint8Array"])(encoder, Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["toUint8Array"])(this.restEncoder));
    return Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["toUint8Array"])(encoder)
  }

  /**
   * @param {ID} id
   */
  writeLeftID (id) {
    this.clientEncoder.write(id.client);
    this.leftClockEncoder.write(id.clock);
  }

  /**
   * @param {ID} id
   */
  writeRightID (id) {
    this.clientEncoder.write(id.client);
    this.rightClockEncoder.write(id.clock);
  }

  /**
   * @param {number} client
   */
  writeClient (client) {
    this.clientEncoder.write(client);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeInfo (info) {
    this.infoEncoder.write(info);
  }

  /**
   * @param {string} s
   */
  writeString (s) {
    this.stringEncoder.write(s);
  }

  /**
   * @param {boolean} isYKey
   */
  writeParentInfo (isYKey) {
    this.parentInfoEncoder.write(isYKey ? 1 : 0);
  }

  /**
   * @param {number} info An unsigned 8-bit integer
   */
  writeTypeRef (info) {
    this.typeRefEncoder.write(info);
  }

  /**
   * Write len of a struct - well suited for Opt RLE encoder.
   *
   * @param {number} len
   */
  writeLen (len) {
    this.lenEncoder.write(len);
  }

  /**
   * @param {any} any
   */
  writeAny (any) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeAny"])(this.restEncoder, any);
  }

  /**
   * @param {Uint8Array} buf
   */
  writeBuf (buf) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint8Array"])(this.restEncoder, buf);
  }

  /**
   * This is mainly here for legacy purposes.
   *
   * Initial we incoded objects using JSON. Now we use the much faster lib0/any-encoder. This method mainly exists for legacy purposes for the v1 encoder.
   *
   * @param {any} embed
   */
  writeJSON (embed) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeAny"])(this.restEncoder, embed);
  }

  /**
   * Property keys are often reused. For example, in y-prosemirror the key `bold` might
   * occur very often. For a 3d application, the key `position` might occur very often.
   *
   * We cache these keys in a Map and refer to them via a unique number.
   *
   * @param {string} key
   */
  writeKey (key) {
    const clock = this.keyMap.get(key);
    if (clock === undefined) {
      this.keyClockEncoder.write(this.keyClock++);
      this.stringEncoder.write(key);
    } else {
      this.keyClockEncoder.write(this.keyClock++);
    }
  }
}

let DefaultDSEncoder = DSEncoderV1;
let DefaultDSDecoder = DSDecoderV1;
let DefaultUpdateEncoder = UpdateEncoderV1;
let DefaultUpdateDecoder = UpdateDecoderV1;

/**
 * @param {AbstractUpdateEncoder} encoder
 * @param {Array<GC|Item>} structs All structs by `client`
 * @param {number} client
 * @param {number} clock write structs starting with `ID(client,clock)`
 *
 * @function
 */
const writeStructs = (encoder, structs, client, clock) => {
  // write first id
  const startNewStructs = findIndexSS(structs, clock);
  // write # encoded structs
  Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, structs.length - startNewStructs);
  encoder.writeClient(client);
  Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, clock);
  const firstStruct = structs[startNewStructs];
  // write first struct with an offset
  firstStruct.write(encoder, clock - firstStruct.id.clock);
  for (let i = startNewStructs + 1; i < structs.length; i++) {
    structs[i].write(encoder, 0);
  }
};

/**
 * @param {AbstractUpdateEncoder} encoder
 * @param {StructStore} store
 * @param {Map<number,number>} _sm
 *
 * @private
 * @function
 */
const writeClientsStructs = (encoder, store, _sm) => {
  // we filter all valid _sm entries into sm
  const sm = new Map();
  _sm.forEach((clock, client) => {
    // only write if new structs are available
    if (getState(store, client) > clock) {
      sm.set(client, clock);
    }
  });
  getStateVector(store).forEach((clock, client) => {
    if (!_sm.has(client)) {
      sm.set(client, 0);
    }
  });
  // write # states that were updated
  Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, sm.size);
  // Write items with higher client ids first
  // This heavily improves the conflict algorithm.
  Array.from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
    // @ts-ignore
    writeStructs(encoder, store.clients.get(client), client, clock);
  });
};

/**
 * @param {AbstractUpdateDecoder} decoder The decoder object to read data from.
 * @param {Map<number,Array<GC|Item>>} clientRefs
 * @param {Doc} doc
 * @return {Map<number,Array<GC|Item>>}
 *
 * @private
 * @function
 */
const readClientsStructRefs = (decoder, clientRefs, doc) => {
  const numOfStateUpdates = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
  for (let i = 0; i < numOfStateUpdates; i++) {
    const numberOfStructs = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
    /**
     * @type {Array<GC|Item>}
     */
    const refs = new Array(numberOfStructs);
    const client = decoder.readClient();
    let clock = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
    // const start = performance.now()
    clientRefs.set(client, refs);
    for (let i = 0; i < numberOfStructs; i++) {
      const info = decoder.readInfo();
      if ((lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BITS5"] & info) !== 0) {
        /**
         * The optimized implementation doesn't use any variables because inlining variables is faster.
         * Below a non-optimized version is shown that implements the basic algorithm with
         * a few comments
         */
        const cantCopyParentInfo = (info & (lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT7"] | lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT8"])) === 0;
        // If parent = null and neither left nor right are defined, then we know that `parent` is child of `y`
        // and we read the next string as parentYKey.
        // It indicates how we store/retrieve parent from `y.share`
        // @type {string|null}
        const struct = new Item(
          createID(client, clock),
          null, // leftd
          (info & lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT8"]) === lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT8"] ? decoder.readLeftID() : null, // origin
          null, // right
          (info & lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT7"]) === lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT7"] ? decoder.readRightID() : null, // right origin
          cantCopyParentInfo ? (decoder.readParentInfo() ? doc.get(decoder.readString()) : decoder.readLeftID()) : null, // parent
          cantCopyParentInfo && (info & lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT6"]) === lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT6"] ? decoder.readString() : null, // parentSub
          readItemContent(decoder, info) // item content
        );
        /* A non-optimized implementation of the above algorithm:

        // The item that was originally to the left of this item.
        const origin = (info & binary.BIT8) === binary.BIT8 ? decoder.readLeftID() : null
        // The item that was originally to the right of this item.
        const rightOrigin = (info & binary.BIT7) === binary.BIT7 ? decoder.readRightID() : null
        const cantCopyParentInfo = (info & (binary.BIT7 | binary.BIT8)) === 0
        const hasParentYKey = cantCopyParentInfo ? decoder.readParentInfo() : false
        // If parent = null and neither left nor right are defined, then we know that `parent` is child of `y`
        // and we read the next string as parentYKey.
        // It indicates how we store/retrieve parent from `y.share`
        // @type {string|null}
        const parentYKey = cantCopyParentInfo && hasParentYKey ? decoder.readString() : null

        const struct = new Item(
          createID(client, clock),
          null, // leftd
          origin, // origin
          null, // right
          rightOrigin, // right origin
          cantCopyParentInfo && !hasParentYKey ? decoder.readLeftID() : (parentYKey !== null ? doc.get(parentYKey) : null), // parent
          cantCopyParentInfo && (info & binary.BIT6) === binary.BIT6 ? decoder.readString() : null, // parentSub
          readItemContent(decoder, info) // item content
        )
        */
        refs[i] = struct;
        clock += struct.length;
      } else {
        const len = decoder.readLen();
        refs[i] = new GC(createID(client, clock), len);
        clock += len;
      }
    }
    // console.log('time to read: ', performance.now() - start) // @todo remove
  }
  return clientRefs
};

/**
 * Resume computing structs generated by struct readers.
 *
 * While there is something to do, we integrate structs in this order
 * 1. top element on stack, if stack is not empty
 * 2. next element from current struct reader (if empty, use next struct reader)
 *
 * If struct causally depends on another struct (ref.missing), we put next reader of
 * `ref.id.client` on top of stack.
 *
 * At some point we find a struct that has no causal dependencies,
 * then we start emptying the stack.
 *
 * It is not possible to have circles: i.e. struct1 (from client1) depends on struct2 (from client2)
 * depends on struct3 (from client1). Therefore the max stack size is eqaul to `structReaders.length`.
 *
 * This method is implemented in a way so that we can resume computation if this update
 * causally depends on another update.
 *
 * @param {Transaction} transaction
 * @param {StructStore} store
 *
 * @private
 * @function
 */
const resumeStructIntegration = (transaction, store) => {
  const stack = store.pendingStack; // @todo don't forget to append stackhead at the end
  const clientsStructRefs = store.pendingClientsStructRefs;
  // sort them so that we take the higher id first, in case of conflicts the lower id will probably not conflict with the id from the higher user.
  const clientsStructRefsIds = Array.from(clientsStructRefs.keys()).sort((a, b) => a - b);
  if (clientsStructRefsIds.length === 0) {
    return
  }
  const getNextStructTarget = () => {
    let nextStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */ (clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]));
    while (nextStructsTarget.refs.length === nextStructsTarget.i) {
      clientsStructRefsIds.pop();
      if (clientsStructRefsIds.length > 0) {
        nextStructsTarget = /** @type {{i:number,refs:Array<GC|Item>}} */ (clientsStructRefs.get(clientsStructRefsIds[clientsStructRefsIds.length - 1]));
      } else {
        store.pendingClientsStructRefs.clear();
        return null
      }
    }
    return nextStructsTarget
  };
  let curStructsTarget = getNextStructTarget();
  if (curStructsTarget === null && stack.length === 0) {
    return
  }
  /**
   * @type {GC|Item}
   */
  let stackHead = stack.length > 0
    ? /** @type {GC|Item} */ (stack.pop())
    : /** @type {any} */ (curStructsTarget).refs[/** @type {any} */ (curStructsTarget).i++];
  // caching the state because it is used very often
  const state = new Map();
  // iterate over all struct readers until we are done
  while (true) {
    const localClock = Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["setIfUndefined"])(state, stackHead.id.client, () => getState(store, stackHead.id.client));
    const offset = stackHead.id.clock < localClock ? localClock - stackHead.id.clock : 0;
    if (stackHead.id.clock + offset !== localClock) {
      // A previous message from this client is missing
      // check if there is a pending structRef with a smaller clock and switch them
      /**
       * @type {{ refs: Array<GC|Item>, i: number }}
       */
      const structRefs = clientsStructRefs.get(stackHead.id.client) || { refs: [], i: 0 };
      if (structRefs.refs.length !== structRefs.i) {
        const r = structRefs.refs[structRefs.i];
        if (r.id.clock < stackHead.id.clock) {
          // put ref with smaller clock on stack instead and continue
          structRefs.refs[structRefs.i] = stackHead;
          stackHead = r;
          // sort the set because this approach might bring the list out of order
          structRefs.refs = structRefs.refs.slice(structRefs.i).sort((r1, r2) => r1.id.clock - r2.id.clock);
          structRefs.i = 0;
          continue
        }
      }
      // wait until missing struct is available
      stack.push(stackHead);
      return
    }
    const missing = stackHead.getMissing(transaction, store);
    if (missing === null) {
      if (offset === 0 || offset < stackHead.length) {
        stackHead.integrate(transaction, offset);
        state.set(stackHead.id.client, stackHead.id.clock + stackHead.length);
      }
      // iterate to next stackHead
      if (stack.length > 0) {
        stackHead = /** @type {GC|Item} */ (stack.pop());
      } else if (curStructsTarget !== null && curStructsTarget.i < curStructsTarget.refs.length) {
        stackHead = /** @type {GC|Item} */ (curStructsTarget.refs[curStructsTarget.i++]);
      } else {
        curStructsTarget = getNextStructTarget();
        if (curStructsTarget === null) {
          // we are done!
          break
        } else {
          stackHead = /** @type {GC|Item} */ (curStructsTarget.refs[curStructsTarget.i++]);
        }
      }
    } else {
      // get the struct reader that has the missing struct
      /**
       * @type {{ refs: Array<GC|Item>, i: number }}
       */
      const structRefs = clientsStructRefs.get(missing) || { refs: [], i: 0 };
      if (structRefs.refs.length === structRefs.i) {
        // This update message causally depends on another update message.
        stack.push(stackHead);
        return
      }
      stack.push(stackHead);
      stackHead = structRefs.refs[structRefs.i++];
    }
  }
  store.pendingClientsStructRefs.clear();
};

/**
 * @param {Transaction} transaction
 * @param {StructStore} store
 *
 * @private
 * @function
 */
const tryResumePendingDeleteReaders = (transaction, store) => {
  const pendingReaders = store.pendingDeleteReaders;
  store.pendingDeleteReaders = [];
  for (let i = 0; i < pendingReaders.length; i++) {
    readAndApplyDeleteSet(pendingReaders[i], transaction, store);
  }
};

/**
 * @param {AbstractUpdateEncoder} encoder
 * @param {Transaction} transaction
 *
 * @private
 * @function
 */
const writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);

/**
 * @param {StructStore} store
 * @param {Map<number, Array<GC|Item>>} clientsStructsRefs
 *
 * @private
 * @function
 */
const mergeReadStructsIntoPendingReads = (store, clientsStructsRefs) => {
  const pendingClientsStructRefs = store.pendingClientsStructRefs;
  clientsStructsRefs.forEach((structRefs, client) => {
    const pendingStructRefs = pendingClientsStructRefs.get(client);
    if (pendingStructRefs === undefined) {
      pendingClientsStructRefs.set(client, { refs: structRefs, i: 0 });
    } else {
      // merge into existing structRefs
      const merged = pendingStructRefs.i > 0 ? pendingStructRefs.refs.slice(pendingStructRefs.i) : pendingStructRefs.refs;
      for (let i = 0; i < structRefs.length; i++) {
        merged.push(structRefs[i]);
      }
      pendingStructRefs.i = 0;
      pendingStructRefs.refs = merged.sort((r1, r2) => r1.id.clock - r2.id.clock);
    }
  });
};

/**
 * @param {Map<number,{refs:Array<GC|Item>,i:number}>} pendingClientsStructRefs
 */
const cleanupPendingStructs = pendingClientsStructRefs => {
  // cleanup pendingClientsStructs if not fully finished
  pendingClientsStructRefs.forEach((refs, client) => {
    if (refs.i === refs.refs.length) {
      pendingClientsStructRefs.delete(client);
    } else {
      refs.refs.splice(0, refs.i);
      refs.i = 0;
    }
  });
};

/**
 * Read the next Item in a Decoder and fill this Item with the read data.
 *
 * This is called when data is received from a remote peer.
 *
 * @param {AbstractUpdateDecoder} decoder The decoder object to read data from.
 * @param {Transaction} transaction
 * @param {StructStore} store
 *
 * @private
 * @function
 */
const readStructs = (decoder, transaction, store) => {
  const clientsStructRefs = new Map();
  // let start = performance.now()
  readClientsStructRefs(decoder, clientsStructRefs, transaction.doc);
  // console.log('time to read structs: ', performance.now() - start) // @todo remove
  // start = performance.now()
  mergeReadStructsIntoPendingReads(store, clientsStructRefs);
  // console.log('time to merge: ', performance.now() - start) // @todo remove
  // start = performance.now()
  resumeStructIntegration(transaction, store);
  // console.log('time to integrate: ', performance.now() - start) // @todo remove
  // start = performance.now()
  cleanupPendingStructs(store.pendingClientsStructRefs);
  // console.log('time to cleanup: ', performance.now() - start) // @todo remove
  // start = performance.now()
  tryResumePendingDeleteReaders(transaction, store);
  // console.log('time to resume delete readers: ', performance.now() - start) // @todo remove
  // start = performance.now()
};

/**
 * Read and apply a document update.
 *
 * This function has the same effect as `applyUpdate` but accepts an decoder.
 *
 * @param {decoding.Decoder} decoder
 * @param {Doc} ydoc
 * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
 * @param {AbstractUpdateDecoder} [structDecoder]
 *
 * @function
 */
const readUpdateV2 = (decoder, ydoc, transactionOrigin, structDecoder = new UpdateDecoderV2(decoder)) =>
  transact(ydoc, transaction => {
    readStructs(structDecoder, transaction, ydoc.store);
    readAndApplyDeleteSet(structDecoder, transaction, ydoc.store);
  }, transactionOrigin, false);

/**
 * Read and apply a document update.
 *
 * This function has the same effect as `applyUpdate` but accepts an decoder.
 *
 * @param {decoding.Decoder} decoder
 * @param {Doc} ydoc
 * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
 *
 * @function
 */
const readUpdate = (decoder, ydoc, transactionOrigin) => readUpdateV2(decoder, ydoc, transactionOrigin, new DefaultUpdateDecoder(decoder));

/**
 * Apply a document update created by, for example, `y.on('update', update => ..)` or `update = encodeStateAsUpdate()`.
 *
 * This function has the same effect as `readUpdate` but accepts an Uint8Array instead of a Decoder.
 *
 * @param {Doc} ydoc
 * @param {Uint8Array} update
 * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
 * @param {typeof UpdateDecoderV1 | typeof UpdateDecoderV2} [YDecoder]
 *
 * @function
 */
const applyUpdateV2 = (ydoc, update, transactionOrigin, YDecoder = UpdateDecoderV2) => {
  const decoder = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["createDecoder"])(update);
  readUpdateV2(decoder, ydoc, transactionOrigin, new YDecoder(decoder));
};

/**
 * Apply a document update created by, for example, `y.on('update', update => ..)` or `update = encodeStateAsUpdate()`.
 *
 * This function has the same effect as `readUpdate` but accepts an Uint8Array instead of a Decoder.
 *
 * @param {Doc} ydoc
 * @param {Uint8Array} update
 * @param {any} [transactionOrigin] This will be stored on `transaction.origin` and `.on('update', (update, origin))`
 *
 * @function
 */
const applyUpdate = (ydoc, update, transactionOrigin) => applyUpdateV2(ydoc, update, transactionOrigin, DefaultUpdateDecoder);

/**
 * Write all the document as a single update message. If you specify the state of the remote client (`targetStateVector`) it will
 * only write the operations that are missing.
 *
 * @param {AbstractUpdateEncoder} encoder
 * @param {Doc} doc
 * @param {Map<number,number>} [targetStateVector] The state of the target that receives the update. Leave empty to write all known structs
 *
 * @function
 */
const writeStateAsUpdate = (encoder, doc, targetStateVector = new Map()) => {
  writeClientsStructs(encoder, doc.store, targetStateVector);
  writeDeleteSet(encoder, createDeleteSetFromStructStore(doc.store));
};

/**
 * Write all the document as a single update message that can be applied on the remote document. If you specify the state of the remote client (`targetState`) it will
 * only write the operations that are missing.
 *
 * Use `writeStateAsUpdate` instead if you are working with lib0/encoding.js#Encoder
 *
 * @param {Doc} doc
 * @param {Uint8Array} [encodedTargetStateVector] The state of the target that receives the update. Leave empty to write all known structs
 * @param {AbstractUpdateEncoder} [encoder]
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateAsUpdateV2 = (doc, encodedTargetStateVector, encoder = new UpdateEncoderV2()) => {
  const targetStateVector = encodedTargetStateVector == null ? new Map() : decodeStateVector(encodedTargetStateVector);
  writeStateAsUpdate(encoder, doc, targetStateVector);
  return encoder.toUint8Array()
};

/**
 * Write all the document as a single update message that can be applied on the remote document. If you specify the state of the remote client (`targetState`) it will
 * only write the operations that are missing.
 *
 * Use `writeStateAsUpdate` instead if you are working with lib0/encoding.js#Encoder
 *
 * @param {Doc} doc
 * @param {Uint8Array} [encodedTargetStateVector] The state of the target that receives the update. Leave empty to write all known structs
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateAsUpdate = (doc, encodedTargetStateVector) => encodeStateAsUpdateV2(doc, encodedTargetStateVector, new DefaultUpdateEncoder());

/**
 * Read state vector from Decoder and return as Map
 *
 * @param {AbstractDSDecoder} decoder
 * @return {Map<number,number>} Maps `client` to the number next expected `clock` from that client.
 *
 * @function
 */
const readStateVector = decoder => {
  const ss = new Map();
  const ssLength = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
  for (let i = 0; i < ssLength; i++) {
    const client = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
    const clock = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder.restDecoder);
    ss.set(client, clock);
  }
  return ss
};

/**
 * Read decodedState and return State as Map.
 *
 * @param {Uint8Array} decodedState
 * @return {Map<number,number>} Maps `client` to the number next expected `clock` from that client.
 *
 * @function
 */
const decodeStateVectorV2 = decodedState => readStateVector(new DSDecoderV2(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["createDecoder"])(decodedState)));

/**
 * Read decodedState and return State as Map.
 *
 * @param {Uint8Array} decodedState
 * @return {Map<number,number>} Maps `client` to the number next expected `clock` from that client.
 *
 * @function
 */
const decodeStateVector = decodedState => readStateVector(new DefaultDSDecoder(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["createDecoder"])(decodedState)));

/**
 * @param {AbstractDSEncoder} encoder
 * @param {Map<number,number>} sv
 * @function
 */
const writeStateVector = (encoder, sv) => {
  Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, sv.size);
  sv.forEach((clock, client) => {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, client); // @todo use a special client decoder that is based on mapping
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, clock);
  });
  return encoder
};

/**
 * @param {AbstractDSEncoder} encoder
 * @param {Doc} doc
 *
 * @function
 */
const writeDocumentStateVector = (encoder, doc) => writeStateVector(encoder, getStateVector(doc.store));

/**
 * Encode State as Uint8Array.
 *
 * @param {Doc} doc
 * @param {AbstractDSEncoder} [encoder]
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateVectorV2 = (doc, encoder = new DSEncoderV2()) => {
  writeDocumentStateVector(encoder, doc);
  return encoder.toUint8Array()
};

/**
 * Encode State as Uint8Array.
 *
 * @param {Doc} doc
 * @return {Uint8Array}
 *
 * @function
 */
const encodeStateVector = doc => encodeStateVectorV2(doc, new DefaultDSEncoder());

/**
 * General event handler implementation.
 *
 * @template ARG0, ARG1
 *
 * @private
 */
class EventHandler {
  constructor () {
    /**
     * @type {Array<function(ARG0, ARG1):void>}
     */
    this.l = [];
  }
}

/**
 * @template ARG0,ARG1
 * @returns {EventHandler<ARG0,ARG1>}
 *
 * @private
 * @function
 */
const createEventHandler = () => new EventHandler();

/**
 * Adds an event listener that is called when
 * {@link EventHandler#callEventListeners} is called.
 *
 * @template ARG0,ARG1
 * @param {EventHandler<ARG0,ARG1>} eventHandler
 * @param {function(ARG0,ARG1):void} f The event handler.
 *
 * @private
 * @function
 */
const addEventHandlerListener = (eventHandler, f) =>
  eventHandler.l.push(f);

/**
 * Removes an event listener.
 *
 * @template ARG0,ARG1
 * @param {EventHandler<ARG0,ARG1>} eventHandler
 * @param {function(ARG0,ARG1):void} f The event handler that was added with
 *                     {@link EventHandler#addEventListener}
 *
 * @private
 * @function
 */
const removeEventHandlerListener = (eventHandler, f) => {
  const l = eventHandler.l;
  const len = l.length;
  eventHandler.l = l.filter(g => f !== g);
  if (len === eventHandler.l.length) {
    console.error('[yjs] Tried to remove event handler that doesn\'t exist.');
  }
};

/**
 * Call all event listeners that were added via
 * {@link EventHandler#addEventListener}.
 *
 * @template ARG0,ARG1
 * @param {EventHandler<ARG0,ARG1>} eventHandler
 * @param {ARG0} arg0
 * @param {ARG1} arg1
 *
 * @private
 * @function
 */
const callEventHandlerListeners = (eventHandler, arg0, arg1) =>
  Object(lib0_function_js__WEBPACK_IMPORTED_MODULE_10__["callAll"])(eventHandler.l, [arg0, arg1]);

class ID {
  /**
   * @param {number} client client id
   * @param {number} clock unique per client id, continuous number
   */
  constructor (client, clock) {
    /**
     * Client id
     * @type {number}
     */
    this.client = client;
    /**
     * unique per client id, continuous number
     * @type {number}
     */
    this.clock = clock;
  }
}

/**
 * @param {ID | null} a
 * @param {ID | null} b
 * @return {boolean}
 *
 * @function
 */
const compareIDs = (a, b) => a === b || (a !== null && b !== null && a.client === b.client && a.clock === b.clock);

/**
 * @param {number} client
 * @param {number} clock
 *
 * @private
 * @function
 */
const createID = (client, clock) => new ID(client, clock);

/**
 * @param {encoding.Encoder} encoder
 * @param {ID} id
 *
 * @private
 * @function
 */
const writeID = (encoder, id) => {
  Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder, id.client);
  Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder, id.clock);
};

/**
 * Read ID.
 * * If first varUint read is 0xFFFFFF a RootID is returned.
 * * Otherwise an ID is returned
 *
 * @param {decoding.Decoder} decoder
 * @return {ID}
 *
 * @private
 * @function
 */
const readID = decoder =>
  createID(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder), Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder));

/**
 * The top types are mapped from y.share.get(keyname) => type.
 * `type` does not store any information about the `keyname`.
 * This function finds the correct `keyname` for `type` and throws otherwise.
 *
 * @param {AbstractType<any>} type
 * @return {string}
 *
 * @private
 * @function
 */
const findRootTypeKey = type => {
  // @ts-ignore _y must be defined, otherwise unexpected case
  for (const [key, value] of type.doc.share.entries()) {
    if (value === type) {
      return key
    }
  }
  throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["unexpectedCase"])()
};

/**
 * Check if `parent` is a parent of `child`.
 *
 * @param {AbstractType<any>} parent
 * @param {Item|null} child
 * @return {Boolean} Whether `parent` is a parent of `child`.
 *
 * @private
 * @function
 */
const isParentOf = (parent, child) => {
  while (child !== null) {
    if (child.parent === parent) {
      return true
    }
    child = /** @type {AbstractType<any>} */ (child.parent)._item;
  }
  return false
};

/**
 * Convenient helper to log type information.
 *
 * Do not use in productive systems as the output can be immense!
 *
 * @param {AbstractType<any>} type
 */
const logType = type => {
  const res = [];
  let n = type._start;
  while (n) {
    res.push(n);
    n = n.right;
  }
  console.log('Children: ', res);
  console.log('Children content: ', res.filter(m => !m.deleted).map(m => m.content));
};

class PermanentUserData {
  /**
   * @param {Doc} doc
   * @param {YMap<any>} [storeType]
   */
  constructor (doc, storeType = doc.getMap('users')) {
    /**
     * @type {Map<string,DeleteSet>}
     */
    const dss = new Map();
    this.yusers = storeType;
    this.doc = doc;
    /**
     * Maps from clientid to userDescription
     *
     * @type {Map<number,string>}
     */
    this.clients = new Map();
    this.dss = dss;
    /**
     * @param {YMap<any>} user
     * @param {string} userDescription
     */
    const initUser = (user, userDescription) => {
      /**
       * @type {YArray<Uint8Array>}
       */
      const ds = user.get('ds');
      const ids = user.get('ids');
      const addClientId = /** @param {number} clientid */ clientid => this.clients.set(clientid, userDescription);
      ds.observe(/** @param {YArrayEvent<any>} event */ event => {
        event.changes.added.forEach(item => {
          item.content.getContent().forEach(encodedDs => {
            if (encodedDs instanceof Uint8Array) {
              this.dss.set(userDescription, mergeDeleteSets([this.dss.get(userDescription) || createDeleteSet(), readDeleteSet(new DSDecoderV1(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["createDecoder"])(encodedDs)))]));
            }
          });
        });
      });
      this.dss.set(userDescription, mergeDeleteSets(ds.map(encodedDs => readDeleteSet(new DSDecoderV1(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["createDecoder"])(encodedDs))))));
      ids.observe(/** @param {YArrayEvent<any>} event */ event =>
        event.changes.added.forEach(item => item.content.getContent().forEach(addClientId))
      );
      ids.forEach(addClientId);
    };
    // observe users
    storeType.observe(event => {
      event.keysChanged.forEach(userDescription =>
        initUser(storeType.get(userDescription), userDescription)
      );
    });
    // add intial data
    storeType.forEach(initUser);
  }

  /**
   * @param {Doc} doc
   * @param {number} clientid
   * @param {string} userDescription
   * @param {Object} [conf]
   * @param {function(Transaction, DeleteSet):boolean} [conf.filter]
   */
  setUserMapping (doc, clientid, userDescription, { filter = () => true } = {}) {
    const users = this.yusers;
    let user = users.get(userDescription);
    if (!user) {
      user = new YMap();
      user.set('ids', new YArray());
      user.set('ds', new YArray());
      users.set(userDescription, user);
    }
    user.get('ids').push([clientid]);
    users.observe(event => {
      setTimeout(() => {
        const userOverwrite = users.get(userDescription);
        if (userOverwrite !== user) {
          // user was overwritten, port all data over to the next user object
          // @todo Experiment with Y.Sets here
          user = userOverwrite;
          // @todo iterate over old type
          this.clients.forEach((_userDescription, clientid) => {
            if (userDescription === _userDescription) {
              user.get('ids').push([clientid]);
            }
          });
          const encoder = new DSEncoderV1();
          const ds = this.dss.get(userDescription);
          if (ds) {
            writeDeleteSet(encoder, ds);
            user.get('ds').push([encoder.toUint8Array()]);
          }
        }
      }, 0);
    });
    doc.on('afterTransaction', /** @param {Transaction} transaction */ transaction => {
      setTimeout(() => {
        const yds = user.get('ds');
        const ds = transaction.deleteSet;
        if (transaction.local && ds.clients.size > 0 && filter(transaction, ds)) {
          const encoder = new DSEncoderV1();
          writeDeleteSet(encoder, ds);
          yds.push([encoder.toUint8Array()]);
        }
      });
    });
  }

  /**
   * @param {number} clientid
   * @return {any}
   */
  getUserByClientId (clientid) {
    return this.clients.get(clientid) || null
  }

  /**
   * @param {ID} id
   * @return {string | null}
   */
  getUserByDeletedId (id) {
    for (const [userDescription, ds] of this.dss.entries()) {
      if (isDeleted(ds, id)) {
        return userDescription
      }
    }
    return null
  }
}

/**
 * A relative position is based on the Yjs model and is not affected by document changes.
 * E.g. If you place a relative position before a certain character, it will always point to this character.
 * If you place a relative position at the end of a type, it will always point to the end of the type.
 *
 * A numeric position is often unsuited for user selections, because it does not change when content is inserted
 * before or after.
 *
 * ```Insert(0, 'x')('a|bc') = 'xa|bc'``` Where | is the relative position.
 *
 * One of the properties must be defined.
 *
 * @example
 *   // Current cursor position is at position 10
 *   const relativePosition = createRelativePositionFromIndex(yText, 10)
 *   // modify yText
 *   yText.insert(0, 'abc')
 *   yText.delete(3, 10)
 *   // Compute the cursor position
 *   const absolutePosition = createAbsolutePositionFromRelativePosition(y, relativePosition)
 *   absolutePosition.type === yText // => true
 *   console.log('cursor location is ' + absolutePosition.index) // => cursor location is 3
 *
 */
class RelativePosition {
  /**
   * @param {ID|null} type
   * @param {string|null} tname
   * @param {ID|null} item
   */
  constructor (type, tname, item) {
    /**
     * @type {ID|null}
     */
    this.type = type;
    /**
     * @type {string|null}
     */
    this.tname = tname;
    /**
     * @type {ID | null}
     */
    this.item = item;
  }
}

/**
 * @param {any} json
 * @return {RelativePosition}
 *
 * @function
 */
const createRelativePositionFromJSON = json => new RelativePosition(json.type == null ? null : createID(json.type.client, json.type.clock), json.tname || null, json.item == null ? null : createID(json.item.client, json.item.clock));

class AbsolutePosition {
  /**
   * @param {AbstractType<any>} type
   * @param {number} index
   */
  constructor (type, index) {
    /**
     * @type {AbstractType<any>}
     */
    this.type = type;
    /**
     * @type {number}
     */
    this.index = index;
  }
}

/**
 * @param {AbstractType<any>} type
 * @param {number} index
 *
 * @function
 */
const createAbsolutePosition = (type, index) => new AbsolutePosition(type, index);

/**
 * @param {AbstractType<any>} type
 * @param {ID|null} item
 *
 * @function
 */
const createRelativePosition = (type, item) => {
  let typeid = null;
  let tname = null;
  if (type._item === null) {
    tname = findRootTypeKey(type);
  } else {
    typeid = createID(type._item.id.client, type._item.id.clock);
  }
  return new RelativePosition(typeid, tname, item)
};

/**
 * Create a relativePosition based on a absolute position.
 *
 * @param {AbstractType<any>} type The base type (e.g. YText or YArray).
 * @param {number} index The absolute position.
 * @return {RelativePosition}
 *
 * @function
 */
const createRelativePositionFromTypeIndex = (type, index) => {
  let t = type._start;
  while (t !== null) {
    if (!t.deleted && t.countable) {
      if (t.length > index) {
        // case 1: found position somewhere in the linked list
        return createRelativePosition(type, createID(t.id.client, t.id.clock + index))
      }
      index -= t.length;
    }
    t = t.right;
  }
  return createRelativePosition(type, null)
};

/**
 * @param {encoding.Encoder} encoder
 * @param {RelativePosition} rpos
 *
 * @function
 */
const writeRelativePosition = (encoder, rpos) => {
  const { type, tname, item } = rpos;
  if (item !== null) {
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder, 0);
    writeID(encoder, item);
  } else if (tname !== null) {
    // case 2: found position at the end of the list and type is stored in y.share
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeUint8"])(encoder, 1);
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarString"])(encoder, tname);
  } else if (type !== null) {
    // case 3: found position at the end of the list and type is attached to an item
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeUint8"])(encoder, 2);
    writeID(encoder, type);
  } else {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["unexpectedCase"])()
  }
  return encoder
};

/**
 * @param {decoding.Decoder} decoder
 * @return {RelativePosition|null}
 *
 * @function
 */
const readRelativePosition = decoder => {
  let type = null;
  let tname = null;
  let itemID = null;
  switch (Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarUint"])(decoder)) {
    case 0:
      // case 1: found position somewhere in the linked list
      itemID = readID(decoder);
      break
    case 1:
      // case 2: found position at the end of the list and type is stored in y.share
      tname = Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["readVarString"])(decoder);
      break
    case 2: {
      // case 3: found position at the end of the list and type is attached to an item
      type = readID(decoder);
    }
  }
  return new RelativePosition(type, tname, itemID)
};

/**
 * @param {RelativePosition} rpos
 * @param {Doc} doc
 * @return {AbsolutePosition|null}
 *
 * @function
 */
const createAbsolutePositionFromRelativePosition = (rpos, doc) => {
  const store = doc.store;
  const rightID = rpos.item;
  const typeID = rpos.type;
  const tname = rpos.tname;
  let type = null;
  let index = 0;
  if (rightID !== null) {
    if (getState(store, rightID.client) <= rightID.clock) {
      return null
    }
    const res = followRedone(store, rightID);
    const right = res.item;
    if (!(right instanceof Item)) {
      return null
    }
    type = /** @type {AbstractType<any>} */ (right.parent);
    if (type._item === null || !type._item.deleted) {
      index = right.deleted || !right.countable ? 0 : res.diff;
      let n = right.left;
      while (n !== null) {
        if (!n.deleted && n.countable) {
          index += n.length;
        }
        n = n.left;
      }
    }
  } else {
    if (tname !== null) {
      type = doc.get(tname);
    } else if (typeID !== null) {
      if (getState(store, typeID.client) <= typeID.clock) {
        // type does not exist yet
        return null
      }
      const { item } = followRedone(store, typeID);
      if (item instanceof Item && item.content instanceof ContentType) {
        type = item.content.type;
      } else {
        // struct is garbage collected
        return null
      }
    } else {
      throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["unexpectedCase"])()
    }
    index = type._length;
  }
  return createAbsolutePosition(type, index)
};

/**
 * @param {RelativePosition|null} a
 * @param {RelativePosition|null} b
 * @return {boolean}
 *
 * @function
 */
const compareRelativePositions = (a, b) => a === b || (
  a !== null && b !== null && a.tname === b.tname && compareIDs(a.item, b.item) && compareIDs(a.type, b.type)
);

class Snapshot {
  /**
   * @param {DeleteSet} ds
   * @param {Map<number,number>} sv state map
   */
  constructor (ds, sv) {
    /**
     * @type {DeleteSet}
     */
    this.ds = ds;
    /**
     * State Map
     * @type {Map<number,number>}
     */
    this.sv = sv;
  }
}

/**
 * @param {Snapshot} snap1
 * @param {Snapshot} snap2
 * @return {boolean}
 */
const equalSnapshots = (snap1, snap2) => {
  const ds1 = snap1.ds.clients;
  const ds2 = snap2.ds.clients;
  const sv1 = snap1.sv;
  const sv2 = snap2.sv;
  if (sv1.size !== sv2.size || ds1.size !== ds2.size) {
    return false
  }
  for (const [key, value] of sv1.entries()) {
    if (sv2.get(key) !== value) {
      return false
    }
  }
  for (const [client, dsitems1] of ds1.entries()) {
    const dsitems2 = ds2.get(client) || [];
    if (dsitems1.length !== dsitems2.length) {
      return false
    }
    for (let i = 0; i < dsitems1.length; i++) {
      const dsitem1 = dsitems1[i];
      const dsitem2 = dsitems2[i];
      if (dsitem1.clock !== dsitem2.clock || dsitem1.len !== dsitem2.len) {
        return false
      }
    }
  }
  return true
};

/**
 * @param {Snapshot} snapshot
 * @param {AbstractDSEncoder} [encoder]
 * @return {Uint8Array}
 */
const encodeSnapshotV2 = (snapshot, encoder = new DSEncoderV2()) => {
  writeDeleteSet(encoder, snapshot.ds);
  writeStateVector(encoder, snapshot.sv);
  return encoder.toUint8Array()
};

/**
 * @param {Snapshot} snapshot
 * @return {Uint8Array}
 */
const encodeSnapshot = snapshot => encodeSnapshotV2(snapshot, new DefaultDSEncoder());

/**
 * @param {Uint8Array} buf
 * @param {AbstractDSDecoder} [decoder]
 * @return {Snapshot}
 */
const decodeSnapshotV2 = (buf, decoder = new DSDecoderV2(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["createDecoder"])(buf))) => {
  return new Snapshot(readDeleteSet(decoder), readStateVector(decoder))
};

/**
 * @param {Uint8Array} buf
 * @return {Snapshot}
 */
const decodeSnapshot = buf => decodeSnapshotV2(buf, new DSDecoderV1(Object(lib0_decoding_js__WEBPACK_IMPORTED_MODULE_5__["createDecoder"])(buf)));

/**
 * @param {DeleteSet} ds
 * @param {Map<number,number>} sm
 * @return {Snapshot}
 */
const createSnapshot = (ds, sm) => new Snapshot(ds, sm);

const emptySnapshot = createSnapshot(createDeleteSet(), new Map());

/**
 * @param {Doc} doc
 * @return {Snapshot}
 */
const snapshot = doc => createSnapshot(createDeleteSetFromStructStore(doc.store), getStateVector(doc.store));

/**
 * @param {Item} item
 * @param {Snapshot|undefined} snapshot
 *
 * @protected
 * @function
 */
const isVisible = (item, snapshot) => snapshot === undefined ? !item.deleted : (
  snapshot.sv.has(item.id.client) && (snapshot.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot.ds, item.id)
);

/**
 * @param {Transaction} transaction
 * @param {Snapshot} snapshot
 */
const splitSnapshotAffectedStructs = (transaction, snapshot) => {
  const meta = Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["setIfUndefined"])(transaction.meta, splitSnapshotAffectedStructs, lib0_set_js__WEBPACK_IMPORTED_MODULE_11__["create"]);
  const store = transaction.doc.store;
  // check if we already split for this snapshot
  if (!meta.has(snapshot)) {
    snapshot.sv.forEach((clock, client) => {
      if (clock < getState(store, client)) {
        getItemCleanStart(transaction, createID(client, clock));
      }
    });
    iterateDeletedStructs(transaction, snapshot.ds, item => {});
    meta.add(snapshot);
  }
};

/**
 * @param {Doc} originDoc
 * @param {Snapshot} snapshot
 * @param {Doc} [newDoc] Optionally, you may define the Yjs document that receives the data from originDoc
 * @return {Doc}
 */
const createDocFromSnapshot = (originDoc, snapshot, newDoc = new Doc()) => {
  if (originDoc.gc) {
    // we should not try to restore a GC-ed document, because some of the restored items might have their content deleted
    throw new Error('originDoc must not be garbage collected')
  }
  const { sv, ds } = snapshot;

  const encoder = new UpdateEncoderV2();
  originDoc.transact(transaction => {
    let size = 0;
    sv.forEach(clock => {
      if (clock > 0) {
        size++;
      }
    });
    Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, size);
    // splitting the structs before writing them to the encoder
    for (const [client, clock] of sv) {
      if (clock === 0) {
        continue
      }
      if (clock < getState(originDoc.store, client)) {
        getItemCleanStart(transaction, createID(client, clock));
      }
      const structs = originDoc.store.clients.get(client) || [];
      const lastStructIndex = findIndexSS(structs, clock - 1);
      // write # encoded structs
      Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, lastStructIndex + 1);
      encoder.writeClient(client);
      // first clock written is 0
      Object(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_4__["writeVarUint"])(encoder.restEncoder, 0);
      for (let i = 0; i <= lastStructIndex; i++) {
        structs[i].write(encoder, 0);
      }
    }
    writeDeleteSet(encoder, ds);
  });

  applyUpdateV2(newDoc, encoder.toUint8Array(), 'snapshot');
  return newDoc
};

class StructStore {
  constructor () {
    /**
     * @type {Map<number,Array<GC|Item>>}
     */
    this.clients = new Map();
    /**
     * Store incompleted struct reads here
     * `i` denotes to the next read operation
     * We could shift the array of refs instead, but shift is incredible
     * slow in Chrome for arrays with more than 100k elements
     * @see tryResumePendingStructRefs
     * @type {Map<number,{i:number,refs:Array<GC|Item>}>}
     */
    this.pendingClientsStructRefs = new Map();
    /**
     * Stack of pending structs waiting for struct dependencies
     * Maximum length of stack is structReaders.size
     * @type {Array<GC|Item>}
     */
    this.pendingStack = [];
    /**
     * @type {Array<DSDecoderV2>}
     */
    this.pendingDeleteReaders = [];
  }
}

/**
 * Return the states as a Map<client,clock>.
 * Note that clock refers to the next expected clock id.
 *
 * @param {StructStore} store
 * @return {Map<number,number>}
 *
 * @public
 * @function
 */
const getStateVector = store => {
  const sm = new Map();
  store.clients.forEach((structs, client) => {
    const struct = structs[structs.length - 1];
    sm.set(client, struct.id.clock + struct.length);
  });
  return sm
};

/**
 * @param {StructStore} store
 * @param {number} client
 * @return {number}
 *
 * @public
 * @function
 */
const getState = (store, client) => {
  const structs = store.clients.get(client);
  if (structs === undefined) {
    return 0
  }
  const lastStruct = structs[structs.length - 1];
  return lastStruct.id.clock + lastStruct.length
};

/**
 * @param {StructStore} store
 * @param {GC|Item} struct
 *
 * @private
 * @function
 */
const addStruct = (store, struct) => {
  let structs = store.clients.get(struct.id.client);
  if (structs === undefined) {
    structs = [];
    store.clients.set(struct.id.client, structs);
  } else {
    const lastStruct = structs[structs.length - 1];
    if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
      throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["unexpectedCase"])()
    }
  }
  structs.push(struct);
};

/**
 * Perform a binary search on a sorted array
 * @param {Array<Item|GC>} structs
 * @param {number} clock
 * @return {number}
 *
 * @private
 * @function
 */
const findIndexSS = (structs, clock) => {
  let left = 0;
  let right = structs.length - 1;
  let mid = structs[right];
  let midclock = mid.id.clock;
  if (midclock === clock) {
    return right
  }
  // @todo does it even make sense to pivot the search?
  // If a good split misses, it might actually increase the time to find the correct item.
  // Currently, the only advantage is that search with pivoting might find the item on the first try.
  let midindex = Object(lib0_math_js__WEBPACK_IMPORTED_MODULE_2__["floor"])((clock / (midclock + mid.length - 1)) * right); // pivoting the search
  while (left <= right) {
    mid = structs[midindex];
    midclock = mid.id.clock;
    if (midclock <= clock) {
      if (clock < midclock + mid.length) {
        return midindex
      }
      left = midindex + 1;
    } else {
      right = midindex - 1;
    }
    midindex = Object(lib0_math_js__WEBPACK_IMPORTED_MODULE_2__["floor"])((left + right) / 2);
  }
  // Always check state before looking for a struct in StructStore
  // Therefore the case of not finding a struct is unexpected
  throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["unexpectedCase"])()
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 *
 * @param {StructStore} store
 * @param {ID} id
 * @return {GC|Item}
 *
 * @private
 * @function
 */
const find = (store, id) => {
  /**
   * @type {Array<GC|Item>}
   */
  // @ts-ignore
  const structs = store.clients.get(id.client);
  return structs[findIndexSS(structs, id.clock)]
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 * @private
 * @function
 */
const getItem = /** @type {function(StructStore,ID):Item} */ (find);

/**
 * @param {Transaction} transaction
 * @param {Array<Item|GC>} structs
 * @param {number} clock
 */
const findIndexCleanStart = (transaction, structs, clock) => {
  const index = findIndexSS(structs, clock);
  const struct = structs[index];
  if (struct.id.clock < clock && struct instanceof Item) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
    return index + 1
  }
  return index
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 *
 * @param {Transaction} transaction
 * @param {ID} id
 * @return {Item}
 *
 * @private
 * @function
 */
const getItemCleanStart = (transaction, id) => {
  const structs = /** @type {Array<Item>} */ (transaction.doc.store.clients.get(id.client));
  return structs[findIndexCleanStart(transaction, structs, id.clock)]
};

/**
 * Expects that id is actually in store. This function throws or is an infinite loop otherwise.
 *
 * @param {Transaction} transaction
 * @param {StructStore} store
 * @param {ID} id
 * @return {Item}
 *
 * @private
 * @function
 */
const getItemCleanEnd = (transaction, store, id) => {
  /**
   * @type {Array<Item>}
   */
  // @ts-ignore
  const structs = store.clients.get(id.client);
  const index = findIndexSS(structs, id.clock);
  const struct = structs[index];
  if (id.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
    structs.splice(index + 1, 0, splitItem(transaction, struct, id.clock - struct.id.clock + 1));
  }
  return struct
};

/**
 * Replace `item` with `newitem` in store
 * @param {StructStore} store
 * @param {GC|Item} struct
 * @param {GC|Item} newStruct
 *
 * @private
 * @function
 */
const replaceStruct = (store, struct, newStruct) => {
  const structs = /** @type {Array<GC|Item>} */ (store.clients.get(struct.id.client));
  structs[findIndexSS(structs, struct.id.clock)] = newStruct;
};

/**
 * Iterate over a range of structs
 *
 * @param {Transaction} transaction
 * @param {Array<Item|GC>} structs
 * @param {number} clockStart Inclusive start
 * @param {number} len
 * @param {function(GC|Item):void} f
 *
 * @function
 */
const iterateStructs = (transaction, structs, clockStart, len, f) => {
  if (len === 0) {
    return
  }
  const clockEnd = clockStart + len;
  let index = findIndexCleanStart(transaction, structs, clockStart);
  let struct;
  do {
    struct = structs[index++];
    if (clockEnd < struct.id.clock + struct.length) {
      findIndexCleanStart(transaction, structs, clockEnd);
    }
    f(struct);
  } while (index < structs.length && structs[index].id.clock < clockEnd)
};

/**
 * A transaction is created for every change on the Yjs model. It is possible
 * to bundle changes on the Yjs model in a single transaction to
 * minimize the number on messages sent and the number of observer calls.
 * If possible the user of this library should bundle as many changes as
 * possible. Here is an example to illustrate the advantages of bundling:
 *
 * @example
 * const map = y.define('map', YMap)
 * // Log content when change is triggered
 * map.observe(() => {
 *   console.log('change triggered')
 * })
 * // Each change on the map type triggers a log message:
 * map.set('a', 0) // => "change triggered"
 * map.set('b', 0) // => "change triggered"
 * // When put in a transaction, it will trigger the log after the transaction:
 * y.transact(() => {
 *   map.set('a', 1)
 *   map.set('b', 1)
 * }) // => "change triggered"
 *
 * @public
 */
class Transaction {
  /**
   * @param {Doc} doc
   * @param {any} origin
   * @param {boolean} local
   */
  constructor (doc, origin, local) {
    /**
     * The Yjs instance.
     * @type {Doc}
     */
    this.doc = doc;
    /**
     * Describes the set of deleted items by ids
     * @type {DeleteSet}
     */
    this.deleteSet = new DeleteSet();
    /**
     * Holds the state before the transaction started.
     * @type {Map<Number,Number>}
     */
    this.beforeState = getStateVector(doc.store);
    /**
     * Holds the state after the transaction.
     * @type {Map<Number,Number>}
     */
    this.afterState = new Map();
    /**
     * All types that were directly modified (property added or child
     * inserted/deleted). New types are not included in this Set.
     * Maps from type to parentSubs (`item.parentSub = null` for YArray)
     * @type {Map<AbstractType<YEvent>,Set<String|null>>}
     */
    this.changed = new Map();
    /**
     * Stores the events for the types that observe also child elements.
     * It is mainly used by `observeDeep`.
     * @type {Map<AbstractType<YEvent>,Array<YEvent>>}
     */
    this.changedParentTypes = new Map();
    /**
     * @type {Array<AbstractStruct>}
     */
    this._mergeStructs = [];
    /**
     * @type {any}
     */
    this.origin = origin;
    /**
     * Stores meta information on the transaction
     * @type {Map<any,any>}
     */
    this.meta = new Map();
    /**
     * Whether this change originates from this doc.
     * @type {boolean}
     */
    this.local = local;
    /**
     * @type {Set<Doc>}
     */
    this.subdocsAdded = new Set();
    /**
     * @type {Set<Doc>}
     */
    this.subdocsRemoved = new Set();
    /**
     * @type {Set<Doc>}
     */
    this.subdocsLoaded = new Set();
  }
}

/**
 * @param {AbstractUpdateEncoder} encoder
 * @param {Transaction} transaction
 * @return {boolean} Whether data was written.
 */
const writeUpdateMessageFromTransaction = (encoder, transaction) => {
  if (transaction.deleteSet.clients.size === 0 && !Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["any"])(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
    return false
  }
  sortAndMergeDeleteSet(transaction.deleteSet);
  writeStructsFromTransaction(encoder, transaction);
  writeDeleteSet(encoder, transaction.deleteSet);
  return true
};

/**
 * If `type.parent` was added in current transaction, `type` technically
 * did not change, it was just added and we should not fire events for `type`.
 *
 * @param {Transaction} transaction
 * @param {AbstractType<YEvent>} type
 * @param {string|null} parentSub
 */
const addChangedTypeToTransaction = (transaction, type, parentSub) => {
  const item = type._item;
  if (item === null || (item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted)) {
    Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["setIfUndefined"])(transaction.changed, type, lib0_set_js__WEBPACK_IMPORTED_MODULE_11__["create"]).add(parentSub);
  }
};

/**
 * @param {Array<AbstractStruct>} structs
 * @param {number} pos
 */
const tryToMergeWithLeft = (structs, pos) => {
  const left = structs[pos - 1];
  const right = structs[pos];
  if (left.deleted === right.deleted && left.constructor === right.constructor) {
    if (left.mergeWith(right)) {
      structs.splice(pos, 1);
      if (right instanceof Item && right.parentSub !== null && /** @type {AbstractType<any>} */ (right.parent)._map.get(right.parentSub) === right) {
        /** @type {AbstractType<any>} */ (right.parent)._map.set(right.parentSub, /** @type {Item} */ (left));
      }
    }
  }
};

/**
 * @param {DeleteSet} ds
 * @param {StructStore} store
 * @param {function(Item):boolean} gcFilter
 */
const tryGcDeleteSet = (ds, store, gcFilter) => {
  for (const [client, deleteItems] of ds.clients.entries()) {
    const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      const endDeleteItemClock = deleteItem.clock + deleteItem.len;
      for (
        let si = findIndexSS(structs, deleteItem.clock), struct = structs[si];
        si < structs.length && struct.id.clock < endDeleteItemClock;
        struct = structs[++si]
      ) {
        const struct = structs[si];
        if (deleteItem.clock + deleteItem.len <= struct.id.clock) {
          break
        }
        if (struct instanceof Item && struct.deleted && !struct.keep && gcFilter(struct)) {
          struct.gc(store, false);
        }
      }
    }
  }
};

/**
 * @param {DeleteSet} ds
 * @param {StructStore} store
 */
const tryMergeDeleteSet = (ds, store) => {
  // try to merge deleted / gc'd items
  // merge from right to left for better efficiecy and so we don't miss any merge targets
  ds.clients.forEach((deleteItems, client) => {
    const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
    for (let di = deleteItems.length - 1; di >= 0; di--) {
      const deleteItem = deleteItems[di];
      // start with merging the item next to the last deleted item
      const mostRightIndexToCheck = Object(lib0_math_js__WEBPACK_IMPORTED_MODULE_2__["min"])(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
      for (
        let si = mostRightIndexToCheck, struct = structs[si];
        si > 0 && struct.id.clock >= deleteItem.clock;
        struct = structs[--si]
      ) {
        tryToMergeWithLeft(structs, si);
      }
    }
  });
};

/**
 * @param {DeleteSet} ds
 * @param {StructStore} store
 * @param {function(Item):boolean} gcFilter
 */
const tryGc = (ds, store, gcFilter) => {
  tryGcDeleteSet(ds, store, gcFilter);
  tryMergeDeleteSet(ds, store);
};

/**
 * @param {Array<Transaction>} transactionCleanups
 * @param {number} i
 */
const cleanupTransactions = (transactionCleanups, i) => {
  if (i < transactionCleanups.length) {
    const transaction = transactionCleanups[i];
    const doc = transaction.doc;
    const store = doc.store;
    const ds = transaction.deleteSet;
    const mergeStructs = transaction._mergeStructs;
    try {
      sortAndMergeDeleteSet(ds);
      transaction.afterState = getStateVector(transaction.doc.store);
      doc._transaction = null;
      doc.emit('beforeObserverCalls', [transaction, doc]);
      /**
       * An array of event callbacks.
       *
       * Each callback is called even if the other ones throw errors.
       *
       * @type {Array<function():void>}
       */
      const fs = [];
      // observe events on changed types
      transaction.changed.forEach((subs, itemtype) =>
        fs.push(() => {
          if (itemtype._item === null || !itemtype._item.deleted) {
            itemtype._callObserver(transaction, subs);
          }
        })
      );
      fs.push(() => {
        // deep observe events
        transaction.changedParentTypes.forEach((events, type) =>
          fs.push(() => {
            // We need to think about the possibility that the user transforms the
            // Y.Doc in the event.
            if (type._item === null || !type._item.deleted) {
              events = events
                .filter(event =>
                  event.target._item === null || !event.target._item.deleted
                );
              events
                .forEach(event => {
                  event.currentTarget = type;
                });
              // sort events by path length so that top-level events are fired first.
              events
                .sort((event1, event2) => event1.path.length - event2.path.length);
              // We don't need to check for events.length
              // because we know it has at least one element
              callEventHandlerListeners(type._dEH, events, transaction);
            }
          })
        );
        fs.push(() => doc.emit('afterTransaction', [transaction, doc]));
      });
      Object(lib0_function_js__WEBPACK_IMPORTED_MODULE_10__["callAll"])(fs, []);
    } finally {
      // Replace deleted items with ItemDeleted / GC.
      // This is where content is actually remove from the Yjs Doc.
      if (doc.gc) {
        tryGcDeleteSet(ds, store, doc.gcFilter);
      }
      tryMergeDeleteSet(ds, store);

      // on all affected store.clients props, try to merge
      transaction.afterState.forEach((clock, client) => {
        const beforeClock = transaction.beforeState.get(client) || 0;
        if (beforeClock !== clock) {
          const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
          // we iterate from right to left so we can safely remove entries
          const firstChangePos = Object(lib0_math_js__WEBPACK_IMPORTED_MODULE_2__["max"])(findIndexSS(structs, beforeClock), 1);
          for (let i = structs.length - 1; i >= firstChangePos; i--) {
            tryToMergeWithLeft(structs, i);
          }
        }
      });
      // try to merge mergeStructs
      // @todo: it makes more sense to transform mergeStructs to a DS, sort it, and merge from right to left
      //        but at the moment DS does not handle duplicates
      for (let i = 0; i < mergeStructs.length; i++) {
        const { client, clock } = mergeStructs[i].id;
        const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
        const replacedStructPos = findIndexSS(structs, clock);
        if (replacedStructPos + 1 < structs.length) {
          tryToMergeWithLeft(structs, replacedStructPos + 1);
        }
        if (replacedStructPos > 0) {
          tryToMergeWithLeft(structs, replacedStructPos);
        }
      }
      if (!transaction.local && transaction.afterState.get(doc.clientID) !== transaction.beforeState.get(doc.clientID)) {
        doc.clientID = generateNewClientId();
        Object(lib0_logging_js__WEBPACK_IMPORTED_MODULE_12__["print"])(lib0_logging_js__WEBPACK_IMPORTED_MODULE_12__["ORANGE"], lib0_logging_js__WEBPACK_IMPORTED_MODULE_12__["BOLD"], '[yjs] ', lib0_logging_js__WEBPACK_IMPORTED_MODULE_12__["UNBOLD"], lib0_logging_js__WEBPACK_IMPORTED_MODULE_12__["RED"], 'Changed the client-id because another client seems to be using it.');
      }
      // @todo Merge all the transactions into one and provide send the data as a single update message
      doc.emit('afterTransactionCleanup', [transaction, doc]);
      if (doc._observers.has('update')) {
        const encoder = new DefaultUpdateEncoder();
        const hasContent = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent) {
          doc.emit('update', [encoder.toUint8Array(), transaction.origin, doc]);
        }
      }
      if (doc._observers.has('updateV2')) {
        const encoder = new UpdateEncoderV2();
        const hasContent = writeUpdateMessageFromTransaction(encoder, transaction);
        if (hasContent) {
          doc.emit('updateV2', [encoder.toUint8Array(), transaction.origin, doc]);
        }
      }
      transaction.subdocsAdded.forEach(subdoc => doc.subdocs.add(subdoc));
      transaction.subdocsRemoved.forEach(subdoc => doc.subdocs.delete(subdoc));

      doc.emit('subdocs', [{ loaded: transaction.subdocsLoaded, added: transaction.subdocsAdded, removed: transaction.subdocsRemoved }]);
      transaction.subdocsRemoved.forEach(subdoc => subdoc.destroy());

      if (transactionCleanups.length <= i + 1) {
        doc._transactionCleanups = [];
        doc.emit('afterAllTransactions', [doc, transactionCleanups]);
      } else {
        cleanupTransactions(transactionCleanups, i + 1);
      }
    }
  }
};

/**
 * Implements the functionality of `y.transact(()=>{..})`
 *
 * @param {Doc} doc
 * @param {function(Transaction):void} f
 * @param {any} [origin=true]
 *
 * @function
 */
const transact = (doc, f, origin = null, local = true) => {
  const transactionCleanups = doc._transactionCleanups;
  let initialCall = false;
  if (doc._transaction === null) {
    initialCall = true;
    doc._transaction = new Transaction(doc, origin, local);
    transactionCleanups.push(doc._transaction);
    if (transactionCleanups.length === 1) {
      doc.emit('beforeAllTransactions', [doc]);
    }
    doc.emit('beforeTransaction', [doc._transaction, doc]);
  }
  try {
    f(doc._transaction);
  } finally {
    if (initialCall && transactionCleanups[0] === doc._transaction) {
      // The first transaction ended, now process observer calls.
      // Observer call may create new transactions for which we need to call the observers and do cleanup.
      // We don't want to nest these calls, so we execute these calls one after
      // another.
      // Also we need to ensure that all cleanups are called, even if the
      // observes throw errors.
      // This file is full of hacky try {} finally {} blocks to ensure that an
      // event can throw errors and also that the cleanup is called.
      cleanupTransactions(transactionCleanups, 0);
    }
  }
};

class StackItem {
  /**
   * @param {DeleteSet} ds
   * @param {Map<number,number>} beforeState
   * @param {Map<number,number>} afterState
   */
  constructor (ds, beforeState, afterState) {
    this.ds = ds;
    this.beforeState = beforeState;
    this.afterState = afterState;
    /**
     * Use this to save and restore metadata like selection range
     */
    this.meta = new Map();
  }
}

/**
 * @param {UndoManager} undoManager
 * @param {Array<StackItem>} stack
 * @param {string} eventType
 * @return {StackItem?}
 */
const popStackItem = (undoManager, stack, eventType) => {
  /**
   * Whether a change happened
   * @type {StackItem?}
   */
  let result = null;
  const doc = undoManager.doc;
  const scope = undoManager.scope;
  transact(doc, transaction => {
    while (stack.length > 0 && result === null) {
      const store = doc.store;
      const stackItem = /** @type {StackItem} */ (stack.pop());
      /**
       * @type {Set<Item>}
       */
      const itemsToRedo = new Set();
      /**
       * @type {Array<Item>}
       */
      const itemsToDelete = [];
      let performedChange = false;
      stackItem.afterState.forEach((endClock, client) => {
        const startClock = stackItem.beforeState.get(client) || 0;
        const len = endClock - startClock;
        // @todo iterateStructs should not need the structs parameter
        const structs = /** @type {Array<GC|Item>} */ (store.clients.get(client));
        if (startClock !== endClock) {
          // make sure structs don't overlap with the range of created operations [stackItem.start, stackItem.start + stackItem.end)
          // this must be executed before deleted structs are iterated.
          getItemCleanStart(transaction, createID(client, startClock));
          if (endClock < getState(doc.store, client)) {
            getItemCleanStart(transaction, createID(client, endClock));
          }
          iterateStructs(transaction, structs, startClock, len, struct => {
            if (struct instanceof Item) {
              if (struct.redone !== null) {
                let { item, diff } = followRedone(store, struct.id);
                if (diff > 0) {
                  item = getItemCleanStart(transaction, createID(item.id.client, item.id.clock + diff));
                }
                if (item.length > len) {
                  getItemCleanStart(transaction, createID(item.id.client, endClock));
                }
                struct = item;
              }
              if (!struct.deleted && scope.some(type => isParentOf(type, /** @type {Item} */ (struct)))) {
                itemsToDelete.push(struct);
              }
            }
          });
        }
      });
      iterateDeletedStructs(transaction, stackItem.ds, struct => {
        const id = struct.id;
        const clock = id.clock;
        const client = id.client;
        const startClock = stackItem.beforeState.get(client) || 0;
        const endClock = stackItem.afterState.get(client) || 0;
        if (
          struct instanceof Item &&
          scope.some(type => isParentOf(type, struct)) &&
          // Never redo structs in [stackItem.start, stackItem.start + stackItem.end) because they were created and deleted in the same capture interval.
          !(clock >= startClock && clock < endClock)
        ) {
          itemsToRedo.add(struct);
        }
      });
      itemsToRedo.forEach(struct => {
        performedChange = redoItem(transaction, struct, itemsToRedo) !== null || performedChange;
      });
      // We want to delete in reverse order so that children are deleted before
      // parents, so we have more information available when items are filtered.
      for (let i = itemsToDelete.length - 1; i >= 0; i--) {
        const item = itemsToDelete[i];
        if (undoManager.deleteFilter(item)) {
          item.delete(transaction);
          performedChange = true;
        }
      }
      result = stackItem;
    }
    transaction.changed.forEach((subProps, type) => {
      // destroy search marker if necessary
      if (subProps.has(null) && type._searchMarker) {
        type._searchMarker.length = 0;
      }
    });
  }, undoManager);
  if (result != null) {
    undoManager.emit('stack-item-popped', [{ stackItem: result, type: eventType }, undoManager]);
  }
  return result
};

/**
 * @typedef {Object} UndoManagerOptions
 * @property {number} [UndoManagerOptions.captureTimeout=500]
 * @property {function(Item):boolean} [UndoManagerOptions.deleteFilter=()=>true] Sometimes
 * it is necessary to filter whan an Undo/Redo operation can delete. If this
 * filter returns false, the type/item won't be deleted even it is in the
 * undo/redo scope.
 * @property {Set<any>} [UndoManagerOptions.trackedOrigins=new Set([null])]
 */

/**
 * Fires 'stack-item-added' event when a stack item was added to either the undo- or
 * the redo-stack. You may store additional stack information via the
 * metadata property on `event.stackItem.meta` (it is a `Map` of metadata properties).
 * Fires 'stack-item-popped' event when a stack item was popped from either the
 * undo- or the redo-stack. You may restore the saved stack information from `event.stackItem.meta`.
 *
 * @extends {Observable<'stack-item-added'|'stack-item-popped'>}
 */
class UndoManager extends lib0_observable_js__WEBPACK_IMPORTED_MODULE_0__["Observable"] {
  /**
   * @param {AbstractType<any>|Array<AbstractType<any>>} typeScope Accepts either a single type, or an array of types
   * @param {UndoManagerOptions} options
   */
  constructor (typeScope, { captureTimeout = 500, deleteFilter = () => true, trackedOrigins = new Set([null]) } = {}) {
    super();
    this.scope = typeScope instanceof Array ? typeScope : [typeScope];
    this.deleteFilter = deleteFilter;
    trackedOrigins.add(this);
    this.trackedOrigins = trackedOrigins;
    /**
     * @type {Array<StackItem>}
     */
    this.undoStack = [];
    /**
     * @type {Array<StackItem>}
     */
    this.redoStack = [];
    /**
     * Whether the client is currently undoing (calling UndoManager.undo)
     *
     * @type {boolean}
     */
    this.undoing = false;
    this.redoing = false;
    this.doc = /** @type {Doc} */ (this.scope[0].doc);
    this.lastChange = 0;
    this.doc.on('afterTransaction', /** @param {Transaction} transaction */ transaction => {
      // Only track certain transactions
      if (!this.scope.some(type => transaction.changedParentTypes.has(type)) || (!this.trackedOrigins.has(transaction.origin) && (!transaction.origin || !this.trackedOrigins.has(transaction.origin.constructor)))) {
        return
      }
      const undoing = this.undoing;
      const redoing = this.redoing;
      const stack = undoing ? this.redoStack : this.undoStack;
      if (undoing) {
        this.stopCapturing(); // next undo should not be appended to last stack item
      } else if (!redoing) {
        // neither undoing nor redoing: delete redoStack
        this.redoStack = [];
      }
      const beforeState = transaction.beforeState;
      const afterState = transaction.afterState;
      const now = Object(lib0_time_js__WEBPACK_IMPORTED_MODULE_13__["getUnixTime"])();
      if (now - this.lastChange < captureTimeout && stack.length > 0 && !undoing && !redoing) {
        // append change to last stack op
        const lastOp = stack[stack.length - 1];
        lastOp.ds = mergeDeleteSets([lastOp.ds, transaction.deleteSet]);
        lastOp.afterState = afterState;
      } else {
        // create a new stack op
        stack.push(new StackItem(transaction.deleteSet, beforeState, afterState));
      }
      if (!undoing && !redoing) {
        this.lastChange = now;
      }
      // make sure that deleted structs are not gc'd
      iterateDeletedStructs(transaction, transaction.deleteSet, /** @param {Item|GC} item */ item => {
        if (item instanceof Item && this.scope.some(type => isParentOf(type, item))) {
          keepItem(item, true);
        }
      });
      this.emit('stack-item-added', [{ stackItem: stack[stack.length - 1], origin: transaction.origin, type: undoing ? 'redo' : 'undo' }, this]);
    });
  }

  clear () {
    this.doc.transact(transaction => {
      /**
       * @param {StackItem} stackItem
       */
      const clearItem = stackItem => {
        iterateDeletedStructs(transaction, stackItem.ds, item => {
          if (item instanceof Item && this.scope.some(type => isParentOf(type, item))) {
            keepItem(item, false);
          }
        });
      };
      this.undoStack.forEach(clearItem);
      this.redoStack.forEach(clearItem);
    });
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * UndoManager merges Undo-StackItem if they are created within time-gap
   * smaller than `options.captureTimeout`. Call `um.stopCapturing()` so that the next
   * StackItem won't be merged.
   *
   *
   * @example
   *     // without stopCapturing
   *     ytext.insert(0, 'a')
   *     ytext.insert(1, 'b')
   *     um.undo()
   *     ytext.toString() // => '' (note that 'ab' was removed)
   *     // with stopCapturing
   *     ytext.insert(0, 'a')
   *     um.stopCapturing()
   *     ytext.insert(0, 'b')
   *     um.undo()
   *     ytext.toString() // => 'a' (note that only 'b' was removed)
   *
   */
  stopCapturing () {
    this.lastChange = 0;
  }

  /**
   * Undo last changes on type.
   *
   * @return {StackItem?} Returns StackItem if a change was applied
   */
  undo () {
    this.undoing = true;
    let res;
    try {
      res = popStackItem(this, this.undoStack, 'undo');
    } finally {
      this.undoing = false;
    }
    return res
  }

  /**
   * Redo last undo operation.
   *
   * @return {StackItem?} Returns StackItem if a change was applied
   */
  redo () {
    this.redoing = true;
    let res;
    try {
      res = popStackItem(this, this.redoStack, 'redo');
    } finally {
      this.redoing = false;
    }
    return res
  }
}

/**
 * YEvent describes the changes on a YType.
 */
class YEvent {
  /**
   * @param {AbstractType<any>} target The changed type.
   * @param {Transaction} transaction
   */
  constructor (target, transaction) {
    /**
     * The type on which this event was created on.
     * @type {AbstractType<any>}
     */
    this.target = target;
    /**
     * The current target on which the observe callback is called.
     * @type {AbstractType<any>}
     */
    this.currentTarget = target;
    /**
     * The transaction that triggered this event.
     * @type {Transaction}
     */
    this.transaction = transaction;
    /**
     * @type {Object|null}
     */
    this._changes = null;
  }

  /**
   * Computes the path from `y` to the changed type.
   *
   * @todo v14 should standardize on path: Array<{parent, index}> because that is easier to work with.
   *
   * The following property holds:
   * @example
   *   let type = y
   *   event.path.forEach(dir => {
   *     type = type.get(dir)
   *   })
   *   type === event.target // => true
   */
  get path () {
    // @ts-ignore _item is defined because target is integrated
    return getPathTo(this.currentTarget, this.target)
  }

  /**
   * Check if a struct is deleted by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  deletes (struct) {
    return isDeleted(this.transaction.deleteSet, struct.id)
  }

  /**
   * Check if a struct is added by this event.
   *
   * In contrast to change.deleted, this method also returns true if the struct was added and then deleted.
   *
   * @param {AbstractStruct} struct
   * @return {boolean}
   */
  adds (struct) {
    return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0)
  }

  /**
   * @return {{added:Set<Item>,deleted:Set<Item>,keys:Map<string,{action:'add'|'update'|'delete',oldValue:any}>,delta:Array<{insert:Array<any>}|{delete:number}|{retain:number}>}}
   */
  get changes () {
    let changes = this._changes;
    if (changes === null) {
      const target = this.target;
      const added = Object(lib0_set_js__WEBPACK_IMPORTED_MODULE_11__["create"])();
      const deleted = Object(lib0_set_js__WEBPACK_IMPORTED_MODULE_11__["create"])();
      /**
       * @type {Array<{insert:Array<any>}|{delete:number}|{retain:number}>}
       */
      const delta = [];
      /**
       * @type {Map<string,{ action: 'add' | 'update' | 'delete', oldValue: any}>}
       */
      const keys = new Map();
      changes = {
        added, deleted, delta, keys
      };
      const changed = /** @type Set<string|null> */ (this.transaction.changed.get(target));
      if (changed.has(null)) {
        /**
         * @type {any}
         */
        let lastOp = null;
        const packOp = () => {
          if (lastOp) {
            delta.push(lastOp);
          }
        };
        for (let item = target._start; item !== null; item = item.right) {
          if (item.deleted) {
            if (this.deletes(item) && !this.adds(item)) {
              if (lastOp === null || lastOp.delete === undefined) {
                packOp();
                lastOp = { delete: 0 };
              }
              lastOp.delete += item.length;
              deleted.add(item);
            } // else nop
          } else {
            if (this.adds(item)) {
              if (lastOp === null || lastOp.insert === undefined) {
                packOp();
                lastOp = { insert: [] };
              }
              lastOp.insert = lastOp.insert.concat(item.content.getContent());
              added.add(item);
            } else {
              if (lastOp === null || lastOp.retain === undefined) {
                packOp();
                lastOp = { retain: 0 };
              }
              lastOp.retain += item.length;
            }
          }
        }
        if (lastOp !== null && lastOp.retain === undefined) {
          packOp();
        }
      }
      changed.forEach(key => {
        if (key !== null) {
          const item = /** @type {Item} */ (target._map.get(key));
          /**
           * @type {'delete' | 'add' | 'update'}
           */
          let action;
          let oldValue;
          if (this.adds(item)) {
            let prev = item.left;
            while (prev !== null && this.adds(prev)) {
              prev = prev.left;
            }
            if (this.deletes(item)) {
              if (prev !== null && this.deletes(prev)) {
                action = 'delete';
                oldValue = Object(lib0_array_js__WEBPACK_IMPORTED_MODULE_1__["last"])(prev.content.getContent());
              } else {
                return
              }
            } else {
              if (prev !== null && this.deletes(prev)) {
                action = 'update';
                oldValue = Object(lib0_array_js__WEBPACK_IMPORTED_MODULE_1__["last"])(prev.content.getContent());
              } else {
                action = 'add';
                oldValue = undefined;
              }
            }
          } else {
            if (this.deletes(item)) {
              action = 'delete';
              oldValue = Object(lib0_array_js__WEBPACK_IMPORTED_MODULE_1__["last"])(/** @type {Item} */ item.content.getContent());
            } else {
              return // nop
            }
          }
          keys.set(key, { action, oldValue });
        }
      });
      this._changes = changes;
    }
    return /** @type {any} */ (changes)
  }
}

/**
 * Compute the path from this type to the specified target.
 *
 * @example
 *   // `child` should be accessible via `type.get(path[0]).get(path[1])..`
 *   const path = type.getPathTo(child)
 *   // assuming `type instanceof YArray`
 *   console.log(path) // might look like => [2, 'key1']
 *   child === type.get(path[0]).get(path[1])
 *
 * @param {AbstractType<any>} parent
 * @param {AbstractType<any>} child target
 * @return {Array<string|number>} Path to the target
 *
 * @private
 * @function
 */
const getPathTo = (parent, child) => {
  const path = [];
  while (child._item !== null && child !== parent) {
    if (child._item.parentSub !== null) {
      // parent is map-ish
      path.unshift(child._item.parentSub);
    } else {
      // parent is array-ish
      let i = 0;
      let c = /** @type {AbstractType<any>} */ (child._item.parent)._start;
      while (c !== child._item && c !== null) {
        if (!c.deleted) {
          i++;
        }
        c = c.right;
      }
      path.unshift(i);
    }
    child = /** @type {AbstractType<any>} */ (child._item.parent);
  }
  return path
};

const maxSearchMarker = 80;

/**
 * A unique timestamp that identifies each marker.
 *
 * Time is relative,.. this is more like an ever-increasing clock.
 *
 * @type {number}
 */
let globalSearchMarkerTimestamp = 0;

class ArraySearchMarker {
  /**
   * @param {Item} p
   * @param {number} index
   */
  constructor (p, index) {
    p.marker = true;
    this.p = p;
    this.index = index;
    this.timestamp = globalSearchMarkerTimestamp++;
  }
}

/**
 * @param {ArraySearchMarker} marker
 */
const refreshMarkerTimestamp = marker => { marker.timestamp = globalSearchMarkerTimestamp++; };

/**
 * This is rather complex so this function is the only thing that should overwrite a marker
 *
 * @param {ArraySearchMarker} marker
 * @param {Item} p
 * @param {number} index
 */
const overwriteMarker = (marker, p, index) => {
  marker.p.marker = false;
  marker.p = p;
  p.marker = true;
  marker.index = index;
  marker.timestamp = globalSearchMarkerTimestamp++;
};

/**
 * @param {Array<ArraySearchMarker>} searchMarker
 * @param {Item} p
 * @param {number} index
 */
const markPosition = (searchMarker, p, index) => {
  if (searchMarker.length >= maxSearchMarker) {
    // override oldest marker (we don't want to create more objects)
    const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
    overwriteMarker(marker, p, index);
    return marker
  } else {
    // create new marker
    const pm = new ArraySearchMarker(p, index);
    searchMarker.push(pm);
    return pm
  }
};

/**
 * Search marker help us to find positions in the associative array faster.
 *
 * They speed up the process of finding a position without much bookkeeping.
 *
 * A maximum of `maxSearchMarker` objects are created.
 *
 * This function always returns a refreshed marker (updated timestamp)
 *
 * @param {AbstractType<any>} yarray
 * @param {number} index
 */
const findMarker = (yarray, index) => {
  if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
    return null
  }
  const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => Object(lib0_math_js__WEBPACK_IMPORTED_MODULE_2__["abs"])(index - a.index) < Object(lib0_math_js__WEBPACK_IMPORTED_MODULE_2__["abs"])(index - b.index) ? a : b);
  let p = yarray._start;
  let pindex = 0;
  if (marker !== null) {
    p = marker.p;
    pindex = marker.index;
    refreshMarkerTimestamp(marker); // we used it, we might need to use it again
  }
  // iterate to right if possible
  while (p.right !== null && pindex < index) {
    if (!p.deleted && p.countable) {
      if (index < pindex + p.length) {
        break
      }
      pindex += p.length;
    }
    p = p.right;
  }
  // iterate to left if necessary (might be that pindex > index)
  while (p.left !== null && pindex > index) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }
  // we want to make sure that p can't be merged with left, because that would screw up everything
  // in that cas just return what we have (it is most likely the best marker anyway)
  // iterate to left until p can't be merged with left
  while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
    p = p.left;
    if (!p.deleted && p.countable) {
      pindex -= p.length;
    }
  }

  // @todo remove!
  // assure position
  // {
  //   let start = yarray._start
  //   let pos = 0
  //   while (start !== p) {
  //     if (!start.deleted && start.countable) {
  //       pos += start.length
  //     }
  //     start = /** @type {Item} */ (start.right)
  //   }
  //   if (pos !== pindex) {
  //     debugger
  //     throw new Error('Gotcha position fail!')
  //   }
  // }
  // if (marker) {
  //   if (window.lengthes == null) {
  //     window.lengthes = []
  //     window.getLengthes = () => window.lengthes.sort((a, b) => a - b)
  //   }
  //   window.lengthes.push(marker.index - pindex)
  //   console.log('distance', marker.index - pindex, 'len', p && p.parent.length)
  // }
  if (marker !== null && Object(lib0_math_js__WEBPACK_IMPORTED_MODULE_2__["abs"])(marker.index - pindex) < /** @type {YText|YArray<any>} */ (p.parent).length / maxSearchMarker) {
    // adjust existing marker
    overwriteMarker(marker, p, pindex);
    return marker
  } else {
    // create new marker
    return markPosition(yarray._searchMarker, p, pindex)
  }
};

/**
 * Update markers when a change happened.
 *
 * This should be called before doing a deletion!
 *
 * @param {Array<ArraySearchMarker>} searchMarker
 * @param {number} index
 * @param {number} len If insertion, len is positive. If deletion, len is negative.
 */
const updateMarkerChanges = (searchMarker, index, len) => {
  for (let i = searchMarker.length - 1; i >= 0; i--) {
    const m = searchMarker[i];
    if (len > 0) {
      /**
       * @type {Item|null}
       */
      let p = m.p;
      p.marker = false;
      // Ideally we just want to do a simple position comparison, but this will only work if
      // search markers don't point to deleted items for formats.
      // Iterate marker to prev undeleted countable position so we know what to do when updating a position
      while (p && (p.deleted || !p.countable)) {
        p = p.left;
        if (p && !p.deleted && p.countable) {
          // adjust position. the loop should break now
          m.index -= p.length;
        }
      }
      if (p === null || p.marker === true) {
        // remove search marker if updated position is null or if position is already marked
        searchMarker.splice(i, 1);
        continue
      }
      m.p = p;
      p.marker = true;
    }
    if (index < m.index || (len > 0 && index === m.index)) { // a simple index <= m.index check would actually suffice
      m.index = Object(lib0_math_js__WEBPACK_IMPORTED_MODULE_2__["max"])(index, m.index + len);
    }
  }
};

/**
 * Accumulate all (list) children of a type and return them as an Array.
 *
 * @param {AbstractType<any>} t
 * @return {Array<Item>}
 */
const getTypeChildren = t => {
  let s = t._start;
  const arr = [];
  while (s) {
    arr.push(s);
    s = s.right;
  }
  return arr
};

/**
 * Call event listeners with an event. This will also add an event to all
 * parents (for `.observeDeep` handlers).
 *
 * @template EventType
 * @param {AbstractType<EventType>} type
 * @param {Transaction} transaction
 * @param {EventType} event
 */
const callTypeObservers = (type, transaction, event) => {
  const changedType = type;
  const changedParentTypes = transaction.changedParentTypes;
  while (true) {
    // @ts-ignore
    Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["setIfUndefined"])(changedParentTypes, type, () => []).push(event);
    if (type._item === null) {
      break
    }
    type = /** @type {AbstractType<any>} */ (type._item.parent);
  }
  callEventHandlerListeners(changedType._eH, event, transaction);
};

/**
 * @template EventType
 * Abstract Yjs Type class
 */
class AbstractType {
  constructor () {
    /**
     * @type {Item|null}
     */
    this._item = null;
    /**
     * @type {Map<string,Item>}
     */
    this._map = new Map();
    /**
     * @type {Item|null}
     */
    this._start = null;
    /**
     * @type {Doc|null}
     */
    this.doc = null;
    this._length = 0;
    /**
     * Event handlers
     * @type {EventHandler<EventType,Transaction>}
     */
    this._eH = createEventHandler();
    /**
     * Deep event handlers
     * @type {EventHandler<Array<YEvent>,Transaction>}
     */
    this._dEH = createEventHandler();
    /**
     * @type {null | Array<ArraySearchMarker>}
     */
    this._searchMarker = null;
  }

  /**
   * @return {AbstractType<any>|null}
   */
  get parent () {
    return this._item ? /** @type {AbstractType<any>} */ (this._item.parent) : null
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item|null} item
   */
  _integrate (y, item) {
    this.doc = y;
    this._item = item;
  }

  /**
   * @return {AbstractType<EventType>}
   */
  _copy () {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["methodUnimplemented"])()
  }

  /**
   * @return {AbstractType<EventType>}
   */
  clone () {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["methodUnimplemented"])()
  }

  /**
   * @param {AbstractUpdateEncoder} encoder
   */
  _write (encoder) { }

  /**
   * The first non-deleted item
   */
  get _first () {
    let n = this._start;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n
  }

  /**
   * Creates YEvent and calls all type observers.
   * Must be implemented by each type.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    if (!transaction.local && this._searchMarker) {
      this._searchMarker.length = 0;
    }
  }

  /**
   * Observe all events that are created on this type.
   *
   * @param {function(EventType, Transaction):void} f Observer function
   */
  observe (f) {
    addEventHandlerListener(this._eH, f);
  }

  /**
   * Observe all events that are created by this type and its children.
   *
   * @param {function(Array<YEvent>,Transaction):void} f Observer function
   */
  observeDeep (f) {
    addEventHandlerListener(this._dEH, f);
  }

  /**
   * Unregister an observer function.
   *
   * @param {function(EventType,Transaction):void} f Observer function
   */
  unobserve (f) {
    removeEventHandlerListener(this._eH, f);
  }

  /**
   * Unregister an observer function.
   *
   * @param {function(Array<YEvent>,Transaction):void} f Observer function
   */
  unobserveDeep (f) {
    removeEventHandlerListener(this._dEH, f);
  }

  /**
   * @abstract
   * @return {any}
   */
  toJSON () {}
}

/**
 * @param {AbstractType<any>} type
 * @param {number} start
 * @param {number} end
 * @return {Array<any>}
 *
 * @private
 * @function
 */
const typeListSlice = (type, start, end) => {
  if (start < 0) {
    start = type._length + start;
  }
  if (end < 0) {
    end = type._length + end;
  }
  let len = end - start;
  const cs = [];
  let n = type._start;
  while (n !== null && len > 0) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      if (c.length <= start) {
        start -= c.length;
      } else {
        for (let i = start; i < c.length && len > 0; i++) {
          cs.push(c[i]);
          len--;
        }
        start = 0;
      }
    }
    n = n.right;
  }
  return cs
};

/**
 * @param {AbstractType<any>} type
 * @return {Array<any>}
 *
 * @private
 * @function
 */
const typeListToArray = type => {
  const cs = [];
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        cs.push(c[i]);
      }
    }
    n = n.right;
  }
  return cs
};

/**
 * @param {AbstractType<any>} type
 * @param {Snapshot} snapshot
 * @return {Array<any>}
 *
 * @private
 * @function
 */
const typeListToArraySnapshot = (type, snapshot) => {
  const cs = [];
  let n = type._start;
  while (n !== null) {
    if (n.countable && isVisible(n, snapshot)) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        cs.push(c[i]);
      }
    }
    n = n.right;
  }
  return cs
};

/**
 * Executes a provided function on once on overy element of this YArray.
 *
 * @param {AbstractType<any>} type
 * @param {function(any,number,any):void} f A function to execute on every element of this YArray.
 *
 * @private
 * @function
 */
const typeListForEach = (type, f) => {
  let index = 0;
  let n = type._start;
  while (n !== null) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        f(c[i], index++, type);
      }
    }
    n = n.right;
  }
};

/**
 * @template C,R
 * @param {AbstractType<any>} type
 * @param {function(C,number,AbstractType<any>):R} f
 * @return {Array<R>}
 *
 * @private
 * @function
 */
const typeListMap = (type, f) => {
  /**
   * @type {Array<any>}
   */
  const result = [];
  typeListForEach(type, (c, i) => {
    result.push(f(c, i, type));
  });
  return result
};

/**
 * @param {AbstractType<any>} type
 * @return {IterableIterator<any>}
 *
 * @private
 * @function
 */
const typeListCreateIterator = type => {
  let n = type._start;
  /**
   * @type {Array<any>|null}
   */
  let currentContent = null;
  let currentContentIndex = 0;
  return {
    [Symbol.iterator] () {
      return this
    },
    next: () => {
      // find some content
      if (currentContent === null) {
        while (n !== null && n.deleted) {
          n = n.right;
        }
        // check if we reached the end, no need to check currentContent, because it does not exist
        if (n === null) {
          return {
            done: true,
            value: undefined
          }
        }
        // we found n, so we can set currentContent
        currentContent = n.content.getContent();
        currentContentIndex = 0;
        n = n.right; // we used the content of n, now iterate to next
      }
      const value = currentContent[currentContentIndex++];
      // check if we need to empty currentContent
      if (currentContent.length <= currentContentIndex) {
        currentContent = null;
      }
      return {
        done: false,
        value
      }
    }
  }
};

/**
 * @param {AbstractType<any>} type
 * @param {number} index
 * @return {any}
 *
 * @private
 * @function
 */
const typeListGet = (type, index) => {
  const marker = findMarker(type, index);
  let n = type._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        return n.content.getContent()[index]
      }
      index -= n.length;
    }
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {Item?} referenceItem
 * @param {Array<Object<string,any>|Array<any>|boolean|number|string|Uint8Array>} content
 *
 * @private
 * @function
 */
const typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
  let left = referenceItem;
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  const store = doc.store;
  const right = referenceItem === null ? parent._start : referenceItem.right;
  /**
   * @type {Array<Object|Array<any>|number>}
   */
  let jsonContent = [];
  const packJsonContent = () => {
    if (jsonContent.length > 0) {
      left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
      left.integrate(transaction, 0);
      jsonContent = [];
    }
  };
  content.forEach(c => {
    switch (c.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        jsonContent.push(c);
        break
      default:
        packJsonContent();
        switch (c.constructor) {
          case Uint8Array:
          case ArrayBuffer:
            left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(/** @type {Uint8Array} */ (c))));
            left.integrate(transaction, 0);
            break
          case Doc:
            left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc(/** @type {Doc} */ (c)));
            left.integrate(transaction, 0);
            break
          default:
            if (c instanceof AbstractType) {
              left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
              left.integrate(transaction, 0);
            } else {
              throw new Error('Unexpected content type in insert operation')
            }
        }
    }
  });
  packJsonContent();
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {number} index
 * @param {Array<Object<string,any>|Array<any>|number|string|Uint8Array>} content
 *
 * @private
 * @function
 */
const typeListInsertGenerics = (transaction, parent, index, content) => {
  if (index === 0) {
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, index, content.length);
    }
    return typeListInsertGenericsAfter(transaction, parent, null, content)
  }
  const startIndex = index;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
    // we need to iterate one to the left so that the algorithm works
    if (index === 0) {
      // @todo refactor this as it actually doesn't consider formats
      n = n.prev; // important! get the left undeleted item so that we can actually decrease index
      index += (n && n.countable && !n.deleted) ? n.length : 0;
    }
  }
  for (; n !== null; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index <= n.length) {
        if (index < n.length) {
          // insert in-between
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
        }
        break
      }
      index -= n.length;
    }
  }
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, startIndex, content.length);
  }
  return typeListInsertGenericsAfter(transaction, parent, n, content)
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {number} index
 * @param {number} length
 *
 * @private
 * @function
 */
const typeListDelete = (transaction, parent, index, length) => {
  if (length === 0) { return }
  const startIndex = index;
  const startLength = length;
  const marker = findMarker(parent, index);
  let n = parent._start;
  if (marker !== null) {
    n = marker.p;
    index -= marker.index;
  }
  // compute the first item to be deleted
  for (; n !== null && index > 0; n = n.right) {
    if (!n.deleted && n.countable) {
      if (index < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
      }
      index -= n.length;
    }
  }
  // delete all items until done
  while (length > 0 && n !== null) {
    if (!n.deleted) {
      if (length < n.length) {
        getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length));
      }
      n.delete(transaction);
      length -= n.length;
    }
    n = n.right;
  }
  if (length > 0) {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["create"])('array length exceeded')
  }
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, startIndex, -startLength + length /* in case we remove the above exception */);
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {string} key
 *
 * @private
 * @function
 */
const typeMapDelete = (transaction, parent, key) => {
  const c = parent._map.get(key);
  if (c !== undefined) {
    c.delete(transaction);
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {string} key
 * @param {Object|number|Array<any>|string|Uint8Array|AbstractType<any>} value
 *
 * @private
 * @function
 */
const typeMapSet = (transaction, parent, key, value) => {
  const left = parent._map.get(key) || null;
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  let content;
  if (value == null) {
    content = new ContentAny([value]);
  } else {
    switch (value.constructor) {
      case Number:
      case Object:
      case Boolean:
      case Array:
      case String:
        content = new ContentAny([value]);
        break
      case Uint8Array:
        content = new ContentBinary(/** @type {Uint8Array} */ (value));
        break
      case Doc:
        content = new ContentDoc(/** @type {Doc} */ (value));
        break
      default:
        if (value instanceof AbstractType) {
          content = new ContentType(value);
        } else {
          throw new Error('Unexpected content type')
        }
    }
  }
  new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
};

/**
 * @param {AbstractType<any>} parent
 * @param {string} key
 * @return {Object<string,any>|number|Array<any>|string|Uint8Array|AbstractType<any>|undefined}
 *
 * @private
 * @function
 */
const typeMapGet = (parent, key) => {
  const val = parent._map.get(key);
  return val !== undefined && !val.deleted ? val.content.getContent()[val.length - 1] : undefined
};

/**
 * @param {AbstractType<any>} parent
 * @return {Object<string,Object<string,any>|number|Array<any>|string|Uint8Array|AbstractType<any>|undefined>}
 *
 * @private
 * @function
 */
const typeMapGetAll = (parent) => {
  /**
   * @type {Object<string,any>}
   */
  const res = {};
  parent._map.forEach((value, key) => {
    if (!value.deleted) {
      res[key] = value.content.getContent()[value.length - 1];
    }
  });
  return res
};

/**
 * @param {AbstractType<any>} parent
 * @param {string} key
 * @return {boolean}
 *
 * @private
 * @function
 */
const typeMapHas = (parent, key) => {
  const val = parent._map.get(key);
  return val !== undefined && !val.deleted
};

/**
 * @param {AbstractType<any>} parent
 * @param {string} key
 * @param {Snapshot} snapshot
 * @return {Object<string,any>|number|Array<any>|string|Uint8Array|AbstractType<any>|undefined}
 *
 * @private
 * @function
 */
const typeMapGetSnapshot = (parent, key, snapshot) => {
  let v = parent._map.get(key) || null;
  while (v !== null && (!snapshot.sv.has(v.id.client) || v.id.clock >= (snapshot.sv.get(v.id.client) || 0))) {
    v = v.left;
  }
  return v !== null && isVisible(v, snapshot) ? v.content.getContent()[v.length - 1] : undefined
};

/**
 * @param {Map<string,Item>} map
 * @return {IterableIterator<Array<any>>}
 *
 * @private
 * @function
 */
const createMapIterator = map => Object(lib0_iterator_js__WEBPACK_IMPORTED_MODULE_14__["iteratorFilter"])(map.entries(), /** @param {any} entry */ entry => !entry[1].deleted);

/**
 * @module YArray
 */

/**
 * Event that describes the changes on a YArray
 * @template T
 */
class YArrayEvent extends YEvent {
  /**
   * @param {YArray<T>} yarray The changed type
   * @param {Transaction} transaction The transaction object
   */
  constructor (yarray, transaction) {
    super(yarray, transaction);
    this._transaction = transaction;
  }
}

/**
 * A shared Array implementation.
 * @template T
 * @extends AbstractType<YArrayEvent<T>>
 * @implements {Iterable<T>}
 */
class YArray extends AbstractType {
  constructor () {
    super();
    /**
     * @type {Array<any>?}
     * @private
     */
    this._prelimContent = [];
    /**
     * @type {Array<ArraySearchMarker>}
     */
    this._searchMarker = [];
  }

  /**
   * Construct a new YArray containing the specified items.
   * @template T
   * @param {Array<T>} items
   * @return {YArray<T>}
   */
  static from (items) {
    const a = new YArray();
    a.push(items);
    return a
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item);
    this.insert(0, /** @type {Array<any>} */ (this._prelimContent));
    this._prelimContent = null;
  }

  _copy () {
    return new YArray()
  }

  /**
   * @return {YArray<T>}
   */
  clone () {
    const arr = new YArray();
    arr.insert(0, this.toArray().map(el =>
      el instanceof AbstractType ? el.clone() : el
    ));
    return arr
  }

  get length () {
    return this._prelimContent === null ? this._length : this._prelimContent.length
  }

  /**
   * Creates YArrayEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
  }

  /**
   * Inserts new content at an index.
   *
   * Important: This function expects an array of content. Not just a content
   * object. The reason for this "weirdness" is that inserting several elements
   * is very efficient when it is done as a single operation.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  yarray.insert(0, ['a'])
   *  // Insert numbers 1, 2 at position 1
   *  yarray.insert(1, [1, 2])
   *
   * @param {number} index The index to insert content at.
   * @param {Array<T>} content The array of content
   */
  insert (index, content) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeListInsertGenerics(transaction, this, index, content);
      });
    } else {
      /** @type {Array<any>} */ (this._prelimContent).splice(index, 0, ...content);
    }
  }

  /**
   * Appends content to this YArray.
   *
   * @param {Array<T>} content Array of content to append.
   */
  push (content) {
    this.insert(this.length, content);
  }

  /**
   * Preppends content to this YArray.
   *
   * @param {Array<T>} content Array of content to preppend.
   */
  unshift (content) {
    this.insert(0, content);
  }

  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} length The number of elements to remove. Defaults to 1.
   */
  delete (index, length = 1) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeListDelete(transaction, this, index, length);
      });
    } else {
      /** @type {Array<any>} */ (this._prelimContent).splice(index, length);
    }
  }

  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {T}
   */
  get (index) {
    return typeListGet(this, index)
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<T>}
   */
  toArray () {
    return typeListToArray(this)
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<T>}
   */
  slice (start = 0, end = this.length) {
    return typeListSlice(this, start, end)
  }

  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Array<any>}
   */
  toJSON () {
    return this.map(c => c instanceof AbstractType ? c.toJSON() : c)
  }

  /**
   * Returns an Array with the result of calling a provided function on every
   * element of this YArray.
   *
   * @template T,M
   * @param {function(T,number,YArray<T>):M} f Function that produces an element of the new Array
   * @return {Array<M>} A new array with each element being the result of the
   *                 callback function
   */
  map (f) {
    return typeListMap(this, /** @type {any} */ (f))
  }

  /**
   * Executes a provided function on once on overy element of this YArray.
   *
   * @param {function(T,number,YArray<T>):void} f A function to execute on every element of this YArray.
   */
  forEach (f) {
    typeListForEach(this, f);
  }

  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator] () {
    return typeListCreateIterator(this)
  }

  /**
   * @param {AbstractUpdateEncoder} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YArrayRefID);
  }
}

/**
 * @param {AbstractUpdateDecoder} decoder
 *
 * @private
 * @function
 */
const readYArray = decoder => new YArray();

/**
 * @template T
 * Event that describes the changes on a YMap.
 */
class YMapEvent extends YEvent {
  /**
   * @param {YMap<T>} ymap The YArray that changed.
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed.
   */
  constructor (ymap, transaction, subs) {
    super(ymap, transaction);
    this.keysChanged = subs;
  }
}

/**
 * @template T number|string|Object|Array|Uint8Array
 * A shared Map implementation.
 *
 * @extends AbstractType<YMapEvent<T>>
 * @implements {Iterable<T>}
 */
class YMap extends AbstractType {
  /**
   *
   * @param {Iterable<readonly [string, any]>=} entries - an optional iterable to initialize the YMap
   */
  constructor (entries) {
    super();
    /**
     * @type {Map<string,any>?}
     * @private
     */
    this._prelimContent = null;

    if (entries === undefined) {
      this._prelimContent = new Map();
    } else {
      this._prelimContent = new Map(entries);
    }
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item)
    ;/** @type {Map<string, any>} */ (this._prelimContent).forEach((value, key) => {
      this.set(key, value);
    });
    this._prelimContent = null;
  }

  _copy () {
    return new YMap()
  }

  /**
   * @return {YMap<T>}
   */
  clone () {
    const map = new YMap();
    this.forEach((value, key) => {
      map.set(key, value instanceof AbstractType ? value.clone() : value);
    });
    return map
  }

  /**
   * Creates YMapEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
  }

  /**
   * Transforms this Shared Type to a JSON object.
   *
   * @return {Object<string,T>}
   */
  toJSON () {
    /**
     * @type {Object<string,T>}
     */
    const map = {};
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        const v = item.content.getContent()[item.length - 1];
        map[key] = v instanceof AbstractType ? v.toJSON() : v;
      }
    });
    return map
  }

  /**
   * Returns the size of the YMap (count of key/value pairs)
   *
   * @return {number}
   */
  get size () {
    return [...createMapIterator(this._map)].length
  }

  /**
   * Returns the keys for each element in the YMap Type.
   *
   * @return {IterableIterator<string>}
   */
  keys () {
    return Object(lib0_iterator_js__WEBPACK_IMPORTED_MODULE_14__["iteratorMap"])(createMapIterator(this._map), /** @param {any} v */ v => v[0])
  }

  /**
   * Returns the values for each element in the YMap Type.
   *
   * @return {IterableIterator<any>}
   */
  values () {
    return Object(lib0_iterator_js__WEBPACK_IMPORTED_MODULE_14__["iteratorMap"])(createMapIterator(this._map), /** @param {any} v */ v => v[1].content.getContent()[v[1].length - 1])
  }

  /**
   * Returns an Iterator of [key, value] pairs
   *
   * @return {IterableIterator<any>}
   */
  entries () {
    return Object(lib0_iterator_js__WEBPACK_IMPORTED_MODULE_14__["iteratorMap"])(createMapIterator(this._map), /** @param {any} v */ v => [v[0], v[1].content.getContent()[v[1].length - 1]])
  }

  /**
   * Executes a provided function on once on every key-value pair.
   *
   * @param {function(T,string,YMap<T>):void} f A function to execute on every element of this YArray.
   */
  forEach (f) {
    /**
     * @type {Object<string,T>}
     */
    const map = {};
    this._map.forEach((item, key) => {
      if (!item.deleted) {
        f(item.content.getContent()[item.length - 1], key, this);
      }
    });
    return map
  }

  /**
   * @return {IterableIterator<T>}
   */
  [Symbol.iterator] () {
    return this.entries()
  }

  /**
   * Remove a specified element from this YMap.
   *
   * @param {string} key The key of the element to remove.
   */
  delete (key) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapDelete(transaction, this, key);
      });
    } else {
      /** @type {Map<string, any>} */ (this._prelimContent).delete(key);
    }
  }

  /**
   * Adds or updates an element with a specified key and value.
   *
   * @param {string} key The key of the element to add to this YMap
   * @param {T} value The value of the element to add
   */
  set (key, value) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapSet(transaction, this, key, value);
      });
    } else {
      /** @type {Map<string, any>} */ (this._prelimContent).set(key, value);
    }
    return value
  }

  /**
   * Returns a specified element from this YMap.
   *
   * @param {string} key
   * @return {T|undefined}
   */
  get (key) {
    return /** @type {any} */ (typeMapGet(this, key))
  }

  /**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
  has (key) {
    return typeMapHas(this, key)
  }

  /**
   * @param {AbstractUpdateEncoder} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YMapRefID);
  }
}

/**
 * @param {AbstractUpdateDecoder} decoder
 *
 * @private
 * @function
 */
const readYMap = decoder => new YMap();

/**
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
const equalAttrs = (a, b) => a === b || (typeof a === 'object' && typeof b === 'object' && a && b && Object(lib0_object_js__WEBPACK_IMPORTED_MODULE_15__["equalFlat"])(a, b));

class ItemTextListPosition {
  /**
   * @param {Item|null} left
   * @param {Item|null} right
   * @param {number} index
   * @param {Map<string,any>} currentAttributes
   */
  constructor (left, right, index, currentAttributes) {
    this.left = left;
    this.right = right;
    this.index = index;
    this.currentAttributes = currentAttributes;
  }

  /**
   * Only call this if you know that this.right is defined
   */
  forward () {
    if (this.right === null) {
      Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["unexpectedCase"])();
    }
    switch (this.right.content.constructor) {
      case ContentEmbed:
      case ContentString:
        if (!this.right.deleted) {
          this.index += this.right.length;
        }
        break
      case ContentFormat:
        if (!this.right.deleted) {
          updateCurrentAttributes(this.currentAttributes, /** @type {ContentFormat} */ (this.right.content));
        }
        break
    }
    this.left = this.right;
    this.right = this.right.right;
  }
}

/**
 * @param {Transaction} transaction
 * @param {ItemTextListPosition} pos
 * @param {number} count steps to move forward
 * @return {ItemTextListPosition}
 *
 * @private
 * @function
 */
const findNextPosition = (transaction, pos, count) => {
  while (pos.right !== null && count > 0) {
    switch (pos.right.content.constructor) {
      case ContentEmbed:
      case ContentString:
        if (!pos.right.deleted) {
          if (count < pos.right.length) {
            // split right
            getItemCleanStart(transaction, createID(pos.right.id.client, pos.right.id.clock + count));
          }
          pos.index += pos.right.length;
          count -= pos.right.length;
        }
        break
      case ContentFormat:
        if (!pos.right.deleted) {
          updateCurrentAttributes(pos.currentAttributes, /** @type {ContentFormat} */ (pos.right.content));
        }
        break
    }
    pos.left = pos.right;
    pos.right = pos.right.right;
    // pos.forward() - we don't forward because that would halve the performance because we already do the checks above
  }
  return pos
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {number} index
 * @return {ItemTextListPosition}
 *
 * @private
 * @function
 */
const findPosition = (transaction, parent, index) => {
  const currentAttributes = new Map();
  const marker = findMarker(parent, index);
  if (marker) {
    const pos = new ItemTextListPosition(marker.p.left, marker.p, marker.index, currentAttributes);
    return findNextPosition(transaction, pos, index - marker.index)
  } else {
    const pos = new ItemTextListPosition(null, parent._start, 0, currentAttributes);
    return findNextPosition(transaction, pos, index)
  }
};

/**
 * Negate applied formats
 *
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {Map<string,any>} negatedAttributes
 *
 * @private
 * @function
 */
const insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
  // check if we really need to remove attributes
  while (
    currPos.right !== null && (
      currPos.right.deleted === true || (
        currPos.right.content.constructor === ContentFormat &&
        equalAttrs(negatedAttributes.get(/** @type {ContentFormat} */ (currPos.right.content).key), /** @type {ContentFormat} */ (currPos.right.content).value)
      )
    )
  ) {
    if (!currPos.right.deleted) {
      negatedAttributes.delete(/** @type {ContentFormat} */ (currPos.right.content).key);
    }
    currPos.forward();
  }
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  let left = currPos.left;
  const right = currPos.right;
  negatedAttributes.forEach((val, key) => {
    left = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
    left.integrate(transaction, 0);
  });
};

/**
 * @param {Map<string,any>} currentAttributes
 * @param {ContentFormat} format
 *
 * @private
 * @function
 */
const updateCurrentAttributes = (currentAttributes, format) => {
  const { key, value } = format;
  if (value === null) {
    currentAttributes.delete(key);
  } else {
    currentAttributes.set(key, value);
  }
};

/**
 * @param {ItemTextListPosition} currPos
 * @param {Object<string,any>} attributes
 *
 * @private
 * @function
 */
const minimizeAttributeChanges = (currPos, attributes) => {
  // go right while attributes[right.key] === right.value (or right is deleted)
  while (true) {
    if (currPos.right === null) {
      break
    } else if (currPos.right.deleted || (currPos.right.content.constructor === ContentFormat && equalAttrs(attributes[(/** @type {ContentFormat} */ (currPos.right.content)).key] || null, /** @type {ContentFormat} */ (currPos.right.content).value))) ; else {
      break
    }
    currPos.forward();
  }
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {Object<string,any>} attributes
 * @return {Map<string,any>}
 *
 * @private
 * @function
 **/
const insertAttributes = (transaction, parent, currPos, attributes) => {
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  const negatedAttributes = new Map();
  // insert format-start items
  for (const key in attributes) {
    const val = attributes[key];
    const currentVal = currPos.currentAttributes.get(key) || null;
    if (!equalAttrs(currentVal, val)) {
      // save negated attribute (set null if currentVal undefined)
      negatedAttributes.set(key, currentVal);
      const { left, right } = currPos;
      currPos.right = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
      currPos.right.integrate(transaction, 0);
      currPos.forward();
    }
  }
  return negatedAttributes
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {string|object} text
 * @param {Object<string,any>} attributes
 *
 * @private
 * @function
 **/
const insertText = (transaction, parent, currPos, text, attributes) => {
  currPos.currentAttributes.forEach((val, key) => {
    if (attributes[key] === undefined) {
      attributes[key] = null;
    }
  });
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  // insert content
  const content = text.constructor === String ? new ContentString(/** @type {string} */ (text)) : new ContentEmbed(text);
  let { left, right, index } = currPos;
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, content.getLength());
  }
  right = new Item(createID(ownClientId, getState(doc.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
  right.integrate(transaction, 0);
  currPos.right = right;
  currPos.index = index;
  currPos.forward();
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};

/**
 * @param {Transaction} transaction
 * @param {AbstractType<any>} parent
 * @param {ItemTextListPosition} currPos
 * @param {number} length
 * @param {Object<string,any>} attributes
 *
 * @private
 * @function
 */
const formatText = (transaction, parent, currPos, length, attributes) => {
  const doc = transaction.doc;
  const ownClientId = doc.clientID;
  minimizeAttributeChanges(currPos, attributes);
  const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
  // iterate until first non-format or null is found
  // delete all formats with attributes[format.key] != null
  while (length > 0 && currPos.right !== null) {
    if (!currPos.right.deleted) {
      switch (currPos.right.content.constructor) {
        case ContentFormat: {
          const { key, value } = /** @type {ContentFormat} */ (currPos.right.content);
          const attr = attributes[key];
          if (attr !== undefined) {
            if (equalAttrs(attr, value)) {
              negatedAttributes.delete(key);
            } else {
              negatedAttributes.set(key, value);
            }
            currPos.right.delete(transaction);
          }
          break
        }
        case ContentEmbed:
        case ContentString:
          if (length < currPos.right.length) {
            getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length));
          }
          length -= currPos.right.length;
          break
      }
    }
    currPos.forward();
  }
  // Quill just assumes that the editor starts with a newline and that it always
  // ends with a newline. We only insert that newline when a new newline is
  // inserted - i.e when length is bigger than type.length
  if (length > 0) {
    let newlines = '';
    for (; length > 0; length--) {
      newlines += '\n';
    }
    currPos.right = new Item(createID(ownClientId, getState(doc.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString(newlines));
    currPos.right.integrate(transaction, 0);
    currPos.forward();
  }
  insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
};

/**
 * Call this function after string content has been deleted in order to
 * clean up formatting Items.
 *
 * @param {Transaction} transaction
 * @param {Item} start
 * @param {Item|null} end exclusive end, automatically iterates to the next Content Item
 * @param {Map<string,any>} startAttributes
 * @param {Map<string,any>} endAttributes This attribute is modified!
 * @return {number} The amount of formatting Items deleted.
 *
 * @function
 */
const cleanupFormattingGap = (transaction, start, end, startAttributes, endAttributes) => {
  while (end && end.content.constructor !== ContentString && end.content.constructor !== ContentEmbed) {
    if (!end.deleted && end.content.constructor === ContentFormat) {
      updateCurrentAttributes(endAttributes, /** @type {ContentFormat} */ (end.content));
    }
    end = end.right;
  }
  let cleanups = 0;
  while (start !== end) {
    if (!start.deleted) {
      const content = start.content;
      switch (content.constructor) {
        case ContentFormat: {
          const { key, value } = /** @type {ContentFormat} */ (content);
          if ((endAttributes.get(key) || null) !== value || (startAttributes.get(key) || null) === value) {
            // Either this format is overwritten or it is not necessary because the attribute already existed.
            start.delete(transaction);
            cleanups++;
          }
          break
        }
      }
    }
    start = /** @type {Item} */ (start.right);
  }
  return cleanups
};

/**
 * @param {Transaction} transaction
 * @param {Item | null} item
 */
const cleanupContextlessFormattingGap = (transaction, item) => {
  // iterate until item.right is null or content
  while (item && item.right && (item.right.deleted || (item.right.content.constructor !== ContentString && item.right.content.constructor !== ContentEmbed))) {
    item = item.right;
  }
  const attrs = new Set();
  // iterate back until a content item is found
  while (item && (item.deleted || (item.content.constructor !== ContentString && item.content.constructor !== ContentEmbed))) {
    if (!item.deleted && item.content.constructor === ContentFormat) {
      const key = /** @type {ContentFormat} */ (item.content).key;
      if (attrs.has(key)) {
        item.delete(transaction);
      } else {
        attrs.add(key);
      }
    }
    item = item.left;
  }
};

/**
 * This function is experimental and subject to change / be removed.
 *
 * Ideally, we don't need this function at all. Formatting attributes should be cleaned up
 * automatically after each change. This function iterates twice over the complete YText type
 * and removes unnecessary formatting attributes. This is also helpful for testing.
 *
 * This function won't be exported anymore as soon as there is confidence that the YText type works as intended.
 *
 * @param {YText} type
 * @return {number} How many formatting attributes have been cleaned up.
 */
const cleanupYTextFormatting = type => {
  let res = 0;
  transact(/** @type {Doc} */ (type.doc), transaction => {
    let start = /** @type {Item} */ (type._start);
    let end = type._start;
    let startAttributes = Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["create"])();
    const currentAttributes = Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["copy"])(startAttributes);
    while (end) {
      if (end.deleted === false) {
        switch (end.content.constructor) {
          case ContentFormat:
            updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (end.content));
            break
          case ContentEmbed:
          case ContentString:
            res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
            startAttributes = Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["copy"])(currentAttributes);
            start = end;
            break
        }
      }
      end = end.right;
    }
  });
  return res
};

/**
 * @param {Transaction} transaction
 * @param {ItemTextListPosition} currPos
 * @param {number} length
 * @return {ItemTextListPosition}
 *
 * @private
 * @function
 */
const deleteText = (transaction, currPos, length) => {
  const startLength = length;
  const startAttrs = Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["copy"])(currPos.currentAttributes);
  const start = currPos.right;
  while (length > 0 && currPos.right !== null) {
    if (currPos.right.deleted === false) {
      switch (currPos.right.content.constructor) {
        case ContentEmbed:
        case ContentString:
          if (length < currPos.right.length) {
            getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length));
          }
          length -= currPos.right.length;
          currPos.right.delete(transaction);
          break
      }
    }
    currPos.forward();
  }
  if (start) {
    cleanupFormattingGap(transaction, start, currPos.right, startAttrs, Object(lib0_map_js__WEBPACK_IMPORTED_MODULE_3__["copy"])(currPos.currentAttributes));
  }
  const parent = /** @type {AbstractType<any>} */ (/** @type {Item} */ (currPos.left || currPos.right).parent);
  if (parent._searchMarker) {
    updateMarkerChanges(parent._searchMarker, currPos.index, -startLength + length);
  }
  return currPos
};

/**
 * The Quill Delta format represents changes on a text document with
 * formatting information. For mor information visit {@link https://quilljs.com/docs/delta/|Quill Delta}
 *
 * @example
 *   {
 *     ops: [
 *       { insert: 'Gandalf', attributes: { bold: true } },
 *       { insert: ' the ' },
 *       { insert: 'Grey', attributes: { color: '#cccccc' } }
 *     ]
 *   }
 *
 */

/**
  * Attributes that can be assigned to a selection of text.
  *
  * @example
  *   {
  *     bold: true,
  *     font-size: '40px'
  *   }
  *
  * @typedef {Object} TextAttributes
  */

/**
 * @typedef {Object} DeltaItem
 * @property {number|undefined} DeltaItem.delete
 * @property {number|undefined} DeltaItem.retain
 * @property {string|undefined} DeltaItem.insert
 * @property {Object<string,any>} DeltaItem.attributes
 */

/**
 * Event that describes the changes on a YText type.
 */
class YTextEvent extends YEvent {
  /**
   * @param {YText} ytext
   * @param {Transaction} transaction
   * @param {Set<any>} subs The keys that changed
   */
  constructor (ytext, transaction, subs) {
    super(ytext, transaction);
    /**
     * @type {Array<DeltaItem>|null}
     */
    this._delta = null;
    /**
     * Whether the children changed.
     * @type {Boolean}
     * @private
     */
    this.childListChanged = false;
    /**
     * Set of all changed attributes.
     * @type {Set<string>}
     */
    this.keysChanged = new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.keysChanged.add(sub);
      }
    });
  }

  /**
   * Compute the changes in the delta format.
   * A {@link https://quilljs.com/docs/delta/|Quill Delta}) that represents the changes on the document.
   *
   * @type {Array<DeltaItem>}
   *
   * @public
   */
  get delta () {
    if (this._delta === null) {
      const y = /** @type {Doc} */ (this.target.doc);
      this._delta = [];
      transact(y, transaction => {
        const delta = /** @type {Array<DeltaItem>} */ (this._delta);
        const currentAttributes = new Map(); // saves all current attributes for insert
        const oldAttributes = new Map();
        let item = this.target._start;
        /**
         * @type {string?}
         */
        let action = null;
        /**
         * @type {Object<string,any>}
         */
        const attributes = {}; // counts added or removed new attributes for retain
        /**
         * @type {string|object}
         */
        let insert = '';
        let retain = 0;
        let deleteLen = 0;
        const addOp = () => {
          if (action !== null) {
            /**
             * @type {any}
             */
            let op;
            switch (action) {
              case 'delete':
                op = { delete: deleteLen };
                deleteLen = 0;
                break
              case 'insert':
                op = { insert };
                if (currentAttributes.size > 0) {
                  op.attributes = {};
                  currentAttributes.forEach((value, key) => {
                    if (value !== null) {
                      op.attributes[key] = value;
                    }
                  });
                }
                insert = '';
                break
              case 'retain':
                op = { retain };
                if (Object.keys(attributes).length > 0) {
                  op.attributes = {};
                  for (const key in attributes) {
                    op.attributes[key] = attributes[key];
                  }
                }
                retain = 0;
                break
            }
            delta.push(op);
            action = null;
          }
        };
        while (item !== null) {
          switch (item.content.constructor) {
            case ContentEmbed:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  addOp();
                  action = 'insert';
                  insert = /** @type {ContentEmbed} */ (item.content).embed;
                  addOp();
                }
              } else if (this.deletes(item)) {
                if (action !== 'delete') {
                  addOp();
                  action = 'delete';
                }
                deleteLen += 1;
              } else if (!item.deleted) {
                if (action !== 'retain') {
                  addOp();
                  action = 'retain';
                }
                retain += 1;
              }
              break
            case ContentString:
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  if (action !== 'insert') {
                    addOp();
                    action = 'insert';
                  }
                  insert += /** @type {ContentString} */ (item.content).str;
                }
              } else if (this.deletes(item)) {
                if (action !== 'delete') {
                  addOp();
                  action = 'delete';
                }
                deleteLen += item.length;
              } else if (!item.deleted) {
                if (action !== 'retain') {
                  addOp();
                  action = 'retain';
                }
                retain += item.length;
              }
              break
            case ContentFormat: {
              const { key, value } = /** @type {ContentFormat} */ (item.content);
              if (this.adds(item)) {
                if (!this.deletes(item)) {
                  const curVal = currentAttributes.get(key) || null;
                  if (!equalAttrs(curVal, value)) {
                    if (action === 'retain') {
                      addOp();
                    }
                    if (equalAttrs(value, (oldAttributes.get(key) || null))) {
                      delete attributes[key];
                    } else {
                      attributes[key] = value;
                    }
                  } else {
                    item.delete(transaction);
                  }
                }
              } else if (this.deletes(item)) {
                oldAttributes.set(key, value);
                const curVal = currentAttributes.get(key) || null;
                if (!equalAttrs(curVal, value)) {
                  if (action === 'retain') {
                    addOp();
                  }
                  attributes[key] = curVal;
                }
              } else if (!item.deleted) {
                oldAttributes.set(key, value);
                const attr = attributes[key];
                if (attr !== undefined) {
                  if (!equalAttrs(attr, value)) {
                    if (action === 'retain') {
                      addOp();
                    }
                    if (value === null) {
                      attributes[key] = value;
                    } else {
                      delete attributes[key];
                    }
                  } else {
                    item.delete(transaction);
                  }
                }
              }
              if (!item.deleted) {
                if (action === 'insert') {
                  addOp();
                }
                updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (item.content));
              }
              break
            }
          }
          item = item.right;
        }
        addOp();
        while (delta.length > 0) {
          const lastOp = delta[delta.length - 1];
          if (lastOp.retain !== undefined && lastOp.attributes === undefined) {
            // retain delta's if they don't assign attributes
            delta.pop();
          } else {
            break
          }
        }
      });
    }
    return this._delta
  }
}

/**
 * Type that represents text with formatting information.
 *
 * This type replaces y-richtext as this implementation is able to handle
 * block formats (format information on a paragraph), embeds (complex elements
 * like pictures and videos), and text formats (**bold**, *italic*).
 *
 * @extends AbstractType<YTextEvent>
 */
class YText extends AbstractType {
  /**
   * @param {String} [string] The initial value of the YText.
   */
  constructor (string) {
    super();
    /**
     * Array of pending operations on this type
     * @type {Array<function():void>?}
     */
    this._pending = string !== undefined ? [() => this.insert(0, string)] : [];
    /**
     * @type {Array<ArraySearchMarker>}
     */
    this._searchMarker = [];
  }

  /**
   * Number of characters of this text type.
   *
   * @type {number}
   */
  get length () {
    return this._length
  }

  /**
   * @param {Doc} y
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item);
    try {
      /** @type {Array<function>} */ (this._pending).forEach(f => f());
    } catch (e) {
      console.error(e);
    }
    this._pending = null;
  }

  _copy () {
    return new YText()
  }

  /**
   * @return {YText}
   */
  clone () {
    const text = new YText();
    text.applyDelta(this.toDelta());
    return text
  }

  /**
   * Creates YTextEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    super._callObserver(transaction, parentSubs);
    const event = new YTextEvent(this, transaction, parentSubs);
    const doc = transaction.doc;
    // If a remote change happened, we try to cleanup potential formatting duplicates.
    if (!transaction.local) {
      // check if another formatting item was inserted
      let foundFormattingItem = false;
      for (const [client, afterClock] of transaction.afterState.entries()) {
        const clock = transaction.beforeState.get(client) || 0;
        if (afterClock === clock) {
          continue
        }
        iterateStructs(transaction, /** @type {Array<Item|GC>} */ (doc.store.clients.get(client)), clock, afterClock, item => {
          if (!item.deleted && /** @type {Item} */ (item).content.constructor === ContentFormat) {
            foundFormattingItem = true;
          }
        });
        if (foundFormattingItem) {
          break
        }
      }
      if (!foundFormattingItem) {
        iterateDeletedStructs(transaction, transaction.deleteSet, item => {
          if (item instanceof GC || foundFormattingItem) {
            return
          }
          if (item.parent === this && item.content.constructor === ContentFormat) {
            foundFormattingItem = true;
          }
        });
      }
      transact(doc, (t) => {
        if (foundFormattingItem) {
          // If a formatting item was inserted, we simply clean the whole type.
          // We need to compute currentAttributes for the current position anyway.
          cleanupYTextFormatting(this);
        } else {
          // If no formatting attribute was inserted, we can make due with contextless
          // formatting cleanups.
          // Contextless: it is not necessary to compute currentAttributes for the affected position.
          iterateDeletedStructs(t, t.deleteSet, item => {
            if (item instanceof GC) {
              return
            }
            if (item.parent === this) {
              cleanupContextlessFormattingGap(t, item);
            }
          });
        }
      });
    }
    callTypeObservers(this, transaction, event);
  }

  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @public
   */
  toString () {
    let str = '';
    /**
     * @type {Item|null}
     */
    let n = this._start;
    while (n !== null) {
      if (!n.deleted && n.countable && n.content.constructor === ContentString) {
        str += /** @type {ContentString} */ (n.content).str;
      }
      n = n.right;
    }
    return str
  }

  /**
   * Returns the unformatted string representation of this YText type.
   *
   * @return {string}
   * @public
   */
  toJSON () {
    return this.toString()
  }

  /**
   * Apply a {@link Delta} on this shared YText type.
   *
   * @param {any} delta The changes to apply on this element.
   * @param {object}  [opts]
   * @param {boolean} [opts.sanitize] Sanitize input delta. Removes ending newlines if set to true.
   *
   *
   * @public
   */
  applyDelta (delta, { sanitize = true } = {}) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        const currPos = new ItemTextListPosition(null, this._start, 0, new Map());
        for (let i = 0; i < delta.length; i++) {
          const op = delta[i];
          if (op.insert !== undefined) {
            // Quill assumes that the content starts with an empty paragraph.
            // Yjs/Y.Text assumes that it starts empty. We always hide that
            // there is a newline at the end of the content.
            // If we omit this step, clients will see a different number of
            // paragraphs, but nothing bad will happen.
            const ins = (!sanitize && typeof op.insert === 'string' && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === '\n') ? op.insert.slice(0, -1) : op.insert;
            if (typeof ins !== 'string' || ins.length > 0) {
              insertText(transaction, this, currPos, ins, op.attributes || {});
            }
          } else if (op.retain !== undefined) {
            formatText(transaction, this, currPos, op.retain, op.attributes || {});
          } else if (op.delete !== undefined) {
            deleteText(transaction, currPos, op.delete);
          }
        }
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.applyDelta(delta));
    }
  }

  /**
   * Returns the Delta representation of this YText type.
   *
   * @param {Snapshot} [snapshot]
   * @param {Snapshot} [prevSnapshot]
   * @param {function('removed' | 'added', ID):any} [computeYChange]
   * @return {any} The Delta representation of this type.
   *
   * @public
   */
  toDelta (snapshot, prevSnapshot, computeYChange) {
    /**
     * @type{Array<any>}
     */
    const ops = [];
    const currentAttributes = new Map();
    const doc = /** @type {Doc} */ (this.doc);
    let str = '';
    let n = this._start;
    function packStr () {
      if (str.length > 0) {
        // pack str with attributes to ops
        /**
         * @type {Object<string,any>}
         */
        const attributes = {};
        let addAttributes = false;
        currentAttributes.forEach((value, key) => {
          addAttributes = true;
          attributes[key] = value;
        });
        /**
         * @type {Object<string,any>}
         */
        const op = { insert: str };
        if (addAttributes) {
          op.attributes = attributes;
        }
        ops.push(op);
        str = '';
      }
    }
    // snapshots are merged again after the transaction, so we need to keep the
    // transalive until we are done
    transact(doc, transaction => {
      if (snapshot) {
        splitSnapshotAffectedStructs(transaction, snapshot);
      }
      if (prevSnapshot) {
        splitSnapshotAffectedStructs(transaction, prevSnapshot);
      }
      while (n !== null) {
        if (isVisible(n, snapshot) || (prevSnapshot !== undefined && isVisible(n, prevSnapshot))) {
          switch (n.content.constructor) {
            case ContentString: {
              const cur = currentAttributes.get('ychange');
              if (snapshot !== undefined && !isVisible(n, snapshot)) {
                if (cur === undefined || cur.user !== n.id.client || cur.state !== 'removed') {
                  packStr();
                  currentAttributes.set('ychange', computeYChange ? computeYChange('removed', n.id) : { type: 'removed' });
                }
              } else if (prevSnapshot !== undefined && !isVisible(n, prevSnapshot)) {
                if (cur === undefined || cur.user !== n.id.client || cur.state !== 'added') {
                  packStr();
                  currentAttributes.set('ychange', computeYChange ? computeYChange('added', n.id) : { type: 'added' });
                }
              } else if (cur !== undefined) {
                packStr();
                currentAttributes.delete('ychange');
              }
              str += /** @type {ContentString} */ (n.content).str;
              break
            }
            case ContentEmbed: {
              packStr();
              /**
               * @type {Object<string,any>}
               */
              const op = {
                insert: /** @type {ContentEmbed} */ (n.content).embed
              };
              if (currentAttributes.size > 0) {
                const attrs = /** @type {Object<string,any>} */ ({});
                op.attributes = attrs;
                currentAttributes.forEach((value, key) => {
                  attrs[key] = value;
                });
              }
              ops.push(op);
              break
            }
            case ContentFormat:
              if (isVisible(n, snapshot)) {
                packStr();
                updateCurrentAttributes(currentAttributes, /** @type {ContentFormat} */ (n.content));
              }
              break
          }
        }
        n = n.right;
      }
      packStr();
    }, splitSnapshotAffectedStructs);
    return ops
  }

  /**
   * Insert text at a given index.
   *
   * @param {number} index The index at which to start inserting.
   * @param {String} text The text to insert at the specified position.
   * @param {TextAttributes} [attributes] Optionally define some formatting
   *                                    information to apply on the inserted
   *                                    Text.
   * @public
   */
  insert (index, text, attributes) {
    if (text.length <= 0) {
      return
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, transaction => {
        const pos = findPosition(transaction, this, index);
        if (!attributes) {
          attributes = {};
          // @ts-ignore
          pos.currentAttributes.forEach((v, k) => { attributes[k] = v; });
        }
        insertText(transaction, this, pos, text, attributes);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.insert(index, text, attributes));
    }
  }

  /**
   * Inserts an embed at a index.
   *
   * @param {number} index The index to insert the embed at.
   * @param {Object} embed The Object that represents the embed.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    embed
   *
   * @public
   */
  insertEmbed (index, embed, attributes = {}) {
    if (embed.constructor !== Object) {
      throw new Error('Embed must be an Object')
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, transaction => {
        const pos = findPosition(transaction, this, index);
        insertText(transaction, this, pos, embed, attributes);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.insertEmbed(index, embed, attributes));
    }
  }

  /**
   * Deletes text starting from an index.
   *
   * @param {number} index Index at which to start deleting.
   * @param {number} length The number of characters to remove. Defaults to 1.
   *
   * @public
   */
  delete (index, length) {
    if (length === 0) {
      return
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, transaction => {
        deleteText(transaction, findPosition(transaction, this, index), length);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.delete(index, length));
    }
  }

  /**
   * Assigns properties to a range of text.
   *
   * @param {number} index The position where to start formatting.
   * @param {number} length The amount of characters to assign properties to.
   * @param {TextAttributes} attributes Attribute information to apply on the
   *                                    text.
   *
   * @public
   */
  format (index, length, attributes) {
    if (length === 0) {
      return
    }
    const y = this.doc;
    if (y !== null) {
      transact(y, transaction => {
        const pos = findPosition(transaction, this, index);
        if (pos.right === null) {
          return
        }
        formatText(transaction, this, pos, length, attributes);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.format(index, length, attributes));
    }
  }

  /**
   * Removes an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute (attributeName) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.removeAttribute(attributeName));
    }
  }

  /**
   * Sets or updates an attribute.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {any} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute (attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      /** @type {Array<function>} */ (this._pending).push(() => this.setAttribute(attributeName, attributeValue));
    }
  }

  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {any} The queried attribute value.
   *
   * @public
   */
  getAttribute (attributeName) {
    return /** @type {any} */ (typeMapGet(this, attributeName))
  }

  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @note Xml-Text nodes don't have attributes. You can use this feature to assign properties to complete text-blocks.
   *
   * @param {Snapshot} [snapshot]
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes (snapshot) {
    return typeMapGetAll(this)
  }

  /**
   * @param {AbstractUpdateEncoder} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YTextRefID);
  }
}

/**
 * @param {AbstractUpdateDecoder} decoder
 * @return {YText}
 *
 * @private
 * @function
 */
const readYText = decoder => new YText();

/**
 * @module YXml
 */

/**
 * Define the elements to which a set of CSS queries apply.
 * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors|CSS_Selectors}
 *
 * @example
 *   query = '.classSelector'
 *   query = 'nodeSelector'
 *   query = '#idSelector'
 *
 * @typedef {string} CSS_Selector
 */

/**
 * Dom filter function.
 *
 * @callback domFilter
 * @param {string} nodeName The nodeName of the element
 * @param {Map} attributes The map of attributes.
 * @return {boolean} Whether to include the Dom node in the YXmlElement.
 */

/**
 * Represents a subset of the nodes of a YXmlElement / YXmlFragment and a
 * position within them.
 *
 * Can be created with {@link YXmlFragment#createTreeWalker}
 *
 * @public
 * @implements {Iterable<YXmlElement|YXmlText|YXmlElement|YXmlHook>}
 */
class YXmlTreeWalker {
  /**
   * @param {YXmlFragment | YXmlElement} root
   * @param {function(AbstractType<any>):boolean} [f]
   */
  constructor (root, f = () => true) {
    this._filter = f;
    this._root = root;
    /**
     * @type {Item}
     */
    this._currentNode = /** @type {Item} */ (root._start);
    this._firstCall = true;
  }

  [Symbol.iterator] () {
    return this
  }

  /**
   * Get the next node.
   *
   * @return {IteratorResult<YXmlElement|YXmlText|YXmlHook>} The next node.
   *
   * @public
   */
  next () {
    /**
     * @type {Item|null}
     */
    let n = this._currentNode;
    let type = /** @type {any} */ (n.content).type;
    if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) { // if first call, we check if we can use the first item
      do {
        type = /** @type {any} */ (n.content).type;
        if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
          // walk down in the tree
          n = type._start;
        } else {
          // walk right or up in the tree
          while (n !== null) {
            if (n.right !== null) {
              n = n.right;
              break
            } else if (n.parent === this._root) {
              n = null;
            } else {
              n = /** @type {AbstractType<any>} */ (n.parent)._item;
            }
          }
        }
      } while (n !== null && (n.deleted || !this._filter(/** @type {ContentType} */ (n.content).type)))
    }
    this._firstCall = false;
    if (n === null) {
      // @ts-ignore
      return { value: undefined, done: true }
    }
    this._currentNode = n;
    return { value: /** @type {any} */ (n.content).type, done: false }
  }
}

/**
 * Represents a list of {@link YXmlElement}.and {@link YXmlText} types.
 * A YxmlFragment is similar to a {@link YXmlElement}, but it does not have a
 * nodeName and it does not have attributes. Though it can be bound to a DOM
 * element - in this case the attributes and the nodeName are not shared.
 *
 * @public
 * @extends AbstractType<YXmlEvent>
 */
class YXmlFragment extends AbstractType {
  constructor () {
    super();
    /**
     * @type {Array<any>|null}
     */
    this._prelimContent = [];
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get firstChild () {
    const first = this._first;
    return first ? first.content.getContent()[0] : null
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item);
    this.insert(0, /** @type {Array<any>} */ (this._prelimContent));
    this._prelimContent = null;
  }

  _copy () {
    return new YXmlFragment()
  }

  /**
   * @return {YXmlFragment}
   */
  clone () {
    const el = new YXmlFragment();
    // @ts-ignore
    el.insert(0, el.toArray().map(item => item instanceof AbstractType ? item.clone() : item));
    return el
  }

  get length () {
    return this._prelimContent === null ? this._length : this._prelimContent.length
  }

  /**
   * Create a subtree of childNodes.
   *
   * @example
   * const walker = elem.createTreeWalker(dom => dom.nodeName === 'div')
   * for (let node in walker) {
   *   // `node` is a div node
   *   nop(node)
   * }
   *
   * @param {function(AbstractType<any>):boolean} filter Function that is called on each child element and
   *                          returns a Boolean indicating whether the child
   *                          is to be included in the subtree.
   * @return {YXmlTreeWalker} A subtree and a position within it.
   *
   * @public
   */
  createTreeWalker (filter) {
    return new YXmlTreeWalker(this, filter)
  }

  /**
   * Returns the first YXmlElement that matches the query.
   * Similar to DOM's {@link querySelector}.
   *
   * Query support:
   *   - tagname
   * TODO:
   *   - id
   *   - attribute
   *
   * @param {CSS_Selector} query The query on the children.
   * @return {YXmlElement|YXmlText|YXmlHook|null} The first element that matches the query or null.
   *
   * @public
   */
  querySelector (query) {
    query = query.toUpperCase();
    // @ts-ignore
    const iterator = new YXmlTreeWalker(this, element => element.nodeName && element.nodeName.toUpperCase() === query);
    const next = iterator.next();
    if (next.done) {
      return null
    } else {
      return next.value
    }
  }

  /**
   * Returns all YXmlElements that match the query.
   * Similar to Dom's {@link querySelectorAll}.
   *
   * @todo Does not yet support all queries. Currently only query by tagName.
   *
   * @param {CSS_Selector} query The query on the children
   * @return {Array<YXmlElement|YXmlText|YXmlHook|null>} The elements that match this query.
   *
   * @public
   */
  querySelectorAll (query) {
    query = query.toUpperCase();
    // @ts-ignore
    return Array.from(new YXmlTreeWalker(this, element => element.nodeName && element.nodeName.toUpperCase() === query))
  }

  /**
   * Creates YXmlEvent and calls observers.
   *
   * @param {Transaction} transaction
   * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
   */
  _callObserver (transaction, parentSubs) {
    callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
  }

  /**
   * Get the string representation of all the children of this YXmlFragment.
   *
   * @return {string} The string representation of all children.
   */
  toString () {
    return typeListMap(this, xml => xml.toString()).join('')
  }

  /**
   * @return {string}
   */
  toJSON () {
    return this.toString()
  }

  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks = {}, binding) {
    const fragment = _document.createDocumentFragment();
    if (binding !== undefined) {
      binding._createAssociation(fragment, this);
    }
    typeListForEach(this, xmlType => {
      fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
    });
    return fragment
  }

  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {number} index The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insert (index, content) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeListInsertGenerics(transaction, this, index, content);
      });
    } else {
      // @ts-ignore _prelimContent is defined because this is not yet integrated
      this._prelimContent.splice(index, 0, ...content);
    }
  }

  /**
   * Inserts new content at an index.
   *
   * @example
   *  // Insert character 'a' at position 0
   *  xml.insert(0, [new Y.XmlText('text')])
   *
   * @param {null|Item|YXmlElement|YXmlText} ref The index to insert content at
   * @param {Array<YXmlElement|YXmlText>} content The array of content
   */
  insertAfter (ref, content) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        const refItem = (ref && ref instanceof AbstractType) ? ref._item : ref;
        typeListInsertGenericsAfter(transaction, this, refItem, content);
      });
    } else {
      const pc = /** @type {Array<any>} */ (this._prelimContent);
      const index = ref === null ? 0 : pc.findIndex(el => el === ref) + 1;
      if (index === 0 && ref !== null) {
        throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["create"])('Reference item not found')
      }
      pc.splice(index, 0, ...content);
    }
  }

  /**
   * Deletes elements starting from an index.
   *
   * @param {number} index Index at which to start deleting elements
   * @param {number} [length=1] The number of elements to remove. Defaults to 1.
   */
  delete (index, length = 1) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeListDelete(transaction, this, index, length);
      });
    } else {
      // @ts-ignore _prelimContent is defined because this is not yet integrated
      this._prelimContent.splice(index, length);
    }
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @return {Array<YXmlElement|YXmlText|YXmlHook>}
   */
  toArray () {
    return typeListToArray(this)
  }

  /**
   * Appends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to append.
   */
  push (content) {
    this.insert(this.length, content);
  }

  /**
   * Preppends content to this YArray.
   *
   * @param {Array<YXmlElement|YXmlText>} content Array of content to preppend.
   */
  unshift (content) {
    this.insert(0, content);
  }

  /**
   * Returns the i-th element from a YArray.
   *
   * @param {number} index The index of the element to return from the YArray
   * @return {YXmlElement|YXmlText}
   */
  get (index) {
    return typeListGet(this, index)
  }

  /**
   * Transforms this YArray to a JavaScript Array.
   *
   * @param {number} [start]
   * @param {number} [end]
   * @return {Array<YXmlElement|YXmlText>}
   */
  slice (start = 0, end = this.length) {
    return typeListSlice(this, start, end)
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {AbstractUpdateEncoder} encoder The encoder to write data to.
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlFragmentRefID);
  }
}

/**
 * @param {AbstractUpdateDecoder} decoder
 * @return {YXmlFragment}
 *
 * @private
 * @function
 */
const readYXmlFragment = decoder => new YXmlFragment();

/**
 * An YXmlElement imitates the behavior of a
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}.
 *
 * * An YXmlElement has attributes (key value pairs)
 * * An YXmlElement has childElements that must inherit from YXmlElement
 */
class YXmlElement extends YXmlFragment {
  constructor (nodeName = 'UNDEFINED') {
    super();
    this.nodeName = nodeName;
    /**
     * @type {Map<string, any>|null}
     */
    this._prelimAttrs = new Map();
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling () {
    const n = this._item ? this._item.next : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling () {
    const n = this._item ? this._item.prev : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  /**
   * Integrate this type into the Yjs instance.
   *
   * * Save this struct in the os
   * * This type is sent to other client
   * * Observer functions are fired
   *
   * @param {Doc} y The Yjs instance
   * @param {Item} item
   */
  _integrate (y, item) {
    super._integrate(y, item)
    ;(/** @type {Map<string, any>} */ (this._prelimAttrs)).forEach((value, key) => {
      this.setAttribute(key, value);
    });
    this._prelimAttrs = null;
  }

  /**
   * Creates an Item with the same effect as this Item (without position effect)
   *
   * @return {YXmlElement}
   */
  _copy () {
    return new YXmlElement(this.nodeName)
  }

  /**
   * @return {YXmlElement}
   */
  clone () {
    const el = new YXmlElement(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
    // @ts-ignore
    el.insert(0, el.toArray().map(item => item instanceof AbstractType ? item.clone() : item));
    return el
  }

  /**
   * Returns the XML serialization of this YXmlElement.
   * The attributes are ordered by attribute-name, so you can easily use this
   * method to compare YXmlElements
   *
   * @return {string} The string representation of this type.
   *
   * @public
   */
  toString () {
    const attrs = this.getAttributes();
    const stringBuilder = [];
    const keys = [];
    for (const key in attrs) {
      keys.push(key);
    }
    keys.sort();
    const keysLen = keys.length;
    for (let i = 0; i < keysLen; i++) {
      const key = keys[i];
      stringBuilder.push(key + '="' + attrs[key] + '"');
    }
    const nodeName = this.nodeName.toLocaleLowerCase();
    const attrsString = stringBuilder.length > 0 ? ' ' + stringBuilder.join(' ') : '';
    return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`
  }

  /**
   * Removes an attribute from this YXmlElement.
   *
   * @param {String} attributeName The attribute name that is to be removed.
   *
   * @public
   */
  removeAttribute (attributeName) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapDelete(transaction, this, attributeName);
      });
    } else {
      /** @type {Map<string,any>} */ (this._prelimAttrs).delete(attributeName);
    }
  }

  /**
   * Sets or updates an attribute.
   *
   * @param {String} attributeName The attribute name that is to be set.
   * @param {String} attributeValue The attribute value that is to be set.
   *
   * @public
   */
  setAttribute (attributeName, attributeValue) {
    if (this.doc !== null) {
      transact(this.doc, transaction => {
        typeMapSet(transaction, this, attributeName, attributeValue);
      });
    } else {
      /** @type {Map<string, any>} */ (this._prelimAttrs).set(attributeName, attributeValue);
    }
  }

  /**
   * Returns an attribute value that belongs to the attribute name.
   *
   * @param {String} attributeName The attribute name that identifies the
   *                               queried value.
   * @return {String} The queried attribute value.
   *
   * @public
   */
  getAttribute (attributeName) {
    return /** @type {any} */ (typeMapGet(this, attributeName))
  }

  /**
   * Returns all attribute name/value pairs in a JSON Object.
   *
   * @param {Snapshot} [snapshot]
   * @return {Object<string, any>} A JSON Object that describes the attributes.
   *
   * @public
   */
  getAttributes (snapshot) {
    return typeMapGetAll(this)
  }

  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks={}] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Node} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks = {}, binding) {
    const dom = _document.createElement(this.nodeName);
    const attrs = this.getAttributes();
    for (const key in attrs) {
      dom.setAttribute(key, attrs[key]);
    }
    typeListForEach(this, yxml => {
      dom.appendChild(yxml.toDOM(_document, hooks, binding));
    });
    if (binding !== undefined) {
      binding._createAssociation(dom, this);
    }
    return dom
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {AbstractUpdateEncoder} encoder The encoder to write data to.
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlElementRefID);
    encoder.writeKey(this.nodeName);
  }
}

/**
 * @param {AbstractUpdateDecoder} decoder
 * @return {YXmlElement}
 *
 * @function
 */
const readYXmlElement = decoder => new YXmlElement(decoder.readKey());

/**
 * An Event that describes changes on a YXml Element or Yxml Fragment
 */
class YXmlEvent extends YEvent {
  /**
   * @param {YXmlElement|YXmlText|YXmlFragment} target The target on which the event is created.
   * @param {Set<string|null>} subs The set of changed attributes. `null` is included if the
   *                   child list changed.
   * @param {Transaction} transaction The transaction instance with wich the
   *                                  change was created.
   */
  constructor (target, subs, transaction) {
    super(target, transaction);
    /**
     * Whether the children changed.
     * @type {Boolean}
     * @private
     */
    this.childListChanged = false;
    /**
     * Set of all changed attributes.
     * @type {Set<string>}
     */
    this.attributesChanged = new Set();
    subs.forEach((sub) => {
      if (sub === null) {
        this.childListChanged = true;
      } else {
        this.attributesChanged.add(sub);
      }
    });
  }
}

/**
 * You can manage binding to a custom type with YXmlHook.
 *
 * @extends {YMap<any>}
 */
class YXmlHook extends YMap {
  /**
   * @param {string} hookName nodeName of the Dom Node.
   */
  constructor (hookName) {
    super();
    /**
     * @type {string}
     */
    this.hookName = hookName;
  }

  /**
   * Creates an Item with the same effect as this Item (without position effect)
   */
  _copy () {
    return new YXmlHook(this.hookName)
  }

  /**
   * @return {YXmlHook}
   */
  clone () {
    const el = new YXmlHook(this.hookName);
    this.forEach((value, key) => {
      el.set(key, value);
    });
    return el
  }

  /**
   * Creates a Dom Element that mirrors this YXmlElement.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object.<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type
   * @return {Element} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks = {}, binding) {
    const hook = hooks[this.hookName];
    let dom;
    if (hook !== undefined) {
      dom = hook.createDom(this);
    } else {
      dom = document.createElement(this.hookName);
    }
    dom.setAttribute('data-yjs-hook', this.hookName);
    if (binding !== undefined) {
      binding._createAssociation(dom, this);
    }
    return dom
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {AbstractUpdateEncoder} encoder The encoder to write data to.
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlHookRefID);
    encoder.writeKey(this.hookName);
  }
}

/**
 * @param {AbstractUpdateDecoder} decoder
 * @return {YXmlHook}
 *
 * @private
 * @function
 */
const readYXmlHook = decoder =>
  new YXmlHook(decoder.readKey());

/**
 * Represents text in a Dom Element. In the future this type will also handle
 * simple formatting information like bold and italic.
 */
class YXmlText extends YText {
  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get nextSibling () {
    const n = this._item ? this._item.next : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  /**
   * @type {YXmlElement|YXmlText|null}
   */
  get prevSibling () {
    const n = this._item ? this._item.prev : null;
    return n ? /** @type {YXmlElement|YXmlText} */ (/** @type {ContentType} */ (n.content).type) : null
  }

  _copy () {
    return new YXmlText()
  }

  /**
   * @return {YXmlText}
   */
  clone () {
    const text = new YXmlText();
    text.applyDelta(this.toDelta());
    return text
  }

  /**
   * Creates a Dom Element that mirrors this YXmlText.
   *
   * @param {Document} [_document=document] The document object (you must define
   *                                        this when calling this method in
   *                                        nodejs)
   * @param {Object<string, any>} [hooks] Optional property to customize how hooks
   *                                             are presented in the DOM
   * @param {any} [binding] You should not set this property. This is
   *                               used if DomBinding wants to create a
   *                               association to the created DOM type.
   * @return {Text} The {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Dom Element}
   *
   * @public
   */
  toDOM (_document = document, hooks, binding) {
    const dom = _document.createTextNode(this.toString());
    if (binding !== undefined) {
      binding._createAssociation(dom, this);
    }
    return dom
  }

  toString () {
    // @ts-ignore
    return this.toDelta().map(delta => {
      const nestedNodes = [];
      for (const nodeName in delta.attributes) {
        const attrs = [];
        for (const key in delta.attributes[nodeName]) {
          attrs.push({ key, value: delta.attributes[nodeName][key] });
        }
        // sort attributes to get a unique order
        attrs.sort((a, b) => a.key < b.key ? -1 : 1);
        nestedNodes.push({ nodeName, attrs });
      }
      // sort node order to get a unique order
      nestedNodes.sort((a, b) => a.nodeName < b.nodeName ? -1 : 1);
      // now convert to dom string
      let str = '';
      for (let i = 0; i < nestedNodes.length; i++) {
        const node = nestedNodes[i];
        str += `<${node.nodeName}`;
        for (let j = 0; j < node.attrs.length; j++) {
          const attr = node.attrs[j];
          str += ` ${attr.key}="${attr.value}"`;
        }
        str += '>';
      }
      str += delta.insert;
      for (let i = nestedNodes.length - 1; i >= 0; i--) {
        str += `</${nestedNodes[i].nodeName}>`;
      }
      return str
    }).join('')
  }

  /**
   * @return {string}
   */
  toJSON () {
    return this.toString()
  }

  /**
   * @param {AbstractUpdateEncoder} encoder
   */
  _write (encoder) {
    encoder.writeTypeRef(YXmlTextRefID);
  }
}

/**
 * @param {AbstractUpdateDecoder} decoder
 * @return {YXmlText}
 *
 * @private
 * @function
 */
const readYXmlText = decoder => new YXmlText();

class AbstractStruct {
  /**
   * @param {ID} id
   * @param {number} length
   */
  constructor (id, length) {
    this.id = id;
    this.length = length;
  }

  /**
   * @type {boolean}
   */
  get deleted () {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["methodUnimplemented"])()
  }

  /**
   * Merge this struct with the item to the right.
   * This method is already assuming that `this.id.clock + this.length === this.id.clock`.
   * Also this method does *not* remove right from StructStore!
   * @param {AbstractStruct} right
   * @return {boolean} wether this merged with right
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {AbstractUpdateEncoder} encoder The encoder to write data to.
   * @param {number} offset
   * @param {number} encodingRef
   */
  write (encoder, offset, encodingRef) {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["methodUnimplemented"])()
  }

  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["methodUnimplemented"])()
  }
}

const structGCRefNumber = 0;

/**
 * @private
 */
class GC extends AbstractStruct {
  get deleted () {
    return true
  }

  delete () {}

  /**
   * @param {GC} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.length += right.length;
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.length -= offset;
    }
    addStruct(transaction.doc.store, this);
  }

  /**
   * @param {AbstractUpdateEncoder} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeInfo(structGCRefNumber);
    encoder.writeLen(this.length - offset);
  }

  /**
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing (transaction, store) {
    return null
  }
}

class ContentBinary {
  /**
   * @param {Uint8Array} content
   */
  constructor (content) {
    this.content = content;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.content]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentBinary}
   */
  copy () {
    return new ContentBinary(this.content)
  }

  /**
   * @param {number} offset
   * @return {ContentBinary}
   */
  splice (offset) {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["methodUnimplemented"])()
  }

  /**
   * @param {ContentBinary} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {AbstractUpdateEncoder} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeBuf(this.content);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 3
  }
}

/**
 * @param {AbstractUpdateDecoder} decoder
 * @return {ContentBinary}
 */
const readContentBinary = decoder => new ContentBinary(decoder.readBuf());

class ContentDeleted {
  /**
   * @param {number} len
   */
  constructor (len) {
    this.len = len;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.len
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return []
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return false
  }

  /**
   * @return {ContentDeleted}
   */
  copy () {
    return new ContentDeleted(this.len)
  }

  /**
   * @param {number} offset
   * @return {ContentDeleted}
   */
  splice (offset) {
    const right = new ContentDeleted(this.len - offset);
    this.len = offset;
    return right
  }

  /**
   * @param {ContentDeleted} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.len += right.len;
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    addToDeleteSet(transaction.deleteSet, item.id.client, item.id.clock, this.len);
    item.markDeleted();
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {AbstractUpdateEncoder} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeLen(this.len - offset);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 1
  }
}

/**
 * @private
 *
 * @param {AbstractUpdateDecoder} decoder
 * @return {ContentDeleted}
 */
const readContentDeleted = decoder => new ContentDeleted(decoder.readLen());

/**
 * @private
 */
class ContentDoc {
  /**
   * @param {Doc} doc
   */
  constructor (doc) {
    if (doc._item) {
      console.error('This document was already integrated as a sub-document. You should create a second instance instead with the same guid.');
    }
    /**
     * @type {Doc}
     */
    this.doc = doc;
    /**
     * @type {any}
     */
    const opts = {};
    this.opts = opts;
    if (!doc.gc) {
      opts.gc = false;
    }
    if (doc.autoLoad) {
      opts.autoLoad = true;
    }
    if (doc.meta !== null) {
      opts.meta = doc.meta;
    }
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.doc]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentDoc}
   */
  copy () {
    return new ContentDoc(this.doc)
  }

  /**
   * @param {number} offset
   * @return {ContentDoc}
   */
  splice (offset) {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["methodUnimplemented"])()
  }

  /**
   * @param {ContentDoc} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    // this needs to be reflected in doc.destroy as well
    this.doc._item = item;
    transaction.subdocsAdded.add(this.doc);
    if (this.doc.shouldLoad) {
      transaction.subdocsLoaded.add(this.doc);
    }
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {
    if (transaction.subdocsAdded.has(this.doc)) {
      transaction.subdocsAdded.delete(this.doc);
    } else {
      transaction.subdocsRemoved.add(this.doc);
    }
  }

  /**
   * @param {StructStore} store
   */
  gc (store) { }

  /**
   * @param {AbstractUpdateEncoder} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeString(this.doc.guid);
    encoder.writeAny(this.opts);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 9
  }
}

/**
 * @private
 *
 * @param {AbstractUpdateDecoder} decoder
 * @return {ContentDoc}
 */
const readContentDoc = decoder => new ContentDoc(new Doc({ guid: decoder.readString(), ...decoder.readAny() }));

/**
 * @private
 */
class ContentEmbed {
  /**
   * @param {Object} embed
   */
  constructor (embed) {
    this.embed = embed;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.embed]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentEmbed}
   */
  copy () {
    return new ContentEmbed(this.embed)
  }

  /**
   * @param {number} offset
   * @return {ContentEmbed}
   */
  splice (offset) {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["methodUnimplemented"])()
  }

  /**
   * @param {ContentEmbed} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {AbstractUpdateEncoder} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeJSON(this.embed);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 5
  }
}

/**
 * @private
 *
 * @param {AbstractUpdateDecoder} decoder
 * @return {ContentEmbed}
 */
const readContentEmbed = decoder => new ContentEmbed(decoder.readJSON());

/**
 * @private
 */
class ContentFormat {
  /**
   * @param {string} key
   * @param {Object} value
   */
  constructor (key, value) {
    this.key = key;
    this.value = value;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return []
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return false
  }

  /**
   * @return {ContentFormat}
   */
  copy () {
    return new ContentFormat(this.key, this.value)
  }

  /**
   * @param {number} offset
   * @return {ContentFormat}
   */
  splice (offset) {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["methodUnimplemented"])()
  }

  /**
   * @param {ContentFormat} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    // @todo searchmarker are currently unsupported for rich text documents
    /** @type {AbstractType<any>} */ (item.parent)._searchMarker = null;
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {AbstractUpdateEncoder} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeKey(this.key);
    encoder.writeJSON(this.value);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 6
  }
}

/**
 * @param {AbstractUpdateDecoder} decoder
 * @return {ContentFormat}
 */
const readContentFormat = decoder => new ContentFormat(decoder.readString(), decoder.readJSON());

/**
 * @private
 */
class ContentJSON {
  /**
   * @param {Array<any>} arr
   */
  constructor (arr) {
    /**
     * @type {Array<any>}
     */
    this.arr = arr;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.arr.length
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return this.arr
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentJSON}
   */
  copy () {
    return new ContentJSON(this.arr)
  }

  /**
   * @param {number} offset
   * @return {ContentJSON}
   */
  splice (offset) {
    const right = new ContentJSON(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right
  }

  /**
   * @param {ContentJSON} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.arr = this.arr.concat(right.arr);
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {AbstractUpdateEncoder} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeString(c === undefined ? 'undefined' : JSON.stringify(c));
    }
  }

  /**
   * @return {number}
   */
  getRef () {
    return 2
  }
}

/**
 * @private
 *
 * @param {AbstractUpdateDecoder} decoder
 * @return {ContentJSON}
 */
const readContentJSON = decoder => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    const c = decoder.readString();
    if (c === 'undefined') {
      cs.push(undefined);
    } else {
      cs.push(JSON.parse(c));
    }
  }
  return new ContentJSON(cs)
};

class ContentAny {
  /**
   * @param {Array<any>} arr
   */
  constructor (arr) {
    /**
     * @type {Array<any>}
     */
    this.arr = arr;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.arr.length
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return this.arr
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentAny}
   */
  copy () {
    return new ContentAny(this.arr)
  }

  /**
   * @param {number} offset
   * @return {ContentAny}
   */
  splice (offset) {
    const right = new ContentAny(this.arr.slice(offset));
    this.arr = this.arr.slice(0, offset);
    return right
  }

  /**
   * @param {ContentAny} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.arr = this.arr.concat(right.arr);
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {AbstractUpdateEncoder} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    const len = this.arr.length;
    encoder.writeLen(len - offset);
    for (let i = offset; i < len; i++) {
      const c = this.arr[i];
      encoder.writeAny(c);
    }
  }

  /**
   * @return {number}
   */
  getRef () {
    return 8
  }
}

/**
 * @param {AbstractUpdateDecoder} decoder
 * @return {ContentAny}
 */
const readContentAny = decoder => {
  const len = decoder.readLen();
  const cs = [];
  for (let i = 0; i < len; i++) {
    cs.push(decoder.readAny());
  }
  return new ContentAny(cs)
};

/**
 * @private
 */
class ContentString {
  /**
   * @param {string} str
   */
  constructor (str) {
    /**
     * @type {string}
     */
    this.str = str;
  }

  /**
   * @return {number}
   */
  getLength () {
    return this.str.length
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return this.str.split('')
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentString}
   */
  copy () {
    return new ContentString(this.str)
  }

  /**
   * @param {number} offset
   * @return {ContentString}
   */
  splice (offset) {
    const right = new ContentString(this.str.slice(offset));
    this.str = this.str.slice(0, offset);

    // Prevent encoding invalid documents because of splitting of surrogate pairs: https://github.com/yjs/yjs/issues/248
    const firstCharCode = this.str.charCodeAt(offset - 1);
    if (firstCharCode >= 0xD800 && firstCharCode <= 0xDBFF) {
      // Last character of the left split is the start of a surrogate utf16/ucs2 pair.
      // We don't support splitting of surrogate pairs because this may lead to invalid documents.
      // Replace the invalid character with a unicode replacement character (� / U+FFFD)
      this.str = this.str.slice(0, offset - 1) + '�';
      // replace right as well
      right.str = '�' + right.str.slice(1);
    }
    return right
  }

  /**
   * @param {ContentString} right
   * @return {boolean}
   */
  mergeWith (right) {
    this.str += right.str;
    return true
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {}
  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {}
  /**
   * @param {StructStore} store
   */
  gc (store) {}
  /**
   * @param {AbstractUpdateEncoder} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
  }

  /**
   * @return {number}
   */
  getRef () {
    return 4
  }
}

/**
 * @private
 *
 * @param {AbstractUpdateDecoder} decoder
 * @return {ContentString}
 */
const readContentString = decoder => new ContentString(decoder.readString());

/**
 * @type {Array<function(AbstractUpdateDecoder):AbstractType<any>>}
 * @private
 */
const typeRefs = [
  readYArray,
  readYMap,
  readYText,
  readYXmlElement,
  readYXmlFragment,
  readYXmlHook,
  readYXmlText
];

const YArrayRefID = 0;
const YMapRefID = 1;
const YTextRefID = 2;
const YXmlElementRefID = 3;
const YXmlFragmentRefID = 4;
const YXmlHookRefID = 5;
const YXmlTextRefID = 6;

/**
 * @private
 */
class ContentType {
  /**
   * @param {AbstractType<YEvent>} type
   */
  constructor (type) {
    /**
     * @type {AbstractType<any>}
     */
    this.type = type;
  }

  /**
   * @return {number}
   */
  getLength () {
    return 1
  }

  /**
   * @return {Array<any>}
   */
  getContent () {
    return [this.type]
  }

  /**
   * @return {boolean}
   */
  isCountable () {
    return true
  }

  /**
   * @return {ContentType}
   */
  copy () {
    return new ContentType(this.type._copy())
  }

  /**
   * @param {number} offset
   * @return {ContentType}
   */
  splice (offset) {
    throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["methodUnimplemented"])()
  }

  /**
   * @param {ContentType} right
   * @return {boolean}
   */
  mergeWith (right) {
    return false
  }

  /**
   * @param {Transaction} transaction
   * @param {Item} item
   */
  integrate (transaction, item) {
    this.type._integrate(transaction.doc, item);
  }

  /**
   * @param {Transaction} transaction
   */
  delete (transaction) {
    let item = this.type._start;
    while (item !== null) {
      if (!item.deleted) {
        item.delete(transaction);
      } else {
        // Whis will be gc'd later and we want to merge it if possible
        // We try to merge all deleted items after each transaction,
        // but we have no knowledge about that this needs to be merged
        // since it is not in transaction.ds. Hence we add it to transaction._mergeStructs
        transaction._mergeStructs.push(item);
      }
      item = item.right;
    }
    this.type._map.forEach(item => {
      if (!item.deleted) {
        item.delete(transaction);
      } else {
        // same as above
        transaction._mergeStructs.push(item);
      }
    });
    transaction.changed.delete(this.type);
  }

  /**
   * @param {StructStore} store
   */
  gc (store) {
    let item = this.type._start;
    while (item !== null) {
      item.gc(store, true);
      item = item.right;
    }
    this.type._start = null;
    this.type._map.forEach(/** @param {Item | null} item */ (item) => {
      while (item !== null) {
        item.gc(store, true);
        item = item.left;
      }
    });
    this.type._map = new Map();
  }

  /**
   * @param {AbstractUpdateEncoder} encoder
   * @param {number} offset
   */
  write (encoder, offset) {
    this.type._write(encoder);
  }

  /**
   * @return {number}
   */
  getRef () {
    return 7
  }
}

/**
 * @private
 *
 * @param {AbstractUpdateDecoder} decoder
 * @return {ContentType}
 */
const readContentType = decoder => new ContentType(typeRefs[decoder.readTypeRef()](decoder));

/**
 * @todo This should return several items
 *
 * @param {StructStore} store
 * @param {ID} id
 * @return {{item:Item, diff:number}}
 */
const followRedone = (store, id) => {
  /**
   * @type {ID|null}
   */
  let nextID = id;
  let diff = 0;
  let item;
  do {
    if (diff > 0) {
      nextID = createID(nextID.client, nextID.clock + diff);
    }
    item = getItem(store, nextID);
    diff = nextID.clock - item.id.clock;
    nextID = item.redone;
  } while (nextID !== null && item instanceof Item)
  return {
    item, diff
  }
};

/**
 * Make sure that neither item nor any of its parents is ever deleted.
 *
 * This property does not persist when storing it into a database or when
 * sending it to other peers
 *
 * @param {Item|null} item
 * @param {boolean} keep
 */
const keepItem = (item, keep) => {
  while (item !== null && item.keep !== keep) {
    item.keep = keep;
    item = /** @type {AbstractType<any>} */ (item.parent)._item;
  }
};

/**
 * Split leftItem into two items
 * @param {Transaction} transaction
 * @param {Item} leftItem
 * @param {number} diff
 * @return {Item}
 *
 * @function
 * @private
 */
const splitItem = (transaction, leftItem, diff) => {
  // create rightItem
  const { client, clock } = leftItem.id;
  const rightItem = new Item(
    createID(client, clock + diff),
    leftItem,
    createID(client, clock + diff - 1),
    leftItem.right,
    leftItem.rightOrigin,
    leftItem.parent,
    leftItem.parentSub,
    leftItem.content.splice(diff)
  );
  if (leftItem.deleted) {
    rightItem.markDeleted();
  }
  if (leftItem.keep) {
    rightItem.keep = true;
  }
  if (leftItem.redone !== null) {
    rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
  }
  // update left (do not set leftItem.rightOrigin as it will lead to problems when syncing)
  leftItem.right = rightItem;
  // update right
  if (rightItem.right !== null) {
    rightItem.right.left = rightItem;
  }
  // right is more specific.
  transaction._mergeStructs.push(rightItem);
  // update parent._map
  if (rightItem.parentSub !== null && rightItem.right === null) {
    /** @type {AbstractType<any>} */ (rightItem.parent)._map.set(rightItem.parentSub, rightItem);
  }
  leftItem.length = diff;
  return rightItem
};

/**
 * Redoes the effect of this operation.
 *
 * @param {Transaction} transaction The Yjs instance.
 * @param {Item} item
 * @param {Set<Item>} redoitems
 *
 * @return {Item|null}
 *
 * @private
 */
const redoItem = (transaction, item, redoitems) => {
  const doc = transaction.doc;
  const store = doc.store;
  const ownClientID = doc.clientID;
  const redone = item.redone;
  if (redone !== null) {
    return getItemCleanStart(transaction, redone)
  }
  let parentItem = /** @type {AbstractType<any>} */ (item.parent)._item;
  /**
   * @type {Item|null}
   */
  let left;
  /**
   * @type {Item|null}
   */
  let right;
  if (item.parentSub === null) {
    // Is an array item. Insert at the old position
    left = item.left;
    right = item;
  } else {
    // Is a map item. Insert as current value
    left = item;
    while (left.right !== null) {
      left = left.right;
      if (left.id.client !== ownClientID) {
        // It is not possible to redo this item because it conflicts with a
        // change from another client
        return null
      }
    }
    if (left.right !== null) {
      left = /** @type {Item} */ (/** @type {AbstractType<any>} */ (item.parent)._map.get(item.parentSub));
    }
    right = null;
  }
  // make sure that parent is redone
  if (parentItem !== null && parentItem.deleted === true && parentItem.redone === null) {
    // try to undo parent if it will be undone anyway
    if (!redoitems.has(parentItem) || redoItem(transaction, parentItem, redoitems) === null) {
      return null
    }
  }
  if (parentItem !== null && parentItem.redone !== null) {
    while (parentItem.redone !== null) {
      parentItem = getItemCleanStart(transaction, parentItem.redone);
    }
    // find next cloned_redo items
    while (left !== null) {
      /**
       * @type {Item|null}
       */
      let leftTrace = left;
      // trace redone until parent matches
      while (leftTrace !== null && /** @type {AbstractType<any>} */ (leftTrace.parent)._item !== parentItem) {
        leftTrace = leftTrace.redone === null ? null : getItemCleanStart(transaction, leftTrace.redone);
      }
      if (leftTrace !== null && /** @type {AbstractType<any>} */ (leftTrace.parent)._item === parentItem) {
        left = leftTrace;
        break
      }
      left = left.left;
    }
    while (right !== null) {
      /**
       * @type {Item|null}
       */
      let rightTrace = right;
      // trace redone until parent matches
      while (rightTrace !== null && /** @type {AbstractType<any>} */ (rightTrace.parent)._item !== parentItem) {
        rightTrace = rightTrace.redone === null ? null : getItemCleanStart(transaction, rightTrace.redone);
      }
      if (rightTrace !== null && /** @type {AbstractType<any>} */ (rightTrace.parent)._item === parentItem) {
        right = rightTrace;
        break
      }
      right = right.right;
    }
  }
  const nextClock = getState(store, ownClientID);
  const nextId = createID(ownClientID, nextClock);
  const redoneItem = new Item(
    nextId,
    left, left && left.lastId,
    right, right && right.id,
    parentItem === null ? item.parent : /** @type {ContentType} */ (parentItem.content).type,
    item.parentSub,
    item.content.copy()
  );
  item.redone = nextId;
  keepItem(redoneItem, true);
  redoneItem.integrate(transaction, 0);
  return redoneItem
};

/**
 * Abstract class that represents any content.
 */
class Item extends AbstractStruct {
  /**
   * @param {ID} id
   * @param {Item | null} left
   * @param {ID | null} origin
   * @param {Item | null} right
   * @param {ID | null} rightOrigin
   * @param {AbstractType<any>|ID|null} parent Is a type if integrated, is null if it is possible to copy parent from left or right, is ID before integration to search for it.
   * @param {string | null} parentSub
   * @param {AbstractContent} content
   */
  constructor (id, left, origin, right, rightOrigin, parent, parentSub, content) {
    super(id, content.getLength());
    /**
     * The item that was originally to the left of this item.
     * @type {ID | null}
     */
    this.origin = origin;
    /**
     * The item that is currently to the left of this item.
     * @type {Item | null}
     */
    this.left = left;
    /**
     * The item that is currently to the right of this item.
     * @type {Item | null}
     */
    this.right = right;
    /**
     * The item that was originally to the right of this item.
     * @type {ID | null}
     */
    this.rightOrigin = rightOrigin;
    /**
     * @type {AbstractType<any>|ID|null}
     */
    this.parent = parent;
    /**
     * If the parent refers to this item with some kind of key (e.g. YMap, the
     * key is specified here. The key is then used to refer to the list in which
     * to insert this item. If `parentSub = null` type._start is the list in
     * which to insert to. Otherwise it is `parent._map`.
     * @type {String | null}
     */
    this.parentSub = parentSub;
    /**
     * If this type's effect is reundone this type refers to the type that undid
     * this operation.
     * @type {ID | null}
     */
    this.redone = null;
    /**
     * @type {AbstractContent}
     */
    this.content = content;
    /**
     * bit1: keep
     * bit2: countable
     * bit3: deleted
     * bit4: mark - mark node as fast-search-marker
     * @type {number} byte
     */
    this.info = this.content.isCountable() ? lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT2"] : 0;
  }

  /**
   * This is used to mark the item as an indexed fast-search marker
   *
   * @type {boolean}
   */
  set marker (isMarked) {
    if (((this.info & lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT4"]) > 0) !== isMarked) {
      this.info ^= lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT4"];
    }
  }

  get marker () {
    return (this.info & lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT4"]) > 0
  }

  /**
   * If true, do not garbage collect this Item.
   */
  get keep () {
    return (this.info & lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT1"]) > 0
  }

  set keep (doKeep) {
    if (this.keep !== doKeep) {
      this.info ^= lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT1"];
    }
  }

  get countable () {
    return (this.info & lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT2"]) > 0
  }

  /**
   * Whether this item was deleted or not.
   * @type {Boolean}
   */
  get deleted () {
    return (this.info & lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT3"]) > 0
  }

  set deleted (doDelete) {
    if (this.deleted !== doDelete) {
      this.info ^= lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT3"];
    }
  }

  markDeleted () {
    this.info |= lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT3"];
  }

  /**
   * Return the creator clientID of the missing op or define missing items and return null.
   *
   * @param {Transaction} transaction
   * @param {StructStore} store
   * @return {null | number}
   */
  getMissing (transaction, store) {
    if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
      return this.origin.client
    }
    if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
      return this.rightOrigin.client
    }
    if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
      return this.parent.client
    }

    // We have all missing ids, now find the items

    if (this.origin) {
      this.left = getItemCleanEnd(transaction, store, this.origin);
      this.origin = this.left.lastId;
    }
    if (this.rightOrigin) {
      this.right = getItemCleanStart(transaction, this.rightOrigin);
      this.rightOrigin = this.right.id;
    }
    if ((this.left && this.left.constructor === GC) || (this.right && this.right.constructor === GC)) {
      this.parent = null;
    }
    // only set parent if this shouldn't be garbage collected
    if (!this.parent) {
      if (this.left && this.left.constructor === Item) {
        this.parent = this.left.parent;
        this.parentSub = this.left.parentSub;
      }
      if (this.right && this.right.constructor === Item) {
        this.parent = this.right.parent;
        this.parentSub = this.right.parentSub;
      }
    } else if (this.parent.constructor === ID) {
      const parentItem = getItem(store, this.parent);
      if (parentItem.constructor === GC) {
        this.parent = null;
      } else {
        this.parent = /** @type {ContentType} */ (parentItem.content).type;
      }
    }
    return null
  }

  /**
   * @param {Transaction} transaction
   * @param {number} offset
   */
  integrate (transaction, offset) {
    if (offset > 0) {
      this.id.clock += offset;
      this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
      this.origin = this.left.lastId;
      this.content = this.content.splice(offset);
      this.length -= offset;
    }

    if (this.parent) {
      if ((!this.left && (!this.right || this.right.left !== null)) || (this.left && this.left.right !== this.right)) {
        /**
         * @type {Item|null}
         */
        let left = this.left;

        /**
         * @type {Item|null}
         */
        let o;
        // set o to the first conflicting item
        if (left !== null) {
          o = left.right;
        } else if (this.parentSub !== null) {
          o = /** @type {AbstractType<any>} */ (this.parent)._map.get(this.parentSub) || null;
          while (o !== null && o.left !== null) {
            o = o.left;
          }
        } else {
          o = /** @type {AbstractType<any>} */ (this.parent)._start;
        }
        // TODO: use something like DeleteSet here (a tree implementation would be best)
        // @todo use global set definitions
        /**
         * @type {Set<Item>}
         */
        const conflictingItems = new Set();
        /**
         * @type {Set<Item>}
         */
        const itemsBeforeOrigin = new Set();
        // Let c in conflictingItems, b in itemsBeforeOrigin
        // ***{origin}bbbb{this}{c,b}{c,b}{o}***
        // Note that conflictingItems is a subset of itemsBeforeOrigin
        while (o !== null && o !== this.right) {
          itemsBeforeOrigin.add(o);
          conflictingItems.add(o);
          if (compareIDs(this.origin, o.origin)) {
            // case 1
            if (o.id.client < this.id.client) {
              left = o;
              conflictingItems.clear();
            } else if (compareIDs(this.rightOrigin, o.rightOrigin)) {
              // this and o are conflicting and point to the same integration points. The id decides which item comes first.
              // Since this is to the left of o, we can break here
              break
            } // else, o might be integrated before an item that this conflicts with. If so, we will find it in the next iterations
          } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) { // use getItem instead of getItemCleanEnd because we don't want / need to split items.
            // case 2
            if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
              left = o;
              conflictingItems.clear();
            }
          } else {
            break
          }
          o = o.right;
        }
        this.left = left;
      }
      // reconnect left/right + update parent map/start if necessary
      if (this.left !== null) {
        const right = this.left.right;
        this.right = right;
        this.left.right = this;
      } else {
        let r;
        if (this.parentSub !== null) {
          r = /** @type {AbstractType<any>} */ (this.parent)._map.get(this.parentSub) || null;
          while (r !== null && r.left !== null) {
            r = r.left;
          }
        } else {
          r = /** @type {AbstractType<any>} */ (this.parent)._start
          ;/** @type {AbstractType<any>} */ (this.parent)._start = this;
        }
        this.right = r;
      }
      if (this.right !== null) {
        this.right.left = this;
      } else if (this.parentSub !== null) {
        // set as current parent value if right === null and this is parentSub
        /** @type {AbstractType<any>} */ (this.parent)._map.set(this.parentSub, this);
        if (this.left !== null) {
          // this is the current attribute value of parent. delete right
          this.left.delete(transaction);
        }
      }
      // adjust length of parent
      if (this.parentSub === null && this.countable && !this.deleted) {
        /** @type {AbstractType<any>} */ (this.parent)._length += this.length;
      }
      addStruct(transaction.doc.store, this);
      this.content.integrate(transaction, this);
      // add parent to transaction.changed
      addChangedTypeToTransaction(transaction, /** @type {AbstractType<any>} */ (this.parent), this.parentSub);
      if ((/** @type {AbstractType<any>} */ (this.parent)._item !== null && /** @type {AbstractType<any>} */ (this.parent)._item.deleted) || (this.parentSub !== null && this.right !== null)) {
        // delete if parent is deleted or if this is not the current attribute value of parent
        this.delete(transaction);
      }
    } else {
      // parent is not defined. Integrate GC struct instead
      new GC(this.id, this.length).integrate(transaction, 0);
    }
  }

  /**
   * Returns the next non-deleted item
   */
  get next () {
    let n = this.right;
    while (n !== null && n.deleted) {
      n = n.right;
    }
    return n
  }

  /**
   * Returns the previous non-deleted item
   */
  get prev () {
    let n = this.left;
    while (n !== null && n.deleted) {
      n = n.left;
    }
    return n
  }

  /**
   * Computes the last content address of this Item.
   */
  get lastId () {
    // allocating ids is pretty costly because of the amount of ids created, so we try to reuse whenever possible
    return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1)
  }

  /**
   * Try to merge two items
   *
   * @param {Item} right
   * @return {boolean}
   */
  mergeWith (right) {
    if (
      compareIDs(right.origin, this.lastId) &&
      this.right === right &&
      compareIDs(this.rightOrigin, right.rightOrigin) &&
      this.id.client === right.id.client &&
      this.id.clock + this.length === right.id.clock &&
      this.deleted === right.deleted &&
      this.redone === null &&
      right.redone === null &&
      this.content.constructor === right.content.constructor &&
      this.content.mergeWith(right.content)
    ) {
      if (right.keep) {
        this.keep = true;
      }
      this.right = right.right;
      if (this.right !== null) {
        this.right.left = this;
      }
      this.length += right.length;
      return true
    }
    return false
  }

  /**
   * Mark this Item as deleted.
   *
   * @param {Transaction} transaction
   */
  delete (transaction) {
    if (!this.deleted) {
      const parent = /** @type {AbstractType<any>} */ (this.parent);
      // adjust the length of parent
      if (this.countable && this.parentSub === null) {
        parent._length -= this.length;
      }
      this.markDeleted();
      addToDeleteSet(transaction.deleteSet, this.id.client, this.id.clock, this.length);
      addChangedTypeToTransaction(transaction, parent, this.parentSub);
      this.content.delete(transaction);
    }
  }

  /**
   * @param {StructStore} store
   * @param {boolean} parentGCd
   */
  gc (store, parentGCd) {
    if (!this.deleted) {
      throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["unexpectedCase"])()
    }
    this.content.gc(store);
    if (parentGCd) {
      replaceStruct(store, this, new GC(this.id, this.length));
    } else {
      this.content = new ContentDeleted(this.length);
    }
  }

  /**
   * Transform the properties of this type to binary and write it to an
   * BinaryEncoder.
   *
   * This is called when this Item is sent to a remote peer.
   *
   * @param {AbstractUpdateEncoder} encoder The encoder to write data to.
   * @param {number} offset
   */
  write (encoder, offset) {
    const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
    const rightOrigin = this.rightOrigin;
    const parentSub = this.parentSub;
    const info = (this.content.getRef() & lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BITS5"]) |
      (origin === null ? 0 : lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT8"]) | // origin is defined
      (rightOrigin === null ? 0 : lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT7"]) | // right origin is defined
      (parentSub === null ? 0 : lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BIT6"]); // parentSub is non-null
    encoder.writeInfo(info);
    if (origin !== null) {
      encoder.writeLeftID(origin);
    }
    if (rightOrigin !== null) {
      encoder.writeRightID(rightOrigin);
    }
    if (origin === null && rightOrigin === null) {
      const parent = /** @type {AbstractType<any>} */ (this.parent);
      const parentItem = parent._item;
      if (parentItem === null) {
        // parent type on y._map
        // find the correct key
        const ykey = findRootTypeKey(parent);
        encoder.writeParentInfo(true); // write parentYKey
        encoder.writeString(ykey);
      } else {
        encoder.writeParentInfo(false); // write parent id
        encoder.writeLeftID(parentItem.id);
      }
      if (parentSub !== null) {
        encoder.writeString(parentSub);
      }
    }
    this.content.write(encoder, offset);
  }
}

/**
 * @param {AbstractUpdateDecoder} decoder
 * @param {number} info
 */
const readItemContent = (decoder, info) => contentRefs[info & lib0_binary_js__WEBPACK_IMPORTED_MODULE_9__["BITS5"]](decoder);

/**
 * A lookup map for reading Item content.
 *
 * @type {Array<function(AbstractUpdateDecoder):AbstractContent>}
 */
const contentRefs = [
  () => { throw Object(lib0_error_js__WEBPACK_IMPORTED_MODULE_8__["unexpectedCase"])() }, // GC is not ItemContent
  readContentDeleted, // 1
  readContentJSON, // 2
  readContentBinary, // 3
  readContentString, // 4
  readContentEmbed, // 5
  readContentFormat, // 6
  readContentType, // 7
  readContentAny, // 8
  readContentDoc // 9
];


//# sourceMappingURL=yjs.mjs.map


/***/ }),

/***/ "./src/CoCreate-crdt.index.js":
/*!************************************!*\
  !*** ./src/CoCreate-crdt.index.js ***!
  \************************************/
/*! exports provided: CoCreateYSocket */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoCreateYSocket", function() { return CoCreateYSocket; });
/* harmony import */ var yjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! yjs */ "./node_modules/yjs/dist/yjs.mjs");
/* harmony import */ var _lib_y_websocket__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/y-websocket */ "./src/lib/y-websocket.js");
/* harmony import */ var y_indexeddb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! y-indexeddb */ "./node_modules/y-indexeddb/src/y-indexeddb.js");




// import { UserCursor } from './utils/cursor/userCursor_class'

// Connect to the web worker
const debug = false;
const g_yDoc = new yjs__WEBPACK_IMPORTED_MODULE_0__["Doc"]();

class CoCreateYSocket {
	constructor(org) {
		this.doc = g_yDoc;
		this.orgName = org;
		this.docs = {};
		this._awarenessListener = null;
		this.character = '_';
		this.listenAwereness = function(){}
	}
	
	createDoc(id, element) {
		if (!id || id == "") {
			return null;
		}
		
		let newInfo = this.parseType(id)
		if(debug)
			console.log(newInfo);
		
		const newId = newInfo.id;
		
		if (this.docs[newId]) { 
			if (element && !this.__checkExistElement(this.docs[newId].elements, element)) {
				this.docs[newId].elements.push(element);
			}

			if (!this.docs[newId].types.some((type) => type === id)) {
				// register event
				this.docs[newId].types.push(id);
				this.registerUpdateEvent(this.docs[newId], id)
				
			}
			return false;
		} 
		
		const yDoc = this.doc
		
		const url_socket = this.__getSocketUrl();
		//draw cursor dinamially
		// new UserCursor(socketProvider);

			
		var socketProvider = new _lib_y_websocket__WEBPACK_IMPORTED_MODULE_1__["WebsocketProvider"](url_socket, newId, yDoc);
		let indexeddbProvider = null;
		if (newInfo.document_id != "null") {
			indexeddbProvider = new y_indexeddb__WEBPACK_IMPORTED_MODULE_2__["IndexeddbPersistence"](newId, g_yDoc)
			indexeddbProvider.whenSynced.then((__index) => {
			  console.log('loaded data from indexed db')
			  console.log(__index)
			})
		}	
		
		let awareness = socketProvider.awareness;
		
		this._cursors = new Map();
		
		this._awarenessListener = event => {
		  const f = clientId => {
			if (clientId !== this.doc.clientID) {
			  this.updateRemoteSelection(yDoc, id, yDoc.getText(id), this._cursors, clientId, awareness)
			}
		  }
		  event.added.forEach(f)
		  event.removed.forEach(f)
		  event.updated.forEach(f)
		}
		
		awareness.on('change', this._awarenessListener);
		/*
		awareness.getStates().forEach((aw, clientId) => {
			console.log("Update --")
        })
        */
        
        this.docs[newId] = {
			id: newId,
			doc: yDoc,
			socket: socketProvider,
			awareness: awareness,
			elements: element ? [element] : [],
			types: [id],
			indexeddb: indexeddbProvider
		}
		this.registerUpdateEvent(this.docs[newId], id)

		return true;
	}
	
	registerUpdateEvent(docObject, id) {
		const yDoc = docObject.doc;
		const shardType = yDoc.getText(id)
		let _this = this;
		
		shardType.observe((event) => {
			_this.__setTypeObserveEvent(event, docObject.elements, id);
		})
	}
	
	__checkExistElement(elements, element) {
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].isSameNode(element)) {
				return true;
			}
		}
		return false;
	}
	
	__getSocketUrl() {
		console.log("get_socket url")
		let w_location = window.location || window.parent.location;
		let w_protocol = w_location.protocol;
		let w_host = w_location.host;
		if (w_location.protocol === "about:") {
			w_protocol = w_location.protocol;
			w_host = document.referrer;
		}
		let protocol = w_protocol === 'http:' ? 'ws' : 'wss';
		return `${protocol}://server.cocreate.app:8080/`;
		
		let url_socket = `${protocol}://${w_host}:8080/`;
		if (window.config && window.config.host) {
			if (window.config.host.includes("://")) {
				url_socket = `${window.config.host}:8080/`;
			} else {
				url_socket = `${protocol}://${window.config.host}:8080/`;
			}
		}
		
		console.log(url_socket)
		
		return url_socket;

	}
	
	__setTypeObserveEvent(event, elements, id) {
		if (!id) return;

		const eventDelta = event.delta;
		const info = JSON.parse(atob(id));
		
		const wholestring = event.target.toString()
		const store_event = new CustomEvent('store-content-db', {
			detail: wholestring
		})
		
		const update_event = new CustomEvent('cocreate-y-update', {
			detail: eventDelta
		})
		elements.forEach((el) => {
			if (CoCreateUtils.isReadValue(el) && el.getAttribute('name') === info.name) {
				el.dispatchEvent(update_event)
			}
		})
			
		let is_save_value = false
		if (typeof info !== 'object') {
			return;
		}

		if (event.transaction.local) {
			elements.forEach((el) => {
				if (el.getAttribute('data-save_value') != 'false' && el.getAttribute('name') === info.name && info.document_id != "null") {
					is_save_value = true;
					el.dispatchEvent(store_event)
				}
			})

			if (is_save_value) {
				CoCreate.updateDocument({
					collection: info.collection,
					document_id: info.document_id,
					data: {
						[info.name]: wholestring
					},
					metadata: 'yjs-change'
				})
			}
		} else {

		}
	}
	
	deleteDoc(id) {
		const info = this.parseType(id)
		if (this.docs[info.id]) {
			delete this.docs[info.id];
		}
	}
	
	generateDocName(collection, document_id, name) {
		const info = {org: this.orgName, collection, document_id, name}
		return btoa(JSON.stringify(info)); 
		// return this.orgName + "_" + collection + "_" + document_id + "_" + name;
	}
	
	insertData(id, index, content, attribute) {
		const info = this.parseType(id)
		if (this.docs[info.id]) {
			if (attribute) {
				this.docs[info.id].doc.getText(id).insert(index, content, attribute);
			} else {
				
				this.docs[info.id].doc.getText(id).insert(index, content);
			}
		}
	}
	
	deleteData(id, index, length) {
		const info = this.parseType(id)
		if (this.docs[info.id]) {
			this.docs[info.id].doc.getText(id).delete(index, length);
		}
	}
	
	getWholeString(id) {
		const info = this.parseType(id)
		if (this.docs[info.id]) {
			return this.docs[info.id].doc.getText(id).toString();
		} else {
			return "";
		}
	}
	
	updateRemoteSelection (y, cm, type, cursors, clientId, awareness)  {
		if(debug)
				console.log("CHANGE ---- DOCID ",this.doc.clientID,' OTHER CLIENTEID ',clientId)
		if(clientId !== this.doc.clientID){
			
					//console.log("TEXT -> updateRemoteSelection ",clientId,awareness,cursor)
					//console.log("AW status",awareness.getLocalState())
					  // destroy current text mark
					  const m = cursors.get(clientId)
					  if (m !== undefined) {
						m.caret.clear()
						if (m.sel !== null) {
						  m.sel.clear()
						}
						cursors.delete(clientId)
					  }
					  // redraw caret and selection for clientId
					  const aw = awareness.getStates().get(clientId);
					  if(debug)
						console.log(aw)
					  if (aw === undefined) {
						  if(debug)
							console.log(" Cursor OUT ",clientId)
						   //awareness.setLocalStateField('cursor', null);
						   let elements = document.querySelectorAll('[id*="socket_'+clientId+'"]');
							elements.forEach(function (element, index, array) {
								element.parentNode.removeChild(element);
							})
							
							let sel_elements = document.querySelectorAll('[id*="sel-'+clientId+'"]');
							  sel_elements.forEach(function (sel_element, index, array) {
								sel_element.parentNode.removeChild(sel_element);
							})
						  /*
						   let element = document.getElementById("socket_"+clientId)
						   let sel_element = document.getElementById("sel-"+clientId)
						   if(element)
							element.parentNode.removeChild(element);
							if(sel_element)
							sel_element.parentNode.removeChild(sel_element);
						   */
						return
					  }
					  const user = aw.user || {}
					  if (user.color == null) {
						user.color = '#ffa500'
					  }
					  if (user.name == null) {
						user.name = `User: ${clientId}`
					  }
					  const cursor = aw.cursor
					  if(debug)
						console.log("Cursor ",cursor)
					  if (cursor == null || cursor.anchor == null || cursor.head == null) {
						  //let element = document.getElementById("socket_"+clientId)
						  let elements = document.querySelectorAll('[id*="socket_'+clientId+'"]');
						  elements.forEach(function (element, index, array) {
							element.parentNode.removeChild(element);
						  })
						
						//let sel_element = document.getElementById("sel-"+clientId)  
						let sel_elements = document.querySelectorAll('[id*="sel-'+clientId+'"]');
						  sel_elements.forEach(function (sel_element, index, array) {
							sel_element.parentNode.removeChild(sel_element);
						})
						return
					  }
				
					  const anchor = yjs__WEBPACK_IMPORTED_MODULE_0__["createAbsolutePositionFromRelativePosition"](yjs__WEBPACK_IMPORTED_MODULE_0__["createRelativePositionFromJSON"](cursor.anchor), y)
					  const head = yjs__WEBPACK_IMPORTED_MODULE_0__["createAbsolutePositionFromRelativePosition"](yjs__WEBPACK_IMPORTED_MODULE_0__["createRelativePositionFromJSON"](cursor.head), y)
					  //draw_cursor(1,11,12,66,{},true);
					  if(debug){
						  console.log("PRE Draw Cursor ")
						  console.log("anchor  ",anchor , " head ",head,' Type ',type)
						  console.log("anchor  Type",anchor.type === type)
						  console.log("anchor  Type",head.type === type)
					  }
					  //if (anchor !== null && head !== null && anchor.type === type && head.type === type) {
					  if (anchor !== null && head !== null ) {
						let from, to;
						if (head.index < anchor.index) {
						  from = head.index
						  to = anchor.index
						} else {
							if(debug)
								console.log(anchor.index)
						  from = anchor.index
						  to = head.index
						}
						if(debug)
							console.log("Draw Cursor ",from,to,clientId,aw.user)
						let t_info = CoCreateYSocket.parseTypeName(cursor.anchor['tname']);
						let id_mirror = t_info.document_id + t_info.name+'--mirror-div';
						let json = {};
						let selector = '[data-collection="'+t_info.collection+'"][data-document_id="'+t_info.document_id+'"][name="'+t_info.name+'"]'
						selector += ':not(.codemirror):not(.quill)';
						let elements = document.querySelectorAll(selector);
						let that = this;
						elements.forEach(function (element, index, array) {
							json = {
								element:element,
								startPosition:from,
								selector:selector,
								endPositon:to,
								clientId : clientId,
								user:{
									'color':user.color,
									'name':user.name
									},
							}
							draw_cursor(json);
							//sent custom position
							that.listen(json);
						});
					  }
		}
	}
	
	changeListenAwereness(callback){
		this.listenAwereness = callback;
	}
	
	listen(json){
		this.listenAwereness.apply(this,[json])
	}
	
	destroyObserver(id, element) {
		const info = this.parseType(id)
		this.docs[info.id].doc.getText(id).unobserve((event) => {});
		
		this.docs[info.id].socket.awareness.off('change', this._awarenessListener);
	}
	
	getProvider(id){
		const info = this.parseType(id)
		if (!this.docs[info.id]) {
			return null;
		}
		return this.docs[info.id].socket;
	}
	
	getType(id){
		const info = this.parseType(id)
		if (!this.docs[info.id]) {
			return null;
		}
		return this.docs[info.id].doc.getText(id);
	}

	setCursorNull(id){
		const info = this.parseType(id)
		if (!this.docs[info.id]) {
			return null;
		}
		this.docs[info.id].socket.awareness.setLocalStateField('cursor', null);
	}
	
	setPositionYJS(id, from, to) {
		const info = this.parseType(id)
		const type = this.getType(id);
		if (!type) {
			return;
		}
		var anchor = yjs__WEBPACK_IMPORTED_MODULE_0__["createRelativePositionFromTypeIndex"](type, from)
		var head = yjs__WEBPACK_IMPORTED_MODULE_0__["createRelativePositionFromTypeIndex"](type, to)
		/*
		if(debug)
			console.log("Sending Cursor ",{
				anchor,
				head
			},{'to':to,'from':from})
		*/
		this.docs[info.id].socket.awareness.setLocalStateField('cursor', {
			anchor,
			head
		})
		/*
		if(debug)
			console.log("Cursor Send")
			*/
	}
	
	//send Position Custom
	sendPosition(json) {
		let collection = json['collection'];
		let document_id = json['document_id'];
		let name = json['name'];
		let from = json['startPosition'];
		let to = json['endPositon'];
		let id = CoCreateYSocket.generateID(config.organization_Id, collection, document_id, name);
		this.setPositionYJS(id,from,to);
	}
	
	// setPositionYJS(id, from, to) {
	//     const type = this.doc.getText(id);
		
	//     var anchor = Y.createRelativePositionFromTypeIndex(type, from)
	//     var head = Y.createRelativePositionFromTypeIndex(type, to)
	//     this.awareness.setLocalStateField('cursor', {
	//         anchor,
	//         head
	//     })
	// }
	
	static generateID(org, collection, document_id, name) {
		const info = {org, collection, document_id, name}
		return btoa(JSON.stringify(info));        
		// return org + "_" + collection + "_" + document_id + "_" + name;
	}
	
	static parseTypeName(name) {
		//console.log(name)
		const data = JSON.parse(atob(name));
		//console.log(data)
		return data;
	}
	
	parseType(id) {
		let data = JSON.parse(atob(id));
		
		let newId = {org: data.org, collection: data.collection, document_id: data.document_id}
		return {
			id: btoa(JSON.stringify(newId)),
			name: data.name,
			document_id: data.document_id
		}
	}
}

window.CoCreateYSocket = CoCreateYSocket;

window.CoCreateCrdt = new CoCreateYSocket(config.organization_Id);

/***/ }),

/***/ "./src/lib/y-websocket.js":
/*!********************************!*\
  !*** ./src/lib/y-websocket.js ***!
  \********************************/
/*! exports provided: WebsocketProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebsocketProvider", function() { return WebsocketProvider; });
/* harmony import */ var yjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! yjs */ "./node_modules/yjs/dist/yjs.mjs");
/* harmony import */ var lib0_broadcastchannel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lib0/broadcastchannel.js */ "./node_modules/lib0/broadcastchannel.js");
/* harmony import */ var lib0_time_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lib0/time.js */ "./node_modules/lib0/time.js");
/* harmony import */ var lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lib0/encoding.js */ "./node_modules/lib0/encoding.js");
/* harmony import */ var lib0_decoding_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lib0/decoding.js */ "./node_modules/lib0/decoding.js");
/* harmony import */ var y_protocols_sync_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! y-protocols/sync.js */ "./node_modules/y-protocols/sync.js");
/* harmony import */ var y_protocols_auth_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! y-protocols/auth.js */ "./node_modules/y-protocols/auth.js");
/* harmony import */ var y_protocols_awareness_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! y-protocols/awareness.js */ "./node_modules/y-protocols/awareness.js");
/* harmony import */ var lib0_mutex_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lib0/mutex.js */ "./node_modules/lib0/mutex.js");
/* harmony import */ var lib0_observable_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lib0/observable.js */ "./node_modules/lib0/observable.js");
/* harmony import */ var lib0_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lib0/math.js */ "./node_modules/lib0/math.js");
/* harmony import */ var lib0_url_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! lib0/url.js */ "./node_modules/lib0/url.js");
/*
Unlike stated in the LICENSE file, it is not necessary to include the copyright notice and permission notice when you copy code from this file.
*/

/**
 * @module provider/websocket
 */

/* eslint-env browser */

 // eslint-disable-line












const messageSync = 0
const messageQueryAwareness = 3
const messageAwareness = 1
const messageAuth = 2

const reconnectTimeoutBase = 1200
const maxReconnectTimeout = 2500
// @todo - this should depend on awareness.outdatedTime
const messageReconnectTimeout = 30000

/**
 * @param {WebsocketProvider} provider
 * @param {string} reason
 */
const permissionDeniedHandler = (provider, reason) => console.warn(`Permission denied to access ${provider.url}.\n${reason}`)

/**
 * @param {WebsocketProvider} provider
 * @param {Uint8Array} buf
 * @param {boolean} emitSynced
 * @return {encoding.Encoder}
 */
const readMessage = (provider, buf, emitSynced) => {
  const decoder = lib0_decoding_js__WEBPACK_IMPORTED_MODULE_4__["createDecoder"](buf)
  const encoder = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["createEncoder"]()
  const messageType = lib0_decoding_js__WEBPACK_IMPORTED_MODULE_4__["readVarUint"](decoder)
  switch (messageType) {
    case messageSync: {
      lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoder, messageSync)
      const syncMessageType = y_protocols_sync_js__WEBPACK_IMPORTED_MODULE_5__["readSyncMessage"](decoder, encoder, provider.doc, provider)
      if (emitSynced && syncMessageType === y_protocols_sync_js__WEBPACK_IMPORTED_MODULE_5__["messageYjsSyncStep2"] && !provider.synced) {
        provider.synced = true
      }
      break
    }
    case messageQueryAwareness:
      lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoder, messageAwareness)
      lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint8Array"](encoder, y_protocols_awareness_js__WEBPACK_IMPORTED_MODULE_7__["encodeAwarenessUpdate"](provider.awareness, Array.from(provider.awareness.getStates().keys())))
      break
    case messageAwareness:
      y_protocols_awareness_js__WEBPACK_IMPORTED_MODULE_7__["applyAwarenessUpdate"](provider.awareness, lib0_decoding_js__WEBPACK_IMPORTED_MODULE_4__["readVarUint8Array"](decoder), provider)
      break
    case messageAuth:
      y_protocols_auth_js__WEBPACK_IMPORTED_MODULE_6__["readAuthMessage"](decoder, provider.doc, permissionDeniedHandler)
      break
    default:
      console.error('Unable to compute message')
      return encoder
  }
  return encoder
}

/**
 * @param {WebsocketProvider} provider
 */
const setupWS = provider => {
  if (provider.shouldConnect && provider.ws === null) {
    const websocket = new provider._WS(provider.url)
    websocket.binaryType = 'arraybuffer'
    provider.ws = websocket
    provider.wsconnecting = true
    provider.wsconnected = false
    provider.synced = false

    websocket.onmessage = event => {
      provider.wsLastMessageReceived = lib0_time_js__WEBPACK_IMPORTED_MODULE_2__["getUnixTime"]()
      const encoder = readMessage(provider, new Uint8Array(event.data), true)
      if (lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["length"](encoder) > 1) {
        websocket.send(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoder))
      }
    }
    websocket.onclose = () => {
      provider.ws = null
      provider.wsconnecting = false
      if (provider.wsconnected) {
        provider.wsconnected = false
        provider.synced = false
        // update awareness (all users except local left)
        y_protocols_awareness_js__WEBPACK_IMPORTED_MODULE_7__["removeAwarenessStates"](provider.awareness, Array.from(provider.awareness.getStates().keys()).filter(client => client !== provider.doc.clientID), provider)
        provider.emit('status', [{
          status: 'disconnected'
        }])
      } else {
        provider.wsUnsuccessfulReconnects++
      }
      // Start with no reconnect timeout and increase timeout by
      // log10(wsUnsuccessfulReconnects).
      // The idea is to increase reconnect timeout slowly and have no reconnect
      // timeout at the beginning (log(1) = 0)
      setTimeout(setupWS, lib0_math_js__WEBPACK_IMPORTED_MODULE_10__["min"](lib0_math_js__WEBPACK_IMPORTED_MODULE_10__["log10"](provider.wsUnsuccessfulReconnects + 1) * reconnectTimeoutBase, maxReconnectTimeout), provider)
    }
    websocket.onopen = () => {
      provider.wsLastMessageReceived = lib0_time_js__WEBPACK_IMPORTED_MODULE_2__["getUnixTime"]()
      provider.wsconnecting = false
      provider.wsconnected = true
      provider.wsUnsuccessfulReconnects = 0
      provider.emit('status', [{
        status: 'connected'
      }])
      // always send sync step 1 when connected
      const encoder = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["createEncoder"]()
      lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoder, messageSync)
      y_protocols_sync_js__WEBPACK_IMPORTED_MODULE_5__["writeSyncStep1"](encoder, provider.doc)
      websocket.send(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoder))
      // broadcast local awareness state
      if (provider.awareness.getLocalState() !== null) {
        const encoderAwarenessState = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["createEncoder"]()
        lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoderAwarenessState, messageAwareness)
        lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint8Array"](encoderAwarenessState, y_protocols_awareness_js__WEBPACK_IMPORTED_MODULE_7__["encodeAwarenessUpdate"](provider.awareness, [provider.doc.clientID]))
        websocket.send(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoderAwarenessState))
      }
    }

    provider.emit('status', [{
      status: 'connecting'
    }])
  }
}

/**
 * @param {WebsocketProvider} provider
 * @param {ArrayBuffer} buf
 */
const broadcastMessage = (provider, buf) => {
  if (provider.wsconnected) {
    // @ts-ignore We know that wsconnected = true
    provider.ws.send(buf)
  }
  if (provider.bcconnected) {
    provider.mux(() => {
      lib0_broadcastchannel_js__WEBPACK_IMPORTED_MODULE_1__["publish"](provider.bcChannel, buf)
    })
  }
}

/**
 * Websocket Provider for Yjs. Creates a websocket connection to sync the shared document.
 * The document name is attached to the provided url. I.e. the following example
 * creates a websocket connection to http://localhost:1234/my-document-name
 *
 * @example
 *   import * as Y from 'yjs'
 *   import { WebsocketProvider } from 'y-websocket'
 *   const doc = new Y.Doc()
 *   const provider = new WebsocketProvider('http://localhost:1234', 'my-document-name', doc)
 *
 * @extends {Observable<string>}
 */
class WebsocketProvider extends lib0_observable_js__WEBPACK_IMPORTED_MODULE_9__["Observable"] {
  /**
   * @param {string} serverUrl
   * @param {string} roomname
   * @param {Y.Doc} doc
   * @param {object} [opts]
   * @param {boolean} [opts.connect]
   * @param {awarenessProtocol.Awareness} [opts.awareness]
   * @param {Object<string,string>} [opts.params]
   * @param {typeof WebSocket} [opts.WebSocketPolyfill] Optionall provide a WebSocket polyfill
   * @param {number} [opts.resyncInterval] Request server state every `resyncInterval` milliseconds
   */
  constructor (serverUrl, roomname, doc, { connect = true, awareness = new y_protocols_awareness_js__WEBPACK_IMPORTED_MODULE_7__["Awareness"](doc), params = {}, WebSocketPolyfill = WebSocket, resyncInterval = -1 } = {}) {
    super()
    // ensure that url is always ends with /
    while (serverUrl[serverUrl.length - 1] === '/') {
      serverUrl = serverUrl.slice(0, serverUrl.length - 1)
    }
    const encodedParams = lib0_url_js__WEBPACK_IMPORTED_MODULE_11__["encodeQueryParams"](params)
    this.bcChannel = serverUrl + '/' + roomname
    this.url = serverUrl + '/' + roomname + (encodedParams.length === 0 ? '' : '?' + encodedParams)
    this.roomname = roomname
    this.doc = doc
    this._WS = WebSocketPolyfill
    this.awareness = awareness
    this.wsconnected = false
    this.wsconnecting = false
    this.bcconnected = false
    this.wsUnsuccessfulReconnects = 0
    this.mux = lib0_mutex_js__WEBPACK_IMPORTED_MODULE_8__["createMutex"]()
    /**
     * @type {boolean}
     */
    this._synced = false
    /**
     * @type {WebSocket?}
     */
    this.ws = null
    this.wsLastMessageReceived = 0
    /**
     * Whether to connect to other peers or not
     * @type {boolean}
     */
    this.shouldConnect = connect

    /**
     * @type {NodeJS.Timeout | number}
     */
    this._resyncInterval = 0
    if (resyncInterval > 0) {
      this._resyncInterval = setInterval(() => {
        if (this.ws) {
          // resend sync step 1
          const encoder = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["createEncoder"]()
          lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoder, messageSync)
          y_protocols_sync_js__WEBPACK_IMPORTED_MODULE_5__["writeSyncStep1"](encoder, doc)
          this.ws.send(lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoder))
        }
      }, resyncInterval)
    }

    /**
     * @param {ArrayBuffer} data
     */
    this._bcSubscriber = data => {
      this.mux(() => {
        const encoder = readMessage(this, new Uint8Array(data), false)
        if (lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["length"](encoder) > 1) {
          lib0_broadcastchannel_js__WEBPACK_IMPORTED_MODULE_1__["publish"](this.bcChannel, lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoder))
        }
      })
    }
    /**
     * Listens to Yjs updates and sends them to remote peers (ws and broadcastchannel)
     * @param {Uint8Array} update
     * @param {any} origin
     */
    this._updateHandler = (update, origin) => {
      if (origin !== this || origin === null) {
        const encoder = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["createEncoder"]()
        lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoder, messageSync)
        y_protocols_sync_js__WEBPACK_IMPORTED_MODULE_5__["writeUpdate"](encoder, update)
        broadcastMessage(this, lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoder))
      }
    }
    this.doc.on('update', this._updateHandler)
    /**
     * @param {any} changed
     * @param {any} origin
     */
    this._awarenessUpdateHandler = ({ added, updated, removed }, origin) => {
      const changedClients = added.concat(updated).concat(removed)
      const encoder = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["createEncoder"]()
      lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoder, messageAwareness)
      lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint8Array"](encoder, y_protocols_awareness_js__WEBPACK_IMPORTED_MODULE_7__["encodeAwarenessUpdate"](awareness, changedClients))
      broadcastMessage(this, lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoder))
    }
    window.addEventListener('beforeunload', () => {
      y_protocols_awareness_js__WEBPACK_IMPORTED_MODULE_7__["removeAwarenessStates"](this.awareness, [doc.clientID], 'window unload')
    })
    awareness.on('update', this._awarenessUpdateHandler)
    this._checkInterval = setInterval(() => {
      if (this.wsconnected && messageReconnectTimeout < lib0_time_js__WEBPACK_IMPORTED_MODULE_2__["getUnixTime"]() - this.wsLastMessageReceived) {
        // no message received in a long time - not even your own awareness
        // updates (which are updated every 15 seconds)
        /** @type {WebSocket} */ (this.ws).close()
      }
    }, messageReconnectTimeout / 10)
    if (connect) {
      this.connect()
    }
  }

  /**
   * @type {boolean}
   */
  get synced () {
    return this._synced
  }

  set synced (state) {
    if (this._synced !== state) {
      this._synced = state
      this.emit('synced', [state])
      this.emit('sync', [state])
    }
  }

  destroy () {
    if (this._resyncInterval !== 0) {
      clearInterval(/** @type {NodeJS.Timeout} */ (this._resyncInterval))
    }
    clearInterval(this._checkInterval)
    this.disconnect()
    this.awareness.off('update', this._awarenessUpdateHandler)
    this.doc.off('update', this._updateHandler)
    super.destroy()
  }

  connectBc () {
    if (!this.bcconnected) {
      lib0_broadcastchannel_js__WEBPACK_IMPORTED_MODULE_1__["subscribe"](this.bcChannel, this._bcSubscriber)
      this.bcconnected = true
    }
    // send sync step1 to bc
    this.mux(() => {
      // write sync step 1
      const encoderSync = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["createEncoder"]()
      lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoderSync, messageSync)
      y_protocols_sync_js__WEBPACK_IMPORTED_MODULE_5__["writeSyncStep1"](encoderSync, this.doc)
      lib0_broadcastchannel_js__WEBPACK_IMPORTED_MODULE_1__["publish"](this.bcChannel, lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoderSync))
      // broadcast local state
      const encoderState = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["createEncoder"]()
      lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoderState, messageSync)
      y_protocols_sync_js__WEBPACK_IMPORTED_MODULE_5__["writeSyncStep2"](encoderState, this.doc)
      lib0_broadcastchannel_js__WEBPACK_IMPORTED_MODULE_1__["publish"](this.bcChannel, lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoderState))
      // write queryAwareness
      const encoderAwarenessQuery = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["createEncoder"]()
      lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoderAwarenessQuery, messageQueryAwareness)
      lib0_broadcastchannel_js__WEBPACK_IMPORTED_MODULE_1__["publish"](this.bcChannel, lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoderAwarenessQuery))
      // broadcast local awareness state
      const encoderAwarenessState = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["createEncoder"]()
      lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoderAwarenessState, messageAwareness)
      lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint8Array"](encoderAwarenessState, y_protocols_awareness_js__WEBPACK_IMPORTED_MODULE_7__["encodeAwarenessUpdate"](this.awareness, [this.doc.clientID]))
      lib0_broadcastchannel_js__WEBPACK_IMPORTED_MODULE_1__["publish"](this.bcChannel, lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoderAwarenessState))
    })
  }

  disconnectBc () {
    // broadcast message with local awareness state set to null (indicating disconnect)
    const encoder = lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["createEncoder"]()
    lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint"](encoder, messageAwareness)
    lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["writeVarUint8Array"](encoder, y_protocols_awareness_js__WEBPACK_IMPORTED_MODULE_7__["encodeAwarenessUpdate"](this.awareness, [this.doc.clientID], new Map()))
    broadcastMessage(this, lib0_encoding_js__WEBPACK_IMPORTED_MODULE_3__["toUint8Array"](encoder))
    if (this.bcconnected) {
      lib0_broadcastchannel_js__WEBPACK_IMPORTED_MODULE_1__["unsubscribe"](this.bcChannel, this._bcSubscriber)
      this.bcconnected = false
    }
  }

  disconnect () {
    this.shouldConnect = false
    this.disconnectBc()
    if (this.ws !== null) {
      this.ws.close()
    }
  }

  connect () {
    this.shouldConnect = true
    if (!this.wsconnected && this.ws === null) {
      setupWS(this)
      this.connectBc()
    }
  }
}


/***/ })

/******/ });
//# sourceMappingURL=CoCreate-crdt.index.js.map