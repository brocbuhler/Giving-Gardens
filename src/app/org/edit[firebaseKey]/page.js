'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSingleOrg } from '@/api/orgData';
import OrgForm from '@/components/forms/orgForm';

export default function EditBook({ params }) {
  const [editItem, setEditItem] = useState({});
  // TODO: grab the firebasekey
  const { firebaseKey } = params;

  // TODO: make a call to the API to get the book data
  useEffect(() => {
    getSingleOrg(firebaseKey).then(setEditItem);
  }, [firebaseKey]);

  // TODO: pass object to form
  return <OrgForm obj={editItem} />;
}

EditBook.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
