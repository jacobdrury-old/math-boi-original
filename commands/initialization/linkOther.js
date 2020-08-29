const mongoose = require('mongoose');
const ReactionMessage = require('../../db/models/reactionMessages.js');
const { MessageEmbed } = require('discord.js');
const { getRoles } = require('../../modules/utils.js');
module.exports = {
    name: 'linkOther',
    description: `Sends an embed for the reaction roles for the other roles`,
    usage: `use in channel you want the message sent in`,
    guildOnly: true,
    adminOnly: true,
    category: 'initialization',
    async execute(message, args) {
        const rawMessageId = args[0];

        if (isNaN(rawMessageId)) return;

        const otherMessage =
            (await message.channel.messages.fetch(rawMessageId)) || null;

        if (!otherMessage)
            return message.reply(
                'You must use this command in the same channel as the targeted message'
            );

        const roles = await getRoles(message.client);

        if (!roles) return message.reply("Cannot find 'Roles' in the database");

        const emojis = new Map();
        emojis.set('🧮', roles.accounting.Id);
        emojis.set('🤓', roles.english.Id);
        emojis.set('🥖', roles.french.Id);
        emojis.set('🌮', roles.spanish.Id);
        emojis.set('🗻', roles.geography.Id);
        emojis.set('🏰', roles.history.Id);

        emojis.forEach(async (value, emoji) => await otherMessage.react(emoji));

        await message.delete();

        const reactionMessage = new ReactionMessage({
            _id: mongoose.Types.ObjectId(),
            messageId: otherMessage.id,
            reactions: {},
        });

        reactionMessage.reactions = emojis;

        return reactionMessage.save();
    },
};
