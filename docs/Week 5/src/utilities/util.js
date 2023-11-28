const fs = require("node:fs");
const path = require("node:path");
const {REST, Routes} = require("discord.js");
const express = require("express");
const auth = require("express-basic-auth");
const Bot = require("../Bot.js");

module.exports = {
    reload: async () => {
        // Empty our command list, otherwise if a command gets deleted we won't know
        Bot.commands = {}
        // Get list of files in the 'commands' directory, and select only those that are .js files
        const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(path.join(__dirname, '../commands'), file);
            // CommonJS require will cache results, we gotta burn that cache to make sure it reloads for sure
            delete require.cache[require.resolve(filePath)];
            // Load the command
            const command = require(filePath);
            // And put it in our store
            Bot.commands[command.data.name] = command
        }

        /**
         * Registering Slash Commands with Discord
         * We need to tell Discord which commands we have so it auto-completes in the app
         */

        // First we make a list to store just command data
        const commandData = [];
        // Then we loop through our command list and extract only the data
        for (const name in Bot.commands) {
            commandData.push(Bot.commands[name].data)
        }
        // Next we set up an HTTP rest request and assign our token
        const rest = new REST().setToken(process.env.TOKEN);
        // Now we send it to the endpoint with our command info to register them with Discord
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commandData });

        /**
         * Register Event Listeners
         */

        // Do the same stuff as commands
        Bot.events = {}
        const eventFiles = fs.readdirSync(path.join(__dirname, '../events')).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(path.join(__dirname, '../events'), file);
            delete require.cache[require.resolve(filePath)];
            const event = require(filePath);
            Bot.client.on(event.event, event.run);
        }

        /**
         * Run Web Server
         */

        if (Bot.http) {
            console.log('Stopping webserver...')
            Bot.http.close();
        }

        Bot.express = express();

        // Register webserver plugins
        Bot.express.use(express.urlencoded({extended: true}));
        Bot.express.use(auth({
            // Register login data from .env file
            users: { [process.env.PANEL_USERNAME]: process.env.PANEL_PASSWORD },
            unauthorizedResponse: 'You are unauthorized to view this page.',
            challenge: true,
        }))

        Bot.express.get('/', (req, res) => res.sendFile('index.html', {root: path.join(__dirname, '../')}))
        Bot.express.get('/data', (req, res) => res.send(Bot.data.xp))

        // Start the webserver
        Bot.http = Bot.express.listen(process.env.HTTP_PORT, () => {
            console.log(`Webserver started at http://127.0.0.1:${process.env.HTTP_PORT}`)
        })
    }
}