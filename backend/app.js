const path = require('path');
const cors = require('cors');
const express = require('express');
const session = require('express-session');
require('dotenv').config();
const morgan = require('morgan');
const { connectDB } = require('./configs/db');
const routerUsers = require('./routes/users');
const routerStudios = require('./routes/studios');
const routerRooms = require('./routes/rooms');
const errorHandler = require('./middleware/error');

const app = express();
const port = process.env.PORT || 3001;

//* Connect to the Database
connectDB();

// cors to only my front-end

app.use(
  cors({
    origin: ['http://localhost:5000', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 204,
  }),
);

// Body parser
app.use(express.json());

// url
app.use(express.urlencoded({ extended: true }));

// sessions for cookies verification of the user
let secure = false;
if (process.env.NODE_ENV === 'production') secure = true;
app.use(
  session({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: process.env.COOKIE_MAX_AGE_DAYS * 1000 * 60 * 60 * 24,
      secure,
      sameSite: 'lax',
    },
  }),
);

// serve static files
app.use(express.static(path.join(__dirname, 'static')));

// dev logging middleware
app.use(morgan('dev'));

//* Use routs
app.use('/api/v1/users', routerUsers);
app.use('/api/v1/studios', routerStudios);
app.use('/api/v1/rooms', routerRooms);
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

/**
 * ! Handle error
 */
app.use(errorHandler);

// Listen the server
const server = app.listen(port, '0.0.0.0');
console.log(`Server listening on localhost:${port}`);

/**
 * ! Handle exit
 */
process.on('exit', (err) => {
  console.error(`Error: ${err.message}`);
  // close server and exit proccess
  server.close(() => {
    process.exit(1);
  });
});
