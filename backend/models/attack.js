import mongoose from 'mongoose'

const attackSchema = new mongoose.Schema({
    attacking_zone: {
        type: String,
        default: ""
    },
    attacking_team: {
        type: String,
        required: true
    },
    attacking_subteam: {
        type: String,
        required: true
    },
    defending_zone: {
        type: String,
        required: true
    },
    defending_team: {
        type: String,
        required: true,
    },
    defending_subteam: {
        type: String,
        default: ""
    },
    warzone_id: {
        type: String,
        required: true
    },
    war : {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: "",
    },
    
}, {
    timestamps: true
})

const Attack = mongoose.model('Attack', attackSchema);

export default Attack;