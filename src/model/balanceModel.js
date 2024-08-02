import mongoose from 'mongoose';

const balanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true,
        min: 0
    },
   
});

export default mongoose.model('Balance', balanceSchema);
