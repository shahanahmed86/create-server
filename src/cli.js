import path from 'path';
import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';
import {
	copyFiles,
	databaseValidator,
	executeCommand,
	projectValidator,
	repositoryValidator
} from './helper';

function parseArgumentsIntoOptions(rawArgs) {
	const args = arg(
		{
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
		git: args['--git'] || false,
		install: args['--install'] || false,
		dockerize: args['--dockerize'] || false,
		database: args._[0]
	};
}

async function promptForMissingOptions(options) {
	const questions = [
		{
			type: 'input',
			name: 'project',
			message: 'Please enter the name of the project: '
		},
		{
			type: 'input',
			name: 'repository',
			message: "Please enter the Repository's URL: "
		}
	];
	if (!options.database) {
		questions.push({
			type: 'list',
			name: 'database',
			message: 'Please choose which database to use',
			choices: ['mysql', 'postgresql'],
			default: 'mysql'
		});
	}

	if (!options.git) {
		questions.push({
			type: 'confirm',
			name: 'git',
			message: 'Initialize a git repository?',
			default: true
		});
	}

	if (!options.install) {
		questions.push({
			type: 'confirm',
			name: 'install',
			message: 'Do you wanna install it?',
			default: true
		});
	}

	if (!options.dockerize) {
		questions.push({
			type: 'confirm',
			name: 'dockerize',
			message: 'Do you wanna dockerize it?',
			default: true
		});
	}

	const answers = await inquirer.prompt(questions);

	try {
		projectValidator(options.project || answers.project);
		repositoryValidator(options.repository || answers.repository);
		databaseValidator(options.database || answers.database);
	} catch (error) {
		executeCommand(`echo "\n\\e[1;31m ...${error.message}... \\e[0m"`);

		process.exit(1);
	}
	return {
		...options,
		database: options.database || answers.database,
		git: options.git || answers.git,
		install: options.install || answers.install,
		dockerize: options.dockerize || answers.dockerize,
		project: answers.project,
		repository: answers.repository
	};
}

export async function cli(args) {
	let options = parseArgumentsIntoOptions(args);
	options = await promptForMissingOptions(options);

	const targetDirectory = process.cwd();
	const currentFileUrl = new URL(import.meta.url).pathname;
	const templateDirectory = path.resolve(currentFileUrl, '../../template/source');

	const { dockerize, git, install, database, repository, project } = options;

	const isTargetDirNotEmpty =
		executeCommand(
			`[ "$(ls -A ${targetDirectory})" ] && echo true || echo false`,
			false,
			'pipe'
		) === 'true';

	if (isTargetDirNotEmpty) {
		executeCommand(`echo "\n\\e[1;31m ...target folder is not empty... \\e[0m"`);

		process.exit(1);
	}

	await createProject(templateDirectory, targetDirectory);

	// changing name of gitignore file by prefix "."
	let cmd = `cd ${targetDirectory}; mv gitignore .gitignore;`;

	// applying provided project name to package.json
	const currentProject = 'project_name';
	cmd += `sed -i -e 's,${currentProject},${project},g' package.json;`;

	// applying provided repository name to package.json
	const currentRepo = 'repository_name';
	cmd += `sed -i -e 's,${currentRepo},${repository},g' package.json`;

	executeCommand(cmd);

	cmd = `cd ${targetDirectory}; node setup ${database} --yes`;

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
}
