import mongoose from "mongoose";

const cabSchema = new mongoose.Schema({
    cabId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    status: { 
        type: String, 
        enum: ['idle', 'engaged'], 
        default: 'idle' 
    }
});

cabSchema.index({ location: '2dsphere' });

export const Cab = mongoose.model('Cab', cabSchema);
