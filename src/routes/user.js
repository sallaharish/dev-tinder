const express = require('express');
const userRouter = express.Router();        
const auth = require('../middlewares/auth'); // Importing the auth middleware
const { validateSignUpData } = require('../utils/validation'); // Assuming you have a validation utility
const User = require('../models/user'); // Importing the User model
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing

const jwt = require('jsonwebtoken'); // Importing JWT for authentication

const connection = require("../config/database"); // Importing the database connection
const connectionRequest = require('../models/connectionRequest'); // Importing the connection request model
const { model } = require('mongoose');


userRouter.get("/user/request/received", auth, async (req, res) => {

    try {
        const userId = req.user.userId; // Assuming the user ID is stored in the token
        console.log(userId,"userid")
        console.log("Received request to get received connection requests for user:", userId); // Log the user ID for debugging
        const receivedRequests = await connectionRequest.find({
            toUserId: userId, // Find requests where the user is the recipient
            status: 'intrested' // Assuming 'pending' is the status for received requests
        }).populate('fromUserId', ["firstName" ,"lastName"]);
// Populate the fromUserId field with user details
        console.log("Received connection requests:", receivedRequests);
        res.status(200).json({message:"data fetched successfully" , data:receivedRequests}); // Return received connection requests
    } catch (error) {   
        console.error('Error fetching received connection requests:', error);
        res.status(500).send('Internal Server Error'); // Handle errors appropriately

    }
}   );      

userRouter.get("/user/connections", auth, async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming the user ID is stored in the token  
        console.log("Received request to get connections for user:", userId); // Log the user ID for debugging
        const connections = await connectionRequest.find({
            $or: [
                { fromUserId: userId, status: 'accepted' }, // Find requests where the user is the sender
                { toUserId: userId, status: 'accepted' } // Find

                // requests where the user is the recipient 
            ]
        }).populate('fromUserId', ["firstName" ,"lastName"])
        .populate('toUserId', ["firstName" ,"lastName"]); // Populate both fromUserId and toUserId fields with user details
        console.log("Connections:", connections); // Log the connections for debugging
        res.status(200).json({message:"data fetched successfully" , data:connections});
    } catch (error) {
        console.error('Error fetching connections:', error);
        res.status(500).send('Internal Server Error'); // Handle errors appropriately
    }   
});

module.exports = userRouter; // Export the user router
