import { Sequelize } from 'sequelize';
import { readdirSync } from 'node:fs';

export const sequelise = new Sequelize({
    dialect: 'mysql',
    password: process.env.dbp,
    host: process.env.dbh,
    username: process.env.dbu,
    database: process.env.db,
    logging: false
});

sequelise.authenticate();
sequelise.sync({ alter: true });

readdirSync('./dist/database/models').forEach((fileName) => {
    require(`./models/${fileName}`);
});