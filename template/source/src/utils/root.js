import Joi from 'joi';

function messages(type) {
	return {
		'string.base': `${type} should be a type of 'text'`,
		'string.empty': `${type} cannot be an empty field`,
		'string.min': `${type} should have a minimum length of {#limit}`,
		'string.max': `${type} should have a maximum length of {#limit}`,
		'any.required': `${type} is a required field`,
	};
}

class RootUtils {
	constructor() {
		this.allSchemas = {
			username: Joi.string()
				.min(3)
				.max(50)
				.disallow(null)
				.required()
				.messages(messages('Username')),

			password: Joi.string()
				.min(6)
				.max(50)
				.disallow(null)
				.required()
				.messages(messages('Password')),

			oldPassword: Joi.string()
				.min(6)
				.max(50)
				.disallow(null)
				.required()
				.messages(messages('Old Password')),

			avatar: Joi.string().allow(null).disallow('').optional().messages(messages('Avatar')),

			fullName: Joi.string().allow(null).disallow('').optional().messages(messages('Full Name')),

			email: Joi.string().email().allow(null).disallow('').optional().messages(messages('Email')),

			cell: Joi.string()
				.min(10)
				.max(14)
				.pattern(/^\d+$/)
				.allow(null)
				.disallow('')
				.optional()
				.messages({
					...messages('Cell #'),
					'string.pattern.base': 'Cell number is not properly formatted',
				}),

			gender: Joi.string()
				.uppercase()
				.allow(null)
				.disallow('')
				.optional()
				.messages(messages('Gender')),
		};
	}

	validate(schema, payload) {
		return schema.validateAsync(payload, { abortEarly: false });
	}

	get uuid() {
		return Date.now();
	}

	includePreWhere(where = {}) {
		where.isDeleted = { not: true };
		return where;
	}

	excludePropsFromAdmin({ password, isDeleted, ...admin }) {
		return admin;
	}

	excludePropsFromUser({ password, isDeleted, ...user }) {
		return user;
	}

	catchError(error) {
		let statusCode = 409;
		let errorMessage = 'Something went wrong';

		if (error.message.indexOf(';;') === -1) errorMessage = error.message;
		else [statusCode, errorMessage] = error.message.split(';;');

		return { statusCode, errorMessage };
	}
}

export default RootUtils;
