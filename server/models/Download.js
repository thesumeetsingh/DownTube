const mongoose = require('mongoose')

const downloadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // allow null for guest downloads
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: null,
  },
  quality: {
    type: String,
    default: null,
  },
  formatId: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  downloadDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

const Download = mongoose.model('Download', downloadSchema)
module.exports = Download
