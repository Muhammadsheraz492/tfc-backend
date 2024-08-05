import mongoose from 'mongoose';

const descriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        default:""
    },
    date: {
        type: String,
        default:""
    }
   
});

export default mongoose.model('Description', descriptionSchema);
