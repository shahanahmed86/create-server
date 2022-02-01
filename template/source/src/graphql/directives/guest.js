import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';
import { middleware } from '../../controllers';
import { logics } from '../../utils';

function GuestDirective(schema, directiveName) {
	return mapSchema(schema, {
		[MapperKind.OBJECT_FIELD]: (field) => {
			const guestDirective = getDirective(schema, field, directiveName);

			if (guestDirective && guestDirective[0]) {
				const { resolve = defaultFieldResolver } = field;

				field.resolve = async (...args) => {
					try {
						const token = args[2].req.get('Authorization') || args[2].req.headers.Authorization;
						await middleware.ensureSignOut(guestDirective[0], token);
					} catch (error) {
						const { statusCode, errorMessage } = logics.catchError(error);
						switch (statusCode) {
							case '401': {
								throw new AuthenticationError(errorMessage);
							}
							default: {
								throw new ApolloError(errorMessage);
							}
						}
					}

					return resolve.apply(this, args);
				};
				return field;
			}
		},
	});
}

export default GuestDirective;
