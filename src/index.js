const { Client, Events, GatewayIntentBits } = require('discord.js');
const token = 'MTE2MzYwMDIwODg5NTE1MjI0OQ.GLcluh.-zICHlylYKykjGGV4AniNxJsUbel_WmTLQxkjA';

const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ] });

client.once(Events.ClientReady, client => {
    console.log(`Bot online! ${client.user.tag}`);

    const data = {
        name: 'ping',
        description: 'pong...',
    };

    client.guilds.cache.get(1163619698064240712)?.commands.create(data)
        .then(command => console.log(command.name))
        .catch(console.error);
});

client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === 'hi') {
        message.channel.send('Hi, ${message.author.username}');
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.login(token);