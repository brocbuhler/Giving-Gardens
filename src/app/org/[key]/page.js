'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { viewOrgDetails } from '@/api/mergedData';

export default function ViewOrg({ params }) {
  const [orgDetails, setOrgDetails] = useState({});

  // grab firebaseKey from url
  const { firebaseKey } = params;

  // make call to API layer to get the data
  useEffect(() => {
    viewOrgDetails(firebaseKey).then(setOrgDetails);
  }, [firebaseKey]);

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
    </div>
  );
}

ViewOrg.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
