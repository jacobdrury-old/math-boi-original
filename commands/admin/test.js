module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const guildMembers = (await message.guild.members.fetch()).filter((m) => m.displayName.includes('Bitoxan'));

        for (var member in guildMembers) {
            await member.ban();
            console.log(`${member} banned`);
        }
    },
};
