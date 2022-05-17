import path from 'path';
import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';
import { executeCommand, projectValidator, repositoryValidator } from './helper';

function parseArgumentsIntoOptions(args) {
	const rawArgs = arg(
		{
			'--yes': Boolean,
			'--install': Boolean,
			'-y': '--yes',
			'-i': '--install'
		},
		{
			argv: args.slice(2)
		}
	);
	return {
		install: rawArgs['--install'] || false,
		args: rawArgs._[0]
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
		},
		{
			type: 'input',
			name: 'imageName',
			message: "Please enter the Docker Image's name: "
		}
	];

	if (!options.install) {
		questions.push({
			type: 'confirm',
			name: 'install',
			message: 'Do you wanna install it?',
			default: true
		});
	}

	const answers = await inquirer.prompt(questions);

	try {
		projectValidator(options.imageName || answers.imageName);
		projectValidator(options.project || answers.project);
		repositoryValidator(options.repository || answers.repository);
	} catch (error) {
		executeCommand(`echo "\n\\e[1;31m ...${error.message}... \\e[0m"`);

		process.exit(1);
	}
	return {
		...options,
		install: options.install || answers.install,
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

	const { install, repository, project, imageName } = options;

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
	cmd += `mv .husky/gitignore .husky/.gitignore`;

	// applying provided project name to package.json
	const currentProject = 'project_name';
	cmd += `&& sed -i -e 's,${currentProject},${project},g' package.json`;

	// applying provided repository name to package.json
	const currentRepo = 'repository_name';
	cmd += `&& sed -i -e 's,${currentRepo},${repository},g' package.json`;

	// applying provided image name
	const currentImage = '<your_username>/image:tag';
	cmd += `&& sed -i -e 's,${currentImage},${imageName},g' docker-compose.prod.yml`;

	executeCommand(cmd);

	cmd = `&& cd ${targetDirectory}; node setup --yes`;

	if (install) executeCommand(cmd);
}
