import { logics } from '../../utils';

async function me(root, args, ctx) {
	return logics.excludePropsFromUser(ctx.req.user);
}

export default me;
