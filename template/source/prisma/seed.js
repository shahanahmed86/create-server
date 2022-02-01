import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { BCRYPT_SALT } from '../src/config';
import { logics } from '../src/utils';

const prisma = new PrismaClient();

(async () => {
	try {
		const username = 'shahan';
		const data = {
			username,
			password: bcrypt.hashSync('shahan', BCRYPT_SALT),
			role: 'SYSTEM',
			createdAt: logics.getZeroTimeZoneDate(),
			updatedAt: logics.getZeroTimeZoneDate(),
		};
		let user = await prisma.admin.findFirst({ where: { username } });
		if (!user) user = await prisma.admin.create({ data });
		else user = await prisma.admin.update({ where: { id: user.id }, data });

		delete user.password;
		console.log('prisma seeds.......... : ', user);
		return user;
	} catch (error) {
		console.error(error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
		process.exit(0);
	}
})();
