import { log4js } from "amethystjs";
import configs from "../database/models/configs";
import { DatabaseConfig } from "../types/database";
import { prefix } from "../data/hard/configs.json";

export class ConfigsManager {
    private cache: Map<string, DatabaseConfig> = new Map()

    constructor() {
        this.init()
    }

    public defaultConfigFor(guild: string): DatabaseConfig {
        return {
            guild_id: guild,
            prefix,
            denied_channels: [],
            only_channels: [],
            only_roles: [],
            deny_roles: []
        }
    }
    public async update<K extends keyof Omit<DatabaseConfig, 'guild_id'>>(guildId: string, config: K, value: DatabaseConfig[K]) {
        const current = this.getGuildConfig(guildId);
        const old = Object.assign({}, current);
        current[config] = value
        
        this.cache.set(guildId, current);
        const res = await configs.upsert(current).catch(log4js.trace)

        if (!res) {
            this.cache.set(guildId, old)
            return false
        }
        return true
    }

    public getGuildConfig(guildId: string): DatabaseConfig {
        if (this.cache.has(guildId)) {
            return this.cache.get(guildId)!
        }

        const defaultConfig = this.defaultConfigFor(guildId);
        return defaultConfig;
    }

    private async init() {
        const res = await configs.findAll().catch(log4js.trace)
        if (!res) {
            throw new Error("Failed to fetch configs from database");
        }

        this.cache = new Map(res.map((x) => ([x.dataValues.guild_id, {
            ...x.dataValues,
            denied_channels: JSON.parse(x.dataValues.denied_channels || '[]'),
            only_channels: JSON.parse(x.dataValues.only_channels || '[]'),
            only_roles: JSON.parse(x.dataValues.only_roles || '[]'),
            deny_roles: JSON.parse(x.dataValues.deny_roles || '[]')
        }])))
    }
}