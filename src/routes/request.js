const express = require('express');
const router = express.Router();        
const auth = require('../middlewares/auth'); // Importing the auth middleware
const { validateSignUpData } = require('../utils/validation'); // Assuming you have a validation utility
const User = require('../models/user'); // Importing the User model
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing

const jwt = require('jsonwebtoken'); // Importing JWT for authentication

const connection = require("../config/database"); // Importing the database connection
const connectionRequest= require("../models/connectionRequest"); // Importing the connection request model

// Route for sending a connection request       
router.post('/request/send/:status/:toUserId', auth, async (req, res) => {
    try {   
        const fromUserId = req.user.userId;
        console.log(req.user); // Log the user object for debugging
         // Assuming the user ID is stored in the token
         console.log("Received request to send connection request:", req.user._id); // Log the request parameters for debugging
        const toUserId = req.params.toUserId; // Get the recipient user ID from the request parameters      
        const status = req.params.status; // Default status for a new request
        if (fromUserId === toUserId) {
            return res.status(400).send('You cannot send a request to yourself'); // Handle case where user tries to send a request to themselves
        }
        const usercheck= await User.findById(toUserId); // Check if the recipient user exists
        if (!usercheck) {
            return res.status(404).send('Recipient user not found'); // Handle case where recipient user does not exist
        }
        const allowedStatuses = ['ignored','intrested'];
        if(!allowedStatuses.includes(status)){
            return res.status(400).send('Invalid status'); // Handle case where status is not allowed
        } // Define allowed statuses
        const existingRequest = await connectionRequest.findOne({
            $or: 
                [{fromUserId: fromUserId,
                toUserId: toUserId},
                {fromUserId: toUserId,
                toUserId: fromUserId}]
            // Check if a request already exists between the two users
            }
        );
        if (existingRequest) {
            return res.status(400).send('Connection request already exists'); // Handle case where a request already exists
        }   
        const newRequest = new connectionRequest({
            fromUserId,
            toUserId,               
            status, // Set the status of the request
        });
        await newRequest.save();

        res.json(
            { message: 'Connection request sent successfully', data:newRequest } // Return success response with request ID   
        ); // Return success response
    } catch (error) {

        console.error('Error sending connection request:', error);
        res.status(500).send('Internal Server Error'); // Handle errors appropriately   
    }
}

);

// Route for updating a connection request status
router.post('/request/review/:status/:requestId', auth, async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming the user ID is stored in the token 
        console.log("Received request to review connection request:", req.user); // Log the user ID for debugging 
        const requestId = req.params.requestId; // Get the request ID from the request parameters
        const status = req.params.status;
        console.log(status)
        const allowedStatuses = ['accepted', 'rejected']; // Define allowed statuses
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send('Invalid status'); // Handle case where status is not allowed
        }       
        const connectionRequestData = await connectionRequest.findOne({
            fromUserId: requestId,
            toUserId: userId ,// Ensure the request belongs to the authenticated user        
            status: 'intrested' // Ensure the request is in the 'intrested' status  ,
        });
        console.log("Connection request data:", connectionRequestData); // Log the request data for debugging
        
        if (!connectionRequestData) {
            return res.status(404).send('Connection request not found or already processed'); // Handle case where request is not found or already processed
        }
        console.log("Received request to review connection request:", connectionRequestData); // Log the request data for debugging
        connectionRequestData.status = status;  
        await connectionRequestData.save(); // Save the updated request status
        res.json(
            { message: 'Connection request reviewed successfully', data: connectionRequestData } // Return success response with updated request data
        ); // Return success response       

    }catch (error) {
        console.error('Error reviewing connection request:', error);
        res.status(500).send('Internal Server Error'); // Handle errors appropriately
    }   
}); 
module.exports = router; // Export the router to be used in the main app file




