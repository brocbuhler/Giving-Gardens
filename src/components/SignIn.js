/* eslint-disable no-nested-ternary */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { signIn } from '@/utils/auth';
import { getEveryOrg } from '@/api/orgData';

function Signin() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        // Fetch organizations for the Featured Organizations section
        const orgs = await getEveryOrg();

        // Get 3 random organizations or the first 3 if there are fewer than 3
        const featuredOrgs = orgs.length > 3 ? orgs.sort(() => 0.5 - Math.random()).slice(0, 3) : orgs;

        setOrganizations(featuredOrgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div className="splash-page">
      {/* Hero Section */}
      <div className="hero-section text-white d-flex align-items-center">
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="py-5">
              <h1 className="display-4 fw-bold mb-4">Grow Your Impact With Giving Gardens</h1>
              <p className="lead mb-4">Connect with organizations making a difference and track how your contributions create positive change in the world.</p>
              <button className="btn btn-lg hero-button" onClick={signIn} type="button">
                Get Started
              </button>
            </Col>
            <Col md={5} className="d-none d-md-block">
              <div className="hero-image p-4">
                <div className="hero-image-container">
                  <img src="https://img.pikbest.com/png-images/20241030/a-beuty-big-flower-logo-desing-_11032256.png!sw800" alt="Flower Logo" className="hero-image" />

                  {/* Decorative background circles */}
                  <div className="decorative-circle-1" />
                  <div className="decorative-circle-2" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">How It Works</h2>
        <Row>
          {[
            {
              title: 'Discover Organizations',
              description: 'Browse through verified organizations working on causes you care about.',
              icon: '🔍',
              color: '#e8f5e9',
            },
            {
              title: 'Make an Impact',
              description: 'Donate directly to projects and organizations that inspire you.',
              icon: '❤️',
              color: '#fce4ec',
            },
            {
              title: 'Track Your Giving',
              description: 'Follow your impact and stay connected with the organizations you support.',
              icon: '📊',
              color: '#e3f2fd',
            },
          ].map((feature, idx) => (
            <Col key={idx} md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                    {feature.icon}
                  </div>
                  <Card.Title className="mb-3">{feature.title}</Card.Title>
                  <Card.Text>{feature.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Impact Stats */}
      <div className="py-5 bg-light">
        <Container>
          <Row className="text-center">
            {[
              { value: '120+', label: 'Organizations' },
              { value: '$2.5M+', label: 'Donations Facilitated' },
              { value: '5,000+', label: 'Active Donors' },
            ].map((stat, idx) => (
              <Col key={idx} md={4} className="mb-4">
                <div className="stat-item">
                  <h2 className="stat-value">{stat.value}</h2>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Featured Organizations (Using Real Data) */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Featured Organizations</h2>
        <p className="text-center mb-5">Join thousands of donors supporting these amazing organizations.</p>

        {loading ? (
          <div className="text-center py-4">
            <p>Loading featured organizations...</p>
          </div>
        ) : (
          <Row className="justify-content-center">
            {organizations.length === 0 ? (
              <Col md={8}>
                <Card className="border-0 shadow-sm text-center p-5">
                  <Card.Body className="empty-state-container">
                    <div className="empty-state-icon">🌱</div>
                    <h4 className="mb-3">Be the First to Create an Organization</h4>
                    <p className="mb-4">No organizations have been created yet. Join Giving Gardens and start a new organization!</p>
                    <Button variant="primary" size="lg" onClick={signIn}>
                      Get Started
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              organizations.map((org, index) => (
                <Col key={index} md={4} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm">
                    <div className="org-image-container">
                      {org.image ? <img src={org.image} alt={org.title} className="org-image" /> : <div className="org-image-placeholder">{index === 0 ? '🌱' : index === 1 ? '📚' : '❤️'}</div>}

                      {org.categoryName && <div className="org-category-badge">{org.categoryName}</div>}
                    </div>
                    <Card.Body className="p-4">
                      <Card.Title>{org.title}</Card.Title>
                      <Card.Text className="text-muted">
                        {org.description?.substring(0, 100)}
                        {org.description?.length > 100 ? '...' : ''}
                      </Card.Text>

                      {/* Simulated donation progress */}
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
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}

        <div className="text-center mt-4">
          <Button variant="outline-primary" size="lg" onClick={signIn} className="px-4 py-3 rounded-lg">
            Sign In to Explore All Organizations
          </Button>
        </div>
      </Container>

      {/* Testimonials Section */}
      <div className="py-5 bg-light">
        <Container className="py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold">What Our Users Say</h2>
          </div>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="testimonial-card">
                <Card.Body className="p-4 p-lg-5 text-center">
                  <div className="testimonial-stars">{'⭐'.repeat(5)}</div>
                  <p className="testimonial-text">&quot;Giving Gardens has transformed how I support causes I care about. The platform makes it easy to find organizations doing important work, and I love being able to track my impact over time.&quot;</p>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="testimonial-avatar">👩</div>
                    <div className="text-start">
                      <h5 className="mb-0 fw-bold">Sarah Johnson</h5>
                      <p className="text-muted small mb-0">Monthly donor since 2024</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* CTA Section */}
      <Container className="py-5">
        <Card className="cta-card">
          <Card.Body className="p-4 p-lg-5">
            <h2 className="fw-bold mb-3">Ready to Make a Difference?</h2>
            <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px', opacity: '0.9' }}>
              Join Giving Gardens today and be part of a community committed to creating positive change through thoughtful giving.
            </p>
            <Button size="lg" onClick={signIn} className="cta-button">
              Get Started Now
            </Button>
          </Card.Body>
        </Card>
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

export default Signin;
