module.exports = async (client, message) => {
    setTimeout(() => {
        message.channel.send(`<@&${client.ids.roles.bumping}>`, {
            embed: {
                title: "Bump timer's out!",
                description: "It's time to bump again!",
                color: 0x24b8b8,
                timestamp: new Date(),
            },
        });
    }, 7200000);
};
