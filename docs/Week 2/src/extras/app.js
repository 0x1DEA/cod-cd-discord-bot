const {Client, Events, GatewayIntentBits, SlashCommandBuilder, Collection, REST, Routes} = require('discord.js');
const token = 'TOKEN_HERE';

/**
 * This file has some extra stuff.
 *
 * Not part of the main project but if you wanted to go above and beyond, it's worth looking at what's possible.
 * I'll add more notes here when I can
 */

const express = require('express')
const path = require("path");
const app = express()
const port = 3000

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const commands = {
    'ping': {
        data: new SlashCommandBuilder().setName('ping').setDescription('Helpful description'),
        command: async (interaction) => {
            if (interaction)

            await interaction.reply('Pong!');
        }
    }
};

client.commands = new Collection();

// Do this automatically?
client.commands.set('ping', commands['ping']);

client.on(Events.InteractionCreate, async interaction => {
    const command = client.commands.get(interaction.commandName);

    await command.command(interaction);
});

// Talk about async events
client.once(Events.ClientReady, async client => {
    const data = await rest.put(
        // remove guild ID to register global command
        Routes.applicationCommands('1163600208895152249'), { body: [client.commands.get('ping').data.toJSON()] },
    );

    console.log(`Bot online! ${client.user.tag}`);

    app.use(express.urlencoded({extended: true}));

    app.get('/', (req, res) => {
        res.sendFile('index.html', {root: path.join(__dirname)})
    })

    app.get('/data', (req, res) => {
        res.send(data.xp);
    })

    app.post('/message', (req, res) => {
        client.channels.fetch('1163619698693390338').then((c) => {
            if (c === null) return;

            c.send(req.body.message);
        })
        res.redirect('/');
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
});

const rest = new REST().setToken(token);
client.login(token).then(r => console.log('Logged in'));