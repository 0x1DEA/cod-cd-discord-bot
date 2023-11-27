const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName('reload').setDescription('Reload command files'),
    run: async (interaction, data) => {
        if (interaction.user.id !== process.env.ADMIN_USER_ID) return;
        data.functions.reload()
        await interaction.reply(`Done reloading commands! ${Object.keys(data.commands).length} commands loaded.`);
    },
}