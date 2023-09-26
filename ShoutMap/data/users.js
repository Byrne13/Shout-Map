import * as help from "../helpers.js"
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { postData } from "./index.js";
import * as EmailValidator from "email-validator";
import * as DateValidator from "validate-date";
import bcrypt from "bcrypt";

export const create = async (
    username,
    firstName,
    lastName,
    email,
    gender,
    city,
    state,
    birthday,
    hashedPassword
  ) => 
  {
    //ERROR CHECKING
    //username
    //gave username
    if(!username) throw "please supply username"
    //does it already exist
    const usersCollection = await users();
    let usersList = await usersCollection.find({username: username});
    if(usersList.length >0) throw 'username already exist';
    //is a string
    help.checkValidString(username,username);
    //is alphnumeric?
    help.checkAlphanumeric(username,username);
    //tidy up username
    username = username.trim();
    username = username.toLowerCase();

    //firstName
    //gave firstName
    if(!firstName) throw "please supply first name"
    //is a string
    help.checkValidString(firstName,firstName);
    //tidy up firstName
    firstName = firstName.trim();

    //lastName
    //gave lastName
    if(!lastName) throw "please supply first name"
    //is a string
    help.checkValidString(lastName,lastName);
    //tidy up lastName
    lastName = lastName.trim();

    //email
    //gave email
    //if(!email) throw "please supply email"
    //check if its a valid email
    //if(!EmailValidator.validate(email)) throw "please supply valid email"
    //tidy up email
    //email = email.trim();

    //gender
    //gave gender
    
    if(!gender) throw "please supply gender"
    //is string?
    help.checkValidString(gender,gender);
    //tidy up
    gender = gender.trim().toLowerCase();
    //check whether its a proper option
    if(!(gender == "male" || gender == "female" || gender == "other" || gender == "none")) throw "please supply valid gender"
    
    //city
    //gave city
    if(!city) throw "please supply city"
    //is string?
    help.checkValidString(city,city);
    //tidy up
    city = city.trim()

    //state
    //gave state
    if(!state) throw "please supply state"
    //is string
    help.checkValidString(state,state);
    //is a state string and tidy up
    state = state.trim();
    state = state.toUpperCase();
    let properState = true;
    for(let i = 0; i< help.states.length; i++)
    {
        if(state === help.states[i])
        {
            properState = false;
            break;
        }
    }
    if(properState) throw "please supply valid state"

    //birthday
    //gave birthday
    if(!birthday) throw "please supply birthday"
    //valid birthday
   // if(!(DateValidator.validateDate(birthday, "boolean"))) throw "supply valid date"
    let newUser = {
    username: username,
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    city: city,
    state: state,
    birthday: birthday,
    hashedPassword: hashedPassword,
    posts: [],
    likedPosts: [],
    blockedUsers: [],
    following: []
    }
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if(!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not create user"
    const newId = insertInfo.insertedId.toString();
    const user = await getUserById(newId);
    return user;
  }
  let idChecker = (id) =>{
    if(!id) throw "Must provide id"
    if(typeof id != 'string') throw "Id must be string"
    if(id.trim() == "")throw "ID cannot be empty"
    id=id.trim()
    if(!ObjectId.isValid(id)) throw "invalid id"
    return id;
  }
  export const getAll = async () =>
  {
    const usersCollection = await users();
    let usersList = await usersCollection.find({}).toArray();
    if(!usersList) throw 'Could not get all users';
    usersList = usersList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return usersList;
  }

  export const getUserById = async(id) =>{
    if(!id) throw "Must provide id"
    if(typeof id != 'string') throw "Id must be string"
    if(id.trim() == "")throw "ID cannot be empty"
    id=id.trim()
    if(!ObjectId.isValid(id)) throw "invalid id"
    const usersCollection = await users()
    const user = await usersCollection.findOne({_id: new ObjectId(id)});
    if(user == null) throw "no band with that id"
    user._id = user._id.toString();
    return user;
  }
  export const removeUser = async (id) => {
    if(!id) throw new Error("Must rpvoude ID")
    if(typeof id != 'string') throw new Error("ID must be a string")
    if(id.trim().length == 0){
      throw new Error("Must not only contain spaces")
    }
    id = id.trim();
    if(!ObjectId.isValid(id)) throw new Error("Invalid ID");
    const userCollection = await users();
    const deletionInfo = await userCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });
    if(deletionInfo.lastErrorObject.n ===0){
      throw new Error(`Could not delete band with id of ${id}`)
    }
    return deletionInfo.value;
  };
  export const blockUser = async (myId, blkId) =>{
    let id = idChecker(myId);
    let bid = idChecker(blkId);
    const userCollection = await users();
    let bU = getUserById(id).blockedUsers;
     bU.push(bid);
    const u2 = await userCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {blockedUsers: bU}}, {returnDocument: 'after'});
    if(u2.lastErrorObject.n == 0){
      //console.log(newAlbum);
      throw new Error("Could not unblock successfully 2")
    }
    u2.value._id = u2.value._id.toString();
    return true;

  }
  export const unblockUser = async (myId, blkId)=>{
    let id = idChecker(myId);
    let bid = idChecker(blkId);
    const userCollection = await users();
    let bU = getUserById(id).blockedUsers;
    const newList = bU.filter(str => str !== bid);
    const u2 = await userCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {blockedUsers: newList}}, {returnDocument: 'after'});
    if(u2.lastErrorObject.n == 0){
      //console.log(newAlbum);
      throw new Error("Could not unblock successfully 2")
    }
    u2.value._id = u2.value._id.toString();
    return true;
  }
  export const addFriend = async (myId, FndId) =>{
    let id = idChecker(myId);
    let fid = idChecker(FndId);
    const userCollection = await users();
    let bU = getUserById(id).blockedUsers;
    bU.push(fid);
    const u2 = await userCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {following: bU}}, {returnDocument: 'after'});
    if(u2.lastErrorObject.n == 0){
      //console.log(newAlbum);
      throw new Error("Could not unblock successfully 2")
    }
    u2.value._id = u2.value._id.toString();
    return true;

  }
  export const removeFriend = async (myId, FndId) =>{
    let id = idChecker(myId);
    let fid = idChecker(FndId);
    const userCollection = await users();
    let bU = getUserById(id).blockedUsers;
    const newList = bU.filter(str => str !== fid);
    const u2 = await userCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {following: newList}}, {returnDocument: 'after'});
    if(u2.lastErrorObject.n == 0){
      //console.log(newAlbum);
      throw new Error("Could not unblock successfully 2")
    }
    u2.value._id = u2.value._id.toString();
    return true;
  }
  export const changeUsername= async(myId, newUser)=>{
    let id = idChecker(myId);
    if(typeof newUser != 'string') throw "must be string"
    if(newUser.trim() == "") throw "must be valid string"
    newUser = newUser.trim().toLowerCase();
    const userCollection = await users();
    let bU = getUserById(id).blockedUsers;
    const u2 = await userCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {username: newUser}}, {returnDocument: 'after'});
    if(u2.lastErrorObject.n == 0){
      //console.log(newAlbum);
      throw new Error("Could not unblock successfully 2")
    }
    u2.value._id = u2.value._id.toString();
    return true;
  }
  export const changePassword= async(myId, newHashPass)=>{
    let id = idChecker(myId);
    if(typeof newHashPass != 'string') throw "must be string"
    if(newHashPass.trim() == "") throw "must be valid string"
    newHashPass = newHashPass.trim().toLowerCase();
    const userCollection = await users();
    let bU = getUserById(id).blockedUsers;
    const u2 = await userCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {hashedPassword: newHashPass}}, {returnDocument: 'after'});
    if(u2.lastErrorObject.n == 0){
      //console.log(newAlbum);
      throw new Error("Could not unblock successfully 2")
    }
    u2.value._id = u2.value._id.toString();
    return true;
  }
  export const post = async (
    myId,
    timestamp,
    latitude,
    longitude,
    image,
    caption
 )=>{
    let id = idChecker(myId);

    if(!timestamp) throw "please supply timestampU";
    if(!latitude) throw "please supply latitudeU";
    if(!longitude) throw "please supply longitudeU";
    if(!caption) throw "Please supply caption"
    if(!image) throw "Please suply image"
    
    //console.log(typeof timestamp);
    if(typeof latitude != 'number') throw "Latitude must be float"
    if( typeof image !='string') throw "image must be a string"
    if(typeof caption != 'string') throw "Caption must be a string"
    if( typeof longitude != 'number') throw" (longitude must be an int)"
    if(caption.trim() == "") throw "Invalid string"
    caption = caption.trim();
    if( typeof longitude != 'number') throw"longitude must be an float"
    
    //TODO FIX THIS
    if(typeof timestamp != 'object' ) throw "timestamp must be an object"
    let newPost = await postData.create(timestamp, latitude, longitude, image, caption);
    let userPosts = await getUserById(id);
    userPosts = userPosts.posts
    //console.log(userPosts);
    const userCollection = await users();
    userPosts.push(newPost._id.toString());
    const u2 = await userCollection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: {posts: userPosts}}, {returnDocument: 'after'});
    if(u2.lastErrorObject.n == 0){
      //console.log(newAlbum);
      throw new Error("Could not unblock successfully 2")
    }
    u2.value._id = u2.value._id.toString();
    return newPost;

  }


  export const login = async(username, password) =>{
    //ERROR CHECKING

    const userCollection = await users();
    const existingUser = await userCollection.findOne({username: username});
    if (!existingUser) {
      console.log("User not found");
      throw "Either the username or password is invalid";
    }

    console.log("existingUser pw: " + existingUser.hashedPassword);
    console.log("password: " + password);

    let compareToMatch = false;
    try {
      console.log("hashed pass1: " + existingUser.hashedPassword);

      compareToMatch = await bcrypt.compare(password, existingUser.hashedPassword);
      
    } catch (e) {
      //no op
      console.log(e);
    }
    console.log(compareToMatch);

    if (compareToMatch) {
      return existingUser;
    } else {
      console.log("Password does not match");
      throw "Either the email address or password is invalid";
    }

  }


  export const updateProfile = async(newEmail, newGender, newCity, newState, newBd) =>{

      }
  export default {create, getAll, getUserById,removeUser,blockUser, unblockUser
      , addFriend, removeFriend, changeUsername, changePassword, post,  updateProfile, login};