import cp from 'child_process';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import logics from './logics';
import { prisma } from '../library';

export const restWrapper = async function ([req, res], controller) {
	try {
		const root = null;
		let args = { ...req.query, ...req.params };
		if (req.body) args = { ...args, ...req.body };

		const result = await controller(root, args, { req, res });
		res.status(200).send(result);
	} catch (error) {
		const { statusCode, errorMessage } = logics.catchError(error);
		res.status(statusCode).send(errorMessage);
	} finally {
		await prisma.$disconnect();
	}
};

export const graphqlWrapper = async function (args, controller) {
	try {
		const result = await controller(...args);
		return result;
	} catch (error) {
		const { statusCode, errorMessage } = logics.catchError(error);
		switch (statusCode) {
			case '401': {
				throw new AuthenticationError(errorMessage);
			}
			default: {
				throw new ApolloError(errorMessage);
			}
		}
	} finally {
		await prisma.$disconnect();
	}
};

export const catchAsync =
	(handler) =>
	async (...args) => {
		const [, res] = args;
		try {
			const result = await handler(...args);
			if (result instanceof Buffer) res.status(200).send(result);
			else res.status(200).json(result);
		} catch (error) {
			const { statusCode, errorMessage } = logics.catchError(error);
			res.status(statusCode).send(errorMessage);
		}
	};

export function executeCommand(cmd, exit = false, stdio = 'inherit') {
	const result = cp.spawnSync(cmd, {
		cwd: process.cwd(),
		env: process.env,
		stdio,
		shell: true,
		encoding: 'utf8',
	});

	if (result.status || exit) process.exit(result.status);
	else {
		if (stdio === 'pipe') return result.stdout.replace('\n', '');
		else return true;
	}
}
