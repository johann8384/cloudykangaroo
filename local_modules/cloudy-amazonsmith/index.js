var _ = require('underscore');
var async = require('async');
var events = require('events');
var Emitter = new events.EventEmitter;
//var db = require('./lib/db');
var mgmtDomain = '';

var AWS = require('aws-sdk');

var cache_manager = require('cache-manager');
var cache_memory = cache_manager.caching({store: 'memory', max: 1024*64 /*Bytes*/, ttl: 60 /*seconds*/});

module.exports = function(params)
{
    var module = {};

    // This is called at the bottom of the module
    function initialize(initializeCallback) {
        Emitter.emit('configure.complete', params);
        initializeCallback(null, 'OK');
    }

    var raiseError = function(message)
    {
        logger.log('error', 'raise error: ' + message, {});
        throw Error(message);
    };

    var randomValue = function(myArray) {
        return myArray[Math.floor(Math.random() * myArray.length)];
    };

    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    Emitter.on('configure.complete', function(params) {
        if (params.warm_cache === true)
        {
            //start(params);
        }
    });

    var getDeviceByID = function(deviceID, callback) {
        db.devices.findByDeviceID(deviceID, callback);
    };

    var getDeviceByHostname = function(hostname, callback) {
        db.devices.findByHostname(hostname.replace(mgmtDomain, ''), function(error, deviceList) {
            callback(error, deviceList[0]);
        });
    };

    var getDevicesbyTypeGroupID = function(typeGroupID, callback) {
        db.devices.findByTypeGroupID(typeGroupID, callback);
    };

    var getDevicesbyClientID = function(clientID, callback) {
        db.devices.findByClientID(clientID, callback);
    };
/*
    var getTicketsbyDeviceID = function(deviceID, callback) {
        db.tickets.findByDeviceID(deviceID, callback);
    };

    var getTicketsbyClientID = function(clientID, callback) {
        db.tickets.findByClientID(clientID, callback);
    };

    var getTickets = function(callback) {
        db.tickets.getAll(callback);
    };

    var getTicketbyTicketID = function(ticketID, callback) {
        db.tickets.findByTicketID(ticketID, callback);
    };

    var getTicketPostsbyTicketID = function(ticketID, callback) {
        callback(null, db.tickets.tickets);
    };

    var addPostToTicket = function(ticketID, subject, body, visible, from, time_spent, callback) {
        console.log(ticketid + ' ' + subject);
        callback(null, {status: true, error_code: '', error_message: '', data: ticketID});
    };

    var createNewTicket = function(body, subject, recipient, user_id, author, cc, to, priority, client_id, contact_id, device_id, callback) {
        console.log(user_id + ' ' + subject);
        callback(null, {status: true, error_code: '', error_message: '', data: getRandomInt(900200, 900800)});
    };

    var submitNewLead = function(first, last, company, email, address, city, state, zip, country, phone, callback) {
        var postData = {
            first: req.body.firstname,
            last: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            country: req.body.county,
            active: 2
        };
        leads.push(postData);
        callback(null, leads.length -1);
    };
    */
    var getClientByID = function (clientID, callback) {
        db.clients.findByClientID(clientID, callback);
    };

    var getClients = function(getClientsCallback) {
        var clientList = db.clients.getAll();
        async.map(clientList
            , function(client, iteratorCallback) {
                db.contacts.getPrimaryContactbyClientID(client.clientID, function (err, contact) {
                    db.admins.findByClientID(client.clientID, function (err, admin) {
                        client.salesperson_name = admin.name;
                        client.full_name = contact.name;
                        client.email = contact.email;
                        iteratorCallback(null, client);
                    });
                });
            }, getClientsCallback);
    };

    var getDeviceHostnames = function(callback) {
        db.devices.getAllFull(function (err, devices) {
            var deviceList = {};
            _.each(devices, function(device) {
                deviceList[device.name + mgmtDomain] = {
                    'dev_desc': device.name + mgmtDomain,
                    'dev': device.deviceID,
                    'full_name': '',
                    'email': '',
                    'company': device.company,
                    'clientid': device.clientID,
                    'location': device.location,
                    'runbook': ''
                };
            });
            callback(null, deviceList);
        });
    };

    var getContactsbyClientID = function(clientID, callback) {
        db.contacts.findByClientID(clientID, callback);
    };

    var getContactbyContactID = function(contactID, callback) {
        db.contacts.findByContactID(contactID, callback);
    };

    var authenticateUser = function(username, pass, callback) {
        var contact = db.contacts.findbyusername(username);
        if (!contact){ return callback('Invalid Username or Password', null); }
        if (!contact.password || contact.password != pass) { return callback('Invalid Username or Password', null); }
        return callback(null, contact)
    };

    var getDeviceTypeList = function(callback) {
        db.devices.getDeviceTypeList(callback);
    };

    var getAdminByEmail = function(email, callback) {
        if (email) {
            db.admins.findByEmail(email, function (err, admin) {
                callback(err, admin);
            });
        } else {
            db.admins.getRandomAdmin(function (err, admin) {
                callback(err, admin);
            });
        }
    };

    var getLeads = function (callback) {
        db.clients.findByKeyword('innovate', callback);
    };

    var getClientComments = function (clientid, callback) {
        db.clients.findByKeyword('innovate', callback);
    };


    /*
     { InstanceId: 'i-0795e63d3b61356be',
     ImageId: 'ami-1c221e76',
     State: { Code: 16, Name: 'running' },
     PrivateDnsName: 'ip-10-96-13-146.ec2.internal',
     PublicDnsName: '',
     StateTransitionReason: '',
     KeyName: 'puppet-keypair',
     AmiLaunchIndex: 0,
     ProductCodes: [ [Object] ],
     InstanceType: 't2.large',
     LaunchTime: 2016-10-20T15:50:30.000Z,
     Placement:
     { AvailabilityZone: 'us-east-1c',
     GroupName: '',
     Tenancy: 'default' },
     Monitoring: { State: 'enabled' },
     SubnetId: 'subnet-fe265ea6',
     VpcId: 'vpc-8823d4ef',
     PrivateIpAddress: '10.96.13.146',
     PublicIpAddress: '54.86.49.38',
     Architecture: 'x86_64',
     RootDeviceType: 'ebs',
     RootDeviceName: '/dev/sda1',
     BlockDeviceMappings: [ [Object] ],
     VirtualizationType: 'hvm',
     ClientToken: 'Cyoct1476978628837',
     Tags: [ [Object], [Object], [Object] ],
     SecurityGroups: [ [Object] ],
     SourceDestCheck: true,
     Hypervisor: 'xen',
     NetworkInterfaces: [ [Object] ],
     IamInstanceProfile:
     { Arn: 'arn:aws:iam::292944481792:instance-profile/ec2_instance_role',
     Id: 'AIPAJ6PQAXXT3WQXYX26U' },
     EbsOptimized: false } ]
     */

    var fixupInstance = function(instance, done) {

        var name = getInstanceTag(instance.Tags, 'Name');
        var certname = getInstanceTag(instance.Tags, 'puppet_hostname');
        var roleList = getInstanceTag(instance.Tags, 'Roles');

        var newDevice = {};
        newDevice['company'] = 'Perspica';
        newDevice['management_level'] = instance.Monitoring.State;
        newDevice['device_status'] = instance.State.Name;
        newDevice['type'] = instance.InstanceType;
        newDevice['dev_desc'] = roleList;
        newDevice['dev'] = certname;
        newDevice['client_id'] = 1001;
        newDevice['label'] = name;
        newDevice['active'] = 1;
        newDevice['location'] = instance.Placement.AvailabilityZone;
        newDevice['roles'] = roleList.split(',');
        done(newDevice);
    };

    /*
     [ { Key: 'Roles', Value: 'puppet::master,ops' },
     { Key: 'puppet_hostname', Value: 'puppet.infra.perspica.io' },
     { Key: 'Name', Value: 'puppet001' } ]
     */
    var getInstanceTag = function(tags, key) {
        for (x=0; x<tags.length; x++) {
            tag = tags[x];
            if (tag['Key'] == key) {
                console.log(tag['Value']);
                return tag['Value'];
            }
        }
    };

    var handleReservationList = function(reservationList, callback) {
        var instanceList = [];
        try {
            _.each(reservationList.Reservations, function(reservation) {
                var instances = reservation.Instances;
                _.each(instances, function(instance) {
                    fixupInstance(instance, function(newInstance) {
                        instanceList.push(newInstance);
                    });
                });
            });
        } catch (e) {
            callback(e);
        }
        callback(null, instanceList);
    };

    var getAllDevices = function (callback) {
        var params= {
            DryRun: false,
            MaxResults: 100
        };
        var ec2 = new AWS.EC2();
        var instanceList = [];
        ec2.describeInstances(params, function(err, reservationList) {
            if (err) {
                callback(err, null);
            } else {
                handleReservationList(reservationList, callback);
            }
        });
    };

    module.getAllDevices = getAllDevices;
    module.getDeviceByID = getDeviceByID;
    module.getDeviceByHostname = getDeviceByHostname;
    module.getDevicesbyTypeGroupID = getDevicesbyTypeGroupID;
    module.getDeviceTypeList = getDeviceTypeList;
    module.getDevicesbyClientID = getDevicesbyClientID;
//    module.getTicketsbyDeviceID = getTicketsbyDeviceID;
//    module.getTicketsbyClientID = getTicketsbyClientID;
//    module.getTickets = getTickets;
//    module.getTicketPostsbyTicketID = getTicketPostsbyTicketID;
//    module.getTicketbyTicketID = getTicketbyTicketID;
//    module.getLeads = getLeads;
//    module.submitNewLead = submitNewLead;
//    module.addPostToTicket = addPostToTicket;
//    module.createNewTicket = createNewTicket;
//    module.getAdmins = getAdmins;
//    module.getAPIMethods = getAPIMethods;
//    module.postItemToUbersmith = postItemToUbersmith;
    module.getClientByID = getClientByID;
    module.getClients = getClients;
    module.getClientComments = getClientComments;
    module.getDeviceHostnames = getDeviceHostnames;
    module.getContactsbyClientID = getContactsbyClientID;
    module.getContactbyContactID = getContactbyContactID;
    module.getAdminByEmail = getAdminByEmail;
    module.authenticateUser = authenticateUser;

    //deviation from cloudy-ubersmith here:
    var getSensuEvents = function(count, deviceID, callback) {
        cache_memory.wrap('getSensuEvents:' + count + '-' + deviceID, function(cacheCallback) {
            db.devices.getSensuEvents(count, deviceID, cacheCallback);
        }, callback);
    };

    var getSensuDevices = function(callback) {
        cache_memory.wrap('getSensuDevices', function(cacheCallback) {
            db.devices.getSensuDevices(cacheCallback);
        }, callback);
    };

    var getClientByKeyword = function (keyword, callback) {
        db.clients.findByKeyword(keyword, callback);
    };
    module.getClientByKeyword = getClientByKeyword;
    module.getSensuDevices = getSensuDevices;
    module.getSensuEvents = getSensuEvents;
    initialize(function(err, reply) {
        mgmtDomain = params['mgmtDomain'];
        AWS.config.region = params['region'];
    });

    return module;
};

