import { logics } from '../../utils';

async function me(root, args, ctx) {
	return logics.excludePropsFromAdmin(ctx.req.user);
}

export default me;
