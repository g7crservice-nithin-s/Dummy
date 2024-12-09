import { Request, Response } from 'express';
import { filter } from 'compression';

export const shouldCompress = (req: Request, res: Response) => {
	if (req.headers['x-no-compression']) {
		return false;
	}
	return filter(req, res);
};
