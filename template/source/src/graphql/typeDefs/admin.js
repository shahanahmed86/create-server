import { gql } from 'apollo-server-express';

const adminSchema = gql`
  type Admin {
    id: ID!
    username: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type AuthAdmin {
    token: String!
    admin: Admin!
  }

	extend type Query {
		loggedInAdmin: Admin! @auth(shouldAdmin: true)
	}

	extend type Mutation {
		loginAdmin(username: String!, password: String!): AuthAdmin! @guest(shouldAdmin: true)
    logoutAdmin: String! @auth(shouldAdmin: true)
    changeAdminPassword(oldPassword: String!, password: String!): String! @auth(shouldAdmin: true)
	}
`;

export default adminSchema;
