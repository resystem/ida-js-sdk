const defaultPopupConfiguration = {
  width: 320,
  height: 480,
};

/**
 * call ida sign popup and acitve response listener
 * @param {object} popupConfiguration popup window configuration 
 * @param {number} popupConfiguration.width widow width size 
 * @param {number} popupConfiguration.height widow height size 
 */
export const signWithPopup = (popupConfiguration = defaultPopupConfiguration) => {
  const openedWindow = window.open(
    process.env.ACCOUNTS_URI,
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

  setTimeout(() => {
    openedWindow.postMessage('signing', '*');
    window.addEventListener("message", (windowMessage) => {
      const data = JSON.parse(windowMessage.data);
      console.log(data);
    }, false);
  }, 500);
};
