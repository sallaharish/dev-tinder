const express = require('express');
const router = express.Router();        
const auth = require('../middlewares/auth'); // Importing the auth middleware
const { validateSignUpData } = require('../utils/validation'); // Assuming you have a validation utility
const User = require('../models/user'); // Importing the User model
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing

const jwt = require('jsonwebtoken'); // Importing JWT for authentication

const connection = require("../config/database"); // Importing the database connection





// Route for user signup    
router.post("/signup", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

router.post("/logout", auth, async (req, res) => {
  // Handle user logout logic here
  try {
    console.log("Received logout request for user:", req.user); // Log the user details for debugging
    res.clearCookie('token'); // Clear the JWT token cookie
    res.status(200).send('Logout successful'); // Send success response
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send('Internal Server Error'); // Handle errors appropriately
  }
});

module.exports = router; // Export the router to be used in the main app file