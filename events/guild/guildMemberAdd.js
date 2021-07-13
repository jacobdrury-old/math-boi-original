const mongoose = require('mongoose');
const User = require('../../db/models/users');

module.exports = async (client, member) => {
    client.emit('guildMemberJoins', member);

    try {
        const guild = member.guild;
        await member.send('', {
            embed: {
                color: 0x4e5181,
                title: `**Welcome to ${guild.name}!**`,
                description:
                    `**In order to get help you must first:**\n` +
                    `- Go to the role selection channel and add the subjects you need help with!\n\n` +
                    `- Post your question in the corresponding channel and use the \`${client.prefix}tutor\` command`,
                image: {
                    url: 'https://cdn.discordapp.com/attachments/731959466102226965/776323932890071061/banner_welcome1.png',
                },
            },
        });
    } catch (err) {}

    const user = new User({
        _id: mongoose.Types.ObjectId(),
        guildId: member.guild.id,
        discordID: member.id,
        username: `${member.user.username}#${member.user.discriminator}`,
    });

    await user.save();
};
