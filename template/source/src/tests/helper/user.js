import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../..';

chai.use(chaiHttp);

export function login(username = 'test-user', password = '123abc456') {
	return chai
		.request(app)
		.post(`/api/app/auth/login`)
		.set('content-type', 'application/json')
		.field('username', username)
		.field('password', password);
}

export function me(token) {
	return chai
		.request(app)
		.get(`/api/app/auth/me`)
		.set('content-type', 'application/json')
		.set('Authorization', `Bearer ${token}`);
}

export function logout(token) {
	return chai
		.request(app)
		.delete(`/api/app/auth/logout`)
		.set('content-type', 'application/json')
		.set('Authorization', `Bearer ${token}`);
}
