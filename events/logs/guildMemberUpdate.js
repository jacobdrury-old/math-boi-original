const { MessageEmbed } = require('discord.js');
const { getUserLogChannel } = require('../../modules/utils');
const { setToRole, removeRole } = require('../../modules/UserHelpers');
const User = require('../../db/models/users');

module.exports = async (client, oldMember, newMember) => {
    if (!client.enableLogs) return;

    if (await boosterCheck(client, oldMember, newMember)) return;

    if (await tutorAddCheck(client, oldMember, newMember)) return;

    if (await verifiedCheck(client, oldMember, newMember)) return;

    let updated = false;

    const webhookClient = await getUserLogChannel();
    if (!webhookClient) return;

    const embed = new MessageEmbed({
        color: 0xffa500,
        author: {
            name: `${newMember.user.username}#${newMember.user.discriminator}`,
            icon_url: newMember.user.displayAvatarURL({
                dynamic: true,
            }),
        },
        thumbnail: {
            url: newMember.user.displayAvatarURL({
                dynamic: true,
            }),
        },
        description: `**${newMember} updated their profile!**`,
        timestamp: new Date(),
    });

    //Check nickname
    if (oldMember.nickname !== newMember.nickname) {
        embed.addField(
            'Nickname',
            `\`${oldMember.nickname}\` -> \`${newMember.nickname || 'None'}\``,
            false
        );
        updated = true;
    }

    if (updated) return await webhookClient.send({ embeds: [embed] });
};

const boosterCheck = async (client, oldMember, newMember) => {
    const hadRole = oldMember.roles.cache.get(client.ids.roles.booster);

    const hasRole = newMember.roles.cache.get(client.ids.roles.booster);

    if (!hadRole && hasRole) {
        await newMember.guild.channels.cache
            .get(client.ids.channels.announcement)
            .send(`Thank you for boosting the server ${newMember}!!`);

        return true;
    }

    return false;
};

const tutorAddCheck = async (client, oldMember, newMember) => {
    const tutorOptions = [
        client.ids.roles.tutor.id,
        ...client.ids.roles.tutor.options,
    ];

    const oldMemberRoles = oldMember.roles.cache.keyArray();

    const newMemberRoles = newMember.roles.cache.keyArray();

    const hadRole = tutorOptions.filter((opt) => oldMemberRoles.includes(opt));

    const hasRole = tutorOptions.filter((opt) => newMemberRoles.includes(opt));

    if (!hadRole.length && hasRole.length) {
        //Add Tutor role
        await setToRole(newMember, client.ids.roles.tutor.id, null, false);

        await User.findOneAndUpdate(
            {
                guildId: newMember.guild.id,
                discordID: newMember.id,
                isTutor: false,
                verified: true,
            },
            { isTutor: true }
        );

        return true;
    } else if (hadRole.length && hasRole.length <= 1) {
        //Remove Tutor role
        await removeRole(newMember, client.ids.roles.tutor.id, null, false);

        await User.findOneAndUpdate(
            {
                guildId: newMember.guild.id,
                discordID: newMember.id,
                isTutor: true,
                verified: true,
            },
            { isTutor: false }
        );

        return true;
    }

    return false;
};

const verifiedCheck = async (client, oldMember, newMember) => {
    const verifiedId = client.ids.roles.verified;

    const oldVerifiedRole = oldMember.roles.cache.get(verifiedId);

    const newVerifiedRole = newMember.roles.cache.get(verifiedId);

    if (!oldVerifiedRole && newVerifiedRole) {
        //User Verified
        await User.findOneAndUpdate(
            {
                guildId: newMember.guild.id,
                discordID: newMember.id,
                verified: false,
            },
            { verified: true }
        );
    } else if (oldVerifiedRole && !newVerifiedRole) {
        //User Unverified
        await User.findOneAndUpdate(
            {
                guildId: newMember.guild.id,
                discordID: newMember.id,
                verified: true,
            },
            { verified: false }
        );
    }
};
