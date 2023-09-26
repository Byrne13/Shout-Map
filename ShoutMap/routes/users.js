//import express, express router as shown in lecture code
import {Router} from 'express';
const router = Router();
import * as h from '../helpers.js';
import * as userData from '../data/users.js';
import * as EmailValidator from "email-validator";
import * as DateValidator from "validate-date";
import {users} from '../config/mongoCollections.js';
import bcrypt from "bcrypt";
import * as fs from 'fs'

let saltRounds = 16;

router.route('/').get(async (req, res) => {
	//code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
	return res.render('welcome');
	// return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

router
	.route('/register')
	.get(async (req, res) => {
	/* NOTE: Make sure logged in users can't get here */
	res.render('register');
	})
	.post(async (req, res) => {
	//code here for POST
	let {username, firstName, lastName, password, confirmPassword, email, gender, city, state, birthday} = req.body;
	try {//ERROR CHECKING
		//username
		//gave username
		if(!username) throw "please supply username"
		//does it already exist
		const usersCollection = await users();
		let usersList = await usersCollection.find({username: username});
		if(usersList.length >0) throw 'username already exist';
		//is a string
		h.checkValidString(username,username);
		//is alphnumeric?
		h.checkAlphanumeric(username,username);
		//tidy up username
		username = username.trim();
		username = username.toLowerCase();
	
		//First name
		//gave first name
		if(!firstName) throw "please supply first name"
		//is a string
		h.checkValidString(firstName,firstName);
		//tidy up name
		firstName = firstName.trim();

		//Last name
		//gave last name
		if(!lastName) throw "please supply last name"
		//is a string
		h.checkValidString(lastName,lastName);
		//tidy up name
		lastName = lastName.trim();

		/* Confirm password validation */
		if (password !== confirmPassword) {
			throw "Confirm password field does not match password";
		}

		//email
		//gave email
		// console.log(email);
		// if(!email) throw "please supply email"
		// //check if its a valid email
		// if(!EmailValidator.validate(email)) throw "please supply valid email"
		// //tidy up email
		// email = email.trim();
	
		//gender
		//gave gender
		if(!gender) throw "please supply gender"
		//is string?
		h.checkValidString(gender,gender);
		//tidy up
		gender = gender.trim();
		//check whether its a proper option
		if(!(gender == "male" || gender == "female" || gender == "other" || gender == "none")) throw "please supply valid gender"
		
		//city
		//gave city
		if(!city) throw "please supply city"
		//is string?
		h.checkValidString(city,city);
		//tidy up
		city = city.trim()
	
		//state
		//gave state
		if(!state) throw "please supply state"
		//is string
		h.checkValidString(state,state);
		//is a state string and tidy up
		state = state.trim();
		state = state.toUpperCase();
		if (!h.states.includes(state)) throw "please supply valid state"
	
		//birthday
		//gave birthday
		if(!birthday) throw "please supply birthday"
		//valid birthday
		//TODO: FIX THIS
		//if(!(DateValidator.validateDate(birthday, responseType="boolean"))) throw "supply valid date"
		//console.log(birthday)
		//let time = birthday.valueAsNumber;
		// const dateObject = new Date(birthday);
		// const millisecondsSinceEpoch = dateObject.getTime();
		// console.log(millisecondsSinceEpoch)
		// let now = Date.now();
		// console.log(now)
		// if(now - millisecondsSinceEpoch < 410240038000 ){
		// 	throw "supply valid date"
		// }
		//TODO FIX haSHgIN

		// Hash the password using bcrypt 
		const hash = await bcrypt.hash(password, saltRounds);
		// Insert the user's data into the db 


		let createResult = await userData.create(username, firstName, lastName, email, gender, city, state, birthday, hash);

			/*
			if (createResult != { insertedUser: true }) {
				res.status(500).json({error: "Internal Server Error"});
			}
			*/
		

		res.redirect('/login');
	}
	catch (e) {
		console.log(e);
		res.status(400).render('register', {error: e});
	}

});

router
	.route('/login')
	/* LOGIN GET CODE */
	.get(async (req, res) => {
	/* NOTE: Make sure logged in users can't get here */
	res.render('login');
	})
	/* LOGIN POST CODE */
	.post(async (req, res) => {
		let {username, password} = req.body;
		try {
			//username
			//gave username
			if(!username) throw "please supply username"
			//does it already exist
			const usersCollection = await users();
			let usersList = await usersCollection.find({username: username});
			if (usersList.length >0) throw 'username already exist';
			//is a string
			h.checkValidString(username,username);
			//is alphnumeric?
			h.checkAlphanumeric(username,username);
			//tidy up username
			username = username.trim();
			username = username.toLowerCase();
			

		
			/* Insert the user's data into the db */
			
			let userDetails = await userData.login(username, password);
			
			/* Store session in database */
			req.session.user= {
				_id: userDetails._id,
				firstName: userDetails.firstName,
				lastName: userDetails.lastName,
				emailAddress: userDetails.emailAddress,
				username: userDetails.username
			};
			fs.writeFile('./routes/currentUser.txt', '', (err) => {
				if (err) throw err;
				
			// Write the new data to the file
			fs.writeFile('./routes/currentUser.txt', userDetails._id.toString(), (err) => {
				if (err) throw err;
				console.log('Data written to file');
			});
			});
			res.redirect('/map');
		}
		catch (e) {
			console.log(e);
			res.status(400).render('login', {error: "You did not provide a valid email and/or password"});
		}
	}
);

router.route('/followuser').post(async (req, res) => {
	try {
		if (!req.session.user) {
			throw "You are not logged in";
		}

		let {follow} = req.body;
		follow = h.checkValidString(follow);
		const usersCollection = await users();
		if (req.session.user.username === follow) {
			throw "You can't follow yourself!";
		}
		follow = follow.toLowerCase();
		let user = await usersCollection.findOne({username: follow});
		let requestingUser = await usersCollection.findOne({username: req.session.user.username});

		if (user === null) {
			throw "User not found";
		}
		if (requestingUser.following.includes(user.username)) {
			throw "You're already following that user";
		}
		let requestUser = await usersCollection.findOneAndUpdate({username: req.session.user.username}, {$addToSet: { "following": user.username } });
		if (requestUser === undefined) {
			throw 'Internal server error';
		}
		let sucMsg = "Successfully followed " + user.username;
		return res.render('map', {successFollow: true, msg: sucMsg});
	}
	catch (e) {
		if (e === "You are not logged in")
			return res.status(403).render('map', {isError: true, error: e});
		if (e === "Internal server error")
			return res.status(500).render('map', {isError: true, error: e});
		else return res.status(400).render('map', {isError: true, error: e});
	}

});

router.route('/unfollowuser').post(async (req, res) => {
	try {
		if (!req.session.user) {
			throw "You are not logged in";
		}

		let {unfollow} = req.body;
		unfollow = h.checkValidString(unfollow);
		unfollow = unfollow.toLowerCase();
		const usersCollection = await users();
		if (req.session.user.username === unfollow) {
			throw "You can't unfollow yourself!";
		}
		let user = await usersCollection.findOne({username: unfollow});
		let requestingUser = await usersCollection.findOne({username: req.session.user.username});
		
		if (!requestingUser.following.includes(user.username)) {
			throw "You're not following that user";
		}
		let requestUser = await usersCollection.findOneAndUpdate({username: req.session.user.username}, {$pull: { "following": user.username } });
		if (requestUser === undefined) {
			throw 'Internal server error';
		}
		let sucMsg = "Successfully unfollowed " + user.username;
		return res.render('map', {successFollow: true, msg: sucMsg});
	}
	catch (e) {
		if (e === "You are not logged in")
			return res.status(403).render('map', {isError: true, error: e});
		if (e === "Internal server error")
			return res.status(500).render('map', {isError: true, error: e});
		else return res.status(400).render('map', {isError: true, error: e});
	}
});

/* ERROR GET ROUTE */
router.route('/error').get(async (req, res) => {
	// Not sure why this is needed.
	// Maybe ask in office hours?
	// TODO: PARSE ERROR AND STATUS.
	let isLoggedIn = true;
	if (!req.session.user) {
		isLoggedIn = false;
	}
	res.render('error', {error: e, isLoggedIn: isLoggedIn});
});

/* Profile get route */
router.route('/profile').get(async (req, res) => {
	if (!req.session.user) return res.redirect('/login');
	res.render('profile', {firstName: req.session.user.firstName, lastName: req.session.user.lastName, isLoggedIn: true})
});
/* LOGOUT GET ROUTE */
router.route('/logout').get(async (req, res) => {
	req.session.destroy();
	res.render('logout');
});


export default router;