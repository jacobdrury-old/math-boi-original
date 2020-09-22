const addRoleToDb = require('../../modules/RoleHelpers.js').addRoleToDb;
const roleName = 'teacher';
module.exports = {
    name: roleName,
    description: `Sets the ${roleName} role for the server`,
    args: true,
    usage: `<tag the ${roleName} role>`,
    guildOnly: true,
    ownerOnly: true,
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
