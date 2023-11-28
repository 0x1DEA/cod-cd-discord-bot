const {SlashCommandBuilder} = require("discord.js");
const {reload} = require("../utilities/util.js");
const Bot = require("../Bot.js");

module.exports = {
    data: new SlashCommandBuilder().setName('reload').setDescription('Reload command files'),
    run: async (interaction) => {
        if (interaction.user.id !== process.env.ADMIN_USER_ID) {
            await interaction.reply("You don't have permission to perform this action!");
            return;
        }

        console.log('Requested Reload.');
        await reload();
        console.log('Reload complete.');

        await interaction.reply(`Done reloading app! ${Object.keys(Bot.commands).length} commands loaded.`);
    },
}