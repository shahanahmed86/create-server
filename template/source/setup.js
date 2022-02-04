const cp = require('child_process');
const fs = require('fs');

const isFirst = !fs.existsSync('node_modules');
shouldInstallModules();

const inquirer = require('inquirer');
const arg = require('arg');

const rawArgs = arg(
	{
		'--yes': Boolean,
		'--force-reinstall': Boolean,
		'--git': Boolean,
		'--dockerize': Boolean,
		'-y': '--yes',
		'-f': '--force-reinstall',
		'-g': '--git',
		'-d': '--dockerize',
	},
	{
		argv: process.argv.slice(2),
	},
);

let options = {
	forceReInstall: rawArgs['--force-reinstall'] || false,
	skipPrompts: rawArgs['--yes'] || false,
	git: rawArgs['--git'] || false,
	dockerize: rawArgs['--dockerize'] || false,
	database: rawArgs._[0],
};

(async () => {
	try {
		options = await promptForMissingOptions(options);

		if (!isFirst && options.forceReInstall) {
			fs.rmSync('node_modules', { recursive: true });
			fs.rmSync('.husky/_', { recursive: true });
		}

		shouldInstallModules();

		let port = 3306;
		if (options.database === 'postgresql') port = 5432;

		if (!fs.existsSync('.env')) executeCommand('cp .env.example .env');

		let env = getJSON('.env', '=');

		if (!('REDIS_PASSWORD' in env)) {
			executeCommand(`echo "REDIS_PASSWORD=secret\n" >> .env`);

			env = getJSON('.env', '=');
		}

		if (!('DATABASE_URL' in env)) {
			executeCommand(
				`echo "DATABASE_URL=${options.database}://root:prisma@localhost:${port}/mydb" >> .env`,
			);

			env = getJSON('.env', '=');
		}

		if (options.git) executeCommand(`git init`);

		const [db, config] = env.DATABASE_URL.split('://');

		if (!options.database.includes(db)) {
			coloredLogs('Please customize DATABASE_URL in ".env" according to the database', true);

			process.exit(1);
		}

		new Promise((resolve) => {
			if (options.dockerize) {
				executeCommand(`docker-compose --version`);

				coloredLogs('Dockerize in process for the server....');

				if (!fs.existsSync('docker-compose.yml')) {
					coloredLogs("You don't have an docker-compose.yml file in your root", true);

					process.exit(1);
				}

				executeCommand(`npm run up`);

				switch (db) {
					case 'mysql': {
						if (!config.includes('3306')) {
							coloredLogs(
								'Please change port number to 3306 in DATABASE_URL ".env" like @localhost:3306',
								true,
							);

							process.exit(1);
						}

						const container = executeCommand(
							`docker ps --format '{{ .Names }}' | grep "${db}_db"`,
							false,
							'pipe',
						);

						const [user, password] = config.split('@')[0].split(':');

						executeCommand(`
								while ! docker exec ${container} mysql --user=${user} --password=${password} -e "SELECT 1" >/dev/null 2>&1;
								do
									printf "."
									sleep 2
								done
								printf "done\n"
							`);
						break;
					}
					case 'postgresql': {
						if (!config.includes('5432')) {
							coloredLogs(
								'Please change port number to 5432 in DATABASE_URL ".env" like @localhost:5432',
								true,
							);

							process.exit(1);
						}

						break;
					}
					default: {
						coloredLogs('Either use mysql or postgresql and set variables according to it', true);

						process.exit(1);
					}
				}
			}

			resolve();
		}).then(() => {
			coloredLogs('running db migration to upsert tables....');

			const tomlPath = 'prisma/migrations/migration_lock.toml';
			if (fs.existsSync(tomlPath)) {
				const toml = getJSON(tomlPath);

				if (toml.provider.indexOf(db) === -1) {
					fs.rmSync('prisma/migrations', { recursive: true });
				}
			}
			const existingProvider = getJSON('prisma/schema.prisma').provider;

			if (existingProvider && !existingProvider.includes(db)) {
				executeCommand(`sed -i -e 's,= ${existingProvider},= "${db}",g' prisma/schema.prisma`);
			}

			executeCommand('npm run db:deploy');

			coloredLogs('Setup Finished', undefined, true);
		});
	} catch (error) {
		coloredLogs(error.message, true);

		process.exit(1);
	}
})();

function executeCommand(cmd, exit = false, stdio = 'inherit') {
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

function coloredLogs(message, failed = false, shouldExit = false) {
	executeCommand(`echo "\n\\e[1;${failed ? 31 : 32}m ...${message}... \\e[0m"`, shouldExit);
}

async function promptForMissingOptions(options) {
	const defaultDatabase = 'mysql';
	if (options.skipPrompts) {
		return {
			...options,
			database: options.database || defaultDatabase,
		};
	}

	const questions = [];
	if (!options.database) {
		questions.push({
			type: 'list',
			name: 'database',
			message: 'Please choose which database to use',
			choices: ['mysql', 'postgresql'],
			default: defaultDatabase,
		});
	}

	if (!options.dockerize) {
		questions.push({
			type: 'confirm',
			name: 'dockerize',
			message: 'Do you wanna dockerize it?',
			default: false,
		});
	}

	if (!options.git && !fs.existsSync('.git')) {
		questions.push({
			type: 'confirm',
			name: 'git',
			message: 'Do you wanna git it?',
			default: false,
		});
	}

	const answers = await inquirer.prompt(questions);
	return {
		...options,
		git: options.git || answers.git,
		database: options.database || answers.database,
		dockerize: options.dockerize || answers.dockerize,
	};
}

function getJSON(filePath, separate = ' = ') {
	return fs
		.readFileSync(filePath, 'utf8')
		.split('\n')
		.reduce((acc, cur) => {
			const [key, value] = cur.trim().split(separate);
			if (key.trim()) acc = { ...acc, [key]: value };
			return acc;
		}, {});
}

function shouldInstallModules() {
	if (!fs.existsSync('node_modules')) {
		coloredLogs('Copying files...');

		executeCommand('npm install');
	}
}
