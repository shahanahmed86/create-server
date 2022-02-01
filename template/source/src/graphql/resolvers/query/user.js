import { userController } from '../../../controllers';
import { graphqlWrapper } from '../../../utils';

const user = {
	loggedInUser: (...args) => graphqlWrapper(args, userController.me),
};

export default user;
