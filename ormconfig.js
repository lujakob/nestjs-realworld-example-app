module.exports = {
    "type": "postgres",
    "host": process.env.DB_HOST || "localhost",
    "port": process.env.DB_PORT || 54320,
    "username": process.env.DB_USER || "postgres",
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME || "postgres",
    "synchronize": true,
    "entities": ["src/**/**.entity{.ts,.js}"],
    "seeds": ["src/db/seeds/*{.ts,.js}"],
    "factories": ["src/db/factories/*{.ts,.js}"],
};
