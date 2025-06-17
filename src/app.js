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

app.post("/signup", async (req, res) => {
  // Handle user signup logic here
  try {
    console.log("Received signup request:", req.body); // Log the request body for debugging
    validateSignUpData(req); // Validate the signup data
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password
    const userDetails = new User({ // Create a new user object with the request body
      emailId: req.body.emailId,
      password: hashedPassword, 
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      gender: req.body.gender
    });
    await userDetails.save(); // Create a new user object with the request body

    res.status(200).send("Signup successful");
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Internal Server Error'); // Handle errors appropriately
  }
});


app.post("/login", async (req, res) => {
  // Handle user login logic here
  try {
    console.log("Received login request:", req.body); // Log the request body for debugging
    const { emailId, password } = req.body; // Destructure email and password from request body
    if (!emailId || !password) {
      return res.status(400).send('Email and password are required'); // Handle case where email or password is not provided
    }
    const user = await User.findOne({ emailId }); // Find user by email
    if (!user) {
      return res.status(404).send('User not found'); // Handle case where user is not found
    }
    const isPasswordValid = await user.validatePassword(password); // Validate the password using the method defined in the User model
    console.log("Password validation result:", isPasswordValid); // Log the password validation result for debugging
     // Compare provided password with stored hashed password
    if (isPasswordValid) {
      const token = await user.createJwtToken() // Generate JWT token
      console.log("Generated JWT token:", token); // Log the generated token for debugging
      // return res.status(401).send('Invalid credentials'); // Handle case where password is incorrect
      res.cookie('token', token);
    }
    // Set the JWT token as a cookie
    res.status(200).send('Login successful'); // Send success response
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error'); // Handle errors appropriately
  }
});


app.get("/profile",auth, async (req, res) => {
  // Handle fetching user profile logic here   
  console.log("Fetching user profile for user ID:", req.user.userId); // Log the user ID for debugging 
 
 
  const userId = await User.findOne({ _id: isTkenValid.userId }); // Find user by ID from the token
  if (!userId) {
    return res.status(404).send('User not found'); // Handle case where user is not found
  }
  res.status(200).json(userId); // Send profile data as a response
}); // End of /profile route

app.get("/user", async (req, res) => {  
  const useremail = req.body.emailId; // Get the email from query parameters

  // Handle fetching user data logic here
  console.log(useremail); // Log the email for debugging purposes
  if (!useremail) {
    return res.status(400).send('Email is required'); // Handle case where email is not provided
  }
  try {
    const users = await User.findOne({emailId:useremail}); // Fetch all users from the database
    res.status(200).json(users); // Send the users as a JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error'); // Handle errors appropriately
  }
});

app.put("/user", async (req, res) => {
  const useremail = req.body.emailId; // Get the email from request body
  const updateData = req.body; // Get the data to update from request body

  // Handle updating user data logic here
  console.log(useremail); // Log the email for debugging purposes
  if (!useremail) {
    return res.status(400).send('Email is required'); // Handle case where email is not provided
  }
  try {
    const updatedUser = await User.findOneAndUpdate({emailId:useremail}, updateData, { new: true }); // Update user in the database
    if (!updatedUser) {
      return res.status(404).send('User not found'); // Handle case where user is not found
    }
    res.status(200).json(updatedUser); // Send the updated user as a JSON response
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error'); // Handle errors appropriately
  }
});
app.delete("/user", async (req, res) => {
  const useremail = req.body.emailId; // Get the email from request body  
  // Handle deleting user data logic here
  console.log(useremail); // Log the email for debugging purposes     
  if (!useremail) {
    return res.status(400).send('Email is required'); // Handle case where email is not provided
  } 
  try {
    const deletedUser = await User.findOneAndDelete ({emailId:useremail}); // Delete user from the database
    if (!deletedUser) {
      return res.status(404).send('User not found'); // Handle case where user is not found
    }       
    res.status(200).send('User deleted successfully'); // Send success response
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error'); // Handle errors appropriately
  }
}
);


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
