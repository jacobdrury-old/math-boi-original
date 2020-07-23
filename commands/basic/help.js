const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '<command name>',
    cooldown: 5,
    category: 'basic',
    async execute(message, args) {
        const helpEmbed = new MessageEmbed().setColor('#0099ff');
        const { commands } = message.client;

        const guildMember = await (message.channel.type !== 'text'
            ? message.client.guilds.cache
                  .get(message.client.guildId)
                  .members.fetch(message.author.id)
            : message.member);

        const isUserAdmin = guildMember.hasPermission('ADMINISTRATOR');
        const isUserModerator = guildMember.roles.cache.get(
            '725171176774828054'
        );

        const useableCommands = isUserAdmin
            ? commands
            : commands.filter(
                  (cmd) =>
                      cmd.adminOnly == null ||
                      (cmd.moderatorOnly == true && isUserModerator)
              );

        if (!args.length) {
            return getAll(message, helpEmbed, useableCommands);
        }

        return getCMD(message, args, helpEmbed, useableCommands);
    },
};

function getAll(message, helpEmbed, useableCommands) {
    const categories = readdirSync('./commands/');

    const commands = (category) => {
        return useableCommands
            .filter((cmd) => cmd.category === category)
            .map((cmd) => `\`${cmd.name}\``)
            .join(' ');
    };

    categories.forEach((cat) => {
        const cmds = commands(cat);
        if (cmds.length)
            helpEmbed.addField(`${cat[0].toUpperCase() + cat.slice(1)}`, cmds);
    });

    helpEmbed
        .setTitle("Here's a list of all my commands!")
        .setFooter(
            `You can send \`${message.client.prefix}help [command name]\` to get info on a specific command!`
        );

    return message.reply({ embed: helpEmbed });
}

function getCMD(message, args, helpEmbed, useableCommands) {
    const name = args[0];
    const command =
        useableCommands.get(name) ||
        useableCommands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
        return message.reply("That's not a valid command!");
    }

    helpEmbed
        .setTitle('Command Info')
        .addField(
            '**Command Name:**',
            command.name,
            !(command.aliases == null)
        );

    if (command.aliases)
        helpEmbed.addField('**Aliases:**', command.aliases.join(', '), true);
    if (command.description)
        helpEmbed.addField('**Description:**', command.description);
    if (command.usage)
        helpEmbed.addField(
            '**Usage:**',
            `${message.client.prefix}${command.name} ${command.usage}`
        );

    helpEmbed.addField('**Cooldown:**', `${command.cooldown || 3} second(s)`);

    message.channel.send(helpEmbed);
}
