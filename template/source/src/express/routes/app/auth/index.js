import express from 'express';
import { catchAsync, restWrapper } from '../../../../utils';
import { userController } from '../../../../controllers';
import { ensureSignedIn, ensureSignedOut } from '../../../middleware';

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id
 *           example: 8f06be04-9299-42cd-887b-bcfcab2e156e
 *         username:
 *           type: string
 *           description: username of the user
 *           example: shahanahmed86
 *         avatar:
 *           type: string
 *           description: avatar path of the user
 *           example: 1643969505648-avatar.png
 *         fullName:
 *           type: string
 *           description: full name of the user
 *           example: Shahan Ahmed Khan
 *         email:
 *           type: string
 *           description: email of the user
 *           example: email@domain.com
 *         cell:
 *           type: string
 *           description: cell of the user
 *           example: +92++++++++++
 *         gender:
 *           type: string
 *           description: gender of the user
 *           example: MALE
 *         signUpType:
 *           type: string
 *           description: Indicates whether user attempts social login or local
 *           example: FACEBOOK
 *         createdAt:
 *           type: string
 *           description: The created date & time of the user
 *           example: 2022-01-29T21:30:00.0000Z
 *         updatedAt:
 *           type: string
 *           description: The updated date & time of the user
 *           example: 2022-01-31T12:00:00.0000Z
 */

/**
 * @openapi
 * tags:
 *   name: User_Authentications
 *   description: The Authentication APIs
 */

router.get('/me', ensureSignedIn({ shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.me)),
);

/**
 * @openapi
 * /api/app/auth/me:
 *   get:
 *     summary: Returns logged in user
 *     tags: [User_Authentications]
 *     responses:
 *       200:
 *         description: Logged In
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.post('/login', ensureSignedOut({ shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.login)),
);

/**
 * @openapi
 * /api/app/auth/login:
 *   post:
 *     summary: Returns token and user's payload
 *     tags: [User_Authentications]
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
 *                 example: shahanahmed86
 *               password:
 *                 type: string
 *                 description: password
 *                 example: 123abc456
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
 *                 user:
 *                   allOf:
 *                     - type: object
 *                     - $ref: '#/components/schemas/User'
 */

router.delete('/logout', ensureSignedIn({ shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.logout)),
);

/**
 * @openapi
 * /api/app/auth/logout:
 *   delete:
 *     summary: Returns sign out success message
 *     tags: [User_Authentications]
 *     responses:
 *       200:
 *         description: Logout
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: You've successfully signed out.
 */

router.post('/signup', ensureSignedOut({ shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.signup)),
);

/**
 * @openapi
 * /api/app/auth/signup:
 *   post:
 *     summary: Returns token and user's payload
 *     tags: [User_Authentications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: username of the user
 *                 example: shahanahmed86
 *               password:
 *                 type: string
 *                 description: password
 *                 example: 123abc456
 *               avatar:
 *                 type: string
 *                 description: avatar path of the user
 *                 example: temp/1643969505648-avatar.png
 *               fullName:
 *                 type: string
 *                 description: full name of the user
 *                 example: Shahan Ahmed Khan
 *               email:
 *                 type: string
 *                 description: email of the user
 *                 example: email@domain.com
 *               cell:
 *                 type: string
 *                 description: cell of the user
 *                 example: +92++++++++++
 *               gender:
 *                 type: string
 *                 description: gender of the user
 *                 example: MALE
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
 *                 user:
 *                   allOf:
 *                     - type: object
 *                     - $ref: '#/components/schemas/User'
 */

router.put('/change-password', ensureSignedIn({ shouldUser: true }), (...args) =>
	catchAsync(restWrapper(args, userController.changePassword)),
);

/**
 * @openapi
 * /api/app/auth/change-password:
 *   put:
 *     summary: Returns change password success message
 *     tags: [User_Authentications]
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
 *                 example: 123abc456
 *               password:
 *                 type: string
 *                 description: new password
 *                 example: 123abc4567
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
