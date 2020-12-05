const mongoose = require('mongoose');
const User = require('../../db/models/users');
const { getIsVerified, getIsTutor } = require('../../modules/UserHelpers');
module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        await message.channel.send('', {
            embed: {
                color: 0x4e5181,
                title: `**Welcome to ${message.guild.name}!**`,
                description:
                    `**In order to get help you must first:**\n` +
                    `- Go and read the rules and react with a :white_check_mark:\n\n` +
                    `- Go to the role selection channel and add the subjects you need help with!\n\n` +
                    `- Post your question in the corresponding channel and use the \`${message.client.prefix}tutor\` command`,
                image: {
                    url:
                        'https://cdn.discordapp.com/attachments/731959466102226965/776323932890071061/banner_welcome1.png',
                },
            },
        });
    },
};
