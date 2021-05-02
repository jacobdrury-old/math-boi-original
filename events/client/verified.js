const { setToRole } = require('../../modules/UserHelpers');

module.exports = async (client, member) => {
    await setToRole(member, client.ids.roles.verified, null, false);

    return;
    const verifiedMessageChannel = member.guild.channels.cache.get(
        client.ids.channels.verifiedMessages
    );

    const userMsgs = await userMessages(member.guild, member.id);
    if (userMsgs < 10)
        return verifiedMessageChannel.send(`<@${member.id}>`, {
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
                        value: `Post your question in the corresponding channel and use the\n\`${client.prefix}tutor\` command`,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: member.guild.name,
                    icon_url: member.guild.iconURL({ dynamic: true }),
                },
            },
        });
};

const userMessages = async (guild, userID) => {
    const txtChannels = guild.channels.cache.filter(
        (c) =>
            c.type === 'text' &&
            !guild.client.ids.ignoredCategories.includes(c.parentID)
    );

    const msgCount = txtChannels.reduce(async (totalP, ch) => {
        const total = await totalP;
        const size = (
            await ch.messages.fetch({
                limit: 100,
            })
        ).filter((m) => m.author.id === userID).size;

        if (!size) return total + 0;

        return total + size;
    }, 0);
    return msgCount;
};
