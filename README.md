Description
===========

groan is a PHP session file parser written in JavaScript.


Requirements
============

* JavaScript (compatible with [node.js](http://nodejs.org/))


Node.JS Examples
================

```javascript
var fs = require('fs'),
    parser = require('groan');

/*
  ideally you should first ensure (session file's
  mtime + PHP's session.gc_maxlifetime) > Date.now() to ensure that the
  session has not expired yet
*/

// if it is still valid, continue on ...
fs.readFile('/tmp/sess_1234567890abcdef', function(err, b) {
  if (err) throw err;
  console.dir(parser(b.toString('utf8')));
  /*
     for a $_SESSION that contains:
        ["0"]=>
        string(3) "foo"
        ["a"]=>
        string(5) "apple"
        ["b"]=>
        bool(false)
        ["c"]=>
        array(3) {
          [0]=>
          int(17)
          [1]=>
          float(1.5)
          [2]=>
          string(1) "x"
        }
        ["d"]=>
        array(0) {
        }

    the parser will return an object that looks like:
      {
        0: 'foo',
        a: 'apple',
        b: false,
        c: [ 17, 1.5, 'x' ],
        d: []
      }
  */
});
```

```javascript
var parser = require('groan');

var serialized = 'a:5:{i:0;s:3:"foo";s:1:"a";s:5:"apple";s:1:"b";b:0;s:1:"c";a:3:{i:0;i:17;i:1;d:1.5;i:2;s:1:"x";}s:1:"d";a:0:{}}';
console.dir(parser(serialized));

// output:
// { '0': 'foo', a: 'apple', b: false, c: [ 17, 1.5, 'x' ], d: [] }
```


Notes
=====

* References and recursion are not currently supported (currently returns `undefined`)

* The parser assumes the session file data is in the valid PHP session serialized format
