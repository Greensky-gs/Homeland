import { Message, MessageCreateOptions, MessagePayload, MessageReplyOptions } from "discord.js"

export const removeNullElements = <T>(arr: T[]): T[] => arr.filter(x => !!x)

export const sendOrReply = async(message: Message<boolean>, content: string | MessagePayload | MessageCreateOptions | MessageReplyOptions) => {
    if (message.channel.isSendable()) {
        return message.channel.send(content)
    } else {
        return message.reply(content)
    }
}