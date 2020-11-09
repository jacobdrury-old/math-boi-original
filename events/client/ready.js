const CronJob = require('cron').CronJob;
const { getModLogChannel } = require('../../modules/utils.js');
module.exports = async (client) => {
    await client.user.setPresence({
        status: 'online',
        activity: {
            name: 'DM for Staff help!',
            type: 'PLAYING',
        },
    });

    console.log('Ready!');

    //Auto send verify message everyday at noon and midnight
    try {
        const job = new CronJob('0 6,18 * * *', async () => {
            const channel = client.guilds.cache
                .get(client.guildId)
                .channels.cache.get(client.ids.channels.help);

            await channel.bulkDelete(99, true);
            await channel.send(
                'Hey @everyone! I see you guys are not verified yet!\n\n' +
                    `Please go check out <#${client.ids.channels.rules}> and react with :white_check_mark: to get access to the server!\n\n` +
                    `If you have any issues please tag <@&${client.ids.roles.staff}>\n\n` +
                    `Once you Verify you should check out <#${client.ids.channels.roleSelection}>!`
            );
        });
        job.start();
    } catch (err) {
        const webhookClient = await getModLogChannel();
        if (webhookClient) {
            await webhookClient.send(`${err}`);
        }
        console.error(err);
    }
};
