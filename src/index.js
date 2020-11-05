import {
  init, logout, signinWithPopup, signupWithPopup, validateToken,
} from './auth';

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
  if (currentUser) {
    window.localStorage.setItem('ida@id', currentUser.ida);
    window.localStorage.setItem('ida@token', currentUser.token);
  }

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
export const initializeApp = ({ appId, appKey }) => {
  Auth.appId = appId;
  Auth.appKey = appKey;

  let timer = setInterval(() => {
    console.log('ida listen...');
    if (!(typeof window === 'undefined')) {
      console.log('init ida');
      clearInterval(timer);
      init({ Auth, setCurrentUser });
    }
  }, 200);

  return {
    onCurrentUserChange: (callback) => {
      Auth.onCurrentUserChange = callback;
    },
    signinWithPopup: (configuration) => signinWithPopup(configuration, setCurrentUser, Auth),
    signupWithPopup: (configuration) => signupWithPopup(configuration, setCurrentUser, Auth),
    logout: () => logout({ setCurrentUser }),
    validateToken: ({ token }) => validateToken({ token, setCurrentUser }),
  };
};

export default ({
  initializeApp
});
