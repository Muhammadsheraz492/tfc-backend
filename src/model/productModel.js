import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    cost: {
        type: Number,
        required: true,
        min: 0
    },
    numberOfPieces: {
        type: Number,
        required: true,
        min: 0
    },
    totalValue: {
        type: Number,
        default: 0
    }
});

productSchema.pre('save', function (next) {
    this.totalValue = this.cost * this.numberOfPieces;
    next();
});

export default mongoose.model('Product', productSchema);
