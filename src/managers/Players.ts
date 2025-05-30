import { log4js } from "amethystjs";
import { Player } from "../classes/Player";
import players from "../database/models/players";
import { defaultMoneyContent } from "../data/values/game";

export class PlayersManager {
    private players: Map<string, Player> = new Map();

    constructor() {
        this.init()
    }

    public exists(id: string): boolean {
        return this.players.has(id);
    }

    public all(): Player[] {
        return Array.from(this.players.values());
    }
    public get size(): number {
        return this.players.size;
    }

    public async create({ id, name }: { id: string; name: string }): Promise<Player | false> {
        const player = new Player({
            items: [],
            gold: defaultMoneyContent(),
            name,
            user_id: id,
            position: "start",
            level: 1
        })

        this.players.set(id, player);
        const res = await players.create(player.dataObject).catch(log4js.trace);

        if (!res) {
            this.players.delete(id)
            return false
        }
        return player
    }

    public get(id: string): Player | undefined {
        return this.players.get(id);
    }

    private async init() {
        const datas = await players.findAll().catch(log4js.trace)
        if (!datas) {
            throw new Error("Failed to fetch players from the database.");
        }

        this.players = new Map(datas.map(x => [x.dataValues.user_id, new Player({
            ...x.dataValues,
            gold: JSON.parse(x.dataValues.gold || "{}"),
            items: JSON.parse(x.dataValues.items || "[]"),
        })])) as Map<string, Player>;
    }
}