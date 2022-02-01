import { redis } from '../library';
import RootUtils from './root';

class Auth extends RootUtils {
	signOut(tokenKey) {
		return new Promise((resolve, reject) => {
			redis
				.del(tokenKey)
				.then(() => resolve("You've successfully signed out."))
				.catch(reject);
		});
	}
}

export default new Auth();
