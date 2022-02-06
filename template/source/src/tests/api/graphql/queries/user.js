import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../../';

chai.use(chaiHttp);

export function signup(variables) {
	return chai
		.request(app)
		.post(`/graphql`)
		.set('content-type', 'application/json')
		.send({
			query: `
				mutation(
					$username: String!
					$password: String!
					$avatar: String
					$fullName: String
					$email: String
					$cell: String
					$gender: Gender
				) {
					data: signup(
						username: $username
						password: $password
						avatar: $avatar
						fullName: $fullName
						email: $email
						cell: $cell
						gender: $gender
					) {
						token
						user {
							id
							username
							avatar
							fullName
							email
							cell
							gender
							signUpType
							createdAt
							updatedAt
						}
					}
				}			
      `,
			variables,
		});
}

export function loginUser(variables = { username: 'test-user-1', password: '123abc456' }) {
	return chai
		.request(app)
		.post(`/graphql`)
		.set('content-type', 'application/json')
		.send({
			query: `
				mutation($username: String!, $password: String!) {
					data: loginUser(username: $username, password: $password) {
						token
						user {
							id
							username
							avatar
							fullName
							email
							cell
							gender
							signUpType
							createdAt
							updatedAt
						}
					}
				}
      `,
			variables,
		});
}

export function logoutUser(token) {
	return chai
		.request(app)
		.post(`/graphql`)
		.set('content-type', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.send({
			query: `
				mutation {
					data: logoutUser
				}
      `,
		});
}

export function loggedInUser(token) {
	return chai
		.request(app)
		.post(`/graphql`)
		.set('content-type', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.send({
			query: `
				query {
					data: loggedInUser {
						id
						username
						avatar
						fullName
						email
						cell
						signUpType
						gender
						createdAt
						updatedAt
					}
				}
      `,
		});
}

export function changeUserPassword(
	token,
	variables = { oldPassword: '123abc456', password: 'shahan' },
) {
	return chai
		.request(app)
		.post(`/graphql`)
		.set('content-type', 'application/json')
		.set('Authorization', `Bearer ${token}`)
		.send({
			query: `
				mutation($oldPassword: String!, $password: String!) {
					data: changeUserPassword(oldPassword: $oldPassword, password: $password)
				}			
      `,
			variables,
		});
}
