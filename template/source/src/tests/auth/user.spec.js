import chai from 'chai';
import { BASE_URL } from '../../config';
import { userAuth, common } from '../helper';
import { auth, executeCommand } from '../../utils';
import chaiHttp from 'chai-http';
import app from '../..';

chai.use(chaiHttp);

const { expect } = chai;

describe('User Authentication routes APIs', function () {
	this.timeout(0);
	this.slow(1000);

	it(`${BASE_URL}/api/app/auth/signup => POST => should success`, async () => {
		let userId;
		try {
			const { body: image } = await common.uploadImage();

			const { body, error } = await chai
				.request(app)
				.post(`/api/app/auth/signup`)
				.set('content-type', 'application/json')
				.field('username', 'test-user')
				.field('password', '123abc456')
				.field('avatar', image.path)
				.field('fullName', 'Shahan Ahmed Khan')
				.field('cell', '00923362122588')
				.field('email', 'shahan.khaan@gmail.com')
				.field('gender', 'MALE');

			expect(error).to.be.false;
			['token', 'user'].map((prop) => expect(body).to.have.property(prop));
			expect(body.user).to.be.an('object');
			expect(body.user).not.have.property('password');
			['id', 'username', 'signUpType'].map((prop) => expect(body.user).to.have.property(prop));

			userId = body.user.id;
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (userId) await auth.signOut(userId);
		}
	});

	it(`${BASE_URL}/api/app/auth/logout => DEL => should success`, async () => {
		try {
			const { body } = await userAuth.login();

			const { error, text } = await userAuth.logout(body.token);

			expect(error).to.be.false;
			expect(text).to.be.a.string("You've successfully signed out.");
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});

	it(`${BASE_URL}/api/app/auth/logout => DEL => should fail`, async () => {
		try {
			const { error, text } = await userAuth.logout();

			expect(error).to.be.an.instanceOf(Error);
			expect(text).to.be.a.string('jwt malformed');
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});

	it(`${BASE_URL}/api/app/auth/login => POST => should success`, async () => {
		let userId;
		try {
			const { body, error } = await userAuth.login();

			expect(error).to.be.false;
			['token', 'user'].map((prop) => expect(body).to.have.property(prop));
			expect(body.user).to.be.an('object');
			expect(body.user).not.have.property('password');
			['id', 'username', 'signUpType'].map((prop) => expect(body.user).to.have.property(prop));

			userId = body.user.id;
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (userId) await auth.signOut(userId);
		}
	});

	it(`${BASE_URL}/api/app/auth/me => GET => should success`, async () => {
		let userId;
		try {
			const { body: loginBody } = await userAuth.login();

			const { body, error } = await userAuth.me(loginBody.token);

			expect(error).to.be.false;
			expect(body).to.be.an('object');
			expect(body).not.have.property('password');
			['id', 'username', 'signUpType'].map((prop) => expect(body).to.have.property(prop));

			userId = body.id;
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (userId) await auth.signOut(userId);
		}
	});

	it(`${BASE_URL}/api/app/auth/change-password => PUT => should success`, async () => {
		let userId;
		try {
			const { body: loginBody } = await userAuth.login();

			const { body: meBody, error: meError } = await userAuth.me(loginBody.token);

			expect(meError).to.be.false;
			userId = meBody.id;

			const { error, text } = await chai
				.request(app)
				.put('/api/app/auth/change-password')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${loginBody.token}`)
				.field('oldPassword', '123abc456')
				.field('password', 'shahan1');

			expect(error).to.be.false;
			expect(text).to.be.a.string('Password changed successfully');
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (userId) await auth.signOut(userId);
		}
	});

	it(`${BASE_URL}/api/app/auth/change-password => PUT => should success`, async () => {
		let userId;
		try {
			const { body: loginBody } = await userAuth.login('test-user', 'shahan1');

			const { body: meBody, error: meError } = await userAuth.me(loginBody.token);

			expect(meError).to.be.false;
			userId = meBody.id;

			const { error, text } = await chai
				.request(app)
				.put('/api/app/auth/change-password')
				.set('content-type', 'application/json')
				.set('Authorization', `Bearer ${loginBody.token}`)
				.field('oldPassword', 'shahan1')
				.field('password', '123abc456');

			expect(error).to.be.false;
			expect(text).to.be.a.string('Password changed successfully');
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (userId) await auth.signOut(userId);
		}
	});

	after(async () => {
		executeCommand('rm uploads/*.*');
	});
});
