import { file } from '../../utils';

async function uploadImage(req, res) {
	const path = await file.localUpload(req.files);
	return { path };
}

export default uploadImage;
