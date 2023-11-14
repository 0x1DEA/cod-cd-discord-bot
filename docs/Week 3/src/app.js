/**
 * COD CS Discord Bot Project
 * Week 3
 *
 * Topics: Registering slash commands
 *
 * Exercises for the reader:
 * - Add your own commands
 * - Add error checking to help you debug
 */

// Import API functions we need from discord.js
const {Client, Events, GatewayIntentBits, REST, Routes} = require('discord.js');
const path = require("path");
const fs = require("fs");

// Get your Discord bot token so we can log in
const token = 'TOKEN_HERE';

// Basic boilerplate for setting up a Discord bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

let commands = {};

// This command loads all JS files in a directory and saves them where we can easily edit them
function loadCommands() {
    // Flush commands in case a file gets deleted
    commands = {};
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(path.join(__dirname, 'commands'), file);
        const command = require(filePath);
        commands[command.data.name] = command
    }
}

// Register an event listener for InteractionCreate, which includes slash command invocations
client.on(Events.InteractionCreate, async interaction => {
    // If the Interaction isn't a command, ignore it
    if (!interaction.isChatInputCommand()) return;
    // Get command from dictionary and invoke run() function and pass the interaction object
    await commands[interaction.commandName].run(interaction);
    // Do other stuff if we want, like logging statistics
});

// Register an event listener for ClientReady
client.once(Events.ClientReady, async client => {
    loadCommands();
    // We need to register our commands with Discord so it auto-completes in the app
    // You only need to run this code when commands change
    // First we make a list to store just command data
    const commandData = [];
    // Then we loop through our command list and extract only the data
    for (const name in commands) {
        commandData.push(commands[name].data)
    }
    // Next we set up an HTTP rest request and assign our token
    const rest = new REST().setToken(token);
    // Now we send it to the endpoint with our command info to register them with Discord
    let res = await rest.put(Routes.applicationCommands('APP_ID_HERE'), { body: commandData });

    // Bot is ready
    console.log(`Bot online! ${client.user.tag}`)
});

// Now that we registered all those functions, we can log in
client.login(token).then(() => console.log('Logged in'));