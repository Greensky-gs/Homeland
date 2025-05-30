import { DataTypes } from "sequelize";
import { DatabaseTables } from "../../types/database";
import { sequelise } from "../sequelize";

const players = sequelise.define(DatabaseTables.Players, {
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    gold: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
            bronzes: 0,
            silvers: 0,
            gold: 0,
            shards: 0,
            fragments: 0,
            stones: 0,
            masterworks: 0
        }
    }
})

players.sync({ alter: true })
export default players;