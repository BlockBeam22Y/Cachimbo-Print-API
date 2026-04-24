import 'dotenv/config';

export const db = {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
};

export const hostURL = process.env.HOST_API;
export const jwtSecret = process.env.JWT_SECRET;
export const connectionString = process.env.AZ_CONNECTION_STRING ?? '';

export const rootPath = process.cwd();