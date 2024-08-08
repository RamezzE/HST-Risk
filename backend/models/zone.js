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
  team_no: {
    type: Number,
    required: true,
  },
  points: [pointSchema],
  adjacent_zones: [{
    type: String
  }]
}, {
  timestamps: true
});

const Zone = mongoose.model('Zone', zoneSchema);

export default Zone;
