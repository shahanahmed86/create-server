import { gql } from 'apollo-server-express';

const rootSchema = gql`
	scalar Date

	directive @auth(shouldAdmin: Boolean = false, shouldUser: Boolean = false) on FIELD_DEFINITION
	
	directive @guest(shouldAdmin: Boolean = false, shouldUser: Boolean = false) on FIELD_DEFINITION

	type Query {
		_: Boolean
	}

	type Mutation {
		_: Boolean
	}

	type Subscription {
		_: Boolean
	}

	type Status {
		success: Boolean!
		message: String!
		debugMessage: String
	}
`;

export default rootSchema;
