module.exports = function(config, logger, credentials, redis) {
  "use strict";
  try {
    var cmModule = {};

    if (config.cmModule && config.cmModule.class) {

      var cmModuleConfig = {
        'config': config.cmModule,
        'credentials': credentials,
        'redis': redis
      };

      cmModule = require(config.cmModule.class)(cmModuleConfig);
    } else {
      throw new Error('no cmModule specified in configuration');
    }

  }
  catch (e) {
    logger.log('error', 'Could not initialize ldap Module', { error: e.message });
    throw e;
  }

  var standardCallback = function(err, ret, done) {
    done(err, ret);
  };

  module.getHostByHostname  = cmModule.getHostByHostname(standardCallback);
  module.getHostByIP        = cmModule.getHostByIP(standardCallback);
  module.getHostByUniqueID  = cmModule.getHostByUniqueID(standardCallback);
  module.getHostsByRole     = cmModule.getHostsByRole(standardCallback);
  module.getHostsByClass    = cmModule.getHostsByClass(standardCallback);
  module.getStatus          = cmModule.getStatus(standardCallback);

  return module;
};
/*
 Configuration Management:
 module.getHostByHostname
 module.getHostByIP
 module.getHostByUniqueID
 module.getHostsByRole
 module.getHostsByClass
 module.getStatus
 */