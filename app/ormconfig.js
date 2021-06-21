const type = process.env.TYPEORM_TYPE || 'postgres';
const username = process.env.TYPEORM_USERNAME || 'user';
const password = process.env.TYPEORM_PASSWORD || 'pass';
const host = process.env.TYPEORM_HOST || 'db';
const port = parseInt(process.env.TYPEORM_PORT, 10) || 5432;
const database = process.env.TYPEORM_DATABASE || 'data';

const extraParams = process.env.NODE_ENV === 'production' ? {"ssl": {"rejectUnauthorized": false}} : undefined
console.log(extraParams);
module.exports = {
  type,
  url:
    process.env.DATABASE_URL ||
    `${type}://${username}:${password}@${host}:${port}/${database}`,
  entities: [
    process.env.NODE_ENV === 'test'
      ? 'src/**/**.entity.ts'
      : './**/**.entity.js',
  ],
  synchronize: true,
  extra: extraParams,
  ssl:
    process.env.NODE_ENV === 'production'
      ? true
      : false,
};