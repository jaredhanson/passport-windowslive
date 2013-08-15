var vows = require('vows');
var assert = require('assert');
var util = require('util');
var windowslive = require('..');


vows.describe('passport-windowslive').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(windowslive.version);
    },
  },
  
}).export(module);
