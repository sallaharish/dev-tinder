const mongooes = require('mongoose');
const User = require('./user'); // Importing the User model

const connectionRequestSchema = new mongooes.Schema(
    {
        fromUserId:{
            type: mongooes.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        toUserId:{
            type: mongooes.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ['ignored','intrested', 'accepted', 'rejected'],
                message: '{VALUE} is not a valid status'
            },
            

           
        }
    },
    {
        timestamps: true
    }
)
connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;
   if(connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        return next(new Error('You cannot send a connection request to yourself'));
    }       
    next(); 
});
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequestModel = new mongooes.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequestModel;