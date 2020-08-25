module.exports = {
    name: 'invite',
    description: 'Provides a crisp invite to the server',
    category: 'basic',
    guildOnly: true,
    async execute(message, args) {
        let member = await message.guild.members.fetch(message.author.id);
        const mention = args[0];

        if (mention && mention.startsWith('<@') && mention.endsWith('>')) {
            if (!member.hasPermission('MANAGE_ROLES')) {
                return await message.reply(
                    "Only staff members can send an invite to another user's DM"
                );
            }

            const id = mention
                .replace('<@', '')
                .replace('!', '')
                .replace('>', '');
            if (!isNaN(id) && id.length == 18) {
                member = await message.guild.members.fetch(id);
            }
        }

        try {
            await member.send('https://discord.gg/S2azCgw');
            await message.channel.send(
                `${member} Check your DM's for the invite link!`
            );
        } catch (ex) {
            console.log(ex);
            await message.channel.send('I cannot DM this user');
        }
    },
};
