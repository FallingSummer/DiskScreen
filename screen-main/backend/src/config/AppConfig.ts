import dotenv from 'dotenv';

dotenv.config();

export const AppConfig = {
  Port: Number(process.env.PORT || '3000'),
  MockMode: process.env.MOCK_MODE === 'true',
  CorsOrigin: process.env.CORS_ORIGIN || '*',
} as const;
