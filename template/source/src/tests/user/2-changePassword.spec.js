import chai from 'chai';
import { auth, logics } from '../../utils';
import { userController, middleware } from '../../controllers';

const { expect } = chai;

describe('User changePassword controller', function () {
	this.timeout(0);
	this.slow(1000);

	it('user changePassword => should success', async () => {
		let userId;
		try {
			const { token } = await userController.login(null, {
				username: 'shahanahmed86',
				password: '123abc456',
			});
			expect(token).to.be.a('string');

			const user = await middleware.ensureSignIn({ shouldUser: true }, `Bearer ${token}`);
			const context = { req: { user } };

			const result = await userController.changePassword(
				undefined,
				{ oldPassword: '123abc456', password: '123abc4567' },
				context,
			);

			expect(result).to.be.a.string('Password changed successfully');

			userId = user.id;
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (userId) await auth.signOut(userId);
		}
	});

	it('user changePassword => should fail', async () => {
		let userId;
		try {
			const { token } = await userController.login(null, {
				username: 'shahanahmed86',
				password: '123abc4567',
			});

			const user = await middleware.ensureSignIn({ shouldUser: true }, `Bearer ${token}`);
			const context = { req: { user } };

			userId = user.id;

			await userController
				.changePassword(undefined, { oldPassword: '', password: '123abc456' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Old Password cannot be an empty field');
				});

			await userController
				.changePassword(undefined, { oldPassword: '123abc456', password: '' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Password cannot be an empty field');
				});

			await userController
				.changePassword(undefined, { oldPassword: '123abc456' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Password is a required field');
				});

			await userController
				.changePassword(undefined, { password: '123abc456' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Old Password is a required field');
				});

			await userController
				.changePassword(undefined, { oldPassword: '123abc456', password: 'shahan' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Old password mismatched');
				});

			await userController
				.changePassword(undefined, { oldPassword: '123abc4567', password: '123abc4567' }, context)
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Your new password cannot be same as the old one');
				});
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (userId) await auth.signOut(userId);
		}
	});
});
