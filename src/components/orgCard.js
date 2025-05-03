'use client';

import React from 'react';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { deleteOrg } from '@/api/orgData';
import { useAuth } from '@/utils/context/authContext';

export default function OrgCard({ orgObj, onUpdate }) {
  const { user } = useAuth();
  const isCreator = user.uid === orgObj.uid;

  const deleteThisOrg = () => {
    if (window.confirm(`Delete ${orgObj.title}?`)) {
      deleteOrg(orgObj.id).then(() => onUpdate());
    }
  };

  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden org-card">
      <div style={{ height: '180px', overflow: 'hidden' }}>
        <Card.Img variant="top" src={orgObj.image || '/placeholder-image.png'} className="org-image" />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-2">{orgObj.title}</Card.Title>
        <Card.Text className="text-muted small mb-2">{orgObj.email}</Card.Text>
        <Card.Text className="flex-grow-1">
          {orgObj.description?.substring(0, 100)}
          {orgObj.description?.length > 100 ? '...' : ''}
        </Card.Text>
        <div className="mt-auto pt-3">
          <Link href={`/org/${orgObj.id}`} passHref>
            <Button variant="primary" className="w-100 mb-2">
              View Details
            </Button>
          </Link>
          {isCreator && (
            <div className="d-flex gap-2">
              <Link href={`/org/edit/${orgObj.id}`} passHref style={{ flex: 1 }}>
                <Button variant="outline-secondary" className="w-100">
                  Edit
                </Button>
              </Link>
              <Button variant="outline-danger" onClick={deleteThisOrg} style={{ flex: 1 }}>
                Delete
              </Button>
            </div>
          )}
        </div>
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
    id: PropTypes.string,
    uid: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
