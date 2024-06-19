import express from 'express';
import userController from '../controller/userController.js';
import isAuthonticateUser from '../middleware/auth.js';
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.put('/bookmark/:id',isAuthonticateUser,userController.bookmark)
router.get('/profile/:id',isAuthonticateUser,userController.getProfile)
router.get('/otheruser/:id', isAuthonticateUser, userController.getOtherUsers)
router.post('/follow/:id', isAuthonticateUser, userController.follow)
router.post('/unfollow/:id', isAuthonticateUser, userController.unFollow)

export default router;