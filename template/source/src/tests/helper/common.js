import fs from 'fs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../..';

chai.use(chaiHttp);

export function uploadImage(imagePath = './src/assets/appstore.png') {
	return chai
		.request(app)
		.post(`/api/common/images`)
		.set('content-type', 'multipart/form-data')
		.attach('uploadedFileName', fs.readFileSync(imagePath), {
			contentType: 'image/png',
			filename: 'appstore.png',
		});
}
