const mongoose = require('mongoose');
const ReactionMessage = require('../../db/models/reactionMessages.js');
const { MessageEmbed } = require('discord.js');
const { getRoles } = require('../../modules/utils.js');
module.exports = {
    name: 'linkScience',
    description: `Sends an embed for the reaction roles for the math roles`,
    usage: `use in channel you want the message sent in`,
    guildOnly: true,
    adminOnly: true,
    category: 'initialization',
    async execute(message, args) {
        const rawMessageId = args[0];

        if (isNaN(rawMessageId)) return;

        const scienceMessage =
            (await message.channel.messages.fetch(rawMessageId)) || null;

        if (!scienceMessage)
            return message.reply(
                'You must use this command in the same channel as the targeted message'
            );

        const roles = await getRoles(message.client);

        if (!roles) return message.reply("Cannot find 'Roles' in the database");

        const emojis = new Map();
        emojis.set('💻', roles.compSci.Id);
        emojis.set('🧬', roles.biology.Id);
        emojis.set('☄️', roles.physics.Id);
        emojis.set('🪐', roles.physScience.Id);
        emojis.set('🧪', roles.chemistry.Id);

        emojis.forEach(
            async (value, emoji) => await scienceMessage.react(emoji)
        );

        await message.delete();

        const reactionMessage = new ReactionMessage({
            _id: mongoose.Types.ObjectId(),
            messageId: scienceMessage.id,
            reactions: {},
        });

        reactionMessage.reactions = emojis;

        return reactionMessage.save();
    },
};
