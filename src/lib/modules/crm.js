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
    var crmModule = {};

    if (config.crmModule && config.crmModule.class) {

      var crmModuleConfig = {
        'config': config.crmModule,
        'credentials': credentials,
        'redis': redis
      };

      crmModule = require(config.crmModule.class)(crmModuleConfig);
    } else {
      throw new Error('no crmModule specified in configuration');
    }

  }
  catch (e) {
    logger.log('error', 'Could not initialize ldap Module', { error: e.message });
    throw e;
  }

  var standardCallback = function(err, ret, done) {
    done(err, ret);
  };

  module.getCustomers           = crmModule.getCustomers(standardCallback);
  module.getCustomerByCustomerID  = crmModule.getCustomerByCustomerID(standardCallback);
  module.getCustomerByUserID    = crmModule.getCustomerByUserID(emailAddress, standardCallback);
  module.getCustomerbyEmail     = crmModule.getCustomerbyEmail(groupID, standardCallback);
  module.getUserByEmail         = crmModule.getUserByEmail(userID, standardCallback);
  module.getUserByUserID        = crmModule.getUserByUserID(standardCallback);
  module.getUsersByCustomerID   = crmModule.getUsersByCustomerID(userID, standardCallback);
  module.getLeads               = crmModule.getLeads(standardCallback);
  module.getLeadByEmail         = crmModule.getLeadByEmail(userID, standardCallback);
  module.getLeadByLeadID        = crmModule.getLeadByLeadID(standardCallback);
  module.getLeadsByAdminID      = crmModule.getLeadsByAdminID(userID, standardCallback);
  module.getCustomersByAdminID  = crmModule.getCustomersByAdminID(standardCallback);
  module.submitNewLead          = crmModule.submitNewLead(userID, standardCallback);
  module.submitCustomer         = crmModule.submitCustomer(standardCallback);
  module.convertLead            = crmModule.convertLead(userID, standardCallback);
  module.submitActivity         = crmModule.submitActivity(standardCallback);
  module.submitComment          = crmModule.submitComment(userID, standardCallback);

  return module;
};
/*
 CRM:
 module.getCustomers
 module.getCustomerByCustomerID
 module.getCustomerByUserID
 module.getCustomerbyEmail
 module.getUserByEmail
 module.getUserByUserID
 module.getUsersByCustomerID
 module.getLeads
 module.getLeadByEmail
 module.getLeadByLeadID
 module.getLeadsByAdminID
 module.getCustomersByAdminID
 module.submitNewLead
 module.submitCustomer
 module.convertLead
 module.submitActivity
 module.submitComment
 */