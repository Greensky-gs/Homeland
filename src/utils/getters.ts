import items from '../data/json/items.json'
import perms from '../data/hard/permissions.json'
import { PermissionsString } from 'discord.js';

export type itemKey = keyof typeof items;
export const getItem = <K extends itemKey>(key: K): (typeof items)[K] => items[key];

export const getPermission = (key: keyof typeof perms | PermissionsString) => perms[key];