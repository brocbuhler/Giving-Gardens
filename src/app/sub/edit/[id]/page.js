'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSingleSub } from '@/api/subData';
import SubForm from '@/components/forms/subForm';

export default function EditSub({ params }) {
  const [editItem, setEditItem] = useState({});
  const { firebaseKey } = params;
  useEffect(() => {
    if (firebaseKey) {
      getSingleSub(firebaseKey).then(setEditItem);
    }
  }, [firebaseKey]);
  console.warn(`This is the stuff: ${editItem}`);
  return <SubForm obj={editItem} />;
}

EditSub.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string.isRequired,
  }).isRequired,
};
