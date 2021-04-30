const { MongoClient } = require('mongodb');
const User = require('../models/User');
const Studio = require('../models/Studio');
const Room = require('../models/Room');

const database = new MongoClient(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 50,
  writeConcern: {
    w: 'majority',
    wtimeout: 2500,
  },
});

const connectDB = async () => {
  await database.connect();

  //* Connect to each model instance;
  await User.injectDB(database);
  await Studio.injectDB(database);
  await Room.injectDB(database);
  console.log(`MongoDB Connected: ${database.s.options.srvHost}`);
};

module.exports = { connectDB, database };
