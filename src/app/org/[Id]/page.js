'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { viewOrgDetails } from '@/api/mergedData';
import Link from 'next/link';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import SubCard from '@/components/subCard';
import { useAuth } from '@/utils/context/authContext';

export default function ViewOrg({ params }) {
  const [orgDetails, setOrgDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const { Id } = params;
  const { user } = useAuth();

  const viewOrgSubs = () => {
    viewOrgDetails(Id)
      .then((data) => {
        console.log('Fetched organization details:', data);
        setOrgDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching organization details:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    viewOrgSubs();
  }, [Id]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading organization details...</p>
      </Container>
    );
  }

  return (
    <div className="org-details-page">
      <Container className="py-5">
        <Link href="/orgmain" className="text-decoration-none mb-4 d-inline-block">
          <span className="text-primary">
            <i className="bi bi-arrow-left" /> Back to Organizations
          </span>
        </Link>

        <Card className="border-0 shadow-sm overflow-hidden">
          <Row className="g-0">
            <Col md={4}>
              <div className="position-relative h-100">
                <img src={orgDetails.image || '/placeholder-image.png'} alt={orgDetails.title || 'Organization'} className="w-100 h-100" style={{ objectFit: 'cover' }} />
              </div>
            </Col>
            <Col md={8}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h1 className="mb-2">{orgDetails.title}</h1>
                    <p className="text-muted">
                      <i className="bi bi-envelope me-2" />
                      {orgDetails.website}
                    </p>
                    <p className="text-muted">
                      <i className="bi bi-envelope me-2" />
                      {orgDetails.email}
                    </p>
                  </div>
                </div>

                <hr className="my-4" />

                <h4 className="mb-3">About This Organization</h4>
                <p className="lead">{orgDetails.description}</p>

                {orgDetails.mission && (
                  <>
                    <h4 className="mb-3 mt-4">Our Mission</h4>
                    <p>{orgDetails.mission}</p>
                  </>
                )}

                {orgDetails.impact && (
                  <>
                    <h4 className="mb-3 mt-4">Our Impact</h4>
                    <p>{orgDetails.impact}</p>
                  </>
                )}

                <div className="mt-4">
                  <Button variant="primary" className="me-2" as={Link} href={`/sub/edit/${Id}`}>
                    Support
                  </Button>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>

        {/* Subscriptions Section from main branch */}
        <div className="mt-5">
          <h3 className="mb-4">Current Subscribers</h3>
          <div className="d-flex flex-wrap">{Array.isArray(orgDetails.subscriptions) && orgDetails.subscriptions.filter((sub) => sub.userId === user.uid).length > 0 ? orgDetails.subscriptions.filter((sub) => sub.userId === user.uid).map((sub) => <SubCard key={sub.Id} subObj={sub} onUpdate={viewOrgSubs} />) : <p>No subscriptions for this user</p>}</div>
        </div>

        {orgDetails.projects && orgDetails.projects.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-4">Current Projects</h3>
            <Row>
              {orgDetails.projects.map((project) => (
                <Col key={project.id} md={4} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body>
                      <h5>{project.name}</h5>
                      <p>{project.description}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>

      {/* Footer */}
      <footer className="text-white py-4">
        <Container className="text-center">
          <p className="mb-0">© 2025 Giving Gardens. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

ViewOrg.propTypes = {
  params: PropTypes.shape({
    Id: PropTypes.string.isRequired,
  }).isRequired,
};
