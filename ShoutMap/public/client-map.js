//maybe map should be declared somewhere else and imported?
let map = L.map('map').setView([40.7440, -74.0324], 13);; 
let markers = L.layerGroup().addTo(map);
L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);
//import {getAll, getPostById} from '../data/posts.js';
//let postsGroup = L.layerGroup().addTo(map);;
export const initMap = async () => {
  
  //Initialize the map with a latitude, longitude, and zoom level
  //map = 
  
  //Adds a tile layer for the map using "Stamen Toner Lite"

};

export const getCurrentLocation = async () => {
  try {
    console.log('Getting current location...');
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    map.setView([lat, lng], 17);
  } catch (error) {
    console.error('Error getting current location:', error);
  }
};

export const getPosts = async () => {
  try {
    console.log('Getting posts...');
    const response = await fetch('/api/posts');
    const posts = await response.json();

    // Remove all existing markers from the map
    //map.clearLayers();
    markers.clearLayers();
    // Create a new marker for each post and add it to the map
    /*
    posts.forEach((post) => {
       let marker = L.marker([post.latitude, post.longitude]);
      marker.bindPopup(`<p>${post.content}</p>`);
      markers.addLayer(marker);
      
    });
    */
    const currentLocation = map.getCenter();

    // Calculate the distance between the user's location and each post's location
    posts.forEach((post) => {
      const distance = map.distance(
        [post.latitude, post.longitude],
        [currentLocation.lat, currentLocation.lng]
      );
      post.distance = distance;
    });


    //sorts the posts by distance
    posts.sort((a, b) => a.distance - b.distance);

    //limit the 10 nearest posts
    const nearestPosts = posts.slice(0, 10);
    nearestPosts.forEach((post) => {
      const marker = L.marker([post.latitude, post.longitude]).addTo(map);
      if (!post.image64) {
        marker.bindPopup(`<p>"No Image Provided"<p><br><p>${post.caption}</p>`);
      } else {
        const base64Image = post.image64;
        marker.bindPopup(`<img src="${base64Image}" width="100" height="100" /> <br> <p> <a href="/posts/${post._id}">${post.caption}</a><p>`);
        markers.addLayer(marker);
      }
    });
    

  } catch (error) {
    console.error('Error getting posts:', error);
  }
};
  //Sample data
  /* 
  const posts = [
    {lat: 40.74614652694067, lng: -74.02638167339418, content: 'balls' },
    {lat: 40.74614652694067, lng: -74.03, content: 'Test 2' },
    {lat: 0, lng: 0, content: 'Test 3' },
  ]; */
  export const getPostDate = async (date) => {
    console.log("Getting dates by post...")
    try {
      const response = await fetch('/api/postDate/'+date);
      const posts = await response.json();
  
      // Remove all existing markers from the map
     // map.clearLayers();
     markers.clearLayers();
     // Create a new marker for each post and add it to the map
     posts.forEach((post) => {
        let marker = L.marker([post.latitude, post.longitude]);
        const base64Image = post.image64;
        marker.bindPopup(`<img src="${base64Image}" width="100" height="100" /> <br> <p> <a href="/posts/${post._id}">${post.caption}</a><p>`);
        markers.addLayer(marker);
     });
    } catch (error) {
      console.error('Error getting posts:', error);
    }
  };

  export const getPostFollow = async () => {
    console.log("Getting posts by followers...")
    try {
      const response = await fetch('/api/postFollowers/');
      const posts = await response.json();
      console.log("got follower posts");
      // Remove all existing markers from the map
     // map.clearLayers();
     markers.clearLayers();
     // Create a new marker for each post and add it to the map
     console.log(posts);
     posts.forEach((post) => {
        console.log(post);
        let marker = L.marker([post.latitude, post.longitude]);
        const base64Image = post.image64;
        marker.bindPopup(`<img src="${base64Image}" width="100" height="100" /> <br> <p> <a href="/posts/${post._id}">${post.caption}</a><p>`);
        markers.addLayer(marker);
     });
    } catch (error) {
      console.error('Error getting posts:', error);
    }
  };

 document.addEventListener('DOMContentLoaded', () => {
    const datepicker = document.getElementById('datepicker');
    const pikaday = new Pikaday({
      field: datepicker,
      //format: 'D MMM YYYY',
      onSelect: (date) => {
        console.log('Selected date pni:', date);
        getPostDate(date);
        //Handles date change here
      },
    });
  });
  