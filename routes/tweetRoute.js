import express from 'express';
import tweetController from '../controller/tweetController.js';
import isAuthonticateUser from '../middleware/auth.js';
const router = express.Router();

router.post('/create',isAuthonticateUser,tweetController.createTweet);
router.delete('/delete/:id',isAuthonticateUser,tweetController.deleteTweet);
router.put('/like/:id',isAuthonticateUser,tweetController.likeOrDislike);
router.put('/bookmark/:id',isAuthonticateUser,tweetController.bookmarkOrNot);
router.get('/alltweets/:id',isAuthonticateUser,tweetController.getAllTweetInForYouSectionOfFeed);
router.get('/followingtweets/:id',isAuthonticateUser,tweetController.getFollowingTweets);


export default router;