import chai from 'chai';
import { logics } from '../../../utils';
import { adminController, middleware } from '../../../controllers';

const { expect } = chai;

describe('Admin logout controller', function () {
	this.timeout(0);
	this.slow(1000);

	it('admin logout => should success', async () => {
		try {
			const { token } = await adminController.login(null, {
				username: 'shahan',
				password: 'shahan',
			});

			const user = await middleware.ensureSignIn({ shouldAdmin: true }, `Bearer ${token}`);
			const ctx = { req: { user } };

			const result = await adminController.logout(undefined, undefined, ctx);

			expect(token).to.be.a('string');
			expect(result).to.be.a.string("You've successfully signed out.");
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});

	it('admin logout => should fail', async () => {
		try {
			await middleware.ensureSignIn({ shouldAdmin: true }).catch((error) => {
				const { errorMessage } = logics.catchError(error);
				expect(errorMessage).to.be.a.string('You need to sign in.');
			});
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});
});
