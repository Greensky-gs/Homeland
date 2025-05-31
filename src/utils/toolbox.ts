import { log4js } from "amethystjs"
import { BaseChannel, EmojiIdentifierResolvable, Message, MessageCreateOptions, MessagePayload, MessageReplyOptions, User } from "discord.js"
import { waitForMessageSomethingOptions, waitForMessageSomethingReturn } from "../types/core"

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

export const findRoleInMessage = async(message: Message, content: string, withFetch = false) => {
    if (!content) return
    if (withFetch) await message.guild.roles.fetch().catch(log4js.trace)

    return message.mentions?.roles?.first() ?? message.guild.roles.cache.find(x =>
        x.name.toLowerCase() === content.toLowerCase() ||
        x.id === content ||
        x.name.toLowerCase().includes(content.toLowerCase()) ||
        content.toLowerCase().includes(x.name.toLowerCase())
    )
}
export const findChannelInMessage = async(message: Message, content: string, withFetch = false) => {
    if (!content) return;
    if (withFetch) await message.guild.channels.fetch().catch(log4js.trace)

    return message.mentions?.channels?.first() ?? message.guild.channels.cache.find(x =>
        x.name.toLowerCase() === content.toLowerCase() ||
        x.id === content ||
        x.name.toLowerCase().includes(content.toLowerCase()) ||
        content.toLowerCase().includes(x.name.toLowerCase())
    )
}

export const waitForRoleMessage = ({ user, guild, channel, time = 120000, deleteUserReply = false, whoCanReply = 'user', conditions = [], cancelWord = 'cancel', failOnUnexisting = false }: waitForMessageSomethingOptions<'role'>): waitForMessageSomethingReturn<'role'> => new Promise(async(resolve) => {
    const collector = channel.createMessageCollector({
        time,
        filter: (m) => !m.author.bot && (whoCanReply === 'everyone' || (whoCanReply === 'user' && m.author.id === user.id) || (whoCanReply === 'notuser' && m.author.id !== user.id)),
    })

    await guild.roles.fetch().catch(log4js.trace)


    collector.on('collect', async(message) => {
        if (deleteUserReply && message.deletable) message.delete().catch(log4js.trace)

        if (message.content.toLowerCase() === cancelWord.toLowerCase()) {
            collector.stop('cancelled')
            return resolve({
                endType: 'cancelled',
                value: null
            })
        }

        const role = await findRoleInMessage(message, message.content, false)

        if (!role) {
            if (failOnUnexisting) {
                collector.stop('fail')
                return resolve({
                    endType: 'fail',
                    value: null
                })
            }

            return sendOrReplyRemove(message, `❌ | Aucun rôle trouvé. Veuillez réessayer avec le nom, l'identifiant ou la mention`, 4000)
        }

        if (conditions.includes('aboveBot') && role.position >= guild.members.me.roles.highest.position) return sendOrReplyRemove(message, `❌ | Le rôle doit être au-dessus de mon rôle le plus haut`, 4000)
        if (conditions.includes('belowBot') && role.position <= guild.members.me.roles.highest.position) return sendOrReplyRemove(message, `❌ | Le rôle doit être en dessous de mon rôle le plus haut`, 4000)
        if (conditions.includes('aboveUser') && role.position >= message.member.roles.highest.position) return sendOrReplyRemove(message, `❌ | Le rôle doit être au-dessus de votre rôle le plus haut`, 4000)
        if (conditions.includes('belowUser') && role.position <= message.member.roles.highest.position) return sendOrReplyRemove(message, `❌ | Le rôle doit être en dessous de votre rôle le plus haut`, 4000)
        if (conditions.includes('noteveryone') && role.id === guild.id) return sendOrReplyRemove(message, {
            content: `❌ | Le rôle ne peut pas être le rôle @everyone`,
            allowedMentions: { roles: [] }
        }, 4000)
    
        collector.stop('ended')
        return resolve({
            endType: 'collected',
            value: role
        })
    })

    collector.on('end', (_, reason) => {
        if (!['collected', 'cancelled', 'fail'].includes(reason)) {
            return resolve({
                endType: 'timeout',
                value: null
            })
        }
    })
})
export const waitForChannelMessage = ({ user, guild, channel, time = 120000, deleteUserReply = false, whoCanReply = 'user', cancelWord = 'cancel', types = [], failOnUnexisting = false }: waitForMessageSomethingOptions<'channel'>): waitForMessageSomethingReturn<'channel'> => new Promise(async(resolve) => {
    const collector = channel.createMessageCollector({
        time,
        filter: (m) => !m.author.bot && (whoCanReply === 'everyone' || (whoCanReply === 'user' && m.author.id === user.id) || (whoCanReply === 'notuser' && m.author.id !== user.id)),
    })
    await guild.channels.fetch().catch(log4js.trace)

    collector.on('collect', async(message) => {
        if (deleteUserReply && message.deletable) message.delete().catch(log4js.trace)

        if (message.content.toLowerCase() === cancelWord.toLowerCase()) {
            collector.stop('cancelled')
            return resolve({
                endType: 'cancelled',
                value: null
            })
        }

        const channel = await findChannelInMessage(message, message.content, false)
        if (!channel) {
            if (failOnUnexisting) {
                collector.stop('fail')
                return resolve({
                    endType: 'fail',
                    value: null
                })
            }

            return sendOrReplyRemove(message, `❌ | Aucun salon trouvé. Veuillez réessayer avec le nom, l'identifiant ou la mention`, 4000)
        }

        if (types && !types.includes(channel.type)) {
            return sendOrReplyRemove(message, `❌ | Ce n'est pas le bon type de salon`, 4000)
        }

        collector.stop('ended')
        return resolve({
            endType: 'collected',
            value: channel as BaseChannel
        })
    })

    collector.on('end', (_, reason) => {
        if (!['ended', 'cancelled', 'fail'].includes(reason)) {
            return resolve({
                endType: 'timeout',
                value: null
            })
        }
    })
})