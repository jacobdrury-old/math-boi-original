const { Collection } = require('discord.js');
const cooldowns = new Collection();
const banGifs = [
    'https://tenor.com/view/ban-oprah-gif-10045949',
    'https://tenor.com/view/when-your-team-too-good-ban-salt-bae-gif-7580925',
    'https://tenor.com/view/ban-hammer-thor-mod-moderator-gif-13991887',
    'https://tenor.com/view/trump-donaldtrump-interview-banned-cnn-gif-7677105',
    'https://tenor.com/view/sao-liz-lisbeth-anime-ban-gif-14368031',
    'https://tenor.com/view/flipping-off-flip-off-teich-middle-finger-fuck-off-fuck-you-gif-15587868',
];

module.exports = async (client, message) => {
    const prefix = client.prefix;

    if (message.author.bot) return;

    if (message.content.toLowerCase().includes('invite link')) {
        return message.reply('https://discord.gg/S2azCgw');
    }

    if (message.content.toLowerCase().includes('!ban')) {
        return message.reply(
            banGifs[Math.floor(Math.random() * banGifs.length)]
        );
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift();

    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        );

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply("I can't execute that command inside DMs!");
    }

    const member = await (message.channel.type !== 'text'
        ? message.client.guilds.cache
              .get(client.guildId)
              .members.fetch(message.author.id)
        : message.member);

    const isAdmin = member.hasPermission('ADMINISTRATOR');

    if (command.adminOnly && !isAdmin) {
        return message.reply(
            'This is an admin only command\nhttps://tenor.com/view/stop-stopit-mj-jordan-nope-gif-5098905'
        );
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime =
            timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(
                `please wait ${timeLeft.toFixed(
                    1
                )} more second(s) before reusing the \`${
                    command.name
                }\` command.`
            );
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
};
