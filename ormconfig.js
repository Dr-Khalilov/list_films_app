module.exports = {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [`${__dirname}/**/*.entity{.ts,.js}`],
    synchronize: process.env.TYPEORM_SYNC,
    factories: ['src/shared/**/*.factory{.ts,.js}'],
    seeds: ['src/shared/**/*.seed{.ts,.js}'],
    cli: {
        entitiesDir: 'src/shared/models',
    },
    url: 'postgres://avsqjoom:JjVt_118XjWr6fJQfijVApEvDuUqLeCV@dumbo.db.elephantsql.com/avsqjoom',
};
