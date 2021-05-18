module.exports = {
    name: 'clearArchive',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const client = message.client;

        const guild = client.guilds.cache.get(client.guildId);

        const archiveChannels = guild.channels.cache.filter(
            (c) =>
                c.parentID == client.ids.StaffServer.categories.archivedModMail
        );

        for (let [id, channel] of archiveChannels) {
            await channel.delete();
        }
    },
};
