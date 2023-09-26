
//function to check login form inputs
function validateLogin() {
  let username = document.getElementById("usernameInput").value;
  let password = document.getElementById("passwordInput").value;
  let errorContainer = document.getElementById("error-container");
  errorContainer.innerHTML = "";
  try {
 // Perform validation checks
  //username
  if (!username) throw 'You must provide a username';
  if (typeof username !== 'string') throw 'Username must be a string';
  if (username.trim().length == 0)
    throw 'Username cannot be an empty string or just spaces';
  username = username.trim();
  if (25 < username.length||username.length <= 2)
    throw 'Username cannot be shorter than 2 characters or longer than 25';
 
  //password
  if (!password) throw 'You must provide a password';
  if (typeof password !== 'string') throw 'Password must be a string';
  if (password.trim().length == 0)
    throw 'Password cannot be an empty string or just spaces';
  password = password.trim();
  if (password.length <= 8)
    throw 'Password cannot be shorter than 9 characters';
  regex = /^(?=.*\d)(?=.*[!@#$%^&*])\S*$/;
  if (!regex.test(password)) throw 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character and not include any spaces'
  
  } catch (error) {
    const errorElement = document.createElement("p");
    errorElement.id = "error-message";
    errorElement.textContent = error;
    errorContainer.appendChild(errorElement);
    return false;
  }
 
  return true;
}

//function to check registration form inputs
function validateRegistration() {
  let firstName = document.getElementById("firstNameInput").value;
  let lastName = document.getElementById("lastNameInput").value;
  let username = document.getElementById("usernameInput").value;
  //let emailAddress = document.getElementById("emailAddressInput").value;
  let password = document.getElementById("passwordInput").value;
  let confirmPassword = document.getElementById("confirmPasswordInput").value;
  let gender = document.getElementById("genderInput").value;
  let birthday = document.getElementById("birthdayInput").value;
  let city = document.getElementById("cityInput").value;
  let state = document.getElementById("stateInput").value;
  let errorContainer = document.getElementById("error-container");
  errorContainer.innerHTML = "";
  try {
 // Perform validation checks
 let regex = /[\s\d]/;

 //firstName error checking
 if (!firstName) throw 'You must provide a first name';
   if (typeof firstName !== 'string') throw 'First name must be a string';
   if (firstName.trim().length == 0)
     throw 'First name cannot be an empty string or just spaces';
   firstName = firstName.trim();
   if (25 < firstName.length||firstName.length <= 2)
     throw 'First name cannot be shorter than 2 characters or longer than 25';
   if (regex.test(firstName)) throw 'First name cannot contain numbers or spaces'

 //lastName
 if (!lastName) throw 'You must provide a last name';
   if (typeof lastName !== 'string') throw 'Last name must be a string';
   if (lastName.trim().length == 0)
     throw 'Last name cannot be an empty string or just spaces';
   lastName = lastName.trim();
   if (25 < lastName.length||lastName.length <= 2)
     throw 'Last name cannot be shorter than 2 characters or longer than 25';
   if (regex.test(lastName)) throw 'Last name cannot contain numbers or spaces'

 //username
 if (!username) throw 'You must provide a username';
 if (typeof username !== 'string') throw 'Username must be a string';
 if (username.trim().length == 0)
   throw 'Username cannot be an empty string or just spaces';
 username = username.trim();
 if (25 < username.length||username.length <= 2)
   throw 'Username cannot be shorter than 2 characters or longer than 25';
//email
// if (!emailAddress) throw 'You must provide an email';
//    if (typeof emailAddress !== 'string') throw 'Email must be a string';
//     if (emailAddress.trim().length == 0)
//       throw 'Email cannot be an empty string or just spaces';
//     emailAddress = emailAddress.trim();
//     emailAddress = emailAddress.toLowerCase();
//     regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!regex.test(emailAddress)) throw 'Email must be a valid format'

 //password
 if (!password) throw 'You must provide a password';
   if (typeof password !== 'string') throw 'Password must be a string';
   if (password.trim().length == 0)
     throw 'Password cannot be an empty string or just spaces';
   password = password.trim();
   if (password.length <= 8)
     throw 'Password cannot be shorter than 9 characters';
   regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])\S*$/;
   if (!regex.test(password)) throw 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character and not include any spaces'

  //confirm password
  if(password!=confirmPassword) throw 'Passwords must match'

 //gender
 if (!gender) throw 'You must provide a gender';
   if (typeof gender !== 'string') throw 'Gender must be a string';
   if (gender.trim().length == 0)
     throw 'Gender cannot be an empty string or just spaces';
   gender = gender.trim();
   gender = gender.toLowerCase();
   if (gender !='male'&&gender!='female'&&gender!='none'&&gender!='other')
     throw 'Gender must be "Male", "Female", "Other", or "Prefer not to say';
  
  //birthday
  if (!birthday) throw 'You must provide a birthday';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) throw 'Birthday must be in a valid format';
  const dateObj = new Date(birthday);
  if (isNaN(dateObj.getTime())) throw 'Birthday must be in a valid format';
  const year = dateObj.getFullYear();
  if (year < 1900 || year > 2100) throw 'Birthday year must be possible';
  // Check that the month is between 1 and 12
  const month = dateObj.getMonth();
  if (month < 0 || month > 11) throw 'Birthday month must be between 1 and 12';
  // Check that the day is valid for the given month and year
  const day = dateObj.getDate();
  if (day < 1 || day > new Date(year, month, 0).getDate()) throw 'Birthday day must be valid';

  // Check if the person is at least 13 years old
  const minAge = 13;
  const today = new Date();
  const diff = today.getTime() - dateObj.getTime();
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  if (age < minAge) throw 'User too young to make an account';
  

  //city
  regex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
  if (!city) throw 'You must provide a city';
   if (typeof city !== 'string') throw 'City must be a string';
   if (city.trim().length == 0)
     throw 'City cannot be an empty string or just spaces';
   city = city.trim();
   if (25 < city.length||city.length <= 2)
     throw 'City cannot be shorter than 2 characters or longer than 25';
   if (!regex.test(city)) throw 'City invalid'

  //state
  const stateAbbrs = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];  
  if (!state) throw 'You must provide a state';
   if (typeof state !== 'string') throw 'State must be a string';
   if (state.trim().length == 0)
     throw 'State cannot be an empty string or just spaces';
   state = state.trim();
   if (!stateAbbrs.includes(state))
     throw 'State must be valid';

  } catch (error) {
    const errorElement = document.createElement("p");
    errorElement.textContent = error;
    errorElement.id = "error-message";
    errorContainer.appendChild(errorElement);
    window.scrollTo({
      top: errorContainer.offsetTop,
      behavior: 'smooth'
    });
    return false;
  }
 
  return true;
}



//function to check comment input
function validateComment() {
  let comment = document.getElementById('comment');   
  let errorContainer = document.getElementById("error-container");
  errorContainer.innerHTML = "";
  try { 
 //comment error checking
 if (!comment) throw 'Cannot submit empty comment';
 if (typeof comment !== 'string') throw 'Commenting not fully implemented';
   if (comment.trim().length == 0)
     throw 'Comment cannot be an empty string or just spaces';
   comment = comment.trim();
  } catch (error) {
    const errorElement = document.createElement("p");
    errorElement.textContent = error;
    errorElement.id = "error-message";
    errorContainer.appendChild(errorElement);
    window.scrollTo({
      top: errorContainer.offsetTop,
      behavior: 'smooth'
    });
    return false;
  }
  return true;
}



//validator for postform

//function to check post input
// const $file = document.querySelector(".local");
// let image = "";  

//   $file.addEventListener("change", (event) => {
//     const selectedfile = event.target.files;

//     if (selectedfile.length > 0) {
//       const [imageFile] = selectedfile;
//       const fileReader = new FileReader();
//       fileReader.onload = () => {
//       image = fileReader.result;
//         //console.log('base64:', srcData)
//       };
//       fileReader.readAsDataURL(imageFile);
//     }
//     console.log("image: "+ image);
//   });


function validatePost() {
  const captionInput = document.getElementById('captionInput');
  const mediaInput = document.getElementById('mediaInput');
  const errorContainer = document.getElementById("error-container");
  errorContainer.innerHTML = "";

  try {
    // Validate caption
    const caption = captionInput.value.trim();
    if (!caption) throw 'Cannot submit empty caption';
    if (typeof caption !== 'string') throw 'Caption must be a string';
    if (caption.length > 75) throw 'Caption must be less than 75 characters';

    // Convert uploaded file to base64
    const file = mediaInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      (async () => {
        try {
          const image = reader.result;

          // Validate image
          if (!image) throw 'Image failed to convert';
          if (typeof image !== 'string') throw 'Image base64 must be a string';
          if (image.trim().length == 0) throw 'Image failed to convert';

          // Get location
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          console.log('lat: ' + lat + ', lng: ' + lng);

          document.getElementById('latitudeInput').value = lat;
          document.getElementById('longitudeInput').value = lng;

          // Submit form if validation passes
          document.getElementById('imageInput').value = image;
          document.getElementById('post-form').submit();

        } catch (innerError) {
          const errorElement = document.createElement("p");
          errorElement.textContent = innerError;
          errorElement.id = "error-message";
          errorContainer.appendChild(errorElement);
          window.scrollTo({
            top: errorContainer.offsetTop,
            behavior: 'smooth'
          });
          return false;
        }
      })();
    }
  } catch (error) {
    const errorElement = document.createElement("p");
    errorElement.textContent = error;
    errorElement.id = "error-message";
    errorContainer.appendChild(errorElement);
    window.scrollTo({
      top: errorContainer.offsetTop,
      behavior: 'smooth'
    });
    return false;
  }

  return false;
}


//if we chose to implement user profile info updates
function validateUpdate() {
  let firstName = document.getElementById("firstNameInput").value;
  let lastName = document.getElementById("lastNameInput").value;
  let emailAddress = document.getElementById("emailAddressInput").value;
  let password = document.getElementById("passwordInput").value;
  let confirmPassword = document.getElementById("confirmPasswordInput").value;
  let gender = document.getElementById("genderInput").value;
  let birthday = document.getElementById("birthdayInput").value;
  let city = document.getElementById("cityInput").value;
  let state = document.getElementById("stateInput").value;
  let errorContainer = document.getElementById("error-container");
  errorContainer.innerHTML = "";
  try {
 // Perform validation checks
 let regex = /[\s\d]/;

 //firstName error checking
 if (!firstName) throw 'You must provide a first name';
   if (typeof firstName !== 'string') throw 'First name must be a string';
   if (firstName.trim().length == 0)
     throw 'First name cannot be an empty string or just spaces';
   firstName = firstName.trim();
   if (25 < firstName.length||firstName.length <= 2)
     throw 'First name cannot be shorter than 2 characters or longer than 25';
   if (regex.test(firstName)) throw 'First name cannot contain numbers or spaces'

 //lastName
 if (!lastName) throw 'You must provide a last name';
   if (typeof lastName !== 'string') throw 'Last name must be a string';
   if (lastName.trim().length == 0)
     throw 'Last name cannot be an empty string or just spaces';
   lastName = lastName.trim();
   if (25 < lastName.length||lastName.length <= 2)
     throw 'Last name cannot be shorter than 2 characters or longer than 25';
   if (regex.test(lastName)) throw 'Last name cannot contain numbers or spaces'

 //email
 if (!emailAddress) throw 'You must provide an email';
   if (typeof emailAddress !== 'string') throw 'Email must be a string';
   if (emailAddress.trim().length == 0)
     throw 'Email cannot be an empty string or just spaces';
   emailAddress = emailAddress.trim();
   emailAddress = emailAddress.toLowerCase();
   regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!regex.test(emailAddress)) throw 'Email must be a valid format'

 //password
 if (!password) throw 'You must provide a password';
   if (typeof password !== 'string') throw 'Password must be a string';
   if (password.trim().length == 0)
     throw 'Password cannot be an empty string or just spaces';
   password = password.trim();
   if (password.length <= 8)
     throw 'Password cannot be shorter than 9 characters';
   regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])\S*$/;
   if (!regex.test(password)) throw 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character and not include any spaces'

  //confirm password
  if(password!=confirmPassword) throw 'Passwords must match'

 //gender
 if (!gender) throw 'You must provide a gender';
   if (typeof gender !== 'string') throw 'Gender must be a string';
   if (gender.trim().length == 0)
     throw 'Gender cannot be an empty string or just spaces';
   gender = gender.trim();
   gender = gender.toLowerCase();
   if (gender !='m'&&gender!='f'&&gender!='none'&&gender!='other')
     throw 'Gender must be "Male", "Female", "Other", or "Prefer not to say';
  
  //birthday
  if (!birthday) throw 'You must provide a birthday';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) throw 'Birthday must be in a valid format';
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) throw 'Birthday must be in a valid format';
  const year = dateObj.getFullYear();
  if (year < 1900 || year > 2100) throw 'Birthday year must be between ';
  // Check that the month is between 1 and 12
  const month = dateObj.getMonth();
  if (month < 0 || month > 11) throw 'Birthday month must be between 1 and 12';
  // Check that the day is valid for the given month and year
  const day = dateObj.getDate();
  if (day < 1 || day > new Date(year, month, 0).getDate()) throw 'Birthday day must be valid';
  const date = new Date(dateStr);

  // Check if the person is at least 13 years old
  const minAge = 13;
  const today = new Date();
  const diff = today.getTime() - date.getTime();
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  if (age < minAge) throw 'User too young to make an account';
  

  //city
  regex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
  if (!city) throw 'You must provide a city';
   if (typeof city !== 'string') throw 'City must be a string';
   if (city.trim().length == 0)
     throw 'City cannot be an empty string or just spaces';
   city = city.trim();
   if (25 < city.length||city.length <= 2)
     throw 'City cannot be shorter than 2 characters or longer than 25';
   if (regex.test(city)) throw 'City invalid'

  //state
  const stateAbbrs = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];  
  if (!state) throw 'You must provide a state';
   if (typeof state !== 'string') throw 'State must be a string';
   if (state.trim().length == 0)
     throw 'State cannot be an empty string or just spaces';
   state = state.trim();
   if (!stateAbbrs.includes(state))
     throw 'State must be valid';

  } catch (error) {
    const errorElement = document.createElement("p");
    errorElement.id = "error-message";
    errorElement.textContent = error;
    errorContainer.appendChild(errorElement);
    return false;
  }
 
  return true;
}