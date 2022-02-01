import path from 'path';
import fs from 'fs';
import express from 'express';

const router = express.Router();

fs.readdirSync(__dirname).forEach((file) => {
	if (fs.statSync(path.join(__dirname, file)).isDirectory()) {
		import(`./${file}`).then((route) => router.use(`/${file}`, route.default));
	}
});

export default router;
