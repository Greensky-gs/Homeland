import { AmethystClient } from "amethystjs";
import { Partials } from "discord.js";
require('dotenv').config()

const client = new AmethystClient({
    partials: [Partials.Message, Partials.Channel],
    intents: ['Guilds', 'MessageContent', 'GuildMessageReactions', "DirectMessages"]
}, {
    token: process.env.token,
})