module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        await message.channel.send(
            message.guild.me.user.avatarURL({ dynamic: true })
        );
    },
};
