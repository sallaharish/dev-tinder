const mongoose = require('mongoose');
const connectdb = async () => {
    try {
        await mongoose.connect("mongodb+srv://sallaharish040:9E7fhxLFCgCXg0AN@learningnode.6vaiq5g.mongodb.net/devTinder", {
           
        });
      
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}


module.exports = connectdb; // Export the connectdb function for use in other files