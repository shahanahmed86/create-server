import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT, JWT_SECRET } from '../../config';
import { prisma, redis } from '../../library';
import { file, logics, validations } from '../../utils';

async function signup(root, data, ctx) {
	await validations.validate(validations.schemas.user.signup, data);

	const { username, avatar } = data;

	const userFound = await prisma.user.findFirst({ where: logics.includePreWhere({ username }) });
	if (userFound) throw new Error('409;;User already exists with this username');

	data.password = bcrypt.hashSync(data.password, BCRYPT_SALT);
	data.avatar = await file.moveImageFromTmp(avatar);

	data.createdAt = logics.getZeroTimeZoneDate();
	data.updatedAt = logics.getZeroTimeZoneDate();

	const user = await prisma.user.create({ data });

	const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

	await redis.set(user.id, `Bearer ${token}`);

	return { token, user: logics.excludePropsFromUser(user) };
}

export default signup;
