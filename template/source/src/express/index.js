import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import fileUpload from 'express-fileupload';

// initiate express app;
const app = express();

// parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// cors
app.use(
	cors({
		origin: true,
		credentials: true,
	}),
);

// set the view engine to ejs
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(
	fileUpload({
		limits: { fileSize: 5 * 1024 * 1024 },
	}),
);

// logs
app.use(morgan('dev'));

// x-powered-by
app.disable('x-powered-by');

fs.readdirSync('./src/express/routes/').forEach((file) => {
	if (fs.statSync(path.join(__dirname, 'routes', file)).isDirectory()) {
		import(`./routes/${file}/routes.js`).then((route) => app.use(`/api/${file}`, route.default));
	}
});

export default app;
