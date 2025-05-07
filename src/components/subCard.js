'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deleteSub } from '@/api/subData';
import { Badge } from 'react-bootstrap';

function SubCard({ subObj, onUpdate }) {
  // Theme colors
  const colors = {
    primary: '#5cb85c', // Light green
    secondary: '#f8f9fa',
    accent: '#8bc34a',
    text: '#333333',
  };

  const deleteThisSub = () => {
    if (window.confirm(`Cancel this subscription?`)) {
      deleteSub(subObj.id).then(() => onUpdate());
    }
  };

  // Format date
  const formattedDate = subObj.subscribed_at ? new Date(subObj.subscribed_at).toLocaleDateString() : 'N/A';

  return (
    <Card className="h-100 border-0 shadow-sm">
      <div className="position-relative">
        <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 1 }}>
          <Badge bg="light" text="dark" className="py-2 px-3 shadow-sm">
            ${subObj.paymentAmount}
            <span className="ms-1 small text-muted">/{subObj.payFrequency || 'month'}</span>
          </Badge>
        </div>
      </div>
      <Card.Body>
        <Card.Title className="mb-1">
          {subObj.organizationId ? (
            subObj.organizationId
          ) : (
            <>
              Subscribed <span style={{ color: 'green' }}>✔️</span>
            </>
          )}
        </Card.Title>
        <Card.Text className="text-muted small mb-3">
          <i className="bi bi-calendar me-1" /> Started: {formattedDate}
        </Card.Text>
        <Card.Text>{subObj.description || 'You are supporting this organization with a recurring donation.'}</Card.Text>
        <div className="d-flex gap-2 mt-3">
          <Link href={`/org/${subObj.organizationId}`} passHref style={{ flex: 3 }}>
            <Button
              variant="primary"
              className="w-100"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              }}
            >
              View Organization
            </Button>
          </Link>
          <Link href={`/sub/edit/${subObj.id}`} passHref style={{ flex: 1 }}>
            <Button variant="outline-secondary" className="w-100">
              Edit
            </Button>
          </Link>
          <Button variant="outline-danger" onClick={deleteThisSub} style={{ flex: 1 }}>
            Cancel
          </Button>
        </div>
      </Card.Body>
      <Card.Footer className="bg-white border-0 text-center text-muted py-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <small>Using {subObj.paymentType || 'to pay'}</small>
      </Card.Footer>
    </Card>
  );
}

SubCard.propTypes = {
  subObj: PropTypes.shape({
    organizationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    organizationName: PropTypes.string,
    imageUrl: PropTypes.string,
    paymentType: PropTypes.string,
    paymentAmount: PropTypes.string,
    subscribed_at: PropTypes.string,
    nextPaymentDate: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.string,
    payFrequency: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default SubCard;
