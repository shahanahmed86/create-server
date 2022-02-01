import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, redis } from '../../library';
import { JWT_SECRET } from '../../config';
import { logics, validations } from '../../utils';

async function login(root, args, ctx) {
	await validations.validate(validations.schemas.user.login, args);

	const user = await prisma.user.findFirst({
		where: logics.includePreWhere({ username: args.username }),
	});
	if (!user || !bcrypt.compareSync(args.password, user.password)) {
		throw new Error('401;;Not Authenticated');
	}

	const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

	await redis.set(user.id, `Bearer ${token}`);

	return { token, user: logics.excludePropsFromUser(user) };
}

export default login;
