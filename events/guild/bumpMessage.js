module.exports = async (client, message) => {
    setTimeout(() => {
        embed
            .setTitle("Bump timer's out!")
            .setDescription("It's time to bump again!")
            .setColor('#24b8b8')
            .setTimestamp();
        message.channel.send(`<@${client.ids.roles.bumping}>`, embed);
    }, 7200000);
};
