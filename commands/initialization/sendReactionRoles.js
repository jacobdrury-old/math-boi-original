const { MessageEmbed } = require('discord.js');
const sendScienceRoles = require('./sendScienceRoles.js').execute;
const sendMathRoles = require('./sendMathRoles.js').execute;
module.exports = {
    name: 'sendReactionRoles',
    description: `Sends an embeds for the reaction roles`,
    usage: `use in channel you want the message sent in`,
    guildOnly: true,
    adminOnly: true,
    category: 'initialization',
    async execute(message) {
        await message.channel.send({
            embed: new MessageEmbed({
                color: 0x7289da,
                thumbnail: {
                    url: message.channel.guild.iconURL(),
                },
                title: '**Role assignment**',
                description:
                    'In this channel you will choose the roles you want!\n' +
                    'Please react to the corresponding number to be assigned that role!',
            }),
        });

        await sendMathRoles(message, false);
        await sendScienceRoles(message, false);

        await message.delete();
    },
};
