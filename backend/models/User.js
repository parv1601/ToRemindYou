// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Brinda',
    required: true
  },
  email: {
    type: String,
    default: 'nbrinda0007@gmail.com'
  }
});

export default mongoose.model('User', UserSchema);
