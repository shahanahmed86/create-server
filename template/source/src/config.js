import 'dotenv/config';

export const {
	NODE_ENV = 'development',

	APP_PROTOCOL = 'http:',
	APP_HOST = 'localhost:4000',

	REDIS_HOST = 'localhost',
	REDIS_USERNAME = 'redis_username',
	REDIS_PASSWORD = 'redis_secret',

	JWT_SECRET = 'jwt_secret',

	SMTP_HOST = 'smtp.gmail.com',
	SMTP_USER,
	SMTP_PASS,
} = process.env;

export const APP_PORT = +process.env.APP_PORT || 4000;

export const IN_PROD = NODE_ENV === 'production';

export const BCRYPT_SALT = +process.env.BCRYPT_SALT || 10;

export const REDIS_PORT = +process.env.REDIS_PORT || 6379;

export const SMTP_PORT = +process.env.SMTP_PORT || 587;

export const IS_NODEMAILER_SECURE = SMTP_PORT === 465;

export const BASE_URL = `${APP_PROTOCOL}//${APP_HOST}`;
