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
    async execute(message) {
        const embedMessage = await message.channel.send({
            embed: new MessageEmbed({
                color: 0x1e90ff,
                title: 'Math Roles',
                description:
                    '1️) Pre-Algebra\n' +
                    '2️) Algebra/Statistics\n' +
                    '3️) Geometry\n' +
                    '4️) Pre-Calc\n' +
                    '5️) Calculus (1 & 2)\n' +
                    '6️) Upper Math (Calc 3, Diff Eq, Discrete, Linear Algebra, etc)',
            }),
        });

        const roles = await getRoles(message.client);

        if (!roles) return message.reply("Cannot find 'Roles' in the database");

        const emojis = new Map();
        emojis.set('1️⃣', roles.preAlgebra);
        emojis.set('2️⃣', roles.algebra_statistics);
        emojis.set('3️⃣', roles.geometry);
        emojis.set('4️⃣', roles.preCalc);
        emojis.set('5️⃣', roles.calc);
        emojis.set('6️⃣', roles.upperMath);

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
