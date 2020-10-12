const mongoose = require('mongoose');
const ReactionMessage = require('../../db/models/reactionMessages.js');
const { getRoles } = require('../../modules/utils.js');
module.exports = {
    name: 'linkTutor',
    description: `Sends an embed for the reaction roles for the tutor roles`,
    usage: `use in channel you want the message sent in`,
    guildOnly: true,
    ownerOnly: true,
    category: 'initialization',
    async execute(message, args) {
        const rawMessageId = args[0];

        if (isNaN(rawMessageId)) return;

        const tutorMessage =
            (await message.channel.messages.fetch(rawMessageId)) || null;

        if (!tutorMessage)
            return message.reply(
                'You must use this command in the same channel as the targeted message'
            );

        const roles = await getRoles(message.client);

        if (!roles) return message.reply("Cannot find 'Roles' in the database");

        const emojis = new Map();
        emojis.set('🐣', roles.introMath.Id);
        emojis.set('🐥', roles.intMath.Id);
        emojis.set('🐓', roles.advMath.Id);
        emojis.set('🧪', roles.sciTutor.Id);
        emojis.set('🌍', roles.humTutor.Id);

        emojis.forEach(async (value, emoji) => await tutorMessage.react(emoji));

        await message.delete();

        const reactionMessage = new ReactionMessage({
            _id: mongoose.Types.ObjectId(),
            messageId: tutorMessage.id,
            reactions: {},
        });

        reactionMessage.reactions = emojis;

        return reactionMessage.save();
    },
};
