const ReactionMessage = require('../../db/models/reactionMessages');
const { getBlockedTutors } = require('../../modules/utils');

module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        // const blockedTutors = await getBlockedTutors();
        // blockedTutors.blocked.push(message.author.id);
        // await blockedTutors.save();
        // const reactionMessage = new ReactionMessage({
        //     _id: mongoose.Types.ObjectId(),
        //     messageId: message.author.id + '1',
        //     blockedUsers: blockedTutors,
        // });
        // await reactionMessage.save();
        // const reactionMessage2 = await ReactionMessage.findOne({
        //     messageId: message.author.id,
        // }).populate('blockedUsers');
        // console.log(reactionMessage2.blockedUsers.blocked);

        console.log();
    },
};
