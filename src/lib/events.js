module.exports = function(logger) {
  "use strict";
  var EventEmitter2 = require('eventemitter2').EventEmitter2;
  var OrchestrationEvents = new EventEmitter2({ wildcard: true, delimiter: '::', newListener: true, maxListeners: 30});

  OrchestrationEvents.on('newListener', function(event, listener) {
    logger.log('debug', 'Orchestration Now Listening For ' + event, {event: event, listener: listener});
  });

  OrchestrationEvents.on('removeListener', function(event, listener) {
    logger.log('debug', 'Orchestration Stopped Listening For ' + event, {event: event, listener: listener});
  });

  var addListener = function(event, listener) {
    OrchestrationEvents.addListener(event, listener);
  };

  var once = function(event, listener) {
    OrchestrationEvents.once(event, listener);
  };

  var removeListener = function(event, listener) {
    OrchestrationEvents.removeListener(event, listener);
  };

  var listeners = function(event) {
    return OrchestrationEvents.listeners(event);
  };

  OrchestrationEvents.onAny(function(event) {
    logger.log('debug', 'Event Fired', {event: event, arguments: arguments});
  });

  module.once = once;
  module.addListener = addListener;
  module.removeListener = removeListener;
  module.listeners = listeners;
  module.emit = OrchestrationEvents.emit;

  return module;
};