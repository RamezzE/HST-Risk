import mongoose from 'mongoose';

const warzoneSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    wars: [{
        name: {
            type: String,
            required: true
        },
        available: {
            type: Boolean,
            required: true
        }
    }]
}, {
    timestamps: true
});

const Warzone = mongoose.model('Warzone', warzoneSchema);

export default Warzone;
