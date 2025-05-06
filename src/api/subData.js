import { firebaseConfig } from '@/utils/client';

const endpoint = firebaseConfig.databaseURL;

const getSub = (userId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/subscription?orderBy="userId"&equalTo="${userId}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

const getEverySub = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/subscription`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

const deleteSub = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/subscription/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const getSingleSub = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/subscription/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const createSub = (payload) =>
  new Promise((resolve, reject) => {
    console.log('Creating subscription with payload:', payload);

    fetch(`${endpoint}/api/subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        console.log('Server response status:', response.status);

        if (!response.ok) {
          return response.text().then((text) => {
            console.error('Error response text:', text);
            throw new Error(`Server returned ${response.status}: ${text.substring(0, 150)}...`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Create subscription response:', data);
        resolve(data);
      })
      .catch((error) => {
        console.error('Create subscription error:', error);
        reject(error);
      });
  });

const updateSub = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/subscription/${payload.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const getSubByOrg = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/subscription/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

export { getSub, createSub, deleteSub, getSingleSub, updateSub, getSubByOrg, getEverySub };
