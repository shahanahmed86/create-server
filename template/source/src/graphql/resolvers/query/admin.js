import { adminController } from '../../../controllers';
import { graphqlWrapper } from '../../../utils';

const admin = {
	loggedInAdmin: (...args) => graphqlWrapper(args, adminController.me),
};

export default admin;
