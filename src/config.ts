export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || 'painel.eduardoabrito.com.br',
    port: parseInt(process.env.DB_PORT, 10) || 3031,
    username: process.env.DB_USERNAME || 'mysql',
    password: process.env.DB_PASSWORD || 'f9f6cff4c6c4071a9b5c',
    database: process.env.DB_DATABASE || 'nestjsrealworld',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  },
});

// Mantendo compatibilidade com importações existentes
export const SECRET = process.env.JWT_SECRET || 'secret-key'; 