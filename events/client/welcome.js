const generalId = '729870525119332414';

const IGNORED = new Set([
    '737457798123880509',
    '730264204174688288',
    '725171177235939378',
    '725178491494072381',
    '725172886821666898',
    '740086491069546537',
    '751999833597804624',
    '752000303787933706',
    '753087333506482277',
]);

module.exports = async (client, member) => {
    const generalChat = member.guild.channels.cache.get(generalId);

    const welcomeMsg = `Welcome to the server <@${member.id}>!`;

    const userMsgs = await userMessages(member.guild, member.id);
    if (userMsgs < 10) return generalChat.send(welcomeMsg);
};

const userMessages = async (guild, userID) => {
    const txtChannels = guild.channels.cache.filter(
        (c) => c.type === 'text' && !IGNORED.has(c.parentID)
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
