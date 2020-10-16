const { newUserEmbed } = require('../../modules/embeds');

const { getUserLogChannel } = require('../../modules/utils');

module.exports = async (client, oldState, newState) => {
    const oldChannel = oldState.voiceChannel;
    const newChannel = newState.voiceChannel;

    if (oldChannel === undefined && newChannel !== undefined) return true;
    //User joins a vc
    else if (newChannel === undefined) return false; //User leaves a vc
};
