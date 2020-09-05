const cron = require('cron');
const clean = require('../../commands/admin/clean.js').execute
const welcomeId = '737118741510357063';
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
    cron.schedule("0 12 * * *", () => {
        const channel = client.guilds.cache.get(client.guildId).first().channels.cache.get(welcomeId);
        await clean()
        await channel.send(
            'Hey! @everyone I see you guys are not verified yet, please go check out #📜rules Then all you have to do it react the the :white_check_mark: to have access to the server! If you have any issues please tag @Staff 🧙‍♂️ . :slight_smile: Once you Verify you should check out #💎role-selection Thank you!'
        );
    });
};
