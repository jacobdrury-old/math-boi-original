const { Client, Collection } = require('discord.js');
const { getLogChannel } = require('./modules/utils.js');
const mongoose = require('mongoose');

const client = new Client({
    partials: ['MESSAGE', 'REACTION'],
});

['commands', 'aliases'].forEach((x) => (client[x] = new Collection()));

['event', 'command'].forEach((handler) =>
    require(`./handlers/${handler}`)(client)
);

client.prefix = process.env.PREFIX;

client.roleIds = {
    moderatorId: '725171176774828054',
    traineeModId: '725442011758461049',
    headModId: '739922768954392586',
    middleSchoolRoleId: '742498991119269978',
    verifiedRoleId: '729871004368633936',
    lvl30: '730310199273062491',
};

client.channelIds = {
    announcementID: '725172917482291210',
    helpId: '737118741510357063',
    generalId: '729870525119332414',
    rulesId: '725171177235939379',
    roleSelectionId: '740316361032728615',
    joinLogs: '725171177235939384',
};

client.messageIds = {
    rulesId: '740454952442265621',
};

client.IGNORED = [
    '737457798123880509',
    '730264204174688288',
    '725171177235939378',
    '725178491494072381',
    '725172886821666898',
    '740086491069546537',
    '751999833597804624',
    '752000303787933706',
    '753087333506482277',
];

(async () => {
    client.db = await mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    client.guildId = process.env.GUILD_ID;

    const logChannel = await getLogChannel();
    if (logChannel) client.logChannelId = logChannel.channelId;
    return client.login(process.env.TOKEN);
})();
