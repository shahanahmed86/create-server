import { prisma } from '../library';
import { logics } from '../utils';

export async function ensureSignIn({ shouldAdmin, shouldUser }, receivedToken) {
	let key;
	if (shouldAdmin) key = 'adminId';
	else if (shouldUser) key = 'userId';

	const decoded = await logics.validateToken(receivedToken, key);

	let data;
	if (shouldAdmin && decoded.adminId) {
		const admin = await prisma.admin.findFirst({
			where: logics.includePreWhere({ id: decoded.adminId }),
		});
		if (!admin) throw new Error('401;;Not Authenticated');

		data = { ...admin, type: 'admin' };
	} else if (shouldUser && decoded.userId) {
		const user = await prisma.user.findFirst({
			where: logics.includePreWhere({ id: decoded.userId }),
		});
		if (!user) throw new Error('401;;Not Authenticated');

		data = { ...user, type: 'user' };
	} else {
		throw new Error('401;;Not Authenticated');
	}

	return data;
}

export async function ensureSignOut(args, receivedToken) {
	if (receivedToken) throw new Error('401;;You need to sign out.');
}
