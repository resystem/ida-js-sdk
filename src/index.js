import { signWithPopup } from './auth';

/**
 * Authorize interface
 */
const Auth = {
  appId: null,
  appToken: null,
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
 * @param {string} config.appToken authentication token used in the initialization 
 * @returns {Auth} authorize
 */
const initializeApp = ({ appId, appToken }) => {
  Auth.appId = appId;
  Auth.appToken = appToken;

  return {
    onCurrentUserChange: (callback) => {
      Auth.onCurrentUserChange = (data) => callback(data);
    },
    signWithPopup: (configuration) => signWithPopup(configuration, setCurrentUser),
  };
};

export default {
  initializeApp
};
