import chai from 'chai';
import chaiHttp from 'chai-http';
import { userAuth } from './queries';
import { auth } from '../../../utils';
import { common, schemas } from '../../helper';

chai.use(chaiHttp);

const { expect } = chai;

describe('GRAPHQL -- User Authentication APIs', function () {
	this.timeout(0);
	this.slow(1000);

	it(`signup => Mutation => should success`, async () => {
		let userId;
		try {
			const { body: image } = await common.uploadImage();

			const { body, error } = await userAuth.signup({
				username: 'test-user-1',
				password: '123abc456',
				avatar: image.path,
				fullName: 'Shahan Ahmed Khan',
				cell: '00923131126908',
				email: 'shahan.ahmed@experia.ai',
				gender: 'FEMALE',
			});

			expect(error).to.be.false;

			const { token, user } = body.data.data;

			expect(token).to.be.a('string');

			schemas.userSchema.shouldNotHave.forEach((property) => {
				expect(user).to.not.have.property(property);
			});

			Object.entries(schemas.userSchema.shouldHave).forEach(([property, type]) => {
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

	it(`logoutUser => Mutation => should success`, async () => {
		try {
			const { body } = await userAuth.loginUser();
			const { token } = body.data.data;

			expect(token).to.be.a('string');

			const { error, text } = await userAuth.logoutUser(token);

			expect(error).to.be.false;
			expect(text).to.be.a.string("You've successfully signed out.");
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});

	it(`logoutUser => Mutation => should fail`, async () => {
		try {
			const { body } = await userAuth.logoutUser();
			const text = body.errors.map((error) => error.message).join(', ');

			expect(text).to.be.a.string('jwt malformed');
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});

	it(`loginUser => Mutation => should success`, async () => {
		let userId;
		try {
			const { body, error } = await userAuth.loginUser();

			expect(error).to.be.false;

			const { token, user } = body.data.data;

			expect(token).to.be.a('string');

			schemas.userSchema.shouldNotHave.forEach((property) => {
				expect(user).to.not.have.property(property);
			});

			Object.entries(schemas.userSchema.shouldHave).forEach(([property, type]) => {
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

	it(`loggedInUser => Query => should success`, async () => {
		let userId;
		try {
			const { body: loginBody } = await userAuth.loginUser();
			const { token } = loginBody.data.data;

			const { body, error } = await userAuth.loggedInUser(token);
			const user = body.data.data;

			expect(error).to.be.false;

			expect(token).to.be.a('string');

			schemas.userSchema.shouldNotHave.forEach((property) => {
				expect(user).to.not.have.property(property);
			});

			Object.entries(schemas.userSchema.shouldHave).forEach(([property, type]) => {
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

	it(`changeUserPassword => Mutation => should success`, async () => {
		let userId;
		try {
			const { body: loginBody } = await userAuth.loginUser();
			const { token, user } = loginBody.data.data;

			userId = user.id;

			expect(token).to.be.a('string');

			const { error, body } = await userAuth.changeUserPassword(token, {
				oldPassword: '123abc456',
				password: 'shahan1',
			});
			const text = body.data.data;

			expect(error).to.be.false;
			expect(text).to.be.a.string('Password changed successfully');
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (userId) await auth.signOut(userId);
		}
	});

	it(`changeUserPassword => Mutation => should success`, async () => {
		let userId;
		try {
			const { body: loginBody } = await userAuth.loginUser({
				username: 'test-user-1',
				password: 'shahan1',
			});
			const { token, user } = loginBody.data.data;

			userId = user.id;

			expect(token).to.be.a('string');

			const { error, body } = await userAuth.changeUserPassword(token, {
				oldPassword: 'shahan1',
				password: '123abc456',
			});
			const text = body.data.data;

			expect(error).to.be.false;
			expect(text).to.be.a.string('Password changed successfully');
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (userId) await auth.signOut(userId);
		}
	});
});
