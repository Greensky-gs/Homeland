export type itemType = 'weapon' | 'potion' | 'item' | 'decoration'
export type itemSubType<K extends itemType> = 
    K extends 'weapon' ? 'sword' | 'axe' | 'bow' | 'staff' | 'dagger' | 'shield' :
    K extends 'potion' ? 'health' | 'mana' | 'stamina' | 'strength' | 'agility' :
    K extends 'item' ? 'food' | 'material' | 'misc' :
    K extends 'decoration' ? 'furniture' | 'painting' | 'statue' | 'trophy' : 'none';


export type itemTypeData<T extends itemType> = 
    T extends 'weapoon' 
    ? { damage: number; range: number; creator: string; }
    : T extends 'potion'
    ? { effect: string; duration: number; creator: string; }
    : T extends 'item'
    ? {}
    : T extends 'decoration'
    ? {} : {};

export type itemSubTypeData<T extends itemType, S extends itemSubType<T>> = 
    S extends 'furniture'
    ? { creation_date: string; material: string; }
    : S extends 'painting'
    ? { author: string }
    : S extends 'statue'
    ? { sculptor: string; material: string; who: string; date: string; }
    : S extends 'trophy' 
    ? { competition: string; year: number; winner: string; }
    : S extends 'food'
    ? { nutrition: number; expiration_date: string; }
    : {}

export type itemData<T extends itemType, S extends itemSubType<T>> = {
    name: string;
    key: string;
    type: T;
    subtype: S;
    short_description: string;
    details: boolean;
    known: {
        [k in knownItemType<T, S>]?: boolean;
    };
} & itemTypeData<T> & itemSubTypeData<T, S>;

export type knownItemType<T extends itemType, S extends itemSubType<T>> = 'details' | 'name' | keyof itemTypeData<T> | keyof itemSubTypeData<T, S>;;