import moment from 'moment';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { redis } from '../library';
import RootUtils from './root';

class Logics extends RootUtils {
	async validateToken(receivedToken, key) {
		if (!receivedToken) throw new Error('401;;You need to sign in.');

		const [, token] = receivedToken.split(' ');
		if (!token) throw new Error('401;;Token is malformed');

		const decoded = jwt.verify(token, JWT_SECRET);

		const savedToken = await this.getToken(decoded[key]);
		if (savedToken !== receivedToken) throw new Error('401;;Invalid token found.');

		const now = Date.now() / 1000;
		if (decoded.exp < now) throw new Error('401;;Session Expired.');

		return decoded;
	}

	getToken(tokenKey) {
		return redis.get(tokenKey);
	}

	getZeroTimeZoneDate(date = moment().toISOString()) {
		const dt = moment(date).toISOString();
		return `${dt.split('.')[0]}.000Z`;
	}
}

export default new Logics();
