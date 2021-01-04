const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    deleted: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    guildId: String,
    discordID: String,
    username: String,
    isTutor: { type: Boolean, default: false },
    subjectMessageCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', UserSchema);
