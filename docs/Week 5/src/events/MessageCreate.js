const {Events} = require("discord.js");
const Bot = require("../Bot.js");

module.exports = {
    event: Events.MessageCreate,
    run: async (message) => {
        // "someone" includes yourself (the bot) so make sure we don't go into an infinite loop
        if (message.author.bot) return;

        // If we don't have a record for the user, make one.
        if (!Bot.data.xp.hasOwnProperty(message.author.id)) {
            Bot.data.xp[message.author.id] = {
                username: message.author.username,
                xp: 0,
            };
        }

        // Default xp rate
        let increment = 1;

        // Newer users gain levels faster but plateau over time
        if (Bot.data.xp[message.author.id].xp < 100) increment = 20;
        else if (Bot.data.xp[message.author.id].xp < 200) increment = 5;
        else if (Bot.data.xp[message.author.id].xp < 300) increment = 3;
        else if (Bot.data.xp[message.author.id].xp < 400) increment = 2;

        // Add their XP
        Bot.data.xp[message.author.id].xp += increment;

        let progress = Bot.data.xp[message.author.id].xp % 100;
        let level = Bot.data.xp[message.author.id].xp - progress / 100;

        // If the user hits the level-up threshold (every 100 xp), congratulate them!
        if (Bot.data.xp[message.author.id] % 100 === 0) {
            message.channel.send(`Congratulations <@${message.author.id}>, you've reached Level ${level}`);
        }
    },
}