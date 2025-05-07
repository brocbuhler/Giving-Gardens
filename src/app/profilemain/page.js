'use client';

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-array-index-key */

import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';
import { firebaseConfig } from '@/utils/client';
import Loading from '@/components/Loading';
import UpdateUserData from '@/api/userData';
import Link from 'next/link';
import SubCard from '@/components/subCard';
import { deleteOrg } from '../../api/orgData';

const endpoint = firebaseConfig.databaseURL;

export default function UserComponent() {
  const [userProfile, setUserProfile] = useState({});
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [userOrganizations, setUserOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscriptions');
  const { user, userLoading } = useAuth();

  const colors = {
    primary: '#5cb85c',
    secondary: '#f8f9fa',
    accent: '#8bc34a',
    text: '#333333',
  };

  const getAllUserSubscriptions = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(`${endpoint}api/organization/subscriptions/user/${user.uid}`);
      const data = await response.json();

      if (data) {
        const subscriptionsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUserSubscriptions(subscriptionsArray);
      } else {
        setUserSubscriptions([]);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setUserSubscriptions([]);
    }
  }, [user]);

  const getAllUserOrganizations = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(`${endpoint}api/organization/user/${user.uid}`);
      console.log(`is response okay?`, response);
      const data = await response.json();

      if (data) {
        const orgsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUserOrganizations(orgsArray);
      } else {
        setUserOrganizations([]);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setUserOrganizations([]);
    }
  }, [user]);

  const handleSubscriptionUpdate = () => {
    getAllUserSubscriptions();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const response = await fetch(`${endpoint}api/user/${user.uid}`);
        const userData = await response.json();

        if (userData) {
          setUserProfile(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && !userLoading) {
      if (typeof window !== 'undefined') {
        UpdateUserData({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }
      fetchUserData();
      getAllUserSubscriptions();
      getAllUserOrganizations();
    } else if (!userLoading) {
      setIsLoading(false);
    }
  }, [user, userLoading, getAllUserSubscriptions, getAllUserOrganizations]);

  if (userLoading || isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  const deleteOrganization = (delOrg) => {
    console.log('this is the org I want to delete', delOrg);
    deleteOrg(delOrg.id);
    setUserOrganizations((prevOrganizations) => prevOrganizations.filter((org) => org.id !== delOrg.id));
  };
  console.log(userOrganizations);
  return (
    <div className="profile-page">
      <Container className="py-5">
        <Row>
          {/* Profile Sidebar */}
          <Col lg={4} className="mb-4">
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="p-4 text-white" style={{ backgroundImage: 'linear-gradient(135deg, #5cb85c 0%, #8bc34a 100%)' }}>
                <div className="text-center mb-3">
                  <img src={user.photoURL || '/placeholder-avatar.png'} alt={user.displayName} className="rounded-circle border-3 border-white" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                </div>
                <h3 className="text-center mb-1">{user.displayName}</h3>
                <p className="text-center text-white-50 mb-0">{user.email}</p>
              </div>
              <Card.Body>
                <div className="mb-4">
                  <h5 className="mb-3">Account Information</h5>
                  <p className="mb-2">
                    <strong>Member Since: </strong>
                    {userProfile.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Not available'}
                  </p>
                  <p className="mb-2">
                    <strong>Last Login: </strong>
                    {userProfile.lastLogin ? new Date(userProfile.lastLogin).toLocaleDateString() : 'Not available'}
                  </p>
                </div>

                <div className="d-grid gap-2">
                  <Link href="/org/new" passHref>
                    <Button variant="primary" className="w-100">
                      Create Organization
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>

            {/* Stats Card */}
            <Card className="border-0 shadow-sm mt-4">
              <Card.Body>
                <h5 className="mb-3">Your Impact</h5>
                <Row>
                  <Col xs={6} className="text-center mb-3">
                    <h2 className="mb-1">{userSubscriptions.length}</h2>
                    <p className="text-muted mb-0">Subscriptions</p>
                  </Col>
                  <Col xs={6} className="text-center mb-3">
                    <h2 className="mb-1">{userOrganizations.length}</h2>
                    <p className="text-muted mb-0">Organizations</p>
                  </Col>
                  <Col xs={12} className="text-center">
                    <h2 className="mb-1">${userSubscriptions.reduce((total, sub) => total + (parseFloat(sub.paymentAmount) || 0), 0).toFixed(2)}</h2>
                    <p className="text-muted mb-0">Total Donated</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col lg={8}>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4" fill>
              <Tab eventKey="subscriptions" title="Your Subscriptions">
                <h3 className="mb-4">Subscriptions</h3>
                {userSubscriptions.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center p-5">
                      <div className="mb-3">
                        <span style={{ fontSize: '4rem' }}>🔍</span>
                      </div>
                      <h4 className="mb-3">No Subscriptions Yet</h4>
                      <p className="text-muted mb-4">You haven't subscribed to any organizations yet. Start supporting causes you care about!</p>
                      <Link href="/" passHref>
                        <Button variant="primary" style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>
                          Explore Organizations
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row>
                    {userSubscriptions.map((subscription) => (
                      <Col key={subscription.id} md={6} className="mb-4">
                        <SubCard subObj={subscription} onUpdate={handleSubscriptionUpdate} />
                      </Col>
                    ))}
                  </Row>
                )}
              </Tab>
              <Tab eventKey="organizations" title="Your Organizations">
                <h3 className="mb-4">Your Organizations</h3>
                {userOrganizations.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center p-5">
                      <div className="mb-3">
                        <span style={{ fontSize: '4rem' }}>🏢</span>
                      </div>
                      <h4 className="mb-3">No Organizations Yet</h4>
                      <p className="text-muted mb-4">You haven't created any organizations yet. Start one today!</p>
                      <Link href="/org/new" passHref>
                        <Button variant="primary" style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>
                          Create Organization
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row>
                    {userOrganizations.map((org) => (
                      <Col key={org.id} md={6} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm overflow-hidden">
                          <Card.Img variant="top" src={org.image || '/placeholder-image.png'} alt={org.title} style={{ height: '140px', objectFit: 'cover' }} />
                          <Card.Body>
                            <Card.Title>{org.title}</Card.Title>
                            <Card.Text className="small text-muted">Created: {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'N/A'}</Card.Text>
                            <div className="d-flex gap-2 mt-3">
                              <Link href={`/org/${org.id}`} passHref style={{ flex: 1 }}>
                                <Button variant="primary" className="w-100" style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>
                                  View
                                </Button>
                              </Link>
                              <Link href={`/org/edit/${org.id}`} passHref style={{ flex: 1 }}>
                                <Button variant="outline-secondary" className="w-100">
                                  Edit
                                </Button>
                              </Link>
                              <Button variant="outline-danger" onClick={() => deleteOrganization(org)} className="w-100">
                                Delete
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Tab>
              <Tab eventKey="activity" title="Recent Activity">
                <h3 className="mb-4">Activity History</h3>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-0">
                    <div className="activity-timeline">
                      {userSubscriptions.length === 0 && userOrganizations.length === 0 ? (
                        <div className="text-center p-5">
                          <div className="mb-3">
                            <span style={{ fontSize: '4rem' }}>📊</span>
                          </div>
                          <h4 className="mb-3">No Activity Yet</h4>
                          <p className="text-muted mb-0">Your recent activities will appear here once you start supporting or creating organizations.</p>
                        </div>
                      ) : (
                        <ul className="list-unstyled mb-0">
                          {[...userSubscriptions]
                            .sort((a, b) => new Date(b.subscribed_at || 0) - new Date(a.subscribed_at || 0))
                            .slice(0, 5)
                            .map((sub, idx) => (
                              <li key={idx} className="p-3 border-bottom">
                                <div className="d-flex align-items-center">
                                  <div
                                    className="me-3 rounded-circle text-white d-flex align-items-center justify-content-center"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      backgroundColor: '#5cb85c',
                                    }}
                                  >
                                    💰
                                  </div>
                                  <div>
                                    <p className="mb-0">
                                      You donated <strong>${sub.paymentAmount}</strong> to
                                      <strong> {sub.organizationName || 'an organization'}</strong>
                                    </p>
                                    <small className="text-muted">{sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleString() : 'Recently'}</small>
                                  </div>
                                </div>
                              </li>
                            ))}
                          {[...userOrganizations]
                            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                            .slice(0, 5)
                            .map((org, idx) => (
                              <li key={idx} className="p-3 border-bottom">
                                <div className="d-flex align-items-center">
                                  <div
                                    className="me-3 rounded-circle text-white d-flex align-items-center justify-content-center"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      backgroundColor: '#8bc34a',
                                    }}
                                  >
                                    🏢
                                  </div>
                                  <div>
                                    <p className="mb-0">
                                      You created the organization <strong>{org.title}</strong>
                                    </p>
                                    <small className="text-muted">{org.createdAt ? new Date(org.createdAt).toLocaleString() : 'Recently'}</small>
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Col>
        </Row>
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
