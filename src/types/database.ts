import { itemKey } from "../utils/getters";
import { moneyValues } from "./game";
import { itemSubType, itemType, knownItemType } from "./items";

export enum DatabaseTables {
    Players = 'homeland_players'
}

export type playerDatabaseItemsType = {key: itemKey; knows: knownItemType<itemType, itemSubType<itemType>>}[];
export type DatabasePlayer = {
    name: string;
    user_id: string;
    position: string;
    level: number;
    items: playerDatabaseItemsType;
    gold: moneyValues;
}