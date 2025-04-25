import { firebaseConfig } from '@/utils/client';
// API CALLS FOR BOOKS

const endpoint = firebaseConfig.databaseURL;

const getSub = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/subscriptions.json?orderBy="uid"&equalTo="${uid}"`, {
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
    fetch(`${endpoint}/subscriptions.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

const deleteSub = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/subscriptions/${firebaseKey}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const getSingleSub = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/subscriptions/${firebaseKey}.json`, {
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
    fetch(`${endpoint}/subscriptions.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const updateSub = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/subscriptions/${payload.firebaseKey}.json`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const getSubByOrg = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/subscriptions.json?orderBy="organizationId"&equalTo="${firebaseKey}"`, {
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
