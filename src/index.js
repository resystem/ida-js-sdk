import {
  init, logout, signinWithPopup, signupWithPopup, validateToken,
} from './auth';
import socketIOClient from 'socket.io-client';

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
export const initializeApp = async ({ appId, appKey }) => {
  Auth.appId = appId;
  Auth.appKey = appKey;
  try {
    const socket = await socketIOClient(process.env.SOCKET_URI, { transports: ['websocket'] });
    socket.emit('connect', { client_type: appId });
    socket.on('opened', (payload) => console.log('ida-js-sdk -> window opened: ', payload));
    socket.on('auth_change', (payload) => console.log('ida-js-sdk -> update_auth: ', payload));
    socket.on('error', (payload) => console.log('ida-js-sdk -> error: ', payload));
    console.log('initializeApp -> socket', socket);

  } catch (err) {
    console.log('err', err);
  }

  const checkWindow = setInterval(() => {
    console.log('ida listen...');
    if (!(typeof window === 'undefined')) {
      console.log('init ida...');
      init({ Auth, setCurrentUser });
    }
  }, 500);

  return {
    onCurrentUserChange: (callback) => {
      Auth.onCurrentUserChange = callback;
    },
    signinWithPopup: (configuration) => signinWithPopup(configuration, setCurrentUser, Auth, socket),
    signupWithPopup: (configuration) => signupWithPopup(configuration, setCurrentUser, Auth, socket),
    logout: () => logout({ setCurrentUser, socket }),
    validateToken: ({ token }) => validateToken({ token, setCurrentUser, socket }),
  };
};

export default ({
  initializeApp
});
