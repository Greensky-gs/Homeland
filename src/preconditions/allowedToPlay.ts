import { Precondition } from "amethystjs";
import { configurations } from "../cache/configurations";

export default new Precondition('allowedToPlay').setMessageRun(({ message, client }) => {
    if (!message.inGuild()) return {
        ok: true,
        channelMessage: message,
        type: 'message'
    }
    const configs = configurations.getGuildConfig(message.guildId)

    if (configs.only_channels.length > 0 && !configs.only_channels.includes(message.channelId)) return {
        ok: false,
        channelMessage: message,
        type: 'message',
        metadata: {
            silent: true
        }
    }
    if (configs.denied_channels.includes(message.channelId)) return {
        ok: false,
        channelMessage: message,
        type: 'message',
        metadata: {
            silent: true
        }
    }
    if (configs.only_roles.length > 0 && !message.member?.roles.cache.some((x) => configs.only_roles.includes(x.id))) return {
        ok: false,
        channelMessage: message,
        type: 'message',
        metadata: {
            silent: true
        }
    }
    if (configs.deny_roles.length > 0 && message.member?.roles.cache.some((x) => configs.deny_roles.includes(x.id))) return {
        ok: false,
        channelMessage: message,
        type: 'message',
        metadata: {
            silent: true
        }
    }

    return {
        ok: true,
        channelMessage: message,
        type: 'message'
    }
})