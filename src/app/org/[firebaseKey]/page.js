'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { viewOrgDetails } from '@/api/mergedData';
import Link from 'next/link';
import SubCard from '../../../components/subCard';
// change link to take you to partially filled out subscription page
export default function ViewOrg({ params }) {
  const [orgDetails, setOrgDetails] = useState({});
  // grab firebaseKey from url
  const { firebaseKey } = params;
  console.log('params:', params);

  // make call to API layer to get the data
  const viewOrgSubs = () => {
    viewOrgDetails(firebaseKey).then(setOrgDetails);
  };
  useEffect(() => {
    viewOrgSubs();
  }, [firebaseKey]);

  console.warn(`This is the problem: `, orgDetails.subscriptions);

  return (
    <div className="mt-5 d-flex flex-wrap">
      <div className="d-flex flex-column">
        <img src={orgDetails.image} alt={orgDetails.title} style={{ width: '300px' }} />
      </div>
      <div className="text-white ms-5 details">
        <h5>
          {orgDetails.title}
          {orgDetails.description}
        </h5>
        <p>Organization Email: {orgDetails.email}</p>
      </div>
      <div className="d-flex flex-wrap">
        {/* TODO: map over books here using BookCard component */}
        {Array.isArray(orgDetails.subscriptions) && orgDetails.subscriptions.length > 0 ? orgDetails.subscriptions.map((sub) => <SubCard key={sub.firebaseKey} subObj={sub} onUpdate={viewOrgSubs} />) : <p>No subscribers</p>}
      </div>
      <Link className="nav-link" href="/orgmain">
        Subscribe?
      </Link>
    </div>
  );
}

ViewOrg.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
