import mysql from 'mysql2/promise';

export const DatabaseConfig = {
  Host: process.env.DB_HOST || 'localhost',
  Port: Number(process.env.DB_PORT || '3306'),
  User: process.env.DB_USER || 'root',
  Pass: process.env.DB_PASS || 'password',
  Name: process.env.DB_NAME || 'DataScreenDB',
} as const;

export async function createConnection() {
  return mysql.createConnection({
    host: DatabaseConfig.Host,
    port: DatabaseConfig.Port,
    user: DatabaseConfig.User,
    password: DatabaseConfig.Pass,
    database: DatabaseConfig.Name,
    dateStrings: true,
  });
}
