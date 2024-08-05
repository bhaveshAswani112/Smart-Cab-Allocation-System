import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    startLocation: {
        type: { 
            type: String, 
            enum: ['Point'], 
            required: true 
        },
        coordinates: { type: [Number], required: true }
    },
    endLocation: {
        type: { 
            type: String, 
            enum: ['Point'], 
            required: true 
        },
        coordinates: { type: [Number], required: true }
    },
    cabId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cab'
    },
    status: { 
        type: String, enum: ['ongoing', 'completed'], 
        default: 'ongoing' 
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
});

export const Trip = mongoose.model('Trip', tripSchema);
