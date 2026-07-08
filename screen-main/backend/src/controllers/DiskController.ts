import type { Request, Response } from 'express';
import { DiskService } from '@/services/DiskService';
import { successResponse, errorResponse } from '@/utils/ResponseUtil';

const service = new DiskService();

export async function getDiskData(req: Request, res: Response): Promise<void> {
  try {
    const { hostId, diskName, startHour, endHour } = req.query as Record<string, string | undefined>;
    const data = await service.queryDiskData(hostId, diskName, startHour, endHour);
    successResponse(res, data);
  } catch (err: any) {
    errorResponse(res, err.message || '查询磁盘数据失败');
  }
}
