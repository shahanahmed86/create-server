import Redis from 'ioredis';

import { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } from '../config';

const redis = new Redis({
	host: REDIS_HOST,
	port: REDIS_PORT,
	username: REDIS_USERNAME,
	password: REDIS_PASSWORD,
});

export default redis;
