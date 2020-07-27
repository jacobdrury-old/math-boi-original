const { Collection } = require('discord.js');
const mee6 = require('../../modules/mee6.js');
const gifs = require('../../modules/gifs.js');
const cooldowns = new Collection();

module.exports = async (client, message) => {
    const prefix = client.prefix;
    if (message.channel.id === '725171177235939382') {
        return await mee6.readLogs(client, message);
    }

    if (message.author.bot) return;

    const member = await (message.channel.type !== 'text'
        ? message.client.guilds.cache
              .get(client.guildId)
              .members.fetch(message.author.id)
        : message.member);

    const isAdmin = member.hasPermission('ADMINISTRATOR');
    const isModerator = member.roles.cache.get('725171176774828054');

    if (message.content.toLowerCase().includes('invite link')) {
        return message.channel.send('https://discord.gg/S2azCgw');
    }

    if (
        message.content.toLowerCase().startsWith('!') &&
        (isAdmin || isModerator)
    ) {
        return gifs.handle(message);
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

    if (command.adminOnly && !isAdmin) {
        await message.channel.send(
            'https://tenor.com/view/stop-stopit-mj-jordan-nope-gif-5098905'
        );

        const dmChannel = await message.author.createDM();
        return dmChannel.send(`${prefix}${command.name} is for admins only`);
    }

    if (command.moderatorOnly && !isModerator && !isAdmin) {
        await message.channel.send(
            'https://tenor.com/view/stop-stopit-mj-jordan-nope-gif-5098905'
        );

        const dmChannel = await message.author.createDM();
        return dmChannel.send(
            `${prefix}${command.name} is for moderators only`
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
    const cooldownAmount = (command.cooldown || 0) * 1000;

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
