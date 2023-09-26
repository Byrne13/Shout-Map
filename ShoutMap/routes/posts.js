import {Router} from 'express';
import { userData } from '../data/index.js';
import { postData } from '../data/index.js';
import {users} from '../config/mongoCollections.js';
import {posts} from '../config/mongoCollections.js';
import * as h from '../helpers.js';
import { ObjectId } from "mongodb";
const router = Router();
import xss from 'xss';

/* TODO: MAP ROUTE */
router.route('/map').get(async (req, res) => {
	//
});

//comments and reactions?? maybe
router.route('/react').post(async (req,res) =>
{
	console.log("reaction");
	try{
		let {reactionType} = req.body;
		let {reactorId} = req.session.user._id
		let {postId} = req.post._id
		//add to db?
		let reactDetails = await post.addReaction(postId,reactorId,reactionType);
	}catch(e){
		res.status(400).render('post',{error: e})
	}
}
);

router.route('/makepost').get(async (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    }
	console.log("user: " + req.session.user);
    res.render('makepost', {isLoggedIn: true});
});

/* TODO: POST ROUTE */
router.route('/makepost').post(async (req, res) => {
	// Do a database query?
	try{
		if (!req.session.user) throw 'You do not have permission to do this';

		let caption = xss(req.body.caption);
		console.log(caption);
		//console.log("caption: " + caption);
		 h.checkValidString(caption);

		let image = xss(req.body.image);
		//image = h.checkValidString(image);
		//console.log("base64: " + image);

		//get current time in timestamp
		let timestamp = new Date();

		//console.log("timestamp: " + timestamp);

		let lat = 0;
		let lng = 0;
		//get location for post
		
		lat = req.body.latitude;
		lat = lat.trim();
		lat = parseFloat(lat);

 		lng = req.body.longitude;
		lng = lng.trim();
		lng = parseFloat(lng);


		//console.log("lat: " + lat);
		//console.log("long: " + lng);
		console.log(caption)
		try{
			let myPostData = await userData.post(req.session.user._id, timestamp, lat, lng, image, caption);
		}catch(e){
			console.log(e);
		}
		

		//console.log("myPostData: " + myPostData);

		//const postURL = '/getPost:' + myPostData._id;

		res.redirect('/map');

	}
	catch (e) {
		if (e === "You do not have permission to do this") res.status(403).render('makepost', {error: e});
		else res.status(400).render('makepost', {error: e});
	}

});
router.get('/:id', async (req, res) => {
	// Query the database for the id passed. return 404 if not found.
	// If post id is found, grab the rest of the post data, and pass it into a
	// render request.
	try {
		const postsCollection = await posts();
		const usersCollection = await users();
		let post = await postData.getPostById(req.params.id);
		if (post === null) return res.status(404).render('error', {error: "Post not found"});
		let author = await usersCollection.findOne({posts: post._id});
		if (author === null) return res.status(500).render('error', {error: "Author not found"});

		let renderInfo = {
			userId: author._id,
			author: author.username,
			date: post.timestamp,
			picture: post.image64,
			comments: post.comments,
			// TODO! caption: post.caption
		}
		return res.render('post', renderInfo);
	}
	catch (e) {
		res.status(500).render('error', {error: e});
	}

});
export default router;