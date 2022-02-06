import chai from 'chai';
import { logics } from '../../../utils';
import { userController, middleware } from '../../../controllers';

const { expect } = chai;

describe('User logout controller', function () {
	this.timeout(0);
	this.slow(1000);

	it('user logout => should success', async () => {
		try {
			const { token } = await userController.login(null, {
				username: 'test-user',
				password: '123abc4567',
			});

			const user = await middleware.ensureSignIn({ shouldUser: true }, `Bearer ${token}`);
			const ctx = { req: { user } };

			const result = await userController.logout(undefined, undefined, ctx);

			expect(token).to.be.a('string');
			expect(result).to.be.a.string("You've successfully signed out.");
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});

	it('user logout => should fail', async () => {
		try {
			await middleware.ensureSignIn({ shouldUser: true }).catch((error) => {
				const { errorMessage } = logics.catchError(error);
				expect(errorMessage).to.be.a.string('You need to sign in.');
			});
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});
});
