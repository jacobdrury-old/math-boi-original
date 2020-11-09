module.exports = {
    name: 'test',
    adminOnly: true,
    guildOnly: true,
    category: 'admin',
    async execute(message) {
        const client = message.client;
        await message.channel.send(
            'Hey! @ everyone I see you guys are not verified yet!\n\n' +
                `Please go check out <#${client.ids.channels.rules}> and react with :white_check_mark: to get access to the server!\n\n` +
                `If you have any issues please tag <@& ${client.ids.roles.staff}>\n\n` +
                `Once you Verify you should check out <#${client.ids.channels.roleSelection}>!`
        );
    },
};
