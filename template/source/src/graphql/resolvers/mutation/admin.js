import { adminController } from '../../../controllers';
import { graphqlWrapper } from '../../../utils';

const admin = {
	loginAdmin: (...args) => graphqlWrapper(args, adminController.login),
	logoutAdmin: (...args) => graphqlWrapper(args, adminController.logout),
	changeAdminPassword: (...args) => graphqlWrapper(args, adminController.changePassword),
};

export default admin;
