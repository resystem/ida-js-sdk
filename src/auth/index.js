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
  let logged = false;
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

    openedWindow.addEventListener('onbeforeunload', () => {
      if (!logged) reject({ error: 'window-closed' });
    }, { passive: true });

    window.addEventListener("message", (windowMessage) => {
      const response = JSON.parse(windowMessage.data);
      if (response.error) reject(response)

      logged = true;
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
  let logged = false;
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

    openedWindow.addEventListener('onbeforeunload', () => {
      if (!logged) reject({ error: 'window-closed' });
    }, { passive: true });

    window.addEventListener("message", (windowMessage) => {
      const response = JSON.parse(windowMessage.data);
      if (response.error) reject(response)

      logged = true;
      openedWindow.close();
      resolve(response);
      setCurrentUser(response);
    }, false);
  });
};
