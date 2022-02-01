import Joi from 'joi';
import RootUtils from './root';

class Validations extends RootUtils {
	constructor() {
		super();

		this.schemas = {
			admin: {
				login: Joi.object().keys({
					username: this.allSchemas.username,
					password: this.allSchemas.password,
				}),
				changePassword: Joi.object().keys({
					oldPassword: this.allSchemas.oldPassword,
					password: this.allSchemas.password,
				}),
			},
			user: {
				login: Joi.object().keys({
					username: this.allSchemas.username,
					password: this.allSchemas.password,
				}),
				changePassword: Joi.object().keys({
					oldPassword: this.allSchemas.oldPassword,
					password: this.allSchemas.password,
				}),
				signup: Joi.object().keys({
					username: this.allSchemas.username,
					password: this.allSchemas.password,
					avatar: this.allSchemas.avatar,
					fullName: this.allSchemas.fullName,
					email: this.allSchemas.email,
					cell: this.allSchemas.cell,
					gender: this.allSchemas.gender,
				}),
			},
		};
	}
}

export default new Validations();
