import { existsSync, mkdirSync, unlinkSync, readFileSync, rename } from 'fs';
import path from 'path';
import RootUtils from './root';

class File extends RootUtils {
	constructor() {
		super();
		this.path = './uploads';
	}

	localUpload(image) {
		const imageFile = image.uploadedFileName;
		const filename = `${this.uuid}-${imageFile.name}`;

		if (!existsSync(this.path)) mkdirSync(this.path);
		if (!existsSync(`${this.path}/temp`)) mkdirSync(`${this.path}/temp`);

		return new Promise((resolve, reject) => {
			const uploadFile = path.join(this.path, 'temp', filename);
			imageFile
				.mv(uploadFile) // Use the mv() method to place the file somewhere
				.then(() => resolve(`temp/${filename}`))
				.catch(reject);
		});
	}

	deleteOldFileLocally(imagePath) {
		const path = `${this.path}/${imagePath}`;
		if (existsSync(path)) {
			unlinkSync(path);
			return true;
		}

		return false;
	}

	getFileBuffer(imagePath) {
		const path = `${this.path}/${imagePath}`;
		if (existsSync(path)) return readFileSync(path);

		return readFileSync(`./src/assets/404-image.png`);
	}

	moveImageFromTmp(imagePath) {
		return new Promise((resolve, reject) => {
			const currentPath = path.join(this.path, imagePath);
			if (!existsSync(currentPath)) reject(new Error('404;;Image not found'));
			else {
				const newFile = imagePath.split('/')[1];
				const destPath = path.join(this.path, newFile);

				rename(currentPath, destPath, (err) => {
					if (err) reject(new Error(err));

					resolve(newFile);
				});
			}
		});
	}
}

export default new File();
