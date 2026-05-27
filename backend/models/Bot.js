const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  token: {
    type: String,
    required: true,
    trim: true
  },
  prefix: {
    type: String,
    default: '!'
  },
  status: {
    type: String,
    enum: ['online', 'idle', 'dnd', 'invisible'],
    default: 'online'
  },
  activity: {
    type: String,
    default: 'En ligne'
  },
  activityType: {
    type: String,
    enum: ['PLAYING', 'WATCHING', 'LISTENING', 'STREAMING', 'COMPETING'],
    default: 'PLAYING'
  },
  isRunning: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Bot', botSchema);
