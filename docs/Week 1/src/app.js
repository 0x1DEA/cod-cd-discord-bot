// Import API functions we need from discord.js
const {Client, Events, GatewayIntentBits} = require('discord.js');

// Get your Discord bot token so we can log in
const token = 'INSERT_TOKEN_HERE';

// Basic boilerplate for setting up a Discord bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// Register an event listener for ClientReady
client.once(Events.ClientReady, client => {
    // Our bot is ready!
    console.log(`Bot online! ${client.user.tag}`);
});

// Register an event listener for MessageCreate, aka. anytime someone sends a message
client.on(Events.MessageCreate, (message) => {
    // "someone" includes yourself (the bot) so make sure we don't go into an infinite loop
    if (message.author.bot) return;

    // Check if the message is "hi"
    if (message.content.toLowerCase() === 'hi') {
        // If it is, send a nice reply :)
        message.channel.send(`Hi, ${message.author.username}`);
    }
});

// Now that we registered all those functions, we can log in.
client.login(token).then(() => console.log('Logged in'));