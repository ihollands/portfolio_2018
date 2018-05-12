// Promise polyfill
import PromisePolyfill from 'es6-promise';

// Promises
export default (url) => {

  // Assign Promise polyfill
  const Promise = PromisePolyfill.Promise;

  // Return a new promise.
  return new Promise((resolve, reject) => {

    // Do the usual XHR stuff
    const req = new XMLHttpRequest();

    req.open('GET', url);
    // req.setRequestHeader('Access-Control-Allow-Origin', '*');
    // req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

    req.onload = () => {

      // This is called even on 404 etc
      // so check the status
      if (req.status === 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = () => {
      reject(Error('Network Error'));
    };

    // Make the request
    req.send();
  });
};
