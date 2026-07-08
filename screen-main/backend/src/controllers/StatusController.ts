import type { Request, Response } from 'express';
import { StatusService } from '@/services/StatusService';
import { successResponse, errorResponse } from '@/utils/ResponseUtil';

const service = new StatusService();

export async function getStatusSnapshot(req: Request, res: Response): Promise<void> {
  try {
    const { alertLevel } = req.query as Record<string, string | undefined>;
    const data = await service.queryStatusSnapshot(alertLevel);
    successResponse(res, data);
  } catch (err: any) {
    errorResponse(res, err.message || '查询状态快照失败');
  }
}
