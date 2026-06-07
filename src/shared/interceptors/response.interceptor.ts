import { Request, Response, NextFunction } from 'express';

export function responseInterceptor(req: Request, res: Response, next: NextFunction): void {
	const originalJson = res.json;
	(res as any).json = function (body: any) {
		// Don't wrap auth responses - they already have proper structure
		if (body.token || req.path.includes('/login')) {
			return originalJson.call(this, body);
		}
		return originalJson.call(this, { data: body });
	};
	next();
}

export default responseInterceptor;

