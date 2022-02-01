import { middleware } from '../controllers';
import { logics } from '../utils';

export const ensureSignedIn = (args) => async (req, res, next) => {
	try {
		const token = req.get('Authorization') || req.headers.Authorization;
		req.user = await middleware.ensureSignIn(args, token);

		next();
	} catch (error) {
		const { statusCode, errorMessage } = logics.catchError(error);
		res.status(statusCode).send(errorMessage);
	}
};

export const ensureSignedOut = (args) => async (req, res, next) => {
	try {
		const token = req.get('Authorization') || req.headers.Authorization;
		await middleware.ensureSignOut(args, token);

		next();
	} catch (error) {
		const { statusCode, errorMessage } = logics.catchError(error);
		res.status(statusCode).send(errorMessage);
	}
};
