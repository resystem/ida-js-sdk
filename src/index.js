import { init, signinWithPopup, signupWithPopup } from './auth';

/**
 * Authorize interface
 */
const Auth = {
  appId: null,
  appKey: null,
  currentUser: null,
  onCurrentUserChange: () => {},
};

/**
 * setting current user and dispatch on change action
 * @param {Auth.currentUser} currentUser logged user data 
 */
const setCurrentUser = (currentUser) => {
  Auth.onCurrentUserChange(currentUser);
  Auth.currentUser = currentUser;
};

/**
 * initilize application setting configurations and verify a possible logged user
 * @param {object} config application configurations 
 * @param {string} config.appId application id to be initilize 
 * @param {string} config.appKey authentication token used in the initialization 
 * @returns {Auth} authorize
 */
const initializeApp = ({ appId, appKey }) => {
  Auth.appId = appId;
  Auth.appKey = appKey;

  if (window) {
    init({ Auth, setCurrentUser });
  }

  return {
    onCurrentUserChange: (callback) => {
      Auth.onCurrentUserChange = (data) => {
        window.localStorage.setItem('ida@id', data.ida);
        window.localStorage.setItem('ida@token', data.token);
        callback(data)
      };
    },
    signinWithPopup: (configuration) => signinWithPopup(configuration, setCurrentUser, Auth),
    signupWithPopup: (configuration) => signupWithPopup(configuration, setCurrentUser, Auth),
  };
};

export default {
  initializeApp
};
