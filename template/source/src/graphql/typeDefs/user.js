import { gql } from 'apollo-server-express';

const userSchema = gql`
  type User {
    id: ID!
    username: String
    avatar: String
    fullName: String
    email: String
    cell: String
    gender: Gender
    signUpType: SignUpType!
    createdAt: Date!
    updatedAt: Date!
  }

  enum SignUpType {
    LOCAL
    FACEBOOK
    GOOGLE
  }

  enum Gender {
    MALE
    FEMALE
    PREFER_NOT_TO_SAY
  }

  type AuthUser {
    token: String!
    user: User!
  }

	extend type Query {
		loggedInUser: User! @auth(shouldUser: true)
	}

	extend type Mutation {
		loginUser(username: String!, password: String!): AuthUser! @guest(shouldUser: true)
    logoutUser: String! @auth(shouldUser: true)
    changeUserPassword(oldPassword: String!, password: String!): String! @auth(shouldUser: true)
    signup(
      username: String!
      password: String!
      avatar: String
      fullName: String
      email: String
      cell: String
      gender: Gender
    ): AuthUser! @guest(shouldUser: true)
	}
`;

export default userSchema;
