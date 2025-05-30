import { Sequelize } from 'sequelize';
import { readdirSync } from 'node:fs';

export const sequelise = new Sequelize({
    dialect: 'mysql',
    password: process.env.db_password,
    host: process.env.db_host,
    username: process.env.db_user,
    database: process.env.db_name,
    logging: false
});

sequelise.authenticate();
sequelise.sync({ alter: true });

readdirSync('./dist/database/models').forEach((fileName) => {
    require(`./models/${fileName}`);
});