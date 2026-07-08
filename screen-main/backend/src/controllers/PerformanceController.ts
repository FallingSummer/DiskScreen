import type { Request, Response } from 'express';
import { PerformanceService } from '@/services/PerformanceService';
import { successResponse, errorResponse } from '@/utils/ResponseUtil';

const service = new PerformanceService();

export async function getPerformanceData(req: Request, res: Response): Promise<void> {
  try {
    const { hostId, startHour, endHour } = req.query as Record<string, string | undefined>;
    const data = await service.queryPerformanceData(hostId, startHour, endHour);
    successResponse(res, data);
  } catch (err: any) {
    errorResponse(res, err.message || '查询性能数据失败');
  }
}
