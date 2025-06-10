const express = require('express');
const User=require('./models/user'); // Assuming you have a User model defined in models/user.js
// const auth = require('../middlewares/auth'); // Assuming you have an auth middleware

const connection=require("../src/config/database"); // Assuming this connects to your MongoDB database

const app = express();
const port = 3000;  

app.post("/signup", async (req, res) => {
  // Handle user signup logic here
  const userObject = new User({
    firstName: "harish",
    lastName: "salla",
    emailId: "sallaharish040@gmail.com",
    password: "asdasd",
    age: 20,
    gender:"female"
  });
  await userObject.save()
  // // You can add logic to save userObject to the database or send a response
  res.status(200).send("Signup successful");
});

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
