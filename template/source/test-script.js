import { executeCommand } from './src/utils/wrapper';
import fs from 'fs';

if (!fs.existsSync('.env') || !fs.existsSync('./node_modules')) {
	executeCommand('echo "\\e[1;32m ....Please run "node setup docker" before tests.... \\e[0m"');
	process.exit(1);
}

if (fs.existsSync('.env')) {
	const env = fs
		.readFileSync('.env', 'utf8')
		.split('\n')
		.reduce((acc, cur) => {
			const [key, value] = cur.split('=');
			if (key) acc = { ...acc, [key]: value };
			return acc;
		}, {});

	if (!('DATABASE_URL' in env)) {
		executeCommand(
			'echo "\\e[1;32m ....DATABASE_URL is missing, please delete the env and re-run the command... \\e[0m"',
		);

		process.exit(1);
	}

	if (env.DATABASE_URL.indexOf('<') !== -1) {
		executeCommand(
			'echo "\\e[1;32m ....DATABASE_URL has got undefined values either of user, password, host, port, db... \\e[0m"',
		);

		process.exit(1);
	}
}

new Promise((resolve) => {
	executeCommand('echo "\\e[1;32m ....running containers for test.... \\e[0m"');
	executeCommand('npm run up:test');

	const env = fs
		.readFileSync('.env', 'utf8')
		.split('\n')
		.reduce((acc, cur) => {
			const [key, value] = cur.split('=');
			if (key) acc = { ...acc, [key]: value };
			return acc;
		}, {});

	const [db, config] = env.DATABASE_URL.split('://');
	const [user, password] = config.split('@')[0].split(':');

	const container = executeCommand(
		`docker ps --format '{{ .Names }}' | grep "${db}_db"`,
		false,
		'pipe',
	);

	switch (db) {
		case 'mysql': {
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
		case 'postgres': {
			break;
		}
		default: {
			executeCommand(
				'echo "\\e[1;32m ....Either use mysql or postgresql and set variables according to it... \\e[0m',
			);
			process.exit(1);
		}
	}

	resolve();
})
	.then(() => {
		executeCommand('echo "\\e[1;32m ....running db migration to upsert tables.... \\e[0m"');
		executeCommand('npm run db:deploy');

		executeCommand('echo "\\e[1;32m ....running test.... \\e[0m"');
		executeCommand('mocha -r esm src/tests/**/*.spec.js --exit', true);
	});
