'use client';

import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { deleteOrg } from '../api/orgData';

export default function OrgCard({ orgObj, onUpdate }) {
  const deleteThisOrg = () => {
    if (window.confirm(`Delete ${orgObj.title}?`)) {
      console.log(orgObj.firebaseKey);
      deleteOrg(orgObj.firebaseKey).then(() => onUpdate());
    }
  };
  console.warn(orgObj);
  // make edit and delete features only accessable by admin or orgs creator
  console.warn(orgObj.firebaseKey);
  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Body>
        <Card.Title>{orgObj.title}</Card.Title>
        <Card.Img src={orgObj.image} />
        <p className="card-text bold">{orgObj.email}</p>
        <Link href={`/org/${orgObj.firebaseKey}`} passHref>
          <Button variant="primary" className="m-2">
            Landing page
          </Button>
        </Link>
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
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    email: PropTypes.string,
    firebaseKey: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
