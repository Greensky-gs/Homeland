import { log4js } from "amethystjs"
import { EmojiIdentifierResolvable, Message, MessageCreateOptions, MessagePayload, MessageReplyOptions, User } from "discord.js"

export const removeNullElements = <T>(arr: T[]): T[] => arr.filter(x => !!x)

export const sendOrReply = async(message: Message<boolean>, content: string | MessagePayload | MessageCreateOptions | MessageReplyOptions) => {
    if (message.channel.isSendable()) {
        return message.channel.send(content)
    } else {
        return message.reply(content)
    }
}
export const sendOrReplyRemove = async(message: Message<boolean>, content: string | MessagePayload | MessageCreateOptions | MessageReplyOptions, ms: number) => {
    const msg = await sendOrReply(message, content).catch(log4js.trace)
    setTimeout(() => {
        if (msg && msg.deletable) {
            msg.delete().catch(log4js.trace)
        }
    }, ms)
    return msg
}
/**
 * Time in milliseconds
 */
export const waitForReaction = ({ message, user, emojis = ['✅', '❌'], removeEmojisOnEnd = false, whoCanReact = 'user', time = 120000 }: { message: Message<boolean>; time?: number; user: User; emojis?: EmojiIdentifierResolvable[]; whoCanReact?: 'user' | 'everyone' | 'notuser', removeEmojisOnEnd?: boolean  }): Promise<{ endType: 'collected' | 'timeout'; emoji: { name: string; index: number }; user: User; }> => new Promise(async(resolve) => {
    for (const emoji of emojis) {
        await message.react(emoji).catch(log4js.trace)
    }

    const collector = message.createReactionCollector({
        filter: (reaction, rUser) => reaction.emoji.name && emojis.includes(reaction.emoji.name) && (whoCanReact === 'everyone' || (whoCanReact === 'user' && user.id === rUser.id) || (whoCanReact === 'notuser' && user.id !== rUser.id)),
        max: 1,
        time
    })

    collector.on('collect', (reaction, user_c) => {
        if (removeEmojisOnEnd) {
            reaction.remove()
        }
        collector.stop('ended')

        resolve({
            user: user_c,
            endType: 'collected',
            emoji: {
                name: reaction.emoji.name,
                index: emojis.indexOf(reaction.emoji.name)
            }
        })
    })
    collector.on('end', (_, reason) => {
        if (removeEmojisOnEnd) {
            message.reactions.cache.filter(x => x.users.cache.has(message.client.user.id)).forEach(x => x.remove().catch(log4js.trace))
        }
        if (reason !== 'ended') resolve({
            endType: 'timeout',
            emoji: { name: '', index: -1 },
            user
        })
    })
})