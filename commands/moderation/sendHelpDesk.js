module.exports = {
    name: 'sendHelpDesk',
    description: 'Re sends the help desk msg',
    moderatorOnly: true,
    category: 'moderation',
    guildOnly: true,
    async execute(message, args) {
        const guild = message.guild;
        const channel = message.channel;
        const client = message.client;

        if (channel.id != client.ids.opt.channels.helpDesk)
            return await message.channel.send(
                `This command can only be executed in <#${client.ids.opt.channels.helpDesk}>`
            );

        await channel.bulkDelete(99, true);

        await channel.send('@everyone', {
            embed: {
                color: 0x4e5181,
                title: `**Welcome to ${guild.name}!**`,
                description:
                    'I see you guys are not verified yet!\n\n' +
                    `Please go check out <#${client.ids.opt.channels.rules}> and react with :white_check_mark: to get access to the server!\n\n` +
                    `If you have any issues please tag <@&${client.ids.opt.roles.staff}>\n\n` +
                    `Once you Verify you should check out <#${client.ids.opt.channels.roleSelection}>!`,
                image: {
                    url: 'https://cdn.discordapp.com/attachments/731959466102226965/776323932890071061/banner_welcome1.png',
                },
            },
        });
    },
};
