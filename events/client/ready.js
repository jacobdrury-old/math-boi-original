const CronJob = require('cron').CronJob;
const { getModLogChannel } = require('../../modules/utils.js');
module.exports = async (client) => {
    // client.user.setPresence({
    //     status: 'online',
    //     activity: {
    //         name: 'DM for Staff help!',
    //         type: 'PLAYING',
    //     },
    // });

    console.log('Ready!');

    //Auto send verify message everyday at noon
    try {
        const job = new CronJob('0 5,17 * * *', async () => {
            const channel = client.guilds.cache
                .get(client.guildId)
                .channels.cache.get(client.ids.channels.help);

            await channel.bulkDelete(99, true);
            await channel.send(
                'Hey! @everyone I see you guys are not verified yet, please go check out <#725171177235939379> Then all you have to do it react with the :white_check_mark: to get access to the server! If you have any issues please tag <@&737374602719920191> 🧙‍♂️ . :slight_smile: Once you Verify you should check out <#740316361032728615> Thank you!'
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
