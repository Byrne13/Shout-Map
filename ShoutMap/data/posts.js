import * as help from "../helpers.js"
import { posts } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { userData } from "./index.js";
import { ObjectId } from "mongodb";
import * as fs from 'fs'
import path from 'path';
import { get } from "http";

export const create = async (
    timestamp,
    latitude,
    longitude,
    image,
    caption
  ) => 
  {
    //ERROR CHECKING
    //do they exist
    if(!timestamp) throw "please supply timestamp";
    if(!latitude) throw "please supply latitude";
    if(!longitude) throw "please supply longitude";
    if(!image) throw "Please supply image"
    if(!caption) throw "Please supply caption"
    if(typeof latitude != 'number') throw "Latitude Must be int"
    if(typeof caption !='string') throw "caption must be a string"
    if( typeof image !='string') throw "image must be a string"
    if( typeof longitude != 'number') throw" (longitude must be an int)"
    if(caption.trim()== "") throw "Must not be an empty string"
    //TODO fix this
    if(typeof timestamp != 'object' ) throw "timestamp must be an object"
    let newPost = {
      timestamp: timestamp,
      latitude: latitude,
      longitude: longitude,
      image64: image,
      comments:[],
      reactions:[],
      caption: caption
    };
    const postCollection = await posts();
    const insertInfo = await postCollection.insertOne(newPost);
    if(!insertInfo.acknowledged || !insertInfo.insertedId){
      throw "Could not add post";
    }
    const newId = insertInfo.insertedId.toString();
    const post = await getPostById(newId);
    return post;
  }
  let idChecker = (id) =>{
    if(!id) throw "Must provide id"
    if(typeof id != 'string') throw "Id must be string"
    if(id.trim() == "")throw "ID cannot be empty"
    id=id.trim()
    if(!ObjectId.isValid(id)) throw "invalid id"
    return id;
  }
  export const getAll = async () => {
    const postCollection = await posts();
    let postList = await postCollection.find({}).toArray();
    if(!postList) throw new Error("Could not get all posts");
    postList = postList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return postList;
  };

  export const getPostById = async (id) =>{
    let nId = idChecker(id);
    const postCollection = await posts()
    const post = await postCollection.findOne({_id: new ObjectId(nId)});
    if(post == null) throw "no band with that id"
    post._id = post._id.toString();
    return post;
  }
  export const removePost = async (id) => {
    //stays in the user file. should display post not avalible
    if(!id) throw new Error("Must rpvoude ID")
    if(typeof id != 'string') throw new Error("ID must be a string")
    if(id.trim().length == 0){
      throw new Error("Must not only contain spaces")
    }
    id = id.trim();
    if(!ObjectId.isValid(id)) throw new Error("Invalid ID");
    const postCollection = await posts();
    const deletionInfo = await postCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });
    if(deletionInfo.lastErrorObject.n ===0){
      throw new Error(`Could not delete post with id of ${id}`)
    }
    return deletionInfo.value;
  };
  let dateChecker = (post, day, month, year) =>{
   // console.log(post)
    const postDay = post.timestamp.getDate();
    //console.log("DAY: " +postDay)
    const postMonth = post.timestamp.getMonth() + 1;

    //console.log("MONTH: " +postMonth)
    const postYear = post.timestamp.getFullYear();
   // console.log("YEAR: " +postYear)
    const targetDay = day;
    //console.log("day: " +targetDay)
    const targetMonth = month;
   // console.log("month: " +targetMonth)
    const targetYear = year;
   // console.log("year: " +targetYear)
    return (postDay === targetDay && postMonth === targetMonth && postYear === targetYear);
  }
  export const getPostsByDate = async (month, day, year) =>{
    let posts = await getAll();
    //console.log(posts)
    const filteredPosts = posts.filter(post =>dateChecker(post, day, month, year));
    return filteredPosts;
  }
  export const addComment = async (postId, userId, text) =>{
     postId = idChecker(postId);
     userId = idChecker(userId);
    if(typeof text !='string')throw "must comment a string"
    if(text.trim() == "") throw "cannot be a blank comment"
    text = text.trim();
    // fs.readdir('.', (err, files) => {
    //   if (err) throw err;
    
    //   files.forEach(file => {
    //     console.log(file);
    //   });
    // });
    let badWords = fs.readFileSync("./data/badwords.txt", 'utf-8').split('\n').toString();
    const cleanWords = badWords.replace(/\r/g, '');
    let fn = cleanWords.split(",")
    //console.log(fn)
    //console.log(cleanWords)
    const words = text.split(' ');
    
    //console.log("words: " + words)
    const hasBadWords = words.some(word => fn.includes(word));
    if (hasBadWords) {
      
      throw "bad word detected. not posting"
    }
    let newComment = {
      commendId: new ObjectId(),
      userId: userId,
      text: text
    };
   // console.log(newComment)
    let post = await getPostById(postId);
    //console.log("comments:\n")
    
    let commentsL = post.comments;
   
     commentsL.push(newComment);
     //console.log(commentsL)
   // console.log(nc)
    const postCollection = await posts();
    const u1 = await postCollection.findOneAndUpdate(
      {_id: new ObjectId(postId)},
      {$set: {comments: commentsL}},
      {returnDocument: 'after'}
    );
    if(u1.lastErrorObject.n == 0){
      //console.log(newAlbum);
      throw new Error("Could not update post successfully 1")
    }
    u1.value._id = u1.value._id.toString();
    return newComment;
    
  }
  export const addReaction = async (postId, userId, text) =>{
     postId = idChecker(postId);
     userId = idChecker(userId);
    if(typeof text !='string')throw "must react a string"
    if(text.trim() == "") throw "cannot be a blank reaction"
    //someone needs to give me a list of valid reactions like :like:, "live:, etc"
    text = text.trim();
    let newReaction = {
      ReactionId: new ObjectId(),
      userId: userId,
      text: text
    };
    let post = await getPostById(postId);
    let reactions = post.reactions;
     reactions.push(newReaction);
    const postCollection = await posts();
    const u1 = await postCollection.findOneAndUpdate(
      {_id: new ObjectId(postId)},
      {$set: {reactions: reactions}},
      {returnDocument: 'after'}
    );
    if(u1.lastErrorObject.n == 0){
      //console.log(newAlbum);
      throw new Error("Could not update band successfully 1")
    }
    u1.value._id = u1.value._id.toString();
    return newReaction;
    
  }
  export const addMedia = async (postId, userId, text) =>{
     postId = idChecker(postId);
     userId = idChecker(userId);
    if(typeof text !='string')throw "must react a string"
    if(text.trim() == "") throw "cannot be a blank reaction"
    //someone needs to give me a list of valid reactions like :like:, "live:, etc"
    text = text.trim();
    let newMedia = {
      mediaId: new ObjectId(),
      userId: userId,
      text: text
    };
    let post = await getPostById(postId);
    let media = post.media;
    media.push(newMedia);
    const postCollection = await posts();
    const u1 = await postCollection.findOneAndUpdate(
      {_id: new ObjectId(postId)},
      {$set: {media: media}},
      {returnDocument: 'after'}
    );
    if(u1.lastErrorObject.n == 0){
      //console.log(newAlbum);
      throw new Error("Could not update band successfully 1")
    }
    u1.value._id = u1.value._id.toString();
    return newMedia;
    
  }
  let haversine= (lat1, lng1, lat2, lng2)=> {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180);
  }
  
  // Find all the elements in the structList that are within the given radius of the given latitude and longitude
  export const getPostsByRadius = async (lat, lon, rad) =>{
    let posts = getAll();
    let results = posts.filter(struct => haversine(lat, lon, struct.latitude, struct.longitude) <= radius);
    return results
  }
  
  export default {create, getAll,getPostsByDate, getPostById,removePost,
  addComment, addReaction, addMedia};
