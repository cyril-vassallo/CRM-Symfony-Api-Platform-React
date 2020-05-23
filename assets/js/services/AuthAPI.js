import axios from "axios";
import jwtDecode from "jwt-decode";
 
/**
 * Logout function called on click button
 */
function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Request to login_Check api
 * Save response token in the localStorage
 * Then setup Token
 * 
 * @param {object} credentials 
 */
function authenticate(credentials) {
  return axios
    .post("http://localhost:8000/api/login_check", credentials)
    .then((response) => response.data.token)
    .then((token) => {
      window.localStorage.setItem("authToken", token);
      setAxiosToken(token);
    });
}


/**
 * Call on each app reload
 * it verify is the token exist and still valid
 * Then setup Token
 */
function setup(){
  const token = window.localStorage.getItem("authToken");

  if(token) {
    const {exp: expiration} = jwtDecode(token);
    if(expiration * 1000 > new Date().getTime()){
      console.log("Axios connexion valid !");
      setAxiosToken(token);
    }
  }
}


/**
 * Setup a token in axios default header as Bearer
 * 
 * @param {string} token
 * */
function setAxiosToken(token){
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}


/**
 * Check is user is authenticated
 * 
 * @return  {boolean} 
 */
function isAuthenticated(){
  const token = window.localStorage.getItem("authToken");

  if(token){
    const {exp :expiration} = jwtDecode(token)
    if(expiration * 1000 > new Date().getTime()){
      return true;
    }
    return false;
  }
  return false;
}


export default {
  authenticate,
  logout,
  setup,
  isAuthenticated
};
