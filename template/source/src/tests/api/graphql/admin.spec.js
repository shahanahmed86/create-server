import chai from 'chai';
import chaiHttp from 'chai-http';
import { adminAuth } from './queries';
import { auth } from '../../../utils';
import { schemas } from '../../helper';

chai.use(chaiHttp);

const { expect } = chai;

describe('GRAPHQL -- Admin Authentication APIs', function () {
	this.timeout(0);
	this.slow(1000);

	it(`logout => Mutation => should success`, async () => {
		try {
			const { body } = await adminAuth.loginAdmin();
			const { token } = body.data.data;

			const { error, body: logoutBody } = await adminAuth.logoutAdmin(token);
			const text = logoutBody.data.data;

			expect(error).to.be.false;
			expect(text).to.be.a.string("You've successfully signed out.");
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});

	it(`loginAdmin => Mutation => should success`, async () => {
		let adminId;
		try {
			const { body, error } = await adminAuth.loginAdmin();
			const { token, admin } = body.data.data;

			expect(error).to.be.false;

			expect(token).to.be.a('string');

			schemas.adminSchema.shouldNotHave.forEach((property) => {
				expect(admin).to.not.have.property(property);
			});

			Object.entries(schemas.adminSchema.shouldHave).forEach(([property, type]) => {
				expect(admin).to.have.property(property);
			});

			adminId = admin.id;
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (adminId) await auth.signOut(adminId);
		}
	});

	it(`loggedInAdmin => Query => should success`, async () => {
		let adminId;
		try {
			const { body: loginBody } = await adminAuth.loginAdmin();
			const { token } = loginBody.data.data;

			const { body, error } = await adminAuth.loggedInAdmin(token);
			const admin = body.data.data;

			expect(error).to.be.false;

			expect(token).to.be.a('string');

			schemas.adminSchema.shouldNotHave.forEach((property) => {
				expect(admin).to.not.have.property(property);
			});

			Object.entries(schemas.adminSchema.shouldHave).forEach(([property, type]) => {
				expect(admin).to.have.property(property);
			});

			adminId = admin.id;
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (adminId) await auth.signOut(adminId);
		}
	});

	it(`changeAdminPassword => Mutation => should success`, async () => {
		let adminId;
		try {
			const { body: loginBody } = await adminAuth.loginAdmin();
			const { token, admin } = loginBody.data.data;

			adminId = admin.id;

			const { body, error } = await adminAuth.changeAdminPassword(token);
			const text = body.data.data;

			expect(error).to.be.false;
			expect(text).to.be.a.string('Password changed successfully');
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (adminId) await auth.signOut(adminId);
		}
	});

	it(`changeAdminPassword => Mutation => should success`, async () => {
		let adminId;
		try {
			const { body: loginBody } = await adminAuth.loginAdmin({
				username: 'shahan',
				password: '123abc456',
			});
			const { token, admin } = loginBody.data.data;

			adminId = admin.id;

			const { body, error } = await adminAuth.changeAdminPassword(token, {
				oldPassword: '123abc456',
				password: 'shahan',
			});
			const text = body.data.data;

			expect(error).to.be.false;
			expect(text).to.be.a.string('Password changed successfully');
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		} finally {
			if (adminId) await auth.signOut(adminId);
		}
	});
});
