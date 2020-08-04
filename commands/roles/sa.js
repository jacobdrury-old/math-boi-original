const addRoleToDb = require('../../modules/RoleHelpers.js').addRoleToDb;
const roleName = 'sa';
module.exports = {
    name: roleName,
    description: `Sets the ${roleName} role for the server`,
    args: true,
    usage: `<tag the ${roleName} role>`,
    guildOnly: true,
    adminOnly: true,
    category: 'roles',
    execute(message, args) {
        const rawId = args[0];
        const roleId = rawId.replace('<@&', '').replace('>', '');
        addRoleToDb(message.client, roleId, roleName, (err) => {
            if (err) {
                message.channel.send(
                    `Could not set the ${roleName} role to ${rawId}`
                );
            } else {
                message.channel.send(
                    `Successfully set the ${roleName} role to ${rawId}`
                );
            }
        });
    },
};
