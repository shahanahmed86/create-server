import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../../';

chai.use(chaiHttp);

export function loginAdmin(variables = { username: 'shahan', password: 'shahan' }) {
	return chai
		.request(app)
		.post(`/graphql`)
		.set('content-type', 'application/json')
		.send({
			query: `
				mutation ($username: String!, $password: String!) {
					data: loginAdmin(username: $username, password: $password) {
						token
						admin {
							id
							username
							role
							createdAt
							updatedAt
						}
					}
				}
      `,
			variables,
		});
}

export function logoutAdmin(token) {
	return chai
		.request(app)
		.post(`/graphql`)
		.set('content-type', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.send({
			query: `
				mutation {
					data: logoutAdmin
				}
      `,
		});
}

export function loggedInAdmin(token) {
	return chai
		.request(app)
		.post(`/graphql`)
		.set('content-type', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.send({
			query: `
				query {
					data: loggedInAdmin {
						id
						username
						role
						createdAt
						updatedAt
					}
				}
      `,
		});
}

export function changeAdminPassword(
	token,
	variables = { oldPassword: 'shahan', password: '123abc456' },
) {
	return chai
		.request(app)
		.post(`/graphql`)
		.set('content-type', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.send({
			query: `
				mutation ($oldPassword: String!, $password: String!) {
					data: changeAdminPassword(oldPassword: $oldPassword, password: $password)
				}
      `,
			variables,
		});
}
