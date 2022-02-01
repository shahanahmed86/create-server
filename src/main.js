import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { copyFiles } from './helper';

const access = promisify(fs.access);

export async function createProject(options) {
	options.targetDirectory = options.targetDirectory || process.cwd()

	const currentFileUrl = import.meta.url;
	const templateDir = path.resolve(new URL(currentFileUrl).pathname, '../../template/source');
	options.templateDirectory = templateDir;

	try {
		await access(templateDir, fs.constants.R_OK);
	} catch (err) {
		console.error('Invalid template name');
		process.exit(1);
	}

	await copyFiles(options.templateDirectory, options.targetDirectory);

	return true;
}
