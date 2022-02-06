import chai from 'chai';
import { auth, logics } from '../../../utils';
import { userController, middleware } from '../../../controllers';
import { schemas } from '../../helper';

const { expect } = chai;

describe('User me controller', function () {
	this.timeout(0);
	this.slow(1000);

	it('user me => should success', async () => {
		let userId;
		try {
			const { token } = await userController.login(null, {
				username: 'test-user',
				password: '123abc4567',
			});
			expect(token).to.be.a('string');

			const user = await middleware.ensureSignIn({ shouldUser: true }, `Bearer ${token}`);
			const context = { req: { user } };

			const result = await userController.me(undefined, undefined, context);

			schemas.userSchema.shouldNotHave.forEach((property) => {
				expect(result).to.not.have.property(property);
			});

			Object.keys(schemas.userSchema.shouldHave).forEach((property) => {
				expect(result).to.have.property(property);
			});

			userId = result.id;
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (userId) await auth.signOut(userId);
		}
	});

	it('user me => should fail', async () => {
		try {
			await middleware.ensureSignIn({ shouldUser: true }).catch((error) => {
				const { errorMessage } = logics.catchError(error);
				expect(errorMessage).to.be.a.string('You need to sign in.');
			});

			await middleware.ensureSignIn({ shouldUser: true }, 'wrong token').catch((error) => {
				const { errorMessage } = logics.catchError(error);
				expect(errorMessage).to.be.a.string('jwt malformed');
			});
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});
});
