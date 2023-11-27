const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName('rank').setDescription('Check your XP rank'),
    run: async (interaction, data) => {
        if (!data.xp.hasOwnProperty(interaction.user.id)) {
            data.xp[interaction.user.id] = 0;
        }

        let xp = data.xp[interaction.user.id];
        let progress = xp % 100;
        let level = xp - progress / 100;

        await interaction.reply(`Your rank: ${level}\n\nNext Level Progress: ${xp}/${level + 100}`);
    },
}