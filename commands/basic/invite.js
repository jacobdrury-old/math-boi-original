module.exports = {
    name: 'invite',
    description: 'Provides a crisp invite to the server',
    category: 'basic',
    guildOnly: true,
    async execute(message, args) {
        let member = message.author;
        const mention = args[0];
        if (mention && mention.startsWith('<@') && mention.endsWith('>')) {
            const id = mention
                .replace('<@', '')
                .replace('!', '')
                .replace('>', '');
            if (!isNaN(id) && id.length == 18) {
                member = await message.guild.members.fetch(id);
            }

            await member.send('https://discord.gg/S2azCgw');
            await message.channel.send(
                `${member} Check your DM's for the invite link!`
            );
        }
    },
};
