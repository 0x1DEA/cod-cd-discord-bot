const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Helpful description'),
    run: async (interaction) => {
        await interaction.reply('pong!');
    },
}