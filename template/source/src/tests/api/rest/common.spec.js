import chai from 'chai';
import chaiHttp from 'chai-http';
import { BASE_URL } from '../../../config';
import { common } from '../../helper';
import app from '../../../';
import { executeCommand } from '../../../utils';

chai.use(chaiHttp);

const { expect } = chai;

describe('RESTful - Common APIs', function () {
	this.timeout(0);
	this.slow(1000);

	it(`${BASE_URL}/api/common/images => POST => should success`, async () => {
		try {
			const { body, error } = await common.uploadImage();

			expect(error).to.be.false;
			expect(body.path).to.be.a('string').includes('temp/');
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});

	it(`${BASE_URL}/api/common/images => GET => should success`, async () => {
		try {
			const { body } = await common.uploadImage();
			const { error } = await chai.request(app).get(`/api/common/images?filename=${body.path}`);

			expect(error).to.be.false;
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});

	it(`${BASE_URL}/api/common/images => DELETE => should success`, async () => {
		try {
			const { body } = await common.uploadImage();
			const { error, text } = await chai
				.request(app)
				.delete(`/api/common/images?filename=${body.path}`);

			expect(error).to.be.false;
			expect(text).to.be.a.string('Image deleted successfully');
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});

	it(`${BASE_URL}/api/common/images => DELETE => should fail`, async () => {
		try {
			const { error, text } = await chai
				.request(app)
				.delete(`/api/common/images?filename=wrong-file.png`);

			expect(error).to.be.an.instanceOf(Error);
			expect(text).to.be.a.string("Image has already been deleted or doesn't exists");
		} catch (error) {
			console.error(error);
			expect(true).to.be.false;
		}
	});

	after(() => {
		executeCommand('rm -rf uploads/temp/*.*');
	});
});
