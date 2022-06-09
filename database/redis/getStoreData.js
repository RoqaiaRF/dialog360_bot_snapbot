// const { createClient } = require("redis");
// const client = createClient();

const redis = require("redis");
const client = redis.createClient();

//^ store a simple string

//EX: client.set('framework', 'ReactJS');

const setString = (key, value) => {
  client.set(key, value);
};
//^ retrieve the value of the key - Just a string -

/*  EX:
        client.get('framework', function(err, reply) {
            console.log(reply); // ReactJS
        });
*/

const getString = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        return reject(err);
      } else if (data != null) {
        return resolve(data);
      }
    });
  });
};

//^ store objects (hashes) :

/* EX:
        client.hmset('frameworks_hash', {
            'javascript': 'ReactJS',
            'css': 'TailwindCSS',
            'node': 'Express'
        });
*/

const setObject = (key, value) => {
  client.hmset((key, value), function (err, reply) {
    //     console.log(reply); // 2
  });
};

//^ retrieve the value of the key - Just an objects -

/* EX:
        client.hgetall('frameworks_hash', function(err, object) {
            console.log(object); // { javascript: 'ReactJS', css: 'TailwindCSS', node: 'Express' }
        });

*/

const getObject = (key) => {
  return new Promise((resolve, reject) => {
    client.hgetall(key, (err, data) => {
      if (err) return reject(err);
      if (data != null) return resolve(data);
    });
  });
};

//^ store a list of items

/* EX:
        client.rpush(['frameworks_list', 'ReactJS', 'Angular'], function(err, reply) {
          console.log(reply); // 2
        });

*/
const setList = (array) => {
  client.rpush(array, function (err, reply) {
  });
  // array= [key, value1, value2, ...]
};

//^ get a list of items

/* EX:
        client.lrange('frameworks_list', 0, -1, function(err, reply) {
             console.log(reply); // [ 'ReactJS', 'Angular' ]
        });

*/
const getList = (key, begin, end) => {
  return new Promise((resolve, reject) => {
    client.lrange(key, begin, end, (err, data) => {
      if (err) return reject(err);
      if (data != null) return resolve(data);
    });
  });
};

module.exports = {
  setString,
  getString,
  setObject,
  getObject,
  setList,
  getList,
};
