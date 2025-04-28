import { firebaseConfig } from '../utils/client';
// API CALLS FOR BOOKS

const endpoint = firebaseConfig.databaseURL;

const getSub = (UserId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/subscription?orderBy="UserId"&equalTo="${UserId}"`, {
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

const deleteSub = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/subscription/${firebaseKey}`, {
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
    fetch(`${endpoint}api/subscription/${firebaseKey}`, {
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
    fetch(`${endpoint}api/subscription`, {
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
    fetch(`${endpoint}api/subscription/${payload.firebaseKey}`, {
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
    fetch(`${endpoint}api/subscription?orderBy="OrganizationId"&equalTo="${firebaseKey}"`, {
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
