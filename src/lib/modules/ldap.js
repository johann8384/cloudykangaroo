/**
 *
 * @param config
 * @param logger
 * @param credentials
 * @param redis
 * @returns {module|*}
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
  module.getUserByEmail    = ldapModule.getUsersByEmail(emailAddress, standardCallback);
  module.getUsersByGroup   = ldapModule.getUsersByGroup(groupID, standardCallback);
  module.getGroupsByUser   = ldapModule.getGroupsByUser(userID, standardCallback);
  module.authenticateUser  = ldapModule.authenticateUser(username, password, standardCallback);
  module.resetPassword     = ldapModule.resetPassword(username, password, standardCallback);
  module.triggerPasswordReset = ldapModule.triggerPasswordReset(username, standardCallback);
  module.getUserID        = ldapModule.getUserID(emailAddress, standardCallback);
  return module;
};
