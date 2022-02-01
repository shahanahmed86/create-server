import { file } from '../../utils';

function getImage(req, res) {
	return file.getFileBuffer(req.query.filename);
}

export default getImage;
