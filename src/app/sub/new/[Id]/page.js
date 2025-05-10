import React from 'react';
import SubForm from '@/components/forms/subForm';
import PropTypes from 'prop-types';

export default function AddSub({ params }) {
  const { Id } = params;
  return <SubForm params={{ orgId: Id }} />;
}

AddSub.propTypes = {
  params: PropTypes.shape({
    Id: PropTypes.string.isRequired,
  }).isRequired,
};
