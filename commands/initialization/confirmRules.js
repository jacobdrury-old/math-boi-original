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

        const rulesMessage = await message.channel.messages.fetch(rawChannelId);

        return console.log(rulesMessage.content);

        const roles = await getRoles(message.client);

        if (!roles) return message.reply("Cannot find 'Roles' in the database");

        const emojis = new Map();
        emojis.set('1️⃣', roles.preAlgebra.Id);
        emojis.set('2️⃣', roles.algebra_statistics.Id);
        emojis.set('3️⃣', roles.geometry.Id);
        emojis.set('4️⃣', roles.preCalc.Id);
        emojis.set('5️⃣', roles.calc.Id);
        emojis.set('6️⃣', roles.upperMath.Id);

        emojis.forEach(async (value, emoji) => await embedMessage.react(emoji));

        await message.delete();

        const reactionMessage = new ReactionMessage({
            _id: mongoose.Types.ObjectId(),
            messageId: embedMessage.id,
            reactions: {},
        });

        reactionMessage.reactions = emojis;

        return reactionMessage.save();
    },
};
