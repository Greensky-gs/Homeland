import { Precondition } from "amethystjs";
import { players } from "../cache/players";
import { sendOrReplyRemove } from "../utils/toolbox";
import { started } from "../embeds/denietions";

export default new Precondition('notStarted').setMessageRun(({ message, client }) => {
    if (players.exists(message.author.id)) {
        sendOrReplyRemove(message, { embeds: [started(message.author)] }, 5000);
        return {
            ok: false,
            type: 'message',
            channelMessage: message,
            metadata: {
                silent: true
            }
        };
    }
    return {
        ok: true,
        type: 'message',
        channelMessage: message
    };
})