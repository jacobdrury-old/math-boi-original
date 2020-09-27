// const { WebhookClient } = require('discord.js');
// const { logEmbed } = require('../../modules/embeds.js');
// const { getLogChannel } = require('../../modules/utils.js');
module.exports = async (client, member) => {
    try {
        const guild = member.guild;
        await member.send('', {
            embed: {
                color: 0x42648a,
                title: `**Welcome to ${guild.name}!**`,
                thumbnail: {
                    url: guild.iconURL({ dynamic: true }),
                },
                description:
                    `**In order to get help you must first:**\n` +
                    `- Go and read the rules and react with a :white_check_mark:\n\n` +
                    `- Go to the role selection channel and add the subjects you need help with!\n\n` +
                    `- Post your question in the corresponding channel and tag \`@Tutor\``,
            },
        });
    } catch (err) {}

    // const nickname = member.displayName;
    // const regex = /^[a-zA-Z0-9?{}\.[\]_\-!@#$\^&*|']*$/;
    // if (!nickname.replace(' ', '').match(regex)) {
    //     await member.setNickname('Moderated Nickname', 'Invalid username');
    //     const logChannel = await getLogChannel(member.client);
    //     if (logChannel) {
    //         const webhookClient = new WebhookClient(
    //             logChannel.Id,
    //             logChannel.token
    //         );
    //         const embed = logEmbed(member, 'Invalid Username')
    //             .setDescription(`${member}'s nickname has been auto moderated`)
    //             .addField('Invalid Name', nickname);
    //         await webhookClient.send({ embeds: [embed] });
    //     }
    // }
};
