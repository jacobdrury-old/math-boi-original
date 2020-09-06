const CronJob = require('cron').CronJob;
const { getLogChannel } = require('../../modules/utils.js');
const helpId = '737118741510357063';
module.exports = async (client) => {
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'DM for Staff help!',
            type: 'PLAYING',
        },
    });

    console.log('Ready!');

    //Auto send verify message everyday at noon
    try {
        const job = new CronJob('0 17 * * *', async () => {
            const channel = client.guilds.cache
                .get(client.guildId)
                .channels.cache.get(helpId);

            await channel.bulkDelete(99, true);
            await channel.send(
                'Hey! @everyone I see you guys are not verified yet, please go check out <#725171177235939379> Then all you have to do it react the the :white_check_mark: to have access to the server! If you have any issues please tag <@&737374602719920191> 🧙‍♂️ . :slight_smile: Once you Verify you should check out <#740316361032728615> Thank you!'
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
        console.error(err);
    }
};
