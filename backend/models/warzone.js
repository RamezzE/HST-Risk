import mongoose from 'mongoose';

const warzoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    wars: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
});

const Warzone = mongoose.model('Warzone', warzoneSchema);

export default Warzone;
