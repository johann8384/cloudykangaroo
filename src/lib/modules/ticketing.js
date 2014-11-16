/**
 *
 * @param config
 * @param logger
 * @param credentials
 * @param redis
 */
module.exports = function(config, logger, credentials, redis) {
  "use strict";
  try {
    var ticketModule = {};

    if (config.ticketModule && config.ticketModule.class) {

      var ticketModuleConfig = {
        'config': config.ticketModule,
        'credentials': credentials,
        'redis': redis
      };

      ticketModule = require(config.ticketModule.class)(ticketModuleConfig);
    } else {
      throw new Error('no ticketModule specified in configuration');
    }

  }
  catch (e) {
    logger.log('error', 'Could not initialize monitoring module', { error: e.message });
    throw e;
  }

  var standardCallback = function (err, ret, done) {
    done(err, ret);
  };

  module.getQueues                        = ticketModule.getQueues(standardCallback);
  module.getTicketsByHost                 = ticketModule.getTicketsByHost(hostID, standardCallback);
  module.getTicketsByCustomerID           = ticketModule.getTicketsByCustomerID(customerID, standardCallback);
  module.getTicketsByEmail                = ticketModule.getTicketsByEmail(emailAddress, standardCallback);
  module.getTicketsByPriority             = ticketModule.getTicketsByPriority(ticketPriority, standardCallback);
  module.getTicketsBySeverity             = ticketModule.getTicketsBySeverity(ticketSeverity, standardCallback);
  module.getTicketsByQueue                = ticketModule.getTicketsByQueue(ticketQueue, standardCallback);
  module.getTicket                        = ticketModule.getTicket(ticketID, standardCallback);
  module.createNewTicket                  = ticketModule.createNewTicket(ticketData, standardCallback);
  module.addPostToTicket                  = ticketModule.addPostToTicket(ticketID, postData, standardCallback);
  module.addCustomerToTicketByCustomerID  = ticketModule.addCustomerToTicketByCustomerID(ticketID, customerID, standardCallback);
  module.addUserToTicketByContactID       = ticketModule.addUserToTicketByContactID(ticketID, contactID, standardCallback);
  module.addUserToTicketByUserID          = ticketModule.addUserToTicketByUserID(ticketID, userID, standardCallback);
  module.addUserToTicketByEmail           = ticketModule.addUserToTicketByEmail(ticketID, emailID, standardCallback);
  module.assignTicketByEmail              = ticketModule.assignTicketByEmail(ticketID, emailID, standardCallback);
  module.assignTicketByUserID             = ticketModule.assignTicketByUserID(ticketID, userID, standardCallback);
  module.assignTicketByQueue              = ticketModule.assignTicketByQueue(ticketID, queueID, standardCallback);
  module.setTicketStatus                  = ticketModule.setTicketStatus(ticketID, ticketStatus, standardCallback);
  module.setTicketPriority                = ticketModule.setTicketPriority(ticketID, ticketPriority, standardCallback);
  module.setTicketSeverity                = ticketModule.setTicketSeverity(ticketID, ticketSeverity, standardCallback);
};
/*

 Ticketing:
 module.getQueues
 module.getTicketsByHost
 module.getTicketsByCustomerID
 module.getTicketsByEmail
 module.getTicketsByPriority
 module.getTicketsBySeverity
 module.getTicketsByQueue
 module.getTicket
 module.createNewTicket
 module.addPostToTicket
 module.addCustomerToTicketByCustomerID
 module.addUserToTicketByContactID
 module.addUserToTicketByUserID
 module.addUserToTicketByEmail
 module.assignTicketByEmail
 module.assignTicketByUserID
 module.assignTicketByQueue
 module.setTicketStatus
 module.setTicketPriority
 module.setTicketSeverity
 */
