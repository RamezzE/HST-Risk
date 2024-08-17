import mongoose from 'mongoose';

const SubTeamSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  letter: {
    type: String,
    required: true
  },
  cooldown_start_time: {
    type: Date,
    default: () => Date.now() - 24 * 60 * 60 * 1000 // 1 day before current date
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const SubTeam = mongoose.model('SubTeam', SubTeamSchema);

export default SubTeam;
