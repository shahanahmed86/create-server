import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, redis } from '../../library';
import { JWT_SECRET } from '../../config';
import { validations } from '../../utils';

async function login(root, args, ctx) {
	await validations.validate(validations.schemas.admin.login, args);

	const admin = await prisma.admin.findFirst({ where: { username: args.username } });
	if (!admin || !bcrypt.compareSync(args.password, admin.password)) {
		throw new Error('401;;Not Authenticated');
	}

	const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '1h' });

	await redis.set(admin.id, `Bearer ${token}`);

	return { token, admin: validations.excludePropsFromAdmin(admin) };
}

export default login;
