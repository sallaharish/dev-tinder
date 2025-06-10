 function auth(req, res, next) {  
        // Check if the user is authenticated
        if (req.isAuthenticated()) {
            return next(); // User is authenticated, proceed to the next middleware or route handler
        }
        // If not authenticated, redirect to login page
        res.redirect('/login');
    }     
    
    module.exports = auth;
// This middleware checks if the user is authenticated before allowing access to certain routes.        
// If the user is not authenticated, they are redirected to the login page.
// You can use this middleware in your routes like this:    
// const express = require('express');