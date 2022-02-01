import fs from 'fs';
import { promisify } from 'util';
import { copyFiles, executeCommand } from './helper';

const access = promisify(fs.access);

export async function createProject(options, templateDir) {
	try {
		await access(templateDir, fs.constants.R_OK);
	} catch (err) {
		executeCommand(`echo "\n\\e[1;31m ...${err.message}... \\e[0m"`);

		process.exit(1);
	}

	await copyFiles(options.templateDirectory, options.targetDirectory);

	return true;
}
