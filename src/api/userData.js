'use client';

import PropTypes from 'prop-types';
import { clientCredentials } from '@/utils/client';

const endpoint = clientCredentials.databaseURL;

function UpdateUserData({ uid, displayName, email, photoURL }) {
  if (!uid) return null;

  const userData = {
    uid,
    name: displayName || 'User',
    email,
    photoURL,
    lastLogin: Date.now(),
  };

  const userUrl = `${endpoint}/users/${uid}.json`;

  return (
    fetch(userUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update user data');
        }
        return response.json();
      })
      // If I want the option to look up someone by their email later:
      // .then(() => {
      //   if (typeof window !== 'undefined') { // btoa is browser-only
      //     const emailEncoded = btoa(email);
      //     const emailMapUrl = `${endpoint}/emailToUid/${emailEncoded}.json`;
      //     return fetch(emailMapUrl, {
      //       method: 'PUT',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify(uid),
      //     });
      //   }
      //   return null;
      // })
      .catch((error) => {
        console.error('Error updating user data:', error);
      })
  );
}

UpdateUserData.propTypes = {
  uid: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  photoURL: PropTypes.string,
};

export default UpdateUserData;
