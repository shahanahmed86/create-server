import chai from 'chai';
import { auth, logics } from '../../utils';
import { adminController, middleware } from '../../controllers';
import { schemas } from '../helper';

const { expect } = chai;

describe('Admin me controller', function () {
	this.timeout(0);
	this.slow(1000);

	it('admin me => should success', async () => {
		let adminId;
		try {
			const { token } = await adminController.login(null, {
				username: 'shahan',
				password: 'shahan',
			});

			expect(token).to.be.a('string');

			const user = await middleware.ensureSignIn({ shouldAdmin: true }, `Bearer ${token}`);
			const context = { req: { user } };

			const admin = await adminController.me(undefined, undefined, context);

			schemas.adminSchema.shouldNotHave.forEach((property) => {
				expect(admin).to.not.have.property(property);
			});

			Object.entries(schemas.adminSchema.shouldHave).forEach(([property, type]) => {
				expect(admin).to.have.property(property).a(type);
			});

			adminId = admin.id;
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (adminId) await auth.signOut(adminId);
		}
	});

	it('admin me => should fail', async () => {
		try {
			await middleware.ensureSignIn({ shouldAdmin: true }).catch((error) => {
				const { errorMessage } = logics.catchError(error);
				expect(errorMessage).to.be.a.string('You need to sign in.');
			});

			await middleware.ensureSignIn({ shouldAdmin: true }, 'wrong token').catch((error) => {
				const { errorMessage } = logics.catchError(error);
				expect(errorMessage).to.be.a.string('jwt malformed');
			});
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});
});
