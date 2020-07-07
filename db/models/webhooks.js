const mongoose = require('mongoose');

const webhookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    channelId: String,
    Id: String,
    token: String,
});

module.exports = mongoose.model('Webhook', webhookSchema);
