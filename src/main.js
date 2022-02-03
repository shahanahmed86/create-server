import fs from 'fs';
import { promisify } from 'util';
import { copyFiles, executeCommand } from './helper';

const access = promisify(fs.access);

export async function createProject(templateDirectory, targetDirectory) {
	try {
		await access(templateDirectory, fs.constants.R_OK);
	} catch (err) {
		executeCommand(`echo "\n\\e[1;31m ...${err.message}... \\e[0m"`);

		process.exit(1);
	}

	await copyFiles(templateDirectory, targetDirectory);

	return true;
}
