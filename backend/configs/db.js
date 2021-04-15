const User = require('../models/User');
const MongoClient = require('mongodb').MongoClient;

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
  console.log(`MongoDB Connected: ${database.s.options.srvHost}`);
};

module.exports = { connectDB, database };
