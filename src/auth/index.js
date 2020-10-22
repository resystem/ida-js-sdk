import axios from 'axios';

/**
 * request to api token validation
 * @returns {Promise} contains verify data
 */
const verifyAuth_ = (token) => axios.post(
  `${process.env.API_URI}/validate-token`,
  { token },
  {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  },
);

const defaultPopupConfiguration = {
  width: 320,
  height: 480,
};

/**
 * call ida signin popup and acitve response listener
 * @param {object} popupConfiguration popup window configuration 
 * @param {number} popupConfiguration.width widow width size 
 * @param {number} popupConfiguration.height widow height size
 * @returns {Promise} contains login data or error
 */
export const signinWithPopup = (popupConfiguration = defaultPopupConfiguration, setCurrentUser, Auth) => {
  // let logged = false;
  const openedWindow = window.open(
    `${process.env.ACCOUNTS_URI}?appId=${Auth.appId}&appKey=${Auth.appKey}`,
    '',
    `
      toolbar=no,
      location=no,
      status=no,
      menubar=no,
      scrollbars=yes,
      resizable=no,
      width=${popupConfiguration.width},
      height=${popupConfiguration.height}
    `,
  );

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      openedWindow.postMessage('signing', '*');
    }, 2000);

    // openedWindow.addEventListener('onbeforeunload', () => {
    //   if (!logged) reject({ error: 'window-closed' });
    // }, { passive: true });

    window.addEventListener("message", (windowMessage) => {
      const response = JSON.parse(windowMessage.data);
      if (response.error) reject(response)
  
      // logged = true;
      openedWindow.close();
      resolve(response);
      setCurrentUser(response);
    }, false);
  });
};

/**
 * call ida signup popup and acitve response listener
 * @param {object} popupConfiguration popup window configuration 
 * @param {number} popupConfiguration.width widow width size 
 * @param {number} popupConfiguration.height widow height size
 * @returns {Promise} contains login data or error
 */
export const signupWithPopup = (popupConfiguration = defaultPopupConfiguration, setCurrentUser, Auth) => {
  // let logged = false;
  const openedWindow = window.open(
    `${process.env.ACCOUNTS_URI}/signup?appId=${Auth.appId}&appKey=${Auth.appKey}`,
    '',
    `
      toolbar=no,
      location=no,
      status=no,
      menubar=no,
      scrollbars=yes,
      resizable=no,
      width=${popupConfiguration.width},
      height=${popupConfiguration.height}
    `,
  );

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      openedWindow.postMessage('signing', '*');
    }, 2000);

    // openedWindow.addEventListener('onbeforeunload', () => {
    //   if (!logged) reject({ error: 'window-closed' });
    // }, { passive: true });

    window.addEventListener("message", (windowMessage) => {
      const response = JSON.parse(windowMessage.data);

      if (response.error) reject(response)

      // logged = true;
      openedWindow.close();
      resolve(response);
      setCurrentUser(response);
    }, false);
  });
};

/**
 * verify if has logged user and if token is valid 
 * @param {object} params initialization parameters
 */
export const init = async ({ setCurrentUser }) => {
  const ida = window.localStorage.getItem('ida@id');
  const token = window.localStorage.getItem('ida@token');
  
  if (!ida || !token) {
    window.localStorage.removeItem('ida@id');
    window.localStorage.removeItem('ida@token');

    setCurrentUser(null);
    return;
  }

  let tokenVerification;
  
  try {
    tokenVerification = await verifyAuth_(token);
  } catch (err) {
    window.localStorage.removeItem('ida@id');
    window.localStorage.removeItem('ida@token');

    setCurrentUser(null);
  }

  setCurrentUser({ ...tokenVerification.data, token });
};
