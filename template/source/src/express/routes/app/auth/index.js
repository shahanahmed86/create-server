import express from 'express';
import { catchAsync, restWrapper } from '../../../../utils';
import { userController } from '../../../../controllers';
import { ensureSignedIn, ensureSignedOut } from '../../../middleware';

const router = express.Router();

router.get('/me', ensureSignedIn({ shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.me)),
);

router.post('/login', ensureSignedOut({ shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.login)),
);

router.delete('/logout', ensureSignedIn({ shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.logout)),
);

router.post('/signup', ensureSignedOut({ shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.signup)),
);

router.put('/change-password', ensureSignedIn({ shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.changePassword)),
);

export default router;
