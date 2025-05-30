import { Precondition } from "amethystjs";
import { players } from "../cache/players";
import { sendOrReplyRemove } from "../utils/toolbox";
import { notStarted } from "../embeds/denietions";

export default new Precondition("started").setMessageRun(({ message, client }) => {
    if (!players.exists(message.author.id)) {
        sendOrReplyRemove(message, { embeds: [notStarted(message.author)] }, 5000)

        return {
            ok: false,
            type: "message",
            channelMessage: message,
            metadata: {
                silent: true
            }
        }
    }
    return {
        ok: true,
        type: 'message',
        channelMessage: message
    }
})