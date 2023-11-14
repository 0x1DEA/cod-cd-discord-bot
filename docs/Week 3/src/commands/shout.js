const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName('shout').setDescription('Say it louder'),
    run: async (interaction) => {
        await interaction.reply(interaction.user.tag.toUpperCase());
    },
}