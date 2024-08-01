import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
    
    number: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

const Team = mongoose.model('Team', teamSchema);

export default Team;