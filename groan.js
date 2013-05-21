function PHParse(str) {
  var o = { str: str, pos: 0 };
  if (str.indexOf('|') === -1)
    return __PHParseValue(o);
  else {
    var result = {};
    for (var k , v, i, last = o.str.length; o.pos < last;) {
      i = o.str.indexOf('|', o.pos);
      k = o.str.substring(o.pos, i);
      o.pos = i + 1;
      v = __PHParseValue(o);
      result[k] = v;
    }
    return result;
  }
}
var __PHParseValue = function(o) {
  var v, type = o.str[o.pos].toLowerCase(), len, idelim;
  o.pos += 2;
  if (type === 's') {
    idelim = o.str.indexOf(':', o.pos);
    len = parseInt(o.str.substring(o.pos, idelim), 10);
    o.pos = idelim + 2;
    v = o.str.substr(o.pos, len);
    o.pos += len + 2;
  } else if (type === 'i') {
    idelim = o.str.indexOf(';', o.pos);
    v = parseInt(o.str.substring(o.pos, idelim), 10);
    o.pos = idelim + 1;
  } else if (type === 'd') {
    idelim = o.str.indexOf(';', o.pos);
    v = parseFloat(o.str.substring(o.pos, idelim), 10);
    o.pos = idelim + 1;
  } else if (type === 'b') {
    v = (o.str[o.pos] === '1');
    o.pos += 2;
  } else if (type === 'a' || type === 'o') {
    v = {};
    if (type === 'o') {
      // skip object class name
      idelim = o.str.indexOf(':', o.pos);
      len = parseInt(o.str.substring(o.pos, idelim), 10);
      o.pos = idelim + 2 + len + 2;
    }
    idelim = o.str.indexOf(':', o.pos);
    len = parseInt(o.str.substring(o.pos, idelim), 10);
    o.pos = idelim + 2;
    var isArray = true;
    for (var i = 0, key; i < len; ++i) {
      key = __PHParseValue(o);
      v[key] = __PHParseValue(o);
      if (typeof key !== 'number' && isArray)
        isArray = false;
    }
    if (type === 'a' && isArray) {
      // make "arrays" with no/(only numeric) keys, javascript arrays
      v.length = Object.keys(v).length;
      v = Array.prototype.slice.call(v);
    }
    ++o.pos;
  } else if (type === 'r') {
    // TODO: support for recursion/references
    o.pos = o.str.indexOf(';', o.pos) + 1;
    v = undefined;
  } else if (type === 'n')
    v = null;
  else if (type === 'c') {
    v = {};

    idelim = o.str.indexOf(':', o.pos);
    len = parseInt(o.str.substring(o.pos, idelim), 10);
    o.pos = idelim + 2;
    //var clsName = o.str.substring(o.pos, o.pos + len);
    o.pos += len + 2;

    idelim = o.str.indexOf(':', o.pos);
    len = parseInt(o.str.substring(o.pos, idelim), 10);
    o.pos = idelim + 2;
    //v[clsName] = o.str.substring(o.pos, o.pos + len);
    v = o.str.substring(o.pos, o.pos + len);
    o.pos += len + 1;
  }
  return v;
};

if (module)
  module.exports = PHParse;
else if (window)
  window.PHParse = PHParse;