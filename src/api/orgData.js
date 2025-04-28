import { firebaseConfig } from '../utils/client';

const endpoint = firebaseConfig.databaseURL;

const getOrg = (UserId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/organization?orderBy="UserId"&equalTo="${UserId}"`, {
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
    console.warn(`this is my api endpoint`, endpoint);
    fetch(`${endpoint}api/organization`, {
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
    fetch(`${endpoint}api/organization/${firebaseKey}`, {
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
    fetch(`${endpoint}api/organization/${firebaseKey}`, {
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
    fetch(`${endpoint}api/organization`, {
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
    fetch(`${endpoint}api/organization/${payload.firebaseKey}`, {
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
    fetch(`${endpoint}api/subscription.json?orderBy="OrganizationId"&equalTo="${firebaseKey}"`, {
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
