import express from 'express';
import { catchAsync } from '../../../../utils';
import { commonController } from '../../../../controllers';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: File_Uploads
 *   description: The common APIs
 */

router.post('/', catchAsync(commonController.uploadImage));

/**
 * @openapi
 * /api/common/images:
 *   post:
 *     summary: Returns path name of the uploaded file
 *     tags: [File_Uploads]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               uploadedFileName:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: filepath inside of a path property
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 path:
 *                   type: string
 *                   description: path of the uploaded file
 *                   example: temp/123123123-file-name.ext
 */

router.get('/', catchAsync(commonController.getImage));

/**
 * @openapi
 * /api/common/images:
 *   get:
 *     summary: Returns File Buffer
 *     tags: [File_Uploads]
 *     parameters:
 *       - in: query
 *         name: filename
 *         schema:
 *           type: string
 *           required: true
 *           description: The path of the file
 *         example: temp/1643969505648-merchant-dashboard-1.png
 *     responses:
 *       200:
 *         description: file buffer according path name
 */

router.delete('/', catchAsync(commonController.removeImage));

/**
 * @openapi
 * /api/common/images:
 *   delete:
 *     summary: Returns deleted file confirmation
 *     tags: [File_Uploads]
 *     parameters:
 *       - in: query
 *         name: filename
 *         schema:
 *           type: string
 *           required: true
 *           description: The path of the file
 *         example: temp/1643969505648-merchant-dashboard-1.png
 *     responses:
 *       200:
 *         description: confirmation of deleted file
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Image deleted successfully.
 */

export default router;
