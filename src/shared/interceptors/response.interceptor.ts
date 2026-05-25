import { Request, Response, NextFunction } from 'express';

export function responseInterceptor(req: Request, res: Response, next: NextFunction): void {
	const originalJson = res.json;
	(res as any).json = function (body: any) {
		return originalJson.call(this, { data: body });
	};
	next();
}

export default responseInterceptor;

