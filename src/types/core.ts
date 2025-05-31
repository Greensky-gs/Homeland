import { BaseChannel, Channel, ChannelType, Guild, Role, SendableChannels, User } from "discord.js"

export type waitForMessageSomethingType = 'role' | 'channel' | 'user'
export type waitForMessageSomethingOptions<T extends waitForMessageSomethingType> = {
    user: User;
    /**
     * Time in milliseconds
     * @default 120000 (2 minutes)
     */
    time?: number;
    whoCanReply?: 'user' | 'everyone' | 'notuser';
    /**
     * @default false
     */
    deleteUserReply?: boolean;
    channel: SendableChannels;
    guild: Guild;
    /**
     * Returns the failing if the user sends an invalid response
     * @default false
     */
    failOnUnexisting?: boolean;
    /**
     * The word to cancel the waiting
     * @default 'cancel'
     */
    cancelWord?: string;
} & (
    T extends 'role' ? {
        /**
         * The conditions the role has to check
         */
        conditions?: ('aboveBot' | 'belowBot' | 'aboveUser' | 'belowUser' | 'noteveryone')[] 
    } :
    T extends 'channel' ? {
        types?: ChannelType[];
    } :
    T extends 'user' ? {
        /**
         * The conditions the user has to check
         */
        conditions?: ('bot' | 'notbot' | 'belowUser' | 'aboveUser' | 'belowBot' | 'aboveBot')[]
    } :
    {}
)
export type waitForMessageSomethingReturn<T extends waitForMessageSomethingType> = Promise<{
    endType: 'collected' | 'timeout' | 'cancelled' | 'fail';
    value: T extends 'role' ? Role : T extends 'channel' ? BaseChannel : T extends 'user' ? User : never
}>