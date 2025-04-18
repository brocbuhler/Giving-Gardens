'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSingleOrg } from '../../../../api/orgData';
import OrgForm from '../../../../components/forms/orgForm';

export default function EditOrg({ params }) {
  const [editItem, setEditItem] = useState({});
  // TODO: grab the firebasekey
  const { firebaseKey } = params;
  // TODO: make a call to the API to get the Auth data
  useEffect(() => {
    if (firebaseKey) {
      getSingleOrg(firebaseKey).then(setEditItem);
    }
  }, [firebaseKey]);
  console.warn(`This is the stuff: ${editItem}`);
  // TODO: pass object to form
  return <OrgForm obj={editItem} />;
}

EditOrg.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string.isRequired,
  }).isRequired,
};
