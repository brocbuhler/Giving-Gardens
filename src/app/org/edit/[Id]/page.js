'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSingleOrg } from '../../../../api/orgData';
import OrgForm from '../../../../components/forms/orgForm';

export default function EditOrg({ params }) {
  const [editItem, setEditItem] = useState({});
  const { id } = params;
  useEffect(() => {
    if (id) {
      getSingleOrg(id).then(setEditItem);
    }
  }, [id]);
  console.warn(`This is the stuff: ${editItem}`);
  return <OrgForm obj={editItem} />;
}

EditOrg.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
