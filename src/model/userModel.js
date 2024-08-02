import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isVerify:{
        type:Boolean,
        default:false
    },
    userType:{
        type:Number,
        default:0
    }
});
export default mongoose.model('User', userSchema);
