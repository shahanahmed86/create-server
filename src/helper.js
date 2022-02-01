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