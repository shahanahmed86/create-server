import chai from 'chai';
import { auth, logics } from '../../../utils';
import { adminController, middleware } from '../../../controllers';

const { expect } = chai;

describe('Admin changePassword controller', function () {
	this.timeout(0);
	this.slow(1000);

	it('admin changePassword => should success', async () => {
		let adminId;
		try {
			const { token } = await adminController.login(null, {
				username: 'shahan',
				password: 'shahan',
			});
			expect(token).to.be.a('string');

			const user = await middleware.ensureSignIn({ shouldAdmin: true }, `Bearer ${token}`);
			const context = { req: { user } };

			const result = await adminController.changePassword(
				undefined,
				{ oldPassword: 'shahan', password: '123abc456' },
				context,
			);

			expect(result).to.be.a.string('Password changed successfully');

			adminId = user.id;
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (adminId) await auth.signOut(adminId);
		}
	});

	it('admin changePassword => should fail', async () => {
		let context;
		try {
			const { token } = await adminController.login(null, {
				username: 'shahan',
				password: '123abc456',
			});

			const user = await middleware.ensureSignIn({ shouldAdmin: true }, `Bearer ${token}`);
			context = { req: { user } };

			await adminController
				.changePassword(undefined, { oldPassword: '', password: 'shahan' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Old Password cannot be an empty field');
				});

			await adminController
				.changePassword(undefined, { oldPassword: '123abc456', password: '' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Password cannot be an empty field');
				});

			await adminController
				.changePassword(undefined, { oldPassword: '123abc456' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Password is a required field');
				});

			await adminController
				.changePassword(undefined, { password: '123abc456' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Old Password is a required field');
				});

			await adminController
				.changePassword(undefined, { oldPassword: 'shahan', password: '123abc456' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Old password mismatched');
				});

			await adminController
				.changePassword(undefined, { oldPassword: '123abc456', password: '123abc456' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Your new password cannot be same as the old one');
				});
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			await adminController
				.changePassword(undefined, { oldPassword: '123abc456', password: 'shahan' }, context)
				.catch((error) => {
					console.error(error);
					expect(true).to.be.false;
				});
		}
	});
});
