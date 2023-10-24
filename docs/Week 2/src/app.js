/**
 * COD CS Discord Bot Project
 * Week 2
 *
 * Topics: Registering slash commands
 *
 * Exercises for the reader:
 * - Add your own commands
 * - Add error checking to help you debug
 */

// Import API functions we need from discord.js
const {Client, Events, GatewayIntentBits, SlashCommandBuilder, REST, Routes} = require('discord.js');

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

// Here we will make our list of commands and the code that they run
// Later we can move commands into their own files and load them into a list automatically
const commands = {
    // Each command is an object. The key name must match the setName
    // We use the first to find our command and the second is what discord sends to us
    'ping': {
        // We use this SlashCommandBuilder api to create an object with all the info we need to send to Discord
        data: new SlashCommandBuilder().setName('ping').setDescription('Helpful description'),
        // This is the actual code that runs when we run the command
        run: async (interaction) => {
            // Using this function provided to us we can send a reply message
            await interaction.reply('Pong!');
        },
    }
};

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
    await rest.put(Routes.applicationCommands('INSERT_APPLICATION_ID'), { body: commandData });

    // Bot is ready
    console.log(`Bot online! ${client.user.tag}`)
});

// Now that we registered all those functions, we can log in
client.login(token).then(() => console.log('Logged in'));