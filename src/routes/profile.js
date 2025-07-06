const express = require('express');
const router = express.Router();        
const auth = require('../middlewares/auth'); // Importing the auth middleware
const { validateSignUpData } = require('../utils/validation'); // Assuming you have a validation utility
const User = require('../models/user'); // Importing the User model
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing

const jwt = require('jsonwebtoken'); // Importing JWT for authentication

const connection = require("../config/database"); // Importing the database connection
 const valiadteUpdateData = require('../utils/validation'); // Importing the validation utility

// Route for getting user profile
router.get('/profile/view', auth, async (req, res) => {  
    console.log("Received request to view user profile"); // Log the request for debugging
    try {
        const userId = req.user.userId; // Assuming the user ID is stored in the token

        console.log("Received request to view user profile for user ID:", req.user); // Log the user ID for debugging
        const user = await User.findById(userId); // Find user by ID
        if (!user) {
        return res.status(404).send('User not found'); // Handle case where user is not found
        }
        res.status(200).json({ message: "Data Fetched Successfully" , data:user });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).send('Internal Server Error'); // Handle errors appropriately
    }
    }); 

  router.put('/profile/update', auth, async (req, res) => {
    try {
        console.log("Received update request:", req.body); // Log the request body for debugging
        valiadteUpdateData(req); // Validate the update data
        const userId = req.user.id; // Assuming the user ID is stored in the token
        const { firstName, lastName, age } = req.body; // Destructure fields from request body
        const user = await User.findById(userId); // Find user by ID
        if (!user) {
            return res.status(404).send('User not found'); // Handle case where user is not found
        }           


        user.firstName = firstName; // Update first name
        user.lastName = lastName; // Update last name   
        user.age = age; // Update age
        await user.save(); // Save updated user data
        res.status(200).send('Profile updated successfully'); // Return success response
    } catch (error) {

        console.error('Error updating profile:', error);
        res.status(500).send('Internal Server Error'); // Handle errors appropriately
    }   
});

router.post('/profile/chnagepasssword', auth, async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is stored in the token
        const { oldPassword, newPassword } = req.body; // Destructure old and new passwords from request body
        const user = await User.findById(userId); // Find user by ID
        if (!user) {                    
            return res.status(404).send('User not found'); // Handle case where user is not found
        }
        const isPasswordValid = await user.validatePassword(oldPassword); // Validate the old password using the method defined in the User model
        if (!isPasswordValid) {
            return res.status(401).send('Invalid old password'); // Handle case where old password is incorrect
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
        user.password = hashedNewPassword; // Update password       
        await user.save(); // Save updated user data
        res.status(200).send('Password changed successfully'); // Return success response       
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).send('Internal Server Error'); // Handle errors appropriately
    }

});

module.exports = router; // Export the router for use in the main app file
