/* eslint-disable react/no-array-index-key */

'use client';

import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';
import { getEveryOrg } from '@/api/orgData';
import Link from 'next/link';

function Home() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    primary: '#5cb85c',
    secondary: '#f8f9fa',
    accent: '#8bc34a',
    text: '#333333',
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await getEveryOrg();
        setOrganizations(orgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const recentOrganizations = [...organizations].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 6);

  console.log(`this should be correct:`, organizations);

  return (
    <div className="home-page">
      {/* Welcome Section */}
      <div className="py-4" style={{ backgroundColor: colors.secondary }}>
        <Container>
          <Row className="align-items-center">
            <h1>Welcome, {user.displayName}!</h1>
            <p className="lead">Discover and cultivate your garden of giving. Support organizations and watch your impact grow.</p>
          </Row>
        </Container>
      </div>

      {/* Featured Organizations Carousel */}
      <Container className="py-5">
        <h2 className="mb-4">Recently Added Organizations</h2>

        {loading && <p>Loading featured organizations...</p>}

        {!loading && recentOrganizations.length === 0 && <p>No organizations found. Be the first to create one!</p>}

        {!loading && recentOrganizations.length > 0 && (
          <Carousel indicators={false} className="org-carousel mb-5" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '20px' }}>
            {Array.from({ length: Math.ceil(recentOrganizations.length / 3) }).map((_, idx) => (
              <Carousel.Item key={idx}>
                <Row>
                  {recentOrganizations.slice(idx * 3, idx * 3 + 3).map((org) => (
                    <Col md={4} key={org.Id}>
                      <Card className="h-100 border-0 shadow-sm">
                        <Card.Img variant="top" src={org.image || '/placeholder-image.png'} style={{ height: '200px', objectFit: 'cover' }} />
                        <Card.Body>
                          <Card.Title>{org.title}</Card.Title>
                          <Card.Text>
                            {org.description?.substring(0, 100)}
                            {org.description?.length > 100 ? '...' : ''}
                          </Card.Text>
                          <Link href={`/org/${org.Id}`} passHref>
                            <Button variant="outline-primary" style={{ borderColor: colors.primary, color: colors.primary }}>
                              Learn More
                            </Button>
                          </Link>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </Container>

      {/* Footer */}
      <footer style={{ backgroundColor: colors.text }} className="text-white py-4 mt-5">
        <Container className="text-center">
          <p className="mb-0">© 2025 Giving Gardens. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

export default Home;
