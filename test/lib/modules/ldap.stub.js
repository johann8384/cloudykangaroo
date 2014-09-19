/**
 * LDAP Module Testing Stub
 * @param config
 * @param logger
 * @param credentials
 * @param redis
 * @returns {{}}
 */
module.exports = function(config, logger, credentials, redis) {
  "use strict";
  try {
    console.log(config);
    if (config.ldapModule && config.ldapModule.class) {
      var ldapModuleConfig = {
        'config': config.ldapModule,
        'credentials': credentials,
        'redis': redis
      };

      var ldapModule = require(config.ldapModule.class)(ldapModuleConfig);

    } else {
      throw new Error('no ldapModule specified in configuration');
    }

  }
  catch (e) {
    throw e;
  }

  var db = require('../db');

  var getUsers = function(done) {
    db.users.getUsers(done);
  };

  var getGroups = function(done) {
    db.users.getGroups(done);
  };

  var getUsersByEmail = function (email, done) {
    var user = db.users.syncfindByUsername('test');
    user.emails = [{ name: 'primary', value: email} ];
  };

  var getUsersByGroup = function(group, done) {
    db.users.findbyUsername('test', function (err, user) {
      user.groups = [group];
      done(null, [user]);
    });
  };

  var getGroupsByUser = function(userID, done) {
    db.users.find(userID, function (err, user) {
      done(null, user.groups);
    });
  };

  var authenticateUser = function(username, password, done) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    });
  };

  module.getUsers          = getUsers;
  module.getGroups         = getGroups;
  module.getUserByEmail    = getUsersByEmail;
  module.getUsersByGroup   = getUsersByGroup;
  module.getGroupsByUser   = getGroupsByUser;
  module.authenticateUser  = authenticateUser;

  return module;
};
