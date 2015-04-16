var _ = require('lodash');
var env = require('../modules/env.js');

describe("environmental variables", function() {

   var error = undefined;

   var defaultEnv = _.cloneDeep(process.env);

   var defaultsPath = "../spec/defaults.json";
   var configPath = "../spec/config.json";

   var defaults = require(defaultsPath);
   var config = require(configPath);

   beforeEach(function() {
      process.env = defaultEnv;
   });
   afterEach(function() {
      error = undefined;
   });

   it("gets settings from defaults.json only", function() {
      process.env.GB_ENVIRONMENT = "blammo";
      error = env.set(defaultsPath, configPath);
      _.forEach(defaults.blammo, function(value, key) {
         expect(process.env[key]).toBe(value);
      });
      expect(error).toBe(null);
   });

   it("gets settings from config.json only", function() {
      process.env.GB_ENVIRONMENT = "blippo";
      error = env.set(defaultsPath, configPath);
      _.forEach(config.blippo, function(value, key) {
         expect(process.env[key]).toBe(value);
      });
      expect(error).toBe(null);
   });

   it("overrides all defaults when all fields in config", function() {
      process.env.GB_ENVIRONMENT = "development";
      error = env.set(defaultsPath, configPath);
      _.forEach(config.development, function(value, key) {
         expect(process.env[key]).toBe(value);
      });
      expect(error).toBe(null);
   });

   it("overrides some defaults when some fields in config", function() {
      var expected = _.assign({}, defaults.blippity, config.blippity);
      process.env.GB_ENVIRONMENT = "blippity";
      error = env.set(defaultsPath, configPath);
      _.forEach(expected, function(value, key) {
         expect(process.env[key]).toBe(value);
      });
      expect(error).toBe(null);
   });

   it("fails when stuff aint there", function() {
      process.env.GB_ENVIRONMENT = "blammo";
      error = env.set(defaultsPath, configPath);
      expect(error).toNotBe(null);
   });

});

delete(process.env.GB_ENVIRONMENT);
env.set();

var db = require('../modules/db.js');


describe("user queries", function() {
   it("should be able to get a user", function(done) {
      db.getUser({username:'momo'}).then(function success(data) {
         expect(true).toBe(true);
         done();
      }, function fail(err) {
         expect(true).toBe(false);
      });
   });

   it("should fail when a username isn't specified", function(done) {
      db.getUser().catch(function(err) {
         done();
      });
   });
});
