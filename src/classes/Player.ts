import { moneyConversions } from "../data/values/game";
import { DatabasePlayer } from "../types/database";
import { itemData, itemSubType, itemType, knownItemType } from "../types/items";
import { getItem } from "../utils/getters";
import { Item } from "./Item";

export class Player<T extends DatabasePlayer = DatabasePlayer> {
    private data: T;
    private _items: Item[] = []

    constructor(data: T) {
        this.data = data

        this.buildItems()
    }

    public get name(): string {
        return this.data.name
    }
    public get userId(): string {
        return this.data.user_id
    }
    public get position(): string {
        return this.data.position
    }
    public get level(): number {
        return this.data.level
    }
    public get items(): Item[] {
        return this._items
    }
    public get gold(): T['gold'] {
        return this.data.gold
    }
    public get dataObject(): T {
        return Object.freeze(Object.fromEntries(Object.entries(this.data))) as T
    }

    /**
     * Total gold, in bronzes. Excluding diamonds
     */
    public calculateTotalGold(): number {
        const { bronzes, silvers, gold } = this.data.gold
        return bronzes + silvers * moneyConversions.bronzes.number + gold * moneyConversions.silvers.number
    }

    private buildItems(): void {
        this._items = this.data.items.map((item) => new Item(getItem(item.key) as itemData<itemType, itemSubType<itemType>>).setKnown(item.knows as { [k in knownItemType<itemType, itemSubType<itemType>>]?: boolean }));
    }
}