const Webhook = require('../db/models/webhooks.js');
const Role = require('../db/models/roles.js');
const ReactionMessage = require('../db/models/reactionMessages.js');
exports.getLogChannel = async (client) => {
    client.mongoose.init();
    const logChannel = await Webhook.findOne({ name: 'logChannel' });

    return logChannel || null;
};

exports.getRoles = async (client) => {
    client.mongoose.init();
    const roles = await Role.find();

    const arrayToObject = (array) =>
        array.reduce((obj, item) => {
            obj[item.name] = item;
            return obj;
        }, {});

    return arrayToObject(roles);
};

exports.getReactionMessage = async (client, id) => {
    client.mongoose.init();
    return (await ReactionMessage.findOne({ messageId: id })) || null;
};
