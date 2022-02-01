import express from 'express';
import { catchAsync, restWrapper } from '../../../../utils';
import { userController } from '../../../../controllers';
import { ensureSignedIn, ensureSignedOut } from '../../../middleware';

const router = express.Router();

router.get('/me', ensureSignedIn({ shouldAdmin: false, shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.me)),
);

router.post('/login', ensureSignedOut({ shouldAdmin: false, shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.login)),
);

router.delete('/logout', ensureSignedIn({ shouldAdmin: false, shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.logout)),
);

router.post('/signup', ensureSignedOut({ shouldAdmin: false, shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.signup)),
);

router.put(
	'/change-password',
	ensureSignedIn({ shouldAdmin: false, shouldUser: true }),
	(...args) => catchAsync(restWrapper(args, userController.changePassword)),
);

export default router;
