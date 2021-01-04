const { getJoinLeaveLogChannel } = require('../../modules/utils');

module.exports = async (client, member) => {
    if (!client.enableLogs) return;
    const webhookClient = await getJoinLeaveLogChannel();
    if (!webhookClient) return;

    await webhookClient.send(
        `:inbox_tray: ${member.user.username}#${
            member.user.discriminator
        } (${member}) has joined the server! Account created: ${timeDifference(
            Date.now(),
            member.user.createdAt
        )}`
    );

    // await webhookClient.send({
    //     embeds: [
    //         {
    //             color: 0x00f763,
    //             author: {
    //                 name: `${member.user.username}#${member.user.discriminator}`,
    //                 icon_url: member.user.displayAvatarURL({
    //                     dynamic: true,
    //                 }),
    //             },
    //             thumbnail: {
    //                 url: member.user.displayAvatarURL({
    //                     dynamic: true,
    //                 }),
    //             },
    //             description: `**:inbox_tray: ${member} joined the server**`,
    //             timestamp: new Date(),
    //             footer: {
    //                 text: `User ID: ${member.id}`,
    //             },
    //             fields: [
    //                 {
    //                     name: '**Account Creation**',
    //                     value: timeDifference(
    //                         Date.now(),
    //                         member.user.createdAt
    //                     ),
    //                     inline: false,
    //                 },
    //             ],
    //         },
    //     ],
    // });
};

const timeDifference = (current, previous) => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return `${Math.round(elapsed / 1000)} seconds ago`;
    } else if (elapsed < msPerHour) {
        return `${Math.round(elapsed / msPerMinute)} minutes ago`;
    } else if (elapsed < msPerDay) {
        return `${Math.round(elapsed / msPerHour)} hours ago`;
    } else if (elapsed < msPerMonth) {
        return `${Math.round(elapsed / msPerDay)} days ago`;
    } else if (elapsed < msPerYear) {
        return `${Math.round(elapsed / msPerMonth)} months ago`;
    } else {
        return `${Math.round(elapsed / msPerYear)} years ago`;
    }
};
