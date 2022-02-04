import express from 'express';
import { catchAsync, restWrapper } from '../../../../utils';
import { adminController } from '../../../../controllers';
import { ensureSignedIn, ensureSignedOut } from '../../../middleware';

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id
 *           example: 8f06be04-9299-42cd-887b-bcfcab2e156e
 *         username:
 *           type: string
 *           description: username of the admin
 *           example: admin
 *         role:
 *           type: string
 *           description: role of the admin
 *           example: System
 *         createdAt:
 *           type: string
 *           description: The created date & time of the admin
 *           example: 2022-01-29T21:30:00.0000Z
 *         updatedAt:
 *           type: string
 *           description: The updated date & time of the admin
 *           example: 2022-01-31T12:00:00.0000Z
 */

/**
 * @openapi
 * tags:
 *   name: Admin_Authentications
 *   description: The Authentication APIs
 */

router.get('/me', ensureSignedIn({ shouldAdmin: true }), (...args) =>
	catchAsync(restWrapper(args, adminController.me)),
);

/**
 * @openapi
 * /api/admin/auth/me:
 *   get:
 *     summary: Returns logged in admin
 *     tags: [Admin_Authentications]
 *     responses:
 *       200:
 *         description: Logged In
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 */

router.post('/login', ensureSignedOut({ shouldAdmin: true }), (...args) =>
	catchAsync(restWrapper(args, adminController.login)),
);

/**
 * @openapi
 * /api/admin/auth/login:
 *   post:
 *     summary: Returns token and admin's payload
 *     tags: [Admin_Authentications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: username
 *                 example: shahan
 *               password:
 *                 type: string
 *                 description: password
 *                 example: shahan
 *     responses:
 *       200:
 *         description: Login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token to include in headers
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..........9TaqCIfHvkFAtA5vLbvvmcR8Z8ttq_Wxs4vMCsfvoZw
 *                 admin:
 *                   allOf:
 *                     - type: object
 *                     - $ref: '#/components/schemas/Admin'
 */

router.delete('/logout', ensureSignedIn({ shouldAdmin: true }), (...args) =>
	catchAsync(restWrapper(args, adminController.logout)),
);

/**
 * @openapi
 * /api/admin/auth/logout:
 *   delete:
 *     summary: Returns sign out success message
 *     tags: [Admin_Authentications]
 *     responses:
 *       200:
 *         description: Logout
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: You've successfully signed out.
 */

router.put('/change-password', ensureSignedIn({ shouldAdmin: true }), (...args) =>
	catchAsync(restWrapper(args, adminController.changePassword)),
);

/**
 * @openapi
 * /api/admin/auth/change-password:
 *   put:
 *     summary: Returns change password success message
 *     tags: [Admin_Authentications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: old password
 *                 example: shahan
 *               password:
 *                 type: string
 *                 description: new password
 *                 example: 123abc456
 *     responses:
 *       200:
 *         description: Change password
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Password changed successfully
 */

export default router;
