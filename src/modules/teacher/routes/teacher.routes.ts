import { Router, Request, Response } from 'express';

const router = Router();

router.get('/teachers', (req: Request, res: Response) => {
	res.json({ message: 'Teacher module root' });
});

export default router;

