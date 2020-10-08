module.exports = {
    name: 'tempban',
    description: 'Temp Bans given user',
    moderatorOnly: true,
    usage: '<User> <Time in days> <Reason>',
    category: 'moderation',
    guildOnly: true,
    args: true,
    async execute(message, args) {
        const [, rawTime, ...reasonArray] = args;
        const reason = reasonArray.join(' ');
        const callingMember = message.member;
        const targetMember = message.mentions.members.first();

        const time = rawTime.replace(/[A-Za-z\s]/gi, '');

        if (!callingMember.hasPermission('BAN_MEMBERS'))
            return message.channel.send(
                `You don't have permission to use this command`
            );

        if (!message.guild.me.hasPermission('BAN_MEMBERS'))
            return message.channel.send(
                `I don't have permission to ban members`
            );

        if (!targetMember)
            return message.channel.send(`I cannot find that member`);

        if (
            targetMember.roles.highest.position >=
                callingMember.roles.highest.position &&
            callingMember.id !== message.guild.owner.id
        )
            return message.channel.send(
                `You do not have permission to ban this member`
            );

        if (callingMember.id === targetMember.id)
            return message.channel.send(`You cannot ban yourself`);

        if (!targetMember.kickable)
            return message.channel.send(`I cannot ban this user`);

        if (!time)
            return message.channel.send(
                `You must specify a time in days! (Ex: ${message.client.prefix}tempban @WhoNeedsKeyboard#1909 10 Goodbye)`
            );

        await message.channel.send('', {
            embed: {
                author: {
                    name: `${targetMember.user.username}#${targetMember.user.discriminator} has been ban`,
                    icon_url: targetMember.user.displayAvatarURL(),
                },
                description: `**Reason:** ${reason}`,
            },
        });

        message.client.emit(
            'tempban',
            message.url,
            targetMember,
            callingMember,
            time
        );

        //TODO: Implement DMing user when they get banned

        await targetMember.ban({ reason, time });
    },
};
