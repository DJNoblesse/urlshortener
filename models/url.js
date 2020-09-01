const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    originUrl: String,
    shortedUrlCode: String,
});

module.exports = mongoose.model('Url', UrlSchema);