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
  width: 400,
  height: 480,
};

/**
 * call ida signin popup and acitve response listener
 * @param {object} popupConfiguration popup window configuration 
 * @param {number} popupConfiguration.width widow width size 
 * @param {number} popupConfiguration.height widow height size
 * @returns {Promise} contains login data or error
 */
export const signinWithPopup = (popupConfiguration = defaultPopupConfiguration, Auth, socket) => {
  // let logged = false;
  try {
    const openedWindow = window.open(
      `${process.env.ACCOUNTS_URI}?appId=${Auth.appId}&appKey=${Auth.appKey}&client_id=${socket.id}`,
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
    socket.on('auth_change', async () => {
      openedWindow.close();
    });
  } catch (err) {
    console.error('signinWithPopup -> err', [err]);
  }
};

/**
 * call ida signup popup and acitve response listener
 * @param {object} popupConfiguration popup window configuration 
 * @param {number} popupConfiguration.width widow width size 
 * @param {number} popupConfiguration.height widow height size
 * @returns {Promise} contains login data or error
 */
export const signupWithPopup = (popupConfiguration = defaultPopupConfiguration, Auth, socket) => {
  // let logged = false;
  try {
    const openedWindow = window.open(
      `${process.env.ACCOUNTS_URI}/signup?appId=${Auth.appId}&appKey=${Auth.appKey}&client_id=${socket.id}`,
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
    socket.on('auth_change', async () => {
      openedWindow.close();
    });
  } catch (err) {
    console.error('signupWithPopup -> err', [err]);
  }
};

/**
 * verify if has logged user and if token is valid 
 * @param {object} params initialization parameters
 */
export const init = async ({ onAuthChange }) => {
  const ida = window.localStorage.getItem('ida@id');
  const token = window.localStorage.getItem('ida@token');
  
  if (!ida || !token) {
    window.localStorage.removeItem('ida@id');
    window.localStorage.removeItem('ida@token');

    onAuthChange(null);
    return;
  }

  let tokenVerification;
  
  try {
    tokenVerification = await verifyAuth_(token);
  } catch (err) {
    console.error('err', [err]);
    window.localStorage.removeItem('ida@id');
    window.localStorage.removeItem('ida@token');
    onAuthChange(null);
    return;
  }

  if (tokenVerification) {
    onAuthChange({ ...tokenVerification.data, token });
  }
};

/**
 * logout - Make logout
 * @param {object} params initialization parameters
 */
export const logout = async ({ setCurrentUser }) => {
  window.localStorage.removeItem('ida@id');
  window.localStorage.removeItem('ida@token');

  setCurrentUser(null);
};

export const validateToken = async ({ token, setCurrentUser }) => {
  let tokenVerification;
  
  try {
    tokenVerification = await verifyAuth_(token);
  } catch (err) {
    console.error('err', [err]);
    window.localStorage.removeItem('ida@id');
    window.localStorage.removeItem('ida@token');

    setCurrentUser(null);
  }

  return ({ ...tokenVerification.data, token });
}

export const onAuthChangeListenner = (cb, socket) => {
  socket.on('auth_change', async (payload) => {
    const user = await validateToken({ token: payload.token });
    cb(user);
  });
}