module.exports = {
    name: 'invite',
    description: 'Provides a crisp invite to the server',
    category: 'basic',
    async execute(message) {
        await message.author.send('https://discord.gg/S2azCgw');
        await message.reply("Check your DM's for the invite link!");
    },
};
