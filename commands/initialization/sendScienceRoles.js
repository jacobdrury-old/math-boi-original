const mongoose = require('mongoose');
const ReactionMessage = require('../../db/models/reactionMessages.js');
const { MessageEmbed } = require('discord.js');
const { getRoles } = require('../../modules/utils.js');
module.exports = {
    name: 'sendScienceRoles',
    description: `Sends an embed for the reaction roles for the science roles`,
    usage: `use in channel you want the message sent in`,
    guildOnly: true,
    adminOnly: true,
    category: 'initialization',
    async execute(message, shouldDelete = true) {
        const embedMessage = await message.channel.send({
            embed: new MessageEmbed({
                color: 0x009a00,
                // thumbnail: {
                //     url: 'https://i.imgur.com/mmQOLcW.png',
                // },
                title: 'Science Roles',
                description:
                    '1️⃣ Computer Science\n' +
                    '2️⃣ Biology\n' +
                    '3️⃣ Physics\n' +
                    '4️⃣ Physical Science\n' +
                    '5️⃣ Chemistry',
            }),
        });

        const roles = await getRoles(message.client);

        if (!roles) return message.reply("Cannot find 'Roles' in the database");

        const emojis = new Map();
        emojis.set('1️⃣', roles.compSci.Id);
        emojis.set('2️⃣', roles.biology.Id);
        emojis.set('3️⃣', roles.physics.Id);
        emojis.set('4️⃣', roles.physScience.Id);
        emojis.set('5️⃣', roles.chemistry.Id);

        emojis.forEach(async (value, emoji) => await embedMessage.react(emoji));

        if (shouldDelete) await message.delete();

        const reactionMessage = new ReactionMessage({
            _id: mongoose.Types.ObjectId(),
            messageId: embedMessage.id,
            reactions: {},
        });

        reactionMessage.reactions = emojis;

        return reactionMessage.save();
    },
};
