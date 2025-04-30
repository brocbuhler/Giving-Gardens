import { firebaseConfig } from '@/utils/client';

const endpoint = firebaseConfig.databaseURL;

const getOrg = (userId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/organization?orderBy="userId"&equalTo="${userId}"`, {
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

const deleteOrg = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/organization/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch(reject);
  });

const getSingleOrg = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/organization/${id}`, {
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
    fetch(`${endpoint}api/organization/${payload.id}`, {
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

const getOrgSubs = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}api/subscription.json?orderBy="OrganizationId"&equalTo="${id}"`, {
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
