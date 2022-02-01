import { userController } from '../../../controllers';
import { graphqlWrapper } from '../../../utils';

const user = {
	loginUser: (...args) => graphqlWrapper(args, userController.login),
	logoutUser: (...args) => graphqlWrapper(args, userController.logout),
	changeUserPassword: (...args) => graphqlWrapper(args, userController.changePassword),
	signup: (...args) => graphqlWrapper(args, userController.signup),
};

export default user;
