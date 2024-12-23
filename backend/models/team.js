import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
    
    number: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    locked: {
        type: Boolean,
        default: false,
        required: true
    },
    expoPushTokens: {
        type: [String],
        default: [],
        required: true
    },
}, {
    timestamps: true
})

const Team = mongoose.model('Team', teamSchema);

export default Team;