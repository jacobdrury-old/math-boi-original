const generalId = '729870525119332414';

module.exports = async (client, member) => {
    const generalChat = member.guild.channels.cache.get(generalId);
    const prevMessages = await generalChat.messages.fetch({ limit: 20 });

    const welcomeMsg = `Welcome to the server <@${member.id}>!`;

    const isSent = prevMessages.filter((msg) => msg.content === welcomeMsg);

    if (isSent.size === 0) return generalChat.send(welcomeMsg);

    return;
};
