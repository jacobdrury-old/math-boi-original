const mongoose = require('mongoose');
const ReactionMessage = require('../../db/models/reactionMessages.js');
const { MessageEmbed } = require('discord.js');
const { getRoles } = require('../../modules/utils.js');
module.exports = {
    name: 'sendMathRoles',
    description: `Sends an embed for the reaction roles for the math roles`,
    usage: `use in channel you want the message sent in`,
    guildOnly: true,
    adminOnly: true,
    category: 'initialization',
    async execute(message, shouldDelete = true) {
        const embedMessage = await message.channel.send({
            embed: new MessageEmbed({
                color: 0xb20000,
                // thumbnail: {
                //     url: 'https://i.imgur.com/96ZgOBc.jpg',
                // },
                title: 'Math Roles',
                description:
                    '1️⃣ Pre-Algebra\n' +
                    '2️⃣ Algebra/Statistics\n' +
                    '3️⃣ Geometry\n' +
                    '4️⃣ Pre-Calc\n' +
                    '5️⃣ Calculus (1 & 2)\n' +
                    '6️⃣ Upper Math (Calc 3, Diff Eq, Discrete, Linear Algebra, etc)',
            }),
        });

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
