'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deleteSingleSub } from '../api/subData';

function SubCard({ subObj, onUpdate }) {
  // FOR DELETE, WE NEED TO REMOVE THE AUTHOR AND HAVE THE VIEW RERENDER,
  // SO WE PASS THE FUNCTION FROM THE PARENT THAT GETS THE AUTHORS
  const deleteThisSub = () => {
    if (window.confirm(`Delete ${subObj.organizationId}?`)) {
      deleteSingleSub(subObj.firebaseKey).then(() => onUpdate());
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
        {/* DYNAMIC LINK TO VIEW THE AUTHOR DETAILS  */}
        <Link href={`/author/${subObj.firebaseKey}`} passHref>
          <Button variant="primary" className="m-2">
            VIEW
          </Button>
        </Link>
        {/* DYNAMIC LINK TO EDIT THE AUTHOR DETAILS  */}
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
