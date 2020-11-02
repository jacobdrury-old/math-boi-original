const ReactionMessage = require('../../db/models/reactionMessages');
const { getBlockedTutors } = require('../../modules/utils');
const mongoose = require('mongoose');

module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const reactionMessage = await ReactionMessage.findOne({
            messageId: '190179187863060480',
        }).populate('BlockList');

        console.log(reactionMessage);
        // const blockedTutors = await getBlockedTutors();

        // blockedTutors.blocked.push(message.author.id);

        // await blockedTutors.save();

        // const reactionMessage = new ReactionMessage({
        //     _id: mongoose.Types.ObjectId(),
        //     messageId: message.author.id,
        //     blockedUsers: blockedTutors,
        // });

        // reactionMessage.save();
    },
};
