var vows = require('vows');
var assert = require('assert');
var util = require('util');
var persona = require('../lib');


vows.describe('passport-persona').addBatch({
  
  // OK
  'module': {
    'should report a version': function (x) {
      assert.isString(persona.version);
    },
  },
  
}).export(module);
