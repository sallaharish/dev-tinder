const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        unique: true,
        trim: true,
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [50, 'First name must be less than 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [50, 'Last name must be less than 50 characters']
    },
    emailId: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        maxlength: [128, 'Password must be less than 128 characters']
    },
    profilepicture: {
        type: String,
            

    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [18, 'Age must be at least 18'],
        max: [100, 'Age must be at most 100']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        trim: true,
        lowercase: true,
        enum: {
            values: ['male', 'female', 'others'],
            message: '{VALUE} is not a valid gender — allowed: male, female, others'
        }
    },
    about: {
        type: String,
        default: 'This user prefers to keep an air of mystery.'
    },
    skills: {
        type: [String], // Array of strings
        default: []     // Optional, defaults to empty array
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

userSchema.methods.createJwtToken = async function() {
    const jwt = require('jsonwebtoken');        
    const token = await jwt.sign({ userId: this._id }, 'your_jwt_secret', { expiresIn: '1h' });
    return token;       
}
userSchema.methods.validatePassword = async function(password) {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(password, this.password); // Compare provided password with stored hashed password
}           

const User = mongoose.model('User', userSchema);
module.exports = User;
