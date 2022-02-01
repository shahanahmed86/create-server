import path from 'path';
import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';
import { copyFiles, executeCommand } from './helper';

function parseArgumentsIntoOptions(rawArgs) {
	const args = arg(
		{
			'--yes': Boolean,
			'--git': Boolean,
			'--install': Boolean,
			'--dockerize': Boolean,
			'-g': '--git',
			'-y': '--yes',
			'-i': '--install',
			'-d': '--dockerize'
		},
		{
			argv: rawArgs.slice(2)
		}
	);
	return {
		skipPrompts: args['--yes'] || false,
		git: args['--git'] || false,
		install: args['--install'] || false,
		dockerize: args['--dockerize'] || false,
		database: args._[0]
	};
}

async function promptForMissingOptions(options) {
	const defaultDatabase = 'mysql';
	if (options.skipPrompts) {
		return {
			...options,
			database: options.database || defaultDatabase
		};
	}

	const questions = [];
	if (!options.database) {
		questions.push({
			type: 'list',
			name: 'database',
			message: 'Please choose which database to use',
			choices: ['mysql', 'postgresql'],
			default: defaultDatabase
		});
	}

	if (!options.git) {
		questions.push({
			type: 'confirm',
			name: 'git',
			message: 'Initialize a git repository?',
			default: false
		});
	}

	if (!options.install) {
		questions.push({
			type: 'confirm',
			name: 'install',
			message: 'Do you wanna install it?',
			default: false
		});
	}

	if (!options.dockerize) {
		questions.push({
			type: 'confirm',
			name: 'dockerize',
			message: 'Do you wanna dockerize it?',
			default: false
		});
	}

	const answers = await inquirer.prompt(questions);
	return {
		...options,
		database: options.database || answers.database,
		git: options.git || answers.git,
		install: options.install || answers.install,
		dockerize: options.dockerize || answers.dockerize
	};
}

export async function cli(args) {
	let options = parseArgumentsIntoOptions(args);
	options = await promptForMissingOptions(options);

	options.targetDirectory = options.targetDirectory || process.cwd();

	const currentFileUrl = import.meta.url;

	const templateDir = path.resolve(new URL(currentFileUrl).pathname, '../../template/source');
	options.templateDirectory = templateDir;

	const { templateDirectory, targetDirectory, dockerize, git, install, database } = options;

	const isTargetDirNotEmpty =
		executeCommand(
			`[ "$(ls -A ${targetDirectory})" ] && echo true || echo false`,
			false,
			'pipe'
		) === 'true';

	if (isTargetDirNotEmpty) {
		executeCommand(`echo "\n\\e[1;32m ...target folder is not empty... \\e[0m"`);

		process.exit(1);
	}

	await createProject(options, templateDir);

	let cmd = `cd ${targetDirectory}; node setup ${database} --yes`;

	if (dockerize) {
		cmd += ' --dockerize';

		await copyFiles(
			`${templateDirectory}/../docker-compose-${database}.yml`,
			`${targetDirectory}/docker-compose.yml`
		);

		await copyFiles(
			`${templateDirectory}/../docker-compose-${database}.test.yml`,
			`${targetDirectory}/docker-compose.test.yml`
		);
	}

	if (git) cmd += ' --git';

	if (install) executeCommand(cmd);

	executeCommand(`cd ${targetDirectory}; mv gitignore .gitignore`);
}
