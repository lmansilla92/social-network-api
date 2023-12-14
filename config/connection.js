// destructure connect and connection to connect to database using mongoose
const { connect, connection } = require('mongoose');

// declare conenction string to connect to database
const connectionString = 
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialNetworkDB';

// connect to database using the connectionString
connect(connectionString);

// export database connection
module.exports = connection;