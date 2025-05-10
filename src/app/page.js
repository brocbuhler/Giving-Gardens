'use client';

/* eslint-disable react/no-array-index-key */

import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Carousel, Badge } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';
import { getEveryOrg } from '@/api/orgData';
import Link from 'next/link';

function Home() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonated: 0,
    activeSubscriptions: 0,
    organizationsSupported: 0,
  });

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await getEveryOrg();
        setOrganizations(orgs);

        // Simulate stats (in a real app, these would come from your API)
        setStats({
          totalDonated: Math.floor(Math.random() * 10000) + 5000,
          activeSubscriptions: Math.floor(Math.random() * 500) + 1,
          organizationsSupported: Math.min(orgs.length, Math.floor(Math.random() * 30) + 1),
        });
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  // Get recent organizations
  const recentOrganizations = [...organizations].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 6);

  // Generate recommended organizations (in a real app, this would use actual recommendation algorithm)
  const recommendedOrganizations = [...organizations].sort(() => 0.5 - Math.random()).slice(0, Math.min(3, organizations.length));

  const categories = [
    { name: 'Environment', icon: '🌱', color: '#e8f5e9' },
    { name: 'Education', icon: '📚', color: '#e3f2fd' },
    { name: 'Health', icon: '❤️', color: '#fce4ec' },
    { name: 'Animals', icon: '🐾', color: '#fff3e0' },
    { name: 'Arts', icon: '🎨', color: '#f3e5f5' },
    { name: 'Community', icon: '🏘️', color: '#e0f2f1' },
  ];

  return (
    <div className="home-page">
      {/* Hero Welcome Section */}
      <div className="home-hero">
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={7}>
              <div className="mb-4">
                <h1 className="display-4 fw-bold mb-3">Welcome, {user.displayName}!</h1>
                <p className="lead">Discover and cultivate your garden of giving. Support organizations and watch your impact grow.</p>
              </div>

              <div className="user-impact-stats">
                <Row className="g-3">
                  <Col md={4}>
                    <div className="impact-stat-card">
                      <div className="impact-stat-value">${stats.totalDonated}</div>
                      <div className="impact-stat-label">Total Donated</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="impact-stat-card">
                      <div className="impact-stat-value">{stats.activeSubscriptions}</div>
                      <div className="impact-stat-label">Active Subscriptions</div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="impact-stat-card">
                      <div className="impact-stat-value">{stats.organizationsSupported}</div>
                      <div className="impact-stat-label">Organizations Supported</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <div className="hero-graphic" />
            </Col>
          </Row>
        </Container>
      </div>

      {/* Recommended for You Section */}
      {!loading && recommendedOrganizations.length > 0 && (
        <div className="recommended-section py-5">
          <Container>
            <h2 className="section-title">Recommended for You</h2>
            <p className="section-subtitle mb-4">Based on your interests and previous activity</p>

            <Row>
              {recommendedOrganizations.map((org, index) => (
                <Col key={org.id} md={4} className="mb-4">
                  <Card className="org-card h-100 border-0 shadow-sm">
                    <div className="position-relative">
                      <Card.Img variant="top" src={org.image || '/placeholder-image.png'} className="org-card-img" />
                      {org.categoryName && (
                        <Badge className="position-absolute category-badge" bg="light" text="dark">
                          {org.categoryName}
                        </Badge>
                      )}
                    </div>
                    <Card.Body>
                      <Card.Title className="org-card-title">{org.title}</Card.Title>
                      <Card.Text className="org-card-description">
                        {org.description?.substring(0, 100)}
                        {org.description?.length > 100 ? '...' : ''}
                      </Card.Text>

                      {/* Simulated progress bar */}
                      <div className="progress-container">
                        <div className="progress-details">
                          <div className="progress-percentage">{65 + index * 10}% Complete</div>
                        </div>
                        <div className="mb-2">
                          <span id={`progress-label-${index}`} className="visually-hidden">
                            Funding progress: {65 + index * 10}% of goal reached
                          </span>
                        </div>
                        <div className="progress" aria-labelledby={`progress-label-${index}`}>
                          <div aria-label="progress" className="progress-bar" style={{ width: `${65 + index * 10}%` }} role="progressbar" aria-valuenow={65 + index * 10} aria-valuemin="0" aria-valuemax="100" />
                        </div>
                        <div className="progress-amounts">
                          <div>
                            <span className="amount-raised">${(3000 + index * 1500).toLocaleString()}</span>
                            <span className="amount-label">Raised</span>
                          </div>
                          <div className="text-end">
                            <span className="amount-goal">${(5000 + index * 1500).toLocaleString()}</span>
                            <span className="amount-label">Goal</span>
                          </div>
                        </div>
                      </div>

                      <Link href={`/org/${org.id}`} passHref>
                        <Button variant="outline-primary" className="w-100 mt-3">
                          View Details
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      )}

      {/* Featured Organizations Carousel */}
      <div className="recent-organizations-section py-5">
        <Container>
          <h2 className="section-title">Recently Added Organizations</h2>
          <p className="section-subtitle mb-4">The newest additions to our growing community</p>

          {loading && <p className="loading-message">Loading featured organizations...</p>}

          {!loading && recentOrganizations.length === 0 && (
            <div className="empty-state-container text-center py-5">
              <div className="empty-state-icon">🌱</div>
              <h4 className="empty-state-title">No organizations found</h4>
              <p className="empty-state-message mb-4">Be the first to create one!</p>
              <Link href="/org/new" passHref>
                <Button variant="primary">Create Organization</Button>
              </Link>
            </div>
          )}

          {!loading && recentOrganizations.length > 0 && (
            <Carousel indicators={false} className="org-carousel mb-4" prevIcon={<span className="carousel-control-icon">‹</span>} nextIcon={<span className="carousel-control-icon">›</span>}>
              {Array.from({ length: Math.ceil(recentOrganizations.length / 3) }).map((_, idx) => (
                <Carousel.Item key={idx}>
                  <Row>
                    {recentOrganizations.slice(idx * 3, idx * 3 + 3).map((org) => (
                      <Col md={4} key={org.id}>
                        <Card className="org-card h-100 border-0 shadow-sm">
                          <div className="position-relative">
                            <Card.Img variant="top" src={org.image || '/placeholder-image.png'} className="org-card-img" />
                            {org.categoryName && (
                              <Badge className="position-absolute category-badge" bg="light" text="dark">
                                {org.categoryName}
                              </Badge>
                            )}
                          </div>
                          <Card.Body>
                            <Card.Title className="org-card-title">{org.title}</Card.Title>
                            <Card.Text className="org-card-description">
                              {org.description?.substring(0, 80)}
                              {org.description?.length > 80 ? '...' : ''}
                            </Card.Text>
                            <Link href={`/org/${org.id}`} passHref>
                              <Button variant="outline-primary" className="w-100 mt-2">
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

          <div className="text-center">
            <Link href="/orgmain" passHref>
              <Button variant="primary">Browse All Organizations</Button>
            </Link>
          </div>
        </Container>
      </div>

      {/* Quick Access Categories */}
      <div className="categories-section py-5">
        <Container>
          <h2 className="section-title">Explore by Category</h2>
          <p className="section-subtitle mb-4">Discover organizations working in areas you care about</p>

          <Row className="g-3">
            {categories.map((category, index) => (
              <Col key={index} xs={6} md={4} lg={2}>
                <Link href={`/orgmain?category=${category.name.toLowerCase()}`} passHref>
                  <div className="category-card">
                    <div className="category-icon" style={{ backgroundColor: category.color }}>
                      {category.icon}
                    </div>
                    <div className="category-name">{category.name}</div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="text-white py-4 mt-4">
        <Container>
          <Row>
            <Col md={6} className="mb-4 mb-md-0">
              <h5 className="footer-heading">Giving Gardens</h5>
              <p className="footer-text">Growing impact through community-powered giving.</p>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <h5 className="footer-heading">Quick Links</h5>
              <ul className="footer-links">
                <li>
                  <Link href="/orgmain">Organizations</Link>
                </li>
                <li>
                  <Link href="/profilemain">My Profile</Link>
                </li>
                <li>
                  <Link href="/org/new">Create Organization</Link>
                </li>
              </ul>
            </Col>
            <Col md={3}>
              <h5 className="footer-heading">Contact</h5>
              <p className="footer-text mb-0">support@givinggardens.org</p>
            </Col>
          </Row>
          <hr className="footer-divider" />
          <div className="footer-bottom">
            <p className="mb-0">© 2025 Giving Gardens. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Home;
