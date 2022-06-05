import os from 'os';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import fileUpload from 'express-fileupload';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { name } from '../../package.json';

// swagger options
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			version: '1.0.0',
			title: name,
			description: 'APIs documentation',
		},
		basePath: '/',
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ['./src/express/routes/**/swagger.js'], // files containing annotations as above
};

const specs = swaggerJsDoc(options);

// initiate express app;
const app = express();

// swagger setup
app.use('/api-docs', swaggerUI.serve);
app.get('/api-docs', swaggerUI.setup(specs));

// parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// cors
app.use(cors({ origin: true, credentials: true }));

// set the view engine to ejs
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// middleware for express-fileupload
app.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 } }));

// logs
morgan.token('host', () => os.hostname);
app.use(morgan(':host :method :url :response-time'));

// x-powered-by
app.disable('x-powered-by');

// routings
fs.readdirSync('./src/express/routes/').forEach((file) => {
	if (fs.statSync(path.join(__dirname, 'routes', file)).isDirectory()) {
		import(`./routes/${file}/routes.js`).then((route) => app.use(`/api/${file}`, route.default));
	}
});

app.get('/api/healthy', function (req, res) {
	// do app logic here to determine if app is truly healthy
	// you should return 200 if healthy, and anything else will fail
	// if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
	res.status(200).send('I am happy and healthy\n');
});

export default app;
