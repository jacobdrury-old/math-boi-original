const generalId = '729870525119332414';

module.exports = async (client, member) => {
    const generalChat = member.guild.channels.cache.get(generalId);

    const welcomeMsg = `Welcome to the server <@${member.id}>!`;

    const userMsgs = await userMessages(member.guild, member.id);
    if (userMsgs < 10) return generalChat.send(welcomeMsg);
};

const userMessages = async (guild, userID) => {
    const txtChannels = guild.channels.cache.filter((c) => c.type === 'text');

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
