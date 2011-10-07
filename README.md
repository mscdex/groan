Description
===========

groan is a PHP session file parser written in JavaScript.


Requirements
============

* JavaScript (compatible with [node.js](http://nodejs.org/))


Node.JS Example
===============

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
        a: 'apple',
        b: false,
        c: {
          0: 17,
          1: 1.5,
          2: 'x'
        },
        d: {}
      }
  */
});
```


Notes
=====

* References and recursion are not currently supported (currently returns `undefined`)

* The parser assumes the session file data is in the valid PHP session serialized format
