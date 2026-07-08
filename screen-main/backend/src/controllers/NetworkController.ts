import type { Request, Response } from 'express';
import { NetworkService } from '@/services/NetworkService';
import { successResponse, errorResponse } from '@/utils/ResponseUtil';

const service = new NetworkService();

export async function getNetworkData(req: Request, res: Response): Promise<void> {
  try {
    const { hostId, startHour, endHour } = req.query as Record<string, string | undefined>;
    const data = await service.queryNetworkData(hostId, startHour, endHour);
    successResponse(res, data);
  } catch (err: any) {
    errorResponse(res, err.message || '查询网络数据失败');
  }
}
