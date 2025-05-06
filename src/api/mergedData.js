import { deleteOrg, getOrgSubs, getSingleOrg } from './orgData';
import { deleteSub, getSingleSub, getSubByOrg } from './subData';

const viewSubDetails = (subId) =>
  new Promise((resolve, reject) => {
    getSingleSub(subId)
      .then((subObject) => {
        getSingleSub(subObject.organizationId).then((orgObject) => {
          resolve({ orgObject, ...subObject });
        });
      })
      .catch((error) => reject(error));
  });
// merge call edited to account for back end change back after fix
const viewOrgDetails = (id) =>
  new Promise((resolve, reject) => {
    Promise.all([getSingleOrg(id), getSubByOrg(id)])
      .then(([orgObject]) => {
        resolve({ ...orgObject });
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
