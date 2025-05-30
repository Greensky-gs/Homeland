import { itemData, itemSubType, itemType, knownItemType } from "../types/items";

export class Item<T extends itemType = itemType, S extends itemSubType<T> = itemSubType<T>> {
    private data: itemData<T, S>;
    private _details: Object = {}

    constructor(data: itemData<T, S>) {
        this.data = data;

        this.connect_details()
    }

    // Definers
    //// Type
    public isWeapon(): this is Item<'weapon', itemSubType<'weapon'>> {
        return this.data.type === 'weapon';
    }
    public isPotion(): this is Item<'potion', itemSubType<'potion'>> {
        return this.data.type === 'potion';
    }
    public isItem(): this is Item<'item', itemSubType<'item'>> {
        return this.data.type === 'item';
    }
    public isDecoration(): this is Item<'decoration', itemSubType<'decoration'>> {
        return this.data.type === 'decoration';
    }

    //// Subtype
    public isSword(): this is Item<"weapon", 'sword'> {
        return this.isWeapon() && this.data.subtype === "sword";
    }
    public isAxe(): this is Item<"weapon", 'axe'> {
        return this.isWeapon() && this.data.subtype === "axe";
    }
    public isBow(): this is Item<"weapon", 'bow'> {
        return this.isWeapon() && this.data.subtype === "bow";
    }
    public isStaff(): this is Item<"weapon", 'staff'> {
        return this.isWeapon() && this.data.subtype === "staff";
    }
    public isDagger(): this is Item<"weapon", 'dagger'> {
        return this.isWeapon() && this.data.subtype === "dagger";
    }
    public isShield(): this is Item<"weapon", 'shield'> {
        return this.isWeapon() && this.data.subtype === "shield";
    }
    public isHealthPotion(): this is Item<"potion", 'health'> {
        return this.isPotion() && this.data.subtype === "health";
    }
    public isManaPotion(): this is Item<"potion", 'mana'> {
        return this.isPotion() && this.data.subtype === "mana";
    }
    public isStaminaPotion(): this is Item<"potion", 'stamina'> {
        return this.isPotion() && this.data.subtype === "stamina";
    }
    public isStrengthPotion(): this is Item<"potion", 'strength'> {
        return this.isPotion() && this.data.subtype === "strength";
    }
    public isAgilityPotion(): this is Item<"potion", 'agility'> {
        return this.isPotion() && this.data.subtype === "agility";
    }
    public isFoodItem(): this is Item<"item", 'food'> {
        return this.isItem() && this.data.subtype === "food";
    }
    public isMaterialItem(): this is Item<"item", 'material'> {
        return this.isItem() && this.data.subtype === "material";
    }
    public isMiscItem(): this is Item<"item", 'misc'> {
        return this.isItem() && this.data.subtype === "misc";
    }
    public isFurnitureDecoration(): this is Item<"decoration", 'furniture'> {
        return this.isDecoration() && this.data.subtype === "furniture";
    }
    public isPaintingDecoration(): this is Item<"decoration", 'painting'> {
        return this.isDecoration() && this.data.subtype === "painting";
    }
    public isStatueDecoration(): this is Item<"decoration", 'statue'> {
        return this.isDecoration() && this.data.subtype === "statue";
    }
    public isTrophyDecoration(): this is Item<"decoration", 'trophy'> {
        return this.isDecoration() && this.data.subtype === "trophy";
    }

    // Getters
    public get name(): string {
        return this.data.name;
    }
    public get type(): T {
        return this.data.type;
    }
    public get subtype(): S {
        return this.data.subtype;
    }
    public get short_description(): string {
        return this.data.short_description;
    }
    public get details() {
        if (this.data.details) {
            return this._details
        }
        return {}
    }

    public setKnown(known: { [k in knownItemType<T, S>]?: boolean }) {
        this.data.known = known
        return this
    }

    public connect_details(): boolean {
        if (this.data.details) {
            this._details = require(`../data/json/details/${this.data.key}.json`)
        }
        return this.data.details
    }
}