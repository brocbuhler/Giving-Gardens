import { deleteOrg, getOrgSubs, getSingleOrg } from './orgData';
import { deleteSub, getSingleSub } from './subData';

const viewSubDetails = (subFirebaseKey) =>
  new Promise((resolve, reject) => {
    getSingleSub(subFirebaseKey)
      .then((subObject) => {
        getSingleSub(subObject.organizationId).then((orgObject) => {
          resolve({ orgObject, ...subObject });
        });
      })
      .catch((error) => reject(error));
  });

const viewOrgDetails = (orgsFirebaseKey) =>
  new Promise((resolve, reject) => {
    Promise.all([getSingleOrg(orgsFirebaseKey), getOrgSubs(orgsFirebaseKey)])
      .then(([orgObject, orgSubsArray]) => {
        resolve({ ...orgObject, subscriptions: orgSubsArray });
      })
      .catch((error) => reject(error));
  });

const deleteOrgSubs = (organizationId) =>
  new Promise((resolve, reject) => {
    getOrgSubs(organizationId)
      .then((subsArray) => {
        console.warn(subsArray, "Organization's Subscribers");
        const deleteSubsPromises = subsArray.map((subscriptions) => deleteSub(subscriptions.firebaseKey));

        Promise.all(deleteSubsPromises).then(() => {
          deleteOrg(organizationId).then(resolve);
        });
      })
      .catch((error) => reject(error));
  });

export { deleteOrgSubs, viewOrgDetails, viewSubDetails };
