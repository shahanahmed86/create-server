import cp from 'child_process';
import ncp from 'ncp';
import { promisify } from 'util';

const copy = promisify(ncp);

export function executeCommand(cmd, exit = false, stdio = 'inherit') {
	const result = cp.spawnSync(cmd, {
		cwd: process.cwd(),
		env: process.env,
		stdio,
		shell: true,
		encoding: 'utf8'
	});

	if (result.status || exit) process.exit(result.status);
	else {
		if (stdio === 'pipe') return result.stdout.replace('\n', '');
		else return true;
	}
}

export async function copyFiles(template, target) {
	return copy(template, target, { clobber: false });
}

export function projectValidator(input) {
	if (!input) throw new Error('project name is mandatory');
	if (/\s/g.test(input)) throw new Error('Spaces are not allowed');
}

export function repositoryValidator(input) {
	if (!input) throw new Error(`repository URL is mandatory`);

	const isGitUrl =
		/((git@|http(s)?:\/\/)([\w\.@]+)(\/|:))([\w,\-,\_]+)\/([\w,\-,\_]+)(.git){0,1}((\/){0,1})/;

	if (!isGitUrl.test(input)) {
		throw new Error(
			`repository URL should be a git repo link i.e.: https://github.com/username/repo.git`
		);
	}
}

export function databaseValidator(input) {
	if (!['mysql', 'postgresql'].some((db) => db === input)) {
		throw new Error('Only mysql or postgresql are allowed');
	}
}
