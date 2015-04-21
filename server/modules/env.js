module.exports = {
   set: function(defaultPath, configPath) {
      var error = null;
      var _ = require('lodash');

      var defaults = require(defaultPath || '../defaults.json');
      var config = require(configPath || '../config.json');
      var env = process.env.GB_ENVIRONMENT || config.defaultEnvironment;
      _.assign(process.env, defaults[env], config[env]);
      return error;
   }
}


