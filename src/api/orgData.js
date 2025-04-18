import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getOrg = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/organizations.json?orderBy="uid"&equalTo="${uid}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

const getEveryOrg = () =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/organizations.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });

const deleteOrg = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/organizations/${firebaseKey}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const getSingleOrg = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/organizations/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const createOrg = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/organizations.json`, {
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

const updateOrg = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/organizations/${payload.firebaseKey}.json`, {
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

const getOrgSubs = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/organizations.json?orderBy="organizationId"&equalTo="${firebaseKey}"`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(Object.values(data)))
      .catch(reject);
  });
export { getOrg, createOrg, deleteOrg, getSingleOrg, updateOrg, getEveryOrg, getOrgSubs };
