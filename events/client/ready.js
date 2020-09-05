const CronJob = require('cron').CronJob;
const { getLogChannel } = require('../../modules/utils.js');
const helpId = '737118741510357063';
module.exports = (client) => {
    // client.user.setPresence({
    //     status: 'online',
    //     activity: {
    //         name: 'me getting developed',
    //         type: 'WATCHING',
    //     },
    // });

    console.log('Ready!');

    //Auto send verify message everyday at noon
    try {
        const job = new CronJob('0 12 * * *', async () => {
            const channel = client.guilds.cache
                .get(client.guildId)
                .first()
                .channels.cache.get(helpId);

            await channel.bulkDelete(20, true);
            await channel.send(
                'Hey! @everyone I see you guys are not verified yet, please go check out #📜rules Then all you have to do it react the the :white_check_mark: to have access to the server! If you have any issues please tag @Staff 🧙‍♂️ . :slight_smile: Once you Verify you should check out #💎role-selection Thank you!'
            );
        });
        job.start();
    } catch (err) {
        const logChannel = await getLogChannel(client);
        if (logChannel) {
            const webhookClient = new WebhookClient(
                logChannel.Id,
                logChannel.token
            );
            await webhookClient.send(`${err}`);
        }
        console.error(err)
    }
};
