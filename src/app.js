const express = require('express');
const { validateSignUpData } = require('../../dev tinder/src/utils/validation'); // Assuming you have a validation utility
const User=require('./models/user'); // Assuming you have a User model defined in models/user.js
// const auth = require('../middlewares/auth'); // Assuming you have an auth middleware
const bcrypt = require('bcrypt'); // Assuming you are using bcrypt for password hashing

const connection=require("../src/config/database"); // Assuming this connects to your MongoDB database
const cookieParser = require('cookie-parser');

const app = express();
const jwt = require('jsonwebtoken'); // Assuming you are using JWT for authentication
const port = 3000;  
const auth = require('../src/middlewares/auth'); // Importing the auth middleware
app.use(express.json());
 // Middleware to parse JSON request bodies
 app.use(cookieParser()); // Middleware to parse cookies from request headers

const authRouter= require('./routes/auth'); // Assuming you have an auth route defined in routes/auth.js
// const profileRouter = require('./routes/profile'); // Assuming you have a users route defined in routes/users.js  
// const requestRouter = require('./routes/request'); // Assuming you have a posts route defined in routes/posts.js





app.use("/", authRouter); // Assuming you have an auth route defined in routes/auth.js  
// app.use("/", profileRouter); // Assuming you have a users route defined in routes/users.js
// app.use("/", requestRouter); // Assuming you have a posts route defined in routes/posts.js




connection().then
(() => {
  console.log('Database connected successfully');
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1); // Exit the process with failure
});
