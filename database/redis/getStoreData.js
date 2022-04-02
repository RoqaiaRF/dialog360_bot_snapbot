// const { createClient } = require("redis");
// const client = createClient();

const redis = require("redis");
const client = redis.createClient();

//^ store a simple string

//EX: client.set('framework', 'ReactJS');

const setString = (key, value) => {
  return client.set(key, value, function (err, reply) {
    //console.log(reply); // succsess!
    return reply;
  });
};

//^ retrieve the value of the key - Just a string -

/*  EX:
        client.get('framework', function(err, reply) {
            console.log(reply); // ReactJS
        });
*/

const getString =  (key) => {
  let value;

  try {
     client.get(key, (err, data) => {

      if (err) {
        console.error(err); 
      }

      if (data) {
        console.log(data);
        value = data;
      } 
      else {

      }
    });
  } catch (err) {
    console.log(err);

  }
  return value
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
  return client.hmset(key, value, function (err, reply) {
    //console.log(reply); // OK
    return reply;
  });
};

//^ retrieve the value of the key - Just an objects -

/* EX:
        client.hgetall('frameworks_hash', function(err, object) {
            console.log(object); // { javascript: 'ReactJS', css: 'TailwindCSS', node: 'Express' }
        });

*/
const getObject = (key) => {
  return client.hgetall(key, function (err, object) {
    //console.log(object);
    return object;
  });
};

//^ store a list of items

/* EX:
        client.rpush(['frameworks_list', 'ReactJS', 'Angular'], function(err, reply) {
          console.log(reply); // 2
        });

*/
const storeList = (array) => {
  return client.rpush(array, function (err, reply) {
    // array= [key, value1, value2, ...]
  //  console.log(reply); // 2
    return reply;
  });
};

//^ get a list of items

/* EX:
        client.lrange('frameworks_list', 0, -1, function(err, reply) {
             console.log(reply); // [ 'ReactJS', 'Angular' ]
        });

*/
const getList = (key) => {
  return client.lrange(key, 0, -1, function (err, reply) {
    //console.log(reply); // [ 'ReactJS', 'Angular' ]
    return reply;
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
