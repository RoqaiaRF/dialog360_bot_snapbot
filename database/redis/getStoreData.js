// const { createClient } = require("redis");
// const client = createClient();

const redis = require("redis");
const client = redis.createClient();

//^ store a simple string

//EX: client.set('framework', 'ReactJS');

const setString = (key, value) => {

  return new Promise((resolve, reject) => {
    client.set((key, value), (err, data) => {
      if (err) return reject(err);
      if (data != null) return resolve(data);
    });
  });

}
//^ retrieve the value of the key - Just a string -

/*  EX:
        client.get('framework', function(err, reply) {
            console.log(reply); // ReactJS
        });
*/

const getString = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) return reject(err);
      if (data != null) return resolve(data);
    });
  });
}

//^ store objects (hashes) :

/* EX:
        client.hmset('frameworks_hash', {
            'javascript': 'ReactJS',
            'css': 'TailwindCSS',
            'node': 'Express'
        });
*/

const setObject = (key, value) => {
  
  return new Promise((resolve, reject) => {
    client.hmset((key, value), (err, data) => {
      if (err) return reject(err);
      if (data != null) return resolve(data);
    });
  });
}

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
const storeList = (array) => {
    // array= [key, value1, value2, ...]
  return new Promise((resolve, reject) => {
    client.rpush(array, (err, data) => {
      if (err) return reject(err);
      if (data != null) return resolve(data);
    });
  });
 
};

//^ get a list of items

/* EX:
        client.lrange('frameworks_list', 0, -1, function(err, reply) {
             console.log(reply); // [ 'ReactJS', 'Angular' ]
        });

*/
const getList = (key) => {
  
  return new Promise((resolve, reject) => {
    client.lrange(key, (err, data) => {
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
  storeList,
  getList,
};
