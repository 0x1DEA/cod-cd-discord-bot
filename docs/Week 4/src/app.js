/**
 * COD CS Discord Bot Project
 * Week 4
 *
 * Topics:
 *
 * Exercises for the reader:
 * -
 */
// Load out environment variables
require('dotenv').config()

// Import API functions we need from discord.js
const {Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder} = require('discord.js');
const path = require("path");
const fs = require("fs");

// Basic boilerplate for setting up a Discord bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// This might be bad practice but for now let's shove all our data into this object.
// It will act as a central store, so we can pass it around
let data = {
    'commands': {},
    'functions': {
        'reload': async () => {
            /**
             * Loading commands from files
             */

            // Empty our command list, otherwise if a command gets deleted we won't know
            data.commands = {}
            // Get list of files in the 'commands' directory, and select only those that are .js files
            const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = path.join(path.join(__dirname, 'commands'), file);
                // CommonJS require will cache results, we gotta burn that cache to make sure it reloads for sure
                delete require.cache[require.resolve(filePath)];
                // Load the command
                const command = require(filePath);
                // And put it in our store
                data.commands[command.data.name] = command
            }

            /**
             * Registering Slash Commands with Discord
             * We need to tell Discord which commands we have so it auto-completes in the app
             */

            // First we make a list to store just command data
            const commandData = [];
            // Then we loop through our command list and extract only the data
            for (const name in data.commands) {
                commandData.push(data.commands[name].data)
            }
            // Next we set up an HTTP rest request and assign our token
            const rest = new REST().setToken(process.env.TOKEN);
            // Now we send it to the endpoint with our command info to register them with Discord
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commandData });
        }
    }
};

// Handle any errors so we don't crash and burn
client.on(Events.Error, (err) => {
    console.log(err.message)
});

// Register an event listener for InteractionCreate, which includes slash command invocations
client.on(Events.InteractionCreate, async interaction => {
    // If the Interaction isn't a command, ignore it
    if (!interaction.isChatInputCommand()) return;
    // Get command from dictionary and invoke run() function and pass the interaction object
    await data.commands[interaction.commandName].run(interaction, data);
    // Do other stuff if we want, like logging statistics
});

// Register an event listener for ClientReady
client.once(Events.ClientReady, async client => {
    // Load up and register our commands
    await data.functions.reload();

    // Bot is ready
    console.log(`Bot online! ${client.user.tag}`)
});

// Now that we registered all those functions, we can log in
client.login(process.env.TOKEN).then(() => console.log('Logged in'));