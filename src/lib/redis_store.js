//https://raw.github.com/BryanDonovan/node-cache-manager/master/examples/redis_example/redis_store.js
/**
 * This is a very basic example of how you can implement your own Redis-based
 * cache store with connection pooling.
 */

var RedisPool = require('sol-redis-pool');

function redis_store(args) {
  "use strict";
  args = args || {};
  var self = {};
  var ttl = args.ttl;
  self.name = 'redis';
  self.client = require('redis').createClient(args.port, args.host, args);

  var redis_options = {
    redis_host: args.host || '127.0.0.1',
    redis_port: args.port || 6379
  };

  var pool = new RedisPool(redis_options);

  function connect(cb) {
    pool.acquire(function (err, conn) {
      if (err) {
        pool.release(conn);
        return cb(err);
      }

      if (args.db || args.db === 0) {
        conn.select(args.db);
      }

      cb(null, conn);
    });
  }

  self.get = function (key, cb) {
    connect(function (err, conn) {
      if (err) { return cb(err); }

      conn.get(key, function (err, result) {
        pool.release(conn);
        if (err) { return cb(err); }
        cb(null, JSON.parse(result));
      });
    });
  };

  self.set = function (key, value, cb) {
    connect(function (err, conn) {
      if (err) { return cb(err); }

      if (ttl) {
        conn.setex(key, ttl, JSON.stringify(value), function (err, result) {
          pool.release(conn);
          cb(err, result);
        });
      } else {
        conn.set(key, JSON.stringify(value), function (err, result) {
          pool.release(conn);
          cb(err, result);
        });
      }
    });
  };

  self.del = function (key, cb) {
    connect(function (err, conn) {
      if (err) { return cb(err); }

      conn.del(key, function (err, result) {
        pool.release(conn);
        cb(err, result);
      });
    });
  };

  return self;
}

var methods = {
  create: function (args) {
    "use strict";
    return redis_store(args);
  }
};

module.exports = methods;
