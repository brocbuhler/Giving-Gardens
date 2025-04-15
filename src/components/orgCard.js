'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deleteOrg } from '../api/orgData';

function OrgCard({ orgObj, onUpdate }) {
  const deleteThisOrg = () => {
    if (window.confirm(`Delete ${orgObj.title}?`)) {
      deleteOrg(orgObj.firebaseKey).then(() => onUpdate());
    }
  };

  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Img variant="top" src={orgObj.image} alt={orgObj.title} style={{ height: '400px' }} />
      <Card.Body>
        <Card.Title>{orgObj.title}</Card.Title>
        <p className="card-text bold">
          {orgObj.email} ${orgObj.description}
        </p>
        {/* DYNAMIC LINK TO VIEW THE BOOK DETAILS  */}
        <Link href={`/org/${orgObj.firebaseKey}`} passHref>
          <Button variant="primary" className="m-2">
            VIEW
          </Button>
        </Link>
        {/* DYNAMIC LINK TO EDIT THE BOOK DETAILS  */}
        <Link href={`/org/edit/${orgObj.firebaseKey}`} passHref>
          <Button variant="info">EDIT</Button>
        </Link>
        <Button variant="danger" onClick={deleteThisOrg} className="m-2">
          DELETE
        </Button>
      </Card.Body>
    </Card>
  );
}

OrgCard.propTypes = {
  orgObj: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    email: PropTypes.string,
    description: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default OrgCard;
