'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deleteSub } from '../api/subData';

function SubCard({ subObj, onUpdate }) {
  const deleteThisSub = () => {
    if (window.confirm(`Delete ${subObj.organizationId}?`)) {
      deleteSub(subObj.firebaseKey).then(() => onUpdate());
    }
  };

  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Img variant="top" src={subObj.organizationId} alt={subObj.organizationId} style={{ height: '400px' }} />
      <Card.Body>
        <Card.Title>{subObj.paymentAmount}</Card.Title>
        <p className="card-text bold">
          {subObj.paymentType} ${subObj.subscribed_at}
        </p>
        <Link href={`/author/${subObj.firebaseKey}`} passHref>
          <Button variant="primary" className="m-2">
            VIEW
          </Button>
        </Link>
        <Link href={`/author/edit/${subObj.firebaseKey}`} passHref>
          <Button variant="info">EDIT</Button>
        </Link>
        <Button variant="danger" onClick={deleteThisSub} className="m-2">
          DELETE
        </Button>
      </Card.Body>
    </Card>
  );
}

SubCard.propTypes = {
  subObj: PropTypes.shape({
    organizationId: PropTypes.string,
    paymentType: PropTypes.string,
    paymentAmount: PropTypes.string,
    subscribed_at: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default SubCard;
