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
    var monModule = {};

    if (config.monModule && config.monModule.class) {

      var monModuleConfig = {
        'config': config.monModule,
        'credentials': credentials,
        'redis': redis
      };

      monModule = require(config.monModule.class)(monModuleConfig);
    } else {
      throw new Error('no monModule specified in configuration');
    }

  }
  catch (e) {
    logger.log('error', 'Could not initialize monitoring module', { error: e.message });
    throw e;
  }

  var standardCallback = function (err, ret, done) {
    done(err, ret);
  };

  module.getChecks          = monModule.getChecks; //(standardCallback);
  module.getHosts           = monModule.getHosts; //(standardCallback);
  module.getEvents          = monModule.getEvents; //(standardCallback);
  module.getEventsByHost    = monModule.getEventsByHost; //(hostID, standardCallback);
  module.getEventsByService = monModule.getEventsByService; //(serviceID, standardCallback);
  module.getHostByHostname  = monModule.getHostByHostname; //(hostName, standardCallback);
  module.getHostByIP        = monModule.getHostByIP; //(hostIP, standardCallback);
  module.getSilencedHosts   = monModule.getSilencedHosts; //(standardCallback);
  module.getSilencedServices = monModule.getSilencedServices; //(standardCallback);
  module.silenceHost        = monModule.silenceHost; // (userID, hostID, expires, ticketID, standardCallback);
  module.silenceService     = monModule.silenceService; //(userID, hostID, checkID, expires, ticketID, standardCallback);
  module.unsilenceHost      = monModule.unsilenceHost; //(hostID, standardCallback);
  module.unsilenceService   = monModule.unsilenceService; //(serviceID, standardCallback);
  module.getServicesGroup   = monModule.getServicesGroup; //(serviceGroupID, standardCallback);
  module.getHostGroup       = monModule.getHostGroup; //(hostGroupID, standardCallback);
  module.getServicesByHost  = monModule.getServicesByHost; //(hostID, standardCallback);
  module.getHostsByService  = monModule.getHostsByService; //(serviceID, standardCallback);
  module.submitCheckStatus  = monModule.submitCheckStatus; //(checkID, checkStatus, checkDetail, standardCallback);
  module.getStatus          = monModule.getStatus; //(standardCallback);
};