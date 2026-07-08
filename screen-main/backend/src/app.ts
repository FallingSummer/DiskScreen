import express from 'express';
import cors from 'cors';
import { AppConfig } from '@/config/AppConfig';
import ApiRoutes from '@/routes/ApiRoutes';

const app = express();

app.use(cors({ origin: AppConfig.CorsOrigin }));
app.use(express.json());

app.use('/api/v1', ApiRoutes);

app.get('/health', (_req, res) => {
  res.json({ Code: 0, Data: { status: 'up', mockMode: AppConfig.MockMode }, Message: 'ok' });
});

app.use((_req, res) => {
  res.status(404).json({ Code: 404, Data: null, Message: '接口不存在' });
});

app.listen(AppConfig.Port, () => {
  console.log(`[DataScreenBackend] Server running at http://localhost:${AppConfig.Port}`);
  console.log(`[DataScreenBackend] MockMode = ${AppConfig.MockMode}`);
});
