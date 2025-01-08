import { Request, Response, NextFunction } from 'express';

type AsyncFunction<T = any> = (
  req: Request<T>,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = <T>(fn: AsyncFunction<T>) => 
  (req: Request<T>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
