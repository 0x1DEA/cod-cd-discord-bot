require('dotenv').config();
const Bot = require("./Bot.js");
const {reload} = require("./utilities/util.js");
const {Events} = require("discord.js");

reload().then(async () => {
    Bot.client.once(Events.ClientReady, async (client) => console.log(`Bot online! ${client.user.tag}`));

    process.on('SIGINT', () => {
        // TODO: save bot data.

        Bot.http.close(() => {
            console.log('Webserver stopped.');
            process.exit();
        })
    });

    await Bot.client.login(process.env.TOKEN);
});