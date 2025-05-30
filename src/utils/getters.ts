import items from '../data/json/items.json'
import perms from '../data/hard/permissions.json'
import emojis from '../data/hard/emojis.json'
import texts from '../data/json/texts.json'
import { PermissionsString } from 'discord.js';

export type itemKey = keyof typeof items;
export const getItem = <K extends itemKey>(key: K): (typeof items)[K] => items[key];

export const getPermission = (key: keyof typeof perms | PermissionsString) => perms[key];
export const getEmoji = (key: keyof typeof emojis) => emojis[key];
export const getText = (key: keyof typeof texts) => texts[key].join('\n');