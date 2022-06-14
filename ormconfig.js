module.exports = {
    "type": "postgres",
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "synchronize": true,
    "entities": ["src/**/**.entity{.ts,.js}"],
    "seeds": ["src/db/seeds/*{.ts,.js}"],
    "factories": ["src/db/factories/*{.ts,.js}"],
};
