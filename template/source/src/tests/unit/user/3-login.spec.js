import chai from 'chai';
import { auth, logics } from '../../../utils';
import { userController } from '../../../controllers';
import { schemas } from '../../helper';

const { expect } = chai;

describe('User login controller', function () {
	this.timeout(0);
	this.slow(1000);

	it('user login => should success', async () => {
		let userId;
		try {
			const { token, user } = await userController.login(null, {
				username: 'test-user',
				password: '123abc4567',
			});

			expect(token).to.be.a('string');

			schemas.userSchema.shouldNotHave.forEach((property) => {
				expect(user).to.not.have.property(property);
			});

			Object.keys(schemas.userSchema.shouldHave).forEach((property) => {
				expect(user).to.have.property(property);
			});

			userId = user.id;
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (userId) await auth.signOut(userId);
		}
	});

	it('user login => should fail', async () => {
		try {
			await userController
				.login(null, {
					username: 'test-user',
					password: 'wrong-password',
				})
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Not Authenticated');
				});

			await userController
				.login(null, {
					username: 'test-user',
				})
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Password is a required field');
				});

			await userController
				.login(null, {
					password: '123abc4567',
				})
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Username is a required field');
				});

			await userController
				.login(null, {
					username: 'test-user',
					password: '',
				})
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Password cannot be an empty field');
				});

			await userController
				.login(null, {
					username: '',
					password: '123abc4567',
				})
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Username cannot be an empty field');
				});
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});
});
