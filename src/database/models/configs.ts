import { DataTypes } from "sequelize";
import { DatabaseTables } from "../../types/database";
import { sequelise } from "../sequelize";
import { prefix } from '../../data/hard/configs.json';

const configs = sequelise.define(DatabaseTables.Configs, {
    guild_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    prefix: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: prefix
    }
})

configs.sync({ alter: true });
export default configs;