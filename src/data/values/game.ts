import { moneyValues } from "../../types/game"

type moneyConversionsType = {
    [k in keyof moneyValues]?: {number: number; gives: keyof moneyValues};
}
export const moneyConversions: moneyConversionsType = {
    bronzes: {number: 50, gives: 'silvers'},
    silvers: {number: 150, gives: 'gold'},
    shards: {number: 10, gives: 'fragments'},
    fragments: {number: 30, gives: 'stones'},
    stones: {number: 5, gives: 'masterworks'}
}