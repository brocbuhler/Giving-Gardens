'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSingleSub } from '@/api/subData';
import SubForm from '@/components/forms/subForm';

export default function EditSub({ params }) {
  const [editItem, setEditItem] = useState({});
  const { id } = params;
  useEffect(() => {
    if (id) {
      getSingleSub(id).then(setEditItem);
    }
  }, [id]);

  useEffect(() => {
    console.warn(`This is the stuff: ${editItem}`);
  }, [editItem]);

  return <SubForm obj={editItem} />;
}

EditSub.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
