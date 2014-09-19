/**
 * LDAP Module Stub
 * @param config
 * @param credentials
 * @param redis
 * @returns {{}}
 */
module.exports = function(config, logger, credentials, redis) {
  "use strict";
  try {
    var ldapModule = {};

    if (config.ldapModule && config.ldapModule.class) {

      var ldapModuleConfig = {
        'config': config.ldapModule,
        'credentials': credentials,
        'redis': redis
      };

      ldapModule = require(config.ldapModule.class)(ldapModuleConfig);
    } else {
      throw new Error('no ldapModule specified in configuration');
    }

  }
  catch (e) {
    logger.log('error', 'Could not initialize ldap Module', { error: e.message });
    throw e;
  }

  var standardCallback = function(err, ret, done) {
    done(err, ret);
  };

   module.getUsers          = ldapModule.getUsers(standardCallback);
   module.getGroups         = ldapModule.getGroups(standardCallback);
   module.getUserByEmail    = ldapModule.getUsersByEmail(standardCallback);
   module.getUsersByGroup   = ldapModule.getUsersByGroup(standardCallback);
   module.getGroupsByUser   = ldapModule.getGroupsByUser(standardCallback);
   module.authenticateUser  = ldapModule.authenticateUser(standardCallback);

  return module;
};
