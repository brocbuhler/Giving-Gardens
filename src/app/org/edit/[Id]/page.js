'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSingleOrg } from '../../../../api/orgData';
import OrgForm from '../../../../components/forms/orgForm';

export default function EditOrg({ params }) {
  const [editItem, setEditItem] = useState({});
  const { Id } = params;
  useEffect(() => {
    if (Id) {
      getSingleOrg(Id).then(setEditItem);
    }
  }, [Id]);
  console.warn(`This is the stuff: ${editItem}`);
  return <OrgForm obj={editItem} />;
}

EditOrg.propTypes = {
  params: PropTypes.shape({
    Id: PropTypes.string.isRequired,
  }).isRequired,
};
