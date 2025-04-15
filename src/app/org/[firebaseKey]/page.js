'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { viewOrgDetails } from '@/api/mergedData';

export default function ViewBook({ params }) {
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
          {orgDetails.title} by {orgDetails.authorObject?.first_name} {orgDetails.authorObject?.last_name}
          {orgDetails.authorObject?.favorite ? ' 🤍' : ''}
        </h5>
        Author Email: <a href={`mailto:${orgDetails.authorObject?.email}`}>{orgDetails.authorObject?.email}</a>
        <p>{orgDetails.description || ''}</p>
        <hr />
        <p>{orgDetails.sale ? `🏷️ Sale $${orgDetails.price}` : `$${orgDetails.price}`}</p>
      </div>
    </div>
  );
}

ViewBook.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
