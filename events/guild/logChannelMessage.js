const undergrad = require('../../commands/roles/undergrad');

const punishments = ['WARN', 'MUTE', 'UNMUTE'];
const inviteLinkMsg = 'Posted an invite';

module.exports = async (client, message) => {
    const logEmbed = message.embeds[0];
    if (logEmbed.author == undefined || logEmbed == null || !logEmbed.author)
        return;

    const punishment = logEmbed.author.name
        .split(' ')[0]
        .replace('[', '')
        .replace(']', '');

    if (!punishments.includes(punishment)) return;

    const memberId = logEmbed.fields[0].value
        .replace('<@', '')
        .replace('>', '');
    const member = await message.guild.members.fetch(memberId);

    let response = null;
    if (punishment === 'WARN') {
        const reason = logEmbed.fields[2].value;

        if (reason.includes(inviteLinkMsg)) return inviteLink(member);

        response = buildResponse(
            member,
            punishment,
            'You have received a warning.',
            [{ name: 'Reason', value: reason }],
            0xffa500
        );
    } else if (punishment === 'MUTE') {
        response = buildResponse(
            member,
            punishment,
            'You have been muted.',
            [
                { name: 'Reason', value: logEmbed.fields[2].value },
                {
                    name: 'Duration',
                    value: logEmbed.fields[3].value || 'null',
                },
            ],
            0xff0000
        );
    } else if (punishment === 'UNMUTE') {
        response = buildResponse(
            member,
            punishment,
            'You have been unmuted!',
            [],
            0x008000
        );
    }

    if (response !== null) {
        return member.send('', { embed: response });
    }
};

const inviteLink = async (member) => {
    const logChannel = member.guild.channels.cache.get(
        member.client.logChannelId
    );

    const embed = {
        color: 0xffa500,
        author: {
            name: `${member.user.username}#${member.user.discriminator}`,
            icon_url: member.user.displayAvatarURL(),
        },
        description:
            `<@${member.id}> has posted an invite link.\n\n` +
            `Can I ban this bitch?\n`,
        timestamp: new Date(),
        footer: {
            text: 'I will auto ban if no response in 10 min',
        },
    };

    const embedMessage = await logChannel.send('<@&737374602719920191>', {
        embed,
    });

    const emojis = ['🚫', '740468921961938974'];

    emojis.forEach(async (emoji) => await embedMessage.react(emoji));

    const filter = (reaction, user) =>
        (emojis.includes(reaction.emoji.name) ||
            emojis.includes(reaction.emoji.id)) &&
        !user.bot;

    embedMessage
        .awaitReactions(filter, { max: 1, time: 600000, errors: ['time'] })
        .then(async (collected) => {
            const reaction = collected.first();
            if (reaction.emoji.name === '🚫') {
                return embedMessage.edit('<@&737374602719920191>', {
                    embed: {
                        color: 0xb14cf3,
                        author: {
                            name: `${member.user.username}#${member.user.discriminator}`,
                            icon_url: member.user.displayAvatarURL(),
                        },
                        description: `Auto ban has been denied by <@${
                            reaction.users.cache.filter((u) => !u.bot).first()
                                .id
                        }>`,
                        timestamp: new Date(),
                        footer: {
                            text: 'They told me no :(',
                        },
                    },
                });
            } else if (reaction.emoji.id === '740468921961938974') {
                await banUser(member);

                return embedMessage.edit('<@&737374602719920191>', {
                    embed: {
                        color: 0x00c766,
                        author: {
                            name: `${member.user.username}#${member.user.discriminator}`,
                            icon_url: member.user.displayAvatarURL(),
                        },
                        description: `<@${member.id}> has been banned by <@${
                            reaction.users.cache.filter((u) => !u.bot).first()
                                .id
                        }>`,
                        timestamp: new Date(),
                        footer: {
                            text: 'Bye Bitch',
                        },
                    },
                });
            }
        })
        .catch(async () => {
            await banUser(member);

            embedMessage.edit('<@&737374602719920191>', {
                embed: {
                    color: 0x2caefe,
                    author: {
                        name: `${member.user.username}#${member.user.discriminator}`,
                        icon_url: member.user.displayAvatarURL(),
                    },
                    description: `<@${member.id}> has been auto banned due to lack of response`,
                    timestamp: new Date(),
                    footer: {
                        text: 'Bye Bitch',
                    },
                },
            });
        });
};

const banUser = async (member) => {
    await member.send('', {
        embed: {
            color: 0xff0000,
            author: {
                name: `${member.user.username}#${member.user.discriminator}`,
                icon_url: member.user.displayAvatarURL(),
            },
            description: `You have been permanently banned for posting an invite link`,
            timestamp: new Date(),
            footer: {
                text: member.guild.name,
            },
        },
    });

    return member.ban({ reason: inviteLinkMsg });
};

const buildResponse = (member, punishment, description, fields, color) => {
    return {
        color,
        author: {
            name: `[${punishment}] ${member.user.username}#${member.user.discriminator}.`,
            icon_url: member.user.displayAvatarURL(),
        },
        description,
        fields,
        timestamp: new Date(),
        footer: {
            text: member.guild.name,
        },
    };
};
