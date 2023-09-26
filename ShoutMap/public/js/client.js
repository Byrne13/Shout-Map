import { initMap, getPosts, getCurrentLocation, getPostFollow} from '/public/client-map.js';
initMap();
document.getElementById('get-posts-btn').addEventListener('click', getPosts);
document.getElementById('get-Followerposts-btn').addEventListener('click', getPostFollow);
document.getElementById('get-location-btn').addEventListener('click', getCurrentLocation);