import mongoose from 'mongoose'

const continentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    countryNames: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
});

const Continent = mongoose.model('Continent', continentSchema);

export default Continent;
