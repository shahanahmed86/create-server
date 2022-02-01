import chai from 'chai';
import { auth, logics } from '../../utils';
import { userController } from '../../controllers';
import { common, schemas } from '../helper';

const { expect } = chai;

describe('User signup controller', function () {
	this.timeout(0);
	this.slow(1000);
	
	it('user signup => should success', async () => {
		let userId;
		try {
			const { body, error } = await common.uploadImage();
			expect(error).to.be.false;

			const { token, user } = await userController.signup(null, {
				username: 'shahanahmed86',
				password: '123abc456',
				avatar: body.path,
				fullName: 'Shahan Ahmed Khan',
				email: 'shahan.khaan@gmail.com',
				cell: '00923362122588',
				gender: 'MALE',
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

	it('user signup => should failed', async () => {
		try {
			await userController
				.signup(null, { username: 'shahanahmed86', password: '123abc456' })
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('User already exists with this username');
				});

			await userController.signup(null, { password: '123abc456' }).catch((error) => {
				const { errorMessage } = logics.catchError(error);
				expect(errorMessage).to.be.a.string('Username is a required field');
			});

			await userController.signup(null, { username: '', password: '123abc456' }).catch((error) => {
				const { errorMessage } = logics.catchError(error);
				expect(errorMessage).to.be.a.string('Username cannot be an empty field');
			});

			await userController.signup(null, { username: 'shahanahmed86' }).catch((error) => {
				const { errorMessage } = logics.catchError(error);
				expect(errorMessage).to.be.a.string('Password is a required field');
			});

			await userController
				.signup(null, { username: 'shahanahmed86', password: '' })
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Password cannot be an empty field');
				});

			await userController
				.signup(null, {
					username: 'shahanahmed87',
					password: '123abc456',
					avatar: 'temp/wrong-path.png',
				})
				.catch((error) => {
					const { errorMessage } = logics.catchError(error);
					expect(errorMessage).to.be.a.string('Image not found');
				});
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});
});
