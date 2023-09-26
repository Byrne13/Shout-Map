import {Router} from 'express';
import {postData} from "../data/index.js";
import {userData} from "../data/index.js";
import { users } from "../config/mongoCollections.js";
import * as fs from 'fs'
import { ObjectId } from 'mongodb';
const router = Router();

router.get('/posts', async (req, res) => {
  try {
    const allPosts = await postData.getAll();
    res.json(allPosts);
  } catch (e) {
    res.status(500).json({error: e});
  }
});
router.get('/postDate/:date', async (req, res) => {
 // console.log("here")
  try {
    let date = req.params.date;
   //console.log(typeof date)
   let dateObj = new Date(date)
    if(typeof dateObj != 'object'){
    console.log("invalid ddddd")
    throw "Date invalid"
    } 
    let day = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();
    console.log(day+" "+month+" "+year)
    const allPosts = await postData.getPostsByDate(month, day, year);
    res.json(allPosts);
  } catch (e) {
    res.status(500).json({error: e});
  }
});
router.get('/postFollowers/', async (req, res) => {
  console.log("here")
  try {
    //let followers = req.params.followers;
    let userid = fs.readFileSync("./routes/currentUser.txt", 'utf-8').toString().trim();
    console.log("userid: "+userid)
    let user = await userData.getUserById(userid);
   // console.log("User: "+user)
    if(!user) throw "User not here"
    let followersUsernames = user.following
    let followers = [];
    let userCollection = await users();
    for(let i = 0; i<followersUsernames.length; i++){
       let id = await userCollection.findOne({username: followersUsernames[i]})
       followers.push(id);
    }
    //console.log(followers);
   //console.log(typeof date)
   let postIds = [];
   let posts = [];
   for(let i = 0; i< followers.length; i++){
     
     postIds = postIds.concat(followers[i].posts);
     //console.log(followers[i].posts)
   }
   console.log("PID: "+postIds);
   try{
   for(let i = 0; i<postIds.length; i++){
     let post = await postData.getPostById(postIds[i])
     console.log(post)
     posts.push(post);
   }
 }catch(e){
   throw e
 }
  // console.log("P: "+posts);
   
    res.json(posts);
  } catch (e) {
    res.status(500).json({error: e});
  }
});


export default router;