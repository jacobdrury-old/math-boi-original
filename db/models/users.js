const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    discordID: String,
    username: String,
    discriminator: String,
    tag: String,
    nickname: String,
    isTutor: { type: Boolean, default: false },
    subjectMessageCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', UserSchema);
