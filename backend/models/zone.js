import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  }
});

const zoneSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  points: [pointSchema]
}, {
  timestamps: true
});

const Zone = mongoose.model('Zone', zoneSchema);

export default Zone;
