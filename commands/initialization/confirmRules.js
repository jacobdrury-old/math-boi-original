const mongoose = require('mongoose');
const ReactionMessage = require('../../db/models/reactionMessages.js');
const { MessageEmbed } = require('discord.js');
const { getRoles } = require('../../modules/utils.js');
module.exports = {
    name: 'confirmRules',
    description: `Adds the check mark confirmation to the message id passed`,
    usage: `use in channel you want the message sent in`,
    usage: '<message id>',
    guildOnly: true,
    adminOnly: true,
    category: 'initialization',
    async execute(message, args) {
        const rawChannelId = args[0];

        if (isNaN(rawChannelId)) return;

        const rulesMessage =
            (await message.channel.messages.fetch(rawChannelId)) || null;

        if (!rulesMessage)
            return message.reply(
                'You must use this command in the same channel as the targeted message'
            );

        const roles = await getRoles(message.client);

        if (!roles) return message.reply("Cannot find 'Roles' in the database");

        const emoji = '✅';
        await rulesMessage.react(emoji);

        await message.delete();

        const reactionMessage = new ReactionMessage({
            _id: mongoose.Types.ObjectId(),
            messageId: rulesMessage.id,
            reactions: {},
        });

        reactionMessage.reactions.set(emoji, roles.verified.Id);

        return reactionMessage.save();
    },
};
