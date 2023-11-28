const {Events} = require("discord.js");
const Bot = require("../Bot.js");

module.exports = {
    event: Events.InteractionCreate,
    run: async (interaction) => {
        // If the Interaction isn't a command, ignore it
        if (!interaction.isChatInputCommand()) return;
        // Get command from dictionary and invoke run() function and pass the interaction object
        await Bot.commands[interaction.commandName].run(interaction);
    }
}