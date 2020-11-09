module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const member = message.member;
        const client = message.client;
        await message.channel.send(`<@${member.id}>`, {
            embed: {
                color: 0x2caefe,
                title: `**To get help:**`,
                author: {
                    name: `Welcome to the server ${member.displayName}!`,
                },
                thumbnail: {
                    url: member.user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
                fields: [
                    {
                        name: 'Step 1',
                        value: `Please go to <#${client.ids.channels.roleSelection}> to add your roles`,
                    },
                    {
                        name: 'Step 2',
                        value: `Post your question in the corresponding channel and use the \`${client.prefix}tutor\` command`,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: member.guild.name,
                    icon_url: member.guild.iconURL({ dynamic: true }),
                },
            },
        });
    },
};
