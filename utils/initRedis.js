const redis = require('redis');
const { promisify } = require('util');


const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
}); 

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('ready', () => {
  console.log('Redis client ready');
});

client.on('error', (error) => {
  console.error('Redis client error:', error);
}); 

client.on('end', () => {
  console.log('Redis client disconnected');
});

process.on('SIGINT', () => {
  client.quit();
})

client.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.log(err.message);
});

module.exports = client; 