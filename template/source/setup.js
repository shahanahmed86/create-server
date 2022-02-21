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
		'-y': '--yes',
		'-f': '--force-reinstall',
	},
	{
		argv: process.argv.slice(2),
	},
);

let options = {
	forceReInstall: rawArgs['--force-reinstall'] || false,
	skipPrompts: rawArgs['--yes'] || false,
	args: rawArgs._[0],
};

(async () => {
	try {
		options = await promptForMissingOptions(options);
		const { forceReInstall, skipPrompts, args, ...env } = options;
		env.DB_PORT='3306' // mysql port
		env.REDIS_PORT='6379' // redis port

		if (!isFirst && forceReInstall) {
			fs.rmSync('node_modules', { recursive: true });
			fs.rmSync('.husky/_', { recursive: true });
		}

		shouldInstallModules();

		executeCommand('cp -i .env.example .env');

		const allVars = getJSON('.env', '=');
		Object.keys(env).forEach((k) => {
			if (!(k in allVars)) executeCommand(`echo "${k}=${env[k]}" >> .env`);
		});

		executeCommand(
			`echo "DATABASE_URL=mysql://root:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}" >> .env`,
		);

		new Promise((resolve) => {
			if (!fs.existsSync('docker-compose.yml')) {
				coloredLogs("You don't have an docker-compose.yml file in your project", true);

				process.exit(1);
			}

			executeCommand(`npm run up`);

			resolve();
		}).then(() => {
			// initial commit
			executeCommand('git add .; git commit -m "initial commit" --no-verify', undefined, 'ignore');

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
	if (options.skipPrompts) {
		return {
			...options,
			BCRYPT_SALT: options.BCRYPT_SALT || '10',
			JWT_SECRET: options.JWT_SECRET || 'jwt_secret',
			SMTP_HOST: options.SMTP_HOST || 'smtp.gmail.com',
			SMTP_PORT: options.SMTP_PORT || '465',
			SMTP_USER: options.SMTP_USER || 'shahan.nodemailer',
			SMTP_PASS: options.SMTP_PASS || '123Abc456%',
			REDIS_HOST: options.REDIS_HOST || 'cache',
			REDIS_PASSWORD: options.REDIS_PASSWORD || 'secret',
			DB_HOST: options.DB_HOST || 'mysqldb',
			DB_USER: options.DB_USER || 'prisma',
			DB_PASS: options.DB_PASS || 'prisma',
			DB_NAME: options.DB_NAME || 'mydb',
		};
	}

	const questions = [
		{
			type: 'input',
			name: 'BCRYPT_SALT',
			message: 'Please enter the salt value to encrypt password/values with',
			default: '10',
		},
		{
			type: 'password',
			name: 'JWT_SECRET',
			message: 'Please enter the secret to create a Login token with',
			default: 'jwt_secret',
		},
		{
			type: 'input',
			name: 'SMTP_HOST',
			message: 'Please enter the host for email address to send email with',
			default: 'smtp.gmail.com',
		},
		{
			type: 'input',
			name: 'SMTP_PORT',
			message: 'Please enter the port of the host for email address',
			default: '465',
		},
		{
			type: 'input',
			name: 'SMTP_USER',
			message: 'Please enter the email address to send email with',
			default: 'shahan.nodemailer',
		},
		{
			type: 'password',
			name: 'SMTP_PASS',
			message: 'Please enter the password of email address to send email with',
			default: '123Abc456%',
		},
		{
			type: 'input',
			name: 'REDIS_HOST',
			message: 'Please enter the host name where redis is serving',
			default: 'cache',
		},
		{
			type: 'password',
			name: 'REDIS_PASSWORD',
			message: "Please enter the password of Redis' host where it is serving",
			default: 'secret',
		},
		{
			type: 'input',
			name: 'DB_HOST',
			message: 'Please enter the host of database',
			default: 'mysqldb',
		},
		{
			type: 'input',
			name: 'DB_USER',
			message: "Please enter the username of Database's host",
			default: 'prisma',
		},
		{
			type: 'password',
			name: 'DB_PASS',
			message: "Please enter the password of Database's host",
			default: 'prisma',
		},
		{
			type: 'input',
			name: 'DB_NAME',
			message: "Please enter the name of Database's host like mydb, test or etc",
			default: 'mydb',
		},
	];

	const answers = await inquirer.prompt(questions);
	return {
		...options,
		BCRYPT_SALT: options.BCRYPT_SALT || answers.BCRYPT_SALT,
		JWT_SECRET: options.JWT_SECRET || answers.JWT_SECRET,
		SMTP_USER: options.SMTP_USER || answers.SMTP_USER,
		SMTP_PASS: options.SMTP_PASS || answers.SMTP_PASS,
		REDIS_HOST: options.REDIS_HOST || answers.REDIS_HOST,
		REDIS_PASSWORD: options.REDIS_PASSWORD || answers.REDIS_PASSWORD,
		DB_HOST: options.DB_HOST || answers.DB_HOST,
		DB_USER: options.DB_USER || answers.DB_USER,
		DB_PASS: options.DB_PASS || answers.DB_PASS,
		DB_NAME: options.DB_NAME || answers.DB_NAME,
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
	if (!fs.existsSync('.git')) executeCommand(`git init`);

	if (!fs.existsSync('node_modules')) {
		coloredLogs('Copying files...');

		executeCommand('npm install');
	}
}
