module.exports = function(config, logger, credentials, redis) {
  "use strict";

  module.crm        = require('modules/crm')(config, logger, credentials, redis);
  module.monitoring = require('modules/monitoring')(config, logger, credentials, redis);
  module.ldap       = require('modules/ldap')(config, logger, credentials, redis);
  module.ticketing  = require('modules/ticketing')(config, logger, credentials, redis);
  module.configmgmt = require('modules/systems')(config, logger, credentials, redis);

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

  Monitoring System:
  module.getChecks
  module.getHosts
  module.getEvents
  module.getEventsByHost
  module.getHostByHostname
  module.getHostByIP
  module.getSilencedHosts
  module.getSilencedServices
  module.silenceHost
  module.silenceService
  module.unsilenceHost
  module.unsilenceService
  module.getServicesGroup
  module.getHostGroup
  module.getServicesByHost
  module.getHostsByService
  module.submitCheckStatus
  module.getStatus

  LDAP:
  module.getUsers
  module.getGroups
  module.getUserByEmail
  module.getUsersByGroup
  module.getGroupsByUser
  module.authenticateUser

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
  /*

  what ubersmith has

  // devices
  module.getDeviceByID = getDeviceByID;
  module.getDeviceByHostname = getDeviceByHostname;
  module.getDevicesbyTypeGroupID = getDevicesbyTypeGroupID;
  module.getDevicesByRack = getDevicesByRack;
  module.getDeviceTypeList = getDeviceTypeList;
  module.getDevicesbyClientID = getDevicesbyClientID;
  module.getDeviceHostnames = getDeviceHostnames;

  //tickets
  module.getTicketsbyDeviceID = getTicketsbyDeviceID;
  module.getTicketsbyClientID = getTicketsbyClientID;
  module.getTickets = getTickets;
  module.getTicketPostsbyTicketID = getTicketPostsbyTicketID;
  module.getTicketbyTicketID = getTicketbyTicketID;
  module.addPostToTicket = addPostToTicket;
  module.createNewTicket = createNewTicket;

  // ticket/client
  module.getContactsbyClientID = getContactsbyClientID;
  module.getContactbyContactID = getContactbyContactID;

  // LDAP
  module.getAdmins = getAdmins;
  module.authenticateUser = authenticateUser;
  module.getAdminByEmail = getAdminByEmail;


  // CRM
  module.getClientByID = getClientByID;
  module.getClients = getClients;
  module.getAllClients = getAllClients;
  module.getClientComments = getClientComments;
  module.getClientFiles = getClientFiles;
  module.getLeads = getLeads;
  module.getAttachments = getAttachments;
  module.getAttachment = getAttachment;
  module.getCommentAttachments = getCommentAttachments;
  module.getSalesPipeline = getSalesPipeline;
  module.getAllFiles = getAllFiles;
  module.submitNewLead = submitNewLead;
  module.submitComment = submitComment;

module.getMetadataGroup = getMetadataGroup;
module.getMetadataFields = getMetadataFields;
module.getAPIMethods = getAPIMethods;
module.postItemToUbersmith = postItemToUbersmith;
module.getQuickStats = getQuickStats;
*/