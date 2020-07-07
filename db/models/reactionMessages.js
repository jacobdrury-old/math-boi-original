const mongoose = require('mongoose');

const reactionMessageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    messageId: String,
    reactions: {
        type: Map,
        of: String,
    },
    commands: {
        type: Map,
        of: String,
    },
});

module.exports = mongoose.model('ReactionMessage', reactionMessageSchema);
