import items from '../data/json/items.json'

export type itemKey = keyof typeof items;
export const getItem = <K extends itemKey>(key: K): (typeof items)[K] => items[key];