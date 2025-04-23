/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unknown-property */
import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { signIn } from '../utils/auth';

function Signin() {
  const colors = {
    primary: '#5cb85c',
    secondary: '#f8f9fa',
    accent: '#8bc34a',
    text: '#333333',
  };

  return (
    <div className="splash-page">
      {/* Hero Section */}
      <div
        className="hero-section text-white d-flex align-items-center"
        style={{
          backgroundColor: colors.primary,
          minHeight: '60vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={7} className="py-5">
              <h1 className="display-4 fw-bold mb-4">Welcome to Giving Gardens</h1>
              <p className="lead mb-4">Grow your impact by connecting with organizations making a difference. Our platform makes it easy to discover, support, and track the growth of your contributions.</p>
              <Button
                size="lg"
                onClick={signIn}
                style={{
                  backgroundColor: '#fff',
                  color: colors.primary,
                  border: 'none',
                  padding: '12px 28px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                Get Started
              </Button>
            </Col>
            <Col md={5} className="d-none d-md-block">
              <div className="hero-image p-4">
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <p className="text-center">Donation Illustration Placeholder</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5" style={{ color: colors.text }}>
          How It Works
        </h2>
        <Row>
          {[
            {
              title: 'Discover Organizations',
              description: 'Browse through verified organizations working on causes you care about.',
              icon: '🔍',
            },
            {
              title: 'Make an Impact',
              description: 'Donate directly to projects and organizations that inspire you.',
              icon: '❤️',
            },
            {
              title: 'Track Your Giving',
              description: 'Follow your impact and stay connected with the organizations you support.',
              icon: '📊',
            },
          ].map((feature, idx) => (
            <Col key={idx} md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="display-4 mb-3">{feature.icon}</div>
                  <Card.Title className="mb-3">{feature.title}</Card.Title>
                  <Card.Text>{feature.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Organizations Preview */}
      <div style={{ backgroundColor: colors.secondary }} className="py-5">
        <Container>
          <h2 className="text-center mb-4" style={{ color: colors.text }}>
            Featured Organizations
          </h2>
          <p className="text-center mb-5">Join thousands of donors supporting these amazing organizations.</p>
          <Row className="justify-content-center">
            {[1, 2, 3].map((org) => (
              <Col key={org} md={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div
                      className="mb-3 mx-auto"
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Org {org}
                    </div>
                    <Card.Title>Organization {org}</Card.Title>
                    <Card.Text>A brief description of the organization and their mission.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button variant="outline-primary" size="lg" onClick={signIn} style={{ borderColor: colors.primary, color: colors.primary }}>
              Sign In to Explore All Organizations
            </Button>
          </div>
        </Container>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: colors.text }} className="text-white py-4">
        <Container className="text-center">
          <p className="mb-0">© 2025 Giving Gardens. All rights reserved.</p>
        </Container>
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        .splash-page .btn-primary {
          background-color: ${colors.primary};
          border-color: ${colors.primary};
        }
        .splash-page .btn-primary:hover {
          background-color: ${colors.accent};
          border-color: ${colors.accent};
        }
      `}</style>
    </div>
  );
}

export default Signin;
