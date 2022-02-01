import { auth } from '../../utils';

function logout(_, __, { req }) {
	return auth.signOut(req.user.id);
}

export default logout;
