const fs = require('fs');

module.exports = (client) => {
    const load = (dirs) => {
        const commands = fs.readdirSync(`./commands/${dirs}/`).filter((d) => d.endsWith('.js'));
        for (const file of commands) {
            const pull = require(`../commands/${dirs}/${file}`);
            client.commands.set(pull.name, pull);
            if (pull.aliases) pull.aliases.forEach((a) => client.aliases.set(a, pull.name));
        }
    };
    fs.readdirSync('./commands/').forEach((x) => load(x));
};
