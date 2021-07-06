import {
  init, logout, onAuthChangeListenner, signinWithPopup, signupWithPopup, validateToken,
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
    window.localStorage.setItem('ida@id', currentUser.id);
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
export const initializeApp = async ({ appId, appKey, onLoad, onOpen, onAuthChange }) => {
  try {
    Auth.appId = appId;
    Auth.appKey = appKey;
    const socket = await socketIOClient(process.env.SOCKET_URI, { transports: ['websocket'] });
    console.log('initializeApp -> ');
    
    socket.emit('init', { client_type: appId });
    socket.on('opened', (payload) => onOpen(payload));
    socket.on('error', (payload) => console.error('ida-js-sdk -> error: ', payload));
    onAuthChangeListenner((user) => {
      setCurrentUser(user)
      onAuthChange(user);
    }, socket);
    
    socket.on('connect', () => {
      onLoad({
        signinWithPopup: (configuration) => signinWithPopup(configuration, Auth, socket),
        signupWithPopup: (configuration) => signupWithPopup(configuration, Auth, socket),
        logout: () => logout({ setCurrentUser, socket }),
        validateToken: ({ token }) => validateToken({ token }),
      });
    });
    
    init({ Auth, onAuthChange });
    
    return 
  } catch (err) {
    console.error('err', err);
  }
};

export default ({
  initializeApp
});
