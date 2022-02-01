import bcrypt from 'bcryptjs';
import { prisma } from '../../library';
import { BCRYPT_SALT } from '../../config';
import { logics, validations } from '../../utils';

async function changePassword(root, args, ctx) {
	await validations.validate(validations.schemas.admin.changePassword, args);

	const admin = ctx.req.user;

	if (!bcrypt.compareSync(args.oldPassword, admin.password)) {
		throw new Error('409;;Old password mismatched');
	}

	if (bcrypt.compareSync(args.password, admin.password)) {
		throw new Error('409;;Your new password cannot be same as the old one');
	}

	const data = {
		password: bcrypt.hashSync(args.password, BCRYPT_SALT),
		updatedAt: logics.getZeroTimeZoneDate(),
	};

	await prisma.admin.update({ where: { id: ctx.req.user.id }, data });

	return 'Password changed successfully';
}

export default changePassword;
