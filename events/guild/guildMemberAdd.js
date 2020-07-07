const { getRoles } = require('../../modules/utils.js');
const { WebhookClient } = require('discord.js');
const { logEmbed, newUserEmbed } = require('../../modules/embeds.js');
const { setToRole } = require('../../modules/UserHelpers.js');
const { getLogChannel } = require('../../modules/utils.js');
module.exports = async (client, member) => {
    // #region Add unverified role to new user
    const roles = await getRoles(client);

    if (!roles.unverified) {
        return await member.send('Could not find the unverified role. If this continues please contact an Admin');
    }

    setToRole(member, roles.unverified.Id, null, false);
    // #endregion

    await member.send({ embed: newUserEmbed(member) });

    const logChannel = await getLogChannel(member.client);
    if (logChannel) {
        const webhookClient = new WebhookClient(logChannel.Id, logChannel.token);
        const embed = logEmbed(member, 'User Joined').setColor('#00d166').addField('User', `<@!${member.id}>`, true);

        webhookClient.send({ embeds: [embed] });
    }
};
