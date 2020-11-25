const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    discordID: String,
    username: String,
    discriminator: String,
    tag: String,
    nickname: String,
    userJoinDate: mongoose.Schema.Types.Date,
    isTutor: Boolean,
    subjectMessageCount: Number
});

module.exports = mongoose.model('User', UserSchema);
