import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Brinda'
    },
    // NEW FIELD: Stores Brinda's email address
    email: { 
        type: String,
        required: false, // Optional until she logs in
        unique: true,
        sparse: true // Allows null values
    }
});

export default mongoose.model('User', UserSchema);