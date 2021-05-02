module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const client = message.client;

        try {
            throw 'Error2';
        } catch (ex) {
            client.logger.error(ex);
        }
    },
};
