import chai from 'chai';
import { auth, logics } from '../../utils';
import { adminController } from '../../controllers';
import { schemas } from '../helper';

const { expect } = chai;

describe('Admin login controller', function () {
	this.timeout(0);
	this.slow(1000);

	it('admin login => should success', async () => {
		let adminId;
		try {
			const { token, admin } = await adminController.login(null, {
				username: 'shahan',
				password: 'shahan',
			});

			expect(token).to.be.a('string');

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

	it('admin login => should fail', async () => {
		try {
			await adminController
				.login(null, {
					username: 'shahan',
					password: '123abc456',
				})
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Not Authenticated');
				});

			await adminController
				.login(null, {
					username: 'shahan',
				})
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Password is a required field');
				});

			await adminController
				.login(null, {
					password: 'shahan',
				})
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Username is a required field');
				});

			await adminController
				.login(null, {
					username: 'shahan',
					password: '',
				})
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Password cannot be an empty field');
				});

			await adminController
				.login(null, {
					username: '',
					password: 'shahan',
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
