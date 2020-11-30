const mongoose = require('mongoose');
const ReactionMessage = require('../../db/models/reactionMessages.js');
const { MessageEmbed } = require('discord.js');
const { getRoles } = require('../../modules/utils.js');
module.exports = {
    name: 'linkPing',
    description: `Sends an embed for the reaction roles for the ping roles`,
    usage: `use in channel you want the message sent in`,
    guildOnly: true,
    ownerOnly: true,
    category: 'initialization',
    async execute(message, args) {
        const rawMessageId = args[0];

        if (isNaN(rawMessageId)) return;

        const pingMessage =
            (await message.channel.messages.fetch(rawMessageId)) || null;

        if (!pingMessage)
            return message.reply(
                'You must use this command in the same channel as the targeted message'
            );

        const roles = await getRoles(message.client);

        if (!roles) return message.reply("Cannot find 'Roles' in the database");

        const emojis = new Map();
        emojis.set('📣', roles.announcementPing.Id);
        emojis.set('📍', roles.eventsPing.Id);
        emojis.set('🎉', roles.giveaway.Id);
        emojis.set('🏐', roles.bumpE.Id);

        emojis.forEach(async (value, emoji) => await pingMessage.react(emoji));

        await message.delete();

        const reactionMessage = new ReactionMessage({
            _id: mongoose.Types.ObjectId(),
            messageId: pingMessage.id,
            reactions: {},
        });

        reactionMessage.reactions = emojis;

        return reactionMessage.save();
    },
};
