const {Client, GatewayIntentBits, Events} = require("discord.js");

module.exports = class Bot {
    static commands = {};
    static events = {};

    static server = null;
    static http = null;
    static client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ]
    });

    static data = {
        xp: {}
    };
}