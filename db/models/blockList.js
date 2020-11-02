const mongoose = require('mongoose');

const blockListSchema = mongoose.Schema({
    _id: String,
    blocked: [],
});

module.exports = mongoose.model('BlockList', blockListSchema);
