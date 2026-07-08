import { Router } from 'express';
import { getPerformanceData } from '@/controllers/PerformanceController';
import { getDiskData } from '@/controllers/DiskController';
import { getNetworkData } from '@/controllers/NetworkController';
import { getStatusSnapshot } from '@/controllers/StatusController';

const router = Router();

router.get('/performance-hourly', getPerformanceData);
router.get('/disk-hourly', getDiskData);
router.get('/network-hourly', getNetworkData);
router.get('/status-snapshot', getStatusSnapshot);

export default router;
