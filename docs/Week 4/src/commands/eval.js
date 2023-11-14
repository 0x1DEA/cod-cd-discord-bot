const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName('eval')
        .setDescription('live dangerously')
        .addStringOption(option => {
            return option
                .setName('code')
                .setDescription('Do your worst')
        }),
    run: async (interaction, data) => {
        if (interaction.user.id !== process.env.ADMIN_USER_ID) return;
        const result = eval(interaction.options.getString('code'));
        await interaction.reply(result);
    },
}