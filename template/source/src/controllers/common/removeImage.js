import { file } from '../../utils';

function removeImage(req, res) {
	if (file.deleteOldFileLocally(req.query.filename)) {
		return 'Image deleted successfully';
	}
	throw new Error("404;;Image has already been deleted or doesn't exists");
}

export default removeImage;
