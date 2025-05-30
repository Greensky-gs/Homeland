import { AmethystClient } from "amethystjs";
import { Partials } from "discord.js";
import { prefix } from './data/hard/configs.json'
require('dotenv').config()

const client = new AmethystClient({
    partials: [Partials.Message, Partials.Channel],
    intents: ['Guilds', 'MessageContent', 'GuildMessageReactions', "DirectMessages"]
}, {
    token: process.env.token,
    prefix,
    strictPrefix: false,
    botName: 'homeland',
    botNameWorksAsPrefix: true,
    customPrefixAndDefaultAvailable: true,
    mentionWorksAsPrefix: true,
    buttonsFolder: './dist/buttons',
    commandsFolder: './dist/commands',
    eventsFolder: './dist/events',
    preconditionsFolder: './dist/preconditions',
    modalHandlersFolder: './dist/modals',
    autocompleteListenersFolder: './dist/autocompletes',
    eventsArchitecture: 'simple',
    commandsArchitecture: 'double',
    debug: true,
    debuggerColors: 'icon'
})

client.start({})