const { WebhookClient } = require('discord.js');
const { logEmbed } = require('../../modules/embeds.js');
const { getLogChannel } = require('../../modules/utils.js');
module.exports = async (client, member) => {
    const nickname = member.displayName;
    const regex = /^[a-zA-Z0-9?{}[\]_!@#$\^&*|']*$/;

    if (!nickname.match(regex)) {
        await member.setNickname('Moderated Nickname', 'Invalid username');

        const logChannel = await getLogChannel(member.client);
        if (logChannel) {
            const webhookClient = new WebhookClient(
                logChannel.Id,
                logChannel.token
            );
            const embed = logEmbed(member, 'Invalid Username')
                .setDescription(`${member}'s nickname has been auto moderated`)
                .addField('Invalid Name', nickname);

            await webhookClient.send({ embeds: [embed] });
        }
    }
};
