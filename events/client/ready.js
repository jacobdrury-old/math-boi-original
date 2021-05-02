const CronJob = require('cron').CronJob;
const { getModLogChannel } = require('../../modules/utils.js');
const { setToRole } = require('../../modules/UserHelpers.js');
const clearTutorStats = require('../../commands/admin/clearTutorStats').execute;
const topTutor = require('../../commands/basic/topTutor').execute;

module.exports = async (client) => {
    await client.user.setPresence({
        status: 'online',
        activity: {
            name: 'DM to contact Staff!',
            type: 'PLAYING',
        },
    });

    client.emit('info', 'Ready!');

    try {
        //Auto send verify message everyday at noon and midnight
        const autoHelpDesk = new CronJob('0 5,17 * * *', async () => {
            const guild = client.guilds.cache.get(client.guildId);
            const channel = guild.channels.cache.get(client.ids.channels.help);

            await channel.bulkDelete(99, true);

            await channel.send('@everyone', {
                embed: {
                    color: 0x4e5181,
                    title: `**Welcome to ${guild.name}!**`,
                    description:
                        'I see you guys are not verified yet!\n\n' +
                        `Please go check out <#${client.ids.channels.rules}> and react with :white_check_mark: to get access to the server!\n\n` +
                        `If you have any issues please tag <@&${client.ids.roles.staff}>\n\n` +
                        `Once you Verify you should check out <#${client.ids.channels.roleSelection}>!`,
                    image: {
                        url:
                            'https://cdn.discordapp.com/attachments/731959466102226965/776323932890071061/banner_welcome1.png',
                    },
                },
            });
        });
        autoHelpDesk.start();

        //Auto clear tutor stats on the 1st of every month
        const autoClearTutorStats = new CronJob('0 0 1 * *', async () => {
            await clearTutorStats(null, client);
        });

        autoClearTutorStats.start();

        const autoTopTutor = new CronJob('0 11 * * *', async () => {
            const guild = client.guilds.cache.get(client.guildId);
            const announcementC = guild.channels.cache.get(
                client.ids.channels.staffCommands
            );

            const topTutorRole = client.ids.roles.tutor.top;

            const tutor = (await topTutor(null, announcementC))[0];

            const previousTopTutors = guild.roles.cache.get(topTutorRole)
                .members;

            for (const [id, member] of previousTopTutors) {
                await removeRole(member, topTutorRole);
            }

            const member = await guild.members.fetch(tutor.discordID);

            await setToRole(member, client.ids.roles.tutor.top);
        });

        autoTopTutor.start();
    } catch (err) {
        const webhookClient = await getModLogChannel();
        if (webhookClient) {
            await webhookClient.send(`${err.message}`);
        }
        console.error(err);
    }
};
