module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        // const verifiedRole = await message.guild.roles.fetch(
        //     message.client.ids.roles.verified
        // );
        // const guildMembers = await message.guild.members.fetch();
        // const unverifiedUsers = guildMembers.filter(
        //     (member) =>
        //         !member.roles.cache.get(message.client.ids.roles.verified) &&
        //         !member.user.bot
        // );
        // for await ([id, member] of unverifiedUsers) {
        //     await member.roles.set([]);
        // }
        // console.log('Done');
    },
};
