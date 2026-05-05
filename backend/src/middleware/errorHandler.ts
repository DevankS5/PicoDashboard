import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('[Error]', err);

  if (err.type === 'VALIDATION_ERROR') {
    res.status(400).json({
      success: false,
      error: err.message,
      code: 'VALIDATION_ERROR',
    });
    return;
  }

  if (err.code === 'P2025') {
    res.status(404).json({
      success: false,
      error: 'Resource not found',
      code: 'NOT_FOUND',
    });
    return;
  }

  if (err.code === 'P2003' || err.code === 'P2002') {
    res.status(400).json({
      success: false,
      error: 'Invalid reference or duplicate entry',
      code: 'VALIDATION_ERROR',
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
